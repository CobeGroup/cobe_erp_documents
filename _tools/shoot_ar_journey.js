/* shoot_ar_journey.js — chụp ảnh phía NGƯỜI DUYỆT cho trang "Hành trình một Đề xuất chấm công bù".
   Story khớp bộ ảnh dexuat/: Nguyễn Văn A · Chấm công bù / Công tác · 30/06/2026 ·
   "Đi công tác Quận 1 gặp khách hàng ABC". Khuôn shoot_approvals.js.
   Chạy: node help/cobe_erp_documents/_tools/shoot_ar_journey.js */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/guide/hanhtrinh';
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

// Người duyệt chấm công (Shift Request Approver) — không cần HR
const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'manager@tgdg.com', user_fullname:'Nguyễn Văn Quản',
  employee:'HR-EMP-010', employee_name:'Nguyễn Văn Quản', user_roles:['Employee','Attendance Request Approver'],
  inbox_access:true, is_technician:false, wiki_url:'' };

const PENDING = { is_approver:true, items:[
  { doctype:'Attendance Request', name:'HR-ATT-2026-00031', employee:'HR-EMP-001', employee_name:'Nguyễn Văn A',
    state:'Pending Manager', summary:'Chấm công bù / Công tác · 30/06/2026',
    reason:'Đi công tác Quận 1 gặp khách hàng ABC — về thẳng nhà, không ghé VP.',
    creation:'2026-06-30T07:45:00', can_forward:false, forwarded_to:null, forwarded_by:null, forwarded_by_name:null },
] };

const MOCKS = {
  'approval.get_my_pending_approvals': PENDING,
  'approval.get_pending_count': { count:1 },
  'attendance.get_attendance_info': { employee_name:'Nguyễn Văn Quản', employee_id:'HR-EMP-010', next_log_type:'IN',
    checkins:[], phone_registered:true, wfh_today:{active:false}, feature_flags:{} },
  'push.get_push_config': { enabled:false },
};

(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, locale:'vi-VN' });
  await ctx.addInitScript((b)=>{Object.assign(window,b);try{localStorage.setItem('mw_guide_seen_v1','1');}catch(e){}}, BOOT);
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date('2026-06-30T09:30:00') });
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
  await page.goto('http://localhost/my-workspace/approvals', { waitUntil:'domcontentloaded' }).catch(()=>{});
  await page.waitForSelector('.ant-card', { timeout:6000 }).catch(()=>{});
  await page.waitForTimeout(1200);
  await page.locator('.ant-card', { hasText:'Nguyễn Văn A' }).first().click().catch(()=>{});
  await page.waitForSelector('.ant-modal-content', { timeout:5000 }).catch(()=>{});
  await page.waitForTimeout(800);
  fs.mkdirSync(OUT, { recursive:true });
  await page.screenshot({ path: path.join(OUT, 'ar-duyet.png') });
  console.log('shot ar-duyet');
  await ctx.close();
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
