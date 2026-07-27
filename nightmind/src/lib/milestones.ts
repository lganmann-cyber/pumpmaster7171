import type { MilestoneItem } from '../components/Milestone'

/** The recall ladder, in nights. Every rung is capture, never lucidity. */
export const MILESTONES: { id: string; label: string; nights: number; note: string }[] = [
  { id: 'm1', label: 'Night one', nights: 1, note: 'You wrote something down before you moved.' },
  { id: 'm3', label: '3 nights', nights: 3, note: 'The morning ritual is starting to stick.' },
  { id: 'm7', label: '1 week', nights: 7, note: 'Recall usually doubles somewhere in here.' },
  { id: 'm14', label: '2 weeks', nights: 14, note: 'Signs start repeating often enough to name.' },
  { id: 'm30', label: '1 month', nights: 30, note: 'Your constellation has real shape now.' },
  { id: 'm90', label: '3 months', nights: 90, note: 'Recall is a habit rather than an effort.' },
  { id: 'm180', label: '6 months', nights: 180, note: 'You know your own tells cold.' },
  { id: 'm365', label: '1 year', nights: 365, note: 'A full year of your own dream record.' },
]

export function milestoneItems(streak: number, longest: number): MilestoneItem[] {
  const best = Math.max(streak, longest)
  const nextIndex = MILESTONES.findIndex((m) => best < m.nights)
  return MILESTONES.map((m, i) => ({
    id: m.id,
    label: m.label,
    nights: m.nights,
    earned: best >= m.nights,
    current: i === nextIndex,
  }))
}
