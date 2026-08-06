/* shoot_leave_journey.js — chụp HÀNH TRÌNH một đơn nghỉ phép xuyên suốt NV → Manager → HR,
   bám một đơn duy nhất của "Trần Thị Bình" (Phép năm · 20/06/2026 · nửa ngày Sáng · "Đi khám buổi sáng").
   Chạy: node help/cobe_erp_documents/_tools/shoot_leave_journey.js
   UI đổi → npm run build (PWA) rồi chạy lại. */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/guide/hanhtrinh';
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

// ---- Nhân vật ----
const EMP_BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'binh@tgdg.com', user_fullname:'Trần Thị Bình',
  employee:'HR-EMP-002', employee_name:'Trần Thị Bình', user_roles:['Employee'], inbox_access:false, is_technician:false, wiki_url:'' };
const MGR_BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'manager@tgdg.com', user_fullname:'Nguyễn Văn Quản',
  employee:'HR-EMP-010', employee_name:'Nguyễn Văn Quản', user_roles:['Employee','Leave Approver','HR Manager'],
  inbox_access:true, is_technician:false, wiki_url:'' };

// ---- Đơn (cùng nội dung ở mọi bước) ----
const LEAVE_TYPES = (bal) => ({ leave_types:[
  { name:'Phép năm', balance:bal, max_leaves_allowed:12, leaves_taken:12-bal, leaves_pending_approval:0, is_lwp:0 },
  { name:'Nghỉ ốm', balance:3, max_leaves_allowed:5, leaves_taken:2, leaves_pending_approval:0, is_lwp:0 },
], employee:'HR-EMP-002' });
const APP = (state) => ({ applications:[
  { name:'HR-LAP-2026-00021', leave_type:'Phép năm', from_date:'2026-06-20', to_date:'2026-06-20',
    total_leave_days:0.5, description:'Đi khám buổi sáng', status:'Open', workflow_state:state,
    docstatus:(state==='Submitted'?1:0), leave_approver:'manager@tgdg.com', posting_date:'2026-06-18',
    half_day:1, half_day_date:'2026-06-20', custom_half_day_session:'Sáng' },
] });
const PENDING = (state) => ({ is_approver:true, items:[
  { doctype:'Leave Application', name:'HR-LAP-2026-00021', employee:'HR-EMP-002', employee_name:'Trần Thị Bình',
    state, summary:'Phép năm · 20/06/2026 · 0,5 ngày (Sáng)', reason:'Đi khám buổi sáng',
    creation:'2026-06-18T07:30:00', can_forward:true, forwarded_to:null, forwarded_by:null, forwarded_by_name:null },
] });

const CLOCK = '2026-06-18T08:00:00';

async function setup(browser, boot, mocks, route) {
  const ctx = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, locale:'vi-VN' });
  await ctx.addInitScript((b)=>{Object.assign(window,b);try{localStorage.setItem('mw_guide_seen_v1','1');}catch(e){}}, boot);
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date(CLOCK) });
  await page.route('**/*', async (r) => {
    const u = new URL(r.request().url()); const p = u.pathname;
    if (u.hostname==='localhost') {
      if (p.startsWith('/api/method/')) { for (const k in mocks) if (p.includes(k)) return r.fulfill(api(mocks[k])); return r.fulfill(api(null)); }
      if (p.startsWith('/assets/hr_for_cobegroup/')) { const f=path.join(PUBLIC,p.replace('/assets/hr_for_cobegroup/','')); return fs.existsSync(f)?r.fulfill({path:f}):r.fulfill({status:404,body:''}); }
      if (p.startsWith('/my-workspace')) return r.fulfill({ contentType:'text/html', body:indexHtml });
      return r.fulfill({ status:204, body:'' });
    }
    return r.continue();
  });
  await page.goto('http://localhost/my-workspace/' + route, { waitUntil:'domcontentloaded' }).catch(()=>{});
  await page.waitForTimeout(1500);
  return { ctx, page };
}

const EMP_COMMON = { 'attendance.get_attendance_info':{ employee_name:'Trần Thị Bình', employee_id:'HR-EMP-002', next_log_type:'IN', checkins:[], phone_registered:true, wfh_today:{active:false}, feature_flags:{} }, 'approval.get_pending_count':{count:0}, 'push.get_push_config':{enabled:false} };
const MGR_COMMON = { 'attendance.get_attendance_info':{ employee_name:'Nguyễn Văn Quản', employee_id:'HR-EMP-010', next_log_type:'IN', checkins:[], phone_registered:true, wfh_today:{active:false}, feature_flags:{} }, 'approval.get_pending_count':{count:1}, 'push.get_push_config':{enabled:false}, 'approval.get_forward_candidates':{candidates:[]} };

async function openCreateHalfDay(page) {
  await page.locator('[title="Tạo đơn xin nghỉ"]').click().catch(()=>{});
  await page.waitForSelector('.ant-modal', { timeout:5000 }).catch(()=>{});
  await page.waitForTimeout(600);
  await page.locator('.ant-modal .ant-select-selector').first().click().catch(()=>{});
  await page.waitForTimeout(400);
  await page.locator('.ant-select-item-option', { hasText:'Phép năm' }).first().click().catch(()=>{});
  await page.waitForTimeout(300);
  await page.locator('.ant-modal .ant-picker').first().click().catch(()=>{});
  await page.waitForSelector('.ant-picker-dropdown', { timeout:4000 }).catch(()=>{});
  await page.waitForTimeout(300);
  const cell = page.locator('.ant-picker-dropdown:visible .ant-picker-cell[title="2026-06-20"] .ant-picker-cell-inner').first();
  await cell.click().catch(()=>{}); await page.waitForTimeout(200); await cell.click().catch(()=>{});
  await page.waitForTimeout(300);
  await page.locator('.ant-modal textarea').fill('Đi khám buổi sáng').catch(()=>{});
  await page.waitForTimeout(200);
  await page.locator('.ant-modal .ant-checkbox-input').first().check().catch(()=>{});
  await page.waitForTimeout(400);
  await page.locator('.ant-modal .ant-radio-button-wrapper', { hasText:'Buổi sáng' }).click().catch(()=>{});
  await page.waitForTimeout(400);
}

async function openApprovalCard(page) {
  await page.locator('.ant-card', { hasText:'Trần Thị Bình' }).first().click().catch(()=>{});
  await page.waitForSelector('.ant-modal-content', { timeout:5000 }).catch(()=>{});
  await page.waitForTimeout(600);
}

(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  fs.mkdirSync(OUT, { recursive:true });

  // J1 — NV tạo đơn (form nửa ngày)
  { const { ctx, page } = await setup(browser, EMP_BOOT,
      { ...EMP_COMMON, 'leave.get_leave_types_for_employee':LEAVE_TYPES(7.5), 'leave.get_my_leave_applications':APP('Pending Manager') }, 'leave');
    await openCreateHalfDay(page);
    await page.screenshot({ path: path.join(OUT, 'j1-nv-tao-don.png') }); console.log('shot j1'); await ctx.close(); }

  // J2 — Đơn vào danh sách NV: "Chờ trưởng bộ phận"
  { const { ctx, page } = await setup(browser, EMP_BOOT,
      { ...EMP_COMMON, 'leave.get_leave_types_for_employee':LEAVE_TYPES(7.5), 'leave.get_my_leave_applications':APP('Pending Manager') }, 'leave');
    await page.screenshot({ path: path.join(OUT, 'j2-cho-manager.png') }); console.log('shot j2'); await ctx.close(); }

  // J3 — Trưởng bộ phận mở đơn trong "Cần duyệt" → Duyệt (Trưởng bộ phận)
  { const { ctx, page } = await setup(browser, MGR_BOOT,
      { ...MGR_COMMON, 'approval.get_my_pending_approvals':PENDING('Pending Manager') }, 'approvals');
    await openApprovalCard(page);
    await page.screenshot({ path: path.join(OUT, 'j3-manager-duyet.png') }); console.log('shot j3'); await ctx.close(); }

  // J4 — HR mở đơn (đã qua trưởng bộ phận) → Duyệt (HR)
  { const { ctx, page } = await setup(browser, MGR_BOOT,
      { ...MGR_COMMON, 'approval.get_my_pending_approvals':PENDING('Manager Approved') }, 'approvals');
    await openApprovalCard(page);
    await page.screenshot({ path: path.join(OUT, 'j4-hr-duyet.png') }); console.log('shot j4'); await ctx.close(); }

  // J5 — NV thấy đơn "Đã được duyệt" + số dư giảm 0,5
  { const { ctx, page } = await setup(browser, EMP_BOOT,
      { ...EMP_COMMON, 'leave.get_leave_types_for_employee':LEAVE_TYPES(7.0), 'leave.get_my_leave_applications':APP('Submitted') }, 'leave');
    await page.screenshot({ path: path.join(OUT, 'j5-da-duyet.png') }); console.log('shot j5'); await ctx.close(); }

  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
