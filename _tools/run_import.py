import sys
import frappe

BENCH = "/home/Volumes/ws/thegioidiengiai.com/dev/erps/v3/cobe.cc"
IMPORTER = f"{BENCH}/help/cobe_erp_documents/_tools/import_to_wiki.py"

frappe.init(site="cobe.cc", sites_path=f"{BENCH}/sites")
frappe.connect()

# This is a local dev site whose S3 secret cannot be decrypted (prod encryption
# key differs). The storage_management File hook tries to push every new File to
# S3 and crashes on decrypt. Neutralise it for this process so imported images
# become local /files/ assets. Process-local, reversible, touches no site config.
import storage_management.libs.events as _sm_events  # noqa: E402

_sm_events.on_file_before_save = lambda doc, method=None: None

# Each Wiki Document write normally rebuilds the WHOLE space revision tree and
# recomputes hashes (O(n) per write -> O(n^2) for a bulk import, times out).
# _sync_document_to_revision honours this guard flag, so set it for the whole
# import and rebuild each space's main revision exactly once at the end. The live
# Wiki Document tree is what renders; main_revision only backs history/CRs.
from wiki.api.wiki_space import _sync_main_revision_for_space  # noqa: E402

frappe.flags.in_reorder_wiki_documents = True

# tabFile has ~316k rows and no index on content_hash, so File.validate_duplicate_entry
# is a ~4s full-table scan per image. Our importer already dedupes images by a
# content-hash filename, so the check is redundant here. Neutralise it for this
# process only (no schema change to the site).
from frappe.core.doctype.file.file import File as _File  # noqa: E402

_File.validate_duplicate_entry = lambda self: None

dry = "--apply" not in sys.argv
g = {"frappe": frappe}
exec(compile(open(IMPORTER).read(), IMPORTER, "exec"), g)
try:
    g["import_all"](dry_run=dry)
    if not dry:
        frappe.db.commit()
        # Rebuild each affected space's main revision once, now that all docs exist.
        frappe.flags.in_reorder_wiki_documents = False
        for route in ("huong-dan-erp", "developers"):
            space = frappe.db.get_value("Wiki Space", {"route": route}, "name")
            if space:
                _sync_main_revision_for_space(space)
                print(f">>> rebuilt revision for space {space} (/{route})")
        frappe.db.commit()
        print(">>> COMMITTED")
    else:
        print(">>> DRY RUN (no writes)")
except Exception:
    import traceback

    traceback.print_exc()
    frappe.db.rollback()
    print(">>> FAILED, rolled back")
finally:
    frappe.destroy()
