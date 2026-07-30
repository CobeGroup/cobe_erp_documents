---
title: "Email chúc mừng tự động"
layout: default
parent: HR (vận hành)
grand_parent: Chấm công & HR
nav_order: 12
---

# Email chúc mừng tự động
{: .no_toc }

**Dành cho:** HR Manager · **Doctype:** Cobe Congrats Settings, Email Template, Email Account, Cobe Congrats Log
{: .fs-3 .text-grey-dk-000 }

> Hệ thống **tự gửi email** chúc mừng, HR **không phải lên lịch tay hàng tháng** nữa. 3 loại: **chào nhân viên mới** (ngày nhận việc), **sinh nhật**, **tri ân cống hiến** (mốc năm làm việc). Cron chạy **08:00 mỗi sáng**, tự tìm ai có sự kiện hôm nay rồi gửi.

<details open markdown="block">
  <summary>Mục lục</summary>
{: .text-delta }
1. TOC
{:toc}
</details>

---

## Cách hoạt động (tóm tắt)

- Email gửi cho **chính nhân viên** qua `company_email` (nếu trống thì lấy `personal_email`, rồi tới `user_id`).
- **Người gửi theo công ty**: thư đi từ địa chỉ của đúng **công ty trực thuộc** của nhân viên, nếu công ty đó đã được gán 1 Email Account (xem *Thiết lập* bước 1). Chưa gán thì dùng địa chỉ mặc định.
- Nội dung lấy từ **Email Template** (sửa được trong Desk, không cần lập trình).
- Mỗi lần gửi ghi 1 dòng **Cobe Congrats Log** → chống gửi trùng + để tra cứu.
- **Cửa sổ bù**: cron không chỉ quét hôm nay mà cả **N ngày gần đây** (mặc định 3) → bắt được ca **hồ sơ tạo trễ**, **cron lỡ 1 ngày**, hoặc **lần trước gửi fail**. Dedup theo **ngày sự kiện thật** nên gửi trễ 1-2 ngày vẫn **không trùng**. Đặt `Cửa sổ bù = 0` nếu chỉ muốn gửi đúng ngày.
- Sinh nhật/tri ân so **ngày–tháng**. Ai sinh 29/02, năm không nhuận sẽ mừng vào 28/02.

---

## Thiết lập lần đầu (5 bước)

### 1. Cấu hình SMTP gửi đi — Email Account
Vào `/app/email-account` → tạo (hoặc mở) 1 **Email Account** loại **Outgoing (SMTP)** đúng của công ty (ví dụ hộp `@thegioidiengiai.com.vn`). Tick **Enable Outgoing**. Không có bước này thì không email nào gửi được.

Đây là **hộp thư của hệ thống**, không phải email của từng nhân viên — nhân viên chỉ là người **nhận**, không cần tài khoản gì ở đây.

#### Mỗi công ty một địa chỉ gửi riêng (tuỳ chọn)

Nhân viên Akanwa mà nhận thư ký tên Thế Giới Điện Giải thì kỳ. Để tách, mở Email Account của công ty đó rồi điền ô **Công ty trực thuộc áp dụng**.

**Ô này nằm ở đâu:** mở Email Account → sang **tab Outgoing** (không phải tab Details) → cuộn xuống dưới mục **Footer** → bấm vào tiêu đề **Email chúc mừng (HR)** cho nó **bung ra** (mục này mặc định thu gọn).

> Không thấy mục *Email chúc mừng (HR)*? Mở `/app/custom-field?dt=Email Account` xem có dòng `custom_congrats_company_notes` chưa. **Không có** = hệ thống chưa chạy cập nhật cơ sở dữ liệu, báo IT. **Có** mà form vẫn không hiện = bấm `Ctrl+Shift+R` để xoá cache cấu trúc form của trình duyệt.

Điền vào ô đó các cách viết của công ty, mỗi dòng một cách:

```
Akanwa VN
AKANWA
```

- **Mỗi dòng 1 cách viết.** Ô *Công ty trực thuộc* trên hồ sơ nhân viên là chữ tự do, cùng một công ty hay bị gõ nhiều kiểu — khai hết các kiểu đang dùng vào đây. Không phân biệt hoa/thường hay khoảng trắng thừa.
- Nhân viên nào có **Công ty trực thuộc** khớp một trong các dòng đó sẽ nhận thư gửi từ **chính địa chỉ này**, kèm **Footer** và **tên tài khoản** của nó — nên 3 mẫu nội dung vẫn dùng chung mà branding từng công ty vẫn đúng. Đặt logo/tên/địa chỉ công ty vào ô **Footer** của Email Account.
- Nhớ tick **Enable Outgoing**, nếu không thư vẫn đi bằng địa chỉ mặc định.
- Mỗi công ty chỉ được gán cho **1** Email Account — khai trùng ở tài khoản thứ hai sẽ bị chặn ngay lúc Save.
- Công ty **không khai** ở đâu cả thì dùng địa chỉ mặc định ở bước 3, không ai bị mất thư.

> **Số Email Account cần tạo = số *đuôi mail* muốn dùng**, không phải số công ty. Các công ty đang dùng chung `@thegioidiengiai.com.vn` chỉ cần tạo thêm hộp trên **cùng domain** (`hr.migun@thegioidiengiai.com.vn`…). Muốn gửi từ **domain khác** (`@akanwa.vn`) thì phải có **SMTP thật của domain đó** — mượn SMTP domain khác sẽ bị SPF/DKIM đánh rớt vào spam.

### 2. Duyệt nội dung — Email Template
Vào `/app/email-template`, 3 mẫu đã tạo sẵn (sửa tuỳ ý):
- **Cobe - Chào nhân viên mới**
- **Cobe - Chúc mừng sinh nhật**
- **Cobe - Tri ân cống hiến**

Biến dùng được trong tiêu đề & nội dung (cú pháp `{% raw %}{{ ... }}{% endraw %}`):

| Biến | Ý nghĩa |
|---|---|
| `{% raw %}{{ employee_name }}{% endraw %}` | Tên đầy đủ nhân viên |
| `{% raw %}{{ first_name }}{% endraw %}` | Tên gọi (để xưng hô) |
| `{% raw %}{{ years }}{% endraw %}` | Số năm làm việc (chỉ dùng cho tri ân) |
| `{% raw %}{{ company }}{% endraw %}` | Công ty (Company của hệ thống — hầu hết nhân viên đều là *THẾ GIỚI ĐIỆN GIẢI* sau khi gộp công ty, nên **đừng dùng biến này để hiện thương hiệu**; branding riêng đặt ở **Footer** của Email Account, xem bước 1) |
| `{% raw %}{{ designation }}{% endraw %}` · `{% raw %}{{ department }}{% endraw %}` | Chức danh · phòng ban |
| `{% raw %}{{ date_of_joining }}{% endraw %}` · `{% raw %}{{ date_of_birth }}{% endraw %}` | Ngày vào làm · ngày sinh (dd/MM/yyyy) |

![Email Template sinh nhật — sửa Subject + Response HTML, biến {{ ... }} đổ dữ liệu nhân viên](images/desk/hr-congrats-template.png)

### 3. Cấu hình — Cobe Congrats Settings
Vào `/app/cobe-congrats-settings`:

- **Bật từng loại**: Chào NV mới / Sinh nhật / Tri ân — và chọn đúng mẫu cho mỗi loại.
- **Cửa sổ bù (ngày)**: mặc định 3 — quét bù các ngày gần đây để không bỏ sót (xem mục *Cách hoạt động*). 0 = chỉ gửi đúng ngày.
- **Mốc năm tri ân**: `*` = gửi **mọi năm** (1, 2, 3…). Hoặc liệt kê mốc: `1,2,3,5,10`.
- **Người nhận thêm**:
  - **CC quản lý trực tiếp** — CC email quản lý (Employee.reports_to).
  - **CC HR** — điền danh sách email HR (mỗi dòng/dấu phẩy 1 email).
  - **Thông báo cả phòng ban / công ty** — BCC mọi NV đang làm việc trong phạm vi để cùng chúc mừng. Chọn *Không* nếu chỉ gửi riêng.
- **Người gửi**: điền **Email người gửi** khớp Email Account ở bước 1 (để trống = tài khoản mặc định) + **Tên người gửi**. Đây là địa chỉ **dự phòng chung** — công ty nào đã khai ở bước 1 thì gửi bằng địa chỉ riêng của công ty đó, phần này không đụng tới.

![Form Cobe Congrats Settings — công tắc tổng, 3 loại email + mẫu, cửa sổ bù, người nhận thêm; góc phải có 2 nút Xem trước / Gửi test](images/desk/hr-congrats-settings.png)

### 4. Gửi test trước khi bật
Trong form Settings:
1. Điền **Email nhận test** (hộp của bạn).
2. Bấm nút **Gửi test** → chọn loại → gửi. Email sẽ về hộp test để duyệt nội dung. Kết quả có ghi **Gửi từ** — kiểm luôn xem đúng địa chỉ công ty chưa (chọn **Nhân viên mẫu** thuộc công ty muốn thử).
3. Bấm **Xem trước hôm nay** để coi hôm nay ai sẽ được gửi gì. Bảng có cột **Công ty trực thuộc** và **Gửi từ** cho từng người; cuối bảng là danh sách **công ty chưa có địa chỉ gửi riêng** kèm số người — những người này đang dùng địa chỉ mặc định, muốn tách thì quay lại bước 1.

![Dialog Gửi test — chọn loại email + NV mẫu, email chuyển hướng về hộp test](images/desk/hr-congrats-test.png)

![Dialog Xem trước hôm nay — danh sách ai sẽ nhận gì, gồm cả cửa sổ bù, kèm ngày sự kiện](images/desk/hr-congrats-preview.png)

> Khi **Email nhận test** còn giá trị, **mọi** email (kể cả cron thật) đều chuyển hướng về hộp test — dùng để chạy thử an toàn. **Xoá trống ô này** khi muốn chạy thật.

### 5. Bật chạy thật
Hệ thống ship với **2 lớp khoá an toàn**: công tắc tổng **TẮT** + **Chạy thử (dry-run) BẬT**. Để đi live:
1. Đặt **Cửa sổ bù (ngày) = 0** (lý do ở cảnh báo bên dưới).
2. Xoá trống **Email nhận test** — còn giá trị là mọi thư vẫn chuyển hướng về hộp test.
3. Tick **Bật gửi email chúc mừng tự động** (công tắc tổng) → **Save**.
4. Bấm **Xem trước hôm nay** / xem `/app/cobe-congrats-log` (trạng thái *Dry Run*) để chắc danh sách đúng.
5. **BỎ tick Chạy thử (dry-run)** → **Save**. Từ giờ cron gửi thật, 08:00 mỗi sáng.
6. Sau 1-2 ngày chạy êm, trả **Cửa sổ bù** về **3**.

> Chừng nào còn tick **Chạy thử**, cron chỉ ghi log, **không gửi email thật** — kể cả khi công tắc tổng đã bật.

> ⚠️ **Vì sao phải hạ Cửa sổ bù về 0 ở lần đầu.** Cửa sổ bù khiến cron quét cả **N ngày gần đây**, rất tốt để không bỏ sót — nhưng ở **lần chạy thật đầu tiên** thì Log chưa có dòng nào, nên nó sẽ gửi bù cho tất cả ai có sinh nhật/kỷ niệm trong **3 ngày trước đó**. Người ta nhận thư chúc mừng **muộn 3 ngày** mà không hiểu vì sao. Đặt 0 cho lần đầu, khi đã có Log rồi thì trả về 3 — những ngày cũ đã ghi *Sent* nên **không gửi trùng**.

---

## Sau khi hệ thống được cập nhật

Mỗi lần bản cập nhật lên, kiểm 3 chỗ này là biết đã ăn hay chưa:

1. `/app/cobe-congrats-settings` mở được, công tắc tổng và Chạy thử **giữ nguyên** trạng thái bạn đặt.
2. Mở 1 Email Account bất kỳ → **tab Outgoing** → dưới mục Footer có mục thu gọn **Email chúc mừng (HR)**. Không thấy thì cấu hình người gửi theo công ty chưa có hiệu lực — báo IT chạy cập nhật cơ sở dữ liệu.
3. `/app/cobe-congrats-log` có cột **Người gửi**.

---

## Kiểm thử an toàn

- **Chạy thử (dry-run)**: tick ô này → cron vẫn quét nhưng **không gửi**, chỉ ghi Log trạng thái *Dry Run*. Coi kết quả ở `/app/cobe-congrats-log`.
- **Chạy tay bất cứ lúc nào**: nút **Xem trước hôm nay** (không gửi) trong form Settings.

## Tra cứu & xử lý sự cố

- **Đã gửi cho ai**: `/app/cobe-congrats-log` — lọc theo loại/ngày/trạng thái (Sent / Dry Run / Skipped / Failed). Cột **Người gửi** ghi địa chỉ đã dùng thật, lọc theo cột này để soi thư của một công ty.

![Danh sách Cobe Congrats Log — nhật ký từng email theo nhân viên, loại, ngày sự kiện, trạng thái](images/desk/hr-congrats-log.png)
- **Không nhận được email**:
  - Trạng thái *Skipped "Không có company_email"* → nhân viên thiếu email → điền `company_email` trong hồ sơ Employee.
  - Trạng thái *Failed* → xem cột lỗi. Thường do Email Account/SMTP chưa cấu hình đúng (bước 1) hoặc email người gửi không khớp tài khoản outgoing.
  - Không có dòng nào → kiểm tra công tắc tổng đã bật, đúng loại đã bật, và nhân viên có `date_of_birth`/`date_of_joining`.
- **Thư tới muộn vài ngày so với ngày sự kiện**: do **Cửa sổ bù** đang > 0 và trước đó chưa có Log cho ngày đó (mới bật, hoặc cron lỡ, hoặc lần trước gửi fail). So cột *Ngày sự kiện* với *Thời điểm ghi nhận* trong Log là thấy. Không muốn gửi bù thì đặt **Cửa sổ bù = 0**.
- **Nhận được thư nhưng sai công ty gửi** (cột *Người gửi* trong Log là địa chỉ mặc định):
  1. Mở hồ sơ Employee, coi ô **Công ty trực thuộc** ghi gì — sai hoặc trống thì sửa ở đây.
  2. Cách viết đó đã khai trong Email Account của công ty chưa (bước 1)? Bấm **Xem trước hôm nay**, phần cuối liệt kê đúng những cách viết chưa ai nhận.
  3. Email Account đó đã tick **Enable Outgoing** chưa — chưa tick thì thư vẫn đi bằng địa chỉ mặc định.

> ⚠️ Email gửi theo `company_email`. Nếu công ty đã đổi domain sang `@thegioidiengiai.com.vn`, hãy cập nhật `company_email` của nhân viên cho đúng để không gửi nhầm hộp cũ.
