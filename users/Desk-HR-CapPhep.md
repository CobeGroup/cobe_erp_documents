---
title: "Cấp phép & gán người duyệt"
layout: default
parent: HR (vận hành)
grand_parent: Chấm công & HR
nav_order: 3
---

# Cấp phép & gán người duyệt
{: .no_toc }

**Dành cho:** HR Manager · **Doctype:** Leave Allocation, Leave Policy Assignment, Department
{: .fs-3 .text-grey-dk-000 }

> 2 việc tách biệt: **(A) cấp số dư phép** cho nhân viên, và **(B) gán người duyệt** đơn nghỉ. Không có B thì nhân viên gửi đơn sẽ báo *"Chưa có Manager duyệt phép"*.

---

## A. Cấp số dư phép (Leave Allocation)

Cobe dùng **Earned Leave native (HRMS)** — số dư **tự cộng theo lịch**, KHÔNG qua duyệt. Cách dựng:

1. **Leave Period** (`/app/leave-period`) — tạo kỳ phép cho năm (vd 01/01–31/12).
2. **Leave Type** (`/app/leave-type`) — loại phép (Annual Leave…), bật `is_earned_leave` nếu muốn cộng dần.
3. **Leave Policy** (`/app/leave-policy`) — gộp các loại phép + số ngày/năm. Trong bảng **Leave Policy Details** → **Add Row** → bấm vào dòng để mở chi tiết → chọn **Leave Type** + nhập **Annual Allocation** (số ngày/năm). Lặp cho từng loại phép → **Save**.
4. **Leave Policy Assignment** (`/app/leave-policy-assignment`) — gán policy cho nhân viên → **Submit** → hệ thống **tự tạo Leave Allocation** (số dư).

![Leave Policy — thêm dòng loại phép + số ngày/năm (Editing Row)](images/desk/hr-leavepolicy-additem.png)

> 💡 Cấp gấp cho 1 người: tạo thẳng **Leave Allocation** (`/app/leave-allocation/new`) → chọn Employee + Leave Type + số ngày + khoảng ngày → Submit.

![Form Leave Allocation — cấp số dư phép cho 1 nhân viên](images/desk/hr-leave-alloc-new.png)

Sau khi cấp, nhân viên thấy **số dư** ngay trong app (tab Nghỉ phép).

## B. Gán người duyệt (Leave Approver)

Chuỗi ưu tiên: **Employee.leave_approver** (đặt riêng) → fallback **người duyệt mặc định của Department**.

**Cách chuẩn — gán theo phòng (1 lần cho cả phòng):**
1. Mở **Department** (`/app/department`) của phòng đó.
2. Mục **Leave Approvers** → thêm **dòng đầu tiên** = user Manager duyệt phép.
3. Lưu. Mọi nhân viên thuộc phòng này dùng người này làm Manager mặc định.

![Department → Leave Approver: dòng đầu = người duyệt mặc định](images/desk/admin-dept-form.png)

**Ngoại lệ — override 1 nhân viên:**
- Mở **Employee** → field **Leave Approver** → chọn user. Cái này **đè** Department.

> ⚠️ Hệ thống chỉ lấy **dòng ĐẦU TIÊN** trong Leave Approvers của phòng làm người duyệt mặc định. Thêm nhiều dòng chỉ là "danh sách approver hợp lệ", không tự luân phiên.

---

## ⚠️ Lỗi thường gặp

| Hiện tượng | Cách xử |
|---|---|
| NV gửi đơn báo "Chưa có Manager duyệt phép" | Phòng chưa có Leave Approver → làm mục **B** |
| NV chỉ thấy "Leave Without Pay" | Chưa có Leave Allocation loại có lương → làm mục **A** |
| Đặt approver Department nhưng NV vẫn nhầm người | NV bị override ở Employee.leave_approver → kiểm field đó |

## Liên quan
- [Leave — Setup & Workflow (kỹ thuật)](HR-Leave-Setup.html) · [Employee & Department (kỹ thuật)](HR-Employee-Department-Setup.html)
