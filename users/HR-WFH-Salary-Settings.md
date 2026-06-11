---
title: HR WFH Salary Settings (Cấu hình lương WFH)
layout: default
parent: Chấm công & HR
nav_order: 11
---

# HR WFH Salary Settings — Cấu hình lương WFH

> Single doctype config tỉ lệ trả lương cho ngày WFH (mặc định Cobe: 70% Base, 100% phụ cấp).
>
> Hook tự động: khi Salary Slip được validate, hệ thống đếm số ngày WFH trong period → tính số tiền giảm trừ → add vào section Deductions.

---

## Mục lục

1. [Cách mở](#1-cách-mở)
2. [Logic tổng](#2-logic-tổng)
3. [Apply To Components — bảng cốt lõi](#3-apply-to-components--bảng-cốt-lõi)
4. [Adjustment Component](#4-adjustment-component)
5. [Exclusions](#5-exclusions)
6. [Custom fields trên Salary Slip](#6-custom-fields-trên-salary-slip)
7. [Setup mẫu cho Cobe](#7-setup-mẫu-cho-cobe)
8. [Sự cố thường gặp](#8-sự-cố-thường-gặp)

---

## 1. Cách mở

- Desk → search "HR WFH Salary Settings"
- URL: `/app/hr-wfh-salary-settings`

Permission: HR Manager, System Manager.

---

## 2. Logic tổng

Khi Salary Slip được save:

```
wfh_days = COUNT(DISTINCT date) trong Employee Checkin có custom_checkin_source='WFH-PWA'
            cho employee + range [start_date, end_date]
```

Sau đó với mỗi row trong `apply_to_components`:
```
shortage_per_component = earning.amount × wfh_days / working_days × (1 − pct/100)
```

Tổng `shortage` → add 1 row Deduction với component `adjustment_component`.

→ **Đối xứng**: ngày Present full pay, ngày WFH = N% pay (theo pct). Số tiền cụ thể tự transparent qua field `custom_wfh_adjustment`.

---

## 3. Apply To Components — bảng cốt lõi

Mỗi row chỉ định:
- `salary_component`: tên Salary Component bị adjust
- `pct_on_wfh_day`: % lương trả cho ngày WFH (Cobe = 70 cho Base)
- `description`: ghi chú nội bộ

### Cobe setup mẫu

| Salary Component | Pct on WFH Day | Description |
|---|---|---|
| Base Salary | 70 | Cobe policy 70% Base cho WFH |
| HRA | 70 | (nếu có HRA, áp dụng tương tự) |

Phụ cấp khu vực, kiêm nhiệm, thâm niên → **KHÔNG add vào bảng này** = giữ 100% kể cả WFH.

### Validation

- Cùng `salary_component` không add 2 row.
- `pct_on_wfh_day ∈ [0, 100]`.
- Khi `enabled = 1`, bảng tối thiểu phải có 1 row.

---

## 4. Adjustment Component

`adjustment_component` (Link → Salary Component, default `"WFH Deduction"`).

- Phải là 1 Salary Component type=**Deduction**
- Tự tạo khi `bench install hr_for_cobegroup` (qua [install.py](https://github.com/CobeGroup/hr_for_cobegroup/blob/main/hr_for_cobegroup/install.py))
- Hiển thị 1 row duy nhất với tổng adjustment trong Salary Slip Deductions section

→ Có thể đổi sang component khác nếu cần (vd "WFH 70%") — sửa Settings → Save → Salary Slip kế tiếp sẽ dùng component mới.

---

## 5. Exclusions

### Excluded Designations

Designation **không bị adjust** dù có WFH (nhận 100%). Vd Giám đốc (lương khoán không phụ thuộc giờ làm).

### Excluded Employees

Employee cá nhân không bị adjust.

→ Logic check: nếu employee thuộc Excluded → skip toàn bộ WFH adjustment cho slip đó.

---

## 6. Custom fields trên Salary Slip

Hệ thống tự tạo 4 field read-only (qua install.py), ở section "Compensation (Cobe)" collapse mặc định:

| Field | Type | Ý nghĩa |
|---|---|---|
| `custom_wfh_days` | Float | Số ngày WFH trong period |
| `custom_wfh_adjustment` | Currency | Tổng tiền giảm trừ WFH (đã add vào Deductions) |
| `custom_kpi_score` | Float | KPI score liên quan (xem [HR KPI Score](HR-KPI-Score.html)) |
| `custom_kpi_bonus` | Currency | Tổng KPI bonus (đã add vào Earnings) |

Trên Salary Slip print template có thể reference các field này để in chi tiết.

---

## 7. Setup mẫu cho Cobe

Bước 1 — install xong, mở **HR WFH Salary Settings**:

1. `enabled = 1`
2. `adjustment_component = WFH Deduction`
3. Tab **Apply To Components** → Add Row:
   - `salary_component = Base Salary`, `pct_on_wfh_day = 70`, `description = "Cobe 70% policy"`
4. Tab **Exclusions** → để trống (không exclude ai cả) — hoặc add designation "Giám đốc" nếu cần

Bước 2 — tạo Salary Structure dùng component "Base Salary":

1. Desk → Salary Structure → New
2. Add Earnings: row "Base Salary" với formula `base` (sẽ pull từ Salary Structure Assignment.base)
3. Save → Submit

Bước 3 — generate Salary Slip:

1. Desk → Payroll Entry hoặc Salary Slip → New
2. Sau khi save: kiểm tra
   - `custom_wfh_days` có đúng số ngày nhân viên WFH không
   - `custom_wfh_adjustment` có hợp lý không
   - Section Deductions có row "WFH Deduction" với amount = `custom_wfh_adjustment`

### Ví dụ

- Lương cứng (Base Salary) = 20,000,000 VNĐ
- Working days tháng = 22
- WFH 5 ngày (qua PWA tap "Bắt đầu ca WFH")
- `pct_on_wfh_day = 70`

Tính:
- `shortage = 20,000,000 × 5/22 × (100−70)/100 = 1,363,636 VNĐ`
- Earnings: Base Salary = 20,000,000 (vẫn full)
- Deductions: WFH Deduction = 1,363,636
- Net = 20,000,000 − 1,363,636 = **18,636,364 VNĐ**

→ Tương đương với 17 ngày × 909,090 + 5 ngày × 636,363 = 15,454,530 + 3,181,815 = 18,636,345 (chênh 19 VNĐ do rounding).

---

## 8. Sự cố thường gặp

### 8.1. wfh_days = 0 dù nhân viên có check-in WFH

Check `custom_checkin_source` của Employee Checkin:
- Phải là `'WFH-PWA'` (case-sensitive)
- Nếu là `'PWA'` hoặc `'WFH'` thì query miss

Fix: kiểm tra api/attendance.py.checkin_wfh — value gán cho `custom_checkin_source` phải = `'WFH-PWA'`.

### 8.2. Adjustment đã apply nhưng không thấy trong Deductions

Check:
1. `enabled = 1` chưa
2. `apply_to_components` có row với đúng `salary_component` đang dùng trong Salary Slip Earnings không
3. Employee có bị Excluded không

### 8.3. Sửa Settings → Salary Slip cũ có update không?

→ **KHÔNG tự update**. Phải mở từng Salary Slip cũ → Save lại để re-trigger hook validate. Hoặc cancel + recreate.

### 8.4. Nhân viên báo lương sai vì hôm WFH server vẫn tính như onsite

Check Employee Checkin records ngày đó:
- `custom_checkin_source` = `WFH-PWA` không?
- Nếu là `Onsite-PWA` → nhân viên check-in nhầm mode. Confirm qua HR WFH Approval ngày đó có submitted không.

Fix tay: sửa `custom_checkin_source` cho record đó → save Salary Slip lại.

### 8.5. Nhân viên cancel HR WFH Approval ngày đó

→ Employee Checkin vẫn còn record với source=WFH-PWA. HR WFH Approval bị cancel chỉ làm record approval mất. Vẫn count vào wfh_days của Salary Slip.

→ Nếu muốn không count: sửa `custom_checkin_source` của Employee Checkin → save Slip lại.

---

## Liên quan

- [HR WFH Approval](HR-WFH-Approval.html) — workflow duyệt WFH (frontend)
- [HR Attendance Settings](HR-Attendance-Settings.html) — feature flag bật WFH mode
- [HR KPI Score](HR-KPI-Score.html) — phần KPI bonus dùng cùng pattern
