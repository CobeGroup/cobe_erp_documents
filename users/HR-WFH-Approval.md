---
title: HR WFH Approval
layout: default
parent: Chấm công & HR
nav_order: 5
---

# HR WFH Approval — Duyệt làm việc từ xa

> Submittable doctype, duyệt từng ngày WFH cho từng nhân viên.
> **Chỉ hoạt động khi** feature flag `enable_wfh_mode` ON trong [HR Attendance Policy](HR-Attendance-Policy.html).

---

## Mục lục

1. [Khi nào dùng](#1-khi-nào-dùng)
2. [Cách mở](#2-cách-mở)
3. [Các field](#3-các-field)
4. [Quy trình duyệt](#4-quy-trình-duyệt)
5. [Tác dụng khi đã Approved](#5-tác-dụng-khi-đã-approved)
6. [Reject / Cancel](#6-reject--cancel)

---

## 1. Khi nào dùng

Khi công ty có policy WFH/công tác và muốn track rõ ràng ngày nào nhân viên nào được phép chấm công ngoài VP.

**Quy tắc**: 1 nhân viên + 1 ngày = 1 record. Không thể trùng (system enforce unique constraint).

Khi feature flag tắt → doctype tạo được nhưng không có tác dụng. Endpoint `attendance.checkin_wfh` trả lỗi `WFH_NOT_ENABLED`.

---

## 2. Cách mở

- Desk → search "HR WFH Approval"
- URL: `/app/hr-wfh-approval`
- Nhân viên cũng có thể tạo qua PWA → tab "Đăng ký WFH"

---

## 3. Các field

### `name` (Auto)

Series `WFH-YYYY-000001`, `WFH-YYYY-000002`,... (`YYYY` = năm của `wfh_date`).

### `employee` (Link → Employee, **bắt buộc**)

Nhân viên xin WFH.

Khi tạo qua PWA → tự fill bằng employee của user hiện tại. Manager tạo từ Desk có thể chọn employee bất kỳ thuộc dept của mình.

### `wfh_date` (Date, **bắt buộc**, in_list_view)

Ngày WFH. Phải >= ngày hôm nay (không cho xin WFH retroactive).

### `work_location_label` (Data)

Optional, mô tả nơi làm. Ví dụ:
- "Nhà riêng - Quận 7"
- "Công tác Hà Nội - Khách sạn Daewoo"
- "Cafe gần nhà"

Không enforce GPS dựa trên field này — chỉ dùng audit + báo cáo.

### `reason` (Small Text)

Lý do xin WFH. Vd:
- "Con ốm, không đi làm được"
- "Họp với khách hàng tại HN cả ngày"
- "Internet công ty hỏng, làm tại nhà cho yên tâm"

### `approved_by` (Link → User)

Tự fill bằng `frappe.session.user` khi manager submit. Read-only.

### `status` (Select)

| Value | Khi nào |
|---|---|
| Pending | Vừa tạo từ PWA/Desk, chưa duyệt |
| Approved | Manager đã submit |
| Rejected | Manager đã reject |

Status thay đổi cùng với docstatus:
- docstatus=0 → status=Pending
- docstatus=1 → status=Approved (auto set in before_submit)
- docstatus=2 → status=Rejected hoặc Cancelled

### `docstatus` (built-in)

| Value | Ý nghĩa |
|---|---|
| 0 | Draft — chờ duyệt |
| 1 | Submitted — đã duyệt, có hiệu lực |
| 2 | Cancelled — hủy hoặc reject |

---

## 4. Quy trình duyệt

### Cách 1: Nhân viên tự tạo qua PWA

1. Mở PWA → tab "Đăng ký WFH" (chỉ hiện nếu feature flag ON)
2. Chọn ngày + nhập location + lý do
3. Submit → tạo record status=Pending
4. PWA hiển thị "Đang chờ manager duyệt"

### Cách 2: Manager tạo từ Desk

1. Mở `HR WFH Approval` → New
2. Chọn employee + ngày
3. Lưu → tự động ở Draft
4. Click **Submit** → status=Approved

### Bước duyệt (Manager)

1. Manager mở danh sách `HR WFH Approval`, filter docstatus=0 + employee thuộc dept của mình
2. Click record
3. Review: ngày, lý do, employee có dept đúng không
4. Nếu OK → click **Submit** → status=Approved, set approved_by=session.user
5. Nếu không OK → click **Cancel** + ghi rõ lý do trong comment (Desk có panel comment bên phải)

PWA của nhân viên sẽ tự refresh sau ~1 phút và hiển thị status mới.

---

## 5. Tác dụng khi đã Approved

Sáng ngày `wfh_date`, khi nhân viên mở PWA:

1. PWA gọi `attendance.get_attendance_info`
2. Server check `HR WFH Approval` cho employee + today
3. Nếu có record docstatus=1 (Submitted/Approved):
   - Response trả `wfh_today.active = true`
   - Response trả `wfh_today.approval_name` + `work_location_label`
4. PWA hiển thị banner "Hôm nay bạn đăng ký WFH tại {location}" thay HomePage thường
5. Nhân viên tap "Bắt đầu ca WFH" → GPS audit (không enforce radius) + selfie nếu Policy có `enable_selfie_capture = 1`
6. POST `attendance.checkin_wfh`
7. Server insert `Employee Checkin` với:
   - `custom_checkin_source = "WFH-PWA"`
   - `custom_wfh_approval = <approval name>`

**Lưu ý**: nếu bật `enable_wfh_mode` ON nhưng nhân viên KHÔNG có approval cho hôm nay → checkin_wfh trả `WFH_NOT_APPROVED`. PWA hướng dẫn xin approval.

---

## 6. Reject / Cancel

### Reject (chưa Submit)

1. Manager mở record Draft
2. Click **Delete** hoặc **Cancel** (chuyển docstatus=2)
3. Comment lý do

### Cancel approval đã Submit

Trường hợp: đã duyệt nhưng nhân viên đổi ý hoặc emergency cần làm onsite.

1. Manager mở record docstatus=1
2. Click **Cancel** → status=Cancelled, docstatus=2
3. Nhân viên không còn xin được WFH ngày này. PWA sẽ tự refresh và hiển thị HomePage onsite.

Sau cancel, **không thể edit lại** — nếu cần lại WFH cùng ngày, phải tạo record mới (vì unique constraint check trên (employee, wfh_date) cho cả docstatus=1 và 0).

---

## Liên quan

- [HR Attendance Policy](HR-Attendance-Policy.html) — bật flag enable_wfh_mode
- [Tổng quan & Setup](Cham-Cong-Tong-Quan.html)
