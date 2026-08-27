const fs = require('fs');
const RN = 'https://www.runnersneed.com';

// Verified live Runners Need landing pages, checked one by one in August 2026.
const map = {
  // Nike: the model family pages are all empty, so everything lands on the brand page.
  'nike-pegasus-42': '/c/shoes/nike.html',
  'nike-vomero-18': '/c/shoes/nike.html',
  'nike-vomero-plus': '/c/shoes/nike.html',
  'nike-structure-26': '/c/shoes/nike.html',
  'nike-zoom-fly-6': '/c/shoes/nike.html',
  'nike-vaporfly-4': '/c/shoes/nike.html',
  'nike-alphafly-3': '/c/shoes/nike.html',
  'nike-pegasus-trail-5': '/c/shoes/nike.html',
  'nike-wildhorse-10': '/c/shoes/nike.html',

  'asics-gel-nimbus-28': '/c/shoes/asics/gel-nimbus.html',
  'asics-gel-cumulus-28': '/c/shoes/asics/gel-cumulus.html',
  'asics-novablast-6': '/c/shoes/asics/novablast.html',
  'asics-gel-kayano-33': '/c/shoes/asics/gel-kayano.html',
  'asics-gt-2000-15': '/c/shoes/asics/gt-2000.html',
  'asics-superblast-3': '/c/shoes/asics.html',
  'asics-magic-speed-5': '/c/shoes/asics.html',
  'asics-metaspeed-sky-tokyo': '/c/shoes/asics.html',
  'asics-gel-trabuco-14': '/c/shoes/asics/gel-trabuco.html',

  'hoka-clifton-11': '/c/shoes/hoka/clifton.html',
  'hoka-bondi-9': '/c/shoes/hoka/bondi.html',
  'hoka-mach-7': '/c/shoes/hoka/mach.html',
  'hoka-arahi-9': '/c/shoes/hoka/arahi.html',
  'hoka-gaviota-6': '/c/shoes/hoka/stability.html',
  'hoka-cielo-x1-3-0': '/c/shoes/hoka.html',
  'hoka-speedgoat-7': '/c/shoes/hoka/speedgoat.html',
  'hoka-challenger-8': '/c/shoes/hoka.html',

  'brooks-ghost-18': '/c/shoes/brooks/ghost.html',
  'brooks-ghost-max-4': '/c/shoes/brooks/ghost.html',
  'brooks-glycerin-23': '/c/shoes/brooks/glycerin.html',
  'brooks-adrenaline-gts-25': '/c/shoes/brooks/adrenaline.html',
  'brooks-launch-12': '/c/shoes/brooks.html',
  'brooks-hyperion-max-4': '/c/shoes/brooks/hyperion.html',
  'brooks-hyperion-elite-6': '/c/shoes/brooks/hyperion.html',
  'brooks-cascadia-20': '/c/shoes/brooks.html',

  'saucony-ride-19': '/c/shoes/saucony/ride.html',
  'saucony-triumph-24': '/c/shoes/saucony/triumph.html',
  'saucony-guide-19': '/c/shoes/saucony/guide.html',
  'saucony-hurricane-26': '/c/shoes/saucony.html',
  'saucony-endorphin-speed-5': '/c/shoes/saucony/endorphin-speed.html',
  'saucony-endorphin-pro-5': '/c/shoes/saucony/endorphin-collection.html',
  'saucony-peregrine-16': '/c/shoes/saucony.html',
  'saucony-xodus-ultra-4': '/c/shoes/saucony.html',

  'new-balance-fresh-foam-x-1080v15': '/c/shoes/new-balance/1080.html',
  'new-balance-fresh-foam-x-880v15': '/c/shoes/new-balance.html',
  'new-balance-fresh-foam-x-860v15': '/c/shoes/new-balance/860.html',
  'new-balance-fuelcell-rebel-v5': '/c/shoes/new-balance/fuelcell.html',
  'new-balance-fresh-foam-x-more-v6': '/c/shoes/new-balance.html',
  'new-balance-fuelcell-supercomp-elite-v6': '/c/shoes/new-balance/fuelcell.html',
  'new-balance-fuelcell-supercomp-trainer-v3': '/c/shoes/new-balance/fuelcell.html',
  'new-balance-fresh-foam-x-hierro-v9': '/c/shoes/new-balance.html',

  'on-cloudsurfer-2': '/c/shoes/on/cloudsurfer.html',
  'on-cloudmonster-3': '/c/shoes/on/cloudmonster.html',
  'on-cloudrunner-3': '/c/shoes/on/cloudrunner.html',
  'on-cloudboom-strike-2': '/c/shoes/on.html',

  'puma-velocity-nitro-5': '/c/shoes/puma.html',
  'puma-deviate-nitro-4': '/c/shoes/puma/deviate-nitro.html',
  'puma-magmax-nitro-2': '/c/shoes/puma.html',
  'puma-foreverrun-nitro-3': '/c/shoes/puma.html',
  'puma-fast-r-nitro-elite-3': '/c/shoes/puma.html',

  'altra-torin-9': '/brands/altra.html',
  'altra-experience-flow-3': '/brands/altra.html',
  'altra-lone-peak-9': '/brands/altra.html',

  'salomon-speedcross-6': '/brands/salomon.html',
  'salomon-ultra-glide-4': '/brands/salomon.html',
};

const shoes = JSON.parse(fs.readFileSync('/root/nmfr/data/shoes.json', 'utf8'));
let moved = 0, kept = 0;
for (const s of shoes) {
  if (map[s.id]) {
    s.retailer = 'Runners Need';
    s.retailer_url = RN + map[s.id];
    moved++;
  } else {
    s.retailer = 'SportsShoes';
    kept++;
  }
}
fs.writeFileSync('/root/nmfr/data/shoes.json', JSON.stringify(shoes, null, 2) + '\n');
console.log('Runners Need:', moved, ' SportsShoes kept:', kept, ' total:', shoes.length);
const missing = Object.keys(map).filter(k => !shoes.some(s => s.id === k));
console.log('unmatched map keys:', missing);
console.log('still on sportsshoes:', shoes.filter(s => s.retailer === 'SportsShoes').map(s => s.id).join(', '));
