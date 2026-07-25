/* shoot_desk_payroll.js — chụp bộ ảnh doc "Tính lương tháng" (Desk thật) → images/desk/payroll/.
   Demo data: 3 NV demo 0990-0992 (HR-EMP-00181..183, seed 25/07 — GIỮ, đừng xoá),
   Payroll Entry HR-PRUN-2026-00001, slips 07/2026. Không PII: chỉ mở record demo.
   BẪY desk-shot: fullPage→trắng (chụp viewport); mỗi ảnh browser MỚI; KHÔNG Escape; blur (KHÔNG remove).
   Chạy:
     SID=<sid admin> SID_HR=<sid demo-hr> BASE=http://cobe.cc:8002 \
       node help/cobe_erp_documents/_tools/shoot_desk_payroll.js
   (SID: bench --site cobe.cc browse --user Administrator / --user demo-hr@tgdg.com) */
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/desk/payroll';
const BASE = (process.env.BASE || 'http://cobe.cc:8002').replace(/\/$/, '');
const HOST = new URL(BASE).hostname;
const SID = process.env.SID || '';
const SID_HR = process.env.SID_HR || '';
if (!SID) { console.error('Thiếu SID (bench --site cobe.cc browse --user Administrator)'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

const HIDE_CSS = `
  .onboarding-widget-box, .ce-toast, .desk-alert, .notifications-list, .form-message,
  .layout-side-section .form-sidebar .sidebar-menu li.user-actions { display:none !important; }
  .navbar .dropdown-notifications, .navbar-nav .dropdown-message { filter: blur(6px); }
`;

async function shoot({ name, route, sid, width = 1440, height = 940, clipH, prep }) {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, locale: 'vi-VN' });
  await ctx.addCookies([{ name: 'sid', value: sid || SID, domain: HOST, path: '/' }]);
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(5000);
  // đóng modal msgprint còn sót — click nút close, KHÔNG Escape
  for (let i = 0; i < 2; i++) {
    await page.locator('.modal.show .btn-modal-close').first().click({ timeout: 800 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
  if (prep) { await prep(page); }
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await page.waitForTimeout(600);
  const opts = { path: path.join(OUT, name) };
  if (clipH) opts.clip = { x: 0, y: 0, width, height: clipH };
  await page.screenshot(opts);
  console.log('  ✓', name);
  await browser.close();
}

const enc = encodeURIComponent;
// ONLY=report,perm → chỉ chạy nhóm đó (chạy bù); mặc định chạy hết
const ONLY = (process.env.ONLY || 'all').split(',');
const want = (k) => ONLY.includes('all') || ONLY.includes(k);

(async () => {
  if (want('main')) {
  // 1) Cobe Payroll Settings — công tắc + tỷ lệ BH
  await shoot({ name: 'settings-top.png', route: '/app/cobe-payroll-settings' });
  // 1b) phần thuế + bảng bậc (cuộn xuống)
  await shoot({
    name: 'settings-tax.png', route: '/app/cobe-payroll-settings',
    prep: async (p) => {
      await p.evaluate(() => {
        const el = document.querySelector('[data-fieldname="tax_section"]');
        if (el) el.scrollIntoView({ block: 'start' });
      });
      await p.waitForTimeout(600);
      await p.evaluate(() => window.scrollBy(0, -60));
    },
  });

  // 2) Employee demo — tab Salary, mục "Lương & Thuế (Cobe)" (Admin thấy vì có quyền permlevel 2).
  // Form v17 chia TAB — phải click tab "Salary", scroll suông không nhảy tab.
  await shoot({
    name: 'employee-luong.png', route: '/app/employee/HR-EMP-00181',
    prep: async (p) => {
      await p.locator('.form-tabs .nav-link', { hasText: 'Salary' }).first().click({ timeout: 5000 }).catch(() => {});
      await p.waitForTimeout(1200);
      // section collapsible → click header mở ra cho thấy các ô tiền
      await p.locator('[data-fieldname="custom_cobe_payroll_section"] .section-head').first().click({ timeout: 4000 }).catch(() => {});
      await p.waitForTimeout(800);
      await p.evaluate(() => {
        const el = document.querySelector('[data-fieldname="custom_cobe_payroll_section"]');
        if (el) el.scrollIntoView({ block: 'center' });
      });
      await p.waitForTimeout(600);
    },
  });

  // 3) Salary Structure — tab Earnings & Deductions (bảng formula)
  await shoot({
    name: 'salary-structure.png', route: '/app/salary-structure/' + enc('Cobe Lương tháng - TGĐG'),
    prep: async (p) => {
      await p.locator('.form-tabs .nav-link', { hasText: 'Earnings & Deductions' }).first().click({ timeout: 5000 }).catch(() => {});
      await p.waitForTimeout(1200);
    },
  });

  // 4) Salary Structure Assignment của NV demo
  const SSA = process.env.SSA || '';
  if (SSA) await shoot({ name: 'ssa.png', route: '/app/salary-structure-assignment/' + enc(SSA) });

  // 5) Payroll Entry — form đã Get Employees (3 NV demo)
  await shoot({ name: 'payroll-entry.png', route: '/app/payroll-entry/HR-PRUN-2026-00001' });

  // 6) Salary Slip NV 0991 (đủ BH + thuế) — phần đầu + bảng earnings
  const SLIP = enc('Sal Slip/HR-EMP-00182/00001');
  await shoot({ name: 'salary-slip-top.png', route: '/app/salary-slip/' + SLIP });
  }

  // 6b) tab "Earnings & Deductions" của slip (form v17 chia TAB — phải click tab, scroll không ăn)
  if (want('main') || want('slip2')) {
  const SLIP2 = enc('Sal Slip/HR-EMP-00182/00001');
  await shoot({
    name: 'salary-slip-deductions.png', route: '/app/salary-slip/' + SLIP2,
    prep: async (p) => {
      await p.locator('.form-tabs .nav-link', { hasText: 'Earnings & Deductions' }).first().click({ timeout: 5000 }).catch(() => {});
      await p.waitForTimeout(1200);
      await p.evaluate(() => {
        const el = document.querySelector('[data-fieldname="deductions"]');
        if (el) { el.scrollIntoView({ block: 'center' }); }
      });
      await p.waitForTimeout(600);
    },
  });
  // 6c) tab "Net Pay Info" — tổng khấu trừ + thực lãnh
  await shoot({
    name: 'salary-slip-netpay.png', route: '/app/salary-slip/' + SLIP2,
    prep: async (p) => {
      await p.locator('.form-tabs .nav-link', { hasText: 'Net Pay Info' }).first().click({ timeout: 5000 }).catch(() => {});
      await p.waitForTimeout(1200);
    },
  });

  // 7) Additional Salary (Thưởng 1tr của 0990)
  const AD = process.env.AD || '';
  if (AD) await shoot({ name: 'additional-salary.png', route: '/app/additional-salary/' + enc(AD) });
  }

  // 8) Report Bảng Lương Cobe — 3 dòng demo
  if (want('report')) await shoot({
    name: process.env.REPORT_SCROLL === '1' ? 'bang-luong-report-right.png' : 'bang-luong-report.png', route: '/app/query-report/' + enc('Bang Luong Cobe'),
    width: 2100, clipH: 620,
    prep: async (p) => {
      await p.waitForFunction(() => window.frappe && frappe.query_report && frappe.query_report.filters && frappe.query_report.filters.length, { timeout: 25000 }).catch(() => {});
      // fire-and-forget: set_filter_value/refresh trả về Promise chạy report —
      // return nó trong evaluate là TREO (bẫy đã dính ở shoot_desk_mas).
      for (let i = 0; i < 4; i++) {
        try {
          await p.evaluate(() => { frappe.query_report.set_filter_value({ from_date: '2026-07-01', to_date: '2026-07-31', company: 'THẾ GIỚI ĐIỆN GIẢI' }); });
          break;
        } catch (e) { await p.waitForTimeout(1500); }
      }
      await p.waitForTimeout(1200);
      await p.evaluate(() => { if (frappe.query_report.refresh) frappe.query_report.refresh(); }).catch(() => {});
      await p.waitForSelector('.dt-body .dt-row', { timeout: 20000 }).catch(() => {});
      await p.waitForTimeout(2000);
      // REPORT_SCROLL=1 → cuộn datatable sang phải (cột thuế + Thực lãnh)
      if (process.env.REPORT_SCROLL === '1') {
        await p.evaluate(() => { const s = document.querySelector('.dt-scrollable'); if (s) s.scrollLeft = 99999; });
        await p.waitForTimeout(800);
      }
    },
  });

  // 9) Phân quyền: demo-hr mở Employee (mục lương BIẾN MẤT) + bị chặn Salary Slip
  if (want('perm') && SID_HR) {
    await shoot({
      name: 'hr-employee-no-luong.png', route: '/app/employee/HR-EMP-00181', sid: SID_HR,
      prep: async (p) => {
        await p.locator('.form-tabs .nav-link', { hasText: 'Salary' }).first().click({ timeout: 5000 }).catch(() => {});
        await p.waitForTimeout(1200);
        await p.evaluate(() => {
          const el = document.querySelector('[data-fieldname="salary_mode"], [data-fieldname="bank_ac_no"]');
          if (el) el.scrollIntoView({ block: 'center' });
        });
        await p.waitForTimeout(600);
      },
    });
    await shoot({ name: 'hr-salary-slip-blocked.png', route: '/app/salary-slip', sid: SID_HR, clipH: 560 });
  }

  console.log('\nXong. Ảnh ở:', OUT);
})().catch((e) => { console.error(e); process.exit(1); });
