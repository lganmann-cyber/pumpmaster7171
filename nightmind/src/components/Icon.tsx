import { ICON, type IconName } from '../lib/icons'
import { cx } from '../lib/cx'

/**
 * Material Symbols Outlined, self-hosted and subset to exactly the glyphs this
 * app uses (8KB). Rendered by codepoint rather than ligature so the subset can
 * drop the layout tables.
 */
export function Icon({
  name,
  size = 24,
  fill,
  className,
}: {
  name: IconName
  size?: number
  fill?: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cx('material-symbols-outlined', fill && 'filled', className)}
      style={{ fontSize: size, width: size, height: size }}
    >
      {ICON[name]}
    </span>
  )
}
