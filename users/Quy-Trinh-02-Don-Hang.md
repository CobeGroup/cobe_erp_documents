---
title: 2 · Đơn bán hàng
layout: default
parent: Quy trình hợp nhất
nav_order: 3
---

# Chặng 2 — Đơn bán hàng
{: .no_toc }

**Ai làm:** Kinh doanh · Chăm sóc khách hàng · Nhân viên dịch vụ · Kế toán
{: .fs-3 .text-grey-dk-000 }

Đơn bán hàng (`Sales Order`) là **trục chính** của cả hệ thống. Mọi chứng từ phía sau đều
tham chiếu về nó: phiếu công việc, yêu cầu vật tư, phiếu giao hàng, hoá đơn, phiếu thu, và cả
lịch bảo dưỡng cho những năm sau.

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ vòng đời đơn

<a href="images/svg/quy-trinh/03-don-hang-vong-doi.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/03-don-hang-vong-doi.svg" alt="Đơn bán hàng đi từ Nháp, qua xác nhận thành Chờ giao và chờ hoá đơn, rồi Còn nợ một vế, cuối cùng là Hoàn tất. Ba nhánh rẽ là Tạm giữ, Đóng đơn và Đã huỷ; đơn đã huỷ lập lại được bằng bản sửa lại" style="width:100%;height:auto">
</a>

---

## 1. Ba cửa lập đơn

| Cửa | Lập từ đâu | Số đơn | Đặc điểm |
|---|---|---|---|
| **Khách mới hoặc khách tự liên hệ** | Lập trực tiếp trên Desk | 28.775 | Đơn bán máy mới, bán lẻ vật tư |
| **Từ phiếu nhắc bảo dưỡng** | Nút **Tạo → Sales Order** trên phiếu nhắc | 19.056 | Đơn thay lõi, bảo dưỡng định kỳ |
| **Từ phiếu sự cố** | Nút **Tạo → Sales Order** trên phiếu sự cố | 3.321 | Đơn thay linh kiện khi sửa chữa có tính tiền |

Hai cửa sau quan trọng ở chỗ: khi lập đơn bằng nút trên chứng từ gốc, hệ thống **ghi đường dẫn
ngược** về phiếu nhắc hoặc phiếu sự cố. Nhờ đó:

- Phiếu gốc tự chuyển sang trạng thái **Converted** ngay khi đơn được xác nhận, và tự chuyển
  sang **Cancelled** nếu đơn bị huỷ. Nhân viên không phải cập nhật tay.
- Báo cáo tính được tỉ lệ chốt của từng người, từng đợt nhắc.

> ⚠️ Lập đơn bằng cách tạo mới trên Desk rồi gõ tay tên khách sẽ **mất đường dẫn ngược**. Phiếu
> nhắc vẫn nằm im ở trạng thái *Open* dù khách đã mua, và công của người chốt đơn không được ghi.

---

## 2. Điền gì trên đơn

### 2.1. Bắt buộc, hệ thống chặn nếu sai

| Mục | Quy tắc | Thông báo khi vi phạm |
|---|---|---|
| **Sales Team** (người bán) | Ít nhất một người, **không được trùng người** | *“Bắt buộc phải có ít nhất 1 Sales Person trong Sales Team.”* · *“Không thể chọn trùng người trong Sales Team.”* |
| **Payment Methods** (phương thức thanh toán) | Tổng tiền các dòng phải **bằng tổng giá trị đơn**, lệch không quá 100 đồng | *“Tổng tiền trong Payment Method phải bằng Grand Total…”* |
| **Khách hàng, địa chỉ, liên hệ** | Phải trỏ tới hồ sơ có thật và liên kết đúng | *“Could not find Row #…: Link Name: …”* |

> Riêng đơn lập từ **phiếu sự cố** được miễn quy tắc kiểm tổng phương thức thanh toán.

### 2.2. Nên rà trước khi xác nhận

- **Sản phẩm, số lượng, đơn giá, chiết khấu** — sau khi xác nhận, sửa được nhưng phiền hơn nhiều.
- **Loại đơn** (`Sales Order Type`) — thường tự suy ra từ đội bán hàng, bình thường không cần sửa.
- **Tài khoản ngân hàng nhận tiền** — đổi sau khi đã có phiếu thu là hệ thống chặn.
- **Thông tin xuất hoá đơn và biên bản bàn giao** — tên công ty, mã số thuế, người đại diện.

---

## 3. Xác nhận đơn và các trạng thái

Bấm **Submit** là đơn có hiệu lực. Từ đó đơn đi theo trạng thái do **tiến độ giao hàng và xuất
hoá đơn** quyết định — không ai đặt tay trạng thái này.

| Trạng thái | Nghĩa | Số đơn hiện có |
|---|---|---|
| **Draft** — Nháp | Chưa xác nhận | 282 |
| **To Deliver and Bill** — Chờ giao, chờ hoá đơn | Đã xác nhận, chưa giao và chưa xuất hoá đơn | 1.880 |
| **To Bill** — Còn nợ hoá đơn | Đã giao đủ, chưa xuất hoá đơn đủ | 566 |
| **To Deliver** — Còn nợ hàng | Đã xuất hoá đơn đủ, chưa giao đủ | 17 |
| **Completed** — Hoàn tất | Đã giao đủ **và** xuất hoá đơn đủ | 45.014 |
| **Closed** — Đã đóng | Chủ động dừng phần còn lại | 2.347 |
| **On Hold** — Tạm giữ | Tạm dừng xử lý | 42 |
| **Cancelled** — Đã huỷ | Đã huỷ hiệu lực | 1.004 |

> 🔑 **Trạng thái *Hoàn tất* không chỉ là dấu chấm hết.** Nó là cú hích khởi động vòng chăm sóc:
> ngay khi đơn chuyển sang *Completed*, hệ thống sinh lịch nhắc bảo dưỡng cho từng vật tư trong
> đơn, và cộng điểm tích luỹ cho khách. Xem [Chặng 6](Quy-Trinh-06-Bao-Duong.html).

---

## 4. Sửa đơn sau khi đã xác nhận

Chọn cách theo thứ tự ưu tiên: cách nào ít phá chứng từ phía sau nhất thì dùng trước.

| Cần sửa gì | Cách làm | Ràng buộc |
|---|---|---|
| Sản phẩm, số lượng, giá, chiết khấu | Nút **Update Items** trên đơn | Đơn **đã xuất kho hàng vật lý** thì chỉ sửa được dòng *Giảm giá* và các mặt hàng không quản kho |
| Loại đơn, tài khoản ngân hàng, phương thức thanh toán, thông tin hoá đơn | Sửa thẳng trên form rồi **Lưu** | Đổi tài khoản ngân hàng bị chặn nếu đơn đã có phiếu thu |
| Khách hàng, bảng giá, ngày đặt, hàng vật lý đã xuất kho | **Huỷ và lập lại** (Amend) | Phải huỷ ngược chứng từ phía sau trước |
| Dừng hẳn phần còn lại | **Actions → Close** | Bị chặn nếu còn phiếu giao hàng hiệu lực |
| Tạm dừng, xử lý sau | **Actions → Hold** | Mở lại bằng **Actions → Re-open** |

### Thứ tự huỷ ngược — làm đúng thứ tự này

```
1. Phiếu thu       (Payment Entry)   → Cancel
2. Hoá đơn         (Sales Invoice)   → Cancel
3. Phiếu giao hàng (Delivery Note)   → Cancel
4. Đơn bán hàng    (Sales Order)     → Cancel
5. Trên đơn đã huỷ → Amend → bản mới ở trạng thái Nháp, mã có đuôi -1
```

> ⚠️ Khi sửa làm **đổi tổng tiền** mà đơn có **nhiều phương thức thanh toán**, hệ thống không
> tự chia lại. Phải sửa tay bảng phương thức cho khớp tổng mới, nếu không biên bản bàn giao
> in ra sẽ sai số tiền.

📚 Hướng dẫn thao tác từng tình huống kèm ảnh: [Sửa Sales Order — các tình huống thường gặp](Sua-Sales-Order.html).

---

## 5. Đơn bán hàng bàn giao cho chặng sau bằng gì

Sau khi xác nhận, đơn trở thành nguồn cho bốn nhánh chạy song song:

| Nhánh | Chứng từ sinh ra | Ai làm | Đọc tiếp |
|---|---|---|---|
| Cần người xuống hiện trường | Phiếu công việc (`FS Work Order`) | Điều phối | [Chặng 3](Quy-Trinh-03-Hien-Truong.html) |
| Cần vật tư để đi làm | Yêu cầu vật tư (`Material Request`) | Kỹ thuật viên | [Chặng 4](Quy-Trinh-04-Vat-Tu.html) |
| Giao hàng, thu tiền | Phiếu giao hàng, hoá đơn, phiếu thu | Kỹ thuật viên · Kế toán | [Chặng 5](Quy-Trinh-05-Giao-Hang-Thu-Tien.html) |
| Gửi hàng đi xa | Vận đơn (`DP Shipment`) | Kho · Kinh doanh | [Quy trình vận đơn](Delivery_Partner-Quy-Trinh.html) |

**Một đơn có thể có không phiếu công việc nào, một, hoặc nhiều.** Hệ thống không tự lập phiếu
công việc từ đơn — luôn phải có người bấm tạo. Đơn bán lẻ vật tư giao qua đơn vị vận chuyển
thì không cần phiếu công việc nào cả.

---

## 6. Ngoại lệ thường gặp ở chặng này

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| `Không cho phép thay đổi items (chỉ được phép thêm/xóa/thay đổi qty của 'Giảm giá' hoặc phi vật lý)` | Hàng vật lý của đơn đã xuất kho | Huỷ phiếu xuất kho hoặc phiếu giao hàng trước, hoặc nhờ quản trị viên xử lý |
| `Không thể Close Sales Order này vì đã có Delivery Note` | Còn phiếu giao hàng hiệu lực | Huỷ phiếu giao hàng trước rồi mới đóng hoặc huỷ đơn |
| `Không cho phép thay đổi Bank Account vì đã tạo phiếu thanh toán` | Đơn đã có phiếu thu | Huỷ phiếu thu, sửa tài khoản, lập lại phiếu thu |
| `Tổng tiền trong Payment Method phải bằng Grand Total` | Bảng phương thức thanh toán lệch tổng | Sửa số tiền từng dòng cho khớp |
| Đơn đã xác nhận nhưng **phiếu nhắc vẫn ở trạng thái Open** | Đơn lập tay, không lập từ nút trên phiếu nhắc | Nhờ quản trị viên gắn lại đường dẫn, hoặc đóng phiếu nhắc thủ công kèm ghi chú |
| Đơn hoàn tất mà **khách không được cộng điểm** | Khách chưa được gán chương trình tích điểm | Báo quản trị gán chương trình; chỉ các đơn phát sinh **sau đó** mới được tính |
| Đơn bị treo lâu ở **To Bill** | Đã giao hàng nhưng kế toán chưa xuất đủ hoá đơn | Đơn chưa hoàn tất thì **chưa sinh lịch bảo dưỡng** và **chưa cộng điểm** — cần rà định kỳ |
| Field bị xám, không sửa được sau khi xác nhận | Field không cho sửa sau khi xác nhận | Dùng **Huỷ và lập lại** |

---

## 7. Chặng tiếp theo

Đơn đã xác nhận. Nếu đơn cần người xuống hiện trường, đi tiếp:
**[Chặng 3 — Điều phối và thực hiện tại hiện trường](Quy-Trinh-03-Hien-Truong.html)**.
