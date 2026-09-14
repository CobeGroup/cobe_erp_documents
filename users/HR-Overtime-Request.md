---
title: HR Overtime Request
layout: default
parent: Lương & Thưởng
nav_order: 3
---

# HR Overtime Request — Đơn làm thêm giờ (góc nhìn HR)

> Doctype của `hr_for_cobegroup` (module Attendance). Mỗi nhân viên **tối đa 1
> đơn/ngày**; một ngày làm thêm **nhiều lần** (xuyên trưa + sau giờ tan ca) thì khai
> **nhiều khung giờ trong cùng một đơn** (bảng con `HR Overtime Request Window`).
> Nhân viên tạo và người duyệt xử lý **trên PWA my-workspace** — trang này dành cho
> HR cần xem/sửa trên Desk và hiểu luồng dữ liệu.
>
> 📱 Hướng dẫn end-user: [Xin làm thêm giờ](Guide-NhanVien-LamThem.html) ·
> [Duyệt đơn làm thêm](Duyet-Lam-Them.html). Cấu hình: [Cấu hình Overtime](HR-Overtime-Settings.html).

---

## Mục lục

1. [Nguyên tắc thiết kế](#1-nguyên-tắc-thiết-kế)
2. [Các field](#2-các-field)
3. [Vòng đời một đơn](#3-vòng-đời-một-đơn)
4. [Đối chiếu chấm công (granted_hours)](#4-đối-chiếu-chấm-công-granted_hours)
5. [Quy đổi Tiền lương → payroll](#5-quy-đổi-tiền-lương--payroll)
6. [Quy đổi Nghỉ bù → Leave Application](#6-quy-đổi-nghỉ-bù--leave-application)
7. [Can thiệp trên Desk](#7-can-thiệp-trên-desk)

---

## 1. Nguyên tắc thiết kế

**Đơn là giấy phép, chấm công là bằng chứng.** Check-out muộn KHÔNG tự thành OT
(auto-attendance vẫn cap `working_hours` về giờ ca chuẩn). Chỉ ngày có đơn
**Approved** mới được công nhận giờ, và tính **theo từng khung giờ** trong đơn —
mỗi loại khung một luật bằng chứng (ngày thường):

| Loại khung | Điều kiện khai | Giờ công nhận |
|---|---|---|
| **Sau giờ tan ca** | Phần khung nằm sau `end_time` của ca | min(giờ check-out thực tế sau ca, tổng khung khai) |
| **Xuyên trưa** | Khung nằm **trọn** trong giờ nghỉ trưa cấu hình (thường 12:00–13:30) — phải khai **đích danh** thành khung riêng | Phần khung được phủ bởi [check-in, check-out] của ngày đó — máy không đo được giờ trưa (giờ nghỉ trưa bị trừ tự động khỏi `working_hours`), nên căn cứ là **có mặt cả ngày + chữ ký người duyệt**, chặn trên bởi chính độ dài giờ nghỉ trưa |
| Trong giờ làm chính thức | — | **0** — bị loại ngay khỏi `expected_hours` lúc tạo đơn (giờ này đã trả lương); khung nằm trọn trong giờ làm bị chặn tạo |

Tổng giờ công nhận không vượt `expected_hours` và không vượt **trần cứng** (ngày
thường 4h / ngày lễ 8h). Bằng chứng buổi tối chỉ nuôi khung tối — trước 09/2026
công thức chỉ đo "check-out − giờ tan ca" nên đơn khai trưa được trả giờ nhờ tối
hôm đó về trễ, và mất trắng nếu về đúng giờ.

Ngày lễ / Chủ Nhật: cả ngày là làm thêm, giờ công nhận = min(`working_hours` thực
tế, giờ khai) — khung giờ chỉ mang tính khai báo. Điều này chặn 2 kiểu lạm dụng:
*nấn ná ở lại thành OT* (không đơn → 0h) và *khai ít làm nhiều tính nhiều* (cap
theo đơn).

---

## 2. Các field

| Field | Kiểu | Ghi chú |
|---|---|---|
| `employee` / `employee_name` / `company` | Link/fetch | NV xin làm thêm |
| `ot_date` | Date | Ngày làm thêm — **unique per employee** (đơn Pending/Approved) |
| `windows` | Table (`HR Overtime Request Window`) | **Các khung giờ trong ngày** — mỗi lần làm thêm một dòng (từ giờ / đến giờ), theo thứ tự, không chồng lấn; chỉ khung cuối được vắt qua nửa đêm. Đơn cũ (trước 09/2026) không có bảng này |
| `from_time` / `to_time` | Time | **Khung gộp** (đầu khung sớm nhất → cuối khung muộn nhất) — tự điền từ bảng khung giờ, giữ cho client cũ; đơn cũ dùng cặp này làm khung duy nhất |
| `expected_hours` | Float | Tự tính từ các khung giờ, **đã loại phần lọt vào giờ làm chính thức** (ngày thường); **12h/ngày** chỉ là ngưỡng validate đầu vào (chặn nhập vô lý). TRẦN thực tế áp lên đơn là **4h ngày thường / 8h ngày lễ** (mặc định) — `cap_ot_hours` cắt giờ về trần lúc tạo đơn, tra theo **ngày làm thêm** trong bảng **Trần OT theo ngày hiệu lực** của `HR Policy` (`HR Policy Overtime Rule`) |
| `payout_type` | Select | **Tiền lương** \| **Nghỉ bù** |
| `reason` | Small Text | Nội dung công việc (bắt buộc) |
| `status` | Select | **Pending** → **Approved** / **Rejected** (không dùng docstatus) |
| `approved_by` / `approved_on` | Link/Datetime | Ai duyệt, lúc nào |
| `attendance` | Link Attendance | Gắn tự động khi đối chiếu |
| `granted_hours` | Float | Giờ được công nhận sau đối chiếu |

Người duyệt = **Shift Request Approver** (trên Employee hoặc Department) — cùng bộ
với Attendance Request, tách khỏi Leave Approver. HR Manager override được.

---

## 3. Vòng đời một đơn

```
NV tạo trên PWA (status=Pending, notify người duyệt)
  → Manager duyệt trên tab Cần duyệt
      ├─ Approve → status=Approved (+ đối chiếu ngay nếu Attendance đã tồn tại)
      └─ Reject  → status=Rejected (notify NV)
  → Ngày làm thêm: Attendance được tạo (auto-attendance hằng giờ)
      → hook đối chiếu → ghi granted_hours + attendance vào đơn
```

- NV tự **huỷ** được đơn khi còn Pending (thành Rejected).
- Đơn cho **ngày quá khứ** chỉ nhận trong hạn khai làm thêm — cột *Hạn khai làm thêm*
  của bảng **Hạn khai theo ngày hiệu lực** trong `HR Policy`, xét theo **ngày làm thêm**
  (xem [Hạn nộp phiếu & ràng buộc](HR-Filing-Deadline.html)); app **chặn khai cho ngày
  tương lai**.
- Tối đa **10 đơn Pending**/NV (chống spam).

---

## 4. Đối chiếu chấm công (granted_hours)

Chạy tự động ở 2 thời điểm (cùng logic — `attendance/overtime.py`):

1. **Attendance được tạo** khi đơn đã Approved → hook `before_save` tính và ghi luôn.
2. **Đơn được Approve muộn** (Attendance đã có) → đối chiếu ngay lúc bấm Duyệt
   (ghi thẳng vào Attendance kể cả đã submit).

Luật tính theo loại khung (xem mục 1). Không có `out_time` (quên check-out) →
granted = 0 cho **mọi** loại khung — khung tối thiếu bằng chứng giờ về, khung trưa
thiếu bằng chứng có mặt; đơn vẫn Approved nhưng không có giờ. Check-out trước giờ
tan ca → khung tối = 0, khung trưa vẫn được tính theo phần có mặt. Cảnh báo *"Làm
thêm sau giờ"* được **tắt** cho ngày có đơn Approved.

> ⚠️ Đối chiếu là phép **tính lại mỗi lần bản Attendance được lưu** (cùng tính chất
> hồi tố như trần OT). Hệ thống không tự quét lại quá khứ — chỉ ngày nào được lưu
> lại (cron chấm công 14 ngày gần nhất, sửa thủ công, đổi lịch nghỉ) mới tính lại,
> và khi đó đơn cũ theo luật mới: đơn khai khung lẫn vào giờ làm chính thức có thể
> **giảm giờ** về đúng phần có bằng chứng, đơn khai đích danh khung trưa được **bù**
> phần trước đây bị bỏ sót. Đo trên bản sao production trước khi triển khai
> (09/09/2026): 31/179 đơn cũ đổi số nếu bị tính lại, phần lớn giảm dưới 1 giờ.

---

## 5. Quy đổi Tiền lương → payroll

Với `payout_type = Tiền lương`, hook ghi vào **Attendance** (field HRMS native):
`overtime_type` (lấy từ [HR Policy → Default Overtime Type](HR-Overtime-Settings.html))
và `actual_overtime_duration = granted_hours`.

Từ đó là luồng **HRMS native**:

```
Attendance (submitted, Present, có overtime_type)
  → Overtime Slip (gom theo kỳ lương; tạo tay hoặc Payroll Entry tự tạo)
  → Additional Salary (component "Lương làm thêm giờ")
  → Salary Slip
```

Tiền = số giờ × đơn giá giờ (theo Overtime Type) × hệ số (thường 1.5 / cuối tuần 2.0 /
lễ 3.0). Chi tiết cấu hình + checklist trước kỳ lương đầu tiên:
[Cấu hình Overtime](HR-Overtime-Settings.html).

---

## 6. Quy đổi Nghỉ bù → Leave Application

Với `payout_type = Nghỉ bù`, đơn **không** vào Overtime Slip (không ra tiền). Thay
vào đó nó là **căn cứ bắt buộc** khi NV xin Nghỉ bù:

**QUỸ GIỜ (từ 09/2026).** `expected_hours` của đơn OT Approved payout Nghỉ bù cộng dồn
vào quỹ giờ Nghỉ bù của nhân viên (`attendance/comp_leave_ledger.py`); đơn nghỉ trừ quỹ:

- **Tỷ giá:** 0,5 ngày = **4h**, 1 ngày = **8h** (`_validate_comp_leave_balance`). Giờ lẻ
  và giờ dư ở lại quỹ — hai buổi 2h và 3h gộp lại đổi được 0,5 ngày.
- Cộng theo `expected_hours` (giờ **đã duyệt**) chứ không `granted_hours`: granted chỉ có
  sau khi Attendance ngày đó được dựng bằng job nền, đòi nó là bắt nhân viên chờ qua đêm.
  Trên prod 11/09/2026 có 54/160 đơn granted = 0 (44 đơn không một lần check-in) — siết
  theo granted sẽ quét sạch quyền của họ không báo trước.
- Giờ chỉ vào quỹ khi **ot_date đã tới**; đơn khai trước nằm chờ.
- `custom_comp_worked_date` **hết bắt buộc**, chỉ còn là ghi chú. Một đơn nghỉ tiêu giờ gom
  từ nhiều ngày, trừ **FIFO theo hạn dùng** (lô sắp hết hạn trước).
- **Hạn dùng:** mỗi lô hết hạn cuối kỳ chứa ngày làm thêm (30/06 / 31/12). Cuối kỳ,
  `scheduled/expire_comp_leave` cắt phần **còn dư** và đặt đơn OT tương ứng thành
  **Expired**; đơn đã tiêu hết giữ nguyên Approved. Làm thêm đúng ngày cắt thì lô sống
  sang kỳ sau. Lô của kỳ đã đóng mà cron **chưa từng cắt** vẫn sống tới mốc kế tiếp.
- HR Manager / HR User / System Manager được **miễn** kiểm quỹ khi tạo thay trên Desk.
  Muốn cộng/trừ quỹ có chứng từ thì dùng **HR Comp Leave Adjustment** (submittable, ghi
  lý do, cộng số dương / trừ số âm).
- Quỹ không đủ → chặn ngay khi NV gửi đơn nghỉ, kèm số giờ còn lại.

Trước 09/2026 điểm quy đổi không có luật — đo toàn bộ đơn active (09/09/2026): 102 đơn =
76,5 ngày nghỉ đối lại 336,9h được công nhận, 53 đơn xin nhiều hơn giờ có. Bản tỷ giá đầu
tiên (09/09) so số ngày xin với đơn OT của ĐÚNG một ngày; nó chặn được duyệt lố nhưng làm
giờ lẻ rơi rụng, nên được thay bằng quỹ giờ ở đây.

Cơ chế Leave Type Nghỉ bù (allow_negative, không trừ lương) giữ nguyên như cũ.

📘 Hướng dẫn vận hành cho HR — xem quỹ, điều chỉnh tay, cắt cuối kỳ:
[Quỹ giờ Nghỉ bù](Desk-HR-QuyNghiBu.html).

---

## 7. Can thiệp trên Desk

HR Manager mở **Desk → HR Overtime Request** khi cần:

| Việc | Cách làm |
|---|---|
| Duyệt thay / sửa duyệt nhầm | Sửa field `status` (Pending/Approved/Rejected) — doctype không submittable nên sửa trực tiếp được |
| Đơn quá hạn khai | HR tạo đơn hộ trên Desk (điền employee, ngày, giờ, payout) rồi set Approved — hook đối chiếu chạy khi có Attendance; nếu Attendance đã có thì sửa `status` qua PWA-approve không được, chạy đối chiếu bằng cách mở đơn và lưu lại hoặc nhờ dev gọi `apply_to_existing_attendance` |
| Kiểm tra giờ đã ghi nhận | Xem `granted_hours` + link `attendance` trên đơn; hoặc mở Attendance xem section **Overtime** |
| Báo cáo OT tháng | List view HR Overtime Request lọc `status=Approved` + khoảng `ot_date`, tổng `granted_hours` |

> ⚠️ **Đừng sửa tay** `overtime_type`/`actual_overtime_duration` trên Attendance trừ
> khi hiểu rõ — Overtime Slip đọc thẳng 2 field này để tính tiền.
