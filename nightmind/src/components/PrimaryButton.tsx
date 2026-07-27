import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'
import type { IconName } from '../lib/icons'

/** Solid primary with dark on-container label in mono caps, 12px radius. */
export function PrimaryButton({
  children,
  onClick,
  icon,
  disabled,
  full = true,
  variant = 'solid',
  type = 'button',
  className,
}: {
  children: ReactNode
  onClick?: () => void
  icon?: IconName
  disabled?: boolean
  full?: boolean
  variant?: 'solid' | 'outline'
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
        'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md px-6 t-label-caps',
        'disabled:opacity-40',
        variant === 'solid'
          ? 'bg-primary text-on-primary-container'
          : 'border border-outline text-on-surface',
        full && 'w-full',
        className,
      )}
    >
      {icon ? <Icon name={icon} size={20} fill /> : null}
      {children}
    </motion.button>
  )
}
