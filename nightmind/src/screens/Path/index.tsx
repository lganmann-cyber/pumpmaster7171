import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/AppShell'
import { DisplayHeadline } from '../../components/DisplayHeadline'
import { ListRow } from '../../components/ListRow'
import { useApp } from '../../store'
import { UNITS } from '../../data/seed'
import { cx } from '../../lib/cx'
import type { Lesson, Unit } from '../../lib/types'

const TONE = {
  purple: { bar: 'bg-primary', text: 'text-primary', tile: 'primary' },
  blue: { bar: 'bg-secondary', text: 'text-secondary', tile: 'secondary' },
  orange: { bar: 'bg-tertiary', text: 'text-tertiary', tile: 'tertiary' },
} as const

function unitLessons(unit: Unit, categories: string[]): Lesson[] {
  if (unit.id !== 'doing') return unit.lessons
  return unit.lessons.filter((l) => !l.category || categories.includes(l.category))
}

export function Path() {
  const navigate = useNavigate()
  const progress = useApp((s) => s.progress)
  const categories = useApp((s) => s.settings.categories)

  const done = (unit: Unit) => progress.unitProgress[unit.id] ?? 0
  const complete = (unit: Unit) => done(unit) >= unitLessons(unit, categories).length

  return (
    <AppShell>
      <DisplayHeadline lead="Path." accent="The" accentFirst rule />

      {UNITS.map((unit, i) => {
        const lessons = unitLessons(unit, categories)
        const unlocked = i === 0 || complete(UNITS[i - 1])
        const finished = done(unit)
        const tone = TONE[unit.hue]
        const pct = Math.round((finished / Math.max(1, lessons.length)) * 100)

        return (
          <section key={unit.id} aria-labelledby={`unit-${unit.id}`} className="flex flex-col gap-sm">
            <div className="flex items-end justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={cx('h-8 w-1.5 shrink-0 rounded-full', tone.bar)} />
                <div>
                  <p className={cx('mb-1 t-label-caps opacity-70', tone.text)}>
                    UNIT {`${unit.index}`.padStart(2, '0')}
                  </p>
                  <h3 id={`unit-${unit.id}`} className="t-headline-md text-on-surface">
                    {unit.title}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                {unlocked ? (
                  <span className={cx('t-stats-sm', tone.text)}>
                    {finished} OF {lessons.length}
                  </span>
                ) : (
                  <span className={cx('t-stats-sm', tone.text)}>LOCKED</span>
                )}
                <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-high">
                  <div className={cx('h-full', tone.bar)} style={{ width: `${unlocked ? pct : 0}%` }} />
                </div>
              </div>
            </div>

            <div className="grid gap-base">
              {lessons.map((lesson, li) => {
                const isDone = unlocked && li < finished
                const isActive = unlocked && li === finished
                return (
                  <ListRow
                    key={lesson.id}
                    icon={isDone ? 'check_circle' : isActive ? 'play_arrow' : 'schedule'}
                    tone={tone.tile}
                    title={lesson.title}
                    meta={
                      unlocked
                        ? `${`${lesson.minutes}`.padStart(2, '0')} MIN • ${lesson.level.toUpperCase()}`
                        : `LOCKED • REQUIRES ${UNITS[i - 1].title.toUpperCase()}`
                    }
                    locked={!unlocked}
                    active={isActive}
                    chevron={unlocked}
                    trailing={
                      isActive ? <span className="t-label-caps text-primary">ACTIVE</span> : undefined
                    }
                    onClick={unlocked ? () => navigate(`/path/${lesson.id}`) : undefined}
                  />
                )
              })}
            </div>
          </section>
        )
      })}

      <section className="card relative overflow-hidden rounded-card p-md">
        <p className="t-label-caps text-primary">GLOBAL RANK</p>
        <h3 className="mt-xs t-headline-md text-on-surface">Top 12%</h3>
        <p className="mt-xs max-w-[34ch] t-body-md text-on-variant">
          You are advancing through Recall faster than 88% of practitioners.
        </p>
      </section>
    </AppShell>
  )
}
