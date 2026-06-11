---
title: HR KPI Period (Kỳ KPI)
layout: default
parent: Chấm công & HR
nav_order: 12
---

# HR KPI Period — Kỳ đánh giá KPI

> Submittable doctype master cho 1 kỳ KPI. Hỗ trợ **Monthly / Quarterly / Yearly**.
>
> Sau khi tạo period, HR Manager / phòng ban tạo từng [HR KPI Score](HR-KPI-Score.html) cho từng nhân viên trong period đó.

---

## Mục lục

1. [Khi nào tạo period mới](#1-khi-nào-tạo-period-mới)
2. [Các field](#2-các-field)
3. [Tạo period — workflow](#3-tạo-period--workflow)
4. [Close period](#4-close-period)
5. [Phân biệt 3 loại period](#5-phân-biệt-3-loại-period)
6. [Sự cố thường gặp](#6-sự-cố-thường-gặp)

---

## 1. Khi nào tạo period mới

| Loại | Tần suất | Khi tạo |
|---|---|---|
| Monthly | 12 lần/năm | Đầu mỗi tháng |
| Quarterly | 4 lần/năm | Đầu mỗi quý |
| Yearly | 1 lần/năm | Đầu năm |

Cobe có thể dùng đồng thời cả 3 — vd:
- Quarterly KPI cho team Sales (thưởng theo quý)
- Monthly KPI cho phòng kỹ thuật (theo số đơn xử lý)
- Yearly KPI cho ban Giám đốc

---

## 2. Các field

### `period_name` (Data, auto-fill, unique)

Format tự sinh từ `period_type` + `year` + (`month` | `quarter`):
- Monthly: `KPI-2026-06` (= tháng 6/2026)
- Quarterly: `KPI-2026-Q2`
- Yearly: `KPI-2026`

→ Không edit tay được, sửa year/month/quarter → period_name tự update.

### `period_type` (Select, bắt buộc)

`Monthly` / `Quarterly` / `Yearly`.

### `year` (Int, bắt buộc)

4 chữ số. Vd 2026.

### `month` (Select 1-12) — chỉ hiện khi `period_type = Monthly`

Mandatory khi period_type=Monthly.

### `quarter` (Select 1-4) — chỉ hiện khi `period_type = Quarterly`

Mandatory khi period_type=Quarterly.

### `from_date` / `to_date` (Date, read-only, auto)

Server tự compute từ year + month/quarter:
- Monthly 2026-06: from=2026-06-01, to=2026-06-30
- Quarterly 2026-Q2: from=2026-04-01, to=2026-06-30
- Yearly 2026: from=2026-01-01, to=2026-12-31

### `status` (Select, default "Open")

| Value | Ý nghĩa |
|---|---|
| Open | Đang cho phép tạo HR KPI Score |
| Closed | Khóa, không cho tạo Score mới (Score đã có vẫn dùng được) |

Có `allow_on_submit = 1`, edit được dù period đã submit.

### `company` (Link → Company, optional)

Nếu company dùng nhiều, set để filter.

---

## 3. Tạo period — workflow

### Bước 1 — Tạo Draft

Desk → search **HR KPI Period** → **New**.

1. `period_type = Monthly` (hoặc Quarterly / Yearly)
2. `year = 2026`
3. Tùy theo type:
   - Monthly: chọn `month` (1–12)
   - Quarterly: chọn `quarter` (1–4)
4. **Save** → `period_name` tự fill, `from_date/to_date` tự compute

### Bước 2 — Submit

Bấm **Submit** → docstatus=1, status=Open, period ready for use.

→ Từ giờ HR có thể tạo HR KPI Score link tới period này.

### Bước 3 — Tạo HR KPI Score (xem [HR KPI Score](HR-KPI-Score.html))

Mỗi nhân viên 1 HR KPI Score per period.

### Bước 4 — Close period

Khi đã đánh giá xong tất cả nhân viên cho period đó:

1. Mở HR KPI Period
2. Đổi `status` Open → Closed
3. Save

→ Sau Close không tạo Score mới được. Score cũ vẫn được dùng để pay.

---

## 4. Close period

Lý do close:
- Đã evaluate xong tất cả employees
- Đã pay bonus xong (Salary Slip đã include KPI Bonus)
- Chấm dứt tránh người tạo Score muộn

→ Server check status trước khi cho insert HR KPI Score: nếu period.status=Closed → reject.

---

## 5. Phân biệt 3 loại period

| Tình huống | Dùng loại |
|---|---|
| Thưởng theo tháng (đơn giản) | Monthly — mỗi tháng 1 period, payout cùng tháng |
| Thưởng theo quý | Quarterly — 1 period/quý, payout cuối quý (tháng 3, 6, 9, 12) |
| Thưởng cuối năm / 13th month | Yearly — 1 period/năm, payout tháng 1 năm sau |

→ Có thể combine: nhân viên có thể có **2 KPI Score** (1 Quarterly + 1 Yearly) → payout 2 lần / năm.

### Khi nào KPI Bonus xuất hiện trong Salary Slip?

→ Khi `HR KPI Score.payout_date` rơi vào range của Salary Slip. Logic chi tiết: xem [HR KPI Score §6](HR-KPI-Score.html#6-liên-kết-với-salary-slip).

→ Tách `payout_date` khỏi `period.to_date` để cho phép trả "muộn" — vd Quarterly Q1 (Q1 = Jan–Mar) có thể `payout_date = 2026-04-15` (trả vào tháng 4).

---

## 6. Sự cố thường gặp

### 6.1. Period đã submit, đổi month sai → muốn sửa

→ **Cancel** period (docstatus=2) → **Amend** (tạo bản copy có `-1`) → sửa month → submit lại.

→ Lưu ý: HR KPI Score đã link sẽ bị orphan (vẫn link tên period cũ). Phải re-link manually hoặc cancel + recreate.

### 6.2. Tạo 2 period Monthly cho cùng tháng → unique error

→ Cobe enforce unique `period_name`. Nếu cần override (hiếm), thay đổi `year` hoặc dùng `period_type` khác.

### 6.3. period_name không tự update khi sửa month

→ Save lại (Ctrl+S) → trigger validate → recompute.

---

## Liên quan

- [HR KPI Score](HR-KPI-Score.html) — tạo score cho từng nhân viên
- [HR WFH Salary Settings](HR-WFH-Salary-Settings.html) — pattern tương tự (Salary Slip hook)
