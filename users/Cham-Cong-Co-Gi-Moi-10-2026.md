---
title: "Có gì mới — đợt 10/2026"
layout: default
parent: Chấm công & HR
nav_order: 6
---

# Nghỉ bù & đơn nghỉ — có gì mới (đợt 10/2026)
{: .no_toc }

Ứng trước Nghỉ bù, quyết toán nợ cuối năm, và các chốt chặn mới cho đơn nghỉ — cùng những việc phải làm khi đưa lên hệ thống
{: .fs-3 .text-grey-dk-000 }

<details open markdown="block">
  <summary>Mục lục</summary>
{: .text-delta }
1. TOC
{:toc}
</details>

---

## Tóm tắt

| # | Thay đổi | Ai thấy khác biệt | Đọc thêm |
|---|---|---|---|
| ① | **Ứng trước Nghỉ bù**: nhân viên được HR cho phép nghỉ bù **trước** khi quỹ đủ giờ, làm thêm bù lại sau | Nhân viên làm ca, bảo dưỡng, trực · người duyệt · HR | [Xin nghỉ phép & nghỉ bù §4.1](Guide-NhanVien-NghiPhep.html#ung-truoc) · [Quỹ giờ Nghỉ bù §5](Desk-HR-QuyNghiBu.html#ung-truoc) |
| ② | **Quyết toán nợ Nghỉ bù cuối năm**: giờ ứng chưa bù hết tới 31/12 trừ vào **Phép năm**, thiếu nữa thì tính **Nghỉ không lương** | Nhân viên còn nợ · HR · kế toán | [Quỹ giờ Nghỉ bù — Quyết toán](Desk-HR-QuyNghiBu.html#quyet-toan) |
| ③ | Đơn nghỉ phải **đi đủ hai bước duyệt** — không còn submit thẳng từ bước quản lý | Người duyệt, HR | [Duyệt nghỉ phép & nghỉ bù](Duyet-Nghi-Phep.html) |
| ④ | Nhân viên chỉ **xem và sửa** được đơn nghỉ **của mình** hoặc đơn **mình duyệt** | Nhân viên, quản lý | [Hành trình một đơn nghỉ phép](Hanh-Trinh-Nghi-Phep.html) |
| ⑤ | Thêm các chốt **không tự phục vụ** quanh quỹ Nghỉ bù | HR | [Quỹ giờ Nghỉ bù — Sự cố hay gặp](Desk-HR-QuyNghiBu.html#su-co) |
| ⑥ | Nhân viên **không xem được** bảng công, đơn chấm công bù, đơn làm thêm, số dư phép **của người khác** — trừ quản lý và HR | Nhân viên, quản lý dùng Desk | Mục ⑥ bên dưới |
| ⑦ | Ứng dụng chấm công ghi **ai đã duyệt / từ chối / huỷ** từng đơn; màn Làm thêm và tab mới **Đơn bù** chia 4 nhóm | Mọi nhân viên | [Xin làm thêm giờ §4](Guide-NhanVien-LamThem.html) · [Chấm công ngoài VP & đề xuất bù §C](Guide-NhanVien-ChamCongNgoai.html) |

---

## ① Ứng trước Nghỉ bù

Trước đây quỹ giờ Nghỉ bù phải **đủ giờ ngay lúc nộp đơn**. Nhân viên làm ca, bảo dưỡng, trực
thường phải nghỉ một buổi giữa tháng rồi mới có ca làm thêm để bù, nên hay bị chặn.

Nay HR khai được **hạn mức ứng trước** trong **Chính sách chấm công** (`HR Policy`) → tab
**Hạn mức khai bù** → mục **Ứng trước Nghỉ bù**, theo công ty, bộ phận hoặc từng người. Người
được ứng thì quỹ được **âm** tới hạn mức; giờ làm thêm quy đổi Nghỉ bù về sau tự trả vào phần âm.
Không có phiếu ứng riêng — nhân viên vẫn nộp đơn *Nghỉ bù* như thường.

Luật chính:

- **Không có dòng nào = không ai được ứng.** Mặc định khi cập nhật chỉ bộ phận *Dịch vụ - Bảo
  hành* được ứng tối đa **1 ngày**.
- Hạn mức tính trên **tổng** phần âm, không tính riêng từng đơn.
- Hết tháng mà chưa bù đủ thì phần nợ **treo sang tháng sau** và **không ứng thêm** được cho tới
  khi bù hết.
- Đơn cho ngày của **tháng đã qua** không được ứng — quỹ phải đủ giờ.
- Đơn ứng **không vắt qua 31/12** — nghỉ từ cuối năm sang đầu năm sau thì tách hai đơn, để quyết
  toán cuối năm chỉ tính phần thuộc năm cũ.
- Không ai tự khai hạn mức áp cho chính mình, kể cả dòng cả công ty — chỉ System Manager.

Nhân viên thấy hạn mức và số ngày còn xin được ở khung **Quỹ Nghỉ bù** trên ứng dụng. Người
duyệt thấy dòng tóm tắt có thêm **"· ứng trước Xh"** trên đơn ứng.

## ② Quyết toán nợ Nghỉ bù cuối năm

Giờ đã ứng mà tới **31/12** vẫn chưa bù hết thì được quyết toán bằng chứng từ **Quyết toán nợ
Nghỉ bù** (`HR Comp Leave Settlement`). Hệ thống tự lập từ đêm **15/01** năm sau — chờ nửa tháng
để phiếu làm thêm tháng 12 kịp duyệt.

- **Trừ Phép năm** đúng số giờ nợ (8 giờ = 1 ngày phép), trên Phép năm năm mới — tức số phép còn
  lại của năm cũ. Không làm tròn lên 0,5 ngày.
- **Phép năm không đủ** thì phần còn lại ghi thành **Nghỉ không lương** trên chứng từ. Phiếu
  lương **chưa tự đọc** con số này: kế toán khấu trừ theo số trên chứng từ, rồi điền ô *Phiếu
  lương đã khấu trừ* để không trừ hai lần.
- **Huỷ chứng từ** trả lại Phép năm và nợ quay lại quỹ — huỷ **không** xoá nợ.
- Nhân viên nghỉ việc giữa năm: HR lập chứng từ tay, *Loại quyết toán* = *Nghỉ việc*.

## ③ Đơn nghỉ phải đi đủ hai bước duyệt

Đơn nghỉ đi hai bước: **trưởng bộ phận duyệt** → **HR duyệt**. Trước đây ai có quyền submit đơn
nghỉ trên Desk (vai trò *Leave Approver*, *HR User*, *HR Manager*) bấm **Submit** thẳng trên một
đơn còn ở bước quản lý là đơn thành **đã duyệt** — bỏ qua cả hai bước và danh sách người duyệt
cuối, kể cả đơn của chính mình.

Nay submit phải là **một bước chuyển hợp lệ của quy trình duyệt** cho đúng người bấm. Submit thẳng
bị chặn với thông báo *"Đơn nghỉ đang ở bước … — không submit thẳng được"*. Duyệt bằng các nút của
quy trình (trên Desk là các nút duyệt của workflow trên đơn, trên ứng dụng là hộp duyệt) vẫn như cũ.

## ④ Nhân viên chỉ thấy đơn nghỉ của mình

Trước đây tài khoản nhân viên xem được — và sửa được nháp — **đơn nghỉ của mọi người cùng công
ty**, kể cả lý do nghỉ. Nay mỗi người chỉ đụng tới:

| Đơn nghỉ | Được làm gì |
|---|---|
| Đơn **của chính mình** | Xem, sửa nháp, xoá nháp — nhưng **không tự huỷ** đơn đã duyệt của mình |
| Đơn mình là **người duyệt** (*Leave Approver* trên đơn) | Xem, duyệt, từ chối, chuyển, **huỷ đơn đã duyệt** trên Desk — như cũ. Không xoá được đơn của người khác |
| Đơn được **chuyển đích danh** cho mình | Xem và xử lý |
| Đơn mình **đã chuyển đi** cho người khác | Chỉ còn xem lại |
| Đơn được chuyển cho mình và **mình đã duyệt** | Vẫn xem lại được |

Nhân viên **không chia sẻ** (*Share*) được đơn nghỉ của mình cho người khác — chia sẻ là trao quyền
sửa, người được chia sẻ có vai trò *Leave Approver* là bấm duyệt được.

Người duyệt của đơn cũng không còn tự đổi được: nhân viên chỉ chọn được **người duyệt nghỉ trên hồ
sơ** của mình hoặc người duyệt nghỉ của **bộ phận**. Cần đổi người duyệt thì báo HR.

**HR** (*HR Manager*, *HR User*), **System Manager** và **Payroll Officer** không bị giới hạn.
Trưởng bộ phận muốn xem đơn của cả phòng mà không phải người duyệt của các đơn đó thì nhờ HR gán
đúng **người duyệt nghỉ** trên hồ sơ nhân viên.

## ⑤ Các chốt không tự phục vụ quanh quỹ Nghỉ bù

Mỗi lần chỉnh tay quỹ Nghỉ bù đều phải có người thứ hai biết. Đợt này bịt thêm:

- Không ai tự **huỷ** phiếu điều chỉnh quỹ (`HR Comp Leave Adjustment`) trên quỹ của chính mình
  — huỷ một phiếu trừ quỹ là tự xoá nợ.
- Không ai tự huỷ **chứng từ quyết toán** của chính mình — trừ System Manager.
- **Ai duyệt đơn của ai là việc của HR.** Trên hồ sơ nhân viên đã có, chỉ HR đổi được *người duyệt
  nghỉ*, *người duyệt chấm công*, *người duyệt chi phí*, *người quản lý trực tiếp* và ô *Nghỉ phép
  gửi thẳng HR*; bảng người
  duyệt của **bộ phận** cũng chỉ HR sửa. Trưởng bộ phận vẫn **lập hồ sơ người mới** (đặt người duyệt
  lúc lập) và sửa các ô khác như trước.
- Trên **hồ sơ của chính mình**, người không phải HR còn không đổi được tài khoản, bộ phận, công ty,
  ô *Không tự cấp Phép Năm*; và không gắn tài khoản của mình vào hồ sơ người khác.
- **Đơn đã qua bước quản lý duyệt thì không ai ngoài HR sửa được nữa** — kể cả người duyệt bước 1.
  Nhân viên cần đổi thì rút đơn rồi nộp đơn mới. Trước đây sửa được qua Desk / API, HR duyệt thứ
  quản lý chưa từng thấy.
- Ở bước quản lý, chỉ **người duyệt ghi trên đơn** (hoặc người được chuyển đích danh) bấm duyệt /
  từ chối được — có vai trò *Leave Approver* thôi chưa đủ. Người duyệt cũng không *Chuyển duyệt*
  đơn **của chính mình** cho đồng nghiệp.
- Trên hồ sơ **người khác**, người không phải HR không đổi được bộ phận, công ty và tài khoản đăng
  nhập; lập hồ sơ mới không được mang tài khoản đã gắn với hồ sơ khác. **Gộp bộ phận** chỉ HR làm.
- Không ai tự đẩy đơn nghỉ của mình qua bước duyệt bằng cách sửa trạng thái — mọi bước chuyển phải
  là nút của quy trình duyệt, và không tự duyệt đơn của chính mình.
- Ô **chuyển đơn** (người được chuyển, người chuyển, lý do) chỉ nút *Chuyển duyệt* ghi được — sửa
  tay qua Desk hay qua API đều bị bỏ qua, kể cả với HR.
- Đơn đã **từ chối / rút / huỷ** không đổi trạng thái về *Approved* hay *Open* được: thông báo
  *"Đơn đang ở bước … nên không thể mang trạng thái …"* — cần nghỉ thì nộp đơn mới.
- Sửa ngày, bỏ nửa ngày hay bất cứ thay đổi nào làm **số ngày của đơn tăng** đều bị kiểm lại quỹ
  như một lần xin mới — kể cả lúc quản lý bấm duyệt.

---

## ⑥ Nhân viên không xem được chấm công và đơn từ của người khác

Trước đây tài khoản nhân viên trên Desk xem được **bảng công** (`Attendance`) và **đơn chấm công bù /
WFH** (`Attendance Request`) của cả công ty, xem được **số dư phép** của bất kỳ ai; người có vai trò
*Leave Approver* xem được mọi **đơn làm thêm** (`HR Overtime Request`); ai cũng xem được **bảng gán
ca** (`Shift Assignment`) của cả công ty. Nay mỗi người chỉ thấy:

| Ai | Thấy dữ liệu của |
|---|---|
| **HR** (*HR Manager*, *HR User*), **System Manager**, **Payroll Officer** | Cả công ty, như cũ |
| **Quản lý** | Chính mình + người mình quản lý: người có mình là *người duyệt nghỉ* hoặc *người duyệt chấm công* trên hồ sơ, người *báo cáo trực tiếp* cho mình, và cả bộ phận nếu mình nằm trong bảng *người duyệt nghỉ* / *người duyệt chấm công* của bộ phận |
| Nhân viên khác | Chỉ của mình |

Ô **lịch chấm công một năm** trên form hồ sơ nhân viên (Desk) cũng chỉ hiện với người mình được xem —
mở hồ sơ đồng nghiệp vẫn được, nhưng ô lịch để trống.

Ba báo cáo HRMS đọc thẳng dữ liệu cả công ty — *Shift Attendance*, *Employee Leave Balance*, *Employee
Leave Balance Summary* — nay chỉ nhóm HR ở bảng trên mở được. Quản lý xem số liệu người mình quản lý ở *Quỹ Nghỉ bù*
(`COBE Comp Leave Fund`) như trước — nay quỹ cũng tính cả người mình duyệt chấm công và người trong
bộ phận mình duyệt. Ứng dụng chấm công **không đổi**: mỗi người vẫn thấy đủ dữ liệu của mình.

## ⑦ Nhân viên thấy ai đã duyệt, ai đã từ chối

Trên ứng dụng chấm công, mỗi đơn **nghỉ phép**, **làm thêm** và **chấm công bù / WFH** ghi từng bước:
*Quản lý duyệt: …*, *HR duyệt: …*, *HR từ chối: …*, *Huỷ bởi: …* kèm ngày giờ, và lý do từ chối / huỷ.

- Màn **Làm thêm giờ** chia **4 tab** *Chờ duyệt · Đã duyệt · Từ chối · Đã hủy* như màn Nghỉ phép.
- Màn **Chấm công** có thêm tab **Đơn bù** — mọi đề xuất chấm công bù / WFH, cũng 4 tab.
- Đơn chấm công bù **bị từ chối** trước đây bị xoá không dấu vết (lý do chỉ nằm trong thông báo). Nay hệ
  thống giữ lại một bản ghi *Đơn chấm công bị từ chối* (`HR Attendance Request Rejection`) — ai từ chối,
  bước nào, lý do — để nhân viên xem lại. Đơn từ chối **trước** đợt cập nhật thì không có bản ghi này.
- Đơn chấm công bù **đã duyệt rồi bị huỷ** trước đây hiện nhầm là *Từ chối*; nay là *Đã hủy*.

## Khi đưa lên hệ thống

- **Deploy rồi chạy `bench migrate`.** Migrate tạo hai chứng từ mới, bảng *Hạn mức ứng trước Nghỉ
  bù*, ô *Giờ Nghỉ bù ứng trước* trên đơn nghỉ, độ chính xác 5 chữ số cho ô *Leaves to Adjust* của
  `Leave Adjustment`, khai sẵn dòng *Dịch vụ - Bảo hành* = 1 ngày, tạo bảng *Đơn chấm công bị từ chối*
  và thu ba báo cáo số dư phép / chấm công của HRMS về cho HR (mục ⑥, ⑦). Ứng dụng chấm công cũng
  phải lên bản build mới thì mới có tab *Đơn bù* và dòng *ai đã duyệt*.
- **Xem lại bảng *Hạn mức ứng trước Nghỉ bù*** của từng công ty: dòng mặc định có đúng bộ phận,
  đúng số ngày không; bộ phận nào khác cần cho ứng.
- **Báo cho nhân viên bộ phận được ứng** về luật ở mục ①, nhất là luật *nợ treo sang tháng thì
  không ứng thêm* và *hết năm trừ Phép năm*.
- **Báo trưởng bộ phận**: từ đợt này đổi người duyệt trên hồ sơ nhân viên đã có phải nhờ HR; trên
  Desk họ chỉ còn thấy bảng công / đơn từ của người mình quản lý (mục ⑥) — ai thiếu người thì kiểm
  tra *người duyệt nghỉ*, *người duyệt chấm công*, *báo cáo cho* trên hồ sơ nhân viên.
- **Gán người duyệt nghỉ** (*Leave Approver*) cho mọi nhân viên còn trống trên hồ sơ: từ đợt này
  quản lý chỉ thấy đơn mà họ là người duyệt (mục ④); đơn không có người duyệt thì chỉ HR xử lý được.
- Hồ sơ đang tự làm người duyệt của chính mình (*Leave Approver* = tài khoản của chính nhân viên
  đó) giữ nguyên: đơn của họ do HR xử lý. Riêng *HR Manager* vẫn ký được đơn của chính mình ở bước
  HR — đây là ngoại lệ có chủ đích.
- **Trước 15/01 hằng năm**: kiểm tra Phép năm năm mới đã được cấp cho mọi người. Chưa có Phép năm
  năm mới thì chứng từ quyết toán của người đó dừng lại báo lỗi, đêm sau thử lại.
- **Kế toán**: từ kỳ lương tháng 1, đọc danh sách *Quyết toán nợ Nghỉ bù* có *Nghỉ không lương*
  để khấu trừ tay (mục ②).

---

## Liên quan

- [Xin nghỉ phép & nghỉ bù](Guide-NhanVien-NghiPhep.html) · [Hành trình một ngày Nghỉ bù](Hanh-Trinh-Nghi-Bu.html)
- [Duyệt nghỉ phép & nghỉ bù](Duyet-Nghi-Phep.html)
- [Quỹ giờ Nghỉ bù](Desk-HR-QuyNghiBu.html) · [Điều chỉnh số dư phép](Desk-HR-DieuChinhSoDuPhep.html#phieu-quyet-toan)
- [Chính sách chấm công (HR Policy)](Desk-Admin-Policy.html)
- [Có gì mới — đợt 09/2026](Cham-Cong-Co-Gi-Moi-09-2026.html)
