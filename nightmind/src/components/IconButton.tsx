import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'
import { useColorSurface } from '../lib/onColor'

type Tone = 'surface' | 'onColor' | 'ghost'

type Props = {
  icon: LucideIcon
  label: string
  onClick?: () => void
  tone?: Tone
  size?: number
  className?: string
}

/**
 * 48px circle, --surface-raised fill, 20px stroke icon in --ink.
 * It never inverts on a colored header — that is the point of the `onColor`
 * tone: the fill changes, the glyph stays legible.
 */
export function IconButton({
  icon: Icon,
  label,
  onClick,
  tone = 'surface',
  size = 48,
  className,
}: Props) {
  const m = useMotionProfile()
  const { amber } = useColorSurface()
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      whileTap={m.press}
      transition={m.t(120)}
      style={{ width: size, height: size }}
      className={cx(
        'grid shrink-0 place-items-center rounded-full',
        tone === 'surface' && 'bg-fill text-ink',
        tone === 'onColor' && (amber ? 'bg-raised text-ink' : 'bg-white/22 text-on backdrop-blur-md'),
        tone === 'ghost' && 'text-muted hover:text-ink',
        className,
      )}
    >
      <Icon size={20} strokeWidth={2} aria-hidden />
    </motion.button>
  )
}
