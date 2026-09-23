---
title: Tài liệu kỹ thuật
layout: default
nav_order: 90
has_children: true
---

# Tài liệu kỹ thuật (Phần 3)

Mô tả **sâu** về kiến trúc, API, cơ chế và **triển khai** của các module / custom app
ở [Phần 2 — Hướng dẫn sử dụng](../index.html). Hướng đến **developer / system
integrator / 3rd-party vendor** — khác với phần hướng dẫn vận hành cho System Manager
/ nhân viên Cobe.

**Nội dung chính:**
- **Chấm công & HR** — kiến trúc PWA, API contract, [Device Key & Rebind](HR-Attendance-Device-Rebind.html), và nhóm reference DocType (Office Location, HR Policy, Leave…).
- **Compensation** — kiến trúc Overtime / KPI / WFH salary.
- **Nghỉ bù** — [đặc tả sổ giờ](HR-Comp-Leave-Ledger.html): nguồn cộng, nguồn trừ, thuật toán phân bổ, hạn dùng theo kỳ và cách hệ thống hành xử trong từng tình huống.
- **Delivery Partner** — lifecycle, doc events, tài liệu tích hợp đối tác giao hàng.
- **Loyalty** — API tích hợp 3rd-party.
- **Phân loại Issue** — [thiết kế 3 tầng Nhóm · Loại · Nguyên nhân](Issue-Taxonomy-Tech.html), cơ chế ẩn theo nhóm và các bẫy khi triển khai.
- **FSMNext** — [liên kết đơn khảo sát](FSMNext-Survey-Link-Tech.html): điểm mở rộng cho ứng dụng khác đóng góp tab chỉ đọc, vì sao luật phải khai cả `before_update_after_submit`, quyền xem hẹp hơn quyền đọc phiếu, và bốn điểm phải giữ ở công cụ gán hàng loạt.
- **FSMNext** — [cơ chế nghĩa vụ trả hàng](FSMNext-Return-Flow-Tech.html): mô hình dữ liệu trong cột JSON, thứ tự các chốt kiểm tra, cách giữ nhất quán giữa hiển thị và chốt chặn, bẫy khi thêm cờ vào Single doctype, và các lỗ còn mở.
