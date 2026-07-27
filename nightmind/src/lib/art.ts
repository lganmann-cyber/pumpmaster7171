/**
 * Soft flat illustrations in the reference's palette — dusk coral, lilac,
 * cream. Authored as inline SVG data URIs so they render offline and never
 * depend on a CDN.
 */

const uri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`

const SKY = '#F6C6A8'
const SUN = '#E8836A'
const DEEP = '#6B5B95'
const LILAC = '#A091C9'
const CREAM = '#FBEFE4'
const SAND = '#EFD9C6'

/** Dusk over still water with a lone figure — the "start here" image. */
export const ART_DUSK = uri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${SKY}"/><stop offset="70%" stop-color="${CREAM}"/>
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${LILAC}"/><stop offset="100%" stop-color="${DEEP}"/>
    </linearGradient>
  </defs>
  <rect width="320" height="180" fill="url(#sky)"/>
  <circle cx="160" cy="96" r="42" fill="${SUN}" opacity="0.9"/>
  <rect y="112" width="320" height="68" fill="url(#sea)"/>
  <g fill="${CREAM}" opacity="0.55">
    <rect x="34" y="126" width="70" height="3" rx="1.5"/>
    <rect x="196" y="140" width="92" height="3" rx="1.5"/>
    <rect x="60" y="150" width="120" height="3" rx="1.5"/>
  </g>
  <g fill="${DEEP}">
    <circle cx="160" cy="104" r="7"/>
    <path d="M153 113 h14 l4 30 h-22 z"/>
  </g>
</svg>`)

/** Stacked stones — balance. Plan and milestone surfaces. */
export const ART_STONES = uri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
  <rect width="320" height="180" fill="${CREAM}"/>
  <circle cx="234" cy="52" r="34" fill="${SKY}" opacity="0.8"/>
  <g fill="${DEEP}">
    <ellipse cx="120" cy="150" rx="52" ry="14"/>
    <ellipse cx="120" cy="126" rx="38" ry="12"/>
  </g>
  <g fill="${LILAC}">
    <ellipse cx="120" cy="105" rx="28" ry="10"/>
    <ellipse cx="120" cy="88" rx="19" ry="8"/>
  </g>
  <ellipse cx="120" cy="74" rx="11" ry="6" fill="${SUN}"/>
  <g fill="${SAND}" opacity="0.85">
    <ellipse cx="252" cy="152" rx="44" ry="10"/>
    <ellipse cx="252" cy="138" rx="30" ry="8"/>
  </g>
</svg>`)

/** A figure at rest under a night sky — capture and session surfaces. */
export const ART_REST = uri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="night" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${LILAC}"/><stop offset="100%" stop-color="${DEEP}"/>
    </linearGradient>
  </defs>
  <rect width="320" height="180" fill="url(#night)"/>
  <circle cx="248" cy="46" r="24" fill="${CREAM}" opacity="0.92"/>
  <circle cx="238" cy="40" r="20" fill="${LILAC}" opacity="0.95"/>
  <g fill="${CREAM}" opacity="0.7">
    <circle cx="60" cy="38" r="2"/><circle cx="104" cy="62" r="1.6"/><circle cx="150" cy="30" r="1.8"/>
    <circle cx="196" cy="86" r="1.4"/><circle cx="82" cy="98" r="1.5"/>
  </g>
  <path d="M0 138 q80 -26 160 -6 t160 -8 v56 H0 z" fill="${DEEP}" opacity="0.85"/>
  <g fill="${SUN}">
    <circle cx="126" cy="126" r="11"/>
    <path d="M112 140 q14 -8 28 0 l6 26 h-40 z"/>
  </g>
</svg>`)

/** Reading by a window — the Learn featured card. */
export const ART_READ = uri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
  <rect width="320" height="180" fill="${CREAM}"/>
  <rect x="188" y="16" width="112" height="120" rx="14" fill="${SKY}" opacity="0.55"/>
  <circle cx="244" cy="56" r="20" fill="${SUN}" opacity="0.85"/>
  <rect x="0" y="146" width="320" height="34" fill="${SAND}"/>
  <g fill="${DEEP}">
    <circle cx="104" cy="72" r="16"/>
    <path d="M80 96 q24 -14 48 0 l8 50 H72 z"/>
  </g>
  <rect x="74" y="118" width="60" height="22" rx="3" fill="${LILAC}"/>
</svg>`)

/** A quiet horizon — progress and milestones. */
export const ART_HORIZON = uri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="h" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${LILAC}"/><stop offset="100%" stop-color="${SKY}"/>
    </linearGradient>
  </defs>
  <rect width="320" height="180" fill="url(#h)"/>
  <circle cx="160" cy="120" r="52" fill="${SUN}" opacity="0.85"/>
  <path d="M0 132 q60 -30 120 -8 t120 -14 t80 12 v58 H0 z" fill="${DEEP}" opacity="0.9"/>
</svg>`)

/** Night Shift strips the blue channel out of every illustration. */
export const AMBER_FILTER = 'sepia(1) saturate(1.7) hue-rotate(-14deg) brightness(0.5)'
