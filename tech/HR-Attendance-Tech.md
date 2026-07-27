---
title: HR Attendance — Tech Overview
layout: default
parent: Tài liệu kỹ thuật
nav_order: 2
---

# HR Attendance — Tech Overview

> Quick integrator reference. **Source code**: [`CobeGroup/hr_for_cobegroup`](https://github.com/CobeGroup/hr_for_cobegroup).
>
> Đối tượng: developer, 3rd party vendor, DevOps cần grasp nhanh hệ thống. Cho hướng dẫn người dùng cuối, xem [Chấm công & HR](../users/Cham-Cong-Tong-Quan.html).

---

## Tài liệu kỹ thuật HR Attendance gồm 3 file

| File | Nội dung |
|---|---|
| [HR Attendance — Tech Overview](HR-Attendance-Tech.html) **(trang này)** | Quick reference cho integrator + extension points |
| [HR Attendance — API Contract](HR-Attendance-API.html) | Source of truth API spec: endpoints, request/response, error codes, sequence diagrams |
| [HR Attendance — Architecture](HR-Attendance-Architecture.html) | System design, lifecycle, routing, deployment topology, design decisions |

---

## Quick stack reference

| Layer | Tech |
|---|---|
| Backend | Frappe v15 (Python 3.10+), HRMS (Employee Checkin extension) |
| PWA Frontend | React 18.3 + TypeScript 5.6 + Vite 5.4 + antd 5.22 + zustand + react-router-dom v6 + vite-plugin-pwa |
| Browser APIs | Geolocation, MediaDevices (camera), WebRTC (local IP), Service Worker (offline shell) |
| Auth | Frappe session cookie + X-Frappe-CSRF-Token header |
| Routing | `/my-workspace` qua `website_route_rules` → `www/_my_workspace.html` (PWA shell, React Router basename) |

---

## Source code map

```
apps/hr_for_cobegroup/
├── hr_for_cobegroup/
│   ├── api/                            # whitelisted endpoints
│   ├── attendance/doctype/             # 6 doctypes + 2 child tables
│   ├── utils/{geo,subnet}.py           # haversine + CIDR check
│   ├── www/_my_workspace.{py,html}     # SPA shell
│   ├── fixtures/custom_field.json      # 10 fields on Employee Checkin
│   └── hooks.py
└── frontend/attendance-pwa/            # React + TS + Vite + antd source
```

Chi tiết folder + file purpose: xem [Architecture §7](HR-Attendance-Architecture.html#7-folder-structure).

---

## Extension points

### 1. Thêm anti-cheat layer mới

1. Thêm field `enable_<feature>` vào `HR Policy`
2. Thêm logic check trong `api/attendance.py::checkin()` (sau các check hiện có, theo thứ tự fail-fast)
3. Thêm error code mới + Vietnamese message vào [API §6](HR-Attendance-API.html#6-error-codes-chuẩn-hóa)
4. Cập nhật PWA `src/api/types.ts::ERROR_MESSAGES`
5. (Nếu cần data từ client) thêm field vào request body + custom field trên Employee Checkin

### 2. Tích hợp face match thật (phase 2)

Thay thế `_match_face` stub trong `api/attendance.py`:

```python
def _match_face(selfie_url, employee):
    from your_face_lib import compare
    employee_doc = frappe.get_doc("Employee", employee.name)
    return compare(selfie_url, employee_doc.image)
```

### 3. Webhook khi có checkin

Thêm `doc_events` hook trong `hooks.py`:

```python
doc_events = {
    "Employee Checkin": {
        "after_insert": [
            "hr_for_cobegroup.api.attendance.notify_external_system"
        ]
    }
}
```

### 4. Báo cáo custom

Tận dụng Frappe Query Report — Employee Checkin có sẵn fields cơ bản + custom fields ta thêm. Tạo report mới trong Desk → Report Builder, filter theo `custom_checkin_source` để tách onsite vs WFH.

### 5. Lưới ngày của COBE HR Attendance Sheet — bẫy khi chỉnh giao diện

`cobe_hr_attendance_sheet.js` giả lập "1 ô ngày gộp" bằng **2 cột phẳng** (mã + giờ, cùng
width) rồi sinh CSS theo **chỉ số cột** (`.dt-cell--col-N` — class này có ở cả header lẫn
body, kể cả dòng datatable render lại khi cuộn). Sửa phần này thì nhớ:

- **KHÔNG dùng `margin` / `width`** để nới hộp nhãn header. frappe-datatable đặt width lên
  chính `.dt-cell__content--header-N` (`columnmanager.setColumnHeaderWidth`), còn `.dt-cell`
  là **flex-item tự co theo content** → `margin-right` âm **bóp ô header lại**, header dồn 2
  ngày vào 1 trong khi body vẫn đúng. Dùng `transform: translateX()` — không đụng layout.
- **`text-indent` cũng không dùng được**: khi chữ tràn hộp, vị trí phụ thuộc **độ dài nhãn**
  nên mỗi ngày lệch một kiểu.
- `transform` trên content div **kéo theo nút resize + dropdown** (2 thứ này `position:absolute`
  *bên trong* content) → phải đẩy ngược lại.
- Cột Float bị `frappe.format()` bọc trong `<div style="text-align:right">` → muốn đổi căn lề
  phải đè bằng `!important` lên `div` bên trong.
- Nhận diện cột ngày theo **fieldname** (`dd-mm-yyyy`), đừng theo `colIndex` — `colIndex` của
  datatable có tính cả cột số thứ tự nên dễ dính nhầm cột tổng.

Verify không cần đăng nhập được: dựng harness tĩnh nạp `frappe-datatable.css` + **file report
thật** (stub `frappe`), gán width lên `.dt-cell__content--{header-,col-}N` **đúng như
datatable**, rồi đo `getBoundingClientRect` của text node. Gán width sai chỗ (lên `.dt-cell`)
là không bắt được lỗi bóp ô nói trên.

---

## Quick start (developer)

### Local install

```bash
cd /path/to/bench
bench get-app https://github.com/CobeGroup/hr_for_cobegroup
bench --site <site> install-app hr_for_cobegroup
bench --site <site> migrate
```

### PWA dev mode (HMR)

```bash
cd apps/hr_for_cobegroup/frontend/attendance-pwa
yarn install
yarn dev    # localhost:5173, cần login Frappe ở browser trước
```

### Build production (commit dist để Frappe Cloud deploy)

```bash
yarn build  # → ../../hr_for_cobegroup/public/attendance-pwa/
cd /path/to/bench
bench build --app hr_for_cobegroup
git add apps/hr_for_cobegroup/hr_for_cobegroup/public/attendance-pwa/
git commit -m "build(pwa): ..."
git push
```

### Run tests

```bash
bench --site <site> run-tests --app hr_for_cobegroup
```

---

## Liên quan

- [HR Attendance — API Contract](HR-Attendance-API.html) — full endpoint spec
- [HR Attendance — Architecture](HR-Attendance-Architecture.html) — system design + lifecycle
- [User guide tổng quan](../users/Cham-Cong-Tong-Quan.html) — hướng dẫn HR Manager
