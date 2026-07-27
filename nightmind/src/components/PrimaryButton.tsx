import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'

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
 * The prominent action. Accent fill, white 17/600, 14pt radius — the single
 * place a saturated fill appears in chrome.
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
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : m.press}
      transition={m.t(120)}
      className={cx(
        'inline-flex min-h-[50px] items-center justify-center gap-2 rounded-tile px-7',
        't-body-strong disabled:opacity-40',
        'bg-accent-solid text-on-fill',
        full && 'w-full',
        className,
      )}
    >
      {Icon ? <Icon size={18} strokeWidth={2} aria-hidden /> : null}
      {children}
    </motion.button>
  )
}
