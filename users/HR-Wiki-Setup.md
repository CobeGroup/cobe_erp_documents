---
title: Wiki "Hướng dẫn sử dụng" cho my-workspace
layout: default
parent: Chấm công & HR
nav_order: 8
---

# Wiki Hướng dẫn sử dụng PWA my-workspace

> Đối tượng: **HR Manager**, **System Manager**, **Documentation Lead**.
>
> PWA my-workspace có tab **"Hướng dẫn sử dụng"** (cuối page Thêm). Tab này nhúng Frappe Wiki Space `my-workspace` qua iframe. Nội dung wiki **khác wiki Desk** — chỉ tập trung use case mobile-first (chấm công bằng phone, xin phép, duyệt đơn qua PWA...).

---

## Mục lục

1. [Tại sao cần wiki riêng cho my-workspace](#1-tại-sao-cần-wiki-riêng-cho-my-workspace)
2. [Cấu hình Wiki Space lần đầu](#2-cấu-hình-wiki-space-lần-đầu)
3. [Cấu trúc nội dung đề xuất](#3-cấu-trúc-nội-dung-đề-xuất)
4. [Override URL (đổi tên Space)](#4-override-url-đổi-tên-space)
5. [Mobile-friendly tips khi viết wiki](#5-mobile-friendly-tips-khi-viết-wiki)

---

## 1. Tại sao cần wiki riêng cho my-workspace

| | Wiki Desk (`/wiki`) | Wiki my-workspace (`/wiki/my-workspace`) |
|---|---|---|
| Đối tượng | HR Manager / System Manager / Power user | NV thường + Manager dùng phone |
| Nội dung | Cấu hình HR Policy / Shift Type / Workflow / báo cáo... | Cách check-in, xin phép, duyệt đơn từ phone |
| Độ chi tiết | Sâu, có screenshot Desk + SQL | Ngắn gọn, screenshot mobile, từng bước tap |
| UX render | Desktop browser | iframe trong PWA mobile |

→ Trộn 2 loại nội dung vào 1 wiki sẽ khó tìm. Cobe tách Space riêng.

---

## 2. Cấu hình Wiki Space lần đầu

### 2.1. Cài Frappe Wiki app (nếu chưa)

```bash
cd /path/to/bench
bench get-app https://github.com/frappe/wiki
bench --site <site> install-app wiki
bench --site <site> migrate
```

### 2.2. Tạo Wiki Space cho my-workspace

1. Desk → search "**Wiki Space**" → **New**
2. Điền:
   - `Space Name` = "Hướng dẫn my-workspace"
   - `Route` = `my-workspace` ← **bắt buộc đúng route này** (matches `/wiki/my-workspace` mà PWA load)
   - `App` = chọn (vd hr_for_cobegroup hoặc để default)
3. **Save**.

### 2.3. Tạo Wiki Page đầu tiên

1. Vào Wiki Space vừa tạo → **Add New Page**
2. Điền:
   - `Title` = "Tổng quan my-workspace"
   - `Route` = `tong-quan` (sẽ là `/wiki/my-workspace/tong-quan`)
   - `Content` = markdown nội dung
3. **Publish**.

→ User truy cập PWA → "Thêm" → "Hướng dẫn sử dụng" → thấy ngay.

---

## 3. Cấu trúc nội dung đề xuất

Tổ chức theo workflow của NV:

```
/wiki/my-workspace
├── tong-quan                      # Giới thiệu PWA, 5 tab chính
├── cai-pwa-len-phone              # iOS: Add to Home Screen / Android: install prompt
├── cham-cong
│   ├── chuong-trinh-lan-dau       # Đăng ký phone + login
│   ├── tap-cham-cong-vao          # Step-by-step IN
│   ├── tap-cham-cong-ra           # Step-by-step OUT
│   ├── chup-selfie                # Nếu Company bật flag
│   ├── ngoai-vung-vp              # Trường hợp KTV/Sales đi field
│   └── quen-check-in-out          # Cách xin lại qua Attendance Request
├── nghi-phep
│   ├── xem-so-du                  # Tab Nghỉ phép
│   ├── tao-don                    # FloatButton "+"
│   ├── theo-doi-trang-thai        # Manager Approved / Submitted / Rejected
│   └── huy-don                    # (khi nào support)
├── can-duyet                      # Cho Manager + HR
│   ├── duyet-leave-application
│   ├── duyet-attendance-request
│   └── lich-su-duyet
├── notification                   # Bell icon, danh sách thông báo
├── fsm                            # Chỉ KTV — nhúng /technician trong PWA
└── thay-doi-cau-hinh              # HR đổi feature flag ở HR Policy
```

→ Mỗi page **ngắn 1-2 màn hình**, có screenshot mobile minh họa.

---

## 4. Override URL (đổi tên Space)

Nếu Cobe muốn dùng route khác (vd `cam-nang-pwa`):

### Option A: Set qua `site_config.json`

```bash
bench --site <site> set-config my_workspace_wiki_url "/wiki/cam-nang-pwa"
bench restart
```

PWA tự đọc qua `window.wiki_url` lần load tiếp theo.

### Option B: Sửa code

`apps/hr_for_cobegroup/hr_for_cobegroup/www/_my_workspace.py`:
```python
context.wiki_url = (
    frappe.conf.get("my_workspace_wiki_url") or "/wiki/my-workspace"
)
```
→ đổi default `/wiki/my-workspace` thành route khác → rebuild PWA.

---

## 5. Mobile-friendly tips khi viết wiki

Vì user xem wiki **qua iframe trên phone**, format quan trọng:

- **Heading ngắn** — không dài quá 1 dòng phone
- **Step list** rõ "1. Mở PWA → 2. Tap 'Chấm công' → 3. ...". Không viết đoạn văn dài
- **Screenshot mobile**:
  - Chụp trên iPhone hoặc emulator Android, resolution chuẩn phone
  - Cắt crop khu vực quan trọng, không cả màn hình
  - Đặt trong thư mục assets của Frappe Wiki → upload qua Desk
- **Bảng**: scroll ngang trên phone, hạn chế dùng. Nếu dùng, max 2-3 cột
- **Code block**: monospace, scroll ngang
- **Hyperlink internal**: dùng route relative `[Chấm công vào](/wiki/my-workspace/cham-cong/tap-cham-cong-vao)`

---

## Liên quan

- [Tổng quan & Setup](Cham-Cong-Tong-Quan.html)
- [HR Policy](HR-Policy.html) — feature flag PWA
- [HR Leave Setup](HR-Leave-Setup.html)
