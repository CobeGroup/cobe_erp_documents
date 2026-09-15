---
title: 8 · Ngoại lệ, lỗi và bất thường
layout: default
parent: Quy trình hợp nhất
nav_order: 9
---

# Chặng 8 — Ngoại lệ, lỗi và bất thường
{: .no_toc }

**Dành cho:** mọi vai trò · **Cách dùng:** tra theo triệu chứng đang gặp
{: .fs-3 .text-grey-dk-000 }

Trang này gom mọi tình huống bất thường của bảy chặng trước thành một chỗ tra nhanh. Mỗi dòng
trả lời ba câu: **thấy gì · vì sao · làm gì**.

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1. Bốn nguyên tắc xử lý bất thường

### 1.1. Đọc nguyên văn thông báo trước đã

Hệ thống được viết để **nói rõ thiếu gì**, và nói **giống nhau** trên Desk lẫn trên ứng dụng
kỹ thuật viên. Chụp lại nguyên văn thông báo là đã giải quyết được nửa vấn đề; đoán mò thường
dẫn tới sửa nhầm chỗ.

### 1.2. Xác định chứng từ nào đang khoá

Gần như mọi ca *“không sửa được”* đều do một chứng từ **phía sau** đang giữ. Trình tự tra:

```
Phiếu thu  →  Hoá đơn  →  Phiếu giao hàng  →  Đơn bán hàng
Lịch hẹn   →  Phiếu công việc  →  Đơn bán hàng
```

Muốn đụng vào một chứng từ, phải xử lý hết những cái nằm bên phải nó trước.

### 1.3. Đừng lách

Khi bị chặn, tuyệt đối không tạo chứng từ mới để đi vòng — lập thêm một đơn để “bù”, lập thêm
một phiếu trả cho phần đã trả, lập thêm phiếu thu cho khoản đã thu. Cách đó khiến sổ kho và
công nợ lệch, và về sau rất khó gỡ. Đúng quy trình là **huỷ ngược rồi làm lại**, hoặc chuyển
cho người có quyền.

### 1.4. Phân biệt “hệ thống chặn” với “hệ thống im lặng”

| Loại | Dấu hiệu | Mức nguy hiểm |
|---|---|---|
| **Hệ thống chặn** | Báo đỏ, không lưu được | Thấp — biết ngay, sửa ngay |
| **Hệ thống im lặng** | Không báo gì, nhưng kết quả sai xuất hiện về sau | **Cao** — phát hiện khi khách khiếu nại hoặc khi đối chiếu |

Nhóm thứ hai được liệt kê riêng ở [mục 3](#3-những-chỗ-hệ-thống-im-lặng).

---

## 2. Tra nhanh theo triệu chứng

### 2.1. Khách hàng, liên hệ, địa chỉ

| Thấy gì | Vì sao | Làm gì |
|---|---|---|
| `Could not find Row #2: Link Name: <tên người>` khi lưu đơn hoặc lưu địa chỉ | Hồ sơ khách đang trỏ tới một phiếu khách tiềm năng đã bị đổi tên | Tìm lại phiếu đúng theo số điện thoại rồi sửa ô **Lead** trên hồ sơ khách. Xem [hướng dẫn chi tiết](Sua-Loi-Lien-Ket-Khach-Hang.html) |
| Một số điện thoại ra nhiều phiếu khách tiềm năng | Khách liên hệ nhiều lần qua nhiều kênh | Chọn phiếu đã *Converted* và khớp thông tin nhất; giữ các phiếu còn lại làm lịch sử |
| Ô **Lead** bị xám, không sửa được | Ô chỉ mở cho vai trò quản trị | Gửi quản trị: mã khách đang lỗi và mã phiếu đúng |
| Khách rơi vào **sai công ty** | Nguồn được khai cho nhiều công ty nên hệ thống không suy ra được | Sửa tay ô Công ty trước khi chuyển đổi |
| Tạo trùng liên hệ hoặc địa chỉ | Không tìm theo số điện thoại trước khi tạo | Xoá bản vừa tạo, gắn lại bản cũ qua bảng **Links** |

### 2.2. Đơn bán hàng

| Thấy gì | Vì sao | Làm gì |
|---|---|---|
| `Không cho phép thay đổi items…` | Hàng vật lý của đơn đã xuất kho | Huỷ phiếu xuất hoặc phiếu giao trước, hoặc nhờ quản trị |
| `Không thể Close Sales Order này vì đã có Delivery Note` | Còn phiếu giao hàng hiệu lực | Huỷ phiếu giao hàng trước |
| `Không cho phép thay đổi Bank Account…` | Đơn đã có phiếu thu | Huỷ phiếu thu → sửa → lập lại |
| `Tổng tiền trong Payment Method phải bằng Grand Total` | Bảng phương thức thanh toán lệch tổng | Sửa số tiền từng dòng cho khớp |
| `Bắt buộc phải có ít nhất 1 Sales Person` | Đội bán hàng để trống | Thêm ít nhất một người |
| `Không thể chọn trùng người trong Sales Team` | Trùng người bán | Bỏ dòng trùng |
| Sửa đơn xong thì **biên bản bàn giao lệch tiền** | Đổi tổng tiền mà không sửa lại bảng phương thức thanh toán | Sửa bảng phương thức cho khớp tổng mới |
| Field bị xám sau khi xác nhận | Field không cho sửa sau khi xác nhận | Dùng **Huỷ và lập lại** |

### 2.3. Phiếu công việc và lịch hẹn

| Thấy gì | Vì sao | Làm gì |
|---|---|---|
| Lịch hẹn và đơn đã xong mà **phiếu công việc vẫn New** | Vướng một trong sáu điều kiện, hoặc chưa hết thời gian ân hạn | Bấm hoàn thành tay để hệ thống nêu đúng lý do |
| Phiếu đủ điều kiện mà **tác vụ đêm vẫn bỏ qua** | Phiếu đang *On Hold*, hoặc chưa hết ân hạn | Đưa phiếu về *In Progress*, hoặc chờ đủ ngày |
| Không hoàn thành được: *“SO chưa thanh toán đủ”* | Công tắc kiểm công nợ đang bật | Thu nốt tiền |
| Không hoàn thành được: *“Chưa trả kho đủ”* | Công tắc kiểm vật tư đang bật | Lập phiếu trả, chờ kho duyệt |
| Phiếu công việc **không có lịch hẹn nào** | Điều kiện “phải có ít nhất một lịch hẹn” đang bật | Lập một lịch hẹn cho đúng thực tế đã làm |
| Hoàn thành lịch hẹn báo còn người *Pending* | Còn kỹ thuật viên chưa check-out | Người đó check-out, hoặc gỡ khỏi lịch và chia lại tỉ lệ đóng góp |
| Không thấy nút tạo lịch hẹn | Phiếu công việc đã **Closed** | Bấm **Re-open** |
| Mở lại lịch hẹn xong **mất sạch dữ liệu check-in** | Mở lại từ *Canceled* hoặc *Cannot Complete* sẽ xoá dữ liệu thực tế | Lần sau tạo lịch hẹn mới thay vì mở lại |
| Không huỷ được lịch hẹn | Đang ở trạng thái khoá | Đổi trạng thái trước, và nhập **lý do huỷ** |

### 2.4. Vật tư và kho

| Thấy gì | Vì sao | Làm gì |
|---|---|---|
| Dòng nghĩa vụ **mờ và khoá** | Phần đó đang nằm trong phiếu nháp chờ kho | Đọc mã phiếu ghi trên dòng; chờ kho duyệt hoặc xoá phiếu nháp |
| Trả hàng rồi mà **nợ vẫn treo** | Phiếu trả còn nháp | Chỉ phiếu **đã duyệt** mới xoá nợ |
| Không xoá được phiếu nháp | Phiếu do người khác lập | Nhờ người lập hoặc quản trị xoá |
| Nghĩa vụ trỏ tới **mã vật tư không tồn tại** | Nghĩa vụ là bản chụp lúc giao hàng; đổi tên mã về sau không cập nhật bản chụp | Cần tác vụ dữ liệu, không tự xử lý trên ứng dụng |
| Nghĩa vụ **bộ sản phẩm** không khớp thành phần | Hệ thống nở bộ theo cấu hình **hiện tại** | Đối chiếu tay với phiếu giao hàng gốc |
| Nghĩa vụ **không ghi kho nguồn** | Dữ liệu cũ | Nghĩa vụ hiện ở mọi kho của người đó; chọn đúng kho đang giữ hàng |
| Phiếu trả **về nhầm kho người khác** | Nghĩa vụ không khai kho đích nên hệ thống chọn kho đầu danh sách | Kiểm kho đích trước khi gửi; báo quản trị khai kho trả mặc định |
| Kho kỹ thuật viên **âm tồn** | Xuất hoặc giao vượt số thực nhận | Kiểm kê lại; chưa dọn xong thì không bật công tắc chặn cứng |
| Duyệt nhầm **phiếu nháp cũ** | Phiếu tồn từ trước, trỏ vào nghĩa vụ đã trả xong | Những phiếu này phải **xoá**, không phải duyệt |
| Hàng được cấp **ngoài phiếu yêu cầu** | Hệ thống chỉ đòi trả phần nhận qua phiếu yêu cầu | Kiểm kê thủ công phần ngoài luồng |

### 2.5. Giao hàng và tiền

| Thấy gì | Vì sao | Làm gì |
|---|---|---|
| *“Chưa tạo phiếu giao hàng…”* khi thu tiền | Chưa có phiếu giao hàng cho đơn đó | Lập phiếu giao hàng trước |
| Không xác nhận được phiếu giao hàng | Có đơn bị trả hết mọi món | Mỗi đơn phải giao ít nhất một món |
| Nút xác nhận không bật ở màn ký tên | Khách chưa ký | Cho khách ký lại |
| Đã thu tiền mặt nhưng **vẫn treo công nợ** | Chưa lập phiếu nộp về công ty | Lập phiếu nộp |
| Không nộp được tiền | Nộp trùng, hoặc nộp quá số đang giữ | Kiểm lại các phiếu nộp đã lập |
| Không huỷ được phiếu thu vừa lập | Quá thời gian cho phép, hoặc đã có phiếu nộp đối ứng | Chuyển kế toán xử lý |
| Đơn đã giao đủ nhưng **chưa Hoàn tất** | Chưa xuất hoá đơn đủ 100% | Xuất nốt hoá đơn |
| Vận đơn xác nhận rồi mà **tồn kho chưa đổi** | Đúng thiết kế: xác nhận chỉ sinh đề nghị xuất kho | Kho phải lập phiếu xuất kho thật |
| Vận đơn *Delivered* mà **không thấy chứng từ tự sinh** | Vận đơn không gắn đơn bán hàng, hoặc kết nối chưa bật | Kiểm bảng chứng từ nguồn trên vận đơn |
| Đơn vị vận chuyển thu **sai cước, sai số kiện** | Tab kiện hàng và người trả cước khai sai trước khi đẩy đơn | Sửa **trước khi đẩy đơn** |
| Đơn bị đơn vị vận chuyển huỷ mà hàng đã lấy đi | Hàng đang trên đường về | **Chưa huỷ vận đơn** — chờ kho nhận lại hàng thật |

### 2.6. Bảo dưỡng và sự cố

| Thấy gì | Vì sao | Làm gì |
|---|---|---|
| Khách mua rồi nhưng **không có phiếu nhắc** | Đơn chưa *Completed*, hoặc món chưa khai chu kỳ nhắc | Kiểm tiến độ đơn; báo quản trị khai chu kỳ |
| Một khách có **nhiều phiếu nhắc trùng** | Khác địa chỉ, hoặc ngày hẹn cách xa nên không gom được | Gộp thủ công, đóng bớt phiếu thừa kèm ghi chú |
| Đã chốt đơn nhưng **phiếu nhắc vẫn Open** | Đơn lập tay, mất đường dẫn ngược | Nhờ quản trị gắn lại, hoặc đóng phiếu thủ công |
| Phiếu nhắc về tay người không phù hợp | Chưa khai chuyên môn hoặc khu vực phụ trách | Khai bổ sung rồi gán lại |
| Nhân viên nghỉ mà khách quen **không chuyển sang ai** | Số điện thoại công ty chưa được bàn giao | Bàn giao số theo quy trình |
| Ô **Loại sự cố** rỗng sau khi chọn nhóm | Nhóm đó chưa có loại nào | Chọn nhóm khác, hoặc báo quản trị |
| Phiếu sự cố treo **On Hold** rất lâu | Chờ linh kiện, chờ khách, hoặc bị bỏ quên | Rà định kỳ danh sách *On Hold* |
| Đơn sửa chữa **không truy được về ca sự cố** | Đơn lập tay thay vì lập từ nút trên phiếu | Nhờ quản trị gắn lại đường dẫn |

### 2.7. Quyền và giao diện

| Thấy gì | Vì sao | Làm gì |
|---|---|---|
| Không thấy một nút lẽ ra phải có | Vai trò của tài khoản chưa được cấp quyền cho chức năng đó | Báo quản trị cấp vai trò tương ứng |
| Không thấy một tab hoặc một ô trên form | Ô bị ẩn theo cấu hình hiển thị | Dùng chế độ xem dạng báo cáo để thêm cột, hoặc báo quản trị đưa ô ra tab đang hiện |
| Danh sách không có bản ghi nào dù biết là có | Bộ lọc đang lưu từ lần trước, hoặc giới hạn quyền theo người phụ trách | Xoá hết bộ lọc rồi xem lại |
| Giao diện vẫn hiện bản cũ sau khi hệ thống được cập nhật | Trình duyệt giữ bản cũ trong bộ nhớ đệm | Tải lại trang bằng tổ hợp bỏ qua bộ nhớ đệm |

---

## 3. Những chỗ hệ thống im lặng

Nhóm nguy hiểm nhất: làm thiếu mà không có báo lỗi nào.

| Làm thiếu | Hậu quả | Phát hiện bằng cách nào |
|---|---|---|
| Khách chưa được gán **chương trình tích điểm** | Khách không nhận điểm nào | Xem danh sách khách ở chế độ báo cáo, thêm cột chương trình tích điểm |
| Không khai **người giới thiệu** ở bước khách tiềm năng | Người giới thiệu mất thưởng | Kiểm ô nguồn và ô người giới thiệu trước khi chuyển đổi |
| Chọn **sai loại việc** trên phiếu công việc | Bỏ sót yêu cầu bắt buộc, hoặc bị đòi thứ không cần | Rà lại loại việc khi phiếu vừa lập |
| Món hàng **chưa khai chu kỳ nhắc** | Khách không bao giờ được nhắc bảo dưỡng | Đối chiếu danh mục hàng với danh mục chu kỳ nhắc |
| Lập đơn tay thay vì lập từ nút trên chứng từ gốc | Mất đường dẫn ngược, phiếu gốc không tự đóng, công không được ghi | Rà các phiếu nhắc còn *Open* của khách đã mua |
| Kho nguồn **chưa khai điểm gửi hàng** | Đơn vị vận chuyển tới lấy hàng nhầm kho | Kiểm khai báo điểm gửi trên từng kho |
| Kỹ thuật viên **chưa được khai kho** cho một công ty | Mọi thao tác vật tư ở công ty đó báo lỗi | Xảy ra là biết ngay, nhưng chỉ khi đã tới hiện trường |

---

## 4. Khác biệt giữa các công ty

Tập đoàn vận hành nhiều pháp nhân trên cùng một hệ thống. Vài điểm khác nhau cần biết:

| Thứ | Tách theo công ty không | Hệ quả |
|---|---|---|
| Kho, tồn kho, kho kỹ thuật viên | **Có** | Không chuyển thẳng hàng giữa hai công ty bằng phiếu chuyển kho thường |
| Tài khoản đơn vị vận chuyển và điểm gửi | **Có** | Chọn nhầm tài khoản của công ty khác là bị chặn lúc lưu |
| Danh mục hàng, danh mục sự cố | Dùng chung | Khai một lần, mọi công ty dùng |
| Cấu hình dịch vụ hiện trường | Dùng chung | Bật một công tắc là áp cho tất cả |
| Nhân sự phụ trách, chuyên môn, khu vực | Khai được **theo từng công ty hoặc để chung** | Để trống nghĩa là áp cho mọi công ty |

Dấu hiệu nhận biết nhanh trên tên tài khoản và tên kho: **hậu tố viết tắt tên công ty**.

---

## 5. Gửi cho ai

| Loại vướng mắc | Gửi cho | Kèm theo |
|---|---|---|
| Field bị khoá, cần huỷ cả chuỗi chứng từ | Quản trị hệ thống | Mã chứng từ và mô tả việc cần sửa |
| Vướng hoá đơn, phiếu thu, công nợ | Kế toán | Mã đơn, mã hoá đơn, mã phiếu thu |
| Tính lại hoa hồng, sửa đội bán hàng | Quản lý kinh doanh | Mã đơn |
| Sai danh mục: loại sự cố, chu kỳ nhắc, chuyên môn, khu vực | Quản trị danh mục | Tên mục cần khai và giá trị đúng |
| Nghĩa vụ trả trỏ mã hàng không tồn tại, kho âm tồn | Bộ phận kỹ thuật | Mã nghĩa vụ, mã kho, ảnh chụp màn hình |
| Không thấy nút, không thấy tab, thiếu quyền | Quản trị hệ thống | Tên tài khoản và tên màn hình |

Khi gửi, luôn kèm **nguyên văn thông báo lỗi** và **mã chứng từ**. Hai thứ đó rút ngắn thời
gian xử lý hơn mọi mô tả dài dòng.

---

## 6. Quay lại đầu

Cần xem lại toàn cảnh: **[Tổng quan toàn chuỗi](Quy-Trinh-Tong-Quan.html)**.
