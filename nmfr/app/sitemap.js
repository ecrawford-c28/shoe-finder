import { GUIDES } from '../lib/guides';

export default function sitemap() {
  const base = 'https://shoefinder.co.uk';
  const routes = ['', '/how-it-works', '/privacy', '/terms', '/contact', '/guides'];
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
  return [...pages, ...guides];
}
