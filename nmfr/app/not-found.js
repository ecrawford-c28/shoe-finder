// Without this, a mistyped address fell through to Next's default 404, which is
// white on a dark site and reads as the site being broken rather than the link.
export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <main className="prose notfound">
      <h1>That page is not here.</h1>
      <p>The link may be old, or a size or guide may have been mistyped.</p>
      <div className="ctas">
        <a className="btn" href="/">Take the quiz</a>
        <a className="btn ghost" href="/deals">Deals by size</a>
      </div>
    </main>
  );
}
