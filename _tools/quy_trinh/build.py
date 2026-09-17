#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sinh nhánh tài liệu "Quy trình hợp nhất" từ dữ liệu trong _quy_trinh/.

Ba tầng:
  tầng 0 — bản đồ tổng             users/00-quy-trinh.md
  tầng 1 — sơ đồ phân khu          users/<trang>.md
  tầng 2 — thẻ tình huống          users/<trang>-Tinh-Huong.md

Sơ đồ được nhúng thẳng vào trang (SVG nội tuyến), nên liên kết trong sơ đồ
chạy như liên kết thường. Kiểu dáng các lớp qt-* nằm ở _includes/head_custom.html.

Bố cục theo lưới cố định để đường nối không cắt nhau; sau khi sinh, mọi sơ đồ
đều được chạy qua _tools/svg_cross_check.py, có lỗi thì dừng và không ghi trang.

Cách dùng:
  python3 _tools/quy_trinh/build.py            sinh trang
  python3 _tools/quy_trinh/build.py --xem DIR  sinh trang và xuất bản xem thử vào DIR
"""

import argparse
import glob
import html
import os
import re
import subprocess
import sys
import tempfile

import yaml

GOC = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DU_LIEU = os.path.join(GOC, '_quy_trinh')
USERS = os.path.join(GOC, 'users')
KIEM_DUONG = os.path.join(GOC, '_tools', 'svg_cross_check.py')
HEAD = os.path.join(GOC, '_includes', 'head_custom.html')

DAU_TRANG = ('<!-- Trang sinh tự động bởi _tools/quy_trinh/build.py từ _quy_trinh/. '
             'Sửa tệp dữ liệu rồi chạy lại bộ sinh; sửa thẳng trang này sẽ bị ghi đè. -->')


class LoiDuLieu(Exception):
    pass


# ---------------------------------------------------------------------------
# Đo và ngắt chữ
# ---------------------------------------------------------------------------

HEP = set("iìíỉĩịIÌÍỈĨỊlịj.,;:!'|()[]·-/ ")
RONG = set('mwMWĐDGHNOQUÔƠƯ—')


def do_chu(s, co, dam=False):
    w = 0.0
    for ch in s:
        if ch == ' ':
            w += 0.28
        elif ch in HEP:
            w += 0.30
        elif ch in RONG:
            w += 0.78
        elif ch.isupper():
            w += 0.66
        else:
            w += 0.55
    # Hệ số 1.08 hiệu chỉnh theo Noto Sans, phông rộng nhất trong các phông hệ thống thường gặp:
    # đo thật bằng trình duyệt, ước lượng này luôn lớn hơn hoặc bằng bề rộng thật.
    return w * co * (1.07 if dam else 1.0) * 1.08


def ngat(s, rong, co, dam=False, toi_da=3, ten='', _can_bang=False):
    tu = str(s).split()
    dong, cur = [], ''
    for t in tu:
        thu = (cur + ' ' + t).strip()
        if not cur or do_chu(thu, co, dam) <= rong:
            cur = thu
        else:
            dong.append(cur)
            cur = t
    if cur:
        dong.append(cur)
    if len(dong) > toi_da:
        raise LoiDuLieu('Chữ quá dài cho ô %s (cần %d dòng, tối đa %d): %r'
                        % (ten or '?', len(dong), toi_da, s))
    if len(dong) > 1 and not _can_bang:
        # Ngắt cân đối: thu hẹp dần bề rộng chừng nào số dòng chưa tăng,
        # để tránh dòng cuối chỉ còn một chữ.
        hep = rong
        while hep > 40:
            thu = ngat(s, hep - 4, co, dam, toi_da=99, _can_bang=True)
            if len(thu) > len(dong):
                break
            hep -= 4
        dong = ngat(s, hep, co, dam, toi_da=99, _can_bang=True)
    return dong


def esc(s):
    return html.escape(str(s), quote=True)


def g(v):
    return ('%.1f' % v).rstrip('0').rstrip('.')


# ---------------------------------------------------------------------------
# Khung SVG
# ---------------------------------------------------------------------------

class Svg:
    def __init__(self, rong, tieu_de, mo_ta, ma):
        self.rong = rong
        self.cao = 0
        self.tieu_de = tieu_de
        self.mo_ta = mo_ta
        self.ma = ma
        self.phan = []

    def them(self, s):
        self.phan.append(s)

    def hop(self, x, y, w, h, lop, bo=10):
        self.them('<rect class="%s" x="%s" y="%s" width="%s" height="%s" rx="%s" ry="%s"/>'
                  % (lop, g(x), g(y), g(w), g(h), bo, bo))

    def chu(self, x, y, s, lop, neo='start'):
        self.them('<text class="%s" x="%s" y="%s" text-anchor="%s">%s</text>'
                  % (lop, g(x), g(y), neo, esc(s)))

    def luc_giac(self, cx, cy, w, h, lop):
        n = h / 2
        d = [(cx - w / 2, cy), (cx - w / 2 + n, cy - n), (cx + w / 2 - n, cy - n),
             (cx + w / 2, cy), (cx + w / 2 - n, cy + n), (cx - w / 2 + n, cy + n)]
        self.them('<polygon class="%s" points="%s"/>'
                  % (lop, ' '.join('%s,%s' % (g(a), g(b)) for a, b in d)))

    def duong(self, diem, lop='qt-mui', dau='qt-ah'):
        if len(diem) == 2:
            (x1, y1), (x2, y2) = diem
            self.them('<line class="%s" x1="%s" y1="%s" x2="%s" y2="%s" marker-end="url(#%s)"/>'
                      % (lop, g(x1), g(y1), g(x2), g(y2), dau))
        else:
            self.them('<polyline class="%s" points="%s" marker-end="url(#%s)"/>'
                      % (lop, ' '.join('%s,%s' % (g(a), g(b)) for a, b in diem), dau))

    def mo_lien_ket(self, href, tieu_de):
        self.them('<a href="%s"><title>%s</title>' % (esc(href), esc(tieu_de)))

    def dong_lien_ket(self):
        self.them('</a>')

    def xuat(self, rieng=False, css=''):
        id_t = 'qt-t-' + self.ma
        id_d = 'qt-d-' + self.ma
        dau = ['<svg xmlns="http://www.w3.org/2000/svg" class="qt-svg" viewBox="0 0 %d %d" '
               'width="%d" height="%d" role="img" aria-labelledby="%s %s">'
               % (self.rong, self.cao, self.rong, self.cao, id_t, id_d),
               '<title id="%s">%s</title>' % (id_t, esc(self.tieu_de)),
               '<desc id="%s">%s</desc>' % (id_d, esc(self.mo_ta))]
        if rieng:
            dau.append('<style>%s</style>' % css)
        dau.append('<defs>'
                   '<marker id="qt-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" '
                   'markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9ca3af"/></marker>'
                   '<marker id="qt-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" '
                   'markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#52a86a"/></marker>'
                   '</defs>')
        dau.append('<rect class="qt-nen" x="0" y="0" width="%d" height="%d"/>' % (self.rong, self.cao))
        return '\n'.join(dau + self.phan + ['</svg>'])


def nhan_the(svg, x, y, ma, href, lop='qt-pill'):
    """Vẽ nhãn mã thẻ tình huống; trả về bề rộng đã dùng."""
    nhan = '⚠ ' + ma
    w = do_chu(nhan, 11, True) + 16
    svg.mo_lien_ket(href, 'Mở thẻ ' + ma)
    svg.hop(x, y, w, 20, lop, 10)
    svg.chu(x + w / 2, y + 14, nhan, 'qt-tp', 'middle')
    svg.dong_lien_ket()
    return w


def dat_nhan_the(svg, x0, y0, rong, cac_ma, href_the):
    """Xếp các nhãn thẻ thành hàng, xuống dòng khi hết chỗ. Trả về số hàng."""
    x, y, hang = x0, y0, 1
    for ma in cac_ma:
        w = do_chu('⚠ ' + ma, 11, True) + 16
        if x > x0 and x + w > x0 + rong:
            x, y, hang = x0, y + 26, hang + 1
        nhan_the(svg, x, y, ma, href_the(ma))
        x += w + 8
    return hang


def so_hang_nhan(rong, cac_ma):
    if not cac_ma:
        return 0
    x, hang = 0, 1
    for ma in cac_ma:
        w = do_chu('⚠ ' + ma, 11, True) + 16
        if x > 0 and x + w > rong:
            x, hang = 0, hang + 1
        x += w + 8
    return hang


# ---------------------------------------------------------------------------
# Đọc dữ liệu
# ---------------------------------------------------------------------------

def doc_yaml(duong):
    with open(duong, encoding='utf-8') as f:
        return yaml.safe_load(f)


class BoDuLieu:
    def __init__(self):
        self.danh_sach = doc_yaml(os.path.join(DU_LIEU, 'phan-khu.yml'))
        self.pk = {z['ma']: z for z in self.danh_sach}
        self.ban_do = doc_yaml(os.path.join(DU_LIEU, 'ban-do.yml'))
        self.chi_tiet = {}
        for duong in sorted(glob.glob(os.path.join(DU_LIEU, '[A-Z]-*.yml'))):
            d = doc_yaml(duong)
            if d['ma'] not in self.pk:
                raise LoiDuLieu('%s: phân khu %s không có trong phan-khu.yml' % (duong, d['ma']))
            self.chi_tiet[d['ma']] = PhanKhu(d, self)

    def da_dung(self, ma):
        return ma in self.chi_tiet

    def ten(self, ma):
        return self.pk[ma]['ten']

    def trang_pk(self, ma):
        if self.da_dung(ma):
            return self.chi_tiet[ma].trang + '.html'
        return self.pk[ma]['trang_tam']

    def lien_ket(self, ma, buoc=None, tam=None):
        """Đường dẫn tới một bước của phân khu, tính từ thư mục users/."""
        if self.da_dung(ma):
            pk = self.chi_tiet[ma]
            if buoc and buoc not in pk.nhan:
                raise LoiDuLieu('Phân khu %s không có bước %r' % (ma, buoc))
            return pk.trang + '.html' + ('#' + buoc if buoc else '')
        if tam:
            return tam
        return self.pk[ma]['trang_tam']


class PhanKhu:
    def __init__(self, d, bo):
        self.d = d
        self.bo = bo
        self.ma = d['ma']
        self.ten = d['ten']
        self.trang = d['trang']
        self.trang_the = d['trang'] + '-Tinh-Huong'
        self.the = {t['ma']: t for t in d.get('the', [])}
        self.nhan = {}       # id → nhãn đọc được
        self.so = {}         # id → số thứ tự hiển thị
        self.noi_xu_ly = {}  # mã thẻ → id bước nơi thẻ được gắn
        self._danh_so()

    def _gan(self, ma_the, id_buoc):
        if ma_the not in self.the:
            raise LoiDuLieu('Phân khu %s: bước %s trỏ tới thẻ %s không tồn tại'
                            % (self.ma, id_buoc, ma_the))
        self.noi_xu_ly.setdefault(ma_the, id_buoc)

    def _danh_so(self):
        n = 0
        for pt in self.d['luong']:
            if 'buoc' in pt:
                b = pt['buoc']
                n += 1
                self.so[b['id']] = str(n)
                self.nhan[b['id']] = '%s·%d · %s' % (self.ma, n, b['ten'])
                for m in b.get('the', []):
                    self._gan(m, b['id'])
            elif 'song_song' in pt:
                s = pt['song_song']
                n += 1
                self.so[s['id']] = str(n)
                self.nhan[s['id']] = '%s·%d · %s' % (self.ma, n, s['ten'])
                for i, nh in enumerate(s['nhanh']):
                    chu = 'abcdefgh'[i]
                    self.so[nh['id']] = '%d%s' % (n, chu)
                    self.nhan[nh['id']] = '%s·%d%s · %s' % (self.ma, n, chu, nh['ten'])
                    for b in nh['buoc']:
                        for m in b.get('the', []):
                            self._gan(m, nh['id'])
            elif 're' in pt:
                r = pt['re']
                self.nhan[r['id']] = '%s · %s' % (self.ma, r['hoi'])
                if 'the' in r['nhanh']:
                    self._gan(r['nhanh']['the'], r['id'])
        nl = self.d.get('ngoai_luong')
        if nl:
            self.nhan[nl['id']] = '%s · %s' % (self.ma, nl['ten'])
            for m in nl.get('the', []):
                self._gan(m, nl['id'])
        thieu = [m for m in self.the if m not in self.noi_xu_ly]
        if thieu:
            raise LoiDuLieu('Phân khu %s: thẻ chưa được gắn vào sơ đồ: %s' % (self.ma, ', '.join(thieu)))

    def href_the(self, ma, tu_trang_the=False):
        neo = '#' + ma.lower()
        return neo if tu_trang_the else self.trang_the + '.html' + neo

    def tham_chieu(self, ref, tu_trang_the):
        """ref = {buoc} trong phân khu này, hoặc {phan_khu, buoc, ten, tam}. Trả (nhãn, href)."""
        ma = ref.get('phan_khu', self.ma)
        if ma == self.ma:
            b = ref['buoc']
            if b not in self.nhan:
                raise LoiDuLieu('Phân khu %s: không có bước %r' % (self.ma, b))
            href = (self.trang + '.html#' + b) if tu_trang_the else ('#' + b)
            return self.nhan[b], href
        if self.bo.da_dung(ma):
            pk = self.bo.chi_tiet[ma]
            return pk.nhan[ref['buoc']], self.bo.lien_ket(ma, ref['buoc'])
        return '%s · %s' % (ma, ref['ten']), self.bo.lien_ket(ma, ref.get('buoc'), ref.get('tam'))


# ---------------------------------------------------------------------------
# Tầng 1 — sơ đồ phân khu
# ---------------------------------------------------------------------------

W1 = 760
TRAI, PHAI = 20, 740
CX = 210
SW = 320
CHX, CHW = 420, 320
KHE = 30


def ve_phan_khu(pk):
    d = pk.d
    lop = pk.bo.pk[pk.ma]['lop']
    svg = Svg(W1, 'Sơ đồ phân khu %s — %s' % (pk.ma, pk.ten),
              'Đường chính của phân khu %s, đọc từ trên xuống. Ô chữ nhật là bước, ô sáu cạnh là điểm rẽ, '
              'nhãn đỏ là thẻ tình huống, ô viền đứt là cổng sang phân khu khác.' % pk.ma,
              'pk-' + pk.ma.lower())
    y = 20
    truoc = None   # (loại, đáy, x trái, x phải)

    def noi_vao(dinh, x=CX):
        if truoc is not None:
            svg.duong([(x, truoc[1]), (x, dinh - 4)])

    href_the = pk.href_the

    for pt in d['luong']:
        if 'cong_vao' in pt:
            cac = pt['cong_vao']
            n = len(cac)
            gw = (SW - (n - 1) * 16) / n
            h = 50
            for i, c in enumerate(cac):
                x = CX - SW / 2 + i * (gw + 16)
                href = pk.bo.lien_ket(c['tu'], c.get('buoc'), c.get('tam'))
                svg.mo_lien_ket(href, 'Mở phân khu ' + c['tu'])
                svg.hop(x, y, gw, h, 'qt-cong')
                svg.chu(x + gw / 2, y + 21, '▶ Từ %s · %s' % (c['tu'], pk.bo.ten(c['tu'])), 'qt-tb', 'middle')
                svg.chu(x + gw / 2, y + 39, c['ten'], 'qt-ts', 'middle')
                svg.dong_lien_ket()
            if n > 1:
                raise LoiDuLieu('Chưa hỗ trợ nhiều cổng vào')
            truoc = ('cong', y + h)
            y += h + KHE

        elif 're' in pt:
            r = pt['re']
            dong = ngat(r['hoi'], SW - 80, 13.5, True, 2, r['id'])
            h = max(50, 18 + 18 * len(dong))
            cy = y + h / 2
            noi_vao(y)
            svg.mo_lien_ket('#' + r['id'], r['hoi'])
            svg.luc_giac(CX, cy, SW, h, 'qt-re')
            for i, t in enumerate(dong):
                svg.chu(CX, cy - (len(dong) - 1) * 9 + 5 + i * 18, t, 'qt-tb', 'middle')
            svg.dong_lien_ket()
            nh = r['nhanh']
            # nhánh rẽ phải
            if 'the' in nh:
                t = pk.the[nh['the']]
                dong_t = ngat(t['ten'], CHW - 28, 12, False, 2, t['ma'])
                ch = max(h, 30 + 16 * len(dong_t))
                cy0 = cy - ch / 2
                svg.mo_lien_ket(href_the(t['ma']), 'Mở thẻ ' + t['ma'])
                svg.hop(CHX, cy0, CHW, ch, 'qt-the')
                svg.chu(CHX + 14, cy0 + 19, '⚠ ' + t['ma'], 'qt-tt')
                for i, s in enumerate(dong_t):
                    svg.chu(CHX + 14, cy0 + 36 + i * 16, s, 'qt-ts')
                svg.dong_lien_ket()
            else:
                c = nh['cong']
                href = pk.bo.lien_ket(c['sang'], c.get('buoc'), c.get('tam'))
                ch = h
                cy0 = cy - ch / 2
                svg.mo_lien_ket(href, 'Mở phân khu ' + c['sang'])
                svg.hop(CHX, cy0, CHW, ch, 'qt-cong')
                svg.chu(CHX + 14, cy0 + 20, '◀ Sang %s · %s' % (c['sang'], pk.bo.ten(c['sang'])), 'qt-tb')
                svg.chu(CHX + 14, cy0 + 38, c['ten'], 'qt-ts')
                svg.dong_lien_ket()
            svg.duong([(CX + SW / 2, cy), (CHX - 4, cy)])
            svg.chu((CX + SW / 2 + CHX) / 2, cy - 7, nh['nhan'], 'qt-nhan', 'middle')
            day = max(y + h, cy0 + ch)
            svg.chu(CX + 10, y + h + 18, r['tiep'], 'qt-nhan')
            truoc = ('re', y + h)
            y = day + KHE

        elif 'buoc' in pt:
            b = pt['buoc']
            rong = b.get('rong', False)
            x0, w = (TRAI, PHAI - TRAI) if rong else (CX - SW / 2, SW)
            vung = w - 58
            dong = ngat(b['ten'], vung, 13.5, True, 2, b['id'])
            phu = ngat(b.get('phu', ''), vung, 12, False, 2, b['id']) if b.get('phu') else []
            cac_ma = b.get('the', [])
            hn = so_hang_nhan(vung, cac_ma)
            h = 16 + 18 * len(dong) + 16 * len(phu) + (hn * 26 + 4 if hn else 0) + 8
            noi_vao(y)
            svg.mo_lien_ket('#' + b['id'], pk.nhan[b['id']])
            svg.hop(x0, y, w, h, lop)
            svg.them('<circle class="qt-tron" cx="%s" cy="%s" r="12"/>' % (g(x0 + 24), g(y + 24)))
            svg.chu(x0 + 24, y + 28, pk.so[b['id']], 'qt-so', 'middle')
            yy = y + 28
            for t in dong:
                svg.chu(x0 + 46, yy, t, 'qt-tb')
                yy += 18
            for t in phu:
                svg.chu(x0 + 46, yy - 2, t, 'qt-ts')
                yy += 16
            svg.dong_lien_ket()
            if cac_ma:
                dat_nhan_the(svg, x0 + 46, yy - 6, vung, cac_ma, href_the)
            truoc = ('buoc', y + h)
            y += h + KHE

        elif 'song_song' in pt:
            s = pt['song_song']
            n = len(s['nhanh'])
            cw = (PHAI - TRAI - (n - 1) * 16) / n
            # đầu khối: ô sáu cạnh trải rộng
            dong = ngat(s['ten'], PHAI - TRAI - 140, 13.5, True, 1, s['id'])
            h = 50
            noi_vao(y)
            svg.mo_lien_ket('#' + s['id'], pk.nhan[s['id']])
            svg.luc_giac((TRAI + PHAI) / 2, y + h / 2, PHAI - TRAI, h, 'qt-re')
            svg.them('<circle class="qt-tron" cx="%s" cy="%s" r="12"/>' % (g(TRAI + 44), g(y + h / 2)))
            svg.chu(TRAI + 44, y + h / 2 + 4, pk.so[s['id']], 'qt-so', 'middle')
            svg.chu((TRAI + PHAI) / 2, y + h / 2 + 5, dong[0], 'qt-tb', 'middle')
            svg.dong_lien_ket()
            day_dau = y + h
            y_cot = day_dau + KHE
            day_cot = []
            for i, nh in enumerate(s['nhanh']):
                x = TRAI + i * (cw + 16)
                cxi = x + cw / 2
                # tên nhánh
                th = 34
                svg.duong([(cxi, day_dau), (cxi, y_cot - 4)])
                svg.mo_lien_ket('#' + nh['id'], pk.nhan[nh['id']])
                svg.hop(x, y_cot, cw, th, lop, 17)
                svg.chu(cxi, y_cot + 22, '%s · %s' % (pk.so[nh['id']], nh['ten']), 'qt-tb', 'middle')
                svg.dong_lien_ket()
                yy = y_cot + th
                for b in nh['buoc']:
                    vung = cw - 28
                    dt = ngat(b['ten'], vung, 13, True, 2, nh['id'])
                    dp = ngat(b.get('phu', ''), vung, 11.5, False, 2, nh['id']) if b.get('phu') else []
                    cm = b.get('the', [])
                    hn = so_hang_nhan(vung, cm)
                    bh = 14 + 17 * len(dt) + 15 * len(dp) + (hn * 26 + 2 if hn else 0) + 8
                    top = yy + KHE - 6
                    svg.duong([(cxi, yy), (cxi, top - 4)])
                    svg.mo_lien_ket('#' + nh['id'], pk.nhan[nh['id']])
                    svg.hop(x, top, cw, bh, 'qt-trang')
                    ty = top + 24
                    for t in dt:
                        svg.chu(x + 14, ty, t, 'qt-tb2')
                        ty += 17
                    for t in dp:
                        svg.chu(x + 14, ty - 2, t, 'qt-ts')
                        ty += 15
                    svg.dong_lien_ket()
                    if cm:
                        dat_nhan_the(svg, x + 14, ty - 6, vung, cm, href_the)
                    yy = top + bh
                day_cot.append((cxi, yy))
            # ô gộp
            gp = s['gop']
            y_gop = max(b for _, b in day_cot) + KHE
            for cxi, b in day_cot:
                svg.duong([(cxi, b), (cxi, y_gop - 4)])
            gh = 50 if gp.get('phu') else 36
            svg.mo_lien_ket('#' + s['id'], pk.nhan[s['id']])
            svg.hop(TRAI, y_gop, PHAI - TRAI, gh, 'qt-trang')
            svg.chu((TRAI + PHAI) / 2, y_gop + 22, gp['ten'], 'qt-tb', 'middle')
            if gp.get('phu'):
                svg.chu((TRAI + PHAI) / 2, y_gop + 40, gp['phu'], 'qt-ts', 'middle')
            svg.dong_lien_ket()
            truoc = ('gop', y_gop + gh)
            y = y_gop + gh + KHE

        elif 'cong_ra' in pt:
            cac = pt['cong_ra']
            n = len(cac)
            if n > 1 and truoc[0] not in ('gop',) and not _truoc_rong(d, pt):
                raise LoiDuLieu('Nhiều cổng ra thì bước ngay trước phải có "rong: true"')
            gw = min(SW, (PHAI - TRAI - (n - 1) * 30) / n)
            tong = n * gw + (n - 1) * 30
            x_dau = (TRAI + PHAI) / 2 - tong / 2 if n > 1 else CX - gw / 2
            h = 50
            for i, c in enumerate(cac):
                x = x_dau + i * (gw + 30)
                cxi = x + gw / 2
                svg.duong([(cxi, truoc[1]), (cxi, y - 4)])
                href = pk.bo.lien_ket(c['sang'], c.get('buoc'), c.get('tam'))
                svg.mo_lien_ket(href, 'Mở phân khu ' + c['sang'])
                svg.hop(x, y, gw, h, 'qt-cong')
                svg.chu(cxi, y + 21, '◀ Sang %s · %s' % (c['sang'], pk.bo.ten(c['sang'])), 'qt-tb', 'middle')
                svg.chu(cxi, y + 39, c['ten'], 'qt-ts', 'middle')
                svg.dong_lien_ket()
            truoc = None
            y += h + KHE

    nl = d.get('ngoai_luong')
    if nl:
        y += 6
        cac = nl.get('the', [])
        so_cot = 3
        cw = (PHAI - TRAI - 32 - (so_cot - 1) * 16) / so_cot
        o = []
        for m in cac:
            t = pk.the[m]
            o.append((t, ngat(t['ten'], cw - 24, 12, False, 3, m)))
        hang = [o[i:i + so_cot] for i in range(0, len(o), so_cot)]
        cao_hang = [max(34 + 16 * len(dt) for _, dt in h_) for h_ in hang]
        khung_h = 44 + sum(cao_hang) + 12 * (len(hang) - 1) + 16
        svg.mo_lien_ket('#' + nl['id'], nl['ten'])
        svg.hop(TRAI, y, PHAI - TRAI, khung_h, 'qt-ngoai', 12)
        svg.chu(TRAI + 16, y + 26, nl['ten'], 'qt-lan')
        svg.dong_lien_ket()
        yy = y + 40
        for hi, h_ in enumerate(hang):
            for ci, (t, dt) in enumerate(h_):
                x = TRAI + 16 + ci * (cw + 16)
                svg.mo_lien_ket(href_the(t['ma']), 'Mở thẻ ' + t['ma'])
                svg.hop(x, yy, cw, cao_hang[hi], 'qt-the')
                svg.chu(x + 12, yy + 19, '⚠ ' + t['ma'], 'qt-tt')
                for k, s in enumerate(dt):
                    svg.chu(x + 12, yy + 36 + k * 16, s, 'qt-ts')
                svg.dong_lien_ket()
            yy += cao_hang[hi] + 12
        y += khung_h + 20

    svg.cao = int(y)
    return svg


def _truoc_rong(d, pt_hien):
    luong = d['luong']
    i = luong.index(pt_hien)
    trc = luong[i - 1]
    return 'buoc' in trc and trc['buoc'].get('rong')


# ---------------------------------------------------------------------------
# Tầng 2 — sơ đồ nhỏ trong thẻ tình huống
# ---------------------------------------------------------------------------

MW = 470
MX, MSW = 12, 226
MCX = MX + MSW / 2
MRX, MRW = 292, 166


def ve_the(pk, t):
    svg = Svg(MW, 'Các bước gỡ tình huống ' + t['ma'],
              'Các bước xử lý tình huống %s: %s' % (t['ma'], t['ten']), 'the-' + t['ma'].lower())
    y = 10
    day_truoc = None
    re_seen = False
    ben_phai = None

    def o_doc(chu, lop):
        nonlocal y, day_truoc
        dong = ngat(chu, MSW - 24, 12.5, False, 3, t['ma'])
        h = 16 + 17 * len(dong)
        if day_truoc is not None:
            svg.duong([(MCX, day_truoc), (MCX, y - 4)])
        svg.hop(MX, y, MSW, h, lop)
        for i, s in enumerate(dong):
            svg.chu(MX + 12, y + 22 + i * 17, s, 'qt-tn')
        day_truoc = y + h
        y += h + 28

    for pt in t['go']:
        if re_seen:
            raise LoiDuLieu('Thẻ %s: sau điểm rẽ không được có thêm bước' % t['ma'])
        if 'buoc' in pt:
            o_doc(pt['buoc'], 'qt-trang')
        else:
            r = pt['re']
            re_seen = True
            dong = ngat(r['hoi'], MSW - 64, 12.5, True, 2, t['ma'])
            h = max(46, 16 + 17 * len(dong))
            cy = y + h / 2
            if day_truoc is not None:
                svg.duong([(MCX, day_truoc), (MCX, y - 4)])
            svg.luc_giac(MCX, cy, MSW, h, 'qt-re')
            for i, s in enumerate(dong):
                svg.chu(MCX, cy - (len(dong) - 1) * 8.5 + 4.5 + i * 17, s, 'qt-tb2', 'middle')
            # nhánh không — bên phải
            dk = ngat(r['khong'], MRW - 22, 12.5, False, 4, t['ma'])
            kh = 16 + 17 * len(dk)
            ky = cy - kh / 2
            svg.hop(MRX, ky, MRW, kh, 'qt-trang')
            for i, s in enumerate(dk):
                svg.chu(MRX + 11, ky + 22 + i * 17, s, 'qt-tn')
            svg.duong([(MX + MSW, cy), (MRX - 4, cy)])
            svg.chu((MX + MSW + MRX) / 2, cy - 6, 'không', 'qt-nhan', 'middle')
            svg.chu(MCX + 8, y + h + 17, 'có', 'qt-nhan')
            ben_phai = (MRX + MRW / 2, ky + kh)
            day_truoc = y + h
            y = max(y + h + 28, ky + kh + 28)
            o_doc(r['co'], 'qt-ok')

    if t.get('quay_ve'):
        nhan, href = pk.tham_chieu(t['quay_ve'], True)
        ma_buoc, _, ten_buoc = nhan.partition(' · ')
        dong = ngat(ten_buoc, MSW - 24, 12.5, False, 2, t['ma'])
        h = 16 + 17 * (len(dong) + 1)
        if ben_phai and ben_phai[1] + 12 > y:
            y = ben_phai[1] + 28
        svg.duong([(MCX, day_truoc), (MCX, y - 4)])
        if ben_phai:
            gy = y + h / 2
            svg.duong([(ben_phai[0], ben_phai[1]), (ben_phai[0], gy), (MX + MSW + 4, gy)])
        svg.mo_lien_ket(href, 'Quay về ' + nhan)
        svg.hop(MX, y, MSW, h, 'qt-cong')
        svg.chu(MX + 12, y + 22, '↩ Quay về ' + ma_buoc, 'qt-tb2')
        for i, s in enumerate(dong):
            svg.chu(MX + 12, y + 39 + i * 17, s, 'qt-tn')
        svg.dong_lien_ket()
        y += h + 10
    else:
        y -= 18
    svg.cao = int(y)
    return svg


# ---------------------------------------------------------------------------
# Tầng 0 — bản đồ tổng
# ---------------------------------------------------------------------------

W0 = 760
LAN_X0, LAN_W = 30, 144
HANG_Y0, HANG_B = 118, 84
OW, OH = 124, 58
HW = 136


def ve_ban_do(bo):
    bd = bo.ban_do
    thu_tu = [z['ma'] for z in bo.danh_sach]
    svg = Svg(W0, bd['tieu_de'], bd['mo_ta'], 'ban-do')
    so_hang = max(o['hang'] for o in bd['o']) + 1
    cao = HANG_Y0 + (so_hang - 1) * HANG_B + OH / 2 + 62

    def tam_lan(ma):
        return LAN_X0 + thu_tu.index(ma) * LAN_W + LAN_W / 2

    # nền làn và đầu làn
    for i, ma in enumerate(thu_tu):
        x = LAN_X0 + i * LAN_W
        svg.them('<rect class="qt-lan-nen%d" x="%s" y="12" width="%s" height="%s"/>'
                 % (i % 2, g(x), g(LAN_W), g(cao - 22)))
        z = bo.pk[ma]
        svg.mo_lien_ket(bo.trang_pk(ma), 'Mở sơ đồ phân khu %s · %s' % (ma, z['ten']))
        dong = ngat(z['ten'], LAN_W - 24, 12.5, True, 2, 'đầu làn ' + ma)
        svg.hop(x + 6, 20, LAN_W - 12, 62, z['lop'], 8)
        svg.chu(x + LAN_W / 2, 36, 'PHÂN KHU ' + ma, 'qt-lan-nho', 'middle')
        for k, t in enumerate(dong):
            svg.chu(x + LAN_W / 2, 54 + k * 15 + (7 if len(dong) == 1 else 0), t, 'qt-tb2', 'middle')
        svg.dong_lien_ket()

    hinh = {}
    for o in bd['o']:
        cx = tam_lan(o['lan'])
        cy = HANG_Y0 + o['hang'] * HANG_B
        w = HW if o['kieu'] == 're' else OW
        hinh[o['o']] = dict(cx=cx, cy=cy, w=w, h=OH, trai=cx - w / 2, phai=cx + w / 2,
                            tren=cy - OH / 2, duoi=cy + OH / 2, kieu=o['kieu'])
        den = o['den']
        href = bo.lien_ket(den['phan_khu'], den.get('buoc'), den.get('tam'))
        svg.mo_lien_ket(href, o['chu'])
        if o['kieu'] == 're':
            svg.luc_giac(cx, cy, w, OH, 'qt-re')
            dong = ngat(o['chu'], w - 50, 12, True, 2, o['o'])
        else:
            svg.hop(cx - w / 2, cy - OH / 2, w, OH,
                    'qt-cong' if o['kieu'] == 'cong' else bo.pk[o['lan']]['lop'])
            dong = ngat(o['chu'], w - 14, 12, True, 3, o['o'])
        for i, s in enumerate(dong):
            svg.chu(cx, cy - (len(dong) - 1) * 7.5 + 4.5 + i * 15, s, 'qt-tb3', 'middle')
        svg.dong_lien_ket()
        if o.get('canh_bao'):
            svg.them('<circle class="qt-canh" cx="%s" cy="%s" r="8"/>' % (g(cx + w / 2 - 2), g(cy - OH / 2 + 1)))
            svg.chu(cx + w / 2 - 2, cy - OH / 2 + 5.5, '!', 'qt-canh-chu', 'middle')

    def x_lan(q):
        if 'x' in q:
            return q['x']
        x = LAN_X0 + thu_tu.index(q['lan']) * LAN_W
        if q.get('canh') == 'phai':
            x += LAN_W
        return x + q.get('lech', 0)

    def diem(hh, canh, lech):
        if canh == 'duoi':
            return (hh['cx'] + lech, hh['duoi'])
        if canh == 'tren':
            return (hh['cx'] + lech, hh['tren'])
        if canh == 'trai':
            return (hh['trai'], hh['cy'])
        return (hh['phai'], hh['cy'])

    for n in bd['noi']:
        a, b = hinh[n['tu']], hinh[n['toi']]
        ra, vao = n.get('ra', 'duoi'), n.get('vao', 'tren')
        p1 = diem(a, ra, n.get('lech_ra', 0))
        p2 = diem(b, vao, n.get('lech_vao', 0))
        if ra == 'duoi' and vao == 'tren':
            if abs(p1[0] - p2[0]) < 0.5:
                d = [p1, (p2[0], p2[1] - 4)]
            else:
                ym = (p1[1] + p2[1]) / 2
                d = [p1, (p1[0], ym), (p2[0], ym), (p2[0], p2[1] - 4)]
        elif ra == 'duoi':
            dx = 4 if vao == 'phai' else -4
            d = [p1, (p1[0], p2[1]), (p2[0] + dx, p2[1])]
        elif vao == 'tren':
            d = [p1, (p2[0], p1[1]), (p2[0], p2[1] - 4)]
        else:
            qx = x_lan(n['qua']) if 'qua' in n else (p1[0] + p2[0]) / 2
            dx = 4 if vao == 'phai' else -4
            d = [p1, (qx, p1[1]), (qx, p2[1]), (p2[0] + dx, p2[1])]
        svg.duong(d)
        if n.get('nhan'):
            if ra == 'phai' and vao == 'phai':
                lx, ly, neo = d[1][0] + 6, (d[1][1] + d[2][1]) / 2 + 4, 'start'
            elif d[1][0] == d[0][0]:
                if n.get('nhan_trai'):
                    lx, ly, neo = d[0][0] - 8, d[0][1] + 16, 'end'
                else:
                    lx, ly, neo = d[0][0] + 8, d[0][1] + 16, 'start'
            else:
                huong = 1 if d[1][0] > d[0][0] else -1
                lx, ly = d[0][0] + huong * 8, d[0][1] - 7
                neo = 'start' if huong > 0 else 'end'
            svg.chu(lx, ly, n['nhan'], 'qt-nhan', neo)

    v = bd['vong']
    a, b = hinh[v['tu']], hinh[v['toi']]
    yb = HANG_Y0 + (so_hang - 1) * HANG_B + OH / 2 + 28
    xp, xt = x_lan(v['qua_phai']), x_lan(v['qua_trai'])
    svg.duong([(a['trai'], a['cy']), (xp, a['cy']), (xp, yb),
               (xt, yb), (xt, b['cy']), (b['trai'] - 4, b['cy'])],
              'qt-vong', 'qt-ag')
    svg.chu((xp + xt) / 2, yb - 8, v['nhan'], 'qt-vong-chu', 'middle')
    svg.cao = int(cao)
    return svg


# ---------------------------------------------------------------------------
# Trang
# ---------------------------------------------------------------------------

def gan_ma_the(chu, pk, tu_trang_the=False):
    """Biến mã thẻ (TT-05) trong văn bản thành liên kết, bỏ qua mã đã nằm trong liên kết."""
    mau = re.compile(r'(?<![\[#\w-])(%s-\d\d)(?![\]\w])' % re.escape(pk.d['tien_to']))

    def thay(m):
        ma = m.group(1)
        if ma not in pk.the:
            return ma
        return '[%s](%s)' % (ma, pk.href_the(ma, tu_trang_the))
    return mau.sub(thay, chu)


def md_sang_html(s):
    s = esc(s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'`(.+?)`', r'<code>\1</code>', s)
    s = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', s)
    return s


def khoi_so_do(svg):
    return '<div class="qt-sodo">\n' + svg.xuat() + '\n</div>'


CHU_GIAI = ('<p class="qt-chu-giai">'
            '<span class="qt-k qt-k-buoc"></span> bước '
            '<span class="qt-k qt-k-re"></span> điểm rẽ '
            '<span class="qt-k qt-k-the"></span> thẻ tình huống '
            '<span class="qt-k qt-k-cong"></span> sang phân khu khác'
            '<br>👆 Bấm vào bất kỳ ô nào để mở phần giải thích.</p>')


def trang_phan_khu(pk):
    d = pk.d
    bo = pk.bo
    ra = []
    vao = []
    for pt in d['luong']:
        if 'cong_vao' in pt:
            for c in pt['cong_vao']:
                vao.append('▶ [%s · %s](%s) — %s' % (c['tu'], bo.ten(c['tu']),
                           bo.lien_ket(c['tu'], c.get('buoc'), c.get('tam')), c['ten']))
        if 'cong_ra' in pt:
            for c in pt['cong_ra']:
                ra.append('◀ [%s · %s](%s) — %s' % (c['sang'], bo.ten(c['sang']),
                          bo.lien_ket(c['sang'], c.get('buoc'), c.get('tam')), c['ten']))
    L = ['---',
         'title: %s · %s' % (pk.ma, pk.ten),
         'layout: default',
         'parent: Quy trình hợp nhất',
         'nav_order: %s' % d['nav_order'],
         'has_children: true',
         '---',
         '',
         DAU_TRANG,
         '',
         '# Phân khu %s — %s' % (pk.ma, pk.ten),
         '{: .no_toc }',
         '',
         '**Ai làm:** %s' % d['ai_lam'],
         '{: .fs-3 .text-grey-dk-000 }',
         '',
         d['gioi_thieu'].strip(),
         '',
         '| Nhận vào | Bàn giao ra |',
         '|---|---|',
         '| %s | %s |' % ('<br>'.join(vao) or '—', '<br>'.join(ra) or '—'),
         '',
         '👉 **[Các thẻ tình huống của phân khu %s](%s.html)** · [Bản đồ tổng](00-quy-trinh.html)'
         % (pk.ma, pk.trang_the),
         '',
         '---',
         '',
         '## Mục lục',
         '{: .no_toc .text-delta }',
         '',
         '1. TOC',
         '{:toc}',
         '',
         '---',
         '',
         '## Sơ đồ phân khu',
         '{: #so-do }',
         '',
         khoi_so_do(ve_phan_khu(pk)),
         '',
         CHU_GIAI,
         '',
         '---',
         '']

    def ds_the(cac_ma):
        if not cac_ma:
            return []
        out = ['', '**Tình huống ở bước này:**', '']
        for m in cac_ma:
            out.append('- ⚠ [%s · %s](%s)' % (m, pk.the[m]['ten'], pk.href_the(m)))
        return out

    for pt in d['luong']:
        if 're' in pt:
            r = pt['re']
            nh = r['nhanh']
            if 'the' in nh:
                di = '<a href="%s">⚠ %s · %s</a>' % (pk.href_the(nh['the']), nh['the'],
                                                     esc(pk.the[nh['the']]['ten']))
            else:
                c = nh['cong']
                di = '<a href="%s">◀ %s · %s</a>' % (bo.lien_ket(c['sang'], c.get('buoc'), c.get('tam')),
                                                     c['sang'], esc(bo.ten(c['sang'])))
            L += ['<div class="qt-re-khoi" id="%s"><strong>⬡ %s</strong><br>'
                  '<em>%s</em> → đi tiếp xuống bước sau · <em>%s</em> → %s</div>'
                  % (r['id'], esc(r['hoi']), esc(r['tiep']), esc(nh['nhan']), di), '']
        elif 'buoc' in pt:
            b = pt['buoc']
            L += ['## %s·%s — %s' % (pk.ma, pk.so[b['id']], b['ten']),
                  '{: #%s }' % b['id'], '']
            if b.get('ai'):
                L += ['**Ai làm:** %s' % b['ai'], '']
            if b.get('noi_dung'):
                L += [gan_ma_the(b['noi_dung'].rstrip(), pk)]
            L += ds_the(b.get('the', []))
            L += ['', '---', '']
        elif 'song_song' in pt:
            s = pt['song_song']
            L += ['## %s·%s — %s' % (pk.ma, pk.so[s['id']], s['ten']),
                  '{: #%s }' % s['id'], '']
            if s.get('ai'):
                L += ['**Ai làm:** %s' % s['ai'], '']
            if s.get('noi_dung'):
                L += [gan_ma_the(s['noi_dung'].rstrip(), pk), '']
            for nh in s['nhanh']:
                L += ['### %s·%s — %s' % (pk.ma, pk.so[nh['id']], nh['ten']),
                      '{: #%s }' % nh['id'], '']
                for i, b in enumerate(nh['buoc'], 1):
                    L.append('%d. **%s** — %s' % (i, b['ten'], b.get('phu', '')))
                L.append('')
                if nh.get('noi_dung'):
                    L += [gan_ma_the(nh['noi_dung'].rstrip(), pk)]
                cm = []
                for b in nh['buoc']:
                    cm += b.get('the', [])
                L += ds_the(cm)
                L.append('')
            L += ['---', '']

    nl = d.get('ngoai_luong')
    if nl:
        L += ['## %s' % nl['ten'], '{: #%s }' % nl['id'], '']
        if nl.get('noi_dung'):
            L += [gan_ma_the(nl['noi_dung'].rstrip(), pk)]
        L += ds_the(nl.get('the', []))
        L += ['', '---', '']

    if d.get('hoi_dap'):
        L += ['## Câu hỏi thường gặp', '{: #hoi-dap }', '']
        for q in d['hoi_dap']:
            L += ['**%s**' % q['hoi'], '', gan_ma_the(q['dap'].strip(), pk), '']
        L += ['---', '']

    L += ['## Đọc tiếp', '{: #doc-tiep }', '',
          '| Bạn cần | Mở trang |', '|---|---|',
          '| Xem cách gỡ từng tình huống | [Thẻ tình huống của phân khu %s](%s.html) |' % (pk.ma, pk.trang_the),
          '| Xem toàn bộ dây chuyền | [Bản đồ tổng](00-quy-trinh.html) |',
          '| Đi theo một đơn hàng cụ thể | [Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html) |', '']
    return '\n'.join(L)


def trang_the(pk):
    d = pk.d
    L = ['---',
         'title: %s · Tình huống' % pk.ma,
         'layout: default',
         'parent: %s · %s' % (pk.ma, pk.ten),
         'grand_parent: Quy trình hợp nhất',
         'nav_order: 1',
         '---',
         '',
         DAU_TRANG,
         '',
         '# Phân khu %s — Tình huống cần xử lý' % pk.ma,
         '{: .no_toc }',
         '',
         'Mỗi thẻ gồm: gặp ở đâu, dấu hiệu, nguyên nhân, các bước gỡ, và gỡ xong thì quay về bước nào.',
         '{: .fs-3 .text-grey-dk-000 }',
         '',
         '👉 [Sơ đồ phân khu %s](%s.html) · [Bản đồ tổng](00-quy-trinh.html)' % (pk.ma, pk.trang),
         '',
         '---',
         '',
         '## Danh mục thẻ',
         '{: #danh-muc }',
         '',
         '| Mã | Tình huống | Xử lý ở bước |',
         '|---|---|---|']
    for t in d['the']:
        nhan, href = pk.tham_chieu({'buoc': pk.noi_xu_ly[t['ma']]}, True)
        L.append('| [%s](#%s) | %s | [%s](%s) |' % (t['ma'], t['ma'].lower(), t['ten'], nhan, href))
    L += ['', '---', '']

    for t in d['the']:
        L += ['## %s · %s' % (t['ma'], t['ten']), '{: #%s }' % t['ma'].lower(), '']
        hang = []
        xl_nhan, xl_href = pk.tham_chieu({'buoc': pk.noi_xu_ly[t['ma']]}, True)
        gap_nhan, gap_href = pk.tham_chieu(t['gap_o'], True)
        if (gap_nhan, gap_href) != (xl_nhan, xl_href):
            hang.append(('Gặp ở', '<a href="%s">%s</a>' % (esc(gap_href), esc(gap_nhan))))
            hang.append(('Xử lý ở', '<a href="%s">%s</a>' % (esc(xl_href), esc(xl_nhan))))
        else:
            hang.append(('Ở bước', '<a href="%s">%s</a>' % (esc(xl_href), esc(xl_nhan))))
        if t.get('thong_bao'):
            hang.append(('Thông báo', '<span class="qt-thong-bao">%s</span>' % esc(t['thong_bao'])))
        if t.get('dau_hieu'):
            hang.append(('Dấu hiệu', md_sang_html(t['dau_hieu'])))
        hang.append(('Nguyên nhân', md_sang_html(t['nguyen_nhan'])))
        hang.append(('Ai xử lý', esc(t['ai'])))
        tt = ['<table class="qt-the-bang">']
        for k, v in hang:
            tt.append('<tr><th>%s</th><td>%s</td></tr>' % (k, v))
        tt.append('</table>')
        if t.get('canh_bao'):
            tt.append('<p class="qt-canh-bao">⚠️ %s</p>' % md_sang_html(t['canh_bao']))
        lq = re.findall(r'%s-\d\d' % d['tien_to'], ' '.join(r['re']['co'] + ' ' + r['re']['khong']
                                                              for r in t['go'] if 're' in r))
        if lq:
            tt.append('<p class="qt-lien-quan">Liên quan: %s</p>'
                      % ' · '.join('<a href="#%s">%s</a>' % (m.lower(), m) for m in dict.fromkeys(lq)))
        L += ['<div class="qt-the-khung">',
              '<div class="qt-the-tt">',
              '\n'.join(tt),
              '</div>',
              '<div class="qt-the-sd qt-sodo">',
              ve_the(pk, t).xuat(),
              '</div>',
              '</div>',
              '',
              '[↑ Danh mục thẻ](#danh-muc)',
              '{: .fs-2 }',
              '',
              '---',
              '']
    return '\n'.join(L)


def trang_ban_do(bo):
    L = ['---',
         'title: Quy trình hợp nhất',
         'layout: default',
         'nav_order: 1.8',
         'has_children: true',
         '---',
         '',
         DAU_TRANG,
         '',
         '# Quy trình hợp nhất',
         '{: .no_toc }',
         '',
         'Toàn bộ dây chuyền, từ lúc khách hàng để lại số điện thoại cho tới lúc được chăm sóc định kỳ '
         'nhiều năm sau — chia thành **năm phân khu**, đọc theo **ba tầng**.',
         '{: .fs-4 }',
         '',
         '| Tầng | Là gì | Mở bằng cách |',
         '|---|---|---|',
         '| **0 · Bản đồ tổng** | Năm phân khu trên một trang, chỉ có luồng chính và các điểm rẽ quan trọng | Trang này |',
         '| **1 · Sơ đồ phân khu** | Mọi bước và điểm rẽ trong một phân khu; ngoại lệ được gập thành nhãn ⚠ | Bấm tên phân khu ở đầu làn |',
         '| **2 · Thẻ tình huống** | Dấu hiệu, nguyên nhân, các bước gỡ, gỡ xong quay về đâu | Bấm nhãn ⚠ trên sơ đồ phân khu |',
         '',
         '---',
         '',
         '## Bản đồ tổng',
         '{: #ban-do }',
         '',
         khoi_so_do(ve_ban_do(bo)),
         '',
         CHU_GIAI.replace('<span class="qt-k qt-k-the"></span> thẻ tình huống ',
                          '<span class="qt-k qt-k-canh"></span> có tình huống rẽ nhánh '),
         '',
         '---',
         '',
         '## Năm phân khu',
         '{: #phan-khu }',
         '',
         '| Phân khu | Phạm vi | Ai làm |',
         '|---|---|---|']
    for z in bo.danh_sach:
        if bo.da_dung(z['ma']):
            ten = '**[%s · %s](%s)**' % (z['ma'], z['ten'], bo.trang_pk(z['ma']))
        else:
            ten = '%s · %s <br><small>đang chuyển — tạm xem [bản cũ](%s)</small>' % (
                z['ma'], z['ten'], z['trang_tam'])
        L.append('| %s | %s | %s |' % (ten, z['pham_vi'], z['ai_lam']))
    L += ['',
          '---',
          '',
          '## Trang khác',
          '{: #trang-khac }',
          '',
          '| Bạn cần | Mở trang |',
          '|---|---|',
          '| Đi theo một đơn hàng cụ thể từ đầu đến cuối | [Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html) |',
          '| Tra tên chứng từ, ai làm trên màn hình nào | [Tổng quan toàn chuỗi](Quy-Trinh-Tong-Quan.html) |',
          '| Tài liệu theo chặng (đang chuyển sang phân khu) | [Các chặng — bản cũ](Quy-Trinh-Ban-Cu.html) |',
          '',
          '## Quy ước',
          '{: #quy-uoc }',
          '',
          '| Ký hiệu | Nghĩa |',
          '|---|---|',
          '| `Sales Order` | Tên chứng từ trên hệ thống — gõ tên này vào ô tìm kiếm mới ra đúng |',
          '| `D·3a` | Phân khu D, bước 3, nhánh a |',
          '| `TT-05` | Mã thẻ tình huống; hai chữ cái đầu cho biết phân khu |',
          '| ⛔ · ⚠️ · ✅ | Hệ thống chặn · dễ sai, cần đọc kỹ · cách làm đúng |',
          '']
    return '\n'.join(L)


# ---------------------------------------------------------------------------
# Chạy
# ---------------------------------------------------------------------------

def lay_css():
    s = open(HEAD, encoding='utf-8').read()
    m = re.search(r'/\* QT-BAT-DAU \*/(.*?)/\* QT-KET-THUC \*/', s, re.S)
    if not m:
        raise LoiDuLieu('Không tìm thấy khối CSS qt-* trong _includes/head_custom.html')
    return m.group(1)


def kiem_duong_cat(cac_svg):
    thu_muc = tempfile.mkdtemp(prefix='qt-kiem-')
    tep = []
    for ten, svg in cac_svg:
        p = os.path.join(thu_muc, ten + '.svg')
        with open(p, 'w', encoding='utf-8') as f:
            f.write(svg.xuat())
        tep.append(p)
    kq = subprocess.run([sys.executable, KIEM_DUONG] + tep, capture_output=True, text=True)
    loi = [l for l in kq.stdout.splitlines() if 'SACH' not in l]
    return kq.returncode, loi, len(tep)


def ghi(duong, noi_dung):
    with open(duong, 'w', encoding='utf-8') as f:
        f.write(noi_dung.rstrip() + '\n')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--xem', help='xuất SVG riêng lẻ và trang HTML xem thử vào thư mục này')
    tham = ap.parse_args()

    try:
        bo = BoDuLieu()
        cac_svg = [('ban-do', ve_ban_do(bo))]
        for ma, pk in bo.chi_tiet.items():
            cac_svg.append(('pk-' + ma, ve_phan_khu(pk)))
            for t in pk.d['the']:
                cac_svg.append(('the-' + t['ma'], ve_the(pk, t)))
        rc, loi, so = kiem_duong_cat(cac_svg)
        if rc:
            print('Đường nối cắt hoặc chạm nhau — không ghi trang:')
            print('\n'.join(loi))
            return 1
        print('Kiểm đường cắt: %d sơ đồ sạch.' % so)

        ghi(os.path.join(USERS, '00-quy-trinh.md'), trang_ban_do(bo))
        for ma, pk in bo.chi_tiet.items():
            ghi(os.path.join(USERS, pk.trang + '.md'), trang_phan_khu(pk))
            ghi(os.path.join(USERS, pk.trang_the + '.md'), trang_the(pk))
            print('Phân khu %s: %d thẻ tình huống.' % (ma, len(pk.the)))
    except LoiDuLieu as e:
        print('LỖI DỮ LIỆU:', e)
        return 2

    if tham.xem:
        os.makedirs(tham.xem, exist_ok=True)
        css = lay_css()
        for ten, svg in cac_svg:
            with open(os.path.join(tham.xem, ten + '.svg'), 'w', encoding='utf-8') as f:
                f.write(svg.xuat(rieng=True, css=css))
        print('Đã xuất bản xem thử vào', tham.xem)
    return 0


if __name__ == '__main__':
    sys.exit(main())
