#!/usr/bin/env python3
"""List running shoes that have appeared in the SportsShoes feed and are not in
the database, so new arrivals can be considered rather than stumbled upon.

The feed holds about a thousand running shoe models and the database carries a
couple of hundred, chosen by hand. The gap is mostly deliberate, so listing all
of it would be noise nobody reads twice. Two things keep the list short.

Variants fold into the model they belong to. A GORE-TEX Novablast, a LITE-SHOW
Novablast and a 2E width Peregrine are not new shoes, they are a shoe already in
the database wearing a different upper.

A baseline file remembers every model key already seen in the feed. Models in
that file are old news however long they have been ignored, so the output is
arrivals only. The first run writes the baseline and lists nothing, which is
the point: without it, day one would report six hundred shoes.

Rows age off after RECENT_DAYS, and drop immediately once the model reaches the
database or leaves the feed.

argv: feed csv, database csv, output csv, baseline csv.
Exits 0 without writing if the feed looks wrong, because a stale list beats an
empty one.
"""
import csv, datetime, os, re, sys
from urllib.parse import unquote

csv.field_size_limit(10_000_000)

RECENT_DAYS = 60
MIN_FEED_ROWS = 50_000

CODE_RE = re.compile(r"/product/([^/?]+)")
# Not road or trail running shoes for adults. product_type carries most of it;
# the title carries the rest, because Nike files junior shoes under plain
# Running and adidas files throwing shoes there too.
PTYPE_SKIP = re.compile(r"spike|kids|junior|walking|approach", re.I)
TITLE_SKIP = re.compile(
    r"\b(juniors?|kid'?s|grade school|pre school|infants?|toddlers?|throwing|spikes?|"
    r"tennis|court|golf|cricket|football|netball|hockey|recovery|training shoes|gels?|"
    r"socks?|insoles?)\b", re.I
)
# The feed files a few things under Running > Shoes that are not running shoes,
# a box of energy gels among them, so the title has to say shoe as well.
TITLE_MUST = re.compile(r"\bshoes?\b", re.I)
# Words that describe a version of a shoe rather than a different shoe.
VARIANT = re.compile(
    r"\b(gore ?tex|gtx|lite ?show|2e|4e|2a|d width|wide fit(ting)?|narrow fit(ting)?|"
    r"standard fit|climaproof|waterproof|se|ek|glm|ess|premium|edition|"
    r"berlin|london|tokyo|paris|amsterdam|copenhagen|new york|nyc|marathon|"
    r"keely hodgkinson|swarovski)\b",
    re.I,
)


def clean_title(title):
    """The feed appends a size and a colourway to every row. Neither belongs in
    a list of models."""
    return re.sub(r"\s*\|.*$", "", title).strip()


def model_key(title):
    t = clean_title(title).lower()
    t = re.sub(r"\bin [a-z/ ]+$", " ", t)
    t = re.sub(r"\((.*?)\)", " ", t)
    t = re.sub(r"\b(men's|women's|mens|womens|unisex)\b", " ", t)
    t = re.sub(r"\b(running|trail|shoes?|trainers?)\b", " ", t)
    t = re.sub(r"[^a-z0-9 ]", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def base_key(title):
    return re.sub(r"\s+", " ", VARIANT.sub(" ", model_key(title))).strip()


def money(v):
    try:
        return float((v or "0").split()[0] or 0)
    except ValueError:
        return 0.0


def database_keys(path):
    keys, codes = set(), set()
    with open(path, encoding="utf-8", errors="replace", newline="") as fh:
        for row in csv.DictReader(fh):
            brand = (row.get("brand") or "").strip()
            model = (row.get("model") or "").strip()
            if brand and model:
                keys.add(base_key(f"{brand} {model}"))
            m = CODE_RE.search(row.get("retailer_url") or "")
            if m:
                codes.add(m.group(1).lower())
    return keys, codes


def read_baseline(path):
    """key -> (first_seen, is_baseline). Baseline rows are the catalogue as it
    stood when this started running; they are not arrivals and never appear in
    the output, however recent the date on them."""
    seen = {}
    if not os.path.exists(path):
        return seen
    with open(path, encoding="utf-8", errors="replace", newline="") as fh:
        for row in csv.DictReader(fh):
            if row.get("key") and row.get("first_seen"):
                seen[row["key"]] = (row["first_seen"], row.get("baseline") == "1")
    return seen


def scan_feed(path, db_keys, db_codes):
    found, rows_read = {}, 0
    with open(path, encoding="utf-8", errors="replace", newline="") as fh:
        for row in csv.DictReader(fh):
            rows_read += 1
            ptype = row.get("product_type") or ""
            if not re.search(r"Running.*Shoe", ptype, re.I) or PTYPE_SKIP.search(ptype):
                continue
            title = row.get("title") or ""
            if TITLE_SKIP.search(title) or not TITLE_MUST.search(title):
                continue
            m = CODE_RE.search(unquote(row.get("link") or ""))
            if not m:
                continue
            code = m.group(1).lower()
            key = base_key(title)
            if not key or key in db_keys or code in db_codes:
                continue
            rec = found.setdefault(key, {
                "brand": (row.get("brand") or "").strip(),
                "title": clean_title(title),
                "codes": set(), "rrp": 0.0, "lowest": None, "in_stock": 0, "image": "",
            })
            rec["codes"].add(code)
            rec["rrp"] = max(rec["rrp"], money(row.get("price")))
            sale = money(row.get("sale_price")) or money(row.get("price"))
            if sale and (rec["lowest"] is None or sale < rec["lowest"]):
                rec["lowest"] = sale
            # The feed says in_stock, with an underscore, which is easy to get
            # wrong and silently empties the whole list when you do.
            if (row.get("availability") or "").lower().replace("_", " ").startswith("in stock"):
                rec["in_stock"] += 1
            if not rec["image"]:
                rec["image"] = (row.get("image_link") or "").strip()
            clean = clean_title(title)
            if len(clean) < len(rec["title"]):
                rec["title"] = clean
    return found, rows_read


def main(feed_path, db_path, out_path, baseline_path):
    db_keys, db_codes = database_keys(db_path)
    if len(db_codes) < 40:
        print(f"Only {len(db_codes)} product codes in the database. Refusing to guess.")
        return 0

    found, rows_read = scan_feed(feed_path, db_keys, db_codes)
    if rows_read < MIN_FEED_ROWS:
        print(f"Feed had {rows_read} rows, which is not a full catalogue. Nothing written.")
        return 0

    sellable = {k: v for k, v in found.items() if v["in_stock"]}
    today = datetime.date.today()
    seen = read_baseline(baseline_path)
    first_run = not seen

    for key in sellable:
        seen.setdefault(key, (today.isoformat(), first_run))
    # Keys the feed no longer carries fall out, so a shoe that comes back after
    # a long gap is treated as an arrival again rather than staying invisible.
    seen = {k: v for k, v in seen.items() if k in sellable}

    with open(baseline_path, "w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["key", "first_seen", "baseline"])
        for k in sorted(seen):
            w.writerow([k, seen[k][0], "1" if seen[k][1] else ""])

    cutoff = (today - datetime.timedelta(days=RECENT_DAYS)).isoformat()
    cols = ["first_seen", "brand", "model", "rrp", "lowest", "sizes_in_stock",
            "product_code", "url", "image"]
    rows = []
    if not first_run:
        for key, rec in sellable.items():
            first_seen, is_baseline = seen[key]
            if is_baseline or first_seen < cutoff:
                continue
            code = sorted(rec["codes"])[0]
            rows.append({
                "first_seen": seen[key][0],
                "brand": rec["brand"],
                "model": rec["title"],
                "rrp": f"{rec['rrp']:.2f}",
                "lowest": f"{rec['lowest']:.2f}" if rec["lowest"] else "",
                "sizes_in_stock": rec["in_stock"],
                "product_code": code,
                "url": f"https://www.sportsshoes.com/product/{code}/",
                "image": rec["image"],
            })
        rows.sort(key=lambda r: (r["first_seen"], r["brand"], r["model"]), reverse=True)

    with open(out_path, "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)

    if first_run:
        print(f"Baseline written with {len(seen)} models. No arrivals listed on a first run.")
    else:
        fresh = sum(1 for r in rows if r["first_seen"] == today.isoformat())
        print(f"{len(rows)} arrivals in the last {RECENT_DAYS} days, {fresh} first seen today.")
    return 0


if __name__ == "__main__":
    sys.exit(main(*sys.argv[1:5]))
