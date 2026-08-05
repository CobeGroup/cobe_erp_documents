---
title: Phân loại sự cố (Nhóm · Loại · Nguyên nhân)
layout: default
parent: Dịch vụ & Bảo dưỡng
---

# Phân loại sự cố — Nhóm · Loại · Nguyên nhân

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
thêm một nguyên nhân mới là danh mục lại phình thêm một loạt tên.

Nay tách thành **ba tầng**, mỗi tầng trả lời một câu hỏi khác nhau và được điền ở một
thời điểm khác nhau trong đời một ca.

| Tầng | Ai điền, lúc nào | Trả lời câu hỏi |
|---|---|---|
| **Loại sự cố** | CSKH, lúc **tiếp nhận** — khi mới chỉ nghe khách kể | *Khách phàn nàn cái gì?* |
| **Nguyên nhân** | Người xử lý, lúc **đóng ca** — khi đã xem máy | *Thật ra hỏng ở đâu?* |
| **Nhóm sự cố** | **Không ai điền** — tự suy từ Loại sự cố | *Mảng nào đang ngốn nguồn lực?* |

Ví dụ một ca thật:

```
Loại sự cố   = Không ra nước           ← CSKH gõ ngay lúc nghe điện thoại
Nhóm sự cố   = Lưu lượng và cấp nước   ← tự nhảy, không ai gõ
Nguyên nhân  = Bơm                     ← kỹ thuật viên về mới điền
```

## Vì sao cần cả Nhóm lẫn Nguyên nhân

Hai chiều này cắt dữ liệu theo hai trục vuông góc nhau, không thay thế nhau được.
Cùng một nguyên nhân **Bơm** gây ra ca ở ba nhóm khác nhau:

|  | Lưu lượng | Rò rỉ | Lỗi thiết bị |
|---|---|---|---|
| **Bơm** | 32 | 2 | 57 |
| **Lọc trong – tiền lọc** | 127 | 66 | 14 |
| **Van – dây ống** | – | 77 | 150 |

- Đọc **theo hàng** là câu hỏi kỹ thuật: *bơm gây tổng cộng 91 ca, có nên đổi nhà cung cấp?*
- Đọc **theo cột** là câu hỏi điều hành: *mảng rò rỉ chiếm bao nhiêu, cần mấy kỹ thuật viên?*

Ngoài ra **Nhóm còn là công tắc**: tắt một nhóm là toàn bộ Loại sự cố thuộc nhóm đó biến
khỏi ô chọn, thay vì phải mở từng cái tắt tay.

---

## Vào đâu để khai báo

Menu **Support** → thẻ **Issues**:

- **Nhóm sự cố** — khai các nhóm lớn
- **Nguyên nhân sự cố** — khai danh mục nguyên nhân
- **Issue Type** — khai Loại sự cố

## Các bước dựng danh mục mới

Thứ tự dưới đây là **bắt buộc**, làm ngược sẽ bị hệ thống chặn.

### Bước 1 — Tạo Nhóm sự cố

Vào **Nhóm sự cố** → **Add**. Đặt tên nhóm theo cách bạn muốn *đọc báo cáo*, ví dụ:
Chất lượng nước · Rò rỉ · Lưu lượng và cấp nước · Lỗi thiết bị · Tư vấn và hướng dẫn.

Để ô **Ngừng sử dụng** trống.

### Bước 2 — Tạo Loại sự cố mới

Vào **Issue Type** → **Add**. Mỗi Loại sự cố **bắt buộc phải chọn Nhóm sự cố** — nếu bỏ
trống, hệ thống báo lỗi và không cho lưu. Lý do: Loại sự cố không có nhóm sẽ khiến mọi ca
dùng nó rơi ra ngoài báo cáo theo nhóm mà không có gì cảnh báo.

> ⚠️ **Tên không được trùng với Loại sự cố cũ.** 60 loại cũ vẫn còn trong hệ thống (đang
> nằm trong nhóm *Danh mục cũ*) nên các tên như `Nước yếu`, `Rỉ nước`, `Lỗi thiết bị` đã
> bị chiếm. Hãy thống nhất cách đặt tên trước khi ngồi nhập.

Ô **Ngừng sử dụng** trên Loại sự cố bị khoá khi loại đó đã thuộc một nhóm — vì nó đi theo
trạng thái của nhóm.

### Bước 3 — Tạo Nguyên nhân sự cố

Vào **Nguyên nhân sự cố** → **Add**. Ví dụ: Bơm · Lọc trong – tiền lọc · Van – dây ống ·
Nguồn điện · Bảng mạch · Nước nguồn · Thói quen khách hàng.

Ô **Áp dụng cho nhóm** cho phép khai **nhiều nhóm** cho cùng một nguyên nhân
(Bơm áp dụng cho cả Lưu lượng, Rò rỉ và Lỗi thiết bị).

> 💡 **Để trống ô này nghĩa là dùng chung cho mọi nhóm.** Dùng cho những nguyên nhân
> phổ quát như *Thói quen khách hàng* — khỏi phải khai lại ở từng nhóm.

Khi mở một ca, ô **Nguyên nhân** chỉ hiện những cái hợp lệ với Nhóm của ca đó, cộng thêm
các nguyên nhân dùng chung.

### Bước 4 — Tắt nhóm *Danh mục cũ*

Làm bước này **cuối cùng**, sau khi đã có đủ Loại sự cố mới.

Vào **Nhóm sự cố** → *Danh mục cũ* → tick **Ngừng sử dụng** → **Save**. Toàn bộ 60 loại cũ
biến khỏi ô chọn cùng lúc.

Nếu chưa có Loại sự cố mới nào, hệ thống sẽ **chặn** với thông báo *"sẽ không còn Issue
Type nào để chọn"* — vì Loại sự cố là trường bắt buộc, hết loại là CSKH không mở được ca mới.

### Bước 5 — Kiểm lại

- Mở một ca bất kỳ, bấm ô **Loại sự cố** → chỉ còn các loại mới
- Mở một ca cũ → vẫn giữ nguyên loại cũ của nó và nhóm *Danh mục cũ*

---

## Những điều cần biết

**Ca cũ không bị đụng tới.** 25.042 ca lịch sử giữ nguyên Loại sự cố của chúng. Tắt nhóm
chỉ ẩn khỏi ô *chọn khi nhập ca mới*, không xoá và không sửa dữ liệu cũ.

**Vẫn lọc và báo cáo được ca cũ.** Nhóm *Danh mục cũ* dù đã tắt vẫn chọn được trong ô lọc
của danh sách và báo cáo — chỉ ô nhập liệu mới bị ẩn.

**Hoàn tác được bất cứ lúc nào.** Bỏ tick *Ngừng sử dụng* là 60 loại cũ hiện lại y như cũ.

**Đổi nhóm của một Loại sự cố thì các ca đi theo.** Nếu bạn chuyển một Loại sự cố sang
nhóm khác, toàn bộ ca thuộc loại đó tự cập nhật nhóm mới, kể cả ca cũ.

**Số liệu Nguyên nhân chỉ có từ nay trở đi.** Ca lịch sử để trống ô này, vì hệ thống
không suy ngược được nguyên nhân từ dữ liệu cũ.

> ⚠️ **Ô Nguyên nhân chỉ có tác dụng nếu có người điền.** Kỹ thuật viên làm việc trên
> Phiếu công việc chứ không mở form Issue, còn CSKH lúc đóng ca thường chỉ nghe kể lại.
> Cần thống nhất rõ **ai điền và điền lúc nào**, nếu không ô này sẽ rỗng vĩnh viễn.
