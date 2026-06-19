---
title: HR Attendance — API Contract
layout: default
parent: Tài liệu kỹ thuật
nav_order: 3
---

# API Contract — Phone-only Architecture

Tài liệu **source of truth** cho contract giữa 2 thành phần (post-pivot, no hardware):
- **PWA** mobile (phone nhân viên)
- **Backend** Frappe

Mọi thay đổi contract phải update file này TRƯỚC khi sửa code.

---

> **Nguyên tắc kiến trúc (Cách B):** UI luôn của hr_for_cobegroup (PWA `/my-workspace`),
> backend ƯU TIÊN gọi HRMS native; chỉ tự code phần mở rộng custom (GPS/selfie/thiết
> bị/office/whitelist/lunch/warning). Xem §9.

## 1. Feature flags (HR Policy — per Company)

Toàn bộ tính năng optional đều có **feature flag** bật/tắt qua doctype `HR Policy`
(1 record / Company, `name = HRP-<company>`). Default off cho tính năng chưa verify.
Cấp phép tự động: KHÔNG còn field `leave_auto_*` — dùng **Earned Leave native** của
HRMS (Leave Type `is_earned_leave`).

| Field | Type | Default | Mô tả |
|---|---|---|---|
| `enable_wfh_mode` | Check | 0 (off) | Bật WFH: hiện ca WFH + **thêm lựa chọn "Làm việc tại nhà (WFH)" trong form Đề xuất** (Attendance Request). Tắt → form Đề xuất chỉ có "Chấm công bù / Công tác" |
| `enable_webrtc_check` | Check | 0 (off) | Bật check WebRTC local IP để defend iOS GPS-spoof. Yêu cầu office wifi subnet đã verify |
| `enable_wifi_bssid_check` | Check | 0 (off) | Bật check Wifi BSSID (Android only). Yêu cầu office wifi BSSID đã enroll |
| `enable_face_match` | Check | 0 (off) | Phase 2: bật server-side face match selfie ↔ HR Employee photo |
| `default_radius_m` | Int | 100 | Bán kính GPS check mặc định nếu Office Location chưa đặt riêng |
| `duplicate_window_seconds` | Int | 60 | Reject checkin trùng < N giây từ checkin gần nhất của cùng employee |

Permissions: HR Manager + System Manager. Không có nút secret_key/enrollment_token (đã bỏ).

---

## 2. Data model

### 2.1 DocType `HR Office Location`

Đại diện 1 chi nhánh/văn phòng. Multiple offices supported — server tìm office gần nhất khi nhân viên chấm công.

| Field | Type | Note |
|---|---|---|
| `name` | Data (autoname) | Series `OFC-.###` |
| `office_label` | Data, reqd | Tên đọc, vd "VP Q1 - Sảnh", "VP Hà Nội" |
| `company` | Link Company | Optional, để filter theo công ty trong group |
| `location_latitude` | Float, reqd | GPS latitude, vd `10.7769` |
| `location_longitude` | Float, reqd | GPS longitude, vd `106.7009` |
| `allowed_radius_m` | Int | Override `default_radius_m` của Settings. Default `null` = dùng setting |
| `allowed_wifi_bssids` | Table (child) | Wifi BSSID cho phép — chỉ áp dụng nếu `enable_wifi_bssid_check` ON |
| `allowed_lan_subnets` | Table (child) | Subnet local IP cho phép (WebRTC check) — chỉ áp dụng nếu `enable_webrtc_check` ON |
| `is_active` | Check (default 1) | Tắt office tạm thời mà không xóa |
| `notes` | Small Text | Ghi chú nội bộ |

#### Child DocType `HR Office Wifi`

| Field | Type | Note |
|---|---|---|
| `bssid` | Data | MAC format lowercase `aa:bb:cc:dd:ee:ff` |
| `ssid_label` | Data | Optional, vd "Office-2.4GHz" |

#### Child DocType `HR Office Lan Subnet`

| Field | Type | Note |
|---|---|---|
| `subnet_cidr` | Data | CIDR notation, vd `192.168.10.0/24` |
| `note` | Data | Optional, vd "Wifi nhân viên tầng 3" |

### 2.2 DocType `HR Checkin Phone Registration` (giữ nguyên từ trước)

Phone của nhân viên cần được duyệt 1 lần trước khi checkin.

| Field | Type | Note |
|---|---|---|
| `name` | Random hash | |
| `employee` | Link Employee, reqd | |
| `device_fingerprint` | Data, reqd | SHA256 hex từ browser fingerprint |
| `user_agent` | Small Text | |
| `status` | Select | Active / Inactive |
| `docstatus` | (built-in) | 0=Draft (chờ duyệt), 1=Approved, 2=Cancelled |

Permissions: HR Manager + System Manager submit, Employee read own.

### 2.3 ~~DocType `HR WFH Approval`~~ → DEPRECATED — WFH dùng `Attendance Request` (HRMS)

> **Đã bỏ dùng.** WFH giờ nguồn từ HRMS `Attendance Request` (reason="Work From Home")
> theo nguyên tắc Cách B. Doctype `HR WFH Approval` còn lại để tránh mất data cũ, sẽ
> drop ở patch sau khi xác nhận prod không còn dùng.

WFH model hiện tại:
- **Đăng ký WFH** = tạo `Attendance Request` (reason="Work From Home", 1 ngày
  `from_date = to_date`). Nhãn địa điểm lưu ở custom field `custom_work_location_label`.
- **Duyệt** = submit Attendance Request qua tab "Cần duyệt" (`api.approval.act`). Khi
  submit, HRMS **tự tạo Attendance status="Work From Home"** cho ngày đó.
- **Check-in WFH** (GPS audit + selfie) = phần CUSTOM giữ lại, gate vào Attendance
  Request WFH đã duyệt (docstatus=1) phủ ngày hôm nay.

### 2.4 Custom fields on `Employee Checkin` (HRMS)

Toàn bộ via fixture `custom_field.json`. Bỏ các field liên quan QR/Device từ trước.

| Field | Type | Note |
|---|---|---|
| `custom_office_location` | Link HR Office Location | Office xác định được khi checkin |
| `custom_phone_device_fingerprint` | Data | |
| `custom_gps_latitude` | Float | |
| `custom_gps_longitude` | Float | |
| `custom_gps_distance_m` | Float | Distance từ office tâm |
| `custom_selfie` | Attach Image | |
| `custom_wifi_bssid` | Data | Optional, phone gửi nếu Android |
| `custom_webrtc_local_ip` | Data | Optional, PWA gửi nếu enable |
| `custom_checkin_source` | Select | `Onsite-PWA`, `WFH-PWA`, `Manual-Desk` |
| `custom_wfh_approval` | Link **Attendance Request** | Set nếu source=WFH-PWA (link AR reason=WFH) |

Custom field thêm trên `Attendance Request`: `custom_work_location_label` (Data) — nhãn
địa điểm WFH set từ PWA.

Bỏ (so với phiên bản cũ): `custom_hr_attendance_device`, `custom_qr_token_used`. Trên
`Leave Allocation`: đã drop `custom_auto_allocated_for_period` (bỏ auto-allocation theo
chấm công — xem §9).

### 2.5 DocType `HR Push Settings` (Single)

Cấu hình FCM **riêng** cho my-workspace (xem §3.11). `enable_push_notifications` +
Firebase web config + `firebase_vapid_key` + `firebase_service_account_json`.

### 2.6 DocType `HR Push Device`

Token FCM theo thiết bị: `user`, `device_id` (fingerprint trình duyệt), `fcm_token`,
`is_active`, `user_agent`, `last_used`. Upsert theo `(user, device_id)`.

---

## 3. API endpoints

Base URL: `/api/method/hr_for_cobegroup.api.<module>.<func>`

Auth tất cả endpoints: Frappe session cookie + CSRF header.

### 3.1 `GET attendance.get_attendance_info`

Lấy thông tin chấm công hôm nay.

Query/body (optional): `device_fingerprint` — PWA gửi để `phone_registered` được tính
theo ĐÚNG thiết bị hiện tại (khớp registration Active của chính máy này), không phải
"employee có máy nào đó đã duyệt". Thiếu fingerprint → fallback kiểm tra tồn tại. Nhờ
vậy máy chưa duyệt sẽ bị redirect sang `/register-device` thay vì cho vào flow rồi mới
chặn ở bước cuối.

Response:
```json
{
  "employee_name": "Nguyễn Văn A",
  "employee_id": "HR-EMP-00001",
  "next_log_type": "IN",
  "checkins": [
    {
      "name": "EMP-CKIN-2026-00042",
      "log_type": "IN",
      "time": "2026-05-15 08:01:23",
      "office_label": "VP Q1 - Sảnh",
      "source": "Onsite-PWA"
    }
  ],
  "phone_registered": true,
  "wfh_today": {
    "active": false,
    "approval_name": null,
    "work_location_label": null
  },
  "feature_flags": {
    "enable_wfh_mode": false,
    "enable_webrtc_check": false,
    "enable_wifi_bssid_check": false
  }
}
```

PWA dùng `feature_flags` để biết khi nào cần thu thập `wifi_bssid` / `webrtc_local_ip`.

### 3.2 `POST attendance.checkin`

Tạo checkin onsite mới.

Request body:
```json
{
  "latitude": 10.7769,
  "longitude": 106.7009,
  "wifi_bssid": "aa:bb:cc:dd:ee:ff",
  "webrtc_local_ip": "192.168.10.123",
  "selfie_file_url": "/private/files/selfie_xxx.jpg",
  "device_fingerprint": "sha256-hash"
}
```

Note: `wifi_bssid`, `webrtc_local_ip` là OPTIONAL — chỉ gửi nếu tương ứng feature flag bật + PWA detect được. Backend không required.

Server validation chain (theo thứ tự, fail nhanh):
1. Phone registered (lookup HR Checkin Phone Registration approved)
2. Find nearest active HR Office Location → khoảng cách phải ≤ `allowed_radius_m`
3. Nếu `enable_wifi_bssid_check` ON + office có BSSID list → `wifi_bssid` phải khớp
4. Nếu `enable_webrtc_check` ON + office có subnet list → `webrtc_local_ip` phải nằm trong 1 subnet
5. Check duplicate: chưa có checkin nào trong `duplicate_window_seconds` gần nhất
6. (Nếu `enable_face_match` ON) face match selfie với HR Employee photo
7. Insert `Employee Checkin` với tất cả custom fields

Response success (200):
```json
{
  "success": true,
  "checkin_id": "EMP-CKIN-2026-00042",
  "log_type": "IN",
  "time": "2026-05-15 08:01:23",
  "office_label": "VP Q1 - Sảnh",
  "message": "Chấm công thành công"
}
```

Response error (4xx) — error codes:
```json
{
  "success": false,
  "error_code": "OUT_OF_RANGE|WIFI_MISMATCH|LAN_MISMATCH|PHONE_NOT_REGISTERED|EMPLOYEE_NOT_FOUND|DUPLICATE_CHECKIN|FACE_MISMATCH|NO_ACTIVE_OFFICE",
  "message": "<Vietnamese message>",
  "distance_m": 250.5
}
```

### 3.3 `POST attendance.checkin_wfh` (chỉ work khi `enable_wfh_mode` ON)

Checkin từ WFH location.

Request:
```json
{
  "latitude": 10.8000,
  "longitude": 106.7500,
  "selfie_file_url": "/private/files/selfie.jpg",
  "device_fingerprint": "sha256-hash"
}
```

Server validation:
1. Feature flag `enable_wfh_mode` phải ON
2. Phone registered
3. Có **Attendance Request** (reason="Work From Home", docstatus=1) phủ ngày hôm nay của `employee` hiện tại
4. (Không enforce GPS radius — chỉ lưu để audit)
5. Check duplicate
6. Insert Employee Checkin với `custom_checkin_source = "WFH-PWA"` + `custom_wfh_approval = <attendance request name>`

Response giống `checkin` thường, thêm field `wfh_approval`.

Error codes phụ:
- `WFH_NOT_ENABLED` — feature flag off
- `WFH_NOT_APPROVED` — chưa có approval cho hôm nay

### 3.4 Phone registration (device-aware)

- `POST phone_device.register_phone` — body `{ "device_fingerprint": "..." }`
- `GET phone_device.get_phone_registration_status` — body/query optional
  `device_fingerprint`. Trả `{ active, pending, other_active }` **tính theo đúng thiết
  bị hiện tại**: `active`/`pending` chỉ ứng với máy có fingerprint khớp; `other_active`
  = employee có 1 máy ĐÃ duyệt khác (UI nhắc báo HR deactivate máy cũ).

### 3.5 Đề xuất chấm công (Attendance Request — chấm công bù + WFH)

**Một form "Đề xuất" duy nhất** tạo Attendance Request cho cả 2 loại (gộp, không tách):
- `reason="On Duty"` (chấm công bù / công tác) → khi duyệt HRMS đánh **Present** (half_day → Half Day).
- `reason="Work From Home"` (WFH) → status **WFH** + lưu `custom_work_location_label` (địa điểm).

Endpoints (`api.attendance_request`):
- `POST create_attendance_request` — body
  `{ from_date, to_date, reason="On Duty"|"Work From Home", explanation, half_day?, half_day_date?, work_location_label? }`
  → tạo Attendance Request (docstatus=0). Trả `{ success, name }`.
- `GET get_my_attendance_requests?limit=50` — list đơn của NV (**cả On Duty lẫn WFH**),
  kèm `reason`, `work_location_label`, `status` (Pending/Approved/Rejected từ docstatus).
- **Duyệt**: tab **"Cần duyệt"** = `api.approval.act` (Submit Attendance Request → HRMS tạo Attendance).
- **UI**: nút **"Đề xuất"** (FloatButton) trong tab **"Bảng công"** → Modal chọn loại
  (On Duty / WFH — WFH chỉ hiện khi `enable_wfh_mode`), chọn ngày, lý do, (WFH) địa điểm.
  Đơn duyệt xong → Attendance hiện ngay trong Bảng công. **Không còn trang/tab riêng.**
- Tab Bảng công là **MỘT danh sách hợp nhất** (bản ghi `Attendance` + đơn đề xuất chưa
  duyệt Pending/Rejected — đơn Approved đã thành Attendance nên không lặp), mỗi item có
  status. **Bấm item → Modal chi tiết** (công: giờ vào/ra, giờ công, ca, cờ trễ/sớm,
  cảnh báo; đơn: loại, ngày, địa điểm WFH, lý do, trạng thái).

> **Xem chi tiết (toàn app):** mọi item trong list đều **bấm để xem chi tiết** qua Modal
> in-app — Bảng công, Chấm công (lượt check-in), Nghỉ phép, Thông báo, Cần duyệt.

> Legacy `api.wfh.request_wfh` / `get_my_requests` vẫn còn nhưng PWA **không dùng** nữa
> (WFH request đi qua `create_attendance_request` reason=WFH). Check-in WFH (GPS/selfie)
> + `wfh_today` (§3.1, §3.3) **không đổi** — vẫn gate vào AR WFH đã duyệt.

### 3.7 Leave (backend HRMS native)

- `GET leave.get_leave_types_for_employee` — gọi HRMS `get_leave_details()` → trả
  `{ leave_types: [{ name, balance, max_leaves_allowed, leaves_taken, leaves_pending_approval, is_lwp }], employee }`.
  `balance` = `remaining_leaves` (đã trừ đã dùng + chờ duyệt + carry-forward hết hạn).
  Liệt kê loại phép có allocation **+ luôn kèm loại nghỉ không lương (LWP, `is_lwp=true`)**
  để NV chưa được cấp phép vẫn có ít nhất 1 lựa chọn (đơn LWP trừ lương khi duyệt).
  Gọi trực tiếp với user hiện tại (Employee/ESS đã có read Leave Type) — **KHÔNG**
  `frappe.set_user("Administrator")` vì set_user phá `session.sid` trong web request →
  request sau session hỏng → 401 đăng xuất.
- `GET leave.get_my_leave_applications?limit=50` — list Leave Application của NV (gồm
  Draft + Submitted, kèm `workflow_state`).
- `POST leave.create_leave_application` — tạo Leave Application Draft
  (`workflow_state="Pending Manager"`). Workflow 2 bước Manager→HR chạy server-side.

> **Cấp quỹ phép ≠ Đơn xin nghỉ.** Phép năm cấp tự động (+N/kỳ) = **Leave Allocation**
> qua HRMS Earned Leave — hệ thống tự submit, **cộng số dư ngay, KHÔNG qua duyệt**, không
> tạo "leave nháp". Workflow 2 bước chỉ áp cho **Leave Application** (lúc NV dùng phép).
> Earned Leave native cấp phẳng theo lịch — KHÔNG tính thâm niên / prorate ngày lẻ.

### 3.8 Notification (Notification Log)

- `GET notification.list_my_notifications?limit=50&only_unread=0`
- `GET notification.get_unread_count`
- `POST notification.mark_read` — body `{ name }`
- `POST notification.mark_all_read`

Raw SQL lọc cứng `for_user = session.user` (an toàn, không rò rỉ). PWA mở detail bằng
Modal in-app (không mở Desk).

`subject` và `email_content` của Notification Log chứa HTML (vd `<strong>`, `<b class="subject-title">`) → PWA render bằng `dangerouslySetInnerHTML` ở cả list item lẫn modal (không hiển thị thô ra thẻ).

### 3.9 File upload selfie

Dùng endpoint chuẩn Frappe: `POST /api/method/upload_file` với `is_private=1` → response `file_url` → dùng làm `selfie_file_url` trong checkin request.

### 3.10 Session / CSRF

- `GET session.get_csrf_token` → trả CSRF token của session hiện tại (theo cookie
  `sid`). GET nên KHÔNG bị bắt CSRF → gọi được dù token đang cầm đã stale.

**Cơ chế auto-refresh (frappe.ts):** khi login lại trong iframe FSM (`/technician`)
tạo session mới, CSRF token ở tab my-workspace (render trước đó) thành **stale** →
POST API trả 400 "Invalid Request". `frappeCall`/`uploadFile` phát hiện lỗi CSRF →
gọi `session.get_csrf_token` lấy token mới (cookie `sid` lúc này đã là session mới)
→ cập nhật `window.frappe_csrf_token` → **retry 1 lần**. Tránh spam lỗi sau khi quay
về từ FSM.

### 3.11 Push notification (FCM — độc lập với fsmnext)

Web push qua **Firebase Cloud Messaging (FCM)**, stack **riêng hoàn toàn** của
hr_for_cobegroup (KHÔNG dùng chung FCM Device / FSM Settings của fsmnext).

**Doctype:**
- `HR Push Settings` (Single) — cấu hình Firebase: `enable_push_notifications`,
  web config (`firebase_api_key`, `firebase_auth_domain`, `firebase_project_id`,
  `firebase_messaging_sender_id`, `firebase_app_id`), `firebase_vapid_key`,
  `firebase_service_account_json` (bí mật, chỉ server). Có thể là Firebase project
  riêng hoặc dùng lại project của FSM.
- `HR Push Device` — `user`, `device_id`, `fcm_token`, `is_active`, `user_agent`,
  `last_used`.

**Endpoint (whitelisted, `hr_for_cobegroup.api.push`):**
- `GET get_push_config` → `{ enabled, firebase_config{...}, vapid_key }` (không lộ
  service account). `{enabled:false}` nếu chưa bật.
- `POST register_fcm_token` — body `{ token, device_id }` → upsert HR Push Device
  của session user.
- `POST unregister_fcm_token` — body `{ device_id }` → tắt thiết bị (logout).

**Luồng gửi:** hook `Notification Log.after_insert` → `on_notification_log` enqueue
`send_notification_push` (queue short, after_commit). Job: strip HTML subject/
email_content → build FCM **data-only message** (icon/badge my-workspace, `click_action`
= `/my-workspace/notifications`) → `firebase_admin.messaging.send_each` tới mọi HR
Push Device active của user. Token chết (`UNREGISTERED`/`NOT_FOUND`/`INVALID_ARGUMENT`)
→ tự set `is_active=0`. Firebase Admin app cache tên `hr_for_cobegroup_push`.

**Frontend:** `usePushNotifications` + `PushProvider` (auto-register nếu đã cấp
quyền), SW riêng `firebase-messaging-sw.js` (push event hiển thị notification,
click điều hướng `/my-workspace`). Nút bật ở MorePage ("Thông báo đẩy"). Dep:
`firebase` (JS), `firebase-admin` (Python).

> ⚠️ **2 chỗ purge SW** đều phải chừa `firebase-messaging-sw`: `main.tsx` **VÀ**
> bootstrap trong `www/_my_workspace.html`. SW path chứa `attendance-pwa` nên dễ bị
> 2 chỗ này unregister nhầm mỗi session → push chập chờn / không đăng ký được token.
> (Bootstrap HTML chạy trước cả bundle — từng là thủ phạm push không bám trên cloud.)

**Giới hạn:** iOS chỉ hỗ trợ khi PWA "Add to Home Screen" (≥16.4); webview Zalo Mini
App thường không hỗ trợ web push → chỉ chạy trên trình duyệt thật / PWA đã cài.

---

## 4. WebRTC local IP detection

Bật khi `enable_webrtc_check` ON. PWA thu thập local IP qua WebRTC ICE candidates.

```typescript
async function getLocalIP(): Promise<string | null> {
  const pc = new RTCPeerConnection({ iceServers: [] });
  pc.createDataChannel("");
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  return new Promise((resolve) => {
    let resolved = false;
    pc.onicecandidate = (event) => {
      if (event.candidate && !resolved) {
        const match = event.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
        if (match && !match[1].startsWith("0.")) {
          resolved = true;
          resolve(match[1]);
          pc.close();
        }
      }
    };
    setTimeout(() => { if (!resolved) { resolve(null); pc.close(); } }, 2000);
  });
}
```

Backend validation: parse `webrtc_local_ip` → check thuộc 1 trong `office.allowed_lan_subnets` (CIDR).

Lưu ý:
- iOS Safari support WebRTC, trả về local IP đúng
- Modern browser có thể trả mDNS hostname `xxx.local` thay IP → PWA skip nếu không match regex IPv4

---

## 5. Device fingerprint

PWA generates SHA256 từ các thuộc tính browser ổn định:
```javascript
const fingerprint = sha256([
  navigator.userAgent,
  screen.width + 'x' + screen.height,
  screen.colorDepth,
  Intl.DateTimeFormat().resolvedOptions().timeZone,
  navigator.language,
].join('|'));
```

---

## 6. Error codes (chuẩn hóa)

| Code | Message (VN) | Hành động PWA |
|---|---|---|
| `OUT_OF_RANGE` | Bạn đang ở ngoài vùng văn phòng (cách Xm) | Hiển thị khoảng cách |
| `WIFI_MISMATCH` | Vui lòng kết nối wifi văn phòng | Hướng dẫn |
| `LAN_MISMATCH` | Phone của bạn không trên mạng văn phòng | Hướng dẫn |
| `PHONE_NOT_REGISTERED` | Phone chưa được duyệt, chờ HR | Hiện trang đăng ký |
| `EMPLOYEE_NOT_FOUND` | Không tìm thấy thông tin nhân viên | Liên hệ HR |
| `DUPLICATE_CHECKIN` | Bạn vừa chấm công cách đây < N giây | Show last checkin |
| `FACE_MISMATCH` | Selfie không khớp với ảnh nhân viên | Chụp lại |
| `NO_ACTIVE_OFFICE` | Hệ thống chưa cấu hình văn phòng | Liên hệ HR |
| `WFH_NOT_ENABLED` | Tính năng WFH chưa được bật | - |
| `WFH_NOT_APPROVED` | Bạn chưa được duyệt WFH hôm nay | Show approval form |

---

## 7. Sequence diagrams

### Onsite checkin

```
Phone PWA              Frappe Server
    │                       │
    │ GET get_attendance_info│
    │───────────────────────>│
    │<─── feature_flags ─────│
    │                       │
    │ (collect GPS, selfie,  │
    │  optional wifi_bssid,  │
    │  optional webrtc_ip)   │
    │                       │
    │ POST upload_file       │
    │───────────────────────>│
    │<──── file_url ─────────│
    │                       │
    │ POST attendance.checkin│
    │───────────────────────>│
    │                       │ validate:
    │                       │  - phone registered
    │                       │  - find nearest office
    │                       │  - GPS within radius
    │                       │  - (wifi, webrtc nếu enable)
    │                       │  - not duplicate
    │                       │ insert Employee Checkin
    │<─── { success, id } ───│
```

### WFH checkin

```
Phone PWA              Frappe Server
    │                       │
    │ GET get_attendance_info│
    │───────────────────────>│
    │<── wfh_today.active ───│
    │                       │
    │ (selfie only, GPS audit)│
    │ POST upload_file       │
    │───────────────────────>│
    │                       │
    │ POST checkin_wfh       │
    │───────────────────────>│
    │                       │ validate:
    │                       │  - enable_wfh_mode ON
    │                       │  - WFH approval today
    │                       │ insert Employee Checkin
    │                       │ (source=WFH-PWA)
    │<─── { success, id } ───│
```

---

## 8. Migration notes (từ contract cũ → mới)

Đối với code đã scaffold trước đây:

| File cũ | Trạng thái |
|---|---|
| `hr_attendance_device/` doctype | XÓA |
| `hr_attendance_device_wifi/` doctype | XÓA (logic move sang `hr_office_wifi`) |
| `hr_attendance_settings/` doctype (cũ với enrollment_token) | XÓA + tạo lại với feature flags |
| `api/device.py` | XÓA |
| `utils/totp.py` + test | XÓA |
| `utils/device_auth.py` + test | XÓA |
| `api/attendance.py` | REFACTOR (xem section 3.2) |
| `fixtures/custom_field.json` | UPDATE — bỏ `custom_hr_attendance_device`, `custom_qr_token_used`; thêm `custom_office_location`, `custom_webrtc_local_ip`, `custom_wfh_approval` |
| `hooks.py` fixtures filter | UPDATE — fieldname list mới |
| PWA `ScanPage.tsx` + `qrParser.ts` + html5-qrcode dep | XÓA |
| PWA `CheckinFlowProvider.tsx` | SIMPLIFY: bỏ `scanning` state |
| PWA `api/types.ts` | UPDATE — bỏ QRPayload + qr_payload field + TOKEN_* error codes; thêm webrtc/wfh types |
| `firmware/` | ĐÃ XÓA |

---

## 9. Tích hợp HRMS & guardrails (Cách B)

App HRMS gốc (`/hrms`) trùng chức năng với my-workspace và cho phép tạo Employee
Checkin / Attendance Request không qua luật GPS/selfie/thiết bị. Guardrails:

- **Redirect `/hrms` → `/my-workspace`** cho nhân viên thường (`before_request` hook
  `utils.hrms_gate`). Embed-safe: chỉ chặn top-level (`Sec-Fetch-Dest=document`), bỏ
  qua iframe + api. HR/Admin (System Manager / HR Manager / HR User) vẫn vào `/hrms`.
- **Khóa quyền tạo Employee Checkin** của role `Employee` + `Employee Self Service`
  (`create=0, write=0`, giữ `read=1`) — patch `v0_008`. Endpoint chấm công insert bằng
  `ignore_permissions` nên vẫn chạy; nút check-in HRMS gốc + POST API trực tiếp → 403.
- **Backend dùng HRMS native** (Cách B):
  - Số dư phép → `get_leave_details()` / `get_leave_balance_on()` (không tự SUM SQL).
  - WFH → `Attendance Request` (reason="Work From Home").
  - Cấp phép tự động → Earned Leave native (bỏ job theo chấm công + field `leave_auto_*`,
    patch `v0_009`).
- **FSM**: `/fsm` nhúng nguyên app `/technician` (fsmnext) dạng FULLSCREEN (iframe cùng
  origin → chia sẻ session cookie), hiện nav riêng của technician; my-workspace chỉ thêm
  thanh "← Về My Workspace". Lưu ý: iframe là replaced element → phải set `height` tường
  minh (`calc(100dvh - bar)`), không dựa `top/bottom` (sẽ về default 150px).
- **CSRF auto-refresh**: login lại trong iframe FSM xoay session → token tab my-workspace
  stale → "Invalid Request". frappe.ts tự lấy token mới (`session.get_csrf_token`) + retry
  (xem §3.10).
- **Đụng độ device-gating với fsmnext**: fsmnext hook `Employee Checkin.before_insert`
  (`validate_employee_checkin`) bắt buộc thiết bị đăng ký trong `FS Checkin Device
  Registration` của nó — KTV (có `FS Service Resource`) chấm công qua my-workspace sẽ bị
  chặn ("No registered device found"). Fix ở **fsmnext**: skip khi `custom_checkin_source`
  kết thúc `-PWA` (my-workspace đã tự validate bằng `HR Checkin Phone Registration`).
  2 hệ đăng ký thiết bị tách biệt; technician app vẫn giữ gating riêng.
- **Push notification độc lập**: FCM stack của my-workspace (HR Push Settings / HR Push
  Device / `api/push.py`) **tách hoàn toàn** với FCM của fsmnext (FSM Settings / FCM Device).
  Đổi 1 bên không ảnh hưởng bên kia. Xem §3.11.

### Tương tác với storage_management (S3 offload)

`storage_management` đẩy file đính kèm lên S3 và **không đọc lại được server-side** qua
`File.get_content()`. Tính năng đọc file server-side (vd **Prepared Report** render đọc
`*.json.gz`) sẽ lỗi `a bytes-like object is required, not 'str'` nếu file nằm trên S3.

→ Khắc phục ở `storage_management` (repo riêng): `on_file_before_save` bypass upload S3
cho file khớp `bypass_extensions` (default `[".json.gz"]`) + bypass theo `attached_to_doctype`
(`["Repost Item Valuation", "Prepared Report"]`). File report nén giữ **local** → render OK.
File `.gz` user upload vẫn lên S3. Sửa config tại **S3 Attachments Setting → Bypass File
Extensions / Bypass DocType List**. Record prepared report CŨ (đã trên S3) phải xoá tay.

Thay thế (không dùng prepared report): set `Report.prepared_report = 0` cho report đó →
chạy inline, không sinh file `.json.gz`.

### Patches liên quan

| Patch | Việc |
|---|---|
| `v0_008.lock_employee_checkin_create` | Khóa create/write Employee Checkin (Employee/ESS) |
| `v0_009.drop_attendance_auto_leave` | Drop field `leave_auto_*` (HR Policy) + `custom_auto_allocated_for_period` (Leave Allocation) |

