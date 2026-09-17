---
title: 7 · Sự cố
layout: default
parent: Các chặng — bản cũ
grand_parent: Quy trình hợp nhất
nav_order: 7
---

# Chặng 7 — Sự cố
{: .no_toc }

**Ai làm:** Chăm sóc khách hàng · Nhân viên sự cố · Kỹ thuật viên
{: .fs-3 .text-grey-dk-000 }

| Nhận vào | Bàn giao ra |
|---|---|
| Khách hàng báo hỏng qua tổng đài, Zalo hoặc kỹ thuật viên | Phiếu công việc → [Chặng 3](Quy-Trinh-03-Hien-Truong.html), hoặc đơn bán hàng mới → [Chặng 2](Quy-Trinh-02-Don-Hang.html) |

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ chặng

<div style="position:relative;width:100%;padding-bottom:53.47%">
  <object type="image/svg+xml" data="images/svg/quy-trinh/08-su-co.svg" style="position:absolute;inset:0;width:100%;height:100%;border:0">
    <img src="images/svg/quy-trinh/08-su-co.svg" alt="Khách hàng báo hỏng, lập phiếu sự cố gắn về đơn hàng gốc, phân loại theo nhóm và loại, gán người xử lý. Từ đó có hai đường: xử lý dứt điểm qua điện thoại rồi đóng phiếu, hoặc lập phiếu công việc và lịch hẹn cho kỹ thuật viên; nếu tại hiện trường phát sinh vật tư tính phí thì lập đơn bán hàng mới" style="width:100%;height:auto">
  </object>
</div>

👆 **Bấm vào từng ô** để mở phần giải thích.
{: .fs-3 }

---

## 1. Tiếp nhận và lập phiếu sự cố
{: #tiep-nhan }

Mỗi lượt khách hàng báo hỏng thành một **phiếu sự cố** (`Issue`).

✅ **Việc quan trọng nhất khi lập phiếu là gắn phiếu về đơn hàng gốc** — đơn khách hàng đã mua
thiết bị. Nhờ đó người xử lý mở phiếu là thấy ngay:

- Khách hàng đã mua thiết bị nào, lắp đặt ngày nào.
- Tình trạng bảo dưỡng và lần thay lõi gần nhất.
- Lịch sử các lần báo hỏng trước đó.

Phiếu cũng ghi sẵn tên và số điện thoại khách hàng, liên kết được với nhật ký cuộc gọi tổng đài.

---

## 2. Phân loại hai tầng
{: #phan-loai }

Mỗi phiếu phân loại bằng **hai ô, cả hai bắt buộc**:

| Ô | Nói về | Khai lúc nào |
|---|---|---|
| **Nhóm sự cố** (`Issue Group`) | Khách hàng phản ánh chuyện gì | Ngay khi tiếp nhận |
| **Loại sự cố** (`Issue Type`) | Hỏng ở bộ phận nào | Sau khi trao đổi thêm để xác định |

Khai được theo cả hai chiều:

- **Chọn nhóm trước:** ô loại chỉ hiện các loại thuộc nhóm đó — khoảng bảy dòng thay vì cả danh
  mục.
- **Chọn loại trước:** hệ thống **tự điền nhóm**. Loại thuộc nhiều nhóm thì hệ thống hỏi lại
  thay vì tự chọn.

Mỗi loại có phần mô tả liệt kê nguyên nhân thường gặp, trích từ sơ đồ xử lý của bộ phận kỹ
thuật — để tham khảo, không bắt buộc điền.

📚 Quản trị danh mục: [Phân loại sự cố (Nhóm · Loại)](Phan-Loai-Su-Co.html).

---

## 3. Hai hướng xử lý
{: #hai-duong }

Sau khi gán **người xử lý** (`Handling Person`), phiếu đi một trong hai hướng.

### Hướng 1 — Xử lý dứt điểm qua điện thoại

Rất nhiều trường hợp chỉ là khách hàng chưa quen dùng máy hoặc thao tác chưa đúng. Hướng dẫn
qua điện thoại là xong: ghi kết quả vào ô **Resolution Details** rồi đóng phiếu. Đây **không
phải** hướng ngoại lệ mà là hướng rất thường gặp.

### Hướng 2 — Cử kỹ thuật viên xuống hiện trường

Chọn **Create → FS Work Order** ngay trên phiếu sự cố. Hệ thống điền sẵn khách hàng, mô tả sự
cố, ghi liên kết ngược, và đặt loại việc là ***Sự cố***.

Từ đây phiếu công việc chạy theo đúng [Chặng 3](Quy-Trinh-03-Hien-Truong.html): lập lịch hẹn,
gán kỹ thuật viên, làm việc tại hiện trường, hoàn thành.

Có hai kiểu phiếu công việc loại *Sự cố*:

| Kiểu | Nghĩa |
|---|---|
| Chỉ gắn phiếu sự cố | Sửa chữa không phát sinh chi phí, hoặc còn trong thời hạn bảo hành |
| Gắn **cả** phiếu sự cố và đơn hàng | Có thay vật tư tính phí |

---

## 4. Khi sự cố phát sinh đơn hàng mới
{: #don-moi }

Đến hiện trường mới biết phải thay linh kiện có tính phí thì lập **đơn bán hàng mới** ngay từ
phiếu sự cố bằng **Create → Sales Order**.

Đơn mới chạy đủ các chặng như mọi đơn khác: giao hàng, xuất hoá đơn, thu tiền. Và vì đơn cũng
sẽ sang **Hoàn tất**, nó **sinh luôn lịch bảo dưỡng cho kỳ sau** — một trường hợp sự cố có thể
đưa khách hàng quay lại vòng chăm sóc định kỳ.

> 💡 Đây là lý do phải lập đơn **từ chức năng trên phiếu sự cố** thay vì tạo mới trên Desk: giữ
> được liên kết thì mới biết doanh thu này đến từ trường hợp sự cố nào.

---

## 5. Trạng thái phiếu sự cố
{: #trang-thai }

| Trạng thái | Nghĩa |
|---|---|
| **Open** | Đang mở |
| **Replied** | Đã phản hồi khách hàng |
| **On Hold** | Tạm dừng, chờ khách hàng hoặc chờ linh kiện |
| **Resolved** | Đã xử lý, chờ xác nhận |
| **Closed** | Đã đóng |

⚠️ **On Hold là phần tồn đọng thật**, không phải phiếu đang được xử lý. Quản lý nên rà soát danh
sách này định kỳ.

> ⚠️ **Phiếu sự cố và phiếu công việc có trạng thái độc lập.** Đóng phiếu sự cố không đóng phiếu
> công việc và ngược lại.

---

## 6. Cách hệ thống đo hiệu suất
{: #hieu-suat }

Hai nhóm nhân sự được đo theo hai mốc khác nhau, **không cộng chung được**:

| | Nhân viên sự cố | Kỹ thuật viên |
|---|---|---|
| **Đo ai** | Người ở ô *Handling Person* trên phiếu sự cố | Người được gán vào lịch hẹn của phiếu công việc |
| **Bắt đầu tính hạn từ** | Lúc mở phiếu sự cố | Lúc **phiếu công việc được lập** |
| **Coi là xong khi** | Phiếu được đóng, **hoặc** có phiếu công việc đầu tiên | Phiếu công việc sang *Completed* hoặc *Closed* |

Kỹ thuật viên tính từ lúc phiếu công việc phát sinh, không tính từ lúc khách hàng báo hỏng, để
phần chậm ở khâu tiếp nhận không bị tính vào kết quả của họ.

📚 Chi tiết: [Hiệu suất xử lý sự cố](Hieu-Suat-Xu-Ly-Su-Co.html).

---

## 7. Khi gặp trục trặc
{: #truc-trac }

| Hiện tượng | Nguyên nhân | Cách gỡ |
|---|---|---|
| Không biết khách đã mua thiết bị nào | Phiếu chưa gắn về đơn hàng gốc | Tra đơn của khách và gắn vào ô chứng từ tham chiếu |
| Ô **Loại sự cố** trống trơn sau khi chọn nhóm | Nhóm đó chưa khai loại nào | Chọn nhóm khác, hoặc đề nghị quản trị viên khai loại |
| Đổi nhóm làm mất loại đang chọn | Loại cũ không thuộc nhóm mới | Chọn lại loại. Trên phiếu **đã lưu**, hệ thống chỉ cảnh báo chứ không tự xoá |
| Phiếu công việc đã xong nhưng **phiếu sự cố vẫn mở** | Hai chứng từ độc lập | Đóng phiếu sự cố riêng, kèm ghi nhận kết quả |
| Phiếu sự cố đã đóng nhưng **phiếu công việc vẫn New** | Cùng nguyên nhân trên | Xem [sáu điều kiện hoàn thành](Quy-Trinh-03-Hien-Truong.html#dieu-kien) |
| Đơn sửa chữa không truy được về sự cố | Đơn lập thủ công trên Desk | Nhờ quản trị viên gắn lại liên kết |
| Phiếu nằm **On Hold** rất lâu | Chờ linh kiện, chờ khách sắp xếp, hoặc bị quên | Rà soát định kỳ; đóng các phiếu đã xử lý xong mà chưa cập nhật |
| Tỉ lệ đạt của một người giảm bất thường | Có trường hợp quá hạn chưa xong nằm trong mẫu số | Bấm vào con số trên báo cáo để xem từng trường hợp |

---

## 8. Câu hỏi thường gặp
{: #hoi-dap }

**Khách gọi báo hỏng nhưng máy còn bảo hành, có lập phiếu sự cố không?**

Có. Mọi lượt báo hỏng đều lập phiếu. Bảo hành hay không chỉ quyết định có lập đơn bán hàng hay
không.

**Hướng dẫn qua điện thoại là xong, có cần lập phiếu công việc không?**

Không. Ghi kết quả vào **Resolution Details** rồi đóng phiếu.

**Xuống hiện trường mới biết phải thay lõi tính phí, làm sao?**

Lập đơn bán hàng mới **ngay từ phiếu sự cố**, xem [mục 4](#don-moi).

**Phiếu sự cố đóng rồi, khách gọi lại cùng lỗi đó?**

Lập phiếu mới và gắn về cùng đơn hàng gốc. Lịch sử các lần báo hỏng nằm ở đó.

**Không biết chọn nhóm nào cho đúng?**

Chọn **loại** trước theo bộ phận hỏng, hệ thống tự điền nhóm.

**Chờ linh kiện thì để phiếu ở trạng thái gì?**

**On Hold**. Nhưng phải rà lại định kỳ, vì On Hold là phần tồn đọng chứ không phải đang xử lý.

---

## Trang còn lại

Toàn bộ tình huống bất thường của cả tám chặng gom vào một bảng tra cứu:
**[Khi gặp trục trặc](Quy-Trinh-08-Ngoai-Le.html)**.
