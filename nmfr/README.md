# shoefinder.co.uk

A free running shoe recommendation quiz. Next.js 15 App Router, deployed on Vercel.

## How it works

- Shoe data lives in a Google Sheet published as CSV. `lib/shoes.js` fetches it at
  runtime with a 5 minute cache and falls back to the bundled copy in `data/fallback.js`
  if the sheet is unreachable.
- `lib/match.js` holds the questions and the scoring. Questions can be conditional
  via `showIf(answers)`.
- `lib/guides.js` defines the guide pages, which are built from the same shoe data.
- `/go/[id]` is a server side 302 so affiliate URLs never appear in the page HTML.
- `/status` is a JSON health check showing where the data came from and how many
  links are tracked.

## Running locally

```
npm install
npm run dev
```

## Environment

No environment variables are required. Optional:

- `SHEET_CSV_URL` overrides the published Google Sheet URL.
- `PARTNERIZE_HOST` overrides the Partnerize tracking hostname (default `prf.hn`).

## Deploying

Pushing to the default branch deploys to production via the Vercel Git integration.

