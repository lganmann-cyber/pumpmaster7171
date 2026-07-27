import { motion } from 'framer-motion'
import { useMotionProfile } from '../lib/motion'
import { cx } from '../lib/cx'

export type Ring = {
  id: 'recall' | 'checks' | 'lessons'
  label: string
  value: number
  goal: number
  unit: string
  color: string
  labelColor: string
}

/**
 * Three concentric rings, thick and round-capped, each on a 22%-opacity track
 * of its own colour, starting at 12 o'clock and sweeping clockwise.
 *
 * What they measure is the product argument: dreams recalled, reality checks,
 * lessons done. All three move on practice. Lucidity is never a ring — a user
 * who has never had a lucid dream can close all three every day.
 */
export function ActivityRings({ rings, size = 132 }: { rings: Ring[]; size?: number }) {
  const m = useMotionProfile()
  const stroke = size * 0.092
  const gap = stroke * 0.62

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={rings
        .map((r) => `${r.label} ${r.value} of ${r.goal} ${r.unit}`)
        .join(', ')}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {rings.map((r) => (
          <filter key={r.id} id={`glow-${r.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={m.amber ? 0 : 1.6} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {rings.map((r, i) => {
          const radius = size / 2 - stroke / 2 - i * (stroke + gap)
          const circumference = 2 * Math.PI * radius
          const pct = Math.min(1, r.goal > 0 ? r.value / r.goal : 0)
          return (
            <g key={r.id}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={r.color}
                strokeOpacity={0.22}
                strokeWidth={stroke}
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={r.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                filter={m.full ? `url(#glow-${r.id})` : undefined}
                strokeDasharray={circumference}
                initial={m.full ? { strokeDashoffset: circumference } : false}
                animate={{ strokeDashoffset: circumference * (1 - pct) }}
                transition={
                  m.full
                    ? { duration: 1, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
                    : { duration: m.amber ? 0.1 : 0 }
                }
              />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

/** Label in the ring's colour, value tabular, goal suffix in secondary label. */
export function RingLegend({ rings, className }: { rings: Ring[]; className?: string }) {
  return (
    <ul className={cx('flex flex-col gap-3', className)}>
      {rings.map((r) => (
        <li key={r.id}>
          <p className="t-eyebrow" style={{ color: r.labelColor }}>
            {r.label}
          </p>
          <p className="t-ring-value text-ink">
            {r.value}
            <span className="t-meta font-semibold text-muted">
              {' '}
              /{r.goal} {r.unit}
            </span>
          </p>
        </li>
      ))}
    </ul>
  )
}
