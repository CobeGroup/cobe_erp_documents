---
title: "Bảng công tháng (Monthly Attendance Sheet)"
layout: default
parent: HR (vận hành)
grand_parent: Chấm công & HR
nav_order: 6.5
---

# Bảng công tháng — Monthly Attendance Sheet
{: .no_toc }

**Dành cho:** HR Manager · Trưởng bộ phận · **Nơi xem:** Desk → Search **"Monthly Attendance Sheet Cobe"**
{: .fs-3 .text-grey-dk-000 }

> Báo cáo **một bảng = cả tháng**: mỗi dòng là **một nhân viên**, mỗi cột là **một ngày**, mỗi ô là
> **trạng thái công** ngày đó theo **mã HR** (`8` công đủ / `4` nửa / số giờ nếu thiếu / `5,6` WFH / `L` `NB` `H` nghỉ / `-` không dữ liệu…). Dùng để **đối chiếu công cuối tháng**,
> xuất Excel gửi kế toán.

> 🟢 **Dùng bản Cobe: `Monthly Attendance Sheet Cobe`** (KHÔNG phải bản gốc HRMS "Monthly
> Attendance Sheet"). Bản Cobe thêm **Mã NV**, **Công ty trực thuộc**, **Tổng giờ**, **mỗi ngày là 1
> ô ghép chia đôi** (nửa trái ký hiệu, nửa phải **số giờ**; xuất Excel tách 2 cột cộng được) + **ký
> hiệu tiếng Việt theo loại phép** — xem [mục 0](#0-bản-cobe--khác-gì-bản-gốc).

<details open markdown="block">
  <summary>Mục lục</summary>
{: .text-delta }
1. TOC
{:toc}
</details>

---

## 0. Bản Cobe — khác gì bản gốc

Có **hai** báo cáo trùng ý tưởng; HR Cobe **nên dùng bản Cobe**:

| | **Monthly Attendance Sheet Cobe** *(khuyên dùng)* | Monthly Attendance Sheet *(gốc HRMS)* |
|---|---|---|
| Cột đầu | Employee · **Mã NV** · Tên · **Công ty trực thuộc** · Shift · **Tổng giờ** | Employee · Tên · Shift |
| Ô mỗi ngày | **1 ô ghép/ngày** (`1 T4`) **chia đôi**: nửa trái **mã HR** (`8`/`4`/số-giờ/`5,6`/`L`…/`-`), nửa phải **số giờ công thực tế** (`8,2`) | 1 ô: chỉ ký hiệu `P`, `HD` |
| Ký hiệu (theo bảng HR) | Công đủ `8` · nửa `4` · thiếu = số giờ · WFH `5,6` · nghỉ `L`/`L/2`/`NB`/`KL`/`CĐ`/`BH`/`H` · `WO` · `-` không dữ liệu | Gộp chung `L` (On Leave) |
| Lọc Company | **Bỏ trống = gộp MỌI công ty** | Bắt buộc chọn |
| Lọc **Cty Trực Thuộc** | **Có** — lọc theo nhóm gốc (trước gộp công ty), độc lập với Company | Không có |
| Cách chạy | **Chạy thẳng** (bấm là ra) | "Prepared report" — phải **Generate New Report** rồi chờ |
| Summarized View | Dùng chung phần tổng của bản gốc | *(bản gốc)* |

![Monthly Attendance Sheet Cobe — Mã NV · Công ty trực thuộc · Tổng giờ · mỗi ngày 1 ô ghép (1 T4) chia đôi: nửa trái mã HR (8 công đủ / 4 nửa / số giờ nếu thiếu / 5,6 WFH / L·NB nghỉ / -), nửa phải số giờ thực tế xanh](images/desk/hr-mas-cobe-grid.png)

> 💡 **Mỗi ngày = 1 ô ghép** (tiêu đề `<ngày> <thứ>`, vd `1 T4`) **chia đôi**: nửa **trái** là **mã
> HR** (`8` công đủ · `4` nửa ngày · **số giờ** nếu công thiếu đi trễ/về sớm · `5,6` WFH · `L`/`NB`/…
> nghỉ · `-` không-dữ-liệu), nửa **phải** là **số giờ công thực tế** (xanh, nếu có). Ngày
> **nghỉ/lễ/WO** để **trống** nửa giờ.
>
> 💡 **Xuất Excel** thì mỗi ngày ra **2 cột** riêng (`1 T4` = ký hiệu, `1·g` = số giờ) nên cộng/lọc
> theo cột giờ từng ngày được — trên màn gộp lại 1 ô cho gọn, nhưng dữ liệu vẫn tách.
>
> 💡 **Tổng giờ** = cộng số giờ mọi ngày trong kỳ — số giờ làm thực tế cả tháng của mỗi người, khỏi
> tính tay. **Công ty trực thuộc** chỉ có với NV đã **gộp công ty** (lưu công ty gốc); NV khác để
> trống là bình thường.

> ⚠️ Mở đúng tên **`Monthly Attendance Sheet Cobe`**. Bản gốc "Monthly Attendance Sheet" **không**
> có Mã NV / Công ty trực thuộc / Tổng giờ, **bộ lọc & ký hiệu cũng khác** (bản gốc dùng `P`/`A`/`HD`,
> có *Group By*, bắt buộc chọn Company, phải Generate). Tài liệu này mô tả **bản Cobe**; chỉ phần
> **presence-based** (mục 5) và **xuất Excel** là chung cho cả hai.

---

## 1. Mở báo cáo

1. Vào Desk (`/app`) → bấm **Search** (Ctrl/⌘ + K) → gõ **Monthly Attendance Sheet Cobe** → Enter.
   (Hoặc workspace **Shift & Attendance / People** → mục **Reports**.)
2. **Bản Cobe chạy thẳng** — đặt bộ lọc xong là bảng **hiện ngay**, KHÔNG cần bấm Generate.

![Monthly Attendance Sheet Cobe vừa mở — thanh lọc trên cùng + dòng chú thích mã HR + lưới ngày](images/desk/hr-mas-cobe-open.png)

> ⚙️ *Chỉ bản gốc HRMS "Monthly Attendance Sheet" mới là "prepared report" (phải bấm **Generate New
> Report** rồi chờ). Bản Cobe không cần — cứ đổi bộ lọc là bảng tự cập nhật.*

---

## 2. Bộ lọc (thanh trên)

| Bộ lọc | Ý nghĩa |
|---|---|
| **Filter Based On** | Lọc theo **Month** (tháng) hay **Date Range** (khoảng ngày). Mặc định **Month**. |
| **Month / Year** | Tháng & năm — hiện khi *Filter Based On = Month*. |
| **Start Date / End Date** | Khoảng ngày (≤ 90 ngày) — hiện khi *Filter Based On = Date Range*. |
| **Employee** | Để trống = **tất cả** nhân viên; chọn 1 người = chỉ người đó. |
| **Company** | Công ty pháp lý. **Bỏ trống = gộp TẤT CẢ công ty.** |
| **Cty Trực Thuộc** | Lọc theo **nhóm gốc** (công ty trước khi gộp), **độc lập** với Company. Bỏ trống = mọi nhóm. |
| **Include Company Descendants** | Gộp cả các công ty con (mặc định bật). |
| **Summarized View** | Tích để xem **chỉ phần tổng** (biểu đồ + bảng đếm), không có lưới ngày. |

Tích **Summarized View** → mỗi nhân viên còn 1 dòng tổng: Total Present / Leaves / Absent /
Holidays / Unmarked Days, và **tách cột theo từng loại phép** (ảnh dưới: cột **Nghỉ bù**, **Phép
Năm**, **Nghỉ Không Lương** riêng nhau):

![Summarized View (bản Cobe) — biểu đồ + bảng tổng: Total Present / Leaves / Absent / Holidays / Unmarked, tách cột Nghỉ bù · Phép Năm · Nghỉ Không Lương riêng](images/desk/hr-mas-cobe-summary.png)

---

## 3. Đọc lưới ngày — các mã trạng thái

Mỗi ô (giao của **nhân viên × ngày**) hiển thị **một mã**:

> 🟢 **Bản Cobe dùng KÝ HIỆU HR** (theo bảng quy chuẩn của HR). **Mỗi ngày = 1 ô ghép chia đôi**:
> nửa **TRÁI** = **mã HR** (đúng bảng), nửa **PHẢI** = **số giờ công thực tế** (xanh, nếu có).

| Mã (ô trái) | Nghĩa | Ô giờ (phải) | HR |
|---|---|---|---|
| **8** | **Ngày công đủ** — đúng giờ (check-in ≤ đầu ca) & không về sớm | số giờ thực (8,2) | mục 1 |
| **4** | **Nửa ngày công** | số giờ thực (4,0) | mục 2 |
| **số giờ** (vd 6,5) | **Ngày công thiếu** — đi trễ **hoặc** về sớm | số giờ thực (=ô trái) | mục 3 |
| **5,6** | **Làm việc ở nhà (WFH)** — hưởng 70%/ngày thường | giờ thực (nếu có) | mục 4 |
| **NB** | Nghỉ bù | — | mục 5 |
| **L** | Phép năm (đã duyệt) | — | mục 6 |
| **L/2** | Phép năm nửa ngày | giờ nửa đã làm (nếu có) | mục 7 |
| **H** | Nghỉ lễ (theo Holiday List) | — | mục 8 |
| **KL** | Nghỉ không lương | — | mục 9 |
| **CĐ** | Nghỉ chế độ có lương (ma chay/cưới hỏi/sinh con…) | — | mục 10 |
| **BH** | Nghỉ chế độ BHXH | — | mục 11 |
| **-** | **Không có dữ liệu chấm công / vắng** (0 công) | — | mục 12 |
| **WO** | Nghỉ tuần (vd Chủ nhật) | — | — |

> 📊 Xem **ảnh lưới Cobe thực tế** (đủ mã HR + số giờ) ở **[mục 0](#0-bản-cobe--khác-gì-bản-gốc)** phía trên.

> 🔢 Muốn **cộng nhanh số ngày từng loại** (Total Present / Leaves / Absent / Holidays + tách theo
> từng loại phép: Phép năm · **Nghỉ bù** · Không lương…) thì bật **Summarized View** ([mục 2](#2-bộ-lọc-thanh-trên)).
> Lưới chi tiết này chỉ có cột **Tổng giờ** (số giờ công cả tháng), không có cột đếm theo loại.

---

## 4. Các tính năng mới hiện ở đâu trên bảng?

Đây là cách 3 điều chỉnh chấm công mới **đổ vào** Monthly Attendance Sheet:

| Việc nhân viên làm | Trạng thái Attendance | Ô trên bảng |
|---|---|---|
| **Đề xuất chấm công bù / Công tác** được duyệt | Present | **8** (đơn cấp công đủ ca) |
| **Check-in ngoài VP** hợp lệ (KTV/Sales whitelist, hoặc ngày có đơn duyệt) | Present | **8** hoặc số giờ (nếu trễ/sớm) |
| **Đề xuất WFH** được duyệt | Work From Home | **5,6** |
| **Nghỉ bù** (Leave Application loại "Nghỉ bù") được duyệt | On Leave | **NB** |
| Nghỉ phép năm / không lương được duyệt | On Leave | **L** / **KL** |

> 💡 **Đơn chấm công bù** cấp **công đủ ca → "8"** (không có giờ check-in thực nên không tính trễ/sớm).
> Muốn xem **giờ vào/ra thực tế** và **đi trễ/về sớm**, dùng báo cáo **Shift Attendance** hoặc mở
> **Employee Checkin** ([Theo dõi & sửa chấm công](Desk-HR-ChamCong.html)).

> 💰 **"Nghỉ bù" hiện là "NB"** trên bảng — đúng, vì đó là một đơn nghỉ. Nhưng **nghỉ bù KHÔNG
> trừ quỹ phép năm** và **không trừ lương** (xem [Loại phép](Desk-HR-LoaiPhep.html)). Trên phần chi
> tiết phép, ngày này nằm ở cột **"Nghỉ bù"** riêng, không lẫn với Phép năm.

---

## 5. Đặc thù cobe — chấm công "presence-based"

Hệ thống cobe **không tự đóng dấu Vắng**. Khác bản ERPNext mặc định, một ngày **không có
check-in và không có đơn** sẽ hiện **`-`** (0 công) chứ **không** tự thành vắng có bản ghi.

| Bạn thấy | Nghĩa thật |
|---|---|
| Ô **`-`** ở ngày làm việc | 0 công ngày đó. **Hầu hết là "chưa có dữ liệu"** (quên chấm / chưa có đơn) — Cobe không tự đánh vắng nên **đừng** mặc nhiên là vắng, cần **xác minh** |
| Ô **`-`** kèm bản ghi Absent thật | Trường hợp HR **tạo công Absent tay** (hoặc đơn xin công bị từ chối rồi đánh vắng). Nhìn giống hệt ô `-` trên bảng — muốn phân biệt phải mở Attendance ngày đó |

> ⚠️ **Vì sao quan trọng:** cuối tháng đừng đọc ô `-` = "đi làm đủ" hay "chắc chắn vắng". Ô `-` =
> **0 công / chưa xác minh**. Hãy soát các ô `-` ngày thường: nhắc nhân viên **tạo Đề xuất chấm công
> bù**, hoặc HR **thêm công tay** ([Theo dõi & sửa chấm công](Desk-HR-ChamCong.html)).

> 📘 Vì sao cobe tắt auto-Vắng: xem [Tổng quan chấm công](Cham-Cong-Tong-Quan.html).

---

## 6. Xuất & đối chiếu

1. Đặt bộ lọc **Month / Year** (và Company / Cty Trực Thuộc nếu cần) — bảng **hiện ngay** (bản Cobe không cần Generate).
2. Soát các ô **`-`** ngày thường (0 công / chưa xác minh) → xử lý (nhắc NV / thêm công tay).
3. Bấm **⋮ (Menu)** → **Export** → chọn **Excel / CSV** để gửi kế toán / lưu hồ sơ.

![Menu ⋮ — Print / PDF / Export / Setup Auto Email](images/desk/hr-mas-export.png)

4. Cần xem **giờ công chi tiết** từng buổi → mở **Employee Checkin** hoặc báo cáo **Shift Attendance**.

> 📬 Mẹo: **Setup Auto Email** (cùng menu ⋮) đặt lịch gửi bảng công tự động hằng tháng vào mail
> HR/kế toán — khỏi phải nhớ export tay.

---

## Liên quan
- 👩‍💼 [Báo cáo (HR) — danh mục đầy đủ](Desk-HR-BaoCao.html) · [Theo dõi & sửa chấm công](Desk-HR-ChamCong.html)
- ⚙️ [Loại phép & số dư (gồm Nghỉ bù)](Desk-HR-LoaiPhep.html) · [Duyệt nghỉ phép & nghỉ bù](Duyet-Nghi-Phep.html)
- 👤 [Nhân viên: Chấm công ngoài VP & Đề xuất chấm công bù](Guide-NhanVien-ChamCongNgoai.html)
- 📊 [Tổng quan chấm công (presence-based)](Cham-Cong-Tong-Quan.html)
