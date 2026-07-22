/* shoot_loyalty3.js — chụp các khối nằm sâu trong form Desk.
   Frappe Desk cuộn trong container riêng nên fullPage của Playwright cắt mất
   phần dưới; harness này cuộn tới đúng field rồi chụp vùng quanh nó.

     SID=<sid> BASE=http://cobe.cc:8002 node help/cobe_erp_documents/_tools/shoot_loyalty3.js
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');

const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/loyalty';
const BASE = (process.env.BASE || 'http://cobe.cc:8002').replace(/\/$/, '');
const SID = process.env.SID || '';
if (!SID) { console.error('Thiếu SID'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1460, height: 1040 }, deviceScaleFactor: 2, locale: 'vi-VN' });
  await ctx.addCookies([{ name: 'sid', value: SID, domain: new URL(BASE).hostname, path: '/' }]);
  const page = await ctx.newPage();
  page.setDefaultTimeout(25000);

  const open = async (route, wait = 4000) => {
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForSelector('.page-head, .layout-main, .page-card', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(wait);
    await page.evaluate(() => document.querySelectorAll('.desk-alert, .notifications-list').forEach(e => e.remove())).catch(() => {});
  };

  const maskSecrets = () => page.evaluate(() => {
    document.querySelectorAll('input, textarea').forEach((el) => {
      if (/^https?:\/\//i.test(el.value || '')) el.value = 'https://<url-endpoint-cua-ben-thu-3>';
    });
  }).catch(() => {});

  /* Cuộn tới field rồi chụp phần tử bao quanh */
  const shotField = async (fieldname, name, pad = 1) => {
    const el = await page.$(`[data-fieldname="${fieldname}"]`);
    if (!el) { console.error('  ✗ không thấy field', fieldname); return; }
    await el.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(1200);
    const target = pad ? (await page.$(`[data-fieldname="${fieldname}"]`)).evaluateHandle(
      (n) => n.closest('.form-section, .row, .form-page') || n) : el;
    const handle = pad ? (await target).asElement() : el;
    await (handle || el).screenshot({ path: path.join(OUT, name) });
    console.log('  ✓', name);
  };

  const tasks = [

    /* Kết quả Dry-run thật — bộ đếm lý do bị bỏ qua */
    async () => {
      await open('/app/cobe-loyalty-migration-run');
      const link = await page.$('.list-row-container a.ellipsis, .list-subject a');
      if (link) { await link.click().catch(() => {}); await page.waitForTimeout(4500); }
      await shotField('result_summary', 'migration-run-summary.png');
    },

    /* Nhóm ô include_* của endpoint — quyết định 3rd party nhận được gì */
    async () => {
      await open('/app/cobe-loyalty-sync-settings');
      const btn = (await page.$$('.grid-row .btn-open-row, .grid-row .edit-grid-row'))[0];
      if (btn) { await btn.click().catch(() => {}); await page.waitForTimeout(2500); }
      await maskSecrets();
      const inc = await page.$('[data-fieldname="include_customer_id"]');
      if (inc) { await inc.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(1200); }
      const modal = await page.$('.modal-dialog, .grid-row-open');
      if (modal) { await modal.screenshot({ path: path.join(OUT, 'sync-endpoint-includes.png') }); console.log('  ✓ sync-endpoint-includes.png'); }
    },

    /* Loyalty Program — khối quy tắc tích điểm (from_date + collection factor) */
    async () => {
      await open('/app/loyalty-program');
      const link = await page.$('.list-row-container a.ellipsis, .list-subject a');
      if (link) { await link.click().catch(() => {}); await page.waitForTimeout(4500); }
      await shotField('collection_rules', 'loyalty-program-rules.png');
    },

  ];

  for (const t of tasks) { try { await t(); } catch (e) { console.error('  ✗', e.message); } }
  await browser.close();
  console.log('Xong →', OUT);
})();
