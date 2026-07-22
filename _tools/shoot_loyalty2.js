/* shoot_loyalty2.js — bổ sung ảnh cho bộ doc Loyalty (đợt rà soát 07/2026).
   Chụp từ Frappe Desk THẬT trên bản restore prod.

   PII: mọi tên/SĐT khách trong bảng đều bị thay bằng nhãn giả trước khi chụp,
   và URL webhook + token của bên thứ 3 bị che (doc này publish công khai).

   Auth bằng SID tạm (không đổi credential):
     bench --site cobe.cc browse --user Administrator

   Chạy:
     SID=<sid> BASE=http://cobe.cc:8002 \
     node help/cobe_erp_documents/_tools/shoot_loyalty2.js
*/
const PW = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright';
const { chromium } = require(PW);
const fs = require('fs'), path = require('path');

const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/loyalty';
const BASE = (process.env.BASE || 'http://cobe.cc:8002').replace(/\/$/, '');
const SID = process.env.SID || '';
if (!SID) { console.error('Thiếu SID: bench --site cobe.cc browse --user Administrator'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

const u = (s) => BASE + s;

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1460, height: 940 }, deviceScaleFactor: 2, locale: 'vi-VN' });
  await ctx.addCookies([{ name: 'sid', value: SID, domain: new URL(BASE).hostname, path: '/' }]);
  const page = await ctx.newPage();
  page.setDefaultTimeout(25000);

  const shot = async (name, opts = {}) => {
    await page.screenshot({ path: path.join(OUT, name), ...opts });
    console.log('  ✓', name);
  };

  const open = async (route, wait = 3500) => {
    await page.goto(u(route), { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForSelector('.page-head, .layout-main, .title-text, .page-card', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(wait);
    await page.evaluate(() => {
      document.querySelectorAll('.desk-alert, .notifications-list, .modal-backdrop').forEach(e => e.remove());
    }).catch(() => {});
  };

  /* Che URL/token bên thứ 3 — doc publish công khai */
  const maskSecrets = async () => {
    await page.evaluate(() => {
      document.querySelectorAll('input, textarea').forEach((el) => {
        const v = (el.value || '');
        if (/^https?:\/\//i.test(v)) el.value = 'https://<url-endpoint-cua-ben-thu-3>';
        if (/token|secret|auth/i.test(el.getAttribute('data-fieldname') || '')) el.value = '••••••••••••';
      });
      document.querySelectorAll('[data-fieldname*="url"] .control-value, .grid-static-col').forEach((el) => {
        if (/^https?:\/\//i.test(el.textContent.trim())) el.textContent = 'https://<url-endpoint>';
      });
    }).catch(() => {});
  };

  /* Thay tên/SĐT khách bằng nhãn giả trong bảng danh sách */
  const maskCustomers = async () => {
    await page.evaluate(() => {
      const fake = ['Khách hàng A', 'Khách hàng B', 'Khách hàng C', 'Khách hàng D', 'Khách hàng E',
                    'Khách hàng F', 'Khách hàng G', 'Khách hàng H', 'Khách hàng I', 'Khách hàng K'];
      let i = 0;
      document.querySelectorAll('table tbody tr').forEach((tr) => {
        const label = fake[i % fake.length]; i++;
        tr.querySelectorAll('td').forEach((td) => {
          const t = td.textContent.trim();
          if (/^(0|\+?84)\d{8,10}$/.test(t.replace(/[ .-]/g, ''))) { td.textContent = '09xx xxx xxx'; return; }
          if (/^(CUST-|\d{4,6}$)/.test(t)) return;                 // giữ mã khách
          if (t.length > 3 && /[A-Za-zÀ-ỹ]/.test(t) && !/^(Cá nhân|Công ty|All Territories|Individual|Company)/.test(t)
              && td.cellIndex <= 2) td.textContent = label;
        });
      });
    }).catch(() => {});
  };

  const clickGridPencil = async (rowIdx = 0) => {
    const btns = await page.$$('.grid-row .btn-open-row, .grid-row .edit-grid-row');
    if (btns[rowIdx]) { await btns[rowIdx].click().catch(() => {}); await page.waitForTimeout(2200); }
  };

  const tasks = [

    /* 1. Loyalty Program — nơi đặt from_date + collection_factor + conversion_factor */
    async () => {
      await open('/app/loyalty-program');
      const link = await page.$('.list-row-container a.ellipsis, .list-subject a');
      if (link) { await link.click().catch(() => {}); await page.waitForTimeout(4000); }
      await shot('loyalty-program-form.png', { fullPage: true });
    },

    /* 2. COBE Loyalty Settings — mở rộng dòng company (các ô referral bị ẩn trong lưới) */
    async () => {
      await open('/app/cobe-loyalty-settings');
      await clickGridPencil(0);
      await shot('settings-company-expanded.png', { fullPage: true });
    },

    /* 3. Sync Settings — mở rộng dòng endpoint, thấy nhóm ô include_* */
    async () => {
      await open('/app/cobe-loyalty-sync-settings');
      await clickGridPencil(0);
      await maskSecrets();
      await page.waitForTimeout(400);
      await shot('sync-endpoint-expanded.png', { fullPage: true });
    },

    /* 4. Lead — khai người giới thiệu (Source = Reference làm hiện "From Customer") */
    async () => {
      await open('/app/lead/new');
      await page.evaluate(() => {
        const d = window.cur_frm;
        if (d) { d.set_value('first_name', 'Nguyễn Văn A'); d.set_value('utm_source', 'Reference'); }
      }).catch(() => {});
      await page.waitForTimeout(3000);
      const cf = await page.$('[data-fieldname="customer"]');
      if (cf) await cf.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(1200);
      await shot('lead-referral-fields.png', { fullPage: true });
    },

    /* 5. Migration Run — kết quả Dry-run THẬT với bộ đếm lý do mới */
    async () => {
      await open('/app/cobe-loyalty-migration-run');
      const link = await page.$('.list-row-container a.ellipsis, .list-subject a');
      if (link) { await link.click().catch(() => {}); await page.waitForTimeout(4000); }
      await shot('migration-run-detail.png', { fullPage: true });
    },

    /* 6. Assignment Tool — có dữ liệu, đã che tên khách */
    async () => {
      await open('/app/loyalty-assignment-tool', 4000);
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(b => /Tải|Load|Tìm|Search/i.test(b.textContent));
        if (btn) btn.click();
      }).catch(() => {});
      await page.waitForTimeout(5000);
      await maskCustomers();
      await page.waitForTimeout(400);
      await shot('assignment-tool-results.png', { fullPage: true });
    },

    /* 7. Customer — khu vực Loyalty trên form khách */
    async () => {
      await open('/app/customer/new');
      await page.evaluate(() => {
        const f = window.cur_frm;
        if (f) { f.set_value('customer_name', 'Khách hàng mẫu'); if (f.scroll_to_field) f.scroll_to_field('loyalty_program'); }
      }).catch(() => {});
      await page.waitForTimeout(2500);
      await shot('customer-loyalty-section.png', { fullPage: true });
    },

  ];

  for (const t of tasks) {
    try { await t(); } catch (e) { console.error('  ✗', e.message); }
  }
  await browser.close();
  console.log('Xong →', OUT);
})();
