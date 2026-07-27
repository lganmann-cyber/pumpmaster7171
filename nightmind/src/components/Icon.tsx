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
      style={{
        // inline-grid, not inline: an inline box ignores width/height and takes
        // the glyph's advance, which made icons collide with adjacent text
        display: 'inline-grid',
        placeItems: 'center',
        fontSize: size,
        width: size,
        height: size,
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      {ICON[name]}
    </span>
  )
}
