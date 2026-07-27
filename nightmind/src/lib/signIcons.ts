import type { IconName } from './icons'

const MAP: Record<string, IconName> = {
  s_water: 'waves',
  s_teeth: 'psychology',
  's_old-house': 'bedtime',
  s_flying: 'bolt',
  s_late: 'schedule',
  s_phone: 'graphic_eq',
  s_stairs: 'insights',
  s_sam: 'psychology_alt',
  s_chased: 'bolt',
  s_school: 'book',
  s_cat: 'auto_awesome',
  s_mirror: 'auto_awesome',
  s_car: 'timer',
  s_lift: 'insights',
  s_sea: 'waves',
  s_lost: 'edit_note',
}

export function signIcon(id: string | undefined): IconName {
  return (id && MAP[id]) || 'bedtime'
}

const TONES = [
  'bg-primary-container/20 text-primary',
  'bg-secondary-container/20 text-secondary',
  'bg-tertiary-container/20 text-tertiary',
]

/** Tint tile behind the glyph, keyed off the sign so a sign keeps its colour. */
export function signTone(id: string | undefined): string {
  if (!id) return 'bg-primary-container/10 text-on-variant'
  let n = 0
  for (let i = 0; i < id.length; i += 1) n += id.charCodeAt(i)
  return TONES[n % TONES.length]
}
