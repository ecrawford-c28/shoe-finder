// The retailer feed, reduced to what the site needs.
//
// This lives apart from lib/shoes.js on purpose. shoes.js fetches the Google
// Sheet and is server only; the quiz scores shoes in the browser and needs the
// same stock and price facts. Keeping them here means the client bundle picks
// up an 11KB data file rather than the whole 47KB fallback database.
//
// The sheet is the editorial source: specs, categories, the one liner, the
// things a person decides. The feed is the commercial one: what a shoe costs
// today, whether anyone can buy it, and where the women's listing is. They
// change on completely different clocks, so they are merged rather than
// maintained together.
//
// Everything here degrades to pre-feed behaviour when the data is missing, so a
// failed refresh can never empty the site.
import feedData from '../data/feed.js';

const FEED = (feedData && feedData.shoes) || {};

// A handful of entries means something went wrong upstream. Twenty is well
// below a healthy count and well above anything a broken run would produce.
export const FEED_OK = Object.keys(FEED).length > 20;
export const FEED_GENERATED = (feedData && feedData.generated) || null;

const productCode = url => {
  const m = /\/product\/([^/?]+)/.exec(url || '');
  return m ? m[1] : '';
};

export function feedFor(shoe) {
  if (!FEED_OK || !shoe) return null;
  return FEED[productCode(shoe.retailer_url)] || null;
}

// UK sizes, as the bitmasks in data/feed.js index them. These two arrays are
// mirrored in scripts/extract-feed.py and the two must not drift: shifting one
// by a position would quietly tell somebody a shoe comes in their size when it
// does not. If you change a scale here, change it there in the same commit.
export const SIZE_SCALE = {
  men: Array.from({ length: 21 }, (_, i) => 4 + 0.5 * i),     // 4 to 14
  women: Array.from({ length: 18 }, (_, i) => 2.5 + 0.5 * i), // 2.5 to 11
};

// Whether this shoe is in stock in one size right now.
//
// Three ways to answer "I do not know", all of which mean "do not filter this
// shoe out": the feed is missing or stale, this entry predates the bitmask, or
// the size is off the end of the scale. Silence is never read as absence,
// because the cost of wrongly hiding a good shoe is worse than the cost of
// letting an out of stock one through, and the results already say plainly
// when a size is not stocked.
export function hasSize(shoe, gender, size) {
  const f = feedFor(shoe);
  if (!f) return null;
  const women = gender === 'women';
  const mask = women ? f.wfit : f.fit;
  if (typeof mask !== 'number') return null;
  const i = SIZE_SCALE[women ? 'women' : 'men'].indexOf(Number(size));
  if (i < 0) return null;
  return Boolean(mask & (1 << i));
}

// The sizes the site can actually offer someone, so the quiz asks about sizes
// that exist rather than a hardcoded range. Falls back to the full scale when
// the feed has no bitmasks yet.
export function sizesOffered(gender) {
  const women = gender === 'women';
  const scale = SIZE_SCALE[women ? 'women' : 'men'];
  let seen = 0;
  for (const code of Object.keys(FEED)) {
    const mask = women ? FEED[code].wfit : FEED[code].fit;
    if (typeof mask === 'number') seen |= mask;
  }
  if (!seen) return scale;
  return scale.filter((_, i) => seen & (1 << i));
}

// A shoe nobody can buy should never be recommended, however well it fits.
// Absent from the feed counts as unbuyable: the feed lists everything the
// retailer actually sells, so a missing entry means delisted. That is exactly
// how four shoes sat in the results for weeks with no stock behind them.
export function isBuyable(shoe) {
  if (!FEED_OK) return true;
  const f = feedFor(shoe);
  return Boolean(f && f.inStock > 0);
}

// What the shoe costs today, and what it cost before any discount.
export function priceOf(shoe) {
  const f = feedFor(shoe);
  const listed = (f && f.price) || Number(shoe && shoe.rrp_gbp) || 0;
  const sale = f && f.sale && f.sale < listed ? f.sale : null;
  return {
    now: sale || listed,
    was: sale ? listed : null,
    percentOff: sale ? Math.round((1 - sale / listed) * 100) : 0,
    sizesInStock: f ? f.inStock : null,
    sizesTotal: f ? f.sizes : null,
    live: Boolean(f),
  };
}

// True when the discount is worth telling someone about. A headline percentage
// on a shoe that exists in one size is a worse experience than silence, because
// most readers click, hunt for their size and leave.
const MIN_SIZES_TO_PROMOTE = 6;
export function isPromotableDeal(shoe) {
  const p = priceOf(shoe);
  return p.percentOff >= 15 && (p.sizesInStock || 0) >= MIN_SIZES_TO_PROMOTE;
}

// What a shopper would actually hand over today, used for budget matching.
//
// A discount only counts if enough sizes carry it. Half price on the one size
// left is not a price anyone can pay, and treating it as the shoe's cost would
// push clearance stock onto results pages it has no business being on. The same
// bar as isPromotableDeal, for the same reason: what the site says about a price
// and what it does with that price should agree.
export function budgetPrice(shoe) {
  const p = priceOf(shoe);
  const broad = p.was && (p.sizesInStock || 0) >= MIN_SIZES_TO_PROMOTE;
  return (broad ? p.now : p.was || p.now) || Number((shoe && shoe.rrp_gbp) || 0);
}

// The women's listing of the same shoe, where the retailer has one.
export function retailerUrlFor(shoe, gender) {
  const f = feedFor(shoe);
  if (gender === 'women' && f && f.womens) {
    return shoe.retailer_url.replace(/\/product\/[^/?]+/, `/product/${f.womens}`);
  }
  return shoe.retailer_url;
}
