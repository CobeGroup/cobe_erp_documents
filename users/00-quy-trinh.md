---
title: Quy trình hợp nhất
layout: default
nav_order: 1.8
has_children: true
---

# Quy trình hợp nhất

Nhánh tài liệu này mô tả **một mạch xuyên suốt** của hệ thống: từ lúc một người lạ để lại
số điện thoại, cho tới lúc họ trở thành khách hàng quen được chăm sóc định kỳ nhiều năm.

Các nhánh tài liệu khác được viết theo **module** — mỗi nhánh nói kỹ một mảng. Nhánh này
viết theo **hành trình**: đi lần lượt qua từng chặng, chỉ rõ chặng trước bàn giao cho chặng
sau bằng chứng từ nào, ai làm gì ở đâu, và điều gì xảy ra khi có sự cố giữa đường.

## Đọc theo thứ tự này

| # | Trang | Trả lời câu hỏi |
|---|---|---|
| 0 | **[Tổng quan toàn chuỗi](Quy-Trinh-Tong-Quan.html)** | Toàn bộ hệ thống gồm những gì, chứng từ nào sinh ra chứng từ nào, ai dùng màn hình nào |
| 1 | **[Từ khách tiềm năng đến khách hàng](Quy-Trinh-01-Khach-Hang.html)** | Khách vào hệ thống bằng cửa nào, khi nào thì thành khách hàng chính thức |
| 2 | **[Đơn bán hàng](Quy-Trinh-02-Don-Hang.html)** | Lập đơn, xác nhận đơn, sửa đơn, và các trạng thái của đơn |
| 3 | **[Điều phối và thực hiện tại hiện trường](Quy-Trinh-03-Hien-Truong.html)** | Phiếu công việc, lịch hẹn, kỹ thuật viên làm gì tại nhà khách |
| 4 | **[Vật tư của kỹ thuật viên](Quy-Trinh-04-Vat-Tu.html)** | Yêu cầu hàng, nhận hàng, dùng hàng, trả hàng về kho |
| 5 | **[Giao hàng và thu tiền](Quy-Trinh-05-Giao-Hang-Thu-Tien.html)** | Hai đường giao hàng, hoá đơn, thu tiền mặt, thu hộ, nộp tiền về công ty |
| 6 | **[Bảo dưỡng định kỳ và vòng lặp](Quy-Trinh-06-Bao-Duong.html)** | Vì sao khách cũ tự quay lại thành đơn hàng mới |
| 7 | **[Sự cố](Quy-Trinh-07-Su-Co.html)** | Khách báo hỏng thì đi đường nào, khi nào phát sinh đơn hàng mới |
| 8 | **[Ngoại lệ, lỗi và bất thường](Quy-Trinh-08-Ngoai-Le.html)** | Tra nhanh theo triệu chứng: hiện tượng, nguyên nhân, cách xử lý |

## Dành cho ai

Tài liệu viết cho **người dùng cuối**: nhân viên kinh doanh, chăm sóc khách hàng, điều phối,
kỹ thuật viên, kho, kế toán và quản lý. Không yêu cầu hiểu kỹ thuật bên trong hệ thống.

Mỗi khi gọi tên một chứng từ bằng tiếng Việt, tài liệu ghi kèm **tên tiếng Anh thật** của nó
trong hệ thống — đó mới là tên gõ vào ô tìm kiếm thì ra đúng danh sách.

> Số liệu minh hoạ trong nhánh này lấy từ dữ liệu vận hành thực tế, chốt ngày **15/09/2026**.
> Con số dùng để cho thấy quy mô và tỉ trọng giữa các nhánh, không phải để đối chiếu kế toán.
