/* shoot_dexuat.js — chụp ảnh GUIDE màn "Đề xuất chấm công bù / Công tác" (tab Bảng công)
   từ APP THẬT (render React + mock API + freeze giờ).
   Chạy: node help/cobe_erp_documents/_tools/shoot_dexuat.js
   UI đổi → build lại PWA rồi chạy lại. */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/guide/dexuat';
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'a@tgdg.com', user_fullname:'Nguyễn Văn A',
  employee:'HR-EMP-001', employee_name:'Nguyễn Văn A', user_roles:['Employee'], inbox_access:false, is_technician:false, wiki_url:'' };
const INFO = { employee_name:'Nguyễn Văn A', employee_id:'HR-EMP-001', next_log_type:'IN', checkins:[],
  phone_registered:true, wfh_today:{active:false}, feature_flags:{ enable_selfie_capture:true, enable_wfh_mode:true } };

// Vài ngày công đã có (nền cho danh sách Bảng công)
const REC = (d, h, i, o) => ({ name:'ATT-'+d, attendance_date:d, status:'Present', working_hours:h,
  hr_warning_type:null, in_time:d+' '+i, out_time:d+' '+o, late_entry:0, early_exit:0, shift:'Hành chính' });
const BASE_RECS = [ REC('2026-06-27', 8.2, '08:01:00', '17:12:00'), REC('2026-06-26', 8.0, '07:58:00', '17:05:00') ];

// Đơn đề xuất Chờ duyệt (On Duty = chấm công bù / công tác)
const PENDING_REQ = { name:'HR-ATT-2026-00031', from_date:'2026-06-30', to_date:'2026-06-30', reason:'On Duty',
  explanation:'Đi công tác Quận 1 gặp khách hàng ABC', work_location_label:'', half_day:0, status:'Pending' };
// Sau khi duyệt: ngày công tác thành 1 dòng công "Có mặt"
const APPROVED_REC = REC('2026-06-30', 8.0, '08:30:00', '17:30:00');

const M = (recs, reqs) => ({
  'attendance.get_attendance_info': INFO,
  'attendance.get_attendance_records': { attendance: recs },
  'attendance_request.get_my_attendance_requests': { requests: reqs },
  'approval.get_pending_count': { count:0 }, 'push.get_push_config': { enabled:false },
});

const screens = [
  // 1) Tab Bảng công + nút FAB "Đề xuất"
  { name:'01-fab', mocks: M(BASE_RECS, []) },
  // 2) Mở modal "Đề xuất chấm công" + điền lý do
  { name:'02-form', mocks: M(BASE_RECS, []), openForm:true,
    fillReason:'Đi công tác Quận 1 gặp khách hàng ABC — về thẳng nhà, không ghé VP.' },
  // 3) Đơn vừa gửi — trạng thái Chờ duyệt trên danh sách
  { name:'03-pending', mocks: M(BASE_RECS, [PENDING_REQ]) },
  // 4) Sau khi quản lý duyệt — ngày đó thành "Có mặt"
  { name:'04-approved', mocks: M([APPROVED_REC, ...BASE_RECS], []) },
];

(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  for (const s of screens) {
    const ctx = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, locale:'vi-VN',
      permissions:['geolocation'], geolocation:{ latitude:10.73762, longitude:106.71704 } });
    await ctx.addInitScript((b)=>{ Object.assign(window,b);
      try{ localStorage.setItem('mw_guide_seen_v1','1');
        sessionStorage.setItem('attendance_active_tab','attendance'); }catch(e){} }, BOOT);
    const page = await ctx.newPage();
    await page.clock.install({ time: new Date('2026-06-30T09:00:00') });
    await page.route('**/*', async (route) => {
      const u = new URL(route.request().url()); const p = u.pathname;
      if (u.hostname==='localhost') {
        if (p.startsWith('/api/method/')) { for (const k in s.mocks) if (p.includes(k)) return route.fulfill(api(s.mocks[k])); return route.fulfill(api(null)); }
        if (p.startsWith('/assets/hr_for_cobegroup/')) { const f=path.join(PUBLIC,p.replace('/assets/hr_for_cobegroup/','')); return fs.existsSync(f)?route.fulfill({path:f}):route.fulfill({status:404,body:''}); }
        if (p.startsWith('/my-workspace')) return route.fulfill({ contentType:'text/html', body:indexHtml });
        return route.fulfill({ status:204, body:'' });
      }
      return route.continue();
    });
    await page.goto('http://localhost/my-workspace/attendance', { waitUntil:'domcontentloaded' }).catch(()=>{});
    await page.waitForTimeout(1500);
    if (s.openForm) {
      await page.getByText('Đề xuất', { exact:true }).first().click().catch(()=>{});
      await page.waitForSelector('.ant-modal', { timeout:5000 }).catch(()=>{});
      await page.waitForTimeout(800);
      if (s.fillReason) { await page.fill('.ant-modal textarea', s.fillReason).catch(()=>{}); await page.waitForTimeout(500); }
    }
    await page.screenshot({ path: path.join(OUT, s.name + '.png') });
    console.log('shot', s.name);
    await ctx.close();
  }
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
