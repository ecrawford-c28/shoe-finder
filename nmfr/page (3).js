import { notFound } from 'next/navigation';
import { getShoes } from '../../../lib/shoes';
import { scoreShoes } from '../../../lib/match';
import { GUIDES, guideBySlug } from '../../../lib/guides';

export const revalidate = 300;

export function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }));
}

export function generateMetadata({ params }) {
  const g = guideBySlug(params.slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { title: g.title, description: g.description, url: `/guides/${g.slug}`, type: 'article' },
  };
}

const CAT = {
  daily_trainer: 'Everyday trainer', max_cushion: 'Max cushion', stability: 'Stability',
  tempo: 'Tempo', race: 'Race day', trail: 'Trail',
};

export default async function Guide({ params }) {
  const g = guideBySlug(params.slug);
  if (!g) notFound();
  const { shoes } = await getShoes();
  // Only shoes that genuinely meet the promise in the title get on the page.
  const pool = g.qualifies ? shoes.filter(g.qualifies) : shoes;
  const picks = scoreShoes(pool, { ...g.answers, liked: [], avoid: [] }, 8).slice(0, 8);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: g.h1,
        description: g.description,
        numberOfItems: picks.length,
        itemListElement: picks.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${p.shoe.brand} ${p.shoe.model}`,
          url: `https://shoefinder.co.uk/guides/${g.slug}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: g.faq.map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Shoe Finder', item: 'https://shoefinder.co.uk' },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://shoefinder.co.uk/guides' },
          { '@type': 'ListItem', position: 3, name: g.h1 },
        ],
      },
    ],
  };

  const others = GUIDES.filter(x => x.slug !== g.slug).slice(0, 5);

  return (
    <main className="prose guide">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="guide-main">
      <p className="meta" style={{ marginBottom: 8 }}>
        <a href="/guides">Guides</a>
      </p>
      <h1>{g.h1}</h1>
      {g.intro.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      <div className="disclosure" style={{ margin: '22px 0' }}>
        <b>Ad.</b> We earn a commission if you buy through the links below. It does not change what
        you pay and it plays no part in which shoes are listed.
      </div>

      <h2 id="shortlist">The shortlist</h2>
      <p>
        These are the shoes the <a href="/">Shoe Finder quiz</a> returns when you answer it as
        someone in this situation. Same database, same scoring, nothing added by hand. Answer it
        yourself and you will get a list shaped around your own feet, weight and budget rather than
        an average.
      </p>

      <ol className="guide-list">
        {picks.map(({ shoe, reasons }) => (
          <li key={shoe.id}>
            {shoe.image_url ? (
              <img className="g-img" src={shoe.image_url} alt={`${shoe.brand} ${shoe.model}`} loading="lazy" />
            ) : null}
            <h3>
              {shoe.brand} {shoe.model}
            </h3>
            <p className="guide-specs">
              £{Number(shoe.rrp_gbp).toFixed(2).replace('.00', '')} · {CAT[shoe.category] || shoe.category} ·{' '}
              {shoe.weight_g}g · {shoe.drop_mm}mm drop · {shoe.stack_heel_mm}mm stack
              {shoe.widths.includes('extra_wide') ? ' · 4E available' : shoe.widths.includes('wide') ? ' · wide fitting' : ''}
              {shoe.plate !== 'none' ? ` · ${shoe.plate} plate` : ''}
            </p>
            {shoe.one_liner && <p>{shoe.one_liner}</p>}
            {reasons.length > 0 && (
              <ul>
                {reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
            <p className="guide-links">
              <a href={`/go/${shoe.id}`} target="_blank" rel="nofollow sponsored noopener">
                Buy at {shoe.retailer || 'SportsShoes'}
              </a>
              {shoe.review_url ? (
                <>
                  {' · '}
                  <a href={shoe.review_url} target="_blank" rel="noopener noreferrer">
                    Lab review at RunRepeat
                  </a>
                </>
              ) : null}
            </p>
          </li>
        ))}
      </ol>

      <h2 id="method">How this list was put together</h2>
      <p>
        Every shoe in our database is scored against a set of rules, and this page shows the top
        eight for this particular need. The rules are written down in full on the{' '}
        <a href="/how-it-works">how it works</a> page, including which ones rule a shoe out
        completely. Nothing on this page is ordered by commission, and the prices are RRP, so shop
        around because they are very often discounted.
      </p>
      <p>
        This is a starting point rather than a fitting. Where you can, try shoes on, and if you are
        running through pain see a physio rather than buying your way out of it.
      </p>

      <h2 id="faq">Common questions</h2>
      {g.faq.map(([q, a], i) => (
        <div key={i}>
          <h3>{q}</h3>
          <p>{a}</p>
        </div>
      ))}

      <h2 id="quiz">Get a list for your feet, not an average one</h2>
      <p>
        The shortlist above assumes a fairly typical runner. The{' '}
        <a href="/">shoe finder</a> asks about your width, how your ankles roll, your weight, where
        you run, your budget and any recurring niggles, then gives you three shoes and tells you why
        each one made it. It takes about a minute and there is no email or sign up.
      </p>
      <p>
        <a className="btn" href="/">
          Start the quiz
        </a>
      </p>
      </div>

      <aside className="guide-side">
        <div className="side-box">
          <h4>On this page</h4>
          <nav>
            <a href="#shortlist">The shortlist</a>
            <a href="#method">How the list was built</a>
            <a href="#faq">Common questions</a>
          </nav>
        </div>
        <div className="side-box">
          <h4>Get your own list</h4>
          <p>Twelve questions, three shoes, and the reason for each one.</p>
          <a className="btn" href="/">
            Start the quiz
          </a>
        </div>
        <div className="side-box">
          <h4>Other guides</h4>
          <nav>
            {others.map(o => (
              <a key={o.slug} href={`/guides/${o.slug}`}>
                {o.h1}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </main>
  );
}
