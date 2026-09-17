---
title: D · Tình huống
layout: default
parent: D · Thu tiền và kế toán
grand_parent: Quy trình hợp nhất
nav_order: 1
---

<!-- Trang sinh tự động bởi _tools/quy_trinh/build.py từ _quy_trinh/. Sửa tệp dữ liệu rồi chạy lại bộ sinh; sửa thẳng trang này sẽ bị ghi đè. -->

# Phân khu D — Tình huống cần xử lý
{: .no_toc }

Mỗi thẻ gồm: gặp ở đâu, dấu hiệu, nguyên nhân, các bước gỡ, và gỡ xong thì quay về bước nào.
{: .fs-3 .text-grey-dk-000 }

👉 [Sơ đồ phân khu D](Quy-Trinh-D-Thu-Tien.html) · [Bản đồ tổng](00-quy-trinh.html)

---

## Danh mục thẻ
{: #danh-muc }

| Mã | Tình huống | Xử lý ở bước |
|---|---|---|
| [TT-01](#tt-01) | Báo “Chưa tạo phiếu giao hàng” khi thu tiền | [D · Đơn đã có phiếu giao hàng?](Quy-Trinh-D-Thu-Tien.html#co-phieu-giao) |
| [TT-02](#tt-02) | Màn hình thu tiền không cho thao tác | [D·1 · Mở màn hình thu tiền](Quy-Trinh-D-Thu-Tien.html#mo-thu-tien) |
| [TT-03](#tt-03) | Báo “đã có dòng Tiền mặt” khi thêm dòng thu | [D·2 · Nhập các dòng thu](Quy-Trinh-D-Thu-Tien.html#dong-thu) |
| [TT-04](#tt-04) | Thu nhiều đơn một lần, chia sai tiền giữa các dòng | [D·2 · Nhập các dòng thu](Quy-Trinh-D-Thu-Tien.html#dong-thu) |
| [TT-05](#tt-05) | Chọn nhầm tiền mặt cho khoản khách đã chuyển khoản | [D·3a · Tiền mặt](Quy-Trinh-D-Thu-Tien.html#tien-mat) |
| [TT-06](#tt-06) | Đã đưa tiền mặt cho kế toán nhưng vẫn còn công nợ cá nhân | [D·3a · Tiền mặt](Quy-Trinh-D-Thu-Tien.html#tien-mat) |
| [TT-07](#tt-07) | Báo “Công nợ … đã được trả qua …” khi lập phiếu nộp | [D·3a · Tiền mặt](Quy-Trinh-D-Thu-Tien.html#tien-mat) |
| [TT-08](#tt-08) | Đã nộp tiền nhưng hệ thống vẫn báo chưa nộp | [D·3a · Tiền mặt](Quy-Trinh-D-Thu-Tien.html#tien-mat) |
| [TT-09](#tt-09) | Báo “đã trả về … nhưng thu … (thiếu …)” | [D·3a · Tiền mặt](Quy-Trinh-D-Thu-Tien.html#tien-mat) |
| [TT-10](#tt-10) | Báo “Số dư tài khoản … không đủ” khi xác nhận phiếu nộp | [D·3a · Tiền mặt](Quy-Trinh-D-Thu-Tien.html#tien-mat) |
| [TT-11](#tt-11) | Cần nhận tiền vào tài khoản ngân hàng khác | [D·3b · Chuyển khoản](Quy-Trinh-D-Thu-Tien.html#chuyen-khoan) |
| [TT-12](#tt-12) | Chọn nhầm chuyển khoản cho khoản thu bằng tiền mặt | [D·3b · Chuyển khoản](Quy-Trinh-D-Thu-Tien.html#chuyen-khoan) |
| [TT-13](#tt-13) | Đã thu tiền nhưng đơn vẫn hiện còn nợ | [D · Phiếu thu chính thức đã đủ giá trị đơn?](Quy-Trinh-D-Thu-Tien.html#du-tien) |
| [TT-14](#tt-14) | Đã thu đủ mà chưa thấy hoá đơn | [D·4 · Hoá đơn phát sinh](Quy-Trinh-D-Thu-Tien.html#hoa-don) |
| [TT-15](#tt-15) | Đơn đã giao đủ nhưng chưa Hoàn tất | [D·5 · Đơn chuyển sang Hoàn tất](Quy-Trinh-D-Thu-Tien.html#hoan-tat) |
| [TT-16](#tt-16) | Không huỷ được phiếu thu vừa lập | [D · Ngoài luồng chính](Quy-Trinh-D-Thu-Tien.html#ngoai-luong) |
| [TT-17](#tt-17) | Cần sửa phiếu thu khi đơn đã có hoá đơn | [D · Ngoài luồng chính](Quy-Trinh-D-Thu-Tien.html#ngoai-luong) |
| [TT-18](#tt-18) | Khách hàng trả hàng sau khi đã nhận | [D · Ngoài luồng chính](Quy-Trinh-D-Thu-Tien.html#ngoai-luong) |

---

## TT-01 · Báo “Chưa tạo phiếu giao hàng” khi thu tiền
{: #tt-01 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#co-phieu-giao">D · Đơn đã có phiếu giao hàng?</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“Chưa tạo phiếu giao hàng cho … Vui lòng tạo phiếu giao hàng trước khi thanh toán.”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Hệ thống chỉ cho thu tiền sau khi đơn đã có phiếu giao hàng. Tham số cho phép thu trước đang tắt.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-tt-01 qt-d-the-tt-01">
<title id="qt-t-the-tt-01">Các bước gỡ tình huống TT-01</title>
<desc id="qt-d-the-tt-01">Các bước xử lý tình huống TT-01: Báo “Chưa tạo phiếu giao hàng” khi thu tiền</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Khách muốn trả</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">trước khi nhận hàng?</text>
<rect class="qt-trang" x="292" y="10" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="32" text-anchor="start">Lập phiếu giao</text>
<text class="qt-tn" x="303" y="49" text-anchor="start">hàng trước</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Kinh doanh ghi nhận</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">khoản đặt cọc trên đơn</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,60 375,191 242,191" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#mo-thu-tien"><title>Quay về D·1 · Mở màn hình thu tiền</title>
<rect class="qt-cong" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="188" text-anchor="start">↩ Quay về D·1</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">Mở màn hình thu tiền</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-02 · Màn hình thu tiền không cho thao tác
{: #tt-02 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#mo-thu-tien">D·1 · Mở màn hình thu tiền</a></td></tr>
<tr><th>Dấu hiệu</th><td>Mở màn hình thu tiền nhưng không nhập được dòng thu nào.</td></tr>
<tr><th>Nguyên nhân</th><td>Kỹ thuật viên chưa được khai tài khoản thu tiền cho công ty của đơn.</td></tr>
<tr><th>Ai xử lý</th><td>Quản trị viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 287" width="470" height="287" role="img" aria-labelledby="qt-t-the-tt-02 qt-d-the-tt-02">
<title id="qt-t-the-tt-02">Các bước gỡ tình huống TT-02</title>
<desc id="qt-d-the-tt-02">Các bước xử lý tình huống TT-02: Màn hình thu tiền không cho thao tác</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="287"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Gửi quản trị viên mã</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">đơn và ảnh màn hình</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Quản trị viên khai tài khoản</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">thu tiền cho công ty đó</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="166" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="188" text-anchor="start">Tải lại ứng dụng</text>
<line class="qt-mui" x1="125" y1="199" x2="125" y2="223" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#mo-thu-tien"><title>Quay về D·1 · Mở màn hình thu tiền</title>
<rect class="qt-cong" x="12" y="227" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="249" text-anchor="start">↩ Quay về D·1</text>
<text class="qt-tn" x="24" y="266" text-anchor="start">Mở màn hình thu tiền</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-03 · Báo “đã có dòng Tiền mặt” khi thêm dòng thu
{: #tt-03 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#dong-thu">D·2 · Nhập các dòng thu</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“… đã có dòng &quot;Tiền mặt&quot;. Không thể tạo 2 dòng cùng hình thức cho 1 SO.”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Trong một lần thu, mỗi đơn chỉ được một dòng cho mỗi hình thức.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-tt-03 qt-d-the-tt-03">
<title id="qt-t-the-tt-03">Các bước gỡ tình huống TT-03</title>
<desc id="qt-d-the-tt-03">Các bước xử lý tình huống TT-03: Báo “đã có dòng Tiền mặt” khi thêm dòng thu</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Khách trả thêm</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">cùng hình thức?</text>
<rect class="qt-trang" x="292" y="10" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="32" text-anchor="start">Đổi hình thức</text>
<text class="qt-tn" x="303" y="49" text-anchor="start">của dòng mới</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Cộng dồn vào số</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">tiền của dòng đã có</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,60 375,191 242,191" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#dong-thu"><title>Quay về D·2 · Nhập các dòng thu</title>
<rect class="qt-cong" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="188" text-anchor="start">↩ Quay về D·2</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">Nhập các dòng thu</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-04 · Thu nhiều đơn một lần, chia sai tiền giữa các dòng
{: #tt-04 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#dong-thu">D·2 · Nhập các dòng thu</a></td></tr>
<tr><th>Dấu hiệu</th><td>Sau khi thu, một đơn thừa tiền còn một đơn vẫn còn nợ.</td></tr>
<tr><th>Nguyên nhân</th><td>Chốt cuối chỉ so tổng tiền với tổng nợ của cả nhóm đơn, không so từng đơn.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên · Kế toán</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-tt-04 qt-d-the-tt-04">
<title id="qt-t-the-tt-04">Các bước gỡ tình huống TT-04</title>
<desc id="qt-d-the-tt-04">Các bước xử lý tình huống TT-04: Thu nhiều đơn một lần, chia sai tiền giữa các dòng</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Phiếu lập chưa</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">quá 24 giờ?</text>
<rect class="qt-trang" x="292" y="10" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="32" text-anchor="start">Chuyển kế toán</text>
<text class="qt-tn" x="303" y="49" text-anchor="start">điều chỉnh</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Huỷ các phiếu sai rồi</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">lập lại đúng từng đơn</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,60 375,191 242,191" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#dong-thu"><title>Quay về D·2 · Nhập các dòng thu</title>
<rect class="qt-cong" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="188" text-anchor="start">↩ Quay về D·2</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">Nhập các dòng thu</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-05 · Chọn nhầm tiền mặt cho khoản khách đã chuyển khoản
{: #tt-05 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#tien-mat">D·3a · Tiền mặt</a></td></tr>
<tr><th>Dấu hiệu</th><td>Kỹ thuật viên bị ghi công nợ cá nhân cho khoản tiền mình không giữ.</td></tr>
<tr><th>Nguyên nhân</th><td>Dòng thu chọn hình thức tiền mặt, nên phiếu thu ghi tiền vào tài khoản kỹ thuật viên.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên · Kế toán</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 304" width="470" height="304" role="img" aria-labelledby="qt-t-the-tt-05 qt-d-the-tt-05">
<title id="qt-t-the-tt-05">Các bước gỡ tình huống TT-05</title>
<desc id="qt-d-the-tt-05">Các bước xử lý tình huống TT-05: Chọn nhầm tiền mặt cho khoản khách đã chuyển khoản</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="304"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Không lập phiếu</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">nộp cho khoản này</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<polygon class="qt-re" points="12,113 37,88 213,88 238,113 213,138 37,138"/>
<text class="qt-tb2" x="125" y="109" text-anchor="middle">Chưa quá 24 giờ và</text>
<text class="qt-tb2" x="125" y="126" text-anchor="middle">chưa có phiếu nộp?</text>
<rect class="qt-trang" x="292" y="88" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="110" text-anchor="start">Chuyển kế toán</text>
<text class="qt-tn" x="303" y="127" text-anchor="start">điều chỉnh</text>
<line class="qt-mui" x1="238" y1="113" x2="288" y2="113" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="107" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="155" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="188" text-anchor="start">Huỷ phiếu, lập lại</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">bằng chuyển khoản</text>
<line class="qt-mui" x1="125" y1="216" x2="125" y2="240" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,138 375,269 242,269" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#dong-thu"><title>Quay về D·2 · Nhập các dòng thu</title>
<rect class="qt-cong" x="12" y="244" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="266" text-anchor="start">↩ Quay về D·2</text>
<text class="qt-tn" x="24" y="283" text-anchor="start">Nhập các dòng thu</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-06 · Đã đưa tiền mặt cho kế toán nhưng vẫn còn công nợ cá nhân
{: #tt-06 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#tien-mat">D·3a · Tiền mặt</a></td></tr>
<tr><th>Dấu hiệu</th><td>Tài khoản trên ứng dụng vẫn hiện số dư dù tiền đã giao cho kế toán.</td></tr>
<tr><th>Nguyên nhân</th><td>Chưa lập phiếu nộp, hoặc phiếu nộp còn ở trạng thái nháp.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên · Kế toán</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 232" width="470" height="232" role="img" aria-labelledby="qt-t-the-tt-06 qt-d-the-tt-06">
<title id="qt-t-the-tt-06">Các bước gỡ tình huống TT-06</title>
<desc id="qt-d-the-tt-06">Các bước xử lý tình huống TT-06: Đã đưa tiền mặt cho kế toán nhưng vẫn còn công nợ cá nhân</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="232"/>
<polygon class="qt-re" points="12,33 35,10 215,10 238,33 215,56 35,56"/>
<text class="qt-tb2" x="125" y="37.5" text-anchor="middle">Đã lập phiếu nộp chưa?</text>
<rect class="qt-trang" x="292" y="-0.5" width="166" height="67" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="21.5" text-anchor="start">Lập phiếu nộp từ</text>
<text class="qt-tn" x="303" y="38.5" text-anchor="start">ứng dụng, chọn</text>
<text class="qt-tn" x="303" y="55.5" text-anchor="start">đúng khoản thu</text>
<line class="qt-mui" x1="238" y1="33" x2="288" y2="33" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="27" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="73" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="56" x2="125" y2="90.5" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="94.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="116.5" text-anchor="start">Đề nghị kế toán</text>
<text class="qt-tn" x="24" y="133.5" text-anchor="start">xác nhận phiếu nộp</text>
<line class="qt-mui" x1="125" y1="144.5" x2="125" y2="168.5" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,66.5 375,197.5 242,197.5" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#tien-mat"><title>Quay về D·3a · Tiền mặt</title>
<rect class="qt-cong" x="12" y="172.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="194.5" text-anchor="start">↩ Quay về D·3a</text>
<text class="qt-tn" x="24" y="211.5" text-anchor="start">Tiền mặt</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-07 · Báo “Công nợ … đã được trả qua …” khi lập phiếu nộp
{: #tt-07 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#tien-mat">D·3a · Tiền mặt</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“Công nợ … đã được trả qua …”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Khoản thu này đã có một phiếu nộp, kể cả phiếu còn nháp.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 302" width="470" height="302" role="img" aria-labelledby="qt-t-the-tt-07 qt-d-the-tt-07">
<title id="qt-t-the-tt-07">Các bước gỡ tình huống TT-07</title>
<desc id="qt-d-the-tt-07">Các bước xử lý tình huống TT-07: Báo “Công nợ … đã được trả qua …” khi lập phiếu nộp</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="302"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Tra phiếu nộp theo</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">mã trong thông báo</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<polygon class="qt-re" points="12,111 35,88 215,88 238,111 215,134 35,134"/>
<text class="qt-tb2" x="125" y="115.5" text-anchor="middle">Phiếu đó còn nháp?</text>
<rect class="qt-trang" x="292" y="86" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="108" text-anchor="start">Khoản đã nộp xong,</text>
<text class="qt-tn" x="303" y="125" text-anchor="start">không cần làm gì</text>
<line class="qt-mui" x1="238" y1="111" x2="288" y2="111" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="105" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="151" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="134" x2="125" y2="160" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="164" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="186" text-anchor="start">Đề nghị kế toán xác</text>
<text class="qt-tn" x="24" y="203" text-anchor="start">nhận, không lập thêm</text>
<line class="qt-mui" x1="125" y1="214" x2="125" y2="238" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,136 375,267 242,267" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#tien-mat"><title>Quay về D·3a · Tiền mặt</title>
<rect class="qt-cong" x="12" y="242" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="264" text-anchor="start">↩ Quay về D·3a</text>
<text class="qt-tn" x="24" y="281" text-anchor="start">Tiền mặt</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-08 · Đã nộp tiền nhưng hệ thống vẫn báo chưa nộp
{: #tt-08 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Gặp ở</th><td><a href="Quy-Trinh-03-Hien-Truong.html#dieu-kien">B · Hoàn thành phiếu công việc</a></td></tr>
<tr><th>Xử lý ở</th><td><a href="Quy-Trinh-D-Thu-Tien.html#tien-mat">D·3a · Tiền mặt</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“SO …: thu tiền mặt nhưng chưa có Internal Transfer về công ty”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Phiếu nộp chưa được xác nhận, hoặc được lập trên Desk mà không gắn với khoản thu.</td></tr>
<tr><th>Ai xử lý</th><td>Kế toán · Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 295" width="470" height="295" role="img" aria-labelledby="qt-t-the-tt-08 qt-d-the-tt-08">
<title id="qt-t-the-tt-08">Các bước gỡ tình huống TT-08</title>
<desc id="qt-d-the-tt-08">Các bước xử lý tình huống TT-08: Đã nộp tiền nhưng hệ thống vẫn báo chưa nộp</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="295"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Kế toán mở phiếu</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">nộp của khoản thu</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<polygon class="qt-re" points="12,113 37,88 213,88 238,113 213,138 37,138"/>
<text class="qt-tb2" x="125" y="109" text-anchor="middle">Phiếu nộp gắn</text>
<text class="qt-tb2" x="125" y="126" text-anchor="middle">đúng khoản thu?</text>
<rect class="qt-trang" x="292" y="79.5" width="166" height="67" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="101.5" text-anchor="start">Huỷ phiếu; kỹ</text>
<text class="qt-tn" x="303" y="118.5" text-anchor="start">thuật viên lập</text>
<text class="qt-tn" x="303" y="135.5" text-anchor="start">lại từ ứng dụng</text>
<line class="qt-mui" x1="238" y1="113" x2="288" y2="113" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="107" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="155" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="170.5" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="174.5" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="196.5" text-anchor="start">Xác nhận phiếu nộp</text>
<line class="qt-mui" x1="125" y1="207.5" x2="125" y2="231.5" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,146.5 375,260.5 242,260.5" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-03-Hien-Truong.html#dieu-kien"><title>Quay về B · Hoàn thành phiếu công việc</title>
<rect class="qt-cong" x="12" y="235.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="257.5" text-anchor="start">↩ Quay về B</text>
<text class="qt-tn" x="24" y="274.5" text-anchor="start">Hoàn thành phiếu công việc</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-09 · Báo “đã trả về … nhưng thu … (thiếu …)”
{: #tt-09 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Gặp ở</th><td><a href="Quy-Trinh-03-Hien-Truong.html#dieu-kien">B · Hoàn thành phiếu công việc</a></td></tr>
<tr><th>Xử lý ở</th><td><a href="Quy-Trinh-D-Thu-Tien.html#tien-mat">D·3a · Tiền mặt</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“SO …: đã trả về … nhưng thu … (thiếu …)”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Tổng đã nộp nhỏ hơn tổng đã thu. Hệ thống không có dung sai, lệch một đồng cũng bị chặn. Thường do phiếu nộp lập thủ công với số tiền làm tròn.</td></tr>
<tr><th>Ai xử lý</th><td>Kế toán · Kỹ thuật viên</td></tr>
</table>
<p class="qt-canh-bao">⚠️ Không lập thêm một phiếu nộp lẻ để bù phần thiếu — hệ thống chặn phiếu nộp thứ hai cho cùng khoản thu.</p>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 287" width="470" height="287" role="img" aria-labelledby="qt-t-the-tt-09 qt-d-the-tt-09">
<title id="qt-t-the-tt-09">Các bước gỡ tình huống TT-09</title>
<desc id="qt-d-the-tt-09">Các bước xử lý tình huống TT-09: Báo “đã trả về … nhưng thu … (thiếu …)”</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="287"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Kế toán huỷ phiếu</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">nộp lập thủ công</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Kỹ thuật viên lập lại</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">phiếu nộp từ ứng dụng</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="166" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="188" text-anchor="start">Kế toán xác nhận phiếu nộp mới</text>
<line class="qt-mui" x1="125" y1="199" x2="125" y2="223" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-03-Hien-Truong.html#dieu-kien"><title>Quay về B · Hoàn thành phiếu công việc</title>
<rect class="qt-cong" x="12" y="227" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="249" text-anchor="start">↩ Quay về B</text>
<text class="qt-tn" x="24" y="266" text-anchor="start">Hoàn thành phiếu công việc</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-10 · Báo “Số dư tài khoản … không đủ” khi xác nhận phiếu nộp
{: #tt-10 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#tien-mat">D·3a · Tiền mặt</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“Số dư tài khoản KTV … không đủ. Cần: …, Hiện có: …”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Số tiền định nộp lớn hơn số dư đang có — thường vì khoản này đã được nộp bằng một phiếu khác.</td></tr>
<tr><th>Ai xử lý</th><td>Kế toán</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 287" width="470" height="287" role="img" aria-labelledby="qt-t-the-tt-10 qt-d-the-tt-10">
<title id="qt-t-the-tt-10">Các bước gỡ tình huống TT-10</title>
<desc id="qt-d-the-tt-10">Các bước xử lý tình huống TT-10: Báo “Số dư tài khoản … không đủ” khi xác nhận phiếu nộp</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="287"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Xem lịch sử phiếu</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">nộp của tài khoản</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<polygon class="qt-re" points="12,113 37,88 213,88 238,113 213,138 37,138"/>
<text class="qt-tb2" x="125" y="109" text-anchor="middle">Khoản này đã có</text>
<text class="qt-tb2" x="125" y="126" text-anchor="middle">phiếu nộp khác?</text>
<rect class="qt-trang" x="292" y="88" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="110" text-anchor="start">Đối chiếu lại số</text>
<text class="qt-tn" x="303" y="127" text-anchor="start">dư tài khoản</text>
<line class="qt-mui" x1="238" y1="113" x2="288" y2="113" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="107" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="155" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="166" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="188" text-anchor="start">Xoá phiếu nháp thừa</text>
<line class="qt-mui" x1="125" y1="199" x2="125" y2="223" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,138 375,252 242,252" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#tien-mat"><title>Quay về D·3a · Tiền mặt</title>
<rect class="qt-cong" x="12" y="227" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="249" text-anchor="start">↩ Quay về D·3a</text>
<text class="qt-tn" x="24" y="266" text-anchor="start">Tiền mặt</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-11 · Cần nhận tiền vào tài khoản ngân hàng khác
{: #tt-11 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#chuyen-khoan">D·3b · Chuyển khoản</a></td></tr>
<tr><th>Dấu hiệu</th><td>Khách hàng hoặc công ty yêu cầu chuyển vào tài khoản khác với tài khoản đang chọn.</td></tr>
<tr><th>Nguyên nhân</th><td>Tài khoản chỉ được đổi khi công ty yêu cầu. Đơn đã có phiếu thu thì không đổi được tài khoản trên đơn.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên · Kinh doanh</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 224" width="470" height="224" role="img" aria-labelledby="qt-t-the-tt-11 qt-d-the-tt-11">
<title id="qt-t-the-tt-11">Các bước gỡ tình huống TT-11</title>
<desc id="qt-d-the-tt-11">Các bước xử lý tình huống TT-11: Cần nhận tiền vào tài khoản ngân hàng khác</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="224"/>
<polygon class="qt-re" points="12,33 35,10 215,10 238,33 215,56 35,56"/>
<text class="qt-tb2" x="125" y="37.5" text-anchor="middle">Đơn đã có phiếu thu?</text>
<rect class="qt-trang" x="292" y="8" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="30" text-anchor="start">Chọn tài khoản</text>
<text class="qt-tn" x="303" y="47" text-anchor="start">khác trên dòng thu</text>
<line class="qt-mui" x1="238" y1="33" x2="288" y2="33" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="27" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="73" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="56" x2="125" y2="82" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="86" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="108" text-anchor="start">Kinh doanh huỷ phiếu thu,</text>
<text class="qt-tn" x="24" y="125" text-anchor="start">sửa tài khoản trên đơn</text>
<line class="qt-mui" x1="125" y1="136" x2="125" y2="160" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,58 375,189 242,189" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#chuyen-khoan"><title>Quay về D·3b · Chuyển khoản</title>
<rect class="qt-cong" x="12" y="164" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="186" text-anchor="start">↩ Quay về D·3b</text>
<text class="qt-tn" x="24" y="203" text-anchor="start">Chuyển khoản</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-12 · Chọn nhầm chuyển khoản cho khoản thu bằng tiền mặt
{: #tt-12 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#chuyen-khoan">D·3b · Chuyển khoản</a></td></tr>
<tr><th>Dấu hiệu</th><td>Phiếu thu nằm ở trạng thái nháp rất lâu; kế toán không tìm thấy giao dịch trong sao kê.</td></tr>
<tr><th>Nguyên nhân</th><td>Dòng thu chọn hình thức chuyển khoản, trong khi khách hàng trả tiền mặt.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 253" width="470" height="253" role="img" aria-labelledby="qt-t-the-tt-12 qt-d-the-tt-12">
<title id="qt-t-the-tt-12">Các bước gỡ tình huống TT-12</title>
<desc id="qt-d-the-tt-12">Các bước xử lý tình huống TT-12: Chọn nhầm chuyển khoản cho khoản thu bằng tiền mặt</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="253"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Xoá phiếu thu nháp bị sai</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Lập lại dòng thu bằng tiền mặt</text>
<line class="qt-mui" x1="125" y1="104" x2="125" y2="128" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="132" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="154" text-anchor="start">Nộp tiền về công ty</text>
<line class="qt-mui" x1="125" y1="165" x2="125" y2="189" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#tien-mat"><title>Quay về D·3a · Tiền mặt</title>
<rect class="qt-cong" x="12" y="193" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="215" text-anchor="start">↩ Quay về D·3a</text>
<text class="qt-tn" x="24" y="232" text-anchor="start">Tiền mặt</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-13 · Đã thu tiền nhưng đơn vẫn hiện còn nợ
{: #tt-13 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#du-tien">D · Phiếu thu chính thức đã đủ giá trị đơn?</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“SO …: còn nợ …”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Còn phiếu thu chuyển khoản ở trạng thái nháp. Hệ thống chỉ tính phiếu đã chính thức.</td></tr>
<tr><th>Ai xử lý</th><td>Kế toán</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 319" width="470" height="319" role="img" aria-labelledby="qt-t-the-tt-13 qt-d-the-tt-13">
<title id="qt-t-the-tt-13">Các bước gỡ tình huống TT-13</title>
<desc id="qt-d-the-tt-13">Các bước xử lý tình huống TT-13: Đã thu tiền nhưng đơn vẫn hiện còn nợ</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="319"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Mở đơn, xem danh</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">sách phiếu thu</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<polygon class="qt-re" points="12,111 35,88 215,88 238,111 215,134 35,134"/>
<text class="qt-tb2" x="125" y="115.5" text-anchor="middle">Còn phiếu nháp?</text>
<rect class="qt-trang" x="292" y="86" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="108" text-anchor="start">Thu nốt phần</text>
<text class="qt-tn" x="303" y="125" text-anchor="start">còn thiếu</text>
<line class="qt-mui" x1="238" y1="111" x2="288" y2="111" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="105" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="151" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="134" x2="125" y2="160" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="164" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="186" text-anchor="start">Kế toán đối chiếu</text>
<text class="qt-tn" x="24" y="203" text-anchor="start">sao kê và xác nhận</text>
<line class="qt-mui" x1="125" y1="214" x2="125" y2="238" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,136 375,275.5 242,275.5" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#du-tien"><title>Quay về D · Phiếu thu chính thức đã đủ giá trị đơn?</title>
<rect class="qt-cong" x="12" y="242" width="226" height="67" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="264" text-anchor="start">↩ Quay về D</text>
<text class="qt-tn" x="24" y="281" text-anchor="start">Phiếu thu chính thức</text>
<text class="qt-tn" x="24" y="298" text-anchor="start">đã đủ giá trị đơn?</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-14 · Đã thu đủ mà chưa thấy hoá đơn
{: #tt-14 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#hoa-don">D·4 · Hoá đơn phát sinh</a></td></tr>
<tr><th>Dấu hiệu</th><td>Đơn đã thu đủ, đã giao đủ, nhưng chưa có hoá đơn.</td></tr>
<tr><th>Nguyên nhân</th><td>Khoản thu tiền mặt không làm hoá đơn phát sinh ngay; tác vụ tự động chạy hằng ngày, sớm nhất một ngày sau phiếu giao hàng.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 222" width="470" height="222" role="img" aria-labelledby="qt-t-the-tt-14 qt-d-the-tt-14">
<title id="qt-t-the-tt-14">Các bước gỡ tình huống TT-14</title>
<desc id="qt-d-the-tt-14">Các bước xử lý tình huống TT-14: Đã thu đủ mà chưa thấy hoá đơn</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="222"/>
<polygon class="qt-re" points="12,33 35,10 215,10 238,33 215,56 35,56"/>
<text class="qt-tb2" x="125" y="37.5" text-anchor="middle">Cần hoá đơn ngay?</text>
<rect class="qt-trang" x="292" y="16.5" width="166" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="38.5" text-anchor="start">Chờ tác vụ tự động</text>
<line class="qt-mui" x1="238" y1="33" x2="288" y2="33" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="27" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="73" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="56" x2="125" y2="80" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="84" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="106" text-anchor="start">Lập hoá đơn trên ứng</text>
<text class="qt-tn" x="24" y="123" text-anchor="start">dụng từ phiếu giao hàng</text>
<line class="qt-mui" x1="125" y1="134" x2="125" y2="158" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,49.5 375,187 242,187" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#hoa-don"><title>Quay về D·4 · Hoá đơn phát sinh</title>
<rect class="qt-cong" x="12" y="162" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="184" text-anchor="start">↩ Quay về D·4</text>
<text class="qt-tn" x="24" y="201" text-anchor="start">Hoá đơn phát sinh</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-15 · Đơn đã giao đủ nhưng chưa Hoàn tất
{: #tt-15 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Gặp ở</th><td><a href="Quy-Trinh-03-Hien-Truong.html#dieu-kien">B · Hoàn thành phiếu công việc</a></td></tr>
<tr><th>Xử lý ở</th><td><a href="Quy-Trinh-D-Thu-Tien.html#hoan-tat">D·5 · Đơn chuyển sang Hoàn tất</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“Sales Order not completed: …”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Đơn chưa có hoá đơn đủ giá trị. Khi chưa hoàn tất, khách hàng chưa được cộng điểm và hệ thống chưa sinh lịch bảo dưỡng.</td></tr>
<tr><th>Ai xử lý</th><td>Kế toán · Kỹ thuật viên</td></tr>
</table>
<p class="qt-lien-quan">Liên quan: <a href="#tt-14">TT-14</a> · <a href="#tt-13">TT-13</a></p>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 207" width="470" height="207" role="img" aria-labelledby="qt-t-the-tt-15 qt-d-the-tt-15">
<title id="qt-t-the-tt-15">Các bước gỡ tình huống TT-15</title>
<desc id="qt-d-the-tt-15">Các bước xử lý tình huống TT-15: Đơn đã giao đủ nhưng chưa Hoàn tất</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="207"/>
<polygon class="qt-re" points="12,33 35,10 215,10 238,33 215,56 35,56"/>
<text class="qt-tb2" x="125" y="37.5" text-anchor="middle">Đơn đã thu đủ?</text>
<rect class="qt-trang" x="292" y="8" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="30" text-anchor="start">Xử lý phần còn</text>
<text class="qt-tn" x="303" y="47" text-anchor="start">nợ — xem TT-13</text>
<line class="qt-mui" x1="238" y1="33" x2="288" y2="33" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="27" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="73" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="56" x2="125" y2="82" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="86" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="108" text-anchor="start">Lập hoá đơn — xem TT-14</text>
<line class="qt-mui" x1="125" y1="119" x2="125" y2="143" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,58 375,172 242,172" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-03-Hien-Truong.html#dieu-kien"><title>Quay về B · Hoàn thành phiếu công việc</title>
<rect class="qt-cong" x="12" y="147" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="169" text-anchor="start">↩ Quay về B</text>
<text class="qt-tn" x="24" y="186" text-anchor="start">Hoàn thành phiếu công việc</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-16 · Không huỷ được phiếu thu vừa lập
{: #tt-16 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#ngoai-luong">D · Ngoài luồng chính</a></td></tr>
<tr><th>Dấu hiệu</th><td>Chức năng huỷ phiếu thu trên ứng dụng báo lỗi.</td></tr>
<tr><th>Nguyên nhân</th><td>Đã quá 24 giờ, hoặc khoản thu đã có phiếu nộp, hoặc người huỷ không phải người lập.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên · Kế toán</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-tt-16 qt-d-the-tt-16">
<title id="qt-t-the-tt-16">Các bước gỡ tình huống TT-16</title>
<desc id="qt-d-the-tt-16">Các bước xử lý tình huống TT-16: Không huỷ được phiếu thu vừa lập</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Quá 24 giờ hoặc</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">đã có phiếu nộp?</text>
<rect class="qt-trang" x="292" y="10" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="32" text-anchor="start">Người lập phiếu</text>
<text class="qt-tn" x="303" y="49" text-anchor="start">huỷ trên ứng dụng</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Chuyển kế toán huỷ trên Desk</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,60 375,174 242,174" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#dong-thu"><title>Quay về D·2 · Nhập các dòng thu</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về D·2</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Nhập các dòng thu</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-17 · Cần sửa phiếu thu khi đơn đã có hoá đơn
{: #tt-17 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#ngoai-luong">D · Ngoài luồng chính</a></td></tr>
<tr><th>Dấu hiệu</th><td>Phiếu thu sai nhưng không huỷ được vì đơn đã có hoá đơn.</td></tr>
<tr><th>Nguyên nhân</th><td>Hoá đơn và phiếu thu đang liên kết với nhau.</td></tr>
<tr><th>Ai xử lý</th><td>Kế toán</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 314" width="470" height="314" role="img" aria-labelledby="qt-t-the-tt-17 qt-d-the-tt-17">
<title id="qt-t-the-tt-17">Các bước gỡ tình huống TT-17</title>
<desc id="qt-d-the-tt-17">Các bước xử lý tình huống TT-17: Cần sửa phiếu thu khi đơn đã có hoá đơn</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="314"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Huỷ hoá đơn</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Huỷ phiếu thu</text>
<line class="qt-mui" x1="125" y1="104" x2="125" y2="128" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="132" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="154" text-anchor="start">Lập lại phiếu thu đúng</text>
<line class="qt-mui" x1="125" y1="165" x2="125" y2="189" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="193" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="215" text-anchor="start">Hoá đơn phát sinh lại</text>
<line class="qt-mui" x1="125" y1="226" x2="125" y2="250" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#hoa-don"><title>Quay về D·4 · Hoá đơn phát sinh</title>
<rect class="qt-cong" x="12" y="254" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="276" text-anchor="start">↩ Quay về D·4</text>
<text class="qt-tn" x="24" y="293" text-anchor="start">Hoá đơn phát sinh</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## TT-18 · Khách hàng trả hàng sau khi đã nhận
{: #tt-18 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-D-Thu-Tien.html#ngoai-luong">D · Ngoài luồng chính</a></td></tr>
<tr><th>Dấu hiệu</th><td>Đơn đã có hoá đơn, khách hàng mang trả lại hàng.</td></tr>
<tr><th>Nguyên nhân</th><td>Đây là trả hàng sau bán, khác với việc kỹ thuật viên trả vật tư về kho.</td></tr>
<tr><th>Ai xử lý</th><td>Kế toán · Kinh doanh</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 270" width="470" height="270" role="img" aria-labelledby="qt-t-the-tt-18 qt-d-the-tt-18">
<title id="qt-t-the-tt-18">Các bước gỡ tình huống TT-18</title>
<desc id="qt-d-the-tt-18">Các bước xử lý tình huống TT-18: Khách hàng trả hàng sau khi đã nhận</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="270"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Lập phiếu giao hàng trả lại</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Lập hoá đơn trả lại</text>
<line class="qt-mui" x1="125" y1="104" x2="125" y2="128" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="132" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="154" text-anchor="start">Hệ thống tự thu</text>
<text class="qt-tn" x="24" y="171" text-anchor="start">hồi điểm tích luỹ</text>
<line class="qt-mui" x1="125" y1="182" x2="125" y2="206" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-D-Thu-Tien.html#hoan-tat"><title>Quay về D·5 · Đơn chuyển sang Hoàn tất</title>
<rect class="qt-cong" x="12" y="210" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="232" text-anchor="start">↩ Quay về D·5</text>
<text class="qt-tn" x="24" y="249" text-anchor="start">Đơn chuyển sang Hoàn tất</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---
