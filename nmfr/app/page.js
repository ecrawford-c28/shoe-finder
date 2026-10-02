import { getShoes } from '../lib/shoes';
import { scoreShoes } from '../lib/match';
import { priceOf } from '../lib/feed';
import { dealCounts, dealsForSize, dealSlug } from '../lib/deals';
import { GUIDES } from '../lib/guides';
import Quiz from '../components/Quiz';

export const revalidate = 300;

// The example card in the desktop hero is a real result, scored by the real
// rules for a fairly ordinary runner, so it can never drift out of date or
// promise something the quiz would not actually say.
const SAMPLE_ANSWERS = {
  purpose: 'comfort',
  surface: 'road',
  experience: 'some',
  width: 'normal',
  pronation: 'none',
  niggles: 'achilles',
  weight: 'mid',
  feel: 'soft',
  budget: '160',
  liked: [],
  avoid: [],
};

// How many deals the home page shows. One large and three small fills the grid
// exactly; any other number leaves a hole in it.
const HOME_DEALS = 4;

// "Best running shoes for wide feet" becomes "Wide feet". The full heading is
// right on the guide itself, but twenty of them in a row on the home page is a
// wall of "Best running shoes for".
function guideLabel(h1) {
  const s = h1
    .replace(/^best /i, '')
    .replace(/^running shoes for (the )?/i, '')
    .replace(/ running shoes/i, '')
    .trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default async function Home() {
  const { shoes, source } = await getShoes();
  const brands = [...new Set(shoes.map(s => s.brand))].sort();

  const best = scoreShoes(shoes, SAMPLE_ANSWERS, 1)[0];
  // The price shown is today's, the same figure the reasons quote, rather than
  // the RRP sitting beside a reason that says something cheaper.
  const samplePrice = best ? priceOf(best.shoe) : null;
  const sample = best
    ? {
        brand: best.shoe.brand,
        model: best.shoe.model,
        image: best.shoe.image_url || null,
        now: samplePrice.now,
        was: samplePrice.was,
        category: best.shoe.category,
        weight: best.shoe.weight_g,
        drop: best.shoe.drop_mm,
        reasons: best.reasons.slice(0, 3),
      }
    : null;

  // Deals teaser: the size with the most deals today, so the grid is always
  // full and the link lands on a page worth reading. Named on the page, so
  // nobody mistakes it for their own size.
  const counts = dealCounts(shoes);
  let busiest = null;
  for (const gender of ['men', 'women']) {
    for (const row of counts[gender]) {
      if (!busiest || row.count > busiest.count) busiest = { gender, ...row };
    }
  }
  let deals = null;
  if (busiest && busiest.count >= HOME_DEALS) {
    const { groups, count } = dealsForSize(shoes, busiest.gender, busiest.size);
    const top = groups
      .flatMap(g => g.deals)
      .sort((a, b) => b.percentOff - a.percentOff || a.now - b.now)
      .slice(0, HOME_DEALS)
      .map(d => ({
        id: d.shoe.id,
        brand: d.shoe.brand,
        model: d.shoe.model,
        image: d.shoe.image_url || null,
        liner: d.shoe.one_liner || '',
        now: d.now,
        was: d.was,
        percentOff: d.percentOff,
      }));
    const who = busiest.gender === 'women' ? 'women’s' : 'men’s';
    deals = {
      label: `${who} UK ${busiest.size}`,
      href: `/deals/${dealSlug(busiest.gender, busiest.size)}`,
      count,
      top,
    };
  }

  const guides = GUIDES.map(g => ({ slug: g.slug, label: guideLabel(g.h1) }));

  return (
    <Quiz
      shoes={shoes}
      brands={brands}
      source={source}
      sample={sample}
      deals={deals}
      guides={guides}
    />
  );
}
