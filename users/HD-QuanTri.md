---
title: Quản trị (cấu hình)
layout: default
parent: Chấm công & HR
nav_order: 4
has_children: true
---

# 🛠️ Quản trị — Cấu hình hệ thống chấm công

> Dành cho **HR Manager / System Manager** dựng & cấu hình hệ thống chấm công trên **Desk** (`/app`). Làm theo thứ tự dưới khi onboarding công ty/phòng ban mới. Việc xử lý hằng ngày xem **[👩‍💼 HR (vận hành)](HD-HR.html)**.

## Thứ tự dựng (onboarding mới)

| # | Việc | Hướng dẫn |
|---|---|---|
| 1 | Khai báo văn phòng + bán kính chấm công | **[Vị trí văn phòng (Office Location)](Desk-Admin-Office.html)** |
| 2 | Bật/tắt selfie, WFH, giờ, whitelist… theo công ty | **[Chính sách chấm công (HR Policy)](Desk-Admin-Policy.html)** |
| 3 | Ngày lễ trong năm | **[Ngày lễ (Holiday List)](Desk-Admin-Holiday.html)** |
| 4 | Giờ vào/ra + gán ca cho nhân viên | **[Ca làm việc & gán ca](Desk-Admin-Shift.html)** |
| 5 | Tạo **tài khoản đăng nhập** + gán quyền (role) | **[Tạo User & phân quyền](Desk-Admin-User.html)** |
| 6 | Cơ cấu phòng ban + người duyệt | **[Phòng ban & người duyệt (Department)](Desk-Admin-Department.html)** |

> 👉 Dựng xong khung trên thì **tạo hồ sơ nhân viên** (gắn user/phòng/ca) ở **[👩‍💼 HR (vận hành) → Tạo & quản lý Employee](Desk-Admin-Employee.html)**.

---

> 📐 **Mô hình quan trọng — presence-based:** Cobe **KHÔNG** mã hoá ngày nghỉ tuần vào Holiday List. Holiday List **chỉ chứa ngày lễ**. Ngày đi làm ghi nhận bằng **check-in** (Present/Half); ngày không check-in để **trống = nghỉ**, không bị chấm Vắng. Đây là lý do nhiều bước dưới khác HRMS mặc định — đọc kỹ từng guide.
