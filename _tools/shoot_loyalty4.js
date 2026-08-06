/* shoot_loyalty4.js — ảnh cho §5.1 "Xem tổng điểm hiện tại của khách".
   Chụp Frappe Desk THẬT trên bản restore prod. Tên khách bị thay nhãn giả
   (doc publish công khai).

   Auth: bench --site cobe.cc browse --user Administrator  (lấy sid)
   Chạy: SID=<sid> BASE=http://cobe.cc:8002 node .../shoot_loyalty4.js
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');

const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/loyalty';
const BASE = (process.env.BASE || 'http://cobe.cc:8002').replace(/\/$/, '');
const SID = process.env.SID || '';
const CUST = process.env.CUST || '8955';
const FAKE = 'Khách hàng mẫu';
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
  /* Thay mọi chỗ hiện tên thật của khách bằng nhãn giả */
  const maskName = async () => {
    await page.evaluate((real) => {
      const walk = (node) => {
        if (node.nodeType === 3) {
          if (node.nodeValue && node.nodeValue.includes(real)) {
            node.nodeValue = node.nodeValue.split(real).join('Khách hàng mẫu');
          }
          return;
        }
        node.childNodes && node.childNodes.forEach(walk);
      };
      walk(document.body);
      document.querySelectorAll('input, textarea').forEach((el) => {
        if (el.value && el.value.includes(real)) el.value = el.value.split(real).join('Khách hàng mẫu');
      });
    }, real_name).catch(() => {});
  };
  let real_name = 'Đỗ Văn Cảnh';

  /* 1. Loyalty Point Entry — Report view lọc theo 1 khách.
     Menu "..." → "Show Totals" → hiện dòng tổng ở chân bảng. */
  await open('/app/loyalty-point-entry/view/report?customer=' + encodeURIComponent(CUST), 4500);
  await page.waitForTimeout(1500);
  // Mở menu "..." rồi bấm "Show Totals"
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

  /* 2. Customer — chỉ chụp khối "Loyalty Points" trên tab Details.
     Chụp riêng section (không sidebar/activity) để khỏi lộ tên người tạo. */
  await open('/app/customer/' + encodeURIComponent(CUST), 4200);
  await page.evaluate(() => {
    const f = window.cur_frm;
    if (!f) return;
    // Về tab Details
    if (f.layout && f.layout.tabs && f.layout.tabs[0]) f.layout.tabs[0].set_active();
    // Bung mọi section bị thu gọn để chắc chắn thấy ô Loyalty Program
    (f.layout.sections || []).forEach(s => { if (s.collapsed) s.collapse(false); });
    if (f.scroll_to_field) f.scroll_to_field('loyalty_program');
  }).catch(() => {});
  await page.waitForTimeout(1800);
  await maskName();
  await page.waitForTimeout(300);
  // Chụp đúng khối section chứa loyalty_program
  const sec = await page.evaluateHandle(() => {
    const el = document.querySelector('[data-fieldname="loyalty_program"]');
    return el ? el.closest('.form-section') : null;
  });
  const elh = sec && sec.asElement && sec.asElement();
  if (elh) {
    await elh.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(400);
    await elh.screenshot({ path: path.join(OUT, 'customer-loyalty-section.png') });
    console.log('  ✓ customer-loyalty-section.png (section)');
  } else {
    await shot('customer-loyalty-section.png', { fullPage: true });
  }

  await browser.close();
  console.log('Xong →', OUT);
})();
