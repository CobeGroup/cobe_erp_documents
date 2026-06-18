---
title: Delivery Partner Extension (Cobe)
layout: default
parent: Vận chuyển & Giao nhận
nav_order: 2
---

# Delivery Partner Extension for Cobegroup — Hướng dẫn sử dụng

App tích hợp `delivery_partner` với ERPNext: tự động tạo Material Request, Stock Entry,
Delivery Note, Sales Invoice, Payment Entry theo lifecycle vận đơn.

> **Yêu cầu:** Đọc trước [Hướng dẫn Delivery Partner](Delivery_Partner.md)
> để hiểu các khái niệm: DP Partner, DP Shipment, Status Mapping, Webhook.

---

## 1. Cài đặt

```bash
# delivery_partner phải cài trước
bench get-app https://github.com/CobeGroup/delivery_partner_extension_for_cobegroup.git
bench --site <site> install-app delivery_partner_extension_for_cobegroup
bench --site <site> migrate
bench build --app delivery_partner_extension_for_cobegroup
```

Khi migrate, app tự tạo các custom fields trên:
- **DP Shipment**: Sales Order link, Fulfillment Status, Pickup Warehouse, Charges section, ERP document links
- **DP Shipment Item**: Source Warehouse, SO tracking fields, Picked Qty, Pick Status, Weight/Dimensions
- **Item**: Parcel Length/Width/Height, Dimension UOM
- **Material Request Item**: DP Shipment reference

---

## 2. Setup bổ sung (ngoài setup base app)

### 2.1. Custom field trên Sales Order

Đảm bảo SO có field `custom_delivery_method` (Select):

```
Đơn vị vận chuyển
Nội bộ giao/lắp
Khác (Đơn cũ)
```

Nút **Create > DP Shipment** trên SO chỉ hiện khi `custom_delivery_method = "Đơn vị vận chuyển"` và SO đã submit.

### 2.2. COD Receivable Account

Cho mỗi carrier cần thu hộ COD:

1. **Chart of Accounts** → tạo account:
   - Tên: `GHN Receivable` (hoặc `VTP Receivable`, ...)
   - Loại: Current Asset
2. **DP Partner Account** → điền `COD Receivable Account` = account vừa tạo

### 2.3. Warehouse Address + Contact

Mỗi kho/showroom/chi nhánh dùng làm điểm pickup cần:

1. **Address** liên kết: tạo Address → phần Reference → Link Type = `Warehouse`, Link Name = `<tên kho>`
2. **Contact** (optional): tương tự, tạo Contact → link tới Warehouse
3. **Warehouse Account** (optional): trên Warehouse → field `Account` → GL account (làm đích fallback cho COD PE)

### 2.4. Item dimensions (optional)

Trên **Item** master, điền:
- `Weight Per Unit` (field có sẵn, đơn vị kg)
- `Parcel Length / Width / Height` (custom fields, đơn vị cm)

Phục vụ cho Auto-calculate Parcel và hiển thị trên DP Shipment Item.

### 2.5. Mode of Payment "Cash"

Đảm bảo Mode of Payment `Cash` có `Default Account` cho company (Settings → Mode of Payment → Cash → add row).

---

## 3. Luồng vận hành chi tiết

### Sơ đồ tổng quan

```
Sales Order (Submit, delivery_method = "Đơn vị vận chuyển")
  │
  ├─ [User] Create > DP Shipment
  │    ├─ Nếu items cùng 1 kho → tạo thẳng
  │    └─ Nếu items nhiều kho → dialog chọn kho → tạo 1 shipment/kho
  │
  ▼
DP Shipment (Draft)
  │  [User] Chọn carrier, review items, thêm parcel
  │  [User] Submit
  │
  ├─ [Auto] MR created + submitted ──────────────── Thủ kho thấy trong queue
  │
  ├─ [Webhook] picked_up
  │    └─ [Auto] SE created (Source WH → Partner WH)
  │
  ├─ [Webhook] in_transit ───────────────────────── Chỉ update status
  │
  ├─ [Webhook] delivered
  │    ├─ [Auto] DN created ─────────────────────── SO.delivered_qty tăng
  │    └─ [Auto] SI + PE (nếu COD > 0) ─────────── Ghi nhận thu tiền
  │
  └─ SO auto Completed (khi tất cả items đã delivered)
```

---

### Bước 1: Tạo Sales Order

**Ai:** Sales team

1. Tạo SO, thêm items, chỉ định warehouse cho mỗi item
2. Set `Delivery Method` = **"Đơn vị vận chuyển"**
3. Submit SO

### Bước 2: Tạo DP Shipment từ SO

**Ai:** Sales / Logistics

1. Mở SO → bấm **Create > DP Shipment**

2. **Nếu SO có items từ nhiều warehouse:**
   - Hệ thống hiện dialog: "Chọn kho xuất cho vận đơn"
   - User chọn 1 kho → chỉ items từ kho đó được đưa vào shipment
   - Lặp lại cho các kho còn lại nếu cần

3. **Hệ thống tự động điền:**

   | Field | Nguồn |
   |-------|-------|
   | Pickup From | `Warehouse` (nếu xác định) hoặc `Company` |
   | Pickup Address | Address của warehouse (fallback: company) |
   | Pickup Contact | Contact của warehouse (không fallback) |
   | Delivery Customer | SO.customer |
   | Delivery Address | SO.shipping_address → fallback default address của customer |
   | Delivery Contact | SO.contact_person → fallback default contact của customer |
   | Items | Stock items từ SO, **đã rã Product Bundle**, trừ qty đã ship |
   | Per-item weight/dimensions | Từ Item master |
   | Value of Goods | SO.grand_total |
   | Pickup Date | Hôm nay |

4. **User cần làm:**
   - [ ] Chọn **Partner** (GHN, VTP, ...) và **Partner Account**
   - [ ] Kiểm tra **Pickup Address** đúng kho cần xuất
   - [ ] Nhập **COD Amount** (0 nếu không thu COD)
   - [ ] Điều chỉnh items nếu chỉ ship 1 phần (giảm qty, xóa row)
   - [ ] Qua tab Parcels → bấm **Auto-calculate Parcel** hoặc thêm thủ công
   - [ ] Điền **Pickup Date** + khung giờ lấy hàng

### Bước 3: Submit DP Shipment

**User bấm Submit.** Hệ thống:

1. Validate: tất cả items cùng 1 warehouse, có parcel, value > 0
2. Gọi API carrier tạo vận đơn → nhận tracking number
3. Status: `Draft → Submitted → Booked`
4. **[Extension] Tạo Material Request** (Material Transfer):
   - From: source warehouse (kho xuất)
   - To: partner warehouse (kho ảo carrier)
   - MR auto submit → Thủ kho thấy trong MR list
5. Fulfillment Status = `Pending MR`

| Document tạo ra | Status | Link trên DP Shipment |
|-----------------|--------|-----------------------|
| Material Request | Submitted | Tab Tracking → Material Request |

### Bước 4: Thủ kho chuẩn bị hàng

**Ai:** Thủ kho

1. Vào **Material Request** list → filter `Material Transfer` + `Pending`
2. Mỗi MR có field `DP Shipment` → biết thuộc vận đơn nào
3. Soạn hàng theo MR items
4. **Không cần tạo Stock Entry thủ công** — sẽ auto tạo ở bước sau

### Bước 5: Carrier lấy hàng (Webhook `picked_up`)

**Trigger:** Webhook từ carrier (hoặc giả lập — xem guide base app mục 6).

Hệ thống tự động:

1. DP Shipment status → `Partner Received`
2. **Tạo Stock Entry** (Material Transfer):
   - Source warehouse → Partner warehouse
   - Qty = `custom_picked_qty` (mặc định = declared qty)
   - Mỗi item: `custom_pick_status` = `Picked`
3. Fulfillment Status = `Transferred`
4. Stock di chuyển: giảm ở kho xuất, tăng ở kho carrier

| Document tạo ra | Status | Link trên DP Shipment |
|-----------------|--------|-----------------------|
| Stock Entry (Transfer Out) | Submitted | Tab Tracking → SE (Transfer Out) |

### Bước 6: Đang vận chuyển (Webhook `in_transit`)

DP Shipment status → `In Transit`. Không tạo document mới.

### Bước 7: Giao thành công (Webhook `delivered`)

Hệ thống tự động:

**7a. Tạo Delivery Note:**
- Customer = SO.customer
- Items = actual picked qty
- Warehouse = partner warehouse
- Link tới SO items → `delivered_qty` trên SO tăng

**7b. Nếu COD Amount > 0, tạo thêm:**

- **Sales Invoice**: từ DN items, rate lấy từ SO
- **Payment Entry**:
  - Type: Receive
  - Party: Customer
  - Paid From: `DP Partner Account.cod_account` (carrier receivable)
  - Paid To: `SO.bank_account` → fallback `Warehouse.account` → fallback `Company.default_cash_account`
  - Mode: Cash
  - Amount = COD Amount

| Document tạo ra | Status | Điều kiện |
|-----------------|--------|-----------|
| Delivery Note | Submitted | Luôn tạo |
| Sales Invoice | Submitted | Chỉ khi COD > 0 |
| Payment Entry | Submitted | Chỉ khi COD > 0 |

**Kết quả:** SO auto `Completed` khi tất cả items đã `delivered_qty == qty`.

---

## 4. Các trường hợp đặc biệt

### 4A. Giao thất bại → Hoàn hàng

```
delivery_failed  → Status: "Delivery Failed" (không tạo document)
  ↓
returning        → Status: "Returning" (hàng đang trên đường hoàn)
  ↓
returned         → Status: "Returned"
                   → [Auto] Return SE: Partner WH → Source WH (stock hoàn về kho)
                   → SO items quay về pool → có thể tạo DP Shipment mới
```

### 4B. Mất hàng

```
lost → Status: "Lost"
     → [Auto] Write-off SE: Partner WH → Source WH
     → Stock trừ khỏi partner warehouse
     → SO vẫn "To Deliver" — sales team quyết định ship lại hoặc close SO
```

### 4C. Hủy vận đơn

**User:** Mở DP Shipment → bấm **Cancel**

| MR đã có SE chưa? | Hệ thống xử lý |
|-------------------|-----------------|
| Chưa (stock chưa di chuyển) | Cancel MR |
| Rồi (stock đã ở partner WH) | Tạo Return SE + Cancel MR |

SO items quay về pool sau khi hủy.

### 4D. Ship nhiều lần cho 1 SO (tách đơn)

**Kịch bản:** SO có 10 sản phẩm, muốn ship 2 lần.

1. **Lần 1:** Create DP Shipment → giảm qty xuống 5 → Submit
2. **Lần 2:** Create DP Shipment lại → hệ thống tự tính remaining = 10 - 5 = 5

**Cách tính remaining:**

| Shipment status | Tính vào pool "đã ship"? | Dùng qty nào? |
|----------------|--------------------------|---------------|
| Submitted / Booked | Có (committed) | Declared qty |
| Partner Received → Delivered / Lost | Có (actual) | Picked qty |
| Returned / Cancelled | Không (hoàn về pool) | — |
| Draft | Không | — |

**Hỗ trợ:**
- Nhiều carrier khác nhau cho mỗi lần ship
- Nhiều kho khác nhau (mỗi shipment 1 kho)

### 4E. Product Bundle

Khi SO có Product Bundle (VD: "Combo A" = Item X × 2 + Item Y × 1):

- SO: 3 × Combo A
- DP Shipment items: Item X × 6, Item Y × 3
- `custom_so_qty` = 3 trên tất cả children (parent qty consumed)
- Non-stock items trong bundle bị skip

---

## 5. Custom fields được tạo

### Trên DP Shipment

| Field | Type | Tab | Mô tả |
|-------|------|-----|-------|
| custom_sales_order | Link → SO | Shipment | SO nguồn |
| custom_fulfillment_status | Select | Tracking | Pending MR / Transferred / ... |
| custom_pickup_warehouse | Link → Warehouse | Pickup | Kho xuất mặc định |
| custom_tab_charges | Tab Break | — | Tab Charges |
| custom_shipping_fee | Currency | Charges | Cước vận chuyển |
| custom_cod_fee | Currency | Charges | Phí thu hộ |
| custom_insurance_fee | Currency | Charges | Phí bảo hiểm |
| custom_return_fee | Currency | Charges | Phí hoàn |
| custom_other_charges | Currency | Charges | Phí khác |
| custom_total_cost | Currency (read-only) | Charges | Tổng (auto-tính) |
| custom_charges_paid_by | Select | Charges | Sender / Receiver / Third Party |
| custom_cod_collected | Currency (read-only) | Charges | COD thực nhận từ webhook |
| custom_material_request | Link → MR | Tracking | MR tạo khi submit |
| custom_stock_entry | Link → SE | Tracking | SE Transfer Out |
| custom_delivery_note | Link → DN | Tracking | DN khi delivered |
| custom_sales_invoice | Link → SI | Tracking | SI khi COD delivered |
| custom_payment_entry | Link → PE | Tracking | PE khi COD delivered |
| custom_return_stock_entry | Link → SE | Tracking | SE Return khi returned/lost |

### Trên DP Shipment Item

| Field | Mô tả |
|-------|-------|
| custom_warehouse | Source Warehouse |
| custom_sales_order_item | Link tracing về SO item |
| custom_ordered_qty | Qty gốc trên SO |
| custom_already_shipped | Qty đã ship ở shipments trước |
| custom_so_qty | Parent SO units consumed (cho bundle) |
| custom_picked_qty | Qty carrier thực lấy (default = qty) |
| custom_pick_status | Pending / Picked / Partial / Missing |
| custom_unit_weight | Trọng lượng 1 đơn vị (kg, từ Item) |
| custom_unit_length/width/height | Kích thước (cm, từ Item) |

### Trên Item

| Field | Mô tả |
|-------|-------|
| custom_parcel_length | Chiều dài đóng gói (cm) |
| custom_parcel_width | Chiều rộng (cm) |
| custom_parcel_height | Chiều cao (cm) |
| custom_dimension_uom | Đơn vị (cm/mm/in) |

### Trên Material Request Item

| Field | Mô tả |
|-------|-------|
| custom_dp_shipment | DP Shipment name (Data, không Link — tránh circular dependency) |

---

## 6. Hooks (doc events)

| Event | Trigger | Action |
|-------|---------|--------|
| `before_save` | Save DP Shipment | Auto-calc `custom_total_cost` |
| `on_submit` | Submit DP Shipment | Tạo + submit MR |
| `on_update` | Status = `Partner Received` | Tạo + submit SE (pickup) |
| `on_update` | Status = `Delivered` | Tạo DN + (SI + PE nếu COD) |
| `on_update` | Status = `Returned` / `Lost` | Tạo Return SE |
| `before_cancel` | Cancel DP Shipment | Cancel MR + tạo Return SE nếu cần |

---

## 7. Troubleshooting

### "Partner Account has no warehouse configured"
→ Vào DP Partner Account → điền `Partner Warehouse` (kho ảo carrier).

### "No cod_account on partner account, skipping PE"
→ Tạo COD account trong Chart of Accounts → điền vào DP Partner Account.

### "Row X: Item Y has no source warehouse set"
→ Item trên DP Shipment không có `custom_warehouse` và document-level `custom_pickup_warehouse` cũng trống. Chọn warehouse.

### MR không tạo khi submit
→ Kiểm tra `custom_material_request` đã có giá trị chưa (tránh tạo trùng). Xem Error Log.

### DN qty không khớp SO
→ DN dùng `custom_picked_qty` (actual qty carrier lấy), không phải declared qty. Nếu partial pick, DN qty sẽ nhỏ hơn.

### Cancel DP Shipment bị lỗi back-link
→ App dùng `flags.ignore_links = True` để bypass. Nếu vẫn lỗi → kiểm tra MR status trước khi cancel.

### SO không auto Completed sau delivered
→ SO chỉ complete khi **tất cả** items đều `delivered_qty >= qty`. Kiểm tra có items chưa ship không.
