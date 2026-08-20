/* shoot_desk_payroll_journey.js — bộ ảnh cho bài "Hành trình một phiếu lương"
   → images/desk/payroll/journey/.

   Demo data: chạy trước `cd sites && ../env/bin/python ../doc-harness/seed_payroll_journey.py`
   (NV demo 0995 Lê Thị Hồng Demo = nhân vật chính, kỳ 07/2026).

   BẪY desk-shot (đã dính nhiều lần): fullPage → ảnh TRẮNG (phải chụp viewport);
   mỗi ảnh mở browser MỚI; KHÔNG bấm Escape (đóng modal bằng nút close); che PII
   bằng blur chứ đừng remove (remove làm vỡ layout).

   Chạy:
     SID=<sid admin> BASE=http://cobe.cc:8002 STEP=a \
       node help/cobe_erp_documents/_tools/shoot_desk_payroll_journey.js
     (STEP=a: phiếu còn Nháp · STEP=slip: chụp bù 2 tab phiếu ·
      STEP=b: sau khi chạy seed_payroll_journey.py --submit)
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/desk/payroll/journey';
const BASE = (process.env.BASE || 'http://cobe.cc:8002').replace(/\/$/, '');
const HOST = new URL(BASE).hostname;
const SID = process.env.SID || '';
const STEP = process.env.STEP || 'a';
if (!SID) { console.error('Thiếu SID (bench --site cobe.cc browse --user Administrator)'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

const HIDE_CSS = `
  .onboarding-widget-box, .ce-toast, .desk-alert, .notifications-list, .form-message,
  .layout-side-section .form-sidebar .sidebar-menu li.user-actions { display:none !important; }
  .navbar .dropdown-notifications, .navbar-nav .dropdown-message { filter: blur(6px); }
`;

const enc = encodeURIComponent;
// ID đọc từ file seeder xuất ra — mỗi lần restore DB là ID mới, hardcode là chụp nhầm/404.
const IDS = JSON.parse(fs.readFileSync(ROOT + '/doc-harness/payroll_journey_ids.json', 'utf8'));
const HERO = IDS.employee;
const SLIP = IDS.salary_slip;
// Bản luật đầu tiên do patch v0_036 tạo — tên cố định theo ngày hiệu lực.
const POLICY = process.env.POLICY || 'CPP-2026-01-01';

async function shoot({ name, route, width = 1440, height = 940, clipH, prep }) {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, locale: 'vi-VN' });
  await ctx.addCookies([{ name: 'sid', value: SID, domain: HOST, path: '/' }]);
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(5000);
  for (let i = 0; i < 2; i++) {
    await page.locator('.modal.show .btn-modal-close').first().click({ timeout: 800 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
  if (prep) { await prep(page); }
  await page.waitForTimeout(600);
  const opts = { path: path.join(OUT, name) };
  if (clipH) opts.clip = { x: 0, y: 0, width, height: clipH };
  await page.screenshot(opts);
  console.log('  ✓', name);
  await browser.close();
}

const clickTab = (label) => async (p) => {
  await p.locator('.form-tabs .nav-link', { hasText: label }).first().click({ timeout: 5000 }).catch(() => {});
  await p.waitForTimeout(1500);
};

const scrollTo = (fieldname, block = 'center') => async (p) => {
  await p.evaluate(([f, b]) => {
    const el = document.querySelector(`[data-fieldname="${f}"]`);
    if (el) el.scrollIntoView({ block: b });
  }, [fieldname, block]);
  await p.waitForTimeout(800);
};

const seq = (...steps) => async (p) => { for (const s of steps) await s(p); };
const top = async (p) => { await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400); };

const reportPrep = (scrollRight) => async (p) => {
  await p.waitForFunction(
    () => window.frappe && frappe.query_report && frappe.query_report.filters && frappe.query_report.filters.length,
    { timeout: 25000 }).catch(() => {});
  // fire-and-forget: set_filter_value trả Promise chạy report — return nó trong evaluate là TREO
  for (let i = 0; i < 4; i++) {
    try {
      await p.evaluate(() => {
        frappe.query_report.set_filter_value({
          from_date: '2026-07-01', to_date: '2026-07-31', company: 'THẾ GIỚI ĐIỆN GIẢI',
        });
      });
      break;
    } catch (e) { await p.waitForTimeout(1500); }
  }
  await p.waitForTimeout(1200);
  await p.evaluate(() => { if (frappe.query_report.refresh) frappe.query_report.refresh(); }).catch(() => {});
  await p.waitForSelector('.dt-body .dt-row', { timeout: 20000 }).catch(() => {});
  await p.waitForTimeout(2000);
  if (scrollRight) {
    await p.evaluate(() => { const s = document.querySelector('.dt-scrollable'); if (s) s.scrollLeft = 99999; });
    await p.waitForTimeout(800);
  }
};

(async () => {
  if (STEP === 'slip') {  // chụp lại riêng 2 ảnh phiếu (chạy bù)
    await shoot({
      name: '13-slip-ngaycong.png', route: '/app/salary-slip/' + enc(SLIP),
      prep: seq(clickTab('Payment Days'), top),
    });
    await shoot({
      name: '14-slip-earnings.png', route: '/app/salary-slip/' + enc(SLIP),
      prep: seq(clickTab('Earnings & Deductions'), top),
    });
  }

  if (STEP === 'a') {
    // ---- Chuẩn bị (setup) ----
    // Settings giờ chỉ còn 2 công tắc; mọi ngưỡng nằm ở Cobe Payroll Policy (theo ngày hiệu lực).
    await shoot({ name: '01-settings-bh.png', route: '/app/cobe-payroll-settings' });
    await shoot({ name: '02-policy-bh.png', route: '/app/cobe-payroll-policy/' + enc(POLICY) });
    await shoot({
      name: '02b-policy-thue.png', route: '/app/cobe-payroll-policy/' + enc(POLICY),
      prep: seq(scrollTo('tax_section', 'start'), async (p) => { await p.evaluate(() => window.scrollBy(0, -60)); }),
    });
    await shoot({
      name: '03-employee-luong.png', route: '/app/employee/' + HERO,
      prep: seq(clickTab('Salary'), async (p) => {
        await p.locator('[data-fieldname="custom_cobe_payroll_section"] .section-head')
          .first().click({ timeout: 4000 }).catch(() => {});
        await p.waitForTimeout(800);
      }, scrollTo('custom_cobe_payroll_section')),
    });
    await shoot({ name: '04-hla.png', route: '/app/holiday-list-assignment/' + enc(IDS.hla) });
    await shoot({ name: '05-ssa.png', route: '/app/salary-structure-assignment/' + enc(IDS.ssa) });
    await shoot({
      name: '06-salary-structure.png', route: '/app/salary-structure/' + enc('Cobe Lương tháng - TGĐG'),
      prep: clickTab('Earnings & Deductions'),
    });

    // ---- Phát sinh trong tháng ----
    await shoot({ name: '07-leave-lwp.png', route: '/app/leave-application/' + enc(IDS.leave) });
    await shoot({ name: '08-attendance-ot.png', route: '/app/attendance/' + enc(IDS.attendance_ot) });
    await shoot({ name: '09-overtime-slip.png', route: '/app/overtime-slip/' + enc(IDS.overtime_slip) });
    await shoot({ name: '10-additional-salary.png', route: '/app/additional-salary/' + enc(IDS.additional_salary) });

    // ---- Cuối tháng ----
    await shoot({ name: '11-payroll-entry.png', route: '/app/payroll-entry/' + enc(IDS.payroll_entry) });
    await shoot({ name: '12-slip-nhap.png', route: '/app/salary-slip/' + enc(SLIP), prep: top });
    // tab của Salary Slip v17: Details · Payment Days · Earnings & Deductions ·
    // Net Pay Info · Bank Details · Leaves (bấm tab, scroll suông KHÔNG nhảy tab)
    await shoot({
      name: '13-slip-ngaycong.png', route: '/app/salary-slip/' + enc(SLIP),
      prep: seq(clickTab('Payment Days'), top),
    });
    await shoot({
      name: '14-slip-earnings.png', route: '/app/salary-slip/' + enc(SLIP),
      prep: seq(clickTab('Earnings & Deductions'), top),
    });
    await shoot({
      name: '16-slip-netpay.png', route: '/app/salary-slip/' + enc(SLIP),
      prep: clickTab('Net Pay Info'),
    });
  }

  if (STEP === 'b') {
    // sau khi Submit phiếu (chạy seed_payroll_journey.py --submit)
    await shoot({ name: '17-slip-dachot.png', route: '/app/salary-slip/' + enc(SLIP), prep: top });
    await shoot({
      name: '18-bang-luong.png', route: '/app/query-report/' + enc('Bang Luong Cobe'),
      width: 2100, clipH: 560, prep: reportPrep(false),
    });
    await shoot({
      name: '19-bang-luong-phai.png', route: '/app/query-report/' + enc('Bang Luong Cobe'),
      width: 2100, clipH: 560, prep: reportPrep(true),
    });
  }

  console.log('\nXong. Ảnh ở:', OUT);
})().catch((e) => { console.error(e); process.exit(1); });
