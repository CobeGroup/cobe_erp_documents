---
title: Loyalty — Tích điểm
layout: default
parent: Marketing & Khách hàng
nav_order: 2
---

# COBE Loyalty — Hướng dẫn vận hành

Tài liệu đầu-đến-cuối cho hệ thống loyalty xây trên `Loyalty Program` mặc định
của ERPNext. Mô tả phần nào dùng built-in, phần nào custom, cách setup, cách
điểm được cộng/trừ khi vận hành, và cách chạy migrate dữ liệu cũ sau khi
go-live.

Đối tượng: System Manager / Accounts Manager. Mọi đường dẫn nằm trong
`apps/custom_for_cobegroup/custom_for_cobegroup/custom_for_cobegroup/`.

> Bản tiếng Anh: [LOYALTY_GUIDE.md](Loyalty-Tich-Diem.md)

---

## 1. Mô hình tư duy

| Mảng | Nguồn | Doctype liên quan |
|---|---|---|
| Tỉ lệ tích điểm (VND → điểm), hạng (tier), hạn dùng điểm | **ERPNext built-in** | `Loyalty Program`, `Loyalty Program Collection`, `Loyalty Point Entry` |
| Cấu hình thưởng giới thiệu theo từng company | Custom | `COBE Loyalty Settings` (Single) + `COBE Loyalty Settings Company` (child) |
| Cộng/trừ điểm thủ công (VIP seed, sửa sai, thưởng sự kiện) | Custom | `COBE Loyalty Adjustment` (submittable, có audit) |
| Logic trigger tích điểm (SI / SO / referral) | Custom hooks | `loyalty/sales_invoice_handlers.py` (đăng ký qua `hooks.py` doc_events) |
| Migrate dữ liệu lịch sử | Custom migration | Page `loyalty-migration` + `COBE Loyalty Migration Run` (log job) + `loyalty/api/*` |
| Outbound event lên 3rd party (mỗi lần điểm thay đổi) | Custom async queue | `COBE Loyalty Event` (queue) + `COBE Loyalty Sync Settings` (Single) + `loyalty/emitter.py` + `loyalty/sync_worker.py` |

> Tỉ lệ tích điểm (VND → điểm) và rule tier **luôn** nằm ở `Loyalty Program`.
> `COBE Loyalty Settings` **chỉ** chứa rule thưởng giới thiệu. Không config
> trùng ở 2 nơi.

---

## 2. Checklist setup (làm trước khi bật tính năng)

1. **Tạo 1 Loyalty Program cho mỗi Company** (hoặc 1 program dùng chung —
   để trống field `company` — nếu cả 3 company có rule giống nhau).
   - Set `from_date` (để trống `to_date` cho program đang chạy).
   - Thêm ít nhất 1 row vào `Collection Rules`: `min_spent = 0`,
     `collection_factor` = "bao nhiêu VND đổi 1 điểm", và tên tier.
   - Set `expiry_duration` (tính bằng ngày). Để trống / 0 = "không hết hạn" →
     code sẽ default 10 năm khi tạo entry. Tốt nhất là set rõ ràng để tránh
     bất ngờ.

2. **Gán Loyalty Program cho từng Customer**.
   - Cách 1: bulk-update field `Customer.loyalty_program` cho khách hiện có.
   - Cách 2: set default qua Customer Group / Territory / 1 script import nhỏ.
   - Customer không có Loyalty Program sẽ **bị skip không cộng điểm** (đây là
     thiết kế cố ý — không báo lỗi).

3. **Cấu hình thưởng giới thiệu** trong `COBE Loyalty Settings`:
   - 1 row / company. Tick/bỏ tick `enabled` để bật/tắt referral cho từng
     company mà không cần xoá config.
   - `referral_conversion_factor` (VND/điểm) — **bắt buộc khi enabled**.
     Công thức: `điểm = floor(SI.grand_total / referral_conversion_factor)`.
     Vd: factor = 50,000 → SI 5tr → 100 điểm cho referrer.
     (Hệ số này độc lập với `collection_factor` của Loyalty Program — set
     riêng tuỳ chính sách thưởng giới thiệu.)
   - `referral_max_points` — cap điểm tối đa cho 1 lượt giới thiệu (0 = không cap).
   - `referral_min_invoice_amount` — ngưỡng SI tối thiểu để qualify (0 = không có ngưỡng).

4. **Phân quyền (Roles)**:
   - `System Manager` / `Accounts Manager` được tạo/submit/cancel
     `COBE Loyalty Adjustment` và chạy migration.
   - `Sales Master Manager` đọc/sửa `COBE Loyalty Settings`.
   - Chỉ `System Manager` được chạy **Reset** migration và **Apply** lead
     source fix (vì là các thao tác phá huỷ data).

5. **Restart** sau khi deploy:
   ```
   bench --site <site> migrate
   bench build
   bench --site <site> clear-cache
   bench restart
   ```

---

## 3. Hành vi vận hành — điểm được cộng/trừ khi nào

### 3a. Sales Invoice có Sales Order

1. Hook `before_submit` phát hiện `SI.items[*].sales_order` có giá trị → set
   `dont_create_loyalty_points = 1` trên SI. Built-in skip tích điểm.
2. Hook `on_submit` reload từng SO được tham chiếu và kiểm tra `per_billed`.
   - Chỉ khi (và chỉ khi) SO đạt `per_billed = 100`, tạo **1** `Loyalty Point Entry`:
     - `invoice_type = "Sales Order"`, `invoice = <tên SO>`
     - `loyalty_points = SO.grand_total / collection_factor`
   - Idempotent: SI thứ 2 của cùng SO sẽ thấy entry đã có và skip.

### 3b. Sales Invoice không có Sales Order (đơn cash)

- Hành vi mặc định ERPNext. 1 `Loyalty Point Entry` cho mỗi lần submit SI,
  `invoice_type = "Sales Invoice"`, `invoice = <tên SI>`. Code custom không
  can thiệp case này.

### 3c. Giới thiệu (referral)

Fire ở `Sales Invoice.on_submit` (sau bước SO award ở trên). Quy tắc neo vào
**trọn SO đầu tiên** của khách được giới thiệu, không phải SI đầu — để chính
xác khi 1 SO chia thành nhiều SI thanh toán.

1. Resolve người giới thiệu: `customer.lead_name → Lead.source == "Existing Customer" → Lead.customer`.
   Không resolve được → bỏ qua.
2. Đọc `COBE Loyalty Settings` cho `SI.company`. Không có row hoặc `enabled = 0` → bỏ qua.
3. Loop từng SO được SI tham chiếu. Với mỗi SO:
   - SO chưa đạt `per_billed = 100` → bỏ qua.
   - SO này KHÔNG phải SO đầu tiên của customer (sort `transaction_date asc, creation asc`) → bỏ qua.
   - `SO.grand_total < referral_min_invoice_amount` → bỏ qua.
   - Đã có LPE referral cho `(Sales Order, SO name, referrer)` → bỏ qua (idempotent).
4. Tính số điểm: `points = floor(SO.grand_total / referral_conversion_factor)`,
   cap bởi `referral_max_points` (nếu > 0). Tạo `Loyalty Point Entry` cho
   **người giới thiệu**: `invoice_type = "Sales Order"`, `invoice = <tên SO>`,
   `discretionary_reason = "Referral reward — first SO <SO> of referred customer <X>"`.

> SI cash (không tham chiếu SO nào) sẽ KHÔNG trigger referral. Customer phải
> có ít nhất 1 SO đạt `per_billed = 100` mới được tính.

### 3d. Điều chỉnh thủ công

Mở `COBE Loyalty Adjustment`, điền: customer / company / points (luôn số dương)
/ adjustment_type (Add hoặc Deduct) / reason_category / reason. Submit.

- Khi submit: tạo 1 `Loyalty Point Entry`.
- Khi cancel: tạo **1 entry bù trừ** ngược dấu. Entry gốc không bị xoá → giữ
  được lịch sử audit đầy đủ.

Field `purchase_amount` (Currency, default 0) trên Adjustment cho phép cộng
thêm "số tiền tích lũy" — chỉ dùng khi cần đẩy khách lên tier cao (vd seed
VIP). UI "Set VIP Tier" ở §3g tự tính giá trị này, đa số trường hợp khác để 0.

`invoice_type` của entry sẽ là `"COBE Loyalty Adjustment"` và `invoice` là tên
của Adjustment — dễ trace ngược lại nguồn.

### 3e. Cancel Sales Invoice — reverse điểm

Khi SI bị cancel (`Sales Invoice.on_cancel`):

- **Reverse SO award + referral cùng lúc**: với mỗi SO ref, ERPNext đã tự
  tính lại `per_billed`. Nếu `per_billed` tụt dưới 100, code group tất cả LPE
  của SO này theo customer (customer mua + referrer nếu có) → tạo entry âm
  bù trừ net cho từng customer. Entry gốc KHÔNG bị xóa. Idempotent — net ≤ 0
  thì skip.
- **Legacy: reverse referral cũ qua SI**: với referral cũ (đã tạo trước
  refactor 2026-06-05) link qua `invoice_type=Sales Invoice, invoice=<SI này>`
  + customer != si.customer → cộng theo từng referrer, tạo entry âm bù trừ.
- **Event lên 3rd party**: mỗi LPE âm vừa tạo ra sẽ tự emit
  `loyalty.points_decreased` qua hook `Loyalty Point Entry.on_submit` (xem §10).

Entry bù trừ có `discretionary_reason` bắt đầu bằng `[REVERSE]` để dễ filter
trong báo cáo.

### 3f. Sales Invoice return (`is_return=1`)

Return SI = hoàn hàng partial. Khi submit, chạy cùng logic reverse SO như
mục 3e: nếu return làm SO tụt dưới `per_billed=100` thì SO award bị bù trừ.
Logic referral KHÔNG re-trigger cho return SI (return không bao giờ tạo
referral ban đầu).

### 3g. Set VIP tier khi tạo khách mới

Khách mới có thể đã là VIP ngay từ đầu (vd: khách cũ chuyển sang). Mở form
Customer → menu **Loyalty → Set VIP Tier** (chỉ hiện cho `System Manager`
và `Sales Manager`).

Dialog hiển thị:
- **Company** — chọn company (mặc định = Default Company của user).
- **Bảng tier** — fetch từ Loyalty Program của customer + tier hiện tại.
- **Target Tier** — chọn tier mong muốn (Select, options = tier_name).
- **Reason** — tuỳ chọn; để trống → hệ thống auto sinh chuỗi reason.

Khi nhấn **Seed Now**:
1. Resolve Loyalty Program của customer + tier rule có `tier_name == target_tier`.
2. Đọc trạng thái hiện tại qua `get_loyalty_program_details_with_points`
   (tổng `purchase_amount` + tier hiện tại).
3. Tính `needed_spent_delta = max(0, target.min_spent - current_total_spent)`.
4. Tính `points = floor(needed_spent_delta / target.collection_factor)`.
5. Tạo `COBE Loyalty Adjustment` với `reason_category = "VIP Seed"`,
   `purchase_amount = needed_spent_delta`, `points = points`. Submit ngay.

ERPNext re-resolve tier theo SUM(`purchase_amount`) → customer lên tier mong
muốn ngay sau khi submit. Cũng emit `loyalty.points_increased` lên 3rd party
như mọi LPE khác.

> Hoàn tác: mở Adjustment vừa tạo (Loyalty Adjustment list filter
> `reason_category = VIP Seed`) → **Cancel**. Hệ thống tự tạo entry bù trừ
> ngược dấu (cả `points` và `purchase_amount`) → khách rớt lại tier cũ.

---

## 4. Đổi rule Loyalty Program (mà không phá lịch sử)

**Không** sửa trực tiếp collection rules của Loyalty Program đang dùng. Thay vào đó:

1. Mở Loyalty Program đang active → set `to_date` = hôm nay (hoặc ngày cắt mày muốn).
2. Tạo Loyalty Program mới với `from_date` = ngày mai và rule mới.
3. Gán program mới cho customer (theo nhu cầu).

`Loyalty Point Entry` cũ **không bao giờ** được tính lại — nó lưu số điểm tại
thời điểm cộng. Tier hiển thị trên Customer thì recompute từ `Collection Rules`
của program hiện tại vs tổng tích lũy của customer, nên dự kiến tier sẽ shift
khi đổi `min_spent` thresholds; đây là behavior bình thường và là field "live"
duy nhất.

---

## 5. Quy trình migrate (chạy sau khi deploy production)

Mọi action chạy từ page **Loyalty Migration** (`/app/loyalty-migration`, chỉ
System Manager). Chọn Action + Mode, set `Batch Size`, bấm **Enqueue Run**.

Mỗi lần chạy là 1 **background job** (data lớn không bị timeout) và được ghi log
thành 1 record `COBE Loyalty Migration Run` — bảng "Recent Runs" trên page hiển
thị status realtime (Queued → Running → Completed/Failed) kèm bộ đếm tiến độ
processed/total. Bấm vào 1 dòng để xem full kết quả hoặc log lỗi.

`Batch Size` = số record commit mỗi lượt (mặc định 500). Lớn hơn = nhanh hơn
nhưng transaction nặng hơn.

Mỗi action idempotent. **Luôn Dry-run trước Apply**. Chạy theo thứ tự sau:

> ⚠️ **Trước khi Apply** (đặc biệt với backfill SI lịch sử có thể tạo hàng
> ngàn LPE): vào `COBE Loyalty Sync Settings` → **bỏ tick `Emit LPE Events`**.
> LPE được tạo trong lúc backfill sẽ không sinh outbound event (3rd party sẽ
> không nhận dữ liệu lịch sử — đúng ý đồ). Sau khi backfill xong → tick lại.
> Nếu quên tắt: hàng ngàn `COBE Loyalty Event` Pending sẽ bị flush dần lên
> 3rd party qua scheduler.

### 5.1. Lead Source Fix
Sửa `Lead.source` / `Lead.customer` để chain referral resolve đúng.

- **Analyze** — read-only. Báo cáo bao nhiêu Odoo `res_partner` có
  `referral_by` match được với ERPNext, chia theo strategy:
  - `1_custom_name_from_odoo` → `Lead.custom_name_from_odoo == partner.name`
  - `2_phone_field` → Odoo `phone`/`mobile` → ERPNext `mobile_no`/`phone`/`whatsapp_no`
  - `3_phone_from_display_name` → phone trích từ Odoo `display_name`
  - `4_clean_name` → tên đã clean (bỏ SĐT + brand prefixes, lowercase)
  - `5_email`
- **Dry-run** — list per-record các action sẽ làm + sample của từng nhóm:
  `no_lead_match`, `no_referrer_customer_match`, `skip_customer_differs`,
  `set_source_and_customer`, `set_customer_only`.
- **Apply** — ghi `Lead.source` / `Lead.customer`. Không bao giờ đè Lead đang
  có giá trị customer **khác** với referrer.

### 5.2. Backfill điểm cho Sales Invoice cũ
- **Dry-run** — đếm số SI sẽ được tạo Loyalty Point Entry, tổng điểm,
  top 10 customer có điểm nhiều nhất.
- **Apply** — tạo 1 `Loyalty Point Entry` cho mỗi SI đủ điều kiện. Mỗi entry
  có `discretionary_reason` chứa marker `[MIGRATED:SI:<tên SI>]`.
- **Reset Migrated** — xoá **chỉ** các entry có marker. Dùng khi mày muốn đổi
  config rồi chạy lại.

### 5.3. Backfill điểm giới thiệu
- Match logic runtime: chỉ tính các referrer có khách được giới thiệu đã có
  ít nhất 1 SO `per_billed=100`. Customer cash-only (chỉ có SI) bị skip.
- Tính điểm trên `SO.grand_total` của SO sớm nhất (transaction_date asc, creation asc).
- **Dry-run** — đếm số adjustment sẽ tạo, top 10 người giới thiệu.
- **Apply** — tạo 1 `COBE Loyalty Adjustment` đã submit cho mỗi cặp đã resolve
  (reason_category = `Referral Migration`, reason chứa `first_so=<SO name>`).
- **Reset Migrated** — cancel các Adjustment đó. Cancel sẽ tự sinh entry bù
  trừ → số điểm của customer rollback sạch.

### 5.4. Seed VIP
- Upload file CSV có header.
- Cột bắt buộc: `customer`, `points`, `reason`.
- Cột tùy chọn: `adjustment_type` (default `Add`), `expiry_date` (YYYY-MM-DD),
  `company` (fallback theo Default Company của Console, rồi đến company đầu
  tiên của customer), `loyalty_program` (fallback theo program của customer).
- Mỗi row → 1 `COBE Loyalty Adjustment` được submit, reason_category = `VIP Seed`.

**Tip lặp lại**: nếu dry-run cho ra số không ưng ý, đổi `collection_factor`
của Loyalty Program / `referral_conversion_factor` của settings → Reset → Apply lại.

---

## 6. Tác vụ vận hành thường gặp

| Việc | Cách làm |
|---|---|
| Tặng N điểm thưởng cho 1 customer | Tạo `COBE Loyalty Adjustment` mới, type Add, reason_category `Event Bonus` hoặc `Other`. |
| Trừ điểm (refund nhầm / phạt) | Như trên, chọn type Deduct. |
| Hủy 1 adjustment đã sai | Mở Adjustment → Cancel. Hệ thống tự tạo entry bù trừ. |
| Tạm tắt referral cho 1 company | `COBE Loyalty Settings` → bỏ tick `enabled` ở row của company đó. |
| Xem 1 `Loyalty Point Entry` đến từ đâu | Nhìn `invoice_type` + `invoice`. `Sales Invoice` = đơn cash, `Sales Order` = SO complete, `COBE Loyalty Adjustment` = manual, `Sales Invoice` cho 1 *referrer* (đối chiếu field `customer` với customer của SI). |
| Reset toàn bộ điểm đã migrate để chạy lại | Page Loyalty Migration → chạy Reset cho từng action, **theo thứ tự ngược**: Referral Backfill trước, rồi SI Backfill. |

---

## 7. Lưu ý quan trọng (Gotchas)

- **Customer không có Loyalty Program** sẽ không tích điểm và không báo lỗi.
  Đây là thiết kế cố ý — nhưng nếu mày thấy "tại sao không có điểm?" thì cách
  fix là gán program, không phải debug hook.
- **Field `Lead.source`**: field cũ `source` (Select) là cái mà
  `Lead.customer.depends_on` đang check. Field mới `utm_source` (Link đến
  UTM Source) là field khác. Code mình đọc/ghi `lead.source` — đảm bảo
  Customize Form của Lead vẫn để field này hiển thị/dùng được.
- **Match theo thứ tự**; cái match đầu tiên thắng. Nếu strategy 4 (clean name)
  trùng tên giữa 2 customer khác nhau, cái nào được index trước sẽ thắng. Output
  sample của Dry-run là công cụ để mày soi case kiểu này.
- **Nhiều SI cho 1 SO**: theo thiết kế, điểm chỉ cộng 1 lần khi SO đạt
  `per_billed = 100`, không phải mỗi SI. Nếu SO bị over-billed hoặc có return
  làm `per_billed` xuống dưới 100 sau khi đã cộng điểm, **entry đã cộng không
  tự động rollback** — phải dùng `COBE Loyalty Adjustment` để sửa tay.
- **Hook fail không chặn submit SI**. SO award và referral award đều được bọc
  trong `try/except` → lỗi vào Error Log (`frappe.log_error`) và SI vẫn submit
  được. Nếu thiếu điểm bất thường, check Error Log.

---

## 8. Sơ đồ file

```
custom_for_cobegroup/custom_for_cobegroup/custom_for_cobegroup/
├── doctype/
│   ├── cobe_loyalty_settings/                  # Single (cấu hình referral)
│   ├── cobe_loyalty_settings_company/          # Child table
│   ├── cobe_loyalty_adjustment/                # Submittable (cộng/trừ điểm thủ công)
│   ├── cobe_loyalty_migration_run/             # 1 record / lần chạy migration
│   ├── cobe_loyalty_sync_settings/             # Single (cấu hình outbound 3rd party)
│   └── cobe_loyalty_event/                     # Queue 1 record / 1 event outbound
├── page/
│   └── loyalty_migration/                      # Page admin để chạy migration
└── loyalty/
    ├── sales_invoice_handlers.py               # hook SI before_submit/on_submit/on_cancel
    ├── emitter.py                              # hook LPE.on_submit → tạo COBE Loyalty Event
    ├── sync_worker.py                          # scheduler all: gửi event Pending lên 3rd party
    ├── odoo_matcher.py                         # matcher 5 chiến lược
    ├── LOYALTY_GUIDE.md                        # bản tiếng Anh
    ├── LOYALTY_GUIDE.vi.md                     # file này
    └── api/
        ├── migration_runner.py                 # orchestrator enqueue + background job
        ├── lead_source_fix.py                  # analyze / dry_run / apply
        ├── backfill_si.py                      # dry_run / apply / reset
        ├── backfill_referral.py                # dry_run / apply / reset
        ├── seed_vip_csv.py                     # run (upload CSV)
        └── vip_tier.py                         # get_tier_options + seed_vip_tier (button trên Customer)
```

Đăng ký hook: `hooks.py` → `doc_events["Sales Invoice"]`.

Entry point migration (whitelisted, System Manager): `migration_runner.py` →
`enqueue_migration`, `get_runs`, `get_run_detail`, `get_action_modes`. Các
module theo từng action là hàm thường, được background job gọi, không whitelist
trực tiếp.

---

## 9. Webhook — tra điểm loyalty theo SĐT

Endpoint cho Zalo mini app (và tích hợp tương tự) nằm trong
`zalo_miniapp/api.py`, hàm `get_loyalty_points(phone)`.

- **Method**: `custom_for_cobegroup.custom_for_cobegroup.zalo_miniapp.api.get_loyalty_points`
- **Xác thực**: giống các endpoint Zalo khác — header `X-Api-Key` /
  `X-Api-Secret` cộng allow-list IP/domain, tất cả cấu hình trong
  `Zalo Miniapp Settings`.
- **Input**: `phone` (chấp nhận `0xxx`, `+84xxx`, `84xxx`).
- **Resolve**: reuse `find_customers_by_phone` (Customer.mobile_no → Lead →
  Contact). 1 SĐT có thể khớp nhiều customer.
- **Output**: breakdown theo từng cặp (customer, company) — không có tổng gộp.
  Số điểm là điểm khả dụng (đã trừ điểm hết hạn), tính qua hàm chuẩn
  `get_loyalty_details` của ERPNext.

```json
{
  "phone": "0902537814",
  "items": [
    {"customer": "CUST-001", "company": "COBE A", "points": 8000, "rank": "Gold"},
    {"customer": "CUST-001", "company": "COBE B", "points": 4500, "rank": "Silver"}
  ]
}
```

`items` rỗng nghĩa là SĐT không khớp customer nào, hoặc khớp customer nhưng
chưa có entry điểm. `rank` lấy từ tier của Loyalty Program (ERPNext tự tính
theo điểm vs ngưỡng tier); `null` nếu customer chưa thuộc tier nào.

---

## 10. Outbound event — báo 3rd party mỗi khi điểm thay đổi

Mỗi `Loyalty Point Entry` khi được submit (built-in award, SO/referral award,
VIP seed, manual adjustment, return/cancel compensation) đều phát **đúng 1**
event lên hệ thống bên ngoài:

- `loyalty.points_increased` — khi `LPE.loyalty_points > 0`
- `loyalty.points_decreased` — khi `LPE.loyalty_points < 0`

### 10a. Kiến trúc

- Hook `Loyalty Point Entry.on_submit` → `loyalty/emitter.py::emit_lpe_event`
  → tạo 1 record `COBE Loyalty Event` (status=Pending).
- Scheduler `all` (~4 phút/lần) → `loyalty/sync_worker.py::flush_pending_events`
  → POST tới `{base_url}/loyalty/events` kèm header `Idempotency-Key=<event_id>`
  và `Authorization: Bearer <auth_token>`.
- Backoff khi fail: 1m, 5m, 30m, 2h, 12h, 24h, 24h… đến `max_retry_attempts`
  (mặc định 10) thì mark Failed vĩnh viễn.

### 10b. Cấu hình — `COBE Loyalty Sync Settings` (Single)

| Field | Ý nghĩa |
|---|---|
| `enabled` | Master switch toàn bộ outbound. Tắt = ngừng gửi (LPE vẫn tạo bình thường). |
| `event_emit_enabled` | Tắt riêng phần emit. Tắt khi chưa muốn báo 3rd party. |
| `base_url` | Vd `https://loyalty.example.com/api/v1`. |
| `auth_token` | Bearer token (Password field, mã hoá trong DB). |
| `request_timeout_seconds` | Timeout HTTP, default 30. |
| `max_retry_attempts` | Số lần thử tối đa, default 10. |

### 10c. Payload mẫu

```json
{
  "event_type": "loyalty.points_increased",
  "event_id_local": "LPE-2026-12345",
  "occurred_at": "2026-06-04T10:15:32.123456",
  "customer": {
    "id": "CUST-001",
    "name": "Nguyễn Văn A",
    "phone": "0902537814",
    "email": "a@example.com"
  },
  "company": "COBE A",
  "loyalty_program": "COBE Loyalty A",
  "loyalty_program_tier": "Gold",
  "delta_points": 250,
  "purchase_amount": 5000000,
  "posting_date": "2026-06-04",
  "expiry_date": "2027-06-04",
  "invoice_type": "Sales Order",
  "invoice": "SO-2026-00321",
  "reason": "SO completed (billed 100%) — awarded via SI SI-2026-00500",
  "current_balance": 12750,
  "current_rank": "Gold"
}
```

`current_balance` + `current_rank` là snapshot sau khi LPE này được submit
(tính qua ERPNext `get_loyalty_details`). 3rd party có thể dùng để verify
hoặc bỏ qua tuỳ ý.

### 10d. Vận hành

- Xem queue: List view `COBE Loyalty Event` (Status standard filter).
- Flush thủ công: gọi `flush_pending_events_now` (whitelisted, System Manager)
  hoặc bench console:
  ```python
  bench --site <site> execute custom_for_cobegroup.custom_for_cobegroup.loyalty.sync_worker.flush_pending_events_now
  ```
- Re-emit 1 event đã Failed: mở record, đổi `status` về `Pending` và clear
  `next_attempt_at` (chỉnh tay) → scheduler tự pick lại lần kế tiếp.
- Tắt khẩn cấp: vào `COBE Loyalty Sync Settings` bỏ tick `enabled`.
