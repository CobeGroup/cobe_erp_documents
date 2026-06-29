---
title: HR Push Notification
layout: default
grand_parent: Tài liệu kỹ thuật
parent: Chấm công & HR (kỹ thuật)
nav_order: 11
---

# Thông báo đẩy (Push Notification) — My Workspace

Cho phép gửi **thông báo đẩy** về điện thoại nhân viên (ngay cả khi không mở app)
khi có thông báo mới trong My Workspace: được phân công việc, đơn nghỉ/chấm công được
duyệt, chia sẻ tài liệu...

> **Độc lập với FSM:** push của My Workspace dùng hệ FCM **riêng** (doctype *HR Push
> Settings* + *HR Push Device*), không liên quan tới push của app kỹ thuật viên
> (FSM). Cấu hình 2 bên tách biệt.

---

## Mục lục

1. [Cách hoạt động](#1-cách-hoạt-động)
2. [Cấu hình (HR/Admin) — HR Push Settings](#2-cấu-hình-hradmin--hr-push-settings)
3. [Nhân viên bật thông báo](#3-nhân-viên-bật-thông-báo)
4. [Giới hạn môi trường](#4-giới-hạn-môi-trường)
5. [Xử lý sự cố](#5-xử-lý-sự-cố)

---

## 1. Cách hoạt động

- Khi hệ thống tạo **Notification Log** cho 1 user (phân công, duyệt đơn, mention...),
  server tự đẩy 1 push qua **Firebase Cloud Messaging (FCM)** tới mọi thiết bị mà
  user đó đã bật thông báo.
- Bấm vào thông báo đẩy → mở thẳng **My Workspace → Thông báo**.
- Token thiết bị chết (gỡ app, hết hạn) sẽ tự bị tắt, không gửi nữa.

---

## 2. Cấu hình (HR/Admin) — HR Push Settings

Vào **Desk → HR Push Settings** (Single doctype). Cần quyền System Manager / HR Manager.

| Trường | Lấy ở đâu |
|---|---|
| Enable Push Notifications | Tick để bật toàn hệ thống |
| Firebase API Key / Auth Domain / Project ID / Messaging Sender ID / App ID | Firebase Console → Project Settings → General → Your apps → SDK config |
| VAPID Key | Firebase Console → Project Settings → Cloud Messaging → Web Push certificates |
| Service Account JSON | Firebase Console → Project Settings → Service accounts → Generate new private key (dán nội dung file JSON) |

> Có thể tạo **Firebase project riêng** cho My Workspace, hoặc dùng lại project đang
> có. Vì cấu hình tách biệt với FSM nên thoải mái chọn.

Sau khi điền xong + Save → nhân viên mới bật được thông báo.

---

## 3. Nhân viên bật thông báo

1. Mở My Workspace → tab **Thêm**.
2. Ở thẻ **"Thông báo đẩy"** bấm **Bật** → trình duyệt hỏi quyền → **Cho phép**.
3. Trạng thái chuyển thành **Đã bật**. Từ đó nhận push kể cả khi không mở app.

Nếu lỡ bấm **Chặn**: phải vào cài đặt trình duyệt (site settings) mở lại quyền
Notifications cho trang, rồi quay lại bấm Bật.

---

## 4. Giới hạn môi trường

- **iOS (iPhone/iPad):** web push **chỉ chạy khi đã "Add to Home Screen"** (cài PWA)
  và iOS ≥ 16.4. Mở trong Safari thường sẽ không nhận push.
- **Webview Zalo Mini App:** thường **không hỗ trợ** web push → mở trên trình duyệt
  thật (Chrome/Safari) hoặc PWA đã cài mới nhận được.
- **Android / Chrome desktop:** hỗ trợ tốt.

---

## 5. Xử lý sự cố

| Hiện tượng | Nguyên nhân / xử lý |
|---|---|
| Không thấy thẻ "Thông báo đẩy" | HR Push Settings chưa bật, hoặc thiết bị không hỗ trợ |
| Bấm Bật báo "Cấu hình Firebase/VAPID chưa đầy đủ" | Thiếu trường trong HR Push Settings — kiểm tra mục 2 |
| Đã bật nhưng không nhận push | Kiểm tra quyền Notifications của trình duyệt; iOS phải cài PWA; xem **Error Log** server nếu service account sai |
| Nhận trùng / sai app | My Workspace và FSM là 2 hệ push riêng — bật ở đâu nhận ở đó |
