/* shoot_leave.js — chụp màn NGHỈ PHÉP (gồm form nửa ngày) từ PWA build thật + mock API.
   Chạy: node help/cobe_erp_documents/_tools/shoot_leave.js
   UI đổi → npm run build (PWA) rồi chạy lại. */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/guide/nhanvien';
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'a@tgdg.com', user_fullname:'Nguyễn Văn A',
  employee:'HR-EMP-001', employee_name:'Nguyễn Văn A', user_roles:['Employee'], inbox_access:false, is_technician:false, wiki_url:'' };
const INFO = { employee_name:'Nguyễn Văn A', employee_id:'HR-EMP-001', next_log_type:'IN', checkins:[],
  phone_registered:true, wfh_today:{active:false}, feature_flags:{ enable_selfie_capture:true } };

const LEAVE_TYPES = { leave_types:[
  { name:'Phép năm', balance:7.5, max_leaves_allowed:12, leaves_taken:4.5, leaves_pending_approval:0, is_lwp:0 },
  { name:'Nghỉ ốm', balance:3, max_leaves_allowed:5, leaves_taken:2, leaves_pending_approval:0, is_lwp:0 },
  { name:'Leave Without Pay', balance:0, max_leaves_allowed:0, leaves_taken:0, leaves_pending_approval:0, is_lwp:1 },
], employee:'HR-EMP-001' };

const APPS = { applications:[
  { name:'HR-LAP-2026-00012', leave_type:'Phép năm', from_date:'2026-06-20', to_date:'2026-06-20',
    total_leave_days:0.5, description:'Đi khám buổi sáng', status:'Open', workflow_state:'Submitted',
    docstatus:1, leave_approver:'manager@tgdg.com', posting_date:'2026-06-18', half_day:1,
    half_day_date:'2026-06-20', custom_half_day_session:'Sáng' },
  { name:'HR-LAP-2026-00009', leave_type:'Phép năm', from_date:'2026-06-10', to_date:'2026-06-11',
    total_leave_days:2, description:'Về quê', status:'Open', workflow_state:'Pending Manager',
    docstatus:0, leave_approver:'manager@tgdg.com', posting_date:'2026-06-08', half_day:0,
    half_day_date:null, custom_half_day_session:null },
] };

const MOCKS = {
  'attendance.get_attendance_info':INFO,
  'leave.get_leave_types_for_employee':LEAVE_TYPES,
  'leave.get_my_leave_applications':APPS,
  'approval.get_pending_count':{count:0}, 'push.get_push_config':{enabled:false},
};

const CLOCK = '2026-06-24T08:00:00';

async function setup(browser) {
  const ctx = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, locale:'vi-VN' });
  await ctx.addInitScript((b)=>{Object.assign(window,b);try{localStorage.setItem('mw_guide_seen_v1','1');}catch(e){}}, BOOT);
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date(CLOCK) });
  await page.route('**/*', async (route) => {
    const u = new URL(route.request().url()); const p = u.pathname;
    if (u.hostname==='localhost') {
      if (p.startsWith('/api/method/')) { for (const k in MOCKS) if (p.includes(k)) return route.fulfill(api(MOCKS[k])); return route.fulfill(api(null)); }
      if (p.startsWith('/assets/hr_for_cobegroup/')) { const f=path.join(PUBLIC,p.replace('/assets/hr_for_cobegroup/','')); return fs.existsSync(f)?route.fulfill({path:f}):route.fulfill({status:404,body:''}); }
      if (p.startsWith('/my-workspace')) return route.fulfill({ contentType:'text/html', body:indexHtml });
      return route.fulfill({ status:204, body:'' });
    }
    return route.continue();
  });
  await page.goto('http://localhost/my-workspace/leave', { waitUntil:'domcontentloaded' }).catch(()=>{});
  await page.waitForTimeout(1500);
  return { ctx, page };
}

async function openFormSingleDay(page) {
  await page.locator('[title="Tạo đơn xin nghỉ"]').click().catch(()=>{});
  await page.waitForSelector('.ant-modal', { timeout:5000 }).catch(()=>{});
  await page.waitForTimeout(600);
  // Chọn Loại phép
  await page.locator('.ant-modal .ant-select-selector').first().click().catch(()=>{});
  await page.waitForTimeout(400);
  await page.locator('.ant-select-item-option', { hasText:'Phép năm' }).first().click().catch(()=>{});
  await page.waitForTimeout(300);
  // RangePicker: chọn ĐÚNG 1 ngày (click cùng 1 ô 2 lần → from == to)
  await page.locator('.ant-modal .ant-picker').first().click().catch(()=>{});
  await page.waitForSelector('.ant-picker-dropdown', { timeout:4000 }).catch(()=>{});
  await page.waitForTimeout(300);
  const cell = page.locator('.ant-picker-dropdown:visible .ant-picker-cell[title="2026-06-20"] .ant-picker-cell-inner').first();
  await cell.click().catch(()=>{});
  await page.waitForTimeout(200);
  await cell.click().catch(()=>{});
  await page.waitForTimeout(300);
  // Mô tả
  await page.locator('.ant-modal textarea').fill('Đi khám buổi sáng').catch(()=>{});
  await page.waitForTimeout(300);
}

(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });

  // 10 — danh sách + số dư phép
  {
    const { ctx, page } = await setup(browser);
    await page.screenshot({ path: path.join(OUT, '10-leave-list.png') });
    console.log('shot 10-leave-list'); await ctx.close();
  }
  // 11 — form tạo đơn (1 ngày, chưa tick nửa ngày)
  {
    const { ctx, page } = await setup(browser);
    await openFormSingleDay(page);
    await page.screenshot({ path: path.join(OUT, '11-leave-create.png') });
    console.log('shot 11-leave-create'); await ctx.close();
  }
  // 12 — form NỬA NGÀY (tick + chọn Buổi sáng)
  {
    const { ctx, page } = await setup(browser);
    await openFormSingleDay(page);
    await page.locator('.ant-modal .ant-checkbox-input').first().check().catch(()=>{});
    await page.waitForTimeout(400);
    // Chọn Buổi sáng (radio button)
    await page.locator('.ant-modal .ant-radio-button-wrapper', { hasText:'Buổi sáng' }).click().catch(()=>{});
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, '12-leave-halfday.png') });
    console.log('shot 12-leave-halfday'); await ctx.close();
  }

  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
