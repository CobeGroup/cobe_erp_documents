/* video_overtime.js — quay 5 đoạn video hướng dẫn XIN LÀM THÊM GIỜ (OT)
   từ APP THẬT (render React + mock API + freeze giờ). Khuôn video_leave.js.
   Output: <outdir>/segNN.webm (+ poster.png) → build_video.sh ghép TTS + mp4.
   Chạy: node help/cobe_erp_documents/_tools/video_overtime.js <outdir>
   UI đổi → build lại PWA rồi chạy lại. */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = process.argv[2] || '/tmp/video_overtime';
fs.mkdirSync(OUT, { recursive: true });
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'a@tgdg.com', user_fullname:'Nguyễn Văn An',
  employee:'HR-EMP-001', employee_name:'Nguyễn Văn An', user_roles:['Employee'], inbox_access:false, is_technician:false, wiki_url:'' };
const INFO = { employee_name:'Nguyễn Văn An', employee_id:'HR-EMP-001', next_log_type:'IN', checkins:[],
  phone_registered:true, wfh_today:{active:false}, feature_flags:{} };

const OT_DONE = { name:'HR-OTR-2026-00012', ot_date:'2026-07-08', from_time:'18:00', to_time:'20:00', expected_hours:2,
  payout_type:'Tiền lương', reason:'Chốt báo cáo tháng 6', status:'Approved', granted_hours:2, has_attendance:true };
const OT_COMP = { name:'HR-OTR-2026-00015', ot_date:'2026-07-10', from_time:'18:00', to_time:'21:00', expected_hours:3,
  payout_type:'Nghỉ bù', reason:'Lắp máy cho khách buổi tối', status:'Approved', granted_hours:0, has_attendance:false };
const OT_NEW = { name:'HR-OTR-2026-00018', ot_date:'2026-07-15', from_time:'17:30', to_time:'19:30', expected_hours:2,
  payout_type:'Tiền lương', reason:'Kiểm kê kho quý III', status:'Pending', granted_hours:0, has_attendance:false };

const CLOCK = '2026-07-12T09:00:00';

// Cell của Ant picker hay nằm trong dropdown tràn viewport → dispatchEvent thay click thật.
async function pickDate(page, title) {
  await page.locator('.ant-modal .ant-picker').first().click();
  await page.waitForSelector('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden)', { timeout:4000 });
  await page.waitForTimeout(700);
  const dd = page.locator('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden)').last();
  await dd.locator(`.ant-picker-cell[title="${title}"] .ant-picker-cell-inner`).first().dispatchEvent('click');
  await page.waitForTimeout(700);
}
async function pickTime(page, hour, minute) {
  await page.waitForSelector('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden) .ant-picker-time-panel-column', { timeout:4000 });
  await page.waitForTimeout(600);
  const dd = page.locator('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden)').last();
  const cols = dd.locator('.ant-picker-time-panel-column');
  await cols.nth(0).locator('.ant-picker-time-panel-cell-inner', { hasText: new RegExp(`^${hour}$`) }).first().dispatchEvent('click');
  await page.waitForTimeout(500);
  await cols.nth(1).locator('.ant-picker-time-panel-cell-inner', { hasText: new RegExp(`^${minute}$`) }).first().dispatchEvent('click');
  await page.waitForTimeout(500);
  await dd.locator('.ant-picker-ok button').dispatchEvent('click');
  await page.waitForTimeout(700);
}
async function openForm(page) {
  await page.locator('[title="Tạo đơn làm thêm"]').click();
  await page.waitForSelector('.ant-modal', { timeout:8000 });
  await page.waitForTimeout(1500);
}
async function fillForm(page, payout) {
  await pickDate(page, '2026-07-15');
  await page.locator('.ant-modal .ant-picker').nth(1).click();
  await pickTime(page, '17', '30');
  await pickTime(page, '19', '30');
  if (payout) {
    await page.locator('.ant-modal .ant-radio-button-wrapper', { hasText: payout }).click();
    await page.waitForTimeout(1200);
  }
  await page.locator('.ant-modal textarea').fill(payout === 'Nghỉ bù' ? 'Lắp máy cho khách buổi tối' : 'Kiểm kê kho quý III');
  await page.waitForTimeout(1200);
}

/* Mỗi segment = 1 context quay riêng; state đóng trong closure để mock "sống". */
const segments = [
  { name:'seg1', state:{ reqs:[OT_COMP, OT_DONE] },
    actions: async (page) => {
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(OUT,'poster.png') });
      await page.waitForTimeout(2500);
    } },
  { name:'seg2', state:{ reqs:[OT_COMP, OT_DONE] },
    create(st){ st.reqs=[OT_NEW, ...st.reqs];
      return { success:true, name:OT_NEW.name, expected_hours:2 }; },
    actions: async (page) => {
      await page.waitForTimeout(2000);
      await openForm(page);
      await fillForm(page, null);
      await page.getByRole('button', { name:'Gửi đơn' }).click();
      await page.waitForTimeout(4000);                       // toast + list có đơn "Chờ duyệt"
    } },
  { name:'seg3', state:{ reqs:[OT_NEW, OT_COMP, OT_DONE] },
    actions: async (page) => {
      await page.waitForTimeout(2000);
      await openForm(page);
      await page.locator('.ant-modal .ant-radio-button-wrapper', { hasText:'Nghỉ bù' }).click();
      await page.waitForTimeout(4000);                       // hint đổi sang giải thích nghỉ bù
    } },
  { name:'seg4', state:{ reqs:[OT_NEW, OT_COMP, OT_DONE] },
    actions: async (page) => {
      await page.waitForTimeout(2000);
      await page.locator('.ant-list-item', { hasText:'Chốt báo cáo tháng 6' }).first().click();
      await page.waitForSelector('.ant-modal-content', { timeout:5000 });
      await page.waitForTimeout(4500);                       // chi tiết: đã ghi nhận 2h
    } },
  { name:'seg5', state:{ reqs:[OT_NEW, OT_COMP, OT_DONE] },
    actions: async (page) => {
      await page.waitForTimeout(4500);
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
          if (p.includes('overtime.get_my_overtime_requests')) return route.fulfill(api({ requests: st.reqs }));
          if (p.includes('overtime.create_overtime_request')) {
            await new Promise(r=>setTimeout(r,800));
            return route.fulfill(api(s.create ? s.create(st) : { success:true, name:'X', expected_hours:2 }));
          }
          if (p.includes('attendance.get_attendance_info')) return route.fulfill(api(INFO));
          if (p.includes('approval.get_pending_count')) return route.fulfill(api({count:0}));
          if (p.includes('notification.get_unread_count')) return route.fulfill(api({unread:0}));
          if (p.includes('push.get_push_config')) return route.fulfill(api({enabled:false}));
          return route.fulfill(api(null));
        }
        if (p.startsWith('/assets/hr_for_cobegroup/')) { const f=path.join(PUBLIC,p.replace('/assets/hr_for_cobegroup/','')); return fs.existsSync(f)?route.fulfill({path:f}):route.fulfill({status:404,body:''}); }
        if (p.startsWith('/my-workspace')) return route.fulfill({ contentType:'text/html', body:indexHtml });
        return route.fulfill({ status:204, body:'' });
      }
      return route.continue();
    });
    await page.goto('http://localhost/my-workspace/overtime', { waitUntil:'domcontentloaded' }).catch(()=>{});
    await s.actions(page);
    await ctx.close();
    const v = await page.video().path();
    fs.renameSync(v, path.join(OUT, s.name + '.webm'));
    console.log('recorded', s.name);
  }
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
