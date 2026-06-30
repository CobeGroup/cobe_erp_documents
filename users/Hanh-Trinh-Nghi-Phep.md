---
title: "Hành trình một đơn nghỉ phép (NV → Manager → HR)"
layout: default
parent: Chấm công & HR
nav_order: 5
---

# Hành trình một đơn nghỉ phép
{: .no_toc }

**Theo chân 1 đơn từ lúc tạo đến lúc được duyệt** · Nhân viên → Trưởng Bộ Phận → HR
{: .fs-3 .text-grey-dk-000 }

> Trang này kể **toàn cảnh** một đơn nghỉ phép đi qua **2 bước duyệt**. Cần thao tác chi tiết theo
> vai trò thì bấm vào link ở mỗi bước. Ví dụ dùng xuyên suốt: chị **Trần Thị Bình** xin nghỉ
> **nửa ngày sáng 20/06** để đi khám.

<details open markdown="block">
  <summary>Mục lục</summary>
{: .text-delta }
1. TOC
{:toc}
</details>

---

## Toàn cảnh

```mermaid
%%{init:{'theme':'base','themeVariables':{'fontSize':'14px'}}}%%
flowchart TB
  classDef nv fill:#e6f4ff,stroke:#299dd8,color:#0b4a6f;
  classDef mg fill:#fff7e6,stroke:#fa8c16,color:#873800;
  classDef hr fill:#f9f0ff,stroke:#9254de,color:#391085;
  classDef ok fill:#f6ffed,stroke:#54ab78,color:#135200;
  A["①  Nhân viên tạo đơn<br/>(app · tab Nghỉ phép)"]:::nv
  B["Đơn: <b>Chờ Manager</b>"]:::nv
  C["②  Trưởng Bộ Phận duyệt<br/>(app · tab Cần duyệt)"]:::mg
  D["Đơn: <b>Chờ HR</b>"]:::mg
  E["③  HR duyệt / Submit<br/>(app hoặc Desk)"]:::hr
  F["Đơn: <b>Đã được duyệt</b><br/>→ trừ số dư phép"]:::ok
  A --> B --> C --> D --> E --> F
```

| Bước | Ai làm | Ở đâu | Kết quả |
|---|---|---|---|
| ① Tạo đơn | Nhân viên | App → **Nghỉ phép** | Đơn ở **Chờ Manager** |
| ② Duyệt bước 1 | Trưởng Bộ Phận (`Leave Approver`) | App → **Cần duyệt** | Đơn lên **Chờ HR** |
| ③ Duyệt bước 2 | HR (`HR Manager`) | App → **Cần duyệt** *hoặc* Desk | Đơn **Đã được duyệt**, trừ phép |

> ⚠️ Đơn **chỉ chính thức & trừ phép** sau bước ③ (HR). Manager duyệt xong, đơn vẫn còn "chờ".

---

## ① Nhân viên tạo đơn

Mở app → tab **Nghỉ phép** → bấm nút **➕** → điền **Loại phép · Khoảng ngày · (Nửa ngày) · Lý do**
→ **Gửi đơn**.

<img src="images/guide/hanhtrinh/j1-nv-tao-don.png" width="260" alt="Nhân viên tạo đơn xin nghỉ — form">

> 💡 Form ghi rõ **"Đơn gửi đi sẽ qua duyệt 2 bước: Quản lý → HR"**. Tick **Nghỉ nửa ngày** + chọn
> **Buổi sáng/chiều** nếu chỉ nghỉ 0,5 ngày.
> Chi tiết: [Nhân viên — Xin nghỉ phép](Guide-NhanVien-NghiPhep.html).

Gửi xong, đơn xuất hiện trong danh sách của nhân viên với nhãn **Chờ Manager** (vàng):

<img src="images/guide/hanhtrinh/j2-cho-manager.png" width="260" alt="Đơn vừa gửi — trạng thái Chờ Manager">

---

## ② Trưởng Bộ Phận duyệt (bước 1)

Người duyệt nhận **thông báo đẩy** + badge đỏ trên tab **Cần duyệt**. Mở đơn của Trần Thị Bình → bấm
**Duyệt (Manager)**.

<img src="images/guide/hanhtrinh/j3-manager-duyet.png" width="260" alt="Trưởng Bộ Phận duyệt — nút Duyệt (Manager)">

- **Duyệt (Manager)** → đơn chuyển sang **Chờ HR submit**.
- **Từ chối** → đơn bị đóng (hiện hộp **Xác nhận** trước khi chốt).
- **Chuyển duyệt** → giao cho người khác (ca khó / đi vắng).

> ⏳ **Bấm 1 lần rồi đợi**: màn hiện **"Đang xử lý…"** rồi báo kết quả. Đừng bấm nhiều lần — lỡ bấm
> lại chỉ báo *"Đơn này đã được xử lý"*, không duyệt/từ chối hai lần. *(Áp dụng cho cả bước HR.)*

💻 **Trên Desk:** mở đơn (trạng thái *Pending Manager*) → bấm **Actions** → chọn **Manager Approve** (hoặc *Manager Reject*).

![Manager duyệt trên Desk — Actions → Manager Approve / Manager Reject](images/desk/hr-leave-manager-actions.png)

> 📘 Chi tiết: [Trưởng Bộ Phận — Phê duyệt](Guide-TruongBoPhan-Duyet.html) ·
> [Duyệt nghỉ phép (Manager + HR)](Duyet-Nghi-Phep.html).

---

## ③ HR duyệt (bước 2 — bước cuối)

Đơn đã qua Manager hiện ở **Chờ HR submit**. HR mở trong tab **Cần duyệt** (hoặc trên Desk) → bấm
**Submit (HR)**.

<img src="images/guide/hanhtrinh/j4-hr-duyet.png" width="260" alt="HR duyệt — nút Submit (HR)">

- **Submit (HR)** → đơn **chính thức được duyệt** và **trừ số dư phép**.
- **Từ chối** → đơn bị đóng.

💻 **Trên Desk** (xem chi tiết, lọc trạng thái, xử lý hàng loạt): mở `/app/leave-application` → đơn ở *Manager Approved* → bấm **Actions** → chọn **Submit** (hoặc *HR Reject*).

![HR duyệt trên Desk — Actions → Submit / HR Reject](images/desk/hr-leave-approve-actions.png)

> 📘 Lọc danh sách + cột trạng thái workflow trên Desk: xem [Duyệt nghỉ phép (Manager + HR) → phần B](Duyet-Nghi-Phep.html#b-hr-duyệt-trên-desk-app).

---

## Kết quả: đơn được duyệt, phép bị trừ

Nhân viên thấy đơn chuyển nhãn **Đã được duyệt** (xanh) và **số dư phép giảm** đúng số ngày đã nghỉ
(ở đây Phép năm **7,5 → 7,0** vì nghỉ 0,5 ngày).

<img src="images/guide/hanhtrinh/j5-da-duyet.png" width="260" alt="Đơn đã được duyệt — số dư phép giảm 0,5">

---

## Nhãn trạng thái — đối chiếu nhanh

| Nhân viên thấy | Người duyệt thấy | Nghĩa |
|---|---|---|
| 🟡 **Chờ Manager** | Chờ Manager duyệt | Đang chờ bước ① Trưởng Bộ Phận |
| 🔵 **Manager đã duyệt** | Chờ HR submit | Đã qua bước ②, đang chờ HR |
| 🟢 **Đã được duyệt** | *(đã rời inbox)* | Hoàn tất bước ③, đã trừ phép |
| 🔴 **Từ chối** | *(đã rời inbox)* | Bị từ chối ở bước ① hoặc ② |

---

## Liên quan
- 👤 [Nhân viên: Xin nghỉ phép](Guide-NhanVien-NghiPhep.html)
- ✅ [Duyệt nghỉ phép & chấm công bù (Manager + HR)](Duyet-Nghi-Phep.html) — hướng dẫn duyệt đầy đủ + Desk
- ⚙️ [Cấp phép & gán người duyệt](Desk-HR-CapPhep.html) · 🔧 [Leave Setup & Workflow (kỹ thuật)](HR-Leave-Setup.html)
