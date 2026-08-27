'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { track } from '@vercel/analytics';
import { QUESTIONS, visibleQuestions, scoreShoes, summarise, discountInfo } from '../lib/match';

const CAT_LABEL = {
  daily_trainer: 'Everyday trainer',
  max_cushion: 'Max cushion',
  stability: 'Support',
  tempo: 'Fast training',
  race: 'Race day',
  trail: 'Trail',
};

function Intro({ onStart, count, questions }) {
  return (
    <section className="hero">
      <h1>
        Which running shoes
        <br />
        <em>should you buy?</em>
      </h1>
      <p>
        {questions} quick questions about your feet, your weight and the way you actually run. You get
        three shoes that suit you, and the reasons why, in plain English.
      </p>
      <p>Takes about a minute. No email, no sign up.</p>
      <div style={{ marginTop: 26 }}>
        <button className="btn" onClick={onStart}>
          Start the quiz
        </button>
      </div>
      <p className="meta">
        {count} shoes in the database, checked and updated weekly.
      </p>
      <p className="meta" style={{ marginTop: 4 }}>
        Or read the <a href="/guides">shoe guides</a>, covering wide feet, overpronation, knee and
        achilles pain, cushioning, trail and price.
      </p>
    </section>
  );
}

function Question({ q, brands, value, onPick, onNext, onBack, index, total }) {
  const [text, setText] = useState(value || '');
  const options = q.dynamic === 'brands' ? brands.map(b => ({ value: b, label: b })) : q.options || [];
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

function ShoeCard({ entry, rank, size, clearWinner }) {
  const s = entry.shoe;
  const [imgOk, setImgOk] = useState(Boolean(s.image_url));
  const widthNote =
    s.widths.includes('extra_wide') ? '4E available' : s.widths.includes('wide') ? 'Wide fitting' : null;
  const deal = discountInfo(s);
  return (
    <article className={`card${rank === 0 ? ' top' : ''}`}>
      {rank === 0 && <span className="rank">{clearWinner ? 'Best match' : 'Top pick'}</span>}
      {imgOk ? (
        <img
          className="shoe-img"
          src={s.image_url}
          alt={`${s.brand} ${s.model}`}
          loading="lazy"
          onError={() => setImgOk(false)}
        />
      ) : null}
      <div className="brand">{s.brand}</div>
      <h3>{s.model}</h3>
      <div className="price">
        {deal && deal.payPrice ? (
          <>
            £{deal.payPrice.toFixed(2).replace('.00', '')}{' '}
            <s>£{Number(s.rrp_gbp).toFixed(2).replace('.00', '')}</s>
          </>
        ) : (
          <>£{Number(s.rrp_gbp).toFixed(2).replace('.00', '')}</>
        )}
      </div>
      {deal ? (
        <p className="deal">
          {deal.percent ? `${deal.percent}% off ` : 'Discount '}with code <b>{deal.code}</b>, applied
          for you at checkout
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
      <a className="btn" href={`/go/${s.id}`} target="_blank" rel="nofollow sponsored noopener">
        Buy at {s.retailer || 'SportsShoes'}
      </a>
      {s.review_url ? (
        <a className="review-link" href={s.review_url} target="_blank" rel="noopener noreferrer">
          Read the lab review at RunRepeat
        </a>
      ) : null}
      {size ? (
        <p className="meta" style={{ fontSize: 13, color: '#6f6f7c', marginTop: 12, marginBottom: 0 }}>
          Ask for {size}
          {widthNote ? ` in a ${s.widths.includes('extra_wide') ? '4E' : 'wide'} fitting` : ''}.
        </p>
      ) : null}
    </article>
  );
}

function Results({ answers, shoes, onRestart }) {
  const results = useMemo(() => scoreShoes(shoes, answers), [shoes, answers]);
  const top = results.slice(0, 3);
  const more = results.slice(3, 5);
  const summary = summarise(answers);
  const anyDeal = [...top, ...more].some(e => e.shoe.discount_code);
  // Calling something the best match only means anything if it is actually ahead.
  // Measured across every persona, the gap between shoes is usually a point or
  // two, which is well inside the noise of our own scoring.
  const clearWinner = top.length < 2 || top[0].score - top[1].score >= 5;

  return (
    <section className="results">
      <h2>Here are your three.</h2>
      <p className="lede">
        Based on <b>{summary}</b>.
      </p>

      <div className="disclosure">
        <b>Ad.</b>{' '}
        {anyDeal ? (
          <>
            We earn a small commission if you buy through these links, and the discount code is part
            of that arrangement. The code lowers what you pay, and neither the code nor the
            commission plays any part in which shoes get recommended.
          </>
        ) : (
          <>
            We earn a small commission if you buy through these links. It costs you nothing extra and
            it plays no part in which shoes get recommended.
          </>
        )}
      </div>

      {top.map((entry, i) => (
        <ShoeCard
          key={entry.shoe.id}
          entry={entry}
          rank={i}
          size={answers.size}
          clearWinner={clearWinner}
        />
      ))}
      {!clearWinner && top.length > 1 ? (
        <p className="meta" style={{ color: '#6f6f7c', fontSize: 13, marginTop: -6 }}>
          These three scored within a whisker of each other, so treat them as a shortlist rather than
          a ranking. Pick on fit, price, or which one you like the look of.
        </p>
      ) : null}

      {more.length > 0 && (
        <>
          <h3 style={{ marginTop: 34, fontSize: 20, letterSpacing: '-0.02em' }}>Also worth a look</h3>
          {more.map(entry => (
            <ShoeCard key={entry.shoe.id} entry={entry} rank={9} size={answers.size} />
          ))}
        </>
      )}

      <div style={{ marginTop: 30, display: 'grid', gap: 10 }}>
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
        This is a starting point, not medical advice. If you are running through pain or coming back
        from an injury, go and see a physio, and try shoes on before you commit where you can.
        {answers.niggles && answers.niggles !== 'none' ? (
          <>
            {' '}
            You told us you get regular pain, so that last bit matters. A different shoe can take
            some load off a sore spot, but it will not fix the reason it is sore, and changing heel
            drop suddenly can cause its own problems. Move across gradually.
          </>
        ) : null}
      </p>
    </section>
  );
}

export default function Quiz({ shoes, brands }) {
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
        <Intro count={shoes.length} questions={total} onStart={start} />
      )}
      {stage === 'quiz' && (
        <Question
          key={q.id}
          q={q}
          brands={brands}
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
