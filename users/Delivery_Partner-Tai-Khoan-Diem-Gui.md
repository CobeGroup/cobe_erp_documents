---
title: Tài khoản ĐVVC & Điểm gửi
layout: default
parent: Vận chuyển & Giao nhận
nav_order: 2.5
---

# Tài khoản ĐVVC & Điểm gửi — chọn đúng thì đơn mới đi được

> Đối tượng: **quản lý kho**, **kế toán**, người dựng cấu hình. Người đặt đơn hằng ngày chỉ cần đọc
> mục [4](#4-hộp-thoại-đặt-đơn--khi-nào-được-đổi-tay) và [6](#6-cảnh-báo-trong-hộp-thoại-nghĩa-là-gì).

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

Hiện trạng *(đo 19/08/2026)*:

| Tài khoản | Công ty | Kho ảo | Điểm gửi đã đồng bộ |
|---|---|---|---|
| `Viettel Post - TGDG` | THẾ GIỚI ĐIỆN GIẢI | Kho Viettel Post - TGĐG | 36 |
| `Viettel Post - AKW` | AKANWA | Kho Viettel Post - AKW | 50 |
| `Viettel Post - DR` | DOCTOR NƯỚC | Kho Viettel Post - DR | 50 |

Ba tài khoản này **dùng chung một số đăng nhập Viettel Post**. Nên khi đồng bộ, cả ba nhận về gần
như cùng một danh sách điểm gửi — khác nhau ở chỗ bản ghi nằm dưới tài khoản nào, chứ không phải nội
dung.

> ⛔ **Ngoài ba cái trên còn 8 tài khoản dựng sẵn** — `GHN Default`, `GHTK Default`, `J&T Express
> Default`, `Ninja Van Default`, `Best Express Default`, `Ahamove Default`, `Shopee Express Default`,
> `GrabExpress Default`. **Chưa cái nào khai thông tin đăng nhập**, và cả 8 đều nằm ở công ty
> THẾ GIỚI ĐIỆN GIẢI. Chọn nhầm một trong số đó thì vận đơn dựng ra bình thường nhưng **đẩy đơn sẽ
> hỏng**, và hàng thì đã chui vào kho ảo của một hãng không dùng.

---

## 2. Quy tắc cứng: kho ảo phải thuộc đúng công ty của chứng từ

Chuyển kho của công ty A **không** đẩy hàng vào kho ảo của công ty B được — hệ thống kế toán kho
chặn thẳng, và lỗi nó ném ra (`InvalidWarehouseCompany`) thì đọc không hiểu gì.

Nên hộp thoại đặt đơn **chỉ hiện những tài khoản có kho ảo thuộc đúng công ty của phiếu**. Với phiếu
của AKANWA hay DOCTOR NƯỚC thì danh sách chỉ có một dòng; với TGĐG thì có 9 dòng (1 dùng được + 8
tài khoản rỗng), nên đọc kỹ mục 1.

Kể cả gọi thẳng qua API bỏ qua hộp thoại, hệ thống vẫn chặn lại và **nói đúng nguyên nhân** thay vì
để lỗi nổ muộn lúc Submit.

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

## 4. Hộp thoại đặt đơn — khi nào được đổi tay

Đổi được, và có ca đổi là đúng: công ty có nhiều tài khoản cùng hãng, hoặc muốn đẩy đơn qua tài khoản
khác cho tách cước.

**Đổi tài khoản thì điểm gửi được tính lại.** Đây là chỗ từng có bẫy: bản đầu tiên tính điểm gửi một
lần theo tài khoản mặc định rồi giữ nguyên, nên đổi tài khoản xong là vận đơn ôm điểm gửi của tài
khoản cũ — dựng vận đơn xong xuôi rồi mới chết ở bước **Đẩy đơn** với câu *"Điểm gửi X thuộc tài
khoản A, không phải B"*. Giờ đổi tài khoản là hệ thống hỏi lại điểm gửi + cảnh báo mới, khối thông
tin tuyến ở đầu hộp thoại cập nhật theo.

---

## 5. Điểm gửi — khai ở đâu, và vì sao không nhập địa chỉ tự do được

Viettel Post **không nhận địa chỉ người gửi nhập tay**. Đơn phải kèm mã của một kho đã đăng ký sẵn
trên cổng. Đó là lý do mọi luồng đều xoay quanh Điểm gửi chứ không phải ô địa chỉ.

Hệ quả với từng luồng:

| Luồng | Người gửi khai với ĐVVC |
|---|---|
| Bán hàng | điểm gửi của kho xuất hàng |
| Chuyển kho | điểm gửi khai trên **kho nguồn** (ô *Điểm gửi ĐVVC* trên form Kho) |
| Gửi mẫu | điểm gửi **cùng tỉnh với khách** — chọn trong hộp thoại. Xem [Gửi mẫu về lab](Delivery_Partner-Gui-Mau.html) |

**Khai cho kho:** mở form **Kho** → ô *Điểm gửi ĐVVC* → chọn điểm thuộc **tài khoản của đúng công ty
sở hữu kho đó**. Khai điểm của tài khoản khác thì hệ thống bỏ qua và cảnh báo — không phải lỗi âm
thầm, nhưng cũng không tự sửa được cho bạn.

**Hiện trạng** *(19/08/2026)*: mới **10 kho** khai điểm gửi, **toàn bộ của TGĐG**. Kho nguồn của
AKANWA và DOCTOR NƯỚC chưa kho nào trỏ điểm gửi → ĐVVC sẽ tới điểm mặc định của tài khoản (trụ sở)
chứ không tới kho tỉnh.

---

## 6. Cảnh báo trong hộp thoại nghĩa là gì

Vệt vàng trong hộp thoại **không chặn** bạn tạo vận đơn — nhưng bỏ qua thì đơn sai chặng, sai cước,
hoặc không ai tới lấy hàng.

| Cảnh báo | Nghĩa thật | Làm gì |
|---|---|---|
| *"Kho nguồn … chưa khai Điểm gửi ĐVVC cho tài khoản …"* | ĐVVC sẽ tới **trụ sở chính** lấy hàng, không tới kho tỉnh | Báo quản lý khai điểm gửi cho kho trước khi đẩy đơn |
| *"Điểm gửi khai trên kho … thuộc tài khoản A, không phải B — đã bỏ qua"* | Kho đang trỏ vào điểm của tài khoản khác | Khai lại điểm thuộc đúng tài khoản, hoặc đổi tài khoản trong hộp thoại |
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

| Việc | Hiện trạng *(19/08/2026)* |
|---|---|
| Đồng bộ điểm gửi cho cả 3 tài khoản | ✅ xong — TGDG 36, AKW 50, DR 50 |
| Địa chỉ kho | 30/225 kho có Address (10 kho mỗi công ty) — 8 kho đích nặng nhất đã xong |
| Điểm gửi trên kho nguồn | ⛔ mới 10 kho, toàn TGĐG — AKANWA và DOCTOR NƯỚC chưa kho nào |
| Điểm gửi ở Thanh Hoá | ⛔ Viettel Post chưa có điểm ở địa bàn này, phải đăng ký theo mục 7 |

---

## Liên quan

- [Quy trình vận đơn & giao nhận](Delivery_Partner-Quy-Trinh.html)
- [Chuyển kho qua ĐVVC](Delivery_Partner-Chuyen-Kho.html)
- [Gửi mẫu về lab](Delivery_Partner-Gui-Mau.html)
- [Viettel Post — Cài đặt & sử dụng](Delivery_Partner-Viettel_Post-Cai-Dat.html)
