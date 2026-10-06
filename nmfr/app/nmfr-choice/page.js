export const metadata = {
  title: 'What an NMFR Choice is',
  description:
    'Some shoes carry an NMFR Choice badge. It means Not Made For Running has run in that shoe and rates it. Nobody pays for the badge. Here is what it does and does not mean.',
  alternates: { canonical: '/nmfr-choice' },
};

export default function NmfrChoice() {
  return (
    <main className="prose">
      <h1>What an NMFR Choice is</h1>
      <p>
        A few shoes on this site carry a small lime badge marked NMFR Choice. It means one thing:
        Not Made For Running has run in that shoe, over enough miles to have an opinion, and rates
        it.
      </p>

      <h2>Nobody pays for it</h2>
      <p>
        No brand and no retailer can buy the badge, ask for it, or have it removed. The buy links on
        this site are paid, which is set out on the{' '}
        <a href="/how-it-works">how it works page</a>, but the commission is the same on every shoe
        here and it plays no part in which ones are badged. Shoes are bought or borrowed, run in, and
        badged or not on how they went.
      </p>

      <h2>What it does to your results</h2>
      <p>
        Very little, and that is deliberate. The badge is worth a small nudge in the ranking, less
        than half of what a single matching shoe type is worth. It settles a close call between two
        shoes that already suit the answers you gave. It cannot pull a shoe into your results that
        does not fit what you asked for, and no amount of personal enthusiasm will put a race shoe in
        front of somebody buying their first pair.
      </p>
      <p>
        If a badged shoe is wrong for you, you will not see it. That matters more than promoting
        favourites.
      </p>

      <h2>What it is not</h2>
      <ul>
        <li>
          <strong>It is not a score.</strong> The{' '}
          <a href="/how-it-works#shoe-finder-score">Shoe Finder Score</a> is built from customer
          ratings and is a separate thing. A shoe can carry one, both, or neither.
        </li>
        <li>
          <strong>It is not a promise about your feet.</strong> One pair of feet liked it. Yours are
          not those feet. Fit, width and how a shoe feels on you beat any recommendation, including
          this one.
        </li>
        <li>
          <strong>No badge does not mean a bad shoe.</strong> Most shoes in the database have never
          been tested personally, because there are over two hundred of them and one person running.
          An unbadged shoe is simply one with no first hand opinion behind it.
        </li>
      </ul>

      <h2>Where the running happens</h2>
      <p>
        On the Not Made For Running account on Instagram, which is where the testing gets written up
        properly. The <a href="/contact">contact page</a> has the link.
      </p>
    </main>
  );
}
