---
title: HR KPI Period
layout: default
parent: Lương & Thưởng
nav_order: 5
---

# HR KPI Period — Kỳ chấm điểm KPI

> Submittable doctype, per-record, amendable. Định nghĩa khoảng thời gian chấm KPI (tháng / quý / năm).
>
> Mỗi KPI Score phải link tới 1 Period.

---

## Mục lục

1. [Khi nào dùng](#1-khi-nào-dùng)
2. [Cách mở](#2-cách-mở)
3. [Các field](#3-các-field)
4. [Quy trình tạo Period](#4-quy-trình-tạo-period)
5. [Đóng Period](#5-đóng-period)
6. [Use case nhiều Period song song](#6-use-case-nhiều-period-song-song)

---

## 1. Khi nào dùng

Mỗi chu kỳ chấm KPI cần tạo 1 Period. Tùy quy mô:
- Cobe chấm hàng tháng → tạo 12 Period/năm (Jan, Feb, ...)
- Cobe chấm hàng quý → tạo 4 Period/năm (Q1-Q4)
- Cobe chấm hàng năm → tạo 1 Period/năm

Có thể mix: vừa có Period Quarterly cho team Sales, vừa có Period Monthly cho team Tech.

---

## 2. Cách mở

- Desk → search "HR KPI Period" → New
- URL: `/app/hr-kpi-period/new`

---

## 3. Các field

### `period_name` (Data, auto-name)

Tự gen theo template: `KPI-{period_type}-{year}-{month/quarter}`.

VD:
- `KPI-Monthly-2026-06`
- `KPI-Quarterly-2026-Q2`
- `KPI-Yearly-2026`

### `period_type` (Select: Monthly / Quarterly / Yearly, **bắt buộc**)

Loại chu kỳ.

### `company` (Link → Company, **bắt buộc**)

Period thuộc Company nào. Nhân viên Company khác không tạo KPI Score link tới Period này được.

### `year` (Int, **bắt buộc**)

Năm dương lịch. VD: 2026.

### `month` (Select 1-12, hiện khi period_type=Monthly)

Tháng.

### `quarter` (Select 1-4, hiện khi period_type=Quarterly)

Quý:
- Q1 = Jan-Mar
- Q2 = Apr-Jun
- Q3 = Jul-Sep
- Q4 = Oct-Dec

### `from_date` (Date, auto-compute, read-only)

Ngày đầu kỳ. Tự tính từ year + month/quarter:
- Monthly: 1 của tháng
- Quarterly: 1 của tháng đầu quý
- Yearly: 1/1

### `to_date` (Date, auto-compute, read-only)

Ngày cuối kỳ. Tự tính cuối tháng / cuối quý / 31/12.

### `status` (Select: Open / Closed)

| Value | Khi nào |
|---|---|
| Open | Đang chấm KPI Score cho period này |
| Closed | Đã chốt, không cho tạo KPI Score mới |

Khi tạo KPI Score, hệ thống check Period status = Open, nếu Closed → throw.

### `docstatus` (built-in)

Có thể submit để lock (docstatus=1). Cancel để mở lại (docstatus=2).

Tự do để Draft (docstatus=0) cũng được — Period chỉ là master data, không có business impact ngoài việc filter.

---

## 4. Quy trình tạo Period

### Setup đầu năm

Tạo trước tất cả Period của năm để managers chấm:
1. Period Monthly: 12 record (Jan → Dec) cho mỗi Company
2. Period Quarterly: 4 record (Q1 → Q4)
3. Period Yearly: 1 record

Status = Open cho tất cả.

### Tạo từng kỳ

Hoặc theo từng kỳ:
1. Đầu tháng/quý → tạo Period mới
2. status = Open
3. Manager chấm KPI Score
4. Cuối kỳ → status = Closed (xem mục 5)

---

## 5. Đóng Period

Sau khi:
- Tất cả nhân viên đã có KPI Score
- Đã submit Salary Slip kỳ có payout

→ Edit Period → `status = Closed` → Save.

Tác dụng:
- KPI Score mới không link tới Period này được
- KPI Score cũ vẫn xem được, vẫn liên kết Salary Slip OK
- Trường hợp cần thêm score muộn → mở lại status=Open

---

## 6. Use case nhiều Period song song

### Case 1: Monthly + Quarterly cùng tồn tại

- Tháng: chấm 0-100 cho hiệu suất tháng
- Quý: chấm tổng kết quý
- Cả 2 đều cho bonus, không xung đột vì KPI Score link tới Period nào thì lookup salary slip period đó

### Case 2: Multi-Company

- Cobe Group có 5 Company: TGĐG, MMW Asia, ... mỗi cái cần 12 Period/năm
- Tạo từng cái với field `company` khác nhau
- KPI Score chỉ tạo được trong Period cùng Company với Employee

### Case 3: Retroactive scoring

- Tháng 6 mới chấm điểm cho Q1 → tạo Period Quarterly 2026-Q1 với status=Open
- Chấm Score → payout_date set tháng 6 → Salary Slip tháng 6 sẽ trả bonus
- Sau đó status=Closed

---

## Liên quan

- [HR KPI Score](HR-KPI-Score.html) — chấm điểm
- [HR Compensation — Tổng quan](Compensation-Tong-Quan.html)
- [HR Compensation — Architecture (tech)](../tech/HR-Compensation-Architecture.html)
