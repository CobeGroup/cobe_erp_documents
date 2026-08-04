---
title: "Điều chỉnh số dư phép thủ công (± 0,5 ngày)"
layout: default
parent: HR (vận hành)
grand_parent: Chấm công & HR
nav_order: 3.6
---

# Điều chỉnh số dư phép thủ công (± 0,5 ngày)
{: .no_toc }

**Dành cho:** HR Manager · HR User · **Doctype:** Leave Adjustment
{: .fs-3 .text-grey-dk-000 }

> Cần **cộng** hoặc **trừ** thẳng vài phần ngày phép của **một** nhân viên — không qua đơn nghỉ,
> không cấp lại cả kỳ? Dùng **Leave Adjustment**. Đây là chứng từ chính thức: có lý do, có người
> ký, có dấu vết trong sổ phép, và **huỷ được**.

<details open markdown="block">
  <summary>Mục lục</summary>
{: .text-delta }
1. TOC
{:toc}
</details>

---

## 0. Trước hết: có phải việc của Leave Adjustment không?

| Tình huống | Làm gì |
|---|---|
| NV **đã nghỉ thật** mà chưa có đơn | Tạo **đơn nghỉ phép** thay NV (xem [Duyệt nghỉ phép / WFH](Desk-HR-DuyetDon.html)) — phép tự trừ, đúng chứng từ |
| Đơn đã duyệt nhưng **ghi sai số ngày / sai ngày** | **Huỷ đơn** rồi nộp lại đơn đúng — số dư tự hoàn |
| Cấp phép **đầu kỳ** cho 1 người hoặc cả phòng | **Leave Allocation** / **Leave Policy Assignment** — xem [Cấp phép & gán người duyệt](Desk-HR-CapPhep.html) |
| Số dư **lệch** do nhập liệu, do import, do thoả thuận riêng, do sửa lỗi hệ thống | ✅ **Leave Adjustment** — nội dung trang này |

> ⚠️ Đừng dùng Leave Adjustment để "ghi nhận một ngày nghỉ". Ngày nghỉ phải có **đơn** thì bảng
> công và bảng lương mới thấy. Leave Adjustment chỉ **nắn con số quỹ phép**, không sinh ngày nghỉ.

---

## 1. Cách làm (chung cho cả thêm và bớt)

Mở: Desk → Search **"Leave Adjustment"** · URL **`/app/leave-adjustment/new`**

Điền **đúng thứ tự** này — ô *Allocation to Adjust* chỉ tự điền khi đủ 3 ô đầu:

| # | Ô | Điền gì |
|---|---|---|
| 1 | **Employee** | Nhân viên cần chỉnh |
| 2 | **Leave Type** | Loại phép (danh sách **chỉ hiện loại NV đã có Leave Allocation**) |
| 3 | **Posting Date** | Ngày ghi sổ — mặc định hôm nay. **Ngày này quyết định lấy Allocation nào** |
| 4 | **Allocation to Adjust** | *Tự điền*, khoá — là Leave Allocation đang phủ Posting Date |
| 5 | **Allocated Leaves** | *Tự điền*, khoá — số đang cấp của Allocation đó |
| 6 | **Leaves to Adjust** | **`0.5`** — luôn nhập **số dương** |
| 7 | **Adjustment Type** | **Allocate** = cộng thêm · **Reduce** = bớt đi |
| 8 | **Leaves After Adjustment** | *Tự tính*, xem lại cho chắc |
| 9 | **Reason for Adjustment** | **Nên ghi** — sau này không ai đoán được vì sao |

→ **Save** → **Submit**.

> ⚠️ **Chiều cộng/trừ nằm ở ô `Adjustment Type`, không nằm ở dấu của con số.** Nhập `-0.5` vào
> *Leaves to Adjust* là sai: chọn Reduce mà số âm thì hoá ra **cộng** vào.

Submit xong, form hiện nút **View Ledger** → mở đúng bút toán vừa sinh trong sổ phép.

### Kiểm chứng lại số dư

- **Sổ phép:** nút **View Ledger** trên form, hoặc report **Leave Ledger**.
- **Bảng số dư:** report **Employee Leave Balance** (Search → gõ tên report).
- **Phía nhân viên:** app → tab **Nghỉ phép** → số dư đổi ngay, không cần chờ.

---

## 2. Bớt 0,5 ngày

Ví dụ: NV được ghi dư 0,5 ngày Phép Năm khi import số dư đầu kỳ.

1. `/app/leave-adjustment/new`
2. Employee = NV đó · Leave Type = **Phép Năm** · Posting Date = hôm nay
3. **Leaves to Adjust = 0.5** · **Adjustment Type = Reduce**
4. Reason: *"Trừ 0,5 ngày ghi dư khi import số dư 30/06/2026"*
5. Save → Submit

Sổ phép sinh một dòng **−0,5**.

> 🚫 **Reduce không đẩy số dư xuống âm được.** Nếu số dư tại Posting Date đang là 0,5 mà bớt 1
> ngày, hệ thống chặn:
> *"Reduction is more than <NV>'s available leave balance 0.5 for leave type Phép Năm"*.
> Muốn ghi nhận phần vượt quỹ thì cho nghỉ **Nghỉ Không Lương**, đừng ép số dư âm.

---

## 3. Thêm 0,5 ngày

Ví dụ: NV bị trừ dư 0,5 ngày do lỗi tính ngày Thứ 7 nửa buổi trước bản vá.

1. `/app/leave-adjustment/new`
2. Employee = NV đó · Leave Type = **Phép Năm** · Posting Date = hôm nay
3. **Leaves to Adjust = 0.5** · **Adjustment Type = Allocate**
4. Reason: *"Bù 0,5 ngày bị trừ dư ngày Thứ 7 nửa buổi 18/07/2026"*
5. Save → Submit

Sổ phép sinh một dòng **+0,5**.

> 💡 Cách này **là** cách xử lý những ca số dư ra âm sau khi tính lại phép Thứ 7 nửa buổi
> (xem [Xin nghỉ phép & nghỉ bù](Guide-NhanVien-NghiPhep.html) để hiểu vì sao Thứ 7 nửa buổi
> trừ 0,5 ngày).

---

## 4. Sửa lại hoặc gỡ bỏ một điều chỉnh

**Mỗi Leave Allocation chỉ được MỘT Leave Adjustment ở trạng thái Submitted.** Tạo cái thứ hai
cho cùng allocation sẽ bị chặn:
*"Leave Adjustment for this allocation already exists: HR-LAD-…"*.

Muốn đổi con số:

1. Mở phiếu cũ → **Cancel**. Số dư **trả về nguyên trạng** ngay (sổ phép sinh bút toán đảo).
2. Tạo phiếu **mới** với con số mong muốn.

> ⚠️ Phiếu mới phải ghi **tổng mức chỉnh cuối cùng**, không phải phần chênh. Đã chỉnh +0,5 rồi
> muốn thành +1 → huỷ phiếu cũ, phiếu mới ghi **1**, không phải 0,5.

> 📌 Thông báo lỗi gợi ý *"Please amend existing adjustment"* — nhưng role **HR Manager / HR User
> không có quyền Amend** trên doctype này. Đi đường **Cancel → tạo mới** như trên.

---

## 5. ĐỪNG sửa thẳng Leave Allocation

Với **Phép Năm**, phép được cộng dần hàng tháng (earned leave) qua **Leave Policy Assignment**.
Sửa ô **New Leaves Allocated** trên phiếu Leave Allocation đã Submit sẽ:

- bị hệ thống chặn: *"Cannot update allocation for **Earned Leaves** after submission"*; và
- nếu lách được (loại phép khác), nó **tính lại toàn bộ** phần đã cấp — **nuốt mất phần tự cộng
  hàng tháng** đã ghi trong sổ.

| Muốn | Làm |
|---|---|
| Chỉnh ± vài phần ngày cho 1 người | **Leave Adjustment** |
| Đổi hạn mức cả kỳ | Sửa **Leave Policy** rồi gán lại, hoặc cấp Leave Allocation kỳ mới |
| Loại phép **chưa** có Allocation nào (vd Nghỉ bù) | Không tạo Leave Adjustment được → cấp **Leave Allocation** trước |

> 🚫 Tuyệt đối không sửa số dư bằng SQL. Số dư thật nằm ở **Leave Ledger Entry**, không nằm ở ô
> *Total Leaves Allocated* — sửa ô đó chỉ làm màn hình đẹp lên mà số dư không đổi.

---

## 6. Số dư đọc **theo ngày**, không phải một con số cố định

Số dư luôn được tính **tại một ngày**: các đơn nghỉ **trong tương lai chưa bị trừ**.

Ví dụ thật: NV còn 1 ngày quỹ, đã nghỉ 0,5 ngày hôm 18/07 và có đơn 1 ngày cho 08/08.

| Xem tại ngày | Số dư hiện ra |
|---|---|
| 04/08 | **0,5** |
| sau 08/08 / cuối kỳ | **−0,5** |

Vì vậy: trước khi bấm Reduce, hãy xem số dư **cuối kỳ** trong report **Employee Leave Balance**,
đừng chỉ nhìn con số hôm nay.

---

## ⚠️ Lỗi thường gặp

| Thông báo | Nghĩa & cách xử |
|---|---|
| *No leave allocation found for … on given date* | NV chưa có Leave Allocation cho loại phép đó phủ Posting Date → cấp Allocation trước, hoặc sửa Posting Date về trong kỳ |
| Dropdown **Leave Type** trống trơn | NV chưa có Leave Allocation nào cả |
| Dropdown **Leave Type** hiện trùng tên 2 dòng | Mỗi Allocation một dòng (vd kỳ 6 tháng đầu + 6 tháng cuối) — chọn dòng nào cũng được, allocation thật do **Posting Date** quyết |
| *Leave Adjustment for this allocation already exists* | Đã có phiếu Submitted → **Cancel** nó rồi tạo mới (mục 4) |
| *Reduction is more than … available leave balance …* | Reduce vượt số dư tại Posting Date → giảm số, hoặc chuyển sang Nghỉ Không Lương |
| *Enter a non-zero value to adjust* | Bỏ trống / để 0 ô *Leaves to Adjust* |
| *Allocation is greater than the maximum allowed …* | Vượt **Maximum Leave Allocation Allowed** của Leave Type → chỉnh trần ở [Loại phép](Desk-HR-LoaiPhep.html) hoặc giảm số |
| Submit xong mà app của NV chưa đổi số | Kéo làm mới tab **Nghỉ phép**; vẫn sai thì mở **View Ledger** xem bút toán đã sinh chưa |

## Liên quan
- [Loại phép & số dư (cấp / trừ)](Desk-HR-LoaiPhep.html) · [Cấp phép & gán người duyệt](Desk-HR-CapPhep.html) · [Kiểm tra phép & báo cáo phép](Desk-HR-KiemTraPhep.html) · [Xin nghỉ phép & nghỉ bù](Guide-NhanVien-NghiPhep.html)
