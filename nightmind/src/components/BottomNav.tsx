import { NavLink } from 'react-router-dom'
import { cx } from '../lib/cx'
import { NAV_ITEMS } from './nav-items'

/** Phone only — it disappears entirely at 768px, where the rail takes over. */
export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 bg-surface hairline-t md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-[720px] items-stretch">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cx(
                  'flex min-h-[56px] flex-col items-center justify-center gap-1 py-2',
                  isActive ? 'text-ink' : 'text-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} aria-hidden />
                  <span className="t-nav">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
