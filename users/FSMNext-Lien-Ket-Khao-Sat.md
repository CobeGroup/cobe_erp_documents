---
title: Liên kết đơn khảo sát (FSMNext)
layout: default
parent: Dịch vụ & Bảo dưỡng
nav_order: 8
---

# Liên kết đơn khảo sát với đơn lắp đặt

> Đối tượng: **tư vấn**, **điều phối**, **kỹ thuật viên (KTV)**, **quản lý dịch vụ**.
> Tài liệu mô tả cách gắn một đơn khảo sát đã thực hiện trước đó vào đơn lắp đặt phát sinh sau,
> để kỹ thuật viên đi lắp xem lại được tệp đính kèm, ghi nhận hiện trường, phiếu khảo sát nước
> và phiếu phân tích nước của lần khảo sát.
>
> Tài liệu này mở rộng **[Quy trình dịch vụ hiện trường](FSMNext-Quy-Trinh-Dich-Vu.html)**.

---

## Bảng đối chiếu tên

| Trong tài liệu | Tên hệ thống |
|---|---|
| Phiếu công việc | `FS Work Order` |
| Lịch hẹn | `FS Service Appointment` |
| Loại công việc | `FS Work Type` — ở đây là `Khảo sát` và `Lắp đặt` |
| Hạng mục khảo sát | `FS WO Reference Item` |
| Phiếu phân tích nước | `Water Analysis Report` — phòng lab phân tích mẫu |
| Phiếu khảo sát nước | `Water Diagnosis Report` — kỹ thuật viên đo tại hiện trường khi khảo sát |
| Cấu hình FSMNext của Cobe | `COBE FSM Settings` |
| Nhật ký gán hàng loạt | `COBE Survey Backfill Run` |

---

## Toàn cảnh

<a href="images/svg/fsm/lien-ket-khao-sat-luong.svg" title="Bấm để phóng to">
  <img src="images/svg/fsm/lien-ket-khao-sat-luong.svg" alt="Luồng liên kết đơn khảo sát theo bốn tầng: kỹ thuật viên đi khảo sát sinh phiếu công việc loại Khảo sát kèm tệp đính kèm và phiếu phân tích nước; tư vấn đặt hai ô liên kết trên phiếu lắp đặt; sau đó tư vấn trên Desk và kỹ thuật viên của đúng ca đọc được nội dung khảo sát" style="width:100%;height:auto">
</a>

Điều cần nắm trước tiên: **phiếu lắp đặt không tự biết đơn khảo sát nào đi trước nó.** Hệ thống
không suy ra được mối liên hệ này, vì phiếu phân tích nước lẫn đơn yêu cầu phân tích đều không
lưu số phiếu công việc. Vì vậy liên kết do **con người đặt**, và chỉ tư vấn hoặc điều phối mới
đặt được.

---

## Xem nhanh bằng video

Toàn bộ thao tác gắn liên kết và đọc lại nội dung khảo sát, quay trên dữ liệu minh hoạ:

<video src="images/guide/fsm/lien-ket-khao-sat.mp4" controls playsinline
       poster="images/guide/fsm/lien-ket-khao-sat-poster.png"
       style="width:100%;max-width:960px;height:auto;border:1px solid #d0d7de;border-radius:6px"></video>

Video không có tiếng; lời dẫn nằm ở dải chữ cuối màn hình. Khách hàng, đơn khảo sát và phiếu
phân tích nước trong video đều là dữ liệu minh hoạ, không phải khách thật.

---

## 1. Tư vấn gắn đơn khảo sát

Trên phiếu công việc lắp đặt, ở góc phải phía trên có nhóm nút **Khảo sát**:

| Mục | Tác dụng |
|---|---|
| **Chọn WO khảo sát** | Mở hộp thoại chọn đơn khảo sát và, nếu có, phiếu phân tích nước của phòng lab |
| **Gỡ liên kết khảo sát** | Xoá liên kết hiện có; chỉ hiện khi phiếu đang có liên kết |

Hộp thoại chỉ liệt kê những đơn khảo sát **của đúng khách hàng trên phiếu lắp đặt**, chưa bị
huỷ, xếp mới nhất lên đầu, kèm ngày khảo sát và trạng thái để phân biệt.

Hệ thống gợi ý sẵn một lựa chọn, tư vấn vẫn đổi được:

| Ô | Được điền sẵn khi |
|---|---|
| Đơn khảo sát | Phiếu đã có liên kết cũ; hoặc ô **Đơn cha** đang trỏ về một đơn khảo sát của **cùng khách hàng**; hoặc khách hàng chỉ có đúng một đơn khảo sát |
| Phiếu phân tích nước | Khách hàng chỉ có đúng một phiếu |

Khách có nhiều đơn khảo sát hoặc nhiều phiếu phân tích nước thì ô để trống, tư vấn tự chọn.

Sau khi lưu, phiếu lắp đặt có thêm tab **Khảo sát**.

### Hai loại phiếu nước, chỉ chọn một loại

Hệ thống có hai chứng từ về nước, dễ nhầm với nhau:

| Phiếu | Ai lập | Lập khi nào | Gắn với | Trong hộp thoại |
|---|---|---|---|---|
| **Phiếu khảo sát nước** (`Water Diagnosis Report`) | Kỹ thuật viên, trên ứng dụng | Ngay tại hiện trường, trong ca khảo sát | Đúng một đơn khảo sát | **Không có ô chọn.** Tab Khảo sát tự đọc theo đơn khảo sát đã gắn |
| **Phiếu phân tích nước** (`Water Analysis Report`) | Phòng lab | Sau khi nhận mẫu nước | Khách hàng, không ghi số đơn khảo sát | Ô **Phiếu phân tích nước**, tư vấn chọn |

Hai phiếu khác nhau ở chỗ gắn: phiếu khảo sát nước luôn ghi số đơn khảo sát, nên hệ thống tự
tìm được. Phiếu phân tích nước chỉ ghi khách hàng; khách khảo sát hai lần và gửi mẫu hai lần thì
hệ thống không tự biết phiếu nào thuộc lần nào, vì vậy phiếu này do tư vấn chọn.

Đơn khảo sát nào có phiếu khảo sát nước thì trong danh sách chọn có ghi thêm *có phiếu khảo sát
nước*. Ô **Phiếu phân tích nước** để *-- Không chọn --* là bình thường khi khách không gửi mẫu
tới phòng lab; phần lớn đơn khảo sát chỉ có phiếu khảo sát nước của kỹ thuật viên.

### Khi khách có phiếu phân tích nước của phòng lab

Ô **Phiếu phân tích nước** liệt kê các phiếu của đúng khách hàng trên phiếu lắp đặt, chưa bị
huỷ, xếp mới nhất lên đầu, kèm ngày báo cáo và loại nước. Khách chỉ có đúng một phiếu thì hệ
thống chọn sẵn; nhiều phiếu thì tư vấn đối chiếu ngày báo cáo với ngày khảo sát rồi chọn.
Phiếu còn nháp vẫn gắn được, tab sẽ ghi rõ tình trạng để người đọc biết số liệu chưa chốt.

Hai ô trong hộp thoại độc lập với nhau. Tab Khảo sát hiện theo những gì đã gắn:

| Đã gắn | Tab Khảo sát hiện |
|---|---|
| Đơn khảo sát và phiếu phân tích nước | Đơn khảo sát, phiếu khảo sát nước của kỹ thuật viên (nếu có), rồi phiếu phân tích nước |
| Chỉ đơn khảo sát | Đơn khảo sát và phiếu khảo sát nước của kỹ thuật viên (nếu có) |
| Chỉ phiếu phân tích nước | Chỉ phần phiếu phân tích nước; không có phiếu khảo sát nước vì không có đơn khảo sát để suy ra |
| Không gắn gì | Tab không xuất hiện |

Có cả hai loại phiếu nước thì tab hiện cả hai, phần kỹ thuật viên đo tại hiện trường đứng trước,
phần phòng lab đứng sau.

### Phiếu gắn bằng ô Đơn cha từ trước

Trước khi có nút này, một số phiếu lắp đặt đã được gắn đơn khảo sát qua ô **Đơn cha**
(`Parent Work Order`). Những phiếu đó **vẫn xem được tab Khảo sát**, không cần gắn lại; tab ghi
thêm dòng *Nguồn liên kết: suy ra từ ô Đơn cha* để người đọc biết đây không phải lựa chọn của tư
vấn.

Chỉ đọc khi đơn cha thuộc **đúng khách hàng trên phiếu**. Ô Đơn cha không có luật nào bắt cùng
khách, nên nếu nó trỏ sang đơn khảo sát của khách khác thì tab **không hiện gì** — hồ sơ khách
này không được phép lọt sang phiếu của khách kia. Trường hợp đó phiếu vẫn nằm trong danh sách
gán hàng loạt, và tư vấn gắn tay bằng nút **Khảo sát** như bình thường.

Hai ô này khác nhau về mục đích, đừng dùng lẫn:

| Ô | Dùng để làm gì |
|---|---|
| **Đơn cha** (`Parent Work Order`) | Quan hệ vận hành: gom ca cho điều phối, phạm vi đóng phiếu, quy nghĩa vụ vật tư |
| **WO khảo sát** (nút *Khảo sát*) | Chỉ để đọc lại hồ sơ khảo sát; cố ý không tác động tới điều phối hay kho |

Cần đọc lại hồ sơ khảo sát thì dùng nút **Khảo sát**. Đừng điền ô **Đơn cha** chỉ vì mục đích
đó — ô ấy kéo theo cách hệ thống gom ca và tính nghĩa vụ vật tư của phiếu.

### Hệ thống từ chối trong những trường hợp nào

| Tình huống | Hệ thống báo |
|---|---|
| Chọn phiếu không thuộc loại `Khảo sát` | Nêu rõ loại công việc thật của phiếu đó |
| Chọn đơn khảo sát của khách hàng khác | Nêu tên khách hàng của đơn khảo sát |
| Chọn phiếu phân tích nước của khách hàng khác | Tương tự |
| Phiếu lắp đặt đã huỷ | Không cho đổi liên kết |
| Người bấm không phải tư vấn / điều phối | Từ chối, kể cả khi gọi thẳng qua API |

Ô liên kết để ở chế độ chỉ đọc trên giao diện, nhưng các luật trên được kiểm ở máy chủ chứ không
dựa vào giao diện — sửa bằng đường khác cũng không lọt.

---

## 2. Tab Khảo sát hiển thị gì

Cùng một nội dung trên Desk và trên ứng dụng kỹ thuật viên:

| Khối | Nội dung |
|---|---|
| **Đơn khảo sát** | Số phiếu, ngày khảo sát, trạng thái. Nếu phiếu khảo sát đã bị huỷ sau khi liên kết, có thêm dòng *Chứng từ: ĐÃ HUỶ* |
| **Mô tả** | Phần mô tả của đơn khảo sát |
| **Kết quả khảo sát** | Phần tổng kết sau khi làm việc của đơn khảo sát |
| **Hạng mục khảo sát** | Bảng mã hàng và tên hàng đã ghi nhận khi khảo sát |
| **Đính kèm khi khảo sát** | Ảnh và tệp gắn trên đơn khảo sát và các dòng của nó; bấm vào ảnh để phóng to |
| **Phiếu khảo sát nước** | Số phiếu, ngày khảo sát, hình thức, khảo sát viên — phiếu kỹ thuật viên lập tại hiện trường |
| **Chất lượng nguồn nước** | Loại nước, pH, TDS, độ cứng, CaCO₃, Clo dư, Sắt/Mangan, Amoni |
| **Tình trạng hiện tại** | Các dấu hiệu khách nêu: cặn, mùi, khô da, ăn mòn inox… |
| **Thông tin công trình** | Loại nhà, số phòng tắm, số người, khoảng cách bồn/phao/ống thoát, mái che, điện-nước-wifi |
| **Phương án lắp đặt** | Kết luận, vị trí dự kiến, sản phẩm dự kiến, loại và đường kính ống, chi phí vật tư phát sinh |
| **Vật tư phát sinh** | Bảng vật tư kỹ thuật viên dự trù khi khảo sát |
| **Phiếu phân tích nước** | Số phiếu, tình trạng phiếu, ngày báo cáo, ngày nhận mẫu, loại nước, mô tả mẫu |
| **Kết quả phân tích** | Bảng chỉ tiêu · kết quả · đơn vị · định mức cho phép |
| **Vấn đề · Kết luận · Giải pháp** | Phần nhận định trên phiếu phân tích nước |
| **Sản phẩm gợi ý** | Bảng sản phẩm đề xuất kèm theo phiếu |

Khối nào không có dữ liệu thì không hiện, nên tab luôn gọn.

**Tình trạng phiếu phân tích nước** được ghi rõ khi phiếu chưa được duyệt (*Nháp*) hoặc đã bị huỷ
(*ĐÃ HUỶ*). Đây là điểm cần chú ý khi đọc: một phiếu còn nháp là số liệu chưa chốt.

---

## 3. Kỹ thuật viên xem ở đâu

Trên ứng dụng kỹ thuật viên, mở lịch hẹn của công việc lắp đặt, tab **Khảo sát** nằm cạnh các
tab sẵn có. Tab chỉ xuất hiện khi phiếu công việc đã được liên kết, và nội dung là **chỉ đọc** —
kỹ thuật viên không đổi được liên kết.

Về quyền xem: nội dung khảo sát bao gồm cả phiếu phân tích nước của khách hàng, nên hệ thống chỉ
mở cho tư vấn, điều phối, và **kỹ thuật viên được phân vào đúng lịch hẹn đó**. Kỹ thuật viên
khác mở phiếu công việc không phải của mình sẽ không đọc được nội dung khảo sát.

---

## 4. Gán hàng loạt cho phiếu cũ

Những phiếu lắp đặt đã tạo từ trước không có liên kết. Thay vì bắt tư vấn mở từng phiếu, có công
cụ gán hàng loạt ở **COBE FSM Settings → nhóm nút Khảo sát**:

| Mục | Tác dụng |
|---|---|
| **Gán liên kết WO khảo sát** | Mở hộp thoại chọn loại công việc và chế độ chạy |
| **Các lần đã chạy** | Mở danh sách nhật ký các lần chạy |

<a href="images/svg/fsm/lien-ket-khao-sat-backfill.svg" title="Bấm để phóng to">
  <img src="images/svg/fsm/lien-ket-khao-sat-backfill.svg" alt="Công cụ gán hàng loạt: chọn chế độ Thử khô chỉ đếm hoặc Chạy thật ghi liên kết, hệ thống chạy nền và ghi lại từng lần chạy, bản ghi lần chạy có nút Hoàn tác gỡ đúng những liên kết lần đó đặt" style="width:100%;height:auto">
</a>

Công cụ chỉ nhận những phiếu **chưa có liên kết** và khách hàng chỉ có **đúng một** đơn khảo sát
tạo trước đó — trường hợp không thể nhầm. Khách có nhiều đơn khảo sát thì công cụ bỏ qua, để tư
vấn tự chọn. Phiếu phân tích nước cũng chỉ được gán khi khách hàng có đúng một phiếu còn hiệu
lực. Phiếu khảo sát nước của kỹ thuật viên không cần gán: gán xong đơn khảo sát là tab tự đọc.

**Trình tự nên làm:**

1. Chạy chế độ **Thử khô** trước. Hệ thống chỉ đếm, không ghi gì.
2. Mở bản ghi lần chạy để xem số ứng viên và số kèm được phiếu nước.
3. Ưng ý thì chạy lại ở chế độ **Chạy thật**.
4. Nếu kết quả không như mong muốn: mở đúng bản ghi lần chạy đó, bấm **Hoàn tác**.

Việc chạy ở chế độ nền, nên bấm xong có thể đóng trang; kết quả nằm ở bản ghi lần chạy. Hoàn tác
chỉ gỡ những liên kết do chính lần chạy đó đặt, và **giữ nguyên** phiếu nào đã được người dùng
sửa thủ công sau đó.

Công cụ này dành cho quản trị FSM. Tư vấn vẫn gắn được từng phiếu như mục 1, nhưng không chạy
được hàng loạt.

---

## 5. Vì sao nhiều phiếu lắp đặt không có tab Khảo sát

Phần lớn đơn lắp đặt không đi qua bước khảo sát, nên không có gì để liên kết. Đây là đặc thù
nghiệp vụ chứ không phải lỗi. Tab chỉ xuất hiện ở những phiếu đã được liên kết.

Khi khách hàng của đơn lắp đặt có đơn khảo sát nhưng hộp thoại vẫn không liệt kê, hãy kiểm tra
theo thứ tự:

| Kiểm tra | Vì sao |
|---|---|
| Phiếu lắp đặt đã điền khách hàng chưa | Không có khách hàng thì không đối chiếu được |
| Đơn khảo sát có đúng khách hàng đó không | Khách được tạo lại thì hai phiếu thuộc hai mã khách khác nhau |
| Đơn khảo sát có bị huỷ không | Phiếu đã huỷ không được gợi ý |
| Loại công việc của đơn khảo sát | Phải đúng loại `Khảo sát` |
| Phiếu có sẵn ô **Đơn cha** trỏ về đơn khảo sát cùng khách | Tab đã hiện sẵn rồi, không cần gắn thêm |

---

## Câu hỏi thường gặp

**Một đơn lắp đặt gắn được mấy đơn khảo sát?**
Một. Nếu khách có nhiều lần khảo sát, tư vấn chọn lần đúng với công trình đang lắp.

**Khách có phiếu phân tích nước của phòng lab thì làm gì?**
Chọn ở ô **Phiếu phân tích nước** trong cùng hộp thoại. Khách có đúng một phiếu thì hệ thống đã
chọn sẵn. Phiếu khảo sát nước của kỹ thuật viên vẫn tự hiện theo đơn khảo sát, tab sẽ có cả hai.

**Một đơn khảo sát dùng cho nhiều đơn lắp đặt được không?**
Được. Nhiều phiếu lắp đặt cùng trỏ về một đơn khảo sát là bình thường.

**Kỹ thuật viên gắn liên kết được không?**
Không. Kỹ thuật viên chỉ đọc. Việc gắn thuộc tư vấn và điều phối.

**Gỡ liên kết có mất dữ liệu khảo sát không?**
Không. Gỡ liên kết chỉ xoá mối nối; đơn khảo sát và phiếu phân tích nước vẫn nguyên.

**Đơn khảo sát đã có phiếu khảo sát nước mà ô Phiếu phân tích nước vẫn trống?**
Đúng như vậy. Ô đó chỉ dành cho phiếu của phòng lab. Phiếu khảo sát nước kỹ thuật viên lập tại
hiện trường tự hiện trong tab Khảo sát ngay khi gắn đơn khảo sát, không cần chọn gì thêm.

**Phiếu phân tích nước đang nháp có gắn được không?**
Được, nhưng tab sẽ ghi rõ *Tình trạng phiếu: Nháp* để người đọc biết số liệu chưa chốt.

**Đơn cha của tôi là đơn khảo sát mà tab vẫn trống?**
Kiểm tra khách hàng của hai phiếu. Tab chỉ đọc ô Đơn cha khi hai phiếu cùng một khách; khác
khách thì cố ý không hiện. Gắn tay bằng nút **Khảo sát** là xong.

**Phiếu của tôi đã có ô Đơn cha là đơn khảo sát, có phải gắn lại không?**
Không. Tab Khảo sát tự đọc luôn ô đó. Chỉ gắn bằng nút **Khảo sát** khi muốn trỏ sang một đơn
khảo sát khác với ô Đơn cha, hoặc muốn gắn thêm phiếu phân tích nước.

**Đang xem tab Khảo sát thì tư vấn gỡ liên kết, ứng dụng có lỗi không?**
Không. Lần mở sau tab biến mất và ứng dụng quay về tab Work Order.

---

## Liên quan

- **[Quy trình dịch vụ hiện trường (FSMNext)](FSMNext-Quy-Trinh-Dich-Vu.html)** — vòng đời phiếu công việc và lịch hẹn.
- **[Trả vật tư về kho (FSMNext)](FSMNext-Tra-Vat-Tu.html)** — nghĩa vụ trả hàng sau khi lắp đặt.
- **[Tự xử lý sự cố dịch vụ (FSMNext)](FSMNext-Xu-Ly-Su-Co.html)** — khi phiếu công việc không lên đúng trạng thái.
