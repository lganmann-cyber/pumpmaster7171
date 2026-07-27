import { useEffect, useState } from 'react'
import { useApp } from '../store'
import type { HomeFace, ThemeName } from './types'
import { faceForTime, inNightShiftWindow, parseHM } from './time'

/**
 * The app clock. Ticks every 30s so the home face and Night Shift window
 * change under the user without a reload. The preview override in Settings
 * feeds the same clock, so faces, greetings and theme all move together.
 */
export function useNow(): Date {
  const override = useApp((s) => s.timeOverride)
  const [tick, setTick] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  if (override) {
    const d = new Date(tick)
    const mins = parseHM(override)
    d.setHours(Math.floor(mins / 60), mins % 60, 0, 0)
    return d
  }
  return new Date(tick)
}

function systemPrefersLight(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ?? false
}

export function useTheme(): ThemeName {
  const setting = useApp((s) => s.settings.theme)
  const now = useNow()
  const [systemLight, setSystemLight] = useState(systemPrefersLight)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const on = () => setSystemLight(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  if (setting !== 'auto') return setting
  if (inNightShiftWindow(now)) return 'nightshift'
  return systemLight ? 'light' : 'dark'
}

const THEME_COLOR: Record<ThemeName, string> = {
  dark: '#10131A',
  light: '#F7F6FB',
  nightshift: '#0A0705',
}

/** Writes the resolved theme onto <html> and keeps the browser chrome in step. */
export function useApplyTheme(): ThemeName {
  const theme = useTheme()
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[theme])
  }, [theme])
  return theme
}

export function useFace(): HomeFace {
  const now = useNow()
  const wakeTime = useApp((s) => s.settings.wakeTime)
  return faceForTime(now, wakeTime)
}
