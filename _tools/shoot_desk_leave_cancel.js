/* shoot_desk_leave_cancel.js — ảnh Desk THẬT cho doc "Huỷ đơn nghỉ đã duyệt".
   Gồm: nút Huỷ trên đơn đã duyệt, hộp thoại nhập lý do, và đơn sau khi huỷ (ô "Lý do huỷ").

   Chạy:
     1) bench PHẢI đang chạy ở cổng 8002 — kiểm trước bằng `ss -ltnp | grep 8002`,
        có rồi thì DÙNG LUÔN, đừng start bench thứ hai (tranh cổng, giết lẫn nhau).
     2) SID=$(bench --site cobe.cc browse --user Administrator | grep -o 'sid=[^ ]*' | cut -d= -f2)
        SID=$SID LA=HR-LAP-2026-00234 node help/cobe_erp_documents/_tools/shoot_desk_leave_cancel.js

   Đơn dùng để chụp là ĐƠN DEMO của "Demo Nhân Viên" (HR-EMP-00197) — không chụp đơn
   người thật, ảnh doc là public. Đơn demo GIỮ LẠI sau khi chụp.

   4 bẫy screenshot Desk headless (mỗi cái ra ẢNH TRẮNG), đã tránh trong file này:
   fullPage:true; dùng lại 1 browser cho nhiều goto; phím Escape; .remove() phần tử desk.
*/
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/guide/huy-don';
const BASE = 'http://cobe.cc:8002';
const SID = process.env.SID;
const LA = process.env.LA || 'HR-LAP-2026-00234';
const REASON = 'Nhân viên báo đi làm lại, không nghỉ nữa';

if (!SID) { console.error('Thiếu SID — xem hướng dẫn ở đầu file.'); process.exit(1); }

async function open() {
  // Browser MỚI cho mỗi lần goto: dùng lại page/browser cho nhiều goto → ảnh trắng.
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'vi-VN' });
  await ctx.addCookies([{ name: 'sid', value: SID, domain: 'cobe.cc', path: '/' }]);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/app/leave-application/${LA}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  return { browser, page };
}

const shot = async (page, name) => {
  fs.mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, name + '.png') }); // viewport, KHÔNG fullPage
  console.log('shot', name);
};

(async () => {
  // 08 — đơn đã duyệt, thấy nút Huỷ ở thanh trên
  {
    const { browser, page } = await open();
    await shot(page, '08-desk-don-da-duyet');
    await browser.close();
  }

  // 09 + 10 — bấm Huỷ → xác nhận → hộp thoại lý do → huỷ xong
  {
    const { browser, page } = await open();

    await page.locator('.page-actions button', { hasText: /^\s*(Hủy|Huỷ|Cancel)\s*$/ }).first().click();
    await page.waitForTimeout(1500);

    // Frappe hỏi "Permanently Cancel …?" trước, rồi form script mới mở ô lý do.
    const yes = page.locator('.modal.show .btn-primary', { hasText: /Yes|Có/ }).first();
    if (await yes.count()) { await yes.click(); await page.waitForTimeout(2500); }

    await page.waitForSelector('.modal.show .modal-title', { timeout: 15000 });
    await page.waitForTimeout(1200);
    await shot(page, '09-desk-hop-thoai-ly-do');

    await page.locator('.modal.show [data-fieldname="reason"] textarea').first().fill(REASON);
    await page.waitForTimeout(600);
    await shot(page, '10-desk-da-nhap-ly-do');

    await page.locator('.modal.show .btn-primary', { hasText: /Huỷ đơn|Hủy đơn/ }).first().click();
    await page.waitForTimeout(6000);
    await browser.close();
  }

  // 11 — đơn sau khi huỷ: trạng thái Đã hủy + ô "Lý do huỷ" hiện ra
  {
    const { browser, page } = await open();
    // Ô lý do nằm trong section "Chuyển duyệt (Forward)" đang thu gọn → mở ra cho thấy.
    await page.evaluate(() => {
      const f = window.cur_frm;
      if (f) { f.scroll_to_field?.('custom_cancel_reason'); }
    }).catch(() => {});
    await page.waitForTimeout(2500);
    await shot(page, '11-desk-sau-khi-huy');
    await browser.close();
  }

  console.log('\nXong →', OUT);
})();
