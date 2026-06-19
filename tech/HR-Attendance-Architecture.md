---
title: HR Attendance — Architecture
layout: default
parent: Tài liệu kỹ thuật
nav_order: 4
---

# Architecture — Phone-only HR Attendance

## Quyết định kiến trúc gần đây (Cách B — HRMS-first)

- **UI luôn của hr_for_cobegroup** (PWA `/my-workspace`); **backend ưu tiên gọi HRMS
  native**, chỉ tự code phần mở rộng custom (GPS/selfie/thiết bị/office/whitelist/
  lunch/warning).
- **WFH** nguồn từ HRMS `Attendance Request` (reason="Work From Home"); `HR WFH Approval`
  deprecated. Check-in WFH GPS/selfie (custom) giữ lại, gate vào AR đã duyệt.
- **Số dư/loại phép** gọi HRMS `get_leave_details`/`get_leave_balance_on` (không tự SUM).
- **Cấp phép tự động** = Earned Leave native (bỏ job theo chấm công + field `leave_auto_*`).
- **Guardrails `/hrms`**: redirect nhân viên thường về `/my-workspace` (embed-safe) +
  khóa create/write Employee Checkin của role Employee → mọi check-in buộc qua endpoint
  có luật GPS. HR/Admin vẫn vào `/hrms`.
- **FSM** `/fsm` nhúng `/technician` FULLSCREEN (nav riêng của technician), thêm thanh
  "← Về My Workspace". KTV chấm công qua my-workspace: fsmnext skip device-gating khi
  `custom_checkin_source` = `*-PWA` (xem HR-Attendance-API §9).
- **Push notification**: FCM stack **độc lập** (HR Push Settings / HR Push Device /
  `api/push.py`) — không dùng chung với FCM của fsmnext. Hook Notification Log → đẩy push.
  Xem HR-Attendance-API §3.11.
- **Onboarding**: nút float "?" + Drawer hướng dẫn, tự mở lần đầu (localStorage
  `mw_guide_seen_v1`), mở lại bất kỳ lúc nào — `OnboardingGuide` ở App shell.
- **PWA branding**: tên cài home screen = **"TGDG - MyWorkspace"** (manifest
  `short_name`/`name` cho Android + `apple-mobile-web-app-title`/`<title>` trong
  `_my_workspace.html` cho iOS). App icon = biểu tượng giọt nước TGĐG (`icon-192/512`).
  Header gradient thương hiệu `#299dd8 → #54ab78`; màu primary toàn app + `theme-color`
  (status bar) = `#299dd8`.
- **FAB đồng nhất**: `styles/fab.ts` (`FAB_PRIMARY_STYLE` / `FAB_HELP_STYLE`) — mọi nút
  nổi (Đề xuất, + Nghỉ phép, + Chi phí, ? trợ giúp) cùng right/z-index (1001, trên nav
  bar z-1000) + `bottom: calc(... + env(safe-area-inset-bottom))` để không bị nav che
  / nhảy trên iPhone.
- **Tự cập nhật**: `VersionProvider` (`hooks/useVersionCheck`) poll `version.json` (lúc
  mount + khi tab visible lại, throttle 5'); hash đổi → `UpdateBanner` hiện notification
  "Có phiên bản mới" + nút Cập nhật (xóa cache + reload). Giải quyết PWA cài về không tự
  lấy bản mới khi mở lại (giống cơ chế app technician).
- **Routing**: PWA served tại `/my-workspace` (không phải `/attendance`).

Chi tiết contract + patch: xem `HR-Attendance-API` §9.

## Tổng quan

Sau pivot, hệ thống chỉ còn 2 thành phần:

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
│  - HR Phone Reg         │  Device-aware (fingerprint)
│  - Attendance Request   │  WFH nguồn HRMS (reason=WFH)
│  - HR Policy            │  per-Company — feature flags
│  - Employee Checkin     │  Extend HRMS + custom fields
└─────────────────────────┘
```

## Vòng đời 1 lần chấm công onsite

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

## Vòng đời WFH checkin (feature-flag gated)

```
1. NV đăng ký WFH ngày X qua PWA → tạo Attendance Request (reason="Work From Home")
2. Manager duyệt qua tab "Cần duyệt" → submit AR → HRMS tự tạo Attendance status=WFH
3. Sáng ngày X, NV mở PWA
4. PWA fetch get_attendance_info → wfh_today.active = true (có AR WFH đã duyệt phủ hôm nay)
5. Tap "Bắt đầu ca WFH" → chụp selfie + GPS audit (không enforce radius)
6. POST checkin_wfh
7. Server validate: WFH mode ON + AR WFH (docstatus=1) hôm nay
8. Insert Employee Checkin source=WFH-PWA + custom_wfh_approval = <AR name>
```

## Anti-cheat layers

Strength tổng phụ thuộc tổ hợp feature flag bật:

| Lớp | Always-on | Strength | iOS support |
|---|---|---|---|
| GPS radius check | ✅ | ⭐⭐⭐ | ✅ |
| Phone fingerprint binding | ✅ | ⭐⭐⭐ | ✅ |
| Selfie audit (manual review) | ✅ | ⭐⭐⭐ | ✅ |
| Wifi BSSID check | Optional (flag) | ⭐⭐⭐⭐ | ❌ iOS Safari block |
| WebRTC local IP check | Optional (flag) | ⭐⭐⭐⭐ | ✅ |
| Face match auto (phase 2) | Optional (flag) | ⭐⭐⭐⭐⭐ | ✅ |

## Lựa chọn kỹ thuật quan trọng

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

### Tại sao feature flag không enforce default?

- WFH chưa test giờ chính sách → để admin enable khi sẵn sàng
- Wifi BSSID + WebRTC cần verify mạng các chi nhánh → cần thu thập data trước
- Default off = an toàn cho deployment đầu tiên

### Tại sao bỏ ESP32?

- Phân tích dài trên conversation: UX trade-off của wifi-AP / captive portal không đáng
- Vân tay đã consider rồi nhưng nhược: bottleneck giờ cao điểm, hygiene, không cho WFH
- Phone-only: deploy nhanh, không hardware maintenance, scale linear, support WFH out-of-box

## Routing — PWA served at `/my-workspace`

Mirror fsmnext `/technician` pattern. Same URL ở local lẫn Frappe Cloud, không phải đổi config.

```
HTTP request: /my-workspace hoặc /my-workspace/<sub-path>
  ↓
hooks.py website_route_rules → to_route = "_my_workspace"
  ↓
www/_my_workspace.py get_context():
  - Redirect Guest → /login?redirect-to=/my-workspace
  - Resolve Employee from frappe.session.user
  - Inject CSRF token + user info + version_hash + roles
  - window.inbox_access (tab "Cần duyệt"), window.is_technician (tab FSM)
  ↓
www/_my_workspace.html render:
  - Load /assets/hr_for_cobegroup/attendance-pwa/index.{js,css}?v=<hash>
  - Set window.frappe_csrf_token + window.user + window.employee + ...
  - <div id="root"> → React mount, basename "/my-workspace"
```

> Lưu ý: app `before_request` (utils.hrms_gate) redirect nhân viên thường từ `/hrms`
> (app HRMS gốc) về `/my-workspace` — xem HR-Attendance-API §9.

PWA build output ở `hr_for_cobegroup/public/attendance-pwa/` được **commit vào git** (mirror fsmnext) — Frappe Cloud chỉ cần `bench build` symlink sang `sites/assets/`, không cần Node.js trên deploy server.

## Folder structure (post-refactor)

```
apps/hr_for_cobegroup/
├── hr_for_cobegroup/                  # Frappe app
│   ├── api/
│   │   ├── attendance.py              # checkin (onsite + WFH) + get_attendance_info
│   │   ├── phone_device.py            # phone registration (device-aware)
│   │   ├── wfh.py                     # WFH qua Attendance Request
│   │   ├── attendance_request.py      # chấm công bù / On Duty (Attendance Request)
│   │   ├── leave.py                   # leave types/balance (HRMS native) + create
│   │   ├── approval.py               # inbox "Cần duyệt" (Leave + Attendance Request)
│   │   ├── notification.py            # Notification Log cho PWA
│   │   ├── push.py                    # FCM độc lập: config + register token + gửi push
│   │   └── session.py                 # get_csrf_token (refresh CSRF)
│   ├── attendance/doctype/
│   │   ├── hr_office_location/ (+ hr_office_wifi, hr_office_lan_subnet child)
│   │   ├── hr_checkin_phone_registration/
│   │   ├── hr_policy/ (+ hr_policy_whitelist_employee child)   # per-Company flags
│   │   ├── hr_approval_inbox_settings/ (+ hr_approval_inbox_doctype child)
│   │   ├── hr_push_settings/           # cấu hình FCM (Single) — xem HR-Attendance-API §3.11
│   │   ├── hr_push_device/             # token FCM theo user/device
│   │   └── hr_wfh_approval/            # DEPRECATED (xem HR-Attendance-API §2.3)
│   ├── utils/
│   │   ├── hr_policy.py               # policy cache + whitelist + lunch
│   │   └── hrms_gate.py               # redirect /hrms → /my-workspace
│   ├── fixtures/custom_field.json      # custom fields Employee Checkin / Attendance / Shift Type / Attendance Request
│   ├── patches/                        # v0_008 (lock checkin perm), v0_009 (drop auto-leave)...
│   ├── www/
│   │   ├── _my_workspace.py            # SPA shell context provider
│   │   └── _my_workspace.html          # PWA HTML template
│   ├── public/attendance-pwa/          # Vite build output (COMMITTED)
│   ├── install.py · hooks.py · modules.txt
├── frontend/attendance-pwa/            # React + TS + Vite + antd
│   └── src/
│       ├── components/AppHeader.tsx · BottomNavigation.tsx · NotificationBell.tsx · OnboardingGuide.tsx
│       ├── contexts/PushContext.tsx · hooks/usePushNotifications.ts   # FCM web push
│       ├── public/firebase-messaging-sw.js   # service worker push (click → /my-workspace)
│       ├── pages/
│       │   ├── Attendance/ (AttendancePage, CheckinTab, AttendanceListTab)
│       │   ├── Leave/ · Salary/ · Expense/ · More/ · Approvals/ · Notifications/ · Wiki/
│       │   ├── FSM/FsmEmbedPage.tsx     # nhúng /technician fullscreen
│       │   ├── RegisterDevicePage.tsx · WFHRequestPage.tsx
│       └── utils/ (deviceFingerprint, webrtcLocalIp, wifiBssid, ...)
```

## Deployment topology

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

