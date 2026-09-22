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

Số giờ vào quỹ là **số giờ được duyệt** trên phiếu (`expected_hours`), không phải số giờ
đối chiếu được từ chấm công. Lý do: bảng chấm công dựng bằng tác vụ nền, đòi giờ có bằng
chứng là bắt nhân viên chờ qua đêm mới xin nghỉ được. Việc xác minh nhân viên có thực sự
làm thêm hay không thuộc về **khâu duyệt phiếu**, không thuộc về quỹ.

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
xuống âm, hệ thống báo ngay lúc Submit.

**Khi nào dùng:**

- Nhân viên làm thêm thật nhưng mất bằng chứng chấm công, có quản lý bảo lãnh.
- Phát hiện duyệt lố, cần thu lại giờ đã cấp.
- Chốt số dư sau tranh chấp, hoặc cấp bù theo thoả thuận riêng.

---

## 5. Đợt chốt số dư khi áp luật mới

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

## 6. Hệ thống hành xử thế nào trong từng tình huống

Ba bảng dưới đây gom toàn bộ luật lại thành câu trả lời trực tiếp, để HR khỏi phải suy từ cơ
chế ra.

### 6.1 Khi giờ vào quỹ

| Tình huống | Hệ thống làm gì |
|---|---|
| Phiếu làm thêm quy đổi *Nghỉ bù* được **HR duyệt bước cuối**, ngày làm thêm **đã qua** | Giờ vào quỹ **ngay**, dùng được liền |
| Phiếu được duyệt cho **ngày chưa tới** | Giờ **nằm chờ**. Tự vào quỹ khi qua ngày đó, không ai phải thao tác |
| Phiếu còn **chờ duyệt** — kể cả khi trưởng bộ phận đã duyệt, đang chờ HR | Chưa có giờ nào |
| Phiếu bị **từ chối** hoặc **huỷ duyệt** | Không vào quỹ; nếu đã vào thì rút ra ngay |
| Phiếu quy đổi **Tiền lương** | Không liên quan tới quỹ |
| Nhân viên **không chấm công** ngày làm thêm đó | **Vẫn tính đủ** số giờ đã duyệt. Xác minh có làm thật hay không là việc của khâu duyệt phiếu |
| Nhiều phiếu **cùng một ngày** | Cộng dồn cả, mỗi phiếu là một lô riêng |
| Quỹ đang **âm**, nhân viên làm thêm tiếp | Giờ mới **trả nợ trước**, chỉ phần thừa mới dùng được |

### 6.2 Khi giờ ra khỏi quỹ

| Tình huống | Hệ thống làm gì |
|---|---|
| Nhân viên **nộp** đơn nghỉ bù | Trừ quỹ **ngay lúc nộp**, chưa cần duyệt — để người ta không nộp chồng nhiều đơn rồi cùng được duyệt |
| Đơn bị **từ chối** | Trả giờ lại quỹ |
| Nhân viên **tự thu hồi** đơn | Trả giờ lại quỹ |
| Đơn đã duyệt rồi **huỷ** | Trả giờ lại quỹ |
| **Sửa** ngày hoặc số ngày của đơn cũ | Kiểm lại quỹ, nhưng bỏ chính đơn đó ra khi đo để nó không tự chặn mình |
| Nghỉ **nửa ngày** | Trừ 4 giờ |
| Nghỉ đúng **ngày nửa buổi** (Thứ 7 khối văn phòng) | Trừ 4 giờ, dù có tick *nửa ngày* hay không |
| Đơn **vắt qua ngày lễ / Chủ Nhật** | Ngày nghỉ không bị tính, đơn trừ **ít giờ hơn** số ngày trên lịch |
| Đơn nghỉ **nhiều ngày** | Trừ `số ngày × 8` giờ, gom từ **nhiều** ngày làm thêm khác nhau |
| **Không đủ** giờ | Chặn ngay lúc lưu, báo rõ còn bao nhiêu và cần bao nhiêu |
| **HR** lập đơn thay nhân viên | **Miễn** kiểm quỹ — đường xử tay cho ca oan |
| Hai đơn nộp gần nhau, riêng lẻ thì đủ, cộng lại thì không | Đơn thứ hai **bị chặn** |
| Đơn đã duyệt xong mới phát hiện thiếu giờ | **Không** bị lật lại. Cân đối bằng chứng từ điều chỉnh số âm |

> **Máy tự chọn lô, nhân viên không chọn được.** Thứ tự: lô **sắp hết hạn trước** thì tiêu
> trước; cùng hạn thì lô có ngày làm thêm sớm hơn đi trước. Nhờ vậy giờ cũ luôn được dùng
> trước khi bị cắt.

### 6.3 Khi tới mốc hết hạn

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

## 7. Sự cố hay gặp

| Tình huống | Nguyên nhân / cách xử |
|---|---|
| Nhân viên báo *"Quỹ Nghỉ bù còn …h, chưa đủ để nghỉ … ngày"* | Đúng luật: 4 giờ mới đổi được 0,5 ngày. Kiểm phiếu làm thêm của họ đã duyệt chưa, và có chọn đúng hình thức *Nghỉ bù* không |
| Làm thêm rồi mà quỹ vẫn 0 | Phiếu quy đổi *Tiền lương*; hoặc phiếu chưa duyệt; hoặc ngày làm thêm chưa tới |
| Quỹ ít hơn số giờ đã khai | Phiếu bị **trần 4 giờ/ngày thường, 8 giờ/ngày nghỉ** cắt bớt; hoặc lô của kỳ trước đã hết hạn |
| Quản lý không huỷ duyệt được phiếu làm thêm | Huỷ sẽ rút giờ khỏi quỹ và làm nhân viên âm so với đơn nghỉ đã nộp. Huỷ đơn nghỉ trước, hoặc HR cộng bù bằng chứng từ điều chỉnh |
| Nhân viên nghỉ rồi mới phát hiện thiếu giờ | Đơn đã duyệt không bị kiểm lại (cố ý, để còn huỷ/sửa được). Cân đối bằng chứng từ điều chỉnh số âm |
| Cần cho nghỉ dù quỹ không đủ | HR tạo đơn **thay cho nhân viên** trên Desk — vai trò HR được miễn kiểm quỹ khi lập đơn cho người khác. Nên kèm một chứng từ điều chỉnh để sổ không âm |
| Lập phiếu điều chỉnh cho **chính mình** bị chặn | Đúng luật từ 23/09/2026: mỗi lần chỉnh tay quỹ đều cần người thứ hai biết. Nhờ một người HR khác lập giúp |
| Người làm HR tự nộp đơn nghỉ bù mà bị chặn thiếu giờ | Đúng luật từ 21/09/2026: miễn trừ chỉ áp khi lập đơn **cho người khác**. Tự nghỉ thì phải có giờ trong quỹ như mọi nhân viên — nhờ một người HR khác lập hộ, hoặc cộng giờ bằng chứng từ điều chỉnh có lý do rõ ràng |

---

## Liên quan
- 📘 [Hành trình một ngày Nghỉ bù](Hanh-Trinh-Nghi-Bu.html) — góc nhìn nhân viên
- 🔁 [Hành trình một phiếu Làm thêm giờ](Hanh-Trinh-OT.html) — cách giờ được duyệt và đối chiếu
- 🔧 [HR Overtime Request](HR-Overtime-Request.html) — chi tiết phiếu làm thêm
- 🗂️ [Loại phép & cấu hình](HR-Leave-Type.html) · [Điều chỉnh số dư phép](Desk-HR-DieuChinhSoDuPhep.html)
- 🧪 Kỹ thuật: [Nghỉ bù — Sổ giờ](../tech/HR-Comp-Leave-Ledger.html) — đặc tả đầy đủ thuật toán phân bổ, hạn dùng và các chốt chặn
