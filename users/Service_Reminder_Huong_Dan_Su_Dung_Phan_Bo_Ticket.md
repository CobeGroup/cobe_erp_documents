# Hướng dẫn sử dụng — Auto-Assign Ticket & SIM Management

Dành cho **manager** và **nhân viên Sales/CSKH** đang dùng hệ thống Service Ticket Reminder.

---

## Mục lục

1. [Hệ thống làm gì cho bạn](#1-hệ-thống-làm-gì-cho-bạn)
2. [Bật/tắt chế độ tự động](#2-bậttắt-chế-độ-tự-động)
3. [Cách hệ thống chọn người phụ trách](#3-cách-hệ-thống-chọn-người-phụ-trách)
4. [Setup dữ liệu trước khi bật](#4-setup-dữ-liệu-trước-khi-bật)
5. [Sử dụng hàng ngày (cho nhân viên)](#5-sử-dụng-hàng-ngày-cho-nhân-viên)
6. [Manager — tùy chỉnh trọng số](#6-manager--tùy-chỉnh-trọng-số)
7. [Tình huống thường gặp](#7-tình-huống-thường-gặp)
8. [Câu hỏi thường gặp (FAQ)](#8-câu-hỏi-thường-gặp-faq)

---

## 1. Hệ thống làm gì cho bạn

Khi 1 ticket Service Ticket Reminder mới sinh ra (từ đơn hàng hoặc tạo tay), hệ thống **tự động chọn người phụ trách phù hợp nhất** dựa trên 6 yếu tố cộng dồn. Mục tiêu:

- 🎯 Khách quen được giữ đúng người đã chăm sóc → giữ quan hệ liên tục
- ⚖️ Việc phân đều, không ai quá tải
- 🏆 Người chuyên môn cao / hiệu suất tốt được giao nhiều hơn
- 📍 Bảo dưỡng viên gần khu vực khách được ưu tiên → đi lại thuận tiện

Bạn **luôn có quyền sửa tay** sau khi hệ thống gán. Mọi thay đổi đều được ghi lại.

---

## 2. Bật/tắt chế độ tự động

### Trạng thái mặc định: **TẮT**

Khi mới triển khai, auto-assign **chưa bật**. Mọi ticket sinh ra sẽ KHÔNG được tự gán — workflow gán tay/bulk như cũ vẫn chạy bình thường.

### Cách bật

1. Vào Frappe → tìm **"Service Reminder Settings"**
2. Chuyển sang tab **Auto-Assignment**
3. Tick ô **"Bật Auto-Assign"** (`auto_assign_enabled`)
4. Save

Từ giờ, ticket mới sẽ tự được gán.

### Cách tắt

Bỏ tick ô trên → save. Ticket đã được gán giữ nguyên người phụ trách (không bị reset).

### Trước khi bật — test không cần bật toàn cục

Nút **"Auto Re-assign"** trên form ticket **luôn chạy được bất kể switch on/off** → bạn có thể thử trên vài ticket lẻ để xem hệ thống chọn ai, trước khi yên tâm bật toàn cục. (Chỉ Service Reminder Manager / System Manager mới thấy nút này.)

---

## 3. Cách hệ thống chọn người phụ trách

Hệ thống chấm điểm mỗi nhân viên dựa trên 6 yếu tố, **ai cao điểm nhất được chọn**:

| # | Yếu tố | Ý nghĩa | Trọng số mặc định |
|---|---|---|---|
| 1 | **Acc.Manager** (Người đã quen khách) | Người đã tạo đơn cho khách trước đây, hoặc đã phụ trách ticket trước của khách | **40 (cao nhất)** |
| 2 | **Chuyên môn** | Người có chuyên môn dòng sản phẩm của ticket | 30 |
| 3 | **Hiệu suất** | Người có tỉ lệ chốt đơn cao trong 90 ngày qua | 25 |
| 4 | **Tương tác** | Người đã comment trên ticket gần đây và nhiều nhất | 20 |
| 5 | **Địa lý** | Người phụ trách tỉnh/quận của khách | 15 |
| 6 | **Cân bằng tải** | Người đang ít việc hơn trung bình (cộng điểm) / nhiều việc hơn trung bình (trừ điểm) | 10 |

### Trường hợp đặc biệt khi nhân viên nghỉ việc

Khi người phụ trách cũ đã nghỉ → hệ thống **tự động** tìm người tiếp quản qua **SIM Ownership** (bảng quản lý SIM công ty):

```
Khách quen Anh A (đã nghỉ) → A từng giữ SIM 0982xxx → 
SIM 0982xxx hiện ai giữ? → Anh B → ticket về Anh B
```

→ Khách không bị "đứt liên lạc" khi nhân viên thay đổi.

---

## 4. Setup dữ liệu trước khi bật

> **Quan trọng:** Không setup vẫn chạy được, hệ thống sẽ rơi về các yếu tố còn lại. Nhưng setup càng đủ thì gán càng chính xác.

### 4.1 BẮT BUỘC — SIM công ty (Company SIM + SIM Ownership)

#### Lần đầu: nhập danh sách SIM

1. Vào **Company SIM** → New
2. Điền:
   - **Phone Number**: số SIM (vd: `0982000001`)
   - **Carrier**: nhà mạng
   - **Purpose**: mục đích sử dụng (Sales / Care / Hotline / Warranty / Delivery)
   - **Status**: Active
3. Save
4. Lặp lại cho từng SIM

> Mẹo: dùng **Frappe Data Import** để import hàng loạt từ Excel. Template ở [sample_data/company_sim_template.csv](sample_data/company_sim_template.csv).

#### Gán SIM cho nhân viên (lần đầu)

1. Vào **SIM Ownership** → New
2. Điền:
   - **SIM**: chọn SIM vừa tạo
   - **User**: nhân viên được cấp
   - **Valid From**: ngày cấp
   - **Valid To**: **để trống** (= đang sở hữu)
   - **Handoff Reason**: chọn `Initial`
3. Save

→ Mở lại Company SIM → field **Current Owner** tự fill = nhân viên vừa gán.

#### Khi nhân viên nghỉ việc — bàn giao SIM

Với từng SIM của nhân viên nghỉ:

1. Mở record **SIM Ownership** đang mở của SIM đó (Valid To = trống)
2. Set **Valid To** = ngày bàn giao → Save
3. Tạo SIM Ownership mới:
   - **SIM**: SIM đó
   - **User**: người tiếp quản
   - **Valid From**: ngày bàn giao
   - **Valid To**: để trống
   - **Handoff Reason**: `Resignation`
4. Save

→ Hệ thống tự cập nhật `Current Owner` của SIM sang người mới. Khách hàng quen của người cũ tự động được chăm bởi người mới mà không cần làm gì thêm.

#### SIM "mồ côi" (chưa có người tiếp quản)

Khi nhân viên nghỉ mà chưa quyết được ai tiếp quản:

- Đóng row cũ (set Valid To) → KHÔNG tạo row mới → Current Owner = trống
- Khi admin quyết → tạo SIM Ownership mới với `Manual Reassign`

### 4.2 NÊN CÓ — Khu vực phụ trách (User Area Coverage)

Giúp ticket khách Quận 7 ưu tiên cho nhân viên phụ trách Quận 7.

1. Vào **User Area Coverage** → New
2. Điền:
   - **User**: nhân viên
   - **Province**: tỉnh/thành (vd: TP. Hồ Chí Minh)
   - **District**: (tùy chọn) quận/huyện cụ thể. Để trống = phụ trách toàn province.
   - **Priority**: 1-10 (10 là cao nhất). Dùng khi nhiều người cùng cover 1 khu vực.
   - **Is Active**: tick
3. Save
4. Lặp cho từng (user, khu vực)

> Lưu ý: nếu **không ai** được setup Coverage → factor Địa lý = 0 cho mọi người (neutral, không lệch). Nếu **chỉ vài người** setup → người được setup có lợi thế. Khuyến nghị: setup nhất quán (hoặc tất cả, hoặc không ai).

### 4.3 NÊN CÓ — Chuyên môn (Account Manager Expertise)

Giúp ticket sản phẩm Akion ưu tiên cho nhân viên chuyên Akion.

1. Vào **Account Manager Expertise** → New
2. Điền:
   - **User**: nhân viên
   - **Item Group**: nhóm sản phẩm/dịch vụ (vd: "Akion", "Lọc tinh")
   - **Proficiency**: 1-5 (5 là chuyên sâu nhất)
   - **Is Active**: tick
3. Save
4. Lặp cho từng (user, item_group)

> Tương tự Coverage: setup nhất quán để tránh bất công.

---

## 5. Sử dụng hàng ngày (cho nhân viên)

### Nhận biết ticket nào là của mình

#### Trong list view "Service Ticket Reminder"

Mỗi ticket có dấu chấm màu bên trái:

- 🟢 **Của tôi** — `account_manager` là chính bạn
- ⚪ **Chưa phân** — chưa có người phụ trách, bạn có thể nhận
- 🔵 **Khác** — của người khác phụ trách (chỉ hiện nếu cấu hình cho xem)

Click vào dấu chấm → tự động filter danh sách theo loại đó.

#### Mặc định list lọc

List view tự lọc:
- Ngày dự kiến chăm sóc (avg_schedule_date) trong vòng **7 ngày tới**
- Status = **Open**

Có thể đổi filter tùy ý — Frappe nhớ filter cuối cho user.

#### Trên form 1 ticket

Banner màu phía trên cùng:

- ✅ **Xanh**: "Bạn đang phụ trách ticket này"
- ⚠️ **Vàng**: "Ticket này do [tên người khác] phụ trách (không phải bạn)"
- ○ **Xám**: "Ticket chưa được phân — bạn có thể nhận"

### Xem lịch sử phân bổ

Trên form ticket, kéo xuống section **Assignment History** (collapsed mặc định) → thấy 2 bảng:

1. **Assignment Log**: từng lần ticket được gán
   - Date / User / Scoring (chi tiết điểm 6 yếu tố) / Reason / Type (manual / auto / bulk)
2. **Previous Account Managers**: lịch sử người đã từng phụ trách
   - User / From / To / Reason

→ Hữu ích khi cần audit: "Tại sao ticket này về tay tôi?"

### Tự nhận ticket chưa phân / đổi người phụ trách

Bạn có quyền sửa field **Account Manager** trên form (nếu được phân quyền):

1. Mở ticket
2. Field **Account Manager** → chọn user mới (hoặc xóa rỗng)
3. Save

→ Banner refresh ngay. Entry mới được thêm vào Assignment Log với `Type = manual`.

---

## 6. Manager — tùy chỉnh trọng số

Chỉ **Service Reminder Manager** / **System Manager** có quyền chỉnh.

### Vị trí

**Service Reminder Settings** → tab **Auto-Assignment**

### Các giá trị có thể chỉnh

| Field | Mặc định | Khi nào cần đổi |
|---|---|---|
| Bật Auto-Assign | TẮT | Bật khi đã sẵn sàng |
| **Trọng số 6 yếu tố** (Weight): | | |
| Acc.Manager | 40 | **Tăng lên 500** → biến soft thành "gần như hard" (AM thắng gần luôn) |
| Expertise | 30 | Tăng nếu chuyên môn quan trọng (sản phẩm phức tạp) |
| Performance | 25 | Tăng nếu muốn ưu tiên người chốt giỏi |
| Interaction | 20 | Giảm nếu nhiều người comment vào ticket thường (tránh nhiễu) |
| Geo | 15 | Tăng nếu bảo dưỡng viên (đi lại quan trọng) |
| Load | 10 | Tăng nếu chênh lệch tải cao → cân bằng mạnh hơn |
| **Lookback (số ngày)**: | | |
| AM Continuity Lookback | 90 ngày | Tăng nếu khách ít tương tác (vẫn nhớ AM cũ lâu hơn) |
| Performance Lookback | 90 ngày | Giảm để phản ánh cải thiện gần đây của user |
| Interaction Lookback | 90 ngày | |
| **Performance Bayesian K** | 5 | Tăng nếu nhân viên mới hay bị thiệt; giảm nếu muốn phản ánh nhanh hiệu suất thực |

### Thử trước khi bật

Sau khi chỉnh weight:

1. Mở 1 ticket bất kỳ
2. Bấm nút **Auto Re-assign** (góc trên phải, chỉ manager thấy)
3. Confirm dialog → hệ thống chạy lại pipeline với weight mới
4. Xem `Assignment Log` để kiểm điểm và lý do

→ Lặp lại trên vài ticket khác nhau (khách cũ, khách mới, khác khu vực) để chắc chắn không lệch trước khi bật switch.

---

## 7. Tình huống thường gặp

### 7.1 "Khách mới gọi vào, hệ thống gán cho ai?"

- Khách chưa có đơn / chưa có ticket nào → factor Acc.Manager = 0 cho mọi user
- 5 factor còn lại quyết định
- Thường: người đang ít việc + phụ trách đúng khu vực sẽ được pick

### 7.2 "Khách quen với Anh A, mà A đã nghỉ?"

- Hệ thống tự tìm người tiếp quản qua **SIM Ownership** (SIM Anh A từng giữ → ai đang giữ SIM đó)
- Nếu Anh A từng giữ nhiều SIM → hệ thống thử lần lượt
- Nếu không SIM nào còn active owner → fall back sang Coverage / Load / Performance

### 7.3 "Manager bulk assign theo tuần (Service Ticket Assignment)"

- Workflow này **vẫn hoạt động**, KHÔNG bị thay thế bởi auto-assign
- Bulk assign **override** auto-assign trên ticket được chọn
- Mọi bulk assign cũng được ghi vào `Assignment Log` với `Type = bulk`

### 7.4 "Ticket được gán nhầm cho người ít kinh nghiệm"

3 cách xử lý:

1. **Sửa tay từng ticket** (gán đúng người) → log lưu vết tự động
2. **Bulk reassign** qua Service Ticket Assignment cho 1 nhóm
3. **Nếu sai HỆ THỐNG** (vd: chưa setup Expertise nên hệ thống không biết ai chuyên gì):
   - Setup Expertise cho người chuyên môn cao → ticket sau sẽ tự đúng
   - Nếu muốn re-assign ticket cũ → mở từng cái, bấm **Auto Re-assign**

### 7.5 "1 user comment vào ticket rồi sao đó họ phải đi nghỉ → vẫn được gán?"

- Đúng, factor Interaction sẽ cộng điểm cho người commented gần nhất + nhiều nhất
- Nếu cần đổi → manager bấm Auto Re-assign hoặc gán tay

### 7.6 "Cron đêm tự gán lại có làm ticket đang xử lý bị đổi tay không?"

- KHÔNG. Cron chỉ quét ticket **chưa có người phụ trách** (NULL) hoặc người phụ trách **đã bị disabled**
- Ticket đang có người active hoàn toàn không bị đụng

---

## 8. Câu hỏi thường gặp (FAQ)

**Q: Bật/tắt switch có gây mất data không?**
A: Không. Switch chỉ điều khiển có chạy pipeline auto hay không. Ticket cũ và mọi data khác giữ nguyên.

**Q: Đổi weight có chạy lại toàn bộ ticket cũ không?**
A: Không. Đổi weight chỉ ảnh hưởng ticket sinh ra **sau khi đổi**. Ticket cũ giữ nguyên người phụ trách. Muốn re-assign từng ticket → bấm Auto Re-assign trên form.

**Q: Tôi không có nút "Auto Re-assign", tại sao?**
A: Nút chỉ hiện cho **Service Reminder Manager** hoặc **System Manager**. Liên hệ admin để được cấp role.

**Q: Khi chưa setup gì (SIM/Coverage/Expertise), bật switch có sao không?**
A: Vẫn an toàn. Hệ thống rơi về SO.owner (người tạo đơn cho khách) + cân bằng tải. Đây thường là người ĐÚNG (sale đã chốt đơn). Không "gán bừa".

**Q: Làm sao biết ticket được gán đúng / sai?**
A: Mở Assignment Log trên ticket → xem **Reason** + **Scoring**. Vd: `"Auto: score=87.5 (am=1.0, exp=0.6, perf=0.72, int=0.0, geo=0.5, load_bal=-0.1)"` → cho biết hệ thống chọn vì AM continuity rất cao.

**Q: Khách hàng chuyển khu vực, có cần update gì không?**
A: Khách chuyển không cần làm gì với SIM. Chỉ cần cập nhật **Address** của Customer là field `province` / `district` trên ticket mới sẽ đúng.

**Q: Tôi muốn 1 nhân viên ngừng nhận ticket mới (vd: nghỉ phép)**
A: 2 cách:
1. Disable user (User → bỏ tick Enabled) → vĩnh viễn loại khỏi pool
2. **Tạm thời**: bỏ tick Is Active trong tất cả User Area Coverage / Account Manager Expertise của họ → mất signal Geo + Expertise → ticket ít về tay họ hơn

**Q: Performance score được tính như thế nào nếu nhân viên mới?**
A: Hệ thống dùng **Bayesian smoothing** — user mới chưa có ticket close nào → mặc định lấy điểm trung bình của team. Khi user đủ data thực, score sẽ tự chuyển sang phản ánh hiệu suất thật. Không bị "phạt cold-start".

**Q: Tôi muốn deactivate auto-assign cho 1 dòng sản phẩm cụ thể?**
A: Hiện tại chưa hỗ trợ tắt riêng theo sản phẩm. Workaround: tắt switch toàn cục + dùng bulk Service Ticket Assignment, hoặc liên hệ tech team nếu cần feature này.

---

## Tham chiếu nội bộ

- Tài liệu kỹ thuật chi tiết: [QUY_TAC_PHAN_BO_BAO_DUONG.md](QUY_TAC_PHAN_BO_BAO_DUONG.md)
- Quản lý SIM (chi tiết): [README.md](README.md)
- Template import dữ liệu: [sample_data/](sample_data/)

---

## Cần hỗ trợ?

- **Lỗi UI / không thấy field**: liên hệ tech team
- **Câu hỏi nghiệp vụ**: trao đổi với manager phụ trách
- **Đề xuất tính năng mới**: ghi vào ticket nội bộ
