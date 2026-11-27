import { NextResponse } from 'next/server';
import { getShoes, buyUrl } from '../../../lib/shoes';
import { REF_COOKIE } from '../../../lib/ref.js';

// Short, because a stale affiliate link is worse than an extra sheet read.
export const revalidate = 300;

// A tracked click should never be cached, indexed, or fired by a crawler
// warming links, because all three inflate click counts and look like fraud.
const HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer-when-downgrade',
};

function referrerHost(value) {
  if (!value) return null;
  try {
    return new URL(value).host;
  } catch {
    return 'unparseable';
  }
}

export async function GET(request, { params }) {
  const { id } = await params;
  const { shoes } = await getShoes();
  const shoe = shoes.find(s => s.id === id);
  // The quiz passes the answer through as ?g=, so a woman is sent to the
  // women's listing of the shoe rather than the men's one. Anything other than
  // an explicit "women" falls through to the default listing.
  const gender = new URL(request.url).searchParams.get('g') === 'women' ? 'women' : 'men';
  // Set by the middleware when the visitor arrived through an influencer link.
  // It is httpOnly, so it is read here and nowhere in the browser, which keeps
  // it out of the page HTML along with the affiliate URL itself.
  const ref = request.cookies.get(REF_COOKIE)?.value || '';
  const url = shoe ? buyUrl(shoe, gender, ref) : '';
  const target = url || new URL('/', request.url);

  // What is actually arriving here, printed and nothing else. Partnerize
  // counted 3,478 clicks in the 30 days to 26 Nov 2026 against 392 page views
  // on pages carrying at most six buy links each, so most of these requests
  // are not people pressing a button. This says which.
  //
  // A real click from one of our own pages arrives with Sec-Fetch-Mode set to
  // navigate and Sec-Fetch-Site same-origin, and with our own host as the
  // referrer. Every current browser sends those three and no plain HTTP client
  // sends any of them. Nothing is blocked on the strength of it: the point is
  // to find out before changing behaviour, and a crawler is cheaper to live
  // with than a buyer turned away by a guess.
  //
  // Runtime logs keep an hour on this plan, so the lasting count is the
  // buy_click event the browser sends from components/BuyLink.jsx. This is for
  // looking at a live sample.
  const h = request.headers;
  const looksLikeABrowser =
    h.get('sec-fetch-mode') === 'navigate' &&
    ['same-origin', 'same-site', 'none'].includes(h.get('sec-fetch-site') || '');
  console.log(
    JSON.stringify({
      at: 'go',
      shoe: id,
      found: Boolean(shoe),
      browserish: looksLikeABrowser,
      fetchMode: h.get('sec-fetch-mode') || null,
      fetchSite: h.get('sec-fetch-site') || null,
      fetchDest: h.get('sec-fetch-dest') || null,
      // Host only. The full referring URL is not needed to tell a crawler from
      // a click, and the less of a visitor's path that lands in a log the
      // better.
      from: referrerHost(h.get('referer')),
      ua: (h.get('user-agent') || '').slice(0, 180),
      // Whether an influencer link brought them, not which one.
      referred: Boolean(ref),
    })
  );

  return NextResponse.redirect(target, { status: 302, headers: HEADERS });
}
