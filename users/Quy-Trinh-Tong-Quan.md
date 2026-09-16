---
title: Tổng quan toàn chuỗi
layout: default
parent: Quy trình hợp nhất
nav_order: 1
---

# Tổng quan toàn chuỗi
{: .no_toc }

**Đối tượng:** mọi vai trò · **Thời lượng đọc:** khoảng 12 phút
{: .fs-3 .text-grey-dk-000 }

Trang này giữ vai trò bản đồ tổng thể. Sau khi đọc, người dùng nắm được cấu trúc vận hành của
hệ thống và xác định được cần tham khảo trang nào cho phần việc của mình.

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1. Toàn cảnh hệ thống

<a href="images/svg/quy-trinh/01-toan-canh.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/01-toan-canh.svg" alt="Sơ đồ vòng tròn toàn chuỗi: khách tiềm năng chuyển thành khách hàng rồi mở đơn bán hàng; đơn sinh phiếu công việc, yêu cầu vật tư và lịch hẹn; kỹ thuật viên ra hiện trường lập phiếu giao hàng, hoá đơn và phiếu thu; đơn hoàn tất sinh phiếu nhắc bảo dưỡng và phiếu nhắc lại mở đơn bán hàng mới; sự cố là đầu vào thứ hai, dẫn thẳng vào phiếu công việc" style="width:100%;height:auto">
</a>

Đặc điểm quan trọng nhất của sơ đồ là **tính khép kín**. Hệ thống không được thiết kế cho mô
hình bán một lần: sản phẩm chính là máy lọc nước, mà máy lọc nước phải thay lõi và bảo dưỡng
theo chu kỳ. Do đó **mỗi đơn hàng hoàn tất đều tự phát sinh lịch chăm sóc cho kỳ kế tiếp**, và
kỳ chăm sóc đó lại trở thành một đơn hàng mới.

Kết quả thể hiện rõ trên số liệu: trong 51.152 đơn bán hàng hiện có, **19.056 đơn — tương
đương hơn một phần ba — được lập từ phiếu nhắc bảo dưỡng** chứ không phải từ khách hàng mới.
Đây là nguồn doanh thu lặp lại chính của công ty.

---

## 2. Hai đầu vào, một dây chuyền

Khách hàng đi vào hệ thống qua **hai đầu vào**:

| Đầu vào | Chứng từ mở đầu | Vai trò lập | Trường hợp áp dụng |
|---|---|---|---|
| **Khách hàng mới có nhu cầu mua** | Khách tiềm năng (`Lead`) | Kinh doanh · Chăm sóc khách hàng | Khách hàng gọi tổng đài, nhắn tin qua mạng xã hội, để lại thông tin trên trang web hoặc được giới thiệu |
| **Khách hàng hiện hữu báo hỏng** | Phiếu sự cố (`Issue`) | Chăm sóc khách hàng | Khách hàng đã mua thiết bị và thiết bị phát sinh vấn đề |

Ngoài hai đầu vào trên còn một luồng thứ ba là phiếu nhắc bảo dưỡng (`Service Ticket
Reminder`). Đây **không phải đầu vào mà là vòng quay trở lại**: phiếu chỉ phát sinh cho khách
hàng **đã từng mua**, do hệ thống tự lập từ đơn hàng cũ.

Cả ba luồng sau đó đều đi vào cùng một dây chuyền: **đơn bán hàng → phiếu công việc → hiện
trường → giao hàng → thu tiền**.

---

## 3. Bảng đối chiếu tên chứng từ

Tài liệu gọi tên chứng từ bằng tiếng Việt để thuận tiện khi đọc. Khi tra cứu trên hệ thống,
cần nhập **tên tiếng Anh** ở cột giữa vào thanh tìm kiếm.

| Tên trong tài liệu | Tên trên hệ thống | Vai trò |
|---|---|---|
| Khách tiềm năng | `Lead` | Hồ sơ khách hàng chưa phát sinh giao dịch |
| Cơ hội bán hàng | `Opportunity` | Nhu cầu cụ thể của một khách tiềm năng |
| Khách hàng | `Customer` | Hồ sơ khách hàng chính thức |
| Liên hệ | `Contact` | Người liên hệ và số điện thoại |
| Địa chỉ | `Address` | Địa điểm lắp đặt, địa điểm giao hàng |
| Đơn bán hàng | `Sales Order` | Cam kết bán: hàng hoá, giá trị, người phụ trách |
| Phiếu công việc | `FS Work Order` | Hồ sơ trung tâm của một vụ việc kỹ thuật |
| Dòng việc trong phiếu | `FS Work Order Line Item` | Từng đầu việc trong phiếu công việc |
| Lịch hẹn dịch vụ | `FS Service Appointment` | Một buổi kỹ thuật viên có mặt tại hiện trường |
| Yêu cầu vật tư | `Material Request` | Đề nghị cấp hàng từ kho công ty |
| Phiếu xuất kho · nhập kho · chuyển kho · trả hàng | `Stock Entry` | Mọi lần hàng hoá thay đổi kho |
| Phiếu giao hàng | `Delivery Note` | Xác nhận khách hàng đã nhận hàng |
| Hoá đơn bán hàng | `Sales Invoice` | Ghi nhận doanh thu và công nợ |
| Phiếu thu · phiếu nộp tiền | `Payment Entry` | Mọi lần phát sinh dòng tiền |
| Vận đơn | `DP Shipment` | Lô hàng gửi qua đơn vị vận chuyển |
| Phiếu sự cố | `Issue` | Trường hợp khách hàng báo hỏng |
| Nhóm sự cố · Loại sự cố | `Issue Group` · `Issue Type` | Hai tầng phân loại của phiếu sự cố |
| Nhắc theo vật tư | `Item Service Reminder` | Lịch nhắc của một vật tư trên một đơn hàng |
| Phiếu nhắc bảo dưỡng | `Service Ticket Reminder` | Công việc liên hệ khách hàng, gom nhiều lịch nhắc |
| Kho công ty · kho kỹ thuật viên · kho của đơn vị vận chuyển | `Warehouse` | Mọi loại kho trong hệ thống |

> **Điểm cần phân biệt:** Phiếu xuất kho, Phiếu nhập kho, Phiếu chuyển kho và Phiếu trả vật tư
> đều thuộc **cùng một loại chứng từ** (`Stock Entry`), chỉ khác nhau ở ô *Mục đích*. Tương
> tự, Phiếu thu và Phiếu nộp tiền về công ty cũng thuộc **cùng một loại** (`Payment Entry`),
> khác nhau ở ô *Loại thanh toán*.

---

## 4. Phân công vai trò và màn hình làm việc

Hệ thống có nhiều giao diện khác nhau. Mỗi vai trò làm việc trên màn hình riêng, nhưng tất cả
đều ghi vào **cùng một cơ sở dữ liệu**.

| Vai trò | Màn hình chính | Phần việc trong dây chuyền |
|---|---|---|
| Kinh doanh · Chăm sóc khách hàng | Desk (giao diện chính) | Khách tiềm năng, khách hàng, đơn bán hàng, phiếu sự cố |
| Nhân viên dịch vụ | Desk và báo cáo dịch vụ `/service-report` | Phiếu nhắc bảo dưỡng, liên hệ khách hàng, lập đơn hàng mới |
| Điều phối | Màn hình điều phối `/smart-scheduler` | Lập lịch hẹn, gán kỹ thuật viên, theo dõi lịch toàn đội |
| Kỹ thuật viên | Ứng dụng kỹ thuật viên `/technician` | Tiếp nhận công việc, check-in, yêu cầu vật tư, giao hàng, thu tiền |
| Kho | Màn hình kho `/master-stock` và Desk | Xuất hàng theo yêu cầu, duyệt phiếu trả vật tư |
| Kế toán | Desk | Hoá đơn, phiếu thu, đối chiếu công nợ |
| Quản lý dịch vụ | `/service-report` và `/fsm-report` | Theo dõi tồn đọng, hiệu suất và doanh thu dịch vụ |

> Hệ thống dịch vụ hiện trường đã **chuyển sang nền tảng mới từ tháng 03/2026**. Dữ liệu vụ
> việc phát sinh trước mốc đó nằm trên nền tảng cũ và chỉ phục vụ tra cứu; mọi vụ việc mới đều
> vận hành trên phiếu công việc (`FS Work Order`) và lịch hẹn dịch vụ (`FS Service
> Appointment`) của nền tảng mới.

---

## 5. Qui mô thực tế của từng chặng

Bảng dưới đây cho thấy chặng nào là luồng chính và chặng nào là trường hợp ngoại lệ. Số liệu
tính đến ngày **15/09/2026**.

| Chặng | Chứng từ | Số lượng |
|---|---|---|
| Tiếp nhận khách hàng | Khách tiềm năng | 93.956 |
| Chuyển đổi khách hàng | Khách hàng | 25.566 |
| Bán hàng | Đơn bán hàng | 51.152 |
| Dịch vụ hiện trường | Phiếu công việc | 16.004 |
| Dịch vụ hiện trường | Lịch hẹn dịch vụ | 15.001 |
| Vật tư | Yêu cầu vật tư | 14.878 |
| Vật tư | Phiếu kho các loại | 34.548 |
| Giao hàng | Phiếu giao hàng | 24.191 |
| Kế toán | Hoá đơn | 23.207 |
| Kế toán | Phiếu thu và phiếu nộp tiền | 33.492 |
| Chăm sóc định kỳ | Phiếu nhắc bảo dưỡng | 82.552 |
| Sự cố | Phiếu sự cố | 25.944 |
| Vận chuyển qua đối tác | Vận đơn | 27 |

Bảng trên cho thấy hai điểm đáng lưu ý:

- **Số phiếu nhắc bảo dưỡng lớn hơn số đơn hàng.** Đây là đặc thù của công tác chăm sóc định
  kỳ: mỗi khách hàng được liên hệ nhiều lần trong vòng đời thiết bị, và không phải lần liên hệ
  nào cũng phát sinh đơn hàng.
- **Lượng vận đơn qua đơn vị vận chuyển hiện còn rất nhỏ.** Phương thức giao hàng chính vẫn là
  kỹ thuật viên mang hàng đi và giao tận nơi.

---

## 6. Ba nhóm công việc tại hiện trường

Phiếu công việc được phân theo **loại việc** (`FS Work Type`). Bốn loại chiếm gần như toàn bộ
khối lượng:

| Loại việc | Số phiếu | Nguồn phát sinh phổ biến |
|---|---|---|
| Bảo dưỡng | 9.599 | Phiếu nhắc bảo dưỡng được chốt thành đơn hàng, sau đó lập phiếu công việc |
| Sự cố | 3.350 | Khách hàng báo hỏng, lập phiếu sự cố rồi lập phiếu công việc |
| Lắp đặt | 2.076 | Đơn bán thiết bị mới |
| Khảo sát | 912 | Đo mẫu nước, khảo sát mặt bằng trước khi ký hợp đồng |

Loại việc quyết định **yêu cầu khi hoàn thành phiếu**: có loại bắt buộc đính kèm ảnh, có loại
bắt buộc lập phiếu giao hàng, có loại bắt buộc thu tiền. Chọn sai loại việc dẫn tới việc hệ
thống yêu cầu những nội dung không liên quan, hoặc bỏ qua nội dung lẽ ra phải kiểm tra.

---

## 7. Bốn nguyên tắc vận hành

Bốn nguyên tắc dưới đây giải thích phần lớn các trường hợp hệ thống từ chối thao tác.

### 7.1. Chứng từ vận hành một chiều; muốn quay lại phải huỷ ngược

Mỗi chứng từ làm phát sinh chứng từ kế tiếp và đồng thời **khoá chứng từ trước đó**. Muốn điều
chỉnh một chứng từ ở giữa chuỗi, phải huỷ ngược từ cuối chuỗi trở về:

```
Phiếu thu  →  Hoá đơn  →  Phiếu giao hàng  →  Đơn bán hàng
  huỷ 1       huỷ 2         huỷ 3           mới điều chỉnh được
```

### 7.2. Trạng thái của các chứng từ độc lập với nhau

Đây là điểm dễ hiểu nhầm nhất. **Lịch hẹn hoàn tất không tự chuyển phiếu công việc sang hoàn
tất. Đơn hàng hoàn tất không tự đóng phiếu công việc. Đóng phiếu sự cố không đóng phiếu công
việc.** Mỗi chứng từ có bộ điều kiện riêng và phải được kết thúc riêng.

Đây là thiết kế có chủ đích: một vụ việc có thể cần nhiều lần xuống hiện trường, và một đơn
hàng có thể chỉ giao được một phần.

### 7.3. Chứng từ ở trạng thái nháp chưa làm thay đổi dữ liệu

Chứng từ ở trạng thái **nháp** mới chỉ là dự kiến: sổ kho chưa thay đổi, công nợ chưa thay
đổi, nghĩa vụ chưa được xoá. Chỉ khi chứng từ được **xác nhận** thì hệ thống mới ghi nhận.
Riêng phiếu trả vật tư ở trạng thái nháp có thêm một tác dụng: **giữ chỗ** phần hàng tương ứng
để kỹ thuật viên không lập trùng, dù chưa tác động tới sổ kho.

### 7.4. Một số thao tác thiếu sót không được hệ thống cảnh báo

Có những nội dung khai thiếu không làm phát sinh thông báo lỗi, nhưng hậu quả xuất hiện về sau:

| Nội dung khai thiếu | Hệ thống cảnh báo | Hậu quả |
|---|---|---|
| Khách hàng chưa được gán chương trình tích điểm | Không | Khách hàng không được cộng điểm, chỉ phát hiện khi có khiếu nại |
| Không khai người giới thiệu ở bước khách tiềm năng | Không | Người giới thiệu không được tính thưởng, khắc phục sau rất khó khăn |
| Chọn sai loại việc trên phiếu công việc | Không | Bỏ sót yêu cầu bắt buộc hoặc bị yêu cầu nội dung không cần thiết |
| Kho nguồn chưa khai điểm gửi hàng | Không | Đơn vị vận chuyển đến lấy hàng sai địa điểm |

---

## 8. Nội dung đọc tiếp

| Phạm vi công việc | Trang tham khảo |
|---|---|
| **Nắm mạch chung trước khi đi vào chi tiết** | **[Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html)** |
| Tiếp nhận và chuyển đổi khách hàng mới | [Từ khách tiềm năng đến khách hàng](Quy-Trinh-01-Khach-Hang.html) |
| Lập và điều chỉnh đơn hàng | [Đơn bán hàng](Quy-Trinh-02-Don-Hang.html) |
| Lập lịch và thực hiện tại hiện trường | [Điều phối và thực hiện tại hiện trường](Quy-Trinh-03-Hien-Truong.html) |
| Quản lý kho, cấp phát và tiếp nhận vật tư hoàn trả | [Vật tư của kỹ thuật viên](Quy-Trinh-04-Vat-Tu.html) |
| Giao hàng, xuất hoá đơn và thu tiền | [Giao hàng và thu tiền](Quy-Trinh-05-Giao-Hang-Thu-Tien.html) |
| Liên hệ khách hàng theo lịch bảo dưỡng định kỳ | [Bảo dưỡng định kỳ và vòng lặp](Quy-Trinh-06-Bao-Duong.html) |
| Tiếp nhận và xử lý trường hợp báo hỏng | [Sự cố](Quy-Trinh-07-Su-Co.html) |
| Tra cứu một tình huống bất thường | [Ngoại lệ, lỗi và bất thường](Quy-Trinh-08-Ngoai-Le.html) |
