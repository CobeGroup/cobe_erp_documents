/* shoot_desk_leave_hr.js — chụp cảnh HR DUYỆT nghỉ phép trên Frappe Desk (login thật).
   Đơn demo HR-LAP-2026-00012 ở workflow_state "Manager Approved" → form hiện nút Submit / HR Reject.
   Tài khoản demo "demo-hr@tgdg.com" (role HR Manager) mặc định BỊ DISABLE sau khi chụp.
   Muốn chụp lại: enable + đặt lại mật khẩu, rồi:
     SITE=http://cobe.cc:8002 FRAPPE_USER=demo-hr@tgdg.com FRAPPE_PASS='<mật-khẩu>' \
       node help/cobe_erp_documents/_tools/shoot_desk_leave_hr.js
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');

const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/desk';
const SITE = (process.env.SITE || 'http://cobe.cc:8002').replace(/\/$/, '');
const USER = process.env.FRAPPE_USER || '';
const PASS = process.env.FRAPPE_PASS || '';
const LA = process.env.LA || 'HR-LAP-2026-00012';

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
  const shot = async (name) => { await page.addStyleTag({ content: HIDE_CSS }).catch(()=>{}); await page.waitForTimeout(400); await page.screenshot({ path: path.join(OUT, name) }); console.log('  ✓ shot', name); };
  const open = async (route) => {
    await page.goto(u(route), { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForSelector('.title-text, .layout-main, .page-head', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3500);
  };

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

  // 1) Form đơn nghỉ phép ở trạng thái chờ HR — nút Submit / HR Reject
  console.log('• Form Leave Application:', LA);
  await open('/app/leave-application/' + enc(LA));
  // đóng mọi popup Message còn sót (vd dashboard fetch)
  for (let i = 0; i < 3; i++) {
    await page.locator('.modal.show .btn-modal-close, .modal-dialog .modal-header .btn-close').first().click({ timeout: 1000 }).catch(()=>{});
    await page.keyboard.press('Escape').catch(()=>{});
    await page.waitForTimeout(400);
  }
  // cuộn lên đầu cho thấy header + nút workflow
  await page.evaluate(() => window.scrollTo(0, 0)).catch(()=>{});
  await page.waitForTimeout(800);
  await shot('hr-leave-approve-form.png');
  // 1b) mở dropdown "Actions" để lộ các lựa chọn workflow (Submit / HR Reject)
  await page.locator('.page-head button:has-text("Actions"), .page-actions .actions-btn-group button').first().click({ timeout: 4000 }).catch(()=>{});
  await page.waitForSelector('.dropdown-menu.show, .actions-btn-group .dropdown-menu', { timeout: 4000 }).catch(()=>{});
  await page.waitForTimeout(700);
  await shot('hr-leave-approve-actions.png');

  // 2) List view — LỌC theo nhân viên demo (tránh lộ tên NV thật), thấy đủ màu trạng thái
  console.log('• List view Leave Application (lọc demo employee)');
  await open('/app/leave-application/view/list?employee=' + enc(process.env.EMP || 'HR-EMP-00160'));
  await shot('hr-leave-list.png');

  await browser.close();
  console.log('\nXong. Ảnh ở:', OUT);
})().catch(e => { console.error(e); process.exit(1); });
