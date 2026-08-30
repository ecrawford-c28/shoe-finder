import { getShoes } from '../../lib/shoes';
import { ratingStats } from '../../lib/match.js';

export const revalidate = 300;

export const metadata = {
  title: 'How the shoe finder works',
  description:
    'Exactly how the running shoe quiz scores every shoe against your answers, and why commission rates play no part in it.',
  alternates: { canonical: '/how-it-works' },
};

export default async function How() {
  // The score section only appears once there is rating data behind it, so the
  // page never explains a number the reader cannot find anywhere on the site.
  const { shoes } = await getShoes();
  const hasScores = Boolean(ratingStats(shoes));
  return (
    <main className="prose">
      <h1>How the shoe finder works</h1>
      <p>
        No black box. Here is exactly what happens when you answer the questions.
      </p>

      <h2>Every shoe is scored against your answers</h2>
      <p>
        The database holds current running shoes with the things that actually decide fit: category,
        support level, cushioning, weight, heel drop, stack height, toe box shape, which width
        fittings exist, whether the foam holds up under a heavier runner, how durable the outsole is,
        and price.
      </p>
      <p>
        Your answers apply a set of rules to that data. Some rules add points, some take them away,
        and a few rule a shoe out entirely.
      </p>

      <h2>The rules that matter most</h2>
      <ul>
        <li>
          <strong>Surface.</strong> Say trail and only trail shoes are considered. Say road and trail
          shoes are removed. Say a bit of both and the road-friendly trail shoes stay in.
        </li>
        <li>
          <strong>Width.</strong> Very wide feet push shoes with a genuine 4E fitting to the top.
          Anything with a narrow toe box drops out.
        </li>
        <li>
          <strong>Pronation.</strong> A noticeable roll inwards brings support shoes forward. No roll
          and neutral shoes are favoured instead.
        </li>
        <li>
          <strong>Achilles, calves, knees and shins.</strong> Heel drop is the height difference
          between the heel and the forefoot. A higher drop asks less of the achilles and calf and
          more of the knee, and a lower drop does the opposite. Tell us where you get regular pain
          and the shoes with a drop that suits you move up the list.
        </li>
        <li>
          <strong>Weight.</strong> Over 90kg and soft, low-durability foams get marked down, because
          they pack out quickly and stop protecting you.
        </li>
        <li>
          <strong>Experience.</strong> New runners never get shown a carbon plated race shoe or a
          zero drop shoe, whatever else lines up.
        </li>
        <li>
          <strong>Plates.</strong> Say you want a plated shoe and the carbon and nylon plated models
          move to the top. Say you do not and none of them appear at all. You will only be asked this
          if it could change your answer, so not if you are new to running, not if you run off road,
          and not on a budget below the cheapest plated shoe. That is why the quiz is a question
          longer for some people than others.
        </li>
        <li>
          <strong>Budget.</strong> Anything above your ceiling is heavily penalised, and flagged if it
          still makes the list.
        </li>
        <li>
          <strong>Brands.</strong> Brands that have worked for you get a nudge up. Brands you pick as
          not working are removed completely.
        </li>
      </ul>

      {hasScores ? (
        <>
      <h2 id="shoe-finder-score">The Shoe Finder Score</h2>
      <p>
        Some shoes carry a Shoe Finder Score out of ten. It is built from the star ratings left by
        people who bought the shoe, put on a common footing so that comparing two numbers actually
        tells you something.
      </p>
      <p>Three things are done to the raw ratings, and all three are deliberate.</p>
      <ul>
        <li>
          <strong>The scale is stretched.</strong> Almost every running shoe sits between 4.2 and 4.9
          stars, so an unadjusted score gives everything an eight or better and separates nothing.
          The score spreads that narrow band out across the full ten points.
        </li>
        <li>
          <strong>Thin evidence counts for less.</strong> Four five star reviews is not a ten. Every
          rating is pulled back towards the average by an amount that depends on how many people left
          one, so a shoe has to earn a high score with volume as well as enthusiasm.
        </li>
        <li>
          <strong>No reviews is not the same as bad reviews.</strong> Cheaper shoes, support shoes
          and trail shoes get reviewed far less often than the headline models. A shoe nobody has
          rated is treated as average rather than scored as poor, so those parts of the range are
          not quietly emptied out.
        </li>
      </ul>
      <p>
        The score is one input among many and a capped one. It settles a close call between two shoes
        that both suit you. It cannot pull a shoe into your results that does not fit your answers in
        the first place, and no amount of five star reviews will put a race shoe in front of a new
        runner. Where a shoe has no ratings behind it, no score is shown at all rather than a
        placeholder.
      </p>
        </>
      ) : null}

      <h2>Where the buy links go</h2>
      <p>
        Every shoe links to SportsShoes.com, which carries the widest range of running shoe brands
        in the UK, including the ones the big chains skip. The retailer is named on the button
        before you click it.
      </p>
      <p>
        Those links are paid. We earn a commission on what you spend, at no extra cost to you. It
        does not decide which shoes you are shown, and the{' '}
        <a href="/privacy">privacy page</a> sets out the detail.
      </p>

      <h2>Why you see three, not one</h2>
      <p>
        No algorithm knows how a shoe feels on your foot. Three gives you a shortlist to try on, and
        no more than two shoes come from the same brand so you are not looking at one company&apos;s
        catalogue.
      </p>

      <h2>How the data stays current</h2>
      <p>
        The shoe list lives in a spreadsheet that gets reviewed weekly. New models go in, discontinued
        ones come out, prices get checked.
      </p>

      <h2>Where the money comes from</h2>
      <p>
        Buy buttons are affiliate links, so a purchase may earn a commission. Commission rates are not
        an input to the scoring. A shoe that pays nothing can and does come out top.
      </p>
    </main>
  );
}
