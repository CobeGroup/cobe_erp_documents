/* shoot_comp_advance.js — chụp 3 chỗ mới về ỨNG TRƯỚC Nghỉ bù (11/11/2026):
   18-comp-advance-tags:      thẻ đơn nghỉ có nhãn "Ứng trước" / "đã bù bằng giờ làm thêm"
   19-comp-advance-statement: sao kê quỹ Nghỉ bù
   20-comp-advance-confirm:   hộp xác nhận trước khi gửi đơn ứng
   Dữ liệu demo dựng theo ca thật (quỹ 5,44h, ứng 2,56h, OT 8h về trả 2,56h). */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = process.argv[2] || (ROOT + '/help/cobe_erp_documents/users/images/guide/nhanvien');
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'binh@tgdg.com', user_fullname:'Trần Thị Bình',
  employee:'HR-EMP-002', employee_name:'Trần Thị Bình', user_roles:['Employee'], inbox_access:false, is_technician:false, wiki_url:'' };
const INFO = { employee_name:'Trần Thị Bình', employee_id:'HR-EMP-002', next_log_type:'IN', checkins:[],
  phone_registered:true, wfh_today:{active:false}, feature_flags:{ enable_selfie_capture:true } };

const LEAVE_TYPES = { leave_types:[
  { name:'Phép Năm', balance:7.5, max_leaves_allowed:12, leaves_taken:4.5, leaves_pending_approval:0, is_lwp:0, skip_manager:0 },
  { name:'Nghỉ bù', balance:0, balance_hours:-2.56, is_compensatory:true, is_lwp:0, skip_manager:0 },
], employee:'HR-EMP-002' };

const PENDING = [{ source:'HR-OTR-3', date:'2026-11-15', hours:8, state:'future', to_debt:2.56, left:5.44 }];
const LEDGER = {
  balance_hours:-2.56, balance_days:0, hours_per_day:8, shortfall_hours:2.56,
  advance_limit_hours:8, carried_debt_hours:0, spendable_hours:5.44, spendable_days:0.5, lots:[],
  debt_hours:2.56, opening_date:'2026-09-12', opening_hours:0,
  pending_ot:PENDING,
  timeline:[
    { kind:'leave', source:'HR-LAP-2', on:'2026-11-03', date:'2026-11-13', to_date:'2026-11-13', days:1, hours:-8, after:-2.56, repaid:0, advanced:2.56 },
    { kind:'overtime', source:'HR-OTR-2', on:'2026-11-02', date:'2026-11-01', hours:8, after:5.44, repaid:2.56, advanced:0 },
    { kind:'leave', source:'HR-LAP-1', on:'2026-10-23', date:'2026-10-27', to_date:'2026-10-27', days:1, hours:-8, after:-2.56, repaid:0, advanced:2.56 },
    { kind:'overtime', source:'HR-OTR-1', on:'2026-10-13', date:'2026-10-11', hours:5.44, after:5.44, repaid:0, advanced:0 },
  ],
};
const APPS = { applications:[
  { name:'HR-LAP-2', leave_type:'Nghỉ bù', from_date:'2026-11-13', to_date:'2026-11-13', total_leave_days:1,
    description:'Nghỉ bù ca trực', status:'Approved', workflow_state:'Submitted', docstatus:1, posting_date:'2026-11-03', half_day:0,
    comp_advance:{ advance_hours:2.56, fund_debt_hours:2.56 } },
  { name:'HR-LAP-1', leave_type:'Nghỉ bù', from_date:'2026-10-27', to_date:'2026-10-27', total_leave_days:1,
    description:'Việc gia đình', status:'Approved', workflow_state:'Submitted', docstatus:1, posting_date:'2026-10-23', half_day:0,
    comp_advance:{ advance_hours:2.56, fund_debt_hours:2.56 } },
] };
const PREVIEW = { advance_hours:4, own_hours:0, required_hours:4, total_days:0.5, balance_hours:-2.56,
  debt_after_hours:6.56, limit_hours:8,
  pending_ot:[{ source:'HR-OTR-3', date:'2026-11-15', hours:8, state:'future', to_debt:6.56, left:1.44 }] };

const MOCKS = {
  'attendance.get_attendance_info':INFO,
  'leave.get_leave_types_for_employee':LEAVE_TYPES,
  'leave.get_my_leave_applications':APPS,
  'leave.get_comp_leave_ledger':LEDGER,
  'leave.get_half_workdays':{ dates:[] },
  'leave.preview_comp_leave':PREVIEW,
  'approval.get_pending_count':{count:0}, 'push.get_push_config':{enabled:false},
};
const CLOCK = '2026-11-11T08:00:00';

async function setup(browser) {
  const ctx = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, locale:'vi-VN' });
  await ctx.addInitScript((b)=>{Object.assign(window,b);try{localStorage.setItem('mw_guide_seen_v1','1');}catch(e){}}, BOOT);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
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

  // 18 — tab Đã duyệt: nhãn ứng trước trên từng đơn + dòng "đang ứng trước" dưới số dư
  {
    const { ctx, page } = await setup(browser);
    await page.locator('.ant-segmented-item', { hasText:'Đã duyệt' }).first().click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, '18-comp-advance-tags.png') });
    console.log('shot 18'); 
    // 19 — sao kê
    await page.locator('a', { hasText:'Xem sao kê quỹ Nghỉ bù' }).first().click();
    await page.waitForSelector('.ant-modal', { timeout:5000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, '19-comp-advance-statement.png') });
    console.log('shot 19'); await ctx.close();
  }
  // 20 — form Nghỉ bù → Gửi → hộp xác nhận ứng trước
  {
    const { ctx, page } = await setup(browser);
    await page.locator('[title="Tạo đơn xin nghỉ"]').click();
    await page.waitForSelector('.ant-modal', { timeout:5000 });
    await page.waitForTimeout(500);
    await page.locator('.ant-modal .ant-select-selector').first().click();
    await page.waitForTimeout(400);
    await page.locator('.ant-select-item-option', { hasText:'Nghỉ bù' }).first().click();
    await page.waitForTimeout(500);
    await page.locator('.ant-modal .ant-picker').first().click();
    await page.waitForSelector('.ant-picker-dropdown', { timeout:4000 });
    const cell = page.locator('.ant-picker-dropdown:visible .ant-picker-cell[title="2026-11-20"] .ant-picker-cell-inner').first();
    await cell.dispatchEvent('click'); await page.waitForTimeout(200);
    await cell.dispatchEvent('click'); await page.waitForTimeout(500);
    await page.locator('.ant-modal-footer button.ant-btn-primary, .ant-modal button.ant-btn-primary').last().click();
    await page.waitForSelector('.ant-modal-confirm', { timeout:5000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, '20-comp-advance-confirm.png') });
    console.log('shot 20'); await ctx.close();
  }
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
