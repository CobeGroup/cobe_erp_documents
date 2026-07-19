/* shoot_vtp.js — chụp ảnh cho doc "Viettel Post — Cài đặt & sử dụng" từ Frappe Desk THẬT.
   Chỉ chụp màn CẤU HÌNH / THAO TÁC. Thông tin nhạy cảm (username VTP, địa chỉ khách) được
   CHE (blur) trước khi chụp → PII-safe.

   ⚠️ QUAN TRỌNG (đã trả giá để biết):
     - fullPage → ẢNH TRẮNG. Luôn chụp viewport.
     - Dùng lại 1 page/1 browser cho nhiều goto → ẢNH TRẮNG. Mỗi ảnh phải mở BROWSER MỚI.
     - Phím Escape làm desk reflow ra ẢNH TRẮNG. Đóng modal bằng click nút close.
     - Không .remove() phần tử desk (xoá .notifications-list → trắng). Chỉ set style.filter để che.

   Chạy:
     SID=<sid> BASE=http://cobe.cc:8002 node help/cobe_erp_documents/_tools/shoot_vtp.js
     (SID lấy qua: bench --site cobe.cc browse --user Administrator)
   Ảnh xuất ra: help/cobe_erp_documents/users/images/vtp/
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');

const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/vtp';
const BASE = (process.env.BASE || 'http://cobe.cc:8002').replace(/\/$/, '');
const SID = process.env.SID || '';
if (!SID) { console.error('Thiếu SID. Lấy qua: bench --site cobe.cc browse --user Administrator'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

const HOST = new URL(BASE).hostname;
const ACCOUNT = 'Viettel Post - TGDG';
const PICKUP_DEFAULT = 'Viettel Post - TGDG-23994680';
const ADDRESS = '1549';

// Mỗi ảnh: mở browser MỚI (pattern đã kiểm chứng chạy được).
async function shoot(name, route, opts = {}) {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  try {
    const ctx = await browser.newContext({ viewport: { width: 1460, height: 940 }, deviceScaleFactor: 2, locale: 'vi-VN' });
    await ctx.addCookies([{ name: 'sid', value: SID, domain: HOST, path: '/' }]);
    const page = await ctx.newPage();
    page.setDefaultTimeout(25000);

    await page.goto(BASE + route, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(5000);
    // đóng modal msgprint bằng click nút close (KHÔNG Escape)
    await page.click('.modal.msgprint .btn-modal-close, .modal .modal-header .btn-modal-close, .modal .modal-header .close', { timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(500);

    // che PII trên LIST VIEW: blur mọi ô/link/span chứa SĐT (0xxxxxxxxx).
    // Tên công ty (Thế Giới Điện Giải...) là của chính mình → không cần che.
    if (opts.redactPhones) {
      await page.evaluate(() => {
        document.querySelectorAll('.list-row-col, .list-row-col a, .list-row-col span, .list-row-col div').forEach(el => {
          if (/0\d{8,10}/.test(el.innerText || '')) el.style.filter = 'blur(5px)';
        });
      }).catch(() => {});
      await page.waitForTimeout(300);
    }
    // che PII: chỉ set filter blur (KHÔNG remove)
    if (opts.redact) {
      await page.evaluate((fns) => {
        fns.forEach(fn => document.querySelectorAll(
          `[data-fieldname="${fn}"] input, [data-fieldname="${fn}"] textarea, [data-fieldname="${fn}"] .control-value`
        ).forEach(el => { el.style.filter = 'blur(6px)'; }));
      }, opts.redact).catch(() => {});
      await page.waitForTimeout(300);
    }
    // blur nguyên khối phần tử (bảng con Links, sidebar tên NV...) theo CSS selector
    if (opts.redactBlocks) {
      await page.evaluate((sels) => {
        sels.forEach(s => document.querySelectorAll(s).forEach(el => { el.style.filter = 'blur(7px)'; }));
      }, opts.redactBlocks).catch(() => {});
      await page.waitForTimeout(300);
    }
    // mở section đang gập
    if (opts.expand) {
      await page.evaluate((lbl) => {
        document.querySelectorAll('.section-head').forEach(h => {
          if (h.innerText && h.innerText.toLowerCase().includes(lbl.toLowerCase()) && h.classList.contains('collapsed')) h.click();
        });
      }, opts.expand).catch(() => {});
      await page.waitForTimeout(700);
    }
    // cuộn tới field
    if (opts.scrollTo) {
      await page.evaluate((f) => {
        const el = document.querySelector(`[data-fieldname="${f}"]`);
        if (el) el.scrollIntoView({ block: 'center' });
      }, opts.scrollTo).catch(() => {});
      await page.waitForTimeout(700);
    }

    await page.screenshot({ path: path.join(OUT, name) });
    console.log('  ✓', name);
  } catch (e) {
    console.log('  ✗', name, '—', e.message);
  } finally {
    await browser.close().catch(() => {});
  }
}

(async () => {
  await shoot('01-dp-partner.png', '/app/dp-partner/Viettel Post');
  await shoot('02-dp-account.png', '/app/dp-partner-account/' + encodeURIComponent(ACCOUNT),
    { redact: ['username', 'password', 'api_token', 'api_secret'] });
  await shoot('03-extra-params.png', '/app/dp-partner-account/' + encodeURIComponent(ACCOUNT),
    { redact: ['username', 'password', 'api_token', 'api_secret'], expand: 'Extra', scrollTo: 'extra_params' });
  await shoot('04-pickup-list.png', '/app/dp-pickup-point/view/list',
    { redactPhones: true });
  await shoot('05-pickup-default.png', '/app/dp-pickup-point/' + encodeURIComponent(PICKUP_DEFAULT),
    { redact: ['phone', 'address', 'point_name'], scrollTo: 'is_default' });
  const ADDR_REDACT = ['address_title', 'address_line1', 'address_line2', 'city', 'state', 'county',
    'custom_address_text', 'custom_ward_name', 'phone', 'email_id', 'custom_geocoding', 'fsm_geocoded_latitude', 'fsm_geocoded_longitude'];
  const ADDR_BLOCKS = ['[data-fieldname="links"]', '.form-sidebar'];  // bảng Links (tên khách) + sidebar (tên NV)
  await shoot('06-address-toolbar.png', '/app/address/' + encodeURIComponent(ADDRESS),
    { redact: ADDR_REDACT, redactBlocks: ADDR_BLOCKS });
  await shoot('07-address-vtp-fields.png', '/app/address/' + encodeURIComponent(ADDRESS),
    { redact: ADDR_REDACT, redactBlocks: ADDR_BLOCKS, expand: 'Viettel Post', scrollTo: 'vtp_province_id' });
  await shoot('08-shipment-new.png', '/app/dp-shipment/new');
  console.log('Xong. Ảnh ở', OUT);
})();
