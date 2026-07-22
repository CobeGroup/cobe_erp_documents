/* shoot_loyalty_sales.js — chụp ảnh cho doc "Loyalty — Hướng dẫn cho Sales".
   Chỉ chụp form TRỐNG (bản ghi mới) → không lộ dữ liệu khách hàng.

   Auth bằng SID tạm (không đổi credential):
     bench --site <site> browse --user Administrator

   Chạy:
     SID=<sid> BASE=http://cobe.cc:8002 \
     node help/cobe_erp_documents/_tools/shoot_loyalty_sales.js
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');

const OUT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/help/cobe_erp_documents/users/images/loyalty';
const BASE = (process.env.BASE || 'http://cobe.cc:8002').replace(/\/$/, '');
const SID = process.env.SID || '';
if (!SID) { console.error('Thiếu SID'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1460, height: 900 }, deviceScaleFactor: 2, locale: 'vi-VN' });
  await ctx.addCookies([{ name: 'sid', value: SID, domain: new URL(BASE).hostname, path: '/' }]);
  const page = await ctx.newPage();
  page.setDefaultTimeout(20000);

  const shot = async (n, o = {}) => { await page.screenshot({ path: path.join(OUT, n), ...o }); console.log('  ✓', n); };
  const open = async (r) => {
    await page.goto(BASE + r, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForSelector('.page-head, .layout-main, .title-text', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(3500);
  };
  // set field qua cur_frm cho chắc (Select/Link render khác nhau)
  const setField = async (fn, val) => {
    await page.evaluate(([f, v]) => window.cur_frm && window.cur_frm.set_value(f, v), [fn, val]).catch(() => {});
    await page.waitForTimeout(1800);
  };
  const highlight = async (fieldname) => {
    await page.evaluate((f) => {
      const el = document.querySelector(`[data-fieldname="${f}"]`);
      if (el) { el.style.outline = '3px solid #e53935'; el.style.outlineOffset = '3px'; el.style.borderRadius = '4px'; el.scrollIntoView({ block: 'center' }); }
    }, fieldname).catch(() => {});
    await page.waitForTimeout(800);
  };

  const tasks = [
    // Lead: khai người giới thiệu — Source = Existing Customer làm hiện ô "From Customer"
    async () => {
      await open('/app/lead/new');
      await setField('source', 'Existing Customer');
      await highlight('customer');
      await shot('sales-lead-referral.png');
    },
    // Customer: tab Loyalty Points (chương trình + hạng)
    async () => {
      await open('/app/customer/new');
      await page.evaluate(() => {
        const t = [...document.querySelectorAll('.form-tabs .nav-link, .form-tabs a')]
          .find(e => /loyalty/i.test(e.textContent || ''));
        if (t) t.click();
      }).catch(() => {});
      await page.waitForTimeout(2000);
      await shot('sales-customer-loyalty-tab.png');
    },
  ];
  for (const t of tasks) { try { await t(); } catch (e) { console.log('  ✗', e.message); } }

  await browser.close();
  console.log('Xong →', OUT);
})();
