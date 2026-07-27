import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Icon } from '../../components/Icon'
import { PrimaryButton } from '../../components/PrimaryButton'
import { Sheet } from '../../components/Sheet'
import { toast } from '../../components/Toast'
import { useApp } from '../../store'
import { useMotionProfile } from '../../lib/motion'
import { useTheme } from '../../lib/theme'
import { AMBER_ART, DREAM_ART } from '../../lib/art'
import { LESSONS, UNITS } from '../../data/seed'

export function LessonDetail() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const m = useMotionProfile()
  const amber = useTheme() === 'nightshift'
  const completeLesson = useApp((s) => s.completeLesson)
  const [bookmarked, setBookmarked] = useState(false)

  const lesson = LESSONS.find((l) => l.id === lessonId)
  if (!lesson) return <Navigate to="/path" replace />
  const unit = UNITS.find((u) => u.id === lesson.unitId)!
  const indexInUnit = unit.lessons.findIndex((l) => l.id === lesson.id)

  return (
    <div className="min-h-dvh bg-background md:pl-[88px] xl:pl-[240px]">
      {/* Colour header — the sheet slides up over it */}
      <div className="relative bg-primary-container">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
          style={{ backgroundImage: `url("${amber ? AMBER_ART : DREAM_ART}")` }}
        />
        <div
          className="relative mx-auto w-full max-w-[720px] px-margin pb-lg md:px-lg"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}
        >
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              aria-label="Back"
              onClick={() => navigate(-1)}
              className="grid size-11 place-items-center rounded-full bg-black/20 text-on-primary-container"
            >
              <Icon name="arrow_back" size={24} />
            </button>
            <span className="t-label-caps text-on-primary-container uppercase">{unit.title}</span>
            <button
              type="button"
              aria-label="Share"
              onClick={() => toast('Sharing is off in this build')}
              className="grid size-11 place-items-center rounded-full bg-black/20 text-on-primary-container"
            >
              <Icon name="share" size={22} />
            </button>
          </div>

          <div className="mt-lg flex flex-col gap-xs">
            <span className="w-fit rounded-md bg-black/20 px-2 py-1 t-label-caps text-on-primary-container">
              NIGHT {`${lesson.night}`.padStart(2, '0')}
            </span>
            <h1 className="max-w-[300px] t-headline-lg text-on-primary-container">
              {lesson.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[720px]">
        <Sheet className="flex flex-col gap-md pb-40">
          <div className="grid grid-cols-3 gap-gutter">
            {[
              { icon: 'schedule' as const, stat: `${lesson.minutes} MIN`, label: 'Length' },
              { icon: 'bedtime' as const, stat: `NIGHT ${lesson.night}`, label: 'Suggested' },
              { icon: 'insights' as const, stat: lesson.level.toUpperCase(), label: 'Level' },
            ].map((t) => (
              <div key={t.label} className="card flex flex-col gap-2 rounded-xl p-4">
                <Icon name={t.icon} size={20} className="text-primary" />
                <span className="t-stats-sm text-on-surface">{t.stat}</span>
                <span className="t-label-caps text-on-variant uppercase">{t.label}</span>
              </div>
            ))}
          </div>

          <p className="t-body-md text-on-variant">{lesson.body}</p>

          <h2 className="t-label-caps tracking-widest text-on-variant uppercase">What you do</h2>
          <ol className="flex flex-col gap-xs">
            {lesson.steps.map((s, i) => (
              <li
                key={s.title}
                className="flex items-start gap-4 rounded-xl border border-outline-variant bg-low p-4"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/15 t-label-caps text-primary">
                  {`${i + 1}`.padStart(2, '0')}
                </span>
                <span>
                  <span className="block t-body-md font-bold text-on-surface">{s.title}</span>
                  <span className="mt-1 block t-body-md text-on-variant">{s.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </Sheet>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-background via-background to-transparent pt-lg md:pl-[88px] xl:pl-[240px]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
      >
        <div className="mx-auto flex w-full max-w-[720px] items-center gap-xs px-margin md:px-lg">
          <motion.button
            type="button"
            whileTap={m.press}
            transition={m.t(120)}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
            onClick={() => {
              setBookmarked((b) => !b)
              toast(bookmarked ? 'Bookmark removed' : 'Lesson bookmarked')
            }}
            className="grid size-[48px] min-h-[44px] shrink-0 place-items-center rounded-md border border-outline text-on-surface"
          >
            <Icon name="bookmark" size={22} fill={bookmarked} />
          </motion.button>
          <PrimaryButton
            icon="play_arrow"
            onClick={() => {
              completeLesson(unit.id, indexInUnit)
              toast('Lesson started')
            }}
          >
            Start lesson
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
