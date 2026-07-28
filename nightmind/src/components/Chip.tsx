import { cx } from '../lib/cx'

/** Filter pill. Coral when selected, sunken cream when not. */
export function Chip({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode
  selected?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cx(
        'min-h-[44px] shrink-0 rounded-field px-4 t-label whitespace-nowrap',
        selected ? 'bg-pill text-pill-ink' : 'bg-sunken text-body',
      )}
    >
      {children}
    </button>
  )
}
