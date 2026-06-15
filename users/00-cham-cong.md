---
title: Chấm công & HR
layout: default
nav_order: 5
has_children: true
---

# Chấm công & HR

Hệ thống chấm công **phone-only** dùng PWA cài trên điện thoại nhân viên. Không phụ thuộc thiết bị phần cứng (ESP32, vân tay, máy chấm công vật lý). Chống cheat đa lớp qua GPS, selfie audit, device fingerprint, kèm các tính năng optional (WiFi BSSID check, WebRTC local IP, WFH approval) có thể bật/tắt qua feature flag.

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
│  - HR Attendance Policy │ ← Feature flags per-Company
│  - Employee Checkin     │ ← Extend HRMS
└─────────────────────────┘
```

## Trang trong nhóm này

- **Tổng quan & Setup** — bắt đầu từ đây
- **HR Attendance Policy** — feature flag per-Company
- **HR Office Location** — danh sách văn phòng
- **HR Checkin Phone Registration** — duyệt phone nhân viên
- **HR WFH Approval** — quy trình duyệt WFH (optional)

## Tài liệu kỹ thuật

Developer / 3rd party xem trong [Tài liệu kỹ thuật → HR Attendance](../tech/HR-Attendance-Tech.html).
