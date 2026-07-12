/* video_duyet_ot.js — quay 4 đoạn video hướng dẫn DUYỆT ĐƠN LÀM THÊM + CÀI ĐẶT
   THÔNG BÁO (góc nhìn người duyệt) từ APP THẬT. Khuôn video_overtime.js.
   Output: <outdir>/segNN.webm (+ poster.png) → build_video.sh ghép TTS + mp4.
   Chạy: node help/cobe_erp_documents/_tools/video_duyet_ot.js <outdir> */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = process.argv[2] || '/tmp/video_duyet_ot';
fs.mkdirSync(OUT, { recursive: true });
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'manager@tgdg.com', user_fullname:'Nguyễn Văn Quản',
  employee:'HR-EMP-010', employee_name:'Nguyễn Văn Quản', user_roles:['Employee','Leave Approver'],
  inbox_access:true, is_technician:false, wiki_url:'' };
const INFO = { employee_name:'Nguyễn Văn Quản', employee_id:'HR-EMP-010', next_log_type:'IN', checkins:[],
  phone_registered:true, wfh_today:{active:false}, feature_flags:{} };

const OT_ITEM = { doctype:'HR Overtime Request', name:'HR-OTR-2026-00018', employee:'HR-EMP-004', employee_name:'Phạm Thị Dung',
  state:'Pending Manager', summary:'Làm thêm 2026-07-15 · 17:30–19:30 (2h) · Tiền lương', reason:'Kiểm kê kho quý III',
  creation:'2026-07-12T08:30:00', can_forward:false, forwarded_to:null, forwarded_by:null, forwarded_by_name:null };
const OT_ITEM2 = { doctype:'HR Overtime Request', name:'HR-OTR-2026-00019', employee:'HR-EMP-005', employee_name:'Lê Văn Cường',
  state:'Pending Manager', summary:'Làm thêm 2026-07-14 · 18:00–21:00 (3h) · Nghỉ bù', reason:'Lắp máy cho khách buổi tối',
  creation:'2026-07-12T08:05:00', can_forward:false, forwarded_to:null, forwarded_by:null, forwarded_by_name:null };
const LEAVE_ITEM = { doctype:'Leave Application', name:'HR-LAP-2026-00021', employee:'HR-EMP-002', employee_name:'Trần Thị Bình',
  state:'Pending Manager', summary:'Phép năm · 20/07/2026 · 1 ngày', reason:'Việc gia đình',
  creation:'2026-07-12T07:30:00', can_forward:true, forwarded_to:null, forwarded_by:null, forwarded_by_name:null };

const NOTIFS = { notifications:[
  { name:'n1', subject:'Đơn làm thêm giờ mới — Phạm Thị Dung', email_content:'Ngày 2026-07-15 · 17:30–19:30 (2h) · quy đổi Tiền lương. Kiểm kê kho quý III',
    type:'Alert', document_type:'HR Overtime Request', document_name:'HR-OTR-2026-00018', read:0, creation:'2026-07-12T08:30:00', from_user:'a@tgdg.com' },
  { name:'n2', subject:'Chấm công 2026-07-11: 3 nhân viên cần chú ý', email_content:'• Dương Minh Cảnh — Quên chấm công cả ngày<br>• Lê Văn Cường — Quên check-out<br>• Phạm Thị Dung — Làm thêm sau giờ',
    type:'Alert', document_type:null, document_name:null, read:0, creation:'2026-07-11T21:10:00', from_user:null },
  { name:'n3', subject:'Đơn nghỉ phép mới — Trần Thị Bình', email_content:'Phép năm · 2026-07-20 → 2026-07-20 (1 ngày). Việc gia đình',
    type:'Alert', document_type:'Leave Application', document_name:'HR-LAP-2026-00021', read:1, creation:'2026-07-12T07:30:00', from_user:'b@tgdg.com' },
] };
const PREFS = { prefs:{ new_approval:true, daily_digest:true, instant_warning:false }, is_approver:true };

const CLOCK = '2026-07-12T09:00:00';

const segments = [
  // seg1: inbox Cần duyệt — 2 đơn OT + 1 đơn nghỉ
  { name:'seg1', route0:'/approvals', state:{ items:[OT_ITEM, OT_ITEM2, LEAVE_ITEM] },
    actions: async (page) => {
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(OUT,'poster.png') });
      await page.waitForTimeout(2000);
    } },
  // seg2: mở chi tiết đơn OT → bấm Duyệt → toast → list còn lại
  { name:'seg2', route0:'/approvals', state:{ items:[OT_ITEM, OT_ITEM2, LEAVE_ITEM] },
    act(st){ st.items = st.items.filter(i => i.name !== 'HR-OTR-2026-00018'); return { success:true }; },
    actions: async (page) => {
      await page.waitForTimeout(2500);
      await page.locator('.ant-card', { hasText:'Phạm Thị Dung' }).first().click();
      await page.waitForSelector('.ant-modal-content', { timeout:5000 });
      await page.waitForTimeout(4500);                       // đọc chi tiết
      await page.locator('.ant-modal button', { hasText:'Duyệt' }).first().click();
      await page.waitForTimeout(5000);                       // toast xử lý → thành công → list refresh
    } },
  // seg3: trang Thông báo — có bản tin digest cuối ngày, mở xem
  { name:'seg3', route0:'/notifications', state:{ items:[OT_ITEM2, LEAVE_ITEM] },
    actions: async (page) => {
      await page.waitForTimeout(2500);
      await page.locator('.ant-list-item', { hasText:'3 nhân viên cần chú ý' }).first().click();
      await page.waitForSelector('.ant-modal-content', { timeout:5000 });
      await page.waitForTimeout(4500);
    } },
  // seg4: nút Cài đặt → 3 công tắc, gạt thử "Cảnh báo tức thì"
  { name:'seg4', route0:'/notifications', state:{ items:[OT_ITEM2, LEAVE_ITEM] },
    actions: async (page) => {
      await page.waitForTimeout(2000);
      await page.locator('button', { hasText:'Cài đặt' }).first().click();
      await page.waitForSelector('.ant-modal-content', { timeout:5000 });
      await page.waitForTimeout(3000);
      await page.locator('.ant-modal .ant-switch').nth(2).click();   // demo gạt công tắc
      await page.waitForTimeout(1500);
      await page.locator('.ant-modal .ant-switch').nth(2).click();
      await page.waitForTimeout(2500);
    } },
];

(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  for (const s of segments) {
    const ctx = await browser.newContext({ viewport:{width:390,height:844}, locale:'vi-VN',
      recordVideo:{ dir:OUT, size:{width:390,height:844} } });
    await ctx.addInitScript((b)=>{ Object.assign(window,b);
      try{ localStorage.setItem('mw_guide_seen_v1','1'); }catch(e){} }, BOOT);
    const page = await ctx.newPage();
    await page.clock.install({ time: new Date(CLOCK) });
    const st = s.state;
    await page.route('**/*', async (route) => {
      const u = new URL(route.request().url()); const p = u.pathname;
      if (u.hostname==='localhost') {
        if (p.startsWith('/api/method/')) {
          if (p.includes('approval.act')) {
            await new Promise(r=>setTimeout(r,1500));
            return route.fulfill(api(s.act ? s.act(st) : { success:true }));
          }
          if (p.includes('approval.get_my_pending_approvals')) return route.fulfill(api({ is_approver:true, items: st.items }));
          if (p.includes('approval.get_pending_count')) return route.fulfill(api({ count: st.items.length }));
          if (p.includes('notification.list_my_notifications')) return route.fulfill(api(NOTIFS));
          if (p.includes('notification.get_unread_count')) return route.fulfill(api({unread:2}));
          if (p.includes('notification.get_my_notification_prefs')) return route.fulfill(api(PREFS));
          if (p.includes('notification.set_my_notification_prefs')) return route.fulfill(api({success:true}));
          if (p.includes('notification.mark_read')) return route.fulfill(api({success:true}));
          if (p.includes('attendance.get_attendance_info')) return route.fulfill(api(INFO));
          if (p.includes('push.get_push_config')) return route.fulfill(api({enabled:false}));
          return route.fulfill(api(null));
        }
        if (p.startsWith('/assets/hr_for_cobegroup/')) { const f=path.join(PUBLIC,p.replace('/assets/hr_for_cobegroup/','')); return fs.existsSync(f)?route.fulfill({path:f}):route.fulfill({status:404,body:''}); }
        if (p.startsWith('/my-workspace')) return route.fulfill({ contentType:'text/html', body:indexHtml });
        return route.fulfill({ status:204, body:'' });
      }
      return route.continue();
    });
    await page.goto('http://localhost/my-workspace' + s.route0, { waitUntil:'domcontentloaded' }).catch(()=>{});
    await s.actions(page);
    await ctx.close();
    const v = await page.video().path();
    fs.renameSync(v, path.join(OUT, s.name + '.webm'));
    console.log('recorded', s.name);
  }
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
