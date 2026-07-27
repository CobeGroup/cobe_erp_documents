---
title: "Bảng công tháng (COBE HR Attendance Sheet)"
layout: default
parent: HR (vận hành)
grand_parent: Chấm công & HR
nav_order: 6.5
---

# Bảng công tháng — COBE HR Attendance Sheet
{: .no_toc }

**Dành cho:** HR Manager · Trưởng bộ phận · **Nơi xem:** Desk → Search **"COBE HR Attendance Sheet"**
{: .fs-3 .text-grey-dk-000 }

> Báo cáo **một bảng = cả tháng**: mỗi dòng là **một nhân viên**, mỗi cột là **một ngày**, mỗi ô là
> **trạng thái công** ngày đó theo **mã** (`P` công / `HD` nửa ngày / `WFH` làm ở nhà / `L` `NB` `H` nghỉ / `-` không dữ liệu…). Dùng để **đối chiếu công cuối tháng**,
> xuất Excel gửi kế toán.

> 🟢 **Dùng bản Cobe: `COBE HR Attendance Sheet`** (KHÔNG phải bản gốc HRMS "Monthly
> Attendance Sheet"). Bản Cobe thêm **Mã NV**, **Cty Trực Thuộc** (công ty trực thuộc), **Tổng giờ chuẩn** + **Tổng giờ thực**, **mỗi ngày là 1
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

| | **COBE HR Attendance Sheet** *(khuyên dùng)* | Monthly Attendance Sheet *(gốc HRMS)* |
|---|---|---|
| Cột đầu | Employee · **Mã NV** · Tên · **Cty Trực Thuộc** · Shift · **Tổng giờ chuẩn** · **Tổng giờ thực** | Employee · Tên · Shift |
| Ô mỗi ngày | **1 ô ghép/ngày** (`1 T4`) **chia đôi**: nửa trái **mã** (`P`/`HD`/`WFH`/`L`…/`-`), nửa phải **số giờ công thực tế** (`8,2`) | 1 ô: chỉ ký hiệu `P`, `HD` |
| Ký hiệu | Công `P` · nửa `HD` · WFH `WFH` · nghỉ `L`/`L/2`/`NB`/`KL`/`CĐ`/`BH`/`H` · `WO` · `-` không dữ liệu | Gộp chung `L` (On Leave) |
| Lọc Company | **Bỏ trống = gộp MỌI công ty** | Bắt buộc chọn |
| Lọc **Cty Trực Thuộc** | **Có** — lọc theo nhóm gốc/công ty trực thuộc (trước gộp công ty), độc lập với Company | Không có |
| Cách chạy | **Chạy thẳng** (bấm là ra) | "Prepared report" — phải **Generate New Report** rồi chờ |
| Summarized View | Dùng chung phần tổng của bản gốc | *(bản gốc)* |

![COBE HR Attendance Sheet — Mã NV · Công ty trực thuộc · Tổng giờ · mỗi ngày 1 ô ghép (1 T4) chia đôi: nửa trái mã (P công / HD nửa ngày / WFH làm ở nhà / L·NB nghỉ / -), nửa phải số giờ thực tế xanh](images/desk/hr-mas-cobe-grid.png)

> 💡 **Mỗi ngày = 1 ô ghép** (tiêu đề `<ngày> <thứ>`, vd `1 T4`) **chia đôi**: nửa **trái** là **mã**
> (`P` công đủ/thiếu — ô giờ cho biết · `HD` nửa ngày · `WFH` làm ở nhà · `L`/`NB`/…
> nghỉ · `-` không-dữ-liệu), nửa **phải** là **số giờ công thực tế** (xanh, nếu có). Ngày
> **nghỉ/lễ/WO** để **trống** nửa giờ.
>
> 💡 **Xuất Excel** thì mỗi ngày ra **2 cột** riêng (`1 T4` = ký hiệu, `1·g` = số giờ) nên cộng/lọc
> theo cột giờ từng ngày được — trên màn gộp lại 1 ô cho gọn, nhưng dữ liệu vẫn tách.
>
> 💡 **Hai cột tổng giờ** — đừng nhầm:
> - **Tổng giờ chuẩn** = cộng theo **công chuẩn của CA**: mỗi ngày công đủ (P / WFH) = **giờ chuẩn của ca đó**, nửa ngày (HD) = **½ giờ chuẩn ca**; nghỉ/vắng không cộng. Giờ chuẩn ca = *(giờ ra − giờ vào) − nghỉ trưa*, **suy động từ cấu hình mỗi Shift Type** — ca khác nhau có giờ chuẩn khác nhau. Đổi giờ ca trong cấu hình thì cột này **tự đúng theo**.
>   **Ngày nghỉ nửa buổi** (Thứ 7 của khối văn phòng — xem dưới) chỉ tính **½ giờ chuẩn**, vì ngày đó ca chỉ có nửa buổi.
> - **Tổng giờ thực** = cộng **số giờ bấm máy** thực tế mọi ngày trong kỳ (đúng những gì check-in/out ghi lại).
>
> Dùng **Tổng giờ chuẩn** để tính công/lương theo trạng thái (không phụ thuộc NV bấm sớm/muộn); dùng **Tổng giờ thực** để soi giờ hiện diện thật.
>
> 💡 **Thứ 7 nghỉ nửa buổi** — áp dụng cho **các ca được cấu hình nghỉ nửa buổi Thứ 7**
> (thường là **khối văn phòng**). Với những ca này, ngày Thứ 7 chỉ có nửa buổi nên:
> - **Tổng giờ chuẩn** cộng **½ ca** (vd ca 8h → tính **4h** cho ngày Thứ 7)
> - **Ngưỡng giờ công cũng chia đôi** → NV làm buổi sáng vẫn là **`P`** (công đủ),
>   không bị rớt xuống `HD`
>
> Các ca **làm cả ngày Thứ 7** (thường là khối hiện trường/kho) thì Thứ 7 vẫn tính
> **nguyên ngày** như bình thường.
>
> Ai thuộc nhóm nào là do **Holiday List gắn trên từng Shift Type** quyết định — HR chỉnh
> ở phần cấu hình ca, báo cáo tự theo, không cần sửa báo cáo.

> 💡 **Cty Trực Thuộc** (công ty trực thuộc) chỉ có với NV đã **gộp công ty** (lưu công ty gốc); NV khác để trống là bình thường.

> ⚠️ Mở đúng tên **`COBE HR Attendance Sheet`**. Bản gốc "Monthly Attendance Sheet" **không**
> có Mã NV / Cty Trực Thuộc / Tổng giờ chuẩn + thực, **bộ lọc & ký hiệu cũng khác** (bản gốc dùng `P`/`A`/`HD`,
> có *Group By*, bắt buộc chọn Company, phải Generate). Tài liệu này mô tả **bản Cobe**; chỉ phần
> **presence-based** (mục 5) và **xuất Excel** là chung cho cả hai.

---

## 1. Mở báo cáo

1. Vào Desk (`/app`) → bấm **Search** (Ctrl/⌘ + K) → gõ **COBE HR Attendance Sheet** → Enter.
   (Hoặc workspace **Shift & Attendance / People** → mục **Reports**.)
2. **Bản Cobe chạy thẳng** — đặt bộ lọc xong là bảng **hiện ngay**, KHÔNG cần bấm Generate.

![COBE HR Attendance Sheet vừa mở — thanh lọc trên cùng + dòng chú thích mã HR + lưới ngày](images/desk/hr-mas-cobe-open.png)

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
| **Cty Trực Thuộc** | Lọc theo **nhóm gốc / công ty trực thuộc** (công ty trước khi gộp), **độc lập** với Company. Bỏ trống = mọi nhóm. |
| **Include Company Descendants** | Gộp cả các công ty con (mặc định bật). |
| **Summarized View** | Tích để xem **chỉ phần tổng** (biểu đồ + bảng đếm), không có lưới ngày. |

Tích **Summarized View** → mỗi nhân viên còn 1 dòng tổng: Total Present / Leaves / Absent /
Holidays / Unmarked Days, và **tách cột theo từng loại phép** (ảnh dưới: cột **Nghỉ bù**, **Phép
Năm**, **Nghỉ Không Lương** riêng nhau):

![Summarized View (bản Cobe) — biểu đồ + bảng tổng: Total Present / Leaves / Absent / Holidays / Unmarked, tách cột Nghỉ bù · Phép Năm · Nghỉ Không Lương riêng](images/desk/hr-mas-cobe-summary.png)

---

## 3. Đọc lưới ngày — các mã trạng thái

Mỗi ô (giao của **nhân viên × ngày**) hiển thị **một mã**:

> 🟢 **Bản Cobe dùng mã trạng thái kiểu HRMS** (`P` / `HD` / `WFH`) + **ký hiệu HR cho các loại nghỉ**
> (`L`/`NB`/`KL`…). **Mỗi ngày = 1 ô ghép chia đôi**: nửa **TRÁI** = **mã trạng thái**, nửa **PHẢI** =
> **số giờ công thực tế** (xanh, nếu có).

| Mã (ô trái) | Nghĩa | Ô giờ (phải) | HR |
|---|---|---|---|
| **P** | **Ngày công** (Present) — đủ hay thiếu (trễ/về sớm) đều `P`; **ô giờ bên phải** cho biết đủ/thiếu | số giờ thực (8,2 / 6,5) | mục 1,3 |
| **HD** | **Nửa ngày công** (Half Day) | số giờ thực (4,0) — nếu là **`0,0`** thì **quên bấm giờ RA**, xem ghi chú dưới bảng | mục 2 |
| **WFH** | **Làm việc ở nhà** — hưởng 70%/ngày thường | giờ thực (nếu có) | mục 4 |
| **NB** | Nghỉ bù | — | mục 5 |
| **L** | Phép năm (đã duyệt) | — | mục 6 |
| **L/2** | Phép năm nửa ngày | giờ nửa đã làm (nếu có) | mục 7 |
| **H** | Nghỉ lễ (theo Holiday List) | — | mục 8 |
| **KL** | Nghỉ không lương | — | mục 9 |
| **CĐ** | Nghỉ chế độ có lương (ma chay/cưới hỏi/sinh con…) | — | mục 10 |
| **BH** | Nghỉ chế độ BHXH | — | mục 11 |
| **-** | **Không có dữ liệu chấm công / vắng** (0 công) | — | mục 12 |
| **WO** | Nghỉ tuần (vd Chủ nhật) | — | — |

> ⚠️ **`HD` kèm ô giờ `0,0` = NV chỉ bấm giờ VÀO, không bấm giờ RA** — không phải nghỉ nửa ngày.
> Giờ công tính bằng *giờ ra − giờ vào*, thiếu vế RA thì bằng **0**; mà 0 giờ thì dưới ngưỡng
> công đủ của ca nên hệ thống hạ xuống **nửa ngày**. Nhân viên vì vậy **mất trắng giờ hôm đó
> và chỉ được tính ½ công** — kiểm tra trên bảng thấy `HD 0,0` thì đối chiếu Employee Checkin
> rồi **bổ sung log RA / sửa Attendance tay** trước khi chốt công.
>
> Phân biệt: `HD` mà ô giờ **> 0** là đi làm thật nhưng **vào trễ** (chính sách Cobe: trễ là
> nửa ngày) hoặc giờ công không đủ ngưỡng. Còn **nghỉ phép nửa ngày** hiện `L/2`, `NB`, `KL`…
> theo đúng loại phép, **không** hiện `HD`.

> 📊 Xem **ảnh lưới Cobe thực tế** (đủ mã + số giờ) ở **[mục 0](#0-bản-cobe--khác-gì-bản-gốc)** phía trên.

> 🔢 Muốn **cộng nhanh số ngày từng loại** (Total Present / Leaves / Absent / Holidays + tách theo
> từng loại phép: Phép năm · **Nghỉ bù** · Không lương…) thì bật **Summarized View** ([mục 2](#2-bộ-lọc-thanh-trên)).
> Lưới chi tiết này có 2 cột tổng: **Tổng giờ chuẩn** (theo công chuẩn của ca) và **Tổng giờ thực** (giờ bấm máy), không có cột đếm theo loại.

---

## 4. Các tính năng mới hiện ở đâu trên bảng?

Đây là cách 3 điều chỉnh chấm công mới **đổ vào** bảng công tháng:

| Việc nhân viên làm | Trạng thái Attendance | Ô trên bảng |
|---|---|---|
| **Đề xuất chấm công bù / Công tác** được duyệt | Present | **P** (đơn cấp công đủ ca) |
| **Check-in ngoài VP** hợp lệ (KTV/Sales whitelist, hoặc ngày có đơn duyệt) | Present | **P** (ô giờ cho biết đủ/thiếu) |
| **Đề xuất WFH** được duyệt | Work From Home | **WFH** |
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
