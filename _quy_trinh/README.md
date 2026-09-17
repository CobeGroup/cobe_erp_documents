# Dữ liệu nguồn của nhánh "Quy trình hợp nhất"

Thư mục bắt đầu bằng dấu gạch dưới nên Jekyll không xuất bản. Các trang
`users/00-quy-trinh.md` và `users/Quy-Trinh-<X>-*.md` được **sinh ra** từ đây —
sửa ở đây rồi chạy lại bộ sinh, đừng sửa thẳng trang.

| Tệp | Nội dung |
|---|---|
| `phan-khu.yml` | Năm phân khu: mã, tên, màu, phạm vi, trang cũ dùng tạm |
| `ban-do.yml` | Tầng 0 — ô và đường nối của bản đồ tổng |
| `<X>-*.yml` | Tầng 1 và 2 của một phân khu: luồng chính, nội dung từng bước, thẻ tình huống, hỏi đáp |

```bash
python3 _tools/quy_trinh/build.py            # sinh trang
python3 _tools/quy_trinh/build.py --xem DIR  # sinh trang và xuất SVG xem thử vào DIR
```

Bộ sinh dừng và không ghi trang khi:

- một chữ dài quá số dòng cho phép của ô — rút gọn chữ trong dữ liệu;
- một bước trỏ tới thẻ tình huống không tồn tại, hoặc có thẻ chưa được gắn vào sơ đồ;
- hai đường nối cắt hoặc chạm nhau (kiểm bằng `_tools/svg_cross_check.py`).

Thêm một phân khu mới: tạo `<X>-ten.yml` theo khuôn của `D-thu-tien.yml`. Khi tệp tồn tại,
bản đồ tổng và các cổng của phân khu khác tự trỏ sang trang mới thay cho `trang_tam`.
