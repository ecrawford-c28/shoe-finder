import { getShoes } from '../lib/shoes';
import { scoreShoes } from '../lib/match';
import { priceOf } from '../lib/feed';
import { dealCounts, dealsForSize, GENDERS, SCALES } from '../lib/deals';
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

// A size chip only appears with at least this many deals behind it, the same
// bar the deals index uses for its headline, so nobody is sent to a page with
// two shoes on it. The rest are one click away on /deals.
const MIN_DEALS_FOR_CHIP = 5;

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

  // Deals by size. Each chip goes to that size's own page, because a deal is
  // only a deal if it comes in your size, and showing one size's deals to
  // everyone sent most people to a page of shoes they could not buy.
  const counts = dealCounts(shoes);
  const chips = gender =>
    counts[gender]
      .filter(r => r.count >= MIN_DEALS_FOR_CHIP)
      .map(r => ({ size: r.size, slug: r.slug, count: r.count }));

  // The headline number counts each shoe once however many sizes it is
  // discounted in, keyed on brand and model like the deals pages' own dedupe.
  const discounted = new Set();
  for (const gender of GENDERS) {
    for (const size of SCALES[gender]) {
      for (const g of dealsForSize(shoes, gender, size).groups) {
        for (const d of g.deals) discounted.add(`${d.shoe.brand} ${d.shoe.model}`.toLowerCase());
      }
    }
  }
  const deals = discounted.size
    ? { total: discounted.size, men: chips('men'), women: chips('women') }
    : null;

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
