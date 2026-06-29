/* shoot_desk_sort.js — chụp ảnh dropdown SẮP XẾP (sort) cho doc "Làm quen ERP" §6,
   trên list Leave Type (đồng bộ ví dụ với §4/§5). Login Desk thật.

   Chạy:
     SITE=http://cobe.cc:8002 FRAPPE_USER=...@gmail.com FRAPPE_PASS=... \
       node help/cobe_erp_documents/_tools/shoot_desk_sort.js
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/desk';
const SITE = (process.env.SITE || 'http://cobe.cc:8002').replace(/\/$/, '');
const USER = process.env.FRAPPE_USER || '', PASS = process.env.FRAPPE_PASS || '';
if (!USER || !PASS) { console.error('Thiếu FRAPPE_USER / FRAPPE_PASS'); process.exit(1); }
const u = (s) => SITE + s;
const HIDE_CSS = `.onboarding-widget-box,.ce-toast,.desk-alert,.notifications-list{display:none!important}`;

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--host-resolver-rules=MAP cobe.cc 127.0.0.1'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'vi-VN' });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);

  console.log('• Login', SITE);
  await page.goto(u('/login'), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#login_email'); await page.waitForTimeout(1500);
  await page.fill('#login_email', USER); await page.fill('#login_password', PASS);
  await page.click('.btn-login');
  await page.waitForFunction(() => !/\/login/.test(location.href), { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);
  if (/\/login/.test(page.url())) { console.error('  ✗ Login fail'); await browser.close(); process.exit(2); }
  console.log('  ✓ Login OK');

  await page.goto(u('/app/leave-type/view/list'), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.title-text, .page-head', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});

  // Mở dropdown sắp xếp: nút .sort-selector-button (hiện "Created On", data-toggle=dropdown)
  await page.click('.sort-selector-button').catch(() => {});
  await page.waitForSelector('.sort-selector .dropdown-menu.show, .sort-selector.show .dropdown-menu', { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(800);
  const open = await page.evaluate(() => !!document.querySelector('.sort-selector .dropdown-menu.show'));
  console.log('  sort dropdown open:', open);

  await page.screenshot({ path: path.join(OUT, 'concept-sort.png') });
  console.log('  ✓ shot concept-sort.png');
  await browser.close();
  console.log('Xong:', OUT);
})().catch(e => { console.error(e); process.exit(1); });
