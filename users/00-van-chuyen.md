---
title: Vận chuyển & Giao nhận
layout: default
nav_order: 4
has_children: true
---

# Vận chuyển & Giao nhận

Quản lý vận đơn, kết nối đơn vị vận chuyển, tích hợp ERP và biên bản bàn giao/nghiệm thu.

## Bắt đầu từ đâu

| Bạn cần | Đọc |
|---|---|
| Hiểu toàn cảnh vận đơn, ai làm gì, chứng từ nào sinh ra chứng từ nào | [Quy trình vận đơn & giao nhận](Delivery_Partner-Quy-Trinh.html) |
| Kết nối Viettel Post, đẩy đơn, mã vùng *(có ảnh)* | [Viettel Post — Cài đặt & sử dụng](Delivery_Partner-Viettel_Post-Cai-Dat.html) |
| Chọn tài khoản ĐVVC, khai điểm gửi, hiểu các cảnh báo | [Tài khoản ĐVVC & Điểm gửi](Delivery_Partner-Tai-Khoan-Diem-Gui.html) |
| Giao hàng cho khách từ đơn bán hàng | [Vận đơn từ Sales Order](Delivery_Partner_Extension.html) |
| Chuyển hàng giữa hai kho cùng công ty | [Chuyển kho qua ĐVVC](Delivery_Partner-Chuyen-Kho.html) |
| Lấy mẫu nước ở chỗ khách gửi về lab | [Gửi mẫu nước về lab](Delivery_Partner-Gui-Mau.html) |

**Bốn luồng đặt đơn** đều bấm cùng một nút **Tạo → Vận đơn ĐVVC**, khác nhau ở chứng từ gốc và ở
chuỗi chứng từ kho sinh ra sau đó:

| Đặt từ | Mục đích tự điền | Chứng từ kho sinh ra |
|---|---|---|
| Đơn bán hàng | Bán hàng | đề nghị xuất kho → phiếu xuất → phiếu giao → hoá đơn/COD |
| Phiếu chuyển kho | Chuyển kho | phiếu xuất → phiếu nhập cho kho đích ký |
| Phiếu yêu cầu xét nghiệm | Gửi mẫu về lab | **không sinh gì** |
| Tạo tay, không gắn chứng từ gốc | *(để trống)* | **không sinh gì** |
