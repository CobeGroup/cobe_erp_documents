---
title: 6 · Bảo dưỡng định kỳ và vòng lặp
layout: default
parent: Quy trình hợp nhất
nav_order: 7
---

# Chặng 6 — Bảo dưỡng định kỳ và vòng lặp
{: .no_toc }

**Vai trò thực hiện:** Nhân viên dịch vụ · Quản lý dịch vụ · Hệ thống tự động
{: .fs-3 .text-grey-dk-000 }

Đây là chặng khép kín vòng đời khách hàng. Khách hàng đã mua thiết bị sẽ cần thay lõi sau vài
tháng và bảo dưỡng sau một năm. Hệ thống ghi nhận nhu cầu này ngay từ khi đơn hàng hoàn tất và
tự phát sinh lịch nhắc đúng hạn.

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ chặng

<a href="images/svg/quy-trinh/07-bao-duong-lap-lai.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/07-bao-duong-lap-lai.svg" alt="Đơn hàng hoàn tất sinh ra các dòng nhắc theo vật tư; hệ thống gom các dòng nhắc của cùng một khách hàng có lịch gần nhau thành một phiếu nhắc bảo dưỡng, phân người phụ trách rồi liên hệ khách hàng. Phiếu được khách hàng đồng ý sẽ phát sinh đơn bán hàng mới và quay lại đầu vòng; phiếu chưa chốt được ghi nhận là hẹn lại, không liên hệ được hoặc không có nhu cầu" style="width:100%;height:auto">
</a>

---

## 1. Hai loại bản ghi nhắc lịch

| Loại | Tên trên hệ thống | Nội dung | Vai trò sử dụng |
|---|---|---|---|
| **Nhắc theo vật tư** | `Item Service Reminder` | Lịch của **một vật tư** trên **một đơn hàng**: chu kỳ thay thế và ngày đến hạn kế tiếp | Hệ thống tự quản lý; người dùng hầu như không thao tác |
| **Phiếu nhắc bảo dưỡng** | `Service Ticket Reminder` | **Công việc cần thực hiện**: liên hệ khách hàng và chốt lịch | Nhân viên dịch vụ làm việc hằng ngày trên bản ghi này |

Quan hệ giữa hai loại: nhiều dòng nhắc theo vật tư được **gom lại** thành một phiếu nhắc bảo
dưỡng, nhằm bảo đảm **một lần liên hệ và một lần đến** giải quyết được nhiều hạng mục, thay vì
liên hệ khách hàng nhiều lần trong cùng một tuần.

---

## 2. Bước 1 — Đơn hàng hoàn tất phát sinh lịch nhắc

Ngay khi đơn bán hàng chuyển sang **Completed**, hệ thống rà soát từng món trong đơn:

| Loại món | Cách xử lý |
|---|---|
| Có khai **chu kỳ nhắc** | Phát sinh một dòng nhắc theo vật tư, đặt sẵn ngày đến hạn kế tiếp |
| Là **bộ sản phẩm** | Khai triển thành từng món thành phần rồi mới xét |
| Không khai chu kỳ | Bỏ qua |

Chu kỳ được khai trong danh mục cấu hình theo từng mã hàng, thông thường từ vài tháng đến hai
năm tuỳ loại lõi.

> 🔑 **Điều kiện bắt buộc là đơn phải ở trạng thái *Completed*.** Đơn đã giao hàng nhưng kế
> toán chưa xuất đủ hoá đơn vẫn ở trạng thái *To Bill* và **không phát sinh lịch nhắc nào**.
> Đây là nguyên nhân phổ biến nhất của tình trạng khách hàng đã mua nhưng hệ thống không nhắc
> bảo dưỡng.

### Quy tắc hạn chế phát sinh phiếu không cần thiết

Một thiết bị gồm thân máy và nhiều lõi. Nếu nhắc cho cả thân máy lẫn từng lõi thì cùng một lần
đến sẽ phát sinh nhiều phiếu. Hệ thống áp dụng quy tắc theo hai chiều để hạn chế tình trạng này:

- Đơn có bán **lõi lọc có chu kỳ nhắc** thì **không phát sinh nhắc cho thân máy**, vì nhân sự
  vẫn phải đến địa điểm khách hàng để thay lõi.
- Ngược lại, khi một lịch nhắc lõi lọc được phát sinh, các lịch nhắc kết cấu đang chờ của cùng
  thiết bị sẽ **được ngừng lại**.

Đơn bán **thiết bị không kèm lõi** vẫn phát sinh nhắc cho thân máy, vì đó là điểm tiếp xúc duy
nhất với khách hàng.

---

## 3. Bước 2 — Gom thành phiếu nhắc bảo dưỡng

Khi một dòng nhắc mới được phát sinh, hệ thống kiểm tra xem khách hàng đã có phiếu nhắc nào
đang mở hay chưa:

| Trường hợp | Cách hệ thống xử lý |
|---|---|
| Khách hàng chưa có phiếu đang mở | **Lập phiếu mới** |
| Có phiếu đang mở, **cùng địa chỉ**, ngày đến hạn **gần nhau** trong khoảng cho phép | **Bổ sung** vào phiếu đó và ghi thêm mã đơn vào danh sách đơn tham chiếu |
| Có phiếu đang mở nhưng khác địa chỉ hoặc ngày cách xa | **Lập phiếu mới** |

Khoảng ngày được coi là gần nhau là một tham số cấu hình dùng chung.

Phiếu nhắc mang theo các thông tin: khách hàng, địa chỉ, người liên hệ, số điện thoại, tỉnh và
quận, danh sách hạng mục cần thay, **ngày đến hạn trung bình** của các hạng mục và **doanh thu
ước tính**.

---

## 4. Bước 3 — Phân công người phụ trách

Hệ thống lựa chọn nhân sự liên hệ khách hàng theo **sáu tiêu chí tính điểm**:

| # | Tiêu chí | Ý nghĩa |
|---|---|---|
| 1 | **Nhân sự đã chăm sóc khách hàng trước đây** | Trọng số cao nhất, bảo đảm khách hàng quen được giữ đúng người phụ trách |
| 2 | **Chuyên môn** | Am hiểu dòng sản phẩm liên quan |
| 3 | **Hiệu suất** | Tỉ lệ chốt đơn trong thời gian gần đây |
| 4 | **Mức độ tương tác** | Đã trao đổi trên phiếu này gần đây |
| 5 | **Địa bàn** | Phụ trách đúng tỉnh hoặc quận của khách hàng |
| 6 | **Cân bằng khối lượng** | Nhân sự đang ít việc được cộng điểm, đang quá tải bị trừ điểm |

Khi nhân sự cũ nghỉ việc, khách hàng quen **không bị gián đoạn liên lạc**: hệ thống truy theo
số điện thoại công ty mà nhân sự đó từng quản lý, xác định người đang tiếp quản số điện thoại
và chuyển phiếu sang người đó.

Song song còn một cơ chế **phân công theo tháng**, chia đều khối lượng cho từng nhân sự trong
từng tháng. Hai cơ chế loại trừ lẫn nhau thông qua một tham số cấu hình.

> Người dùng **luôn có thể điều chỉnh thủ công** sau khi hệ thống phân công. Mọi lần phân công
> đều được ghi lại kèm lý do và tra cứu được trong tab quản lý của phiếu.

---

## 5. Bước 4 — Liên hệ khách hàng và ghi nhận kết quả

Nhân viên dịch vụ làm việc trên danh sách phiếu nhắc, mặc định lọc theo ngày đến hạn sắp tới.
Sau khi liên hệ, kết quả được ghi vào ô trạng thái.

| Trạng thái | Ý nghĩa | Số phiếu hiện có |
|---|---|---|
| **Open** | Chưa xử lý | 43.322 |
| **Converted** | Đã chốt, đã lập đơn hàng mới | 16.046 |
| **Reschedule Reminder Date** | Khách hàng hẹn dịp khác, dời ngày nhắc | 12.802 |
| **Disable** | Ngừng nhắc đối với chuỗi này | 8.725 |
| **Unable to Contact** | Không liên hệ được | 568 |
| **Lost** | Khách hàng không có nhu cầu, có ghi nhận lý do | 425 |
| **Contact Later** | Liên hệ lại sau | 356 |
| **Under Care** | Đang chăm sóc, chưa chốt | 214 |
| **Cancelled** | Đơn đã lập nhưng bị huỷ | 78 |

Khi ghi nhận trạng thái **Lost**, hệ thống bắt buộc chọn **lý do**: không có nhu cầu, đợi khách
hàng kiểm tra, chưa sắp xếp được thời gian, mua bên ngoài, đã hẹn lại nhiều lần, không đồng ý
chuyển sang loại lõi khác. Đây là dữ liệu đầu vào để cải thiện kịch bản bán hàng.

---

## 6. Bước 5 — Lập đơn hàng mới

Khi khách hàng đồng ý, nhân viên chọn **Create → Sales Order** ngay trên phiếu nhắc. Hệ thống
điền sẵn khách hàng, địa chỉ, liên hệ và ghi **liên kết ngược** về phiếu nhắc.

Khi đơn được xác nhận, phiếu nhắc **tự chuyển sang Converted**. Khi đơn bị huỷ, phiếu nhắc **tự
chuyển sang Cancelled**. Nhân viên không phải cập nhật thủ công.

> ⚠️ Lập đơn bằng cách tạo mới trên Desk rồi nhập thủ công tên khách hàng sẽ mất liên kết
> ngược: phiếu nhắc giữ nguyên trạng thái *Open*, và kết quả chốt đơn không được ghi nhận cho
> nhân sự nào.

Đơn hàng mới này sau đó cũng sẽ hoàn tất và lại phát sinh lịch nhắc cho kỳ kế tiếp. **Vòng đời
khép lại.**

---

## 7. Vòng kế tiếp và cơ chế hoãn

Ngay khi một vòng nhắc được phát sinh, hệ thống đã đặt sẵn **ngày đến hạn của vòng kế tiếp**
theo chu kỳ của từng hạng mục. Một tác vụ chạy hằng đêm rà soát các chuỗi đến hạn và phát sinh
vòng mới.

Hai cơ chế bảo vệ:

| Cơ chế | Mục đích |
|---|---|
| **Rà soát bù** | Tác vụ quét cả một số ngày gần đây thay vì chỉ đúng ngày hiện tại. Nếu tác vụ không chạy được một đêm, đêm kế tiếp vẫn xử lý bù, chuỗi không bị gián đoạn vĩnh viễn |
| **Hoãn khi khách hàng còn phiếu chờ** | Khách hàng còn phiếu chưa xử lý thì tạm chưa phát sinh vòng mới, nhằm tránh liên hệ khách hàng hai lần cho cùng một lần đến. Mỗi lần hoãn dời ngày đến hạn một khoảng ngắn rồi xét lại |

Cơ chế hoãn có một ngưỡng kiểm soát: phiếu chờ **đã quá hạn quá lâu** được coi là tồn đọng chứ
không phải công việc sắp tới. Nếu để phiếu tồn đọng chặn mãi thì chuỗi sẽ bị khoá vĩnh viễn,
do đó ngưỡng bỏ qua được khai trong cấu hình.

---

## 8. Ngoại lệ thường gặp

| Hiện tượng | Nguyên nhân | Hướng xử lý |
|---|---|---|
| Khách hàng đã mua nhưng **không có phiếu nhắc** | Đơn chưa ở trạng thái *Completed* | Kiểm tra tiến độ giao hàng và xuất hoá đơn của đơn |
| Đơn đã hoàn tất nhưng vẫn không phát sinh nhắc | Mặt hàng **chưa được khai chu kỳ nhắc** | Đề nghị quản trị viên khai chu kỳ cho mã hàng |
| Một khách hàng có **nhiều phiếu trùng nhau** | Khác địa chỉ, hoặc ngày đến hạn cách xa nên không gom được; hoặc dữ liệu cũ phát sinh trước khi có cơ chế hoãn | Gộp thủ công và đóng bớt phiếu thừa kèm ghi chú |
| Phiếu tồn đọng quá hạn rất lâu | Tồn từ đợt rà soát bù dữ liệu cũ | Tác vụ tự động mặc định **không xử lý phần tồn đọng quá hạn**; cần xử lý theo đợt có kiểm soát |
| Phiếu được phân cho nhân sự không phù hợp | Chưa khai chuyên môn hoặc địa bàn phụ trách | Khai bổ sung; các phiếu sau tự phân đúng, phiếu cũ phân công lại thủ công |
| Nhân sự nghỉ việc nhưng khách hàng quen **không được chuyển giao** | Số điện thoại công ty chưa được bàn giao | Bàn giao số điện thoại theo đúng quy trình |
| Đã lập đơn nhưng **phiếu vẫn ở trạng thái Open** | Đơn lập thủ công, mất liên kết ngược | Đề nghị quản trị viên gắn lại liên kết, hoặc đóng phiếu thủ công kèm ghi chú |
| Cần **ngừng nhắc hẳn** cho một khách hàng hoặc một hạng mục | Khách hàng chuyển địa điểm, ngừng sử dụng thiết bị, hoặc mua nơi khác | Ghi trạng thái **Disable** kèm lý do; chuỗi dừng và không phát sinh vòng mới |
| Cần tách một phiếu thành hai | Khách hàng chỉ đồng ý thay một phần hạng mục | Sử dụng chức năng **Tách phiếu** trên form |

---

## 9. Chặng còn lại

Vòng bảo dưỡng là luồng vận hành thông thường. Khi thiết bị phát sinh hỏng hóc giữa chu kỳ,
khách hàng đi theo đầu vào khác: **[Chặng 7 — Sự cố](Quy-Trinh-07-Su-Co.html)**.
