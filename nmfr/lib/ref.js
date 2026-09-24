// Influencer attribution, the parts both the middleware and the /go redirect
// need. Kept in its own file rather than exported from middleware.js, because
// middleware runs in the edge runtime and importing it from a route handler
// drags that whole module somewhere it does not belong.

export const REF_COOKIE = 'sf_ref';

// Thirty days, matched to the retailer's own affiliate window. Longer would
// mean promising an influencer credit for sales we were never paid for, which
// is a worse problem than losing the odd late conversion.
export const REF_MAX_AGE = 30 * 24 * 60 * 60;

// Kept deliberately tight. This string ends up inside a URL we hand to a third
// party, so nothing that could need escaping is allowed through, and anything
// longer than this is somebody testing us rather than an influencer handle.
// No allowlist, on purpose: handing out a new link should not need a deploy.
export function cleanRef(raw) {
  return String(raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    // A run of underscores is collapsed because "__" is the separator we use
    // between the influencer and the shoe id downstream. A handle carrying its
    // own double underscore would make that string ambiguous to split.
    .replace(/_+/g, '_')
    .replace(/^[_-]+|[_-]+$/g, '')
    .slice(0, 32);
}
