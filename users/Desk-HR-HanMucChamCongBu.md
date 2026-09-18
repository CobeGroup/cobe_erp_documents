---
title: "Hạn mức đơn Chấm công bù theo tháng"
layout: default
parent: HR (vận hành)
grand_parent: Chấm công & HR
nav_order: 3.8
---

# Hạn mức đơn Chấm công bù
{: .no_toc }

Một tháng mỗi nhân viên được nộp bao nhiêu đơn *Chấm công bù* — khai bằng
**Hạn mức đơn chấm công bù** (`HR Attendance Request Quota`)
{: .fs-3 .text-grey-dk-000 }

<details open markdown="block">
  <summary>Mục lục</summary>
{: .text-delta }
1. TOC
{:toc}
</details>

---

## 1. Vấn đề mà hạn mức giải quyết

Đơn **Chấm công bù** (`Attendance Request`, lý do *On Duty*) là đường để nhân viên xin ghi
nhận công cho ngày quên chấm công hoặc đi làm ngoài văn phòng. Đường này cần thiết, nhưng
khi dùng quá thường xuyên thì việc chấm công thực tế mất ý nghĩa — công được ghi bằng lời
khai chứ không bằng dữ liệu.

Hệ thống đã có **hạn nộp** (khai lùi tối đa bao nhiêu ngày sau khi việc xảy ra, xem
[Hạn nộp phiếu & ràng buộc](HR-Filing-Deadline.html)). Hạn nộp trả lời *"còn được khai lùi
mấy ngày"*; hạn mức trả lời *"một tháng được khai mấy lần"*. Hai câu hỏi khác nhau nên là
hai luật riêng, khai ở hai nơi.

> ⚠️ **Hạn mức chỉ đếm đơn KHAI BÙ** — đơn nộp cho **ngày đã qua**. Đơn nộp cho **hôm nay
> hoặc ngày tới** không bị đếm và không bao giờ bị chặn: đó là đơn **xin phép trước** để
> chấm công ngoài văn phòng, kỹ thuật viên đi thẳng từ nhà tới nhà khách bắt buộc phải có
> đơn thì mới quẹt được. Chặn nó là chặn việc hằng ngày chứ không hãm được lạm dụng.

---

## 2. Luật tra hạn mức

Bản ghi hạn mức gán cho **một nhân viên** hoặc **một công ty**, có ngày hiệu lực — cùng
khuôn với gán lịch nghỉ (`Holiday List Assignment`), để HR chỉ phải nhớ một cách làm.

Khi nhân viên nộp đơn, hệ thống tra theo thứ tự:

1. **Bản gán cho chính nhân viên** — bản đã Submit có *Hiệu lực từ ngày* lớn nhất mà không
   muộn hơn ngày đầu của đơn. Nếu bản đó đã quá *Hiệu lực đến ngày* thì coi như nhân viên
   không có bản riêng và rơi xuống bậc 2 (không lấy bản cũ hơn — bản mới đã thay bản cũ).
2. **Bản gán cho công ty** của nhân viên, theo cùng phép chọn.
3. **Không có bản nào = không giới hạn.**

> **Số 0 nghĩa là không giới hạn**, không phải "chặn sạch". Hai lý do: hệ thống lưu ô số
> để trống thành 0, nên quên điền không được biến thành khoá cứng; và nhờ đó, gán một bản
> **0** cho một nhân viên chính là cách **miễn** hạn mức chung của công ty cho đúng người
> đó — kỹ thuật viên đi tỉnh nộp 21–23 đơn một tháng là việc hợp lệ.

### Đếm những đơn nào

| Tiêu chí | Giá trị |
|---|---|
| Loại đơn | Chỉ **Chấm công bù / Công tác** (*On Duty*). Đơn **Làm việc tại nhà** (WFH) đi luồng riêng, không đếm |
| Trạng thái | **Đang chờ duyệt và đã duyệt** đều đếm — không đếm đơn chờ thì nộp một lúc mười đơn nháp là lách xong |
| Thuộc tháng nào | Tháng dương lịch của **ngày đầu** trong đơn. Đơn nhiều ngày vắt qua hai tháng tính vào tháng của ngày đầu |
| Không đếm | Đơn bị từ chối (đã bị xoá) và đơn đã huỷ |

Mốc tra là **ngày đầu của đơn**, không phải hôm nay: bật hạn mức từ 01/10 thì đơn cho ngày
28/09 dù nộp ngày 02/10 vẫn không bị đếm theo luật mới. Cùng nguyên tắc không hồi tố với
hạn nộp.

---

## 3. Khai một hạn mức

**Vào bằng đâu:** ô tìm kiếm trên Desk, gõ `HR Attendance Request Quota`; hoặc mở
`/app/hr-attendance-request-quota`.

| Trường | Cách điền |
|---|---|
| Áp dụng cho | **Employee** (một người) hoặc **Company** (cả công ty) |
| Gán cho | Chọn nhân viên hoặc công ty tương ứng |
| Hiệu lực từ ngày | Ngày đầu tiên luật này áp dụng |
| Hiệu lực đến ngày | Bỏ trống = có hiệu lực tới khi có bản gán mới hơn cho cùng đối tượng. Điền nếu là hạn mức tạm thời, để nó tự hết mà không phải nhớ huỷ |
| Số đơn tối đa mỗi tháng | Số đơn. **0 = không giới hạn** |

Bản ghi phải **Submit** mới có hiệu lực. Hệ thống chặn hai bản cùng đối tượng cùng ngày
hiệu lực — hai bản tranh nhau thì không đoán được bản nào thắng.

### Ví dụ

**Đặt trần chung, mở riêng cho kỹ thuật viên đi tỉnh:**

| Áp dụng cho | Gán cho | Hiệu lực từ | Số đơn tối đa |
|---|---|---|---|
| Company | Cobe Group | 01/10/2026 | 5 |
| Employee | (KTV đi tỉnh) | 01/10/2026 | 0 |

Bản của nhân viên thắng bản của công ty, mà 0 nghĩa là không giới hạn — người đó nộp bao
nhiêu đơn cũng được, còn lại cả công ty tối đa 5 đơn một tháng.

**Siết tạm một người trong hai tháng:**

| Áp dụng cho | Gán cho | Hiệu lực từ | Hiệu lực đến | Số đơn tối đa |
|---|---|---|---|---|
| Employee | (nhân viên cần nhắc) | 01/10/2026 | 30/11/2026 | 2 |

Hết 30/11 bản này tự mất hiệu lực, nhân viên quay về hạn mức của công ty.

---

## 4. Nhân viên thấy gì

Trên ứng dụng, form **Đề xuất chấm công** hiện sẵn *tháng này đã dùng bao nhiêu trên bao
nhiêu đơn khai bù*, ngay khi chọn khoảng ngày — để họ biết trước chứ không phải điền xong mới bị
chặn.

Nộp quá hạn mức thì đơn bị chặn lúc gửi:

> Bạn đã dùng hết hạn mức đơn khai bù của tháng 10/2026: 5/5 đơn (tính cả đơn đang chờ
> duyệt). Đơn nộp cho hôm nay hoặc ngày tới thì không bị hạn mức này. Cần thêm thì liên hệ HR.

**Được miễn hạn mức:** HR Manager, HR User, System Manager — để còn nhập thay khi có việc
chính đáng. Đơn sửa lại (không đổi ngày bắt đầu) và đơn lập lại từ bản đã huỷ cũng không bị
đếm lần nữa.

---

## 5. Sự cố hay gặp

| Tình huống | Nguyên nhân / cách xử |
|---|---|
| Đặt hạn mức rồi mà không thấy chặn | Bản ghi còn ở nháp — phải **Submit**. Hoặc ngày đầu của đơn nằm trước *Hiệu lực từ ngày* |
| Nhân viên bị chặn dù công ty chưa đặt hạn mức | Có bản gán riêng cho người đó. Mở `HR Attendance Request Quota` lọc theo *Gán cho* để xem |
| Muốn miễn cho một người | Gán cho người đó một bản **0 đơn** — 0 là không giới hạn, không phải cấm |
| Nhân viên nói "tôi mới nộp có 3 đơn" | Đơn **đang chờ duyệt** cũng tính. Đơn bị từ chối thì không |
| Cần cho thêm đơn trong tháng này | Nâng số trên bản đang hiệu lực, hoặc khai bản mới hiệu lực từ đầu tháng; hoặc HR nhập thay (vai trò HR được miễn) |
| Đơn vắt qua hai tháng bị tính vào tháng trước | Đúng thiết kế — tính theo tháng của ngày đầu đơn, cùng mốc với hạn nộp |

---

## Liên quan
- 📋 [Đề xuất chấm công bù](Hanh-Trinh-Cham-Cong-Bu.html) — góc nhìn nhân viên
- ⏱️ [Hạn nộp phiếu & ràng buộc](HR-Filing-Deadline.html) — luật còn lại của cùng loại đơn
- 🔧 [Attendance Request (kỹ thuật)](HR-Attendance-Request.html)
