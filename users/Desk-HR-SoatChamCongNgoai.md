---
title: "Soát chấm công ngoài văn phòng"
layout: default
parent: HR (vận hành)
grand_parent: Chấm công & HR
nav_order: 3.9
---

# Soát chấm công ngoài văn phòng
{: .no_toc }

Nhân viên chấm công ngoài văn phòng thì chấm ở **đâu** — báo cáo
**COBE Remote Checkin Audit**
{: .fs-3 .text-grey-dk-000 }

<details open markdown="block">
  <summary>Mục lục</summary>
{: .text-delta }
1. TOC
{:toc}
</details>

---

## 1. Báo cáo này trả lời chuyện gì

Phiếu xin chấm công ngoài văn phòng **bỏ hẳn kiểm tra vị trí** — đó là điều kiện để kỹ thuật viên
đi thẳng từ nhà tới khách vẫn chấm công được. Đổi lại, hệ thống không còn gì để phân biệt người
đang ở nhà khách với người đang ở nhà mình.

Một nửa vấn đề đã có luật lo: ngày có phiếu mà **không chấm công lần nào** thì ngày đó không có
công (xem [Hành trình một Đề xuất chấm công bù](Hanh-Trinh-Cham-Cong-Bu.html)). Nửa còn lại —
chấm công đúng một lần rồi thôi — không luật nào bắt được, nên phải có chỗ cho người nhìn. Đây là
chỗ đó.

## 2. Mở báo cáo

Desk → ô tìm kiếm → **COBE Remote Checkin Audit**. Chọn **Từ ngày / Đến ngày** (mặc định 30 ngày
gần nhất), lọc thêm theo **Công ty**, **Phòng ban** hoặc **Nhân viên** nếu cần.

Mỗi dòng là **một ngày của một người**, chỉ gồm những lần chấm công đi qua cửa phiếu (ngoài văn
phòng). Lần chấm công tại văn phòng không nằm ở đây — chúng đã qua kiểm tra vị trí rồi.

## 3. Ba con số cần đọc cùng nhau

| Cột | Nói lên điều gì |
|---|---|
| **Cách văn phòng (m)** | Khoảng cách từ chỗ chấm công tới văn phòng đang bật gần nhất |
| **Ngày lặp cùng điểm** | Bao nhiêu ngày khác cũng chấm công trong khoảng mươi mét quanh **đúng điểm đó** |
| **Việc ngoài trong ngày** | Số lịch dịch vụ có giờ thực tế trong ngày |

Một mình thì mỗi con số đều vô nghĩa. Ghép lại mới thành câu hỏi:

- Người đi nhiều nhà khách thì toạ độ **tản ra** — *Ngày lặp cùng điểm* nhỏ.
- *Ngày lặp cùng điểm* lớn nghĩa là ngày nào cũng chấm công ở đúng một chỗ. Nếu ngày đó
  **vẫn có việc ngoài**, đó thường là người ở tỉnh chấm công tại nhà rồi mới đi khách.
- *Ngày lặp cùng điểm* lớn **và** không có việc ngoài nào: đây là dòng cần hỏi lại.

Ô **Chỉ dòng đáng xem** lọc còn đúng nhóm cuối cùng.

## 4. Đọc xong thì làm gì

| Thấy gì | Nên làm |
|---|---|
| Cả nhóm ở một tỉnh đều "xa văn phòng" và "lặp cùng điểm" | Khai thêm **Văn phòng** (`HR Office Location`) cho tỉnh đó — họ sẽ chấm công như người ở trụ sở, không cần phiếu nữa |
| Một người lặp cùng điểm nhiều ngày, **có** việc ngoài đều đặn | Bình thường. Nếu muốn chặt hơn thì khai điểm làm việc cho người đó |
| Một người lặp cùng điểm nhiều ngày, **không** có việc ngoài | Hỏi lại người đó và quản lý trực tiếp trước khi kết luận |
| Ngày có công nhưng chỉ đúng một lần chấm | Nhắc chấm đủ vào/ra — thiếu một đầu thì bảng công cũng không có giờ |

> ⚠️ Báo cáo **không kết luận thay người đọc**. Ba con số trên đều có cách giải thích lành —
> phổ biến nhất là tỉnh chưa được khai văn phòng. Dùng nó để biết **hỏi ai**, không phải để
> kết tội.

---

## Liên quan

- [Hành trình một Đề xuất chấm công bù](Hanh-Trinh-Cham-Cong-Bu.html) — hai loại đơn và luật của từng loại
- [Hạn mức đơn Chấm công bù](Desk-HR-HanMucChamCongBu.html) — phanh của đường khai bù
- [Duyệt chấm công bù](Duyet-Cham-Cong-Bu.html) — người duyệt cần biết gì
