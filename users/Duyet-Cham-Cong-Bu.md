---
title: "Duyệt chấm công bù — từng phiếu & hàng loạt"
layout: default
parent: Phê duyệt
grand_parent: Chấm công & HR
nav_order: 3
---

# Duyệt chấm công bù (Attendance Request) — từng phiếu & hàng loạt
{: .no_toc }

**Dành cho:** Quản lý bộ phận + HR · **Thời lượng:** ~3 phút
{: .fs-3 .text-grey-dk-000 }

> Đơn **"Đề xuất chấm công bù / Công tác"** và đơn **WFH** (Attendance Request) duyệt theo **cấu
> hình** của công ty:
>
> - **Hiện tại: 1 BƯỚC** — người duyệt chấm công bấm **Duyệt** là xong, hệ thống ghi công ngay.
> - Khi HR bật **Duyệt 2 cấp** (mục E): **trưởng bộ phận** duyệt trước, **HR** duyệt bước cuối, giống
>   đơn nghỉ phép; chỉ khi HR duyệt xong hệ thống mới ghi công.
>
> Duyệt **từng phiếu trên app**; cần xử **nhiều phiếu một lúc** thì làm trên **Desk** (mục C).

<details open markdown="block">
  <summary>Mục lục</summary>
{: .text-delta }
1. TOC
{:toc}
</details>

---

## A. Hai chế độ duyệt

| | **1 bước** *(đang dùng)* | **2 cấp** *(khi bật)* |
|---|---|---|
| Ai duyệt | Người duyệt chấm công của nhân viên | Người duyệt chấm công → **HR** (người duyệt cuối) |
| Duyệt xong bước đầu | **Có công ngay** | **Chưa có công** — chờ HR |
| Tự duyệt đơn của chính mình | Không chặn (như trước) | **Bị chặn** ở bước đầu (không còn ai khác duyệt thì đơn lên thẳng HR) |
| Submit trên Desk | Ai có quyền submit đều bấm được (như trước) | **Chỉ người duyệt cuối** |
| Chấm công WFH mở khi | Người duyệt chấm công duyệt | **HR** duyệt |

Người duyệt chấm công gán qua khe **Shift Request Approver** (field trên hồ sơ Employee, hoặc bảng
**Shift Request Approver** của Department). Khe này **tách riêng khỏi người duyệt nghỉ phép** (Leave
Approver): công ty có thể để **cùng một người**, hoặc tách — vd đơn nghỉ phép về trưởng phòng, còn đơn
chấm công bù/công tác về điều phối vận hành. Trên app, tab **Cần duyệt** chỉ hiện đơn cho đúng người
duyệt chấm công của nhân viên — HR Manager không phải người duyệt thì không thấy, duyệt thay trên Desk
(mục C). Người duyệt cần role **Leave Approver** — đây là role quyết định việc **thấy** tab *Cần duyệt*
(theo `viewer_roles` / `approver_roles` của HR Approval Inbox Settings); thiếu nó thì không thấy đơn, và
khi bật 2 cấp đơn của nhân viên họ lên thẳng HR. Duyệt xong đơn chấm công bù còn cần thêm role
**Attendance Request Approver** (quyền submit / xoá đơn) — thiếu role này thì vẫn thấy đơn nhưng bấm
Duyệt sẽ báo thiếu quyền.

### Khi bật duyệt 2 cấp

```
Nhân viên gửi đơn
      │
      ▼
Chờ trưởng bộ phận duyệt ──từ chối──► Đơn bị xoá, nhân viên nhận lý do
      │ duyệt
      ▼
Chờ HR duyệt ──────────────từ chối──► Đơn bị xoá, nhân viên nhận lý do
      │ duyệt
      ▼
Đã duyệt → hệ thống tạo công "Có mặt" (hoặc "WFH")
```

| Bước | Ai duyệt | Được báo khi nào |
|---|---|---|
| **1 — Trưởng bộ phận** | Người duyệt chấm công của nhân viên — trên app chỉ người này thấy đơn ở bước 1 | Ngay khi nhân viên gửi đơn |
| **2 — HR** | HR Manager **có tên trong danh sách người duyệt cuối** ở [Chính sách chấm công](Desk-Admin-Policy.html) của công ty nhân viên — **cùng danh sách** với đơn nghỉ phép và đơn làm thêm. Danh sách trống thì mọi HR Manager duyệt được. System Manager duyệt thay được, trừ đơn của chính họ (bước cuối của đơn nghỉ cũng đòi role HR Manager) | Ngay khi trưởng bộ phận duyệt xong |

**Ba luật cần nhớ (hai luật đầu giống đơn nghỉ phép):**

- **Không tự duyệt bước 1 cho đơn của chính mình.** Trưởng bộ phận là người duyệt của chính mình thì
  người duyệt khác của phòng duyệt bước 1. Bước HR thì được tự duyệt.
- **Không còn ai khác duyệt bước 1 thì đơn lên thẳng HR** ngay khi gửi, HR nhận thông báo — trường hợp
  trưởng phòng hoặc HR đứng đầu tự là người duyệt chấm công của mình, nhân viên chưa được khai người
  duyệt, hoặc người được khai thiếu role / tài khoản bị khoá; giống đơn nghỉ của quản lý đi thẳng HR. HR đứng đầu tự duyệt được đơn của mình ở bước này. Khai thêm người duyệt cho nhân viên đó
  thì đơn đang chờ tự quay về bước 1.
- **HR không duyệt thay bước 1 trên app.** Người duyệt vắng lâu thì khai thêm người duyệt cho phòng.
  Riêng trên Desk, HR có tên trong danh sách duyệt cuối bấm **Submit** là làm **cả hai bước một lần**
  (mục C) — khác đơn nghỉ phép, nơi HR vẫn phải bấm hai lần.

> ✏️ **Sửa đơn sau khi trưởng bộ phận đã duyệt** (đổi ngày, lý do, loại đơn…) thì đơn **quay về chờ
> trưởng bộ phận duyệt lại** — HR chỉ duyệt đúng nội dung trưởng bộ phận đã xem. Ô *Bước duyệt* chỉ đổi
> qua việc duyệt; sửa tay trên Desk hay gọi API đều không đổi được.

> ⏳ **Trưởng bộ phận duyệt xong, đơn vẫn CHƯA có hiệu lực.** Chưa có công, và với đơn **WFH** thì
> nhân viên **chưa chấm công WFH được** — nút chấm công WFH chỉ mở khi HR đã duyệt. Trong lúc chờ,
> đơn vẫn **tính vào hạn mức số ngày khai bù/tháng** như đơn chờ duyệt bình thường.

---

## B. Duyệt TỪNG PHIẾU trên app

Mở **my-workspace → tab Cần duyệt**. Bạn thấy đơn của **nhân viên do mình duyệt chấm công** (được
gán là Shift Request Approver của NV hoặc của phòng). Khi bật duyệt 2 cấp, mỗi người chỉ thấy đơn ở
**đúng bước của mình** — HR thấy đơn *Chờ HR duyệt* của các công ty mình có tên trong danh sách người
duyệt cuối, kèm dòng *"… đã duyệt bước 1"* (đơn lên thẳng HR thì không có dòng này).

Đơn hiện loại "Chấm công bù / Công tác" kèm tên + **Mã NV** (mã nhân viên chính; mã hệ thống HR-EMP
hiện phụ bên cạnh trong màn chi tiết), khoảng ngày + lý do:

<img src="images/guide/duyet/05-attendance.png" width="240" alt="Đơn chấm công bù trong tab Cần duyệt — nút Duyệt / Từ chối">

| Nhãn trên thẻ | Chế độ | Nút | Bấm duyệt thì |
|---|---|---|---|
| *Chờ duyệt* | 1 bước | **Duyệt** · **Từ chối** | Xong: hệ thống tạo công **Có mặt** (hoặc **WFH**) |
| *Chờ trưởng bộ phận duyệt* | 2 cấp | **Duyệt (Trưởng bộ phận)** · **Từ chối** | Đơn chuyển lên HR, HR nhận thông báo. **Chưa có công** |
| *Chờ HR duyệt* | 2 cấp | **Duyệt (HR)** · **Từ chối** | Xong: hệ thống tạo công **Có mặt** (hoặc **WFH**) |

- **Từ chối** (ở bước nào cũng vậy) → đơn bị xoá; **bắt buộc nhập lý do** mới từ chối được (bỏ trống,
  hệ thống báo *"Vui lòng nhập lý do từ chối."*), và **nhân viên nhận được lý do** kèm thông báo. Ngày
  đó nhân viên **không có công** (kể cả khi đã check-in ngoài VP dựa trên đơn — với KTV hiện trường,
  xem [Guide KTV](Guide-KTV-ChamCong.html)).
- Khi bật 2 cấp, nhân viên thấy trên Bảng công nhãn *Chờ duyệt* rồi *Chờ HR duyệt*, trước khi ngày đó
  chuyển thành công. Đơn lên thẳng HR thì nhân viên chỉ thấy *Chờ duyệt*. Tắt 2 cấp khi đơn đang *Chờ HR
  duyệt* thì nhãn đó vẫn giữ tới khi đơn được xử, dù đơn đã về hộp của người duyệt chấm công.

> 📱 App duyệt **từng phiếu một** — phù hợp nhịp hằng ngày (1-2 đơn lẻ tẻ). Cuối tuần/cuối tháng dồn
> nhiều phiếu → dùng Desk bên dưới.

---

## C. Duyệt HÀNG LOẠT trên Desk (HR)

> 🔑 **Ai Submit được trên Desk** — Submit là duyệt **xong**, đơn có hiệu lực ngay:
>
> - **1 bước** (đang dùng): ai có quyền submit Attendance Request đều bấm được, như trước — HR User,
>   HR Manager, System Manager, và trưởng bộ phận có role *Attendance Request Approver*.
> - **2 cấp**: chỉ HR Manager **có tên trong danh sách người duyệt cuối** của công ty nhân viên (hoặc
>   System Manager). Trưởng bộ phận vẫn thấy nút **Submit** nhưng bấm sẽ bị chặn với thông báo *"Chỉ
>   người duyệt cuối (HR) mới duyệt xong được đơn này"* — trưởng bộ phận duyệt bước 1 trên app.

**Bước 1 —** Vào Desk → app **Frappe HR → Shift & Attendance → Attendance Request** (hoặc gõ
"Attendance Request" vào ô Search). Lọc **Document Status = Draft** (khi bật 2 cấp: thêm **Bước duyệt = Manager Approved** để lấy đúng những đơn
trưởng bộ phận đã duyệt — đơn lên thẳng HR vẫn ghi *Pending Manager* ở ô này nên không nằm trong bộ lọc,
xem chúng trên app) — thêm lọc **From Date / Department** để rà từng cụm. Ô *Bước duyệt* không hiện
thành cột trên danh sách và chỉ hiện trên form khi đơn còn nháp — đơn đã duyệt không còn bước nào:

<img src="images/desk/hr-ar-bulk-list.png" width="720" alt="List Attendance Request — các đơn Draft chờ duyệt">

**Bước 2 —** **Đọc lý do từng đơn trước khi chọn** (bulk = duyệt không mở chi tiết!). Tick chọn các
đơn muốn duyệt — tick ô đầu bảng để chọn cả trang. Nút **Actions** hiện ra góc phải → chọn **Submit**:

<img src="images/desk/hr-ar-bulk-actions.png" width="720" alt="Chọn 3 đơn — menu Actions với Submit / Cancel / Delete">

**Bước 3 —** Xác nhận **"Submit N documents?" → Yes**. Hệ thống submit lần lượt từng phiếu; phiếu
nào lỗi sẽ báo riêng, các phiếu còn lại vẫn được duyệt:

<img src="images/desk/hr-ar-bulk-confirm.png" width="720" alt="Dialog xác nhận Submit 3 documents">

> ✅ Submit xong, mỗi ngày trong từng đơn được tạo bản ghi công (**Present** — hoặc **WFH** nếu đơn
> WFH) theo ca chuẩn của nhân viên. Nhân viên thấy ngày đó chuyển **"Có mặt"** trên Bảng công.

> 🧾 **Khi bật 2 cấp — Submit đơn chưa qua trưởng bộ phận** (ô *Bước duyệt* là *Pending Manager* hoặc
> trống) = HR làm **luôn cả bước 1**, như HR bước vào bước duyệt quản lý
> của đơn nghỉ. Tên HR được ghi vào ô *Trưởng bộ phận duyệt*. Riêng đơn **của chính HR** thì không bỏ
> qua bước 1 được — phải có trưởng bộ phận duyệt trước (trừ khi ngoài HR đó không còn ai duyệt chấm
> công cho họ: đơn đã ở bước HR ngay từ đầu). Đây cũng là cách **HR nhập thay** đơn cho nhân viên: tạo
> đơn trên Desk rồi Submit.

---

## D. Từ chối & thu hồi

| Tình huống | Thao tác | Kết quả phía nhân viên |
|---|---|---|
| Từ chối đơn **chưa duyệt xong** (từng phiếu, ở bước nào cũng được) | App: nút **Từ chối** | Đơn bị xoá — ngày không có công, NV nhận lý do |
| Từ chối **nhiều đơn** chưa duyệt | Desk: tick chọn → Actions → **Delete** | Đơn biến mất khỏi Bảng công của NV — **không** kèm lý do và **không** có thông báo (khác nút Từ chối trên app); báo nhân viên bằng kênh khác |
| Thu hồi đơn **đã duyệt nhầm** | Desk: mở đơn (hoặc tick chọn) → **Cancel** | Công "Có mặt" đã tạo **tự gỡ**, ngày trả về trạng thái chưa có công |

Quyền **Cancel** đơn đã duyệt **không đổi** khi có duyệt hai cấp — hai cấp nhằm chặn việc đơn **có
hiệu lực** khi HR chưa ký, còn huỷ chỉ **rút** hiệu lực. Trên thực tế **chỉ HR / System Manager** huỷ
được, từ trước tới nay: huỷ đơn kéo theo huỷ bản ghi công (`Attendance`), mà trưởng bộ phận không có
quyền sửa bản ghi công. Trưởng bộ phận phát hiện nhầm thì báo HR.

> ⚠️ Đơn bị từ chối / huỷ thì các lần **check-in ngoài VP dựa trên đơn đó mất chỗ dựa** — ngày đó
> không có công (kể cả bản ghi công đã lỡ sinh cũng bị thu hồi). Nhân viên **được thông báo đích danh
> ngày bị rút công**, kể cả khi huỷ trên Desk. Hai trường hợp **không** bị ảnh
> hưởng: nhân viên có lần quẹt **tại văn phòng** trong ngày (hệ thống đối chiếu toạ độ chứ không chỉ
> nhãn), và nhóm được HR mở quyền **quẹt mọi nơi** (KTV / Sales) — lần quẹt của họ vốn hợp lệ không
> cần đơn. Nếu NV thực tế có đi làm mà ngày vẫn trống, yêu cầu gửi lại đơn kèm bằng chứng hoặc HR
> chỉnh công thủ công.

### Duyệt đơn cho hôm nay / ngày tới ≠ cấp công

Đơn nộp cho **hôm nay hoặc ngày tới** là đơn xin phép **chấm công ngoài văn phòng**, không phải đơn
xin công. Duyệt đơn loại này chỉ mở quyền chấm công ở ngoài cho nhân viên; ngày đó **chỉ có công nếu
nhân viên thật sự chấm công ít nhất một lần**. Không có lần chấm công nào thì sáng hôm sau hệ thống
gỡ ngày công đó và báo cho nhân viên.

Vì vậy:

- Nhân viên có đi làm nhưng quên chấm công **ngày đã qua** thì phải gửi **đơn khai bù** (chọn đúng
  ngày đã qua) — đó mới là loại đơn cấp công, và là loại bị hạn mức tháng.
- Duyệt muộn một đơn xin chấm công ngoài văn phòng cho ngày đã qua **không** cứu được ngày đó nếu
  nhân viên không chấm công lần nào: hệ thống gỡ công ngay tại thời điểm duyệt.
- Luật này chỉ áp cho ngày **kể từ khi tính năng lên hệ thống** trở đi, không tính ngược về trước.

---

---

## E. Bật / tắt duyệt 2 cấp (HR / quản trị)

Chế độ duyệt đặt **theo từng loại đơn**, ở Desk → **HR Approval Inbox Settings** → bảng **Inbox
Doctypes** → dòng **Attendance Request** → cột **Duyệt 2 cấp**:

| Cột *Duyệt 2 cấp* | Chế độ |
|---|---|
| ☐ bỏ tick *(đang dùng)* | **1 bước**, như trước 09/2026 |
| ☑ tick | **2 cấp** — trưởng bộ phận → HR |

Bấm **Save** là có hiệu lực ngay, không cần deploy hay restart. Bỏ tick cột **Enabled** (ẩn loại đơn
khỏi tab Cần duyệt để duyệt hoàn toàn trên Desk) **không** làm mất công tắc này — chế độ vẫn theo cột
*Duyệt 2 cấp*. Cột này đặt riêng cho từng dòng: dòng
**HR Overtime Request** (làm thêm giờ) có công tắc riêng — hiện đang **bật**. Đơn nghỉ phép luôn 2 cấp
theo workflow nên dòng *Leave Application* không có cột này.

**Đổi chế độ khi đang có đơn chờ:**

- **2 cấp → 1 bước:** đơn đang *Chờ HR duyệt* quay lại hộp duyệt của **trưởng bộ phận** với nhãn *Chờ
  duyệt*; trưởng bộ phận bấm **Duyệt** là xong.
- **1 bước → 2 cấp:** đơn chưa ai duyệt bắt đầu đi 2 bước từ *Chờ trưởng bộ phận duyệt*.

---

## ⚠️ Lỗi thường gặp

| Tình huống | Cách xử |
|---|---|
| Không thấy nút **Submit** trong Actions | Tài khoản thiếu quyền submit — báo quản trị cấp role |
| *(2 cấp)* Bấm **Submit** báo *"Chỉ người duyệt cuối (HR) mới duyệt xong được đơn này"* | Bạn không phải người duyệt cuối của công ty nhân viên. Trưởng bộ phận duyệt bước 1 trên app; HR xem danh sách ở [Chính sách chấm công](Desk-Admin-Policy.html) |
| *(2 cấp)* Bấm **Submit** báo *"Không tự duyệt được đơn của chính mình"* | Đơn của chính bạn chưa qua trưởng bộ phận — nhờ trưởng bộ phận duyệt bước 1 trước |
| *(2 cấp)* HR không thấy đơn trên app | Đơn chưa qua trưởng bộ phận; hoặc bạn không có tên trong danh sách người duyệt cuối của công ty nhân viên |
| *(2 cấp)* Trưởng bộ phận duyệt rồi mà NV vẫn chưa có công | Đúng thiết kế — đơn còn chờ HR. Nhãn trên app: *Chờ HR duyệt* |
| Không rõ công ty đang dùng chế độ nào | Xem mục E — cột **Duyệt 2 cấp** của dòng *Attendance Request* |
| Bulk submit báo lỗi vài phiếu | Mở từng phiếu lỗi xem message (vd ngày đã có công, trùng đơn) — các phiếu khác vẫn duyệt bình thường |
| Quản lý bộ phận không thấy đơn trên app | Kiểm tra đã gán **Shift Request Approver** chưa — field trên **Employee** (Approvers) hoặc bảng **Shift Request Approver** của **Department**. Lưu ý khe này **tách khỏi Leave Approver** (duyệt nghỉ phép) — gán duyệt phép thôi là **chưa đủ**. Khi bật 2 cấp, đơn đã qua bước 1 cũng không còn hiện với trưởng bộ phận |
| Người duyệt không thấy tab **Cần duyệt** | Tab hiện theo role **Leave Approver** / HR Manager / System Manager (cột *viewer_roles* ở mục E). Chỉ có **Attendance Request Approver** thì không thấy tab — báo quản trị cấp thêm Leave Approver |
| Bấm **Duyệt** báo *"Bạn thiếu quyền duyệt xong đơn chấm công bù…"* | Thấy đơn (có Leave Approver) nhưng thiếu role **Attendance Request Approver** — role đó mới có quyền submit. Nhờ quản trị cấp role, hoặc để HR duyệt trên Desk |
| HR duyệt rồi mà NV chưa thấy "Có mặt" | Bảo NV kéo làm mới Bảng công; vẫn thiếu → xem đơn đã Submitted chưa |
| Duyệt nhầm người / nhầm ngày | Desk → mở đơn → **Cancel** — công tự gỡ, không cần sửa tay |

---

## Liên quan

- 🗺️ [Hành trình một Đề xuất chấm công bù](Hanh-Trinh-Cham-Cong-Bu.html) — toàn cảnh, theo chân 1 đề xuất
- 👔 [Duyệt nghỉ phép & nghỉ bù (Manager + HR)](Duyet-Nghi-Phep.html) — flow duyệt từng phiếu đầy đủ
- 🔧 [KTV hiện trường: Chấm công ngoài VP](Guide-KTV-ChamCong.html) — vì sao KTV tạo các đơn này
- 👤 [Chấm công ngoài VP & Đề xuất chấm công bù (NV)](Guide-NhanVien-ChamCongNgoai.html) — phía người gửi đơn
- 👩‍💼 [Bảng công tháng](Desk-HR-BangCongThang.html) — kiểm tra kết quả công sau duyệt
