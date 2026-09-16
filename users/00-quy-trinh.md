---
title: Quy trình hợp nhất
layout: default
nav_order: 1.8
has_children: true
---

# Quy trình hợp nhất

Nhánh tài liệu này mô tả **toàn bộ dây chuyền nghiệp vụ theo một mạch liên tục**: từ khi một
khách hàng tiềm năng cung cấp thông tin liên hệ, cho tới khi trở thành khách hàng được chăm
sóc định kỳ trong nhiều năm.

Các nhánh tài liệu khác được tổ chức theo **module**, mỗi nhánh trình bày chi tiết một mảng
nghiệp vụ. Nhánh này được tổ chức theo **hành trình**: đi lần lượt qua từng chặng, nêu rõ
chặng trước bàn giao cho chặng sau bằng chứng từ nào, mỗi vai trò đảm nhiệm phần việc gì, và
cách xử lý khi phát sinh tình huống bất thường.

Nhánh có **hai cách đọc**. Trang [Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html) bám
theo một đơn hàng cụ thể từ đầu đến cuối, phù hợp với người cần nắm mạch chung. Các trang chặng
từ 1 đến 8 trình bày trọn vẹn phần việc của từng bộ phận, phù hợp khi cần tra cứu chi tiết.

## Thứ tự đọc

| # | Trang | Nội dung |
|---|---|---|
| 0 | **[Tổng quan toàn chuỗi](Quy-Trinh-Tong-Quan.html)** | Cấu trúc hệ thống, quan hệ giữa các chứng từ, phân công vai trò và màn hình làm việc |
| 0b | **[Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html)** | Bám theo một đơn hàng có thật từ lúc lập đơn tới lúc sinh lịch bảo dưỡng kỳ sau: mười mốc, ba nghĩa vụ song song và các nhánh đi lệch |
| 1 | **[Từ khách tiềm năng đến khách hàng](Quy-Trinh-01-Khach-Hang.html)** | Các nguồn khách hàng và điều kiện chuyển đổi thành khách hàng chính thức |
| 2 | **[Đơn bán hàng](Quy-Trinh-02-Don-Hang.html)** | Lập đơn, xác nhận đơn, điều chỉnh đơn và các trạng thái của đơn |
| 3 | **[Điều phối và thực hiện tại hiện trường](Quy-Trinh-03-Hien-Truong.html)** | Phiếu công việc, lịch hẹn dịch vụ và trình tự thao tác của kỹ thuật viên |
| 4 | **[Vật tư của kỹ thuật viên](Quy-Trinh-04-Vat-Tu.html)** | Yêu cầu vật tư, tiếp nhận, sử dụng và hoàn trả về kho |
| 5 | **[Giao hàng và thu tiền](Quy-Trinh-05-Giao-Hang-Thu-Tien.html)** | Hai phương thức giao hàng, hoá đơn, thu tiền mặt, thu hộ và nộp tiền về công ty |
| 6 | **[Bảo dưỡng định kỳ và vòng lặp](Quy-Trinh-06-Bao-Duong.html)** | Cơ chế phát sinh đơn hàng mới từ khách hàng hiện hữu |
| 7 | **[Sự cố](Quy-Trinh-07-Su-Co.html)** | Tiếp nhận, phân loại và xử lý trường hợp khách hàng báo hỏng |
| 8 | **[Ngoại lệ, lỗi và bất thường](Quy-Trinh-08-Ngoai-Le.html)** | Bảng tra cứu theo hiện tượng: nguyên nhân và hướng xử lý |

## Đối tượng sử dụng

Tài liệu dành cho **người dùng cuối**: nhân viên kinh doanh, chăm sóc khách hàng, điều phối,
kỹ thuật viên, kho, kế toán và cán bộ quản lý. Tài liệu không yêu cầu kiến thức kỹ thuật về
cấu trúc bên trong hệ thống.

Mỗi khi nêu tên một chứng từ bằng tiếng Việt, tài liệu ghi kèm **tên tiếng Anh** của chứng từ
đó trong hệ thống. Tên tiếng Anh mới là từ khoá tra cứu chính xác trên thanh tìm kiếm.

> Số liệu minh hoạ trong nhánh này được trích xuất từ dữ liệu vận hành thực tế, tính đến ngày
> **15/09/2026**. Số liệu nhằm thể hiện qui mô và tỉ trọng giữa các nhánh nghiệp vụ, không
> dùng làm căn cứ đối chiếu kế toán.
