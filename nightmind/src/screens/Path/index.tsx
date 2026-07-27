import { useNavigate } from 'react-router-dom'
import { BookOpen, Check } from 'lucide-react'
import { AppShell } from '../../components/AppShell'
import { DisplayHeadline } from '../../components/DisplayHeadline'
import { ListRow } from '../../components/ListRow'
import { useApp } from '../../store'
import { UNITS } from '../../data/seed'
import { cx } from '../../lib/cx'
import { useColorSurface } from '../../lib/onColor'
import type { Lesson, Unit } from '../../lib/types'



/** A unit unlocks when the one before it is finished. Never a paywall. */
function unitLessons(unit: Unit, categories: string[]): Lesson[] {
  if (unit.id !== 'doing') return unit.lessons
  return unit.lessons.filter((l) => !l.category || categories.includes(l.category))
}

export function Path() {
  const navigate = useNavigate()
  const progress = useApp((s) => s.progress)
  const categories = useApp((s) => s.settings.categories)

  const bands = {
    purple: useColorSurface('purple').className,
    blue: useColorSurface('blue').className,
    orange: useColorSurface('orange').className,
  }

  const done = (unit: Unit) => progress.unitProgress[unit.id] ?? 0
  const complete = (unit: Unit) => done(unit) >= unitLessons(unit, categories).length

  const firstLockedIndex = UNITS.findIndex((u) => !complete(u))
  const currentUnit = UNITS[firstLockedIndex === -1 ? UNITS.length - 1 : firstLockedIndex]

  return (
    <AppShell>
      <header className="pt-6">
        <DisplayHeadline
          lead={`Unit ${currentUnit.index} is open`}
          accent={`${done(currentUnit)} of ${unitLessons(currentUnit, categories).length} done`}
        />
      </header>

      <div className="mt-7 flex flex-col gap-6">
        {UNITS.map((unit, i) => {
          const lessons = unitLessons(unit, categories)
          const unlocked = i === 0 || complete(UNITS[i - 1])
          const finished = done(unit)

          return (
            <section key={unit.id} aria-labelledby={`unit-${unit.id}`}>
              <div className={cx('rounded-card p-5', bands[unit.hue])}>
                <div className="flex items-center justify-between">
                  <span className="mono t-label font-medium opacity-80">
                    Unit {`${unit.index}`.padStart(2, '0')}
                  </span>
                  <span className="mono t-label font-semibold">
                    {finished} of {lessons.length}
                  </span>
                </div>
                <h2 id={`unit-${unit.id}`} className="mt-3 t-title">
                  {unit.title}
                </h2>
                <p className="mt-1 t-label opacity-85">{unit.blurb}</p>
              </div>

              <ul className="mt-3 flex flex-col gap-2">
                {lessons.map((lesson, li) => {
                  const isDone = unlocked && li < finished
                  return (
                    <li key={lesson.id}>
                      <ListRow
                        icon={BookOpen}
                        hue={unit.hue}
                        title={lesson.title}
                        meta={`${lesson.minutes} min · Night ${lesson.night}`}
                        metaMono
                        wrap
                        locked={!unlocked}
                        chevron={unlocked}
                        trailing={
                          isDone ? (
                            <span className="grid size-6 place-items-center rounded-full bg-purple text-inverse">
                              <Check size={14} strokeWidth={3} aria-hidden />
                              <span className="sr-only">Completed</span>
                            </span>
                          ) : undefined
                        }
                        onClick={unlocked ? () => navigate(`/path/${lesson.id}`) : undefined}
                      />
                    </li>
                  )
                })}
              </ul>

              {!unlocked ? (
                <p className="mt-2 t-meta text-muted">
                  Opens when you finish {UNITS[i - 1].title.toLowerCase()}.
                </p>
              ) : null}
            </section>
          )
        })}
      </div>
    </AppShell>
  )
}
