---
title: Tài liệu kỹ thuật
layout: default
nav_order: 2
has_children: true
---

# 🔧 Tài liệu kỹ thuật — Chấm công & HR

> Tài liệu **chi tiết kỹ thuật** cho HR / System Manager (cấu hình, field, workflow, kiến trúc). Người dùng cuối xem **[Hướng dẫn sử dụng](HD-Index.html)**.

Hệ thống chấm công **phone-only** dùng PWA cài trên điện thoại nhân viên. Không phụ thuộc thiết bị phần cứng. Nhiều lớp kiểm soát (GPS + device fingerprint, tuỳ chọn WiFi BSSID, WebRTC local IP, selfie, face match, WFH approval) — bật/tắt qua feature flag per-Company.

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

> 📱 Cách nhân viên **cài app + quét QR** xem ở **[Hướng dẫn sử dụng → Nhân viên](HD-NhanVien.html)**.

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
