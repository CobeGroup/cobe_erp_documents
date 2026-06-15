---
title: HR Attendance — API Contract
layout: default
parent: Tài liệu kỹ thuật
nav_order: 3
---

# HR Attendance — API Contract

> Source of truth cho contract giữa **PWA** (React + TS) và **Backend** (Frappe).
>
> Mọi thay đổi contract phải update file này TRƯỚC khi sửa code. Đối tượng: developer, 3rd party integrator.

---

## Mục lục

1. [Feature flags (HR Attendance Policy)](#1-feature-flags-hr-attendance-policy)
2. [Data model](#2-data-model)
3. [API endpoints](#3-api-endpoints)
4. [WebRTC local IP detection](#4-webrtc-local-ip-detection)
5. [Device fingerprint](#5-device-fingerprint)
6. [Error codes](#6-error-codes-chuẩn-hóa)
7. [Sequence diagrams](#7-sequence-diagrams)

---

## 1. Feature flags (HR Attendance Policy — per Company)

Regular doctype, **1 record per Company** (unique constraint on `company`). Naming `format:HRAP-{company}`. Default off cho tính năng chưa verify.

| Field | Type | Default | Mô tả |
|---|---|---|---|
| `company` | Link → Company, reqd, unique | — | Company áp dụng setting này |
| `enable_selfie_capture` | Check | 0 | Bật yêu cầu chụp selfie khi chấm công. Tắt = PWA không mở camera, server không reject thiếu selfie |
| `enable_wfh_mode` | Check | 0 | Bật flow WFH cho nhân viên đã được duyệt WFH theo ngày |
| `enable_webrtc_check` | Check | 0 | Bật check WebRTC local IP để defend iOS GPS-spoof. Yêu cầu office wifi subnet đã verify |
| `enable_wifi_bssid_check` | Check | 0 | Bật check Wifi BSSID (Android only). Yêu cầu office wifi BSSID đã enroll |
| `enable_face_match` | Check | 0 | Phase 2: bật server-side face match selfie ↔ HR Employee photo |
| `enforce_checkout_same_office` | Check | 1 | Bắt buộc check-out cùng office với check-in (cùng ngày). Tắt = cho phép IN VP A + OUT VP B |
| `default_radius_m` | Int | 100 | Bán kính GPS check mặc định nếu Office Location chưa đặt riêng |
| `duplicate_window_seconds` | Int | 60 | Reject checkin trùng < N giây từ checkin gần nhất của cùng employee |

Permissions: HR Manager + System Manager.

**Server-side lookup**: helpers ở [`hr_for_cobegroup/utils/settings.py`](https://github.com/CobeGroup/hr_for_cobegroup/blob/main/hr_for_cobegroup/utils/settings.py):
- `get_settings_for_employee(employee_name)` — lookup theo `Employee.company`, cache request-level
- `get_settings_for_company(company)` — direct lookup, cache request-level

Endpoint nào cần settings → call `get_settings_for_employee(employee.name)`. Lỗi:
- Employee không có Company → throw *"Employee {X} chưa có Company"*
- Company chưa có HR Attendance Policy → throw *"Company {X} chưa có HR Attendance Policy"*

**Bootstrap**: `after_install` hook + patch `v0_002.migrate_settings_to_per_company` seed 1 record / Company hiện có với defaults. Khi tạo Company mới sau install, HR Manager phải tạo Settings cho Company đó thủ công.

---

## 2. Data model

### 2.1 `HR Office Location`

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

#### Child `HR Office Wifi`
| Field | Type | Note |
|---|---|---|
| `bssid` | Data | MAC format lowercase `aa:bb:cc:dd:ee:ff` |
| `ssid_label` | Data | Optional, vd "Office-2.4GHz" |

#### Child `HR Office Lan Subnet`
| Field | Type | Note |
|---|---|---|
| `subnet_cidr` | Data | CIDR notation, vd `192.168.10.0/24` |
| `note` | Data | Optional, vd "Wifi nhân viên tầng 3" |

### 2.2 `HR Checkin Phone Registration`

Submittable. Random hash naming. Phone cần được duyệt 1 lần trước khi checkin.

| Field | Type | Note |
|---|---|---|
| `employee` | Link Employee, reqd | |
| `device_fingerprint` | Data, reqd | SHA256 hex từ browser fingerprint |
| `user_agent` | Small Text | |
| `status` | Select (`Active` / `Inactive`) | Có `allow_on_submit=1` |
| `docstatus` | (built-in) | 0=Draft (chờ duyệt), 1=Approved, 2=Cancelled |

Validation: `before_submit` check không có record Active khác cho cùng employee → throw nếu có.

Permissions: HR Manager + System Manager submit, Employee read own.

### 2.3 `HR WFH Approval` (gated by `enable_wfh_mode`)

Submittable. Series `WFH-.YYYY.-.######`.

| Field | Type | Note |
|---|---|---|
| `employee` | Link Employee, reqd | |
| `wfh_date` | Date, reqd, in_list_view | Ngày WFH |
| `work_location_label` | Data | Vd "Nhà riêng", "Công tác Hà Nội" |
| `reason` | Small Text | |
| `approved_by` | Link User | Manager duyệt |
| `status` | Select (`Pending` / `Approved` / `Rejected`) | |
| `docstatus` | (built-in) | 0=Draft, 1=Submitted (= effective), 2=Cancelled |

Constraint: unique `(employee, wfh_date)` — 1 ngày 1 record.

Permissions:
- Employee: create own (status=Pending), read own
- Manager (Leave Approver hoặc dept manager): write + submit
- HR Manager: full

### 2.4 Custom fields trên `Employee Checkin`

Exported via fixture `fixtures/custom_field.json`.

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
| `custom_wfh_approval` | Link HR WFH Approval | Set nếu source=WFH-PWA |

Fixture filter:
```python
fixtures = [{
    "dt": "Custom Field",
    "filters": [
        ["dt", "=", "Employee Checkin"],
        ["fieldname", "in", [<10 fieldnames>]],
    ],
}]
```

---

## 3. API endpoints

Base URL: `/api/method/hr_for_cobegroup.api.<module>.<func>`

Auth: Frappe session cookie + CSRF header (`X-Frappe-CSRF-Token`).

### 3.1 `GET attendance.get_attendance_info`

Lấy thông tin chấm công hôm nay + feature flags hiện tại.

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

### 3.2 `POST attendance.checkin` (onsite)

Tạo checkin onsite mới.

Request body:
```json
{
  "latitude": 10.7769,
  "longitude": 106.7009,
  "device_fingerprint": "sha256-hash",
  "selfie_file_url": "/private/files/selfie_xxx.jpg",
  "wifi_bssid": "aa:bb:cc:dd:ee:ff",
  "webrtc_local_ip": "192.168.10.123"
}
```

Note: `selfie_file_url`, `wifi_bssid`, `webrtc_local_ip` đều **optional** — chỉ gửi nếu tương ứng feature flag bật + PWA detect được. Backend không required khi flag off.

Server validation chain (theo thứ tự, fail nhanh):
1. Resolve employee (cache trong `frappe.local`)
2. Phone registered (lookup HR Checkin Phone Registration approved)
3. Duplicate window + log_type determination (IN/OUT từ checkin gần nhất, throw `DUPLICATE_CHECKIN` nếu < `duplicate_window_seconds`)
4. Resolve target office:
   - **OUT + `enforce_checkout_same_office` ON**: lock to today's IN office. Nếu phone gần hơn 1 office khác → throw `OFFICE_MISMATCH`
   - Else: find nearest active HR Office Location
5. Khoảng cách phải ≤ `allowed_radius_m` (override of office) hoặc `default_radius_m` (fallback) → else `OUT_OF_RANGE`
6. Nếu `enable_wifi_bssid_check` ON + office có BSSID list → `wifi_bssid` phải khớp → else `WIFI_MISMATCH`
7. Nếu `enable_webrtc_check` ON + office có subnet list → `webrtc_local_ip` phải nằm trong 1 subnet → else `LAN_MISMATCH`
8. Nếu `enable_selfie_capture` ON + `selfie_file_url` empty → throw `SELFIE_REQUIRED`
9. (Stub, nếu `enable_face_match` ON) face match selfie với HR Employee photo → else `FACE_MISMATCH`
10. Insert `Employee Checkin` với tất cả custom fields

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

Response error (4xx):
```json
{
  "success": false,
  "error_code": "OUT_OF_RANGE",
  "message": "Bạn đang ở ngoài vùng văn phòng (cách 250m)",
  "distance_m": 250.5
}
```

Set `frappe.response["error_code"] = "..."` trước `frappe.throw()` để client switch dễ. Xem [§6 error codes](#6-error-codes-chuẩn-hóa).

### 3.3 `POST attendance.checkin_wfh` (gated by `enable_wfh_mode`)

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
1. `settings.enable_wfh_mode` ON → else `WFH_NOT_ENABLED`
2. Phone registered
3. Có HR WFH Approval submitted (docstatus=1) cho hôm nay khớp employee → else `WFH_NOT_APPROVED`
4. (Không enforce GPS radius — chỉ lưu để audit)
5. Check duplicate window
6. Insert Employee Checkin với `custom_checkin_source = "WFH-PWA"` + `custom_wfh_approval = <approval name>`

Response giống `checkin` thường, thêm field `wfh_approval`.

### 3.4 `POST phone_device.register_phone`

Body: `{ "device_fingerprint": "sha256-hash" }`. Tạo HR Checkin Phone Registration draft cho current user.

### 3.5 `GET phone_device.get_phone_registration_status`

Trả `{ active: {...}|null, pending: {...}|null }`.

### 3.6 `POST wfh.request_wfh`

Body: `{ "wfh_date": "2026-05-16", "work_location_label": "Nhà", "reason": "..." }`. Employee tạo request status=Draft cho mình.

### 3.7 `GET wfh.get_my_requests?limit=20`

Employee xem các WFH request của mình (Draft + Approved + recently Rejected/Cancelled).

### 3.8 `GET wfh.get_pending_for_me`

Manager xem queue cần duyệt.

### 3.9 `POST wfh.approve_wfh` / `wfh.reject_wfh`

Cho manager. Permissions check qua role + employee dept.
- approve: body `{ "name": "WFH-2026-000123" }` → manager submit
- reject: body `{ "name": "...", "reason": "..." }`

### 3.10 File upload selfie

Dùng endpoint chuẩn Frappe: `POST /api/method/upload_file` với `is_private=1` → response `file_url` → dùng làm `selfie_file_url` trong checkin request.

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

Server lưu vào `HR Checkin Phone Registration.device_fingerprint` lúc đăng ký + `Employee Checkin.custom_phone_device_fingerprint` lúc checkin.

---

## 6. Error codes (chuẩn hóa)

| Code | Message (VN) | Hành động PWA |
|---|---|---|
| `OUT_OF_RANGE` | Bạn đang ở ngoài vùng văn phòng (cách Xm) | Hiển thị khoảng cách |
| `OFFICE_MISMATCH` | Check-out phải ở cùng văn phòng đã check-in sáng nay (VP A). Bạn đang gần hơn với VP B. | Đề nghị về VP A check-out |
| `WIFI_MISMATCH` | Vui lòng kết nối wifi văn phòng | Hướng dẫn |
| `LAN_MISMATCH` | Phone của bạn không trên mạng văn phòng | Hướng dẫn |
| `PHONE_NOT_REGISTERED` | Phone chưa được duyệt, chờ HR | Hiện trang đăng ký |
| `EMPLOYEE_NOT_FOUND` | Không tìm thấy thông tin nhân viên | Liên hệ HR |
| `DUPLICATE_CHECKIN` | Bạn vừa chấm công cách đây < N giây | Show last checkin |
| `SELFIE_REQUIRED` | Chấm công yêu cầu chụp ảnh selfie | Mở camera (chỉ khi PWA bị mất sync flag) |
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

## Liên quan

- [HR Attendance — Architecture](HR-Attendance-Architecture.html) — system design + lifecycle
- [HR Attendance — Tech Overview](HR-Attendance-Tech.html) — integrator quick reference
- [HR Office Location (user guide)](../users/HR-Office-Location.html)
