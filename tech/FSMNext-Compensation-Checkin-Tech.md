---
title: Phân bổ tiền công và quy tắc check-in (FSMNext)
layout: default
parent: Tài liệu kỹ thuật
nav_order: 13
---

# Phân bổ tiền công kỹ thuật viên, báo cáo Master View và quy tắc check-in

> Đối tượng: **developer**, **system integrator**.
> Tài liệu mô tả cách FSMNext phân bổ tiền công của phiếu công việc xuống từng kỹ thuật viên, mô hình
> dòng của báo cáo Master View, các quy tắc trên lịch hẹn liên quan tới check-in và nhân bản, báo cáo
> *KTV Checkin Distance*, và lưu ý triển khai.
>
> Phần hướng dẫn vận hành xem
> **[Quy trình dịch vụ hiện trường](../users/FSMNext-Quy-Trinh-Dich-Vu.html#tien-cong-nhieu-sa)** và
> **[Báo cáo khoảng cách check-in](../users/FSMNext-Khoang-Cach-Check-In.html)**.

---

## 1. Phân bổ tiền công
{: #phan-bo }

Mã nguồn: `fsmnext/fsm_next/compensation_calculation.py`.

| Đại lượng | Nơi lưu | Cách tính |
|---|---|---|
| Tiền công của phiếu | `FS Work Order.total_compensation` | Tổng tiền công của các dòng công việc (`FS Work Order Line Item`) chưa *Canceled* theo quy tắc tiền công (có snapshot quy tắc), cộng các dòng điều chỉnh (*Adjustment*) |
| Phân bổ | Bảng con `FS Compensation Allocation` trên phiếu công việc (`service_appointment`, `service_resource`, `contribution`, `amount`) | Xem công thức dưới |

`_allocate_compensation_to_resources(wo)`:

1. Lấy mọi lịch hẹn có `parent_record_type = "FS Work Order"`, `parent_record = wo` và
   `status_category != "Canceled"` — **kể cả** *None/Scheduled/Dispatched/In Progress/Cannot Complete*.
2. `phan_cua_lich = total_compensation / số_lịch_hẹn`.
3. Với mỗi dòng `FS Assigned Resource` có `status != "Canceled"`:
   `amount = phan_cua_lich × contribution / 100` (`contribution` rỗng được hiểu là 100).

Bất biến và hệ quả:

- Tổng `amount` bằng `total_compensation` khi mọi lịch hẹn chưa huỷ đều có ít nhất một kỹ thuật viên.
  Lịch hẹn không có kỹ thuật viên vẫn chiếm một phần, phần đó **không thuộc về ai**.
- Số lịch hẹn **không** làm đổi tổng tiền công của phiếu; thêm một lịch hẹn chỉ làm giảm phần của
  các lịch hẹn đã có.
- `FS Service Appointment.validate_contribution_total` buộc tổng `contribution` của các kỹ thuật viên
  chưa huỷ trong một lịch hẹn bằng đúng 100.

**Khi nào tính lại** (`fsmnext/hooks.py`, `doc_events`):

| Doctype | Sự kiện | Ghi chú |
|---|---|---|
| `FS Work Order` | `on_update`, `on_update_after_submit` | Chỉ khi `docstatus = 1`; lần lưu do chính bước tính lại gắn `flags.skip_compensation_calculation` để không lặp |
| `FS Work Order Line Item` | `after_insert`, `on_update`, `on_trash` | |
| `FS Service Appointment` | `after_insert`, `on_update`, `on_trash` | Chỉ khi cha là `FS Work Order`; mọi thao tác check-in, check-out, đổi kỹ thuật viên đều là một lần `save()` nên đều tính lại |

> ⚠️ Đường ghi bằng `frappe.db.set_value` (ví dụ đóng cưỡng bức ở `fsmnext_extend_cobe`) **không**
> chạy các hook trên; bảng phân bổ chỉ được tính lại ở lần lưu kế tiếp của phiếu, dòng công việc hoặc
> lịch hẹn.

---

## 2. Báo cáo Master View
{: #master-view }

Mã nguồn: `fsmnext/fsm_next/api/report_api/master_view.py` (API `get_master_view_report`, xuất Excel
`export_master_view_to_excel`), giao diện `frontend/fsm-report/src/components/MasterViewTable.tsx`.

**Mô hình dòng.** Cặp *đơn bán hàng – phiếu công việc* lấy từ hợp của `FS Work Order.sales_order` và
`FS Work Order Line Item.order`. Mỗi dòng là một tổ hợp **SO × WO × SA × kỹ thuật viên**, chỉ gồm
lịch hẹn chưa *Canceled* và kỹ thuật viên chưa *Canceled*. Phân trang theo đơn bán hàng, nên mọi dòng
của một đơn luôn nằm cùng một trang. Phiếu công việc không có đơn bán hàng được nối vào cuối.

| Trường | Cấp | Quy tắc |
|---|---|---|
| `grand_total`, `total_paid` | Đơn bán hàng | Lặp trên mọi dòng của đơn; cờ `is_first_so_row` chỉ đúng ở dòng đầu. Bảng hiện dấu `〃`, tệp Excel để trống ở các dòng sau, nên cộng cột ra đúng tổng |
| `ktv_compensation`, `ktv_contribution` | Kỹ thuật viên trong một lịch hẹn | Lấy từ `FS Compensation Allocation` theo khoá **(WO, SA, kỹ thuật viên)**. Một khoá chỉ được tính một lần trong một lần gọi API (tập `seen_alloc`), để phiếu gắn với hai đơn không bị đếm hai lần |
| `wo_compensation` | Phiếu công việc | Lặp trên mọi dòng của phiếu; không hiển thị, không xuất Excel |

Hạn chế đã biết:

- Phiếu công việc gắn với hai đơn bán hàng: dòng của đơn thứ hai hiện `0` thay vì dấu lặp. Nếu hai
  đơn nằm ở hai trang khác nhau, mỗi trang đều hiện tiền công.
- Sắp xếp phía trình duyệt theo một cột bất kỳ có thể đưa dòng đầu của một đơn xuống dưới các dòng
  `〃` của chính đơn đó. Tổng cộng không đổi.
- Báo cáo đi từ lịch hẹn: phiếu công việc chưa có lịch hẹn còn hiệu lực, hoặc lịch hẹn chưa có kỹ
  thuật viên, không xuất hiện.

---

## 3. Quy tắc trên lịch hẹn
{: #quy-tac-sa }

Mã nguồn: `fsmnext/fsm_next/doctype/fs_service_appointment/fs_service_appointment.py`.

| Phương thức | Chạy ở | Hành vi |
|---|---|---|
| `clear_copied_attendance` | `before_insert` | Lịch hẹn mới chưa có buổi làm việc nào. Xoá `actual_start`, `actual_end`, `actual_duration`, `actual_travel_time`, `cancellation_reason`; trên mỗi dòng kỹ thuật viên đã có dữ liệu buổi làm việc hoặc trạng thái khác *Assigned/Canceled*: xoá các trường trong hằng `ATTENDANCE_FIELDS` (giờ và toạ độ di chuyển, check-in, check-out, thời gian và quãng đường thực tế), đặt `location_match = 0`, `checkin_at_customer = 0`, trạng thái về *Assigned* |
| `warn_sibling_appointments` | `before_insert` | Phiếu cha đã có lịch hẹn chưa *Canceled* thì `msgprint` cảnh báo (liệt kê tên và trạng thái) và gắn cùng nội dung vào `flags.sibling_warning`. Không chặn |
| `validate_checkout_has_checkin` | `validate` | Dòng kỹ thuật viên **chuyển sang** *Checked-out* trong lần lưu này mà chưa có `checkin_time` thì `frappe.throw`. Không áp dụng cho bản ghi mới |

Cả `clear_copied_attendance` và `validate_checkout_has_checkin` bỏ qua bản ghi có
`flags.from_data_sync`. Cờ này do `fsmnext_extend_cobe/api/data_sync.py` (`_create_sa`, `_update_sa`)
gắn khi đồng bộ từ ứng dụng Field Service cũ, vì luồng đồng bộ ánh xạ trạng thái mà không có giờ.

Bốn trường tuỳ biến đóng cưỡng bức của lịch hẹn (`force_closed`, `force_close_reason`,
`force_closed_by`, `force_closed_on`, khai trong fixture của `fsmnext_extend_cobe`) có `no_copy = 1`.

> ℹ️ Lệnh **Duplicate** trên Desk dùng danh sách `no_copy` của trình duyệt. Phía máy chủ,
> `frappe.copy_doc(doc)` mặc định `ignore_no_copy=True` và **vẫn chép** các trường `no_copy`; khi
> viết mã hoặc kiểm thử mô phỏng Duplicate, gọi `frappe.copy_doc(doc, ignore_no_copy=False)`.
> `clear_copied_attendance` chạy ở `before_insert` nên áp dụng cho cả hai đường.

Bản dịch tiếng Việt của các thông báo mới nằm trong `fsmnext/translations/vi.csv`.

---

## 4. Đưa cảnh báo tới ứng dụng một trang
{: #canh-bao-spa }

Các ứng dụng một trang của FSMNext (`/smart-scheduler`, `/technician`, `/fsm-report`) gọi API qua
`frontend/shared/src/api/frappe.ts` → `frappeCall`. Hàm này chỉ đọc `_server_messages` khi yêu cầu
**lỗi**; khi thành công nó chỉ trả `message`. Vì vậy một `msgprint` trong API hoặc trong hook chạy bên
trong API **không tới người dùng** của các ứng dụng này (Desk thì hiển thị bình thường).

Cách đã áp dụng cho cảnh báo lịch hẹn trùng:

| Tầng | Thay đổi |
|---|---|
| Controller | Gắn nội dung cảnh báo vào `flags.sibling_warning` |
| API `create_sa_from_wo` (`api/dispatch/frontend/work_orders.py`) | Trả thêm trường `warning` (rỗng khi không có gì cần cảnh báo) |
| `smart-scheduler` (`WOCard.tsx`, `WOTree.tsx`) | Có `warning` thì hiện `message.warning` |

Áp dụng cùng cách cho mọi cảnh báo mới mà người dùng ứng dụng một trang cần thấy. `frappe.throw` thì
tới được, vì nhánh lỗi có đọc `_server_messages`.

---

## 5. Báo cáo KTV Checkin Distance
{: #bao-cao-khoang-cach }

Script Report trong `fsmnext_extend_cobe/fsmnext_extend_cobe/report/ktv_checkin_distance/`,
`ref_doctype = FS Service Appointment`, role **System Manager**.

| Thành phần | Quy tắc |
|---|---|
| Phạm vi | `FS Assigned Resource` chưa *Canceled*, lịch hẹn `status_category = Completed`, `checkin_time` trong khoảng ngày (nửa mở, giữ trọn ngày cuối) |
| Toạ độ khách hàng | `FS Service Appointment.latitude/longitude` nếu có (nhập thủ công), không thì `Address.fsm_geocoded_latitude/longitude` — cùng thứ tự với `check_checkin_at_customer` |
| Khoảng cách | `haversine_distance` của `fsmnext.fsm_next.utils.distance_calculator`, đơn vị mét |
| Nấc "tại nhà khách" | `≤ FSM Settings.same_location_threshold` (mặc định 100), cùng phép so với `checkin_at_customer`; các nấc sau: ≤ 500 m, ≤ 2 km, xa hơn |
| Chế độ *Theo KTV* | Gom theo kỹ thuật viên, sắp theo trung vị giảm dần |
| Chế độ *Chi tiết* | Lượt từ `min_distance_km` trở lên, sắp giảm dần, kèm đường dẫn Google Maps từ điểm check-in tới toạ độ khách |

Role **FSM Manager** không mở được báo cáo vì Frappe còn kiểm quyền `report` trên `ref_doctype`, mà
role này không có quyền đó trên `FS Service Appointment`. Muốn mở cho role khác, cấp quyền `report`
trên doctype đó (bằng patch, vì fixtures quyền bị đặt lại mỗi lần migrate) rồi thêm role vào báo cáo.

Địa chỉ đổi nội dung thì `CustomAddress.on_update` (`fsmnext/fsm_next/overrides/address.py`) xoá toạ
độ đã định vị; lần lưu lịch hẹn kế tiếp có kỹ thuật viên sẽ gọi `get_address_coordinates` và định vị
lại.

---

## 6. Triển khai
{: #trien-khai }

| Ứng dụng | Việc cần làm |
|---|---|
| `fsmnext` | Deploy. Bundle `public/fsm-report` và `public/smart-scheduler` đã build sẵn trong mã nguồn |
| `fsmnext_extend_cobe` | Deploy **và** `bench migrate` — tạo báo cáo và cập nhật `no_copy` của fixture custom field |

Deploy **hai ứng dụng cùng lúc**: `flags.from_data_sync` do `fsmnext_extend_cobe` gắn nhưng do
`fsmnext` đọc.
