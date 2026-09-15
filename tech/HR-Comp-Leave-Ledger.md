---
title: Nghỉ bù — Sổ giờ (Comp Leave Ledger)
layout: default
parent: Tài liệu kỹ thuật
nav_order: 4.5
---

# Nghỉ bù — Sổ giờ

> Đặc tả **đầy đủ** cơ chế quỹ giờ Nghỉ bù: nguồn cộng, nguồn trừ, thuật toán phân bổ, hạn
> dùng, các chốt chặn và cách hệ thống hành xử trong từng tình huống.
>
> Mã nguồn: `hr_for_cobegroup/attendance/comp_leave_ledger.py`. Hướng dẫn vận hành cho HR
> tại [Quỹ giờ Nghỉ bù](../users/Desk-HR-QuyNghiBu.html); cho nhân viên tại
> [Hành trình Nghỉ bù](../users/Hanh-Trinh-Nghi-Bu.html).

---

## Mục lục
{: .no_toc }

1. TOC
{:toc}

---

## 1. Bối cảnh — vì sao đổi sang sổ giờ

Tới tháng 09/2026, quyền nghỉ bù gắn chặt vào **một ngày làm thêm**. Đơn nghỉ bù bắt buộc
khai ô *Ngày làm thêm để bù* (`custom_comp_worked_date`); ngày đó phải có một phiếu
`HR Overtime Request` đã duyệt với hình thức quy đổi *Nghỉ bù*, và mỗi ngày chỉ đổi được
đúng một lần theo bậc thang: từ 4 giờ đổi 0,5 ngày, từ 8 giờ đổi 1 ngày.

Ba hệ quả đo được trên dữ liệu thật:

| Vấn đề | Đo trên production |
|---|---|
| Giờ lẻ rơi rụng | Làm thêm 2 giờ hôm nay và 3 giờ hôm sau vẫn đổi được 0 ngày. Kỳ 2026‑H2 mất 12 giờ theo cách này |
| Nắn hành vi khai báo | Nhân viên học cách khai tròn 4 hoặc 8 giờ để khỏi mất; 157/166 phiếu đúng 4h hoặc 8h |
| Khoá 1–1 chặn nhầm | Một đơn nghỉ không được gom giờ từ nhiều ngày, dù tổng giờ thừa đủ |

Sổ giờ thay khoá 1–1 bằng một **quỹ giờ cộng dồn** cho mỗi nhân viên. Giờ làm thêm đã duyệt
chảy vào quỹ, đơn nghỉ trừ quỹ theo tỷ giá cố định. Ô *Ngày làm thêm để bù* mất vai trò
khoá, chỉ còn là ghi chú.

**Tỷ giá cố định, không cấu hình được:**

| Xin nghỉ | Trừ khỏi quỹ |
|---|---|
| 0,5 ngày | 4 giờ |
| 1 ngày | 8 giờ |
| n ngày | n × 8 giờ |

Hai hằng số `HALF_DAY_HOURS = 4.0` và `HOURS_PER_DAY = 8.0` cố tình **không** đưa vào
`HR Policy`. Cấu hình theo ngày hiệu lực trong ứng dụng này áp **hồi tố** cho toàn bộ quá
khứ, nên đổi mẫu số một lần là số dư của cả công ty nhảy theo, kể cả những kỳ đã chốt lương.

---

## 2. Sổ dẫn xuất — không có bảng bút toán

Số dư **luôn được tính lại từ chứng từ gốc** ở mỗi lần đọc, đúng cách HRMS tính số dư phép.
Không có bảng ghi bút toán, không có ô số dư lưu sẵn ở đâu cả.

```
        CỘNG                                    TRỪ
┌────────────────────────┐            ┌──────────────────────────┐
│ HR Overtime Request    │            │ Leave Application        │
│   payout = Nghỉ bù     │            │   loại is_compensatory   │
│   status Approved/     │            │   docstatus < 2          │
│          Expired       │            │   state còn sống         │
│   ot_date <= as_of     │            │                          │
├────────────────────────┤            ├──────────────────────────┤
│ HR Comp Leave          │            │ HR Comp Leave            │
│   Adjustment  hours>0  │            │   Adjustment  hours<0    │
└───────────┬────────────┘            └────────────┬─────────────┘
            │                                      │
            └──────────►  build_ledger()  ◄────────┘
                               │
                    phân bổ FIFO theo HẠN
                               │
              ┌────────────────┼─────────────────┐
              ▼                ▼                 ▼
        balance_hours    shortfall_hours     lots[].remaining
        (giờ còn dùng)   (đã tiêu lố)        (dư từng lô + hạn)
```

**Được gì:** không phải seed số dư ban đầu, không có bảng bút toán lệch với chứng từ, mọi
thao tác huỷ hoặc sửa chứng từ phản ánh vào số dư ngay lập tức.

**Trả giá gì:** phân bổ được tính lại mỗi lần gọi, nên thuật toán **bắt buộc phải tất định** —
hai lần gọi cách nhau phải cho cùng một bức tranh. Xem mục 5.

---

## 3. Nguồn CỘNG — lô giờ

Mỗi khoản cộng là một **lô giờ** (lot) có ngày sinh và hạn dùng riêng.

### 3.1 Từ phiếu làm thêm

Một `HR Overtime Request` vào quỹ khi đủ **cả bốn** điều kiện:

| # | Điều kiện | Ghi chú |
|---|---|---|
| 1 | `payout_type = "Nghỉ bù"` | Phiếu quy đổi tiền lương không liên quan |
| 2 | `status` là `Approved` **hoặc** `Expired` | Lô đã cắt vẫn phải nằm trong danh sách — xem 3.3 |
| 3 | `ot_date <= as_of` | Ngày làm thêm đã tới. Phiếu khai trước cho ngày tương lai nằm chờ |
| 4 | `expected_hours > 0` | |

Số giờ vào quỹ là **`expected_hours`** (số giờ đã duyệt), **không** phải `granted_hours`
(số giờ đối chiếu được từ bảng chấm công). Lý do:

- Bảng chấm công dựng bằng tác vụ nền, đòi giờ có bằng chứng là bắt nhân viên chờ qua đêm
  mới xin nghỉ được.
- Trên production có 54/160 phiếu `granted_hours = 0`, trong đó 44 phiếu không có lần
  chấm công nào. Siết theo `granted_hours` là quét sạch quyền của họ mà không báo trước.
- Việc xác minh nhân viên có thực sự làm thêm hay không thuộc **khâu duyệt phiếu**, không
  thuộc về sổ này.

`expected_hours` đã bị cắt trần 4h/8h ở controller của phiếu làm thêm, nên hệ quả tự nhiên:
một ngày làm thêm đổi tối đa 1 ngày nghỉ.

### 3.2 Từ chứng từ điều chỉnh

`HR Comp Leave Adjustment` đã submit (`docstatus = 1`) với `hours > 0` và
`adjustment_date <= as_of` tạo một lô giờ. Đây là cửa cộng tay của HR: ca mất bằng chứng,
chốt số dư sau tranh chấp, hoặc xoá nợ.

### 3.3 Hạn dùng của lô

Hàm `lot_expiry(lot_date, as_of, cut)`:

| Bước | Luật |
|---|---|
| Mặc định | Hạn = **cuối kỳ chứa ngày sinh lô**. Kỳ A: 01/01–30/06 → hạn 30/06. Kỳ B: 01/07–31/12 → hạn 31/12 |
| Ngoại lệ 1 | Ngày sinh lô **đúng bằng** ngày cắt (30/06 hoặc 31/12) → hạn nhảy sang **mốc cắt kế tiếp**. Hôm đó nhân viên còn đang làm, chưa có cơ hội xin bù |
| Ngoại lệ 2 (ân hạn) | Hạn đã qua **mà lô chưa từng bị cắt** (`cut = False`) → hạn dời tới **mốc cắt của kỳ hiện tại**. Tác vụ nền lỡ một mốc thì không được âm thầm xoá quyền của người ta |
| Khoá | `cut = True` (phiếu đã mang trạng thái `Expired`) → giữ nguyên mốc gốc, **thôi ân hạn** |

Chứng từ điều chỉnh có ô *Hạn dùng* (`expiry_date`): điền thì tôn trọng nguyên, kể cả hạn xa
hơn mốc kỳ — đó là chủ đích của người ký chứng từ. Bỏ trống thì theo mốc kỳ như lô sinh từ
phiếu làm thêm.

Mỗi lô mang **hai** mốc:

| Trường | Ý nghĩa | Ai dùng |
|---|---|---|
| `expiry` | Hạn **có ân hạn** | Phân bổ FIFO, tính số dư, cảnh báo sắp hết hạn |
| `period_end` | Mốc cắt **gốc**, không ân hạn | Tác vụ cắt cuối kỳ |

Tách hai mốc vì nếu tác vụ cắt cũng đọc `expiry` thì chính cái ân hạn của nó đẩy hạn ra xa,
và lệnh chạy bù `run_now(force=1)` để đóng một kỳ đã lỡ sẽ không cắt được gì.

---

## 4. Nguồn TRỪ — khoản tiêu

### 4.1 Từ đơn nghỉ

Một `Leave Application` trừ quỹ khi:

| # | Điều kiện |
|---|---|
| 1 | Loại phép có cờ `is_compensatory = 1` |
| 2 | `docstatus < 2` (chưa huỷ) |
| 3 | `workflow_state` **không** thuộc `Rejected`, `Cancelled`, `Withdrawn` |

Số giờ trừ = `total_leave_days × 8`. `total_leave_days` do HRMS tính, nên đã tự xử lý:

- **Nửa ngày**: 0,5 ngày → 4 giờ.
- **Ngày nửa buổi** (Thứ 7 khối văn phòng): luôn 0,5 ngày → 4 giờ, dù có tick nửa ngày hay
  không — nửa của ngày nửa buổi chỉ có 2 giờ, không biểu diễn được bằng đơn vị 0,5.
- **Ngày lễ / ngày nghỉ tuần xen giữa**: loại phép *Nghỉ bù* để `include_holiday = 0`, nên
  những ngày đó **không** bị tính, đơn trừ ít giờ hơn số ngày lịch.

**Đơn chờ duyệt cũng trừ.** Giữ chỗ ngay khi nộp, không thì nhân viên nộp chồng nhiều đơn
cùng lúc rồi cả loạt cùng được duyệt, và quỹ âm sau khi mọi thứ đã xong.

Trạng thái `Withdrawn` (nhân viên tự thu hồi đơn chưa có hiệu lực) nằm trong danh sách chết:
đơn đó ở `docstatus = 0` và không có bước đi tiếp nào, nên nó chết hẳn. Bộ lọc thời khoá 1–1
không loại trạng thái này, và khi chuyển sang quỹ giờ thì mỗi đơn đã rút giam thật 4 hoặc 8
giờ của người ta — đo trên production thấy 4 đơn như vậy.

### 4.2 Từ chứng từ điều chỉnh

`HR Comp Leave Adjustment` đã submit với `hours < 0`. Khoản trừ không có hạn dùng.

### 4.3 Mốc `claimed_on`

Mỗi khoản tiêu mang một mốc `claimed_on` — thời điểm dùng để trả lời "lúc ấy lô nào còn hạn":

```
claimed_on = min(from_date của đơn nghỉ, ngày tạo đơn)
```

Lấy mốc **sớm hơn** trong hai mốc vì chính sách là "dùng hoặc mất theo kỳ", mà "dùng" gồm cả
hai tình huống có thật:

| Tình huống | Mốc nào cứu |
|---|---|
| Làm thêm tháng 12, **nộp đơn** trong tháng 12, **nghỉ** đầu tháng 1 (rất thường dịp Tết) | Ngày tạo đơn |
| **Nghỉ** trong kỳ nhưng **nộp bù** ở kỳ sau | Ngày nghỉ |

Đo bằng một mốc duy nhất sẽ chặn oan một trong hai.

---

## 5. Thuật toán phân bổ

```
lots   ← sắp theo (expiry, date, name)      ← FIFO theo HẠN
debits ← sắp theo (date, name)              ← đơn nghỉ sớm tiêu trước

với mỗi khoản tiêu:
    còn_phải_trừ ← số giờ của khoản
    với mỗi lô theo thứ tự:
        nếu còn_phải_trừ ≈ 0                 → dừng
        nếu lô.expiry < khoản.claimed_on     → bỏ qua (lô đã hết hạn trước khi tiêu)
        nếu lô đã dùng hết                   → bỏ qua
        lấy ← min(phần trống của lô, còn_phải_trừ)
        ghi nhận, trừ đi
    nếu vẫn còn_phải_trừ                     → cộng vào shortfall_hours
```

Ba tính chất quan trọng:

1. **Tất định.** Thứ tự chỉ phụ thuộc dữ liệu (hạn, ngày, mã chứng từ), không phụ thuộc thời
   điểm gọi hàm. Điều kiện sống còn của một cái sổ không lưu bút toán.
2. **FIFO theo hạn, không theo ngày.** Lô sắp hết hạn được tiêu trước, nên giờ cũ được dùng
   trước khi bị cắt.
3. **Lô hết hạn vẫn nằm trong danh sách.** Nó phải giữ lại phần đã bị tiêu trong quá khứ. Bỏ
   nó ra thì các đơn nghỉ cũ trượt sang lô của kỳ mới và ăn oan số dư vừa được cấp.

### Số dư

```
balance_hours   = tổng phần dư của các lô CÒN HẠN tại as_of
shortfall_hours = tổng phần các khoản tiêu không tìm được lô nào
số dư thực tế   = balance_hours − shortfall_hours
```

`shortfall_hours > 0` nghĩa là đã tiêu quá quỹ. Đây là tình huống có thật: dựng sổ trên dữ
liệu production thấy 5 nhân viên âm, tổng 32 giờ, do khâu duyệt trước đây không có luật quy
đổi. Sổ **không tự sửa** mấy ca đó — xem mục 9.

---

## 6. Tình huống — kiếm giờ

| Tình huống | Hệ thống hành xử |
|---|---|
| Phiếu làm thêm quy đổi *Nghỉ bù* được duyệt, ngày làm thêm **đã qua** | Giờ vào quỹ **ngay lập tức**, dùng được liền |
| Phiếu được duyệt cho **ngày chưa tới** | Giờ **chưa** vào quỹ. Tự vào khi qua ngày đó, không cần thao tác gì |
| Phiếu còn **chờ duyệt** | Không có giờ nào vào quỹ |
| Phiếu bị **từ chối** hoặc **huỷ** | Không vào quỹ; nếu đã vào thì rút ra ngay |
| Phiếu quy đổi **Tiền lương** | Không liên quan tới quỹ |
| Phiếu có `expected_hours = 0` | Bỏ qua |
| Phiếu đã duyệt nhưng nhân viên **không chấm công** ngày đó | **Vẫn tính đủ** số giờ đã duyệt. Bằng chứng là việc của khâu duyệt |
| Nhiều phiếu cùng một ngày | Mỗi phiếu là một lô độc lập, cộng dồn cả |
| Quản lý muốn **huỷ duyệt** một phiếu mà giờ của nó đã bị tiêu | **Bị chặn** nếu huỷ làm quỹ âm — xem 8.2 |
| Quỹ đang **âm**, nhân viên làm thêm tiếp | Giờ mới **trừ dần vào phần âm** trước, chỉ phần thừa mới dùng được |

---

## 7. Tình huống — tiêu giờ

| Tình huống | Hệ thống hành xử |
|---|---|
| Nộp đơn nghỉ bù | Giờ bị **giữ chỗ ngay khi nộp**, chưa cần duyệt |
| Đơn bị **từ chối** | Giờ **trả lại quỹ** |
| Nhân viên **tự thu hồi** đơn | Giờ **trả lại quỹ** |
| Đơn đã duyệt rồi **huỷ** | Giờ **trả lại quỹ** |
| **Sửa** đơn cũ (đổi ngày, đổi số ngày) | Kiểm lại số dư, nhưng **loại chính đơn đó ra** khi đo, để đơn không tự chặn mình |
| Đơn nghỉ **nhiều ngày** | Trừ `số ngày × 8`. Một đơn tiêu được giờ gom từ **nhiều** ngày làm thêm khác nhau |
| Nghỉ **nửa ngày** | Trừ 4 giờ |
| Nghỉ đúng **ngày nửa buổi** (Thứ 7) | Trừ 4 giờ, dù có tick nửa ngày hay không |
| Đơn **vắt qua ngày lễ / Chủ Nhật** | Ngày lễ không bị tính, đơn trừ ít giờ hơn số ngày lịch |
| **Không đủ giờ** trong quỹ | Chặn ngay lúc lưu, kèm số dư hiện có và số giờ cần |
| **HR** lập đơn thay nhân viên | **Miễn** kiểm tra số dư. Đường xử tay cho ca oan |
| Nhân viên vẫn khai ô *Ngày làm thêm để bù* (ứng dụng cũ) | Chỉ lưu làm ghi chú. Chặn duy nhất một điều: ngày đó **chưa tới** |
| Hai đơn nộp gần nhau, mỗi đơn đủ giờ nhưng cộng lại thì không | Đơn thứ hai **bị chặn**, vì đơn thứ nhất đã giữ chỗ |

### Trình tự trừ

Máy tự chọn lô, nhân viên không chọn được. Quy tắc: **lô sắp hết hạn trước, tiêu trước**;
cùng hạn thì lô có ngày làm thêm sớm hơn đi trước; cùng cả hai thì theo mã chứng từ.

---

## 8. Các chốt chặn

### 8.1 Khi lưu đơn nghỉ — `CobeLeaveApplication._validate_comp_leave_balance`

Chạy **sau** `super().validate()`, vì trước đó HRMS chưa tính xong `total_leave_days`.

| Cửa thoát | Lý do |
|---|---|
| Loại phép không phải *Nghỉ bù* | Không liên quan |
| Không phải tạo mới, và không đổi `from_date` / `to_date` / `half_day` | Lượt duyệt, lượt đổi trạng thái không phải lúc kiểm số dư |
| Lượt chuyển sang `Rejected` / `Cancelled` | Đang đóng đơn, không phải mở |
| Người lưu có vai HR Manager / HR User / System Manager / Administrator | Đường xử tay |
| `total_leave_days <= 0` | Không có gì để trừ |

Qua hết các cửa thì so `số ngày × 8` với số dư **đã loại chính đơn này ra**. Thiếu thì chặn,
kèm số dư hiện có, số giờ cần và số ngày tối đa đổi được.

> **Lưu ý về đường duyệt:** khi quản lý bấm duyệt, không có trường ngày nào đổi nên validator
> thoát ở cửa thứ hai. Một đơn đã nộp hợp lệ **không bị chặn lại lúc duyệt**, kể cả khi quỹ
> trong thời gian chờ đã bị đơn khác ăn mất — vì đơn này đã giữ chỗ từ lúc nộp.

### 8.2 Khi huỷ duyệt phiếu làm thêm — `_cancel_blockers`

Chỉ xét khi `payout_type = "Nghỉ bù"` **và** `ot_date` đã tới. Phiếu khai trước cho ngày chưa
làm vốn chưa cộng vào quỹ, trừ nó ra là trừ hai lần.

```
số dư sau khi huỷ = số dư hiện tại − expected_hours của phiếu
nếu số dư sau khi huỷ < 0  → chặn, báo số giờ sẽ âm
```

Luật cũ hỏi "ngày làm thêm này đã bị đơn nghỉ bù nào trỏ vào chưa" — chặt hơn mức cần thiết
trong mô hình quỹ, vì nhân viên còn dư giờ ở ngày khác thì huỷ phiếu này chẳng làm ai mất gì.
So trên dữ liệu production: luật cũ chặn 98/166 phiếu, luật mới chặn 67; có 10 phiếu luật mới
chặn mà luật cũ cho qua (đúng những người sẽ âm quỹ).

### 8.3 Khi lập chứng từ điều chỉnh

| Kiểm | Thông báo |
|---|---|
| `hours = 0` | Số giờ điều chỉnh phải khác 0 |
| `abs(hours) > 200` | Chặn lỗi gõ nhầm (nhập ngày thay vì giờ, thừa số 0). 200 giờ ≈ 25 ngày nghỉ, xa mọi ca chỉnh tay có thật |
| `expiry_date < adjustment_date` | Hạn dùng phải sau ngày điều chỉnh |
| `hours < 0` | Tự xoá ô hạn dùng — khoản trừ không có hạn |
| Sau khi submit, quỹ âm | **Không chặn**, chỉ cảnh báo cho HR biết |

---

## 9. Tình huống — quỹ âm

Quỹ âm khi số giờ đã tiêu vượt số giờ có. Ba nguồn:

| Nguồn | Xử lý |
|---|---|
| Đơn duyệt lố từ trước khi có luật quy đổi | Patch `v0_042` chốt một lần khi luật lên production — xem mục 12 |
| Đơn nghỉ bù cũ khai ngày làm thêm **không có phiếu nào đỡ** | Cũng do patch trên xử, nhưng **chỉ phần đẩy xuống âm** |
| HR lập chứng từ trừ quá tay | HR tự lập chứng từ cộng bù |

Khi quỹ âm, hệ thống **không** tự sửa và **không** thu lại ngày nghỉ đã lấy:

- Nhân viên **không xin thêm** được đơn nghỉ bù nào cho tới khi quỹ về dương.
- Giờ làm thêm mới **trừ dần vào phần âm**.
- Ứng dụng hiện dòng cảnh báo đỏ "Đang âm … giờ so với các đơn đã nộp — liên hệ HR".
- HR xoá nợ bằng một `HR Comp Leave Adjustment` số dương.

---

## 10. Tình huống — hết hạn cuối kỳ

Chính sách **dùng hoặc mất theo kỳ** giữ nguyên: mỗi lô hết hạn ở cuối kỳ chứa ngày sinh lô.

| Tình huống | Hệ thống hành xử |
|---|---|
| Lô còn **dư giờ** tại mốc cắt | Cắt phần dư; phiếu làm thêm chuyển trạng thái **`Expired`** |
| Lô đã **tiêu hết** giờ | Giữ nguyên `Approved`. Dán nhãn *Hết hạn* lên một ngày đã dùng xong chỉ làm nhân viên hoảng |
| Lô tiêu **một phần** | Cắt phần dư, phiếu vẫn chuyển `Expired` |
| Làm thêm **đúng ngày cắt** | Lô sống sang kỳ sau |
| Kỳ đã đóng mà tác vụ nền **chưa từng cắt** | Lô vẫn sống tới mốc cắt kế tiếp. Quyền chỉ mất khi hệ thống **thực sự** cắt, không phải vì lịch trôi qua |
| Đơn nghỉ đã tiêu một lô, **sau khi lô bị cắt** mới huỷ đơn | Giờ **không** quay lại. Lô đã đóng sổ |
| Đơn nghỉ **cho một ngày nằm trong kỳ đã cắt**, nộp muộn sau mốc cắt | **Vẫn ăn được lô đã cắt**, vì `claimed_on` của đơn rơi vào lúc lô còn hạn. Đúng chủ đích: hôm đó nhân viên có quyền thật, chỉ nộp giấy muộn. Không phải lỗ hổng — muốn nộp được thì vẫn phải qua cửa hạn nộp đơn (mục 11), và phần ăn vào lô đã cắt **không** làm số dư hiện tại tăng lên |
| Đơn nghỉ cho ngày **sau** mốc cắt | Không với tới lô đã cắt. Thiếu giờ thì bị chặn như thường |

Đánh dấu `Expired` **không** xoá dữ liệu giờ làm thêm đã ghi: `recompute_request` thoát sớm
khi trạng thái khác `Approved`, và phiếu quy đổi *Nghỉ bù* vốn không bao giờ ghi
`overtime_type` lên bảng chấm công, nên không có đường trả tiền hai lần.

### Tác vụ nền

| Lịch | Hàm | Việc |
|---|---|---|
| 30/06 và 31/12, 23:30 | `expire_comp_leave.run` | Cắt giờ dư. Mọi ngày khác tự bỏ qua |
| 15/06, 24/06, 15/12, 24/12, 08:15 | `expire_comp_leave.run_reminders` | Nhắc từng nhân viên còn giờ chưa dùng, kèm số giờ sắp mất |

Cả hai đều idempotent. Tác vụ cắt chạy trên **sổ** chứ không trên từng phiếu: phải phân bổ
FIFO xong mới biết lô nào thật sự còn dư.

Chạy tay (HR Manager / System Manager, đăng nhập trên Desk rồi mở địa chỉ):

```
/api/method/hr_for_cobegroup.scheduled.expire_comp_leave.run_now
/api/method/hr_for_cobegroup.scheduled.expire_comp_leave.remind_now
```

`run_now` mặc định **từ chối chạy** nếu hôm nay không phải 30/06 hoặc 31/12. Muốn đóng bù một
kỳ đã lỡ thì thêm `?as_of=2026-06-30&force=1`. Chốt chặn này cố ý: chạy lệch mốc sẽ quét sạch
quỹ của cả kỳ đang chạy và không có đường hoàn.

---

## 11. Hạn nộp đơn trễ

Đơn nghỉ nộp sau khi đã nghỉ bị chặn theo bảng `HR Policy Filing Deadline`. Với nghỉ bù, mốc
bắt đầu đếm trễ **không** phải ngày nghỉ, mà là thời điểm nhân viên **thực sự có thể nộp**:

```
mốc đếm = max(ngày nghỉ, thời điểm quỹ gom đủ giờ cho đơn này)
```

Hàm `funded_on(employee, required_hours, as_of)` cộng dồn `expected_hours` của các phiếu làm
thêm đã duyệt theo `approved_on` tăng dần, bỏ qua lô đã hết hạn, và trả về ngày duyệt của
phiếu cuối cùng cần tới. Trả `None` khi quỹ chưa từng đủ hoặc thiếu dữ liệu ngày duyệt — khi
đó rơi về mốc ngày nghỉ như phép thường, **tuyệt đối không phải "không giới hạn"**.

Mốc này chỉ được phép **nới** hạn nộp, không bao giờ siết: nhân viên không thể nộp sớm hơn
lúc quỹ có giờ, nên phạt họ vì sự chậm trễ của người duyệt là sai.

Có một bẫy đã làm nhánh này chết câm: `_validate_backdate_deadline` chạy **trước**
`super().validate()`, nên `total_leave_days` còn trống với mọi đơn đi qua API. Hàm
`_rough_leave_days()` ước lượng số ngày từ khoảng ngày, cố tình **ước cao hơn thực** (không
trừ ngày lễ) để mốc chỉ có thể lùi về sau, tức chỉ nới.

---

## 12. Đợt chốt số dư khi áp luật — patch `v0_042`

Chạy **một lần** trong `bench migrate`, ở nhóm `post_model_sync` (sau khi bảng
`HR Comp Leave Adjustment` đã được tạo).

| Tính chất | Chi tiết |
|---|---|
| **Tự đo lúc chạy** | Không chép số cứng. Từ lúc viết patch tới lúc migrate còn phát sinh phiếu mới, số âm sẽ khác |
| **Idempotent bằng dấu trong lý do chứng từ** | Không dựa vào Patch Log, vì patch có thể chạy lại trên site dựng lại từ dump. Ai đã có một chứng từ mang dấu `[chốt số dư trước khi áp luật quỹ giờ Nghỉ bù]` thì bỏ qua hẳn |
| **Chốt chặn 200 giờ** | Tổng nợ vượt ngưỡng thì **dừng và chỉ ghi log**, không phát tự động. Con số lớn bất thường nghĩa là dữ liệu khác xa bản đã đo |
| **Phạm vi** | Chỉ hoàn phần đẩy người ta **xuống âm**. Ai còn số dư dương thì không đụng tới |

Đo trên bản phục dựng 14/09/2026: 5 nhân viên, tổng 32 giờ.

---

## 13. Nơi số dư hiện ra

Ba màn hình, **một nguồn duy nhất** là sổ giờ:

| Nơi | Hiện gì | Hàm |
|---|---|---|
| Ứng dụng nhân viên, thẻ loại phép | `Nghỉ bù: 2.5 ngày (20.00h)` | `api.leave.get_leave_types_for_employee` |
| Ứng dụng nhân viên, bảng xanh khi chọn *Nghỉ bù* | Số giờ, số ngày, từng lô kèm hạn, cảnh báo âm | `api.leave.get_comp_leave_ledger` |
| Báo cáo **Bảng công** (`COBE HR Attendance Sheet`), cột **NB** | Số ngày đổi được tại 2 mốc | `_comp_balance_on` |

Ba điểm phải nhớ khi đọc mấy con số này:

1. **Số ngày quy từ số dư ròng** (đã trừ phần tiêu lố), làm tròn **xuống** bậc 0,5 ngày. Còn
   6 giờ thì hiện `0,5 ngày`, 2 giờ lẻ vẫn nằm trong quỹ nhưng không hiện thành ngày.
2. **Cột NB kẹp sàn 0.** Người đang âm hiện `0`, không hiện số âm.
3. **Số dư của loại phép *Nghỉ bù* trên Desk là con số khác.** Loại này bật `allow_negative`
   và gần như không có cấp phép, nên HRMS trả về **âm số ngày đã nghỉ**. Đó không phải quỹ.
   Nếu một nhân viên có phiếu `Leave Allocation` cho loại này (đường làm cũ, dữ liệu
   production còn đúng một phiếu) thì phiếu đó **không còn quyết định gì**: cả màn hình lẫn
   chốt chặn đều đọc quỹ.

---

## 14. Những gì cố tình không làm

| Không làm | Vì sao |
|---|---|
| Không đưa 4h/8h vào `HR Policy` | Cấu hình theo ngày hiệu lực áp hồi tố, đổi một lần là số dư cả công ty nhảy, kể cả kỳ lương đã chốt |
| Không lưu bảng bút toán | Bảng bút toán sẽ lệch với chứng từ mỗi khi ai đó huỷ hoặc sửa. Sổ dẫn xuất không bao giờ lệch |
| Không cho nhân viên chọn lô để tiêu | Chọn tay thì người ta giữ lô sắp hết hạn lại, rồi mất |
| Không tự thu hồi ngày nghỉ khi phát hiện âm | Người ta đã nghỉ xong từ lâu; nợ sinh từ khâu duyệt chứ không phải từ họ |
| Không dùng `granted_hours` | Xem 3.1 |
| Không xoá ô *Ngày làm thêm để bù* khỏi đơn | Dữ liệu cũ vẫn cần đọc được; ô chỉ mất vai trò khoá |

---

## 15. Bộ kiểm

`hr_for_cobegroup/attendance/test_comp_leave_ledger.py` — 28 trường hợp, gồm: cộng dồn giờ
lẻ nhiều ngày, phần dư ở lại quỹ, một đơn tiêu nhiều lô, tiêu quá quỹ thành âm, FIFO theo
hạn, lô hết hạn vẫn giữ phần đã tiêu, ân hạn cho kỳ chưa ai cắt, cắt chỉ ăn phần dư, ngày
chưa tới, phiếu chưa duyệt, điều chỉnh tay cộng và trừ, loại chính đơn đang sửa, đơn bị từ
chối và đơn tự thu hồi trả lại giờ, ba tình huống chặn huỷ phiếu, duyệt đơn thiếu giờ không
bị chặn lại, và bốn trường hợp của patch `v0_042`.

Các module liên quan: `scheduled/test_expire_comp_leave.py`, `api/test_comp_leave_future_ot.py`,
`overrides/test_leave_backdate.py`.

---

## Liên quan

- 🏦 HR: [Quỹ giờ Nghỉ bù](../users/Desk-HR-QuyNghiBu.html) — xem quỹ, điều chỉnh tay, hết hạn
- 🧭 Nhân viên: [Hành trình Nghỉ bù](../users/Hanh-Trinh-Nghi-Bu.html)
- ⏱️ [Phiếu làm thêm giờ (`HR Overtime Request`)](../users/HR-Overtime-Request.html)
- 🏗️ [HR Attendance — Architecture](HR-Attendance-Architecture.html)
