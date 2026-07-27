import type { HomeFace } from './types'

export const MINUTE = 60_000
export const DAY_MS = 86_400_000

/** Local calendar day key. All streak and grouping math runs on this, never UTC. */
export function dayKey(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS)
}

/** 'HH:MM' → minutes since midnight. */
export function parseHM(hm: string): number {
  const [h, m] = hm.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export function toHM(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440
  return `${`${Math.floor(m / 60)}`.padStart(2, '0')}:${`${m % 60}`.padStart(2, '0')}`
}

/** 3:40am — lowercase meridiem, no space. Always rendered in the mono face. */
export function formatClock(input: string | Date): string {
  let mins: number
  if (typeof input === 'string') mins = parseHM(input)
  else mins = input.getHours() * 60 + input.getMinutes()
  const h24 = Math.floor(mins / 60)
  const m = mins % 60
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h}:${`${m}`.padStart(2, '0')}${h24 < 12 ? 'am' : 'pm'}`
}

export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds))
  return `${Math.floor(s / 60)}:${`${s % 60}`.padStart(2, '0')}`
}

const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function shortDay(d: Date): string {
  return WEEKDAY[d.getDay()].slice(0, 3)
}

export function dayInitial(d: Date): string {
  return WEEKDAY[d.getDay()].slice(0, 1)
}

/** Sticky date headers: "Today", "Yesterday", then "Thursday 14 March". */
export function dateHeading(iso: string, now = new Date()): string {
  const d = new Date(iso)
  const delta = daysBetween(d, now)
  if (delta === 0) return 'Today'
  if (delta === 1) return 'Yesterday'
  if (delta < 7) return WEEKDAY[d.getDay()]
  return `${WEEKDAY[d.getDay()]} ${d.getDate()} ${MONTH[d.getMonth()]}`
}

export function longDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTH[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`
}

/**
 * §5.2 — the home screen's four faces.
 * morning: wake → 11am · day: 11am → 6pm · evening: 6pm → 11pm · night: 11pm → wake
 */
export function faceForTime(now: Date, wakeTime: string): HomeFace {
  const mins = now.getHours() * 60 + now.getMinutes()
  const wake = parseHM(wakeTime)
  if (mins >= 23 * 60 || mins < wake) return 'night'
  if (mins < 11 * 60) return 'morning'
  if (mins < 18 * 60) return 'day'
  return 'evening'
}

/** Night Shift auto-engages 1:30am–5:30am local. */
export function inNightShiftWindow(now: Date): boolean {
  const mins = now.getHours() * 60 + now.getMinutes()
  return mins >= 90 && mins < 330
}

/** A wake-back-to-bed alarm lands ~4h20m after sleep onset; we anchor off wake time. */
export function suggestWbtb(wakeTime: string): string {
  return toHM(parseHM(wakeTime) - 200)
}
