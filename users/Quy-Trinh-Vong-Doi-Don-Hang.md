---
title: Vòng đời một đơn hàng
layout: default
parent: Quy trình hợp nhất
nav_order: 5
---

# Vòng đời một đơn hàng
{: .no_toc }

Một đơn hàng đi qua nhiều bộ phận. Trang này bám theo **một đơn duy nhất** từ lúc lập cho tới
lúc hệ thống sinh lịch bảo dưỡng cho kỳ sau, để thấy các phần việc nối vào nhau ở chỗ nào.
{: .fs-3 .text-grey-dk-000 }

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1. Mười mốc của một đơn hàng
{: #muoi-moc }

Ví dụ theo dõi: một đơn lắp đặt máy lọc tổng, khách hàng đặt cọc bằng chuyển khoản, trả phần
lớn bằng tiền mặt tại nhà, phần còn lại chuyển khoản.

<div style="position:relative;width:100%;padding-bottom:109.11%">
  <object type="image/svg+xml" data="images/svg/quy-trinh/10-vong-doi-don-hang.svg" style="position:absolute;inset:0;width:100%;height:100%;border:0">
    <img src="images/svg/quy-trinh/10-vong-doi-don-hang.svg" alt="Mười mốc xếp theo chiều dọc của một đơn hàng, hoàn thành trong bốn ngày. Cột bên trái là mốc, việc được thực hiện và chứng từ sinh ra. Cột bên phải là hệ quả của mốc đó đối với tồn kho, công nợ và trạng thái đơn. Sau mốc cuối cùng, hệ thống sinh lịch bảo dưỡng cho kỳ kế tiếp và lịch này sẽ mở ra một đơn hàng mới, khép lại vòng lặp" style="width:100%;height:auto">
  </object>
</div>

👆 **Bấm vào từng mốc** để mở phần hướng dẫn chi tiết của mốc đó.
{: .fs-3 }

Ba điều cần đọc ra từ sơ đồ:

1. **Cột trái là trình tự bắt buộc.** Không mốc nào được phép đứng trước mốc trên nó — hệ thống
   chặn, không phụ thuộc thói quen làm việc.
2. **Cột phải cho biết mốc đó đổi cái gì.** Nhiều mốc không đổi tồn kho hay công nợ; chúng chỉ
   ghi nhận thông tin điều hành.
3. **Đường đứt nét bên trái là vòng lặp.** Đơn xong không có nghĩa là hết việc với khách hàng.

---

## 2. Ba nghĩa vụ chạy song song
{: #nghia-vu }

Trong cùng một đơn có **ba món nợ khác nhau** cùng tồn tại. Đây là chỗ khó theo dõi nhất, và
cũng là nguyên nhân của hầu hết các trường hợp chứng từ không kết thúc được.

| | Nghĩa vụ giao hàng | Nghĩa vụ trả vật tư | Nghĩa vụ nộp tiền |
|---|---|---|---|
| **Phát sinh khi** | Đơn được xác nhận | Kho xuất vật tư cho kỹ thuật viên | Kỹ thuật viên thu tiền mặt |
| **Ai gánh** | Bộ phận dịch vụ | Kỹ thuật viên | Kỹ thuật viên |
| **Nội dung** | Còn món nào chưa giao | Còn món nào nhận mà chưa dùng, chưa trả | Còn giữ bao nhiêu tiền của công ty |
| **Xoá bằng** | Phiếu giao hàng | Phiếu trả vật tư **được kho duyệt** | Phiếu nộp tiền **được kế toán xác nhận** |
| **Chưa xoá thì** | Không thu được tiền, không xuất được hoá đơn | Phiếu công việc có thể bị chặn | Phiếu công việc bị chặn |
| **Phiếu nháp có tính không** | — | **Không** | **Không** |

> ⚠️ **Hai dòng cuối là chỗ hay mắc.** Kỹ thuật viên đã lập phiếu trả vật tư và phiếu nộp tiền,
> nhìn trên ứng dụng tưởng đã xong, nhưng cả hai còn ở trạng thái **nháp** vì chưa ai duyệt.
> Hệ thống chỉ tính chứng từ đã được xác nhận.

---

## 3. Ba ô trạng thái trên đơn
{: #trang-thai }

Trên đơn bán hàng có ba ô trạng thái. Nhìn mỗi ô cuối là hay kết luận sai.

| Ô | Cho biết | Đổi khi |
|---|---|---|
| **Tình trạng giao hàng** | Đã giao hết số món chưa | Phiếu giao hàng được xác nhận |
| **Tình trạng hoá đơn** | Đã xuất hoá đơn hết giá trị chưa | Hoá đơn được xác nhận |
| **Trạng thái đơn** | Kết luận chung | Hệ thống tự tính từ hai ô trên |

Đơn chỉ sang **Hoàn tất** khi cả hai ô đầu đều đủ. Vì vậy một đơn đã giao hàng đầy đủ, khách
hàng đã nhận đủ, vẫn có thể nằm ở *Chờ giao hàng và chờ hoá đơn* chỉ vì một phiếu thu chuyển
khoản còn ở trạng thái nháp.

---

## 4. Khi đơn đi lệch khỏi mạch chuẩn
{: #nhanh-re }

Không phải đơn nào cũng đi đủ mười mốc. Các nhánh rẽ thường gặp:

| Tình huống | Đơn đi hướng nào | Đọc ở đâu |
|---|---|---|
| Đơn chỉ bán hàng, không cần xuống hiện trường | Không có phiếu công việc; giao thẳng hoặc gửi qua đơn vị vận chuyển | [phân khu C](Quy-Trinh-C-Kho-Giao-Nhan.html#gui-van-chuyen) |
| Khách hàng chỉ nhận một phần hàng | Phiếu giao hàng ghi số thực giao; phần chênh thành nghĩa vụ trả vật tư | [phân khu C](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| Khách hàng trả tiền làm nhiều lần | Mỗi lần một phiếu thu; đơn chỉ hoàn tất khi tổng đủ | [phân khu D](Quy-Trinh-D-Thu-Tien.html#hinh-thuc) |
| Khách hàng đổi ý, không mua nữa | Đóng đơn hoặc huỷ đơn theo trình tự huỷ ngược | [phân khu A](Quy-Trinh-A-Ban-Hang.html#sua-don) |
| Kỹ thuật viên tới nơi nhưng không làm được | Lịch hẹn sang *Không thực hiện được*, điều phối lập lịch mới | [phân khu B](Quy-Trinh-B-Hien-Truong.html#hien-truong) |
| Đơn phát sinh từ phiếu nhắc bảo dưỡng | Mốc 1 do nhân viên dịch vụ lập từ phiếu nhắc; các mốc sau không đổi | [phân khu E](Quy-Trinh-E-Sau-Ban-Hang.html#dong-y) |
| Đơn phát sinh từ phiếu sự cố | Mốc 1 và 2 có thể đảo: lập phiếu công việc trước, lập đơn sau khi biết phải bán gì | [phân khu E](Quy-Trinh-E-Sau-Ban-Hang.html#den-tan-noi) |

---

## 5. Đơn này sinh ra đơn sau
{: #vong-lap }

Cùng lúc với hoá đơn, hệ thống sinh **lịch bảo dưỡng** cho từng hạng mục của đơn — mỗi hạng
mục một chu kỳ riêng:

| Hạng mục | Kỳ chăm sóc kế tiếp |
|---|---|
| Lõi lọc thô | Vài tháng |
| Vỏ cốc lọc | Khoảng một năm |
| Thân máy, lõi lọc tổng | Vài năm |

Đến hạn, mỗi lịch sinh một **phiếu nhắc**, phiếu nhắc được giao cho nhân viên chăm sóc khách
hàng, khách hàng đồng ý thì lập **đơn mới** — và đơn mới lại đi đúng mười mốc trên.

> 📖 Cơ chế nhắc và phân công: [E · Sau bán hàng — bảo dưỡng định kỳ](Quy-Trinh-E-Sau-Ban-Hang.html#bao-duong)

---

## 6. Câu hỏi thường gặp
{: #hoi-dap }

**Đơn của tôi đang ở bước nào?**

Mở đơn, nhìn ba ô ở [mục 3](#trang-thai). Muốn biết chi tiết hơn thì xem các chứng từ liên kết
ở cuối trang đơn.

**Đơn đã giao hàng, đã thu tiền, sao vẫn chưa Hoàn tất?**

Thiếu hoá đơn. Hoá đơn chỉ được lập khi đã thu đủ **một trăm phần trăm** và tính trên phiếu
thu **đã chính thức**. Xem [phân khu D](Quy-Trinh-D-Thu-Tien.html#hoa-don).

**Đơn đã Hoàn tất mà phiếu công việc vẫn chưa xong?**

Hai chứng từ kết thúc riêng. Xem [sáu điều kiện hoàn thành phiếu công việc](Quy-Trinh-B-Hien-Truong.html#du-dk-wo).

**Tôi làm xong việc rồi, sao hệ thống vẫn báo còn nợ vật tư?**

Phiếu trả còn ở trạng thái nháp, kho chưa duyệt. Xem [mục 2](#nghia-vu) và
[phân khu C](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve).

**Bao lâu thì đơn xong?**

Không có mốc cố định. Đơn chỉ dừng lại ở ba chỗ: chưa xuống được hiện trường, chưa thu đủ tiền,
hoặc chưa ai duyệt một phiếu nháp nào đó.

**Đơn hàng lập nhầm thì làm sao?**

Chưa phát sinh chứng từ nào thì huỷ đơn rồi lập lại. Đã phát sinh rồi thì phải huỷ ngược, xem
[phân khu A](Quy-Trinh-A-Ban-Hang.html#sua-don).

---

## 7. Đọc tiếp
{: #doc-tiep }

| Bạn phụ trách | Mở trang |
|---|---|
| Tiếp nhận khách hàng, lập đơn | [A · Bán hàng](Quy-Trinh-A-Ban-Hang.html) |
| Điều phối, kỹ thuật hiện trường | [B · Điều phối và hiện trường](Quy-Trinh-B-Hien-Truong.html) |
| Kho, giao hàng, vật tư | [C · Kho và giao nhận](Quy-Trinh-C-Kho-Giao-Nhan.html) |
| Thu tiền, kế toán | [D · Thu tiền và kế toán](Quy-Trinh-D-Thu-Tien.html) |
| Chăm sóc khách hàng, sự cố | [E · Sau bán hàng](Quy-Trinh-E-Sau-Ban-Hang.html) |
| Gỡ tình huống bất thường | [Khi gặp trục trặc](Quy-Trinh-Tra-Cuu.html) |
