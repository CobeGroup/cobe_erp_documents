---
title: Holiday & Shift Setup
layout: default
grand_parent: Tài liệu kỹ thuật
parent: Chấm công & HR (kỹ thuật)
nav_order: 5
---

# Holiday & Shift — Cấu hình ca làm việc và ngày nghỉ

> Đối tượng: **HR Manager**, **System Manager**. Doc dùng cho onboarding HR mới và
> cho các thao tác định kỳ: gán ca NV mới, đổi ca NV cũ, chuyển năm.

> **Mô hình presence-based (quan trọng):** Cobe **KHÔNG mã hoá ngày nghỉ tuần** vào
> Holiday List (cuối tuần tùy biến theo từng người/phòng). Dùng **Attendance để ghi
> nhận ngày ĐI LÀM** (Present/Half tạo từ check-in); ngày không có check-in để
> **trống = nghỉ**, KHÔNG bị chấm Vắng.
>
> Để làm được, Cobe override `Shift Type` (class `CobeShiftType`) **vô hiệu phần tự
> chấm Vắng** của HRMS. Vắng thật (trốn làm, không xin phép) bắt bằng job "quên chấm
> công" 21h + xử lý thủ công / Leave.
>
> **Ngoại lệ duy nhất:** thứ 7 nửa ngày của khối văn phòng ĐƯỢC mã hoá — bằng
> `is_half_day = 1`, **không** phải weekly-off. Xem [mục 2](#2-holiday-list).

## Sơ đồ quy trình setup

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontSize':'16px'},'flowchart':{'nodeSpacing':50,'rankSpacing':55}}}%%
flowchart TD
  classDef process fill:#e6f4ff,stroke:#299dd8,stroke-width:1.5px,color:#0b4a6f;
  classDef good fill:#f6ffed,stroke:#54ab78,stroke-width:1.5px,color:#135200;

  A["Holiday List (ngày lễ + T7 nửa ngày)"] --> C["Shift Type: giờ vào/ra + Holiday List"]
  A --> B["Holiday List Assignment<br/>(Employee / Company, theo from_date)"]
  C --> D["Shift Assignment cho Employee"]
  D --> E["Process Auto Attendance (CobeShiftType):<br/>check-in → Present/Half; KHÔNG tự chấm Vắng"]
  B --> F["Nghỉ phép · OT · Bảng lương"]

  class A,B,C,D process
  class E,F good
```

## Mục lục

1. [Ba nguồn dữ liệu phải đồng bộ](#1-ba-nguồn-dữ-liệu-phải-đồng-bộ)
2. [Holiday List](#2-holiday-list)
3. [Holiday List Assignment](#3-holiday-list-assignment)
4. [Shift Type](#4-shift-type)
5. [Gán ca + ngày nghỉ cho NV mới](#5-gán-ca--ngày-nghỉ-cho-nv-mới)
6. [Đổi ca cho NV đang làm](#6-đổi-ca-cho-nv-đang-làm)
7. [Chuyển năm (rollover)](#7-chuyển-năm-rollover)
8. [Kết nối với chấm công Cobe](#8-kết-nối-với-chấm-công-cobe)

---

## 1. Ba nguồn dữ liệu phải đồng bộ

Từ **29/07/2026**, ô `holiday_list` trên **mọi Shift Type đã được xoá trống**. Lý do:
nhiều nhóm nhân viên **dùng chung một ca nhưng lịch nghỉ khác nhau** (KTV làm thứ 7
nguyên ngày, khối tỉnh nghỉ thứ 2 làm Chủ nhật) — gắn lịch nghỉ vào ca thì không diễn
đạt nổi. Ngày nghỉ giờ **resolve hoàn toàn qua Holiday List Assignment**.

Thứ tự resolve: **HLA của Employee** (bản `from_date` ≤ ngày đang xét, mới nhất) →
**HLA của Company** → không có thì coi như không có ngày nghỉ nào.

Ba nguồn phải luôn trỏ về **cùng một Holiday List** cho mỗi nhân viên:

| Nguồn | Nhánh nào đọc | Sai thì hậu quả |
|---|---|---|
| **Holiday List Assignment** (HLA) | Chấm công tự động, nghỉ phép (số ngày bị trừ), OT (`is_rest_day`), Salary Slip | Thứ 7 không được chia đôi ngưỡng → **Half Day oan**; ngày lễ bị **trừ vào phép năm**; OT ngày lễ áp sai trần |
| **`Employee.holiday_list`** (field trên hồ sơ NV) | Payroll Entry (đếm ngày lễ khi tính unmarked attendance) + ký hiệu **H / WO** trên report | Công và lương bất đồng |
| **`Company.default_holiday_list`** | Fallback cuối của report và của `is_rest_day` | Chỉ ảnh hưởng khi 2 nguồn trên trống |

> ⚠️ **Đừng gắn lại `holiday_list` vào Shift Type.** Nó **đè lên HLA** ở nhánh chấm
> công (`ShiftType.get_holiday_list` ưu tiên ô trên ca) trong khi nghỉ phép và lương
> vẫn đọc HLA → hai nhánh tính theo hai lịch khác nhau, sai âm thầm tới kỳ lương.

> 🐞 **Vấn đề đã biết — cột *Tổng giờ chuẩn* trên report.** Report *Bảng chấm công
> Cobe* vẫn đang lấy danh sách thứ 7 nửa ngày từ `Shift Type.holiday_list`
> (`_shift_half_holiday_dates`). Ô đó nay trống nên cột này **cộng nguyên ca cho thứ 7**
> của khối văn phòng — cao hơn thực tế khoảng **4h/tuần/người**. Đang chờ vá sang đọc
> theo HLA. Trong lúc chờ, đối chiếu lương thì dùng cột *Tổng giờ thực*.

---

## 2. Holiday List

> Holiday List chứa **ngày lễ** (nghỉ trọn) và **thứ 7 nửa ngày** (`is_half_day = 1`)
> cho khối văn phòng. **KHÔNG** bấm *Get Weekly Off Dates* — nút đó tạo dòng
> `weekly_off = 1` nghỉ TRỌN, phá mô hình presence-based.

### Ba list đang dùng (2026)

| Holiday List | Nội dung | Dùng cho nhóm |
|---|---|---|
| `HL - Lễ VN - CN - 2026` | 51 Chủ nhật `weekly_off` + 12 ngày lễ = **63** | KTV · Kho · Migunlife · AKW Sáng/Chiều |
| `HL - Lễ VN - CN Và Nửa Ngày Thứ 7 - 2026` | như trên + **52 thứ 7 `is_half_day`** = **115** | Office · Office Kế Toán · Management |
| `HL - Lễ VN - Thứ 2 - 2026` | 50 thứ 2 `weekly_off` + 12 ngày lễ = **62** | Khối tỉnh làm **T3–CN**, nghỉ thứ 2 |

List thứ 2 **không chứa Chủ nhật** (nhóm này làm Chủ nhật), và 2 ngày lễ rơi đúng thứ 2
(16/02 Giao thừa, 27/04 Giỗ Tổ nghỉ bù) được ghi là **ngày lễ** chứ không phải nghỉ tuần —
để report hiện `H` thay vì `WO` và không bị các hàm "bỏ qua weekly-off" loại mất.

Vì sao dùng `is_half_day` mà không dùng weekly-off: `is_holiday()` của ERPNext lọc
`is_half_day = 0`, nên thứ 7 **không** bị coi là ngày nghỉ trọn (chấm công vẫn chạy
bình thường); còn `is_half_holiday()` thì bắt được nó để **chia đôi ngưỡng giờ công**
→ NV làm 4h sáng thứ 7 vẫn ra Present thay vì Half Day.

### Tạo / sửa Holiday List

1. Desk → search "Holiday List" → New (hoặc mở list có sẵn).
2. `Holiday List Name` + `From Date` / `To Date` (01/01 → 31/12 của năm).
3. Bảng **Holidays** → Add Row → điền `Date`, `Description`, tích `Is Half Day` nếu
   chỉ nghỉ nửa buổi → ESC → Save.
4. Ngày lễ VN có thể lấy nhanh: `Country = Vietnam` → **Get Local Holidays**.

> Holiday List **không submittable** → sửa thoải mái. Nhưng thêm ngày nằm ngoài
> khoảng `From Date`–`To Date` sẽ bị chặn → muốn nối dài sang năm sau thì **nới
> `To Date` trước**.

---

## 3. Holiday List Assignment

Doctype `Holiday List Assignment` (HLA) là cách HRMS gắn Holiday List **theo thời
gian**. Đây là thứ trả lời câu hỏi "sang năm mới thì đổi ở đâu".

| Field | Ý nghĩa |
|---|---|
| `applicable_for` | `Employee` hoặc `Company` |
| `assigned_to` | NV hoặc công ty |
| `holiday_list` | List áp dụng |
| `from_date` | **Ngày bắt đầu hiệu lực** — bản có `from_date` lớn nhất mà ≤ ngày đang xét sẽ thắng |

Đặc tính cần nhớ:

- **Submittable, không sửa được sau khi Submit** (không field nào `allow_on_submit`).
  Muốn đổi → **tạo bản mới với `from_date` mới**, KHÔNG cancel bản cũ. Cancel bản cũ
  = xoá lịch sử → tính lại công/lương/phép của giai đoạn cũ sẽ sai.
- **1 NV chỉ được 1 HLA cho mỗi `from_date`** (`validate_existing_assignment`).
- `from_date` **phải nằm trong** khoảng `From Date`–`To Date` của Holiday List
  (`validate_assignment_start_date`) → tạo Holiday List trước, HLA sau.
- HLA của Employee thắng HLA của Company. Cả 3 công ty đều đã có HLA nên NV thiếu HLA
  vẫn có lưới đỡ — nhưng lưới đó là list **không có T7 nửa ngày**.

Xem/tạo: Desk → search **"Holiday List Assignment"**, hoặc workspace **Leaves** →
mục *Holiday List Assignment*.

### 3.1 Gán cho một người (trên Desk)

1. `/app/holiday-list-assignment/new`
2. `Applicable For` = **Employee** → chọn nhân viên.
3. Chọn **Holiday List**.
4. ⚠️ **Sửa lại `From Date`.** Khi chọn Holiday List, hệ thống **tự điền `From Date`
   = ngày bắt đầu của list** (01/01). Phải sửa thành ngày áp dụng thật (vd 01/08/2026),
   không thì trùng mốc với bản cũ → báo *Duplicate Assignment*.
5. **Save → Submit.** Không Submit là bản đó vô hiệu, hệ thống không nhìn thấy.

### 3.2 Gán hàng loạt

HRMS **không có tool bulk cho HLA** (chỉ Shift Assignment mới có tool). Hai cách:

**Cách A — Server Script (khuyên dùng, tự suy danh sách theo ca).**
Script: `hr_for_cobegroup/scripts/assign_holiday_list_serverscript.py`. Dựng một lần:
Desk → New Server Script · Script Type = **API** · API Method Name =
`cobe_assign_holiday_list` · dán toàn bộ nội dung file.

```
/api/method/cobe_assign_holiday_list?action=check   → SOI TRƯỚC (chỉ đọc)
/api/method/cobe_assign_holiday_list?action=run     → THỰC THI
```

Tham số phụ, nối bằng `&`, danh sách ngăn bằng dấu phẩy:

| Tham số | Tác dụng |
|---|---|
| `employees=HR-EMP-0018,HR-EMP-0272` | **chỉ** xử lý những người này (bỏ trống = mọi NV Active) |
| `list=<tên Holiday List>` | ép list cho cả đợt, bỏ qua suy theo ca (nhớ URL-encode) |
| `from_date=2026-09-01` | đổi mốc hiệu lực (mặc định 01/08/2026) |

Cách script chọn list, ưu tiên trên xuống: `list=` ép cứng → danh sách nghỉ thứ 2 →
map theo ca (Office / Office Kế Toán / Management → list có T7 nửa ngày; ca khác →
list CN). **NV không có ca thì script KHÔNG đoán** — nó liệt kê riêng để mình tự
quyết bằng `employees=...&list=...`, tránh gán nhầm lịch nghỉ cho người thật.

Script chỉ tạo HLA cho ai có list mong muốn **khác** list đang hiệu lực, đồng bộ luôn
`Employee.holiday_list`, và **không bao giờ đè** bản đã tồn tại ở cùng mốc — gặp thì
liệt kê vào mục "đụng độ" để xử tay.

Ví dụ gán nhóm tỉnh làm T3–CN:
```
...?action=check&employees=HR-EMP-0018,HR-EMP-0272&list=HL%20-%20L%E1%BB%85%20VN%20-%20Th%E1%BB%A9%202%20-%202026
```

**Cách B — Data Import** (khi đã có sẵn danh sách mã NV):
Desk → Data Import → New · Document Type = `Holiday List Assignment` · Import Type =
*Insert New Records* · tick **Submit After Import**. Cột cần có:

| applicable_for | assigned_to | holiday_list | from_date |
|---|---|---|---|
| Employee | HR-EMP-0009 | HL - Lễ VN - CN - 2026 | 2026-08-01 |

`naming_series` có default nên không cần cột.

### 3.3 Kiểm tra sau khi gán

```sql
-- (a) NV Active thiếu HLA hiệu lực — kỳ vọng 0
SELECT COUNT(*) FROM tabEmployee e WHERE e.status='Active' AND NOT EXISTS (
  SELECT 1 FROM `tabHoliday List Assignment` h WHERE h.assigned_to=e.name
    AND h.applicable_for='Employee' AND h.docstatus=1 AND h.from_date<=CURDATE());

-- (b) Employee.holiday_list lệch HLA — kỳ vọng 0
SELECT COUNT(*) FROM tabEmployee e WHERE e.status='Active'
  AND IFNULL(e.holiday_list,'') <> IFNULL((SELECT h.holiday_list
    FROM `tabHoliday List Assignment` h WHERE h.assigned_to=e.name
      AND h.applicable_for='Employee' AND h.docstatus=1 AND h.from_date<=CURDATE()
    ORDER BY h.from_date DESC LIMIT 1),'');

-- (c) Ca × list đang hiệu lực — soi xem nhóm nào đang dùng list nào
SELECT sa.shift_type, (SELECT h.holiday_list FROM `tabHoliday List Assignment` h
    WHERE h.assigned_to=sa.employee AND h.applicable_for='Employee' AND h.docstatus=1
      AND h.from_date<=CURDATE() ORDER BY h.from_date DESC LIMIT 1) lst, COUNT(*)
FROM `tabShift Assignment` sa JOIN tabEmployee e ON e.name=sa.employee AND e.status='Active'
WHERE sa.docstatus=1 AND sa.status='Active'
  AND (sa.end_date IS NULL OR sa.end_date>=CURDATE()) GROUP BY 1,2;

-- (d) Ca còn sót holiday_list — kỳ vọng 0 dòng
SELECT name, holiday_list FROM `tabShift Type` WHERE IFNULL(holiday_list,'')<>'';
```

Câu (c) là câu quan trọng nhất: một ca ra **nhiều list** thì hoặc là cố ý (nhóm tỉnh
nằm chung ca với người khác), hoặc là sót người — phải giải thích được từng dòng.

### 3.4 Thời điểm chạy — tránh đụng lương

Salary Slip resolve holiday list theo **ngày hôm nay**, không theo kỳ lương
(`salary_slip.py` gọi `get_holiday_list_for_employee` không truyền `as_on`). Nên nếu
đổi HLA rồi mới **tính lại** phiếu lương của kỳ trước, nó sẽ dùng list MỚI.

→ **Chốt xong lương kỳ trước rồi mới chạy gán HLA.** Chấm công, nghỉ phép, OT không
dính vì đều truyền đúng ngày đang xét.

---

## 4. Shift Type

### Cấu hình hiện tại (8 ca đang bật auto attendance)

| Shift Type | Giờ | Ngưỡng half-day | Nghỉ trưa | `holiday_list` |
|---|---|---|---|---|
| ST - Office | 08:00–17:30 | 7,5h | 90' | **trống** |
| ST - Office Kế Toán | 08:00–17:00 | 7,5h | 60' | **trống** |
| ST - Management | 08:00–17:30 | 7,5h | 90' | **trống** |
| ST - KTV | 08:00–17:30 | 7,5h | 90' | **trống** |
| ST - Kho | 08:00–17:30 | 7,5h | 90' | **trống** |
| ST - Migunlife | 07:00–17:00 | 7,0h | 60' | **trống** |
| ST - AKW Sáng | 08:00–14:00 | 5,0h | 0' | **trống** |
| ST - AKW Chiều | 14:00–20:00 | 5,0h | 0' | **trống** |

Ô `holiday_list` để trống là **cố ý** — ngày nghỉ đi theo từng nhân viên qua HLA, không
theo ca ([mục 1](#1-ba-nguồn-dữ-liệu-phải-đồng-bộ)). Điền lại vào đây là làm hai nhánh
tính theo hai lịch khác nhau.

`ST - Office` và `ST - KTV` giờ giấc **giống hệt nhau**; chúng tách nhau chỉ để phân
nhóm và để report tách dòng, còn khác biệt thật nằm ở Holiday List Assignment.

Cấu hình chung: `Enable Auto Attendance` ✓ · `Determine Check-in and Check-out` =
**Strictly based on Log Type in Employee Checkin** (PWA Cobe set `log_type` rõ ràng) ·
`Working Hours Threshold for Absent` = 0 (không tự chấm Vắng) · `Process Attendance
After` = 2026-07-01.

### Sửa giờ ca — cảnh báo

`Start Time` / `End Time` của Shift Type ảnh hưởng **mọi NV đang gán ca đó, kể cả
quá khứ**. Muốn nhóm nào đó có giờ khác → **tạo Shift Type mới** rồi chuyển ca cho họ
([mục 6](#6-đổi-ca-cho-nv-đang-làm)), đừng sửa ca đang chạy.

Nếu bắt buộc phải sửa: làm **ngoài giờ làm việc**, sau khi mọi người đã check-out và
auto attendance đã xử lý xong ngày đó. Sửa giữa ngày sẽ làm log sáng và log chiều mang
hai mốc ca khác nhau → Attendance ra Half Day 0h rồi log bị `skip_auto_attendance`
vĩnh viễn (sự cố 22/07/2026, 89 log phải gỡ tay). Override `get_employee_checkins`
đã vá phần lệch mốc này, nhưng đừng thử lại.

### Luật riêng của Cobe (CobeShiftType)

Code: `hr_for_cobegroup/overrides/shift_type.py`, khai báo qua `override_doctype_class`.

| Override | Tác dụng |
|---|---|
| `mark_absent_for_dates_with_no_attendance` | **no-op** → không tự chấm Vắng ngày trống |
| `is_half_holiday` | Mở rộng: ngày có **đơn nghỉ nửa ngày đã duyệt** cũng chia đôi ngưỡng |
| `get_attendance` | Ngày lễ/Chủ nhật → ép Present (để OT native trả tiền); ngày thường vào trễ → Half Day |
| `get_employee_checkins` | Giữ trọn nhóm IN/OUT khi cửa sổ ca đổi giữa ngày |

> Luật **"vào trễ 1 phút = nửa ngày"** chỉ chạy khi Shift Type bật
> `Enable Late Entry Marking` = ✓ và `Late Entry Grace Period` = 0. Hiện **cả 8 ca
> đang tắt** → luật này không có hiệu lực. Bật hay không là quyết định chính sách của HR.

> ⚠️ **Thứ tự deploy:** phải deploy override **TRƯỚC** khi bật auto attendance lần
> đầu, kẻo cuối tuần bị chấm Vắng oan.

---

## 5. Gán ca + ngày nghỉ cho NV mới

**Ba món, không phải hai.** Làm thiếu món nào cũng không có thông báo lỗi — sai sẽ
lòi ra ở kỳ lương.

| # | Việc | Thao tác |
|---|---|---|
| 1 | **Shift Assignment** | New → Employee + Shift Type + `Start Date` = ngày vào làm, để trống `End Date` → **Submit** |
| 2 | **Holiday List Assignment** | New → `applicable_for = Employee`, `assigned_to` = NV, `holiday_list` = list **của nhóm NV đó** (bảng [mục 2](#2-holiday-list)), `from_date` = ngày vào làm → **Submit**. Nhớ sửa lại `From Date` sau khi chọn list ([mục 3.1](#31-gán-cho-một-người-trên-desk)) |
| 3 | **`Employee.holiday_list`** | Mở hồ sơ Employee → tab *Attendance & Leave Details* → chọn **đúng list vừa gán ở bước 2** → Save |

Quên món nào thì sao:

- **Quên Shift Assignment** → check-in vẫn lưu nhưng **không ra Attendance**, NV bị
  gắn cờ "Không có ca".
- **Quên HLA** → rơi về HLA của công ty = `HL - Lễ VN - CN - 2026` (**không có T7 nửa
  ngày**). NV văn phòng sẽ bị **Half Day mỗi thứ 7**; NV kỹ thuật/kho thì vô hại; NV
  khối tỉnh làm T3–CN thì sai cả hai đầu (thứ 2 tính là ngày làm, Chủ nhật tính là nghỉ).
- **Quên `Employee.holiday_list`** → Payroll Entry đếm sai số ngày lễ; report hiện
  sai ký hiệu H/WO.

Vì ngày nghỉ **không còn suy ra từ ca**, món 2 là bắt buộc cho mọi NV mới — không có
chuyện "gán ca là xong".

> **Không cần** điền `Default Shift` trên hồ sơ Employee. Toàn bộ 141 NV Active hiện
> để trống field này — Shift Assignment là nguồn ca duy nhất. Điền vào chỉ tạo ca "ma"
> cho những ngày hở Shift Assignment.

---

## 6. Đổi ca cho NV đang làm

Gọi **X** = ngày ca mới bắt đầu có hiệu lực. **X phải từ ngày mai trở đi** — không
đổi ca có hiệu lực trong hôm nay, và không backdate.

### Bước 1 — Đóng ca cũ

Mở Shift Assignment đang chạy (Submitted, `Status = Active`, `End Date` trống) →
sửa **`End Date` = X trừ 1 ngày** → Update.

`End Date` và `Status` là hai field duy nhất sửa được sau khi Submit, nên **không
cần** cancel hay amend.

### Bước 2 — Tạo ca mới

New Shift Assignment → Employee + Shift Type mới + `Start Date` = X, `End Date` để
trống → **Submit**.

Phải làm **đúng thứ tự này**. Tạo bản mới trước khi đóng bản cũ sẽ bị chặn với lỗi
*Overlapping Shifts* / *Multiple Shift Assignments*.

### Bước 3 — Ngày nghỉ (chỉ khi đổi **nhóm** ca)

Nếu ca mới thuộc nhóm Holiday List khác (VD `ST - KTV` → `ST - Office`):

1. Tạo **HLA mới**: `from_date` = X, `holiday_list` = list của nhóm mới → Submit.
   **Không** sửa, **không** cancel HLA cũ.
2. Cập nhật `Employee.holiday_list` sang list mới.

Đổi ca **trong cùng nhóm** (VD `ST - Office` → `ST - Office Kế Toán`) thì bỏ qua
bước này.

### Những việc KHÔNG được làm

| Việc | Vì sao |
|---|---|
| Sửa `Shift Type` trên Shift Assignment đã Submit | Field không sửa được sau Submit → phải cancel + amend, mà `on_cancel` chặn ngay khi đã có Employee Checkin hoặc Attendance trong khoảng đó. Ép được cũng là viết lại lịch sử: Attendance cũ vẫn giữ ca cũ |
| Cancel / xoá Shift Assignment cũ thay vì set `End Date` | Như trên. Cancel chỉ dành cho bản **tạo nhầm, chưa ai check-in** |
| Đổi ca có hiệu lực **hôm nay / giữa ngày** | Employee Checkin đóng dấu mốc ca ngay lúc tạo log → log sáng và log chiều lệch mốc → Attendance sai, log bị skip vĩnh viễn |
| Backdate Shift Assignment để sửa công quá khứ | Không sinh lại Attendance. Vá công quá khứ bằng **Attendance Request** hoặc sửa Attendance tay |
| Đổi ca mà quên HLA | Không có cảnh báo nào. Thứ 7 sai âm thầm đến kỳ lương |

---

## 7. Chuyển năm (rollover)

Holiday List có thời hạn theo năm, nên **cuối mỗi năm phải làm 3 việc**. Nên làm
trong tháng 12, **sau khi đã chốt lương tháng 12** (xem [mục 3.4](#34-thời-điểm-chạy--tránh-đụng-lương)).

| # | Việc | Ghi chú |
|---|---|---|
| 1 | Tạo **3 Holiday List** của năm mới | `... CN - <năm>` · `... CN Và Nửa Ngày Thứ 7 - <năm>` · `... Thứ 2 - <năm>`. From/To = 01/01–31/12. Bơm 12 ngày lễ VN vào **cả ba**; list 2 thêm mọi thứ 7 `Is Half Day` ✓; list 3 thêm mọi thứ 2 `Weekly Off` ✓ và **không** có Chủ nhật |
| 2 | Tạo **HLA mới** `from_date = 01/01/<năm>` | Cho **3 công ty** + **từng NV Active**, trỏ list đúng nhóm. HLA cũ giữ nguyên, không cancel |
| 3 | Cập nhật `Company.default_holiday_list` và `Employee.holiday_list` | Sang list năm mới, đúng nhóm |

**Không còn bước đổi Holiday List trên Shift Type** — ô đó đã bỏ trống hẳn từ 29/07/2026.

Bước 2 làm tay 140+ bản là không thực tế → chạy
`scripts/assign_holiday_list_serverscript.py` với `&from_date=<năm>-01-01`
([mục 3.2](#32-gán-hàng-loạt)). Nhớ sửa 3 hằng số tên list ở đầu file sang tên của năm
mới, rồi `check` trước, `run` sau.

### Nếu quên rollover

Không có lỗi nào hiện ra, hệ thống chạy tiếp với list năm cũ:

- **Nặng nhất:** 52 ngày thứ 7 nửa buổi biến mất → NV văn phòng làm ~4h thứ 7 bị đem
  so với ngưỡng cả ngày (7,5h) → **Half Day oan hàng tuần cho ~120 người**.
- Ngày lễ không được nhận → OT ngày lễ áp trần/hệ số ngày thường (thiệt tiền NV).
- Đơn nghỉ vắt qua Tết bị trừ cả ngày lễ vào phép năm.

### Kiểm tra sau rollover

1. Chạy 4 câu SQL ở [mục 3.3](#33-kiểm-tra-sau-khi-gán) — (a) (b) (d) phải ra 0, câu
   (c) phải giải thích được từng dòng.
2. Mở một NV mỗi nhóm → xem HLA hiệu lực có đúng list của năm mới.
3. Thử tạo nháp một Leave Application vắt qua ngày lễ → số ngày trừ phải bỏ qua ngày lễ.
4. Với NV khối tỉnh: đơn nghỉ vắt qua **thứ 2** không bị trừ, vắt qua **Chủ nhật** thì bị trừ.

---

## 8. Kết nối với chấm công Cobe

### Khi NV check-in từ PWA

1. API `attendance.checkin` insert Employee Checkin (log thô), đóng dấu ca tại thời
   điểm tạo log.
2. Scheduled job `Process Auto Attendance` chạy định kỳ.
3. Job nhóm log theo (employee, ca, ngày) → tạo/cập nhật `Attendance`.
4. Hook `Attendance.before_save` của Cobe: fill `working_hours` khi WFH/On Duty không
   có log; cắt giờ theo giờ tan ca (trừ ngày nghỉ); trừ nghỉ trưa; set
   `hr_warning_type`.

### Khi NV xin nghỉ

Leave Application duyệt xong → HRMS tạo Attendance "On Leave". Số ngày bị trừ tính
theo **HLA**, nên HLA sai là phép năm sai.

### Vắng (Absent) — KHÔNG tự chấm

Ngày không có check-in để **trống = nghỉ**. Bảng công tháng chỉ có Present / Half Day
/ On Leave. Vắng thật bắt qua job "quên chấm công" 21h + xử lý thủ công.

### Job nhắc quên chấm công (21:00)

Chỉ quét NV **có Shift Assignment** hôm nay. NV không có ca sẽ bị bỏ qua hoàn toàn.

---

## Liên quan

- [Ca làm việc & gán ca (thao tác)](Desk-Admin-Shift.html) — bản ngắn cho HR
- [Ngày lễ (thao tác)](Desk-Admin-Holiday.html)
- [HR Policy](HR-Policy.html) — feature flag + whitelist
- [HR Leave Setup](HR-Leave-Setup.html) — workflow 2 bước + Earned Leave
- [Tổng quan Chấm công](Cham-Cong-Tong-Quan.html)
