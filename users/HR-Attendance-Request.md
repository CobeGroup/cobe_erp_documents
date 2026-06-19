---
title: Attendance Request (Xin chấm công bù / On Duty)
layout: default
parent: Chấm công & HR
nav_order: 4
---

# Attendance Request — Xin chấm công bù (On Duty)

> Doctype HRMS chuẩn. Nhân viên tạo đơn **"Chấm công bù"** qua nút **"Đề xuất"** trong tab **"Bảng công"** (chọn loại: Chấm công bù / WFH). Manager duyệt qua tab **"Cần duyệt"** (api.approval.act → submit Attendance Request → HRMS tự tạo Attendance). Tài liệu này giải thích cách dùng + working_hours được tính ra sao sau khi approve.
>
> **WFH có flow riêng** (đăng ký qua trang "Đăng ký WFH", cần check-in GPS) — xem [Làm việc từ xa (WFH)](HR-WFH-Approval.html).

---

## Mục lục

1. [Khi nào dùng](#1-khi-nào-dùng)
2. [Workflow 1 bước Manager](#2-workflow-1-bước-manager)
3. [Working hours được tính ra sao sau approve](#3-working-hours-được-tính-ra-sao-sau-approve)
4. [Cảnh báo "Quên check-in/out" trên Attendance](#4-cảnh-báo-quên-check-inout-trên-attendance)
5. [Các case thực tế](#5-các-case-thực-tế)

---

## 1. Khi nào dùng

Attendance Request (đơn "Chấm công bù") dùng cho các tình huống NV **không có / thiếu Employee Checkin log** nhưng cần Attendance hợp lệ:

| Case | reason field |
|---|---|
| NV quên check-in/out | `On Duty` (mặc định) + ghi `explanation` |
| NV đi gặp khách hàng / công tác cả ngày | `On Duty` |
| NV bù chấm công vì sự cố hệ thống | `On Duty` + `explanation` |

Khi NV tạo qua PWA (`api.attendance_request.create_attendance_request`), `reason` mặc định = **`On Duty`** → khi manager duyệt, HRMS đánh status **`Present`**. Nếu đơn đánh dấu `half_day` → status `Half Day`.

> **WFH KHÔNG dùng đơn này.** WFH có flow riêng (`reason = "Work From Home"`, đăng ký qua trang "Đăng ký WFH" + check-in GPS) — xem [Làm việc từ xa (WFH)](HR-WFH-Approval.html). Endpoint `get_my_attendance_requests` cũng lọc bỏ các đơn có reason WFH.

---

## 2. Workflow 1 bước Manager

Cobe **giữ default HRMS** (không custom Workflow doctype như Leave Application):

```
NV tạo "Chấm công bù" (tab Bảng công → nút "Đề xuất") → docstatus = 0
  ↓
Manager → tab "Cần duyệt" → Duyệt (api.approval.act, action="Submit" → docstatus = 1)
  ↓
HRMS tự tạo / update Attendance records cho khoảng ngày
```

Lý do giữ 1 step:
- Manager là người gần nhất biết NV có thật làm hôm đó không
- HR không cần duyệt từng cái quên check (overhead cao)
- Leave Application thì 2 step Cobe (vì impact lương + balance phép)

### Cách NV tạo đơn

1. Mở my-workspace → tab **"Bảng công"** → nút **"Đề xuất"** → chọn loại
2. Chọn khoảng ngày (`from_date` → `to_date`), nhập lý do (`explanation`)
3. (Tùy chọn) đánh dấu nửa ngày → `half_day`
4. Submit → tạo Attendance Request `docstatus = 0` (`reason = On Duty`)

### Cách Manager duyệt

1. Mở my-workspace → tab **"Cần duyệt"** (đơn hiện qua `api.approval.get_my_pending_approvals`)
2. Review reason + explanation
3. **Duyệt** → app gọi `api.approval.act` với `action = "Submit"` → `doc.submit()` → HRMS tạo Attendance (status `Present`, hoặc `Half Day` nếu đánh dấu nửa ngày)

> Phân quyền: nếu config `restrict_to_leave_approver = 1`, chỉ Manager là `Employee.leave_approver` của NV mới duyệt được (trừ HR Manager / System Manager override).

### Reject

Manager chọn **Cancel** (`api.approval.act`, `action = "Cancel"` → docstatus = 2). NV phải tạo đơn Chấm công bù mới nếu muốn lại.

---

## 3. Working hours được tính ra sao sau approve

Khi Attendance Request approve → HRMS tạo/update Attendance records (theo `from_date` đến `to_date`). Tiếp theo hook `Attendance.before_save` của Cobe chạy.

### Sequence chi tiết

```
1. NV check-in chỉ có 1 IN (8:00) hôm nay → forget OUT
2. Process Auto Attendance chạy (15 phút/lần)
   → Tạo Attendance docstatus=1 với:
     - working_hours = 0 (vì thiếu cặp IN+OUT)
     - status = Absent (vì < threshold)
3. NV nhận thấy → submit Attendance Request:
   - from_date = hôm nay, to_date = hôm nay
   - reason = (empty), explanation = "Quên check-out"
4. Manager Submit Attendance Request
5. HRMS update Attendance:
   - status = Present (reason `On Duty` → Present; `half_day` → Half Day)
   - working_hours vẫn = 0 (HRMS không tự re-compute)
6. Hook `Attendance.before_save` của Cobe chạy:
   - _fill_default_working_hours → working_hours = giờ ca chuẩn (vd 9h cho 8:00-17:00)
   - _apply_lunch_break → trừ 60 phút break → working_hours = 8h
   - _set_no_shift_warning → check whitelist / shift
7. Attendance save → working_hours = 8h
```

### Logic ngắn gọn

| Case | working_hours sau approve |
|---|---|
| Đủ IN + OUT (đã đủ log từ trước) | working_hours từ HRMS (logs thực tế) — trừ break nếu first IN trước lunch |
| Chỉ IN, không OUT | working_hours = standard shift hours - lunch break (vd 8h) |
| Chỉ OUT, không IN | working_hours = standard shift hours - lunch break (vd 8h) |
| Không IN + không OUT (quên hoàn toàn) | working_hours = standard shift hours - lunch break (vd 8h) |

→ **Mặc định = standard shift hours** trừ break. Manager có thể edit `working_hours` trên Attendance form nếu muốn override (vd NV chỉ làm half day → set 4h).

### Khi nào hook KHÔNG fill

- `working_hours > 0` từ HRMS (đã có log đủ) → KHÔNG override (giữ giá trị thực tế)
- Status = Absent / On Leave / Half Day → giữ nguyên 0
- Không có Shift Type gắn → không biết giờ chuẩn → giữ 0

---

## 4. Cảnh báo `hr_warning_type` trên Attendance

Khi Attendance được tạo / save, hook `_set_attendance_warning` set `hr_warning_type` theo priority chain (loại trừ nhau):

| Priority | Value | Khi nào set |
|---|---|---|
| 1 (cao nhất) | `Không có ca` | Whitelist KTV không SA / Office không Shift |
| 2 | `Quên check-in` | Có log nhưng chỉ có OUT |
| 2 | `Quên check-out` | Có log nhưng chỉ có IN |
| 3 | `Làm thêm sau giờ` | Có đủ IN+OUT, OUT > shift_end + `notify_overtime_threshold_minutes` |
| — | (clear) | Mọi thứ OK / On Leave / WFH/On Duty từ AR (không log) / no log entire day |

**Tự loại trừ**: 1 Attendance record = 1 warning value. Priority cao thắng. Vd có cả OT lẫn thiếu IN → flag = "Quên check-in".

**Trùng phục hồi**: Hook re-evaluate mỗi lần Attendance save → khi AR approved cập nhật log thiếu → warning tự clear.

### Notification Log đi kèm

Đồng thời với set flag, hook `after_insert` gửi Notification Log (bell icon) cho NV + Manager (`Employee.leave_approver`) — message khác nhau theo warning type:

| Warning | Notification text |
|---|---|
| Không có ca | "Attendance ngày X không có Shift Assignment / Service Appointment. HR cần kiểm tra." |
| Quên check-in | "Bạn quên check-in ngày X. Vui lòng tạo Attendance Request bù." |
| Quên check-out | "Bạn quên check-out ngày X. Vui lòng tạo Attendance Request bù." |
| Làm thêm sau giờ | "Bạn check OUT lúc HH:MM (sau giờ tan ca N phút) ngày X. ... Tạo HR Overtime Request nếu cần tính OT." |

Idempotent: 1 Notification / Attendance / type.

### Scheduled job bổ sung

`notify_forgot_checkin.py` chạy 21:00 mỗi ngày chỉ cover **case "no log entire day"** (NV có Shift Assignment hôm đó nhưng KHÔNG check-in chút nào — hook không thể detect vì Attendance có thể không tồn tại). Hook xử lý mọi case khác real-time.

### Audit nhanh cho HR

Desk → Attendance list → filter `hr_warning_type` để thấy:
- "Quên check-out" → nhân viên cần tạo Attendance Request bù
- "Làm thêm sau giờ" → nhân viên có thể cần tạo OT Request
- "Không có ca" → HR cần config Shift Assignment / FS Service Appointment

---

## 5. Các case thực tế

### Case A: NV đi công tác 3 ngày liên tục (T2-T4)

1. NV tạo "Chấm công bù" (tab Bảng công → nút "Đề xuất"):
   - from_date = T2, to_date = T4
   - reason = `On Duty`
   - explanation = "Công tác Hà Nội gặp khách hàng"
2. Manager duyệt qua tab "Cần duyệt" (Submit)
3. HRMS tạo 3 Attendance records (T2, T3, T4) với status = Present
4. Hook fill working_hours = 9h (ca 8-17h) - 1h break = 8h cho mỗi ngày
5. Salary Slip kỳ này tính bình thường — 3 ngày Present tương đương

> **WFH** (làm tại nhà) thì KHÔNG dùng đơn này — đăng ký qua trang "Đăng ký WFH", xem [Làm việc từ xa (WFH)](HR-WFH-Approval.html).

### Case B: NV quên check-out

NV tạo "Chấm công bù" cho đúng ngày quên (`from_date = to_date`), `reason = On Duty`, ghi `explanation = "Quên check-out"`. Manager duyệt qua "Cần duyệt" → Attendance status = Present, hook fill working_hours = giờ ca chuẩn - break.

### Case C: NV làm ca chiều (14:00-22:00) — không bị trừ break trưa

1. NV check IN 14:00 + OUT 22:00 → working_hours từ HRMS = 8h
2. Hook `_apply_lunch_break`:
   - first_in_seconds = 14×3600 = 50400
   - lunch_start_seconds = 12×3600 = 43200
   - first_in > lunch_start → KHÔNG trừ
3. working_hours cuối = 8h (giữ nguyên)

### Case D: NV làm 10h liên tục (8:00-18:00) — check OUT muộn 1h sau shift end

Shift: 8:00-17:00 (9h standard).

1. NV check IN 8:00 + OUT 18:00 → HRMS combo First/Last tính raw = 10h
2. Hook `_cap_working_hours_to_shift`:
   - out 18:00 > shift_end 17:00 → cap
   - capped = (17:00 - 8:00) / 3600 = 9h
   - working_hours = 9h (giảm từ 10h)
3. Hook `_apply_lunch_break`: first_in 8:00 < lunch_start 12:00 → trừ 1h
4. working_hours cuối = **8h** (đúng giờ ca chuẩn 8 tiếng)
5. Sau Attendance insert → hook `after_insert._notify_potential_overtime`:
   - out (18:00) - shift_end (17:00) = 60 phút > 30 phút threshold
   - Tạo Notification Log cho NV: "Bạn đã check OUT lúc 18:00 (sau giờ tan ca 60 phút) ngày X. working_hours chỉ tính đến hết giờ ca chuẩn. Nếu cần tính OT, vui lòng tạo HR Overtime Request hoặc liên hệ Manager."
6. NV xem Notification (bell icon) → submit OT Request nếu muốn được tính lương OT

→ working_hours **không bao giờ vượt standard shift hours**. OT auto của HRMS không kick in (intentional).

### Case E: NV check IN/OUT 4 lần (8:00 IN, 12:00 OUT, 13:00 IN, 18:00 OUT)

Cảnh báo: phụ thuộc Shift Type config.

**Nếu Shift combo = `First Check-in and Last Check-out`** (recommended):
- HRMS working_hours = 18-8 = 10h
- Hook trừ break = 9h
- KẾT QUẢ: 9h ✓

**Nếu Shift combo = `Every Valid Check-in and Check-out`**:
- HRMS working_hours = (12-8) + (18-13) = 9h (đã tự trừ break giữa)
- Hook lại trừ break = 8h
- KẾT QUẢ: 8h ✗ DOUBLE-TRỪ

→ Khi bật auto-trừ break trong HR Policy, **PHẢI set Shift Type combo = `First/Last`**.

### Case F: NV làm chỉ 30 phút (đến công tác xong về)

1. NV check IN 9:00 + OUT 9:30 → HRMS = 0.5h
2. Hook trừ break = -0.5h → `max(0, -0.5)` = 0h
3. Threshold absent 1h → status = Absent

→ Nếu Manager thấy bất hợp lý, edit `working_hours` thẳng + edit `status` trên Attendance form.

---

## Liên quan

- [HR Policy — Lunch Break](HR-Policy.html#33-lunch-break)
- [Holiday & Shift Setup](HR-Holiday-Shift-Setup.html)
- [HR Leave Setup](HR-Leave-Setup.html) — workflow 2 bước cho Leave Application (khác AR)
