---
title: Phân loại Issue — Tech
layout: default
parent: Tài liệu kỹ thuật
---

# Phân loại Issue hai tầng — tài liệu kỹ thuật

App: **support_plus** · Patch: `setup_issue_taxonomy` → `group_first_issue_taxonomy`

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

Mind map nghiệp vụ có 4 tầng (triệu chứng → bộ phận → hỏng thế nào → chi tiết hơn nữa).
Gộp còn **hai ô nhập liệu**, vì quy trình tiếp nhận chỉ có một thời điểm: CSKH gọi khách,
hỏi đủ để chốt cả hai. Kết quả xử lý của kỹ thuật viên vẫn ghi vào `resolution_details`.

| Doctype / field | Vai trò |
|---|---|
| `Issue Group` (mới) | Cấp 1 — triệu chứng. Cờ `hide_types` bật/tắt cả cụm |
| `Issue Type` (ERPNext) | Cấp chi tiết. Thêm `custom_issue_groups` (**reqd**) + `disabled` |
| `Issue Type Group` (mới, child) | Dòng của bảng nhiều-nhóm |
| `Issue.custom_issue_group` | **Nhập tay**, reqd, đứng trước `issue_type`, có index |
| `Issue.issue_type` | Giữ nguyên reqd, lọc theo nhóm đã chọn |

**Vì sao Issue Type phải thuộc NHIỀU nhóm.** `Tiền lọc quá hạn` gây ra pH lệch, nước có mùi
lẫn cặn trắng. Khai một-nhóm sẽ phải nhân bản thành `Tiền lọc quá hạn (pH)` / `(mùi)` /
`(cặn)` — đúng cái bệnh của danh mục cũ. Có 8 loại như vậy; khai một-nhóm sẽ đẩy 72 loại
thành 83.

**Vì sao `Issue.custom_issue_group` phải nhập tay chứ không `fetch_from`.** Chính vì một
type thuộc nhiều nhóm: suy ngược từ type không ra được nhóm nào. Nhóm là dữ liệu CSKH chọn,
nhờ đó hai ca cùng `Tiền lọc quá hạn` mà khác nhóm vẫn phân biệt được.

**Nguyên tắc xuyên suốt: không đụng dữ liệu lịch sử.** Patch không rename, không xoá
Issue Type nào, không đổi `issue_type` của bản ghi Issue — trừ các ca vốn để **trống**
(được gán `Không xác định` vì `issue_type` là trường bắt buộc nên không save lại được).

Toàn bộ 60 type cũ nằm trong một nhóm `Danh mục cũ` (tạo ở trạng thái **đang bật**), để tắt
cả cụm bằng một công tắc khi danh mục mới đã được duyệt.

## Cơ chế ẩn

Frappe tự loại bản ghi có field `disabled` khỏi mọi dropdown Link — xem
`frappe/desk/search.py::search_widget`. **Custom Field cũng được tính**, nên chỉ cần thêm
một field Check tên `disabled` vào `Issue Type`, không phải viết code lọc.

Cờ chảy từ nhóm xuống type qua hai đường:

- `Issue Group.on_update` → `sync_flag_to_types()`: tính lại `disabled` cho mọi type có
  chứa nhóm này. **Không chép thẳng cờ của nhóm xuống** — một type thuộc nhiều nhóm chỉ ẩn
  khi *mọi* nhóm của nó đều tắt.
- `doc_events` Issue Type validate → `inherit_group_disabled`: type mới thêm vào nhóm đang
  tắt tự bị ẩn theo.

Cả hai đều đi qua `should_hide(groups)` để một chỗ quyết định.

## Chín cái bẫy đã gặp

### 1. Cờ trên Issue Group không được đặt tên `disabled`

Frappe loại bản ghi `disabled` khỏi **mọi** dropdown Link, **kể cả ô lọc**. Nếu cờ của
`Issue Group` tên là `disabled`, tắt nhóm xong là mất luôn khả năng lọc/báo cáo 25.072 ca
lịch sử theo nhóm đó — đúng thứ mà nhóm sinh ra để làm. Đổi tên thành `hide_types` là
Frappe không nhận ra nữa; cờ ẩn thật vẫn nằm trên `Issue Type.disabled`.

### 2. Fixtures đè patch

Patch chạy ở `post_model_sync`, còn bước đồng bộ fixtures chạy **sau** nó → **file
fixtures là người nói cuối cùng**. Đặt `reqd=1` trong `CUSTOM_FIELDS` của patch xong,
migrate tiếp là bị đè về giá trị trong `fixtures/custom_field.json`.

Mọi thuộc tính custom field sửa trong patch **phải sửa cả trong fixtures**, kể cả việc
*xoá* một field: bỏ tên khỏi `hooks.py` là chưa đủ, còn phải xoá dòng trong file json.
Triệu chứng đánh lừa: test ngay sau `bench execute` thì PASS, chỉ FAIL sau khi migrate.

### 3. `db.add_index` trong patch bị chính migrate xoá

`add_index` **cố tình bỏ qua** việc ghi Property Setter khi đang chạy trong migrate
(`frappe/database/mariadb/database.py`), nên bước sync customizations chạy sau patch xoá
lại index vừa tạo — im lặng, không lỗi gì. Phải khai bằng
`make_property_setter(..., "search_index", 1, ...)`.

### 4. Meta cache trong cùng request

Patch tạo custom field rồi lập tức insert `Issue Type` → ô mới chưa tồn tại vì meta trong
cache của request đó chưa có → `AttributeError` làm **migrate chết đứng**. Hook phải đọc
bằng `doc.get(...)`, và patch gọi `frappe.clear_cache(doctype=...)` ngay sau
`create_custom_fields`.

### 5. Bước gom bị chính bước hàn link mồ côi vô hiệu hoá

`heal_orphan_type()` tạo lại type `Không xác định` và **phải gán nhóm ngay lúc insert** (ô
nhóm là bắt buộc). Chính bản ghi đó làm guard *"nhóm đã có type thì thôi"* của
`move_all_types_into_legacy_group()` bật lên → hàm return sớm, 59 type còn lại không bao
giờ được gom.

Trên site sạch — tức production — hậu quả là **59/60 type không có nhóm và 8.661 ca không
có nhóm**, mà tick công tắc thì không ẩn được gì. Sửa: gom trước, hàn sau, và loại
`Không xác định` ra khỏi phép đếm của guard.

### 6. Xoá một nhóm phải kéo theo Issue trỏ vào nó

`group_first_issue_taxonomy` xoá nhóm nháp của bản thiết kế trước. Bản nháp đã kéo 968 ca
sang nhóm đó, nên xoá nhóm mà quên UPDATE `tabIssue` là đẻ ra đúng loại link mồ côi mà
patch trước phải đi hàn.

### 7. Workspace bị import lại mỗi lần migrate

`("desk", "workspace")` nằm trong danh sách sync của `frappe/model/sync.py`, nên link chèn
tay vào workspace `Support` của ERPNext sẽ mất khi ERPNext nâng cấp. Giải pháp: gắn qua
hook `after_migrate` (`support_plus.lib.workspace.ensure_support_workspace_links`), idempotent.

### 8. developer_mode ghi ngược file vào app khác

Save một doc chuẩn thuộc app khác (Workspace `Support` của erpnext) trên máy dev sẽ **ghi
file json vào `apps/erpnext/`** và làm bẩn repo người khác. Chặn bằng
`frappe.flags.in_import = True` quanh `doc.save()` — đúng nhánh điều kiện trong
`frappe/modules/utils.py::export_module_json`. Prod `developer_mode=0` nên không dính.

### 9. Link mồ côi `Không xác định`

16.004 ca trỏ tới một Issue Type đã bị xoá khỏi danh mục → mọi thao tác Save trên các ca
đó throw `LinkValidationError`. Patch tạo lại bản ghi đó thay vì sửa dữ liệu Issue.

## Truy vấn lọc

`support_plus.lib.issue_type.issue_type_query`, gắn vào form qua `frm.set_query` trong
`issue.js`. Chưa chọn nhóm thì trả về mọi loại còn sống, để ca cũ và luồng nhập qua API
không bị chặn.

Không đặt alias cho bảng chính — `get_match_cond()` sinh điều kiện theo tên bảng đầy đủ.

Đổi nhóm trên một ca đang mở thì `issue.js` hỏi
`support_plus.lib.issue_type.type_belongs_to_group` rồi mới xoá ô Loại — không gọi
`frappe.db.exists` thẳng từ client vì bảng con không có permission riêng.

**Chỉ lọc dropdown, không validate cứng.** Ghi qua API/import vẫn lọt, giống hệt cách cờ
ẩn type hoạt động.

## Giới hạn đã biết

- Cờ ẩn chỉ chặn ở tầng chọn tay. Ghi thẳng qua API/integration vẫn nhận type đã ẩn —
  đây là chủ ý, nhờ vậy bản ghi lịch sử mới giữ được type cũ.
- `service_reminder` (trang service-report) đọc `SELECT DISTINCT name FROM tabIssue Type`
  nên ô lọc ở đó vẫn hiện đủ mọi type, kể cả đã ẩn.
- Báo cáo theo nhóm chỉ có dữ liệu thật từ thời điểm triển khai; 25.072 ca lịch sử đều rơi
  vào một dòng `Danh mục cũ`.
- Chưa có: nhóm lồng cha/con.
- Xoá custom field không xoá cột trong bảng. Site nào đã chạy bản thiết kế cũ sẽ còn lại
  cột mồ côi `tabIssue.custom_root_cause` — vô hại, và site sạch không bao giờ tạo nó.

## Kiểm thử

Không có test suite tự động trong app. Trước khi deploy đã chạy tay 70 phép kiểm trên bản
sao dữ liệu prod:

| Bộ | Số | Nội dung |
|---|---|---|
| Cấu trúc / fixtures / danh mục / dữ liệu lịch sử / lọc | 37 | doctype, thứ tự field, reqd, fixtures khớp DB; 10 nhóm + 132 type; 25.072 ca giữ nguyên type và nhóm; 9 nhóm lọc ra đúng danh sách loại |
| Hành vi bật/tắt | 22 | tắt `Danh mục cũ` ẩn đúng 60; tắt một nhóm mới **không** ẩn loại còn thuộc nhóm khác; guard chặn khi cạn type; thêm type vào nhóm đang tắt; chạy lại patch |
| Hồi quy | 11 | tạo ca mới thiếu từng ô đều bị chặn; hai ca cùng loại khác nhóm giữ đúng nhóm; SQL đọc thẳng; gom nhóm cho báo cáo |

## Deploy

1. Backup DB
2. Deploy code + `bench migrate` (hai patch tự chạy tuần tự)
3. `bench clear-cache` — **không cần** `bench build`, chỉ đụng doctype JS
4. Kiểm: mở một Issue cũ → thấy ô Nhóm sự cố đứng trước Loại sự cố; menu Support có lối vào
   **Nhóm sự cố**
5. **Chưa tắt gì cả** — xem lại danh mục mới xong mới tắt `Danh mục cũ`

**Gỡ:** xoá 3 Custom Field + 2 doctype mới + Property Setter `search_index`, rồi xoá hai
dòng Patch Log. Dữ liệu duy nhất bị thay đổi là các ca vốn **trống** `issue_type`.
