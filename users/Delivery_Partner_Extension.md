---
title: Vận đơn từ Sales Order (kho & kế toán)
layout: default
parent: Vận chuyển & Giao nhận
nav_order: 3
---

# Vận đơn từ Sales Order — kho & kế toán

Khi bán hàng qua đơn vị vận chuyển, hệ thống tự nối **Đơn hàng (Sales Order) → Vận đơn (DP Shipment)**
và **tự sinh chứng từ kho + kế toán** theo hành trình giao hàng. Tài liệu này mô tả luồng vận hành cho
**sales**, **thủ kho** và **kế toán**.

> Muốn nắm bức tranh tổng quát trước? Đọc [Quy trình vận đơn & giao nhận](Delivery_Partner-Quy-Trinh.html).
> Cấu hình kỹ thuật (custom field, hooks, tài khoản COD) xem
> [Lifecycle & Doc Events](../tech/Delivery_Partner-Lifecycle.html).

---

## Sơ đồ luồng

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontSize':'15px'},'flowchart':{'nodeSpacing':40,'rankSpacing':44}}}%%
flowchart TD
  classDef u fill:#f9f0ff,stroke:#9254de,color:#391085;
  classDef a fill:#e6f4ff,stroke:#299dd8,color:#0b4a6f;
  classDef g fill:#f6ffed,stroke:#54ab78,color:#135200;

  SO["Sales Order (Submit)<br/>Delivery Method = ĐVVC"] --> CR["👤 Create > DP Shipment"]
  CR --> DS["DP Shipment (Draft)<br/>👤 chọn ĐVVC, kiện, COD"]
  DS --> SUB["👤 Submit"]
  SUB --> MR["⚙️ Đề nghị xuất kho (MR)"]
  MR --> WH["👤 Thủ kho xuất hàng"]
  WH --> PU["📦 Webhook: đã lấy hàng<br/>⚙️ Phiếu xuất kho (SE)"]
  PU --> DL["📦 Webhook: đã giao<br/>⚙️ Phiếu giao (DN) + Hoá đơn + Thu COD"]
  DL --> DONE["✅ SO tự Completed"]

  class SO,CR,DS,SUB,WH u
  class MR,PU,DL a
  class DONE g
```

👤 = người thao tác · ⚙️ = hệ thống tự tạo · 📦 = ĐVVC báo về qua webhook

---

## Bước 1 · Tạo Sales Order (Sales)

1. Tạo SO, thêm items, chỉ định **warehouse** cho mỗi item.
2. Set **Delivery Method** = **"Đơn vị vận chuyển"**.
3. **Submit** SO.

## Bước 2 · Tạo Vận đơn từ SO (Sales / Logistics)

Mở SO → bấm **Create > DP Shipment**.

- **SO có items từ nhiều kho:** hệ thống hỏi chọn kho → mỗi kho ra **1 vận đơn** riêng.
- **Hệ thống tự điền:** người nhận (theo khách của SO), địa chỉ + liên hệ giao, hàng hoá (đã rã Product
  Bundle, trừ phần đã ship), giá trị hàng, ngày lấy hôm nay.
- **Bạn cần làm:**
  - Chọn **Partner** (ĐVVC) + **Partner Account**
  - Kiểm **Pickup Address** đúng kho xuất
  - Nhập **COD Amount** (0 nếu không thu hộ)
  - Chỉnh items nếu chỉ giao 1 phần
  - Tab **Parcels** → **Auto-calculate Parcel** hoặc thêm tay
  - Điền **Pickup Date** + khung giờ lấy

## Bước 3 · Submit Vận đơn (Sales / Logistics)

Bấm **Submit**. Hệ thống kiểm tra (có kiện, có hàng, giá trị > 0, hàng cùng 1 kho) rồi:

- Trạng thái → **Submitted**
- Tự sinh **Đề nghị xuất kho (Material Request)** gửi kho — *chưa* trừ tồn.

> Đẩy đơn sang ĐVVC (lấy mã vận đơn) là thao tác riêng ở menu **Actions** — xem
> [Quy trình §5](Delivery_Partner-Quy-Trinh.html#5-gắn-mã-đơn-đvvc--theo-dõi-hành-trình)
> hoặc [Viettel Post — Cài đặt & sử dụng](Delivery_Partner-Viettel_Post-Cai-Dat.html).

## Bước 4 · Thủ kho chuẩn bị hàng (Thủ kho)

1. Vào **Material Request** list → lọc `Material Transfer` + `Pending`.
2. Mỗi MR có field **DP Shipment** → biết thuộc vận đơn nào.
3. Soạn hàng theo MR. **Không cần** tạo Phiếu xuất kho tay — sẽ tự sinh khi ĐVVC lấy hàng.

## Bước 5 · ĐVVC lấy hàng → tự sinh Phiếu xuất kho

Khi ĐVVC báo **đã lấy hàng** (webhook), hệ thống tự:

- Trạng thái → **Partner Received**
- Sinh **Phiếu xuất kho (Stock Entry)**: kho nguồn → kho ảo ĐVVC → **tồn kho thực sự chuyển đi**.

## Bước 6 · Giao thành công → Phiếu giao, Hoá đơn, COD

Khi ĐVVC báo **đã giao** (webhook), hệ thống tự sinh:

| Chứng từ | Điều kiện | Ý nghĩa |
|---|---|---|
| **Phiếu giao hàng** (Delivery Note) | Luôn | Xuất khỏi kho ảo ĐVVC; tăng SL đã giao trên SO |
| **Hoá đơn** (Sales Invoice) | Chỉ khi COD > 0 | Doanh thu + công nợ khách |
| **Phiếu thu COD** (Payment Entry) | Chỉ khi COD > 0 | Ghi tiền ĐVVC thu hộ, cấn trừ hoá đơn |

**Kết quả:** SO tự chuyển **Completed** khi mọi item đã giao đủ.

---

## Các trường hợp đặc biệt

### Giao thất bại → Hoàn hàng
`Delivery Failed` (chỉ đổi trạng thái) → `Returning` (đang hoàn) → `Returned`: hệ thống sinh **Phiếu
xuất kho đảo** (kho ảo ĐVVC → kho nguồn), tồn hoàn về; items quay lại pool → tạo vận đơn mới được.

### Mất hàng
`Lost`: sinh **Phiếu xuất kho ghi giảm** (trừ khỏi kho ảo ĐVVC). SO vẫn "To Deliver" — sales quyết
định giao lại hay đóng SO.

### Huỷ vận đơn

Huỷ có **2 chiều** — bạn huỷ trên ERP, hoặc ĐVVC huỷ và ERP tự cập nhật.

**① Bạn huỷ trên ERP** — mở DP Shipment → **Cancel**:

- Vận đơn **chưa đẩy** sang ĐVVC (chưa có mã) → huỷ bình thường, chỉ void nội bộ (Đề nghị xuất kho).
- Vận đơn **đã đẩy** (có mã) → hệ thống **tự gọi ĐVVC huỷ đơn trước khi huỷ nội bộ**:
  - ĐVVC **cho huỷ** (thường là khi **chưa lấy hàng**) → huỷ cả 2 phía + void Đề nghị xuất kho. Items quay về pool.
  - ĐVVC **từ chối** (đã lấy hàng / đang giao / đã giao) → **CHẶN Cancel**, báo lỗi rõ; vận đơn giữ nguyên.
    Hàng đã đi thì **đừng huỷ** — để nó chạy **luồng hoàn hàng** (Returning → Returned).

**② ĐVVC tự huỷ** (không lấy được hàng, huỷ trên cổng ĐVVC, ĐVVC huỷ hệ thống...) → vận đơn **tự chuyển
trạng thái `Cancelled`** (qua webhook), không cần bạn làm gì. Muốn dọn hẳn tài liệu thì mở vận đơn bấm
**Cancel** — lúc này hệ thống biết ĐVVC đã huỷ nên cho huỷ luôn (không gọi lại ĐVVC).

> **Nếu bạn bấm Cancel NGAY TRƯỚC khi tín hiệu huỷ về tới ERP** (trạng thái chưa kịp đổi): hệ thống gọi
> ĐVVC huỷ → ĐVVC báo không huỷ được → bị chặn 1 lần. Chờ ít phút cho trạng thái tự nhảy `Cancelled`
> rồi bấm Cancel lại là được.

### 🔴 QUAN TRỌNG — Đơn bị ĐVVC huỷ mà HÀNG ĐÃ LẤY ĐI: đừng Cancel vội! {#cancel-khi-hang-da-di}

**Quy tắc một câu: hàng chưa nằm trong tay kho mình → CHƯA bấm Cancel.**

**Vì sao?** Khi bạn bấm **Cancel** một vận đơn mà hàng đã rời kho (đã có Phiếu xuất kho sang kho ảo ĐVVC),
hệ thống sẽ tạo **Phiếu xuất kho đảo NGAY LẬP TỨC** — sổ kho ghi nhận *"hàng đã về kho"* trong khi
**hàng thật vẫn còn ở ĐVVC**. Hậu quả: tồn kho trên hệ thống **cao hơn thực tế**, kho soạn hàng theo số
ảo, kiểm kê lệch.

**Làm ĐÚNG theo thứ tự:**

1. Thấy vận đơn nhảy trạng thái **`Cancelled`** (ĐVVC huỷ) mà hàng **đã lấy đi** → **để yên vận đơn đó**.
2. Liên hệ ĐVVC / theo dõi hành trình để **nhận hàng về**.
3. Kho **nhận đủ hàng thật, kiểm đếm xong** → lúc đó mới mở vận đơn → bấm **Cancel**.
4. Phiếu xuất kho đảo sinh ra tại thời điểm này → **sổ kho khớp đúng thực tế**.

| Tình huống | Được bấm Cancel chưa? |
|---|---|
| ĐVVC huỷ, hàng **chưa từng lấy đi** (chưa có Phiếu xuất kho) | ✅ Bấm được ngay |
| ĐVVC huỷ, hàng đã lấy đi, **chưa về tới kho** | ❌ **CHƯA** — chờ hàng về |
| ĐVVC huỷ, hàng đã lấy đi, **kho đã nhận lại đủ hàng** | ✅ Bấm được — sổ kho sẽ khớp |

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontSize':'14px'}}}%%
flowchart LR
  classDef ok fill:#f6ffed,stroke:#54ab78,color:#135200;
  classDef no fill:#fff1f0,stroke:#ff4d4f,color:#a8071a;
  classDef q fill:#fff7e6,stroke:#fa8c16,color:#873800;
  A["Vận đơn bị ĐVVC huỷ"] --> B{"Hàng đã lấy đi chưa?<br/>(có Phiếu xuất kho?)"}
  B -- "Chưa" --> C["✅ Cancel ngay được"]
  B -- "Rồi" --> D{"Kho đã nhận lại<br/>hàng thật chưa?"}
  D -- "Chưa" --> E["❌ ĐỪNG Cancel<br/>chờ hàng về"]
  D -- "Rồi, kiểm đủ" --> F["✅ Cancel<br/>sổ kho khớp thực tế"]
  class B,D q
  class C,F ok
  class E no
```

> Trong luồng bình thường (không huỷ), tồn kho chỉ đảo khi ĐVVC trả hàng về — trạng thái **Returned**.
> Quy tắc trên chỉ áp dụng cho ca **Cancel tay** vận đơn có hàng đã đi.

### Giao nhiều lần cho 1 SO (tách đơn)
SO 10 sản phẩm, muốn giao 2 lần: **Lần 1** tạo vận đơn → giảm qty còn 5 → Submit. **Lần 2** tạo lại →
hệ thống tự tính còn 5. Mỗi lần có thể chọn ĐVVC / kho khác nhau.

| Trạng thái vận đơn | Tính là "đã ship"? |
|---|---|
| Submitted / Booked | Có (theo qty khai) |
| Partner Received → Delivered / Lost | Có (theo qty thực lấy) |
| Returned / Cancelled / Draft | Không (về lại pool) |

### Product Bundle
SO có combo → vận đơn tự rã thành item con (VD 3 × Combo A = Item X ×6 + Item Y ×3). Item phi tồn kho
trong bundle bị bỏ qua.

---

## Sự cố thường gặp

| Triệu chứng | Khắc phục |
|---|---|
| Đơn "Delivered" nhưng **không thấy** Phiếu giao / Hoá đơn / Phiếu thu | Vận đơn không gắn SO, chưa deploy bản vá, hoặc COD account chưa đúng loại — báo kỹ thuật ([§3](../tech/Delivery_Partner-Lifecycle.html#status-reactor-fix)) |
| DN qty không khớp SO | DN dùng **qty thực ĐVVC lấy** (picked qty), không phải qty khai — giao 1 phần thì nhỏ hơn |
| SO không tự Completed sau giao | SO chỉ complete khi **tất cả** item đã giao đủ — còn item chưa ship |
| "Partner Account has no warehouse" | DP Partner Account thiếu **Partner Warehouse** — báo quản trị |
| Thu COD nhưng không có Phiếu thu | DP Partner Account thiếu **COD Receivable Account** — báo quản trị |

Chi tiết kỹ thuật (custom field, hooks, ràng buộc tài khoản COD): [Lifecycle & Doc Events](../tech/Delivery_Partner-Lifecycle.html).

---

## Liên quan

- [Quy trình vận đơn & giao nhận](Delivery_Partner-Quy-Trinh.html) — tổng quan
- [Viettel Post — Cài đặt & sử dụng](Delivery_Partner-Viettel_Post-Cai-Dat.html) — kết nối & đẩy đơn VTP
- [Lifecycle & Doc Events](../tech/Delivery_Partner-Lifecycle.html) — kỹ thuật tích hợp ERP
