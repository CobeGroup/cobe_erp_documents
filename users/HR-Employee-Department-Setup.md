---
title: Employee & Department (Approver) — Setup
layout: default
parent: Tài liệu kỹ thuật
nav_order: 2
---

# Employee & Department (Approver) — Nguyên tắc & Setup

> Đối tượng: **HR Manager**, **System Manager**. Tài liệu nền tảng về cách dựng
> **hồ sơ nhân viên** và **cơ cấu phòng ban** để chấm công + duyệt nghỉ phép +
> forward chạy đúng. Đọc trước [HR Leave Setup](HR-Leave-Setup.html) và
> [Holiday & Shift Setup](HR-Holiday-Shift-Setup.html).

## Mục lục
1. [Nguyên tắc Employee — 1 người 1 Employee chính](#1-nguyên-tắc-employee)
2. [Department — cơ cấu tổ chức](#2-department)
3. [Approver quản theo Department](#3-approver-quản-theo-department)
4. [Role cần gán](#4-role-cần-gán)
5. [Checklist setup](#5-checklist-setup)

---

## 1. Nguyên tắc Employee

### Mỗi người = 1 Employee chính + 1 user chính (để tính công)

- **1 Employee thuộc đúng 1 Company** (field `company` đơn).
- **1 User (login) chỉ gắn 1 Employee Active.** ERPNext chặn cứng
  (`validate_duplicate_user_id`): tạo Employee Active thứ 2 cùng `user_id` →
  lỗi *"User X is already assigned to Employee Y"* (check **không phân biệt
  công ty**).
- Hệ thống chấm công my-workspace keyed theo **login + 1 thiết bị Active/người**
  → chấm công, nghỉ phép, ca, thiết bị **luôn quy về 1 Employee chính**.

> ⚠️ **KHÔNG** dùng chung 1 user cho 2 Employee (kể cả khác công ty). Để tính
> công/lương chuẩn: **mỗi người 1 Employee chính + 1 user chính**.

### Người làm cho 2–3 công ty

| Tình huống | Cách làm |
|---|---|
| Chấm công / nghỉ / login | **1 Employee chính** (có `user_id`) ở **công ty trả lương chính** |
| Cần Employee ở công ty khác (payroll/hồ sơ) | Employee phụ **để TRỐNG `user_id`** → không login/chấm công PWA, chỉ phục vụ lương công ty đó |
| Đóng góp công sức nhiều công ty | Xử ở **Cost Center / phân bổ lương**, KHÔNG nhân đôi chấm công |

### Field bắt buộc trên Employee chính
- `company`, `department` (theo bộ chuẩn §2), `branch` (chi nhánh/tỉnh),
  `user_id` (email login), `status = Active`.
- `default_shift` + `holiday_list` (xem Holiday & Shift Setup).
- `leave_approver`: **không bắt buộc nếu Department đã có** (xem §3).

---

## 2. Department

`Department` là **cơ cấu tổ chức**, dùng cho: **approver duyệt phép**, **forward
cấp Manager** (lọc cùng phòng), **báo cáo**, **gán Shift hàng loạt** (chỉ là bộ
lọc tiện — Shift bản chất theo giờ, không theo phòng).

### Bộ Department chuẩn (đồng bộ 3 công ty)
Mỗi công ty 1 bộ phòng, **đặt tên có hậu tố mã công ty** (vd `- TGĐG`, `- AKW`,
`- DR`) cho nhất quán. Ví dụ TGĐG:

`Sales - TGĐG` · `Marketing - TGĐG` · `Human Resources - TGĐG` ·
`Customer Service - TGĐG` · `Accounts - TGĐG` · `Dispatch - TGĐG` ·
`Legal - TGĐG` · `Management - TGĐG` · `Operations - TGĐG` ·
`Production - TGĐG` · `Purchase - TGĐG` · `Quality Management - TGĐG` ·
`Research & Development - TGĐG` · `Dịch vụ - Bảo hành - TGĐG`

> **Dọn trùng:** tránh tồn tại song song bản không hậu tố (vd `Sales`) lẫn bản
> `Sales - TGĐG`. Gộp về 1 bộ (hậu tố) — chuyển NV sang bản giữ rồi xoá bản trùng
> (Frappe `rename`/move tự cập nhật link NV).

---

## 3. Approver quản theo Department

Cobe lấy người duyệt bước 1 (Manager) theo **chuỗi ưu tiên**:

```
1. Employee.leave_approver        (override cá nhân, nếu set)
2. Department.leave_approvers      (approver mặc định của phòng — dòng đầu)
3. cả 2 trống                      → báo lỗi "Chưa có Manager duyệt phép"
```

→ **Khuyến nghị: set `Leave Approvers` ở từng Department**, NV trong phòng tự
thừa hưởng — khỏi gán 124 NV từng người. Chỉ set `Employee.leave_approver` cho
**ngoại lệ**.

### Cách set
1. Desk → **Department** → mở phòng.
2. Mục **Leave Approvers** → thêm user **Trưởng Bộ Phận** (TBP) của phòng → **Save**.
3. (Tương tự có `Expense Approvers`, `Shift Request Approver` nếu cần.)

> Người được chọn làm approver **phải có role `Leave Approver`** + **đúng
> Department** thì mới: duyệt được + xuất hiện trong danh sách **Forward** cấp
> Manager. (Xem [HR Leave Setup → Chuyển duyệt](HR-Leave-Setup.html).)

### Bước HR (bước 2)
Duyệt cuối là **role `HR Manager`** (không phải approver phòng). Forward cấp HR
lọc theo `HR Manager` **cùng công ty**.

---

## 4. Role cần gán

| Loại người | Roles | Ghi chú |
|---|---|---|
| NV thường | `Employee` + `Employee Self Service` | Chấm công, xin nghỉ, xem của mình |
| Trưởng Bộ Phận (TBP) | + `Leave Approver` | Duyệt bước 1 + candidate Forward cấp Manager |
| HR nghiệp vụ | `HR User` | Nhập liệu, không duyệt cuối |
| HR trưởng | `HR Manager` | Duyệt bước 2 + cấu hình + Forward cấp HR |
| IT/Admin | `System Manager` | Cấu hình hệ thống |

**3 ràng buộc bắt buộc:**
1. Mỗi NV xác định được approver (qua Department hoặc Employee).
2. Mỗi TBP có role `Leave Approver` + đúng `Department`.
3. Mỗi công ty có ≥1 `HR Manager`.

> Role là **chuẩn có sẵn** (không tạo mới). Gán Employee/ESS + Leave Approver
> có thể seed tự động (script `seed_roles`); HR Manager / HR User / System Manager
> gán tay đúng người.

---

## 5. Checklist setup

1. **Dọn Department trùng** → bộ chuẩn (§2).
2. **Hồ sơ Employee**: mỗi người 1 Employee chính + user chính; điền `company`,
   `department`, `branch`, `default_shift`, `holiday_list` (§1).
3. **Set `Leave Approvers` cho từng Department** (§3) — chỗ config approver duy nhất.
4. **Gán role**: chạy `seed_roles` (Employee/ESS + Leave Approver) + gán HR/Admin tay (§4).
5. **Shift Assignment** theo nhóm (xem Holiday & Shift Setup).
6. **Test**: 1 NV chấm công + 1 đơn nghỉ chạy hết Manager → HR + thử Forward.

---

## Liên quan
- [HR Leave Setup](HR-Leave-Setup.html) — workflow 2 bước + Forward
- [Holiday & Shift Setup](HR-Holiday-Shift-Setup.html) — ca + holiday (presence-based)
- [HR Office Location](HR-Office-Location.html) — văn phòng chấm công GPS
- [Tổng quan Chấm công](Cham-Cong-Tong-Quan.html)
