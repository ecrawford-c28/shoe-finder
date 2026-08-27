export const metadata = {
  title: 'Privacy and cookies',
  description:
    'What the shoe finder does and does not collect. No email, no saved answers, and a plain list of the cookies that are set and why.',
  alternates: { canonical: '/privacy' },
};

export default function Privacy() {
  return (
    <main className="prose">
      <h1>Privacy and cookies</h1>
      <p>Short version: the shoe finder does not ask for your email and does not store your answers.</p>

      <h2>What we collect</h2>
      <p>
        Your quiz answers stay in your browser for the length of your visit and are used only to work
        out which shoes to show you. They are not sent to us, not saved to a database, and they
        disappear when you close the tab.
      </p>
      <p>
        We do not ask for your name, email address or phone number anywhere on this site.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        We count visits using Vercel Web Analytics. It records the page, where you came from, your
        country, and whether you are on a phone or a desktop. It sets no cookie, does not follow you
        to other sites and cannot identify you.
      </p>
      <p>
        We also use Google Analytics to understand how people find the site and how far through the
        questions they get. It sets cookies, named <code>_ga</code> and <code>_ga_VEM3TY9W03</code>,
        which last up to two years and hold a random identifier so Google can tell a returning
        visitor from a new one. It records the pages you view, roughly where in the world you are,
        and what device you are on. It does not know your name and we never upload anything about
        you to it.
      </p>
      <p>
        If you would rather not be counted, Google publish an opt out add on for browsers at{' '}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
          tools.google.com/dlpage/gaoptout
        </a>
        , and blocking third party scripts or clearing your cookies also works. The shoe finder
        behaves exactly the same either way, and you will never be asked to accept anything to use
        this site.
      </p>

      <h2>Affiliate links and discount codes</h2>
      <p>
        The Buy buttons are paid links. Some go through an affiliate network. Some carry a discount
        code that is applied for you when you arrive at the shop, which is how the retailer knows the
        sale came from here.
      </p>
      <p>
        If you buy something we may earn a commission. Where a discount code is shown it lowers the
        price you pay rather than raising it. Neither affects which shoes are recommended to you. The
        recommendations come from the answers you give and the shoe database, nothing else.
      </p>

      <h2>Your rights</h2>
      <p>
        Because we do not store personal data from the quiz, there is nothing for us to look up,
        correct or delete. If you have a question about any of this, get in touch through Instagram.
      </p>

      <h2>Changes</h2>
      <p>If this policy changes, the updated version will appear on this page.</p>
    </main>
  );
}
