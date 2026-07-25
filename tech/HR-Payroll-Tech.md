---
title: HR Payroll VN — Tech
layout: default
parent: Tài liệu kỹ thuật
nav_order: 6.5
---

# Payroll VN (module Cobe Payroll) — kiến trúc & triển khai

App: `hr_for_cobegroup`, module **Cobe Payroll**. Nguyên tắc HRMS-first: toàn bộ
pipeline (Salary Structure/Assignment → Payroll Entry → Salary Slip → GL) là
native; phần custom chỉ đắp 2 thứ HRMS không làm được cho VN.

## Thành phần

| Thành phần | Vị trí | Vai trò |
|---|---|---|
| `Cobe Payroll Settings` (Single) + child `Cobe Payroll Tax Bracket` | `cobe_payroll/doctype/` | Tỷ lệ BH, trần (20× lương cơ sở / 20× lương tối thiểu vùng), ngưỡng 14 ngày công, giảm trừ gia cảnh, biểu thuế luỹ tiến. Validate biểu thuế phải liền mạch. |
| `CobeSalarySlip` | `overrides/salary_slip.py`, đăng ký `override_doctype_class` | Sau `super().calculate_net_pay()`: (1) upsert 3 dòng BHXH/BHYT/BHTN; (2) tính thuế TNCN luỹ tiến **theo tháng** rồi upsert dòng "Thuế TNCN"; gọi lại `set_net_pay()`. |
| Patch `v0_021.seed_payroll_setup` | idempotent | Custom field Employee, rename component `Basic` → `Lương cơ bản` (giữ abbr `B` + link từ Overtime Type), seed component + Salary Structure per-company + settings. |
| Report `Bang Luong Cobe` | `cobe_payroll/report/` | Script Report pivot Salary Detail ra cột kiểu bảng lương VN; component lạ gom vào "Thu nhập khác/Khấu trừ khác". Tên report PHẢI ASCII — Frappe suy module path từ `scrub(tên)` giữ nguyên dấu tiếng Việt → tên có dấu là ModuleNotFoundError (vết xe MAS Cobe cũ). |

## Công thức

```
BH  = min(mức đóng BH, trần) × pct   (mức đóng BH = Employee.custom_insurance_salary || SSA.base)
      chỉ trích khi payment_days ≥ min_days_for_insurance (mặc định 14)
TNTT = Σ earning có is_tax_applicable (đã prorate, bỏ exempted/do_not_include_in_total)
       − BH − giảm trừ bản thân − (số phụ thuộc × giảm trừ phụ thuộc)
Thuế = luỹ tiến từng phần theo bảng bậc (to_amount=0 = vô hạn), làm tròn đồng
```

Không dùng tax engine native (`variable_based_on_taxable_salary`, Income Tax
Slab, Payroll Period) — engine đó quy năm kiểu India, lệch với cách kế toán VN
tính theo tháng. `compute_income_tax_breakup()` native tự no-op vì không có
Payroll Period.

## Điểm thiết kế đáng nhớ

- Các component BH/thuế/phụ cấp bật `remove_if_zero_valued` → dòng 0 đ không
  xuất hiện trên slip; structure vẫn khai dòng BH amount=0 để HR nhìn thấy ý đồ.
- Phụ cấp per-employee đi qua **custom field Employee** + formula trong
  structure (`custom_pc_an_trua`…) — được vì `get_data_for_eval()` merge cả
  Employee doc vào context formula.
- `Phụ cấp ăn trưa`/`Phụ cấp điện thoại` có `is_tax_applicable=0` (miễn thuế
  trong hạn mức); OT hiện chịu thuế toàn phần — tách phần phụ trội miễn thuế là
  việc tương lai.
- Guard seed settings phải đếm row child trong DB — `get_single` áp default
  value lên Single chưa lưu nên check field sẽ luôn truthy.

## Phân quyền (patch v0_022)

- Role **Payroll Officer** (tạo bởi patch): full trên 7 doctype lương (Salary
  Slip/Structure/Assignment, Payroll Entry, Additional Salary, Salary Component,
  Overtime Slip) — các role HR Manager/HR User/Leave Approver bị GỠ khỏi đó
  (sửa bằng Custom DocPerm qua patch, không fixtures — fixtures reset mỗi migrate).
- 9 custom field lương trên Employee ở **permlevel 2**; chỉ Payroll Officer +
  System Manager có quyền level 2 → HR/Sales mở Employee không thấy ô tiền.
- NV chỉ thấy Salary Slip / Overtime Slip của mình: site không dùng User
  Permission Employee=self (bị xoá ở v0_016 vì phá workflow) nên chặn bằng
  `permission_query_conditions` + `has_permission` hook (`cobe_payroll/permissions.py`).

## Triển khai prod (Frappe Cloud)

1. Deploy + **bench migrate** (patch v0_021 + v0_022 tự seed; chạy lại vô hại).
2. **bench clear-cache** — `override_doctype_class` chỉ nạp sau clear-cache.
3. Gán role **Payroll Officer** cho user kế toán phụ trách lương (qua form User).
4. Điền custom field lương/BH/phụ cấp cho nhân viên + tạo Salary Structure
   Assignment (có thể import bằng Data Import).
5. Payroll Settings native đang `payroll_based_on = Leave` — giữ nguyên tới khi
   chấm công auto phủ đủ; muốn theo chấm công thật thì đổi sang Attendance.
6. Muốn hạch toán GL: khai account cho từng Salary Component + payable account
   ở Payroll Entry (không bắt buộc để tính lương).

Test local: `scratchpad/test_payroll.py` (đã verify 23/07/2026: gross 22,53tr,
BH 1,05tr, thuế 247,5k, net 21,2325tr — khớp tính tay từng đồng).
