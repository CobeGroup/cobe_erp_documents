---
title: 5 · Giao hàng và thu tiền
layout: default
parent: Quy trình hợp nhất
nav_order: 6
---

# Chặng 5 — Giao hàng và thu tiền
{: .no_toc }

**Ai làm:** Kỹ thuật viên · Kho · Kế toán · Kinh doanh
{: .fs-3 .text-grey-dk-000 }

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ chặng

<a href="images/svg/quy-trinh/06-giao-hang-thu-tien.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/06-giao-hang-thu-tien.svg" alt="Từ một đơn bán hàng đã xác nhận có hai đường giao hàng. Đường trên là kỹ thuật viên giao tận nơi: lập phiếu giao hàng, thu tiền tại chỗ, xuất hoá đơn rồi nộp tiền mặt về công ty. Đường dưới là gửi qua đơn vị vận chuyển: lập vận đơn, đề nghị xuất kho, phiếu xuất kho sang kho ảo của đơn vị vận chuyển, đơn vị vận chuyển giao thành công thì hệ thống tự sinh phiếu giao hàng, hoá đơn và phiếu thu tiền thu hộ" style="width:100%;height:auto">
</a>

Hai đường khác nhau ở **ai lập chứng từ và lập lúc nào**, nhưng kết thúc bằng **cùng ba chứng
từ**: phiếu giao hàng (`Delivery Note`), hoá đơn (`Sales Invoice`) và phiếu thu (`Payment Entry`).

---

## 1. Đường A — Kỹ thuật viên giao tận nơi

Đây là đường chính của công ty: kỹ thuật viên mang hàng theo xe, lắp đặt hoặc thay lõi tại nhà
khách, rồi giao hàng và thu tiền ngay tại chỗ.

### 1.1. Lập phiếu giao hàng trên ứng dụng

Kỹ thuật viên mở lịch hẹn → tab **Đơn hàng** → **Giao hàng**. Hệ thống nạp các dòng hàng còn
phải giao của những đơn gắn với lịch hẹn này.

| Điều kiện để giao được | Nội dung |
|---|---|
| Trạng thái đơn | Không phải *Closed*, *Cancelled* hay *On Hold* |
| Dòng hàng | Còn ít nhất một dòng chưa giao hết |
| Kho | Kỹ thuật viên phải có kho khai cho công ty của đơn |
| Mỗi đơn | Phải giao **ít nhất một** món — không cho phép trả hết cả đơn |

### 1.2. Giao đủ hay giao một phần

Kỹ thuật viên chỉnh số lượng từng dòng:

| Chỉnh | Nghĩa |
|---|---|
| Giữ nguyên | Giao đủ |
| Giảm xuống | Giao một phần; phần chênh thành **hàng trả lại** |
| Đặt về 0 | Không giao món đó; cả món thành hàng trả lại |

Màn xác nhận tách rõ hai khối: **hàng trả lại** nền đỏ và **hàng giao** nền xanh, kèm giá trị
từng dòng. Khách **ký tên trên màn hình**; chưa ký thì nút xác nhận không bật.

> 🔗 Phần “hàng trả lại” chính là thứ sinh ra **nghĩa vụ trả vật tư** ở
> [Chặng 4](Quy-Trinh-04-Vat-Tu.html). Giao một phần không phải là bỏ qua — nó tạo ra một món
> nợ hàng mà kỹ thuật viên phải mang về kho.

### 1.3. Thu tiền tại hiện trường

> ⛔ **Bắt buộc có phiếu giao hàng trước khi thu tiền.** Hệ thống chặn kèm thông báo *“Chưa tạo
> phiếu giao hàng cho … Vui lòng tạo phiếu giao hàng trước khi thanh toán.”* Công ty có thể mở
> ngoại lệ cho thu trước bằng một công tắc cấu hình, mặc định là tắt.

| Hình thức | Tiền vào đâu | Trạng thái phiếu | Việc còn lại |
|---|---|---|---|
| **Tiền mặt** | Tài khoản thu tiền của chính kỹ thuật viên | Xác nhận ngay | Phải **nộp về công ty** |
| **Chuyển khoản** | Tài khoản ngân hàng công ty | Để **nháp** | Kế toán đối chiếu rồi xác nhận |

Tỉ lệ thực tế khá cân: **16.792 phiếu thu tiền mặt** và **16.388 phiếu chuyển khoản**.

### 1.4. Nộp tiền mặt về công ty

Tiền mặt nằm ở tài khoản kỹ thuật viên là **công nợ của người đó với công ty**. Nộp về bằng
một phiếu riêng (`Payment Entry` loại *Internal Transfer*). Hệ thống hiện có **8.172 phiếu nộp**.

Hai chốt chặn bảo vệ quỹ:

| Chốt | Tác dụng |
|---|---|
| Chặn nộp trùng | Không cho lập hai phiếu nộp cho cùng một khoản đã thu |
| Chặn quỹ âm | Không cho nộp nhiều hơn số đang giữ |

### 1.5. Hoá đơn

Hoá đơn được lập khi **đã thu đủ 100%** giá trị đơn. Công ty có công tắc cho phép xuất hoá đơn
khi chưa thu đủ, mặc định tắt.

> 🔑 Hoá đơn đủ 100% là mốc quyết định ba việc cùng lúc: đơn chuyển sang **Hoàn tất**, khách
> được **cộng điểm tích luỹ**, và hệ thống **sinh lịch bảo dưỡng** cho kỳ sau.

### 1.6. Huỷ phiếu vừa lập

Kỹ thuật viên chỉ huỷ được phiếu thu và phiếu xuất vật tư **trong vài phút đầu** sau khi lập
(mặc định 3 phút). Quá thời gian đó, hoặc phiếu thu đã có phiếu nộp đối ứng, thì phải theo
quy trình của kế toán.

---

## 2. Đường B — Gửi qua đơn vị vận chuyển

Dùng khi khách ở xa, hàng không cần lắp đặt, hoặc chỉ gửi vật tư lẻ. Hiện còn dùng ít — **27
vận đơn** trên toàn hệ thống — nhưng quy trình đã dựng đủ.

| Bước | Việc | Chứng từ | Tồn kho thay đổi chưa |
|---|---|---|---|
| 1 | Lập vận đơn từ nút trên đơn hàng | Vận đơn (`DP Shipment`) | Chưa |
| 2 | Xác nhận vận đơn | Đề nghị xuất kho (`Material Request`) tự sinh | Chưa |
| 3 | Kho xuất hàng giao cho đơn vị vận chuyển | Phiếu xuất kho (`Stock Entry`) | **Có** — trừ kho nguồn, cộng kho ảo của đơn vị vận chuyển |
| 4 | Đẩy đơn sang đơn vị vận chuyển, lấy mã vận đơn | Ghi mã vào vận đơn | Không |
| 5 | Đơn vị vận chuyển cập nhật hành trình | Trạng thái vận đơn tự đổi | Không |
| 6 | Giao thành công | Phiếu giao hàng, hoá đơn, phiếu thu tiền thu hộ **tự sinh** | **Có** — xuất khỏi kho ảo |

Ba nhánh kết thúc khác:

| Kết cục | Hệ thống làm gì |
|---|---|
| **Hoàn về kho** | Sinh phiếu đảo, chuyển hàng từ kho ảo về lại kho nguồn |
| **Mất hàng** | Ghi nhận thất thoát để kế toán xử lý, **không** tự hoàn tồn |
| **Giao thất bại, đang hoàn** | Chỉ cập nhật trạng thái, chờ kết cục cuối |

> ⚠️ Đơn bị đơn vị vận chuyển huỷ **mà hàng đã lấy đi rồi** thì **chưa huỷ vận đơn ngay**. Chờ
> kho nhận lại hàng thật rồi mới huỷ, nếu không sổ kho sẽ lệch.

📚 Chi tiết: [Quy trình vận đơn và giao nhận](Delivery_Partner-Quy-Trinh.html).

---

## 3. “Trả hàng” — ba nghĩa khác nhau

Từ *trả hàng* trong công ty được dùng cho ba việc hoàn toàn khác nhau. Nhầm giữa chúng là
nguồn gốc của nhiều tranh cãi khi đối chiếu kho.

| Cách gọi | Thực chất là gì | Chứng từ | Quy mô |
|---|---|---|---|
| **Khách không nhận lúc giao** | Giảm số lượng trên phiếu giao hàng; phần chênh thành nghĩa vụ trả | Ghi trong đơn bán hàng | Rất thường xuyên |
| **Kỹ thuật viên trả vật tư về kho** | Chuyển hàng từ kho cá nhân về kho công ty | Phiếu trả (`Stock Entry`) | Rất thường xuyên |
| **Khách trả hàng sau khi đã nhận** | Đảo ngược nghiệp vụ bán đã hoàn tất | Phiếu giao hàng trả lại và hoá đơn trả lại | **Hiếm** — 20 phiếu giao trả lại và 1 hoá đơn trả lại trên toàn hệ thống |

Chỉ trường hợp thứ ba mới làm **giảm doanh thu** và **thu hồi điểm tích luỹ** của khách.

---

## 4. Ngoại lệ thường gặp ở chặng này

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Không thu được tiền, báo *“Chưa tạo phiếu giao hàng”* | Chưa lập phiếu giao hàng cho đơn đó | Lập phiếu giao hàng trước |
| Không xác nhận được phiếu giao hàng | Có đơn bị trả hết mọi món | Mỗi đơn phải giao ít nhất một món; tách đơn nếu thực tế không giao gì |
| Nút xác nhận không bật ở màn ký tên | Khách chưa ký trên màn hình | Cho khách ký, hoặc xoá chữ ký hỏng rồi ký lại |
| Đã thu tiền mặt nhưng **vẫn treo công nợ** | Chưa lập phiếu nộp tiền về công ty | Lập phiếu nộp; hệ thống chặn nếu nộp trùng hoặc nộp quá số đang giữ |
| Không huỷ được phiếu thu vừa lập | Quá thời gian cho phép, hoặc phiếu đã có phiếu nộp đối ứng | Chuyển kế toán xử lý theo quy trình |
| Đơn đã giao đủ nhưng **chưa Hoàn tất** | Chưa xuất hoá đơn đủ 100% | Kế toán xuất nốt hoá đơn; chưa đủ thì chưa cộng điểm, chưa sinh lịch bảo dưỡng |
| Vận đơn xác nhận rồi mà **tồn kho chưa đổi** | Đúng như thiết kế — xác nhận chỉ sinh đề nghị xuất kho | Kho phải lập phiếu xuất kho thật ở bước 3 |
| Vận đơn đã *Delivered* mà **không thấy phiếu giao, hoá đơn, phiếu thu** | Vận đơn không gắn đơn bán hàng, hoặc kết nối trạng thái chưa bật | Kiểm bảng chứng từ nguồn trên vận đơn; nếu vẫn không ra thì báo bộ phận kỹ thuật |
| Đơn vị vận chuyển thu **sai cước, sai số kiện** | Tab kiện hàng và người trả cước khai sai trước khi đẩy đơn | Sửa trước khi đẩy; đã đẩy rồi thì phải xử lý với đơn vị vận chuyển |
| Hoá đơn đã xuất nhưng khách trả hàng | Nghiệp vụ trả hàng sau bán | Lập phiếu giao trả lại và hoá đơn trả lại; hệ thống **tự thu hồi điểm tích luỹ** tương ứng |

---

## 5. Chặng tiếp theo

Đơn đã hoàn tất. Đây chính là lúc hệ thống bắt đầu đếm ngược cho lần chăm sóc kế tiếp:
**[Chặng 6 — Bảo dưỡng định kỳ và vòng lặp](Quy-Trinh-06-Bao-Duong.html)**.
