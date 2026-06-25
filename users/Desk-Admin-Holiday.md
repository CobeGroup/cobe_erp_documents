---
title: "Ngày lễ (Holiday List)"
layout: default
parent: Quản trị (cấu hình)
grand_parent: Chấm công & HR
nav_order: 3
---

# Ngày lễ (Holiday List)
{: .no_toc }

**Dành cho:** HR Manager / System Manager · **Doctype:** Holiday List
{: .fs-3 .text-grey-dk-000 }

> ⚠️ **Quan trọng (presence-based):** Holiday List của Cobe **CHỈ chứa ngày lễ** (Tết, lễ quốc gia…). **KHÔNG** thêm "weekly off" (nghỉ T7/CN) vào đây — vì ngày nghỉ tuần tùy biến theo từng người/phòng, và ngày không đi làm đã tự tính = nghỉ.

---

## 1. Tạo Holiday List

1. Mở: Desk → Search **"Holiday List"** · URL `/app/holiday-list/new`.
2. Đặt tên (vd "Lễ 2026") + khoảng ngày (01/01–31/12).
3. **Chỉ thêm các ngày lễ** vào bảng Holidays (thêm tay từng ngày lễ).
4. **KHÔNG** bấm "Add Weekly Holidays" / không chọn Weekly Off.
5. Lưu.

![Holiday List chỉ chứa ngày lễ, không weekly-off](images/desk/admin-holiday-form.png)

### Thêm từng ngày lễ (chi tiết)

1. Tại bảng **Holidays** → bấm **Add Row**.
2. Bấm vào dòng vừa thêm để mở chi tiết (**Editing Row**) → điền:
   - **Date** — ngày lễ.
   - **Description** — tên lễ (vd "Tết Dương lịch").
   - **Is Half Day** — tích nếu chỉ nghỉ nửa ngày. Bỏ trống nếu nghỉ cả ngày.
3. Bấm **ESC** để đóng dòng. Lặp lại cho từng ngày lễ → cuối cùng **Save**.

![Thêm 1 ngày lễ — Editing Row (Date + Description)](images/desk/admin-holiday-additem.png)

## 2. Gắn vào Shift Type

Holiday List phát huy tác dụng khi được gắn vào **Shift Type** (xem [Ca làm việc](Desk-Admin-Shift.html)) → ngày lễ trong list sẽ không bị tính thiếu công.

> 💡 Vì sao không khai weekly-off: Cobe ghi công theo **ngày có check-in** (Present/Half). Ngày trống = nghỉ, không bị chấm Vắng — nên không cần mã hoá T7/CN. Nếu khai weekly-off có thể gây lệch với mô hình này.

---

## ⚠️ Lỗi thường gặp

| Hiện tượng | Cách xử |
|---|---|
| Lỡ thêm Weekly Off vào list | Xoá các dòng weekly-off, chỉ giữ ngày lễ |
| Ngày lễ vẫn bị tính thiếu công | Holiday List chưa **gắn vào Shift Type** của NV |
| Thiếu ngày lễ | Bổ sung dòng ngày lễ còn thiếu vào bảng Holidays |

## Liên quan
- [Holiday & Shift Setup (kỹ thuật)](HR-Holiday-Shift-Setup.html)
