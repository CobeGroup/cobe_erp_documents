---
title: Shift Type & Auto Attendance (Cấu hình ca làm việc)
layout: default
parent: Chấm công & HR
nav_order: 6
---

# Shift Type & Auto Attendance — Cấu hình ca làm việc

> Shift Type là doctype **chuẩn của HRMS**, có sẵn — không phải doctype custom. HR Manager cấu hình record cho từng nhóm nhân viên, sau đó assign vào Employee.
>
> Sau khi setup xong, scheduled job **Process Auto Attendance** của HRMS sẽ tự đọc Employee Checkin log → tạo record **Attendance** (Present / Absent / Half Day / Late) hàng ngày.

---

## Mục lục

1. [Vì sao cần Shift Type](#1-vì-sao-cần-shift-type)
2. [Các field quan trọng](#2-các-field-quan-trọng)
3. [Bảng cấu hình 6 nhóm Cobe](#3-bảng-cấu-hình-6-nhóm-cobe)
4. [Tạo Holiday List](#4-tạo-holiday-list)
5. [Assign Shift Type cho Employee](#5-assign-shift-type-cho-employee)
6. [Process Auto Attendance — scheduled job](#6-process-auto-attendance--scheduled-job)
7. [Penalty rule (thiếu IN hoặc OUT)](#7-penalty-rule-thiếu-in-hoặc-out)
8. [Trường hợp Sales AKW — ca đôi (sáng + chiều)](#8-trường-hợp-sales-akw--ca-đôi-sáng--chiều)
9. [Sự cố thường gặp](#9-sự-cố-thường-gặp)

---

## 1. Vì sao cần Shift Type

- **Trễ / về sớm**: Frappe tự flag `late_entry`, `early_exit` so với `start_time` / `end_time` của Shift Type.
- **Half Day**: nếu nhân viên không đủ số giờ làm tối thiểu → Attendance.status=Half Day (tự).
- **Absent**: thiếu IN hoặc OUT, hoặc giờ làm dưới ngưỡng absent → status=Absent.
- **Salary**: Salary Slip tính theo Attendance records → cần Shift Type để có Attendance đúng.

→ **Không config Shift Type = không có auto-attendance**. Phải config trước khi đi vào sản xuất.

---

## 2. Các field quan trọng

Mở Desk → search "Shift Type" → **New**.

### `name` (Data, bắt buộc)
Tên ca, ví dụ: `Office`, `Kho`, `Sales-Sáng`, `Sales-Chiều`, `Showroom`, `Bình Đại`, `Kỹ thuật Full`.

### `start_time` / `end_time` (Time)
Giờ bắt đầu/kết thúc ca. Vd `08:00:00` / `17:00:00`.

### `enable_auto_attendance` (Check)
**Bật** — bắt buộc, không bật thì scheduled job bỏ qua ca này.

### `holiday_list` (Link → Holiday List)
List ngày lễ áp dụng cho ca. Nếu trống → dùng Holiday List default của Company.

### `late_entry_grace_period` (Int, phút)
Sau giờ này → flag `late_entry = 1`. Vd 15 = trễ ≤15 phút không bị flag, trễ 16 phút trở lên bị flag.

### `early_exit_grace_period` (Int, phút)
Trước `end_time` bao nhiêu phút coi là về sớm. Vd 15 = về sớm ≤15 phút OK, ≥16 phút bị flag `early_exit = 1`.

### `working_hours_threshold_for_half_day` (Float, giờ)
Số giờ làm tối thiểu để được tính 1 ngày công đầy đủ. Dưới ngưỡng này → Attendance.status = **Half Day**. Mặc định Cobe nên đặt **4** (4 tiếng).

### `working_hours_threshold_for_absent` (Float, giờ)
Số giờ làm tối thiểu để được tính 1 ngày công. Dưới ngưỡng này → Attendance.status = **Absent**. Mặc định **1** (1 tiếng).

### `allow_check_out_after_shift_end_time` (Int, phút)
Cho phép tap "Chấm công OUT" trễ sau end_time bao nhiêu phút. Vd 240 = cho phép tap OUT đến 21h cho ca 17h. Cần cao để ai về sau OT vẫn chấm được.

### `determine_check_in_and_check_out` (Select)
Chọn cách hệ thống phân biệt log nào là IN, log nào là OUT:
- `Alternating entries as IN and OUT during the same shift` (default — tap đầu tiên = IN, tap thứ 2 = OUT)
- `Strictly based on Log Type in Employee Checkin` (đọc field `log_type` của Employee Checkin — PWA hiện đang dùng cái này)

→ **Cobe set là `Alternating...`** vì PWA của mình không gửi `log_type` rõ ràng (server tự tính).

### `process_attendance_after` (Date)
Job chỉ chạy cho ngày từ ngày này trở đi. Thường set = ngày go-live.

### `last_sync_of_checkin` (Datetime)
Auto-update bởi system, **không sửa tay**. Là mốc thời gian mới nhất job đã xử lý.

---

## 3. Bảng cấu hình 6 nhóm Cobe

> Đây là gợi ý — mày tự điều chỉnh giờ thực tế từng nhóm. Bấm `New` 6 lần, mỗi lần điền theo 1 dòng dưới đây.

| Shift Type | start_time | end_time | grace_late | grace_early | half_day_h | absent_h | check_out_after_min |
|---|---|---|---|---|---|---|---|
| **Office** | 08:00 | 17:00 | 15 | 15 | 4 | 1 | 240 |
| **Kho** | 07:30 | 17:00 | 10 | 15 | 4 | 1 | 180 |
| **Sales-Sáng** | 08:00 | 12:00 | 15 | 10 | 2 | 0.5 | 60 |
| **Sales-Chiều** | 13:30 | 18:00 | 15 | 15 | 2 | 0.5 | 120 |
| **Showroom** | 08:30 | 18:30 | 15 | 15 | 5 | 1 | 240 |
| **Bình Đại** | 07:30 | 17:00 | 30 | 30 | 4 | 1 | 240 |
| **Kỹ thuật Full** | 08:00 | 18:00 | 30 | 30 | 4 | 1 | 360 |

Tất cả bật `enable_auto_attendance = 1` và assign Holiday List "Việt Nam 2026".

---

## 4. Tạo Holiday List

Trước khi tạo Shift Type, cần có Holiday List để gán vào.

1. Desk → search **Holiday List** → **New**
2. `holiday_list_name = "Việt Nam 2026"`
3. `from_date = 2026-01-01`, `to_date = 2026-12-31`
4. Tab **Holidays** → bấm **Get Weekly Off Days** → chọn `weekly_off = "Sunday"` (Cobe nghỉ Chủ Nhật)
5. **Add Row** thủ công cho ngày lễ:
   - Tết Dương lịch (01/01)
   - Tết Âm lịch (5 ngày — tra lịch âm)
   - Giỗ Tổ Hùng Vương (10/03 âm)
   - 30/04, 01/05
   - Quốc khánh (02/09, có thể +1 ngày trước/sau)
6. **Save**

→ Holiday List này dùng chung cho mọi Shift Type. Ngày lễ → auto-attendance bỏ qua, không tính Absent.

**Lưu ý**: HR Overtime sẽ check ngày này → nếu nhân viên đi làm vào ngày trong Holiday List → OT multiplier = 3× (xem [HR Overtime Settings](HR-Overtime-Settings.html)).

---

## 5. Assign Shift Type cho Employee

Sau khi tạo Shift Type, gán cho từng nhân viên:

### Cách 1 — Sửa từng Employee
1. Desk → **Employee** → mở từng record
2. Tab **Attendance and Leave Details** → field `default_shift` → chọn Shift Type
3. **Save**

### Cách 2 — Bulk update (nhanh hơn cho nhiều người cùng group)
1. Desk → **Employee** → filter `department = "Sales"`
2. Tích chọn nhiều record → **Actions** → **Bulk Edit** → field `default_shift` = "Sales-Sáng"
3. Save → áp dụng cho tất cả selected

### Cách 3 — Shift Assignment (override theo ngày)
Khi cần đổi ca tạm thời (vd nhân viên Office làm Kho 1 tuần):

1. Desk → search **Shift Assignment** → **New**
2. `employee = "EMP-001"`, `shift_type = "Kho"`
3. `start_date = "2026-06-15"`, `end_date = "2026-06-19"`
4. **Submit**

→ Trong khoảng ngày đó, system dùng "Kho" thay vì `default_shift`.

---

## 6. Process Auto Attendance — scheduled job

HRMS có job hourly chạy tự động (không cần config thêm):

```
hrms.hr.doctype.shift_type.shift_type.process_auto_attendance
```

Logic:
1. Mỗi giờ, job lấy tất cả Shift Type có `enable_auto_attendance = 1`
2. Với mỗi shift, đọc `Employee Checkin` log từ `last_sync_of_checkin` đến giờ hiện tại
3. Group theo employee + ngày
4. Tính giờ làm = (max OUT) − (min IN)
5. Áp các ngưỡng → status = Present / Half Day / Absent
6. Tạo / update record **Attendance**

### Verify job đang chạy

Desk → **Scheduled Job Log** → filter `scheduled_job_type = "Shift Type"` → xem log gần nhất:
- Success → OK
- Error → click vào xem stack trace (thường do Employee thiếu `default_shift` hoặc thiếu Holiday List)

### Force chạy ngay (debug)

Console (bench):
```bash
bench --site cobe.cc execute hrms.hr.doctype.shift_type.shift_type.process_auto_attendance
```

---

## 7. Penalty rule (thiếu IN hoặc OUT)

Theo policy Cobe: **thiếu IN hoặc OUT = trừ 0.5 ngày công**.

Với config bảng trên (`working_hours_threshold_for_half_day = 4`), logic tự động như sau:

| Tình huống | Kết quả Attendance |
|---|---|
| Có cả IN và OUT, làm đủ 8h | Present (1 ngày) |
| Có cả IN và OUT, làm 5h (về sớm) | Present + `early_exit = 1` |
| Có cả IN và OUT, làm 3h | **Half Day** (trừ 0.5 ngày) |
| Chỉ có IN, không có OUT | Attendance không tạo → **Absent** sau end-of-day cron |
| Không có IN, không có OUT | **Absent** |
| Đi muộn 20 phút (grace 15) | Present + `late_entry = 1` (báo cho HR review) |

### Trừ 0.5 ngày khi thiếu OUT (chính sách)

HRMS mặc định: thiếu OUT → không tạo Attendance → end-of-day batch mark Absent (1 ngày). Để **trừ chỉ 0.5 ngày** thay vì 1 ngày:

**Option A** — chấp nhận default (1 ngày trừ): nhân viên phải tự nhớ chấm OUT, không có ngoại lệ.

**Option B** — tạo policy "1 lần/tháng được bỏ qua": HR review danh sách Attendance.status=Absent của tháng, manual đổi 1 record sang Half Day. **Khuyến nghị** vì công bằng hơn.

→ Sẽ làm chính xác hơn ở [HR Overtime Settings](HR-Overtime-Settings.html) bằng cách add field `monthly_grace_count`.

---

## 8. Trường hợp Sales AKW — ca đôi (sáng + chiều)

Sales AKW làm 2 ca tách rời: sáng 8h–12h, chiều 13h30–18h. Có 2 cách handle:

### Cách 1 — Tạo 2 Shift Type, dùng Shift Assignment theo ca

- Sáng: assign shift `Sales-Sáng` (8h–12h)
- Chiều: assign shift `Sales-Chiều` (13h30–18h)
- Nhân viên Sales tap chấm công **4 lần/ngày**: IN sáng, OUT sáng, IN chiều, OUT chiều
- Cần `Shift Assignment` để switch giữa sáng và chiều

→ Phức tạp về vận hành.

### Cách 2 — Tạo 1 Shift Type "Sales Full" 08:00–18:00 với break

- start_time `08:00`, end_time `18:00`
- `working_hours_threshold_for_half_day = 7` (8h − 1h nghỉ trưa)
- Nhân viên tap **2 lần/ngày**: IN sáng + OUT chiều
- Bỏ qua nghỉ trưa, giả định 1h break trong toàn ca

→ **Khuyến nghị Cobe dùng Cách 2** vì đơn giản. Ai cố ý nghỉ trưa quá lâu sẽ bị flag qua selfie / GPS lúc OUT.

---

## 9. Sự cố thường gặp

### 9.1. Attendance không tạo dù có log Employee Checkin

Check theo thứ tự:

1. Employee có `default_shift` chưa? (Desk → Employee form)
2. Shift Type có `enable_auto_attendance = 1` chưa?
3. Shift Type có gán `holiday_list` chưa?
4. `process_attendance_after` có ≤ ngày cần tính không?
5. Job có lỗi không? (Scheduled Job Log)

### 9.2. Tất cả nhân viên đều Absent ngày Chủ Nhật

→ Holiday List thiếu **Get Weekly Off Days**. Mở Holiday List → bấm nút → Save.

### 9.3. Nhân viên ca Bình Đại trễ 20 phút vẫn không bị flag

Check `late_entry_grace_period` — nếu = 30 thì trễ 20 phút vẫn nằm trong grace, không flag. Giảm xuống 15 hoặc 0 nếu muốn strict.

### 9.4. Đổi Shift Type giờ làm → nhân viên cũ bị tính lại Attendance ngày cũ

Khi sửa Shift Type, các Attendance đã tạo **không tự update**. Nếu cần re-process:
1. Mở Shift Type → set `last_sync_of_checkin` = ngày trước khi sửa
2. Job tiếp theo sẽ re-process

→ Cẩn thận: re-process sẽ ghi đè Attendance cũ. Backup trước.

---

## Liên quan

- [Tổng quan & Setup](Cham-Cong-Tong-Quan.html)
- [HR Office Location](HR-Office-Location.html) — định vị GPS
- [HR Overtime Settings](HR-Overtime-Settings.html) — config OT multiplier (sẽ làm tiếp)
- [HR WFH Salary Settings](HR-WFH-Salary-Settings.html) — rule 70% WFH (sẽ làm tiếp)
