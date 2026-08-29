export const metadata = {
  title: 'Terms of use',
  description:
    'The terms for using the Shoe Finder running shoe recommendation tool, including what it is not, and how the affiliate links work.',
  alternates: { canonical: '/terms' },
};

export default function Terms() {
  return (
    <main className="prose">
      <h1>Terms of use</h1>

      <h2>What this site is</h2>
      <p>
        A free tool that suggests running shoes based on the answers you give. It is run by Not Made
        For Running and is not affiliated with, endorsed by, or operated by any shoe brand or
        retailer.
      </p>

      <h2>What it is not</h2>
      <p>
        It is not medical advice, and it is not a substitute for a gait analysis or a proper fitting.
        Feet are individual. If you are in pain, coming back from an injury, or have a diagnosed foot
        condition, speak to a physio or podiatrist before changing what you run in.
      </p>

      <h2>Accuracy</h2>
      <p>
        Specifications, prices and availability come from retailers and manufacturers and are updated
        weekly. They change without notice, and mistakes happen. Always check the current price and
        the fit on the retailer&apos;s own page before buying.
      </p>

      <h2>Affiliate links</h2>
      <p>
        Buy buttons are affiliate links, marked as advertising on the results page. We may earn a
        commission on purchases made through them at no extra cost to you. Commission rates play no
        part in the recommendation logic.
      </p>

      <h2>Liability</h2>
      <p>
        Recommendations are given in good faith. We cannot accept liability for injury, discomfort or
        disappointment arising from a shoe you bought after using this tool. Buy from retailers with a
        returns policy and use it if the shoe is not right.
      </p>

      <h2>Contact</h2>
      <p>
        See the <a href="/contact">contact page</a>, or message the Not Made For Running account on
        Instagram.
      </p>
    </main>
  );
}
