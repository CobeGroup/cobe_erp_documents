"""Import the cobe_erp_documents markdown repo into Frappe Wiki (v3 model).

The repo is a Jekyll just-the-docs site: each .md has YAML front matter
(title / parent / grand_parent / nav_order / has_children) that forms a
navigation tree by matching title strings. This script rebuilds that tree as
Wiki Documents under a Wiki Space.

Idempotent: every created Wiki Document carries a stable ``doc_key`` derived
from its source path, so re-running updates content in place instead of
duplicating. Safe to run repeatedly as the repo stays the source of truth.

Run inside a bench console (has frappe context):

	bench --site cobe.cc console
	>>> exec(open('help/cobe_erp_documents/_tools/import_to_wiki.py').read())
	>>> import_users(dry_run=True)      # preview, writes nothing
	>>> import_users(dry_run=False)     # apply
	>>> import_tech(dry_run=True)       # preview tech -> existing Developers space

Or via execute wrappers at the bottom.
"""

import hashlib
import os
import re

import frappe

REPO = os.path.join(frappe.get_site_path("..", "..", ".."), "help", "cobe_erp_documents")
# Fall back to the known absolute location if the relative guess is wrong.
if not os.path.isdir(os.path.join(REPO, "users")):
	REPO = "/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc/help/cobe_erp_documents"

KEY_PREFIX = "erpdoc::"
IMG_NAME_PREFIX = "erpdoc-"

# Pages that must never be published (internal / security-sensitive).
DO_NOT_PUBLISH = {"tech/HR-Attendance-Known-Issues.md"}


# --------------------------------------------------------------------------- #
# Parsing
# --------------------------------------------------------------------------- #
def parse_front_matter(text):
	"""Return (meta dict, body) for a Jekyll markdown file."""
	if not text.startswith("---"):
		return {}, text
	parts = text.split("---", 2)
	if len(parts) < 3:
		return {}, text
	raw, body = parts[1], parts[2]
	meta = {}
	for line in raw.splitlines():
		if ":" not in line:
			continue
		key, _, value = line.partition(":")
		key = key.strip()
		value = value.strip().strip('"').strip("'")
		if value.lower() in ("true", "false"):
			value = value.lower() == "true"
		meta[key] = value
	return meta, body.lstrip("\n")


def read_page(relpath):
	abspath = os.path.join(REPO, relpath)
	with open(abspath, encoding="utf-8") as fh:
		text = fh.read()
	meta, body = parse_front_matter(text)
	title = meta.get("title") or _first_h1(body) or os.path.splitext(os.path.basename(relpath))[0]
	try:
		nav_order = int(meta.get("nav_order", 999))
	except (TypeError, ValueError):
		nav_order = 999
	return {
		"relpath": relpath,
		"title": str(title).strip(),
		"parent": (meta.get("parent") or "").strip(),
		"grand_parent": (meta.get("grand_parent") or "").strip(),
		"nav_order": nav_order,
		"has_children": bool(meta.get("has_children")),
		"nav_exclude": bool(meta.get("nav_exclude")),
		"body": body,
	}


def _first_h1(body):
	for line in body.splitlines():
		if line.startswith("# "):
			return line[2:].strip()
	return None


def collect(subdir):
	base = os.path.join(REPO, subdir)
	records = {}
	for fname in sorted(os.listdir(base)):
		if not fname.endswith(".md"):
			continue
		relpath = f"{subdir}/{fname}"
		records[relpath] = read_page(relpath)
	return records


# --------------------------------------------------------------------------- #
# Tree building (by matching parent/grand_parent title strings)
# --------------------------------------------------------------------------- #
def build_tree(records):
	"""Set each record's ``parent_relpath`` and return (roots, warnings)."""
	by_title = {}
	for rel, rec in records.items():
		by_title.setdefault(rec["title"], rel)

	warnings = []
	roots = []
	for rel, rec in records.items():
		parent_title = rec["parent"]
		if not parent_title:
			rec["parent_relpath"] = None
			roots.append(rel)
			continue
		parent_rel = by_title.get(parent_title)
		if not parent_rel:
			warnings.append(f"{rel}: parent title '{parent_title}' not found -> attaching to root")
			rec["parent_relpath"] = None
			roots.append(rel)
		else:
			rec["parent_relpath"] = parent_rel
	return roots, warnings


def depth_of(rec, records):
	d = 0
	cur = rec
	seen = set()
	while cur.get("parent_relpath"):
		if cur["relpath"] in seen:
			break
		seen.add(cur["relpath"])
		cur = records[cur["parent_relpath"]]
		d += 1
	return d


# --------------------------------------------------------------------------- #
# Content: images + internal links
# --------------------------------------------------------------------------- #
IMG_MD = re.compile(r"!\[([^\]]*)\]\(([^)\s]+)(\s+\"[^\"]*\")?\)")
LINK_MD = re.compile(r"(?<!\!)\[([^\]]+)\]\(([^)\s]+)\)")
# HTML <img ... src="path" ...> — capture up to and including src=, the quote, and the path.
IMG_HTML = re.compile(r"(<img\b[^>]*?\bsrc=)([\"'])([^\"']+)\2")


def preload_existing_images():
	"""Map already-imported image file_name -> file_url in one query.

	`tabFile` has no index on file_name/content_hash, so a per-image existence
	check is a full-table scan (slow on large sites). Do it once instead.
	"""
	rows = frappe.get_all(
		"File",
		filters={"file_name": ["like", f"{IMG_NAME_PREFIX}%"]},
		fields=["file_name", "file_url"],
	)
	return {r.file_name: r.file_url for r in rows}


def upload_image(local_rel, cache, existing_images):
	"""Upload a repo image as a public File, returning its file_url (cached)."""
	if local_rel in cache:
		return cache[local_rel]
	abspath = os.path.normpath(os.path.join(REPO, local_rel))
	if not abspath.startswith(REPO) or not os.path.isfile(abspath):
		return None
	with open(abspath, "rb") as fh:
		content = fh.read()
	digest = hashlib.sha1(content).hexdigest()[:10]
	fname = f"{IMG_NAME_PREFIX}{digest}-{os.path.basename(abspath)}"
	if fname in existing_images:
		cache[local_rel] = existing_images[fname]
		return existing_images[fname]
	_file = frappe.get_doc(
		{
			"doctype": "File",
			"file_name": fname,
			"is_private": 0,
			"content": content,
		}
	).insert(ignore_permissions=True)
	existing_images[fname] = _file.file_url
	cache[local_rel] = _file.file_url
	return _file.file_url


def rewrite_content(rec, records, route_map, img_cache, existing_images, dry_run, warnings):
	"""Rewrite image paths and internal .html links; return new body."""
	src_dir = os.path.dirname(rec["relpath"])
	body = rec["body"]

	def img_sub(m):
		alt, path, title = m.group(1), m.group(2), m.group(3) or ""
		if path.startswith(("http://", "https://", "/files/", "data:")):
			return m.group(0)
		local_rel = os.path.normpath(os.path.join(src_dir, path))
		if dry_run:
			abspath = os.path.join(REPO, local_rel)
			if not os.path.isfile(abspath):
				warnings.append(f"{rec['relpath']}: missing image '{path}'")
			return m.group(0)
		url = upload_image(local_rel, img_cache, existing_images)
		if not url:
			warnings.append(f"{rec['relpath']}: missing image '{path}'")
			return m.group(0)
		return f"![{alt}]({url}{title})"

	def link_sub(m):
		label, target = m.group(1), m.group(2)
		if target.startswith(("http://", "https://", "#", "mailto:", "/")):
			return m.group(0)
		anchor = ""
		if "#" in target:
			target, anchor = target.split("#", 1)
			anchor = "#" + anchor
		if not target.endswith(".html"):
			return m.group(0)
		basename = os.path.basename(target)[:-5]  # strip .html
		target_rel = route_map.get(basename)
		if not target_rel:
			warnings.append(f"{rec['relpath']}: unresolved link '{m.group(2)}'")
			return m.group(0)
		return f"[{label}](/{target_rel}{anchor})"

	def html_img_sub(m):
		prefix, quote, path = m.group(1), m.group(2), m.group(3)
		if path.startswith(("http://", "https://", "/files/", "data:", "/")):
			return m.group(0)
		local_rel = os.path.normpath(os.path.join(src_dir, path))
		if dry_run:
			if not os.path.isfile(os.path.join(REPO, local_rel)):
				warnings.append(f"{rec['relpath']}: missing image '{path}'")
			return m.group(0)
		url = upload_image(local_rel, img_cache, existing_images)
		if not url:
			warnings.append(f"{rec['relpath']}: missing image '{path}'")
			return m.group(0)
		return f"{prefix}{quote}{url}{quote}"

	body = IMG_MD.sub(img_sub, body)
	body = IMG_HTML.sub(html_img_sub, body)
	body = LINK_MD.sub(link_sub, body)
	return body


# --------------------------------------------------------------------------- #
# Wiki space / document upsert
# --------------------------------------------------------------------------- #
def get_or_create_space(space_name, route):
	existing = frappe.db.get_value("Wiki Space", {"route": route}, "name")
	if existing:
		return frappe.get_doc("Wiki Space", existing)
	space = frappe.get_doc(
		{
			"doctype": "Wiki Space",
			"space_name": space_name,
			"route": route,
			"show_in_switcher": 1,
			"is_published": 1,
		}
	).insert(ignore_permissions=True)
	return space


def upsert_document(rec, records, root_group, dry_run):
	key = KEY_PREFIX + rec["relpath"]
	is_group = 1 if (rec["has_children"] or _has_children_in_tree(rec, records)) else 0
	published = 0 if rec["relpath"] in DO_NOT_PUBLISH else 1
	parent_wd = root_group
	if rec.get("parent_relpath"):
		parent_wd = records[rec["parent_relpath"]].get("_wd_name") or root_group

	if dry_run:
		rec["_wd_name"] = f"(dry:{rec['relpath']})"
		return rec["_wd_name"]

	name = frappe.db.get_value("Wiki Document", {"doc_key": key}, "name")
	if name:
		doc = frappe.get_doc("Wiki Document", name)
		doc.title = rec["title"]
		doc.content = rec["body"]
		doc.parent_wiki_document = parent_wd
		doc.is_group = is_group
		doc.is_published = published
		doc.sort_order = rec["nav_order"]
		doc.save(ignore_permissions=True)
	else:
		doc = frappe.get_doc(
			{
				"doctype": "Wiki Document",
				"doc_key": key,
				"title": rec["title"],
				"content": rec["body"],
				"parent_wiki_document": parent_wd,
				"is_group": is_group,
				"is_published": published,
				"sort_order": rec["nav_order"],
			}
		).insert(ignore_permissions=True)
	rec["_wd_name"] = doc.name
	return doc.name


def _has_children_in_tree(rec, records):
	return any(r.get("parent_relpath") == rec["relpath"] for r in records.values())


# --------------------------------------------------------------------------- #
# Orchestration
# --------------------------------------------------------------------------- #
# subdir -> (space_name, route). Import both together so cross-section links
# (../tech/*.html <-> ../users/*.html) resolve against real routes.
SECTIONS = [
	("users", "Hướng dẫn ERP", "huong-dan-erp"),
	("tech", "Developers", "developers"),
]


def _predict_route(rec, records, space_route):
	from frappe.website.utils import cleanup_page_name

	chain, cur, guard = [], rec, 0
	while cur and guard < 20:
		chain.append(cleanup_page_name(cur["title"]).replace("_", "-"))
		cur = records[cur["parent_relpath"]] if cur.get("parent_relpath") else None
		guard += 1
	return "/".join([space_route] + list(reversed(chain)))


def import_all(dry_run=True):
	"""Import every section, resolving links across sections via real routes."""
	sections = []  # (subdir, space_name, route, records, ordered)
	route_map = {}  # source basename (no ext) -> wiki route
	warnings = []

	# ---- Phase 1: parse + build trees + create/update documents ----
	for subdir, space_name, route in SECTIONS:
		records = collect(subdir)
		_, sec_warn = build_tree(records)
		warnings.extend(sec_warn)
		ordered = sorted(records.values(), key=lambda r: (depth_of(r, records), r["nav_order"], r["title"]))

		root_group = None
		if not dry_run:
			space = get_or_create_space(space_name, route)
			root_group = space.root_group
			print(f"=== {subdir} -> {space.name} (/{route}) root_group={root_group} ===")
		else:
			print(f"=== {subdir} -> space '{space_name}' (/{route}) [DRY RUN] ===")
		print(f"  pages: {len(records)}", flush=True)

		import time as _t

		_s = _t.time()
		for _i, rec in enumerate(ordered, 1):
			upsert_document(rec, records, root_group, dry_run)
			if not dry_run and _i % 10 == 0:
				print(f"    inserted {_i}/{len(ordered)} ({_t.time()-_s:.1f}s)", flush=True)

		sections.append((subdir, space_name, route, records, ordered))

	# ---- Build global route map from REAL routes (or predicted in dry run) ----
	for subdir, space_name, route, records, ordered in sections:
		for rel, rec in records.items():
			basename = os.path.splitext(os.path.basename(rel))[0]
			if dry_run:
				route_map[basename] = _predict_route(rec, records, route)
			else:
				route_map[basename] = frappe.db.get_value("Wiki Document", rec["_wd_name"], "route")

	# ---- Phase 2: rewrite images + cross-section links, update content ----
	img_cache = {}
	existing_images = {} if dry_run else preload_existing_images()
	print(f"  phase 2: rewriting content ({len(existing_images)} images already present)", flush=True)
	import time as _t2

	_s2 = _t2.time()
	total_rewritten = 0
	_n = 0
	for subdir, space_name, route, records, ordered in sections:
		for rec in ordered:
			new_body = rewrite_content(rec, records, route_map, img_cache, existing_images, dry_run, warnings)
			if not dry_run and new_body != rec["body"]:
				doc = frappe.get_doc("Wiki Document", rec["_wd_name"])
				doc.content = new_body
				doc.save(ignore_permissions=True)
				total_rewritten += 1
			_n += 1
			if not dry_run and _n % 10 == 0:
				print(f"    rewritten {_n} pages, {len(img_cache)} imgs ({_t2.time()-_s2:.1f}s)", flush=True)

	if not dry_run:
		frappe.db.commit()

	print(f"\nimages uploaded: {len(img_cache)} | pages with rewritten content: {total_rewritten}")
	if warnings:
		print(f"WARNINGS ({len(warnings)}):")
		for w in warnings:
			print("  -", w)
	else:
		print("no warnings")
	return sections, warnings


def import_users(dry_run=True):
	"""Convenience: import only the users section (cross-links to tech may warn)."""
	global SECTIONS
	saved, SECTIONS = SECTIONS, [("users", "Hướng dẫn ERP", "huong-dan-erp")]
	try:
		return import_all(dry_run)
	finally:
		SECTIONS = saved
