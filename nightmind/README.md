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

## The visual system

Rebuilt on the Apple Fitness design language (`DESIGN_1.md`) while keeping
NightMind's product, copy and structure.

- **True-black canvas.** `#000000`, with grouped surfaces at `#1C1C1E` /
  `#2C2C2E`. Depth comes from surface lightness, never a drop shadow.
- **Colour lives in the rings.** Large saturated cards are gone — that wall of
  purple slabs is what made every screen feel crammed. Colour now appears in
  the ring arcs, small tinted glyphs, and the one accent-filled CTA.
- **Three activity rings** are the hero and the product argument: Recall,
  Checks, Lessons. Each sits on a 22%-opacity track of its own colour, thick
  and round-capped, sweeping from 12 o'clock, staggered 80ms apart. Lucidity is
  deliberately not a ring — a user who has never had one can close all three.
- **Label-opacity ramp**, not gray hexes: `--ink` 100%, `--ink-muted` 60%,
  `--ink-faint` 30%, so text sits correctly on any surface.
- **SF Pro on Apple hardware, self-hosted Inter everywhere else**, following
  Apple's text styles. One family — numerals are tabular via
  `font-variant-numeric`, so there is no separate mono face.
- **Uppercase eyebrows** (`t-eyebrow`) for day labels, ring labels and badges.
  This is the one place the system departs from the original sentence-case
  rule; it is a type treatment, not a copy change.
- **Chrome stays calm**: tint-only active tab with no pill, system-fill
  segmented controls, 8/12/14/18/22pt radii.

Three themes: `dark` (default), `light`, `nightshift`. Night Shift keeps the
same grouped structure and collapses every hue to amber, kills the ring glow,
and reduces all motion to a 100ms opacity fade.

## Not in v1

No auth, backend, payments, paywall, push, real transcription (a 2s delay and
seeded text stands in), dream interpretation, social, or sharing.
