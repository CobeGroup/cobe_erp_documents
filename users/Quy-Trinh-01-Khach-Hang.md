---
title: 1 · Từ khách tiềm năng đến khách hàng
layout: default
parent: Quy trình hợp nhất
nav_order: 2
---

# Chặng 1 — Từ khách tiềm năng đến khách hàng
{: .no_toc }

**Vai trò thực hiện:** Kinh doanh · Chăm sóc khách hàng · Quản trị bán hàng
{: .fs-3 .text-grey-dk-000 }

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ chặng

<a href="images/svg/quy-trinh/02-khach-hang.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/02-khach-hang.svg" alt="Năm nguồn khách hàng xếp thành một cột bên trái, mỗi nguồn có một mũi tên riêng dẫn vào phiếu khách tiềm năng. Từ phiếu khách tiềm năng lập liên hệ và địa chỉ, sau đó chuyển đổi thành khách hàng. Dải phía dưới là bốn trạng thái của phiếu khách tiềm năng" style="width:100%;height:auto">
</a>

---

## 1. Các nguồn khách hàng

Mỗi lượt khách hàng cung cấp thông tin liên hệ đều được ghi nhận thành một **phiếu khách tiềm
năng** (`Lead`). Phiếu được lập theo hai cách:

| Cách lập | Người lập | Đặc điểm |
|---|---|---|
| **Tự động** | Hệ thống, thông qua kết nối với tổng đài, mạng xã hội và hộp trò chuyện trên trang web | Phiếu xuất hiện ngay khi khách hàng gọi hoặc nhắn tin; nguồn khách hàng được ghi sẵn |
| **Thủ công** | Nhân viên kinh doanh nhập trên Desk | Áp dụng cho khách hàng đến trực tiếp, khách hàng được giới thiệu, hoặc danh sách thu thập tại hội chợ |

Ô **Nguồn khách hàng** (`utm_source`) là nội dung quan trọng nhất trên phiếu, vì hai lý do:

1. Ô này quyết định **công ty** nào tiếp nhận khách hàng. Tập đoàn có nhiều pháp nhân; mỗi
   nguồn được khai sẵn thuộc công ty nào. Với những nguồn chỉ gắn với đúng một công ty, hệ
   thống **tự điền công ty** cho các phiếu do luồng tự động lập.
2. Ô này quyết định khách hàng có thuộc diện **được giới thiệu** hay không, tức có phát sinh
   thưởng cho người giới thiệu hay không.

> ⚠️ Trong danh sách nguồn có một số giá trị mang tiền tố **“(Tuyệt đối không chọn!)”**. Đây là
> các nguồn cũ được giữ lại để dữ liệu lịch sử không bị đứt liên kết. Nhân viên **không chọn**
> các giá trị này khi lập phiếu mới.

---

## 2. Khai người giới thiệu

Hệ thống **không tự xác định** quan hệ giới thiệu. Nội dung này phải được khai, và phải khai
**ngay ở bước khách tiềm năng**, trước khi chuyển đổi thành khách hàng.

**Trình tự khai:** mở phiếu khách tiềm năng, tại ô **Nguồn khách hàng** chọn giá trị
`Reference`. Một ô mới tên **From Customer** sẽ hiển thị và bắt buộc phải điền. Chọn khách hàng
hiện hữu đã giới thiệu người này, sau đó lưu phiếu.

Lý do phải khai sớm: hệ thống truy vết người giới thiệu theo đường **khách hàng → phiếu khách
tiềm năng gốc → người giới thiệu**. Nếu khai sau khi đã chuyển đổi, mắt xích ở giữa không còn
chính xác và phải nhờ quản trị viên điều chỉnh thủ công.

> 📚 Điều kiện được thưởng, mức thưởng và cách tra cứu: xem
> [Loyalty — Hướng dẫn cho Sales](Loyalty-Cho-Sales.html).

---

## 3. Bốn trạng thái của phiếu khách tiềm năng

| Trạng thái | Ý nghĩa | Số phiếu hiện có |
|---|---|---|
| **Lead** | Mới tiếp nhận, chưa xác định nhu cầu | 78.059 |
| **Interested** | Khách hàng có quan tâm, đang trao đổi | 45 |
| **Opportunity** | Đã lập cơ hội bán hàng cụ thể | 304 |
| **Converted** | Đã chốt, đã chuyển thành khách hàng | 15.548 |

Hai trạng thái ở giữa hầu như không được sử dụng: trên thực tế **phần lớn phiếu chuyển thẳng
từ *Lead* sang *Converted*** khi khách hàng đồng ý mua. Việc lập cơ hội bán hàng
(`Opportunity`) là bước tuỳ chọn, chỉ áp dụng cho các thương vụ cần theo dõi qua nhiều bước.

Con số 15.548 phiếu ở trạng thái *Converted* thấp hơn số khách hàng 25.566 là do nhiều khách
hàng được đưa vào hệ thống trong đợt chuyển đổi dữ liệu từ hệ thống cũ, phiếu gốc của các
khách hàng này giữ nguyên trạng thái ban đầu.

---

## 4. Liên hệ và địa chỉ

Một khách hàng cần thêm hai hồ sơ nữa mới đủ điều kiện phát sinh giao dịch:

| Hồ sơ | Tên trên hệ thống | Mục đích sử dụng |
|---|---|---|
| **Liên hệ** | `Contact` | Gọi điện, nhắn tin, in lên chứng từ |
| **Địa chỉ** | `Address` | Lắp đặt, giao hàng, xác định mã vùng của đơn vị vận chuyển |

Cả hai hồ sơ đều có bảng **Links** trong mục *Reference*, dùng để gắn hồ sơ với một khách tiềm
năng hoặc một khách hàng.

> 💡 **Hệ thống tự liên kết theo hai chiều.** Chỉ cần gắn **một** trong hai đối tượng (ví dụ
> chỉ gắn Khách hàng), khi lưu hệ thống sẽ tự bổ sung phiếu khách tiềm năng tương ứng, với
> điều kiện hồ sơ khách hàng đang trỏ **đúng** phiếu khách tiềm năng.

Nguyên tắc cần tuân thủ khi bổ sung liên hệ hoặc địa chỉ: **tìm theo số điện thoại trước**.
Khách hàng chuyển đổi từ phiếu khách tiềm năng thường đã có sẵn liên hệ và địa chỉ; việc tạo
mới sẽ sinh bản trùng và về sau khó xác định bản nào chính xác.

---

## 5. Chuyển đổi thành khách hàng

Khi khách hàng đồng ý mua, nhân viên chuyển phiếu khách tiềm năng thành **khách hàng**
(`Customer`). Hồ sơ khách hàng giữ lại liên kết về phiếu gốc tại ô **Lead**.

Liên kết này không mang tính hình thức. Hệ thống sử dụng liên kết để:

- Truy vết người giới thiệu và tính thưởng.
- Tự liên kết hồ sơ liên hệ và địa chỉ giữa hai đối tượng.
- Xác định nguồn khách hàng khi lập báo cáo hiệu quả marketing.

Số liệu thực tế: **toàn bộ 25.566 khách hàng đều có liên kết về một phiếu khách tiềm năng**,
không có khách hàng nào được lập trực tiếp. Đây là quy tắc vận hành cần duy trì.

### Các nội dung phải kiểm tra ngay sau khi chuyển đổi

| # | Nội dung | Hậu quả nếu bỏ qua |
|---|---|---|
| 1 | Khách hàng đã được gán **chương trình tích điểm** | Khách hàng không được cộng điểm và hệ thống không cảnh báo |
| 2 | Đã đặt **liên hệ chính** và **địa chỉ chính** | Khi lập đơn phải chọn thủ công, dễ chọn nhầm địa chỉ cũ |
| 3 | Ô **Công ty** đúng pháp nhân bán hàng | Đơn hàng, kho và hoá đơn sẽ lệch pháp nhân |

---

## 6. Ngoại lệ thường gặp

| Hiện tượng | Nguyên nhân | Hướng xử lý |
|---|---|---|
| Lưu đơn báo lỗi `Could not find Row #2: Link Name: <tên>` | Hồ sơ khách hàng đang trỏ tới một phiếu khách tiềm năng **đã được đổi tên**, dẫn tới liên kết không còn hợp lệ | Tìm lại phiếu đúng theo số điện thoại và cập nhật ô **Lead** trên hồ sơ khách hàng. Xem [Sửa lỗi liên kết Khách hàng](Sua-Loi-Lien-Ket-Khach-Hang.html) |
| Một số điện thoại ứng với nhiều phiếu khách tiềm năng | Khách hàng liên hệ nhiều lần qua nhiều kênh, mỗi lần phát sinh một phiếu | Chọn phiếu ở trạng thái **Converted** và có thông tin trùng khớp nhất; các phiếu còn lại giữ nguyên làm dữ liệu lịch sử |
| Ô **Lead** trên hồ sơ khách hàng bị khoá | Ô này chỉ mở cho vai trò quản trị | Gửi quản trị viên hai thông tin: mã khách hàng đang lỗi và mã phiếu đúng |
| Khách hàng được xếp vào **sai công ty** | Nguồn khách hàng được khai cho nhiều công ty nên hệ thống không suy ra được | Cập nhật thủ công ô Công ty trước khi chuyển đổi |
| Không hiển thị ô **From Customer** dù đã chọn nguồn giới thiệu | Ô này chỉ hiển thị với hai giá trị `Reference` và `Existing Customer` | Kiểm tra lại giá trị đã chọn; nếu vẫn không hiển thị thì báo quản trị viên |
| Đã chuyển đổi rồi mới xác định được người giới thiệu | Mắt xích truy vết không còn đầy đủ | Gửi quản trị viên: mã khách hàng mới, mã khách hàng giới thiệu và mã đơn hàng đầu tiên |
| Phát sinh bản trùng của liên hệ hoặc địa chỉ | Không tìm theo số điện thoại trước khi lập mới | Xoá bản vừa lập và gắn lại bản cũ qua bảng **Links** |

---

## 7. Chặng tiếp theo

Khách hàng đã được chuyển đổi chính thức, có đầy đủ liên hệ và địa chỉ. Bước kế tiếp là lập
đơn: **[Chặng 2 — Đơn bán hàng](Quy-Trinh-02-Don-Hang.html)**.
