---
title: "Ca làm việc & gán ca"
layout: default
parent: Quản trị (cấu hình)
grand_parent: Chấm công & HR
nav_order: 4
---

# Ca làm việc & gán ca
{: .no_toc }

**Dành cho:** HR Manager / System Manager · **Doctype:** Shift Type, Shift Assignment
{: .fs-3 .text-grey-dk-000 }

> **Shift Type** = giờ vào/ra + Holiday List. **Shift Assignment** = gán ca đó cho từng nhân viên. Phải có ca thì check-in mới sinh **Attendance** (Present/Half).

---

## 1. Tạo Shift Type

1. Mở: Desk → Search **"Shift Type"** · URL `/app/shift-type/new`.
2. Điền **giờ vào / giờ ra** (Start/End Time).
3. Gắn **Holiday List** (ngày lễ — xem [Ngày lễ](Desk-Admin-Holiday.html)).
4. Đặt **ngưỡng half-day** nếu muốn nửa ngày T7 tự ra.
5. Lưu.

![Form Shift Type — giờ vào/ra + Holiday List](images/desk/admin-shifttype-form.png)

> 💡 Cobe override Shift Type (**CobeShiftType**) để **vô hiệu phần tự chấm Vắng** của HRMS (presence-based). Bật **Auto Attendance** trên Shift Type để check-in tự sinh Present/Half, nhưng sẽ **không** tự chấm Vắng ngày trống.

## 2. Gán ca cho nhân viên (Shift Assignment)

1. Mở: Search **"Shift Assignment"** · URL `/app/shift-assignment/new`.
2. Chọn **Employee** + **Shift Type** + ngày bắt đầu (và kết thúc nếu có).
3. **Submit**.

![Form Shift Assignment — gán ca cho nhân viên](images/desk/admin-shiftassign-new.png)

Gán nhiều người: tạo nhiều Shift Assignment (hoặc dùng công cụ bulk của HRMS nếu có).

## 3. Sinh công

- Chạy/để lịch **Process Auto Attendance** chạy → từ check-in tạo **Attendance**.
- Không gán ca → check-in vẫn lưu nhưng **không ra Attendance**.

---

## ⚠️ Lỗi thường gặp

| Hiện tượng | Cách xử |
|---|---|
| Có check-in mà không ra công | NV **chưa được gán Shift Assignment** |
| NV bị chấm Vắng ngày nghỉ | Kiểm Shift Type có bật auto-absent ngoài ý muốn / sai override |
| Ngày lễ vẫn thiếu công | Shift Type chưa gắn đúng **Holiday List** |

## Liên quan
- [Holiday & Shift Setup (kỹ thuật)](HR-Holiday-Shift-Setup.html) · [Theo dõi chấm công](Desk-HR-ChamCong.html)
