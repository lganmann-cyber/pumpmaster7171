import { motion } from 'framer-motion'
import { Icon } from './Icon'
import { useMotionProfile } from '../lib/motion'
import type { IconName } from '../lib/icons'

/** The bottom pill: circled glyph, caps label over a mono value, chevron. */
export function StreakRow({
  icon = 'alarm',
  caption,
  statement,
  onClick,
}: {
  icon?: IconName
  caption: string
  statement: string
  onClick?: () => void
}) {
  const m = useMotionProfile()
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={m.press}
      transition={m.t(120)}
      className="flex w-full items-center gap-4 rounded-full border border-outline-variant bg-high px-sm py-4 text-left"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-container">
        <Icon name={icon} size={24} className="text-tertiary" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="t-label-caps text-on-surface uppercase opacity-80">{caption}</span>
        <span className="mt-1 truncate font-mono text-[13px] text-tertiary">{statement}</span>
      </span>
      <span className="ml-auto pr-2 text-on-variant">
        <Icon name="chevron_right" size={24} />
      </span>
    </motion.button>
  )
}
