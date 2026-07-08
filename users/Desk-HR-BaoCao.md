---
title: "Báo cáo (HR)"
layout: default
parent: HR (vận hành)
grand_parent: Chấm công & HR
nav_order: 6
---

# Báo cáo (HR)
{: .no_toc }

**Dành cho:** HR Manager · **Nơi xem:** Desk → workspace **Shift & Attendance / People** → mục **Reports**
{: .fs-3 .text-grey-dk-000 }

> Các báo cáo dùng **HRMS chuẩn** (app `hr_for_cobegroup` **không** thêm report riêng). Mở nhanh bằng cách gõ **tên báo cáo** vào ô **Search** (Ctrl/⌘ + K), hoặc vào menu **Reports** trong workspace HR.

---

## Chấm công

| Báo cáo | Cho biết |
|---|---|
| **[Monthly Attendance Sheet](Desk-HR-BangCongThang.html)** | Bảng công **cả tháng** từng nhân viên: mỗi ngày là **P** (Present) / **A** (Absent) / **HD** (Half Day) / **L** (On Leave) / **WFH** / **H** (Holiday) / **WO** (Weekly Off). Lọc theo tháng/năm/company/nhân viên. → **[Hướng dẫn chi tiết](Desk-HR-BangCongThang.html)** |
| **Shift Attendance** | Chấm công **theo ca** (giờ vào/ra thực tế vs ca), phát hiện đi trễ/về sớm. |
| **Employees working on a holiday** | Ai **đi làm vào ngày lễ** (để tính bù/OT). |

![Monthly Attendance Sheet — bảng công tháng theo ngày](images/desk/hr-report-attendance.png)

> ⚙️ **Monthly Attendance Sheet là "prepared report"** (chạy nền cho nhẹ): bấm **Generate New Report** rồi **chờ vài giây** kết quả hiện ra. Đổi filter thì generate lại.
>
> 📘 **Giải thích đầy đủ từng mã (P/A/HD/L/WFH…), cách chấm công bù & nghỉ bù hiện trên bảng, và đặc thù presence-based:** xem [Bảng công tháng — hướng dẫn chi tiết](Desk-HR-BangCongThang.html).

## Nghỉ phép

| Báo cáo | Cho biết |
|---|---|
| **Employee Leave Balance** | **Số dư phép** từng nhân viên theo từng loại phép (tới một ngày chọn). |
| **Employee Leave Balance Summary** | **Tổng hợp** số dư phép toàn phòng/công ty (1 dòng/nhân viên). |
| **Leave Ledger** | **Sổ cái phép**: từng giao dịch cấp (+) / trừ (−) phép, truy vết số dư. |

> 📘 **Hướng dẫn chi tiết cách dùng 3 báo cáo này** (kiểm số dư 1 NV, ai đang nghỉ hôm nay, truy vết
> số dư sai): xem **[Kiểm tra phép & báo cáo phép](Desk-HR-KiemTraPhep.html)**.

## Nhân sự

| Báo cáo | Cho biết |
|---|---|
| **Employee Information** | Danh sách thông tin nhân viên (lọc/chọn cột tuỳ ý — Report Builder). |
| **Employee Analytics** | Phân tích số lượng nhân sự theo **phòng / chức danh / giới / loại NV**. |
| **Employee Birthday** | Danh sách **sinh nhật** nhân viên theo tháng. |
| **Employee Exits** | Nhân viên **nghỉ việc** + thông tin exit interview. |

## Chi phí / Tạm ứng

| Báo cáo | Cho biết |
|---|---|
| **Employee Advance Summary** | Tổng hợp **tạm ứng** từng nhân viên (đã ứng / đã quyết toán / còn lại). |
| **Unpaid Expense Claim** | Các **claim chi phí chưa thanh toán**. |

> 💰 Báo cáo **lương** (Salary Register, Salary Slip…) nằm ở mục **Lương & Thưởng**, không thuộc nhóm này.

---

## Cách dùng chung

1. Mở báo cáo (Search tên, hoặc menu **Reports**).
2. Đặt **filter** ở thanh trên (tháng/năm, company, phòng, nhân viên…).
3. Báo cáo nặng → bấm **Generate New Report** rồi chờ.
4. **Xuất**: nút **⋮ (Menu)** → **Export** (Excel/CSV) để gửi/đối chiếu.

## Liên quan
- [Theo dõi & sửa chấm công](Desk-HR-ChamCong.html) · [Cấp phép & gán người duyệt](Desk-HR-CapPhep.html)
