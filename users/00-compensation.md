---
title: Lương & Thưởng
layout: default
nav_order: 6
has_children: true
---

# Lương & Thưởng (Compensation)

Module mở rộng HRMS để tự động hóa **3 thành phần lương**:

1. **Overtime (OT)** — Nhân viên xin tăng ca → manager duyệt → tự tạo `Additional Salary` → gộp vào Salary Slip kỳ tới.
2. **WFH Salary Adjustment** — Đếm ngày WFH (qua chấm công PWA) → trừ % lương Basic/phụ cấp theo cấu hình.
3. **KPI Bonus** — Manager chấm điểm 0-100 mỗi kỳ → hệ thống auto suggest % thưởng → tự cộng vào Salary Slip.

Tất cả module này hoạt động trên doctype Salary Slip chuẩn của HRMS — không cần thay payroll workflow.

---

## Mô hình tổng quan

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  OT Request      │    │  WFH Approval    │    │  KPI Score       │
│  (nhân viên xin) │    │  (phase 1)       │    │  (manager chấm)  │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │ approve              │ chấm công              │ payout_date
         ↓                       ↓                        ↓
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Additional      │    │ Employee Checkin │    │ paid_in_         │
│ Salary          │    │ source='WFH-PWA' │    │ salary_slip      │
└────────┬────────┘    └────────┬─────────┘    └────────┬─────────┘
         │ payroll gộp          │ count ngày             │ sum bonus
         ↓                       ↓                        ↓
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
- **HR Overtime Settings** — cấu hình tăng ca toàn hệ thống
- **HR Overtime Request** — quy trình xin và duyệt OT
- **HR WFH Salary Settings** — cấu hình trừ lương ngày WFH
- **HR KPI Period** — định nghĩa kỳ chấm điểm
- **HR KPI Score** — chấm điểm và thưởng

## Tài liệu kỹ thuật

Developer / 3rd party xem [HR Compensation — Architecture](../tech/HR-Compensation-Architecture.html).
