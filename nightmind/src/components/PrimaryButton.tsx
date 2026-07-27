import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'
import { useTheme } from '../lib/theme'

type Props = {
  children: ReactNode
  onClick?: () => void
  icon?: LucideIcon
  disabled?: boolean
  full?: boolean
  type?: 'button' | 'submit'
  className?: string
}

/**
 * The commit action. On light this is an --ink pill with inverse type;
 * on dark and Night Shift a solid black pill disappears into the canvas,
 * so it becomes --surface-raised with an --ink label.
 */
export function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  disabled,
  full = true,
  type = 'button',
  className,
}: Props) {
  const m = useMotionProfile()
  const light = useTheme() === 'light'
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : m.press}
      transition={m.t(120)}
      className={cx(
        'inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-6 t-label',
        'disabled:opacity-40',
        light ? 'bg-ink text-inverse' : 'bg-raised text-ink',
        full && 'w-full',
        className,
      )}
    >
      {Icon ? <Icon size={18} strokeWidth={2} aria-hidden /> : null}
      {children}
    </motion.button>
  )
}
