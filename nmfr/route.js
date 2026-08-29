import { NextResponse } from 'next/server';
import { getShoes, buyUrl } from '../../../lib/shoes';

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
  const url = shoe ? buyUrl(shoe) : '';
  const target = url || new URL('/', request.url);
  return NextResponse.redirect(target, { status: 302, headers: HEADERS });
}
