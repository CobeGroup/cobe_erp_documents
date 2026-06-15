---
title: HR Overtime Settings
layout: default
parent: Lương & Thưởng
nav_order: 2
---

# HR Overtime Settings — Cấu hình tăng ca

> Single doctype. Toàn hệ thống 1 record. Quy định cách tính OT cho mọi Company.
>
> Permissions: **HR Manager**, **System Manager**.

---

## Mục lục

1. [Cách mở](#1-cách-mở)
2. [Các field chính](#2-các-field-chính)
3. [Multiplier rules (Hệ số)](#3-multiplier-rules-hệ-số)
4. [Loại trừ (Exclusions)](#4-loại-trừ-exclusions)
5. [Logic tính amount](#5-logic-tính-amount)
6. [Auto-approve](#6-auto-approve)
7. [Kịch bản cấu hình mẫu](#7-kịch-bản-cấu-hình-mẫu)

---

## 1. Cách mở

- Desk → search "HR Overtime Settings"
- URL: `/app/hr-overtime-settings`

---

## 2. Các field chính

### `enabled` (Check)

Bật/tắt toàn module OT. Khi tắt:
- OT Request validate sẽ throw `"Overtime is disabled"`
- Người dùng không tạo được record mới

Default: **0** (tắt). Bật khi đã config xong tất cả setting + multiplier.

### `salary_component` (Link → Salary Component, bắt buộc khi enabled)

Component dùng cho Additional Salary tạo từ OT Request. Mặc định auto-set "Overtime" lúc install.

### `min_overtime_minutes` (Int, default 30)

Mỗi OT Request phải có duration tối thiểu (phút). Dưới ngưỡng → validate throw.

VD: 30 → OT 10 phút không tạo được.

### `round_to_minutes` (Int, default 15)

Round DOWN duration về bội số của field này. VD: 1h 47m, round_to=15 → 1h 45m.

### `auto_approve_below_hours` (Float, default 0)

Nếu OT duration ≤ ngưỡng này → auto approved (không cần manager duyệt). VD: 2 → OT ≤ 2h auto duyệt.

Set 0 để **TẮT auto-approve** (tất cả OT phải manager duyệt).

### `max_overtime_hours_per_day` (Float, default 4)

Cap số giờ OT 1 ngày 1 nhân viên. Vượt → throw `"Exceeds max OT per day"`.

### `max_overtime_hours_per_month` (Float, default 40)

Cap số giờ OT 1 tháng. Tính tổng cộng dồn từ tất cả OT Request docstatus=0 và 1 trong cùng tháng calendar.

---

## 3. Multiplier rules (Hệ số)

Child table `multipliers` (doctype HR Overtime Multiplier Rule):

| day_type | multiplier | description |
|---|---|---|
| Weekday | 1.5 | Tăng ca ngày thường (1.5x lương giờ) |
| Weekend | 2.0 | Tăng ca thứ 7 / Chủ nhật (2x) |
| Holiday | 3.0 | Tăng ca ngày lễ (3x theo luật LĐ) |

3 row trên được seed sẵn lúc install. **Bắt buộc đủ 3 row** — validate sẽ throw nếu thiếu.

Adjust theo quy định công ty:
- Cobe muốn Weekend chỉ 1.8x → sửa row Weekend.multiplier = 1.8
- Có thể thêm row mới với day_type khác **không** — chỉ accept 3 giá trị enum Weekday/Weekend/Holiday

### Cách xác định day_type

Tự động ở OT Request.validate:
1. Check Employee.holiday_list, nếu OT date ∈ Holiday List → `Holiday`
2. Nếu không, check weekday: Saturday/Sunday → `Weekend`
3. Còn lại → `Weekday`

Override thủ công: user có thể edit `day_type` trên OT Request (vd ngày làm bù).

---

## 4. Loại trừ (Exclusions)

### Tab "Exclusions" có 2 child table:

**`excluded_designations`** (HR Compensation Excluded Designation):
- `designation` (Link → Designation)
- `reason` (Text)

Khi OT Request validate, nếu employee.designation ∈ list này → throw `"Designation excluded from overtime"`.

Use case: C-level (CEO, CTO, Director) không được tính OT theo policy công ty.

**`excluded_employees`** (HR Compensation Excluded Employee):
- `employee` (Link → Employee)
- `employee_name` (Data, auto-fill)
- `reason` (Text)

Exclude từng nhân viên cụ thể. Ưu tiên cao hơn designation. Use case: chủ tịch HĐQT, cố vấn ngoài.

---

## 5. Logic tính amount

Khi OT Request validate:

```python
duration_hours = (to_time - from_time - break_minutes) / 60
# round down về bội số round_to_minutes
duration_hours = floor(duration_hours * 60 / round_to_minutes) * round_to_minutes / 60

# Lookup hourly_rate
base = SalaryStructureAssignment.base if exists else Employee.ctc / 12
hourly_rate = base / 220  # 220h tiêu chuẩn 1 tháng

# Multiplier
multiplier = multipliers[day_type].multiplier

# Amount
amount = duration_hours * hourly_rate * multiplier
```

Tất cả các trường intermediate (`duration_hours`, `hourly_rate`, `multiplier`, `amount`) đều save vào OT Request — audit dễ.

---

## 6. Auto-approve

Khi OT Request submit:
- Nếu `duration_hours ≤ auto_approve_below_hours` → `approval_status = "Approved"`, `approved_by = "Administrator"`, tự tạo Additional Salary ngay
- Nếu vượt → `approval_status = "Pending Manager"`, chờ manager duyệt thủ công

Set `auto_approve_below_hours = 0` để tắt hoàn toàn.

---

## 7. Kịch bản cấu hình mẫu

### Cobe Group default (chuẩn LĐ VN)

```
enabled = ✓
salary_component = Overtime
min_overtime_minutes = 30
round_to_minutes = 15
auto_approve_below_hours = 2     # OT ≤ 2h tự duyệt cho nhanh
max_overtime_hours_per_day = 4   # luật LĐ tối đa 4h/ngày
max_overtime_hours_per_month = 40  # luật LĐ tối đa 40h/tháng

multipliers:
  Weekday → 1.5
  Weekend → 2.0
  Holiday → 3.0

excluded_designations:
  CEO, CTO, Director, VP

excluded_employees: (empty)
```

### Strict mode (tất cả phải duyệt)

```
auto_approve_below_hours = 0
```

### Relax cap (thử nghiệm)

```
max_overtime_hours_per_day = 6
max_overtime_hours_per_month = 60
```

(Lưu ý: vi phạm luật LĐ nếu áp dụng dài hạn)

---

## Liên quan

- [HR Overtime Request](HR-Overtime-Request.html) — workflow xin OT
- [HR Compensation — Tổng quan](Compensation-Tong-Quan.html)
- [HR Compensation — Architecture (tech)](../tech/HR-Compensation-Architecture.html)
