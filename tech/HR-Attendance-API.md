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
- **Duyệt** = qua tab "Cần duyệt" (`api.approval.act`), 1 bước (mặc định sau patch `v0_043`) hoặc 2
  cấp trưởng bộ phận → HR theo công tắc. Bước cuối submit Attendance Request, HRMS **tự tạo
  Attendance status="Work From Home"** cho ngày đó — xem §"Duyệt 1 bước / 2 cấp" bên dưới.
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
  Đơn nộp cho **hôm nay / ngày tới** thì bản Present đó chỉ sống nếu ngày ấy có lần quẹt — xem
  *Phiếu MỞ CỔNG phải có lần chấm công* bên dưới.
- `reason="Work From Home"` (WFH) → status **WFH** + lưu `custom_work_location_label` (địa điểm).

Endpoints (`api.attendance_request`):
- `POST create_attendance_request` — body
  `{ from_date, to_date, reason="On Duty"|"Work From Home", explanation, half_day?, half_day_date?, work_location_label? }`
  → tạo Attendance Request (docstatus=0). Trả `{ success, name }`.
- `GET get_my_attendance_requests?limit=50` — list đơn của NV (**cả On Duty lẫn WFH**),
  kèm `reason`, `work_location_label`, `status` (`Pending` / `Manager Approved` / `Approved` /
  `Rejected` — suy từ docstatus + `custom_approval_state`).
- **Duyệt**: tab **"Cần duyệt"** = `api.approval.act`, 1 bước hoặc 2 cấp theo công tắc (bước cuối mới
  submit Attendance Request → HRMS tạo Attendance).

#### Duyệt 1 bước / 2 cấp — Attendance Request & HR Overtime Request (từ 09/2026)

**Công tắc theo từng loại đơn:** `HR Approval Inbox Doctype.two_level_approval` (cột *Duyệt 2 cấp* trên
HR Approval Inbox Settings), mặc định 1; patch `v0_043` tắt riêng dòng Attendance Request (chốt
17/09/2026: chấm công bù 1 bước, làm thêm 2 cấp). Patch nạp lại doctype (`reload_doc(force=True)`)
trước khi ghi chứ không `return` khi thiếu cột — migrate có lúc bỏ qua JSON doctype mà Patch Log vẫn
khoá patch. `_get_inbox_configs()` trả khoá `two_level`; thiếu cột (code chạy trước migrate) thì coi
như **tắt** — chạy y như code cũ. `approval.two_level_enabled(doctype)` dùng cho chỗ không có sẵn cfg
(hook `before_submit`, API nộp đơn): đọc cả dòng đang tắt khỏi hộp duyệt (`_get_inbox_configs(
include_disabled=True)`) — HR bỏ tick *Enabled* để duyệt trên Desk thì công tắc vẫn có hiệu lực; không
có dòng nào = 1 bước.

Hộp duyệt gọi collector qua `_run_collector`: một loại đơn đọc lỗi thì chỉ mất loại đó (ghi Error Log),
không kéo sập cả hộp — kể cả đơn nghỉ phép.

**Quẹt theo đơn CHƯA DUYỆT không thành công** (chốt 18/09/2026) — luật nằm ở
`attendance.eligibility`, không ở tầng duyệt:

- `desired_skip` trả `SKIP` cho ngày thường khi `_no_onsite_evidence` đúng (KHÔNG log nào của ngày
  chứng minh được người đó ở văn phòng) và ngày đó không có `Attendance Request` docstatus 1 lẫn
  `HR Overtime Request` Approved.
- **Một lần quẹt là bằng chứng ở văn phòng khi** (`_is_onsite_evidence`): nguồn không phải cửa PWA
  (*Manual-Desk*, máy chấm công, app khác), **hoặc** cửa đã dò ra văn phòng lúc quẹt
  (`custom_office_location` có giá trị), **hoặc** toạ độ rơi vào bán kính một `HR Office Location`
  đang bật. Log không có toạ độ dùng được (trống, hoặc (0,0) khi tắt theo dõi vị trí) thì vẫn tính là
  bằng chứng — trừ nguồn quẹt-theo-đơn, vì cửa remote không bắt buộc GPS.
- **Đừng tin nhãn nguồn.** Nhãn chỉ ghi CỬA nào cho quẹt: cửa *remote* (có đơn phủ ngày) dán
  *Remote-PWA* cho cả lần quẹt ngay tại văn phòng (đo 08-09/2026: 28 log), còn cửa *skip* (nhóm quẹt
  mọi nơi, và nhóm `OUT_ONLY` lúc quẹt RA) **bỏ hẳn kiểm vị trí mà vẫn dán *Onsite-PWA*** (đo: **891
  log Onsite-PWA nằm ngoài mọi bán kính**, 38 nhân viên). Tin nhãn thì chỉ cần quẹt RA ở nhà sau khi
  bị từ chối là ngày đó lại có công. Thêm nữa, Frappe tự điền option ĐẦU TIÊN cho Select bỏ trống nên
  log do app khác tạo qua ORM cũng mang nhãn *Onsite-PWA*.
- `onduty_hooks._cancel_attendance_without_basis` (gọi từ `_release_checkins`, tức `on_cancel` /
  `on_trash` của đơn) huỷ bản `Attendance` đã lỡ sinh từ chính các log đó. Điều kiện: từ `CUTOFF` trở
  đi; ngày không còn đơn chấm công bù / làm thêm nào đã duyệt; bản ghi có `attendance_request` **và**
  `leave_application` trống; **ngày đó không có bằng chứng đi làm nào ngoài các lần quẹt theo đơn** —
  hỏi đúng câu mà luật ngày hỏi (`eligibility.no_onsite_evidence_for_day`, gồm cả miễn trừ nhóm
  `whitelist_scope = ALL`); và bản ghi phải do **log dựng lên** (`_built_from_checkins`) chứ không
  phải HR chấm thủ công. Hỏi theo NGÀY chứ không theo từng bản ghi vì bản ghi chỉ gom được log đã gắn
  vào nó: hai bên lệch nhau thì thu hồi xong luật ngày lại dựng bản mới, mà ca có
  `process_attendance_after` muộn hơn ngày đó thì **không dựng lại được** (prod: `ST - Kinh doanh` =
  2026-08-17). Vế `leave_application` là bắt buộc: nghỉ nửa ngày + công tác nửa ngày dùng
  CHUNG một bản ghi, mà HRMS không gắn `attendance_request` khi trạng thái đã khớp — thiếu vế này là
  huỷ mất bản ghi của phép đã duyệt (prod có 31 bản dạng đó) và không dựng lại được, vì
  `should_mark_attendance` từ chối ngày đã có phép. Việc huỷ chạy trong **savepoint**
  (`_cancel_attendance`): `Document.cancel()` ghi `docstatus = 2` và gỡ link check-in TRƯỚC khi kiểm
  liên kết, nên bản ghi vướng chứng từ khác (vd đã vào Overtime Slip đã submit → `LinkExistsError`)
  mà chỉ nuốt lỗi trần thì còn lại bản huỷ nửa chừng; hỏng thì quay về nguyên trạng, ghi Error Log rồi
  đi tiếp — không chặn việc từ chối đơn. Savepoint **tự quản** (`frappe.db.savepoint` /
  `rollback(save_point=…)` / `release_savepoint`) chứ không dùng contextmanager
  `savepoint(catch=…)`: contextmanager nuốt lỗi ở `__exit__` nên `frappe.get_traceback()` gọi sau đó
  trả về chuỗi RỖNG, Error Log chỉ còn mỗi tiêu đề. Mọi lời nhắn sinh ra trong lúc huỷ (HRMS báo "Unlinked
  Attendance record…", hay chính lời lỗi vừa bị nuốt) được cắt khỏi `frappe.local.message_log`: người
  bấm đang TỪ CHỐI ĐƠN, không nên thấy popup lỗi của một việc phụ đã xử lý xong.
- Thu hồi được bản nào thì `_notify_withdrawn` báo cho nhân viên **đích danh ngày** đó (Notification
  Log → chuông + push), kể cả ngày mà **chính đơn đã tạo công** rồi HRMS huỷ theo lúc huỷ đơn
  (`_days_the_request_marked`, chỉ gom ở `on_cancel`) — đó là ca mất công rõ ràng nhất mà trước đây
  im lặng nhất. Nhưng chỉ báo khi ngày đó THẬT SỰ mất công: không còn bản chấm công nào, và job
  không dựng lại được. `_job_will_rebuild` hỏi ĐỦ hai bên: luật ngày phải trả `COUNT` (so
  "khác SKIP" là sai — `desired_skip` trả BA giá trị, ngày trước `CUTOFF` trả `LEAVE_ALONE`
  và không ai dựng lại ngày đó), VÀ phía HRMS phải nhặt được log: chưa đóng cờ, thuộc ca có
  bật chấm công tự động, không lệch ca, từ mốc `process_attendance_after` của ca trở đi (prod
  đang có 3 ca 3 mốc khác nhau), ngày nghỉ thì ca phải cho chấm công ngày nghỉ. Ngày nhân viên
  có ghé văn phòng quẹt vẫn được dựng lại trong vòng một giờ — đo trên prod, 104/365 ngày do đơn tạo
  rơi vào nhóm này, tức cứ ba lần huỷ là một lần báo sai nếu không hỏi lại.
- **Thứ tự trong `_release_checkins` là chốt thật:** thu hồi TRƯỚC, đối soát SAU. `reconcile_day`
  chỉ đụng log chưa gắn bản chấm công, nên đối soát trước là log nằm lại ở cờ 0 (HRMS gỡ link nhưng
  không đụng `skip_auto_attendance`) và job hàng giờ dựng lại đúng ngày vừa thu hồi. Huỷ trên Desk không gửi thông báo nào, còn thông báo từ chối của app chỉ nói
  về cái đơn; huỷ hỏng rồi quay lui thì không báo (hàm huỷ trả về việc nó làm được, không phải việc
  nó định làm).
- **Lời báo về đơn sắp bị xoá KHÔNG được gắn `document_type`/`document_name`.** Từ chối = xoá đơn
  nháp, mà `frappe.delete_doc` enqueue `delete_dynamic_links`, trong đó có
  `delete_references("Notification Log", …)` — gắn link là lời báo bị xoá ngay sau khi tạo. Đo trên
  prod: **0** lời báo "đơn chấm công bù bị từ chối" còn sống trên 1.145 dòng trỏ Attendance Request,
  trong khi đơn nghỉ phép / làm thêm (không bị xoá khi từ chối) vẫn còn đủ — tức lý do từ chối mà
  `_notify_ar_rejected` gửi kèm đã câm từ đầu. Bỏ link thì bộ lọc trùng của `create_notification` rơi
  về (người nhận, tiêu đề) nên ngày phải nằm trong tiêu đề và phải truyền `allow_repeat=True`.
- Ngày đã nằm trong **phiếu lương (`Salary Slip`) đã chốt** thì `_payroll_locked` bỏ qua, chỉ ghi
  Error Log: luật này không có cửa sổ thời gian nào ngoài `CUTOFF`, nên một đơn bị huỷ nhiều tháng
  sau sẽ sửa lặng lẽ kỳ đã trả lương.
- Nhóm có `whitelist_scope = "ALL"` (KTV / Sales được quẹt mọi nơi) **miễn** luật này: lần quẹt của
  họ vốn hợp lệ không cần đơn, chỉ bị dán nhãn theo đơn vì nhánh remote xét trước whitelist.
- Phép dò văn phòng trừ **dung sai GPS** đúng như cửa chấm công (`api.attendance._gps_tolerance_m`,
  trần 50 m) và lấy **bán kính dự phòng** cùng nguồn (`office.allowed_radius_m` →
  `HR Policy.default_radius_m` → 100 m): lần quẹt được nhận là "ở văn phòng" lúc chấm thì ở đây cũng
  phải là bằng chứng.
- Bằng chứng chỉ xét **toạ độ**, chưa xét wifi BSSID / WebRTC (hai cổng này đang tắt ở cả 3 HR Policy).
  Bật một trong hai cho văn phòng sóng GPS xấu thì phải bổ sung ở đây, không thì hai bên lệch nhau.
- `on_submit` của đơn gọi thêm `recompute_hours_from_checkins(from_date, to_date, employee=…)` cho
  khoảng ngày của đơn: job đối soát chỉ quét 14 ngày gần đây, đơn duyệt muộn hơn thế thì ngày đó kẹt ở
  giờ ca phẳng. Tham số `employee` là **bắt buộc ở đây** — bỏ trống thì duyệt một đơn sẽ ghi lại giờ
  của mọi nhân viên trong khoảng (đo 08/2026: 267 bản ghi). Job nền và các patch vẫn gọi không truyền
  `employee`, tức chạy toàn công ty đúng như cũ.

**Phiếu MỞ CỔNG phải có lần chấm công** (chốt 18/09/2026) — `attendance.require_checkin`:

- Phân loại theo **thời điểm nộp**, không theo `reason`, và xét **từng NGÀY**:
  `attendance_date >= DATE(ar.creation)` là ngày **mở cổng** (lúc nộp đơn ngày đó chưa qua), ngược
  lại là ngày **khai bù**. Xét theo `from_date` của cả đơn thì thủng: một đơn được phủ 31 ngày
  (`MAX_RANGE_DAYS`), nên đơn khai từ HÔM QUA tới 30 ngày TỚI bị xếp là khai bù — tốn đúng một suất
  hạn mức mà miễn luật này cho cả 30 ngày chưa tới. Đo 19/09/2026: chưa ai đi cửa đó (453/455 đơn
  phủ 1 ngày, đúng 1 đơn vắt ngang mốc tạo từ 07/2026) và hai cách cho cùng 90 ngày.
- Bộ đếm hạn mức (`utils.attendance_quota.count_used`) vẫn phân loại theo `from_date` của cả ĐƠN:
  nó trả lời "một tháng được khai mấy lần", không phải "ngày này có phải khai bù không". Hai câu hỏi
  khác nhau nên hai phép xét khác nhau — chỗ này cố ý lệch, đừng "thống nhất" lại.
- Phiếu mở cổng chỉ mở geofence. Hết ngày mà nhân viên **không có lần quẹt nào** thì bản chấm công
  do đơn tạo bị thu hồi (`_cancel_attendance`, dùng chung máy thu hồi của luồng huỷ đơn: savepoint +
  chốt chặn phiếu lương) và nhân viên nhận lời báo ghi rõ ngày. Phiếu khai bù **không** chịu luật này
  — đó mới là đường dành cho người quên quẹt, và đường đó đã có hạn mức tháng + hạn nộp + duyệt.
- Đo trên bản sao prod 18/09/2026, tính từ 01/08: **90 ngày công của 28 người** sinh ra từ phiếu mở
  cổng mà ngày đó không có lần quẹt nào. Cả 28 người đều quẹt bình thường những ngày khác (không ai
  thuộc diện "không quẹt được"). Chẻ theo dấu vết việc ngoài (`FS Service Appointment` có giờ thực
  tế): 55 ngày/14 người có làm thật, 35 ngày/18 người không để lại dấu vết nào.
- **Hai cửa gọi**: cron `20 2 * * *` quét `LOOKBACK_DAYS = 7` ngày vừa qua, và `on_submit` của đơn
  (`enforce_for_request`) cho những ngày trong đơn đã qua — đơn duyệt muộn hơn cửa sổ quét thì công
  không được sống lại chỉ vì người duyệt bấm trễ. `on_submit` gọi **trước** hai bước tính giờ; cả hai
  bước đó lọc `docstatus = 1` nên bản vừa thu hồi không bị tính giờ rồi mới bỏ đi.
- **Mốc hiệu lực nằm trong dữ liệu, không viết cứng**: patch `v0_045` ghi `frappe.db.set_default(
  "cobe_require_checkin_since", today())` lúc migrate, `moc_hieu_luc()` tự ghi hôm nay nếu chưa có.
  Deploy trễ mấy ngày cũng không rút công ngày nào trước đó — user chốt **không hồi tố**, 90 ngày cũ
  giữ nguyên.
- Không đụng: ngày còn `HR Overtime Request` Approved; bản ghi mang `leave_application` (nghỉ nửa
  buổi dùng chung một bản ghi với công tác nửa buổi); ngày trong phiếu lương đã chốt; ngày hôm nay.
  Đơn chấm công bù KHÁC phủ cùng ngày thì **không xảy ra được** — `validate_request_overlap` của HRMS
  chặn mọi đơn trùng khoảng còn sống, đo trên prod: 0 cặp.
- "Không có lần quẹt nào" xét cả log **gắn thẳng vào bản ghi** (`Employee Checkin.attendance`), không
  chỉ log cùng ngày lịch: ca đêm có log rơi sang ngày hôm sau, lọc theo `DATE(time)` một mình là kết
  tội oan.
- ⚠️ `sweep(from, to)` **không truyền `employee` là quét cả công ty** — đúng ý cho cron, nhưng gọi
  trần trong test trên site bản sao prod là thu hồi công thật của người thật (đã dính: 21 bản ghi
  phải dựng lại tay). Test phải luôn khoá `employee=`.

**Soi chỗ chấm công ngoài văn phòng** — report `COBE Remote Checkin Audit`
(`attendance/report/cobe_remote_checkin_audit`, vai trò System Manager / HR Manager / HR User):

- Một dòng = một **ngày của một người**, chỉ gồm log có `custom_checkin_source` thuộc
  `REQUEST_GATED_SOURCES`. Ba cột đo: khoảng cách tới `HR Office Location` đang bật gần nhất
  (`utils.geo.haversine_distance_m`), số ngày lặp cùng một điểm (làm tròn `LAM_TRON = 4` số lẻ
  ≈ 11 m), và số `FS Service Appointment` có giờ thực tế trong ngày.
- Cột việc ngoài **tự tắt** khi site không cài fsmnext (`frappe.db.exists("DocType", …)`) — chấm
  công không được phụ thuộc cứng vào app đó.
- Ô *Chỉ dòng đáng xem* = lặp điểm ≥ `NGUONG_LAP_DIEM` **và** không có việc ngoài nào. Đo trên
  prod 18/09/2026 với khoảng 01/08 → nay: 259 dòng, lọc còn 26 dòng của 4 người.
- Report cố ý **không kết luận**: tỉnh chưa khai văn phòng cho ra đúng dấu vết như người chấm
  công tại nhà (có người 28 ngày cùng một điểm nhưng ngày nào cũng có lịch dịch vụ chạy thật).

> ⚠️ **Migrate là bắt buộc khi deploy.** Chỉ riêng cột công tắc có lớp chống thiếu cột; hộp duyệt,
> danh sách đơn của nhân viên và hook còn đọc `custom_approval_state`, `custom_manager_approved_by`,
> `HR Overtime Request.manager_approved_by`… — code chạy trước migrate thì danh sách đơn của nhân viên
> báo lỗi SQL, còn hộp duyệt **lặng lẽ mất** chấm công bù / làm thêm (chỉ có dòng Error Log "Hộp duyệt:
> không đọc được …"). Hộp duyệt trống sau deploy không có nghĩa là migrate đã ổn — soi Error Log.

**Tắt (1 bước)** — y như trước 09/2026: item mang `state = "Pending"`; mọi action duyệt (`Submit`,
`Approve`, `Manager Approve`, `HR Approve`) là duyệt cuối, mọi action từ chối (`Cancel`, `Reject`,
`Manager Reject`, `HR Reject`) là từ chối; người được bấm = người duyệt chấm công hoặc HR Manager / System Manager;
không chặn tự duyệt; hook `before_submit` không chặn. Đơn đang chờ HR lúc tắt (AR `Manager Approved`,
OT `status = Manager Approved`) được coi là đơn chờ bình thường.

**Bật (2 cấp)** — cùng khuôn với Leave Application, cùng tên state để PWA dùng chung một bộ nút:

| Bước | `state` trong item của `get_my_pending_approvals` | Nguồn trạng thái |
|---|---|---|
| Chờ trưởng bộ phận | `Pending Manager` | AR: `docstatus = 0` và `custom_approval_state` rỗng / `Pending Manager` · OT: `status = Pending` |
| Chờ HR | `Manager Approved` | AR: `docstatus = 0` và `custom_approval_state = Manager Approved` · OT: `status = Manager Approved` |

`POST api.approval.act { doctype, name, action, reason }`:

| `action` | Hợp lệ ở bước | Tác dụng |
|---|---|---|
| `Manager Approve` | Chờ trưởng bộ phận | AR: ghi `custom_approval_state`, `custom_manager_approved_by/_on` (vẫn nháp) · OT: `status = Manager Approved`, `manager_approved_by/_on`. Báo người duyệt cuối |
| `HR Approve` | Chờ HR | AR: `doc.submit()` · OT: `status = Approved`, `approved_by/_on`, đối chiếu chấm công, báo NV |
| `Manager Reject` / `HR Reject` | Đúng bước tên gọi | AR: xoá đơn nháp · OT: `status = Rejected`, `reject_reason`. Bắt buộc `reason`, báo NV |
| `Submit` / `Approve` *(tên cũ)* | Bất kỳ bước | Duyệt **ở bước hiện tại** — không bao giờ nhảy qua bước HR |
| `Cancel` / `Reject` *(tên cũ)* | Bất kỳ bước | Như từ chối ở bước hiện tại. AR đã submit: `doc.cancel()` |

Ở chế độ 2 cấp, PWA hiện tại chỉ gửi action gắn cứng bước (`Manager Approve` / `HR Approve` /
`Manager Reject` / `HR Reject`; nút duyệt HR của **đơn nghỉ** vẫn là `Submit` vì đó là tên transition
của workflow). Tên
cũ còn nhận cho bundle trong cache máy người dùng. Action gắn cứng một bước mà đơn đã ở bước khác —
hai người mở cùng một đơn, hoặc đơn vừa bị đá về bước 1 — báo lỗi *"… Tải lại danh sách"* thay vì âm
thầm làm ở bước kia.

**Lên thẳng bước HR** (`_manager_stage_skipped(employee, cfg)`): ngoài chính nhân viên không còn
`shift_request_approver` nào **dùng được hộp duyệt** — tài khoản đang bật, có role trong `viewer_roles` và
trong `approver_roles` (`_usable_approvers`) — thì bước hiệu lực là *Chờ HR* dù nguồn
trạng thái ghi bước trưởng bộ phận — `_ar_stage` / `_ot_stage` nhận `skipped`, hộp duyệt dùng
`_has_other_approver_sql(cfg, params)` (cùng luật), `before_submit` không hỏi bước 1. Không có nhánh này thì đơn
kẹt: người đó không được tự duyệt bước 1, còn HR không thấy đơn bước 1. Tính lúc đọc, không ghi vào
đơn. Lúc nộp đơn, `new_request_recipients(doctype, employee)` báo HR thay cho người duyệt (chỉ khi bật
2 cấp).

**Ai được bấm** (`_can_act_two_level`, `stage` là bước hiệu lực):

- Bước trưởng bộ phận: `shift_request_approver` của NV (Employee hoặc Department Approver). Hàm này
  cho HR Manager / System Manager bước vào thay, nhưng khi `restrict_to_leave_approver = 1` hộp duyệt
  không hiện đơn bước 1 cho họ (`_APPROVER_MATCH_SQL`), nên thực tế chỉ gọi `act` trực tiếp mới làm
  được; AR thì còn đường Desk submit (làm cả hai bước). **Không tự duyệt** đơn của chính mình — so với
  tài khoản của nhân viên đứng tên đơn (Administrator được miễn, như Frappe).
- Bước HR: HR Manager có tên trong `HR Policy.final_leave_approvers` của công ty NV (bảng trống =
  mọi HR Manager) — người đó tự duyệt được đơn của mình (như `allow_self_approval = 1` ở Leave).
  System Manager được, trừ đơn của chính họ: bước cuối của Leave đòi role HR Manager, nên System
  Manager thuần không tự duyệt đơn mình (hộp duyệt cũng ẩn đơn đó với họ — `_own_hr_stage_sql`).
  Đọc cấu hình hộp duyệt lỗi thì báo lỗi, không coi như công tắc tắt.

**Chốt ở tầng document:** hook `Attendance Request.before_submit` chỉ cho người duyệt cuối submit —
Desk, API hay bulk đều dính. Người duyệt cuối submit thẳng đơn chưa qua bước 1 = làm luôn bước 1
(ghi tên vào `custom_manager_approved_by`), với luật không tự duyệt của bước 1.

**Chốt ô trạng thái** (Frappe không chặn ô read-only ở server):

- `Attendance Request.validate` (`onduty_hooks._guard_approval_fields`, chạy cả khi tắt 2 cấp): mỗi lần
  lưu qua form/REST, ba ô bước duyệt trả về giá trị trong DB (đơn mới: `Pending Manager`, hai ô kia
  trống). Đơn đang `Manager Approved` mà đổi một trong `CONTENT_FIELDS` → về `Pending Manager`. So sánh
  theo kiểu field (ngày gửi lên là chuỗi). Chạy trước `before_submit`, nên hook đó đọc được giá trị thật.
- `HR Overtime Request.validate` (`privileged` = `flags.ignore_permissions` hoặc System Manager):
  - `_guard_system_fields`: `COMPUTED_FIELDS` (`attendance`, `granted_hours`) luôn lấy lại giá trị DB —
    với MỌI người, vì đối chiếu ghi chúng bằng `update_modified=False` nên form mở từ trước vẫn lưu
    được và sẽ đè. Không `privileged`: đơn mới phải `status = Pending` và chưa có kết quả duyệt (các ô
    này cũng `no_copy`, nên Duplicate trên Desk không chép); đơn đã có mà đổi `DECISION_FIELDS`
    (`status`, `approved_by/on`, `manager_approved_by/on`, `reject_reason`) → `PermissionError`.
  - `_guard_content` (áp cả `privileged`): đơn `Manager Approved` mà đổi `REVIEWED_FIELDS` (nhân viên,
    ngày, hình thức, lý do) hoặc khung giờ → về `Pending`, xoá `manager_approved_by/on`;
    `_reset_if_hours_changed` làm y vậy khi số giờ tính lại ra khác. Đơn đã xử xong mà nội dung không
    đổi → **không** gọi `_compute_expected_hours`, giữ `expected_hours` trong DB (kể cả giá trị gửi lên
    qua REST). Nội dung đổi → `PermissionError` với MỌI người, kể cả System Manager: đổi `payout_type`
    của đơn "Tiền lương" đã duyệt thành "Nghỉ bù" là giờ vừa nằm trong Overtime Slip vừa vào quỹ Nghỉ
    bù. Đường đúng là **Huỷ duyệt** rồi khai đơn mới.
  - Mọi đường hợp lệ (hộp duyệt, huỷ duyệt, rút đơn, hết hạn) ghi bằng `db_set` / `db.set_value` nên
    không đi qua đây. So sánh theo kiểu field (form gửi `2` cho `2.0`, ngày giờ là chuỗi).

**Nhỏ nhưng có chủ đích:**

- Ở chế độ 1 bước, nút **Duyệt** gửi `Submit` (1 bước thì mọi tên duyệt đều là duyệt cuối); nút **Từ
  chối** gửi `Manager Reject`, không gửi `Reject`: với AR đã `docstatus = 1`,
  `Cancel`/`Reject` là huỷ đơn đã duyệt — người duyệt bấm trên màn hình cũ sẽ huỷ nhầm.
- `cancel_my_overtime_request` đọc đơn `for_update`: HR đang duyệt (giữ khoá trong `act`) thì nhân viên
  đọc sau và thấy `Approved`, không đè `Cancelled` lên đơn vừa có hiệu lực.
- `new_request_recipients` khi bật 2 cấp chỉ báo người duyệt được bước 1 (bỏ chính nhân viên, bỏ người
  thiếu role / tài khoản khoá).

**Không đổi:** quyền huỷ đơn đã duyệt (AR `Cancel`, OT `cancel_approved_request`) — hai bước chặn
việc cấp hiệu lực, còn huỷ chỉ rút hiệu lực. Lưu ý với AR: `doc.cancel()` kéo theo huỷ `Attendance`,
nên ngoài cổng trong `_act_attendance_request` người huỷ còn cần quyền ghi `Attendance` — trên site
hiện chỉ HR / System Manager có. Mọi nơi tiêu thụ đơn OT (đối chiếu chấm công, quỹ Nghỉ
bù, luật tính công ngày nghỉ) chỉ đọc `status = Approved`, và check-in WFH chỉ mở với AR
`docstatus = 1`, nên bước trưởng bộ phận không sinh hiệu lực nào.
- **UI**: component chung `AttendanceRequestModal` mở từ **3 lối** — FAB **"Đề xuất"** tab **"Bảng công"**;
  link **"Đi công tác / làm ngoài? Đề xuất chấm công bù"** dưới nút chấm công tab **"Chấm công"**;
  hộp thoại **"Ngoài vùng văn phòng"** (nút "Tạo đề xuất") khi check-in bị chặn `OUT_OF_RANGE`.
  Modal chọn loại (On Duty / WFH — WFH chỉ hiện khi `enable_wfh_mode`), chọn ngày, lý do, (WFH) địa điểm.
  Đơn duyệt xong → Attendance hiện ngay trong Bảng công. **Không còn trang/tab riêng.**
- Tab Bảng công là **MỘT danh sách hợp nhất** (bản ghi `Attendance` + đơn đề xuất chưa
  duyệt xong Pending/Manager Approved/Rejected — đơn Approved đã thành Attendance nên không lặp), mỗi item có
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
  Tham số: `leave_type, from_date, to_date, description, half_day, half_day_date,
  half_day_session`.

**Nghỉ nửa ngày (half-day).** Khi `half_day=1`:
- Backend bắt buộc `from_date == to_date` (luồng PWA chỉ cho nửa ngày khi nghỉ **đúng
  1 ngày**); tự set `half_day_date = from_date` nếu client không gửi.
- Số ngày trừ do HRMS `get_number_of_leave_days` tính: nửa ngày → **`total_leave_days
  = 0.5`** (trừ 0.5 số dư khi đơn được Submit). Sáng hay chiều **không đổi** số trừ.
- `half_day_session` (`"Sáng"` | `"Chiều"`) chỉ là **nhãn thông tin buổi nghỉ**, lưu ở
  custom field `Leave Application.custom_half_day_session` (Select, `depends_on
  half_day`, fixture `custom_field.json`, sở hữu bởi hr_for_cobegroup). KHÔNG ảnh hưởng
  số phép — buổi còn lại NV vẫn đi làm + chấm công. Validate: chỉ nhận `Sáng`/`Chiều`.
- `get_my_leave_applications` trả thêm `half_day`, `half_day_date`,
  `custom_half_day_session` để client hiển thị (vd "· nửa ngày (Sáng)").

> Frappe core chỉ có `half_day` + `half_day_date` (không phân biệt buổi). Cobe thêm
> `custom_half_day_session` thuần để hiển thị buổi — migrate prod tự tạo field qua sync
> fixtures, không cần patch riêng.

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

