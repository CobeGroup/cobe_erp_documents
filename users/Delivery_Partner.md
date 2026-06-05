---
title: Delivery Partner
layout: default
parent: Vận chuyển & Giao nhận
nav_order: 1
---

# Delivery Partner — Hướng dẫn sử dụng

App quản lý vận đơn và kết nối đơn vị vận chuyển (ĐVVC) Việt Nam.

> **Lưu ý:** App này hoạt động độc lập cho việc tạo/tracking vận đơn.
> Nếu bạn sử dụng kèm `delivery_partner_extension_for_cobegroup` để tích hợp ERP (SO → MR → DN → SI → PE),
> hãy đọc thêm USAGE_GUIDE.md bên app extension sau khi đọc xong phần này.

---

## 1. Cài đặt

```bash
bench get-app https://github.com/CobeGroup/delivery_partner.git
bench --site <site> install-app delivery_partner
bench --site <site> migrate
bench build --app delivery_partner
```

---

## 2. Setup đơn vị vận chuyển

### 2.1. Chạy script setup (tất cả carriers 1 lần)

```bash
# Tất cả 9 carriers
bench --site <site> execute delivery_partner.scripts.setup_all_carriers.setup

# Chỉ vài carrier
bench --site <site> execute delivery_partner.scripts.setup_all_carriers.setup \
  --kwargs '{"carriers": ["GHN", "VTP", "GHTK"]}'
```

Hoặc qua browser console (F12, cần login System Manager):

```javascript
frappe.call({
    method: "delivery_partner.api.setup.setup_carriers",
    callback: (r) => console.log(r)
});
```

Script tạo cho mỗi carrier:

| Tạo ra | Ví dụ | Ghi chú |
|--------|-------|---------|
| DP Partner | GHN | Auth config, status mappings, webhook handler |
| Warehouse ảo | Kho GHN - CB | Kho trung chuyển trong ERPNext |
| DP Partner Account | GHN Default | Tài khoản kết nối mặc định |

### 2.2. Carriers được hỗ trợ

| Key | Tên | Auth | Status Mappings |
|-----|-----|------|-----------------|
| GHN | Giao Hàng Nhanh | Static Token | 22 |
| VTP | Viettel Post | Token Exchange | 27 |
| GHTK | Giao Hàng Tiết Kiệm | Static Token | 19 |
| JT | J&T Express | Signature | 13 |
| NJV | Ninja Van | Token Exchange | 16 |
| BEST | Best Express | Static Token | 12 |
| AHAMOVE | Ahamove | Static Token | 8 |
| SPX | Shopee Express | Signature | 11 |
| GRAB | GrabExpress | Token Exchange | 8 |

### 2.3. Điền API credentials

1. Vào **DP Partner Account** (VD: `GHN Default`)
2. Điền credentials tùy loại auth:
   - **Static Token**: điền `API Token`
   - **Token Exchange**: điền `Username` + `Password`
   - **Signature**: điền `API Key` + `API Secret`
3. Extra Params nếu cần (VD: GHN cần `ShopId`):
   - Thêm row: Key = `ShopId`, Value = `<id>`, Send As = `Header`
4. Bấm **Test Credentials** để xác nhận kết nối

---

## 3. Doctypes chính

### 3.1. DP Partner

Cấu hình kết nối 1 ĐVVC.

| Field | Mô tả |
|-------|-------|
| Partner Name | Tên carrier (GHN, Viettel Post, ...) |
| Auth Method | Static Token / Token Exchange / Signature |
| Base URL / Sandbox URL | API endpoint production / sandbox |
| Webhook Handler | Python class xử lý webhook từ carrier |
| Status Mappings | Bảng map: carrier status → normalized event |

**Status Mappings** là trung tâm của hệ thống. Mỗi row map 1 raw status từ carrier sang 1 trong 8 normalized events:

| Event | Ý nghĩa | DP Shipment status |
|-------|---------|-------------------|
| `picked_up` | Carrier đã lấy hàng | Partner Received |
| `in_transit` | Đang vận chuyển | In Transit |
| `delivered` | Giao thành công | Delivered |
| `delivery_failed` | Giao thất bại | Delivery Failed |
| `returning` | Đang hoàn hàng | Returning |
| `returned` | Đã hoàn hàng | Returned |
| `lost` | Mất hàng | Lost |
| `cancelled` | Đã hủy | Cancelled |

### 3.2. DP Partner Account

Tài khoản kết nối cụ thể của 1 carrier. Mỗi carrier có thể có nhiều account (VD: 1 production + 1 sandbox, hoặc nhiều shop).

| Field | Mô tả |
|-------|-------|
| Partner Warehouse | Kho ảo đại diện cho carrier (bắt buộc) |
| COD Receivable Account | Tài khoản ảo ghi nhận tiền COD carrier đang giữ |
| Use Sandbox | Bật = dùng sandbox URL |
| Extra Params | Params phụ gửi kèm API (VD: ShopId) |

### 3.3. DP Shipment

Vận đơn chính. Gồm 6 tabs:

**Tab Shipment:**
- Partner, Partner Account
- Items (child table: item_code, qty, uom, weight, dimensions)
- Value of Goods, COD Amount, Description

**Tab Pickup:**
- Pickup From: Company / **Warehouse** / Customer / Supplier
- Chọn Warehouse → auto-fill address + contact từ warehouse đó
- Chọn Company → auto-fill address + contact từ company

**Tab Delivery:**
- Deliver To: Company / Customer / Supplier
- Address, Contact (auto-fill từ party được chọn)

**Tab Parcels & Details:**
- Parcels table (length × width × height × weight × count)
- Nút **Auto-calculate Parcel**: tổng hợp từ items → tạo 1 parcel gợi ý
- Pickup Date, Time, Shipment Type

**Tab Charges:**
- Shipping Fee, COD Fee, Insurance Fee, Return Fee, Other Charges
- Total Cost (auto-tính)
- Charges Paid By (Sender / Receiver / Third Party)
- COD Collected (read-only, cập nhật từ webhook)

**Tab Tracking:**
- Status (lifecycle: Draft → Submitted → Booked → ... → Delivered/Returned/Lost/Cancelled)
- External Shipment ID (mã vận đơn từ carrier)
- Tracking Status (raw), Tracking Info, Tracking URL

---

## 4. Tạo vận đơn thủ công (không từ SO)

1. Vào **DP Shipment** → New
2. Chọn **Partner** và **Partner Account**
3. **Tab Pickup**: chọn Pickup From = `Warehouse` → chọn kho xuất → address auto-fill
4. **Tab Delivery**: chọn Deliver To = `Customer` → chọn khách → address + contact auto-fill
5. **Tab Shipment**: thêm items thủ công (item_code → weight/dimensions auto-fetch từ Item master)
6. Điền **Value of Goods**, **COD Amount** (nếu có)
7. **Tab Parcels**: bấm **Auto-calculate Parcel** hoặc thêm thủ công
8. Điền **Pickup Date**
9. **Submit** → hệ thống gọi API carrier tạo đơn → status = `Booked`

---

## 5. Webhook

### 5.1. URL đăng ký

Khi đăng ký webhook với carrier, dùng URL:

```
POST https://<domain>/api/method/delivery_partner.api.webhook.handle?partner=<TenPartner>
```

| Carrier | URL param |
|---------|-----------|
| GHN | `?partner=GHN` |
| Viettel Post | `?partner=Viettel+Post` |
| GHTK | `?partner=GHTK` |
| J&T Express | `?partner=J%26T+Express` |
| Ninja Van | `?partner=Ninja+Van` |
| Best Express | `?partner=Best+Express` |
| Ahamove | `?partner=Ahamove` |
| Shopee Express | `?partner=Shopee+Express` |
| GrabExpress | `?partner=GrabExpress` |

- Endpoint cho phép guest request (`allow_guest=True`)
- Luôn trả HTTP 200 (tránh carrier retry)
- Lỗi nội bộ log vào Error Log

### 5.2. Flow xử lý webhook

```
Carrier gọi webhook
  → Handler parse payload (OrderCode, Status, ...)
  → Verify signature (token/HMAC tùy carrier)
  → Extract: external_shipment_id + raw_status
  → Lookup DP Status Mapping: raw_status → normalized_event
  → Tìm DP Shipment theo external_shipment_id
  → Gọi shipment.handle_event(event, raw_status, info)
  → Status cập nhật + Comment ghi log
```

Nếu app extension được cài, `on_update` hook sẽ react tiếp (tạo SE, DN, SI, PE — xem guide extension).

---

## 6. Test không cần đơn thật

Hệ thống cung cấp script giả lập webhook, gọi trực tiếp qua bench console mà không cần carrier thật, không cần bench đang chạy.

### 6.1. Chuẩn bị

1. Tạo 1 DP Shipment và **Submit** (status = Submitted hoặc Booked)
2. Ghi nhớ tên shipment (VD: `SHIP-DP-2026-00001`)
3. Mở bench console:

```bash
bench --site <site> console
```

```python
from delivery_partner.scripts.simulate_webhooks import *
```

Script sẽ tự gán `external_shipment_id` cho shipment nếu chưa có.

### 6.2. Test Happy Flow (Giao thành công)

Test từng bước, sau mỗi event mở browser kiểm tra DP Shipment:

```python
ghn_step_by_step("SHIP-DP-2026-00001", flow="happy")
```

Chi tiết từng event trong happy flow:

| # | Event | GHN raw status | DP Shipment status | Document tạo ra | Kiểm tra trên UI |
|---|-------|---------------|-------------------|-----------------|-------------------|
| 1 | `picked_up` | `ready_to_pick` | Partner Received | **Stock Entry** (transfer out) | Tab Tracking → SE link. Stock giảm ở kho xuất |
| 2 | `picked_up` | `picking` | Partner Received | — (SE đã có) | Tracking Status Raw = "picking" |
| 3 | `picked_up` | `picked` | Partner Received | — | — |
| 4 | `picked_up` | `storing` | Partner Received | — | — |
| 5 | `in_transit` | `transporting` | In Transit | — | Status đổi sang In Transit |
| 6 | `in_transit` | `sorting` | In Transit | — | — |
| 7 | `in_transit` | `delivering` | In Transit | — | Tracking Info = "Dang giao hang" |
| 8 | `delivered` | `delivered` | Delivered | **DN** + **SI** + **PE** (nếu COD) | Tab Tracking → DN/SI/PE links. SO delivered_qty tăng |

Mỗi bước script dừng lại, hiển thị trạng thái hiện tại, bấm **Enter** để tiếp:

```
  [GHN] ready_to_pick            -> Cho lay hang

  --- SHIP-DP-2026-00001 ---
  Status:             Partner Received
  Fulfillment:        Transferred
  MR:                 MAT-MR-2026-00001
  SE (Transfer Out):  STE-00001
  DN:                 -
  Items:
    ITEM-001: qty=10, picked=10, status=Picked

  [1/8] Press Enter for next event ('q' to stop):
```

### 6.3. Test Return Flow (Giao thất bại → Hoàn hàng)

```python
ghn_step_by_step("SHIP-DP-2026-00001", flow="return")
```

| # | Event | GHN raw status | DP Shipment status | Document tạo ra | Kiểm tra trên UI |
|---|-------|---------------|-------------------|-----------------|-------------------|
| 1-4 | `picked_up` | ready → storing | Partner Received | **SE** (transfer out) | Stock di chuyển |
| 5-6 | `in_transit` | transporting, delivering | In Transit | — | — |
| 7 | `delivery_failed` | `delivery_fail` | Delivery Failed | — | Status đổi, **không tạo DN** |
| 8 | `returning` | `waiting_to_return` | Returning | — | Hàng đang trên đường hoàn |
| 9-10 | `returning` | return, return_transporting | Returning | — | — |
| 11 | `returned` | `returned` | Returned | **Return SE** | Stock hoàn về kho gốc. Kiểm tra: kho xuất có stock trở lại |

### 6.4. Test Cancel Flow (Hủy đơn)

```python
ghn_step_by_step("SHIP-DP-2026-00001", flow="cancel")
```

| # | Event | GHN raw status | DP Shipment status | Document tạo ra | Kiểm tra trên UI |
|---|-------|---------------|-------------------|-----------------|-------------------|
| 1 | `picked_up` | `ready_to_pick` | Partner Received | **SE** | — |
| 2 | `cancelled` | `cancel` | Cancelled | — | Status = Cancelled. Lưu ý: MR/SE không auto cancel khi webhook cancel, chỉ khi user bấm Cancel trên UI |

### 6.5. Test Lost Flow (Mất hàng)

```python
ghn_step_by_step("SHIP-DP-2026-00001", flow="lost")
```

| # | Event | GHN raw status | DP Shipment status | Document tạo ra | Kiểm tra trên UI |
|---|-------|---------------|-------------------|-----------------|-------------------|
| 1-4 | `picked_up` | ready → storing | Partner Received | **SE** | Stock di chuyển |
| 5 | `in_transit` | `transporting` | In Transit | — | — |
| 6 | `lost` | `lost` | Lost | **Write-off SE** | Stock trừ khỏi partner warehouse |

### 6.6. Test Viettel Post

Tương tự GHN, thay `ghn_` bằng `vtp_`:

```python
# Happy flow
vtp_step_by_step("SHIP-DP-2026-00002", flow="happy")

# Return flow
vtp_step_by_step("SHIP-DP-2026-00002", flow="return")
```

Bảng event Viettel Post (happy flow):

| # | Event | VTP status code | Mô tả |
|---|-------|-----------------|-------|
| 1 | `picked_up` | 100 | Mới tạo đơn |
| 2 | `picked_up` | 102 | Đã duyệt |
| 3 | `picked_up` | 104 | Nhân viên đã nhận hàng → **SE created** |
| 4 | `picked_up` | 105 | Đã nhập kho khai thác |
| 5 | `in_transit` | 200 | Đang vận chuyển |
| 6 | `in_transit` | 201 | Đang giao hàng |
| 7 | `delivered` | 500 | Giao thành công → **DN + SI + PE** |
| 8 | `delivered` | 503 | Đã đối soát trả tiền |

### 6.7. Fire 1 event đơn lẻ

Khi chỉ muốn test 1 event cụ thể, không cần chạy cả flow:

```python
# GHN — dùng raw status string
ghn_event("GHN-TEST-001", "delivered", "Da giao thanh cong")
ghn_event("GHN-TEST-001", "returned", "Da hoan hang")
ghn_event("GHN-TEST-001", "cancel", "Nguoi gui huy don")

# VTP — dùng status code (số)
vtp_event("VTP-TEST-001", 500, "Giao thanh cong")
vtp_event("VTP-TEST-001", 301, "Chuyen hoan thanh cong")
vtp_event("VTP-TEST-001", -108, "Huy don hang")
```

### 6.8. Chạy nhanh full flow (không dừng)

Chạy tất cả events liên tục, không dừng giữa:

```python
ghn_full_flow("SHIP-DP-2026-00001", flow="happy")
ghn_full_flow("SHIP-DP-2026-00001", flow="return")
vtp_full_flow("SHIP-DP-2026-00002", flow="happy")
```

### 6.9. Curl commands (khi bench đang chạy)

In ra tất cả curl commands để test qua HTTP:

```python
print_curl_commands("GHN-TEST-001", "VTP-TEST-001", "http://localhost:8000")
```

Ví dụ output:

```bash
# GHN — picked_up
curl -s -X POST "http://localhost:8000/api/method/delivery_partner.api.webhook.handle?partner=GHN" \
  -H "Content-Type: application/json" \
  -d '{"OrderCode": "GHN-TEST-001", "Status": "picked", "Description": "Da lay hang"}'

# VTP — delivered (status code 500)
curl -s -X POST "http://localhost:8000/api/method/delivery_partner.api.webhook.handle?partner=Viettel+Post" \
  -H "Content-Type: application/json" \
  -d '{"ORDER_NUMBER": "VTP-TEST-001", "ORDER_STATUS": 500, "NOTE": "Giao thanh cong"}'
```

### 6.10. Lưu ý khi test

1. **DP Shipment phải ở docstatus = 1** (đã Submit). Draft shipment không nhận webhook.
2. **Mỗi shipment chỉ test 1 flow.** Sau khi Delivered/Returned/Lost, tạo shipment mới để test flow khác.
3. **Script tự gán `external_shipment_id`** = `TEST-<shipment_name>` nếu chưa có.
4. **Step-by-step mode** cho phép mở browser kiểm tra DP Shipment, Stock Ledger, SO status sau mỗi event.
5. **Signature verification bị skip** trong simulate mode (script override `verify_signature = True`).

---

## 7. Permissions

| Role | Quyền trên DP Shipment |
|------|----------------------|
| Stock Manager | Full (create, read, write, submit, cancel, delete) |
| System Manager | Full |

Setup API (setup_carriers, list_carriers) yêu cầu **System Manager**.

---

## 8. Troubleshooting

### Pickup address "Not found" khi chọn
Kiểm tra Address có Dynamic Link đúng: Link Type = `Warehouse` (hoặc `Company`), Link Name = tên warehouse/company.

### "All items must ship from the same warehouse"
DP Shipment chỉ cho phép 1 source warehouse. Tách items từ nhiều kho thành nhiều shipments.

### Webhook không cập nhật status
1. DP Partner có `is_active = 1`?
2. Status mapping có raw status đúng? Xem Error Log.
3. DP Shipment có `external_shipment_id` khớp payload?

### Test Credentials báo lỗi token
- GHN: token từ `khachhang.ghn.vn` là production. Nếu `Use Sandbox` bật → dùng sandbox URL nhưng token production → sai. Tắt `Use Sandbox` hoặc lấy token sandbox riêng.
- VTP: tài khoản Development cần được VTP kích hoạt trước.
