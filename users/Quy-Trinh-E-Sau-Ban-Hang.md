---
title: E · Sau bán hàng
layout: default
parent: Quy trình hợp nhất
nav_order: 50
has_children: true
---

<!-- Trang sinh tự động bởi _tools/quy_trinh/build.py từ _quy_trinh/. Sửa tệp dữ liệu rồi chạy lại bộ sinh; sửa thẳng trang này sẽ bị ghi đè. -->

# Phân khu E — Sau bán hàng
{: .no_toc }

**Ai làm:** Nhân viên dịch vụ · Nhân viên sự cố · Hệ thống tự động
{: .fs-3 .text-grey-dk-000 }

Hai luồng giữ khách hàng ở lại sau lần mua đầu tiên: nhắc bảo dưỡng theo chu kỳ, và tiếp nhận khi khách hàng báo hỏng. Cả hai đều có thể mở ra một đơn bán hàng mới.

| Nhận vào | Bàn giao ra |
|---|---|
| ▶ [D · Thu tiền và kế toán](Quy-Trinh-D-Thu-Tien.html#hoan-tat) — Đơn hàng đã hoàn tất | ◀ [A · Bán hàng](Quy-Trinh-A-Ban-Hang.html#khai-don) — Đơn mới từ phiếu nhắc |

👉 **[Các thẻ tình huống của phân khu E](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html)** · [Bản đồ tổng](00-quy-trinh.html)

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ — Bảo dưỡng định kỳ
{: #bao-duong }

Máy lọc nước phải thay lõi và bảo dưỡng theo chu kỳ, nên mỗi đơn hoàn tất đều tự sinh lịch
chăm sóc cho kỳ sau. Có hai loại bản ghi:

| Loại | Gõ tìm bằng | Là gì |
|---|---|---|
| **Nhắc theo vật tư** | `Item Service Reminder` | Lịch của một vật tư trên một đơn: chu kỳ và ngày đến hạn kế tiếp |
| **Phiếu nhắc bảo dưỡng** | `Service Ticket Reminder` | Việc cần làm: liên hệ khách hàng, gom nhiều lịch nhắc |

<div class="qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 760 1058" width="760" height="1058" role="img" aria-labelledby="qt-t-pk-E-bao-duong qt-d-pk-E-bao-duong">
<title id="qt-t-pk-E-bao-duong">Sơ đồ phân khu E — Sau bán hàng · Bảo dưỡng định kỳ</title>
<desc id="qt-d-pk-E-bao-duong">Đường chính đọc từ trên xuống. Ô chữ nhật là bước, ô sáu cạnh là điểm rẽ, nhãn đỏ là thẻ tình huống, ô viền đứt là cổng sang phân khu khác.</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="760" height="1058"/>
<a href="Quy-Trinh-D-Thu-Tien.html#hoan-tat"><title>Mở phân khu D</title>
<rect class="qt-cong" x="50" y="20" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="210" y="43" text-anchor="middle">▶ Từ D · Thu tiền và kế toán</text>
<text class="qt-ts" x="210" y="59" text-anchor="middle">Đơn hàng đã hoàn tất</text>
</a>
<line class="qt-mui" x1="210" y1="74" x2="210" y2="100" marker-end="url(#qt-ah)"/>
<a href="#sinh-lich"><title>E·1 · Sinh lịch nhắc theo từng vật tư</title>
<rect class="qt-e" x="50" y="104" width="320" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="128" r="12"/>
<text class="qt-so" x="74" y="132" text-anchor="middle">1</text>
<text class="qt-tb" x="96" y="132" text-anchor="start">Sinh lịch nhắc theo từng vật tư</text>
<text class="qt-ts" x="96" y="148" text-anchor="start">Tự động, theo chu kỳ khai cho mã hàng</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-01"><title>Mở thẻ SB-01</title>
<rect class="qt-pill" x="96" y="160" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="126.6" y="174" text-anchor="middle">⚠ SB-01</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-02"><title>Mở thẻ SB-02</title>
<rect class="qt-pill" x="165.1" y="160" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="195.7" y="174" text-anchor="middle">⚠ SB-02</text>
</a>
<line class="qt-mui" x1="210" y1="192" x2="210" y2="218" marker-end="url(#qt-ah)"/>
<a href="#phieu-nhac"><title>E·2 · Gom lịch nhắc theo khách hàng</title>
<rect class="qt-e" x="50" y="222" width="320" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="246" r="12"/>
<text class="qt-so" x="74" y="250" text-anchor="middle">2</text>
<text class="qt-tb" x="96" y="250" text-anchor="start">Gom lịch nhắc theo khách hàng</text>
<text class="qt-ts" x="96" y="266" text-anchor="start">Cùng địa chỉ, ngày đến hạn gần nhau</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-03"><title>Mở thẻ SB-03</title>
<rect class="qt-pill" x="96" y="278" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="126.6" y="292" text-anchor="middle">⚠ SB-03</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-04"><title>Mở thẻ SB-04</title>
<rect class="qt-pill" x="165.1" y="278" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="195.7" y="292" text-anchor="middle">⚠ SB-04</text>
</a>
<line class="qt-mui" x1="210" y1="310" x2="210" y2="336" marker-end="url(#qt-ah)"/>
<a href="#phan-cong"><title>E·3 · Phân người phụ trách</title>
<rect class="qt-e" x="50" y="340" width="320" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="364" r="12"/>
<text class="qt-so" x="74" y="368" text-anchor="middle">3</text>
<text class="qt-tb" x="96" y="368" text-anchor="start">Phân người phụ trách</text>
<text class="qt-ts" x="96" y="384" text-anchor="start">Sáu tiêu chí, hoặc chia đều theo tháng</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-05"><title>Mở thẻ SB-05</title>
<rect class="qt-pill" x="96" y="396" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="126.6" y="410" text-anchor="middle">⚠ SB-05</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-06"><title>Mở thẻ SB-06</title>
<rect class="qt-pill" x="165.1" y="396" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="195.7" y="410" text-anchor="middle">⚠ SB-06</text>
</a>
<line class="qt-mui" x1="210" y1="428" x2="210" y2="454" marker-end="url(#qt-ah)"/>
<a href="#lien-he"><title>E·4 · Liên hệ khách hàng</title>
<rect class="qt-e" x="50" y="458" width="320" height="58" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="482" r="12"/>
<text class="qt-so" x="74" y="486" text-anchor="middle">4</text>
<text class="qt-tb" x="96" y="486" text-anchor="start">Liên hệ khách hàng</text>
<text class="qt-ts" x="96" y="502" text-anchor="start">Danh sách lọc theo ngày đến hạn</text>
</a>
<line class="qt-mui" x1="210" y1="516" x2="210" y2="542" marker-end="url(#qt-ah)"/>
<a href="#ket-qua"><title>E·5 · Khách hàng trả lời thế nào?</title>
<polygon class="qt-re" points="20,571 45,546 715,546 740,571 715,596 45,596"/>
<circle class="qt-tron" cx="64" cy="571" r="12"/>
<text class="qt-so" x="64" y="575" text-anchor="middle">5</text>
<text class="qt-tb" x="380" y="576" text-anchor="middle">Khách hàng trả lời thế nào?</text>
</a>
<line class="qt-mui" x1="134.7" y1="596" x2="134.7" y2="622" marker-end="url(#qt-ah)"/>
<a href="#dong-y"><title>E·5a · Đồng ý</title>
<rect class="qt-e" x="20" y="626" width="229.3" height="33" rx="17" ry="17"/>
<text class="qt-tb" x="134.7" y="648" text-anchor="middle">5a · Đồng ý</text>
</a>
<line class="qt-mui" x1="134.7" y1="659" x2="134.7" y2="679" marker-end="url(#qt-ah)"/>
<a href="#dong-y"><title>E·5a · Đồng ý</title>
<rect class="qt-trang" x="20" y="683" width="229.3" height="99" rx="10" ry="10"/>
<text class="qt-tb2" x="34" y="707" text-anchor="start">Lập đơn ngay</text>
<text class="qt-tb2" x="34" y="724" text-anchor="start">trên phiếu nhắc</text>
<text class="qt-ts" x="34" y="739" text-anchor="start">Giữ liên kết ngược</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-07"><title>Mở thẻ SB-07</title>
<rect class="qt-pill" x="34" y="750" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="64.6" y="764" text-anchor="middle">⚠ SB-07</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-08"><title>Mở thẻ SB-08</title>
<rect class="qt-pill" x="103.1" y="750" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="133.7" y="764" text-anchor="middle">⚠ SB-08</text>
</a>
<line class="qt-mui" x1="134.7" y1="782" x2="134.7" y2="802" marker-end="url(#qt-ah)"/>
<a href="#dong-y"><title>E·5a · Đồng ý</title>
<rect class="qt-trang" x="20" y="806" width="229.3" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="34" y="830" text-anchor="start">Phiếu tự sang Converted</text>
<text class="qt-ts" x="34" y="845" text-anchor="start">Khi đơn được xác nhận</text>
</a>
<line class="qt-mui" x1="380" y1="596" x2="380" y2="622" marker-end="url(#qt-ah)"/>
<a href="#hen-lai"><title>E·5b · Hẹn lại</title>
<rect class="qt-e" x="265.3" y="626" width="229.3" height="33" rx="17" ry="17"/>
<text class="qt-tb" x="380" y="648" text-anchor="middle">5b · Hẹn lại</text>
</a>
<line class="qt-mui" x1="380" y1="659" x2="380" y2="679" marker-end="url(#qt-ah)"/>
<a href="#hen-lai"><title>E·5b · Hẹn lại</title>
<rect class="qt-trang" x="265.3" y="683" width="229.3" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="279.3" y="707" text-anchor="start">Dời ngày nhắc</text>
<text class="qt-ts" x="279.3" y="722" text-anchor="start">Reschedule hoặc Contact Later</text>
</a>
<line class="qt-mui" x1="380" y1="737" x2="380" y2="757" marker-end="url(#qt-ah)"/>
<a href="#hen-lai"><title>E·5b · Hẹn lại</title>
<rect class="qt-trang" x="265.3" y="761" width="229.3" height="69" rx="10" ry="10"/>
<text class="qt-tb2" x="279.3" y="785" text-anchor="start">Không nghe máy</text>
<text class="qt-ts" x="279.3" y="800" text-anchor="start">Unable to Contact,</text>
<text class="qt-ts" x="279.3" y="815" text-anchor="start">nhắc lại vòng sau</text>
</a>
<line class="qt-mui" x1="625.3" y1="596" x2="625.3" y2="622" marker-end="url(#qt-ah)"/>
<a href="#khong-nhu-cau"><title>E·5c · Không có nhu cầu</title>
<rect class="qt-e" x="510.7" y="626" width="229.3" height="33" rx="17" ry="17"/>
<text class="qt-tb" x="625.3" y="648" text-anchor="middle">5c · Không có nhu cầu</text>
</a>
<line class="qt-mui" x1="625.3" y1="659" x2="625.3" y2="679" marker-end="url(#qt-ah)"/>
<a href="#khong-nhu-cau"><title>E·5c · Không có nhu cầu</title>
<rect class="qt-trang" x="510.7" y="683" width="229.3" height="69" rx="10" ry="10"/>
<text class="qt-tb2" x="524.7" y="707" text-anchor="start">Chọn Lost kèm lý do</text>
<text class="qt-ts" x="524.7" y="722" text-anchor="start">Dữ liệu để cải thiện</text>
<text class="qt-ts" x="524.7" y="737" text-anchor="start">kịch bản bán hàng</text>
</a>
<line class="qt-mui" x1="625.3" y1="752" x2="625.3" y2="772" marker-end="url(#qt-ah)"/>
<a href="#khong-nhu-cau"><title>E·5c · Không có nhu cầu</title>
<rect class="qt-trang" x="510.7" y="776" width="229.3" height="82" rx="10" ry="10"/>
<text class="qt-tb2" x="524.7" y="800" text-anchor="start">Ngừng hẳn thì chọn Disable</text>
<text class="qt-ts" x="524.7" y="815" text-anchor="start">Chuỗi dừng, không sinh vòng mới</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-09"><title>Mở thẻ SB-09</title>
<rect class="qt-pill" x="524.7" y="826" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="555.2" y="840" text-anchor="middle">⚠ SB-09</text>
</a>
<line class="qt-mui" x1="134.7" y1="860" x2="134.7" y2="886" marker-end="url(#qt-ah)"/>
<line class="qt-mui" x1="380" y1="830" x2="380" y2="886" marker-end="url(#qt-ah)"/>
<line class="qt-mui" x1="625.3" y1="858" x2="625.3" y2="886" marker-end="url(#qt-ah)"/>
<a href="#ket-qua"><title>E·5 · Khách hàng trả lời thế nào?</title>
<rect class="qt-trang" x="20" y="890" width="720" height="54" rx="10" ry="10"/>
<text class="qt-tb" x="380" y="914" text-anchor="middle">Vòng nhắc kế tiếp tự sinh theo chu kỳ</text>
<text class="qt-ts" x="380" y="932" text-anchor="middle">Tác vụ chạy hằng đêm; một đêm lỗi thì đêm sau xử lý bù</text>
</a>
<line class="qt-mui" x1="210" y1="944" x2="210" y2="970" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#khai-don"><title>Mở phân khu A</title>
<rect class="qt-cong" x="50" y="974" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="210" y="997" text-anchor="middle">◀ Sang A · Bán hàng</text>
<text class="qt-ts" x="210" y="1013" text-anchor="middle">Đơn mới từ phiếu nhắc</text>
</a>
</svg>
</div>

<p class="qt-chu-giai"><span class="qt-k qt-k-buoc"></span> bước <span class="qt-k qt-k-re"></span> điểm rẽ <span class="qt-k qt-k-the"></span> thẻ tình huống <span class="qt-k qt-k-cong"></span> sang phân khu khác<br>👆 Bấm vào bất kỳ ô nào để mở phần giải thích.</p>

---

## E·1 — Sinh lịch nhắc theo từng vật tư
{: #sinh-lich }

**Ai làm:** Hệ thống

Ngay khi đơn sang **Completed**, hệ thống rà từng món trong đơn:

| Loại món | Xử lý |
|---|---|
| Có khai **chu kỳ nhắc** | Sinh một dòng nhắc, đặt sẵn ngày đến hạn kế tiếp |
| Là **bộ sản phẩm** | Khai triển thành từng món thành phần rồi mới xét |
| Không khai chu kỳ | Bỏ qua |

**Tránh sinh phiếu thừa:** đơn có bán lõi lọc có chu kỳ nhắc thì không nhắc cho thân máy;
khi lịch nhắc lõi được sinh, các lịch nhắc thân máy đang chờ của cùng thiết bị được ngừng.
Đơn bán **thiết bị không kèm lõi** vẫn nhắc cho thân máy.

**Tình huống ở bước này:**

- ⚠ [SB-01 · Khách đã mua nhưng không có phiếu nhắc](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-01)
- ⚠ [SB-02 · Đơn hoàn tất mà vẫn không sinh nhắc](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-02)

---

## E·2 — Gom lịch nhắc theo khách hàng
{: #phieu-nhac }

**Ai làm:** Hệ thống

| Trường hợp | Xử lý |
|---|---|
| Khách chưa có phiếu đang mở | **Lập phiếu mới** |
| Có phiếu đang mở, **cùng địa chỉ**, ngày đến hạn **gần nhau** | **Bổ sung** vào phiếu đó |
| Có phiếu đang mở nhưng khác địa chỉ, hoặc ngày cách xa | **Lập phiếu mới** |

Khách còn phiếu chưa xử lý thì hệ thống **tạm hoãn** sinh vòng mới, để không gọi khách hai
lần cho cùng một lần đến.

**Tình huống ở bước này:**

- ⚠ [SB-03 · Một khách hàng có nhiều phiếu nhắc trùng](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-03)
- ⚠ [SB-04 · Phiếu nhắc quá hạn rất lâu vẫn còn](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-04)

---

## E·3 — Phân người phụ trách
{: #phan-cong }

**Ai làm:** Hệ thống · Quản lý dịch vụ

| # | Tiêu chí | Ý nghĩa |
|---|---|---|
| 1 | **Đã chăm sóc khách này trước đây** | Trọng số cao nhất — khách quen giữ đúng người |
| 2 | **Chuyên môn** | Am hiểu dòng sản phẩm liên quan |
| 3 | **Hiệu suất** | Tỉ lệ chốt đơn gần đây |
| 4 | **Mức độ tương tác** | Đã trao đổi trên phiếu này gần đây |
| 5 | **Địa bàn** | Phụ trách đúng tỉnh hoặc quận của khách |
| 6 | **Cân bằng khối lượng** | Ai đang ít việc được cộng điểm, ai quá tải bị trừ |

Cơ chế **phân theo tháng** chia đều khối lượng từng tháng; hai cơ chế loại trừ nhau bằng một
tham số cấu hình. Người dùng luôn sửa được sau khi hệ thống phân.

**Tình huống ở bước này:**

- ⚠ [SB-05 · Phiếu được phân cho người không phù hợp](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-05)
- ⚠ [SB-06 · Nhân sự nghỉ việc, khách quen không được chuyển giao](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-06)

---

## E·4 — Liên hệ khách hàng
{: #lien-he }

**Ai làm:** Nhân viên dịch vụ

| Trạng thái | Nghĩa |
|---|---|
| **Open** | Chưa xử lý |
| **Under Care** | Đang chăm sóc, chưa chốt |
| **Converted** | Khách đồng ý, đã lập đơn mới |
| **Reschedule Reminder Date** | Khách hẹn dịp khác, dời ngày nhắc |
| **Contact Later** | Liên hệ lại sau |
| **Unable to Contact** | Không liên hệ được |
| **Lost** | Khách không có nhu cầu, có ghi lý do |
| **Disable** | Ngừng nhắc hẳn chuỗi này |
| **Cancelled** | Đơn đã lập nhưng bị huỷ |

📚 Lọc danh sách: [Lọc ticket bảo dưỡng](Loc-Ticket-Bao-Duong.html).

---

## E·5 — Khách hàng trả lời thế nào?
{: #ket-qua }

### E·5a — Đồng ý
{: #dong-y }

1. **Lập đơn ngay trên phiếu nhắc** — Giữ liên kết ngược
2. **Phiếu tự sang Converted** — Khi đơn được xác nhận

Hệ thống điền sẵn khách hàng, địa chỉ, liên hệ. Đơn bị huỷ thì phiếu tự sang *Cancelled*.

**Tình huống ở bước này:**

- ⚠ [SB-07 · Đã lập đơn mà phiếu nhắc vẫn Open](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-07)
- ⚠ [SB-08 · Khách chỉ đồng ý một phần hạng mục](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-08)

### E·5b — Hẹn lại
{: #hen-lai }

1. **Dời ngày nhắc** — Reschedule hoặc Contact Later
2. **Không nghe máy** — Unable to Contact, nhắc lại vòng sau


### E·5c — Không có nhu cầu
{: #khong-nhu-cau }

1. **Chọn Lost kèm lý do** — Dữ liệu để cải thiện kịch bản bán hàng
2. **Ngừng hẳn thì chọn Disable** — Chuỗi dừng, không sinh vòng mới

Lý do **Lost** bắt buộc chọn: không có nhu cầu, đợi khách kiểm tra, chưa sắp xếp được thời
gian, mua bên ngoài, đã hẹn lại nhiều lần, không đồng ý đổi loại lõi.

**Tình huống ở bước này:**

- ⚠ [SB-09 · Cần ngừng nhắc hẳn](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-09)

---

## Sơ đồ — Sự cố
{: #su-co }

Mỗi lượt khách hàng báo hỏng thành một phiếu sự cố (`Issue`), kể cả khi thiết bị còn bảo hành.

<div class="qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 760 783" width="760" height="783" role="img" aria-labelledby="qt-t-pk-E-su-co qt-d-pk-E-su-co">
<title id="qt-t-pk-E-su-co">Sơ đồ phân khu E — Sau bán hàng · Sự cố</title>
<desc id="qt-d-pk-E-su-co">Đường chính đọc từ trên xuống. Ô chữ nhật là bước, ô sáu cạnh là điểm rẽ, nhãn đỏ là thẻ tình huống, ô viền đứt là cổng sang phân khu khác.</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="760" height="783"/>
<a href="#tiep-nhan"><title>E·6 · Tiếp nhận, lập phiếu sự cố</title>
<rect class="qt-e" x="50" y="20" width="320" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="44" r="12"/>
<text class="qt-so" x="74" y="48" text-anchor="middle">6</text>
<text class="qt-tb" x="96" y="48" text-anchor="start">Tiếp nhận, lập phiếu sự cố</text>
<text class="qt-ts" x="96" y="64" text-anchor="start">Gắn về đơn hàng gốc của khách</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-10"><title>Mở thẻ SB-10</title>
<rect class="qt-pill" x="96" y="76" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="126.6" y="90" text-anchor="middle">⚠ SB-10</text>
</a>
<line class="qt-mui" x1="210" y1="108" x2="210" y2="134" marker-end="url(#qt-ah)"/>
<a href="#phan-loai"><title>E·7 · Phân loại, gán người xử lý</title>
<rect class="qt-e" x="50" y="138" width="320" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="162" r="12"/>
<text class="qt-so" x="74" y="166" text-anchor="middle">7</text>
<text class="qt-tb" x="96" y="166" text-anchor="start">Phân loại, gán người xử lý</text>
<text class="qt-ts" x="96" y="182" text-anchor="start">Nhóm và Loại đều bắt buộc</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-11"><title>Mở thẻ SB-11</title>
<rect class="qt-pill" x="96" y="194" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="126.6" y="208" text-anchor="middle">⚠ SB-11</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-12"><title>Mở thẻ SB-12</title>
<rect class="qt-pill" x="165.1" y="194" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="195.7" y="208" text-anchor="middle">⚠ SB-12</text>
</a>
<line class="qt-mui" x1="210" y1="226" x2="210" y2="252" marker-end="url(#qt-ah)"/>
<a href="#hai-duong"><title>E·8 · Cần đến tận nơi?</title>
<polygon class="qt-re" points="20,281 45,256 715,256 740,281 715,306 45,306"/>
<circle class="qt-tron" cx="64" cy="281" r="12"/>
<text class="qt-so" x="64" y="285" text-anchor="middle">8</text>
<text class="qt-tb" x="380" y="286" text-anchor="middle">Cần đến tận nơi?</text>
</a>
<line class="qt-mui" x1="196" y1="306" x2="196" y2="332" marker-end="url(#qt-ah)"/>
<a href="#qua-dien-thoai"><title>E·8a · Không — qua điện thoại</title>
<rect class="qt-e" x="20" y="336" width="352" height="33" rx="17" ry="17"/>
<text class="qt-tb" x="196" y="358" text-anchor="middle">8a · Không — qua điện thoại</text>
</a>
<line class="qt-mui" x1="196" y1="369" x2="196" y2="389" marker-end="url(#qt-ah)"/>
<a href="#qua-dien-thoai"><title>E·8a · Không — qua điện thoại</title>
<rect class="qt-trang" x="20" y="393" width="352" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="34" y="417" text-anchor="start">Hướng dẫn khách hàng</text>
<text class="qt-ts" x="34" y="432" text-anchor="start">Thường là chưa quen dùng máy</text>
</a>
<line class="qt-mui" x1="196" y1="447" x2="196" y2="467" marker-end="url(#qt-ah)"/>
<a href="#qua-dien-thoai"><title>E·8a · Không — qua điện thoại</title>
<rect class="qt-trang" x="20" y="471" width="352" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="34" y="495" text-anchor="start">Ghi Resolution Details</text>
<text class="qt-ts" x="34" y="510" text-anchor="start">Kết quả xử lý</text>
</a>
<line class="qt-mui" x1="564" y1="306" x2="564" y2="332" marker-end="url(#qt-ah)"/>
<a href="#den-tan-noi"><title>E·8b · Có — cử người đến</title>
<rect class="qt-e" x="388" y="336" width="352" height="33" rx="17" ry="17"/>
<text class="qt-tb" x="564" y="358" text-anchor="middle">8b · Có — cử người đến</text>
</a>
<line class="qt-mui" x1="564" y1="369" x2="564" y2="389" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#lap-wo"><title>Mở phân khu B</title>
<rect class="qt-cong" x="388" y="393" width="352" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="564" y="416" text-anchor="middle">▷ Phiếu công việc loại Sự cố</text>
<text class="qt-ts" x="564" y="432" text-anchor="middle">Phân khu B · Điều phối và hiện trường</text>
</a>
<line class="qt-mui" x1="564" y1="447" x2="564" y2="467" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-A-Ban-Hang.html#khai-don"><title>Mở phân khu A</title>
<rect class="qt-cong" x="388" y="471" width="352" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="564" y="494" text-anchor="middle">▷ Vật tư tính phí: lập đơn mới</text>
<text class="qt-ts" x="564" y="510" text-anchor="middle">Phân khu A · Bán hàng</text>
</a>
<line class="qt-mui" x1="196" y1="525" x2="196" y2="551" marker-end="url(#qt-ah)"/>
<line class="qt-mui" x1="564" y1="525" x2="564" y2="551" marker-end="url(#qt-ah)"/>
<a href="#hai-duong"><title>E·8 · Cần đến tận nơi?</title>
<rect class="qt-trang" x="20" y="555" width="720" height="54" rx="10" ry="10"/>
<text class="qt-tb" x="380" y="579" text-anchor="middle">Đã có kết quả xử lý</text>
<text class="qt-ts" x="380" y="597" text-anchor="middle">Phiếu sự cố không tự đóng theo phiếu công việc</text>
</a>
<line class="qt-mui" x1="210" y1="609" x2="210" y2="635" marker-end="url(#qt-ah)"/>
<a href="#dong-su-co"><title>E·9 · Đóng phiếu sự cố</title>
<rect class="qt-e" x="50" y="639" width="320" height="114" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="663" r="12"/>
<text class="qt-so" x="74" y="667" text-anchor="middle">9</text>
<text class="qt-tb" x="96" y="667" text-anchor="start">Đóng phiếu sự cố</text>
<text class="qt-ts" x="96" y="683" text-anchor="start">Đóng riêng, kèm ghi nhận kết quả</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-13"><title>Mở thẻ SB-13</title>
<rect class="qt-pill" x="96" y="695" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="126.6" y="709" text-anchor="middle">⚠ SB-13</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-14"><title>Mở thẻ SB-14</title>
<rect class="qt-pill" x="165.1" y="695" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="195.7" y="709" text-anchor="middle">⚠ SB-14</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-15"><title>Mở thẻ SB-15</title>
<rect class="qt-pill" x="234.3" y="695" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="264.8" y="709" text-anchor="middle">⚠ SB-15</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-16"><title>Mở thẻ SB-16</title>
<rect class="qt-pill" x="96" y="721" width="61.1" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="126.6" y="735" text-anchor="middle">⚠ SB-16</text>
</a>
</svg>
</div>

<p class="qt-chu-giai"><span class="qt-k qt-k-buoc"></span> bước <span class="qt-k qt-k-re"></span> điểm rẽ <span class="qt-k qt-k-the"></span> thẻ tình huống <span class="qt-k qt-k-cong"></span> sang phân khu khác<br>👆 Bấm vào bất kỳ ô nào để mở phần giải thích.</p>

---

## E·6 — Tiếp nhận, lập phiếu sự cố
{: #tiep-nhan }

**Ai làm:** Chăm sóc khách hàng

✅ **Việc quan trọng nhất là gắn phiếu về đơn hàng gốc.** Nhờ đó người xử lý thấy ngay khách
đã mua thiết bị nào, lắp ngày nào, bảo dưỡng tới đâu, và các lần báo hỏng trước.

**Tình huống ở bước này:**

- ⚠ [SB-10 · Không biết khách đã mua thiết bị nào](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-10)

---

## E·7 — Phân loại, gán người xử lý
{: #phan-loai }

**Ai làm:** Chăm sóc khách hàng

| Ô | Nói về | Khai lúc nào |
|---|---|---|
| **Nhóm sự cố** (`Issue Group`) | Khách hàng phản ánh chuyện gì | Ngay khi tiếp nhận |
| **Loại sự cố** (`Issue Type`) | Hỏng ở bộ phận nào | Sau khi trao đổi thêm |

Chọn nhóm trước thì ô loại chỉ hiện các loại của nhóm đó; chọn loại trước thì hệ thống tự
điền nhóm. Người xử lý ghi ở ô **Handling Person**.

📚 Quản trị danh mục: [Phân loại sự cố](Phan-Loai-Su-Co.html).

**Tình huống ở bước này:**

- ⚠ [SB-11 · Ô Loại sự cố trống sau khi chọn nhóm](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-11)
- ⚠ [SB-12 · Đổi nhóm làm mất loại đang chọn](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-12)

---

## E·8 — Cần đến tận nơi?
{: #hai-duong }

### E·8a — Không — qua điện thoại
{: #qua-dien-thoai }

1. **Hướng dẫn khách hàng** — Thường là chưa quen dùng máy
2. **Ghi Resolution Details** — Kết quả xử lý


### E·8b — Có — cử người đến
{: #den-tan-noi }

1. **Phiếu công việc loại Sự cố** — thuộc [phân khu B · Điều phối và hiện trường](Quy-Trinh-B-Hien-Truong.html#lap-wo)
2. **Vật tư tính phí: lập đơn mới** — thuộc [phân khu A · Bán hàng](Quy-Trinh-A-Ban-Hang.html#khai-don)

Chọn **Create → FS Work Order** ngay trên phiếu sự cố. Phát sinh vật tư tính phí thì lập
đơn bằng **Create → Sales Order** cũng ngay trên phiếu sự cố — đơn đó hoàn tất cũng sẽ
sinh lịch bảo dưỡng, đưa khách quay lại vòng chăm sóc.

---

## E·9 — Đóng phiếu sự cố
{: #dong-su-co }

**Ai làm:** Nhân viên sự cố

| Trạng thái | Nghĩa |
|---|---|
| **Open** | Đang mở |
| **Replied** | Đã phản hồi khách hàng |
| **On Hold** | Tạm dừng, chờ khách hoặc chờ linh kiện — phần tồn đọng thật, cần rà định kỳ |
| **Resolved** | Đã xử lý, chờ xác nhận |
| **Closed** | Đã đóng |

**Đo hiệu suất:** nhân viên sự cố tính hạn từ lúc mở phiếu, xong khi phiếu đóng hoặc có
phiếu công việc đầu tiên; kỹ thuật viên tính hạn từ lúc phiếu công việc được lập. Chi tiết:
[Hiệu suất xử lý sự cố](Hieu-Suat-Xu-Ly-Su-Co.html).

**Tình huống ở bước này:**

- ⚠ [SB-13 · Phiếu công việc xong mà phiếu sự cố vẫn mở](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-13)
- ⚠ [SB-14 · Phiếu sự cố nằm On Hold rất lâu](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-14)
- ⚠ [SB-15 · Đơn sửa chữa không truy được về sự cố](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-15)
- ⚠ [SB-16 · Tỉ lệ đạt của một người giảm bất thường](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-16)

---

## Câu hỏi thường gặp
{: #hoi-dap }

**Khách mới mua tháng trước, bao giờ hệ thống nhắc?**

Theo chu kỳ của từng hạng mục, tính từ ngày đơn hoàn tất — lõi thô vài tháng, thân máy vài năm.

**Khách bảo chưa cần thay, ghi thế nào?**

**Reschedule Reminder Date** nếu khách hẹn dịp khác, **Contact Later** nếu chỉ muốn gọi lại sau. Đừng dùng **Lost** cho hai trường hợp này.

**Gọi ba lần không ai nghe thì sao?**

Ghi **Unable to Contact**. Chuỗi vẫn sống và sẽ nhắc lại ở vòng sau.

**Khách gọi báo hỏng nhưng máy còn bảo hành, có lập phiếu sự cố không?**

Có. Mọi lượt báo hỏng đều lập phiếu. Bảo hành hay không chỉ quyết định có lập đơn bán hàng hay không.

**Phiếu sự cố đóng rồi, khách gọi lại cùng lỗi đó?**

Lập phiếu mới và gắn về cùng đơn hàng gốc. Lịch sử các lần báo hỏng nằm ở đó.

**Chờ linh kiện thì để phiếu ở trạng thái gì?**

**On Hold**, nhưng phải rà lại định kỳ — xem [SB-14](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html#sb-14).

---

## Đọc tiếp
{: #doc-tiep }

| Bạn cần | Mở trang |
|---|---|
| Xem cách gỡ từng tình huống | [Thẻ tình huống của phân khu E](Quy-Trinh-E-Sau-Ban-Hang-Tinh-Huong.html) |
| Tra theo thông báo lỗi | [Khi gặp trục trặc](Quy-Trinh-Tra-Cuu.html) |
| Xem toàn bộ dây chuyền | [Bản đồ tổng](00-quy-trinh.html) |
| Đi theo một đơn hàng cụ thể | [Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html) |
