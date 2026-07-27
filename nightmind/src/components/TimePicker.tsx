import { Icon } from './Icon'
import { motion } from 'framer-motion'
import { parseHM, toHM } from '../lib/time'
import { useMotionProfile } from '../lib/motion'
import { cx } from '../lib/cx'

/** Times are load-bearing here, so the picker runs in the mono face. */
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
  const bump = (d: number) => onChange(toHM(mins + d))

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
        className="grid size-11 place-items-center rounded-full text-on-variant"
      >
        <Icon name="keyboard_arrow_up" size={22} />
      </motion.button>
      <span className="font-mono text-[36px] leading-none font-semibold text-on-surface tabular-nums">
        {children}
      </span>
      <motion.button
        type="button"
        aria-label={`Earlier ${unit}`}
        onClick={onDown}
        whileTap={m.press}
        transition={m.t(120)}
        className="grid size-11 place-items-center rounded-full text-on-variant"
      >
        <Icon name="keyboard_arrow_down" size={22} />
      </motion.button>
    </div>
  )

  return (
    <div className="card rounded-card p-md">
      <span className="t-label-caps text-on-variant uppercase">{label}</span>
      <div className="mt-sm flex items-center justify-center gap-2">
        <Stepper onUp={() => bump(60)} onDown={() => bump(-60)} unit="hour">
          {`${h12}`.padStart(2, '0')}
        </Stepper>
        <span className="pb-1 font-mono text-[36px] leading-none text-on-variant">:</span>
        <Stepper onUp={() => bump(5)} onDown={() => bump(-5)} unit="minutes">
          {`${minute}`.padStart(2, '0')}
        </Stepper>
        <div className="ml-4 flex flex-col gap-xs">
          {(['am', 'pm'] as const).map((mer) => {
            const active = (mer === 'pm') === pm
            return (
              <button
                key={mer}
                type="button"
                aria-pressed={active}
                onClick={() => bump(pm === (mer === 'pm') ? 0 : mer === 'pm' ? 720 : -720)}
                className={cx(
                  'min-h-[44px] rounded-md px-4 t-label-caps uppercase',
                  active ? 'bg-primary text-on-primary-container' : 'text-on-variant',
                )}
              >
                {mer}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
