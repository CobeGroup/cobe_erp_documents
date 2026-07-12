---
title: Cấu hình Overtime
layout: default
parent: Lương & Thưởng
nav_order: 2
---

# Cấu hình Overtime (làm thêm giờ)

> Không có doctype "HR Overtime Settings" riêng — cấu hình OT nằm ở **3 chỗ**:
> **Overtime Type** (HRMS native — cách tính tiền), **HR Policy** (chọn Overtime Type
> cho từng Company), và **Payroll Settings** (bật auto tạo Overtime Slip khi chạy lương).
>
> Permissions: **HR Manager**, **System Manager**.

---

## Mục lục

1. [Sơ đồ cấu hình](#1-sơ-đồ-cấu-hình)
2. [Overtime Type — cách tính tiền](#2-overtime-type--cách-tính-tiền)
3. [HR Policy — Default Overtime Type](#3-hr-policy--default-overtime-type)
4. [Payroll Settings & chạy lương có OT](#4-payroll-settings--chạy-lương-có-ot)
5. [Checklist trước kỳ lương đầu tiên có OT](#5-checklist-trước-kỳ-lương-đầu-tiên-có-ot)

---

## 1. Sơ đồ cấu hình

Hệ thống đã **seed sẵn** khi cài đặt (patch `v0_016`):

| Thành phần | Bản ghi seed sẵn | Vai trò |
|---|---|---|
| Salary Component | **Lương làm thêm giờ** (Earning) | Dòng lương nhận tiền OT trên Salary Slip |
| Overtime Type | **Làm thêm giờ** | Cách tính đơn giá + hệ số nhân |
| HR Policy (mỗi Company) | `default_overtime_type` = "Làm thêm giờ" | Company này áp Overtime Type nào |
| Payroll Settings | `create_overtime_slip` = **TẮT** | Payroll có tự tạo Overtime Slip không |

Chỉ cần **rà lại Overtime Type** (mục 2) và **bật Payroll Settings** (mục 4) là chạy được.

---

## 2. Overtime Type — cách tính tiền

Desk → search **Overtime Type** → mở **"Làm thêm giờ"**. Các field quan trọng:

| Field | Seed sẵn | Ý nghĩa |
|---|---|---|
| Overtime Salary Component | Lương làm thêm giờ | Tiền OT đổ vào component này |
| Overtime Calculation Method | Salary Component Based (trên **Basic**) | Đơn giá giờ = lương Basic ÷ số ngày công ÷ giờ chuẩn/ngày |
| Standard Multiplier | **1.5** | Hệ số ngày thường (150% — luật VN) |
| Applicable for Weekend + Weekend Multiplier | ✓ / **2.0** | Cuối tuần 200% |
| Applicable for Public Holiday + Holiday Multiplier | ✓ / **3.0** | Ngày lễ 300% (theo Holiday List) |
| Maximum Overtime Hours Allowed | 0 (không trần) | Trần giờ OT/ngày khi tính tiền — set nếu công ty muốn cap |

> 💡 **Rà lại 2 điểm trước khi tin số tiền:**
> 1. Component **"Basic"** có đúng là lương cơ bản trong Salary Structure của công ty
>    không — nếu công ty dùng tên khác (vd "Lương cơ bản") thì sửa danh sách
>    *Applicable Salary Component*.
> 2. Muốn đơn giá cố định (vd 50.000đ/giờ) → đổi method sang **Fixed Hourly Rate** +
>    điền `hourly_rate`.

Có thể tạo **nhiều Overtime Type** (vd riêng cho khối kỹ thuật) rồi gán per-company
qua HR Policy (mục 3).

---

## 3. HR Policy — Default Overtime Type

Desk → **HR Policy** (mỗi Company 1 bản ghi) → section **Overtime Notification**:

| Field | Ý nghĩa |
|---|---|
| **Default Overtime Type** | Giờ OT đã duyệt của Company này tính theo Overtime Type nào |
| Notify OT Threshold (minutes) | NV check-out muộn quá N phút **mà không có đơn OT** → nhắc NV tạo đơn (0 = tắt nhắc) |

Không set Default Overtime Type → hệ thống fallback nếu toàn site chỉ có đúng 1
Overtime Type; nhiều hơn thì **giờ OT không được ghi vào Attendance** (có log lỗi).

---

## 4. Payroll Settings & chạy lương có OT

Giờ OT đã duyệt nằm trên Attendance — muốn ra tiền phải có **Overtime Slip** gom
theo kỳ lương:

- **Cách tự động (khuyên dùng):** Desk → **Payroll Settings** → tick
  **`create_overtime_slip`**. Từ đó mỗi lần chạy **Payroll Entry**, hệ thống tự tạo +
  submit Overtime Slip cho các NV có giờ OT → Additional Salary → vào Salary Slip.
- **Cách tay:** Desk → **Overtime Slip** → New → chọn Employee + kỳ → hệ thống tự
  nạp các Attendance có OT trong kỳ → Submit.

> ⚠️ Mặc định sau deploy `create_overtime_slip` đang **TẮT** — chưa bật thì duyệt
> bao nhiêu đơn tiền cũng chưa vào lương.

---

## 5. Checklist trước kỳ lương đầu tiên có OT

1. ☐ Mở **Overtime Type "Làm thêm giờ"** — xác nhận component tính đơn giá đúng với
   Salary Structure thực tế (mục 2).
2. ☐ Mỗi **HR Policy** có `default_overtime_type` (patch đã fill, check company mới).
3. ☐ **Payroll Settings → create_overtime_slip** = ✓.
4. ☐ Chạy thử 1 NV: tạo đơn OT → duyệt → check-out muộn → xem Attendance có
   `actual_overtime_duration` → chạy payroll nháp → Salary Slip có dòng
   **"Lương làm thêm giờ"** với số tiền hợp lý.
5. ☐ **Holiday List** đã gán cho Company/Employee — thiếu thì hệ số lễ (×3.0)
   không nhận diện được ngày lễ.

---

## Liên quan
- [HR Overtime Request — luồng dữ liệu chi tiết](HR-Overtime-Request.html)
- End-user: [Xin làm thêm giờ](Guide-NhanVien-LamThem.html) · [Duyệt đơn làm thêm](Duyet-Lam-Them.html)
- [HR Policy](HR-Policy.html) · [Tổng quan Lương & Thưởng](Compensation-Tong-Quan.html)
