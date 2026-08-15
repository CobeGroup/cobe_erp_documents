/* shoot_leave_cancel.js — ảnh cho doc "Huỷ đơn nghỉ đã duyệt & tra cứu đơn đã xử".
   Chụp từ PWA build THẬT + mock API (không cần site chạy).
   Gồm: 4 tab màn Duyệt đơn (Chờ duyệt / Đã duyệt / Từ chối / Đã hủy), chi tiết đơn
   đã huỷ (chỉ đọc), và màn Nghỉ phép của nhân viên với tab "Đã hủy" kèm lý do.
   Chạy: node help/cobe_erp_documents/_tools/shoot_leave_cancel.js
   UI đổi → npm run build (PWA) rồi chạy lại. */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/hr_for_cobegroup/hr_for_cobegroup/public';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/guide/huy-don';
const indexHtml = fs.readFileSync(PUBLIC + '/attendance-pwa/index.html', 'utf8');
const api = (m) => ({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: m }) });

// Người đăng nhập = HR kiêm người duyệt. Tên/mã đều là DEMO — ảnh doc không được lộ PII.
const BOOT = {
  frappe_csrf_token: 'x', site_name: 'cobe.cc', user: 'hr@tgdg.com', user_fullname: 'Nguyễn Văn Quản',
  employee: 'HR-EMP-010', employee_name: 'Nguyễn Văn Quản',
  user_roles: ['Employee', 'Leave Approver', 'HR Manager'], inbox_access: true, is_technician: false, wiki_url: '',
};

const PENDING = { is_approver: true, items: [
  { doctype: 'Leave Application', name: 'HR-LAP-2026-00021', employee: 'HR-EMP-002', employee_number: '0102',
    employee_name: 'Trần Thị Bình', state: 'Pending Manager',
    summary: 'Phép năm · 2026-08-20 → 2026-08-20 (0.5 ngày)', reason: 'Đi khám buổi sáng',
    creation: '2026-08-14T07:30:00', can_forward: true },
  { doctype: 'Leave Application', name: 'HR-LAP-2026-00019', employee: 'HR-EMP-003', employee_number: '0103',
    employee_name: 'Lê Văn Cường', state: 'Manager Approved',
    summary: 'Phép năm · 2026-08-24 → 2026-08-25 (2 ngày)', reason: 'Về quê có việc gia đình',
    creation: '2026-08-13T16:10:00', can_forward: true },
] };

const HANDLED = {
  approved: { items: [
    { doctype: 'Leave Application', name: 'HR-LAP-2026-00014', employee: 'HR-EMP-004', employee_number: '0104',
      employee_name: 'Phạm Thị Dung', state: 'Submitted',
      summary: 'Phép năm · 2026-08-10 → 2026-08-11 (2 ngày)', reason: 'Việc gia đình',
      creation: '2026-08-05T09:00:00', handled_on: '2026-08-06T10:12:00' },
    { doctype: 'HR Overtime Request', name: 'HR-OTR-2026-000318', employee: 'HR-EMP-005', employee_number: '0105',
      employee_name: 'Hoàng Minh Đức', state: 'Approved',
      summary: 'Làm thêm 2026-08-08 · 18:00–20:00 (2h) · Nghỉ bù', reason: 'Trực kho cuối tháng',
      creation: '2026-08-08T20:05:00', handled_on: '2026-08-09T08:30:00' },
  ] },
  rejected: { items: [
    { doctype: 'Leave Application', name: 'HR-LAP-2026-00011', employee: 'HR-EMP-006', employee_number: '0106',
      employee_name: 'Vũ Văn Hoàn', state: 'Rejected',
      summary: 'Phép năm · 2026-08-03 → 2026-08-03 (1 ngày)', reason: 'Việc riêng',
      outcome_reason: 'Trùng lịch trực, đề nghị dời sang tuần sau',
      creation: '2026-08-01T10:00:00', handled_on: '2026-08-02T11:30:00' },
  ] },
  cancelled: { items: [
    { doctype: 'Leave Application', name: 'HR-LAP-2026-00008', employee: 'HR-EMP-007', employee_number: '0107',
      employee_name: 'Đặng Hoàng Nam', state: 'Cancelled',
      summary: 'Nghỉ Không Lương · 2026-08-12 → 2026-08-12 (1 ngày)', reason: 'Việc gia đình',
      outcome_reason: 'Nhân viên đi làm lại, không nghỉ nữa',
      creation: '2026-08-07T08:00:00', handled_on: '2026-08-11T15:00:00' },
  ] },
};

// Màn "Nghỉ phép" — góc nhìn NHÂN VIÊN bị huỷ đơn.
const MY_LEAVES = { applications: [
  { name: 'HR-LAP-2026-00025', leave_type: 'Phép Năm', from_date: '2026-08-28', to_date: '2026-08-28',
    total_leave_days: 1, description: 'Việc riêng', status: 'Open', workflow_state: 'Pending Manager',
    docstatus: 0, posting_date: '2026-08-14', half_day: 0, leave_approver: 'quan.le@tgdg.com' },
  { name: 'HR-LAP-2026-00014', leave_type: 'Phép Năm', from_date: '2026-08-10', to_date: '2026-08-11',
    total_leave_days: 2, description: 'Việc gia đình', status: 'Approved', workflow_state: 'Submitted',
    docstatus: 1, posting_date: '2026-08-05', half_day: 0, leave_approver: 'quan.le@tgdg.com' },
  { name: 'HR-LAP-2026-00011', leave_type: 'Phép Năm', from_date: '2026-08-03', to_date: '2026-08-03',
    total_leave_days: 1, description: 'Việc riêng', status: 'Rejected', workflow_state: 'Rejected',
    docstatus: 1, posting_date: '2026-08-01', half_day: 0, leave_approver: 'quan.le@tgdg.com',
    custom_rejection_reason: 'Trùng lịch trực, đề nghị dời sang tuần sau' },
  { name: 'HR-LAP-2026-00008', leave_type: 'Nghỉ Không Lương', from_date: '2026-08-12', to_date: '2026-08-12',
    total_leave_days: 1, description: 'Việc gia đình', status: 'Cancelled', workflow_state: 'Cancelled',
    docstatus: 2, posting_date: '2026-08-07', half_day: 0, leave_approver: 'quan.le@tgdg.com',
    custom_cancel_reason: 'Nhân viên đi làm lại, không nghỉ nữa' },
] };

const LEAVE_TYPES = { leave_types: [
  { name: 'Phép Năm', balance: 8.5, max_leaves_allowed: 12, leaves_taken: 3.5, leaves_pending_approval: 1 },
  { name: 'Nghỉ Không Lương', balance: 0, is_lwp: true },
], employee: 'HR-EMP-007' };

const MOCKS = {
  'approval.get_my_pending_approvals': PENDING,
  'approval.get_pending_count': { count: PENDING.items.length },
  'leave.get_my_leave_applications': MY_LEAVES,
  'leave.get_leave_types_for_employee': LEAVE_TYPES,
  'leave.get_half_workdays': { dates: [] },
  'attendance.get_attendance_info': { employee_name: 'Nguyễn Văn Quản', employee_id: 'HR-EMP-010', next_log_type: 'IN', checkins: [], phone_registered: true, wfh_today: { active: false }, feature_flags: {} },
  'push.get_push_config': { enabled: false },
  'overtime.get_approved_for_approver': { is_approver: true, items: [] },
};

const CLOCK = '2026-08-15T10:00:00';

async function setup(browser, route0) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'vi-VN' });
  await ctx.addInitScript((b) => { Object.assign(window, b); try { localStorage.setItem('mw_guide_seen_v1', '1'); } catch (e) {} }, BOOT);
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date(CLOCK) });
  await page.route('**/*', async (r) => {
    const u = new URL(r.request().url()), p = u.pathname;
    if (u.hostname === 'localhost') {
      if (p.startsWith('/api/method/')) {
        if (p.includes('approval.get_my_handled_approvals')) {
          const b = u.searchParams.get('bucket') || JSON.parse(r.request().postData() || '{}').bucket;
          return r.fulfill(api(HANDLED[b] || { items: [] }));
        }
        for (const k in MOCKS) if (p.includes(k)) return r.fulfill(api(MOCKS[k]));
        return r.fulfill(api(null));
      }
      if (p.startsWith('/assets/hr_for_cobegroup/')) {
        const f = path.join(PUBLIC, p.replace('/assets/hr_for_cobegroup/', ''));
        return fs.existsSync(f) ? r.fulfill({ path: f }) : r.fulfill({ status: 404, body: '' });
      }
      if (p.startsWith('/my-workspace')) return r.fulfill({ contentType: 'text/html', body: indexHtml });
      return r.fulfill({ status: 204, body: '' });
    }
    return r.continue();
  });
  await page.goto('http://localhost/my-workspace' + route0, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(1500);
  return { ctx, page };
}

async function tab(page, label) {
  await page.locator('.ant-segmented-item-label', { hasText: new RegExp('^' + label) }).first().click();
  await page.waitForTimeout(800);
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  fs.mkdirSync(OUT, { recursive: true });
  const shot = async (page, name) => {
    await page.screenshot({ path: path.join(OUT, name + '.png') });
    console.log('shot', name);
  };

  // 01-04 — bốn tab của màn Duyệt đơn
  {
    const { ctx, page } = await setup(browser, '/approvals');
    await shot(page, '01-tab-cho-duyet');
    await tab(page, 'Đã duyệt'); await shot(page, '02-tab-da-duyet');
    await tab(page, 'Từ chối'); await shot(page, '03-tab-tu-choi');
    await tab(page, 'Đã hủy'); await shot(page, '04-tab-da-huy');

    // 05 — chi tiết đơn đã huỷ: chỉ đọc, không còn nút duyệt/từ chối
    await page.locator('.ant-card').first().click();
    await page.waitForTimeout(700);
    await shot(page, '05-chi-tiet-don-da-huy');
    await ctx.close();
  }

  // 06-07 — màn Nghỉ phép của nhân viên
  {
    const { ctx, page } = await setup(browser, '/leave');
    await shot(page, '06-nhanvien-tab-cho-duyet');
    await tab(page, 'Đã hủy'); await shot(page, '07-nhanvien-don-bi-huy');
    await ctx.close();
  }

  await browser.close();
  console.log('\nXong →', OUT);
})();
