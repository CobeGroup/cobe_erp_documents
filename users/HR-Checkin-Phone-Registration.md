---
title: HR Checkin Phone Registration
layout: default
parent: Chấm công & HR
nav_order: 4
---

# HR Checkin Phone Registration — Duyệt phone nhân viên

> Mỗi nhân viên cần được duyệt **1 lần** cho 1 phone trước khi có thể chấm công. Submittable doctype.
> Tự động được tạo khi nhân viên mở PWA lần đầu.

---

## Mục lục

1. [Tại sao cần](#1-tại-sao-cần)
2. [Cách mở](#2-cách-mở)
3. [Các field](#3-các-field)
4. [Quy trình duyệt](#4-quy-trình-duyệt)
5. [Đổi phone — re-register](#5-đổi-phone--re-register)
6. [Audit khi nghi cheat](#6-audit-khi-nghi-cheat)

---

## 1. Tại sao cần

Để **chống share tài khoản**. Khi 1 nhân viên đã đăng ký phone X → chỉ có phone X mới chấm công được. Nhân viên A login phone B → fingerprint khác → server reject.

Mỗi nhân viên 1 record `HR Checkin Phone Registration` đã submit (status=Active).

---

## 2. Cách mở

- Desk → search "HR Checkin Phone Registration"
- URL: `/app/hr-checkin-phone-registration`
- Filter status=Draft để xem queue chờ duyệt

---

## 3. Các field

### `name` (Random hash)

Auto-gen. Không sửa được.

### `employee` (Link → Employee, **bắt buộc**)

Nhân viên đăng ký. Phải link đến `Employee` có `user_id` = user đang login.

PWA tự fill khi nhân viên mở app lần đầu → user thường không tự sửa field này.

### `device_fingerprint` (Data, **bắt buộc**, read-only)

SHA256 hex string (64 ký tự) sinh từ browser fingerprint:
- userAgent
- screen.width × height
- screen.colorDepth
- timezone
- language

PWA tự sinh và gửi. HR Manager không nhập tay.

### `user_agent` (Small Text, read-only)

User-Agent string của browser. Vd:
```
Mozilla/5.0 (iPhone; CPU iPhone OS 18_2) AppleWebKit/...
```

Giúp HR Manager nhận diện phone (iPhone? Samsung? Brand nào?) trước khi duyệt.

### `status` (Select)

| Value | Ý nghĩa |
|---|---|
| Active | Phone đang được phép chấm công |
| Inactive | Phone bị tạm khóa (nhân viên xin nghỉ, đổi máy) |

Sau khi submit (docstatus=1), status mặc định = Active. Đổi sang Inactive khi cần khóa.

### `docstatus` (built-in)

| Value | Ý nghĩa |
|---|---|
| 0 | Draft — vừa tạo, chờ HR duyệt |
| 1 | Submitted — đã active, phone chấm công được |
| 2 | Cancelled — đã hủy, phone không chấm được nữa |

---

## 4. Quy trình duyệt

### Bước 1: Nhân viên tạo (tự động)

1. Nhân viên mở PWA lần đầu → login Frappe
2. PWA tự gửi `POST phone_device.register_phone` với fingerprint
3. Server tạo record `HR Checkin Phone Registration` ở status=Draft
4. PWA hiển thị "Phone đang chờ HR duyệt"

### Bước 2: HR Manager duyệt

1. Mở danh sách `HR Checkin Phone Registration`, filter docstatus=0 (Draft)
2. Click record → kiểm tra:
   - `employee` đúng nhân viên không?
   - `user_agent` có vẻ là phone của nhân viên đó không (iPhone với username Apple, Samsung với username Samsung, etc.)?
   - Trùng device_fingerprint với người khác không? (filter `device_fingerprint = <value>` xem có record khác — nếu có, **không duyệt** vì có thể share phone)
3. Nếu OK → click **Submit** (status auto = Active)
4. Nếu không OK → click **Delete** (xóa record draft)

### Bước 3: Nhân viên check lại PWA

PWA tự re-check status mỗi lần mở. Khi thấy Active → cho phép tap "Chấm công".

---

## 5. Đổi phone — re-register

Khi nhân viên đổi phone (mất, hỏng, mua mới):

### Bước 1: Cancel record cũ

1. HR Manager mở record cũ của nhân viên → click **Cancel** (docstatus=2)

### Bước 2: Nhân viên đăng ký phone mới

1. Mở PWA trên phone mới → login
2. PWA tự tạo record mới với fingerprint khác → status=Draft
3. HR Manager duyệt lại như quy trình trên

**Lưu ý**: nếu không cancel record cũ trước, hệ thống sẽ có 2 record Active cho cùng employee → conflict, hành vi không xác định. Luôn cancel cũ trước.

---

## 6. Audit khi nghi cheat

### Case 1: Nhân viên báo "không chấm được"

1. Mở record của nhân viên đó
2. Check docstatus:
   - 0 (Draft) → chưa duyệt, submit nếu hợp lệ
   - 1 (Submitted) + status=Active → đáng lẽ work, check log server
   - 1 + status=Inactive → đổi sang Active
   - 2 (Cancelled) → phone đã bị hủy. Hỏi nhân viên có đổi phone không, làm quy trình ở [phần 5](#5-đổi-phone--re-register)

### Case 2: Nghi nhân viên share phone

1. Filter danh sách `HR Checkin Phone Registration` theo `device_fingerprint` của nhân viên A
2. Nếu thấy 2+ record với cùng fingerprint khác nhân viên → **đây là share phone** (hoặc anh em ruột chung phone)
3. Điều tra:
   - Mở các `Employee Checkin` của 2 nhân viên đó
   - So sánh timestamp + GPS + selfie
   - Nếu cùng giờ + cùng GPS + ảnh là cùng 1 người → confirm cheat

### Case 3: Phone không khớp với checkin

1. Mở 1 `Employee Checkin` đáng nghi
2. Lấy `custom_phone_device_fingerprint` của bản ghi đó
3. So sánh với `device_fingerprint` của `HR Checkin Phone Registration` của nhân viên đó
4. Khác nhau = **chấm từ phone không phải phone đăng ký** → cheat hoặc sự cố kỹ thuật

---

## Liên quan

- [HR Office Location](HR-Office-Location.html)
- [HR Attendance Settings](HR-Attendance-Settings.html)
- [Tổng quan & Setup](Cham-Cong-Tong-Quan.html)
