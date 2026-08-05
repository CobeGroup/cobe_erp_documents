---
title: Phân loại Issue — Tech
layout: default
parent: Tài liệu kỹ thuật
---

# Phân loại Issue 3 tầng — tài liệu kỹ thuật

App: **support_plus** · Patch: `support_plus.patches.v1_0.setup_issue_taxonomy`

Tài liệu người dùng: [Phân loại sự cố](../users/Phan-Loai-Su-Co.html)

## Bối cảnh

`Issue Type` của ERPNext là doctype tối giản — **chỉ có đúng một field `description`**,
không `is_group`, không `parent`. Frappe Helpdesk (`HD Ticket Type`) cũng phẳng tương tự.
Đây là chủ ý thiết kế: ERPNext coi Issue là support ticket, type chỉ là khoá định tuyến
cho SLA, còn taxonomy chẩn đoán (fault code / failure mode) thì không có ở bất kỳ module
nào — `Asset Repair` cũng chỉ có `failure_date` + description tự do.

Hệ quả tại Cobe: **31/60 Issue Type đã tự mã hoá 2–3 tầng vào tên** (`Nước yếu do bơm`,
`Lỗi thiết bị (Màn hình)`, `Rò rỉ nước tại van/dây ống`).

## Thiết kế

| Doctype / field | Vai trò |
|---|---|
| `Issue Group` (mới) | Nhóm lớn. Cờ `hide_types` bật/tắt cả cụm |
| `Issue Type` (ERPNext) | Triệu chứng. Thêm `custom_issue_group` (**reqd**) + `disabled` |
| `Issue Root Cause` (mới) | Nguyên nhân. Bảng con `groups` khai nhiều nhóm áp dụng |
| `Issue Root Cause Group` (mới, child) | Dòng của bảng nhiều-nhóm |
| `Issue.custom_issue_group` | `fetch_from` từ type, read-only, có index |
| `Issue.custom_root_cause` | Nhập tay khi đóng ca, lọc theo nhóm |

**Nguyên tắc xuyên suốt: không đụng dữ liệu lịch sử.** Patch không rename, không xoá
Issue Type nào, không đổi `issue_type` của bản ghi Issue — trừ các ca vốn để **trống**
(được gán `Không xác định` vì `issue_type` là trường bắt buộc nên không save lại được).

Toàn bộ 60 type cũ được gom vào một nhóm `Danh mục cũ` (tạo ở trạng thái **đang bật**),
để tắt cả cụm bằng một công tắc khi danh mục mới sẵn sàng.

## Cơ chế ẩn

Frappe tự loại bản ghi có field `disabled` khỏi mọi dropdown Link — xem
`frappe/desk/search.py::search_widget`. **Custom Field cũng được tính**, nên chỉ cần thêm
một field Check tên `disabled` vào `Issue Type`, không phải viết code lọc.

Cờ chảy từ nhóm xuống type qua `doc_events`:

- `support_plus.lib.issue_type.inherit_group_disabled` (validate) — type đọc `hide_types`
  của nhóm, ghi vào `disabled` của chính nó. Cờ **phải** nằm trên Issue Type mới có tác
  dụng, vì `search_widget` chỉ nhìn doctype đang tìm, không biết gì về nhóm.
- `support_plus.lib.issue_type.resync_issues_on_group_change` (on_update) — đổi nhóm của
  một type thì UPDATE thẳng `tabIssue` cho các ca thuộc type đó. `fetch_from` chỉ chạy khi
  document được save nên bản ghi lịch sử không tự cập nhật.

## Bảy cái bẫy đã gặp

### 1. Cờ trên Issue Group không được đặt tên `disabled`

Frappe loại bản ghi `disabled` khỏi **mọi** dropdown Link, **kể cả ô lọc**. Nếu cờ của
`Issue Group` tên là `disabled`, tắt nhóm xong là mất luôn khả năng lọc/báo cáo 25.042 ca
lịch sử theo nhóm đó — đúng thứ mà nhóm sinh ra để làm. Đổi tên thành `hide_types` là
Frappe không nhận ra nữa; cờ ẩn thật vẫn nằm trên `Issue Type.disabled`.

### 2. Fixtures đè patch

Patch chạy ở `post_model_sync`, còn bước đồng bộ fixtures chạy **sau** nó → **file
fixtures là người nói cuối cùng**. Đặt `reqd=1` trong `CUSTOM_FIELDS` của patch xong,
migrate tiếp là bị đè về giá trị trong `fixtures/custom_field.json`.

Mọi thuộc tính custom field sửa trong patch **phải export lại vào fixtures**. Triệu chứng
đánh lừa: test ngay sau `bench execute` thì PASS, chỉ FAIL sau khi migrate.

### 3. `db.add_index` trong patch bị chính migrate xoá

`add_index` **cố tình bỏ qua** việc ghi Property Setter khi đang chạy trong migrate
(`frappe/database/mariadb/database.py`), nên bước sync customizations chạy sau patch xoá
lại index vừa tạo — im lặng, không lỗi gì. Phải khai bằng
`make_property_setter(..., "search_index", 1, ...)`.

### 4. Meta cache trong cùng request

Patch tạo custom field rồi lập tức insert `Issue Type` → `doc.custom_issue_group` chưa tồn
tại vì meta trong cache của request đó chưa có field mới → `AttributeError` làm **migrate
chết đứng**. Hook phải đọc bằng `doc.get(...)`, và patch gọi `frappe.clear_cache(doctype=...)`
ngay sau `create_custom_fields`.

### 5. Workspace bị import lại mỗi lần migrate

`("desk", "workspace")` nằm trong danh sách sync của `frappe/model/sync.py`, nên link chèn
tay vào workspace `Support` của ERPNext sẽ mất khi ERPNext nâng cấp. Giải pháp: gắn qua
hook `after_migrate` (`support_plus.lib.workspace.ensure_support_workspace_links`), idempotent.

### 6. developer_mode ghi ngược file vào app khác

Save một doc chuẩn thuộc app khác (Workspace `Support` của erpnext) trên máy dev sẽ **ghi
file json vào `apps/erpnext/`** và làm bẩn repo người khác. Chặn bằng
`frappe.flags.in_import = True` quanh `doc.save()` — đúng nhánh điều kiện trong
`frappe/modules/utils.py::export_module_json`. Prod `developer_mode=0` nên không dính.

### 7. Link mồ côi `Không xác định`

16.004 ca trỏ tới một Issue Type đã bị xoá khỏi danh mục → mọi thao tác Save trên các ca
đó throw `LinkValidationError`. Patch tạo lại bản ghi đó thay vì sửa dữ liệu Issue.

## Truy vấn lọc nguyên nhân

`support_plus.lib.root_cause.root_cause_query`, gắn vào form qua `frm.set_query` trong
`issue.js`. Logic: nguyên nhân khai đích danh nhóm của ca **hoặc** không khai nhóm nào
(loại dùng chung). Nguyên nhân khai đích danh xếp trước trong kết quả.

Không đặt alias cho bảng trong query — `get_match_cond()` sinh điều kiện theo tên bảng đầy đủ.

**Chỉ lọc dropdown, không validate cứng.** Ghi qua API/import vẫn lọt, giống hệt cách cờ
ẩn type hoạt động.

## Giới hạn đã biết

- **Không tạo được Issue Type trùng tên type cũ** — docname là unique và type cũ vẫn còn.
  Muốn nhường tên thì phải rename type cũ, mà rename sẽ đổi `issue_type` trên bản ghi lịch sử.
- Cờ ẩn chỉ chặn ở tầng chọn tay. Ghi thẳng qua API/integration vẫn nhận type đã ẩn —
  đây là chủ ý, nhờ vậy bản ghi lịch sử mới giữ được type cũ.
- `service_reminder` (trang service-report) đọc `SELECT DISTINCT name FROM tabIssue Type`
  nên ô lọc ở đó vẫn hiện đủ mọi type, kể cả đã ẩn.
- Nguyên nhân chỉ có dữ liệu từ thời điểm triển khai trở đi.
- Chưa có: nhóm lồng cha/con, một type thuộc nhiều nhóm.

## Kiểm thử

Không có test suite tự động trong app. Trước khi deploy đã chạy tay 60 phép kiểm trên bản
sao dữ liệu prod (rollback sau mỗi bộ):

| Bộ | Số | Nội dung |
|---|---|---|
| Cấu trúc / dữ liệu / hành vi / hồi quy / đồng bộ | 35 | doctype, field, index, quyền; 25.042 ca đều có nhóm, 0 link mồ côi; report ERPNext + 5 API service-report vẫn chạy; fixtures khớp DB |
| Kịch bản end-to-end | 12 | dựng nhóm/type/nguyên nhân → tắt nhóm cũ → mở & sửa ca cũ mang type đã ẩn → bật lại hoàn tác → guard chặn |
| Ca biên | 13 | ký tự đặc biệt + chuỗi tiêm SQL, phân trang, xoá/rename nhóm đang được tham chiếu, bảng nhiều-nhóm |

## Deploy

1. Backup DB
2. Deploy code + `bench migrate` (patch tự chạy)
3. `bench clear-cache` — **không cần** `bench build`, chỉ đụng doctype JS
4. Kiểm: mở một Issue cũ → thấy ô Nhóm sự cố; menu Support có 2 lối vào mới
5. **Chưa tắt gì cả** — dựng danh mục mới xong mới tắt `Danh mục cũ`

**Gỡ:** xoá 4 Custom Field + 3 doctype mới + Property Setter `search_index`, rồi xoá dòng
Patch Log. Dữ liệu duy nhất bị thay đổi là các ca vốn **trống** `issue_type`.
