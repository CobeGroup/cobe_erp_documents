---
title: C · Kho và giao nhận
layout: default
parent: Quy trình hợp nhất
nav_order: 30
has_children: true
---

<!-- Trang sinh tự động bởi _tools/quy_trinh/build.py từ _quy_trinh/. Sửa tệp dữ liệu rồi chạy lại bộ sinh; sửa thẳng trang này sẽ bị ghi đè. -->

# Phân khu C — Kho và giao nhận
{: .no_toc }

**Ai làm:** Kho · Kỹ thuật viên · Kinh doanh
{: .fs-3 .text-grey-dk-000 }

Hàng rời kho công ty theo một trong hai đường: kỹ thuật viên mang đi và giao tận tay, hoặc gửi qua đơn vị vận chuyển. Hàng kỹ thuật viên mang theo vẫn nằm trên sổ sách, ở kho riêng của người đó, cho tới khi giao cho khách hàng hoặc trả về kho.

| Nhận vào | Bàn giao ra |
|---|---|
| ▶ [B · Điều phối và hiện trường](Quy-Trinh-B-Hien-Truong.html#lap-sa) — Lịch hẹn đã có kỹ thuật viên<br>▶ [A · Bán hàng](Quy-Trinh-A-Ban-Hang.html#ban-giao) — Đơn không cần người đến | ◀ [D · Thu tiền và kế toán](Quy-Trinh-D-Thu-Tien.html#co-phieu-giao) — Thu tiền cho phần đã giao<br>◀ [B · Điều phối và hiện trường](Quy-Trinh-B-Hien-Truong.html#hoan-thanh-wo) — Hoàn thành phiếu công việc<br>◀ [D · Thu tiền và kế toán](Quy-Trinh-D-Thu-Tien.html) — Tiền thu hộ về tài khoản công ty |

👉 **[Các thẻ tình huống của phân khu C](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html)** · [Bản đồ tổng](00-quy-trinh.html)

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ — Kỹ thuật viên mang hàng đi
{: #mang-hang }

Mỗi kỹ thuật viên có một **kho riêng** (`Warehouse`) cho từng công ty. Hàng ở đó vẫn là tài
sản công ty, chỉ đổi vị trí lưu trữ.

| Trường hợp | Quy tắc |
|---|---|
| Một người, nhiều công ty | Mỗi công ty một kho |
| Kho hoàn trả mặc định | Khai riêng, **không trùng** kho của chính người đó |
| Chưa khai kho cho một công ty | Mọi thao tác vật tư ở công ty đó đều báo lỗi |

<div class="qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 760 1351" width="760" height="1351" role="img" aria-labelledby="qt-t-pk-C-mang-hang qt-d-pk-C-mang-hang">
<title id="qt-t-pk-C-mang-hang">Sơ đồ phân khu C — Kho và giao nhận · Kỹ thuật viên mang hàng đi</title>
<desc id="qt-d-pk-C-mang-hang">Đường chính đọc từ trên xuống. Ô chữ nhật là bước, ô sáu cạnh là điểm rẽ, nhãn đỏ là thẻ tình huống, ô viền đứt là cổng sang phân khu khác.</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="760" height="1351"/>
<a href="Quy-Trinh-B-Hien-Truong.html#lap-sa"><title>Mở phân khu B</title>
<rect class="qt-cong" x="50" y="20" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="210" y="43" text-anchor="middle">▶ Từ B · Điều phối và hiện trường</text>
<text class="qt-ts" x="210" y="59" text-anchor="middle">Lịch hẹn đã có kỹ thuật viên</text>
</a>
<line class="qt-mui" x1="210" y1="74" x2="210" y2="100" marker-end="url(#qt-ah)"/>
<a href="#yeu-cau"><title>C·1 · Yêu cầu vật tư theo lịch hẹn</title>
<rect class="qt-c" x="50" y="104" width="320" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="128" r="12"/>
<text class="qt-so" x="74" y="132" text-anchor="middle">1</text>
<text class="qt-tb" x="96" y="132" text-anchor="start">Yêu cầu vật tư theo lịch hẹn</text>
<text class="qt-ts" x="96" y="148" text-anchor="start">Ứng dụng tự gom danh sách cần mang</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-01"><title>Mở thẻ KG-01</title>
<rect class="qt-pill" x="96" y="160" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="174" text-anchor="middle">⚠ KG-01</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-02"><title>Mở thẻ KG-02</title>
<rect class="qt-pill" x="166.7" y="160" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="198" y="174" text-anchor="middle">⚠ KG-02</text>
</a>
<line class="qt-mui" x1="210" y1="192" x2="210" y2="218" marker-end="url(#qt-ah)"/>
<a href="#xuat-kho"><title>C·2 · Kho xuất hàng sang kho kỹ thuật viên</title>
<rect class="qt-c" x="50" y="222" width="320" height="106" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="246" r="12"/>
<text class="qt-so" x="74" y="250" text-anchor="middle">2</text>
<text class="qt-tb" x="96" y="250" text-anchor="start">Kho xuất hàng sang</text>
<text class="qt-tb" x="96" y="268" text-anchor="start">kho kỹ thuật viên</text>
<text class="qt-ts" x="96" y="284" text-anchor="start">Xuất từ nhiều kho, xuất nhiều lần</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-03"><title>Mở thẻ KG-03</title>
<rect class="qt-pill" x="96" y="296" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="310" text-anchor="middle">⚠ KG-03</text>
</a>
<line class="qt-mui" x1="210" y1="328" x2="210" y2="354" marker-end="url(#qt-ah)"/>
<a href="#giao-hang"><title>C·3 · Lập phiếu giao hàng, khách hàng ký</title>
<rect class="qt-c" x="50" y="358" width="320" height="104" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="382" r="12"/>
<text class="qt-so" x="74" y="386" text-anchor="middle">3</text>
<text class="qt-tb" x="96" y="386" text-anchor="start">Lập phiếu giao hàng, khách hàng ký</text>
<text class="qt-ts" x="96" y="402" text-anchor="start">Giao đủ, hoặc giảm số lượng</text>
<text class="qt-ts" x="96" y="418" text-anchor="start">phần khách không nhận</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-04"><title>Mở thẻ KG-04</title>
<rect class="qt-pill" x="96" y="430" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="444" text-anchor="middle">⚠ KG-04</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-05"><title>Mở thẻ KG-05</title>
<rect class="qt-pill" x="166.7" y="430" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="198" y="444" text-anchor="middle">⚠ KG-05</text>
</a>
<line class="qt-mui" x1="210" y1="462" x2="210" y2="488" marker-end="url(#qt-ah)"/>
<a href="#sau-giao"><title>C·4 · Khách hàng nhận đủ số hàng mang đến?</title>
<polygon class="qt-re" points="20,517 45,492 715,492 740,517 715,542 45,542"/>
<circle class="qt-tron" cx="64" cy="517" r="12"/>
<text class="qt-so" x="64" y="521" text-anchor="middle">4</text>
<text class="qt-tb" x="380" y="522" text-anchor="middle">Khách hàng nhận đủ số hàng mang đến?</text>
</a>
<line class="qt-mui" x1="196" y1="542" x2="196" y2="568" marker-end="url(#qt-ah)"/>
<a href="#nhan-du"><title>C·4a · Nhận đủ</title>
<rect class="qt-c" x="20" y="572" width="352" height="33" rx="17" ry="17"/>
<text class="qt-tb" x="196" y="594" text-anchor="middle">4a · Nhận đủ</text>
</a>
<line class="qt-mui" x1="196" y1="605" x2="196" y2="625" marker-end="url(#qt-ah)"/>
<a href="#nhan-du"><title>C·4a · Nhận đủ</title>
<rect class="qt-trang" x="20" y="629" width="352" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="34" y="653" text-anchor="start">Hàng trừ khỏi kho kỹ thuật viên</text>
<text class="qt-ts" x="34" y="668" text-anchor="start">Không phát sinh nghĩa vụ trả</text>
</a>
<line class="qt-mui" x1="564" y1="542" x2="564" y2="568" marker-end="url(#qt-ah)"/>
<a href="#tra-ve"><title>C·4b · Còn phần không giao</title>
<rect class="qt-c" x="388" y="572" width="352" height="33" rx="17" ry="17"/>
<text class="qt-tb" x="564" y="594" text-anchor="middle">4b · Còn phần không giao</text>
</a>
<line class="qt-mui" x1="564" y1="605" x2="564" y2="625" marker-end="url(#qt-ah)"/>
<a href="#tra-ve"><title>C·4b · Còn phần không giao</title>
<rect class="qt-trang" x="388" y="629" width="352" height="82" rx="10" ry="10"/>
<text class="qt-tb2" x="402" y="653" text-anchor="start">Nghĩa vụ trả tự phát sinh</text>
<text class="qt-ts" x="402" y="668" text-anchor="start">Số cần trả = mang đi − thực giao</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-06"><title>Mở thẻ KG-06</title>
<rect class="qt-pill" x="402" y="679" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="433.3" y="693" text-anchor="middle">⚠ KG-06</text>
</a>
<line class="qt-mui" x1="564" y1="711" x2="564" y2="731" marker-end="url(#qt-ah)"/>
<a href="#tra-ve"><title>C·4b · Còn phần không giao</title>
<rect class="qt-trang" x="388" y="735" width="352" height="82" rx="10" ry="10"/>
<text class="qt-tb2" x="402" y="759" text-anchor="start">Lập phiếu trả từ ứng dụng</text>
<text class="qt-ts" x="402" y="774" text-anchor="start">Phiếu ở trạng thái nháp</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-07"><title>Mở thẻ KG-07</title>
<rect class="qt-pill" x="402" y="785" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="433.3" y="799" text-anchor="middle">⚠ KG-07</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-08"><title>Mở thẻ KG-08</title>
<rect class="qt-pill" x="472.7" y="785" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="504" y="799" text-anchor="middle">⚠ KG-08</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-09"><title>Mở thẻ KG-09</title>
<rect class="qt-pill" x="543.3" y="785" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="574.6" y="799" text-anchor="middle">⚠ KG-09</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-10"><title>Mở thẻ KG-10</title>
<rect class="qt-pill" x="614" y="785" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="645.3" y="799" text-anchor="middle">⚠ KG-10</text>
</a>
<line class="qt-mui" x1="564" y1="817" x2="564" y2="837" marker-end="url(#qt-ah)"/>
<a href="#tra-ve"><title>C·4b · Còn phần không giao</title>
<rect class="qt-trang" x="388" y="841" width="352" height="82" rx="10" ry="10"/>
<text class="qt-tb2" x="402" y="865" text-anchor="start">Kho kiểm đếm và duyệt</text>
<text class="qt-ts" x="402" y="880" text-anchor="start">Duyệt xong nghĩa vụ mới hết</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-11"><title>Mở thẻ KG-11</title>
<rect class="qt-pill" x="402" y="891" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="433.3" y="905" text-anchor="middle">⚠ KG-11</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-12"><title>Mở thẻ KG-12</title>
<rect class="qt-pill" x="472.7" y="891" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="504" y="905" text-anchor="middle">⚠ KG-12</text>
</a>
<line class="qt-mui" x1="196" y1="683" x2="196" y2="949" marker-end="url(#qt-ah)"/>
<line class="qt-mui" x1="564" y1="923" x2="564" y2="949" marker-end="url(#qt-ah)"/>
<a href="#sau-giao"><title>C·4 · Khách hàng nhận đủ số hàng mang đến?</title>
<rect class="qt-trang" x="20" y="953" width="720" height="54" rx="10" ry="10"/>
<text class="qt-tb" x="380" y="977" text-anchor="middle">Phiếu giao hàng đã xác nhận</text>
<text class="qt-ts" x="380" y="995" text-anchor="middle">Phần không giao được theo dõi đến khi kho duyệt phiếu trả</text>
</a>
<line class="qt-mui" x1="205" y1="1007" x2="205" y2="1033" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#co-phieu-giao"><title>Mở phân khu D</title>
<rect class="qt-cong" x="45" y="1037" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="205" y="1060" text-anchor="middle">◀ Sang D · Thu tiền và kế toán</text>
<text class="qt-ts" x="205" y="1076" text-anchor="middle">Thu tiền cho phần đã giao</text>
</a>
<line class="qt-mui" x1="555" y1="1007" x2="555" y2="1033" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#hoan-thanh-wo"><title>Mở phân khu B</title>
<rect class="qt-cong" x="395" y="1037" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="555" y="1060" text-anchor="middle">◀ Sang B · Điều phối và hiện trường</text>
<text class="qt-ts" x="555" y="1076" text-anchor="middle">Hoàn thành phiếu công việc</text>
</a>
<a href="#vat-tu-khac"><title>Vật tư — tình huống ngoài luồng chính</title>
<rect class="qt-ngoai" x="20" y="1127" width="720" height="204" rx="12" ry="12"/>
<text class="qt-lan" x="36" y="1153" text-anchor="start">Vật tư — tình huống ngoài luồng chính</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-13"><title>Mở thẻ KG-13</title>
<rect class="qt-the" x="36" y="1167" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="48" y="1186" text-anchor="start">⚠ KG-13</text>
<text class="qt-ts" x="48" y="1203" text-anchor="start">Nghĩa vụ trỏ tới mã vật tư</text>
<text class="qt-ts" x="48" y="1219" text-anchor="start">không còn tồn tại</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-14"><title>Mở thẻ KG-14</title>
<rect class="qt-the" x="270.7" y="1167" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="282.7" y="1186" text-anchor="start">⚠ KG-14</text>
<text class="qt-ts" x="282.7" y="1203" text-anchor="start">Nghĩa vụ bộ sản phẩm không</text>
<text class="qt-ts" x="282.7" y="1219" text-anchor="start">khớp thành phần</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-15"><title>Mở thẻ KG-15</title>
<rect class="qt-the" x="505.3" y="1167" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="517.3" y="1186" text-anchor="start">⚠ KG-15</text>
<text class="qt-ts" x="517.3" y="1203" text-anchor="start">Nghĩa vụ không ghi kho nguồn</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-16"><title>Mở thẻ KG-16</title>
<rect class="qt-the" x="36" y="1245" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="48" y="1264" text-anchor="start">⚠ KG-16</text>
<text class="qt-ts" x="48" y="1281" text-anchor="start">Kho kỹ thuật viên âm tồn</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-17"><title>Mở thẻ KG-17</title>
<rect class="qt-the" x="270.7" y="1245" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="282.7" y="1264" text-anchor="start">⚠ KG-17</text>
<text class="qt-ts" x="282.7" y="1281" text-anchor="start">Huỷ phiếu giao hàng</text>
<text class="qt-ts" x="282.7" y="1297" text-anchor="start">sau khi đã trả vật tư</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-18"><title>Mở thẻ KG-18</title>
<rect class="qt-the" x="505.3" y="1245" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="517.3" y="1264" text-anchor="start">⚠ KG-18</text>
<text class="qt-ts" x="517.3" y="1281" text-anchor="start">Huỷ phiếu công việc nhưng vật</text>
<text class="qt-ts" x="517.3" y="1297" text-anchor="start">tư vẫn ở kho kỹ thuật viên</text>
</a>
</svg>
</div>

<p class="qt-chu-giai"><span class="qt-k qt-k-buoc"></span> bước <span class="qt-k qt-k-re"></span> điểm rẽ <span class="qt-k qt-k-the"></span> thẻ tình huống <span class="qt-k qt-k-cong"></span> sang phân khu khác<br>👆 Bấm vào bất kỳ ô nào để mở phần giải thích.</p>

---

## C·1 — Yêu cầu vật tư theo lịch hẹn
{: #yeu-cau }

**Ai làm:** Kỹ thuật viên

Trên ứng dụng: màn hình kho → **Yêu cầu hàng** → chọn lịch hẹn sắp làm. Hệ thống gom sẵn
vật tư từ phiếu công việc, từng dòng việc và đơn bán hàng liên kết (số còn phải giao).

| Hệ thống tự làm | Nghĩa là |
|---|---|
| **Khai triển bộ sản phẩm** | Dòng cha chỉ để tham khảo; các món thành phần hiện bên dưới, số lượng đã nhân theo bộ |
| **Trừ phần đã yêu cầu trước** | Được yêu cầu = cần − đã yêu cầu |

Vật tư tiêu hao và hàng dự phòng thì yêu cầu **không gắn lịch hẹn**: tìm món theo tên →
nhập số lượng → chọn kho đích → gửi. Loại này không sinh nghĩa vụ trả.

**Tình huống ở bước này:**

- ⚠ [KG-01 · Món đã yêu cầu đủ không chọn được](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-01)
- ⚠ [KG-02 · Mọi thao tác vật tư đều báo lỗi ở một công ty](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-02)

---

## C·2 — Kho xuất hàng sang kho kỹ thuật viên
{: #xuat-kho }

**Ai làm:** Kho

Nhân viên kho nhận yêu cầu trên `/master-stock` hoặc Desk, rồi lập phiếu xuất kho
(`Stock Entry`). Hệ thống theo dõi từng yêu cầu: chưa xuất, xuất một phần, xuất đủ — kỹ
thuật viên thấy ngay trên ứng dụng.

**Tình huống ở bước này:**

- ⚠ [KG-03 · Hàng được cấp ngoài phiếu yêu cầu](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-03)

---

## C·3 — Lập phiếu giao hàng, khách hàng ký
{: #giao-hang }

**Ai làm:** Kỹ thuật viên

Trên ứng dụng: mở lịch hẹn → tab **Đơn hàng** → **Giao hàng**.

| Điều kiện | Nội dung |
|---|---|
| Trạng thái đơn | Không thuộc *Closed*, *Cancelled*, *On Hold* |
| Kho | Kỹ thuật viên phải được khai kho cho công ty của đơn |
| Mỗi đơn | Phải giao ít nhất một món |

| Thao tác trên dòng | Nghĩa |
|---|---|
| Giữ nguyên số lượng | Giao đủ |
| Giảm số lượng | Giao một phần; phần chênh thành **hàng hoàn trả** |
| Đặt về 0 | Không giao món đó |

Khách hàng **ký trên màn hình**; chưa ký thì nút xác nhận không bật. Phiếu giao hàng
(`Delivery Note`) là điều kiện bắt buộc để được thu tiền.

**Tình huống ở bước này:**

- ⚠ [KG-04 · Không xác nhận được phiếu giao hàng](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-04)
- ⚠ [KG-05 · Nút xác nhận ở màn hình ký không bật](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-05)

---

## C·4 — Khách hàng nhận đủ số hàng mang đến?
{: #sau-giao }

⚠️ **Nghĩa vụ trả phát sinh ngay lúc lập phiếu giao hàng**, không phải lúc trả hàng:

> **Số cần trả = số mang đi − số thực giao cho khách hàng**

Mỗi phần chênh có một **mã nghĩa vụ** riêng, ghi vào đơn bán hàng kèm người khai, kho lúc
khai và phiếu giao hàng đã làm phát sinh.

### C·4a — Nhận đủ
{: #nhan-du }

1. **Hàng trừ khỏi kho kỹ thuật viên** — Không phát sinh nghĩa vụ trả


### C·4b — Còn phần không giao
{: #tra-ve }

1. **Nghĩa vụ trả tự phát sinh** — Số cần trả = mang đi − thực giao
2. **Lập phiếu trả từ ứng dụng** — Phiếu ở trạng thái nháp
3. **Kho kiểm đếm và duyệt** — Duyệt xong nghĩa vụ mới hết

Màn hình **Trả vật tư** hiện ba con số cho mỗi nghĩa vụ:

| Con số | Nghĩa |
|---|---|
| **Cần trả** | Phần còn lại sau khi trừ các phiếu **đã duyệt** |
| **Đang chờ kho** | Phần đang nằm trong phiếu **nháp** |
| **Còn chọn được** | Cần trả − Đang chờ kho |

⛔ **Phiếu trả nháp không làm thay đổi sổ kho.** Hàng vẫn tính ở kho kỹ thuật viên cho
tới khi kho duyệt; lúc duyệt hệ thống kiểm lại tồn kho lần nữa. Kỹ thuật viên xoá được
phiếu nháp **do chính mình lập**, xoá xong nghĩa vụ mở lại ngay.

📚 Chi tiết từng tình huống: [Trả vật tư về kho (FSMNext)](FSMNext-Tra-Vat-Tu.html).

**Tình huống ở bước này:**

- ⚠ [KG-06 · Không rõ vì sao có nghĩa vụ trả](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-06)
- ⚠ [KG-07 · Dòng nghĩa vụ mờ và bị khoá](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-07)
- ⚠ [KG-08 · Không xoá được phiếu trả nháp](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-08)
- ⚠ [KG-09 · Phiếu trả được ghi vào kho của người khác](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-09)
- ⚠ [KG-10 · Báo đã trả đủ, hoặc vượt số còn lại](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-10)
- ⚠ [KG-11 · Đã trả hàng nhưng nghĩa vụ vẫn còn](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-11)
- ⚠ [KG-12 · Phiếu trả nháp tồn đọng từ lâu](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-12)

---

## Vật tư — tình huống ngoài luồng chính
{: #vat-tu-khac }


**Tình huống ở bước này:**

- ⚠ [KG-13 · Nghĩa vụ trỏ tới mã vật tư không còn tồn tại](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-13)
- ⚠ [KG-14 · Nghĩa vụ bộ sản phẩm không khớp thành phần](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-14)
- ⚠ [KG-15 · Nghĩa vụ không ghi kho nguồn](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-15)
- ⚠ [KG-16 · Kho kỹ thuật viên âm tồn](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-16)
- ⚠ [KG-17 · Huỷ phiếu giao hàng sau khi đã trả vật tư](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-17)
- ⚠ [KG-18 · Huỷ phiếu công việc nhưng vật tư vẫn ở kho kỹ thuật viên](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-18)

---

## Sơ đồ — Gửi qua đơn vị vận chuyển
{: #gui-van-chuyen }

Dùng khi khách hàng ở xa, hàng không cần lắp đặt, hoặc chỉ gửi vật tư lẻ.

<div class="qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 760 1028" width="760" height="1028" role="img" aria-labelledby="qt-t-pk-C-gui-van-chuyen qt-d-pk-C-gui-van-chuyen">
<title id="qt-t-pk-C-gui-van-chuyen">Sơ đồ phân khu C — Kho và giao nhận · Gửi qua đơn vị vận chuyển</title>
<desc id="qt-d-pk-C-gui-van-chuyen">Đường chính đọc từ trên xuống. Ô chữ nhật là bước, ô sáu cạnh là điểm rẽ, nhãn đỏ là thẻ tình huống, ô viền đứt là cổng sang phân khu khác.</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="760" height="1028"/>
<a href="Quy-Trinh-A-Ban-Hang.html#ban-giao"><title>Mở phân khu A</title>
<rect class="qt-cong" x="50" y="20" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="210" y="43" text-anchor="middle">▶ Từ A · Bán hàng</text>
<text class="qt-ts" x="210" y="59" text-anchor="middle">Đơn không cần người đến</text>
</a>
<line class="qt-mui" x1="210" y1="74" x2="210" y2="100" marker-end="url(#qt-ah)"/>
<a href="#van-chuyen"><title>C·5 · Lập vận đơn từ đơn bán hàng</title>
<rect class="qt-c" x="50" y="104" width="320" height="104" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="128" r="12"/>
<text class="qt-so" x="74" y="132" text-anchor="middle">5</text>
<text class="qt-tb" x="96" y="132" text-anchor="start">Lập vận đơn từ đơn bán hàng</text>
<text class="qt-ts" x="96" y="148" text-anchor="start">Khai kiện hàng và người</text>
<text class="qt-ts" x="96" y="164" text-anchor="start">trả cước trước khi đẩy đơn</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-19"><title>Mở thẻ KG-19</title>
<rect class="qt-pill" x="96" y="176" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="190" text-anchor="middle">⚠ KG-19</text>
</a>
<line class="qt-mui" x1="210" y1="208" x2="210" y2="234" marker-end="url(#qt-ah)"/>
<a href="#xac-nhan-vd"><title>C·6 · Xác nhận vận đơn</title>
<rect class="qt-c" x="50" y="238" width="320" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="262" r="12"/>
<text class="qt-so" x="74" y="266" text-anchor="middle">6</text>
<text class="qt-tb" x="96" y="266" text-anchor="start">Xác nhận vận đơn</text>
<text class="qt-ts" x="96" y="282" text-anchor="start">Sinh đề nghị xuất kho, tồn kho chưa đổi</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-20"><title>Mở thẻ KG-20</title>
<rect class="qt-pill" x="96" y="294" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="308" text-anchor="middle">⚠ KG-20</text>
</a>
<line class="qt-mui" x1="210" y1="326" x2="210" y2="352" marker-end="url(#qt-ah)"/>
<a href="#xuat-dvvc"><title>C·7 · Kho xuất hàng cho đơn vị vận chuyển</title>
<rect class="qt-c" x="50" y="356" width="320" height="122" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="380" r="12"/>
<text class="qt-so" x="74" y="384" text-anchor="middle">7</text>
<text class="qt-tb" x="96" y="384" text-anchor="start">Kho xuất hàng cho</text>
<text class="qt-tb" x="96" y="402" text-anchor="start">đơn vị vận chuyển</text>
<text class="qt-ts" x="96" y="418" text-anchor="start">Trừ kho nguồn, cộng kho</text>
<text class="qt-ts" x="96" y="434" text-anchor="start">của đơn vị vận chuyển</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-21"><title>Mở thẻ KG-21</title>
<rect class="qt-pill" x="96" y="446" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="460" text-anchor="middle">⚠ KG-21</text>
</a>
<line class="qt-mui" x1="210" y1="478" x2="210" y2="504" marker-end="url(#qt-ah)"/>
<a href="#day-don"><title>C·8 · Đẩy đơn, nhận mã vận đơn</title>
<rect class="qt-c" x="50" y="508" width="320" height="58" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="532" r="12"/>
<text class="qt-so" x="74" y="536" text-anchor="middle">8</text>
<text class="qt-tb" x="96" y="536" text-anchor="start">Đẩy đơn, nhận mã vận đơn</text>
<text class="qt-ts" x="96" y="552" text-anchor="start">Trạng thái tự cập nhật theo hành trình</text>
</a>
<line class="qt-mui" x1="210" y1="566" x2="210" y2="592" marker-end="url(#qt-ah)"/>
<a href="#ket-cuc"><title>C·9 · Vận đơn kết thúc thế nào?</title>
<polygon class="qt-re" points="20,621 45,596 715,596 740,621 715,646 45,646"/>
<circle class="qt-tron" cx="64" cy="621" r="12"/>
<text class="qt-so" x="64" y="625" text-anchor="middle">9</text>
<text class="qt-tb" x="380" y="626" text-anchor="middle">Vận đơn kết thúc thế nào?</text>
</a>
<line class="qt-mui" x1="134.7" y1="646" x2="134.7" y2="672" marker-end="url(#qt-ah)"/>
<a href="#giao-thanh-cong"><title>C·9a · Giao thành công</title>
<rect class="qt-c" x="20" y="676" width="229.3" height="33" rx="17" ry="17"/>
<text class="qt-tb" x="134.7" y="698" text-anchor="middle">9a · Giao thành công</text>
</a>
<line class="qt-mui" x1="134.7" y1="709" x2="134.7" y2="729" marker-end="url(#qt-ah)"/>
<a href="#giao-thanh-cong"><title>C·9a · Giao thành công</title>
<rect class="qt-trang" x="20" y="733" width="229.3" height="97" rx="10" ry="10"/>
<text class="qt-tb2" x="34" y="757" text-anchor="start">Chứng từ tự phát sinh</text>
<text class="qt-ts" x="34" y="772" text-anchor="start">Phiếu giao hàng, hoá</text>
<text class="qt-ts" x="34" y="787" text-anchor="start">đơn, phiếu thu hộ</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-22"><title>Mở thẻ KG-22</title>
<rect class="qt-pill" x="34" y="798" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="65.3" y="812" text-anchor="middle">⚠ KG-22</text>
</a>
<line class="qt-mui" x1="380" y1="646" x2="380" y2="672" marker-end="url(#qt-ah)"/>
<a href="#hoan-ve"><title>C·9b · Hoàn về kho</title>
<rect class="qt-c" x="265.3" y="676" width="229.3" height="33" rx="17" ry="17"/>
<text class="qt-tb" x="380" y="698" text-anchor="middle">9b · Hoàn về kho</text>
</a>
<line class="qt-mui" x1="380" y1="709" x2="380" y2="729" marker-end="url(#qt-ah)"/>
<a href="#hoan-ve"><title>C·9b · Hoàn về kho</title>
<rect class="qt-trang" x="265.3" y="733" width="229.3" height="82" rx="10" ry="10"/>
<text class="qt-tb2" x="279.3" y="757" text-anchor="start">Phiếu đảo tự phát sinh</text>
<text class="qt-ts" x="279.3" y="772" text-anchor="start">Hàng về lại kho nguồn</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-23"><title>Mở thẻ KG-23</title>
<rect class="qt-pill" x="279.3" y="783" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="310.7" y="797" text-anchor="middle">⚠ KG-23</text>
</a>
<line class="qt-mui" x1="625.3" y1="646" x2="625.3" y2="672" marker-end="url(#qt-ah)"/>
<a href="#mat-hang"><title>C·9c · Mất hàng</title>
<rect class="qt-c" x="510.7" y="676" width="229.3" height="33" rx="17" ry="17"/>
<text class="qt-tb" x="625.3" y="698" text-anchor="middle">9c · Mất hàng</text>
</a>
<line class="qt-mui" x1="625.3" y1="709" x2="625.3" y2="729" marker-end="url(#qt-ah)"/>
<a href="#mat-hang"><title>C·9c · Mất hàng</title>
<rect class="qt-trang" x="510.7" y="733" width="229.3" height="69" rx="10" ry="10"/>
<text class="qt-tb2" x="524.7" y="757" text-anchor="start">Ghi nhận thất thoát</text>
<text class="qt-ts" x="524.7" y="772" text-anchor="start">Kế toán xử lý, không</text>
<text class="qt-ts" x="524.7" y="787" text-anchor="start">tự hoàn tồn kho</text>
</a>
<line class="qt-mui" x1="134.7" y1="830" x2="134.7" y2="856" marker-end="url(#qt-ah)"/>
<line class="qt-mui" x1="380" y1="815" x2="380" y2="856" marker-end="url(#qt-ah)"/>
<line class="qt-mui" x1="625.3" y1="802" x2="625.3" y2="856" marker-end="url(#qt-ah)"/>
<a href="#ket-cuc"><title>C·9 · Vận đơn kết thúc thế nào?</title>
<rect class="qt-trang" x="20" y="860" width="720" height="54" rx="10" ry="10"/>
<text class="qt-tb" x="380" y="884" text-anchor="middle">Vận đơn kết thúc</text>
<text class="qt-ts" x="380" y="902" text-anchor="middle">Kết cục được ghi lại trên vận đơn</text>
</a>
<line class="qt-mui" x1="210" y1="914" x2="210" y2="940" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html"><title>Mở phân khu D</title>
<rect class="qt-cong" x="50" y="944" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="210" y="967" text-anchor="middle">◀ Sang D · Thu tiền và kế toán</text>
<text class="qt-ts" x="210" y="983" text-anchor="middle">Tiền thu hộ về tài khoản công ty</text>
</a>
</svg>
</div>

<p class="qt-chu-giai"><span class="qt-k qt-k-buoc"></span> bước <span class="qt-k qt-k-re"></span> điểm rẽ <span class="qt-k qt-k-the"></span> thẻ tình huống <span class="qt-k qt-k-cong"></span> sang phân khu khác<br>👆 Bấm vào bất kỳ ô nào để mở phần giải thích.</p>

---

## C·5 — Lập vận đơn từ đơn bán hàng
{: #van-chuyen }

**Ai làm:** Kinh doanh · Kho

Vận đơn (`DP Shipment`) lập từ đơn bán hàng. Tab kiện hàng và người trả cước phải đúng
**trước khi** đẩy đơn — đẩy rồi thì đơn vị vận chuyển tính cước theo số đã khai.

**Tình huống ở bước này:**

- ⚠ [KG-19 · Đơn vị vận chuyển tính sai cước hoặc số kiện](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-19)

---

## C·6 — Xác nhận vận đơn
{: #xac-nhan-vd }

**Ai làm:** Kinh doanh


**Tình huống ở bước này:**

- ⚠ [KG-20 · Vận đơn đã xác nhận mà tồn kho chưa đổi](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-20)

---

## C·7 — Kho xuất hàng cho đơn vị vận chuyển
{: #xuat-dvvc }

**Ai làm:** Kho


**Tình huống ở bước này:**

- ⚠ [KG-21 · Đơn vị vận chuyển đến lấy hàng sai địa điểm](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-21)

---

## C·8 — Đẩy đơn, nhận mã vận đơn
{: #day-don }

**Ai làm:** Kho


---

## C·9 — Vận đơn kết thúc thế nào?
{: #ket-cuc }

### C·9a — Giao thành công
{: #giao-thanh-cong }

1. **Chứng từ tự phát sinh** — Phiếu giao hàng, hoá đơn, phiếu thu hộ


**Tình huống ở bước này:**

- ⚠ [KG-22 · Giao thành công nhưng không thấy chứng từ tự sinh](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-22)

### C·9b — Hoàn về kho
{: #hoan-ve }

1. **Phiếu đảo tự phát sinh** — Hàng về lại kho nguồn


**Tình huống ở bước này:**

- ⚠ [KG-23 · Đơn vị vận chuyển huỷ khi hàng đã được lấy đi](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-23)

### C·9c — Mất hàng
{: #mat-hang }

1. **Ghi nhận thất thoát** — Kế toán xử lý, không tự hoàn tồn kho


---

## Tài liệu chi tiết
{: #tai-lieu-khac }

| Chủ đề | Trang |
|---|---|
| Trả vật tư về kho, từng tình huống | [Trả vật tư về kho (FSMNext)](FSMNext-Tra-Vat-Tu.html) |
| Vận đơn, đối tác giao hàng, điểm gửi | [Quy trình vận đơn và giao nhận](Delivery_Partner-Quy-Trinh.html) |

---

## Câu hỏi thường gặp
{: #hoi-dap }

**Tôi trả hàng rồi, sao vẫn báo còn nợ vật tư?**

Phiếu trả còn ở trạng thái **nháp**. Chỉ khi kho duyệt thì nghĩa vụ mới hết — xem [KG-11](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-11).

**Khách không nhận một món, tôi phải làm gì ngay tại chỗ?**

Giảm số lượng trên phiếu giao hàng. Phần chênh tự thành nghĩa vụ trả; mang hàng về rồi lập phiếu trả.

**Lấy dư vật tư mang theo xe, có phải trả không?**

Phần yêu cầu không gắn lịch hẹn không sinh nghĩa vụ, nhưng vẫn nằm trong kho của bạn và vẫn phải kiểm kê.

**Lập nhầm phiếu trả thì sao?**

Phiếu còn nháp và do chính bạn lập thì xoá được, nghĩa vụ mở lại ngay. Kho đã duyệt rồi thì nhờ kho xử lý.

**Bán một món lẻ gửi bưu điện, có cần phiếu công việc không?**

Không. Đơn đó đi theo [luồng gửi qua đơn vị vận chuyển](#gui-van-chuyen).

**Đơn vị vận chuyển báo huỷ, tôi huỷ vận đơn luôn được không?**

Chỉ khi hàng chưa được lấy đi. Hàng đã lấy thì chờ kho nhận lại rồi mới huỷ — xem [KG-23](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-23).

---

## Đọc tiếp
{: #doc-tiep }

| Bạn cần | Mở trang |
|---|---|
| Xem cách gỡ từng tình huống | [Thẻ tình huống của phân khu C](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html) |
| Tra theo thông báo lỗi | [Khi gặp trục trặc](Quy-Trinh-Tra-Cuu.html) |
| Xem toàn bộ dây chuyền | [Bản đồ tổng](00-quy-trinh.html) |
| Đi theo một đơn hàng cụ thể | [Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html) |
