---
title: "Chi phí (tạm ứng / hoàn ứng)"
layout: default
parent: Chi phí & Tạm ứng
nav_order: 1
---

# Chi phí: tạm ứng / hoàn ứng / claim
{: .no_toc }

**Dành cho:** Nhân viên · **Thời lượng:** ~3 phút
{: .fs-3 .text-grey-dk-000 }

> Đề nghị **tạm ứng**, kê **claim** (chi phí đã chi, có hoá đơn) và **hoàn ứng** phần tiền dư — tất cả
> tạo ngay trên app. **Duyệt và chi/nhận tiền do quản lý + kế toán làm trên Desk** (phiếu chi phí
> **không** hiện trong tab "Cần duyệt" của app).
>
> 🗺️ Muốn hiểu cả vòng đời tiền đi đâu về đâu, ai duyệt bước nào: xem
> **[Hành trình một yêu cầu chi phí](Hanh-Trinh-Chi-Phi.html)**.

---

## 🎬 Video hướng dẫn (1,5 phút)

Xem nhanh cả 3 loại phiếu — tạo Tạm ứng, kê Claim kèm hoá đơn + preview phân bổ, và Hoàn ứng
phần dư (bật tiếng để nghe thuyết minh):

<video src="images/guide/expense/chi-phi.mp4" width="260" controls playsinline poster="images/guide/expense/chi-phi-poster.png"></video>

<details open markdown="block">
  <summary>Mục lục</summary>
{: .text-delta }
1. TOC
{:toc}
</details>

---

## Tab Chi phí — 3 mục

Mở tab **Chi phí** ở thanh dưới. Banner **"KTV đang giữ"** trên cùng là tổng tiền ứng bạn đang cầm
chưa quyết toán:

<img src="images/guide/expense/01-advance-tab.png" width="240" alt="Tab Chi phí — Tạm ứng: Draft chờ duyệt, Paid với nút Claim / Hoàn ứng">

| Mục | Dùng khi | Phiếu đi đâu sau khi gửi |
|---|---|---|
| **Tạm ứng** | Xin ứng trước một khoản (đi công tác, mua vật tư) | Quản lý duyệt → kế toán chi tiền → nhãn `Paid` + *"Đã nhận"* |
| **Claim** | Kê chi phí **đã chi** (có hoá đơn) — tự trừ vào tiền ứng | Người duyệt chi phí Approve → phần vượt ứng được trả thêm |
| **Hoàn ứng** | Trả lại phần tạm ứng còn dư | Kế toán nhận tiền + xác nhận → khoản ứng tất toán |

Nút **➕** góc dưới phải mở nhanh cả 3 loại: **Tạm ứng / Claim / Hoàn ứng**.

---

## A. Tạo Tạm ứng

**➕ → Tạm ứng** → form **"Tạo yêu cầu tạm ứng"**:

<img src="images/guide/expense/02-advance-form.png" width="240" alt="Form Tạo yêu cầu tạm ứng — số tiền, mục đích, Work Order, Service Appointment">

- **Số tiền đề nghị (đ)** — vd 500.000.
- **Mục đích** — ghi rõ, vd *"Mua vật tư sửa chữa máy lạnh"*.
- **Work Order / Service Appointment** *(tuỳ chọn — KTV nên chọn)* — gắn phiếu vào đúng job/công
  trình để kế toán đối chiếu.

Gửi xong phiếu hiện ở tab **Tạm ứng**, nhãn `Draft`. Theo dõi nhãn để biết đến đâu:

| Nhãn | Nghĩa |
|---|---|
| `Draft` | Chờ quản lý duyệt (trên Desk) |
| `Unpaid` | Duyệt rồi, kế toán chưa chi tiền |
| `Paid` | **Đã nhận tiền** — dòng phiếu hiện *"Đã nhận: …đ"* |
| `Claimed` / `Returned` / `Partly Claimed and Returned` | Đã quyết toán (claim hết / hoàn hết / nửa nọ nửa kia) |

> 💡 Số duyệt có thể **thấp hơn số xin** — nhìn *"Đã nhận"* là số thật.

---

## B. Tạo Claim (kê chi phí đã chi)

2 lối vào:

- Tab **Tạm ứng** → dòng khoản ứng `Paid` có nút **Claim** + số *"Có thể claim: …đ"* — dùng lối này
  khi quyết toán một khoản ứng cụ thể;
- hoặc **➕ → Claim**.

Form **"Tạo yêu cầu chi phí"**:

<img src="images/guide/expense/03-claim-form.png" width="240" alt="Form Tạo yêu cầu chi phí — Work Order, dòng chi phí, chứng từ">

1. **Work Order** — **bắt buộc**; chọn thêm **Service Appointment** nếu Work Order có lịch hẹn.
2. **Thêm từng dòng chi phí**: chọn **Loại chi phí** → nhập **Số tiền (đ)** → mô tả (tuỳ chọn).
   Nhiều hoá đơn = nhiều dòng (nút **Thêm dòng**).
3. **Tài liệu, chứng từ** — **bắt buộc ít nhất 1 tệp** (ảnh hoá đơn / PDF, tối đa 10 tệp).
4. Bấm **Preview phân bổ** — app tính **trừ tự động vào các khoản ứng còn dư** (khoản cũ trừ trước)
   và hiện bảng phân bổ + phần **"Còn lại"** (số công ty phải trả thêm). **Phải preview xong nút
   "Gửi yêu cầu" mới bấm được** (khi bạn đang có tạm ứng khả dụng).

   <img src="images/guide/expense/04-claim-allocation.png" width="240" alt="Preview phân bổ — trừ ứng FIFO tự động, tổng chi phí / trừ ứng / còn lại">

5. Bấm **Gửi yêu cầu**.

Danh sách tab **Claim** hiển thị đủ trạng thái:

<img src="images/guide/expense/06-claim-tab.png" width="240" alt="Tab Claim — Draft, Unpaid, Paid, Từ chối">

| Nhãn trên tab Claim | Nghĩa |
|---|---|
| `Draft` | Chờ người duyệt chi phí xử lý trên Desk |
| `Unpaid` | Đã duyệt — chờ kế toán trả phần vượt ứng |
| `Paid` | Xong — đã duyệt + thanh toán đủ |
| `Từ chối` (đỏ) | Bị reject — xem lại hoá đơn/loại chi phí, tạo claim mới |

---

## C. Tạo Hoàn ứng (trả tiền dư)

Khi khoản ứng còn dư sau claim, dòng phiếu hiện **"Cần hoàn: …đ"** (cam):

<img src="images/guide/expense/05-return-form.png" width="240" alt="Form Hoàn ứng — chọn khoản ứng, số tiền tự điền bằng số dư, hình thức hoàn">

1. Bấm **Hoàn ứng** ngay trên dòng đó (hoặc **➕ → Hoàn ứng** rồi chọn khoản ứng trong danh sách) —
   app hiện tóm tắt *Đã ứng / Đã claim / Còn dư* và **tự điền số tiền = số dư**.
2. Sửa **Số tiền hoàn** nếu cần — không vượt được số dư.
3. Chọn **Hình thức hoàn**: **Tiền mặt** / **Chuyển khoản**.
4. Gửi → phiếu Draft nằm ở tab **Hoàn ứng**. **Đưa tiền/chuyển khoản cho công ty** → kế toán xác
   nhận trên Desk thì khoản ứng mới hết treo "Cần hoàn".

---

## ⚠️ Lưu ý & lỗi thường gặp

| Tình huống | Cách xử |
|---|---|
| Tab Chi phí báo **"chưa cấu hình"** | Công ty chưa set tài khoản tạm ứng / phải trả / loại chi phí → báo Kế toán/HR |
| Phiếu nằm `Draft` lâu | Người duyệt xử lý trên **Desk**, không thấy trong tab Cần duyệt của app — nhắc trực tiếp quản lý/kế toán |
| `Unpaid` mãi chưa có tiền | Kế toán chưa làm lệnh chi — hỏi kế toán |
| Không claim được | Khoản ứng phải đang `Paid` và còn *"Có thể claim"*; không có khoản ứng nào thì claim vẫn tạo được — toàn bộ thành khoản công ty trả thêm |
| Nút **"Gửi yêu cầu"** của Claim bị mờ | Chưa bấm **Preview phân bổ** — bấm preview xong mới gửi được. Cũng kiểm tra đã chọn **Work Order** + đính kèm **chứng từ** chưa |
| Claim bị **Từ chối** | Bổ sung hoá đơn / sửa loại chi phí rồi gửi claim mới |
| Hoàn rồi vẫn hiện "Cần hoàn" | Kế toán chưa xác nhận nhận tiền — nhắc kế toán Submit phiếu |

---

## Liên quan
- 🗺️ [Hành trình một yêu cầu chi phí (NV → Duyệt → Kế toán)](Hanh-Trinh-Chi-Phi.html) — toàn cảnh + phía Desk
- [Xin nghỉ phép](Guide-NhanVien-NghiPhep.html) · [Thông báo & Tài khoản](Guide-NhanVien-Taikhoan.html)
