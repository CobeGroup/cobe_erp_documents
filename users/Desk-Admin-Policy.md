---
title: "Chính sách chấm công (HR Policy)"
layout: default
parent: Quản trị (cấu hình)
grand_parent: Chấm công & HR
nav_order: 2
---

# Chính sách chấm công (HR Policy)
{: .no_toc }

**Dành cho:** HR Manager / System Manager · **Doctype:** HR Policy
{: .fs-3 .text-grey-dk-000 }

> **Mỗi Company 1 record.** Hệ thống tự tạo sẵn record với defaults cho mỗi Company lúc cài. Tạo Company mới thì **tự tạo Policy** cho company đó. Đây là nơi bật/tắt các tính năng chấm công.

---

## 1. Mở

- Desk → Search **"HR Policy"** · URL `/app/hr-policy`.
- Mỗi company 1 record — mở đúng record của company cần chỉnh.

![Danh sách HR Policy — mỗi company 1 dòng](images/desk/admin-policy-list.png)

## 2. Các nhóm cấu hình (tab Attendance)

| Nhóm | Để làm gì |
|---|---|
| **Feature Flags** | Bật/tắt: **selfie** (mặc định bật), **face match**, **WFH mode** (`enable_wfh_mode`)… |
| **Defaults** | Giờ vào/ra mặc định, bán kính mặc định, ngưỡng… |
| **Lunch Break** | Khai giờ nghỉ trưa để tính công đúng |
| **Overtime Notification** | Nhắc khi làm quá giờ · **trần OT/ngày** · **hệ số OT ngày nửa buổi** |
| **Người duyệt cuối (cấp HR)** | Chỉ định ai chốt đơn nghỉ phép bước 2 |
| **Giới hạn giờ check-in** | Chặn quẹt VÀO quá muộn |
| **Check-in Whitelist** | Danh sách được phép chấm ngoại lệ |

![Form HR Policy — feature flags & defaults](images/desk/admin-policy-form.png)

## 3. Vài flag hay dùng

- **Selfie**: mặc định **bật** → nhân viên buộc chụp ảnh khi chấm công.
- **`enable_wfh_mode`**: bật để nhân viên thấy lựa chọn **WFH** trong form "Đề xuất" của app. Tắt → chỉ còn "Chấm công bù / Công tác".

> ⚠️ **Cấp phép năm KHÔNG còn ở HR Policy.** Cơ chế cũ (cấp phép theo số ngày chấm công) đã gỡ. Phép giờ dùng **Earned Leave native** — xem [Cấp phép](Desk-HR-CapPhep.html).

---

## 4. Người duyệt cuối (cấp HR)

Đơn nghỉ phép đi 2 bước: **Trưởng Bộ Phận → HR**. Bước HR là bước **chốt, trừ phép**.

Vấn đề: role `HR Manager` được cấp rộng — hiện có **14 tài khoản**, gồm cả tài khoản
tích hợp hệ thống. Ai cũng nhận đơn thì không ai thấy mình là người chịu trách nhiệm.

Bảng **Người duyệt cuối đơn nghỉ phép** khai **đích danh** ai nhận việc đó.

### Luật gọn trong một dòng

```
Duyệt được  =  CÓ role HR Manager   VÀ   CÓ tên trong bảng
                                    (hoặc là System Manager)
```

| Trạng thái bảng | Ai duyệt bước HR |
|---|---|
| **Để trống** | **Mọi HR Manager** — y như trước khi có tính năng này |
| **Có ≥ 1 dòng** | **Chỉ những người trong bảng** (+ System Manager) |

Chi tiết từng trường hợp:

| Trường hợp | Nhận đơn ở tab *Cần duyệt* | Bấm duyệt |
|---|---|---|
| Có role HR Manager **+ có tên** trong bảng | ✅ | ✅ |
| Có role HR Manager, **không có tên** | ❌ không thấy | ❌ bị chặn |
| **Có tên** nhưng **không có** role HR Manager | ❌ | ❌ |
| **Bảng để trống** | mọi HR Manager | mọi HR Manager |
| System Manager | ✅ | ✅ *(cửa thoát hiểm)* |

> Bảng này chỉ **THU HẸP** trong số HR Manager — **không cấp quyền** cho ai. Muốn ai đó
> duyệt được thì phải **vừa** cấp role HR Manager **vừa** thêm tên vào đây.
>
> Ngược lại, sau này **gỡ role HR Manager** của một người thì họ **tự rớt** khỏi luồng
> duyệt, dù tên vẫn còn trong bảng — không cần nhớ vào đây xoá.

### Khai theo TỪNG CÔNG TY

Mỗi công ty **một record HR Policy riêng**, và danh sách này nằm trong đó. Điền cho
công ty nào chỉ ăn cho **nhân viên của công ty đó**.

| Công ty | Nếu đã điền | Nếu bỏ trống |
|---|---|---|
| THẾ GIỚI ĐIỆN GIẢI | chỉ người trong bảng | mọi HR Manager |
| AKANWA | chỉ người trong bảng | mọi HR Manager |
| DOCTOR NƯỚC | chỉ người trong bảng | mọi HR Manager |

> ⚠️ Điền cho **một** công ty **không** siết hai công ty kia. Muốn siết cả tập đoàn thì
> phải mở **cả 3 record** HR Policy và điền từng cái.

### Cách khai

1. Desk → **HR Policy** → mở record của **đúng công ty**.
2. Kéo tới mục **Người duyệt cuối (cấp HR)**.
3. Ô **Người duyệt cuối đơn nghỉ phép** → gõ tên/email, chọn từ danh sách (chọn được nhiều).
4. **Save.** Có hiệu lực ngay, không cần migrate hay restart.

Muốn quay lại như cũ: **xoá hết dòng trong bảng** rồi Save — không phải sửa code.

**Ảnh hưởng tới 5 chỗ**, không chỉ nút duyệt:

1. **Tab Cần duyệt** (app) — người ngoài danh sách không thấy đơn của công ty đó nữa.
2. **Nút Duyệt / Từ chối** (app) — bấm sẽ báo *"Bạn không phải người duyệt đơn này ở bước hiện tại"*.
3. **Nút workflow trên Desk** — chặn ở tầng document nên **Desk cũng không lách được**.
4. **Thông báo** — chỉ người trong danh sách nhận báo khi đơn lên bước HR.
5. **Chuyển duyệt** — ở bước HR chỉ chọn được người trong danh sách (chuyển cho người
   ngoài thì đơn **kẹt** không ai duyệt được).

### Danh sách này KHÔNG áp cho

| | Vì sao |
|---|---|
| **Bước 1 (Trưởng Bộ Phận)** | Vẫn theo `leave_approver` như cũ; HR Manager ngoài danh sách vẫn duyệt thay được ở bước này |
| **Đơn Chấm công bù / Làm thêm giờ** | Đi theo *Shift Request Approver*, không có bước HR |
| **Đơn đã chuyển đích danh** | Người được chuyển tới quyết — nhưng chỉ chuyển được cho người trong danh sách (mục 5) |

> ⚠️ **Khai ít nhất 2 người mỗi công ty.** Một người mà nghỉ việc / nghỉ phép dài là đơn
> dồn không ai duyệt được — lúc đó chỉ System Manager gỡ kẹt, hoặc phải vào xoá bảng.

---

## 5. Hệ số OT ngày làm nửa buổi

Áp cho **ngày nửa buổi** — dòng trong Holiday List có tick *Half Day*, ở Cobe là
**Thứ 7 của khối văn phòng**. Người làm thêm buổi còn lại của ngày đó được trả
theo hệ số nào của **Overtime Type**:

| Lựa chọn | Hệ số dùng | Ở Cobe hiện là |
|---|---|---|
| Ngày thường | `standard_multiplier` | ×1.5 |
| **Cuối tuần** *(mặc định)* | `weekend_multiplier` | **×2.0** |
| Ngày lễ | `public_holiday_multiplier` | ×3.0 |

**Vì sao mặc định Cuối tuần:** buổi chiều Thứ 7 là **nửa ngày công ty đã cho
nghỉ**, làm vào đó là làm vào thời gian nghỉ chứ không phải giờ hành chính.

> 🔧 **Ô này sinh ra để vá một lỗi.** HRMS gốc xếp mọi ngày trong Holiday List
> không phải nghỉ tuần vào loại "ngày lễ", nên Thứ 7 nửa buổi bị trả **×3.0** —
> giá ngày lễ. Đặt lại ở đây là để đúng ý công ty, không phải để "chọn cho vui".
> Ô trống = hiểu là *Cuối tuần*.

Ngày thường, Chủ nhật và ngày lễ thật **không bị ô này ảnh hưởng** — vẫn ×1.5 /
×2.0 / ×3.0 như cũ, dù chọn gì.

---

## 6. Giới hạn giờ check-in

Chống kiểu **tối mới quẹt vào rồi quẹt ra ngay** để có bản chấm công: giờ công
gần bằng 0 nhưng ngày đó vẫn hiện ra trên bảng công.

| Ô | Ý nghĩa |
|---|---|
| **Chặn check-in** | `Không giới hạn` *(mặc định)* · `Sau giờ tan ca` · `Sau giờ cụ thể` |
| **Không cho check-in sau** | Mốc giờ — chỉ hiện khi chọn *Sau giờ cụ thể* |
| **Miễn trừ cho Whitelist** | Bật = KTV / Sales trong **Check-in Whitelist** không bị chặn |

- **Sau giờ tan ca** lấy mốc từ `end_time` của **ca nhân viên đang được gán** —
  mỗi ca một mốc (Office 17:30, AKW Chiều 20:00…). Không cần khai giờ.
- **Sau giờ cụ thể** dùng chung một mốc cho cả company.

**Chỉ chặn lượt VÀO.** Quẹt RA luôn được phép — chặn cả lượt ra sẽ nhốt người
làm khuya ở trạng thái chưa đóng ca, vừa mất giờ công vừa đẻ cảnh báo
*"Quên check-out"*.

Nhân viên bị chặn sẽ thấy trên app:

> *Đã quá giờ cho phép check-in (17:30). Nếu hôm nay bạn có đi làm, hãy tạo đơn
> Chấm công bù để quản lý duyệt.*

Đó cũng là cách xử đúng: hôm đó có đi làm thật thì nộp
[Chấm công bù](Duyet-Cham-Cong-Bu.html) để quản lý duyệt, thay vì quẹt lấy lệ.

> ⚠️ Nhân viên **không có ca** (không có Shift Assignment) thì chế độ *Sau giờ
> tan ca* **không chặn** — không suy ra được mốc nào để so. Muốn chặn nhóm này
> thì dùng *Sau giờ cụ thể*.

---

## 7. Đi trễ KHÔNG còn bị trừ nửa ngày công

Từ **30/07/2026**, đi trễ chỉ còn là **thông tin**: app hiện tag 🟠 *Đi trễ*,
bảng công vẫn ghi nhận, nhưng **không** hạ ngày công xuống Nửa ngày nữa.

Trạng thái công giờ chỉ phụ thuộc **số giờ làm thực tế** so với ngưỡng khai trên
Shift Type (`working_hours_threshold_for_half_day`) — xem [Ca làm việc](Desk-Admin-Shift.html).

> Luật cũ ("vào trễ 1 phút → Nửa ngày") thực tế chỉ chạy đúng **ngày 20/07/2026**,
> đúng hôm ô *Enable Late Entry Marking* trên Shift Type được bật rồi tắt lại,
> làm **12 nhân viên** bị Nửa ngày dù làm đủ 8,5–9,5 tiếng. Các bản ghi đó **không
> tự sửa** — HR muốn trả lại thì chỉnh tay trên Desk.

---

## ⚠️ Lỗi thường gặp

| Hiện tượng | Cách xử |
|---|---|
| Company mới không có chính sách | Tự tạo 1 record HR Policy cho company đó |
| Bật/tắt flag không ăn | Sửa **đúng record của company** nhân viên đang thuộc |
| Tìm mục cấp phép trong Policy | Không còn ở đây — dùng Leave Allocation/Policy Assignment |

## Liên quan
- [HR Policy (kỹ thuật)](HR-Policy.html)
