// Head to head comparison pages.
//
// Every word on these pages is derived from the database, so a comparison can
// never claim a difference that is not in the data. Pairs are chosen by hand:
// same job, genuinely comparable, and the sort of thing people actually weigh
// up in a shop. Generating every possible pairing would give 5,000 near
// identical pages, which is the classic way to get a site buried.

export const PAIRS = [
  // Everyday trainers, where most of the searching happens
  ['nike-pegasus-42', 'brooks-ghost-18'],
  ['nike-pegasus-42', 'asics-gel-cumulus-28'],
  ['brooks-ghost-18', 'asics-gel-cumulus-28'],
  ['hoka-clifton-11', 'brooks-ghost-18'],
  ['hoka-clifton-11', 'nike-pegasus-42'],
  ['asics-novablast-6', 'saucony-ride-19'],
  ['asics-novablast-6', 'nike-pegasus-42'],
  ['new-balance-fresh-foam-x-1080v15', 'hoka-clifton-11'],
  ['saucony-ride-19', 'brooks-ghost-18'],
  ['adidas-supernova-rise-3', 'nike-pegasus-42'],
  ['puma-velocity-nitro-5', 'brooks-launch-12'],
  ['mizuno-wave-rider-30', 'asics-gel-cumulus-28'],

  // Max cushioned
  ['hoka-bondi-9', 'brooks-glycerin-23'],
  ['nike-vomero-18', 'hoka-bondi-9'],
  ['asics-gel-nimbus-28', 'hoka-bondi-9'],
  ['asics-gel-nimbus-28', 'brooks-glycerin-23'],
  ['saucony-triumph-24', 'asics-gel-nimbus-28'],
  ['nike-vomero-18', 'nike-vomero-plus'],
  ['brooks-ghost-max-4', 'hoka-bondi-9'],

  // Support
  ['asics-gel-kayano-33', 'brooks-adrenaline-gts-25'],
  ['asics-gt-2000-15', 'brooks-adrenaline-gts-25'],
  ['saucony-guide-19', 'asics-gt-2000-15'],
  ['hoka-arahi-9', 'brooks-adrenaline-gts-25'],
  ['asics-gel-kayano-33', 'new-balance-fresh-foam-x-860v15'],
  ['asics-gt-1000-14', 'asics-gt-2000-15'],

  // Faster training
  ['adidas-adizero-evo-sl', 'hoka-mach-7'],
  ['asics-superblast-3', 'adidas-adizero-evo-sl'],
  ['nike-zoom-fly-6', 'saucony-endorphin-speed-5'],
  ['new-balance-fuelcell-rebel-v5', 'hoka-mach-7'],

  // Race day
  ['nike-vaporfly-4', 'nike-alphafly-3'],
  ['nike-vaporfly-4', 'asics-metaspeed-sky-tokyo'],
  ['adidas-adizero-adios-pro-4', 'nike-vaporfly-4'],

  // Trail
  ['saucony-peregrine-16', 'salomon-speedcross-6'],
  ['hoka-speedgoat-7', 'saucony-peregrine-16'],
];

export const pairSlug = (a, b) => `${a}-vs-${b}`;

export const ALL_PAIR_SLUGS = PAIRS.map(([a, b]) => pairSlug(a, b));

const CAT = {
  daily_trainer: 'everyday trainer', max_cushion: 'max cushioned shoe',
  stability: 'support shoe', tempo: 'faster training shoe',
  race: 'race day shoe', trail: 'trail shoe',
};

const money = n => `£${Number(n).toFixed(2).replace('.00', '')}`;
const name = s => `${s.brand} ${s.model}`;

// Finds the pair for a slug, returning the two shoe objects in listed order.
export function pairFromSlug(slug, shoes) {
  const hit = PAIRS.find(([a, b]) => pairSlug(a, b) === slug);
  if (!hit) return null;
  const a = shoes.find(s => s.id === hit[0]);
  const b = shoes.find(s => s.id === hit[1]);
  return a && b ? [a, b] : null;
}

// Builds the written comparison. Each paragraph is produced only when the
// underlying numbers actually differ, so no page repeats a difference it does
// not have, and a pair that is alike in some respect simply says less about it.
export function comparison(a, b) {
  const points = [];

  const dw = Math.round(a.weight_g - b.weight_g);
  if (Math.abs(dw) >= 10) {
    const [light, heavy, diff] = dw < 0 ? [a, b, -dw] : [b, a, dw];
    points.push({
      h: 'Weight',
      p: `The ${name(light)} is ${diff}g lighter, at ${light.weight_g}g against ${heavy.weight_g}g. As a rough guide every 100g costs about one percent in running economy, so ${diff}g is worth a fraction of a percent. You will feel it more than it costs you, and it counts for more on a fast 5k than on a slow long run.`,
    });
  } else {
    points.push({
      h: 'Weight',
      p: `There is almost nothing in it, ${a.weight_g}g against ${b.weight_g}g. Weight is not the deciding factor between these two.`,
    });
  }

  const dd = a.drop_mm - b.drop_mm;
  if (Math.abs(dd) >= 2) {
    const [high, low] = dd > 0 ? [a, b] : [b, a];
    points.push({
      h: 'Heel drop',
      p: `This is the real difference. The ${name(high)} has a ${high.drop_mm}mm drop and the ${name(low)} has ${low.drop_mm}mm. A higher heel asks less of your achilles and calf and more of your knee, and a lower one does the opposite. If you get regular trouble at one of those, pick accordingly. If you get none, pick whichever is closer to what you already run in, because changing drop suddenly is the most reliable way to give yourself a new problem.`,
    });
  } else {
    points.push({
      h: 'Heel drop',
      p: `Both sit at around ${a.drop_mm}mm, so neither will feel unfamiliar if you are coming from the other. Nothing to choose here.`,
    });
  }

  // Width has three states, not two, and getting this wrong would contradict the
  // table further up the page: no wide fitting, a wide fitting, or 4E as well.
  const wRank = s => (s.widths.includes('extra_wide') ? 2 : s.widths.includes('wide') ? 1 : 0);
  const wa = wRank(a);
  const wb = wRank(b);
  if (wa !== wb) {
    const [more, less] = wa > wb ? [a, b] : [b, a];
    const mr = Math.max(wa, wb);
    const lr = Math.min(wa, wb);
    points.push({
      h: 'Width fittings',
      p:
        lr === 0
          ? `The ${name(more)} comes in a ${mr === 2 ? 'wide and a 4E' : 'wide'} fitting and the ${name(less)} is standard width only. If your feet are broad this is likely to settle it on its own, because no amount of cushioning makes up for a shoe that squeezes. Sizing up does not fix width, it just makes the shoe longer.`
          : `Both come in a wide fitting, but only the ${name(more)} goes as far as 4E. That matters if wide is not quite wide enough for you, which is more common than the number of shoes offering it suggests.`,
    });
  }

  if (a.stability !== b.stability) {
    const rank = { neutral: 0, mild_support: 1, stability: 2 };
    const [more, less] = rank[a.stability] > rank[b.stability] ? [a, b] : [b, a];
    const label = more.stability === 'stability' ? 'proper support' : 'a light steadying element';
    points.push({
      h: 'Support',
      p: `The ${name(more)} has ${label} built in and the ${name(less)} is neutral. That matters if your ankles roll inwards noticeably when you run. If they do not, support is not a bonus, it is just something you do not need underfoot.`,
    });
  }

  if (a.category !== b.category) {
    points.push({
      h: 'What they are for',
      p: `These are not quite the same kind of shoe. The ${name(a)} is an ${CAT[a.category] || a.category} and the ${name(b)} is an ${CAT[b.category] || b.category}. Worth knowing before you compare them purely on price.`,
    });
  }

  if (a.cushioning !== b.cushioning) {
    const soft = a.cushioning === 'plush' ? a : b.cushioning === 'plush' ? b : null;
    const firm = a.cushioning === 'firm' ? a : b.cushioning === 'firm' ? b : null;
    if (soft || firm) {
      points.push({
        h: 'Feel underfoot',
        p: soft && firm
          ? `The ${name(soft)} is the softer of the two and the ${name(firm)} is noticeably firmer. This one is preference rather than performance. Soft feels kinder on easy days, firm feels more connected when you want to move.`
          : soft
            ? `The ${name(soft)} is the softer ride. The other sits in the middle. Preference rather than performance.`
            : `The ${name(firm)} is the firmer, more connected ride. The other sits in the middle.`,
      });
    }
  }

  if (a.plate !== b.plate) {
    const [plated, plain] = a.plate !== 'none' ? [a, b] : [b, a];
    points.push({
      h: 'Plate',
      p: `The ${name(plated)} has a ${plated.plate} plate and the ${name(plain)} does not. A plate stiffens the shoe and helps most at faster paces. It also shortens the life of the shoe and costs a good deal more, so it earns its place on race day and rarely on a Tuesday.`,
    });
  }

  if (a.durability !== b.durability) {
    const rank = { low: 0, medium: 1, high: 2 };
    const [tough, soft] = rank[a.durability] > rank[b.durability] ? [a, b] : [b, a];
    points.push({
      h: 'How long they last',
      p: `The ${name(tough)} is built to take more mileage. If one pair is doing all your running, that is worth more than it sounds, because cost per mile matters more than the price on the box.`,
    });
  }

  const dp = Math.round(Math.abs(a.rrp_gbp - b.rrp_gbp));
  if (dp >= 10) {
    const [cheap, dear] = a.rrp_gbp < b.rrp_gbp ? [a, b] : [b, a];
    points.push({
      h: 'Price',
      p: `${money(cheap.rrp_gbp)} against ${money(dear.rrp_gbp)} at full price, so the ${name(cheap)} is ${money(dp)} less. Both are discounted often enough that the gap on the day may look nothing like this, which is worth checking before you decide on price alone.`,
    });
  } else {
    points.push({
      h: 'Price',
      p: `${dp <= 1 ? 'Effectively the same price' : `Within about ${money(dp)} of each other`} at full price, so this is not the thing to decide on. Whichever happens to be discounted on the day is the better buy.`,
    });
  }

  return points;
}

// The one line summary, used for the page description and the intro.
export function verdict(a, b) {
  const bits = [];
  if (Math.abs(a.drop_mm - b.drop_mm) >= 2) {
    const [h, l] = a.drop_mm > b.drop_mm ? [a, b] : [b, a];
    bits.push(`the ${name(h)} has the higher heel at ${h.drop_mm}mm against ${l.drop_mm}mm`);
  }
  if (Math.abs(a.weight_g - b.weight_g) >= 20) {
    const [lt, hv] = a.weight_g < b.weight_g ? [a, b] : [b, a];
    bits.push(`the ${name(lt)} is ${Math.round(hv.weight_g - lt.weight_g)}g lighter`);
  }
  const wa = a.widths.includes('wide') || a.widths.includes('extra_wide');
  const wb = b.widths.includes('wide') || b.widths.includes('extra_wide');
  if (wa !== wb) bits.push(`only the ${name(wa ? a : b)} comes in a wide fitting`);
  if (!bits.length) bits.push('they are closely matched on paper, so fit and feel will decide it');
  return bits.join(', ') + '.';
}
