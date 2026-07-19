---
title: Viettel Post — Tham chiếu kỹ thuật
layout: default
parent: Tài liệu kỹ thuật
nav_order: 8.5
---

# Viettel Post — Tham chiếu kỹ thuật

Tài liệu **tham chiếu** cho developer / quản trị viên: cơ chế auth, đồng bộ danh mục,
payload đẩy đơn, bảng mã trạng thái, webhook, test và kế toán COD của carrier **Viettel Post (VTP)**.

> 📘 **Cần hướng dẫn thao tác từng bước (có ảnh Desk)?** Xem
> [Viettel Post — Cài đặt & sử dụng](../users/Delivery_Partner-Viettel_Post-Cai-Dat.html).
> Bản này **không lặp** phần click-by-click — chỉ đi sâu cơ chế + tham chiếu.

> **Thông tin VTP trong hệ thống:**
> - Partner name: `Viettel Post` · code: `vtp`
> - Auth: **Token Exchange** (`POST /v2/user/Login` → JWT, cache theo `token_ttl`)
> - Production: `https://partner.viettelpost.vn` · Sandbox: `https://partnerdev.viettelpost.vn`
> - Client: `api_client/viettelpost.py` · Handler: `handlers/viettelpost.py`

---

## 1. Tổng quan luồng

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontSize':'15px'},'flowchart':{'nodeSpacing':45,'rankSpacing':50}}}%%
flowchart TD
  classDef setup fill:#f9f0ff,stroke:#9254de,stroke-width:1.5px,color:#391085;
  classDef process fill:#e6f4ff,stroke:#299dd8,stroke-width:1.5px,color:#0b4a6f;
  classDef good fill:#f6ffed,stroke:#54ab78,stroke-width:1.5px,color:#135200;

  subgraph SETUP["CÀI ĐẶT (1 lần) — chi tiết ở doc Cài đặt"]
    A["Credential VTP<br/>→ Test Credentials"] --> B["Đồng bộ danh mục vùng"]
    B --> C["Đồng bộ điểm gửi"]
    C --> D["Điểm gửi mặc định<br/>+ ORDER_SERVICE"]
    D --> E["Webhook trên cổng VTP"]
  end

  subgraph DAILY["HÀNG NGÀY"]
    F["Tạo + Submit<br/>DP Shipment"] --> H["Đẩy đơn sang ĐVVC"]
    H --> I["VTP trả ORDER_NUMBER<br/>→ External Shipment ID"]
    I --> J["Webhook theo hành trình<br/>→ Status tự cập nhật"]
  end

  E --> F
  class A,B,C,D,E setup
  class F,H,I process
  class J good
```

---

## 2. Cấu hình — tham chiếu

Thao tác từng bước (có ảnh) ở [doc Cài đặt](../users/Delivery_Partner-Viettel_Post-Cai-Dat.html).
Bảng dưới tóm tắt **cơ chế + nơi lưu** cho từng phần.

| Bước | Cơ chế kỹ thuật | Nơi lưu / API |
|---|---|---|
| **Credential** | `POST /v2/user/Login` (username/password) → JWT, cache theo `token_ttl`, gửi `Authorization: Bearer <token>` các request sau | DP Partner Account · `test_connection()` |
| **Đồng bộ vùng** | Kéo `listProvinceById` / `listDistrict` / `listWards` (**API công khai, không cần token**) → chuẩn hoá tên + alias → `DP Carrier Region` (~16.000 bản ghi: 63 tỉnh · 746 huyện · 15.660 xã) | `api/region.py` · doctype **DP Carrier Region** |
| **Đồng bộ điểm gửi** | `listInventory` (cần token) → tạo **DP Pickup Point** (mã `GROUPADDRESS_ID` + `CUS_ID`) | `api/pickup_point.py` |
| **Điểm gửi mặc định** | Nếu account >1 điểm gửi mà không tick `Is Default` → đẩy đơn báo lỗi. 1 điểm gửi → auto dùng | DP Pickup Point · `get_default_pickup_point()` |
| **ORDER_SERVICE** | Mã dịch vụ **cấp theo hợp đồng account** + **đổi theo tuyến**. Đặt vào Extra Params (`send_as = Body`) | DP Account Param |
| **Webhook** | Cổng VTP bắn `POST` về endpoint; verify header `X-VTP-Token == webhook_secret` | `handlers/viettelpost.py` |

### 2.1. Mã dịch vụ (ORDER_SERVICE)

| Mã | Tên | Đặc điểm |
|---|---|---|
| `VTK` | CP tiết kiệm thỏa thuận | Rẻ nhất, ~72h |
| `STK` | Chuyển phát tiêu chuẩn | ~72h |
| `LCOD` | TMĐT Tiết Kiệm | ~72h |
| `SCN` | Chuyển phát nhanh | ~36h |
| `VCN` | CP nhanh thỏa thuận | ~36h |
| `NCOD` | TMĐT Nhanh | ~36h |
| `SHT` | Chuyển phát hỏa tốc | ~24h |
| `VHT` | Hỏa tốc thỏa thuận | ~24h |
| `PHS` | Nội tỉnh tiết kiệm | Chỉ dùng nội tỉnh |

> **Không chắc account có mã nào?** Bấm "Đẩy đơn" — nếu mã sai, bước kiểm giá (`getPriceAll`, §3)
> trả về **danh sách mã hợp lệ cho đúng tuyến** đó.

Param tuỳ chọn: `ORDER_SERVICE_ADD` (dịch vụ cộng thêm), `PRODUCT_LENGTH/WIDTH/HEIGHT` (kích thước
kiện mặc định, cm). **Không** cần khai `GROUPADDRESS_ID`/`SENDER_*` — lấy tự động từ điểm gửi mặc định.

### 2.2. Webhook

| Ô trên cổng VTP | Giá trị |
|---|---|
| **Webhook Endpoints** | `https://<domain>/api/method/delivery_partner.api.webhook.handle?partner=Viettel+Post` |
| **Secret parameter** | 1 chuỗi bí mật — điền **trùng** vào field `Webhook Secret` của DP Partner `Viettel Post` |

- `partner=Viettel+Post` **bắt buộc khớp** tên `Viettel Post` (dấu cách encode `+`).
- Handler xác thực bằng header **`X-VTP-Token` == `Webhook Secret`**.
- Để **trống** `Webhook Secret` → bỏ qua verify (nhận mọi request) — tiện test, kém an toàn.

---

## 3. Đẩy đơn — cơ chế

Sau khi Submit và **chưa có** External Shipment ID, menu **Actions** có 2 lựa chọn.

**a) "Đẩy đơn sang ĐVVC"** — tạo đơn thật:

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontSize':'14px'}}}%%
flowchart LR
  classDef p fill:#e6f4ff,stroke:#299dd8,color:#0b4a6f;
  classDef c fill:#fff7e6,stroke:#fa8c16,color:#873800;
  A["Bấm Đẩy đơn"] --> B["Gom payload:<br/>điểm gửi + người nhận<br/>+ hàng + dịch vụ"]
  B --> C{"Kiểm giá<br/>getPriceAll"}
  C -- "Sai vùng/dịch vụ" --> C1["Báo lỗi cụ thể<br/>KHÔNG tạo đơn"]
  C -- "OK" --> D["createOrder"]
  D --> E["Lưu + commit mã đơn NGAY<br/>vào External Shipment ID"]
  class A,B,D,E p
  class C,C1 c
```

**Payload `createOrder` — các field quan trọng:**

| Field | Ý nghĩa |
|---|---|
| `ORDER_NUMBER` | = `shipment.name` — **bắt buộc**, thiếu → VTP báo *"Price does not apply to this itinerary"* |
| `GROUPADDRESS_ID` / `CUS_ID` | Từ điểm gửi mặc định (DP Pickup Point) |
| `SENDER_WARD` / `RECEIVER_WARD` | Mã vùng (RECEIVER_WARD tuỳ chọn) |
| `ORDER_PAYMENT` | `1` = không thu (COD=0) · `3` = thu hộ tiền hàng (COD>0) |
| `ORDER_SERVICE` | Mã dịch vụ (Extra Param) |
| `MONEY_COLLECTION` | = COD Amount khi có COD |
| `PRODUCT_LENGTH/WIDTH/HEIGHT` | Kích thước kiện (default 10cm) |
| `LIST_ITEM` | Danh sách hàng |

**Trình tự & an toàn:**

1. **Kiểm giá trước** (`getPriceAll`): sai mã vùng / dịch vụ không áp tuyến → **báo lỗi rõ, KHÔNG tạo đơn** (tránh đơn rác).
2. Qua kiểm → `createOrder` → **`db_set("external_shipment_id", ..., commit=True)` ngay** khi VTP trả về, rồi mới ghi các phụ (phí, comment, status) trong try/except riêng → lỗi phụ **không làm mất mã** (chống đơn mồ côi).
3. Lỗi API / **timeout**: cảnh báo *"đơn CÓ THỂ đã được tạo — kiểm cổng VTP TRƯỚC khi đẩy lại"*.

**b) "Đã tạo đơn ở ngoài"** — nhập `ORDER_NUMBER` tạo trên cổng VTP vào External Shipment ID.

**Chống trùng:** hễ đã có External Shipment ID → cả 2 nút **biến mất**.

**Huỷ đơn:** `UpdateOrder` với `TYPE=4` (không phải `STATUS:4`). VTP có **độ trễ propagation** →
code retry ~8 lần (thường thành công ở lần 2, ~3s sau).

---

## 4. Hành trình một đơn — KHÔNG COD

`COD Amount = 0` → `ORDER_PAYMENT = 1`.

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontSize':'14px'}}}%%
sequenceDiagram
  autonumber
  participant NV as Nhân viên kho
  participant ERP as ERP (DP Shipment)
  participant VTP as Viettel Post
  participant SP as Shipper VTP
  participant KH as Khách nhận

  NV->>ERP: Tạo + Submit vận đơn (COD = 0)
  NV->>ERP: Bấm "Đẩy đơn sang ĐVVC"
  ERP->>VTP: createOrder (ORDER_PAYMENT = 1)
  VTP-->>ERP: Trả ORDER_NUMBER
  Note over ERP: Status = Submitted<br/>External Shipment ID = mã VTP
  VTP-->>ERP: Webhook 104 (đã lấy hàng)
  Note over ERP: Status = Partner Received
  VTP-->>ERP: Webhook 200 (đang vận chuyển)
  Note over ERP: Status = In Transit
  SP->>KH: Giao hàng
  VTP-->>ERP: Webhook 500 (giao thành công)
  Note over ERP: Status = Delivered ✅
```

| Bước | Sự kiện VTP | Status ERP |
|---|---|---|
| Đẩy đơn xong | — | `Submitted` (đã có mã đơn) |
| VTP lấy hàng | webhook `104` | `Partner Received` |
| Trên đường | webhook `200` | `In Transit` |
| Giao xong | webhook `500` | `Delivered` ✅ |

---

## 5. Hành trình một đơn — CÓ COD

`COD Amount > 0` → `ORDER_PAYMENT = 3`, `MONEY_COLLECTION = COD`.

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontSize':'14px'}}}%%
sequenceDiagram
  autonumber
  participant NV as Nhân viên kho
  participant ERP as ERP (DP Shipment)
  participant VTP as Viettel Post
  participant SP as Shipper VTP
  participant KH as Khách nhận

  NV->>ERP: Tạo + Submit vận đơn (COD = 500.000đ)
  NV->>ERP: Bấm "Đẩy đơn sang ĐVVC"
  ERP->>VTP: createOrder (ORDER_PAYMENT = 3,<br/>MONEY_COLLECTION = 500.000)
  VTP-->>ERP: Trả ORDER_NUMBER + phí thu hộ
  VTP-->>ERP: Webhook 104 → Partner Received
  VTP-->>ERP: Webhook 200 → In Transit
  SP->>KH: Giao hàng
  KH->>SP: Trả 500.000đ (COD)
  VTP-->>ERP: Webhook 500 (giao thành công)
  Note over ERP: Status = Delivered ✅
  VTP->>VTP: Đối soát COD
  VTP-->>ERP: Webhook 503 / 505 (đã đối soát trả tiền)
  Note over ERP: Vẫn Delivered — kế toán ghi nhận<br/>tiền COD về (§9)
```

| Điểm | Không COD | Có COD |
|---|---|---|
| `COD Amount` | 0 | > 0 (VD 500.000) |
| `ORDER_PAYMENT` (tự set) | `1` (không thu) | `3` (thu hộ tiền hàng) |
| VTP thu tiền khách | Không | Có, khi giao |
| Phí thu hộ | 0 | VTP tính thêm |
| Trạng thái cuối | `Delivered` (500) | `Delivered` (500) → **503/505** khi đối soát COD |
| Kế toán | Không | Ghi nhận tiền COD về (§9) |

> Mã `503` / `505` (đã đối soát trả tiền / COD) **vẫn map về `Delivered`** — đơn đã hoàn tất.

---

## 6. Bảng map trạng thái (27 dòng, có sẵn)

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontSize':'15px'},'flowchart':{'nodeSpacing':45,'rankSpacing':50}}}%%
flowchart TD
  classDef process fill:#e6f4ff,stroke:#299dd8,stroke-width:1.5px,color:#0b4a6f;
  classDef good fill:#f6ffed,stroke:#54ab78,stroke-width:1.5px,color:#135200;
  classDef bad fill:#fff1f0,stroke:#ff4d4f,stroke-width:1.5px,color:#a8071a;
  classDef warn fill:#fff7e6,stroke:#fa8c16,stroke-width:1.5px,color:#873800;

  S["Submitted"] --> P["Partner Received<br/>100–105"]
  P --> T["In Transit<br/>200–202"]
  T --> D["Delivered<br/>500 · 503 · 505"]
  T --> F["Delivery Failed<br/>501 · 502 · 507–509"]
  F --> R["Returning<br/>300 · 302"]
  R --> RD["Returned<br/>301 · 550"]
  T --> L["Lost<br/>106 · 107"]
  P --> X["Cancelled<br/>-100 · -108 · -109"]
  T --> X

  class S,P,T process
  class D good
  class F,L,X bad
  class R,RD warn
```

| ORDER_STATUS | Mô tả VTP | DP Shipment Status |
|---|---|---|
| 100–105 | Tạo đơn → duyệt → lấy hàng → nhập kho | Partner Received |
| 200–202 | Đang vận chuyển / giao | In Transit |
| 500 | Giao hàng thành công | Delivered |
| 503 / 505 | Đã đối soát trả tiền / COD | Delivered |
| 504 | Đã đối soát công nợ | Delivered |
| 501 · 502 · 507 · 508 · 509 | Giao thất bại (các lý do) | Delivery Failed |
| 300 · 302 | Đang / chờ chuyển hoàn | Returning |
| 301 · 550 | Chuyển hoàn thành công / đối soát hoàn | Returned |
| 106 · 107 | Hư hỏng / mất hàng | Lost |
| -100 · -108 · -109 | Hủy đơn (các loại) | Cancelled |

> Mã **không có** trong bảng → log cảnh báo + bỏ qua (không đổi status). Cần thì thêm dòng vào
> **Status Mappings** của DP Partner `Viettel Post`.

Các field tra cứu ở **tab Tracking**: `Status` (chuẩn hoá) · `External Shipment ID` (`ORDER_NUMBER`) ·
`Tracking Status` (mã thô gần nhất) · `Tracking Status Info` · `Tracking URL`. Mỗi webhook ghi thêm 1
**Comment** để truy vết.

---

## 7. Test luồng trạng thái không cần đơn thật

Mô phỏng webhook trên một DP Shipment đã Submit (chỉ môi trường dev có console):

```python
# bench --site <site> console
from delivery_partner.scripts.simulate_webhooks import *
vtp_full_flow("SHIP-DP-2026-00001", external_id="<mã đơn>", flow="happy")   # 104 → ... → 500
vtp_full_flow("SHIP-DP-2026-00001", external_id="<mã đơn>", flow="cancel")  # → Cancelled
```

Hoặc qua HTTP (test đường webhook thật):

```bash
curl -s -X POST "https://<domain>/api/method/delivery_partner.api.webhook.handle?partner=Viettel+Post" \
  -H "Content-Type: application/json" \
  -H "X-VTP-Token: <webhook_secret>" \
  -d '{"ORDER_NUMBER": "<external_shipment_id>", "ORDER_STATUS": 500, "NOTE": "Giao thanh cong"}'
```

> Chi tiết framework simulate (GHN/VTP, step-by-step, `print_curl_commands`) xem
> [Tài liệu kỹ thuật app gốc §8](Delivery_Partner-Tech.html#8-setup-scripts).

---

## 8. Troubleshooting (kỹ thuật)

### Test Credentials báo đỏ
- Username/Password đúng môi trường (Use Sandbox khớp production/sandbox)?
- Password trên site vừa restore từ backup có thể **chưa nhập lại** → gõ lại rồi Save.

### Bấm "Đẩy đơn" báo lỗi

| Lỗi | Nguyên nhân & cách xử lý |
|---|---|
| *"chưa đặt điểm gửi mặc định"* | Vào DP Pickup Point tick **Is Default** cho 1 kho |
| *"chưa cấu hình ORDER_SERVICE"* | Thêm Extra Param `ORDER_SERVICE` |
| *"Mã dịch vụ X không khả dụng… Mã hợp lệ: …"* | Đổi `ORDER_SERVICE` sang 1 mã trong danh sách gợi ý |
| *"Không xác định được mã vùng người nhận"* | Address → "Dò mã vùng VTP" hoặc nhập ID tay; danh mục chưa sync → đồng bộ vùng trước |
| *"đơn CÓ THỂ đã được tạo…"* | Lỗi mạng/timeout — **kiểm cổng VTP** xem đơn đã tạo chưa TRƯỚC khi đẩy lại |
| Không thấy nút | Vận đơn phải **đã Submit** và **chưa** có External Shipment ID |
| *"Price does not apply to this itinerary"* | Thiếu `ORDER_NUMBER` trong payload, hoặc sai `ORDER_PAYMENT` / thiếu `LIST_ITEM` |

### Webhook không cập nhật trạng thái
1. Webhook trên cổng VTP đúng endpoint (`?partner=Viettel+Post`)?
2. DP Partner `Viettel Post` có `is_active = 1`?
3. `External Shipment ID` khớp `ORDER_NUMBER` VTP gửi?
4. Mã `ORDER_STATUS` có trong Status Mapping? Xem **Error Log**.
5. **Đã fix**: `frappe.request.data` là bytes trên request thật → handler decode bytes trước khi parse JSON (bản cũ parse rỗng → không cập nhật).

### Verify webhook fail (Invalid signature)
- `Webhook Secret` bên ERP trùng "Secret parameter" trên cổng VTP?
- Tạm để trống `Webhook Secret` để bỏ qua verify khi test nhanh.

---

## 9. Kế toán COD

Với đơn có COD, VTP thu tiền hộ rồi đối soát trả về. Cấu hình hạch toán trên **DP Partner Account**:

| Field | Loại account | Ghi chú |
|---|---|---|
| **Partner Warehouse** | Warehouse leaf (kho ảo "hàng đang ở carrier") | mỗi công ty 1 kho |
| **COD Receivable Account** | **`Receivable`** (bắt buộc) | giữ tiền COD carrier thu hộ |

**Vì sao COD phải là `Receivable`:** app extension dùng nó làm `paid_from` trong Payment Entry kiểu
**"Receive"** với `party = Customer`. ERPNext bắt buộc account party của lệnh "Receive" là `Receivable`.

> ⚠️ **Đích đến tiền COD** (`paid_to`) resolve theo: *Bank Account trên Sales Order → account của
> pickup warehouse → Company default cash account*, và **phải là Bank/Cash**. Đặt **Bank Account
> trên Sales Order** hoặc đảm bảo **Company có Default Cash Account**, tránh rơi vào account `Stock`
> của warehouse.

Chi tiết chuỗi tạo chứng từ ERP (MR/SE/DN/SI/PE): [Lifecycle & Doc Events](Delivery_Partner-Lifecycle.html).

---

## Liên quan

- [Viettel Post — Cài đặt & sử dụng (end-user, có ảnh)](../users/Delivery_Partner-Viettel_Post-Cai-Dat.html)
- [Delivery Partner — Tài liệu kỹ thuật (app gốc)](Delivery_Partner-Tech.html)
- [Delivery Partner — Lifecycle & Doc Events](Delivery_Partner-Lifecycle.html)
