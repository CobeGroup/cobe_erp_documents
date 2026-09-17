---
title: A · Tình huống
layout: default
parent: A · Bán hàng
grand_parent: Quy trình hợp nhất
nav_order: 1
---

<!-- Trang sinh tự động bởi _tools/quy_trinh/build.py từ _quy_trinh/. Sửa tệp dữ liệu rồi chạy lại bộ sinh; sửa thẳng trang này sẽ bị ghi đè. -->

# Phân khu A — Tình huống cần xử lý
{: .no_toc }

Mỗi thẻ gồm: gặp ở đâu, dấu hiệu, nguyên nhân, các bước gỡ, và gỡ xong thì quay về bước nào.
{: .fs-3 .text-grey-dk-000 }

👉 [Sơ đồ phân khu A](Quy-Trinh-A-Ban-Hang.html) · [Bản đồ tổng](00-quy-trinh.html) · [Tra theo thông báo lỗi](Quy-Trinh-Tra-Cuu.html)

---

## Danh mục thẻ
{: #danh-muc }

| Mã | Tình huống | Xử lý ở bước |
|---|---|---|
| [BH-01](#bh-01) | Danh sách nguồn có giá trị “(Tuyệt đối không chọn!)” | [A·1 · Tiếp nhận khách tiềm năng](Quy-Trinh-A-Ban-Hang.html#nguon) |
| [BH-02](#bh-02) | Một số điện thoại ra nhiều phiếu khách tiềm năng | [A·1 · Tiếp nhận khách tiềm năng](Quy-Trinh-A-Ban-Hang.html#nguon) |
| [BH-03](#bh-03) | Không thấy ô From Customer | [A·2 · Khai người giới thiệu, nếu có](Quy-Trinh-A-Ban-Hang.html#gioi-thieu) |
| [BH-04](#bh-04) | Đã chuyển đổi rồi mới biết người giới thiệu | [A·2 · Khai người giới thiệu, nếu có](Quy-Trinh-A-Ban-Hang.html#gioi-thieu) |
| [BH-05](#bh-05) | Trùng liên hệ hoặc địa chỉ | [A·3 · Bổ sung liên hệ và địa chỉ](Quy-Trinh-A-Ban-Hang.html#lien-he) |
| [BH-06](#bh-06) | Khách hàng chưa quyết định mua | [A · Khách hàng đồng ý mua?](Quy-Trinh-A-Ban-Hang.html#dong-y) |
| [BH-07](#bh-07) | Báo “Could not find Row … Link Name” khi lưu | [A·4 · Chuyển thành khách hàng](Quy-Trinh-A-Ban-Hang.html#chuyen-doi) |
| [BH-08](#bh-08) | Khách hàng bị xếp sai công ty | [A·4 · Chuyển thành khách hàng](Quy-Trinh-A-Ban-Hang.html#chuyen-doi) |
| [BH-09](#bh-09) | Đơn hoàn tất nhưng khách hàng không được cộng điểm | [A·4 · Chuyển thành khách hàng](Quy-Trinh-A-Ban-Hang.html#chuyen-doi) |
| [BH-10](#bh-10) | Báo thiếu hoặc trùng người trong Sales Team | [A·5 · Lập đơn bán hàng](Quy-Trinh-A-Ban-Hang.html#khai-don) |
| [BH-11](#bh-11) | Báo tổng Payment Method lệch Grand Total | [A·5 · Lập đơn bán hàng](Quy-Trinh-A-Ban-Hang.html#khai-don) |
| [BH-12](#bh-12) | Đơn lập ngoài phiếu nhắc hoặc phiếu sự cố | [A·5 · Lập đơn bán hàng](Quy-Trinh-A-Ban-Hang.html#khai-don) |
| [BH-13](#bh-13) | Báo “Không cho phép thay đổi items…” | [A · Sửa, đóng và huỷ đơn](Quy-Trinh-A-Ban-Hang.html#sua-don) |
| [BH-14](#bh-14) | Báo không Close được vì đã có Delivery Note | [A · Sửa, đóng và huỷ đơn](Quy-Trinh-A-Ban-Hang.html#sua-don) |
| [BH-15](#bh-15) | Báo không đổi được Bank Account | [A · Sửa, đóng và huỷ đơn](Quy-Trinh-A-Ban-Hang.html#sua-don) |
| [BH-16](#bh-16) | Ô dữ liệu bị khoá sau khi xác nhận | [A · Sửa, đóng và huỷ đơn](Quy-Trinh-A-Ban-Hang.html#sua-don) |
| [BH-17](#bh-17) | Cần dừng hoặc tạm hoãn đơn | [A · Sửa, đóng và huỷ đơn](Quy-Trinh-A-Ban-Hang.html#sua-don) |

---

## BH-01 · Danh sách nguồn có giá trị “(Tuyệt đối không chọn!)”
{: #bh-01 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#nguon">A·1 · Tiếp nhận khách tiềm năng</a></td></tr>
<tr><th>Dấu hiệu</th><td>Ô Nguồn khách hàng có những giá trị mang tiền tố “(Tuyệt đối không chọn!)”.</td></tr>
<tr><th>Nguyên nhân</th><td>Đó là nguồn cũ được giữ lại để dữ liệu lịch sử không bị đứt liên kết.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-bh-01 qt-d-the-bh-01">
<title id="qt-t-the-bh-01">Các bước gỡ tình huống BH-01</title>
<desc id="qt-d-the-bh-01">Các bước xử lý tình huống BH-01: Danh sách nguồn có giá trị “(Tuyệt đối không chọn!)”</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Đã lỡ chọn trên</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">phiếu mới?</text>
<rect class="qt-trang" x="292" y="10" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="32" text-anchor="start">Chọn nguồn không</text>
<text class="qt-tn" x="303" y="49" text-anchor="start">mang tiền tố đó</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Sửa lại nguồn đúng</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">trước khi chuyển đổi</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,60 375,191 242,191" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#nguon"><title>Quay về A·1 · Tiếp nhận khách tiềm năng</title>
<rect class="qt-cong" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="188" text-anchor="start">↩ Quay về A·1</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">Tiếp nhận khách tiềm năng</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-02 · Một số điện thoại ra nhiều phiếu khách tiềm năng
{: #bh-02 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#nguon">A·1 · Tiếp nhận khách tiềm năng</a></td></tr>
<tr><th>Dấu hiệu</th><td>Tìm theo số điện thoại thấy nhiều phiếu của cùng một người.</td></tr>
<tr><th>Nguyên nhân</th><td>Khách hàng liên hệ nhiều lần qua nhiều kênh, mỗi lần hệ thống tự lập một phiếu.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 234" width="470" height="234" role="img" aria-labelledby="qt-t-the-bh-02 qt-d-the-bh-02">
<title id="qt-t-the-bh-02">Các bước gỡ tình huống BH-02</title>
<desc id="qt-d-the-bh-02">Các bước xử lý tình huống BH-02: Một số điện thoại ra nhiều phiếu khách tiềm năng</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="234"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Đã có phiếu</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">Converted?</text>
<rect class="qt-trang" x="292" y="1.5" width="166" height="67" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="23.5" text-anchor="start">Dùng phiếu mới</text>
<text class="qt-tn" x="303" y="40.5" text-anchor="start">nhất, giữ các phiếu</text>
<text class="qt-tn" x="303" y="57.5" text-anchor="start">kia làm lịch sử</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="92.5" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="96.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="118.5" text-anchor="start">Dùng phiếu Converted khớp</text>
<text class="qt-tn" x="24" y="135.5" text-anchor="start">thông tin nhất</text>
<line class="qt-mui" x1="125" y1="146.5" x2="125" y2="170.5" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,68.5 375,199.5 242,199.5" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#nguon"><title>Quay về A·1 · Tiếp nhận khách tiềm năng</title>
<rect class="qt-cong" x="12" y="174.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="196.5" text-anchor="start">↩ Quay về A·1</text>
<text class="qt-tn" x="24" y="213.5" text-anchor="start">Tiếp nhận khách tiềm năng</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-03 · Không thấy ô From Customer
{: #bh-03 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#gioi-thieu">A·2 · Khai người giới thiệu, nếu có</a></td></tr>
<tr><th>Dấu hiệu</th><td>Đã chọn nguồn giới thiệu nhưng ô From Customer không hiện.</td></tr>
<tr><th>Nguyên nhân</th><td>Ô này chỉ hiện với hai nguồn Reference và Existing Customer.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 312" width="470" height="312" role="img" aria-labelledby="qt-t-the-bh-03 qt-d-the-bh-03">
<title id="qt-t-the-bh-03">Các bước gỡ tình huống BH-03</title>
<desc id="qt-d-the-bh-03">Các bước xử lý tình huống BH-03: Không thấy ô From Customer</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="312"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Kiểm lại giá trị ô</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">Nguồn khách hàng</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<polygon class="qt-re" points="12,113 37,88 213,88 238,113 213,138 37,138"/>
<text class="qt-tb2" x="125" y="109" text-anchor="middle">Nguồn đang là</text>
<text class="qt-tb2" x="125" y="126" text-anchor="middle">Reference?</text>
<rect class="qt-trang" x="292" y="79.5" width="166" height="67" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="101.5" text-anchor="start">Chọn Reference,</text>
<text class="qt-tn" x="303" y="118.5" text-anchor="start">ô From Customer</text>
<text class="qt-tn" x="303" y="135.5" text-anchor="start">sẽ hiện</text>
<line class="qt-mui" x1="238" y1="113" x2="288" y2="113" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="107" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="155" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="170.5" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="174.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="196.5" text-anchor="start">Tải lại trang; vẫn không hiện</text>
<text class="qt-tn" x="24" y="213.5" text-anchor="start">thì báo quản trị viên</text>
<line class="qt-mui" x1="125" y1="224.5" x2="125" y2="248.5" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,146.5 375,277.5 242,277.5" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#gioi-thieu"><title>Quay về A·2 · Khai người giới thiệu, nếu có</title>
<rect class="qt-cong" x="12" y="252.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="274.5" text-anchor="start">↩ Quay về A·2</text>
<text class="qt-tn" x="24" y="291.5" text-anchor="start">Khai người giới thiệu, nếu có</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-04 · Đã chuyển đổi rồi mới biết người giới thiệu
{: #bh-04 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#gioi-thieu">A·2 · Khai người giới thiệu, nếu có</a></td></tr>
<tr><th>Nguyên nhân</th><td>Hệ thống truy người giới thiệu theo đường khách hàng → phiếu khách tiềm năng gốc. Khai sau khi chuyển đổi thì mắt xích này không còn đủ.</td></tr>
<tr><th>Ai xử lý</th><td>Quản trị viên</td></tr>
</table>
<p class="qt-canh-bao">⚠️ Người giới thiệu chỉ được tính thưởng khi liên kết đã đủ.</p>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 304" width="470" height="304" role="img" aria-labelledby="qt-t-the-bh-04 qt-d-the-bh-04">
<title id="qt-t-the-bh-04">Các bước gỡ tình huống BH-04</title>
<desc id="qt-d-the-bh-04">Các bước xử lý tình huống BH-04: Đã chuyển đổi rồi mới biết người giới thiệu</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="304"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Gửi quản trị viên</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">mã khách hàng mới</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Kèm mã khách hàng giới thiệu</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">và mã đơn đầu tiên</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="188" text-anchor="start">Quản trị viên bổ sung</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">liên kết thủ công</text>
<line class="qt-mui" x1="125" y1="216" x2="125" y2="240" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#chuyen-doi"><title>Quay về A·4 · Chuyển thành khách hàng</title>
<rect class="qt-cong" x="12" y="244" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="266" text-anchor="start">↩ Quay về A·4</text>
<text class="qt-tn" x="24" y="283" text-anchor="start">Chuyển thành khách hàng</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-05 · Trùng liên hệ hoặc địa chỉ
{: #bh-05 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#lien-he">A·3 · Bổ sung liên hệ và địa chỉ</a></td></tr>
<tr><th>Dấu hiệu</th><td>Một khách hàng có hai liên hệ hoặc hai địa chỉ giống nhau.</td></tr>
<tr><th>Nguyên nhân</th><td>Lập mới mà không tìm theo số điện thoại trước.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 270" width="470" height="270" role="img" aria-labelledby="qt-t-the-bh-05 qt-d-the-bh-05">
<title id="qt-t-the-bh-05">Các bước gỡ tình huống BH-05</title>
<desc id="qt-d-the-bh-05">Các bước xử lý tình huống BH-05: Trùng liên hệ hoặc địa chỉ</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="270"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Xác định bản cũ đang</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">gắn với khách hàng</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Xoá bản vừa lập</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="149" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="171" text-anchor="start">Gắn lại bản cũ qua bảng Links</text>
<line class="qt-mui" x1="125" y1="182" x2="125" y2="206" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#lien-he"><title>Quay về A·3 · Bổ sung liên hệ và địa chỉ</title>
<rect class="qt-cong" x="12" y="210" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="232" text-anchor="start">↩ Quay về A·3</text>
<text class="qt-tn" x="24" y="249" text-anchor="start">Bổ sung liên hệ và địa chỉ</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-06 · Khách hàng chưa quyết định mua
{: #bh-06 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#dong-y">A · Khách hàng đồng ý mua?</a></td></tr>
<tr><th>Dấu hiệu</th><td>Khách hàng quan tâm nhưng chưa đồng ý.</td></tr>
<tr><th>Nguyên nhân</th><td>Đây là trạng thái chờ, không phải lỗi; cần ghi nhận để theo dõi tiếp.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 234" width="470" height="234" role="img" aria-labelledby="qt-t-the-bh-06 qt-d-the-bh-06">
<title id="qt-t-the-bh-06">Các bước gỡ tình huống BH-06</title>
<desc id="qt-d-the-bh-06">Các bước xử lý tình huống BH-06: Khách hàng chưa quyết định mua</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="234"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Thương vụ cần theo dõi</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">nhiều bước?</text>
<rect class="qt-trang" x="292" y="1.5" width="166" height="67" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="23.5" text-anchor="start">Đặt trạng thái</text>
<text class="qt-tn" x="303" y="40.5" text-anchor="start">Interested,</text>
<text class="qt-tn" x="303" y="57.5" text-anchor="start">hẹn liên hệ lại</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="92.5" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="96.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="118.5" text-anchor="start">Lập cơ hội bán hàng</text>
<text class="qt-tn" x="24" y="135.5" text-anchor="start">(Opportunity)</text>
<line class="qt-mui" x1="125" y1="146.5" x2="125" y2="170.5" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,68.5 375,199.5 242,199.5" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#dong-y"><title>Quay về A · Khách hàng đồng ý mua?</title>
<rect class="qt-cong" x="12" y="174.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="196.5" text-anchor="start">↩ Quay về A</text>
<text class="qt-tn" x="24" y="213.5" text-anchor="start">Khách hàng đồng ý mua?</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-07 · Báo “Could not find Row … Link Name” khi lưu
{: #bh-07 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Gặp ở</th><td><a href="Quy-Trinh-A-Ban-Hang.html#khai-don">A·5 · Lập đơn bán hàng</a></td></tr>
<tr><th>Xử lý ở</th><td><a href="Quy-Trinh-A-Ban-Hang.html#chuyen-doi">A·4 · Chuyển thành khách hàng</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“Could not find Row #2: Link Name: …”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Hồ sơ khách hàng đang trỏ tới một phiếu khách tiềm năng đã bị đổi tên. Lỗi hiện ra khi lưu đơn, địa chỉ hoặc liên hệ.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh · Quản trị viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 295" width="470" height="295" role="img" aria-labelledby="qt-t-the-bh-07 qt-d-the-bh-07">
<title id="qt-t-the-bh-07">Các bước gỡ tình huống BH-07</title>
<desc id="qt-d-the-bh-07">Các bước xử lý tình huống BH-07: Báo “Could not find Row … Link Name” khi lưu</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="295"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Tìm phiếu đúng</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">theo số điện thoại</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<polygon class="qt-re" points="12,113 37,88 213,88 238,113 213,138 37,138"/>
<text class="qt-tb2" x="125" y="109" text-anchor="middle">Sửa được ô Lead trên</text>
<text class="qt-tb2" x="125" y="126" text-anchor="middle">hồ sơ khách hàng?</text>
<rect class="qt-trang" x="292" y="79.5" width="166" height="67" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="101.5" text-anchor="start">Gửi quản trị viên mã</text>
<text class="qt-tn" x="303" y="118.5" text-anchor="start">khách hàng và mã</text>
<text class="qt-tn" x="303" y="135.5" text-anchor="start">phiếu đúng</text>
<line class="qt-mui" x1="238" y1="113" x2="288" y2="113" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="107" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="155" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="170.5" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="174.5" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="196.5" text-anchor="start">Cập nhật ô Lead rồi lưu lại</text>
<line class="qt-mui" x1="125" y1="207.5" x2="125" y2="231.5" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,146.5 375,260.5 242,260.5" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#khai-don"><title>Quay về A·5 · Lập đơn bán hàng</title>
<rect class="qt-cong" x="12" y="235.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="257.5" text-anchor="start">↩ Quay về A·5</text>
<text class="qt-tn" x="24" y="274.5" text-anchor="start">Lập đơn bán hàng</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-08 · Khách hàng bị xếp sai công ty
{: #bh-08 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#chuyen-doi">A·4 · Chuyển thành khách hàng</a></td></tr>
<tr><th>Dấu hiệu</th><td>Đơn, kho và hoá đơn lệch pháp nhân so với thực tế.</td></tr>
<tr><th>Nguyên nhân</th><td>Nguồn khách hàng được khai cho nhiều công ty nên hệ thống không tự suy ra được.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 207" width="470" height="207" role="img" aria-labelledby="qt-t-the-bh-08 qt-d-the-bh-08">
<title id="qt-t-the-bh-08">Các bước gỡ tình huống BH-08</title>
<desc id="qt-d-the-bh-08">Các bước xử lý tình huống BH-08: Khách hàng bị xếp sai công ty</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="207"/>
<polygon class="qt-re" points="12,33 35,10 215,10 238,33 215,56 35,56"/>
<text class="qt-tb2" x="125" y="37.5" text-anchor="middle">Đã chuyển đổi chưa?</text>
<rect class="qt-trang" x="292" y="8" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="30" text-anchor="start">Sửa ô Công ty ngay</text>
<text class="qt-tn" x="303" y="47" text-anchor="start">trên phiếu</text>
<line class="qt-mui" x1="238" y1="33" x2="288" y2="33" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="27" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="73" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="56" x2="125" y2="82" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="86" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="108" text-anchor="start">Báo quản trị viên sửa ô Công ty</text>
<line class="qt-mui" x1="125" y1="119" x2="125" y2="143" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,58 375,172 242,172" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#chuyen-doi"><title>Quay về A·4 · Chuyển thành khách hàng</title>
<rect class="qt-cong" x="12" y="147" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="169" text-anchor="start">↩ Quay về A·4</text>
<text class="qt-tn" x="24" y="186" text-anchor="start">Chuyển thành khách hàng</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-09 · Đơn hoàn tất nhưng khách hàng không được cộng điểm
{: #bh-09 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Gặp ở</th><td><a href="Quy-Trinh-D-Thu-Tien.html#hoan-tat">D·5 · Đơn chuyển sang Hoàn tất</a></td></tr>
<tr><th>Xử lý ở</th><td><a href="Quy-Trinh-A-Ban-Hang.html#chuyen-doi">A·4 · Chuyển thành khách hàng</a></td></tr>
<tr><th>Nguyên nhân</th><td>Khách hàng chưa được gán chương trình tích điểm; hệ thống không cảnh báo khi thiếu.</td></tr>
<tr><th>Ai xử lý</th><td>Quản trị viên</td></tr>
</table>
<p class="qt-canh-bao">⚠️ Chỉ các đơn phát sinh sau khi gán mới được tính điểm.</p>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-bh-09 qt-d-the-bh-09">
<title id="qt-t-the-bh-09">Các bước gỡ tình huống BH-09</title>
<desc id="qt-d-the-bh-09">Các bước xử lý tình huống BH-09: Đơn hoàn tất nhưng khách hàng không được cộng điểm</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Báo quản trị viên gán chương</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">trình tích điểm</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Kiểm lại trên hồ sơ khách hàng</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#chuyen-doi"><title>Quay về A·4 · Chuyển thành khách hàng</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về A·4</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Chuyển thành khách hàng</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-10 · Báo thiếu hoặc trùng người trong Sales Team
{: #bh-10 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#khai-don">A·5 · Lập đơn bán hàng</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“Bắt buộc phải có ít nhất 1 Sales Person trong Sales Team.”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Đội bán hàng chưa được khai, hoặc có hai dòng cùng một người (thông báo “Không thể chọn trùng người trong Sales Team”).</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-bh-10 qt-d-the-bh-10">
<title id="qt-t-the-bh-10">Các bước gỡ tình huống BH-10</title>
<desc id="qt-d-the-bh-10">Các bước xử lý tình huống BH-10: Báo thiếu hoặc trùng người trong Sales Team</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Bảng Sales Team</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">đang trống?</text>
<rect class="qt-trang" x="292" y="18.5" width="166" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="40.5" text-anchor="start">Xoá dòng trùng người</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Thêm ít nhất một nhân sự</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,51.5 375,174 242,174" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#khai-don"><title>Quay về A·5 · Lập đơn bán hàng</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về A·5</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Lập đơn bán hàng</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-11 · Báo tổng Payment Method lệch Grand Total
{: #bh-11 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#khai-don">A·5 · Lập đơn bán hàng</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“Tổng tiền trong Payment Method phải bằng Grand Total…”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Tổng các dòng phương thức thanh toán lệch tổng giá trị đơn quá 100 đồng.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh</td></tr>
</table>
<p class="qt-canh-bao">⚠️ Mỗi lần sửa làm đổi tổng giá trị đơn, bảng này phải cập nhật lại; nếu không, biên bản bàn giao in ra sai số tiền.</p>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 270" width="470" height="270" role="img" aria-labelledby="qt-t-the-bh-11 qt-d-the-bh-11">
<title id="qt-t-the-bh-11">Các bước gỡ tình huống BH-11</title>
<desc id="qt-d-the-bh-11">Các bước xử lý tình huống BH-11: Báo tổng Payment Method lệch Grand Total</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="270"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Mở bảng Payment Methods</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Sửa số tiền từng dòng</text>
<text class="qt-tn" x="24" y="110" text-anchor="start">cho khớp tổng đơn</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="149" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="171" text-anchor="start">Lưu lại</text>
<line class="qt-mui" x1="125" y1="182" x2="125" y2="206" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#khai-don"><title>Quay về A·5 · Lập đơn bán hàng</title>
<rect class="qt-cong" x="12" y="210" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="232" text-anchor="start">↩ Quay về A·5</text>
<text class="qt-tn" x="24" y="249" text-anchor="start">Lập đơn bán hàng</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-12 · Đơn lập ngoài phiếu nhắc hoặc phiếu sự cố
{: #bh-12 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#khai-don">A·5 · Lập đơn bán hàng</a></td></tr>
<tr><th>Dấu hiệu</th><td>Đơn đã xác nhận nhưng phiếu nhắc vẫn Open, hoặc đơn sửa chữa không truy được về sự cố.</td></tr>
<tr><th>Nguyên nhân</th><td>Đơn được lập mới trên Desk thay vì bằng Create → Sales Order trên chứng từ gốc, nên mất liên kết ngược.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh · Quản trị viên</td></tr>
</table>
<p class="qt-lien-quan">Liên quan: <a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-07">SB-07</a> · <a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-15">SB-15</a></p>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-bh-12 qt-d-the-bh-12">
<title id="qt-t-the-bh-12">Các bước gỡ tình huống BH-12</title>
<desc id="qt-d-the-bh-12">Các bước xử lý tình huống BH-12: Đơn lập ngoài phiếu nhắc hoặc phiếu sự cố</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Đơn chưa có chứng từ</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">nào phía sau?</text>
<rect class="qt-trang" x="292" y="10" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="32" text-anchor="start">Nhờ quản trị viên</text>
<text class="qt-tn" x="303" y="49" text-anchor="start">gắn lại liên kết</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Huỷ đơn, lập lại từ chứng từ gốc</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,60 375,174 242,174" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#khai-don"><title>Quay về A·5 · Lập đơn bán hàng</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về A·5</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Lập đơn bán hàng</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-13 · Báo “Không cho phép thay đổi items…”
{: #bh-13 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#sua-don">A · Sửa, đóng và huỷ đơn</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“Không cho phép thay đổi items (chỉ được phép thêm/xóa/thay đổi qty của Giảm giá hoặc phi vật lý)”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Hàng vật lý của đơn đã được xuất kho.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh · Kho</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 217" width="470" height="217" role="img" aria-labelledby="qt-t-the-bh-13 qt-d-the-bh-13">
<title id="qt-t-the-bh-13">Các bước gỡ tình huống BH-13</title>
<desc id="qt-d-the-bh-13">Các bước xử lý tình huống BH-13: Báo “Không cho phép thay đổi items…”</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="217"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Chỉ cần bán</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">thêm món mới?</text>
<rect class="qt-trang" x="292" y="1.5" width="166" height="67" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="23.5" text-anchor="start">Huỷ phiếu xuất kho</text>
<text class="qt-tn" x="303" y="40.5" text-anchor="start">hoặc phiếu giao hàng</text>
<text class="qt-tn" x="303" y="57.5" text-anchor="start">trước, rồi sửa</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="92.5" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="96.5" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="118.5" text-anchor="start">Lập đơn mới cho món thêm</text>
<line class="qt-mui" x1="125" y1="129.5" x2="125" y2="153.5" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,68.5 375,182.5 242,182.5" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#xac-nhan"><title>Quay về A·6 · Rà soát rồi xác nhận đơn</title>
<rect class="qt-cong" x="12" y="157.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="179.5" text-anchor="start">↩ Quay về A·6</text>
<text class="qt-tn" x="24" y="196.5" text-anchor="start">Rà soát rồi xác nhận đơn</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-14 · Báo không Close được vì đã có Delivery Note
{: #bh-14 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#sua-don">A · Sửa, đóng và huỷ đơn</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“Không thể Close Sales Order này vì đã có Delivery Note”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Đơn còn phiếu giao hàng đang có hiệu lực.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh · Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 192" width="470" height="192" role="img" aria-labelledby="qt-t-the-bh-14 qt-d-the-bh-14">
<title id="qt-t-the-bh-14">Các bước gỡ tình huống BH-14</title>
<desc id="qt-d-the-bh-14">Các bước xử lý tình huống BH-14: Báo không Close được vì đã có Delivery Note</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="192"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Huỷ phiếu giao hàng</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Đóng đơn bằng Actions → Close</text>
<line class="qt-mui" x1="125" y1="104" x2="125" y2="128" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#xac-nhan"><title>Quay về A·6 · Rà soát rồi xác nhận đơn</title>
<rect class="qt-cong" x="12" y="132" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="154" text-anchor="start">↩ Quay về A·6</text>
<text class="qt-tn" x="24" y="171" text-anchor="start">Rà soát rồi xác nhận đơn</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-15 · Báo không đổi được Bank Account
{: #bh-15 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#sua-don">A · Sửa, đóng và huỷ đơn</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“Không cho phép thay đổi Bank Account vì đã tạo phiếu thanh toán”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Đơn đã có phiếu thu.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh · Kế toán</td></tr>
</table>
<p class="qt-lien-quan">Liên quan: <a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-11">TT-11</a></p>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 270" width="470" height="270" role="img" aria-labelledby="qt-t-the-bh-15 qt-d-the-bh-15">
<title id="qt-t-the-bh-15">Các bước gỡ tình huống BH-15</title>
<desc id="qt-d-the-bh-15">Các bước xử lý tình huống BH-15: Báo không đổi được Bank Account</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="270"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Huỷ phiếu thu</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Sửa tài khoản ngân</text>
<text class="qt-tn" x="24" y="110" text-anchor="start">hàng trên đơn</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="149" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="171" text-anchor="start">Lập lại phiếu thu</text>
<line class="qt-mui" x1="125" y1="182" x2="125" y2="206" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#xac-nhan"><title>Quay về A·6 · Rà soát rồi xác nhận đơn</title>
<rect class="qt-cong" x="12" y="210" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="232" text-anchor="start">↩ Quay về A·6</text>
<text class="qt-tn" x="24" y="249" text-anchor="start">Rà soát rồi xác nhận đơn</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-16 · Ô dữ liệu bị khoá sau khi xác nhận
{: #bh-16 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#sua-don">A · Sửa, đóng và huỷ đơn</a></td></tr>
<tr><th>Dấu hiệu</th><td>Không sửa được khách hàng, bảng giá hoặc ngày đặt.</td></tr>
<tr><th>Nguyên nhân</th><td>Các ô này không cho sửa sau khi đơn đã xác nhận.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 348" width="470" height="348" role="img" aria-labelledby="qt-t-the-bh-16 qt-d-the-bh-16">
<title id="qt-t-the-bh-16">Các bước gỡ tình huống BH-16</title>
<desc id="qt-d-the-bh-16">Các bước xử lý tình huống BH-16: Ô dữ liệu bị khoá sau khi xác nhận</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="348"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Huỷ ngược phiếu thu, hoá đơn,</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">phiếu giao hàng</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Huỷ đơn</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="171" text-anchor="start">Amend để lập bản</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">mới, mã có hậu tố -1</text>
<line class="qt-mui" x1="125" y1="199" x2="125" y2="223" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="227" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="249" text-anchor="start">Sửa trên bản mới rồi xác nhận</text>
<line class="qt-mui" x1="125" y1="260" x2="125" y2="284" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#xac-nhan"><title>Quay về A·6 · Rà soát rồi xác nhận đơn</title>
<rect class="qt-cong" x="12" y="288" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="310" text-anchor="start">↩ Quay về A·6</text>
<text class="qt-tn" x="24" y="327" text-anchor="start">Rà soát rồi xác nhận đơn</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## BH-17 · Cần dừng hoặc tạm hoãn đơn
{: #bh-17 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-A-Ban-Hang.html#sua-don">A · Sửa, đóng và huỷ đơn</a></td></tr>
<tr><th>Dấu hiệu</th><td>Khách hàng chỉ nhận một phần rồi thôi, hoặc cần hoãn xử lý.</td></tr>
<tr><th>Nguyên nhân</th><td>Đây là thao tác thường, nhưng hay bị nhầm với huỷ đơn. Huỷ là xoá hiệu lực cả đơn.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 207" width="470" height="207" role="img" aria-labelledby="qt-t-the-bh-17 qt-d-the-bh-17">
<title id="qt-t-the-bh-17">Các bước gỡ tình huống BH-17</title>
<desc id="qt-d-the-bh-17">Các bước xử lý tình huống BH-17: Cần dừng hoặc tạm hoãn đơn</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="207"/>
<polygon class="qt-re" points="12,33 35,10 215,10 238,33 215,56 35,56"/>
<text class="qt-tb2" x="125" y="37.5" text-anchor="middle">Dừng hẳn phần còn lại?</text>
<rect class="qt-trang" x="292" y="8" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="30" text-anchor="start">Actions → Hold, mở lại</text>
<text class="qt-tn" x="303" y="47" text-anchor="start">bằng Re-open</text>
<line class="qt-mui" x1="238" y1="33" x2="288" y2="33" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="27" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="73" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="56" x2="125" y2="82" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="86" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="108" text-anchor="start">Actions → Close</text>
<line class="qt-mui" x1="125" y1="119" x2="125" y2="143" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,58 375,172 242,172" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#xac-nhan"><title>Quay về A·6 · Rà soát rồi xác nhận đơn</title>
<rect class="qt-cong" x="12" y="147" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="169" text-anchor="start">↩ Quay về A·6</text>
<text class="qt-tn" x="24" y="186" text-anchor="start">Rà soát rồi xác nhận đơn</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---
