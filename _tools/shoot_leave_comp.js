/* shoot_leave_comp.js — chụp màn NGHỈ BÙ (leave type is_compensatory) từ PWA build thật + mock API.
   Kịch bản: KTV làm khuya 02/07 → xin Nghỉ bù ngày 03/07. Cùng khuôn shoot_leave.js.
   Chạy: node help/cobe_erp_documents/_tools/shoot_leave_comp.js
   UI đổi → build lại PWA rồi chạy lại. */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/guide/nhanvien';
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'a@tgdg.com', user_fullname:'Trần Văn Kỹ',
  employee:'HR-EMP-007', employee_name:'Trần Văn Kỹ', user_roles:['Employee'], inbox_access:false, is_technician:true, wiki_url:'' };
const INFO = { employee_name:'Trần Văn Kỹ', employee_id:'HR-EMP-007', next_log_type:'IN', checkins:[],
  phone_registered:true, wfh_today:{active:false}, feature_flags:{} };

const LEAVE_TYPES = { leave_types:[
  { name:'Phép năm', balance:6.5, max_leaves_allowed:12, leaves_taken:5.5, leaves_pending_approval:0, is_lwp:0, is_compensatory:0 },
  { name:'Nghỉ bù', balance:0, max_leaves_allowed:0, leaves_taken:2, leaves_pending_approval:0, is_lwp:0, is_compensatory:1 },
  { name:'Leave Without Pay', balance:0, max_leaves_allowed:0, leaves_taken:0, leaves_pending_approval:0, is_lwp:1, is_compensatory:0 },
], employee:'HR-EMP-007' };

// Đơn Nghỉ bù vừa gửi — chờ quản lý duyệt (cho shot danh sách)
const COMP_APP = { name:'HR-LAP-2026-00031', leave_type:'Nghỉ bù', from_date:'2026-07-03', to_date:'2026-07-03',
  total_leave_days:1, description:'Làm khuya lắp máy tới 23h đêm 02/07 — xin nghỉ bù hôm sau',
  status:'Open', workflow_state:'Pending Manager', docstatus:0, leave_approver:'manager@tgdg.com',
  posting_date:'2026-07-02', half_day:0, half_day_date:null, custom_half_day_session:null };

const M = (apps) => ({
  'attendance.get_attendance_info':INFO,
  'leave.get_leave_types_for_employee':LEAVE_TYPES,
  'leave.get_my_leave_applications':{ applications: apps },
  'approval.get_pending_count':{count:0}, 'push.get_push_config':{enabled:false},
});

async function setup(browser, mocks) {
  const ctx = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, locale:'vi-VN' });
  await ctx.addInitScript((b)=>{Object.assign(window,b);try{localStorage.setItem('mw_guide_seen_v1','1');}catch(e){}}, BOOT);
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date('2026-07-02T21:30:00') });
  await page.route('**/*', async (route) => {
    const u = new URL(route.request().url()); const p = u.pathname;
    if (u.hostname==='localhost') {
      if (p.startsWith('/api/method/')) { for (const k in mocks) if (p.includes(k)) return route.fulfill(api(mocks[k])); return route.fulfill(api(null)); }
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

const pickDate = async (page, pickerIdx, title, twice=false) => {
  await page.locator('.ant-modal .ant-picker').nth(pickerIdx).click();
  await page.waitForSelector('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden)', { timeout:4000 });
  await page.waitForTimeout(300);
  const cell = page.locator(`.ant-picker-dropdown:visible .ant-picker-cell[title="${title}"] .ant-picker-cell-inner`).first();
  await cell.click();
  if (twice) { await page.waitForTimeout(200); await cell.click(); }
  await page.waitForTimeout(400);
};

(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });

  // 13 — form Nghỉ bù: loại + "Ngày làm thêm để bù" + khoảng ngày + lý do
  {
    const { ctx, page } = await setup(browser, M([]));
    await page.locator('[title="Tạo đơn xin nghỉ"]').click();
    await page.waitForSelector('.ant-modal', { timeout:5000 });
    await page.waitForTimeout(600);
    await page.locator('.ant-modal .ant-select-selector').first().click();
    await page.waitForTimeout(400);
    await page.locator('.ant-select-item-option', { hasText:'Nghỉ bù' }).first().click();
    await page.waitForTimeout(500);
    await pickDate(page, 0, '2026-07-02');            // Ngày làm thêm để bù = hôm làm khuya
    await pickDate(page, 1, '2026-07-03', true);      // Khoảng ngày nghỉ = hôm sau (from == to)
    await page.locator('.ant-modal textarea').fill('Làm khuya lắp máy tới 23h đêm 02/07 — xin nghỉ bù hôm sau');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, '13-leave-comp.png') });
    console.log('shot 13-leave-comp'); await ctx.close();
  }
  // 14 — danh sách: tag "Nghỉ bù" trong Số dư + đơn Nghỉ bù chờ duyệt
  {
    const { ctx, page } = await setup(browser, M([COMP_APP]));
    await page.screenshot({ path: path.join(OUT, '14-leave-comp-list.png') });
    console.log('shot 14-leave-comp-list'); await ctx.close();
  }

  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
