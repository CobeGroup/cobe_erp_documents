---
title: Chấm công & HR
layout: default
nav_order: 5
has_children: true
---

# Chấm công & HR

Hệ thống chấm công **phone-only** dùng PWA cài trên điện thoại nhân viên. Không phụ thuộc thiết bị phần cứng (ESP32, vân tay, máy chấm công vật lý). Chống cheat đa lớp qua GPS + device fingerprint always-on; thêm WiFi BSSID, WebRTC local IP, selfie audit, face match, WFH approval, same-office check-out enforcement — toàn bộ optional, bật/tắt qua feature flag per-Company.

## Mô hình tổng quan

```
┌─────────────────────────┐
│  Phone nhân viên (PWA)  │
│  GPS + Selfie + ...     │
└──────────┬──────────────┘
           │ HTTPS
           ↓
┌─────────────────────────┐
│  Frappe Server          │
│  - HR Office Location   │ ← Multi-office support
│  - HR Phone Reg         │ ← Mỗi phone duyệt 1 lần
│  - HR WFH Approval      │ ← Optional (feature flag)
│  - HR Policy            │ ← Feature flags + Whitelist + Leave (per-Company)
│  - Employee Checkin     │ ← Extend HRMS
└─────────────────────────┘
```

## Trang trong nhóm này

- **Tổng quan & Setup** — bắt đầu từ đây
- **HR Policy** — feature flag + whitelist + lunch break + leave auto-allocation per-Company
- **Holiday & Shift Setup** — cấu hình Holiday List + Shift Type HRMS chuẩn
- **Attendance Request** — xin chấm công bù / WFH / On Duty (1 step Manager duyệt)
- **HR Office Location** — danh sách văn phòng
- **HR Checkin Phone Registration** — duyệt phone nhân viên
- **HR WFH Approval** — quy trình duyệt WFH (optional)
- **HR Leave Setup** — workflow 2 bước (Manager Approve → Submit) + auto-cấp phép + UI tạo Leave từ PWA
- **HR Push Notification** — bật/cấu hình thông báo đẩy (FCM) cho My Workspace
- **HR Wiki Setup** — tạo Frappe Wiki Space "my-workspace" làm hướng dẫn sử dụng PWA

## Truy cập & cài đặt my-workspace (QR)

Nhân viên mở my-workspace để **chấm công** bằng điện thoại tại:

**`https://working.thegioidiengiai.com/my-workspace`**

Quét mã QR dưới đây bằng **camera điện thoại** (hoặc dán link vào trình duyệt):

<img src="images/qr-my-workspace.png" alt="QR my-workspace chấm công" width="240">

### Cài như ứng dụng (PWA) để dùng nhanh
- **iPhone (Safari):** mở link → nút **Chia sẻ** (ô vuông mũi tên) → **Thêm vào MH chính** (Add to Home Screen).
- **Android (Chrome):** mở link → menu **⋮** → **Cài đặt ứng dụng / Thêm vào màn hình chính**.
- Sau khi cài, mở app **"TGDG - MyWorkspace"** từ màn hình chính như app thường.

> Lần đầu mở trên 1 máy: app tự gửi **đăng ký thiết bị** → cần **HR duyệt** mới chấm công được (xem [HR Checkin Phone Registration](HR-Checkin-Phone-Registration.html)). Mỗi nhân viên dùng **1 thiết bị** đã duyệt.

## PWA `/my-workspace` — Cobe self-service

PWA có sẵn các trang chính cho NV:

| URL | Tính năng |
|---|---|
| `/my-workspace/attendance` | Chấm công (Tab Chấm công + Bảng công) |
| `/my-workspace/leave` | Số dư phép + danh sách + form tạo đơn (FAB nút "+") |
| `/my-workspace/salary` | Lương (Phase 2) |
| `/my-workspace/expense` | Chi phí |
| `/my-workspace/more` | Hub (gồm thẻ bật **Thông báo đẩy** — xem HR Push Notification) |
| `/my-workspace/notifications` | Bell icon header → list thông báo (render HTML, chưa đọc highlight, đã đọc mờ, "Đọc tất cả"); có **push** nếu đã bật |

## Tài liệu kỹ thuật

Developer / 3rd party xem trong [Tài liệu kỹ thuật → HR Attendance](../tech/HR-Attendance-Tech.html).
