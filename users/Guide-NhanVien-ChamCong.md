---
title: "Cài app & Chấm công"
layout: default
parent: Nhân viên
grand_parent: Chấm công & HR
nav_order: 1
---

# Nhân viên: Cài app & Chấm công
{: .no_toc }

**Dành cho:** Nhân viên · **Thời lượng:** ~3 phút
{: .fs-3 .text-grey-dk-000 }

> Cài my-workspace lên điện thoại và chấm công vào/ra hằng ngày.

```mermaid
%%{init:{'theme':'base','themeVariables':{'fontSize':'15px'}}}%%
flowchart LR
  classDef p fill:#e6f4ff,stroke:#299dd8,color:#0b4a6f;
  A["Quét QR<br/>+ Đăng nhập"] --> B["Đăng ký<br/>thiết bị"] --> C["HR duyệt"] --> D["Chấm công<br/>vào / ra"]
  class A,B,C,D p
```

---

## A. Cài & mở app (làm 1 lần)

**Bước 1 — Quét QR** bằng camera điện thoại (hoặc mở link **[working.thegioidiengiai.com/my-workspace](https://working.thegioidiengiai.com/my-workspace)**), rồi **đăng nhập** bằng tài khoản công ty.

<img src="images/qr-my-workspace.png" width="170" alt="Quét QR my-workspace">

**Bước 2 — Thêm vào màn hình chính** để mở nhanh như app thật:

**📱 iPhone (Safari):** bấm nút **Chia sẻ** (ô vuông có mũi tên ↑, ở thanh dưới) → cuộn xuống bấm **"Thêm vào MH chính"**.

<img src="images/guide/nhanvien/ios-add-home.png" width="220" alt="iPhone: Chia sẻ → Thêm vào Màn hình chính">

**🤖 Android (Chrome):** bấm menu **⋮** (góc trên phải) → bấm **"Cài đặt ứng dụng"** (hoặc "Thêm vào Màn hình chính").

<img src="images/guide/nhanvien/android-add-home.png" width="220" alt="Android: menu ⋮ → Cài đặt ứng dụng">

*Hình trên là minh hoạ giao diện iOS/Android (có thể khác chút theo phiên bản máy).*

> 📎 **Hướng dẫn chính thức:** [Google Chrome — cài app lên màn hình chính](https://support.google.com/chrome/answer/9658361) · [Apple — dùng web app trên iPhone](https://support.apple.com/vi-vn/guide/iphone/iph42ab2f3a7/ios)

> 💡 Sau khi cài, trên màn hình chính sẽ có icon **"TGDG - MyWorkspace"** — mở như app thường, khỏi vào trình duyệt.

---

## B. Đăng ký thiết bị (lần đầu)

**Bước 3** — Lần đầu mở app, bấm **Gửi yêu cầu đăng ký**. Mỗi nhân viên dùng **1 điện thoại** đã duyệt.

<img src="images/guide/nhanvien/01-register-new.png" width="240" alt="Gửi yêu cầu đăng ký thiết bị">

**Bước 4** — Chờ **HR duyệt**. Khi duyệt xong, mở lại app là chấm công được.

<img src="images/guide/nhanvien/02-register-pending.png" width="240" alt="Chờ HR duyệt thiết bị">

---

## C. Chấm công vào / ra (mỗi ngày)

🎬 **Video hướng dẫn** (có giọng đọc):

<video src="images/guide/nhanvien/checkin-flow.mp4" width="260" controls muted playsinline poster="images/guide/nhanvien/03-checkin-ready.png"></video>

**Bước 5** — Mở tab **Chấm công** → bấm nút **Chấm công (Vào)** (màu xanh lá).

<img src="images/guide/nhanvien/03-checkin-ready.png" width="240" alt="Màn chấm công sẵn sàng">

**Bước 6** — App lấy **vị trí** trên bản đồ → bấm **Chụp ảnh** để tự sướng (selfie) → rồi bấm **Check-in**.

<img src="images/guide/nhanvien/04-checkin-confirm.png" width="240" alt="Xác nhận chấm công: bản đồ + ảnh selfie">

> 💡 Ảnh selfie là **bắt buộc** — chưa chụp thì nút **Check-in** chưa bấm được.

**Bước 7** — Thành công ✅ — hiện thông báo **"Check-in thành công lúc 08:00"**.

<img src="images/guide/nhanvien/05-checkin-success.png" width="240" alt="Check-in thành công lúc 08:00">

**Bước 8** — Cuối ca (vd 17:30), bấm nút **Chấm công (Ra)** (màu cam) → xác nhận **Check-out**.

<img src="images/guide/nhanvien/07-checkout-confirm.png" width="240" alt="Xác nhận Check-out lúc 17:30">

---

## D. Nếu bạn là Kỹ thuật viên (KTV)

KTV có thêm **tab FSM** ở thanh dưới — bấm để vào phần **công việc kỹ thuật** (lịch, work order, kho, thanh toán... — app technician).

<img src="images/guide/nhanvien/09-nav-ktv.png" width="240" alt="Nhân viên KTV có thêm tab FSM">

> 💡 Chấm công vẫn làm như mục C ở trên. Tab **FSM** chỉ hiện với KTV, để truy cập công việc hiện trường.

---

## ⚠️ Lỗi thường gặp

Ví dụ báo lỗi khi đứng **ngoài vùng văn phòng**:

<img src="images/guide/nhanvien/06-checkin-error.png" width="240" alt="Lỗi ngoài vùng văn phòng">

| Hiện tượng | Cách xử |
|---|---|
| "Thiết bị chưa đăng ký" | Chờ HR duyệt, hoặc báo HR nếu đã lâu |
| "Ngoài vùng văn phòng (cách Nm)" | Đứng trong khu vực VP rồi chấm lại; làm ngoài → cần đơn WFH/On Duty đã duyệt |
| Không bấm được nút | Kiểm mạng + bật quyền **Vị trí** cho trình duyệt |
| Đổi điện thoại | Đăng ký máy mới + báo HR duyệt lại |

---

## Liên quan
- [Xin nghỉ phép](HR-Leave-Setup.html) · [Đăng ký thiết bị (chi tiết)](HR-Checkin-Phone-Registration.html)
