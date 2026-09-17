---
title: Khi gặp trục trặc
layout: default
parent: Quy trình hợp nhất
nav_order: 60
---

<!-- Trang sinh tự động bởi _tools/quy_trinh/build.py từ _quy_trinh/. Sửa tệp dữ liệu rồi chạy lại bộ sinh; sửa thẳng trang này sẽ bị ghi đè. -->

# Khi gặp trục trặc
{: .no_toc }

**Dùng khi:** đang bị chặn, đang thấy một thông báo lạ, hoặc kết quả không như mong đợi
{: .fs-3 .text-grey-dk-000 }

Có thông báo lỗi trong tay thì tra **[theo thông báo](#thong-bao)**. Không có thông báo thì tra **[theo phân khu](#theo-phan-khu)**. Mỗi dòng dẫn tới một thẻ có đủ nguyên nhân và các bước gỡ.

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Tra theo thông báo của hệ thống
{: #thong-bao }

Xếp theo chữ cái đầu của thông báo. Dấu `…` là chỗ hệ thống điền mã chứng từ hoặc số tiền.

| Thông báo | Thẻ | Phân khu |
|---|---|---|
| *“all resources must be Checked-out or Canceled. Pending: …”* | [HT-09 · Báo còn người chưa check-out](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-09) | B |
| *“Bắt buộc phải có ít nhất 1 Sales Person trong Sales Team.”* | [BH-10 · Báo thiếu hoặc trùng người trong Sales Team](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-10) | A |
| *“Cannot complete: no Actual Start”* | [HT-08 · Báo chưa có giờ bắt đầu thực tế](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-08) | B |
| *“Cannot hủy Service Appointment when in status … Change status first.”* | [HT-15 · Không huỷ được lịch hẹn, phiếu công việc hoặc đơn](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-15) | B |
| *“Chưa tạo phiếu giao hàng cho … Vui lòng tạo phiếu giao hàng trước khi thanh toán.”* | [TT-01 · Báo “Chưa tạo phiếu giao hàng” khi thu tiền](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-01) | D |
| *“Could not find Row #2: Link Name: …”* | [BH-07 · Báo “Could not find Row … Link Name” khi lưu](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-07) | A |
| *“Công nợ … đã được trả qua …”* | [TT-07 · Báo “Công nợ … đã được trả qua …” khi lập phiếu nộp](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-07) | D |
| *“Không cho phép thay đổi Bank Account vì đã tạo phiếu thanh toán”* | [BH-15 · Báo không đổi được Bank Account](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-15) | A |
| *“Không cho phép thay đổi items (chỉ được phép thêm/xóa/thay đổi qty của Giảm giá hoặc phi vật lý)”* | [BH-13 · Báo “Không cho phép thay đổi items…”](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-13) | A |
| *“Không thể Close Sales Order này vì đã có Delivery Note”* | [BH-14 · Báo không Close được vì đã có Delivery Note](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-14) | A |
| *“Không thể hoàn thành WO - …”* | [HT-11 · Phiếu công việc không hoàn thành được](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-11) | B |
| *“no photo attached (Work Type requires Photo)”* | [HT-07 · Báo thiếu ảnh khi hoàn thành lịch hẹn](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-07) | B |
| *“Sales Order not completed: …”* | [TT-15 · Đơn đã giao đủ nhưng chưa Hoàn tất](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-15) | D |
| *“SO …: còn nợ …”* | [TT-13 · Đã thu tiền nhưng đơn vẫn hiện còn nợ](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-13) | D |
| *“SO …: thu tiền mặt nhưng chưa có Internal Transfer về công ty”* | [TT-08 · Đã nộp tiền nhưng hệ thống vẫn báo chưa nộp](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-08) | D |
| *“SO …: đã trả về … nhưng thu … (thiếu …)”* | [TT-09 · Báo “đã trả về … nhưng thu … (thiếu …)”](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-09) | D |
| *“Số dư tài khoản KTV … không đủ. Cần: …, Hiện có: …”* | [TT-10 · Báo “Số dư tài khoản … không đủ” khi xác nhận phiếu nộp](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-10) | D |
| *“Tổng tiền trong Payment Method phải bằng Grand Total…”* | [BH-11 · Báo tổng Payment Method lệch Grand Total](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-11) | A |
| *“Work Order has no Service Appointments”* | [HT-13 · Báo phiếu công việc không có lịch hẹn nào](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-13) | B |
| *“… đã có dòng "Tiền mặt". Không thể tạo 2 dòng cùng hình thức cho 1 SO.”* | [TT-03 · Báo “đã có dòng Tiền mặt” khi thêm dòng thu](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-03) | D |
| *“… đã được trả về kho rồi”* | [KG-10 · Báo đã trả đủ, hoặc vượt số còn lại](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-10) | C |

---

## Tra theo phân khu
{: #theo-phan-khu }

### A · Bán hàng
{: #pk-a }

| Mã | Tình huống | Ở bước |
|---|---|---|
| [BH-01](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-01) | Danh sách nguồn có giá trị “(Tuyệt đối không chọn!)” | [A·1 · Tiếp nhận khách tiềm năng](Quy-Trinh-A-Ban-Hang.html#nguon) |
| [BH-02](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-02) | Một số điện thoại ra nhiều phiếu khách tiềm năng | [A·1 · Tiếp nhận khách tiềm năng](Quy-Trinh-A-Ban-Hang.html#nguon) |
| [BH-03](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-03) | Không thấy ô From Customer | [A·2 · Khai người giới thiệu, nếu có](Quy-Trinh-A-Ban-Hang.html#gioi-thieu) |
| [BH-04](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-04) | Đã chuyển đổi rồi mới biết người giới thiệu | [A·2 · Khai người giới thiệu, nếu có](Quy-Trinh-A-Ban-Hang.html#gioi-thieu) |
| [BH-05](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-05) | Trùng liên hệ hoặc địa chỉ | [A·3 · Bổ sung liên hệ và địa chỉ](Quy-Trinh-A-Ban-Hang.html#lien-he) |
| [BH-06](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-06) | Khách hàng chưa quyết định mua | [A · Khách hàng đồng ý mua?](Quy-Trinh-A-Ban-Hang.html#dong-y) |
| [BH-07](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-07) | Báo “Could not find Row … Link Name” khi lưu | [A·4 · Chuyển thành khách hàng](Quy-Trinh-A-Ban-Hang.html#chuyen-doi) |
| [BH-08](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-08) | Khách hàng bị xếp sai công ty | [A·4 · Chuyển thành khách hàng](Quy-Trinh-A-Ban-Hang.html#chuyen-doi) |
| [BH-09](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-09) | Đơn hoàn tất nhưng khách hàng không được cộng điểm | [A·4 · Chuyển thành khách hàng](Quy-Trinh-A-Ban-Hang.html#chuyen-doi) |
| [BH-10](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-10) | Báo thiếu hoặc trùng người trong Sales Team | [A·5 · Lập đơn bán hàng](Quy-Trinh-A-Ban-Hang.html#khai-don) |
| [BH-11](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-11) | Báo tổng Payment Method lệch Grand Total | [A·5 · Lập đơn bán hàng](Quy-Trinh-A-Ban-Hang.html#khai-don) |
| [BH-12](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-12) | Đơn lập ngoài phiếu nhắc hoặc phiếu sự cố | [A·5 · Lập đơn bán hàng](Quy-Trinh-A-Ban-Hang.html#khai-don) |
| [BH-13](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-13) | Báo “Không cho phép thay đổi items…” | [A · Sửa, đóng và huỷ đơn](Quy-Trinh-A-Ban-Hang.html#sua-don) |
| [BH-14](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-14) | Báo không Close được vì đã có Delivery Note | [A · Sửa, đóng và huỷ đơn](Quy-Trinh-A-Ban-Hang.html#sua-don) |
| [BH-15](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-15) | Báo không đổi được Bank Account | [A · Sửa, đóng và huỷ đơn](Quy-Trinh-A-Ban-Hang.html#sua-don) |
| [BH-16](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-16) | Ô dữ liệu bị khoá sau khi xác nhận | [A · Sửa, đóng và huỷ đơn](Quy-Trinh-A-Ban-Hang.html#sua-don) |
| [BH-17](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-17) | Cần dừng hoặc tạm hoãn đơn | [A · Sửa, đóng và huỷ đơn](Quy-Trinh-A-Ban-Hang.html#sua-don) |

### B · Điều phối và hiện trường
{: #pk-b }

| Mã | Tình huống | Ở bước |
|---|---|---|
| [HT-01](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-01) | Chọn sai loại việc trên phiếu công việc | [B·1 · Lập phiếu công việc](Quy-Trinh-B-Hien-Truong.html#lap-wo) |
| [HT-02](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-02) | Đơn không hiện trên màn hình điều phối | [B·1 · Lập phiếu công việc](Quy-Trinh-B-Hien-Truong.html#lap-wo) |
| [HT-03](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-03) | Không đổi được kỹ thuật viên hoặc khung giờ | [B·2 · Lập lịch hẹn, gán kỹ thuật viên](Quy-Trinh-B-Hien-Truong.html#lap-sa) |
| [HT-04](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-04) | Không thấy chức năng tạo lịch hẹn | [B·2 · Lập lịch hẹn, gán kỹ thuật viên](Quy-Trinh-B-Hien-Truong.html#lap-sa) |
| [HT-05](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-05) | Nhiều kỹ thuật viên cùng một buổi | [B·2 · Lập lịch hẹn, gán kỹ thuật viên](Quy-Trinh-B-Hien-Truong.html#lap-sa) |
| [HT-06](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-06) | Tới nơi nhưng không làm được | [B·3 · Làm việc tại nhà khách hàng](Quy-Trinh-B-Hien-Truong.html#hien-truong) |
| [HT-07](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-07) | Báo thiếu ảnh khi hoàn thành lịch hẹn | [B·3 · Làm việc tại nhà khách hàng](Quy-Trinh-B-Hien-Truong.html#hien-truong) |
| [HT-08](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-08) | Báo chưa có giờ bắt đầu thực tế | [B·3 · Làm việc tại nhà khách hàng](Quy-Trinh-B-Hien-Truong.html#hien-truong) |
| [HT-09](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-09) | Báo còn người chưa check-out | [B · Đủ điều kiện hoàn thành lịch hẹn?](Quy-Trinh-B-Hien-Truong.html#du-dk-sa) |
| [HT-10](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-10) | Cần sửa lịch hẹn đã hoàn tất | [B·4 · Hoàn thành lịch hẹn](Quy-Trinh-B-Hien-Truong.html#hoan-thanh-sa) |
| [HT-11](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-11) | Phiếu công việc không hoàn thành được | [B · Phiếu công việc đủ sáu điều kiện?](Quy-Trinh-B-Hien-Truong.html#du-dk-wo) |
| [HT-12](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-12) | Đủ điều kiện nhưng tác vụ tự động vẫn bỏ qua | [B·5 · Hoàn thành phiếu công việc](Quy-Trinh-B-Hien-Truong.html#hoan-thanh-wo) |
| [HT-13](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-13) | Báo phiếu công việc không có lịch hẹn nào | [B·5 · Hoàn thành phiếu công việc](Quy-Trinh-B-Hien-Truong.html#hoan-thanh-wo) |
| [HT-14](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-14) | Mở lại lịch hẹn làm mất dữ liệu check-in | [B · Mở lại, đổi lịch và huỷ](Quy-Trinh-B-Hien-Truong.html#dong-mo) |
| [HT-15](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-15) | Không huỷ được lịch hẹn, phiếu công việc hoặc đơn | [B · Mở lại, đổi lịch và huỷ](Quy-Trinh-B-Hien-Truong.html#dong-mo) |

### C · Kho và giao nhận
{: #pk-c }

| Mã | Tình huống | Ở bước |
|---|---|---|
| [KG-01](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-01) | Món đã yêu cầu đủ không chọn được | [C·1 · Yêu cầu vật tư theo lịch hẹn](Quy-Trinh-C-Kho-Giao-Nhan.html#yeu-cau) |
| [KG-02](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-02) | Mọi thao tác vật tư đều báo lỗi ở một công ty | [C·1 · Yêu cầu vật tư theo lịch hẹn](Quy-Trinh-C-Kho-Giao-Nhan.html#yeu-cau) |
| [KG-03](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-03) | Hàng được cấp ngoài phiếu yêu cầu | [C·2 · Kho xuất hàng sang kho kỹ thuật viên](Quy-Trinh-C-Kho-Giao-Nhan.html#xuat-kho) |
| [KG-04](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-04) | Không xác nhận được phiếu giao hàng | [C·3 · Lập phiếu giao hàng, khách hàng ký](Quy-Trinh-C-Kho-Giao-Nhan.html#giao-hang) |
| [KG-05](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-05) | Nút xác nhận ở màn hình ký không bật | [C·3 · Lập phiếu giao hàng, khách hàng ký](Quy-Trinh-C-Kho-Giao-Nhan.html#giao-hang) |
| [KG-06](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-06) | Không rõ vì sao có nghĩa vụ trả | [C·4b · Còn phần không giao](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| [KG-07](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-07) | Dòng nghĩa vụ mờ và bị khoá | [C·4b · Còn phần không giao](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| [KG-08](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-08) | Không xoá được phiếu trả nháp | [C·4b · Còn phần không giao](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| [KG-09](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-09) | Phiếu trả được ghi vào kho của người khác | [C·4b · Còn phần không giao](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| [KG-10](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-10) | Báo đã trả đủ, hoặc vượt số còn lại | [C·4b · Còn phần không giao](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| [KG-11](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-11) | Đã trả hàng nhưng nghĩa vụ vẫn còn | [C·4b · Còn phần không giao](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| [KG-12](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-12) | Phiếu trả nháp tồn đọng từ lâu | [C·4b · Còn phần không giao](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| [KG-13](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-13) | Nghĩa vụ trỏ tới mã vật tư không còn tồn tại | [C · Vật tư — tình huống ngoài luồng chính](Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac) |
| [KG-14](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-14) | Nghĩa vụ bộ sản phẩm không khớp thành phần | [C · Vật tư — tình huống ngoài luồng chính](Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac) |
| [KG-15](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-15) | Nghĩa vụ không ghi kho nguồn | [C · Vật tư — tình huống ngoài luồng chính](Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac) |
| [KG-16](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-16) | Kho kỹ thuật viên âm tồn | [C · Vật tư — tình huống ngoài luồng chính](Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac) |
| [KG-17](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-17) | Huỷ phiếu giao hàng sau khi đã trả vật tư | [C · Vật tư — tình huống ngoài luồng chính](Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac) |
| [KG-18](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-18) | Huỷ phiếu công việc nhưng vật tư vẫn ở kho kỹ thuật viên | [C · Vật tư — tình huống ngoài luồng chính](Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac) |
| [KG-19](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-19) | Đơn vị vận chuyển tính sai cước hoặc số kiện | [C·5 · Lập vận đơn từ đơn bán hàng](Quy-Trinh-C-Kho-Giao-Nhan.html#van-chuyen) |
| [KG-20](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-20) | Vận đơn đã xác nhận mà tồn kho chưa đổi | [C·6 · Xác nhận vận đơn](Quy-Trinh-C-Kho-Giao-Nhan.html#xac-nhan-vd) |
| [KG-21](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-21) | Đơn vị vận chuyển đến lấy hàng sai địa điểm | [C·7 · Kho xuất hàng cho đơn vị vận chuyển](Quy-Trinh-C-Kho-Giao-Nhan.html#xuat-dvvc) |
| [KG-22](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-22) | Giao thành công nhưng không thấy chứng từ tự sinh | [C·9a · Giao thành công](Quy-Trinh-C-Kho-Giao-Nhan.html#giao-thanh-cong) |
| [KG-23](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-23) | Đơn vị vận chuyển huỷ khi hàng đã được lấy đi | [C·9b · Hoàn về kho](Quy-Trinh-C-Kho-Giao-Nhan.html#hoan-ve) |

### D · Thu tiền và kế toán
{: #pk-d }

| Mã | Tình huống | Ở bước |
|---|---|---|
| [TT-01](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-01) | Báo “Chưa tạo phiếu giao hàng” khi thu tiền | [D · Đơn đã có phiếu giao hàng?](Quy-Trinh-D-Thu-Tien.html#co-phieu-giao) |
| [TT-02](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-02) | Màn hình thu tiền không cho thao tác | [D·1 · Mở màn hình thu tiền](Quy-Trinh-D-Thu-Tien.html#mo-thu-tien) |
| [TT-03](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-03) | Báo “đã có dòng Tiền mặt” khi thêm dòng thu | [D·2 · Nhập các dòng thu](Quy-Trinh-D-Thu-Tien.html#dong-thu) |
| [TT-04](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-04) | Thu nhiều đơn một lần, chia sai tiền giữa các dòng | [D·2 · Nhập các dòng thu](Quy-Trinh-D-Thu-Tien.html#dong-thu) |
| [TT-05](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-05) | Chọn nhầm tiền mặt cho khoản khách đã chuyển khoản | [D·3a · Tiền mặt](Quy-Trinh-D-Thu-Tien.html#tien-mat) |
| [TT-06](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-06) | Đã đưa tiền mặt cho kế toán nhưng vẫn còn công nợ cá nhân | [D·3a · Tiền mặt](Quy-Trinh-D-Thu-Tien.html#tien-mat) |
| [TT-07](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-07) | Báo “Công nợ … đã được trả qua …” khi lập phiếu nộp | [D·3a · Tiền mặt](Quy-Trinh-D-Thu-Tien.html#tien-mat) |
| [TT-08](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-08) | Đã nộp tiền nhưng hệ thống vẫn báo chưa nộp | [D·3a · Tiền mặt](Quy-Trinh-D-Thu-Tien.html#tien-mat) |
| [TT-09](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-09) | Báo “đã trả về … nhưng thu … (thiếu …)” | [D·3a · Tiền mặt](Quy-Trinh-D-Thu-Tien.html#tien-mat) |
| [TT-10](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-10) | Báo “Số dư tài khoản … không đủ” khi xác nhận phiếu nộp | [D·3a · Tiền mặt](Quy-Trinh-D-Thu-Tien.html#tien-mat) |
| [TT-11](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-11) | Cần nhận tiền vào tài khoản ngân hàng khác | [D·3b · Chuyển khoản](Quy-Trinh-D-Thu-Tien.html#chuyen-khoan) |
| [TT-12](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-12) | Chọn nhầm chuyển khoản cho khoản thu bằng tiền mặt | [D·3b · Chuyển khoản](Quy-Trinh-D-Thu-Tien.html#chuyen-khoan) |
| [TT-13](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-13) | Đã thu tiền nhưng đơn vẫn hiện còn nợ | [D · Phiếu thu chính thức đã đủ giá trị đơn?](Quy-Trinh-D-Thu-Tien.html#du-tien) |
| [TT-14](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-14) | Đã thu đủ mà chưa thấy hoá đơn | [D·4 · Hoá đơn phát sinh](Quy-Trinh-D-Thu-Tien.html#hoa-don) |
| [TT-15](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-15) | Đơn đã giao đủ nhưng chưa Hoàn tất | [D·5 · Đơn chuyển sang Hoàn tất](Quy-Trinh-D-Thu-Tien.html#hoan-tat) |
| [TT-16](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-16) | Không huỷ được phiếu thu vừa lập | [D · Ngoài luồng chính](Quy-Trinh-D-Thu-Tien.html#ngoai-luong) |
| [TT-17](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-17) | Cần sửa phiếu thu khi đơn đã có hoá đơn | [D · Ngoài luồng chính](Quy-Trinh-D-Thu-Tien.html#ngoai-luong) |
| [TT-18](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-18) | Khách hàng trả hàng sau khi đã nhận | [D · Ngoài luồng chính](Quy-Trinh-D-Thu-Tien.html#ngoai-luong) |

### E · Sau bán hàng
{: #pk-e }

| Mã | Tình huống | Ở bước |
|---|---|---|
| [SB-01](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-01) | Khách đã mua nhưng không có phiếu nhắc | [E·1 · Sinh lịch nhắc theo từng vật tư](Quy-Trinh-E-Sau-Ban-Hang.html#sinh-lich) |
| [SB-02](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-02) | Đơn hoàn tất mà vẫn không sinh nhắc | [E·1 · Sinh lịch nhắc theo từng vật tư](Quy-Trinh-E-Sau-Ban-Hang.html#sinh-lich) |
| [SB-03](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-03) | Một khách hàng có nhiều phiếu nhắc trùng | [E·2 · Gom lịch nhắc theo khách hàng](Quy-Trinh-E-Sau-Ban-Hang.html#phieu-nhac) |
| [SB-04](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-04) | Phiếu nhắc quá hạn rất lâu vẫn còn | [E·2 · Gom lịch nhắc theo khách hàng](Quy-Trinh-E-Sau-Ban-Hang.html#phieu-nhac) |
| [SB-05](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-05) | Phiếu được phân cho người không phù hợp | [E·3 · Phân người phụ trách](Quy-Trinh-E-Sau-Ban-Hang.html#phan-cong) |
| [SB-06](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-06) | Nhân sự nghỉ việc, khách quen không được chuyển giao | [E·3 · Phân người phụ trách](Quy-Trinh-E-Sau-Ban-Hang.html#phan-cong) |
| [SB-07](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-07) | Đã lập đơn mà phiếu nhắc vẫn Open | [E·5a · Đồng ý](Quy-Trinh-E-Sau-Ban-Hang.html#dong-y) |
| [SB-08](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-08) | Khách chỉ đồng ý một phần hạng mục | [E·5a · Đồng ý](Quy-Trinh-E-Sau-Ban-Hang.html#dong-y) |
| [SB-09](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-09) | Cần ngừng nhắc hẳn | [E·5c · Không có nhu cầu](Quy-Trinh-E-Sau-Ban-Hang.html#khong-nhu-cau) |
| [SB-10](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-10) | Không biết khách đã mua thiết bị nào | [E·6 · Tiếp nhận, lập phiếu sự cố](Quy-Trinh-E-Sau-Ban-Hang.html#tiep-nhan) |
| [SB-11](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-11) | Ô Loại sự cố trống sau khi chọn nhóm | [E·7 · Phân loại, gán người xử lý](Quy-Trinh-E-Sau-Ban-Hang.html#phan-loai) |
| [SB-12](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-12) | Đổi nhóm làm mất loại đang chọn | [E·7 · Phân loại, gán người xử lý](Quy-Trinh-E-Sau-Ban-Hang.html#phan-loai) |
| [SB-13](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-13) | Phiếu công việc xong mà phiếu sự cố vẫn mở | [E·9 · Đóng phiếu sự cố](Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co) |
| [SB-14](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-14) | Phiếu sự cố nằm On Hold rất lâu | [E·9 · Đóng phiếu sự cố](Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co) |
| [SB-15](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-15) | Đơn sửa chữa không truy được về sự cố | [E·9 · Đóng phiếu sự cố](Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co) |
| [SB-16](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-16) | Tỉ lệ đạt của một người giảm bất thường | [E·9 · Đóng phiếu sự cố](Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co) |

---

## Bốn nguyên tắc khi gặp trục trặc
{: #nguyen-tac }

| # | Nguyên tắc | Vì sao |
|---|---|---|
| 1 | **Chép nguyên văn thông báo** | Hệ thống nói rõ thiếu gì, và nói giống nhau trên Desk lẫn ứng dụng |
| 2 | **Tìm chứng từ phía sau đang khoá** | Muốn sửa một chứng từ, phải xử lý hết các chứng từ sinh ra sau nó |
| 3 | **Không xử lý vòng tránh** | Lập thêm đơn, phiếu trả hay phiếu thu để bù trừ làm sai sổ kho và công nợ |
| 4 | **Phân biệt bị chặn và không được cảnh báo** | Bị chặn thì thấy ngay; không được cảnh báo thì chỉ lộ ra khi khách khiếu nại |

Thứ tự các chứng từ khoá lẫn nhau:

```
Phiếu thu  →  Hoá đơn  →  Phiếu giao hàng  →  Đơn bán hàng
Lịch hẹn   →  Phiếu công việc  →  Đơn bán hàng
```

---

## Những thiếu sót hệ thống không cảnh báo
{: #khong-canh-bao }

| Khai thiếu | Hậu quả | Thẻ |
|---|---|---|
| Khách hàng chưa được gán chương trình tích điểm | Không được cộng điểm | [BH-09](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-09) |
| Không khai người giới thiệu ở phiếu khách tiềm năng | Người giới thiệu không được tính thưởng | [BH-04](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-04) |
| Lập đơn thủ công thay vì từ chứng từ gốc | Mất liên kết ngược, phiếu gốc không tự đóng | [BH-12](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-12) |
| Chọn sai loại việc trên phiếu công việc | Bỏ sót yêu cầu bắt buộc, hoặc bị hỏi nội dung không liên quan | [HT-01](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-01) |
| Kho nguồn chưa khai điểm gửi hàng | Đơn vị vận chuyển đến lấy hàng sai địa điểm | [KG-21](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-21) |
| Mặt hàng chưa khai chu kỳ nhắc | Khách hàng không được nhắc bảo dưỡng | [SB-02](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-02) |

---

## Phân quyền và giao diện
{: #phan-quyen }

| Hiện tượng | Nguyên nhân | Cách gỡ |
|---|---|---|
| Không thấy một chức năng lẽ ra phải có | Tài khoản chưa được cấp quyền | Đề nghị quản trị viên cấp vai trò tương ứng |
| Không thấy một tab hoặc một ô trên form | Ô bị ẩn theo cấu hình hiển thị | Dùng chế độ xem dạng báo cáo để thêm cột, hoặc nhờ quản trị viên đưa ô ra |
| Danh sách trống dù dữ liệu có tồn tại | Bộ lọc lưu từ phiên trước, hoặc giới hạn quyền theo người phụ trách | Xoá toàn bộ bộ lọc rồi xem lại |
| Giao diện vẫn là bản cũ sau khi hệ thống cập nhật | Trình duyệt giữ bản cũ trong bộ nhớ đệm | Tải lại trang bằng tổ hợp phím bỏ qua bộ nhớ đệm |

---

## Khác biệt giữa các công ty
{: #khac-biet }

| Nội dung | Tách theo công ty | Hệ quả |
|---|---|---|
| Kho, tồn kho, kho kỹ thuật viên | **Có** | Không chuyển thẳng hàng giữa hai công ty bằng phiếu chuyển kho thông thường |
| Tài khoản đơn vị vận chuyển và điểm gửi | **Có** | Chọn nhầm tài khoản của công ty khác sẽ bị từ chối khi lưu |
| Danh mục hàng hoá, danh mục sự cố | Dùng chung | Khai một lần, áp dụng cho mọi công ty |
| Cấu hình dịch vụ hiện trường | Dùng chung | Đổi một tham số là áp dụng cho tất cả |
| Nhân sự phụ trách, chuyên môn, địa bàn | Theo từng công ty hoặc để chung | Để trống nghĩa là áp dụng cho mọi công ty |

Dấu hiệu nhận biết nhanh: tên tài khoản và tên kho có **hậu tố viết tắt tên công ty**.

---

## Đầu mối tiếp nhận
{: #dau-moi }

| Loại vướng mắc | Đầu mối | Gửi kèm |
|---|---|---|
| Ô dữ liệu bị khoá, cần huỷ cả chuỗi chứng từ | Quản trị hệ thống | Mã chứng từ và nội dung cần sửa |
| Hoá đơn, phiếu thu, công nợ | Kế toán | Mã đơn, mã hoá đơn, mã phiếu thu |
| Tính lại hoa hồng, sửa đội bán hàng | Quản lý kinh doanh | Mã đơn |
| Sai danh mục: loại sự cố, chu kỳ nhắc, chuyên môn, địa bàn | Quản trị danh mục | Tên danh mục và giá trị đúng |
| Nghĩa vụ trỏ mã hàng không tồn tại, kho âm tồn | Bộ phận kỹ thuật | Mã nghĩa vụ, mã kho, ảnh màn hình |
| Không thấy chức năng, thiếu quyền | Quản trị hệ thống | Tên tài khoản và tên màn hình |

Luôn gửi kèm **nguyên văn thông báo lỗi** và **mã chứng từ**.

---

Quay về **[Bản đồ tổng](00-quy-trinh.html)**
