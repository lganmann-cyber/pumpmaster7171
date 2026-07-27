import { motion } from 'framer-motion'
import type { ConstellationModel } from '../lib/signs'
import { useMotionProfile } from '../lib/motion'

/**
 * Recurring nodes: signs plotted on a sunken field, sized by frequency,
 * joined by hairlines where they co-occur in the same dream. Nodes are real
 * buttons layered over the SVG so the field is keyboard-navigable.
 */
export function Constellation({
  model,
  selectedId,
  onSelect,
}: {
  model: ConstellationModel
  selectedId: string | null
  onSelect: (id: string | null) => void
}) {
  const m = useMotionProfile()
  const { nodes, edges } = model
  const byId = new Map(nodes.map((n) => [n.id, n]))

  return (
    <div className="relative flex-1 overflow-hidden rounded-xl border border-outline-variant bg-lowest">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
        {edges.map((e) => {
          const a = byId.get(e.a)
          const b = byId.get(e.b)
          if (!a || !b) return null
          const lit = selectedId === e.a || selectedId === e.b
          return (
            <motion.line
              key={`${e.a}-${e.b}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={lit ? 'var(--primary)' : 'var(--outline-variant)'}
              strokeWidth={lit ? 1.2 : 0.6}
              vectorEffect="non-scaling-stroke"
              initial={m.full ? { opacity: 0 } : false}
              animate={{ opacity: selectedId && !lit ? 0.3 : 1 }}
              transition={m.t(400, 200)}
            />
          )
        })}
      </svg>

      {nodes.map((n, i) => {
        const isSelected = n.id === selectedId
        const share = 0.14 + ((n.r - 5) / 5.5) * 0.18
        return (
          <motion.button
            key={n.id}
            type="button"
            aria-pressed={isSelected}
            aria-label={`${n.label}, ${n.count} ${n.count === 1 ? 'dream' : 'dreams'}`}
            onClick={() => onSelect(isSelected ? null : n.id)}
            initial={m.full ? { opacity: 0, scale: 0.6 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={m.t(360, i * 45)}
            whileTap={m.press}
            className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-center"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              width: `${n.r * 2.5}%`,
              minWidth: 52,
              aspectRatio: '1 / 1',
              borderColor: 'var(--primary)',
              borderWidth: isSelected ? 1.5 : 1,
              background: `color-mix(in srgb, var(--primary) ${Math.round(share * 100)}%, transparent)`,
              boxShadow: isSelected ? '0 0 16px -2px var(--primary)' : undefined,
            }}
          >
            <span className="px-1 t-label-caps text-[8px] leading-none text-primary uppercase">
              {n.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
