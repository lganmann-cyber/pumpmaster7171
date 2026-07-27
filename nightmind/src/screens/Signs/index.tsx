import { useMemo, useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { Constellation } from '../../components/Constellation'
import { Icon } from '../../components/Icon'
import { RecallChart } from '../../components/RecallChart'
import { SegmentedTabs } from '../../components/SegmentedTabs'
import { toast } from '../../components/Toast'
import { useApp } from '../../store'
import { useNow } from '../../lib/theme'
import { series, type Period } from '../../lib/recall'
import { buildConstellation, dreamsWithSign } from '../../lib/signs'
import { isRecall } from '../../lib/streak'
import { longDate } from '../../lib/time'

const PERIODS: { id: Period; label: string }[] = [
  { id: 'week', label: 'WEEK' },
  { id: 'month', label: 'MONTH' },
  { id: 'year', label: 'YEAR' },
]

const CAPTION: Record<Period, string> = {
  week: 'Recall density',
  month: 'Monthly recall',
  year: 'Yearly recall',
}

export function Signs() {
  const now = useNow()
  const dreams = useApp((s) => s.dreams)
  const catalogue = useApp((s) => s.signCatalogue)
  const progress = useApp((s) => s.progress)

  const [period, setPeriod] = useState<Period>('week')
  const [selected, setSelected] = useState<string | null>(null)

  const model = useMemo(() => buildConstellation(dreams, catalogue), [dreams, catalogue])
  const chart = useMemo(() => series(dreams, period, now), [dreams, period, now])
  const selectedNode = model.nodes.find((n) => n.id === selected) ?? null
  const selectedDreams = selected ? dreamsWithSign(dreams, selected) : []
  const lucid = dreams.filter((d) => d.wasLucid).sort((a, b) => (a.wokeAt < b.wokeAt ? 1 : -1))

  const span = { week: 7, month: 28, year: 210 }[period]
  const thisWindow = chart.reduce((a, p) => a + p.value, 0)
  const prevWindow = series(
    dreams,
    period,
    new Date(now.getTime() - span * 86_400_000),
  ).reduce((a, p) => a + p.value, 0)
  const delta = prevWindow > 0 ? Math.round(((thisWindow - prevWindow) / prevWindow) * 100) : null

  return (
    <AppShell>
      <div className="flex items-end justify-between gap-4">
        <h2 className="t-headline-lg">
          <span className="text-primary">Signs</span>
          <span className="text-on-variant">.</span>
        </h2>
        <SegmentedTabs
          items={PERIODS}
          value={period}
          onChange={setPeriod}
          variant="pill"
          ariaLabel="Chart period"
          layoutId="signs-period"
        />
      </div>

      <RecallChart
        data={chart}
        caption={CAPTION[period]}
        delta={delta === null ? undefined : `${delta >= 0 ? '+' : ''}${delta}% vs LW`}
      />

      <section className="card flex h-80 flex-col rounded-card p-md">
        <span className="mb-sm t-label-caps tracking-widest text-on-variant uppercase">
          Recurring nodes
        </span>
        {model.nodes.length === 0 ? (
          <p className="t-body-md text-on-variant">
            Nothing to plot yet. Tag two entries with the same thing and it appears here.
          </p>
        ) : (
          <Constellation model={model} selectedId={selected} onSelect={setSelected} />
        )}
      </section>

      {selectedNode ? (
        <section className="card rounded-card p-md">
          <div className="flex items-center justify-between gap-3">
            <h3 className="t-headline-sm text-on-surface">{selectedNode.label}</h3>
            <span className="t-stats-sm text-primary">{selectedNode.count} DREAMS</span>
          </div>
          <ul className="mt-sm flex flex-col gap-xs">
            {selectedDreams.slice(0, 5).map((d) => (
              <li key={d.id} className="rounded-xl border border-outline-variant bg-low p-4">
                <p className="t-stats-sm text-on-variant">{longDate(d.wokeAt).toUpperCase()}</p>
                <p className="mt-1 line-clamp-2 t-body-md text-on-surface">
                  {isRecall(d) ? d.transcript : 'Nothing remembered — logged anyway'}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid grid-cols-2 gap-gutter">
        <div className="card rounded-card p-5">
          <span className="mb-2 block t-label-caps text-on-variant uppercase">Dreams logged</span>
          <div className="flex items-baseline gap-1">
            <span className="t-stats-lg text-primary">{dreams.filter(isRecall).length}</span>
            <span className="t-stats-sm text-on-variant">total</span>
          </div>
        </div>
        <div className="card rounded-card p-5">
          <span className="mb-2 block t-label-caps text-on-variant uppercase">Longest streak</span>
          <div className="flex items-baseline gap-1">
            <span className="t-stats-lg text-tertiary">{progress.longestStreak}</span>
            <span className="t-stats-sm text-on-variant">days</span>
          </div>
        </div>
      </div>

      <section className="card overflow-hidden rounded-card">
        <div className="flex items-center justify-between border-b border-outline-variant p-5">
          <span className="t-label-caps tracking-widest text-on-variant uppercase">
            Lucidity log
          </span>
          <button
            type="button"
            aria-label="Filter"
            onClick={() => toast('Filters are off in this build')}
            className="-mr-2 grid size-11 place-items-center text-on-variant"
          >
            <Icon name="filter_list" size={24} />
          </button>
        </div>

        {lucid.length === 0 ? (
          <p className="p-5 t-body-md text-on-variant">
            Nothing logged yet. Keep working the recall ladder — this fills in on its own.
          </p>
        ) : (
          <ul className="max-h-64 overflow-y-auto">
            {lucid.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-4 border-b border-outline-variant/30 px-5 py-4"
              >
                <span className="w-12 shrink-0 t-stats-sm leading-tight text-on-variant uppercase">
                  {longDate(d.wokeAt).split(' ').slice(0, 2).reverse().join(' ')}
                </span>
                <span className="min-w-0 flex-1 truncate t-body-md text-on-surface">
                  {firstWords(d.transcript)}
                </span>
                <span className="shrink-0 rounded-md bg-primary/15 px-2 py-1 t-label-caps text-primary">
                  LUCID
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  )
}

function firstWords(t: string): string {
  const words = t.trim().split(/\s+/).slice(0, 5).join(' ')
  return words || 'Blank log'
}
