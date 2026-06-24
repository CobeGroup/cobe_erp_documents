/* shoot_guide.js — chụp ảnh GUIDE từ APP THẬT (render React + mock API + freeze giờ).
   Chạy: node help/cobe_erp_documents/_tools/shoot_guide.js
   UI đổi → npm run build (PWA) rồi chạy lại. */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/guide/nhanvien';
const SELFIE = ROOT + '/help/cobe_erp_documents/_tools/selfie_placeholder.png';
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'a@tgdg.com', user_fullname:'Nguyễn Văn A',
  employee:'HR-EMP-001', employee_name:'Nguyễn Văn A', user_roles:['Employee'], inbox_access:false, is_technician:false, wiki_url:'' };
const INFO = { employee_name:'Nguyễn Văn A', employee_id:'HR-EMP-001', next_log_type:'IN', checkins:[],
  phone_registered:true, wfh_today:{active:false}, feature_flags:{ enable_selfie_capture:true } };
const ROWS_TODAY = { checkins:[{ name:'1', log_type:'IN', time:'2026-06-24 08:00:00', office_label:'VP Quận 7', source:'Onsite-PWA' }] };
const ROWS_2 = { checkins:[
  { name:'1', log_type:'IN',  time:'2026-06-24 08:00:00', office_label:'VP Quận 7', source:'Onsite-PWA' },
  { name:'2', log_type:'OUT', time:'2026-06-23 17:30:00', office_label:'VP Quận 7', source:'Onsite-PWA' }]};
const UP = { file_url:'/private/files/selfie.png', file_name:'selfie.png' };

const M = (extra={}) => ({ 'attendance.get_attendance_info':INFO, 'attendance.get_checkins':ROWS_2,
  'approval.get_pending_count':{count:0}, 'push.get_push_config':{enabled:false}, 'upload_file':UP, ...extra });

const screens = [
  { name:'01-register-new', route:'/my-workspace/register-device', clock:'2026-06-24T08:00:00', mocks:{
      'attendance.get_attendance_info':{...INFO,phone_registered:false},
      'phone_device.get_phone_registration_status':{active:null,pending:null,other_active:false}, 'push.get_push_config':{enabled:false} } },
  { name:'02-register-pending', route:'/my-workspace/register-device', clock:'2026-06-24T08:00:00', mocks:{
      'attendance.get_attendance_info':{...INFO,phone_registered:false},
      'phone_device.get_phone_registration_status':{active:null,pending:{name:'PHR-001',fingerprint_short:'a1b2c3d4'},other_active:false}, 'push.get_push_config':{enabled:false} } },
  { name:'03-checkin-ready', route:'/my-workspace/attendance', clock:'2026-06-24T08:00:00', mocks:M() },
  { name:'04-checkin-confirm', route:'/my-workspace/attendance', clock:'2026-06-24T08:00:00', open:true, selfie:true, mocks:M() },
  { name:'05-checkin-success', route:'/my-workspace/attendance', clock:'2026-06-24T08:00:00', open:true, selfie:true, confirm:true,
      mocks:M({ 'attendance.checkin':{ success:true, log_type:'IN', time:'2026-06-24 08:00:00' } }) },
  { name:'06-checkin-error', route:'/my-workspace/attendance', clock:'2026-06-24T08:00:00', open:true, selfie:true, confirm:true,
      mocks:M({ 'attendance.checkin':{ success:false, error_code:'OUT_OF_RANGE', distance_m:85, message:'Bạn đang ở ngoài vùng văn phòng (cách 85m)' } }) },
  { name:'07-checkout-confirm', route:'/my-workspace/attendance', clock:'2026-06-24T17:30:00', open:true, selfie:true,
      mocks:M({ 'attendance.get_attendance_info':{...INFO,next_log_type:'OUT'}, 'attendance.get_checkins':ROWS_TODAY }) },
  { name:'08-checkin-done', route:'/my-workspace/attendance', clock:'2026-06-24T08:05:00', mocks:M({
      'attendance.get_attendance_info':{...INFO,next_log_type:'OUT'}, 'attendance.get_checkins':ROWS_TODAY }) },
];

(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  for (const s of screens) {
    const ctx = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, locale:'vi-VN',
      permissions:['geolocation'], geolocation:{ latitude:10.73762, longitude:106.71704 } });
    await ctx.addInitScript((b)=>{Object.assign(window,b);try{localStorage.setItem('mw_guide_seen_v1','1');}catch(e){}}, BOOT);
    const page = await ctx.newPage();
    if (s.clock) await page.clock.install({ time: new Date(s.clock) });
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
    await page.goto('http://localhost' + s.route, { waitUntil:'domcontentloaded' }).catch(()=>{});
    await page.waitForTimeout(1200);
    if (s.open) {
      await page.getByRole('button', { name:/Chấm công/ }).first().click().catch(()=>{});
      await page.waitForSelector('.ant-modal', { timeout:5000 }).catch(()=>{});
      await page.waitForTimeout(1200);
      if (s.selfie) { await page.setInputFiles('.ant-modal input[type=file]', SELFIE).catch(()=>{});
        await page.waitForSelector('.ant-modal img', { timeout:5000 }).catch(()=>{}); await page.waitForTimeout(1200); }
      if (s.confirm) { await page.click('.ant-modal-footer button:last-child').catch(()=>{});
        await page.waitForSelector('.ant-message-notice', { timeout:5000 }).catch(()=>{}); await page.waitForTimeout(600); }
    }
    await page.screenshot({ path: path.join(OUT, s.name + '.png') });
    console.log('shot', s.name);
    await ctx.close();
  }
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
