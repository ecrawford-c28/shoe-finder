const fs = require('fs');
const M = {
'nike-pegasus-42':'nike-pegasus-42','nike-vomero-18':'nike-vomero-18','nike-vomero-plus':'nike-vomero-plus',
'nike-structure-26':'nike-structure-26','nike-zoom-fly-6':'nike-zoom-fly-6','nike-vaporfly-4':'nike-vaporfly-4',
'nike-alphafly-3':'nike-alphafly-3','nike-pegasus-trail-5':'nike-pegasus-trail-5','nike-wildhorse-10':'nike-wildhorse-10',
'asics-gel-nimbus-28':'asics-gel-nimbus-28','asics-gel-cumulus-28':'asics-gel-cumulus-28','asics-novablast-6':'asics-novablast-6',
'asics-gel-kayano-33':'asics-gel-kayano-33','asics-superblast-3':'asics-superblast-3','asics-magic-speed-5':'asics-magic-speed-5',
'asics-metaspeed-sky-tokyo':'asics-metaspeed-sky-tokyo','asics-gel-trabuco-14':'asics-trabuco-14',
'adidas-supernova-rise-3':'adidas-supernova-rise-3','adidas-supernova-solution-3':'adidas-supernova-solution-3',
'adidas-supernova-prima-3':'adidas-supernova-prima-3','adidas-adizero-evo-sl':'adidas-adizero-evo-sl',
'adidas-adizero-boston-13':'adidas-adizero-boston-13','adidas-adizero-adios-pro-4':'adidas-adizero-adios-pro-4',
'adidas-ultraboost-5':'adidas-ultraboost-5','adidas-terrex-agravic-speed-ultra-2':'adidas-terrex-agravic-speed-ultra-2',
'hoka-bondi-9':'hoka-bondi-9','hoka-mach-7':'hoka-mach-7','hoka-gaviota-6':'hoka-gaviota-6',
'hoka-cielo-x1-3-0':'hoka-cielo-x-1-3-0','hoka-speedgoat-7':'hoka-speedgoat-7','hoka-challenger-8':'hoka-challenger-8',
'brooks-ghost-18':'brooks-ghost-18','brooks-ghost-max-4':'brooks-ghost-max-4','brooks-glycerin-23':'brooks-glycerin-23',
'brooks-adrenaline-gts-25':'brooks-adrenaline-gts-25','brooks-launch-12':'brooks-launch-12',
'brooks-hyperion-max-4':'brooks-hyperion-max-4','brooks-cascadia-20':'brooks-cascadia-20',
'saucony-ride-19':'saucony-ride-19','saucony-guide-19':'saucony-guide-19','saucony-endorphin-speed-5':'saucony-endorphin-speed-5',
'saucony-endorphin-pro-5':'saucony-endorphin-pro-5','saucony-peregrine-16':'saucony-peregrine-16',
'saucony-xodus-ultra-4':'saucony-xodus-ultra-4',
'new-balance-fresh-foam-x-1080v15':'new-balance-1080-v-15','new-balance-fresh-foam-x-880v15':'new-balance-fresh-foam-x-880-v-15',
'new-balance-fresh-foam-x-860v15':'new-balance-fresh-foam-x-860-v-15','new-balance-fuelcell-rebel-v5':'new-balance-fuel-cell-rebel-v-5',
'new-balance-fresh-foam-x-more-v6':'new-balance-fresh-foam-x-more-v-6',
'new-balance-fuelcell-supercomp-trainer-v3':'new-balance-fuel-cell-super-comp-trainer-v-3',
'new-balance-fresh-foam-x-hierro-v9':'new-balance-fresh-foam-x-hierro-v9',
'on-cloudsurfer-2':'on-cloudsurfer-2','on-cloudmonster-3':'on-cloudmonster-3','on-cloudrunner-3':'on-cloudrunner-3',
'puma-deviate-nitro-4':'puma-deviate-nitro-4','puma-magmax-nitro-2':'puma-mag-max-nitro-2',
'puma-fast-r-nitro-elite-3':'puma-fast-r-nitro-elite-3',
'mizuno-wave-inspire-22':'mizuno-wave-inspire-22','mizuno-wave-sky-9':'mizuno-wave-sky-9','mizuno-neo-vista-3':'mizuno-neo-vista-3',
'altra-experience-flow-3':'altra-experience-flow-3',
'salomon-speedcross-6':'salomon-speedcross-6','salomon-ultra-glide-4':'salomon-ultra-glide-4',
'topo-athletic-ultrafly-6':'topo-ultrafly-6','topo-athletic-atmos-2':'topo-atmos-2',
};
const parse = t => { const rows=[];let r=[],f='',q=false;for(let i=0;i<t.length;i++){const c=t[i];
  if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
  else if(c==='"')q=true;else if(c===','){r.push(f);f=''}else if(c==='\n'){r.push(f);rows.push(r);r=[];f=''}
  else if(c==='\r'){}else f+=c}
  if(f.length||r.length){r.push(f);rows.push(r)}return rows.filter(x=>x.some(c=>c.trim()!==''))};
const esc = v => /[",\n]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v;
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

const rows = parse(fs.readFileSync('running-shoes-database.csv','utf8'));
const oldHead = rows[0].slice();
const head = oldHead.slice();
if (!head.includes('review_url')) head.splice(head.indexOf('one_liner'), 0, 'review_url');
const I = Object.fromEntries(head.map((h,i)=>[h,i]));
const out=[head]; let linked=0, none=[];

for (const raw of rows.slice(1)) {
  const r = new Array(head.length).fill('');
  // map by NAME from the old header so nothing shifts
  oldHead.forEach((h,i) => { r[I[h]] = raw[i] ?? ''; });
  const id = slug(`${r[I.brand]} ${r[I.model]}`);
  if (M[id]) { r[I.review_url] = 'https://runrepeat.com/uk/' + M[id]; linked++; }
  else none.push(id);
  out.push(r);
}
fs.writeFileSync('running-shoes-database.csv', out.map(r=>r.map(esc).join(',')).join('\n')+'\n');
console.log('linked', linked, 'of', out.length-1);
console.log('no review page:', none.join(', '));
