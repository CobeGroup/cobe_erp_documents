---
title: HR KPI Score (Điểm KPI nhân viên)
layout: default
parent: Chấm công & HR
nav_order: 13
---

# HR KPI Score — Điểm KPI nhân viên

> Submittable doctype: per employee per [HR KPI Period](HR-KPI-Period.html).
>
> Sau submit, hệ thống đảm bảo Salary Slip có `payout_date` của Score nằm trong period sẽ auto include khoản KPI Bonus vào Earnings.

---

## Mục lục

1. [Workflow tổng](#1-workflow-tổng)
2. [Các field](#2-các-field)
3. [Score Curve (auto bonus_pct)](#3-score-curve-auto-bonus_pct)
4. [Tạo Score cho 1 nhân viên](#4-tạo-score-cho-1-nhân-viên)
5. [Bulk import](#5-bulk-import)
6. [Liên kết với Salary Slip](#6-liên-kết-với-salary-slip)
7. [Cancel / điều chỉnh sau submit](#7-cancel--điều-chỉnh-sau-submit)
8. [Sự cố thường gặp](#8-sự-cố-thường-gặp)

---

## 1. Workflow tổng

```
1. HR Manager tạo HR KPI Period (Monthly/Quarterly/Yearly) → Submit
2. Manager mỗi phòng ban tạo HR KPI Score cho từng nhân viên
   - Nhập score 0–100
   - Hệ thống suggest bonus_pct + bonus_amount theo curve
   - Manager override nếu cần
   - Set payout_date
   - Submit
3. Khi tới tháng có Salary Slip chứa payout_date → KPI Bonus tự include
4. Sau Salary Slip submit, HR KPI Score link tới Slip qua field paid_in_salary_slip
```

---

## 2. Các field

### `name` (auto)

Format `KPIS-{YYYY}-{######}`. Vd: `KPIS-2026-000123`.

### `employee` (Link → Employee, bắt buộc, search_index)

Nhân viên được đánh giá.

### `kpi_period` (Link → HR KPI Period, bắt buộc)

Period đánh giá. Phải có docstatus=1 + status=Open để tạo Score mới.

### `period_type` (Data, read-only, fetch_from)

Auto fill từ `kpi_period.period_type` (Monthly / Quarterly / Yearly).

### `score` (Float, bắt buộc)

Điểm 0–100. Validation: phải nằm trong range, ngoài range throw error.

### `bonus_pct` (Float, %)

Phần trăm thưởng so với `base_amount`. Auto suggest theo [Score Curve](#3-score-curve-auto-bonus_pct). Manager có thể override.

### `base_amount` (Currency, read-only, auto)

Lấy từ:
1. Salary Structure Assignment.base (docstatus=1, mới nhất) của Employee
2. Fallback: Employee.ctc / 12

### `bonus_amount` (Currency, bắt buộc)

= `base_amount × bonus_pct / 100` (auto). Manager có thể override (vd thay vì 10% suggest, set thẳng 2,000,000 VNĐ).

### `payout_date` (Date, bắt buộc)

Ngày trả thưởng. **Quan trọng**: Salary Slip kỳ chứa ngày này sẽ tự include khoản KPI Bonus.

Ví dụ:
- Quarterly Q1/2026 (Jan–Mar), payout_date=2026-04-15 → Salary Slip tháng 4 nhận khoản này
- Monthly tháng 6/2026, payout_date=2026-06-30 → Salary Slip tháng 6 nhận

### `paid_in_salary_slip` (Link → Salary Slip, read-only, auto)

Auto fill sau khi Salary Slip submit. Đảm bảo **không double-count** (1 Score chỉ pay 1 lần).

### `notes` (Small Text)

Comment của manager về performance.

---

## 3. Score Curve (auto bonus_pct)

Khi `bonus_pct` để trống, hệ thống auto suggest theo curve:

| Score range | bonus_pct gợi ý |
|---|---|
| 0 ≤ score < 50 | 0% (không thưởng) |
| 50 ≤ score < 70 | 5% |
| 70 ≤ score < 85 | 10% |
| 85 ≤ score < 95 | 15% |
| ≥ 95 | 20% |

→ Manager có thể override (set bonus_pct = 8% thay vì 10% suggest).

→ Nếu set `bonus_pct = 0` rõ ràng → server hiểu manager intend = 0, **không** override lại curve.

### Vì sao curve này?

Cobe policy: thưởng theo bands rộng để khuyến khích đạt mốc tiếp theo. Score 71 ≠ 84 vẫn cùng 10% — nhân viên có động lực phấn đấu lên 85+.

→ Sửa curve trong code: [`SCORE_CURVE` ở hr_kpi_score.py](https://github.com/CobeGroup/hr_for_cobegroup/blob/main/hr_for_cobegroup/compensation/doctype/hr_kpi_score/hr_kpi_score.py#L8).

---

## 4. Tạo Score cho 1 nhân viên

### Bước 1 — Mở form

Desk → search **HR KPI Score** → **New**.

### Bước 2 — Fill

1. `employee = "HR-EMP-00001"` → auto fill name + base_amount
2. `kpi_period = "KPI-2026-06"` (đã tạo trước qua HR KPI Period)
3. `score = 85` → suggest bonus_pct=15
4. `bonus_amount` tự compute: base × 0.15
5. Override nếu cần (vd score 85 nhưng team có policy thưởng tối đa 2M, set bonus_amount = 2,000,000)
6. `payout_date = 2026-06-30`
7. `notes`: "Hoàn thành đúng deadline, KPI rất tốt"

### Bước 3 — Submit

Bấm Submit → docstatus=1.

→ Từ giờ Salary Slip kỳ chứa payout_date sẽ tự include khoản này.

### Verify Score đã tạo

Tab Employee form → tab "Connections" → có link tới HR KPI Score (qua employee field).

---

## 5. Bulk import

Khi end-of-quarter cần tạo Score cho 50+ nhân viên:

### Cách 1 — Data Import Tool

1. Desk → Data Import → New
2. Reference DocType: `HR KPI Score`
3. Action: Insert New Records
4. Download template CSV → có columns: `employee`, `kpi_period`, `score`, `bonus_amount`, `payout_date`, `notes`
5. Fill CSV trong Excel
6. Upload → Start Import → Submit (Frappe tự submit nếu set Submit After Import)

### Cách 2 — Custom Bulk Script (advance)

```python
import frappe

for emp, score, bonus, payout in data:
    doc = frappe.get_doc({
        "doctype": "HR KPI Score",
        "employee": emp,
        "kpi_period": "KPI-2026-Q2",
        "score": score,
        "bonus_amount": bonus,
        "payout_date": payout,
    })
    doc.insert()
    doc.submit()
frappe.db.commit()
```

Chạy qua `bench --site cobe.cc execute path.to.script`.

---

## 6. Liên kết với Salary Slip

Hook `apply_kpi_bonus` (trong `compensation/salary_slip_hooks.py`):

### Trên validate Salary Slip

1. Query HR KPI Score WHERE:
   - `employee = doc.employee`
   - `payout_date` ∈ [doc.start_date, doc.end_date]
   - `docstatus = 1`
   - `paid_in_salary_slip` IS NULL **OR** `paid_in_salary_slip = doc.name`
2. Sum `bonus_amount` của tất cả Score eligible
3. Add 1 Earning row với component `KPI Bonus`, amount = sum
4. Set field `custom_kpi_bonus` = sum, `custom_kpi_score` = max(score) của các Score đã sum

### Trên on_submit Salary Slip

Hook `link_kpi_scores_to_slip`:
- Update `paid_in_salary_slip = doc.name` cho mỗi HR KPI Score đã eligible
- Đảm bảo nếu Slip này được re-validate hoặc tháng sau tạo Slip mới → Score đã link không bị pay lại

### Trên on_cancel Salary Slip

Hook `unlink_kpi_scores_from_slip`:
- Clear `paid_in_salary_slip` cho mọi Score đang link tới Slip này
- Cho phép pay vào Slip kỳ khác

---

## 7. Cancel / điều chỉnh sau submit

### Cancel HR KPI Score

1. Mở HR KPI Score
2. Cancel (docstatus=2)

→ Nếu đã được pay (paid_in_salary_slip có value):
- Mở Salary Slip đó → Cancel → submit lại Score đã sửa → re-create Slip
- Hoặc: tạo Additional Salary âm số tiền tương ứng

### Amend (sửa score / bonus_amount)

1. Cancel Score cũ
2. **Amend** → tạo Score-1 với data copy
3. Sửa số → submit
4. Recompute Salary Slip kỳ tương ứng

---

## 8. Sự cố thường gặp

### 8.1. Submit báo "Employee đã có HR KPI Score cho period X"

→ Cobe enforce 1 employee × 1 period = 1 Score. Đã có Score cũ.

Fix: cancel Score cũ trước, hoặc amend nó.

### 8.2. Submit báo "Score phải nằm trong khoảng 0–100"

→ Check field score. Phải là Float 0.00–100.00.

### 8.3. bonus_amount không suggest tự động

→ `base_amount` = 0 (employee không có Salary Structure Assignment). Fix:
1. Tạo Salary Structure Assignment cho employee → set `base`
2. Hoặc set `Employee.ctc` (sẽ dùng ctc/12)
3. Hoặc fill `bonus_amount` thẳng tay

### 8.4. Salary Slip kỳ tới không có KPI Bonus

Check theo thứ tự:
1. HR KPI Score docstatus = 1 chưa
2. `payout_date` có nằm trong `Salary Slip.start_date` ↔ `Salary Slip.end_date` không
3. `paid_in_salary_slip` đã không null (đã được pay rồi)? Nếu có → check Salary Slip cũ
4. Salary Component "KPI Bonus" có tồn tại không (`bench --site X execute hr_for_cobegroup.install.after_install`)

### 8.5. Salary Slip có 2 KPI Bonus (cùng Monthly và Quarterly)

→ Bình thường nếu cùng month có 2 Score cùng payout_date. Hệ thống sum cả 2 vào 1 row "KPI Bonus" trong Earnings.

→ Nếu muốn tách: tạo 2 Salary Component riêng ("Monthly KPI Bonus", "Quarterly KPI Bonus") và sửa hook để route theo period_type.

---

## Liên quan

- [HR KPI Period](HR-KPI-Period.html) — master kỳ KPI
- [HR WFH Salary Settings](HR-WFH-Salary-Settings.html) — Salary Slip hook tương tự pattern
- [HR Overtime Request](HR-Overtime-Request.html) — pattern Additional Salary
