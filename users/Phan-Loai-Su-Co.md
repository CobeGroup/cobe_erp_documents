---
title: Phân loại sự cố (Nhóm · Loại)
layout: default
parent: Dịch vụ & Bảo dưỡng
---

# Phân loại sự cố — Nhóm · Loại

Trước đây mỗi ca sự cố (Issue) chỉ có một ô **Loại sự cố** với danh sách phẳng 60 giá trị,
trộn lẫn nhiều tầng thông tin vào cùng một cái tên:

```
Nước yếu
Nước yếu do bơm
Nước yếu do lọc trong/tiền lọc
Lỗi thiết bị
Lỗi thiết bị (Màn hình)
Rò rỉ nước tại van/dây ống
```

Hệ quả: không gom nhóm để đọc báo cáo được, danh sách chọn thì dài mà vẫn thiếu, và cứ
thêm một chi tiết mới là danh mục lại phình thêm một loạt tên.

Nay tách thành **hai ô**, cả hai đều điền lúc tiếp nhận, đúng theo cách CSKH vẫn hỏi khách:

| Ô | Điền khi nào | Trả lời câu hỏi |
|---|---|---|
| **Nhóm sự cố** | Vừa nghe khách kể là biết | *Khách phàn nàn chuyện gì?* |
| **Loại sự cố** | Hỏi thêm vài câu là chốt được | *Cụ thể hỏng ở đâu?* |

Kết quả xử lý thực tế thì kỹ thuật viên ghi vào ô **Resolution Details** như trước, không
đổi gì.

Ví dụ một ca thật:

```
Nhóm sự cố = Nước yếu                      ← nghe khách kể
Loại sự cố = Nước yếu do lọc trong/tiền lọc ← hỏi thêm rồi chốt
```

## Vì sao chia hai ô mà không gộp một

Chọn Nhóm trước thì ô Loại chỉ còn hiện những cái thuộc nhóm đó — 8 dòng thay vì 75.
Không có bước lọc này thì danh sách dài không dùng nổi.

Ngoài ra **Nhóm còn là công tắc**: tắt một nhóm là toàn bộ Loại sự cố thuộc nhóm đó biến
khỏi ô chọn, thay vì phải mở từng cái tắt tay.

---

## Danh mục đã dựng sẵn

Hệ thống đã có sẵn **9 nhóm** và **50 loại**:

| Nhóm | Số loại |
|---|---|
| Lỗi thiết bị | 18 |
| Nước yếu | 8 |
| pH không đạt | 6 |
| Rò rỉ nước | 6 |
| Nước bị mùi | 5 |
| Nước bị cặn trắng hoặc cặn ván | 5 |
| Dịch vụ & kiểm tra | 3 |
| Tư vấn & hướng dẫn | 2 |
| Nước chuyển màu | 1 |

Cộng các dòng ra 54 nhưng chỉ có **50 bản ghi**, vì **một loại có thể thuộc nhiều nhóm**.
`Tiền lọc/lọc trong quá hạn` gây ra cả nước yếu, pH lệch, nước có mùi lẫn cặn trắng nên nó
xuất hiện ở cả bốn nhóm mà vẫn chỉ là một dòng.

Danh sách loại lấy từ bảng rà soát của bộ phận CSKH: **35 loại đang dùng được giữ nguyên
tên** (nên 3.858 ca lịch sử vẫn đọc liền mạch) và **15 loại khai thêm**.

Mỗi loại có ô **Mô tả** ghi các nguyên nhân thường gặp, lấy từ mind map xử lý sự cố của bộ
phận kỹ thuật — ví dụ `Lỗi thiết bị (Bảng mạch)` ghi *"Board vô nước, bị côn trùng, đoản
mạch, sai điện áp"*. Đây là gợi ý tra cứu, không phải ô phải điền.

## Vào đâu để sửa danh mục

Menu **Support** → thẻ **Issues**:

- **Nhóm sự cố** — khai các nhóm lớn
- **Issue Type** — khai Loại sự cố

### Thêm một Loại sự cố mới

Vào **Issue Type** → **Add**. Ô **Nhóm sự cố** là bảng cho phép chọn **nhiều dòng** và
**bắt buộc phải có ít nhất một** — loại không thuộc nhóm nào sẽ không bao giờ hiện ra ở ô
chọn của CSKH.

Nếu chi tiết đó xảy ra ở nhiều triệu chứng thì khai đủ các nhóm vào **một** bản ghi, đừng
tạo nhiều bản ghi tên na ná nhau.

### Ngừng dùng một Loại sự cố riêng lẻ

Tick ô **Ngừng dùng loại này** trên chính Loại đó rồi **Save**. Nó biến khỏi ô chọn ở
**mọi** nhóm, ca lịch sử giữ nguyên. Bỏ tick là hiện lại.

Ô **Đang ẩn** bên cạnh chỉ để xem, không tick được — nó là kết quả tự tính: *đã ngừng dùng
riêng*, **hoặc** *mọi nhóm của loại này đều đã tắt*.

### Tắt nhóm *Danh mục cũ*

Đây là bước **cuối cùng**, làm sau khi đã xem lại danh mục mới.

Vào **Nhóm sự cố** → *Danh mục cũ* → tick **Ngừng sử dụng** → **Save**. Toàn bộ 25 loại đã
ngừng biến khỏi ô chọn cùng lúc — gồm 17 loại bộ phận CSKH đánh dấu bỏ và 8 loại không có
trong bảng rà soát (trong đó `Không xác định` mang 16.411 ca).

Hệ thống sẽ **chặn** nếu tắt xong không còn Loại sự cố nào sống, kèm thông báo *"sẽ không
còn Issue Type nào để chọn"* — vì Loại sự cố là trường bắt buộc, hết loại là CSKH không mở
được ca mới.

### Kiểm lại

- Mở một ca bất kỳ, chọn Nhóm → ô Loại sự cố chỉ còn các loại thuộc nhóm đó
- Mở một ca cũ → vẫn giữ nguyên loại cũ của nó và nhóm *Danh mục cũ*

---

## Những điều cần biết

**Ca cũ không bị đụng tới.** 25.111 ca lịch sử giữ nguyên Loại sự cố của chúng. Tắt nhóm
chỉ ẩn khỏi ô *chọn khi nhập ca mới*, không xoá và không sửa dữ liệu cũ.

**3.858 ca đã vào đúng nhóm mới.** Ca nào mang một trong 35 loại còn dùng thì đi theo loại
đó sang nhóm thật của nó, nên báo cáo theo nhóm có số liệu ngay. 21.253 ca còn lại mang
loại đã ngừng nên ở lại *Danh mục cũ*.

**Vẫn lọc và báo cáo được ca cũ.** Nhóm *Danh mục cũ* dù đã tắt vẫn chọn được trong ô lọc
của danh sách và báo cáo — chỉ ô nhập liệu mới bị ẩn.

**Hoàn tác được bất cứ lúc nào.** Bỏ tick *Ngừng sử dụng* là 25 loại đã ngừng hiện lại y như cũ.

**Một loại thuộc nhiều nhóm chỉ ẩn khi mọi nhóm của nó đều tắt.** Tắt riêng nhóm *Nước bị
mùi* thì `Tiền lọc/lọc trong quá hạn` vẫn còn, vì nó còn thuộc *Nước yếu*, *pH không đạt* và
*Nước bị cặn* — còn một nhóm sống là còn đường chọn nó. Muốn bỏ hẳn loại đó thì dùng ô
**Ngừng dùng loại này** chứ không phải đi tắt từng nhóm.

**Loại đã ngừng dùng riêng thì bật lại nhóm cũng không kéo nó về.** Hai công tắc độc lập:
tắt nhóm là chuyện của cả cụm, ngừng loại là chuyện của riêng loại đó.

**Nhóm ghi trên ca là thứ CSKH chọn, không phải suy từ Loại.** Nhờ vậy hai ca cùng dùng
`Tiền lọc/lọc trong quá hạn` mà một ca là *Nước bị mùi*, ca kia là *pH không đạt* thì vẫn
phân biệt được khi đọc báo cáo.

**Đổi Nhóm trên một ca đang mở sẽ xoá Loại sự cố** nếu loại đó không thuộc nhóm mới — chọn
lại là xong.
