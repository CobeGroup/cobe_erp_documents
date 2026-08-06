/* shoot_leave_bypass.js — chụp 3 state MỚI của Nghỉ phép (mục 13/16/17):
   15-leave-skipmanager: form loại phép gửi THẲNG HR (skip_manager) + banner bắt buộc đính kèm
   16-leave-rejected:    chi tiết đơn bị Từ chối, hiện "Lý do từ chối"
   17-leave-edit:        chi tiết đơn Chờ trưởng bộ phận, hiện nút "Sửa đơn"
   Khuôn shoot_leave.js. Chạy: node help/cobe_erp_documents/_tools/shoot_leave_bypass.js */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/guide/nhanvien';
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'binh@tgdg.com', user_fullname:'Trần Thị Bình',
  employee:'HR-EMP-002', employee_name:'Trần Thị Bình', user_roles:['Employee'], inbox_access:false, is_technician:false, wiki_url:'' };
const INFO = { employee_name:'Trần Thị Bình', employee_id:'HR-EMP-002', next_log_type:'IN', checkins:[],
  phone_registered:true, wfh_today:{active:false}, feature_flags:{ enable_selfie_capture:true } };

// Loại phép gửi THẲNG HR: skip_manager:1 (chế độ/BHXH/WFH — mục 17)
const LEAVE_TYPES = { leave_types:[
  { name:'Phép năm', balance:7.5, max_leaves_allowed:12, leaves_taken:4.5, leaves_pending_approval:0, is_lwp:0, skip_manager:0 },
  { name:'Nghỉ chế độ (BHXH)', balance:0, max_leaves_allowed:0, leaves_taken:0, leaves_pending_approval:0, is_lwp:1, skip_manager:1 },
], employee:'HR-EMP-002' };

const APPS = { applications:[
  // Đơn bị Từ chối — có lý do (mục 13)
  { name:'HR-LAP-2026-00021', leave_type:'Phép năm', from_date:'2026-06-22', to_date:'2026-06-23',
    total_leave_days:2, description:'Về quê có việc', status:'Open', workflow_state:'Rejected',
    docstatus:0, leave_approver:'manager@tgdg.com', posting_date:'2026-06-18', half_day:0,
    custom_rejection_reason:'Cuối tháng chốt sổ, phòng thiếu người — dời sang đầu tháng sau giúp em.' },
  // Đơn đang Chờ trưởng bộ phận — sửa được (mục 16)
  { name:'HR-LAP-2026-00024', leave_type:'Phép năm', from_date:'2026-06-28', to_date:'2026-06-28',
    total_leave_days:1, description:'Đi khám định kỳ', status:'Open', workflow_state:'Pending Manager',
    docstatus:0, leave_approver:'manager@tgdg.com', posting_date:'2026-06-24', half_day:0 },
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

(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  fs.mkdirSync(OUT, { recursive:true });

  // 15 — form gửi thẳng HR: chọn loại skip_manager → banner + ô đính kèm bắt buộc
  {
    const { ctx, page } = await setup(browser);
    await page.locator('[title="Tạo đơn xin nghỉ"]').click().catch(()=>{});
    await page.waitForSelector('.ant-modal', { timeout:5000 }).catch(()=>{});
    await page.waitForTimeout(600);
    await page.locator('.ant-modal .ant-select-selector').first().click().catch(()=>{});
    await page.waitForTimeout(400);
    await page.locator('.ant-select-item-option', { hasText:'Nghỉ chế độ' }).first().click().catch(()=>{});
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, '15-leave-skipmanager.png') });
    console.log('shot 15-leave-skipmanager'); await ctx.close();
  }
  // 16 — chi tiết đơn bị Từ chối, hiện Lý do từ chối
  {
    const { ctx, page } = await setup(browser);
    await page.locator('.ant-list-item, .ant-card', { hasText:'Về quê có việc' }).first().click().catch(()=>{});
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT, '16-leave-rejected.png') });
    console.log('shot 16-leave-rejected'); await ctx.close();
  }
  // 17 — chi tiết đơn Chờ trưởng bộ phận, hiện nút Sửa đơn
  {
    const { ctx, page } = await setup(browser);
    await page.locator('.ant-list-item, .ant-card', { hasText:'Đi khám định kỳ' }).first().click().catch(()=>{});
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT, '17-leave-edit.png') });
    console.log('shot 17-leave-edit'); await ctx.close();
  }

  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
