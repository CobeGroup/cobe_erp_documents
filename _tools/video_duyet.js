/* video_duyet.js — quay 5 đoạn video hướng dẫn PHÊ DUYỆT (tab Cần duyệt: Manager + HR
   + chấm công bù 1 bước + chuyển duyệt) từ APP THẬT (mock API + freeze giờ). Khuôn video_ktv.js.
   Output: <outdir>/segNN.webm (+ poster.png) → build_video.sh ghép TTS + mp4.
   Thuyết minh: _tools/narration/duyet-don.txt — copy vào workdir rồi chạy build_video.sh.
   Chạy: node help/cobe_erp_documents/_tools/video_duyet.js <outdir> */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = process.argv[2] || '/tmp/video_duyet';
fs.mkdirSync(OUT, { recursive: true });
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

// Người đăng nhập = người duyệt (Manager kiêm HR để quay đủ 2 bước trong 1 inbox)
const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'manager@tgdg.com', user_fullname:'Nguyễn Văn Quản',
  employee:'HR-EMP-010', employee_name:'Nguyễn Văn Quản', user_roles:['Employee','Leave Approver','HR Manager'],
  inbox_access:true, is_technician:false, wiki_url:'' };
const INFO = { employee_name:'Nguyễn Văn Quản', employee_id:'HR-EMP-010', next_log_type:'IN', checkins:[],
  phone_registered:true, wfh_today:{active:false}, feature_flags:{} };

const L1 = { doctype:'Leave Application', name:'HR-LAP-2026-00021', employee:'HR-EMP-002', employee_name:'Trần Thị Bình',
  state:'Pending Manager', summary:'Phép năm · 06/07/2026 · 0,5 ngày (Sáng)', reason:'Đi khám buổi sáng',
  creation:'2026-07-02T07:30:00', can_forward:true, forwarded_to:null, forwarded_by:null, forwarded_by_name:null };
const L2 = { doctype:'Leave Application', name:'HR-LAP-2026-00019', employee:'HR-EMP-003', employee_name:'Lê Văn Cường',
  state:'Manager Approved', summary:'Phép năm · 10–11/07/2026 · 2 ngày', reason:'Về quê có việc gia đình',
  creation:'2026-07-01T16:10:00', can_forward:true, forwarded_to:null, forwarded_by:null, forwarded_by_name:null };
const A1 = { doctype:'Attendance Request', name:'HR-ATT-2026-00007', employee:'HR-EMP-004', employee_name:'Phạm Thị Dung',
  state:'Pending Manager', summary:'Chấm công bù / Công tác · 05/07/2026', reason:'Đi thẳng công trình Long An từ sáng — không ghé VP',
  creation:'2026-07-02T09:05:00', can_forward:false, forwarded_to:null, forwarded_by:null, forwarded_by_name:null };
const CANDIDATES = { candidates:[
  { name:'manager2@tgdg.com', full_name:'Hoàng Thị Phương', department:'Phòng Vận Hành - TGĐG', company:'TGĐG' },
  { name:'manager3@tgdg.com', full_name:'Đỗ Minh Khoa', department:'Phòng Vận Hành - TGĐG', company:'TGĐG' },
] };
const CLOCK = '2026-07-02T10:00:00';
const clone = (o) => JSON.parse(JSON.stringify(o));

async function openCard(page, name) {
  await page.locator('.ant-card', { hasText:name }).first().click();
  await page.waitForSelector('.ant-modal-content', { timeout:6000 });
  await page.waitForTimeout(2500);                                   // người xem đọc chi tiết đơn
}

const segments = [
  { name:'seg1', state:{ items:[clone(L1), clone(L2), clone(A1)] },
    actions: async (page) => {
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(OUT,'poster.png') });
      await page.waitForTimeout(2500);
    } },
  { name:'seg2', state:{ items:[clone(L1), clone(L2), clone(A1)] },
    act(st){ const it = st.items.find(i=>i.name===L1.name); if (it) it.state='Manager Approved';
      return { success:true }; },
    actions: async (page) => {
      await page.waitForTimeout(2000);
      await openCard(page, 'Trần Thị Bình');
      await page.getByRole('button', { name:'Duyệt (Trưởng bộ phận)' }).click();
      await page.waitForTimeout(5500);                               // "Đang xử lý…" → ✓ → list cập nhật
    } },
  { name:'seg3', state:{ items:[Object.assign(clone(L1),{state:'Manager Approved'}), clone(L2), clone(A1)] },
    act(st){ st.items = st.items.filter(i=>i.name!==L2.name); return { success:true }; },
    actions: async (page) => {
      await page.waitForTimeout(2000);
      await openCard(page, 'Lê Văn Cường');
      await page.getByRole('button', { name:'Duyệt (HR)' }).click();
      await page.waitForTimeout(5500);
    } },
  { name:'seg4', state:{ items:[clone(A1), Object.assign(clone(L1),{state:'Manager Approved'})] },
    act(st){ st.items = st.items.filter(i=>i.name!==A1.name); return { success:true }; },
    actions: async (page) => {
      await page.waitForTimeout(2000);
      await openCard(page, 'Phạm Thị Dung');
      // KHÔNG dùng getByRole exact: icon antd có aria-label → name = "check Duyệt"
      await page.locator('.ant-modal-content button', { hasText:/^Duyệt$/ }).first().click();
      await page.waitForTimeout(5500);
    } },
  { name:'seg5', state:{ items:[clone(L1), clone(A1)] },
    forward(st){ st.items = st.items.filter(i=>i.name!==L1.name); return { success:true }; },
    actions: async (page) => {
      await page.waitForTimeout(2000);
      await openCard(page, 'Trần Thị Bình');
      await page.locator('.ant-modal button', { hasText:'Chuyển duyệt' }).first().click();
      await page.waitForTimeout(1500);
      await page.locator('.ant-modal .ant-select-selector').last().click();
      await page.waitForTimeout(800);
      await page.locator('.ant-select-item-option', { hasText:'Hoàng Thị Phương' }).first().click();
      await page.waitForTimeout(800);
      await page.locator('.ant-modal textarea').last().fill('Ca khó, nhờ chị Phương duyệt giúp');
      await page.waitForTimeout(1500);
      await page.locator('.ant-modal button', { hasText:/^Chuyển$/ }).first().click();
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
          if (p.includes('approval.get_my_pending_approvals')) return route.fulfill(api({ is_approver:true, items:st.items }));
          if (p.includes('approval.get_pending_count')) return route.fulfill(api({ count:st.items.length }));
          if (p.includes('approval.get_forward_candidates')) return route.fulfill(api(CANDIDATES));
          if (p.includes('approval.act')) { await new Promise(r=>setTimeout(r,2000));
            return route.fulfill(api(s.act ? s.act(st) : { success:true })); }
          if (p.includes('approval.forward')) { await new Promise(r=>setTimeout(r,1200));
            return route.fulfill(api(s.forward ? s.forward(st) : { success:true })); }
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
    await page.goto('http://localhost/my-workspace/approvals', { waitUntil:'domcontentloaded' }).catch(()=>{});
    await page.waitForSelector('.ant-card', { timeout:8000 }).catch(()=>{});
    await s.actions(page);
    await ctx.close();
    const v = await page.video().path();
    fs.renameSync(v, path.join(OUT, s.name + '.webm'));
    console.log('recorded', s.name);
  }
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
