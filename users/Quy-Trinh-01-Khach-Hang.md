---
title: 1 · Từ khách tiềm năng đến khách hàng
layout: default
parent: Quy trình hợp nhất
nav_order: 2
---

# Chặng 1 — Từ khách tiềm năng đến khách hàng
{: .no_toc }

**Ai làm:** Kinh doanh · Chăm sóc khách hàng · Quản trị bán hàng
{: .fs-3 .text-grey-dk-000 }

| Nhận vào | Bàn giao ra |
|---|---|
| Thông tin liên hệ của người có nhu cầu | Khách hàng chính thức, có liên hệ và địa chỉ → [Chặng 2](Quy-Trinh-02-Don-Hang.html) |

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ chặng

<div style="position:relative;width:100%;padding-bottom:51.92%">
  <object type="image/svg+xml" data="images/svg/quy-trinh/02-khach-hang.svg" style="position:absolute;inset:0;width:100%;height:100%;border:0">
    <img src="images/svg/quy-trinh/02-khach-hang.svg" alt="Năm nguồn khách hàng xếp thành một cột bên trái, mỗi nguồn có một mũi tên riêng dẫn vào phiếu khách tiềm năng. Từ phiếu khách tiềm năng lập liên hệ và địa chỉ, sau đó chuyển đổi thành khách hàng. Dải phía dưới là bốn trạng thái của phiếu khách tiềm năng" style="width:100%;height:auto">
  </object>
</div>

👆 **Bấm vào từng ô** để mở phần giải thích.
{: .fs-3 }

---

## 1. Nguồn khách hàng
{: #nguon }

Mỗi lượt khách hàng để lại thông tin đều thành một **phiếu khách tiềm năng** (`Lead`), lập theo
hai cách:

| Cách lập | Ai lập | Áp dụng cho |
|---|---|---|
| **Tự động** | Hệ thống, qua tổng đài, mạng xã hội, hộp trò chuyện trên website | Khách gọi hoặc nhắn tin; nguồn được ghi sẵn |
| **Thủ công** | Nhân viên kinh doanh nhập trên Desk | Khách đến trực tiếp, khách được giới thiệu, danh sách thu tại hội chợ |

Ô **Nguồn khách hàng** (`utm_source`) là ô quan trọng nhất trên phiếu, vì nó quyết định hai thứ:

1. **Công ty nào tiếp nhận** khách hàng — tập đoàn có nhiều pháp nhân, mỗi nguồn được khai sẵn
   thuộc công ty nào.
2. Khách hàng có thuộc diện **được giới thiệu** hay không, tức có phát sinh thưởng hay không.

> ⚠️ Trong danh sách nguồn có những giá trị mang tiền tố **“(Tuyệt đối không chọn!)”**. Đó là
> nguồn cũ giữ lại cho dữ liệu lịch sử. **Không chọn** khi lập phiếu mới.

---

## 2. Khai người giới thiệu
{: #gioi-thieu }

Hệ thống **không tự biết** ai giới thiệu ai. Phải khai, và phải khai **ngay ở bước khách tiềm
năng**, trước khi chuyển thành khách hàng.

**Cách khai:** mở phiếu khách tiềm năng → ô **Nguồn khách hàng** chọn `Reference` → ô
**From Customer** hiện ra → chọn khách hàng đã giới thiệu → lưu.

⛔ Khai sau khi đã chuyển đổi thì mắt xích truy vết không còn đúng, phải nhờ quản trị viên sửa
thủ công.

> 📚 Điều kiện và mức thưởng: [Loyalty — Hướng dẫn cho Sales](Loyalty-Cho-Sales.html).

---

## 3. Bốn trạng thái của phiếu
{: #trang-thai }

| Trạng thái | Nghĩa |
|---|---|
| **Lead** | Mới tiếp nhận, chưa rõ nhu cầu |
| **Interested** | Có quan tâm, đang trao đổi |
| **Opportunity** | Đã lập cơ hội bán hàng cụ thể |
| **Converted** | Đã thành khách hàng |

Hai trạng thái giữa hầu như không dùng: phần lớn phiếu đi thẳng từ *Lead* sang *Converted* khi
khách hàng đồng ý mua. Lập cơ hội bán hàng (`Opportunity`) là bước **tuỳ chọn**, chỉ dùng cho
thương vụ cần theo dõi qua nhiều bước.

---

## 4. Liên hệ và địa chỉ
{: #lien-he }

Khách hàng cần thêm hai hồ sơ nữa mới giao dịch được:

| Hồ sơ | Tên trên hệ thống | Dùng để |
|---|---|---|
| **Liên hệ** | `Contact` | Gọi điện, nhắn tin, in lên chứng từ |
| **Địa chỉ** | `Address` | Lắp đặt, giao hàng, xác định mã vùng của đơn vị vận chuyển |

✅ **Luôn tìm theo số điện thoại trước khi lập mới.** Khách chuyển đổi từ phiếu khách tiềm năng
thường đã có sẵn liên hệ và địa chỉ; lập thêm là sinh bản trùng, về sau không biết bản nào đúng.

> 💡 Hệ thống **tự liên kết hai chiều**: chỉ cần gắn một bên trong bảng **Links**, khi lưu hệ
> thống tự bổ sung bên còn lại — với điều kiện hồ sơ khách hàng đang trỏ đúng phiếu khách tiềm
> năng.

---

## 5. Chuyển thành khách hàng
{: #chuyen-doi }

Khách hàng đồng ý mua thì chuyển phiếu thành **khách hàng** (`Customer`). Hồ sơ khách hàng giữ
liên kết về phiếu gốc ở ô **Lead**, và hệ thống dùng liên kết này để truy vết người giới thiệu,
tự liên kết liên hệ và địa chỉ, và xác định nguồn khách hàng khi làm báo cáo.

**Kiểm ngay ba thứ sau khi chuyển đổi:**

| # | Kiểm | Nếu bỏ qua |
|---|---|---|
| 1 | Đã gán **chương trình tích điểm** | Khách hàng không được cộng điểm, hệ thống không cảnh báo |
| 2 | Đã đặt **liên hệ chính** và **địa chỉ chính** | Lập đơn phải chọn thủ công, dễ chọn nhầm địa chỉ cũ |
| 3 | Ô **Công ty** đúng pháp nhân bán hàng | Đơn hàng, kho và hoá đơn lệch pháp nhân |

---

## 6. Khi gặp trục trặc
{: #truc-trac }

| Hiện tượng | Nguyên nhân | Cách gỡ |
|---|---|---|
| Lưu đơn báo `Could not find Row #2: Link Name: <tên>` | Hồ sơ khách hàng trỏ tới phiếu khách tiềm năng **đã bị đổi tên** | Tìm phiếu đúng theo số điện thoại, cập nhật ô **Lead**. Xem [Sửa lỗi liên kết Khách hàng](Sua-Loi-Lien-Ket-Khach-Hang.html) |
| Một số điện thoại ra nhiều phiếu khách tiềm năng | Khách liên hệ nhiều lần qua nhiều kênh | Chọn phiếu **Converted** khớp nhất; các phiếu còn lại giữ làm lịch sử |
| Ô **Lead** trên hồ sơ khách hàng bị khoá | Ô này chỉ mở cho quản trị viên | Gửi quản trị viên: mã khách hàng lỗi và mã phiếu đúng |
| Khách hàng bị xếp **sai công ty** | Nguồn khách hàng khai cho nhiều công ty nên hệ thống không suy ra được | Sửa ô Công ty **trước khi** chuyển đổi |
| Không thấy ô **From Customer** | Ô chỉ hiện với nguồn `Reference` và `Existing Customer` | Kiểm lại giá trị đã chọn |
| Đã chuyển đổi rồi mới biết ai giới thiệu | Mắt xích truy vết không còn đủ | Gửi quản trị viên: mã khách hàng mới, mã khách hàng giới thiệu, mã đơn đầu tiên |
| Trùng liên hệ hoặc địa chỉ | Không tìm theo số điện thoại trước khi lập mới | Xoá bản vừa lập, gắn lại bản cũ qua bảng **Links** |

---

## 7. Câu hỏi thường gặp
{: #hoi-dap }

**Khách gọi lại lần hai, có phải lập phiếu mới không?**

Không cần. Tìm theo số điện thoại, dùng lại phiếu cũ. Phiếu tự động vẫn có thể sinh thêm, khi
chuyển đổi thì chọn phiếu khớp nhất.

**Khách hàng cũ mua thêm máy, có phải lập lại từ khách tiềm năng không?**

Không. Khách hàng đã có hồ sơ thì lập thẳng đơn mới.

**Chưa biết địa chỉ lắp đặt, có chuyển đổi được không?**

Được, nhưng phải bổ sung địa chỉ trước khi lập đơn, vì đơn cần địa chỉ để điều phối và giao hàng.

**Chọn nhầm nguồn khách hàng rồi thì sao?**

Sửa lại ngay trên phiếu nếu chưa chuyển đổi. Đã chuyển đổi rồi thì ô Công ty và phần thưởng
giới thiệu đã bị ảnh hưởng, cần báo quản trị viên.

**Khách hàng có hai số điện thoại thì để đâu?**

Một hồ sơ **Liên hệ** chứa được nhiều số. Đừng lập hai hồ sơ khách hàng.

---

## Chặng tiếp theo

Khách hàng đã sẵn sàng. Bước kế tiếp: **[Chặng 2 — Đơn bán hàng](Quy-Trinh-02-Don-Hang.html)**.
