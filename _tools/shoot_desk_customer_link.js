/* shoot_desk_customer_link.js — chụp ảnh GUIDE "Sửa lỗi liên kết Khách hàng"
   từ FRAPPE DESK THẬT (login thật, không mock).

   Chạy:
     SITE=https://dev.example.com \
     FRAPPE_USER=admin@... FRAPPE_PASS=... \
     node help/cobe_erp_documents/_tools/shoot_desk_customer_link.js

   Tuỳ chọn override (mặc định = khách 59912 trong vụ điều tra):
     CUST=59912  PHONE=0939227928
     ADDR='CUST-2025-00205-Billing'   # Address có link Customer→59912 (Save sẽ ra lỗi Row #2)
     CONTACT=59912

   LƯU Ý: site dev phải còn GIỮ trạng thái lỗi (Customer.lead_name của 59912 vẫn
   trỏ Lead sai) thì ảnh hộp lỗi mới chụp được. Đừng fix 59912 trên dev trước khi chụp.
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');

const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/desk';

const SITE = (process.env.SITE || '').replace(/\/$/, '');
const USER = process.env.FRAPPE_USER || '';
const PASS = process.env.FRAPPE_PASS || '';
const CUST = process.env.CUST || '59912';
const PHONE = process.env.PHONE || '0939227928';
const ADDR = process.env.ADDR || 'CUST-2025-00205-Billing';
const CONTACT = process.env.CONTACT || '59912';

if (!SITE || !USER || !PASS) {
  console.error('Thiếu env. Cần: SITE, FRAPPE_USER, FRAPPE_PASS');
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

const u = (s) => SITE + s;
const enc = encodeURIComponent;

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'vi-VN' });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);

  const shot = async (name) => { await page.screenshot({ path: path.join(OUT, name) }); console.log('  ✓ shot', name); };
  const outline = async (sel) => { await page.evaluate((s) => {
      document.querySelectorAll(s).forEach(e => { e.style.outline = '3px solid #e53935'; e.style.outlineOffset = '2px'; e.style.borderRadius = '4px'; });
    }, sel).catch(() => {}); };
  const openForm = async (route) => {
    // route /app/... tự redirect sang /desk/... trên site này — vẫn dùng /app cho gọn
    await page.goto(u(route), { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForSelector('.title-text, .layout-main, .page-head', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3500); // cho form render + fetch link xong
  };
  const scrollTo = async (sel) => { await page.evaluate((s) => {
      const el = document.querySelector(s); if (el) el.scrollIntoView({ block: 'center' });
    }, sel).catch(() => {}); await page.waitForTimeout(700); };

  // ---- Login ----
  console.log('• Login', SITE, 'as', USER);
  await page.goto(u('/login'), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#login_email', { timeout: 15000 });
  await page.waitForTimeout(1500); // chờ JS login gắn handler
  await page.fill('#login_email', USER);
  await page.fill('#login_password', PASS);
  await page.click('.btn-login');
  await page.waitForFunction(() => !/\/login/.test(location.href), { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);
  if (/\/login/.test(page.url())) { console.error('  ✗ Login thất bại — kiểm tra creds'); await browser.close(); process.exit(2); }
  console.log('  ✓ Login OK →', page.url());

  // ---- 1. Form Customer: tô đỏ From Lead + Mobile No ----
  console.log('• Customer form', CUST);
  await openForm('/app/customer/' + enc(CUST));
  await outline('[data-fieldname="lead_name"]');
  await outline('[data-fieldname="mobile_no"]');
  await scrollTo('[data-fieldname="lead_name"]');
  await shot('fix-link-01-customer-form.png');

  // ---- 2. Lead List lọc theo số điện thoại ----
  console.log('• Lead list theo phone', PHONE);
  await openForm('/app/lead/view/list?mobile_no=' + enc(PHONE));
  await shot('fix-link-02-lead-list-phone.png');

  // ---- 3. Hộp thoại lỗi: mở Address của khách → ép save → lỗi Row #2 ----
  // Dùng cur_frm.dirty()+save() để pipeline server chạy hook sync_dynamic_link_lead_customer
  // → append Lead ma → validate fail. Lỗi roll back nên KHÔNG ghi gì.
  console.log('• Address ép save → error dialog', ADDR);
  await openForm('/app/address/' + enc(ADDR));
  await page.evaluate(() => { try { if (window.cur_frm) { cur_frm.dirty(); cur_frm.save(); } } catch (e) {} });
  const gotErr = await page.waitForFunction(() => /Could not find/i.test(document.body.innerText), { timeout: 14000 })
    .then(() => true).catch(() => false);
  if (!gotErr) console.warn('  ! Không bung được lỗi — kiểm tra ADDR có link Customer→' + CUST + ' & data còn hỏng không');
  await page.waitForTimeout(1200);
  await shot('fix-link-03-error-dialog.png');
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(600);

  // ---- 4. Contact → bảng Reference (links) ----
  console.log('• Contact Reference', CONTACT);
  await openForm('/app/contact/' + enc(CONTACT));
  await scrollTo('[data-fieldname="links"]');
  await outline('[data-fieldname="links"]');
  await shot('fix-link-04-contact-reference.png');

  await browser.close();
  console.log('\nXong. Ảnh ở:', OUT);
})().catch(e => { console.error(e); process.exit(1); });
