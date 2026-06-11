---
title: HR Attendance Settings
layout: default
parent: Chấm công & HR
nav_order: 2
---

# HR Attendance Settings — Feature flag toàn cục

> Single doctype (chỉ có 1 record duy nhất). Là **bộ điều khiển trung tâm** cho toàn bộ feature optional.
> Permissions: **HR Manager** và **System Manager**.

---

## Mục lục

1. [Cách mở](#1-cách-mở)
2. [Các field](#2-các-field)
3. [Kịch bản bật/tắt theo giai đoạn](#3-kịch-bản-bậttắt-theo-giai-đoạn)
4. [Lưu ý vận hành](#4-lưu-ý-vận-hành)

---

## 1. Cách mở

- Desk → search bar gõ "HR Attendance Settings"
- Hoặc URL: `/app/hr-attendance-settings`

---

## 2. Các field

### `enable_wfh_mode` (Check, default: 0 = off)

Bật cho phép nhân viên chấm công từ xa (Work From Home / công tác). Khi bật:
- PWA hiển thị nút "Đăng ký WFH" cho nhân viên
- Manager nhận request, duyệt qua doctype [HR WFH Approval](HR-WFH-Approval.html)
- Endpoint `attendance.checkin_wfh` được kích hoạt

Khi tắt:
- Mọi request `checkin_wfh` trả lỗi `WFH_NOT_ENABLED`
- Nhân viên buộc phải chấm công tại VP (GPS radius enforce)

**Khi nào bật**: sau khi đã quyết định policy WFH của công ty và đã training manager cách duyệt request.

---

### `enable_webrtc_check` (Check, default: 0 = off)

Bật kiểm tra **WebRTC local IP** của phone — defend chống fake GPS trên iOS. Khi bật, PWA thu thập IP local của phone (trên LAN VP) và gửi kèm checkin. Server kiểm tra IP có thuộc subnet đã enroll trong `HR Office Location → allowed_lan_subnets` hay không.

Khi tắt:
- PWA không thu thập IP local
- Server không kiểm tra `webrtc_local_ip` dù request có gửi

**Yêu cầu trước khi bật**:
1. Đã xác định subnet wifi nhân viên ở từng VP (vd `192.168.10.0/24`)
2. Đã enroll subnet vào tất cả `HR Office Location` đang active
3. Test thử: chấm công từ phone đang ở VP → phải reach được PWA, IP phải khớp subnet

→ Bật từng giai đoạn theo VP nếu chưa verify hết.

---

### `enable_wifi_bssid_check` (Check, default: 0 = off)

Bật kiểm tra **WiFi BSSID** (MAC của router) của phone — defend chống fake GPS trên Android. Khi bật, PWA cố lấy BSSID (chỉ Android hỗ trợ, iOS Safari block) và gửi kèm checkin. Server kiểm tra trong list `HR Office Location → allowed_wifi_bssids`.

Khi tắt: server không check BSSID dù request có gửi.

**Yêu cầu trước khi bật**:
1. Đã thu thập danh sách BSSID của tất cả router wifi nhân viên dùng (vd có 5 router trên 3 tầng → 5 BSSID)
2. Đã enroll BSSID vào `HR Office Location → allowed_wifi_bssids`
3. Lưu ý: chỉ defend được Android. iPhone luôn skip layer này.

---

### `enable_face_match` (Check, default: 0 = off)

**Phase 2** — chưa implement trong phase 1. Khi bật phase 2: server gọi face recognition API (server-side Python lib hoặc cloud) so sánh selfie ↔ ảnh nhân viên trong `Employee → Personal Details`.

Hiện tại bật flag không có tác dụng — chỉ là chỗ giữ chỗ.

---

### `default_radius_m` (Int, default: 100)

Bán kính GPS check mặc định **nếu** `HR Office Location` không đặt `allowed_radius_m` riêng. Đơn vị: mét.

VP nhỏ (1 tòa nhà): `100m` đủ. VP campus lớn (nhiều block): `200-300m`. Trường hợp đặc biệt mỗi VP có thể override.

---

### `duplicate_window_seconds` (Int, default: 60)

Chặn nhân viên chấm liên tục trong N giây. Nếu vừa chấm xong < 60s mà chấm lại → reject với error `DUPLICATE_CHECKIN`.

Tăng (vd 120s) nếu muốn chống vô tình tap 2 lần. Giảm (vd 30s) nếu nhân viên hay quên + cần chấm lại nhanh.

---

## 3. Kịch bản bật/tắt theo giai đoạn

### Tuần 1 — Pilot 1 VP (5-10 người)

```
enable_wfh_mode:         off
enable_webrtc_check:     off
enable_wifi_bssid_check: off
enable_face_match:       off
default_radius_m:        100
duplicate_window_seconds: 60
```

Chỉ check GPS + selfie + fingerprint + duplicate. Mục tiêu: xác nhận PWA chạy ổn, nhân viên quen UX.

### Tuần 2-3 — Mở rộng 3-5 VP

```
enable_wifi_bssid_check: on    (sau khi enroll BSSID cho từng VP)
```

Bật BSSID check vì Android chiếm đa số. iOS user vẫn chỉ có GPS audit.

### Tháng 2 — Bật WebRTC + WFH

```
enable_webrtc_check: on    (sau khi enroll subnet cho từng VP)
enable_wfh_mode: on        (sau khi có policy WFH chính thức)
```

WebRTC defend iOS GPS spoof. WFH enable cho nhân viên có lịch làm từ xa.

### Tháng 3+ — Face match (phase 2)

```
enable_face_match: on   (sau khi implement phase 2)
```

---

## 4. Lưu ý vận hành

- **Flag tắt KHÔNG xóa data** — vd tắt `enable_wifi_bssid_check` chỉ làm server bỏ qua check, BSSID list trong office vẫn còn.
- **Đổi setting có hiệu lực ngay** — không cần restart bench.
- **Không có "audit log" cho việc đổi setting** — recommend chụp screenshot trước/sau khi đổi gửi vào Slack/Telegram nội bộ nếu cần truy vết.
- Nếu khẩn cấp muốn **chặn tất cả chấm công** (sự cố hệ thống) — không có flag tắt toàn bộ trong phase 1. Workaround: tạm `is_active=0` tất cả `HR Office Location` → trả `NO_ACTIVE_OFFICE`.
