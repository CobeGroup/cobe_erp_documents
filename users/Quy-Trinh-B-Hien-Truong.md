---
title: B · Điều phối và hiện trường
layout: default
parent: Quy trình hợp nhất
nav_order: 20
has_children: true
---

<!-- Trang sinh tự động bởi _tools/quy_trinh/build.py từ _quy_trinh/. Sửa tệp dữ liệu rồi chạy lại bộ sinh; sửa thẳng trang này sẽ bị ghi đè. -->

# Phân khu B — Điều phối và hiện trường
{: .no_toc }

**Ai làm:** Điều phối · Kỹ thuật viên · Quản lý dịch vụ
{: .fs-3 .text-grey-dk-000 }

Từ lúc có một việc cần người đến nhà khách hàng cho tới lúc phiếu công việc được hoàn thành và đóng lại. Ba chứng từ — đơn bán hàng, phiếu công việc, lịch hẹn — có trạng thái độc lập với nhau và phải được kết thúc riêng.

| Nhận vào | Bàn giao ra |
|---|---|
| ▶ [A · Bán hàng](Quy-Trinh-A-Ban-Hang.html#ban-giao) — Đơn cần người đến<br>▶ [E · Sau bán hàng](Quy-Trinh-E-Sau-Ban-Hang.html#den-tan-noi) — Sự cố cần đến tận nơi | — |

👉 **[Các thẻ tình huống của phân khu B](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html)** · [Bản đồ tổng](00-quy-trinh.html)

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ phân khu
{: #so-do }

<div class="qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 760 1319" width="760" height="1319" role="img" aria-labelledby="qt-t-pk-B qt-d-pk-B">
<title id="qt-t-pk-B">Sơ đồ phân khu B — Điều phối và hiện trường</title>
<desc id="qt-d-pk-B">Đường chính đọc từ trên xuống. Ô chữ nhật là bước, ô sáu cạnh là điểm rẽ, nhãn đỏ là thẻ tình huống, ô viền đứt là cổng sang phân khu khác.</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="760" height="1319"/>
<a href="Quy-Trinh-A-Ban-Hang.html#ban-giao"><title>Mở phân khu A</title>
<rect class="qt-cong" x="50" y="20" width="152" height="71" rx="10" ry="10"/>
<text class="qt-tb2" x="126" y="51.5" text-anchor="middle">▶ Từ A · Bán hàng</text>
<text class="qt-ts" x="126" y="67.5" text-anchor="middle">Đơn cần người đến</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#den-tan-noi"><title>Mở phân khu E</title>
<rect class="qt-cong" x="218" y="20" width="152" height="71" rx="10" ry="10"/>
<text class="qt-tb2" x="294" y="43" text-anchor="middle">▶ Từ E</text>
<text class="qt-tb2" x="294" y="60" text-anchor="middle">Sau bán hàng</text>
<text class="qt-ts" x="294" y="76" text-anchor="middle">Sự cố cần đến tận nơi</text>
</a>
<line class="qt-mui" x1="126" y1="91" x2="126" y2="117" marker-end="url(#qt-ah)"/>
<line class="qt-mui" x1="294" y1="91" x2="294" y2="117" marker-end="url(#qt-ah)"/>
<a href="#lap-wo"><title>B·1 · Lập phiếu công việc</title>
<rect class="qt-b" x="50" y="121" width="320" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="145" r="12"/>
<text class="qt-so" x="74" y="149" text-anchor="middle">1</text>
<text class="qt-tb" x="96" y="149" text-anchor="start">Lập phiếu công việc</text>
<text class="qt-ts" x="96" y="165" text-anchor="start">Chọn đúng loại việc ngay từ đầu</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-01"><title>Mở thẻ HT-01</title>
<rect class="qt-pill" x="96" y="177" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="191" text-anchor="middle">⚠ HT-01</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-02"><title>Mở thẻ HT-02</title>
<rect class="qt-pill" x="166.7" y="177" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="198" y="191" text-anchor="middle">⚠ HT-02</text>
</a>
<line class="qt-mui" x1="210" y1="209" x2="210" y2="235" marker-end="url(#qt-ah)"/>
<a href="#lap-sa"><title>B·2 · Lập lịch hẹn, gán kỹ thuật viên</title>
<rect class="qt-b" x="50" y="239" width="320" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="263" r="12"/>
<text class="qt-so" x="74" y="267" text-anchor="middle">2</text>
<text class="qt-tb" x="96" y="267" text-anchor="start">Lập lịch hẹn, gán kỹ thuật viên</text>
<text class="qt-ts" x="96" y="283" text-anchor="start">Màn hình điều phối /smart-scheduler</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-03"><title>Mở thẻ HT-03</title>
<rect class="qt-pill" x="96" y="295" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="309" text-anchor="middle">⚠ HT-03</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-04"><title>Mở thẻ HT-04</title>
<rect class="qt-pill" x="166.7" y="295" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="198" y="309" text-anchor="middle">⚠ HT-04</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-05"><title>Mở thẻ HT-05</title>
<rect class="qt-pill" x="237.3" y="295" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="268.6" y="309" text-anchor="middle">⚠ HT-05</text>
</a>
<line class="qt-mui" x1="210" y1="327" x2="210" y2="353" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#yeu-cau"><title>Mở phân khu C</title>
<rect class="qt-cong" x="50" y="357" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="210" y="380" text-anchor="middle">▷ Nhận vật tư cho lịch hẹn</text>
<text class="qt-ts" x="210" y="396" text-anchor="middle">Phân khu C · Kho và giao nhận</text>
</a>
<line class="qt-mui" x1="210" y1="411" x2="210" y2="437" marker-end="url(#qt-ah)"/>
<a href="#hien-truong"><title>B·3 · Làm việc tại nhà khách hàng</title>
<rect class="qt-b" x="50" y="441" width="320" height="104" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="465" r="12"/>
<text class="qt-so" x="74" y="469" text-anchor="middle">3</text>
<text class="qt-tb" x="96" y="469" text-anchor="start">Làm việc tại nhà khách hàng</text>
<text class="qt-ts" x="96" y="485" text-anchor="start">Di chuyển · check-in · bước</text>
<text class="qt-ts" x="96" y="501" text-anchor="start">công việc · ảnh · check-out</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-06"><title>Mở thẻ HT-06</title>
<rect class="qt-pill" x="96" y="513" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="527" text-anchor="middle">⚠ HT-06</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-07"><title>Mở thẻ HT-07</title>
<rect class="qt-pill" x="166.7" y="513" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="198" y="527" text-anchor="middle">⚠ HT-07</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-08"><title>Mở thẻ HT-08</title>
<rect class="qt-pill" x="237.3" y="513" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="268.6" y="527" text-anchor="middle">⚠ HT-08</text>
</a>
<line class="qt-mui" x1="210" y1="545" x2="210" y2="571" marker-end="url(#qt-ah)"/>
<a href="#du-dk-sa"><title>Đủ điều kiện hoàn thành lịch hẹn?</title>
<polygon class="qt-re" points="50,602 77,575 343,575 370,602 343,629 77,629"/>
<text class="qt-tb" x="210" y="598" text-anchor="middle">Đủ điều kiện hoàn</text>
<text class="qt-tb" x="210" y="616" text-anchor="middle">thành lịch hẹn?</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-09"><title>Mở thẻ HT-09</title>
<rect class="qt-the" x="420" y="575" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tt" x="434" y="594" text-anchor="start">⚠ HT-09</text>
<text class="qt-ts" x="434" y="611" text-anchor="start">Báo còn người chưa check-out</text>
</a>
<line class="qt-mui" x1="370" y1="602" x2="416" y2="602" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="395" y="595" text-anchor="middle">chưa</text>
<text class="qt-nhan" x="220" y="647" text-anchor="start">đủ</text>
<line class="qt-mui" x1="210" y1="629" x2="210" y2="655" marker-end="url(#qt-ah)"/>
<a href="#hoan-thanh-sa"><title>B·4 · Hoàn thành lịch hẹn</title>
<rect class="qt-b" x="50" y="659" width="320" height="104" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="683" r="12"/>
<text class="qt-so" x="74" y="687" text-anchor="middle">4</text>
<text class="qt-tb" x="96" y="687" text-anchor="start">Hoàn thành lịch hẹn</text>
<text class="qt-ts" x="96" y="703" text-anchor="start">Lịch hẹn xong chưa có nghĩa</text>
<text class="qt-ts" x="96" y="719" text-anchor="start">là phiếu công việc xong</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-10"><title>Mở thẻ HT-10</title>
<rect class="qt-pill" x="96" y="731" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="745" text-anchor="middle">⚠ HT-10</text>
</a>
<line class="qt-mui" x1="210" y1="763" x2="210" y2="789" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#giao-hang"><title>Mở phân khu C</title>
<rect class="qt-cong" x="50" y="793" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="210" y="816" text-anchor="middle">▷ Giao hàng và thu tiền</text>
<text class="qt-ts" x="210" y="832" text-anchor="middle">Phân khu C · Kho và giao nhận</text>
</a>
<line class="qt-mui" x1="210" y1="847" x2="210" y2="873" marker-end="url(#qt-ah)"/>
<a href="#du-dk-wo"><title>Phiếu công việc đủ sáu điều kiện?</title>
<polygon class="qt-re" points="50,904 77,877 343,877 370,904 343,931 77,931"/>
<text class="qt-tb" x="210" y="900" text-anchor="middle">Phiếu công việc</text>
<text class="qt-tb" x="210" y="918" text-anchor="middle">đủ sáu điều kiện?</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-11"><title>Mở thẻ HT-11</title>
<rect class="qt-the" x="420" y="877" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tt" x="434" y="896" text-anchor="start">⚠ HT-11</text>
<text class="qt-ts" x="434" y="913" text-anchor="start">Phiếu công việc không hoàn thành được</text>
</a>
<line class="qt-mui" x1="370" y1="904" x2="416" y2="904" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="395" y="897" text-anchor="middle">chưa</text>
<text class="qt-nhan" x="220" y="949" text-anchor="start">đủ</text>
<line class="qt-mui" x1="210" y1="931" x2="210" y2="957" marker-end="url(#qt-ah)"/>
<a href="#hoan-thanh-wo"><title>B·5 · Hoàn thành phiếu công việc</title>
<rect class="qt-b" x="50" y="961" width="320" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="985" r="12"/>
<text class="qt-so" x="74" y="989" text-anchor="middle">5</text>
<text class="qt-tb" x="96" y="989" text-anchor="start">Hoàn thành phiếu công việc</text>
<text class="qt-ts" x="96" y="1005" text-anchor="start">Thủ công, hoặc tự động sau ân hạn</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-12"><title>Mở thẻ HT-12</title>
<rect class="qt-pill" x="96" y="1017" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="1031" text-anchor="middle">⚠ HT-12</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-13"><title>Mở thẻ HT-13</title>
<rect class="qt-pill" x="166.7" y="1017" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="198" y="1031" text-anchor="middle">⚠ HT-13</text>
</a>
<line class="qt-mui" x1="210" y1="1049" x2="210" y2="1075" marker-end="url(#qt-ah)"/>
<a href="#dong-wo"><title>B·6 · Đóng phiếu công việc</title>
<rect class="qt-b" x="50" y="1079" width="320" height="58" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="1103" r="12"/>
<text class="qt-so" x="74" y="1107" text-anchor="middle">6</text>
<text class="qt-tb" x="96" y="1107" text-anchor="start">Đóng phiếu công việc</text>
<text class="qt-ts" x="96" y="1123" text-anchor="start">Trạng thái cuối; mở lại được bằng Re-open</text>
</a>
<a href="#dong-mo"><title>Mở lại, đổi lịch và huỷ</title>
<rect class="qt-ngoai" x="20" y="1173" width="720" height="126" rx="12" ry="12"/>
<text class="qt-lan" x="36" y="1199" text-anchor="start">Mở lại, đổi lịch và huỷ</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-14"><title>Mở thẻ HT-14</title>
<rect class="qt-the" x="36" y="1213" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="48" y="1232" text-anchor="start">⚠ HT-14</text>
<text class="qt-ts" x="48" y="1249" text-anchor="start">Mở lại lịch hẹn làm</text>
<text class="qt-ts" x="48" y="1265" text-anchor="start">mất dữ liệu check-in</text>
</a>
<a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-15"><title>Mở thẻ HT-15</title>
<rect class="qt-the" x="270.7" y="1213" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="282.7" y="1232" text-anchor="start">⚠ HT-15</text>
<text class="qt-ts" x="282.7" y="1249" text-anchor="start">Không huỷ được lịch hẹn, phiếu</text>
<text class="qt-ts" x="282.7" y="1265" text-anchor="start">công việc hoặc đơn</text>
</a>
</svg>
</div>

<p class="qt-chu-giai"><span class="qt-k qt-k-buoc"></span> bước <span class="qt-k qt-k-re"></span> điểm rẽ <span class="qt-k qt-k-the"></span> thẻ tình huống <span class="qt-k qt-k-cong"></span> sang phân khu khác<br>👆 Bấm vào bất kỳ ô nào để mở phần giải thích.</p>

---

## B·1 — Lập phiếu công việc
{: #lap-wo }

**Ai làm:** Điều phối

Phiếu công việc (`FS Work Order`) **không tự sinh**, luôn phải có người lập:

| Từ đâu | Thao tác |
|---|---|
| **Đơn bán hàng** | Mở đơn đã xác nhận → **Create → FS Work Order** |
| **Phiếu sự cố** | Mở phiếu sự cố → **Create → FS Work Order** |

Hệ thống tự điền công ty, khách hàng, địa chỉ, liên hệ và khoảng thời gian dự kiến. Phiếu mới
luôn ở trạng thái **New**.

**Loại việc** (`Work Type`) quyết định hệ thống đòi gì lúc hoàn thành phiếu:

| Loại việc | Thường đòi thêm |
|---|---|
| **Bảo dưỡng** | Giao vật tư và thu tiền |
| **Sự cố** | Đính kèm ảnh hiện trường |
| **Lắp đặt** | Giao hàng, nghiệm thu, thu tiền |
| **Khảo sát** | Không giao hàng, không thu tiền |

**Tình huống ở bước này:**

- ⚠ [HT-01 · Chọn sai loại việc trên phiếu công việc](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-01)
- ⚠ [HT-02 · Đơn không hiện trên màn hình điều phối](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-02)

---

## B·2 — Lập lịch hẹn, gán kỹ thuật viên
{: #lap-sa }

**Ai làm:** Điều phối

Từ phiếu công việc chưa đóng → **Create → Service Appointment**. Lịch hẹn
(`FS Service Appointment`) **tự đổi trạng thái** theo dữ liệu được khai:

| Trạng thái | Khi nào chuyển sang |
|---|---|
| **None** | Chưa có lịch, chưa có người |
| **Scheduled** | Đã có khung giờ hẹn |
| **Dispatched** | Đã có khung giờ **và** đã gán kỹ thuật viên |
| **In Progress** | Kỹ thuật viên bắt đầu di chuyển hoặc đã check-in |
| **Completed** | Kết thúc buổi làm việc và đủ điều kiện |
| **Cannot Complete** | Không làm được, có ghi lý do |
| **Canceled** | Huỷ, **bắt buộc nhập lý do** |

Một phiếu công việc có thể có nhiều lịch hẹn, ví dụ lần một khảo sát, lần hai lắp đặt.

**Tình huống ở bước này:**

- ⚠ [HT-03 · Không đổi được kỹ thuật viên hoặc khung giờ](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-03)
- ⚠ [HT-04 · Không thấy chức năng tạo lịch hẹn](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-04)
- ⚠ [HT-05 · Nhiều kỹ thuật viên cùng một buổi](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-05)

---

<div class="qt-chuyen-khoi" id="nhan-vat-tu">▷ <strong>Nhận vật tư cho lịch hẹn</strong><br>Phần việc này thuộc <a href="Quy-Trinh-C-Kho-Giao-Nhan.html#yeu-cau">phân khu C · Kho và giao nhận</a>.</div>

## B·3 — Làm việc tại nhà khách hàng
{: #hien-truong }

**Ai làm:** Kỹ thuật viên

Làm trên ứng dụng kỹ thuật viên `/technician`, **theo đúng thứ tự**:

| Bước | Thao tác | Hệ thống ghi nhận |
|---|---|---|
| 1 | Nhận thông báo công việc | Thông báo đẩy về điện thoại |
| 2 | **Bắt đầu di chuyển** | Lịch hẹn sang *In Progress*, ghi giờ bắt đầu |
| 3 | **Check-in** tại nhà khách hàng | Ghi vị trí và giờ có mặt |
| 4 | Làm các **bước công việc** | Đánh dấu từng đầu việc: xong, không xong, không áp dụng |
| 5 | **Đính kèm ảnh** nếu loại việc yêu cầu | Ảnh lưu vào lịch hẹn |
| 6 | Giao hàng và thu tiền nếu có | Phân khu C và D |
| 7 | **Check-out** | Ghi giờ kết thúc |

**Tình huống ở bước này:**

- ⚠ [HT-06 · Tới nơi nhưng không làm được](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-06)
- ⚠ [HT-07 · Báo thiếu ảnh khi hoàn thành lịch hẹn](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-07)
- ⚠ [HT-08 · Báo chưa có giờ bắt đầu thực tế](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-08)

---

<div class="qt-re-khoi" id="du-dk-sa"><strong>⬡ Đủ điều kiện hoàn thành lịch hẹn?</strong><br><em>đủ</em> → đi tiếp xuống bước sau · <em>chưa</em> → <a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-09">⚠ HT-09 · Báo còn người chưa check-out</a></div>

| Điều kiện | Báo lỗi khi thiếu |
|---|---|
| Lịch đang ở *In Progress* | *“must transition to In Progress before completing”* |
| Đã có giờ bắt đầu thực tế | *“Cannot complete: no Actual Start”* — xem [HT-08](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-08) |
| **Mọi** kỹ thuật viên đã check-out hoặc đã bị loại khỏi lịch | *“all resources must be Checked-out or Canceled”* — xem [HT-09](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-09) |
| Đủ yêu cầu của loại việc, ví dụ đã đính ảnh | *“no photo attached”* — xem [HT-07](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-07) |

## B·4 — Hoàn thành lịch hẹn
{: #hoan-thanh-sa }

**Ai làm:** Kỹ thuật viên

Lịch hẹn hoàn tất **không** tự chuyển phiếu công việc sang hoàn tất. Phiếu công việc còn
phải qua sáu điều kiện ở bước sau.

**Tình huống ở bước này:**

- ⚠ [HT-10 · Cần sửa lịch hẹn đã hoàn tất](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-10)

---

<div class="qt-chuyen-khoi" id="giao-thu">▷ <strong>Giao hàng và thu tiền</strong><br>Phần việc này thuộc <a href="Quy-Trinh-C-Kho-Giao-Nhan.html#giao-hang">phân khu C · Kho và giao nhận</a>.</div>

<div class="qt-re-khoi" id="du-dk-wo"><strong>⬡ Phiếu công việc đủ sáu điều kiện?</strong><br><em>đủ</em> → đi tiếp xuống bước sau · <em>chưa</em> → <a href="Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-11">⚠ HT-11 · Phiếu công việc không hoàn thành được</a></div>

| # | Điều kiện | Đang áp dụng |
|---|---|---|
| 1 | Trạng thái hiện tại cho phép chuyển sang *Completed* | Luôn kiểm |
| 2 | Mọi **bước công việc bắt buộc** đã xong hoặc không áp dụng | Luôn kiểm, nếu phiếu có bước công việc |
| 3 | Mọi **lịch hẹn** đã kết thúc, và có **ít nhất một** lịch hẹn | **Bật** |
| 4 | **Tiền mặt đã nộp** và **đơn hàng đã thu đủ** | **Bật** (kiểm *vật tư đã trả* đang tắt) |
| 5 | **Đơn bán hàng** liên kết đã *Hoàn tất* hoặc *Đóng đơn* | **Bật** |
| 6 | Yêu cầu riêng theo **loại việc** | Theo cấu hình từng loại việc |

> ⛔ **Điều kiện 4 và 5 tạo ra một trình tự bắt buộc:** phiếu công việc chỉ xong được **sau
> khi** đơn đã *Hoàn tất*, mà đơn chỉ hoàn tất khi đã giao đủ, thu đủ và có hoá đơn. Phần lớn
> phiếu không hoàn thành được là do chứng từ tiền, không phải do việc hiện trường.

## B·5 — Hoàn thành phiếu công việc
{: #hoan-thanh-wo }

**Ai làm:** Kỹ thuật viên · Điều phối

| Đường | Cách làm |
|---|---|
| **Thủ công** | Chuyển trạng thái trên Desk, hoặc kỹ thuật viên chọn *Hoàn thành* trên ứng dụng |
| **Tự động** | Tác vụ chạy ban đêm rà các phiếu *New* và *In Progress*, đủ điều kiện thì hoàn thành giúp |

Tác vụ tự động còn chờ **thời gian ân hạn** tính từ lịch hẹn cuối cùng, và **bỏ qua hoàn
toàn** phiếu đang *On Hold*.

**Tình huống ở bước này:**

- ⚠ [HT-12 · Đủ điều kiện nhưng tác vụ tự động vẫn bỏ qua](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-12)
- ⚠ [HT-13 · Báo phiếu công việc không có lịch hẹn nào](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-13)

---

## B·6 — Đóng phiếu công việc
{: #dong-wo }

**Ai làm:** Điều phối

**Close** là trạng thái cuối: chức năng tạo lịch hẹn bị ẩn. Cần làm tiếp thì dùng
**Re-open** — phiếu về đúng trạng thái trước khi đóng.

---

## Mở lại, đổi lịch và huỷ
{: #dong-mo }

| Việc cần làm | Thao tác | Lưu ý |
|---|---|---|
| Sửa lịch hẹn đã hoàn tất | Chuyển *Completed → In Progress* | Dữ liệu thực tế **giữ nguyên** |
| Làm lại lịch hẹn đã huỷ | Chuyển về *Scheduled* | ⚠️ **Xoá sạch** dữ liệu check-in, check-out, thời gian |
| Cần thêm một buổi cho cùng vụ việc | Lập **lịch hẹn mới** | An toàn hơn mở lại lịch cũ |

**Trình tự huỷ:** lịch hẹn (bắt buộc nhập lý do) → phiếu công việc → đơn bán hàng.

> ⚠️ **Huỷ phiếu công việc không tự trả hàng về kho** — vật tư đã nhận vẫn phải hoàn trả, xem [KG-18](Quy-Trinh-C-Kho-Giao-Nhan-Tinh-Huong.html#kg-18).

**Tình huống ở bước này:**

- ⚠ [HT-14 · Mở lại lịch hẹn làm mất dữ liệu check-in](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-14)
- ⚠ [HT-15 · Không huỷ được lịch hẹn, phiếu công việc hoặc đơn](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-15)

---

## Ba chứng từ, ba việc khác nhau
{: #ba-chung-tu }

| Chứng từ | Gõ tìm bằng | Nói về |
|---|---|---|
| **Đơn bán hàng** | `Sales Order` | Bán cái gì, bao nhiêu tiền, ai chịu trách nhiệm doanh thu |
| **Phiếu công việc** | `FS Work Order` | Vụ việc kỹ thuật: làm gì, ở đâu, gồm những đầu việc nào |
| **Lịch hẹn dịch vụ** | `FS Service Appointment` | Một buổi có mặt tại hiện trường: ai đi, lúc nào, kết quả ra sao |

Quan hệ là **một–nhiều ở cả hai tầng**: một đơn có thể nhiều phiếu công việc, một phiếu công
việc có thể nhiều lịch hẹn. Trạng thái ba chứng từ **độc lập** với nhau.

---

## Câu hỏi thường gặp
{: #hoi-dap }

**Một lần đi không xong việc, phải làm gì?**

Lập **lịch hẹn mới** trên cùng phiếu công việc — xem [HT-06](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-06).

**Khách hẹn lại ngày khác thì sửa lịch hay huỷ lịch?**

Lịch chưa *In Progress* thì sửa khung giờ. Đã *In Progress* rồi thì huỷ kèm lý do và lập lịch mới — xem [HT-03](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-03).

**Đi hai người thì ghi công thế nào?**

Gán cả hai vào lịch hẹn, chia **tỉ lệ đóng góp** cộng lại bằng 100% — xem [HT-05](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-05).

**Lịch hẹn và đơn đã xong, sao phiếu công việc vẫn New?**

Còn thiếu một trong sáu điều kiện, hoặc tác vụ tự động chưa tới lượt — xem [HT-11](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-11) và [HT-12](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html#ht-12).

**Đóng phiếu công việc có đóng luôn đơn hàng không?**

Không. Ba chứng từ độc lập, xem [phụ lục](#ba-chung-tu).

**Khảo sát xong khách không mua, xử lý thế nào?**

Hoàn thành lịch hẹn, rồi **Close** phiếu công việc. Đơn hàng nếu đã lập thì đóng hoặc huỷ theo [BH-17](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-17).

---

## Đọc tiếp
{: #doc-tiep }

| Bạn cần | Mở trang |
|---|---|
| Xem cách gỡ từng tình huống | [Thẻ tình huống của phân khu B](Quy-Trinh-B-Hien-Truong-Tinh-Huong.html) |
| Tra theo thông báo lỗi | [Khi gặp trục trặc](Quy-Trinh-Tra-Cuu.html) |
| Xem toàn bộ dây chuyền | [Bản đồ tổng](00-quy-trinh.html) |
| Đi theo một đơn hàng cụ thể | [Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html) |
