---
title: Delivery Partner — Tài liệu kỹ thuật
layout: default
parent: Tài liệu kỹ thuật
nav_order: 7
---

# Delivery Partner — Tài liệu kỹ thuật

## 1. Kiến trúc tổng quan

```
delivery_partner (standalone)
├── Doctypes: DP Partner, DP Partner Account, DP Shipment, DP Shipment Item,
│             DP Shipment Parcel, DP Shipment Parcel Template,
│             DP Account Param, DP Status Mapping
├── API Client: base.py (BaseAPIClient) + ghn.py / viettelpost.py / ghtk.py — gọi API carrier
├── Webhook Handlers: base.py, ghn.py, viettelpost.py, ghtk.py, generic.py
├── Webhook Endpoint: api/webhook.py (single entry point)
├── Setup Scripts: setup_all_carriers.py, simulate_webhooks.py
└── Setup API: api/setup.py (System Manager only)
```

App này **không phụ thuộc** vào ERPNext ngoài Frappe framework. Không import module ERPNext nào.
Việc tạo doc ERP (MR/SE/DN/SI/PE) là của app `delivery_partner_extension_for_cobegroup`, hook vào
doc events của DP Shipment.

---

## 2. Cấu trúc thư mục

```
delivery_partner/
├── delivery_partner/
│   ├── delivery_partner/
│   │   ├── doctype/
│   │   │   ├── dp_shipment/
│   │   │   │   ├── dp_shipment.json          # DocType definition (5 tabs)
│   │   │   │   ├── dp_shipment.py            # Controller: validate, submit, handle_event
│   │   │   │   └── dp_shipment.js            # Form: address/contact fetch, auto-calc parcel
│   │   │   ├── dp_shipment_item/             # Child table
│   │   │   ├── dp_shipment_parcel/           # Child table
│   │   │   ├── dp_shipment_parcel_template/  # Mẫu kiện hàng
│   │   │   ├── dp_partner/                   # ĐVVC config + status mappings
│   │   │   ├── dp_partner_account/           # Credentials + warehouse + COD account
│   │   │   ├── dp_account_param/             # Child table (extra API params)
│   │   │   └── dp_status_mapping/            # Child table (carrier status → event)
│   │   └── page/                             # (empty)
│   ├── api/
│   │   ├── webhook.py                        # POST endpoint nhận webhook từ carrier
│   │   └── setup.py                          # API setup carriers (System Manager)
│   ├── api_client/
│   │   ├── base.py                           # BaseAPIClient (HTTP, auth, token cache)
│   │   ├── ghn.py                            # GhnClient
│   │   ├── viettelpost.py                    # ViettelpostClient
│   │   └── ghtk.py                           # GhtkClient
│   ├── handlers/
│   │   ├── base.py                           # BaseWebhookHandler (abstract)
│   │   ├── ghn.py                            # GHN handler (Token header, OrderCode)
│   │   ├── viettelpost.py                    # VTP handler (X-VTP-Token, ORDER_NUMBER)
│   │   ├── ghtk.py                           # GHTK handler (X-Client-Source)
│   │   └── generic.py                        # Fallback handler
│   ├── hooks.py                              # CHỈ có app metadata (xem §9)
│   └── scripts/
│       ├── setup_all_carriers.py             # Setup 9 carriers + status mappings
│       ├── setup_ghn_test.py                 # GHN-specific setup (legacy)
│       ├── simulate_webhooks.py              # Test webhook simulation
│       └── test_flow_v2.py                   # Test flow helper
```

---

## 3. Doctypes — Data Model

### 3.1. DP Partner

Cấu hình 1 đơn vị vận chuyển.

```
DP Partner
├── partner_name (PK, unique)
├── partner_code (string, VD: "ghn")
├── is_active (bool)
├── auth_method (Select: Static Token / Token Exchange / Signature)
├── base_url (string, production API)
├── sandbox_url (string, test API)
├── token_header_name (string, VD: "Token")
├── token_endpoint (string, endpoint lấy token cho Token Exchange)
├── token_ttl (Int, giây — TTL cache token)
├── webhook_handler (string, Python class path)
├── webhook_secret (Password, verify webhook signature)
├── notes (Text)
└── status_mappings[] → DP Status Mapping (child table)
      ├── carrier_status (string, raw status từ carrier)
      ├── normalized_event (Select: 1 trong 8 events cố định)
      └── description (string)
```

**8 Normalized Events:**

| Event | Ý nghĩa | DP Shipment Status |
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

Tài khoản kết nối API cụ thể.

```
DP Partner Account
├── account_name (PK, unique)
├── partner → DP Partner
├── is_default (bool)
├── use_sandbox (bool)
├── warehouse → Warehouse (kho ảo carrier, reqd)
├── cod_account → Account (tài khoản ảo COD receivable)
├── Credentials:
│   ├── api_token (Password, Static Token)
│   ├── username / password (Token Exchange)
│   ├── api_key / api_secret (Signature)
│   └── cached_token / token_expiry (auto-managed)
├── test_credentials (Button)
└── extra_params[] → DP Account Param (child table)
      ├── param_key (string)
      ├── param_value (string)
      └── send_as (Select: Header / Query Param / Body)
```

### 3.3. DP Shipment

Vận đơn chính. Submittable doctype. **5 tabs** (không có Tab Charges).

```
DP Shipment (autoname: SHIP-DP-{YYYY}-{#####})
├── Tab Shipment:
│   ├── partner → DP Partner
│   ├── partner_account → DP Partner Account
│   ├── shipment_items[] → DP Shipment Item
│   ├── value_of_goods (Currency)
│   ├── cod_amount (Currency)
│   └── description_of_content (string)
├── Tab Pickup:
│   ├── pickup_from_type (Select: Company/Warehouse/Customer/Supplier)
│   ├── pickup_company / pickup_warehouse / pickup_customer / pickup_supplier
│   ├── pickup_address_name → Address
│   ├── pickup_address (display, read-only)
│   ├── pickup_contact_name → Contact / pickup_contact_person → User
│   ├── pickup_contact (display: "Name | Phone")
│   └── pickup_contact_email
├── Tab Delivery:
│   ├── delivery_to_type (Select: Company/Customer/Supplier)
│   ├── delivery_company / delivery_customer / delivery_supplier
│   ├── delivery_address_name → Address
│   ├── delivery_address (display)
│   ├── delivery_contact_name → Contact
│   ├── delivery_contact (display)
│   └── delivery_contact_email
├── Tab Parcels & Details (tab_parcels):
│   ├── shipment_parcel[] → DP Shipment Parcel
│   ├── parcel_template → DP Shipment Parcel Template + add_template (Button)
│   ├── total_weight (Float, auto-calc = Σ weight × count)
│   ├── pickup_date (Date)
│   ├── pickup_from / pickup_to (Time)
│   ├── shipment_type, pickup_type
│   └── pallets (bool)
└── Tab Tracking:
    ├── status (Select — lifecycle bên dưới)
    ├── external_shipment_id (string, mã vận đơn từ carrier)
    ├── tracking_status (string, raw status)
    ├── tracking_status_info (string)
    └── tracking_url (string)
```

**Status lifecycle thực tế:**

```
Draft → Submitted → Partner Received → In Transit → Delivered
                                                  → Delivery Failed → Returning → Returned
                                                                                → Lost
        → Cancelled (on_cancel hoặc webhook event "cancelled")
```

> `Booked` có trong options Select nhưng **không có code nào set** — app gốc không tự gọi
> API tạo đơn khi submit. `on_submit` chỉ `db_set("status", "Submitted")`.

### 3.4. DP Shipment Item (child table)

```
DP Shipment Item
├── item_code → Item
├── item_name (fetch)
├── qty (float)
└── uom → UOM (fetch)
```

> Không có field weight/dimensions ở đây. Các field `custom_unit_*` mà JS đọc là **custom field
> do app extension thêm**, không thuộc app gốc.

### 3.5. DP Shipment Parcel (child table)

```
DP Shipment Parcel
├── length (Int, cm)
├── width (Int, cm)
├── height (Int, cm)
├── weight (Float, kg)
└── count (Int)
```

(DP Shipment Parcel Template có cấu trúc tương tự — `length/width/height` Int, `weight` Float.)

---

## 4. API Client Framework

### 4.1. BaseAPIClient (`api_client/base.py`)

Base class cho tất cả carrier API integrations. Các client cụ thể (`GhnClient`, `ViettelpostClient`,
`GhtkClient`) kế thừa và override.

```python
class BaseAPIClient:
    REQUEST_TIMEOUT = 15

    def __init__(self, account_name):
        # Load DP Partner Account + DP Partner config

    @property
    def base_url(self) -> str:
        # sandbox vs production theo account.use_sandbox

    def get_auth_headers(self) -> dict:
        # Static Token   : {token_header_name: api_token}
        # Token Exchange : {"Authorization": f"Bearer {token}"}  (token cache)
        # Signature      : {}  → ký per-request trong _sign_request()

    def get_extra_headers() / get_extra_query_params() / get_extra_body_params() -> dict:
        # đọc extra_params theo send_as

    def _get_or_refresh_token(self) -> str:
        # trả token cache còn hạn, hoặc gọi _do_token_exchange()

    def _do_token_exchange(self) -> str:
        # override trong subclass (mặc định throw NotImplemented)

    def _sign_request(self, method, endpoint, kwargs) -> dict:
        # override cho auth Signature

    def request(self, method, endpoint, **kwargs) -> dict:
        # HTTP request: auth headers + extra params + sign (nếu Signature) → JSON

    def test_connection(self) -> dict:
        # override trong subclass — {success, message}
```

> **Lưu ý tên method:** là `get_auth_headers()` (public, không underscore) và
> `_get_or_refresh_token()` / `_do_token_exchange()`. **Không** có `_get_auth_headers()` hay
> `_refresh_token()`. Token Exchange luôn gửi `Authorization: Bearer <token>` (không dùng
> `token_header_name`).

**Auth Methods:**

| Method | Flow | Carriers |
|--------|------|----------|
| Static Token | Token cố định gửi trong header | GHN, GHTK, Best Express, Ahamove |
| Token Exchange | Login → nhận token (cached theo `token_ttl`) → gửi `Bearer` | Viettel Post, Ninja Van, GrabExpress |
| Signature | Sign body + secret → gửi signature | J&T Express, SPX |

**Carrier client methods (`api_client/ghn.py`, `viettelpost.py`, `ghtk.py`):**
`create_shipment`, `cancel_shipment`, `track_shipment` (GHN: `get_shipment_detail`), `calculate_fee`,
`get_services`, `get_provinces`, `get_districts`, `get_wards` (GHTK ít hơn).

### 4.2. Extra Params

`DP Account Param` rows được inject vào mỗi request:

| send_as | Vị trí |
|---------|--------|
| Header | HTTP Header |
| Query Param | URL query parameter |
| Body | Request body (JSON) |

---

## 5. Webhook System

### 5.1. Entry Point (`api/webhook.py`)

Single endpoint cho tất cả carriers:

```
POST /api/method/delivery_partner.api.webhook.handle?partner=<TenPartner>
```

- `allow_guest=True` (carrier gọi không có Frappe session)
- Luôn trả HTTP 200 (tránh carrier retry)
- Set user = Administrator để có permission tạo/update docs
- Lỗi nội bộ log vào Error Log

### 5.2. BaseWebhookHandler (`handlers/base.py`)

```python
class BaseWebhookHandler:
    def __init__(self, request):
        self.request = request
        self.payload = parse JSON from request.data

    # --- Subclass phải implement ---
    def verify_signature(self) -> bool
    def extract_shipment_id(self) -> str      # external_shipment_id
    def extract_raw_status(self) -> str        # raw status từ carrier payload
    def extract_status_info(self) -> str       # human-readable note (optional)

    # --- Common flow ---
    def process(self):
        1. verify_signature()  → throw AuthenticationError nếu sai
        2. extract external_shipment_id  (throw nếu rỗng)
        3. extract raw_status            (log + return nếu rỗng)
        4. Lookup DP Shipment by external_shipment_id
        5. _normalize_status(): query DP Status Mapping
           → carrier_status → normalized_event
        6. shipment.handle_event(event, raw_status, info)
```

### 5.3. Carrier Handlers

**GHN** (`handlers/ghn.py`):
```
Payload: {"OrderCode": "...", "Status": "...", "Description": "..."}
Verify : hmac.compare_digest(request.headers["Token"], webhook_secret)  — so sánh hằng-thời-gian
         (nếu chưa cấu hình secret → log warning + bỏ qua verify)
Status : payload["Status"].lower()
```

**Viettel Post** (`handlers/viettelpost.py`):
```
Payload: {"ORDER_NUMBER": "...", "ORDER_STATUS": 500, "NOTE": "..."}
Verify : request.headers["X-VTP-Token"] == webhook_secret
         (nếu chưa cấu hình secret → bỏ qua verify)
Status : str(payload["ORDER_STATUS"])
```

**GHTK** (`handlers/ghtk.py`):
```
Payload: {"label_id": "...", "partner_id": "...", "status_id": 5, "reason": "..."}
Verify : request.headers["X-Client-Source"] == webhook_secret
         (so sánh chuỗi thường, KHÔNG phải HMAC; nếu chưa cấu hình secret → bỏ qua verify)
Status : str(payload["status_id"])
ID     : payload["partner_id"] hoặc payload["label_id"]
```

> Cả 3 handler trên đều **bỏ qua verify nếu DP Partner chưa cấu hình `webhook_secret`**
> (`return True` + log warning). Chỉ GHN dùng `hmac.compare_digest` (so sánh hằng thời gian);
> VTP/GHTK so sánh `==` thường.

**Generic** (`handlers/generic.py`):
```
Fallback khi DP Partner dùng GenericWebhookHandler.
Payload: {"shipment_id": "...", "status": "...", "info": "..."}
Verify : không verify (chỉ dùng mạng nội bộ/tin cậy)
```

> `GenericWebhookHandler` implement đủ interface của base (`verify_signature`,
> `extract_shipment_id`, `extract_raw_status`, `extract_status_info`) — dùng được cho các
> carrier fallback (JT/NJV/BEST/AHAMOVE/SPX/GRAB).

### 5.4. Status Normalization (DB-driven)

```sql
SELECT normalized_event
FROM `tabDP Status Mapping`
WHERE parent = %(partner_name)s
  AND parenttype = 'DP Partner'
  AND carrier_status = %(raw_status)s
```

Thêm carrier mới chỉ cần thêm rows vào DP Status Mapping — không sửa code.
Raw status không có trong mapping → log warning + bỏ qua.

### 5.5. handle_event (`dp_shipment.py`)

```python
def handle_event(self, event, raw_status="", info=""):
    self.db_set("tracking_status", raw_status)
    if info:
        self.db_set("tracking_status_info", info)
    new_status = self.EVENT_STATUS_MAP.get(event)   # "picked_up" → "Partner Received"
    if new_status:
        self.db_set("status", new_status)
    self.add_comment("Info", ...)  # Ghi log
```

`db_set("status", ...)` trigger Frappe `on_update` → extension app hooks react (tạo SE/DN/SI/PE).

---

## 6. DP Shipment Controller (`dp_shipment.py`)

### 6.1. Validation (trước save)

```python
def validate(self):
    self._validate_parcel_weights()   # mỗi parcel weight > 0
    self._validate_pickup_time()      # pickup_to > pickup_from
    self._validate_items()            # mỗi item qty > 0
    self._set_total_weight()          # Σ(weight × count)
    if self.is_new():
        self.status = "Draft"
```

### 6.2. Submit

```python
def on_submit(self):
    assert shipment_parcel not empty
    assert shipment_items not empty
    assert value_of_goods > 0
    self._validate_single_warehouse()   # tất cả items cùng 1 warehouse
    self.db_set("status", "Submitted")   # KHÔNG gọi API carrier
```

### 6.3. Cancel

```python
def before_cancel(self):
    self._cancel_on_carrier()   # huỷ đơn bên ĐVVC TRƯỚC khi huỷ nội bộ

def on_cancel(self):
    self.db_set("status", "Cancelled")
```

`_cancel_on_carrier`: nếu có `external_shipment_id` → `get_client(partner_account).cancel_order_for_shipment(self)`.
Chạy trong `before_cancel` (trước `on_cancel` + trước `before_cancel` của extension) nên **ĐVVC từ chối
huỷ → throw → abort sạch toàn bộ** (không huỷ MR/kho/nội bộ), giữ ERP ↔ ĐVVC khớp. Carrier chưa có
method `cancel_order_for_shipment` (VD chưa impl GHN/GHTK) → chỉ cảnh báo, không chặn.

### 6.4. Single Warehouse Validation

```python
def _validate_single_warehouse(self):
    # Lấy warehouse từ item.custom_warehouse hoặc doc.custom_pickup_warehouse
    # (các custom field này do extension thêm; standalone thường rỗng → bỏ qua)
    # Nếu > 1 unique warehouse → throw yêu cầu tách shipment
```

---

## 7. Client-side JS (`dp_shipment.js`)

### 7.1. Address/Contact Auto-fetch

```
_get_party(frm, side)         → {doctype, name} từ pickup_from_type/delivery_to_type
_refresh_link_queries(frm)    → set_query cho address_name + contact_name
_fetch_party_address(frm, side, doctype, name) → get_default_address() → set address_name
_fetch_party_contact(frm, side, doctype, name) → get_default_contact() → set contact_name
_load_address_display(frm, side)  → frappe.db.get_doc("Address") → format display
_load_contact_display(frm, side)  → frappe.db.get_doc("Contact") → format "Name | Phone"
```

### 7.2. Auto-calculate Parcel

Nút "Auto-calculate Parcel" (chỉ hiện khi Draft + có items):

```javascript
function _auto_calc_parcel(frm):
    total_weight = SUM(custom_unit_weight × qty)
    max_length   = MAX(custom_unit_length)
    max_width    = MAX(custom_unit_width)
    sum_height   = SUM(custom_unit_height × qty)
    → Clear parcels, thêm 1 parcel gợi ý
```

> `custom_unit_*` chỉ có dữ liệu khi cài app extension (custom field trên DP Shipment Item).

### 7.3. Item Dimension Fetch

Child table event `DP Shipment Item.item_code`:

```javascript
frappe.db.get_value("Item", item_code, [
    "weight_per_unit", "custom_parcel_length", "custom_parcel_width", "custom_parcel_height"
]) → set custom_unit_weight/length/width/height
```

---

## 8. Setup Scripts

### 8.1. setup_all_carriers.py

Tạo DP Partner + Warehouse + Account cho 9 carriers (idempotent).

```python
CARRIERS = {
    "GHN": { partner_name, auth_method, base_url, sandbox_url, webhook_handler, status_mappings[] },
    "VTP": {...},
    ...   # 9 carrier: GHN, VTP, GHTK, JT, NJV, BEST, AHAMOVE, SPX, GRAB
}

def setup(carriers=None):
    for key in carriers:
        _ensure_warehouse()      # Kho <Carrier> - {abbr}
        _ensure_partner()        # DP Partner + status mappings (upsert)
        _ensure_account()        # DP Partner Account default

def list_carriers():
    # liệt kê carrier + số mapping
```

### 8.2. simulate_webhooks.py

Test webhook không cần carrier thật (gọi handler trực tiếp, bypass HTTP).

```python
handler.verify_signature = lambda: True   # skip verify
# Predefined flows: GHN_HAPPY_FLOW / GHN_RETURN_FLOW / GHN_CANCEL_FLOW / GHN_LOST_FLOW
#                   VTP_HAPPY_FLOW / VTP_RETURN_FLOW
# API: ghn_step_by_step / vtp_step_by_step / ghn_event / vtp_event
#      ghn_full_flow / vtp_full_flow / print_curl_commands
```

> Phần `_print_shipment_state` in các field `custom_*` (MR/SE/DN/Fulfillment) — chỉ có dữ liệu
> khi cài app extension; chạy standalone sẽ hiển thị `-`.

### 8.3. API endpoint (`api/setup.py`)

```python
@frappe.whitelist()
def setup_carriers(carriers=None):
    # Require "System Manager" role (else throw PermissionError)
    # Gọi setup_all_carriers.setup()

@frappe.whitelist()
def list_carriers():
    # Require "System Manager"
    # Return [{key, name, auth_method, mappings}]
```

---

## 9. hooks.py & Permissions

### 9.1. hooks.py

`hooks.py` **chỉ chứa app metadata** (app_name, app_title, app_publisher, ...).
**Không** có `doc_events`, `scheduler_events`, `override_whitelisted_methods`, hay `fixtures`.
Webhook/setup được whitelist trực tiếp trên function (`@frappe.whitelist`), không qua hooks.

> Phần phản ứng `on_update` (tạo SE/DN/SI/PE) được đăng ký trong `hooks.py` của **app extension**,
> không phải app này.

### 9.2. Permissions

| DocType | System Manager | Stock Manager |
|---------|---------------|---------------|
| DP Shipment | Full (create/read/write/submit/cancel/delete) | Full (create/read/write) |

Setup API yêu cầu **System Manager**.

---

## 10. Thêm carrier mới

### 10.1. Chỉ cần data (dùng GenericWebhookHandler)

1. Thêm entry vào `CARRIERS` dict trong `setup_all_carriers.py`
2. Chạy setup script
3. Điền credentials vào DP Partner Account

> GenericWebhookHandler kỳ vọng payload `{shipment_id, status, info}` và không verify chữ ký —
> nếu carrier gửi format khác hoặc cần xác thực, tạo custom handler (§10.2).

### 10.2. Cần custom handler

1. Tạo file `handlers/<carrier>.py`:

```python
from delivery_partner.handlers.base import BaseWebhookHandler

class MyCarrierHandler(BaseWebhookHandler):
    def verify_signature(self) -> bool:
        token = self.request.headers.get("X-Token", "")
        secret = self._get_partner_secret_for_shipment(self.extract_shipment_id())
        return token == secret

    def extract_shipment_id(self) -> str:
        return self.payload.get("order_id", "")

    def extract_raw_status(self) -> str:
        return str(self.payload.get("status", ""))

    def extract_status_info(self) -> str:
        return self.payload.get("message", "")
```

2. Set `webhook_handler` trên DP Partner = `delivery_partner.handlers.<carrier>.MyCarrierHandler`
3. Thêm status mappings vào DP Partner

### 10.3. Cần custom API client

1. Tạo file `api_client/<carrier>.py`:

```python
from delivery_partner.api_client.base import BaseAPIClient

class MyCarrierClient(BaseAPIClient):
    def create_shipment(self, payload: dict) -> dict:
        return self.request("POST", "/orders/create", json=payload)

    def cancel_shipment(self, order_id: str) -> dict:
        return self.request("POST", "/orders/cancel", json={"order_id": order_id})
```

(Theo đúng tên method của các client hiện có: `create_shipment` / `cancel_shipment` /
`track_shipment` / `calculate_fee`.)

---

## 11. Dependencies

| Package | Mục đích |
|---------|----------|
| `frappe` | Framework core |
| `requests` | HTTP client (API calls) |

Không phụ thuộc `erpnext` — app hoạt động trên bất kỳ Frappe site nào.

---

## Phụ lục A — Cài đặt & Carriers hỗ trợ

### A.1. Cài đặt

```bash
bench get-app https://github.com/CobeGroup/delivery_partner.git
bench --site <site> install-app delivery_partner
bench --site <site> migrate
bench build --app delivery_partner
```

### A.2. Setup carriers (1 lần)

```bash
# Tất cả 9 carriers
bench --site <site> execute delivery_partner.scripts.setup_all_carriers.setup

# Chỉ vài carrier
bench --site <site> execute delivery_partner.scripts.setup_all_carriers.setup \
  --kwargs '{"carriers": ["GHN", "VTP", "GHTK"]}'
```

Hoặc qua API (login System Manager):

```python
frappe.call({ method: "delivery_partner.api.setup.setup_carriers", callback: (r) => console.log(r) });
```

Script **idempotent** — chạy lại không tạo trùng, chỉ thêm status mapping mới. Mỗi carrier tạo:
DP Partner (auth + status mappings + webhook handler) · Warehouse ảo · DP Partner Account mặc định.

### A.3. Ma trận carriers

| Key | Tên | Auth | Status Mappings | API client tạo đơn |
|-----|-----|------|-----------------|--------------------|
| GHN | Giao Hàng Nhanh | Static Token | 22 | ✅ `ghn.py` |
| VTP | Viettel Post | Token Exchange | 27 | ✅ `viettelpost.py` |
| GHTK | Giao Hàng Tiết Kiệm | Static Token | 20 | ✅ `ghtk.py` |
| JT | J&T Express | Signature | 13 | — (Generic webhook) |
| NJV | Ninja Van | Token Exchange | 16 | — |
| BEST | Best Express | Static Token | 12 | — |
| AHAMOVE | Ahamove | Static Token | 8 | — |
| SPX | Shopee Express | Signature | 11 | — |
| GRAB | GrabExpress | Token Exchange | 8 | — |

> Cả 9 carrier đều có **status mapping + webhook**. Chỉ **GHN / VTP / GHTK** có **API client gọi tạo đơn**.
> 6 carrier còn lại nhận webhook qua `GenericWebhookHandler`, chưa có client tạo đơn.

### A.4. Điền credentials theo Auth Method

| Auth Method | Field cần điền |
|---|---|
| Static Token | `API Token` |
| Token Exchange | `Username` + `Password` |
| Signature | `API Key` + `API Secret` |

Extra Params nếu carrier cần (VD GHN: `ShopId`, `send_as = Header`). Bấm **Test Credentials** để xác nhận.

---

## Phụ lục B — Test không cần đơn thật (simulate_webhooks)

Chuẩn bị: tạo 1 DP Shipment + **Submit**, ghi tên (VD `SHIP-DP-2026-00001`), mở console:

```python
bench --site <site> console
from delivery_partner.scripts.simulate_webhooks import *
```

Script tự gán `external_shipment_id = TEST-<name>` nếu chưa có, và override `verify_signature` = bỏ qua.

### B.1. GHN — các flow (cột status là kết quả **app gốc**)

```python
ghn_step_by_step("SHIP-DP-2026-00001", flow="happy")   # dừng từng bước, Enter để tiếp, 'q' dừng
ghn_full_flow("SHIP-DP-2026-00001", flow="happy")        # chạy nhanh không dừng
```

| Flow | Chuỗi raw status GHN → DP Shipment status |
|---|---|
| `happy` | ready_to_pick / picking / picked / storing → **Partner Received**; transporting / sorting / delivering → **In Transit**; delivered → **Delivered** |
| `return` | … → delivery_fail → **Delivery Failed** → waiting_to_return / return / return_transporting → **Returning** → returned → **Returned** |
| `cancel` | ready_to_pick → **Partner Received**; cancel → **Cancelled** |
| `lost` | … → transporting → **In Transit**; lost → **Lost** |

> **MR / SE / DN / PE** chỉ tạo khi cài **app extension**; chạy app gốc đứng một mình → các dòng này hiện `-`.

### B.2. VTP — flow happy

```python
vtp_full_flow("SHIP-DP-2026-00002", flow="happy")
```

| VTP status | Event | Mô tả |
|---|---|---|
| 100 / 102 / 104 / 105 | `picked_up` | Mới tạo → duyệt → nhận hàng → nhập kho → **Partner Received** |
| 200 / 201 | `in_transit` | Đang vận chuyển / giao → **In Transit** |
| 500 / 503 | `delivered` | Giao thành công / đối soát → **Delivered** |

### B.3. Fire 1 event / curl

```python
ghn_event("GHN-TEST-001", "delivered", "Da giao thanh cong")
vtp_event("VTP-TEST-001", 500, "Giao thanh cong")   # VTP dùng status code (số)
print_curl_commands("GHN-TEST-001", "VTP-TEST-001", "http://localhost:8000")
```

```bash
curl -s -X POST "http://localhost:8000/api/method/delivery_partner.api.webhook.handle?partner=GHN" \
  -H "Content-Type: application/json" \
  -d '{"OrderCode": "GHN-TEST-001", "Status": "picked", "Description": "Da lay hang"}'
```

**Lưu ý:** shipment phải `docstatus = 1`; mỗi shipment chỉ test 1 flow (sau Delivered/Returned/Lost tạo cái mới);
chỉ GHN + VTP có flow giả lập sẵn; signature bị skip trong simulate mode.

### B.4. URL webhook theo carrier

```
POST https://<domain>/api/method/delivery_partner.api.webhook.handle?partner=<TenPartner>
```

| Carrier | `?partner=` | Carrier | `?partner=` |
|---|---|---|---|
| GHN | `GHN` | Ninja Van | `Ninja+Van` |
| Viettel Post | `Viettel+Post` | Best Express | `Best+Express` |
| GHTK | `GHTK` | Ahamove | `Ahamove` |
| J&T Express | `J%26T+Express` | Shopee Express | `Shopee+Express` |
| GrabExpress | `GrabExpress` | | |

---

## Phụ lục C — Troubleshooting

| Triệu chứng | Xử lý |
|---|---|
| Pickup address "Not found" khi chọn | Address thiếu Dynamic Link đúng: Link Type = `Warehouse`/`Company`, Link Name = tên kho/company |
| "All items must ship from the same warehouse" | DP Shipment chỉ 1 source warehouse — tách items nhiều kho thành nhiều shipment |
| Webhook không cập nhật status | DP Partner `is_active = 1`? Status mapping có raw status? `external_shipment_id` khớp payload? Xem Error Log |
| Test Credentials báo lỗi token (GHN) | Token `khachhang.ghn.vn` là production — tắt `Use Sandbox` hoặc lấy token sandbox riêng |
| Test Credentials báo lỗi token (VTP) | Tài khoản Development cần được VTP kích hoạt trước |

> Troubleshooting riêng cho tích hợp ERP (MR/SE/DN/SI/PE) xem [Lifecycle & Doc Events](Delivery_Partner-Lifecycle.html).
> Riêng Viettel Post (đẩy đơn, mã vùng, webhook, COD) xem [Viettel Post — Tham chiếu kỹ thuật](Delivery_Partner-Viettel_Post-Tech.html).
