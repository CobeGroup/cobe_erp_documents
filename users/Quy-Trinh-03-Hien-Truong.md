---
title: 3 · Điều phối và hiện trường
layout: default
parent: Quy trình hợp nhất
nav_order: 4
---

# Chặng 3 — Điều phối và thực hiện tại hiện trường
{: .no_toc }

**Ai làm:** Điều phối · Kỹ thuật viên · Quản lý dịch vụ
{: .fs-3 .text-grey-dk-000 }

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ chặng

<a href="images/svg/quy-trinh/04-hien-truong.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/04-hien-truong.svg" alt="Ba tầng: điều phối lập phiếu công việc, lập lịch hẹn và gán kỹ thuật viên; kỹ thuật viên nhận thông báo, bắt đầu di chuyển, check-in làm việc rồi check-out; kết quả là lịch hẹn hoàn tất, phiếu công việc hoàn tất và đóng phiếu" style="width:100%;height:auto">
</a>

---

## 1. Ba loại phiếu, ba vai trò khác nhau

| Phiếu | Tên hệ thống | Trả lời câu hỏi |
|---|---|---|
| **Đơn bán hàng** | `Sales Order` | Bán cái gì, giá bao nhiêu, ai chịu trách nhiệm doanh thu |
| **Phiếu công việc** | `FS Work Order` | Vụ việc kỹ thuật này là gì, ở đâu, cần làm những gì |
| **Lịch hẹn dịch vụ** | `FS Service Appointment` | Một buổi cụ thể: ai đi, đi lúc nào, đã làm xong chưa |

Quan hệ giữa chúng là **một–nhiều theo cả hai tầng**: một đơn hàng có thể sinh nhiều phiếu
công việc, một phiếu công việc có thể có nhiều lịch hẹn. Ví dụ thường gặp: khách mua máy, lần
một xuống khảo sát mặt bằng, lần hai xuống lắp đặt — một phiếu công việc, hai lịch hẹn.

> ⚠️ **Điểm cốt lõi phải nhớ: trạng thái của ba phiếu này độc lập với nhau.** Hoàn thành lịch
> hẹn không đẩy phiếu công việc sang hoàn thành. Đơn hàng hoàn tất không đóng phiếu công việc.
> Đây là thiết kế cố ý, và nó giải thích gần như toàn bộ các ca *“phiếu không tự chạy”*.

---

## 2. Lập phiếu công việc

Phiếu công việc **không tự sinh**. Luôn phải có người bấm tạo, từ một trong hai nguồn:

| Lập từ | Cách làm | Dùng cho |
|---|---|---|
| **Đơn bán hàng** | Mở đơn đã xác nhận → **Create → FS Work Order** | Lắp đặt, bảo dưỡng, giao hàng có lắp |
| **Phiếu sự cố** | Mở phiếu sự cố → **Create → FS Work Order** | Khách báo hỏng, cần người xuống kiểm tra |

Hệ thống tự điền công ty, khách hàng, địa chỉ, liên hệ và khoảng thời gian dự kiến. Phiếu mới
luôn ở trạng thái **New**.

### Chọn đúng loại việc

Ô **Loại việc** (`Work Type`) quyết định hệ thống đòi những gì khi hoàn thành phiếu.

| Loại việc | Số phiếu | Yêu cầu đặc trưng |
|---|---|---|
| Bảo dưỡng | 9.599 | Thường kèm giao vật tư và thu tiền |
| Sự cố | 3.350 | Thường yêu cầu ảnh hiện trường |
| Lắp đặt | 2.076 | Kèm giao hàng, nghiệm thu, thu tiền |
| Khảo sát | 912 | Không giao hàng, không thu tiền |

Chọn sai loại việc thì hệ thống hoặc đòi thứ không cần, hoặc bỏ qua thứ đáng lẽ phải kiểm — và
**không có cảnh báo nào cho việc chọn sai**.

---

## 3. Lập lịch hẹn và gán kỹ thuật viên

Từ phiếu công việc chưa đóng, bấm **Create → Service Appointment**. Lịch hẹn tự gắn về phiếu cha.

Lịch hẹn **tự đổi trạng thái** theo dữ liệu được điền, không cần bấm:

| Trạng thái | Tự chuyển khi |
|---|---|
| **None** | Chưa có lịch, chưa có người |
| **Scheduled** | Đã có khung giờ hẹn |
| **Dispatched** | Đã có khung giờ **và** đã gán kỹ thuật viên |
| **In Progress** | Kỹ thuật viên bắt đầu di chuyển hoặc check-in |
| **Completed** | Kết thúc buổi làm, đủ điều kiện |
| **Cannot Complete** | Không làm được, có lý do |
| **Canceled** | Huỷ, **bắt buộc nhập lý do huỷ** |

Việc gán và xếp lịch làm trên **màn điều phối** `/smart-scheduler` — nhìn được lịch cả đội theo
dòng thời gian, kéo thả để đổi giờ và đổi người.

> 🔒 **Khoá theo trạng thái:** lịch hẹn đã ở *Completed*, *Cannot Complete* hoặc *Canceled* thì
> không đổi được kỹ thuật viên nữa; từ *In Progress* trở đi thì không đổi được khung giờ nữa.

### Nhiều kỹ thuật viên trên một buổi

Một lịch hẹn có thể gán nhiều người, mỗi người một **tỉ lệ đóng góp**. Tổng các tỉ lệ phải
đúng **100%** — đây là căn cứ chia công ca. Khi gỡ một người khỏi lịch, hệ thống mở hộp thoại
buộc phân bổ lại phần trăm cho những người còn lại.

---

## 4. Kỹ thuật viên tại hiện trường

Toàn bộ thao tác làm trên **ứng dụng kỹ thuật viên** `/technician`, theo đúng thứ tự:

| Bước | Thao tác | Hệ thống ghi nhận |
|---|---|---|
| 1 | Nhận thông báo việc mới | Thông báo đẩy về điện thoại |
| 2 | **Bắt đầu di chuyển** | Lịch hẹn chuyển *In Progress*, ghi thời điểm bắt đầu thực tế |
| 3 | **Check-in** tại nhà khách | Ghi vị trí và thời điểm có mặt |
| 4 | Thực hiện các **bước công việc** | Đánh dấu từng đầu việc xong · chưa xong · không áp dụng |
| 5 | **Chụp ảnh** nếu loại việc bắt buộc | Ảnh đính vào lịch hẹn |
| 6 | Giao hàng, thu tiền nếu có | Xem [Chặng 5](Quy-Trinh-05-Giao-Hang-Thu-Tien.html) |
| 7 | **Check-out** | Ghi thời điểm kết thúc |
| 8 | **Hoàn thành lịch hẹn** | Hệ thống kiểm bốn điều kiện dưới đây |

### Bốn điều kiện để hoàn thành lịch hẹn

| Điều kiện | Nếu thiếu, hệ thống nói |
|---|---|
| Lịch hẹn đang ở *In Progress* | *“must transition to In Progress before completing”* |
| Đã có thời điểm bắt đầu thực tế | *“Cannot complete: no Actual Start”* |
| **Mọi** kỹ thuật viên đã check-out hoặc đã gỡ khỏi lịch | *“all resources must be Checked-out or Canceled. Pending: …”* |
| Đủ yêu cầu theo loại việc, ví dụ có ảnh | *“no photo attached (Work Type requires Photo)”* |

> Lỗi hiện **nguyên văn như nhau** trên cả Desk lẫn ứng dụng. Kỹ thuật viên đọc được ngay thiếu
> gì, không cần gọi điều phối hỏi.

---

## 5. Hoàn thành phiếu công việc — sáu điều kiện

Đây là điểm bị hiểu nhầm nhiều nhất trong toàn hệ thống. Phiếu công việc chuyển sang **Completed**
theo **một trong hai đường**, và cả hai đều phải vượt **cùng một bộ sáu điều kiện**:

- **Đường thủ công:** người dùng đổi trạng thái trên Desk, hoặc kỹ thuật viên bấm *Hoàn thành*
  trên ứng dụng.
- **Đường tự động:** một **tác vụ chạy đêm** quét các phiếu đang *New* hoặc *In Progress*, phiếu
  nào đủ điều kiện thì hoàn thành, và ghi lại kết quả để tra sau.

<a href="images/svg/quy-trinh/09-sau-dieu-kien-wo.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/09-sau-dieu-kien-wo.svg" alt="Sáu điều kiện xếp chồng: trạng thái cho phép, các bước công việc bắt buộc đã xong, mọi lịch hẹn đã kết thúc, tiền và vật tư đã sạch nợ, đơn bán hàng liên kết đã xong, và yêu cầu riêng theo loại việc. Qua đủ sáu thì phiếu chuyển sang hoàn thành, thiếu bất kỳ điều nào thì hệ thống chặn và nêu rõ lý do" style="width:100%;height:auto">
</a>

| # | Điều kiện | Trạng thái công tắc |
|---|---|---|
| 1 | Trạng thái hiện tại cho phép chuyển sang *Completed* | Luôn kiểm |
| 2 | Mọi **bước công việc bắt buộc** đã xong hoặc đã đánh dấu bỏ | Luôn kiểm, nếu phiếu có bước công việc |
| 3 | Mọi **lịch hẹn** đã kết thúc, và phiếu phải có **ít nhất một** lịch hẹn | **Đang bật** |
| 4 | Tiền mặt đã nộp · vật tư đã trả · đơn hàng đã thu đủ | Ba công tắc riêng — xem bảng dưới |
| 5 | **Đơn bán hàng** liên kết đã *Completed* hoặc *Closed* | **Đang tắt** |
| 6 | Yêu cầu riêng theo **loại việc** | Theo cấu hình từng loại việc |

Ba công tắc trong điều kiện 4:

| Công tắc | Mặc định | Tác dụng khi bật |
|---|---|---|
| Kiểm **đơn hàng đã thu đủ tiền** | **Bật** | Đơn còn công nợ thì chặn hoàn thành phiếu |
| Kiểm **tiền mặt đã nộp về công ty** | Tắt | Kỹ thuật viên còn giữ tiền thì chặn |
| Kiểm **vật tư đã trả về kho** | Tắt | Còn nợ hàng thì chặn |

### Tác vụ đêm còn một điều kiện nữa: thời gian ân hạn

Ngay cả khi đủ sáu điều kiện, tác vụ đêm vẫn **chờ thêm một số ngày tính từ lịch hẹn cuối
cùng** rồi mới đụng tới phiếu. Mục đích là chừa thời gian cho kỹ thuật viên bổ sung chứng từ
và cho khách phản hồi. Phiếu chưa đủ số ngày đó sẽ bị bỏ qua, có ghi rõ lý do trong nhật ký.

> ⚠️ **Phiếu đang *On Hold* bị tác vụ đêm bỏ qua hoàn toàn.** Muốn nó chạy, phải đưa phiếu về
> *In Progress* trước.

---

## 6. Đóng, mở lại và huỷ phiếu

### Đóng và mở lại

| Việc | Cách làm | Lưu ý |
|---|---|---|
| Đóng phiếu công việc | Nút **Close** | Trạng thái cuối; nút tạo lịch hẹn bị ẩn |
| Mở lại phiếu đã đóng | Nút **Re-open** | Khôi phục đúng trạng thái trước khi đóng |
| Sửa lịch hẹn đã hoàn tất | Đổi trạng thái *Completed → In Progress* | Dữ liệu thực tế được **giữ nguyên** |
| Làm lại lịch hẹn đã huỷ | Đổi trạng thái về *Scheduled* | ⚠️ **Xoá sạch** dữ liệu check-in, check-out, giờ giấc |
| Cần một buổi mới cho cùng vụ việc | Tạo lịch hẹn mới từ phiếu công việc | Cách an toàn hơn mở lại lịch cũ |

### Huỷ — luôn từ trong ra ngoài

```
1. Huỷ lịch hẹn   (bắt buộc nhập lý do huỷ)
2. Huỷ phiếu công việc
3. Huỷ đơn bán hàng
```

Các phiếu khoá lẫn nhau để chống huỷ nhầm gây lệch dữ liệu:

| Huỷ | Bị chặn khi | Hệ thống nói |
|---|---|---|
| Đơn bán hàng | Còn phiếu công việc liên kết chưa huỷ | *“Cannot cancel this Sales Order because it is linked to FS Work Order …”* |
| Phiếu công việc | Còn lịch hẹn liên kết chưa huỷ | *“Cannot cancel this Work Order because it is linked to Service Appointment …”* |
| Lịch hẹn | Đang ở *Completed* · *Cannot Complete* · *Canceled* | *“Cannot hủy Service Appointment when in status … Change status first.”* |

> ⚠️ **Huỷ phiếu công việc không tự trả kho.** Vật tư kỹ thuật viên đã nhận vẫn phải trả về
> bằng phiếu trả như thường — xem [Chặng 4](Quy-Trinh-04-Vat-Tu.html).

---

## 7. Ngoại lệ thường gặp ở chặng này

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Lịch hẹn và đơn hàng đã xong mà **phiếu công việc vẫn ở New** | Vướng một trong sáu điều kiện, hoặc chưa hết thời gian ân hạn | Bấm hoàn thành tay để hệ thống nêu đúng lý do; xem [Tự xử lý sự cố dịch vụ](FSMNext-Xu-Ly-Su-Co.html) |
| Phiếu đủ điều kiện mà tác vụ đêm vẫn bỏ qua | Phiếu đang *On Hold*, hoặc chưa hết ân hạn | Đưa về *In Progress*, hoặc chờ đủ ngày |
| Không hoàn thành được vì *“SO chưa thanh toán đủ”* | Công tắc kiểm công nợ đang bật, đơn còn nợ | Thu nốt tiền, hoặc nhờ quản trị xem lại đơn |
| Không hoàn thành được vì *“Chưa trả kho đủ”* | Công tắc kiểm vật tư đang bật | Lập phiếu trả và chờ kho duyệt |
| Không thấy nút tạo lịch hẹn | Phiếu công việc đã **Closed** | Bấm **Re-open** |
| Phiếu công việc không có lịch hẹn nào | Điều kiện 3 đang bật nên không hoàn thành được | Lập một lịch hẹn cho đúng thực tế đã làm |
| Hoàn thành lịch hẹn báo còn người *Pending* | Có kỹ thuật viên trong danh sách chưa check-out | Người đó check-out, hoặc điều phối gỡ khỏi lịch và chia lại tỉ lệ đóng góp |
| Mở lại lịch hẹn xong mất hết dữ liệu check-in | Mở lại từ *Canceled* hoặc *Cannot Complete* sẽ xoá dữ liệu thực tế | Lần sau tạo lịch hẹn mới thay vì mở lại |

---

## 8. Chặng tiếp theo

Kỹ thuật viên cần vật tư mới đi làm được. Đọc tiếp:
**[Chặng 4 — Vật tư của kỹ thuật viên](Quy-Trinh-04-Vat-Tu.html)**.
