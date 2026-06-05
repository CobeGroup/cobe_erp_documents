---
title: Handover Minutes V2 (Biên bản bàn giao)
layout: default
parent: Vận chuyển & Giao nhận
nav_order: 3
---

# Hướng dẫn sử dụng: Handover Minutes - V2

## Giới thiệu

**Handover Minutes - V2** là phiên bản mới của biên bản bàn giao, lắp đặt & nghiệm thu sản phẩm. So với bản gốc (Handover Minutes), V2 bổ sung các tính năng:

- Tên công ty hiển thị theo Bank Account (thay vì theo Company mặc định)
- Tách rõ thông tin **Người mua** và **Người nhận**
- Hiển thị chi tiết thuế VAT từng dòng
- Thông tin xuất hóa đơn VAT (nếu có)
- Hiển thị **ngày đặt cọc**
- Phân biệt **Trả góp / Trả thẳng** với chi tiết lãi suất, kỳ hạn
- Bỏ QR code chuyển khoản

---

## 1. Chọn Print Format khi in

1. Mở **Sales Order** cần in
2. Nhấn nút **Print** (hoặc Ctrl+P)
3. Tại mục **Format**, chọn **Handover Minutes - V2**
4. Nhấn **Print** hoặc **PDF**

> **Lưu ý:** Bản gốc "Handover Minutes" vẫn hoạt động bình thường, không bị ảnh hưởng.

---

## 2. Thiết lập thông tin công ty theo Bank Account

### Vấn đề
Mỗi Bank Account có thể thuộc các thương hiệu/tên công ty khác nhau, với địa chỉ, MST và hotline riêng. V2 cho phép gán toàn bộ thông tin công ty riêng cho từng Bank Account.

### Cách làm
1. Vào **Bank Account** > chọn tài khoản cần sửa
2. Điền các field sau (nằm ngay dưới field Company):

| Field | Mô tả | Nếu để trống |
|---|---|---|
| **Company Display Name** | Tên công ty hiển thị trên biên bản | Lấy từ Company > Company Detail Name |
| **Company Address** | Địa chỉ công ty | Lấy từ Company > Company Description |
| **Company Tax ID** | Mã số thuế (MST) | Lấy từ Company > Tax ID |
| **Company Hotline** | Số hotline | Lấy từ Company > Phone No |

3. Nhấn **Save**

### Ví dụ

| Bank Account | Company Display Name | Company Tax ID | Hiển thị |
|---|---|---|---|
| VCB - 123456 | CÔNG TY TNHH ABC | 0312345678 | Dùng thông tin từ Bank Account |
| TCB - 789012 | *(để trống)* | *(để trống)* | Tự động lấy từ Company mặc định |

> **Lưu ý:** Tất cả các field đều là tùy chọn. Chỉ cần điền field nào muốn ghi đè, các field còn lại sẽ tự động fallback về thông tin từ Company.

---

## 3. Thông tin Người mua và Người nhận

V2 tự động phân biệt 2 trường hợp:

### Trường hợp 1: Người mua và người nhận giống nhau
Nếu Contact Person trùng với Customer Name **và** không có Shipping Address riêng → hiển thị gọn 1 mục:

```
Khách hàng:     Nguyễn Văn A
Địa chỉ:        123 Nguyễn Huệ, Q1, HCM
Điện thoại:     0901234567
```

### Trường hợp 2: Người mua và người nhận khác nhau
Nếu Contact Person khác Customer Name **hoặc** có Shipping Address riêng → tách rõ 2 phần:

```
Người mua:                  Nguyễn Văn A
Địa chỉ (người mua):       123 Nguyễn Huệ, Q1, HCM

Người nhận:                 Trần Thị B
Địa chỉ (người nhận):      456 Lê Lợi, Q3, HCM
Điện thoại (người nhận):   0901234567
```

### Cách nhập dữ liệu trên Sales Order

| Thông tin | Field trên Sales Order | Tab |
|---|---|---|
| Tên người mua | **Customer Name** | Chính |
| Địa chỉ người mua | **Customer Address** (billing) | Address & Contact |
| Tên người nhận | **Contact Person** | Address & Contact |
| Địa chỉ người nhận | **Shipping Address** | Address & Contact |
| SĐT người nhận | **Mobile No** (từ Contact) | Address & Contact |

### Lưu ý
- Nếu **không chọn Shipping Address**, biên bản sẽ dùng lại địa chỉ của người mua
- Nếu **không chọn Contact Person**, biên bản sẽ dùng lại tên người mua → hiển thị gộp 1 mục
- Đảm bảo Contact Person đã được tạo và liên kết đúng với Customer

---

## 4. Phương thức thanh toán: Trả góp / Trả thẳng

### Cách hoạt động
V2 tự động kiểm tra bảng **Payment Methods** trên Sales Order:
- Nếu có bất kỳ dòng nào dùng phương thức chứa "Trả góp" → hiển thị **Hình thức: Trả góp**
- Ngược lại → hiển thị **Hình thức: Trả thẳng**

### Nhập chi tiết lãi suất, kỳ hạn
Thông tin lãi suất và kỳ hạn được nhập vào field **Note** của dòng trả góp trong bảng Payment Methods.

**Ví dụ cách nhập:**

| # | Type | Payment Method | Amount | Note |
|---|---|---|---|---|
| 1 | Đặt cọc | Chuyển khoản | 5,000,000 | |
| 2 | Thanh toán | Trả góp mPos | 25,000,000 | Lãi suất 0%, kỳ hạn 12 tháng qua HD Saison |

### Kết quả hiển thị trên biên bản

```
PHƯƠNG THỨC THANH TOÁN:
Hình thức: Trả góp
  Lãi suất 0%, kỳ hạn 12 tháng qua HD Saison

Lần 1: Khách hàng đặt cọc ngày 2026-04-29 bằng phương thức chuyển khoản số tiền 5,000,000đ
Lần 2: Khách hàng thanh toán bằng phương thức trả góp mpos số tiền 25,000,000đ ngay sau khi ký biên bản bàn giao
```

---

## 5. Ngày đặt cọc

V2 tự động hiển thị ngày đặt cọc từ field **Date** trong bảng Payment Methods.

### Cách nhập
Trong bảng **Payment Methods**, chọn **Type = Đặt cọc** và nhập **Date**.

### Kết quả
```
Lần 1: Khách hàng đặt cọc ngày 2026-04-20 bằng phương thức chuyển khoản số tiền 5,000,000đ
```

> **Lưu ý:** Chỉ dòng "Đặt cọc" mới hiển thị ngày. Dòng "Thanh toán" hiển thị "ngay sau khi ký biên bản bàn giao".

---

## 6. Hiển thị thuế VAT chi tiết

### Trước (V1)
Chỉ hiển thị 1 dòng gộp "Thuế và phí" với tổng số tiền.

### Sau (V2)
Hiển thị từng dòng thuế riêng biệt với mô tả và số tiền.

**Ví dụ:**

| | | Thành tiền (VNĐ) |
|---|---|---|
| ... | ... | ... |
| | **VAT 10%** | **2,500,000** |
| | **Phí vận chuyển** | **200,000** |
| | **Giảm giá:** | **-500,000** |
| | **Tổng cộng:** | **27,200,000** |

### Cách nhập
Thuế được cấu hình trong mục **Taxes and Charges** của Sales Order (tab chính). Mỗi dòng thuế sẽ tự động hiển thị trên biên bản.

---

## 7. Thông tin xuất hóa đơn VAT

### Khi nào hiển thị?
Chỉ hiển thị khi **tick checkbox "Invoice?"** trên Sales Order.

### Cách nhập

| Field trên Sales Order | Mô tả | Ví dụ |
|---|---|---|
| **Invoice?** (checkbox) | Tick để bật xuất hóa đơn | ✅ |
| **Company Name** | Tên công ty của khách hàng | CÔNG TY TNHH XYZ |
| **Tax Number** | Mã số thuế | 0312345678 |
| **Note Company** | Link đến Company (để lấy địa chỉ) | *(tùy chọn)* |

### Kết quả trên biên bản

```
(*). THÔNG TIN XUẤT HÓA ĐƠN VAT:
Tên công ty: CÔNG TY TNHH XYZ
Mã số thuế: 0312345678
Địa chỉ: 789 Trần Hưng Đạo, Q5, TP.HCM
```

> **Lưu ý:** Khi có thông tin VAT, mục chuyển khoản ngân hàng sẽ đánh số (**) thay vì (*).

---

## 8. Thông tin chuyển khoản ngân hàng

V2 vẫn giữ phần hiển thị thông tin chuyển khoản (STK, Ngân hàng, Tên tài khoản) nhưng **bỏ QR code VietQR**.

> Nếu cần QR code, sử dụng bản gốc **Handover Minutes**.

---

## Tổng hợp: Checklist trước khi in V2

Trước khi in biên bản V2, kiểm tra các field sau trên Sales Order:

- [ ] **Bank Account** đã chọn (bắt buộc)
- [ ] **Bank Account > Company Display Name / Address / Tax ID / Hotline** đã nhập (nếu muốn thông tin công ty khác mặc định)
- [ ] **Customer Address** (địa chỉ người mua)
- [ ] **Contact Person** (tên người nhận)
- [ ] **Shipping Address** (địa chỉ người nhận, nếu khác người mua)
- [ ] **Payment Methods** đã nhập đầy đủ (type, date, method, amount, note)
- [ ] **Taxes and Charges** đã cấu hình
- [ ] **Invoice?** tick nếu cần xuất hóa đơn → nhập Company Name + Tax Number

---

## So sánh V1 vs V2

| Tính năng | Handover Minutes (V1) | Handover Minutes - V2 |
|---|---|---|
| Tên công ty | Từ `doc.company` | Từ Bank Account (tên, địa chỉ, MST, hotline) |
| Thông tin KH | Gộp chung 1 mục | Tách Khách hàng (mua) / Khách hàng (nhận), tự gộp nếu cùng người |
| Ngày đặt cọc | Không hiển thị | Có hiển thị |
| Trả góp/Trả thẳng | Không phân biệt | Có, kèm lãi suất/kỳ hạn |
| Thuế | Gộp "Thuế và phí" | Chi tiết từng dòng thuế |
| Hóa đơn VAT | Không có | Hiển thị khi tick Invoice |
| QR chuyển khoản | Có | Không |
