#!/usr/bin/env bash
#
# sync.sh — Đồng bộ các file hướng dẫn (.md) từ source code các app sang site doc.
#
# Cách hoạt động:
#   - Mỗi tính năng khai báo 1 dòng trong bảng MAP bên dưới:
#       dest|source|parent|nav_order|title
#   - Script copy nội dung file source, BỎ front matter cũ (nếu có) rồi CHÈN
#     front matter chuẩn của just-the-docs (title / parent / nav_order) vào đầu.
#   - Các trang nhóm (parent) và trang chủ được tạo cố định trong hàm build_shell().
#
# Chạy:   ./sync.sh
# Tuỳ chọn: APPS_DIR=/đường/dẫn/apps ./sync.sh
#
set -euo pipefail

# Thư mục repo doc (nơi đặt script này)
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Thư mục apps của bench. Mặc định suy ra từ vị trí repo: <bench>/help/<repo>  ->  <bench>/apps
APPS_DIR="${APPS_DIR:-$(cd "$REPO_DIR/../../apps" && pwd)}"

USERS_DIR="$REPO_DIR/users"
CFC="$APPS_DIR/custom_for_cobegroup/custom_for_cobegroup/custom_for_cobegroup"

# ---------------------------------------------------------------------------
# Bảng ánh xạ:  dest_file | source_path(tuyệt đối) | parent | nav_order | title
# parent = "" nghĩa là trang gốc (top-level). Ở đây tất cả guide đều có parent.
# ---------------------------------------------------------------------------
MAP=(
  # --- Marketing & Khách hàng ---
  "Coupon_Campaign-USAGE_GUIDE.md|$CFC/doctype/coupon_campaign/USAGE_GUIDE.md|Marketing & Khách hàng|1|Coupon Campaign — Khuyến mãi"
  # Loyalty docs (users/Loyalty-Tich-Diem.md + tech/Loyalty-3rd-Party-API.md)
  # đã chuyển hẳn về repo này — biên soạn trực tiếp, không sync từ app source nữa.
  "HUONG_DAN_ZALO_MINIAPP.md|$CFC/zalo_miniapp/HUONG_DAN_ZALO_MINIAPP.md|Marketing & Khách hàng|3|Zalo Mini App (Khách hàng)"

  # --- Dịch vụ & Bảo dưỡng ---
  "Service_Reminder_Auto_Assign.md|$APPS_DIR/service_reminder/service_reminder/sim_management/HUONG_DAN_SU_DUNG.md|Dịch vụ & Bảo dưỡng|1|Auto-Assign Ticket & SIM"
  "QUY_TAC_PHAN_BO_BAO_DUONG.md|$APPS_DIR/service_reminder/service_reminder/sim_management/QUY_TAC_PHAN_BO_BAO_DUONG.md|Dịch vụ & Bảo dưỡng|2|Quy tắc phân bổ bảo dưỡng"

  # --- Vận chuyển & Giao nhận ---
  # Delivery Partner docs (users/Delivery_Partner.md + tech/Delivery_Partner-Tech.md)
  # đã chuyển hẳn về repo này — biên soạn trực tiếp, không sync từ app source nữa.
  "Delivery_Partner_Extension.md|$APPS_DIR/delivery_partner_extension_for_cobegroup/USAGE_GUIDE.md|Vận chuyển & Giao nhận|2|Delivery Partner Extension (Cobe)"
  "Handover_Minutes_V2.md|$APPS_DIR/custom_for_cobegroup/docs/handover_minutes_v2_guide.md|Vận chuyển & Giao nhận|3|Handover Minutes V2 (Biên bản bàn giao)"
)

# File guide cũ đã đổi tên — xoá để tránh trùng trong sidebar
STALE=(
  "Service_Reminder_Huong_Dan_Su_Dung_Phan_Bo_Ticket.md"
)

# Rewrite link nội bộ guide-to-guide khi tên file trên site khác tên file trong source.
# Dạng:  "ten_trong_source.md|ten_tren_site.md"
# (Chỉ áp dụng cho link tài liệu thật sự có trên site; link trỏ vào source code
#  như README.md / ../hooks.py được giữ nguyên.)
REWRITE=(
  "HUONG_DAN_SU_DUNG.md|Service_Reminder_Auto_Assign.md"
)

# ---------------------------------------------------------------------------
# Bỏ front matter YAML ở đầu file (nếu dòng đầu là '---' ... '---')
strip_front_matter() {
  awk '
    NR==1 && $0=="---" { infm=1; next }
    infm && $0=="---"  { infm=0; next }
    infm              { next }
    { print }
  ' "$1"
}

# ---------------------------------------------------------------------------
# Tạo trang chủ + các trang nhóm (parent)
build_shell() {
  # Trang chủ
  cat > "$REPO_DIR/index.md" <<'EOF'
---
title: Trang chủ
layout: default
nav_order: 1
---

# COBE Group — ERP — Tài liệu hướng dẫn

Tài liệu hướng dẫn sử dụng các tính năng của hệ thống COBE Group ERP.
Chọn nhóm tính năng ở thanh điều hướng bên trái, hoặc xem nhanh bên dưới.

## Nhóm tính năng

- **Marketing & Khách hàng** — Coupon khuyến mãi, Loyalty tích điểm, Zalo Mini App.
- **Dịch vụ & Bảo dưỡng** — Tự động phân bổ ticket bảo dưỡng cho nhân viên.
- **Vận chuyển & Giao nhận** — Quản lý vận đơn, tích hợp ERP, biên bản bàn giao.
- **Tài liệu kỹ thuật** — API spec, design notes cho developer / 3rd party vendor.

> Hướng dẫn người dùng cuối được sinh tự động qua `./sync.sh` (xem nguồn trong
> source code các app). Tài liệu kỹ thuật trong `tech/` được biên soạn trực
> tiếp trong repo này.
EOF

  # Trang nhóm
  write_parent "00-marketing.md"   "Marketing & Khách hàng" 2 \
    "Các tính năng phục vụ marketing và chăm sóc khách hàng: chương trình khuyến mãi bằng coupon, hệ thống tích điểm loyalty, và ứng dụng Zalo Mini App cho khách hàng."
  write_parent "00-dich-vu.md"     "Dịch vụ & Bảo dưỡng"   3 \
    "Quản lý và tự động phân bổ ticket bảo dưỡng/CSKH cho nhân viên phụ trách."
  write_parent "00-van-chuyen.md"  "Vận chuyển & Giao nhận" 4 \
    "Quản lý vận đơn, kết nối đơn vị vận chuyển, tích hợp ERP và biên bản bàn giao/nghiệm thu."
}

write_parent() {
  local file="$1" title="$2" order="$3" desc="$4"
  cat > "$USERS_DIR/$file" <<EOF
---
title: $title
layout: default
nav_order: $order
has_children: true
---

# $title

$desc
EOF
}

# ---------------------------------------------------------------------------
echo "Repo : $REPO_DIR"
echo "Apps : $APPS_DIR"
echo

mkdir -p "$USERS_DIR"

# Xoá file cũ đã đổi tên
for s in "${STALE[@]}"; do
  if [[ -f "$USERS_DIR/$s" ]]; then rm -f "$USERS_DIR/$s"; echo "  removed (stale): users/$s"; fi
done

build_shell
echo "  wrote: index.md + 3 trang nhóm"
echo

missing=0
for row in "${MAP[@]}"; do
  IFS='|' read -r dest src parent order title <<< "$row"
  if [[ ! -f "$src" ]]; then
    echo "  !! THIẾU NGUỒN: $src"
    missing=1
    continue
  fi
  {
    printf -- '---\n'
    printf 'title: %s\n' "$title"
    printf 'layout: default\n'
    printf 'parent: %s\n' "$parent"
    printf 'nav_order: %s\n' "$order"
    printf -- '---\n\n'
    strip_front_matter "$src"
  } > "$USERS_DIR/$dest"

  # Rewrite link guide-to-guide theo tên file trên site, chỉ trong dạng ](...)
  for rw in "${REWRITE[@]}"; do
    from="${rw%|*}"; to="${rw#*|}"
    sed -i "s|](${from})|](${to})|g" "$USERS_DIR/$dest"
  done

  echo "  synced: users/$dest   <-  ${src#$APPS_DIR/}"
done

echo
if [[ "$missing" -eq 1 ]]; then
  echo "Hoàn tất CÓ LỖI: thiếu một số file nguồn (xem ở trên)."
  exit 1
fi
echo "Hoàn tất. Kiểm tra git diff rồi commit/push."
