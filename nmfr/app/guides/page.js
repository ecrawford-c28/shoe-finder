import { GUIDES } from '../../lib/guides';

export const metadata = {
  title: 'Running shoe guides',
  description:
    'Straight answers on wide feet, overpronation, heel drop, cushioning, trail and price, with a shortlist from a database of current UK running shoes.',
  alternates: { canonical: '/guides' },
};

export default function Guides() {
  return (
    <main className="prose guide-index-page">
      <h1>Running shoe guides</h1>
      <p className="index-lede">
        Each guide explains what actually matters for one particular need, then shows the shoes our{' '}
        <a href="/">shoe finder</a> picks for it. Same database, same scoring, no hand picked
        favourites. If you are down to a straight choice between two shoes, the{' '}
        <a href="/compare">comparisons</a> take them apart side by side.
      </p>
      <ul className="guide-index">
        {GUIDES.map(g => (
          <li key={g.slug}>
            <a href={`/guides/${g.slug}`}>{g.h1}</a>
            <span>{g.description}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
