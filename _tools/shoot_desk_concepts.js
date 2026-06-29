/* shoot_desk_concepts.js — chụp ảnh minh hoạ KHÁI NIỆM ERP (List view + Form) cho
   doc "Làm quen ERP" §4, từ FRAPPE DESK THẬT (login thật).

   Dùng doctype Leave Type (dữ liệu cấu hình, KHÔNG PII) làm ví dụ:
     - concept-list.png  : Danh sách (list view) — nhiều bản ghi của 1 doctype
     - concept-form.png   : Form — 1 bản ghi (Annual Leave) mở ra

   Chạy:
     SITE=http://cobe.cc:8002 FRAPPE_USER=...@gmail.com FRAPPE_PASS=... \
       node help/cobe_erp_documents/_tools/shoot_desk_concepts.js
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');

const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/desk';
const SITE = (process.env.SITE || 'http://cobe.cc:8002').replace(/\/$/, '');
const USER = process.env.FRAPPE_USER || '';
const PASS = process.env.FRAPPE_PASS || '';
const RECORD = process.env.RECORD || 'Annual Leave';

if (!USER || !PASS) { console.error('Thiếu FRAPPE_USER / FRAPPE_PASS'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
const u = (s) => SITE + s;
const enc = encodeURIComponent;

const HIDE_CSS = `
  .onboarding-widget-box, .ce-toast, .desk-alert, .notifications-list,
  .form-message, .layout-side-section .form-sidebar .sidebar-menu li.user-actions { display:none !important; }
`;

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--host-resolver-rules=MAP cobe.cc 127.0.0.1'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'vi-VN' });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  const shot = async (name) => { await page.addStyleTag({ content: HIDE_CSS }).catch(()=>{}); await page.waitForTimeout(300); await page.screenshot({ path: path.join(OUT, name) }); console.log('  ✓ shot', name); };
  const open = async (route) => {
    await page.goto(u(route), { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForSelector('.title-text, .layout-main, .page-head', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3500);
  };

  // Login
  console.log('• Login', SITE, 'as', USER);
  await page.goto(u('/login'), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#login_email', { timeout: 15000 });
  await page.waitForTimeout(1500);
  await page.fill('#login_email', USER);
  await page.fill('#login_password', PASS);
  await page.click('.btn-login');
  await page.waitForFunction(() => !/\/login/.test(location.href), { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);
  if (/\/login/.test(page.url())) { console.error('  ✗ Login thất bại'); await browser.close(); process.exit(2); }
  console.log('  ✓ Login OK');

  // 1) List view — Leave Type
  console.log('• List view: Leave Type');
  await open('/app/leave-type/view/list');
  await shot('concept-list.png');

  // 2) Form — 1 bản ghi
  console.log('• Form:', RECORD);
  await open('/app/leave-type/' + enc(RECORD));
  await shot('concept-form.png');

  await browser.close();
  console.log('\nXong. Ảnh ở:', OUT);
})().catch(e => { console.error(e); process.exit(1); });
