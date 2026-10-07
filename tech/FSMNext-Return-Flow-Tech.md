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
| `_settled_moved_to`, `_settled_moved_qty` | Phần đã trả của phiếu giao bị huỷ đã được chuyển sang nghĩa vụ nào khi phiếu giao được lập lại |
| `_pending_return_drafts` | Danh sách phiếu trả **nháp** đang trỏ vào nghĩa vụ lúc huỷ phiếu giao; phần tử được giữ lại thay vì xoá |
| `_qty_returned_declared` | Số khai gốc, giữ lại khi `_qty_returned` bị hạ xuống do cấn trừ hoặc do đóng vì không giữ hàng |
| `_credited_qty`, `_credited_from` | Phần được cấn từ dòng phiếu trả thừa của nghĩa vụ anh em (cùng đơn, cùng vật tư) |
| `_not_held_since` | Ngày đầu tiên nghĩa vụ rơi vào trạng thái không giữ hàng, do job đêm ghi; **không bị xoá** khi có hàng trở lại |
| `_closed_not_held_qty`, `_closed_at`, `_closed_reason` | Dấu vết khi job đóng nghĩa vụ vì không giữ hàng quá N ngày (`_qty_returned` về 0) |

### Bất biến phải giữ

1. **Chỉ `docstatus = 1` mới xoá nợ.** Mọi phép tính "đã trả" phải lọc phiếu đã duyệt.
2. **Phần tử `_qty_returned <= 0` không phải nghĩa vụ.** Mọi hàm đọc JSON phải bỏ qua.
3. **Nghĩa vụ là ảnh chụp văn bản.** Đổi tên mã vật tư cập nhật mọi trường liên kết nhưng
   **không** cập nhật cột văn bản này.
4. **Có hai đường tạo phiếu trả** — ứng dụng kỹ thuật viên và màn điều phối. Cả hai phải đi qua
   cùng một lõi, nếu không mỗi lần thêm chốt lại hụt một đường.
5. **Số bị đòi không vượt tồn kho.** Với mỗi cặp (kho kỹ thuật viên, vật tư kho),
   Σ `qty_pending` của mọi nghĩa vụ ≤ `Bin.actual_qty`. Mọi màn hình đọc nợ phải đi qua
   `compute_return_ledger` (§2a) — tự cộng trừ từ JSON là phá bất biến này.

---

## 2. Các hàm tính toán

### 2a. Sổ nợ — nguồn duy nhất

`fsmnext/fsm_next/utils/return_ledger.py` — `compute_return_ledger(so_names | service_resource | work_order)`
trả về một dòng cho mỗi (nghĩa vụ, vật tư kho) có `qty_required > 0`, kể cả dòng đã trả xong
(`held_reason = paid`) và dòng không giữ hàng (`held_reason = not_held`), để màn hình giải
thích được vì sao không đòi. Nghĩa vụ chưa từng nhận cho đơn (điều kiện 2 bằng 0) không có dòng.

```
required   = min(khai, nhận qua Material Request gắn phiếu công việc của đơn − đã giao)   # chặn trên cũ
owed       = required − transferred(docstatus = 1)
pending    = phần của owed được chia từ Bin.actual_qty của (kho, vật tư)                  # mới
not_held   = owed − pending
selectable = max(0, pending − drafted(docstatus = 0))
```

Chia tồn kho (`_allocate_stock`): gom dòng theo (kho, vật tư kho), sắp theo `_returned_at`
**giảm dần** (khai gần đây nhất lấy trước), trừ dần `max(0, actual_qty)`. Dòng không ghi kho
(dữ liệu cũ) giữ hành vi cũ: `pending = owed`.

Phạm vi tính: các nghĩa vụ được hỏi **cộng** mọi nghĩa vụ trong hệ thống cùng cặp (kho, vật tư)
với chúng, dù thuộc đơn nào — thiếu bước này hai đơn sẽ cùng đòi một món. Cách lấy phạm vi là
đọc và phân tích toàn bộ JSON (`_load_all_entries`, ~0,75 giây cho 3.500 đơn) rồi lọc trong
Python; lọc trước bằng `LIKE` trên cột JSON (đang nén) tốn 0,6 giây **mỗi kho**, còn đi đường
ca → đơn của kỹ thuật viên thì phình tới 4.000 đơn khi hỏi một trang báo cáo.

| Điểm gọi | Dùng gì |
|---|---|
| `technician_api/inventory._get_pending_returns(..., include_not_held)` | Màn *Trả vật tư*; mặc định chỉ dòng `pending > 0` |
| `technician_api/appointment.get_appointment_detail` | Khoá `return_ledger` (đủ cả không giữ hàng) cho tab Đơn hàng; `has_pending_returns` theo `pending > 0` |
| `utils/wo_completion_validators.validate_stock_return` / `get_stock_return_shortages` | Chặn hoàn thành phiếu công việc theo `pending`; trả thêm `not_held` để báo cáo giải thích |
| `api/dispatch/frontend/master_view._get_return_status` | Màn điều phối, thêm `not_held_qty` |
| `api/report_api/master_view` | Xuất Excel: dòng *Không đòi: … không giữ hàng n* |
| `api/sales_order_api.get_return_ledger_for_sales_order` | Desk, cột *Return Status* trong `public/js/sales_order.js`; có `has_permission("read")` |

Hiệu năng đo trên bản sao dữ liệu thật: một kỹ thuật viên 0,9 giây (trước đây gần 10 giây vì
lặp từng phiếu công việc), trang 20 đơn 0,9 giây, toàn hệ thống 5,5 giây.
`_so_names_for_service_resource` lấy toàn bộ đơn của các ca kỹ thuật viên bằng **một** truy vấn
`UNION` (`FS Work Order.sales_order` ∪ `FS Work Order Line Item.order`); ba chỉ mục đi kèm ở §7.

### 2b. Job đêm đóng nghĩa vụ không giữ hàng

`close_not_held_return_obligations` (scheduler `daily` trong `hooks.py`):

1. Tính sổ toàn hệ thống, rồi `frappe.db.commit()` để thoát snapshot `REPEATABLE READ`.
2. Quyết định theo mã nghĩa vụ: **bỏ qua** nếu còn dòng `pending > 0`, có dòng không rõ kho,
   hoặc có phiếu nháp (`qty_drafted > 0`); chưa có `_not_held_since` thì `mark`; đã quá N ngày
   thì `close`.
3. Với **từng đơn có quyết định**: `SELECT … FOR UPDATE`, đọc lại JSON tươi, sửa **đúng phần tử
   theo mã**, lưu, commit. Không ghi nguyên danh sách từ bản đã tính ở bước 1 — làm vậy là xoá
   nghĩa vụ vừa sinh hoặc làm sống lại nghĩa vụ vừa huỷ trong lúc job chạy.

Dấu `_not_held_since` **không bao giờ bị xoá** khi hàng xuất hiện trở lại. Lý do: kỹ thuật viên
nhận cùng vật tư cho ca mới (chưa khai không giao nên chưa có nghĩa vụ mới) làm sổ chia tồn cho
nghĩa vụ cũ → nghĩa vụ cũ "giữ hàng" trở lại. Xoá dấu lúc đó thì vật tư nào kỹ thuật viên dùng
thường xuyên, nghĩa vụ cũ không bao giờ đóng. Thay vào đó job chỉ hoãn: hàng rời kho lần nữa là
đóng ngay khi đủ ngày.

N đọc từ `FSM Settings.return_not_held_close_days` thẳng trong `tabSingles` (thiếu dòng → 14,
`0` → tắt). Chạy lần đầu trên dữ liệu thật đánh dấu 69 nghĩa vụ, 8,8 giây; chạy lại cùng ngày
không đổi gì.

### 2c. Các hàm nền

Trong `fsmnext/fsm_next/utils/wo_completion_validators.py`:

| Hàm | Trả về | Ghi chú |
|---|---|---|
| `_get_return_entries(so)` | Danh sách nghĩa vụ của một đơn | Đã lọc `_tracking_return_id` và `_qty_returned > 0` |
| `_get_required_for_trackings(tids)` | `{tid: {item_code: qty}}` | **Quét và phân tích JSON của toàn bộ đơn có nghĩa vụ.** Tốn khoảng 0,7 giây trên dữ liệu hiện tại — không gọi trong vòng lặp hoặc trên màn hình mở thường xuyên |
| `_get_transferred_for_trackings(tids)` | `{tid: {item_code: qty}}` | Chỉ `docstatus = 1`. Truy vấn có chỉ mục, rẻ |
| `_get_drafted_for_trackings(tids, exclude_se)` | `(qty_map, entries_map)` | Chỉ `docstatus = 0`; kèm tên phiếu để nêu trong thông báo lỗi |
| `_expand_to_stock_items(code, qty)` | `{item_code: qty}` | Nở bộ sản phẩm theo **cấu hình hiện tại**. Trả về `{}` khi `qty <= 0`. Sổ nợ dùng bản gom (`_bundle_expander`, hai truy vấn cho toàn bộ) |
| `_get_mr_received_for_sos(so_names)` | Số nhận qua phiếu yêu cầu vật tư, **theo từng phiếu công việc** | Chặn trên nghĩa vụ (điều kiện 2). Giữ nguyên theo quyết định nghiệp vụ: vật tư được theo dõi theo phiếu yêu cầu kỹ thuật viên gửi cho đơn nào |

Trong `fsmnext/fsm_next/api/technician_api/inventory.py`:

| Hàm | Vai trò |
|---|---|
| `_build_return_stock_entry(..., skip_autolink)` | **Lõi dùng chung** của cả hai đường tạo phiếu; `skip_autolink=1` là nút *Trả lẻ, không tính* |
| `_preview_return_autolink(...)` / `preview_return_autolink` | Bảng xem trước của chốt 3: trả về danh sách dòng **sẽ** được gắn mã (đánh dấu theo dòng bằng `_autolinked`, không theo mã) để giao diện hỏi trước khi tạo phiếu. Màn điều phối dùng `ma_preview_return_autolink` |
| `_validate_return_tracking_not_duplicated(items)` | Chốt 1 và chốt 2, **cộng dồn theo (mã, vật tư)** trên toàn phiếu; mã không còn trong sổ (phiếu giao vừa thay đổi) bị chặn với thông báo riêng, kiểm **sau** kiểm phiếu nháp |
| `_autolink_return_tracking(sr, wh, items)` | Chốt 3 — gắn mã theo `_returned_at`, tách dòng, giữ phần dư; **trừ** phần kỹ thuật viên đã chọn tường minh để không gắn chồng |
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
owed       = required − transferred(docstatus=1)
pending    = phần của owed được chia từ tồn kho (kho, vật tư)      # §2a
selectable = max(0, pending − drafted(docstatus=0))
```

`get_pending_returns` giữ tên `qty_pending` nhưng nghĩa đã đổi: từ *còn nợ theo giấy* thành
*còn nợ và đang giữ hàng*. Bổ sung `qty_not_held`, `held_reason`, `qty_in_draft`,
`qty_selectable`, `draft_entries`, `returned_at`.

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

## 4b. Kho kỹ thuật viên không âm — chốt cuối cùng cho mọi đường

`fsmnext_extend_cobe/api/stock_validators.py`, gắn qua `hooks.py` của app đó:

| Hook | Hàm | Chặn gì |
|---|---|---|
| `Stock Entry.before_submit`, `Delivery Note.before_submit` | `validate_no_negative_ktv_stock` | Xuất khỏi kho kỹ thuật viên làm sổ âm **tại mốc ghi sổ** hoặc bất kỳ mốc nào sau đó |
| `Stock Entry.before_cancel` | `validate_no_negative_ktv_stock_on_cancel` | Huỷ phiếu **nhập** vào kho kỹ thuật viên khi số đó đã được xuất đi sau mốc nhập |

Vì sao cần dù các chốt ở §3 đã có: chốt §3 nằm trong mã của **từng đường tạo** (ứng dụng, điều
phối) và chỉ bảo vệ **lúc tạo**. Đo 90 ngày (bản 07/10/2026) trên kho kỹ thuật viên đang hoạt
động: 37 phiếu giao + 24 phiếu chuyển kho làm sổ âm. Phân loại:

- 28 phiếu giao từ ứng dụng trước khi `_validate_stock_availability` lên (09/09); 0 phiếu sau đó.
- 9 phiếu giao từ màn điều phối (`ma_create_delivery_note` không có chốt) và Desk (không hook).
- 14 phiếu chuyển kho **ghi lùi ngày**: kỹ thuật viên lập nháp, kho duyệt vài ngày sau với
  *Edit Posting Date and Time* — hook cũ đọc `Bin.actual_qty` **hiện tại** (đã dương nhờ hàng
  mới về) nên cho qua, trong khi sổ tại mốc ghi âm. Cả 3 phiếu âm sau 09/09 đều kiểu này.
- 6 phiếu âm hồi tố vì kho **huỷ phiếu nhập** sau khi kỹ thuật viên đã xuất.
- 1 phiếu giao hợp lệ lúc duyệt, âm vì 8 ngày sau có phiếu xuất ghi lùi về trước nó.

Cách tính (cùng luật với `validate_negative_qty_in_future_sle` của ERPNext, đang bị tắt vì
`Stock Settings.allow_negative_stock = 1` toàn site):

```
available(kho, món, mốc) = min( qty_after của dòng sổ cuối cùng ≤ mốc,
                               min qty_after của các dòng > mốc, tới trước Stock Reconciliation kế tiếp )
chặn khi  Σ qty xuất của chứng từ cho (kho, món)  >  available        (so theo float_precision)
```

Số lượng lấy theo **stock UOM**: `Stock Entry Detail.transfer_qty`, `Delivery Note Item.stock_qty`,
`Packed Item.qty`. Bộ sản phẩm chỉ ghi sổ qua `packed_items`; dòng packed **không ghi kho** thì
ERPNext lấy kho của dòng cha (`selling_controller.get_item_list`) — dữ liệu thật có 41 dòng như
vậy, nên validator cũng phải lấy kho dòng cha. Thành phần không quản kho (`is_stock_item = 0`)
không có dòng sổ, không đếm. Huỷ: `before_cancel` chạy trước `on_cancel`, dòng sổ của chính
phiếu còn `is_cancelled = 0`; các dòng cùng mốc nhưng `creation` nhỏ hơn đứng trước nó trong sổ
nên không bị rút. Trước khi đọc sổ, khoá dòng `tabBin` (`FOR UPDATE`) để hai phiếu rút cùng
(kho, món) submit đồng thời không cùng lọt.

Bộ kiểm `plans/return-flow-audit/e2e_ktv_stock_guard.py` (workspace phát triển, rollback):
16 kiểm — lùi ngày, điều phối, bộ sản phẩm có/không kho, cộng dồn, huỷ nhập, hook đã gắn; chạy
lại 90 ngày lịch sử: 61/61 chứng từ từng làm âm bị bắt (59 lúc duyệt, 2 tại thủ phạm sau), 0/300
chứng từ bình thường bị bắt oan.

Tác động vận hành khi lên: **42/78 phiếu trả nháp** đang chờ vượt tồn hiện tại sẽ bị chặn lúc
duyệt (danh sách `4_phieu_tra_nhap_vuot_ton_se_bi_chan.csv`), và 7 Bin âm ở kho kỹ thuật viên
đang hoạt động cần Stock Reconciliation trước (`5_bin_am_kho_ktv_can_kiem_ke.csv`).

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
- Nghĩa vụ **đang có phiếu trả nháp** (`_draft_return_entries`) cũng được giữ với
  `_pending_return_drafts`. Xoá nó là phiếu nháp trỏ vào mã không còn, kho duyệt sau đó thành
  một khoản trả không ai ghi nhận — lỗ thật đã xảy ra trên dữ liệu thật.
- Lúc giữ phần tử, các khoá `_qty_returned_declared` / `_credited_*` được gỡ để không trộn với
  đời sau.

### Lập lại phiếu giao hàng — `_carry_settled_returns`

Gọi trong `create_delivery_note_v2` **trước** khi gộp JSON mới. Với mỗi nghĩa vụ mới (cùng đơn,
cùng vật tư, cùng kho), lấy từ các phần tử đã giữ lại của phiếu giao bị huỷ theo thứ tự:

```
1. _move(1)           dòng phiếu đã duyệt, chuyển trọn mã → _settled_moved_to / _settled_moved_qty
2. _credit_overflow   dòng phiếu đã duyệt không tách được, phần thừa cấn vào nghĩa vụ anh em
                      → _credited_qty / _credited_from, _qty_returned hạ, _qty_returned_declared giữ số gốc
3. _move(0)           dòng phiếu nháp, đổi fs_tracking_return_id và bump `modified` của phiếu
                      (Desk đang mở form cũ sẽ bị từ chối lưu đè)
```

Thứ tự "duyệt → cấn → nháp" là cố ý: phần đã chắc chắn phủ trước, phiếu nháp chỉ bù phần còn
lại. Mỗi lần chuyển đều ghi comment lên phiếu chuyển kho để tra sau.

---

## 6. Cấu hình

| Cờ trong `FSM Settings` | Mặc định | Tác dụng |
|---|---|---|
| `auto_link_return_tracking` | `1` | Bật chốt 3 (gắn mã tự động) |
| `block_return_when_insufficient` | `0` | `0` = cảnh báo, `1` = chặn cứng ở chốt 4 |
| `validate_stock_return_on_wo_complete` | `0` | Gác **cả hai**: validator hoàn thành phiếu công việc **và** `validate_return_tracking_qty` ở `before_submit` của phiếu chuyển kho |
| `return_not_held_close_days` | `14` | Số ngày không giữ hàng liên tục thì job đêm đóng nghĩa vụ (§2b). `0` = không đóng. Patch `set_return_not_held_close_days` ghi mặc định, không ghi đè |

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

1. `bench migrate` — các patch ở nhóm `post_model_sync`:
   - `set_return_guard_defaults` — mặc định hai cờ, **không ghi đè** giá trị đã có;
   - `set_return_not_held_close_days` — mặc định 14 ngày, không ghi đè;
   - Ba chỉ mục `FS Work Order.sales_order`, `FS Work Order Line Item.order`,
     `Material Request Item.fs_work_order` được khai bằng `search_index = 1` **trong JSON
     doctype** (hai cột đầu) và **trong fixture Custom Field** (cột thứ ba), để Frappe tự tạo
     khi đồng bộ schema. Patch `add_return_ledger_indexes` chỉ là lưới đỡ cho site mà sync
     doctype bị bỏ qua. **Không được tạo chỉ mục chỉ bằng patch**: Frappe xoá mọi chỉ mục tên
     `<cột>_index` trên cột có `search_index = 0` mỗi lần bảng được alter lại — diễn tập migrate
     trên bản sao dữ liệu thật (07/10/2026) đã mất chỉ mục `sales_order` ngay trong cùng lần
     migrate, vì fixture Custom Field của `fsmnext_extend_cobe` làm `updatedb("FS Work Order")`
     sau patch.
   - Job `close_not_held_return_obligations` đã có trong `scheduler_events.daily`; không cần
     thao tác thêm.
2. **Kiểm tra trường đã đồng bộ vào meta chưa.** Thay đổi trong tệp JSON của doctype hay bị
   `bench migrate` bỏ qua âm thầm do chốt `migration_hash`. Không thấy trường thì chạy
   `bench --site <site> reload-doctype "FSM Settings"` rồi chạy lại patch.
3. `bench clear-cache`. Không cần `bench build` — bundle đã nằm trong `fsmnext/public/`.
4. Giữ `block_return_when_insufficient = 0` cho tới khi dọn xong tồn đọng.
5. Không cần tác vụ dữ liệu cho luật "không giữ thì không nợ": sổ tính lại từ JSON cũ và tồn kho
   ở mỗi lần đọc. Riêng các đơn bị huỷ/lập lại phiếu giao **trước** khi bản này lên (nghĩa vụ
   đã sinh mã mới mà không có gì để chuyển) phải sửa bằng SQL — xem kịch bản ở §9.

### Bộ kiểm

```
bench --site <site> execute fsmnext.fsm_next.tests.verify_return_guards.run
```

Ba nhóm: hàm tính toán (đối chiếu với SQL độc lập), luồng đầu-cuối (tạo phiếu thật rồi xoá,
đối chiếu số chứng từ trước và sau), regression các màn dùng chung. Nhóm kiểm cờ cấu hình đi
qua đủ năm trạng thái của `tabSingles`: không có dòng, `'0'`, `'1'`, rỗng, `NULL`.

Bộ kịch bản thứ hai (17 kịch bản, trong thư mục kế hoạch của workspace phát triển,
`plans/return-flow-audit/e2e_carry_and_autolink_preview.py`) chạy trên site có dữ liệu thật,
rollback toàn bộ: huỷ/lập lại phiếu giao với phần trả đã duyệt, cấn, nháp; xem trước tự gắn mã;
chia tồn kho giữa hai đơn; nợ tự tắt khi hàng giao cho đơn khác; job đêm đánh dấu, hoãn, đóng.
Bẫy khi chạy local: `tabDocType` của `Stock Ledger Entry`, `GL Entry` có `is_submittable = 0`
lệch với JSON nên phải vá `frappe.get_meta` trong bộ nhớ; `_get_mr_received_for_sos` và
`_so_names_for_service_resource` phải giả lập cho đơn thử.

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

### Chặn trên theo phiếu yêu cầu gắn phiếu công việc — đã chốt giữ

`_get_mr_received_for_sos` coi `Material Request Item.fs_work_order` là sự thật, trong khi kỹ
thuật viên có thể bổ sung hàng cho kho mình dưới một ca bất kỳ. Trước đây đo được 508 nghĩa vụ
bị đưa về 0 vì điều này. Quyết định nghiệp vụ (09/2026): **giữ** — vật tư được theo dõi theo
phiếu yêu cầu kỹ thuật viên gửi cho đơn nào, vì bỏ gắn đơn thì phiếu công việc không biết khi
nào được đóng. Phần "kỹ thuật viên lấy hàng dưới ca khác" được bù bằng luật không giữ thì không
nợ: hàng đó, nếu còn trong kho, hiện là hàng lẻ và chốt 3 gắn mã về đơn còn nợ có phiếu yêu cầu.
Màn hình ghi rõ *Không nhận cho đơn này* thay vì im lặng.

### Hàng nhận cho ca mới bị chia cho nghĩa vụ cũ

Sổ chia tồn kho cho nghĩa vụ **đã khai**, còn hàng vừa nhận qua phiếu yêu cầu cho một ca **chưa
làm** thì chưa có nghĩa vụ nào đại diện. Kỹ thuật viên có nghĩa vụ cũ cùng vật tư sẽ thấy nó bị
đòi trở lại, và bảng xem trước của chốt 3 đề nghị gắn hàng của ca mới vào nợ cũ. Đo trên dữ liệu
thật chỉ 15 đơn vị. Hướng sửa: trừ phần đã nhận cho các phiếu công việc chưa hoàn thành khỏi tồn
kho trước khi chia. Trong lúc chờ, nút *Trả lẻ, không tính* là lối ra.

### Luồng phiếu giao hàng đọc JSON không khoá

`create_delivery_note_v2` và `cancel_delivery_note` đọc `fs_returned_items_json` bằng
`get_value` rồi ghi nguyên danh sách. Nếu job đêm commit `mark`/`close` đúng giữa hai bước đó,
kết quả job bị ghi đè (nghĩa vụ sống lại). Cửa sổ vài giây lúc nửa đêm, chiều ngược lại đã an
toàn (job ghi theo mã dưới `FOR UPDATE`). Hướng sửa: cùng cách khoá dòng ở hai hàm này.

### Kỹ thuật viên có hai kho cùng công ty

Sổ chia theo đúng kho ghi trên nghĩa vụ. Hàng nằm ở kho thứ hai của cùng kỹ thuật viên thì nghĩa
vụ ghi *không giữ hàng*. Đo được 6 dòng. Chưa gộp; hướng dẫn vận hành là nhập đúng kho.

### `get_pending_returns(sales_orders=…)` không kiểm quyền

Điểm vào whitelisted này nhận `sales_orders` / `work_order` từ bất kỳ người dùng đã đăng nhập,
có từ trước. Điểm vào mới `get_return_ledger_for_sales_order` đã có `has_permission`.

### Kịch bản sửa dữ liệu bằng SQL cho đơn huỷ/lập lại phiếu giao trước bản này

Ba đơn trên dữ liệu thật có nghĩa vụ đời mới mà phần đã trả nằm ở đời cũ không được chuyển (vì
lúc huỷ chưa có cơ chế giữ phần tử). Hai trong ba tự về *không giữ hàng*; đơn còn lại vẫn bị đòi
vì kho kỹ thuật viên tình cờ có đúng vật tư đó (hàng lẻ của ca huỷ). Kịch bản SQL gồm ba bước
(xem trước → sửa 13 dòng → gỡ mã khỏi 2 dòng nháp) chạy trên SQL Playground của Frappe Cloud,
không cần console.

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
