---
title: Tài khoản ĐVVC & Điểm gửi
layout: default
parent: Vận chuyển & Giao nhận
nav_order: 2.5
---

# Tài khoản ĐVVC & Điểm gửi — chọn đúng thì đơn mới đi được

> Đối tượng: **quản lý kho**, **kế toán**, người dựng cấu hình. Người đặt đơn hằng ngày chỉ cần đọc
> mục [4](#4-chọn-tài-khoản-ở-đâu--mọi-luồng-như-nhau) và [6](#6-cảnh-báo-trong-hộp-thoại-nghĩa-là-gì).

Hai khái niệm này hay bị lẫn, mà lẫn là đơn chết giữa chừng. Tách cho rõ ngay từ đầu:

| | **Tài khoản ĐVVC** | **Điểm gửi** |
|---|---|---|
| Là gì | một tài khoản đăng nhập bên hãng vận chuyển | một địa chỉ lấy hàng **đã đăng ký sẵn** bên hãng, hãng cấp mã |
| Trả lời câu hỏi | *đơn này đi bằng tài khoản nào, cước trừ vào đâu* | *shipper tới chỗ nào lấy hàng* |
| Khai ở đâu | doctype **DP Partner Account** | doctype **DP Pickup Point** (kéo về bằng nút Đồng bộ) |
| Tạo tay được không | được | **không** — mã do hãng cấp, phải đăng ký trên cổng hãng rồi đồng bộ về |

Một điểm gửi **thuộc về đúng một tài khoản**. Đây là gốc của gần hết sự cố ở mục 6.

---

## 1. Vì sao có nhiều tài khoản

Mỗi công ty một tài khoản riêng, vì mỗi tài khoản gắn với một **kho ảo** — và kho ảo là kho **thật**
trong hệ thống, nên nó thuộc về một công ty.

Hiện trạng *(đo 31/08/2026)* — **hai tài khoản mỗi công ty**:

| Tài khoản | Công ty | Kho ảo | Điểm gửi đã đồng bộ |
|---|---|---|---|
| `Viettel Post - TGDG` | THẾ GIỚI ĐIỆN GIẢI | Kho Viettel Post - TGĐG | 51 |
| `Viettel Post - AKW` | AKANWA | Kho Viettel Post - AKW | 51 |
| `Viettel Post - DR` | DOCTOR NƯỚC | Kho Viettel Post - DR | 51 |
| `Viettel Post - 114 HVT - TGDG` | THẾ GIỚI ĐIỆN GIẢI | Kho Viettel Post - TGĐG | 30 |
| `Viettel Post - 114 HVT - AKW` | AKANWA | Kho Viettel Post - AKW | 30 |
| `Viettel Post - 114 HVT - DR` | DOCTOR NƯỚC | Kho Viettel Post - DR | 30 |

Ba tài khoản đầu **dùng chung một số đăng nhập Viettel Post**. Nên khi đồng bộ, cả ba nhận về gần
như cùng một danh sách điểm gửi — khác nhau ở chỗ bản ghi nằm dưới tài khoản nào, chứ không phải nội
dung.

Ba tài khoản `114 HVT` là **hợp đồng thứ hai**, số đăng nhập khác, nên danh sách điểm gửi của chúng
cũng khác (30 điểm). Hai tài khoản của cùng một công ty **dùng chung một kho ảo** — nên xét theo công
ty thì cả hai đều hợp lệ, và **người đặt đơn phải tự chọn đúng hợp đồng muốn trừ cước**.

> ⛔ **Ngoài ba cái trên còn 8 tài khoản dựng sẵn** — `GHN Default`, `GHTK Default`, `J&T Express
> Default`, `Ninja Van Default`, `Best Express Default`, `Ahamove Default`, `Shopee Express Default`,
> `GrabExpress Default`. **Chưa cái nào khai thông tin đăng nhập**, và cả 8 đều nằm ở công ty
> THẾ GIỚI ĐIỆN GIẢI. Chọn nhầm một trong số đó thì vận đơn dựng ra bình thường nhưng **đẩy đơn sẽ
> hỏng**, và hàng thì đã chui vào kho ảo của một hãng không dùng.
>
> Từ 19/08/2026 các ô chọn **không bày chúng ra nữa**. Vẫn gặp lại được trong đúng một trường hợp:
> vận đơn **tạo tay chưa gắn chứng từ nguồn** — lúc đó hệ thống không suy được công ty nên không lọc
> gì cả, và bày ra đủ 14 tài khoản.

---

## 2. Quy tắc cứng: kho ảo phải thuộc đúng công ty của chứng từ

Chuyển kho của công ty A **không** đẩy hàng vào kho ảo của công ty B được — hệ thống kế toán kho
chặn thẳng, và lỗi nó ném ra (`InvalidWarehouseCompany`) thì đọc không hiểu gì.

Nên mọi ô chọn tài khoản **chỉ hiện những tài khoản có kho ảo thuộc đúng công ty của chứng từ**, và
lọc thêm một lần nữa: bỏ hết tài khoản **chưa khai thông tin đăng nhập**. Kết quả *(31/08/2026)* là
mỗi công ty còn **hai dòng** — hợp đồng cũ và hợp đồng `114 HVT`. Cả hai đều đi được; khác nhau ở
**cước trừ vào hợp đồng nào** và **điểm gửi nào dùng được**, nên xem mục 3 để biết hệ thống mồi sẵn
cái nào.

Kể cả gọi thẳng qua API bỏ qua hộp thoại, hệ thống vẫn chặn lại **lúc lưu vận đơn** và nói đúng
nguyên nhân, thay vì để lỗi nổ muộn lúc sinh chứng từ kho.

---

## 3. Hệ thống tự chọn tài khoản theo thứ tự nào

Khi mở hộp thoại, ô Tài khoản đã được điền sẵn. Thứ tự ưu tiên, xét từ trên xuống:

1. Tài khoản **sở hữu điểm gửi đang khai trên kho nguồn** — sát ý người khai nhất
2. Tài khoản **có thông tin đăng nhập**
3. Tài khoản **đã đồng bộ điểm gửi**
4. Tài khoản đánh dấu **mặc định**
5. Xếp theo tên

Tiêu chí 2 và 3 tồn tại chính vì 8 tài khoản rỗng ở trên: cả 8 đều đánh dấu *mặc định*, nên nếu chỉ
xét *mặc định* thì hệ thống sẽ bốc bừa một cái theo thứ tự bảng chữ cái. Chuyện này **đã xảy ra thật**
trong lúc thử.

---

## 4. Chọn tài khoản ở đâu — mọi luồng như nhau

Cả bốn luồng đều **hỏi tài khoản ngay lúc đặt đơn**, và danh sách **luôn lọc theo công ty của chứng
từ gốc**:

| Đặt đơn từ | Hỏi ở đâu | Điền sẵn cái gì |
|---|---|---|
| **Đơn bán hàng** | hộp thoại *Tạo vận đơn ĐVVC* | tài khoản hạng nhất của công ty trên đơn |
| **Phiếu chuyển kho** | hộp thoại *Tạo vận đơn ĐVVC* | tài khoản hạng nhất, ưu tiên chủ của điểm gửi khai trên kho nguồn |
| **Phiếu yêu cầu xét nghiệm** | hộp thoại *Đặt ĐVVC lấy mẫu* | tài khoản khai trong `DP Cobe Settings` |
| **Tạo tay trên Desk** | trên form vận đơn | không điền sẵn |

Đổi được ở mọi chỗ — không có luồng nào khoá cứng.

### Vì sao danh sách bị lọc

Kho ảo của tài khoản là kho **thật**, thuộc một công ty. Hàng của công ty A không đẩy vào kho ảo của
công ty B được. Trước đây ô này chỉ lọc theo **hãng**, nên trên đơn của THẾ GIỚI ĐIỆN GIẢI vẫn chọn
được `Viettel Post - AKW`: vận đơn lưu được, Submit cũng qua, và chỉ vỡ lúc sinh chứng từ kho bằng
một lỗi đọc không hiểu — sau khi người dùng đã nhập xong tất cả.

Giờ danh sách chỉ hiện tài khoản đi được, **và hệ thống kiểm lại lần nữa lúc lưu**. Lọc ở giao diện
chỉ là hàng rào đầu tiên; chốt thật nằm ở máy chủ, nên đổi ô sau khi hộp thoại đóng hay sửa tay đều
không lách được.

> Mẹo nhìn nhanh: **hậu tố tên tài khoản phải khớp công ty của chứng từ** — `- TGDG` · `- AKW` · `- DR`.

Ô chọn cũng **bỏ luôn 8 tài khoản chưa khai thông tin đăng nhập** ở mục 1 — chúng không đẩy đơn được
nên bày ra chỉ để người dùng bấm nhầm. Chúng vẫn còn trong hệ thống, chỉ là không hiện ở ô chọn nữa.

**Gửi mẫu là ngoại lệ có chủ ý:** luồng này không sinh chứng từ kho nào nên chẳng có gì để ERPNext
từ chối — chặn ở đó là bịa ra một ràng buộc không có thật. Danh sách của nó gồm tài khoản của công ty
trên phiếu **cộng thêm** tài khoản khai trong `DP Cobe Settings`, kể cả khi tài khoản đó thuộc công
ty khác. Hai nguồn đó là hai bên trả cước hợp lý (công ty làm xét nghiệm, hoặc công ty của lab); tài
khoản ngoài hai nguồn vẫn bị chặn.

### Đổi tài khoản thì cái gì đổi theo

| Đổi theo | Vì sao |
|---|---|
| **Điểm gửi** | đăng ký theo từng tài khoản — giữ lại là gửi mã kho của tài khoản khác, hãng không nhận. Hộp thoại tính lại điểm mồi sẵn; trên form thì ô bị xoá để chọn lại |
| **Dịch vụ giao** | mã dịch vụ khai theo **hợp đồng của từng tài khoản** — giữ lại là gửi mã tài khoản mới không có |

Trông như mất dữ liệu nhưng không phải: hai ô đó buộc phải thuộc cùng một tài khoản với vận đơn.

Chuyện tính lại điểm gửi này từng là bẫy thật: bản đầu tiên tính một lần theo tài khoản mặc định rồi
giữ nguyên, nên đổi tài khoản xong là vận đơn ôm điểm gửi của tài khoản cũ — dựng xong xuôi rồi mới
chết ở bước **Đẩy đơn** với câu *"Điểm gửi X thuộc tài khoản A, không phải B"*.

### Trên form vận đơn: hai ô, đúng thứ tự

Với vận đơn tạo tay, chọn **Partner** (hãng) trước rồi mới tới **Partner Account** — ô sau lọc theo
hãng đã chọn. Vận đơn không gắn chứng từ gốc thì không suy được công ty nên **không lọc thêm**: thà
để rộng còn hơn khoá sạch ô.

---

## 5. Điểm gửi — khai ở đâu, và vì sao không nhập địa chỉ tự do được

Viettel Post **không nhận địa chỉ người gửi nhập tay**. Đơn phải kèm mã của một kho đã đăng ký sẵn
trên cổng. Đó là lý do mọi luồng đều xoay quanh Điểm gửi chứ không phải ô địa chỉ.

Hệ quả với từng luồng:

| Luồng | Người gửi khai với ĐVVC |
|---|---|
| Bán hàng | điểm gửi của kho xuất hàng |
| Chuyển kho | điểm gửi khai trên **kho nguồn** cho **đúng tài khoản đang chọn** (bảng *Điểm gửi ĐVVC* trên form Kho) |
| Gửi mẫu | điểm gửi **cùng tỉnh với khách** — chọn trong hộp thoại. Xem [Gửi mẫu về lab](Delivery_Partner-Gui-Mau.html) |

**Khai cho kho:** mở form **Kho** → bảng *Điểm gửi ĐVVC* (`DP Warehouse Pickup Point`) → thêm một
dòng gồm **Tài khoản ĐVVC** và **Điểm gửi** thuộc tài khoản đó. Một kho vật lý đăng ký được ở nhiều
tài khoản bên ĐVVC (mỗi tài khoản một mã điểm riêng), nên kho dùng bao nhiêu tài khoản thì khai bấy
nhiêu dòng — mỗi tài khoản đúng một dòng. Ô *Điểm gửi* chỉ liệt kê điểm đang bật của tài khoản ở cùng
dòng; chọn chéo tài khoản hoặc khai hai dòng cùng tài khoản thì hệ thống **chặn ngay khi lưu Kho**.

Khi lưu, hệ thống đồng thời điền ô *Warehouse* trên chính bản ghi `DP Pickup Point` (chiều ngược,
dùng cho [report đối chiếu kho xuất](../tech/Delivery_Partner-Lifecycle.html)) nếu ô đó đang trống —
không đè lên giá trị đã khai tay.

> Tài khoản **mới** (vd. thêm *Viettel Post - 114 HVT - TGDG*): bấm *Đồng bộ điểm gửi* trên tài
> khoản đó trước để có danh sách điểm, rồi mới thêm dòng cho tài khoản này trên từng kho nguồn.

**Hiện trạng** *(31/08/2026)*: mới **10 kho** khai điểm gửi, **10 dòng, toàn bộ cho một tài khoản
duy nhất là `Viettel Post - TGDG`**. Năm tài khoản còn lại — kể cả `AKW` và `DR` của hai công ty kia,
lẫn cả ba hợp đồng `114 HVT` — **chưa kho nào khai dòng nào**. Đặt đơn bằng những tài khoản đó thì
ĐVVC tới điểm mặc định của tài khoản (trụ sở) chứ không tới kho tỉnh.

---

## 6. Cảnh báo trong hộp thoại nghĩa là gì

Vệt vàng trong hộp thoại **không chặn** bạn tạo vận đơn — nhưng bỏ qua thì đơn sai chặng, sai cước,
hoặc không ai tới lấy hàng.

| Cảnh báo | Nghĩa thật | Làm gì |
|---|---|---|
| *"Kho nguồn … chưa khai Điểm gửi ĐVVC cho tài khoản …"* (có thể kèm *"Kho này mới khai điểm gửi cho: A"*) | Kho chưa có dòng cho tài khoản đang chọn → ĐVVC sẽ tới **trụ sở chính** lấy hàng, không tới kho tỉnh | Báo quản lý thêm dòng cho tài khoản này vào bảng *Điểm gửi ĐVVC* trên Kho, hoặc chọn lại tài khoản đã khai (A) |
| *"Điểm gửi khai trên kho … thuộc tài khoản A, không phải B — đã bỏ qua"* | Dòng trên kho bị sửa lệch sau khi khai (điểm của tài khoản khác) | Sửa lại dòng đó trên form Kho |
| *"Điểm gửi … khai trên kho … đã bị tắt — đã bỏ qua"* | Điểm đã bị tắt (`is_active` = 0) sau khi khai | Chọn điểm khác cho dòng đó trên form Kho |
| *"Không dò được tỉnh của địa chỉ khách nên điểm gửi đang mồi theo điểm MẶC ĐỊNH"* | Địa chỉ khách thiếu Tỉnh/Quận nên không gợi ý được | Kiểm tay điểm gửi cho đúng nơi cần tới lấy |
| *"Kho đích chưa có địa chỉ"* | **Chặn cứng** — không tạo được vận đơn | Khai Address cho kho đích, nhớ cả số điện thoại |

---

## 7. Đồng bộ & đăng ký điểm gửi mới

**Đồng bộ** (kéo danh sách từ hãng về): mở **DP Partner Account** → nút **Đồng bộ điểm gửi**. Chạy
lại bao nhiêu lần cũng được, nó chỉ đọc.

**Đăng ký điểm mới** — làm trên **cổng của hãng**, không làm trong ERP. Tạo tay một bản ghi
*DP Pickup Point* là vô nghĩa: mã điểm do hãng cấp, khai bừa thì đẩy đơn hãng không nhận.

Trình tự bắt buộc:

1. Vào cổng Viettel Post, tạo một **địa chỉ lấy hàng / kho hàng** cho tài khoản đang dùng
2. Điền đủ **tên điểm**, **số điện thoại**, và **địa chỉ chọn đủ ba cấp Tỉnh → Quận/Huyện → Phường/Xã**
   (chọn từ danh mục, không gõ tự do — hệ thống lấy mã vùng từ đó, thiếu là điểm không dùng được)
3. Về ERP bấm **Đồng bộ điểm gửi**
4. Gán điểm mới vào kho, hoặc chọn nó trong hộp thoại

> 💡 **Đặt tên điểm cho dễ tìm.** Danh sách hiện có nhiều điểm tên kiểu *"Khách hàng"*, *"Chú Mẫn"*,
> *"Anh Truyền"* — đúng địa chỉ nhưng nhìn tên không biết là kho nào. Điểm mới nên đặt kiểu
> **"TGĐG Thanh Hoá"**.

---

## 8. Việc còn treo

| Việc | Hiện trạng *(31/08/2026)* |
|---|---|
| Đồng bộ điểm gửi | ✅ cả 6 tài khoản — hợp đồng cũ 51 điểm/tài khoản, `114 HVT` 30 điểm/tài khoản |
| Địa chỉ kho | 33/228 kho có Address (11 kho mỗi công ty) — 8 kho đích nặng nhất đã xong |
| Điểm gửi trên kho nguồn | ⛔ mới 10 kho / 10 dòng, **chỉ cho `Viettel Post - TGDG`** — 5 tài khoản còn lại chưa kho nào khai |
| Cấu hình gửi mẫu (`DP Cobe Settings`) | ⛔ thiếu **Tài khoản ĐVVC**, **Item vật mang**, **Giá trị khai** — nút gửi mẫu chưa dùng được |
| Điểm gửi ở Thanh Hoá | ⛔ Viettel Post chưa có điểm ở địa bàn này, phải đăng ký theo mục 7 |
| Vận đơn nháp `SHIP-DP-2026-398778` | ⛔ chọn sai tài khoản — xem dưới |

### Vận đơn nháp sai tài khoản, cần sửa tay

Rà lại toàn bộ vận đơn đang có, đúng **một** cái vướng chốt mới:

| | |
|---|---|
| Vận đơn | `SHIP-DP-2026-398778` — nháp, tạo 24/07/2026 |
| Đơn bán hàng | `SO-26-398728`, công ty **AKANWA** |
| Nhưng tài khoản đang chọn | `Viettel Post - TGDG` — kho ảo của **THẾ GIỚI ĐIỆN GIẢI** |
| Và kho lấy hàng | `KHO HỒ CHÍ MINH - TGĐG` |

Đây đúng là loại nhầm mà mục 2 nói tới, và nó **đã xảy ra thật** trước khi có chốt. Vận đơn này chưa
sinh chứng từ nào; Submit nó thì kiểu gì cũng vỡ, chỉ là vỡ muộn hơn và bằng một lỗi khó hiểu hơn.

Sửa: mở vận đơn → đổi **Tài khoản ĐVVC** sang `Viettel Post - AKW`, đổi **kho lấy hàng** sang kho của
AKANWA → Lưu. Không còn cần nữa thì xoá luôn.

> Lưu ý: từ khi có chốt, **mở ra bấm Lưu mà không sửa tài khoản thì hệ thống báo lỗi** và không cho
> lưu. Đó là cố ý — nhưng nghĩa là vận đơn nháp này không để nguyên đó được.

---

## Liên quan

- [Quy trình vận đơn & giao nhận](Delivery_Partner-Quy-Trinh.html)
- [Chuyển kho qua ĐVVC](Delivery_Partner-Chuyen-Kho.html)
- [Gửi mẫu về lab](Delivery_Partner-Gui-Mau.html)
- [Viettel Post — Cài đặt & sử dụng](Delivery_Partner-Viettel_Post-Cai-Dat.html)
