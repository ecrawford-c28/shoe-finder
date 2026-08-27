// Scoring engine. Every rule that fires can also add a plain English reason,
// so the results page can explain itself rather than looking like magic.

export const QUESTIONS = [
  {
    id: 'purpose',
    title: 'What do you mainly want them for?',
    help: 'Pick the closest one. You can always run in them for other things.',
    options: [
      { value: 'comfort', label: 'Comfortable everyday runs', sub: 'Easy miles, feeling good' },
      { value: 'first_shoe', label: 'My first proper running shoes', sub: 'Just getting started' },
      { value: 'long_run', label: 'Training for a race', sub: 'Half, marathon, building distance' },
      { value: 'speed_work', label: 'Getting faster', sub: 'Intervals, tempo, chasing a PB' },
      { value: 'race_day', label: 'Race day only', sub: 'The fast stuff for your goal race' },
      { value: 'walking', label: 'Walking, gym and the odd jog', sub: 'Not really running much' },
    ],
  },
  {
    id: 'surface',
    title: 'Where do you run?',
    options: [
      { value: 'road', label: 'Roads and pavements', sub: 'Streets, treadmill, parkrun' },
      { value: 'mixed', label: 'A bit of both', sub: 'Towpaths, parks, hard packed paths' },
      { value: 'trail', label: 'Trails and mud', sub: 'Hills, fields, proper off road' },
    ],
  },
  {
    id: 'experience',
    title: 'How long have you been running?',
    options: [
      { value: 'new', label: 'Just started', sub: 'Under six months' },
      { value: 'regular', label: 'A while now', sub: 'Out most weeks' },
      { value: 'seasoned', label: 'Years of it', sub: 'I know what I like' },
    ],
  },
  {
    id: 'width',
    title: 'How wide are your feet?',
    help: 'If your little toe presses against the side of most shoes, you are wide.',
    options: [
      { value: 'narrow', label: 'Narrow', sub: 'Shoes often feel sloppy' },
      { value: 'standard', label: 'Normal', sub: 'Most shoes fit fine' },
      { value: 'wide', label: 'Wide', sub: 'I need a bit more room' },
      { value: 'extra_wide', label: 'Very wide', sub: 'I look for 2E or 4E fittings' },
    ],
  },
  {
    id: 'pronation',
    title: 'Do your ankles roll inwards when you run?',
    help: 'Look at an old pair. Heavy wear on the inside edge usually means yes.',
    options: [
      { value: 'none', label: 'No, or not that I know of', sub: 'Even wear on the sole' },
      { value: 'mild', label: 'A little', sub: 'Slight roll inwards' },
      { value: 'strong', label: 'Yes, noticeably', sub: 'Been told I overpronate' },
    ],
  },
  {
    id: 'niggles',
    title: 'Do you often get pain or tightness anywhere?',
    help: 'Only answer yes if it is a regular thing rather than the odd bad day. It changes the heel to toe drop we look for.',
    options: [
      { value: 'achilles', label: 'Achilles or calves', sub: 'Sore or tight behind the ankle, or in the calf' },
      { value: 'knees', label: 'Knees or shins', sub: 'Sore at the front, or shin splints' },
      { value: 'both', label: 'A bit of both', sub: '' },
      { value: 'none', label: 'Neither', sub: 'Nothing regular' },
    ],
  },
  {
    id: 'weight',
    title: 'Roughly what do you weigh?',
    help: 'Heavier runners flatten soft foam faster, so this genuinely changes the answer.',
    options: [
      { value: 'light', label: 'Under 70kg', sub: 'Under 11 stone' },
      { value: 'mid', label: '70kg to 90kg', sub: '11 to 14 stone' },
      { value: 'heavy', label: 'Over 90kg', sub: 'Over 14 stone' },
      { value: 'skip', label: 'Rather not say', sub: '' },
    ],
  },
  {
    id: 'feel',
    title: 'How do you like a shoe to feel?',
    options: [
      { value: 'plush', label: 'Soft and pillowy', sub: 'Sink into it' },
      { value: 'balanced', label: 'Somewhere in the middle', sub: 'Cushioned but responsive' },
      { value: 'firm', label: 'Firm and connected', sub: 'I want to feel the ground' },
      { value: 'unsure', label: 'No idea', sub: 'Pick for me' },
    ],
  },
  {
    id: 'budget',
    title: "What's your budget?",
    options: [
      { value: '120', label: 'Up to £120' },
      { value: '160', label: 'Up to £160' },
      { value: '200', label: 'Up to £200' },
      { value: '9999', label: 'Whatever it takes' },
    ],
  },
  {
    id: 'plate',
    title: 'Do you want a plated shoe?',
    help: 'A stiff plate in the midsole that rolls you forward and makes fast running feel easier. The trade off is a firmer, less stable ride, a higher price, and a shoe that wears out sooner.',
    // Only worth asking when a plated shoe could actually be the answer. Every
    // plated shoe in the database is a tempo, race or marathon training shoe,
    // none of them are trail shoes, and the cheapest is £140.
    showIf: a =>
      ['speed_work', 'race_day', 'long_run'].includes(a.purpose) &&
      a.experience !== 'new' &&
      a.surface !== 'trail' &&
      parseFloat(a.budget || '9999') >= 140,
    options: [
      { value: 'yes', label: 'Yes, I want a plate', sub: 'The fast, firm, propulsive feel' },
      { value: 'no', label: 'No, keep plates out of it', sub: 'Nothing plated in my results' },
      { value: 'unsure', label: 'Not fussed either way', sub: 'Whatever suits me best' },
    ],
  },
  {
    id: 'liked',
    title: 'Any brands that have worked well for you?',
    help: 'Optional. Pick as many as you like, or skip.',
    multi: true,
    optional: true,
    dynamic: 'brands',
  },
  {
    id: 'avoid',
    title: 'Any brands that have not worked out?',
    help: 'Optional. We will leave these out of your results.',
    multi: true,
    optional: true,
    dynamic: 'brands',
  },
  {
    id: 'size',
    title: 'Last one. What size do you take?',
    help: 'UK sizing. This does not change the recommendation, it just goes on your results so you know what to order.',
    freeText: true,
    optional: true,
  },
];

// Some questions only apply to some people. This is the live list for a given
// set of answers, and it drives both the quiz and the progress counter.
export function visibleQuestions(answers) {
  return QUESTIONS.filter(q => !q.showIf || q.showIf(answers || {}));
}

const CUSH_ORDER = ['firm', 'balanced', 'plush'];

// What to tell the shopper about a discount code on this row. Lives here rather
// than in lib/shoes.js because the results card is a client component and
// lib/shoes.js reaches for node built ins.
export function discountInfo(shoe) {
  if (!shoe || !shoe.discount_code) return null;
  const percent = Number(shoe.discount_percent) > 0 ? Number(shoe.discount_percent) : 0;
  const price = Number(shoe.rrp_gbp) || 0;
  return {
    code: shoe.discount_code,
    percent,
    payPrice: percent > 0 && price ? Math.round(price * (1 - percent / 100) * 100) / 100 : null,
  };
}

export function scoreShoes(shoes, a, limit = 5) {
  const budget = parseFloat(a.budget || '9999');
  const avoid = new Set(a.avoid || []);
  const liked = new Set(a.liked || []);

  // A straight no on plates is a real filter, not a nudge. There are plenty of
  // quick unplated shoes left, so this never leaves the list thin.
  const pool = a.plate === 'no' ? shoes.filter(s => s.plate === 'none') : shoes;

  const scored = pool.map(shoe => {
    let score = 0;
    const _reasons = [];
    const flags = [];
    // Higher priority reasons are the ones that actually distinguish this shoe
    // from the rest of the list, so they get shown first.
    const why = (priority, text) => _reasons.push({ priority, text });

    // --- Surface -----------------------------------------------------------
    const isTrail = shoe.category === 'trail';
    if (a.surface === 'trail') {
      if (isTrail) { score += 55; why(9, 'Built for off road, with grip for mud and loose ground'); }
      else score -= 200;
    } else if (a.surface === 'road') {
      if (isTrail) score -= 200;
      else score += 10;
    } else if (a.surface === 'mixed') {
      if (isTrail && shoe.best_for.includes('easy_miles')) { score += 22; why(8, 'Copes with pavement as well as paths'); }
      else if (isTrail) score -= 35;
      else score += 8;
    } else {
      if (isTrail) score -= 60;
    }

    // --- Purpose -----------------------------------------------------------
    const PURPOSE_REASON = {
      comfort: 'Picked for comfortable everyday running',
      first_shoe: 'A sensible place to start if this is your first proper pair',
      long_run: 'Made for the long steady miles of race training',
      speed_work: 'Suits the faster sessions you said you want to do',
      race_day: 'A race day shoe, not an everyday trainer',
      walking: 'Comfortable for walking and gentle jogging',
    };
    if (shoe.best_for.includes(a.purpose)) {
      score += 30;
      if (PURPOSE_REASON[a.purpose]) why(4, PURPOSE_REASON[a.purpose]);
    }
    const purposeCategory = {
      comfort: ['max_cushion', 'daily_trainer'],
      first_shoe: ['daily_trainer', 'stability', 'max_cushion'],
      long_run: ['max_cushion', 'daily_trainer', 'tempo'],
      speed_work: ['tempo', 'race'],
      race_day: ['race', 'tempo'],
      walking: ['max_cushion', 'daily_trainer', 'stability'],
    }[a.purpose] || [];
    const catIdx = purposeCategory.indexOf(shoe.category);
    if (catIdx === 0) score += 30;
    else if (catIdx > 0) score += 18 - catIdx * 4;
    else if (purposeCategory.length) score -= 18;

    if (a.purpose === 'race_day' && shoe.plate === 'carbon') { score += 15; why(7, 'Carbon plate, which is what you want on race day'); }
    if (a.purpose === 'speed_work' && shoe.plate !== 'none') { score += 10; why(7, 'Plated, so it rewards you for pushing the pace'); }

    // --- Plate, only asked of people it could apply to ---------------------
    if (a.plate === 'yes') {
      if (shoe.plate === 'carbon') { score += 48; why(11, 'Carbon plated, the fast and propulsive feel you asked for'); }
      else if (shoe.plate !== 'none') { score += 38; why(11, `A ${shoe.plate} plate, propulsive but more forgiving than carbon`); }
      else score -= 80;
    }
    if (a.purpose === 'comfort' && shoe.cushioning === 'plush') { score += 12; }
    if (a.purpose === 'walking' && shoe.category === 'race') score -= 100;

    // --- Experience --------------------------------------------------------
    if (a.experience === 'new') {
      if (shoe.beginner_friendly) { score += 28; why(3, 'Forgiving enough for someone new to running'); }
      else score -= 30;
      if (shoe.category === 'race') score -= 120;
      if (shoe.drop_mm <= 2) { score -= 45; }
    } else if (a.experience === 'regular') {
      if (shoe.category === 'race' && a.purpose !== 'race_day') score -= 25;
    }

    // --- Width and toebox --------------------------------------------------
    if (a.width === 'extra_wide') {
      if (shoe.widths.includes('extra_wide')) { score += 55; why(12, 'Comes in a 4E extra wide fitting'); }
      else if (shoe.widths.includes('wide') && shoe.toebox === 'wide') { score += 22; why(12, 'Wide fitting with a roomy toe box'); }
      else if (shoe.widths.includes('wide')) score += 5;
      else score -= 90;
    } else if (a.width === 'wide') {
      if (shoe.widths.includes('wide') || shoe.widths.includes('extra_wide')) { score += 40; why(11, 'Available in a wide fitting'); }
      else if (shoe.toebox === 'wide') { score += 25; why(11, 'Naturally roomy up front, even in the standard fit'); }
      else score -= 55;
      if (shoe.toebox === 'narrow') score -= 25;
    } else if (a.width === 'narrow') {
      if (shoe.widths.includes('narrow')) { score += 30; why(11, 'Comes in a narrow fitting so it will not feel sloppy'); }
      if (shoe.toebox === 'wide') score -= 20;
    } else {
      if (shoe.toebox === 'narrow') score -= 8;
    }

    // --- Pronation ---------------------------------------------------------
    if (a.pronation === 'strong') {
      if (shoe.stability === 'stability') { score += 45; why(10, 'Proper support to stop your foot rolling inwards'); }
      else if (shoe.stability === 'mild_support') { score += 20; why(9, 'Some built in support'); }
      else score -= 65;
    } else if (a.pronation === 'mild') {
      if (shoe.stability === 'mild_support') { score += 38; why(10, 'Gentle support that you will not really notice'); }
      else if (shoe.stability === 'stability') { score += 18; why(9, 'Supportive, on the safe side for a mild roll'); }
      else score -= 12;
    } else {
      if (shoe.stability === 'neutral') score += 14;
      else if (shoe.stability === 'stability') score -= 22;
    }

    // --- Achilles, calves, knees and shins ---------------------------------
    // A higher heel to toe drop takes load off the achilles and calf and puts
    // more through the knee. A lower drop does the reverse. This is a firm
    // steer, not a filter, so a shoe that fits everything else can still win.
    const drop = shoe.drop_mm;
    if (a.niggles === 'achilles') {
      if (drop >= 10) { score += 44; why(10, `A tall ${drop}mm heel drop, which takes some of the strain off the achilles and calf`); }
      else if (drop >= 8) { score += 40; why(10, `An ${drop}mm heel drop, which asks less of the achilles and calf than a flatter shoe`); }
      else if (drop >= 6) { score += 10; }
      else if (drop >= 5) score -= 15;
      else score -= 70;
    } else if (a.niggles === 'knees') {
      if (drop <= 4) { score += 42; why(10, `A low ${drop}mm heel drop, which keeps load off the front of the knee`); }
      else if (drop <= 6) { score += 34; why(10, `A ${drop}mm heel drop, on the lower side, which is easier on sore knees`); }
      else if (drop <= 7) score += 6;
      else if (drop <= 9) score -= 20;
      else score -= 48;
    } else if (a.niggles === 'both') {
      // Pulling in both directions cancels out, so aim for the middle ground.
      if (drop >= 5 && drop <= 7) { score += 20; why(8, `A middle of the road ${drop}mm heel drop, which is a sensible place to sit`); }
      else if (drop <= 2 || drop >= 11) score -= 22;
    }

    // --- Runner weight -----------------------------------------------------
    if (a.weight === 'heavy') {
      if (shoe.heavier_runner_ok) { score += 30; why(9, 'Holds up under a heavier runner instead of bottoming out'); }
      else score -= 70;
      if (shoe.durability === 'high') { score += 14; why(5, 'Hard wearing, so it should last a good few hundred miles'); }
      if (shoe.durability === 'low') score -= 40;
      if (shoe.weight_g < 210) score -= 25;
    } else if (a.weight === 'mid') {
      if (shoe.durability === 'low' && a.purpose !== 'race_day') score -= 12;
    }

    // --- Feel --------------------------------------------------------------
    if (a.feel && a.feel !== 'unsure') {
      const want = CUSH_ORDER.indexOf(a.feel);
      const has = CUSH_ORDER.indexOf(shoe.cushioning);
      const gap = Math.abs(want - has);
      if (gap === 0) { score += 28; why(6, `Matches the ${a.feel === 'plush' ? 'soft' : a.feel === 'firm' ? 'firm' : 'balanced'} feel you asked for`); }
      else if (gap === 1) score += 6;
      else score -= 22;
    }

    // --- Budget ------------------------------------------------------------
    if (shoe.rrp_gbp > budget) {
      const over = shoe.rrp_gbp - budget;
      score -= over > 60 ? 220 : 95;
      flags.push(`at £${Math.round(shoe.rrp_gbp)} it is over your budget, so watch for a sale`);
    } else {
      score += 12;
      // Cheaper inside the budget is a mild plus, and it breaks ties sensibly.
      score += Math.round((1 - shoe.rrp_gbp / Math.max(budget, 1)) * 9);
      if (budget < 9000 && shoe.rrp_gbp <= budget * 0.7) {
        why(2, `Well inside your budget at £${Math.round(shoe.rrp_gbp)}`);
      }
    }

    // --- General quality and tie breaking ----------------------------------
    if (shoe.durability === 'high') score += 4;
    else if (shoe.durability === 'low' && a.purpose !== 'race_day') score -= 3;
    // Stable pseudo-random nudge so identically scored shoes do not simply fall
    // in database order. Deterministic, so the same answers always give the same list.
    let h = 0;
    for (let i = 0; i < shoe.id.length; i++) h = (h * 31 + shoe.id.charCodeAt(i)) % 1000;
    score += (h / 1000) * 3;

    // --- Brand history -----------------------------------------------------
    if (avoid.has(shoe.brand)) score -= 500;
    if (liked.has(shoe.brand)) { score += 22; why(6, `${shoe.brand} has worked for you before`); }

    const reasons = _reasons
      .sort((x, y) => y.priority - x.priority)
      .slice(0, 4)
      .map(r => r.text);
    return { shoe, score: Math.round(score * 10) / 10, reasons, flags };
  });

  scored.sort((x, y) => y.score - x.score);

  // Keep the top list varied: no more than two shoes from the same brand.
  const brandCount = {};
  const picked = [];
  for (const s of scored) {
    if (s.score < 0) continue;
    const n = brandCount[s.shoe.brand] || 0;
    if (n >= 2) continue;
    brandCount[s.shoe.brand] = n + 1;
    picked.push(s);
    if (picked.length >= limit) break;
  }
  // If filters were brutal, fall back to the raw ranking so we always answer.
  if (picked.length < 3) return scored.slice(0, limit);
  return picked;
}

export function summarise(a, brandsLiked) {
  const bits = [];
  const purposeText = {
    comfort: 'comfortable everyday runs',
    first_shoe: 'your first proper pair',
    long_run: 'race training',
    speed_work: 'faster running',
    race_day: 'race day',
    walking: 'walking and the odd jog',
  }[a.purpose];
  if (purposeText) bits.push(purposeText);
  if (a.surface === 'trail') bits.push('off road');
  else if (a.surface === 'mixed') bits.push('road and paths');
  else bits.push('roads');
  if (a.width === 'wide') bits.push('wide feet');
  if (a.width === 'extra_wide') bits.push('very wide feet');
  if (a.width === 'narrow') bits.push('narrow feet');
  if (a.pronation === 'strong') bits.push('needing support');
  else if (a.pronation === 'mild') bits.push('a mild roll inwards');
  if (a.niggles === 'achilles') bits.push('achilles and calf niggles');
  else if (a.niggles === 'knees') bits.push('knee and shin niggles');
  else if (a.niggles === 'both') bits.push('niggles at both ends');
  if (a.weight === 'heavy') bits.push('a heavier runner');
  if (a.plate === 'yes') bits.push('wanting a plate');
  else if (a.plate === 'no') bits.push('no plates');
  return bits.join(', ');
}
