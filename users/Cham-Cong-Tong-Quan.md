---
title: Tổng quan & Setup
layout: default
parent: Chấm công & HR
nav_order: 1
---

# Hướng dẫn vận hành — HR Attendance phone-only

> Đối tượng: **HR Manager**, **System Manager**, **manager phòng ban**.
> Code trong `apps/hr_for_cobegroup/`.

Tài liệu đầu-đến-cuối: cài app, setup văn phòng, duyệt phone nhân viên, bật/tắt feature flag, vận hành thường ngày, audit khi nghi cheat.

---

## Mục lục

1. [Hệ thống làm gì](#1-hệ-thống-làm-gì)
2. [Cài đặt app](#2-cài-đặt-app)
3. [Cấu hình lần đầu](#3-cấu-hình-lần-đầu)
4. [Quy trình chấm công thường ngày](#4-quy-trình-chấm-công-thường-ngày)
5. [Anti-cheat — các lớp bảo vệ](#5-anti-cheat--các-lớp-bảo-vệ)
6. [Vận hành & audit](#6-vận-hành--audit)
7. [Sự cố thường gặp](#7-sự-cố-thường-gặp)

---

## 1. Hệ thống làm gì

Nhân viên chấm công IN/OUT bằng PWA cài trên phone. Mỗi lần chấm công:
- Phone tự lấy GPS → server check trong bán kính của văn phòng gần nhất
- Phone chụp selfie → upload làm bằng chứng audit
- Phone gửi device fingerprint → server kiểm tra phone đã được duyệt
- (Tuỳ chọn) Phone gửi WiFi BSSID / WebRTC local IP để chống fake GPS

Sau khi pass hết các check, server tạo bản ghi `Employee Checkin` chuẩn HRMS (Hồ sơ chấm công Frappe HRMS), tự động `log_type=IN` hoặc `OUT` tuỳ trạng thái trước đó.

**Nhân viên không cần** mua thiết bị, không đặt máy chấm công vật lý ở cửa, không cần ID card.

---

## 2. Cài đặt app

### 2.1. Cài backend (System Manager)

```bash
cd /path/to/bench
bench get-app https://github.com/cobegroup/hr_for_cobegroup    # nếu chưa có
bench --site <site_name> install-app hr_for_cobegroup
bench --site <site_name> migrate
```

App này yêu cầu `frappe` + `hrms` đã cài trước. Sau migrate sẽ có:
- 5 doctype mới trong module **Attendance**
- 10 custom field thêm vào `Employee Checkin`
- 1 doctype **HR Attendance Policy** (per-Company)

### 2.2. Build & deploy PWA

```bash
cd apps/hr_for_cobegroup/frontend/attendance-pwa
yarn install
yarn build   # output sang ../../hr_for_cobegroup/public/attendance-pwa/
bench build --app hr_for_cobegroup
```

PWA truy cập tại `https://working.thegioidiengiai.com/attendance`.

### 2.3. Nhân viên cài PWA trên phone

1. Mở Safari (iOS) hoặc Chrome (Android), vào `https://working.thegioidiengiai.com/attendance`
2. Login bằng tài khoản Frappe của mình
3. Trên iOS: tap nút **Share** → "Add to Home Screen"
4. Trên Android: trình duyệt sẽ tự prompt "Install app"
5. Sau khi cài, icon hiện như app thường

---

## 3. Cấu hình lần đầu

Sau khi cài, làm theo thứ tự:

### 3.1. Bật/tắt feature flag toàn cục

Mở Frappe Desk → search **"HR Attendance Policy"**. Bật/tắt từng tính năng theo nhu cầu — chi tiết từng field tại [HR Attendance Policy](HR-Attendance-Policy.html).

**Mặc định**: tất cả feature optional đều **TẮT**. Chỉ bật khi đã sẵn sàng test.

### 3.2. Tạo HR Office Location cho từng chi nhánh

Mỗi VP một record. Cần: tọa độ GPS (lấy từ Google Maps right-click → copy lat/lng) + bán kính cho phép. Chi tiết tại [HR Office Location](HR-Office-Location.html).

### 3.3. Duyệt phone nhân viên

Nhân viên mở PWA lần đầu → PWA tự tạo `HR Checkin Phone Registration` ở trạng thái **Draft**. HR Manager vào duyệt từng record. Chi tiết tại [HR Checkin Phone Registration](HR-Checkin-Phone-Registration.html).

### 3.4. (Nếu bật WFH) Duyệt WFH Approval

Manager nhận request từ nhân viên qua PWA hoặc Desk, duyệt từng ngày. Chi tiết tại [HR WFH Approval](HR-WFH-Approval.html).

---

## 4. Quy trình chấm công thường ngày

### 4.1. Nhân viên onsite (98% case)

1. Đến VP, mở PWA
2. Tap "Chấm công"
3. PWA hỏi quyền GPS lần đầu → cho phép
4. PWA hỏi quyền camera → cho phép
5. Nhìn camera, chụp selfie (tự động hoặc tap)
6. PWA upload → POST checkin → server validate
7. Thông báo "✓ Đã chấm công vào ca" hoặc "✓ Đã chấm công ra ca"

Tổng thời gian: **10-15 giây**.

### 4.2. Nhân viên WFH/công tác (nếu feature_flag bật)

1. Manager đã duyệt `HR WFH Approval` cho hôm nay → PWA tự detect
2. Sáng mở PWA → trang chủ hiện banner "Hôm nay bạn đăng ký WFH"
3. Tap "Bắt đầu ca WFH" → chụp selfie → submit
4. Cuối ngày tap "Kết thúc ca WFH"

Không enforce GPS radius (vì đang ở nhà / nơi công tác). GPS chỉ lưu audit.

### 4.3. Manual checkin (khi có sự cố)

HR Manager mở `Employee Checkin` → New → điền:
- Employee
- Log type (IN/OUT)
- Time
- `custom_checkin_source = "Manual-Desk"`
- Lưu

Trường hợp dùng: phone hỏng, mất internet, nhân viên quên.

---

## 5. Anti-cheat — các lớp bảo vệ

Tổ hợp các lớp tùy theo feature flag bật:

| Lớp | Always-on | Strength | iOS support |
|---|---|---|---|
| GPS radius check | ✅ | ⭐⭐⭐ | ✅ |
| Selfie audit (manual review) | ✅ | ⭐⭐⭐ | ✅ |
| Device fingerprint binding | ✅ | ⭐⭐⭐ | ✅ |
| Duplicate check (60s window) | ✅ | ⭐⭐ | ✅ |
| WiFi BSSID check | Optional flag | ⭐⭐⭐⭐ | ❌ |
| WebRTC local IP check | Optional flag | ⭐⭐⭐⭐ | ✅ |
| Face match auto (phase 2) | Optional flag | ⭐⭐⭐⭐⭐ | ✅ |

**Combo recommend cho production**:
- Always-on (4 lớp cơ bản) + WebRTC check (iOS-friendly) + Face match → đạt 5-6 lớp.

---

## 6. Vận hành & audit

### 6.1. Báo cáo chấm công định kỳ

Dùng built-in **Monthly Attendance Sheet** của HRMS — đã hoạt động vì ta extend `Employee Checkin` chứ không thay thế.

### 6.2. Audit selfie khi nghi cheat

1. Mở danh sách `Employee Checkin` của nhân viên đó
2. Click bản ghi → field `custom_selfie` có ảnh
3. So sánh với ảnh chuẩn của nhân viên trong `Employee → Personal Details`

### 6.3. Audit GPS distance

Mỗi bản ghi `Employee Checkin` lưu:
- `custom_gps_latitude`, `custom_gps_longitude` — tọa độ phone lúc chấm
- `custom_gps_distance_m` — khoảng cách tính được từ VP (m)

Distance > 0 nghĩa là phone không sát tâm VP (bình thường < 100m).

### 6.4. Audit device fingerprint

`custom_phone_device_fingerprint` là SHA256 hash. So sánh với `HR Checkin Phone Registration` của nhân viên đó:
- Khớp → phone đúng đã duyệt
- Khác → nhân viên đã đổi phone (hoặc người khác mượn) — cần điều tra

---

## 7. Sự cố thường gặp

| Triệu chứng | Nguyên nhân / khắc phục |
|---|---|
| PWA hiện "Phone chưa được duyệt" | HR Manager chưa submit `HR Checkin Phone Registration` của nhân viên đó. Mở Desk → submit. |
| "Bạn đang ở ngoài vùng văn phòng (cách 250m)" | Kiểm tra tọa độ `HR Office Location` đặt đúng chưa. Hoặc tăng `allowed_radius_m`. |
| "Vui lòng kết nối wifi văn phòng" | Feature `enable_wifi_bssid_check` bật + nhân viên ngoài wifi VP. Hoặc BSSID list chưa enroll wifi này. |
| Selfie bị quay ngang/lộn | Quay phone về portrait. Một số phone cũ Android có vấn đề camera orientation — đợi phase 2 fix. |
| Phone iOS không cho mở camera | Vào Settings → Safari → Camera → Allow. PWA nên đã có hướng dẫn trong-app. |
| Không thấy WFH banner dù đã duyệt | Check feature flag `enable_wfh_mode` đã bật + approval `wfh_date` đúng hôm nay + status=Approved. |
| Báo cáo Attendance Sheet không hiện checkin mới | Bench restart sau migrate. Hoặc clear cache. |

---

## Liên quan

- [HR Attendance Policy](HR-Attendance-Policy.html) — feature flag
- [HR Office Location](HR-Office-Location.html) — danh sách VP
- [HR Checkin Phone Registration](HR-Checkin-Phone-Registration.html)
- [HR WFH Approval](HR-WFH-Approval.html)
- [Tài liệu kỹ thuật HR Attendance](../tech/HR-Attendance-Tech.html)
