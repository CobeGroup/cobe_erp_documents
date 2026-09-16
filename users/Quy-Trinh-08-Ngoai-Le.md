---
title: 8 · Ngoại lệ, lỗi và bất thường
layout: default
parent: Quy trình hợp nhất
nav_order: 9
---

# Chặng 8 — Ngoại lệ, lỗi và bất thường
{: .no_toc }

**Đối tượng:** mọi vai trò · **Cách sử dụng:** tra cứu theo hiện tượng đang gặp
{: .fs-3 .text-grey-dk-000 }

Trang này tập hợp toàn bộ tình huống bất thường của bảy chặng trước vào một bảng tra cứu. Mỗi
dòng nêu ba nội dung: **hiện tượng, nguyên nhân và hướng xử lý**.

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1. Bốn nguyên tắc xử lý tình huống bất thường

### 1.1. Ghi nhận nguyên văn thông báo của hệ thống

Hệ thống được thiết kế để **nêu rõ nội dung còn thiếu**, và nêu **giống nhau** trên Desk lẫn
trên ứng dụng kỹ thuật viên. Ghi lại nguyên văn thông báo đã giải quyết được phần lớn khối
lượng chẩn đoán; suy đoán không căn cứ thường dẫn tới xử lý sai trọng tâm.

### 1.2. Xác định chứng từ đang khoá

Gần như mọi trường hợp không điều chỉnh được đều do một chứng từ **phía sau** đang giữ. Trình
tự tra cứu:

```
Phiếu thu  →  Hoá đơn  →  Phiếu giao hàng  →  Đơn bán hàng
Lịch hẹn   →  Phiếu công việc  →  Đơn bán hàng
```

Muốn tác động tới một chứng từ, phải xử lý hết các chứng từ nằm bên phải nó trước.

### 1.3. Không xử lý vòng tránh

Khi hệ thống từ chối thao tác, không lập thêm chứng từ mới để đi vòng: lập thêm một đơn để bù
trừ, lập thêm một phiếu trả cho phần đã trả, hoặc lập thêm một phiếu thu cho khoản đã thu. Các
cách này làm sai lệch sổ kho và công nợ, và rất khó khắc phục về sau. Hướng xử lý đúng là
**huỷ ngược rồi thực hiện lại**, hoặc chuyển cho vai trò có thẩm quyền.

### 1.4. Phân biệt trường hợp bị từ chối và trường hợp không được cảnh báo

| Loại | Dấu hiệu | Mức độ rủi ro |
|---|---|---|
| **Hệ thống từ chối** | Có thông báo lỗi, không lưu được | Thấp — phát hiện và khắc phục ngay |
| **Hệ thống không cảnh báo** | Không có thông báo, kết quả sai xuất hiện về sau | **Cao** — chỉ phát hiện khi khách hàng khiếu nại hoặc khi đối chiếu số liệu |

Nhóm thứ hai được liệt kê riêng tại [mục 3](#3-các-trường-hợp-hệ-thống-không-cảnh-báo).

---

## 2. Bảng tra cứu theo hiện tượng

### 2.1. Khách hàng, liên hệ, địa chỉ

| Hiện tượng | Nguyên nhân | Hướng xử lý |
|---|---|---|
| `Could not find Row #2: Link Name: <tên>` khi lưu đơn hoặc lưu địa chỉ | Hồ sơ khách hàng đang trỏ tới một phiếu khách tiềm năng đã được đổi tên | Tìm lại phiếu đúng theo số điện thoại rồi cập nhật ô **Lead** trên hồ sơ khách hàng. Xem [hướng dẫn chi tiết](Sua-Loi-Lien-Ket-Khach-Hang.html) |
| Một số điện thoại ứng với nhiều phiếu khách tiềm năng | Khách hàng liên hệ nhiều lần qua nhiều kênh | Chọn phiếu ở trạng thái *Converted* và có thông tin trùng khớp nhất; các phiếu còn lại giữ làm dữ liệu lịch sử |
| Ô **Lead** bị khoá, không điều chỉnh được | Ô chỉ mở cho vai trò quản trị | Gửi quản trị viên mã khách hàng đang lỗi và mã phiếu đúng |
| Khách hàng được xếp vào **sai công ty** | Nguồn khách hàng khai cho nhiều công ty nên hệ thống không suy ra được | Cập nhật thủ công ô Công ty trước khi chuyển đổi |
| Phát sinh bản trùng của liên hệ hoặc địa chỉ | Không tìm theo số điện thoại trước khi lập mới | Xoá bản vừa lập và gắn lại bản cũ qua bảng **Links** |

### 2.2. Đơn bán hàng

| Hiện tượng | Nguyên nhân | Hướng xử lý |
|---|---|---|
| `Không cho phép thay đổi items…` | Hàng vật lý của đơn đã xuất kho | Huỷ phiếu xuất kho hoặc phiếu giao hàng trước, hoặc chuyển quản trị viên |
| `Không thể Close Sales Order này vì đã có Delivery Note` | Còn phiếu giao hàng hiệu lực | Huỷ phiếu giao hàng trước |
| `Không cho phép thay đổi Bank Account…` | Đơn đã có phiếu thu | Huỷ phiếu thu, cập nhật, lập lại phiếu thu |
| `Tổng tiền trong Payment Method phải bằng Grand Total` | Bảng phương thức thanh toán lệch tổng | Cập nhật số tiền từng dòng cho khớp |
| `Bắt buộc phải có ít nhất 1 Sales Person` | Đội bán hàng chưa được khai | Bổ sung tối thiểu một nhân sự |
| `Không thể chọn trùng người trong Sales Team` | Trùng nhân sự bán hàng | Loại bỏ dòng trùng |
| Biên bản bàn giao lệch số tiền sau khi điều chỉnh đơn | Thay đổi tổng giá trị nhưng chưa cập nhật bảng phương thức thanh toán | Cập nhật bảng phương thức cho khớp tổng mới |
| Ô dữ liệu bị khoá sau khi xác nhận | Ô không cho phép điều chỉnh sau khi xác nhận | Áp dụng phương án **Huỷ và lập lại** |

### 2.3. Phiếu công việc và lịch hẹn

| Hiện tượng | Nguyên nhân | Hướng xử lý |
|---|---|---|
| Lịch hẹn và đơn đã hoàn tất nhưng **phiếu công việc vẫn ở New** | Chưa đáp ứng một trong sáu điều kiện, hoặc chưa hết thời gian ân hạn | Thực hiện hoàn thành thủ công để hệ thống nêu đúng nguyên nhân |
| Phiếu đủ điều kiện nhưng **tác vụ tự động vẫn bỏ qua** | Phiếu đang ở *On Hold*, hoặc chưa hết ân hạn | Chuyển phiếu về *In Progress*, hoặc chờ đủ số ngày |
| Không hoàn thành được: *“SO … còn nợ …”* | Tổng phiếu thu đã chính thức chưa bằng giá trị đơn | Xem còn phiếu thu nào đang ở trạng thái nháp; xử lý theo [Chặng 5 mục 6](Quy-Trinh-05-Giao-Hang-Thu-Tien.html#6-phiếu-công-việc-bị-chặn-vì-lý-do-thanh-toán) |
| Không hoàn thành được: *“thu tiền mặt nhưng chưa có Internal Transfer”* | Khoản tiền mặt chưa có phiếu nộp được xác nhận, hoặc phiếu nộp không gắn liên kết | Lập phiếu nộp từ ứng dụng, chọn đúng khoản thu |
| Không hoàn thành được: *“Sales Order not completed”* | Đơn liên kết chưa ở *Hoàn tất* hoặc *Đóng đơn*, thường do chưa có hoá đơn | Xuất nốt hoá đơn sau khi đã thu đủ |
| Không hoàn thành được: *“Chưa trả kho đủ”* | Tham số kiểm tra vật tư đang bật | Lập phiếu trả và chờ kho duyệt |
| Phiếu công việc **không có lịch hẹn nào** | Điều kiện yêu cầu tối thiểu một lịch hẹn đang bật | Lập một lịch hẹn phản ánh đúng công việc đã thực hiện |
| Hoàn thành lịch hẹn báo còn nhân sự *Pending* | Còn kỹ thuật viên chưa check-out | Nhân sự đó check-out, hoặc loại khỏi lịch và phân bổ lại tỉ lệ đóng góp |
| Không hiển thị chức năng tạo lịch hẹn | Phiếu công việc đã ở trạng thái **Closed** | Sử dụng chức năng **Re-open** |
| Mở lại lịch hẹn làm mất dữ liệu check-in | Mở lại từ *Canceled* hoặc *Cannot Complete* sẽ xoá dữ liệu thực tế | Nên lập lịch hẹn mới thay vì mở lại |
| Không huỷ được lịch hẹn | Đang ở trạng thái khoá | Chuyển trạng thái trước, và nhập **lý do huỷ** |

### 2.4. Vật tư và kho

| Hiện tượng | Nguyên nhân | Hướng xử lý |
|---|---|---|
| Dòng nghĩa vụ hiển thị mờ và bị khoá | Phần đó đang nằm trong phiếu nháp chờ kho duyệt | Tra mã phiếu ghi trên dòng; chờ duyệt hoặc xoá phiếu nháp |
| Đã hoàn trả nhưng **nghĩa vụ vẫn còn** | Phiếu trả còn ở trạng thái nháp | Chỉ phiếu **đã duyệt** mới xoá nghĩa vụ |
| Không xoá được phiếu nháp | Phiếu do người khác lập | Đề nghị người lập hoặc quản trị viên xoá |
| Nghĩa vụ trỏ tới **mã vật tư không tồn tại** | Nghĩa vụ là bản ghi tại thời điểm giao hàng; đổi tên mã vật tư về sau không cập nhật bản ghi | Cần tác vụ xử lý dữ liệu, không khắc phục được trên ứng dụng |
| Nghĩa vụ **bộ sản phẩm** không khớp thành phần | Hệ thống khai triển bộ theo cấu hình **hiện tại** | Đối chiếu thủ công với phiếu giao hàng gốc |
| Nghĩa vụ **không ghi kho nguồn** | Dữ liệu cũ | Nghĩa vụ hiển thị ở mọi kho của nhân sự đó; chọn đúng kho đang giữ hàng |
| Phiếu trả **được ghi nhận vào kho của nhân sự khác** | Nghĩa vụ không khai kho đích nên hệ thống chọn kho đầu danh sách | Kiểm tra kho đích trước khi gửi; đề nghị quản trị viên khai kho hoàn trả mặc định |
| Kho kỹ thuật viên **âm tồn** | Xuất hoặc giao vượt số lượng thực nhận | Kiểm kê lại; chưa xử lý xong thì không bật tham số kiểm soát chặt |
| Duyệt nhầm **phiếu nháp tồn đọng** | Phiếu tồn từ trước, trỏ vào nghĩa vụ đã được hoàn trả | Các phiếu này cần được **xoá**, không duyệt |
| Hàng được cấp **ngoài phiếu yêu cầu** | Hệ thống chỉ theo dõi phần tiếp nhận qua phiếu yêu cầu | Kiểm kê thủ công phần ngoài luồng |

### 2.5. Giao hàng và dòng tiền

| Hiện tượng | Nguyên nhân | Hướng xử lý |
|---|---|---|
| *“Chưa tạo phiếu giao hàng…”* khi thu tiền | Chưa lập phiếu giao hàng cho đơn | Lập phiếu giao hàng trước |
| Không xác nhận được phiếu giao hàng | Có đơn bị hoàn trả toàn bộ số món | Mỗi đơn phải giao tối thiểu một món |
| Chức năng xác nhận không kích hoạt ở màn hình ký | Khách hàng chưa ký xác nhận | Đề nghị khách hàng ký lại |
| Đã thu tiền nhưng đơn **vẫn hiển thị còn nợ** | Phiếu thu chuyển khoản còn ở trạng thái nháp, chưa được kế toán xác nhận | Đề nghị kế toán đối chiếu sao kê và xác nhận phiếu |
| Đã thu tiền mặt nhưng **vẫn còn công nợ cá nhân** | Chưa lập phiếu nộp tiền về công ty, hoặc phiếu nộp còn nháp | Lập phiếu nộp; đề nghị kế toán xác nhận |
| Đã nộp tiền nhưng hệ thống **vẫn báo chưa nộp** | Phiếu nộp lập trên Desk, không gắn liên kết với khoản thu | Lập lại phiếu nộp từ ứng dụng, chọn đúng khoản thu |
| *“đã trả về … nhưng thu … (thiếu …)”* | Tổng đã nộp nhỏ hơn tổng đã thu; hệ thống **không có dung sai** | Nộp nốt phần chênh lệch, kể cả khi chỉ lệch một đồng |
| Báo *“… đã có dòng Tiền mặt”* khi thêm dòng thu | Một đơn không được có hai dòng cùng hình thức trong một lần thu | Sửa số tiền trên dòng đã có, hoặc thu lần thứ hai |
| Kỹ thuật viên bị ghi công nợ cá nhân **không có thật** | Chọn nhầm hình thức tiền mặt cho khoản khách hàng đã chuyển khoản | Huỷ phiếu thu trong 24 giờ và lập lại đúng hình thức; quá hạn thì chuyển kế toán |
| Không nộp được tiền | Nộp trùng, hoặc nộp quá số đang giữ | Kiểm tra lại các phiếu nộp đã lập |
| Không huỷ được phiếu thu vừa lập | Quá thời hạn cho phép, hoặc đã có phiếu nộp đối ứng | Chuyển kế toán xử lý |
| Đơn đã giao đủ nhưng **chưa chuyển Hoàn tất** | Chưa xuất hoá đơn đủ 100% | Xuất nốt hoá đơn |
| Vận đơn đã xác nhận nhưng **tồn kho chưa thay đổi** | Đúng thiết kế: xác nhận chỉ phát sinh đề nghị xuất kho | Kho phải lập phiếu xuất kho thực tế |
| Vận đơn *Delivered* nhưng **không thấy chứng từ tự phát sinh** | Vận đơn không gắn đơn bán hàng, hoặc kết nối chưa được bật | Kiểm tra bảng chứng từ nguồn trên vận đơn |
| Đơn vị vận chuyển tính **sai cước, sai số kiện** | Tab kiện hàng và người trả cước khai sai trước khi đẩy đơn | Cập nhật **trước khi đẩy đơn** |
| Đơn vị vận chuyển huỷ đơn khi hàng đã được lấy đi | Hàng đang trên đường hoàn về | **Chưa huỷ vận đơn**; chờ kho tiếp nhận lại hàng trên thực tế |

### 2.6. Bảo dưỡng và sự cố

| Hiện tượng | Nguyên nhân | Hướng xử lý |
|---|---|---|
| Khách hàng đã mua nhưng **không có phiếu nhắc** | Đơn chưa ở trạng thái *Completed*, hoặc mặt hàng chưa khai chu kỳ nhắc | Kiểm tra tiến độ đơn; đề nghị quản trị viên khai chu kỳ |
| Một khách hàng có **nhiều phiếu nhắc trùng nhau** | Khác địa chỉ, hoặc ngày đến hạn cách xa nên không gom được | Gộp thủ công, đóng bớt phiếu thừa kèm ghi chú |
| Đã lập đơn nhưng **phiếu nhắc vẫn ở Open** | Đơn lập thủ công, mất liên kết ngược | Đề nghị quản trị viên gắn lại, hoặc đóng phiếu thủ công |
| Phiếu nhắc được phân cho nhân sự không phù hợp | Chưa khai chuyên môn hoặc địa bàn phụ trách | Khai bổ sung rồi phân công lại |
| Nhân sự nghỉ việc nhưng khách hàng quen **không được chuyển giao** | Số điện thoại công ty chưa được bàn giao | Bàn giao số điện thoại theo quy trình |
| Ô **Loại sự cố** không có giá trị sau khi chọn nhóm | Nhóm đó chưa được khai loại nào | Chọn nhóm khác, hoặc đề nghị quản trị viên khai |
| Phiếu sự cố tồn đọng ở **On Hold** trong thời gian dài | Chờ linh kiện, chờ khách hàng, hoặc chưa được theo dõi | Rà soát định kỳ danh sách *On Hold* |
| Đơn sửa chữa **không truy được về trường hợp sự cố** | Đơn lập thủ công thay vì lập từ chức năng trên phiếu | Đề nghị quản trị viên gắn lại liên kết |

### 2.7. Phân quyền và giao diện

| Hiện tượng | Nguyên nhân | Hướng xử lý |
|---|---|---|
| Không hiển thị một chức năng lẽ ra phải có | Tài khoản chưa được cấp quyền cho chức năng đó | Đề nghị quản trị viên cấp vai trò tương ứng |
| Không hiển thị một tab hoặc một ô trên form | Ô bị ẩn theo cấu hình hiển thị | Sử dụng chế độ xem dạng báo cáo để bổ sung cột, hoặc đề nghị quản trị viên đưa ô ra tab đang hiển thị |
| Danh sách không có bản ghi nào dù dữ liệu tồn tại | Bộ lọc được lưu từ phiên trước, hoặc giới hạn quyền theo người phụ trách | Xoá toàn bộ bộ lọc rồi xem lại |
| Giao diện hiển thị phiên bản cũ sau khi hệ thống được cập nhật | Trình duyệt lưu bản cũ trong bộ nhớ đệm | Tải lại trang bằng tổ hợp phím bỏ qua bộ nhớ đệm |

---

## 3. Các trường hợp hệ thống không cảnh báo

Đây là nhóm rủi ro cao nhất: thao tác khai thiếu nhưng không phát sinh thông báo lỗi.

| Nội dung khai thiếu | Hậu quả | Cách phát hiện |
|---|---|---|
| Khách hàng chưa được gán **chương trình tích điểm** | Khách hàng không được cộng điểm | Xem danh sách khách hàng ở chế độ báo cáo, bổ sung cột chương trình tích điểm |
| Không khai **người giới thiệu** ở bước khách tiềm năng | Người giới thiệu không được tính thưởng | Kiểm tra ô nguồn và ô người giới thiệu trước khi chuyển đổi |
| Chọn **sai loại việc** trên phiếu công việc | Bỏ sót yêu cầu bắt buộc, hoặc bị yêu cầu nội dung không cần thiết | Rà soát loại việc ngay khi phiếu vừa được lập |
| Mặt hàng **chưa khai chu kỳ nhắc** | Khách hàng không được nhắc bảo dưỡng | Đối chiếu danh mục hàng hoá với danh mục chu kỳ nhắc |
| Lập đơn thủ công thay vì lập từ chứng từ gốc | Mất liên kết ngược, chứng từ gốc không tự đóng, kết quả không được ghi nhận | Rà soát các phiếu nhắc còn ở *Open* của khách hàng đã mua |
| Kho nguồn **chưa khai điểm gửi hàng** | Đơn vị vận chuyển đến lấy hàng sai địa điểm | Kiểm tra khai báo điểm gửi trên từng kho |
| Kỹ thuật viên **chưa được khai kho** cho một công ty | Mọi thao tác vật tư tại công ty đó báo lỗi | Phát hiện ngay khi thao tác, nhưng thường chỉ khi đã tới hiện trường |

---

## 4. Khác biệt giữa các công ty

Tập đoàn vận hành nhiều pháp nhân trên cùng một hệ thống. Các điểm khác biệt cần lưu ý:

| Nội dung | Tách theo công ty | Hệ quả |
|---|---|---|
| Kho, tồn kho, kho kỹ thuật viên | **Có** | Không chuyển trực tiếp hàng giữa hai công ty bằng phiếu chuyển kho thông thường |
| Tài khoản đơn vị vận chuyển và điểm gửi | **Có** | Chọn nhầm tài khoản của công ty khác sẽ bị từ chối khi lưu |
| Danh mục hàng hoá, danh mục sự cố | Dùng chung | Khai một lần, áp dụng cho mọi công ty |
| Cấu hình dịch vụ hiện trường | Dùng chung | Thay đổi một tham số sẽ áp dụng cho tất cả |
| Nhân sự phụ trách, chuyên môn, địa bàn | Khai **theo từng công ty hoặc để chung** | Để trống nghĩa là áp dụng cho mọi công ty |

Dấu hiệu nhận biết nhanh trên tên tài khoản và tên kho: **hậu tố viết tắt tên công ty**.

---

## 5. Đầu mối tiếp nhận

| Loại vướng mắc | Đầu mối | Thông tin cần gửi kèm |
|---|---|---|
| Ô dữ liệu bị khoá, cần huỷ cả chuỗi chứng từ | Quản trị hệ thống | Mã chứng từ và mô tả nội dung cần điều chỉnh |
| Vướng mắc về hoá đơn, phiếu thu, công nợ | Kế toán | Mã đơn, mã hoá đơn, mã phiếu thu |
| Tính lại hoa hồng, điều chỉnh đội bán hàng | Quản lý kinh doanh | Mã đơn |
| Sai danh mục: loại sự cố, chu kỳ nhắc, chuyên môn, địa bàn | Quản trị danh mục | Tên danh mục cần khai và giá trị đúng |
| Nghĩa vụ trả trỏ mã hàng không tồn tại, kho âm tồn | Bộ phận kỹ thuật | Mã nghĩa vụ, mã kho, ảnh chụp màn hình |
| Không hiển thị chức năng, thiếu quyền truy cập | Quản trị hệ thống | Tên tài khoản và tên màn hình |

Khi gửi yêu cầu, luôn kèm **nguyên văn thông báo lỗi** và **mã chứng từ**. Hai nội dung này rút
ngắn thời gian xử lý hơn mọi mô tả dài dòng.

---

## 6. Quay lại trang tổng quan

**[Tổng quan toàn chuỗi](Quy-Trinh-Tong-Quan.html)**
