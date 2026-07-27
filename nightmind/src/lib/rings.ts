import type { Ring } from '../components/ActivityRings'
import type { Dream, Progress } from './types'
import { UNITS } from '../data/seed'
import { isRecall } from './streak'
import { dayKey } from './time'

/**
 * The three things NightMind measures. Every one of them is recall or daily
 * practice — the retention model in §1 of the spec, drawn as rings.
 */
export function buildRings(dreams: Dream[], progress: Progress, now: Date): Ring[] {
  const today = dayKey(now)
  const recalled = dreams.filter((d) => dayKey(d.wokeAt) === today && isRecall(d)).length
  const lessonsDone = Object.values(progress.unitProgress).reduce((a, b) => a + b, 0)
  const lessonsTotal = UNITS.reduce((a, u) => a + u.lessons.length, 0)

  return [
    {
      id: 'recall',
      label: 'Recall',
      value: recalled,
      goal: 3,
      unit: 'dreams',
      color: 'var(--recall)',
      labelColor: 'var(--recall-bright)',
    },
    {
      id: 'checks',
      label: 'Checks',
      value: progress.checksToday,
      goal: progress.checkTarget,
      unit: 'checks',
      color: 'var(--checks)',
      labelColor: 'var(--checks-bright)',
    },
    {
      id: 'lessons',
      label: 'Lessons',
      value: lessonsDone,
      goal: lessonsTotal,
      unit: 'done',
      color: 'var(--lessons)',
      labelColor: 'var(--lessons-bright)',
    },
  ]
}
