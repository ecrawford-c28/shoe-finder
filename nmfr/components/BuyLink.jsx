'use client';

// Every buy link on the site, so there is exactly one place that knows what a
// real click looks like.
//
// Why this exists: Partnerize counted 3,478 clicks in the 30 days to 26 Nov
// 2026 while GA4 counted 303 sessions and 392 page views. That is 8.9 clicks
// per page looked at, on pages carrying at most six buy links, so most of
// those clicks are not people. They could be crawlers ignoring robots.txt and
// the noindex header on /go/, or one genuine tap being counted more than once
// somewhere in the redirect. The two look identical in Partnerize's figures.
//
// This counts the clicks that happen in a browser, in response to a person
// pressing something. Comparing that number with Partnerize's gives the size
// of the gap, and the shape of it says which of the two explanations it is: a
// gap that scales with traffic is double counting, a gap that does not is
// crawlers.
//
// Deliberately not a filter. Nothing is blocked and no link changes, because
// turning away a real buyer to fix a problem we have not diagnosed is the
// worse mistake.
//
// The event is best effort. An ad blocker stops GA4 loading and the click
// still has to work, so every failure path here ends in the browser following
// the link as normal.
export default function BuyLink({ shoe, href, where, className, children }) {
  function count() {
    try {
      if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
      window.gtag('event', 'buy_click', {
        // Which page the click came from, since the deals pages carry 65 links
        // and the quiz carries six. If the inflation is crawler driven it will
        // sit on whichever page has the most links.
        placement: where,
        shoe_id: shoe || '',
        // Set by the quiz when it sends somebody to the women's listing.
        womens: /[?&]g=women\b/.test(href) ? 'yes' : 'no',
      });
    } catch {
      // Never let measurement stop a sale.
    }
  }

  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener"
      onClick={count}
      // A middle click or a long press opens the link without firing onClick in
      // some browsers, so the same counter runs on auxclick.
      onAuxClick={count}
    >
      {children}
    </a>
  );
}
