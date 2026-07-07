/* video_leave.js — quay 5 đoạn video hướng dẫn XIN NGHỈ PHÉP & NGHỈ BÙ
   từ APP THẬT (render React + mock API + freeze giờ). Khuôn video_ktv.js.
   Output: <outdir>/segNN.webm (+ poster.png) → build_video.sh ghép TTS + mp4.
   Chạy: node help/cobe_erp_documents/_tools/video_leave.js <outdir>
   UI đổi → build lại PWA rồi chạy lại. */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = process.argv[2] || '/tmp/video_leave';
fs.mkdirSync(OUT, { recursive: true });
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'a@tgdg.com', user_fullname:'Nguyễn Văn An',
  employee:'HR-EMP-001', employee_name:'Nguyễn Văn An', user_roles:['Employee'], inbox_access:false, is_technician:false, wiki_url:'' };
const INFO = { employee_name:'Nguyễn Văn An', employee_id:'HR-EMP-001', next_log_type:'IN', checkins:[],
  phone_registered:true, wfh_today:{active:false}, feature_flags:{} };
const TYPES = { leave_types:[
  { name:'Phép năm', balance:7.5, max_leaves_allowed:12, leaves_taken:4.5, leaves_pending_approval:0, is_lwp:0, is_compensatory:0 },
  { name:'Nghỉ ốm', balance:3, max_leaves_allowed:5, leaves_taken:2, leaves_pending_approval:0, is_lwp:0, is_compensatory:0 },
  { name:'Nghỉ bù', balance:0, max_leaves_allowed:0, leaves_taken:2, leaves_pending_approval:0, is_lwp:0, is_compensatory:1 },
], employee:'HR-EMP-001' };
const OLD_APP = { name:'HR-LAP-2026-00012', leave_type:'Phép năm', from_date:'2026-06-20', to_date:'2026-06-20',
  total_leave_days:0.5, description:'Đi khám buổi sáng', status:'Open', workflow_state:'Submitted', docstatus:1,
  leave_approver:'manager@tgdg.com', posting_date:'2026-06-18', half_day:1, half_day_date:'2026-06-20', custom_half_day_session:'Sáng' };
const NEW_APP = { name:'HR-LAP-2026-00033', leave_type:'Phép năm', from_date:'2026-07-06', to_date:'2026-07-07',
  total_leave_days:2, description:'Về quê có việc gia đình', status:'Open', workflow_state:'Pending Manager', docstatus:0,
  leave_approver:'manager@tgdg.com', posting_date:'2026-07-02', half_day:0, half_day_date:null, custom_half_day_session:null };
const COMP_APP = { name:'HR-LAP-2026-00034', leave_type:'Nghỉ bù', from_date:'2026-07-03', to_date:'2026-07-03',
  total_leave_days:1, description:'Làm khuya lắp máy tới 23h đêm 01/07 — xin nghỉ bù', status:'Open',
  workflow_state:'Pending Manager', docstatus:0, leave_approver:'manager@tgdg.com', posting_date:'2026-07-02',
  half_day:0, half_day_date:null, custom_half_day_session:null };

const CLOCK = '2026-07-02T09:00:00';

// Ant RangePicker/DatePicker: mở picker thứ idx trong modal rồi click ô ngày theo title
async function pickDate(page, idx, title, twice=false) {
  await page.locator('.ant-modal .ant-picker').nth(idx).click();
  await page.waitForSelector('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden)', { timeout:4000 });
  await page.waitForTimeout(600);
  const cell = page.locator(`.ant-picker-dropdown:visible .ant-picker-cell[title="${title}"] .ant-picker-cell-inner`).first();
  await cell.click();
  if (twice) { await page.waitForTimeout(400); await cell.click(); }
  await page.waitForTimeout(700);
}
async function pickRange(page, idx, t1, t2) {
  await page.locator('.ant-modal .ant-picker').nth(idx).click();
  await page.waitForSelector('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden)', { timeout:4000 });
  await page.waitForTimeout(600);
  await page.locator(`.ant-picker-dropdown:visible .ant-picker-cell[title="${t1}"] .ant-picker-cell-inner`).first().click();
  await page.waitForTimeout(600);
  await page.locator(`.ant-picker-dropdown:visible .ant-picker-cell[title="${t2}"] .ant-picker-cell-inner`).first().click();
  await page.waitForTimeout(700);
}
async function openForm(page, leaveType) {
  await page.locator('[title="Tạo đơn xin nghỉ"]').click();
  await page.waitForSelector('.ant-modal', { timeout:8000 });
  await page.waitForTimeout(1500);
  await page.locator('.ant-modal .ant-select-selector').first().click();
  await page.waitForTimeout(800);
  await page.locator('.ant-select-item-option', { hasText: leaveType }).first().click();
  await page.waitForTimeout(1000);
}

/* Mỗi segment = 1 context quay riêng; state đóng trong closure để mock "sống". */
const segments = [
  { name:'seg1', state:{ apps:[OLD_APP] },
    actions: async (page) => {
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(OUT,'poster.png') });
      await page.waitForTimeout(2500);
    } },
  { name:'seg2', state:{ apps:[OLD_APP] },
    create(st){ st.apps=[NEW_APP, ...st.apps];
      return { success:true, name:NEW_APP.name, workflow_state:'Pending Manager', total_leave_days:2 }; },
    actions: async (page) => {
      await page.waitForTimeout(2000);
      await openForm(page, 'Phép năm');
      await pickRange(page, 0, '2026-07-06', '2026-07-07');
      await page.locator('.ant-modal textarea').fill('Về quê có việc gia đình');
      await page.waitForTimeout(1200);
      await page.getByRole('button', { name:'Gửi đơn' }).click();
      await page.waitForTimeout(4000);                       // toast + list có đơn "Chờ Manager"
    } },
  { name:'seg3', state:{ apps:[NEW_APP, OLD_APP] },
    actions: async (page) => {
      await page.waitForTimeout(2000);
      await openForm(page, 'Phép năm');
      await pickDate(page, 0, '2026-07-06', true);           // đúng 1 ngày → from == to
      await page.locator('.ant-modal .ant-checkbox-input').first().check();
      await page.waitForTimeout(1200);
      await page.locator('.ant-modal .ant-radio-button-wrapper', { hasText:'Buổi sáng' }).click();
      await page.waitForTimeout(1000);
      await page.locator('.ant-modal textarea').fill('Đi khám buổi sáng');
      await page.waitForTimeout(3000);
    } },
  { name:'seg4', state:{ apps:[NEW_APP, OLD_APP] },
    create(st){ st.apps=[COMP_APP, ...st.apps];
      return { success:true, name:COMP_APP.name, workflow_state:'Pending Manager', total_leave_days:1 }; },
    actions: async (page) => {
      await page.waitForTimeout(2000);
      await openForm(page, 'Nghỉ bù');
      await pickDate(page, 0, '2026-07-01');                 // Ngày làm thêm để bù = hôm làm khuya
      await pickDate(page, 1, '2026-07-03', true);           // Khoảng ngày nghỉ = 1 ngày
      await page.locator('.ant-modal textarea').fill('Làm khuya lắp máy tới 23h đêm 01/07 — xin nghỉ bù');
      await page.waitForTimeout(1500);
      await page.getByRole('button', { name:'Gửi đơn' }).click();
      await page.waitForTimeout(4000);
    } },
  { name:'seg5', state:{ apps:[COMP_APP, NEW_APP, OLD_APP] },
    actions: async (page) => {
      await page.waitForTimeout(4000);
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
          if (p.includes('leave.get_leave_types_for_employee')) return route.fulfill(api(TYPES));
          if (p.includes('leave.get_my_leave_applications')) return route.fulfill(api({ applications: st.apps }));
          if (p.includes('leave.create_leave_application')) {
            await new Promise(r=>setTimeout(r,800));
            return route.fulfill(api(s.create ? s.create(st) : { success:true, name:'X' }));
          }
          if (p.includes('attendance.get_attendance_info')) return route.fulfill(api(INFO));
          if (p.includes('approval.get_pending_count')) return route.fulfill(api({count:0}));
          if (p.includes('push.get_push_config')) return route.fulfill(api({enabled:false}));
          return route.fulfill(api(null));
        }
        if (p.startsWith('/assets/hr_for_cobegroup/')) { const f=path.join(PUBLIC,p.replace('/assets/hr_for_cobegroup/','')); return fs.existsSync(f)?route.fulfill({path:f}):route.fulfill({status:404,body:''}); }
        if (p.startsWith('/my-workspace')) return route.fulfill({ contentType:'text/html', body:indexHtml });
        return route.fulfill({ status:204, body:'' });
      }
      return route.continue();
    });
    await page.goto('http://localhost/my-workspace/leave', { waitUntil:'domcontentloaded' }).catch(()=>{});
    await s.actions(page);
    await ctx.close();
    const v = await page.video().path();
    fs.renameSync(v, path.join(OUT, s.name + '.webm'));
    console.log('recorded', s.name);
  }
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
