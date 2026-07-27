import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createDreamsSlice, type DreamsSlice } from './dreams'
import { createProgressSlice, type ProgressSlice } from './progress'
import { createSettingsSlice, type SettingsSlice } from './settings'
import { createSessionSlice, type SessionSlice } from './session'

export type AppState = DreamsSlice & ProgressSlice & SettingsSlice & SessionSlice

/**
 * One store, four slices. Every mutation is local; swapping a real API in later
 * means replacing the slice bodies, not the call sites.
 */
export const useApp = create<AppState>()(
  persist(
    (...a) => ({
      ...createDreamsSlice(...a),
      ...createProgressSlice(...a),
      ...createSettingsSlice(...a),
      ...createSessionSlice(...a),
    }),
    {
      name: 'nightmind:v1',
      version: 1,
      partialize: (s) => ({
        dreams: s.dreams,
        signCatalogue: s.signCatalogue,
        progress: s.progress,
        checkDayKey: s.checkDayKey,
        settings: s.settings,
        name: s.name,
        onboardedAt: s.onboardedAt,
        sleepTimerMin: s.sleepTimerMin,
      }),
      onRehydrateStorage: () => (state) => {
        state?.recomputeProgress(state.dreams)
      },
    },
  ),
)

// First boot (nothing persisted yet) still needs derived progress.
useApp.getState().recomputeProgress(useApp.getState().dreams)

export const useDreams = () => useApp((s) => s.dreams)
export const useProgress = () => useApp((s) => s.progress)
export const useSettings = () => useApp((s) => s.settings)
