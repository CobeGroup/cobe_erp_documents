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

**4 loại thư:**

| Loại | Mốc | Gửi cho ai |
|---|---|---|
| Chào nhân viên mới | ngày nhận việc | chính nhân viên |
| **Giới thiệu nhân viên mới** | ngày nhận việc | **toàn công ty**, trừ chính người mới |
| Sinh nhật | ngày–tháng sinh | chính nhân viên |
| Tri ân cống hiến | mốc năm nhận việc | chính nhân viên |

- Email gửi cho **chính nhân viên** qua `company_email` (nếu trống thì lấy `personal_email`, rồi tới `user_id`). Riêng thư giới thiệu gửi BCC cho cả công ty.
- **Người gửi theo công ty**: thư đi từ địa chỉ của đúng **công ty trực thuộc** của nhân viên, nếu công ty đó đã được gán 1 Email Account (xem *Thiết lập* bước 1). Chưa gán thì dùng địa chỉ mặc định.
- **Ảnh banner do designer làm sẵn** cho từng người, nạp vào **Cobe Congrats Asset**. Mẫu email chèn ảnh bằng biến `{{ banner }}`. Mẫu cần ảnh mà chưa có ảnh thì hệ thống **HOÃN**, không gửi thư trống (xem *Ảnh banner*).
- **Cùng một loại có thể dùng nhiều mẫu khác nhau** (nam/nữ, công ty, phòng ban, mốc năm) qua **bảng quy tắc** trong Settings.
- Mỗi lần gửi ghi 1 dòng **Cobe Congrats Log** → chống gửi trùng + để tra cứu.
- **Cửa sổ bù**: cron không chỉ quét hôm nay mà cả **N ngày gần đây** (mặc định 7) → bắt được ca **hồ sơ tạo trễ**, **cron lỡ 1 ngày**, **lần trước gửi fail**, và **ảnh nạp muộn**. Dedup theo **ngày sự kiện thật** nên gửi trễ vẫn **không trùng**. Đặt `Cửa sổ bù = 0` nếu chỉ muốn gửi đúng ngày.
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
Vào `/app/email-template`, 4 mẫu đã tạo sẵn (sửa tuỳ ý):
- **Cobe - Chào nhân viên mới**
- **Cobe - Giới thiệu nhân viên mới**
- **Cobe - Chúc mừng sinh nhật**
- **Cobe - Tri ân cống hiến**

Biến dùng được trong tiêu đề & nội dung (cú pháp `{% raw %}{{ ... }}{% endraw %}`):

| Biến | Ý nghĩa |
|---|---|
| `{% raw %}{{ banner }}{% endraw %}` | **Ảnh banner** designer làm cho người này (xem mục *Ảnh banner*). Mẫu có biến này mà chưa có ảnh thì thư **bị hoãn**, không gửi trống |
| `{% raw %}{{ employee_name }}{% endraw %}` | Tên đầy đủ nhân viên |
| `{% raw %}{{ first_name }}{% endraw %}` | Tên gọi (để xưng hô) |
| `{% raw %}{{ title }}{% endraw %}` | **Anh** / **Chị** theo giới tính (rỗng nếu không khai giới tính) |
| `{% raw %}{{ title_name }}{% endraw %}` | Gộp sẵn: *Anh Nguyễn Văn A* |
| `{% raw %}{{ years }}{% endraw %}` | Số năm làm việc (chỉ dùng cho tri ân) |
| `{% raw %}{{ company_note }}{% endraw %}` | **Công ty trực thuộc** — dùng biến này nếu cần in tên thương hiệu trong nội dung |
| `{% raw %}{{ company }}{% endraw %}` | Company của hệ thống — hầu hết nhân viên đều là *THẾ GIỚI ĐIỆN GIẢI* sau khi gộp công ty, nên **đừng dùng biến này để hiện thương hiệu**; dùng `{% raw %}{{ company_note }}{% endraw %}` hoặc **Footer** của Email Account |
| `{% raw %}{{ designation }}{% endraw %}` · `{% raw %}{{ department }}{% endraw %}` | Chức danh · phòng ban |
| `{% raw %}{{ date_of_joining }}{% endraw %}` · `{% raw %}{{ date_of_birth }}{% endraw %}` | Ngày vào làm · ngày sinh (dd/MM/yyyy) |

> ⚠️ Chức danh đang **để trống ở 102/142** nhân viên. Mẫu giới thiệu có in chức danh thì nhớ điền `designation` trên hồ sơ Employee trước, không thì chỗ đó trống.

![Email Template sinh nhật — sửa Subject + Response HTML, biến {{ ... }} đổ dữ liệu nhân viên](images/desk/hr-congrats-template.png)

### 3. Cấu hình — Cobe Congrats Settings
Vào `/app/cobe-congrats-settings`:

- **Bật từng loại**: Chào NV mới / Giới thiệu NV mới / Sinh nhật / Tri ân — và chọn đúng mẫu mặc định cho mỗi loại.
- **Cửa sổ bù (ngày)**: mặc định 7 — quét bù các ngày gần đây để không bỏ sót (xem mục *Cách hoạt động*). 0 = chỉ gửi đúng ngày.
- **Nhìn tới trước (ngày)**: mặc định 14 — dùng cho nút **Chuẩn bị ảnh**, không ảnh hưởng việc gửi.
- **Mốc năm tri ân**: `*` = gửi **mọi năm** (1, 2, 3…). Hoặc liệt kê mốc: `1,2,3,5,10`.
- **Người nhận thêm**:
  - **CC quản lý trực tiếp** — CC email quản lý (Employee.reports_to).
  - **CC HR** — điền danh sách email HR (mỗi dòng/dấu phẩy 1 email).
  - **Thông báo cả phòng ban / công ty** — BCC mọi NV đang làm việc trong phạm vi để cùng chúc mừng. Chọn *Không* nếu chỉ gửi riêng.
- **Người gửi**: điền **Email người gửi** khớp Email Account ở bước 1 (để trống = tài khoản mặc định) + **Tên người gửi**. Đây là địa chỉ **dự phòng chung** — công ty nào đã khai ở bước 1 thì gửi bằng địa chỉ riêng của công ty đó, phần này không đụng tới.

![Form Cobe Congrats Settings — công tắc tổng, 3 loại email + mẫu, cửa sổ bù, người nhận thêm; góc phải có 2 nút Xem trước / Gửi test](images/desk/hr-congrats-settings.png)

### 3b. Nhiều mẫu cho cùng một loại — bảng quy tắc

Sinh nhật nam nền xanh, nữ nền hồng; thư tri ân 1 năm khác mốc 5 năm; mỗi công ty một branding. Khai ở bảng **Quy tắc chọn mẫu theo nhân viên** trong Settings:

| Loại | Giới tính | Công ty trực thuộc | Phòng ban | Mốc năm | Mẫu email |
|---|---|---|---|---|---|
| birthday | Female | | | | Cobe - SN nữ |
| birthday | Male | | | | Cobe - SN nam |
| anniversary | | | | 1 | Cobe - Tri ân 1 năm |
| anniversary | | | | 5,10 | Cobe - Tri ân mốc lớn |
| intro | | Akanwa VN | | | Cobe - Giới thiệu Akanwa |

Cách đọc bảng:

- **Ô để trống = không xét.** Dòng chỉ điền *Loại* + *Giới tính* thì mọi công ty, mọi phòng ban đều khớp.
- **Dòng nào khớp trước thì thắng** — kéo thả để sắp thứ tự. Quy tắc riêng đặt **lên trên**, quy tắc chung xuống dưới. Ví dụ muốn "nữ phòng Marketing dùng mẫu khác nữ thường" thì dòng Marketing phải nằm **trên** dòng nữ chung.
- **Không dòng nào khớp** → dùng mẫu mặc định của loại đã chọn ở bước 3. Không ai bị mất thư.
- Ô **Công ty trực thuộc** nhận nhiều cách viết, ngăn bằng dấu phẩy: `CPTĐCN Fuji VN, Fuji Medical VN`.
- **Mốc năm** chỉ có nghĩa với tri ân. Để trống = mọi mốc.

> Giới tính đang khai đủ (64 nữ / 76 nam / 2 *Prefer not to say*). Hai người không khai giới tính sẽ **không khớp** dòng Nam lẫn Nữ nên rơi về mẫu mặc định — nếu cần, thêm một dòng chỉ có *Loại* đặt ở **dưới cùng** làm mẫu trung tính.

### 3c. Ảnh banner — designer làm, hệ thống gửi

Ảnh có ảnh chân dung, tên, ngày, màu theo giới tính thì **hệ thống không tự tạo được**. Quy trình: designer làm ảnh → nạp vào hệ thống → tới ngày tự gửi.

**Nạp ảnh:** `/app/cobe-congrats-asset` → New, điền:

| Ô | Ghi chú |
|---|---|
| Nhân viên | người trong ảnh |
| Loại | `welcome` / `intro` / `birthday` / `anniversary` |
| **Năm sự kiện** | ảnh có in ngày nên **mỗi năm phải làm ảnh mới**. Ảnh sinh nhật 03.06.2026 → năm 2026 |
| Ảnh banner | file thiết kế |

Mỗi (nhân viên, loại, năm) chỉ được **1 ảnh** — nạp trùng sẽ bị chặn lúc Save.

**Biết trước ai cần ảnh:** trong Settings bấm **Chuẩn bị ảnh**. Bảng liệt kê sự kiện **14 ngày tới** (đổi ở ô *Nhìn tới trước*), cột **Ảnh** cho biết:

| Cột Ảnh | Nghĩa |
|---|---|
| ✅ | đã có ảnh, tới ngày là gửi |
| ⚠ chưa có | **thư sẽ bị hoãn** cho tới khi có ảnh |
| mẫu không dùng ảnh | mẫu toàn chữ, gửi bình thường |

> **Thiếu ảnh thì hoãn, không gửi thư trống.** Log ghi *Skipped — chưa có ảnh banner … chờ designer*. Khi ảnh được nạp, lần cron kế tiếp trong **cửa sổ bù** (7 ngày) tự gửi. Quá cửa sổ bù mới nạp thì phải nới tạm ô *Cửa sổ bù* rồi chờ 08:00 hôm sau.
>
> Điều này cũng áp dụng khi **ảnh bị xoá khỏi hệ thống** sau khi đã nạp — bản ghi còn nhưng file mất thì vẫn tính là chưa có ảnh, để thư không đi ra với ô ảnh rỗng.

### 4. Gửi test trước khi bật
Trong form Settings:
1. Điền **Email nhận test** (hộp của bạn).
2. Bấm nút **Gửi test** → chọn loại → gửi. Email về hộp test để duyệt nội dung. Kết quả ghi rõ **Gửi từ** (đúng địa chỉ công ty chưa) và **Mẫu dùng** (bảng quy tắc chọn đúng mẫu chưa).
   - Chọn **Nhân viên mẫu** đúng người muốn thử — đó là cách kiểm quy tắc nam/nữ, công ty, phòng ban.
   - Điền **Ngày sự kiện** đúng năm của ảnh nếu muốn thấy cả ảnh banner (ảnh khoá theo năm).
3. Bấm **Xem trước hôm nay** để coi hôm nay ai được gửi gì. Bảng có cột **Công ty trực thuộc**, **Mẫu**, **Ảnh**, **Gửi từ** cho từng người; cuối bảng là số **ảnh còn thiếu** và danh sách **công ty chưa có địa chỉ gửi riêng** kèm số người.
4. Bấm **Chuẩn bị ảnh** để xem sự kiện sắp tới và ảnh nào chưa có (xem mục *3c*).

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
6. Sau 1-2 ngày chạy êm, trả **Cửa sổ bù** về **7**.

> Chừng nào còn tick **Chạy thử**, cron chỉ ghi log, **không gửi email thật** — kể cả khi công tắc tổng đã bật.

> ⚠️ **Vì sao phải hạ Cửa sổ bù về 0 ở lần đầu.** Cửa sổ bù khiến cron quét cả **N ngày gần đây**, rất tốt để không bỏ sót — nhưng ở **lần chạy thật đầu tiên** thì Log chưa có dòng nào, nên nó sẽ gửi bù cho tất cả ai có sinh nhật/kỷ niệm trong **7 ngày trước đó**. Người ta nhận thư chúc mừng **muộn cả tuần** mà không hiểu vì sao. Đặt 0 cho lần đầu, khi đã có Log rồi thì trả về 7 — những ngày cũ đã ghi *Sent* nên **không gửi trùng**.
>
> Sau khi chạy êm nên để **7** chứ đừng để 0: thư có ảnh phải **chờ designer nạp ảnh** mới gửi được, cửa sổ bù chính là quãng thời gian ảnh nạp muộn vẫn còn kịp.

---

## Sau khi hệ thống được cập nhật

Mỗi lần bản cập nhật lên, kiểm 3 chỗ này là biết đã ăn hay chưa:

1. `/app/cobe-congrats-settings` mở được, công tắc tổng và Chạy thử **giữ nguyên** trạng thái bạn đặt.
2. Mở 1 Email Account bất kỳ → **tab Outgoing** → dưới mục Footer có mục thu gọn **Email chúc mừng (HR)**. Không thấy thì cấu hình người gửi theo công ty chưa có hiệu lực — báo IT chạy cập nhật cơ sở dữ liệu.
3. `/app/cobe-congrats-log` có cột **Người gửi**.
4. `/app/cobe-congrats-asset` mở được (chỗ nạp ảnh banner).
5. Trong Settings có bảng **Quy tắc chọn mẫu theo nhân viên** và 3 nút: **Xem trước hôm nay**, **Chuẩn bị ảnh**, **Gửi test**.

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
- **Trạng thái *Skipped "Chưa có ảnh banner … chờ designer"*** → mẫu này có chèn `{% raw %}{{ banner }}{% endraw %}` nhưng chưa nạp ảnh cho (nhân viên, loại, **năm**) đó. Nạp ảnh vào `/app/cobe-congrats-asset` là lần cron kế tiếp tự gửi. Kiểm 2 chỗ hay sai: **Năm sự kiện** phải đúng năm của ngày sự kiện, và **Loại** phải đúng (`intro` ≠ `welcome`).
- **Thư tới muộn vài ngày so với ngày sự kiện**: do **Cửa sổ bù** đang > 0 và trước đó chưa có Log *Sent* cho ngày đó — thường là **thư đợi ảnh**, hoặc mới bật, cron lỡ, lần trước fail. So cột *Ngày sự kiện* với *Thời điểm ghi nhận* trong Log là thấy. Không muốn gửi bù thì đặt **Cửa sổ bù = 0** (đánh đổi: ảnh nạp muộn sẽ mất luôn).
- **Thư gửi đúng nhưng dùng sai mẫu** (nam ra mẫu nữ, công ty ra mẫu chung): coi lại **thứ tự dòng** trong bảng quy tắc — dòng khớp trước thắng, quy tắc riêng phải nằm **trên**. Bấm **Gửi test** với đúng nhân viên đó, kết quả ghi rõ **Mẫu dùng**.
- **Người mới nhận được thư giới thiệu về chính mình**: không xảy ra — hệ thống loại chính người mới khỏi danh sách nhận. Nếu thấy, kiểm xem có phải họ nhận **thư chào** (loại `welcome`, gửi riêng cho họ) chứ không phải thư giới thiệu.
- **Nhận được thư nhưng sai công ty gửi** (cột *Người gửi* trong Log là địa chỉ mặc định):
  1. Mở hồ sơ Employee, coi ô **Công ty trực thuộc** ghi gì — sai hoặc trống thì sửa ở đây.
  2. Cách viết đó đã khai trong Email Account của công ty chưa (bước 1)? Bấm **Xem trước hôm nay**, phần cuối liệt kê đúng những cách viết chưa ai nhận.
  3. Email Account đó đã tick **Enable Outgoing** chưa — chưa tick thì thư vẫn đi bằng địa chỉ mặc định.

> ⚠️ Email gửi theo `company_email`. Nếu công ty đã đổi domain sang `@thegioidiengiai.com.vn`, hãy cập nhật `company_email` của nhân viên cho đúng để không gửi nhầm hộp cũ.
