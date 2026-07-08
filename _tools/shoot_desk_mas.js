/* shoot_desk_mas.js — chụp Monthly Attendance Sheet (Desk thật) cho Desk-HR-BangCongThang.md:
   1. hr-mas-generate.png  — trạng thái prepared report chờ "Generate New Report"
   2. hr-mas-grid.png      — lưới tháng 5/2026 đủ mã P/A/HD/WFH/L/H + ô trống
   3. hr-mas-summary.png   — Summarized View (cột tổng + tách từng loại phép)
   4. hr-mas-export.png    — menu ⋮ → Export

   CHUẨN BỊ: demo data "Demo Nhân Viên" tháng 5/2026 (04 P · 05 P · 06 A · 07 HD · 08 WFH ·
   11 L-Nghỉ bù · 15 L-Phép năm · 01/05 lễ) — xem console recipe trong shoot_desk_leave_reports.js.
   Stack: redis 13002/11002 + bench serve --port 8002 (threaded) + WORKER
   (`bench_helper frappe worker`) — prepared report chạy nền, không có worker là chờ mãi.
   Chạy:
     SITE=http://cobe.cc:8002 FRAPPE_USER=demo-hr@tgdg.com FRAPPE_PASS='<mật-khẩu>' \
       EMP=HR-EMP-00168 node help/cobe_erp_documents/_tools/shoot_desk_mas.js
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
const FILTERS = { filter_based_on:'Month', month:5, year:'2026', company:COMPANY, employee:EMP };

if (!USER || !PASS) { console.error('Thiếu FRAPPE_USER / FRAPPE_PASS'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
const u = (s) => SITE + s;

const HIDE_CSS = `
  .onboarding-widget-box, .ce-toast, .desk-alert, .notifications-list, .form-message { display:none !important; }
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

  const setFilters = async (extra = {}) => {
    const filters = { ...FILTERS, ...extra };
    await page.waitForFunction(() => window.frappe && frappe.query_report && frappe.query_report.filters && frappe.query_report.filters.length, { timeout: 25000 });
    await page.waitForTimeout(2500);
    for (let i = 0; i < 4; i++) {           // SPA re-route → context destroyed → retry
      try {
        await page.evaluate((f) => {
          const qr = frappe.query_report;
          Object.entries(f).forEach(([k, v]) => { try { qr.set_filter_value(k, v); } catch (e) {} });
          setTimeout(() => { try { qr.refresh(); } catch (e) {} }, 1000);
        }, filters);
        break;
      } catch (e) { if (i === 3) throw e; await page.waitForTimeout(2000); }
    }
    await page.waitForTimeout(4000);
  };

  const clickGenerate = async () => {
    const btn = page.locator('button:has-text("Generate New Report")').first();
    if (await btn.isVisible().catch(()=>false)) {
      await btn.click().catch(()=>{});
      console.log('  … generate clicked, chờ worker');
      await page.waitForTimeout(15000);     // không có socketio → không auto-load, phải reload
      return true;
    }
    return false;
  };

  const openWithData = async (extra = {}) => {
    await page.goto(u('/app/query-report/Monthly Attendance Sheet'), { waitUntil: 'domcontentloaded' }).catch(()=>{});
    await setFilters(extra);
    // prepared report: nếu chưa có bản nào khớp filter → bấm Generate, đợi, mở lại
    for (let round = 0; round < 3; round++) {
      const hasRows = await page.locator('.dt-scrollable .dt-row').first().isVisible().catch(()=>false);
      if (hasRows) return;
      const generated = await clickGenerate();
      await page.goto(u('/app/query-report/Monthly Attendance Sheet'), { waitUntil: 'domcontentloaded' }).catch(()=>{});
      await setFilters(extra);
      if (!generated) await page.waitForTimeout(3000);
    }
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

  // 1) Trạng thái "Generate New Report" (mở với filter tháng khác chưa từng generate)
  console.log('• Shot generate-state (tháng 4 chưa có prepared)');
  await page.goto(u('/app/query-report/Monthly Attendance Sheet'), { waitUntil: 'domcontentloaded' }).catch(()=>{});
  await setFilters({ month: 4 });
  if (await page.locator('button:has-text("Generate New Report")').first().isVisible().catch(()=>false)) {
    await shot('hr-mas-generate.png');
  } else { console.log('  (bỏ qua — không thấy nút Generate)'); }

  // 2) Lưới tháng 5 đủ mã
  console.log('• Shot grid tháng 5');
  await openWithData();
  await shot('hr-mas-grid.png');

  // 3) Summarized View
  console.log('• Shot summarized view');
  await openWithData({ summarized_view: 1 });
  await shot('hr-mas-summary.png');

  // 4) Menu ⋮ → Export (trên bảng detail)
  console.log('• Shot export menu');
  await openWithData();
  await page.locator('.page-head .menu-btn-group button, .page-actions button[data-original-title="Menu"], button:has(svg.icon-sm):near(:text("Monthly Attendance Sheet"))').last().click().catch(()=>{});
  await page.waitForTimeout(300);
  // fallback: nút "..." góc phải
  if (!await page.locator('.dropdown-menu:visible', { hasText: 'Export' }).first().isVisible().catch(()=>false)) {
    const btns = page.locator('.page-head button, header button');
    const n = await btns.count();
    for (let i = n - 1; i >= 0 && i > n - 5; i--) {
      await btns.nth(i).click().catch(()=>{});
      await page.waitForTimeout(500);
      if (await page.locator('.dropdown-menu:visible', { hasText: 'Export' }).first().isVisible().catch(()=>false)) break;
      await page.keyboard.press('Escape').catch(()=>{});
    }
  }
  await page.waitForTimeout(600);
  await shot('hr-mas-export.png');

  await browser.close();
  console.log('\nXong. Ảnh ở:', OUT);
})().catch(e => { console.error(e); process.exit(1); });
