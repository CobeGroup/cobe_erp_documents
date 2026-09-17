---
title: B · Tình huống
layout: default
parent: B · Điều phối và hiện trường
grand_parent: Quy trình hợp nhất
nav_order: 1
---

<!-- Trang sinh tự động bởi _tools/quy_trinh/build.py từ _quy_trinh/. Sửa tệp dữ liệu rồi chạy lại bộ sinh; sửa thẳng trang này sẽ bị ghi đè. -->

# Phân khu B — Tình huống cần xử lý
{: .no_toc }

Mỗi thẻ gồm: gặp ở đâu, dấu hiệu, nguyên nhân, các bước gỡ, và gỡ xong thì quay về bước nào.
{: .fs-3 .text-grey-dk-000 }

👉 [Sơ đồ phân khu B](Quy-Trinh-B-Hien-Truong.html) · [Bản đồ tổng](00-quy-trinh.html) · [Tra theo thông báo lỗi](Quy-Trinh-Tra-Cuu.html)

---

## Danh mục thẻ
{: #danh-muc }

| Mã | Tình huống | Xử lý ở bước |
|---|---|---|
| [HT-01](#ht-01) | Chọn sai loại việc trên phiếu công việc | [B·1 · Lập phiếu công việc](Quy-Trinh-B-Hien-Truong.html#lap-wo) |
| [HT-02](#ht-02) | Đơn không hiện trên màn hình điều phối | [B·1 · Lập phiếu công việc](Quy-Trinh-B-Hien-Truong.html#lap-wo) |
| [HT-03](#ht-03) | Không đổi được kỹ thuật viên hoặc khung giờ | [B·2 · Lập lịch hẹn, gán kỹ thuật viên](Quy-Trinh-B-Hien-Truong.html#lap-sa) |
| [HT-04](#ht-04) | Không thấy chức năng tạo lịch hẹn | [B·2 · Lập lịch hẹn, gán kỹ thuật viên](Quy-Trinh-B-Hien-Truong.html#lap-sa) |
| [HT-05](#ht-05) | Nhiều kỹ thuật viên cùng một buổi | [B·2 · Lập lịch hẹn, gán kỹ thuật viên](Quy-Trinh-B-Hien-Truong.html#lap-sa) |
| [HT-06](#ht-06) | Tới nơi nhưng không làm được | [B·3 · Làm việc tại nhà khách hàng](Quy-Trinh-B-Hien-Truong.html#hien-truong) |
| [HT-07](#ht-07) | Báo thiếu ảnh khi hoàn thành lịch hẹn | [B·3 · Làm việc tại nhà khách hàng](Quy-Trinh-B-Hien-Truong.html#hien-truong) |
| [HT-08](#ht-08) | Báo chưa có giờ bắt đầu thực tế | [B·3 · Làm việc tại nhà khách hàng](Quy-Trinh-B-Hien-Truong.html#hien-truong) |
| [HT-09](#ht-09) | Báo còn người chưa check-out | [B · Đủ điều kiện hoàn thành lịch hẹn?](Quy-Trinh-B-Hien-Truong.html#du-dk-sa) |
| [HT-10](#ht-10) | Cần sửa lịch hẹn đã hoàn tất | [B·4 · Hoàn thành lịch hẹn](Quy-Trinh-B-Hien-Truong.html#hoan-thanh-sa) |
| [HT-11](#ht-11) | Phiếu công việc không hoàn thành được | [B · Phiếu công việc đủ sáu điều kiện?](Quy-Trinh-B-Hien-Truong.html#du-dk-wo) |
| [HT-12](#ht-12) | Đủ điều kiện nhưng tác vụ tự động vẫn bỏ qua | [B·5 · Hoàn thành phiếu công việc](Quy-Trinh-B-Hien-Truong.html#hoan-thanh-wo) |
| [HT-13](#ht-13) | Báo phiếu công việc không có lịch hẹn nào | [B·5 · Hoàn thành phiếu công việc](Quy-Trinh-B-Hien-Truong.html#hoan-thanh-wo) |
| [HT-14](#ht-14) | Mở lại lịch hẹn làm mất dữ liệu check-in | [B · Mở lại, đổi lịch và huỷ](Quy-Trinh-B-Hien-Truong.html#dong-mo) |
| [HT-15](#ht-15) | Không huỷ được lịch hẹn, phiếu công việc hoặc đơn | [B · Mở lại, đổi lịch và huỷ](Quy-Trinh-B-Hien-Truong.html#dong-mo) |

---

## HT-01 · Chọn sai loại việc trên phiếu công việc
{: #ht-01 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-B-Hien-Truong.html#lap-wo">B·1 · Lập phiếu công việc</a></td></tr>
<tr><th>Dấu hiệu</th><td>Phiếu bị đòi ảnh, giao hàng hoặc thu tiền không liên quan, hoặc bỏ sót yêu cầu lẽ ra phải có.</td></tr>
<tr><th>Nguyên nhân</th><td>Loại việc quyết định bộ yêu cầu khi hoàn thành phiếu; hệ thống không cảnh báo khi chọn sai.</td></tr>
<tr><th>Ai xử lý</th><td>Điều phối</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-ht-01 qt-d-the-ht-01">
<title id="qt-t-the-ht-01">Các bước gỡ tình huống HT-01</title>
<desc id="qt-d-the-ht-01">Các bước xử lý tình huống HT-01: Chọn sai loại việc trên phiếu công việc</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Phiếu chưa có lịch</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">hẹn hoàn tất?</text>
<rect class="qt-trang" x="292" y="10" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="32" text-anchor="start">Báo quản lý</text>
<text class="qt-tn" x="303" y="49" text-anchor="start">dịch vụ xử lý</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Sửa loại việc trên phiếu</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,60 375,174 242,174" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#lap-wo"><title>Quay về B·1 · Lập phiếu công việc</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về B·1</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Lập phiếu công việc</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## HT-02 · Đơn không hiện trên màn hình điều phối
{: #ht-02 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-B-Hien-Truong.html#lap-wo">B·1 · Lập phiếu công việc</a></td></tr>
<tr><th>Dấu hiệu</th><td>Đơn đã xác nhận nhưng điều phối không thấy để xếp lịch.</td></tr>
<tr><th>Nguyên nhân</th><td>Chưa có phiếu công việc; hệ thống không tự lập phiếu từ đơn.</td></tr>
<tr><th>Ai xử lý</th><td>Điều phối</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 192" width="470" height="192" role="img" aria-labelledby="qt-t-the-ht-02 qt-d-the-ht-02">
<title id="qt-t-the-ht-02">Các bước gỡ tình huống HT-02</title>
<desc id="qt-d-the-ht-02">Các bước xử lý tình huống HT-02: Đơn không hiện trên màn hình điều phối</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="192"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Mở đơn đã xác nhận</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Create → FS Work Order</text>
<line class="qt-mui" x1="125" y1="104" x2="125" y2="128" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#lap-sa"><title>Quay về B·2 · Lập lịch hẹn, gán kỹ thuật viên</title>
<rect class="qt-cong" x="12" y="132" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="154" text-anchor="start">↩ Quay về B·2</text>
<text class="qt-tn" x="24" y="171" text-anchor="start">Lập lịch hẹn, gán kỹ thuật viên</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## HT-03 · Không đổi được kỹ thuật viên hoặc khung giờ
{: #ht-03 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-B-Hien-Truong.html#lap-sa">B·2 · Lập lịch hẹn, gán kỹ thuật viên</a></td></tr>
<tr><th>Nguyên nhân</th><td>Lịch ở Completed, Cannot Complete hoặc Canceled không đổi được người; từ In Progress trở đi không đổi được giờ.</td></tr>
<tr><th>Ai xử lý</th><td>Điều phối</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-ht-03 qt-d-the-ht-03">
<title id="qt-t-the-ht-03">Các bước gỡ tình huống HT-03</title>
<desc id="qt-d-the-ht-03">Các bước xử lý tình huống HT-03: Không đổi được kỹ thuật viên hoặc khung giờ</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Lịch đã In</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">Progress trở đi?</text>
<rect class="qt-trang" x="292" y="10" width="166" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="32" text-anchor="start">Sửa trực tiếp trên</text>
<text class="qt-tn" x="303" y="49" text-anchor="start">màn hình điều phối</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Huỷ lịch kèm lý do, lập lịch mới</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,60 375,174 242,174" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#lap-sa"><title>Quay về B·2 · Lập lịch hẹn, gán kỹ thuật viên</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về B·2</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Lập lịch hẹn, gán kỹ thuật viên</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## HT-04 · Không thấy chức năng tạo lịch hẹn
{: #ht-04 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-B-Hien-Truong.html#lap-sa">B·2 · Lập lịch hẹn, gán kỹ thuật viên</a></td></tr>
<tr><th>Nguyên nhân</th><td>Phiếu công việc đã ở trạng thái Closed.</td></tr>
<tr><th>Ai xử lý</th><td>Điều phối</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 253" width="470" height="253" role="img" aria-labelledby="qt-t-the-ht-04 qt-d-the-ht-04">
<title id="qt-t-the-ht-04">Các bước gỡ tình huống HT-04</title>
<desc id="qt-d-the-ht-04">Các bước xử lý tình huống HT-04: Không thấy chức năng tạo lịch hẹn</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="253"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Mở phiếu công việc</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Chọn Re-open</text>
<line class="qt-mui" x1="125" y1="104" x2="125" y2="128" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="132" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="154" text-anchor="start">Tạo lịch hẹn như thường</text>
<line class="qt-mui" x1="125" y1="165" x2="125" y2="189" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#lap-sa"><title>Quay về B·2 · Lập lịch hẹn, gán kỹ thuật viên</title>
<rect class="qt-cong" x="12" y="193" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="215" text-anchor="start">↩ Quay về B·2</text>
<text class="qt-tn" x="24" y="232" text-anchor="start">Lập lịch hẹn, gán kỹ thuật viên</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## HT-05 · Nhiều kỹ thuật viên cùng một buổi
{: #ht-05 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-B-Hien-Truong.html#lap-sa">B·2 · Lập lịch hẹn, gán kỹ thuật viên</a></td></tr>
<tr><th>Dấu hiệu</th><td>Cần gán hai người trở lên, hoặc bỏ bớt một người khỏi lịch.</td></tr>
<tr><th>Nguyên nhân</th><td>Mỗi người có một tỉ lệ đóng góp, tổng phải bằng 100% — đây là căn cứ tính công ca.</td></tr>
<tr><th>Ai xử lý</th><td>Điều phối</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 192" width="470" height="192" role="img" aria-labelledby="qt-t-the-ht-05 qt-d-the-ht-05">
<title id="qt-t-the-ht-05">Các bước gỡ tình huống HT-05</title>
<desc id="qt-d-the-ht-05">Các bước xử lý tình huống HT-05: Nhiều kỹ thuật viên cùng một buổi</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="192"/>
<rect class="qt-trang" x="12" y="10" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Gán đủ người vào lịch hẹn</text>
<line class="qt-mui" x1="125" y1="43" x2="125" y2="67" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="71" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="93" text-anchor="start">Chia tỉ lệ đóng góp cho đủ 100%</text>
<line class="qt-mui" x1="125" y1="104" x2="125" y2="128" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#lap-sa"><title>Quay về B·2 · Lập lịch hẹn, gán kỹ thuật viên</title>
<rect class="qt-cong" x="12" y="132" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="154" text-anchor="start">↩ Quay về B·2</text>
<text class="qt-tn" x="24" y="171" text-anchor="start">Lập lịch hẹn, gán kỹ thuật viên</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## HT-06 · Tới nơi nhưng không làm được
{: #ht-06 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-B-Hien-Truong.html#hien-truong">B·3 · Làm việc tại nhà khách hàng</a></td></tr>
<tr><th>Dấu hiệu</th><td>Khách vắng nhà, thiếu vật tư, hoặc cần khảo sát lại.</td></tr>
<tr><th>Nguyên nhân</th><td>Buổi làm việc không hoàn thành, cần ghi nhận đúng để lập buổi khác.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên · Điều phối</td></tr>
</table>
<p class="qt-canh-bao">⚠️ Không mở lại lịch cũ từ Cannot Complete: thao tác đó xoá dữ liệu check-in.</p>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-ht-06 qt-d-the-ht-06">
<title id="qt-t-the-ht-06">Các bước gỡ tình huống HT-06</title>
<desc id="qt-d-the-ht-06">Các bước xử lý tình huống HT-06: Tới nơi nhưng không làm được</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Chuyển lịch hẹn sang Cannot</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">Complete, ghi lý do</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Điều phối lập lịch hẹn</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">mới trên cùng phiếu</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#lap-sa"><title>Quay về B·2 · Lập lịch hẹn, gán kỹ thuật viên</title>
<rect class="qt-cong" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="188" text-anchor="start">↩ Quay về B·2</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">Lập lịch hẹn, gán kỹ thuật viên</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## HT-07 · Báo thiếu ảnh khi hoàn thành lịch hẹn
{: #ht-07 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Gặp ở</th><td><a href="Quy-Trinh-B-Hien-Truong.html#du-dk-sa">B · Đủ điều kiện hoàn thành lịch hẹn?</a></td></tr>
<tr><th>Xử lý ở</th><td><a href="Quy-Trinh-B-Hien-Truong.html#hien-truong">B·3 · Làm việc tại nhà khách hàng</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“no photo attached (Work Type requires Photo)”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Loại việc của phiếu bắt buộc đính kèm ảnh hiện trường.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-ht-07 qt-d-the-ht-07">
<title id="qt-t-the-ht-07">Các bước gỡ tình huống HT-07</title>
<desc id="qt-d-the-ht-07">Các bước xử lý tình huống HT-07: Báo thiếu ảnh khi hoàn thành lịch hẹn</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Chụp và đính kèm</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">ảnh vào lịch hẹn</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Hoàn thành lại lịch hẹn</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#hoan-thanh-sa"><title>Quay về B·4 · Hoàn thành lịch hẹn</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về B·4</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Hoàn thành lịch hẹn</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## HT-08 · Báo chưa có giờ bắt đầu thực tế
{: #ht-08 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Gặp ở</th><td><a href="Quy-Trinh-B-Hien-Truong.html#du-dk-sa">B · Đủ điều kiện hoàn thành lịch hẹn?</a></td></tr>
<tr><th>Xử lý ở</th><td><a href="Quy-Trinh-B-Hien-Truong.html#hien-truong">B·3 · Làm việc tại nhà khách hàng</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“Cannot complete: no Actual Start”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Lịch hẹn chưa từng được bắt đầu trên ứng dụng.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-ht-08 qt-d-the-ht-08">
<title id="qt-t-the-ht-08">Các bước gỡ tình huống HT-08</title>
<desc id="qt-d-the-ht-08">Các bước xử lý tình huống HT-08: Báo chưa có giờ bắt đầu thực tế</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Chọn Bắt đầu di chuyển để lịch</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">sang In Progress</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Hoàn thành lại lịch hẹn</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#hoan-thanh-sa"><title>Quay về B·4 · Hoàn thành lịch hẹn</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về B·4</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Hoàn thành lịch hẹn</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## HT-09 · Báo còn người chưa check-out
{: #ht-09 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-B-Hien-Truong.html#du-dk-sa">B · Đủ điều kiện hoàn thành lịch hẹn?</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“all resources must be Checked-out or Canceled. Pending: …”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Còn kỹ thuật viên trong lịch hẹn chưa check-out.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên · Điều phối</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 234" width="470" height="234" role="img" aria-labelledby="qt-t-the-ht-09 qt-d-the-ht-09">
<title id="qt-t-the-ht-09">Các bước gỡ tình huống HT-09</title>
<desc id="qt-d-the-ht-09">Các bước xử lý tình huống HT-09: Báo còn người chưa check-out</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="234"/>
<polygon class="qt-re" points="12,35 37,10 213,10 238,35 213,60 37,60"/>
<text class="qt-tb2" x="125" y="31" text-anchor="middle">Người đó có tham gia</text>
<text class="qt-tb2" x="125" y="48" text-anchor="middle">buổi làm việc?</text>
<rect class="qt-trang" x="292" y="1.5" width="166" height="67" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="23.5" text-anchor="start">Điều phối loại</text>
<text class="qt-tn" x="303" y="40.5" text-anchor="start">khỏi lịch, chia lại</text>
<text class="qt-tn" x="303" y="57.5" text-anchor="start">tỉ lệ đóng góp</text>
<line class="qt-mui" x1="238" y1="35" x2="288" y2="35" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="29" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="77" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="92.5" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="96.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="118.5" text-anchor="start">Người đó check-out</text>
<text class="qt-tn" x="24" y="135.5" text-anchor="start">trên ứng dụng</text>
<line class="qt-mui" x1="125" y1="146.5" x2="125" y2="170.5" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,68.5 375,199.5 242,199.5" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#hoan-thanh-sa"><title>Quay về B·4 · Hoàn thành lịch hẹn</title>
<rect class="qt-cong" x="12" y="174.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="196.5" text-anchor="start">↩ Quay về B·4</text>
<text class="qt-tn" x="24" y="213.5" text-anchor="start">Hoàn thành lịch hẹn</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## HT-10 · Cần sửa lịch hẹn đã hoàn tất
{: #ht-10 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-B-Hien-Truong.html#hoan-thanh-sa">B·4 · Hoàn thành lịch hẹn</a></td></tr>
<tr><th>Dấu hiệu</th><td>Phát hiện làm thiếu hoặc khai sai sau khi lịch hẹn đã Completed.</td></tr>
<tr><th>Nguyên nhân</th><td>Lịch hẹn đã hoàn tất bị khoá; phải chuyển trạng thái để sửa.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên · Điều phối</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 287" width="470" height="287" role="img" aria-labelledby="qt-t-the-ht-10 qt-d-the-ht-10">
<title id="qt-t-the-ht-10">Các bước gỡ tình huống HT-10</title>
<desc id="qt-d-the-ht-10">Các bước xử lý tình huống HT-10: Cần sửa lịch hẹn đã hoàn tất</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="287"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Chuyển lịch hẹn từ Completed</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">về In Progress</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Bổ sung phần còn thiếu,</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">dữ liệu cũ giữ nguyên</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="166" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="188" text-anchor="start">Hoàn thành lại</text>
<line class="qt-mui" x1="125" y1="199" x2="125" y2="223" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#hoan-thanh-sa"><title>Quay về B·4 · Hoàn thành lịch hẹn</title>
<rect class="qt-cong" x="12" y="227" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="249" text-anchor="start">↩ Quay về B·4</text>
<text class="qt-tn" x="24" y="266" text-anchor="start">Hoàn thành lịch hẹn</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## HT-11 · Phiếu công việc không hoàn thành được
{: #ht-11 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Gặp ở</th><td><a href="Quy-Trinh-B-Hien-Truong.html#hoan-thanh-wo">B·5 · Hoàn thành phiếu công việc</a></td></tr>
<tr><th>Xử lý ở</th><td><a href="Quy-Trinh-B-Hien-Truong.html#du-dk-wo">B · Phiếu công việc đủ sáu điều kiện?</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“Không thể hoàn thành WO - …”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Còn thiếu một trong sáu điều kiện. Phổ biến nhất là chứng từ tiền: đơn còn nợ, tiền mặt chưa nộp, hoặc đơn chưa hoàn tất.</td></tr>
<tr><th>Ai xử lý</th><td>Kỹ thuật viên · Kế toán</td></tr>
</table>
<p class="qt-lien-quan">Liên quan: <a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-08">TT-08</a> · <a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-09">TT-09</a> · <a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-13">TT-13</a> · <a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-15">TT-15</a></p>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 312" width="470" height="312" role="img" aria-labelledby="qt-t-the-ht-11 qt-d-the-ht-11">
<title id="qt-t-the-ht-11">Các bước gỡ tình huống HT-11</title>
<desc id="qt-d-the-ht-11">Các bước xử lý tình huống HT-11: Phiếu công việc không hoàn thành được</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="312"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Bấm hoàn thành thủ</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">công để đọc lý do</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<polygon class="qt-re" points="12,113 37,88 213,88 238,113 213,138 37,138"/>
<text class="qt-tb2" x="125" y="109" text-anchor="middle">Lý do nói về đơn, thu</text>
<text class="qt-tb2" x="125" y="126" text-anchor="middle">tiền hoặc nộp tiền?</text>
<rect class="qt-trang" x="292" y="79.5" width="166" height="67" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="101.5" text-anchor="start">Bổ sung lịch hẹn,</text>
<text class="qt-tn" x="303" y="118.5" text-anchor="start">bước công việc</text>
<text class="qt-tn" x="303" y="135.5" text-anchor="start">hoặc ảnh còn thiếu</text>
<line class="qt-mui" x1="238" y1="113" x2="288" y2="113" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="107" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="155" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="170.5" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="174.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="196.5" text-anchor="start">Mở thẻ tương ứng TT-08,</text>
<text class="qt-tn" x="24" y="213.5" text-anchor="start">TT-09, TT-13, TT-15</text>
<line class="qt-mui" x1="125" y1="224.5" x2="125" y2="248.5" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,146.5 375,277.5 242,277.5" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#hoan-thanh-wo"><title>Quay về B·5 · Hoàn thành phiếu công việc</title>
<rect class="qt-cong" x="12" y="252.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="274.5" text-anchor="start">↩ Quay về B·5</text>
<text class="qt-tn" x="24" y="291.5" text-anchor="start">Hoàn thành phiếu công việc</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## HT-12 · Đủ điều kiện nhưng tác vụ tự động vẫn bỏ qua
{: #ht-12 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-B-Hien-Truong.html#hoan-thanh-wo">B·5 · Hoàn thành phiếu công việc</a></td></tr>
<tr><th>Nguyên nhân</th><td>Phiếu đang On Hold, hoặc chưa hết thời gian ân hạn tính từ lịch hẹn cuối.</td></tr>
<tr><th>Ai xử lý</th><td>Điều phối</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 215" width="470" height="215" role="img" aria-labelledby="qt-t-the-ht-12 qt-d-the-ht-12">
<title id="qt-t-the-ht-12">Các bước gỡ tình huống HT-12</title>
<desc id="qt-d-the-ht-12">Các bước xử lý tình huống HT-12: Đủ điều kiện nhưng tác vụ tự động vẫn bỏ qua</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="215"/>
<polygon class="qt-re" points="12,33 35,10 215,10 238,33 215,56 35,56"/>
<text class="qt-tb2" x="125" y="37.5" text-anchor="middle">Phiếu đang On Hold?</text>
<rect class="qt-trang" x="292" y="-0.5" width="166" height="67" rx="10" ry="10"/>
<text class="qt-tn" x="303" y="21.5" text-anchor="start">Chờ đủ số ngày</text>
<text class="qt-tn" x="303" y="38.5" text-anchor="start">ân hạn, hoặc hoàn</text>
<text class="qt-tn" x="303" y="55.5" text-anchor="start">thành thủ công</text>
<line class="qt-mui" x1="238" y1="33" x2="288" y2="33" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="265" y="27" text-anchor="middle">không</text>
<text class="qt-nhan" x="133" y="73" text-anchor="start">có</text>
<line class="qt-mui" x1="125" y1="56" x2="125" y2="90.5" marker-end="url(#qt-ah)"/>
<rect class="qt-ok" x="12" y="94.5" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="116.5" text-anchor="start">Chuyển phiếu về In Progress</text>
<line class="qt-mui" x1="125" y1="127.5" x2="125" y2="151.5" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="375,66.5 375,180.5 242,180.5" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#hoan-thanh-wo"><title>Quay về B·5 · Hoàn thành phiếu công việc</title>
<rect class="qt-cong" x="12" y="155.5" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="177.5" text-anchor="start">↩ Quay về B·5</text>
<text class="qt-tn" x="24" y="194.5" text-anchor="start">Hoàn thành phiếu công việc</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## HT-13 · Báo phiếu công việc không có lịch hẹn nào
{: #ht-13 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-B-Hien-Truong.html#hoan-thanh-wo">B·5 · Hoàn thành phiếu công việc</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“Work Order has no Service Appointments”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Điều kiện yêu cầu tối thiểu một lịch hẹn đang bật.</td></tr>
<tr><th>Ai xử lý</th><td>Điều phối</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 209" width="470" height="209" role="img" aria-labelledby="qt-t-the-ht-13 qt-d-the-ht-13">
<title id="qt-t-the-ht-13">Các bước gỡ tình huống HT-13</title>
<desc id="qt-d-the-ht-13">Các bước xử lý tình huống HT-13: Báo phiếu công việc không có lịch hẹn nào</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="209"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Lập một lịch hẹn phản</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">ánh đúng việc đã làm</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Hoàn thành lịch hẹn đó</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#hoan-thanh-wo"><title>Quay về B·5 · Hoàn thành phiếu công việc</title>
<rect class="qt-cong" x="12" y="149" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="171" text-anchor="start">↩ Quay về B·5</text>
<text class="qt-tn" x="24" y="188" text-anchor="start">Hoàn thành phiếu công việc</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## HT-14 · Mở lại lịch hẹn làm mất dữ liệu check-in
{: #ht-14 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-B-Hien-Truong.html#dong-mo">B · Mở lại, đổi lịch và huỷ</a></td></tr>
<tr><th>Nguyên nhân</th><td>Mở lại từ Canceled hoặc Cannot Complete sẽ xoá toàn bộ dữ liệu thực tế của buổi đó.</td></tr>
<tr><th>Ai xử lý</th><td>Điều phối</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 226" width="470" height="226" role="img" aria-labelledby="qt-t-the-ht-14 qt-d-the-ht-14">
<title id="qt-t-the-ht-14">Các bước gỡ tình huống HT-14</title>
<desc id="qt-d-the-ht-14">Các bước xử lý tình huống HT-14: Mở lại lịch hẹn làm mất dữ liệu check-in</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="226"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Không mở lại lịch đã huỷ hoặc</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">không làm được</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Lập lịch hẹn mới</text>
<text class="qt-tn" x="24" y="127" text-anchor="start">trên cùng phiếu</text>
<line class="qt-mui" x1="125" y1="138" x2="125" y2="162" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#lap-sa"><title>Quay về B·2 · Lập lịch hẹn, gán kỹ thuật viên</title>
<rect class="qt-cong" x="12" y="166" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="188" text-anchor="start">↩ Quay về B·2</text>
<text class="qt-tn" x="24" y="205" text-anchor="start">Lập lịch hẹn, gán kỹ thuật viên</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---

## HT-15 · Không huỷ được lịch hẹn, phiếu công việc hoặc đơn
{: #ht-15 }

<div class="qt-the-khung">
<div class="qt-the-tt">
<table class="qt-the-bang">
<tr><th>Ở bước</th><td><a href="Quy-Trinh-B-Hien-Truong.html#dong-mo">B · Mở lại, đổi lịch và huỷ</a></td></tr>
<tr><th>Thông báo</th><td><span class="qt-thong-bao">“Cannot hủy Service Appointment when in status … Change status first.”</span></td></tr>
<tr><th>Nguyên nhân</th><td>Các chứng từ khoá lẫn nhau: đơn còn phiếu công việc, phiếu còn lịch hẹn, hoặc lịch đang ở trạng thái khoá.</td></tr>
<tr><th>Ai xử lý</th><td>Điều phối</td></tr>
</table>
</div>
<div class="qt-the-sd qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 470 331" width="470" height="331" role="img" aria-labelledby="qt-t-the-ht-15 qt-d-the-ht-15">
<title id="qt-t-the-ht-15">Các bước gỡ tình huống HT-15</title>
<desc id="qt-d-the-ht-15">Các bước xử lý tình huống HT-15: Không huỷ được lịch hẹn, phiếu công việc hoặc đơn</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="470" height="331"/>
<rect class="qt-trang" x="12" y="10" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="32" text-anchor="start">Chuyển lịch hẹn khỏi</text>
<text class="qt-tn" x="24" y="49" text-anchor="start">trạng thái khoá</text>
<line class="qt-mui" x1="125" y1="60" x2="125" y2="84" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="88" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="110" text-anchor="start">Huỷ lịch hẹn, nhập lý do</text>
<line class="qt-mui" x1="125" y1="121" x2="125" y2="145" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="149" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="171" text-anchor="start">Huỷ phiếu công việc</text>
<line class="qt-mui" x1="125" y1="182" x2="125" y2="206" marker-end="url(#qt-ah)"/>
<rect class="qt-trang" x="12" y="210" width="226" height="33" rx="10" ry="10"/>
<text class="qt-tn" x="24" y="232" text-anchor="start">Huỷ đơn nếu cần</text>
<line class="qt-mui" x1="125" y1="243" x2="125" y2="267" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#dong-mo"><title>Quay về B · Mở lại, đổi lịch và huỷ</title>
<rect class="qt-cong" x="12" y="271" width="226" height="50" rx="10" ry="10"/>
<text class="qt-tb2" x="24" y="293" text-anchor="start">↩ Quay về B</text>
<text class="qt-tn" x="24" y="310" text-anchor="start">Mở lại, đổi lịch và huỷ</text>
</a>
</svg>
</div>
</div>

[↑ Danh mục thẻ](#danh-muc)
{: .fs-2 }

---
