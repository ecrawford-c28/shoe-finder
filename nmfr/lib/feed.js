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
