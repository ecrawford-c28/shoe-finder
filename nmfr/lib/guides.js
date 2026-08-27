// Guide pages. Each one runs the same scoring engine the quiz uses, with the
// answers a person in that situation would give, so the shortlist is genuinely
// "what the tool would tell you" rather than a hand picked list.
export const GUIDES = [
  {
    slug: 'wide-feet',
    qualifies: s => s.widths.includes('wide') || s.widths.includes('extra_wide') || s.toebox === 'wide',
    h1: 'Best running shoes for wide feet',
    title: 'Best running shoes for wide feet (UK)',
    description:
      'Running shoes that come in a genuine 2E or 4E fitting, or have a naturally roomy toe box, picked from a database of current UK models.',
    answers: { purpose: 'comfort', surface: 'road', experience: 'regular', width: 'extra_wide', pronation: 'none', niggles: 'none', weight: 'mid', feel: 'balanced', budget: '9999' },
    intro: [
      'Wide feet are not a niche problem, they are just badly served. Most running shoes are built on one last, in one width, and the advice you usually get is to size up. That does not work, because going up a half size makes the shoe longer, not wider, and you end up with a heel that slips and a toe box that still pinches.',
      'There are two real answers. The first is a shoe sold in an actual wide fitting, usually labelled 2E for men and D for women, or 4E and 2E for extra wide. New Balance, Brooks, Asics and Nike all do this properly, and the shoe is built on a genuinely wider last rather than just being cut looser. The second is a shoe with a naturally generous toe box in its standard width, which is what Altra, Topo Athletic and Hoka are known for.',
      'The list below prefers the first over the second, because a real wide fitting holds your midfoot while giving your toes room, and a roomy standard shoe often does neither.',
    ],
    faq: [
      ['How do I know if I need a wide fitting?', 'Take the insole out of a shoe you already own and stand on it. If your foot spills over the edge at the widest point, near the base of your little toe, you want a wide fitting. Pressure on the little toe joint, numbness after a few miles, or wear on the outside of the upper are the other giveaways.'],
      ['What do 2E and 4E mean?', 'They are width codes. For men, D is standard, 2E is wide and 4E is extra wide. For women, B is standard, D is wide and 2E is extra wide. A shoe listed as available in 4E is built on a wider last, not simply made of stretchier material.'],
      ['Is a wide toe box the same as a wide fitting?', 'No, and the difference matters. A wide toe box gives your toes room to splay but the shoe may still be narrow through the middle. A wide fitting widens the whole shoe. If your foot is broad across the ball but normal at the heel, a wide toe box in a standard width often works better.'],
    ],
  },
  {
    slug: 'overpronation',
    qualifies: s => s.stability !== 'neutral',
    h1: 'Best running shoes for overpronation',
    title: 'Best running shoes for overpronation (UK)',
    description:
      'Stability and support running shoes for runners whose ankles roll inwards, ranked by the same engine behind the Shoe Finder quiz.',
    answers: { purpose: 'comfort', surface: 'road', experience: 'regular', width: 'standard', pronation: 'strong', niggles: 'none', weight: 'mid', feel: 'balanced', budget: '9999' },
    intro: [
      'Overpronation means your foot rolls inwards more than usual as it lands and loads. Almost everybody pronates to some degree, it is how your foot absorbs shock. It only becomes worth designing around when the roll is pronounced enough that your knee tracks inwards with it.',
      'The way shoes address it has changed. The old approach was a hard block of denser foam under the arch, which you could feel and often did not like. Modern support shoes are subtler: wider midsoles, foam that is firmer on one side than the other, and raised sidewalls that guide the foot rather than blocking it. Brooks call theirs GuideRails, Asics build it into the Kayano and GT-2000, Hoka use a J shaped frame.',
      'The honest caveat is that the research on whether support shoes prevent injury is a lot less settled than the marketing suggests. What is not in dispute is that many people find them more comfortable and more stable. That is a good enough reason on its own. If you are running through pain rather than just looking for a shoe, see a physio first.',
    ],
    faq: [
      ['How do I know if I overpronate?', 'Look at the soles of an old pair. Heavy wear on the inside edge of the forefoot, and a shoe that tilts inwards when you stand it on a table, both point to it. A running shop will film you on a treadmill for free, which is more reliable than guessing.'],
      ['Do I need a stability shoe if I overpronate?', 'Not automatically. If you have no pain and no history of injury, a neutral shoe you find comfortable is a perfectly reasonable choice. Support is worth trying if you get inner shin or knee soreness, or if neutral shoes feel unstable to you.'],
      ['What is the difference between stability and motion control?', 'Stability shoes guide the foot gently and suit mild to moderate overpronation, which is most people. Motion control shoes are much firmer and more rigid, and are now rare, aimed at severe cases usually alongside orthotics.'],
    ],
  },
  {
    slug: 'heavier-runners',
    qualifies: s => s.heavier_runner_ok && s.durability !== 'low',
    h1: 'Best running shoes for heavier runners',
    title: 'Best running shoes for heavier runners (UK)',
    description:
      'Running shoes with foam and outsoles that hold up under a heavier runner, rather than packing out after a few hundred miles.',
    answers: { purpose: 'comfort', surface: 'road', experience: 'regular', width: 'standard', pronation: 'none', niggles: 'none', weight: 'heavy', feel: 'balanced', budget: '9999' },
    intro: [
      'Most running shoe reviews are written by people who weigh around 70kg, and a lot of the advice does not survive contact with a heavier runner. The issue is not that shoes fall apart, it is that soft foam compresses further and recovers less under more load, so a shoe that feels plush in the shop can feel flat and dead within a couple of months.',
      'What actually helps is a bit counterintuitive. Very soft, very light foams are usually the worst choice, because there is not enough material to work with. A firmer, denser midsole with a decent amount of it, a wide base, and a proper rubber outsole rather than exposed foam, will last much longer and feel more stable while it does.',
      'The list below prioritises shoes with foams that hold their shape, high rated outsole durability, and a wide enough platform to feel steady. It deliberately marks down the lightweight racing foams, however good they feel for the first fifty miles.',
    ],
    faq: [
      ['How often should I replace my running shoes?', 'The usual guidance is 300 to 500 miles. If you are heavier, plan for the lower end of that, and judge by feel rather than the odometer. When the shoe stops feeling springy underfoot and starts feeling like a flat board, the foam is done, even if the upper looks new.'],
      ['Are max cushioned shoes better for heavier runners?', 'Often yes, because there is more foam to compress before you reach the bottom of it. The thing to check is that the foam is not the very softest available, and that the base is wide, since a tall soft stack on a narrow platform can feel tippy.'],
      ['Should I avoid carbon plated shoes?', 'Not necessarily, but they are built for racing rather than durability, and the foams used are the ones that pack out quickest. If you want one, keep it for races rather than daily training.'],
    ],
  },
  {
    slug: 'beginners',
    qualifies: s => s.beginner_friendly && s.category !== 'race',
    h1: 'Best running shoes for beginners',
    title: 'Best running shoes for beginners (UK)',
    description:
      'Sensible, forgiving first running shoes, with the specifications that matter explained in plain English and nothing you do not need.',
    answers: { purpose: 'first_shoe', surface: 'road', experience: 'new', width: 'standard', pronation: 'none', niggles: 'none', weight: 'mid', feel: 'balanced', budget: '160' },
    intro: [
      'The first pair is the one people most often get wrong, usually by buying either the cheapest shoe in a sports shop or the one an elite runner won a marathon in. Neither is what you want. A first running shoe should be cushioned enough to be forgiving, stable enough that you do not have to think about it, and durable enough to survive you working out what you are doing.',
      'You do not need a carbon plate. You do not need a zero drop shoe. You do not need to spend £250. What you need is a daily trainer, which is the boring middle of the range where most of the good shoes live, at somewhere between £100 and £150.',
      'Two things genuinely matter more than the model. The first is fit, so leave a thumb width at the end and do not buy something that pinches on the assumption it will give. The second is that you buy for the running you are actually doing, which for most beginners is short, slow and on pavement.',
    ],
    faq: [
      ['How much should I spend on my first running shoes?', 'Between £100 and £150 buys a genuinely good daily trainer from any of the major brands. Below about £80 you start losing midsole quality and durability. Above £180 you are mostly paying for racing technology that will not help you yet.'],
      ['Do I need to get my gait analysed?', 'It is free at most running shops and it will not do any harm. Treat the result as one input rather than a diagnosis. Comfort is the single best predictor of whether you will get on with a shoe.'],
      ['Can I use running shoes for the gym?', 'For treadmill running, yes. For lifting, not ideally, because a soft cushioned sole is unstable under load. For general classes they are fine.'],
    ],
  },
  {
    slug: 'achilles-and-calf-pain',
    qualifies: s => s.drop_mm >= 8,
    h1: 'Running shoes for achilles and calf pain',
    title: 'Running shoes for achilles and calf pain (UK)',
    description:
      'Why heel to toe drop matters if your achilles or calves keep flaring up, and which current shoes have the higher drop that takes load off them.',
    answers: { purpose: 'comfort', surface: 'road', experience: 'regular', width: 'standard', pronation: 'none', niggles: 'achilles', weight: 'mid', feel: 'balanced', budget: '9999' },
    intro: [
      'Heel to toe drop is the height difference between the heel of a shoe and its forefoot, measured in millimetres. A 10mm shoe sits your heel 10mm higher than your toes. It is one of the few specifications on a shoe box that has a clear, well understood effect on your body.',
      'A higher drop lifts the heel, which shortens the distance the achilles and calf have to work through, and takes some load off both. A lower drop does the opposite and asks more of them, while taking load off the knee. Neither is better in the abstract, they simply move the work around.',
      'So if the achilles or calf is the part that keeps complaining, a higher drop shoe, roughly 8mm and up, is worth trying. Two important caveats. A shoe cannot fix the reason a tendon is irritated, it can only reduce what is being asked of it, so this sits alongside proper rehab rather than instead of it. And change drop gradually, because jumping several millimetres overnight is itself a well known way to upset an achilles.',
    ],
    faq: [
      ['What heel drop is best for achilles pain?', 'Generally 8mm or higher. Most traditional daily trainers sit between 8mm and 12mm, so you have plenty of choice. If you are currently in a 4mm shoe, moving to 8mm is a meaningful change and worth phasing in over a few weeks.'],
      ['Will a higher drop shoe cure my achilles pain?', 'No. It reduces the load going through the tendon, which can make running more comfortable while the underlying problem is dealt with. Persistent achilles pain is worth seeing a physio about, because loading exercises are usually the thing that actually resolves it.'],
      ['Why does a lower drop shoe hurt my calves?', 'Because it puts your ankle in more dorsiflexion and asks the calf and achilles to control more of the movement. That is not a fault, it is the design working as intended, but it takes time to adapt to and some people never find it comfortable.'],
    ],
  },
  {
    slug: 'knee-pain',
    qualifies: s => s.drop_mm <= 6,
    h1: 'Running shoes for knee pain',
    title: 'Running shoes for knee pain (UK)',
    description:
      'Lower drop, well cushioned running shoes that shift load away from the front of the knee, and an honest explanation of what a shoe can and cannot do.',
    answers: { purpose: 'comfort', surface: 'road', experience: 'regular', width: 'standard', pronation: 'none', niggles: 'knees', weight: 'mid', feel: 'balanced', budget: '9999' },
    intro: [
      'Runner’s knee, the dull ache around or behind the kneecap, is the most common running complaint there is. It is usually a load problem rather than a damage problem, which is good news, because load is something you can change.',
      'Footwear is one lever among several, and not the biggest one. What it can do is shift where the work happens. A lower heel to toe drop reduces the load going through the front of the knee and moves it towards the ankle and calf. Plenty of cushioning helps too, though less than most people expect, because your legs adjust their stiffness to whatever is underfoot.',
      'The bigger levers are the ones that have nothing to do with shoes. Running slightly shorter strides at a slightly higher cadence reduces knee load measurably. So does building mileage gradually rather than in jumps. If your knee hurts on every run, see a physio, because a shoe is not going to sort it out on its own.',
    ],
    faq: [
      ['What heel drop is best for knee pain?', 'Lower, broadly 6mm or under. That moves load away from the knee and towards the calf and achilles. If you have a history of achilles trouble as well, the trade off runs the other way and you are better off in the middle, around 5mm to 7mm.'],
      ['Are cushioned shoes better for knee pain?', 'They help some people and the effect is smaller than the marketing implies, because your legs compensate for whatever is underfoot. Comfort is still worth having, so if a softer shoe feels better on your knees, that is a legitimate reason to buy it.'],
      ['Should I stop running if my knee hurts?', 'Not necessarily, but you should stop increasing. Pain that stays mild, does not worsen during the run and settles within a day is usually manageable. Pain that gets worse as you run, or that makes you limp, is a reason to stop and get it looked at.'],
    ],
  },
  {
    slug: 'max-cushion',
    qualifies: s => s.category === 'max_cushion' || s.stack_heel_mm >= 40,
    h1: 'Most cushioned running shoes',
    title: 'Most cushioned running shoes (UK)',
    description:
      'The softest, thickest stacked running shoes available in the UK right now, and who actually benefits from that much foam underfoot.',
    answers: { purpose: 'comfort', surface: 'road', experience: 'regular', width: 'standard', pronation: 'none', niggles: 'none', weight: 'mid', feel: 'plush', budget: '9999' },
    intro: [
      'Stack height is how much foam sits between your foot and the ground, measured at the heel. Ten years ago 25mm was normal. Today a max cushioned shoe is 40mm or more, which is the current legal limit for road racing and, not coincidentally, where most brands have settled.',
      'The case for it is straightforward. More foam means a softer landing, less feedback from rough pavement, and legs that feel fresher afterwards, particularly on long slow runs and recovery days. If your joints ache after running, this is the category to try first.',
      'The case against is worth knowing too. A tall stack raises you further off the ground, which can feel unstable, especially if the base is narrow or you are on uneven surfaces. Soft foam also robs a little energy when you want to run fast. Most people solve this by owning one soft shoe for easy miles and something firmer for the quicker stuff.',
    ],
    faq: [
      ['Is more cushioning always better?', 'No. It is better for comfort on easy runs and worse for feel and stability when you want to run fast or turn sharply. Soft foam also compresses more under heavier runners, so the very softest shoes are not always the right pick.'],
      ['What is a good stack height?', 'A normal daily trainer is around 35mm to 40mm at the heel. Max cushioned shoes are 40mm and above. There is no ideal number, it is a preference, and the height matters less than how the foam actually behaves.'],
      ['Are max cushioned shoes bad for your feet?', 'There is no good evidence that they are. The theory that thick soles weaken the foot is popular but not well supported. The practical downside is stability rather than harm.'],
    ],
  },
  {
    slug: 'trail-running-shoes',
    qualifies: s => s.category === 'trail',
    h1: 'Best trail running shoes',
    title: 'Best trail running shoes (UK)',
    description:
      'Trail shoes chosen for British conditions, which mostly means mud, wet rock and churned up bridleways rather than dry mountain trail.',
    answers: { purpose: 'comfort', surface: 'trail', experience: 'regular', width: 'standard', pronation: 'none', niggles: 'none', weight: 'mid', feel: 'balanced', budget: '9999' },
    intro: [
      'Most trail shoe reviews are written for dry, rocky, American trail. British trail is a different problem. For a good part of the year it is mud, wet grass, wet rock and puddles you cannot see the bottom of, and the shoe that wins on a dry alpine path is not the shoe you want in a Yorkshire field in February.',
      'Two things matter more here than anywhere else. Lug depth, which is how deep the studs on the outsole are, because anything under about 4mm will slide on wet mud. And rubber compound, because soft sticky rubber, Vibram Megagrip being the common one, holds onto wet rock in a way that harder compounds do not.',
      'Waterproofing is the one people get wrong. A waterproof shoe keeps water out until it comes in over the top, and then keeps it in. For British winter, most experienced trail runners skip the membrane and accept wet feet, because a draining shoe dries out while you run.',
    ],
    faq: [
      ['Do I need waterproof trail shoes?', 'Usually not. Water comes in over the collar the first time you misjudge a puddle, and a membrane then stops it draining out. Waterproof versions make more sense for cold, wet walking than for running.'],
      ['Can I use trail shoes on the road?', 'For short stretches connecting trails, yes. For any real distance on pavement the lugs wear down quickly and the ride feels harsh. If your runs are genuinely half and half, a door to trail shoe with shallower lugs is the better buy.'],
      ['What lug depth do I need for mud?', 'Around 5mm and above for proper mud, and 6mm or more for fell running and cross country. Anything shallower is a hard packed trail shoe, which is fine for towpaths and dry summer trail and useless in a wet field.'],
    ],
  },
  {
    slug: 'carbon-plate',
    qualifies: s => s.plate === 'carbon',
    h1: 'Best carbon plate running shoes',
    title: 'Best carbon plate running shoes (UK)',
    description:
      'Carbon plated race shoes available in the UK, what the plate actually does, and whether it is worth the money at your pace.',
    answers: { purpose: 'race_day', surface: 'road', experience: 'seasoned', width: 'standard', pronation: 'none', niggles: 'none', weight: 'mid', feel: 'balanced', budget: '9999', plate: 'yes' },
    intro: [
      'A carbon plate is a stiff curved sheet embedded in the midsole. It does two things: it stiffens the shoe so your toe joints bend less, which costs less energy, and it works with the foam around it to roll you forward onto your next step. The plate is not really the magic on its own, the foam is, and the two are designed together.',
      'The measured effect on running economy is real, generally in the region of a few per cent for most people. What that is worth in time depends entirely on how long you are running for, which is why these shoes make more sense over a half or full marathon than over a parkrun.',
      'The honest downsides. They are expensive, they wear out faster than a trainer because the foams are light and delicate, and they are less stable than a normal shoe, which some people never get on with. They also do not suit everyone: the benefit is smaller and less consistent at slower paces, and a small number of runners get no benefit at all.',
    ],
    faq: [
      ['Are carbon plate shoes worth it?', 'If you are racing a half or full marathon and chasing a time, probably yes. If you run for fitness and enjoyment, the money is better spent on two good daily trainers. The gain is a few per cent of your running economy, which matters more the longer you are out there.'],
      ['How long do carbon plate shoes last?', 'Usually 150 to 250 miles of hard running, well short of a normal trainer. The plate is not what fails, it is the foam, which is chosen for lightness and bounce rather than durability. Most people keep them for races and key sessions only.'],
      ['Can beginners wear carbon plate shoes?', 'You can, but it is not a good first purchase. They are firm, unstable at slow speeds, and demand more from your calves and achilles than a normal shoe. Build up in a daily trainer first.'],
    ],
  },
  {
    slug: 'under-140',
    qualifies: s => s.rrp_gbp <= 140,
    h1: 'Best running shoes under £140',
    title: 'Best running shoes under £140 (UK)',
    description:
      'Genuinely good running shoes at sensible money, because the most expensive shoe is very rarely the one most people should buy.',
    answers: { purpose: 'comfort', surface: 'road', experience: 'regular', width: 'standard', pronation: 'none', niggles: 'none', weight: 'mid', feel: 'balanced', budget: '160' },
    intro: [
      'Running shoe prices have climbed a long way, and the top of the range now sits close to £300. It is worth saying plainly that almost nobody needs to spend that. The expensive shoes are racing shoes, and what makes them expensive is technology aimed at going fast for an hour or two, not at being comfortable for the miles most people actually run.',
      'The sweet spot is between £100 and £140. That buys a current generation daily trainer from a major brand, with a modern foam, a durable outsole and a shape that has been refined over many years. The difference between that and a £180 shoe is usually a lighter foam and a nicer upper, neither of which will change your running.',
      'Where it is worth paying more is fit rather than performance. If you need a 4E fitting, or a genuinely wide toe box, or a support shoe, your choice narrows and the price floor goes up a bit. That is money well spent. Paying for a plate you are not going to use is not.',
    ],
    faq: [
      ['Are cheaper running shoes worse?', 'Below about £80, generally yes, because the midsole foam and the outsole rubber are where cost gets cut and those are the parts that matter. Between £100 and £140 you are buying genuinely good shoes, often last season’s model of something that cost £160 a year ago.'],
      ['Should I buy last year’s model?', 'Very often, yes. Most updates are minor, and the previous version typically drops 30 to 40 per cent once the new one lands. The thing to check is that the update was not a significant change, because occasionally a brand alters a shoe substantially and keeps the name.'],
      ['When do running shoes go on sale?', 'Around new model launches, which for most brands means late spring and again in autumn, and in the traditional January and Black Friday sales. Buying a size you already know fits, from a previous generation, is the cheapest reliable way to run.'],
    ],
  },
];

export const guideBySlug = slug => GUIDES.find(g => g.slug === slug);
