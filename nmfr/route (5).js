import { getShoes, buyUrl } from '../../lib/shoes';

export const revalidate = 300;

// Small ops endpoint so it is obvious whether the live site is reading the
// Google Sheet or falling back to the copy bundled into the build, and how many
// buy links are actually earning.
export async function GET() {
  const { shoes, source } = await getShoes();

  const count = (arr, key) =>
    arr.reduce((acc, s) => {
      const k = key(s) || 'unknown';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

  const tracked = shoes.filter(s => {
    const url = buyUrl(s);
    return (
      url.includes('awin1.com') ||
      url.includes('webgains') ||
      url.includes('prf.hn') ||
      url.includes('/discount/') ||
      !!s.affiliate_url
    );
  });

  return Response.json({
    source,
    shoeCount: shoes.length,
    brands: [...new Set(shoes.map(s => s.brand))].sort(),
    retailers: count(shoes, s => s.retailer),
    trackedLinks: tracked.length,
    untrackedLinks: shoes.length - tracked.length,
    withAwinId: shoes.filter(s => s.awin_mid).length,
    withWebgainsId: shoes.filter(s => s.wg_programid).length,
    withDiscountCode: shoes.filter(s => s.discount_code).length,
    withPartnerizeCamref: shoes.filter(s => s.partnerize_camref).length,
    webgainsCampaignSet: Boolean(process.env.WEBGAINS_CAMPAIGN_ID),
  });
}
