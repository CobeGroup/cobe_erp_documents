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
Loại sự cố = Tiền lọc Expert nghẹt UF      ← hỏi thêm rồi chốt
```

## Vì sao chia hai ô mà không gộp một

Chọn Nhóm trước thì ô Loại chỉ còn hiện những cái thuộc nhóm đó — 17 dòng thay vì 132.
Không có bước lọc này thì danh sách dài không dùng nổi.

Ngoài ra **Nhóm còn là công tắc**: tắt một nhóm là toàn bộ Loại sự cố thuộc nhóm đó biến
khỏi ô chọn, thay vì phải mở từng cái tắt tay.

---

## Danh mục đã dựng sẵn

Hệ thống đã có sẵn **9 nhóm** và **72 loại**, dựng theo mind map xử lý sự cố của bộ phận
kỹ thuật:

| Nhóm | Số loại |
|---|---|
| Nước yếu | 17 |
| Rò rỉ nước | 16 |
| pH không đạt | 15 |
| Sự cố máy điện giải | 11 |
| Nước bị mùi | 8 |
| Nước bị cặn trắng hoặc cặn ván | 6 |
| Van khóa T (khóa nguồn) | 4 |
| Khách chưa quen dùng máy | 4 |
| Nước chuyển màu | 2 |

Tổng cộng chỉ 72 bản ghi vì **một loại có thể thuộc nhiều nhóm**. `Tiền lọc quá hạn` gây ra
cả pH lệch, nước có mùi lẫn cặn trắng nên nó xuất hiện ở cả ba nhóm mà vẫn chỉ là một dòng.

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

Ô **Ngừng sử dụng** trên Loại sự cố bị khoá vì nó đi theo trạng thái của nhóm.

### Tắt nhóm *Danh mục cũ*

Đây là bước **cuối cùng**, làm sau khi đã xem lại danh mục mới.

Vào **Nhóm sự cố** → *Danh mục cũ* → tick **Ngừng sử dụng** → **Save**. Toàn bộ 60 loại cũ
biến khỏi ô chọn cùng lúc.

Hệ thống sẽ **chặn** nếu tắt xong không còn Loại sự cố nào sống, kèm thông báo *"sẽ không
còn Issue Type nào để chọn"* — vì Loại sự cố là trường bắt buộc, hết loại là CSKH không mở
được ca mới.

### Kiểm lại

- Mở một ca bất kỳ, chọn Nhóm → ô Loại sự cố chỉ còn các loại thuộc nhóm đó
- Mở một ca cũ → vẫn giữ nguyên loại cũ của nó và nhóm *Danh mục cũ*

---

## Những điều cần biết

**Ca cũ không bị đụng tới.** 25.072 ca lịch sử giữ nguyên Loại sự cố của chúng và nằm trong
nhóm *Danh mục cũ*. Tắt nhóm chỉ ẩn khỏi ô *chọn khi nhập ca mới*, không xoá và không sửa
dữ liệu cũ.

**Vẫn lọc và báo cáo được ca cũ.** Nhóm *Danh mục cũ* dù đã tắt vẫn chọn được trong ô lọc
của danh sách và báo cáo — chỉ ô nhập liệu mới bị ẩn.

**Hoàn tác được bất cứ lúc nào.** Bỏ tick *Ngừng sử dụng* là 60 loại cũ hiện lại y như cũ.

**Một loại thuộc nhiều nhóm chỉ ẩn khi mọi nhóm của nó đều tắt.** Tắt riêng nhóm *Nước bị
mùi* thì `Tiền lọc quá hạn` vẫn còn, vì nó còn thuộc *pH không đạt* và *Nước bị cặn*.

**Nhóm ghi trên ca là thứ CSKH chọn, không phải suy từ Loại.** Nhờ vậy hai ca cùng dùng
`Tiền lọc quá hạn` mà một ca là *Nước bị mùi*, ca kia là *pH không đạt* thì vẫn phân biệt
được khi đọc báo cáo.

**Đổi Nhóm trên một ca đang mở sẽ xoá Loại sự cố** nếu loại đó không thuộc nhóm mới — chọn
lại là xong.
