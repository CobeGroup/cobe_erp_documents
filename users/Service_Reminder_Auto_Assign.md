---
title: Auto-Assign Ticket & SIM
layout: default
parent: Dịch vụ & Bảo dưỡng
nav_order: 1
---

# Hướng dẫn sử dụng — Auto-Assign Ticket & SIM Management

> Dành cho **admin**, **manager** và **nhân viên Sales/CSKH** đang dùng Service Ticket Reminder.
> Thuật toán + công thức scoring chi tiết ở [QUY_TAC_PHAN_BO_BAO_DUONG.md](QUY_TAC_PHAN_BO_BAO_DUONG.md).

---

## Mục lục

1. [Hệ thống làm gì](#1-hệ-thống-làm-gì)
2. [Bật/tắt auto-assign](#2-bậttắt-auto-assign)
3. [Tóm tắt cách chọn người phụ trách](#3-tóm-tắt-cách-chọn-người-phụ-trách)
4. [Setup dữ liệu trước khi bật](#4-setup-dữ-liệu-trước-khi-bật)
5. [Sử dụng hàng ngày (nhân viên)](#5-sử-dụng-hàng-ngày-nhân-viên)
6. [Manager — tùy chỉnh Settings](#6-manager--tùy-chỉnh-settings)
7. [Tình huống & FAQ](#7-tình-huống--faq)

---

## 1. Hệ thống làm gì

Khi 1 ticket Service Ticket Reminder phát sinh (từ Sales Order hoặc tạo tay), hệ thống **tự động chọn người phụ trách phù hợp nhất** dựa trên 6 yếu tố cộng dồn. Mục tiêu:

- Khách quen được giữ đúng người đã chăm sóc.
- Việc phân đều, không ai quá tải.
- Người chuyên môn cao / hiệu suất tốt được giao nhiều hơn.
- Bảo dưỡng viên gần khu vực khách được ưu tiên.

Bạn **luôn có quyền sửa tay** sau khi hệ thống gán. Mọi thay đổi đều được ghi lại trong tab **Management** của ticket.

---

## 2. Bật/tắt auto-assign

### Mặc định: **TẮT**

Khi mới triển khai, auto-assign chưa bật. Ticket mới sẽ KHÔNG được tự gán — workflow gán tay/bulk như cũ vẫn chạy.

### Cách bật

1. Mở **Service Reminder Settings** → tab **Auto-Assignment**
2. Tick **"Bật Auto-Assign"**
3. (Tùy chọn) Set **Thời hạn bắt đầu / kết thúc** nếu chỉ chạy trong khoảng thời gian cụ thể
4. Save

### Phased rollout / Trial period

| Setting | Hành vi |
|---|---|
| Switch BẬT, không có start/end | Chạy ngay và mãi mãi |
| Switch BẬT, start = 01/06/2026 | Chạy từ 01/06/2026 |
| Switch BẬT, end = 30/06/2026 | Chạy đến hết 30/06/2026 |
| Switch BẬT, start = 01/06 + end = 30/06 | Chỉ chạy tháng 6/2026 |
| Switch TẮT | Không bao giờ chạy |

### Test mà không cần bật toàn cục

Nút **"Auto Re-assign"** trên form ticket **luôn chạy được bất kể switch on/off**. Bạn có thể thử trên vài ticket lẻ để xem hệ thống chọn ai trước khi bật toàn cục. (Chỉ Manager / System Manager thấy nút này.)

---

## 3. Tóm tắt cách chọn người phụ trách

Hệ thống chấm điểm mỗi nhân viên dựa trên 6 yếu tố — ai cao điểm nhất được chọn:

| # | Yếu tố | Ý nghĩa | Weight mặc định |
|---|---|---|---|
| 1 | **Acc.Manager** | Người đã chăm khách trước đây (qua SO.owner) | **500** (gần như luôn thắng) |
| 2 | **Chuyên môn** | Có chuyên môn dòng sản phẩm của ticket | 30 |
| 3 | **Hiệu suất** | Tỉ lệ chốt đơn cao trong 90 ngày | 25 |
| 4 | **Tương tác** | Đã comment trên ticket gần đây/nhiều | 20 |
| 5 | **Địa lý** | Phụ trách tỉnh/quận của khách | 15 |
| 6 | **Cân bằng tải** | Đang ít việc hơn trung bình → cộng / nhiều hơn → trừ | 10 |

> Công thức + Bayesian smoothing + recency decay chi tiết: xem [QUY_TAC](QUY_TAC_PHAN_BO_BAO_DUONG.md).

### Khi nhân viên cũ đã nghỉ — SIM tự bàn giao

```
Khách quen Anh A (đã nghỉ) → A từng giữ SIM 0982xxx
→ SIM 0982xxx hiện ai giữ? → Anh B
→ ticket về Anh B
```

Khách không bị "đứt liên lạc" khi nhân viên thay đổi — miễn là SIM đã bàn giao đúng trong **SIM Ownership**.

---

## 4. Setup dữ liệu trước khi bật

> **Quan trọng:** Không setup vẫn chạy được — hệ thống rơi về các yếu tố còn lại. Nhưng setup càng đủ thì gán càng chính xác.

> **Multi-company:** Mỗi record (Handler / Expertise / Coverage / Company SIM) đều có field **Company** *optional*:
> - **Để trống** = áp dụng cho **mọi công ty** (global).
> - **Chọn 1 cty** = chỉ áp dụng khi ticket thuộc đúng cty đó.

### 4.1 BẮT BUỘC — Service Reminder Handler (whitelist service man)

Đánh dấu ai là service man đang còn làm. **User không có record → không bao giờ vào pool auto-assign.**

1. Vào **Service Reminder Handler** → New
2. Điền:
   - **User**: nhân viên (dropdown chỉ hiện user thuộc group "Phòng dịch vụ" nếu Settings đã cấu hình group)
   - **Company**: chọn cty cụ thể, hoặc để trống = global
   - **Is Active**: tick
   - **Valid From / To**: optional (vd tạm ngưng theo thời gian)
3. Save
4. Lặp cho từng service man

> **Mỗi user chỉ có 1 record duy nhất** (unique constraint). Sửa record cũ thay vì tạo mới.

### 4.2 BẮT BUỘC — SIM công ty (Company SIM + SIM Ownership)

Để hệ thống biết "user nghỉ thì ai tiếp quản khách của họ".

**Lần đầu: nhập danh sách SIM**

1. Vào **Company SIM** → New
2. Điền **Phone Number**, **Carrier**, **Purpose**, **Status = Active**
3. Save → lặp cho từng SIM

> Mẹo: dùng **Frappe Data Import** từ Excel. Template: [sample_data/company_sim_template.csv](sample_data/company_sim_template.csv).

**Gán SIM cho nhân viên**

1. Vào **SIM Ownership** → New
2. **SIM** + **User** + **Valid From** = ngày cấp + **Valid To** để trống + **Handoff Reason** = `Initial`
3. Save → Company SIM.**Current Owner** tự fill.

**Khi nhân viên nghỉ — bàn giao SIM**

Với từng SIM của nhân viên nghỉ:
1. Mở SIM Ownership đang mở (Valid To = trống) → set **Valid To** = ngày bàn giao → Save
2. Tạo record mới: SIM + User mới + Valid From = ngày bàn giao + Handoff Reason = `Resignation`
3. Khách quen của người cũ tự về người mới — không cần làm gì thêm.

**SIM "mồ côi"** (chưa quyết được ai tiếp quản):
- Đóng row cũ (set Valid To) → KHÔNG tạo row mới → Current Owner = trống
- Khi quyết được → tạo SIM Ownership mới với Handoff Reason = `Manual Reassign`

### 4.3 NÊN CÓ — Service Sales Person Group

Để filter "user là service man" qua data Sales Person có sẵn ở ERPNext.

1. Vào **Service Reminder Settings** → tab **Auto-Assignment**
2. Field **Service Sales Person Group**: chọn group (vd: `Phòng dịch vụ`)
3. Save

> Sau khi cấu hình, các field **User** trên Handler/Expertise/Coverage/SIM Ownership chỉ hiện user có Sales Person trong group này. Để trống Settings = bỏ filter, hiện tất cả user.

### 4.4 NÊN CÓ — Khu vực phụ trách (User Area Coverage)

Để ticket khách Quận 7 ưu tiên cho nhân viên phụ trách Quận 7.

1. Vào **User Area Coverage** → New
2. **User** + **Province** + **District** (để trống = phụ trách toàn province) + **Priority** 1-10 + **Is Active** tick
3. Save → lặp cho từng (user, khu vực)

> Khuyến nghị: setup nhất quán cho tất cả user, hoặc không ai cả. Setup vài người sẽ tạo bất công.

### 4.5 NÊN CÓ — Chuyên môn (Service Reminder Handler Expertise)

Để ticket sản phẩm Akion ưu tiên cho nhân viên chuyên Akion.

1. Vào **Service Reminder Handler Expertise** → New
2. **User** + **Item Group** (vd: "Akion", "Lọc tinh") + **Proficiency** 1-5 + **Is Active** tick
3. Save → lặp cho từng (user, item_group)

---

## 5. Sử dụng hàng ngày (nhân viên)

### Nhận biết ticket nào là của mình

**Trong list view "Service Ticket Reminder"** — dấu chấm màu bên trái:
- 🟢 **Của tôi** — `account_manager` là chính bạn
- ⚪ **Chưa phân** — chưa có người phụ trách, có thể nhận
- 🔵 **Khác** — của người khác

Click vào dấu chấm → tự động filter danh sách.

**Mặc định list lọc:** `avg_schedule_date` trong 7 ngày tới + status Open. Có thể đổi filter, Frappe nhớ lựa chọn.

**Trên form 1 ticket** — banner màu phía trên:
- ✅ **Xanh**: Bạn đang phụ trách
- ⚠️ **Vàng**: Ticket do người khác phụ trách
- ○ **Xám**: Chưa được phân

### Tự nhận / đổi người phụ trách

1. Mở ticket → field **Account Manager** → chọn user mới (hoặc xóa rỗng)
2. Save → banner refresh ngay

Entry mới được thêm vào Assignment Log với `Type = manual`.

### Xem lịch sử phân bổ (chỉ Manager / System Manager)

Tab **Management** trên form ticket → 2 bảng:

1. **Assignment Log**: từng lần ticket được gán
   - Date / User / Scoring breakdown / Reason / Type (`manual` / `auto` / `bulk`)
   - Bấm **"▸ chi tiết"** ở Scoring để xem full JSON.
2. **Previous Account Managers**: lịch sử người đã từng phụ trách
   - User / From / To / Reason

→ Hữu ích khi audit "Tại sao ticket này về tay tôi?"

---

## 6. Manager — tùy chỉnh Settings

Chỉ **Service Reminder Manager** / **System Manager** có quyền chỉnh. Vào **Service Reminder Settings** → tab **Auto-Assignment**.

| Field | Mặc định | Khi nào cần đổi |
|---|---|---|
| Bật Auto-Assign | TẮT | Bật khi đã sẵn sàng |
| **Trọng số 6 yếu tố:** | | |
| Acc.Manager | **500** (quasi-hard) | Giảm xuống 40-100 nếu muốn pure soft (AM chỉ là 1 trong các yếu tố) |
| Expertise | 30 | Tăng nếu sản phẩm phức tạp |
| Performance | 25 | Tăng nếu muốn ưu tiên người chốt giỏi |
| Interaction | 20 | Giảm nếu nhiều người comment cùng ticket (tránh nhiễu) |
| Geo | 15 | Tăng nếu bảo dưỡng viên đi lại quan trọng |
| Load | 10 | Tăng nếu chênh lệch tải cao |
| **Lookback (ngày):** | | |
| AM Continuity | 90 | Tăng nếu khách ít tương tác |
| Performance | 90 | Giảm để phản ánh cải thiện gần đây |
| Interaction | 90 | |
| **Performance Bayesian K** | 5 | Tăng = "tin pool average" lâu hơn. User mới ít bị thiệt |
| **AM Max Load Cap (%)** | 150 | Service man (SO.owner) đang giữ ticket > 150% trung bình → bỏ AM signal cho user đó. Set 0 = không cap |
| **Service Sales Person Group** | (trống) | Group Sales Person dành cho service man (vd: "Phòng dịch vụ"). Để trống = bỏ filter |
| **Min Ticket Schedule Date** | (trống = today) | Cron đêm CHỈ quét ticket có `avg_schedule_date >= ngày này`. Đặt 1 ngày quá khứ để dọn backlog cũ |

### Thử trước khi bật

1. Mở 1 ticket bất kỳ → bấm **Auto Re-assign** (góc trên phải, chỉ manager thấy) → confirm
2. Vào tab **Management** → xem **Assignment Log** để kiểm điểm

Lặp trên vài ticket khác nhau (khách cũ, khách mới, khác khu vực) trước khi bật switch toàn cục.

---

## 7. Tình huống & FAQ

### 7.1 "Khách mới gọi vào, hệ thống gán cho ai?"
Chưa có SO/STR → factor AM = 0. 5 factor còn lại quyết — thường người đang ít việc + cover đúng khu vực sẽ được pick.

### 7.2 "Khách quen với Anh A, mà A đã nghỉ?"
Hệ thống tự tìm người tiếp quản qua **SIM Ownership** (SIM Anh A từng giữ → ai đang giữ SIM). Nếu mồ côi → fall back sang Coverage / Load / Performance.

### 7.3 "Bulk assign (Service Ticket Assignment) còn dùng được không?"
Vẫn hoạt động, KHÔNG bị thay thế. Bulk **override** auto-assign trên ticket được chọn. Bulk cũng log vào Assignment Log với `Type = bulk`.

### 7.4 "Ticket gán nhầm cho người ít kinh nghiệm — fix?"
- **Sai 1 ticket**: Sửa tay → log tự lưu vết
- **Sai do data thiếu** (chưa setup Expertise): Setup Expertise cho người chuyên môn → ticket sau tự đúng. Ticket cũ → mở từng cái, bấm Auto Re-assign

### 7.5 "User comment vào ticket rồi đi nghỉ → vẫn được gán?"
Đúng — factor Interaction cộng điểm cho người comment gần nhất + nhiều nhất. Cần đổi → manager bấm Auto Re-assign hoặc gán tay.

### 7.6 "Cron đêm có làm đổi tay ticket đang xử lý?"
**KHÔNG**. Cron chỉ quét ticket `account_manager NULL` hoặc user đã `disabled`. Ticket đang có người active hoàn toàn không bị đụng.

### 7.7 "Đổi weight làm khách quen bị đổi tay không?"
**Có thể**. Continuity dựa SO.owner real-time mỗi ticket:
- SO.owner là service man active → ticket luôn về service man đó
- SO.owner nghỉ → SIM handoff → người tiếp quản
- SO.owner là salesman → bỏ qua AM, 5 factor khác quyết

Muốn AM thắng tuyệt đối: giữ `w_acc_manager = 500`. Muốn AM là 1 factor → giảm 40-100.

### 7.8 "Backlog ticket cũ chưa gán — cron xử lý thế nào?"

- Cron chạy **03:00 sáng VN** mỗi đêm, max **500 ticket/đêm**.
- **Filter mặc định:** chỉ quét ticket có `avg_schedule_date >= hôm nay` (bỏ qua backlog quá hạn). Đổi qua Settings → **Min Ticket Schedule Date**.
- Ưu tiên: avg_schedule_date sớm nhất → tiebreak FIFO (creation cũ trước).
- Ticket không có avg_schedule_date → vẫn quét, xuống cuối queue.

→ Mặc định không touch backlog 34k quá hạn. Muốn dọn → set Min Date về quá khứ (vd `2024-01-01`).

### 7.9 "Đổi giờ cron sang giờ khác?"

Vào **Scheduled Job Type** → tìm `cron_sweep_unassigned` → edit **Cron Format** (theo giờ **UTC**, không phải giờ VN):
- `0 20 * * *` = 03:00 VN (mặc định)
- `0 17 * * *` = 00:00 VN (nửa đêm)
- `0 23 * * *` = 06:00 VN sáng

### 7.10 "Bật/tắt switch có gây mất data không?"
Không. Switch chỉ điều khiển pipeline có chạy hay không. Ticket cũ + mọi data giữ nguyên.

### 7.11 "Đổi weight có chạy lại ticket cũ không?"
Không. Đổi weight chỉ áp ticket sinh ra **sau khi đổi**. Muốn re-assign ticket cũ → bấm Auto Re-assign trên form.

### 7.12 "Không thấy nút Auto Re-assign / tab Management?"
Cả 2 chỉ hiện cho **Service Reminder Manager** / **System Manager**. Liên hệ admin để được cấp role.

### 7.13 "Khi chưa setup gì mà bật switch, có sao không?"
An toàn. Hệ thống rơi về SO.owner + load balance — thường là sale đã chốt đơn cho khách. Không "gán bừa".

### 7.14 "User không xuất hiện trong dropdown User của Handler?"
Kiểm tra theo thứ tự:
1. User có Employee với `User ID` = email user?
2. Employee status != `Left`?
3. Có Sales Person với `Employee` = Employee.name?
4. Sales Person enabled = 1?
5. Sales Person nằm trong group đã chọn ở Settings?

Thiếu bất kỳ bước nào → user bị filter ra. Setup đủ → hard refresh (Ctrl+F5).

### 7.15 "1 nhân viên tạm nghỉ phép, không muốn nhận ticket mới?"
2 cách:
1. Disable User (User → bỏ tick Enabled) — vĩnh viễn loại khỏi pool
2. **Tạm thời**: Mở Handler record của họ → bỏ tick **Is Active**, hoặc set **Valid To** = ngày nghỉ → user bị loại trong khoảng đó

---

## Tham chiếu

- **Thuật toán + công thức chi tiết:** [QUY_TAC_PHAN_BO_BAO_DUONG.md](QUY_TAC_PHAN_BO_BAO_DUONG.md)
- **Quản lý SIM (SCD2 model):** [README.md](README.md)
- **Template import dữ liệu:** [sample_data/](sample_data/)

## Cần hỗ trợ?

- **Lỗi UI / không thấy field**: liên hệ tech team
- **Câu hỏi nghiệp vụ**: trao đổi với manager phụ trách
- **Đề xuất tính năng mới**: ghi vào ticket nội bộ
