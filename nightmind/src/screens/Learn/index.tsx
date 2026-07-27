import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/AppShell'
import { Chip } from '../../components/Chip'
import { Icon } from '../../components/Icon'
import { IllustrationCard } from '../../components/IllustrationCard'
import { ScreenHeader } from '../../components/ScreenHeader'
import { useApp } from '../../store'
import { ART_READ } from '../../lib/art'
import { LESSONS, UNITS } from '../../data/seed'
import { cx } from '../../lib/cx'

const FILTERS = [
  { id: 'all', label: 'All' },
  ...UNITS.map((u) => ({ id: u.id, label: u.title })),
]

/**
 * Learn is a library, not a ladder: search, a featured read, filters, then
 * everything else as rows. Locking lives on the row, so nothing is hidden.
 */
export function Learn() {
  const navigate = useNavigate()
  const progress = useApp((s) => s.progress)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const unlocked = (unitId: string, index: number) =>
    index <= (progress.unitProgress[unitId] ?? 0)

  const featured =
    LESSONS.find((l) => {
      const done = progress.unitProgress[l.unitId] ?? 0
      const idx = LESSONS.filter((x) => x.unitId === l.unitId).indexOf(l)
      return idx >= done
    }) ?? LESSONS[0]

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LESSONS.filter((l) => {
      if (filter !== 'all' && l.unitId !== filter) return false
      if (!q) return true
      return (
        l.title.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q) ||
        l.body.toLowerCase().includes(q)
      )
    })
  }, [query, filter])

  return (
    <AppShell>
      <ScreenHeader title="Learn" trailing="bookmark" onTrailing={() => setFilter('all')} />

      <label className="flex items-center gap-3 rounded-field bg-sunken px-4 py-3">
        <Icon name="search" size={18} className="text-muted" />
        <span className="sr-only">Search lessons</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reads and techniques"
          className="min-h-[24px] w-full bg-transparent t-body text-ink placeholder:text-muted focus:outline-none"
        />
      </label>

      {query.trim() === '' && filter === 'all' ? (
        <IllustrationCard
          art={ART_READ}
          badge="Featured"
          eyebrow="Start here"
          title={featured.title}
          body={featured.summary}
          meta={`${featured.minutes} min read`}
          action="Read"
          onClick={() => navigate(`/learn/${featured.id}`)}
        />
      ) : null}

      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:-mx-8 md:px-8">
        {FILTERS.map((f) => (
          <Chip key={f.id} selected={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </Chip>
        ))}
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="t-heading">{filter === 'all' ? 'All reads' : UNITS.find((u) => u.id === filter)?.title}</h2>

        {results.length === 0 ? (
          <p className="card p-5 t-body text-body">
            Nothing matches “{query}”. Try a technique name — wake-still, MILD, stabilise.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {results.map((l) => {
              const idx = UNITS.find((u) => u.id === l.unitId)!.lessons.findIndex(
                (x) => x.id === l.id,
              )
              const open = unlocked(l.unitId, idx)
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/learn/${l.id}`)}
                    className={cx('card flex w-full items-center gap-4 p-4 text-left', !open && 'opacity-60')}
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-tile bg-accent-tint text-accent">
                      <Icon name={open ? 'book' : 'lock'} size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate t-label text-ink">{l.title}</span>
                      <span className="mt-1 block t-meta text-muted">
                        {l.minutes} min read · {UNITS.find((u) => u.id === l.unitId)?.title}
                      </span>
                    </span>
                    <Icon name="chevron_right" size={20} className="shrink-0 text-muted" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </AppShell>
  )
}
