---
title: A · Bán hàng
layout: default
parent: Quy trình hợp nhất
nav_order: 10
has_children: true
---

<!-- Trang sinh tự động bởi _tools/quy_trinh/build.py từ _quy_trinh/. Sửa tệp dữ liệu rồi chạy lại bộ sinh; sửa thẳng trang này sẽ bị ghi đè. -->

# Phân khu A — Bán hàng
{: .no_toc }

**Ai làm:** Kinh doanh · Chăm sóc khách hàng · Quản trị bán hàng
{: .fs-3 .text-grey-dk-000 }

Từ lúc khách hàng để lại thông tin cho tới lúc đơn bán hàng được xác nhận và chuyển sang bộ phận thực hiện. Đơn bán hàng là trục chính: mọi chứng từ phía sau đều tham chiếu về đơn.

| Nhận vào | Bàn giao ra |
|---|---|
| ▶ [E · Sau bán hàng](Quy-Trinh-E-Sau-Ban-Hang.html#dong-y) — Đơn từ phiếu nhắc hoặc phiếu sự cố | ◀ [B · Điều phối và hiện trường](Quy-Trinh-B-Hien-Truong.html#lap-wo) — Lập phiếu công việc |

👉 **[Các thẻ tình huống của phân khu A](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html)** · [Bản đồ tổng](00-quy-trinh.html)

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ phân khu
{: #so-do }

<div class="qt-sodo">
<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 760 1238" width="760" height="1238" role="img" aria-labelledby="qt-t-pk-A qt-d-pk-A">
<title id="qt-t-pk-A">Sơ đồ phân khu A — Bán hàng</title>
<desc id="qt-d-pk-A">Đường chính đọc từ trên xuống. Ô chữ nhật là bước, ô sáu cạnh là điểm rẽ, nhãn đỏ là thẻ tình huống, ô viền đứt là cổng sang phân khu khác.</desc>
<defs><marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker><marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker></defs>
<rect class="qt-nen" x="0" y="0" width="760" height="1238"/>
<a href="#nguon"><title>A·1 · Tiếp nhận khách tiềm năng</title>
<rect class="qt-a" x="50" y="20" width="320" height="104" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="44" r="12"/>
<text class="qt-so" x="74" y="48" text-anchor="middle">1</text>
<text class="qt-tb" x="96" y="48" text-anchor="start">Tiếp nhận khách tiềm năng</text>
<text class="qt-ts" x="96" y="64" text-anchor="start">Tổng đài, mạng xã hội,</text>
<text class="qt-ts" x="96" y="80" text-anchor="start">website, giới thiệu, nhập tay</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-01"><title>Mở thẻ BH-01</title>
<rect class="qt-pill" x="96" y="92" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="106" text-anchor="middle">⚠ BH-01</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-02"><title>Mở thẻ BH-02</title>
<rect class="qt-pill" x="166.7" y="92" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="198" y="106" text-anchor="middle">⚠ BH-02</text>
</a>
<line class="qt-mui" x1="210" y1="124" x2="210" y2="150" marker-end="url(#qt-ah)"/>
<a href="#gioi-thieu"><title>A·2 · Khai người giới thiệu, nếu có</title>
<rect class="qt-a" x="50" y="154" width="320" height="104" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="178" r="12"/>
<text class="qt-so" x="74" y="182" text-anchor="middle">2</text>
<text class="qt-tb" x="96" y="182" text-anchor="start">Khai người giới thiệu, nếu có</text>
<text class="qt-ts" x="96" y="198" text-anchor="start">Phải khai trước khi</text>
<text class="qt-ts" x="96" y="214" text-anchor="start">chuyển thành khách hàng</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-03"><title>Mở thẻ BH-03</title>
<rect class="qt-pill" x="96" y="226" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="240" text-anchor="middle">⚠ BH-03</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-04"><title>Mở thẻ BH-04</title>
<rect class="qt-pill" x="166.7" y="226" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="198" y="240" text-anchor="middle">⚠ BH-04</text>
</a>
<line class="qt-mui" x1="210" y1="258" x2="210" y2="284" marker-end="url(#qt-ah)"/>
<a href="#lien-he"><title>A·3 · Bổ sung liên hệ và địa chỉ</title>
<rect class="qt-a" x="50" y="288" width="320" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="312" r="12"/>
<text class="qt-so" x="74" y="316" text-anchor="middle">3</text>
<text class="qt-tb" x="96" y="316" text-anchor="start">Bổ sung liên hệ và địa chỉ</text>
<text class="qt-ts" x="96" y="332" text-anchor="start">Tìm theo số điện thoại trước khi lập mới</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-05"><title>Mở thẻ BH-05</title>
<rect class="qt-pill" x="96" y="344" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="358" text-anchor="middle">⚠ BH-05</text>
</a>
<line class="qt-mui" x1="210" y1="376" x2="210" y2="402" marker-end="url(#qt-ah)"/>
<a href="#dong-y"><title>Khách hàng đồng ý mua?</title>
<polygon class="qt-re" points="50,431 75,406 345,406 370,431 345,456 75,456"/>
<text class="qt-tb" x="210" y="436" text-anchor="middle">Khách hàng đồng ý mua?</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-06"><title>Mở thẻ BH-06</title>
<rect class="qt-the" x="420" y="406" width="320" height="50" rx="10" ry="10"/>
<text class="qt-tt" x="434" y="425" text-anchor="start">⚠ BH-06</text>
<text class="qt-ts" x="434" y="442" text-anchor="start">Khách hàng chưa quyết định mua</text>
</a>
<line class="qt-mui" x1="370" y1="431" x2="416" y2="431" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="395" y="424" text-anchor="middle">chưa</text>
<text class="qt-nhan" x="220" y="474" text-anchor="start">có</text>
<line class="qt-mui" x1="210" y1="456" x2="210" y2="482" marker-end="url(#qt-ah)"/>
<a href="#chuyen-doi"><title>A·4 · Chuyển thành khách hàng</title>
<rect class="qt-a" x="50" y="486" width="320" height="88" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="510" r="12"/>
<text class="qt-so" x="74" y="514" text-anchor="middle">4</text>
<text class="qt-tb" x="96" y="514" text-anchor="start">Chuyển thành khách hàng</text>
<text class="qt-ts" x="96" y="530" text-anchor="start">Kiểm tích điểm, liên hệ chính, công ty</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-07"><title>Mở thẻ BH-07</title>
<rect class="qt-pill" x="96" y="542" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="556" text-anchor="middle">⚠ BH-07</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-08"><title>Mở thẻ BH-08</title>
<rect class="qt-pill" x="166.7" y="542" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="198" y="556" text-anchor="middle">⚠ BH-08</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-09"><title>Mở thẻ BH-09</title>
<rect class="qt-pill" x="237.3" y="542" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="268.6" y="556" text-anchor="middle">⚠ BH-09</text>
</a>
<line class="qt-mui" x1="210" y1="574" x2="210" y2="600" marker-end="url(#qt-ah)"/>
<a href="#khai-don"><title>A·5 · Lập đơn bán hàng</title>
<rect class="qt-a" x="50" y="604" width="320" height="104" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="628" r="12"/>
<text class="qt-so" x="74" y="632" text-anchor="middle">5</text>
<text class="qt-tb" x="96" y="632" text-anchor="start">Lập đơn bán hàng</text>
<text class="qt-ts" x="96" y="648" text-anchor="start">Đội bán hàng, phương</text>
<text class="qt-ts" x="96" y="664" text-anchor="start">thức thanh toán, địa chỉ</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-10"><title>Mở thẻ BH-10</title>
<rect class="qt-pill" x="96" y="676" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="127.3" y="690" text-anchor="middle">⚠ BH-10</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-11"><title>Mở thẻ BH-11</title>
<rect class="qt-pill" x="166.7" y="676" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="198" y="690" text-anchor="middle">⚠ BH-11</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-12"><title>Mở thẻ BH-12</title>
<rect class="qt-pill" x="237.3" y="676" width="62.7" height="20" rx="10" ry="10"/>
<text class="qt-tp" x="268.6" y="690" text-anchor="middle">⚠ BH-12</text>
</a>
<a href="Quy-Trinh-E-Sau-Ban-Hang.html#dong-y"><title>Mở phân khu E</title>
<rect class="qt-cong" x="420" y="629" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="432" y="652" text-anchor="start">▶ Từ E · Sau bán hàng</text>
<text class="qt-ts" x="432" y="668" text-anchor="start">Đơn từ phiếu nhắc hoặc phiếu sự cố</text>
</a>
<line class="qt-mui" x1="420" y1="656" x2="374" y2="656" marker-end="url(#qt-ah)"/>
<line class="qt-mui" x1="210" y1="708" x2="210" y2="734" marker-end="url(#qt-ah)"/>
<a href="#xac-nhan"><title>A·6 · Rà soát rồi xác nhận đơn</title>
<rect class="qt-a" x="50" y="738" width="320" height="74" rx="10" ry="10"/>
<circle class="qt-tron" cx="74" cy="762" r="12"/>
<text class="qt-so" x="74" y="766" text-anchor="middle">6</text>
<text class="qt-tb" x="96" y="766" text-anchor="start">Rà soát rồi xác nhận đơn</text>
<text class="qt-ts" x="96" y="782" text-anchor="start">Hàng hoá, giá, tài khoản</text>
<text class="qt-ts" x="96" y="798" text-anchor="start">ngân hàng, thông tin hoá đơn</text>
</a>
<line class="qt-mui" x1="210" y1="812" x2="210" y2="838" marker-end="url(#qt-ah)"/>
<a href="#ban-giao"><title>Cần người đến nhà khách hàng?</title>
<polygon class="qt-re" points="50,867 75,842 345,842 370,867 345,892 75,892"/>
<text class="qt-tb" x="210" y="872" text-anchor="middle">Cần người đến nhà khách hàng?</text>
</a>
<a href="Quy-Trinh-C-Kho-Giao-Nhan.html#van-chuyen"><title>Mở phân khu C</title>
<rect class="qt-cong" x="420" y="840" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="432" y="863" text-anchor="start">◀ Sang C · Kho và giao nhận</text>
<text class="qt-ts" x="432" y="879" text-anchor="start">Giao thẳng hoặc gửi đơn vị vận chuyển</text>
</a>
<line class="qt-mui" x1="370" y1="867" x2="416" y2="867" marker-end="url(#qt-ah)"/>
<text class="qt-nhan" x="395" y="860" text-anchor="middle">không</text>
<text class="qt-nhan" x="220" y="910" text-anchor="start">có</text>
<line class="qt-mui" x1="210" y1="892" x2="210" y2="920" marker-end="url(#qt-ah)"/>
<a href="Quy-Trinh-B-Hien-Truong.html#lap-wo"><title>Mở phân khu B</title>
<rect class="qt-cong" x="50" y="924" width="320" height="54" rx="10" ry="10"/>
<text class="qt-tb2" x="210" y="947" text-anchor="middle">◀ Sang B · Điều phối và hiện trường</text>
<text class="qt-ts" x="210" y="963" text-anchor="middle">Lập phiếu công việc</text>
</a>
<a href="#sua-don"><title>Sửa, đóng và huỷ đơn</title>
<rect class="qt-ngoai" x="20" y="1014" width="720" height="204" rx="12" ry="12"/>
<text class="qt-lan" x="36" y="1040" text-anchor="start">Sửa, đóng và huỷ đơn</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-13"><title>Mở thẻ BH-13</title>
<rect class="qt-the" x="36" y="1054" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="48" y="1073" text-anchor="start">⚠ BH-13</text>
<text class="qt-ts" x="48" y="1090" text-anchor="start">Báo “Không cho phép</text>
<text class="qt-ts" x="48" y="1106" text-anchor="start">thay đổi items…”</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-14"><title>Mở thẻ BH-14</title>
<rect class="qt-the" x="270.7" y="1054" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="282.7" y="1073" text-anchor="start">⚠ BH-14</text>
<text class="qt-ts" x="282.7" y="1090" text-anchor="start">Báo không Close được</text>
<text class="qt-ts" x="282.7" y="1106" text-anchor="start">vì đã có Delivery Note</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-15"><title>Mở thẻ BH-15</title>
<rect class="qt-the" x="505.3" y="1054" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="517.3" y="1073" text-anchor="start">⚠ BH-15</text>
<text class="qt-ts" x="517.3" y="1090" text-anchor="start">Báo không đổi được</text>
<text class="qt-ts" x="517.3" y="1106" text-anchor="start">Bank Account</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-16"><title>Mở thẻ BH-16</title>
<rect class="qt-the" x="36" y="1132" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="48" y="1151" text-anchor="start">⚠ BH-16</text>
<text class="qt-ts" x="48" y="1168" text-anchor="start">Ô dữ liệu bị khoá</text>
<text class="qt-ts" x="48" y="1184" text-anchor="start">sau khi xác nhận</text>
</a>
<a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-17"><title>Mở thẻ BH-17</title>
<rect class="qt-the" x="270.7" y="1132" width="218.7" height="66" rx="10" ry="10"/>
<text class="qt-tt" x="282.7" y="1151" text-anchor="start">⚠ BH-17</text>
<text class="qt-ts" x="282.7" y="1168" text-anchor="start">Cần dừng hoặc tạm hoãn đơn</text>
</a>
</svg>
</div>

<p class="qt-chu-giai"><span class="qt-k qt-k-buoc"></span> bước <span class="qt-k qt-k-re"></span> điểm rẽ <span class="qt-k qt-k-the"></span> thẻ tình huống <span class="qt-k qt-k-cong"></span> sang phân khu khác<br>👆 Bấm vào bất kỳ ô nào để mở phần giải thích.</p>

---

## A·1 — Tiếp nhận khách tiềm năng
{: #nguon }

**Ai làm:** Kinh doanh · Chăm sóc khách hàng

Mỗi lượt khách hàng để lại thông tin thành một **phiếu khách tiềm năng** (`Lead`):

| Cách lập | Ai lập | Áp dụng cho |
|---|---|---|
| **Tự động** | Hệ thống, qua tổng đài, mạng xã hội, hộp trò chuyện trên website | Khách gọi hoặc nhắn tin; nguồn được ghi sẵn |
| **Thủ công** | Nhân viên kinh doanh nhập trên Desk | Khách đến trực tiếp, khách được giới thiệu, danh sách thu tại hội chợ |

Ô **Nguồn khách hàng** (`utm_source`) quyết định hai việc: **công ty nào tiếp nhận** khách
hàng, và khách hàng có thuộc diện **được giới thiệu** hay không.

**Tình huống ở bước này:**

- ⚠ [BH-01 · Danh sách nguồn có giá trị “(Tuyệt đối không chọn!)”](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-01)
- ⚠ [BH-02 · Một số điện thoại ra nhiều phiếu khách tiềm năng](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-02)

---

## A·2 — Khai người giới thiệu, nếu có
{: #gioi-thieu }

**Ai làm:** Kinh doanh

Hệ thống **không tự biết** ai giới thiệu ai.

**Cách khai:** mở phiếu khách tiềm năng → ô **Nguồn khách hàng** chọn `Reference` → ô
**From Customer** hiện ra → chọn khách hàng đã giới thiệu → lưu.

> 📚 Điều kiện và mức thưởng: [Loyalty — Hướng dẫn cho Sales](Loyalty-Cho-Sales.html).

**Tình huống ở bước này:**

- ⚠ [BH-03 · Không thấy ô From Customer](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-03)
- ⚠ [BH-04 · Đã chuyển đổi rồi mới biết người giới thiệu](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-04)

---

## A·3 — Bổ sung liên hệ và địa chỉ
{: #lien-he }

**Ai làm:** Kinh doanh

| Hồ sơ | Tên trên hệ thống | Dùng để |
|---|---|---|
| **Liên hệ** | `Contact` | Gọi điện, nhắn tin, in lên chứng từ |
| **Địa chỉ** | `Address` | Lắp đặt, giao hàng, xác định mã vùng của đơn vị vận chuyển |

✅ **Luôn tìm theo số điện thoại trước khi lập mới.** Khách chuyển đổi từ phiếu khách tiềm
năng thường đã có sẵn liên hệ và địa chỉ.

> 💡 Hệ thống **tự liên kết hai chiều**: chỉ cần gắn một bên trong bảng **Links**, khi lưu hệ
> thống tự bổ sung bên còn lại.

**Tình huống ở bước này:**

- ⚠ [BH-05 · Trùng liên hệ hoặc địa chỉ](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-05)

---

<div class="qt-re-khoi" id="dong-y"><strong>⬡ Khách hàng đồng ý mua?</strong><br><em>có</em> → đi tiếp xuống bước sau · <em>chưa</em> → <a href="Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-06">⚠ BH-06 · Khách hàng chưa quyết định mua</a></div>

| Trạng thái phiếu | Nghĩa |
|---|---|
| **Lead** | Mới tiếp nhận, chưa rõ nhu cầu |
| **Interested** | Có quan tâm, đang trao đổi |
| **Opportunity** | Đã lập cơ hội bán hàng cụ thể |
| **Converted** | Đã thành khách hàng |

## A·4 — Chuyển thành khách hàng
{: #chuyen-doi }

**Ai làm:** Kinh doanh

Hồ sơ khách hàng (`Customer`) giữ liên kết về phiếu gốc ở ô **Lead**. Hệ thống dùng liên kết
này để truy người giới thiệu, tự liên kết liên hệ và địa chỉ, và xác định nguồn khách hàng.

**Kiểm ngay ba thứ sau khi chuyển đổi:**

| # | Kiểm | Nếu bỏ qua |
|---|---|---|
| 1 | Đã gán **chương trình tích điểm** | Khách hàng không được cộng điểm, hệ thống không cảnh báo |
| 2 | Đã đặt **liên hệ chính** và **địa chỉ chính** | Lập đơn phải chọn thủ công, dễ chọn nhầm địa chỉ cũ |
| 3 | Ô **Công ty** đúng pháp nhân bán hàng | Đơn hàng, kho và hoá đơn lệch pháp nhân |

**Tình huống ở bước này:**

- ⚠ [BH-07 · Báo “Could not find Row … Link Name” khi lưu](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-07)
- ⚠ [BH-08 · Khách hàng bị xếp sai công ty](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-08)
- ⚠ [BH-09 · Đơn hoàn tất nhưng khách hàng không được cộng điểm](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-09)

---

## A·5 — Lập đơn bán hàng
{: #khai-don }

**Ai làm:** Kinh doanh · Nhân viên dịch vụ

| Nguồn | Cách lập |
|---|---|
| Khách hàng liên hệ mua | Lập trực tiếp trên Desk |
| Từ phiếu nhắc bảo dưỡng | **Create → Sales Order** ngay trên phiếu nhắc |
| Từ phiếu sự cố | **Create → Sales Order** ngay trên phiếu sự cố |

Hai nguồn sau phải lập **bằng chức năng trên chứng từ gốc** để giữ liên kết ngược: phiếu gốc
tự sang *Converted* khi đơn được xác nhận và tự sang *Cancelled* nếu đơn bị huỷ.

**Ba chỗ hệ thống chặn nếu sai:**

| Nội dung | Quy tắc |
|---|---|
| **Sales Team** | Tối thiểu một người, không trùng người |
| **Payment Methods** | Tổng các dòng bằng tổng giá trị đơn (lệch tối đa 100 đồng); đơn từ phiếu sự cố được miễn |
| **Khách hàng, địa chỉ, liên hệ** | Phải trỏ tới hồ sơ tồn tại, liên kết đúng |

**Tình huống ở bước này:**

- ⚠ [BH-10 · Báo thiếu hoặc trùng người trong Sales Team](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-10)
- ⚠ [BH-11 · Báo tổng Payment Method lệch Grand Total](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-11)
- ⚠ [BH-12 · Đơn lập ngoài phiếu nhắc hoặc phiếu sự cố](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-12)

---

## A·6 — Rà soát rồi xác nhận đơn
{: #xac-nhan }

**Ai làm:** Kinh doanh

**Rà trước khi xác nhận** — sửa sau vẫn được nhưng thủ tục phức tạp hơn nhiều:

- Hàng hoá, số lượng, đơn giá, chiết khấu.
- Tài khoản ngân hàng nhận tiền — đơn đã có phiếu thu là không đổi được nữa.
- Thông tin xuất hoá đơn và biên bản bàn giao: tên công ty, mã số thuế, người đại diện.

Sau khi xác nhận, trạng thái do **tiến độ giao hàng và xuất hoá đơn** quyết định:

| Trạng thái | Nghĩa |
|---|---|
| **Draft** | Chưa xác nhận |
| **To Deliver and Bill** | Chưa giao, chưa xuất hoá đơn |
| **To Bill** | Đã giao đủ, chưa xuất hoá đơn đủ |
| **To Deliver** | Đã xuất hoá đơn đủ, chưa giao đủ |
| **Completed** | Đã giao đủ **và** xuất hoá đơn đủ — mốc sinh lịch bảo dưỡng và cộng điểm |
| **Closed** | Chủ động dừng phần còn lại |
| **On Hold** | Tạm dừng xử lý |
| **Cancelled** | Đã huỷ hiệu lực |

---

<div class="qt-re-khoi" id="ban-giao"><strong>⬡ Cần người đến nhà khách hàng?</strong><br><em>có</em> → đi tiếp xuống bước sau · <em>không</em> → <a href="Quy-Trinh-C-Kho-Giao-Nhan.html#van-chuyen">◀ C · Kho và giao nhận</a> — Giao thẳng hoặc gửi đơn vị vận chuyển</div>

Một đơn có thể **không có phiếu công việc nào** (chỉ bán hàng), hoặc có một, hoặc nhiều.
Hệ thống không tự lập phiếu công việc; luôn phải có người thao tác.

## Sửa, đóng và huỷ đơn
{: #sua-don }

Chọn phương án ít tác động tới chứng từ phía sau nhất:

| Cần sửa gì | Làm cách nào |
|---|---|
| Hàng hoá, số lượng, giá, chiết khấu | **Update Items** trên đơn |
| Loại đơn, tài khoản ngân hàng, phương thức thanh toán, thông tin hoá đơn | Sửa trên form rồi **Lưu** |
| Khách hàng, bảng giá, ngày đặt, hàng đã xuất kho | **Huỷ và lập lại** (Amend) |
| Dừng phần còn lại | **Actions → Close** |
| Tạm dừng xử lý | **Actions → Hold**, mở lại bằng **Actions → Re-open** |

**Trình tự huỷ ngược:**

```
1. Phiếu thu       (Payment Entry)   → Cancel
2. Hoá đơn         (Sales Invoice)   → Cancel
3. Phiếu giao hàng (Delivery Note)   → Cancel
4. Đơn bán hàng    (Sales Order)     → Cancel
5. Trên đơn đã huỷ → Amend → bản mới ở trạng thái Nháp, mã có hậu tố -1
```

📚 Thao tác từng tình huống kèm hình: [Sửa Sales Order](Sua-Sales-Order.html).

**Tình huống ở bước này:**

- ⚠ [BH-13 · Báo “Không cho phép thay đổi items…”](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-13)
- ⚠ [BH-14 · Báo không Close được vì đã có Delivery Note](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-14)
- ⚠ [BH-15 · Báo không đổi được Bank Account](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-15)
- ⚠ [BH-16 · Ô dữ liệu bị khoá sau khi xác nhận](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-16)
- ⚠ [BH-17 · Cần dừng hoặc tạm hoãn đơn](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-17)

---

## Câu hỏi thường gặp
{: #hoi-dap }

**Khách gọi lại lần hai, có phải lập phiếu mới không?**

Không cần. Tìm theo số điện thoại, dùng lại phiếu cũ — xem [BH-02](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-02).

**Khách hàng cũ mua thêm máy, có phải lập lại từ khách tiềm năng không?**

Không. Khách hàng đã có hồ sơ thì lập thẳng đơn mới.

**Chưa biết địa chỉ lắp đặt, có chuyển đổi được không?**

Được, nhưng phải bổ sung địa chỉ trước khi lập đơn, vì đơn cần địa chỉ để điều phối và giao hàng.

**Đơn đã xác nhận rồi, khách đổi ý thêm một món, làm sao?**

Dùng **Update Items** nếu hàng chưa xuất kho. Đã xuất kho rồi thì lập đơn mới cho món thêm — xem [BH-13](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-13).

**Đóng đơn và huỷ đơn khác nhau chỗ nào?**

**Đóng** giữ lại phần đã làm, chỉ dừng phần còn lại. **Huỷ** xoá hiệu lực toàn bộ đơn — xem [BH-17](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html#bh-17).

**Đơn bị huỷ nhầm, lấy lại được không?**

Không khôi phục được, nhưng **Amend** trên đơn đã huỷ sẽ tạo bản mới giữ nguyên nội dung, mã có hậu tố `-1`.

**Khách trả trước một phần, có ghi được lên đơn không?**

Được. Khoản đặt cọc là một phiếu thu gắn với đơn — xem [phân khu D](Quy-Trinh-D-Thu-Tien.html#dong-thu).

---

## Đọc tiếp
{: #doc-tiep }

| Bạn cần | Mở trang |
|---|---|
| Xem cách gỡ từng tình huống | [Thẻ tình huống của phân khu A](Quy-Trinh-A-Ban-Hang-Tinh-Huong.html) |
| Tra theo thông báo lỗi | [Khi gặp trục trặc](Quy-Trinh-Tra-Cuu.html) |
| Xem toàn bộ dây chuyền | [Bản đồ tổng](00-quy-trinh.html) |
| Đi theo một đơn hàng cụ thể | [Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html) |
