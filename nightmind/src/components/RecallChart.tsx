import { useState } from 'react'
import { motion } from 'framer-motion'
import type { RecallPoint } from '../lib/recall'
import { useMotionProfile } from '../lib/motion'
import { cx } from '../lib/cx'

/**
 * Recall density. Full-radius bars on a surface-variant track, the selected
 * day filled primary-container with a mono tooltip pill above it. No axes,
 * no gridlines, no y-scale — y is dreams recalled, never lucidity.
 */
export function RecallChart({
  data,
  caption,
  delta,
}: {
  data: RecallPoint[]
  caption: string
  delta?: string
}) {
  const m = useMotionProfile()
  const [selected, setSelected] = useState(() => {
    let best = 0
    data.forEach((d, i) => {
      if (d.value >= data[best].value) best = i
    })
    return best
  })
  const active = Math.min(selected, data.length - 1)
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <section className="card relative overflow-hidden p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="t-eyebrow text-muted">{caption}</span>
        {delta ? <span className="t-meta text-positive">{delta}</span> : null}
      </div>

      <div className="relative mt-8 flex h-32 items-end justify-between gap-3">
        {data.map((d, i) => {
          const isActive = i === active
          const pct = Math.max(8, Math.round((d.value / max) * 100))
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setSelected(i)}
              aria-pressed={isActive}
              className="relative flex h-full flex-1 items-end"
            >
              {isActive ? (
                // Anchored inside the card at the ends so the pill never clips.
                <span
                  className={cx(
                    'pointer-events-none absolute -top-9 z-10 rounded-field bg-ink px-3 py-1',
                    't-meta whitespace-nowrap text-inverse',
                    i <= 1 ? 'left-0' : i >= data.length - 2 ? 'right-0' : 'left-1/2 -translate-x-1/2',
                  )}
                >
                  {d.value === 1 ? '1 Dream' : `${d.value} Dreams`}
                </span>
              ) : null}
              <motion.span
                className={cx(
                  'w-full rounded-full',
                  isActive ? 'bg-accent' : 'bg-track',
                )}
                initial={m.full ? { height: 0 } : false}
                animate={{ height: `${pct}%` }}
                transition={m.t(400, i * 40)}
              />
              <span className="sr-only">{`${d.key}, ${d.value} ${d.value === 1 ? 'dream' : 'dreams'} recalled`}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex justify-between t-meta text-muted">
        {data.map((d) => (
          <span key={d.key} className="flex-1 text-center uppercase">
            {d.label}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Dreams recalled</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.key}>
              <th scope="row">{d.key}</th>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
