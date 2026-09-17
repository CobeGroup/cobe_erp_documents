---
title: D · Thu tiền và kế toán
layout: default
parent: Quy trình hợp nhất
nav_order: 40
has_children: true
---

<!-- Trang sinh tự động bởi _tools/quy_trinh/build.py từ _quy_trinh/. Sửa tệp dữ liệu rồi chạy lại bộ sinh; sửa thẳng trang này sẽ bị ghi đè. -->

# Phân khu D — Thu tiền và kế toán
{: .no_toc }

**Ai làm:** Kỹ thuật viên · Kế toán · Kinh doanh
{: .fs-3 .text-grey-dk-000 }

Từ lúc khách hàng đã nhận hàng cho tới lúc đơn được thu đủ, có hoá đơn và chuyển sang Hoàn tất. Hai hình thức thanh toán đi theo hai đường xử lý khác nhau; khách hàng trả bằng cả hai thì đi cả hai đường.

| Nhận vào | Bàn giao ra |
|---|---|
| ▶ [C · Kho và giao nhận](Quy-Trinh-05-Giao-Hang-Thu-Tien.html#giao-hang) — Đã lập phiếu giao hàng | ◀ [B · Điều phối và hiện trường](Quy-Trinh-03-Hien-Truong.html#dieu-kien) — Phiếu công việc được hoàn thành<br>◀ [E · Sau bán hàng](Quy-Trinh-06-Bao-Duong.html#sinh-lich) — Sinh lịch bảo dưỡng kỳ sau |

👉 **[Các thẻ tình huống của phân khu D](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html)** · [Bản đồ tổng](00-quy-trinh.html)

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ phân khu
{: #so-do }

<div class="qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 760 1526" width="760" height="1526" role="img" aria-labelledby="qt-t-pk-d qt-d-pk-d">
<title id="qt-t-pk-d">Sơ đồ phân khu D — Thu tiền và kế toán</title>
<desc id="qt-d-pk-d">Đường chính của phân khu D, đọc từ trên xuống. Ô chữ nhật là bước, ô sáu cạnh là điểm rẽ, nhãn đỏ là thẻ tình huống, ô viền đứt là cổng sang phân khu khác.</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="760" height="1526"/>
<a href="Quy-Trinh-05-Giao-Hang-Thu-Tien.html#giao-hang"><title>Mở phân khu C</title>
<rect class="qt-cong" x="50" y="20" width="320" height="50" rx="10" ry="10"/>
<text class="qt-tb" x="210" y="41" text-anchor="middle">▶ Từ C · Kho và giao nhận</text>
<text class="qt-ts" x="210" y="59" text-anchor="middle">Đã lập phiếu giao hàng</text>
</a>
<line class="qt-mui" x1="210" y1="70" x2="210" y2="96" marker-end="url(#qt-ah)"/>
<a href="#co-phieu-giao"><title>Đơn đã có phiếu giao hàng?</title>
<polygon class="qt-re" points="50,125 75,100 345,100 370,125 345,150 75,150"/>
<text class="qt-tb" x="210" y="130" text-anchor="middle">Đơn đã có phiếu giao hàng?</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-01"><title>Mở thẻ TT-01</title>
<rect class="qt-the" x="420" y="100" width="320" height="50" rx="10" ry="10"/>
<text class="qt-tt" x="434" y="119" text-anchor="start">⚠ TT-01</text>
<text class="qt-ts" x="434" y="136" text-anchor="start">Báo “Chưa tạo phiếu giao hàng” khi thu tiền</text>
</a>
<line class="qt-mui" x1="370" y1="125" x2="416" y2="125" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="395" y="118" text-anchor="middle">chưa</text>
<text class="qt-nhan" x="220" y="168" text-anchor="start">có</text>
<line class="qt-mui" x1="210" y1="150" x2="210" y2="176" marker-end="url(#qt-ah)"/>
<a href="#mo-thu-tien"><title>D·1 · Mở màn hình thu tiền</title>
<rect class="qt-d" x="50" y="180" width="320" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="204" r="12"/>
<text class="qt-so" x="74" y="208" text-anchor="middle">1</text>
<text class="qt-tb" x="96" y="208" text-anchor="start">Mở màn hình thu tiền</text>
<text class="qt-ts" x="96" y="224" text-anchor="start">Ứng dụng kỹ thuật viên</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-02"><title>Mở thẻ TT-02</title>
<rect class="qt-pill" x="96" y="236" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="126.6" y="250" text-anchor="middle">⚠ TT-02</text>
</a>
<line class="qt-mui" x1="210" y1="268" x2="210" y2="294" marker-end="url(#qt-ah)"/>
<a href="#dong-thu"><title>D·2 · Nhập các dòng thu</title>
<rect class="qt-d" x="50" y="298" width="320" height="104" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="322" r="12"/>
<text class="qt-so" x="74" y="326" text-anchor="middle">2</text>
<text class="qt-tb" x="96" y="326" text-anchor="start">Nhập các dòng thu</text>
<text class="qt-ts" x="96" y="342" text-anchor="start">Mỗi dòng là một đơn, một</text>
<text class="qt-ts" x="96" y="358" text-anchor="start">hình thức, một số tiền</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-03"><title>Mở thẻ TT-03</title>
<rect class="qt-pill" x="96" y="370" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="126.6" y="384" text-anchor="middle">⚠ TT-03</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-04"><title>Mở thẻ TT-04</title>
<rect class="qt-pill" x="165.1" y="370" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="195.7" y="384" text-anchor="middle">⚠ TT-04</text>
</a>
<line class="qt-mui" x1="210" y1="402" x2="210" y2="428" marker-end="url(#qt-ah)"/>
<a href="#hinh-thuc"><title>D·3 · Khách hàng trả bằng hình thức nào?</title>
<polygon class="qt-re" points="20,457 45,432 715,432 740,457 715,482 45,482"/>
<circle class="qt-tron" cx="64" cy="457" r="12"/>
<text class="qt-so" x="64" y="461" text-anchor="middle">3</text>
<text class="qt-tb" x="380" y="462" text-anchor="middle">Khách hàng trả bằng hình thức nào?</text>
</a>
<line class="qt-mui" x1="134.7" y1="482" x2="134.7" y2="508" marker-end="url(#qt-ah)"/>
<a href="#tien-mat"><title>D·3a · Tiền mặt</title>
<rect class="qt-d" x="20" y="512" width="229.3" height="34" rx="17" ry="17"/>
<text class="qt-tb" x="134.7" y="534" text-anchor="middle">3a · Tiền mặt</text>
</a>
<line class="qt-mui" x1="134.7" y1="546" x2="134.7" y2="566" marker-end="url(#qt-ah)"/>
<a href="#tien-mat"><title>D·3a · Tiền mặt</title>
<rect class="qt-trang" x="20" y="570" width="229.3" height="82" rx="10" ry="10"/>
<text class="qt-tb2" x="34" y="594" text-anchor="start">Phiếu thu chính thức ngay</text>
<text class="qt-ts" x="34" y="609" text-anchor="start">Tiền vào tài khoản kỹ thuật viên</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-05"><title>Mở thẻ TT-05</title>
<rect class="qt-pill" x="34" y="620" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="64.6" y="634" text-anchor="middle">⚠ TT-05</text>
</a>
<line class="qt-mui" x1="134.7" y1="652" x2="134.7" y2="672" marker-end="url(#qt-ah)"/>
<a href="#tien-mat"><title>D·3a · Tiền mặt</title>
<rect class="qt-trang" x="20" y="676" width="229.3" height="82" rx="10" ry="10"/>
<text class="qt-tb2" x="34" y="700" text-anchor="start">Lập phiếu nộp từ ứng dụng</text>
<text class="qt-ts" x="34" y="715" text-anchor="start">Chọn đúng khoản thu cần nộp</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-06"><title>Mở thẻ TT-06</title>
<rect class="qt-pill" x="34" y="726" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="64.6" y="740" text-anchor="middle">⚠ TT-06</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-07"><title>Mở thẻ TT-07</title>
<rect class="qt-pill" x="103.1" y="726" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="133.7" y="740" text-anchor="middle">⚠ TT-07</text>
</a>
<line class="qt-mui" x1="134.7" y1="758" x2="134.7" y2="778" marker-end="url(#qt-ah)"/>
<a href="#tien-mat"><title>D·3a · Tiền mặt</title>
<rect class="qt-trang" x="20" y="782" width="229.3" height="82" rx="10" ry="10"/>
<text class="qt-tb2" x="34" y="806" text-anchor="start">Kế toán xác nhận phiếu nộp</text>
<text class="qt-ts" x="34" y="821" text-anchor="start">Công nợ cá nhân về không</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-08"><title>Mở thẻ TT-08</title>
<rect class="qt-pill" x="34" y="832" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="64.6" y="846" text-anchor="middle">⚠ TT-08</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-09"><title>Mở thẻ TT-09</title>
<rect class="qt-pill" x="103.1" y="832" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="133.7" y="846" text-anchor="middle">⚠ TT-09</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-10"><title>Mở thẻ TT-10</title>
<rect class="qt-pill" x="172.3" y="832" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="202.8" y="846" text-anchor="middle">⚠ TT-10</text>
</a>
<line class="qt-mui" x1="380" y1="482" x2="380" y2="508" marker-end="url(#qt-ah)"/>
<a href="#chuyen-khoan"><title>D·3b · Chuyển khoản</title>
<rect class="qt-d" x="265.3" y="512" width="229.3" height="34" rx="17" ry="17"/>
<text class="qt-tb" x="380" y="534" text-anchor="middle">3b · Chuyển khoản</text>
</a>
<line class="qt-mui" x1="380" y1="546" x2="380" y2="566" marker-end="url(#qt-ah)"/>
<a href="#chuyen-khoan"><title>D·3b · Chuyển khoản</title>
<rect class="qt-trang" x="265.3" y="570" width="229.3" height="82" rx="10" ry="10"/>
<text class="qt-tb2" x="279.3" y="594" text-anchor="start">Chọn tài khoản, hiện mã QR</text>
<text class="qt-ts" x="279.3" y="609" text-anchor="start">Mã QR đúng tài khoản và số tiền</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-11"><title>Mở thẻ TT-11</title>
<rect class="qt-pill" x="279.3" y="620" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="309.9" y="634" text-anchor="middle">⚠ TT-11</text>
</a>
<line class="qt-mui" x1="380" y1="652" x2="380" y2="672" marker-end="url(#qt-ah)"/>
<a href="#chuyen-khoan"><title>D·3b · Chuyển khoản</title>
<rect class="qt-trang" x="265.3" y="676" width="229.3" height="82" rx="10" ry="10"/>
<text class="qt-tb2" x="279.3" y="700" text-anchor="start">Phiếu thu ở trạng thái nháp</text>
<text class="qt-ts" x="279.3" y="715" text-anchor="start">Chưa được tính là đã thu</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-12"><title>Mở thẻ TT-12</title>
<rect class="qt-pill" x="279.3" y="726" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="309.9" y="740" text-anchor="middle">⚠ TT-12</text>
</a>
<line class="qt-mui" x1="380" y1="758" x2="380" y2="778" marker-end="url(#qt-ah)"/>
<a href="#chuyen-khoan"><title>D·3b · Chuyển khoản</title>
<rect class="qt-trang" x="265.3" y="782" width="229.3" height="71" rx="10" ry="10"/>
<text class="qt-tb2" x="279.3" y="806" text-anchor="start">Kế toán đối chiếu</text>
<text class="qt-tb2" x="279.3" y="823" text-anchor="start">và xác nhận</text>
<text class="qt-ts" x="279.3" y="838" text-anchor="start">Hoá đơn tự phát sinh ngay</text>
</a>
<line class="qt-mui" x1="625.3" y1="482" x2="625.3" y2="508" marker-end="url(#qt-ah)"/>
<a href="#ca-hai"><title>D·3c · Cả hai hình thức</title>
<rect class="qt-d" x="510.7" y="512" width="229.3" height="34" rx="17" ry="17"/>
<text class="qt-tb" x="625.3" y="534" text-anchor="middle">3c · Cả hai hình thức</text>
</a>
<line class="qt-mui" x1="625.3" y1="546" x2="625.3" y2="566" marker-end="url(#qt-ah)"/>
<a href="#ca-hai"><title>D·3c · Cả hai hình thức</title>
<rect class="qt-trang" x="510.7" y="570" width="229.3" height="86" rx="10" ry="10"/>
<text class="qt-tb2" x="524.7" y="594" text-anchor="start">Lập hai dòng trên</text>
<text class="qt-tb2" x="524.7" y="611" text-anchor="start">cùng một đơn</text>
<text class="qt-ts" x="524.7" y="626" text-anchor="start">Một dòng tiền mặt,</text>
<text class="qt-ts" x="524.7" y="641" text-anchor="start">một dòng chuyển khoản</text>
</a>
<line class="qt-mui" x1="625.3" y1="656" x2="625.3" y2="676" marker-end="url(#qt-ah)"/>
<a href="#ca-hai"><title>D·3c · Cả hai hình thức</title>
<rect class="qt-trang" x="510.7" y="680" width="229.3" height="71" rx="10" ry="10"/>
<text class="qt-tb2" x="524.7" y="704" text-anchor="start">Mỗi phiếu đi theo</text>
<text class="qt-tb2" x="524.7" y="721" text-anchor="start">nhánh riêng</text>
<text class="qt-ts" x="524.7" y="736" text-anchor="start">Như hai nhánh bên trái</text>
</a>
<line class="qt-mui" x1="625.3" y1="751" x2="625.3" y2="771" marker-end="url(#qt-ah)"/>
<a href="#ca-hai"><title>D·3c · Cả hai hình thức</title>
<rect class="qt-trang" x="510.7" y="775" width="229.3" height="71" rx="10" ry="10"/>
<text class="qt-tb2" x="524.7" y="799" text-anchor="start">Đơn đủ khi cả hai</text>
<text class="qt-tb2" x="524.7" y="816" text-anchor="start">phiếu chính thức</text>
<text class="qt-ts" x="524.7" y="831" text-anchor="start">Còn một phiếu nháp là vẫn còn nợ</text>
</a>
<line class="qt-mui" x1="134.7" y1="864" x2="134.7" y2="890" marker-end="url(#qt-ah)"/>
<line class="qt-mui" x1="380" y1="853" x2="380" y2="890" marker-end="url(#qt-ah)"/>
<line class="qt-mui" x1="625.3" y1="846" x2="625.3" y2="890" marker-end="url(#qt-ah)"/>
<a href="#hinh-thuc"><title>D·3 · Khách hàng trả bằng hình thức nào?</title>
<rect class="qt-trang" x="20" y="894" width="720" height="50" rx="10" ry="10"/>
<text class="qt-tb" x="380" y="916" text-anchor="middle">Các phiếu thu đã lập xong</text>
<text class="qt-ts" x="380" y="934" text-anchor="middle">Khách hàng trả làm nhiều lần thì lặp lại từ bước nhập dòng thu</text>
</a>
<line class="qt-mui" x1="210" y1="944" x2="210" y2="970" marker-end="url(#qt-ah)"/>
<a href="#du-tien"><title>Phiếu thu chính thức đã đủ giá trị đơn?</title>
<polygon class="qt-re" points="50,1001 77,974 343,974 370,1001 343,1028 77,1028"/>
<text class="qt-tb" x="210" y="997" text-anchor="middle">Phiếu thu chính thức</text>
<text class="qt-tb" x="210" y="1015" text-anchor="middle">đã đủ giá trị đơn?</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-13"><title>Mở thẻ TT-13</title>
<rect class="qt-the" x="420" y="974" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tt" x="434" y="993" text-anchor="start">⚠ TT-13</text>
<text class="qt-ts" x="434" y="1010" text-anchor="start">Đã thu tiền nhưng đơn vẫn hiện còn nợ</text>
</a>
<line class="qt-mui" x1="370" y1="1001" x2="416" y2="1001" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="395" y="994" text-anchor="middle">chưa</text>
<text class="qt-nhan" x="220" y="1046" text-anchor="start">đủ</text>
<line class="qt-mui" x1="210" y1="1028" x2="210" y2="1054" marker-end="url(#qt-ah)"/>
<a href="#hoa-don"><title>D·4 · Hoá đơn phát sinh</title>
<rect class="qt-d" x="50" y="1058" width="320" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="1082" r="12"/>
<text class="qt-so" x="74" y="1086" text-anchor="middle">4</text>
<text class="qt-tb" x="96" y="1086" text-anchor="start">Hoá đơn phát sinh</text>
<text class="qt-ts" x="96" y="1102" text-anchor="start">Tự động, hoặc lập trên ứng dụng</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-14"><title>Mở thẻ TT-14</title>
<rect class="qt-pill" x="96" y="1114" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="126.6" y="1128" text-anchor="middle">⚠ TT-14</text>
</a>
<line class="qt-mui" x1="210" y1="1146" x2="210" y2="1172" marker-end="url(#qt-ah)"/>
<a href="#hoan-tat"><title>D·5 · Đơn chuyển sang Hoàn tất</title>
<rect class="qt-d" x="20" y="1176" width="720" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="44" cy="1200" r="12"/>
<text class="qt-so" x="44" y="1204" text-anchor="middle">5</text>
<text class="qt-tb" x="66" y="1204" text-anchor="start">Đơn chuyển sang Hoàn tất</text>
<text class="qt-ts" x="66" y="1220" text-anchor="start">Cộng điểm tích luỹ · sinh lịch bảo dưỡng · phiếu công việc được phép hoàn thành</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-15"><title>Mở thẻ TT-15</title>
<rect class="qt-pill" x="66" y="1232" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="96.6" y="1246" text-anchor="middle">⚠ TT-15</text>
</a>
<line class="qt-mui" x1="205" y1="1264" x2="205" y2="1290" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-03-Hien-Truong.html#dieu-kien"><title>Mở phân khu B</title>
<rect class="qt-cong" x="45" y="1294" width="320" height="50" rx="10" ry="10"/>
<text class="qt-tb" x="205" y="1315" text-anchor="middle">◀ Sang B · Điều phối và hiện trường</text>
<text class="qt-ts" x="205" y="1333" text-anchor="middle">Phiếu công việc được hoàn thành</text>
</a>
<line class="qt-mui" x1="555" y1="1264" x2="555" y2="1290" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-06-Bao-Duong.html#sinh-lich"><title>Mở phân khu E</title>
<rect class="qt-cong" x="395" y="1294" width="320" height="50" rx="10" ry="10"/>
<text class="qt-tb" x="555" y="1315" text-anchor="middle">◀ Sang E · Sau bán hàng</text>
<text class="qt-ts" x="555" y="1333" text-anchor="middle">Sinh lịch bảo dưỡng kỳ sau</text>
</a>
<a href="#ngoai-luong"><title>Ngoài luồng chính</title>
<rect class="qt-ngoai" x="20" y="1380" width="720" height="126" rx="12" ry="12"/>
<text class="qt-lan" x="36" y="1406" text-anchor="start">Ngoài luồng chính</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-16"><title>Mở thẻ TT-16</title>
<rect class="qt-the" x="36" y="1420" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="48" y="1439" text-anchor="start">⚠ TT-16</text>
<text class="qt-ts" x="48" y="1456" text-anchor="start">Không huỷ được</text>
<text class="qt-ts" x="48" y="1472" text-anchor="start">phiếu thu vừa lập</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-17"><title>Mở thẻ TT-17</title>
<rect class="qt-the" x="270.7" y="1420" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="282.7" y="1439" text-anchor="start">⚠ TT-17</text>
<text class="qt-ts" x="282.7" y="1456" text-anchor="start">Cần sửa phiếu thu khi</text>
<text class="qt-ts" x="282.7" y="1472" text-anchor="start">đơn đã có hoá đơn</text>
</a>
<a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-18"><title>Mở thẻ TT-18</title>
<rect class="qt-the" x="505.3" y="1420" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="517.3" y="1439" text-anchor="start">⚠ TT-18</text>
<text class="qt-ts" x="517.3" y="1456" text-anchor="start">Khách hàng trả hàng</text>
<text class="qt-ts" x="517.3" y="1472" text-anchor="start">sau khi đã nhận</text>
</a>
</svg>
</div>

<p class="qt-chu-giai"><span class="qt-k qt-k-buoc"></span> bước <span class="qt-k qt-k-re"></span> điểm rẽ <span class="qt-k qt-k-the"></span> thẻ tình huống <span class="qt-k qt-k-cong"></span> sang phân khu khác<br>👆 Bấm vào bất kỳ ô nào để mở phần giải thích.</p>

---

<div class="qt-re-khoi" id="co-phieu-giao"><strong>⬡ Đơn đã có phiếu giao hàng?</strong><br><em>có</em> → đi tiếp xuống bước sau · <em>chưa</em> → <a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-01">⚠ TT-01 · Báo “Chưa tạo phiếu giao hàng” khi thu tiền</a></div>

## D·1 — Mở màn hình thu tiền
{: #mo-thu-tien }

**Ai làm:** Kỹ thuật viên

Trên ứng dụng kỹ thuật viên: mở lịch hẹn → **Thu tiền**.

Kỹ thuật viên phải được khai **tài khoản thu tiền** cho công ty của đơn. Chưa khai thì
màn hình không cho thao tác, kể cả khi đơn đã có phiếu giao hàng.

**Tình huống ở bước này:**

- ⚠ [TT-02 · Màn hình thu tiền không cho thao tác](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-02)

---

## D·2 — Nhập các dòng thu
{: #dong-thu }

**Ai làm:** Kỹ thuật viên

Màn hình thu tiền làm việc theo **dòng**. Mỗi dòng cho biết: thu cho đơn nào, bằng hình
thức nào, bao nhiêu tiền.

| Nội dung | Hệ thống xử lý |
|---|---|
| Dòng mặc định | Mỗi đơn còn nợ được nạp sẵn một dòng |
| Số tiền mặc định | Bằng đúng số còn nợ |
| Hình thức mặc định | **Chuyển khoản** nếu đơn có khai sẵn tài khoản ngân hàng, ngược lại **tiền mặt** |
| Thêm dòng | Được, dùng khi khách hàng trả bằng hai hình thức |
| Giới hạn | Một đơn không được có **hai dòng cùng hình thức** trong một lần thu |
| Số tiền nhỏ hơn số còn nợ | Được; phần còn lại thu ở lần sau |
| Kiểm tra cuối | Tổng các dòng không lớn hơn **tổng** số còn nợ của các đơn đang xử lý |

> ⚠️ Chốt cuối kiểm trên **tổng**, không kiểm từng đơn. Thu nhiều đơn một lúc thì phải đọc
> lại số tiền từng dòng trước khi xác nhận.

**Tình huống ở bước này:**

- ⚠ [TT-03 · Báo “đã có dòng Tiền mặt” khi thêm dòng thu](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-03)
- ⚠ [TT-04 · Thu nhiều đơn một lần, chia sai tiền giữa các dòng](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-04)

---

## D·3 — Khách hàng trả bằng hình thức nào?
{: #hinh-thuc }

**Ai làm:** Kỹ thuật viên · Kế toán

Hai hình thức khác nhau không chỉ ở cách khách hàng trả tiền, mà ở **ai phải làm tiếp** và
**lúc nào đơn được tính là đã thu**.

| | Tiền mặt | Chuyển khoản |
|---|---|---|
| Phiếu thu sau khi lập | Chính thức ngay | **Nháp** |
| Tiền vào đâu | Tài khoản của chính kỹ thuật viên | Tài khoản ngân hàng công ty |
| Nghĩa vụ cá nhân | **Có** — phải nộp về công ty | Không |
| Ai làm tiếp | Kỹ thuật viên nộp tiền, kế toán xác nhận | Kế toán đối chiếu sao kê rồi xác nhận |
| Đơn được tính đã thu | Ngay khi lập phiếu | Chỉ khi kế toán xác nhận |
| Hoá đơn phát sinh | Tác vụ tự động hằng ngày, sớm nhất một ngày sau phiếu giao hàng | Ngay lập tức khi kế toán xác nhận |

### D·3a — Tiền mặt
{: #tien-mat }

1. **Phiếu thu chính thức ngay** — Tiền vào tài khoản kỹ thuật viên
2. **Lập phiếu nộp từ ứng dụng** — Chọn đúng khoản thu cần nộp
3. **Kế toán xác nhận phiếu nộp** — Công nợ cá nhân về không

Tiền mặt ở tài khoản kỹ thuật viên là **công nợ của người đó với công ty**. Nộp về bằng
phiếu nộp tiền (`Payment Entry` loại *Internal Transfer*).

| Quy tắc | Nội dung |
|---|---|
| Một phiếu nộp | Gắn **đúng một khoản thu**, số tiền bằng đúng khoản đó |
| Nộp gộp, nộp một phần | Ứng dụng không hỗ trợ |
| Ảnh chứng từ | Đính kèm được khi lập phiếu |
| Sau khi lập | **Nháp** — kế toán phải xác nhận |
| Chốt bảo vệ quỹ | Không nộp trùng một khoản; không nộp quá số đang giữ |

> ⛔ **Hệ thống đối chiếu theo liên kết, không theo số dư.** Phiếu nộp lập thẳng trên Desk,
> không gắn khoản thu, thì tiền về công ty nhưng **dấu nợ của khoản thu vẫn còn** — phiếu
> công việc tiếp tục bị chặn.

✅ Luôn lập phiếu nộp **từ ứng dụng** và chọn đúng khoản thu.

**Tình huống ở bước này:**

- ⚠ [TT-05 · Chọn nhầm tiền mặt cho khoản khách đã chuyển khoản](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-05)
- ⚠ [TT-06 · Đã đưa tiền mặt cho kế toán nhưng vẫn còn công nợ cá nhân](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-06)
- ⚠ [TT-07 · Báo “Công nợ … đã được trả qua …” khi lập phiếu nộp](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-07)
- ⚠ [TT-08 · Đã nộp tiền nhưng hệ thống vẫn báo chưa nộp](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-08)
- ⚠ [TT-09 · Báo “đã trả về … nhưng thu … (thiếu …)”](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-09)
- ⚠ [TT-10 · Báo “Số dư tài khoản … không đủ” khi xác nhận phiếu nộp](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-10)

### D·3b — Chuyển khoản
{: #chuyen-khoan }

1. **Chọn tài khoản, hiện mã QR** — Mã QR đúng tài khoản và số tiền
2. **Phiếu thu ở trạng thái nháp** — Chưa được tính là đã thu
3. **Kế toán đối chiếu và xác nhận** — Hoá đơn tự phát sinh ngay

Dòng chuyển khoản bắt buộc chọn **tài khoản ngân hàng nhận tiền**. Chọn xong, ứng dụng hiện
**mã QR** đúng tài khoản và đúng số tiền để khách hàng quét.

Phiếu thu chuyển khoản nằm ở **nháp** cho tới khi kế toán đối chiếu sao kê và xác nhận.
Ngay khi xác nhận, hệ thống **tự lập hoá đơn** nếu đơn đã đủ tiền.

**Tình huống ở bước này:**

- ⚠ [TT-11 · Cần nhận tiền vào tài khoản ngân hàng khác](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-11)
- ⚠ [TT-12 · Chọn nhầm chuyển khoản cho khoản thu bằng tiền mặt](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-12)

### D·3c — Cả hai hình thức
{: #ca-hai }

1. **Lập hai dòng trên cùng một đơn** — Một dòng tiền mặt, một dòng chuyển khoản
2. **Mỗi phiếu đi theo nhánh riêng** — Như hai nhánh bên trái
3. **Đơn đủ khi cả hai phiếu chính thức** — Còn một phiếu nháp là vẫn còn nợ

Hệ thống hỗ trợ sẵn, không cần xin phép. Kết quả là **hai phiếu thu riêng**:

| Phần | Diễn biến |
|---|---|
| Tiền mặt | Chính thức ngay; kỹ thuật viên phải nộp về công ty, **không chờ** phần chuyển khoản |
| Chuyển khoản | Nằm ở nháp cho tới khi kế toán xác nhận |
| Hoá đơn | Phát sinh lúc phiếu sau cùng được xác nhận |

---

<div class="qt-re-khoi" id="du-tien"><strong>⬡ Phiếu thu chính thức đã đủ giá trị đơn?</strong><br><em>đủ</em> → đi tiếp xuống bước sau · <em>chưa</em> → <a href="Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-13">⚠ TT-13 · Đã thu tiền nhưng đơn vẫn hiện còn nợ</a></div>

## D·4 — Hoá đơn phát sinh
{: #hoa-don }

**Ai làm:** Hệ thống · Kỹ thuật viên

**Điều kiện:** đơn đã thu đủ **100%**, tính trên phiếu thu **đã chính thức**.

| Đường phát sinh | Ai làm | Lúc nào |
|---|---|---|
| Lập trên ứng dụng | Kỹ thuật viên chọn phiếu giao hàng rồi lập | Ngay tại hiện trường, sau khi thu đủ |
| Khi xác nhận phiếu thu chuyển khoản | Hệ thống | Ngay khi kế toán xác nhận |
| Tác vụ tự động hằng ngày | Hệ thống | Đơn đã giao đủ, thu đủ, qua ít nhất một ngày từ phiếu giao hàng cuối |

Mỗi phiếu giao hàng có **một hoá đơn riêng**; đơn giao nhiều lần sẽ có nhiều hoá đơn.

**Tình huống ở bước này:**

- ⚠ [TT-14 · Đã thu đủ mà chưa thấy hoá đơn](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-14)

---

## D·5 — Đơn chuyển sang Hoàn tất
{: #hoan-tat }

**Ai làm:** Hệ thống

Hoá đơn đủ giá trị đơn kéo theo ba việc cùng lúc:

| Việc | Nơi tiếp nhận |
|---|---|
| Đơn sang **Hoàn tất** | Điều kiện để phiếu công việc được hoàn thành |
| Khách hàng được **cộng điểm tích luỹ** | Chương trình tích điểm |
| Hệ thống **sinh lịch bảo dưỡng** cho kỳ sau | Phân khu sau bán hàng |

**Tình huống ở bước này:**

- ⚠ [TT-15 · Đơn đã giao đủ nhưng chưa Hoàn tất](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-15)

---

## Ngoài luồng chính
{: #ngoai-luong }

| Việc | Quy định |
|---|---|
| Huỷ phiếu thu trên ứng dụng | Trong **24 giờ** kể từ lúc lập, chỉ người lập, và khoản thu chưa có phiếu nộp |
| Quá hạn huỷ | Kế toán xử lý trên Desk |
| Đơn đã có hoá đơn | Huỷ ngược: hoá đơn trước, phiếu thu sau |

**Ba kiểu "trả hàng" cần phân biệt.** Chỉ kiểu thứ ba thuộc phân khu này:

| Cách gọi | Thực chất | Phân khu |
|---|---|---|
| Khách không nhận khi giao | Giảm số trên phiếu giao hàng | C · Kho và giao nhận |
| Kỹ thuật viên trả vật tư về kho | Chuyển hàng từ kho cá nhân về kho công ty | C · Kho và giao nhận |
| Khách trả hàng sau khi đã nhận | Đảo ngược nghiệp vụ bán: giảm doanh thu, thu hồi điểm | **D · Thu tiền và kế toán** |

**Tình huống ở bước này:**

- ⚠ [TT-16 · Không huỷ được phiếu thu vừa lập](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-16)
- ⚠ [TT-17 · Cần sửa phiếu thu khi đơn đã có hoá đơn](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-17)
- ⚠ [TT-18 · Khách hàng trả hàng sau khi đã nhận](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-18)

---

## Câu hỏi thường gặp
{: #hoi-dap }

**Khách đưa một nửa tiền mặt, một nửa chuyển khoản, ghi thế nào?**

Lập hai dòng thu trên cùng đơn, mỗi hình thức một dòng. Xem [nhánh cả hai hình thức](#ca-hai).

**Thu tiền mặt xong bao giờ phải nộp về công ty?**

Càng sớm càng tốt, vì chưa nộp thì phiếu công việc không hoàn thành được. Nộp từ ứng dụng và chọn đúng khoản thu.

**Khách chuyển khoản rồi, sao hệ thống vẫn nói chưa thu?**

Phiếu thu chuyển khoản nằm ở nháp cho tới khi kế toán đối chiếu sao kê. Đó là bước bắt buộc — xem thẻ [TT-13](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-13).

**Thu nhầm hình thức thì sửa sao?**

Trong 24 giờ và chưa có phiếu nộp thì huỷ rồi lập lại. Xem thẻ [TT-05](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-05) và [TT-12](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-12).

**Khách chỉ nhận một phần hàng, có thu tiền được không?**

Được, thu theo phần đã giao. Phần không giao thuộc phân khu kho và giao nhận.

**Đã thu đủ tiền, sao chưa thấy hoá đơn?**

Phần tiền mặt chờ tác vụ tự động, sớm nhất một ngày sau phiếu giao hàng. Cần ngay thì lập trên ứng dụng — xem thẻ [TT-14](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html#tt-14).

---

## Đọc tiếp
{: #doc-tiep }

| Bạn cần | Mở trang |
|---|---|
| Xem cách gỡ từng tình huống | [Thẻ tình huống của phân khu D](Quy-Trinh-D-Thu-Tien-Tinh-Huong.html) |
| Xem toàn bộ dây chuyền | [Bản đồ tổng](00-quy-trinh.html) |
| Đi theo một đơn hàng cụ thể | [Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html) |
