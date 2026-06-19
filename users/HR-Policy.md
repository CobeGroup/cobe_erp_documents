---
title: HR Policy
layout: default
parent: Chấm công & HR
nav_order: 2
---

# HR Policy — Cấu hình per-Company (Attendance)

> **Mỗi Company 1 record riêng**. Hệ thống tự tạo 1 record với defaults cho mỗi Company hiện có lúc install. Khi tạo Company mới, HR Manager / System Manager tự tạo Policy cho Company đó.
>
> Permissions: **HR Manager** và **System Manager**.
>
> Đổi tên từ "HR Attendance Policy" — scope mở rộng (thêm Whitelist). OT / WFH Salary / KPI sẽ thêm tab khi Phase 2 quay lại.
>
> **Cấp phép năm**: KHÔNG còn cấp theo chấm công ở HR Policy. Giờ dùng **HRMS Earned Leave native** (Leave Type bật `is_earned_leave` + Leave Policy Assignment). Chi tiết ở [HR Leave Setup](HR-Leave-Setup.html).

---

## Mục lục

1. [Cách mở](#1-cách-mở)
2. [Cấu trúc tab](#2-cấu-trúc-tab)
3. [Tab Attendance](#3-tab-attendance)
   - [3.1. Feature Flags](#31-feature-flags)
   - [3.2. Defaults](#32-defaults)
   - [3.3. Lunch Break](#33-lunch-break)
   - [3.4. Overtime Notification](#34-overtime-notification)
   - [3.5. Check-in Whitelist](#35-check-in-whitelist)
4. [Cấp phép năm (Earned Leave)](#4-cấp-phép-năm-earned-leave)
5. [Kịch bản roll-out theo giai đoạn](#5-kịch-bản-roll-out-theo-giai-đoạn)
6. [Lưu ý vận hành](#6-lưu-ý-vận-hành)

---

## 1. Cách mở

- Desk → search "HR Policy"
- URL: `/app/hr-policy`

List view hiển thị: `name` (vd `HRP-Cobegroup`), `company`, `enable_wfh_mode`, `default_radius_m`.

---

## 2. Cấu trúc tab

1 tab hiện tại:

| Tab | Section |
|---|---|
| **Attendance** | Feature Flags + Defaults + Lunch Break + Overtime Notification + Check-in Whitelist |

---

## 3. Tab Attendance

### 3.1. Feature Flags

#### `enable_selfie_capture` (Check, default: 0)
Bật yêu cầu chụp ảnh selfie khi chấm công.

#### `enforce_checkout_same_office` (Check, default: 1)
Bắt buộc check-out tại cùng VP với check-in cùng ngày.

#### `enable_wfh_mode` (Check, default: 0)
Bật flow WFH cho NV đã được duyệt WFH.

#### `enable_webrtc_check` (Check, default: 0)
Kiểm tra WebRTC local IP — defend fake GPS trên iOS.

#### `enable_wifi_bssid_check` (Check, default: 0)
Kiểm tra WiFi BSSID — defend fake GPS trên Android.

#### `enable_face_match` (Check, default: 0)
Phase 2 — chưa implement.

### 3.2. Defaults

#### `default_radius_m` (Int, default: 100)
Bán kính GPS mặc định nếu `HR Office Location` chưa đặt riêng.

#### `duplicate_window_seconds` (Int, default: 60)
Chặn chấm liên tục trong N giây.

### 3.3. Lunch Break

> **working_hours = min(last_out, shift_end) - first_in - lunch_break.** Cobe **cap** `working_hours` về giờ ca chuẩn — NV làm thêm sau giờ tan ca KHÔNG tự cộng vào working_hours. Sau khi Attendance insert, hệ thống tự **notify** NV nếu vượt 30 phút sau shift end để NV biết submit OT Request.

> **Trừ giờ nghỉ trưa tự động vào `working_hours` của Attendance.**

Logic: hook `Attendance.before_save` kiểm tra **first check-in time** của ngày:
- **Trước mốc** `lunch_start_time` → trừ `lunch_break_minutes` khỏi `working_hours`
- **Sau mốc** (NV đi làm chiều) → KHÔNG trừ

#### `lunch_start_time` (Time, default: 12:00:00)
Mốc bắt đầu nghỉ trưa. Vd NV check-in 8:00 (< 12:00) → trừ. Check-in 14:00 (> 12:00) → không trừ.

#### `lunch_break_minutes` (Int, default: 60)
Số phút nghỉ trưa trừ vào working_hours. Set 0 = tắt auto-trừ break toàn Company.

#### Override per Shift Type

Mỗi Shift Type có 2 custom field optional:
- `custom_lunch_start_time` (Time) — đè `lunch_start_time` của HR Policy nếu set
- `custom_lunch_break_minutes` (Int) — đè `lunch_break_minutes` nếu set giá trị (kể cả 0 — vd KTV không có break)

Use case:
- Office break trưa 12:00-13:00 (60 phút): HR Policy default
- KTV không có break (vẫn làm 12h trên đường đi field): Shift Type "KTV 8h-17h" → set `custom_lunch_break_minutes = 0`
- Tư vấn break dài 12:00-13:30 (90 phút): Shift Type "Tư vấn 9h-18h" → set `custom_lunch_break_minutes = 90`

#### ⚠️ Lưu ý quan trọng config Shift Type

Khi bật auto-trừ break, Shift Type **PHẢI** chọn:
- `Working Hours Calculation Based On = First Check-in and Last Check-out`

Combo `Every Valid Check-in and Check-out` đã tự cộng dồn cặp IN/OUT (đã trừ break giữa) → hook Cobe trừ thêm = **double-trừ sai**. Set 0 break trong HR Policy nếu muốn dùng combo Every Valid.

#### Working_hours minimum

Hook `max(0, working_hours - break)` — không bao giờ trả số âm. NV làm chỉ 30 phút + bị trừ 60 phút → working_hours = 0 (status sẽ Absent/Half Day theo threshold của Shift Type).

### 3.4. Overtime Notification

> Cảnh báo NV khi check OUT muộn hơn shift_end > N phút — gợi ý tạo OT Request nếu muốn tính lương OT. **Set cả flag `hr_warning_type = "Làm thêm sau giờ"` + Notification Log (bell icon).**

#### `notify_overtime_threshold_minutes` (Int, default: 30)

Ngưỡng phút sau `shift_end` để trigger:
1. Set `Attendance.hr_warning_type = "Làm thêm sau giờ"` — HR filter list view nhanh
2. Tạo Notification Log cho NV + Manager — bell icon

- Default 30 phút → NV ra muộn 30+ phút sẽ thấy thông báo.
- Set 0 = **tắt cả warning + notify** cho Company.

#### `hr_warning_type` — 1 flag chung cho mọi cảnh báo

| Value | Khi nào set | Priority |
|---|---|---|
| `Không có ca` | Whitelist không SA / Office không Shift | 1 (cao nhất) |
| `Quên check-in` | Có log chỉ có OUT | 2 |
| `Quên check-out` | Có log chỉ có IN | 2 |
| `Làm thêm sau giờ` | Có đủ IN+OUT, OUT > shift_end + threshold | 3 |
| (clear) | OK / On Leave | — |

Loại trừ nhau (1 record = 1 trạng thái). Priority cao thắng — vd vừa OT + thiếu IN → flag = "Quên check-in".

#### Notification Log

Cùng lúc set flag → tự gửi Notification Log cho NV (qua `Employee.user_id`) và Manager (`Employee.leave_approver`). Idempotent 1 notify / Attendance / type.

Notification text khác nhau theo type:
- "Không có ca": HR cần kiểm tra Shift Assignment / SA
- "Quên check-in/out": NV vui lòng tạo Attendance Request bù
- "Làm thêm sau giờ": NV tạo HR Overtime Request nếu cần tính OT

### 3.5. Check-in Whitelist

> **Mục đích**: KTV / Sales làm việc ngoài VP — không thể chấm công gần office radius. Whitelist cho phép họ check-in/out ở bất kỳ đâu.

#### Hoạt động

NV có mặt trong `whitelist_employees`:
- **Skip GPS radius / WiFi / WebRTC** (không cần ở gần VP)
- **Vẫn enforce**: duplicate window, phone fingerprint, selfie (nếu flag ON)
- **Server thêm warning** trong response checkin nếu hôm đó không có FS Service Appointment

#### Field `whitelist_employees` (Child Table)

| Field | Type | Note |
|---|---|---|
| `employee` | Link → Employee | reqd |
| `employee_name` | Data | fetch_from, read-only |
| `designation` | Data | fetch_from, read-only |
| `reason` | Small Text | "KTV đi field", "Sales gặp khách"... |

#### Tích hợp FS Service Appointment

Khi NV whitelist check-in:
- Server query `FS Service Appointment` của ngày hôm đó (qua FS Service Resource gán với employee)
- Có ≥1 SA → bình thường
- Không có SA → response trả `warning` + Attendance.before_save hook set `hr_warning_type = "Không có ca"`

#### Quản lý list

Add row → Save → hiệu lực ngay request kế tiếp. Xóa: xóa row + Save (không có flag enable per row).

---

## 4. Cấp phép năm (Earned Leave)

> **HR Policy KHÔNG còn cấu hình cấp phép.** Tab "Leave" + 4 field `leave_auto_*` đã gỡ (patch v0_009). Cấp phép tự động theo chấm công đã ngưng.

Phép năm giờ dùng **HRMS Earned Leave native**:
- Leave Type bật `is_earned_leave` → HRMS tự tích lũy phép định kỳ.
- Cấp cho NV qua **Leave Policy Assignment**.

Chi tiết setup, workflow và audit ở [HR Leave Setup](HR-Leave-Setup.html).

---

## 5. Kịch bản roll-out theo giai đoạn

### Giai đoạn 1 — Phase 1 baseline
```
Tab Attendance:
  - Feature Flags: tất cả flag = 0 (mặc định OFF), default_radius_m = 100
  - Check-in Whitelist: thêm KTV / Sales của Company
```

### Giai đoạn 2 — Bật anti-cheat layer
```
enable_wifi_bssid_check: 1   (sau enroll BSSID vào HR Office Location)
enable_webrtc_check:     1   (sau enroll subnet)
```

### Giai đoạn 3 — Bật WFH
```
enable_wfh_mode: 1
```
> Phép năm cấu hình riêng qua HRMS Earned Leave — xem [HR Leave Setup](HR-Leave-Setup.html).

### Phase 2+ (sau này)
Sẽ thêm tab Overtime / WFH Salary / Exclusions khi release Phase 2.

---

## 6. Lưu ý vận hành

- **Mỗi Company 1 record** — DB enforce unique trên `company`
- **Employee chưa có Company** → throw "Employee {X} chưa có Company"
- **Company chưa có HR Policy** → throw "Company {X} chưa có HR Policy". HR cần tạo trước
- **Đổi flag có hiệu lực ngay** — cache request-level invalidate ở request tiếp theo
- **Whitelist hiệu lực ngay** — add row + Save → request kế tiếp đã skip GPS
- **Khẩn cấp chặn check-in toàn Company** — không có flag tắt toàn bộ. Workaround: `is_active = 0` cho tất cả HR Office Location của Company → trả `NO_ACTIVE_OFFICE`

---

## Liên quan

- [Tổng quan & Setup](Cham-Cong-Tong-Quan.html)
- [HR Office Location](HR-Office-Location.html)
- [HR Checkin Phone Registration](HR-Checkin-Phone-Registration.html)
- [HR WFH Approval](HR-WFH-Approval.html)
- [Holiday & Shift Setup](HR-Holiday-Shift-Setup.html)
- [HR Leave Setup](HR-Leave-Setup.html)
