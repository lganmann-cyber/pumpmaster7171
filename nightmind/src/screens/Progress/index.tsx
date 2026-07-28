import { useMemo, useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { Constellation } from '../../components/Constellation'
import { Icon } from '../../components/Icon'
import { MilestoneGrid } from '../../components/Milestone'
import { RecallChart } from '../../components/RecallChart'
import { ScreenHeader } from '../../components/ScreenHeader'
import { StatTile } from '../../components/StatTile'
import { useApp } from '../../store'
import { useNow } from '../../lib/theme'
import { series, type Period } from '../../lib/recall'
import { buildConstellation, dreamsWithSign } from '../../lib/signs'
import { isRecall } from '../../lib/streak'
import { MILESTONES, milestoneItems } from '../../lib/milestones'
import { longDate } from '../../lib/time'
import { Chip } from '../../components/Chip'

const PERIODS: { id: Period; label: string }[] = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
]

export function Progress() {
  const now = useNow()
  const dreams = useApp((s) => s.dreams)
  const catalogue = useApp((s) => s.signCatalogue)
  const progress = useApp((s) => s.progress)

  const [period, setPeriod] = useState<Period>('week')
  const [sign, setSign] = useState<string | null>(null)
  const [milestone, setMilestone] = useState<string>('')

  const chart = useMemo(() => series(dreams, period, now), [dreams, period, now])
  const model = useMemo(() => buildConstellation(dreams, catalogue), [dreams, catalogue])
  const items = milestoneItems(progress.recallStreak, progress.longestStreak)
  const shown = MILESTONES.find((m) => m.id === (milestone || items.find((i) => i.current)?.id))
  const shownEarned = items.find((i) => i.id === shown?.id)?.earned
  const selectedDreams = sign ? dreamsWithSign(dreams, sign) : []
  const lucid = dreams.filter((d) => d.wasLucid).sort((a, b) => (a.wokeAt < b.wokeAt ? 1 : -1))

  const captureRate = Math.round(
    (new Set(dreams.map((d) => d.wokeAt.slice(0, 10))).size / 42) * 100,
  )

  return (
    <AppShell>
      <ScreenHeader eyebrow="Your record" eyebrowTone="accent" title="Your" accent="progress." />

      <section className="flex gap-3">
        <StatTile
          label="Best streak"
          value={`${progress.longestStreak}`}
          unit="nights"
          delta="Best yet"
          deltaIcon="self_improvement"
          deltaTone="accent"
        />
        <StatTile
          label="Dreams logged"
          value={`${dreams.filter(isRecall).length}`}
          delta="All time"
          deltaTone="muted"
        />
        <StatTile
          label="Capture rate"
          value={`${captureRate}%`}
          delta="6 weeks"
          deltaIcon="check_circle"
          deltaTone="positive"
        />
      </section>

      {shown ? (
        <section className="card flex items-start gap-4 p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-tint text-accent">
            <Icon name="self_improvement" size={20} fill={shownEarned} />
          </span>
          <div className="flex flex-col gap-1">
            <p className="t-eyebrow text-muted">
              {shownEarned ? 'Unlocked' : 'Next up'} · {shown.nights} nights
            </p>
            <h3 className="t-heading">{shown.label}</h3>
            <p className="t-body text-body">{shown.note}</p>
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="t-heading">Milestones</h2>
          <span className="t-meta text-muted">
            {items.filter((i) => i.earned).length} of {items.length} earned
          </span>
        </div>
        <MilestoneGrid
          items={items}
          selectedId={milestone || items.find((i) => i.current)?.id}
          onSelect={setMilestone}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="t-heading">Growing over time</h2>
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:-mx-8 md:px-8">
          {PERIODS.map((p) => (
            <Chip key={p.id} selected={period === p.id} onClick={() => setPeriod(p.id)}>
              {p.label}
            </Chip>
          ))}
        </div>
        <RecallChart data={chart} caption="Dreams recalled" />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="t-heading">Recurring signs</h2>
          <p className="t-meta text-muted">
            Sized by how often they turn up, joined where they shared a dream.
          </p>
        </div>
        {model.nodes.length === 0 ? (
          <p className="card p-5 t-body text-body">
            Nothing to plot yet. Tag two entries with the same thing and it appears here.
          </p>
        ) : (
          <div className="card h-[280px] p-4">
            <Constellation model={model} selectedId={sign} onSelect={setSign} />
          </div>
        )}
        {sign ? (
          <ul className="flex flex-col gap-2">
            {selectedDreams.slice(0, 4).map((d) => (
              <li key={d.id} className="card p-4">
                <p className="t-eyebrow text-muted">{longDate(d.wokeAt)}</p>
                <p className="mt-1 line-clamp-2 t-body text-body">
                  {isRecall(d) ? d.transcript : 'Nothing remembered — logged anyway'}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="t-heading">Lucidity log</h2>
        {lucid.length === 0 ? (
          <p className="card p-5 t-body text-body">
            Nothing logged yet. Keep working the recall ladder — this fills in on its own.
          </p>
        ) : (
          <ul className="card divide-y divide-hairline overflow-hidden">
            {lucid.map((d) => (
              <li key={d.id} className="flex items-center gap-4 p-4">
                <span className="w-16 shrink-0 t-meta text-muted">{longDate(d.wokeAt)}</span>
                <span className="min-w-0 flex-1 truncate t-body text-ink">
                  {d.transcript.split(/\s+/).slice(0, 6).join(' ')}
                </span>
                <span className="shrink-0 rounded-field bg-accent-tint px-2 py-1 t-eyebrow text-accent">
                  Lucid
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  )
}
