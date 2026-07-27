import { cx } from '../lib/cx'

/**
 * The signature type treatment: clause one in --ink, clause two in
 * --purple-bright, both ending in a period. Exactly once per screen.
 * Measure is capped at 12ch so the two-line wrap survives every width.
 */
export function DisplayHeadline({
  lead,
  accent,
  className,
  id,
}: {
  lead: string
  accent: string
  className?: string
  id?: string
}) {
  const period = (s: string) => (/[.?!]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`)
  // Clause two always takes its own line. Letting the two flow together
  // stranded an orphan ("Day" / "12.") at almost every phone width.
  return (
    <h1 id={id} className={cx('max-w-[16ch] t-display text-ink', className)}>
      {period(lead)}
      <span className="block text-accent">{period(accent)}</span>
    </h1>
  )
}
