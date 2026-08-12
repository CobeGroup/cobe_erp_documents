# -*- coding: utf-8 -*-
"""Chụp ảnh cho users/Phan-Loai-Su-Co.md.

Ảnh chụp từ app đang chạy với dữ liệu prod, không dựng mock.

Chạy: bench serve --port 8000, rồi ./env/bin/python <file này>.

Ảnh số 3 và 4 cần một Loại thuộc nhiều nhóm. Danh mục thật chưa có cái nào, nên dựng
tạm rồi xoá - nhớ xoá TRƯỚC khi chụp lại hai tấm có số đếm (chon-truong-loc,
nhom-truoc-loai-sau), không thì ảnh ghi 76 loại trong khi doc nói 75:

    frappe.get_doc({"doctype": "Issue Type", "__newname": "ZZ Loại demo nhiều nhóm",
        "custom_issue_groups": [{"issue_group": "Nước yếu"}, {"issue_group": "Rò rỉ nước"}]}).insert()
"""
import subprocess
from playwright.sync_api import sync_playwright

BASE = "http://cobe.cc:8000"
BENCH = "/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc"
IMG = f"{BENCH}/help/cobe_erp_documents/users/images/desk/issue"

subprocess.run(["mkdir", "-p", IMG], check=True)


def field_box(pg, *fieldnames, pad=14):
	"""Khung bao quanh vài ô trên form, để ảnh chỉ có đúng chỗ đang nói."""
	boxes = []
	for f in fieldnames:
		el = pg.locator(f'[data-fieldname="{f}"]').first
		bb = el.bounding_box()
		if bb:
			boxes.append(bb)
	x = min(b["x"] for b in boxes) - pad
	y = min(b["y"] for b in boxes) - pad
	w = max(b["x"] + b["width"] for b in boxes) - x + pad
	h = max(b["y"] + b["height"] for b in boxes) - y + pad
	return {"x": max(x, 0), "y": max(y, 0), "width": w, "height": h}


def pick(pg, fieldname, value):
	inp = pg.locator(f'[data-fieldname="{fieldname}"] input').first
	inp.scroll_into_view_if_needed()
	inp.click()
	inp.fill("")
	inp.type(value, delay=60)
	pg.wait_for_timeout(1500)
	pg.locator(
		f'[data-fieldname="{fieldname}"] .awesomplete ul [role="option"] p[title="{value}"]'
	).first.click()
	pg.wait_for_timeout(1800)


with sync_playwright() as p:
	b = p.chromium.launch(args=["--host-resolver-rules=MAP cobe.cc 127.0.0.1"])
	pg = b.new_context(viewport={"width": 1400, "height": 950}, device_scale_factor=2).new_page()

	pg.goto(f"{BASE}/login", timeout=30000)
	pg.fill("#login_email", "Administrator")
	pg.fill("#login_password", "CobeLocal@2026")
	pg.click(".btn-login")
	pg.wait_for_load_state("networkidle")
	pg.wait_for_timeout(2000)

	# 1. chọn Nhóm trước -> ô Issue Type co lại
	pg.goto(f"{BASE}/app/issue/new", timeout=30000)
	pg.wait_for_selector('[data-fieldname="issue_type"] input', timeout=20000)
	pg.wait_for_timeout(1500)
	pick(pg, "custom_issue_group", "Nước yếu")
	inp = pg.locator('[data-fieldname="issue_type"] input').first
	inp.click()
	inp.fill("")
	pg.wait_for_timeout(1600)
	box = field_box(pg, "custom_issue_group", "issue_type")
	box["height"] = min(box["height"] + 250, 950 - box["y"])   # chừa chỗ cho dropdown
	pg.screenshot(path=f"{IMG}/nhom-truoc-loai-sau.png", clip=box)
	print("1. nhom-truoc-loai-sau.png")

	# 2. chọn Issue Type trước -> Nhóm tự điền
	pg.goto(f"{BASE}/app/issue/new", timeout=30000)
	pg.wait_for_selector('[data-fieldname="issue_type"] input', timeout=20000)
	pg.wait_for_timeout(1500)
	pick(pg, "issue_type", "Cặn trắng do cách dùng")
	pg.wait_for_timeout(2000)
	pg.screenshot(path=f"{IMG}/loai-truoc-nhom-tu-dien.png",
	              clip=field_box(pg, "custom_issue_group", "issue_type"))
	print("2. loai-truoc-nhom-tu-dien.png",
	      pg.evaluate("()=>cur_frm.doc.custom_issue_group"))

	# 3. loại thuộc nhiều nhóm -> hộp thoại hỏi
	pg.goto(f"{BASE}/app/issue/new", timeout=30000)
	pg.wait_for_selector('[data-fieldname="issue_type"] input', timeout=20000)
	pg.wait_for_timeout(1500)
	pick(pg, "issue_type", "ZZ Loại demo nhiều nhóm")
	pg.wait_for_timeout(2200)
	modal = pg.locator(".modal.show .modal-dialog").first
	pg.screenshot(path=f"{IMG}/loai-nhieu-nhom-hoi.png", clip=modal.bounding_box())
	print("3. loai-nhieu-nhom-hoi.png")
	pg.keyboard.press("Escape")
	pg.wait_for_timeout(600)

	# 4. form Issue Type: bảng Nhóm sự cố nhiều dòng
	pg.goto(f"{BASE}/app/issue-type/ZZ%20Lo%E1%BA%A1i%20demo%20nhi%E1%BB%81u%20nh%C3%B3m", timeout=30000)
	pg.wait_for_selector('[data-fieldname="custom_issue_groups"]', timeout=20000)
	pg.wait_for_timeout(2000)
	pg.screenshot(path=f"{IMG}/issue-type-nhieu-nhom.png",
	              clip=field_box(pg, "custom_issue_groups", "disabled"))
	print("4. issue-type-nhieu-nhom.png")

	# 5. lọc danh sách Issue Type theo nhóm (qua bảng con)
	pg.goto(f"{BASE}/app/issue-type", timeout=30000)
	pg.wait_for_timeout(3000)
	pg.evaluate(
		"""async () => {
		await cur_list.filter_area.add([['Issue Type Group Link','issue_group','=','Danh mục cũ']]);
		cur_list.page_length = 100; await cur_list.refresh();
		await new Promise(r => setTimeout(r, 2500));}"""
	)
	pg.wait_for_timeout(1500)
	pg.screenshot(path=f"{IMG}/loc-theo-nhom.png", clip={"x": 0, "y": 60, "width": 1400, "height": 560})
	print("5. loc-theo-nhom.png")

	b.close()
