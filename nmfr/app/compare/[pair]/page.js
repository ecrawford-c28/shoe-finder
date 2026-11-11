import { notFound } from 'next/navigation';
import { getShoes } from '../../../lib/shoes';
import { PAIRS, livePairSlugs, pairSlug, pairFromSlug, comparison, verdict, suits, faq } from '../../../lib/compare';
import { priceOf, FEED_GENERATED } from '../../../lib/feed.js';
import { ratingStats, shoeFinderScore, DEFAULT_QUESTION_COUNT } from '../../../lib/match.js';

export const revalidate = 300;

// Same list as the sitemap, so the two cannot disagree about which pairs exist.
export async function generateStaticParams() {
  const { shoes } = await getShoes();
  return livePairSlugs(shoes).map(pair => ({ pair }));
}

const nm = s => `${s.brand} ${s.model}`;
const money = n => `£${Number(n).toFixed(2).replace('.00', '')}`;

const CAT = {
  daily_trainer: 'Everyday trainer', max_cushion: 'Max cushion', stability: 'Support',
  tempo: 'Faster training', race: 'Race day', trail: 'Trail',
  training: 'Gym and training',
};
const STAB = { neutral: 'Neutral', mild_support: 'Light support', stability: 'Support' };
const widthLabel = s =>
  s.widths.includes('extra_wide') ? 'Standard, wide and 4E'
    : s.widths.includes('wide') ? 'Standard and wide'
    : 'Standard only';

export async function generateMetadata({ params }) {
  const { shoes } = await getShoes();
  const pair = pairFromSlug(params.pair, shoes);
  if (!pair) return {};
  const [a, b] = pair;
  const title = `${nm(a)} vs ${nm(b)}`;
  return {
    title: `${title}: which should you buy?`,
    description: `${title} compared on heel drop, weight, width fittings and price, using the same data behind the Shoe Finder quiz. In short, ${suits(a, b)}.`,
    alternates: { canonical: `/compare/${params.pair}` },
    openGraph: { title, url: `/compare/${params.pair}`, type: 'article' },
  };
}

export default async function Compare({ params }) {
  const { shoes } = await getShoes();
  const pair = pairFromSlug(params.pair, shoes);
  if (!pair) notFound();
  const [a, b] = pair;
  const points = comparison(a, b);

  const others = PAIRS.filter(([x, y]) => pairSlug(x, y) !== params.pair)
    .map(([x, y]) => ({ slug: pairSlug(x, y), a: shoes.find(s => s.id === x), b: shoes.find(s => s.id === y) }))
    .filter(o => o.a && o.b && (o.a.category === a.category || o.b.category === a.category))
    .slice(0, 6);

  const questions = faq(a, b);
  const prices = { [a.id]: priceOf(a), [b.id]: priceOf(b) };

  // Everything marked up here is on the page in words as well. The specs come
  // from the table, the answers from the questions section, the prices from the
  // buy blocks. A page that says one thing to a reader and another to a machine
  // is the kind of thing that gets a site distrusted by both.
  const product = s => ({
    '@type': 'Product',
    '@id': `https://shoefinder.co.uk/compare/${params.pair}#${s.id}`,
    name: nm(s),
    brand: { '@type': 'Brand', name: s.brand },
    category: CAT[s.category] || s.category,
    ...(s.image_url ? { image: s.image_url } : {}),
    ...(s.one_liner ? { description: s.one_liner } : {}),
    additionalProperty: [
      ['Heel drop', `${s.drop_mm}mm`],
      ...(s.stack_heel_mm ? [['Heel stack', `${s.stack_heel_mm}mm`]] : []),
      ['Weight', `${s.weight_g}g`],
      ['Support', STAB[s.stability] || s.stability],
      ['Widths', widthLabel(s)],
      ['Plate', s.plate === 'none' ? 'None' : s.plate],
    ].map(([n, v]) => ({ '@type': 'PropertyValue', name: n, value: v })),
    offers: {
      '@type': 'Offer',
      price: prices[s.id].now.toFixed(2),
      priceCurrency: 'GBP',
      availability: prices[s.id].sizesInStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: s.retailer_url,
      seller: { '@type': 'Organization', name: s.retailer || 'SportsShoes' },
    },
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://shoefinder.co.uk/compare/${params.pair}`,
        name: `${nm(a)} vs ${nm(b)}`,
        description: `${nm(a)} and ${nm(b)} compared on heel drop, weight, width fittings and price. In short, ${suits(a, b)}.`,
        ...(FEED_GENERATED ? { dateModified: FEED_GENERATED } : {}),
        isPartOf: { '@type': 'WebSite', name: 'Shoe Finder', url: 'https://shoefinder.co.uk' },
        publisher: {
          '@type': 'Organization',
          name: 'Not Made For Running',
          url: 'https://shoefinder.co.uk',
          sameAs: ['https://www.instagram.com/notmadeforrunning/'],
        },
        about: [{ '@id': `https://shoefinder.co.uk/compare/${params.pair}#${a.id}` },
                { '@id': `https://shoefinder.co.uk/compare/${params.pair}#${b.id}` }],
      },
      product(a),
      product(b),
      {
        '@type': 'FAQPage',
        mainEntity: questions.map(([q, ans]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: ans },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Shoe Finder', item: 'https://shoefinder.co.uk' },
          { '@type': 'ListItem', position: 2, name: 'Comparisons', item: 'https://shoefinder.co.uk/compare' },
          { '@type': 'ListItem', position: 3, name: `${nm(a)} vs ${nm(b)}` },
        ],
      },
    ],
  };

  const rows = [
    ['Price', money(a.rrp_gbp) + ' RRP', money(b.rrp_gbp) + ' RRP'],
    ['Type', CAT[a.category] || a.category, CAT[b.category] || b.category],
    ['Support', STAB[a.stability] || a.stability, STAB[b.stability] || b.stability],
    ['Weight', `${a.weight_g}g`, `${b.weight_g}g`],
    ['Heel drop', `${a.drop_mm}mm`, `${b.drop_mm}mm`],
    ['Widths', widthLabel(a), widthLabel(b)],
    ['Plate', a.plate === 'none' ? 'None' : a.plate, b.plate === 'none' ? 'None' : b.plate],
  ];
  if (a.stack_heel_mm && b.stack_heel_mm) {
    rows.splice(5, 0, ['Heel stack', `${a.stack_heel_mm}mm`, `${b.stack_heel_mm}mm`]);
  }
  // Only worth a row if there is a score for at least one of the two. A column
  // of dashes tells the reader nothing and makes the table look broken.
  const stats = ratingStats(shoes);
  const sa = shoeFinderScore(a, stats);
  const sb = shoeFinderScore(b, stats);
  const scoreCell = (v, s) =>
    v == null ? 'Not enough reviews yet' : `${v}/10 from ${s.rating_count.toLocaleString('en-GB')} reviews`;
  if (sa != null || sb != null) {
    rows.unshift(['Shoe Finder Score', scoreCell(sa, a), scoreCell(sb, b)]);
  }

  return (
    <main className="prose guide">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="guide-main">
        <p className="meta" style={{ marginBottom: 8 }}>
          <a href="/compare">Comparisons</a>
        </p>
        <h1>
          {nm(a)} vs {nm(b)}
        </h1>
        <p>
          Two shoes people weigh up against each other constantly. Here is what actually separates
          them, taken from the same database that drives the <a href="/">Shoe Finder quiz</a>, with
          nothing added by hand. The short version: {verdict(a, b)}
        </p>

        <div className="disclosure" style={{ margin: '22px 0' }}>
          <b>Ad.</b> We earn a commission if you buy through the links on this page. It does not
          change what you pay and it plays no part in what we say about either shoe.
        </div>

        <h2 id="specs">Side by side</h2>
        <div className="vs-wrap">
          <table className="vs">
            <thead>
              <tr>
                <th />
                <th>{nm(a)}</th>
                <th>{nm(b)}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, x, y]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{x}</td>
                  <td>{y}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="differences">What the differences mean</h2>
        {points.map(pt => (
          <div key={pt.h}>
            <h3>{pt.h}</h3>
            <p>{pt.p}</p>
          </div>
        ))}

        <h2 id="verdict">Which should you buy?</h2>
        <p>
          Neither, until you have tried both on. Fit decides more than any specification on this
          page, and the two shoes above are close enough that a foot shape will separate them faster
          than a spreadsheet will.
        </p>
        <p>
          <strong>If you want the short answer:</strong> {`${suits(a, b)}.`} That is what the data
          says, and it is still second to how they feel on your feet.
        </p>
        {[a, b].map(s => (
          <div key={s.id} className="vs-pick">
            <h3>{nm(s)}</h3>
            {s.one_liner && <p>{s.one_liner}</p>}
            <p className="meta">
              {prices[s.id].was
                ? `${money(prices[s.id].now)} today, down from ${money(prices[s.id].was)}`
                : `${money(prices[s.id].now)} today`}
              {prices[s.id].sizesInStock
                ? ` · ${prices[s.id].sizesInStock} size${prices[s.id].sizesInStock === 1 ? '' : 's'} in stock`
                : ' · out of stock'}
            </p>
            <p className="guide-links">
              <a href={`/go/${s.id}`} target="_blank" rel="nofollow sponsored noopener">
                Buy at {s.retailer || 'SportsShoes'}
              </a>
              {s.review_url ? (
                <>
                  {' · '}
                  <a href={s.review_url} target="_blank" rel="noopener noreferrer">
                    Lab review at RunRepeat
                  </a>
                </>
              ) : null}
            </p>
          </div>
        ))}

        <h2 id="faq">Common questions</h2>
        {questions.map(([q, ans]) => (
          <div key={q}>
            <h3>{q}</h3>
            <p>{ans}</p>
          </div>
        ))}

        <h2 id="quiz">Or let the quiz decide</h2>
        <p>
          This page compares two shoes. The <a href="/">shoe finder</a> compares all{' '}
          {shoes.length} of them against your width, your weight, where you run, your budget and any
          recurring niggles, then gives you three and tells you why each one made it. It takes about
          a minute.
        </p>
        <p>
          <a className="btn" href="/">
            Start the quiz
          </a>
        </p>
        {FEED_GENERATED && (
          <p className="meta">
            Specifications from the Shoe Finder database. Prices and stock last checked{' '}
            {new Date(FEED_GENERATED).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
            .
          </p>
        )}
      </div>

      <aside className="guide-side">
        <div className="side-box">
          <h4>On this page</h4>
          <nav>
            <a href="#specs">Side by side</a>
            <a href="#differences">What the differences mean</a>
            <a href="#verdict">Which should you buy?</a>
            <a href="#faq">Common questions</a>
          </nav>
        </div>
        <div className="side-box">
          <h4>Not sure either is right?</h4>
          <p>{DEFAULT_QUESTION_COUNT} questions, three shoes, and the reason for each one.</p>
          <a className="btn" href="/">
            Start the quiz
          </a>
        </div>
        {others.length > 0 && (
          <div className="side-box">
            <h4>Other comparisons</h4>
            <nav>
              {others.map(o => (
                <a key={o.slug} href={`/compare/${o.slug}`}>
                  {nm(o.a)} vs {nm(o.b)}
                </a>
              ))}
            </nav>
          </div>
        )}
      </aside>
    </main>
  );
}
