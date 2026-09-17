---
title: C · Tình huống
layout: default
parent: C · Kho và giao nhận
grand_parent: Quy trình hợp nhất
nav_order: 1
---

<!-- Trang sinh tự động bởi _tools/quy_trinh/build.py từ _quy_trinh/. Sửa tệp dữ liệu rồi chạy lại bộ sinh; sửa thẳng trang này sẽ bị ghi đè. -->

# Phân khu C — Tình huống cần xử lý
{: .no_toc }

Mỗi thẻ gồm: gặp ở đâu, dấu hiệu, nguyên nhân, các bước gỡ, và gỡ xong thì quay về bước nào.
{: .fs-3 .text-grey-dk-000 }

👉 [Sơ đồ phân khu C](Quy-Trinh-C-Kho-Giao-Nhan.html) · [Bản đồ tổng](00-quy-trinh.html) · [Tra theo thông báo lỗi](Quy-Trinh-Tra-Cuu.html)

---

## Danh mục thẻ
{: #danh-muc }

| Mã | Tình huống | Xử lý ở bước |
|---|---|---|
| [KG-01](#kg-01) | Món đã yêu cầu đủ không chọn được | [C·1 · Yêu cầu vật tư theo lịch hẹn](Quy-Trinh-C-Kho-Giao-Nhan.html#yeu-cau) |
| [KG-02](#kg-02) | Mọi thao tác vật tư đều báo lỗi ở một công ty | [C·1 · Yêu cầu vật tư theo lịch hẹn](Quy-Trinh-C-Kho-Giao-Nhan.html#yeu-cau) |
| [KG-03](#kg-03) | Hàng được cấp ngoài phiếu yêu cầu | [C·2 · Kho xuất hàng sang kho kỹ thuật viên](Quy-Trinh-C-Kho-Giao-Nhan.html#xuat-kho) |
| [KG-04](#kg-04) | Không xác nhận được phiếu giao hàng | [C·3 · Lập phiếu giao hàng, khách hàng ký](Quy-Trinh-C-Kho-Giao-Nhan.html#giao-hang) |
| [KG-05](#kg-05) | Nút xác nhận ở màn hình ký không bật | [C·3 · Lập phiếu giao hàng, khách hàng ký](Quy-Trinh-C-Kho-Giao-Nhan.html#giao-hang) |
| [KG-06](#kg-06) | Không rõ vì sao có nghĩa vụ trả | [C·4b · Còn phần không giao](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| [KG-07](#kg-07) | Dòng nghĩa vụ mờ và bị khoá | [C·4b · Còn phần không giao](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| [KG-08](#kg-08) | Không xoá được phiếu trả nháp | [C·4b · Còn phần không giao](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| [KG-09](#kg-09) | Phiếu trả được ghi vào kho của người khác | [C·4b · Còn phần không giao](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| [KG-10](#kg-10) | Báo đã trả đủ, hoặc vượt số còn lại | [C·4b · Còn phần không giao](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| [KG-11](#kg-11) | Đã trả hàng nhưng nghĩa vụ vẫn còn | [C·4b · Còn phần không giao](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| [KG-12](#kg-12) | Phiếu trả nháp tồn đọng từ lâu | [C·4b · Còn phần không giao](Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve) |
| [KG-13](#kg-13) | Nghĩa vụ trỏ tới mã vật tư không còn tồn tại | [C · Vật tư — tình huống ngoài luồng chính](Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac) |
| [KG-14](#kg-14) | Nghĩa vụ bộ sản phẩm không khớp thành phần | [C · Vật tư — tình huống ngoài luồng chính](Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac) |
| [KG-15](#kg-15) | Nghĩa vụ không ghi kho nguồn | [C · Vật tư — tình huống ngoài luồng chính](Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac) |
| [KG-16](#kg-16) | Kho kỹ thuật viên âm tồn | [C · Vật tư — tình huống ngoài luồng chính](Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac) |
| [KG-17](#kg-17) | Huỷ phiếu giao hàng sau khi đã trả vật tư | [C · Vật tư — tình huống ngoài luồng chính](Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac) |
| [KG-18](#kg-18) | Huỷ phiếu công việc nhưng vật tư vẫn ở kho kỹ thuật viên | [C · Vật tư — tình huống ngoài luồng chính](Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac) |
| [KG-19](#kg-19) | Đơn vị vận chuyển tính sai cước hoặc số kiện | [C·5 · Lập vận đơn từ đơn bán hàng](Quy-Trinh-C-Kho-Giao-Nhan.html#van-chuyen) |
| [KG-20](#kg-20) | Vận đơn đã xác nhận mà tồn kho chưa đổi | [C·6 · Xác nhận vận đơn](Quy-Trinh-C-Kho-Giao-Nhan.html#xac-nhan-vd) |
| [KG-21](#kg-21) | Đơn vị vận chuyển đến lấy hàng sai địa điểm | [C·7 · Kho xuất hàng cho đơn vị vận chuyển](Quy-Trinh-C-Kho-Giao-Nhan.html#xuat-dvvc) |
| [KG-22](#kg-22) | Giao thành công nhưng không thấy chứng từ tự sinh | [C·9a · Giao thành công](Quy-Trinh-C-Kho-Giao-Nhan.html#giao-thanh-cong) |
| [KG-23](#kg-23) | Đơn vị vận chuyển huỷ khi hàng đã được lấy đi | [C·9b · Hoàn về kho](Quy-Trinh-C-Kho-Giao-Nhan.html#hoan-ve) |

---

## KG-01 · Món đã yêu cầu đủ không chọn được
{: #kg-01 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#yeu-cau">C·1 · Yêu cầu vật tư theo lịch hẹn</a></td></tr>
<tr><th>Dấu hiệu</th><td>Món vẫn hiện trong danh sách nhưng bị khoá, kèm mã yêu cầu cũ.</td></tr>
<tr><th>Nguyên nhân</th><td>Số được yêu cầu bằng số cần trừ số đã có trong các yêu cầu trước.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 304" width="470" height="304" role="img" aria-labelledby="qt-t-the-kg-01 qt-d-the-kg-01">
<title id="qt-t-the-kg-01">Các bước gỡ tình huống KG-01</title>
<desc id="qt-d-the-kg-01">Các bước xử lý tình huống KG-01: Món đã yêu cầu đủ không chọn được</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="304"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Tra mã yêu cầu</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">cũ ghi trên dòng</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<polygon class="qt-re" points="12,113 37,88 213,88 238,113 213,138 37,138"/>
<text class="qt-tb2" x="125" y="109" text-anchor="middle">Kho đã xuất</text>
<text class="qt-tb2" x="125" y="126" text-anchor="middle">yêu cầu cũ?</text>
<rect class="qt-trang" x="292" y="88" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="110" text-anchor="start">Nhắc kho xử</text>
<text class="qt-tn" x="303" y="127" text-anchor="start">lý yêu cầu cũ</text>
<line class="qt-mui" x1="238" y1="113" x2="288" y2="113" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="107" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="155" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="188" text-anchor="start">Kiểm lại kho của</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">mình, hàng đã về</text>
<line class="qt-mui" x1="125" y1="216" x2="125" y2="240" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,138 375,269 242,269" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#yeu-cau"><title>Quay về C·1 · Yêu cầu vật tư theo lịch hẹn</title>
<rect class="qt-cong" x="12" y="244" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="266" text-anchor="start">↩ Quay về C·1</text>
<text class="qt-tn" x="24" y="283" text-anchor="start">Yêu cầu vật tư theo lịch hẹn</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-02 · Mọi thao tác vật tư đều báo lỗi ở một công ty
{: #kg-02 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#yeu-cau">C·1 · Yêu cầu vật tư theo lịch hẹn</a></td></tr>
<tr><th>Nguyên nhân</th><td>Kỹ thuật viên chưa được khai kho riêng cho công ty đó.</td></tr>
<tr><th>Ai xử lý</th><td>Quản trị viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 287" width="470" height="287" role="img" aria-labelledby="qt-t-the-kg-02 qt-d-the-kg-02">
<title id="qt-t-the-kg-02">Các bước gỡ tình huống KG-02</title>
<desc id="qt-d-the-kg-02">Các bước xử lý tình huống KG-02: Mọi thao tác vật tư đều báo lỗi ở một công ty</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="287"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Gửi quản trị viên</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">tên công ty đang lỗi</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Quản trị viên khai</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">kho cho công ty đó</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="166" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="188" text-anchor="start">Tải lại ứng dụng</text>
<line class="qt-mui" x1="125" y1="199" x2="125" y2="223" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#yeu-cau"><title>Quay về C·1 · Yêu cầu vật tư theo lịch hẹn</title>
<rect class="qt-cong" x="12" y="227" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="249" text-anchor="start">↩ Quay về C·1</text>
<text class="qt-tn" x="24" y="266" text-anchor="start">Yêu cầu vật tư theo lịch hẹn</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-03 · Hàng được cấp ngoài phiếu yêu cầu
{: #kg-03 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#xuat-kho">C·2 · Kho xuất hàng sang kho kỹ thuật viên</a></td></tr>
<tr><th>Nguyên nhân</th><td>Hệ thống chỉ theo dõi phần đi qua phiếu yêu cầu; phần cấp ngoài luồng không để lại dấu vết.</td></tr>
<tr><th>Ai xử lý</th><td>Kho</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-kg-03 qt-d-the-kg-03">
<title id="qt-t-the-kg-03">Các bước gỡ tình huống KG-03</title>
<desc id="qt-d-the-kg-03">Các bước xử lý tình huống KG-03: Hàng được cấp ngoài phiếu yêu cầu</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Lập bổ sung phiếu xuất</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">kho cho phần đã cấp</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Kiểm kê kho kỹ thuật viên</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#xuat-kho"><title>Quay về C·2 · Kho xuất hàng sang kho kỹ thuật viên</title>
<rect class="qt-cong" x="12" y="149" width="226" height="67" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về C·2</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Kho xuất hàng sang</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">kho kỹ thuật viên</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-04 · Không xác nhận được phiếu giao hàng
{: #kg-04 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#giao-hang">C·3 · Lập phiếu giao hàng, khách hàng ký</a></td></tr>
<tr><th>Dấu hiệu</th><td>Nút xác nhận báo lỗi khi có đơn bị giảm hết số lượng.</td></tr>
<tr><th>Nguyên nhân</th><td>Mỗi đơn phải giao tối thiểu một món; không cho hoàn trả toàn bộ đơn.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-kg-04 qt-d-the-kg-04">
<title id="qt-t-the-kg-04">Các bước gỡ tình huống KG-04</title>
<desc id="qt-d-the-kg-04">Các bước xử lý tình huống KG-04: Không xác nhận được phiếu giao hàng</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Thực tế đơn đó</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">có giao món nào?</text>
<rect class="qt-trang" x="292" y="10" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="32" text-anchor="start">Bỏ đơn đó khỏi</text>
<text class="qt-tn" x="303" y="49" text-anchor="start">lần giao này</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Sửa lại đúng số thực giao</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,60 375,182.5 242,182.5" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#giao-hang"><title>Quay về C·3 · Lập phiếu giao hàng, khách hàng ký</title>
<rect class="qt-cong" x="12" y="149" width="226" height="67" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về C·3</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Lập phiếu giao hàng,</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">khách hàng ký</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-05 · Nút xác nhận ở màn hình ký không bật
{: #kg-05 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#giao-hang">C·3 · Lập phiếu giao hàng, khách hàng ký</a></td></tr>
<tr><th>Nguyên nhân</th><td>Khách hàng chưa ký xác nhận trên màn hình.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 222" width="470" height="222" role="img" aria-labelledby="qt-t-the-kg-05 qt-d-the-kg-05">
<title id="qt-t-the-kg-05">Các bước gỡ tình huống KG-05</title>
<desc id="qt-d-the-kg-05">Các bước xử lý tình huống KG-05: Nút xác nhận ở màn hình ký không bật</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="222"/>
<polygon class="qt-re" points="12,33 35,10 215,10 238,33 215,56 35,56"/>
<text class="qt-tb2" x="125" y="37.5" text-anchor="middle">Chữ ký đang bị lỗi nét?</text>
<rect class="qt-trang" x="292" y="16.5" width="166" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="38.5" text-anchor="start">Đề nghị khách hàng ký</text>
<line class="qt-mui" x1="238" y1="33" x2="288" y2="33" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="27" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="73" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="56" x2="125" y2="80" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="84" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="106" text-anchor="start">Xoá chữ ký rồi ký lại</text>
<line class="qt-mui" x1="125" y1="117" x2="125" y2="141" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,49.5 375,178.5 242,178.5" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#giao-hang"><title>Quay về C·3 · Lập phiếu giao hàng, khách hàng ký</title>
<rect class="qt-cong" x="12" y="145" width="226" height="67" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="167" text-anchor="start">↩ Quay về C·3</text>
<text class="qt-tn" x="24" y="184" text-anchor="start">Lập phiếu giao hàng,</text>
<text class="qt-tn" x="24" y="201" text-anchor="start">khách hàng ký</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-06 · Không rõ vì sao có nghĩa vụ trả
{: #kg-06 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve">C·4b · Còn phần không giao</a></td></tr>
<tr><th>Dấu hiệu</th><td>Màn hình Trả vật tư hiện món kỹ thuật viên không nhớ đã giữ lại.</td></tr>
<tr><th>Nguyên nhân</th><td>Nghĩa vụ phát sinh ngay khi lập phiếu giao hàng — kể cả khi giảm số lượng do nhập nhầm.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 287" width="470" height="287" role="img" aria-labelledby="qt-t-the-kg-06 qt-d-the-kg-06">
<title id="qt-t-the-kg-06">Các bước gỡ tình huống KG-06</title>
<desc id="qt-d-the-kg-06">Các bước xử lý tình huống KG-06: Không rõ vì sao có nghĩa vụ trả</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="287"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Mở phiếu giao hàng ghi</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">trên dòng nghĩa vụ</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<polygon class="qt-re" points="12,113 37,88 213,88 238,113 213,138 37,138"/>
<text class="qt-tb2" x="125" y="109" text-anchor="middle">Số thực giao trên phiếu</text>
<text class="qt-tb2" x="125" y="126" text-anchor="middle">đúng thực tế?</text>
<rect class="qt-trang" x="292" y="88" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="110" text-anchor="start">Báo điều phối để sửa</text>
<text class="qt-tn" x="303" y="127" text-anchor="start">phiếu giao hàng</text>
<line class="qt-mui" x1="238" y1="113" x2="288" y2="113" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="107" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="155" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="166" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="188" text-anchor="start">Mang phần dư về, lập phiếu trả</text>
<line class="qt-mui" x1="125" y1="199" x2="125" y2="223" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,138 375,252 242,252" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve"><title>Quay về C·4b · Còn phần không giao</title>
<rect class="qt-cong" x="12" y="227" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="249" text-anchor="start">↩ Quay về C·4b</text>
<text class="qt-tn" x="24" y="266" text-anchor="start">Còn phần không giao</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-07 · Dòng nghĩa vụ mờ và bị khoá
{: #kg-07 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve">C·4b · Còn phần không giao</a></td></tr>
<tr><th>Nguyên nhân</th><td>Phần đó đang nằm trong một phiếu trả nháp chờ kho duyệt.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 268" width="470" height="268" role="img" aria-labelledby="qt-t-the-kg-07 qt-d-the-kg-07">
<title id="qt-t-the-kg-07">Các bước gỡ tình huống KG-07</title>
<desc id="qt-d-the-kg-07">Các bước xử lý tình huống KG-07: Dòng nghĩa vụ mờ và bị khoá</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="268"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Tra mã phiếu ghi trên dòng</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<polygon class="qt-re" points="12,94 35,71 215,71 238,94 215,117 35,117"/>
<text class="qt-tb2" x="125" y="98.5" text-anchor="middle">Phiếu nháp đó lập đúng?</text>
<rect class="qt-trang" x="292" y="69" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="91" text-anchor="start">Xoá phiếu nháp,</text>
<text class="qt-tn" x="303" y="108" text-anchor="start">nghĩa vụ mở lại</text>
<line class="qt-mui" x1="238" y1="94" x2="288" y2="94" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="88" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="134" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="117" x2="125" y2="143" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="147" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="169" text-anchor="start">Chờ kho duyệt</text>
<line class="qt-mui" x1="125" y1="180" x2="125" y2="204" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,119 375,233 242,233" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve"><title>Quay về C·4b · Còn phần không giao</title>
<rect class="qt-cong" x="12" y="208" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="230" text-anchor="start">↩ Quay về C·4b</text>
<text class="qt-tn" x="24" y="247" text-anchor="start">Còn phần không giao</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-08 · Không xoá được phiếu trả nháp
{: #kg-08 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve">C·4b · Còn phần không giao</a></td></tr>
<tr><th>Nguyên nhân</th><td>Chỉ người lập mới xoá được phiếu nháp của mình.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên · Quản trị viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-kg-08 qt-d-the-kg-08">
<title id="qt-t-the-kg-08">Các bước gỡ tình huống KG-08</title>
<desc id="qt-d-the-kg-08">Các bước xử lý tình huống KG-08: Không xoá được phiếu trả nháp</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Người lập phiếu</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">còn làm việc?</text>
<rect class="qt-trang" x="292" y="18.5" width="166" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="40.5" text-anchor="start">Nhờ quản trị viên xoá</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Nhờ người lập xoá</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,51.5 375,174 242,174" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve"><title>Quay về C·4b · Còn phần không giao</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về C·4b</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Còn phần không giao</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-09 · Phiếu trả được ghi vào kho của người khác
{: #kg-09 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve">C·4b · Còn phần không giao</a></td></tr>
<tr><th>Nguyên nhân</th><td>Nghĩa vụ không khai kho đích nên hệ thống chọn kho đứng đầu danh sách.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên · Quản trị viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-kg-09 qt-d-the-kg-09">
<title id="qt-t-the-kg-09">Các bước gỡ tình huống KG-09</title>
<desc id="qt-d-the-kg-09">Các bước xử lý tình huống KG-09: Phiếu trả được ghi vào kho của người khác</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Kiểm kho đích</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">trước khi gửi phiếu</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Đề nghị quản trị viên khai kho</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">hoàn trả mặc định</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve"><title>Quay về C·4b · Còn phần không giao</title>
<rect class="qt-cong" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="188" text-anchor="start">↩ Quay về C·4b</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">Còn phần không giao</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-10 · Báo đã trả đủ, hoặc vượt số còn lại
{: #kg-10 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve">C·4b · Còn phần không giao</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“… đã được trả về kho rồi”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Nghĩa vụ đã có phiếu duyệt bù đủ, hoặc số trả lớn hơn phần cần trả trừ phần đang chờ kho.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-kg-10 qt-d-the-kg-10">
<title id="qt-t-the-kg-10">Các bước gỡ tình huống KG-10</title>
<desc id="qt-d-the-kg-10">Các bước xử lý tình huống KG-10: Báo đã trả đủ, hoặc vượt số còn lại</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Xem ba con số Cần trả, Đang</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">chờ kho, Còn chọn được</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Giảm số lượng về tối</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">đa phần còn chọn được</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve"><title>Quay về C·4b · Còn phần không giao</title>
<rect class="qt-cong" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="188" text-anchor="start">↩ Quay về C·4b</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">Còn phần không giao</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-11 · Đã trả hàng nhưng nghĩa vụ vẫn còn
{: #kg-11 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve">C·4b · Còn phần không giao</a></td></tr>
<tr><th>Nguyên nhân</th><td>Phiếu trả còn ở trạng thái nháp. Chỉ phiếu đã duyệt mới xoá nghĩa vụ.</td></tr>
<tr><th>Ai xử lý</th><td>Kho</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 253" width="470" height="253" role="img" aria-labelledby="qt-t-the-kg-11 qt-d-the-kg-11">
<title id="qt-t-the-kg-11">Các bước gỡ tình huống KG-11</title>
<desc id="qt-d-the-kg-11">Các bước xử lý tình huống KG-11: Đã trả hàng nhưng nghĩa vụ vẫn còn</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="253"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Kho mở phiếu trả nháp</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Kiểm đếm hàng thực nhận</text>
<line class="qt-mui" x1="125" y1="104" x2="125" y2="128" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="132" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="154" text-anchor="start">Duyệt phiếu</text>
<line class="qt-mui" x1="125" y1="165" x2="125" y2="189" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve"><title>Quay về C·4b · Còn phần không giao</title>
<rect class="qt-cong" x="12" y="193" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="215" text-anchor="start">↩ Quay về C·4b</text>
<text class="qt-tn" x="24" y="232" text-anchor="start">Còn phần không giao</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-12 · Phiếu trả nháp tồn đọng từ lâu
{: #kg-12 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve">C·4b · Còn phần không giao</a></td></tr>
<tr><th>Nguyên nhân</th><td>Phiếu tồn từ trước, trỏ vào nghĩa vụ đã được trả bằng một phiếu khác.</td></tr>
<tr><th>Ai xử lý</th><td>Kho</td></tr>
</table>
<p class="qt-canh-bao">⚠️ Duyệt nhầm phiếu tồn đọng là trừ kho lần thứ hai.</p>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-kg-12 qt-d-the-kg-12">
<title id="qt-t-the-kg-12">Các bước gỡ tình huống KG-12</title>
<desc id="qt-d-the-kg-12">Các bước xử lý tình huống KG-12: Phiếu trả nháp tồn đọng từ lâu</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Nghĩa vụ của phiếu</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">còn cần trả?</text>
<rect class="qt-trang" x="292" y="10" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="32" text-anchor="start">Xoá phiếu,</text>
<text class="qt-tn" x="303" y="49" text-anchor="start">không duyệt</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Kiểm đếm rồi duyệt</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,60 375,174 242,174" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve"><title>Quay về C·4b · Còn phần không giao</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về C·4b</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Còn phần không giao</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-13 · Nghĩa vụ trỏ tới mã vật tư không còn tồn tại
{: #kg-13 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac">C · Vật tư — tình huống ngoài luồng chính</a></td></tr>
<tr><th>Nguyên nhân</th><td>Nghĩa vụ ghi lại theo thời điểm giao hàng; đổi tên mã vật tư về sau không cập nhật ngược.</td></tr>
<tr><th>Ai xử lý</th><td>Bộ phận kỹ thuật</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-kg-13 qt-d-the-kg-13">
<title id="qt-t-the-kg-13">Các bước gỡ tình huống KG-13</title>
<desc id="qt-d-the-kg-13">Các bước xử lý tình huống KG-13: Nghĩa vụ trỏ tới mã vật tư không còn tồn tại</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Gửi mã nghĩa vụ, mã</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">kho và ảnh màn hình</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Bộ phận kỹ thuật chạy</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">tác vụ xử lý dữ liệu</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve"><title>Quay về C·4b · Còn phần không giao</title>
<rect class="qt-cong" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="188" text-anchor="start">↩ Quay về C·4b</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">Còn phần không giao</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-14 · Nghĩa vụ bộ sản phẩm không khớp thành phần
{: #kg-14 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac">C · Vật tư — tình huống ngoài luồng chính</a></td></tr>
<tr><th>Nguyên nhân</th><td>Hệ thống khai triển bộ theo cấu hình hiện tại, không theo cấu hình lúc giao hàng.</td></tr>
<tr><th>Ai xử lý</th><td>Kho · Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 253" width="470" height="253" role="img" aria-labelledby="qt-t-the-kg-14 qt-d-the-kg-14">
<title id="qt-t-the-kg-14">Các bước gỡ tình huống KG-14</title>
<desc id="qt-d-the-kg-14">Các bước xử lý tình huống KG-14: Nghĩa vụ bộ sản phẩm không khớp thành phần</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="253"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Mở phiếu giao hàng gốc</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Đối chiếu thành phần thủ công</text>
<line class="qt-mui" x1="125" y1="104" x2="125" y2="128" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="132" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="154" text-anchor="start">Trả đúng các món thực có</text>
<line class="qt-mui" x1="125" y1="165" x2="125" y2="189" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve"><title>Quay về C·4b · Còn phần không giao</title>
<rect class="qt-cong" x="12" y="193" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="215" text-anchor="start">↩ Quay về C·4b</text>
<text class="qt-tn" x="24" y="232" text-anchor="start">Còn phần không giao</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-15 · Nghĩa vụ không ghi kho nguồn
{: #kg-15 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac">C · Vật tư — tình huống ngoài luồng chính</a></td></tr>
<tr><th>Nguyên nhân</th><td>Dữ liệu cũ, phát sinh trước khi hệ thống ghi nội dung này; nghĩa vụ hiện ở mọi kho của người đó.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 148" width="470" height="148" role="img" aria-labelledby="qt-t-the-kg-15 qt-d-the-kg-15">
<title id="qt-t-the-kg-15">Các bước gỡ tình huống KG-15</title>
<desc id="qt-d-the-kg-15">Các bước xử lý tình huống KG-15: Nghĩa vụ không ghi kho nguồn</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="148"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Chọn đúng kho đang giữ hàng</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">khi lập phiếu trả</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve"><title>Quay về C·4b · Còn phần không giao</title>
<rect class="qt-cong" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="110" text-anchor="start">↩ Quay về C·4b</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">Còn phần không giao</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-16 · Kho kỹ thuật viên âm tồn
{: #kg-16 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac">C · Vật tư — tình huống ngoài luồng chính</a></td></tr>
<tr><th>Nguyên nhân</th><td>Xuất hoặc giao vượt số lượng thực nhận.</td></tr>
<tr><th>Ai xử lý</th><td>Kho</td></tr>
</table>
<p class="qt-canh-bao">⚠️ Chưa xử lý xong âm tồn thì chưa bật tham số kiểm soát tồn kho chặt.</p>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-kg-16 qt-d-the-kg-16">
<title id="qt-t-the-kg-16">Các bước gỡ tình huống KG-16</title>
<desc id="qt-d-the-kg-16">Các bước xử lý tình huống KG-16: Kho kỹ thuật viên âm tồn</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Kiểm kê lại kho đó</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Lập phiếu điều chỉnh</text>
<text class="qt-tn" x="24" y="110" text-anchor="start">theo kết quả kiểm kê</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#xuat-kho"><title>Quay về C·2 · Kho xuất hàng sang kho kỹ thuật viên</title>
<rect class="qt-cong" x="12" y="149" width="226" height="67" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về C·2</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Kho xuất hàng sang</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">kho kỹ thuật viên</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-17 · Huỷ phiếu giao hàng sau khi đã trả vật tư
{: #kg-17 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac">C · Vật tư — tình huống ngoài luồng chính</a></td></tr>
<tr><th>Dấu hiệu</th><td>Hệ thống cảnh báo liệt kê từng món khi huỷ phiếu giao hàng.</td></tr>
<tr><th>Nguyên nhân</th><td>Nghĩa vụ đã trả bằng phiếu duyệt được giữ làm dấu vết; hàng đang nằm ở kho công ty.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên · Kho</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 243" width="470" height="243" role="img" aria-labelledby="qt-t-the-kg-17 qt-d-the-kg-17">
<title id="qt-t-the-kg-17">Các bước gỡ tình huống KG-17</title>
<desc id="qt-d-the-kg-17">Các bước xử lý tình huống KG-17: Huỷ phiếu giao hàng sau khi đã trả vật tư</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="243"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Đọc danh sách món</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">trong cảnh báo</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Lấy lại hàng từ kho công ty</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">trước khi giao lại</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#giao-hang"><title>Quay về C·3 · Lập phiếu giao hàng, khách hàng ký</title>
<rect class="qt-cong" x="12" y="166" width="226" height="67" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="188" text-anchor="start">↩ Quay về C·3</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">Lập phiếu giao hàng,</text>
<text class="qt-tn" x="24" y="222" text-anchor="start">khách hàng ký</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-18 · Huỷ phiếu công việc nhưng vật tư vẫn ở kho kỹ thuật viên
{: #kg-18 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Gặp ở</th><td><a href="Quy-Trinh-B-Hien-Truong.html#dong-mo">B · Mở lại, đổi lịch và huỷ</a></td></tr>
<tr><th>Xử lý ở</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#vat-tu-khac">C · Vật tư — tình huống ngoài luồng chính</a></td></tr>
<tr><th>Nguyên nhân</th><td>Huỷ phiếu công việc không tự trả hàng về kho.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên · Kho</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-kg-18 qt-d-the-kg-18">
<title id="qt-t-the-kg-18">Các bước gỡ tình huống KG-18</title>
<desc id="qt-d-the-kg-18">Các bước xử lý tình huống KG-18: Huỷ phiếu công việc nhưng vật tư vẫn ở kho kỹ thuật viên</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Lập phiếu trả cho</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">phần vật tư đã nhận</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Kho kiểm đếm và duyệt</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#tra-ve"><title>Quay về C·4b · Còn phần không giao</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về C·4b</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Còn phần không giao</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-19 · Đơn vị vận chuyển tính sai cước hoặc số kiện
{: #kg-19 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#van-chuyen">C·5 · Lập vận đơn từ đơn bán hàng</a></td></tr>
<tr><th>Nguyên nhân</th><td>Tab kiện hàng và người trả cước khai sai trước khi đẩy đơn.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh · Kho</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 224" width="470" height="224" role="img" aria-labelledby="qt-t-the-kg-19 qt-d-the-kg-19">
<title id="qt-t-the-kg-19">Các bước gỡ tình huống KG-19</title>
<desc id="qt-d-the-kg-19">Các bước xử lý tình huống KG-19: Đơn vị vận chuyển tính sai cước hoặc số kiện</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="224"/>
<polygon class="qt-re" points="12,33 35,10 215,10 238,33 215,56 35,56"/>
<text class="qt-tb2" x="125" y="37.5" text-anchor="middle">Đã đẩy đơn chưa?</text>
<rect class="qt-trang" x="292" y="8" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="30" text-anchor="start">Sửa tab kiện hàng và</text>
<text class="qt-tn" x="303" y="47" text-anchor="start">người trả cước</text>
<line class="qt-mui" x1="238" y1="33" x2="288" y2="33" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="27" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="73" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="56" x2="125" y2="82" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="86" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="108" text-anchor="start">Làm việc với đơn vị vận</text>
<text class="qt-tn" x="24" y="125" text-anchor="start">chuyển để điều chỉnh</text>
<line class="qt-mui" x1="125" y1="136" x2="125" y2="160" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,58 375,189 242,189" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#van-chuyen"><title>Quay về C·5 · Lập vận đơn từ đơn bán hàng</title>
<rect class="qt-cong" x="12" y="164" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="186" text-anchor="start">↩ Quay về C·5</text>
<text class="qt-tn" x="24" y="203" text-anchor="start">Lập vận đơn từ đơn bán hàng</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-20 · Vận đơn đã xác nhận mà tồn kho chưa đổi
{: #kg-20 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#xac-nhan-vd">C·6 · Xác nhận vận đơn</a></td></tr>
<tr><th>Nguyên nhân</th><td>Đúng thiết kế: xác nhận vận đơn chỉ sinh đề nghị xuất kho.</td></tr>
<tr><th>Ai xử lý</th><td>Kho</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 165" width="470" height="165" role="img" aria-labelledby="qt-t-the-kg-20 qt-d-the-kg-20">
<title id="qt-t-the-kg-20">Các bước gỡ tình huống KG-20</title>
<desc id="qt-d-the-kg-20">Các bước xử lý tình huống KG-20: Vận đơn đã xác nhận mà tồn kho chưa đổi</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="165"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Kho lập phiếu xuất</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">kho thật từ đề nghị</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#xuat-dvvc"><title>Quay về C·7 · Kho xuất hàng cho đơn vị vận chuyển</title>
<rect class="qt-cong" x="12" y="88" width="226" height="67" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="110" text-anchor="start">↩ Quay về C·7</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">Kho xuất hàng cho</text>
<text class="qt-tn" x="24" y="144" text-anchor="start">đơn vị vận chuyển</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-21 · Đơn vị vận chuyển đến lấy hàng sai địa điểm
{: #kg-21 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#xuat-dvvc">C·7 · Kho xuất hàng cho đơn vị vận chuyển</a></td></tr>
<tr><th>Nguyên nhân</th><td>Kho nguồn chưa được khai điểm gửi hàng; hệ thống không cảnh báo khi thiếu.</td></tr>
<tr><th>Ai xử lý</th><td>Quản trị viên · Kho</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 243" width="470" height="243" role="img" aria-labelledby="qt-t-the-kg-21 qt-d-the-kg-21">
<title id="qt-t-the-kg-21">Các bước gỡ tình huống KG-21</title>
<desc id="qt-d-the-kg-21">Các bước xử lý tình huống KG-21: Đơn vị vận chuyển đến lấy hàng sai địa điểm</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="243"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Khai điểm gửi hàng</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">cho kho nguồn</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Báo lại đơn vị vận</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">chuyển địa điểm đúng</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#xuat-dvvc"><title>Quay về C·7 · Kho xuất hàng cho đơn vị vận chuyển</title>
<rect class="qt-cong" x="12" y="166" width="226" height="67" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="188" text-anchor="start">↩ Quay về C·7</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">Kho xuất hàng cho</text>
<text class="qt-tn" x="24" y="222" text-anchor="start">đơn vị vận chuyển</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-22 · Giao thành công nhưng không thấy chứng từ tự sinh
{: #kg-22 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#giao-thanh-cong">C·9a · Giao thành công</a></td></tr>
<tr><th>Nguyên nhân</th><td>Vận đơn không gắn đơn bán hàng, hoặc kết nối trạng thái với đơn vị vận chuyển chưa bật.</td></tr>
<tr><th>Ai xử lý</th><td>Kinh doanh · Bộ phận kỹ thuật</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 304" width="470" height="304" role="img" aria-labelledby="qt-t-the-kg-22 qt-d-the-kg-22">
<title id="qt-t-the-kg-22">Các bước gỡ tình huống KG-22</title>
<desc id="qt-d-the-kg-22">Các bước xử lý tình huống KG-22: Giao thành công nhưng không thấy chứng từ tự sinh</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="304"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Kiểm bảng chứng từ</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">nguồn trên vận đơn</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<polygon class="qt-re" points="12,113 37,88 213,88 238,113 213,138 37,138"/>
<text class="qt-tb2" x="125" y="109" text-anchor="middle">Vận đơn có gắn</text>
<text class="qt-tb2" x="125" y="126" text-anchor="middle">đơn bán hàng?</text>
<rect class="qt-trang" x="292" y="88" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="110" text-anchor="start">Gắn đơn bán</text>
<text class="qt-tn" x="303" y="127" text-anchor="start">hàng vào vận đơn</text>
<line class="qt-mui" x1="238" y1="113" x2="288" y2="113" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="107" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="155" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="188" text-anchor="start">Báo bộ phận kỹ</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">thuật kiểm kết nối</text>
<line class="qt-mui" x1="125" y1="216" x2="125" y2="240" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,138 375,269 242,269" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#ket-cuc"><title>Quay về C·9 · Vận đơn kết thúc thế nào?</title>
<rect class="qt-cong" x="12" y="244" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="266" text-anchor="start">↩ Quay về C·9</text>
<text class="qt-tn" x="24" y="283" text-anchor="start">Vận đơn kết thúc thế nào?</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## KG-23 · Đơn vị vận chuyển huỷ khi hàng đã được lấy đi
{: #kg-23 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-C-Kho-Giao-Nhan.html#hoan-ve">C·9b · Hoàn về kho</a></td></tr>
<tr><th>Nguyên nhân</th><td>Hàng đang trên đường hoàn về; huỷ vận đơn ngay sẽ làm sổ kho sai.</td></tr>
<tr><th>Ai xử lý</th><td>Kho</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 270" width="470" height="270" role="img" aria-labelledby="qt-t-the-kg-23 qt-d-the-kg-23">
<title id="qt-t-the-kg-23">Các bước gỡ tình huống KG-23</title>
<desc id="qt-d-the-kg-23">Các bước xử lý tình huống KG-23: Đơn vị vận chuyển huỷ khi hàng đã được lấy đi</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="270"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Chưa huỷ vận đơn</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Chờ kho nhận lại hàng thật</text>
<line class="qt-mui" x1="125" y1="104" x2="125" y2="128" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="132" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="154" text-anchor="start">Huỷ vận đơn sau</text>
<text class="qt-tn" x="24" y="171" text-anchor="start">khi đã nhận hàng</text>
<line class="qt-mui" x1="125" y1="182" x2="125" y2="206" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#ket-cuc"><title>Quay về C·9 · Vận đơn kết thúc thế nào?</title>
<rect class="qt-cong" x="12" y="210" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="232" text-anchor="start">↩ Quay về C·9</text>
<text class="qt-tn" x="24" y="249" text-anchor="start">Vận đơn kết thúc thế nào?</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---
