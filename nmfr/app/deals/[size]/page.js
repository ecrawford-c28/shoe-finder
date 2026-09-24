import { notFound } from 'next/navigation';
import { getShoes } from '../../../lib/shoes';
import {
  SCALES,
  allDealSlugs,
  dealSlug,
  dealsForSize,
  parseDealSlug,
  GENERATED,
  MIN_PERCENT_OFF,
} from '../../../lib/deals';

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

export default async function DealsForSize({ params }) {
  const parsed = parseDealSlug(params.size);
  if (!parsed) notFound();
  const { gender, size } = parsed;
  const { shoes } = await getShoes();
  const { groups, count, best, cheapest } = dealsForSize(shoes, gender, size);

  const who = gender === 'women' ? "women's" : "men's";
  const checked = GENERATED ? new Date(GENERATED) : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: `Running shoe deals in ${who} UK ${size}`,
        numberOfItems: count,
        itemListElement: groups
          .flatMap(g => g.deals)
          .slice(0, 30)
          .map((d, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: `${d.shoe.brand} ${d.shoe.model}`,
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
          <p>
            {count === 1 ? 'One shoe' : `${count} shoes`} from the Shoe Finder database{' '}
            {count === 1 ? 'is' : 'are'} discounted today and in stock in{' '}
            {who} UK {size}. Biggest saving is {best.percentOff}% off the{' '}
            {best.shoe.brand} {best.shoe.model}, and the cheapest thing here is {money(cheapest)}.
            Anything under {MIN_PERCENT_OFF}% off is left out, because a couple of pounds is not a
            deal.
          </p>
        ) : (
          <p>
            Nothing in {who} UK {size} is discounted today. That is not a bug, it is just how the
            stock has fallen. Try a neighbouring size below, or{' '}
            <a href="/">take the quiz</a> and get shoes picked for your feet rather than for the
            price tag.
          </p>
        )}

        <p className="guide-specs">
          Prices come straight from the retailer&apos;s feed and are checked once a day
          {checked ? `, last on ${checked.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} at ${checked.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC` : ''}.
          A deal can sell out before we notice.
        </p>

        <div className="disclosure" style={{ margin: '22px 0' }}>
          <b>Ad.</b> We earn a commission if you buy through the links below. It does not change
          what you pay, and it plays no part in which shoes are listed or how they are ordered.
        </div>

        {groups.map(group => (
          <section key={group.category}>
            <h2 id={group.category}>
              {group.label} <span className="dealcount">{group.deals.length}</span>
            </h2>
            <ol className="guide-list">
              {group.deals.map(d => (
                <li key={d.shoe.id}>
                  {d.shoe.image_url ? (
                    <img
                      className="g-img"
                      src={d.shoe.image_url}
                      alt={`${d.shoe.brand} ${d.shoe.model}`}
                      loading="lazy"
                    />
                  ) : null}
                  <h3>
                    {d.shoe.brand} {d.shoe.model}
                  </h3>
                  <p className="price">
                    {money(d.now)} <s>{money(d.was)}</s>{' '}
                    <span className="off">{d.percentOff}% off</span>{' '}
                    <span className="rrp-note">save {money(d.saving)}</span>
                  </p>
                  <p className="guide-specs">
                    {d.shoe.weight_g}g · {d.shoe.drop_mm}mm drop
                    {d.shoe.stack_heel_mm ? ` · ${d.shoe.stack_heel_mm}mm stack` : ''}
                    {d.shoe.widths.includes('extra_wide')
                      ? ' · 4E available'
                      : d.shoe.widths.includes('wide')
                        ? ' · wide fitting'
                        : ''}
                    {d.shoe.plate !== 'none' ? ` · ${d.shoe.plate} plate` : ''}
                    {d.sizesLeft <= 3 ? ` · only ${d.sizesLeft} sizes left` : ''}
                  </p>
                  {d.shoe.status === 'outgoing' ? (
                    <p className="outgoing">Last year&apos;s model, which is why it is cheap.</p>
                  ) : null}
                  {d.shoe.one_liner && <p>{d.shoe.one_liner}</p>}
                  <p className="dealbuy">
                    <a
                      className="btn small"
                      href={`/go/${d.shoe.id}${gender === 'women' ? '?g=women' : ''}`}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                    >
                      Buy at {d.shoe.retailer || 'SportsShoes'}
                    </a>
                    {d.shoe.review_url ? (
                      <a
                        className="review-link"
                        href={d.shoe.review_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lab review
                      </a>
                    ) : null}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ))}

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
