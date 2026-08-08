---
title: Phân loại Issue — Tech
layout: default
parent: Tài liệu kỹ thuật
---

# Phân loại Issue hai tầng — tài liệu kỹ thuật

App: **support_plus** · 5 patch tuần tự, xem `patches.txt`

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

**Danh mục lấy từ đâu.** Có hai nguồn và chúng không cùng một tầng: mind map tách lỗi bo
mạch thành *"đoản mạch" / "vô nước" / "sai điện áp"*, còn file rà soát của CSKH dừng ở
*"Lỗi thiết bị (Bảng mạch)"*. Tầng sâu hơn đó CSKH không chốt nổi qua điện thoại, mà file
Excel lại là danh sách người dùng thật rà từ dữ liệu thật — 35/50 mục đã mang 3.858 ca.
Nên **Excel làm bộ Loại, mind map làm bộ Nhóm**, còn các lá của mind map hạ xuống ô
`description` để kỹ thuật viên tra.

**Mười nhóm**: chín cái đúng như mind map vẽ, giữ nguyên tên, cộng *Dịch vụ & kiểm tra*
cho 164 ca không phải sự cố kỹ thuật (Test Vipcare, Test nước, Đánh giá dịch vụ) — mind map
chỉ vẽ phạm vi xử lý sự cố nên không phủ mảng này.

| Doctype / field | Vai trò |
|---|---|
| `Issue Group` (mới) | Cấp 1 — triệu chứng. Cờ `hide_types` bật/tắt cả cụm |
| `Issue Type` (ERPNext) | Cấp chi tiết. Thêm `custom_issue_group` (**reqd**), `custom_retired`, `disabled` |
| `Issue.custom_issue_group` | **Nhập tay**, reqd, đứng trước `issue_type`, có index |
| `Issue.issue_type` | Giữ nguyên reqd, lọc theo nhóm đã chọn |

**Mỗi Issue Type thuộc đúng MỘT nhóm.** Bản trước cho thuộc nhiều nhóm để né việc nhân bản
tên, nhưng nó mâu thuẫn với chính định nghĩa: nhóm trả lời *"khách phàn nàn chuyện gì"*, mà
một ca chỉ có một lời phàn nàn. Nó còn đẻ ra cái rối "tắt nhóm mà loại không tắt theo", rồi
phải thêm một ô nữa chỉ để chữa hệ quả đó.

File Excel vốn đã tách sẵn đúng kiểu một-một: cùng nguyên nhân lõi quá hạn được khai thành
bốn loại riêng cho bốn triệu chứng, mỗi cái tự đủ nghĩa. Không có gì phải khử trùng lặp.

**`Issue.custom_issue_group` vẫn nhập tay chứ không `fetch_from`**, vì luồng là chọn Nhóm
trước để lọc Loại — `fetch_from` chỉ chạy sau khi đã có Loại, tức ngược chiều thao tác.

**Nguyên tắc xuyên suốt: không đụng dữ liệu lịch sử.** Patch không rename, không xoá
Issue Type nào, không đổi `issue_type` của bản ghi Issue — trừ các ca vốn để **trống**
(được gán `Không xác định` vì `issue_type` là trường bắt buộc nên không save lại được).

25 loại đã ngừng — 17 cái Excel đánh X và 8 cái Excel không liệt kê — nằm trong nhóm
`Danh mục cũ` (tạo ở trạng thái **đang bật**), để tắt cả cụm bằng một công tắc khi danh mục
mới đã được duyệt. Không xoá cái nào: 21.253 ca vẫn trỏ vào chúng.

Ca mang một trong 35 loại còn sống thì `custom_issue_group` được kéo theo nhóm thật của
loại đó (3.858 ca) — nếu không, ngay ngày đầu bản ghi và loại của nó đã nói hai chuyện khác
nhau. Chỉ `custom_issue_group` đổi, `issue_type` không đụng.

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

Cả hai đều đi qua `should_hide(groups, flags, retired)` để một chỗ quyết định:

    disabled = custom_retired  HOẶC  mọi nhóm của loại đều hide_types=1

`custom_retired` là công tắc của người dùng cho **một** loại; `disabled` là **kết quả tính**
nên để read-only. Nó vẫn phải mang đúng tên `disabled` thì `search_widget` mới loại khỏi
dropdown. Nhờ tách hai ô, bật lại một nhóm không kéo về những loại người ta cố ý bỏ.

## Mười một cái bẫy đã gặp

### 1. Cờ trên Issue Group không được đặt tên `disabled`

Frappe loại bản ghi `disabled` khỏi **mọi** dropdown Link, **kể cả ô lọc**. Nếu cờ của
`Issue Group` tên là `disabled`, tắt nhóm xong là mất luôn khả năng lọc/báo cáo 25.111 ca
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

### 6. Patch sau không được tin patch trước đã chạy đúng

Bản lỗi ở mục 5 đã kịp lên production ngày 05/08. Patch đó nằm sẵn trong Patch Log nên
`bench migrate` **không bao giờ chạy lại nó** — bản vá không với tới được, và
`group_first_issue_taxonomy` thì đọc cột nhóm rỗng nên cũng chẳng có gì để chuyển. Kết cục:
59/60 type và 8.700 ca không có nhóm, mà ô nhóm lại là bắt buộc → không save nổi ca cũ.

Nên `group_first_issue_taxonomy` có `adopt_ungrouped_types()` + `backfill_issue_group()` tự
đứng một mình, không giả định bước trước đã xong. Ca nào còn sót thì ghi Error Log chứ
không im lặng.

### 7. Một ô vừa là công tắc vừa là kết quả tính thì nuốt thao tác người dùng

Ban đầu chỉ có `disabled`, mà hook lại tính lại nó từ trạng thái nhóm ở mỗi lần save. Người
dùng tick tay để bỏ một loại → save → hook ghi đè về 0. Không lỗi, không cảnh báo.

Tệ hơn: điều kiện khoá ô (`read_only_depends_on`) trỏ tới `custom_issue_group` - field đã bị
xoá ở patch trước - nên luôn sai, ô vẫn bấm được trong khi hoàn toàn vô hiệu. Và vì một loại
thuộc nhiều nhóm nên tắt nhóm cũng không bỏ được nó.

Sửa: tách `custom_retired` (người dùng) khỏi `disabled` (kết quả, read-only).

### 8. Xoá một nhóm phải kéo theo Issue trỏ vào nó

`group_first_issue_taxonomy` xoá nhóm nháp của bản thiết kế trước. Bản nháp đã kéo 968 ca
sang nhóm đó, nên xoá nhóm mà quên UPDATE `tabIssue` là đẻ ra đúng loại link mồ côi mà
patch trước phải đi hàn.

### 9. Workspace bị import lại mỗi lần migrate

`("desk", "workspace")` nằm trong danh sách sync của `frappe/model/sync.py`, nên link chèn
tay vào workspace `Support` của ERPNext sẽ mất khi ERPNext nâng cấp. Giải pháp: gắn qua
hook `after_migrate` (`support_plus.lib.workspace.ensure_support_workspace_links`), idempotent.

### 10. developer_mode ghi ngược file vào app khác

Save một doc chuẩn thuộc app khác (Workspace `Support` của erpnext) trên máy dev sẽ **ghi
file json vào `apps/erpnext/`** và làm bẩn repo người khác. Chặn bằng
`frappe.flags.in_import = True` quanh `doc.save()` — đúng nhánh điều kiện trong
`frappe/modules/utils.py::export_module_json`. Prod `developer_mode=0` nên không dính.

### 11. Link mồ côi `Không xác định`

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
  nên ô lọc ở đó hiện đủ mọi loại, kể cả loại đã ẩn. **Cố ý để nguyên**: 21.253 ca lịch sử
  mang loại đã ngừng, lọc bỏ chúng khỏi ô lọc là trang đó không xem được chính dữ liệu nó
  sinh ra. Cùng lý do với việc giữ nguyên tên 35 loại còn dùng.
- 21.253 ca lịch sử rơi vào một dòng `Danh mục cũ` vì mang loại đã ngừng; 3.858 ca còn lại
  đã theo loại của chúng sang nhóm thật nên báo cáo có số liệu ngay.
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
