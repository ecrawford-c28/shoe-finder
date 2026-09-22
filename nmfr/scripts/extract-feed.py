#!/usr/bin/env python3
"""Reduce the SportsShoes product feed to the handful of facts the quiz needs.

The feed is ~413MB and one row per SIZE, so a shoe appears a dozen times or
more. The site only needs four things per shoe: what it costs today, whether
anything is actually buyable, how deep the size range is, and where the women's
version lives. Everything else stays in the feed.

Reads the feed path as argv[1], the list of our product codes as argv[2],
writes JSON to argv[3]. Streams, so memory stays flat whatever the feed size.
"""
import csv, json, re, sys, collections, datetime
from urllib.parse import unquote

csv.field_size_limit(10_000_000)

def money(s):
    """'129.99 GBP' -> 129.99. Anything unparseable is simply absent."""
    try:
        return round(float(str(s).split()[0]), 2)
    except (ValueError, IndexError):
        return None

def model_key(title):
    """Strip gender and category words so a men's and women's listing of the
    same shoe collapse to the same key. Deliberately blunt: a false pairing
    would send women to the wrong shoe, so anything ambiguous simply fails to
    match and the shoe keeps its men's link."""
    t = title.lower()
    t = re.sub(r"\|.*$", "", t)
    t = re.sub(r"\b(men's|women's|mens|womens|unisex)\b", " ", t)
    t = re.sub(r"\b(running|trail|shoes?|trainers?)\b", " ", t)
    t = re.sub(r"[^a-z0-9 ]", " ", t)
    return re.sub(r"\s+", " ", t).strip()

def product_code(link):
    m = re.search(r"destination:(\S+)", link or "")
    if not m:
        return None
    pm = re.search(r"/product/([^/?]+)", unquote(m.group(1)))
    return pm.group(1) if pm else None

def main(feed_path, codes_path, out_path):
    # Accept either a plain list of codes or the shoe database itself, so the
    # scheduled job reads the same file the site does and cannot drift from it.
    raw = open(codes_path).read()
    if raw.lstrip().startswith("brand,"):
        ours = set()
        for row in csv.DictReader(raw.splitlines()):
            m = re.search(r"/product/([^/]+)/", row.get("retailer_url", ""))
            if m:
                ours.add(m.group(1))
    else:
        ours = set(raw.split())
    agg = collections.defaultdict(lambda: {
        "sizes": 0, "in_stock": 0, "prices": [], "sales": [], "title": "", "gender": ""
    })
    womens = {}   # model key -> code
    ourkey = {}   # our code -> model key

    with open(feed_path, newline="", encoding="utf-8", errors="replace") as f:
        for row in csv.DictReader(f):
            code = product_code(row.get("link", ""))
            if not code:
                continue
            title = row.get("title", "")
            is_running = bool(re.search(r"Running.*Shoe", row.get("product_type", ""), re.I))
            lower = title.lower()
            gender = ("womens" if "women's" in lower
                      else "mens" if "men's" in lower else "unisex")

            if code in ours:
                a = agg[code]
                a["sizes"] += 1
                if row.get("availability") == "in_stock":
                    a["in_stock"] += 1
                p, s = money(row.get("price")), money(row.get("sale_price"))
                if p: a["prices"].append(p)
                if s: a["sales"].append(s)
                if not a["title"]:
                    a["title"], a["gender"] = title, gender
                    ourkey[code] = model_key(title)
            elif gender == "womens" and is_running:
                # First listing wins. Later duplicates are usually colourways.
                womens.setdefault(model_key(title), code)

    out = {}
    for code, a in agg.items():
        rrp = min(a["prices"]) if a["prices"] else None
        sale = min(a["sales"]) if a["sales"] else None
        # A "sale" that is not below the list price is not a sale.
        if sale is not None and rrp is not None and sale >= rrp:
            sale = None
        entry = {
            "price": rrp,
            "sale": sale,
            "sizes": a["sizes"],
            "inStock": a["in_stock"],
        }
        wk = ourkey.get(code)
        if wk and wk in womens:
            entry["womens"] = womens[wk]
        out[code] = entry

    doc = {
        "generated": datetime.datetime.now(datetime.timezone.utc)
                        .replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "matched": len(out),
        "requested": len(ours),
        "shoes": dict(sorted(out.items())),
    }
    header = (
        "// Generated from the SportsShoes product feed. Do not edit by hand:\n"
        "// the daily refresh overwrites this file wholesale.\n"
        "//\n"
        "// The feed is ~413MB and carries one row per size. This is the residue\n"
        "// of it the site actually needs: what each shoe costs today, whether any\n"
        "// size is in stock, and the product code of the women's listing where\n"
        "// one exists.\n"
        "//\n"
        "// A shoe absent from here is absent from the retailer's catalogue, which\n"
        "// the site treats as unbuyable. See lib/feed.js.\n"
        f"//\n// Generated: {doc['generated']}\n"
        f"// Matched: {doc['matched']} of {doc['requested']} shoes in the database.\n\n"
    )
    # Serialise numbers the way JavaScript does, so a file written here and one
    # written by any other tool compare byte for byte instead of merely parsing
    # to the same thing.
    def jsnum(o):
        if isinstance(o, float) and o.is_integer():
            return int(o)
        if isinstance(o, dict):
            return {k: jsnum(v) for k, v in o.items()}
        if isinstance(o, list):
            return [jsnum(v) for v in o]
        return o

    with open(out_path, "w") as fh:
        fh.write(header + "const feed = " + json.dumps(jsnum(doc), indent=1) + ";\n\nexport default feed;\n")
    print(f"matched {len(out)} of {len(ours)} codes")
    print(f"with a women's counterpart: {sum(1 for v in out.values() if 'womens' in v)}")
    print(f"with sizes in stock       : {sum(1 for v in out.values() if v['inStock'] > 0)}")
    print(f"currently discounted      : {sum(1 for v in out.values() if v['sale'])}")

if __name__ == "__main__":
    main(*sys.argv[1:4])
