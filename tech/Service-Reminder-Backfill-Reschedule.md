---
title: Service Reminder — Backfill & Giãn lịch
layout: default
parent: Tài liệu kỹ thuật
nav_order: 10
---

# Service Reminder — Backfill & Giãn lịch ticket

> Ghi lại sự cố cron auto_create bị rollback, 6 bản vá, cách chạy backfill trên prod,
> và công cụ giãn lịch ticket bị dồn. Dành cho **developer / System Manager**.
> Hướng dẫn auto-assign cho nhân viên ở [phần Người dùng](../users/Service_Reminder_Auto_Assign.html).

---

## 1. Bối cảnh kiến trúc

Chuỗi tạo reminder — **không có gì sinh Service Ticket Reminder (STR) thẳng từ Sales Order**:

```
Sales Order  ──(status = Completed, on_change)──┐
             ──(cron on_daily, catch-up)────────┤
                                                 ▼
        Item Service Reminder (ISR)  ── after_insert ──►  Service Ticket Reminder (STR)
```

- **Đường on_change**: SO chuyển sang `Completed` → tạo ISR ngay. Luôn hoạt động.
- **Đường cron catch-up** (`entry.on_daily` → `auto_create_service_ticket_reminders`): quét SO
  ở status hợp lệ mà còn thiếu ISR. **Đây là đường từng bị hỏng.**

Đơn vị công việc của đội gọi là **STR** (một cuộc gọi = một ticket), xếp theo `avg_schedule_date`.

---

## 2. Sự cố: cron rollback mỗi đêm (~24/03 → 17/07/2026)

`auto_create_service_ticket_reminders` đặt `frappe.db.commit()` **sau** vòng lặp toàn bộ SO,
trong khi `on_daily` gọi nó **inline** trong job Daily (timeout 300s). Job bị giết giữa chừng
→ không bao giờ tới commit → **mọi ISR vừa tạo bị rollback**. Kết quả: một lượng lớn SO ở status
hợp lệ không có STR, tích tụ dần suốt gần 4 tháng.

### Cách chẩn đoán (dùng lại được cho lỗi Frappe tương tự)

Ba nguồn mâu thuẫn nhau chính là chữ ký của "job chết trước commit":

| Nguồn | Biểu hiện |
|---|---|
| `Scheduled Job Log` (`entry.on_daily`) | chỉ có `Start`, **không lần nào `Complete`** |
| `Service Reminder Creation Log` | đứng im từ 24/03 |
| `Error Log` (`auto_create_str`) | vẫn ghi đều mỗi đêm |

`frappe.log_error` commit bằng **transaction riêng** nên sống sót qua rollback — nó là dấu vết
duy nhất còn lại. Backlog càng lớn → job càng chắc chắn timeout → rollback giữ nguyên backlog
cho đêm sau: **vòng xoáy tự siết**.

---

## 3. Sáu bản vá (commit `ae5f317`)

| File | Sửa |
|---|---|
| `lib/cron/entry.py` | commit **từng SO**; lỗi thì `rollback()` riêng SO đó rồi ghi log |
| `lib/cron/entry.py` | `frappe.enqueue` auto_create sang queue `long` (3600s) thay vì chạy inline |
| `lib/cron/entry.py` | lọc ISR đến hạn bằng SQL (`next_schedule_date = today + lead_days`) thay vì nạp ~25k dòng `fields=["*"]` rồi lọc Python |
| `lib/isr_check.py` | **Case 2 loại trừ bundle parent** (xem dưới) |
| `doctype/item_service_reminder/item_service_reminder.py` | bỏ qua Service Reminder Type thiếu `period_days` thay vì để `int(None)` giết cả SO; ép `getdate()` cho `start_date`; `reload()` trước khi append vào ticket sẵn có (chống `TimestampMismatchError` khi tạo hàng loạt) |
| `entry.py` + `service_reminder_settings.py` | `deduplicate=True` + `job_id` chung để cron đêm và nút UI không chạy chồng |

### Bẫy bundle parent (dễ tái phạm)

Code **chỉ tạo ISR cho item con** của bundle, không bao giờ tạo ISR mang `item_code` của bundle
**cha**. Nếu bundle cha lại có `Item Reminder Settings` riêng thì điều kiện "thiếu ISR" **đúng
vĩnh viễn** → SO bị chọn lại mỗi đêm mà không bao giờ tắt được cờ. Case 1 vốn đã có guard
`NOT EXISTS tabProduct Bundle`; Case 2 thiếu dù docstring ghi rõ "Non-bundle".

---

## 4. Chạy backfill trên prod

> Prod Frappe Cloud **không có console** (cả bench lẫn browser F12). Mọi thao tác qua **nút UI**.

**Service Reminder Settings → nút "Create Service Reminders"** → Preview → Run. Nút gọi
`run_auto_create_now` (queue `long`, 3600s). Để trống `random_day_range` để giữ mặc định `2,10`.

- Đo thật: **~0,18s/SO** → thừa sức lọt timeout 3600s.
- Chạy **một job tuần tự** → **0 bản ISR trùng** (trong cùng transaction, check `existed` nhìn thấy
  insert của chính nó).
- ⚠️ Bấm Run mà **không thấy gì chạy** → kiểm tra job `service_reminder::auto_create_str` có đang
  `QUEUED`/`STARTED` không. `deduplicate` **im lặng bỏ qua** lần enqueue thứ hai — nhìn từ ngoài
  dễ tưởng nút hỏng.

Kết quả kỳ vọng: phần lớn SO tồn đọng có ticket. Một số SO sẽ lỗi do **data hỏng** (thiếu
`customer_address`, `qty` nhập nhầm giá) — xem log `status = 'Error'`, sửa tay, không chặn gì.

---

## 5. Công cụ giãn lịch ticket bị dồn (commit `223c971`)

### Vì sao cần

Backfill nhả hàng nghìn SO cũ cùng lúc; tất cả rơi vào nhánh `adjust_past_date` nên bị kéo về
`hôm nay + random(2..10)` — cửa sổ vốn chỉ đủ cho nhịp thường ngày vài chục đơn. Ticket dồn cục
vào ít ngày → vượt xa năng lực gọi trong ngày.

### Dùng

**Service Reminder Settings → nút "Giãn lịch ticket backfill"**:

1. Ô **"Ticket tạo sau"** tự điền mốc đợt backfill gần nhất (`get_latest_backfill_window` dò
   `batch_id` từ Creation Log).
2. Chỉnh **Ticket/người/ngày** (mặc định 9), **Số người** (5), **Ngưỡng ngày** (14).
3. **Xem trước** → bảng phân bổ theo từng người + đỉnh trước/sau. Chưa ghi gì.
4. **Chạy giãn** → confirm → xong.

Chạy lại nhiều lần an toàn: mỗi lần chỉ nhặt ticket còn trong `horizon_days`.

### Cơ chế — BẮT BUỘC đúng đường phụ thuộc

Ngày nhắc **không** sửa thẳng vào `avg_schedule_date` (là giá trị `on_update` tự tính, save một
phát là bị đè). Đường phụ thuộc:

```
Item Service Reminder.schedule_date   (nguồn thật)
    │  fetch_from
    ▼
Item Reminder Table.schedule_date     (child của STR)
    │  on_update tính trung bình
    ▼
Service Ticket Reminder.avg_schedule_date   (cái list view Desk lọc)
```

Công cụ tính `delta = ngày_đích - avg_hiện_tại` rồi **dịch cả cụm ISR** theo delta — giữ nguyên
khoảng cách tương đối giữa các item, avg tự khớp ngày đích.

**Không dùng `user_note_date`** dù app đọc `COALESCE(user_note_date, avg_schedule_date)` ở báo cáo:
list view Desk của đội **chỉ lọc `avg_schedule_date`**, và filter list view của Frappe không viết
được `COALESCE`. Set `user_note_date` → báo cáo đẹp nhưng ticket vẫn nằm trong list của đội.

### Tham số

| Tham số | Ý nghĩa |
|---|---|
| `created_after` | Chỉ đụng ticket tạo sau mốc này (mốc đợt backfill) |
| `per_user_per_day` | Hạn mức ticket/người/ngày làm việc (bỏ Chủ nhật) |
| `team_size` | Số người — dùng cho **nhóm chưa gán** (cron sweep sẽ chia dần cho cả đội) |
| `horizon_days` | Chỉ giãn ticket có `avg_schedule_date <= hôm nay + ngần này` |
| `dry_run` | `1` (mặc định) = chỉ xem, không ghi |

---

## 6. Lưu ý vận hành

- **SO data hỏng** sẽ fail mỗi đêm cho tới khi sửa tay — hai dạng chính: thiếu `customer_address`
  (STR bắt buộc field này) và `qty` nhập nhầm **giá vào ô số lượng** → tràn cột
  `estimated_revenue decimal(21,9)`. Xem log `status = 'Error'` để lấy danh sách.
- **ISR trùng cũ** (từ đợt migration `migrate_dr_service_ticket.py`) cần dọn riêng. Cẩn thận:
  xoá ISR kéo theo `Item Reminder Table`, có thể làm rỗng STR.
- **Service Reminder Type thiếu `period_days`** (vd `Reminder Note`) — bản vá chỉ `continue` bỏ
  qua cho khỏi giết SO; muốn nó thật sự sinh reminder thì phải điền `period_days`.
- **Giãn lịch**: `team_size` và `per_user_per_day` mặc định chỉ là điểm khởi đầu. Luôn bấm
  **Xem trước** để thấy phân bổ thật theo từng người trước khi chạy, rồi chỉnh cho khớp năng lực
  đội.
- Sinh ticket và **gọi** là hai khâu tách biệt: công cụ chỉ lo phần sinh + rải lịch; năng lực gọi
  giải quyết bằng nhân sự / quy trình, không phải bằng code.
