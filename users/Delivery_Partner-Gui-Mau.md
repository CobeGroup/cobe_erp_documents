---
title: Gửi mẫu nước về lab
layout: default
parent: Vận chuyển & Giao nhận
nav_order: 5
---

# Gửi mẫu nước về lab qua ĐVVC

> Đối tượng: **nhân viên kinh doanh / kỹ thuật** tạo phiếu yêu cầu xét nghiệm, **văn phòng chi nhánh**
> điều phối lấy mẫu.
> Mẫu nước lấy từ phía khách → chuyển về lab của công ty. Bán hàng thì xem
> [Vận đơn từ Sales Order](Delivery_Partner_Extension.html).

---

## Điều khác biệt lớn nhất so với hai luồng kia

Luồng này **không sinh chứng từ kho nào cả** — không đề nghị xuất kho, không phiếu xuất, không phiếu
nhập.

Cố ý như vậy: mẫu nước **không phải hàng tồn kho của công ty**. Ghi nhập kho một thứ không có giá
trị thương mại là bịa tài sản trên sổ, rồi kiểm kê không ai đối chiếu nổi. Vận đơn ở đây chỉ làm
đúng một việc: **đặt xe và theo dõi hành trình**.

Hàng đi ngược chiều bán hàng: **nhà khách → lab**.

---

## 1. Trước khi dùng — khai cấu hình một lần

Vào **DP Cobe Settings**, mục *Gửi mẫu về lab*. Chưa khai đủ thì bấm nút sẽ báo **đúng ô còn thiếu**,
chứ hệ thống không tự đoán thay.

| Ô | Ý nghĩa | Lưu ý |
|---|---|---|
| **Tài khoản ĐVVC** | tài khoản dùng để đặt xe đi lấy mẫu | Điểm gửi chọn trong hộp thoại phải thuộc tài khoản này |
| **Item vật mang của mẫu** | dòng hàng trên vận đơn bắt buộc có mã hàng | **Dùng Item phi tồn kho.** Luồng này không sinh phiếu kho nên Item phi tồn kho chạy được — Item tồn kho thì không |
| **Giá trị khai với ĐVVC** | số tiền khai cho hãng | **Bắt buộc lớn hơn 0** thì vận đơn mới Submit được. Ăn vào phí bảo hiểm và mức đền nếu hãng làm mất mẫu — mẫu mất thì lấy lại được, mua bảo hiểm cao là lỗ |
| **Cân nặng mỗi kiện (kg)** | mồi sẵn cho hộp thoại | người đặt đơn sửa lại được |
| **Mô tả nội dung kiện** | in trên vận đơn | mặc định *"Mẫu nước xét nghiệm"* |
| **Công ty / Kho nhận mẫu** | nơi mẫu được giao tới | khai kho cũng **không** sinh phiếu nhập |
| **Địa chỉ nhận mẫu** | địa chỉ lab | phải có **Tỉnh/Quận** để dò được mã vùng, và **nên có số điện thoại** |
| **Người nhận mẫu** | liên hệ tại lab | ĐVVC đòi tên + SĐT người nhận; không có Phone trên địa chỉ **và** không có Người nhận thì đẩy đơn bị chặn |

> ⚠️ **Trạng thái hiện tại (19/08/2026): cấu hình này còn TRỐNG** — chưa khai ô nào. Phải khai xong
> mới đặt được đơn lấy mẫu.

---

## 2. Phiếu yêu cầu xét nghiệm phải thoả gì

Nút **Tạo → Vận đơn ĐVVC** chỉ hiện khi phiếu **đã Submit** và **Hình thức lấy mẫu = *Đơn vị vận
chuyển***. Phiếu khai *Nội bộ lấy* thì không thấy nút — đi đường cũ, người của công ty tự tới lấy.

Phiếu **đã có vận đơn** thì nút tạo biến mất, thay bằng nhóm nút **Vận đơn** dẫn thẳng tới vận đơn
đó. Một phiếu chỉ nuôi được **một vận đơn còn sống**; muốn đặt lại thì huỷ cái cũ trước.

Bấm nút xong, hệ thống kiểm lại một lượt nữa — và kiểm **lần nữa lúc Submit vận đơn**, vì bảng chứng
từ nguồn còn sửa được khi vận đơn ở trạng thái nháp:

| Điều kiện | Không thoả thì báo |
|---|---|
| Phiếu đã **Submit** | *"Phải Submit phiếu yêu cầu xét nghiệm trước khi đặt ĐVVC."* |
| **Hình thức lấy mẫu = *Đơn vị vận chuyển*** | *"Phiếu này khai Hình thức lấy mẫu là 'Nội bộ lấy'. Chỉ phiếu 'Đơn vị vận chuyển' mới đặt ĐVVC."* |
| Đã khai **Khách hàng** và **Địa chỉ lấy mẫu** | báo đúng ô còn thiếu |
| Phiếu **chưa có vận đơn nào còn sống** | *"Phiếu đã có vận đơn … Huỷ vận đơn đó trước khi tạo cái mới."* |

*(Đo 19/08/2026: 308 phiếu xét nghiệm, trong đó **18 phiếu** khai Đơn vị vận chuyển, 274 phiếu Nội bộ lấy.)*

---

## 3. Đặt đơn — hộp thoại có gì

| Ô | Ý nghĩa |
|---|---|
| **Tài khoản ĐVVC** | điền sẵn theo `DP Cobe Settings`, **đổi được**. Đổi thì phải chọn lại Điểm gửi — điểm gửi đăng ký riêng theo từng tài khoản |
| **Điểm gửi (nơi ĐVVC tới lấy)** | **Ô quan trọng nhất.** Xem mục 4 |
| **Số mẫu** | số mẫu gói trong kiện này |
| **Giá trị khai với ĐVVC** | lấy từ cấu hình, sửa được |
| **Cân nặng kiện (kg)** | lấy từ cấu hình, **cân lại rồi sửa** — khai sai là cước sai |
| **Ghi chú cho ĐVVC** | ghép vào mô tả nội dung kiện in trên vận đơn |

Danh sách tài khoản lọc theo công ty của phiếu, **nhưng tài khoản khai trong cấu hình luôn được giữ
lại** kể cả khi nó thuộc công ty khác. Cố ý: luồng gửi mẫu không sinh chứng từ kho nào nên không có
ràng buộc công ty ở đây — mẫu nước thì công ty nào trả cước cũng được, và âm thầm bỏ mất giá trị
người ta đã cố ý khai trong cấu hình mới là chuyện tệ.

Đầu hộp thoại có khối tóm tắt tuyến: **Lấy tại** (tên khách) → **Giao về** (lab).

Xác nhận xong hệ thống dựng **vận đơn nháp** rồi mở ra. Kiểm lại địa chỉ, xem cước bằng nút
**Xem cước theo dịch vụ**, ưng thì **Submit** → **Đẩy đơn sang ĐVVC**.

> Hai nút khác nhau hẳn: **"Vận đơn ĐVVC"** chỉ dựng chứng từ nháp, bên ngoài chưa ai biết gì.
> **"Đẩy đơn sang ĐVVC"** mới là lúc hãng nhận đơn và cử người đi lấy mẫu.

---

## 4. Điểm gửi — chỗ dễ hiểu nhầm nhất

Cảm giác tự nhiên là *"lấy mẫu ở nhà khách thì địa chỉ người gửi phải là nhà khách"*. **Không đi
được như vậy.**

Viettel Post **không nhận địa chỉ người gửi nhập tay** — đơn phải kèm mã của một kho đã đăng ký sẵn
trên cổng. Nên ô người gửi trên đơn luôn là một **Điểm gửi** trong danh sách đã đồng bộ.

Hệ thống **mồi sẵn điểm gửi cùng tỉnh với khách**, vì đó là điểm mà hãng sẽ cử shipper của đúng tỉnh
đó đi lấy. Không mồi bừa một điểm khác tỉnh: nhìn trên form thì vẫn thấy *"đã chọn điểm gửi"* nhưng
đơn sai chặng và sai cước.

Địa chỉ khách **vẫn được ghi đầy đủ** trên vận đơn (ô Lấy hàng) — đó là chỗ người điều phối nhìn để
biết mẫu đang nằm ở đâu, chỉ là nó không phải cái đi vào ô người gửi của hãng.

**Khách ở tỉnh chưa có điểm gửi nào?** Đăng ký địa chỉ đó trên cổng Viettel Post rồi bấm *Đồng bộ
điểm gửi* — xem [Tài khoản ĐVVC & Điểm gửi, mục 7](Delivery_Partner-Tai-Khoan-Diem-Gui.html#7-đồng-bộ--đăng-ký-điểm-gửi-mới).
Không có đường tắt.

---

## 5. Theo dõi & huỷ

Phiếu xét nghiệm đã có vận đơn thì trên form hiện khối trạng thái và menu **Vận đơn** để mở thẳng ra.

Huỷ vận đơn thì **không đụng gì tới phiếu xét nghiệm** — phiếu sống độc lập, huỷ xong đặt lại được
ngay. Cũng không có phiếu kho nào để dọn, vì luồng này chưa từng sinh cái nào.

---

## 6. Gộp nhiều mẫu vào một vận đơn

Cấu trúc dữ liệu đã sẵn sàng: bảng **Chứng từ nguồn** trên vận đơn là quan hệ nhiều–nhiều, một vận
đơn ôm được nhiều phiếu xét nghiệm.

**Nhưng nút hiện tại đặt đơn cho từng phiếu một.** Muốn gom mẫu của nhiều khảo sát vào một chuyến,
tạm thời thêm dòng vào bảng Chứng từ nguồn trên vận đơn nháp — nhớ các dòng phải **cùng loại chứng
từ**, và Submit xong là bảng khoá.

---

## 7. Sự cố thường gặp

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Không thấy nút **Vận đơn ĐVVC** | phiếu chưa Submit, Hình thức lấy mẫu ≠ *Đơn vị vận chuyển*, hoặc phiếu đã có vận đơn rồi | sửa phiếu, hoặc mở vận đơn cũ qua nhóm nút **Vận đơn** |
| *"Chưa khai cấu hình gửi mẫu: …"* | DP Cobe Settings thiếu ô | khai đúng ô nó liệt kê |
| *"Tài khoản … chưa có điểm gửi nào"* | tài khoản chưa đồng bộ | DP Partner Account → **Đồng bộ điểm gửi** |
| Cảnh báo *"chưa mồi được điểm gửi"* | không có điểm cùng tỉnh, cũng chưa đặt điểm mặc định | chọn tay trong danh sách |
| Cảnh báo *"Địa chỉ nhận mẫu chưa có Phone…"* | lab chưa có SĐT người nhận | thêm Phone vào Address, hoặc khai Người nhận mẫu |
| Submit báo giá trị hàng phải > 0 | *Giá trị khai với ĐVVC* trong cấu hình đang để 0 | khai một số danh nghĩa |
| Đẩy đơn báo *"Điểm gửi … thuộc tài khoản …"* | điểm gửi không thuộc tài khoản của vận đơn | chọn lại điểm trong danh sách của đúng tài khoản |

---

## Liên quan

- [Tài khoản ĐVVC & Điểm gửi](Delivery_Partner-Tai-Khoan-Diem-Gui.html)
- [Quy trình vận đơn & giao nhận](Delivery_Partner-Quy-Trinh.html)
- [Chuyển kho qua ĐVVC](Delivery_Partner-Chuyen-Kho.html)
