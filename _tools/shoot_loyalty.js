/* shoot_loyalty.js — chụp ảnh cho doc "Loyalty — Seed điểm đơn cũ" từ Frappe Desk THẬT.
   Các trang chụp đều là màn hình CẤU HÌNH / THAO TÁC (không hiển thị data khách) → PII-safe.

   Auth bằng SID tạm (không đổi credential):
     bench --site <site> browse --user Administrator   # in ra "Login URL: .../app?sid=XXXX"

   Chạy:
     SID=<sid> BASE=http://cobe.cc:8002 \
     node help/cobe_erp_documents/_tools/shoot_loyalty.js

   Ảnh xuất ra: help/cobe_erp_documents/users/images/loyalty/
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');

const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/loyalty';
const BASE = (process.env.BASE || 'http://cobe.cc:8002').replace(/\/$/, '');
const SID = process.env.SID || '';
if (!SID) { console.error('Thiếu SID. Lấy qua: bench --site cobe.cc browse --user Administrator'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

const u = (s) => BASE + s;

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1460, height: 940 }, deviceScaleFactor: 2, locale: 'vi-VN' });
  const host = new URL(BASE).hostname;
  await ctx.addCookies([{ name: 'sid', value: SID, domain: host, path: '/' }]);
  const page = await ctx.newPage();
  page.setDefaultTimeout(20000);

  const shot = async (name, opts = {}) => {
    await page.screenshot({ path: path.join(OUT, name), ...opts });
    console.log('  ✓', name);
  };
  const open = async (route) => {
    await page.goto(u(route), { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForSelector('.page-head, .layout-main, .title-text, .page-card', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(3500);
    // ẩn con trỏ/notify nếu có
    await page.evaluate(() => { document.querySelectorAll('.desk-alert, .notifications-list').forEach(e => e.remove()); }).catch(() => {});
  };
  const clickField = async (fieldname) => {
    const sel = `[data-fieldname="${fieldname}"] .control-input, [data-fieldname="${fieldname}"] select, [data-fieldname="${fieldname}"] input`;
    const el = await page.$(sel);
    if (el) { await el.click().catch(() => {}); await page.waitForTimeout(900); }
  };

  const tasks = [
    // Trang seed điểm — điều khiển chính
    async () => { await open('/app/loyalty-migration'); await shot('migration-page.png', { fullPage: true }); },
    // Master switch + bảng referral per-company
    async () => { await open('/app/cobe-loyalty-settings'); await shot('loyalty-settings.png', { fullPage: true }); },
    // Sync Settings — công tắc outbound
    async () => { await open('/app/cobe-loyalty-sync-settings'); await shot('sync-settings.png', { fullPage: true }); },
    // Điều chỉnh điểm thủ công / VIP seed
    async () => { await open('/app/cobe-loyalty-adjustment/new'); await shot('adjustment-new.png', { fullPage: true }); },
    // Bulk gán Loyalty Program cho Customer
    async () => { await open('/app/loyalty-assignment-tool'); await shot('assignment-tool.png', { fullPage: true }); },
    // Sổ cái điểm (Loyalty Point Entry) — cấu trúc list
    async () => { await open('/app/loyalty-point-entry/view/list'); await shot('lpe-list.png'); },
  ];

  for (const t of tasks) {
    try { await t(); } catch (e) { console.log('  ✗ shot lỗi:', e.message); }
  }

  await browser.close();
  console.log('Xong. Ảnh ở', OUT);
})();
