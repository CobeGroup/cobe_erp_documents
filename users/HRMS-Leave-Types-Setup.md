---
title: Leave Types & Tiered Approval (Loại phép & duyệt nhiều cấp)
layout: default
parent: Chấm công & HR
nav_order: 7
---

# Leave Types & Tiered Approval — Loại phép & duyệt phân cấp

> Tận dụng doctype **chuẩn HRMS**: Leave Type, Leave Allocation, Leave Application + **Frappe Workflow** để route duyệt theo số ngày.
>
> Không phải custom code — chỉ config.

---

## Mục lục

1. [4 loại phép Cobe](#1-4-loại-phép-cobe)
2. [Tạo Leave Type](#2-tạo-leave-type)
3. [Leave Allocation đầu năm](#3-leave-allocation-đầu-năm)
4. [Tiered Approval Workflow](#4-tiered-approval-workflow)
5. [Quy trình nhân viên submit](#5-quy-trình-nhân-viên-submit)
6. [Quy trình manager duyệt](#6-quy-trình-manager-duyệt)
7. [Carry forward Phép năm cuối năm](#7-carry-forward-phép-năm-cuối-năm)
8. [Sự cố thường gặp](#8-sự-cố-thường-gặp)

---

## 1. 4 loại phép Cobe

| Mã | Tên đầy đủ | Trả lương | Cumulative | Carry forward | Note |
|---|---|---|---|---|---|
| **AL** | Phép năm | ✅ | 12 ngày/năm | ✅ tối đa 6 ngày | Tự cộng dồn 1 ngày/tháng |
| **SL** | Phép có lương | ✅ | 5 ngày/năm | ❌ | Ốm đau, hiếu hỉ |
| **LWP** | Phép không lương | ❌ | Không giới hạn | ❌ | Lưu trữ, không trừ allocation |
| **CO** | Phép bù (Comp-Off) | ✅ | Theo Compensatory Leave Request | ❌ | Đi làm bù weekend/lễ → request → allocate |

---

## 2. Tạo Leave Type

Desk → search **Leave Type** → **New** cho mỗi loại.

### 2.1. Phép năm (Annual Leave — AL)

| Field | Value |
|---|---|
| `leave_type_name` | `Phép năm` |
| `max_leaves_allowed` | `12` |
| `applicable_after_work_days` | `0` |
| `max_continuous_days_allowed` | `15` |
| `is_lwp` | `0` |
| `is_carry_forward` | `1` |
| `maximum_carry_forwarded_leaves` | `6` |
| `is_earned_leave` | `1` |
| `earned_leave_frequency` | `Monthly` |
| `rounding` | `0.5` |
| `allow_negative` | `0` |
| `include_holiday` | `0` |
| `is_compensatory` | `0` |

→ Bật `is_earned_leave = 1` để Frappe tự allocate 1 ngày mỗi tháng (12 ngày/năm).

### 2.2. Phép có lương (Sick Leave — SL)

| Field | Value |
|---|---|
| `leave_type_name` | `Phép có lương` |
| `max_leaves_allowed` | `5` |
| `is_lwp` | `0` |
| `is_carry_forward` | `0` |
| `is_earned_leave` | `0` |
| `is_compensatory` | `0` |

### 2.3. Phép không lương (LWP)

| Field | Value |
|---|---|
| `leave_type_name` | `Phép không lương` |
| `is_lwp` | `1` ⚠️ quan trọng |
| `is_carry_forward` | `0` |
| `max_leaves_allowed` | `0` (không giới hạn) |

→ `is_lwp = 1` → Salary Slip tự trừ lương tương ứng số ngày nghỉ.

### 2.4. Phép bù (Comp-Off — CO)

| Field | Value |
|---|---|
| `leave_type_name` | `Phép bù` |
| `is_compensatory` | `1` ⚠️ quan trọng |
| `is_carry_forward` | `0` |
| `max_leaves_allowed` | `0` (do Compensatory Leave Request quyết định) |

→ `is_compensatory = 1` → Compensatory Leave Request (sẽ làm ở [STEP 3](HRMS-Comp-Off.html)) auto allocate vào type này.

---

## 3. Leave Allocation đầu năm

### Cho Phép có lương (SL) — bulk allocate

Đầu năm cấp 5 ngày cho mỗi nhân viên active:

1. Desk → search **Leave Allocation** → **New**
2. `employee` để trống (sẽ bulk)
3. Hoặc dùng tool: Desk → **Leave Period** → tạo period "2026" → bấm **Grant Leave** → chọn nhân viên + Leave Type=Phép có lương

### Cho Phép năm (AL) — auto monthly

Khi đã bật `is_earned_leave = 1` cho type "Phép năm", scheduled job HRMS sẽ tự allocate 1 ngày vào mỗi đầu tháng cho mỗi nhân viên active.

Verify: Desk → **Scheduled Job Log** → filter `scheduled_job_type = "allocate_earned_leaves"` → check log gần nhất.

### Force allocate ngay (debug)

```bash
bench --site cobe.cc execute hrms.hr.utils.allocate_earned_leaves
```

---

## 4. Tiered Approval Workflow

Quy trình duyệt phân cấp theo số ngày:

| Số ngày phép | Duyệt | Quyết định cuối |
|---|---|---|
| 1–2 ngày | Direct Manager | OK |
| 3–6 ngày | Direct Manager → HR Head | HR Head |
| ≥7 ngày | Direct Manager → HR Head → Board | Board |

### 4.1. Tạo Workflow

Desk → **Workflow** → **New**.

| Field | Value |
|---|---|
| `workflow_name` | `Leave Application Tiered Approval` |
| `document_type` | `Leave Application` |
| `is_active` | `1` |
| `send_email_alert` | `1` |
| `workflow_state_field` | `workflow_state` (HRMS tự có) |

### 4.2. Workflow States

Tab **States** → add các state sau:

| State | Doc Status | Allow Edit | Style |
|---|---|---|---|
| `Pending Manager` | 0 | Employee | Warning |
| `Pending HR` | 0 | HR User | Primary |
| `Pending Board` | 0 | Board Role | Primary |
| `Approved` | 1 | (none) | Success |
| `Rejected` | 0 | (none) | Danger |

→ Cần tạo role `HR User` và `Board` trước (Desk → Role → New).

### 4.3. Workflow Transitions

Tab **Transitions** → add 7 transition:

| State | Action | Next State | Allowed | Condition |
|---|---|---|---|---|
| Pending Manager | Approve | Approved | Leave Approver | `doc.total_leave_days <= 2` |
| Pending Manager | Forward to HR | Pending HR | Leave Approver | `doc.total_leave_days > 2 and doc.total_leave_days < 7` |
| Pending Manager | Forward to Board | Pending Board | Leave Approver | `doc.total_leave_days >= 7` |
| Pending Manager | Reject | Rejected | Leave Approver | — |
| Pending HR | Approve | Approved | HR User | — |
| Pending HR | Reject | Rejected | HR User | — |
| Pending Board | Approve | Approved | Board | — |
| Pending Board | Reject | Rejected | Board | — |

→ `total_leave_days` là field auto-tính từ `from_date` − `to_date` − holidays.

### 4.4. Save Workflow

Bấm **Save**. Sau đó mỗi Leave Application mới sẽ bắt đầu ở state `Pending Manager`.

---

## 5. Quy trình nhân viên submit

1. Desk → **Leave Application** → **New**
2. Điền:
   - `employee` (auto fill nếu đang login bằng user của nhân viên đó)
   - `leave_type` (Phép năm / có lương / không lương / bù)
   - `from_date` / `to_date`
   - `reason`
3. Bấm **Submit** → state = `Pending Manager` → email auto gửi cho Leave Approver

**Lưu ý**: nhân viên muốn nghỉ Phép năm thì hệ thống tự check `Leave Allocation` còn đủ ngày không. Nếu không đủ → block không submit được.

---

## 6. Quy trình manager duyệt

### 6.1. Direct Manager (Leave Approver)

1. Email notify → click link → mở Leave Application
2. Xem `total_leave_days`:
   - ≤2: bấm action **Approve** → done
   - 3–6: bấm **Forward to HR** → routing tới HR User
   - ≥7: bấm **Forward to Board** → routing tới Board
   - Không OK: bấm **Reject** + comment

### 6.2. HR User

1. Nhận email notification (do Workflow setting `send_email_alert = 1`)
2. Filter `workflow_state = "Pending HR"` để xem queue
3. Approve hoặc Reject

### 6.3. Board

Tương tự HR User, filter `workflow_state = "Pending Board"`.

---

## 7. Carry forward Phép năm cuối năm

Cuối năm (31/12), Frappe có scheduled job `expire_allocation` để xử lý:

1. Đọc Leave Allocation hết hạn (đến `to_date` của allocation)
2. Tính số ngày còn lại = `total_leaves_allocated − leaves_taken`
3. Nếu `is_carry_forward = 1` → tạo Leave Allocation mới cho năm sau, giới hạn `maximum_carry_forwarded_leaves` (Cobe đã set = 6)

Cobe áp dụng cho Phép năm:
- Nhân viên dùng <6 ngày → còn dư N ngày → cộng vào năm sau (vd dư 4 → năm sau có 12 + 4 = 16)
- Nhân viên dùng <6 ngày → còn dư 9 ngày → chỉ cộng vào 6 (do max=6)
- Nhân viên dùng đủ 12 → không có gì carry, năm sau 12 ngày

→ Job tự chạy 01/01 hằng năm. Verify ở **Scheduled Job Log**.

---

## 8. Sự cố thường gặp

### 8.1. Nhân viên không submit được Leave Application

Check theo thứ tự:
1. Employee có `leave_approver` chưa? (Desk → Employee → field `leave_approver`)
2. Leave Type có Leave Allocation active không? (Leave Allocation list → filter employee + type)
3. Workflow đã active chưa? (Desk → Workflow → `is_active = 1`)

### 8.2. Đã Approve mà Attendance vẫn báo Absent

Check `from_date` / `to_date` có đúng không. Process Auto Attendance check Leave Application state = "Approved" mới skip Absent. Nếu workflow state = "Approved" mà `status` field vẫn là "Open" → workflow chưa được setup đúng (state Approved phải có `doc_status = 1`).

### 8.3. Earned leave không tự allocate hằng tháng

1. Check Leave Type "Phép năm" có `is_earned_leave = 1` và `earned_leave_frequency = "Monthly"` không
2. Check Scheduled Job Log → `allocate_earned_leaves` chạy success không
3. Check Employee có active không (employees đã `relieving_date` thì không được allocate)

### 8.4. Carry forward bị giới hạn không đúng

→ Sửa `maximum_carry_forwarded_leaves` trong Leave Type. Chỉ áp dụng cho năm sau, không retro năm trước.

---

## Liên quan

- [Tổng quan & Setup](Cham-Cong-Tong-Quan.html)
- [Shift Type & Auto Attendance](HRMS-Shift-Type-Setup.html)
- [Compensatory Leave Request (Phép bù)](HRMS-Comp-Off.html) — quy trình allocate type=Phép bù
- [HR WFH Salary Settings](HR-WFH-Salary-Settings.html) — phân biệt nghỉ phép vs WFH
