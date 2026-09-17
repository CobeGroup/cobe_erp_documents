---
title: HR WFH Approval
layout: default
grand_parent: Tài liệu kỹ thuật
parent: Chấm công & HR (kỹ thuật)
nav_order: 8
---

# Làm việc từ xa (WFH) — Đăng ký & Duyệt

> **Lưu ý quan trọng:** doctype custom **HR WFH Approval đã DEPRECATED** — không còn dùng trong code.
> WFH giờ nguồn từ **HRMS Attendance Request** với `reason = "Work From Home"`.
> Tài liệu này mô tả luồng WFH hiện hành.

---

## Mục lục

1. [Khi nào dùng](#1-khi-nào-dùng)
2. [Đăng ký WFH (nhân viên)](#2-đăng-ký-wfh-nhân-viên)
3. [Dữ liệu lưu ở đâu](#3-dữ-liệu-lưu-ở-đâu)
4. [Quy trình duyệt](#4-quy-trình-duyệt)
5. [Check-in WFH (GPS / selfie)](#5-check-in-wfh-gps--selfie)
6. [Hủy / từ chối](#6-hủy--từ-chối)

---

## 1. Khi nào dùng

Khi công ty có policy WFH/công tác và muốn track rõ ràng ngày nào nhân viên nào được phép chấm công ngoài VP.

**Cơ chế hiện tại:** mỗi lần đăng ký WFH = tạo **Attendance Request** (`reason = "Work From Home"`) qua form **"Đề xuất"** (1 hoặc nhiều ngày). Khi đơn được duyệt xong (submit AR), HRMS tự tạo bản ghi Attendance status `Work From Home` cho ngày đó. Đơn WFH đi chung chế độ duyệt với chấm công bù — **hiện 1 bước**, bật được 2 cấp (trưởng bộ phận → HR).

> doctype cũ **HR WFH Approval** đã bị bỏ — không còn endpoint `approve_wfh` / `reject_wfh` / `get_pending_for_me`. Mọi tham chiếu tới doctype này trong tài liệu/code cũ là lịch sử.

---

## 2. Đăng ký WFH (nhân viên)

Nhân viên đăng ký qua PWA → mở form **"Đề xuất"** → chọn loại **WFH**:

1. Mở form **Đề xuất** (FAB tab **Bảng công**, hoặc link "Đề xuất chấm công bù" dưới nút chấm công tab **Chấm công**) → chọn **WFH** (chỉ hiện khi bật `enable_wfh_mode`)
2. Chọn **ngày** WFH + nhập **địa điểm** (nhãn) + **lý do**
3. Submit → app gọi `api.attendance_request.create_attendance_request` (reason=Work From Home):
   - Tạo Attendance Request 1 ngày (`from_date = to_date = ngày chọn`), `reason = "Work From Home"`, `docstatus = 0`
   - Đơn trùng ngày bị HRMS chặn khi lưu (endpoint cũ `api.wfh.request_wfh` trả `status = "exists"` —
     PWA hiện không còn gọi)
4. PWA hiển thị *Chờ duyệt* (khi bật 2 cấp: *Chờ HR duyệt* sau khi trưởng bộ phận đã duyệt)

Danh sách đơn của NV (cả công tác lẫn WFH) lấy qua `api.attendance_request.get_my_attendance_requests`.
Endpoint cũ `api.wfh.get_my_requests` (chỉ WFH) vẫn còn nhưng PWA không gọi.

---

## 3. Dữ liệu lưu ở đâu

Đơn WFH là một **Attendance Request**, các field chính:

| Field (Attendance Request) | Ý nghĩa trong luồng WFH |
|---|---|
| `employee` | NV xin WFH (auto từ user hiện tại) |
| `from_date` / `to_date` | Ngày WFH (bằng nhau — 1 ngày/đơn) |
| `reason` = `"Work From Home"` | Đánh dấu đây là đơn WFH |
| `explanation` | Lý do WFH (NV nhập) |
| `custom_work_location_label` | **Nhãn địa điểm** WFH (custom field — vd "Nhà riêng - Quận 7") |
| `docstatus` | 0 = chờ duyệt, 1 = đã duyệt, 2 = đã huỷ (đơn bị từ chối thì bị **xoá**, không nằm ở 2) |
| `custom_approval_state` | Chỉ có nghĩa khi bật 2 cấp và `docstatus = 0`: *Pending Manager* (chờ trưởng bộ phận) / *Manager Approved* (chờ HR). Chỉ đổi qua việc duyệt; sửa nội dung đơn đã *Manager Approved* thì quay về *Pending Manager*. Xem [HR Attendance Request](HR-Attendance-Request.html) |

Nhãn địa điểm lưu ở custom field `custom_work_location_label` trên Attendance Request (xem `fixtures/custom_field.json`). Field này chỉ dùng audit + báo cáo, không enforce GPS.

---

## 4. Quy trình duyệt

WFH duyệt **chung cơ chế với chấm công bù** — qua tab **"Cần duyệt"** trên my-workspace.

**1 bước** (hiện tại): người duyệt chấm công mở PWA → tab **"Cần duyệt"** → review ngày + lý do + địa
điểm → **Duyệt** (`action = "Submit"`) → `doc.submit()` → HRMS tự tạo Attendance status
`Work From Home` cho ngày đó.

**2 cấp** (khi bật):

1. **Trưởng bộ phận** → **Duyệt (Trưởng bộ phận)** (`action = "Manager Approve"`). Đơn vẫn là nháp,
   chuyển sang *Chờ HR duyệt*, HR được báo.
2. **HR** (người duyệt cuối ở `HR Policy`) → **Duyệt (HR)** (`action = "HR Approve"`) → `doc.submit()`.

**Từ chối** ở bước nào cũng được (bắt buộc lý do) → đơn nháp bị **xoá**, nhân viên nhận lý do.

> Phân quyền: người duyệt bước 1 là **`shift_request_approver`** của nhân viên (trên Employee hoặc
> bảng Department Approver) — không phải `leave_approver`. Trên app, đơn ở bước này chỉ hiện với người
> duyệt đó; HR không thấy. Bước cuối là người duyệt cuối của `HR Policy` (hoặc System Manager). Chi tiết:
> [Duyệt chấm công bù](Duyet-Cham-Cong-Bu.html).

---

## 5. Check-in WFH (GPS / selfie)

Check-in WFH (GPS + selfie) **vẫn là phần custom của app** (xem `api.attendance.checkin_wfh`), chỉ đổi điều kiện gate sang **Attendance Request WFH đã duyệt**:

1. Sáng ngày WFH, NV mở PWA
2. Server check có Attendance Request `reason = "Work From Home"`, đúng ngày, `docstatus = 1` không
3. Nếu có → cho phép "Bắt đầu ca WFH" → GPS audit (không enforce radius) + selfie nếu Policy bật `enable_selfie_capture`
4. Nếu không có AR WFH duyệt → check-in WFH bị từ chối, hướng dẫn NV đăng ký WFH trước

> ⚠️ **"Đã duyệt" là đơn đã submit** (`docstatus = 1`). Khi bật 2 cấp, trưởng bộ phận duyệt bước 1
> xong thì nút **chấm công WFH** vẫn chưa mở — nút đó chờ HR duyệt bước cuối.
>
> Lưu ý: nút **chấm công thường** thì khác — hễ có đơn WFH / công tác phủ hôm nay, kể cả đơn **đang
> chờ duyệt**, lần chấm công đó được bỏ qua kiểm tra vị trí (`_remote_request_today`). Hành vi này có
> từ trước khi có duyệt 2 cấp.

---

## 6. Hủy / từ chối

- **Từ chối** (đơn chưa duyệt xong, ở bước nào cũng vậy): tab "Cần duyệt" → **Từ chối** → đơn nháp bị xoá
- **Huỷ đơn đã duyệt** (HR): Desk → mở đơn → **Cancel** (docstatus = 2) — Attendance WFH tự gỡ. Quyền
  huỷ không đổi khi có duyệt hai bước; trên thực tế chỉ HR / System Manager huỷ được, vì huỷ đơn kéo
  theo huỷ bản ghi công mà trưởng bộ phận không có quyền sửa
- Sau khi từ chối / huỷ, nếu cần WFH lại cùng ngày → NV tạo đơn WFH mới (không bị chặn trùng)

---

## Liên quan

- [HR Policy](HR-Policy.html) — cấu hình selfie capture
- [Attendance Request](HR-Attendance-Request.html) — chấm công bù / công tác (cùng cơ chế duyệt)
- [Tổng quan & Setup](Cham-Cong-Tong-Quan.html)
