/* shoot_performance.js — chụp tab "Hiệu suất" của trang Service Report từ bản build THẬT + mock API.
   Dùng dữ liệu giả: trang thật hiện tên 12 nhân viên và 40 KTV kèm số điện thoại, mà doc publish
   công khai lên GitHub Pages nên KHÔNG chụp dữ liệu thật được.
   Chạy: node help/cobe_erp_documents/_tools/shoot_performance.js
   UI đổi → npm run build trong apps/service_reminder/frontend/service-report rồi chạy lại. */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc';
const PUBLIC = ROOT + '/apps/service_reminder/service_reminder/public';
const OUT = ROOT + '/help/cobe_erp_documents/users/images/service-report/hieu-suat';
const indexHtml = fs.readFileSync(PUBLIC + '/service-report/index.html', 'utf8');
const api = (m) => ({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: m }) });

const BOOT = { frappe_csrf_token: 'x', site_name: 'cobe.cc', user: 'demo@tgdg.com', user_fullname: 'Người dùng Demo' };
const CLOCK = '2026-08-31T09:00:00';

const staffRow = (name, total, on_time, late, overdue, pending, avg, wo) => {
	const assessed = on_time + late + overdue;
	return {
		id: name, name, total, on_time, late, overdue, pending, assessed,
		rate: Math.round((on_time / assessed) * 1000) / 10,
		avg_hours: avg, by_work_order: wo, by_close: on_time + late - wo,
	};
};

const techRow = (name, total, on_time, late, overdue, pending, avg) => {
	const assessed = on_time + late + overdue;
	return {
		id: name, name, total, on_time, late, overdue, pending, assessed,
		rate: Math.round((on_time / assessed) * 1000) / 10,
		avg_hours: avg, cancelled: 0,
	};
};

const sum = (rows, key) => rows.reduce((a, r) => a + (r[key] || 0), 0);
const summary = (rows, deadline_days, extra = {}) => ({
	deadline_days, people: rows.length,
	total: sum(rows, 'total'), on_time: sum(rows, 'on_time'), late: sum(rows, 'late'),
	overdue: sum(rows, 'overdue'), pending: sum(rows, 'pending'), assessed: sum(rows, 'assessed'),
	rate: Math.round((sum(rows, 'on_time') / sum(rows, 'assessed')) * 1000) / 10,
	...extra,
});

const STAFF = [
	staffRow('Nguyễn Văn Demo', 211, 174, 30, 2, 5, 28.8, 96),
	staffRow('Trần Thị Demo', 176, 136, 30, 6, 4, 41.2, 84),
	staffRow('Lê Văn Demo', 171, 124, 31, 11, 5, 52.6, 78),
	staffRow('Phạm Thị Demo', 42, 38, 3, 1, 0, 19.4, 16),
	staffRow('Hoàng Văn Demo', 24, 23, 1, 0, 0, 11.7, 9),
];

const TECH = [
	techRow('KTV Demo — Bình Định', 41, 38, 3, 0, 0, 34.9),
	techRow('KTV Demo — Cần Thơ', 25, 23, 2, 0, 0, 27.9),
	techRow('KTV Demo — Hà Nội 1', 24, 21, 2, 1, 0, 36.9),
	techRow('KTV Demo — Thanh Hoá', 21, 15, 6, 0, 0, 71.2),
	techRow('KTV Demo — TP.HCM 1', 19, 14, 5, 0, 0, 57.9),
	techRow('KTV Demo — Hà Nội 2', 18, 11, 5, 2, 1, 56.4),
];

const MONTHS = ['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08'];
const trendRows = (rates, totals) =>
	MONTHS.map((month, i) => ({
		month, total: totals[i], assessed: totals[i], rate: rates[i],
		on_time: Math.round((totals[i] * rates[i]) / 100), late: 0, overdue: 0, pending: 0,
	}));

const CASES = [
	['ISS-2026-05112', 'Khách hàng Demo A', 'Máy báo lỗi E3, không ra nước', '2026-08-04 09:32:00', '2026-08-07 09:32:00', '2026-08-12 16:01:00', 150.5, 'WO-12677', true],
	['ISS-2026-04951', 'Khách hàng Demo B', 'Nước yếu sau khi thay lõi', '2026-08-06 15:52:00', '2026-08-09 15:52:00', '2026-08-14 08:02:00', 128.2, '', false],
	['ISS-2026-04676', 'Khách hàng Demo C', 'Rò rỉ nước tại van khoá', '2026-08-08 16:35:00', '2026-08-11 16:35:00', '2026-08-16 20:01:00', 99.4, '', false],
	['ISS-2026-04702', 'Khách hàng Demo D', 'pH không đạt sau bảo dưỡng', '2026-08-11 08:14:00', '2026-08-14 08:14:00', '2026-08-17 11:40:00', 75.4, 'WO-12801', true],
	['ISS-2026-04788', 'Khách hàng Demo E', 'Khách chưa quen dùng chế độ lọc', '2026-08-13 10:02:00', '2026-08-16 10:02:00', '2026-08-18 09:15:00', 47.2, '', false],
].map(([doc, customer_name, subject, started_at, deadline_at, done_at, late_hours, work_order, by_work_order]) => ({
	person_id: 'Nguyễn Văn Demo', person_name: 'Nguyễn Văn Demo', doc, doctype: 'Issue',
	customer_name, subject, status: 'Closed', sub_status: 'Online Handled', work_order,
	started_at, deadline_at, done_at, hours: null, late_hours, bucket: 'late',
	by_work_order, by_close: !by_work_order,
}));

const MOCKS = {
	'get_issue_staff_performance': { rows: STAFF, summary: summary(STAFF, 3, { by_work_order: sum(STAFF, 'by_work_order'), by_close: sum(STAFF, 'by_close') }) },
	'get_technician_performance': { rows: TECH, summary: summary(TECH, 3, { cancelled: 0 }) },
	'get_performance_trend': {
		staff: { rows: trendRows([49.7, 49.5, 42.9, 43.3, 40.6, 53.5, 78.2, 77.4, 79.9, 78.2, 79.5, 80.7], [712, 747, 690, 705, 668, 640, 587, 571, 701, 726, 657, 658]), deadline_days: 3 },
		technician: { rows: trendRows([0, 0, 0, 0, 0, 74.1, 83.8, 85.6, 84.9, 82.7, 79.4, 83.7], [0, 0, 0, 0, 0, 210, 421, 388, 484, 525, 519, 490]).slice(5), deadline_days: 3 },
	},
	'get_issue_staff_cases': { rows: CASES, total: CASES.length, shown: CASES.length },
	'get_technician_cases': { rows: [], total: 0, shown: 0 },
};

async function shoot(page, name, clip) {
	fs.mkdirSync(OUT, { recursive: true });
	await page.screenshot({ path: path.join(OUT, name), ...(clip ? { clip } : {}) });
	console.log('  ✓', name);
}

/** Vùng bao của một element, nới ra `pad` px mỗi phía. */
async function box(locator, pad = 8) {
	const b = await locator.boundingBox();
	return { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: b.width + pad * 2, height: b.height + pad * 2 };
}

(async () => {
	const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
	const ctx = await browser.newContext({ viewport: { width: 1760, height: 1000 }, deviceScaleFactor: 1.5, locale: 'vi-VN' });
	await ctx.addInitScript((b) => {
		Object.assign(window, b);
		try {
			localStorage.setItem('sr_report_overview_tab', 'performance');
			localStorage.setItem('sr_report_performance_date', JSON.stringify({ from: '2026-08-01', to: '2026-08-31' }));
			localStorage.setItem('sr_report_sidebar_collapsed', '1');
		} catch (e) { /* ignore */ }
	}, BOOT);

	const page = await ctx.newPage();
	await page.clock.install({ time: new Date(CLOCK) });
	await page.route('**/*', async (route) => {
		const u = new URL(route.request().url());
		if (u.hostname !== 'localhost') return route.continue();
		const p = u.pathname;
		if (p.startsWith('/api/method/')) {
			for (const k in MOCKS) if (p.includes(k)) return route.fulfill(api(MOCKS[k]));
			return route.fulfill(api(null));
		}
		if (p.startsWith('/assets/service_reminder/')) {
			const f = path.join(PUBLIC, p.replace('/assets/service_reminder/', ''));
			return fs.existsSync(f) ? route.fulfill({ path: f }) : route.fulfill({ status: 404, body: '' });
		}
		if (p.startsWith('/service-report')) return route.fulfill({ contentType: 'text/html', body: indexHtml });
		return route.fulfill({ status: 204, body: '' });
	});

	await page.goto('http://localhost/service-report/overview', { waitUntil: 'domcontentloaded' });
	await page.waitForSelector('.ant-tabs-tabpane-active .ant-table', { timeout: 15000 });
	await page.waitForTimeout(1500);

	const pane = page.locator('.ant-tabs-tabpane-active');
	// Chỉ 3 card ngoài cùng có tiêu đề; các thẻ số bên trong là .ant-card không đầu.
	const cards = pane.locator('.ant-card:has(> .ant-card-head)');

	await shoot(page, '01-tab-hieu-suat.png', { x: 0, y: 0, width: 1760, height: 1000 });

	// Bảng nhân viên sự cố (card thứ hai trong tab, sau card biểu đồ).
	await cards.nth(1).scrollIntoViewIfNeeded();
	await page.waitForTimeout(600);
	await shoot(page, '02-bang-nhan-vien.png', await box(cards.nth(1)));

	// Bảng KTV.
	await cards.nth(2).scrollIntoViewIfNeeded();
	await page.waitForTimeout(600);
	await shoot(page, '03-bang-ktv.png', await box(cards.nth(2)));

	// Danh sách ca đứng sau con số: bấm ô "Trễ hạn" của dòng đầu bảng nhân viên.
	await cards.nth(1).scrollIntoViewIfNeeded();
	const heads = await cards.nth(1).locator('thead th').allInnerTexts();
	const col = heads.findIndex((h) => h.trim() === 'Trễ hạn');
	await cards.nth(1).locator('tbody tr.ant-table-row').first().locator('td').nth(col).locator('a').click();
	await page.waitForSelector('.ant-modal-content', { timeout: 8000 });
	await page.waitForTimeout(1200);
	await shoot(page, '04-chi-tiet-ca-tre.png', await box(page.locator('.ant-modal-content'), 12));

	// Biểu đồ xu hướng riêng.
	await page.locator('.ant-modal-close').click();
	await page.waitForTimeout(800);
	await cards.nth(0).scrollIntoViewIfNeeded();
	await page.waitForTimeout(600);
	await shoot(page, '05-xu-huong.png', await box(cards.nth(0)));

	await browser.close();
	console.log('Xong — ảnh ở', OUT);
})();
