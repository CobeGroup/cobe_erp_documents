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

| Nhận vào | Bàn giao ra |
|---|---|
| Lịch hẹn đã có kỹ thuật viên phụ trách | Vật tư nằm ở kho kỹ thuật viên, kèm nghĩa vụ trả phần không dùng → [Chặng 5](Quy-Trinh-05-Giao-Hang-Thu-Tien.html) |

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ chặng

<div style="position:relative;width:100%;padding-bottom:47.71%">
  <object type="image/svg+xml" data="images/svg/quy-trinh/05-vat-tu.svg" style="position:absolute;inset:0;width:100%;height:100%;border:0">
    <img src="images/svg/quy-trinh/05-vat-tu.svg" alt="Ba tầng đọc theo chiều dọc: ai làm, chứng từ nào sinh ra, và hàng đang nằm ở kho nào. Kỹ thuật viên yêu cầu hàng, kho xuất sang kho kỹ thuật viên, kỹ thuật viên giao cho khách, phần không giao sinh nghĩa vụ trả, kỹ thuật viên lập phiếu trả ở trạng thái nháp và chỉ khi kho duyệt thì hàng mới về kho công ty và nợ mới được xoá" style="width:100%;height:auto">
  </object>
</div>

👆 **Bấm vào từng ô** để mở phần giải thích.
{: .fs-3 }

---

## 1. Kho riêng của từng kỹ thuật viên
{: #kho-ktv }

Vật tư mang theo **không nằm ngoài sổ sách**. Mỗi người được cấp một **kho riêng**
(`Warehouse`) cho từng công ty; hàng ở đó vẫn là tài sản công ty, chỉ đổi vị trí lưu trữ.

| Trường hợp | Quy tắc |
|---|---|
| Một người, một công ty | Chỉ **một** kho |
| Một người, nhiều công ty | Mỗi công ty một kho |
| Kho hoàn trả mặc định | Khai riêng, **không được trùng** kho của chính người đó |
| Chưa khai kho cho một công ty | Mọi thao tác vật tư ở công ty đó đều báo lỗi |

---

## 2. Bốn luồng vật tư
{: #luong }

| # | Luồng | Chứng từ | Ai xác nhận | Trạng thái khi lập |
|---|---|---|---|---|
| ① | **Nhận vật tư** | Yêu cầu vật tư → phiếu xuất kho | Kho xuất hàng | Phiếu xuất do kho xác nhận |
| ② | **Dùng hết tại hiện trường** | Phiếu xuất vật tư (*Material Issue*) | Kỹ thuật viên | Xác nhận ngay |
| ③ | **Chuyển kho giữa hai công ty** | Cặp phiếu xuất và nhập | Kỹ thuật viên | Xác nhận ngay, theo cặp |
| ④ | **Trả vật tư về kho** | Phiếu trả (*Material Transfer*) | **Kho duyệt** | **Nháp**, chờ kho kiểm |

Khác biệt quan trọng nhất nằm ở cột cuối: **chỉ luồng ④ giữ phiếu ở trạng thái nháp**. Hàng rời
kho công ty cần kho xác nhận, hàng quay về cũng cần kho kiểm đếm lại.

---

## 3. Nhận vật tư
{: #yeu-cau }

### 3.1. Yêu cầu theo một lịch hẹn

Trên ứng dụng: màn hình kho → **Yêu cầu hàng** → chọn lịch hẹn sắp làm. Hệ thống gom sẵn danh
sách vật tư từ ba nguồn:

- Vật tư khai trên **phiếu công việc**.
- Vật tư khai trên **từng dòng việc** của phiếu (bỏ qua món đã có ở trên).
- Hàng trên **đơn bán hàng** liên kết: số còn phải giao = số đặt − số đã giao.

Hệ thống còn tự làm thêm hai việc:

| Việc | Nghĩa là |
|---|---|
| **Khai triển bộ sản phẩm** | Dòng cha chỉ để tham khảo; các món thành phần hiện bên dưới, số lượng đã nhân theo bộ |
| **Trừ phần đã yêu cầu trước** | Được yêu cầu = cần − đã yêu cầu. Món đã đủ vẫn hiện nhưng không chọn được, kèm mã yêu cầu cũ |

> Tồn kho hiện có của kỹ thuật viên **chỉ để tham khảo**, không phải căn cứ tính số được yêu cầu.

### 3.2. Yêu cầu không gắn lịch hẹn

Dùng cho vật tư tiêu hao và hàng dự phòng mang theo xe: tìm món theo tên → nhập số lượng →
chọn kho đích nếu có nhiều kho → gửi. Loại này không gắn phiếu công việc hay đơn hàng nào.

### 3.3. Kho xử lý yêu cầu

Nhân viên kho nhận yêu cầu trên `/master-stock` hoặc Desk, rồi lập phiếu xuất kho chuyển hàng
sang kho kỹ thuật viên. Kho được phép:

- Xuất từ **nhiều kho khác nhau** cho cùng một yêu cầu.
- Xuất **nhiều lần** — hệ thống theo dõi: chưa xuất, xuất một phần, xuất đủ.
- Từ chối hoặc điều chỉnh, sau khi trao đổi lại với kỹ thuật viên.

---

## 4. Trả vật tư về kho
{: #tra-ve }

Đây là luồng hay sai nhất, và cũng là luồng nhiều chốt kiểm soát nhất.

### 4.1. Nghĩa vụ trả phát sinh lúc nào

⚠️ **Không phải lúc trả hàng, mà lúc lập phiếu giao hàng.** Với mỗi dòng của đơn:

> **Số cần trả = số mang đi − số thực giao cho khách hàng**

Mỗi phần chênh lệch được cấp một **mã nghĩa vụ** riêng, ghi vào đơn bán hàng kèm: số cần trả,
thời điểm, người khai, kho của người đó lúc khai, và phiếu giao hàng đã làm phát sinh.

### 4.2. Ba con số trên màn hình Trả vật tư

| Con số | Nghĩa |
|---|---|
| **Cần trả** | Phần còn lại sau khi trừ các phiếu **đã duyệt** |
| **Đang chờ kho** | Phần đang nằm trong phiếu **nháp**, kho chưa duyệt |
| **Còn chọn được** | Cần trả − Đang chờ kho |

Bên dưới là danh sách **hàng không gắn nghĩa vụ còn trong kho**. Hai danh sách trừ chéo nhau để
một món không bị tính hai lần.

### 4.3. Chốt kiểm soát khi lập phiếu trả

| Chốt | Kiểm gì | Nếu không đạt |
|---|---|---|
| **Phạm vi** | Kho nguồn là kho của chính mình; kho đích cùng công ty; có ít nhất một dòng lớn hơn 0 | Từ chối |
| **Đã trả đủ** | Nghĩa vụ đã có phiếu duyệt bù đủ | Từ chối: *“đã được trả về kho rồi”* |
| **Vượt phần còn lại** | Số trả ≤ cần trả − đã duyệt − đang chờ kho | Từ chối, nêu rõ con số và mã phiếu đang giữ chỗ |
| **Tự gắn mã nghĩa vụ** | Hàng không gắn nghĩa vụ có khớp nghĩa vụ đang nợ không | Không từ chối; gắn được tới đâu thì gắn, ưu tiên nghĩa vụ khai sớm nhất |
| **Đủ tồn khả dụng** | Tồn kho trừ phần đã cam kết ở các phiếu nháp khác | Cảnh báo, hoặc từ chối nếu tham số kiểm soát chặt đang bật |

### 4.4. Kho duyệt thì nghĩa vụ mới hết

⛔ **Phiếu trả ở trạng thái nháp không làm thay đổi sổ kho.** Hàng vẫn tính ở kho kỹ thuật viên
cho tới khi kho duyệt. Lúc duyệt, hệ thống kiểm lại tồn kho lần nữa và từ chối nếu không đủ.

Phiếu nháp **luôn hiện ở đầu danh sách** trên ứng dụng, không phụ thuộc khoảng ngày đang lọc.
Kỹ thuật viên xoá được phiếu nháp **do chính mình lập**; xoá xong nghĩa vụ mở lại ngay.

📚 Chi tiết từng tình huống: [Trả vật tư về kho (FSMNext)](FSMNext-Tra-Vat-Tu.html).

---

## 5. Huỷ phiếu giao hàng sau khi đã trả
{: #huy-dn }

| Nghĩa vụ đang ở trạng thái | Hệ thống xử lý |
|---|---|
| Chưa được hoàn trả | Gỡ khỏi đơn và hoàn lại số lượng của dòng đơn |
| **Đã hoàn trả bằng phiếu đã duyệt** | **Giữ làm dấu vết**: không đòi trả nữa, ghi rõ số đã trả và mã phiếu; số lượng dòng đơn vẫn được hoàn lại |

Người huỷ nhận cảnh báo liệt kê từng món, kèm lưu ý hàng đang nằm ở kho công ty và cần lấy lại
trước khi giao lại. Dấu vết này nằm ở khối riêng trên ứng dụng và không phát sinh yêu cầu trả
lần hai.

---

## 6. Khi gặp trục trặc
{: #truc-trac }

| Hiện tượng | Nguyên nhân | Cách gỡ |
|---|---|---|
| Dòng nghĩa vụ **mờ và bị khoá** | Phần đó đang nằm trong một phiếu nháp chờ kho duyệt | Tra mã phiếu ghi trên dòng; chờ kho duyệt hoặc xoá phiếu nháp |
| Đã trả hàng nhưng **nghĩa vụ vẫn còn** | Phiếu trả còn nháp | Đề nghị kho duyệt; chỉ phiếu **đã duyệt** mới xoá nghĩa vụ |
| **Không xoá được** phiếu nháp | Phiếu do người khác lập | Nhờ người lập hoặc quản trị viên xoá |
| Nghĩa vụ trỏ tới **mã vật tư không còn tồn tại** | Nghĩa vụ ghi lại theo thời điểm giao hàng; đổi tên mã vật tư về sau không cập nhật ngược | Cần tác vụ xử lý dữ liệu, không tự sửa trên ứng dụng được |
| Nghĩa vụ là **bộ sản phẩm** nhưng thành phần không khớp | Hệ thống khai triển bộ theo cấu hình **hiện tại**, không theo lúc giao | Đối chiếu tay với phiếu giao hàng gốc |
| Nghĩa vụ **không ghi kho nguồn** | Dữ liệu cũ, phát sinh trước khi hệ thống ghi nội dung này | Nghĩa vụ hiện ở mọi kho của người đó; chọn đúng kho đang giữ hàng |
| Phiếu trả **được ghi vào kho của người khác** | Nghĩa vụ không khai kho đích nên hệ thống chọn kho đầu danh sách | Kiểm kho đích **trước khi** gửi; đề nghị quản trị viên khai kho hoàn trả mặc định |
| Kho kỹ thuật viên **âm tồn** | Xuất hoặc giao vượt số thực nhận | Kiểm kê lại kho đó; chưa xong thì đừng bật tham số kiểm soát chặt |
| **Phiếu nháp tồn đọng** từ lâu | Trỏ vào nghĩa vụ đã được trả bằng phiếu khác | Phải **xoá**, không được duyệt — duyệt là trừ kho lần hai |
| Hàng được cấp **ngoài phiếu yêu cầu** | Hệ thống chỉ theo dõi phần đi qua phiếu yêu cầu | Phần ngoài luồng phải kiểm kê thủ công |

---

## 7. Câu hỏi thường gặp
{: #hoi-dap }

**Tôi trả hàng rồi, sao vẫn báo còn nợ vật tư?**

Phiếu trả còn ở trạng thái **nháp**. Chỉ khi kho duyệt thì nghĩa vụ mới hết, xem [mục 4.4](#tra-ve).

**Khách không nhận một món, tôi phải làm gì ngay tại chỗ?**

Cứ giảm số lượng trên phiếu giao hàng. Phần chênh tự thành nghĩa vụ trả; mang hàng về rồi lập
phiếu trả.

**Lấy dư vật tư mang theo xe, có phải trả không?**

Phần lấy theo yêu cầu không gắn lịch hẹn không sinh nghĩa vụ, nhưng vẫn nằm trong kho của bạn
và vẫn phải kiểm kê. Không dùng thì nên trả về kho.

**Yêu cầu vật tư rồi mà kho chưa xuất, xem ở đâu?**

Trên ứng dụng, yêu cầu hiện trạng thái: chưa xuất, xuất một phần, xuất đủ.

**Lập nhầm phiếu trả thì sao?**

Phiếu còn nháp và do chính bạn lập thì xoá được, nghĩa vụ mở lại ngay. Kho đã duyệt rồi thì
phải nhờ kho xử lý.

**Hai kỹ thuật viên cùng đi, ai đứng tên trả hàng?**

Người nào lập phiếu giao hàng thì nghĩa vụ gắn vào kho của người đó.

---

## Chặng tiếp theo

Đã có vật tư trong tay. Bước kế tiếp là giao cho khách hàng và thu tiền:
**[Chặng 5 — Giao hàng và thu tiền](Quy-Trinh-05-Giao-Hang-Thu-Tien.html)**.
