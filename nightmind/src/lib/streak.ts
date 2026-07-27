import type { Dream } from './types'
import { addDays, dayKey, daysBetween } from './time'

/**
 * §7 streak rule — a day counts if the user captured *anything*, including
 * "I don't remember anything" (an entry with an empty transcript). Recall
 * quality never gates the streak; lucidity never touches it.
 */
export function captureDays(dreams: Dream[]): Set<string> {
  return new Set(dreams.map((d) => dayKey(d.wokeAt)))
}

/** A dream the user actually remembered — an empty transcript is a valid
 *  capture but not a recall, so it holds the streak without inflating the chart. */
export function isRecall(d: Dream): boolean {
  return d.transcript.trim().length > 0
}

export function currentStreak(dreams: Dream[], now = new Date()): number {
  const days = captureDays(dreams)
  if (days.size === 0) return 0
  // Today not captured yet is not a broken streak — yesterday still anchors it.
  let cursor = days.has(dayKey(now)) ? new Date(now) : addDays(now, -1)
  if (!days.has(dayKey(cursor))) return 0
  let n = 0
  while (days.has(dayKey(cursor))) {
    n += 1
    cursor = addDays(cursor, -1)
  }
  return n
}

export function longestStreak(dreams: Dream[]): number {
  const keys = [...captureDays(dreams)].sort()
  if (keys.length === 0) return 0
  let best = 1
  let run = 1
  for (let i = 1; i < keys.length; i += 1) {
    const gap = daysBetween(new Date(`${keys[i - 1]}T12:00:00`), new Date(`${keys[i]}T12:00:00`))
    run = gap === 1 ? run + 1 : 1
    if (run > best) best = run
  }
  return best
}

export function lastCaptureDate(dreams: Dream[]): string {
  const keys = [...captureDays(dreams)].sort()
  return keys[keys.length - 1] ?? ''
}
