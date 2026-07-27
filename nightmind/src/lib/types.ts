export type LucidDuration = 'seconds' | 'under-a-minute' | 'minutes' | 'long'

export type Dream = {
  id: string
  createdAt: string // ISO
  wokeAt: string // ISO — separate from createdAt
  transcript: string
  audioUrl?: string
  signs: string[] // ids into DreamSign
  people: string[]
  places: string[]
  wasLucid: boolean
  lucidDuration?: LucidDuration
  clarity: 1 | 2 | 3 | 4 | 5
}

export type DreamSign = { id: string; label: string; count: number; firstSeen: string }

export type Progress = {
  recallStreak: number
  longestStreak: number
  lastCaptureDate: string
  recallTier: 1 | 2 | 3 | 4 | 5 // derived from 7-day rolling average
  unitProgress: Record<string, number>
  checksToday: number
  checkTarget: number
}

export type Category = 'general' | 'romance' | 'skills' | 'nightmares'
export type ThemeName = 'dark' | 'light' | 'nightshift'
export type ThemeSetting = ThemeName | 'auto'

export type Settings = {
  theme: ThemeSetting
  wakeTime: string // 'HH:MM'
  wbtbAlarm?: string // 'HH:MM'
  categories: Category[]
  ageVerified: boolean
  reducedMotion: boolean
}

export type Lesson = {
  id: string
  unitId: string
  title: string
  summary: string
  minutes: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  night: number
  steps: { title: string; detail: string }[]
  body: string
  category?: Category
}

export type Unit = {
  id: string
  index: number
  title: string
  blurb: string
  hue: 'purple' | 'blue' | 'orange'
  lessons: Lesson[]
}

export type AudioSession = {
  id: string
  title: string
  kind: 'Wind-down' | 'Wake-back-to-bed' | 'Intention' | 'Return to sleep'
  seconds: number
  description: string
}

export type HomeFace = 'morning' | 'day' | 'evening' | 'night'
