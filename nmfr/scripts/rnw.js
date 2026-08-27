const fs = require('fs');
const RNW = 'https://www.runnorthwest.co.uk';
const search = q => `${RNW}/search?q=${encodeURIComponent(q).replace(/%20/g, '+')}`;

// Verified against Run North West's own search index in August 2026.
// EXACT: the shop stocks this exact model and generation.
// FAMILY: the shop stocks the model line but an older generation, so we link to
//   the line without a number. That lands on what they have today and picks up
//   the new one automatically when it arrives.
// AWAY: not stocked at all, so the link stays with SportsShoes for now.
const EXACT = {
  'nike-pegasus-42': 'Nike Pegasus 42',
  'nike-vomero-18': 'Nike Vomero 18',
  'nike-vomero-plus': 'Nike Vomero Plus',
  'nike-structure-26': 'Nike Structure 26',
  'nike-zoom-fly-6': 'Nike Zoom Fly 6',
  'nike-vaporfly-4': 'Nike Vaporfly 4',
  'nike-alphafly-3': 'Nike Alphafly 3',
  'nike-pegasus-trail-5': 'Nike Pegasus Trail 5',
  'asics-gel-nimbus-28': 'Asics Gel Nimbus 28',
  'asics-gel-cumulus-28': 'Asics Gel Cumulus 28',
  'asics-novablast-6': 'Asics Novablast 6',
  'asics-gel-kayano-33': 'Asics Gel Kayano 33',
  'asics-gt-2000-15': 'Asics GT-2000 15',
  'asics-superblast-3': 'Asics Superblast 3',
  'asics-magic-speed-5': 'Asics Magic Speed 5',
  'asics-metaspeed-sky-tokyo': 'Asics Metaspeed Sky Tokyo',
  'asics-gel-trabuco-14': 'Asics Trabuco 14',
  'adidas-supernova-rise-3': 'Adidas Supernova Rise 3',
  'adidas-supernova-prima-3': 'Adidas Supernova Prima 3',
  'adidas-adizero-evo-sl': 'Adidas Adizero Evo SL',
  'adidas-adizero-boston-13': 'Adidas Adizero Boston 13',
  'adidas-adizero-adios-pro-4': 'Adidas Adizero Adios Pro 4',
  'adidas-ultraboost-5': 'Adidas Ultraboost 5',
  'adidas-terrex-agravic-speed-ultra-2': 'Adidas Terrex Agravic Speed Ultra 2',
  'hoka-clifton-11': 'Hoka Clifton 11',
  'hoka-bondi-9': 'Hoka Bondi 9',
  'hoka-mach-7': 'Hoka Mach 7',
  'hoka-gaviota-6': 'Hoka Gaviota 6',
  'hoka-cielo-x1-3-0': 'Hoka Cielo X1 3.0',
  'hoka-speedgoat-7': 'Hoka Speedgoat 7',
  'hoka-challenger-8': 'Hoka Challenger 8',
  'brooks-ghost-18': 'Brooks Ghost 18',
  'brooks-ghost-max-4': 'Brooks Ghost Max 4',
  'brooks-glycerin-23': 'Brooks Glycerin 23',
  'brooks-adrenaline-gts-25': 'Brooks Adrenaline GTS 25',
  'brooks-hyperion-elite-6': 'Brooks Hyperion Elite 6',
  'brooks-cascadia-20': 'Brooks Cascadia 20',
  'saucony-ride-19': 'Saucony Ride 19',
  'saucony-triumph-24': 'Saucony Triumph 24',
  'saucony-guide-19': 'Saucony Guide 19',
  'saucony-hurricane-26': 'Saucony Hurricane 26',
  'saucony-endorphin-speed-5': 'Saucony Endorphin Speed 5',
  'saucony-endorphin-pro-5': 'Saucony Endorphin Pro 5',
  'saucony-peregrine-16': 'Saucony Peregrine 16',
  'saucony-xodus-ultra-4': 'Saucony Xodus Ultra 4',
  'new-balance-fresh-foam-x-1080v15': 'New Balance 1080 V15',
  'new-balance-fresh-foam-x-880v15': 'New Balance 880 V15',
  'new-balance-fresh-foam-x-860v15': 'New Balance 860 V15',
  'new-balance-fuelcell-rebel-v5': 'New Balance FuelCell Rebel V5',
  'new-balance-fresh-foam-x-more-v6': 'New Balance Fresh Foam X More V6',
  'new-balance-fuelcell-supercomp-elite-v6': 'New Balance SuperComp Elite V6',
  'new-balance-fuelcell-supercomp-trainer-v3': 'New Balance SuperComp Trainer V3',
  'new-balance-fresh-foam-x-hierro-v9': 'New Balance Hierro V9',
  'on-cloudsurfer-2': 'On Cloudsurfer 2',
  'on-cloudmonster-3': 'On Cloudmonster 3',
  'on-cloudrunner-3': 'On Cloudrunner 3',
  'on-cloudboom-strike-2': 'On Cloudboom Strike 2',
  'puma-deviate-nitro-4': 'Puma Deviate Nitro 4',
  'puma-magmax-nitro-2': 'Puma MagMax Nitro 2',
  'puma-foreverrun-nitro-3': 'Puma ForeverRun Nitro 3',
  'puma-fast-r-nitro-elite-3': 'Puma Fast-R Nitro Elite 3',
  'mizuno-wave-rider-30': 'Mizuno Wave Rider 30',
  'mizuno-wave-inspire-22': 'Mizuno Wave Inspire 22',
  'mizuno-wave-sky-9': 'Mizuno Wave Sky 9',
  'mizuno-neo-vista-3': 'Mizuno Neo Vista 3',
  'altra-torin-9': 'Altra Torin 9',
  'altra-experience-flow-3': 'Altra Experience Flow 3',
  'altra-lone-peak-9': 'Altra Lone Peak 9',
  'salomon-speedcross-6': 'Salomon Speedcross 6',
  'salomon-ultra-glide-4': 'Salomon Ultra Glide 4',
};
const FAMILY = {
  'adidas-supernova-solution-3': 'Adidas Supernova Solution',
  'hoka-arahi-9': 'Hoka Arahi',
  'brooks-hyperion-max-4': 'Brooks Hyperion Max',
  'puma-velocity-nitro-5': 'Puma Velocity Nitro',
};
const AWAY = {
  'nike-wildhorse-10': 'https://www.sportsshoes.com/store/nike-wildhorse',
  'adidas-terrex-agravic-gore-tex-2': 'https://www.sportsshoes.com/store/adidas-terrex',
  'brooks-launch-12': 'https://www.sportsshoes.com/product/bro3520/',
  'topo-athletic-ultrafly-6': 'https://www.sportsshoes.com/product/top53/',
  'topo-athletic-magnifly-6': 'https://www.sportsshoes.com/product/top46/',
  'topo-athletic-atmos-2': 'https://www.sportsshoes.com/product/top35/',
  'under-armour-velociti-pace': 'https://www.sportsshoes.com/product/und9687/',
  'under-armour-velociti-distance': 'https://www.sportsshoes.com/product/und9690/',
  'inov8-mudtalon-speed-v2': 'https://www.sportsshoes.com/product/ino2607/',
  'inov8-trailfly-max-v2': 'https://www.sportsshoes.com/product/ino2622/',
};

const parse = t => { const rows=[];let r=[],f='',q=false;for(let i=0;i<t.length;i++){const c=t[i];
  if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
  else if(c==='"')q=true;else if(c===','){r.push(f);f=''}else if(c==='\n'){r.push(f);rows.push(r);r=[];f=''}
  else if(c==='\r'){}else f+=c}
  if(f.length||r.length){r.push(f);rows.push(r)}return rows.filter(x=>x.some(c=>c.trim()!==''))};
const esc = v => /[",\n]/.test(v) ? '"' + v.replace(/"/g,'""') + '"' : v;
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

const rows = parse(fs.readFileSync('running-shoes-database.csv','utf8'));
let head = rows[0];
// Add the two new columns if they are not already there
for (const col of ['discount_code','discount_percent']) {
  if (!head.includes(col)) head.splice(head.indexOf('wg_programid')+1, 0, col);
}
const idx = Object.fromEntries(head.map((h,i)=>[h,i]));
const out = [head];
const tally = { exact:0, family:0, away:0, missed:[] };

for (const raw of rows.slice(1)) {
  const r = new Array(head.length).fill('');
  rows[0].forEach((h,i) => { r[idx[h]] = raw[i] ?? ''; });
  const id = slug(`${r[idx.brand]} ${r[idx.model]}`);
  if (EXACT[id])      { r[idx.retailer]='Run North West'; r[idx.retailer_url]=search(EXACT[id]);  tally.exact++; }
  else if (FAMILY[id]){ r[idx.retailer]='Run North West'; r[idx.retailer_url]=search(FAMILY[id]); tally.family++; }
  else if (AWAY[id])  { r[idx.retailer]='SportsShoes';    r[idx.retailer_url]=AWAY[id];           tally.away++; }
  else tally.missed.push(id);
  out.push(r);
}
fs.writeFileSync('running-shoes-database.csv', out.map(r=>r.map(esc).join(',')).join('\n')+'\n');
console.log(tally);
