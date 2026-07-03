/* video_ktv.js — quay 5 đoạn video hướng dẫn CHẤM CÔNG KTV hiện trường
   từ APP THẬT (render React + mock API + freeze giờ). Khuôn shoot_dexuat.js.
   Output: <scratch>/segNN.webm (+ poster.png) → build_video_ktv.sh ghép TTS + mp4.
   Chạy: node help/cobe_erp_documents/_tools/video_ktv.js <outdir>
   UI đổi → build lại PWA rồi chạy lại. */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = process.argv[2] || '/tmp/video_ktv';
fs.mkdirSync(OUT, { recursive: true });
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'a@tgdg.com', user_fullname:'Trần Văn Kỹ',
  employee:'HR-EMP-007', employee_name:'Trần Văn Kỹ', user_roles:['Employee'], inbox_access:false, is_technician:true, wiki_url:'' };
const OFFICE = { latitude:10.73762, longitude:106.71704 };   // đứng tại VP
const FIELD  = { latitude:10.86121, longitude:106.62914 };   // hiện trường khách (xa VP)

const INFO = (next) => ({ employee_name:'Trần Văn Kỹ', employee_id:'HR-EMP-007', next_log_type:next, checkins:[],
  phone_registered:true, wfh_today:{active:false}, feature_flags:{ enable_selfie_capture:false, enable_wfh_mode:false } });
const CK = (n, t, type) => ({ name:'CK-'+n, log_type:type, time:t, office_label: type==='IN' ? 'VP Quận 7' : null, source:'Onsite-PWA' });
const REC = (d, h, i, o) => ({ name:'ATT-'+d, attendance_date:d, status:'Present', working_hours:h,
  hr_warning_type:null, in_time:d+' '+i, out_time:d+' '+o, late_entry:0, early_exit:0, shift:'Ca KTV' });

/* Mỗi segment = 1 context quay video riêng. state đóng trong closure để mock "sống"
   (bấm checkin xong → info/list đổi như thật). */
const segments = [
  { name:'seg1', tab:'checkin', geo:OFFICE, clock:'2026-06-30T08:01:00',
    state: { next:'IN', rows:[] },
    checkin(st){ st.next='OUT'; st.rows=[CK(1,'2026-06-30 08:01:00','IN')];
      return { success:true, log_type:'IN', time:'2026-06-30 08:01:00' }; },
    actions: async (page) => {
      await page.waitForTimeout(2500);
      await page.screenshot({ path: path.join(OUT,'poster.png') });    // poster cho thẻ <video>
      await page.getByText('Chấm công (Vào)').click();
      await page.waitForSelector('.ant-modal', { timeout:8000 });
      await page.waitForTimeout(3500);                                  // map load + người xem kịp nhìn
      await page.getByRole('button', { name:'Check-in', exact:true }).click();
      await page.waitForTimeout(3500);                                  // toast thành công + list cập nhật
    } },
  { name:'seg2', tab:'checkin', geo:FIELD, clock:'2026-06-30T17:15:00',
    state: { next:'OUT', rows:[CK(1,'2026-06-30 08:01:00','IN')] },
    checkin(st){ st.next='IN'; st.rows=[CK(2,'2026-06-30 17:15:00','OUT'), ...st.rows];
      return { success:true, log_type:'OUT', time:'2026-06-30 17:15:00' }; },
    actions: async (page) => {
      await page.waitForTimeout(2500);
      await page.getByText('Chấm công (Ra)').click();
      await page.waitForSelector('.ant-modal', { timeout:8000 });
      await page.waitForTimeout(3500);
      await page.getByRole('button', { name:'Check-out', exact:true }).click();
      await page.waitForTimeout(3500);
    } },
  { name:'seg3', tab:'checkin', geo:FIELD, clock:'2026-07-01T07:45:00',
    state: { next:'IN', rows:[] },
    checkin(){ return { success:false, error_code:'OUT_OF_RANGE',
      message:'Ngoài vùng văn phòng (cách 15.234m). Đi công tác/làm ngoài? Hãy tạo Đề xuất chấm công bù.' }; },
    actions: async (page) => {
      await page.waitForTimeout(2500);
      await page.getByText('Chấm công (Vào)').click();
      await page.waitForSelector('.ant-modal', { timeout:8000 });
      await page.waitForTimeout(3000);
      await page.getByRole('button', { name:'Check-in', exact:true }).click();
      await page.waitForTimeout(4000);                                  // toast lỗi đỏ
    } },
  { name:'seg4', tab:'attendance', geo:FIELD, clock:'2026-06-30T20:00:00',
    state: { next:'IN', rows:[], recs:[REC('2026-06-30',8.2,'08:01:00','17:15:00'), REC('2026-06-27',8.0,'07:58:00','17:05:00')], reqs:[] },
    checkin(){ return { success:false }; },
    create(st){ st.reqs=[{ name:'HR-ATT-2026-00035', from_date:'2026-07-01', to_date:'2026-07-01', reason:'On Duty',
      explanation:'Đi thẳng công trình Long An từ sáng — không ghé VP', work_location_label:'', half_day:0, status:'Pending' }];
      return { success:true, name:'HR-ATT-2026-00035' }; },
    actions: async (page) => {
      await page.waitForTimeout(2500);
      await page.getByText('Đề xuất', { exact:true }).first().click(); // FAB
      await page.waitForSelector('.ant-modal', { timeout:8000 });
      await page.waitForTimeout(2000);
      await page.fill('.ant-modal textarea', 'Đi thẳng công trình Long An từ sáng — không ghé VP');
      await page.waitForTimeout(2000);
      await page.getByRole('button', { name:'Gửi đề xuất' }).click();
      await page.waitForTimeout(4000);                                  // toast + dòng Chờ duyệt
    } },
  { name:'seg5', tab:'attendance', geo:FIELD, clock:'2026-07-02T09:00:00',
    state: { next:'IN', rows:[], recs:[REC('2026-07-01',8.0,'08:00:00','17:30:00'), REC('2026-06-30',8.2,'08:01:00','17:15:00'), REC('2026-06-27',8.0,'07:58:00','17:05:00')], reqs:[] },
    checkin(){ return { success:false }; },
    actions: async (page) => {
      await page.waitForTimeout(3500);
      await page.locator('.ant-list-item').first().click();            // mở chi tiết ngày đã duyệt
      await page.waitForTimeout(4000);
    } },
];

(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  for (const s of segments) {
    const ctx = await browser.newContext({ viewport:{width:390,height:844}, locale:'vi-VN',
      permissions:['geolocation'], geolocation:s.geo,
      recordVideo:{ dir:OUT, size:{width:390,height:844} } });
    await ctx.addInitScript((b)=>{ Object.assign(window, b.boot);
      try{ localStorage.setItem('mw_guide_seen_v1','1');
        sessionStorage.setItem('attendance_active_tab', b.tab); }catch(e){} }, { boot:BOOT, tab:s.tab });
    const page = await ctx.newPage();
    await page.clock.install({ time: new Date(s.clock) });
    const st = s.state;
    await page.route('**/*', async (route) => {
      const u = new URL(route.request().url()); const p = u.pathname;
      if (u.hostname==='localhost') {
        if (p.startsWith('/api/method/')) {
          if (p.includes('attendance.get_attendance_info')) return route.fulfill(api(INFO(st.next)));
          if (p.includes('attendance.get_checkin_challenge')) return route.fulfill(api({ challenge:'demo-challenge' }));
          if (p.includes('attendance.checkin')) return route.fulfill(api(s.checkin(st)));
          // Bundle hiện tại unwrap `.then(n => n.checkins)` → phải bọc { checkins }
          if (p.includes('attendance.get_checkins')) return route.fulfill(api({ checkins: st.rows }));
          if (p.includes('attendance.get_attendance_records')) return route.fulfill(api({ attendance: st.recs || [] }));
          if (p.includes('attendance_request.get_my_attendance_requests')) return route.fulfill(api({ requests: st.reqs || [] }));
          if (p.includes('attendance_request.create_attendance_request')) return route.fulfill(api(s.create ? s.create(st) : { success:true, name:'X' }));
          if (p.includes('approval.get_pending_count')) return route.fulfill(api({ count:0 }));
          if (p.includes('push.get_push_config')) return route.fulfill(api({ enabled:false }));
          return route.fulfill(api(null));
        }
        if (p.startsWith('/assets/hr_for_cobegroup/')) { const f=path.join(PUBLIC,p.replace('/assets/hr_for_cobegroup/','')); return fs.existsSync(f)?route.fulfill({path:f}):route.fulfill({status:404,body:''}); }
        if (p.startsWith('/my-workspace')) return route.fulfill({ contentType:'text/html', body:indexHtml });
        return route.fulfill({ status:204, body:'' });
      }
      return route.continue();  // map Google embed load thật
    });
    await page.goto('http://localhost/my-workspace/attendance', { waitUntil:'domcontentloaded' }).catch(()=>{});
    await s.actions(page);
    await ctx.close();
    const v = await page.video().path();
    fs.renameSync(v, path.join(OUT, s.name + '.webm'));
    console.log('recorded', s.name);
  }
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
