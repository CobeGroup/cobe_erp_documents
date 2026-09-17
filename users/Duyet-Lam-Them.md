---
title: "Duyệt đơn làm thêm giờ (OT)"
layout: default
parent: Phê duyệt
grand_parent: Chấm công & HR
nav_order: 4
---

# Duyệt đơn làm thêm giờ (OT)
{: .no_toc }

**Dành cho:** Trưởng Bộ Phận (người duyệt chấm công) · HR · **Thời lượng:** ~1 phút
{: .fs-3 .text-grey-dk-000 }

> Đơn làm thêm **duyệt hai cấp**, giống đơn nghỉ phép: **trưởng bộ phận** duyệt trước,
> **HR** duyệt bước cuối. Cả hai duyệt trên tab **Cần duyệt**. Chỉ khi HR duyệt xong,
> hệ thống mới lo phần còn lại: đối chiếu chấm công, tính tiền theo hệ số, hoặc cộng
> giờ vào quỹ Nghỉ bù.

---

## 🎬 Video hướng dẫn (1 phút)

Duyệt một đơn làm thêm + bật/tắt các loại thông báo (bật tiếng để nghe thuyết minh):

<video src="images/guide/overtime/duyet-lam-them.mp4" width="260" controls playsinline poster="images/guide/overtime/duyet-lam-them-poster.png"></video>

---

## 1. Ai duyệt đơn làm thêm?

Đơn đi qua **hai bước**, mỗi bước một người:

```
Nhân viên gửi đơn
      │
      ▼
Chờ trưởng bộ phận duyệt ──từ chối──► Bị từ chối
      │ duyệt
      ▼
Chờ HR duyệt ──────────────từ chối──► Bị từ chối
      │ duyệt
      ▼
Đã duyệt  ←  chỉ từ đây đơn mới có hiệu lực
```

| Bước | Ai duyệt | Được báo khi nào |
|---|---|---|
| **1 — Trưởng bộ phận** | **Người duyệt chấm công** của nhân viên (Shift Request Approver — cùng người duyệt Chấm công bù / WFH), **không phải** người duyệt nghỉ phép. Trên app chỉ người này thấy đơn ở bước 1 | Ngay khi nhân viên gửi đơn |
| **2 — HR** | HR Manager **có tên trong danh sách người duyệt cuối** ở [Chính sách chấm công](Desk-Admin-Policy.html) của công ty nhân viên — **cùng danh sách** với đơn nghỉ phép. Danh sách để trống thì mọi HR Manager duyệt được. System Manager luôn duyệt được | Ngay khi trưởng bộ phận duyệt xong |

> ⚙️ **Chế độ này bật/tắt được.** HR Approval Inbox Settings → dòng *HR Overtime Request* → cột
> **Duyệt 2 cấp** (hiện đang **bật**). Bỏ tick thì đơn làm thêm quay về **1 bước**: trưởng bộ phận bấm
> **Duyệt** là đơn có hiệu lực ngay, như trước 09/2026. Xem
> [Vận hành chấm công theo phòng ban §1.4](Cham-Cong-Van-Hanh-Theo-Phong-Ban.html).

Ba luật cần nhớ (hai luật đầu giống đơn nghỉ phép):

- **Không tự duyệt bước 1 cho đơn của chính mình.** Trưởng bộ phận là người duyệt của
  chính mình thì người duyệt khác của phòng (bảng người duyệt chấm công trên
  `Department`) duyệt bước 1. Bước HR thì được tự duyệt.
- **Không còn ai khác duyệt bước 1 thì đơn lên thẳng HR** ngay khi gửi — HR nhận thông
  báo, đơn hiện ở bước HR với nhãn *Chờ HR duyệt* nhưng không có dòng *"… đã duyệt bước
  1"*. Đây là trường hợp trưởng phòng hoặc HR đứng đầu tự là người duyệt chấm công của
  mình, hoặc người được khai thiếu role / tài khoản bị khoá — giống đơn nghỉ của quản lý đi
  thẳng HR. HR đứng đầu tự duyệt được đơn của mình ở
  bước này. Sau này khai thêm người duyệt cho nhân viên đó thì đơn đang chờ tự quay về
  bước 1.
- **HR không duyệt thay bước 1 trên app** (hộp duyệt không hiện đơn bước 1 cho HR, và đơn
  làm thêm không có đường duyệt trên Desk). Người duyệt vắng lâu thì khai thêm người duyệt
  cho phòng — đơn đang chờ hiện ngay cho người mới.

---

## 2. Duyệt trên app

Mở tab **Cần duyệt** — đơn làm thêm có tag 🟠 **Làm thêm giờ**:

<img src="images/guide/overtime/05-duyet-inbox.png" width="240" alt="Inbox Cần duyệt có đơn Làm thêm giờ">

Bấm vào đơn để xem chi tiết. Nút hiện theo bước của đơn:

| Đơn đang ở | Nhãn trên thẻ | Nút |
|---|---|---|
| Bước 1 | *Chờ trưởng bộ phận duyệt* | **Duyệt (Trưởng bộ phận)** · **Từ chối** |
| Bước 2 | *Chờ HR duyệt* — kèm dòng *"… đã duyệt bước 1"* | **Duyệt (HR)** · **Từ chối** |

Mỗi người chỉ thấy đơn ở **đúng bước của mình**: trưởng bộ phận không thấy đơn đã
chuyển lên HR, HR không thấy đơn chưa qua trưởng bộ phận — trừ đơn lên thẳng HR vì
không còn ai khác duyệt bước 1 (mục 1).

<img src="images/guide/overtime/06-duyet-detail.png" width="240" alt="Chi tiết đơn làm thêm — nút Duyệt / Từ chối">

Đọc kỹ dòng tóm tắt trước khi duyệt — nó chứa đủ 3 thứ cần cân nhắc:

| Thông tin | Ý nghĩa khi duyệt |
|---|---|
| **Ngày + các khung giờ (Xh)** | Một ngày có thể có **nhiều khung** — ví dụ `12:00–13:30 + 17:30–19:30`. Tổng là số giờ **tối đa** sẽ được tính; thực tế làm ít hơn thì tính ít hơn — không lo duyệt "hớ". **Riêng khung trưa** (12:00–13:30): chấm công không đo được giờ nghỉ trưa, nên chữ ký của bạn chính là căn cứ công nhận — chỉ duyệt khi biết nhân viên thực sự làm xuyên trưa |
| **Quy đổi: Tiền lương** | Giờ OT sẽ vào lương kỳ tới (hệ số ×1.5 ngày thường / ×2.0 Chủ nhật **và Thứ 7 nửa buổi** / ×3.0 lễ) |
| **Quy đổi: Nghỉ bù** | Không ra tiền — số giờ được cộng vào **quỹ Nghỉ bù** của nhân viên, 4 giờ đổi 0,5 ngày nghỉ |
| **Lý do** | Nội dung công việc làm thêm — căn cứ chính để duyệt/từ chối |

**Nhân viên được báo khi nào:** khi đơn **bị từ chối** ở bất kỳ bước nào, và khi **HR
duyệt xong**. Trưởng bộ phận duyệt bước 1 thì nhân viên không nhận thông báo, nhưng
trên app đơn chuyển sang nhãn *"Trưởng bộ phận đã duyệt · chờ HR"*.

> ✍️ **Từ chối phải nêu lý do**, ở cả hai bước. Bấm **Từ chối** → hệ thống bắt nhập lý
> do trước khi xác nhận. Lý do này đi kèm thông báo gửi về cho nhân viên, để họ biết
> vì sao đơn bị từ chối và khai lại cho đúng nếu cần.

> ⏳ **Trưởng bộ phận duyệt xong, đơn vẫn CHƯA có hiệu lực.** Giờ làm thêm chưa vào
> chấm công, chưa vào quỹ Nghỉ bù, ngày nghỉ chưa được tính công — cho tới khi HR duyệt.
> Trong lúc chờ, nhân viên vẫn **tự rút đơn** được và **không khai được đơn thứ hai**
> cho cùng ngày.

---

## 3. Sau khi HR duyệt — hệ thống tự làm gì?

Không ai phải theo dõi gì thêm. Hôm nhân viên làm thêm:

1. Nhân viên check-in/out như bình thường.
2. Hệ thống đối chiếu **theo từng khung**: khung sau tan ca = min(giờ thực tế
   check-out sau ca, giờ xin); khung trưa = phần khung được phủ bởi check-in/check-out
   của ngày đó (có mặt cả ngày là điều kiện).
   - Không check-out → 0h cho mọi khung, không tính.
   - Chỉ khai khung tối mà về đúng giờ → 0h; khung trưa thì về đúng giờ vẫn được tính.
   - Ở lại lâu hơn số giờ xin → chỉ tính đúng số giờ đã duyệt.
3. Quy đổi **Tiền lương** → giờ OT vào **Overtime Slip** kỳ lương (HR chạy payroll là có).
   Quy đổi **Nghỉ bù** → số giờ đã duyệt vào **quỹ Nghỉ bù**, nhân viên dùng dần — xem
   [Quỹ giờ Nghỉ bù](Desk-HR-QuyNghiBu.html).

> 💡 Vì có bước đối chiếu tự động, cảnh báo *"Làm thêm sau giờ"* sẽ **không** bắn cho
> ngày đã có đơn duyệt — làm thêm có phép là chuyện bình thường, không phải bất thường.

---

## 4. Duyệt muộn có sao không?

Không sao. Nhân viên vốn đã làm thêm xong mới khai đơn; khi HR duyệt bước cuối, hệ
thống **đối chiếu ngược ngay lúc duyệt** — giờ OT vẫn được ghi nhận đầy đủ, dù hai bước
duyệt cách nhau bao lâu.

---

## 5. Lỡ duyệt nhầm — huỷ duyệt

Hay gặp nhất là **duyệt nhầm hình thức quy đổi** (Tiền lương ↔ Nghỉ bù). Đơn đã duyệt
thì tab *Cần duyệt* không còn thấy nữa, nhưng huỷ được ở hai chỗ:

- **Trên app** — vào **Cần duyệt** → chọn tab **"Đã duyệt · OT"** → bấm **Huỷ duyệt** ở đơn
  cần sửa. Tab này liệt kê đơn đã duyệt trong 45 ngày gần đây của nhân viên có **bạn là người
  duyệt chấm công trên hồ sơ Employee** (HR Manager / System Manager thấy tất cả). Người duyệt
  chỉ được khai ở bảng của Department thì không thấy đơn ở đây — huỷ trên Desk.
- **Trên Desk** — tìm **HR Overtime Request** → mở đơn → bấm nút đỏ **"Huỷ duyệt"**.

Nút chỉ hiện khi đơn đang ở trạng thái *Approved*.

**Ai bấm được:** trưởng bộ phận huỷ được đơn của nhân viên mình phụ trách; HR Manager /
System Manager huỷ được mọi đơn. Luật này **không đổi** khi có duyệt hai cấp: hai cấp
nhằm chặn việc đơn **có hiệu lực** khi HR chưa ký, còn huỷ duyệt chỉ **rút** hiệu lực —
giống đơn nghỉ phép, trưởng bộ phận vẫn huỷ được đơn đã duyệt.

> Phát hiện nhầm **trước khi** HR duyệt thì không cần huỷ duyệt: đơn chưa có hiệu lực gì,
> chỉ cần HR **từ chối** ở bước 2 (kèm lý do) để nhân viên khai lại đơn đúng.

**Hệ thống làm gì khi bạn bấm:**

1. Kiểm tra trước, vướng thì báo đỏ và **không cho huỷ**:
   - Giờ OT đã nằm trong **Overtime Slip đã duyệt** → phải huỷ slip đó trước.
   - **Phiếu lương đã duyệt** phủ ngày đó → tiền có thể đã trả, xử lý phiếu lương trước.
   - Đơn quy đổi Nghỉ bù mà rút số giờ này ra thì **quỹ Nghỉ bù bị âm** so với các đơn
     nghỉ bù nhân viên đã nộp → huỷ bớt đơn nghỉ bù trước, hoặc HR điều chỉnh quỹ.
2. Qua được thì bắt **nhập lý do** (bắt buộc), rồi:
   - Gỡ giờ OT khỏi bản chấm công ngày đó → kỳ lương **không** còn tính khoản này.
   - Đơn chuyển sang trạng thái **Cancelled** (đóng hẳn), ghi lý do + lưu vết ai huỷ.
   - Nhân viên nhận **thông báo** kèm lý do.

> Đơn *Cancelled* **không chiếm chỗ** — cần ghi nhận lại thì khai đơn mới cho đúng
> ngày đó, không bị báo trùng. Nhân viên tự khai lại được trong hạn khai làm thêm của
> công ty (xem [Hạn nộp phiếu & ràng buộc](HR-Filing-Deadline.html)); quá hạn thì HR
> tạo thủ công trên Desk.

---

## 6. Làm thêm vào Thứ 7 nửa buổi

Khối văn phòng nghỉ **nửa ngày Thứ 7** (khai bằng dòng *Half Day* trong Holiday
List). Ngày này hệ thống xử **khác cả ngày thường lẫn Chủ nhật**:

| | Nghĩa vụ trong ngày | Giờ OT được tính từ | Hệ số |
|---|---|---|---|
| Ngày thường | Trọn ca (VD 8h) | Sau giờ tan ca (17:30) | ×1.5 |
| **Thứ 7 nửa buổi** | **Nửa ca (VD 4h)** | **Sau khi đã đủ nửa ca** | **×2.0** |
| Chủ nhật / lễ | Không có | Từ giờ đầu tiên | ×2.0 / ×3.0 |

Nghĩa là nhân viên làm **trọn ngày Thứ 7** thì được:

- **0,5 ngày công** cho buổi sáng — phần nghĩa vụ, nằm trong bảng công như bình thường;
- phần vượt quá nửa buổi vào **đơn làm thêm** (tiền hoặc nghỉ bù).

*Ví dụ thật:* quẹt vào 07:57, ra 17:42 → giờ công 8,04h. Trừ nghĩa vụ nửa buổi
4h còn **4,04h**, xin 4h nên ghi nhận đúng **4h**.

> ⚠️ **Trần OT Thứ 7 là 4h** (dùng trần ngày thường, không phải trần lễ 8h) — vì
> buổi làm thêm thực tế là 13:30–17:30. Ai khai từ 12:00 là tính cả giờ nghỉ trưa,
> sẽ bị cắt về 4h.

Hệ số ×2.0 là **cấu hình được** per company — xem
[Chính sách chấm công §5](Desk-Admin-Policy.html#5-hệ-số-ot-ngày-làm-nửa-buổi).

---

## ⚠️ Lưu ý

| Tình huống | Cách xử |
|---|---|
| Trưởng bộ phận không thấy đơn trong Cần duyệt | Chưa được gán làm **Shift Request Approver** của nhân viên đó → báo HR. Hoặc đơn đã qua bước 1 (đang chờ HR) |
| HR không thấy đơn trong Cần duyệt | Đơn chưa qua trưởng bộ phận; hoặc bạn không có tên trong danh sách người duyệt cuối của công ty nhân viên — xem [Chính sách chấm công](Desk-Admin-Policy.html) |
| *"Đơn đã qua bước trưởng bộ phận duyệt…"* / *"Đơn chưa tới bước HR duyệt…"* / *"Đơn không còn ở trạng thái chờ duyệt"* | Đơn đã sang bước khác từ lúc bạn mở màn hình — người khác vừa duyệt, hoặc đơn bị sửa nên quay về bước 1. Tải lại danh sách |
| *"Bạn không phải người duyệt đơn này ở bước hiện tại"* | Bạn không phải người duyệt của nhân viên này ở bước đó, hoặc đang duyệt bước 1 cho đơn của chính mình |
| Sửa đơn làm thêm trên Desk | Đơn đang chờ HR mà sửa ngày, khung giờ, hình thức hay lý do → quay về chờ trưởng bộ phận duyệt lại. Đơn đã duyệt / từ chối thì không sửa được nhân viên, ngày, khung giờ, hình thức (lý do vẫn sửa được) — cần đổi thì **Huỷ duyệt** rồi khai đơn mới. Xem [HR Overtime Request](HR-Overtime-Request.html) |
| Đơn của trưởng phòng hiện thẳng ở hộp HR | Đúng thiết kế — ngoài chính họ không còn ai duyệt chấm công cho họ (mục 1). Muốn có bước 1 thì khai thêm người duyệt cho phòng hoặc cho hồ sơ nhân viên |
| Nhân viên kêu "trưởng bộ phận duyệt rồi mà chưa có giờ" | Đúng thiết kế — đơn còn chờ HR. Nhãn trên app: *Trưởng bộ phận đã duyệt · chờ HR* |
| Nhân viên kêu "duyệt rồi mà 0 giờ" | Kiểm tra hôm đó có check-out không, check-out có sau giờ tan ca không |
| Duyệt nhầm | Còn chờ HR → báo HR **từ chối** ở bước 2. Đã duyệt xong → tab **Đã duyệt · OT** → **Huỷ duyệt** — xem [mục 5](#5-lỡ-duyệt-nhầm--huỷ-duyệt) |
| Đơn quy đổi Nghỉ bù — duyệt xong còn phải duyệt gì nữa? | Còn **đơn Nghỉ bù** (2 bước Quản lý → HR) khi nhân viên xin nghỉ — xem [Duyệt nghỉ phép](Duyet-Nghi-Phep.html) |

---

## Liên quan
- 🗺️ [Hành trình một phiếu Làm thêm giờ](Hanh-Trinh-OT.html) — toàn cảnh cả quy trình, dùng để giải thích cho nhân viên
- 🔔 [Cài đặt thông báo cho người duyệt](Duyet-Cai-Dat-Thong-Bao.html) — nhận đơn mới, tắt bớt cảnh báo
- [Duyệt nghỉ phép & nghỉ bù](Duyet-Nghi-Phep.html) · [Duyệt chấm công bù](Duyet-Cham-Cong-Bu.html)
- Nhân viên của bạn cần hướng dẫn? Gửi họ [Xin làm thêm giờ](Guide-NhanVien-LamThem.html)
