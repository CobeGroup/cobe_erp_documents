---
title: 6 · Bảo dưỡng định kỳ
layout: default
parent: Quy trình hợp nhất
nav_order: 7
---

# Chặng 6 — Bảo dưỡng định kỳ và vòng lặp
{: .no_toc }

**Ai làm:** Nhân viên dịch vụ · Quản lý dịch vụ · Hệ thống tự động
{: .fs-3 .text-grey-dk-000 }

| Nhận vào | Bàn giao ra |
|---|---|
| Đơn hàng đã hoàn tất, kèm các hạng mục cần chăm sóc định kỳ | Đơn bán hàng mới cho kỳ kế tiếp → [Chặng 2](Quy-Trinh-02-Don-Hang.html) |

---

## Mục lục
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Sơ đồ chặng

<div style="position:relative;width:100%;padding-bottom:51.49%">
  <object type="image/svg+xml" data="images/svg/quy-trinh/07-bao-duong-lap-lai.svg" style="position:absolute;inset:0;width:100%;height:100%;border:0">
    <img src="images/svg/quy-trinh/07-bao-duong-lap-lai.svg" alt="Đơn hàng hoàn tất sinh lịch nhắc theo từng vật tư, các lịch được gom theo khách hàng thành phiếu nhắc bảo dưỡng, phiếu được phân cho người phụ trách và người đó liên hệ khách hàng. Bốn kết quả có thể xảy ra: khách đồng ý thì lập đơn mới, khách hẹn lại, không liên hệ được, hoặc khách không có nhu cầu" style="width:100%;height:auto">
  </object>
</div>

👆 **Bấm vào từng ô** để mở phần giải thích.
{: .fs-3 }

---

## 1. Hai loại bản ghi nhắc lịch
{: #hai-loai }

| Loại | Gõ tìm bằng | Là gì | Ai dùng |
|---|---|---|---|
| **Nhắc theo vật tư** | `Item Service Reminder` | Lịch của **một vật tư** trên **một đơn hàng**: chu kỳ thay và ngày đến hạn kế tiếp | Hệ thống tự quản, người dùng hầu như không phải thao tác |
| **Phiếu nhắc bảo dưỡng** | `Service Ticket Reminder` | **Việc cần làm**: liên hệ khách hàng và chốt lịch | Nhân viên dịch vụ làm hằng ngày trên bản ghi này |

Nhiều dòng nhắc theo vật tư được **gom lại** thành một phiếu nhắc, để **một lần gọi, một lần
đến** giải quyết được nhiều hạng mục thay vì làm phiền khách hàng nhiều lần trong một tuần.

---

## 2. Đơn hoàn tất sinh lịch nhắc
{: #sinh-lich }

Ngay khi đơn sang **Completed**, hệ thống rà từng món trong đơn:

| Loại món | Xử lý |
|---|---|
| Có khai **chu kỳ nhắc** | Sinh một dòng nhắc, đặt sẵn ngày đến hạn kế tiếp |
| Là **bộ sản phẩm** | Khai triển thành từng món thành phần rồi mới xét |
| Không khai chu kỳ | Bỏ qua |

> 🔑 **Bắt buộc đơn phải ở trạng thái *Completed*.** Đơn đã giao hàng nhưng chưa xuất đủ hoá đơn
> vẫn nằm ở *To Bill* và **không sinh lịch nhắc nào**. Đây là nguyên nhân phổ biến nhất của
> tình trạng khách hàng đã mua mà hệ thống không nhắc bảo dưỡng.

**Quy tắc tránh sinh phiếu thừa.** Một thiết bị gồm thân máy và nhiều lõi; nhắc cho cả thân máy
lẫn từng lõi thì một lần đến sinh ra nhiều phiếu. Hệ thống xử lý hai chiều:

- Đơn có bán **lõi lọc có chu kỳ nhắc** thì **không nhắc cho thân máy**, vì vẫn phải đến nhà
  khách hàng để thay lõi.
- Ngược lại, khi một lịch nhắc lõi được sinh ra, các lịch nhắc thân máy đang chờ của cùng thiết
  bị sẽ **được ngừng lại**.

Đơn bán **thiết bị không kèm lõi** vẫn nhắc cho thân máy, vì đó là điểm tiếp xúc duy nhất.

---

## 3. Gom thành phiếu nhắc
{: #phieu-nhac }

Mỗi khi có dòng nhắc mới, hệ thống xem khách hàng đã có phiếu nào đang mở chưa:

| Trường hợp | Xử lý |
|---|---|
| Chưa có phiếu đang mở | **Lập phiếu mới** |
| Có phiếu đang mở, **cùng địa chỉ**, ngày đến hạn **gần nhau** | **Bổ sung** vào phiếu đó, ghi thêm mã đơn vào danh sách tham chiếu |
| Có phiếu đang mở nhưng khác địa chỉ, hoặc ngày cách xa | **Lập phiếu mới** |

Phiếu nhắc mang theo: khách hàng, địa chỉ, người liên hệ, số điện thoại, tỉnh và quận, danh
sách hạng mục cần thay, **ngày đến hạn trung bình** và **doanh thu ước tính**.

---

## 4. Phân người phụ trách
{: #phan-cong }

Hệ thống chọn người liên hệ theo **sáu tiêu chí tính điểm**:

| # | Tiêu chí | Ý nghĩa |
|---|---|---|
| 1 | **Đã chăm sóc khách hàng này trước đây** | Trọng số cao nhất — khách quen giữ đúng người |
| 2 | **Chuyên môn** | Am hiểu dòng sản phẩm liên quan |
| 3 | **Hiệu suất** | Tỉ lệ chốt đơn gần đây |
| 4 | **Mức độ tương tác** | Đã trao đổi trên phiếu này gần đây |
| 5 | **Địa bàn** | Phụ trách đúng tỉnh hoặc quận của khách hàng |
| 6 | **Cân bằng khối lượng** | Ai đang ít việc được cộng điểm, ai quá tải bị trừ |

Nhân sự nghỉ việc thì khách quen **không mất liên lạc**: hệ thống truy theo số điện thoại công
ty người đó từng dùng, tìm người đang tiếp quản số đó và chuyển phiếu sang.

Ngoài ra còn cơ chế **phân theo tháng**, chia đều khối lượng từng tháng. Hai cơ chế loại trừ
nhau bằng một tham số cấu hình.

> Người dùng **luôn sửa được** sau khi hệ thống phân. Mọi lần phân đều được ghi lại kèm lý do,
> tra cứu trong tab quản lý của phiếu.

---

## 5. Liên hệ khách hàng và ghi kết quả
{: #lien-he }

Nhân viên dịch vụ làm việc trên danh sách phiếu nhắc, mặc định lọc theo ngày đến hạn sắp tới.
Gọi xong thì ghi kết quả vào ô trạng thái:

| Trạng thái | Nghĩa |
|---|---|
| **Open** | Chưa xử lý |
| **Under Care** | Đang chăm sóc, chưa chốt |
| **Converted** | Khách đồng ý, đã lập đơn mới |
| **Reschedule Reminder Date** | Khách hẹn dịp khác, dời ngày nhắc |
| **Contact Later** | Liên hệ lại sau |
| **Unable to Contact** | Không liên hệ được |
| **Lost** | Khách không có nhu cầu, có ghi lý do |
| **Disable** | Ngừng nhắc hẳn chuỗi này |
| **Cancelled** | Đơn đã lập nhưng bị huỷ |

Chọn **Lost** thì bắt buộc chọn **lý do**: không có nhu cầu, đợi khách kiểm tra, chưa sắp xếp
được thời gian, mua bên ngoài, đã hẹn lại nhiều lần, không đồng ý đổi sang loại lõi khác. Đây
là dữ liệu để cải thiện kịch bản bán hàng.

---

## 6. Lập đơn hàng mới
{: #don-moi }

Khách đồng ý thì chọn **Create → Sales Order** ngay trên phiếu nhắc. Hệ thống điền sẵn khách
hàng, địa chỉ, liên hệ và ghi **liên kết ngược** về phiếu nhắc.

Đơn được xác nhận thì phiếu nhắc **tự sang Converted**; đơn bị huỷ thì phiếu **tự sang
Cancelled**. Không ai phải cập nhật thủ công.

> ⚠️ Lập đơn mới trên Desk rồi nhập thủ công tên khách hàng là **mất liên kết ngược**: phiếu nhắc nằm
> lại ở *Open*, và công chốt đơn không được ghi cho ai cả.

Đơn mới này rồi cũng hoàn tất và lại sinh lịch nhắc cho kỳ sau. **Vòng lặp khép lại.**

---

## 7. Vòng kế tiếp và cơ chế hoãn
{: #vong-sau }

Ngay khi một vòng nhắc được sinh ra, hệ thống đã đặt sẵn **ngày đến hạn của vòng kế tiếp**. Một
tác vụ chạy hằng đêm rà các chuỗi đến hạn và sinh vòng mới.

| Cơ chế bảo vệ | Để làm gì |
|---|---|
| **Rà soát bù** | Tác vụ quét cả mấy ngày gần đây chứ không chỉ đúng ngày hôm nay. Một đêm hỏng thì đêm sau xử lý bù, chuỗi không đứt vĩnh viễn |
| **Hoãn khi khách còn phiếu chờ** | Khách còn phiếu chưa xử lý thì chưa sinh vòng mới, tránh gọi khách hai lần cho cùng một lần đến |

Cơ chế hoãn có ngưỡng kiểm soát: phiếu chờ **quá hạn quá lâu** được coi là tồn đọng chứ không
phải việc sắp tới, nếu không chuỗi sẽ bị khoá vĩnh viễn.

---

## 8. Khi gặp trục trặc
{: #truc-trac }

| Hiện tượng | Nguyên nhân | Cách gỡ |
|---|---|---|
| Khách đã mua nhưng **không có phiếu nhắc** | Đơn chưa ở *Completed* | Kiểm tiến độ giao hàng và xuất hoá đơn của đơn |
| Đơn đã hoàn tất mà vẫn không sinh nhắc | Mặt hàng **chưa khai chu kỳ nhắc** | Đề nghị quản trị viên khai chu kỳ cho mã hàng |
| Một khách có **nhiều phiếu trùng nhau** | Khác địa chỉ, hoặc ngày đến hạn cách xa nên không gom được | Gộp thủ công, đóng bớt phiếu thừa kèm ghi chú |
| Phiếu tồn đọng quá hạn rất lâu | Tồn từ đợt rà soát dữ liệu cũ | Tác vụ tự động **không xử lý phần tồn đọng quá hạn**; cần xử lý theo đợt có kiểm soát |
| Phiếu phân cho người không phù hợp | Chưa khai chuyên môn hoặc địa bàn | Khai bổ sung; phiếu sau tự phân đúng, phiếu cũ phân lại thủ công |
| Nhân sự nghỉ việc, khách quen **không được chuyển giao** | Số điện thoại công ty chưa bàn giao | Bàn giao số điện thoại theo đúng quy trình |
| Đã lập đơn nhưng **phiếu vẫn Open** | Đơn lập thủ công, mất liên kết ngược | Nhờ quản trị viên gắn lại liên kết, hoặc đóng phiếu kèm ghi chú |
| Cần **ngừng nhắc hẳn** | Khách chuyển nhà, bỏ dùng thiết bị, hoặc mua nơi khác | Ghi trạng thái **Disable** kèm lý do |
| Cần tách một phiếu thành hai | Khách chỉ đồng ý thay một phần hạng mục | Dùng chức năng **Tách phiếu** trên form |

---

## 9. Câu hỏi thường gặp
{: #hoi-dap }

**Khách hàng mới mua tháng trước, bao giờ hệ thống nhắc?**

Theo chu kỳ của từng hạng mục, tính từ ngày đơn hoàn tất — lõi thô vài tháng, thân máy vài năm.

**Khách bảo chưa cần thay, ghi thế nào?**

**Reschedule Reminder Date** nếu khách hẹn dịp khác, **Contact Later** nếu chỉ muốn gọi lại sau.
Đừng dùng **Lost** cho hai trường hợp này.

**Gọi ba lần không ai nghe thì sao?**

Ghi **Unable to Contact**. Chuỗi vẫn sống và sẽ nhắc lại ở vòng sau.

**Khách chuyển nhà, không dùng máy nữa?**

Ghi **Disable** kèm lý do. Chuỗi dừng hẳn, không sinh vòng mới.

**Khách chỉ đồng ý thay một lõi trong ba lõi?**

Dùng **Tách phiếu**: phần đồng ý lập đơn, phần còn lại giữ để nhắc tiếp.

**Lập đơn xong mà phiếu nhắc vẫn Open?**

Đơn được lập ngoài phiếu nhắc nên mất liên kết ngược. Lần sau lập bằng **Create → Sales Order**
ngay trên phiếu.

---

## Chặng còn lại

Vòng bảo dưỡng là luồng thông thường. Khi thiết bị hỏng giữa chu kỳ, khách hàng đi theo đầu vào
khác: **[Chặng 7 — Sự cố](Quy-Trinh-07-Su-Co.html)**.
