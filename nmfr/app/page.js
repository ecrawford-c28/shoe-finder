import { getShoes } from '../lib/shoes';
import { scoreShoes } from '../lib/match';
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

export default async function Home() {
  const { shoes, source } = await getShoes();
  const brands = [...new Set(shoes.map(s => s.brand))].sort();

  const best = scoreShoes(shoes, SAMPLE_ANSWERS, 1)[0];
  const sample = best
    ? {
        brand: best.shoe.brand,
        model: best.shoe.model,
        rrp: Number(best.shoe.rrp_gbp).toFixed(2).replace('.00', ''),
        reasons: best.reasons.slice(0, 3),
      }
    : null;

  return <Quiz shoes={shoes} brands={brands} source={source} sample={sample} />;
}
