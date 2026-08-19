---
title: Trang chủ
layout: default
nav_order: 1
---

# COBE Group — ERP — Tài liệu hướng dẫn

Tài liệu chia làm **3 phần**. Người mới bắt đầu đọc **Phần 1**, rồi sang **Phần 2**
theo đúng công việc của mình. **Phần 3** dành cho kỹ thuật / triển khai.

---

## 🟢 Phần 1 — Làm quen ERP (căn bản)

Dành cho **người lần đầu dùng ERP**: đăng nhập, giao diện **Desk**, khái niệm
**doctype · bản ghi · danh sách · form**, **lọc & sắp xếp**, vòng đời bản ghi
(Draft/Submit/Cancel), phím tắt, dark mode… — có hình minh hoạ trực quan.

→ **[Làm quen ERP (Desk)](users/00-lam-quen-erp.html)**

---

## 🔵 Phần 2 — Hướng dẫn sử dụng các module (end-user)

Giới thiệu từng **module / custom app** và cách dùng trực quan, **bao gồm cả hướng
dẫn xử lý lỗi & dữ liệu sai**.

| Module | Nội dung chính |
|---|---|
| **[Chấm công & HR](users/00-cham-cong.html)** | PWA chấm công phone-only, nghỉ phép & nghỉ bù (cả nửa ngày), WFH, duyệt đơn, báo cáo — theo chủ đề: ⏰ Chấm công · 🌴 Nghỉ phép & Nghỉ bù · ✅ Phê duyệt · 👩‍💼 HR · 🛠️ Quản trị — kèm 🎬 video hướng dẫn |
| **[Chi phí & Tạm ứng](users/00-chi-phi.html)** | Tạm ứng → claim (kèm hoá đơn) → hoàn ứng: nhân viên tạo trên app, duyệt & chi tiền trên Desk |
| **[Marketing & Khách hàng](users/00-marketing.html)** | Coupon khuyến mãi, Loyalty tích điểm, Zalo Mini App · 🔧 *Sửa lỗi liên kết Khách hàng (Lead / Contact / Address)* |
| **[Bán hàng & Đơn hàng](users/00-ban-hang.html)** | Sales Order: vòng đời đơn, 🔧 *các tình huống sửa đơn theo trạng thái* (Update Items, Amend, Close), ràng buộc kho/thanh toán |
| **[Vận chuyển & Giao nhận](users/00-van-chuyen.html)** | Vận đơn, đối tác giao hàng (Viettel Post…), **chuyển kho giữa hai kho qua ĐVVC**, **gửi mẫu nước về lab**, tài khoản ĐVVC & điểm gửi, biên bản bàn giao |
| **[Dịch vụ & Bảo dưỡng](users/00-dich-vu.html)** | **FSMNext**: vòng đời Phiếu công việc & Lịch hẹn, trả vật tư, thu tiền hiện trường, huỷ/tạo lại phiếu · 🔧 *Tự xử lý sự cố (WO kẹt "New"…)* · Tự động phân bổ ticket bảo dưỡng & SIM |
| **[Lương & Thưởng](users/00-compensation.html)** | Overtime, WFH salary, KPI |

> 🔧 **Xử lý lỗi / thông tin sai** nằm ngay trong module liên quan — ví dụ
> *[Sửa lỗi liên kết Khách hàng](users/Sua-Loi-Lien-Ket-Khach-Hang.html)* nằm trong
> **Marketing & Khách hàng**.

---

## 🟣 Phần 3 — Tài liệu kỹ thuật & triển khai

Mô tả sâu **kiến trúc · API · cơ chế · triển khai** của các module/custom app ở
Phần 2. Dành cho **developer / system integrator / 3rd-party vendor**.

→ **[Tài liệu kỹ thuật](tech/00-tech.html)** — API contract, architecture, device key
& rebind (chấm công), compensation, delivery partner, loyalty 3rd-party API…

---

> Một phần hướng dẫn end-user được sinh tự động qua `./sync.sh` từ source các app;
> tài liệu kỹ thuật trong `tech/` biên soạn trực tiếp trong repo này.
