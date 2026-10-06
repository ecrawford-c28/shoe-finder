// The NMFR Choice badge, used on the quiz result cards and on the deals cards.
//
// A link rather than a tooltip on purpose. The claim it makes, that Ed has
// actually run in the shoe and rates it, is only worth anything if someone can
// go and read what it means and see that it was not paid for. A hover title
// would also be invisible on a phone, which is where most of these pages are
// read.
//
// No hooks and no state, so it works inside either client component without
// either of them having to own it.
export default function ChoiceBadge({ className = '' }) {
  return (
    <a
      className={`choice${className ? ` ${className}` : ''}`}
      href="/nmfr-choice"
      title="Tested and rated by Not Made For Running. Not paid for."
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <circle cx="8" cy="8" r="7" />
        <path d="M4.8 8.3l2.1 2.1 4.3-4.6" />
      </svg>
      NMFR Choice
    </a>
  );
}
