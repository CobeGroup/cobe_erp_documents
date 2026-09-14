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

> **Quỹ này không phải Leave Allocation.** Loại phép *Nghỉ bù* (`Leave Type`) vẫn bật cờ
> `allow_negative` và không có cấp phép, nên trên Desk số dư của loại này hiện **âm**. Con
> số âm đó chỉ có nghĩa "đã nghỉ bù bấy nhiêu ngày", không phải nhân viên đang nợ. Quỹ
> thật là thứ mô tả ở trang này.

### Giờ nào vào quỹ

Một phiếu làm thêm (`HR Overtime Request`) cộng vào quỹ khi đủ **cả ba** điều kiện:

1. Hình thức quy đổi là **Nghỉ bù** (không phải *Tiền lương*).
2. Trạng thái **Đã duyệt** (`Approved`).
3. **Ngày làm thêm đã tới** — phiếu khai trước cho ngày chưa làm vẫn nằm chờ.

Số giờ vào quỹ là **số giờ được duyệt** trên phiếu (`expected_hours`), không phải số giờ
đối chiếu được từ chấm công. Lý do: bảng chấm công dựng bằng tác vụ nền, đòi giờ có bằng
chứng là bắt nhân viên chờ qua đêm mới xin nghỉ được. Việc xác minh nhân viên có thực sự
làm thêm hay không thuộc về **khâu duyệt phiếu**, không thuộc về quỹ.

---

## 2. Xem quỹ của một nhân viên

**Nhân viên** tự xem trên ứng dụng: tab **Nghỉ phép** → chọn loại phép *Nghỉ bù*. Màn hình
hiện số giờ còn lại, số ngày đổi được, và từng lô giờ kèm hạn dùng.

**HR** xem trên Desk theo hai bảng:

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

**Chạy tay khi cần:** hàm `expire_comp_leave.run_now` mặc định chỉ chạy đúng hai mốc cuối
kỳ. Muốn đóng bù một kỳ đã lỡ thì phải truyền `force=1` — chốt chặn này cố ý, vì chạy lệch
mốc là quét sạch quỹ của cả kỳ đang chạy và không có đường hoàn.

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

## 6. Sự cố hay gặp

| Tình huống | Nguyên nhân / cách xử |
|---|---|
| Nhân viên báo *"Quỹ Nghỉ bù còn …h, chưa đủ để nghỉ … ngày"* | Đúng luật: 4 giờ mới đổi được 0,5 ngày. Kiểm phiếu làm thêm của họ đã duyệt chưa, và có chọn đúng hình thức *Nghỉ bù* không |
| Làm thêm rồi mà quỹ vẫn 0 | Phiếu quy đổi *Tiền lương*; hoặc phiếu chưa duyệt; hoặc ngày làm thêm chưa tới |
| Quỹ ít hơn số giờ đã khai | Phiếu bị **trần 4 giờ/ngày thường, 8 giờ/ngày nghỉ** cắt bớt; hoặc lô của kỳ trước đã hết hạn |
| Quản lý không huỷ duyệt được phiếu làm thêm | Huỷ sẽ rút giờ khỏi quỹ và làm nhân viên âm so với đơn nghỉ đã nộp. Huỷ đơn nghỉ trước, hoặc HR cộng bù bằng chứng từ điều chỉnh |
| Nhân viên nghỉ rồi mới phát hiện thiếu giờ | Đơn đã duyệt không bị kiểm lại (cố ý, để còn huỷ/sửa được). Cân đối bằng chứng từ điều chỉnh số âm |
| Cần cho nghỉ dù quỹ không đủ | HR tạo đơn thay trên Desk — vai trò HR được miễn kiểm quỹ. Nên kèm một chứng từ điều chỉnh để sổ không âm |

---

## Liên quan
- 📘 [Hành trình một ngày Nghỉ bù](Hanh-Trinh-Nghi-Bu.html) — góc nhìn nhân viên
- 🔁 [Hành trình một phiếu Làm thêm giờ](Hanh-Trinh-OT.html) — cách giờ được duyệt và đối chiếu
- 🔧 [HR Overtime Request](HR-Overtime-Request.html) — chi tiết phiếu làm thêm
- 🗂️ [Loại phép & cấu hình](HR-Leave-Type.html) · [Điều chỉnh số dư phép](Desk-HR-DieuChinhSoDuPhep.html)
