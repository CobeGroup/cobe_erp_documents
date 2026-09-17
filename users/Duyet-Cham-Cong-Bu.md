---
title: "Duyệt chấm công bù — hai bước, từng phiếu & hàng loạt"
layout: default
parent: Phê duyệt
grand_parent: Chấm công & HR
nav_order: 3
---

# Duyệt chấm công bù (Attendance Request) — từng phiếu & hàng loạt
{: .no_toc }

**Dành cho:** Quản lý bộ phận + HR · **Thời lượng:** ~3 phút
{: .fs-3 .text-grey-dk-000 }

> Đơn **"Đề xuất chấm công bù / Công tác"** và đơn **WFH** (Attendance Request) **duyệt HAI BƯỚC**,
> giống đơn nghỉ phép: **trưởng bộ phận** duyệt trước, **HR** duyệt bước cuối. Chỉ khi HR duyệt
> xong, hệ thống mới ghi công. Duyệt **từng phiếu trên app**; HR cần xử **nhiều phiếu một lúc** thì
> làm trên **Desk** (mục C).

<details open markdown="block">
  <summary>Mục lục</summary>
{: .text-delta }
1. TOC
{:toc}
</details>

---

## A. Hai bước duyệt

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
| **1 — Trưởng bộ phận** | **Người duyệt chấm công** của nhân viên — khe **Shift Request Approver** (field trên hồ sơ Employee, hoặc bảng **Shift Request Approver** của Department). HR Manager được bước vào duyệt thay | Ngay khi nhân viên gửi đơn |
| **2 — HR** | HR Manager **có tên trong danh sách người duyệt cuối** ở [Chính sách chấm công](Desk-Admin-Policy.html) của công ty nhân viên — **cùng danh sách** với đơn nghỉ phép và đơn làm thêm. Danh sách trống thì mọi HR Manager duyệt được. System Manager luôn duyệt được | Ngay khi trưởng bộ phận duyệt xong |

Khe **Shift Request Approver** **tách riêng khỏi người duyệt nghỉ phép** (Leave Approver): công ty
có thể để **cùng một người**, hoặc tách — vd đơn nghỉ phép về trưởng phòng, còn đơn chấm công
bù/công tác về điều phối vận hành.

**Hai luật giống hệt đơn nghỉ phép:**

- **Không tự duyệt bước 1 cho đơn của chính mình.** Bước HR thì được.
- **HR bước vào bước 1 vẫn là hai lần duyệt** — một lần cho bước trưởng bộ phận, một lần cho bước HR.

> ⏳ **Trưởng bộ phận duyệt xong, đơn vẫn CHƯA có hiệu lực.** Chưa có công, và với đơn **WFH** thì
> nhân viên **chưa chấm công WFH được** — nút chấm công WFH chỉ mở khi HR đã duyệt. Trong lúc chờ,
> đơn vẫn **tính vào hạn mức số đơn/tháng** như đơn chờ duyệt bình thường.

---

## B. Duyệt TỪNG PHIẾU trên app

Mở **my-workspace → tab Cần duyệt**. Mỗi người chỉ thấy đơn ở **đúng bước của mình**:

- **Trưởng bộ phận** thấy đơn *Chờ trưởng bộ phận duyệt* của **nhân viên do mình duyệt chấm công**
  (được gán là Shift Request Approver của NV hoặc của phòng).
- **HR** thấy đơn *Chờ HR duyệt* của các công ty mình có tên trong danh sách người duyệt cuối — kèm
  dòng *"… đã duyệt bước 1"* cho biết trưởng bộ phận nào đã duyệt.

Đơn hiện loại "Chấm công bù / Công tác" kèm tên + **Mã NV** (mã nhân viên chính; mã hệ thống HR-EMP
hiện phụ bên cạnh trong màn chi tiết), khoảng ngày + lý do:

<img src="images/guide/duyet/05-attendance.png" width="240" alt="Đơn chấm công bù trong tab Cần duyệt — nút Duyệt / Từ chối">

| Đơn đang ở | Nút | Bấm duyệt thì |
|---|---|---|
| *Chờ trưởng bộ phận duyệt* | **Duyệt (Trưởng bộ phận)** · **Từ chối** | Đơn chuyển lên HR, HR nhận thông báo. **Chưa có công** |
| *Chờ HR duyệt* | **Duyệt (HR)** · **Từ chối** | Xong: hệ thống tạo công **Có mặt** (hoặc **WFH**) cho (các) ngày trong đơn |

- **Từ chối** (ở bước nào cũng vậy) → đơn bị xoá; **bắt buộc nhập lý do** mới từ chối được (bỏ trống,
  hệ thống báo *"Vui lòng nhập lý do từ chối."*), và **nhân viên nhận được lý do** kèm thông báo. Ngày
  đó nhân viên **không có công** (kể cả khi đã check-in ngoài VP dựa trên đơn — với KTV hiện trường,
  xem [Guide KTV](Guide-KTV-ChamCong.html)).
- Nhân viên thấy trên Bảng công nhãn *Chờ trưởng bộ phận duyệt* rồi *Chờ HR duyệt*, trước khi ngày đó
  chuyển thành công.

> 📱 App duyệt **từng phiếu một** — phù hợp nhịp hằng ngày (1-2 đơn lẻ tẻ). Cuối tuần/cuối tháng dồn
> nhiều phiếu → dùng Desk bên dưới.

---

## C. Duyệt HÀNG LOẠT trên Desk (HR)

> 🔑 **Chỉ người duyệt cuối mới Submit được.** Submit trên Desk là duyệt **bước cuối** — đơn có hiệu
> lực ngay. Hệ thống chỉ cho HR Manager **có tên trong danh sách người duyệt cuối** của công ty nhân
> viên (hoặc System Manager) bấm. Trưởng bộ phận có role *Attendance Request Approver* vẫn thấy nút
> **Submit** trên Desk, nhưng bấm sẽ bị chặn với thông báo *"Chỉ người duyệt cuối (HR) mới duyệt xong
> được đơn này"* — trưởng bộ phận duyệt bước 1 trên app.

**Bước 1 —** Vào Desk → app **Frappe HR → Shift & Attendance → Attendance Request** (hoặc gõ
"Attendance Request" vào ô Search). Lọc **Status = Draft** và **Bước duyệt = Manager Approved** để
lấy đúng những đơn trưởng bộ phận đã duyệt — thêm lọc **From Date / Department** để rà từng cụm:

<img src="images/desk/hr-ar-bulk-list.png" width="720" alt="List Attendance Request — các đơn Draft chờ duyệt">

**Bước 2 —** **Đọc lý do từng đơn trước khi chọn** (bulk = duyệt không mở chi tiết!). Tick chọn các
đơn muốn duyệt — tick ô đầu bảng để chọn cả trang. Nút **Actions** hiện ra góc phải → chọn **Submit**:

<img src="images/desk/hr-ar-bulk-actions.png" width="720" alt="Chọn 3 đơn — menu Actions với Submit / Cancel / Delete">

**Bước 3 —** Xác nhận **"Submit N documents?" → Yes**. Hệ thống submit lần lượt từng phiếu; phiếu
nào lỗi sẽ báo riêng, các phiếu còn lại vẫn được duyệt:

<img src="images/desk/hr-ar-bulk-confirm.png" width="720" alt="Dialog xác nhận Submit 3 documents">

> ✅ Submit xong, mỗi ngày trong từng đơn được tạo bản ghi công (**Present** — hoặc **WFH** nếu đơn
> WFH) theo ca chuẩn của nhân viên. Nhân viên thấy ngày đó chuyển **"Có mặt"** trên Bảng công.

> 🧾 **Submit đơn chưa qua trưởng bộ phận** (ô *Bước duyệt* là *Pending Manager* hoặc trống — đơn nộp
> trước khi có duyệt hai cấp để trống) = HR làm **luôn cả bước 1**, như HR bước vào bước duyệt quản lý
> của đơn nghỉ. Tên HR được ghi vào ô *Trưởng bộ phận duyệt*. Riêng đơn **của chính HR** thì không bỏ
> qua bước 1 được — phải có trưởng bộ phận duyệt trước. Đây cũng là cách **HR nhập thay** đơn cho
> nhân viên: tạo đơn trên Desk rồi Submit.

---

## D. Từ chối & thu hồi

| Tình huống | Thao tác | Kết quả phía nhân viên |
|---|---|---|
| Từ chối đơn **chưa duyệt xong** (từng phiếu, ở bước nào cũng được) | App: nút **Từ chối** | Đơn bị xoá — ngày không có công, NV nhận lý do |
| Từ chối **nhiều đơn** chưa duyệt | Desk: tick chọn → Actions → **Delete** | Đơn biến mất khỏi Bảng công của NV |
| Thu hồi đơn **đã duyệt nhầm** | Desk: mở đơn (hoặc tick chọn) → **Cancel** | Công "Có mặt" đã tạo **tự gỡ**, ngày trả về trạng thái chưa có công |

Quyền **Cancel** đơn đã duyệt **không đổi** khi có duyệt hai cấp — hai cấp nhằm chặn việc đơn **có
hiệu lực** khi HR chưa ký, còn huỷ chỉ **rút** hiệu lực. Trên thực tế **chỉ HR / System Manager** huỷ
được, từ trước tới nay: huỷ đơn kéo theo huỷ bản ghi công (`Attendance`), mà trưởng bộ phận không có
quyền sửa bản ghi công. Trưởng bộ phận phát hiện nhầm thì báo HR.

> ⚠️ Với KTV: đơn bị từ chối/hủy thì các lần **check-in ngoài VP dựa trên đơn đó mất chỗ dựa** —
> ngày đó vắng toàn bộ. Nếu NV thực tế có đi làm, yêu cầu gửi lại đơn kèm bằng chứng hoặc HR chỉnh
> công tay.

---

## ⚠️ Lỗi thường gặp

| Tình huống | Cách xử |
|---|---|
| Không thấy nút **Submit** trong Actions | Tài khoản thiếu quyền submit — báo quản trị cấp role |
| Bấm **Submit** báo *"Chỉ người duyệt cuối (HR) mới duyệt xong được đơn này"* | Bạn không phải người duyệt cuối của công ty nhân viên. Trưởng bộ phận duyệt bước 1 trên app; HR xem danh sách ở [Chính sách chấm công](Desk-Admin-Policy.html) |
| Bấm **Submit** báo *"Không tự duyệt được đơn của chính mình"* | Đơn của chính bạn chưa qua trưởng bộ phận — nhờ trưởng bộ phận duyệt bước 1 trước |
| HR không thấy đơn trên app | Đơn chưa qua trưởng bộ phận; hoặc bạn không có tên trong danh sách người duyệt cuối của công ty nhân viên |
| Trưởng bộ phận duyệt rồi mà NV vẫn chưa có công | Đúng thiết kế — đơn còn chờ HR. Nhãn trên app: *Chờ HR duyệt* |
| Bulk submit báo lỗi vài phiếu | Mở từng phiếu lỗi xem message (vd ngày đã có công, trùng đơn) — các phiếu khác vẫn duyệt bình thường |
| Quản lý bộ phận không thấy đơn trên app | Kiểm tra đã gán **Shift Request Approver** chưa — field trên **Employee** (Approvers) hoặc bảng **Shift Request Approver** của **Department**. Lưu ý khe này **tách khỏi Leave Approver** (duyệt nghỉ phép) — gán duyệt phép thôi là **chưa đủ**. Đơn đã qua bước 1 cũng không còn hiện với trưởng bộ phận |
| Người duyệt không thấy tab **Cần duyệt** | Thiếu role **Attendance Request Approver** (hoặc Leave Approver nếu kiêm duyệt phép) — báo quản trị cấp role |
| Bấm **Duyệt** báo *"does not have doctype access via role permission"* | Thấy được đơn nhưng thiếu quyền duyệt: user chưa có role **Attendance Request Approver**. Leave Approver chỉ đủ để **thấy** tab, không đủ để duyệt chấm công bù — báo quản trị cấp role (xem [Cấp phép](Desk-HR-CapPhep.html), mục B2 bước 3) |
| HR duyệt rồi mà NV chưa thấy "Có mặt" | Bảo NV kéo làm mới Bảng công; vẫn thiếu → xem đơn đã Submitted chưa |
| Duyệt nhầm người / nhầm ngày | Desk → mở đơn → **Cancel** — công tự gỡ, không cần sửa tay |

---

## Liên quan

- 🗺️ [Hành trình một Đề xuất chấm công bù](Hanh-Trinh-Cham-Cong-Bu.html) — toàn cảnh, theo chân 1 đề xuất
- 👔 [Duyệt nghỉ phép & nghỉ bù (Manager + HR)](Duyet-Nghi-Phep.html) — flow duyệt từng phiếu đầy đủ
- 🔧 [KTV hiện trường: Chấm công ngoài VP](Guide-KTV-ChamCong.html) — vì sao KTV tạo các đơn này
- 👤 [Chấm công ngoài VP & Đề xuất chấm công bù (NV)](Guide-NhanVien-ChamCongNgoai.html) — phía người gửi đơn
- 👩‍💼 [Bảng công tháng](Desk-HR-BangCongThang.html) — kiểm tra kết quả công sau duyệt
