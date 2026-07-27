import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../../components/AppShell'
import { Icon } from '../../components/Icon'
import { PrimaryButton } from '../../components/PrimaryButton'
import { ScreenHeader } from '../../components/ScreenHeader'
import { toast } from '../../components/Toast'
import { useApp } from '../../store'
import { useTheme } from '../../lib/theme'
import { AMBER_FILTER, ART_DUSK } from '../../lib/art'
import { LESSONS, UNITS } from '../../data/seed'

/** A read, not a lesson player: image, meta row, body, then the steps. */
export function LessonDetail() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const amber = useTheme() === 'nightshift'
  const completeLesson = useApp((s) => s.completeLesson)
  const [saved, setSaved] = useState(false)

  const lesson = LESSONS.find((l) => l.id === lessonId)
  if (!lesson) return <Navigate to="/learn" replace />
  const unit = UNITS.find((u) => u.id === lesson.unitId)!
  const indexInUnit = unit.lessons.findIndex((l) => l.id === lesson.id)

  return (
    <AppShell>
      <ScreenHeader
        back
        eyebrow={unit.title}
        eyebrowTone="accent"
        title={lesson.title}
        trailing={saved ? 'bookmark' : 'bookmark'}
        onTrailing={() => {
          setSaved((s) => !s)
          toast(saved ? 'Removed from saved' : 'Saved to your reads')
        }}
      />

      <div className="card overflow-hidden">
        <img
          src={ART_DUSK}
          alt=""
          aria-hidden
          className="h-[150px] w-full object-cover"
          style={amber ? { filter: AMBER_FILTER } : undefined}
        />
        <div className="flex items-center gap-5 p-5">
          {[
            { icon: 'schedule' as const, value: `${lesson.minutes} min`, label: 'Read' },
            { icon: 'bedtime' as const, value: `Night ${lesson.night}`, label: 'Suggested' },
            { icon: 'insights' as const, value: lesson.level, label: 'Level' },
          ].map((t) => (
            <div key={t.label} className="flex min-w-0 flex-1 flex-col gap-1">
              <Icon name={t.icon} size={18} className="text-accent" />
              <span className="truncate t-label text-ink">{t.value}</span>
              <span className="t-meta text-muted">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="t-body text-body">{lesson.body}</p>

      <section className="flex flex-col gap-4">
        <h2 className="t-heading">What you do</h2>
        <ol className="flex flex-col gap-3">
          {lesson.steps.map((s, i) => (
            <li key={s.title} className="card flex items-start gap-4 p-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-tint t-meta font-bold text-accent">
                {i + 1}
              </span>
              <span>
                <span className="block t-label text-ink">{s.title}</span>
                <span className="mt-1 block t-body text-body">{s.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <PrimaryButton
        icon="check_circle"
        trailingIcon={null}
        onClick={() => {
          completeLesson(unit.id, indexInUnit)
          toast('Marked as read')
          navigate('/learn')
        }}
      >
        Mark as read
      </PrimaryButton>
    </AppShell>
  )
}
