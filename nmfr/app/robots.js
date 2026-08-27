export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/go/', '/status'] }],
    sitemap: 'https://shoefinder.co.uk/sitemap.xml',
  };
}
