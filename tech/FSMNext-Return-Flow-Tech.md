---
title: Cơ chế nghĩa vụ trả hàng (FSMNext)
layout: default
parent: Tài liệu kỹ thuật
nav_order: 11
---

# Cơ chế nghĩa vụ trả hàng — mô hình dữ liệu và các điểm chốt

> Đối tượng: **developer**, **system integrator**.
> Tài liệu mô tả mô hình nghĩa vụ trả vật tư của FSMNext, vị trí từng chốt kiểm tra trong mã
> nguồn, các bất biến phải giữ, lưu ý triển khai và những lỗ còn mở.
>
> Phần hướng dẫn vận hành xem **[Trả vật tư về kho](../users/FSMNext-Tra-Vat-Tu.html)**.

---

## 1. Mô hình dữ liệu

Nghĩa vụ trả hàng **không có doctype riêng**. Nó là phần tử trong một trường văn bản trên đơn
bán hàng, đối chiếu với dòng phiếu chuyển kho qua một trường tuỳ biến.

| Nơi lưu | Trường | Vai trò |
|---|---|---|
| `Sales Order` | `fs_returned_items_json` | Danh sách nghĩa vụ, dạng JSON trong cột văn bản |
| `Stock Entry Detail` | `fs_tracking_return_id` | Mã nghĩa vụ mà dòng trả hàng này thanh toán |
| `Stock Entry Detail` | `fs_sales_order` | Đơn bán hàng chứa nghĩa vụ đó |

Các khoá trong mỗi phần tử JSON (ngoài toàn bộ ảnh chụp của `Sales Order Item`):

| Khoá | Ý nghĩa |
|---|---|
| `_tracking_return_id` | Mã nghĩa vụ, `frappe.generate_hash(length=10)` |
| `_qty_returned` | Số phải trả. **Bằng 0 nghĩa là nghĩa vụ không còn hiệu lực** |
| `_qty_delivered_now` | Số thực giao tại phiếu giao hàng đó |
| `_original_so_qty` | Số lượng dòng đơn trước khi giảm, dùng khi huỷ phiếu giao |
| `_so_qty_adjusted` | `0` nếu đơn đã xuất hoá đơn nên không giảm số lượng dòng đơn |
| `_returned_at`, `_returned_by` | Thời điểm và người khai; `_returned_at` là khoá sắp xếp cho cơ chế vào trước ra trước |
| `_warehouse` | Kho kỹ thuật viên lúc khai. Rỗng thì nghĩa vụ hiện ở mọi kho |
| `_dn_name` | Phiếu giao hàng sinh ra nghĩa vụ, dùng để đối chiếu khi huỷ |
| `_settled_qty`, `_settled_by_se`, `_settled_on_dn_cancel` | Dấu vết khi huỷ phiếu giao mà nghĩa vụ đã trả xong |

### Bất biến phải giữ

1. **Chỉ `docstatus = 1` mới xoá nợ.** Mọi phép tính "đã trả" phải lọc phiếu đã duyệt.
2. **Phần tử `_qty_returned <= 0` không phải nghĩa vụ.** Mọi hàm đọc JSON phải bỏ qua.
3. **Nghĩa vụ là ảnh chụp văn bản.** Đổi tên mã vật tư cập nhật mọi trường liên kết nhưng
   **không** cập nhật cột văn bản này.
4. **Có hai đường tạo phiếu trả** — ứng dụng kỹ thuật viên và màn điều phối. Cả hai phải đi qua
   cùng một lõi, nếu không mỗi lần thêm chốt lại hụt một đường.

---

## 2. Các hàm tính toán

Trong `fsmnext/fsm_next/utils/wo_completion_validators.py`:

| Hàm | Trả về | Ghi chú |
|---|---|---|
| `_get_return_entries(so)` | Danh sách nghĩa vụ của một đơn | Đã lọc `_tracking_return_id` và `_qty_returned > 0` |
| `_get_required_for_trackings(tids)` | `{tid: {item_code: qty}}` | **Quét và phân tích JSON của toàn bộ đơn có nghĩa vụ.** Tốn khoảng 0,7 giây trên dữ liệu hiện tại — không gọi trong vòng lặp hoặc trên màn hình mở thường xuyên |
| `_get_transferred_for_trackings(tids)` | `{tid: {item_code: qty}}` | Chỉ `docstatus = 1`. Truy vấn có chỉ mục, rẻ |
| `_get_drafted_for_trackings(tids, exclude_se)` | `(qty_map, entries_map)` | Chỉ `docstatus = 0`; kèm tên phiếu để nêu trong thông báo lỗi |
| `_expand_to_stock_items(code, qty)` | `{item_code: qty}` | Nở bộ sản phẩm theo **cấu hình hiện tại**. Trả về `{}` khi `qty <= 0` |
| `_get_mr_received_for_sos(so_names)` | Số nhận qua phiếu yêu cầu vật tư, **theo từng phiếu công việc** | Dùng để chặn trên nghĩa vụ. Giả định sai — xem §9 |

Trong `fsmnext/fsm_next/api/technician_api/inventory.py`:

| Hàm | Vai trò |
|---|---|
| `_build_return_stock_entry(...)` | **Lõi dùng chung** của cả hai đường tạo phiếu |
| `_validate_return_tracking_not_duplicated(items)` | Chốt 1 và chốt 2 |
| `_autolink_return_tracking(sr, wh, items)` | Chốt 3 — gắn mã theo `_returned_at`, tách dòng, giữ phần dư |
| `_validate_return_stock_available(wh, items, exclude_se)` | Chốt 4 |
| `_get_committed_in_return_drafts(wh, exclude_se, only_uncovered)` | Số đã cam kết trong phiếu nháp xuất từ kho này |
| `_drop_rows_covered_by_open_obligation(rows)` | Bỏ dòng nháp thuộc nghĩa vụ **còn nợ** |
| `_return_flag(fieldname, default)` | Đọc cờ cấu hình, phân biệt *chưa khai* với *đã tắt* |
| `_get_pending_returns(...)` | Nội bộ, nhận `service_resource` |
| `get_pending_returns(...)` | Điểm vào công khai, **luôn lấy kỹ thuật viên theo phiên đăng nhập** |

---

## 3. Thứ tự chốt trong `_build_return_stock_entry`

Đánh số khớp với [tài liệu vận hành](../users/FSMNext-Tra-Vat-Tu.html#3-bốn-chốt-chặn-khi-tạo-phiếu-trả):

```
Chốt 0  Phạm vi kho nguồn / kho đích / có dòng qty > 0         → throw
Chốt 1  ┐ _validate_return_tracking_not_duplicated              → throw
        │   req và already >= req             → "Nghĩa vụ đã hoàn tất"
Chốt 2  ┘   qty > (req − already − in_draft)  → nêu rõ số còn chọn được
            không tra được req và in_draft > 0 → "Đã có phiếu chờ kho"
Chốt 3  _autolink_return_tracking (nếu cờ bật)                  → không bao giờ throw
Chốt 4  _validate_return_stock_available                        → throw hoặc msgprint
        se.insert()  — giữ nguyên trạng thái nháp
```

Chốt 1–2 chạy **trước** khi gắn mã tự động, vì các dòng do chốt 3 gắn chỉ nhận nghĩa vụ có phần
còn chọn được lớn hơn 0, nên không cần kiểm lại. Chốt 4 chạy **sau** khi gắn mã, để cộng dồn
số lượng theo mã vật tư trên toàn bộ dòng cuối cùng.

### Công thức phần còn chọn được

```
remaining  = required − transferred(docstatus=1)
selectable = max(0, remaining − drafted(docstatus=0))
```

`get_pending_returns` giữ nguyên nghĩa cũ của `qty_pending` (= `remaining`) để không phá các
điểm gọi khác, và bổ sung `qty_in_draft`, `qty_selectable`, `draft_entries`, `returned_at`.

> ⚠️ **Chỉ chặn đúng phần vượt.** Nghĩa vụ nhiều đơn vị được trả làm nhiều lần; thấy
> `drafted > 0` mà chặn cả nghĩa vụ là chặn oan, vì giao diện vẫn cho chọn phần còn lại.

---

## 4. Nhất quán giữa hiển thị và chốt chặn

Giao diện tính hàng lẻ khả dụng bằng:

```
tồn Bin − Σ qty_pending (nghĩa vụ cùng vật tư) − qty_committed_in_draft
```

Chốt 4 tính:

```
tồn Bin − Σ mọi cam kết trong phiếu nháp
```

Để hai công thức không lệch, `qty_committed_in_draft` chỉ đếm phần mà danh sách nghĩa vụ
**không che**: dòng không mã, và dòng mang mã của nghĩa vụ **đã hết nợ** (phiếu nháp thừa). Đó
là tham số `only_uncovered=True`.

`_drop_rows_covered_by_open_obligation` **không** dùng `_get_required_for_trackings`, mà đọc
JSON của **đúng những đơn bán hàng mà dòng nháp trỏ tới** qua `fs_sales_order`:

| Cách làm | Thời gian `get_ktv_warehouse_items` |
|---|---|
| Gọi `_get_required_for_trackings` | 0,89 giây |
| Lọc trước bằng `LIKE` trên cột JSON | chậm gấp 3 — **không dùng** |
| Đọc JSON theo `fs_sales_order` | **0,086 giây** |

Dòng nháp có mã nhưng không tra được nghĩa vụ thì **bỏ qua** (coi như đã có chỗ giữ): thà hiển
thị dư còn hơn giấu mất hàng kỹ thuật viên đang thật sự giữ.

---

## 5. Huỷ phiếu giao hàng

`cancel_delivery_note` trong `technician_api/delivery_note.py`:

- Có chốt `dn.docstatus != 1` ở đầu hàm nên không chạy được hai lần. Điều này quan trọng: chạy
  hai lần sẽ khôi phục số lượng dòng đơn hai lần.
- Với nghĩa vụ của phiếu bị huỷ, `_settled_return_entry(ret_item)` tra xem đã có phiếu chuyển
  kho **đã duyệt** nào mang mã đó. Có thì **giữ** phần tử với `_qty_returned = 0` cộng các khoá
  `_settled_*`, thay vì xoá.
- Nghĩa vụ đã trả xong **vẫn** vào `items_to_restore`: số lượng dòng đơn phải trở về
  `_original_so_qty` vì cả phiếu giao đang bị huỷ, độc lập với việc hàng đang nằm ở kho nào.

---

## 6. Cấu hình

| Cờ trong `FSM Settings` | Mặc định | Tác dụng |
|---|---|---|
| `auto_link_return_tracking` | `1` | Bật chốt 3 (gắn mã tự động) |
| `block_return_when_insufficient` | `0` | `0` = cảnh báo, `1` = chặn cứng ở chốt 4 |
| `validate_stock_return_on_wo_complete` | `0` | Gác **cả hai**: validator hoàn thành phiếu công việc **và** `validate_return_tracking_qty` ở `before_submit` của phiếu chuyển kho |

### Bẫy khi thêm cờ mới vào Single doctype

Trường mới thêm vào một Single doctype **không có dòng nào trong `tabSingles`** cho tới khi có
người mở cấu hình và lưu. Hai hàm tiện dụng đều nói dối ở tình huống này:

- `frappe.db.get_single_value` **ép giá trị thiếu của trường Check thành `0`**, nên không phân
  biệt được *chưa khai* với *đã tắt*.
- `frappe.db.exists("Singles", {...})` **luôn trả `None`** dù dòng có thật, vì `tabSingles`
  không có cột `name`.

Vì vậy `_return_flag` và patch `fsmnext.patches.v1_0.set_return_guard_defaults` đều truy vấn
thẳng bảng:

```python
row = frappe.db.sql(
    "SELECT value FROM tabSingles WHERE doctype = %s AND field = %s",
    ("FSM Settings", fieldname),
)
if not row or row[0][0] is None or row[0][0] == "":
    return default
return cint(row[0][0])
```

---

## 7. Triển khai

1. `bench migrate` — patch `fsmnext.patches.v1_0.set_return_guard_defaults` nằm ở nhóm
   `post_model_sync`, ghi giá trị mặc định cho hai cờ mới và **không ghi đè** giá trị đã có.
2. **Kiểm tra trường đã đồng bộ vào meta chưa.** Thay đổi trong tệp JSON của doctype hay bị
   `bench migrate` bỏ qua âm thầm do chốt `migration_hash`. Không thấy trường thì chạy
   `bench --site <site> reload-doctype "FSM Settings"` rồi chạy lại patch.
3. `bench clear-cache`. Không cần `bench build` — bundle đã nằm trong `fsmnext/public/`.
4. Giữ `block_return_when_insufficient = 0` cho tới khi dọn xong tồn đọng.

### Bộ kiểm

```
bench --site <site> execute fsmnext.fsm_next.tests.verify_return_guards.run
```

Ba nhóm: hàm tính toán (đối chiếu với SQL độc lập), luồng đầu-cuối (tạo phiếu thật rồi xoá,
đối chiếu số chứng từ trước và sau), regression các màn dùng chung. Nhóm kiểm cờ cấu hình đi
qua đủ năm trạng thái của `tabSingles`: không có dòng, `'0'`, `'1'`, rỗng, `NULL`.

---

## 8. Đã kiểm và loại trừ

| Nghi vấn | Kết luận |
|---|---|
| Lệch đơn vị tính giữa `Stock Entry Detail.qty` và `Bin.actual_qty` | Không xảy ra: 0 trong 131.232 dòng có hệ số quy đổi khác 1; kho kỹ thuật viên không có vật tư nhiều đơn vị; `get_ktv_warehouse_items` trả `stock_uom` |
| Phần tử `_qty_returned = 0` phá các hàm đọc JSON | Không: mọi hàm đều lọc `> 0`, và `_expand_to_stock_items` trả `{}` khi `qty <= 0` |
| Nhiều nơi ghi `fs_returned_items_json` gây mất khoá lạ | Chỉ 3 điểm gọi `_save_returned_items_json`, đều `json.dumps` nguyên phần tử |
| `validate_mi_item_rules_on_desk` ảnh hưởng phiếu trả | Không: chỉ áp dụng cho `Material Issue` |
| Trùng kho với hệ kho nhân viên của `hr_for_cobegroup` | Không: `tabHR Employee Warehouse` có 4 dòng, **0 kho giao nhau** với 191 kho kỹ thuật viên |
| Kỹ thuật viên bị chặn bởi phiếu nháp không xoá được | Không xảy ra trên dữ liệu hiện tại: 0 phiếu nháp có mã nghĩa vụ thuộc chủ khác kỹ thuật viên |

---

## 9. Lỗ còn mở

### Chốt duyệt phiếu dùng chung cờ với validator hoàn thành phiếu công việc

`validate_return_tracking_qty` (chặn **duyệt** phiếu trả vượt nghĩa vụ) và `validate_stock_return`
(chặn **hoàn thành** phiếu công việc khi chưa trả đủ) cùng bị gác bởi
`validate_stock_return_on_wo_complete`. Cờ này đang `0`, nên cả hai đều tắt.

Hệ quả: các chốt ở §3 chỉ bảo vệ **lúc tạo**. Trên dữ liệu hiện tại có **109 dòng nháp thuộc 46
phiếu** trỏ vào nghĩa vụ đã trả xong, trong đó **29 dòng thuộc 16 phiếu (29 đơn vị) vẫn còn đủ
tồn** — duyệt là trừ kho lần thứ hai.

Hai hướng xử lý: tách cờ riêng cho chốt duyệt rồi bật, hoặc dọn sạch các phiếu nháp thừa trước.
Bật cờ hiện tại thì kéo theo cả validator hoàn thành phiếu công việc, sẽ chặn nhiều phiếu đang
có nghĩa vụ treo.

### Chặn trên nghĩa vụ theo phiếu công việc là sai tiền đề

`get_pending_returns` và `validate_stock_return` tính:

```
phải trả = min(số khai trả, nhận qua phiếu yêu cầu gắn ĐÚNG phiếu công việc này − đã giao)
```

`_get_mr_received_for_sos` coi `Material Request Item.fs_work_order` là sự thật. Thực tế **phiếu
yêu cầu vật tư không thuộc ca nào**: kỹ thuật viên bổ sung hàng cho kho mình bất cứ lúc nào.
Trường này có giá trị chỉ vì `create_material_request_from_mobile` bắt buộc chọn một lịch hẹn —
99% phiếu yêu cầu vào kho kỹ thuật viên có trường này (13.538/13.674), nhưng đó là giá trị danh nghĩa.

Hệ quả đo được: **508 nghĩa vụ bị đưa về 0** (568 đơn vị, 8% tổng số khai trả). Chỉ 12 trường hợp là
hợp lý (phiếu công việc có nhận nhưng đã giao hết). Trong 496 trường hợp còn lại, **354 (71%)** kho kỹ
thuật viên có nhận đúng vật tư đó trong 30 ngày trước, qua phiếu yêu cầu gắn **phiếu công việc khác**.

Hướng sửa: đổi phạm vi chặn trên từ *theo phiếu công việc* sang *theo kho kỹ thuật viên*. Cùng một
công thức đang dùng ở ba nơi — `get_pending_returns`, `validate_stock_return` và
`master_view._get_return_status` — nên phải sửa đồng bộ.

Ảnh hưởng tới các chốt ở §3: chốt 1–2 dùng số **chưa** chặn trên nên không chặn oan; chốt 3 dùng
danh sách **đã** chặn trên nên không gắn được mã cho các nghĩa vụ này.

### Gửi trùng yêu cầu trong cùng một giây

Hai yêu cầu tạo phiếu gửi gần như đồng thời đều đọc thấy chưa có phiếu nháp nào nên đều đi qua
chốt 1–2. Nút xác nhận trên giao diện đã khoá trong lúc gửi, và cặp phiếu trùng gần nhau nhất đo
được cách nhau 4 giây, nên chốt hiện tại bắt được. Muốn chắc chắn thì cần một khoá phân tán
theo danh sách mã nghĩa vụ.

### Nghĩa vụ trỏ mã vật tư đã đổi tên

Cần một tác vụ dữ liệu ánh xạ mã cũ sang mã mới trong `fs_returned_items_json`. Chưa có hook
`after_rename` cho `Item` để phòng trường hợp tái diễn.

---

## Liên quan

- **[Trả vật tư về kho](../users/FSMNext-Tra-Vat-Tu.html)** — hướng dẫn vận hành
- **[Quy trình dịch vụ hiện trường](../users/FSMNext-Quy-Trinh-Dich-Vu.html)** — vòng đời phiếu công việc và lịch hẹn
