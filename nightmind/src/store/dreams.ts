import type { StateCreator } from 'zustand'
import type { Dream, DreamSign } from '../lib/types'
import { SEED_DREAMS, SIGN_CATALOGUE } from '../data/seed'

export type DreamsSlice = {
  dreams: Dream[]
  signCatalogue: DreamSign[]
  addDream: (input: Partial<Dream> & { transcript: string }) => string
  updateDream: (id: string, patch: Partial<Dream>) => void
  deleteDream: (id: string) => void
  addSign: (label: string) => string
}

const uid = () => `d_${Math.random().toString(36).slice(2, 10)}`

export const createDreamsSlice: StateCreator<DreamsSlice, [], [], DreamsSlice> = (set, get) => ({
  dreams: SEED_DREAMS,
  signCatalogue: SIGN_CATALOGUE,

  addDream: (input) => {
    const now = new Date().toISOString()
    const dream: Dream = {
      id: uid(),
      createdAt: now,
      wokeAt: input.wokeAt ?? now,
      transcript: input.transcript,
      audioUrl: input.audioUrl,
      signs: input.signs ?? [],
      people: input.people ?? [],
      places: input.places ?? [],
      wasLucid: input.wasLucid ?? false,
      lucidDuration: input.lucidDuration,
      clarity: input.clarity ?? 3,
    }
    set({ dreams: [dream, ...get().dreams] })
    return dream.id
  },

  updateDream: (id, patch) =>
    set({ dreams: get().dreams.map((d) => (d.id === id ? { ...d, ...patch } : d)) }),

  deleteDream: (id) => set({ dreams: get().dreams.filter((d) => d.id !== id) }),

  addSign: (label) => {
    const trimmed = label.trim()
    const existing = get().signCatalogue.find(
      (s) => s.label.toLowerCase() === trimmed.toLowerCase(),
    )
    if (existing) return existing.id
    const id = `s_${trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    set({
      signCatalogue: [
        ...get().signCatalogue,
        { id, label: trimmed, count: 0, firstSeen: new Date().toISOString() },
      ],
    })
    return id
  },
})
