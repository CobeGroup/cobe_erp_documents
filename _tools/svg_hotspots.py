#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gắn vùng bấm (hotspot) vào hai sơ đồ vẽ tay còn lại của nhánh "Quy trình hợp nhất".

Mỗi hotspot là một hình chữ nhật trong suốt phủ lên một ô của sơ đồ, bọc trong
thẻ <a>, nên bấm vào ô là mở đúng mục giải thích. Vùng bấm được ghi vào cuối
tệp SVG, giữa hai dấu mốc, nên chạy lại nhiều lần vẫn cho kết quả như nhau và
không đụng tới phần hình vẽ.

Sơ đồ phải được nhúng bằng <object type="image/svg+xml"> thì liên kết mới chạy;
nhúng bằng <img> thì trình duyệt bỏ qua liên kết.

Cách dùng:  python3 _tools/svg_hotspots.py
"""

import os
import re
import sys

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'users')
SVG_DIR = os.path.join(BASE, 'images', 'svg', 'quy-trinh')

# Đường dẫn từ thư mục chứa SVG trở ra thư mục users/
UP = '../../../'

BEGIN = '  <!-- VUNG-BAM: sinh bởi _tools/svg_hotspots.py, không sửa tay -->'
END = '  <!-- /VUNG-BAM -->'

STYLE = (
    '  <style>\n'
    '    .hot { fill: #1d4ed8; fill-opacity: 0; cursor: pointer; pointer-events: all; }\n'
    '    .hot:hover { fill-opacity: .08; }\n'
    '  </style>'
)

P = {
    'A': 'Quy-Trinh-A-Ban-Hang.html',
    'B': 'Quy-Trinh-B-Hien-Truong.html',
    'C': 'Quy-Trinh-C-Kho-Giao-Nhan.html',
    'D': 'Quy-Trinh-D-Thu-Tien.html',
    'E': 'Quy-Trinh-E-Sau-Ban-Hang.html',
}


def L(page, anchor=''):
    return UP + P[page] + ('#' + anchor if anchor else '')


# (x, y, rộng, cao, liên kết, chú thích hiện khi rê chuột)
# Các sơ đồ phân khu đã do _tools/quy_trinh/build.py sinh; ở đây chỉ còn hai sơ đồ vẽ tay
# dùng ở trang Tổng quan và trang Vòng đời một đơn hàng.
SPEC = {
    '01-toan-canh.svg': [
        (70, 50, 200, 60, L('A', 'nguon'), 'Khách tiềm năng đến từ đâu'),
        (310, 50, 200, 60, L('A', 'chuyen-doi'), 'Chuyển thành khách hàng chính thức'),
        (550, 50, 200, 60, L('E', 'su-co'), 'Tiếp nhận sự cố'),
        (70, 190, 200, 62, L('A', 'khai-don'), 'Lập và xác nhận đơn bán hàng'),
        (310, 190, 200, 62, L('B', 'lap-wo'), 'Lập phiếu công việc'),
        (550, 190, 200, 62, L('C', 'yeu-cau'), 'Yêu cầu và cấp vật tư'),
        (790, 190, 200, 62, L('B', 'lap-sa'), 'Lập lịch hẹn và gán kỹ thuật viên'),
        (70, 350, 200, 62, L('E', 'phieu-nhac'), 'Phiếu nhắc bảo dưỡng'),
        (310, 350, 200, 62, L('A', 'xac-nhan'), 'Khi nào đơn được coi là hoàn tất'),
        (550, 350, 200, 62, L('D', 'hoa-don'), 'Hoá đơn và thu tiền'),
        (790, 350, 200, 62, L('C', 'giao-hang'), 'Lập phiếu giao hàng'),
    ],
    '10-vong-doi-don-hang.svg': [
        (108, 62, 352, 78, L('A', 'khai-don'), 'Lập và xác nhận đơn'),
        (108, 166, 352, 78, L('B', 'lap-wo'), 'Lập phiếu công việc'),
        (108, 270, 352, 78, L('B', 'lap-sa'), 'Lập lịch hẹn'),
        (108, 374, 352, 78, L('C', 'yeu-cau'), 'Xuất vật tư'),
        (108, 478, 352, 78, L('B', 'hien-truong'), 'Làm việc tại hiện trường'),
        (108, 582, 352, 78, L('C', 'giao-hang'), 'Lập phiếu giao hàng'),
        (108, 686, 352, 78, L('D', 'tien-mat'), 'Thu tiền mặt'),
        (108, 790, 352, 78, L('D', 'tien-mat'), 'Nộp tiền về công ty'),
        (108, 894, 352, 78, L('D', 'chuyen-khoan'), 'Thu phần chuyển khoản'),
        (108, 998, 352, 78, L('D', 'hoa-don'), 'Hoá đơn và lịch bảo dưỡng'),
    ],
}


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


def build(spots):
    out = [BEGIN, STYLE]
    for x, y, w, h, href, title in spots:
        out.append(
            '  <a href="%s" target="_top"><title>%s</title>'
            '<rect class="hot" x="%s" y="%s" width="%s" height="%s" rx="10" ry="10"/></a>'
            % (esc(href), esc(title), x, y, w, h)
        )
    out.append(END)
    return '\n'.join(out)


def main():
    changed = 0
    for name, spots in sorted(SPEC.items()):
        path = os.path.join(SVG_DIR, name)
        if not os.path.exists(path):
            print('  THIEU  %s' % name)
            continue
        s = open(path, encoding='utf-8').read()
        s = re.sub(re.escape(BEGIN) + '.*?' + re.escape(END) + '\n?', '', s, flags=re.S)
        if '</svg>' not in s:
            print('  LOI    %s: không tìm thấy thẻ đóng' % name)
            continue
        s = s.replace('</svg>', build(spots) + '\n</svg>')
        open(path, 'w', encoding='utf-8').write(s)
        print('  OK     %-28s %2d vùng bấm' % (name, len(spots)))
        changed += 1
    print('Đã xử lý %d sơ đồ.' % changed)
    return 0


if __name__ == '__main__':
    sys.exit(main())
