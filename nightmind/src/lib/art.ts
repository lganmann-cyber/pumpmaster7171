/**
 * The dreamscape field behind the hero card. The reference uses a hosted
 * photograph; this is a self-contained SVG so the card renders offline and in
 * every theme. Deep violet nebula, drifting particles, obsidian monoliths.
 */
function field(hueA: string, hueB: string, seedShapes: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="neb" cx="30%" cy="25%" r="85%">
      <stop offset="0%" stop-color="${hueA}"/>
      <stop offset="55%" stop-color="${hueB}"/>
      <stop offset="100%" stop-color="#07060f"/>
    </radialGradient>
    <radialGradient id="moon" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#ffffff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="260" fill="url(#neb)"/>
  <circle cx="322" cy="58" r="34" fill="url(#moon)"/>
  <circle cx="322" cy="58" r="19" fill="#f4ecff" fill-opacity="0.85"/>
  ${seedShapes}
  <g fill="#ffffff" fill-opacity="0.5">
    <circle cx="52" cy="44" r="1.2"/><circle cx="118" cy="26" r="0.9"/><circle cx="176" cy="72" r="1.1"/>
    <circle cx="248" cy="34" r="0.8"/><circle cx="362" cy="122" r="1"/><circle cx="86" cy="132" r="0.9"/>
    <circle cx="292" cy="168" r="1.1"/><circle cx="146" cy="196" r="0.8"/><circle cx="212" cy="118" r="0.9"/>
  </g>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' '))}`
}

const MONOLITHS = `
  <g fill="#0d0a1a" fill-opacity="0.85">
    <path d="M96 260 L96 150 L108 138 L120 150 L120 260 Z"/>
    <path d="M150 260 L150 186 L160 176 L170 186 L170 260 Z"/>
    <path d="M214 260 L214 122 L226 108 L238 122 L238 260 Z"/>
    <path d="M286 260 L286 168 L296 158 L306 168 L306 260 Z"/>
    <path d="M40 260 L40 200 L50 192 L60 200 L60 260 Z"/>
  </g>
  <g stroke="#c9a2f0" stroke-opacity="0.35" stroke-width="1" fill="none">
    <path d="M0 236 Q120 214 400 232"/>
    <path d="M0 250 Q160 232 400 246"/>
  </g>`

export const DREAM_ART = field('#7a4bb8', '#2b1b4d', MONOLITHS)
export const AMBER_ART = field('#8a5320', '#33200c', MONOLITHS)
