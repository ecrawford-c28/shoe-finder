const fs = require('fs');
// query :: [image url, returned title, exactMatch?]
const R = {
'Nike Pegasus 42':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/NIKEMENSPEGASUS42BLACK1.png?v=1770200876',1],
'Nike Vomero 18':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/NikeMensVomero18BlackDarkSmoke1.png?v=1749460872',1],
'Nike Vomero Plus':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/NIKEMENSVOMEROPLUSTHUNDERBLUEOBSIDIAN1.png?v=1768817632',1],
'Nike Structure 26':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/NIKESTRUCTURE26WHITEMENS1.png?v=1771237632',1],
'Nike Zoom Fly 6':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/NIKEWOMENSZOOMFLY6SAIL1.png?v=1770112638',1],
'Nike Vaporfly 4':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/NIKEMENSVAPORFLY4NEXTMULTI1.png?v=1762522377',1],
'Nike Alphafly 3':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/NikemensAlphafly3Multi1.png?v=1762355128',1],
'Nike Pegasus Trail 5':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/1_540c15fd-7a6e-4c05-b2d6-a23510f181d7.png?v=1754916751',1],
'Asics Gel Nimbus 28':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/1_958e2913-a504-4f35-8d3a-841e97b71f94.png?v=1763979634',1],
'Asics Gel Cumulus 28':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/86829dde-ec95-4bd2-b3f5-63aafc3477a8.png?v=1767400491',1],
'Asics Novablast 6':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/1_e00dae13-4b14-4898-8f9a-4ecbd081d3f9.png?v=1781693820',1],
'Asics Gel Kayano 33':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_02ba12d2-ab11-43fe-824b-4bd1c1842760.png?v=1779696400',1],
'Asics GT-2000 15':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_21e8c111-8ed3-44a4-96b8-b2584d9dc32f.png?v=1785320412',1],
'Asics Superblast 3':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/aa_adef9550-4b04-4bb0-a49c-6ef7dbd0e05a.png?v=1777981628',1],
'Asics Magic Speed 5':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_1a251f89-3939-4d3c-bd38-497cfdff7744.png?v=1779708094',1],
'Asics Metaspeed Sky Tokyo':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/AsicsUnisexMetaspeedSkyTokyo.png?v=1771258699',1],
'Asics Trabuco 14':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_39747448-83f0-4d7a-be0a-3a4a1d750b32.png?v=1779695081',1],
'Adidas Supernova Rise 3':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/prima2.5.png?v=1760612052',1],
'Adidas Supernova Solution':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/adidassupernovasolution2aurora1.png?v=1774857132',0],
'Adidas Supernova Prima 3':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/adidasmenssupernovaprima31.png?v=1780316946',1],
'Adidas Adizero Evo SL':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/adidasevoslwovengrey1.png?v=1777458821',1],
'Adidas Adizero Boston 13':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1-Recovered-Recovered-Recovered_41fa8501-81d5-409c-8fed-584bc0887cd7.png?v=1767622681',1],
'Adidas Adizero Adios Pro 4':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/pro4.3.png?v=1760606105',1],
'Adidas Ultraboost 5':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/AdidasWomensUltraboost5-CoreBlack.png?v=1775830671',1],
'Adidas Terrex Agravic Speed Ultra 2':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-2_83215c42-660e-47b3-8635-ba65ac563060.png?v=1770984757',1],
'Hoka Clifton 11':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/1_4d3c3fdc-264d-44f2-aed7-2d807e573b8e.png?v=1780911677',1],
'Hoka Bondi 9':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/bondi9blackblack.png?v=1737385126',1],
'Hoka Mach 7':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-2_7b6731f8-f80b-4377-ba0a-9f45c49d2d8d.png?v=1769159819',1],
'Hoka Arahi':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-2_a4cc0a8d-0a44-4649-8731-bbdede00ee49.png?v=1768997831',0],
'Hoka Gaviota 6':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/birch.png?v=1766148596',1],
'Hoka Cielo X1 3.0':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/yuzuthymecielo.png?v=1769169064',1],
'Hoka Speedgoat 7':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_b34f8638-f924-480c-be13-b3416b59bbe3.png?v=1767604876',1],
'Hoka Challenger 8':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_a3ffbc64-7a46-4f20-9c17-d04d2474ba84.png?v=1772698927',1],
'Brooks Ghost 18':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-2_88f1d1a0-29f8-4fea-bf03-a939d4cdee53.png?v=1779195703',1],
'Brooks Ghost Max 4':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-2_e5eafbff-2cbe-4601-a3ce-186261c42f61.png?v=1780908525',1],
'Brooks Glycerin 23':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1-Recovered-Recovered-Recovered_2039043c-30f0-48af-8509-92647fd6da52.png?v=1767602256',1],
'Brooks Adrenaline GTS 25':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/AdrenalineGTS25-Sand_Coconut.png?v=1760627283',1],
'Brooks Hyperion Max':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/BROOKSMENSHYPERIONMAX3-FIREYCORAL1.png?v=1758189658',0],
'Brooks Hyperion Elite 6':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_bd7b2b9f-dcbd-4bdf-8302-867148c014e7.png?v=1767691705',0],
'Brooks Cascadia 20':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/1_ad3ca60f-6364-4d4f-aa1d-252788168f0b.png?v=1782141753',1],
'Saucony Ride 19':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_0e7a6d21-f3a1-4a4a-8a66-843249894f79.png?v=1779890160',1],
'Saucony Triumph 24':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_9d3382be-edbf-40ad-a27c-14658440ca15.png?v=1779266209',1],
'Saucony Guide 19':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/l_bb26d9a0-7f39-4fb2-996f-f54236737bd5.png?v=1772539371',1],
'Saucony Hurricane 26':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-2_168a4faf-d53c-47d7-821e-0c0ca56739ed.png?v=1785143198',1],
'Saucony Endorphin Speed 5':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/speed5_54799848-05a5-491e-943b-a7c3cebea81d.png?v=1767006835',1],
'Saucony Endorphin Pro 5':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-2_9cfffffe-1761-4d6b-adac-dffcb4dad157.png?v=1772542748',1],
'Saucony Peregrine 16':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_ef0f38d5-6fd1-4b9f-9386-bda6aa69c109.png?v=1779955067',1],
'Saucony Xodus Ultra 4':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/vizigold.png?v=1765450788',1],
'New Balance 1080':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_615cbf24-0638-4973-aa5f-381338c0d325.png?v=1768469388',1],
'New Balance 880':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/880_a4459bea-3704-40be-ae24-f03cae8adffd.png?v=1770462344',1],
'New Balance 860':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/860blue.png?v=1754690585',0],
'New Balance FuelCell Rebel V5':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/1_658bdcc8-903a-4d7e-8da5-97ae7eecb819.png?v=1785751510',1],
'New Balance Fresh Foam X More V6':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-2_32b26062-c060-463c-b13b-9c91c13af9f0.png?v=1768486373',1],
'New Balance SuperComp Elite V6':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/MRCEL6SQ.png?v=1786447639',1],
'New Balance SuperComp Trainer V3':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-2ll.png?v=1772552910',1],
'New Balance Hierro V9':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/NEWBALANCEMENSHIERROV9TEAL1.png?v=1768908299',1],
'On Cloudsurfer 2':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/cloudsurfer2white.png?v=1739547729',1],
'On Cloudmonster 3':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-2_9755f758-4c28-4168-b087-c4cbc84bd0cb.png?v=1774609187',1],
'On Cloudrunner 3':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_c640cd9f-cb87-4d81-bc00-ae4be007577b.png?v=1770220419',1],
'On Cloudboom Strike 2':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/1_7834f956-0dcc-431d-a38b-d27f3e684958.png?v=1784793780',1],
'Puma Velocity Nitro':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_86ee9f9f-2285-48d2-92a0-c9aeb2abae74.png?v=1782127996',0],
'Puma Deviate Nitro 4':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/DeviateNITROElite4-Puma.png?v=1769425811',0],
'Puma MagMax Nitro 2':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/PUMAMAGMAXNITRO21.png?v=1768908152',1],
'Puma ForeverRun Nitro 3':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_11b56f63-e7ab-49c1-8fd9-dd0438910379.png?v=1782733165',1],
'Puma Fast-R Nitro Elite 3':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-2_644c0b17-a3bf-4499-a136-068bcf8642e0.png?v=1771239150',1],
'Mizuno Wave Rider 30':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_1e515318-223a-46ac-9d97-a464b276de07.png?v=1781092191',1],
'Mizuno Wave Inspire 22':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-2_4ef906f5-b0f9-433a-b57f-8cf4017198cf.png?v=1781096711',1],
'Mizuno Wave Sky 9':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/J1GD2502-71.png?v=1763385939',1],
'Mizuno Neo Vista 3':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_f55b57a2-10a3-4984-8160-f7ce8ae40a56.png?v=1779198936',1],
'Altra Torin 9':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_438d17dd-c134-4108-867b-b734ecc21277.png?v=1783338551',1],
'Altra Experience Flow 3':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/ALTRAWOMENSEXPERIENCEFLOW3PURPLE1.png?v=1769426577',1],
'Altra Lone Peak 9':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/1_8ec2a7f2-746f-425f-868e-0b642140c670.png?v=1766161645',1],
'Salomon Speedcross 6':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/salomonmensspeedcross6black1.png?v=1780647786',1],
'Salomon Ultra Glide 4':['https://cdn.shopify.com/s/files/1/0274/5994/4471/files/Untitled-1_122c6acf-892d-4619-a11b-da1bc27c4899.png?v=1782826964',1],
};
// The three New Balance searches only work without the version suffix.
const RELINK = {
  'New Balance 1080 V15': 'New Balance 1080',
  'New Balance 880 V15': 'New Balance 880',
  'New Balance 860 V15': 'New Balance 860',
};

const parse = t => { const rows=[];let r=[],f='',q=false;for(let i=0;i<t.length;i++){const c=t[i];
  if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
  else if(c==='"')q=true;else if(c===','){r.push(f);f=''}else if(c==='\n'){r.push(f);rows.push(r);r=[];f=''}
  else if(c==='\r'){}else f+=c}
  if(f.length||r.length){r.push(f);rows.push(r)}return rows.filter(x=>x.some(c=>c.trim()!==''))};
const esc = v => /[",\n]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v;

const rows = parse(fs.readFileSync('running-shoes-database.csv','utf8'));
const head = rows[0];
const I = Object.fromEntries(head.map((h,i)=>[h,i]));
const out=[head]; const t={replaced:0, filled:0, keptExisting:0, stillNone:[], relinked:0};

for (const r of rows.slice(1)) {
  const url = r[I.retailer_url];
  if (url.includes('runnorthwest')) {
    let q = decodeURIComponent(url.split('q=')[1].replace(/\+/g,' '));
    if (RELINK[q]) { q = RELINK[q]; r[I.retailer_url] = url.split('q=')[0] + 'q=' + encodeURIComponent(q).replace(/%20/g,'+'); t.relinked++; }
    const hit = R[q];
    if (hit) {
      const [img, exact] = hit;
      const had = r[I.image_url].startsWith('http');
      if (exact) { r[I.image_url] = img; had ? t.replaced++ : t.filled++; }
      else if (!had) { r[I.image_url] = img; t.filled++; }
      else t.keptExisting++;
    }
  }
  if (!r[I.image_url].startsWith('http')) t.stillNone.push(`${r[I.brand]} ${r[I.model]}`);
  out.push(r);
}
fs.writeFileSync('running-shoes-database.csv', out.map(r=>r.map(esc).join(',')).join('\n')+'\n');
console.log(t);
