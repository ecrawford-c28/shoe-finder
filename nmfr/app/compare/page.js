import { getShoes } from '../../lib/shoes';
import { PAIRS, pairSlug } from '../../lib/compare';

export const revalidate = 300;

export const metadata = {
  title: 'Running shoe comparisons',
  description:
    'Head to head running shoe comparisons on heel drop, weight, width fittings and price, from a database of current UK running shoes.',
  alternates: { canonical: '/compare' },
};

const nm = s => `${s.brand} ${s.model}`;

const CAT = {
  daily_trainer: 'Everyday trainers', max_cushion: 'Max cushioned', stability: 'Support shoes',
  tempo: 'Faster training', race: 'Race day', trail: 'Trail',
};

export default async function CompareIndex() {
  const { shoes } = await getShoes();
  const items = PAIRS.map(([x, y]) => ({
    slug: pairSlug(x, y),
    a: shoes.find(s => s.id === x),
    b: shoes.find(s => s.id === y),
  })).filter(i => i.a && i.b);

  const groups = {};
  items.forEach(i => {
    const k = i.a.category;
    (groups[k] = groups[k] || []).push(i);
  });

  return (
    <main className="prose">
      <h1>Running shoe comparisons</h1>
      <p className="index-lede">
        The pairings people actually weigh up, compared on the things that decide it: heel drop,
        weight, width fittings and price. Same database as the <a href="/">shoe finder</a>, so
        nothing here is written to sell you one over the other.
      </p>
      {Object.keys(groups).map(cat => (
        <div key={cat}>
          <h2>{CAT[cat] || cat}</h2>
          <ul className="guide-index">
            {groups[cat].map(i => (
              <li key={i.slug}>
                <a href={`/compare/${i.slug}`}>
                  {nm(i.a)} vs {nm(i.b)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}
