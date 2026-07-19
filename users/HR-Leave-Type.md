---
title: Leave Type — Loại nghỉ phép
layout: default
grand_parent: Tài liệu kỹ thuật
parent: Chấm công & HR (kỹ thuật)
nav_order: 10
---

# Leave Type — Loại nghỉ phép & các flag

> Mỗi **Leave Type** định nghĩa 1 loại nghỉ + quy tắc của nó (có lương / không, cấp dần, chuyển kỳ, giới hạn ngày…). **Quyết định loại nào hiện trong dropdown app** và cách tính lương khi duyệt.

**Cách mở:** Desk → Search **"Leave Type"** · URL `/app/leave-type` · tạo mới `/app/leave-type/new`.

---

## 1. Loại nào hiện trong dropdown app khi tạo đơn?

PWA (tab Nghỉ phép → tạo đơn) lấy loại phép từ `get_leave_types_for_employee`:

- **Loại NV có Leave Allocation** (đã được cấp số dư) → hiện kèm số dư.
- **+ loại bật `is_lwp`** (nghỉ không lương) → **luôn hiện**, không cần allocation.
- **+ loại bật `is_compensatory`** (Nghỉ bù) → **luôn hiện** (fallback trong code), không cần allocation — dùng `allow_negative` nên số dư có thể âm.

> ⚠️ **Dropdown trống = NV chưa có Leave Allocation NÀO + không có loại nào bật `is_lwp` HAY `is_compensatory`** (hoặc các loại đó bị Disabled). → Tạo [Leave Allocation](HR-Leave-Setup.html) cho phép có lương, và/hoặc bật 1 loại `is_lwp` làm lưới an toàn.

---

## 2. Các flag (Check) quan trọng

| Flag | Ý nghĩa |
|---|---|
| **`is_lwp`** (Is Leave Without Pay) | **Nghỉ KHÔNG LƯƠNG.** Luôn chọn được, **không cần allocation**, không có số dư; khi duyệt → trừ lương ngày nghỉ. Nên có **ít nhất 1 loại** (vd "Leave Without Pay") làm lưới an toàn để NV chưa được cấp phép vẫn tạo được đơn. |
| **`is_earned_leave`** (Is Earned Leave) | Cấp **dần theo kỳ** (HRMS native), không cấp 1 cục. Đi kèm `earned_leave_frequency` (Cobe dùng **Monthly**). Chi tiết: [Leave Setup §2](HR-Leave-Setup.html#2-cấp-quỹ-phép-năm-earned-leave). |
| **`is_carry_forward`** (Is Carry Forward) | Số dư cuối kỳ **chuyển sang kỳ sau**. Đi kèm `maximum_carry_forwarded_leaves` (trần chuyển) + `expire_carry_forwarded_leaves_after_days` (hết hạn sau N ngày). |
| **`is_compensatory`** (Is Compensatory) | **Nghỉ bù** — **KHÔNG** có Leave Allocation, số dư **âm là bình thường** (dùng chung `allow_negative`). Căn cứ hợp lệ = **HR Overtime Request đã duyệt**, quy đổi payout **"Nghỉ bù"**, đúng ngày khai trong ô "Ngày làm thêm để bù" (validate `_validate_comp_ot_request`), mỗi ngày OT chỉ bù 1 lần. Loại này **luôn hiện trong dropdown** của NV (fallback trong code). Vd "Nghỉ bù". |
| **`is_optional_leave`** (Is Optional Leave) | Nghỉ lễ **tuỳ chọn** theo Optional Holiday List (NV tự chọn ngày lễ muốn nghỉ). |
| **`allow_negative`** (Allow Negative Balance) | Cho phép số dư **âm** (nghỉ vượt quỹ). Mặc định tắt. |
| **`allow_over_allocation`** | Cho cấp **vượt** `max_leaves_allowed`. |
| **`include_holiday`** | Ngày lễ rơi trong kỳ nghỉ **bị tính** là ngày nghỉ. |
| **`allow_encashment`** | Cho **quy đổi tiền** phép tồn (+ `max_encashable_leaves`, `non_encashable_leaves`). |
| **`is_ppl`** (Is Partially Paid Leave) | Nghỉ **một phần lương** (+ `fraction_of_daily_salary_per_leave`). |

---

## 3. Các field số / giới hạn

| Field | Ý nghĩa |
|---|---|
| `max_leaves_allowed` | Trần cấp tối đa **mỗi kỳ phép** cho loại này |
| `applicable_after` | Chỉ cho xin nghỉ **sau N ngày công** kể từ ngày vào làm (probation) |
| `max_continuous_days_allowed` | Số ngày nghỉ **liên tục** tối đa mỗi đơn |
| `earned_leave_frequency` | Tần suất cộng earned leave (Monthly / Quarterly / Half-Yearly / Yearly) |
| `rounding` | Làm tròn số dư earned leave (0.5 / 1…) |

---

## 4. Setup khuyến nghị (Cobe)

| Leave Type | Flag chính |
|---|---|
| **Annual Leave** | `is_earned_leave` + Monthly (phép năm cấp dần) |
| **Nghỉ ốm** | (cấp cố định qua Allocation/Policy) |
| **Nghỉ việc riêng** | (cấp cố định) |
| **Nghỉ bù** | `is_compensatory` (căn cứ HR Overtime Request quy đổi Nghỉ bù, số dư âm bình thường) |
| **Leave Without Pay** | `is_lwp` ✓ — **lưới an toàn, luôn để bật 1 loại** |

> 💡 Sau khi tạo/sửa Leave Type, muốn NV có số dư phải gắn qua **Leave Allocation** hoặc **Leave Policy Assignment** — `is_lwp` là ngoại lệ duy nhất không cần.

## Liên quan
- [Leave — Setup & Workflow](HR-Leave-Setup.html) · [Cấp phép & gán người duyệt (Desk)](Desk-HR-CapPhep.html)
