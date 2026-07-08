/* shoot_desk_attendance_list.js — chụp LIST VIEW /app/attendance trên Frappe Desk (login thật):
   danh sách bản ghi công của 1 nhân viên với đủ trạng thái Present / Half Day / WFH / On Leave / Absent.
   Ảnh ra: images/desk/hr-attendance-list.png → nhúng vào users/Desk-HR-ChamCong.md (mục 2).

   CHUẨN BỊ: demo data + user demo-hr@tgdg.com như header shoot_desk_leave_reports.js
   (Attendance tháng 5/2026 của HR-EMP-00168: 04 P · 05 P · 06 A · 07 HD · 08 WFH · 11+15 L).
   Khác query report: list view ĂN filter qua URL bình thường, không cần evaluate.
   Chạy:
     SITE=http://cobe.cc:8002 FRAPPE_USER=demo-hr@tgdg.com FRAPPE_PASS='<mật-khẩu>' \
       EMP=HR-EMP-00168 node help/cobe_erp_documents/_tools/shoot_desk_attendance_list.js
   Chụp xong: disable lại demo-hr.
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');

const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/desk';
const SITE = (process.env.SITE || 'http://cobe.cc:8002').replace(/\/$/, '');
const USER = process.env.FRAPPE_USER || '';
const PASS = process.env.FRAPPE_PASS || '';
const EMP = process.env.EMP || 'HR-EMP-00168';

if (!USER || !PASS) { console.error('Thiếu FRAPPE_USER / FRAPPE_PASS'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
const u = (s) => SITE + s;

const HIDE_CSS = `
  .onboarding-widget-box, .ce-toast, .desk-alert, .notifications-list,
  .form-message, .list-sidebar .sidebar-menu li.user-actions { display:none !important; }
`;

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--host-resolver-rules=MAP cobe.cc 127.0.0.1'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'vi-VN' });
  const page = await ctx.newPage();
  page.setDefaultTimeout(20000);

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

  console.log('• Attendance list (filter Employee)');
  await page.goto(u('/app/attendance?employee=' + encodeURIComponent(EMP)), { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForSelector('.list-row-container', { timeout: 25000 });
  // Sắp theo ngày tăng dần cho dễ đọc — fire-and-forget như query report (await = treo)
  await page.evaluate(() => {
    try { cur_list.sort_selector.sort_by = 'attendance_date'; cur_list.sort_selector.sort_order = 'asc'; cur_list.sort_selector.apply(); } catch (e) {}
  }).catch(() => {});
  await page.waitForTimeout(2500);
  for (let i = 0; i < 2; i++) { await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(300); }
  await page.addStyleTag({ content: HIDE_CSS }).catch(()=>{});
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, 'hr-attendance-list.png') });
  console.log('  ✓ shot hr-attendance-list.png');

  await browser.close();
  console.log('\nXong. Ảnh ở:', OUT);
})().catch(e => { console.error(e); process.exit(1); });
