import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { parseHM, toHM } from '../lib/time'
import { useMotionProfile } from '../lib/motion'

/**
 * Times are load-bearing in this product, so the picker runs in the mono face
 * with tabular figures — the digits do not shift as they change.
 */
export function TimePicker({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (hm: string) => void
  label: string
}) {
  const m = useMotionProfile()
  const mins = parseHM(value)
  const h24 = Math.floor(mins / 60)
  const minute = mins % 60
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  const pm = h24 >= 12

  const bump = (deltaMinutes: number) => onChange(toHM(mins + deltaMinutes))

  const Stepper = ({
    onUp,
    onDown,
    children,
    unit,
  }: {
    onUp: () => void
    onDown: () => void
    children: React.ReactNode
    unit: string
  }) => (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        type="button"
        aria-label={`Later ${unit}`}
        onClick={onUp}
        whileTap={m.press}
        transition={m.t(120)}
        className="grid size-11 place-items-center rounded-full text-muted"
      >
        <ChevronUp size={20} aria-hidden />
      </motion.button>
      <span className="mono text-[40px] leading-none font-medium text-ink tabular-nums">
        {children}
      </span>
      <motion.button
        type="button"
        aria-label={`Earlier ${unit}`}
        onClick={onDown}
        whileTap={m.press}
        transition={m.t(120)}
        className="grid size-11 place-items-center rounded-full text-muted"
      >
        <ChevronDown size={20} aria-hidden />
      </motion.button>
    </div>
  )

  return (
    <div className="rounded-card bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="t-label text-muted">{label}</span>
        <span className="t-clock text-muted">{pm ? 'pm' : 'am'}</span>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <Stepper onUp={() => bump(60)} onDown={() => bump(-60)} unit="hour">
          {`${h12}`.padStart(2, '0')}
        </Stepper>
        <span className="mono pb-1 text-[40px] leading-none text-muted">:</span>
        <Stepper onUp={() => bump(5)} onDown={() => bump(-5)} unit="minutes">
          {`${minute}`.padStart(2, '0')}
        </Stepper>
        <div className="ml-4 flex flex-col gap-1">
          {(['am', 'pm'] as const).map((mer) => {
            const active = (mer === 'pm') === pm
            return (
              <button
                key={mer}
                type="button"
                onClick={() => bump(pm === (mer === 'pm') ? 0 : mer === 'pm' ? 720 : -720)}
                aria-pressed={active}
                className={`min-h-[44px] rounded-chip px-4 t-clock ${
                  active ? 'bg-purple-tint text-purple-bright' : 'text-muted'
                }`}
              >
                {mer}
              </button>
            )
          })}
        </div>
      </div>

      <label className="sr-only" htmlFor="time-native">
        {label}
      </label>
      <input
        id="time-native"
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-4 w-full rounded-chip bg-sunken px-4 py-3 t-clock text-ink"
      />
    </div>
  )
}
