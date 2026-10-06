'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { track } from '@vercel/analytics';
import { QUESTIONS, visibleQuestions, scoreShoes, summarise, discountInfo } from '../lib/match';
import { priceOf, sizesOffered } from '../lib/feed';
import ChoiceBadge from './ChoiceBadge';

// Prices come from the feed as numbers. Trailing .00 reads as fake precision on
// a price tag, so it goes.
const money = n => Number(n).toFixed(2).replace('.00', '');

const CAT_LABEL = {
  daily_trainer: 'Everyday trainer',
  max_cushion: 'Max cushion',
  stability: 'Support',
  tempo: 'Fast training',
  race: 'Race day',
  trail: 'Trail',
};

function Intro({ onStart, onAnswerFirst, count, questions, sample, deals, guides }) {
  const first = QUESTIONS[0];
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <h1>
            Which running shoes <em>should you buy?</em>
          </h1>
          <p className="lede">
            {questions} quick questions about your feet, your weight and how you run. Three shoes
            that suit you, and why.
          </p>
          <div className="ctas">
            <button className="btn" onClick={onStart}>
              Take the quiz <span className="arrow" aria-hidden="true">&rarr;</span>
            </button>
            <a className="btn ghost" href={deals ? '#deals' : '/deals'}>
              Today&rsquo;s deals
            </a>
          </div>
        </div>
        {sample ? (
          <figure className="hero-demo">
            <article className="demo-card" aria-label="An example result">
              <span className="rank">Best match</span>
              {sample.image ? (
                <div className="plate">
                  <img src={sample.image} alt={`${sample.brand} ${sample.model}`} width="600" height="400" />
                </div>
              ) : null}
              <div className="demo-body">
                <div className="brand">{sample.brand}</div>
                <div className="demo-head">
                  <h3>{sample.model}</h3>
                  <div className="price">
                    £{money(sample.now)}
                    {sample.was ? <s>£{money(sample.was)}</s> : null}
                  </div>
                </div>
                <ul className="why">
                  {sample.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
                <div className="specs">
                  <span>{CAT_LABEL[sample.category] || sample.category}</span>
                  <span>{sample.weight}g</span>
                  <span>{sample.drop}mm drop</span>
                </div>
              </div>
            </article>
            <figcaption className="demo-fade">
              A real result for someone after comfortable road miles who gets achilles trouble.
              Yours depends on your answers.
            </figcaption>
          </figure>
        ) : null}
      </section>

      <div className="facts">
        <span>
          <b>{count}</b> shoes in the database, prices checked daily
        </span>
        <span>About a minute to finish</span>
        <span>No email, no sign up</span>
      </div>

      <section className="home-quiz">
        <div className="home-quiz-copy">
          <h2>Your answers pick the shoes</h2>
          <p>
            Every shoe is scored against what you tell us about fit, weight, pronation and the
            running you do. Commission plays no part in the order.
          </p>
        </div>
        <div className="panel">
          <p className="panel-step">
            1 of {questions}
          </p>
          <h3>{first.title}</h3>
          {first.help ? <p className="help">{first.help}</p> : null}
          {/* The real first question. Picking an answer starts the quiz with it
              already given, so the home page is the first step, not a lobby. */}
          <div className="opts">
            {first.options.map(o => (
              <button key={o.value} className="opt" onClick={() => onAnswerFirst(o.value)}>
                <strong>{o.label}</strong>
                {o.sub ? <small>{o.sub}</small> : null}
              </button>
            ))}
          </div>
        </div>
      </section>

      {deals ? (
        <section className="home-deals" id="deals">
          <div className="section-head">
            <h2>Today&rsquo;s deals, by size</h2>
            <p>
              {deals.total} shoes are discounted today across all sizes. Pick yours to see the ones
              in stock in it. Anything under 15% off is left out.
            </p>
          </div>
          {[
            ['Men’s', deals.men],
            ['Women’s', deals.women],
          ].map(([who, list]) =>
            list.length ? (
              <div className="size-row" key={who}>
                <h3>{who}</h3>
                <div className="size-chips">
                  {list.map(c => (
                    <a key={c.slug} className="size-chip" href={`/deals/${c.slug}`}>
                      <b>UK {c.size}</b>
                      <span>{c.count} deals</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null
          )}
          <div className="more">
            <a className="btn ghost" href="/deals">
              Every size
            </a>
          </div>
        </section>
      ) : null}

      {guides && guides.length ? (
        <section className="home-guides">
          <h2>Shoe guides, in plain English</h2>
          <p>Already know what you need? Each guide picks shoes for one kind of runner and says why.</p>
          <div className="rail">
            {guides.map(g => (
              <a key={g.slug} href={`/guides/${g.slug}`}>
                {g.label}
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

function Question({ q, brands, gender, value, onPick, onNext, onBack, index, total }) {
  const [text, setText] = useState(value || '');
  // Sizes come from the feed rather than a hardcoded range, so the list only
  // ever offers sizes the shop stocks something in. Women's and men's scales
  // differ, and the gender question is answered long before this one.
  const sizeOpts = useMemo(
    () => sizesOffered(gender).map(v => ({ value: String(v), label: String(v) })),
    [gender]
  );
  const options =
    q.dynamic === 'brands' ? brands.map(b => ({ value: b, label: b }))
    : q.dynamic === 'sizes' ? sizeOpts
    : q.options || [];
  const selected = q.multi ? (Array.isArray(value) ? value : []) : value;

  const toggle = v => {
    if (!q.multi) return onPick(v);
    const cur = Array.isArray(value) ? value : [];
    onPick(cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]);
  };

  return (
    <section className="q">
      <div className="progress">
        <div className="row">
          <span className="step">
            Question {index + 1} of {total}
          </span>
          {index > 0 && (
            <button className="back" onClick={onBack}>
              ← Back
            </button>
          )}
        </div>
        <div className="bar">
          <i style={{ width: `${(index / total) * 100}%` }} />
        </div>
      </div>

      <h2>{q.title}</h2>
      {q.help && <p className="help">{q.help}</p>}

      {q.freeText ? (
        <>
          <input
            className="text"
            placeholder="e.g. UK 9, or 9.5"
            value={text}
            onChange={e => {
              setText(e.target.value);
              onPick(e.target.value);
            }}
            onKeyDown={e => e.key === 'Enter' && onNext()}
            autoFocus
          />
          <div className="actions">
            <button className="btn" onClick={onNext}>
              See my shoes
            </button>
          </div>
        </>
      ) : q.multi ? (
        <>
          <div className="chips">
            {options.map(o => (
              <button
                key={o.value}
                className={`opt chip${selected.includes(o.value) ? ' on' : ''}`}
                onClick={() => toggle(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="actions">
            <button className="btn" onClick={onNext}>
              {selected.length ? 'Next' : 'Skip'}
            </button>
          </div>
        </>
      ) : q.dynamic === 'sizes' ? (
        <>
          <div className="sizepick">
            {options.map(o => (
              <button
                key={o.value}
                className={`sizeopt${selected === o.value ? ' on' : ''}`}
                onClick={() => {
                  onPick(o.value);
                  setTimeout(onNext, 120);
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="actions">
            <button className="btn ghost" onClick={onNext}>
              {selected ? 'See my shoes' : 'Skip, show me everything'}
            </button>
          </div>
        </>
      ) : (
        <div className="opts">
          {options.map(o => (
            <button
              key={o.value}
              className={`opt${selected === o.value ? ' on' : ''}`}
              onClick={() => {
                onPick(o.value);
                setTimeout(onNext, 120);
              }}
            >
              <strong>{o.label}</strong>
              {o.sub && <small>{o.sub}</small>}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function ShoeCard({ entry, rank, size, clearWinner, gender }) {
  const s = entry.shoe;
  const genderParam = gender === 'women' ? '?g=women' : '';
  const price = priceOf(s);
  const [imgOk, setImgOk] = useState(Boolean(s.image_url));
  const widthNote =
    s.widths.includes('extra_wide') ? '4E available' : s.widths.includes('wide') ? 'Wide fitting' : null;
  const deal = discountInfo(s);
  return (
    <article className={`card${rank === 0 ? ' top' : ''}${imgOk ? ' has-img' : ''}`}>
      {rank === 0 && <span className="rank">{clearWinner ? 'Best match' : 'Top pick'}</span>}
      {entry.valuePick && <span className="rank value">Best value</span>}
      {imgOk ? (
        <div className="shoe-img">
          <img
            src={s.image_url}
            alt={`${s.brand} ${s.model}`}
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        </div>
      ) : null}
      <div className="card-body">
      {/* Shown only when the size filter could not fill the page from stock in
          their size. Saying it plainly beats quietly dropping the shoe, because
          at the ends of the size scale there is often nothing else to offer. */}
      {entry.outOfSize ? (
        <p className="warn" style={{ marginTop: 0 }}>
          Not in UK {size} at the moment. Shown because little else fits what you asked for.
        </p>
      ) : null}
      {s.nmfr_choice ? <ChoiceBadge /> : null}
      <div className="brand">{s.brand}</div>
      <h3>{s.model}</h3>
      <div className="price">
        {deal && deal.payPrice ? (
          <>
            £{money(deal.payPrice)} <s>£{money(price.now)}</s>
          </>
        ) : price.was ? (
          <>
            £{money(price.now)} <s>£{money(price.was)}</s>{' '}
            <span className="off">{price.percentOff}% off</span>
          </>
        ) : (
          <>
            £{money(price.now)}{' '}
            <span className="rrp-note">{price.live ? 'at SportsShoes' : 'RRP, often less at the shop'}</span>
          </>
        )}
      </div>
      {/* Size depth matters more than the headline percentage. A half price shoe
          that exists in one size sends most readers on a wasted trip. */}
      {price.live && price.sizesInStock !== null && price.sizesInStock <= 3 ? (
        <p className="stocklow">
          Only {price.sizesInStock} {price.sizesInStock === 1 ? 'size' : 'sizes'} left at SportsShoes
        </p>
      ) : null}
      {entry.cheaperSibling ? (
        <p className="cheaper">
          Last year&apos;s <b>{entry.cheaperSibling.model}</b> is still available and usually
          discounted.{' '}
          <a href={`/go/${entry.cheaperSibling.id}${genderParam}`} target="_blank" rel="nofollow sponsored noopener">
            Check the price
          </a>
          .
        </p>
      ) : null}
      {s.status === 'outgoing' ? (
        <p className="outgoing">
          Last year&apos;s model. Same shoe as the current version in all but the details, and
          usually heavily discounted.
        </p>
      ) : null}
      {deal ? (
        <p className="deal">
          {deal.percent ? `${deal.percent}% off ` : 'Discount '}with code <b>{deal.code}</b>, applied
          for you at checkout
        </p>
      ) : null}
      {entry.sfs != null ? (
        <p className="sfs">
          <b>{entry.sfs}</b>
          <span className="sfs-of">/10</span>
          <a href="/how-it-works#shoe-finder-score" className="sfs-label">
            Shoe Finder Score
          </a>
          {s.rating_count ? (
            <span className="sfs-n">from {s.rating_count.toLocaleString('en-GB')} reviews</span>
          ) : null}
        </p>
      ) : null}
      {s.one_liner && <p className="liner">{s.one_liner}</p>}
      <ul className="why">
        {entry.reasons.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      {entry.flags.map((f, i) => (
        <p className="warn" key={i}>
          Heads up: {f}
        </p>
      ))}
      <div className="specs">
        <span>{CAT_LABEL[s.category] || s.category}</span>
        <span>{s.weight_g}g</span>
        <span>{s.drop_mm}mm drop</span>
        {widthNote && <span>{widthNote}</span>}
        {s.plate !== 'none' && <span>{s.plate} plate</span>}
      </div>
      <a className="btn" href={`/go/${s.id}${genderParam}`} target="_blank" rel="nofollow sponsored noopener">
        Buy at {s.retailer || 'SportsShoes'}
      </a>
      {s.review_url ? (
        <a className="review-link" href={s.review_url} target="_blank" rel="noopener noreferrer">
          Read the lab review at RunRepeat
        </a>
      ) : null}
      {size && !entry.outOfSize ? (
        <p className="meta" style={{ fontSize: 13, color: '#6f6f7c', marginTop: 12, marginBottom: 0 }}>
          Ask for {size}
          {widthNote ? ` in a ${s.widths.includes('extra_wide') ? '4E' : 'wide'} fitting` : ''}.
        </p>
      ) : null}
      </div>
    </article>
  );
}

function Results({ answers, shoes, onRestart }) {
  const results = useMemo(() => scoreShoes(shoes, answers, 5, { valuePick: true }), [shoes, answers]);
  const top = results.slice(0, 3);
  const more = results.slice(3, 5);
  const summary = summarise(answers);
  const anyDeal = [...top, ...more].some(e => e.shoe.discount_code);
  // Calling something the best match only means anything if it is actually ahead.
  // Measured across every persona, the gap between shoes is usually a point or
  // two, which is well inside the noise of our own scoring.
  const clearWinner = top.length < 2 || top[0].score - top[1].score >= 5;
  const disclosure = anyDeal
    ? 'We earn a small commission if you buy through these links, and the discount code is part of that arrangement. The code lowers what you pay, and neither the code nor the commission plays any part in which shoes get recommended.'
    : 'We earn a small commission if you buy through these links. It costs you nothing extra and it plays no part in which shoes get recommended.';

  return (
    <section className="results">
      <div className="results-main">
        <h2>Here are your three.</h2>
        <p className="lede">
          Based on <b>{summary}</b>.
        </p>

        <div className="disclosure">
          <b>Ad.</b> {disclosure}
        </div>

        <ShoeCard
          entry={top[0]}
          rank={0}
          size={answers.size}
          clearWinner={clearWinner}
          gender={answers.gender}
        />
        {top.length > 1 && (
          <div className="card-grid">
            {top.slice(1).map((entry, i) => (
              <ShoeCard
                key={entry.shoe.id}
                entry={entry}
                rank={i + 1}
                size={answers.size}
                clearWinner={clearWinner}
                gender={answers.gender}
              />
            ))}
          </div>
        )}
        {!clearWinner && top.length > 1 ? (
          <p className="meta" style={{ color: '#6f6f7c', fontSize: 13, marginTop: -6 }}>
            These three scored within a whisker of each other, so treat them as a shortlist rather
            than a ranking. Pick on fit, price, or which one you like the look of.
          </p>
        ) : null}

        {more.length > 0 && (
          <>
            <h3 className="also">Also worth a look</h3>
            <div className="card-grid">
              {more.map(entry => (
                <ShoeCard key={entry.shoe.id} entry={entry} rank={9} size={answers.size} gender={answers.gender} />
              ))}
            </div>
          </>
        )}

        <div className="end-actions">
          <button className="btn ghost" onClick={onRestart}>
            Start again
          </button>
          <a
            className="btn ghost"
            href="https://www.instagram.com/notmadeforrunning/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow Not Made For Running
          </a>
        </div>

        <p className="meta" style={{ color: '#6f6f7c', fontSize: 13, marginTop: 26 }}>
          This is a starting point, not medical advice. If you are running through pain or coming
          back from an injury, go and see a physio, and try shoes on before you commit where you
          can.
          {answers.niggles && answers.niggles !== 'none' ? (
            <>
              {' '}
              You told us you get regular pain, so that last bit matters. A different shoe can take
              some load off a sore spot, but it will not fix the reason it is sore, and changing
              heel drop suddenly can cause its own problems. Move across gradually.
            </>
          ) : null}
        </p>
      </div>

      <aside className="results-side">
        <div className="side-box">
          <h4>Your answers</h4>
          <p>{summary}</p>
          <button className="btn ghost" onClick={onRestart}>
            Start again
          </button>
        </div>
        <div className="side-box">
          <h4>More from us</h4>
          <p>Guides for wide feet, overpronation, sore knees and achilles, and shoes under £140.</p>
          <a className="btn ghost" href="/guides">
            Read the guides
          </a>
        </div>
        <div className="disclosure">
          <b>Ad.</b> {disclosure}
        </div>
      </aside>
    </section>
  );
}

export default function Quiz({ shoes, brands, sample, deals, guides }) {
  const [stage, setStage] = useState('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const topRef = useRef(null);

  useEffect(() => {
    if (stage !== 'intro') window.scrollTo({ top: 0, behavior: 'instant' });
  }, [stage, step]);

  // Some questions only apply to some people, so the list is recomputed from the
  // answers so far. The counter and the back button follow the visible list.
  const visible = useMemo(() => visibleQuestions(answers), [answers]);
  const total = visible.length;
  const safeStep = Math.min(step, total - 1);
  const q = visible[safeStep];

  // If an earlier answer changes and hides a question, drop whatever was said
  // in it so a stale answer cannot leak into the scoring.
  useEffect(() => {
    const live = new Set(visible.map(v => v.id));
    const stale = Object.keys(answers).filter(k => !live.has(k));
    if (stale.length) {
      setAnswers(a => {
        const next = { ...a };
        stale.forEach(k => delete next[k]);
        return next;
      });
    }
    if (step > total - 1) setStep(Math.max(0, total - 1));
  }, [visible, answers, step, total]);

  const pick = v => setAnswers(a => ({ ...a, [q.id]: v }));

  // Funnel tracking. Question names and step numbers only, never the answer
  // itself, so nothing here describes an individual.
  const start = () => {
    track('quiz_started');
    setStage('quiz');
  };

  // Answering the first question on the home page counts as starting and as
  // answering it, so the funnel reads the same however someone got in.
  const answerFirst = value => {
    track('quiz_started');
    track('question_answered', { question: QUESTIONS[0].id, step: 1, of: total });
    setAnswers({ [QUESTIONS[0].id]: value });
    setStep(1);
    setStage('quiz');
  };

  const next = () => {
    track('question_answered', { question: q.id, step: safeStep + 1, of: total });
    if (safeStep + 1 >= total) {
      track('quiz_completed');
      setStage('results');
    } else setStep(safeStep + 1);
  };
  const back = () => setStep(Math.max(0, safeStep - 1));

  const restart = () => {
    track('quiz_restarted');
    setAnswers({});
    setStep(0);
    setStage('intro');
  };

  return (
    <main ref={topRef}>
      {stage === 'intro' && (
        <Intro
          count={shoes.length}
          questions={total}
          onStart={start}
          onAnswerFirst={answerFirst}
          sample={sample}
          deals={deals}
          guides={guides}
        />
      )}
      {stage === 'quiz' && (
        <Question
          key={q.id}
          q={q}
          brands={brands}
          gender={answers.gender}
          value={answers[q.id]}
          onPick={pick}
          onNext={next}
          onBack={back}
          index={safeStep}
          total={total}
        />
      )}
      {stage === 'results' && <Results answers={answers} shoes={shoes} onRestart={restart} />}
    </main>
  );
}
