---
title: Delivery Partner — Lifecycle & Doc Events
layout: default
parent: Tài liệu kỹ thuật
nav_order: 8
---

# Delivery Partner — Lifecycle & Doc Events (tích hợp ERP)

Tài liệu kỹ thuật cho **developer / integrator**: chuỗi tạo chứng từ ERP theo vòng đời DP Shipment,
do app `delivery_partner_extension_for_cobegroup` hook vào (app gốc `delivery_partner` chỉ lo
vận đơn + trạng thái). Bản dành cho end-user: [Quy trình vận đơn](../users/Delivery_Partner-Quy-Trinh.html).

---

## 1. Phân vai 2 app

| App | Trách nhiệm |
|---|---|
| `delivery_partner` (gốc) | DP Shipment, DP Partner/Account, webhook ingest, API client. **Không** tạo chứng từ ERP. |
| `delivery_partner_extension_for_cobegroup` | Hook doc_events DP Shipment → tạo MR / SE / DN / SI / PE; thêm custom field (sales_order, charges, fulfillment_status, picked_qty...). |

**Chiều phụ thuộc là MỘT CHIỀU và khai tường minh** trong `required_apps`: app cầu nối là chỗ *duy nhất*
được biết cả hai phía (`delivery_partner` + `erpnext`, sau này thêm `poe_management`). App gốc không được
biết ERPNext hay nghiệp vụ Cobe, và **không app nào đọc Settings của app khác** — cấu hình thuộc luồng
vận chuyển để trong settings của chính app cầu nối.

Hook đăng ký (`extension/hooks.py`):

```python
doc_events = {
    "DP Shipment": {
        "before_save":   "...dp_shipment.before_save",    # tính custom_total_cost
        "on_submit":     "...dp_shipment.on_submit",       # tạo Material Request
        "on_change":     "...dp_shipment.on_change",        # tạo SE/DN/SI/PE theo status
                                                            # PHẢI on_change: webhook đổi status
                                                            # bằng db_set, on_update KHÔNG fire
        "before_cancel": "...dp_shipment.before_cancel",
    },
    "Stock Entry":      {"on_submit": "...stock_entry.on_submit"},
    "Material Request": {"on_update": "...material_request.on_update"},
}
```

---

## 1b. Mục đích vận đơn — công tắc rẽ nhánh {#muc-dich}

Từ 08/2026 vận đơn không còn chỉ phục vụ bán hàng. Ô `custom_purpose` quyết định chuỗi chứng từ nào
chạy; bảng đăng ký nằm ở `doc_events/purpose.py`, **không** khai bằng doctype cấu hình (prod không vào
được console, sửa cấu hình sai là hỏng thầm lặng).

| Mục đích | `stock_flow` | Chứng từ |
|---|---|---|
| Bán hàng | `sales_chain` | MR → SE → DN → SI/PE. **Luồng cũ, không đổi gì** |
| Chuyển kho | `in_transit` | SE xuất (kho ảo ĐVVC) → SE nhập cho kho đích |
| Gửi mẫu về lab · Thu hồi bảo hành · Trả máy cho khách | `none` | không sinh chứng từ kho |
| Vật tư KTV về kho | `in_transit` | *(chưa làm)* |

Ô trống → coi là **Bán hàng**. Cố ý: vận đơn tạo trước khi có ô này, hoặc đẩy vào qua API mà không khai,
phải giữ nguyên hành vi cũ. Patch `set_shipment_purpose_and_backfill_references` điền thật cho các bản
ghi cũ và dựng dòng chứng từ nguồn trỏ về SO.

**Bảng `custom_references` (doctype `DP Shipment Reference`)** ghi chứng từ nguồn — quan hệ **nhiều–nhiều**:
một vận đơn gom nhiều mẫu nước, một Issue bảo hành đẻ hai vận đơn (thu về + trả lại). Ô `custom_sales_order`
vẫn giữ cho luồng bán hàng (báo cáo và hook cũ bám vào đó).

`on_submit`, `on_change`, `before_cancel` đều rẽ nhánh theo mục đích ngay dòng đầu.

---

## 2. Chuỗi tạo chứng từ (mục đích **Bán hàng**)

### 2.1. on_submit → Material Request
`_create_material_request(doc)`:
- MR `Material Transfer`, `set_warehouse` = `DP Partner Account.warehouse` (kho ảo ĐVVC).
- Mỗi item: `from_warehouse` = `item.custom_warehouse` ∥ `doc.custom_pickup_warehouse`; link `sales_order` /
  `sales_order_item` / `custom_dp_shipment`.
- Set `custom_material_request`, `custom_fulfillment_status = "Pending MR"`.
- **MR không ghi Stock Ledger** — chỉ là đề nghị.

### 2.2. Trừ kho thật → Stock Entry (2 đường)

**Đường A — kho tạo SE từ MR (thủ công, CHẠY THẬT):**
`Stock Entry.on_submit` (`stock_entry.py`) phát hiện dòng SE có `material_request` trỏ về DP Shipment
(`custom_fulfillment_status = "Pending MR"`) → set `custom_stock_entry` + `"Transferred"`.

**Đường B — auto theo status "Partner Received":**
`on_update` → `_create_pickup_stock_entry`: SE Material Transfer source_wh → partner_warehouse, dùng
`custom_picked_qty` (∥ `qty`); set `custom_stock_entry` + `"Transferred"`.

### 2.3. on_change theo status (EVENT_STATUS_MAP của app gốc)

| status | Hàm | Chứng từ / tác động | Guard idempotent |
|---|---|---|---|
| Booked | — | không sinh gì (ĐVVC nhận đơn nhưng **chưa cầm hàng**) | — |
| Partner Received | `_create_pickup_stock_entry` | SE: kho nguồn → kho ĐVVC | `not custom_stock_entry` |
| Delivered | **bù SE nếu thiếu** rồi `_create_delivery_note` | DN từ partner_warehouse, `so_detail`/`against_sales_order` → tăng `delivered_qty` SO | `not custom_delivery_note` |
| Delivered (+DN, cod>0) | `_create_cod_invoice_and_payment` | SI từ DN items + PE `Receive` (`paid_from` = COD Receivable, `paid_to` = bank, allocate SI) | `not custom_sales_invoice` |
| Returned / Lost | `_create_return_stock_entry` | SE đảo (t_wh↔s_wh từ SE gốc) | `not custom_return_stock_entry` + cần `custom_stock_entry` |
| In Transit · Returning · Delivery Failed · Cancelled | — | không sinh gì | — |

`no_change` (mốc hành chính như *sửa phiếu gửi*) chỉ ghi tracking, **không** đổi status → không vào bảng này.

Mọi doc tạo bằng `insert(ignore_permissions=True)` + `submit()` → người thao tác không cần quyền kế
toán/kho; webhook chạy dưới `Administrator`.

> ⚠️ **`Returned` mà KHÔNG có `custom_stock_entry` thì không đảo kho** — đúng: hàng chưa từng rời kho
> mình thì không có gì để nhập lại.

---

## 3. ✅ ĐÃ VÁ — webhook giờ sinh chứng từ (on_change) {#status-reactor-fix}

**Gap gốc (đã sửa):** `DPShipment.handle_event()` (app gốc) đổi status bằng `self.db_set("status", ...)`.
Trong Frappe `db_set` chỉ chạy `run_method("on_change")` — **không** chạy `on_update`. Extension trước
hook `on_update` nên **không bao giờ fire từ webhook** → "Delivered" không tự tạo DN/SI/PE, "Partner
Received" không tự tạo SE.

**Bản vá (Cách B):** đổi hook `DP Shipment` từ `on_update` → `on_change` trong extension. Guard idempotent
sẵn có (`not custom_*`) + thêm cờ chống đệ quy `_dp_ext_status_reacting` (db_set trong các hàm `_create_*`
lại fire on_change → cờ khiến fire lồng return ngay, outer chạy tuần tự). **Đã test local trọn chuỗi
SE→DN→SI→PE + idempotent** (fire lại không tạo trùng).

> **Kèm bản vá:** sửa bug COD — SI trước ghi vào `Debtors` nhưng PE cấn từ COD account → lệch, PE chết.
> Nay `si.debit_to = cod_account`. **Yêu cầu bắt buộc:** COD account phải là **`account_type = Receivable`**
> (setup hay tạo nhầm `Cash` → phải sửa trên prod, xem §5).

> Đường A (kho tạo SE từ MR tay) **không** dính gap này (`Stock Entry.on_submit` là submit thật) — vẫn chạy
> song song, dùng khi chưa deploy bản vá.

### 3.1. Bù mốc lấy hàng — chống TỒN ÂM {#bu-moc-lay-hang}

DN xuất hàng **từ kho ảo của ĐVVC**, mà chỉ SE lúc `Partner Received` mới đưa hàng vào đó. Vào
`Delivered` khi **chưa có SE** → DN xuất từ kho trống = **tồn âm**.

Xảy ra thật với: (a) đơn đã đẩy **trước khi webhook chạy được** (5 đơn tính tới 30/07), (b) tuyến nào
ĐVVC **không bắn mốc lấy hàng**, (c) sự kiện tới **không đúng thứ tự** do xử lý nền.

Nút *"Đồng bộ trạng thái từ ĐVVC"* đã có bước bù này từ đầu; **đường webhook thì không** — nay đã có.

> ⚠️ Phải gọi **thẳng** `_create_pickup_stock_entry`, **đừng** gọi qua `handle_event("picked_up")`:
> cờ `_dp_ext_status_reacting` đang bật sẽ khiến fire lồng `return` ngay và **SE không bao giờ được tạo**.

### 3.2. Guard đọc dữ liệu CŨ — phải `SELECT … FOR UPDATE` {#guard-doc-du-lieu-cu}

ĐVVC bắn webhook theo **lô** (đo thật: 5 request trong 0,4 giây cho cùng một vận đơn), và tài liệu VTP
nói rõ hành trình **có thể trùng hoặc thừa**.

Chuỗi `db_set` của `handle_event` **tự khoá dòng** nên 2 worker không chạy chồng nhau — *"thiếu khoá"*
**không** phải vấn đề. Vấn đề là worker thứ hai đã `frappe.get_doc()` **trước** khi worker thứ nhất
commit, mà MariaDB ở đây chạy **REPEATABLE-READ**: sau khi worker 1 commit, mọi `SELECT` thường trong
transaction của worker 2 **vẫn trả snapshot cũ**. Đo thật:

```
A: SELECT dn                 -> NULL        (mở snapshot)
B: UPDATE dn='DN-B'; COMMIT
A: SELECT dn                 -> NULL        ← vẫn cũ!
A: SELECT dn ... FOR UPDATE  -> 'DN-B'      ← chỉ locking read mới thấy
```

Hậu quả **hai chiều**:

| Chiều | Guard | Kết quả sai |
|---|---|---|
| Tạo trùng | `not doc.custom_delivery_note` | doc cũ thấy trống dù DN đã có → **DN thứ hai** |
| Bỏ sót | nhánh COD đòi `custom_delivery_note` phải **CÓ** | doc cũ thấy trống → **đơn COD giao xong không có hoá đơn** |

`_lock_and_refresh(doc)` đọc lại 4 ô guard (`custom_stock_entry`, `custom_delivery_note`,
`custom_sales_invoice`, `custom_return_stock_entry`) bằng `SELECT … FOR UPDATE` ngay đầu `on_change`.
Locking read luôn đọc **bản commit mới nhất** — đó là lý do nó chữa được, chứ không phải vì thêm khoá.

> Chờ khoá quá lâu (mặc định 50s) thì **để lỗi nổ** (Error Log + rollback), **không nuốt**: nuốt là
> trạng thái vẫn cập nhật nhưng chứng từ không sinh — im lặng và khó thấy hơn nhiều. Nổ ra thì dọn bằng
> nút *"Đồng bộ trạng thái từ ĐVVC"*.

### 3.3. "Delivered mà không có Phiếu giao hàng" — không phải lỗi

3 trường hợp `_create_delivery_note` bỏ qua **có chủ ý**: vận đơn không gắn Đơn bán hàng (đơn tạo tay
trên cổng / gán từ ngoài) · các dòng hàng **đã giao hết** bằng phiếu khác · dòng hàng chưa gắn SO item.

Trước đây chỉ ghi `logger.warning` nên nhìn từ ngoài **không phân biệt được với hệ thống lỗi** — mà prod
không vào được log server. Nay ghi hẳn **Comment lên vận đơn**.

---

## 3b. Nhánh CHUYỂN KHO — `doc_events/transfer.py` {#chuyen-kho}

Ngược chiều luồng bán hàng: ở đó vận đơn **đẻ ra** Material Request; ở đây Material Request **đẻ ra**
vận đơn. Cùng doctype, hai vai trái ngược — phân biệt bằng bốn dấu hiệu độc lập (đo trên dữ liệu thật):

| | MR do vận đơn bán hàng đẻ ra | MR đẻ ra vận đơn chuyển kho |
|---|---|---|
| `set_from_warehouse` (header) | **luôn trống** (17/17) | **luôn có** (806/806) |
| `set_warehouse` | kho ảo ĐVVC | kho thật ở tỉnh khác |
| Ô nối | `DP Shipment.custom_material_request` | `DP Shipment.custom_references` |
| Dòng hàng | có `custom_dp_shipment` | không |

> ⛔ **Đừng tra bằng `material_request_type`** — cả hai đều là `Material Transfer`. Báo cáo nào gộp hai
> loại này sẽ ra số vô nghĩa: trong 11.467 MR Material Transfer chỉ **806** là chuyển kho thật, phần
> còn lại là cấp vật tư xuống kho cá nhân KTV.

### Đường đi của hàng

```
kho nguồn --(ĐVVC lấy hàng)--> kho ảo ĐVVC --(kho đích Submit)--> kho đích
```

Kho trung gian là **kho ảo của ĐVVC**, không phải Goods In Transit — Goods In Transit dành cho hàng công
ty **tự chở**. Tách vậy để nhìn tồn kho là biết ai đang giữ hàng và ai đền nếu mất.

Vẫn dùng cơ chế in-transit gốc của ERPNext (`make_in_transit_stock_entry` + `make_stock_in_entry`), chỉ
truyền kho ảo ĐVVC làm `in_transit_warehouse` → giữ được `outgoing_stock_entry` nối cặp phiếu, MR tự lên
`In Transit`, phiếu nhận dựng tự động. `stock_entry.py` của ERPNext **không** bắt kho trung gian phải
thuộc `warehouse_type = Transit`.

### Theo status

| status | Hàm | Kết quả |
|---|---|---|
| Partner Received | `_create_send_entry` | SE `add_to_transit=1`, kho nguồn → kho ảo ĐVVC, **Submit**. Số lượng bám **vận đơn** (`custom_picked_qty` ∥ `qty`), không bám MR |
| Delivered | bù SE nếu thiếu → `_create_receive_entry_draft` | SE nhận kho ảo → kho đích, **để NHÁP** + ToDo cho người có User Permission trên kho đích |
| Returned / Lost | `_create_return_entry` | SE đảo về kho nguồn |

Phiếu nhận cố ý **không** tự Submit: kho đích phải đếm hàng thật rồi mới ký.

### Chống xuất kho hai lần

`custom_transport_mode` trên MR (chỉ đọc, hệ thống ghi):

- Submit vận đơn chuyển kho → ghi `Đơn vị vận chuyển`; `Stock Entry.validate` chặn mọi phiếu xuất tay
  bám vào MR đó.
- Xuất kho tay trước → `Stock Entry.on_submit` ghi `Tự vận chuyển`; `validate_transfer_source` chặn đặt
  ĐVVC.
- Phiếu do hệ thống dựng mang cờ `_dp_transfer_generated` để không tự chặn chính mình.

### Sinh chứng từ trên đường webhook

Mỗi bước chạy trong `_guarded`: `frappe.db.savepoint` → lỗi thì rollback tới savepoint, ghi Error Log
**và Comment lên vận đơn**. Lý do: để lỗi văng ra thì ĐVVC nhận HTTP 500 và bắn lại cả lô; nuốt im thì
status vẫn nhảy mà chứng từ không có. Prod không đọc được log server nên phải để dấu ngay trên vận đơn,
dọn bằng nút *Đồng bộ trạng thái từ ĐVVC*.

### Chọn tài khoản ĐVVC

`_partner_account_for_company` xếp hạng: tài khoản sở hữu **điểm gửi khai trên kho nguồn** → có
credentials → có điểm gửi đã đồng bộ → `is_default` → tên. Bắt buộc vì hệ thống có **8 tài khoản dựng
sẵn không credentials** (GHN, GHTK, J&T…) đều bật `is_default`; lấy theo tên là hàng chui vào kho ảo của
hãng không dùng. Điều kiện cứng: kho ảo phải thuộc **đúng công ty** của MR, nếu không ERPNext chặn
`InvalidWarehouseCompany`.

### Điểm gửi (`pickup_point`)

App gốc có ô `pickup_point` trên vận đơn; `_sender_info` dùng đúng điểm đó thay vì luôn lấy điểm mặc
định của tài khoản. Không có nó thì hàng gửi từ kho tỉnh vẫn báo VTP tới lấy ở TP.HCM.
`Warehouse.custom_dp_pickup_point` ghi điểm gửi ứng với từng kho; patch
`seed_warehouse_pickup_points` mồi sẵn 10 kho, chỉ điền ô trống.

`pickup_address_name` từ nay chỉ bắt buộc khi **không** khai điểm gửi — VTP lấy người gửi từ
`GROUPADDRESS_ID` của điểm, không từ Address, và hầu như không kho nào có Address.

---

## 4. Custom field cầu nối (fixtures của extension)

Trên **DP Shipment**: `custom_sales_order`, `custom_pickup_warehouse`, `custom_fulfillment_status`,
`custom_material_request` / `custom_stock_entry` / `custom_delivery_note` / `custom_sales_invoice` /
`custom_payment_entry` / `custom_return_stock_entry`, `custom_shipping_fee`/`custom_cod_fee`/... +
`custom_total_cost`. Trên **DP Shipment Item**: `custom_warehouse`, `custom_sales_order_item`,
`custom_picked_qty`, `custom_pick_status`.

Thêm từ 08/2026:

| Field | Ở đâu | Việc |
|---|---|---|
| `custom_purpose` | DP Shipment | Bắt buộc, mặc định *Bán hàng*. Công tắc rẽ nhánh — [§1b](#muc-dich) |
| `custom_references` | DP Shipment | Bảng `DP Shipment Reference`: chứng từ nguồn, quan hệ nhiều–nhiều |
| `custom_receive_stock_entry` | DP Shipment | Phiếu nhập do kho đích Submit (chuyển kho) |
| `custom_transport_mode` | Material Request | Chỉ đọc, hệ thống ghi: *Đơn vị vận chuyển* ∥ *Tự vận chuyển* |
| `custom_dp_pickup_point` | Warehouse | Điểm gửi ĐVVC ứng với kho |

> Field `carrier_push_status` / `order_source` (trạng thái đẩy đơn) là **field native của app gốc**
> trong `dp_shipment.json` — xem [Tài liệu kỹ thuật app gốc](Delivery_Partner-Tech.html).
> `pickup_point`, `delivery_warehouse` cũng là field native của app gốc (thêm 08/2026).

### Patch

| Patch | Việc |
|---|---|
| `set_shipment_purpose_and_backfill_references` | Điền mục đích + dựng dòng chứng từ nguồn cho vận đơn cũ |
| `vietnamese_shipment_labels` | Translation `DP Shipment → Vận đơn`, `Create → Tạo` (**toàn hệ thống**, gỡ bằng xoá 4 dòng Translation) |
| `seed_warehouse_pickup_points` | Mồi điểm gửi cho 10 kho nguồn, chỉ điền ô trống |

> ⚠️ **Bẫy thứ tự migrate:** patch `post_model_sync` chạy **trước** `sync_fixtures`, nên patch nào đụng
> custom field sẽ không thấy ô đó trên site mới, bỏ qua im lặng, mà Patch Log đã ghi "đã chạy" nên không
> bao giờ chạy lại. Càng khó thấy vì `ALTER TABLE … ADD COLUMN … DEFAULT` của MariaDB điền sẵn giá trị
> mặc định cho mọi dòng cũ. Mọi patch phải gọi `fixture_utils.ensure_custom_fields()` trước.

---

## 5. COD Payment Entry — ràng buộc loại tài khoản

`_create_cod_invoice_and_payment`: PE `payment_type = "Receive"`, `party = Customer`,
`paid_from = DP Partner Account.cod_account`, `paid_to` = (SO Bank Account → account của pickup warehouse →
Company default cash). Vì vậy:
- `cod_account` **bắt buộc** `account_type = "Receivable"`.
- `paid_to` **phải** Bank/Cash → đảm bảo SO có Bank Account hoặc Company có Default Cash Account.

Chi tiết loại tài khoản & kho ảo: [Viettel Post — Tham chiếu kỹ thuật §9](Delivery_Partner-Viettel_Post-Tech.html#9-kế-toán-cod).

---

---

## 6. Cài đặt & setup bổ sung (ngoài app gốc)

```bash
# delivery_partner phải cài trước
bench get-app https://github.com/CobeGroup/delivery_partner_extension_for_cobegroup.git
bench --site <site> install-app delivery_partner_extension_for_cobegroup
bench --site <site> migrate
bench build --app delivery_partner_extension_for_cobegroup
bench --site <site> clear-cache   # BẮT BUỘC — hook doc_events cache trong redis, không clear thì bản mới không nạp
```

> ⚠️ **Bẫy deploy:** đổi `doc_events` (hooks.py) mà **không `clear-cache`** → tiến trình vẫn chạy hook
> cũ (app_hooks cache redis). Triệu chứng: webhook đổi status nhưng chứng từ không sinh. Luôn clear-cache
> (hoặc restart) sau khi deploy bản đổi hook.

| Cần setup | Chi tiết |
|---|---|
| **SO custom field** `custom_delivery_method` (Select) | `Đơn vị vận chuyển` / `Nội bộ giao/lắp` / `Khác (Đơn cũ)`. Nút **Create > DP Shipment** trên SO chỉ hiện khi = "Đơn vị vận chuyển" + SO đã submit |
| **COD Receivable Account** | Chart of Accounts → tạo account (VD `COD Viettel Post`) với **`account_type = Receivable`** (BẮT BUỘC — để `Cash`/khác là đơn COD chết ở SI/PE) → điền vào DP Partner Account |
| **Warehouse Address + Contact** | Mỗi kho pickup: Address link `Warehouse`; Contact (optional); Warehouse.`Account` (fallback đích COD PE) |
| **Item dimensions** (optional) | `Weight Per Unit` (kg) + `custom_parcel_length/width/height` (cm) — phục vụ Auto-calculate Parcel |
| **Mode of Payment `Cash`** | Có `Default Account` cho company (Settings → Mode of Payment → Cash) |

---

## 7. Hooks (doc_events) — bảng tóm tắt

| Event | Trigger | Action |
|-------|---------|--------|
| `before_save` | Save DP Shipment | Auto-calc `custom_total_cost` |
| `on_submit` | Submit DP Shipment | Tạo + submit MR |
| `on_change` | *(mọi lần)* | Khoá dòng + nạp lại 4 ô guard — [§3.2](#guard-doc-du-lieu-cu) |
| `on_change` | Status = `Partner Received` | Tạo + submit SE (pickup) |
| `on_change` | Status = `Delivered` | **Bù SE nếu thiếu** ([§3.1](#bu-moc-lay-hang)) → tạo DN + (SI + PE nếu COD) |
| `on_change` | Status = `Returned` / `Lost` | Tạo Return SE (chỉ khi đã có `custom_stock_entry`) |
| `before_cancel` | Cancel DP Shipment | Cancel MR + tạo Return SE nếu cần |
| `Stock Entry.validate` | Mọi SE `Material Transfer` | Chặn phiếu xuất tay bám vào MR đã đặt ĐVVC — [§3b](#chuyen-kho) |
| `Stock Entry.on_submit` | SE tay bám MR chuyển kho thật | Ghi `custom_transport_mode = Tự vận chuyển` |

Bảng trên là nhánh **Bán hàng**. Mục đích *Chuyển kho* đi qua `doc_events/transfer.py` — [§3b](#chuyen-kho);
mục đích *Gửi mẫu* / *Bảo hành* ra sớm ngay đầu `on_change`, không khoá dòng.

> ℹ️ Hook là **`on_change`**, KHÔNG phải `on_update`: base app đổi status bằng `db_set` → Frappe chỉ chạy
> `on_change`. Xem [§3](#status-reactor-fix).

---

## 8. Custom fields được tạo (fixtures)

### Trên DP Shipment

| Field | Type | Tab | Mô tả |
|-------|------|-----|-------|
| custom_sales_order | Link → SO | Shipment | SO nguồn |
| custom_fulfillment_status | Select | Tracking | Pending MR / Transferred / ... |
| custom_pickup_warehouse | Link → Warehouse | Pickup | Kho xuất mặc định |
| custom_shipping_fee / custom_cod_fee / custom_insurance_fee / custom_return_fee / custom_other_charges | Currency | Charges | Các loại cước |
| custom_total_cost | Currency (RO) | Charges | Tổng (auto) |
| custom_charges_paid_by | Select | Charges | Sender / Receiver / Third Party |
| custom_cod_collected | Currency (RO) | Charges | COD thực nhận từ webhook |
| custom_material_request / custom_stock_entry / custom_delivery_note / custom_sales_invoice / custom_payment_entry / custom_return_stock_entry | Link | Tracking | Chứng từ ERP sinh theo lifecycle |

### Trên DP Shipment Item

| Field | Mô tả |
|-------|-------|
| custom_warehouse | Source Warehouse |
| custom_sales_order_item | Link tracing về SO item |
| custom_ordered_qty / custom_already_shipped | Qty gốc / đã ship trước |
| custom_so_qty | Parent SO units consumed (bundle) |
| custom_picked_qty | Qty carrier thực lấy (default = qty) |
| custom_pick_status | Pending / Picked / Partial / Missing |
| custom_unit_weight / custom_unit_length/width/height | Trọng lượng (kg) / kích thước (cm) từ Item |

### Trên Item / Material Request Item

| Doctype | Field | Mô tả |
|---|---|---|
| Item | custom_parcel_length/width/height, custom_dimension_uom | Kích thước đóng gói |
| Material Request Item | custom_dp_shipment | DP Shipment name (Data, tránh circular link) |

---

## Liên quan

- [Quy trình vận đơn (end-user)](../users/Delivery_Partner-Quy-Trinh.html)
- [Vận đơn từ Sales Order — kho & kế toán (end-user)](../users/Delivery_Partner_Extension.html)
- [Delivery Partner — Tài liệu kỹ thuật (app gốc)](Delivery_Partner-Tech.html)
