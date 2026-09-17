#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sinh nhánh tài liệu "Quy trình hợp nhất" từ dữ liệu trong _quy_trinh/.

Ba tầng:
  tầng 0 — bản đồ tổng             users/00-quy-trinh.md
  tầng 1 — sơ đồ phân khu          users/<trang>.md
  tầng 2 — thẻ tình huống          users/<trang>-Tinh-Huong.md
và một trang tra cứu gom mọi thẻ   users/Quy-Trinh-Tra-Cuu.md

Sơ đồ được nhúng thẳng vào trang (SVG nội tuyến), nên liên kết trong sơ đồ
chạy như liên kết thường. Kiểu dáng các lớp qt-* nằm ở _includes/head_custom.html.

Bố cục theo lưới cố định để đường nối không cắt nhau; sau khi dựng, mọi sơ đồ
đều được chạy qua _tools/svg_cross_check.py, có lỗi thì dừng và không ghi trang.
Mọi tham chiếu giữa các phân khu (cổng, thẻ, bước quay về, ô trên bản đồ) cũng
được kiểm trước khi ghi.

Cách dùng:
  python3 _tools/quy_trinh/build.py            sinh trang
  python3 _tools/quy_trinh/build.py --xem DIR  sinh trang và xuất SVG xem thử vào DIR
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
TRANG_TRA_CUU = 'Quy-Trinh-Tra-Cuu'

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
    if (len(dong) > 1 and not _can_bang
            and do_chu(dong[-1], co, dam) < 0.5 * max(do_chu(x, co, dam) for x in dong[:-1])):
        # Dòng cuối quá ngắn thì ngắt cân đối: thu hẹp dần bề rộng chừng nào số dòng
        # chưa tăng. Dòng cuối đã đủ dài thì giữ nguyên, để không tách đôi từ ghép.
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

    def tron(self, cx, cy, r, lop):
        self.them('<circle class="%s" cx="%s" cy="%s" r="%s"/>' % (lop, g(cx), g(cy), g(r)))

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


def rong_nhan(ma):
    return do_chu('⚠ ' + ma, 11, True) + 16


def nhan_the(svg, x, y, ma, href):
    w = rong_nhan(ma)
    svg.mo_lien_ket(href, 'Mở thẻ ' + ma)
    svg.hop(x, y, w, 20, 'qt-pill', 10)
    svg.chu(x + w / 2, y + 14, '⚠ ' + ma, 'qt-tp', 'middle')
    svg.dong_lien_ket()


def dat_nhan_the(svg, x0, y0, rong, cac_ma, href_the):
    x, y = x0, y0
    for ma in cac_ma:
        w = rong_nhan(ma)
        if x > x0 and x + w > x0 + rong:
            x, y = x0, y + 26
        nhan_the(svg, x, y, ma, href_the(ma))
        x += w + 8


def so_hang_nhan(rong, cac_ma):
    if not cac_ma:
        return 0
    x, hang = 0, 1
    for ma in cac_ma:
        w = rong_nhan(ma)
        if x > 0 and x + w > rong:
            x, hang = 0, hang + 1
        x += w + 8
    return hang


# ---------------------------------------------------------------------------
# Dữ liệu
# ---------------------------------------------------------------------------

def doc_yaml(duong):
    with open(duong, encoding='utf-8') as f:
        return yaml.safe_load(f)


class BoDuLieu:
    def __init__(self):
        self.danh_sach = doc_yaml(os.path.join(DU_LIEU, 'phan-khu.yml'))
        self.pk = {z['ma']: z for z in self.danh_sach}
        self.ban_do = doc_yaml(os.path.join(DU_LIEU, 'ban-do.yml'))
        p = os.path.join(DU_LIEU, 'tra-cuu.yml')
        self.tra_cuu = doc_yaml(p) if os.path.exists(p) else {}
        self.chi_tiet = {}
        for duong in sorted(glob.glob(os.path.join(DU_LIEU, '[A-Z]-*.yml'))):
            d = doc_yaml(duong)
            if d['ma'] not in self.pk:
                raise LoiDuLieu('%s: phân khu %s không có trong phan-khu.yml' % (duong, d['ma']))
            self.chi_tiet[d['ma']] = PhanKhu(d, self)
        self.tien_to = {}
        for pk in self.chi_tiet.values():
            if pk.tien_to in self.tien_to:
                raise LoiDuLieu('Hai phân khu dùng chung tiền tố thẻ %s' % pk.tien_to)
            self.tien_to[pk.tien_to] = pk

    def da_dung(self, ma):
        return ma in self.chi_tiet

    def _thieu(self, ma):
        if 'trang_tam' in self.pk[ma]:
            return self.pk[ma]['trang_tam']
        raise LoiDuLieu('Phân khu %s chưa có tệp dữ liệu và cũng không khai trang_tam' % ma)

    def tat_ca_da_dung(self):
        return all(self.da_dung(z['ma']) for z in self.danh_sach)

    def ten(self, ma):
        if ma not in self.pk:
            raise LoiDuLieu('Không có phân khu %r' % ma)
        return self.pk[ma]['ten']

    def trang_pk(self, ma):
        if self.da_dung(ma):
            return self.chi_tiet[ma].trang + '.html'
        return self._thieu(ma)

    def lien_ket(self, ma, buoc=None, tam=None):
        """Đường dẫn tới một bước của phân khu, tính từ thư mục users/."""
        self.ten(ma)
        if self.da_dung(ma):
            pk = self.chi_tiet[ma]
            if buoc and buoc not in pk.nhan:
                raise LoiDuLieu('Phân khu %s không có bước %r' % (ma, buoc))
            return pk.trang + '.html' + ('#' + buoc if buoc else '')
        if tam:
            return tam
        return self._thieu(ma)

    def nhan_buoc(self, ma, buoc, ten_du_phong=None):
        if self.da_dung(ma) and buoc:
            return self.chi_tiet[ma].nhan[buoc]
        return '%s · %s' % (ma, ten_du_phong or self.ten(ma))

    def the_bat_ky(self, ma_the):
        tt = ma_the.split('-')[0]
        pk = self.tien_to.get(tt)
        if not pk or ma_the not in pk.the:
            raise LoiDuLieu('Không có thẻ %s' % ma_the)
        return pk, pk.the[ma_the]

    def kiem_tham_chieu(self):
        """Gọi thử mọi liên kết chéo để lộ lỗi trước khi ghi trang."""
        for o in self.ban_do['o']:
            den = o['den']
            self.lien_ket(den['phan_khu'], den.get('buoc'), den.get('tam'))
        for pk in self.chi_tiet.values():
            for ma, buoc, tam in pk.cac_cong():
                self.lien_ket(ma, buoc, tam)
            for t in pk.the.values():
                pk.tham_chieu(t['gap_o'], True)
                if t.get('quay_ve'):
                    pk.tham_chieu(t['quay_ve'], True)
                for m in t.get('lien_quan', []):
                    self.the_bat_ky(m)


class PhanKhu:
    def __init__(self, d, bo):
        self.d = d
        self.bo = bo
        self.ma = d['ma']
        self.ten = d['ten']
        self.trang = d['trang']
        self.tien_to = d['tien_to']
        self.trang_the = d['trang'] + '-Tinh-Huong'
        if 'cac_luong' in d:
            self.cac_luong = d['cac_luong']
        else:
            self.cac_luong = [{'id': 'so-do', 'ten': None, 'luong': d['luong'],
                               'ngoai_luong': d.get('ngoai_luong')}]
        self.the = {}
        for t in d.get('the', []):
            if not t['ma'].startswith(self.tien_to + '-'):
                raise LoiDuLieu('Thẻ %s không mang tiền tố %s' % (t['ma'], self.tien_to))
            if t['ma'] in self.the:
                raise LoiDuLieu('Trùng mã thẻ %s' % t['ma'])
            self.the[t['ma']] = t
        self.nhan = {}
        self.so = {}
        self.noi_xu_ly = {}
        self._danh_so()

    def _dang_ky(self, id_, nhan):
        if id_ in self.nhan:
            raise LoiDuLieu('Phân khu %s: trùng id %r' % (self.ma, id_))
        self.nhan[id_] = nhan

    def _gan(self, ma_the, id_buoc):
        if ma_the not in self.the:
            raise LoiDuLieu('Phân khu %s: bước %s trỏ tới thẻ %s không tồn tại'
                            % (self.ma, id_buoc, ma_the))
        self.noi_xu_ly.setdefault(ma_the, id_buoc)

    def _danh_so(self):
        n = 0
        for lg in self.cac_luong:
            if lg.get('ten'):
                self._dang_ky(lg['id'], '%s · %s' % (self.ma, lg['ten']))
            for pt in lg['luong']:
                if 'buoc' in pt:
                    b = pt['buoc']
                    if b.get('sang'):
                        self._dang_ky(b['id'], '%s · %s' % (self.ma, b['ten']))
                    else:
                        n += 1
                        self.so[b['id']] = str(n)
                        self._dang_ky(b['id'], '%s·%d · %s' % (self.ma, n, b['ten']))
                    for m in b.get('the', []):
                        self._gan(m, b['id'])
                elif 'song_song' in pt:
                    s = pt['song_song']
                    n += 1
                    self.so[s['id']] = str(n)
                    self._dang_ky(s['id'], '%s·%d · %s' % (self.ma, n, s['ten']))
                    for i, nh in enumerate(s['nhanh']):
                        chu = 'abcdefgh'[i]
                        self.so[nh['id']] = '%d%s' % (n, chu)
                        self._dang_ky(nh['id'], '%s·%d%s · %s' % (self.ma, n, chu, nh['ten']))
                        for b in nh['buoc']:
                            for m in b.get('the', []):
                                self._gan(m, nh['id'])
                    for m in s.get('gop', {}).get('the', []):
                        self._gan(m, s['id'])
                elif 're' in pt:
                    r = pt['re']
                    self._dang_ky(r['id'], '%s · %s' % (self.ma, r['hoi']))
                    if 'the' in r['nhanh']:
                        self._gan(r['nhanh']['the'], r['id'])
            nl = lg.get('ngoai_luong')
            if nl:
                self._dang_ky(nl['id'], '%s · %s' % (self.ma, nl['ten']))
                for m in nl.get('the', []):
                    self._gan(m, nl['id'])
        for pl in self.d.get('phu_luc', []):
            self._dang_ky(pl['id'], '%s · %s' % (self.ma, pl['ten']))
        thieu = [m for m in self.the if m not in self.noi_xu_ly]
        if thieu:
            raise LoiDuLieu('Phân khu %s: thẻ chưa được gắn vào sơ đồ: %s' % (self.ma, ', '.join(thieu)))

    def cac_cong(self):
        """Mọi tham chiếu sang phân khu khác: (mã, bước, trang tạm)."""
        for lg in self.cac_luong:
            for pt in lg['luong']:
                for c in pt.get('cong_vao', []):
                    yield c['tu'], c.get('buoc'), c.get('tam')
                for c in pt.get('cong_ra', []):
                    yield c['sang'], c.get('buoc'), c.get('tam')
                if 'buoc' in pt:
                    b = pt['buoc']
                    if b.get('sang'):
                        yield b['sang'], b.get('den'), b.get('tam')
                    if b.get('vao_ben'):
                        v = b['vao_ben']
                        yield v['tu'], v.get('buoc'), v.get('tam')
                if 're' in pt and 'cong' in pt['re']['nhanh']:
                    c = pt['re']['nhanh']['cong']
                    yield c['sang'], c.get('buoc'), c.get('tam')
                if 'song_song' in pt:
                    for nh in pt['song_song']['nhanh']:
                        for b in nh['buoc']:
                            if b.get('sang'):
                                yield b['sang'], b.get('den'), b.get('tam')

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
        return (self.bo.nhan_buoc(ma, ref.get('buoc'), ref.get('ten')),
                self.bo.lien_ket(ma, ref.get('buoc'), ref.get('tam')))


# ---------------------------------------------------------------------------
# Tầng 1 — sơ đồ phân khu
# ---------------------------------------------------------------------------

W1 = 760
TRAI, PHAI = 20, 740
CX = 210
SW = 320
CHX, CHW = 420, 320
KHE = 30


def ngat_cong(dam, w, ten=''):
    """Dòng đậm của ô cổng: không vừa một dòng thì xuống dòng ngay tại dấu ·, giữ nguyên tên phân khu."""
    if do_chu(dam, 13, True) <= w or ' · ' not in dam:
        return ngat(dam, w, 13, True, 2, ten)
    dau, _, sau = dam.partition(' · ')
    dong = ngat(dau, w, 13, True, 1, ten) + ngat(sau, w, 13, True, 1, ten)
    return dong


def ve_o_cong(svg, x, y, w, dam, nho, href, tieu_de, can_giua=True, h=None):
    """Ô cổng viền đứt: dòng đậm rồi dòng nhỏ. Trả chiều cao."""
    dd = ngat_cong(dam, w - 20, tieu_de)
    dn = ngat(nho, w - 20, 12, False, 2, tieu_de) if nho else []
    hh = h or (16 + 17 * len(dd) + 15 * len(dn) + 6)
    tx, neo = (x + w / 2, 'middle') if can_giua else (x + 12, 'start')
    ty = y + (hh - (17 * len(dd) + 15 * len(dn))) / 2 + 12
    svg.mo_lien_ket(href, tieu_de)
    svg.hop(x, y, w, hh, 'qt-cong')
    for t in dd:
        svg.chu(tx, ty, t, 'qt-tb2', neo)
        ty += 17
    for t in dn:
        svg.chu(tx, ty - 1, t, 'qt-ts', neo)
        ty += 15
    svg.dong_lien_ket()
    return hh


def cao_o_cong(w, dam, nho):
    dd = ngat_cong(dam, w - 20)
    dn = ngat(nho, w - 20, 12, False, 2) if nho else []
    return 16 + 17 * len(dd) + 15 * len(dn) + 6


def ve_phan_khu(pk, lg, so_luong):
    bo = pk.bo
    lop = bo.pk[pk.ma]['lop']
    ma_svg = 'pk-%s' % pk.ma if so_luong == 1 else 'pk-%s-%s' % (pk.ma, lg['id'])
    tieu_de = 'Sơ đồ phân khu %s — %s' % (pk.ma, pk.ten) + (' · ' + lg['ten'] if lg.get('ten') else '')
    svg = Svg(W1, tieu_de,
              'Đường chính đọc từ trên xuống. Ô chữ nhật là bước, ô sáu cạnh là điểm rẽ, '
              'nhãn đỏ là thẻ tình huống, ô viền đứt là cổng sang phân khu khác.', ma_svg)
    y = 20
    truoc = None      # (đáy, [các x có mũi tên đi ra])
    href_the = pk.href_the

    def noi_vao(dinh):
        if truoc is None:
            return
        for x in truoc[1]:
            svg.duong([(x, truoc[0]), (x, dinh - 4)])

    luong = lg['luong']
    for vi_tri, pt in enumerate(luong):
        if 'cong_vao' in pt:
            cac = pt['cong_vao']
            n = len(cac)
            gw = (SW - (n - 1) * 16) / n
            dams = ['▶ Từ %s · %s' % (c['tu'], bo.ten(c['tu'])) for c in cac]
            h = max(cao_o_cong(gw, d_, c['ten']) for d_, c in zip(dams, cac))
            xs = []
            for i, (d_, c) in enumerate(zip(dams, cac)):
                x = CX - SW / 2 + i * (gw + 16)
                ve_o_cong(svg, x, y, gw, d_, c['ten'],
                          bo.lien_ket(c['tu'], c.get('buoc'), c.get('tam')), 'Mở phân khu ' + c['tu'], h=h)
                xs.append(x + gw / 2)
            truoc = (y + h, xs)
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
                dam = '◀ Sang %s · %s' % (c['sang'], bo.ten(c['sang']))
                ch = max(h, cao_o_cong(CHW, dam, c['ten']))
                cy0 = cy - ch / 2
                ve_o_cong(svg, CHX, cy0, CHW, dam, c['ten'],
                          bo.lien_ket(c['sang'], c.get('buoc'), c.get('tam')),
                          'Mở phân khu ' + c['sang'], can_giua=False, h=ch)
            svg.duong([(CX + SW / 2, cy), (CHX - 4, cy)])
            svg.chu((CX + SW / 2 + CHX) / 2, cy - 7, nh['nhan'], 'qt-nhan', 'middle')
            svg.chu(CX + 10, y + h + 18, r['tiep'], 'qt-nhan')
            truoc = (y + h, [CX])
            y = max(y + h, cy0 + ch) + KHE

        elif 'buoc' in pt:
            b = pt['buoc']
            rong = b.get('rong', False)
            x0, w = (TRAI, PHAI - TRAI) if rong else (CX - SW / 2, SW)
            noi_vao(y)
            if b.get('sang'):
                if rong or b.get('the') or b.get('vao_ben'):
                    raise LoiDuLieu('Bước chuyển sang phân khu khác (%s) không được rộng, gắn thẻ hay nhận cổng bên'
                                    % b['id'])
                h = ve_o_cong(svg, x0, y, w, '▷ ' + b['ten'],
                              'Phân khu %s · %s' % (b['sang'], bo.ten(b['sang'])),
                              bo.lien_ket(b['sang'], b.get('den'), b.get('tam')),
                              'Mở phân khu ' + b['sang'])
                truoc = (y + h, [CX])
                y += h + KHE
                continue
            vung = w - 58
            dong = ngat(b['ten'], vung, 13.5, True, 2, b['id'])
            phu = ngat(b['phu'], vung, 12, False, 2, b['id']) if b.get('phu') else []
            cac_ma = b.get('the', [])
            hn = so_hang_nhan(vung, cac_ma)
            h = 16 + 18 * len(dong) + 16 * len(phu) + (hn * 26 + 4 if hn else 0) + 8
            svg.mo_lien_ket('#' + b['id'], pk.nhan[b['id']])
            svg.hop(x0, y, w, h, lop)
            svg.tron(x0 + 24, y + 24, 12, 'qt-tron')
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
            day = y + h
            v = b.get('vao_ben')
            if v:
                if rong:
                    raise LoiDuLieu('Bước rộng %s không nhận được cổng bên' % b['id'])
                dam = '▶ Từ %s · %s' % (v['tu'], bo.ten(v['tu']))
                vh = cao_o_cong(CHW, dam, v['ten'])
                cy = y + h / 2
                vy = cy - vh / 2
                ve_o_cong(svg, CHX, vy, CHW, dam, v['ten'],
                          bo.lien_ket(v['tu'], v.get('buoc'), v.get('tam')),
                          'Mở phân khu ' + v['tu'], can_giua=False)
                svg.duong([(CHX, cy), (x0 + w + 4, cy)])
                day = max(day, vy + vh)
            truoc = (y + h, [CX])
            y = day + KHE

        elif 'song_song' in pt:
            s = pt['song_song']
            n = len(s['nhanh'])
            cw = (PHAI - TRAI - (n - 1) * 16) / n
            dong = ngat(s['ten'], PHAI - TRAI - 140, 13.5, True, 1, s['id'])
            h = 50
            noi_vao(y)
            svg.mo_lien_ket('#' + s['id'], pk.nhan[s['id']])
            svg.luc_giac((TRAI + PHAI) / 2, y + h / 2, PHAI - TRAI, h, 'qt-re')
            svg.tron(TRAI + 44, y + h / 2, 12, 'qt-tron')
            svg.chu(TRAI + 44, y + h / 2 + 4, pk.so[s['id']], 'qt-so', 'middle')
            svg.chu((TRAI + PHAI) / 2, y + h / 2 + 5, dong[0], 'qt-tb', 'middle')
            svg.dong_lien_ket()
            day_dau = y + h
            y_cot = day_dau + KHE
            day_cot = []
            for i, nh in enumerate(s['nhanh']):
                x = TRAI + i * (cw + 16)
                cxi = x + cw / 2
                tieu = '%s · %s' % (pk.so[nh['id']], nh['ten'])
                dt_nh = ngat(tieu, cw - 20, 13.5, True, 2, nh['id'])
                th = 16 + 17 * len(dt_nh)
                svg.duong([(cxi, day_dau), (cxi, y_cot - 4)])
                svg.mo_lien_ket('#' + nh['id'], pk.nhan[nh['id']])
                svg.hop(x, y_cot, cw, th, lop, 17)
                for k, t in enumerate(dt_nh):
                    svg.chu(cxi, y_cot + 22 + k * 17, t, 'qt-tb', 'middle')
                svg.dong_lien_ket()
                yy = y_cot + th
                for b in nh['buoc']:
                    top = yy + KHE - 6
                    svg.duong([(cxi, yy), (cxi, top - 4)])
                    if b.get('sang'):
                        bh = ve_o_cong(svg, x, top, cw, '▷ ' + b['ten'],
                                       'Phân khu %s · %s' % (b['sang'], bo.ten(b['sang'])),
                                       bo.lien_ket(b['sang'], b.get('den'), b.get('tam')),
                                       'Mở phân khu ' + b['sang'])
                        yy = top + bh
                        continue
                    vung = cw - 28
                    dt = ngat(b['ten'], vung, 13, True, 2, nh['id'])
                    dp = ngat(b['phu'], vung, 11.5, False, 2, nh['id']) if b.get('phu') else []
                    cm = b.get('the', [])
                    hn = so_hang_nhan(vung, cm)
                    bh = 14 + 17 * len(dt) + 15 * len(dp) + (hn * 26 + 2 if hn else 0) + 8
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
            gp = s['gop']
            y_gop = max(b for _, b in day_cot) + KHE
            for cxi, b in day_cot:
                svg.duong([(cxi, b), (cxi, y_gop - 4)])
            cm = gp.get('the', [])
            dg = ngat(gp['ten'], PHAI - TRAI - 40, 13.5, True, 1, s['id'])
            dpg = ngat(gp['phu'], PHAI - TRAI - 40, 12, False, 2, s['id']) if gp.get('phu') else []
            gh = 16 + 18 + 16 * len(dpg) + (30 if cm else 0) + 4
            svg.mo_lien_ket('#' + s['id'], pk.nhan[s['id']])
            svg.hop(TRAI, y_gop, PHAI - TRAI, gh, 'qt-trang')
            svg.chu((TRAI + PHAI) / 2, y_gop + 24, dg[0], 'qt-tb', 'middle')
            for k, t in enumerate(dpg):
                svg.chu((TRAI + PHAI) / 2, y_gop + 42 + k * 16, t, 'qt-ts', 'middle')
            svg.dong_lien_ket()
            if cm:
                tong = sum(rong_nhan(m) + 8 for m in cm) - 8
                dat_nhan_the(svg, (TRAI + PHAI) / 2 - tong / 2, y_gop + gh - 30, tong + 1, cm, href_the)
            truoc = (y_gop + gh, [CX])
            y = y_gop + gh + KHE

        elif 'cong_ra' in pt:
            cac = pt['cong_ra']
            n = len(cac)
            trc = luong[vi_tri - 1]
            trc_rong = ('song_song' in trc) or ('buoc' in trc and trc['buoc'].get('rong'))
            if n > 1 and not trc_rong:
                raise LoiDuLieu('Phân khu %s: nhiều cổng ra thì phần tử ngay trước phải rộng' % pk.ma)
            if n == 1:
                gw, xs0 = SW, [CX - SW / 2]
            else:
                gw = min(SW, (PHAI - TRAI - (n - 1) * 30) / n)
                tong = n * gw + (n - 1) * 30
                xs0 = [(TRAI + PHAI) / 2 - tong / 2 + i * (gw + 30) for i in range(n)]
            dams = ['◀ Sang %s · %s' % (c['sang'], bo.ten(c['sang'])) for c in cac]
            h = max(cao_o_cong(gw, d_, c['ten']) for d_, c in zip(dams, cac))
            for x, d_, c in zip(xs0, dams, cac):
                cxi = x + gw / 2
                svg.duong([(cxi, truoc[0]), (cxi, y - 4)])
                ve_o_cong(svg, x, y, gw, d_, c['ten'],
                          bo.lien_ket(c['sang'], c.get('buoc'), c.get('tam')),
                          'Mở phân khu ' + c['sang'], h=h)
            truoc = None
            y += h + KHE
        else:
            raise LoiDuLieu('Phân khu %s: phần tử luồng không rõ loại: %r' % (pk.ma, list(pt)))

    nl = lg.get('ngoai_luong')
    if nl:
        y += 6
        cac = nl.get('the', [])
        so_cot = 3
        cw = (PHAI - TRAI - 32 - (so_cot - 1) * 16) / so_cot
        o = [(pk.the[m], ngat(pk.the[m]['ten'], cw - 24, 12, False, 3, m)) for m in cac]
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
    da_re = False
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
        if da_re:
            raise LoiDuLieu('Thẻ %s: sau điểm rẽ không được có thêm bước' % t['ma'])
        if 'buoc' in pt:
            o_doc(pt['buoc'], 'qt-trang')
        else:
            r = pt['re']
            da_re = True
            dong = ngat(r['hoi'], MSW - 64, 12.5, True, 2, t['ma'])
            h = max(46, 16 + 17 * len(dong))
            cy = y + h / 2
            if day_truoc is not None:
                svg.duong([(MCX, day_truoc), (MCX, y - 4)])
            svg.luc_giac(MCX, cy, MSW, h, 'qt-re')
            for i, s in enumerate(dong):
                svg.chu(MCX, cy - (len(dong) - 1) * 8.5 + 4.5 + i * 17, s, 'qt-tb2', 'middle')
            dk = ngat(r['khong'], MRW - 22, 12.5, False, 4, t['ma'])
            kh = 16 + 17 * len(dk)
            ky = cy - kh / 2
            svg.hop(MRX, ky, MRW, kh, 'qt-trang')
            for i, s in enumerate(dk):
                svg.chu(MRX + 11, ky + 22 + i * 17, s, 'qt-tn')
            svg.duong([(MX + MSW, cy), (MRX - 4, cy)])
            svg.chu((MX + MSW + MRX) / 2, cy - 6, r.get('nhan_khong', 'không'), 'qt-nhan', 'middle')
            svg.chu(MCX + 8, y + h + 17, r.get('nhan_co', 'có'), 'qt-nhan')
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

    def x_lan(q):
        if 'x' in q:
            return q['x']
        x = LAN_X0 + thu_tu.index(q['lan']) * LAN_W
        if q.get('canh') == 'phai':
            x += LAN_W
        return x + q.get('lech', 0)

    for i, ma in enumerate(thu_tu):
        x = LAN_X0 + i * LAN_W
        svg.them('<rect class="qt-lan-nen%d" x="%s" y="12" width="%s" height="%s"/>'
                 % (i % 2, g(x), g(LAN_W), g(cao - 22)))
        z = bo.pk[ma]
        dong = ngat(z['ten'], LAN_W - 24, 12.5, True, 2, 'đầu làn ' + ma)
        svg.mo_lien_ket(bo.trang_pk(ma), 'Mở sơ đồ phân khu %s · %s' % (ma, z['ten']))
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
        hinh[o['o']] = dict(cx=cx, cy=cy, trai=cx - w / 2, phai=cx + w / 2,
                            tren=cy - OH / 2, duoi=cy + OH / 2)
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
            svg.tron(cx + w / 2 - 2, cy - OH / 2 + 1, 8, 'qt-canh')
            svg.chu(cx + w / 2 - 2, cy - OH / 2 + 5.5, '!', 'qt-canh-chu', 'middle')

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
    """Biến mã thẻ (TT-05, HT-03 …) trong văn bản thành liên kết, bỏ qua mã đã nằm trong liên kết."""
    mau = re.compile(r'(?<![\[#\w-])([A-Z]{2}-\d\d)(?![\]\w])')

    def thay(m):
        ma = m.group(1)
        try:
            dich, _ = pk.bo.the_bat_ky(ma)
        except LoiDuLieu:
            return ma
        if dich is pk:
            return '[%s](%s)' % (ma, pk.href_the(ma, tu_trang_the))
        return '[%s](%s)' % (ma, dich.href_the(ma))
    return mau.sub(thay, chu)


def md_sang_html(s, pk=None):
    if pk is not None:
        s = gan_ma_the(s, pk, True)
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
    vao, ra = [], []

    def them(ds, s):
        if s not in ds:
            ds.append(s)

    for lg in pk.cac_luong:
        for pt in lg['luong']:
            for c in pt.get('cong_vao', []):
                them(vao, '▶ [%s · %s](%s) — %s' % (c['tu'], bo.ten(c['tu']),
                     bo.lien_ket(c['tu'], c.get('buoc'), c.get('tam')), c['ten']))
            for c in pt.get('cong_ra', []):
                them(ra, '◀ [%s · %s](%s) — %s' % (c['sang'], bo.ten(c['sang']),
                     bo.lien_ket(c['sang'], c.get('buoc'), c.get('tam')), c['ten']))
            if 'buoc' in pt and pt['buoc'].get('vao_ben'):
                v = pt['buoc']['vao_ben']
                them(vao, '▶ [%s · %s](%s) — %s' % (v['tu'], bo.ten(v['tu']),
                     bo.lien_ket(v['tu'], v.get('buoc'), v.get('tam')), v['ten']))

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
         '| %s | %s |' % ('<br>'.join(vao) or d.get('nhan_vao_tu_ngoai', '—'),
                          '<br>'.join(ra) or '—'),
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
         '']

    def ds_the(cac_ma):
        if not cac_ma:
            return []
        out = ['', '**Tình huống ở bước này:**', '']
        for m in cac_ma:
            out.append('- ⚠ [%s · %s](%s)' % (m, pk.the[m]['ten'], pk.href_the(m)))
        return out

    so_luong = len(pk.cac_luong)
    for lg in pk.cac_luong:
        if so_luong == 1:
            L += ['## Sơ đồ phân khu', '{: #so-do }', '']
        else:
            L += ['## Sơ đồ — %s' % lg['ten'], '{: #%s }' % lg['id'], '']
            if lg.get('gioi_thieu'):
                L += [lg['gioi_thieu'].strip(), '']
        L += [khoi_so_do(ve_phan_khu(pk, lg, so_luong)), '', CHU_GIAI, '', '---', '']

        for pt in lg['luong']:
            if 're' in pt:
                r = pt['re']
                nh = r['nhanh']
                if 'the' in nh:
                    di = '<a href="%s">⚠ %s · %s</a>' % (pk.href_the(nh['the']), nh['the'],
                                                         esc(pk.the[nh['the']]['ten']))
                else:
                    c = nh['cong']
                    di = '<a href="%s">◀ %s · %s</a> — %s' % (
                        esc(bo.lien_ket(c['sang'], c.get('buoc'), c.get('tam'))),
                        c['sang'], esc(bo.ten(c['sang'])), esc(c['ten']))
                L += ['<div class="qt-re-khoi" id="%s"><strong>⬡ %s</strong><br>'
                      '<em>%s</em> → đi tiếp xuống bước sau · <em>%s</em> → %s</div>'
                      % (r['id'], esc(r['hoi']), esc(r['tiep']), esc(nh['nhan']), di), '']
                if r.get('noi_dung'):
                    L += [gan_ma_the(r['noi_dung'].rstrip(), pk), '']
            elif 'buoc' in pt:
                b = pt['buoc']
                if b.get('sang'):
                    L += ['<div class="qt-chuyen-khoi" id="%s">▷ <strong>%s</strong><br>'
                          'Phần việc này thuộc <a href="%s">phân khu %s · %s</a>.</div>'
                          % (b['id'], esc(b['ten']),
                             esc(bo.lien_ket(b['sang'], b.get('den'), b.get('tam'))),
                             b['sang'], esc(bo.ten(b['sang']))), '']
                    if b.get('noi_dung'):
                        L += [gan_ma_the(b['noi_dung'].rstrip(), pk), '']
                    continue
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
                        if b.get('sang'):
                            L.append('%d. **%s** — thuộc [phân khu %s · %s](%s)' % (
                                i, b['ten'], b['sang'], bo.ten(b['sang']),
                                bo.lien_ket(b['sang'], b.get('den'), b.get('tam'))))
                        else:
                            L.append('%d. **%s**%s' % (i, b['ten'], (' — ' + b['phu']) if b.get('phu') else ''))
                    L.append('')
                    if nh.get('noi_dung'):
                        L += [gan_ma_the(nh['noi_dung'].rstrip(), pk)]
                    cm = []
                    for b in nh['buoc']:
                        cm += b.get('the', [])
                    L += ds_the(cm)
                    L.append('')
                gp = s['gop']
                if gp.get('noi_dung') or gp.get('the'):
                    L += ['### %s' % gp['ten'], '{: .no_toc }', '']
                    if gp.get('noi_dung'):
                        L += [gan_ma_the(gp['noi_dung'].rstrip(), pk)]
                    L += ds_the(gp.get('the', []))
                    L.append('')
                L += ['---', '']
        nl = lg.get('ngoai_luong')
        if nl:
            L += ['## %s' % nl['ten'], '{: #%s }' % nl['id'], '']
            if nl.get('noi_dung'):
                L += [gan_ma_the(nl['noi_dung'].rstrip(), pk)]
            L += ds_the(nl.get('the', []))
            L += ['', '---', '']

    for pl in d.get('phu_luc', []):
        L += ['## %s' % pl['ten'], '{: #%s }' % pl['id'], '', gan_ma_the(pl['noi_dung'].rstrip(), pk), '',
              '---', '']

    if d.get('hoi_dap'):
        L += ['## Câu hỏi thường gặp', '{: #hoi-dap }', '']
        for q in d['hoi_dap']:
            L += ['**%s**' % q['hoi'], '', gan_ma_the(q['dap'].strip(), pk), '']
        L += ['---', '']

    L += ['## Đọc tiếp', '{: #doc-tiep }', '',
          '| Bạn cần | Mở trang |', '|---|---|',
          '| Xem cách gỡ từng tình huống | [Thẻ tình huống của phân khu %s](%s.html) |' % (pk.ma, pk.trang_the),
          '| Tra theo thông báo lỗi | [Khi gặp trục trặc](%s.html) |' % TRANG_TRA_CUU,
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
         '👉 [Sơ đồ phân khu %s](%s.html) · [Bản đồ tổng](00-quy-trinh.html) · '
         '[Tra theo thông báo lỗi](%s.html)' % (pk.ma, pk.trang, TRANG_TRA_CUU),
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
            hang.append(('Dấu hiệu', md_sang_html(t['dau_hieu'], pk)))
        hang.append(('Nguyên nhân', md_sang_html(t['nguyen_nhan'], pk)))
        hang.append(('Ai xử lý', esc(t['ai'])))
        tt = ['<table class="qt-the-bang">']
        for k, v in hang:
            tt.append('<tr><th>%s</th><td>%s</td></tr>' % (k, v))
        tt.append('</table>')
        if t.get('canh_bao'):
            tt.append('<p class="qt-canh-bao">⚠️ %s</p>' % md_sang_html(t['canh_bao'], pk))
        lq = list(t.get('lien_quan', []))
        for r in t['go']:
            if 're' in r:
                lq += re.findall(r'[A-Z]{2}-\d\d', r['re']['co'] + ' ' + r['re']['khong'])
        if lq:
            ds = []
            for m in dict.fromkeys(lq):
                dich, _ = pk.bo.the_bat_ky(m)
                ds.append('<a href="%s">%s</a>' % (dich.href_the(m, dich is pk), m))
            tt.append('<p class="qt-lien-quan">Liên quan: %s</p>' % ' · '.join(ds))
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
         'Đang bị chặn và có thông báo lỗi trong tay? Mở thẳng **[Khi gặp trục trặc](%s.html)**.' % TRANG_TRA_CUU,
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
         '| Phân khu | Phạm vi | Ai làm | Thẻ tình huống |',
         '|---|---|---|---|']
    for z in bo.danh_sach:
        if bo.da_dung(z['ma']):
            pk = bo.chi_tiet[z['ma']]
            ten = '**[%s · %s](%s)**' % (z['ma'], z['ten'], bo.trang_pk(z['ma']))
            the = '[%s-01 … %s](%s.html)' % (pk.tien_to, pk.d['the'][-1]['ma'], pk.trang_the)
        else:
            ten = '%s · %s <br><small>đang chuyển — tạm xem [trang cũ](%s)</small>' % (
                z['ma'], z['ten'], bo.trang_pk(z['ma']))
            the = '—'
        L.append('| %s | %s | %s | %s |' % (ten, z['pham_vi'], z['ai_lam'], the))
    L += ['',
          '---',
          '',
          '## Trang khác',
          '{: #trang-khac }',
          '',
          '| Bạn cần | Mở trang |',
          '|---|---|',
          '| Tra theo thông báo lỗi hoặc theo phân khu | [Khi gặp trục trặc](%s.html) |' % TRANG_TRA_CUU,
          '| Đi theo một đơn hàng cụ thể từ đầu đến cuối | [Vòng đời một đơn hàng](Quy-Trinh-Vong-Doi-Don-Hang.html) |',
          '| Tra tên chứng từ, ai làm trên màn hình nào | [Tổng quan toàn chuỗi](Quy-Trinh-Tong-Quan.html) |']
    L += ['',
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


def trang_tra_cuu(bo):
    tc = bo.tra_cuu
    L = ['---',
         'title: Khi gặp trục trặc',
         'layout: default',
         'parent: Quy trình hợp nhất',
         'nav_order: 60',
         '---',
         '',
         DAU_TRANG,
         '',
         '# Khi gặp trục trặc',
         '{: .no_toc }',
         '',
         '**Dùng khi:** đang bị chặn, đang thấy một thông báo lạ, hoặc kết quả không như mong đợi',
         '{: .fs-3 .text-grey-dk-000 }',
         '',
         'Có thông báo lỗi trong tay thì tra **[theo thông báo](#thong-bao)**. Không có thông báo thì tra '
         '**[theo phân khu](#theo-phan-khu)**. Mỗi dòng dẫn tới một thẻ có đủ nguyên nhân và các bước gỡ.',
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
         '']

    dong = []
    for z in bo.danh_sach:
        pk = bo.chi_tiet.get(z['ma'])
        if not pk:
            continue
        for t in pk.d['the']:
            if t.get('thong_bao'):
                dong.append((t['thong_bao'].strip('“”"…. ').lower(), t, pk))
    dong.sort(key=lambda x: x[0])
    L += ['## Tra theo thông báo của hệ thống', '{: #thong-bao }', '',
          'Xếp theo chữ cái đầu của thông báo. Dấu `…` là chỗ hệ thống điền mã chứng từ hoặc số tiền.', '',
          '| Thông báo | Thẻ | Phân khu |', '|---|---|---|']
    for _, t, pk in dong:
        L.append('| *%s* | [%s · %s](%s) | %s |' % (t['thong_bao'].replace('|', '\\|'), t['ma'], t['ten'],
                                                    pk.href_the(t['ma']), pk.ma))
    L += ['', '---', '', '## Tra theo phân khu', '{: #theo-phan-khu }', '']
    for z in bo.danh_sach:
        pk = bo.chi_tiet.get(z['ma'])
        L += ['### %s · %s' % (z['ma'], z['ten']), '{: #pk-%s }' % z['ma'].lower(), '']
        if not pk:
            L += ['Đang chuyển — tạm xem [trang cũ](%s).' % bo.trang_pk(z['ma']), '']
            continue
        L += ['| Mã | Tình huống | Ở bước |', '|---|---|---|']
        for t in pk.d['the']:
            nhan, href = pk.tham_chieu({'buoc': pk.noi_xu_ly[t['ma']]}, True)
            L.append('| [%s](%s) | %s | [%s](%s) |' % (t['ma'], pk.href_the(t['ma']), t['ten'], nhan, href))
        L.append('')
    L += ['---', '']
    for m in tc.get('muc', []):
        L += ['## %s' % m['ten'], '{: #%s }' % m['id'], '', m['noi_dung'].rstrip(), '', '---', '']
    L += ['Quay về **[Bản đồ tổng](00-quy-trinh.html)**', '']
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
    ap.add_argument('--xem', help='xuất SVG riêng lẻ vào thư mục này để xem thử')
    tham = ap.parse_args()

    try:
        bo = BoDuLieu()
        bo.kiem_tham_chieu()
        cac_svg = [('ban-do', ve_ban_do(bo))]
        for ma, pk in bo.chi_tiet.items():
            n = len(pk.cac_luong)
            for lg in pk.cac_luong:
                svg = ve_phan_khu(pk, lg, n)
                cac_svg.append((svg.ma, svg))
            for t in pk.d['the']:
                cac_svg.append(('the-' + t['ma'], ve_the(pk, t)))
        rc, loi, so = kiem_duong_cat(cac_svg)
        if rc:
            print('Đường nối cắt hoặc chạm nhau — không ghi trang:')
            print('\n'.join(loi))
            return 1
        print('Kiểm đường cắt: %d sơ đồ sạch.' % so)

        trang = {'00-quy-trinh': trang_ban_do(bo), TRANG_TRA_CUU: trang_tra_cuu(bo)}
        for ma, pk in bo.chi_tiet.items():
            trang[pk.trang] = trang_phan_khu(pk)
            trang[pk.trang_the] = trang_the(pk)
        for ten, noi_dung in trang.items():
            ghi(os.path.join(USERS, ten + '.md'), noi_dung)
        for ma, pk in bo.chi_tiet.items():
            print('Phân khu %s: %d luồng, %d thẻ tình huống.' % (ma, len(pk.cac_luong), len(pk.the)))
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
