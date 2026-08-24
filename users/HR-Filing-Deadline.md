---
title: "Hạn nộp phiếu & ràng buộc khi tạo phiếu"
layout: default
grand_parent: Tài liệu kỹ thuật
parent: Chấm công & HR (kỹ thuật)
nav_order: 14
---

# Hạn nộp phiếu khai bù & ràng buộc khi tạo phiếu

> Từ bản cập nhật **08/2026**, ba loại phiếu "việc đã xảy ra rồi mới khai" dùng **chung một
> bảng cấu hình hạn nộp** trong `HR Policy`, khai theo **ngày hiệu lực** — bật quy định mới
> không hồi tố lên chuyện đã qua, và siết dần chỉ là thêm dòng. Trang này gom toàn bộ giới
> hạn khi tạo phiếu về một chỗ: hạn nộp, trần giờ, và các ràng buộc chống trùng/chống lạm dụng.

---

## Mục lục

1. [Ba loại phiếu cùng một luật hạn nộp](#1-ba-loại-phiếu-cùng-một-luật-hạn-nộp)
2. [Bảng "Hạn khai theo ngày hiệu lực"](#2-bảng-hạn-khai-theo-ngày-hiệu-lực)
3. [Nghỉ bù — đồng hồ hai mốc](#3-nghỉ-bù--đồng-hồ-hai-mốc)
4. [Ai không bị hạn & các cửa thoát](#4-ai-không-bị-hạn--các-cửa-thoát)
5. [Trần giờ OT & hệ số nửa buổi theo ngày hiệu lực](#5-trần-giờ-ot--hệ-số-nửa-buổi-theo-ngày-hiệu-lực)
6. [Các ràng buộc khác khi tạo phiếu](#6-các-ràng-buộc-khác-khi-tạo-phiếu)
7. [Trạng thái sau nâng cấp & cách bật](#7-trạng-thái-sau-nâng-cấp--cách-bật)

---

## 1. Ba loại phiếu cùng một luật hạn nộp

Cùng một câu hỏi cho cả ba: *việc đã xảy ra, nhân viên còn được tự khai trong bao nhiêu ngày?*

| Loại phiếu | Doctype | Mốc tính trễ | Cột cấu hình | Chốt chặn nằm ở |
|---|---|---|---|---|
| Đơn nghỉ phép | `Leave Application` | **Ngày bắt đầu nghỉ** (riêng Nghỉ bù xem [mục 3](#3-nghỉ-bù--đồng-hồ-hai-mốc)) | **Hạn nộp đơn nghỉ** | `validate()` của doctype |
| Phiếu làm thêm giờ | `HR Overtime Request` | **Ngày làm thêm** | **Hạn khai làm thêm** | API tạo phiếu |
| Đơn chấm công bù / làm ngoài / WFH | `Attendance Request` | **Ngày đầu của đơn** | **Hạn nộp đơn chấm công** | `validate()` của doctype |

Vì sao đơn chấm công cũng phải có hạn: đơn "On Duty" cho đúng ngày vắng mặt sẽ đánh ngày đó
thành **Present** — kết quả còn lợi hơn nghỉ phép. Siết đơn nghỉ mà bỏ ngỏ cửa này thì quy
định chỉ đổi kênh, không thay đổi hành vi.

Ngược lại, hạn của đơn chấm công **nên rộng hơn** hạn đơn nghỉ: loại đơn này còn mang nhiệm
vụ hợp lệ là **khai bù ngày quên check-in**. Khai hạn đơn chấm công chặt hơn hạn đơn nghỉ thì
hệ thống cảnh báo ngay lúc lưu `HR Policy` (cảnh báo, không chặn).

Chốt chặn của đơn nghỉ và đơn chấm công đặt ở tầng doctype, nên áp cho **mọi cửa vào**: app
my-workspace, Desk, API. Không phụ thuộc việc người dùng đi đường nào.

---

## 2. Bảng "Hạn khai theo ngày hiệu lực"

**Desk → HR Policy** (mỗi Company một bản ghi) → section **"Hạn khai bù sau khi việc đã xảy
ra"** → bảng `HR Policy Filing Deadline`:

| Cột | Ý nghĩa |
|---|---|
| **Hiệu lực từ ngày** | Bản luật này áp cho những ngày nghỉ / ngày làm thêm / ngày xin chấm công **từ ngày này trở đi** |
| **Hạn nộp đơn nghỉ (ngày)** | Số ngày tối đa sau ngày bắt đầu nghỉ mà nhân viên còn tự nộp được. **0 = không giới hạn** |
| **Hạn khai làm thêm (ngày)** | Số ngày tối đa sau ngày làm thêm. **0 = không giới hạn** |
| **Hạn nộp đơn chấm công (ngày)** | Số ngày tối đa sau ngày đầu của đơn. **0 = không giới hạn** |

Luật đọc bảng:

- Mỗi phiếu được xét theo **bản luật hiệu lực tại ngày xảy ra việc** (ngày nghỉ / ngày làm
  thêm / ngày xin chấm công) — bản có *Hiệu lực từ ngày* lớn nhất mà không vượt quá ngày đó.
  Cùng khuôn với luật lương (`Cobe Payroll Policy`).
- Ngày xảy ra việc **trước bản luật đầu tiên** → không giới hạn. Nhờ đó bật quy định mới
  **không hồi tố**: khai một dòng hiệu lực 01/09 thì mọi ngày trước 01/09 vĩnh viễn nằm
  ngoài phạm vi, dù khai muộn tới đâu.
- **Bảng trống = không giới hạn** cho cả ba loại. Giá trị **0 cũng là không giới hạn** —
  muốn chặt nhất thì khai **1** (chỉ được nộp trong ngày hoặc hôm sau).
- Hai dòng cùng *Hiệu lực từ ngày* bị chặn ngay lúc lưu; số âm cũng bị chặn.

Ví dụ siết dần — chỉ việc thêm dòng, không sửa dòng cũ:

| Hiệu lực từ ngày | Hạn nộp đơn nghỉ | Hạn khai làm thêm | Hạn nộp đơn chấm công |
|---|---|---|---|
| 01/09/2026 | 7 | 30 | 14 |
| 01/12/2026 | 3 | 7 | 7 |

Ngày nghỉ 30/11 theo hạn 7 ngày; ngày nghỉ 01/12 trở đi theo hạn 3 ngày. Ngày nghỉ trong
tháng 8 (trước dòng đầu tiên) không bị giới hạn.

---

## 3. Nghỉ bù — đồng hồ hai mốc

Đơn Nghỉ bù (`Leave Type` có cờ `is_compensatory`) bắt buộc phải có **phiếu làm thêm giờ đã
duyệt** (quy đổi *Nghỉ bù*) trước khi nộp — mà việc duyệt nằm trong tay quản lý, không nằm
trong tay nhân viên. Vì vậy đồng hồ tính trễ của Nghỉ bù chạy từ **mốc muộn hơn** giữa hai
thời điểm:

> **Mốc đếm trễ = max(ngày bắt đầu nghỉ, ngày phiếu OT được duyệt)**

| Tình huống | Đồng hồ chạy từ | Vì sao |
|---|---|---|
| Phiếu OT duyệt **sau** ngày nghỉ (duyệt chậm) | Ngày duyệt phiếu OT | Suốt thời gian chờ duyệt, nhân viên **không thể** nộp đơn — không thể tính trễ cho quãng đó |
| Phiếu OT duyệt **trước** ngày nghỉ (để dành ngày bù, nghỉ sau vài tuần) | Ngày bắt đầu nghỉ | Để dành ngày bù là hành vi hợp lệ — mốc duyệt chỉ được **nới** hạn, không bao giờ **siết** |
| Không tra được phiếu OT tương ứng | Ngày bắt đầu nghỉ | Xử như phép thường; phiếu tạo qua app luôn có phiếu OT kèm theo nên trường hợp này chỉ gặp ở dữ liệu cũ |

Ví dụ với hạn 3 ngày: làm thêm 05/09, đăng ký nghỉ bù ngày 20/09 —

- Phiếu OT duyệt 06/09, nhân viên nộp đơn 20/09 → trễ 0 ngày (tính từ ngày nghỉ) → **hợp lệ**,
  dù cách ngày duyệt đã 14 ngày.
- Phiếu OT duyệt 22/09 (sau ngày nghỉ), nhân viên nộp 24/09 → trễ 2 ngày tính từ ngày duyệt
  → **hợp lệ**, dù cách ngày nghỉ đã 4 ngày.
- Phiếu OT duyệt 18/09, nhân viên nộp 27/09 → trễ 7 ngày tính từ ngày nghỉ → **quá hạn**,
  phải liên hệ HR.

Bản luật nào áp vẫn tra theo **ngày bắt đầu nghỉ** như mọi loại phép — chỉ mốc đếm trễ đổi.

---

## 4. Ai không bị hạn & các cửa thoát

**Miễn theo role**: `HR Manager`, `HR User`, `System Manager` và tài khoản `Administrator`
không bị giới hạn — để HR còn **tạo thủ công thay nhân viên** khi quá hạn. Đây là đường xử
lý chính thức cho mọi ca quá hạn: nhân viên liên hệ HR kèm xác nhận của quản lý.

**Các cửa thoát tự động** — quy định chỉ chặn lúc *nộp*, không làm kẹt phiếu đã nộp:

| Tình huống | Hành vi |
|---|---|
| Đơn nộp đúng hạn nhưng người duyệt thao tác chậm | Duyệt/từ chối bình thường — hạn chỉ xét khi **tạo mới** hoặc **đổi ngày** |
| Từ chối một đơn đã quá hạn | Vẫn từ chối được |
| Hủy đơn cũ rồi lập lại (amend) giữ nguyên ngày | Không bị chặn |
| Sửa đơn đã nộp, **đổi ngày lùi về quá khứ** | Bị kiểm lại như nộp mới — chặn đường lách |
| Đăng ký cho ngày **tương lai** (nghỉ phép trước, đi công tác ngày mai) | Không bao giờ bị hạn này chặn |

---

## 5. Trần giờ OT & hệ số nửa buổi theo ngày hiệu lực

Cùng bản cập nhật, trần giờ OT và hệ số ngày nửa buổi cũng chuyển sang bảng ngày hiệu lực:
**Desk → HR Policy** → bảng `HR Policy Overtime Rule`:

| Cột | Ý nghĩa | Mặc định |
|---|---|---|
| **Hiệu lực từ ngày** | Bản luật áp cho ngày làm thêm từ ngày này trở đi | — |
| **Trần OT ngày thường (giờ)** | Giờ khai vượt bị cắt về trần ngay lúc tạo phiếu. **0 = không giới hạn** | 4 |
| **Trần OT ngày nghỉ/lễ (giờ)** | Như trên, cho ngày lễ và ngày nghỉ | 8 |
| **Hệ số ngày nửa buổi** | Buổi làm thêm của ngày nửa buổi (Thứ 7 khối văn phòng) trả theo hệ số nào của `Overtime Type`: Ngày thường ×1.5 · Cuối tuần ×2.0 · Ngày lễ ×3.0 | Cuối tuần |

Khác với hạn nộp, trần giờ tra theo **ngày làm thêm** và khi không có bản luật nào áp được
thì dùng **mặc định của hệ thống** (4h/8h/Cuối tuần) chứ không phải "không giới hạn" — trần
luôn phải là một con số.

Vì sao phải theo ngày: số giờ công nhận được tính lại mỗi lần bản chấm công ngày đó được lưu
(tiến trình nền còn quét lại cửa sổ 14 ngày). Nếu đọc giá trị hiện tại, chỉnh trần hôm nay sẽ
**đổi số của những ngày đã chốt** tùy vào việc bản ghi nào bị lưu lại — cùng một ngày, cùng
một quy định, hai nhân viên có thể ra hai kết quả. Tra theo ngày làm thêm thì số cũ đứng yên.

---

## 6. Các ràng buộc khác khi tạo phiếu

Không thuộc bảng hạn nộp nhưng cùng áp lúc tạo phiếu:

| Phiếu | Ràng buộc | Ý nghĩa |
|---|---|---|
| `HR Overtime Request` | Không khai cho **ngày tương lai** | Khai sau khi đã làm, đối chiếu với giờ check-out thực tế |
| `HR Overtime Request` | Mỗi ngày tối đa **1 phiếu** (chờ hoặc đã duyệt) | Muốn đổi khung giờ thì hủy phiếu cũ |
| `HR Overtime Request` | Giờ khai tối đa **12h/ngày**, và bị cắt theo trần ([mục 5](#5-trần-giờ-ot--hệ-số-nửa-buổi-theo-ngày-hiệu-lực)) | Giờ công nhận cuối cùng = min(giờ thực tế, giờ khai, trần) |
| `Leave Application` loại Nghỉ bù | Phải chọn **ngày làm thêm để bù** có phiếu OT đã duyệt quy đổi *Nghỉ bù*, mỗi ngày làm thêm chỉ đổi **1** ngày nghỉ | Xem [Hành trình Nghỉ bù](Hanh-Trinh-Nghi-Bu.html) |
| `Attendance Request` | Một đơn phủ tối đa **31 ngày** | Chống đơn quét cả quý |
| `Attendance Request` | Tối đa **10 đơn nháp** chờ duyệt mỗi nhân viên | Chống spam |
| `Attendance Request` | Chặn đơn **thừa** — mọi ngày trong đơn đã có chấm công đúng trạng thái | Đơn không thêm được gì thì không cho tạo |

---

## 7. Trạng thái sau nâng cấp & cách bật

Ngay sau nâng cấp, hành vi **giữ nguyên như trước**, chưa có gì bị siết thêm:

| Hạn | Trạng thái |
|---|---|
| Hạn khai làm thêm | Giữ nguyên giá trị đã cấu hình trước đây (chuyển tự động vào bảng) |
| Hạn nộp đơn nghỉ | **Chưa bật** (0 = không giới hạn) |
| Hạn nộp đơn chấm công | **Chưa bật** (0 = không giới hạn) |
| Trần OT & hệ số nửa buổi | Giữ nguyên 4h / 8h / Cuối tuần |

Muốn bật hạn cho đơn nghỉ và đơn chấm công: thêm **một dòng mới** vào bảng với *Hiệu lực từ
ngày* là ngày bắt đầu áp dụng (ví dụ 01/09/2026) và điền số ngày cho từng cột. Lưu ý:

- Chọn ngày hiệu lực **trong tương lai** và thông báo trước cho nhân viên — ngày trước mốc
  không bị ảnh hưởng, nên không có ai "bỗng nhiên" quá hạn vào ngày bật.
- Khối văn phòng nghỉ Thứ 7/Chủ nhật: hạn đơn nghỉ **1** ngày nghĩa là nghỉ Thứ 7 phải nộp
  trước Chủ nhật — cân nhắc tối thiểu **3** ngày để qua cuối tuần.
- Hạn đơn chấm công để **rộng hơn** hạn đơn nghỉ (xem [mục 1](#1-ba-loại-phiếu-cùng-một-luật-hạn-nộp)).

---

## Liên quan

- [HR Policy — cấu hình per-Company](HR-Policy.html)
- [Chính sách chấm công (Desk, cho quản trị)](Desk-Admin-Policy.html)
- [Cấu hình Overtime](HR-Overtime-Settings.html) · [HR Overtime Request](HR-Overtime-Request.html)
- [Hành trình một phiếu Làm thêm giờ](Hanh-Trinh-OT.html) · [Hành trình Nghỉ bù](Hanh-Trinh-Nghi-Bu.html)
- [Attendance Request (chấm công bù)](HR-Attendance-Request.html)
