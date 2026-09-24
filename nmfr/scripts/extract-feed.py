#!/usr/bin/env python3
"""Reduce the SportsShoes product feed to the handful of facts the quiz needs.

The feed is ~413MB and one row per SIZE, so a shoe appears a dozen times or
more. The site only needs four things per shoe: what it costs today, whether
anything is actually buyable, how deep the size range is, and where the women's
version lives. Everything else stays in the feed.

Reads the feed path as argv[1], the list of our product codes as argv[2],
writes the quiz's data file to argv[3] and, optionally, the deals page's size
data to argv[4]. Streams, so memory stays flat whatever the feed size.

The split matters. argv[3] is imported by lib/feed.js, which the quiz scores
shoes with in the browser, so every byte of it ships to every visitor. The size
lists are only ever read on the server when building the deals pages, so they
live apart rather than doubling the client bundle for a page most people never
open.
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

def size_key(s):
    """UK sizes are numeric, so sort them numerically. A stray non numeric
    size sorts last rather than blowing up the run."""
    try:
        return (0, float(s))
    except ValueError:
        return (1, 0.0)

def product_code(link):
    m = re.search(r"destination:(\S+)", link or "")
    if not m:
        return None
    pm = re.search(r"/product/([^/?]+)", unquote(m.group(1)))
    return pm.group(1) if pm else None

def main(feed_path, codes_path, out_path, sizes_path=None):
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
        "sizes": 0, "in_stock": 0, "prices": [], "sales": [], "title": "",
        "gender": "", "in": []
    })
    # model key -> {women's code: sizes in stock}. Counting rather than taking
    # the first listing matters: these are often several colourways deep and the
    # first one in the feed is as likely as not to be the clearance colour with
    # one size left. Sending a woman to that page is worse than not linking.
    womens = collections.defaultdict(collections.Counter)
    # Price and in-stock sizes for every women's listing seen, so that once the
    # winner is picked its own figures are to hand. A women's colourway is not
    # always priced like the men's one, and the GORE-TEX versions never are.
    wdetail = collections.defaultdict(lambda: {"prices": [], "sales": [], "in": []})
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
                    size = (row.get("size") or "").strip()
                    if size:
                        a["in"].append(size)
                p, s = money(row.get("price")), money(row.get("sale_price"))
                if p: a["prices"].append(p)
                if s: a["sales"].append(s)
                if not a["title"]:
                    a["title"], a["gender"] = title, gender
                    ourkey[code] = model_key(title)
            elif gender == "womens" and is_running:
                live = row.get("availability") == "in_stock"
                tally = womens[model_key(title)]
                tally[code] += 1 if live else 0
                if sizes_path:
                    d = wdetail[code]
                    p, s_ = money(row.get("price")), money(row.get("sale_price"))
                    if p: d["prices"].append(p)
                    if s_: d["sales"].append(s_)
                    if live:
                        size = (row.get("size") or "").strip()
                        if size:
                            d["in"].append(size)

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
            # Deepest size range wins, and ties fall to whichever the feed
            # listed first, so the same feed always produces the same file.
            entry["womens"] = womens[wk].most_common(1)[0][0]
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
    if sizes_path:
        def priced(prices, sales):
            rrp = min(prices) if prices else None
            sale = min(sales) if sales else None
            if sale is not None and rrp is not None and sale >= rrp:
                sale = None
            return rrp, sale

        mens = {}
        for code, a in agg.items():
            mens[code] = {"in": sorted(set(a["in"]), key=size_key)}
        wout = {}
        for code, entry in out.items():
            w = entry.get("womens")
            if not w or w in wout:
                continue
            d = wdetail.get(w)
            if not d:
                continue
            rrp, sale = priced(d["prices"], d["sales"])
            wout[w] = {"price": rrp, "sale": sale,
                       "in": sorted(set(d["in"]), key=size_key)}

        sdoc = {
            "generated": doc["generated"],
            "mens": dict(sorted(mens.items())),
            "womens": dict(sorted(wout.items())),
        }
        sheader = (
            "// Generated from the SportsShoes product feed. Do not edit by hand:\n"
            "// the daily refresh overwrites this file wholesale.\n"
            "//\n"
            "// Which sizes are actually in stock, per product code, for the deals\n"
            "// pages. data/feed.js knows how many sizes a shoe has left; this knows\n"
            "// which ones, which is the only thing that lets someone ask for a\n"
            "// bargain in their own size.\n"
            "//\n"
            "// Server only. Nothing in here is imported by the quiz, so it never\n"
            "// reaches the browser. See lib/deals.js.\n"
            "//\n"
            "// Women's listings carry their own price because a women's colourway\n"
            "// is not always priced like the men's one, and the GORE-TEX versions\n"
            "// never are.\n"
            f"//\n// Generated: {sdoc['generated']}\n"
            f"// Men's listings: {len(mens)}. Women's listings: {len(wout)}.\n\n"
        )
        with open(sizes_path, "w") as fh:
            fh.write(sheader + "const sizes = " + json.dumps(jsnum(sdoc), indent=1)
                     + ";\n\nexport default sizes;\n")

    print(f"matched {len(out)} of {len(ours)} codes")
    print(f"with a women's counterpart: {sum(1 for v in out.values() if 'womens' in v)}")
    print(f"with sizes in stock       : {sum(1 for v in out.values() if v['inStock'] > 0)}")
    print(f"currently discounted      : {sum(1 for v in out.values() if v['sale'])}")
    if sizes_path:
        every = sorted({z for a in agg.values() for z in a["in"]}, key=size_key)
        print(f"men's sizes seen          : {', '.join(every)}")

if __name__ == "__main__":
    main(*sys.argv[1:5])
