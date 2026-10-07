export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/go/', '/status', '/new-models.csv'] }],
    sitemap: 'https://shoefinder.co.uk/sitemap.xml',
  };
}
