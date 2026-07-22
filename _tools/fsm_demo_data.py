"""fsm_demo_data.py — dựng demo data FSMNext để chụp ảnh tài liệu.

Dữ liệu hoàn toàn HƯ CẤU (khách "DEMO Cửa hàng Nước sạch Minh An") — tuyệt đối
KHÔNG chụp màn hình trên dữ liệu khách hàng thật rồi đẩy lên repo docs (repo này
publish qua GitHub Pages).

Cách chạy:
    cp help/cobe_erp_documents/_tools/fsm_demo_data.py apps/frappe/frappe/_fsm_demo_tmp.py
    bench --site cobe.cc execute frappe._fsm_demo_tmp.run
    rm apps/frappe/frappe/_fsm_demo_tmp.py

Tạo ra: 3 WO (New không SA / New chờ ân hạn / In Progress), 2 SA, 3 dòng
FS Scheduler Log, và user demo-fsm@tgdg.com để đăng nhập chụp ảnh.
Idempotent — chạy lại không nhân bản.

Lưu ý riêng của instance cobe.cc:
  - Customer bắt buộc lead_name  -> phải tạo Lead trước
  - Customer đánh số theo series -> phải dùng docname thật, không dùng tên
  - WO submit đòi >=1 Work Order Line Item
  - SA không có field description -> dùng service_note
  - User tạo mới bị enabled=0    -> phải bật + set password bằng update_password
"""

import frappe

CUST = "DEMO Cửa hàng Nước sạch Minh An"
COMPANY = "THẾ GIỚI ĐIỆN GIẢI"
WORK_TYPE = "Lắp đặt"
DEMO_USER = "demo-fsm@tgdg.com"
DEMO_PASS = "FsmDemo#2026"


def _lead():
    """Instance này bắt buộc Customer.lead_name → dựng Lead demo trước."""
    name = frappe.db.get_value("Lead", {"company_name": CUST})
    if not name:
        d = frappe.get_doc({
            "doctype": "Lead", "first_name": "DEMO Trần Minh An",
            "company_name": CUST, "lead_name": CUST,
            "status": "Lead", "company": COMPANY,
        })
        d.flags.ignore_mandatory = True
        d.insert(ignore_permissions=True)
        name = d.name
    return name


def _customer():
    """Customer ở instance này đánh số theo series → phải trả về docname thật."""
    name = frappe.db.get_value("Customer", {"customer_name": CUST})
    if not name:
        d = frappe.get_doc({
            "doctype": "Customer", "customer_name": CUST,
            "customer_type": "Company", "lead_name": _lead(),
            "customer_group": frappe.db.get_value("Customer Group", {"is_group": 0}, "name"),
            "territory": frappe.db.get_value("Territory", {"is_group": 0}, "name"),
        })
        d.flags.ignore_mandatory = True
        d.insert(ignore_permissions=True)
        name = d.name
    return name


def _address(cust):
    title = "DEMO Minh An - Cửa hàng"
    name = frappe.db.get_value("Address", {"address_title": title})
    if not name:
        d = frappe.get_doc({
            "doctype": "Address", "address_title": title, "address_type": "Billing",
            "address_line1": "12 Đường Demo, Phường Demo", "city": "TP. Demo", "country": "Vietnam",
            "links": [{"link_doctype": "Customer", "link_name": cust}],
        })
        d.flags.ignore_mandatory = True
        d.insert(ignore_permissions=True)
        name = d.name
    return name


def _contact(cust):
    name = frappe.db.get_value("Contact", {"first_name": "DEMO Trần Minh An"})
    if not name:
        d = frappe.get_doc({
            "doctype": "Contact", "first_name": "DEMO Trần Minh An",
            "phone_nos": [{"phone": "0900000000", "is_primary_phone": 1}],
            "links": [{"link_doctype": "Customer", "link_name": cust}],
        })
        d.flags.ignore_mandatory = True
        d.insert(ignore_permissions=True)
        name = d.name
    return name


def _wo(subject, status, cust, addr, contact, submit=True):
    """Tạo WO với trạng thái mong muốn. Trả về tên WO."""
    existing = frappe.db.get_value("FS Work Order", {"description": subject})
    if existing:
        return existing
    doc = frappe.get_doc({
        "doctype": "FS Work Order", "description": subject, "company": COMPANY,
        "customer": cust, "address": addr, "contact": contact,
        "work_type": WORK_TYPE, "work_order_status": "New",
    })
    doc.flags.ignore_permissions = True
    doc.insert(ignore_permissions=True)

    # WO phải có ít nhất 1 dòng công việc mới submit được
    woli = frappe.get_doc({
        "doctype": "FS Work Order Line Item", "work_order": doc.name,
        "description": subject, "status": "New",
    })
    woli.flags.ignore_permissions = True
    woli.flags.ignore_mandatory = True
    woli.insert(ignore_permissions=True)
    if woli.meta.is_submittable:
        woli.submit()

    if submit:
        doc.reload()
        doc.submit()
    if status != "New":
        # đi vòng qua db để không vướng precondition khi dựng data minh hoạ
        frappe.db.set_value("FS Work Order", doc.name, {
            "work_order_status": status, "status_category": status,
        }, update_modified=False)
    return doc.name


def _sa(subject, wo, status, cust, addr):
    existing = frappe.db.get_value("FS Service Appointment", {"service_note": subject})
    if existing:
        return existing
    doc = frappe.get_doc({
        "doctype": "FS Service Appointment", "service_note": subject, "company": COMPANY,
        "customer": cust, "address": addr, "status": status,
        "parent_record_type": "FS Work Order", "parent_record": wo,
    })
    doc.flags.ignore_permissions = True
    doc.flags.ignore_mandatory = True
    doc.insert(ignore_permissions=True)
    return doc.name


def _log(wo, action, reason=None, err=None):
    if frappe.db.exists("FS Scheduler Log", {"reference_name": wo, "action": action}):
        return
    frappe.get_doc({
        "doctype": "FS Scheduler Log", "job_type": "Auto Complete Work Orders",
        "reference_doctype": "FS Work Order", "reference_name": wo,
        "action": action, "reason": reason, "error_message": err,
    }).insert(ignore_permissions=True)


def _user():
    if not frappe.db.exists("User", DEMO_USER):
        u = frappe.get_doc({
            "doctype": "User", "email": DEMO_USER, "first_name": "Demo FSM",
            "send_welcome_email": 0, "user_type": "System User",
        })
        u.flags.ignore_permissions = True
        u.insert(ignore_permissions=True)
        u.add_roles("System Manager")
    from frappe.utils.password import update_password
    update_password(DEMO_USER, DEMO_PASS)


def run():
    frappe.flags.in_import = True
    cust = _customer()
    addr, contact = _address(cust), _contact(cust)

    # 1) Nguyên nhân phổ biến nhất (9.420 ca): WO không có SA nào
    wo1 = _wo("DEMO Lắp máy lọc — chưa tạo lịch hẹn", "New", cust, addr, contact)
    _log(wo1, "Skipped", "Blockers: Work Order has no Service Appointments")

    # 2) WO có SA đã xong nhưng chưa qua thời gian ân hạn
    wo2 = _wo("DEMO Lắp máy lọc — chờ ân hạn", "New", cust, addr, contact)
    _sa("DEMO Buổi lắp đặt — đã xong", wo2, "Completed", cust, addr)
    _log(wo2, "Skipped", "Grace period: 1/2 days elapsed")

    # 3) WO đang làm dở, SA chưa xong
    wo3 = _wo("DEMO Bảo dưỡng định kỳ — đang thực hiện", "In Progress", cust, addr, contact)
    _sa("DEMO Buổi bảo dưỡng — đang thực hiện", wo3, "Dispatched", cust, addr)
    _log(wo3, "Skipped",
         "Blockers: 1 Service Appointments not yet completed: DEMO Buổi bảo dưỡng — đang thực hiện")

    _user()
    frappe.db.commit()
    print("WO1 (không có SA):", wo1)
    print("WO2 (chờ ân hạn) :", wo2)
    print("WO3 (đang làm)   :", wo3)
    print("Khách demo       :", cust, "|", CUST)
    print("User chụp ảnh    :", DEMO_USER, "/", DEMO_PASS)
