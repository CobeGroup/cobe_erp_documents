---
title: Leave (Phép) — Setup & Workflow
layout: default
parent: Chấm công & HR
nav_order: 7
---

# Phép — Cấu hình + Workflow 2 bước + Auto-cấp + HR tổng phép

> Đối tượng: **HR Manager**, **System Manager**, **Manager phòng ban**.

Cobe dùng Leave Application chuẩn HRMS + 2 extension:
1. **Workflow 2 bước**: Manager → HR Manager (Frappe Workflow fixture)
2. **Auto-cấp phép theo số ngày chấm công**: cuối tháng đủ ngưỡng → +1 ngày Annual Leave (ngưỡng = 0 → cấp cho mọi NV Active)

---

## Mục lục

1. [Cấu hình lần đầu](#1-cấu-hình-lần-đầu)
2. [Auto-cấp phép theo số ngày chấm công](#2-auto-cấp-phép-theo-số-ngày-chấm-công)
3. [Workflow 2 bước Manager → HR](#3-workflow-2-bước-manager--hr)
4. [HR top-up phép tồn (manual)](#4-hr-top-up-phép-tồn-manual)
5. [Audit cấp phép tự động](#5-audit-cấp-phép-tự-động)
6. [Edge case + FAQ](#6-edge-case--faq)

---

## 1. Cấu hình lần đầu

### 1.1. Verify Leave Type "Annual Leave"

Desk → search "Leave Type" → kiểm tra có record `Annual Leave` chưa.

Nếu chưa có (site mới chưa setup):
1. New → `Leave Type Name = Annual Leave`
2. `Max Leaves Allowed` = 12 (hoặc theo policy Company, vd 14)
3. `Is Carry Forward` = ✓ (cho phép cộng dồn sang năm sau)
4. `Is Leave Without Pay` = ✗
5. **Save**.

### 1.2. Bật auto-allocation trong HR Policy

Desk → **HR Policy** → mở record của Company → tab **Leave**:

| Field | Value mẫu | Note |
|---|---|---|
| `leave_auto_enabled` | ✓ | Bật module |
| `leave_auto_min_attendance_days` | 0 | Số ngày Attendance tối thiểu/tháng. **0 = cấp cho mọi NV Active** (không cần check chấm công). Vd 12 = phải có ≥12 ngày chấm công mới được cấp |
| `leave_auto_leave_type` | Annual Leave | Cộng vào Annual Leave chuẩn |
| `leave_auto_days_granted` | 1 | Số ngày cấp mỗi tháng |

Mặc định **TẮT** — phải tự bật khi Company sẵn sàng.

### 1.3. Verify Workflow Leave Approval

Sau khi `bench --site <site> migrate`, fixture `HR Leave Approval 2-Step` tự load. Verify:

- Desk → search "Workflow" → mở `HR Leave Approval 2-Step`
- `Document Type = Leave Application`, `Is Active = 1`
- States: `Pending Manager`, `Pending HR`, `Approved`, `Rejected`
- Transitions: 4 records

Nếu workflow chưa tồn tại → chạy lại `bench migrate`.

---

## 2. Auto-cấp phép theo số ngày chấm công

### Cơ chế

Scheduled job `hr_for_cobegroup.scheduled.auto_allocate_leave.run`:
- Chạy **monthly** (ngày 1 mỗi tháng) qua Frappe scheduler
- Quét tháng vừa qua: với mỗi Company có `leave_auto_enabled = 1`:
  - LEFT JOIN Employee Active ↔ Attendance docstatus=1 (range tháng trước)
  - Đếm `COUNT(DISTINCT attendance_date)` per Employee
  - Nếu count ≥ `leave_auto_min_attendance_days` → tạo Leave Allocation +`leave_auto_days_granted` ngày
- Set `Leave Allocation.custom_auto_allocated_for_period = "YYYY-MM"` để idempotent (chạy lại không double)

> **Khi `min_attendance_days = 0`** → mọi NV Active đều được cấp, kể cả NV không có Attendance nào trong tháng (vẫn vào group qua LEFT JOIN với count=0).

### Ví dụ

#### Cấp cho mọi NV Active (ngưỡng = 0)
- Policy: `min_attendance_days = 0`, `days_granted = 1`
- Cuối tháng 5 (ngày 1/6) job chạy → mọi NV Active (kể cả NV nghỉ phép cả tháng, mới join) đều được +1 ngày Annual Leave

#### Cấp theo điều kiện chấm công (ngưỡng > 0)
- Policy: `min_attendance_days = 12`, `days_granted = 1`
- NV A: 21 ngày Attendance trong tháng 5 → ≥ 12 → cấp +1 ngày
- NV B: 8 ngày Attendance trong tháng 5 (nghỉ phép nhiều) → < 12 → KHÔNG cấp
- Allocation A:
  - `from_date = 2026-06-01`, `to_date = 2027-05-31`
  - `new_leaves_allocated = 1`
  - `description = "Auto-cấp theo policy (kỳ 2026-05, attendance_days=21)"`
  - `custom_auto_allocated_for_period = "2026-05"`

### Idempotent

Job chạy lại tháng 6 lần nữa → không tạo allocation thứ 2 cho kỳ 2026-05 (vì đã có row với cùng `custom_auto_allocated_for_period`).

### Chạy thủ công cho 1 tháng đã qua

```python
# bench --site cobe.cc console
from hr_for_cobegroup.scheduled.auto_allocate_leave import _process_company
import frappe
from datetime import date
policy = frappe.get_doc("HR Policy", {"company": "Cobegroup"})
_process_company(policy._as_dict(), date(2026,5,1), date(2026,5,31), "2026-05")
```

---

## 3. Workflow 2 bước Manager → HR

### Luồng

```
NV submit Leave Application
  ↓ workflow_state = "Pending Manager", docstatus = 0
  ↓
Manager (Leave Approver theo Employee.leave_approver) action:
  - "Forward to HR" → workflow_state = "Pending HR" (docstatus vẫn 0)
  - "Manager Reject" → workflow_state = "Rejected" (docstatus = 1, status = Rejected)
  ↓
HR Manager action:
  - "HR Approve" → workflow_state = "Approved" (docstatus = 1, status = Approved)
  - "HR Reject" → workflow_state = "Rejected" (docstatus = 1, status = Rejected)
```

### NV submit Leave Application

1. Desk → New → Leave Application
2. Điền:
   - `From Date / To Date`
   - `Leave Type`
   - `Reason`
3. Save → workflow_state tự set `Pending Manager`

### Manager duyệt bước 1

1. Manager nhận notification (Bell icon)
2. Mở Leave Application
3. Top right có button workflow action:
   - **Forward to HR** → đẩy lên bước 2
   - **Manager Reject** → đóng đơn ngay

### HR Manager duyệt bước 2

1. HR Manager filter Leave Application với `workflow_state = Pending HR`
2. Verify policy (vd NV còn phép, kỳ phép hợp lệ)
3. Click:
   - **HR Approve** → docstatus=1, status=Approved → HRMS tự tạo Attendance status=On Leave cho khoảng ngày
   - **HR Reject** → docstatus=1, status=Rejected

### Permission

Workflow fixture định nghĩa role được phép action:
- `Forward to HR` / `Manager Reject`: role `Leave Approver`
- `HR Approve` / `HR Reject`: role `HR Manager`

Đảm bảo User của Manager có role `Leave Approver` (gán qua User permissions).

### `allow_self_approval` ở bước HR

HR Manager có thể tự duyệt đơn của chính mình (`allow_self_approval = 1`) — vì HR Manager có thẩm quyền cuối. Manager (Leave Approver) **không** được self-approve (`allow_self_approval = 0`).

---

## 4. HR top-up phép tồn (manual)

Trường hợp:
- NV mới join, HR cấp manual phép initial
- NV chuyển công ty, mang phép tồn từ Company cũ
- Bù phép thiếu do lỗi job auto-allocation
- Điều chỉnh cuối năm

### Cách làm

1. Desk → **Leave Allocation** → New
2. Điền:
   - `Employee`
   - `Leave Type` (vd Annual Leave)
   - `From Date / To Date`: khoảng hiệu lực
   - `New Leaves Allocated`: số ngày cộng (vd 5)
   - `Description`: lý do (vd "Bù phép thiếu tháng 4/2026 — sự cố scheduled job")
   - `custom_auto_allocated_for_period`: **để trống** (chỉ job auto fill field này)
3. Save → Submit

Allocation cộng dồn — NV nhận tổng new_leaves_allocated từ tất cả allocation active trong kỳ.

### Audit ai cấp phép tồn

Leave Allocation có field `Owner` + `Modified By` chuẩn Frappe. Filter:
- `custom_auto_allocated_for_period IS NULL` → manual allocation
- `custom_auto_allocated_for_period IS NOT NULL` → từ job auto

---

## 5. Audit cấp phép tự động

### Xem lịch sử cấp phép theo NV

- Desk → Leave Allocation → Filter `employee`
- Cột mặc định: leave_type, from_date, to_date, new_leaves_allocated, description, custom_auto_allocated_for_period

### Báo cáo Leave Balance

- Desk → search "Leave Balance Report" — báo cáo built-in của HRMS
- Hiển thị tổng phép cấp, đã dùng, còn lại

### Log scheduled job

Frappe scheduler log ở:
- `bench --site cobe.cc logs` (terminal)
- File `sites/<site>/logs/scheduler.log`
- Trong Desk → **Scheduled Job Log** (Frappe v15)

### Sự cố job không chạy

Verify scheduler đang chạy:
```bash
bench --site cobe.cc doctor
```

Manual trigger:
```bash
bench --site cobe.cc execute hr_for_cobegroup.scheduled.auto_allocate_leave.run
```

---

## 6. Edge case + FAQ

### NV nghỉ phép cả tháng → có được cấp không?

**Tùy `min_attendance_days`:**
- `min_attendance_days = 0` → vẫn được cấp (job dùng LEFT JOIN, NV không có Attendance vẫn vào group với count=0)
- `min_attendance_days > 0` → KHÔNG cấp (count attendance < ngưỡng)

Workaround khi cấu hình ngưỡng > 0: HR top-up manual nếu nội bộ thấy hợp lý.

### NV làm OT nhiều → có được +2 ngày không?

**KHÔNG** (theo config hiện tại). `days_granted` cố định cho mỗi tháng đủ điều kiện — không scale theo số ngày làm vượt mức.

Muốn cấp theo tỷ lệ (vd `floor(attendance_days / 12)`): liên hệ dev sửa logic job.

### NV đổi Company giữa tháng — cấp ở Company nào?

Job dùng `Employee.company` hiện tại lúc chạy. Nếu NV đổi Company giữa tháng → cấp ở Company mới (Company cũ không cấp vì NV không còn trong list).

→ Manager phải manual top-up nếu cần.

### Bật `leave_auto_enabled` giữa tháng — tháng đó có được cấp không?

Có. Job chạy ngày 1 tháng sau, đọc state lúc đó. Nếu lúc job chạy `enabled = 1` → quét tháng vừa qua.

### Có thể đổi `leave_auto_leave_type` thành Leave Type khác?

Có. Edit HR Policy → tab Leave → đổi link. Lần job chạy kế tiếp cấp vào Leave Type mới.

Allocation đã cấp trước đó (vào Leave Type cũ) vẫn giữ nguyên — không migrate.

### Workflow không trigger khi Manager click action

Check:
1. Workflow `Is Active = 1` chưa?
2. Manager có role `Leave Approver` chưa? (User → User permissions)
3. `Employee.leave_approver` đã set đúng user của Manager chưa?
4. Refresh trang sau khi action — không tự refresh.

### Bypass Workflow cho cấp Director

Director có thể không cần qua workflow. Workaround:
- Tạo role `Workflow Override` + gán cho Director
- Edit workflow → cho phép skip transition cho role này
- Hoặc Director submit qua Frappe API trực tiếp (bypass workflow_state validation)

---

## Liên quan

- [HR Policy — tab Leave](HR-Policy.html#4-tab-leave)
- [Holiday & Shift Setup](HR-Holiday-Shift-Setup.html)
- [Tổng quan Chấm công](Cham-Cong-Tong-Quan.html)
