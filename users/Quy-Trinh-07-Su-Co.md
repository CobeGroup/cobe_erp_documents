---
title: 7 · Sự cố
layout: default
parent: Quy trình hợp nhất
nav_order: 8
---

# Chặng 7 — Sự cố
{: .no_toc }

**Ai làm:** Chăm sóc khách hàng · Điều phối · Kỹ thuật viên · Quản lý dịch vụ
{: .fs-3 .text-grey-dk-000 }

Sự cố là **cửa vào thứ hai** của hệ thống. Khách đã mua máy, máy có vấn đề, khách gọi về. Từ
đó có thể phát sinh một chuyến đi, và đôi khi phát sinh cả một đơn hàng mới.

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ chặng

<a href="images/svg/quy-trinh/08-su-co.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/08-su-co.svg" alt="Khách báo hỏng, nhân viên lập phiếu sự cố gắn về đơn hàng gốc, phân loại theo nhóm và loại rồi gán người xử lý. Từ đó có hai đường: xử lý dứt điểm qua điện thoại rồi đóng phiếu, hoặc lập phiếu công việc loại Sự cố để cử kỹ thuật viên xuống hiện trường; nếu phải thay vật tư có tính tiền thì lập đơn bán hàng mới từ chính phiếu sự cố" style="width:100%;height:auto">
</a>

---

## 1. Tiếp nhận — lập phiếu sự cố

Mỗi lần khách báo hỏng được ghi thành một **phiếu sự cố** (`Issue`). Hệ thống hiện có **25.944
phiếu**.

Việc quan trọng nhất lúc lập phiếu là **gắn phiếu về đơn hàng gốc** — đơn khách đã mua máy.
Thực tế **25.940 trên 25.944 phiếu** đều có đường dẫn này, tức gần như tuyệt đối.

Nhờ đường dẫn đó, người xử lý mở phiếu ra là thấy ngay:

- Khách đã mua máy gì, lắp ngày nào.
- Đã bảo dưỡng tới đâu, thay lõi lần gần nhất khi nào.
- Lịch sử các lần báo hỏng trước của chính khách này.

Phiếu còn ghi sẵn số điện thoại và tên khách, và nối được với nhật ký cuộc gọi của tổng đài.

---

## 2. Phân loại hai tầng

Mỗi phiếu được phân loại bằng **hai ô, cả hai đều bắt buộc**, điền ngay lúc tiếp nhận:

| Ô | Trả lời câu hỏi | Điền khi nào |
|---|---|---|
| **Nhóm sự cố** (`Issue Group`) | Khách phàn nàn chuyện gì | Vừa nghe khách kể là biết |
| **Loại sự cố** (`Issue Type`) | Cụ thể hỏng ở đâu | Hỏi thêm vài câu là chốt được |

Danh mục hiện có **12 nhóm và 75 loại**. Cách điền linh hoạt theo cả hai chiều:

- **Chọn nhóm trước**, ô loại chỉ còn hiện những loại thuộc nhóm đó — khoảng bảy dòng thay vì
  bảy mươi lăm.
- **Chọn loại trước**, hệ thống **tự điền nhóm**. Loại nào thuộc nhiều nhóm thì hệ thống hỏi
  chứ không tự đoán.

Mỗi loại có phần mô tả ghi sẵn các nguyên nhân thường gặp, lấy từ sơ đồ xử lý của bộ phận kỹ
thuật — đây là gợi ý tra cứu, không phải ô phải điền.

📚 Chi tiết cách quản trị danh mục: [Phân loại sự cố (Nhóm · Loại)](Phan-Loai-Su-Co.html).

---

## 3. Hai đường xử lý

Sau khi gán **người xử lý** (`Handling Person`), phiếu đi một trong hai đường.

### Đường 1 — Xử lý dứt điểm qua điện thoại

Nhiều ca chỉ là khách chưa quen dùng máy, hoặc thao tác sai. Nhân viên hướng dẫn qua điện
thoại là xong, ghi kết quả vào ô **Resolution Details** rồi đóng phiếu.

Nhóm *Khách chưa quen dùng máy* hiện có **2.296 ca** — đủ lớn để thấy đường này không phải
ngoại lệ.

### Đường 2 — Cử kỹ thuật viên xuống hiện trường

Bấm **Create → FS Work Order** ngay trên phiếu sự cố. Hệ thống mang sẵn khách hàng, mô tả sự
cố, và ghi đường dẫn ngược về phiếu. Chọn **loại việc là *Sự cố***.

Từ đây, phiếu công việc chạy đúng như [Chặng 3](Quy-Trinh-03-Hien-Truong.html): lập lịch hẹn,
gán kỹ thuật viên, xuống hiện trường, hoàn thành.

Hệ thống hiện có **3.350 phiếu công việc loại *Sự cố***, trong đó:

| Kiểu | Số phiếu | Nghĩa |
|---|---|---|
| Gắn phiếu sự cố, **không** gắn đơn hàng | 1.444 | Sửa chữa không phát sinh chi phí, hoặc còn bảo hành |
| Gắn **cả** phiếu sự cố **và** đơn hàng | 1.943 | Có thay vật tư tính tiền |

---

## 4. Khi sự cố phát sinh đơn hàng mới

Xuống tới nơi mới biết phải thay linh kiện có tính tiền. Lúc đó lập **đơn bán hàng mới** ngay
từ phiếu sự cố: **Create → Sales Order**. Hệ thống hiện có **3.321 đơn** sinh theo đường này.

Đơn mới chạy đủ chặng như mọi đơn khác: giao hàng, hoá đơn, thu tiền. Và vì nó cũng sẽ **Hoàn
tất**, nó cũng **sinh lịch bảo dưỡng cho kỳ sau** — một ca sự cố có thể kéo khách quay lại vòng
chăm sóc định kỳ.

> 💡 Đây là lý do nên lập đơn **từ nút trên phiếu sự cố** thay vì tạo mới trên Desk: giữ được
> đường dẫn để biết doanh thu này đến từ ca sự cố nào.

---

## 5. Trạng thái phiếu sự cố

| Trạng thái | Nghĩa | Số phiếu |
|---|---|---|
| **Closed** | Đã đóng | 19.864 |
| **On Hold** | Đang treo, chờ khách hoặc chờ linh kiện | 5.738 |
| **Resolved** | Đã xử lý, chờ xác nhận | 232 |
| **Replied** | Đã phản hồi khách | 109 |
| **Open** | Đang mở | 1 |

Khối **On Hold** 5.738 phiếu là điểm cần quản lý chú ý: đây là tồn đọng thật, không phải phiếu
đang chạy.

> ⚠️ **Phiếu sự cố và phiếu công việc có trạng thái độc lập.** Đóng phiếu sự cố không đóng phiếu
> công việc, và ngược lại. Hai phiếu phải được kết thúc riêng.

---

## 6. Đo hiệu suất — hai mốc thời gian khác nhau

Hệ thống đo hai nhóm người theo hai cách khác nhau, và **không cộng chung được**:

| | Nhân viên sự cố | Kỹ thuật viên |
|---|---|---|
| **Là ai** | Người ghi ở ô *Handling Person* trên phiếu sự cố | Người được gán vào lịch hẹn của phiếu công việc |
| **Bắt đầu đếm hạn từ** | Lúc mở phiếu sự cố | Lúc **phiếu công việc được lập** |
| **Coi là xong khi** | Phiếu được đóng, **hoặc** có phiếu công việc đầu tiên | Phiếu công việc chuyển *Completed* hoặc *Closed* |

Kỹ thuật viên được tính từ lúc phiếu công việc sinh ra chứ không phải từ lúc khách báo hỏng —
để phần chậm ở khâu tiếp nhận không tính vào điểm của họ.

Công thức: `Tỉ lệ đạt = Đúng hạn ÷ (Đúng hạn + Trễ hạn + Quá hạn chưa xong)`. Các ca **đang còn
trong hạn** bị loại khỏi mẫu số có chủ đích, để những ca vừa mở hôm qua không kéo tụt tỉ lệ
của cả tháng.

📚 Chi tiết: [Hiệu suất xử lý sự cố](Hieu-Suat-Xu-Ly-Su-Co.html).

---

## 7. Ngoại lệ thường gặp ở chặng này

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Không biết khách đã mua máy gì | Phiếu chưa gắn về đơn hàng gốc | Tìm đơn của khách rồi gắn vào ô chứng từ tham chiếu |
| Ô **Loại sự cố** rỗng trơn sau khi chọn nhóm | Nhóm đó chưa có loại nào | Chọn nhóm khác, hoặc báo quản trị khai loại cho nhóm đó |
| Đổi nhóm làm mất loại đang chọn | Loại cũ không thuộc nhóm mới | Chọn lại loại. Trên phiếu **đã lưu** thì hệ thống chỉ nhắc chứ không tự xoá |
| Phiếu công việc đã xong mà **phiếu sự cố vẫn mở** | Hai phiếu độc lập trạng thái | Đóng phiếu sự cố riêng, kèm ghi nhận kết quả |
| Phiếu sự cố đã đóng mà **phiếu công việc vẫn New** | Cùng lý do trên | Xem [Chặng 3, mục 5](Quy-Trinh-03-Hien-Truong.html#5-hoàn-thành-phiếu-công-việc--sáu-điều-kiện) |
| Đơn hàng sửa chữa không truy được về ca sự cố | Đơn lập tay trên Desk thay vì lập từ nút trên phiếu | Nhờ quản trị gắn lại đường dẫn |
| Phiếu treo **On Hold** rất lâu | Chờ linh kiện, chờ khách sắp xếp, hoặc bị bỏ quên | Rà định kỳ danh sách *On Hold*; đóng những ca đã xử lý xong nhưng quên cập nhật |
| Tỉ lệ đạt của một người tụt bất thường | Có ca quá hạn chưa xong nằm trong mẫu số | Bấm vào con số trên báo cáo để xem từng ca cụ thể |

---

## 8. Trang còn lại

Toàn bộ các tình huống bất thường của cả tám chặng được gom vào một bảng tra nhanh:
**[Ngoại lệ, lỗi và bất thường](Quy-Trinh-08-Ngoai-Le.html)**.
