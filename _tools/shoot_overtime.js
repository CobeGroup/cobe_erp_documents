/* shoot_overtime.js — chụp màn LÀM THÊM GIỜ (OT) + DUYỆT OT + CÀI ĐẶT THÔNG BÁO
   từ PWA build thật + mock API. Khuôn shoot_approvals.js.
   Output: users/images/guide/overtime/*.png
   Chạy: node help/cobe_erp_documents/_tools/shoot_overtime.js
   UI đổi → npm run build (PWA) rồi chạy lại. */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/guide/overtime';
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });
const CLOCK = '2026-07-12T09:00:00';

// ---- Boot NHÂN VIÊN (trang /overtime) ----
const BOOT_NV = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'a@tgdg.com', user_fullname:'Nguyễn Văn An',
  employee:'HR-EMP-001', employee_name:'Nguyễn Văn An', user_roles:['Employee'], inbox_access:false, is_technician:false, wiki_url:'' };
const OT_LIST = { requests:[
  { name:'HR-OTR-2026-00018', ot_date:'2026-07-15', from_time:'17:30', to_time:'19:30', expected_hours:2,
    payout_type:'Tiền lương', reason:'Kiểm kê kho quý III', status:'Pending', granted_hours:0, has_attendance:false },
  { name:'HR-OTR-2026-00015', ot_date:'2026-07-10', from_time:'18:00', to_time:'21:00', expected_hours:3,
    payout_type:'Nghỉ bù', reason:'Lắp máy cho khách buổi tối', status:'Approved', granted_hours:0, has_attendance:false },
  { name:'HR-OTR-2026-00012', ot_date:'2026-07-08', from_time:'18:00', to_time:'20:00', expected_hours:2,
    payout_type:'Tiền lương', reason:'Chốt báo cáo tháng 6', status:'Approved', granted_hours:2, has_attendance:true },
  { name:'HR-OTR-2026-00009', ot_date:'2026-07-01', from_time:'18:00', to_time:'19:00', expected_hours:1,
    payout_type:'Tiền lương', reason:'Họp với đối tác nước ngoài lệch múi giờ', status:'Rejected', granted_hours:0, has_attendance:false },
] };
const MOCKS_NV = {
  'overtime.get_my_overtime_requests': OT_LIST,
  'attendance.get_attendance_info': { employee_name:'Nguyễn Văn An', employee_id:'HR-EMP-001', next_log_type:'IN', checkins:[], phone_registered:true, wfh_today:{active:false}, feature_flags:{} },
  'approval.get_pending_count': {count:0},
  'notification.get_unread_count': {unread:0},
  'push.get_push_config': {enabled:false},
};

// ---- Boot NGƯỜI DUYỆT (trang /approvals + /notifications) ----
const BOOT_MGR = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'manager@tgdg.com', user_fullname:'Nguyễn Văn Quản',
  employee:'HR-EMP-010', employee_name:'Nguyễn Văn Quản', user_roles:['Employee','Leave Approver'],
  inbox_access:true, is_technician:false, wiki_url:'' };
const PENDING = { is_approver:true, items:[
  { doctype:'HR Overtime Request', name:'HR-OTR-2026-00018', employee:'HR-EMP-004', employee_name:'Phạm Thị Dung',
    state:'Pending Manager', summary:'Làm thêm 2026-07-15 · 17:30–19:30 (2h) · Tiền lương', reason:'Kiểm kê kho quý III',
    creation:'2026-07-12T08:30:00', can_forward:false, forwarded_to:null, forwarded_by:null, forwarded_by_name:null },
  { doctype:'HR Overtime Request', name:'HR-OTR-2026-00019', employee:'HR-EMP-005', employee_name:'Lê Văn Cường',
    state:'Pending Manager', summary:'Làm thêm 2026-07-14 · 18:00–21:00 (3h) · Nghỉ bù', reason:'Lắp máy cho khách buổi tối',
    creation:'2026-07-12T08:05:00', can_forward:false, forwarded_to:null, forwarded_by:null, forwarded_by_name:null },
  { doctype:'Leave Application', name:'HR-LAP-2026-00021', employee:'HR-EMP-002', employee_name:'Trần Thị Bình',
    state:'Pending Manager', summary:'Phép năm · 20/07/2026 · 1 ngày', reason:'Việc gia đình',
    creation:'2026-07-12T07:30:00', can_forward:true, forwarded_to:null, forwarded_by:null, forwarded_by_name:null },
] };
const NOTIFS = { notifications:[
  { name:'n1', subject:'Đơn làm thêm giờ mới — Phạm Thị Dung', email_content:'Ngày 2026-07-15 · 17:30–19:30 (2h) · quy đổi Tiền lương. Kiểm kê kho quý III',
    type:'Alert', document_type:'HR Overtime Request', document_name:'HR-OTR-2026-00018', read:0, creation:'2026-07-12T08:30:00', from_user:'a@tgdg.com' },
  { name:'n2', subject:'Chấm công 2026-07-11: 3 nhân viên cần chú ý', email_content:'• Dương Minh Cảnh — Quên chấm công cả ngày\n• Lê Văn Cường — Quên check-out\n• Phạm Thị Dung — Làm thêm sau giờ',
    type:'Alert', document_type:null, document_name:null, read:0, creation:'2026-07-11T21:10:00', from_user:null },
  { name:'n3', subject:'Đơn nghỉ phép mới — Trần Thị Bình', email_content:'Phép năm · 2026-07-20 → 2026-07-20 (1 ngày). Việc gia đình',
    type:'Alert', document_type:'Leave Application', document_name:'HR-LAP-2026-00021', read:1, creation:'2026-07-12T07:30:00', from_user:'b@tgdg.com' },
] };
const MOCKS_MGR = {
  'approval.get_my_pending_approvals': PENDING,
  'approval.get_pending_count': {count:3},
  'notification.list_my_notifications': NOTIFS,
  'notification.get_unread_count': {unread:2},
  'notification.get_my_notification_prefs': { prefs:{ new_approval:true, daily_digest:true, instant_warning:false }, is_approver:true },
  'notification.set_my_notification_prefs': { success:true },
  'attendance.get_attendance_info': { employee_name:'Nguyễn Văn Quản', employee_id:'HR-EMP-010', next_log_type:'IN', checkins:[], phone_registered:true, wfh_today:{active:false}, feature_flags:{} },
  'push.get_push_config': {enabled:false},
};

async function setup(browser, boot, mocks, route0) {
  const ctx = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, locale:'vi-VN' });
  await ctx.addInitScript((b)=>{Object.assign(window,b);try{localStorage.setItem('mw_guide_seen_v1','1');}catch(e){}}, boot);
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date(CLOCK) });
  await page.route('**/*', async (route) => {
    const u = new URL(route.request().url()); const p = u.pathname;
    if (u.hostname==='localhost') {
      if (p.startsWith('/api/method/')) {
        if (p.includes('approval.act')) { await new Promise(r=>setTimeout(r,2000)); return route.fulfill(api({success:true})); }
        for (const k in mocks) if (p.includes(k)) return route.fulfill(api(mocks[k])); return route.fulfill(api(null));
      }
      if (p.startsWith('/assets/hr_for_cobegroup/')) { const f=path.join(PUBLIC,p.replace('/assets/hr_for_cobegroup/','')); return fs.existsSync(f)?route.fulfill({path:f}):route.fulfill({status:404,body:''}); }
      if (p.startsWith('/my-workspace')) return route.fulfill({ contentType:'text/html', body:indexHtml });
      return route.fulfill({ status:204, body:'' });
    }
    return route.continue();
  });
  await page.goto('http://localhost/my-workspace' + route0, { waitUntil:'domcontentloaded' }).catch(()=>{});
  await page.waitForTimeout(1800);
  return { ctx, page };
}

// Ant TimePicker (RangePicker HH:mm, minuteStep 15): chọn giờ + phút rồi OK
async function pickTime(page, hour, minute) {
  await page.waitForSelector('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden) .ant-picker-time-panel-column', { timeout:4000 });
  await page.waitForTimeout(400);
  const cols = page.locator('.ant-picker-dropdown:visible .ant-picker-time-panel-column');
  await cols.nth(0).locator('.ant-picker-time-panel-cell-inner', { hasText: new RegExp(`^${hour}$`) }).first().click();
  await page.waitForTimeout(300);
  await cols.nth(1).locator('.ant-picker-time-panel-cell-inner', { hasText: new RegExp(`^${minute}$`) }).first().click();
  await page.waitForTimeout(300);
  await page.locator('.ant-picker-dropdown:visible .ant-picker-ok button').click();
  await page.waitForTimeout(600);
}
async function pickDate(page, title) {
  await page.locator('.ant-modal .ant-picker').first().click();
  await page.waitForSelector('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden)', { timeout:4000 });
  await page.waitForTimeout(500);
  await page.locator(`.ant-picker-dropdown:visible .ant-picker-cell[title="${title}"] .ant-picker-cell-inner`).first().click();
  await page.waitForTimeout(600);
}
async function fillOtForm(page, payout) {
  await page.locator('[title="Tạo đơn làm thêm"]').click();
  await page.waitForSelector('.ant-modal', { timeout:8000 });
  await page.waitForTimeout(1000);
  await pickDate(page, '2026-07-11');   // khai SAU: ngày đã làm (clock=12/07, trong hạn 1 ngày)
  await page.locator('.ant-modal .ant-picker').nth(1).click();       // TimePicker range
  await pickTime(page, '17', '30');
  await pickTime(page, '19', '30');
  if (payout) { await page.locator('.ant-modal .ant-radio-button-wrapper', { hasText: payout }).click(); await page.waitForTimeout(600); }
  await page.locator('.ant-modal textarea').fill('Kiểm kê kho quý III');
  await page.waitForTimeout(800);
}

(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  fs.mkdirSync(OUT, { recursive:true });

  // 01 — trang Làm thêm giờ: danh sách đơn đủ trạng thái
  {
    const { ctx, page } = await setup(browser, BOOT_NV, MOCKS_NV, '/overtime');
    await page.screenshot({ path: path.join(OUT, '01-ot-list.png') });
    console.log('shot 01-ot-list'); await ctx.close();
  }
  // 02 — form tạo đơn (quy đổi Tiền lương, điền đủ)
  {
    const { ctx, page } = await setup(browser, BOOT_NV, MOCKS_NV, '/overtime');
    await fillOtForm(page, null);                                    // mặc định Tiền lương
    await page.screenshot({ path: path.join(OUT, '02-ot-form.png') });
    console.log('shot 02-ot-form'); await ctx.close();
  }
  // 03 — form với quy đổi NGHỈ BÙ (hint đổi)
  {
    const { ctx, page } = await setup(browser, BOOT_NV, MOCKS_NV, '/overtime');
    await fillOtForm(page, 'Nghỉ bù');
    await page.screenshot({ path: path.join(OUT, '03-ot-form-comp.png') });
    console.log('shot 03-ot-form-comp'); await ctx.close();
  }
  // 04 — chi tiết đơn ĐÃ DUYỆT + đã ghi nhận giờ
  {
    const { ctx, page } = await setup(browser, BOOT_NV, MOCKS_NV, '/overtime');
    await page.locator('.ant-list-item', { hasText:'Chốt báo cáo tháng 6' }).first().click();
    await page.waitForSelector('.ant-modal-content', { timeout:5000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, '04-ot-detail.png') });
    console.log('shot 04-ot-detail'); await ctx.close();
  }
  // 05 — inbox Cần duyệt có đơn Làm thêm giờ
  {
    const { ctx, page } = await setup(browser, BOOT_MGR, MOCKS_MGR, '/approvals');
    await page.screenshot({ path: path.join(OUT, '05-duyet-inbox.png') });
    console.log('shot 05-duyet-inbox'); await ctx.close();
  }
  // 06 — chi tiết đơn OT (nút Duyệt / Từ chối)
  {
    const { ctx, page } = await setup(browser, BOOT_MGR, MOCKS_MGR, '/approvals');
    await page.locator('.ant-card', { hasText:'Phạm Thị Dung' }).first().click();
    await page.waitForSelector('.ant-modal-content', { timeout:5000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, '06-duyet-detail.png') });
    console.log('shot 06-duyet-detail'); await ctx.close();
  }
  // 07 — Cài đặt thông báo (3 công tắc)
  {
    const { ctx, page } = await setup(browser, BOOT_MGR, MOCKS_MGR, '/notifications');
    await page.locator('button', { hasText:'Cài đặt' }).first().click();
    await page.waitForSelector('.ant-modal-content', { timeout:5000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, '07-notify-settings.png') });
    console.log('shot 07-notify-settings'); await ctx.close();
  }

  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
