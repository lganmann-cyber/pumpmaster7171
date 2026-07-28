import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'
import type { IconName } from '../lib/icons'

/**
 * The coral pill. One per screen, and it is the only saturated fill in the
 * layout — everything else is white on cream.
 */
export function PrimaryButton({
  children,
  onClick,
  icon,
  trailingIcon = 'chevron_right',
  disabled,
  full = true,
  variant = 'solid',
  type = 'button',
  className,
}: {
  children: ReactNode
  onClick?: () => void
  icon?: IconName
  trailingIcon?: IconName | null
  disabled?: boolean
  full?: boolean
  variant?: 'solid' | 'quiet'
  type?: 'button' | 'submit'
  className?: string
}) {
  const m = useMotionProfile()
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : m.press}
      transition={m.t(120)}
      className={cx(
        'inline-flex min-h-[52px] items-center justify-center gap-2 rounded-field px-6 t-label',
        'disabled:opacity-40',
        variant === 'solid'
          ? 'bg-pill text-pill-ink'
          : 'bg-surface text-ink shadow-[var(--shadow-card)]',
        full && 'w-full',
        className,
      )}
    >
      {icon ? <Icon name={icon} size={18} /> : null}
      {children}
      {trailingIcon ? <Icon name={trailingIcon} size={18} /> : null}
    </motion.button>
  )
}
