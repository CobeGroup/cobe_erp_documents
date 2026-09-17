# Dữ liệu nguồn của nhánh "Quy trình hợp nhất"

Thư mục bắt đầu bằng dấu gạch dưới nên Jekyll không xuất bản. Các trang
`users/00-quy-trinh.md` và `users/Quy-Trinh-<X>-*.md` được **sinh ra** từ đây —
sửa ở đây rồi chạy lại bộ sinh, đừng sửa thẳng trang.

| Tệp | Nội dung |
|---|---|
| `phan-khu.yml` | Năm phân khu: mã, tên, màu, phạm vi, ai làm |
| `ban-do.yml` | Tầng 0 — ô và đường nối của bản đồ tổng |
| `<X>-*.yml` | Tầng 1 và 2 của một phân khu: một hoặc nhiều luồng (`cac_luong`), nội dung từng bước, thẻ tình huống, phụ lục, hỏi đáp |
| `tra-cuu.yml` | Các mục chung của trang *Khi gặp trục trặc*; phần tra theo thông báo và theo phân khu được sinh tự động |

```bash
python3 _tools/quy_trinh/build.py            # sinh trang
python3 _tools/quy_trinh/build.py --xem DIR  # sinh trang và xuất SVG xem thử vào DIR
```

Bộ sinh dừng và không ghi trang khi:

- một chữ dài quá số dòng cho phép của ô — rút gọn chữ trong dữ liệu;
- một bước trỏ tới thẻ tình huống không tồn tại, hoặc có thẻ chưa được gắn vào sơ đồ;
- một cổng, bước quay về hoặc ô bản đồ trỏ tới bước không có ở phân khu đích;
- hai đường nối cắt hoặc chạm nhau (kiểm bằng `_tools/svg_cross_check.py`).

Các phần tử luồng dùng được: `cong_vao` (một hoặc nhiều cổng), `re` (điểm rẽ sang thẻ hoặc sang
phân khu khác), `buoc` (có thể kèm `the`, `rong`, `vao_ben`, hoặc `sang` để làm ô chuyển sang phân
khu khác), `song_song` (các nhánh chạy song song rồi gộp), `cong_ra`. Mã thẻ viết trong văn bản
(`TT-05`, `HT-11`…) tự thành liên kết, kể cả thẻ của phân khu khác.

Một mã thẻ chỉ có một thẻ duy nhất: thẻ đặt ở **nơi xử lý**, nơi **phát hiện** ghi trong `gap_o`.
