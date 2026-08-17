/* shoot_desk_cong_van.js — chụp quy trình Công văn trên Frappe Desk (login thật).
   Demo data seed bằng document_management_for_cobegroup._dev_seed.run:
     - 04/2026/TB-TGĐG : Issued, đã công bố, ack 1/3 đã đọc
     - 05/2026/TB-TGĐG : Draft (đang soạn)
     - 06/2026/TB-TGĐG : Approved (chờ ban hành)
   Tài khoản demo (mật khẩu Demo@Cobe2026): demo-vanthu@tgdg.com (Văn thư),
     demo-nv1@tgdg.com (đã đọc), demo-nv2@tgdg.com (chưa đọc).
   Chạy: node help/cobe_erp_documents/_tools/shoot_desk_cong_van.js
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');

const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/desk';
const SITE = (process.env.SITE || 'http://cobe.cc:8002').replace(/\/$/, '');
const PASS = process.env.FRAPPE_PASS || 'Demo@Cobe2026';

const ISSUED = '04/2026/TB-TGĐG';
const DRAFT = '05/2026/TB-TGĐG';
const APPROVED = '06/2026/TB-TGĐG';

fs.mkdirSync(OUT, { recursive: true });
const u = (s) => SITE + s;
const enc = encodeURIComponent;
const odoc = (name) => '/app/official-document/' + enc(name);

// NB: do NOT hide .form-message — that is where set_headline renders the
// "Bạn cần xác nhận đã đọc" / "Bạn đã đọc lúc…" banner we want to capture.
const HIDE_CSS = `
  .onboarding-widget-box, .ce-toast, .desk-alert, .notifications-list,
  .layout-side-section .form-sidebar .sidebar-menu li.user-actions { display:none !important; }
`;

let browser;

async function session(email) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'vi-VN',
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  console.log('• Login as', email);
  await page.goto(u('/login'), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#login_email', { timeout: 15000 });
  await page.waitForTimeout(800);
  await page.fill('#login_email', email);
  await page.fill('#login_password', PASS);
  await page.click('.btn-login');
  await page.waitForFunction(() => !/\/login/.test(location.href), { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2500);
  if (/\/login/.test(page.url())) { throw new Error('Login failed: ' + email); }
  console.log('  ✓ Login OK');
  return { ctx, page };
}

async function shot(page, name) {
  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, name) });
  console.log('  ✓ shot', name);
}

async function openForm(page, route) {
  await page.goto(u(route), { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForSelector('.title-text, .layout-main, .page-head', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3500);
  // đóng popup còn sót
  for (let i = 0; i < 3; i++) {
    await page.locator('.modal.show .btn-modal-close, .modal-dialog .modal-header .btn-close').first()
      .click({ timeout: 800 }).catch(() => {});
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(300);
  }
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await page.waitForTimeout(700);
}

(async () => {
  browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--host-resolver-rules=MAP cobe.cc 127.0.0.1'],
  });

  // ===== VĂN THƯ =====
  {
    const { ctx, page } = await session('demo-vanthu@tgdg.com');

    // 1) Draft — đang soạn, nút workflow "Submit for Approval"
    await openForm(page, odoc(DRAFT));
    await shot(page, 'cong-van-01-soan-draft.png');

    // 2) Approved — chờ ban hành, nút "Issue"
    await openForm(page, odoc(APPROVED));
    await shot(page, 'cong-van-02-cho-ban-hanh.png');

    // 3) Issued — đã công bố, nút "Theo dõi đọc: 1/3"
    await openForm(page, odoc(ISSUED));
    await shot(page, 'cong-van-03-da-ban-hanh.png');

    // 4) Danh sách theo dõi đọc
    await page.goto(u('/app/official-document-acknowledgment/view/list?document=' + enc(ISSUED)),
      { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForSelector('.result-list, .no-result, .list-row', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await shot(page, 'cong-van-04-theo-doi-doc.png');

    await ctx.close();
  }

  // ===== NHÂN VIÊN chưa đọc =====
  {
    const { ctx, page } = await session('demo-nv2@tgdg.com');
    // 5) Form văn bản — banner + nút "Đã đọc"
    await openForm(page, odoc(ISSUED));
    await shot(page, 'cong-van-05-nv-can-doc.png');

    // 6) "Văn bản cần đọc" — hộp thư của NV
    await page.goto(u('/app/official-document-acknowledgment'), { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForSelector('.result-list, .no-result, .list-row', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await shot(page, 'cong-van-06-nv-hop-thu.png');
    await ctx.close();
  }

  // ===== NHÂN VIÊN đã đọc =====
  {
    const { ctx, page } = await session('demo-nv1@tgdg.com');
    // 7) Form — trạng thái "Bạn đã đọc lúc ..."
    await openForm(page, odoc(ISSUED));
    await shot(page, 'cong-van-07-nv-da-doc.png');
    await ctx.close();
  }

  await browser.close();
  console.log('\nXong. Ảnh ở:', OUT);
})().catch(e => { console.error(e); if (browser) browser.close(); process.exit(1); });
