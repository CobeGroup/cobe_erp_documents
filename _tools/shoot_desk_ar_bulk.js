/* shoot_desk_ar_bulk.js — chụp cảnh HR DUYỆT HÀNG LOẠT Attendance Request trên Desk (login thật).
   Dữ liệu demo: 3 đơn draft HR-ARQ-26-07-0000x của NV demo (Nguyễn Văn A / Trần Văn Kỹ / Lê Thị B),
   from_date > 05/07/2026 để lọc riêng — KHÔNG lộ tên nhân viên thật.
   Tài khoản demo "demo-hr@tgdg.com" mặc định BỊ DISABLE sau khi chụp.
   Muốn chụp lại: enable + đặt lại mật khẩu, rồi:
     SITE=http://cobe.cc:8002 FRAPPE_USER=demo-hr@tgdg.com FRAPPE_PASS='<mật-khẩu>' \
       node help/cobe_erp_documents/_tools/shoot_desk_ar_bulk.js
   Lưu ý: harness CHỈ mở dialog xác nhận rồi bấm huỷ — KHÔNG submit thật. */
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');

const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/desk';
const SITE = (process.env.SITE || 'http://cobe.cc:8002').replace(/\/$/, '');
const USER = process.env.FRAPPE_USER || '';
const PASS = process.env.FRAPPE_PASS || '';
if (!USER || !PASS) { console.error('Thiếu FRAPPE_USER / FRAPPE_PASS'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
const u = (s) => SITE + s;

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
  const shot = async (name) => { await page.addStyleTag({ content: HIDE_CSS }).catch(()=>{}); await page.waitForTimeout(400); await page.screenshot({ path: path.join(OUT, name) }); console.log('  ✓ shot', name); };

  // Login
  console.log('• Login', SITE, 'as', USER);
  await page.goto(u('/login'), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#login_email', { timeout: 15000 });
  await page.waitForTimeout(1200);
  await page.fill('#login_email', USER);
  await page.fill('#login_password', PASS);
  await page.click('.btn-login');
  await page.waitForFunction(() => !/\/login/.test(location.href), { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);
  if (/\/login/.test(page.url())) { console.error('  ✗ Login thất bại'); await browser.close(); process.exit(2); }
  console.log('  ✓ Login OK');

  // List Attendance Request — lọc from_date > 05/07/2026 (chỉ còn 3 đơn demo)
  const filter = encodeURIComponent(JSON.stringify(['>', '2026-07-05']));
  await page.goto(u('/app/attendance-request?from_date=' + filter), { waitUntil: 'domcontentloaded' }).catch(()=>{});
  await page.waitForSelector('.list-row-container', { timeout: 20000 });
  await page.waitForTimeout(2500);
  for (let i = 0; i < 3; i++) { await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(300); }
  await shot('hr-ar-bulk-list.png');

  // Tick chọn tất cả (checkbox header) → nút Actions hiện ra
  await page.locator('.list-check-all').first().click();
  await page.waitForTimeout(800);
  await page.locator('.page-actions button:has-text("Actions"), .actions-btn-group button').first().click();
  await page.waitForSelector('.dropdown-menu.show', { timeout: 5000 });
  await page.waitForTimeout(600);
  await shot('hr-ar-bulk-actions.png');

  // Bấm Submit trong menu → dialog xác nhận "Submit 3 documents?" → chụp rồi HUỶ
  await page.locator('.dropdown-menu.show a:has-text("Submit"), .dropdown-menu.show .dropdown-item:has-text("Submit")').first().click();
  await page.waitForSelector('.modal.show', { timeout: 8000 });
  await page.waitForTimeout(700);
  await shot('hr-ar-bulk-confirm.png');
  await page.locator('.modal.show button:has-text("No"), .modal.show .btn-modal-close').first().click().catch(()=>{});

  await browser.close();
  console.log('\nXong. Ảnh ở:', OUT);
})().catch(e => { console.error(e); process.exit(1); });
