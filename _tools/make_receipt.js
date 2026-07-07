/* make_receipt.js — sinh ảnh hoá đơn bán lẻ giả (placeholder) để demo đính kèm chứng từ
   trong guide/video Chi phí. Chạy: node make_receipt.js  → _tools/receipt_placeholder.png */
const { chromium } = require('/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/apps/wiki/node_modules/playwright');
const html = `<!doctype html><meta charset="utf-8"><body style="margin:0"><div style="width:360px;padding:20px 24px;font-family:'Courier New',monospace;background:#fffef8;color:#222">
<div style="text-align:center;font-weight:bold">CỬA HÀNG VẬT TƯ LẠNH MINH PHÁT</div>
<div style="text-align:center;font-size:12px">125 Lý Thường Kiệt, Q.10, TP.HCM</div>
<div style="text-align:center;font-size:12px;margin-bottom:8px">MST: 0312 456 789</div>
<div style="text-align:center;font-weight:bold;margin:6px 0">HOÁ ĐƠN BÁN LẺ</div>
<div style="font-size:12px">Số: 000482 &nbsp;·&nbsp; Ngày: 30/06/2026</div>
<hr style="border:none;border-top:1px dashed #999">
<table style="width:100%;font-size:13px;border-collapse:collapse">
<tr><td>Gas lạnh R32 (bình 3kg)</td><td style="text-align:right">950.000</td></tr>
<tr><td>Ống đồng Φ10 (5m)</td><td style="text-align:right">480.000</td></tr>
<tr><td>Bảo ôn + băng cuốn</td><td style="text-align:right">170.000</td></tr>
</table>
<hr style="border:none;border-top:1px dashed #999">
<table style="width:100%;font-size:14px;font-weight:bold"><tr><td>TỔNG CỘNG</td><td style="text-align:right">1.600.000đ</td></tr></table>
<div style="font-size:12px;margin-top:8px;text-align:center">Cảm ơn quý khách!</div>
</div></body>`;
(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
  const page = await browser.newPage({ viewport:{width:360,height:520}, deviceScaleFactor:2 });
  await page.setContent(html);
  await page.locator('div').first().screenshot({ path: __dirname + '/receipt_placeholder.png' });
  await browser.close();
  console.log('OK -> receipt_placeholder.png');
})();
