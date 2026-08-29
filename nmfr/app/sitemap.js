import { GUIDES } from '../lib/guides';
import { ALL_PAIR_SLUGS } from '../lib/compare';

export default function sitemap() {
  const base = 'https://shoefinder.co.uk';
  const routes = ['', '/how-it-works', '/privacy', '/terms', '/contact', '/guides', '/compare'];
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
  const compares = ALL_PAIR_SLUGS.map(slug => ({
    url: `${base}/compare/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
  return [...pages, ...guides, ...compares];
}
