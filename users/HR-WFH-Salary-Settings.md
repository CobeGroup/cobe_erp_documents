---
title: HR WFH Salary Settings
layout: default
parent: Lương & Thưởng
nav_order: 4
---

# HR WFH Salary Settings — Cấu hình trừ lương ngày WFH

> Single doctype. Toàn hệ thống 1 record. Định nghĩa Salary Component nào bị trừ bao nhiêu % khi nhân viên WFH.
>
> **Hoạt động dựa trên** số ngày chấm công có `custom_checkin_source='WFH-PWA'` trong Salary Slip period.

---

## Mục lục

1. [Cách mở](#1-cách-mở)
2. [Khái niệm](#2-khái-niệm)
3. [Các field chính](#3-các-field-chính)
4. [Apply To Components — cấu hình từng component](#4-apply-to-components--cấu-hình-từng-component)
5. [Loại trừ](#5-loại-trừ)
6. [Cách tính trừ lương](#6-cách-tính-trừ-lương)
7. [Kịch bản cấu hình mẫu](#7-kịch-bản-cấu-hình-mẫu)
8. [Lưu ý vận hành](#8-lưu-ý-vận-hành)

---

## 1. Cách mở

- Desk → search "HR WFH Salary Settings"
- URL: `/app/hr-wfh-salary-settings`

---

## 2. Khái niệm

Mỗi ngày nhân viên WFH (đã được duyệt qua [HR WFH Approval](HR-WFH-Approval.html)) sẽ:
1. Chấm công IN từ PWA với `custom_checkin_source = 'WFH-PWA'`
2. Salary Slip kỳ tới đếm số ngày WFH
3. Trừ lương theo cấu hình ở doctype này

Lý do: nhân viên WFH thường nhận **lương cơ bản giảm** (vd 70-80% của ngày onsite) hoặc bị trừ phụ cấp ăn trưa / đi lại.

---

## 3. Các field chính

### `enabled` (Check)

Bật/tắt module trừ lương WFH. Khi tắt:
- Hook `apply_wfh_adjustment` không chạy
- Nhân viên WFH **không bị trừ lương**

Default: **0** (tắt). Bật khi đã config xong `apply_to_components`.

### `adjustment_component` (Link → Salary Component, **bắt buộc khi enabled**)

Salary Component dùng để ghi nhận khoản trừ. Mặc định "WFH Deduction" (Deduction type).

Hệ thống thêm 1 row Deduction duy nhất vào Salary Slip với component này, amount = tổng trừ từ tất cả components configure.

---

## 4. Apply To Components — cấu hình từng component

Child table `apply_to_components` (doctype HR WFH Salary Component Scope).

Mỗi row:
- `salary_component` (Link → Salary Component) — earning component bị ảnh hưởng
- `pct_on_wfh_day` (Float 0-100) — % được nhận trong ngày WFH
- `description` (Data) — ghi chú

### Ví dụ:

| salary_component | pct_on_wfh_day | description |
|---|---|---|
| Basic Salary | 70 | Ngày WFH nhận 70%, trừ 30% |
| Allowance | 100 | Phụ cấp giữ nguyên |
| Lunch Allowance | 0 | Không có ăn trưa ngày WFH |
| Transport | 0 | Không có xe ngày WFH |

`pct_on_wfh_day = 100` → không trừ gì.
`pct_on_wfh_day = 0` → trừ hoàn toàn phần tỷ lệ ngày WFH.

### Component không có trong list

→ Không bị trừ. (Mặc định 100%.)

---

## 5. Loại trừ

2 child table giống HR Overtime Settings:

### `excluded_designations`

VD: CEO, Director — WFH thoải mái không trừ lương.

### `excluded_employees`

Exclude từng nhân viên cụ thể. Ưu tiên cao hơn.

Khi Salary Slip validate WFH, nếu employee trúng exclusion → skip toàn bộ module, không trừ gì.

---

## 6. Cách tính trừ lương

Pseudo-code khi `apply_wfh_adjustment` chạy ở Salary Slip.validate:

```python
# 1. Đếm WFH days
wfh_days = count(distinct date) 
  from `Employee Checkin` 
  where employee = slip.employee 
    and source = 'WFH-PWA' 
    and date in [slip.start_date, slip.end_date]
slip.custom_wfh_days = wfh_days

if wfh_days == 0 or not enabled or employee excluded:
    return

# 2. Tính shortage tổng cho từng earning
total_shortage = 0
working_days = slip.payment_days  # số ngày làm trong kỳ
for earning in slip.earnings:
    pct = lookup(apply_to_components, earning.salary_component)
    if pct is None: continue
    shortage = earning.amount * (wfh_days / working_days) * (1 - pct/100)
    total_shortage += shortage

# 3. Thêm Deduction row
slip.deductions.append({
    salary_component: adjustment_component,
    amount: total_shortage,
})
slip.custom_wfh_adjustment = total_shortage
```

### Diễn giải

Mỗi component được "pro-rate" theo tỷ lệ ngày WFH:
- 22 working days, 5 ngày WFH → tỷ lệ WFH = 5/22 ≈ 22.7%
- Basic Salary 22tr, pct=70% → shortage = 22tr × 22.7% × 30% ≈ 1.5tr
- Allowance 5tr, pct=100% → shortage = 0
- Lunch 1.1tr, pct=0% → shortage = 1.1tr × 22.7% × 100% = 250k

Tổng trừ ≈ 1.75tr → row Deduction "WFH Deduction" với amount = 1.75tr.

### Idempotent

Validate có thể chạy nhiều lần (mỗi lần edit slip). Hook tự xóa row "WFH Deduction" cũ trước khi insert lại → không double.

---

## 7. Kịch bản cấu hình mẫu

### Cobe Group: WFH giảm 30% Basic, không trừ allowance

```
enabled = ✓
adjustment_component = WFH Deduction

apply_to_components:
  Basic Salary    → 70%
  Allowance       → 100%    (không cần thêm, default 100%)

excluded_designations:
  Director, Manager        (sếp WFH không trừ)
```

### Strict: trừ toàn bộ phụ cấp ngày WFH

```
apply_to_components:
  Basic Salary       → 80%    (trừ 20%)
  Lunch Allowance    → 0%
  Transport Allow.   → 0%
  Phone Allowance    → 0%
```

### Generous: chỉ trừ lunch/transport

```
apply_to_components:
  Lunch Allowance    → 0%
  Transport Allow.   → 0%
```

Basic Salary không có trong list → giữ 100%.

---

## 8. Lưu ý vận hành

### Working days là gì

`slip.payment_days` của HRMS — số ngày làm trong kỳ, đã trừ Holiday + Leave + Absent. Hook dùng số này để pro-rate, **không** dùng calendar days.

→ Nhân viên nghỉ phép 2 ngày trong tháng có 22 working days → vẫn 22 (vì leave đã tính riêng), WFH 5 ngày → 5/22.

### Khi nhân viên WFH cả tháng

5 WFH / 22 working = 22.7% → trừ Basic giảm xuống ≈ 21tr (từ 22tr) nếu pct=70%. Logic vẫn đúng.

20 WFH / 22 → 91%, gần như cả tháng → trừ ≈ 6tr.

### Chấm công WFH KHÔNG được duyệt approval thì sao

Nhân viên không chấm được WFH (PWA reject) → không có Employee Checkin record source WFH-PWA → hook đếm 0 → không trừ.

Nếu vẫn lo, audit thủ công: list `Employee Checkin` filter `custom_checkin_source='WFH-PWA'`, kiểm tra mỗi record có `HR WFH Approval` tương ứng không.

### Re-validate Salary Slip sau khi đổi config

Nếu sửa `apply_to_components` sau khi đã có Salary Slip trong tháng:
- Salary Slip Draft → save lại → hook chạy lại với config mới
- Salary Slip đã Submit → cancel → save → submit lại (hoặc dùng Amend)

### Trừ vượt mức Basic Salary

Hook không cap. Nếu cấu hình lỗi (vd Basic Salary với pct=0% + WFH cả tháng) → có thể trừ vượt cả Basic. HRMS sẽ tính Net Pay âm.

Best practice: pct_on_wfh_day ≥ 50% cho Basic Salary.

---

## Liên quan

- [HR WFH Approval](HR-WFH-Approval.html) — duyệt ngày WFH
- [HR Compensation — Tổng quan](Compensation-Tong-Quan.html)
- [HR Compensation — Architecture (tech)](../tech/HR-Compensation-Architecture.html)
