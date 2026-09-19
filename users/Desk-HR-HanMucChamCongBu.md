---
title: "Hạn mức ngày khai bù theo tháng"
layout: default
parent: HR (vận hành)
grand_parent: Chấm công & HR
nav_order: 3.8
---

# Hạn mức ngày khai bù
{: .no_toc }

Một tháng mỗi nhân viên được khai bù bao nhiêu **ngày**, tính riêng cho **từng loại đơn** —
khai bằng **Hạn mức ngày khai bù** (`HR Attendance Request Quota`)
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
mấy ngày"*; hạn mức trả lời *"một tháng được khai bù mấy NGÀY"*. Hai câu hỏi khác nhau nên là
hai luật riêng, khai ở hai nơi.

> ⚠️ **Hạn mức chỉ đếm NGÀY KHAI BÙ** — ngày đã qua tại thời điểm nộp đơn. Ngày **hôm nay
> hoặc ngày tới** không bị đếm và không bao giờ bị chặn: đó là đơn **xin phép trước** để
> chấm công ngoài văn phòng, kỹ thuật viên đi thẳng từ nhà tới nhà khách bắt buộc phải có
> đơn thì mới quẹt được. Chặn nó là chặn việc hằng ngày chứ không hãm được lạm dụng.

---

## 2. Luật tra hạn mức

Bản ghi hạn mức gán cho **một nhân viên** hoặc **một công ty**, có ngày hiệu lực — cùng
khuôn với gán lịch nghỉ (`Holiday List Assignment`), để HR chỉ phải nhớ một cách làm.

Khi nhân viên nộp đơn, hệ thống tra theo thứ tự:

1. **Bản gán cho chính nhân viên, đúng loại đơn** — bản đã Submit có *Hiệu lực từ ngày* lớn
   nhất mà không muộn hơn ngày đang xét. Nếu bản đó đã quá *Hiệu lực đến ngày* thì coi như
   nhân viên không có bản riêng và rơi xuống bậc 2 (không lấy bản cũ hơn — bản mới đã thay
   bản cũ).
2. **Bản gán cho công ty** của nhân viên, cùng loại đơn, theo cùng phép chọn.
3. **Không có bản nào = không giới hạn.**

> ⚠️ **Mỗi loại đơn một sổ riêng.** Hạn mức khai cho *Chấm công bù* không ràng buộc đơn *Làm
> việc tại nhà* và ngược lại. Loại nào chưa có bản gán nào thì loại đó **không giới hạn** —
> nên khai một loại mà quên loại kia là để ngỏ loại kia, và hệ thống không nhắc.

> **Số 0 nghĩa là không giới hạn**, không phải "chặn sạch". Hai lý do: hệ thống lưu ô số
> để trống thành 0, nên quên điền không được biến thành khoá cứng; và nhờ đó, gán một bản
> **0** cho một nhân viên chính là cách **miễn** hạn mức chung của công ty cho đúng người
> đó — người thường xuyên phải khai bù nhiều ngày trong tháng vì lý do chính đáng thì miễn
> hạn mức cho riêng người đó, không phải nới trần của cả công ty.

### Đếm cái gì

| Tiêu chí | Giá trị |
|---|---|
| Đơn vị | **Số NGÀY**, không phải số đơn. Một đơn phủ ba ngày thì tiêu ba suất |
| Loại đơn | Tính riêng từng loại: **Chấm công bù / Công tác** (*On Duty*) và **Làm việc tại nhà** (*Work From Home*) |
| Ngày nào bị đếm | Chỉ những ngày **đã qua tại thời điểm nộp đơn**. Ngày từ hôm nộp trở đi là xin phép trước để chấm công ngoài văn phòng — không đếm |
| Trạng thái | **Đang chờ duyệt và đã duyệt** đều đếm — không đếm đơn chờ thì nộp một lúc mười đơn nháp là lách xong |
| Thuộc tháng nào | **Mỗi ngày tính vào tháng của chính nó.** Đơn vắt qua hai tháng thì mỗi tháng xét theo hạn mức của tháng đó |
| Không đếm | Đơn bị từ chối (đã bị xoá) và đơn đã huỷ |

> 💡 **Vì sao đếm ngày chứ không đếm đơn:** một đơn được phủ tới 31 ngày, nên "5 đơn mỗi
> tháng" thực chất là tới 155 ngày công khai bù. Thiệt hại tỉ lệ với số ngày được tính công
> mà không có lần chấm công nào, nên đơn vị đếm phải là ngày.

Mốc tra là **ngày trong đơn**, không phải hôm nay: bật hạn mức từ 01/10 thì ngày 28/09 dù
khai ngày 02/10 vẫn không bị đếm theo luật mới. Cùng nguyên tắc không hồi tố với hạn nộp.

---

## 3. Khai một hạn mức

**Vào bằng đâu:** ô tìm kiếm trên Desk, gõ `HR Attendance Request Quota`; hoặc mở
`/app/hr-attendance-request-quota`.

| Trường | Cách điền |
|---|---|
| Áp dụng cho | **Employee** (một người) hoặc **Company** (cả công ty) |
| Gán cho | Chọn nhân viên hoặc công ty tương ứng |
| Loại đơn | **On Duty** (Chấm công bù / Công tác) hoặc **Work From Home** (Làm việc tại nhà). Mỗi loại một bản gán riêng |
| Hiệu lực từ ngày | Ngày đầu tiên luật này áp dụng |
| Hiệu lực đến ngày | Bỏ trống = có hiệu lực tới khi có bản gán mới hơn cho cùng đối tượng và cùng loại. Điền nếu là hạn mức tạm thời, để nó tự hết mà không phải nhớ huỷ |
| Số ngày tối đa mỗi tháng | Số **ngày**. **0 = không giới hạn** |

Bản ghi phải **Submit** mới có hiệu lực. Hệ thống chặn hai bản cùng đối tượng, **cùng loại
đơn**, cùng ngày hiệu lực — hai bản tranh nhau thì không đoán được bản nào thắng. Cùng người
cùng ngày mà **khác loại** thì hợp lệ, đó là cách khai hai loại song song.

### Ví dụ

**Đặt trần chung, mở riêng cho kỹ thuật viên đi tỉnh:**

| Áp dụng cho | Gán cho | Loại đơn | Hiệu lực từ | Số ngày tối đa |
|---|---|---|---|---|
| Company | Cobe Group | On Duty | 01/10/2026 | 5 |
| Company | Cobe Group | Work From Home | 01/10/2026 | 8 |
| Employee | (KTV đi tỉnh) | On Duty | 01/10/2026 | 0 |

Bản của nhân viên thắng bản của công ty, mà 0 nghĩa là không giới hạn — người đó khai bù bao
nhiêu ngày cũng được, còn lại cả công ty tối đa 5 ngày khai bù và 8 ngày làm việc tại nhà mỗi
tháng. **Không khai dòng nào cho một loại thì loại đó không giới hạn**, nên nếu chỉ khai dòng
*On Duty* thì đơn WFH vẫn nộp bao nhiêu cũng được.

**Siết tạm một người trong hai tháng:**

| Áp dụng cho | Gán cho | Loại đơn | Hiệu lực từ | Hiệu lực đến | Số ngày tối đa |
|---|---|---|---|---|---|
| Employee | (nhân viên cần nhắc) | On Duty | 01/10/2026 | 30/11/2026 | 2 |

Hết 30/11 bản này tự mất hiệu lực, nhân viên quay về hạn mức của công ty.

---

## 4. Nhân viên thấy gì

Trên ứng dụng, form **Đề xuất chấm công** hiện sẵn *tháng này đã khai bao nhiêu trên bao nhiêu
ngày*, theo đúng loại đơn đang chọn, ngay khi chọn khoảng ngày — kèm số ngày mà đơn đang điền sẽ
tiêu. Để họ biết trước chứ không phải điền xong mới bị chặn.

Nộp quá hạn mức thì đơn bị chặn lúc gửi:

> Hạn mức khai bù Chấm công bù tháng 10/2026 là 5 ngày. Tháng đó bạn đã khai 4 ngày (tính cả
> đơn đang chờ duyệt), đơn này xin thêm 2 ngày. Ngày chưa qua tại lúc nộp đơn thì không bị hạn
> mức. Cần thêm thì liên hệ HR.

> ℹ️ **Đơn nộp cho hôm nay / ngày tới có phanh riêng.** Loại đơn đó là giấy xin phép chấm công
> ngoài văn phòng nên không bị hạn mức — nhưng ngày đó chỉ có công khi nhân viên **thật sự chấm công
> ít nhất một lần**; không chấm lần nào thì hệ thống gỡ ngày công vào sáng hôm sau và báo cho nhân
> viên. Hạn mức vì vậy chỉ cần lo cho đường **khai bù** (ngày đã qua) — xem
> [Hành trình một Đề xuất chấm công bù](Hanh-Trinh-Cham-Cong-Bu.html).

**Được miễn hạn mức:** HR Manager, HR User, System Manager — để còn nhập thay khi có việc
chính đáng; đây là van xả duy nhất khi nhân viên hết suất mà lý do chính đáng. Đơn lập lại từ
bản đã huỷ không bị đếm lần nữa; còn đơn **sửa lại mà nong khoảng ngày ra** thì bị kiểm lại,
vì thêm ngày là xin thêm suất.

---

## 5. Sự cố hay gặp

| Tình huống | Nguyên nhân / cách xử |
|---|---|
| Đặt hạn mức rồi mà không thấy chặn | Bản ghi còn ở nháp — phải **Submit**. Hoặc ngày đầu của đơn nằm trước *Hiệu lực từ ngày* |
| Nhân viên bị chặn dù công ty chưa đặt hạn mức | Có bản gán riêng cho người đó. Mở `HR Attendance Request Quota` lọc theo *Gán cho* để xem |
| Muốn miễn cho một người | Gán cho người đó một bản **0 ngày** — 0 là không giới hạn, không phải cấm |
| Nhân viên nói "tôi mới nộp có 3 đơn" | Đếm **ngày**, không đếm đơn: một đơn ba ngày là ba suất. Đơn **đang chờ duyệt** cũng tính; đơn bị từ chối thì không |
| Đặt hạn mức rồi mà đơn WFH vẫn nộp thoải mái | Chưa khai dòng nào cho loại **Work From Home** — mỗi loại một sổ riêng, loại chưa khai là không giới hạn |
| Cần cho thêm ngày trong tháng này | Nâng số trên bản đang hiệu lực, hoặc khai bản mới hiệu lực từ đầu tháng; hoặc HR nhập thay (vai trò HR được miễn) |
| Đơn vắt qua hai tháng | Mỗi ngày tính vào **tháng của chính nó**, và mỗi tháng xét theo hạn mức của tháng đó |

---

## Liên quan
- 📋 [Đề xuất chấm công bù](Hanh-Trinh-Cham-Cong-Bu.html) — góc nhìn nhân viên
- ⏱️ [Hạn nộp phiếu & ràng buộc](HR-Filing-Deadline.html) — luật còn lại của cùng loại đơn
- 🔧 [Attendance Request (kỹ thuật)](HR-Attendance-Request.html)
