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

**Cơ chế hiện tại:** mỗi lần đăng ký WFH = tạo **Attendance Request** (`reason = "Work From Home"`) qua form **"Đề xuất"** (1 hoặc nhiều ngày). Đơn duyệt **hai bước** — trưởng bộ phận rồi HR, như đơn nghỉ phép. Khi HR duyệt bước cuối (submit AR), HRMS tự tạo bản ghi Attendance status `Work From Home` cho ngày đó.

> doctype cũ **HR WFH Approval** đã bị bỏ — không còn endpoint `approve_wfh` / `reject_wfh` / `get_pending_for_me`. Mọi tham chiếu tới doctype này trong tài liệu/code cũ là lịch sử.

---

## 2. Đăng ký WFH (nhân viên)

Nhân viên đăng ký qua PWA → mở form **"Đề xuất"** → chọn loại **WFH**:

1. Mở form **Đề xuất** (FAB tab **Bảng công**, hoặc link "Đề xuất chấm công bù" dưới nút chấm công tab **Chấm công**) → chọn **WFH** (chỉ hiện khi bật `enable_wfh_mode`)
2. Chọn **ngày** WFH + nhập **địa điểm** (nhãn) + **lý do**
3. Submit → app gọi `api.attendance_request.create_attendance_request` (reason=Work From Home):
   - Tạo Attendance Request 1 ngày (`from_date = to_date = ngày chọn`), `reason = "Work From Home"`, `docstatus = 0`
   - Nếu đã có AR WFH chưa hủy cho đúng ngày đó → trả `status = "exists"` (không tạo trùng)
4. PWA hiển thị *Chờ trưởng bộ phận duyệt*, rồi *Chờ HR duyệt* khi trưởng bộ phận đã duyệt

Danh sách đơn WFH của NV lấy qua `api.wfh.get_my_requests` (lọc các AR có `reason = "Work From Home"`).

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
| `custom_approval_state` | Khi `docstatus = 0`: *Pending Manager* (chờ trưởng bộ phận) / *Manager Approved* (chờ HR) |

Nhãn địa điểm lưu ở custom field `custom_work_location_label` trên Attendance Request (xem `fixtures/custom_field.json`). Field này chỉ dùng audit + báo cáo, không enforce GPS.

---

## 4. Quy trình duyệt

WFH duyệt **chung cơ chế với chấm công bù** — qua tab **"Cần duyệt"** trên my-workspace.

1. **Trưởng bộ phận** mở PWA → tab **"Cần duyệt"** → thấy đơn *Chờ trưởng bộ phận duyệt* → review
   ngày + lý do + địa điểm → **Duyệt (Trưởng bộ phận)** (`action = "Manager Approve"`). Đơn vẫn là
   nháp, chuyển sang *Chờ HR duyệt*, HR được báo.
2. **HR** (người duyệt cuối ở `HR Policy`) → tab **"Cần duyệt"** → **Duyệt (HR)** (`action = "Submit"`)
   → `doc.submit()` → HRMS tự tạo Attendance status `Work From Home` cho ngày đó.
3. **Từ chối** ở bước nào cũng được (`action = "Manager Reject"` / `"HR Reject"`, bắt buộc lý do) →
   đơn nháp bị **xoá**, nhân viên nhận lý do.

> Phân quyền: người duyệt bước 1 là **`shift_request_approver`** của nhân viên (trên Employee hoặc
> bảng Department Approver) — không phải `leave_approver`. HR Manager / System Manager được bước vào
> thay ở bước này. Bước cuối là người duyệt cuối của `HR Policy` (hoặc System Manager). Chi tiết:
> [Duyệt chấm công bù](Duyet-Cham-Cong-Bu.html).

---

## 5. Check-in WFH (GPS / selfie)

Check-in WFH (GPS + selfie) **vẫn là phần custom của app** (xem `api.attendance.checkin_wfh`), chỉ đổi điều kiện gate sang **Attendance Request WFH đã duyệt**:

1. Sáng ngày WFH, NV mở PWA
2. Server check có Attendance Request `reason = "Work From Home"`, đúng ngày, `docstatus = 1` không
3. Nếu có → cho phép "Bắt đầu ca WFH" → GPS audit (không enforce radius) + selfie nếu Policy bật `enable_selfie_capture`
4. Nếu không có AR WFH duyệt → check-in WFH bị từ chối, hướng dẫn NV đăng ký WFH trước

> ⚠️ **"Đã duyệt" ở đây là HR đã duyệt bước cuối** (`docstatus = 1`). Trưởng bộ phận duyệt bước 1
> xong thì nhân viên **vẫn chưa** chấm công WFH được. Đơn WFH cần làm ngay trong ngày thì phải được
> duyệt đủ hai bước trước giờ bắt đầu làm.

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
