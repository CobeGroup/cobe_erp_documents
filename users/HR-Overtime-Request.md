---
title: HR Overtime Request
layout: default
parent: Lương & Thưởng
nav_order: 3
---

# HR Overtime Request — Đơn làm thêm giờ (góc nhìn HR)

> Doctype của `hr_for_cobegroup` (module Attendance). Mỗi lần làm thêm = 1 record,
> mỗi nhân viên **tối đa 1 đơn/ngày**. Nhân viên tạo và người duyệt xử lý **trên PWA
> my-workspace** — trang này dành cho HR cần xem/sửa trên Desk và hiểu luồng dữ liệu.
>
> 📱 Hướng dẫn end-user: [Xin làm thêm giờ](Guide-NhanVien-LamThem.html) ·
> [Duyệt đơn làm thêm](Duyet-Lam-Them.html). Cấu hình: [Cấu hình Overtime](HR-Overtime-Settings.html).

---

## Mục lục

1. [Nguyên tắc thiết kế](#1-nguyên-tắc-thiết-kế)
2. [Các field](#2-các-field)
3. [Vòng đời một đơn](#3-vòng-đời-một-đơn)
4. [Đối chiếu chấm công (granted_hours)](#4-đối-chiếu-chấm-công-granted_hours)
5. [Quy đổi Tiền lương → payroll](#5-quy-đổi-tiền-lương--payroll)
6. [Quy đổi Nghỉ bù → Leave Application](#6-quy-đổi-nghỉ-bù--leave-application)
7. [Can thiệp trên Desk](#7-can-thiệp-trên-desk)

---

## 1. Nguyên tắc thiết kế

**Duyệt trước — đối chiếu sau.** Check-out muộn KHÔNG tự thành OT (auto-attendance
vẫn cap `working_hours` về giờ ca chuẩn). Chỉ ngày có đơn **Approved** thì phần giờ
dôi sau ca mới được công nhận, và không bao giờ vượt số giờ đã xin:

```
granted_hours = min(giờ check-out thực tế sau shift_end, expected_hours của đơn)
```

Điều này chặn 2 kiểu lạm dụng: *nấn ná ở lại thành OT* (không đơn → 0h) và *xin ít
làm nhiều tính nhiều* (cap theo đơn).

---

## 2. Các field

| Field | Kiểu | Ghi chú |
|---|---|---|
| `employee` / `employee_name` / `company` | Link/fetch | NV xin làm thêm |
| `ot_date` | Date | Ngày làm thêm — **unique per employee** (đơn Pending/Approved) |
| `from_time` / `to_time` | Time | Khung giờ dự kiến; cho phép vắt qua nửa đêm |
| `expected_hours` | Float | Tự tính từ khung giờ; tối đa **12h/ngày** |
| `payout_type` | Select | **Tiền lương** \| **Nghỉ bù** |
| `reason` | Small Text | Nội dung công việc (bắt buộc) |
| `status` | Select | **Pending** → **Approved** / **Rejected** (không dùng docstatus) |
| `approved_by` / `approved_on` | Link/Datetime | Ai duyệt, lúc nào |
| `attendance` | Link Attendance | Gắn tự động khi đối chiếu |
| `granted_hours` | Float | Giờ được công nhận sau đối chiếu |

Người duyệt = **Shift Request Approver** (trên Employee hoặc Department) — cùng bộ
với Attendance Request, tách khỏi Leave Approver. HR Manager override được.

---

## 3. Vòng đời một đơn

```
NV tạo trên PWA (status=Pending, notify người duyệt)
  → Manager duyệt trên tab Cần duyệt
      ├─ Approve → status=Approved (+ đối chiếu ngay nếu Attendance đã tồn tại)
      └─ Reject  → status=Rejected (notify NV)
  → Ngày làm thêm: Attendance được tạo (auto-attendance hằng giờ)
      → hook đối chiếu → ghi granted_hours + attendance vào đơn
```

- NV tự **huỷ** được đơn khi còn Pending (thành Rejected).
- Đơn cho **ngày quá khứ** chỉ nhận trong **7 ngày** (khai bổ sung khi quên xin trước).
- Tối đa **10 đơn Pending**/NV (chống spam).

---

## 4. Đối chiếu chấm công (granted_hours)

Chạy tự động ở 2 thời điểm (cùng logic — `attendance/overtime.py`):

1. **Attendance được tạo** khi đơn đã Approved → hook `before_save` tính và ghi luôn.
2. **Đơn được Approve muộn** (Attendance đã có) → đối chiếu ngay lúc bấm Duyệt
   (ghi thẳng vào Attendance kể cả đã submit).

Không có `out_time` (quên check-out) hoặc check-out trước giờ tan ca → granted = 0,
đơn vẫn Approved nhưng không có giờ. Cảnh báo *"Làm thêm sau giờ"* được **tắt** cho
ngày có đơn Approved.

---

## 5. Quy đổi Tiền lương → payroll

Với `payout_type = Tiền lương`, hook ghi vào **Attendance** (field HRMS native):
`overtime_type` (lấy từ [HR Policy → Default Overtime Type](HR-Overtime-Settings.html))
và `actual_overtime_duration = granted_hours`.

Từ đó là luồng **HRMS native**:

```
Attendance (submitted, Present, có overtime_type)
  → Overtime Slip (gom theo kỳ lương; tạo tay hoặc Payroll Entry tự tạo)
  → Additional Salary (component "Lương làm thêm giờ")
  → Salary Slip
```

Tiền = số giờ × đơn giá giờ (theo Overtime Type) × hệ số (thường 1.5 / cuối tuần 2.0 /
lễ 3.0). Chi tiết cấu hình + checklist trước kỳ lương đầu tiên:
[Cấu hình Overtime](HR-Overtime-Settings.html).

---

## 6. Quy đổi Nghỉ bù → Leave Application

Với `payout_type = Nghỉ bù`, đơn **không** vào Overtime Slip (không ra tiền). Thay
vào đó nó là **căn cứ bắt buộc** khi NV xin Nghỉ bù:

- Đơn Leave Application loại `is_compensatory` phải khai `custom_comp_worked_date`
  = đúng `ot_date` của một đơn OT **Approved + payout Nghỉ bù**.
- Mỗi ngày làm thêm chỉ bù **1 lần** (hệ thống check đơn nghỉ bù active trùng ngày).
- Không có đơn hợp lệ → chặn ngay khi NV gửi đơn nghỉ.

Cơ chế Leave Type Nghỉ bù (allow_negative, không trừ lương) giữ nguyên như cũ.

---

## 7. Can thiệp trên Desk

HR Manager mở **Desk → HR Overtime Request** khi cần:

| Việc | Cách làm |
|---|---|
| Duyệt thay / sửa duyệt nhầm | Sửa field `status` (Pending/Approved/Rejected) — doctype không submittable nên sửa trực tiếp được |
| Đơn quá hạn 7 ngày | HR tạo đơn hộ trên Desk (điền employee, ngày, giờ, payout) rồi set Approved — hook đối chiếu chạy khi có Attendance; nếu Attendance đã có thì sửa `status` qua PWA-approve không được, chạy đối chiếu bằng cách mở đơn và lưu lại hoặc nhờ dev gọi `apply_to_existing_attendance` |
| Kiểm tra giờ đã ghi nhận | Xem `granted_hours` + link `attendance` trên đơn; hoặc mở Attendance xem section **Overtime** |
| Báo cáo OT tháng | List view HR Overtime Request lọc `status=Approved` + khoảng `ot_date`, tổng `granted_hours` |

> ⚠️ **Đừng sửa tay** `overtime_type`/`actual_overtime_duration` trên Attendance trừ
> khi hiểu rõ — Overtime Slip đọc thẳng 2 field này để tính tiền.
