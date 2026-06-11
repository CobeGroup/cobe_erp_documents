---
title: Compensatory Leave (Phép bù — đi làm bù weekend/lễ)
layout: default
parent: Chấm công & HR
nav_order: 8
---

# Compensatory Leave Request — Phép bù

> Tận dụng doctype **chuẩn HRMS**: `Compensatory Leave Request`. Không phải code mới.
>
> Khi nhân viên đi làm vào ngày nghỉ (Chủ Nhật / Lễ) → request → auto allocate ngày phép vào Leave Type "Phép bù".

---

## Mục lục

1. [Khái niệm](#1-khái-niệm)
2. [Pre-requisite](#2-pre-requisite)
3. [Quy trình nhân viên](#3-quy-trình-nhân-viên)
4. [Quy trình manager duyệt](#4-quy-trình-manager-duyệt)
5. [Sử dụng phép bù](#5-sử-dụng-phép-bù)
6. [Phân biệt Phép bù vs Overtime](#6-phân-biệt-phép-bù-vs-overtime)
7. [Sự cố thường gặp](#7-sự-cố-thường-gặp)

---

## 1. Khái niệm

**Compensatory Leave Request** = đơn xin được "bù" 1 ngày phép vì đã đi làm vào ngày nghỉ.

Cobe áp dụng khi:
- Nhân viên đi làm vào **Chủ Nhật** (weekly off)
- Nhân viên đi làm vào ngày trong **Holiday List** (Tết, lễ)
- **KHÔNG** áp dụng cho làm thêm giờ trong ngày làm việc bình thường (→ dùng [HR Overtime Request](HR-Overtime-Request.html))

Có 2 cơ chế khen thưởng cho việc đi làm ngày nghỉ:

| Cơ chế | Khi dùng | Hệ quả |
|---|---|---|
| **Phép bù** | Nhân viên muốn có ngày nghỉ bù | Allocate 1 ngày vào Leave Type "Phép bù" → dùng sau |
| **OT × 2 hoặc × 3** | Nhân viên muốn nhận tiền | Tăng lương qua [HR Overtime Request](HR-Overtime-Request.html) |

→ Nhân viên **chọn 1 trong 2**, không cả hai. Quy định ở Cobe: mặc định phép bù, ai muốn nhận tiền phải submit OT thay vì Comp-Off.

---

## 2. Pre-requisite

Trước khi dùng Compensatory Leave Request, cần đảm bảo đã setup:

1. ✅ **Holiday List** đã có Weekly Off = Sunday và ngày lễ → xem [Shift Type Setup §4](HRMS-Shift-Type-Setup.html#4-tạo-holiday-list)
2. ✅ **Leave Type** "Phép bù" với `is_compensatory = 1` → xem [Leave Types Setup §2.4](HRMS-Leave-Types-Setup.html#24-phép-bù-comp-off--co)
3. ✅ Employee có `default_shift` → để khi đi làm Chủ Nhật, system biết shift để tạo Attendance log
4. ✅ Phone Registration đã active (chấm công bằng PWA bình thường)

---

## 3. Quy trình nhân viên

### Bước 1 — Đi làm Chủ Nhật / Lễ và chấm công bình thường

Nhân viên dùng PWA tap **Chấm công** như ngày thường:
- IN: sáng vào VP
- OUT: cuối ngày

→ Hệ thống tạo Employee Checkin log như bình thường.

### Bước 2 — Submit Compensatory Leave Request

Sau khi đi làm xong (cùng ngày hoặc 1–7 ngày sau):

1. Desk → search **Compensatory Leave Request** → **New**
2. Điền:
   - `employee` (auto fill)
   - `work_from_date` = ngày đã đi làm (vd Chủ Nhật 14/06)
   - `work_end_date` = ngày kết thúc đợt đi làm (nếu chỉ 1 ngày thì = work_from_date)
   - `reason` = lý do (vd "Giao hàng gấp KH ABC, đi làm CN 14/06")
   - `leave_type` = **Phép bù**
3. Submit

→ Status = `Open`, gửi email cho `leave_approver` của Employee.

### Bước 3 — Manager duyệt (xem section 4)

### Bước 4 — Sau khi duyệt, dùng phép bù để nghỉ sau

Khi đã có allocation Phép bù → nhân viên submit **Leave Application** type=Phép bù để xin nghỉ.

---

## 4. Quy trình manager duyệt

1. Manager nhận email
2. Mở Compensatory Leave Request
3. Verify:
   - Ngày `work_from_date` thực sự là Sunday hoặc trong Holiday List không?
   - Có Employee Checkin của nhân viên đó ở ngày đó không? → bằng chứng đã đi làm
   - Lý do hợp lệ không?
4. Action:
   - **Approve** → status=Approved, auto tạo Leave Allocation type="Phép bù" với 1 ngày → cộng dồn vào allocation cũ nếu có
   - **Reject** → status=Rejected, không allocate

### Verify Allocation đã tạo

Sau Approve, vào Desk → **Leave Allocation** → filter employee + leave_type="Phép bù" → có record mới với 1 ngày.

---

## 5. Sử dụng phép bù

Nhân viên dùng phép bù như phép thường:

1. Desk → **Leave Application** → **New**
2. `leave_type = "Phép bù"`
3. `from_date` / `to_date` (ngày muốn nghỉ)
4. Submit → routing qua [Tiered Approval Workflow](HRMS-Leave-Types-Setup.html#4-tiered-approval-workflow)

**Lưu ý**: Phép bù **không carry forward**. Hết năm chưa dùng → mất. Nhân viên nên dùng trong vòng 3 tháng.

---

## 6. Phân biệt Phép bù vs Overtime

| Tiêu chí | Compensatory Leave Request | HR Overtime Request |
|---|---|---|
| Hệ quả | +1 ngày phép | +X giờ × hourly_rate × multiplier (tiền) |
| Khi nào dùng | Đi làm cả ngày Chủ Nhật/Lễ | Làm thêm giờ trong ngày, hoặc đi cả ngày Chủ Nhật/Lễ nhưng muốn nhận tiền |
| Multiplier | Không có (1:1 ngày) | 1.5× / 2× / 3× tuỳ ngày |
| Duyệt | Direct Manager | Direct Manager, có thể auto theo cap |
| Cap | Không giới hạn (theo số lần đi làm bù) | Capped 40h/tháng (theo HR Overtime Settings) |

→ **Nhân viên chỉ chọn 1 trong 2 cho cùng 1 ngày làm**, không được vừa Comp-Off vừa OT.

→ Quy định Cobe khuyến nghị: làm bù 1–2 ngày/tháng dùng OT cho khoản tiền; làm bù thường xuyên (>3 ngày/tháng) chuyển sang Comp-Off để có ngày nghỉ thực sự.

---

## 7. Sự cố thường gặp

### 7.1. Nhân viên submit nhưng không có nút Approve

→ Workflow của Leave Application không apply cho Compensatory Leave Request. Doctype này dùng workflow đơn giản (Open → Approved/Rejected) qua workflow_state riêng.

Nếu chưa thấy nút Approve: check role của manager có `Leave Approver` không.

### 7.2. Approve rồi mà Allocation không tạo

Check Leave Type "Phép bù":
- `is_compensatory = 1` (bắt buộc)
- `allow_negative = 0` (không cho âm)

Nếu sai → sửa, sau đó re-Approve.

### 7.3. Đi làm Chủ Nhật nhưng không chấm công

→ Không có bằng chứng đi làm. Manager nên reject. Nhân viên cần học chấm công kể cả ngày nghỉ.

### 7.4. Đăng ký Comp-Off rồi sau muốn đổi sang OT

→ Cancel Compensatory Leave Request, sau đó submit HR Overtime Request cho cùng ngày. Lưu ý không cho phép 2 records active cùng lúc.

---

## Liên quan

- [Tổng quan & Setup](Cham-Cong-Tong-Quan.html)
- [Leave Types Setup](HRMS-Leave-Types-Setup.html)
- [HR Overtime Request](HR-Overtime-Request.html) — lựa chọn ngược lại (nhận tiền thay vì ngày)
