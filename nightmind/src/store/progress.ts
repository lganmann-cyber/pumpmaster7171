import type { StateCreator } from 'zustand'
import type { Dream, Progress } from '../lib/types'
import { currentStreak, lastCaptureDate, longestStreak } from '../lib/streak'
import { recallTier } from '../lib/recall'
import { dayKey } from '../lib/time'

export type ProgressSlice = {
  progress: Progress
  checkDayKey: string
  /** Recomputed from dreams after every mutation — recall and practice only.
   *  Lucidity is never an input here (§1.1). */
  recomputeProgress: (dreams: Dream[]) => void
  logRealityCheck: () => void
  completeLesson: (unitId: string, lessonIndex: number) => void
  setCheckTarget: (n: number) => void
  setRecallTier: (tier: 1 | 2 | 3 | 4 | 5) => void
}

export const emptyProgress: Progress = {
  recallStreak: 0,
  longestStreak: 0,
  lastCaptureDate: '',
  recallTier: 1,
  // Seeded to match the six weeks of captures in data/seed.ts.
  unitProgress: { recall: 5, signs: 3 },
  checksToday: 0,
  checkTarget: 5,
}

export const createProgressSlice: StateCreator<ProgressSlice, [], [], ProgressSlice> = (
  set,
  get,
) => ({
  progress: emptyProgress,
  checkDayKey: dayKey(new Date()),

  recomputeProgress: (dreams) => {
    const today = dayKey(new Date())
    const rolledOver = get().checkDayKey !== today
    set({
      checkDayKey: today,
      progress: {
        ...get().progress,
        recallStreak: currentStreak(dreams),
        longestStreak: Math.max(longestStreak(dreams), get().progress.longestStreak),
        lastCaptureDate: lastCaptureDate(dreams),
        recallTier: recallTier(dreams),
        checksToday: rolledOver ? 0 : get().progress.checksToday,
      },
    })
  },

  logRealityCheck: () =>
    set({
      progress: {
        ...get().progress,
        checksToday: Math.min(get().progress.checkTarget, get().progress.checksToday + 1),
      },
    }),

  completeLesson: (unitId, lessonIndex) => {
    const done = get().progress.unitProgress[unitId] ?? 0
    if (lessonIndex + 1 <= done) return
    set({
      progress: {
        ...get().progress,
        unitProgress: { ...get().progress.unitProgress, [unitId]: lessonIndex + 1 },
      },
    })
  },

  setCheckTarget: (n) => set({ progress: { ...get().progress, checkTarget: n } }),
  setRecallTier: (tier) => set({ progress: { ...get().progress, recallTier: tier } }),
})
