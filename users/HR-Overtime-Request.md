---
title: HR Overtime Request
layout: default
parent: Lương & Thưởng
nav_order: 3
---

# HR Overtime Request — Xin và duyệt tăng ca

> Submittable doctype, amendable. Mỗi lần OT = 1 record.
>
> **Chỉ hoạt động khi** `enabled` ON trong [HR Overtime Settings](HR-Overtime-Settings.html).

---

## Mục lục

1. [Khi nào dùng](#1-khi-nào-dùng)
2. [Cách mở](#2-cách-mở)
3. [Các field](#3-các-field)
4. [Quy trình xin OT](#4-quy-trình-xin-ot)
5. [Quy trình duyệt OT](#5-quy-trình-duyệt-ot)
6. [Khi nào tạo Additional Salary](#6-khi-nào-tạo-additional-salary)
7. [Cancel / Reject](#7-cancel--reject)

---

## 1. Khi nào dùng

Mỗi lần nhân viên làm OT cần tạo 1 OT Request:
- Cùng ngày, đa khoảng thời gian → tạo nhiều record (vd OT sáng + OT tối)
- OT làm liên tục chiều→tối → 1 record với from_time/to_time là cả khoảng

Không enforce unique constraint → có thể nhiều OT/ngày, nhưng tổng phải ≤ `max_overtime_hours_per_day`.

---

## 2. Cách mở

- Desk → search "HR Overtime Request" → New
- URL: `/app/hr-overtime-request/new?employee=<emp_id>`

PWA hiện chưa có UI OT (phase 2 backend-only). Nhân viên xin OT qua Desk.

---

## 3. Các field

### `name` (Auto)

Series `OT-YYYY-000001`, `OT-YYYY-000002`,... (`YYYY` = năm của `date`).

### `employee` (Link → Employee, **bắt buộc**)

Nhân viên xin OT. Khi tạo từ Desk, manager có thể chọn employee thuộc dept của mình.

### `employee_name` (Data, auto-fill từ Employee)

Read-only.

### `date` (Date, **bắt buộc**, in_list_view)

Ngày làm OT. Có thể là quá khứ (xin OT trễ) hoặc tương lai (đăng ký OT trước).

### `day_type` (Select: Weekday / Weekend / Holiday, auto-detect)

Hệ thống tự tính từ `date` + `employee.holiday_list`:
1. Nếu `date` ∈ Holiday List → `Holiday`
2. Sau đó nếu là thứ 7 / CN → `Weekend`
3. Còn lại → `Weekday`

User override được nếu cần (vd ngày làm bù).

### `from_time` / `to_time` (Time, **bắt buộc**)

Khoảng OT. `to_time` phải sau `from_time`. Không support OT qua đêm (00:00–08:00 cùng ngày OK; 22:00–02:00 cần tách 2 record).

### `break_minutes` (Int, default 0)

Trừ ra khỏi duration. Vd OT 18:00-22:00 nhưng nghỉ ăn 30 phút → `break_minutes = 30`.

### `duration_hours` (Float, auto-compute, read-only)

`(to_time - from_time - break_minutes) / 60`, round down về bội số `round_to_minutes` của Settings.

### `hourly_rate` (Currency, auto-compute, read-only)

Lookup từ Salary Structure Assignment đang active:
- `base / 220` (220h tiêu chuẩn 1 tháng)
- Fallback `CTC / 12 / 220` nếu chưa có Salary Structure Assignment

### `multiplier` (Float, auto-fill, read-only)

Từ HR Overtime Settings.multipliers theo `day_type`.

### `amount` (Currency, auto-compute, read-only)

`duration_hours × hourly_rate × multiplier`. Hiển thị in_list_view.

### `reason` (Text, **bắt buộc**)

Lý do làm OT. VD:
- "Hỗ trợ release production v3.5"
- "Họp khách hàng KH-001 ngoài giờ"
- "Backup data trước migration"

### `approval_status` (Select)

| Value | Khi nào |
|---|---|
| Pending Manager | Vừa submit, chờ duyệt |
| Approved | Manager đã duyệt (hoặc auto-approve) |
| Rejected | Manager đã reject |

### `approved_by` (Link → User, auto-fill khi approve)

Read-only.

### `additional_salary` (Link → Additional Salary, auto-fill khi Approved)

Read-only. Link tới record `Additional Salary` được tạo tự động.

### `docstatus` (built-in)

| Value | Ý nghĩa |
|---|---|
| 0 | Draft — chưa submit |
| 1 | Submitted — đã submit, có thể đang `Pending Manager` hoặc `Approved` |
| 2 | Cancelled — đã hủy hoặc reject (Cancel Additional Salary kèm theo) |

---

## 4. Quy trình xin OT

### Bước 1: Nhân viên tạo record

1. Desk → HR Overtime Request → New
2. Chọn date + from/to time + break (nếu có)
3. Nhập reason
4. Hệ thống auto-fill day_type, duration_hours, hourly_rate, multiplier, amount
5. Verify amount đúng (nếu sai → có thể do hourly_rate thiếu Salary Structure Assignment)
6. Save → Draft

### Bước 2: Submit

Click **Submit**.

**Nếu duration ≤ auto_approve_below_hours**:
- `approval_status = Approved`
- `approved_by = Administrator`
- Tự tạo Additional Salary ngay
- Notify nhân viên + manager

**Nếu duration > auto_approve_below_hours**:
- `approval_status = Pending Manager`
- Chờ manager duyệt thủ công

---

## 5. Quy trình duyệt OT

### Manager dashboard

Desk → HR Overtime Request → List view → filter:
- `docstatus = 1` (Submitted)
- `approval_status = Pending Manager`
- `employee.department` = department mình quản lý

### Duyệt

Mỗi record:
1. Click vào record
2. Review: date, duration, reason
3. Click button **Approve Overtime** (whitelist action ở top-right)

**Hoặc reject**:
1. Click **Reject Overtime**
2. Nhập lý do (optional, lưu vào comment)
3. `approval_status = Rejected`, không tạo Additional Salary

---

## 6. Khi nào tạo Additional Salary

Khi `approval_status` chuyển sang `Approved` (cả auto + manual):

`Additional Salary` được tạo với:
- `employee` = OT.employee
- `salary_component` = HR Overtime Settings.salary_component
- `amount` = OT.amount
- `payroll_date` = OT.date
- `ref_doctype` = "HR Overtime Request"
- `ref_docname` = OT.name

Khi HRMS chạy Process Payroll cho kỳ chứa `payroll_date`:
- HRMS tự lookup tất cả Additional Salary của Employee trong kỳ
- Gộp vào Earnings của Salary Slip với salary_component tương ứng

**Không cần** hook riêng cho OT — chỉ tận dụng cơ chế chuẩn của HRMS.

---

## 7. Cancel / Reject

### Cancel OT Draft

Click **Delete** ở Draft. Không ảnh hưởng gì khác.

### Cancel OT đã Submitted (Pending Manager)

Click **Cancel** → docstatus=2. Không có Additional Salary nên không cần dọn.

### Cancel OT đã Approved (đã tạo Additional Salary)

Click **Cancel**:
1. docstatus = 2
2. Hook `on_cancel` tự cancel `additional_salary` linked
3. Sau cancel, Salary Slip kỳ tới sẽ không cộng OT này nữa

**Trường hợp Salary Slip đã submit rồi**:
- Cancel Salary Slip trước
- Sau đó cancel OT
- Hoặc tạo Salary Slip Adjustment (cơ chế HRMS chuẩn)

### Amend (sửa OT đã submit)

Click **Amend** → tạo bản sao mới ở Draft với link `amended_from`. Sửa rồi submit lại.

OT amend cần manager duyệt lại từ đầu (kể cả đã từng Approved).

---

## Liên quan

- [HR Overtime Settings](HR-Overtime-Settings.html) — config
- [HR Compensation — Tổng quan](Compensation-Tong-Quan.html)
- [HR Compensation — Architecture (tech)](../tech/HR-Compensation-Architecture.html)
