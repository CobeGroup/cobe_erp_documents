/* shoot_desk_ticket_filter.js — chụp bộ ảnh doc "Lọc ticket bảo dưỡng" (Desk thật)
   → users/images/desk/ticket-filter/.

   Dữ liệu: ticket thật trên bản copy prod. Cột Customer hiển thị MÃ khách (2205...) chứ
   không phải tên, nhưng vẫn blur mọi ô có dạng số điện thoại cho chắc.

   BẪY đã vấp (giữ nguyên, đừng "tối ưu"):
   - fullPage → ảnh trắng. Phải chụp viewport, muốn cắt thì dùng clip.
   - Mỗi ảnh mở browser MỚI, không tái dùng context — list view giữ filter cũ trong localStorage.
   - Đóng modal bằng click .btn-modal-close, KHÔNG bấm Escape (Escape đóng luôn cả popover lọc).
   - Toán tử và giá trị Timespan là <select> NATIVE → dropdown do OS vẽ, Playwright không
     chụp được. Nên chỉ chụp dòng lọc ĐÃ chọn sẵn, còn danh sách lựa chọn thì liệt kê
     bằng chữ trong file .md.

   Chạy:
     SID=<sid admin> BASE=http://cobe.cc:8002 \
       node help/cobe_erp_documents/_tools/shoot_desk_ticket_filter.js
   (SID: bench --site cobe.cc browse --user Administrator) */
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/desk/ticket-filter';
const BASE = (process.env.BASE || 'http://cobe.cc:8002').replace(/\/$/, '');
const HOST = new URL(BASE).hostname;
const SID = process.env.SID || '';
if (!SID) { console.error('Thiếu SID (bench --site cobe.cc browse --user Administrator)'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

const LIST = '/app/service-ticket-reminder';

const HIDE_CSS = `
  .onboarding-widget-box, .ce-toast, .desk-alert, .form-message { display:none !important; }
  .navbar .dropdown-notifications, .navbar-nav .dropdown-message { filter: blur(6px); }
`;

async function shoot({ name, route, width = 1600, height = 1000, clipH, prep, note }) {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, locale: 'vi-VN' });
  await ctx.addCookies([{ name: 'sid', value: SID, domain: HOST, path: '/' }]);
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(5500);
  for (let i = 0; i < 2; i++) {
    await page.locator('.modal.show .btn-modal-close').first().click({ timeout: 800 }).catch(() => {});
    await page.waitForTimeout(250);
  }
  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
  if (prep) await prep(page);
  // che PII: bất kỳ ô nào chứa dãy số kiểu SĐT
  await page.evaluate(() => {
    document.querySelectorAll('.list-row-col, .list-row-col a, .list-row-col span').forEach((el) => {
      if (/0\d{8,10}/.test(el.innerText || '')) el.style.filter = 'blur(5px)';
    });
  }).catch(() => {});
  await page.waitForTimeout(400);
  const opts = { path: path.join(OUT, name) };
  if (clipH) opts.clip = { x: 0, y: 0, width, height: clipH };
  await page.screenshot(opts);
  console.log('  ✓', name, note ? '— ' + note : '');
  await browser.close();
}

const openFilters = async (p) => {
  await p.locator('.filter-button').first().click({ timeout: 3000 }).catch(() => {});
  await p.waitForTimeout(1400);
};

// URL lọc: Frappe đọc JSON trong query string, vd ?avg_schedule_date=["Timespan","this month"]
const q = (obj) => LIST + '?' + Object.entries(obj)
  .map(([k, v]) => k + '=' + encodeURIComponent(typeof v === 'string' ? v : JSON.stringify(v)))
  .join('&');

const ONLY = (process.env.ONLY || 'all').split(',');
const want = (k) => ONLY.includes('all') || ONLY.includes(k);

(async () => {
  // 1) Thanh công cụ + hàng lọc nhanh
  if (want('a')) {
    await shoot({ name: '01-thanh-cong-cu.png', route: LIST, clipH: 560, note: 'toolbar + lọc nhanh' });

    // 2) Lọc nhanh: Primary Status = Open
    await shoot({
      name: '02-loc-nhanh.png', route: q({ primary_status: 'Open' }), clipH: 560,
      note: 'quick filter Primary Status',
    });

    // 3) Bảng lọc đầy đủ
    await shoot({
      name: '03-bang-loc.png', route: q({ primary_status: 'Open' }), clipH: 620,
      prep: openFilters, note: 'popover Filters',
    });

    // 4) Thêm điều kiện — danh sách trường (awesomplete, chụp được)
    await shoot({
      name: '04-chon-truong.png', route: q({ primary_status: 'Open' }), clipH: 700,
      prep: async (p) => {
        await openFilters(p);
        await p.locator('.filter-popover .add-filter').first().click({ timeout: 3000 }).catch(() => {});
        await p.waitForTimeout(900);
        // Nhãn trường trong Desk là TIẾNG ANH → gõ tiếng Việt không ra gợi ý nào.
        // Phải gõ từng phím (type) chứ fill() không kích hoạt awesomplete.
        const inp = p.locator('.filter-popover .fieldname-select-area input').last();
        await inp.click({ timeout: 3000 }).catch(() => {});
        await p.waitForTimeout(400);
        await inp.type('sched', { delay: 120 }).catch(() => {});
        await p.waitForTimeout(1200);
      },
      note: 'gõ để tìm trường',
    });
  }

  // 5..7) Ba công thức theo ngày
  if (want('b')) {
    await shoot({
      name: '05-thang-nay.png', clipH: 620,
      route: q({ primary_status: 'Open', avg_schedule_date: ['Timespan', 'this month'] }),
      prep: openFilters, note: 'Timespan = This Month',
    });
    await shoot({
      name: '06-khoang-ngay.png', clipH: 620,
      route: q({ primary_status: 'Open', avg_schedule_date: ['Between', ['2026-08-01', '2026-08-31']] }),
      prep: openFilters, note: 'Between',
    });
    await shoot({
      name: '07-qua-han.png', clipH: 620,
      route: q({ primary_status: 'Open', avg_schedule_date: ['<', '2026-07-28'] }),
      prep: openFilters, note: 'quá hạn',
    });
  }

  // 8..11) Lọc theo người / trạng thái / công ty / cờ giữ tay
  if (want('c')) {
    await shoot({
      name: '08-nguoi-phu-trach.png', clipH: 620,
      route: q({ primary_status: 'Open', account_manager: 'hanh.le@thegioidiengiai.com.vn' }),
      prep: openFilters, note: 'theo người phụ trách',
    });
    await shoot({
      name: '09-chua-gan.png', clipH: 620,
      route: q({ primary_status: 'Open', account_manager: ['is', 'not set'] }),
      prep: openFilters, note: 'chưa gán người',
    });
    await shoot({
      name: '10-giu-tay.png', clipH: 620,
      route: q({ primary_status: 'Open', hold_auto_assign: 1 }),
      prep: openFilters, note: 'cờ giữ lại phân tay',
    });
    await shoot({
      name: '11-ket-hop.png', clipH: 620,
      route: q({
        primary_status: 'Open',
        account_manager: 'hanh.le@thegioidiengiai.com.vn',
        avg_schedule_date: ['Timespan', 'this month'],
      }),
      prep: openFilters, note: '3 điều kiện',
    });
  }

  // 12) Sắp xếp
  if (want('d')) {
    await shoot({
      name: '12-sap-xep.png', clipH: 620,
      route: q({ primary_status: 'Open', avg_schedule_date: ['Timespan', 'this month'] }),
      prep: async (p) => {
        await p.locator('.sort-selector-button').first().click({ timeout: 3000 }).catch(() => {});
        await p.waitForTimeout(1000);
      },
      note: 'menu sắp xếp',
    });

    // 13) Lưu bộ lọc
    await shoot({
      name: '13-luu-bo-loc.png', clipH: 480,
      route: q({ primary_status: 'Open', avg_schedule_date: ['Timespan', 'this month'] }),
      prep: async (p) => {
        await p.locator('button:has-text("Saved Filters")').first().click({ timeout: 3000 }).catch(() => {});
        await p.waitForTimeout(1200);
      },
      note: 'Saved Filters → Save Current Filter',
    });
  }
  console.log('Xong →', OUT);
})();
