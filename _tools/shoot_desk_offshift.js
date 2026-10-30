/* shoot_desk_offshift.js — chụp cảnh HR xử lý log chấm công OFF-SHIFT (quẹt ngoài cửa sổ ca)
   trên Frappe Desk (login thật), theo đúng thứ tự thao tác của bài users/Desk-HR-LogOffShift.md:
     1. Attendance 0 giờ sinh từ log OUT đứng một mình → Cancel
     2. Employee Checkin list → chọn log Off-Shift → Actions → Fetch Shifts
     3. Shift Type → Mark Attendance → Attendance Present
   Ảnh ra: images/desk/offshift-*.png (01 list · 02 form · 03 cửa sổ ca · 04 fetch · 05 huỷ 0h · 06 mark · 07 kết quả)

   CHUẨN BỊ (local): scratchpad/setup_offshift_demo.py đã tạo cho HR-EMP-00168 ngày 01/10/2026
   log IN 06:58 (Off-Shift, ca ST - AKW mở cửa 07:00) + log OUT 17:32 + Attendance Half Day 0h.
   Tài khoản demo-hr@tgdg.com (HR Manager) — mật khẩu truyền qua env, KHÔNG hardcode.
   Chạy:
     SITE=http://cobe.cc:8002 FRAPPE_USER=demo-hr@tgdg.com FRAPPE_PASS='<mật-khẩu>' \
       EMP=HR-EMP-00168 DAY=2026-10-01 SHIFT='ST - AKW' \
       node help/cobe_erp_documents/_tools/shoot_desk_offshift.js
   Script CÓ THAO TÁC THẬT (cancel Attendance, fetch shift, mark attendance) — chỉ chạy trên local.
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
const DAY = process.env.DAY || '2026-10-01';
const SHIFT = process.env.SHIFT || 'ST - AKW';

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
  page.setDefaultTimeout(25000);

  const settle = async (ms = 1500) => {
    await page.waitForTimeout(ms);
    for (let i = 0; i < 2; i++) { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(200); }
    await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
    await page.waitForTimeout(300);
  };
  const shot = async (name, opts = {}) => {
    await page.screenshot({ path: path.join(OUT, name), ...opts });
    console.log('  ✓ shot', name);
  };
  // Lấy dữ liệu qua frappe.db trong trang (đã login)
  const dbList = (doctype, filters, fields) => page.evaluate(
    ([doctype, filters, fields]) => frappe.db.get_list(doctype, { filters, fields, limit: 20 }),
    [doctype, filters, fields]);

  console.log('• Login', SITE, 'as', USER);
  await page.goto(u('/login'), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#login_email', { timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.fill('#login_email', USER);
  await page.fill('#login_password', PASS);
  await page.click('.btn-login');
  await page.waitForFunction(() => !/\/login/.test(location.href), { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);
  if (/\/login/.test(page.url())) { console.error('  ✗ Login thất bại'); await browser.close(); process.exit(2); }
  console.log('  ✓ Login OK');

  // ---------- 0. Employee Checkin list: log Off-Shift ----------
  console.log('• Employee Checkin list (Off-Shift)');
  await page.goto(u(`/app/employee-checkin?employee=${enc(EMP)}&time=${enc(JSON.stringify(['Between', [DAY, DAY]]))}`), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.list-row-container');
  await settle(2500);
  await shot('offshift-01-checkin-list.png');

  const logs = await dbList('Employee Checkin', { employee: EMP, time: ['between', [DAY + ' 00:00:00', DAY + ' 23:59:59']] },
    ['name', 'time', 'log_type', 'offshift', 'shift', 'attendance', 'skip_auto_attendance']);
  logs.sort((a, b) => a.time.localeCompare(b.time));
  console.log('  logs:', JSON.stringify(logs));
  const offLog = logs.find((l) => l.offshift);
  const inLog = offLog || logs[0];

  // ---------- 0b. Form log Off-Shift ----------
  console.log('• Employee Checkin form', inLog.name);
  await page.goto(u('/app/employee-checkin/' + enc(inLog.name)), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.form-layout');
  await settle(2000);
  await shot('offshift-02-checkin-form.png');

  // ---------- 1. Shift Type: cửa sổ nhận check-in trước giờ vào ca ----------
  console.log('• Shift Type form (cửa sổ ca)', SHIFT);
  await page.goto(u('/app/shift-type/' + enc(SHIFT)), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.form-layout');
  await settle(2000);
  await page.evaluate(() => { try { cur_frm.scroll_to_field('begin_check_in_before_shift_start_time'); } catch (e) {} });
  await page.waitForTimeout(1200);
  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
  await shot('offshift-03-shift-type-window.png');

  // ---------- 2. Fetch Shifts ----------
  console.log('• Fetch Shifts cho', inLog.name);
  await page.goto(u(`/app/employee-checkin?employee=${enc(EMP)}&time=${enc(JSON.stringify(['Between', [DAY, DAY]]))}`), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.list-row-container');
  await settle(2500);
  // tick dòng log Off-Shift
  const row = page.locator(`.list-row-container:has(a[href*="${enc(inLog.name)}"]), .list-row-container:has-text("${inLog.name}")`).first();
  await row.locator('.list-row-checkbox').first().click();
  await page.waitForTimeout(800);
  await page.locator('.page-actions button:has-text("Actions"), .actions-btn-group button').first().click();
  await page.waitForSelector('.dropdown-menu.show', { timeout: 5000 });
  await page.waitForTimeout(500);
  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
  await shot('offshift-04-fetch-shifts-menu.png');
  await page.locator('.dropdown-menu.show a:has-text("Fetch Shifts"), .dropdown-menu.show .dropdown-item:has-text("Fetch Shifts")').first().click();
  await page.waitForTimeout(3000);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.list-row-container');
  await settle(2500);
  await shot('offshift-04b-checkin-list-after-fetch.png');
  const after = await dbList('Employee Checkin', { name: inLog.name }, ['name', 'offshift', 'shift', 'skip_auto_attendance']);
  console.log('  after fetch:', JSON.stringify(after));

  // ---------- 1. Attendance 0 giờ → Cancel ----------
  const atts = await dbList('Attendance', { employee: EMP, attendance_date: DAY, docstatus: ['!=', 2] },
    ['name', 'status', 'working_hours', 'docstatus']);
  console.log('  attendance:', JSON.stringify(atts));
  if (atts.length) {
    const att = atts[0];
    console.log('• Attendance form', att.name);
    await page.goto(u('/app/attendance/' + enc(att.name)), { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.form-layout');
    await settle(2000);
    await shot('offshift-05-attendance-0h.png');
    if (att.docstatus === 1) {
      console.log('• Cancel Attendance');
      await page.locator('.page-actions button:has-text("Cancel"), .page-actions button:has-text("Hủy")').first().click();
      await page.waitForSelector('.modal.show', { timeout: 8000 });
      await page.waitForTimeout(600);
      await page.locator('.modal.show .btn-primary').first().click();
      await page.waitForFunction(() => cur_frm && cur_frm.doc && cur_frm.doc.docstatus === 2, { timeout: 20000 });
      await settle(1500);
      // (không chụp cảnh sau Cancel — bài không dùng)
    }
  } else {
    console.log('  (không có Attendance ngày đó — bỏ qua bước Cancel)');
  }

  // ---------- 3. Shift Type → Mark Attendance ----------
  console.log('• Shift Type form', SHIFT);
  await page.goto(u('/app/shift-type/' + enc(SHIFT)), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.form-layout');
  await settle(2500);
  await shot('offshift-06-shift-type-mark.png');
  const btn = page.locator('.page-actions button:has-text("Mark Attendance"), .custom-actions button:has-text("Mark Attendance")').first();
  if (await btn.count()) {
    await btn.click();
  } else {
    // nút có thể bị gom vào dropdown Actions khi màn hẹp
    await page.locator('.page-actions button:has-text("Actions")').first().click();
    await page.locator('.dropdown-menu.show a:has-text("Mark Attendance")').first().click();
  }
  await page.waitForSelector('.modal.show .modal-body', { timeout: 60000 });
  await page.waitForTimeout(800);
  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
  await shot('offshift-06b-mark-result.png');
  await page.keyboard.press('Escape');

  // ---------- 4. Attendance mới ----------
  await page.waitForTimeout(1500);
  const newAtts = await dbList('Attendance', { employee: EMP, attendance_date: DAY, docstatus: 1 },
    ['name', 'status', 'working_hours', 'in_time', 'out_time']);
  console.log('  attendance mới:', JSON.stringify(newAtts));
  if (newAtts.length) {
    await page.goto(u('/app/attendance/' + enc(newAtts[0].name)), { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.form-layout');
    await settle(2000);
    await shot('offshift-07-attendance-present.png');
  }

  await browser.close();
  console.log('\nXong. Ảnh ở:', OUT);
})().catch(e => { console.error(e); process.exit(1); });
