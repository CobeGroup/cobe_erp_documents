---
title: Liên kết đơn khảo sát (FSMNext)
layout: default
parent: Tài liệu kỹ thuật
nav_order: 12
---

# Liên kết đơn khảo sát — điểm mở rộng, chốt chặn và công cụ gán hàng loạt

> Đối tượng: **developer**, **system integrator**.
> Tài liệu mô tả cách một ứng dụng khác đóng góp tab chỉ đọc vào màn hình lịch hẹn của
> FSMNext, các chốt kiểm tra của tính năng liên kết đơn khảo sát, và cơ chế công cụ gán
> hàng loạt.
>
> Phần hướng dẫn vận hành xem **[Liên kết đơn khảo sát](../users/FSMNext-Lien-Ket-Khao-Sat.html)**.

---

## 1. Vì sao phải đặt ra điểm mở rộng

Nội dung cần hiển thị nằm ở ba ứng dụng khác nhau: đơn khảo sát và tệp đính kèm thuộc `fsmnext`,
bảng hạng mục khảo sát thuộc `fsmnext_extend_cobe`, còn phiếu phân tích nước (`Water Analysis
Report`) thuộc `poe_management`. `fsmnext` là ứng dụng nền, không được biết tới `poe_management`,
nên tính năng không thể viết thẳng vào màn hình lịch hẹn.

Giải pháp: `fsmnext` mở một điểm mở rộng chung, phía Cobe đăng ký một nhà cung cấp nội dung.

| Thành phần | Vị trí | Vai trò |
|---|---|---|
| `get_wo_extra_panels(appointment_name)` | `fsmnext/.../technician_api/extra_panels.py` | Endpoint cho ứng dụng kỹ thuật viên; kiểm quyền rồi gom panel |
| Hook `fsmnext_wo_extra_panels` | khai trong `hooks.py` của ứng dụng đóng góp | Danh sách hàm cung cấp panel |
| `ExtraPanelTab.tsx` | `fsmnext/frontend/technician` | Dựng giao diện từ mô tả khối |
| `get_wo_extra_panels(work_order, service_resource)` | `fsmnext_extend_cobe/.../api/survey_link.py` | Nhà cung cấp phía Cobe |

Nhà cung cấp trả **mô tả dữ liệu**, không trả mã giao diện:

```json
{
  "key": "cobe_survey",
  "title": "Khảo sát",
  "order": 50,
  "blocks": [
    {"type": "fields", "label": "...", "items": [{"label": "...", "value": "..."}]},
    {"type": "text",   "label": "...", "value": "..."},
    {"type": "table",  "label": "...", "columns": ["..."], "rows": [["..."]]},
    {"type": "images", "label": "...", "items": [{"file_name": "...", "file_url": "..."}]},
    {"type": "link",   "label": "...", "text": "...", "url": "..."}
  ]
}
```

Một nhà cung cấp lỗi được ghi vào `Error Log` rồi bỏ qua, không kéo sập màn hình lịch hẹn.

---

## 2. Mô hình dữ liệu

Không có doctype trung gian. Liên kết là hai trường tuỳ biến trên `FS Work Order`, khai trong
fixtures của `fsmnext_extend_cobe`:

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `cobe_survey_tab` | Tab Break | Ẩn khi `work_type == 'Khảo sát'` |
| `cobe_survey_work_order` | Link `FS Work Order` | Chỉ đọc trên giao diện, `allow_on_submit` |
| `cobe_water_analysis_report` | Link `Water Analysis Report` | Như trên |
| `cobe_survey_panel_html` | HTML | Chỗ dựng nội dung trên Desk |

### Ranh giới với `parent_work_order`

`parent_work_order` diễn đạt gần đúng cùng một ý, và nghiệp vụ đã dùng nó cho đúng ý đó: trên
dữ liệu hiện tại có 8 phiếu lắp đặt điền ô này, **cả 8 đều trỏ về một đơn khảo sát**. Nhưng
tính năng này vẫn **ghi vào trường riêng**, vì `parent_work_order` kéo theo `root_work_order`
(`FS Work Order.set_root_work_order`), rồi mọi ca của phiếu lấy `root_record` theo đó. Ba chỗ
đọc `root_record` là ba thứ sẽ đổi hành vi nếu gán bừa:

| Chỗ đọc | Hệ quả nếu đổi gốc |
|---|---|
| `sa.root_record = wo.root_work_order or wo.name` | Điều phối gom ca lắp đặt vào cụm của đơn khảo sát |
| `force_close.py` — quét ca dang dở theo `root_record` | Đóng cưỡng bức đơn khảo sát kéo theo ca lắp đặt |
| `work_condition.py` — tính lại điều kiện theo `root_record` | Điều kiện hoàn thành tính sai gốc |

Chốt lại ranh giới, giữ nguyên khi sửa về sau:

- `parent_work_order` = **quan hệ vận hành** (gom ca, phạm vi đóng phiếu, nghĩa vụ vật tư).
- `cobe_survey_work_order` = **tham chiếu chỉ để đọc**, cố ý không chạm điều phối hay kho.

Một chiều duy nhất được nối: `_get_links()` **đọc kèm** `parent_work_order` khi ô riêng còn
trống và phiếu cha đúng loại `Khảo sát`, trả thêm cờ `inherited` để panel ghi rõ nguồn. Chiều
ngược lại — ghi vào `parent_work_order` — thì không, và nút *Gỡ liên kết khảo sát* cũng chỉ
hiện với liên kết do tư vấn gán.

---

## 3. Chốt chặn

### 3.1. Luật kiểm ở máy chủ, không dựa vào `read_only`

`read_only` chỉ là gợi ý giao diện — `/api/resource` vẫn ghi được. Mọi luật nằm ở
`validate_survey_link`, và chỉ chạy khi giá trị **thực sự đổi**:

| Luật | Thông điệp |
|---|---|
| Người đổi phải có vai trò tư vấn / điều phối | *Chỉ tư vấn / điều phối mới được đổi liên kết…* |
| Không trỏ chính nó | *Không thể liên kết WO với chính nó* |
| Phiếu nguồn phải đúng loại `Khảo sát` | Nêu loại thật |
| Phải cùng khách hàng; phiếu chưa có khách hàng thì từ chối | Nêu khách hàng của phiếu kia |
| Phiếu phân tích nước không được ở trạng thái huỷ | — |

### 3.2. Hai hook, không phải một

Trên môi trường thật **16.149 / 16.516** phiếu công việc ở trạng thái đã duyệt, mà hai trường
liên kết là `allow_on_submit`. Với tài liệu đã duyệt, Frappe **không** chạy `validate`, nên chỉ
khai `validate` là toàn bộ luật chết lặng. Phải khai cả hai:

```python
"FS Work Order": {
    "validate": [..., "...survey_link.validate_survey_link"],
    "before_update_after_submit": "...survey_link.validate_survey_link",
}
```

### 3.3. Quyền xem hẹp hơn quyền đọc phiếu công việc

Vai trò `FSM Technician` **có** quyền ghi trên `FS Work Order`, nên nếu chỉ dựa vào
`frappe.has_permission` thì bất kỳ kỹ thuật viên nào cũng đọc được khảo sát và phiếu phân tích
nước của mọi khách hàng. `_check_can_view` yêu cầu: có vai trò quản lý FSM, **hoặc** là kỹ
thuật viên được phân vào một lịch hẹn của chính phiếu đó.

Ngược lại, các truy vấn dựng nội dung dùng `ignore_permissions=True` một cách có chủ đích: quyền
đã chốt ở lớp trên, và panel không được vỡ khi ai đó siết vai trò trên `Water Analysis Report`.

---

## 4. Công cụ gán hàng loạt

Môi trường thật chạy trên Frappe Cloud: **không có shell, không có `bench console`**. Một hàm
chạy bằng dòng lệnh là một hàm không ai gọi được. Vì vậy công cụ là nút trên `COBE FSM Settings`,
theo đúng khuôn công cụ bảo trì của Service Reminder.

| Thành phần | Vai trò |
|---|---|
| `survey_link.run_backfill` | Lõi: chọn ứng viên, gán, đếm |
| `survey_link.revert_backfill` | Gỡ đúng phần đã gán, bỏ qua phiếu đã bị sửa thủ công |
| `survey_backfill.start` | Tạo nhật ký, đẩy job vào hàng chờ `long` |
| `survey_backfill.run_job` | Thân job, ghi tiến độ vào nhật ký |
| `COBE Survey Backfill Run` | Nhật ký từng lần chạy, giữ danh sách đã gán |

Điều kiện chọn ứng viên: phiếu chưa có liên kết, **`parent_work_order` không trỏ về một đơn
khảo sát**, chưa huỷ, và khách hàng có **đúng một** đơn khảo sát tạo trước đó. Phiếu phân tích nước chỉ gán khi khách hàng có đúng một phiếu còn hiệu
lực.

### Bốn điểm phải giữ khi sửa công cụ này

| Điểm | Lý do |
|---|---|
| Không đếm ứng viên trong request | Truy vấn quét toàn bộ bảng phiếu công việc, mất hàng chục giây; job tự đếm rồi ghi vào nhật ký |
| Đẩy job thất bại phải chuyển nhật ký sang `Failed` | Redis chết mà nhật ký nằm `Queued` thì nhìn như đang chạy |
| Danh sách đã gán phải **cộng dồn** và ghi theo lô | Worker chạy lại job hoặc job bị dừng giữa chừng sẽ xoá mất đường hoàn tác |
| Hoàn tác phải so giá trị hiện tại trước khi gỡ | Không ghi đè lựa chọn người dùng đã sửa thủ công sau lần chạy |
| Bỏ qua phiếu đã có cha là đơn khảo sát | Tab đọc được rồi; gán thêm là tạo hai nguồn sự thật cho cùng một câu hỏi |

Việc gán cố ý **không** đặt trong patch: đây là suy đoán từ dữ liệu, người dùng phải được quyền
phủ quyết và hoàn tác.

### Báo cáo Khảo sát đọc liên kết này

`service_reminder.api.survey` trả lời câu hỏi "ca khảo sát này ra đơn nào". Trước đây nó chỉ
đoán theo khách hàng + ngày, vì liên kết trực tiếp gần như không ai nhập. Nay thứ tự là:

1. `sales_order` gắn thẳng trên đơn khảo sát;
2. đơn bán hàng của phiếu trỏ ngược về ca này — qua `cobe_survey_work_order` **hoặc**
   `parent_work_order`;
3. mới tới suy đoán theo khách hàng + ngày.

Bậc 2 chỉ ghép vào câu SQL khi `frappe.db.has_column("FS Work Order", "cobe_survey_work_order")`
trả về đúng: `service_reminder` không phụ thuộc `fsmnext_extend_cobe`, site chưa migrate vẫn
phải xem được báo cáo.

---

## 5. Kiểm thử

| Lệnh | Phạm vi |
|---|---|
| `bench --site <site> execute fsmnext_extend_cobe.fsmnext_extend_cobe.api.test_survey_link.run_checks` | Luật liên kết, dựng panel, quyền xem, tình huống hỏng |
| `…test_survey_link.run_technician_checks` | Endpoint ứng dụng kỹ thuật viên và quyền theo lịch hẹn |
| `…test_survey_backfill.run_checks` | Thử khô, chạy thật, hoàn tác, quyền chạy |

Các bộ kiểm chạy trên dữ liệu thật và **tự dọn thủ công**: `rollback()` không đủ vì có commit
ngầm giữa chừng. Bài kiểm cuối mỗi bộ đếm lại toàn site, phải về đúng trạng thái trước khi chạy.

---

## 6. Điểm còn mở

- `Water Analysis Report` đang cho vai trò `Guest` đọc, do trang công khai `/poe_wdr_view` của
  `poe_management`. Nằm ngoài phạm vi tính năng này, nhưng là dữ liệu khách hàng.
- Liên kết là một–một theo thiết kế. Nếu sau này cần nhiều đơn khảo sát cho một phiếu lắp đặt,
  phải đổi sang bảng con — kéo theo cả giao diện chọn và cách dựng panel.

---

## Liên quan

- **[Cơ chế nghĩa vụ trả hàng (FSMNext)](FSMNext-Return-Flow-Tech.html)**
- **[Liên kết đơn khảo sát — hướng dẫn sử dụng](../users/FSMNext-Lien-Ket-Khao-Sat.html)**
