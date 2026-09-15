---
title: 2 · Đơn bán hàng
layout: default
parent: Quy trình hợp nhất
nav_order: 3
---

# Chặng 2 — Đơn bán hàng
{: .no_toc }

**Vai trò thực hiện:** Kinh doanh · Chăm sóc khách hàng · Nhân viên dịch vụ · Kế toán
{: .fs-3 .text-grey-dk-000 }

Đơn bán hàng (`Sales Order`) là **trục chính** của toàn hệ thống. Mọi chứng từ phía sau đều
tham chiếu về đơn: phiếu công việc, yêu cầu vật tư, phiếu giao hàng, hoá đơn, phiếu thu và cả
lịch bảo dưỡng cho các năm tiếp theo.

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ vòng đời đơn hàng

<a href="images/svg/quy-trinh/03-don-hang-vong-doi.svg" title="Bấm để phóng to">
  <img src="images/svg/quy-trinh/03-don-hang-vong-doi.svg" alt="Đơn bán hàng đi từ Nháp, qua xác nhận thành Chờ giao và chờ hoá đơn, rồi Còn nợ một vế, cuối cùng là Hoàn tất. Ba nhánh rẽ là Tạm giữ, Đóng đơn và Đã huỷ; đơn đã huỷ lập lại được bằng bản sửa lại" style="width:100%;height:auto">
</a>

---

## 1. Ba nguồn lập đơn

| Nguồn | Cách lập | Số đơn | Trường hợp áp dụng |
|---|---|---|---|
| **Khách hàng mới hoặc khách hàng chủ động liên hệ** | Lập trực tiếp trên Desk | 28.775 | Đơn bán thiết bị mới, bán lẻ vật tư |
| **Từ phiếu nhắc bảo dưỡng** | Chức năng **Tạo → Sales Order** trên phiếu nhắc | 19.056 | Đơn thay lõi, bảo dưỡng định kỳ |
| **Từ phiếu sự cố** | Chức năng **Tạo → Sales Order** trên phiếu sự cố | 3.321 | Đơn thay linh kiện khi sửa chữa có tính phí |

Hai nguồn sau có ý nghĩa quan trọng: khi lập đơn bằng chức năng trên chứng từ gốc, hệ thống
**ghi liên kết ngược** về phiếu nhắc hoặc phiếu sự cố. Nhờ đó:

- Chứng từ gốc tự chuyển sang trạng thái **Converted** ngay khi đơn được xác nhận, và tự
  chuyển sang **Cancelled** nếu đơn bị huỷ. Nhân viên không phải cập nhật thủ công.
- Báo cáo tính được tỉ lệ chốt của từng nhân sự và từng đợt chăm sóc.

> ⚠️ Lập đơn bằng cách tạo mới trên Desk rồi nhập thủ công tên khách hàng sẽ **mất liên kết
> ngược**. Phiếu nhắc giữ nguyên trạng thái *Open* dù khách hàng đã mua, và kết quả của người
> chốt đơn không được ghi nhận.

---

## 2. Nội dung cần khai trên đơn

### 2.1. Nội dung bắt buộc, hệ thống từ chối nếu sai

| Nội dung | Quy tắc | Thông báo khi vi phạm |
|---|---|---|
| **Sales Team** (đội bán hàng) | Tối thiểu một người, **không được trùng người** | *“Bắt buộc phải có ít nhất 1 Sales Person trong Sales Team.”* · *“Không thể chọn trùng người trong Sales Team.”* |
| **Payment Methods** (phương thức thanh toán) | Tổng tiền các dòng phải **bằng tổng giá trị đơn**, chênh lệch tối đa 100 đồng | *“Tổng tiền trong Payment Method phải bằng Grand Total…”* |
| **Khách hàng, địa chỉ, liên hệ** | Phải trỏ tới hồ sơ tồn tại và được liên kết đúng | *“Could not find Row #…: Link Name: …”* |

> Riêng đơn lập từ **phiếu sự cố** không áp dụng quy tắc kiểm tra tổng phương thức thanh toán.

### 2.2. Nội dung cần rà soát trước khi xác nhận

- **Hàng hoá, số lượng, đơn giá, chiết khấu** — sau khi xác nhận vẫn điều chỉnh được nhưng
  thủ tục phức tạp hơn nhiều.
- **Loại đơn** (`Sales Order Type`) — thường được suy ra từ đội bán hàng, thông thường không
  cần điều chỉnh.
- **Tài khoản ngân hàng nhận tiền** — không thay đổi được sau khi đơn đã có phiếu thu.
- **Thông tin xuất hoá đơn và biên bản bàn giao** — tên công ty, mã số thuế, người đại diện.

---

## 3. Xác nhận đơn và các trạng thái

Sau khi xác nhận (Submit), đơn có hiệu lực. Từ thời điểm đó, trạng thái đơn do **tiến độ giao
hàng và xuất hoá đơn** quyết định; không vai trò nào đặt trạng thái này thủ công.

| Trạng thái | Ý nghĩa | Số đơn hiện có |
|---|---|---|
| **Draft** — Nháp | Chưa xác nhận | 282 |
| **To Deliver and Bill** — Chờ giao, chờ hoá đơn | Đã xác nhận, chưa giao và chưa xuất hoá đơn | 1.880 |
| **To Bill** — Còn nợ hoá đơn | Đã giao đủ, chưa xuất hoá đơn đủ | 566 |
| **To Deliver** — Còn nợ hàng | Đã xuất hoá đơn đủ, chưa giao đủ | 17 |
| **Completed** — Hoàn tất | Đã giao đủ **và** xuất hoá đơn đủ | 45.014 |
| **Closed** — Đã đóng | Chủ động dừng phần còn lại | 2.347 |
| **On Hold** — Tạm giữ | Tạm dừng xử lý | 42 |
| **Cancelled** — Đã huỷ | Đã huỷ hiệu lực | 1.004 |

> 🔑 **Trạng thái *Hoàn tất* không chỉ là điểm kết thúc.** Đây là mốc khởi động vòng chăm sóc:
> ngay khi đơn chuyển sang *Completed*, hệ thống phát sinh lịch nhắc bảo dưỡng cho từng vật tư
> trong đơn và cộng điểm tích luỹ cho khách hàng. Xem
> [Chặng 6](Quy-Trinh-06-Bao-Duong.html).

---

## 4. Điều chỉnh đơn sau khi đã xác nhận

Lựa chọn phương án theo thứ tự ưu tiên: phương án nào ít tác động tới chứng từ phía sau nhất
thì áp dụng trước.

| Nội dung cần điều chỉnh | Phương án | Ràng buộc |
|---|---|---|
| Hàng hoá, số lượng, giá, chiết khấu | Chức năng **Update Items** trên đơn | Nếu đơn **đã xuất kho hàng vật lý**, chỉ điều chỉnh được dòng *Giảm giá* và các mặt hàng không quản lý tồn kho |
| Loại đơn, tài khoản ngân hàng, phương thức thanh toán, thông tin hoá đơn | Điều chỉnh trực tiếp trên form rồi **Lưu** | Không đổi được tài khoản ngân hàng nếu đơn đã có phiếu thu |
| Khách hàng, bảng giá, ngày đặt, hàng vật lý đã xuất kho | **Huỷ và lập lại** (Amend) | Phải huỷ ngược chứng từ phía sau trước |
| Dừng phần còn lại của đơn | **Actions → Close** | Không thực hiện được nếu còn phiếu giao hàng hiệu lực |
| Tạm dừng để xử lý sau | **Actions → Hold** | Mở lại bằng **Actions → Re-open** |

### Trình tự huỷ ngược

```
1. Phiếu thu       (Payment Entry)   → Cancel
2. Hoá đơn         (Sales Invoice)   → Cancel
3. Phiếu giao hàng (Delivery Note)   → Cancel
4. Đơn bán hàng    (Sales Order)     → Cancel
5. Trên đơn đã huỷ → Amend → bản mới ở trạng thái Nháp, mã có hậu tố -1
```

> ⚠️ Khi điều chỉnh làm **thay đổi tổng giá trị đơn** mà đơn có **nhiều phương thức thanh
> toán**, hệ thống không tự phân bổ lại. Người lập phải cập nhật bảng phương thức thanh toán
> cho khớp tổng mới, nếu không biên bản bàn giao in ra sẽ sai số tiền.

📚 Hướng dẫn thao tác từng tình huống kèm hình minh hoạ: [Sửa Sales Order — các tình huống thường gặp](Sua-Sales-Order.html).

---

## 5. Bàn giao cho các chặng sau

Sau khi xác nhận, đơn trở thành nguồn cho bốn nhánh vận hành song song:

| Nhánh | Chứng từ phát sinh | Vai trò thực hiện | Tham khảo |
|---|---|---|---|
| Cần bố trí nhân sự xuống hiện trường | Phiếu công việc (`FS Work Order`) | Điều phối | [Chặng 3](Quy-Trinh-03-Hien-Truong.html) |
| Cần cấp vật tư để thực hiện | Yêu cầu vật tư (`Material Request`) | Kỹ thuật viên | [Chặng 4](Quy-Trinh-04-Vat-Tu.html) |
| Giao hàng và thu tiền | Phiếu giao hàng, hoá đơn, phiếu thu | Kỹ thuật viên · Kế toán | [Chặng 5](Quy-Trinh-05-Giao-Hang-Thu-Tien.html) |
| Gửi hàng đi xa | Vận đơn (`DP Shipment`) | Kho · Kinh doanh | [Quy trình vận đơn](Delivery_Partner-Quy-Trinh.html) |

**Một đơn có thể không phát sinh phiếu công việc nào, hoặc phát sinh một hay nhiều phiếu.** Hệ
thống không tự lập phiếu công việc từ đơn; luôn phải có người thực hiện thao tác lập. Đơn bán
lẻ vật tư gửi qua đơn vị vận chuyển không cần phiếu công việc.

---

## 6. Ngoại lệ thường gặp

| Hiện tượng | Nguyên nhân | Hướng xử lý |
|---|---|---|
| `Không cho phép thay đổi items (chỉ được phép thêm/xóa/thay đổi qty của 'Giảm giá' hoặc phi vật lý)` | Hàng vật lý của đơn đã xuất kho | Huỷ phiếu xuất kho hoặc phiếu giao hàng trước, hoặc chuyển quản trị viên xử lý |
| `Không thể Close Sales Order này vì đã có Delivery Note` | Còn phiếu giao hàng hiệu lực | Huỷ phiếu giao hàng trước khi đóng hoặc huỷ đơn |
| `Không cho phép thay đổi Bank Account vì đã tạo phiếu thanh toán` | Đơn đã có phiếu thu | Huỷ phiếu thu, cập nhật tài khoản, lập lại phiếu thu |
| `Tổng tiền trong Payment Method phải bằng Grand Total` | Bảng phương thức thanh toán lệch tổng | Cập nhật số tiền từng dòng cho khớp |
| Đơn đã xác nhận nhưng **phiếu nhắc vẫn ở trạng thái Open** | Đơn được lập thủ công, không qua chức năng trên phiếu nhắc | Đề nghị quản trị viên gắn lại liên kết, hoặc đóng phiếu nhắc thủ công kèm ghi chú |
| Đơn hoàn tất nhưng **khách hàng không được cộng điểm** | Khách hàng chưa được gán chương trình tích điểm | Báo quản trị viên gán chương trình; chỉ các đơn phát sinh **sau đó** mới được tính |
| Đơn tồn đọng lâu ở trạng thái **To Bill** | Đã giao hàng nhưng kế toán chưa xuất đủ hoá đơn | Đơn chưa hoàn tất thì **chưa phát sinh lịch bảo dưỡng** và **chưa cộng điểm**; cần rà soát định kỳ |
| Ô dữ liệu bị khoá sau khi xác nhận | Ô không cho phép điều chỉnh sau khi xác nhận | Áp dụng phương án **Huỷ và lập lại** |

---

## 7. Chặng tiếp theo

Đơn đã được xác nhận. Nếu đơn cần bố trí nhân sự xuống hiện trường, đọc tiếp:
**[Chặng 3 — Điều phối và thực hiện tại hiện trường](Quy-Trinh-03-Hien-Truong.html)**.
