export const metadata = {
  title: 'Contact',
  description: 'How to get in touch with Shoe Finder, the running shoe recommendation tool by Not Made For Running.',
  alternates: { canonical: '/contact' },
};

export default function Contact() {
  return (
    <main className="prose">
      <h1>Contact</h1>

      <p>
        Shoe Finder is run by Not Made For Running, a running channel on Instagram. It is a one
        person operation, so the quickest way to reach a human is a direct message.
      </p>

      <h2>Get in touch</h2>
      <p>
        Message{' '}
        <a href="https://www.instagram.com/notmadeforrunning/" target="_blank" rel="noopener noreferrer">
          @notmadeforrunning on Instagram
        </a>
        . Messages are usually answered within a couple of days.
      </p>

      <h2>What to get in touch about</h2>
      <ul>
        <li>A shoe that is missing, discontinued or listed with the wrong specification</li>
        <li>A recommendation that looks wrong for the answers given</li>
        <li>A broken link or something on the site that will not load</li>
        <li>Retailers and brands: partnership and affiliate enquiries</li>
        <li>Press and media enquiries</li>
      </ul>

      <h2>What we cannot help with</h2>
      <p>
        Orders, deliveries, returns and refunds are handled by the retailer you bought from, not by
        us. We do not sell shoes and we never take payment. We also cannot give injury or medical
        advice, so please see a physio or a GP for that.
      </p>

      <p>
        See also <a href="/how-it-works">how the recommendations work</a>, the{' '}
        <a href="/privacy">privacy notice</a> and the <a href="/terms">terms of use</a>.
      </p>
    </main>
  );
}
