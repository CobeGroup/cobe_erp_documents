---
title: "Quỹ giờ Nghỉ bù (xem, điều chỉnh, hết hạn)"
layout: default
parent: HR (vận hành)
grand_parent: Chấm công & HR
nav_order: 3.7
---

# Quỹ giờ Nghỉ bù
{: .no_toc }

Nghỉ bù tính bằng **giờ**, không bằng ngày — trang này dành cho HR
{: .fs-3 .text-grey-dk-000 }

<details open markdown="block">
  <summary>Mục lục</summary>
{: .text-delta }
1. TOC
{:toc}
</details>

---

## 1. Quỹ giờ là gì

Từ **09/2026**, quyền nghỉ bù của nhân viên nằm trong một **quỹ giờ**. Giờ làm thêm được
duyệt với hình thức quy đổi *Nghỉ bù* cộng dồn vào quỹ; đơn nghỉ bù trừ quỹ theo tỷ giá cố
định:

| Xin nghỉ | Trừ khỏi quỹ |
|---|---|
| 0,5 ngày | **4 giờ** |
| 1 ngày | **8 giờ** |
| 2 ngày | **16 giờ** |

Trước đó mỗi ngày làm thêm là một "phiếu" dùng đúng một lần: nhân viên phải khai đúng ngày
làm thêm nào được bù, và giờ lẻ không đủ 4 giờ coi như mất. Nay hai buổi lẻ 2 giờ và 3 giờ
của hai ngày khác nhau gộp lại đổi được 0,5 ngày, phần dư ở lại quỹ cho lần sau.

> **Quỹ này không phải Leave Allocation.** Loại phép *Nghỉ bù* (`Leave Type`) bật cờ
> `allow_negative` và thường không có cấp phép, nên trên Desk số dư của loại này hiện
> **âm**. Con số âm đó chỉ có nghĩa "đã nghỉ bù bấy nhiêu ngày", không phải nhân viên đang
> nợ. Quỹ thật là thứ mô tả ở trang này.
>
> Nếu một nhân viên có phiếu cấp phép (`Leave Allocation`) cho loại *Nghỉ bù* — đường làm
> cũ, trên dữ liệu 14/09/2026 còn đúng một phiếu — thì phiếu đó **không còn tác dụng**:
> ứng dụng lấy số dư từ quỹ giờ, và đơn nghỉ cũng được chốt theo quỹ. Không cần huỷ phiếu
> cấp phép, nhưng cũng đừng cấp thêm.

### Giờ nào vào quỹ

Một phiếu làm thêm (`HR Overtime Request`) cộng vào quỹ khi đủ **cả ba** điều kiện:

1. Hình thức quy đổi là **Nghỉ bù** (không phải *Tiền lương*).
2. Trạng thái **Đã duyệt** (`Approved`) — tức **HR đã duyệt bước cuối**. Phiếu mới qua trưởng bộ
   phận (`Manager Approved`) chưa vào quỹ.
3. **Ngày làm thêm đã tới** — phiếu khai trước cho ngày chưa làm vẫn nằm chờ.

Số giờ vào quỹ tuỳ theo **ngày làm thêm**:

| Ngày làm thêm | Số giờ vào quỹ |
|---|---|
| Từ **01/10/2026** | **Số giờ đo được từ chấm công** — cùng cách đo với làm thêm trả tiền. Không có lần quẹt thì không có giờ |
| Trước 01/10/2026 | Số giờ được duyệt trên phiếu (`expected_hours`), như trước |

Với ngày làm thêm từ 01/10/2026, giờ chỉ vào quỹ sau khi **bảng chấm công của ngày đó đã
được dựng** (tác vụ nền chạy ban đêm) — làm thêm hôm nay thì sáng hôm sau mới thấy giờ.
Số giờ vào quỹ có thể **ít hơn** số giờ đã duyệt nếu nhân viên làm thêm ít hơn đã khai.
Cách đo giờ: [Chính sách chấm công §8](Desk-Admin-Policy.html#8-cách-tính-giờ-công-và-trạng-thái-công-từ-01102026).

---

## 2. Xem quỹ — báo cáo và hồ sơ nhân viên

**Nhân viên** tự xem trên ứng dụng: tab **Nghỉ phép** → chọn loại phép *Nghỉ bù*. Màn hình
hiện số giờ còn lại, số ngày đổi được, và từng lô giờ kèm hạn dùng.

**HR và quản lý** có hai chỗ xem, cùng đọc từ một sổ nên không bao giờ lệch số với ứng
dụng của nhân viên.

### Báo cáo *Quỹ giờ Nghỉ bù*

Vào **Báo cáo → Quỹ giờ Nghỉ bù** (`COBE Comp Leave Fund`). Báo cáo có hai chế độ:

| Chế độ | Khi nào hiện | Đọc được gì |
|---|---|---|
| **Tổng hợp** | mặc định, khi chưa lọc một nhân viên cụ thể | mỗi người một dòng: số dư (giờ), số ngày đổi được, phần **sắp bị cắt** ở mốc kỳ, tổng đã cộng, tổng đã tiêu |
| **Chi tiết** | khi lọc đúng một nhân viên, hoặc bật ô *Bung chi tiết lô & đơn* | bung từng lô giờ và từng khoản đã tiêu, kèm liên kết tới chứng từ gốc |

Các ô lọc: *Tính tới ngày*, *Công ty*, *Phòng ban* (gồm cả phòng con), *Nhân viên*, *Chỉ
người còn quỹ*, *Gồm NV đã nghỉ việc*.

Cột **Ghi chú** gọi tên ba tình huống cần để mắt: người đang âm quỹ, người có giờ lẻ chưa
đủ 4 giờ để đổi nửa ngày, và người sắp mất giờ khi còn dưới 45 ngày tới mốc cắt.

Hai nút ở đầu báo cáo (chỉ HR thấy):

- **Tạo phiếu điều chỉnh** — mở thẳng phiếu `HR Comp Leave Adjustment` đã điền sẵn nhân
  viên đang chọn. Xem mục 4.
- **Nhắc NV sắp mất giờ** — gửi thông báo cho đúng những người *đang hiện trên bảng* mà
  còn giờ sắp bị cắt. Lọc phòng nào thì chỉ nhắc phòng đó. Mỗi người nhận một thông báo
  trong ngày, bấm lại không gửi trùng.

### Tab *Quỹ Nghỉ bù* trên hồ sơ nhân viên

Mở hồ sơ nhân viên (`Employee`) → tab **Quỹ Nghỉ bù**, ngay cạnh tab *Attendance & Leaves*.
Tab hiện số dư, số ngày đổi được, phần sắp bị cắt, rồi hai bảng: **Giờ vào quỹ** và **Đã
tiêu** — mỗi dòng bấm được để mở chứng từ gốc.

Hai bảng này **đối chiếu được với nhau**. Bảng *Giờ vào quỹ* có cột **Dùng cho đơn nào**,
bảng *Đã tiêu* có cột **Lấy giờ từ phiếu nào**; mỗi ô liệt kê ngày, mã chứng từ bấm được và
số giờ.

> 💡 **Vì sao một phiếu 4 giờ lại hiện "đã dùng 2,50".** Quỹ trừ theo thứ tự *lô nào sắp hết
> hạn thì tiêu trước*, nên một phiếu làm thêm có thể bị chia cho **hai đơn nghỉ** khác nhau.
> Chỉ cần một phiếu có số giờ lẻ — ví dụ 5,5 giờ — là mọi lần trừ sau đó đều rơi vào giữa
> phiếu. Không có chứng từ nào mang con số 2,50; nó là **phần còn lại của phép trừ**. Cột
> *Dùng cho đơn nào* cho biết chính xác phần đó chạy sang đơn nghỉ nào.

### Ai xem được của ai

| Vai trò | Phạm vi |
|---|---|
| HR Manager, HR User, System Manager | toàn công ty |
| Quản lý | chính mình và nhân viên dưới quyền — lấy theo ô *Leave Approver* hoặc *Reports To* trên hồ sơ |
| Nhân viên | chỉ chính mình |

Quản lý mở báo cáo mà thiếu người thì kiểm lại hai ô đó trên hồ sơ nhân viên: hệ thống
nhận cấp dưới qua chúng, không qua phòng ban.

### Đường tra cũ vẫn còn

Báo cáo **Bảng công** (`COBE HR Attendance Sheet`) giữ hai cột **NB (cuối kỳ)** và **NB
(tới hiện tại)** — số ngày nghỉ bù còn đổi được, cũng lấy thẳng từ quỹ giờ. Muốn tự lần
lại phép tính thì tra hai bảng:

- `HR Overtime Request` — lọc `payout_type = Nghỉ bù`, `status = Đã duyệt`, theo nhân
  viên. Cột *Số giờ dự kiến* là phần cộng vào quỹ.
- `Leave Application` — lọc loại phép *Nghỉ bù*, theo nhân viên. Mỗi đơn còn hiệu lực trừ
  `số ngày × 8` giờ.

Quỹ còn lại = tổng cộng − tổng trừ, sau khi loại các lô đã hết hạn. Đơn bị **Từ chối**,
**Đã huỷ** hoặc **nhân viên tự thu hồi** không trừ quỹ.

---

## 3. Hết hạn theo kỳ

Chính sách **dùng hoặc mất theo kỳ** giữ nguyên: mỗi lô giờ hết hạn ở **cuối kỳ chứa ngày
làm thêm** — **30/06** hoặc **31/12**.

| Việc | Thời điểm | Hệ thống làm gì |
|---|---|---|
| Nhắc trước | 15 và 24 tháng 6, 15 và 24 tháng 12 | Gửi thông báo cho từng nhân viên còn giờ chưa dùng, kèm số giờ sắp mất |
| Cắt quỹ | 30/06 và 31/12 lúc 23:30 | Cắt phần giờ **còn dư**; phiếu làm thêm tương ứng chuyển trạng thái **Hết hạn** (`Expired`) |

Ba điểm cần nhớ:

- Phiếu đã tiêu **hết** giờ giữ nguyên trạng thái *Đã duyệt* — không dán nhãn *Hết hạn* lên
  một ngày làm thêm đã dùng xong.
- Làm thêm **đúng ngày cắt** (30/06 hoặc 31/12) thì lô đó sống sang kỳ sau: hôm ấy nhân
  viên còn đang làm, chưa kịp xin nghỉ.
- Lô của một kỳ đã đóng mà hệ thống **chưa từng cắt** (tác vụ nền lỡ một mốc) vẫn sống tới
  mốc kế tiếp. Quyền chỉ mất khi hệ thống thực sự cắt, không phải vì lịch trôi qua.

**Chạy tay khi cần** (chỉ HR Manager / System Manager): đang đăng nhập trên Desk, mở địa
chỉ

```
/api/method/hr_for_cobegroup.scheduled.expire_comp_leave.run_now
```

Mặc định hàm chỉ chịu chạy đúng hai mốc cuối kỳ. Muốn đóng bù một kỳ đã lỡ thì thêm
`?as_of=2026-06-30&force=1`. Chốt chặn `force` là cố ý: chạy lệch mốc sẽ quét sạch quỹ của
cả kỳ đang chạy và **không có đường hoàn**. Bắn thông báo nhắc trước hạn thì dùng
`/api/method/hr_for_cobegroup.scheduled.expire_comp_leave.remind_now`.

---

## 4. Điều chỉnh quỹ bằng tay — `HR Comp Leave Adjustment`

Quỹ được tính lại từ chứng từ gốc mỗi lần đọc, nên **không có ô số dư để sửa**. Mọi can
thiệp tay đi qua chứng từ **Điều chỉnh quỹ Nghỉ bù** (`HR Comp Leave Adjustment`).

**Vào bằng đâu:** ô tìm kiếm trên Desk, gõ `HR Comp Leave Adjustment`; hoặc mở thẳng
`/app/hr-comp-leave-adjustment`. Quyền đã mở sẵn cho **HR Manager**, **HR User** và
**System Manager**.

**Các trường:**

| Trường | Ý nghĩa |
|---|---|
| Nhân viên | Người được điều chỉnh |
| Ngày điều chỉnh | Mốc chứng từ có hiệu lực; cũng là mốc tính hạn dùng nếu bỏ trống ô *Hạn dùng* |
| Số giờ (+/-) | **Dương** = cộng vào quỹ, **âm** = trừ bớt. 8 giờ = 1 ngày nghỉ |
| Hạn dùng | Chỉ hiện khi cộng. Bỏ trống = theo mốc cuối kỳ như lô sinh từ phiếu làm thêm |
| Lý do | Bắt buộc — đây là căn cứ để người sau đọc lại hiểu vì sao quỹ lệch |

Chứng từ phải **Submit** mới vào quỹ; huỷ (`Cancel`) là rút khỏi quỹ. Hệ thống chặn số 0 và
số lớn hơn 200 giờ (chặn gõ nhầm — 200 giờ đã là 25 ngày nghỉ). Nếu khoản trừ đẩy nhân viên
xuống âm, hệ thống báo ngay lúc Submit. Không ai tự **lập** hay tự **huỷ** chứng từ trên quỹ
**của chính mình** — huỷ một phiếu trừ quỹ cũng là xoá nợ của mình. Nhờ một người HR khác.

**Khi nào dùng:**

- Nhân viên làm thêm thật nhưng mất bằng chứng chấm công, có quản lý bảo lãnh.
- Phát hiện duyệt lố, cần thu lại giờ đã cấp.
- Chốt số dư sau tranh chấp, hoặc cấp bù theo thoả thuận riêng.

---

## 5. Ứng trước — nghỉ trước, làm thêm bù sau {#ung-truoc}

Nhân viên làm ca, bảo dưỡng, trực thường xuyên hay phải nghỉ một buổi giữa tháng rồi mới có
ca làm thêm để bù. Mặc định quỹ phải **đủ giờ ngay lúc nộp đơn**; muốn cho một nhóm người
được nghỉ trước thì HR khai **hạn mức ứng trước** cho họ. Khi đó quỹ được **âm** tới hạn mức,
và giờ làm thêm quy đổi *Nghỉ bù* về sau tự trả vào phần âm.

Không có phiếu ứng riêng: nhân viên vẫn nộp đơn *Nghỉ bù* như thường, hệ thống tự nhận ra
đơn nào là ứng.

### Khai hạn mức

**HR Policy** của công ty → tab **Hạn mức khai bù** → mục **Ứng trước Nghỉ bù**, bảng
*Hạn mức ứng trước Nghỉ bù*:

| Cột | Ý nghĩa |
|---|---|
| Hiệu lực từ ngày | Dòng áp cho **đơn nghỉ** từ ngày này trở đi. Dòng mới thay dòng cũ, không cần xoá dòng cũ |
| Bộ phận | Trống = mọi bộ phận |
| Nhân viên | Trống = mọi nhân viên. Khai đích danh để đặt ngoại lệ cho một người |
| Số ngày được ứng tối đa | Quỹ được âm tối đa bấy nhiêu ngày. Bước 0,5 ngày (= 4 giờ). **0 = không cho ứng** |

Thứ tự ưu tiên y như bảng hạn mức khai bù phía trên: dòng *Nhân viên* thắng dòng *Bộ phận*,
dòng *Bộ phận* thắng dòng để trống cả hai.

> **Số 0 ở đây nghĩa ngược với bảng hạn mức khai bù.** Ở bảng khai bù, 0 là *không giới
> hạn*; ở bảng ứng trước, 0 là *không cho ứng*. Không có dòng nào cũng là không ai được ứng.
> Muốn cả bộ phận được ứng nhưng trừ một người, khai dòng bộ phận rồi thêm dòng đích danh
> người đó với số 0.

**Mặc định khi cập nhật hệ thống:** chỉ bộ phận *Dịch vụ - Bảo hành* được ứng tối đa
**1 ngày**, hiệu lực từ ngày cập nhật. Mọi bộ phận khác không có dòng nào, tức không được ứng.

| Hiệu lực từ ngày | Bộ phận | Nhân viên | Số ngày được ứng tối đa |
|---|---|---|---|
| (ngày cập nhật) | Dịch vụ - Bảo hành - TGĐG | | 1 |

Bảng này chịu chốt **không ai tự khai luật cho chính mình**, chặt hơn các bảng hạn mức khác:
HR không thêm, sửa hay xoá được dòng áp cho chính mình, cho bộ phận của mình, **và cả dòng cả
công ty** của công ty mình — vì mặc định không ai được ứng, nên mở cho cả công ty cũng là tự
mở cho mình. Những dòng đó chỉ **System Manager** khai được.

### Hệ thống chốt thế nào

| Tình huống | Hệ thống làm gì |
|---|---|
| Quỹ đủ giờ | Như thường, đơn không phải là ứng |
| Quỹ thiếu, nhân viên **không có** hạn mức ứng | Chặn như trước: *"Quỹ Nghỉ bù còn …h, chưa đủ để nghỉ …"* |
| Quỹ thiếu, sau đơn này quỹ âm **trong** hạn mức | Cho nộp. Phần thiếu ghi vào ô **Giờ Nghỉ bù ứng trước** trên đơn |
| Sau đơn này quỹ âm **quá** hạn mức | Chặn: *"… vượt hạn mức ứng"*, kèm số ngày còn xin được |
| Hai đơn ứng trong cùng tháng | Hạn mức tính trên **tổng** phần âm, không tính riêng từng đơn. Hạn mức 1 ngày thì ứng 0,5 + 0,5 là hết |
| Còn nợ giờ từ **tháng trước** | **Không ứng thêm** được, kể cả khi còn hạn mức — phải làm thêm bù hết phần nợ cũ trước |
| Đơn cho ngày thuộc **tháng đã qua** (nộp bù đầu tháng cho cuối tháng trước) | **Không được ứng** — quỹ phải đủ giờ. Ca cần thiết thì HR lập đơn thay |
| Sửa ngày một đơn ứng tháng trước sang tháng này | Vẫn bị tính là **nợ tháng trước** — sửa đơn không phải đường xoá nợ, kể cả nợ của đơn khác mà đơn đó đang "giữ chỗ" |
| Sửa **giảm** một đơn đã nộp (cùng ngày bắt đầu, ít ngày hơn — ví dụ cả ngày thành nửa ngày) | Luôn được, kể cả khi đang nợ hay đơn thuộc tháng đã qua — sửa giảm không làm nợ lớn thêm |
| Số ngày của đơn **tăng** sau khi nộp (kéo dài ngày về, bỏ ô *Half Day Date*, hoặc HR sửa lịch nghỉ làm một ngày nghỉ thành ngày làm) | Kiểm lại như một lần xin mới — kể cả lúc **quản lý bấm duyệt**: duyệt là tiêu thêm phần giờ chưa có. Bước HR duyệt được miễn như khi HR lập đơn thay |
| Người có hạn mức ứng **nộp đơn trễ** | Hạn nộp tính từ ngày nghỉ như phép thường — họ nộp được ngay bằng ứng trước, nên không được nới hạn vì "chờ làm thêm cho đủ giờ" |
| Sang tháng mà chưa bù xong | Nợ **không bị xoá**, treo sang tháng sau. Giờ làm thêm mới trả vào khoản nợ cũ nhất trước |
| HR lập đơn thay nhân viên | Không bị chặn (như trước), nhưng phần thiếu vẫn được ghi vào ô *Giờ Nghỉ bù ứng trước* |
| Hạn mức đổi giữa chừng | Áp theo dòng hiệu lực tại **ngày nghỉ** của đơn, không áp ngược cho đơn cũ |

Người duyệt thấy đơn ứng ngay trong hộp duyệt: dòng tóm tắt có thêm *"· ứng trước Xh"* — số giờ
quỹ **chưa có** cho đơn đó, tính **ngay lúc mở hộp duyệt** theo thứ tự **nộp đơn**: hai đơn cùng
tranh một phần giờ thì đơn nộp sau mới là đơn ứng. Làm thêm được duyệt sau khi nộp đơn sẽ làm con
số này giảm. Ô *Giờ Nghỉ bù ứng trước* trên đơn thì là con số **lúc nộp** (hoặc lần sửa ngày gần nhất).
Nhân viên thấy hạn mức của mình và số ngày còn xin được ở khung **Quỹ Nghỉ bù** khi chọn loại
*Nghỉ bù* trên ứng dụng.

### Hết năm vẫn còn nợ — chứng từ Quyết toán nợ Nghỉ bù {#quyet-toan}

Nợ còn lại tới **31/12** được quyết toán bằng chứng từ **Quyết toán nợ Nghỉ bù**
(`HR Comp Leave Settlement`, mở ở `/app/hr-comp-leave-settlement`). Chứng từ có hai mốc ngày:

| Mốc | Ý nghĩa |
|---|---|
| **Ngày cắt nợ** (31/12) | Chỉ tính nợ của đơn nghỉ và giờ làm thêm **tới hết ngày này**. Làm thêm tháng 1 không trả cho nợ năm cũ — giờ làm thêm tháng 12 được duyệt muộn sau ngày ghi sổ thì vào quỹ năm mới |
| **Ngày ghi sổ** (15/01) | Ngày trừ Phép năm, và là kỳ lương đọc phần Nghỉ không lương |

Chờ tới 15/01 mới ghi sổ để phiếu làm thêm tháng 12 kịp duyệt và có chấm công — không thì giờ
làm thêm cuối năm bị bỏ sót và Phép năm bị trừ oan.

Khi submit, chứng từ:

1. **Trừ vào Phép năm** đúng số giờ nợ, quy ra ngày theo 8 giờ = 1 ngày, **không làm tròn lên
   0,5**. Trừ trên phiếu cấp Phép năm **đang dùng ở ngày ghi sổ** (năm mới, đã gồm phần chuyển
   từ năm cũ) bằng một phiếu **Leave Adjustment** loại *Reduce*. Phép năm được cộng dần vào
   cuối mỗi tháng và chuyển hết sang năm sau, nên ngày 15/01 số phép trên phiếu năm mới chính là
   **số phép còn lại của năm cũ** — người đã nghỉ hết phép năm cũ thì toàn bộ nợ thành Nghỉ không
   lương. Nếu phiếu cấp Phép năm năm mới **chưa được tạo**, chứng từ dừng lại báo lỗi (không tự
   chuyển hết sang Nghỉ không lương) và đợt chạy đêm sau thử lại. Chỉ trừ phần Phép năm **chưa ai
   giữ**: các đơn Phép năm đã duyệt cho ngày phía sau (ví dụ nghỉ Tết) và các đơn đang chờ duyệt
   — kể cả đơn đã qua bước trưởng bộ phận — được chừa ra, để chúng vẫn duyệt và vẫn nghỉ được.
2. Phép năm **không đủ** thì phần còn lại ghi thành **Nghỉ không lương** (số ngày và số giờ)
   ngay trên chứng từ. Hiện chưa có phiếu lương chạy trong hệ thống, nên đây là **dữ liệu sẵn
   cho tính lương**: khi làm phần lương, kỳ lương chứa *Ngày ghi sổ* đọc chứng từ này để khấu
   trừ, rồi ghi tên phiếu lương vào ô *Phiếu lương đã khấu trừ* để không trừ hai lần.
3. Một phiếu **Điều chỉnh quỹ Nghỉ bù** cộng đúng số giờ nợ để xoá nợ khỏi quỹ. Giờ của phiếu
   này **chỉ trả cho đúng các khoản nợ được quyết toán** — huỷ một đơn đã quyết toán không biến
   thành giờ dùng cho đơn khác.

Số ngày trừ Phép năm tính **đúng tới từng phần trăm giờ**: phiếu trừ Phép năm (`Leave
Adjustment`) được đặt 5 chữ số lẻ. Ví dụ nợ 2,5 giờ: trừ đúng 0,3125 ngày phép, không có Nghỉ
không lương. Nghỉ không lương chỉ phát sinh khi Phép năm **không đủ**.

Chứng từ liệt kê **các khoản còn thiếu giờ** (đơn nghỉ, hoặc phiếu điều chỉnh trừ quỹ) để HR
đối chiếu.

Chỉ tính đơn Nghỉ bù **đã duyệt xong**; đơn còn chờ duyệt được coi như **chưa có** khi tính nợ
(nó có thể bị từ chối hay rút sau đó). Các đơn này được ghi vào ô *Chưa quyết toán (đơn còn chờ
duyệt)* để HR theo dõi; nếu sau đó được duyệt mà thiếu giờ thì phần nợ **ở lại quỹ** — HR lập
quyết toán tay.

**Ai lập:**

- **Cuối năm**: hệ thống tự lập và submit đêm **15/01** cho mốc 31/12; các đêm sau trong tháng 1
  chạy lại để bù nếu đêm đó lỡ. Đợt này gồm người có đơn Nghỉ bù và người bị **phiếu điều chỉnh
  trừ quỹ** đẩy xuống âm. Người **đã nghỉ việc** trước hoặc đúng 31/12 không nằm trong đợt này.
- **Quyết toán bổ sung**: đơn còn chờ duyệt lúc chạy, sau đó được duyệt mà thiếu giờ — HR lập
  thêm một chứng từ cùng *Ngày cắt nợ* 31/12. Chứng từ sau chỉ tính phần nợ **chưa** quyết toán,
  không trừ trùng.
- **Nhân viên nghỉ việc giữa năm**: HR lập tay, *Loại quyết toán* = *Nghỉ việc*, *Ngày cắt nợ* =
  ngày nghỉ việc. Các số tự tính khi lưu.

**Huỷ** chứng từ (chỉ **HR Manager** / **System Manager**; không ai tự huỷ chứng từ **của chính
mình** — trừ System Manager) là huỷ luôn phiếu trừ Phép năm và
phiếu xoá nợ: Phép năm được trả lại và **nợ quay lại quỹ** — giờ làm thêm mới sẽ trả dần, và đó là
nợ tháng trước nên người đó không ứng thêm được. Đợt chạy đêm sau **không tự lập lại** cho người
đó, để HR quyết: lập lại tay, hoặc **xoá nợ hẳn** bằng một phiếu *Điều chỉnh quỹ Nghỉ bù* cộng
đúng số giờ nợ. Huỷ chứng từ **không** tự xoá nợ. Chứng từ **nháp** bị bỏ (`Discard`) thì không
tính — đợt chạy đêm vẫn quyết toán người đó như thường.

**Trong kỳ đã quyết toán, không huỷ thẳng được đơn Nghỉ bù hay phiếu điều chỉnh trừ quỹ nào** —
kể cả đơn không nợ (riêng đơn đã bị **từ chối** thì huỷ được, vì nó không còn trong quỹ): huỷ một đơn cũ là nhả giờ của nó cho đơn đã quyết toán đứng sau, và Phép năm
hoá ra bị trừ oan. Hệ thống báo tên chứng từ quyết toán và yêu cầu huỷ chứng từ đó trước — Phép
năm được trả lại — rồi mới huỷ đơn, và lập lại quyết toán nếu còn nợ.

> Đơn nghỉ **vắt qua 31/12** (ví dụ 30/12 → 02/01) được tính trọn vào năm cũ theo ngày bắt đầu:
> phần thiếu giờ của cả đơn được quyết toán ở mốc 31/12.

> HRMS gốc chỉ cho **một** phiếu *Leave Adjustment* trên mỗi phiếu cấp Phép năm. Hệ thống nới
> luật đó cho phiếu do chứng từ quyết toán sinh ra, nên quyết toán bổ sung, quyết toán nghỉ việc
> và phiếu HR chỉnh tay cùng tồn tại được. Hai phiếu **chỉnh tay** trên cùng một phiếu cấp thì
> vẫn bị chặn như trước.

### Xem ai đang ứng

- Báo cáo **Quỹ giờ Nghỉ bù**: người đang ứng có số dư âm.
- Tab **Quỹ Nghỉ bù** trên hồ sơ nhân viên: hiện *"Đang ứng trước …h"* kèm hạn mức hiện tại,
  và tách riêng phần **nợ từ tháng trước**.
- Danh sách **Quyết toán nợ Nghỉ bù**: ai đã bị trừ Phép năm / ghi Nghỉ không lương, năm nào.

---

## 6. Đợt chốt số dư khi áp luật mới

Khi luật quỹ giờ lên hệ thống, những nhân viên từng được duyệt nhiều ngày hơn số giờ có sẽ
hiện ra **số âm**. Các đơn đó đều đã nghỉ xong nên không thu lại được; để nguyên thì giờ
làm thêm **mới** của họ bị trừ dần để trả phần chênh cũ.

Vì phần chênh sinh từ khâu duyệt chứ không phải từ nhân viên, hệ thống **tự xoá nợ** ngay
trong lần cập nhật: mỗi người đang âm nhận một chứng từ *Điều chỉnh quỹ Nghỉ bù* cộng đúng
phần âm, lý do ghi rõ `[chốt số dư trước khi áp luật quỹ giờ Nghỉ bù]`.

Đo trên dữ liệu ngày **14/09/2026**: **5 nhân viên**, tổng **32 giờ** (Lê Thị Kim Thanh 12
giờ, Lê Thị Kiều Hạnh 8 giờ, Lã Thị Thảo 4 giờ, Hoàng Minh Hiếu 4 giờ, Lê Hoàng Hiệp 4
giờ). Con số thật được đo lại vào đúng thời điểm cập nhật, không chép cứng — từ lúc đo tới
lúc chạy còn phát sinh phiếu mới.

> HR **không phải làm gì** cho đợt này. Sau khi cập nhật, kiểm lại danh sách chứng từ vừa
> sinh ở `HR Comp Leave Adjustment` để nắm ai được chốt bao nhiêu.

---

## 7. Hệ thống hành xử thế nào trong từng tình huống

Ba bảng dưới đây gom toàn bộ luật lại thành câu trả lời trực tiếp, để HR khỏi phải suy từ cơ
chế ra.

### 7.1 Khi giờ vào quỹ

| Tình huống | Hệ thống làm gì |
|---|---|
| Phiếu làm thêm quy đổi *Nghỉ bù* được **HR duyệt bước cuối**, ngày làm thêm **đã qua** | Ngày làm thêm trước 01/10/2026: giờ vào quỹ **ngay**. Từ 01/10/2026: giờ vào quỹ khi bảng chấm công ngày đó đã dựng xong, theo số giờ **đo được** |
| Phiếu được duyệt cho **ngày chưa tới** | Giờ **nằm chờ**. Tự vào quỹ khi qua ngày đó, không ai phải thao tác |
| Phiếu còn **chờ duyệt** — kể cả khi trưởng bộ phận đã duyệt, đang chờ HR | Chưa có giờ nào |
| Phiếu bị **từ chối** hoặc **huỷ duyệt** | Không vào quỹ; nếu đã vào thì rút ra ngay |
| Phiếu quy đổi **Tiền lương** | Không liên quan tới quỹ |
| Nhân viên **không chấm công** ngày làm thêm đó | Ngày làm thêm từ 01/10/2026: **không có giờ** vào quỹ. Trường hợp có làm thật nhưng mất dữ liệu chấm công thì HR cộng tay bằng `HR Comp Leave Adjustment` (mục 4). Ngày trước 01/10/2026: vẫn tính đủ số giờ đã duyệt |
| Nhiều phiếu **cùng một ngày** | Cộng dồn cả, mỗi phiếu là một lô riêng |
| Quỹ đang **âm**, nhân viên làm thêm tiếp | Giờ mới **trả nợ trước**, chỉ phần thừa mới dùng được |

### 7.2 Khi giờ ra khỏi quỹ

| Tình huống | Hệ thống làm gì |
|---|---|
| Nhân viên **nộp** đơn nghỉ bù | Trừ quỹ **ngay lúc nộp**, chưa cần duyệt — để người ta không nộp chồng nhiều đơn rồi cùng được duyệt |
| Đơn bị **từ chối** | Trả giờ lại quỹ |
| Nhân viên **tự thu hồi** đơn | Trả giờ lại quỹ |
| Đơn đã duyệt rồi **huỷ** | Trả giờ lại quỹ. Riêng đơn nằm trong kỳ **đã quyết toán** (mục 5) thì phải huỷ chứng từ quyết toán trước |
| **Sửa** ngày hoặc số ngày của đơn cũ | Kiểm lại quỹ, nhưng bỏ chính đơn đó ra khi đo để nó không tự chặn mình |
| Nghỉ **nửa ngày** | Trừ 4 giờ |
| Nghỉ đúng **ngày nửa buổi** (Thứ 7 khối văn phòng) | Trừ 4 giờ, dù có tick *nửa ngày* hay không |
| Đơn **vắt qua ngày lễ / Chủ Nhật** | Ngày nghỉ không bị tính, đơn trừ **ít giờ hơn** số ngày trên lịch |
| Đơn nghỉ **nhiều ngày** | Trừ `số ngày × 8` giờ, gom từ **nhiều** ngày làm thêm khác nhau |
| **Không đủ** giờ | Chặn ngay lúc lưu, báo rõ còn bao nhiêu và cần bao nhiêu — trừ khi nhân viên có hạn mức ứng trước (mục 5) |
| **HR** lập đơn thay nhân viên | **Miễn** kiểm quỹ — đường xử tay cho ca oan |
| Hai đơn nộp gần nhau, riêng lẻ thì đủ, cộng lại thì không | Đơn thứ hai **bị chặn** |
| Đơn đã duyệt xong mới phát hiện thiếu giờ | **Không** bị lật lại. Cân đối bằng chứng từ điều chỉnh số âm |

> **Máy tự chọn lô, nhân viên không chọn được.** Thứ tự: lô **sắp hết hạn trước** thì tiêu
> trước; cùng hạn thì lô có ngày làm thêm sớm hơn đi trước. Nhờ vậy giờ cũ luôn được dùng
> trước khi bị cắt.

### 7.3 Khi tới mốc hết hạn

| Tình huống | Hệ thống làm gì |
|---|---|
| Lô còn **dư giờ** ở mốc cắt | Cắt phần dư; phiếu làm thêm chuyển **Hết hạn** (`Expired`) |
| Lô đã **tiêu hết** | Giữ nguyên *Đã duyệt* — không dán nhãn hết hạn lên một ngày đã dùng xong |
| Lô tiêu **một phần** | Cắt phần dư, phiếu vẫn chuyển *Hết hạn* |
| Làm thêm **đúng ngày cắt** (30/06, 31/12) | Lô sống sang kỳ sau |
| Kỳ đã đóng mà hệ thống **chưa từng cắt** | Lô vẫn sống tới mốc kế tiếp. Quyền chỉ mất khi hệ thống thực sự cắt |
| Nghỉ trong kỳ nhưng **nộp đơn ở kỳ sau** | Vẫn ăn được lô của kỳ cũ — hôm đó nhân viên có quyền thật, chỉ nộp giấy muộn. Vẫn phải qua cửa hạn nộp đơn |
| Làm thêm tháng 12, **nộp đơn** tháng 12, **nghỉ** đầu tháng 1 | Vẫn ăn được lô tháng 12 |
| Huỷ một đơn nghỉ **sau khi** lô nó tiêu đã bị cắt | Giờ **không** quay lại. Lô đã đóng sổ |
| Đánh dấu *Hết hạn* có làm mất giờ làm thêm đã ghi không? | **Không.** Dữ liệu chấm công và giờ công nhận giữ nguyên |

---

## 8. Sự cố hay gặp {#su-co}

| Tình huống | Nguyên nhân / cách xử |
|---|---|
| Nhân viên báo *"Quỹ Nghỉ bù còn …h, chưa đủ để nghỉ … ngày"* | Đúng luật: 4 giờ mới đổi được 0,5 ngày. Kiểm phiếu làm thêm của họ đã duyệt chưa, và có chọn đúng hình thức *Nghỉ bù* không. Người này chưa có hạn mức ứng trước — xem mục 5 nếu cần cho ứng |
| Huỷ đơn Nghỉ bù báo *"… nằm trong kỳ đã quyết toán nợ Nghỉ bù"* | Đúng luật (mục 5): huỷ chứng từ quyết toán trước — Phép năm được trả lại — rồi huỷ đơn, và lập lại quyết toán nếu còn nợ |
| Chứng từ quyết toán báo *"chưa có phiếu cấp Phép năm phủ ngày ghi sổ"* | Phép năm năm mới chưa được cấp cho người đó. Cấp xong thì đợt chạy đêm sau (trong tháng 1) tự quyết toán lại |
| Nhân viên được ứng mà vẫn báo *"Còn nợ Nghỉ bù tháng trước"* | Đúng luật: còn nợ từ tháng trước thì không ứng thêm. Họ phải làm thêm bù hết phần nợ cũ, hoặc chỉ xin trong số giờ đang có |
| Làm thêm rồi mà quỹ vẫn 0 | Phiếu quy đổi *Tiền lương*; hoặc phiếu chưa duyệt; hoặc ngày làm thêm chưa tới; hoặc (từ 01/10/2026) ngày đó **không có chấm công** / bảng chấm công chưa dựng xong |
| Quỹ ít hơn số giờ đã khai | Phiếu bị **trần 4 giờ/ngày thường, 8 giờ/ngày nghỉ** cắt bớt; hoặc lô của kỳ trước đã hết hạn; hoặc (từ 01/10/2026) giờ **đo được từ chấm công** ít hơn số giờ đã khai — ví dụ check-out sớm hơn khung làm thêm |
| Quản lý không huỷ duyệt được phiếu làm thêm | Huỷ sẽ rút giờ khỏi quỹ và làm nhân viên âm so với đơn nghỉ đã nộp. Huỷ đơn nghỉ trước, hoặc HR cộng bù bằng chứng từ điều chỉnh |
| Nhân viên nghỉ rồi mới phát hiện thiếu giờ | Đơn đã duyệt không bị kiểm lại (cố ý, để còn huỷ/sửa được). Cân đối bằng chứng từ điều chỉnh số âm |
| Cần cho nghỉ dù quỹ không đủ | Nếu là nhu cầu thường xuyên của cả nhóm (làm ca, trực), khai **hạn mức ứng trước** (mục 5). Ca lẻ: HR tạo đơn **thay cho nhân viên** trên Desk — vai trò HR được miễn kiểm quỹ khi lập đơn cho người khác. Nên kèm một chứng từ điều chỉnh để sổ không âm |
| Lập — hoặc **huỷ** — phiếu điều chỉnh cho **chính mình** bị chặn | Đúng luật (lập: từ 23/09/2026; huỷ cũng vậy — huỷ phiếu trừ quỹ là tự xoá nợ): mỗi lần chỉnh tay quỹ đều cần người thứ hai biết. Nhờ một người HR khác |
| Quản lý bấm duyệt đơn Nghỉ bù mà báo quỹ thiếu / vượt hạn mức ứng | Số ngày của đơn đã **tăng** sau lúc nộp (ví dụ lịch nghỉ của nhân viên vừa được sửa). Duyệt là tiêu thêm giờ chưa có nên bị kiểm lại (mục 5) — từ chối đơn, hoặc HR lập lại đơn thay |
| Lưu đơn báo *"Đơn đang ở bước … nên không thể mang trạng thái …"* | Đơn đã bị từ chối / rút / huỷ mà ai đó đổi trạng thái về *Approved* hay *Open*. Đơn đã đóng không mở lại được — nộp đơn mới |
| Phép năm của nhân viên có số lẻ (11,88…) sau giữa tháng 1 | Đã bị quyết toán nợ ứng trước — trừ đúng số giờ nợ (mục 5). Bình thường |
| Người làm HR tự nộp đơn nghỉ bù mà bị chặn thiếu giờ | Đúng luật từ 21/09/2026: miễn trừ chỉ áp khi lập đơn **cho người khác**. Tự nghỉ thì phải có giờ trong quỹ như mọi nhân viên — nhờ một người HR khác lập hộ, hoặc cộng giờ bằng chứng từ điều chỉnh có lý do rõ ràng |

---

## Liên quan
- 📘 [Hành trình một ngày Nghỉ bù](Hanh-Trinh-Nghi-Bu.html) — góc nhìn nhân viên
- 🔁 [Hành trình một phiếu Làm thêm giờ](Hanh-Trinh-OT.html) — cách giờ được duyệt và đối chiếu
- 🔧 [HR Overtime Request](HR-Overtime-Request.html) — chi tiết phiếu làm thêm
- 🗂️ [Loại phép & cấu hình](HR-Leave-Type.html) · [Điều chỉnh số dư phép](Desk-HR-DieuChinhSoDuPhep.html)
- 🧪 Kỹ thuật: [Nghỉ bù — Sổ giờ](../tech/HR-Comp-Leave-Ledger.html) — đặc tả đầy đủ thuật toán phân bổ, hạn dùng và các chốt chặn
