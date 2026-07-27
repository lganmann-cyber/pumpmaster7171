import { motion } from 'framer-motion'
import { cx } from '../lib/cx'
import type { ConstellationModel } from '../lib/signs'
import { useMotionProfile } from '../lib/motion'

type Props = {
  model: ConstellationModel
  selectedId: string | null
  onSelect: (id: string | null) => void
}

/**
 * Recurring signs as nodes on a dark field, sized by frequency, joined where
 * they co-occur in the same dream. Edges are SVG; nodes are real buttons
 * layered over it, so the field is keyboard-navigable (§10).
 */
export function Constellation({ model, selectedId, onSelect }: Props) {
  const m = useMotionProfile()
  const { nodes, edges } = model
  const byId = new Map(nodes.map((n) => [n.id, n]))

  const connected = new Set<string>()
  if (selectedId) {
    for (const e of edges) {
      if (e.a === selectedId) connected.add(e.b)
      if (e.b === selectedId) connected.add(e.a)
    }
  }

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-surface">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        {edges.map((e) => {
          const a = byId.get(e.a)
          const b = byId.get(e.b)
          if (!a || !b) return null
          const lit = selectedId ? e.a === selectedId || e.b === selectedId : false
          return (
            <motion.line
              key={`${e.a}-${e.b}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={lit ? 'var(--recall)' : 'var(--purple-tint)'}
              strokeWidth={lit ? 2 : 1.25}
              vectorEffect="non-scaling-stroke"
              initial={m.full ? { opacity: 0 } : false}
              animate={{ opacity: selectedId && !lit ? 0.35 : 1 }}
              transition={m.t(400, 200)}
            />
          )
        })}
      </svg>

      {nodes.map((n, i) => {
        const isSelected = n.id === selectedId
        const dim = Boolean(selectedId) && !isSelected && !connected.has(n.id)
        return (
          <motion.button
            key={n.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(isSelected ? null : n.id)}
            initial={m.full ? { opacity: 0, scale: 0.6 } : false}
            animate={{ opacity: dim ? 0.35 : 1, scale: 1 }}
            transition={m.t(360, i * 45)}
            whileTap={m.press}
            aria-label={`${n.label}, ${n.count} ${n.count === 1 ? 'dream' : 'dreams'}`}
            className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span
              className={cx(
                'grid place-items-center rounded-full',
                isSelected ? 'bg-recall' : 'bg-purple-tint',
              )}
              style={{
                width: `${n.r * 1.9}%`,
                minWidth: 22,
                aspectRatio: '1 / 1',
                boxShadow: isSelected ? '0 0 0 3px var(--purple-tint)' : undefined,
              }}
            >
              <span
                className={cx(
                  'mono text-[11px] font-semibold',
                  isSelected ? 'text-on-fill' : 'text-purple-bright',
                )}
              >
                {n.count}
              </span>
            </span>
            {/* Labels only for the signs that carry the field — the rest keep
                their name in the button's accessible name. */}
            <span
              className={cx(
                'pointer-events-none mt-1 max-w-[92px] truncate text-center t-meta',
                isSelected ? 'text-ink' : 'text-muted',
                n.rank > 4 && !isSelected && 'sr-only',
              )}
            >
              {n.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
