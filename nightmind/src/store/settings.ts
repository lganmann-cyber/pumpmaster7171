import type { StateCreator } from 'zustand'
import type { Category, Settings, ThemeSetting } from '../lib/types'
import { suggestWbtb } from '../lib/time'

export type SettingsSlice = {
  settings: Settings
  name: string
  onboardedAt: string | null
  /** Preview override for the four home faces — 'HH:MM' or null for real time. */
  timeOverride: string | null
  setName: (name: string) => void
  setTheme: (theme: ThemeSetting) => void
  setWakeTime: (hm: string) => void
  setWbtbAlarm: (hm: string | undefined) => void
  toggleCategory: (c: Category) => void
  setAgeVerified: (v: boolean) => void
  setReducedMotion: (v: boolean) => void
  setTimeOverride: (hm: string | null) => void
  completeOnboarding: () => void
  resetAll: () => void
}

export const defaultSettings: Settings = {
  theme: 'light',
  wakeTime: '07:00',
  wbtbAlarm: suggestWbtb('07:00'),
  categories: ['general'],
  ageVerified: false,
  reducedMotion: false,
}

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (
  set,
  get,
) => ({
  settings: defaultSettings,
  name: '',
  onboardedAt: null,
  timeOverride: null,

  setName: (name) => set({ name: name.trim() }),
  setTheme: (theme) => set({ settings: { ...get().settings, theme } }),
  setWakeTime: (wakeTime) =>
    set({ settings: { ...get().settings, wakeTime, wbtbAlarm: suggestWbtb(wakeTime) } }),
  setWbtbAlarm: (wbtbAlarm) => set({ settings: { ...get().settings, wbtbAlarm } }),

  toggleCategory: (c) => {
    const list = get().settings.categories
    const next = list.includes(c) ? list.filter((x) => x !== c) : [...list, c]
    set({ settings: { ...get().settings, categories: next } })
  },

  setAgeVerified: (ageVerified) => set({ settings: { ...get().settings, ageVerified } }),
  setReducedMotion: (reducedMotion) => set({ settings: { ...get().settings, reducedMotion } }),
  setTimeOverride: (timeOverride) => set({ timeOverride }),
  completeOnboarding: () => set({ onboardedAt: new Date().toISOString() }),
  resetAll: () =>
    set({ settings: defaultSettings, name: '', onboardedAt: null, timeOverride: null }),
})
