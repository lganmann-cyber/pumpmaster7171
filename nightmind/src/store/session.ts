import type { StateCreator } from 'zustand'
import type { AudioSession } from '../lib/types'
import { SESSIONS } from '../data/seed'

export type SessionSlice = {
  sessions: AudioSession[]
  activeSessionId: string | null
  playing: boolean
  positionSec: number
  sleepTimerMin: number | null
  openSession: (id: string) => void
  closeSession: () => void
  togglePlay: () => void
  seek: (sec: number) => void
  tick: (sec: number) => void
  setSleepTimer: (min: number | null) => void
}

export const createSessionSlice: StateCreator<SessionSlice, [], [], SessionSlice> = (set, get) => ({
  sessions: SESSIONS,
  activeSessionId: null,
  playing: false,
  positionSec: 0,
  sleepTimerMin: null,

  openSession: (id) => set({ activeSessionId: id, positionSec: 0, playing: true }),
  closeSession: () => set({ activeSessionId: null, playing: false, positionSec: 0 }),
  togglePlay: () => set({ playing: !get().playing }),
  seek: (sec) => set({ positionSec: Math.max(0, sec) }),
  tick: (sec) => set({ positionSec: sec }),
  setSleepTimer: (min) => set({ sleepTimerMin: min }),
})
