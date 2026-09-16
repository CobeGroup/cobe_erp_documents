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

## 🟠 Phần 1b — Quy trình hợp nhất (xuyên suốt các module)

Dành cho **người cần nắm toàn bộ dây chuyền nghiệp vụ**, không chỉ phần việc của mình: từ khi
khách hàng cung cấp thông tin liên hệ, qua đơn hàng, điều phối, vật tư, giao hàng, thu tiền,
cho tới bảo dưỡng định kỳ và xử lý sự cố — kèm **sơ đồ từng chặng** và **bảng tra cứu ngoại lệ**.

→ **[Quy trình hợp nhất](users/00-quy-trinh.html)**

| Trang | Nội dung |
|---|---|
| [Tổng quan toàn chuỗi](users/Quy-Trinh-Tong-Quan.html) | Quan hệ giữa các chứng từ, bảng đối chiếu tên, phân công vai trò và màn hình, qui mô thực tế từng chặng |
| [Vòng đời một đơn hàng](users/Quy-Trinh-Vong-Doi-Don-Hang.html) | Bám theo một đơn hàng có thật qua mười mốc, từ lúc lập đơn tới lúc sinh lịch bảo dưỡng kỳ sau |
| [1 · Khách tiềm năng → Khách hàng](users/Quy-Trinh-01-Khach-Hang.html) · [2 · Đơn bán hàng](users/Quy-Trinh-02-Don-Hang.html) | Các nguồn khách hàng và trục chính của mọi chứng từ |
| [3 · Điều phối và hiện trường](users/Quy-Trinh-03-Hien-Truong.html) · [4 · Vật tư](users/Quy-Trinh-04-Vat-Tu.html) | Phiếu công việc, lịch hẹn, kho kỹ thuật viên, nghĩa vụ hoàn trả |
| [5 · Giao hàng và thu tiền](users/Quy-Trinh-05-Giao-Hang-Thu-Tien.html) | Hai phương thức giao hàng, hoá đơn, tiền mặt, thu hộ |
| [6 · Bảo dưỡng định kỳ](users/Quy-Trinh-06-Bao-Duong.html) · [7 · Sự cố](users/Quy-Trinh-07-Su-Co.html) | Cơ chế phát sinh đơn hàng mới từ khách hàng hiện hữu; hướng xử lý khi khách hàng báo hỏng |
| [8 · Ngoại lệ, lỗi và bất thường](users/Quy-Trinh-08-Ngoai-Le.html) | Bảng tra cứu theo hiện tượng cho cả tám chặng |

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
