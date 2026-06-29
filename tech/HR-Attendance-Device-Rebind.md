---
title: HR Attendance — Device Key & Rebind
layout: default
parent: Tài liệu kỹ thuật
nav_order: 5
---

# Device Key & Rebind — chống giả mạo thiết bị chấm công
{: .no_toc }

> Cơ chế khóa thiết bị (device-bound key) cho chấm công PWA và quy trình **rebind**
> (gắn lại khóa) dùng trong giai đoạn chuyển đổi fleet. Đọc cùng
> [HR Attendance — API](HR-Attendance-API.html) và [Architecture](HR-Attendance-Architecture.html).

<details open markdown="block">
<summary>Mục lục</summary>
{: .text-delta }
1. TOC
{:toc}
</details>

---

## 1. Khóa thiết bị (device-bound key)

Mỗi máy đã đăng ký giữ một **cặp khóa ECDSA P-256** sinh ngay trên trình duyệt:

- **Private key**: tạo dạng **non-extractable** (Web Crypto), lưu trong **IndexedDB**.
  Không export ra được → không copy/clone sang máy khác.
- **Public key**: export SPKI → gửi lên server khi đăng ký.
- **`device_id`** = `SHA-256(SPKI public key)` (hex). Đây là **định danh máy ổn định**,
  thay cho việc tin vào `device_fingerprint` (vốn đổi khi nâng cấp trình duyệt).

Mỗi lần chấm công, máy phải **ký một challenge** (nonce dùng-một-lần) bằng private key;
server verify chữ ký bằng public key đã lưu trên `HR Checkin Phone Registration`. Sai
chữ ký → `SIGNATURE_INVALID`, không cho chấm công. Cơ chế này chống **giả mạo thiết bị**
và **replay**.

```
Đăng ký:  máy sinh keypair → gửi public_key → server tính device_id, HR duyệt reg Active
Chấm công: máy xin challenge → ký bằng private key → server verify → cho checkin
```

> Verify chữ ký bật **ngay khi reg đã có `public_key`** (xem `_require_registered_phone`
> tại `api/attendance.py`), độc lập với cờ `enforce_device_signature` (cờ đó dành cho
> chế độ ép cứng kể cả thiết bị legacy chưa có khóa).

## 2. Vì sao cần rebind

Phiên bản client đời đầu có **bug race sinh khóa**: nhiều lời gọi tạo identity chạy
song song khi mở app → máy có thể tạo **nhiều keypair khác nhau** và đẩy lên nhiều bản
đăng ký Draft. HR duyệt **một** trong số đó → reg Active có thể mang **public_key khác**
với private key hiện đang nằm trong IndexedDB của máy.

Hệ quả: máy ký challenge bằng khóa hiện có → server verify bằng khóa đã lưu (khác) →
**`SIGNATURE_INVALID`** → nhân viên không chấm công được, dù **vẫn đúng máy vật lý đó**.

Cách xử lý ngây thơ là bắt nhân viên **đăng ký lại + chờ HR duyệt lại**. Rebind tự động
hoá việc này một cách an toàn: máy **chứng minh đang giữ private key thật** rồi server
gắn lại khóa đó vào reg Active — khỏi phiền HR.

## 3. Cơ chế rebind (challenge–response)

Endpoint: `POST phone_device.rebind_device_key(device_fingerprint, device_id, public_key, signature)`.

Server chỉ rebind khi **qua đủ 3 cổng**:

| # | Cổng | Bảo đảm |
|---|---|---|
| 1 | `SHA-256(public_key) == device_id` | Bộ ba (public_key, device_id) khớp nhau — chống ghép bừa |
| 2 | Chữ ký challenge hợp lệ với public_key | Máy **đang giữ private key** tương ứng (non-extractable → không clone được) |
| 3 | Reg Active đã duyệt **cùng `device_fingerprint`** | Đúng **máy vật lý** HR đã duyệt trước đó |

Đủ 3 cổng → server cập nhật `device_id` + `public_key` của reg Active sang khóa thật của
máy, tăng `rebind_count`, ghi `last_rebind_on`. Không đủ → trả `noop`/`disabled`/`exists`,
không thay đổi gì (máy buộc đi đường đăng ký lại + HR duyệt như thường).

Challenge dùng **namespace theo `purpose`** (`checkin` ↔ `rebind`) để hai luồng — rebind
chạy nền lúc mở app và checkin do người dùng bấm — **không đè nonce của nhau**
(`device_auth._challenge_key`). Nonce một-lần, hết hạn ~2 phút.

```
Client (mở app, phát hiện lệch khóa):
  getDeviceIdentity() → {device_id, public_key}
  getCheckinChallenge(device_id, purpose="rebind")
  signChallenge() → signature
  POST rebind_device_key(fingerprint, device_id, public_key, signature)
Server: cổng 1 → 2 → 3 → cập nhật reg Active → {status: "rebound", rebind_count}
```

## 4. Cờ vòng đời `allow_key_rebind` (HR Policy, per-Company)

Rebind chỉ chạy khi `HR Policy.allow_key_rebind = 1`. Đây là **tiện ích cho giai đoạn
chuyển đổi (migration convenience)**, không phải đường vào thường trực:

- **BẬT** trong lúc fleet đang ổn định khóa (sau khi triển khai cơ chế device-key) → các
  máy mang reg lệch khóa tự lành, không dồn việc duyệt lại lên HR.
- **TẮT** sau khi số ca rebind về gần 0 → **siết về quy trình chuẩn**: từ đó máy nào lệch
  khóa sẽ **đăng ký lại + HR duyệt** như bình thường.

Tắt/bật **không cần redeploy** (chỉ sửa field trên HR Policy), nên cũng là **công tắc dừng
khẩn** nếu cần.

## 5. Auto-heal khi checkin

Có khoảng trống thời gian: rebind chạy nền lúc mở app, nhưng người dùng có thể bấm
**Chấm công ngay** trước khi rebind xong. Client xử lý bằng `postSignedCheckinWithHeal`
(`src/api/attendance.ts`):

```
ký + POST checkin
  └─ nếu trả SIGNATURE_INVALID → rebindDeviceKey() → KÝ LẠI → thử lại đúng MỘT lần
```

Idempotent, im lặng; rebind thất bại cũng không chặn flow (cùng lắm nhân viên đăng ký lại).
Backend báo trạng thái lệch khóa qua `get_attendance_info.device_key_mismatch` để client
chủ động rebind khi load (`useEmployee.ts`).

## 6. Giám sát & sức khỏe khóa

Trên mỗi `HR Checkin Phone Registration`:

| Field | Ý nghĩa |
|---|---|
| `rebind_count` | Số lần khóa bị gắn-lại. Bình thường **0–1** (lành một lần là xong) |
| `last_rebind_on` | Thời điểm rebind gần nhất |

Rebind ghi `logs/attendance_rebind.log` (logger `attendance_rebind`). **`rebind_count ≥ 4`**
ghi mức `warning` — dấu hiệu **IndexedDB của máy không giữ được khóa** (vd iOS evict storage
/ chế độ ẩn danh): mỗi lần mở app sinh khóa mới → rebind lặp lại. Máy như vậy cần xử lý riêng
(persistence của thiết bị hỏng, không thể dựa vào device key) — xem
[Known Issues](HR-Attendance-Known-Issues.html).

> ⚠️ Round-trip CryptoKey non-extractable trên iOS Safari/PWA **chưa kiểm chứng đầy đủ** —
> theo dõi `rebind_count` để phát hiện sớm máy iOS không giữ khóa.

## 7. Schema & triển khai

Các field bổ sung (đều **read-only**, additive — migrate chỉ thêm cột, không sửa data cũ):

- `HR Checkin Phone Registration`: `device_id`, `public_key`, `rebind_count` (default 0),
  `last_rebind_on`.
- `HR Policy`: `allow_key_rebind` (Check, default 1), `enforce_device_signature` (Check).

Triển khai: `bench migrate` (đồng bộ doctype + fixtures, tạo cột) → `bench build` (PWA) →
`bench restart`. Không cần patch backfill. Sau migrate nhớ rà `allow_key_rebind` theo đúng
giai đoạn fleet (mục 4).

## 8. Tham chiếu endpoint

| Endpoint | Vai trò |
|---|---|
| `GET attendance.get_attendance_info` | Trả `device_needs_key`, `device_key_mismatch` để client quyết định nâng khóa / rebind |
| `GET attendance.get_checkin_challenge(device_id, purpose)` | Phát nonce; `purpose ∈ {checkin, rebind}` tách namespace |
| `POST phone_device.register_phone` | Đăng ký mới + dedup Draft pending theo `(employee, device_fingerprint)` |
| `POST phone_device.ensure_device_key` | Nâng khóa tại chỗ cho reg Active legacy **chưa có** public_key |
| `POST phone_device.rebind_device_key` | Gắn lại khóa cho reg Active **đã có** public_key nhưng lệch (mục 3) |
| `POST attendance.checkin` / `checkin_wfh` | Chấm công; verify chữ ký + auto-heal |

## Liên quan
- [HR Attendance — API](HR-Attendance-API.html) §2.2, §3.4, §3.7
- [HR Attendance — Architecture](HR-Attendance-Architecture.html)
- [HR Attendance — Known Issues](HR-Attendance-Known-Issues.html)
