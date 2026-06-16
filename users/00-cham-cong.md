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
- **HR Leave Setup** — workflow 2 bước + auto-cấp phép theo working_hours

## Tài liệu kỹ thuật

Developer / 3rd party xem trong [Tài liệu kỹ thuật → HR Attendance](../tech/HR-Attendance-Tech.html).
