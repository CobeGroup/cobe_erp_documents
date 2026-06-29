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

Hook đăng ký (`extension/hooks.py`):

```python
doc_events = {
    "DP Shipment": {
        "before_save":   "...dp_shipment.before_save",    # tính custom_total_cost
        "on_submit":     "...dp_shipment.on_submit",       # tạo Material Request
        "on_update":     "...dp_shipment.on_update",        # tạo SE/DN/SI/PE theo status
        "before_cancel": "...dp_shipment.before_cancel",
    },
    "Stock Entry":      {"on_submit": "...stock_entry.on_submit"},
    "Material Request": {"on_update": "...material_request.on_update"},
}
```

---

## 2. Chuỗi tạo chứng từ

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

### 2.3. on_update theo status (EVENT_STATUS_MAP của app gốc)

| status | Hàm | Chứng từ / tác động | Guard idempotent |
|---|---|---|---|
| Partner Received | `_create_pickup_stock_entry` | SE: kho nguồn → kho ĐVVC | `not custom_stock_entry` |
| Delivered | `_create_delivery_note` | DN từ partner_warehouse, `so_detail`/`against_sales_order` → tăng `delivered_qty` SO | `not custom_delivery_note` |
| Delivered (+DN, cod>0) | `_create_cod_invoice_and_payment` | SI từ DN items + PE `Receive` (`paid_from` = COD Receivable, `paid_to` = bank, allocate SI) | `not custom_sales_invoice` |
| Returned / Lost | `_create_return_stock_entry` | SE đảo (t_wh↔s_wh từ SE gốc) | `not custom_return_stock_entry` + cần `custom_stock_entry` |

Mọi doc tạo bằng `insert(ignore_permissions=True)` + `submit()` → người thao tác không cần quyền kế
toán/kho; webhook chạy dưới `Administrator`.

---

## 3. ⚠️ GAP đã biết: on_update KHÔNG fire từ webhook

**Triệu chứng:** webhook đổi status → tab Tracking cập nhật, nhưng **SE/DN/SI/PE auto KHÔNG sinh**.

**Nguyên nhân:** `DPShipment.handle_event()` (app gốc) đổi status bằng **`self.db_set("status", ...)`**.
Trong Frappe, `db_set` chạy `run_method("on_change")` — **không** chạy `on_update`
(`frappe/model/document.py`). Extension lại hook **`on_update`** → không kích hoạt.

→ Hệ quả production: đơn "Delivered" hiển thị đúng nhưng **không tự tạo DN/SI/PE**; "Partner Received"
không tự tạo SE (trừ khi kho đã đi Đường A — tạo SE từ MR tay).

**Hướng xử lý:**
- **Cách B (khuyến nghị, ở extension):** đổi hook `DP Shipment` từ `on_update` → `on_change`. Guard
  idempotent sẵn có (`not custom_*`) chịu được on_change fire nhiều lần / nhiều db_set trong 1 webhook.
  Cần test 1 sự kiện thật.
- **Cách A (ở app gốc):** sau `db_set("status")` trong `handle_event`, gọi `self.run_method("on_update")`
  — nhưng phá nguyên tắc "app gốc không biết ERP" và side-effect rộng hơn.

> Đường A (kho tạo SE từ MR) **không** dính gap này (vì `Stock Entry.on_submit` là submit thật).
> Nên bước trừ kho vẫn có thể vận hành thủ công trong khi chờ fix.

---

## 4. Custom field cầu nối (fixtures của extension)

Trên **DP Shipment**: `custom_sales_order`, `custom_pickup_warehouse`, `custom_fulfillment_status`,
`custom_material_request` / `custom_stock_entry` / `custom_delivery_note` / `custom_sales_invoice` /
`custom_payment_entry` / `custom_return_stock_entry`, `custom_shipping_fee`/`custom_cod_fee`/... +
`custom_total_cost`. Trên **DP Shipment Item**: `custom_warehouse`, `custom_sales_order_item`,
`custom_picked_qty`, `custom_pick_status`.

> Field `carrier_push_status` / `order_source` (trạng thái đẩy đơn) là **field native của app gốc**
> trong `dp_shipment.json` — xem [Tài liệu kỹ thuật app gốc](Delivery_Partner-Tech.html).

---

## 5. COD Payment Entry — ràng buộc loại tài khoản

`_create_cod_invoice_and_payment`: PE `payment_type = "Receive"`, `party = Customer`,
`paid_from = DP Partner Account.cod_account`, `paid_to` = (SO Bank Account → account của pickup warehouse →
Company default cash). Vì vậy:
- `cod_account` **bắt buộc** `account_type = "Receivable"`.
- `paid_to` **phải** Bank/Cash → đảm bảo SO có Bank Account hoặc Company có Default Cash Account.

Chi tiết loại tài khoản & kho ảo: [Hướng dẫn Viettel Post §1.1](../users/Delivery_Partner-Viettel_Post.html).

---

## Liên quan

- [Quy trình vận đơn (end-user)](../users/Delivery_Partner-Quy-Trinh.html)
- [Delivery Partner — Tài liệu kỹ thuật (app gốc)](Delivery_Partner-Tech.html)
