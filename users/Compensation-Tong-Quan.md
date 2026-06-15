---
title: Tổng quan & Setup (Compensation)
layout: default
parent: Lương & Thưởng
nav_order: 1
---

# Lương & Thưởng — Tổng quan và Setup

> Đối tượng: **HR Manager**, **System Manager**, **Payroll Officer**.

Tài liệu đầu-đến-cuối: cài đặt 3 module compensation (OT / WFH Salary / KPI), cấu hình lần đầu, quy trình vận hành định kỳ, audit khi cần.

---

## Mục lục

1. [Hệ thống làm gì](#1-hệ-thống-làm-gì)
2. [Salary Component tự tạo lúc install](#2-salary-component-tự-tạo-lúc-install)
3. [Cấu hình lần đầu](#3-cấu-hình-lần-đầu)
4. [Quy trình vận hành định kỳ](#4-quy-trình-vận-hành-định-kỳ)
5. [Cách tính lương cuối kỳ](#5-cách-tính-lương-cuối-kỳ)
6. [Loại trừ (Exclusion)](#6-loại-trừ-exclusion)
7. [Audit & Báo cáo](#7-audit--báo-cáo)
8. [Sự cố thường gặp](#8-sự-cố-thường-gặp)

---

## 1. Hệ thống làm gì

Sau khi cài app `hr_for_cobegroup`, ngoài chấm công đã có ở [Chấm công & HR](../users/00-cham-cong.html), Cobe có thêm:

| Module | Cách dùng |
|---|---|
| **Overtime** | Nhân viên tự tạo OT Request → manager duyệt → tự cộng `Additional Salary` vào kỳ lương |
| **WFH Salary** | Đếm ngày chấm công WFH → trừ % lương Basic / Allowance theo cấu hình |
| **KPI Bonus** | Manager chấm điểm 0-100 mỗi kỳ → thưởng tự gộp vào Salary Slip |

Tất cả 3 module **bật/tắt độc lập** qua các Single Settings.

---

## 2. Salary Component tự tạo lúc install

Khi `bench install-app hr_for_cobegroup` chạy `after_install`, hệ thống tự tạo 3 Salary Component (nếu chưa có):

| Tên | Type | Mặc định gắn vào |
|---|---|---|
| `Overtime` | Earning | HR Overtime Settings → `salary_component` |
| `WFH Deduction` | Deduction | HR WFH Salary Settings → `adjustment_component` |
| `KPI Bonus` | Earning | salary_slip_hooks (hard-coded tên) |

Nếu Cobe muốn dùng tên khác (vd "Tăng ca", "Trừ lương WFH", "Thưởng KPI"):
1. Tạo Salary Component mới với tên muốn
2. Sửa lại link trong HR Overtime Settings / HR WFH Salary Settings
3. KPI Bonus: hiện hard-coded tên "KPI Bonus" — đổi cần sửa code (xem [tech doc](../tech/HR-Compensation-Architecture.html))

---

## 3. Cấu hình lần đầu

Làm tuần tự sau khi cài app:

### Bước 1: Bật / tắt từng module

| Module | Doctype | Field |
|---|---|---|
| Overtime | HR Overtime Settings | `enabled` |
| WFH Salary | HR WFH Salary Settings | `enabled` |
| KPI Bonus | (Không có flag global, chỉ cần tạo KPI Period và Score) | — |

Mặc định mới cài: **TẮT hết**. Bật từng cái khi đã chuẩn bị xong.

### Bước 2: Cấu hình HR Overtime Settings

Xem [HR Overtime Settings](HR-Overtime-Settings.html). Cần cấu hình:
- `enabled = ✓`
- 3 multiplier rules (Weekday/Weekend/Holiday) đã được seed sẵn — adjust nếu Cobe có quy định khác
- Caps daily/monthly
- `auto_approve_below_hours` — số giờ auto duyệt
- Excluded designations (C-level, Director thường exclude)

### Bước 3: Cấu hình HR WFH Salary Settings

Xem [HR WFH Salary Settings](HR-WFH-Salary-Settings.html). Cần:
- `enabled = ✓` nếu trừ lương ngày WFH
- `apply_to_components`: thêm row cho từng Salary Component bị ảnh hưởng. Vd:
  - `Basic Salary → 70%` (ngày WFH chỉ nhận 70%, trừ 30%)
  - `Allowance → 100%` (allowance giữ nguyên)
- Excluded designations / employees

### Bước 4: Tạo HR KPI Period đầu tiên

Xem [HR KPI Period](HR-KPI-Period.html). Mỗi tháng/quý/năm tạo 1 record:
- `period_type` (Monthly / Quarterly / Yearly)
- `year`, `month` hoặc `quarter`
- Hệ thống tự tính `from_date / to_date`
- `status = Open` khi đang chấm

### Bước 5: Verify Holiday List của Employee

Mỗi Employee phải có `holiday_list` để OT Request tự detect day_type (Weekday/Weekend/Holiday). Nếu thiếu, day_type fallback theo lịch tuần (Thứ 7-CN = Weekend).

### Bước 6: Verify Salary Structure Assignment

Để tính `hourly_rate` (OT) và `base_amount` (KPI):
- HRMS dùng `base` từ Salary Structure Assignment đang active
- Nếu chưa có, fallback `CTC / 12 / 220 (giờ)` — kém chính xác

Khuyến nghị: mỗi Employee có 1 Salary Structure Assignment chuẩn trước khi bật OT/KPI.

---

## 4. Quy trình vận hành định kỳ

### 4.1. Vận hành hàng ngày

| Việc | Ai làm | Tần suất |
|---|---|---|
| Tạo OT Request | Nhân viên | Ngày làm OT |
| Duyệt OT Request | Manager | Trong ngày hoặc cuối tuần |
| Đăng ký WFH Approval | Nhân viên | Hôm trước hoặc sáng |
| Duyệt WFH Approval | Manager | Trong ngày |
| Chấm công WFH (PWA) | Nhân viên | Khi bắt đầu ca |

### 4.2. Vận hành cuối kỳ (cuối tháng / quý)

| Việc | Ai làm | Khi nào |
|---|---|---|
| Chấm KPI Score cho từng nhân viên | Manager | Trước khi chạy payroll |
| Đóng KPI Period (status=Closed) | HR Manager | Sau khi đã chấm hết |
| Verify OT Request đã duyệt hết | HR Manager | Trước payroll |
| Chạy Salary Slip | Payroll Officer | Cuối tháng |
| Submit Salary Slip | Payroll Officer / HR Manager | Sau khi review |

---

## 5. Cách tính lương cuối kỳ

Khi chạy Salary Slip (Process Payroll), hệ thống:

### 5.1. Cộng OT (Additional Salary)

- HRMS quét tất cả `Additional Salary` cho Employee trong kỳ
- Gộp vào Earnings tự động (đây là cơ chế chuẩn của HRMS)
- Không cần hook riêng — hr_for_cobegroup chỉ tạo Additional Salary

### 5.2. Trừ WFH Deduction (hook `apply_wfh_adjustment`)

Trigger ở Salary Slip `validate`:
1. Đếm distinct ngày có `Employee Checkin` với source `WFH-PWA` trong khoảng `[start_date, end_date]`
2. Snapshot vào `custom_wfh_days` (read-only)
3. Với mỗi Earning trong slip:
   - Lookup `pct_on_wfh_day` từ `HR WFH Salary Settings.apply_to_components`
   - Nếu có: `shortage = component_amount × (wfh_days / working_days) × (1 - pct/100)`
4. Tổng `shortage` → thêm Deduction row `WFH Deduction`

**Idempotent**: chạy validate lại không double row — hệ thống xóa row cũ trước khi insert mới.

### 5.3. Cộng KPI Bonus (hook `apply_kpi_bonus`)

Trigger ở Salary Slip `validate`:
1. Query `HR KPI Score` của Employee có `payout_date ∈ [start_date, end_date]`
2. Filter: `paid_in_salary_slip` chưa có (hoặc đã link slip này — re-validate)
3. Sum `bonus_amount` → thêm Earning row `KPI Bonus`
4. Snapshot score cao nhất vào `custom_kpi_score`

Khi Salary Slip submit (`on_submit`):
- Mark KPI Scores `paid_in_salary_slip = slip.name`
- Tránh được việc 1 score được trả lương 2 lần

Khi Salary Slip cancel (`on_cancel`):
- Unlink KPI Scores → release vào pool, có thể trả ở slip khác

### 5.4. Field snapshot trên Salary Slip

Sau validate, 4 custom field tự fill (read-only):

| Field | Ý nghĩa |
|---|---|
| `custom_wfh_days` | Số ngày WFH-PWA trong kỳ |
| `custom_wfh_adjustment` | Tổng tiền bị trừ do WFH |
| `custom_kpi_score` | Điểm KPI cao nhất trong kỳ |
| `custom_kpi_bonus` | Tổng tiền thưởng KPI |

Dùng cho báo cáo / audit / export.

---

## 6. Loại trừ (Exclusion)

Có 2 cấp exclusion, **shared giữa OT và WFH** (cùng child table type):

### 6.1. Exclude theo Designation

VD: `Chief Executive Officer`, `Director`, `General Manager` — không tính OT, không trừ WFH.

Thêm row vào child table `excluded_designations`:
- HR Overtime Settings → tab Exclusions → Designation
- HR WFH Salary Settings → tab Exclusions → Designation

### 6.2. Exclude theo Employee cụ thể

VD: nhân viên đặc biệt (chủ tịch, cố vấn) — exclude từng người.

Thêm row vào child table `excluded_employees`. Ưu tiên cao hơn Designation.

### 6.3. Logic check

Khi tạo OT Request hoặc khi Salary Slip validate WFH:
1. Check `excluded_employees` trước (employee có trong list?)
2. Sau đó check `excluded_designations` (employee.designation có trong list?)
3. Nếu trúng 1 trong 2 → skip module đó

---

## 7. Audit & Báo cáo

### 7.1. Báo cáo OT

- Desk → **Report Builder** → từ `HR Overtime Request`
- Filter: docstatus=1, date range, approval_status=Approved
- Columns: employee, date, duration_hours, amount, multiplier, day_type

### 7.2. Báo cáo KPI

- Desk → **Report Builder** → từ `HR KPI Score`
- Filter: kpi_period, docstatus=1
- Columns: employee, score, bonus_pct, bonus_amount, paid_in_salary_slip

### 7.3. Báo cáo WFH days trong kỳ

- Desk → **Salary Slip** → list view, thêm column `custom_wfh_days`
- Hoặc Report Builder từ `Salary Slip`, filter theo `custom_wfh_days > 0`

### 7.4. Truy nguyên Additional Salary

Mỗi OT Request đã duyệt có link `additional_salary`. Click để xem record được tạo trong payroll.

---

## 8. Sự cố thường gặp

| Triệu chứng | Nguyên nhân / khắc phục |
|---|---|
| "Overtime is disabled" khi tạo OT Request | Bật `enabled` trong HR Overtime Settings |
| `hourly_rate = 0` ở OT Request | Employee chưa có Salary Structure Assignment hoặc CTC. Tạo Salary Structure Assignment chuẩn |
| OT duyệt rồi nhưng không thấy trong Salary Slip | Check `payroll_date` của Additional Salary có trong kỳ slip không. Hoặc Salary Slip submit rồi cần edit-cancel-amend |
| KPI Bonus = 0 dù đã chấm | Check `payout_date` của KPI Score có trong kỳ slip không. Check `paid_in_salary_slip` chưa bị mark trước đó |
| WFH Deduction = 0 dù có WFH | Check `apply_to_components` có row nào không. Check chấm công WFH có `custom_checkin_source='WFH-PWA'` không |
| Duplicate KPI Score | Hệ thống enforce 1 record / employee / period. Sửa record cũ thay vì tạo mới |
| Multiplier rules không đầy đủ | HR Overtime Settings phải có cả 3 row Weekday/Weekend/Holiday. Validate sẽ throw nếu thiếu |
| Day type sai cho ngày lễ | Check Employee.holiday_list có gắn Holiday List đúng năm không |

---

## Liên quan

- [HR Overtime Settings](HR-Overtime-Settings.html)
- [HR Overtime Request](HR-Overtime-Request.html)
- [HR WFH Salary Settings](HR-WFH-Salary-Settings.html)
- [HR KPI Period](HR-KPI-Period.html)
- [HR KPI Score](HR-KPI-Score.html)
- [HR Compensation — Architecture (tech)](../tech/HR-Compensation-Architecture.html)
