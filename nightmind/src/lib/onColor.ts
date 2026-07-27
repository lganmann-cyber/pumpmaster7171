import { useTheme } from './theme'

/**
 * §4.4 says Night Shift caps luminance and drops contrast one notch. A
 * full-bleed --purple card is the largest lit object on any screen, and in
 * amber it becomes the brightest thing in a dark room at 3am — which defeats
 * the mode. So in Night Shift only, saturated card fills fall back to their
 * tint and the type on them goes to --ink.
 *
 * Dark and light are untouched: the fill stays --purple with --ink-inverse type.
 */
export function useColorSurface(hue: 'purple' | 'blue' | 'orange' = 'purple') {
  const amber = useTheme() === 'nightshift'
  // Grouped surfaces in every theme. Colour arrives as a tinted glyph or a
  // ring, never as a full-bleed card.
  const fill = 'bg-surface'
  void hue
  return {
    amber,
    className: `${fill} text-ink`,
    /** Type that sits on the fill and must stay legible at label sizes. */
    onFill: 'text-ink',
    mutedOnFill: 'text-muted',
  }
}
