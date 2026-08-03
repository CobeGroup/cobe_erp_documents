/* shoot_desk_mas_cobe.js — chụp report "COBE HR Attendance Sheet" (Desk thật)
   cho Desk-HR-BangCongThang.md: lưới Mã NV · Cty Trực Thuộc · Tổng giờ · số dư phép,
   và 5 CHẾ ĐỘ XEM (Chấm công · Giờ vào-ra · Đầy đủ · Chi tiết theo ngày · Tổng hợp).
   Auth bằng SID cookie (khỏi mật khẩu). KHÔNG PII: mọi ảnh lọc về 1 NV DEMO (Mã NV 0990).
   Demo bị xoá mỗi lần restore DB từ prod → dựng lại: doc-harness/seed_attendance_demo.py
   BẪY desk-shot: fullPage→trắng (chụp viewport); mỗi ảnh browser MỚI; KHÔNG Escape.
   Chạy: SID=<sid> BASE=http://cobe.cc:8000 node help/cobe_erp_documents/_tools/shoot_desk_mas_cobe.js
     (SID: bench --site cobe.cc browse --user Administrator) */
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/desk';
const BASE = (process.env.BASE || 'http://cobe.cc:8000').replace(/\/$/, '');
const HOST = new URL(BASE).hostname;
const SID = process.env.SID || '';
if (!SID) { console.error('Thiếu SID. Lấy: bench --site cobe.cc browse --user Administrator'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

const REPORT = 'COBE HR Attendance Sheet';

// Lưới đã lọc về NV demo nên không cần blur cột tên; chỉ sidebar/notification mới có
// thể lộ tên NV thật.
const SCRUB = `() => {
  document.querySelectorAll('.form-sidebar, .navbar .dropdown-notifications').forEach(el => { el.style.filter = 'blur(6px)'; });
}`;

/* opts: { view, scrollLeft, width, clipH, openHelp } */
async function shoot(name, opts = {}) {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const vw = opts.width || 1560;
  const ctx = await browser.newContext({ viewport: { width: vw, height: 940 }, deviceScaleFactor: 2, locale: 'vi-VN' });
  await ctx.addCookies([{ name: 'sid', value: SID, domain: HOST, path: '/' }]);
  const page = await ctx.newPage();
  await page.goto(BASE + '/app/query-report/' + REPORT, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForFunction(() => window.frappe && frappe.query_report && frappe.query_report.filters && frappe.query_report.filters.length, { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(1500);

  // NV demo tra theo Mã NV: seed lại sau mỗi lần restore DB thì mã Employee đổi.
  const emp = await page.evaluate(async () => {
    const r = await frappe.db.get_list('Employee', { filters: { employee_number: '0990' }, fields: ['name'], limit: 1 });
    return r && r.length ? r[0].name : null;
  });
  if (!emp) { console.error('Không thấy NV demo (Mã NV 0990) — chạy doc-harness/seed_attendance_demo.py trước'); process.exit(1); }

  // Đặt kỳ + NV TRƯỚC: chọn NV mới mở khoá chế độ "Chi tiết theo ngày" trong dropdown.
  for (let i = 0; i < 4; i++) {
    try {
      await page.evaluate((e) => frappe.query_report.set_filter_value({
        filter_based_on: 'Month', month: 7, year: '2026', company: 'THẾ GIỚI ĐIỆN GIẢI', employee: e,
      }), emp);
      break;
    } catch (e) { if (i === 3) throw e; await page.waitForTimeout(1500); }
  }
  await page.waitForTimeout(2000);
  if (opts.view) {
    await page.selectOption('select[data-fieldname="view_mode"]', opts.view);
    await page.waitForTimeout(2500);
  }
  await page.waitForSelector('.dt-scrollable .dt-row', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2000);
  if (opts.openHelp) {
    await page.evaluate(() => { const d = document.querySelector('details'); if (d) d.open = true; });
    await page.waitForTimeout(600);
  }
  if (opts.scrollLeft) {
    await page.evaluate((x) => { document.querySelector('.dt-scrollable').scrollLeft = x; }, opts.scrollLeft);
    await page.waitForTimeout(800);
  }
  await page.evaluate(SCRUB).catch(() => {});
  await page.waitForTimeout(400);
  const so = { path: path.join(OUT, name) };
  if (opts.clipH) so.clip = { x: 0, y: 0, width: vw, height: opts.clipH };
  await page.screenshot(so);
  console.log('  ✓ shot', name);
  await browser.close();
}

(async () => {
  // Mục 0 — lưới "Chấm công" (mặc định): Mã NV · Cty Trực Thuộc · Tổng giờ · 4 cột số dư phép.
  await shoot('hr-mas-cobe-grid.png', { view: 'Chấm công', width: 2400, clipH: 420 });
  // Mục 1 "Mở báo cáo" — bảng vừa mở, thanh lọc có ô "Chế độ xem".
  await shoot('hr-mas-cobe-open.png', { view: 'Chấm công', width: 1560, clipH: 400 });
  // Mục 2 "Bộ lọc" — khối "Giải thích các filter" mở sẵn.
  await shoot('hr-mas-cobe-help.png', { view: 'Chấm công', width: 1560, clipH: 620, openHelp: true });
  // Mục 3 — Giờ vào-ra (cụm 3 cột/ngày) và Đầy đủ (4 cột/ngày), cuộn tới lưới ngày.
  await shoot('hr-mas-cobe-clock.png', { view: 'Giờ vào-ra', width: 2000, clipH: 400, scrollLeft: 620 });
  await shoot('hr-mas-cobe-full.png', { view: 'Đầy đủ', width: 2000, clipH: 400, scrollLeft: 620 });
  // Mục 3 — Chi tiết theo ngày (mỗi ngày 1 dòng, chỉ khi đã chọn 1 NV).
  await shoot('hr-mas-cobe-daily.png', { view: 'Chi tiết theo ngày', width: 1560, clipH: 820 });
  // Mục 2 — Tổng hợp (bản HRMS gốc: chart + bảng đếm theo loại phép).
  await shoot('hr-mas-cobe-summary.png', { view: 'Tổng hợp', width: 1560, clipH: 660 });
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
