/* shoot_fsmnext.js — chụp Desk FSMNext cho FSMNext-Quy-Trinh-Dich-Vu.md + FSMNext-Xu-Ly-Su-Co.md

   Ảnh xuất ra users/images/fsm/:
     01-wo-list.png          — danh sách Phiếu công việc, cột Status Category
     02-wo-form-new.png      — WO đang New (WO-11432) + nút Close / tạo Service Appointment
     03-wo-blocker.png       — ⭐ thử chuyển WO sang Completed → hộp thoại liệt kê lý do bị chặn
     04-sa-form.png          — Lịch hẹn đã Completed (SA-013137) gắn về WO cha
     05-sa-change-status.png — nhóm nút "Change Status" của Lịch hẹn
     06-scheduler-log.png    — ⭐ FS Scheduler Log: dòng Skipped + lý do (grace / blockers)
     07-fsm-settings.png     — FSM Settings: cờ auto-complete + grace days + require SA/SO

   DEMO DATA: tạo bằng `bench --site cobe.cc execute frappe._fsm_demo_tmp.run`
     WO-11432 New (không có SA) · WO-11433 New (SA xong, chờ ân hạn) · WO-11434 In Progress
     Khách "DEMO Cửa hàng Nước sạch Minh An" — hư cấu hoàn toàn, KHÔNG dùng dữ liệu khách thật.

   Chạy:
     SITE=http://cobe.cc:8002 FRAPPE_USER=demo-fsm@tgdg.com FRAPPE_PASS='FsmDemo#2026' \
       node help/cobe_erp_documents/_tools/shoot_fsmnext.js
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');

const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/fsm';
const SITE = (process.env.SITE || 'http://cobe.cc:8002').replace(/\/$/, '');
const USER = process.env.FRAPPE_USER || '';
const PASS = process.env.FRAPPE_PASS || '';

const WO_NEW = process.env.WO_NEW || 'WO-11432';   // New, không có SA
const SA_DONE = process.env.SA_DONE || 'SA-013137'; // Completed
// Khách hàng DEMO (hư cấu) — dùng để lọc mọi danh sách, tránh lộ dữ liệu khách thật
const DEMO_WOS = (process.env.DEMO_WOS || 'WO-11432,WO-11433,WO-11434').split(',');

if (!USER || !PASS) { console.error('Thiếu FRAPPE_USER / FRAPPE_PASS'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
const u = (s) => SITE + s;

// CHÚ Ý: KHÔNG ẩn .desk-alert — thông báo chặn hoàn thành WO hiện đúng ở dạng alert này.
const HIDE_CSS = `
  .onboarding-widget-box, .notifications-list,
  .form-tour-highlight, #frappe-web-notification { display:none !important; }
`;

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--host-resolver-rules=MAP cobe.cc 127.0.0.1'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'vi-VN' });
  const page = await ctx.newPage();
  page.setDefaultTimeout(30000);

  const shot = async (name, el) => {
    await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
    await page.waitForTimeout(600);
    const target = el || page;
    await target.screenshot({ path: path.join(OUT, name) });
    console.log('  ✓', name);
  };
  // Site local restore thiếu encryption key → bung modal "Failed to decrypt key ...".
  // Đó là rác của môi trường, phải đóng trước khi chụp.
  const dismissModals = async () => {
    for (let i = 0; i < 5; i++) {
      const m = await page.$('.modal.show');
      if (!m) break;
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(600);
    }
  };
  const goto = async (p) => {
    await page.goto(u(p), { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    await dismissModals();
    await page.waitForTimeout(400);
  };

  // ---- Đăng nhập ----
  await page.goto(u('/login'), { waitUntil: 'domcontentloaded' });
  await page.fill('#login_email', USER);
  await page.fill('#login_password', PASS);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
    page.click('button.btn-login'),
  ]);
  await page.waitForTimeout(2500);
  console.log('đã đăng nhập:', USER);

  // ---- 1. Danh sách WO ----
  // BẮT BUỘC lọc chỉ còn WO demo: danh sách không lọc sẽ lộ TÊN KHÁCH HÀNG THẬT
  // (cột Customer Name) — tuyệt đối không chụp toàn bộ list rồi đẩy lên repo public.
  // Lọc theo mã WO (không theo customer, vì user demo không có quyền đọc Customer).
  const idFilter = encodeURIComponent(JSON.stringify(['in', DEMO_WOS]));
  await goto(`/app/fs-work-order?name=${idFilter}`);
  await shot('01-wo-list.png');

  // ---- 2. Form WO đang New ----
  await goto(`/app/fs-work-order/${WO_NEW}`);
  await shot('02-wo-form-new.png');

  // ---- 3. ⭐ Thử đổi sang Completed → hộp thoại chặn ----
  try {
    // chờ form thật sự nạp xong (cur_frm sẵn sàng) rồi mới đặt trạng thái
    await page.waitForFunction(
      () => window.cur_frm && window.cur_frm.doc && window.cur_frm.doc.name,
      { timeout: 20000 },
    );
    await page.evaluate(() => cur_frm.set_value('work_order_status', 'Completed'));
    await page.waitForTimeout(1000);
    // WO đã submit → phải lưu bằng 'Update', không phải save thường
    page.evaluate(() => cur_frm.save(cur_frm.doc.docstatus === 1 ? 'Update' : undefined)).catch(() => {});
    // lý do bị chặn hiện ở modal HOẶC alert đỏ — chờ cái nào tới trước
    await page.waitForSelector('.modal.show, .desk-alert, .msgprint', { timeout: 25000 });
    await page.waitForTimeout(1500);
    await shot('03-wo-blocker.png');
    // đóng sạch modal, bỏ thay đổi để demo data giữ nguyên trạng thái New
    for (let i = 0; i < 4; i++) {
      if (!(await page.$('.modal.show'))) break;
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(700);
    }
  } catch (e) { console.warn('  ! bỏ qua ảnh blocker:', e.message); }

  // ---- 4. Form SA (goto sạch, không mang theo modal của bước trước) ----
  await goto(`/app/fs-service-appointment/${SA_DONE}`);
  await shot('04-sa-form.png');

  // ---- 5. Nhóm nút Change Status ----
  try {
    await page.waitForFunction(
      () => [...document.querySelectorAll('.page-actions button')]
        .some(b => b.innerText.includes('Change Status')),
      { timeout: 15000 },
    );
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('.page-actions button')]
        .find(x => x.innerText.includes('Change Status'));
      if (b) b.click();
    });
    await page.waitForTimeout(1800);
    await shot('05-sa-change-status.png');
    await page.keyboard.press('Escape').catch(() => {});
  } catch (e) { console.warn('  ! bỏ qua Change Status:', e.message); }

  // ---- 6. ⭐ FS Scheduler Log — danh sách ----
  await goto('/app/fs-scheduler-log?action=Skipped');
  await shot('06-scheduler-log.png');

  // ---- 6b. ⭐ Một bản ghi log: thấy rõ ô Reason ----
  await goto(`/app/fs-scheduler-log/${process.env.LOG_NO_SA || 'jj5v0om8jp'}`);
  await shot('06b-scheduler-log-reason.png');

  // ---- 6c. Log kiểu "chưa qua thời gian ân hạn" ----
  await goto(`/app/fs-scheduler-log/${process.env.LOG_GRACE || 'jj99alo31p'}`);
  await shot('06c-scheduler-log-grace.png');

  // ---- 7. FSM Settings — tab Operations (chứa "Work Order Auto Complete & Validators") ----
  await goto('/app/fsm-settings');
  try {
    await page.evaluate(() => {
      const t = [...document.querySelectorAll('.form-tabs a, .nav-link')]
        .find(x => x.innerText.trim() === 'Operations');
      if (t) t.click();
    });
    await page.waitForTimeout(1800);
  } catch (e) { console.warn('  ! không mở được tab Operations:', e.message); }
  await shot('07-fsm-settings.png');

  await browser.close();
  console.log('\nXong. Ảnh ở:', OUT);
})().catch((e) => { console.error('LỖI:', e); process.exit(1); });
