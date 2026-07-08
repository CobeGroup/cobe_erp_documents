/* shoot_desk_leave_reports.js — chụp 3 báo cáo LEAVE trên Frappe Desk (login thật):
   Employee Leave Balance · Leave Ledger · Employee Leave Balance Summary.
   Ảnh ra: images/desk/hr-report-leave-{balance,ledger,balance-summary}.png
   → nhúng bổ sung vào users/Desk-HR-KiemTraPhep.md (trang đang dùng ảnh cũ hr-leave-balance.png).

   CHUẨN BỊ (demo data đã dựng 08/07/2026 trên DB local; DB restore lại thì dựng lại bằng console):
   1. User demo-hr@tgdg.com: enabled=1 + update_password + roles HR Manager, HR User, Leave
      Approver và **Employee** (DB prod-copy: Company chỉ đọc được bởi role Employee/Sales User/…;
      thiếu là report chết 417 "You do not have permission to access Company". Lưu ý User.save()
      hay rơi role Employee → nhét thẳng Has Role rồi frappe.clear_cache).
   2. Employee "Demo Nhân Viên" (mặc định HR-EMP-00168, company THẾ GIỚI ĐIỆN GIẢI,
      holiday_list HL - Lễ VN - 2026):
      - Leave Allocation "Annual Leave" 01/01–31/12, 12 ngày, Submit (Annual Leave đang dính
        is_lwp=1 trong DB → set is_lwp=0 trước).
      - 2 Leave Application đã Submitted qua apply_workflow (Manager Approve → Submit):
        Phép năm 15/05 + Nghỉ bù 11/05 (custom_comp_worked_date 09/05) → minh hoạ số dư âm.
      - Attendance tháng 5: 04 P · 05 P · 06 A · 07 HD · 08 WFH (cho shoot_desk_mas.js).
   3. Stack: redis 13002/11002 + `bench serve --port 8002` (KHÔNG --nothreading — report call treo)
      + worker (`bench_helper frappe worker`) cho prepared report.
   Chạy:
     SITE=http://cobe.cc:8002 FRAPPE_USER=demo-hr@tgdg.com FRAPPE_PASS='<mật-khẩu>' \
       EMP=HR-EMP-00168 node help/cobe_erp_documents/_tools/shoot_desk_leave_reports.js
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
const COMPANY = process.env.COMPANY || 'THẾ GIỚI ĐIỆN GIẢI';

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
  page.setDefaultTimeout(20000);
  const shot = async (name) => { await page.addStyleTag({ content: HIDE_CSS }).catch(()=>{}); await page.waitForTimeout(400); await page.screenshot({ path: path.join(OUT, name) }); console.log('  ✓ shot', name); };
  // Mở query report rồi ÉP set filter + refresh trong page — filter qua URL chỉ điền UI,
  // không trigger chạy report.
  const openReport = async (name, filters) => {
    await page.goto(u('/app/query-report/' + enc(name)), { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForFunction(() => window.frappe && frappe.query_report && frappe.query_report.filters && frappe.query_report.filters.length, { timeout: 25000 });
    await page.waitForTimeout(2500);
    // KHÔNG await set_filter_value/refresh trong evaluate — promise phía app có thể không bao giờ
    // resolve → evaluate treo vô hạn. Fire-and-forget rồi chờ datatable ở ngoài.
    // Desk SPA có thể re-route ngay sau load → dính "context destroyed" thì retry.
    for (let i = 0; i < 4; i++) {
      try {
        await page.evaluate((f) => {
          const qr = frappe.query_report;
          Object.entries(f).forEach(([k, v]) => { try { qr.set_filter_value(k, v); } catch (e) {} });
          setTimeout(() => { try { qr.refresh(); } catch (e) {} }, 1000);
        }, filters);
        break;
      } catch (e) { if (i === 3) throw e; await page.waitForTimeout(2000); }
    }
    await page.waitForSelector('.dt-scrollable .dt-row, .report-wrapper .msg-box', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(2000);
    for (let i = 0; i < 2; i++) { await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(300); }
  };

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

  // 1) Employee Leave Balance — số dư từng loại của 1 NV trong năm
  console.log('• Employee Leave Balance');
  await openReport('Employee Leave Balance', { from_date:'2026-01-01', to_date:'2026-12-31', company:COMPANY, employee:EMP });
  await shot('hr-report-leave-balance.png');

  // 2) Leave Ledger — sổ cái phép: từng dòng cấp (+) / trừ (−)
  console.log('• Leave Ledger');
  await openReport('Leave Ledger', { from_date:'2026-01-01', to_date:'2026-12-31', company:COMPANY, employee:EMP });
  await shot('hr-report-leave-ledger.png');

  // 3) Employee Leave Balance Summary — mỗi NV 1 dòng tại 1 ngày
  console.log('• Employee Leave Balance Summary');
  await openReport('Employee Leave Balance Summary', { date:'2026-07-08', company:COMPANY, employee:EMP });
  await shot('hr-report-leave-balance-summary.png');

  await browser.close();
  console.log('\nXong. Ảnh ở:', OUT);
})().catch(e => { console.error(e); process.exit(1); });
