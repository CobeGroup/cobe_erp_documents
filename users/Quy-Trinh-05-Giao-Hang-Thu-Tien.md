---
title: 5 · Giao hàng và thu tiền
layout: default
parent: Quy trình hợp nhất
nav_order: 6
---

# Chặng 5 — Giao hàng và thu tiền
{: .no_toc }

**Vai trò thực hiện:** Kỹ thuật viên · Kho · Kế toán · Kinh doanh
{: .fs-3 .text-grey-dk-000 }

> **Chặng này nằm ở đâu trong dây chuyền**
>
> **Nhận vào:** Vật tư đã ở kho kỹ thuật viên từ [Chặng 4](Quy-Trinh-04-Vat-Tu.html), gắn với đơn bán hàng của [Chặng 2](Quy-Trinh-02-Don-Hang.html).
>
> **Bàn giao ra:** Đơn đã giao đủ, thu đủ và có hoá đơn; bàn giao cho [Chặng 6 — Bảo dưỡng định kỳ](Quy-Trinh-06-Bao-Duong.html).
>
> Toàn bộ mạch từ đầu đến cuối, theo một đơn hàng cụ thể: [Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html).

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ chặng

<a href="images/svg/quy-trinh/06-giao-hang-thu-tien.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/06-giao-hang-thu-tien.svg" alt="Từ một đơn bán hàng đã xác nhận có hai đường giao hàng. Đường trên là kỹ thuật viên giao tận nơi: lập phiếu giao hàng, thu tiền tại chỗ, xuất hoá đơn rồi nộp tiền mặt về công ty. Đường dưới là gửi qua đơn vị vận chuyển: lập vận đơn, đề nghị xuất kho, phiếu xuất kho sang kho của đơn vị vận chuyển, giao thành công thì hệ thống tự sinh phiếu giao hàng, hoá đơn và phiếu thu tiền thu hộ" style="width:100%;height:auto">
</a>

Hai phương thức khác nhau ở **người lập chứng từ và thời điểm lập**, nhưng cùng kết thúc bằng
**ba chứng từ giống nhau**: phiếu giao hàng (`Delivery Note`), hoá đơn (`Sales Invoice`) và
phiếu thu (`Payment Entry`).

---

## 1. Phương thức A — Kỹ thuật viên giao tận nơi

Đây là phương thức chủ đạo của công ty: kỹ thuật viên mang hàng theo phương tiện, lắp đặt hoặc
thay lõi tại địa điểm của khách hàng, sau đó giao hàng và thu tiền tại chỗ.

### 1.1. Lập phiếu giao hàng trên ứng dụng

Kỹ thuật viên mở lịch hẹn, chọn tab **Đơn hàng**, sau đó chọn chức năng **Giao hàng**. Hệ thống
nạp các dòng hàng còn phải giao của những đơn gắn với lịch hẹn.

| Điều kiện thực hiện | Nội dung |
|---|---|
| Trạng thái đơn | Không thuộc *Closed*, *Cancelled* hoặc *On Hold* |
| Dòng hàng | Còn tối thiểu một dòng chưa giao hết |
| Kho | Kỹ thuật viên phải được khai kho cho công ty của đơn |
| Mỗi đơn | Phải giao tối thiểu một món; không cho phép hoàn trả toàn bộ đơn |

### 1.2. Giao đủ hoặc giao một phần

Kỹ thuật viên điều chỉnh số lượng của từng dòng:

| Thao tác | Ý nghĩa |
|---|---|
| Giữ nguyên | Giao đủ |
| Giảm số lượng | Giao một phần; phần chênh lệch được ghi nhận là **hàng hoàn trả** |
| Đặt về 0 | Không giao món đó; toàn bộ món được ghi nhận là hàng hoàn trả |

Màn hình xác nhận tách riêng hai khối: **hàng hoàn trả** nền đỏ và **hàng giao** nền xanh, kèm
giá trị từng dòng. Khách hàng **ký xác nhận trên màn hình**; khi chưa ký, chức năng xác nhận
không được kích hoạt.

> 🔗 Phần hàng hoàn trả chính là nội dung làm phát sinh **nghĩa vụ trả vật tư** ở
> [Chặng 4](Quy-Trinh-04-Vat-Tu.html). Giao một phần không đồng nghĩa với bỏ qua phần còn lại:
> đó là một khoản nợ hàng mà kỹ thuật viên phải hoàn trả về kho.

---

## 2. Điều kiện và thao tác thu tiền

### 2.1. Điều kiện bắt buộc

> ⛔ **Phải lập phiếu giao hàng trước khi thu tiền.** Hệ thống từ chối kèm thông báo
> *“Chưa tạo phiếu giao hàng cho … Vui lòng tạo phiếu giao hàng trước khi thanh toán.”* Công ty
> có thể mở ngoại lệ cho phép thu trước bằng một tham số cấu hình; tham số này **đang tắt**.

Ngoài ra, kỹ thuật viên phải được khai **tài khoản thu tiền** cho công ty của đơn. Chưa khai thì
màn hình thu tiền không cho thực hiện, kể cả khi đã có phiếu giao hàng.

### 2.2. Màn hình thu tiền hoạt động theo dòng

Màn hình thu tiền không làm việc theo từng đơn mà theo **từng dòng thu**. Mỗi dòng gồm ba nội
dung: thu cho đơn nào, bằng hình thức nào và bao nhiêu tiền.

| Nội dung | Cách hệ thống xử lý |
|---|---|
| Số dòng mặc định | Mỗi đơn còn nợ được nạp sẵn một dòng |
| Số tiền mặc định | Bằng đúng số còn nợ của đơn |
| Hình thức mặc định | **Chuyển khoản** nếu đơn có khai sẵn tài khoản ngân hàng, ngược lại là **tiền mặt** |
| Thêm dòng | Được phép, dùng cho trường hợp một đơn trả bằng hai hình thức |
| Giới hạn | Một đơn **không được có hai dòng cùng một hình thức** trong cùng lần thu |
| Số tiền | Được phép nhỏ hơn số còn nợ; phần còn lại thu ở lần sau |
| Tổng kiểm tra | Tổng tiền của tất cả các dòng không được lớn hơn **tổng** số còn nợ của các đơn đang xử lý |

> ⚠️ **Chốt kiểm tra cuối cùng đối chiếu trên tổng, không đối chiếu từng đơn.** Khi kỹ thuật
> viên thu cho nhiều đơn trong cùng một lần, việc ghi dư cho đơn này và ghi thiếu cho đơn kia
> vẫn qua được chốt kiểm tra. Cần đọc lại số tiền của từng dòng trước khi xác nhận.

### 2.3. Chọn tài khoản ngân hàng cho dòng chuyển khoản

Dòng chuyển khoản bắt buộc phải chọn tài khoản ngân hàng nhận tiền. Khi đã chọn xong mà đổi sang
tài khoản khác, hệ thống hỏi lại kèm cảnh báo: **chỉ đổi tài khoản khi có yêu cầu từ công ty**.

Sau khi chọn tài khoản và nhập số tiền, ứng dụng hiện **mã QR** tương ứng với đúng tài khoản và
đúng số tiền của dòng đó để khách hàng quét và chuyển.

---

## 3. Ba trường hợp thu tiền và hệ quả của từng trường hợp

<a href="images/svg/quy-trinh/11-thu-tien.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/11-thu-tien.svg" alt="Sau khi đã lập phiếu giao hàng, việc thu tiền rẽ thành ba nhánh. Nhánh một, khách hàng trả tiền mặt: phiếu thu được ghi nhận ngay, tiền vào tài khoản của kỹ thuật viên và trở thành công nợ cá nhân, kỹ thuật viên phải lập phiếu nộp và kế toán xác nhận thì công nợ mới hết. Nhánh hai, khách hàng chuyển khoản: ứng dụng hiện mã QR, phiếu thu nằm ở trạng thái nháp cho tới khi kế toán đối chiếu sao kê và xác nhận, khi đó hoá đơn tự phát sinh. Nhánh ba, khách hàng trả bằng cả hai hình thức: mỗi hình thức một dòng thu riêng, phần tiền mặt đi theo nhánh một, phần chuyển khoản đi theo nhánh hai, và đơn chỉ được coi là thu đủ khi cả hai phiếu đều đã chính thức. Cả ba nhánh cùng dẫn tới kết quả chung: thu đủ một trăm phần trăm thì hoá đơn phát sinh, đơn chuyển sang hoàn tất, khách hàng được cộng điểm tích luỹ và hệ thống sinh lịch bảo dưỡng cho kỳ kế tiếp" style="width:100%;height:auto">
</a>

### 3.1. So sánh hai hình thức

Hai hình thức thanh toán không chỉ khác nhau ở cách khách hàng trả tiền. Chúng sinh ra **hai
đường xử lý khác nhau về chứng từ, về người chịu trách nhiệm và về thời điểm đơn được ghi nhận
là đã thu**.

| Nội dung | Tiền mặt | Chuyển khoản |
|---|---|---|
| **Trạng thái phiếu thu ngay sau khi lập** | Chính thức ngay, không cần ai duyệt | **Nháp** |
| **Tiền được ghi vào** | Tài khoản của chính kỹ thuật viên | Tài khoản ngân hàng của công ty |
| **Phát sinh nghĩa vụ cá nhân** | **Có** — kỹ thuật viên đang giữ tiền của công ty | Không |
| **Người phải làm tiếp** | Kỹ thuật viên lập phiếu nộp, kế toán xác nhận | Kế toán đối chiếu sao kê rồi xác nhận |
| **Đơn được tính là đã thu từ lúc nào** | Ngay khi kỹ thuật viên lập phiếu | Chỉ khi kế toán xác nhận |
| **Hoá đơn phát sinh khi nào** | Do tác vụ tự động chạy hằng ngày, sớm nhất là một ngày sau phiếu giao hàng | **Ngay lập tức** khi kế toán xác nhận phiếu thu |
| **Hỗ trợ trên ứng dụng** | Không có bước trung gian | Mã QR theo đúng tài khoản và đúng số tiền |
| **Qui mô thực tế** | 4.582 phiếu chính thức | 6.853 phiếu chính thức và **792 phiếu còn nháp** |

Số liệu ở dòng cuối tính trên các phiếu thu do kỹ thuật viên lập từ ứng dụng, đến ngày
15/09/2026.

### 3.2. Trường hợp khách hàng trả bằng cả hai hình thức

Trường hợp này không phải là ngoại lệ phải xin phép: hệ thống hỗ trợ sẵn. Cách làm là **lập hai
dòng thu trên cùng một đơn**, một dòng tiền mặt và một dòng chuyển khoản.

Kết quả là **hai phiếu thu riêng biệt**, mỗi phiếu đi theo đúng đường xử lý của hình thức đó:

| Nội dung | Diễn biến |
|---|---|
| Phần tiền mặt | Chính thức ngay; kỹ thuật viên phát sinh công nợ cá nhân và phải nộp về công ty |
| Phần chuyển khoản | Nằm ở trạng thái nháp cho tới khi kế toán đối chiếu sao kê |
| Đơn được coi là thu đủ | Chỉ khi **cả hai** phiếu đều đã chính thức |
| Hoá đơn | Phát sinh tại thời điểm phiếu sau cùng được xác nhận |
| Nghĩa vụ nộp tiền của kỹ thuật viên | Tính trên **phần tiền mặt**, không chờ phần chuyển khoản |

Ví dụ một đơn có thật trị giá 65.550.000 đồng được thanh toán làm ba lần: đặt cọc 5.500.000 đồng
bằng chuyển khoản lúc lập đơn, 60.000.000 đồng tiền mặt thu tại nhà khách hàng sau khi lắp đặt
xong, và 50.000 đồng còn lại chuyển khoản vào hôm sau. Bốn phút sau khi kế toán xác nhận phiếu
thu cuối cùng, hệ thống tự lập hoá đơn và đơn chuyển sang Hoàn tất.

> 📖 Toàn bộ mốc thời gian của đơn này được trình bày tại
> [Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html).

Trên thực tế, **116 đơn** đã được thanh toán bằng cả hai hình thức, chiếm khoảng 1% số đơn có
phiếu thu lập từ ứng dụng. Tỉ lệ thấp, nhưng đây là nhóm đơn có tỉ lệ ghi nhận sai cao nhất, vì người
lập phiếu thường chỉ theo dõi một trong hai phiếu.

### 3.3. Ba sai sót thường gặp khi thu tiền

| Sai sót | Hệ quả |
|---|---|
| Chọn nhầm **tiền mặt** cho khoản khách hàng đã chuyển khoản | Kỹ thuật viên bị ghi một khoản công nợ cá nhân không có thật, và phải nộp một khoản tiền mà mình không giữ |
| Chọn nhầm **chuyển khoản** cho khoản đã thu bằng tiền mặt | Tiền mặt nằm ngoài sổ sách; phiếu thu nằm lại ở trạng thái nháp vì kế toán không tìm thấy giao dịch trong sao kê |
| Thu gộp nhiều đơn rồi chia sai số tiền giữa các dòng | Một đơn thừa tiền, một đơn thiếu tiền; đơn thiếu không xuất được hoá đơn và phiếu công việc bị chặn |

---

## 4. Nộp tiền mặt về công ty

### 4.1. Nguyên tắc: mỗi khoản thu một phiếu nộp

Tiền mặt nằm tại tài khoản kỹ thuật viên được ghi nhận là **công nợ của nhân sự đó với công ty**.
Việc nộp về được thực hiện bằng một phiếu riêng (`Payment Entry` loại *Internal Transfer*).

| Nội dung | Cách hệ thống xử lý |
|---|---|
| Phạm vi một phiếu nộp | Gắn với **đúng một khoản thu**, số tiền bằng đúng khoản thu đó |
| Nộp gộp nhiều khoản | Ứng dụng không hỗ trợ; phải lập lần lượt từng phiếu |
| Nộp một phần | Không hỗ trợ |
| Ảnh chứng từ | Được phép đính kèm khi lập phiếu |
| Trạng thái sau khi lập | **Nháp** — kế toán phải xác nhận |

Hai chốt kiểm soát bảo vệ quỹ:

| Chốt kiểm soát | Tác dụng |
|---|---|
| Kiểm soát nộp trùng | Không cho phép lập hai phiếu nộp cho cùng một khoản đã thu |
| Kiểm soát quỹ âm | Không cho phép nộp nhiều hơn số tiền đang giữ trên tài khoản |

### 4.2. Hệ thống đối chiếu theo liên kết, không đối chiếu theo số dư

Đây là nội dung quan trọng nhất của mục này, và cũng là nội dung thường bị hiểu sai nhất.

Khi xét một khoản thu tiền mặt đã được nộp về hay chưa, hệ thống **không nhìn số dư tài khoản**
mà nhìn **liên kết giữa phiếu nộp và khoản thu**. Một phiếu nộp lập trực tiếp trên Desk, không
gắn với khoản thu cụ thể, sẽ đưa tiền về công ty trên sổ kế toán nhưng **không xoá được dấu nợ**
của khoản thu đó.

Hệ quả: khoản thu vẫn bị tính là chưa nộp, và phiếu công việc liên quan vẫn bị chặn không cho
hoàn thành, mặc dù tiền đã về công ty từ lâu.

Số liệu thực tế cho thấy rõ khoảng cách này:

| Nội dung | Số liệu |
|---|---|
| Khoản thu tiền mặt bị hệ thống đánh dấu **chưa nộp** | 3.679 khoản, tương đương 18,25 tỉ đồng |
| Số dư thực tế còn nằm trên toàn bộ tài khoản của kỹ thuật viên | **0,86 tỉ đồng** |
| Trong số bị đánh dấu chưa nộp, thuộc giai đoạn **trước tháng 3/2026** | 3.639 khoản |
| Phát sinh trong tháng 9/2026 | 35 khoản, tương đương 199 triệu đồng |

Phần chênh lệch gần như toàn bộ thuộc về giai đoạn trước tháng 3/2026, khi phiếu nộp được lập
trên Desk và không gắn liên kết. Từ tháng 3/2026 trở đi, khi kỹ thuật viên lập phiếu nộp trực
tiếp trên ứng dụng, sai lệch gần như không còn: số chưa nộp chỉ còn là các khoản phát sinh
trong tháng hiện hành.

> ✅ **Quy tắc thực hành:** lập phiếu nộp **từ ứng dụng** và chọn đúng khoản thu cần nộp. Không
> lập phiếu nộp thủ công trên Desk, kể cả khi số tiền và tài khoản đều đúng.

---

## 5. Hoá đơn: thời điểm phát sinh và người lập

### 5.1. Điều kiện phát sinh

Hoá đơn (`Sales Invoice`) chỉ được lập khi đơn **đã thu đủ 100%** giá trị, tính trên các phiếu
thu **đã chính thức**. Phiếu thu còn nháp không được tính. Công ty có tham số cho phép xuất hoá
đơn khi chưa thu đủ; tham số này **đang tắt**.

### 5.2. Ba đường phát sinh

| Đường | Ai thực hiện | Thời điểm |
|---|---|---|
| **Lập trên ứng dụng** | Kỹ thuật viên chọn phiếu giao hàng rồi lập hoá đơn | Ngay tại hiện trường, sau khi đã thu đủ |
| **Tự phát sinh khi xác nhận phiếu thu** | Hệ thống | Ngay khi kế toán xác nhận một phiếu thu **chuyển khoản** |
| **Tác vụ tự động chạy hằng ngày** | Hệ thống | Với đơn đã giao đủ, đã thu đủ, và đã qua tối thiểu một ngày kể từ phiếu giao hàng cuối cùng |

Hệ thống đang lập **một hoá đơn cho mỗi phiếu giao hàng**. Đơn có nhiều lần giao sẽ có nhiều hoá
đơn.

Kết quả đo trên thực tế: **40%** hoá đơn phát sinh ngay trong ngày giao hàng, **90%** trong vòng
một tuần.

### 5.3. Ba hệ quả đi kèm hoá đơn

> 🔑 Mốc hoá đơn đủ 100% quyết định đồng thời ba nội dung: đơn chuyển sang trạng thái **Hoàn
> tất**, khách hàng được **cộng điểm tích luỹ**, và hệ thống **phát sinh lịch bảo dưỡng** cho
> kỳ kế tiếp.

---

## 6. Phiếu công việc bị chặn vì lý do thanh toán

Phần lớn trường hợp phiếu công việc (`FS Work Order`) không hoàn thành được đều có nguyên nhân
nằm ở chứng từ thanh toán. Hệ thống nêu rõ lý do trong thông báo; bảng dưới đây dịch từng thông
báo sang việc cần làm.

| Thông báo của hệ thống | Nghĩa thực tế | Việc cần làm |
|---|---|---|
| *“SO …: còn nợ …”* | Tổng phiếu thu **đã chính thức** chưa bằng giá trị đơn | Kiểm tra xem còn phiếu thu chuyển khoản nào đang ở trạng thái nháp; đề nghị kế toán đối chiếu và xác nhận |
| *“SO …: thu tiền mặt nhưng chưa có Internal Transfer về công ty”* | Khoản tiền mặt chưa có phiếu nộp được xác nhận, **hoặc** đã nộp nhưng phiếu nộp không gắn liên kết | Lập phiếu nộp từ ứng dụng và chọn đúng khoản thu; trường hợp đã nộp trên Desk thì đề nghị kế toán lập lại phiếu có liên kết |
| *“SO …: đã trả về … nhưng thu … (thiếu …)”* | Tổng số tiền đã nộp nhỏ hơn tổng số tiền đã thu | Nộp nốt phần chênh lệch. **Hệ thống không có dung sai**: lệch một đồng cũng bị chặn |
| *“Sales Order not completed: …”* | Đơn liên kết chưa ở trạng thái *Hoàn tất* hoặc *Đóng đơn* | Xử lý phần hoá đơn theo mục 5 |
| *“Số dư tài khoản KTV … không đủ”* | Số tiền định nộp lớn hơn số dư đang có trên tài khoản | Đối chiếu lại các khoản đã nộp; nhiều khả năng khoản này đã được nộp bằng một phiếu khác |
| *“Công nợ … đã được trả qua …”* | Khoản thu này đã có phiếu nộp, kể cả phiếu còn nháp | Không lập thêm phiếu; tra cứu phiếu nộp đang tồn tại theo mã ghi trong thông báo |

---

## 7. Sửa và huỷ phiếu thu

| Nội dung | Quy định |
|---|---|
| Thời hạn huỷ trên ứng dụng | **24 giờ** kể từ lúc lập; đây là tham số cấu hình của công ty |
| Người được huỷ | Chỉ người đã lập phiếu |
| Trường hợp không huỷ được | Khoản thu đã có phiếu nộp đối ứng, kể cả phiếu nộp còn ở trạng thái nháp |
| Quá thời hạn | Việc huỷ do kế toán thực hiện trên Desk |
| Trình tự khi đơn đã có hoá đơn | Phải huỷ theo trình tự ngược: hoá đơn trước, phiếu thu sau, vì hai chứng từ đang liên kết với nhau |

---

## 8. Phương thức B — Gửi qua đơn vị vận chuyển

Áp dụng khi khách hàng ở xa, hàng không cần lắp đặt, hoặc chỉ gửi vật tư lẻ. Phương thức này
hiện được sử dụng ít — **27 vận đơn** trên toàn hệ thống — nhưng quy trình đã được xây dựng đầy
đủ.

| Bước | Nội dung | Chứng từ | Tồn kho thay đổi |
|---|---|---|---|
| 1 | Lập vận đơn từ đơn bán hàng | Vận đơn (`DP Shipment`) | Chưa |
| 2 | Xác nhận vận đơn | Đề nghị xuất kho (`Material Request`) tự phát sinh | Chưa |
| 3 | Kho xuất hàng bàn giao cho đơn vị vận chuyển | Phiếu xuất kho (`Stock Entry`) | **Có** — trừ kho nguồn, cộng kho của đơn vị vận chuyển |
| 4 | Đẩy đơn sang đơn vị vận chuyển và tiếp nhận mã vận đơn | Ghi mã vào vận đơn | Không |
| 5 | Đơn vị vận chuyển cập nhật hành trình | Trạng thái vận đơn tự cập nhật | Không |
| 6 | Giao thành công | Phiếu giao hàng, hoá đơn và phiếu thu tiền thu hộ **tự phát sinh** | **Có** — xuất khỏi kho của đơn vị vận chuyển |

Ba kết cục khác:

| Kết cục | Xử lý của hệ thống |
|---|---|
| **Hoàn về kho** | Phát sinh phiếu đảo, chuyển hàng từ kho của đơn vị vận chuyển về lại kho nguồn |
| **Mất hàng** | Ghi nhận thất thoát để kế toán xử lý, **không** tự hoàn tồn kho |
| **Giao không thành công, đang hoàn** | Chỉ cập nhật trạng thái, chờ kết cục cuối cùng |

> ⚠️ Trường hợp đơn vị vận chuyển huỷ đơn **khi hàng đã được lấy đi**, **chưa huỷ vận đơn ngay**.
> Cần chờ kho tiếp nhận lại hàng trên thực tế rồi mới huỷ, nếu không sổ kho sẽ sai lệch.

📚 Nội dung chi tiết: [Quy trình vận đơn và giao nhận](Delivery_Partner-Quy-Trinh.html).

---

## 9. Ba khái niệm hoàn trả cần phân biệt

Thuật ngữ *trả hàng* đang được dùng cho ba nghiệp vụ khác nhau. Nhầm lẫn giữa ba nghiệp vụ này
là nguyên nhân của nhiều sai lệch khi đối chiếu kho.

| Cách gọi thông dụng | Bản chất nghiệp vụ | Chứng từ | Qui mô |
|---|---|---|---|
| **Khách hàng không tiếp nhận khi giao** | Giảm số lượng trên phiếu giao hàng; phần chênh lệch thành nghĩa vụ trả | Ghi nhận trong đơn bán hàng | Rất thường xuyên |
| **Kỹ thuật viên hoàn trả vật tư về kho** | Chuyển hàng từ kho cá nhân về kho công ty | Phiếu trả (`Stock Entry`) | Rất thường xuyên |
| **Khách hàng trả hàng sau khi đã nhận** | Đảo ngược nghiệp vụ bán đã hoàn tất | Phiếu giao hàng trả lại và hoá đơn trả lại | **Hiếm** — 20 phiếu giao trả lại và 1 hoá đơn trả lại trên toàn hệ thống |

Chỉ nghiệp vụ thứ ba làm **giảm doanh thu** và **thu hồi điểm tích luỹ** của khách hàng.

---

## 10. Ngoại lệ thường gặp

| Hiện tượng | Nguyên nhân | Hướng xử lý |
|---|---|---|
| Không thu được tiền, báo *“Chưa tạo phiếu giao hàng”* | Chưa lập phiếu giao hàng cho đơn | Lập phiếu giao hàng trước |
| Màn hình thu tiền không cho thao tác | Kỹ thuật viên chưa được khai tài khoản thu tiền cho công ty của đơn | Đề nghị bộ phận quản trị khai tài khoản |
| Không xác nhận được phiếu giao hàng | Có đơn bị hoàn trả toàn bộ số món | Mỗi đơn phải giao tối thiểu một món; tách đơn nếu thực tế không giao món nào |
| Chức năng xác nhận không kích hoạt ở màn hình ký | Khách hàng chưa ký xác nhận | Đề nghị khách hàng ký, hoặc xoá chữ ký lỗi rồi ký lại |
| Báo *“… đã có dòng Tiền mặt”* khi thêm dòng thu | Một đơn không được có hai dòng cùng hình thức trong một lần thu | Sửa số tiền trên dòng đã có, hoặc thu lần thứ hai sau khi đã hoàn tất lần thứ nhất |
| Đơn đã thu tiền nhưng **vẫn hiển thị còn nợ** | Phiếu thu chuyển khoản còn ở trạng thái nháp | Đề nghị kế toán đối chiếu sao kê và xác nhận phiếu |
| Đã thu tiền mặt nhưng **vẫn còn công nợ cá nhân** | Chưa lập phiếu nộp, hoặc phiếu nộp còn nháp | Lập phiếu nộp từ ứng dụng; đề nghị kế toán xác nhận |
| Đã nộp tiền nhưng hệ thống **vẫn báo chưa nộp** | Phiếu nộp lập trên Desk, không gắn liên kết với khoản thu | Xem mục 4.2; đề nghị kế toán lập lại phiếu nộp có liên kết |
| Không huỷ được phiếu thu vừa lập | Quá 24 giờ, hoặc đã có phiếu nộp đối ứng | Chuyển kế toán xử lý theo quy trình |
| Đơn đã giao đủ nhưng **chưa chuyển Hoàn tất** | Chưa xuất hoá đơn đủ 100% | Kế toán xuất nốt hoá đơn; khi chưa đủ thì chưa cộng điểm và chưa phát sinh lịch bảo dưỡng |
| Vận đơn đã xác nhận nhưng **tồn kho chưa thay đổi** | Đúng thiết kế: xác nhận chỉ phát sinh đề nghị xuất kho | Kho phải lập phiếu xuất kho thực tế ở bước 3 |
| Vận đơn đã *Delivered* nhưng **không thấy chứng từ tự phát sinh** | Vận đơn không gắn đơn bán hàng, hoặc kết nối trạng thái chưa được bật | Kiểm tra bảng chứng từ nguồn trên vận đơn; nếu vẫn chưa có thì báo bộ phận kỹ thuật |
| Đơn vị vận chuyển tính **sai cước, sai số kiện** | Tab kiện hàng và người trả cước khai sai trước khi đẩy đơn | Cập nhật **trước khi đẩy đơn**; nếu đã đẩy thì xử lý với đơn vị vận chuyển |
| Hoá đơn đã xuất nhưng khách hàng trả hàng | Nghiệp vụ trả hàng sau bán | Lập phiếu giao trả lại và hoá đơn trả lại; hệ thống **tự thu hồi điểm tích luỹ** tương ứng |

---

## 11. Chặng tiếp theo

Đơn đã hoàn tất. Đây là thời điểm hệ thống bắt đầu tính lịch chăm sóc cho kỳ kế tiếp:
**[Chặng 6 — Bảo dưỡng định kỳ và vòng lặp](Quy-Trinh-06-Bao-Duong.html)**.
