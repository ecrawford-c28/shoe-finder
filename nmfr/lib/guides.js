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
  {
    slug: 'flat-feet',
    qualifies: s => s.stability !== 'neutral' || s.widths.includes('wide'),
    h1: 'Best running shoes for flat feet',
    title: 'Best running shoes for flat feet (UK)',
    description:
      'Supportive running shoes for low arches and flat feet, and an honest explanation of why a flat foot is not automatically a problem that needs fixing.',
    answers: { purpose: 'comfort', surface: 'road', experience: 'regular', width: 'wide', pronation: 'strong', niggles: 'none', weight: 'mid', feel: 'balanced', budget: '9999' },
    intro: [
      'Flat feet and overpronation get talked about as if they are the same thing. They are related but they are not identical. A flat foot describes the shape of your arch when you are stood still. Overpronation describes what your ankle does when you run. Plenty of people have low arches and perfectly ordinary running mechanics, and plenty of people with high arches roll inwards a lot.',
      'This matters because the old advice was to put every flat footed runner in a heavily corrective shoe, and the research has not been kind to that idea. Studies matching shoes to arch height have repeatedly failed to show fewer injuries. What does help is comfort, and comfort tends to come from a shoe with a stable, wide base that does not let your foot collapse inwards at the moment your weight lands on it.',
      'So the list below leans towards support and towards genuinely wide fittings, because a foot that spreads needs room to spread into. If a neutral shoe already feels good on your feet, there is no reason to switch. Comfortable and boring beats corrective and awkward.',
    ],
    faq: [
      ['Do flat feet mean I need stability shoes?', 'Not necessarily. Arch height on its own is a poor predictor of what shoe suits you. If you get no aches and your current shoes feel fine, you do not need to change anything. Support is worth trying if your ankles visibly roll inwards or if you get inner shin or arch soreness.'],
      ['Are wide fittings important for flat feet?', 'Often yes, and it is underrated. A low arch usually goes with a foot that spreads out under load. A shoe in a genuine 2E or 4E fitting gives that spread somewhere to go, which does more for comfort than most support features.'],
      ['Do I need custom orthotics?', 'Most people do not. If a podiatrist has prescribed them for a specific reason, use them, and pick a shoe with a removable insole and a bit of depth so they fit properly. Buying orthotics off the shelf because you have flat feet is treating a shape rather than a symptom.'],
    ],
  },
  {
    slug: 'treadmill',
    qualifies: s => s.category !== 'trail',
    h1: 'Best running shoes for the treadmill',
    title: 'Best treadmill running shoes (UK)',
    description:
      'Which running shoes suit treadmill running, why outsole grip and durability matter less indoors, and what actually makes a difference on a belt.',
    answers: { purpose: 'comfort', surface: 'road', experience: 'regular', width: 'standard', pronation: 'none', niggles: 'none', weight: 'mid', feel: 'balanced', budget: '9999' },
    intro: [
      'A treadmill removes two of the things a road shoe is built to cope with. There is no grit to chew through the outsole and no camber or uneven surface to steady yourself against. The belt is also slightly softer than pavement and it moves under you, which takes a little of the braking work out of each stride.',
      'The practical upshot is that outsole durability matters less than it does outdoors, so a lighter shoe with a thinner rubber layer is a reasonable choice and will last longer indoors than it would on the road. Breathability matters more, because there is no wind and gyms are warm, so feet get hotter than they do outside.',
      'The one thing that genuinely helps is a shoe that feels good repeating the same stride for a long time. Treadmill running is more monotonous than road running, with almost no variation in surface or direction, so a shoe with a bit of give tends to feel better over an hour than a firm racing shoe does.',
    ],
    faq: [
      ['Do I need special treadmill shoes?', 'No. Any road running shoe works on a treadmill. If you run mostly indoors you can pick a lighter, less durable shoe than you would for the road, because there is nothing abrasive to wear the outsole down.'],
      ['Should treadmill shoes be a size bigger?', 'Not because of the treadmill, but feet do swell in a warm gym over a long session. The usual advice applies: about a thumb width of room in front of your longest toe, and try shoes on later in the day when your feet are already a bit larger.'],
      ['Can I use trail shoes on a treadmill?', 'You can, but the lugs have nothing to bite into, so they compress oddly and wear down flat against the belt. It feels lumpy and it ruins the shoe for actual trails. Use a road shoe.'],
    ],
  },
  {
    slug: 'marathon',
    qualifies: s => ['daily_trainer', 'max_cushion', 'tempo', 'race'].includes(s.category),
    h1: 'Best running shoes for marathon training',
    title: 'Best marathon running shoes (UK)',
    description:
      'Shoes for marathon training and race day, why most of your miles want a different shoe from the race itself, and how many pairs you actually need.',
    answers: { purpose: 'long_run', surface: 'road', experience: 'regular', width: 'standard', pronation: 'none', niggles: 'none', weight: 'mid', feel: 'balanced', budget: '9999' },
    intro: [
      'Marathon training is mostly not marathon pace. A typical block is dominated by easy running, with a smaller amount of faster work and one long run a week. That shape should decide what you buy, because the shoe that carries you through five hundred easy miles is rarely the shoe you want on the start line.',
      'For the bulk of it you want something durable and forgiving, with enough foam to still feel decent in the last hour of a long run. Foam packs down with use, so a shoe with a hard wearing outsole and a well regarded midsole is worth more than a shoe that feels amazing for the first fifty miles and then goes flat.',
      'Race day is a separate decision, and the honest version is that a carbon plated shoe helps most at faster paces. If you are running under about four hours the returns are real. Beyond that the effect shrinks, and comfort over four or five hours matters more than a percentage of running economy. Whatever you race in, run in it several times first, including one long run. A marathon is a terrible place to discover a hotspot.',
    ],
    faq: [
      ['How many pairs do I need for a marathon block?', 'Two is plenty for most people, and one works. A pair for easy miles and long runs, and something lighter if you do faster sessions. Rotating two pairs also lets the foam recover between runs, which makes both last longer.'],
      ['When should I buy my race shoes?', 'Early enough to run in them properly, so at least six to eight weeks out. Do a few sessions and one long run in them. Buying a brand new shoe in race week is how people end up with blisters at eighteen miles.'],
      ['How long do marathon training shoes last?', 'Roughly three hundred to five hundred miles, depending on the shoe, your weight and the surface. The clearer signal is how they feel. When a shoe that used to feel cushioned starts feeling flat and your legs are more sore after ordinary runs, it is done.'],
    ],
  },
  {
    slug: 'parkrun',
    qualifies: s => ['daily_trainer', 'tempo', 'race'].includes(s.category) && s.weight_g <= 280,
    h1: 'Best running shoes for parkrun and 5k',
    title: 'Best running shoes for parkrun and 5k (UK)',
    description:
      'Light, quick running shoes for parkrun and 5k, including whether a faster shoe is worth it and what to do about grass and mud in winter.',
    answers: { purpose: 'speed_work', surface: 'road', experience: 'regular', width: 'standard', pronation: 'none', niggles: 'none', weight: 'mid', feel: 'balanced', budget: '9999' },
    intro: [
      'parkrun sits in an awkward spot for shoe choice. It is short enough that a light, responsive shoe feels great, but it is also once a week among a lot of other running, and most people do not want a dedicated pair for twenty minutes on a Saturday.',
      'For most runners the answer is a lighter daily trainer rather than a racing shoe. You get most of the quick feel without buying something that only makes sense at one pace, and you can use it for midweek faster sessions too. Weight is the specification that matters most here. A shoe eighty grams lighter is genuinely noticeable over 5k in a way it is not over a slow ten miler.',
      'The other consideration is the course. A lot of UK parkruns are on grass, gravel or park paths that turn to mud between November and March. If yours is one of them, a road shoe with a smooth outsole is going to feel treacherous, and a light trail shoe or something with more textured rubber will serve you better for half the year.',
    ],
    faq: [
      ['Are carbon plated shoes worth it for parkrun?', 'They work, but the value is questionable. They cost a lot, they wear out quickly, and the benefit is a small percentage. Over 5k that is a handful of seconds. Most people would get more from a light trainer they can also use in the week.'],
      ['What shoes for a muddy winter parkrun?', 'A trail shoe with moderate lugs, not a full fell shoe. UK parkrun mud is usually churned grass rather than mountain terrain, so you want grip without the harsh, knobbly ride that a proper fell shoe gives you on the tarmac sections.'],
      ['Can I use my normal trainers for parkrun?', 'Absolutely, and most people do. A faster shoe is a nice to have rather than a requirement. Fit and comfort matter more than the number on the stopwatch, particularly if parkrun is one of only a few runs you do each week.'],
    ],
  },
  {
    slug: 'winter-and-wet',
    qualifies: s => s.category === 'trail' || s.durability === 'high',
    h1: 'Best running shoes for winter and wet weather',
    title: 'Best winter running shoes UK, wet and muddy conditions',
    description:
      'Running shoes for British winters, covering grip on wet pavements and mud, whether waterproof shoes are worth it, and what actually keeps feet warm.',
    answers: { purpose: 'comfort', surface: 'mixed', experience: 'regular', width: 'standard', pronation: 'none', niggles: 'none', weight: 'mid', feel: 'balanced', budget: '9999' },
    intro: [
      'A British winter does not really demand a special shoe so much as a bit of grip and a realistic attitude to wet feet. Temperatures rarely stay low enough for insulation to matter once you are moving, and after ten minutes of running you are warm regardless.',
      'Grip is the part worth paying for. Wet pavement, wet leaves and painted road markings are all slippery, and a road outsole with a lot of smooth rubber is noticeably worse on them than one with texture. If any part of your route goes off tarmac, a shoe with modest lugs will make winter far less nervy without feeling ridiculous on the road sections.',
      'Waterproof shoes are the thing people most often get wrong. A membrane keeps water out for as long as you avoid puddles deeper than the collar, which in a British winter is optimistic. Once water goes in over the top it stays in, and the shoe takes a day longer to dry than a normal one. They are genuinely good for cold, damp, low intensity outings and frustrating for wet ones. Most runners are better off accepting wet feet and drying the shoes properly afterwards.',
    ],
    faq: [
      ['Are waterproof running shoes worth it?', 'For cold, boggy, slower runs, yes. For everything else, usually not. Water gets in over the collar and then cannot get out, and the membrane makes the shoe warmer and slower to dry. Wool socks and accepting wet feet works better than most people expect.'],
      ['What grip do I need for winter road running?', 'Not much, but not nothing. A road shoe with a textured rubber outsole is fine. What catches people out is a smooth, mostly foam outsole, which is fast and light in summer and skittish on a wet painted line in January.'],
      ['How do I dry running shoes properly?', 'Take the insoles out, loosen the laces fully and stuff them with newspaper, then leave them somewhere with moving air. Not on a radiator and not in an airing cupboard, because heat degrades midsole foam and glue faster than anything else you can do to a shoe.'],
    ],
  },
  {
    slug: 'low-drop',
    qualifies: s => s.drop_mm <= 5,
    h1: 'Best low drop and zero drop running shoes',
    title: 'Best low drop and zero drop running shoes (UK)',
    description:
      'Low and zero drop running shoes available in the UK, what heel to toe drop actually changes, and how to move to a lower drop without hurting yourself.',
    answers: { purpose: 'comfort', surface: 'road', experience: 'seasoned', width: 'standard', pronation: 'none', niggles: 'knees', weight: 'mid', feel: 'balanced', budget: '9999' },
    intro: [
      'Heel to toe drop is the height difference between the heel and the forefoot of a shoe. A traditional trainer is around 10mm to 12mm. Low drop usually means 4mm or less, and zero drop means the heel and forefoot sit at exactly the same height.',
      'What drop changes is where the work goes. A lower heel asks more of your calf and achilles and less of your knee. A higher heel does the reverse. Neither is better in the abstract. The right one depends on which of those areas gives you trouble, and on what your legs are already used to.',
      'The important word there is used to. Drop is the one specification where changing suddenly reliably causes problems. Going from a 10mm shoe straight into a zero drop one puts a stretch through the calf and achilles that they have not been prepared for, and the classic result is a sore achilles two weeks later. Move across gradually, keep the old pair, and use the new one for short easy runs at first.',
    ],
    faq: [
      ['Is zero drop better for you?', 'There is no good evidence that it is. It changes where load goes rather than reducing it. Some people find it more comfortable and some find it aggravating, and the only way to know which you are is to try it carefully.'],
      ['How long does it take to get used to zero drop?', 'Several weeks at least, and longer if you have a history of calf or achilles trouble. Start with short easy runs, no more than a couple a week, and keep your usual shoes for everything else until your legs stop complaining.'],
      ['Does low drop help knee pain?', 'It can, because it shifts load away from the front of the knee. The trade off is that it puts more through the calf and achilles, so if you have trouble at both ends you are usually better off somewhere in the middle rather than at either extreme.'],
    ],
  },
  {
    slug: 'lightweight',
    qualifies: s => s.weight_g > 0 && s.weight_g <= 260,
    h1: 'Lightest running shoes',
    title: 'Lightest running shoes available in the UK',
    description:
      'The lightest running shoes in our database by measured weight, what you give up to get there, and when light actually makes a difference.',
    answers: { purpose: 'speed_work', surface: 'road', experience: 'seasoned', width: 'standard', pronation: 'none', niggles: 'none', weight: 'light', feel: 'firm', budget: '9999' },
    intro: [
      'Weight is the easiest specification to compare and one of the easiest to over value. The research on it is reasonably consistent: every hundred grams added to a shoe costs roughly one percent in running economy. That is real, but it is small, and it is measured against a hundred grams, which is an enormous difference between two shoes.',
      'Where it genuinely matters is at speed and over shorter distances. A lighter shoe feels quicker because it is easier to swing through, and that feeling is worth something on a fast session or a 5k. Over a slow long run the effect is much less noticeable than the comfort of the shoe underneath you.',
      'The things you give up are cushioning, durability and often stability. Manufacturers get weight down by using less foam, less outsole rubber and less structure in the upper. That is a sensible trade for a race shoe and a poor one for the pair doing most of your mileage, which is why almost nobody sensible runs everything in their lightest shoes.',
    ],
    faq: [
      ['Does a lighter running shoe make you faster?', 'Marginally. Around one percent of running economy per hundred grams, which over a 5k is seconds rather than minutes. It feels like more than it is, and that feeling has its own value on a fast day.'],
      ['Are lightweight shoes bad for beginners?', 'Not bad, but usually not the best first choice. Lighter shoes tend to have less cushioning and less structure, and new runners generally benefit from more of both while their legs adapt to the load.'],
      ['How much does a running shoe weigh?', 'A typical UK men’s nine daily trainer is around 260g to 300g. Racing shoes come in nearer 180g to 230g. Trail shoes and max cushioned shoes are usually the heaviest, often over 300g.'],
    ],
  },
  {
    slug: 'walking',
    qualifies: s => s.best_for.includes('walking'),
    h1: 'Best running shoes for walking and being on your feet',
    title: 'Best running shoes for walking (UK)',
    description:
      'Running shoes that work well for walking, long days on your feet and the gym, and why a running shoe often beats a dedicated walking shoe.',
    answers: { purpose: 'walking', surface: 'road', experience: 'new', width: 'standard', pronation: 'none', niggles: 'none', weight: 'mid', feel: 'plush', budget: '9999' },
    intro: [
      'A lot of running shoes never see a run. They get bought for dog walks, for nursing shifts, for standing on a shop floor or for city breaks where you cover fifteen thousand steps a day, and they are usually a better answer than something sold as a walking shoe.',
      'The reason is cushioning and weight. Running shoes are engineered for repeated impact, which means more foam and less material than a walking shoe or a trainer built for the look of it. If you are on your feet for eight hours, that combination is exactly what you want.',
      'The choices change slightly though. Walking loads the heel more and for longer, so a softer, taller heel is worth more than it would be for running, and outright weight matters less. Durability matters more, because walking mileage adds up quietly and the outsole wears in a different pattern. A shoe with a hard wearing outsole and plenty of foam will outlast a light, fast one by a long way.',
    ],
    faq: [
      ['Are running shoes good for walking?', 'Generally yes, and often better than dedicated walking shoes. They are lighter and better cushioned. The main exception is proper hiking on rough ground, where you want the ankle support and stiffer sole of a walking boot.'],
      ['What running shoes are best for standing all day?', 'Something with a soft, thick heel and a wide, stable base. Weight matters much less than for running, so a max cushioned shoe that would feel heavy on a run is often ideal on a shop floor or a ward.'],
      ['How long do running shoes last for walking?', 'Longer than for running, often considerably. Walking loads the shoe less violently, so the foam survives more miles. Watch the outsole rather than the calendar, and replace them when the tread under the heel is worn smooth.'],
    ],
  },
  {
    slug: 'high-mileage',
    qualifies: s => s.durability === 'high',
    h1: 'Most durable running shoes for high mileage',
    title: 'Most durable running shoes for high mileage (UK)',
    description:
      'Running shoes built to survive high mileage, what actually wears out first, and how to tell when a shoe is finished rather than just dirty.',
    answers: { purpose: 'long_run', surface: 'road', experience: 'regular', width: 'standard', pronation: 'none', niggles: 'none', weight: 'heavy', feel: 'balanced', budget: '9999' },
    intro: [
      'If you run a lot, the cost per mile of a shoe matters more than the price on the box. A £160 shoe that lasts six hundred miles is better value than a £110 one that goes flat at two hundred and fifty, and it is also less likely to leave you sore in the last month of its life.',
      'Two separate things wear out. The outsole rubber wears down, which you can see, and the midsole foam compresses and stops springing back, which you cannot. The foam is usually what finishes a shoe first, and it is the reason a pair can look perfectly respectable while feeling dead underfoot.',
      'The shoes that last tend to share a few traits. A full rubber outsole rather than exposed foam, a firmer and denser midsole rather than the softest and lightest available, and a build aimed at daily training rather than racing. They are rarely the most exciting shoes on the shelf, which is rather the point.',
    ],
    faq: [
      ['How many miles should a running shoe last?', 'Between three hundred and five hundred miles is the usual range. Heavier runners and rougher surfaces push it towards the lower end. A durable shoe used on smooth roads by a lighter runner can go beyond it.'],
      ['How do I know when my running shoes are worn out?', 'Feel rather than looks. When a shoe that used to feel cushioned starts feeling flat, or you notice more soreness after ordinary runs, the foam has gone. Visible wear through the outsole to the foam underneath is a second clear signal.'],
      ['Does rotating two pairs make them last longer?', 'Yes, measurably. Midsole foam recovers over a day or two between runs, so alternating pairs means each one spends less time compressed. Two pairs rotated tend to outlast two pairs used one after the other.'],
    ],
  },
  {
    slug: 'how-to-choose',
    qualifies: null,
    h1: 'How to choose running shoes',
    title: 'How to choose running shoes: a plain English guide',
    description:
      'What actually matters when buying running shoes, which specifications are worth reading, and which shop advice you can safely ignore.',
    answers: { purpose: 'comfort', surface: 'road', experience: 'new', width: 'standard', pronation: 'none', niggles: 'none', weight: 'mid', feel: 'unsure', budget: '9999' },
    intro: [
      'Buying running shoes is made harder than it needs to be. There are a dozen specifications on every product page, most of them are marketing, and the two that decide whether you get on with a shoe are the two nobody mentions: does it fit, and does it feel right when you run in it.',
      'Fit comes first and nothing else compensates for getting it wrong. You want roughly a thumb width in front of your longest toe, a midfoot that feels held rather than squeezed, and a heel that does not slip. Feet swell during a run and during the day, so shop in the afternoon and size for your bigger foot, because almost nobody has two the same.',
      'After fit, the specifications worth caring about are heel to toe drop, which decides whether load goes through your knee or your calf, weight, which decides how quick a shoe feels, and the width fittings offered, which decides whether the shoe can fit you at all. Stack height and foam names are mostly noise. So, for most people, is gait analysis, because matching shoes to pronation has repeatedly failed to reduce injuries in studies that tested it properly.',
      'The last thing worth saying is that there is no single best running shoe, only the best one for your feet and the running you actually do. That is the entire reason this site asks questions instead of publishing a top ten.',
    ],
    faq: [
      ['What size running shoes should I buy?', 'Usually a half to a full size larger than your everyday shoes, because feet swell and slide forward when running. The test is a thumb width of space in front of your longest toe with the shoe laced properly.'],
      ['Do I need a gait analysis?', 'It is rarely decisive. The evidence that matching shoes to pronation reduces injury is weak. It is more useful as a way of getting several shoes on your feet with someone watching you run, which is worth doing whatever the treadmill camera concludes.'],
      ['How much should I spend on running shoes?', 'Between £100 and £150 buys a genuinely good shoe from every major brand. Above that you are usually paying for lighter weight or a plate, both of which suit racing rather than everyday miles. Last season’s version of a good shoe is very often the best value on the shelf.'],
      ['Should I buy running shoes online or in a shop?', 'A shop is better the first time, because getting several shoes on your feet is worth more than any amount of reading. Once you know a model fits, buying online is fine and usually cheaper, particularly for the previous version.'],
    ],
  },
];

export const guideBySlug = slug => GUIDES.find(g => g.slug === slug);
