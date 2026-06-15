---
title: HR Attendance — Architecture
layout: default
parent: Tài liệu kỹ thuật
nav_order: 4
---

# HR Attendance — Architecture

> System design, request lifecycle, routing, deployment topology. Đối tượng: developer + DevOps + 3rd party integrator.
>
> Chi tiết API spec ở [HR Attendance — API Contract](HR-Attendance-API.html). Quick reference ở [HR Attendance — Tech Overview](HR-Attendance-Tech.html).

---

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Vòng đời 1 lần chấm công onsite](#2-vòng-đời-1-lần-chấm-công-onsite)
3. [Vòng đời WFH checkin](#3-vòng-đời-wfh-checkin)
4. [Anti-cheat layers](#4-anti-cheat-layers)
5. [Lựa chọn kỹ thuật quan trọng](#5-lựa-chọn-kỹ-thuật-quan-trọng)
6. [Routing — PWA served at /attendance](#6-routing--pwa-served-at-attendance)
7. [Folder structure](#7-folder-structure)
8. [Deployment topology](#8-deployment-topology)

---

## 1. Tổng quan

Hệ thống **phone-only**, 2 thành phần:

```
┌─────────────────────────┐
│  Phone nhân viên (PWA)  │  Cài 1 lần như app, login Frappe SSO
│  - GPS                  │  Frappe session cookie
│  - Camera selfie        │
│  - Device fingerprint   │
│  - Optional WebRTC IP   │
│  - Optional Wifi BSSID  │
└──────────┬──────────────┘
           │ HTTPS
           ↓
┌─────────────────────────┐
│  Frappe Server          │
│  - HR Office Location   │  Multi-office support
│  - HR Phone Reg         │
│  - HR WFH Approval      │  Feature-flag gated
│  - HR Attendance Setts  │  Single — feature flags
│  - Employee Checkin     │  Extend HRMS + custom fields
└─────────────────────────┘
```

Không hardware. Không firmware. Không native mobile app. Stack: Frappe v15 + HRMS + React 18 + TypeScript + Vite + antd 5.

---

## 2. Vòng đời 1 lần chấm công onsite

```
1. Nhân viên vào VP → mở PWA (đã cài, đã login Frappe)
2. PWA fetch get_attendance_info → biết feature_flags hiện tại
3. Nhân viên tap "Chấm công"
4. PWA collect parallel (tối ưu UX):
   - GPS (Geolocation API, ~1-2s)
   - WebRTC local IP nếu enable_webrtc_check ON (~500ms)
   - Wifi BSSID nếu enable_wifi_bssid_check ON & Android (~500ms)
5. PWA bật front camera → chụp selfie → upload qua /api/method/upload_file
6. PWA POST /api/method/.../attendance.checkin với:
   { latitude, longitude, wifi_bssid?, webrtc_local_ip?, selfie_file_url, device_fingerprint }
7. Server validation chain (theo thứ tự, fail nhanh):
   a. Phone registered (HR Checkin Phone Registration approved)
   b. Tìm HR Office Location gần nhất (haversine), check khoảng cách ≤ allowed_radius_m
   c. Nếu enable_wifi_bssid_check ON + office có BSSID list → wifi_bssid khớp
   d. Nếu enable_webrtc_check ON + office có subnet list → webrtc_local_ip ∈ subnet
   e. Check duplicate window (default 60s)
   f. (Phase 2) Face match selfie với HR Employee photo
8. Insert Employee Checkin với custom fields
9. PWA hiển thị "✓ Đã chấm công"
```

---

## 3. Vòng đời WFH checkin

Gated by feature flag `enable_wfh_mode`.

```
1. Manager tạo HR WFH Approval cho nhân viên ngày X (qua Desk hoặc PWA)
2. Sáng ngày X, nhân viên mở PWA
3. PWA fetch get_attendance_info → response có wfh_today.active = true
4. PWA hiện trang "Hôm nay bạn được WFH" thay HomePage thường
5. Tap "Bắt đầu ca WFH" → chỉ chụp selfie + GPS audit (không enforce radius)
6. POST checkin_wfh
7. Server validate: WFH mode ON + approval submitted hôm nay
8. Insert Employee Checkin với source=WFH-PWA + link approval
```

---

## 4. Anti-cheat layers

Strength tổng phụ thuộc tổ hợp feature flag bật.

| Lớp | Always-on | Strength | iOS support |
|---|---|---|---|
| GPS radius check | ✅ | ⭐⭐⭐ | ✅ |
| Phone fingerprint binding | ✅ | ⭐⭐⭐ | ✅ |
| Selfie audit (manual review) | ✅ | ⭐⭐⭐ | ✅ |
| Duplicate check (60s window) | ✅ | ⭐⭐ | ✅ |
| Wifi BSSID check | Optional (flag) | ⭐⭐⭐⭐ | ❌ iOS Safari block |
| WebRTC local IP check | Optional (flag) | ⭐⭐⭐⭐ | ✅ |
| Face match auto (phase 2) | Optional (flag) | ⭐⭐⭐⭐⭐ | ✅ |

### 4.1 GPS radius — `utils/geo.py`

`haversine_distance_m(lat1, lng1, lat2, lng2) -> float` — haversine formula trên trái đất bán kính 6371km. Server iterate qua `HR Office Location` active, tìm office distance min, so với `office.allowed_radius_m or settings.default_radius_m`.

### 4.2 Phone fingerprint binding

SHA256 từ browser fingerprint (userAgent, screen size, color depth, timezone, language). Lookup:
```sql
SELECT name FROM `tabHR Checkin Phone Registration`
WHERE employee = %s AND device_fingerprint = %s
  AND docstatus = 1 AND status = 'Active'
LIMIT 1
```

### 4.3 Wifi BSSID — Android only

```python
if settings.enable_wifi_bssid_check and office.allowed_wifi_bssids:
    bssid_lower = (wifi_bssid or "").lower()
    allowed = [w.bssid for w in office.allowed_wifi_bssids]
    if bssid_lower not in allowed:
        raise checkin_error("WIFI_MISMATCH", "...")
```

iOS Safari block WiFi BSSID access — only Android works. Khi bật flag này nhưng employee dùng iOS, server skip check (vì PWA không gửi `wifi_bssid`).

### 4.4 WebRTC local IP — `utils/subnet.py`

`ip_in_any_subnet(ip_str, cidr_list) -> bool` using Python stdlib `ipaddress`. PWA side dùng WebRTC ICE candidates để lấy local IP — chi tiết ở [API §4](HR-Attendance-API.html#4-webrtc-local-ip-detection).

### 4.5 Duplicate window

```python
last = frappe.db.get_value(
    "Employee Checkin", {"employee": employee.name},
    "time", order_by="time desc"
)
if last and (now - last).seconds < settings.duplicate_window_seconds:
    raise checkin_error("DUPLICATE_CHECKIN", "...")
```

### 4.6 Face match (phase 2 stub)

Hiện tại stub `_match_face(selfie_url, employee) -> bool` return True. Phase 2 implement:
- Option A: `face_recognition` Python lib server-side
- Option B: AWS Rekognition / Azure Face / GCP Vision API

---

## 5. Lựa chọn kỹ thuật quan trọng

### Tại sao multiple HR Office Location thay vì Single Settings?

- Company có nhiều chi nhánh (Q1, Q3, Hà Nội, Đà Nẵng) — mỗi VP có GPS riêng
- Server tìm nearest office khi checkin → nhân viên di chuyển giữa các VP vẫn chấm OK
- Khi disable 1 office → mark `is_active=0`, không phải xóa

### Tại sao extend Employee Checkin của HRMS?

- HRMS có sẵn report Attendance, Payroll integration → tận dụng
- Manual checkin từ HR Manager qua Desk vẫn dùng được
- Custom fields chỉ thêm metadata cho audit, không phá vỡ logic gốc

**HRMS downstream workflow chạy tự động** (không cần code thêm):

```
PWA tap "Chấm công"
  → api.attendance.checkin insert Employee Checkin (IN/OUT log)

HRMS scheduled job "Process Auto Attendance" (hourly):
  → Đọc các Employee Checkin trong ngày, group theo employee + shift
  → Tính giờ làm = OUT - IN, late_entry/early_exit theo Shift Type
  → Tạo Attendance record (Present/Absent/Half Day/On Leave)

Cuối tháng tạo Salary Slip:
  → Đọc Attendance records → áp Salary Structure → tính lương
```

Pre-requisite: Employee phải có `Default Shift` (Shift Type) assigned, và `Shift Type.Enable Auto Attendance = 1`. Nếu thiếu, log vẫn ghi nhưng Attendance không tạo tự động.

### Tại sao feature flag default OFF?

- WFH chưa test giờ chính sách → để admin enable khi sẵn sàng
- Wifi BSSID + WebRTC cần verify mạng các chi nhánh → cần thu thập data trước
- Default off = an toàn cho deployment đầu tiên

### Tại sao bỏ ESP32 + QR rotation?

Pivot history: dự án từng có ESP32 + TFT + QR rotation thiết kế hardware-side.

- UX trade-off của wifi-AP / captive portal không đáng
- Vân tay (R503 fingerprint) đã consider rồi nhưng nhược: bottleneck giờ cao điểm, hygiene, không cho WFH
- Phone-only: deploy nhanh, không hardware maintenance, scale linear, support WFH out-of-box

Firmware code preserved trong commit `7c61481` của repo nếu cần khôi phục.

### Feature flag mechanics (per-Company, request-level caching)

Settings là **regular doctype, 1 record per Company** (unique constraint trên `company` field). Lookup theo `Employee.company`, cache request-level. Helpers ở `hr_for_cobegroup/utils/settings.py`:

```python
def get_settings_for_employee(employee_name: str):
    cache_key = f"_attendance_settings_emp_{employee_name}"
    if hasattr(frappe.local, cache_key):
        return getattr(frappe.local, cache_key)
    company = frappe.db.get_value("Employee", employee_name, "company")
    if not company:
        frappe.throw(_("Employee {0} chưa có Company...").format(employee_name))
    doc = get_settings_for_company(company)
    setattr(frappe.local, cache_key, doc)
    return doc

def get_settings_for_company(company: str):
    cache_key = f"_attendance_settings_co_{company}"
    if hasattr(frappe.local, cache_key):
        return getattr(frappe.local, cache_key)
    name = frappe.db.get_value("HR Attendance Policy", {"company": company}, "name")
    if not name:
        frappe.throw(_("Company {0} chưa có HR Attendance Policy...").format(company))
    doc = frappe.get_cached_doc("HR Attendance Policy", name)
    setattr(frappe.local, cache_key, doc)
    return doc
```

Đổi flag → có hiệu lực ngay request tiếp theo. Không cần bench restart.

**Bootstrap** (cả fresh install lẫn migrate):
- `hooks.py.after_install` → `hr_for_cobegroup.install.after_install` → seed 1 record / Company
- Patch `patches/v0_002/migrate_settings_to_per_company.py` cho existing sites — idempotent
- Salvage legacy `tabSingles` rows nếu doctype cũ từng là Single → gán cho Company đầu tiên

### Multi-office logic — linear scan

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

    nearest, nearest_dist = None, float("inf")
    for o in offices:
        d = haversine_distance_m(lat, lng, o.location_latitude, o.location_longitude)
        if d < nearest_dist:
            nearest, nearest_dist = o, d
    return nearest, nearest_dist
```

Linear scan OK cho <50 offices. Scale lớn hơn → spatial index (PostGIS hoặc bounding box pre-filter).

---

## 6. Routing — PWA served at `/attendance`

Mirror fsmnext `/technician` pattern. Same URL ở local lẫn Frappe Cloud, không phải đổi config.

```
HTTP request: /attendance hoặc /attendance/<sub-path>
  ↓
hooks.py website_route_rules → to_route = "_attendance"
  ↓
www/_attendance.py get_context():
  - Redirect Guest → /login?redirect-to=/attendance
  - Resolve Employee from frappe.session.user
  - Inject CSRF token + user info + version_hash
  ↓
www/_attendance.html render:
  - Load /assets/hr_for_cobegroup/attendance-pwa/index.{js,css}?v=<hash>
  - Set window.frappe_csrf_token + window.user + window.employee
  - <div id="root"> → React mount, basename "/attendance"
```

PWA build output ở `hr_for_cobegroup/public/attendance-pwa/` được **commit vào git** (mirror fsmnext) — Frappe Cloud chỉ cần `bench build` symlink sang `sites/assets/`, không cần Node.js trên deploy server.

---

## 7. Folder structure

```
apps/hr_for_cobegroup/
├── hr_for_cobegroup/                  # Frappe app
│   ├── api/
│   │   ├── attendance.py              # checkin (onsite + WFH)
│   │   ├── phone_device.py            # phone registration
│   │   └── wfh.py                     # WFH approval flow
│   ├── attendance/                    # Module
│   │   └── doctype/
│   │       ├── hr_office_location/
│   │       ├── hr_office_wifi/         (child)
│   │       ├── hr_office_lan_subnet/   (child)
│   │       ├── hr_checkin_phone_registration/
│   │       ├── hr_wfh_approval/
│   │       └── hr_attendance_settings/ (Single, feature flags)
│   ├── utils/
│   │   ├── geo.py                     # haversine
│   │   └── subnet.py                  # CIDR check for WebRTC
│   ├── fixtures/
│   │   └── custom_field.json          # 10 fields on Employee Checkin
│   ├── www/
│   │   ├── _attendance.py             # SPA shell context provider
│   │   └── _attendance.html           # PWA HTML template
│   ├── public/
│   │   └── attendance-pwa/            # Vite build output (COMMITTED)
│   ├── hooks.py
│   └── modules.txt
└── frontend/
    └── attendance-pwa/                # React + TS + Vite + antd source
        └── src/
            ├── pages/
            │   ├── HomePage.tsx       # Onsite checkin CTA + WFH banner
            │   ├── SelfiePage.tsx     # Selfie capture + submit
            │   ├── HistoryPage.tsx
            │   ├── RegisterDevicePage.tsx
            │   └── WFHRequestPage.tsx
            └── utils/
                └── webrtcLocalIp.ts
```

Tech docs **không còn** trong `apps/hr_for_cobegroup/docs/` — đã move sang [cobe_erp_documents/tech/](.).

---

## 8. Deployment topology

```
            ┌────────────────────────┐
            │   Frappe Server        │
            │   erp.cobegroup.com    │
            └───────────▲────────────┘
                        │ HTTPS
       ┌────────────────┼────────────────┐
       │                │                │
  ┌────┴────┐      ┌────┴────┐     ┌────┴────┐
  │ Phone A │      │ Phone B │     │ Phone C │
  │ (Onsite │      │ (WFH    │     │ (Onsite │
  │  VP Q1) │      │  ngày X)│     │  VP Q3) │
  └─────────┘      └─────────┘     └─────────┘
```

Mỗi nhân viên 1 phone. Không hardware bên VP. Multi-office support qua HR Office Location.

---

## Liên quan

- [HR Attendance — API Contract](HR-Attendance-API.html) — endpoint spec + error codes + sequence diagrams
- [HR Attendance — Tech Overview](HR-Attendance-Tech.html) — integrator quick reference
- [User guide tổng quan](../users/Cham-Cong-Tong-Quan.html)
