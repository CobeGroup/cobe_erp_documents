"""Quy tac chat: hai DUONG khac nhau khong duoc cham nhau o bat ky diem nao."""
import re, sys, xml.etree.ElementTree as ET
NS = '{http://www.w3.org/2000/svg}'

def paths(path):
    root = ET.parse(path).getroot()
    out = []
    for idx, el in enumerate(root.iter()):
        tag = el.tag.replace(NS, '')
        if tag == 'line':
            p = [(float(el.get('x1')), float(el.get('y1'))),
                 (float(el.get('x2')), float(el.get('y2')))]
        elif tag == 'polyline':
            n = [float(x) for x in re.split(r'[ ,]+', el.get('points').strip())]
            p = list(zip(n[0::2], n[1::2]))
        else:
            continue
        segs = [(a, b) for a, b in zip(p, p[1:]) if a != b]
        if segs:
            out.append((idx, segs))
    return out

def cr(o, a, b): return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])
E = 1e-7

def touch(s1, s2):
    p1, p2 = s1; p3, p4 = s2
    d1, d2 = cr(p3, p4, p1), cr(p3, p4, p2)
    d3, d4 = cr(p1, p2, p3), cr(p1, p2, p4)
    if ((d1 > E and d2 < -E) or (d1 < -E and d2 > E)) and \
       ((d3 > E and d4 < -E) or (d3 < -E and d4 > E)):
        return 'cat cheo'
    def on(p, q, r):
        return abs(cr(p, q, r)) < E and min(p[0],q[0])-E <= r[0] <= max(p[0],q[0])+E \
               and min(p[1],q[1])-E <= r[1] <= max(p[1],q[1])+E
    for r in (p3, p4):
        if on(p1, p2, r): return 'cham nhau'
    for r in (p1, p2):
        if on(p3, p4, r): return 'cham nhau'
    return None

rc = 0
for f in sys.argv[1:]:
    ps = paths(f); bad = []
    for i in range(len(ps)):
        for j in range(i+1, len(ps)):
            for a in ps[i][1]:
                for b in ps[j][1]:
                    t = touch(a, b)
                    if t: bad.append((t, a, b))
    name = f.split('/')[-1]
    if not bad:
        print(f"  SACH  {name}")
    else:
        rc = 1
        print(f"  LOI   {name}: {len(bad)} cho")
        for t, a, b in bad: print(f"          {t}: {a} <-> {b}")
sys.exit(rc)
