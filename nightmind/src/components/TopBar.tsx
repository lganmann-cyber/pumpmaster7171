import { useNavigate } from 'react-router-dom'
import { Icon } from './Icon'
import { useApp } from '../store'
import { cx } from '../lib/cx'

/**
 * The docked app bar from the reference: menu + wordmark left, avatar right,
 * on a translucent background so content scrolls under it.
 */
export function TopBar({ className }: { className?: string }) {
  const navigate = useNavigate()
  const name = useApp((s) => s.name)

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-40 bg-background/80 backdrop-blur-md md:pl-[88px] xl:pl-[240px]',
        className,
      )}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex w-full max-w-[720px] items-center justify-between px-margin py-4 md:px-lg">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Menu"
            onClick={() => navigate('/profile')}
            className="flex size-6 items-center justify-center text-primary"
          >
            <Icon name="menu" size={24} />
          </button>
          <h1 className="t-label-caps tracking-tighter text-primary">NIGHTMIND</h1>
        </div>
        <button
          type="button"
          aria-label={name ? `${name} — open profile` : 'Open profile'}
          onClick={() => navigate('/profile')}
          className="grid size-8 place-items-center overflow-hidden rounded-full border border-outline-variant bg-container t-label-caps text-primary"
        >
          {(name.trim()[0] ?? 'N').toUpperCase()}
        </button>
      </div>
    </header>
  )
}
