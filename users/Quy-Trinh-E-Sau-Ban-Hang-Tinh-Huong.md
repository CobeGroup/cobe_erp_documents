---
title: E · Tình huống
layout: default
parent: E · Sau bán hàng
grand_parent: Quy trình hợp nhất
nav_order: 1
---

<!-- Trang sinh tự động bởi _tools/quy_trinh/build.py từ _quy_trinh/. Sửa tệp dữ liệu rồi chạy lại bộ sinh; sửa thẳng trang này sẽ bị ghi đè. -->

# Phân khu E — Tình huống cần xử lý
{: .no_toc }

Mỗi thẻ gồm: gặp ở đâu, dấu hiệu, nguyên nhân, các bước gỡ, và gỡ xong thì quay về bước nào.
{: .fs-3 .text-grey-dk-000 }

👉 [Sơ đồ phân khu E](Quy-Trinh-E-Sau-Ban-Hang.html) · [Bản đồ tổng](00-quy-trinh.html) · [Tra theo thông báo lỗi](Quy-Trinh-Tra-Cuu.html)

---

## Danh mục thẻ
{: #danh-muc }

| Mã | Tình huống | Xử lý ở bước |
|---|---|---|
| [SB-01](#sb-01) | Khách đã mua nhưng không có phiếu nhắc | [E·1 · Sinh lịch nhắc theo từng vật tư](Quy-Trinh-E-Sau-Ban-Hang.html#sinh-lich) |
| [SB-02](#sb-02) | Đơn hoàn tất mà vẫn không sinh nhắc | [E·1 · Sinh lịch nhắc theo từng vật tư](Quy-Trinh-E-Sau-Ban-Hang.html#sinh-lich) |
| [SB-03](#sb-03) | Một khách hàng có nhiều phiếu nhắc trùng | [E·2 · Gom lịch nhắc theo khách hàng](Quy-Trinh-E-Sau-Ban-Hang.html#phieu-nhac) |
| [SB-04](#sb-04) | Phiếu nhắc quá hạn rất lâu vẫn còn | [E·2 · Gom lịch nhắc theo khách hàng](Quy-Trinh-E-Sau-Ban-Hang.html#phieu-nhac) |
| [SB-05](#sb-05) | Phiếu được phân cho người không phù hợp | [E·3 · Phân người phụ trách](Quy-Trinh-E-Sau-Ban-Hang.html#phan-cong) |
| [SB-06](#sb-06) | Nhân sự nghỉ việc, khách quen không được chuyển giao | [E·3 · Phân người phụ trách](Quy-Trinh-E-Sau-Ban-Hang.html#phan-cong) |
| [SB-07](#sb-07) | Đã lập đơn mà phiếu nhắc vẫn Open | [E·5a · Đồng ý](Quy-Trinh-E-Sau-Ban-Hang.html#dong-y) |
| [SB-08](#sb-08) | Khách chỉ đồng ý một phần hạng mục | [E·5a · Đồng ý](Quy-Trinh-E-Sau-Ban-Hang.html#dong-y) |
| [SB-09](#sb-09) | Cần ngừng nhắc hẳn | [E·5c · Không có nhu cầu](Quy-Trinh-E-Sau-Ban-Hang.html#khong-nhu-cau) |
| [SB-10](#sb-10) | Không biết khách đã mua thiết bị nào | [E·6 · Tiếp nhận, lập phiếu sự cố](Quy-Trinh-E-Sau-Ban-Hang.html#tiep-nhan) |
| [SB-11](#sb-11) | Ô Loại sự cố trống sau khi chọn nhóm | [E·7 · Phân loại, gán người xử lý](Quy-Trinh-E-Sau-Ban-Hang.html#phan-loai) |
| [SB-12](#sb-12) | Đổi nhóm làm mất loại đang chọn | [E·7 · Phân loại, gán người xử lý](Quy-Trinh-E-Sau-Ban-Hang.html#phan-loai) |
| [SB-13](#sb-13) | Phiếu công việc xong mà phiếu sự cố vẫn mở | [E·9 · Đóng phiếu sự cố](Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co) |
| [SB-14](#sb-14) | Phiếu sự cố nằm On Hold rất lâu | [E·9 · Đóng phiếu sự cố](Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co) |
| [SB-15](#sb-15) | Đơn sửa chữa không truy được về sự cố | [E·9 · Đóng phiếu sự cố](Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co) |
| [SB-16](#sb-16) | Tỉ lệ đạt của một người giảm bất thường | [E·9 · Đóng phiếu sự cố](Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co) |

---

## SB-01 · Khách đã mua nhưng không có phiếu nhắc
{: #sb-01 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#sinh-lich">E·1 · Sinh lịch nhắc theo từng vật tư</a></td></tr>
<tr><th>Nguyên nhân</th><td>Đơn chưa ở trạng thái Completed — thường vì chưa xuất đủ hoá đơn.</td></tr>
<tr><th>Ai xử lý</th><td>Nhân viên dịch vụ · Kế toán</td></tr>
</table>
<p class="qt-lien-quan">Liên quan: <a href="#sb-02">SB-02</a> · <a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-14">TT-14</a> · <a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-15">TT-15</a></p>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 285" width="470" height="285" role="img" aria-labelledby="qt-t-the-sb-01 qt-d-the-sb-01">
<title id="qt-t-the-sb-01">Các bước gỡ tình huống SB-01</title>
<desc id="qt-d-the-sb-01">Các bước xử lý tình huống SB-01: Khách đã mua nhưng không có phiếu nhắc</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="285"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Mở đơn, xem ba ô trạng thái</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<polygon class="qt-re" points="12,94 35,71 215,71 238,94 215,117 35,117"/>
<text class="qt-tb2" x="125" y="98.5" text-anchor="middle">Đơn đã Completed?</text>
<rect class="qt-trang" x="292" y="69" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="91" text-anchor="start">Xử lý phần hoá đơn —</text>
<text class="qt-tn" x="303" y="108" text-anchor="start">TT-14, TT-15</text>
<line class="qt-mui" x1="238" y1="94" x2="288" y2="94" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="88" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="134" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="117" x2="125" y2="143" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="147" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="169" text-anchor="start">Kiểm chu kỳ nhắc</text>
<text class="qt-tn" x="24" y="186" text-anchor="start">của mã hàng — SB-02</text>
<line class="qt-mui" x1="125" y1="197" x2="125" y2="221" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,119 375,250 242,250" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#sinh-lich"><title>Quay về E·1 · Sinh lịch nhắc theo từng vật tư</title>
<rect class="qt-cong" x="12" y="225" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="247" text-anchor="start">↩ Quay về E·1</text>
<text class="qt-tn" x="24" y="264" text-anchor="start">Sinh lịch nhắc theo từng vật tư</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-02 · Đơn hoàn tất mà vẫn không sinh nhắc
{: #sb-02 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#sinh-lich">E·1 · Sinh lịch nhắc theo từng vật tư</a></td></tr>
<tr><th>Nguyên nhân</th><td>Mặt hàng chưa được khai chu kỳ nhắc.</td></tr>
<tr><th>Ai xử lý</th><td>Quản trị viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-sb-02 qt-d-the-sb-02">
<title id="qt-t-the-sb-02">Các bước gỡ tình huống SB-02</title>
<desc id="qt-d-the-sb-02">Các bước xử lý tình huống SB-02: Đơn hoàn tất mà vẫn không sinh nhắc</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Gửi quản trị viên mã hàng</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Quản trị viên khai</text>
<text class="qt-tn" x="24" y="110" text-anchor="start">chu kỳ cho mã hàng</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#sinh-lich"><title>Quay về E·1 · Sinh lịch nhắc theo từng vật tư</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về E·1</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Sinh lịch nhắc theo từng vật tư</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-03 · Một khách hàng có nhiều phiếu nhắc trùng
{: #sb-03 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#phieu-nhac">E·2 · Gom lịch nhắc theo khách hàng</a></td></tr>
<tr><th>Nguyên nhân</th><td>Khác địa chỉ, hoặc ngày đến hạn cách xa nên hệ thống không gom được.</td></tr>
<tr><th>Ai xử lý</th><td>Nhân viên dịch vụ</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-sb-03 qt-d-the-sb-03">
<title id="qt-t-the-sb-03">Các bước gỡ tình huống SB-03</title>
<desc id="qt-d-the-sb-03">Các bước xử lý tình huống SB-03: Một khách hàng có nhiều phiếu nhắc trùng</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Chọn phiếu giữ lại</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Đóng các phiếu</text>
<text class="qt-tn" x="24" y="110" text-anchor="start">thừa kèm ghi chú</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#lien-he"><title>Quay về E·4 · Liên hệ khách hàng</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về E·4</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Liên hệ khách hàng</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-04 · Phiếu nhắc quá hạn rất lâu vẫn còn
{: #sb-04 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#phieu-nhac">E·2 · Gom lịch nhắc theo khách hàng</a></td></tr>
<tr><th>Nguyên nhân</th><td>Tồn từ đợt rà soát dữ liệu cũ; tác vụ tự động không xử lý phần quá hạn quá lâu.</td></tr>
<tr><th>Ai xử lý</th><td>Quản lý dịch vụ</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 192" width="470" height="192" role="img" aria-labelledby="qt-t-the-sb-04 qt-d-the-sb-04">
<title id="qt-t-the-sb-04">Các bước gỡ tình huống SB-04</title>
<desc id="qt-d-the-sb-04">Các bước xử lý tình huống SB-04: Phiếu nhắc quá hạn rất lâu vẫn còn</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="192"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Lọc danh sách phiếu quá hạn</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Xử lý theo đợt có kiểm soát</text>
<line class="qt-mui" x1="125" y1="104" x2="125" y2="128" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#lien-he"><title>Quay về E·4 · Liên hệ khách hàng</title>
<rect class="qt-cong" x="12" y="132" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="154" text-anchor="start">↩ Quay về E·4</text>
<text class="qt-tn" x="24" y="171" text-anchor="start">Liên hệ khách hàng</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-05 · Phiếu được phân cho người không phù hợp
{: #sb-05 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#phan-cong">E·3 · Phân người phụ trách</a></td></tr>
<tr><th>Nguyên nhân</th><td>Chưa khai chuyên môn hoặc địa bàn phụ trách.</td></tr>
<tr><th>Ai xử lý</th><td>Quản lý dịch vụ</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-sb-05 qt-d-the-sb-05">
<title id="qt-t-the-sb-05">Các bước gỡ tình huống SB-05</title>
<desc id="qt-d-the-sb-05">Các bước xử lý tình huống SB-05: Phiếu được phân cho người không phù hợp</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Khai bổ sung chuyên</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">môn, địa bàn</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Phân lại thủ công</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">các phiếu đã phân</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#phan-cong"><title>Quay về E·3 · Phân người phụ trách</title>
<rect class="qt-cong" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="188" text-anchor="start">↩ Quay về E·3</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">Phân người phụ trách</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-06 · Nhân sự nghỉ việc, khách quen không được chuyển giao
{: #sb-06 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#phan-cong">E·3 · Phân người phụ trách</a></td></tr>
<tr><th>Nguyên nhân</th><td>Số điện thoại công ty của người đó chưa được bàn giao cho người tiếp quản.</td></tr>
<tr><th>Ai xử lý</th><td>Quản lý dịch vụ</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-sb-06 qt-d-the-sb-06">
<title id="qt-t-the-sb-06">Các bước gỡ tình huống SB-06</title>
<desc id="qt-d-the-sb-06">Các bước xử lý tình huống SB-06: Nhân sự nghỉ việc, khách quen không được chuyển giao</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Bàn giao số điện</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">thoại theo quy trình</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Hệ thống chuyển phiếu</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">ở lần phân kế tiếp</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#phan-cong"><title>Quay về E·3 · Phân người phụ trách</title>
<rect class="qt-cong" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="188" text-anchor="start">↩ Quay về E·3</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">Phân người phụ trách</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-07 · Đã lập đơn mà phiếu nhắc vẫn Open
{: #sb-07 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#dong-y">E·5a · Đồng ý</a></td></tr>
<tr><th>Nguyên nhân</th><td>Đơn được lập ngoài phiếu nhắc nên mất liên kết ngược.</td></tr>
<tr><th>Ai xử lý</th><td>Nhân viên dịch vụ · Quản trị viên</td></tr>
</table>
<p class="qt-lien-quan">Liên quan: <a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-12">BH-12</a></p>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 217" width="470" height="217" role="img" aria-labelledby="qt-t-the-sb-07 qt-d-the-sb-07">
<title id="qt-t-the-sb-07">Các bước gỡ tình huống SB-07</title>
<desc id="qt-d-the-sb-07">Các bước xử lý tình huống SB-07: Đã lập đơn mà phiếu nhắc vẫn Open</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="217"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Đơn chưa có chứng từ</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">nào phía sau?</text>
<rect class="qt-trang" x="292" y="1.5" width="166" height="67" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="23.5" text-anchor="start">Nhờ quản trị viên gắn</text>
<text class="qt-tn" x="303" y="40.5" text-anchor="start">lại, hoặc đóng phiếu</text>
<text class="qt-tn" x="303" y="57.5" text-anchor="start">kèm ghi chú</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="92.5" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="96.5" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="118.5" text-anchor="start">Huỷ đơn, lập lại từ phiếu nhắc</text>
<line class="qt-mui" x1="125" y1="129.5" x2="125" y2="153.5" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,68.5 375,182.5 242,182.5" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#dong-y"><title>Quay về E·5a · Đồng ý</title>
<rect class="qt-cong" x="12" y="157.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="179.5" text-anchor="start">↩ Quay về E·5a</text>
<text class="qt-tn" x="24" y="196.5" text-anchor="start">Đồng ý</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-08 · Khách chỉ đồng ý một phần hạng mục
{: #sb-08 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#dong-y">E·5a · Đồng ý</a></td></tr>
<tr><th>Nguyên nhân</th><td>Phiếu nhắc gom nhiều hạng mục; chốt cả phiếu sẽ đóng luôn phần khách chưa đồng ý.</td></tr>
<tr><th>Ai xử lý</th><td>Nhân viên dịch vụ</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 253" width="470" height="253" role="img" aria-labelledby="qt-t-the-sb-08 qt-d-the-sb-08">
<title id="qt-t-the-sb-08">Các bước gỡ tình huống SB-08</title>
<desc id="qt-d-the-sb-08">Các bước xử lý tình huống SB-08: Khách chỉ đồng ý một phần hạng mục</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="253"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Dùng chức năng Tách phiếu</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Lập đơn cho phần đã đồng ý</text>
<line class="qt-mui" x1="125" y1="104" x2="125" y2="128" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="132" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="154" text-anchor="start">Giữ phần còn lại để nhắc tiếp</text>
<line class="qt-mui" x1="125" y1="165" x2="125" y2="189" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#lien-he"><title>Quay về E·4 · Liên hệ khách hàng</title>
<rect class="qt-cong" x="12" y="193" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="215" text-anchor="start">↩ Quay về E·4</text>
<text class="qt-tn" x="24" y="232" text-anchor="start">Liên hệ khách hàng</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-09 · Cần ngừng nhắc hẳn
{: #sb-09 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#khong-nhu-cau">E·5c · Không có nhu cầu</a></td></tr>
<tr><th>Dấu hiệu</th><td>Khách chuyển nhà, bỏ dùng thiết bị, hoặc mua nơi khác.</td></tr>
<tr><th>Nguyên nhân</th><td>Cần chặn cả các vòng nhắc sau, không chỉ phiếu hiện tại.</td></tr>
<tr><th>Ai xử lý</th><td>Nhân viên dịch vụ</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 192" width="470" height="192" role="img" aria-labelledby="qt-t-the-sb-09 qt-d-the-sb-09">
<title id="qt-t-the-sb-09">Các bước gỡ tình huống SB-09</title>
<desc id="qt-d-the-sb-09">Các bước xử lý tình huống SB-09: Cần ngừng nhắc hẳn</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="192"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Chọn trạng thái Disable</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Ghi lý do ngừng nhắc</text>
<line class="qt-mui" x1="125" y1="104" x2="125" y2="128" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#lien-he"><title>Quay về E·4 · Liên hệ khách hàng</title>
<rect class="qt-cong" x="12" y="132" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="154" text-anchor="start">↩ Quay về E·4</text>
<text class="qt-tn" x="24" y="171" text-anchor="start">Liên hệ khách hàng</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-10 · Không biết khách đã mua thiết bị nào
{: #sb-10 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#tiep-nhan">E·6 · Tiếp nhận, lập phiếu sự cố</a></td></tr>
<tr><th>Nguyên nhân</th><td>Phiếu sự cố chưa gắn về đơn hàng gốc.</td></tr>
<tr><th>Ai xử lý</th><td>Chăm sóc khách hàng</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-sb-10 qt-d-the-sb-10">
<title id="qt-t-the-sb-10">Các bước gỡ tình huống SB-10</title>
<desc id="qt-d-the-sb-10">Các bước xử lý tình huống SB-10: Không biết khách đã mua thiết bị nào</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Tra đơn của khách</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">theo số điện thoại</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Gắn đơn vào ô chứng</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">từ tham chiếu</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#tiep-nhan"><title>Quay về E·6 · Tiếp nhận, lập phiếu sự cố</title>
<rect class="qt-cong" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="188" text-anchor="start">↩ Quay về E·6</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">Tiếp nhận, lập phiếu sự cố</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-11 · Ô Loại sự cố trống sau khi chọn nhóm
{: #sb-11 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#phan-loai">E·7 · Phân loại, gán người xử lý</a></td></tr>
<tr><th>Nguyên nhân</th><td>Nhóm đó chưa được khai loại nào.</td></tr>
<tr><th>Ai xử lý</th><td>Chăm sóc khách hàng · Quản trị viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 207" width="470" height="207" role="img" aria-labelledby="qt-t-the-sb-11 qt-d-the-sb-11">
<title id="qt-t-the-sb-11">Các bước gỡ tình huống SB-11</title>
<desc id="qt-d-the-sb-11">Các bước xử lý tình huống SB-11: Ô Loại sự cố trống sau khi chọn nhóm</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="207"/>
<polygon class="qt-re" points="12,33 35,10 215,10 238,33 215,56 35,56"/>
<text class="qt-tb2" x="125" y="37.5" text-anchor="middle">Có nhóm khác phù hợp?</text>
<rect class="qt-trang" x="292" y="8" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="30" text-anchor="start">Đề nghị quản trị viên</text>
<text class="qt-tn" x="303" y="47" text-anchor="start">khai loại cho nhóm</text>
<line class="qt-mui" x1="238" y1="33" x2="288" y2="33" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="27" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="73" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="56" x2="125" y2="82" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="86" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="108" text-anchor="start">Chọn nhóm khác</text>
<line class="qt-mui" x1="125" y1="119" x2="125" y2="143" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,58 375,172 242,172" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#phan-loai"><title>Quay về E·7 · Phân loại, gán người xử lý</title>
<rect class="qt-cong" x="12" y="147" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="169" text-anchor="start">↩ Quay về E·7</text>
<text class="qt-tn" x="24" y="186" text-anchor="start">Phân loại, gán người xử lý</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-12 · Đổi nhóm làm mất loại đang chọn
{: #sb-12 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#phan-loai">E·7 · Phân loại, gán người xử lý</a></td></tr>
<tr><th>Nguyên nhân</th><td>Loại cũ không thuộc nhóm mới. Trên phiếu đã lưu, hệ thống chỉ cảnh báo chứ không tự xoá.</td></tr>
<tr><th>Ai xử lý</th><td>Chăm sóc khách hàng</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-sb-12 qt-d-the-sb-12">
<title id="qt-t-the-sb-12">Các bước gỡ tình huống SB-12</title>
<desc id="qt-d-the-sb-12">Các bước xử lý tình huống SB-12: Đổi nhóm làm mất loại đang chọn</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Biết chắc bộ</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">phận hỏng?</text>
<rect class="qt-trang" x="292" y="10" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="32" text-anchor="start">Chọn lại loại</text>
<text class="qt-tn" x="303" y="49" text-anchor="start">thuộc nhóm mới</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Chọn loại trước, nhóm tự điền</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,60 375,174 242,174" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#phan-loai"><title>Quay về E·7 · Phân loại, gán người xử lý</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về E·7</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Phân loại, gán người xử lý</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-13 · Phiếu công việc xong mà phiếu sự cố vẫn mở
{: #sb-13 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co">E·9 · Đóng phiếu sự cố</a></td></tr>
<tr><th>Nguyên nhân</th><td>Hai chứng từ có trạng thái độc lập.</td></tr>
<tr><th>Ai xử lý</th><td>Nhân viên sự cố</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 192" width="470" height="192" role="img" aria-labelledby="qt-t-the-sb-13 qt-d-the-sb-13">
<title id="qt-t-the-sb-13">Các bước gỡ tình huống SB-13</title>
<desc id="qt-d-the-sb-13">Các bước xử lý tình huống SB-13: Phiếu công việc xong mà phiếu sự cố vẫn mở</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="192"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Ghi kết quả vào phiếu sự cố</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Đóng phiếu sự cố</text>
<line class="qt-mui" x1="125" y1="104" x2="125" y2="128" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co"><title>Quay về E·9 · Đóng phiếu sự cố</title>
<rect class="qt-cong" x="12" y="132" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="154" text-anchor="start">↩ Quay về E·9</text>
<text class="qt-tn" x="24" y="171" text-anchor="start">Đóng phiếu sự cố</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-14 · Phiếu sự cố nằm On Hold rất lâu
{: #sb-14 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co">E·9 · Đóng phiếu sự cố</a></td></tr>
<tr><th>Nguyên nhân</th><td>Chờ linh kiện, chờ khách sắp xếp, hoặc bị quên theo dõi.</td></tr>
<tr><th>Ai xử lý</th><td>Quản lý dịch vụ</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 270" width="470" height="270" role="img" aria-labelledby="qt-t-the-sb-14 qt-d-the-sb-14">
<title id="qt-t-the-sb-14">Các bước gỡ tình huống SB-14</title>
<desc id="qt-d-the-sb-14">Các bước xử lý tình huống SB-14: Phiếu sự cố nằm On Hold rất lâu</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="270"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Lọc danh sách On Hold định kỳ</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<polygon class="qt-re" points="12,96 37,71 213,71 238,96 213,121 37,121"/>
<text class="qt-tb2" x="125" y="92" text-anchor="middle">Đã xử lý xong</text>
<text class="qt-tb2" x="125" y="109" text-anchor="middle">trên thực tế?</text>
<rect class="qt-trang" x="292" y="71" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="93" text-anchor="start">Liên hệ lại khách hoặc</text>
<text class="qt-tn" x="303" y="110" text-anchor="start">bên cung ứng</text>
<line class="qt-mui" x1="238" y1="96" x2="288" y2="96" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="90" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="138" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="149" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="171" text-anchor="start">Đóng phiếu kèm kết quả</text>
<line class="qt-mui" x1="125" y1="182" x2="125" y2="206" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,121 375,235 242,235" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co"><title>Quay về E·9 · Đóng phiếu sự cố</title>
<rect class="qt-cong" x="12" y="210" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="232" text-anchor="start">↩ Quay về E·9</text>
<text class="qt-tn" x="24" y="249" text-anchor="start">Đóng phiếu sự cố</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-15 · Đơn sửa chữa không truy được về sự cố
{: #sb-15 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Gặp ở</th><td><a href="Quy-Trinh-A-Ban-Hang.html#khai-don">A·5 · Lập đơn bán hàng</a></td></tr>
<tr><th>Xử lý ở</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co">E·9 · Đóng phiếu sự cố</a></td></tr>
<tr><th>Nguyên nhân</th><td>Đơn được lập thủ công trên Desk thay vì từ chức năng trên phiếu sự cố.</td></tr>
<tr><th>Ai xử lý</th><td>Quản trị viên</td></tr>
</table>
<p class="qt-lien-quan">Liên quan: <a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-12">BH-12</a></p>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 148" width="470" height="148" role="img" aria-labelledby="qt-t-the-sb-15 qt-d-the-sb-15">
<title id="qt-t-the-sb-15">Các bước gỡ tình huống SB-15</title>
<desc id="qt-d-the-sb-15">Các bước xử lý tình huống SB-15: Đơn sửa chữa không truy được về sự cố</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="148"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Nhờ quản trị viên</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">gắn lại liên kết</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co"><title>Quay về E·9 · Đóng phiếu sự cố</title>
<rect class="qt-cong" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="110" text-anchor="start">↩ Quay về E·9</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">Đóng phiếu sự cố</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## SB-16 · Tỉ lệ đạt của một người giảm bất thường
{: #sb-16 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co">E·9 · Đóng phiếu sự cố</a></td></tr>
<tr><th>Nguyên nhân</th><td>Có trường hợp quá hạn chưa xong nằm trong mẫu số.</td></tr>
<tr><th>Ai xử lý</th><td>Quản lý dịch vụ</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-sb-16 qt-d-the-sb-16">
<title id="qt-t-the-sb-16">Các bước gỡ tình huống SB-16</title>
<desc id="qt-d-the-sb-16">Các bước xử lý tình huống SB-16: Tỉ lệ đạt của một người giảm bất thường</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Bấm vào con số trên</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">báo cáo hiệu suất</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Rà từng trường hợp quá hạn</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#dong-su-co"><title>Quay về E·9 · Đóng phiếu sự cố</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về E·9</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Đóng phiếu sự cố</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---
