---
title: "Sửa Sales Order — các tình huống thường gặp"
layout: default
parent: Bán hàng & Đơn hàng
nav_order: 1
---

# Sửa Sales Order — các tình huống thường gặp
{: .no_toc }

**Dành cho:** Nhân viên bán hàng / CSKH / Quản trị bán hàng · **Doctype:** Sales Order
{: .fs-3 .text-grey-dk-000 }

Tài liệu này hướng dẫn **cách sửa một đơn bán hàng (Sales Order)** trong từng trạng
thái, kèm các **ràng buộc của hệ thống** (vì sao có lúc sửa được, có lúc bị chặn) và
cách xử lý đúng để **không phá biên bản bàn giao / kho / thanh toán** phía sau.

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Hiểu nhanh trong 1 phút — vì sao có lúc sửa được, lúc không

Một đơn hàng đi qua **3 trạng thái**:

| Trạng thái | Ý nghĩa | Sửa được gì |
|---|---|---|
| 🟡 **Draft** (Nháp) | Mới tạo, **chưa xác nhận** | Sửa **mọi field** rồi **Save** |
| 🟢 **Submitted** (Đã xác nhận) | Đã bấm **Submit**, đơn đã có hiệu lực | **Khoá phần lớn field**. Sửa sản phẩm bằng nút **Update Items**; vài field cho phép sửa thẳng; còn lại phải **Hủy & Sửa lại (Amend)** |
| ⚪ **Closed / Completed / Cancelled** | Đã đóng / hoàn tất / đã hủy | Hầu như không sửa. Muốn sửa phải **mở lại** hoặc **Amend** |

> 💡 **Nguyên tắc vàng:** đơn càng có nhiều **chứng từ phía sau** (Phiếu giao hàng –
> Delivery Note, Hóa đơn – Sales Invoice, Phiếu thu – Payment Entry) thì càng **bị
> khóa chặt**. Muốn sửa sâu, thường phải **hủy chứng từ phía sau trước**, rồi mới sửa
> đơn.

---

## Tình huống 1 — Đơn còn ở trạng thái Nháp (Draft)

Đây là lúc **dễ sửa nhất**.

1. Mở đơn (Desk → gõ **"Sales Order"** → chọn đơn cần sửa).
2. Sửa bất kỳ field nào: Khách hàng, sản phẩm, số lượng, giá, chiết khấu, địa chỉ,
   Sales Team, phương thức thanh toán…
3. Bấm **Save** (⌘/Ctrl + S).
4. Khi chắc chắn đúng → bấm **Submit** để xác nhận đơn.

> ⚠️ Khi **Submit**, hệ thống kiểm tra một số quy tắc (xem [Các quy tắc hệ thống hay
> chặn](#các-quy-tắc-hệ-thống-hay-chặn-bạn)). Nếu báo đỏ, sửa cho đúng rồi Submit lại.

---

## Tình huống 2 — Đơn ĐÃ Submit, cần sửa Sản phẩm (số lượng / giá / chiết khấu / thêm-bớt dòng)

Sau khi Submit, **bảng Items bị khóa**. Muốn sửa sản phẩm phải dùng nút riêng:

1. Mở đơn → bấm nút **Update Items** (ở thanh trên cùng của form).
2. Trong cửa sổ hiện ra: **thêm dòng / xóa dòng / đổi Qty / đổi Rate (giá) / đổi
   Discount (chiết khấu)**.
3. Bấm **Update**.

### ⛔ Ràng buộc quan trọng: khi đơn ĐÃ xuất kho

Nếu đơn này **đã có phiếu xuất kho** (Stock Entry chuyển hàng ra khỏi đơn), hệ thống
sẽ **chặn việc đổi sản phẩm vật lý**. Lúc đó bạn **chỉ được**:

- Thêm / xóa / đổi số lượng của dòng **"Giảm giá"**, hoặc
- Thêm / xóa / đổi số lượng các **item phi vật lý (non-stock)**.

Nếu cố đổi **mã / số lượng của hàng vật lý (có quản kho)**, sẽ gặp lỗi:

> **`Không cho phép thay đổi items (chỉ được phép thêm/xóa/thay đổi qty của 'Giảm giá'
> hoặc phi vật lý, non-stock).`**

➡️ **Cách xử lý:** muốn đổi hàng vật lý đã xuất kho thì phải **hủy phiếu xuất kho /
phiếu giao hàng trước**, hoặc nhờ **System Manager** xử lý (xem [Khi không sửa
được](#khi-không-sửa-được--nhờ-ai)).

### 💰 Khi sửa Items làm đổi tổng tiền (Grand Total)

- Nếu đơn chỉ có **1 phương thức thanh toán** → hệ thống **tự cập nhật** số tiền cho
  khớp tổng mới.
- Nếu đơn có **nhiều phương thức thanh toán** → hệ thống **không tự chia lại** mà báo:
  *"Hãy cập nhật số tiền trong Payment Methods để không bị ảnh hưởng đến biên bản bàn
  giao"*. ➡️ Bạn **phải tự sửa lại bảng Payment Methods** cho tổng khớp Grand Total.

---

## Tình huống 3 — Đơn đã Submit, sửa các thông tin KHÁC (không phải sản phẩm)

Một số field **vẫn cho sửa trực tiếp sau khi Submit** — sửa xong **Save** là xong,
**không cần** Update Items hay Amend:

- **Sales Order Type** (loại đơn / nhóm người bán)
- **Bank Account** (tài khoản ngân hàng nhận tiền)
- **Payment Methods** (bảng phương thức thanh toán)
- Thông tin **xuất hóa đơn / BBBG**: tên công ty, mã số thuế, email, địa chỉ hóa đơn,
  người đại diện, chức vụ, điều khoản thanh toán…

Cách làm: mở đơn → sửa thẳng field → **Save**.

> ⚠️ Nếu field bạn cần sửa **bị xám / khóa** (ví dụ Khách hàng, Bảng giá, ngày đặt) →
> field đó **không cho sửa sau Submit**, phải dùng **[Hủy & Sửa lại
> (Amend)](#tình-huống-4--hủy--sửa-lại-amend-khi-field-bị-khóa-hẳn)**.

---

## Tình huống 4 — Hủy & Sửa lại (Amend): khi field bị khóa hẳn

Dùng khi cần đổi những thứ **không cho sửa sau Submit**, ví dụ: **đổi Khách hàng**,
**đổi Bảng giá**, **đổi hàng vật lý đã xuất kho**, hoặc đơn sai quá nhiều cần làm lại.

**Quy trình (theo đúng thứ tự — quan trọng):**

1. **Hủy chứng từ phía sau trước**, theo thứ tự ngược dòng tiền/hàng:
   - **Payment Entry** (Phiếu thu) → Cancel
   - **Sales Invoice** (Hóa đơn) → Cancel
   - **Delivery Note** (Phiếu giao hàng) → Cancel
2. Mở **Sales Order** → menu **⋮ / Actions** → **Cancel** (đơn chuyển sang
   **Cancelled**).
3. Trên đơn đã hủy, bấm **Amend** → hệ thống tạo **bản đơn mới** (tên có đuôi `-1`,
   ví dụ `SAL-ORD-2026-00123-1`) ở trạng thái **Draft**.
4. Sửa lại cho đúng trên bản mới → **Save** → **Submit**.

> ⚠️ **Không Cancel được Sales Order** nếu vẫn còn **Delivery Note đang hiệu lực**.
> Hệ thống báo:
> *"Không thể Close Sales Order này vì đã có Delivery Note: ... Vui lòng cancel
> Delivery Note trước."* ➡️ Cancel Delivery Note (và các chứng từ khác) **trước**, rồi
> mới Cancel đơn.

---

## Tình huống 5 — Đóng đơn: Close / On Hold

- **On Hold** (tạm giữ): mở đơn → menu **Actions** → **Hold**. Dùng khi đơn cần
  tạm dừng xử lý.
- **Close** (đóng đơn): menu **Actions** → **Close**. Dùng khi đơn **không giao tiếp
  nữa** (khách hủy phần còn lại…).

> ⛔ **Không Close được** nếu đơn **đã có Phiếu giao hàng (Delivery Note) hiệu lực** →
> lỗi *"Không thể Close Sales Order này vì đã có Delivery Note…"*. Phải **Cancel
> Delivery Note trước** rồi mới Close.

Muốn mở lại đơn đã Close: menu **Actions** → **Re-open**.

---

## Tình huống 6 — Sửa người bán / Sales Team

- Mỗi đơn **bắt buộc có ít nhất 1 người** trong **Sales Team**. Xóa hết sẽ báo:
  *"Bắt buộc phải có ít nhất 1 Sales Person trong Sales Team."*
- **Không được chọn trùng người** trong Sales Team → báo:
  *"Không thể chọn trùng người trong Sales Team. '...' đã được chọn."*
- **Sales Order Type** chỉ cho chọn **nhóm người bán** (Sales Person dạng nhóm) và
  thường **tự suy ra** từ Sales Team — bình thường không cần sửa tay.

---

## Tình huống 7 — Sửa phương thức / tài khoản thanh toán

### Phương thức thanh toán (Payment Methods)

- Khi đơn còn **Draft**, **tổng tiền các phương thức thanh toán phải bằng Grand
  Total** (đã gồm thuế). Lệch quá **100đ** sẽ bị chặn:
  *"Tổng tiền trong Payment Method phải bằng Grand Total… Hiện tại là: …"*.
- ➡️ Sửa lại số tiền từng dòng cho **tổng khớp Grand Total**.
- *Ngoại lệ:* đơn tạo từ **Phiếu dịch vụ (Service Ticket) / Issue** không bị kiểm tra
  quy tắc này.

### Tài khoản ngân hàng (Bank Account)

- **Không đổi được Bank Account** nếu đơn **đã có Phiếu thu (Payment Entry)** → lỗi:
  *"Không cho phép thay đổi Bank Account vì đã tạo phiếu thanh toán"*.
- ➡️ Muốn đổi: **Cancel Payment Entry trước**, sửa Bank Account, rồi tạo lại Phiếu thu.

---

## Tình huống 8 — Việc đặc biệt (cần quyền)

| Việc | Ai làm được | Cách |
|---|---|---|
| **Recalculate Commission** (tính lại hoa hồng) | **Sales Manager** | Mở đơn (đã Submit) → menu **Actions** → **Recalculate Commission**. Tick *"Lấy công thức mới nhất"* nếu muốn bỏ snapshot cũ |
| **Restore Telegram 0đ** (khôi phục đơn 0đ về giá đúng) | **System Manager** | Đơn có **Grand Total = 0** → menu **Actions** → **Restore Telegram 0đ** → xem preview → xác nhận |
| **Call Fallback Mobile No** (lấy SĐT từ Lead) | Mọi người (đơn đã Submit) | menu **Actions** → **Call Fallback Mobile No** |

---

## Các quy tắc hệ thống hay chặn bạn

Tổng hợp các kiểm tra hệ thống thường gặp khi **Save / Submit / Update Items**:

| Khi nào | Quy tắc | Nếu vi phạm |
|---|---|---|
| Save/Submit | Sales Team có ≥ 1 người, **không trùng** | Báo đỏ, không lưu được |
| Save (Draft) | Tổng **Payment Methods = Grand Total** (lệch ≤ 100đ) | *"Tổng tiền trong Payment Method phải bằng Grand Total…"* |
| Đổi Bank Account | Chưa có Payment Entry | *"Không cho phép thay đổi Bank Account vì đã tạo phiếu thanh toán"* |
| Update Items sau khi xuất kho | Không đổi **hàng vật lý** | *"Không cho phép thay đổi items (chỉ được… 'Giảm giá' hoặc phi vật lý, non-stock)."* |
| Close đơn | Không còn Delivery Note hiệu lực | *"Không thể Close… đã có Delivery Note… Vui lòng cancel Delivery Note trước."* |

---

## Khi không sửa được — nhờ ai

Nếu field **bị khóa**, hoặc gặp lỗi mà **bạn không có quyền** xử lý, **đừng cố lách**.
Gửi yêu cầu kèm **mã đơn** (ví dụ `SAL-ORD-2026-00123`) và **mô tả việc cần sửa** cho
đúng người:

- **Sửa hàng vật lý đã xuất kho / cần Cancel cả chuỗi chứng từ** → **System Manager**.
- **Tính lại hoa hồng** → **Sales Manager**.
- **Vướng Phiếu thu / Hóa đơn / kế toán** → **bộ phận Kế toán**.
- **Lỗi liên kết Khách hàng** (`Could not find Row #...: Link Name`) →
  *[Sửa lỗi liên kết Khách hàng](Sua-Loi-Lien-Ket-Khach-Hang.html)*.

---

## ⚠️ Lỗi thường gặp — tra nhanh

| Hiện tượng | Nguyên nhân | Cách xử |
|---|---|---|
| Submit rồi **không sửa được Items** | Đơn đã Submit | Dùng **Update Items**; nếu đã xuất kho → chỉ sửa được "Giảm giá"/non-stock, còn lại **Amend** |
| `Không cho phép thay đổi items… 'Giảm giá'…` | Đã xuất kho hàng vật lý | Cancel phiếu xuất/giao trước, hoặc nhờ **System Manager** |
| `Không thể Close… đã có Delivery Note…` | Còn Delivery Note hiệu lực | **Cancel Delivery Note** trước rồi Close/Cancel |
| `Không cho phép thay đổi Bank Account…` | Đã có Payment Entry | **Cancel Payment Entry** trước, sửa, tạo lại |
| `Tổng tiền trong Payment Method phải bằng Grand Total…` | Payment Methods lệch tổng | Sửa số tiền cho **khớp Grand Total** |
| `Bắt buộc phải có ít nhất 1 Sales Person…` | Sales Team trống | Thêm ít nhất 1 người |
| `Không thể chọn trùng người trong Sales Team…` | Trùng người bán | Bỏ dòng trùng |
| Field **xám / khóa** sau Submit | Field không cho sửa sau Submit | Dùng **Hủy & Sửa lại (Amend)** |
| `Could not find Row #…: Link Name: …` khi lưu | Dữ liệu liên kết Khách hàng sai | Xem *[Sửa lỗi liên kết Khách hàng](Sua-Loi-Lien-Ket-Khach-Hang.html)* |

---

## Phòng ngừa

- **Kiểm tra kỹ khi còn Draft** — sửa lúc Nháp luôn dễ nhất, tránh phải Amend.
- Trước khi **Submit**: rà lại **Sản phẩm, Giá, Sales Team, Payment Methods** (khớp
  Grand Total).
- Cần sửa sâu đơn đã giao/đã thu → xác định **chuỗi chứng từ** (Payment Entry → Sales
  Invoice → Delivery Note) và **hủy theo đúng thứ tự** trước khi đụng vào đơn.
- Đơn có **nhiều phương thức thanh toán**: mỗi lần đổi tổng tiền nhớ **chỉnh lại
  Payment Methods** để **biên bản bàn giao (BBBG)** không bị lệch.
