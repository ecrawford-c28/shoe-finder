import { getShoes } from '../../lib/shoes';
import { dealCounts, dealsForSize, GENERATED, MIN_PERCENT_OFF } from '../../lib/deals';

export const revalidate = 300;

export const metadata = {
  title: 'Running shoe deals by size',
  description:
    'Discounted running shoes that are actually in stock in your size. Pick your size and see what is reduced today, checked daily against the retailer feed.',
  alternates: { canonical: '/deals' },
  openGraph: {
    title: 'Running shoe deals by size',
    description:
      'Discounted running shoes that are actually in stock in your size, checked daily.',
    url: '/deals',
    type: 'website',
  },
};

function money(n) {
  return `£${Number(n).toFixed(2).replace('.00', '')}`;
}

function SizeGrid({ rows, heading }) {
  return (
    <>
      <h2>{heading}</h2>
      <div className="sizegrid">
        {rows.map(r => (
          <a
            key={r.slug}
            href={`/deals/${r.slug}`}
            className={r.count ? 'sizetile' : 'sizetile empty'}
          >
            <b>{r.size}</b>
            <span>{r.count ? `${r.count} deal${r.count === 1 ? '' : 's'}` : 'nothing today'}</span>
            {r.count ? <em>up to {r.deepest}% off</em> : null}
          </a>
        ))}
      </div>
    </>
  );
}

export default async function Deals() {
  const { shoes } = await getShoes();
  const counts = dealCounts(shoes);
  const checked = GENERATED ? new Date(GENERATED) : null;

  // The best thing on the site today, but only from a size with enough behind
  // it to be worth landing on. The single deepest discount is usually sitting
  // in a size with two shoes in it, and sending the top of the page there is a
  // worse experience than a slightly smaller number that opens a real list.
  const WORTH_LANDING_ON = 5;
  let headline = null;
  for (const gender of ['men', 'women']) {
    for (const row of counts[gender]) {
      if (row.count < WORTH_LANDING_ON) continue;
      const { best } = dealsForSize(shoes, gender, row.size);
      if (best && (!headline || best.percentOff > headline.best.percentOff)) {
        headline = { gender, size: row.size, slug: row.slug, best, count: row.count };
      }
    }
  }

  const total = ['men', 'women'].reduce(
    (n, g) => n + counts[g].reduce((m, r) => Math.max(m, r.count), 0),
    0
  );

  return (
    <main className="prose guide">
      <div className="guide-main">
        <h1>Running shoe deals, by size</h1>
        <p>
          The quiz asks eleven questions and picks shoes that suit you. This does the opposite and
          asks one: what size are you? Then it shows what is discounted today and actually in stock
          in that size, which is the bit most deal pages skip.
        </p>
        <p className="guide-specs">
          Checked once a day against the retailer&apos;s live feed
          {checked
            ? `, last on ${checked.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} at ${checked.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC`
            : ''}
          . Anything under {MIN_PERCENT_OFF}% off is left out.
        </p>

        {headline ? (
          <p className="headlinedeal">
            Biggest saving right now: <b>{headline.best.shoe.brand} {headline.best.shoe.model}</b>{' '}
            at {money(headline.best.now)}, down from {money(headline.best.was)}.{' '}
            <a href={`/deals/${headline.slug}`}>
              {headline.best.percentOff}% off in {headline.gender === 'women' ? "women's" : "men's"}{' '}
              UK {headline.size}
            </a>
            , one of {headline.count} in that size.
          </p>
        ) : null}

        <SizeGrid rows={counts.men} heading="Men's sizes" />
        <SizeGrid rows={counts.women} heading="Women's sizes" />

        <h2>What is on these pages</h2>
        <p>
          The same {shoes.length} shoes the quiz draws on, no wider. Every one has measured specs,
          a note on what it is actually good for, and a link to the lab review where there is one.
          Nothing gets listed because it is cheap alone, and nothing is ordered by what pays us
          most.
        </p>
        <p>
          Deals are grouped by what the shoe is for, then ranked by how deep the discount is inside
          each group. That is deliberate. The biggest number on the page is no use if it is a
          carbon racer and you need a stability shoe.
        </p>

        <h2>The catch, said plainly</h2>
        <p>
          Prices move faster than a daily refresh. A deal can be gone before the page updates, and
          a size can sell out between our check and your click. If the price at the retailer does
          not match what is here, theirs is the real one.
        </p>
        <p>
          And cheap is not the same as right. If you do not already know what you want,{' '}
          <a href="/">the quiz</a> is the better door.
        </p>
      </div>
    </main>
  );
}
