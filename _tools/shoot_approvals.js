/* shoot_approvals.js — chụp màn "Cần duyệt" (inbox duyệt Manager/HR) từ PWA build thật + mock API.
   Gồm: danh sách inbox, chi tiết đơn (nút Manager / nút HR), modal Chuyển duyệt, item Chấm công bù (WFH).
   Chạy: node help/cobe_erp_documents/_tools/shoot_approvals.js
   UI đổi → npm run build (PWA) rồi chạy lại. */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/guide/duyet';
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

// Người đang đăng nhập = người duyệt (Manager kiêm xem HR). inbox_access:true → hiện tab "Cần duyệt".
const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'manager@tgdg.com', user_fullname:'Nguyễn Văn Quản',
  employee:'HR-EMP-010', employee_name:'Nguyễn Văn Quản', user_roles:['Employee','Leave Approver','HR Manager'],
  inbox_access:true, is_technician:false, wiki_url:'' };

// 3 đơn: Leave chờ Manager (0.5 ngày), Leave chờ HR (2 ngày), Chấm công bù / WFH.
const PENDING = { is_approver:true, items:[
  { doctype:'Leave Application', name:'HR-LAP-2026-00021', employee:'HR-EMP-002', employee_name:'Trần Thị Bình',
    state:'Pending Manager', summary:'Phép năm · 20/06/2026 · 0,5 ngày (Sáng)', reason:'Đi khám buổi sáng',
    creation:'2026-06-29T07:30:00', can_forward:true, forwarded_to:null, forwarded_by:null, forwarded_by_name:null },
  { doctype:'Leave Application', name:'HR-LAP-2026-00019', employee:'HR-EMP-003', employee_name:'Lê Văn Cường',
    state:'Manager Approved', summary:'Phép năm · 10–11/07/2026 · 2 ngày', reason:'Về quê có việc gia đình',
    creation:'2026-06-28T16:10:00', can_forward:true, forwarded_to:null, forwarded_by:null, forwarded_by_name:null },
  { doctype:'Attendance Request', name:'HR-ATT-2026-00007', employee:'HR-EMP-004', employee_name:'Phạm Thị Dung',
    state:'Pending Manager', summary:'Làm tại nhà (WFH) · 15/07/2026', reason:'Chăm con ốm, xin làm tại nhà',
    creation:'2026-06-29T09:05:00', can_forward:false, forwarded_to:null, forwarded_by:null, forwarded_by_name:null },
] };

const CANDIDATES = { candidates:[
  { name:'manager2@tgdg.com', full_name:'Hoàng Thị Phương', department:'Phòng Vận Hành - TGĐG', company:'TGĐG' },
  { name:'manager3@tgdg.com', full_name:'Đỗ Minh Khoa', department:'Phòng Vận Hành - TGĐG', company:'TGĐG' },
] };

const MOCKS = {
  'approval.get_my_pending_approvals':PENDING,
  'approval.get_pending_count':{count:3},
  'approval.get_forward_candidates':CANDIDATES,
  'attendance.get_attendance_info':{ employee_name:'Nguyễn Văn Quản', employee_id:'HR-EMP-010', next_log_type:'IN', checkins:[], phone_registered:true, wfh_today:{active:false}, feature_flags:{} },
  'push.get_push_config':{enabled:false},
};

const CLOCK = '2026-06-29T10:00:00';

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
  await page.goto('http://localhost/my-workspace/approvals', { waitUntil:'domcontentloaded' }).catch(()=>{});
  await page.waitForSelector('.ant-card', { timeout:6000 }).catch(()=>{});
  await page.waitForTimeout(1200);
  return { ctx, page };
}

async function openCard(page, name) {
  await page.locator('.ant-card', { hasText:name }).first().click().catch(()=>{});
  await page.waitForSelector('.ant-modal-content', { timeout:5000 }).catch(()=>{});
  await page.waitForTimeout(600);
}

(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  fs.mkdirSync(OUT, { recursive:true });

  // 01 — inbox danh sách "Cần duyệt"
  {
    const { ctx, page } = await setup(browser);
    await page.screenshot({ path: path.join(OUT, '01-inbox.png') });
    console.log('shot 01-inbox'); await ctx.close();
  }
  // 02 — chi tiết đơn CHỜ MANAGER (nút Duyệt Manager / Từ chối / Chuyển duyệt)
  {
    const { ctx, page } = await setup(browser);
    await openCard(page, 'Trần Thị Bình');
    await page.screenshot({ path: path.join(OUT, '02-detail-manager.png') });
    console.log('shot 02-detail-manager'); await ctx.close();
  }
  // 03 — chi tiết đơn CHỜ HR (nút Submit HR / Từ chối / Chuyển duyệt)
  {
    const { ctx, page } = await setup(browser);
    await openCard(page, 'Lê Văn Cường');
    await page.screenshot({ path: path.join(OUT, '03-detail-hr.png') });
    console.log('shot 03-detail-hr'); await ctx.close();
  }
  // 04 — modal Chuyển duyệt (forward) — chọn sẵn 1 người
  {
    const { ctx, page } = await setup(browser);
    await openCard(page, 'Lê Văn Cường');
    await page.locator('.ant-modal button', { hasText:'Chuyển duyệt' }).first().click().catch(()=>{});
    await page.waitForSelector('.ant-modal-title:has-text("Chuyển duyệt đơn")', { timeout:5000 }).catch(()=>{});
    await page.waitForTimeout(800);
    // mở select + chọn người đầu
    await page.locator('.ant-modal .ant-select-selector').last().click().catch(()=>{});
    await page.waitForTimeout(400);
    await page.locator('.ant-select-item-option', { hasText:'Hoàng Thị Phương' }).first().click().catch(()=>{});
    await page.waitForTimeout(300);
    await page.locator('.ant-modal textarea').last().fill('Ca khó, nhờ chị Phương duyệt giúp').catch(()=>{});
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, '04-forward.png') });
    console.log('shot 04-forward'); await ctx.close();
  }
  // 05 — chi tiết Chấm công bù / WFH (nút Duyệt / Hủy)
  {
    const { ctx, page } = await setup(browser);
    await openCard(page, 'Phạm Thị Dung');
    await page.screenshot({ path: path.join(OUT, '05-attendance.png') });
    console.log('shot 05-attendance'); await ctx.close();
  }

  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
