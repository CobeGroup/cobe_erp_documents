# Quy tắc phân bổ Service Ticket Reminder cho nhân viên bảo dưỡng

Tài liệu tóm tắt các quy tắc và thuật toán dùng để gán Service Ticket Reminder cho nhân viên phụ trách. Tài liệu này là **thiết kế** — phần code thực thi sẽ làm ở PR tiếp theo (hook `before_insert` trên Service Ticket Reminder).

---

## Mục tiêu

Khi 1 Service Ticket Reminder được tạo (từ Sales Order hoặc thủ công), hệ thống cần tự động chọn **1 nhân viên duy nhất** điền vào field `account_manager` sao cho:

1. Khách hàng được chăm sóc bởi **1 người xuyên suốt vòng đời** (tránh đổi tay liên tục → mất quan hệ).
2. Tải công việc phân bổ **công bằng**, không ai quá tải.
3. Tận dụng đúng **chuyên môn** của từng nhân viên.
4. Ưu tiên người **hiệu suất cao** (chốt đơn tốt → giao nhiều hơn).
5. Gom nhóm **theo khu vực địa lý** cho bảo dưỡng viên (đi lại thuận tiện).

---

## 6 yếu tố tính điểm (v0.5 — đang triển khai)

Thứ tự ưu tiên do business quyết định, ánh xạ thành trọng số default:

| # | Yếu tố | Ý nghĩa | Trọng số default | Field config trong `Service Reminder Settings` |
|---|---|---|---|---|
| 1 | **Acc.Manager** | SO.owner của customer + past STR.account_manager + SIM handoff khi user nghỉ. Trỏ tới "người đã quen khách" | **40** | `auto_assign_w_acc_manager` |
| 2 | **Chuyên môn sản phẩm** | User có chuyên môn dòng sản phẩm của ticket → +điểm (vd: A chuyên Akion, B chuyên lọc tinh) | 30 | `auto_assign_w_expertise` |
| 3 | **Hiệu suất** | Conversion rate cá nhân (STR → SO chốt thành công) trong N ngày — Bayesian smoothed cho user mới | 25 | `auto_assign_w_performance` |
| 4 | **Tương tác gần nhất + nhiều nhất** | Đếm Comment + Service Ticket Activity của user trên ticket này, có recency decay. View Log KHÔNG tính | 20 | `auto_assign_w_interaction` |
| 5 | **Địa lý** | User có cover province/district của ticket qua `User Area Coverage` → +điểm | 15 | `auto_assign_w_geo` |
| 6 | **Cân bằng tải** | Signed deviation: user **dưới** trung bình → **cộng** điểm (bonus). User **trên** trung bình → **trừ** điểm (penalty). Magnitude tỉ lệ với khoảng cách so với avg | 10 | `auto_assign_w_load` |

**Tunable to hard:** Tăng `auto_assign_w_acc_manager` lên 500+ → AM trở thành quasi-hard (gần như luôn thắng, vì 5 factor còn lại cộng lại tối đa chỉ ~100 điểm).

---

## Thuật toán: Pure soft scoring (1 bước duy nhất)

KHÔNG có hard filter. Mọi user eligible (có role `Service Reminder User` hoặc `Service Reminder Manager`, không phải Administrator/Guest, `User.enabled = 1`) đều tham gia chấm điểm.

```
Pool = eligible users
Precompute cho toàn pool:
   - load_map        = COUNT(STR Open) per user
   - conv_map        = Bayesian smoothed conversion rate per user
   - am_candidates   = {user: am_score} từ customer's SO.owner / past STR.AM / SIM handoff
   - interaction_map = {user: 0..1} từ Comment + Activity, recency-weighted, normalized

Cho mỗi user trong pool:
   score(user) = w_am   × am_score
               + w_exp  × expertise_score
               + w_perf × performance_score
               + w_int  × interaction_score
               + w_geo  × geo_score
               + w_load × load_balance

Pick user có score cao nhất.
Tiebreaker: user có load (số ticket Open) thấp hơn.
Nếu best score ≤ 0 (không có signal nào) → return None (để NULL cho admin gán tay).
```

Mỗi `*_score` được normalize về `[0..1]` để trọng số có ý nghĩa rõ ràng.

Lưu vết chi tiết vào field `assignment_log` của ticket (JSON dạng bảng) — xem [README.md](README.md):

```json
{
  "rule": "pure_soft_v0.5",
  "weights": {"acc_manager": 40, "expertise": 30, "performance": 25, ...},
  "lookback": {"continuity": 90, "performance": 90, "interaction": 90},
  "perf_smoothing_k": 5,
  "components": {"am": 1.0, "expertise": 0.6, "performance": 0.72, "interaction": 0.0, "geo": 0.5, "load_balance": -0.1},
  "final_score": 87.5
}
```

---

## Chi tiết tính từng yếu tố

### 1. am_score (Acc.Manager)
- `1.0` nếu user là `SO.owner` của SO gần nhất của customer (active)
- `0.8` nếu user là `past STR.account_manager` trong `auto_assign_continuity_lookback_days` (default 90d)
- `0.5` nếu user là `current_owner` của SIM mà 1 candidate trên từng giữ (handoff khi candidate inactive)
- `0` nếu không thuộc bất kỳ candidate nào

### 2. expertise_score (Chuyên môn)
Trung bình `proficiency/5` của user trên các item_group của ticket (từ DocType `Account Manager Expertise`).
- User chưa có expertise record nào cho item_group ticket → 0
- Pre-condition: manager phải fill `Account Manager Expertise` cho từng (user, item_group, proficiency 1-5)

### 3. performance_score (Hiệu suất, Bayesian smoothed)
- Raw: `converted / (converted + cancelled)` trong `auto_assign_performance_lookback_days` (default 90d). Open tickets không tính.
- Bayesian: `smoothed = (n × observed + K × pool_avg) / (n + K)` với K = `auto_assign_perf_smoothing_k` (default 5)
- **User mới (n=0) → smoothed = pool_avg** (không bị penalty cold-start)
- K càng cao = "tin pool average" càng lâu trước khi tin user

### 4. interaction_score (Tương tác)
- Nguồn: Frappe `Comment` + `Service Ticket Activity` của ticket trong `auto_assign_interaction_lookback_days` (default 90d)
- Weight: Comment=3, Activity=2 (Comment quan trọng hơn vì có nội dung)
- Recency decay: mỗi entry × `1 / (days_ago + 1)` → hôm nay × 1.0, hôm qua × 0.5, tuần trước × 0.14
- Normalize: chia cho max trong pool → ai có (số comment × recency) cao nhất = 1.0
- **Fairness:** nhiều user comment → mỗi người có score proportional theo (volume × recency), KHÔNG winner-takes-all
- View Log KHÔNG tính (bỏ vì có thể bị manager "spam view" làm nhiễu)

### 5. geo_score (Địa lý)
- Từ DocType `User Area Coverage`: nếu có record với (user, province khớp ticket, is_active=1) → `priority/10` (max 1.0)
- Match đúng cả district → +0.5 bonus (cap tổng = 1.0 sau cùng)
- Không cover → 0

### 6. load_balance (Cân bằng tải — symmetric signed deviation, v0.6)
- Công thức: `load_balance = (avg_load_pool - open_tickets_user) / max(avg_load_pool, 1)`
- User **dưới** avg → `load_balance > 0` → **cộng** điểm (bonus, khuyến khích nhận thêm)
- User **trên** avg → `load_balance < 0` → **trừ** điểm (penalty, tránh nhồi thêm)
- User **tại** avg → `load_balance = 0` → trung lập
- Magnitude tỉ lệ với khoảng cách so với avg → user lệch xa hơn ảnh hưởng nhiều hơn (vs v0.5 penalty-only chỉ phân biệt "trên avg" vs "không trên avg")
- Trong code dùng `+ w_load × load_balance` (cộng signed) thay vì `- w_load × penalty` (chỉ trừ)

---

## Cách xử lý các tình huống đặc biệt

### A. Khách hàng mới (chưa từng có SO / STR)
- am_candidates = {} → am_score = 0 cho mọi user
- 5 yếu tố còn lại (chuyên môn, hiệu suất, tương tác, địa lý, load) quyết định
- Performance Bayesian smoothing đảm bảo user mới không bị penalty oan

### B. Khách quen với nhân viên đã nghỉ việc
- SO.owner / past STR.AM inactive → helper `_resolve_user_or_handoff_via_sim` tự tra `SIM Ownership` tìm `current_owner` của SIM người cũ từng giữ
- Người tiếp quản nhận am_score = 0.5 (vẫn ưu tiên, nhưng thấp hơn AM trực tiếp 1.0)
- Đây là lý do mapping qua **SIM**, không phải user — khi handoff diễn ra, ownership tự chuyển

### C. SIM "mồ côi" (current_owner = NULL)
- Không tìm được người tiếp quản qua handoff → am_score = 0 (cho candidate đó)
- Hệ thống tự rơi về 5 yếu tố còn lại
- Admin chủ động gán SIM mồ côi qua DocType `SIM Ownership` (xem [README.md](README.md))

### D. Pool eligible rỗng
- Không có user nào enabled + có role Service Reminder User/Manager → `suggest_account_manager` return None
- Ticket để `account_manager = NULL`, admin can thiệp thủ công

### E. Mọi user đều có score = 0
- Không có signal nào (khách mới, không user có expertise, không Coverage setup, ticket chưa có comment) → return None
- Ticket để NULL → admin gán tay

### F. Override thủ công sau khi auto-assign
- Manager mở ticket, đổi `account_manager` → hook `before_save` log entry mới vào `assignment_log` với `type=manual`, lưu cả người cũ vào `previous_account_managers`
- Không cần code gì thêm — đã sẵn từ v0.2

---

## Phương án triển khai

### 3 trigger gọi `suggest_account_manager`

| Trigger | Khi nào | Interaction signal có active không? |
|---|---|---|
| Hook `before_insert` của `Service Ticket Reminder` | Ticket vừa được tạo (manual hoặc auto từ Sales Order) | ❌ (chưa có comment) |
| Whitelist API `auto_reassign(ticket_name)` — button **Auto Re-assign** trên form | Admin chủ động bấm (chỉ Service Reminder Manager / System Manager mới thấy button) | ✅ |
| Scheduler daily `cron_sweep_unassigned` | Quét max 500 ticket Open có `account_manager NULL` hoặc AM đã disabled | ✅ |

### Lưu vết để cải tiến

Mỗi lần auto-assign (hoặc manual change), hệ thống tự append entry vào 2 field JSON trên Service Ticket Reminder (hiển thị dạng bảng readonly trên form):

- `assignment_log` — `[{date, user, scoring, reason, type, performed_by}, ...]` — type = `manual` / `auto` / `bulk`
- `previous_account_managers` — `[{user, from_date, to_date, reason}, ...]` — lưu chuỗi handoff

Sau 1 tháng vận hành → query các ticket bị override (`type=manual` ngay sau `type=auto`) → review tại sao admin sửa → tinh chỉnh trọng số trong `Service Reminder Settings`.

### Override thủ công

Manager có toàn quyền sửa `account_manager` trên form bất kỳ lúc nào:
- Hook `before_save` tự log entry mới vào `assignment_log` với `type=manual` và `reason="Gán thủ công bởi <session_user>"`
- Banner UI trên form tự refresh (✓ xanh nếu là mình, ⚠ vàng nếu của người khác, ○ xám nếu chưa phân)
- Không cần phải làm gì khác — workflow đã sẵn từ v0.2

---

## Roadmap đề xuất

| Giai đoạn | Phạm vi | Trạng thái |
|---|---|---|
| **Bước 1** | Module `SIM Management` + 2 DocType | ✅ Đã xong |
| **Bước 2** | Import dữ liệu SIM + Ownership ban đầu từ file Excel | ✅ Templates + hướng dẫn sẵn ở [README.md](README.md#import-dữ-liệu-ban-đầu-từ-file-excel) — chờ mày chạy import |
| **Bước 3** | Hook `before_insert` Service Ticket Reminder — AM continuity qua past STR.account_manager | ✅ Đã xong (v0.1) — xem chi tiết bên dưới |
| **Bước 4** | Last commenter rule + Geo (User Area Coverage) + Load deviation + Admin re-assign button + Cron sweep | ✅ Đã xong (v0.2) |
| **Bước 5** | Expertise (Account Manager Expertise DocType) — soft scoring | ✅ Đã xong (v0.2) |
| **Bước 6** | SO.owner hard pick + SIM handoff | ✅ Đã xong (v0.3, sau đó refactor lại trong v0.4) |
| **Bước 7** | Pure soft scoring v0.4: 6 factor (AccManager + Expertise + Performance + Interaction + Geo + Load) — bỏ hard pick | ✅ Đã xong (v0.4) |
| **Bước 8** | v0.5: config-driven (6 weights + 3 lookback days + Bayesian K trong `Service Reminder Settings`), bỏ View Log, Bayesian smoothing cho Performance cold-start | ✅ Đã xong (v0.5) |
| **Bước 9** | v0.6: Load chuyển từ asymmetric penalty-only → **symmetric signed deviation** (bonus cho user dưới avg, penalty cho user trên avg, magnitude tỉ lệ khoảng cách) | ✅ Đã xong (v0.6) |

> **Lịch sử versions (cao → thấp = mới → cũ):** v0.6 = symmetric load balance · v0.5 = config-driven + Bayesian + bỏ View · v0.4 = pure soft scoring 6 factor · v0.3 = SO.owner hard pick · v0.2 = thêm Geo/Expertise/Load + admin button + cron · v0.1 = chỉ AM continuity qua past STR.

---

## Master switch — rollout an toàn

Field `auto_assign_enabled` trong `Service Reminder Settings` (**default TẮT**) khống chế toàn bộ auto-assign:

| Trigger | Khi switch TẮT (default) | Khi switch BẬT |
|---|---|---|
| `before_insert` (ticket mới) | KHÔNG auto-assign → `account_manager = NULL` | Chạy pipeline |
| `cron_sweep_unassigned` (cron đêm) | Skip hoàn toàn | Quét + gán |
| Nút **Auto Re-assign** trên form | **VẪN chạy** (bypass switch) | Vẫn chạy |

→ **Quy trình rollout đề xuất:**
1. Deploy với switch TẮT → không có gì auto, ticket vẫn gán tay như cũ
2. Config dần: SIM Ownership, User Area Coverage, Account Manager Expertise, weights
3. **Test trên vài ticket lẻ** bằng nút "Auto Re-assign" (chạy được dù switch tắt) → xem `assignment_log` scoring có hợp lý không
4. Khi yên tâm → BẬT `auto_assign_enabled` → từ đó ticket mới tự gán

### Nếu chưa config gì mà lỡ BẬT switch?

Pipeline vẫn KHÔNG "gán bừa" — nó rơi về:
- **Acc.Manager** = `SO.owner` (sale đã chốt đơn cho khách) — thường ĐÚNG, không cần SIM
- **Performance** = pool_avg (Bayesian) — neutral
- **Load balance** — cân bằng theo tải hiện có

→ Expertise + Geo = 0 (neutral, không lệch). Kết quả: ticket về sale gốc của khách hoặc người rảnh nhất. Không phải "sai bừa".

### Sửa ticket bị gán sai (dễ)
- Đổi `account_manager` trên form → hook tự log `type=manual` + lưu người cũ
- Hoặc bulk qua `Service Ticket Assignment` (theo Day/Province)
- List view filter "Của tôi / Chưa phân / Khác" giúp tìm nhanh ticket cần sửa

---

## Setup data cần có để pipeline tận dụng đầy đủ signals

| DocType | Mục đích | Hệ quả nếu không setup |
|---|---|---|
| **Company SIM + SIM Ownership** | Map SIM ↔ user theo thời gian (xem [README.md](README.md)) | Handoff khi user nghỉ không hoạt động → am_score giảm cho candidate inactive |
| **User Area Coverage** | Map user ↔ province/district phụ trách | geo_score = 0 cho mọi user → bỏ qua factor #5 |
| **Account Manager Expertise** | Map user ↔ item_group chuyên môn (proficiency 1-5) | expertise_score = 0 → bỏ qua factor #2 |
| **Service Reminder Settings** (auto_assign_*) | Trọng số + lookback + Bayesian K | Dùng default (40/30/25/20/15/10, 90d, K=5) |

→ Không setup gì hết: pipeline vẫn chạy, rơi về **load-based + AM-from-history**: chọn user under-loaded có lịch sử với customer (qua SO.owner / past STR.AM).

---

## Tham chiếu

- Module SIM Management — [README.md](README.md)
- Service Ticket Reminder DocType — [../service_reminder/doctype/service_ticket_reminder/](../service_reminder/doctype/service_ticket_reminder/)
- Service Ticket Assignment (bulk assign hiện tại) — [../service_reminder/doctype/service_ticket_assignment/](../service_reminder/doctype/service_ticket_assignment/)
