/* shoot_expense.js — chụp ảnh GUIDE tab "Chi phí" (Tạm ứng / Claim / Hoàn ứng)
   từ APP THẬT (render React + mock API + freeze giờ). Cùng khuôn shoot_dexuat.js.
   Chạy: node help/cobe_erp_documents/_tools/shoot_expense.js
   UI đổi → build lại PWA rồi chạy lại. */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/guide/expense';
fs.mkdirSync(OUT, { recursive: true });
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status:200, contentType:'application/json', body: JSON.stringify({ message:m }) });

const BOOT = { frappe_csrf_token:'x', site_name:'cobe.cc', user:'a@tgdg.com', user_fullname:'Nguyễn Văn A',
  employee:'HR-EMP-001', employee_name:'Nguyễn Văn A', user_roles:['Employee'], inbox_access:false, is_technician:false, wiki_url:'' };
const INFO = { employee_name:'Nguyễn Văn A', employee_id:'HR-EMP-001', next_log_type:'IN', checkins:[],
  phone_registered:true, wfh_today:{active:false}, feature_flags:{} };

const CONFIG = { valid:true, advance_account:'1362 - Tạm ứng nhân viên - CB', payable_account:'331 - Phải trả người bán - CB',
  expense_types:[ {name:'Vật tư sửa chữa',description:''}, {name:'Đi lại / xăng xe',description:''}, {name:'Ăn uống công tác',description:''} ],
  employee:'HR-EMP-001', employee_name:'Nguyễn Văn A', company:'Cobe' };

// Kịch bản khớp Hanh-Trinh-Chi-Phi.md: ứng 2tr → claim 1,6tr → còn hoàn 400k
const ADV_DRAFT = { name:'HR-EA-2026-00045', posting_date:'2026-06-30', advance_amount:500000, fs_request_amount:500000,
  paid_amount:0, claimed_amount:0, return_amount:0, purpose:'Mua vật tư sửa chữa máy lạnh — Cty ABC',
  status:'Draft', docstatus:0, fs_service_appointment:null, fs_work_order:null, pending_claim_amount:0 };
const ADV_PAID = { name:'HR-EA-2026-00042', posting_date:'2026-06-25', advance_amount:2000000, fs_request_amount:2000000,
  paid_amount:2000000, claimed_amount:1600000, return_amount:0, purpose:'Vật tư công trình lắp đặt — Long An',
  status:'Paid', docstatus:1, fs_service_appointment:'SA-2026-00350', fs_work_order:'WO-2026-00214', pending_claim_amount:0 };

const CLAIMS = [
  { name:'HR-EXP-2026-00031', posting_date:'2026-06-30', total_claimed_amount:1600000, total_sanctioned_amount:0,
    total_advance_amount:0, grand_total:0, status:'Draft', approval_status:'Draft', docstatus:0,
    fs_work_order:'WO-2026-00214', fs_service_appointment:'SA-2026-00350', sa_address:'12 Nguyễn Huệ, Q.1, TP.HCM' },
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
const PENDING_RETURN = [ { name:'HR-EA-2026-00042', advance_amount:2000000, paid_amount:2000000, claimed_amount:1600000,
  return_amount:0, pending_return_amount:400000, purpose:'Vật tư công trình lắp đặt — Long An', posting_date:'2026-06-25',
  fs_service_appointment:'SA-2026-00350', fs_work_order:'WO-2026-00214' } ];

const MOCKS = {
  'expense_api.validate_expense_config': CONFIG,
  'expense_api.get_ktv_employee_advances': { entries:[ADV_DRAFT, ADV_PAID], total:2, total_holding:400000 },
  'expense_api.get_ktv_expense_claims': { entries:CLAIMS, total:CLAIMS.length },
  'expense_api.get_employee_return_journal_entries': { entries:[], total:0 },
  'expense_api.get_advances_pending_return': PENDING_RETURN,
  'expense_api.get_available_advances_for_claim': AVAILABLE,
  'expense_api.preview_expense_claim_allocation': ALLOC,
  'expense_api.get_work_orders_for_expense': WO,
  'expense_api.get_service_appointments_for_wo': SA,
  'attendance.get_attendance_info': INFO,
  'approval.get_pending_count': { count:0 }, 'push.get_push_config': { enabled:false },
};

// Ant Select: click combobox (theo placeholder) mở dropdown → chọn option theo text
async function pick(page, placeholder, optionText) {
  const sel = page.locator('.ant-modal .ant-select', { hasText: placeholder }).first();
  await sel.locator('input').first().click();
  await page.waitForTimeout(400);
  const dd = page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
  await dd.locator('.ant-select-item-option', { hasText: optionText }).first().click();
  await page.waitForTimeout(400);
}

async function openFab(page, label) {
  // FAB "+" là trigger của FloatingActionMenu (div data-onboarding="fab-trigger")
  await page.locator('[data-onboarding="fab-trigger"]').click();
  await page.waitForTimeout(400);
  await page.getByText(label, { exact:true }).last().click();
  await page.waitForSelector('.ant-modal', { timeout:5000 });
  await page.waitForTimeout(600);
}

const screens = [
  // 1) Tab Tạm ứng — Draft chờ duyệt + Paid có nút Claim / Hoàn ứng
  { name:'01-advance-tab', tab:'advance' },
  // 2) Form "Tạo yêu cầu tạm ứng" điền đủ + gắn WO/SA
  { name:'02-advance-form', tab:'advance', prep: async (page) => {
      await openFab(page, 'Tạm ứng');
      await page.fill('.ant-modal .ant-input-number-input', '500000');
      await page.fill('.ant-modal textarea', 'Mua vật tư sửa chữa máy lạnh — Cty ABC');
      await pick(page, 'Chọn Work Order', 'WO-2026-00214');
      await pick(page, 'Chọn Service Appointment', 'SA-2026-00350');
    } },
  // 3) Form "Tạo yêu cầu chi phí" — WO + dòng chi phí (phần trên)
  { name:'03-claim-form', tab:'advance', prep: async (page) => {
      await openFab(page, 'Claim');
      await pick(page, 'Chọn Work Order', 'WO-2026-00214');
      await pick(page, 'Chọn Service Appointment', 'SA-2026-00350');
      await pick(page, 'Loại chi phí', 'Vật tư sửa chữa');
      await page.fill('.ant-modal .ant-input-number-input', '1600000');
      await page.fill('.ant-modal textarea', 'Gas R32 + ống đồng, hoá đơn kèm');
    } },
  // 4) Cùng modal — bấm "Preview phân bổ", cuộn xuống phần Trừ ứng + tổng kết
  { name:'04-claim-allocation', tab:'advance', prep: async (page) => {
      await openFab(page, 'Claim');
      await pick(page, 'Chọn Work Order', 'WO-2026-00214');
      await pick(page, 'Chọn Service Appointment', 'SA-2026-00350');
      await pick(page, 'Loại chi phí', 'Vật tư sửa chữa');
      await page.fill('.ant-modal .ant-input-number-input', '1600000');
      await page.fill('.ant-modal textarea', 'Gas R32 + ống đồng, hoá đơn kèm');
      await page.getByRole('button', { name:'Preview phân bổ' }).click();
      await page.waitForTimeout(800);
      await page.evaluate(() => {
        const el = document.querySelector('.ant-modal-body > div');
        if (el) el.scrollTop = el.scrollHeight;
      });
      await page.waitForTimeout(400);
    } },
  // 5) Form "Hoàn ứng" — chọn khoản ứng, tiền tự điền = số dư
  { name:'05-return-form', tab:'advance', prep: async (page) => {
      await openFab(page, 'Hoàn ứng');
      await pick(page, 'Chọn khoản ứng cần hoàn', 'HR-EA-2026-00042');
    } },
  // 6) Tab Claim — đủ 4 trạng thái Draft / Unpaid / Paid / Từ chối
  { name:'06-claim-tab', tab:'claim' },
];

(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  for (const s of screens) {
    const ctx = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, locale:'vi-VN' });
    await ctx.addInitScript((b)=>{ Object.assign(window, b.boot);
      try{ localStorage.setItem('mw_guide_seen_v1','1');
        sessionStorage.setItem('expense_active_tab', b.tab); }catch(e){} }, { boot:BOOT, tab:s.tab });
    const page = await ctx.newPage();
    await page.clock.install({ time: new Date('2026-06-30T09:00:00') });
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
    await page.goto('http://localhost/my-workspace/expense', { waitUntil:'domcontentloaded' }).catch(()=>{});
    await page.waitForTimeout(1500);
    if (s.prep) await s.prep(page);
    await page.screenshot({ path: path.join(OUT, s.name + '.png') });
    console.log('shot', s.name);
    await ctx.close();
  }
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
