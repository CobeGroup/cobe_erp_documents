---
title: HR Overtime Settings (Cấu hình OT)
layout: default
parent: Chấm công & HR
nav_order: 9
---

# HR Overtime Settings — Cấu hình OT

> Single doctype quản lý multiplier, caps, auto-approve và exclusions cho hệ thống Overtime. **HR Manager** + **System Manager** edit được.
>
> Thay đổi áp dụng lên tất cả [HR Overtime Request](HR-Overtime-Request.html) tạo sau thời điểm save.

---

## Mục lục

1. [Cách mở](#1-cách-mở)
2. [Multiplier Rules — cốt lõi](#2-multiplier-rules--cốt-lõi)
3. [Overtime Rules (round, min)](#3-overtime-rules-round-min)
4. [Caps (tối đa giờ/ngày, giờ/tháng)](#4-caps-tối-đa-giờngày-giờtháng)
5. [Auto Approve](#5-auto-approve)
6. [Exclusions (loại trừ designation / employee)](#6-exclusions-loại-trừ-designation--employee)
7. [Salary Component cho OT](#7-salary-component-cho-ot)
8. [Tắt toàn bộ OT system](#8-tắt-toàn-bộ-ot-system)
9. [Sự cố thường gặp](#9-sự-cố-thường-gặp)

---

## 1. Cách mở

- Desk → search "HR Overtime Settings"
- URL: `/app/hr-overtime-settings`

---

## 2. Multiplier Rules — cốt lõi

Bảng `multipliers` quy định **hệ số nhân tiền OT** theo loại ngày. Mặc định sau `bench install`:

| Day Type | Multiplier | Description |
|---|---|---|
| Weekday | 1.5 | Làm thêm ngày thường (sau giờ hành chính) |
| Weekend | 2.0 | Làm thêm Chủ Nhật / Thứ Bảy weekly off |
| Holiday | 3.0 | Làm thêm ngày trong Holiday List (Tết, lễ) |

Có thể edit trực tiếp các row, hoặc add row mới (nhưng `day_type` phải unique).

### Day Type được xác định thế nào?

Khi nhân viên submit HR Overtime Request, server tự classify:
1. Check `date` có trong Holiday List của Employee (hoặc Company default) với `weekly_off=0` → **Holiday**
2. Check `date` có trong Holiday List với `weekly_off=1` → **Weekend**
3. Fallback: nếu `weekday() >= 5` (Saturday/Sunday) → **Weekend**
4. Còn lại → **Weekday**

→ Khuyến nghị: setup Holiday List đầy đủ trước khi nhân viên submit OT (xem [Shift Type Setup §4](HRMS-Shift-Type-Setup.html#4-tạo-holiday-list)).

---

## 3. Overtime Rules (round, min)

### `min_overtime_minutes` (default 30)

OT request có duration < 30 phút sẽ bị reject lúc submit. Tránh nhân viên claim OT 5 phút.

### `round_to_minutes` (default 15)

Làm tròn **xuống** bội số của N phút. Ví dụ:
- OT 1h35 phút → 1h30 (làm tròn xuống 15)
- OT 1h59 phút → 1h45

→ Set 15 là chuẩn ngành. Set 30 nếu muốn ép nhân viên OT theo half-hour.

---

## 4. Caps (tối đa giờ/ngày, giờ/tháng)

### `max_overtime_hours_per_day` (default 4)

1 OT request **không vượt** 4 giờ. Submit > 4h sẽ bị throw error.

→ Theo Luật Việt Nam, OT không quá 4h/ngày nếu kết hợp với 8h ca chính (tổng 12h/ngày).

### `max_overtime_hours_per_month` (default 40)

Tổng OT trong 1 tháng của 1 employee **không vượt** 40h. Server tự tính tổng các OT Request (mọi status trừ Rejected) trong cùng tháng.

→ Luật cho phép 40h/tháng, 200h/năm. Cobe set 40h tháng là an toàn.

---

## 5. Auto Approve

### `auto_approve_below_hours` (default 0)

Nếu OT request có `duration_hours ≤ threshold` này → auto approve khi submit, không cần Manager bấm.

- Set `0` = tắt auto, mọi request đều cần duyệt tay
- Set `2` = OT ≤ 2h auto Approve, > 2h vẫn cần duyệt
- Set `4` = mọi OT đến tối đa cap (4h) đều auto Approve

→ **Khuyến nghị Cobe**: bắt đầu với `0` (mọi OT cần duyệt). Khi đã trust nhân viên hơn thì tăng dần.

---

## 6. Exclusions (loại trừ designation / employee)

### Excluded Designations

Danh sách các Designation **không được submit OT** (ví dụ Giám đốc, Trưởng phòng). Submit OT cho nhân viên có designation này sẽ throw error.

Cách config:
1. Tab **Exclusions** → bảng "Excluded Designations" → **Add Row**
2. Chọn Designation (vd "Giám đốc")
3. Điền `reason` (vd "Lương khoán")

### Excluded Employees

Danh sách nhân viên cá nhân không được OT (vd trợ lý CEO, lương khoán cá nhân).

Cách config:
1. Tab **Exclusions** → bảng "Excluded Employees" → **Add Row**
2. Chọn Employee
3. Điền `reason`

### Thứ tự check

Server check **Excluded Employees trước** → nếu không có thì check **Excluded Designations**. Cả 2 đều match → block.

---

## 7. Salary Component cho OT

### `salary_component` (default "Overtime")

Khi OT Request được approve, server tạo 1 record `Additional Salary` với `salary_component` này. Sau đó Salary Slip kỳ tới sẽ tự bao gồm.

Cobe mặc định component "Overtime" type Earning, auto-create lúc `bench install`. Có thể đổi sang component khác nếu cần.

→ **Lưu ý**: đổi component này KHÔNG ảnh hưởng các OT Request đã approve (Additional Salary của chúng đã link tới component cũ).

---

## 8. Tắt toàn bộ OT system

### `enabled` (Check, default 1)

Khi tắt:
- Mọi attempt submit HR Overtime Request → throw "Hệ thống OT đang tắt"
- Các record đã submit + approve trước đó **vẫn giữ nguyên** (không ảnh hưởng)

→ Dùng khi:
- Cuối năm freeze OT để chốt sổ
- Đang debug, tạm tắt để clean
- Policy thay đổi, đang waiting công bố

---

## 9. Sự cố thường gặp

### 9.1. Nhân viên submit OT báo "Hệ thống OT đang tắt"

→ Mở Settings → `enabled = 1` → Save.

### 9.2. Submit OT báo vượt cap, nhưng nhân viên chưa submit gì tháng này

→ Có thể tổng tính cả các record DRAFT chưa Submit. Filter Desk → HR Overtime Request → employee=X, month=Y, docstatus<2 → xem có draft cũ không. Cancel/Delete draft cũ nếu không dùng.

### 9.3. Multiplier auto = 1.0 dù có rule Weekday=1.5

→ Có thể Multiplier Rules bị trống trong Settings. Mở Settings → check tab Multipliers → re-add 3 row.

→ Hoặc patch `bootstrap_compensation` chưa chạy: `bench --site cobe.cc migrate` (patch sẽ seed defaults).

### 9.4. Nhân viên Senior Manager submit OT vẫn pass

→ Designation "Senior Manager" chưa add vào Excluded Designations. Thêm row vào tab Exclusions.

### 9.5. Đổi multiplier 1.5 → 2.0, OT request đã approve có update không?

→ **KHÔNG**. Multiplier được snapshot vào field `multiplier` của HR Overtime Request lúc validate. Sửa Settings chỉ ảnh hưởng request submit từ thời điểm sau.

→ Muốn re-apply: cancel OT Request cũ → submit lại request mới.

---

## Liên quan

- [HR Overtime Request](HR-Overtime-Request.html) — workflow submit + approve
- [Shift Type & Auto Attendance](HRMS-Shift-Type-Setup.html) — Holiday List
- [Compensatory Leave (Comp-Off)](HRMS-Comp-Off.html) — option ngược lại (nghỉ bù thay vì nhận tiền)
