import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import localFont from 'next/font/local';
import { DEFAULT_QUESTION_COUNT } from '../lib/match';

// The font files live in the repo (app/fonts, with their OFL licences) rather
// than coming from Google Fonts through next/font, which fetches at build time.
// That made every deploy, the nightly feed refresh included, depend on Google
// answering. These are the latin variable builds, the same subset as before.
//
// Archivo keeps its width axis because the wordmark is set extra wide, so the
// face declares the stretch range it covers.
const display = localFont({
  src: './fonts/Archivo-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  declarations: [{ prop: 'font-stretch', value: '62% 125%' }],
  variable: '--font-display',
  display: 'swap',
});
const body = localFont({
  src: './fonts/Geist-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-body',
  display: 'swap',
});
const mono = localFont({
  src: './fonts/GeistMono-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://shoefinder.co.uk'),
  title: {
    default: 'Shoe Finder | Which running shoes should you buy?',
    template: '%s | Shoe Finder',
  },
  description:
    'Answer a few quick questions and get three running shoes that actually suit your feet, your weight and the way you run. Free, no email, no jargon. Made by Not Made For Running.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Which running shoes should you buy?',
    description:
      `${DEFAULT_QUESTION_COUNT} quick questions. Three shoes that actually suit you, and the reasons why. Free tool from Not Made For Running.`,
    url: 'https://shoefinder.co.uk',
    siteName: 'Shoe Finder',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Which running shoes should you buy?',
    description: `${DEFAULT_QUESTION_COUNT} quick questions. Three shoes that actually suit you.`,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#0b0b0d',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Shoe Finder',
  url: 'https://shoefinder.co.uk',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description:
    `A free running shoe recommendation quiz. ${DEFAULT_QUESTION_COUNT} questions on fit, weight, pronation and purpose, then three matched shoes with the reasoning behind each one.`,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  author: { '@type': 'Organization', name: 'Not Made For Running' },
  inLanguage: 'en-GB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="wrap">
          <header className="masthead">
            <a href="/" className="home-link">
              <div className="logo">
                Shoe <span>Finder</span>
              </div>
              <div className="byline">by Not Made For Running</div>
            </a>
            <nav className="mainnav">
              <a href="/">Take the quiz</a>
              <a href="/deals">Deals</a>
              <a href="/guides">Guides</a>
              <a href="/how-it-works">How it works</a>
            </nav>
            <a
              className="ig"
              href="https://www.instagram.com/notmadeforrunning/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </header>
          {children}
          <footer className="footer">
            <a href="/">Shoe finder</a>
            <a href="/deals">Deals</a>
            <a href="/guides">Guides</a>
            <a href="/compare">Comparisons</a>
            <a href="/how-it-works">How it works</a>
            <a href="/nmfr-choice">NMFR Choice</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
            <span style={{ marginLeft: 'auto' }}>© Shoe Finder</span>
          </footer>
        </div>
        <Script
          id="ga4-src"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-VEM3TY9W03"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-VEM3TY9W03');`}
        </Script>
        <Analytics />
      </body>
    </html>
  );
}
