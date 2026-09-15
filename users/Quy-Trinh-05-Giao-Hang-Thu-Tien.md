---
title: 5 · Giao hàng và thu tiền
layout: default
parent: Quy trình hợp nhất
nav_order: 6
---

# Chặng 5 — Giao hàng và thu tiền
{: .no_toc }

**Vai trò thực hiện:** Kỹ thuật viên · Kho · Kế toán · Kinh doanh
{: .fs-3 .text-grey-dk-000 }

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ chặng

<a href="images/svg/quy-trinh/06-giao-hang-thu-tien.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/06-giao-hang-thu-tien.svg" alt="Từ một đơn bán hàng đã xác nhận có hai đường giao hàng. Đường trên là kỹ thuật viên giao tận nơi: lập phiếu giao hàng, thu tiền tại chỗ, xuất hoá đơn rồi nộp tiền mặt về công ty. Đường dưới là gửi qua đơn vị vận chuyển: lập vận đơn, đề nghị xuất kho, phiếu xuất kho sang kho của đơn vị vận chuyển, giao thành công thì hệ thống tự sinh phiếu giao hàng, hoá đơn và phiếu thu tiền thu hộ" style="width:100%;height:auto">
</a>

Hai phương thức khác nhau ở **người lập chứng từ và thời điểm lập**, nhưng cùng kết thúc bằng
**ba chứng từ giống nhau**: phiếu giao hàng (`Delivery Note`), hoá đơn (`Sales Invoice`) và
phiếu thu (`Payment Entry`).

---

## 1. Phương thức A — Kỹ thuật viên giao tận nơi

Đây là phương thức chủ đạo của công ty: kỹ thuật viên mang hàng theo phương tiện, lắp đặt hoặc
thay lõi tại địa điểm của khách hàng, sau đó giao hàng và thu tiền tại chỗ.

### 1.1. Lập phiếu giao hàng trên ứng dụng

Kỹ thuật viên mở lịch hẹn, chọn tab **Đơn hàng**, sau đó chọn chức năng **Giao hàng**. Hệ thống
nạp các dòng hàng còn phải giao của những đơn gắn với lịch hẹn.

| Điều kiện thực hiện | Nội dung |
|---|---|
| Trạng thái đơn | Không thuộc *Closed*, *Cancelled* hoặc *On Hold* |
| Dòng hàng | Còn tối thiểu một dòng chưa giao hết |
| Kho | Kỹ thuật viên phải được khai kho cho công ty của đơn |
| Mỗi đơn | Phải giao tối thiểu một món; không cho phép hoàn trả toàn bộ đơn |

### 1.2. Giao đủ hoặc giao một phần

Kỹ thuật viên điều chỉnh số lượng của từng dòng:

| Thao tác | Ý nghĩa |
|---|---|
| Giữ nguyên | Giao đủ |
| Giảm số lượng | Giao một phần; phần chênh lệch được ghi nhận là **hàng hoàn trả** |
| Đặt về 0 | Không giao món đó; toàn bộ món được ghi nhận là hàng hoàn trả |

Màn hình xác nhận tách riêng hai khối: **hàng hoàn trả** nền đỏ và **hàng giao** nền xanh, kèm
giá trị từng dòng. Khách hàng **ký xác nhận trên màn hình**; khi chưa ký, chức năng xác nhận
không được kích hoạt.

> 🔗 Phần hàng hoàn trả chính là nội dung làm phát sinh **nghĩa vụ trả vật tư** ở
> [Chặng 4](Quy-Trinh-04-Vat-Tu.html). Giao một phần không đồng nghĩa với bỏ qua phần còn lại:
> đó là một khoản nợ hàng mà kỹ thuật viên phải hoàn trả về kho.

### 1.3. Thu tiền tại hiện trường

> ⛔ **Bắt buộc lập phiếu giao hàng trước khi thu tiền.** Hệ thống từ chối kèm thông báo
> *“Chưa tạo phiếu giao hàng cho … Vui lòng tạo phiếu giao hàng trước khi thanh toán.”* Công ty
> có thể mở ngoại lệ cho phép thu trước bằng một tham số cấu hình, mặc định là tắt.

| Hình thức | Tài khoản ghi nhận | Trạng thái phiếu | Công việc tiếp theo |
|---|---|---|---|
| **Tiền mặt** | Tài khoản thu tiền của chính kỹ thuật viên | Xác nhận ngay | Phải **nộp về công ty** |
| **Chuyển khoản** | Tài khoản ngân hàng công ty | Giữ ở trạng thái **nháp** | Kế toán đối chiếu rồi xác nhận |

Tỉ trọng thực tế tương đối cân bằng: **16.792 phiếu thu tiền mặt** và **16.388 phiếu chuyển
khoản**.

### 1.4. Nộp tiền mặt về công ty

Tiền mặt nằm tại tài khoản kỹ thuật viên được ghi nhận là **công nợ của nhân sự đó với công
ty**. Việc nộp về được thực hiện bằng một phiếu riêng (`Payment Entry` loại *Internal
Transfer*). Hệ thống hiện ghi nhận **8.172 phiếu nộp**.

Hai chốt kiểm soát bảo vệ quỹ:

| Chốt kiểm soát | Tác dụng |
|---|---|
| Kiểm soát nộp trùng | Không cho phép lập hai phiếu nộp cho cùng một khoản đã thu |
| Kiểm soát quỹ âm | Không cho phép nộp nhiều hơn số tiền đang giữ |

### 1.5. Xuất hoá đơn

Hoá đơn được lập khi **đã thu đủ 100%** giá trị đơn. Công ty có tham số cho phép xuất hoá đơn
khi chưa thu đủ, mặc định là tắt.

> 🔑 Mốc hoá đơn đủ 100% quyết định đồng thời ba nội dung: đơn chuyển sang trạng thái **Hoàn
> tất**, khách hàng được **cộng điểm tích luỹ**, và hệ thống **phát sinh lịch bảo dưỡng** cho
> kỳ kế tiếp.

### 1.6. Huỷ phiếu vừa lập

Kỹ thuật viên chỉ huỷ được phiếu thu và phiếu xuất vật tư **trong vài phút đầu** sau khi lập
(mặc định 3 phút). Quá thời hạn này, hoặc khi phiếu thu đã có phiếu nộp đối ứng, việc huỷ phải
thực hiện theo quy trình của kế toán.

---

## 2. Phương thức B — Gửi qua đơn vị vận chuyển

Áp dụng khi khách hàng ở xa, hàng không cần lắp đặt, hoặc chỉ gửi vật tư lẻ. Phương thức này
hiện được sử dụng ít — **27 vận đơn** trên toàn hệ thống — nhưng quy trình đã được xây dựng đầy
đủ.

| Bước | Nội dung | Chứng từ | Tồn kho thay đổi |
|---|---|---|---|
| 1 | Lập vận đơn từ đơn bán hàng | Vận đơn (`DP Shipment`) | Chưa |
| 2 | Xác nhận vận đơn | Đề nghị xuất kho (`Material Request`) tự phát sinh | Chưa |
| 3 | Kho xuất hàng bàn giao cho đơn vị vận chuyển | Phiếu xuất kho (`Stock Entry`) | **Có** — trừ kho nguồn, cộng kho của đơn vị vận chuyển |
| 4 | Đẩy đơn sang đơn vị vận chuyển và tiếp nhận mã vận đơn | Ghi mã vào vận đơn | Không |
| 5 | Đơn vị vận chuyển cập nhật hành trình | Trạng thái vận đơn tự cập nhật | Không |
| 6 | Giao thành công | Phiếu giao hàng, hoá đơn và phiếu thu tiền thu hộ **tự phát sinh** | **Có** — xuất khỏi kho của đơn vị vận chuyển |

Ba kết cục khác:

| Kết cục | Xử lý của hệ thống |
|---|---|
| **Hoàn về kho** | Phát sinh phiếu đảo, chuyển hàng từ kho của đơn vị vận chuyển về lại kho nguồn |
| **Mất hàng** | Ghi nhận thất thoát để kế toán xử lý, **không** tự hoàn tồn kho |
| **Giao không thành công, đang hoàn** | Chỉ cập nhật trạng thái, chờ kết cục cuối cùng |

> ⚠️ Trường hợp đơn vị vận chuyển huỷ đơn **khi hàng đã được lấy đi**, **chưa huỷ vận đơn ngay**.
> Cần chờ kho tiếp nhận lại hàng trên thực tế rồi mới huỷ, nếu không sổ kho sẽ sai lệch.

📚 Nội dung chi tiết: [Quy trình vận đơn và giao nhận](Delivery_Partner-Quy-Trinh.html).

---

## 3. Ba khái niệm hoàn trả cần phân biệt

Thuật ngữ *trả hàng* đang được dùng cho ba nghiệp vụ khác nhau. Nhầm lẫn giữa ba nghiệp vụ này
là nguyên nhân của nhiều sai lệch khi đối chiếu kho.

| Cách gọi thông dụng | Bản chất nghiệp vụ | Chứng từ | Qui mô |
|---|---|---|---|
| **Khách hàng không tiếp nhận khi giao** | Giảm số lượng trên phiếu giao hàng; phần chênh lệch thành nghĩa vụ trả | Ghi nhận trong đơn bán hàng | Rất thường xuyên |
| **Kỹ thuật viên hoàn trả vật tư về kho** | Chuyển hàng từ kho cá nhân về kho công ty | Phiếu trả (`Stock Entry`) | Rất thường xuyên |
| **Khách hàng trả hàng sau khi đã nhận** | Đảo ngược nghiệp vụ bán đã hoàn tất | Phiếu giao hàng trả lại và hoá đơn trả lại | **Hiếm** — 20 phiếu giao trả lại và 1 hoá đơn trả lại trên toàn hệ thống |

Chỉ nghiệp vụ thứ ba làm **giảm doanh thu** và **thu hồi điểm tích luỹ** của khách hàng.

---

## 4. Ngoại lệ thường gặp

| Hiện tượng | Nguyên nhân | Hướng xử lý |
|---|---|---|
| Không thu được tiền, báo *“Chưa tạo phiếu giao hàng”* | Chưa lập phiếu giao hàng cho đơn | Lập phiếu giao hàng trước |
| Không xác nhận được phiếu giao hàng | Có đơn bị hoàn trả toàn bộ số món | Mỗi đơn phải giao tối thiểu một món; tách đơn nếu thực tế không giao món nào |
| Chức năng xác nhận không kích hoạt ở màn hình ký | Khách hàng chưa ký xác nhận | Đề nghị khách hàng ký, hoặc xoá chữ ký lỗi rồi ký lại |
| Đã thu tiền mặt nhưng **vẫn còn công nợ** | Chưa lập phiếu nộp tiền về công ty | Lập phiếu nộp; hệ thống từ chối nếu nộp trùng hoặc nộp quá số đang giữ |
| Không huỷ được phiếu thu vừa lập | Quá thời hạn cho phép, hoặc đã có phiếu nộp đối ứng | Chuyển kế toán xử lý theo quy trình |
| Đơn đã giao đủ nhưng **chưa chuyển Hoàn tất** | Chưa xuất hoá đơn đủ 100% | Kế toán xuất nốt hoá đơn; khi chưa đủ thì chưa cộng điểm và chưa phát sinh lịch bảo dưỡng |
| Vận đơn đã xác nhận nhưng **tồn kho chưa thay đổi** | Đúng thiết kế: xác nhận chỉ phát sinh đề nghị xuất kho | Kho phải lập phiếu xuất kho thực tế ở bước 3 |
| Vận đơn đã *Delivered* nhưng **không thấy chứng từ tự phát sinh** | Vận đơn không gắn đơn bán hàng, hoặc kết nối trạng thái chưa được bật | Kiểm tra bảng chứng từ nguồn trên vận đơn; nếu vẫn chưa có thì báo bộ phận kỹ thuật |
| Đơn vị vận chuyển tính **sai cước, sai số kiện** | Tab kiện hàng và người trả cước khai sai trước khi đẩy đơn | Cập nhật **trước khi đẩy đơn**; nếu đã đẩy thì xử lý với đơn vị vận chuyển |
| Hoá đơn đã xuất nhưng khách hàng trả hàng | Nghiệp vụ trả hàng sau bán | Lập phiếu giao trả lại và hoá đơn trả lại; hệ thống **tự thu hồi điểm tích luỹ** tương ứng |

---

## 5. Chặng tiếp theo

Đơn đã hoàn tất. Đây là thời điểm hệ thống bắt đầu tính lịch chăm sóc cho kỳ kế tiếp:
**[Chặng 6 — Bảo dưỡng định kỳ và vòng lặp](Quy-Trinh-06-Bao-Duong.html)**.
