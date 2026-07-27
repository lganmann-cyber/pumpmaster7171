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
  const fill = {
    purple: amber ? 'bg-purple-tint' : 'bg-purple',
    blue: amber ? 'bg-blue-tint' : 'bg-blue',
    orange: amber ? 'bg-orange-tint' : 'bg-orange',
  }[hue]
  return {
    amber,
    className: `${fill} ${amber ? 'text-ink' : 'text-on-fill'}`,
    /** Type that sits on the fill and must stay legible at label sizes. */
    onFill: amber ? 'text-ink' : 'text-on-fill',
    mutedOnFill: amber ? 'text-muted' : 'text-on-muted',
  }
}
