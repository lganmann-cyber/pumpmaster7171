import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import type { RecallPoint } from '../lib/recall'
import { useMotionProfile } from '../lib/motion'

type Props = {
  data: RecallPoint[]
  caption: string
}

type BarShapeProps = {
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
  value?: number
}

const CHART_H = 190
const MIN_STUB = 8

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function RecallChart({ data, caption }: Props) {
  const m = useMotionProfile()
  const [selected, setSelected] = useState(data.length - 1)
  const [plotWidth, setPlotWidth] = useState(320)
  const plot = useRef<HTMLDivElement>(null)
  const active = Math.min(selected, data.length - 1)

  useEffect(() => {
    const el = plot.current
    if (!el) return
    const measure = () => setPlotWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /** Pill bars only. No axes, no gridlines, no y-scale — y is dreams recalled. */
  const renderBar = (p: BarShapeProps) => {
    const { x = 0, y = 0, width = 0, height = 0, index = 0, value = 0 } = p
    const w = Math.min(34, width)
    const cx = x + width / 2
    const h = Math.max(height, MIN_STUB)
    const barY = y + height - h
    const baseline = y + height
    const isActive = index === active

    return (
      <g key={`bar-${index}`}>
        <motion.rect
          initial={m.full ? { height: 0, y: baseline } : false}
          animate={{ height: h, y: barY }}
          transition={m.t(400, index * 40)}
          x={cx - w / 2}
          width={w}
          rx={w / 2}
          ry={w / 2}
          fill={isActive ? 'var(--recall)' : 'var(--purple-tint)'}
        />
        {isActive ? (
          // Kept inside the plot area so the pill never clips at either end.
          <g
            transform={`translate(${clamp(cx, 44, Math.max(44, plotWidth - 44))}, ${barY - 12})`}
            pointerEvents="none"
          >
            <rect x={-44} y={-28} width={88} height={28} rx={14} fill="var(--surface-pressed)" />
            <text
              x={0}
              y={-9}
              textAnchor="middle"
              fill="var(--ink)"
              style={{ font: '600 13px var(--font)', fontVariantNumeric: 'tabular-nums' }}
            >
              {value === 1 ? '1 dream' : `${value} dreams`}
            </text>
          </g>
        ) : null}
      </g>
    )
  }

  return (
    <section className="rounded-card bg-surface p-5 card-shadow">
      <h2 className="t-eyebrow text-accent">{caption}</h2>

      <div ref={plot} className="mt-4" style={{ height: CHART_H }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 46, right: 0, bottom: 0, left: 0 }}>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={false} height={0} />
            <YAxis hide domain={[0, (dataMax: number) => Math.max(3, dataMax)]} />
            <Bar
              dataKey="value"
              isAnimationActive={false}
              // Recharts only supplies geometry here; the pill, its tooltip and
              // the growth animation are ours.
              shape={renderBar as unknown as undefined}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex">
        {data.map((d, i) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setSelected(i)}
            aria-pressed={i === active}
            className={`min-h-[44px] flex-1 rounded-chip t-meta ${
              i === active ? 'font-semibold text-ink' : 'text-faint'
            }`}
          >
            <span aria-hidden>{d.label}</span>
            <span className="sr-only">{`${d.key}, ${d.value} dreams recalled`}</span>
          </button>
        ))}
      </div>

      {/* §10 — text alternative for the chart. */}
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
