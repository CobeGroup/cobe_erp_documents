#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gắn vùng bấm (hotspot) vào các sơ đồ SVG của nhánh "Quy trình hợp nhất".

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
    'kh': 'Quy-Trinh-01-Khach-Hang.html',
    'don': 'Quy-Trinh-02-Don-Hang.html',
    'ht': 'Quy-Trinh-03-Hien-Truong.html',
    'vt': 'Quy-Trinh-04-Vat-Tu.html',
    'tien': 'Quy-Trinh-05-Giao-Hang-Thu-Tien.html',
    'bd': 'Quy-Trinh-06-Bao-Duong.html',
    'sc': 'Quy-Trinh-07-Su-Co.html',
    'nl': 'Quy-Trinh-08-Ngoai-Le.html',
    'vd': 'Quy-Trinh-Vong-Doi-Don-Hang.html',
}


def L(page, anchor=''):
    return UP + P[page] + ('#' + anchor if anchor else '')


# (x, y, rộng, cao, liên kết, chú thích hiện khi rê chuột)
SPEC = {
    '01-toan-canh.svg': [
        (70, 50, 200, 60, L('kh', 'nguon'), 'Khách tiềm năng đến từ đâu'),
        (310, 50, 200, 60, L('kh', 'chuyen-doi'), 'Chuyển thành khách hàng chính thức'),
        (550, 50, 200, 60, L('sc'), 'Tiếp nhận sự cố'),
        (70, 190, 200, 62, L('don'), 'Lập và xác nhận đơn bán hàng'),
        (310, 190, 200, 62, L('ht', 'lap-wo'), 'Lập phiếu công việc'),
        (550, 190, 200, 62, L('vt', 'yeu-cau'), 'Yêu cầu và cấp vật tư'),
        (790, 190, 200, 62, L('ht', 'lap-sa'), 'Lập lịch hẹn và gán kỹ thuật viên'),
        (70, 350, 200, 62, L('bd', 'phieu-nhac'), 'Phiếu nhắc bảo dưỡng'),
        (310, 350, 200, 62, L('don', 'trang-thai'), 'Khi nào đơn được coi là hoàn tất'),
        (550, 350, 200, 62, L('tien', 'hoa-don'), 'Hoá đơn và thu tiền'),
        (790, 350, 200, 62, L('tien', 'giao-hang'), 'Lập phiếu giao hàng'),
    ],
    '02-khach-hang.svg': [
        (36, 52, 186, 40, L('kh', 'nguon'), 'Nguồn khách hàng'),
        (36, 102, 186, 40, L('kh', 'nguon'), 'Nguồn khách hàng'),
        (36, 152, 186, 40, L('kh', 'nguon'), 'Nguồn khách hàng'),
        (36, 202, 186, 40, L('kh', 'gioi-thieu'), 'Khách hàng giới thiệu'),
        (36, 252, 186, 40, L('kh', 'nguon'), 'Nhân viên nhập liệu'),
        (272, 52, 210, 240, L('kh', 'nguon'), 'Nội dung phải khai trên phiếu khách tiềm năng'),
        (532, 138, 200, 68, L('kh', 'lien-he'), 'Liên hệ và địa chỉ'),
        (782, 138, 200, 68, L('kh', 'chuyen-doi'), 'Chuyển đổi thành khách hàng'),
        (100, 376, 190, 42, L('kh', 'trang-thai'), 'Các trạng thái của phiếu'),
        (320, 376, 190, 42, L('kh', 'trang-thai'), 'Các trạng thái của phiếu'),
        (540, 376, 190, 42, L('kh', 'trang-thai'), 'Các trạng thái của phiếu'),
        (760, 376, 190, 42, L('kh', 'trang-thai'), 'Các trạng thái của phiếu'),
    ],
    '03-don-hang-vong-doi.svg': [
        (30, 80, 200, 62, L('don', 'khai-don'), 'Nội dung phải khai trên đơn'),
        (290, 80, 200, 62, L('don', 'trang-thai'), 'Ý nghĩa từng trạng thái'),
        (550, 80, 200, 62, L('don', 'trang-thai'), 'Ý nghĩa từng trạng thái'),
        (810, 80, 200, 62, L('don', 'trang-thai'), 'Khi nào đơn hoàn tất'),
        (290, 210, 200, 62, L('don', 'sua-don'), 'Tạm giữ đơn'),
        (550, 210, 200, 62, L('don', 'sua-don'), 'Đóng đơn'),
        (810, 210, 200, 62, L('don', 'sua-don'), 'Huỷ đơn'),
        (810, 320, 200, 56, L('don', 'sua-don'), 'Lập lại đơn đã huỷ'),
    ],
    '04-hien-truong.svg': [
        (140, 70, 190, 62, L('ht', 'lap-wo'), 'Lập phiếu công việc'),
        (370, 70, 190, 62, L('ht', 'lap-sa'), 'Lập lịch hẹn'),
        (600, 70, 190, 62, L('ht', 'lap-sa'), 'Gán kỹ thuật viên'),
        (140, 210, 190, 62, L('ht', 'hien-truong'), 'Trình tự thao tác tại hiện trường'),
        (370, 210, 190, 62, L('ht', 'hien-truong'), 'Trình tự thao tác tại hiện trường'),
        (600, 210, 190, 62, L('ht', 'hien-truong'), 'Trình tự thao tác tại hiện trường'),
        (830, 210, 190, 62, L('ht', 'hien-truong'), 'Trình tự thao tác tại hiện trường'),
        (830, 360, 190, 62, L('ht', 'hien-truong'), 'Điều kiện hoàn tất lịch hẹn'),
        (600, 360, 190, 62, L('ht', 'dieu-kien'), 'Sáu điều kiện hoàn thành phiếu công việc'),
        (370, 360, 190, 62, L('ht', 'dong-mo'), 'Đóng, mở lại và huỷ phiếu'),
    ],
    '05-vat-tu.svg': [
        (140, 46, 165, 52, L('vt', 'yeu-cau'), 'Kỹ thuật viên yêu cầu vật tư'),
        (330, 46, 165, 52, L('vt', 'yeu-cau'), 'Kho xử lý yêu cầu'),
        (520, 46, 165, 52, L('tien', 'giao-hang'), 'Giao hàng cho khách hàng'),
        (710, 46, 165, 52, L('vt', 'tra-ve'), 'Lập phiếu trả vật tư'),
        (900, 46, 165, 52, L('vt', 'tra-ve'), 'Kho duyệt phiếu trả'),
        (140, 172, 165, 58, L('vt', 'yeu-cau'), 'Yêu cầu vật tư'),
        (330, 172, 165, 58, L('vt', 'yeu-cau'), 'Phiếu xuất kho'),
        (520, 172, 165, 58, L('tien', 'giao-hang'), 'Phiếu giao hàng'),
        (710, 172, 165, 58, L('vt', 'tra-ve'), 'Phiếu trả ở trạng thái nháp'),
        (900, 172, 165, 58, L('vt', 'tra-ve'), 'Phiếu trả đã được duyệt'),
    ],
    '06-giao-hang-thu-tien.svg': [
        (440, 26, 230, 56, L('don'), 'Đơn bán hàng đã xác nhận'),
        (140, 160, 190, 60, L('tien', 'giao-hang'), 'Lập phiếu giao hàng'),
        (355, 160, 190, 60, L('tien', 'ba-truong-hop'), 'Ba trường hợp thu tiền'),
        (570, 160, 190, 60, L('tien', 'hoa-don'), 'Hoá đơn'),
        (785, 160, 190, 60, L('tien', 'nop-tien'), 'Nộp tiền mặt về công ty'),
        (140, 340, 175, 60, L('tien', 'van-chuyen'), 'Gửi qua đơn vị vận chuyển'),
        (330, 340, 175, 60, L('tien', 'van-chuyen'), 'Gửi qua đơn vị vận chuyển'),
        (520, 340, 175, 60, L('tien', 'van-chuyen'), 'Gửi qua đơn vị vận chuyển'),
        (710, 340, 175, 60, L('tien', 'van-chuyen'), 'Gửi qua đơn vị vận chuyển'),
        (900, 340, 175, 60, L('tien', 'van-chuyen'), 'Chứng từ tự phát sinh'),
    ],
    '07-bao-duong-lap-lai.svg': [
        (60, 50, 200, 62, L('tien', 'hoa-don'), 'Đơn hàng hoàn tất'),
        (290, 50, 200, 62, L('bd', 'sinh-lich'), 'Lịch nhắc theo từng vật tư'),
        (520, 50, 200, 62, L('bd', 'phieu-nhac'), 'Gom lịch theo khách hàng'),
        (750, 50, 200, 62, L('bd', 'phieu-nhac'), 'Phiếu nhắc bảo dưỡng'),
        (750, 190, 200, 62, L('bd', 'phan-cong'), 'Phân người phụ trách'),
        (520, 190, 200, 62, L('bd', 'lien-he'), 'Liên hệ khách hàng'),
        (60, 330, 200, 60, L('bd', 'don-moi'), 'Khách hàng đồng ý: lập đơn mới'),
        (290, 330, 200, 60, L('bd', 'lien-he'), 'Khách hàng hẹn lại'),
        (520, 330, 200, 60, L('bd', 'lien-he'), 'Không liên hệ được'),
        (750, 330, 200, 60, L('bd', 'lien-he'), 'Khách hàng không có nhu cầu'),
    ],
    '08-su-co.svg': [
        (60, 50, 200, 62, L('sc', 'tiep-nhan'), 'Tiếp nhận phản ánh'),
        (290, 50, 200, 62, L('sc', 'tiep-nhan'), 'Lập phiếu sự cố'),
        (520, 50, 200, 62, L('sc', 'phan-loai'), 'Phân loại hai tầng'),
        (750, 50, 200, 62, L('sc', 'phan-loai'), 'Gán người xử lý'),
        (100, 190, 210, 62, L('sc', 'hai-duong'), 'Xử lý qua điện thoại'),
        (450, 190, 210, 62, L('sc', 'hai-duong'), 'Cử người xuống hiện trường'),
        (760, 190, 210, 62, L('ht', 'lap-sa'), 'Lịch hẹn và kỹ thuật viên'),
        (760, 310, 210, 62, L('sc', 'don-moi'), 'Khi phát sinh vật tư tính phí'),
        (450, 310, 210, 62, L('sc', 'don-moi'), 'Lập đơn bán hàng mới'),
        (100, 310, 210, 62, L('sc', 'hai-duong'), 'Đóng phiếu sự cố'),
    ],
    '09-sau-dieu-kien-wo.svg': [
        (60, 58, 600, 44, L('ht', 'dieu-kien'), 'Điều kiện 1'),
        (60, 116, 600, 44, L('ht', 'dieu-kien'), 'Điều kiện 2'),
        (60, 174, 600, 44, L('ht', 'dieu-kien'), 'Điều kiện 3'),
        (60, 232, 600, 44, L('tien', 'wo-bi-chan'), 'Điều kiện 4: tiền và vật tư'),
        (60, 290, 600, 44, L('tien', 'wo-bi-chan'), 'Điều kiện 5: đơn bán hàng'),
        (60, 348, 600, 44, L('ht', 'dieu-kien'), 'Điều kiện 6'),
        (740, 66, 220, 96, L('tien', 'wo-bi-chan'), 'Đọc thông báo bị chặn'),
        (740, 348, 220, 60, L('ht', 'dieu-kien'), 'Phiếu chuyển sang hoàn thành'),
    ],
    '10-vong-doi-don-hang.svg': [
        (108, 62, 352, 78, L('don', 'khai-don'), 'Lập và xác nhận đơn'),
        (108, 166, 352, 78, L('ht', 'lap-wo'), 'Lập phiếu công việc'),
        (108, 270, 352, 78, L('ht', 'lap-sa'), 'Lập lịch hẹn'),
        (108, 374, 352, 78, L('vt', 'yeu-cau'), 'Xuất vật tư'),
        (108, 478, 352, 78, L('ht', 'hien-truong'), 'Làm việc tại hiện trường'),
        (108, 582, 352, 78, L('tien', 'giao-hang'), 'Lập phiếu giao hàng'),
        (108, 686, 352, 78, L('tien', 'ba-truong-hop'), 'Thu tiền'),
        (108, 790, 352, 78, L('tien', 'nop-tien'), 'Nộp tiền về công ty'),
        (108, 894, 352, 78, L('tien', 'ba-truong-hop'), 'Thu phần chuyển khoản'),
        (108, 998, 352, 78, L('tien', 'hoa-don'), 'Hoá đơn và lịch bảo dưỡng'),
    ],
    '11-thu-tien.svg': [
        (60, 116, 300, 44, L('tien', 'ba-truong-hop'), 'Khách hàng trả tiền mặt'),
        (420, 116, 300, 44, L('tien', 'ba-truong-hop'), 'Khách hàng chuyển khoản'),
        (780, 116, 300, 44, L('tien', 'ba-truong-hop'), 'Trả bằng cả hai hình thức'),
        (60, 196, 300, 72, L('tien', 'ba-truong-hop'), 'Phiếu thu tiền mặt'),
        (60, 294, 300, 72, L('tien', 'nop-tien'), 'Công nợ cá nhân của kỹ thuật viên'),
        (60, 392, 300, 72, L('tien', 'nop-tien'), 'Lập phiếu nộp tiền'),
        (60, 490, 300, 72, L('tien', 'nop-tien'), 'Kế toán xác nhận phiếu nộp'),
        (420, 196, 300, 72, L('tien', 'dieu-kien-thu'), 'Mã QR chuyển khoản'),
        (420, 294, 300, 72, L('tien', 'ba-truong-hop'), 'Phiếu thu ở trạng thái nháp'),
        (420, 392, 300, 72, L('tien', 'ba-truong-hop'), 'Kế toán đối chiếu sao kê'),
        (420, 490, 300, 72, L('tien', 'hoa-don'), 'Hoá đơn tự phát sinh'),
        (780, 196, 300, 72, L('tien', 'ba-truong-hop'), 'Hai dòng thu trên một đơn'),
        (780, 294, 300, 72, L('tien', 'ba-truong-hop'), 'Phần tiền mặt'),
        (780, 392, 300, 72, L('tien', 'ba-truong-hop'), 'Phần chuyển khoản'),
        (780, 490, 300, 72, L('tien', 'ba-truong-hop'), 'Khi nào đơn được tính là đủ'),
        (60, 590, 1020, 74, L('tien', 'hoa-don'), 'Kết quả chung của cả ba trường hợp'),
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
