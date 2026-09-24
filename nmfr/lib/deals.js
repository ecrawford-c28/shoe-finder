// The deals pages: what is discounted today, in a size you can actually buy.
//
// Server only. This imports data/sizes.js, which is three times the size of
// data/feed.js, and nothing here is reachable from the quiz, so none of it ends
// up in the browser bundle. Keep it that way: if a client component ever needs
// something from here, copy the handful of values it needs rather than the
// import.
//
// The quiz answers "which shoe suits me". This answers a different and much
// blunter question, "what is cheap in my size right now", which is the one the
// quiz cannot reach because data/feed.js only counts sizes rather than naming
// them.
import sizes from '../data/sizes.js';
import feedData from '../data/feed.js';

const FEED = (feedData && feedData.shoes) || {};

// Below this a "deal" is just noise: a pound or two off a full price shoe is
// not a reason to build a page around it, and listing it makes the honest
// discounts look weaker than they are.
export const MIN_PERCENT_OFF = 10;

export const GENERATED = sizes.generated || null;

const productCode = url => {
  const m = /\/product\/([^/?]+)/.exec(url || '');
  return m ? m[1] : '';
};

const bySize = (a, b) => Number(a) - Number(b);

// Every size the retailer currently has anything in stock in, per gender. Built
// from the data rather than hardcoded, so a size that disappears from the
// catalogue stops being a page instead of becoming an empty one.
function scaleFor(gender) {
  const src = gender === 'women' ? sizes.womens : sizes.mens;
  const all = new Set();
  for (const code of Object.keys(src || {})) {
    for (const s of src[code].in || []) all.add(s);
  }
  return [...all].sort(bySize);
}

export const SCALES = {
  men: scaleFor('men'),
  women: scaleFor('women'),
};

export const GENDERS = ['men', 'women'];

// "9.5" -> "mens-uk-9-5". A full stop in a path segment reads as a file
// extension to half the web, so it becomes a hyphen.
export function dealSlug(gender, size) {
  return `${gender === 'women' ? 'womens' : 'mens'}-uk-${String(size).replace('.', '-')}`;
}

export function parseDealSlug(slug) {
  const m = /^(mens|womens)-uk-(\d+(?:-5)?)$/.exec(slug || '');
  if (!m) return null;
  const gender = m[1] === 'womens' ? 'women' : 'men';
  const size = m[2].replace('-', '.');
  return SCALES[gender].includes(size) ? { gender, size } : null;
}

export function allDealSlugs() {
  return GENDERS.flatMap(g => SCALES[g].map(s => dealSlug(g, s)));
}

// What this shoe costs in this size, and on which listing. The women's listing
// is a different product with its own price, so a women's deal is never just
// the men's discount reported against a women's size.
function offerFor(shoe, gender, size) {
  const code = productCode(shoe.retailer_url);
  const base = FEED[code];
  if (!base) return null;

  if (gender === 'women') {
    const wcode = base.womens;
    const w = wcode && sizes.womens[wcode];
    if (!w || !w.in.includes(size)) return null;
    return { listing: wcode, price: w.price, sale: w.sale, sizesLeft: w.in.length };
  }

  const m = sizes.mens[code];
  if (!m || !m.in.includes(size)) return null;
  return { listing: code, price: base.price, sale: base.sale, sizesLeft: m.in.length };
}

const CATEGORY_ORDER = ['daily_trainer', 'max_cushion', 'stability', 'tempo', 'race', 'trail'];

export const CATEGORY_LABEL = {
  daily_trainer: 'Everyday trainers',
  max_cushion: 'Max cushion',
  stability: 'Stability',
  tempo: 'Tempo and faster',
  race: 'Race day',
  trail: 'Trail',
};

// Discounted shoes available in one size, grouped by what the shoe is for and
// ranked by how deep the discount is inside each group. Grouping matters: the
// deepest discount on the page is no use to somebody who needs a stability shoe
// and is looking at a carbon racer.
export function dealsForSize(shoes, gender, size) {
  const found = [];
  for (const shoe of shoes) {
    const offer = offerFor(shoe, gender, size);
    if (!offer || !offer.sale || !offer.price) continue;
    const percentOff = Math.round((1 - offer.sale / offer.price) * 100);
    if (percentOff < MIN_PERCENT_OFF) continue;
    found.push({
      shoe,
      now: offer.sale,
      was: offer.price,
      percentOff,
      saving: Math.round((offer.price - offer.sale) * 100) / 100,
      sizesLeft: offer.sizesLeft,
    });
  }

  const groups = CATEGORY_ORDER
    .map(category => ({
      category,
      label: CATEGORY_LABEL[category] || category,
      deals: found
        .filter(d => d.shoe.category === category)
        .sort((a, b) => b.percentOff - a.percentOff || a.now - b.now),
    }))
    .filter(g => g.deals.length);

  const best = found.slice().sort((a, b) => b.percentOff - a.percentOff)[0] || null;
  return {
    groups,
    count: found.length,
    best,
    deepest: best ? best.percentOff : 0,
    cheapest: found.length ? Math.min(...found.map(d => d.now)) : null,
  };
}

// How many deals each size has, for the index page. Cheap enough to do for
// every size at build time.
export function dealCounts(shoes) {
  const out = {};
  for (const gender of GENDERS) {
    out[gender] = SCALES[gender].map(size => {
      const { count, deepest } = dealsForSize(shoes, gender, size);
      return { size, slug: dealSlug(gender, size), count, deepest };
    });
  }
  return out;
}
