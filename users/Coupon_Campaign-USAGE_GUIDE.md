---
title: Guide
layout: default
nav_order: 1
---
# Hướng dẫn sử dụng Coupon Campaign

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Dành cho Quản lý (Admin/Sales Manager)](#2-dành-cho-quản-lý)
   - [Tạo Item đại diện coupon](#21-tạo-item-đại-diện-coupon)
   - [Tạo chiến dịch coupon](#22-tạo-chiến-dịch-coupon)
   - [Giải thích các trường](#23-giải-thích-các-trường)
   - [Quản lý chiến dịch](#24-quản-lý-chiến-dịch)
3. [Dành cho Nhân viên Sales](#3-dành-cho-nhân-viên-sales)
   - [Áp dụng coupon vào đơn hàng](#31-áp-dụng-coupon-vào-đơn-hàng)
   - [Gỡ coupon khỏi đơn hàng](#32-gỡ-coupon-khỏi-đơn-hàng)
   - [Xem coupon trong Service Ticket](#33-xem-coupon-trong-service-ticket)
   - [Sử dụng coupon cho khách (Redeem)](#34-sử-dụng-coupon-cho-khách-redeem)
4. [Các loại ưu đãi](#4-các-loại-ưu-đãi)
5. [Vòng đời coupon](#5-vòng-đời-coupon)
6. [Câu hỏi thường gặp](#6-câu-hỏi-thường-gặp)
7. [Ví dụ thực tế](#7-ví-dụ-thực-tế)

---

## 1. Giới thiệu

Coupon Campaign là tính năng cho phép tạo chiến dịch ưu đãi cho khách hàng. Khi khách mua hàng, nhân viên sales có thể gắn coupon vào đơn hàng. Sau khi đơn hoàn thành, hệ thống tự động phát hành mã coupon cho khách. Lần bảo trì/mua hàng sau, khách được hưởng ưu đãi theo coupon đó.

**Ưu đãi có thể là:**
- Tặng miễn phí item (VD: tặng lõi lọc nước)
- Giảm giá theo % (VD: giảm 50% phí bảo trì)
- Giá ưu đãi cố định (VD: thay lõi giá 200k thay vì 500k)

**Đặc điểm:**
- Coupon không gắn sẵn vào khách hàng cụ thể — nhân viên sales tự quyết định áp dụng cho ai
- Mỗi đơn hàng chỉ áp dụng tối đa 1 chiến dịch coupon
- Coupon chỉ được phát hành sau khi đơn hàng **hoàn thành** (Completed)
- Hệ thống tự nhắc coupon khi đến hẹn bảo trì

---

## 2. Dành cho Quản lý

### 2.1 Tạo Item đại diện coupon

Trước khi tạo chiến dịch, cần tạo 1 item phi vật lý để đại diện cho coupon trong đơn hàng. Item này chỉ cần tạo 1 lần, có thể dùng chung cho nhiều chiến dịch.

**Các bước:**

1. Vào thanh tìm kiếm, gõ **Item** → chọn **Item** → bấm **+ Add Item**
2. Điền:
   - **Item Name**: Tên dễ nhận diện, VD: "Voucher tặng lõi lọc nước"
   - **Item Group**: Chọn nhóm phù hợp (có thể tạo nhóm "Voucher" riêng)
3. Quan trọng: Bỏ tick **Is Stock Item** ❌ (vì đây không phải hàng hóa thực tế)
4. Bấm **Save**

> **Lưu ý:** Có thể tạo nhiều item đại diện khác nhau cho từng loại chiến dịch, VD: "Voucher tặng lõi RO", "Voucher giảm giá bảo trì", v.v.

---

### 2.2 Tạo chiến dịch coupon

1. Vào thanh tìm kiếm, gõ **Coupon Campaign** → bấm **+ Add Coupon Campaign**

2. **Thông tin chung:**
   - **Campaign Name**: Đặt tên chiến dịch. VD: "Tặng lõi RO cho khách mua máy ABC hè 2026"
   - **Enabled**: Giữ tick ✅ để chiến dịch hoạt động
   - **Coupon Type**: Chọn "Future Benefit"
   - **Coupon Item**: Chọn item phi vật lý đã tạo ở bước 2.1

3. **Thời hạn và giới hạn:**
   - **Valid From**: Ngày bắt đầu cho phép phát hành coupon. Để trống = bắt đầu ngay
   - **Valid Upto**: Ngày ngưng phát hành. Để trống = không giới hạn
   - **Coupon Validity Days**: Số ngày coupon có hiệu lực **kể từ ngày đơn hàng hoàn thành**
     - VD: Nhập `1095` = coupon có hiệu lực 3 năm
     - Nhập `365` = 1 năm
     - Nhập `0` = không hết hạn
   - **Max Usage**: Tổng số coupon được phép phát hành
     - VD: Nhập `100` = chỉ phát hành tối đa 100 coupon
     - Nhập `0` = không giới hạn

4. **Items ưu đãi (Benefit Items):**
   Đây là danh sách items mà khách hàng sẽ được ưu đãi khi sử dụng coupon ở lần sau.

   - Bấm **[+ Thêm dòng]**
   - Trong cửa sổ hiện ra, điền:
     - **Mã Item**: Chọn item thực tế được ưu đãi (VD: LOI-RO-50GPD)
     - **Số lượng**: Số lượng được ưu đãi (VD: 1)
     - **Đơn vị**: Chọn đơn vị tính (VD: Cái)
     - **Loại ưu đãi**:
       - `Percentage` = Giảm giá theo phần trăm
       - `Fixed Price` = Bán với giá cố định
     - **Giá trị**:
       - Nếu Percentage: nhập `100` = miễn phí, `50` = giảm 50%, `30` = giảm 30%
       - Nếu Fixed Price: nhập số tiền cố định (VD: `200000` = bán giá 200,000đ)
   - Bấm **[Thêm]**
   - Có thể thêm nhiều dòng (VD: tặng lõi RO + giảm 50% bộ lọc thô)
   - Bấm **[✕]** trên dòng để xóa

5. **Điều kiện áp dụng (Applicable Items):**
   Đây là danh sách items/nhóm items mà khi có trong đơn hàng thì chiến dịch mới khả dụng.

   - Bấm **[+ Thêm dòng]**
   - Chọn **Mã Item** cụ thể hoặc **Nhóm Item**
   - VD: Thêm Mã Item = "MAY-LOC-ABC" → chiến dịch chỉ hiện khi đơn hàng có máy lọc ABC
   - VD: Thêm Nhóm Item = "Máy lọc nước" → áp dụng cho tất cả máy lọc
   - Bấm **[Thêm]**

6. Bấm **Save**

---

### 2.3 Giải thích các trường

| Trường | Ý nghĩa | Ví dụ |
|--------|---------|-------|
| Campaign Name | Tên chiến dịch (phải unique) | "Tặng lõi RO hè 2026" |
| Enabled | Bật/tắt chiến dịch | ✅ = đang hoạt động |
| Coupon Type | Loại coupon (hiện chỉ có Future Benefit) | Future Benefit |
| Coupon Item | Item phi vật lý đại diện coupon | "Voucher tặng lõi RO" |
| Valid From | Bắt đầu cho phép phát hành | 01/05/2026 |
| Valid Upto | Ngưng phát hành | 31/12/2026 |
| Coupon Validity Days | Số ngày coupon có hiệu lực từ ngày phát hành | 1095 (= 3 năm) |
| Max Usage | Giới hạn tổng lượt phát hành (0 = vô hạn) | 100 |
| Used Count | Số lượt đã phát hành (tự động, không sửa được) | 23 |
| Benefit Items | Bảng items ưu đãi khi dùng coupon | LOI-RO x1 miễn phí |
| Applicable Items | Items kích hoạt chiến dịch trong đơn hàng | MAY-LOC-ABC |
| Description | Ghi chú nội bộ | "Áp dụng cho KH mua mới" |

---

### 2.4 Quản lý chiến dịch

**Tạm ngưng chiến dịch:**
- Mở Coupon Campaign → bỏ tick **Enabled** → Save
- Chiến dịch sẽ không hiện trong danh sách khi sales bấm [Apply Campaign]
- Các coupon đã phát hành vẫn còn hiệu lực

**Điều chỉnh số lượt:**
- Mở Coupon Campaign → sửa **Max Usage** → Save
- VD: Tăng từ 100 lên 200 nếu muốn phát hành thêm

**Xem coupon đã phát hành:**
- Vào **Coupon Code** → lọc theo **Coupon Campaign** để xem danh sách coupon đã phát hành
- Có thể lọc thêm theo **Coupon Status** (Issued/Used/Expired)

**Hủy coupon:**
- Mở **Coupon Code** cụ thể → sửa **Coupon Status** thành "Cancelled" → Save

---

## 3. Dành cho Nhân viên Sales

### 3.1 Áp dụng coupon vào đơn hàng

Khi tạo đơn hàng cho khách, nếu đơn hàng có items phù hợp với chiến dịch coupon, bạn có thể gắn coupon cho khách.

**Các bước:**

1. Tạo hoặc mở **Sales Order** (trạng thái Draft)
2. Chọn **Customer** và thêm **Items** vào đơn
3. Trên thanh công cụ, bấm **[Coupon]** → **[Apply Campaign]**
4. Cửa sổ hiện ra danh sách chiến dịch khả dụng, bao gồm:
   - Tên chiến dịch
   - Items ưu đãi (tặng gì, giảm bao nhiêu)
   - Hạn sử dụng coupon
   - Số lượt còn lại
5. Bấm **[Apply]** bên cạnh chiến dịch muốn dùng
6. Một item voucher (giá 0đ) sẽ tự động thêm vào bảng items của đơn hàng
7. Tiếp tục xử lý đơn hàng bình thường: Submit → giao hàng → thanh toán → Complete

> **Quan trọng:** Coupon chỉ được phát hành chính thức sau khi đơn hàng **Completed** (đã giao + đã thanh toán). Nếu đơn bị hủy trước đó, coupon sẽ không được tạo.

---

### 3.2 Gỡ coupon khỏi đơn hàng

Nếu muốn gỡ coupon (chỉ khi đơn còn Draft):

**Cách 1:** Bấm **[Coupon]** → **[Remove Campaign]**

**Cách 2:** Xóa dòng item voucher trong bảng items → chiến dịch sẽ tự động được gỡ

> **Lưu ý:** Nếu xóa Customer khỏi đơn, coupon cũng sẽ tự động bị gỡ.

---

### 3.3 Xem coupon trong Service Ticket

Khi mở **Service Ticket Reminder** của khách hàng, nếu khách có coupon chưa sử dụng, bạn sẽ thấy:

**Banner vàng ở đầu trang:**

```
🎁 Khách hàng có 1 coupon ưu đãi chưa sử dụng
┌────────────┬──────────────────────────┬───────────┬────────────┐
│ Coupon     │ Ưu đãi                   │ Từ SO     │ Hạn dùng   │
├────────────┼──────────────────────────┼───────────┼────────────┤
│ TANG-XXXX  │ LOI-RO-50GPD x1 Miễn phí│ SO-001    │ 01/05/2029 │
└────────────┴──────────────────────────┴───────────┴────────────┘
```

**Thông tin hiển thị:**
- **Coupon**: Mã coupon (bấm để xem chi tiết)
- **Ưu đãi**: Items được ưu đãi, loại ưu đãi (miễn phí/giảm %/giá cố định)
- **Từ SO**: Đơn hàng gốc đã phát hành coupon (bấm để xem)
- **Hạn dùng**: Ngày hết hạn coupon

> **Lưu ý:** Banner chỉ hiện coupon liên quan đến các đơn hàng của ticket này, không hiện coupon từ đơn hàng khác.

---

### 3.4 Sử dụng coupon cho khách (Redeem)

Khi khách quay lại bảo trì/mua hàng và có coupon:

**Các bước:**

1. Từ **Service Ticket Reminder**, bấm **[Create]** → **[Sales Order]** để tạo đơn bảo trì
   (hoặc tạo Sales Order mới cho cùng khách hàng)

2. Thêm items dịch vụ/sản phẩm vào đơn (nếu cần)

3. Bấm **[Coupon]** → **[Redeem Coupon]**

4. Cửa sổ hiện ra danh sách coupon khả dụng của khách:
   - Mã coupon
   - Chiến dịch gốc
   - Ưu đãi cụ thể
   - Đơn hàng gốc
   - Hạn sử dụng

5. Bấm **[Redeem]** bên cạnh coupon muốn sử dụng

6. Hệ thống tự động:
   - Thêm items ưu đãi vào đơn hàng với giá đã giảm
   - Đánh dấu các items này là "Coupon Benefit" (không nên sửa giá)
   - Coupon chuyển trạng thái thành "Used"

7. Tiếp tục xử lý đơn hàng bình thường

**Ví dụ sau khi Redeem:**
```
Items trong đơn hàng bảo trì:
┌──────────────────┬──────┬───────────┬─────────┐
│ Item             │ Qty  │ Giá gốc   │ Giá bán │
├──────────────────┼──────┼───────────┼─────────┤
│ Phí bảo trì      │ 1    │ 300,000   │ 300,000 │
│ Lõi RO-50GPD     │ 1    │ 500,000   │ 0 ← miễn phí từ coupon │
│ Bộ lọc thô       │ 2    │ 150,000   │ 75,000 ← giảm 50%     │
└──────────────────┴──────┴───────────┴─────────┘
```

---

## 4. Các loại ưu đãi

Khi tạo chiến dịch, mỗi item ưu đãi có thể được cấu hình 1 trong 3 cách:

### Miễn phí (Percentage = 100)

| Cấu hình | Kết quả khi Redeem |
|-----------|-------------------|
| Item: LOI-RO-50GPD | Lõi RO-50GPD |
| Qty: 1 | x 1 |
| Loại: Percentage | |
| Giá trị: 100 | **Giá = 0đ** |

### Giảm giá % (Percentage < 100)

| Cấu hình | Kết quả khi Redeem |
|-----------|-------------------|
| Item: BO-LOC-THO | Bộ lọc thô |
| Qty: 2 | x 2 |
| Loại: Percentage | |
| Giá trị: 50 | **Giảm 50%** (giá gốc 150k → còn 75k) |

### Giá cố định (Fixed Price)

| Cấu hình | Kết quả khi Redeem |
|-----------|-------------------|
| Item: LOI-LOC-SO3 | Lõi lọc số 3 |
| Qty: 1 | x 1 |
| Loại: Fixed Price | |
| Giá trị: 200000 | **Giá = 200,000đ** (dù giá gốc 500k) |

---

## 5. Vòng đời coupon

```
Đơn hàng gốc (Draft)
  │  Sales bấm [Apply Campaign]
  │  → Item voucher thêm vào đơn
  ▼
Đơn hàng Submit
  │  Coupon chưa được tạo
  │  (chờ hoàn thành đơn)
  ▼
Đơn hàng Completed ✅
  │  → Coupon Code tự động sinh ra
  │  → Trạng thái: "Issued" (đã phát hành)
  │  → Gắn vào khách hàng + đơn hàng gốc
  ▼
Service Ticket Reminder (khi đến hẹn bảo trì)
  │  → Banner vàng nhắc: "KH có coupon chưa dùng"
  │  → Bảng coupon trong ticket
  ▼
Đơn hàng bảo trì (Draft)
  │  Sales bấm [Redeem Coupon]
  │  → Items ưu đãi thêm vào đơn với giá đã giảm
  │  → Coupon trạng thái: "Used" (đã sử dụng) ✅
  ▼
Hoàn tất
```

**Trạng thái coupon:**

| Trạng thái | Ý nghĩa |
|------------|---------|
| **Issued** | Đã phát hành cho khách, chờ sử dụng |
| **Used** | Khách đã sử dụng |
| **Expired** | Hết hạn (quá ngày Valid Upto) |
| **Cancelled** | Bị admin hủy thủ công |

---

## 6. Câu hỏi thường gặp

### Tại sao bấm [Apply Campaign] không thấy chiến dịch nào?

Kiểm tra:
- Đơn hàng đã có items chưa? (cần thêm items trước)
- Items trong đơn có nằm trong "Applicable Items" của chiến dịch không?
- Chiến dịch còn trong thời hạn (Valid From ~ Valid Upto)?
- Chiến dịch còn lượt phát hành (Used Count < Max Usage)?
- Chiến dịch đang Enabled?

### Tại sao đơn hàng đã Submit nhưng chưa thấy Coupon Code?

Coupon Code chỉ được tạo khi đơn hàng **Completed** (hoàn thành giao hàng + thanh toán), không phải khi Submit.

### Khách có coupon nhưng Service Ticket Reminder không hiện banner?

Kiểm tra:
- Ticket có đúng **Customer** không?
- Ticket có **Reference Sales Orders** chứa đơn hàng gốc (đơn đã phát hành coupon) không?
- Coupon còn trong hạn sử dụng không?
- Coupon status có phải "Issued" không? (có thể đã Used hoặc Expired)

### Có thể áp dụng nhiều chiến dịch cho 1 đơn hàng không?

Không. Mỗi đơn hàng chỉ áp dụng tối đa 1 chiến dịch coupon. Nếu muốn đổi, gỡ chiến dịch cũ rồi apply chiến dịch mới.

### Nếu đơn hàng bị hủy sau khi Submit thì coupon có bị tạo không?

Không. Coupon chỉ tạo khi đơn Completed. Nếu đơn bị hủy (Cancel) trước đó, không có coupon nào được tạo.

### Có thể sửa giá items ưu đãi sau khi Redeem không?

Các items ưu đãi được đánh dấu "Is Coupon Benefit" và giá đã được set tự động. Không nên sửa giá để đảm bảo đúng chương trình ưu đãi.

### Chiến dịch hết hạn nhưng coupon đã phát hành vẫn dùng được không?

Có. Hạn chiến dịch (Valid From ~ Valid Upto) chỉ kiểm soát việc **phát hành** coupon mới. Coupon đã phát hành có hạn sử dụng riêng theo **Coupon Validity Days**.

VD: Chiến dịch hết hạn 31/12/2026, coupon phát hành ngày 15/12/2026 với validity 3 năm → coupon dùng được đến 15/12/2029.

---

## 7. Ví dụ thực tế

### Ví dụ 1: Tặng lõi lọc nước cho lần thay lõi sau

**Quản lý cấu hình:**
1. Tạo Item "Voucher tặng lõi RO" (bỏ tick Is Stock Item)
2. Tạo Coupon Campaign:
   - Tên: "Tặng lõi RO cho khách mua máy ABC"
   - Coupon Item: "Voucher tặng lõi RO"
   - Benefit Items: bấm [+ Thêm dòng]
     - Mã Item: LOI-RO-50GPD
     - Số lượng: 1
     - Loại ưu đãi: Percentage
     - Giá trị: 100 (miễn phí)
   - Applicable Items: bấm [+ Thêm dòng]
     - Mã Item: MAY-LOC-ABC
   - Coupon Validity Days: 1095 (3 năm)
   - Max Usage: 100

**Sales bán hàng:**
1. Khách mua máy lọc ABC
2. Tạo Sales Order → thêm item MAY-LOC-ABC
3. Bấm [Coupon] → [Apply Campaign] → chọn "Tặng lõi RO..." → [Apply]
4. Item "Voucher tặng lõi RO" xuất hiện trong đơn (giá 0đ)
5. Submit → giao hàng → thanh toán → đơn Completed
6. Hệ thống tự tạo Coupon Code: TANG-LOI-XXXXXX

**6 tháng sau — bảo trì:**
1. Service Ticket Reminder nhắc bảo trì
2. Mở ticket → thấy banner: "KH có 1 coupon: LOI-RO-50GPD x1 Miễn phí"
3. Bấm [Create] → [Sales Order] tạo đơn bảo trì
4. Bấm [Coupon] → [Redeem Coupon] → chọn coupon → [Redeem]
5. Item LOI-RO-50GPD tự thêm vào đơn với giá 0đ
6. Hoàn tất đơn bảo trì

---

### Ví dụ 2: Giảm 50% phí bảo trì cho lần sau

**Quản lý cấu hình:**
1. Tạo Coupon Campaign:
   - Tên: "Giảm 50% bảo trì lần 2"
   - Benefit Items:
     - Mã Item: PHI-BAO-TRI
     - Số lượng: 1
     - Loại ưu đãi: Percentage
     - Giá trị: 50
   - Applicable Items:
     - Nhóm Item: "Dịch vụ bảo trì"

**Sales bán hàng:**
1. Khách dùng dịch vụ bảo trì → apply campaign → complete SO
2. Coupon phát hành: giảm 50% PHI-BAO-TRI

**Lần sau:**
1. Khách quay lại bảo trì → redeem coupon
2. PHI-BAO-TRI (giá gốc 300k) → thêm vào đơn với discount 50% → giá 150k

---

### Ví dụ 3: Thay lõi giá ưu đãi 200k (giá gốc 500k)

**Quản lý cấu hình:**
1. Tạo Coupon Campaign:
   - Tên: "Ưu đãi thay lõi cho KH máy XYZ"
   - Benefit Items:
     - Mã Item: LOI-LOC-SO3
     - Số lượng: 1
     - Loại ưu đãi: Fixed Price
     - Giá trị: 200000
   - Applicable Items:
     - Mã Item: MAY-LOC-XYZ

**Sales bán hàng:**
1. Khách mua máy XYZ → apply campaign → complete SO
2. Coupon phát hành: LOI-LOC-SO3 giá 200,000đ

**Lần sau:**
1. Khách quay lại thay lõi → redeem coupon
2. LOI-LOC-SO3 thêm vào đơn với rate = 200,000đ (thay vì giá gốc 500k)

---

### Ví dụ 4: Tặng combo lõi + giảm giá phí dịch vụ

**Quản lý cấu hình:**
1. Tạo Coupon Campaign với nhiều benefit items:
   - Benefit Items (dòng 1):
     - LOI-RO-50GPD, qty 1, Percentage, 100 (miễn phí)
   - Benefit Items (dòng 2):
     - BO-LOC-THO, qty 2, Percentage, 50 (giảm 50%)
   - Benefit Items (dòng 3):
     - PHI-DICH-VU, qty 1, Fixed Price, 100000 (phí dịch vụ 100k)

**Khi redeem, đơn hàng sẽ có:**
```
LOI-RO-50GPD  x1   giá gốc 500k → 0đ (miễn phí)
BO-LOC-THO    x2   giá gốc 150k → 75k/cái (giảm 50%)
PHI-DICH-VU   x1   giá gốc 300k → 100k (giá cố định)
```
