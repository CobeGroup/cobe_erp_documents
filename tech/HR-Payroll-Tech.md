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
| `Cobe Payroll Policy` + child `Cobe Payroll Tax Bracket` | `cobe_payroll/doctype/` | **Một bản luật = một `effective_from`** (name `CPP-<ngày>`). Chứa tỷ lệ BH, hệ số trần (mặc định 20× lương cơ sở / 20× lương tối thiểu vùng — nay là **field**, không còn hằng số trong code), ngưỡng ngày công, giảm trừ gia cảnh, mức miễn thuế phụ cấp ăn giữa ca, biểu thuế luỹ tiến. Validate: biểu thuế liền mạch + bắt đầu từ 0, tỷ lệ 0–100%, lương cơ sở/hệ số trần > 0 (chặn "BH = 0 âm thầm"). |
| `Cobe Payroll Settings` (Single) | `cobe_payroll/doctype/` | Chỉ còn **2 công tắc vận hành** (`enable_insurance`, `enable_pit`) + HTML trỏ sang Policy. Các field ngưỡng cũ đã gỡ khỏi JSON (dòng trong `tabSingles` vẫn còn, không ai đọc). |
| `cobe_payroll/policy.py` | resolver | `get_policy(as_on)` → bản luật có `effective_from` lớn nhất mà ≤ **ngày đầu kỳ lương**; không có bản nào ≤ thì rơi về bản **cũ nhất** (không throw giữa lúc chạy lương). Cache danh sách ngày ở `frappe.cache()`, xoá khi Policy đổi. |
| `CobeSalarySlip` | `overrides/salary_slip.py`, đăng ký `override_doctype_class` | Sau `super().calculate_net_pay()`: (1) upsert 3 dòng BHXH/BHYT/BHTN; (2) tính thuế TNCN luỹ tiến **theo tháng** rồi upsert dòng "Thuế TNCN"; gọi lại `set_net_pay()`. Cộng thêm: vá **mẫu số ngày công lẻ** và **phần ăn trưa vượt trần chịu thuế** (xem dưới). |
| Patch `v0_021.seed_payroll_setup` | idempotent | Custom field Employee, rename component `Basic` → `Lương cơ bản` (giữ abbr `B` + link từ Overtime Type), seed component + Salary Structure per-company + settings. |
| Report `Bang Luong Cobe` | `cobe_payroll/report/` | Script Report pivot Salary Detail ra cột kiểu bảng lương VN; component lạ gom vào "Thu nhập khác/Khấu trừ khác". Tên report PHẢI ASCII — Frappe suy module path từ `scrub(tên)` giữ nguyên dấu tiếng Việt → tên có dấu là ModuleNotFoundError (vết xe MAS Cobe cũ). |

## Công thức

```
policy = bản Cobe Payroll Policy hiệu lực tại slip.start_date

BH  = min(mức đóng BH, hệ_số_trần × lương_cơ_sở) × pct
      (mức đóng BH = Employee.custom_insurance_salary || SSA.base; trần = 0 ⇒ coi như không trần)
      chỉ trích khi payment_days ≥ policy.min_days_for_insurance (mặc định 14)
      KHÔNG prorate theo ngày công (component để depends_on_payment_days = 0)
TNTT = Σ earning có is_tax_applicable (đã prorate, bỏ exempted/do_not_include_in_total)
       + max(phụ cấp ăn giữa ca thực nhận − policy.meal_tax_free_cap, 0)
       − BH − giảm trừ bản thân − (số phụ thuộc × giảm trừ phụ thuộc)
Thuế = luỹ tiến từng phần theo bảng bậc (to_amount=0 = vô hạn), làm tròn đồng
```

### Mẫu số ngày công có phần lẻ — `get_amount_based_on_payment_days`

HRMS prorate bằng `flt(payment_days) / cint(total_working_days)` (salary_slip.py:2159).
Ngày công nhóm nửa buổi Thứ 7 có phần lẻ 0,5 → `cint(23,5) = 23`, **mẫu số bị cắt** và
phiếu trả DƯ ngay cả khi đi làm đủ công:

```
tháng 8/2026 (5 CN + 5 T7 nửa buổi) → 23,5 công
lương cơ bản = 30.000.000 × 23,5 / 23 = 30.652.174   (+2,17%)
```

Năm 2026 có **4 tháng** số Thứ 7 lẻ (1, 5, 8, 10). Vá bằng cách nhân đôi cả tử lẫn mẫu
trước khi gọi bản gốc (23,5/23,5 → 47/47), khôi phục giá trị trong `finally` để hiển thị
và report vẫn thấy 23,5. Hai chỗ khác của HRMS cũng `cint(total_working_days)` —
statistical component (1288) và Employee Benefit (1512) — structure của Cobe không dùng
nên chưa đụng.

*Bộ test cũ (`utils/test_salary_halfday.py`) cố ý không dựng Salary Structure nên không
chạm nhánh tiền — đúng chỗ mù đã để lọt lỗi này. `cobe_payroll/test_payroll_policy.py`
kiểm thẳng `get_amount_based_on_payment_days` bằng doc rỗng, không cần fixture.*

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
- `Phụ cấp ăn trưa`/`Phụ cấp điện thoại` có `is_tax_applicable=0`. Riêng ăn giữa ca
  nay có **trần miễn thuế** (`policy.meal_tax_free_cap`, mặc định 730.000): phần vượt
  được cộng thẳng vào thu nhập chịu thuế trong `_meal_allowance_excess()`. So trên số
  **thực nhận đã prorate** với trần THÁNG (không prorate trần). Để trần = 0 là quay lại
  hành vi cũ (miễn toàn bộ). OT vẫn chịu thuế toàn phần — tách phần phụ trội miễn thuế
  là việc tương lai.
- Guard seed settings phải đếm row child trong DB — `get_single` áp default
  value lên Single chưa lưu nên check field sẽ luôn truthy.

## Phân quyền (patch v0_022 → v0_024)

Chốt cuối (v0_024): **chỉ Payroll Officer thấy tiền cá nhân**. System Manager
giữ phần cấu hình (Salary Component/Structure, Cobe Payroll Settings) nhưng bị
gỡ khỏi Salary Slip/SSA/Payroll Entry/Additional Salary/Overtime Slip +
permlevel-2 Employee + report; trong `cobe_payroll/permissions.py` SM cũng KHÔNG
privileged (SM thường kiêm role Employee → nếu privileged là list được phiếu cả
công ty). Admin cần vào → tự gán role Payroll Officer (có Version log). Đây
không phải rào tuyệt đối với SM (SM tự cấp quyền được) — mục tiêu là mặc-định-
không-thấy + có dấu vết.

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

1. Deploy + **bench migrate** (patch v0_021/v0_022/**v0_036** tự seed; chạy lại vô hại).
   v0_036 chuyển ngưỡng từ Single sang `Cobe Payroll Policy` (`CPP-2026-01-01`) và dọn
   bậc thuế treo dưới Single.
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
