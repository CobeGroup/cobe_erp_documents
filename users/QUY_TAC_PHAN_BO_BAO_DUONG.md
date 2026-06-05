---
title: Quy tắc phân bổ bảo dưỡng
layout: default
parent: Dịch vụ & Bảo dưỡng
nav_order: 2
---

# Quy tắc & thuật toán phân bổ Service Ticket Reminder

> **Tài liệu kỹ thuật** — dành cho dev / architect / maintainer.
> **Hướng dẫn vận hành** (admin, manager, nhân viên) ở [HUONG_DAN_SU_DUNG.md](Service_Reminder_Auto_Assign.md).

---

## Mục tiêu pipeline

Khi 1 Service Ticket Reminder phát sinh (manual / auto từ SO / cron), pipeline `suggest_account_manager(ticket)` chọn **1 user duy nhất** điền vào `account_manager` sao cho:

1. Giữ continuity với khách (1 người chăm xuyên suốt).
2. Phân tải công bằng.
3. Tận dụng chuyên môn + hiệu suất.
4. Ưu tiên geo cho bảo dưỡng viên.

---

## Pipeline pure soft scoring

KHÔNG có hard filter trong scoring. Tất cả user **eligible** đều tham gia chấm điểm:

```
score(u) = w_am   × am_score
        + w_exp  × expertise_score
        + w_perf × performance_score
        + w_int  × interaction_score
        + w_geo  × geo_score
        + w_load × load_balance

Pick user có score cao nhất.
Tiebreaker: load (Open ticket count) thấp hơn.
Best score ≤ 0 → return None → account_manager = NULL.
```

Mọi `*_score` normalize về `[0..1]` (trừ `load_balance` có thể âm).

Mỗi lần gán log entry vào `assignment_log` (JSON) trên ticket: `{rule, weights, lookback, components, final_score}`.

---

## 6 yếu tố scoring

| # | Factor | Default weight | Settings field |
|---|---|---|---|
| 1 | AM (Acc.Manager) | **500** | `auto_assign_w_acc_manager` |
| 2 | Expertise | 30 | `auto_assign_w_expertise` |
| 3 | Performance | 25 | `auto_assign_w_performance` |
| 4 | Interaction | 20 | `auto_assign_w_interaction` |
| 5 | Geo | 15 | `auto_assign_w_geo` |
| 6 | Load balance | 10 | `auto_assign_w_load` |

> AM weight = 500 → "quasi-hard": gần như luôn thắng nếu khách có lịch sử (5 factor còn lại cộng max ~100). Giảm xuống 40-100 nếu muốn pure soft.

### 1. am_score
- Source: SO.owner của SO gần nhất của customer + SIM handoff fallback.
- Helper: `_get_acc_manager_candidates(customer, lookback, company)` + `_resolve_user_or_handoff_via_sim(user, company)`.

| SO.owner | am_score |
|---|---|
| Service man (eligible) + active | **1.0** |
| Service man + User.enabled=0 → SIM handoff thành công | **0.5** |
| Salesman (không trong pool eligible) hoặc handoff fail | **0** |
| Không có SO | **0** |

### 2. expertise_score
- Source: `Service Reminder Handler Expertise` records.
- Formula: `sum(proficiency) / (5 × |item_groups of ticket|)`, cap 1.0.
- No record → 0.

### 3. performance_score (Bayesian smoothed)
- Raw: `converted / (converted + cancelled)` trong `lookback_performance` (default 90d). Open tickets không tính.
- Smoothed: `(n × observed + K × pool_avg) / (n + K)` với K = `auto_assign_perf_smoothing_k` (default 5).
- User mới (n=0) → smoothed = pool_avg → không penalty cold-start.

### 4. interaction_score
- Source: `Comment` + `Service Ticket Activity` của ticket trong `lookback_interaction` (default 90d).
- Weight: Comment=3, Activity=2.
- Recency decay per entry: `× 1 / (days_ago + 1)`.
- Normalize: chia max trong pool → 0..1.
- **View Log KHÔNG tính** (chống manager "spam view" làm nhiễu).

### 5. geo_score
- Source: `User Area Coverage` records.
- Match province → `priority/10` (max 1.0).
- Match cả district → `+0.5` bonus (cap 1.0 sau cùng).

### 6. load_balance
- Formula: `(avg_load_pool - user_load) / max(avg_load_pool, 1)`.
- Symmetric signed deviation: user under avg → bonus, over avg → penalty.

---

## Eligibility (pool determination)

Pool = AND của 3 layer (function `_get_eligible_users(company)`):

### Layer 1: User base
- `User.enabled = 1`
- `User.name NOT IN ('Administrator', 'Guest')`
- Có role `Service Reminder User` HOẶC `Service Reminder Manager`

### Layer 2: Service Reminder Handler (whitelist v0.12)
- Có record `Service Reminder Handler` với `user = User.name`
- `is_active = 1`
- Hôm nay nằm trong `[valid_from, valid_to]` (NULL = unbounded)
- `company` IS NULL OR `company = ticket.company` (v1.1)

### Layer 3: Sales Person group (v1.2)
Chỉ áp dụng nếu Settings `auto_assign_service_sales_person_group` có giá trị:
- User có Employee với `user_id = User.name`
- `Employee.status != 'Left'`
- Employee có Sales Person với `enabled = 1`
- Sales Person nằm trong descendants của group (Nested Set: `lft >= group.lft AND rgt <= group.rgt`)

Settings không cấu hình → bỏ qua Layer 3 (backward-compat v1.1).

### Tại sao 2 lớp filter (Sales Person + Handler)?
- Sales Person group = "ai được thiết kế là service man" (ERPNext data).
- Handler = "ai **đang còn làm** service" (mình quản lý — loại được người chuyển bộ phận).

---

## SIM handoff resolution

`_resolve_user_or_handoff_via_sim(user_name, company)`:

```
if user eligible (pass 3 layer above):
    return (user, "active")

# User inactive/disabled → tìm SIM họ từng giữ
SIM_owned = SELECT sim FROM tabSIM Ownership WHERE user = user_name
            ORDER BY valid_from DESC
            (filter Company SIM.company NULL OR = ticket.company)

for each sim:
    current_owner = Company SIM.current_owner
    if current_owner eligible:
        return (current_owner, "handoff:SIM-X")

return (None, None)  # mồ côi
```

→ `am_score = 1.0` nếu mode = "active", `0.5` nếu mode bắt đầu với "handoff:".

---

## AM load cap (overload protection)

Sau khi tính `am_candidates`, áp cap nếu `am_max_load_pct > 0`:

```
threshold = avg_load × (am_max_load_pct / 100)
for u in am_candidates:
    if load_map[u] > threshold:
        skip AM signal cho u → am_score[u] = 0
```

Default `am_max_load_pct = 150` → cap = 1.5× avg. Set 0 = tắt cap. Log vào `scoring.am_skipped_overloaded`.

---

## Multi-company (v1.1)

Mỗi DocType có field `company` optional. **NULL = global** (apply mọi cty). Có giá trị = phải match `ticket.company`.

| DocType | Field `company` |
|---|---|
| Service Reminder Handler | Optional, NULL = global |
| Service Reminder Handler Expertise | Optional, NULL = global |
| User Area Coverage | Optional, NULL = global |
| Company SIM | Optional, NULL = global |
| SIM Ownership | (kế thừa qua Company SIM) |

### Filter strength per signal

| Signal | Filter mode |
|---|---|
| Pool eligible (Handler) | NULL OR match |
| Capacity (Handler) | NULL OR match |
| Expertise | NULL OR match |
| Geo (Coverage) | NULL OR match |
| SIM handoff (Company SIM) | NULL OR match |
| Load count (ticket) | **HARD** — chỉ count cùng cty |
| AM signal (SO) | **HARD** — chỉ xét SO cùng cty |
| Performance (STR) | **HARD** — chỉ count cùng cty |

HARD signals dùng `AND company = %s`. NULL=global signals dùng `AND (company IS NULL OR company = %s)`.

`ticket.company` NULL → toàn bộ filter bypass (single-company/legacy).

---

## 3 trigger gọi pipeline

| Trigger | Khi | Phụ thuộc master switch | Factor Interaction có data |
|---|---|---|---|
| `before_insert` hook | Ticket mới tạo | ✅ | ❌ (chưa ai comment) |
| `auto_reassign(ticket_name)` API (nút **Auto Re-assign**) | Admin bấm tay | ❌ luôn chạy | ✅ |
| `cron_sweep_unassigned` (03:00 VN) | Cron đêm | ✅ | ✅ |

### Cron logic (`cron_sweep_unassigned`)

```
if not auto_assign_enabled OR today NOT IN [start_date, end_date]:
    skip

min_date = Settings.auto_assign_min_ticket_schedule_date OR today

SELECT t.name FROM tabService Ticket Reminder t
LEFT JOIN tabUser u ON u.name = t.account_manager
WHERE t.primary_status = 'Open'
    AND (t.account_manager IS NULL OR t.account_manager = '' OR u.enabled = 0)
    AND (t.avg_schedule_date IS NULL OR t.avg_schedule_date >= min_date)
ORDER BY
    CASE WHEN t.avg_schedule_date IS NULL THEN 1 ELSE 0 END,
    t.avg_schedule_date ASC,
    t.creation ASC
LIMIT 500

for each ticket:
    auto_reassign(ticket)
    commit per-ticket (lỗi không break loop)
```

- Schedule: `cron: 0 20 * * *` UTC = 03:00 VN (config trong `hooks.py`).
- LIMIT 500/đêm. Backlog 34k → ~68 đêm dọn hết (nếu cho phép).
- Ticket có `avg_schedule_date < min_date` → bỏ qua (skip backlog quá hạn theo mặc định).
- Ticket NULL avg_schedule_date → vẫn quét (an toàn không miss).

---

## Master switch + rollout

Field `auto_assign_enabled` (default **TẮT**) + `auto_assign_start_date` / `auto_assign_end_date` (master gate theo lịch hôm nay).

| Trigger | Switch TẮT | Switch BẬT + trong khoảng date |
|---|---|---|
| `before_insert` | Skip | Run |
| Cron đêm | Skip | Run |
| Nút **Auto Re-assign** | **VẪN chạy** (bypass) | Run |

Nút Auto Re-assign bypass switch → admin có thể test config bằng nút trên 1 ticket lẻ trước khi bật toàn cục.

---

## Edge cases

| Case | Hành vi |
|---|---|
| Khách mới (no SO/STR) | AM signal = 0 → 5 factor còn lại quyết. Performance Bayesian fall về pool_avg → không cold-start penalty. |
| Khách quen với user nghỉ | SIM handoff → người tiếp quản, am_score = 0.5. Nếu mồ côi → AM = 0. |
| Pool eligible rỗng | `suggest_account_manager` return None → `account_manager = NULL`, admin gán tay. |
| Mọi user score ≤ 0 | Return None (giữ NULL). |
| Manual override sau auto-assign | `before_save` hook log entry `type=manual` vào `assignment_log`. Người cũ → `previous_account_managers`. |
| SO.owner là salesman | Salesman không có Handler → không trong pool → AM signal = 0 → 5 factor khác quyết. |

---

## Setup data — hệ quả nếu bỏ trống

| DocType / Field | Hệ quả nếu không setup |
|---|---|
| Service Reminder Handler | Pool rỗng → toàn bộ ticket gán NULL |
| Company SIM + SIM Ownership | Không có handoff khi user nghỉ → khách "đứt liên lạc" |
| User Area Coverage | geo_score = 0 cho mọi user → bỏ qua F5 |
| Service Reminder Handler Expertise | expertise_score = 0 → bỏ qua F2 |
| Settings.service_sales_person_group | Bỏ qua Layer 3 → chỉ dùng Handler whitelist |
| Settings.auto_assign_* weights | Dùng default (500/30/25/20/15/10) |

Pipeline robust: bỏ trống thì factor đó = 0 (neutral), không crash.

---

## Version history

| Version | Highlight |
|---|---|
| v0.1 | AM continuity qua past STR |
| v0.2 | Geo, Expertise, Load (asymmetric), admin button, cron |
| v0.3 | SO.owner hard pick |
| v0.4 | Pure soft 6-factor |
| v0.5 | Config-driven weights + Bayesian Perf + bỏ View Log |
| v0.6 | Symmetric load balance |
| v0.8 | AM simplified (chỉ SO.owner, bỏ past STR + sticky Customer field) |
| v0.9 | AM load cap (`am_max_load_pct`) |
| v0.10 | Per-user capacity hard cap (`max_open_tickets`) |
| v0.12 | Service Reminder Handler = whitelist eligibility |
| v1.1 | Multi-company filter, optional `company` field 5 DocType |
| v1.2 | Sales Person group eligibility (Layer 3) + Settings field |
| v1.3 | Drop `max_open_tickets`, F6 thuần avg-based, unique user trên Handler |
| v1.4 | Cron schedule 03:00 VN + `min_ticket_schedule_date` filter |

---

## Tham chiếu code

- Pipeline core: [service_ticket_reminder.py](../service_reminder/doctype/service_ticket_reminder/service_ticket_reminder.py) — `suggest_account_manager`, `_get_eligible_users`, `_resolve_user_or_handoff_via_sim`, `cron_sweep_unassigned`
- Hooks: [hooks.py](../hooks.py) — `scheduler_events`
- Module SIM Management: [README.md](README.md) — Company SIM + SIM Ownership SCD2 model
- User-facing guide: [HUONG_DAN_SU_DUNG.md](Service_Reminder_Auto_Assign.md)
