---
title: "Có gì mới — đợt 11/2026"
layout: default
parent: Chấm công & HR
nav_order: 5.5
---

# Chấm công — có gì mới (đợt 11/2026)
{: .no_toc }

Đơn chấm công cho hôm nay được tính công khi duyệt, các đơn bị huỷ vì luật cũ được khôi phục, thông báo huỷ đơn nói đúng việc cần làm, và bảng công có cột Số công không đếm trùng với quỹ Nghỉ bù
{: .fs-3 .text-grey-dk-000 }

<details open markdown="block">
  <summary>Mục lục</summary>
{: .text-delta }
1. TOC
{:toc}
</details>

---

## Tóm tắt

| # | Thay đổi | Ai thấy khác biệt | Đọc thêm |
|---|---|---|---|
| ① | Đơn chấm công bù / công tác / WFH nộp cho **chính hôm nay** được **tính công khi duyệt**, không cần lần chấm công — như đơn khai bù. Chỉ đơn **xin trước cho ngày tới** mới phải có lần chấm công | Nhân viên hiện trường, người duyệt | [Hành trình một Đề xuất chấm công bù](Hanh-Trinh-Cham-Cong-Bu.html) · [Quên chấm công hôm nay](Guide-NhanVien-ChamCongNgoai.html#quen-cham-cong-hom-nay) |
| ② | Các đơn nộp trong ngày mà hệ thống đã huỷ theo luật cũ được **khôi phục**, ngày đó có công lại; nhân viên nhận thông báo | Nhân viên từng bị gỡ công | Mục ② bên dưới |
| ③ | Thông báo *"Ngày … không được tính công"* nói **liên hệ HR** khi ngày đó đã quá hạn nộp, thay vì *"nộp khai bù được ngay"* | Nhân viên hiện trường | Mục ③ bên dưới |
| ④ | Bảng công có cột **Số công**: Thứ 7 nửa buổi đi làm = **0,5** (`P:2`), Chủ nhật / lễ đi làm = **0** (`P0`) — giờ làm thêm đã vào quỹ Nghỉ bù thì không đếm thành công nữa; cột *Tổng giờ chuẩn* không còn cộng trọn ca cho Chủ nhật. Thêm cột **Nghỉ hưởng lương** (phép có lương, ngày lễ) và **Tổng công** = Số công + Nghỉ hưởng lương — **lập lương từ Tổng công** | HR lập bảng lương, kế toán | Mục ④ bên dưới · [Bảng công tháng](Desk-HR-BangCongThang.html) |

---

## ① Đơn cho hôm nay là đơn khai bù, không còn là giấy phép

Từ 09/2026, đơn chấm công nộp cho hôm nay hoặc ngày tới chỉ mở quyền chấm công ngoài văn phòng; ngày
đó không có lần chấm công nào thì bị gỡ công (xem [đợt 09/2026 mục ④](Cham-Cong-Co-Gi-Moi-09-2026.html)).
Trên thực tế, người quên chấm công thường lập đơn ngay trong ngày — và đơn đó rơi vào luật giấy phép,
sáng hôm sau mất công, rồi lại quá hạn nộp để khai bù.

Từ 03/11/2026, ranh giới đặt ở **ngày nộp đơn**:

| Ngày trong đơn so với ngày nộp | Loại | Điều kiện để có công |
|---|---|---|
| **Sau** ngày nộp (xin trước cho ngày tới) | Giấy phép chấm công ngoài văn phòng | Được duyệt **và** có ít nhất một lần chấm công trong ngày |
| **Bằng** ngày nộp (đơn cho hôm nay) | Khai bù | Được duyệt, trong hạn mức tháng |
| **Trước** ngày nộp (khai bù ngày đã qua) | Khai bù | Được duyệt, trong hạn mức tháng, trong hạn nộp |

Một đơn phủ nhiều ngày thì **mỗi ngày xét riêng**: đơn nộp hôm nay cho hôm nay và mai thì hôm nay có
công khi duyệt, còn ngày mai vẫn phải có lần chấm công.

Phanh của đường khai bù không đổi: **hạn mức số ngày mỗi tháng** (đếm mọi ngày trong đơn, kể cả đơn
chờ duyệt), **hạn nộp** và quyết định của người duyệt. Người duyệt vì vậy đọc đơn cho hôm nay như đọc
một đơn khai bù: lý do có thuyết phục không, tháng này đã khai mấy ngày.

Trên ứng dụng, form Đề xuất chỉ còn cảnh báo *"phải có lần chấm công"* khi khoảng ngày có **ngày tới**;
gợi ý *"Quên chấm công hôm nay? Gửi đơn cho hôm nay là được"* thay cho lời dặn cũ *"đừng gửi đơn này"*.

## ② Khôi phục các đơn đã bị huỷ vì nộp trong ngày

Các đơn nộp trong ngày mà hệ thống đã gỡ công rồi huỷ (dòng *Huỷ bởi: Hệ thống*, lý do *không có lần
chấm công nào trong ngày …*) được **khôi phục** khi đưa bản này lên hệ thống:

- Hệ thống lập **bản sửa** của đơn cũ (tên đơn cũ thêm hậu tố `-1`, ô *Amended From* trỏ về đơn cũ),
  duyệt luôn, giữ nguyên tên người đã duyệt ban đầu. Ngày đó có công lại; hai đơn ghi chú trỏ sang
  nhau để tra cứu.
- Chỉ khôi phục **ngày từ đầu đơn tới ngày nộp**. Đơn nộp hôm 15 cho 15–16 thì chỉ ngày 15 có công
  lại; ngày 16 là ngày xin trước, không có lần chấm công thì vẫn không có công.
- **Không** khôi phục: đơn do **người** huỷ (trưởng bộ phận, HR) — đó là quyết định có chủ đích; ngày
  mà bản công bị người gỡ tay; ngày đã có công từ nguồn khác, đã có đơn khác hoặc đơn nghỉ đã duyệt;
  ngày nằm trong phiếu lương đã duyệt; và đơn làm **vượt hạn mức tháng** nếu tính lại. Những đơn này
  giữ nguyên trạng thái đã huỷ, HR xử lý thủ công nếu cần.
- Nhân viên nhận thông báo *"Ngày … đã được tính công lại"* ở lần chạy 02:20 kế tiếp, mỗi đơn một
  lần, nói rõ không cần nộp lại đơn. Người duyệt không nhận thông báo (chuyện cũ dồn một lúc).

Đơn đã khôi phục hiện ở màn **Đơn bù → Đã duyệt** của ứng dụng; đơn cũ vẫn nằm ở tab **Đã hủy** kèm
ghi chú *"Hệ thống đã khôi phục phiếu này thành …"*.

## ③ Thông báo huỷ đơn nói đúng việc cần làm

Khi hệ thống huỷ một đơn xin trước vì ngày đó không có lần chấm công, thông báo cho nhân viên nay
kiểm tra **hạn nộp đơn khai bù** của công ty trước khi hướng dẫn:

- Ngày đó **còn trong hạn nộp** → *"gửi đơn khai bù cho ngày đó được ngay"*.
- Ngày đó **đã quá hạn** → *"liên hệ HR để được khai bù thay"* — HR lập đơn thay thì không bị hạn nộp
  và không tính vào hạn mức của nhân viên.
- Đơn nhiều ngày lẫn cả hai → liệt kê rõ ngày nào đã quá hạn.

Trước đây thông báo luôn ghi *"nộp được ngay"*, nhân viên làm theo thì bị chặn *Quá hạn nộp đơn chấm
công*.

## ④ Bảng công: cột Số công, Thứ 7 nửa buổi = 0,5, Chủ nhật = 0

Nhân viên phát hiện: ngày Thứ 7 nửa buổi ở lại cả ngày và Chủ nhật đi làm đều có bản ghi *có mặt*,
bảng công in **`P`**, HR đếm mỗi `P` = **1 công** — trong khi buổi chiều Thứ 7 (4 giờ) và cả ngày Chủ
nhật (8 giờ) đã được khai làm thêm và vào **quỹ Nghỉ bù**. Khi dùng quỹ đó nghỉ, ngày nghỉ lại được
tính công lần nữa: **cộng hai lần**.

Dữ liệu gốc không sai — bản ghi *có mặt* ngày Chủ nhật phải tồn tại vì phiếu làm thêm đọc giờ thực từ
đó, và quỹ Nghỉ bù cộng đúng. Sai ở cách bảng công **đọc** bản ghi đó. Luật chốt:

> Giờ làm thêm quy đổi Nghỉ bù **không tính công**, chỉ cộng quỹ. Ngày khác **dùng quỹ** mới tính công.
> Phần giờ chuẩn của ngày đó vẫn tính công: Thứ 7 nửa buổi = 0,5 (buổi sáng), Chủ nhật / lễ = 0.

Từ đợt này `COBE HR Attendance Sheet`:

- Thêm cột **Số công** = công làm việc đã quy đổi theo loại ngày của từng nhân viên (ngày thường 1,
  nửa buổi 0,5, nghỉ trọn 0; nửa ngày công bằng một nửa số đó). Không gồm nghỉ phép.
- Thêm cột **Nghỉ hưởng lương** = ngày không đi làm nhưng vẫn được trả lương: phép có lương trọn ngày
  1 (Thứ 7 nửa buổi 0,5), nửa ngày 0,5, ngày lễ 1; nghỉ không lương / BHXH 0. Ngày **dùng quỹ Nghỉ
  bù** được tính công ở đây — đúng vế sau của luật trên.
- Thêm cột **Tổng công** = Số công + Nghỉ hưởng lương. **Lập bảng lương từ cột này**, không từ Số công
  (Số công một mình thiếu toàn bộ ngày nghỉ có lương).
- Ô ngày có mặt mang hậu tố theo loại ngày: **`P:2`** (nửa buổi), **`P0`** (Chủ nhật / lễ, màu xám);
  Thứ 7 nửa buổi không có bản chấm công hiện **`-`** (đỏ, không có dữ liệu) như ngày thường, thay vì `H`:
  buổi sáng là buổi làm việc, không phải ngày lễ. Dấu `:` đọc là **chia** (P chia 2 =
  nửa công); `0` là không tính công. Bản phát hành đầu dùng `P/2` / `P/0`, nhìn dễ lẫn nhau và lẫn với
  ký hiệu phép nửa ngày (`L/2`, `NB/2`) nên đã đổi.
- **Tổng giờ chuẩn** = Số công × giờ chuẩn ca; Chủ nhật có mặt không còn cộng trọn ca.
- Nghỉ phép nửa ngày mà nửa còn lại **vắng** (không có lần chấm công) không còn được cộng nửa công.
- Chế độ **Tổng hợp** (bảng gốc HRMS) in sẵn lời nhắc: *Total Present* đếm bản ghi, không phải số công; lập lương lấy **Tổng công**.

Chi tiết cách đọc: [Bảng công tháng §0 và §5](Desk-HR-BangCongThang.html); luật công và quỹ:
[Hành trình một ngày Nghỉ bù — Giờ làm thêm và số công](Hanh-Trinh-Nghi-Bu.html#so-cong).

---

## Khi đưa lên hệ thống

- **Deploy rồi chạy `bench migrate`.** Migrate chạy patch `v0_057` khôi phục các đơn ở mục ②. Ứng dụng
  chấm công cũng phải lên bản build mới để form Đề xuất hiện đúng lời hướng dẫn (mục ①).
- **Thông báo khôi phục** gửi ở lần chạy job 02:20 **đầu tiên sau migrate**; HR nên báo trước cho trưởng
  bộ phận rằng một số đơn họ từng thấy bị huỷ sẽ xuất hiện lại dưới dạng bản sửa `-1`, đã duyệt.
- **Xem lại danh sách đơn không được khôi phục** (Error Log hoặc kết quả in ra của patch) để xử lý
  thủ công các ngày nhân viên có đi làm thật.
- **Nhắc nhân viên hiện trường**: quên chấm công thì lập đơn **ngay trong ngày** là được; chỉ đơn xin
  trước cho ngày mai mới cần chấm công tại nơi làm.
- **HR rà lại các tháng đã trả lương** (từ 07/2026) theo luật ở mục ④: ngày Thứ 7 nửa buổi và Chủ nhật
  / lễ có bản ghi *có mặt* — nếu bảng lương đã đếm 1 công thì điều chỉnh. Xuất từ `COBE HR Attendance
  Sheet` bản mới, lọc ô `P:2`, `P0`. Cũng xem những ngày Thứ 7 có đơn làm thêm buổi chiều được duyệt
  nhưng chấm công cho thấy về trưa.
- **Bảng công không cần migrate** — report đọc từ mã nguồn; chỉ cần deploy và xoá cache.

---

## Liên quan

- [Chấm công ngoài VP & Đề xuất chấm công bù](Guide-NhanVien-ChamCongNgoai.html) · [KTV hiện trường](Guide-KTV-ChamCong.html)
- [Hành trình một Đề xuất chấm công bù](Hanh-Trinh-Cham-Cong-Bu.html) · [Duyệt chấm công bù](Duyet-Cham-Cong-Bu.html)
- [Hạn mức ngày khai bù](Desk-HR-HanMucChamCongBu.html) · [Đơn chấm công bù (Attendance Request)](HR-Attendance-Request.html)
- [Bảng công tháng (COBE HR Attendance Sheet)](Desk-HR-BangCongThang.html) · [Hành trình một ngày Nghỉ bù](Hanh-Trinh-Nghi-Bu.html)
- [Có gì mới — đợt 10/2026](Cham-Cong-Co-Gi-Moi-10-2026.html) · [Có gì mới — đợt 09/2026](Cham-Cong-Co-Gi-Moi-09-2026.html)
