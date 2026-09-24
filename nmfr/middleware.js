import { NextResponse } from 'next/server';
import { REF_COOKIE, REF_MAX_AGE, cleanRef } from './lib/ref.js';

// Influencer attribution.
//
// Somebody shares shoefinder.co.uk/?ref=sarah. We catch the parameter here,
// remember it in a first party cookie, then send the visitor on to the clean
// URL. From that point the quiz journey is untouched, and when they eventually
// hit /go/[id] the redirect stamps "sarah" into the retailer's tracking
// reference alongside the shoe id, so Partnerize reports the sale against both.
//
// Doing it in middleware rather than on the page matters: the pages are cached
// by ISR, so nothing that runs during rendering can be trusted to see a given
// visitor's query string. Middleware runs on every request regardless.
//
// Stripping the parameter afterwards is not tidiness. It keeps ?ref= out of
// anything the visitor copies and shares onward, which would otherwise credit
// the wrong person, and it stops search engines finding a second URL for every
// page on the site.
export function middleware(request) {
  const url = new URL(request.url);
  const ref = cleanRef(url.searchParams.get('ref'));

  // Removed whether or not it survived cleaning, otherwise a junk value sits in
  // the address bar forever and gets passed on.
  url.searchParams.delete('ref');
  const response = NextResponse.redirect(url, 302);

  if (ref) {
    // Last click wins. If someone arrived through Sarah last week and through
    // Tom today, Tom gets it, because that is the rule the retailer pays us on
    // and the only one that survives an argument.
    //
    // httpOnly because only the server reads it. sameSite lax because the
    // visitor is arriving from Instagram, and strict would drop the cookie on
    // exactly the navigation we are trying to track.
    response.cookies.set(REF_COOKIE, ref, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: REF_MAX_AGE,
    });
  }

  // Never cache the redirect: it carries a Set-Cookie belonging to one visitor.
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}

// Only requests that actually carry ?ref= reach the function above, so a normal
// visit costs nothing at all. /go is excluded because redirecting there would
// throw the click away, and /api and the static assets have no business being
// touched.
export const config = {
  matcher: [
    {
      source: '/((?!go/|api/|_next/|.*\\.[^/]+$).*)',
      has: [{ type: 'query', key: 'ref' }],
    },
  ],
};
