---
title: "Tạo nhân sự nhanh (Admin Console)"
layout: default
parent: Quản trị (cấu hình)
grand_parent: Chấm công & HR
nav_order: 6
---

# Tạo nhân sự nhanh (Admin Console)
{: .no_toc }

**Dành cho:** System Manager / HR Manager · **Trang:** Admin Console
{: .fs-3 .text-grey-dk-000 }

> **1 form tạo trọn bộ** khi nhân viên mới vào công ty: **User** (tài khoản đăng nhập) + **Employee** (hồ sơ nhân sự) + **Shift Assignment** (gán ca) — và nếu là **Kỹ thuật viên** thì thêm luôn **FS Service Resource + kho ảo + tài khoản ảo** cho từng công ty. Thay cho việc tạo tay từng thứ ở [Tạo User](Desk-Admin-User.html) rồi [Tạo Employee](Desk-Admin-Employee.html).

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1. Mở trang & quyền sử dụng

- Mở: Desk → Search **"Admin Console"** · URL `/app/admin-console` → tab **Onboarding nhân sự**.
- Ai dùng được: **System Manager** và **HR Manager**.
  - HR Manager chỉ thấy tab **Onboarding nhân sự**.
  - Tab **Công cụ Admin** (chạy script, bật/tắt tính năng) chỉ dành cho System Manager.

![Form Onboarding — tạo nhân sự / kỹ thuật viên](images/desk/admin-console-form.png)

## 2. Điền thông tin

| Trường | Bắt buộc | Ghi chú |
|---|---|---|
| **First / Middle / Last Name** | First | Tên tách 3 phần như Employee chuẩn |
| **Mã NV** | ✔ | Số cuối của mã nhân viên (VD `0416`) → hệ thống tạo **HR-EMP-0416**. Mã do HR cấp, **không tự sinh**. Trùng mã sẽ báo lỗi ngay |
| **Email** | ✔ | Dùng làm **tài khoản đăng nhập** và **Company Email** luôn |
| **Số điện thoại** | KTV: ✔ | Vào Employee + FS Service Resource |
| **Mật khẩu** | — | **Bỏ trống = hệ thống tự sinh mật khẩu mạnh** và hiện 1 lần ở Kết quả. Hoặc bật **"Gửi welcome email"** để nhân viên tự đặt qua mail |
| **Giới tính, Ngày sinh** | ✔ | Employee bắt buộc |
| **Ngày vào làm** | — | Mặc định hôm nay; cũng là ngày bắt đầu gán ca |
| **Công ty chính, Loại NV, Department, Chức danh** | — | Như Employee chuẩn |
| **Shift Type** | — | Chọn ca → tự tạo + submit **Shift Assignment** từ ngày vào làm |
| **Role Profile** | — | Gói quyền. **Tự điền** theo Loại NV / Department (mapping khai ở Settings), sửa được, chọn nhiều được |

> ⚠️ **Role đi theo Role Profile, không gán role lẻ ở đây.** Nếu user đã tồn tại và từng được gán role lẻ bằng tay, khi thêm Role Profile các role lẻ đó sẽ bị hệ thống gỡ — form sẽ hiện **cảnh báo vàng** liệt kê role bị gỡ để bạn gán lại nếu cần.

## 3. Nếu là Kỹ thuật viên

Bật **"Là Kỹ Thuật Viên"** → hiện thêm phần cấu hình:

![Phần cấu hình KTV — homebase, template, chọn công ty](images/desk/admin-console-ktv.png)

- **Homebase** (bắt buộc) — kho/địa bàn xuất phát, VD `Kho Hà Nội`.
- **Công ty** — mọi KTV đều cần kho ảo và tài khoản ảo ở **cả 3 công ty** (Thế Giới Điện Giải, Akanwa, Doctor Nước), vì phiếu dịch vụ và thu tiền có thể phát sinh dưới bất kỳ công ty nào. Vì vậy 3 công ty đã cấu hình được **tick sẵn và khoá**, không bỏ tick được. Mỗi công ty tạo **3 món** đứng tên KTV:
  1. **Kho ảo** `Tên KTV - {viết tắt cty}` (dưới *Technician Group*)
  2. **Tài khoản Cash** `Tên KTV - Cash - {viết tắt cty}` — dùng thu tiền dịch vụ (vào FS Service Resource)
  3. **Tài khoản Stock** `Tên KTV - Stock - {viết tắt cty}` — định giá tồn kho, gắn thẳng vào kho ảo
- Đồng thời tạo **FS Service Resource** (hồ sơ điều phối KTV) link đủ user, employee, kho + tài khoản của từng công ty.
- **Công ty chính** (ở phần thông tin chung) quyết định kho ảo và tài khoản ảo nào được ghi lên hồ sơ Employee; để trống thì lấy theo công ty của Employee.
- 3 ô **template tên** để nguyên mặc định trừ khi biết rõ mình đổi gì.
- Role Profile KTV (`Techinician`) được gán **tự động**.

> Nếu cạnh tên công ty có dấu **⚠** nghĩa là công ty đó chưa được cấu hình parent kho/account trong **Admin Console Settings** — ô này không bị khoá, tick vào thì chỉ link được kho/account có sẵn chứ không tạo mới được. Báo System Manager cấu hình trước.

## 4. Bấm Tạo & đọc kết quả

![Kết quả — mật khẩu tự sinh + danh sách đối tượng đã tạo](images/desk/admin-console-result.png)

- Dòng xanh: User + Employee đã tạo xong.
- **Ô vàng "Mật khẩu tự sinh": chỉ hiển thị đúng 1 lần** — bấm **Copy** và gửi cho nhân viên ngay (khuyên nhân viên đổi mật khẩu sau khi đăng nhập lần đầu).
- Bảng bên dưới liệt kê từng đối tượng với trạng thái:
  - `created` — tạo mới · `linked` — đã có sẵn, dùng lại · `skipped` — bỏ qua vì đã đủ · `warning` — cần chú ý (đọc chi tiết).
- Có thể hiện popup **Message** kiểu *"Username already exists — Suggested Username"* hay *"Removed Employee role…"* — đây là thông báo kỹ thuật của hệ thống, **đóng và bỏ qua**, không ảnh hưởng kết quả.

## 5. Cảnh báo nghi trùng nhân viên

Trước khi tạo, hệ thống dò các Employee có sẵn **trùng SĐT / email / họ tên / ngày sinh / ngày vào làm**:

![Dialog nghi trùng nhân viên](images/desk/admin-console-dup.png)

- Bấm **No** → dừng lại, mở mã nhân viên trong bảng để kiểm tra (bấm vào mã để mở hồ sơ). Nếu đúng là người cũ (VD làm lại sau nghỉ việc, hoặc HR đã import hồ sơ trước) thì **đừng tạo mới** — xử lý trên hồ sơ cũ theo [Tạo & quản lý Employee](Desk-Admin-Employee.html).
- Bấm **Yes** → xác nhận đây là người khác thật, tạo nhân viên **mới**.
- Chỉ trùng *ngày vào làm* đơn thuần (tuyển nhiều người cùng ngày) thì thường là trùng vô hại — đọc cột lý do rồi quyết.

## 6. Chạy lại có sao không?

Không sao — form theo nguyên tắc **có rồi thì dùng lại, chỉ tạo phần còn thiếu, không ghi đè**. Dùng được cho cả nhân viên đã có sẵn User + Employee (ví dụ KTV cũ chưa có đủ kho ảo ở 3 công ty):

| Đối tượng | Đã có sẵn thì |
|---|---|
| **User** | Dùng lại. Chỉ thêm Role Profile còn thiếu. Mật khẩu **không bị đổi** trừ khi bạn chủ động nhập ô Mật khẩu |
| **Employee** | Dùng lại, **không sửa field nào** (phòng ban, chức danh… nhập trên form bị bỏ qua). Nhận diện qua email đăng nhập: Employee phải đang gắn **User ID** = email nhập vào |
| **Shift Assignment** | Bỏ qua nếu đã có gán ca cùng loại |
| **Kho ảo / tài khoản ảo** | Công ty nào FS Service Resource đã có dòng thì giữ nguyên kho/tài khoản cũ (kể cả đặt tên theo kiểu cũ). Công ty còn thiếu mới tạo; kho/tài khoản đã tồn tại đúng tên thì link vào, không tạo trùng |
| **FS Service Resource** | **Bổ sung** dòng kho/tài khoản cho công ty còn thiếu và điền các ô đang trống (email, SĐT, homebase); không đụng dòng cũ |

Lỗi giữa chừng → **hủy toàn bộ**, không để lại dữ liệu nửa vời; sửa theo thông báo rồi bấm Tạo lại.

> ⚠️ Hai trường hợp cần kiểm tra trước khi chạy lại:
> - **Employee có sẵn nhưng chưa gắn User ID** → form coi là nhân viên mới, bắt nhập Mã NV và hiện dialog nghi trùng. Đừng xác nhận; mở Employee, gắn **User ID** rồi chạy lại.
> - **User có sẵn từng được gán role lẻ bằng tay** (tài khoản nội bộ, quản lý) → chuyển sang Role Profile sẽ gỡ các role lẻ đó. Form dò trước và hiện dialog liệt kê đủ các role sẽ mất **trước khi ghi bất cứ gì**; bấm **No** thì không có gì thay đổi. Chỉ bấm **Yes** khi đúng là muốn tài khoản đó chỉ còn role của Role Profile (role bị gỡ phải gán lại thủ công trên User).
>
> ![Dialog xác nhận gỡ role gán tay](images/desk/admin-console-role-strip.png)

## 7. Lỗi thường gặp

| Thông báo | Nguyên nhân & cách xử lý |
|---|---|
| *Mã HR-EMP-xxxx đã tồn tại (của …)* | Mã NV đã cấp cho người khác — kiểm tra lại với HR, nhập mã khác |
| *Không thể tạo kho/account …: chưa cấu hình … Parent* | Công ty chưa khai parent trong Admin Console Settings — báo System Manager |
| *Account '…' đã tồn tại nhưng type là '…'* | Trùng tên với account khác bản chất — đổi template tên hoặc xử lý account cũ |
| *Kỹ thuật viên cần Homebase / số điện thoại* | Điền thiếu ở phần KTV |
| Hiện dialog **nghi trùng** dù người này đã có Employee | Employee chưa gắn **User ID** nên form không nhận ra — bấm **No**, gắn User ID trên Employee rồi chạy lại |

## Liên quan

- [Tạo & quản lý Employee](Desk-Admin-Employee.html) — chi tiết hồ sơ nhân sự, người làm 2–3 công ty
- [Tạo User & phân quyền](Desk-Admin-User.html) — tạo tay từng tài khoản, quản lý role
- [Ca làm việc (Shift)](Desk-Admin-Shift.html) — quản lý Shift Type / Shift Assignment
