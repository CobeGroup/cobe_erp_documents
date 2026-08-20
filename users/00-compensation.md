---
title: Lương & Thưởng
layout: default
nav_order: 6
has_children: true
---

# Lương & Thưởng (Compensation)

Module mở rộng HRMS để tự động hóa **tính lương và các thành phần lương**:

0. **Tính lương tháng (Payroll VN)** ✅ *đã chạy* — Salary Structure/Payroll Entry native + tự trích **BHXH/BHYT/BHTN** và **thuế TNCN luỹ tiến theo tháng** (module Cobe Payroll). Xem [Tính lương tháng](Payroll-Tinh-Luong-Thang.html) — hoặc đi theo một phiếu cụ thể từ đầu đến cuối: [Hành trình một phiếu lương](Hanh-Trinh-Phieu-Luong.html).
1. **Overtime (OT)** ✅ *đã chạy* — NV xin làm thêm **trước** khi làm (PWA) → manager duyệt → đối chiếu chấm công → **Overtime Slip** → `Additional Salary` gộp vào Salary Slip kỳ tới. Quy đổi được **tiền** hoặc **nghỉ bù**.
2. **WFH Salary Adjustment** ⏳ *thiết kế, chưa triển khai* — Đếm ngày WFH (qua chấm công PWA) → trừ % lương Basic/phụ cấp theo cấu hình.
3. **KPI Bonus** ⏳ *thiết kế, chưa triển khai* — Manager chấm điểm 0-100 mỗi kỳ → hệ thống auto suggest % thưởng → tự cộng vào Salary Slip.

Tất cả module này hoạt động trên doctype Salary Slip chuẩn của HRMS — không cần thay payroll workflow.

---

## Mô hình tổng quan

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ HR Overtime      │    │  WFH Approval    │    │  KPI Score       │
│ Request (PWA)    │    │  (phase 1)       │    │  (chưa có)       │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │ duyệt + đối chiếu    │ chấm công              │ payout_date
         │ chấm công             ↓                        ↓
         ↓              ┌──────────────────┐    ┌──────────────────┐
┌─────────────────┐    │ Employee Checkin │    │ paid_in_         │
│ Overtime Slip → │    │ source='WFH-PWA' │    │ salary_slip      │
│ Additional Sal. │    └────────┬─────────┘    └────────┬─────────┘
└────────┬────────┘             │ count ngày             │ sum bonus
         │ payroll gộp          ↓                        ↓
         ╔════════════════════════════════════════════════╗
         ║              SALARY SLIP (HRMS)                ║
         ║  + Overtime (Earning)                          ║
         ║  − WFH Deduction (Deduction)                   ║
         ║  + KPI Bonus (Earning)                         ║
         ╚════════════════════════════════════════════════╝
```

---

## Trang trong nhóm này

- **Tổng quan & Setup** — bắt đầu từ đây
- **Cấu hình Overtime** — Overtime Type, HR Policy, Payroll Settings
- **HR Overtime Request** — luồng dữ liệu đơn làm thêm (góc nhìn HR)
- 📱 End-user: [Xin làm thêm giờ](Guide-NhanVien-LamThem.html) · [Duyệt đơn làm thêm](Duyet-Lam-Them.html)
- **HR WFH Salary Settings** — cấu hình trừ lương ngày WFH
- **HR KPI Period** — định nghĩa kỳ chấm điểm
- **HR KPI Score** — chấm điểm và thưởng

## Tài liệu kỹ thuật

Developer / 3rd party xem [HR Compensation — Architecture](../tech/HR-Compensation-Architecture.html).
