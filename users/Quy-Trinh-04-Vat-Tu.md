---
title: 4 · Vật tư của kỹ thuật viên
layout: default
parent: Quy trình hợp nhất
nav_order: 5
---

# Chặng 4 — Vật tư của kỹ thuật viên
{: .no_toc }

**Ai làm:** Kỹ thuật viên · Nhân viên kho · Điều phối
{: .fs-3 .text-grey-dk-000 }

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ chặng

<a href="images/svg/quy-trinh/05-vat-tu.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/05-vat-tu.svg" alt="Ba tầng đọc theo chiều dọc: ai làm, chứng từ nào sinh ra, và hàng đang nằm ở kho nào. Kỹ thuật viên yêu cầu hàng, kho xuất sang kho kỹ thuật viên, kỹ thuật viên giao cho khách, phần không giao sinh nghĩa vụ trả, kỹ thuật viên lập phiếu trả ở trạng thái nháp và chỉ khi kho duyệt thì hàng mới về kho công ty và nợ mới được xoá" style="width:100%;height:auto">
</a>

---

## 1. Mỗi kỹ thuật viên có một kho riêng

Hàng kỹ thuật viên mang theo **không phải hàng vô chủ**. Mỗi người được cấp một **kho riêng**
(`Warehouse`) cho từng công ty. Hàng chuyển sang kho đó thì vẫn là tài sản công ty, nhưng
đứng tên người giữ.

| Quy tắc | Nội dung |
|---|---|
| Một kỹ thuật viên, một công ty | Chỉ **một** kho |
| Một kỹ thuật viên, nhiều công ty | Nhiều kho, mỗi công ty một kho |
| Kho trả mặc định | Khai riêng, **không được trùng** kho của chính kỹ thuật viên |
| Chưa khai kho cho công ty nào | Mọi thao tác vật tư ở công ty đó đều báo lỗi |

Nhờ mô hình này, lúc nào cũng trả lời được câu hỏi *“món hàng này đang ở đâu”*: kho công ty,
kho một kỹ thuật viên cụ thể, hay đã sang tay khách.

---

## 2. Bốn luồng vật tư

| # | Luồng | Chứng từ | Ai xác nhận | Trạng thái lúc lập |
|---|---|---|---|---|
| ① | **Yêu cầu hàng** | Yêu cầu vật tư (`Material Request`) rồi phiếu xuất kho (`Stock Entry`) | Kỹ thuật viên gửi yêu cầu, **kho xuất hàng** | Yêu cầu tự xác nhận, phiếu xuất do kho xác nhận |
| ② | **Dùng hẳn tại hiện trường** | Phiếu xuất vật tư (`Stock Entry` · *Material Issue*) | Kỹ thuật viên | Tự xác nhận ngay |
| ③ | **Chuyển kho giữa hai công ty** | Cặp phiếu xuất và phiếu nhập | Kỹ thuật viên | Tự xác nhận ngay, theo cặp |
| ④ | **Trả vật tư về kho** | Phiếu trả (`Stock Entry` · *Material Transfer*) | **Kho duyệt** | **Nháp** — chờ kho kiểm |

Điểm khác biệt quan trọng nhất nằm ở cột cuối: **chỉ luồng ④ để phiếu ở trạng thái nháp**.
Hàng ra khỏi kho công ty thì cần kho xác nhận; hàng quay về kho công ty cũng cần kho đếm lại.

---

## 3. Luồng ① — Yêu cầu hàng

### 3.1. Yêu cầu theo một lịch hẹn

Kỹ thuật viên mở màn hình kho trên ứng dụng → **Yêu cầu hàng** → chọn lịch hẹn sắp đi. Hệ
thống **gộp sẵn danh sách vật tư** từ ba nguồn:

| Nguồn | Nội dung lấy về |
|---|---|
| Vật tư khai trên **phiếu công việc** | Từng món kèm số lượng cần |
| Vật tư khai trên **từng dòng việc** của phiếu | Bỏ qua món đã có ở nguồn trên |
| Hàng trên **đơn bán hàng** liên kết | Số còn phải giao = số đặt − số đã giao |

Danh sách còn xử lý thêm hai việc:

- **Nở bộ sản phẩm.** Món là bộ thì dòng cha chỉ để xem, các món thành phần hiện bên dưới với
  số lượng đã nhân theo bộ.
- **Trừ phần đã xin trước đó.** Số được phép xin = số cần − số đã có trong các yêu cầu trước.
  Món đã xin đủ vẫn hiện nhưng không chọn được, kèm mã yêu cầu cũ để tra.

> Tồn kho hiện có của kỹ thuật viên **chỉ hiện để tham khảo**, không dùng để tính số được xin.

### 3.2. Yêu cầu không gắn lịch hẹn

Dùng cho vật tư tiêu hao hoặc hàng dự phòng mang theo xe. Kỹ thuật viên tìm món theo tên, nhập
số lượng, chọn kho đích nếu có nhiều kho, rồi gửi. Yêu cầu loại này **không gắn về phiếu công
việc hay đơn hàng nào**.

### 3.3. Kho xử lý yêu cầu

Nhân viên kho thấy yêu cầu trên **màn kho** `/master-stock` hoặc trên Desk, rồi lập phiếu xuất
kho chuyển hàng từ kho công ty sang kho kỹ thuật viên.

| Việc kho làm được | Nội dung |
|---|---|
| Xuất từ **nhiều kho khác nhau** | Món A từ kho này, món B từ kho khác |
| Xuất **nhiều lần** cho một yêu cầu | Hệ thống theo dõi: chưa xuất → xuất một phần → xuất đủ |
| Từ chối hoặc điều chỉnh | Trao đổi lại với kỹ thuật viên trước khi xuất |

Kỹ thuật viên theo dõi tiến độ ngay trên ứng dụng.

---

## 4. Luồng ④ — Trả vật tư về kho

Đây là luồng dễ sai nhất, và cũng là luồng có nhiều chốt chặn nhất.

### 4.1. Nghĩa vụ trả sinh ra lúc nào

**Không phải lúc trả hàng, mà lúc lập phiếu giao hàng.** Với mỗi dòng của đơn bán hàng:

> **Số cần trả = số kỹ thuật viên mang đi − số thực giao cho khách**

Phần chênh là hàng đã rời kho công ty nhưng khách không nhận. Mỗi phần chênh được cấp một
**mã nghĩa vụ** riêng, ghi vào đơn bán hàng kèm: số cần trả, thời điểm, người khai, kho của
người đó lúc ấy, và phiếu giao hàng nào sinh ra nghĩa vụ này.

### 4.2. Kỹ thuật viên thấy gì trên ứng dụng

Màn *Trả vật tư* dựng từ hai danh sách. Danh sách nghĩa vụ có **ba con số** cho mỗi dòng:

| Con số | Nghĩa |
|---|---|
| **Cần trả** | Phần còn nợ sau khi trừ các phiếu **đã duyệt** |
| **Đang chờ kho** | Phần đang nằm trong phiếu **nháp**, kho chưa duyệt |
| **Còn chọn được** | Cần trả − Đang chờ kho |

Danh sách thứ hai là **hàng lẻ còn trong kho**, tức tồn kho thực tế trừ đi phần đã giữ chỗ cho
các nghĩa vụ và phần đang nằm trong phiếu nháp. Hai danh sách trừ chéo nhau để cùng một món
không bị đếm hai lần.

### 4.3. Bốn chốt chặn khi lập phiếu trả

| # | Chốt | Kiểm gì | Khi không đạt |
|---|---|---|---|
| 0 | **Phạm vi** | Kho nguồn là kho của chính mình; kho đích cùng công ty; có ít nhất một dòng số lượng lớn hơn 0 | **Chặn** |
| 1 | **Đã trả xong** | Nghĩa vụ đã có phiếu duyệt phủ đủ | **Chặn** — *“đã được trả về kho rồi”* |
| 2 | **Vượt phần còn lại** | Không vượt quá *nợ − đã duyệt − đang chờ kho* | **Chặn**, nêu rõ con số và mã phiếu đang giữ chỗ |
| 3 | **Tự gắn mã nghĩa vụ** | Hàng lẻ có khớp nghĩa vụ đang nợ tại kho này không | **Không chặn** — gắn được bao nhiêu thì gắn, ưu tiên nghĩa vụ khai sớm nhất |
| 4 | **Đủ tồn khả dụng** | Tồn kho trừ phần đã cam kết ở các phiếu nháp khác | **Cảnh báo**, hoặc chặn nếu công tắc chặn cứng đang bật |

### 4.4. Kho duyệt phiếu

Phiếu trả ở trạng thái **nháp không làm thay đổi sổ kho**. Hàng vẫn đứng tên kho kỹ thuật viên
cho tới khi kho bấm duyệt. Lúc duyệt, hệ thống kiểm lại tồn kho một lần nữa và chặn nếu thiếu.

> 📌 Chốt tồn kho **lúc lập phiếu chặt hơn** lúc duyệt, vì nó còn trừ thêm phần đã cam kết ở các
> phiếu nháp khác. Nhờ vậy kỹ thuật viên được nhắc từ sớm thay vì để kho phát hiện vào phút cuối.

Phiếu nháp **luôn hiện đầu danh sách** trên ứng dụng, bất kể đang lọc theo khoảng ngày nào —
vì đó là phiếu cần xử lý. Kỹ thuật viên xoá được phiếu nháp **do chính mình lập**; xoá xong
nghĩa vụ mở lại ngay.

📚 Chi tiết đầy đủ từng tình huống: [Trả vật tư về kho (FSMNext)](FSMNext-Tra-Vat-Tu.html).

---

## 5. Huỷ phiếu giao hàng sau khi đã trả hàng

| Nghĩa vụ | Hệ thống xử lý |
|---|---|
| Chưa ai trả | Gỡ khỏi đơn bán hàng, hoàn lại số lượng dòng đơn |
| **Đã trả bằng phiếu đã duyệt** | **Giữ lại làm dấu vết**: không đòi trả nữa, ghi rõ đã trả bao nhiêu bằng phiếu nào; số lượng dòng đơn vẫn được hoàn |

Người huỷ nhận cảnh báo liệt kê từng món, kèm nhắc rằng hàng đang nằm ở kho công ty và cần
lấy lại trước khi giao lại. Dấu vết này hiện thành một khối riêng trên ứng dụng, tách khỏi
bảng sản phẩm trả lại, và **mọi chốt chặn khác đều bỏ qua nó** — không ai bị đòi trả lần hai.

---

## 6. Ngoại lệ thường gặp ở chặng này

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Dòng nghĩa vụ **mờ và khoá** | Phần đó đang nằm trong một phiếu nháp chờ kho | Đọc mã phiếu ghi ngay trên dòng; chờ kho duyệt hoặc xoá phiếu nháp |
| Trả hàng rồi mà **nợ vẫn treo** | Phiếu trả còn nháp, kho chưa duyệt | Nhắc kho duyệt; chỉ phiếu đã duyệt mới xoá nợ |
| Không xoá được phiếu nháp | Phiếu do người khác lập | Nhờ người lập phiếu hoặc quản trị viên xoá |
| Nghĩa vụ trỏ tới **mã vật tư không còn tồn tại** | Nghĩa vụ là bản chụp tại thời điểm giao hàng; đổi tên mã vật tư về sau không cập nhật bản chụp | Cần tác vụ dữ liệu ánh xạ mã cũ sang mã mới, không tự xử lý được trên ứng dụng |
| Nghĩa vụ là **bộ sản phẩm** nhưng thành phần không khớp | Hệ thống nở bộ theo cấu hình **hiện tại**, không theo cấu hình lúc giao | Đối chiếu thủ công với phiếu giao hàng gốc |
| Nghĩa vụ **không ghi kho nguồn** | Dữ liệu cũ, trước khi hệ thống ghi trường này | Nghĩa vụ hiện ở mọi kho của người đó; chọn đúng kho đang giữ hàng |
| Hàng được cấp **ngoài phiếu yêu cầu** | Hệ thống chỉ đòi trả phần thực nhận qua phiếu yêu cầu | Phần ngoài luồng phải kiểm kê thủ công |
| Phiếu trả **về nhầm kho của người khác** | Nghĩa vụ không khai kho đích nên hệ thống chọn kho đầu danh sách | Kiểm kho đích trước khi gửi; báo quản trị khai kho trả mặc định cho từng người |
| Kho KTV **âm tồn** | Xuất tiêu hao hoặc giao hàng vượt số thực nhận | Kiểm kê lại kho đó; chưa dọn xong thì không bật công tắc chặn cứng |
| Duyệt nhầm **phiếu nháp cũ** | Phiếu tồn từ trước, trỏ vào nghĩa vụ đã trả xong bằng phiếu khác | Những phiếu này phải **xoá**, không phải duyệt — duyệt sẽ trừ kho lần thứ hai |

---

## 7. Chặng tiếp theo

Kỹ thuật viên đã có hàng trong tay. Bước kế là giao cho khách và thu tiền:
**[Chặng 5 — Giao hàng và thu tiền](Quy-Trinh-05-Giao-Hang-Thu-Tien.html)**.
