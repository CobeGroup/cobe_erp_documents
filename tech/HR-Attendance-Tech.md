---
title: HR Attendance — Architecture
layout: default
parent: Tài liệu kỹ thuật
nav_order: 2
---

# HR Attendance — Tài liệu kỹ thuật

> Đối tượng: **developer**, **3rd party vendor**, **DevOps**.
> Code trong [`apps/hr_for_cobegroup/`](https://github.com/cobegroup/hr_for_cobegroup).

Tài liệu này mô tả kiến trúc kỹ thuật + chi tiết API cho người tích hợp / debug / mở rộng. Cho hướng dẫn người dùng, xem [Chấm công & HR](../users/Cham-Cong-Tong-Quan.html).

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Stack](#2-stack)
3. [Doctype reference](#3-doctype-reference)
4. [API endpoints](#4-api-endpoints)
5. [Anti-cheat layers](#5-anti-cheat-layers)
6. [Feature flag mechanics](#6-feature-flag-mechanics)
7. [Multi-office logic](#7-multi-office-logic)
8. [Extension points](#8-extension-points)

---

## 1. Tổng quan kiến trúc

Hệ thống **phone-only**, 2 thành phần:

```
PWA (React + TS + Vite + antd)
    ↓ HTTPS, Frappe session
Frappe Server
    ├── DocTypes (5 mới + custom fields trên Employee Checkin)
    ├── API modules (attendance, phone_device, wfh)
    └── Utils (geo haversine, subnet CIDR check)
```

Không hardware. Không firmware. Không native mobile app.

---

## 2. Stack

| Layer | Tech |
|---|---|
| Backend | Frappe v15 (Python 3.10+), HRMS (Employee Checkin extension) |
| PWA Frontend | React 18.3 + TypeScript 5.6 + Vite 5.4 + antd 5.22 + zustand + react-router-dom v6 + vite-plugin-pwa |
| Browser APIs | Geolocation, MediaDevices (camera), WebRTC (local IP), Service Worker (offline shell) |
| Auth | Frappe session cookie + X-Frappe-CSRF-Token header |

---

## 3. Doctype reference

### 3.1 `HR Office Location`

Module: `Attendance`. Autoname series `OFC-.###`.

```python
fields = {
    "office_label": Data (reqd),
    "company": Link → Company,
    "location_latitude": Float (reqd),
    "location_longitude": Float (reqd),
    "allowed_radius_m": Int,  # nullable, fallback to settings
    "allowed_wifi_bssids": Table → HR Office Wifi,
    "allowed_lan_subnets": Table → HR Office Lan Subnet,
    "is_active": Check (default 1),
    "notes": Small Text,
}
```

### 3.2 `HR Office Wifi` (child)

```python
istable = 1
fields = {
    "bssid": Data,         # auto-normalized lowercase
    "ssid_label": Data,
}
```

Validation: BSSID phải khớp regex `^[0-9a-f]{2}(:[0-9a-f]{2}){5}$` (sau normalize).

### 3.3 `HR Office Lan Subnet` (child)

```python
istable = 1
fields = {
    "subnet_cidr": Data,
    "note": Data,
}
```

Validation: `ipaddress.IPv4Network(subnet_cidr, strict=False)` không raise → valid.

### 3.4 `HR Checkin Phone Registration`

Submittable. Random hash naming.

```python
is_submittable = 1
fields = {
    "employee": Link → Employee (reqd),
    "device_fingerprint": Data (reqd),  # SHA256 hex
    "user_agent": Small Text,
    "status": Select("Active", "Inactive"),
}
```

Validation: `before_submit` check không có Active khác cho cùng employee.

### 3.5 `HR WFH Approval`

Submittable. Series `WFH-.YYYY.-.######`.

```python
is_submittable = 1
fields = {
    "employee": Link → Employee (reqd),
    "wfh_date": Date (reqd, in_list_view),
    "work_location_label": Data,
    "reason": Small Text,
    "approved_by": Link → User,
    "status": Select("Pending", "Approved", "Rejected"),
}
```

Validation:
- `wfh_date >= today`
- Unique `(employee, wfh_date)` cho docstatus IN (0, 1)
- `before_submit` set `status="Approved"`, `approved_by=frappe.session.user`

### 3.6 `HR Attendance Settings` (Single)

```python
issingle = 1
fields = {
    "enable_wfh_mode": Check (default 0),
    "enable_webrtc_check": Check (default 0),
    "enable_wifi_bssid_check": Check (default 0),
    "enable_face_match": Check (default 0),
    "default_radius_m": Int (default 100),
    "duplicate_window_seconds": Int (default 60),
}
```

### 3.7 Custom fields trên `Employee Checkin`

| Field | Type | Insert after |
|---|---|---|
| `custom_office_location` | Link HR Office Location | log_type |
| `custom_phone_device_fingerprint` | Data | custom_office_location |
| `custom_gps_latitude` | Float | custom_phone_device_fingerprint |
| `custom_gps_longitude` | Float | custom_gps_latitude |
| `custom_gps_distance_m` | Float | custom_gps_longitude |
| `custom_selfie` | Attach Image | custom_gps_distance_m |
| `custom_wifi_bssid` | Data | custom_selfie |
| `custom_webrtc_local_ip` | Data | custom_wifi_bssid |
| `custom_checkin_source` | Select | custom_webrtc_local_ip |
| `custom_wfh_approval` | Link HR WFH Approval | custom_checkin_source |

Exported via fixture `fixtures/custom_field.json` với filter:
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

## 4. API endpoints

Base: `/api/method/hr_for_cobegroup.api.<module>.<func>`

### 4.1 `attendance.get_attendance_info`

GET. Auth: Frappe session.

Response: xem [API.md §3.1](https://github.com/cobegroup/hr_for_cobegroup/blob/main/docs/API.md).

### 4.2 `attendance.checkin` (onsite)

POST. Body: `{latitude, longitude, wifi_bssid?, webrtc_local_ip?, selfie_file_url, device_fingerprint}`.

Validation chain (theo thứ tự, fail-fast):
1. Resolve employee (cache trong `frappe.local`)
2. Phone registered check
3. Find nearest active office (haversine)
4. Optional: BSSID check (nếu flag ON + office có list)
5. Optional: WebRTC subnet check (nếu flag ON + office có list)
6. Duplicate check (window từ settings)
7. (Stub) Face match (nếu flag ON)
8. Insert Employee Checkin

Error response shape:
```json
{
    "success": false,
    "error_code": "OUT_OF_RANGE",
    "message": "Bạn đang ở ngoài vùng văn phòng (cách 250m)",
    "distance_m": 250.5
}
```

Set `frappe.response["error_code"] = "..."` trước `frappe.throw()` để client switch dễ.

### 4.3 `attendance.checkin_wfh` (WFH)

POST. Body: `{latitude, longitude, selfie_file_url, device_fingerprint}`.

Validation:
1. `settings.enable_wfh_mode` ON → else `WFH_NOT_ENABLED`
2. Phone registered
3. WFH Approval cho hôm nay (docstatus=1) → else `WFH_NOT_APPROVED`
4. Insert Employee Checkin với source=WFH-PWA + link approval

### 4.4 `phone_device.register_phone`

POST. Body: `{device_fingerprint}`. Tạo HR Checkin Phone Registration draft cho current user.

### 4.5 `phone_device.get_phone_registration_status`

GET. Trả `{active: {...}|null, pending: {...}|null}`.

### 4.6 `wfh.request_wfh`

POST. Body: `{wfh_date, work_location_label, reason}`. Tạo HR WFH Approval draft cho current employee.

### 4.7 `wfh.approve_wfh` / `wfh.reject_wfh` / `wfh.get_pending_for_me`

Cho manager. Permissions check qua role + employee dept.

---

## 5. Anti-cheat layers

Implementation chi tiết:

### 5.1 GPS radius check (always-on)

`utils/geo.py::haversine_distance_m(lat1, lng1, lat2, lng2) -> float`

Server iterate qua các `HR Office Location` active, tìm office có distance min. Compare với `office.allowed_radius_m or settings.default_radius_m`.

### 5.2 Phone fingerprint binding

Lookup query:
```sql
SELECT name FROM `tabHR Checkin Phone Registration`
WHERE employee = %s AND device_fingerprint = %s
  AND docstatus = 1 AND status = 'Active'
LIMIT 1
```

### 5.3 Wifi BSSID check (optional flag)

```python
if settings.enable_wifi_bssid_check and office.allowed_wifi_bssids:
    bssid_lower = (wifi_bssid or "").lower()
    allowed = [w.bssid for w in office.allowed_wifi_bssids]
    if bssid_lower not in allowed:
        raise checkin_error("WIFI_MISMATCH", "...")
```

### 5.4 WebRTC local IP check (optional flag)

`utils/subnet.py::ip_in_any_subnet(ip_str, cidr_list) -> bool` using `ipaddress` stdlib.

PWA side (`src/utils/webrtcLocalIp.ts`):
```typescript
async function getLocalIP(): Promise<string | null> {
    const pc = new RTCPeerConnection({iceServers: []});
    pc.createDataChannel("");
    await pc.setLocalDescription(await pc.createOffer());
    return new Promise(resolve => {
        let resolved = false;
        pc.onicecandidate = e => {
            if (e.candidate && !resolved) {
                const m = e.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
                if (m && !m[1].startsWith("0.")) {
                    resolved = true; resolve(m[1]); pc.close();
                }
            }
        };
        setTimeout(() => { if (!resolved) { resolve(null); pc.close(); }}, 2000);
    });
}
```

### 5.5 Duplicate window

```python
last = frappe.db.get_value(
    "Employee Checkin",
    {"employee": employee.name},
    "time",
    order_by="time desc"
)
if last and (now - last).seconds < settings.duplicate_window_seconds:
    raise checkin_error("DUPLICATE_CHECKIN", "...")
```

### 5.6 Face match (phase 2 stub)

Hiện tại stub `_match_face(selfie_url, employee) -> bool` return True. Phase 2 implement:
- Option A: `face_recognition` Python lib server-side
- Option B: AWS Rekognition / Azure Face / GCP Vision API

---

## 6. Feature flag mechanics

Settings loaded mỗi request (cheap — Single doctype 1 query). Pattern:

```python
def _get_settings():
    if not hasattr(frappe.local, "_hr_attendance_settings"):
        frappe.local._hr_attendance_settings = frappe.get_single("HR Attendance Settings")
    return frappe.local._hr_attendance_settings
```

Flag check pattern (short-circuit):
```python
settings = _get_settings()
if settings.enable_wifi_bssid_check:
    # check logic
```

Đổi flag → có hiệu lực ngay request tiếp theo. Không cần bench restart.

---

## 7. Multi-office logic

`find_nearest_office(lat, lng) -> tuple[Document, float]`:

```python
def find_nearest_office(lat, lng):
    offices = frappe.get_all(
        "HR Office Location",
        filters={"is_active": 1},
        fields=["name", "office_label", "location_latitude",
                "location_longitude", "allowed_radius_m"],
    )
    if not offices:
        raise checkin_error("NO_ACTIVE_OFFICE", "...")

    nearest = None
    nearest_dist = float("inf")
    for o in offices:
        d = haversine_distance_m(lat, lng,
            o.location_latitude, o.location_longitude)
        if d < nearest_dist:
            nearest = o
            nearest_dist = d
    return nearest, nearest_dist
```

Linear scan OK cho <50 offices. Scale lớn hơn → spatial index (PostGIS hoặc bounding box pre-filter).

---

## 8. Extension points

### 8.1 Thêm anti-cheat layer mới

1. Thêm field `enable_<feature>` vào `HR Attendance Settings`
2. Thêm logic check trong `api/attendance.py::checkin()` (sau các check hiện có, theo thứ tự fail-fast)
3. Thêm error code mới + Vietnamese message vào API.md §6
4. Cập nhật PWA `src/api/types.ts::ERROR_MESSAGES`
5. (Nếu cần data từ client) thêm field vào request body + custom field trên Employee Checkin

### 8.2 Tích hợp face match thật (phase 2)

Thay thế `_match_face` stub trong `api/attendance.py`:

```python
def _match_face(selfie_url, employee):
    from your_face_lib import compare
    employee_doc = frappe.get_doc("Employee", employee.name)
    return compare(selfie_url, employee_doc.image)
```

### 8.3 Webhook khi có checkin

Thêm `doc_events` hook trong `hooks.py`:

```python
doc_events = {
    "Employee Checkin": {
        "after_insert": [
            "hr_for_cobegroup.api.attendance.notify_external_system"
        ]
    }
}
```

### 8.4 Báo cáo custom

Tận dụng Frappe Query Report — Employee Checkin có sẵn fields cơ bản + custom fields ta thêm. Tạo report mới trong Desk → Report Builder, filter theo `custom_checkin_source` để tách onsite vs WFH.

---

## Liên quan

- [Hướng dẫn user](../users/Cham-Cong-Tong-Quan.html)
- [docs/API.md trong repo](https://github.com/cobegroup/hr_for_cobegroup/blob/main/docs/API.md)
- [docs/ARCHITECTURE.md trong repo](https://github.com/cobegroup/hr_for_cobegroup/blob/main/docs/ARCHITECTURE.md)
