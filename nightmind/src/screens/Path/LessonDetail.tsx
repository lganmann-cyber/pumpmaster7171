import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Clock,
  Gauge,
  Moon,
  Share2,
} from 'lucide-react'
import { Badge } from '../../components/Badge'
import { IconButton } from '../../components/IconButton'
import { MetricTile } from '../../components/MetricTile'
import { PrimaryButton } from '../../components/PrimaryButton'
import { Sheet } from '../../components/Sheet'
import { toast } from '../../components/Toast'
import { useApp } from '../../store'
import { useTheme } from '../../lib/theme'
import { useMotionProfile } from '../../lib/motion'
import { LESSONS, UNITS } from '../../data/seed'

export function LessonDetail() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const m = useMotionProfile()
  const completeLesson = useApp((s) => s.completeLesson)
  const [bookmarked, setBookmarked] = useState(false)

  const lesson = LESSONS.find((l) => l.id === lessonId)
  if (!lesson) return <Navigate to="/path" replace />
  const unit = UNITS.find((u) => u.id === lesson.unitId)!
  const indexInUnit = unit.lessons.findIndex((l) => l.id === lesson.id)

  return (
    <div className="min-h-dvh bg-canvas md:pl-[88px] xl:pl-[240px]">
      {/* Header colour runs behind the status bar; the sheet sits over it. */}
      <div
        className="relative"
        style={{
          background:
            theme === 'nightshift'
              ? 'linear-gradient(160deg, #3a2412 0%, #14100c 70%)'
              : 'linear-gradient(160deg, #5c2a6b 0%, #2b1b4d 45%, var(--bg-canvas) 100%)',
        }}
      >
        <div
          className="mx-auto w-full max-w-[720px] px-5 pb-12 md:px-8"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}
        >
          <div className="flex items-center justify-between gap-3">
            <IconButton icon={ArrowLeft} label="Back" tone="onColor" onClick={() => navigate(-1)} />
            <span className="t-eyebrow text-white/90">{unit.title}</span>
            <IconButton
              icon={Share2}
              label="Share"
              tone="onColor"
              onClick={() => toast('Sharing is off in this build')}
            />
          </div>

          <div className="mt-6 flex flex-col items-center text-center">
            {theme !== 'nightshift' ? (
              <motion.span
                initial={m.full ? { opacity: 0, scale: 0.9 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={m.t(320)}
                className="grid size-[104px] place-items-center rounded-full text-white"
                style={{
                  background:
                    'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.34), rgba(255,255,255,0.06) 70%)',
                }}
              >
                <Moon size={52} strokeWidth={1.4} aria-hidden />
              </motion.span>
            ) : null}

            <Badge variant="translucent" className="mt-4">
              Night {lesson.night}
            </Badge>
            <h1 className="mt-3 max-w-[18ch] t-headline text-white">{lesson.title}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[720px]">
        <Sheet className="pb-40">
          <div className="flex gap-3">
            <MetricTile icon={Clock} stat={`${lesson.minutes} min`} label="Length" hue="purple" mono />
            <MetricTile icon={Moon} stat={`Night ${lesson.night}`} label="Suggested" hue="blue" mono />
            <MetricTile icon={Gauge} stat={lesson.level} label="Level" hue="orange" />
          </div>

          <p className="mt-6 t-body text-ink">{lesson.body}</p>

          <h2 className="mt-7 t-label font-semibold text-muted">What you do</h2>
          <ol className="mt-3 flex flex-col gap-2">
            {lesson.steps.map((s, i) => (
              <li key={s.title} className="flex items-start gap-3 rounded-tile bg-sunken p-4">
                <span className="mono grid size-8 shrink-0 place-items-center rounded-chip bg-purple-tint t-meta font-medium text-purple-bright">
                  {i + 1}
                </span>
                <span>
                  <span className="block t-body font-semibold text-ink">{s.title}</span>
                  <span className="mt-1 block t-meta text-muted">{s.detail}</span>
                </span>
              </li>
            ))}
          </ol>

          <h2 className="mt-7 t-label font-semibold text-muted">Next in {unit.title.toLowerCase()}</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {unit.lessons.slice(indexInUnit + 1, indexInUnit + 3).map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/path/${l.id}`)}
                  className="flex w-full items-center gap-3 rounded-tile bg-sunken p-4 text-left"
                >
                  <BookOpen size={18} className="text-muted" aria-hidden />
                  <span className="t-body text-ink">{l.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </Sheet>
      </div>

      {/* Floating action bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 bg-linear-to-t from-canvas from-60% to-transparent pt-10 md:pl-[88px] xl:pl-[240px]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
      >
        <div className="mx-auto flex w-full max-w-[720px] items-center gap-3 px-5 md:px-8">
          <IconButton
            icon={Bookmark}
            label={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
            size={56}
            onClick={() => {
              setBookmarked((b) => !b)
              toast(bookmarked ? 'Bookmark removed' : 'Lesson bookmarked')
            }}
            className={bookmarked ? 'text-purple-bright' : undefined}
          />
          <PrimaryButton
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
