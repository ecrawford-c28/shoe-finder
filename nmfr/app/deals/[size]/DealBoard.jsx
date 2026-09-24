'use client';

import { useState } from 'react';

// The deals list, as the same cards the quiz results use, with a shoe type
// filter above them.
//
// Client side on purpose. Tapping "Trail" should swap the five shoes instantly,
// not cost a page load, and the filtered views are not worth having as separate
// URLs: thirty nine sizes times six types is a couple of hundred pages that
// would each hold three shoes and say almost nothing.
//
// It receives deals already worked out on the server and already slimmed to the
// fields drawn below. lib/deals.js and data/sizes.js stay where they are, so
// none of the size data reaches the browser.

function money(n) {
  return `£${Number(n).toFixed(2).replace('.00', '')}`;
}

function DealCard({ deal, top }) {
  return (
    <div className={top ? 'card top' : 'card'}>
      {/* The quiz puts the pick number here. On a deals page the saving is the
          reason anyone is reading, so it takes the same slot. */}
      <div className="rank">{deal.percentOff}% off</div>
      <div className="card-body">
        {deal.image ? (
          <img className="shoe-img deal-img" src={deal.image} alt={`${deal.brand} ${deal.model}`} loading="lazy" />
        ) : null}
        <div className="brand">{deal.brand}</div>
        <h3>{deal.model}</h3>
        <div className="price">
          {money(deal.now)} <s>{money(deal.was)}</s>{' '}
          <span className="rrp-note">save {money(deal.saving)}</span>
        </div>
        {deal.sizesLeft <= 3 ? (
          <p className="stocklow">
            Only {deal.sizesLeft} {deal.sizesLeft === 1 ? 'size' : 'sizes'} left at{' '}
            {deal.retailer}
          </p>
        ) : null}
        {deal.outgoing ? (
          <p className="outgoing">Last year&apos;s model, which is why it is cheap.</p>
        ) : null}
        {deal.oneLiner ? <p className="liner">{deal.oneLiner}</p> : null}
        <div className="specs">
          <span>{deal.typeLabel}</span>
          {deal.weight ? <span>{deal.weight}g</span> : null}
          {deal.drop ? <span>{deal.drop}mm drop</span> : null}
          {deal.width ? <span>{deal.width}</span> : null}
        </div>
        <a className="btn" href={deal.href} target="_blank" rel="nofollow sponsored noopener">
          Buy at {deal.retailer}
        </a>
        {deal.reviewUrl ? (
          <a
            className="review-link"
            href={deal.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Lab review
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function DealBoard({ deals, types, showTop }) {
  const [type, setType] = useState('all');

  const inScope = type === 'all' ? deals : deals.filter(d => d.category === type);
  const shown = inScope.slice(0, showTop);
  const hidden = inScope.length - shown.length;
  const label = types.find(t => t.key === type)?.label || '';
  const where = type === 'all' ? '' : ` in ${label.toLowerCase()}`;

  return (
    <>
      {types.length > 1 ? (
        <div className="dealfilter" role="group" aria-label="Filter by shoe type">
          <button
            type="button"
            className={type === 'all' ? 'dealchip on' : 'dealchip'}
            aria-pressed={type === 'all'}
            onClick={() => setType('all')}
          >
            Everything <i>{deals.length}</i>
          </button>
          {types.map(t => (
            <button
              key={t.key}
              type="button"
              className={type === t.key ? 'dealchip on' : 'dealchip'}
              aria-pressed={type === t.key}
              onClick={() => setType(t.key)}
            >
              {t.label} <i>{t.count}</i>
            </button>
          ))}
        </div>
      ) : null}

      <p className="dealscope" aria-live="polite">
        {inScope.length === 0
          ? `Nothing in ${label.toLowerCase()} is discounted in this size today.`
          : hidden > 0
            ? `The ${shown.length} biggest savings${where}, out of ${inScope.length}.`
            : `${inScope.length === 1 ? 'The one deal' : `All ${inScope.length}`}${where}, deepest first.`}
      </p>

      <div className="card-grid dealcards">
        {shown.map((d, i) => (
          <DealCard key={d.id} deal={d} top={i === 0} />
        ))}
      </div>

      {hidden > 0 ? (
        <p className="guide-specs">
          {hidden === 1 ? 'One more' : `${hidden} more`} discounted{' '}
          {hidden === 1 ? 'shoe' : 'shoes'} in this size did not make the top {showTop}. They are
          smaller savings on the same shoes, so the <a href="/">quiz</a> is a better way to find
          them than a longer list.
        </p>
      ) : null}
    </>
  );
}
