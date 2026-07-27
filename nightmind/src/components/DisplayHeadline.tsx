import { cx } from '../lib/cx'

/**
 * The signature two-tone headline: the keyword takes the primary accent, the
 * rest stays in ink. Always two lines on phone — headline-lg at 32/800.
 */
export function DisplayHeadline({
  lead,
  accent,
  accentFirst,
  rule,
  className,
  id,
}: {
  lead: string
  accent: string
  /** put the accent clause first, as on the Path screen */
  accentFirst?: boolean
  /** the 12px primary rule under the title */
  rule?: boolean
  className?: string
  id?: string
}) {
  const first = accentFirst ? accent : lead
  const second = accentFirst ? lead : accent
  return (
    <div className={className}>
      {/* The reference breaks the two clauses onto their own lines rather than
          letting them reflow — that is what keeps the wrap even at any width. */}
      <h2 id={id} className="t-headline-lg max-w-[300px]">
        <span className={accentFirst ? 'text-primary' : 'text-on-surface'}>{first}</span>
        {accentFirst ? ' ' : <br />}
        <span className={accentFirst ? 'text-on-surface' : 'text-primary'}>{second}</span>
      </h2>
      {rule ? <div className={cx('mt-xs h-1 w-12 rounded-full bg-primary')} /> : null}
    </div>
  )
}
