import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useApp } from './store'
import { useApplyTheme } from './lib/theme'
import { Tonight } from './screens/Tonight'
import { Journal } from './screens/Journal'
import { Path } from './screens/Path'
import { LessonDetail } from './screens/Path/LessonDetail'
import { Signs } from './screens/Signs'
import { Profile } from './screens/Profile'
import { Onboarding } from './screens/Onboarding'
import { SessionPlayer } from './screens/SessionPlayer'
import { ToastHost } from './components/Toast'

export function App() {
  useApplyTheme()

  const onboardedAt = useApp((s) => s.onboardedAt)
  const dreams = useApp((s) => s.dreams)
  const recompute = useApp((s) => s.recomputeProgress)
  const activeSessionId = useApp((s) => s.activeSessionId)
  const { pathname } = useLocation()

  // Streak, tier and longest-run are derived from captures — never from lucidity.
  useEffect(() => {
    recompute(dreams)
  }, [dreams, recompute])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (!onboardedAt) return <Onboarding />

  return (
    <>
      <Routes>
        <Route path="/" element={<Tonight />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/path" element={<Path />} />
        <Route path="/path/:lessonId" element={<LessonDetail />} />
        <Route path="/signs" element={<Signs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Tonight />} />
      </Routes>

      <AnimatePresence>{activeSessionId ? <SessionPlayer /> : null}</AnimatePresence>
      <ToastHost />
    </>
  )
}
