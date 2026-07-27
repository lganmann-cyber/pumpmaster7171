import { useNavigate } from 'react-router-dom'
import { Icon } from './Icon'
import { useApp } from '../store'
import { cx } from '../lib/cx'
import type { IconName } from '../lib/icons'

/**
 * The screen head from the reference: an optional back or eyebrow, the display
 * headline, and one trailing control. Every screen uses this — the earlier
 * build let each screen invent its own header, which is why they drifted.
 */
export function ScreenHeader({
  eyebrow,
  eyebrowTone = 'muted',
  title,
  accent,
  back,
  trailing,
  onTrailing,
  className,
}: {
  eyebrow?: string
  eyebrowTone?: 'accent' | 'muted'
  title: string
  /** the clause that takes the coral accent, rendered on its own line */
  accent?: string
  back?: boolean
  trailing?: IconName
  onTrailing?: () => void
  className?: string
}) {
  const navigate = useNavigate()
  const name = useApp((s) => s.name)

  const control = (
    <>
      {trailing ? (
        <button
          type="button"
          aria-label="More"
          onClick={onTrailing ?? (() => navigate('/profile'))}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-ink shadow-[var(--shadow-card)]"
        >
          <Icon name={trailing} size={20} />
        </button>
      ) : (
        <button
          type="button"
          aria-label={name ? `${name} — open profile` : 'Open profile'}
          onClick={() => navigate('/profile')}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-surface t-label text-accent shadow-[var(--shadow-card)]"
        >
          {(name.trim()[0] ?? 'N').toUpperCase()}
        </button>
      )}
    </>
  )

  return (
    <header className={cx('flex flex-col gap-4', className)}>
      {back ? (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate(-1)}
            className="grid size-11 place-items-center rounded-full bg-surface text-ink shadow-[var(--shadow-card)]"
          >
            <Icon name="arrow_back" size={20} />
          </button>
          {control}
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          {eyebrow ? (
            <p className={cx('t-eyebrow', eyebrowTone === 'accent' ? 'text-accent' : 'text-muted')}>
              {eyebrow}
            </p>
          ) : null}
          <h1 className="max-w-[15ch] t-display">
            {title}
            {accent ? (
              <>
                {' '}
                <span className="text-accent">{accent}</span>
              </>
            ) : null}
          </h1>
        </div>
        {back ? null : control}
      </div>
    </header>
  )
}
