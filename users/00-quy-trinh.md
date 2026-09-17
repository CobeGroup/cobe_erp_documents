---
title: Quy trình hợp nhất
layout: default
nav_order: 1.8
has_children: true
---

<!-- Trang sinh tự động bởi _tools/quy_trinh/build.py từ _quy_trinh/. Sửa tệp dữ liệu rồi chạy lại bộ sinh; sửa thẳng trang này sẽ bị ghi đè. -->

# Quy trình hợp nhất
{: .no_toc }

Toàn bộ dây chuyền, từ lúc khách hàng để lại số điện thoại cho tới lúc được chăm sóc định kỳ nhiều năm sau — chia thành **năm phân khu**, đọc theo **ba tầng**.
{: .fs-4 }

| Tầng | Là gì | Mở bằng cách |
|---|---|---|
| **0 · Bản đồ tổng** | Năm phân khu trên một trang, chỉ có luồng chính và các điểm rẽ quan trọng | Trang này |
| **1 · Sơ đồ phân khu** | Mọi bước và điểm rẽ trong một phân khu; ngoại lệ được gập thành nhãn ⚠ | Bấm tên phân khu ở đầu làn |
| **2 · Thẻ tình huống** | Dấu hiệu, nguyên nhân, các bước gỡ, gỡ xong quay về đâu | Bấm nhãn ⚠ trên sơ đồ phân khu |

---

## Bản đồ tổng
{: #ban-do }

<div class="qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 760 1217" width="760" height="1217" role="img" aria-labelledby="qt-t-ban-do qt-d-ban-do">
<title id="qt-t-ban-do">Bản đồ tổng của quy trình hợp nhất</title>
<desc id="qt-d-ban-do">Năm làn dọc là năm phân khu: bán hàng, điều phối và hiện trường, kho và giao nhận, thu tiền và kế toán, sau bán hàng. Luồng chính chạy từ tiếp nhận khách hàng, lập đơn, điều phối, cấp vật tư, làm việc tại nhà khách, giao hàng, thu tiền, nộp tiền, hoá đơn, rồi sang nhắc bảo dưỡng; khách đồng ý thì quay lại lập đơn mới. Sự cố là đầu vào thứ hai, cần đến tận nơi thì đi vào điều phối.</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="760" height="1217"/>
<rect class="qt-lan-nen0" x="30" y="12" width="144" height="1195"/>
<a href="Quy-Trinh-01-Khach-Hang.html"><title>Mở sơ đồ phân khu A · Bán hàng</title>
<rect class="qt-a" x="36" y="20" width="132" height="62" rx="8" ry="8"/>
<text class="qt-lan-nho" x="102" y="36" text-anchor="middle">PHÂN KHU A</text>
<text class="qt-tb2" x="102" y="61" text-anchor="middle">Bán hàng</text>
</a>
<rect class="qt-lan-nen1" x="174" y="12" width="144" height="1195"/>
<a href="Quy-Trinh-03-Hien-Truong.html"><title>Mở sơ đồ phân khu B · Điều phối và hiện trường</title>
<rect class="qt-b" x="180" y="20" width="132" height="62" rx="8" ry="8"/>
<text class="qt-lan-nho" x="246" y="36" text-anchor="middle">PHÂN KHU B</text>
<text class="qt-tb2" x="246" y="54" text-anchor="middle">Điều phối và</text>
<text class="qt-tb2" x="246" y="69" text-anchor="middle">hiện trường</text>
</a>
<rect class="qt-lan-nen0" x="318" y="12" width="144" height="1195"/>
<a href="Quy-Trinh-04-Vat-Tu.html"><title>Mở sơ đồ phân khu C · Kho và giao nhận</title>
<rect class="qt-c" x="324" y="20" width="132" height="62" rx="8" ry="8"/>
<text class="qt-lan-nho" x="390" y="36" text-anchor="middle">PHÂN KHU C</text>
<text class="qt-tb2" x="390" y="61" text-anchor="middle">Kho và giao nhận</text>
</a>
<rect class="qt-lan-nen1" x="462" y="12" width="144" height="1195"/>
<a href="Quy-Trinh-D-Thu-Tien.html"><title>Mở sơ đồ phân khu D · Thu tiền và kế toán</title>
<rect class="qt-d" x="468" y="20" width="132" height="62" rx="8" ry="8"/>
<text class="qt-lan-nho" x="534" y="36" text-anchor="middle">PHÂN KHU D</text>
<text class="qt-tb2" x="534" y="54" text-anchor="middle">Thu tiền</text>
<text class="qt-tb2" x="534" y="69" text-anchor="middle">và kế toán</text>
</a>
<rect class="qt-lan-nen0" x="606" y="12" width="144" height="1195"/>
<a href="Quy-Trinh-06-Bao-Duong.html"><title>Mở sơ đồ phân khu E · Sau bán hàng</title>
<rect class="qt-e" x="612" y="20" width="132" height="62" rx="8" ry="8"/>
<text class="qt-lan-nho" x="678" y="36" text-anchor="middle">PHÂN KHU E</text>
<text class="qt-tb2" x="678" y="61" text-anchor="middle">Sau bán hàng</text>
</a>
<a href="Quy-Trinh-01-Khach-Hang.html#nguon"><title>Tiếp nhận khách hàng</title>
<rect class="qt-a" x="40" y="89" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="102" y="115" text-anchor="middle">Tiếp nhận</text>
<text class="qt-tb3" x="102" y="130" text-anchor="middle">khách hàng</text>
</a>
<circle class="qt-canh" cx="162" cy="90" r="8"/>
<text class="qt-canh-chu" x="162" y="94.5" text-anchor="middle">!</text>
<a href="Quy-Trinh-02-Don-Hang.html#khai-don"><title>Lập đơn bán hàng</title>
<rect class="qt-a" x="40" y="173" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="102" y="199" text-anchor="middle">Lập đơn</text>
<text class="qt-tb3" x="102" y="214" text-anchor="middle">bán hàng</text>
</a>
<circle class="qt-canh" cx="162" cy="174" r="8"/>
<text class="qt-canh-chu" x="162" y="178.5" text-anchor="middle">!</text>
<a href="Quy-Trinh-02-Don-Hang.html#ban-giao"><title>Cần đến nhà khách?</title>
<polygon class="qt-re" points="34,286 63,257 141,257 170,286 141,315 63,315"/>
<text class="qt-tb3" x="102" y="283" text-anchor="middle">Cần đến</text>
<text class="qt-tb3" x="102" y="298" text-anchor="middle">nhà khách?</text>
</a>
<a href="Quy-Trinh-05-Giao-Hang-Thu-Tien.html#van-chuyen"><title>Giao thẳng hoặc gửi đơn vị vận chuyển</title>
<rect class="qt-cong" x="40" y="341" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="102" y="359.5" text-anchor="middle">Giao thẳng</text>
<text class="qt-tb3" x="102" y="374.5" text-anchor="middle">hoặc gửi đơn</text>
<text class="qt-tb3" x="102" y="389.5" text-anchor="middle">vị vận chuyển</text>
</a>
<a href="Quy-Trinh-07-Su-Co.html#tiep-nhan"><title>Khách hàng báo hỏng</title>
<rect class="qt-e" x="616" y="89" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="678" y="115" text-anchor="middle">Khách hàng</text>
<text class="qt-tb3" x="678" y="130" text-anchor="middle">báo hỏng</text>
</a>
<circle class="qt-canh" cx="738" cy="90" r="8"/>
<text class="qt-canh-chu" x="738" y="94.5" text-anchor="middle">!</text>
<a href="Quy-Trinh-07-Su-Co.html#hai-duong"><title>Cần đến tận nơi?</title>
<polygon class="qt-re" points="610,202 639,173 717,173 746,202 717,231 639,231"/>
<text class="qt-tb3" x="678" y="199" text-anchor="middle">Cần đến</text>
<text class="qt-tb3" x="678" y="214" text-anchor="middle">tận nơi?</text>
</a>
<a href="Quy-Trinh-07-Su-Co.html#hai-duong"><title>Hướng dẫn qua điện thoại, đóng phiếu</title>
<rect class="qt-e" x="616" y="257" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="678" y="275.5" text-anchor="middle">Hướng dẫn qua</text>
<text class="qt-tb3" x="678" y="290.5" text-anchor="middle">điện thoại,</text>
<text class="qt-tb3" x="678" y="305.5" text-anchor="middle">đóng phiếu</text>
</a>
<a href="Quy-Trinh-03-Hien-Truong.html#lap-wo"><title>Lập phiếu công việc và lịch hẹn</title>
<rect class="qt-b" x="184" y="341" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="246" y="367" text-anchor="middle">Lập phiếu công</text>
<text class="qt-tb3" x="246" y="382" text-anchor="middle">việc và lịch hẹn</text>
</a>
<circle class="qt-canh" cx="306" cy="342" r="8"/>
<text class="qt-canh-chu" x="306" y="346.5" text-anchor="middle">!</text>
<a href="Quy-Trinh-04-Vat-Tu.html#yeu-cau"><title>Cấp vật tư cho kỹ thuật viên</title>
<rect class="qt-c" x="328" y="425" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="390" y="451" text-anchor="middle">Cấp vật tư cho</text>
<text class="qt-tb3" x="390" y="466" text-anchor="middle">kỹ thuật viên</text>
</a>
<circle class="qt-canh" cx="450" cy="426" r="8"/>
<text class="qt-canh-chu" x="450" y="430.5" text-anchor="middle">!</text>
<a href="Quy-Trinh-03-Hien-Truong.html#hien-truong"><title>Làm việc tại nhà khách hàng</title>
<rect class="qt-b" x="184" y="509" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="246" y="535" text-anchor="middle">Làm việc tại</text>
<text class="qt-tb3" x="246" y="550" text-anchor="middle">nhà khách hàng</text>
</a>
<circle class="qt-canh" cx="306" cy="510" r="8"/>
<text class="qt-canh-chu" x="306" y="514.5" text-anchor="middle">!</text>
<a href="Quy-Trinh-05-Giao-Hang-Thu-Tien.html#giao-hang"><title>Giao hàng, khách hàng ký nhận</title>
<rect class="qt-c" x="328" y="593" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="390" y="611.5" text-anchor="middle">Giao hàng,</text>
<text class="qt-tb3" x="390" y="626.5" text-anchor="middle">khách hàng</text>
<text class="qt-tb3" x="390" y="641.5" text-anchor="middle">ký nhận</text>
</a>
<circle class="qt-canh" cx="450" cy="594" r="8"/>
<text class="qt-canh-chu" x="450" y="598.5" text-anchor="middle">!</text>
<a href="Quy-Trinh-04-Vat-Tu.html#tra-ve"><title>Trả phần không giao về kho</title>
<rect class="qt-c" x="328" y="677" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="390" y="703" text-anchor="middle">Trả phần không</text>
<text class="qt-tb3" x="390" y="718" text-anchor="middle">giao về kho</text>
</a>
<circle class="qt-canh" cx="450" cy="678" r="8"/>
<text class="qt-canh-chu" x="450" y="682.5" text-anchor="middle">!</text>
<a href="Quy-Trinh-D-Thu-Tien.html#hinh-thuc"><title>Thu tiền tại nhà khách hàng</title>
<rect class="qt-d" x="472" y="677" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="534" y="703" text-anchor="middle">Thu tiền tại</text>
<text class="qt-tb3" x="534" y="718" text-anchor="middle">nhà khách hàng</text>
</a>
<circle class="qt-canh" cx="594" cy="678" r="8"/>
<text class="qt-canh-chu" x="594" y="682.5" text-anchor="middle">!</text>
<a href="Quy-Trinh-D-Thu-Tien.html#tien-mat"><title>Nộp tiền mặt về công ty</title>
<rect class="qt-d" x="472" y="761" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="534" y="787" text-anchor="middle">Nộp tiền mặt</text>
<text class="qt-tb3" x="534" y="802" text-anchor="middle">về công ty</text>
</a>
<circle class="qt-canh" cx="594" cy="762" r="8"/>
<text class="qt-canh-chu" x="594" y="766.5" text-anchor="middle">!</text>
<a href="Quy-Trinh-D-Thu-Tien.html#hoa-don"><title>Hoá đơn, đơn hoàn tất</title>
<rect class="qt-d" x="472" y="845" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="534" y="871" text-anchor="middle">Hoá đơn, đơn</text>
<text class="qt-tb3" x="534" y="886" text-anchor="middle">hoàn tất</text>
</a>
<circle class="qt-canh" cx="594" cy="846" r="8"/>
<text class="qt-canh-chu" x="594" y="850.5" text-anchor="middle">!</text>
<a href="Quy-Trinh-06-Bao-Duong.html#phieu-nhac"><title>Nhắc bảo dưỡng đến kỳ</title>
<rect class="qt-e" x="616" y="929" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="678" y="955" text-anchor="middle">Nhắc bảo</text>
<text class="qt-tb3" x="678" y="970" text-anchor="middle">dưỡng đến kỳ</text>
</a>
<circle class="qt-canh" cx="738" cy="930" r="8"/>
<text class="qt-canh-chu" x="738" y="934.5" text-anchor="middle">!</text>
<a href="Quy-Trinh-06-Bao-Duong.html#lien-he"><title>Khách hàng đồng ý?</title>
<polygon class="qt-re" points="610,1042 639,1013 717,1013 746,1042 717,1071 639,1071"/>
<text class="qt-tb3" x="678" y="1039" text-anchor="middle">Khách hàng</text>
<text class="qt-tb3" x="678" y="1054" text-anchor="middle">đồng ý?</text>
</a>
<a href="Quy-Trinh-06-Bao-Duong.html#lien-he"><title>Hẹn lại hoặc ngừng nhắc</title>
<rect class="qt-e" x="616" y="1097" width="124" height="58" rx="10" ry="10"/>
<text class="qt-tb3" x="678" y="1123" text-anchor="middle">Hẹn lại hoặc</text>
<text class="qt-tb3" x="678" y="1138" text-anchor="middle">ngừng nhắc</text>
</a>
<line class="qt-mui" x1="102" y1="147" x2="102" y2="169" marker-end="url(#qt-ah)"/>
<line class="qt-mui" x1="102" y1="231" x2="102" y2="253" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="170,286 246,286 246,337" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="178" y="279" text-anchor="start">có</text>
<line class="qt-mui" x1="102" y1="315" x2="102" y2="337" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="110" y="331" text-anchor="start">không</text>
<line class="qt-mui" x1="678" y1="147" x2="678" y2="169" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="610,202 278,202 278,337" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="602" y="195" text-anchor="end">có</text>
<line class="qt-mui" x1="678" y1="231" x2="678" y2="253" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="686" y="247" text-anchor="start">không</text>
<polyline class="qt-mui" points="246,399 246,454 324,454" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="390,483 390,538 312,538" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="246,567 246,622 324,622" marker-end="url(#qt-ah)"/>
<line class="qt-mui" x1="390" y1="651" x2="390" y2="673" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="382" y="667" text-anchor="end">phần không giao</text>
<polyline class="qt-mui" points="452,622 534,622 534,673" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="460" y="615" text-anchor="start">phần đã giao</text>
<line class="qt-mui" x1="534" y1="735" x2="534" y2="757" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="542" y="751" text-anchor="start">tiền mặt</text>
<line class="qt-mui" x1="534" y1="819" x2="534" y2="841" marker-end="url(#qt-ah)"/>
<polyline class="qt-mui" points="596,706 614,706 614,874 600,874" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="620" y="794" text-anchor="start">chuyển khoản</text>
<polyline class="qt-mui" points="534,903 534,958 612,958" marker-end="url(#qt-ah)"/>
<line class="qt-mui" x1="678" y1="987" x2="678" y2="1009" marker-end="url(#qt-ah)"/>
<line class="qt-mui" x1="678" y1="1071" x2="678" y2="1093" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="686" y="1087" text-anchor="start">không</text>
<polyline class="qt-vong" points="610,1042 594,1042 594,1183 14,1183 14,202 36,202" marker-end="url(#qt-ag)"/>
<text class="qt-vong-chu" x="304" y="1175" text-anchor="middle">có — lập đơn mới</text>
</svg>
</div>

<p class="qt-chu-giai"><span class="qt-k qt-k-buoc"></span> bước <span class="qt-k qt-k-re"></span> điểm rẽ <span class="qt-k qt-k-canh"></span> có tình huống rẽ nhánh <span class="qt-k qt-k-cong"></span> sang phân khu khác<br>👆 Bấm vào bất kỳ ô nào để mở phần giải thích.</p>

---

## Năm phân khu
{: #phan-khu }

| Phân khu | Phạm vi | Ai làm |
|---|---|---|
| A · Bán hàng <br><small>đang chuyển — tạm xem [bản cũ](Quy-Trinh-01-Khach-Hang.html)</small> | Tiếp nhận khách hàng, khai người giới thiệu, lập đơn, sửa, đóng và huỷ đơn | Kinh doanh · Chăm sóc khách hàng |
| B · Điều phối và hiện trường <br><small>đang chuyển — tạm xem [bản cũ](Quy-Trinh-03-Hien-Truong.html)</small> | Phiếu công việc, lịch hẹn, thao tác tại nhà khách hàng, hoàn thành phiếu | Điều phối · Kỹ thuật viên |
| C · Kho và giao nhận <br><small>đang chuyển — tạm xem [bản cũ](Quy-Trinh-04-Vat-Tu.html)</small> | Cấp vật tư, giao hàng, trả vật tư về kho, gửi qua đơn vị vận chuyển | Kho · Kỹ thuật viên |
| **[D · Thu tiền và kế toán](Quy-Trinh-D-Thu-Tien.html)** | Tiền mặt, chuyển khoản, nộp tiền, hoá đơn, huỷ phiếu thu, trả hàng sau bán | Kỹ thuật viên · Kế toán |
| E · Sau bán hàng <br><small>đang chuyển — tạm xem [bản cũ](Quy-Trinh-06-Bao-Duong.html)</small> | Nhắc bảo dưỡng định kỳ, tiếp nhận và xử lý sự cố | Nhân viên dịch vụ · Nhân viên sự cố |

---

## Trang khác
{: #trang-khac }

| Bạn cần | Mở trang |
|---|---|
| Đi theo một đơn hàng cụ thể từ đầu đến cuối | [Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html) |
| Tra tên chứng từ, ai làm trên màn hình nào | [Tổng quan toàn chuỗi](Quy-Trinh-Tong-Quan.html) |
| Tài liệu theo chặng (đang chuyển sang phân khu) | [Các chặng — bản cũ](Quy-Trinh-Ban-Cu.html) |

## Quy ước
{: #quy-uoc }

| Ký hiệu | Nghĩa |
|---|---|
| `Sales Order` | Tên chứng từ trên hệ thống — gõ tên này vào ô tìm kiếm mới ra đúng |
| `D·3a` | Phân khu D, bước 3, nhánh a |
| `TT-05` | Mã thẻ tình huống; hai chữ cái đầu cho biết phân khu |
| ⛔ · ⚠️ · ✅ | Hệ thống chặn · dễ sai, cần đọc kỹ · cách làm đúng |
