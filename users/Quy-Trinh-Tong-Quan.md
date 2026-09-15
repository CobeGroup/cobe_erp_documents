---
title: Tổng quan toàn chuỗi
layout: default
parent: Quy trình hợp nhất
nav_order: 1
---

# Tổng quan toàn chuỗi
{: .no_toc }

**Dành cho:** mọi vai trò · **Thời lượng đọc:** khoảng 12 phút
{: .fs-3 .text-grey-dk-000 }

Trang này là bản đồ. Đọc xong sẽ hình dung được toàn bộ hệ thống chạy thế nào, và biết cần
mở trang nào để tra chi tiết phần việc của mình.

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1. Toàn cảnh trong một sơ đồ

<a href="images/svg/quy-trinh/01-toan-canh.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/01-toan-canh.svg" alt="Sơ đồ vòng tròn toàn chuỗi: khách tiềm năng chuyển thành khách hàng rồi mở đơn bán hàng; đơn sinh phiếu công việc, yêu cầu vật tư và lịch hẹn; kỹ thuật viên ra hiện trường lập phiếu giao hàng, hoá đơn và phiếu thu; đơn hoàn tất sinh phiếu nhắc bảo dưỡng và phiếu nhắc lại mở đơn bán hàng mới; sự cố là cửa vào thứ hai đi thẳng vào phiếu công việc" style="width:100%;height:auto">
</a>

Điểm quan trọng nhất của sơ đồ này là **nó khép kín**. Hệ thống không được thiết kế để bán
một lần rồi thôi: sản phẩm chính là máy lọc nước, mà máy lọc nước thì phải thay lõi và bảo
dưỡng theo chu kỳ. Vì vậy **mọi đơn hàng hoàn tất đều tự sinh ra lịch chăm sóc cho lần sau**,
và lần sau đó lại trở thành một đơn hàng mới.

Hệ quả thực tế: trong 51.152 đơn bán hàng đang có trên hệ thống, **19.056 đơn — tức hơn một
phần ba — sinh ra từ phiếu nhắc bảo dưỡng**, không phải từ khách mới. Đây là vòng quay chính
tạo doanh thu lặp lại.

---

## 2. Hai cửa vào, một dòng chảy

Khách chỉ vào hệ thống bằng **hai cửa**:

| Cửa vào | Chứng từ mở đầu | Ai mở | Khi nào |
|---|---|---|---|
| **Khách mới muốn mua** | Khách tiềm năng (`Lead`) | Kinh doanh · Chăm sóc khách hàng | Khách gọi hotline, nhắn trang mạng xã hội, để lại thông tin trên trang web, hoặc được người khác giới thiệu |
| **Khách cũ báo hỏng** | Phiếu sự cố (`Issue`) | Chăm sóc khách hàng | Khách đã mua máy, máy có vấn đề |

Cửa thứ ba trông như một cửa nhưng thực ra **không phải cửa vào mà là vòng quay lại**: phiếu
nhắc bảo dưỡng (`Service Ticket Reminder`). Nó chỉ phát sinh cho khách **đã từng mua**, do hệ
thống tự sinh từ đơn hàng cũ.

Sau khi vào, cả ba đều đổ về cùng một dòng chảy: **đơn bán hàng → phiếu công việc → hiện
trường → giao hàng → thu tiền**.

---

## 3. Bảng đối chiếu tên chứng từ

Tài liệu gọi chứng từ bằng tiếng Việt cho dễ đọc. Khi cần tra trên hệ thống, gõ **tên tiếng
Anh** ở cột phải vào ô tìm kiếm.

| Tên trong tài liệu | Tên thật trên hệ thống | Vai trò |
|---|---|---|
| Khách tiềm năng | `Lead` | Hồ sơ người chưa mua |
| Cơ hội bán hàng | `Opportunity` | Nhu cầu cụ thể của một khách tiềm năng |
| Khách hàng | `Customer` | Hồ sơ khách chính thức |
| Liên hệ | `Contact` | Người liên hệ, số điện thoại |
| Địa chỉ | `Address` | Nơi lắp đặt, nơi giao hàng |
| Đơn bán hàng | `Sales Order` | Cam kết bán: hàng gì, giá bao nhiêu, ai bán |
| Phiếu công việc | `FS Work Order` | Hồ sơ trung tâm của một vụ việc kỹ thuật |
| Dòng việc trong phiếu | `FS Work Order Line Item` | Từng đầu việc trong phiếu công việc |
| Lịch hẹn dịch vụ | `FS Service Appointment` | Một buổi kỹ thuật viên tới hiện trường |
| Yêu cầu vật tư | `Material Request` | Kỹ thuật viên xin hàng từ kho công ty |
| Phiếu xuất kho · nhập kho · chuyển kho · trả hàng | `Stock Entry` | Mọi lần hàng đổi kho đều là chứng từ này |
| Phiếu giao hàng | `Delivery Note` | Xác nhận khách đã nhận hàng |
| Hoá đơn bán hàng | `Sales Invoice` | Ghi doanh thu và công nợ |
| Phiếu thu · phiếu nộp tiền | `Payment Entry` | Mọi lần tiền đổi tay |
| Vận đơn | `DP Shipment` | Lô hàng gửi qua đơn vị vận chuyển |
| Phiếu sự cố | `Issue` | Khách báo hỏng |
| Nhóm sự cố · Loại sự cố | `Issue Group` · `Issue Type` | Hai tầng phân loại của phiếu sự cố |
| Nhắc theo vật tư | `Item Service Reminder` | Lịch nhắc của **một** vật tư trên **một** đơn |
| Phiếu nhắc bảo dưỡng | `Service Ticket Reminder` | Việc gọi khách, gom nhiều lịch nhắc lại |
| Kho công ty · kho kỹ thuật viên · kho ảo đơn vị vận chuyển | `Warehouse` | Mọi loại kho đều là chứng từ này |

> Lưu ý dễ nhầm: **Phiếu xuất kho, Phiếu nhập kho, Phiếu chuyển kho và Phiếu trả vật tư đều là
> cùng một loại chứng từ** (`Stock Entry`), chỉ khác ở ô *Mục đích*. Tương tự, **Phiếu thu và
> Phiếu nộp tiền về công ty cũng là cùng một loại** (`Payment Entry`), khác ở ô *Loại thanh toán*.

---

## 4. Ai làm gì, trên màn hình nào

Hệ thống không chỉ có một giao diện. Mỗi vai trò làm việc trên màn hình riêng, nhưng tất cả
ghi vào **cùng một kho dữ liệu**.

| Vai trò | Màn hình chính | Việc chính trong chuỗi |
|---|---|---|
| Kinh doanh · Chăm sóc khách hàng | Desk (giao diện chính) | Khách tiềm năng, khách hàng, đơn bán hàng, phiếu sự cố |
| Nhân viên dịch vụ | Desk + báo cáo dịch vụ `/service-report` | Phiếu nhắc bảo dưỡng, gọi khách, chốt đơn mới |
| Điều phối | Màn điều phối `/smart-scheduler` | Lập lịch hẹn, gán kỹ thuật viên, xem lịch cả đội |
| Kỹ thuật viên | Ứng dụng kỹ thuật viên `/technician` | Nhận việc, check-in, yêu cầu vật tư, giao hàng, thu tiền |
| Kho | Màn kho `/master-stock` + Desk | Xuất hàng theo yêu cầu, duyệt phiếu trả vật tư |
| Kế toán | Desk | Hoá đơn, phiếu thu, đối chiếu công nợ |
| Quản lý dịch vụ | `/service-report` và `/fsm-report` | Theo dõi tồn đọng, hiệu suất, doanh thu dịch vụ |

> Hệ thống dịch vụ hiện trường đã **chuyển sang nền tảng mới từ tháng 03/2026**. Dữ liệu vụ
> việc phát sinh trước mốc đó nằm ở hệ cũ và chỉ để tra cứu; mọi việc mới đều chạy trên
> phiếu công việc (`FS Work Order`) và lịch hẹn (`FS Service Appointment`) của hệ mới.

---

## 5. Quy mô thực tế của từng chặng

Bảng dưới cho thấy chặng nào là chặng chính, chặng nào là ngoại lệ. Số liệu chốt ngày
**15/09/2026**.

| Chặng | Chứng từ | Số lượng |
|---|---|---|
| Khách vào hệ thống | Khách tiềm năng | 93.956 |
| Trở thành khách hàng | Khách hàng | 25.566 |
| Bán hàng | Đơn bán hàng | 51.152 |
| Dịch vụ hiện trường | Phiếu công việc | 16.004 |
| Dịch vụ hiện trường | Lịch hẹn dịch vụ | 15.001 |
| Vật tư | Yêu cầu vật tư | 14.878 |
| Vật tư | Phiếu kho các loại | 34.548 |
| Giao hàng | Phiếu giao hàng | 24.191 |
| Kế toán | Hoá đơn | 23.207 |
| Kế toán | Phiếu thu và phiếu nộp tiền | 33.492 |
| Chăm sóc lặp lại | Phiếu nhắc bảo dưỡng | 82.552 |
| Sự cố | Phiếu sự cố | 25.944 |
| Vận chuyển qua đối tác | Vận đơn | 27 |

Hai điều đọc được ngay từ bảng này:

- **Phiếu nhắc bảo dưỡng nhiều hơn đơn hàng.** Đó là bản chất của việc chăm sóc định kỳ: mỗi
  khách được nhắc nhiều lần trong đời máy, và không phải lần nhắc nào cũng chốt được đơn.
- **Vận đơn qua đơn vị vận chuyển hiện còn rất ít.** Kênh giao hàng chính vẫn là kỹ thuật
  viên mang hàng đi và giao tận nơi.

---

## 6. Ba loại việc tại hiện trường

Phiếu công việc được phân theo **loại việc** (`FS Work Type`). Bốn loại chiếm gần như toàn bộ:

| Loại việc | Số phiếu | Nguồn gốc thường gặp |
|---|---|---|
| Bảo dưỡng | 9.599 | Phiếu nhắc bảo dưỡng chốt thành đơn, rồi lập phiếu công việc |
| Sự cố | 3.350 | Khách báo hỏng, lập phiếu sự cố rồi lập phiếu công việc |
| Lắp đặt | 2.076 | Đơn bán máy mới |
| Khảo sát | 912 | Đo nước, xem mặt bằng trước khi chốt bán |

Loại việc quyết định **yêu cầu khi hoàn thành**: có loại bắt buộc chụp ảnh, có loại bắt buộc
lập phiếu giao hàng, có loại bắt buộc thu tiền. Chọn sai loại việc thì hệ thống đòi những thứ
không liên quan, hoặc ngược lại bỏ qua thứ đáng lẽ phải kiểm.

---

## 7. Nguyên tắc chung cần nhớ

Bốn nguyên tắc dưới đây giải thích phần lớn các tình huống *"tại sao hệ thống không cho tôi làm"*.

### 7.1. Chứng từ đi theo một chiều, muốn lùi phải huỷ ngược

Mỗi chứng từ sinh ra chứng từ sau và **khoá chứng từ trước**. Muốn sửa một thứ ở giữa chuỗi,
phải huỷ ngược từ cuối về:

```
Phiếu thu  →  Hoá đơn  →  Phiếu giao hàng  →  Đơn bán hàng
   huỷ 1       huỷ 2         huỷ 3              rồi mới sửa được
```

### 7.2. Trạng thái của các phiếu là độc lập với nhau

Đây là điểm gây ngạc nhiên nhiều nhất. **Lịch hẹn hoàn tất không tự đẩy phiếu công việc sang
hoàn tất. Đơn hàng hoàn tất không tự đóng phiếu công việc. Đóng phiếu sự cố không đóng phiếu
công việc.** Mỗi phiếu có bộ điều kiện riêng và phải được kết thúc riêng.

Đây là thiết kế cố ý, không phải lỗi: một vụ việc có thể cần nhiều lần xuống hiện trường, và
một đơn hàng có thể chỉ giao được một phần.

### 7.3. Chứng từ nháp không làm thay đổi gì

Phiếu ở trạng thái **nháp** chỉ là ý định. Sổ kho chưa đổi, công nợ chưa đổi, nghĩa vụ chưa
xoá. Chỉ khi phiếu được **xác nhận** thì hệ thống mới ghi nhận. Riêng phiếu trả vật tư nháp
có tác dụng phụ đặc biệt: nó **giữ chỗ** để kỹ thuật viên không lập trùng, dù chưa đụng sổ kho.

### 7.4. Hệ thống im lặng ở vài chỗ

Có những việc hệ thống **không báo lỗi** khi làm thiếu, nhưng hậu quả xuất hiện về sau:

| Làm thiếu | Hệ thống nói gì | Hậu quả |
|---|---|---|
| Khách chưa được gán chương trình tích điểm | Không nói gì | Khách không nhận điểm nào, phát hiện khi khách khiếu nại |
| Không khai người giới thiệu ở bước khách tiềm năng | Không nói gì | Người giới thiệu mất thưởng, sửa sau rất khó |
| Chọn sai loại việc trên phiếu công việc | Không nói gì | Bỏ sót yêu cầu bắt buộc, hoặc bị đòi thứ không cần |
| Kho nguồn chưa khai điểm gửi hàng | Không nói gì | Đơn vị vận chuyển tới lấy hàng nhầm kho |

---

## 8. Đi tiếp

Từ đây, chọn chặng cần đọc:

| Bạn làm việc ở chặng | Đọc trang |
|---|---|
| Tìm và chốt khách mới | [Từ khách tiềm năng đến khách hàng](Quy-Trinh-01-Khach-Hang.html) |
| Lập và sửa đơn hàng | [Đơn bán hàng](Quy-Trinh-02-Don-Hang.html) |
| Xếp lịch, đi hiện trường | [Điều phối và thực hiện tại hiện trường](Quy-Trinh-03-Hien-Truong.html) |
| Giữ kho, cấp phát và nhận trả vật tư | [Vật tư của kỹ thuật viên](Quy-Trinh-04-Vat-Tu.html) |
| Giao hàng, xuất hoá đơn, thu tiền | [Giao hàng và thu tiền](Quy-Trinh-05-Giao-Hang-Thu-Tien.html) |
| Gọi khách bảo dưỡng định kỳ | [Bảo dưỡng định kỳ và vòng lặp](Quy-Trinh-06-Bao-Duong.html) |
| Tiếp nhận và xử lý khách báo hỏng | [Sự cố](Quy-Trinh-07-Su-Co.html) |
| Gặp hiện tượng lạ, cần tra nhanh | [Ngoại lệ, lỗi và bất thường](Quy-Trinh-08-Ngoai-Le.html) |
