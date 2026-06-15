---
title: HR Office Location
layout: default
parent: Chấm công & HR
nav_order: 3
---

# HR Office Location — Danh sách văn phòng

> Mỗi VP/chi nhánh là 1 record. Multi-office support: server tự tìm VP gần nhất khi nhân viên chấm công.
> Permissions: **HR Manager** và **System Manager** full; tất cả role khác chỉ đọc.

---

## Mục lục

1. [Cách mở](#1-cách-mở)
2. [Các field](#2-các-field)
3. [Child table — allowed_wifi_bssids](#3-child-table--allowed_wifi_bssids)
4. [Child table — allowed_lan_subnets](#4-child-table--allowed_lan_subnets)
5. [Hướng dẫn lấy tọa độ GPS](#5-hướng-dẫn-lấy-tọa-độ-gps)
6. [Hướng dẫn lấy WiFi BSSID](#6-hướng-dẫn-lấy-wifi-bssid)
7. [Hướng dẫn xác định subnet LAN](#7-hướng-dẫn-xác-định-subnet-lan)

---

## 1. Cách mở

- Desk → search "HR Office Location"
- URL: `/app/hr-office-location`
- Tạo mới: `/app/hr-office-location/new`

---

## 2. Các field

### `name` (Data, autoname)

Tự gen theo series `OFC-001`, `OFC-002`,... Không sửa được sau khi tạo.

### `office_label` (Data, **bắt buộc**)

Tên dễ đọc. Ví dụ:
- "VP Q1 - Sảnh chính"
- "VP Hà Nội - Tầng 3"
- "Kho Bình Dương"

Hiển thị trong PWA cho nhân viên + trong báo cáo. Đặt tên gợi nhớ địa điểm.

### `company` (Link → Company)

Optional. Dùng khi tổ chức có nhiều company trong cùng group, muốn filter office theo company.

### `location_latitude` (Float, **bắt buộc**)

Latitude (vĩ độ) của VP. Lấy từ Google Maps (xem [phần 5](#5-hướng-dẫn-lấy-tọa-độ-gps)).

Ví dụ: `10.7769` (Q1 TPHCM). Range hợp lệ: **-90 đến 90**.

Format: số thập phân, **4-6 chữ số sau dấu phân cách thập phân** (độ chính xác ~1-10m là đủ cho radius office).

> ⚠️ **Locale gotcha — dấu thập phân**: Frappe đọc số theo Number Format của System Settings.
> - Locale **Việt Nam** (`#.###,##`): dấu thập phân là **dấu phẩy**, nhập `10,7769`. Nhập `10.7769` sẽ bị hiểu là `107,769` → ngoài range `-90..90` → throw lỗi *"Vĩ độ phải nằm trong khoảng -90..90"*.
> - Locale **International** (`#,###.##`): dấu thập phân là **dấu chấm**, nhập `10.7769` bình thường.
>
> Check Number Format hiện tại: Desk → search "System Settings" → field `Number Format`.

### `location_longitude` (Float, **bắt buộc**)

Longitude (kinh độ) của VP. Ví dụ: `106.7009`. Range hợp lệ: **-180 đến 180**.

Cùng locale gotcha như `location_latitude` ở trên — Việt Nam locale nhập `106,7009` (dấu phẩy), International nhập `106.7009` (dấu chấm).

### `allowed_radius_m` (Int)

Bán kính cho phép GPS check, đơn vị **mét**. Để trống → dùng `default_radius_m` từ HR Attendance Settings (default 100m).

Override khi VP cần bán kính khác (vd VP campus lớn nhập 300m).

### `allowed_wifi_bssids` (Table → HR Office Wifi)

Child table chứa danh sách MAC router cho phép. Chỉ có tác dụng khi flag `enable_wifi_bssid_check` ON trong Settings.

### `allowed_lan_subnets` (Table → HR Office Lan Subnet)

Child table chứa danh sách subnet LAN VP. Chỉ có tác dụng khi flag `enable_webrtc_check` ON.

### `is_active` (Check, default: 1)

Bật/tắt office mà không xóa. Khi `is_active=0`, server **không** tính office này khi tìm nearest.

Trường hợp dùng: VP đang sửa chữa, đóng cửa tạm thời, sắp di dời.

### `notes` (Small Text)

Ghi chú nội bộ. Ví dụ: "Khai trương 2026-01-15", "Đổi địa chỉ 2026-06-01 sang...".

---

## 3. Child table — `allowed_wifi_bssids`

| Field | Type | Note |
|---|---|---|
| `bssid` | Data | MAC address router, format `aa:bb:cc:dd:ee:ff` (lowercase, có dấu `:`) |
| `ssid_label` | Data | Tên dễ đọc, vd "Office-2.4GHz", "Tầng 3 - WiFi" |

Mỗi router (Access Point) là 1 row. VP có nhiều AP → nhiều row.

System auto-normalize BSSID về lowercase khi save. Nếu nhập sai format (vd chỉ có 11 chữ) → validation error.

**Khi nào cần điền**: chỉ khi muốn bật `enable_wifi_bssid_check` ở Settings.

---

## 4. Child table — `allowed_lan_subnets`

| Field | Type | Note |
|---|---|---|
| `subnet_cidr` | Data | Subnet CIDR notation, vd `192.168.10.0/24` |
| `note` | Data | Optional, vd "Wifi nhân viên tầng 3" |

CIDR là cú pháp chuẩn để mô tả 1 dải IP. Ví dụ:
- `192.168.10.0/24` = 192.168.10.0 đến 192.168.10.255 (256 IP)
- `10.0.0.0/16` = 10.0.0.0 đến 10.0.255.255 (65536 IP)

System validate CIDR khi save — sai format throw error.

**Khi nào cần điền**: chỉ khi muốn bật `enable_webrtc_check` ở Settings.

---

## 5. Hướng dẫn lấy tọa độ GPS

### Cách 1 — Google Maps web (chính xác nhất)

1. Mở [maps.google.com](https://maps.google.com) trên máy tính
2. Search địa chỉ VP, hoặc zoom đến đúng vị trí
3. **Click chuột phải** vào điểm chính giữa VP
4. Menu hiện → click vào dòng đầu (có lat, lng dạng `10.7769, 106.7009`)
5. Tự copy vào clipboard → paste vào Settings

### Cách 2 — Google Maps mobile

1. Mở Google Maps trên phone
2. Long-press vào vị trí VP
3. Hiện pin đỏ → tap vào pin
4. Cuộn xuống thông tin → có dòng tọa độ
5. Copy lat, lng paste vào Settings

### Cách 3 — Phone đứng tại VP

1. Đến đúng vị trí VP (sảnh chính)
2. Mở app như "GPS Coordinates" hoặc Google Maps → tap nút "My location"
3. Đọc tọa độ hiện ra → ghi lại

Cách 3 chính xác nhất nhưng cần đến tận nơi.

**Định dạng nhập vào form**: số thập phân thường, **không có ký tự °** hoặc các đơn vị khác.

| Locale | Đúng | Sai |
|---|---|---|
| Việt Nam (`#.###,##`) | `10,7769` | `10.7769` (bị hiểu là 107,769) |
| International (`#,###.##`) | `10.7769` | `10,7769` |
| Bất kỳ locale | `10.7769` hoặc `10,7769` | `10°46'37"N` (DMS — không hỗ trợ) |

Google Maps copy ra format `10.7769, 106.7009` (dấu chấm). Khi paste vào form Frappe locale VN, **cần đổi `.` thành `,`**.

---

## 6. Hướng dẫn lấy WiFi BSSID

### Trên Android

1. Cài app **WiFi Analyzer** (Olgor Lab, miễn phí)
2. Mở app → chọn tab "AP List"
3. Tìm wifi VP đang connect → BSSID hiện dưới SSID, format `aa:bc:cd:de:ef:f0`
4. Copy vào child table

### Trên iOS

iOS không có cách dễ. 2 cách:

**Cách A**: Dùng máy tính cùng wifi
- macOS: Option+Click vào icon wifi (góc phải trên) → BSSID hiện trong dropdown
- Windows: PowerShell → `netsh wlan show interfaces` → tìm dòng "BSSID"

**Cách B**: Vào trang admin router
- Nhập `192.168.1.1` (hoặc IP gateway) vào browser → login → xem trang Wireless → BSSID hiện đó

### Lưu ý

- VP có nhiều AP (1 AP/tầng hoặc 1 AP/vùng) → enroll **mọi BSSID**
- Mỗi router thường có 2 BSSID (cho 2.4GHz và 5GHz) → enroll cả 2
- Đổi router → BSSID đổi → phải update list

---

## 7. Hướng dẫn xác định subnet LAN

### Cách 1 — Hỏi IT

Nhanh nhất. IT biết subnet wifi nhân viên VP đang dùng, vd `192.168.10.0/24`.

### Cách 2 — Tự xác định

1. Đứng tại VP, connect wifi
2. Trên phone Android: Settings → Wifi → tap (i) bên wifi → đọc IP của phone
3. Trên iPhone: Settings → Wifi → tap (i) → đọc "IP Address"

Ví dụ thấy IP `192.168.10.42`. Subnet thông thường `/24`:
- IP `192.168.10.x` → subnet `192.168.10.0/24`
- IP `192.168.1.x` → subnet `192.168.1.0/24`
- IP `10.0.5.x` → subnet `10.0.5.0/24` (hoặc lớn hơn `10.0.0.0/16`)

### Cách 3 — Dùng app Fing

Cài [Fing](https://www.fing.com/) → connect wifi → app tự nhận subnet hiện ra.

---

## Liên quan

- [HR Attendance Settings](HR-Attendance-Settings.html) — feature flag
- [Tổng quan & Setup](Cham-Cong-Tong-Quan.html)
