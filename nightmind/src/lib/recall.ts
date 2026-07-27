import type { Dream } from './types'
import { isRecall } from './streak'
import { addDays, dayKey, startOfDay } from './time'

export type RecallPoint = { key: string; label: string; value: number; date: Date }
export type Period = 'week' | 'month' | 'year'

const DAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/** Dreams recalled per day. Y is recall — never lucidity (§5.5). */
export function dailyCounts(dreams: Dream[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const d of dreams) {
    if (!isRecall(d)) continue
    const k = dayKey(d.wokeAt)
    m.set(k, (m.get(k) ?? 0) + 1)
  }
  return m
}

/** The 7 pill bars: last seven days, oldest → today. */
export function lastSevenDays(dreams: Dream[], now = new Date()): RecallPoint[] {
  const counts = dailyCounts(dreams)
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfDay(now), i - 6)
    const key = dayKey(date)
    return { key, label: DAY_INITIALS[date.getDay()], value: counts.get(key) ?? 0, date }
  })
}

export function series(dreams: Dream[], period: Period, now = new Date()): RecallPoint[] {
  if (period === 'week') return lastSevenDays(dreams, now)
  const counts = dailyCounts(dreams)

  if (period === 'month') {
    // Four weeks, bucketed. Same seven-bar grammar, wider windows.
    return Array.from({ length: 7 }, (_, i) => {
      const end = addDays(startOfDay(now), (i - 6) * 4 + 3)
      let value = 0
      for (let k = 0; k < 4; k += 1) value += counts.get(dayKey(addDays(end, -k))) ?? 0
      return { key: dayKey(end), label: `${i * 4 - 24}`.replace('-0', '0'), value, date: end }
    })
  }

  return Array.from({ length: 7 }, (_, i) => {
    const end = addDays(startOfDay(now), (i - 6) * 30 + 29)
    let value = 0
    for (let k = 0; k < 30; k += 1) value += counts.get(dayKey(addDays(end, -k))) ?? 0
    return { key: dayKey(end), label: `${end.getMonth() + 1}`, value, date: end }
  })
}

/** 7-day rolling average of dreams recalled → recall tier 1–5. */
export function recallTier(dreams: Dream[], now = new Date()): 1 | 2 | 3 | 4 | 5 {
  const week = lastSevenDays(dreams, now)
  const avg = week.reduce((a, p) => a + p.value, 0) / 7
  if (avg < 0.35) return 1
  if (avg < 0.8) return 2
  if (avg < 1.6) return 3
  if (avg < 2.6) return 4
  return 5
}

export const TIER_LABEL: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Fragments',
  2: 'One a night',
  3: 'Steady recall',
  4: 'Multiple a night',
  5: 'Full nights',
}

/** Tier 1 → tier 5 is the ladder the whole product instruments. */
export function tierProgress(dreams: Dream[], now = new Date()): number {
  const week = lastSevenDays(dreams, now)
  const avg = week.reduce((a, p) => a + p.value, 0) / 7
  return Math.min(1, avg / 3)
}
