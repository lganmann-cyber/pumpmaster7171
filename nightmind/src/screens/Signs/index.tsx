import { useMemo, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { AppShell } from '../../components/AppShell'
import { Avatar } from '../../components/Avatar'
import { Constellation } from '../../components/Constellation'
import { DisplayHeadline } from '../../components/DisplayHeadline'
import { IconButton } from '../../components/IconButton'
import { RecallChart } from '../../components/RecallChart'
import { SegmentedTabs } from '../../components/SegmentedTabs'
import { StatCard } from '../../components/StatCard'
import { toast } from '../../components/Toast'
import { useApp } from '../../store'
import { useNow } from '../../lib/theme'
import { series, type Period } from '../../lib/recall'
import { buildConstellation, dreamsWithSign } from '../../lib/signs'
import { isRecall } from '../../lib/streak'
import { longDate } from '../../lib/time'

const PERIODS: { id: Period; label: string }[] = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
]

const CAPTION: Record<Period, string> = {
  week: 'Weekly recall',
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
  const top = model.nodes[0]
  const selectedNode = model.nodes.find((n) => n.id === selected) ?? null
  const selectedDreams = selected ? dreamsWithSign(dreams, selected) : []
  const lucid = dreams.filter((d) => d.wasLucid).sort((a, b) => (a.wokeAt < b.wokeAt ? 1 : -1))

  return (
    <AppShell>
      <header className="flex items-center justify-between pt-5">
        <Avatar />
        <IconButton
          icon={MoreHorizontal}
          label="More options"
          onClick={() => toast('Nothing here yet')}
        />
      </header>

      <div className="mt-6 flex items-start justify-between gap-4">
        <DisplayHeadline
          lead={top ? `${top.label} again` : 'No signs yet'}
          accent={
            top ? `${top.count} entries so far` : 'Tag a repeat and it starts'
          }
        />
        <SegmentedTabs
          items={PERIODS}
          value={period}
          onChange={setPeriod}
          variant="pill"
          ariaLabel="Chart period"
          layoutId="signs-period"
        />
      </div>

      <div className="mt-7 flex flex-col gap-4">
        <RecallChart data={chart} caption={CAPTION[period]} />

        <section>
          <h2 className="t-label font-semibold text-ink">Dream signs</h2>
          <p className="mt-1 t-meta text-muted">
            Sized by how often they turn up. Joined where they showed up in the same dream.
          </p>

          <div className="mt-3">
            {model.nodes.length === 0 ? (
              <p className="rounded-card bg-surface p-5 t-body text-muted">
                Nothing to plot yet. Tag two entries with the same thing and it appears here.
              </p>
            ) : (
              <Constellation model={model} selectedId={selected} onSelect={setSelected} />
            )}
          </div>

          {model.nodes.length > 0 && model.nodes.length < 4 ? (
            <p className="mt-2 t-meta text-muted">
              {model.nodes.length} signs so far. The field fills in as you tag repeats.
            </p>
          ) : null}

          {selectedNode ? (
            <div className="mt-3 rounded-card bg-surface p-5 card-shadow">
              <h3 className="t-label font-semibold text-ink">
                {selectedNode.label} · {selectedNode.count}{' '}
                {selectedNode.count === 1 ? 'dream' : 'dreams'}
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {selectedDreams.slice(0, 6).map((d) => (
                  <li key={d.id} className="rounded-tile bg-sunken p-4">
                    <p className="t-clock text-muted">{longDate(d.wokeAt)}</p>
                    <p className="mt-1 line-clamp-2 t-body text-ink">
                      {isRecall(d) ? d.transcript : 'Nothing remembered — logged anyway'}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Dreams logged"
            value={`${dreams.filter(isRecall).length}`}
            hue="purple"
            mono
            footnote="All time"
          />
          <StatCard
            label="Longest streak"
            value={`${progress.longestStreak} days`}
            hue="blue"
            mono
            footnote={`Current ${progress.recallStreak}`}
          />
        </div>

        <section>
          <h2 className="t-label font-semibold text-ink">Lucidity log</h2>
          {lucid.length === 0 ? (
            <p className="mt-3 rounded-card bg-surface p-5 t-body text-muted">
              Nothing logged yet. Keep working the recall ladder — this fills in on its own.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {lucid.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-4 rounded-tile bg-sunken p-4"
                >
                  <span className="t-clock text-muted">{longDate(d.wokeAt)}</span>
                  <span className="truncate t-meta text-ink">{d.lucidDuration ?? 'logged'}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  )
}
