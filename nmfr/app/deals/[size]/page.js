import { notFound } from 'next/navigation';
import { getShoes } from '../../../lib/shoes';
import {
  SCALES,
  allDealSlugs,
  dealSlug,
  dealsForSize,
  parseDealSlug,
  CATEGORY_LABEL,
  GENERATED,
  MIN_PERCENT_OFF,
  SHOW_TOP,
} from '../../../lib/deals';
import DealBoard from './DealBoard';

export const revalidate = 300;

// A page per size per gender. The feed refresh runs once a day, so these are
// rebuilt on the same clock as everything else rather than on request.
export function generateStaticParams() {
  return allDealSlugs().map(size => ({ size }));
}

// Below this a page is too thin to offer Google, but it is still worth serving
// to somebody who lands on it, so it renders and says plainly that there is
// nothing today rather than 404ing on a real size.
const THIN = 5;

function label(gender, size) {
  return `${gender === 'women' ? "Women's" : "Men's"} UK ${size}`;
}

export async function generateMetadata({ params }) {
  const parsed = parseDealSlug(params.size);
  if (!parsed) return {};
  const { gender, size } = parsed;
  const { shoes } = await getShoes();
  const { count, deepest } = dealsForSize(shoes, gender, size);
  const who = gender === 'women' ? "women's" : "men's";
  const title = `Running shoe deals in ${who} UK ${size}`;
  const description = count
    ? `${count} running shoes discounted today in ${who} UK ${size}, up to ${deepest}% off. Every one is in stock in your size, checked daily.`
    : `Nothing is discounted in ${who} UK ${size} today. Checked daily against live stock.`;
  return {
    title,
    description,
    alternates: { canonical: `/deals/${params.size}` },
    robots: count < THIN ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url: `/deals/${params.size}`, type: 'website' },
  };
}

function money(n) {
  return `£${Number(n).toFixed(2).replace('.00', '')}`;
}

function widthNote(widths) {
  if (widths.includes('extra_wide')) return '4E available';
  if (widths.includes('wide')) return 'wide fitting';
  return '';
}

export default async function DealsForSize({ params }) {
  const parsed = parseDealSlug(params.size);
  if (!parsed) notFound();
  const { gender, size } = parsed;
  const { shoes } = await getShoes();
  const { groups, count, best, cheapest } = dealsForSize(shoes, gender, size);

  const who = gender === 'women' ? "women's" : "men's";
  const checked = GENERATED ? new Date(GENERATED) : null;
  const g = gender === 'women' ? '?g=women' : '';

  // One flat list, deepest discount first, because that is the order the page
  // reads in now. Grouping moved into the filter: it was organising a wall of
  // shoes rather than shortening it.
  const flat = groups
    .flatMap(gr => gr.deals)
    .sort((a, b) => b.percentOff - a.percentOff || a.now - b.now);

  // Only the fields the rows draw, so the shoe database does not ride along
  // into the browser a second time.
  const deals = flat.map(d => ({
    id: d.shoe.id,
    brand: d.shoe.brand,
    model: d.shoe.model,
    category: d.shoe.category,
    typeLabel: CATEGORY_LABEL[d.shoe.category] || d.shoe.category,
    now: d.now,
    was: d.was,
    saving: d.saving,
    percentOff: d.percentOff,
    sizesLeft: d.sizesLeft,
    weight: d.shoe.weight_g || 0,
    drop: d.shoe.drop_mm || 0,
    width: widthNote(d.shoe.widths || []),
    outgoing: d.shoe.status === 'outgoing',
    oneLiner: d.shoe.one_liner || '',
    retailer: d.shoe.retailer || 'SportsShoes',
    reviewUrl: d.shoe.review_url || '',
    image: d.shoe.image_url || '',
    href: `/go/${d.shoe.id}${g}`,
  }));

  // Chips, in the order the shoe types matter rather than alphabetically, and
  // only the ones that have something behind them today.
  const types = groups.map(gr => ({
    key: gr.category,
    label: gr.label,
    count: gr.deals.length,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: `Running shoe deals in ${who} UK ${size}`,
        numberOfItems: count,
        itemListElement: deals.slice(0, 30).map((d, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${d.brand} ${d.model}`,
          url: `https://shoefinder.co.uk/deals/${params.size}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Shoe Finder', item: 'https://shoefinder.co.uk' },
          { '@type': 'ListItem', position: 2, name: 'Deals', item: 'https://shoefinder.co.uk/deals' },
          { '@type': 'ListItem', position: 3, name: label(gender, size) },
        ],
      },
    ],
  };

  return (
    <main className="prose guide">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="guide-main">
        <p className="meta" style={{ marginBottom: 8 }}>
          <a href="/deals">Deals</a>
        </p>
        <h1>Running shoe deals in {who} UK {size}</h1>

        {count ? (
          <>
            {/* The headline number, before anything else on the page. Somebody
                who came here for a bargain should know the size of the best one
                without scrolling. */}
            <p className="dealhero">
              Best today: <b>{best.percentOff}% off</b> the {best.shoe.brand}{' '}
              {best.shoe.model}, down to {money(best.now)} from {money(best.was)}.
            </p>
            <p className="guide-specs">
              {count === 1 ? 'One shoe' : `${count} shoes`} discounted and in stock in {who} UK{' '}
              {size}, cheapest at {money(cheapest)}. Anything under {MIN_PERCENT_OFF}% off is left
              out, because a couple of pounds is not a deal.
              {checked
                ? ` Prices come from the retailer's feed, last checked ${checked.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} at ${checked.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC.`
                : ''}
            </p>
          </>
        ) : (
          <p>
            Nothing in {who} UK {size} is discounted today. That is not a bug, it is just how the
            stock has fallen. Try a neighbouring size below, or{' '}
            <a href="/">take the quiz</a> and get shoes picked for your feet rather than for the
            price tag.
          </p>
        )}

        <div className="disclosure" style={{ margin: '20px 0' }}>
          <b>Ad.</b> We earn a commission if you buy through the links below. It does not change
          what you pay, and it plays no part in which shoes are listed or how they are ordered.
        </div>

        {count ? <DealBoard deals={deals} types={types} showTop={SHOW_TOP} /> : null}

        <h2>Another size</h2>
        <p className="sizelinks">
          {SCALES[gender].map(s => (
            <a
              key={s}
              href={`/deals/${dealSlug(gender, s)}`}
              className={s === size ? 'sizelink here' : 'sizelink'}
            >
              {s}
            </a>
          ))}
        </p>
        <p className="guide-specs">
          <a href={`/deals/${dealSlug(gender === 'women' ? 'men' : 'women', gender === 'women' ? '9' : '5')}`}>
            {gender === 'women' ? "Men's sizes" : "Women's sizes"}
          </a>
        </p>

        <h2>Cheapest is not the same as right</h2>
        <p>
          Everything on this page is discounted and in your size. None of it has been checked
          against how you run. A shoe can be half price and still the wrong shoe, which is what
          the <a href="/">quiz</a> is for: it asks about your weight, your feet, whether your
          ankles roll in and what hurts after a long run, then picks three shoes that fit the
          answers. Come here when you already know what you want and you are waiting for the price
          to drop.
        </p>
      </div>
    </main>
  );
}
