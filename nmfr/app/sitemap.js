import { GUIDES } from '../lib/guides';
import { livePairSlugs } from '../lib/compare';
import { getShoes } from '../lib/shoes';
import { allDealSlugs } from '../lib/deals';

export default async function sitemap() {
  const { shoes } = await getShoes();
  const base = 'https://shoefinder.co.uk';
  const routes = ['', '/how-it-works', '/nmfr-choice', '/privacy', '/terms', '/contact', '/guides', '/compare', '/deals'];
  const pages = routes.map(path => ({
    url: `${base}${path}`,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.5,
  }));
  const guides = GUIDES.map(g => ({
    url: `${base}/guides/${g.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  const compares = livePairSlugs(shoes).map(slug => ({
    url: `${base}/compare/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
  // Prices move daily, so the deals pages are the most volatile thing on the
  // site and say so.
  const deals = allDealSlugs().map(slug => ({
    url: `${base}/deals/${slug}`,
    changeFrequency: 'daily',
    priority: 0.6,
  }));
  return [...pages, ...guides, ...compares, ...deals];
}
