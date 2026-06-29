---
title: Loyalty — API tích hợp 3rd party
layout: default
parent: Tài liệu kỹ thuật
nav_order: 9
---

# COBE Loyalty — Integration Spec cho hệ thống Membership bên thứ 3

Tài liệu mô tả contract HTTP mà hệ thống ERPNext của Cobe Group sẽ gọi tới
hệ thống membership của bên thứ 3, để báo mọi thay đổi điểm thưởng (cộng/trừ)
của khách hàng theo từng công ty.

> Mỗi công ty trong Cobe Group có **2 endpoint 3rd party RIÊNG**: 1 cho
> cộng điểm (`loyalty.points_increased`) và 1 cho trừ điểm
> (`loyalty.points_decreased`). Bên thứ 3 cần chuẩn bị 2 URL ĐẦY ĐỦ + 2
> Bearer token (có thể giống nhau) cho mỗi công ty được tích hợp.

---

## 1. Mô hình tổng quan

- **Source of truth**: ERPNext giữ điểm + rank. Bên thứ 3 là consumer/passive.
- **Pattern**: ERPNext push event qua HTTP POST mỗi khi điểm 1 khách thay đổi.
  Bên thứ 3 nhận và lưu/xử lý theo logic riêng (gửi thông báo, đổi quà,
  dashboard, v.v.).
- **Async**: ERPNext không chờ response thực-thời; event vào queue, scheduler
  flush mỗi ~4 phút, retry tự động nếu fail.
- **Identify khách**: qua `customer.phone` trong payload (đã chuẩn hóa
  `0xxxxxxxxx`). Mỗi customer cũng có `customer.id` duy nhất trong ERPNext.

---

## 2. Endpoint contract

### URL — 2 cái mỗi công ty (cộng + trừ)

Bên thứ 3 cấp 2 URL **ĐẦY ĐỦ** cho mỗi công ty. ERPNext POST thẳng vào URL,
KHÔNG tự ghép path — path tuỳ bên thứ 3 thiết kế.

| Công ty Cobe | URL nhận `points_increased` (cộng điểm) | URL nhận `points_decreased` (trừ điểm) |
|---|---|---|
| COBE A | `https://loyalty.companyA.example.com/api/v1/points/credit` | `https://loyalty.companyA.example.com/api/v1/points/debit` |
| COBE B | `https://loyalty.companyB.example.com/api/credit-points` | `https://loyalty.companyB.example.com/api/debit-points` |
| COBE C | `https://loyalty-c.example.com/inc` | `https://loyalty-c.example.com/dec` |

> 2 URL có thể CÙNG host + khác path (vd COBE A), hoặc HOÀN TOÀN KHÁC host
> (vd COBE C). Tuỳ bên thứ 3.

### Method + Content-Type

```http
POST <URL>
Content-Type: application/json
```

### Authentication

Mỗi URL đi kèm 1 Bearer token (do bên thứ 3 cấp). 2 token có thể giống nhau
hoặc khác nhau.

```http
Authorization: Bearer <token-của-URL-này>
```

Token tùy chọn (có thể trống nếu bên thứ 3 dùng IP allowlist), nhưng
khuyến nghị bắt buộc.

### Routing — event nào đi tới URL nào

| event_type | URL ERPNext sẽ POST tới | Auth token dùng |
|---|---|---|
| `loyalty.points_increased` | URL cộng điểm | Token tương ứng |
| `loyalty.points_decreased` | URL trừ điểm | Token tương ứng |

---

## 3. Request — Headers

| Header | Bắt buộc | Mô tả |
|---|---|---|
| `Content-Type: application/json` | Có | |
| `Idempotency-Key: <UUID>` | **Có** | Khoá idempotent — xem §6. Trùng với field `event_id` trong body. |
| `Authorization: Bearer <token>` | Tuỳ chọn | Khi có token được cấu hình ở Cobe side. |

---

## 4. Request — Body

Body là JSON. Có 2 loại event chia qua field `event_type`:

| `event_type` | Khi nào |
|---|---|
| `loyalty.points_increased` | Khách được cộng điểm: hoàn thành đơn hàng, thưởng giới thiệu, seed VIP, manual add. |
| `loyalty.points_decreased` | Khách bị trừ điểm: hủy/return đơn (compensating), hủy adjustment, manual deduct. |

### 4.1. Mặc định — payload tối thiểu (luôn gửi)

Mặc định Cobe **chỉ gửi field tối thiểu để identify khách + báo điểm/rank
hiện tại**. Các field nhạy cảm hơn (tên/email khách, đơn hàng nội bộ,
doanh số) **không gửi** trừ khi bên thứ 3 yêu cầu và Cobe bật flag (xem §4.3).

```json
{
  "event_type": "loyalty.points_increased",
  "occurred_at": "2026-06-08T10:15:32.123456",
  "customer": {
    "phone": "0902537814"
  },
  "company": "COBE A",
  "delta_points": 250,
  "current_balance": 12750,
  "current_rank": "Gold"
}
```

### 4.2. Field mặc định — bảng tham chiếu

| Field | Type | Mô tả |
|---|---|---|
| `event_type` | string | `loyalty.points_increased` hoặc `loyalty.points_decreased`. |
| `occurred_at` | ISO 8601 datetime | Thời điểm LPE được tạo (lúc event sinh, không phải lúc gửi). |
| `customer.phone` | string \| `null` | SĐT chuẩn hóa `0xxxxxxxxx`. Một số khách có thể chưa có SĐT. |
| `company` | string | Tên công ty trong Cobe Group. Khớp với endpoint mà event này được route tới. |
| `delta_points` | int signed | Điểm thay đổi lần này. Dương khi `increased`, âm khi `decreased`. |
| `current_balance` | int | **Snapshot tuyệt đối** số điểm khả dụng SAU khi LPE này được apply. |
| `current_rank` | string \| `null` | Tier hiện tại của khách trong Loyalty Program này sau khi apply. |

### 4.3. Field tùy chọn — opt-in per-company

Cobe có thể bật thêm các nhóm field dưới đây cho TỪNG company khi bên thứ 3 cần.
Bật/tắt qua `COBE Loyalty Sync Endpoint` (per-company row), không ảnh hưởng
company khác. **Nếu bên thứ 3 cần field nào, gửi yêu cầu cho Cobe IT để bật.**

| Flag (Cobe-side) | Field thêm vào payload | Lý do thường để nhạy cảm |
|---|---|---|
| `include_customer_id` | `customer.id` | ERPNext Customer ID nội bộ (vd `CUST-001`). |
| `include_customer_pii` | `customer.name`, `customer.email` | PII (tên + email khách). |
| `include_loyalty_program` | `loyalty_program`, `loyalty_program_tier` | Tên chương trình + tier tại thời điểm entry. |
| `include_invoice_ref` | `invoice_type`, `invoice` | **Tên đơn hàng nội bộ** (vd `SO-2026-00321`). |
| `include_purchase_amount` | `purchase_amount` | **Doanh số giao dịch** (VND). |
| `include_dates` | `posting_date`, `expiry_date` | Ngày ghi nhận điểm + hạn dùng. |
| `include_reason` | `reason` | **Chi tiết workflow nội bộ** (vd "SO completed (billed 100%) — awarded via SI SI-2026-00500"). |
| `include_local_id` | `event_id_local` | LPE ID nội bộ (vd `LPE-2026-12345`). |

### 4.4. Tham chiếu field tùy chọn

| Field | Type | Mô tả |
|---|---|---|
| `event_id_local` | string | ID Loyalty Point Entry nội bộ ERPNext. Dùng để trace ngược. |
| `customer.id` | string | ERPNext Customer ID. |
| `customer.name` | string \| `null` | Tên khách. |
| `customer.email` | string \| `null` | Email khách. |
| `loyalty_program` | string | Tên Loyalty Program của công ty đó. |
| `loyalty_program_tier` | string \| `null` | Tier mà entry này được ghi. |
| `invoice_type` | string \| `null` | Nguồn entry: `Sales Order`, `Sales Invoice`, `COBE Loyalty Adjustment`. |
| `invoice` | string \| `null` | Tên doc nguồn. |
| `purchase_amount` | number signed | Giá trị giao dịch (VND). Có thể 0 với manual adjustment. Signed cùng dấu với `delta_points`. |
| `posting_date` | ISO date `YYYY-MM-DD` | Ngày ghi nhận điểm. |
| `expiry_date` | ISO date | Ngày hết hạn điểm. |
| `reason` | string \| `null` | Mô tả lý do (free text). Entry compensating có prefix `[REVERSE]`. |

### 4.5. Mẫu payload đầy đủ (tất cả flag bật)

Hiếm dùng — chỉ làm reference khi tất cả flag bật. Production thường gửi ít hơn.

`loyalty.points_increased`:

```json
{
  "event_type": "loyalty.points_increased",
  "event_id_local": "LPE-2026-12345",
  "occurred_at": "2026-06-08T10:15:32.123456",
  "customer": {
    "id": "CUST-001",
    "name": "Nguyễn Văn A",
    "phone": "0902537814",
    "email": "a@example.com"
  },
  "company": "COBE A",
  "loyalty_program": "COBE Loyalty A",
  "loyalty_program_tier": "Gold",
  "delta_points": 250,
  "purchase_amount": 5000000,
  "posting_date": "2026-06-08",
  "expiry_date": "2027-06-08",
  "invoice_type": "Sales Order",
  "invoice": "SO-2026-00321",
  "reason": "SO completed (billed 100%) — awarded via SI SI-2026-00500",
  "current_balance": 12750,
  "current_rank": "Gold"
}
```

`loyalty.points_decreased` (cùng cấu trúc, `delta_points` âm, có thể có prefix `[REVERSE]` trong `reason`):

```json
{
  "event_type": "loyalty.points_decreased",
  "occurred_at": "2026-06-08T11:00:00.000000",
  "customer": { "phone": "0902537814" },
  "company": "COBE A",
  "delta_points": -250,
  "current_balance": 12500,
  "current_rank": "Gold"
}
```

---

## 5. Response — bên thứ 3 PHẢI trả về

| HTTP status | Hành vi của ERPNext |
|---|---|
| **2xx** (200, 201, 202, 204…) | Mark event `Sent`, không gửi lại. |
| **4xx** (bao gồm 409 nếu duplicate) | Mark `Failed`, retry theo backoff. **Khuyến nghị: trả 200/204 cho duplicate** (xem §6). |
| **5xx** | Mark `Failed`, retry theo backoff. |
| Connection error / timeout | Mark `Failed`, retry theo backoff. |

### Response body

Không bắt buộc, ERPNext không parse. Có thể trả gì cũng được. Khuyến nghị:

```json
{ "ok": true, "id": "<reference của 3rd party>" }
```

Khi fail nên trả thêm `error` để log dễ debug:

```json
{ "ok": false, "error": "Customer not found in our system" }
```

---

## 6. Idempotency — REQUIRED ở bên thứ 3

Vì retry, **cùng 1 event có thể đến nhiều lần**. Bên thứ 3 BẮT BUỘC dedupe.

### Cách thực hiện

1. Lưu danh sách `event_id` đã xử lý thành công (dùng table riêng hoặc unique index).
2. Khi nhận request:
   - Đọc header `Idempotency-Key` (= field `event_id` trong body, cùng giá trị).
   - Nếu đã xử lý: **trả về 2xx ngay**, KHÔNG xử lý lại (xem như success).
   - Nếu chưa: xử lý logic, lưu key + commit, trả về 2xx.
3. Nếu lưu key được nhưng logic fail (vd insufficient stock): KHÔNG lưu key, trả 4xx/5xx → ERPNext retry.

### Pseudo-code

```python
def handle(request):
    key = request.headers["Idempotency-Key"]
    if processed_keys.contains(key):
        return 200, {"ok": True, "deduped": True}

    try:
        with transaction():
            apply_loyalty_change(request.body)
            processed_keys.insert(key)
        return 200, {"ok": True}
    except Exception as e:
        return 500, {"ok": False, "error": str(e)}
```

---

## 7. Retry policy (ERPNext side)

Lịch backoff khi fail:

| Lần thử | Khoảng cách từ lần trước |
|---|---|
| 1 → 2 | 1 phút |
| 2 → 3 | 5 phút |
| 3 → 4 | 30 phút |
| 4 → 5 | 2 giờ |
| 5 → 6 | 12 giờ |
| 6+ | 24 giờ |

Số lần retry tối đa mặc định **10**. Sau đó event giữ `Failed` vĩnh viễn,
operator phải manually intervene để re-send.

---

## 8. Cách 3rd party reconstruct state điểm hiện tại

Mỗi event là 1 **delta** + 1 **snapshot** (`current_balance`, `current_rank`).
Khuyến nghị dùng snapshot, không sum delta:

```
KEY      = (customer.phone, company)
LATEST   = event mới nhất với KEY này (sort theo occurred_at DESC)
BALANCE  = LATEST.current_balance
RANK     = LATEST.current_rank
```

Lý do không dùng `SUM(delta_points)`:
- Retry có thể duplicate event (nếu 3rd party không dedupe đúng).
- Khả năng out-of-order delivery rất thấp nhưng không impossible.
- `current_balance` là chân lý ERPNext-side, đã tính đúng.

### Ví dụ sequence

| occurred_at | phone | company | event_type | delta | current_balance |
|---|---|---|---|---|---|
| 2026-06-08T10:00 | 0902537814 | COBE A | increased | +250 | 12750 |
| 2026-06-08T10:30 | 0902537814 | COBE B | increased | +500 | 8500 |
| 2026-06-08T11:00 | 0902537814 | COBE A | decreased | -250 | 12500 |

**State cuối cùng** của phone `0902537814`:

| Company | Points | Rank |
|---|---|---|
| COBE A | 12,500 | (theo `current_rank` của event lúc 11:00) |
| COBE B | 8,500  | (theo `current_rank` của event lúc 10:30) |

> 1 SĐT có thể tương ứng nhiều `customer.id` ở Cobe (vd: 1 SĐT mua ở nhiều
> công ty tạo nhiều Customer record). Mặc định payload chỉ có `customer.phone`
> → dùng `phone` làm primary key. Nếu cần `customer.id` để trace ngược, yêu
> cầu Cobe bật flag `include_customer_id`.

---

## 9. Test với cURL

### 9.1. Test endpoint CỘNG điểm — payload mặc định (minimal)

```bash
curl -X POST 'https://your-3rd-party.example.com/api/v1/points/credit' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: 5f7c8b3a-4e2d-11f0-8b2e-0242ac120002' \
  -H 'Authorization: Bearer YOUR_INCREASE_TOKEN' \
  -d '{
    "event_type": "loyalty.points_increased",
    "occurred_at": "2026-06-08T10:15:32.123456",
    "customer": { "phone": "0902537814" },
    "company": "COBE A",
    "delta_points": 250,
    "current_balance": 12750,
    "current_rank": "Gold"
  }'
```

### 9.2. Test endpoint TRỪ điểm — payload mặc định

```bash
curl -X POST 'https://your-3rd-party.example.com/api/v1/points/debit' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: a1b2c3d4-4e2d-11f0-8b2e-0242ac120002' \
  -H 'Authorization: Bearer YOUR_DECREASE_TOKEN' \
  -d '{
    "event_type": "loyalty.points_decreased",
    "occurred_at": "2026-06-08T11:00:00.000000",
    "customer": { "phone": "0902537814" },
    "company": "COBE A",
    "delta_points": -250,
    "current_balance": 12500,
    "current_rank": "Gold"
  }'
```

### 9.3. Payload đầy đủ (tất cả flag bật)

```bash
curl -X POST 'https://your-3rd-party.example.com/api/v1/points/credit' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: 5f7c8b3a-4e2d-11f0-8b2e-0242ac120002' \
  -H 'Authorization: Bearer YOUR_INCREASE_TOKEN' \
  -d '{
    "event_type": "loyalty.points_increased",
    "event_id_local": "LPE-TEST-0001",
    "occurred_at": "2026-06-08T10:15:32.123456",
    "customer": {
      "id": "CUST-TEST-001",
      "name": "Test Customer",
      "phone": "0902537814",
      "email": "test@example.com"
    },
    "company": "COBE A",
    "loyalty_program": "COBE Loyalty A",
    "loyalty_program_tier": "Gold",
    "delta_points": 250,
    "purchase_amount": 5000000,
    "posting_date": "2026-06-08",
    "expiry_date": "2027-06-08",
    "invoice_type": "Sales Order",
    "invoice": "SO-TEST-0001",
    "reason": "Test event from spec",
    "current_balance": 12750,
    "current_rank": "Gold"
  }'
```

Expected response cho cả 3: `200 OK` với body tuỳ chọn.

Gửi lại CÙNG request lần thứ 2 (same `Idempotency-Key`) → vẫn nên trả `200 OK`,
KHÔNG cộng điểm lần 2.

---

## 10. Checklist tích hợp cho bên thứ 3

- [ ] Cấp **2 URL endpoint riêng cho mỗi công ty** Cobe Group:
      1 URL nhận `loyalty.points_increased` (cộng điểm) + 1 URL nhận
      `loyalty.points_decreased` (trừ điểm). 3 công ty → tổng 6 URL.
- [ ] Cấp **Bearer token** cho mỗi URL (có thể giống nhau giữa cộng/trừ; gửi Cobe để cấu hình).
- [ ] Implement endpoint nhận POST + parse JSON body theo §4.1 (payload mặc định tối thiểu).
- [ ] Verify `Authorization: Bearer <token>` khớp token đã cấp; reject 401 nếu sai.
- [ ] Verify `Content-Type: application/json`; reject 415 nếu sai.
- [ ] **Dedupe theo `Idempotency-Key`** (xem §6). Đây là yêu cầu BẮT BUỘC.
      Lưu ý: cùng `event_id` không xuất hiện trên cả 2 URL — mỗi event chỉ
      route tới 1 URL theo `event_type`.
- [ ] Endpoint cộng điểm CHỈ cần handle `loyalty.points_increased`; endpoint
      trừ điểm CHỈ cần handle `loyalty.points_decreased`. Field `event_type`
      vẫn có trong body để cross-check.
- [ ] Identify khách qua `customer.phone` (chuẩn `0xxxxxxxxx`). SĐT có thể null.
- [ ] Lưu `current_balance` + `current_rank` làm snapshot — dùng cho hiển thị
      điểm hiện tại của khách, không recompute từ `delta_points`.
- [ ] Trả 2xx khi success (kể cả duplicate); 4xx/5xx khi fail tạm thời để ERPNext retry.
- [ ] **Nếu cần thêm field** (customer.id, name/email, invoice ref, purchase_amount,
      dates, reason, local_id): gửi yêu cầu cho Cobe IT kèm danh sách flag cần bật
      (§4.3). Lưu ý lập trình parse các field optional có thể `null`/vắng mặt.
- [ ] Test cả 2 URL với cURL mẫu §9 trước khi go-live.
- [ ] Confirm với Cobe để chuyển sang production endpoint.

---

## 11. Liên hệ

- **Cobe Group IT**: [thêm email/Slack vào đây]
- **Endpoint config ở phía Cobe**: cập nhật trong ERPNext `COBE Loyalty Sync Settings → Endpoints`.

---

*Version 1.1 — last updated 2026-06-08 — split outbound endpoint into separate increase/decrease URLs per company.*
