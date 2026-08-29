import fallbackCsv, { FALLBACK_ROWS } from '../data/fallback.js';

// Ed's Google Sheet, exported as CSV. Requires the sheet to be set to
// "Anyone with the link can view". No gid, so it always exports the first tab.
// An env var overrides it if the sheet ever moves.
const DEFAULT_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1R9-ztEhQpq8MRl5VPdtn5YcQyqqoMBUrpc4yvFLDT2w/export?format=csv';
const SHEET_URL = process.env.SHEET_CSV_URL || DEFAULT_SHEET_URL;

// Minimal RFC4180-ish CSV parser (handles quoted fields and embedded commas/newlines)
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

const truthy = v => ['yes', 'true', 'y', '1'].includes(String(v).trim().toLowerCase());
const list = v => String(v || '').split(/[;|,]/).map(s => s.trim().toLowerCase().replace(/\s+/g, '_')).filter(Boolean);
const num = v => { const n = parseFloat(String(v).replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n; };
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function rowsToShoes(rows) {
  if (!rows.length) return [];
  const head = rows[0].map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  return rows.slice(1).map(r => {
    const o = {};
    head.forEach((h, i) => { o[h] = r[i] ?? ''; });
    if (!o.brand || !o.model) return null;
    return {
      id: slug(`${o.brand} ${o.model}`),
      brand: o.brand.trim(),
      model: o.model.trim(),
      category: (o.category || 'daily_trainer').trim().toLowerCase(),
      stability: (o.stability || 'neutral').trim().toLowerCase(),
      cushioning: (o.cushioning || 'balanced').trim().toLowerCase(),
      stack_heel_mm: num(o.stack_heel_mm),
      drop_mm: num(o.drop_mm),
      weight_g: num(o.weight_g),
      widths: list(o.widths).length ? list(o.widths) : ['standard'],
      toebox: (o.toebox || 'medium').trim().toLowerCase(),
      plate: (o.plate || 'none').trim().toLowerCase(),
      best_for: list(o.best_for),
      heavier_runner_ok: truthy(o.heavier_runner_ok),
      beginner_friendly: truthy(o.beginner_friendly),
      durability: (o.durability || 'medium').trim().toLowerCase(),
      rrp_gbp: num(o.rrp_gbp),
      retailer: (o.retailer || 'SportsShoes').trim(),
      retailer_url: (o.retailer_url || '').trim(),
      affiliate_url: (o.affiliate_url || '').trim(),
      awin_mid: String(o.awin_mid || '').replace(/[^0-9]/g, ''),
      wg_programid: String(o.wg_programid || '').replace(/[^0-9]/g, ''),
      partnerize_camref: String(o.partnerize_camref || '').trim().replace(/[^A-Za-z0-9]/g, ''),
      discount_code: String(o.discount_code || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, ''),
      discount_percent: num(o.discount_percent),
      image_url: (o.image_url || '').trim(),
      review_url: (o.review_url || '').trim(),
      one_liner: (o.one_liner || '').trim(),
      status: (o.status || 'current').trim().toLowerCase(),
      // Groups a shoe with its own earlier or later versions, so the quiz never
      // offers someone the Guide 18 and the Guide 19 as two separate choices.
      family: (o.family || '').trim().toLowerCase(),
    };
  }).filter(Boolean).filter(s => s.status !== 'hidden' && s.status !== 'superseded');
}

export async function getShoes() {
  if (SHEET_URL) {
    try {
      // Five minutes, so an edit to the sheet shows up on the site quickly. Google
      // is only hit once per window per region, so this is cheap.
      const res = await fetch(SHEET_URL, { next: { revalidate: 300 } });
      if (res.ok) {
        const text = await res.text();
        // A private sheet returns an HTML sign in page with a 200, so check the shape.
        if (!/^\s*</.test(text)) {
          const shoes = rowsToShoes(parseCsv(text));
          if (shoes.length > 5) return { shoes, source: 'sheet' };
        }
      }
    } catch (e) {
      // fall through to bundled data
    }
  }
  const shoes = rowsToShoes(parseCsv(fallbackCsv));
  // If this ever comes back short, the bundled copy was damaged rather than the
  // sheet being down. Surfaced through /status rather than failing quietly.
  const source = shoes.length === FALLBACK_ROWS ? 'bundled' : 'bundled-incomplete';
  return { shoes, source };
}

// --- Affiliate links -------------------------------------------------------
// Network IDs live in the sheet, one per row, so programmes can be switched on
// and off without a redeploy. Leave the cells empty and that shoe keeps a plain
// link, which is what you want for a programme you are not approved for yet.
//
//   awin_mid          Awin advertiser ID for the retailer in retailer_url
//   wg_programid      Webgains programme ID for the retailer in retailer_url
//   partnerize_camref Partnerize campaign reference for the retailer, e.g. 1101lAbCd
//   discount_code     a Shopify discount code, applied automatically on click
//   discount_percent  what that code takes off, used for the on screen message
//   affiliate_url     a ready made tracking link that overrides all of them

const AWIN_PUBLISHER_ID = process.env.AWIN_PUBLISHER_ID || '3044749';

// Webgains calls the publisher side the campaign, or site, ID. It is one number
// for the whole account, so it sits in an env var rather than in the sheet.
const WEBGAINS_CAMPAIGN_ID = process.env.WEBGAINS_CAMPAIGN_ID || '';

// Awin truncates click references at 50 characters and prefers lowercase.
// Webgains allows 255, so the tighter limit is safe for both.
const clickref = id => String(id).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 50);

export function awinLink(destinationUrl, advertiserId, ref) {
  if (!AWIN_PUBLISHER_ID || !advertiserId || !destinationUrl) return '';
  const params = [
    `awinmid=${advertiserId}`,
    `awinaffid=${AWIN_PUBLISHER_ID}`,
    `clickref=${clickref(ref)}`,
    `ued=${encodeURIComponent(destinationUrl)}`,
  ];
  return `https://www.awin1.com/cread.php?${params.join('&')}`;
}

export function webgainsLink(destinationUrl, programId, ref) {
  if (!WEBGAINS_CAMPAIGN_ID || !programId || !destinationUrl) return '';
  const params = [
    `wgcampaignid=${WEBGAINS_CAMPAIGN_ID}`,
    `wgprogramid=${programId}`,
    `clickref=${clickref(ref)}`,
    `wgtarget=${encodeURIComponent(destinationUrl)}`,
  ];
  return `https://track.webgains.com/click.html?${params.join('&')}`;
}

// Shopify applies a discount code from the URL and then sends the shopper on to
// wherever `redirect` points, so the code lands without anyone typing it. This
// is how the Run North West partnership is tracked, since there is no network
// in the middle: every order carrying the code is ours.
// Partnerize builds its links from colon separated pairs in the path rather
// than a query string, and the destination always comes last. The host is a
// variable because advertisers often get their own prf.hn subdomain.
const PARTNERIZE_HOST = process.env.PARTNERIZE_HOST || 'prf.hn';

// Partnerize allows more punctuation than Awin, but a colon would collide with
// its own separator. Their reporting caps this well above what we send.
const pubref = id => String(id).replace(/[^A-Za-z0-9._-]/g, '-').slice(0, 100);

export function partnerizeLink(destinationUrl, camref, ref) {
  if (!camref || !destinationUrl) return '';
  const parts = [`camref:${camref}`];
  const r = pubref(ref);
  if (r) parts.push(`pubref:${r}`);
  parts.push(`destination:${encodeURIComponent(destinationUrl)}`);
  return `https://${PARTNERIZE_HOST}/click/${parts.join('/')}`;
}

export function shopifyDiscountLink(destinationUrl, code) {
  if (!code || !destinationUrl) return '';
  let u;
  try { u = new URL(destinationUrl); } catch { return ''; }
  const target = `${u.pathname}${u.search}`;
  return `${u.origin}/discount/${code}?redirect=${encodeURIComponent(target)}`;
}

export function buyUrl(shoe) {
  // 1. An explicit affiliate_url in the sheet always wins, for anything the
  //    builders below cannot express.
  if (shoe.affiliate_url) return shoe.affiliate_url;

  // 2. Awin, if the sheet gives an advertiser ID for this row.
  const awin = awinLink(shoe.retailer_url, shoe.awin_mid, shoe.id);
  if (awin) return awin;

  // 3. Webgains, if the sheet gives a programme ID for this row.
  const wg = webgainsLink(shoe.retailer_url, shoe.wg_programid, shoe.id);
  if (wg) return wg;

  // 4. Partnerize, if the sheet gives a campaign reference for this row.
  const pz = partnerizeLink(shoe.retailer_url, shoe.partnerize_camref, shoe.id);
  if (pz) return pz;

  // 5. A Shopify discount code, if the sheet gives one for this row.
  const disc = shopifyDiscountLink(shoe.retailer_url, shoe.discount_code);
  if (disc) return disc;

  // 6. Fall back to the plain retailer link.
  return shoe.retailer_url || '';
}
