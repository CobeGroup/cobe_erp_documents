---
title: Delivery Partner
layout: default
parent: Vận chuyển & Giao nhận
nav_order: 1
---

# Delivery Partner — Hướng dẫn sử dụng

App quản lý vận đơn và kết nối đơn vị vận chuyển (ĐVVC) Việt Nam.

> **Phạm vi app này:** `delivery_partner` chỉ lo phần **tạo vận đơn + tracking trạng thái** (pure shipping).
> Bản thân nó **không tạo** Material Request / Stock Entry / Delivery Note / Sales Invoice / Payment Entry.
> Toàn bộ phần tích hợp ERP (SO → MR → SE → DN → SI → PE) nằm ở app
> `delivery_partner_extension_for_cobegroup` — cài thêm app đó và đọc
> [Hướng dẫn Delivery Partner Extension](Delivery_Partner_Extension.md) nếu bạn cần luồng kế toán/kho.

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

Script **idempotent**: chạy lại không tạo trùng, chỉ thêm status mapping mới.

### 2.2. Carriers được hỗ trợ

| Key | Tên | Auth | Status Mappings |
|-----|-----|------|-----------------|
| GHN | Giao Hàng Nhanh | Static Token | 22 |
| VTP | Viettel Post | Token Exchange | 27 |
| GHTK | Giao Hàng Tiết Kiệm | Static Token | 20 |
| JT | J&T Express | Signature | 13 |
| NJV | Ninja Van | Token Exchange | 16 |
| BEST | Best Express | Static Token | 12 |
| AHAMOVE | Ahamove | Static Token | 8 |
| SPX | Shopee Express | Signature | 11 |
| GRAB | GrabExpress | Token Exchange | 8 |

> **Lưu ý mức độ tích hợp:** Cả 9 carrier đều có sẵn **status mapping + webhook**.
> Riêng phần **API client gọi carrier tạo đơn** hiện chỉ có cho **GHN, VTP, GHTK**
> (`api_client/ghn.py`, `viettelpost.py`, `ghtk.py`). 6 carrier còn lại nhận webhook qua
> `GenericWebhookHandler` nhưng chưa có client gọi API tạo đơn.

### 2.3. Điền API credentials

1. Vào **DP Partner Account** (VD: `GHN Default`)
2. Điền credentials tùy loại auth:
   - **Static Token**: điền `API Token`
   - **Token Exchange**: điền `Username` + `Password`
   - **Signature**: điền `API Key` + `API Secret`
3. Extra Params nếu cần (VD: GHN cần `ShopId`):
   - Thêm row: Key = `ShopId`, Value = `<id>`, Send As = `Header` (hoặc `Query Param` / `Body`)
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
| Token Header Name / Token Endpoint / Token TTL | Cấu hình cho Token Exchange |
| Webhook Handler | Python class xử lý webhook từ carrier |
| Webhook Secret | Token/secret dùng để verify chữ ký webhook |
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
| Credentials | Theo Auth Method: API Token / Username+Password / API Key+Secret |
| Cached Token / Token Expiry | Tự động quản lý cho Token Exchange (không điền tay) |
| Extra Params | Params phụ gửi kèm API (VD: ShopId) |

### 3.3. DP Shipment

Vận đơn chính (submittable). Gồm **5 tabs**:

**Tab Shipment:**
- Partner, Partner Account
- Items (child table **DP Shipment Item**: `item_code`, `item_name`, `qty`, `uom`)
- Value of Goods, COD Amount, Description of Content

> Trọng lượng / kích thước item **không** nằm ở child table này. Khi cài app extension,
> các field `custom_unit_weight/length/height` sẽ được fetch từ Item master để hỗ trợ
> nút Auto-calculate Parcel.

**Tab Pickup:**
- Pickup From: Company / **Warehouse** / Customer / Supplier
- Chọn Warehouse → auto-fill address + contact từ warehouse đó
- Chọn Company → auto-fill address + contact từ company

**Tab Delivery:**
- Deliver To: Company / Customer / Supplier
- Address, Contact (auto-fill từ party được chọn)

**Tab Parcels & Details:**
- Parcels table (length × width × height × weight × count) — `length/width/height` là số nguyên (cm), `weight` là số thực (kg)
- Nút **Auto-calculate Parcel**: tổng hợp từ items → tạo 1 parcel gợi ý (chỉ hiện khi Draft + có items)
- Pickup Date, Time (Pickup From/To), Shipment Type, Pickup Type, Pallets

**Tab Tracking:**
- Status (lifecycle bên dưới)
- External Shipment ID (mã vận đơn từ carrier)
- Tracking Status (raw), Tracking Status Info, Tracking URL

**Status lifecycle thực tế:**

```
Draft → Submitted → Partner Received → In Transit → Delivered
                                                  → Delivery Failed → Returning → Returned
                                                                                → Lost
        → Cancelled (khi Cancel doc, hoặc webhook báo huỷ)
```

> Sau `Submitted`, các trạng thái về sau (`Partner Received`, `In Transit`, `Delivered`, ...)
> đều do **webhook từ carrier** đẩy lên qua status mapping, **không** do app tự chuyển.
> (Trạng thái `Booked` có trong danh sách Select nhưng app gốc hiện không tự set.)

---

## 4. Tạo vận đơn thủ công

1. Vào **DP Shipment** → New
2. Chọn **Partner** và **Partner Account**
3. **Tab Pickup**: chọn Pickup From = `Warehouse` → chọn kho xuất → address auto-fill
4. **Tab Delivery**: chọn Deliver To = `Customer` → chọn khách → address + contact auto-fill
5. **Tab Shipment**: thêm items (item_code, qty, uom)
6. Điền **Value of Goods** (bắt buộc > 0), **COD Amount** (nếu có)
7. **Tab Parcels**: bấm **Auto-calculate Parcel** hoặc thêm thủ công (mỗi parcel cần `weight > 0`)
8. Điền **Pickup Date**
9. **Submit** → app kiểm tra (có parcel, có item, value > 0, items cùng 1 kho) → **status = `Submitted`**

> Submit **không** gọi API carrier tạo đơn. Việc tạo đơn thật qua API carrier (và điền
> `external_shipment_id`) là do tích hợp riêng / app extension thực hiện. Để webhook
> cập nhật được, `external_shipment_id` phải khớp mã đơn bên carrier.

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
  → Verify signature (token tùy carrier — xem bên dưới)
  → Extract: external_shipment_id + raw_status
  → Lookup DP Status Mapping: raw_status → normalized_event
  → Tìm DP Shipment theo external_shipment_id
  → Gọi shipment.handle_event(event, raw_status, info)
  → Status + tracking cập nhật, Comment ghi log
```

Verify chữ ký mỗi carrier:

| Carrier | Cách verify |
|---------|-------------|
| GHN | Header `Token` == DP Partner `webhook_secret` |
| Viettel Post | Header `X-VTP-Token` == `webhook_secret` |
| GHTK | Header `X-Client-Source` == `webhook_secret` |
| Generic (carrier còn lại) | Không verify — chỉ dùng trên mạng nội bộ/tin cậy |

> Với GHN / VTP / GHTK: nếu DP Partner **chưa điền `Webhook Secret`** thì handler **bỏ qua verify**
> (nhận mọi request) — tiện test nhưng kém an toàn. Điền secret để bật xác thực.

> App gốc khi nhận webhook chỉ cập nhật `status` + `tracking_status` + ghi comment.
> Nếu cài app extension, sự kiện này sẽ trigger tiếp việc tạo SE / DN / SI / PE
> (xem guide extension).

---

## 6. Test không cần đơn thật

Hệ thống cung cấp script giả lập webhook, gọi trực tiếp qua bench console mà không cần carrier thật.

### 6.1. Chuẩn bị

1. Tạo 1 DP Shipment và **Submit** (status = `Submitted`)
2. Ghi nhớ tên shipment (VD: `SHIP-DP-2026-00001`)
3. Mở bench console:

```bash
bench --site <site> console
```

```python
from delivery_partner.scripts.simulate_webhooks import *
```

Script tự gán `external_shipment_id` = `TEST-<shipment_name>` nếu chưa có, và override
`verify_signature` để bỏ qua kiểm tra chữ ký.

### 6.2. Test Happy Flow (Giao thành công)

```python
ghn_step_by_step("SHIP-DP-2026-00001", flow="happy")
```

Các event trong happy flow (cột "DP Shipment status" là kết quả của **app gốc**):

| # | Event | GHN raw status | DP Shipment status |
|---|-------|---------------|-------------------|
| 1 | `picked_up` | `ready_to_pick` | Partner Received |
| 2 | `picked_up` | `picking` | Partner Received |
| 3 | `picked_up` | `picked` | Partner Received |
| 4 | `picked_up` | `storing` | Partner Received |
| 5 | `in_transit` | `transporting` | In Transit |
| 6 | `in_transit` | `sorting` | In Transit |
| 7 | `in_transit` | `delivering` | In Transit |
| 8 | `delivered` | `delivered` | Delivered |

> **Document ERP (SE / DN / SI / PE):** chỉ được tạo khi cài app extension.
> Khi chạy **app gốc đứng một mình**, các dòng MR / SE / DN / Fulfillment trong
> output của script sẽ luôn hiển thị `-`.

Mỗi bước script dừng lại, hiển thị trạng thái hiện tại, bấm **Enter** để tiếp (`q` để dừng):

```
  [GHN] ready_to_pick            -> Cho lay hang

  --- SHIP-DP-2026-00001 ---
  Status:             Partner Received
  Fulfillment:        -      (chỉ có giá trị khi cài extension)
  MR:                 -
  SE (Transfer Out):  -
  DN:                 -
  Items:
    ITEM-001: qty=10

  [1/8] Press Enter for next event ('q' to stop):
```

### 6.3. Test Return Flow (Giao thất bại → Hoàn hàng)

```python
ghn_step_by_step("SHIP-DP-2026-00001", flow="return")
```

| # | Event | GHN raw status | DP Shipment status |
|---|-------|---------------|-------------------|
| 1-4 | `picked_up` | ready → storing | Partner Received |
| 5-6 | `in_transit` | transporting, delivering | In Transit |
| 7 | `delivery_failed` | `delivery_fail` | Delivery Failed |
| 8 | `returning` | `waiting_to_return` | Returning |
| 9-10 | `returning` | return, return_transporting | Returning |
| 11 | `returned` | `returned` | Returned |

### 6.4. Test Cancel Flow (Hủy đơn)

```python
ghn_step_by_step("SHIP-DP-2026-00001", flow="cancel")
```

| # | Event | GHN raw status | DP Shipment status |
|---|-------|---------------|-------------------|
| 1 | `picked_up` | `ready_to_pick` | Partner Received |
| 2 | `cancelled` | `cancel` | Cancelled |

### 6.5. Test Lost Flow (Mất hàng)

```python
ghn_step_by_step("SHIP-DP-2026-00001", flow="lost")
```

| # | Event | GHN raw status | DP Shipment status |
|---|-------|---------------|-------------------|
| 1-4 | `picked_up` | ready → storing | Partner Received |
| 5 | `in_transit` | `transporting` | In Transit |
| 6 | `lost` | `lost` | Lost |

### 6.6. Test Viettel Post

> 📘 Cần hướng dẫn riêng cho Viettel Post (setup API → tạo đơn → theo dõi trạng thái, kèm bảng 27 mã)?
> Xem [Viettel Post — Setup, tạo đơn & theo dõi](Delivery_Partner-Viettel_Post.md).

Tương tự GHN, thay `ghn_` bằng `vtp_`:

```python
vtp_step_by_step("SHIP-DP-2026-00002", flow="happy")
vtp_step_by_step("SHIP-DP-2026-00002", flow="return")
```

Bảng event Viettel Post (happy flow):

| # | Event | VTP status code | Mô tả |
|---|-------|-----------------|-------|
| 1 | `picked_up` | 100 | Mới tạo đơn |
| 2 | `picked_up` | 102 | Đã duyệt |
| 3 | `picked_up` | 104 | Nhân viên đã nhận hàng |
| 4 | `picked_up` | 105 | Đã nhập kho khai thác |
| 5 | `in_transit` | 200 | Đang vận chuyển |
| 6 | `in_transit` | 201 | Đang giao hàng |
| 7 | `delivered` | 500 | Giao thành công |
| 8 | `delivered` | 503 | Đã đối soát trả tiền |

### 6.7. Fire 1 event đơn lẻ

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

```python
ghn_full_flow("SHIP-DP-2026-00001", flow="happy")
ghn_full_flow("SHIP-DP-2026-00001", flow="return")
vtp_full_flow("SHIP-DP-2026-00002", flow="happy")
```

### 6.9. Curl commands (khi bench đang chạy)

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
4. **Step-by-step mode** cho phép mở browser kiểm tra DP Shipment sau mỗi event.
5. **Signature verification bị skip** trong simulate mode.
6. **Chỉ GHN + VTP có flow giả lập sẵn.** Carrier dùng GenericWebhookHandler chưa có flow test sẵn.

---

## 7. Permissions

| Role | Quyền trên DP Shipment |
|------|----------------------|
| Stock Manager | Full (create, read, write, submit, cancel, delete) |
| System Manager | Full |

Setup API (`setup_carriers`, `list_carriers`) yêu cầu **System Manager**.

---

## 8. Troubleshooting

### Pickup address "Not found" khi chọn
Kiểm tra Address có Dynamic Link đúng: Link Type = `Warehouse` (hoặc `Company`), Link Name = tên warehouse/company.

### "All items must ship from the same warehouse"
DP Shipment chỉ cho phép 1 source warehouse. Tách items từ nhiều kho thành nhiều shipments.

### Webhook không cập nhật status
1. DP Partner có `is_active = 1`?
2. Status mapping có raw status đúng? Raw status không có trong mapping sẽ bị bỏ qua (xem Error Log / log).
3. DP Shipment có `external_shipment_id` khớp payload?

### Test Credentials báo lỗi token
- GHN: token từ `khachhang.ghn.vn` là production. Nếu `Use Sandbox` bật → dùng sandbox URL nhưng token production → sai. Tắt `Use Sandbox` hoặc lấy token sandbox riêng.
- VTP: tài khoản Development cần được VTP kích hoạt trước.
