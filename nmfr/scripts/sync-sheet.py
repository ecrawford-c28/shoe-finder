#!/usr/bin/env python3
"""Pull the shoe database from the published Google Sheet into the repo.

The sheet is the editorial source. Two copies of it live here: the CSV the
nightly feed job reads, and data/fallback.js, the emergency copy the site
serves when Google is unreachable. Both used to be updated by hand, which
meant that the day the sheet grew from 113 shoes to 217 the feed job carried
on matching the old 113 and a hundred shoes sat in the database unable to be
recommended, because a shoe with no feed entry counts as delisted.

So neither is maintained any more. Both are written from the sheet, here,
before the feed job runs.

Reads the sheet URL as argv[1], writes the CSV to argv[2] and the fallback to
argv[3]. Exits 0 and changes nothing when the sheet cannot be trusted, because
a stale database is a great deal better than an empty one.
"""
import csv, io, sys, urllib.request

# Losing rows is the failure that actually happened: a partial paste into the
# sheet, or an import that stopped halfway. Anything that would drop more than
# a fifth of the database is treated as damage rather than as an edit.
SHRINK_LIMIT = 0.8

def fail(msg):
    print(f"Sheet not used: {msg}")
    sys.exit(0)

def main(url, csv_path, fallback_path):
    try:
        with urllib.request.urlopen(url, timeout=120) as r:
            raw = r.read().decode("utf-8", "replace")
    except Exception as e:
        fail(f"could not fetch it ({e})")

    # A sheet that is not published returns a sign in page with a 200.
    if raw.lstrip().startswith("<"):
        fail("got HTML, so the sheet is probably no longer published")
    if not raw.lstrip().lower().startswith("brand,"):
        fail("the header is not the shoe database")

    rows = list(csv.DictReader(io.StringIO(raw)))
    rows = [r for r in rows if (r.get("brand") or "").strip() and (r.get("model") or "").strip()]
    if not rows:
        fail("no usable rows")

    try:
        with open(csv_path, encoding="utf-8") as fh:
            before = sum(1 for _ in csv.DictReader(fh))
    except FileNotFoundError:
        before = 0
    if before and len(rows) < before * SHRINK_LIMIT:
        fail(f"it has {len(rows)} rows against {before} here, which looks like damage rather than an edit")

    text = raw if raw.endswith("\n") else raw + "\n"
    with open(csv_path, "w", encoding="utf-8", newline="") as fh:
        fh.write(text)

    header = (
        "// Emergency copy of the shoe database, used only when the Google Sheet cannot\n"
        "// be reached. A COMPLETE mirror, not a subset: if the sheet is unreachable the\n"
        "// site carries on with the full range rather than quietly shrinking. Plain CSV\n"
        "// on purpose so damage in transit is obvious rather than silent. /status reports\n"
        "// which source is live and flags \"bundled-incomplete\" if this file is short.\n"
        "//\n"
        "// Written by scripts/sync-sheet.py from the sheet. Do not edit by hand.\n"
        f"export const FALLBACK_ROWS = {len(rows)};\n"
        "export default `"
    )
    # Backticks and ${ would end the template literal or start a substitution.
    body = text.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    with open(fallback_path, "w", encoding="utf-8") as fh:
        fh.write(header + body + "`;\n")

    print(f"Sheet synced: {len(rows)} shoes (was {before}).")

if __name__ == "__main__":
    main(*sys.argv[1:4])
