---
title: HR KPI Score
layout: default
parent: Lương & Thưởng
nav_order: 6
---

# HR KPI Score — Chấm điểm và thưởng KPI

> Submittable, amendable. Mỗi (employee, kpi_period) = 1 record duy nhất.
>
> Manager chấm điểm → hệ thống auto-suggest % thưởng → cộng vào Salary Slip kỳ chứa `payout_date`.

---

## Mục lục

1. [Khi nào dùng](#1-khi-nào-dùng)
2. [Cách mở](#2-cách-mở)
3. [Các field](#3-các-field)
4. [Bảng auto-suggest bonus_pct](#4-bảng-auto-suggest-bonus_pct)
5. [Logic tính bonus_amount](#5-logic-tính-bonus_amount)
6. [Quy trình chấm điểm](#6-quy-trình-chấm-điểm)
7. [Link tới Salary Slip](#7-link-tới-salary-slip)
8. [Sửa / Cancel sau khi đã trả](#8-sửa--cancel-sau-khi-đã-trả)

---

## 1. Khi nào dùng

Mỗi cuối kỳ (tháng / quý / năm theo [HR KPI Period](HR-KPI-Period.html)), manager chấm điểm cho từng nhân viên thuộc team.

Mỗi (employee, period) = 1 score duy nhất — không thể chấm 2 lần.

Score 0-100 → hệ thống tự suggest % bonus → tạo `bonus_amount` → đến `payout_date` thì cộng vào Salary Slip.

---

## 2. Cách mở

- Desk → search "HR KPI Score" → New
- URL: `/app/hr-kpi-score/new?employee=<emp>&kpi_period=<period>`

Bulk: dùng Data Import nếu chấm nhiều người 1 lúc.

---

## 3. Các field

### `name` (Auto)

Series `KPI-SCORE-YYYY-000001`,...

### `employee` (Link → Employee, **bắt buộc**)

Nhân viên được chấm.

### `employee_name` (Data, auto-fill)

Read-only.

### `kpi_period` (Link → HR KPI Period, **bắt buộc**)

Kỳ chấm. Filter chỉ hiện Period có `status=Open` và cùng Company với Employee.

### `period_type` (Data, auto-copy từ Period)

Read-only.

### `score` (Float, 0-100, **bắt buộc**)

Điểm đánh giá. Validate: 0 ≤ score ≤ 100, throw nếu out-of-range.

### `bonus_pct` (Float, 0-100, auto-suggest)

% bonus trên `base_amount`. Hệ thống suggest theo curve (xem mục 4), **chỉ khi field này blank**. Manager override được nếu muốn cho thưởng khác chuẩn.

### `base_amount` (Currency, auto-fill, **bắt buộc**)

Mức lương cơ bản dùng làm gốc tính thưởng:
- Lookup từ Salary Structure Assignment active của Employee → field `base`
- Fallback `CTC / 12` nếu không có

Auto-fill khi chọn Employee. Manager có thể override nếu muốn dùng base khác (vd lương cơ bản đầu năm cho bonus cuối năm).

### `bonus_amount` (Currency, auto-compute)

`base_amount × bonus_pct / 100`. Chỉ tự fill khi blank → cho phép manager override.

### `payout_date` (Date, **bắt buộc**)

Ngày trả bonus. Đây là field quyết định bonus thuộc Salary Slip nào:
- Hệ thống match `payout_date ∈ [slip.start_date, slip.end_date]`
- VD: payout_date = 2026-06-30 → cộng vào slip tháng 6

Thường set cuối Period hoặc 1 vài tháng sau (delayed payout).

### `paid_in_salary_slip` (Link → Salary Slip, auto-fill)

Read-only. Khi Salary Slip submit, hook tự mark score này đã được trả ở slip nào. Tránh trả 2 lần.

### `notes` (Text)

Lý do, comment, đánh giá định tính.

### `docstatus` (built-in)

| Value | Ý nghĩa |
|---|---|
| 0 | Draft — chấm tạm |
| 1 | Submitted — chốt điểm, sẵn sàng trả |
| 2 | Cancelled — hủy điểm |

Chỉ score docstatus=1 mới được gộp vào Salary Slip.

---

## 4. Bảng auto-suggest bonus_pct

Hệ thống suggest theo `SCORE_CURVE`:

| score | bonus_pct |
|---|---|
| ≥ 95 | 20% |
| ≥ 85 | 15% |
| ≥ 70 | 10% |
| ≥ 50 | 5% |
| < 50 | 0% |

VD:
- score=90 → suggest 15%
- score=72 → suggest 10%
- score=49 → suggest 0% (không thưởng)

**Quan trọng**: chỉ auto-fill khi `bonus_pct` blank. Manager nhập sẵn pct rồi thì hệ thống giữ nguyên.

Đổi curve: phải sửa code (hard-coded). Liên hệ dev nếu cần đổi.

---

## 5. Logic tính bonus_amount

```python
if not bonus_amount:
    bonus_amount = base_amount * bonus_pct / 100
```

Chỉ tính khi blank → manager nhập amount cứng cũng được.

VD:
- base_amount = 20tr, bonus_pct = 10% → bonus_amount = 2tr
- Manager muốn cho 3tr → nhập trực tiếp bonus_amount=3tr → hệ thống giữ nguyên

---

## 6. Quy trình chấm điểm

### Bước 1: Manager mở danh sách team

Desk → HR KPI Score → List → filter:
- `kpi_period` = period đang chấm
- `employee.department` = team của mình

→ Thấy danh sách rỗng nếu chưa chấm ai.

### Bước 2: Tạo Score cho từng employee

Click **New**:
1. Chọn Employee + Period
2. Score 0-100
3. Auto-fill base_amount, bonus_pct, bonus_amount
4. Override bonus_pct hoặc bonus_amount nếu muốn
5. Set payout_date (thường cuối kỳ hoặc cuối tháng tới)
6. Notes (optional)
7. Save → Draft

### Bước 3: Submit khi chắc chắn

Click **Submit** → docstatus=1 → sẵn sàng trả bonus.

### Bulk import

Để chấm hàng loạt (vd 50 nhân viên 1 lúc):
1. Tools → Data Import
2. Doctype = HR KPI Score
3. Download template → fill spreadsheet:
   - Mỗi row: employee, kpi_period, score, payout_date, notes
4. Upload → review → Submit

Hệ thống tự auto-fill base_amount + bonus_pct + bonus_amount cho mỗi row.

---

## 7. Link tới Salary Slip

### Khi Salary Slip validate

Hook `apply_kpi_bonus` chạy:
1. Query KPI Score: `employee=slip.employee`, `docstatus=1`, `payout_date ∈ [start_date, end_date]`
2. Filter: `paid_in_salary_slip is null` OR `paid_in_salary_slip = slip.name` (cho re-validate)
3. Sum `bonus_amount` → thêm Earning row `KPI Bonus`
4. Snapshot:
   - `slip.custom_kpi_score` = max(score) trong các score gộp
   - `slip.custom_kpi_bonus` = total bonus_amount

### Khi Salary Slip submit

Hook `link_kpi_scores_to_slip`:
- Cho mỗi score eligible → set `paid_in_salary_slip = slip.name`
- Score không còn nằm trong "pool unpaid"

### Khi Salary Slip cancel

Hook `unlink_kpi_scores_from_slip`:
- Cho mỗi score đã link → set `paid_in_salary_slip = None`
- Score quay lại pool, có thể trả ở slip khác

### Sequence

```
KPI Score (docstatus=1)
  payout_date = 2026-06-30
  paid_in_salary_slip = None
       │
       ▼ (Process Payroll tháng 6)
Salary Slip June (docstatus=0)
  validate → cộng KPI Bonus
  submit → mark KPI Score.paid_in_salary_slip = SAL-202606-0042
       │
       ▼
KPI Score 
  paid_in_salary_slip = SAL-202606-0042   ← đã được trả
```

---

## 8. Sửa / Cancel sau khi đã trả

### Sửa score sau khi đã link Salary Slip

Không sửa trực tiếp được (docstatus=1). Cần:
1. Cancel KPI Score (docstatus=2)
2. Hook `on_cancel` chưa có cho KPI Score — Salary Slip cũ giữ nguyên bonus (sai chuẩn)
3. **Workaround**: cancel Salary Slip → cancel KPI Score → amend KPI Score → submit lại → recreate Salary Slip

### Cancel KPI Score đã trả

1. Cancel Salary Slip kỳ tương ứng trước
2. Hook unlink chạy → KPI Score giải phóng
3. Cancel KPI Score

### Amend (sửa với amendment chain)

Click **Amend** trên record docstatus=1 → tạo bản mới Draft với `amended_from` link tới bản cũ. Sửa rồi Submit.

Lưu ý: bản cũ đã link Salary Slip nào thì giữ nguyên link. Bản mới khi submit sẽ tham gia cycle Salary Slip kế tiếp.

---

## Liên quan

- [HR KPI Period](HR-KPI-Period.html) — định nghĩa kỳ
- [HR Compensation — Tổng quan](Compensation-Tong-Quan.html)
- [HR Compensation — Architecture (tech)](../tech/HR-Compensation-Architecture.html)
