---
title: 3 · Điều phối và hiện trường
layout: default
parent: Quy trình hợp nhất
nav_order: 4
---

# Chặng 3 — Điều phối và thực hiện tại hiện trường
{: .no_toc }

**Vai trò thực hiện:** Điều phối · Kỹ thuật viên · Quản lý dịch vụ
{: .fs-3 .text-grey-dk-000 }

> **Chặng này nằm ở đâu trong dây chuyền**
>
> **Nhận vào:** Đơn bán hàng đã xác nhận từ [Chặng 2](Quy-Trinh-02-Don-Hang.html), hoặc phiếu sự cố từ [Chặng 7](Quy-Trinh-07-Su-Co.html).
>
> **Bàn giao ra:** Phiếu công việc và lịch hẹn đã lên kế hoạch, bàn giao cho [Chặng 4 — Vật tư](Quy-Trinh-04-Vat-Tu.html) và [Chặng 5 — Giao hàng và thu tiền](Quy-Trinh-05-Giao-Hang-Thu-Tien.html).
>
> Toàn bộ mạch từ đầu đến cuối, theo một đơn hàng cụ thể: [Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html).

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

## 1. Ba chứng từ và vai trò của từng chứng từ

| Chứng từ | Tên trên hệ thống | Nội dung phản ánh |
|---|---|---|
| **Đơn bán hàng** | `Sales Order` | Hàng hoá, giá trị và người chịu trách nhiệm doanh thu |
| **Phiếu công việc** | `FS Work Order` | Nội dung vụ việc kỹ thuật, địa điểm và các đầu việc cần thực hiện |
| **Lịch hẹn dịch vụ** | `FS Service Appointment` | Một buổi làm việc cụ thể: nhân sự, thời gian và kết quả |

Quan hệ giữa ba chứng từ là **một–nhiều ở cả hai tầng**: một đơn hàng có thể phát sinh nhiều
phiếu công việc, một phiếu công việc có thể có nhiều lịch hẹn. Ví dụ phổ biến: khách hàng mua
thiết bị, lần thứ nhất xuống khảo sát mặt bằng, lần thứ hai xuống lắp đặt — một phiếu công
việc, hai lịch hẹn.

> ⚠️ **Nội dung cốt lõi cần ghi nhớ: trạng thái của ba chứng từ này độc lập với nhau.** Hoàn
> thành lịch hẹn không chuyển phiếu công việc sang hoàn thành. Đơn hàng hoàn tất không đóng
> phiếu công việc. Đây là thiết kế có chủ đích và giải thích gần như toàn bộ các trường hợp
> phiếu không tự chuyển trạng thái.

---

## 2. Lập phiếu công việc

Phiếu công việc **không tự phát sinh**. Luôn phải có người thực hiện thao tác lập, từ một trong
hai nguồn:

| Nguồn | Trình tự | Trường hợp áp dụng |
|---|---|---|
| **Đơn bán hàng** | Mở đơn đã xác nhận → **Create → FS Work Order** | Lắp đặt, bảo dưỡng, giao hàng kèm lắp đặt |
| **Phiếu sự cố** | Mở phiếu sự cố → **Create → FS Work Order** | Khách hàng báo hỏng, cần cử nhân sự kiểm tra |

Hệ thống tự điền công ty, khách hàng, địa chỉ, liên hệ và khoảng thời gian dự kiến. Phiếu mới
luôn ở trạng thái **New**.

### Xác định đúng loại việc

Ô **Loại việc** (`Work Type`) quyết định các nội dung hệ thống yêu cầu khi hoàn thành phiếu.

| Loại việc | Số phiếu | Yêu cầu đặc trưng |
|---|---|---|
| Bảo dưỡng | 9.599 | Thường kèm giao vật tư và thu tiền |
| Sự cố | 3.350 | Thường yêu cầu đính kèm ảnh hiện trường |
| Lắp đặt | 2.076 | Kèm giao hàng, nghiệm thu và thu tiền |
| Khảo sát | 912 | Không giao hàng, không thu tiền |

Chọn sai loại việc dẫn tới việc hệ thống yêu cầu nội dung không liên quan, hoặc bỏ qua nội
dung lẽ ra phải kiểm tra. **Hệ thống không cảnh báo khi loại việc được chọn sai.**

---

## 3. Lập lịch hẹn và gán kỹ thuật viên

Từ phiếu công việc chưa đóng, chọn **Create → Service Appointment**. Lịch hẹn tự gắn về phiếu
công việc cha.

Lịch hẹn **tự chuyển trạng thái** theo dữ liệu được khai, không cần thao tác đặt trạng thái:

| Trạng thái | Điều kiện chuyển |
|---|---|
| **None** | Chưa có lịch, chưa có nhân sự |
| **Scheduled** | Đã có khung giờ hẹn |
| **Dispatched** | Đã có khung giờ **và** đã gán kỹ thuật viên |
| **In Progress** | Kỹ thuật viên bắt đầu di chuyển hoặc đã check-in |
| **Completed** | Kết thúc buổi làm việc và đáp ứng đủ điều kiện |
| **Cannot Complete** | Không thực hiện được, có ghi nhận lý do |
| **Canceled** | Huỷ, **bắt buộc nhập lý do huỷ** |

Việc gán nhân sự và xếp lịch được thực hiện trên **màn hình điều phối** `/smart-scheduler`, cho
phép theo dõi lịch toàn đội theo dòng thời gian và điều chỉnh thời gian, nhân sự bằng thao tác
kéo thả.

> 🔒 **Khoá theo trạng thái:** lịch hẹn ở trạng thái *Completed*, *Cannot Complete* hoặc
> *Canceled* không cho phép thay đổi kỹ thuật viên; từ *In Progress* trở đi không cho phép
> thay đổi khung giờ.

### Trường hợp nhiều kỹ thuật viên trên một buổi

Một lịch hẹn có thể gán nhiều nhân sự, mỗi người một **tỉ lệ đóng góp**. Tổng các tỉ lệ phải
bằng **100%**; đây là căn cứ tính công ca. Khi loại một nhân sự khỏi lịch, hệ thống mở hộp
thoại yêu cầu phân bổ lại tỉ lệ cho những người còn lại.

---

## 4. Trình tự thao tác tại hiện trường

Toàn bộ thao tác được thực hiện trên **ứng dụng kỹ thuật viên** `/technician`, theo đúng thứ tự:

| Bước | Thao tác | Nội dung hệ thống ghi nhận |
|---|---|---|
| 1 | Tiếp nhận thông báo công việc | Thông báo đẩy về thiết bị di động |
| 2 | **Bắt đầu di chuyển** | Lịch hẹn chuyển *In Progress*, ghi thời điểm bắt đầu thực tế |
| 3 | **Check-in** tại địa điểm khách hàng | Ghi vị trí và thời điểm có mặt |
| 4 | Thực hiện các **bước công việc** | Đánh dấu từng đầu việc: hoàn thành, không hoàn thành, không áp dụng |
| 5 | **Đính kèm ảnh** nếu loại việc yêu cầu | Ảnh được lưu vào lịch hẹn |
| 6 | Giao hàng và thu tiền nếu có | Xem [Chặng 5](Quy-Trinh-05-Giao-Hang-Thu-Tien.html) |
| 7 | **Check-out** | Ghi thời điểm kết thúc |
| 8 | **Hoàn thành lịch hẹn** | Hệ thống kiểm tra bốn điều kiện dưới đây |

### Bốn điều kiện hoàn thành lịch hẹn

| Điều kiện | Thông báo khi chưa đáp ứng |
|---|---|
| Lịch hẹn đang ở trạng thái *In Progress* | *“must transition to In Progress before completing”* |
| Đã ghi nhận thời điểm bắt đầu thực tế | *“Cannot complete: no Actual Start”* |
| **Toàn bộ** kỹ thuật viên đã check-out hoặc đã được loại khỏi lịch | *“all resources must be Checked-out or Canceled. Pending: …”* |
| Đáp ứng yêu cầu theo loại việc, ví dụ đã đính kèm ảnh | *“no photo attached (Work Type requires Photo)”* |

> Thông báo hiển thị **nguyên văn như nhau** trên Desk và trên ứng dụng, giúp kỹ thuật viên
> xác định ngay nội dung còn thiếu mà không cần liên hệ điều phối.

---

## 5. Sáu điều kiện hoàn thành phiếu công việc

Đây là nội dung dễ hiểu nhầm nhất trong toàn hệ thống. Phiếu công việc chuyển sang **Completed**
theo **một trong hai đường**, và cả hai đều phải đáp ứng **cùng một bộ sáu điều kiện**:

- **Đường thủ công:** người dùng chuyển trạng thái phiếu trên Desk, hoặc kỹ thuật viên chọn
  chức năng *Hoàn thành* trên ứng dụng.
- **Đường tự động:** một **tác vụ tự động chạy ban đêm** rà soát các phiếu đang ở *New* hoặc
  *In Progress*; phiếu nào đáp ứng đủ điều kiện thì được hoàn thành, kết quả được ghi lại để
  tra cứu.

<a href="images/svg/quy-trinh/09-sau-dieu-kien-wo.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/09-sau-dieu-kien-wo.svg" alt="Sáu điều kiện xếp chồng: trạng thái cho phép, các bước công việc bắt buộc đã xong, mọi lịch hẹn đã kết thúc, tiền và vật tư đã được thanh toán và hoàn trả đầy đủ, đơn bán hàng liên kết đã xong, và yêu cầu riêng theo loại việc. Đáp ứng đủ sáu điều kiện thì phiếu chuyển sang hoàn thành; thiếu bất kỳ điều kiện nào thì hệ thống từ chối và nêu rõ lý do" style="width:100%;height:auto">
</a>

| # | Điều kiện | Trạng thái tham số |
|---|---|---|
| 1 | Trạng thái hiện tại cho phép chuyển sang *Completed* | Luôn kiểm tra |
| 2 | Mọi **bước công việc bắt buộc** đã hoàn thành hoặc đã đánh dấu không áp dụng | Luôn kiểm tra, nếu phiếu có bước công việc |
| 3 | Mọi **lịch hẹn** đã kết thúc, và phiếu phải có **tối thiểu một** lịch hẹn | **Đang bật** |
| 4 | Tiền mặt đã nộp, vật tư đã trả, đơn hàng đã thu đủ | Ba tham số riêng — xem bảng dưới |
| 5 | **Đơn bán hàng** liên kết đã ở *Completed* hoặc *Closed* | **Đang bật** |
| 6 | Yêu cầu riêng theo **loại việc** | Theo cấu hình từng loại việc |

Ba tham số thuộc điều kiện 4:

| Tham số | Trạng thái trên hệ thống | Tác dụng khi bật |
|---|---|---|
| Kiểm tra **đơn hàng đã thu đủ tiền** | **Đang bật** | Đơn còn công nợ thì không cho hoàn thành phiếu |
| Kiểm tra **tiền mặt đã nộp về công ty** | **Đang bật** | Kỹ thuật viên còn giữ tiền thì không cho hoàn thành |
| Kiểm tra **vật tư đã trả về kho** | Đang tắt | Còn nghĩa vụ trả hàng thì không cho hoàn thành |

> ⛔ **Hai điều kiện 4 và 5 cộng lại tạo thành một trình tự bắt buộc.** Phiếu công việc chỉ hoàn
> thành được sau khi đơn bán hàng đã *Hoàn tất*, mà đơn chỉ hoàn tất sau khi đã giao đủ hàng,
> thu đủ tiền và xuất hoá đơn. Do đó phần lớn trường hợp phiếu công việc không hoàn thành được đều có nguyên
> nhân nằm ở chứng từ thanh toán chứ không nằm ở phần việc hiện trường. Cách đọc nguyên nhân
> theo thông báo lỗi được trình bày tại
> [Chặng 5 — mục 6](Quy-Trinh-05-Giao-Hang-Thu-Tien.html#6-phiếu-công-việc-bị-chặn-vì-lý-do-thanh-toán).

### Điều kiện bổ sung của tác vụ tự động: thời gian ân hạn

Ngay cả khi đáp ứng đủ sáu điều kiện, tác vụ tự động vẫn **chờ thêm một số ngày tính từ lịch
hẹn cuối cùng** rồi mới xử lý phiếu. Mục đích là dành thời gian cho kỹ thuật viên bổ sung
chứng từ và cho khách hàng phản hồi. Phiếu chưa đủ số ngày này được bỏ qua, có ghi rõ lý do
trong nhật ký.

> ⚠️ **Phiếu ở trạng thái *On Hold* được tác vụ tự động bỏ qua hoàn toàn.** Muốn phiếu được xử
> lý, cần chuyển phiếu về *In Progress* trước.

---

## 6. Đóng, mở lại và huỷ phiếu

### Đóng và mở lại

| Nội dung | Thao tác | Lưu ý |
|---|---|---|
| Đóng phiếu công việc | Chức năng **Close** | Trạng thái cuối; chức năng tạo lịch hẹn bị ẩn |
| Mở lại phiếu đã đóng | Chức năng **Re-open** | Khôi phục đúng trạng thái trước khi đóng |
| Điều chỉnh lịch hẹn đã hoàn tất | Chuyển trạng thái *Completed → In Progress* | Dữ liệu thực tế được **giữ nguyên** |
| Thực hiện lại lịch hẹn đã huỷ | Chuyển trạng thái về *Scheduled* | ⚠️ **Xoá toàn bộ** dữ liệu check-in, check-out và thời gian |
| Cần một buổi làm việc mới cho cùng vụ việc | Lập lịch hẹn mới từ phiếu công việc | Phương án an toàn hơn so với mở lại lịch cũ |

### Trình tự huỷ

```
1. Huỷ lịch hẹn   (bắt buộc nhập lý do huỷ)
2. Huỷ phiếu công việc
3. Huỷ đơn bán hàng
```

Các chứng từ khoá lẫn nhau để tránh huỷ nhầm gây sai lệch dữ liệu:

| Chứng từ huỷ | Điều kiện bị từ chối | Thông báo |
|---|---|---|
| Đơn bán hàng | Còn phiếu công việc liên kết chưa huỷ | *“Cannot cancel this Sales Order because it is linked to FS Work Order …”* |
| Phiếu công việc | Còn lịch hẹn liên kết chưa huỷ | *“Cannot cancel this Work Order because it is linked to Service Appointment …”* |
| Lịch hẹn | Đang ở *Completed*, *Cannot Complete* hoặc *Canceled* | *“Cannot hủy Service Appointment when in status … Change status first.”* |

> ⚠️ **Huỷ phiếu công việc không tự động trả hàng về kho.** Vật tư kỹ thuật viên đã tiếp nhận
> vẫn phải hoàn trả bằng phiếu trả — xem [Chặng 4](Quy-Trinh-04-Vat-Tu.html).

---

## 7. Ngoại lệ thường gặp

| Hiện tượng | Nguyên nhân phổ biến | Hướng xử lý |
|---|---|---|
| Lịch hẹn và đơn hàng đã hoàn tất nhưng **phiếu công việc vẫn ở New** | Chưa đáp ứng một trong sáu điều kiện, hoặc chưa hết thời gian ân hạn | Thực hiện hoàn thành thủ công để hệ thống nêu đúng nguyên nhân; xem [Tự xử lý sự cố dịch vụ](FSMNext-Xu-Ly-Su-Co.html) |
| Phiếu đủ điều kiện nhưng tác vụ tự động vẫn bỏ qua | Phiếu đang ở *On Hold*, hoặc chưa hết ân hạn | Chuyển về *In Progress*, hoặc chờ đủ số ngày |
| Không hoàn thành được, báo *“SO chưa thanh toán đủ”* | Tham số kiểm tra công nợ đang bật và đơn còn nợ | Thu nốt tiền, hoặc đề nghị quản trị viên rà soát đơn |
| Không hoàn thành được, báo *“Chưa trả kho đủ”* | Tham số kiểm tra vật tư đang bật | Lập phiếu trả và chờ kho duyệt |
| Không hiển thị chức năng tạo lịch hẹn | Phiếu công việc đã ở trạng thái **Closed** | Sử dụng chức năng **Re-open** |
| Phiếu công việc không có lịch hẹn nào | Điều kiện số 3 đang bật | Lập một lịch hẹn phản ánh đúng công việc đã thực hiện |
| Hoàn thành lịch hẹn báo còn nhân sự ở trạng thái *Pending* | Còn kỹ thuật viên chưa check-out | Nhân sự đó check-out, hoặc điều phối loại khỏi lịch và phân bổ lại tỉ lệ đóng góp |
| Mở lại lịch hẹn làm mất dữ liệu check-in | Mở lại từ *Canceled* hoặc *Cannot Complete* sẽ xoá dữ liệu thực tế | Nên lập lịch hẹn mới thay vì mở lại |

---

## 8. Chặng tiếp theo

Kỹ thuật viên cần có vật tư để thực hiện công việc. Đọc tiếp:
**[Chặng 4 — Vật tư của kỹ thuật viên](Quy-Trinh-04-Vat-Tu.html)**.
