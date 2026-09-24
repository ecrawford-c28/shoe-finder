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
  return NextResponse.redirect(target, { status: 302, headers: HEADERS });
}
