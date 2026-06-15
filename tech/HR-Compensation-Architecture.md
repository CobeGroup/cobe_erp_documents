---
title: HR Compensation — Architecture
layout: default
parent: Tài liệu kỹ thuật
nav_order: 5
---

# HR Compensation — Architecture

> Phase 2 của `hr_for_cobegroup` — module Overtime / WFH Salary / KPI Bonus extend HRMS Salary Slip. Đối tượng: developer + payroll integrator.
>
> User-facing docs tại [Lương & Thưởng](../users/00-compensation.html).

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Doctype map](#2-doctype-map)
3. [Salary Slip hooks](#3-salary-slip-hooks)
4. [Overtime — request lifecycle](#4-overtime--request-lifecycle)
5. [WFH Salary — adjustment logic](#5-wfh-salary--adjustment-logic)
6. [KPI Bonus — scoring + payout](#6-kpi-bonus--scoring--payout)
7. [Install + Patches](#7-install--patches)
8. [Custom fields trên Salary Slip](#8-custom-fields-trên-salary-slip)
9. [Validation chains](#9-validation-chains)
10. [Future work](#10-future-work)

---

## 1. Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────┐
│  Frappe HRMS standard                                   │
│                                                          │
│  Employee ←┐                                            │
│            │                                            │
│  Employee Checkin   ← chấm công PWA (phase 1)           │
│      │                                                  │
│      ▼                                                  │
│  Salary Slip                                            │
│   ├─ Earnings                                           │
│   │    + Overtime (từ Additional Salary)                │
│   │    + KPI Bonus (từ hook)                            │
│   └─ Deductions                                         │
│        + WFH Deduction (từ hook)                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
            ▲              ▲              ▲
            │              │              │
   ┌────────┴──┐   ┌──────┴──────┐  ┌────┴───────┐
   │ Additional│   │ WFH-PWA     │  │ KPI Score  │
   │ Salary    │   │ checkins    │  │ docstatus=1│
   └────────┬──┘   └──────┬──────┘  └────┬───────┘
            │             │              │
   ┌────────┴──┐   ┌──────┴──────┐  ┌────┴───────┐
   │ OT Request│   │ WFH Approval│  │ KPI Period │
   │ Approved  │   │ Approved    │  │ Open       │
   └───────────┘   └─────────────┘  └────────────┘

         Module 1: Overtime    Module 2: WFH Salary    Module 3: KPI

```

3 module độc lập, tất cả đều cuối cùng affect Salary Slip:
- **Overtime**: gián tiếp qua Additional Salary (HRMS standard pipeline)
- **WFH Salary**: trực tiếp qua doc_event hook
- **KPI Bonus**: trực tiếp qua doc_event hook

---

## 2. Doctype map

Module path: `hr_for_cobegroup/compensation/doctype/`

| Doctype | Type | Mô tả |
|---|---|---|
| `HR Overtime Settings` | Single | Global config OT |
| `HR Overtime Multiplier Rule` | Child | day_type × multiplier rows |
| `HR Overtime Request` | Submittable, Amendable | NV xin OT |
| `HR WFH Salary Settings` | Single | Global config WFH deduction |
| `HR WFH Salary Component Scope` | Child | Per-component pct rows |
| `HR KPI Period` | Submittable, Amendable | Định nghĩa kỳ |
| `HR KPI Score` | Submittable, Amendable | Điểm + bonus |
| `HR Compensation Excluded Designation` | Child | Shared exclusion table |
| `HR Compensation Excluded Employee` | Child | Shared exclusion table |

### Relationships

```
HR Overtime Settings (Single)
  ├──< multipliers: HR Overtime Multiplier Rule
  ├──< excluded_designations: HR Compensation Excluded Designation
  └──< excluded_employees: HR Compensation Excluded Employee

HR WFH Salary Settings (Single)
  ├──< apply_to_components: HR WFH Salary Component Scope
  ├──< excluded_designations: HR Compensation Excluded Designation
  └──< excluded_employees: HR Compensation Excluded Employee

HR Overtime Request
  ├── employee → Employee
  ├── additional_salary → Additional Salary (HRMS std)
  └── amended_from → HR Overtime Request (self)

HR KPI Period
  └── company → Company

HR KPI Score
  ├── employee → Employee
  ├── kpi_period → HR KPI Period
  ├── paid_in_salary_slip → Salary Slip
  └── amended_from → HR KPI Score (self)
```

---

## 3. Salary Slip hooks

Module: `hr_for_cobegroup/compensation/salary_slip_hooks.py`

Đăng ký trong `hooks.py`:

```python
doc_events = {
    "Salary Slip": {
        "validate": [
            "hr_for_cobegroup.compensation.salary_slip_hooks.apply_wfh_adjustment",
            "hr_for_cobegroup.compensation.salary_slip_hooks.apply_kpi_bonus",
        ],
        "on_submit": [
            "hr_for_cobegroup.compensation.salary_slip_hooks.link_kpi_scores_to_slip",
        ],
        "on_cancel": [
            "hr_for_cobegroup.compensation.salary_slip_hooks.unlink_kpi_scores_from_slip",
        ],
    },
}
```

### `apply_wfh_adjustment(doc, method)`

Trigger: Salary Slip `validate`.

```python
def apply_wfh_adjustment(doc, method):
    # 1. Idempotent: xóa row WFH Deduction cũ
    doc.deductions = [d for d in doc.deductions 
                      if d.salary_component != settings.adjustment_component]

    # 2. Đếm WFH days
    wfh_days = frappe.db.sql("""
        SELECT COUNT(DISTINCT DATE(time))
        FROM `tabEmployee Checkin`
        WHERE employee = %s
          AND custom_checkin_source = 'WFH-PWA'
          AND DATE(time) BETWEEN %s AND %s
    """, (doc.employee, doc.start_date, doc.end_date))[0][0]
    doc.custom_wfh_days = wfh_days

    if wfh_days == 0 or not settings.enabled or _is_excluded(doc.employee):
        doc.custom_wfh_adjustment = 0
        return

    # 3. Tính shortage
    working_days = doc.payment_days or 22
    total = 0
    component_pcts = {row.salary_component: row.pct_on_wfh_day 
                      for row in settings.apply_to_components}
    
    for earning in doc.earnings:
        pct = component_pcts.get(earning.salary_component)
        if pct is None:
            continue
        shortage = earning.amount * (wfh_days / working_days) * (1 - pct/100)
        total += shortage

    if total > 0:
        doc.append('deductions', {
            'salary_component': settings.adjustment_component,
            'amount': total,
        })
    doc.custom_wfh_adjustment = total
```

### `apply_kpi_bonus(doc, method)`

Trigger: Salary Slip `validate`.

```python
def apply_kpi_bonus(doc, method):
    # 1. Idempotent
    doc.earnings = [e for e in doc.earnings if e.salary_component != "KPI Bonus"]

    # 2. Query eligible scores
    scores = frappe.db.get_all("HR KPI Score",
        filters={
            "employee": doc.employee,
            "docstatus": 1,
            "payout_date": ["between", [doc.start_date, doc.end_date]],
        },
        or_filters={
            "paid_in_salary_slip": ["is", "not set"],
            "paid_in_salary_slip": doc.name,
        },
        fields=["name", "score", "bonus_amount"]
    )

    if not scores:
        return

    total = sum(s.bonus_amount for s in scores)
    max_score = max(s.score for s in scores)

    doc.append('earnings', {
        'salary_component': 'KPI Bonus',
        'amount': total,
    })
    doc.custom_kpi_score = max_score
    doc.custom_kpi_bonus = total
```

### `link_kpi_scores_to_slip(doc, method)`

Trigger: Salary Slip `on_submit`.

Mark `paid_in_salary_slip = doc.name` cho các score eligible. Tránh trả 2 lần.

### `unlink_kpi_scores_from_slip(doc, method)`

Trigger: Salary Slip `on_cancel`.

Reset `paid_in_salary_slip = None` cho các score đã link. Trả về pool.

---

## 4. Overtime — request lifecycle

### Validate chain (`HR Overtime Request.validate`)

```python
def validate(self):
    settings = frappe.get_cached_doc("HR Overtime Settings")
    
    # 1. Module enabled?
    if not settings.enabled:
        frappe.throw(_("Overtime is disabled"))

    # 2. Employee excluded?
    if _is_excluded(self.employee, settings):
        frappe.throw(_("Employee or designation excluded from overtime"))

    # 3. Auto-detect day_type
    if not self.day_type:
        self.day_type = _detect_day_type(self.date, self.employee)

    # 4. Compute duration
    raw = (to_minutes(self.to_time) - to_minutes(self.from_time) - self.break_minutes)
    if raw < settings.min_overtime_minutes:
        frappe.throw(_("Overtime must be at least {0} minutes").format(settings.min_overtime_minutes))
    self.duration_hours = floor(raw / settings.round_to_minutes) * settings.round_to_minutes / 60

    # 5. Lookup multiplier
    self.multiplier = _get_multiplier(settings.multipliers, self.day_type)

    # 6. Lookup hourly_rate
    base = _get_employee_base(self.employee)
    self.hourly_rate = base / 220

    # 7. Compute amount
    self.amount = self.duration_hours * self.hourly_rate * self.multiplier

    # 8. Daily cap
    daily_total = _sum_employee_ot(self.employee, self.date) + self.duration_hours
    if daily_total > settings.max_overtime_hours_per_day:
        frappe.throw(_("Daily cap exceeded"))

    # 9. Monthly cap
    monthly_total = _sum_employee_ot_in_month(self.employee, self.date.month) + self.duration_hours
    if monthly_total > settings.max_overtime_hours_per_month:
        frappe.throw(_("Monthly cap exceeded"))
```

### Auto-approve (`on_submit`)

```python
def on_submit(self):
    settings = frappe.get_cached_doc("HR Overtime Settings")
    if self.duration_hours <= settings.auto_approve_below_hours:
        self.db_set("approval_status", "Approved", update_modified=False)
        self.db_set("approved_by", "Administrator", update_modified=False)
        self._create_additional_salary()
```

### Manual approve (`update_after_submit`)

```python
def on_update_after_submit(self):
    prev_status = self.get_doc_before_save().approval_status
    if prev_status == "Pending Manager" and self.approval_status == "Approved":
        self.approved_by = frappe.session.user
        self._create_additional_salary()
```

### Create Additional Salary

```python
def _create_additional_salary(self):
    asal = frappe.get_doc({
        "doctype": "Additional Salary",
        "employee": self.employee,
        "salary_component": settings.salary_component,
        "amount": self.amount,
        "payroll_date": self.date,
        "ref_doctype": "HR Overtime Request",
        "ref_docname": self.name,
    })
    asal.insert(ignore_permissions=True)
    asal.submit()
    self.db_set("additional_salary", asal.name)
```

### Cancel chain

```python
def on_cancel(self):
    if self.additional_salary:
        asal = frappe.get_doc("Additional Salary", self.additional_salary)
        if asal.docstatus == 1:
            asal.cancel()
```

---

## 5. WFH Salary — adjustment logic

### Formula

```
For each earning E in Salary Slip:
    pct = lookup(apply_to_components, E.salary_component)
    if pct is None:
        skip
    shortage_E = E.amount × (wfh_days / working_days) × (1 - pct/100)

WFH Deduction.amount = sum(shortage_E for all E)
```

### Edge cases

- `wfh_days = 0` → skip
- `working_days = 0` (Frappe edge case) → fallback 22
- `pct = 100%` → shortage = 0 (no deduction even if listed)
- `pct = 0%` → trừ toàn bộ tỷ lệ ngày WFH
- Component không có trong `apply_to_components` → giữ 100% (no shortage)

### Idempotent design

`apply_wfh_adjustment` luôn:
1. Remove tất cả Deduction row với `salary_component = adjustment_component`
2. Recompute từ đầu
3. Append row mới (nếu shortage > 0)

→ Multi-validate không gây double row.

---

## 6. KPI Bonus — scoring + payout

### SCORE_CURVE (hard-coded trong `hr_kpi_score.py`)

```python
SCORE_CURVE = [
    (95, 20),
    (85, 15),
    (70, 10),
    (50, 5),
    (0, 0),
]

def suggest_bonus_pct(score):
    for threshold, pct in SCORE_CURVE:
        if score >= threshold:
            return pct
    return 0
```

### Validation (`HR KPI Score.validate`)

```python
def validate(self):
    # 1. Score range
    if not (0 <= self.score <= 100):
        frappe.throw(_("Score must be 0-100"))

    # 2. Base amount fallback
    if not self.base_amount:
        self.base_amount = _get_employee_base(self.employee)

    # 3. Auto-suggest pct (only if blank)
    if not self.bonus_pct:
        self.bonus_pct = suggest_bonus_pct(self.score)

    # 4. Auto-compute amount (only if blank)
    if not self.bonus_amount:
        self.bonus_amount = self.base_amount * self.bonus_pct / 100

    # 5. Unique constraint
    existing = frappe.db.get_value("HR KPI Score", {
        "employee": self.employee,
        "kpi_period": self.kpi_period,
        "name": ["!=", self.name],
        "docstatus": ["<", 2],
    })
    if existing:
        frappe.throw(_("Score already exists for this employee + period: {0}").format(existing))
```

---

## 7. Install + Patches

### `install.py.after_install()`

```python
def after_install():
    seed_per_company_policy()         # phase 1
    _create_compensation_components()  # phase 2
    _seed_overtime_settings()
    _seed_wfh_salary_settings()
    _add_salary_slip_custom_fields()
```

### `_create_compensation_components`

Tạo 3 Salary Component nếu chưa có:
```python
COMPONENTS = [
    {"name": "Overtime", "type": "Earning"},
    {"name": "WFH Deduction", "type": "Deduction"},
    {"name": "KPI Bonus", "type": "Earning"},
]
```

### `_seed_overtime_settings`

Single doctype, set:
- `enabled = 0` (off by default)
- `salary_component = "Overtime"`
- Seed 3 multiplier rows: Weekday=1.5, Weekend=2.0, Holiday=3.0
- `min_overtime_minutes = 30`, `round_to_minutes = 15`, `max_per_day = 4`, `max_per_month = 40`

### `_seed_wfh_salary_settings`

Single doctype:
- `enabled = 0`
- `adjustment_component = "WFH Deduction"`
- `apply_to_components` empty (admin tự config)

### `_add_salary_slip_custom_fields`

4 custom field read-only:
- `custom_wfh_days` (Float)
- `custom_wfh_adjustment` (Currency)
- `custom_kpi_score` (Float)
- `custom_kpi_bonus` (Currency)

### Patch `v0_002/bootstrap_compensation.py`

```python
def execute():
    from hr_for_cobegroup.install import after_install
    after_install()  # idempotent
```

Để site cũ migrate được phase 2.

---

## 8. Custom fields trên Salary Slip

| Field | Type | Source |
|---|---|---|
| `custom_wfh_days` | Float | apply_wfh_adjustment |
| `custom_wfh_adjustment` | Currency | apply_wfh_adjustment |
| `custom_kpi_score` | Float | apply_kpi_bonus (max score) |
| `custom_kpi_bonus` | Currency | apply_kpi_bonus (total) |

Read-only, không edit thủ công. Dùng cho:
- Report builder
- Export báo cáo
- Audit nhanh không cần truy back nguồn

---

## 9. Validation chains

### Settings level (Single)

| Settings | Validation |
|---|---|
| HR Overtime Settings | Multiplier rules đủ 3 day_type. Salary Component tồn tại. |
| HR WFH Salary Settings | Adjustment Component tồn tại. `apply_to_components` row có salary_component hợp lệ. |

### Transaction level

| Doctype | Validation |
|---|---|
| HR Overtime Request | Settings enabled. Employee không excluded. duration ≥ min. duration ≤ daily/monthly cap. day_type ∈ {Weekday, Weekend, Holiday}. |
| HR KPI Score | Score 0-100. Period status=Open. Unique (employee, period). |
| HR KPI Period | from_date/to_date auto-compute không clash. Status transition Open → Closed cho phép back. |

### Slip hooks (validation runtime)

- `apply_wfh_adjustment`: silent skip nếu disabled / excluded / wfh_days=0
- `apply_kpi_bonus`: silent skip nếu không có score eligible

Cả 2 hook không throw, để Salary Slip vẫn save được (chỉ ảnh hưởng amount).

---

## 10. Future work

- [ ] **Per-Company Overtime / WFH Settings** — hiện đang Single, nếu Cobe Group cần policy khác giữa các Company → refactor giống HR Attendance Policy
- [ ] **PWA UI cho OT Request** — nhân viên xin OT từ phone thay vì Desk
- [ ] **PWA UI cho KPI Score dashboard** — manager chấm điểm trên phone
- [ ] **Score curve configurable** — chuyển từ hard-coded sang doctype HR KPI Score Curve, mỗi Company define curve riêng
- [ ] **OT Request approver chain** — hiện 1 manager duyệt; cần multi-level approval cho OT lớn
- [ ] **WFH Deduction breakdown** — tách thành nhiều row Deduction (mỗi component 1 row) thay vì gộp 1 row tổng để Salary Slip dễ đọc
- [ ] **KPI Score weighted bonus** — bonus_pct theo công thức trọng số nhiều chỉ tiêu thay vì 1 score 0-100

---

## Liên quan

- [Lương & Thưởng — Tổng quan](../users/Compensation-Tong-Quan.html)
- [HR Attendance — Architecture](HR-Attendance-Architecture.html) — phase 1
- [HR Attendance — API Contract](HR-Attendance-API.html)
