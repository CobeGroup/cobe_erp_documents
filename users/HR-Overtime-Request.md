---
title: HR Overtime Request (Đơn xin OT)
layout: default
parent: Chấm công & HR
nav_order: 10
---

# HR Overtime Request — Đơn xin Overtime

> Submittable doctype. Nhân viên submit → Manager duyệt → auto tạo Additional Salary → Salary Slip tháng tới có khoản OT.
>
> Logic + config phụ thuộc [HR Overtime Settings](HR-Overtime-Settings.html).

---

## Mục lục

1. [Khi nào dùng OT thay vì Comp-Off](#1-khi-nào-dùng-ot-thay-vì-comp-off)
2. [Các field](#2-các-field)
3. [Quy trình nhân viên submit](#3-quy-trình-nhân-viên-submit)
4. [Quy trình manager duyệt](#4-quy-trình-manager-duyệt)
5. [Tính amount như thế nào](#5-tính-amount-như-thế-nào)
6. [Liên kết Additional Salary → Salary Slip](#6-liên-kết-additional-salary--salary-slip)
7. [Cancel / sửa OT đã approve](#7-cancel--sửa-ot-đã-approve)
8. [Sự cố thường gặp](#8-sự-cố-thường-gặp)

---

## 1. Khi nào dùng OT thay vì Comp-Off

| Tình huống | Dùng HR Overtime Request | Dùng [Compensatory Leave](HRMS-Comp-Off.html) |
|---|---|---|
| Ở lại làm sau 17h trong ngày thường | ✅ OT (multiplier 1.5×) | ❌ Không áp dụng |
| Đi làm cả ngày Chủ Nhật | ✅ OT (multiplier 2×) — nhận tiền | ✅ — nhận ngày nghỉ bù |
| Đi làm ngày lễ Tết | ✅ OT (multiplier 3×) — nhận tiền | ✅ — nhận ngày nghỉ bù |
| Quên không chấm OUT cuối ngày | ❌ Không phải OT | ❌ Không liên quan |

→ Cùng 1 ngày làm bù chỉ chọn **1 trong 2** (OT hoặc Comp-Off), không cả hai.

---

## 2. Các field

### `employee` (Link → Employee, bắt buộc)

Auto fill nếu user đang login là Employee. HR/Manager có thể submit thay nhân viên khác.

### `date` (Date, bắt buộc)

Ngày OT. Server tự classify → `day_type` (Weekday / Weekend / Holiday).

### `day_type` (Select, read-only, auto)

Tự fill khi save. Logic:
1. Trong Holiday List với `weekly_off=0` → **Holiday**
2. Trong Holiday List với `weekly_off=1` → **Weekend**
3. Là Saturday/Sunday → **Weekend**
4. Còn lại → **Weekday**

### `from_time` / `to_time` (Time, bắt buộc)

Giờ bắt đầu OT và kết thúc. Vd 17:00 → 21:30.

### `break_minutes` (Int, default 0)

Phút nghỉ giữa ca OT. Server trừ khỏi duration. Vd: 17:00–21:30 với break 30 → duration = 4h00.

### `duration_hours` (Float, read-only, auto)

= (to_time − from_time − break/60), rồi làm tròn xuống `round_to_minutes` của Settings.

### `hourly_rate` (Currency, read-only, auto)

= `base_salary / 220` (220h là standard working hours/month).

`base_salary` = Salary Structure Assignment.base của employee (record `docstatus=1`, mới nhất). Nếu không có → fallback Employee.ctc / 12.

### `multiplier` (Float, read-only, auto)

Lookup từ [HR Overtime Settings](HR-Overtime-Settings.html#2-multiplier-rules--cốt-lõi) theo `day_type`. Default Weekday=1.5, Weekend=2, Holiday=3.

### `amount` (Currency, read-only, auto)

= `duration_hours × hourly_rate × multiplier`

### `reason` (Small Text, bắt buộc)

Lý do làm OT. Vd: "Giao hàng gấp KH ABC", "Đóng quyết toán cuối tháng".

### `approval_status` (Select, default "Pending Manager")

| Value | Ý nghĩa |
|---|---|
| Pending Manager | Đang chờ duyệt |
| Approved | Đã duyệt → Additional Salary đã tạo |
| Rejected | Đã reject |

→ Field này có `allow_on_submit=1`, edit được sau submit.

### `approved_by` (Link → User, read-only)

Auto fill user đã approve/reject khi gọi `approve_overtime` / `reject_overtime`.

### `additional_salary` (Link → Additional Salary, read-only)

Auto fill name của Additional Salary đã tạo sau Approve.

---

## 3. Quy trình nhân viên submit

### Bước 1 — Tạo record

Desk → search **HR Overtime Request** → **New**.

Hoặc: Employee form → button "OT Request" (nếu UI custom có).

### Bước 2 — Điền form

1. `date` = ngày OT
2. `from_time` + `to_time`
3. `break_minutes` (nếu có nghỉ)
4. `reason` rõ ràng

Khi Save (Draft): server tính `day_type`, `duration_hours`, `hourly_rate`, `multiplier`, `amount` — đều read-only auto.

Verify amount hợp lý → bấm **Submit** → `approval_status = "Pending Manager"`.

Email auto gửi cho `leave_approver` của Employee.

### Bước 3 — Chờ duyệt

Trên Desk filter `approval_status = "Pending Manager"` → xem trạng thái.

Nếu cap đã đầy 40h tháng → submit báo lỗi "Vượt quá Max OT Hours / Month". Phải đợi tháng sau.

---

## 4. Quy trình manager duyệt

### Bước 1 — Mở record từ email

Manager nhận email → click link → mở HR Overtime Request.

### Bước 2 — Verify

Kiểm tra:
- Lý do hợp lệ?
- Date có thực sự là ngày làm việc của nhân viên đó?
- Có Employee Checkin tương ứng không (vào bằng GPS / selfie)?
- Amount có hợp lý (multiplier đúng day_type, duration đúng)?

### Bước 3 — Approve / Reject

#### Cách 1 — UI button (nếu có custom button)

Click **Approve** → server gọi `approve_overtime` → set `approval_status="Approved"` + `approved_by` + tạo Additional Salary.

#### Cách 2 — Manual edit field

1. Đổi `approval_status` từ Pending Manager → Approved
2. **Save** (sau submit vẫn save được do `allow_on_submit`)
3. Hook `on_update_after_submit` tự tạo Additional Salary

#### Reject

1. Đổi `approval_status` → Rejected
2. Save
3. Optional: add comment giải thích lý do

---

## 5. Tính amount như thế nào

Công thức:
```
amount = duration_hours × hourly_rate × multiplier
hourly_rate = base_salary / 220
```

### Ví dụ 1 — Office worker OT thường

- Nhân viên: Lương 20,000,000 VNĐ/tháng
- OT: Thứ 3, từ 17:00 đến 19:30
- `hourly_rate = 20,000,000 / 220 = 90,909 VNĐ/giờ`
- `duration_hours = 2.5h`
- `multiplier = 1.5` (Weekday)
- `amount = 2.5 × 90,909 × 1.5 = 340,909 VNĐ`

### Ví dụ 2 — Đi làm Chủ Nhật cả ngày

- Lương 15,000,000 VNĐ/tháng
- OT: Chủ Nhật, 8:00 đến 17:00, break 60p
- `hourly_rate = 15,000,000 / 220 = 68,181 VNĐ/giờ`
- `duration_hours = (9h − 1h) = 8h`
- `multiplier = 2.0` (Weekend)
- `amount = 8 × 68,181 × 2 = 1,090,909 VNĐ`

→ Lúc này nhân viên có thể chọn nhận tiền (OT) hoặc nhận ngày nghỉ bù (Comp-Off).

### Ví dụ 3 — Tết Âm

- Lương 10,000,000
- OT: Mùng 2 Tết (trong Holiday List), 8:00–12:00
- `hourly_rate = 10,000,000 / 220 = 45,454 VNĐ/giờ`
- `duration_hours = 4h`
- `multiplier = 3.0` (Holiday)
- `amount = 4 × 45,454 × 3 = 545,454 VNĐ`

---

## 6. Liên kết Additional Salary → Salary Slip

Sau Approve:
1. Server tạo Additional Salary record:
   - `employee` = OT.employee
   - `salary_component` = "Overtime" (config trong Settings)
   - `amount` = OT.amount
   - `payroll_date` = OT.date
   - `ref_doctype` = "HR Overtime Request", `ref_docname` = OT.name
2. Insert + Submit (docstatus=1)
3. Link name → OT.additional_salary

Khi tạo Salary Slip cho tháng đó:
- Frappe đọc tất cả Additional Salary có `payroll_date` trong payroll period
- Add vào Earnings của Salary Slip với amount tương ứng

→ Salary Slip auto có khoản OT, không cần handle thêm.

---

## 7. Cancel / sửa OT đã approve

### Cancel OT Request

Khi cancel (docstatus=2):
- Hook `on_cancel` tự cancel luôn Additional Salary đã tạo
- OT amount sẽ không xuất hiện trong Salary Slip kế tiếp

→ Verify: mở Additional Salary linked → check docstatus = 2.

### Sửa amount sau khi approve

**Không sửa trực tiếp** — submit độ chính xác về `from_time / to_time / break_minutes`.

Nếu cần sửa:
1. Cancel OT Request
2. **Amend** (tạo bản copy với suffix `-1`)
3. Sửa giờ → Save → Submit lại → Approve lại

---

## 8. Sự cố thường gặp

### 8.1. Submit báo "Multiplier cho Weekday phải > 0"

→ Multiplier Rules sai. Mở [HR Overtime Settings](HR-Overtime-Settings.html#2-multiplier-rules--cốt-lõi) → fix row Weekday.

### 8.2. Hourly rate = 0

Employee chưa có Salary Structure Assignment hoặc Employee.ctc. Cách fix:
1. Tạo Salary Structure cho employee, hoặc
2. Set field `ctc` trong Employee form

### 8.3. Submit báo "Vượt quá Max OT Hours / Month"

→ Tổng OT của employee trong tháng đã chạm 40h. Đợi tháng sau hoặc HR Admin tăng cap trong Settings.

### 8.4. Approve nhưng Additional Salary không tạo

Check Console log. Nguyên nhân thường:
- Employee không có `company` → throw lúc insert Additional Salary
- Salary Component "Overtime" không tồn tại → chạy lại migrate cho patch `bootstrap_compensation` chạy

Fix manual:
```bash
bench --site cobe.cc execute hr_for_cobegroup.install.after_install
```

### 8.5. Salary Slip kỳ tới không thấy khoản OT

Check:
1. Additional Salary đã submit chưa (docstatus=1)
2. `payroll_date` của Additional Salary có nằm trong payroll period của Salary Slip không
3. Salary Slip đã được re-create chưa (Salary Slip cũ sinh trước Additional Salary sẽ không có khoản này; cancel và re-create)

---

## Liên quan

- [HR Overtime Settings](HR-Overtime-Settings.html) — multiplier, caps, exclusions
- [Compensatory Leave](HRMS-Comp-Off.html) — option ngược lại
- [Shift Type & Auto Attendance](HRMS-Shift-Type-Setup.html) — base attendance
