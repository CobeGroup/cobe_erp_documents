---
title: Ví dụ — Vận hành theo phòng ban (Sales / KTV)
layout: default
grand_parent: Tài liệu kỹ thuật
parent: Chấm công & HR (kỹ thuật)
nav_order: 13
---

# Ví dụ: Vận hành A-Z theo phòng ban (Sales / KTV)

> Đây là **ví dụ cụ thể** áp dụng cho 2 phòng ban điển hình. Tài liệu **generic**
> (khái niệm + cấu hình chi tiết từng phần) xem:
> - **Tổng quan & Setup** (vận hành chung A-Z) — `Cham-Cong-Tong-Quan`
> - Các doc feature: **HR Policy**, **HR Office Location**, **HR Checkin Phone
>   Registration**, **HR Attendance Request**, **HR Leave Setup**, **HR WFH Approval**...
>
> Doc này gói lại thành **kịch bản thực tế** cho Sales (đi thị trường) và KTV
> (bảo dưỡng hiện trường), kèm luồng duyệt Manager/HR và xem báo cáo.

Tài liệu hướng dẫn HR/Admin **cài đặt một phòng ban từ đầu** + **luồng duyệt** + **xem báo cáo**.
Ví dụ cụ thể: **Phòng Sales** và **Phòng Bảo dưỡng (kỹ thuật viên)**.

> Quy ước: **Desk** = giao diện quản trị `/app` (HR/Admin). **my-workspace** = app điện thoại
> nhân viên (`/my-workspace`). Backend ưu tiên dùng HRMS native (chi tiết kỹ thuật: mục Tài liệu kỹ thuật).

---

## 0. Khái niệm nền (đọc 1 lần cho khỏi lẫn)

| Khái niệm | Là gì |
|---|---|
| **User** | Tài khoản đăng nhập (email + mật khẩu + roles). |
| **Employee** | Hồ sơ nhân sự (ca, người duyệt, phòng ban...). 1 Employee ↔ 1 User qua `Employee.user_id`. |
| **HR Policy** | Cấu hình chấm công **theo từng Company** (cờ tính năng, bán kính GPS, nghỉ trưa, whitelist). |
| **HR Office Location** | Văn phòng + toạ độ GPS + bán kính (+ wifi/LAN tuỳ chọn). |
| **HR Checkin Phone Registration** | Đăng ký + duyệt **thiết bị** điện thoại của NV trước khi chấm công. |
| **Cấp quỹ phép (Leave Allocation)** | Số dư phép. Phép năm tự cộng vào đây — **không qua duyệt**. |
| **Đơn xin nghỉ (Leave Application)** | Khi NV **dùng** phép — qua **workflow 2 bước**. |
| **Attendance Request** | Chấm công bù / công tác / WFH — duyệt 1 bước qua tab "Cần duyệt". |

**Ai thấy tab gì trên my-workspace:**
- Tab **"Cần duyệt"**: user có role trong `viewer_roles` của HR Approval Inbox Settings (mặc định **Leave Approver / HR Manager / System Manager**).
- Tab **"FSM"**: employee có **FS Service Resource** (kỹ thuật viên).
- Tab **"Chấm công" / "Nghỉ phép" / "Chi phí" / "Thêm"**: luôn hiện.
- **System Manager**: thấy **TẤT CẢ tab** (gồm Cần duyệt + FSM) bất kể điều kiện trên.

---

## 1. Setup chung (làm 1 lần cho mỗi Company)

### 1.1. HR Policy (Desk → **HR Policy**, 1 record / Company)

| Trường | Khuyến nghị | Ý nghĩa |
|---|---|---|
| `company` | (chọn công ty) | Mỗi Company 1 record |
| `enable_selfie_capture` | tuỳ | Bắt chụp selfie khi chấm công |
| `enable_wfh_mode` | bật nếu cho WFH | Mở luồng WFH |
| `enable_wifi_bssid_check` / `enable_webrtc_check` | off (bật khi đã thu thập wifi/subnet) | Chống giả GPS |
| `enforce_checkout_same_office` | 1 | Check-out phải cùng VP check-in sáng |
| `default_radius_m` | 100 | Bán kính GPS mặc định (m) |
| `duplicate_window_seconds` | 60 | Chặn chấm công trùng < N giây |
| `lunch_start_time` / `lunch_break_minutes` | 12:00 / 60 | Tự trừ giờ nghỉ trưa khi tính công |
| `notify_overtime_threshold_minutes` | 30 | Ngưỡng cảnh báo OT |
| `whitelist_employees` (bảng con) | thêm NV đi ngoài | NV trong bảng này **bỏ qua check GPS** (xem §2/§3) |

### 1.2. HR Office Location (Desk → **HR Office Location**)
Tạo mỗi văn phòng 1 record: `office_label`, `company`, `location_latitude`, `location_longitude`,
`allowed_radius_m` (để trống = dùng `default_radius_m`), `is_active=1`. Tuỳ chọn: thêm
`allowed_wifi_bssids` / `allowed_lan_subnets` nếu bật check wifi/LAN.

### 1.3. Roles (Desk → User của manager/HR)
- **Manager** (người duyệt bước 1): gán role **Leave Approver**, và set `Employee.leave_approver`
  của từng nhân viên = user manager đó.
- **HR** (duyệt bước 2 + duyệt thiết bị): gán role **HR Manager**.

### 1.4. HR Approval Inbox Settings (đã seed sẵn — kiểm tra)
Mặc định đã cấu hình 2 dòng (Leave Application + Attendance Request) với
`viewer_roles = approver_roles = "Leave Approver, HR Manager, System Manager"`,
`restrict_to_leave_approver = 1` (manager chỉ thấy đơn của NV mình phụ trách).
→ Muốn đổi ai thấy/duyệt cái gì thì sửa ở đây, **không cần code**.

### 1.5. Phép năm tự cộng (Earned Leave — HRMS native)
1. Desk → **Leave Type** (vd "Annual Leave"): bật `Is Earned Leave`, `Earned Leave Frequency = Monthly`,
   `Allocate On Day = Last Day`, đặt `Maximum Leave Allocation Allowed` (vd 12).
2. Desk → **Leave Policy** + **Leave Policy Assignment** cho từng NV (hoặc theo nhóm) → tạo Leave Allocation.
3. Cuối mỗi tháng HRMS **tự +1 ngày** vào quỹ — **không qua duyệt, không tạo leave nháp**.
   (Earned Leave native cấp phẳng theo lịch; **không** tính thâm niên / prorate ngày lẻ.)

### 1.6. Holiday List + Shift Type + Shift Assignment (HRMS — để có Attendance & báo cáo)

> Đây là cấu hình **HRMS chuẩn**, quyết định check-in có biến thành Attendance hay không.
> Chi tiết đầy đủ xem doc **HR Holiday & Shift Setup**. Tóm tắt bước tối thiểu:

**a. Holiday List** (Desk → **Holiday List**) — danh sách nghỉ/lễ:
- `holiday_list_name`, `from_date`/`to_date` (cả năm); chọn **`weekly_off`** (vd "Sunday") rồi
  bấm **Get Weekly Off Dates** để tự thêm cuối tuần; thêm tay các ngày lễ.
- Gán làm **Default Holiday List** cho Company (Company → Default Holiday List), hoặc gán riêng
  ở Shift Type / Employee.
- → Ngày trong Holiday List **không bị mark Absent**.

**b. Shift Type** (Desk → **Shift Type**) — định nghĩa ca:
- `start_time` / `end_time` (vd 08:00 / 17:00), gán `holiday_list`.
- Bật **`Enable Auto Attendance`**.
- `working_hours_calculation_based_on` (First Check-in & Last Check-out),
  `working_hours_threshold_for_half_day` / `working_hours_threshold_for_absent` (ngưỡng nửa ngày / vắng).
- `process_attendance_after` (chỉ xử lý từ ngày này); grace: `late_entry_grace_period` /
  `early_exit_grace_period`; bật `enable_late_entry_marking` / `enable_early_exit_marking` nếu cần.
- → Job HRMS **"Process Auto Attendance"** (~15 phút/lần) gom Employee Checkin → tạo **Attendance**
  (Present / Absent / Half Day...) theo ca.

**c. Shift Assignment / Default Shift** — gán ca cho NV:
- Nhanh: Employee → `Default Shift`. Hoặc tạo **Shift Assignment** (có bulk assign nhiều NV).
- → NV **phải có ca** thì check-in mới sinh Attendance + mới vào danh sách "nhắc quên chấm công".

⚠️ Thiếu **Holiday List** → cuối tuần/lễ bị tính Absent. Thiếu **Shift Type/assignment** →
check-in không thành Attendance → **báo cáo tháng (§6) trống**.

---

## 2. Phòng SALES — setup A-Z

**Đặc điểm:** sales hay đi gặp khách ngoài VP → thường **whitelist** (bỏ check GPS) hoặc chấm tại VP.

1. **Tạo Employee** (Desk → Employee): điền tên, `Company`, `Department = Sales`, `Designation`,
   `user_id` (link tới User), `leave_approver` = manager sales,
   **`Default Shift`** = ca hành chính (vd 08:00–17:00) + **Holiday List** (xem §1.6).
2. **Gán role cho User**: tối thiểu **Employee** (để dùng my-workspace).
3. **(Tuỳ) Whitelist GPS**: nếu sales đi ngoài → Desk → HR Policy (Company tương ứng) →
   bảng `whitelist_employees` → thêm NV này (ghi `reason` = "Sales đi thị trường").
   → NV này chấm công **không bị chặn theo bán kính VP**, GPS chỉ lưu để audit.
   (Nếu sales luôn ở VP thì **bỏ qua bước này**, để check GPS bình thường.)
4. **Nhân viên cài app**: mở `https://<domain>/my-workspace` trên điện thoại (đăng nhập Frappe).
5. **Đăng ký thiết bị**: lần đầu app đẩy sang **"Đăng ký thiết bị"** → bấm *Gửi yêu cầu đăng ký*.
6. **HR duyệt thiết bị** (xem §5.2) → NV mới chấm công được.
7. **Hằng ngày**: NV bấm **Chấm công (Vào/Ra)**. Quên chấm / đi công tác / WFH → tab
   **Bảng công** → nút **"Đề xuất"** → chọn loại (Chấm công bù / WFH) → gửi đơn. Nghỉ phép → tab **Nghỉ phép**.
   (Đơn duyệt xong hiện ngay trong Bảng công — đây là **1 danh sách chung** gồm công + đơn đề xuất.)
   **Bấm item bất kỳ** (công, đơn, lượt chấm, thông báo) để **xem chi tiết**.

---

## 3. Phòng BẢO DƯỠNG / Kỹ thuật viên (KTV) — setup A-Z

**Đặc điểm:** KTV đi hiện trường khách → **whitelist** (bỏ GPS) + dùng app **FSM** cho lịch/công việc.

1. **Tạo Employee** như §2 (Department = Bảo dưỡng/Kỹ thuật, set `leave_approver`).
   ⚠️ KTV đi hiện trường **vẫn cần `Default Shift`** thì check-in mới sinh Attendance — có thể
   tạo **ca riêng "Ca KTV"** (giờ linh hoạt) + Holiday List, gán làm Default Shift (xem §1.6).
2. **Gán role** cho User: **Employee** (+ role FSM nếu hệ FSM yêu cầu).
3. **Tạo FS Service Resource** (Desk → FS Service Resource): set cả **`user`** (tài khoản KTV) lẫn
   **`employee`** (hồ sơ KTV) và **`is_active = 1`**.
   → Có cái này thì:
   - my-workspace hiện thêm tab **"FSM"** (nhúng app technician).
   - App `/technician` nhận diện KTV (lịch, work order...).
4. **Whitelist GPS**: thêm KTV vào `whitelist_employees` của HR Policy (reason = "KTV hiện trường")
   → chấm công không bị chặn bán kính VP.
5. **Đăng ký thiết bị** + **HR duyệt** (như §2 bước 5-6).
6. **Hằng ngày**:
   - KTV chấm công như thường. ⚠️ Nếu **hôm nay không có FS Service Appointment** nào gán cho KTV,
     hệ thống cho chấm nhưng **kèm cảnh báo** "không có ca/lịch" (để HR rà).
   - Vào tab **FSM** xem lịch, cập nhật công việc (qua app technician).

---

## 4. MANAGER cần làm gì để duyệt

Manager = người có role **Leave Approver** và là `leave_approver` của NV.

**Cách 1 — trên điện thoại (my-workspace → tab "Cần duyệt"):**
- **Nghỉ phép** (đơn ở trạng thái *Pending Manager*): bấm đơn → **"Duyệt (Manager)"**
  → đơn chuyển sang *Manager Approved* (chờ HR submit). Hoặc **"Từ chối"**.
- **Chấm công bù / Công tác / WFH** (Attendance Request): bấm → **"Duyệt"** (Submit) hoặc **"Hủy"**.
  Khi duyệt, HRMS tự tạo bản ghi Attendance (Present / WFH) cho ngày đó.

**Cách 2 — trên Desk:** mở doctype tương ứng (Leave Application / Attendance Request) và thao tác workflow.

> Manager chỉ thấy đơn của **nhân viên mà mình là leave_approver** (do `restrict_to_leave_approver=1`).

---

## 5. HR cần làm gì để duyệt

### 5.1. Duyệt nghỉ phép — bước 2 (sau khi Manager đã duyệt)
my-workspace → tab **"Cần duyệt"** → đơn ở trạng thái *Manager Approved* → bấm **"Submit (HR)"**
→ đơn thành *Submitted* (chính thức, trừ quỹ phép). Hoặc **"Từ chối"**.
(HR Manager cũng có thể tự duyệt cả 2 bước nếu cần.)

### 5.2. Duyệt thiết bị điện thoại (Phone Registration)
Desk → **HR Checkin Phone Registration** → mở bản ghi *Draft* của NV (status Active, chưa submit)
→ kiểm tra đúng người/đúng máy → **Submit** (docstatus 0 → 1).
→ NV mới chấm công được trên đúng thiết bị đó.
(Mỗi NV chỉ nên có **1 thiết bị Active**; đổi máy thì deactivate máy cũ trước.)

### 5.3. Phép năm
**Không phải duyệt.** Earned Leave tự cộng quỹ cuối mỗi tháng (§1.5). HR chỉ cần đảm bảo
mỗi NV có **Leave Policy Assignment**.

---

## 6. HR xem báo cáo tháng ở đâu

Desk → **Monthly Attendance Sheet** (`/app/query-report/Monthly Attendance Sheet`).
- Filter: **Month + Year + Company** → chạy.
- Layout: **mỗi nhân viên 1 dòng**, **mỗi cột 1 ngày** trong tháng; ô là trạng thái viết tắt:
  `P` (Present) · `A` (Absent) · `HD/P`·`HD/A` (nửa ngày) · `WFH` · `L` (On Leave).
- Cột tổng: Total Present / Leaves / Absent / Holidays / Unmarked Days + theo từng Leave Type + Late/Early.
- **Export** Excel/CSV/PDF. Quyền: HR User / HR Manager / System Manager.

**Điều kiện báo cáo có số:** ngày đó phải có bản ghi **Attendance** — tức là auto-attendance (§1.6)
đã biến check-in → Attendance, hoặc có Attendance Request đã duyệt. Ngày chưa có Attendance = **Unmarked**.

> ⚠️ Nếu báo cáo lỗi *"Prepared report render failed: a bytes-like object..."*: do file report nén bị
> đẩy lên S3 (storage_management). Khắc phục: đảm bảo S3 Attachments Setting bypass `.json.gz` + xoá
> prepared report cũ, hoặc set `Report.prepared_report = 0` để chạy inline. Chi tiết: liên hệ team kỹ thuật.

---

## 7. Checklist nhanh

**Setup 1 NV mới:** Employee (+ user_id + department + leave_approver) → role Employee →
(KTV: + FS Service Resource) → (đi ngoài: + whitelist) → NV cài app + đăng ký thiết bị →
HR duyệt thiết bị → xong.

**Mỗi ngày:** NV chấm công / xin nghỉ / chấm công bù → Manager duyệt (bước 1) → HR submit (bước 2 cho phép).

**Cuối tháng:** Earned Leave tự +1 quỹ phép · HR xem Monthly Attendance Sheet.
