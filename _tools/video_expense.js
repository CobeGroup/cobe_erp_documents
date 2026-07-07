/* video_expense.js — quay 5 đoạn video hướng dẫn CHI PHÍ (tạm ứng → claim → hoàn ứng)
   từ APP THẬT (mock API + freeze giờ). Khuôn video_ktv.js; mock lấy từ shoot_expense.js.
   Kịch bản: KTV ứng 2tr (đã Paid) → claim 1,6tr kèm hoá đơn → hoàn 400k.
   Output: <outdir>/segNN.webm (+ poster.png) → build_video.sh ghép TTS + mp4.
   Chạy: node help/cobe_erp_documents/_tools/video_expense.js <outdir> */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const RECEIPT = __dirname + '/receipt_placeholder.png';
const OUT = process.argv[2] || '/tmp/video_expense';
fs.mkdirSync(OUT, { recursive: true });
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'a@tgdg.com', user_fullname:'Trần Văn Kỹ',
  employee:'HR-EMP-007', employee_name:'Trần Văn Kỹ', user_roles:['Employee'], inbox_access:false, is_technician:true, wiki_url:'' };
const INFO = { employee_name:'Trần Văn Kỹ', employee_id:'HR-EMP-007', next_log_type:'IN', checkins:[],
  phone_registered:true, wfh_today:{active:false}, feature_flags:{} };
const CONFIG = { valid:true, advance_account:'1362 - Tạm ứng nhân viên - CB', payable_account:'331 - Phải trả người bán - CB',
  expense_types:[ {name:'Vật tư sửa chữa',description:''}, {name:'Đi lại / xăng xe',description:''}, {name:'Ăn uống công tác',description:''} ],
  employee:'HR-EMP-007', employee_name:'Trần Văn Kỹ', company:'Cobe' };

const ADV_PAID = () => ({ name:'HR-EA-2026-00042', posting_date:'2026-06-25', advance_amount:2000000, fs_request_amount:2000000,
  paid_amount:2000000, claimed_amount:0, return_amount:0, purpose:'Vật tư công trình lắp đặt — Long An',
  status:'Paid', docstatus:1, fs_service_appointment:'SA-2026-00350', fs_work_order:'WO-2026-00214', pending_claim_amount:0 });
const ADV_NEW = { name:'HR-EA-2026-00045', posting_date:'2026-06-30', advance_amount:500000, fs_request_amount:500000,
  paid_amount:0, claimed_amount:0, return_amount:0, purpose:'Mua vật tư sửa chữa máy lạnh — Cty ABC',
  status:'Draft', docstatus:0, fs_service_appointment:'SA-2026-00350', fs_work_order:'WO-2026-00214', pending_claim_amount:0 };
const CLAIM_NEW = { name:'HR-EXP-2026-00031', posting_date:'2026-06-30', total_claimed_amount:1600000, total_sanctioned_amount:0,
  total_advance_amount:0, grand_total:0, status:'Draft', approval_status:'Draft', docstatus:0,
  fs_work_order:'WO-2026-00214', fs_service_appointment:'SA-2026-00350', sa_address:'12 Nguyễn Huệ, Q.1, TP.HCM' };
const CLAIMS_ALL = [ CLAIM_NEW,
  { name:'HR-EXP-2026-00028', posting_date:'2026-06-18', total_claimed_amount:900000, total_sanctioned_amount:900000,
    total_advance_amount:500000, grand_total:400000, status:'Unpaid', approval_status:'Approved', docstatus:1,
    fs_work_order:'WO-2026-00188', fs_service_appointment:null, sa_address:'' },
  { name:'HR-EXP-2026-00025', posting_date:'2026-06-10', total_claimed_amount:750000, total_sanctioned_amount:750000,
    total_advance_amount:750000, grand_total:0, status:'Paid', approval_status:'Approved', docstatus:1,
    fs_work_order:null, fs_service_appointment:null, sa_address:'' },
  { name:'HR-EXP-2026-00022', posting_date:'2026-06-05', total_claimed_amount:300000, total_sanctioned_amount:0,
    total_advance_amount:0, grand_total:0, status:'Draft', approval_status:'Rejected', docstatus:0,
    fs_work_order:null, fs_service_appointment:null, sa_address:'' },
];
const WO = [ { name:'WO-2026-00214', customer_name:'Cty TNHH ABC', work_order_status:'In Progress' } ];
const SA = [ { name:'SA-2026-00350', status:'Scheduled', scheduled_start:'2026-06-30 08:30:00', customer_name:'Cty TNHH ABC' } ];
const AVAILABLE = [ { name:'HR-EA-2026-00042', posting_date:'2026-06-25', paid_amount:2000000, claimed_amount:0,
  return_amount:0, unclaimed_amount:2000000, advance_account:'1362 - Tạm ứng nhân viên - CB' } ];
const ALLOC = [ { employee_advance:'HR-EA-2026-00042', posting_date:'2026-06-25', advance_paid:2000000,
  unclaimed_amount:2000000, allocated_amount:1600000, advance_account:'1362 - Tạm ứng nhân viên - CB',
  payment_entry:null, payment_entry_reference:null } ];
const PENDING_RETURN = () => ([{ name:'HR-EA-2026-00042', advance_amount:2000000, paid_amount:2000000, claimed_amount:1600000,
  return_amount:0, pending_return_amount:400000, purpose:'Vật tư công trình lắp đặt — Long An', posting_date:'2026-06-25',
  fs_service_appointment:'SA-2026-00350', fs_work_order:'WO-2026-00214' }]);
const UP = { name:'FILE-2026-0001', file_url:'/private/files/hoa-don-482.png', file_name:'hoa-don-482.png' };
const CLOCK = '2026-06-30T09:00:00';

// Ant Select trong modal: mở combobox theo placeholder rồi chọn option theo text
async function pick(page, placeholder, optionText) {
  const sel = page.locator('.ant-modal .ant-select', { hasText: placeholder }).first();
  await sel.locator('input').first().click();
  await page.waitForTimeout(800);
  const dd = page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
  await dd.locator('.ant-select-item-option', { hasText: optionText }).first().click();
  await page.waitForTimeout(800);
}
async function openFab(page, label) {
  await page.locator('[data-onboarding="fab-trigger"]').click();
  await page.waitForTimeout(800);
  await page.getByText(label, { exact:true }).last().click();
  await page.waitForSelector('.ant-modal', { timeout:6000 });
  await page.waitForTimeout(1500);
}

const segments = [
  { name:'seg1', tab:'advance',
    state:{ advances:[ADV_PAID()], holding:2000000, claims:CLAIMS_ALL.slice(1), pendingReturn:[] },
    actions: async (page) => {
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(OUT,'poster.png') });
      await page.waitForTimeout(2500);
    } },
  { name:'seg2', tab:'advance',
    state:{ advances:[ADV_PAID()], holding:2000000, claims:CLAIMS_ALL.slice(1), pendingReturn:[] },
    createAdvance(st){ st.advances=[ADV_NEW, ...st.advances]; return { name:ADV_NEW.name }; },
    actions: async (page) => {
      await page.waitForTimeout(2000);
      await openFab(page, 'Tạm ứng');
      await page.fill('.ant-modal .ant-input-number-input', '500000');
      await page.waitForTimeout(800);
      await page.fill('.ant-modal textarea', 'Mua vật tư sửa chữa máy lạnh — Cty ABC');
      await page.waitForTimeout(800);
      await pick(page, 'Chọn Work Order', 'WO-2026-00214');
      await pick(page, 'Chọn Service Appointment', 'SA-2026-00350');
      await page.locator('.ant-modal button', { hasText:/^Gửi yêu cầu$/ }).click();
      await page.waitForTimeout(4000);                          // modal đóng + dòng Draft mới
    } },
  { name:'seg3', tab:'advance',
    state:{ advances:[ADV_NEW, ADV_PAID()], holding:2000000, claims:CLAIMS_ALL.slice(1), pendingReturn:[] },
    createClaim(st){ const adv = st.advances.find(a=>a.name==='HR-EA-2026-00042');
      if (adv){ adv.claimed_amount=1600000; adv.pending_claim_amount=0; }
      st.claims=[CLAIM_NEW, ...st.claims]; st.holding=2000000; st.pendingReturn=PENDING_RETURN();
      return { name:CLAIM_NEW.name }; },
    actions: async (page) => {
      await page.waitForTimeout(2000);
      await openFab(page, 'Claim');
      await pick(page, 'Chọn Work Order', 'WO-2026-00214');
      await pick(page, 'Chọn Service Appointment', 'SA-2026-00350');
      await pick(page, 'Loại chi phí', 'Vật tư sửa chữa');
      await page.fill('.ant-modal .ant-input-number-input', '1600000');
      await page.waitForTimeout(600);
      await page.fill('.ant-modal textarea', 'Gas R32 + ống đồng — hoá đơn kèm');
      await page.waitForTimeout(800);
      await page.setInputFiles('.ant-modal input[type=file]', RECEIPT);
      await page.waitForTimeout(2000);                          // thumbnail hoá đơn hiện
      await page.getByRole('button', { name:'Preview phân bổ' }).click();
      await page.waitForTimeout(1500);
      await page.evaluate(() => { const el=document.querySelector('.ant-modal-body > div'); if (el) el.scrollTop=el.scrollHeight; });
      await page.waitForTimeout(3000);                          // xem bảng phân bổ FIFO
      await page.locator('.ant-modal button', { hasText:/^Gửi yêu cầu$/ }).click();
      await page.waitForTimeout(4000);                          // toast "Tạo claim … thành công!"
    } },
  { name:'seg4', tab:'claim',
    state:{ advances:[ADV_NEW, Object.assign(ADV_PAID(),{claimed_amount:1600000})], holding:2000000,
      claims:CLAIMS_ALL, pendingReturn:PENDING_RETURN() },
    actions: async (page) => {
      await page.waitForTimeout(5000);
    } },
  { name:'seg5', tab:'advance',
    state:{ advances:[Object.assign(ADV_PAID(),{claimed_amount:1600000}), ADV_NEW], holding:400000,
      claims:CLAIMS_ALL, pendingReturn:PENDING_RETURN() },
    createReturn(st){ const adv = st.advances.find(a=>a.name==='HR-EA-2026-00042');
      if (adv){ adv.return_amount=400000; adv.status='Partly Claimed and Returned'; }
      st.pendingReturn=[]; st.holding=0; return { success:true }; },
    actions: async (page) => {
      await page.waitForTimeout(2500);
      await openFab(page, 'Hoàn ứng');
      await pick(page, 'Chọn khoản ứng cần hoàn', 'HR-EA-2026-00042');
      await page.waitForTimeout(2500);                          // tóm tắt + số tiền tự điền 400k
      await page.locator('.ant-modal button', { hasText:/^Hoàn ứng$/ }).click();
      await page.waitForTimeout(4000);
    } },
];

(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  for (const s of segments) {
    const ctx = await browser.newContext({ viewport:{width:390,height:844}, locale:'vi-VN',
      recordVideo:{ dir:OUT, size:{width:390,height:844} } });
    await ctx.addInitScript((b)=>{ Object.assign(window, b.boot);
      try{ localStorage.setItem('mw_guide_seen_v1','1');
        sessionStorage.setItem('expense_active_tab', b.tab); }catch(e){} }, { boot:BOOT, tab:s.tab });
    const page = await ctx.newPage();
    await page.clock.install({ time: new Date(CLOCK) });
    const st = s.state;
    await page.route('**/*', async (route) => {
      const u = new URL(route.request().url()); const p = u.pathname;
      if (u.hostname==='localhost') {
        if (p.startsWith('/api/method/')) {
          if (p.includes('expense_api.validate_expense_config')) return route.fulfill(api(CONFIG));
          if (p.includes('expense_api.get_ktv_employee_advances')) return route.fulfill(api({ entries:st.advances, total:st.advances.length, total_holding:st.holding }));
          if (p.includes('expense_api.get_ktv_expense_claims')) return route.fulfill(api({ entries:st.claims, total:st.claims.length }));
          if (p.includes('expense_api.get_employee_return_journal_entries')) return route.fulfill(api({ entries:[], total:0 }));
          if (p.includes('expense_api.get_advances_pending_return')) return route.fulfill(api(st.pendingReturn));
          if (p.includes('expense_api.get_available_advances_for_claim')) return route.fulfill(api(AVAILABLE));
          if (p.includes('expense_api.preview_expense_claim_allocation')) return route.fulfill(api(ALLOC));
          if (p.includes('expense_api.get_work_orders_for_expense')) return route.fulfill(api(WO));
          if (p.includes('expense_api.get_service_appointments_for_wo')) return route.fulfill(api(SA));
          if (p.includes('expense_api.create_employee_advance')) { await new Promise(r=>setTimeout(r,900));
            return route.fulfill(api(s.createAdvance ? s.createAdvance(st) : {})); }
          if (p.includes('expense_api.create_expense_claim')) { await new Promise(r=>setTimeout(r,900));
            return route.fulfill(api(s.createClaim ? s.createClaim(st) : { name:'X' })); }
          if (p.includes('expense_api.create_return_entry')) { await new Promise(r=>setTimeout(r,900));
            return route.fulfill(api(s.createReturn ? s.createReturn(st) : {})); }
          if (p.includes('upload_file')) { await new Promise(r=>setTimeout(r,700)); return route.fulfill(api(UP)); }
          if (p.includes('attendance.get_attendance_info')) return route.fulfill(api(INFO));
          if (p.includes('approval.get_pending_count')) return route.fulfill(api({count:0}));
          if (p.includes('push.get_push_config')) return route.fulfill(api({enabled:false}));
          return route.fulfill(api(null));
        }
        if (p.startsWith('/private/files/')) return route.fulfill({ path: RECEIPT });
        if (p.startsWith('/assets/hr_for_cobegroup/')) { const f=path.join(PUBLIC,p.replace('/assets/hr_for_cobegroup/','')); return fs.existsSync(f)?route.fulfill({path:f}):route.fulfill({status:404,body:''}); }
        if (p.startsWith('/my-workspace')) return route.fulfill({ contentType:'text/html', body:indexHtml });
        return route.fulfill({ status:204, body:'' });
      }
      return route.continue();
    });
    await page.goto('http://localhost/my-workspace/expense', { waitUntil:'domcontentloaded' }).catch(()=>{});
    await page.waitForTimeout(1500);
    await s.actions(page);
    await ctx.close();
    const v = await page.video().path();
    fs.renameSync(v, path.join(OUT, s.name + '.webm'));
    console.log('recorded', s.name);
  }
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
