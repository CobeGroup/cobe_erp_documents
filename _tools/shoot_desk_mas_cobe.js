/* shoot_desk_mas_cobe.js — chụp report "Monthly Attendance Sheet Cobe" (Desk thật)
   cho Desk-HR-BangCongThang.md: lưới có Mã NV · Công ty trực thuộc · Tổng giờ · giờ trong ô (P 8.3).
   Auth bằng SID cookie (khỏi mật khẩu). Che PII: blur cột "Employee Name".
   BẪY desk-shot: fullPage→trắng (chụp viewport); mỗi ảnh browser MỚI; KHÔNG Escape; blur (KHÔNG remove).
   Chạy: SID=<sid> BASE=http://cobe.cc:8002 node help/cobe_erp_documents/_tools/shoot_desk_mas_cobe.js
     (SID: bench --site cobe.cc browse --user Administrator) */
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/desk';
const BASE = (process.env.BASE || 'http://cobe.cc:8002').replace(/\/$/, '');
const HOST = new URL(BASE).hostname;
const SID = process.env.SID || '';
if (!SID) { console.error('Thiếu SID. Lấy: bench --site cobe.cc browse --user Administrator'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

const REPORT = 'Monthly Attendance Sheet Cobe';
// PII: blur cột "Employee Name" (tên thật). Giữ Mã NV/Company Note/Tổng giờ/giờ (feature).
const BLUR = `() => {
  const hdr = [...document.querySelectorAll('.dt-header .dt-cell')];
  const idx = hdr.findIndex(c => /Employee Name/i.test(c.innerText || ''));
  if (idx >= 0) document.querySelectorAll('.dt-body .dt-cell--col-' + idx)
    .forEach(el => { el.style.filter = 'blur(5px)'; });
  // ẩn thanh sidebar/notification nếu có tên NV
  document.querySelectorAll('.form-sidebar, .navbar .dropdown-notifications').forEach(el => { el.style.filter = 'blur(6px)'; });
}`;

async function shoot(name, filters, w) {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: w || 1560, height: 940 }, deviceScaleFactor: 2, locale: 'vi-VN' });
  await ctx.addCookies([{ name: 'sid', value: SID, domain: HOST, path: '/' }]);
  const page = await ctx.newPage();
  await page.goto(BASE + '/app/query-report/' + REPORT, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForFunction(() => window.frappe && frappe.query_report && frappe.query_report.filters && frappe.query_report.filters.length, { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(1500);
  // đặt filter → report Cobe chạy thẳng (không prepared)
  for (let i = 0; i < 4; i++) {
    try { await page.evaluate((f) => frappe.query_report.set_filter_value(f), filters); break; }
    catch (e) { if (i === 3) throw e; await page.waitForTimeout(1500); }
  }
  await page.waitForTimeout(1500);
  await page.evaluate(() => frappe.query_report.refresh && frappe.query_report.refresh()).catch(() => {});
  await page.waitForSelector('.dt-body .dt-row', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await page.evaluate(BLUR).catch(() => {});
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, name) });
  console.log('  ✓ shot', name);
  await browser.close();
}

(async () => {
  // Lưới Cobe — DEMO 1 NV (Nguyễn Văn Demo) tháng 7/2026: đủ ký hiệu + Company Note, KHÔNG PII.
  await shoot('hr-mas-cobe-grid.png',
    { filter_based_on: 'Month', month: 7, year: '2026', company: 'THẾ GIỚI ĐIỆN GIẢI', employee: 'HR-EMP-0990' });
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
