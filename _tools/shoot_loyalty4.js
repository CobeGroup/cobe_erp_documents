/* shoot_loyalty4.js — ảnh cho §5 "Tra cứu điểm của khách".
   Chụp Frappe Desk THẬT trên bản restore prod. Tên khách bị thay nhãn giả /
   chỉ clip vùng không có PII (doc publish công khai).

   Auth: bench --site cobe.cc browse --user Administrator  (lấy sid)
   Chạy: SID=<sid> BASE=http://cobe.cc:8002 CUST=8955 node .../shoot_loyalty4.js

   Ảnh xuất:
     - lpe-report-sum.png         : dòng Totals trong Loyalty Point Entry (Show Totals)
     - customer-points-banner.png : banner "Điểm tích luỹ" trên đầu form Customer
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');

const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/loyalty';
const BASE = (process.env.BASE || 'http://cobe.cc:8002').replace(/\/$/, '');
const SID = process.env.SID || '';
const CUST = process.env.CUST || '8955';
const REAL_NAME = process.env.REAL_NAME || 'Đỗ Văn Cảnh';
if (!SID) { console.error('Thiếu SID'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
const u = (s) => BASE + s;

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1460, height: 940 }, deviceScaleFactor: 2, locale: 'vi-VN' });
  await ctx.addCookies([{ name: 'sid', value: SID, domain: new URL(BASE).hostname, path: '/' }]);
  const page = await ctx.newPage();
  page.setDefaultTimeout(25000);

  const shot = async (name, opts = {}) => {
    await page.screenshot({ path: path.join(OUT, name), ...opts });
    console.log('  ✓', name);
  };
  const open = async (route, wait = 3800) => {
    await page.goto(u(route), { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForSelector('.page-head, .layout-main, .title-text', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(wait);
    await page.evaluate(() => {
      document.querySelectorAll('.desk-alert, .notifications-list, .modal-backdrop').forEach(e => e.remove());
    }).catch(() => {});
  };
  const maskName = async () => {
    await page.evaluate((real) => {
      const walk = (node) => {
        if (node.nodeType === 3) {
          if (node.nodeValue && node.nodeValue.includes(real))
            node.nodeValue = node.nodeValue.split(real).join('Khách hàng mẫu');
          return;
        }
        node.childNodes && node.childNodes.forEach(walk);
      };
      walk(document.body);
    }, REAL_NAME).catch(() => {});
  };

  /* 1. Loyalty Point Entry — Report view lọc theo 1 khách.
     Menu "..." → "Show Totals" → hiện dòng tổng ở chân bảng. */
  await open('/app/loyalty-point-entry/view/report?customer=' + encodeURIComponent(CUST), 4500);
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const btn = document.querySelector('.menu-btn-group .btn, .menu-btn-group button');
    if (btn) btn.click();
  }).catch(() => {});
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const it = [...document.querySelectorAll('.menu-btn-group .dropdown-menu a, .menu-btn-group .dropdown-item')]
      .find(a => /Show Totals/i.test(a.textContent));
    if (it) it.click();
  }).catch(() => {});
  await page.waitForTimeout(2000);
  await maskName();
  await page.waitForTimeout(400);
  await shot('lpe-report-sum.png', { fullPage: true });

  /* 2. Customer — banner "Điểm tích luỹ" trên đầu form (clip đúng banner, chỉ có số). */
  await open('/app/customer/' + encodeURIComponent(CUST), 4500);
  await page.waitForTimeout(2500);
  const h = await page.evaluateHandle(() => {
    const els = [...document.querySelectorAll('.form-message, .form-intro, .alert')];
    return els.find(e => /Điểm tích luỹ/.test(e.textContent)) || null;
  });
  const el = h && h.asElement && h.asElement();
  if (el) {
    await el.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);
    await el.screenshot({ path: path.join(OUT, 'customer-points-banner.png') });
    console.log('  ✓ customer-points-banner.png');
  } else {
    console.log('  ✗ banner "Điểm tích luỹ" không thấy (đã clear-cache + deploy JS chưa?)');
  }

  await browser.close();
  console.log('Xong →', OUT);
})();
