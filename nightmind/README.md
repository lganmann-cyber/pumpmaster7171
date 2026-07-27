# NightMind

A responsive web prototype of a lucid dream training app. Dark by default,
because it gets used at 5am and at 3am.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build
npm run preview
```

No backend. State lives in `localStorage` under `nightmind:v1`, seeded with 47
dreams across six weeks. Clear that key to replay onboarding.

## How it's put together

```
src/
  tokens.css      single source of truth for colour, type, radius, space
  index.css       Tailwind v4 @theme mapping — every utility resolves to a token
  App.tsx         router + theme controller
  store/          zustand slices: dreams, progress, settings, session
  components/     the primitives, one per file
  screens/        Tonight, Journal, Path, Signs, SessionPlayer, Onboarding, Profile
  lib/            time, streak math, recall scoring, constellation layout, motion policy
  data/seed.ts    dreams, sign catalogue, lesson ladder, guided sessions
```

Mutations go through the store, so a real API can be dropped in behind the
slice bodies without touching a call site.

## The load-bearing rules

**Progression instruments recall, not lucidity.** `recallStreak`,
`recallTier` and `longestStreak` are all derived from captures in
`lib/streak.ts` and `lib/recall.ts`. Nothing in that path reads `wasLucid`.
A user who has never had a lucid dream can hit day 30 with a full streak.

**A day counts if the user captured anything.** An entry with an empty
transcript — the one-tap "I don't remember anything" — holds the streak but
does not count as a recall, so it never inflates the chart.

**Capture is the first thing on the Journal screen.** Tap the button and it
records. Tagging, people, places and the lucid toggle all happen after, on
review, and all of them are skippable.

**Three themes.** `dark` (default), `light`, `nightshift`. `auto` follows
`prefers-color-scheme` and switches to Night Shift between 1:30am and 5:30am.
Night Shift collapses every accent to amber, hides illustrations and reduces
all motion to a 100ms opacity fade.

## Deviations from the spec

Three, all deliberate, all reversible in one place:

1. **Type on saturated fills is deep ink, not white** (`--on-fill` in
   `tokens.css`). White measures 2.3:1 on `--purple` and 1.9:1 on `--orange`,
   which fails the §10 floor at any size. Set `--on-fill: #ffffff` to get the
   spec's white back.
2. **Night Shift uses tint fills for the large colour blocks** — feature card,
   stat cards, unit bands, lesson header (`lib/onColor.ts`). A full-bleed amber
   card is the brightest object in a dark room at 3am. Dark and light are
   untouched.
3. **The white pill CTA on a purple card takes `--pill-ink`**, not
   `--purple-bright`. On dark, `--purple-bright` on white is 2.3:1.

## Not in v1

No auth, backend, payments, paywall, push, real transcription (a 2s delay and
seeded text stands in), dream interpretation, social, or sharing.
