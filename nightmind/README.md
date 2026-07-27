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

Built to the supplied warm-cream reference.

- **Cream canvas** `#faf7f2` with a faint dot grid, **white cards** with a very
  soft lift — no hard borders anywhere.
- **One coral accent** `#e2604a` carries every primary action, the active tab
  and the eyebrows. Nothing else in the layout is saturated.
- **Pastel tint cards** — lilac, mint, peach, sky — for the practice grid.
- **Soft flat illustrations**, authored as inline SVG in `lib/art.ts`, so they
  render offline. Night Shift runs them through an amber filter.
- **One type family** across every step; numbers sit in it too, so there is no
  mono face. `t-display / t-title / t-heading / t-stat / t-body / t-label /
  t-meta / t-eyebrow` — eight steps, one job each.
- **Material Symbols Outlined**, self-hosted and subset to the 39 glyphs the
  app uses (~9KB), rendered by codepoint.

Light is the default, matching the reference. Dark keeps the warmth (a deep
aubergine rather than a neutral black) and **Night Shift** — amber only, no
blue channel — still auto-engages between 1:30am and 5:30am.

> The reference's exact typeface can't be recovered from a screenshot. The
> stack in `tokens.css` is the closest widely available match; it is one line
> to swap once the real name is known.

## Layout

Four tabs — **Home · Journal · Progress · Learn** — with profile behind the
header avatar.

- **Home** is a single focus: what to do right now as one illustrated card, one
  coral action under it, three stat tiles, then tonight's practice as pastel
  cards.
- **Journal** opens straight into capture, then the timeline grouped by day.
- **Progress** is the record: stat tiles, the next milestone, an eight-rung
  milestone grid, the recall chart, the recurring-sign field, the lucidity log.
- **Learn** is a library — search, a featured read, filter chips, then rows.

`node audit.mjs` drives every screen at five widths across all three themes and
reports overflow, overlap, clipping, touch targets and cramped spacing. It is
at zero.

## Not in v1

No auth, backend, payments, paywall, push, real transcription (a 2s delay and
seeded text stands in), dream interpretation, social, or sharing.
