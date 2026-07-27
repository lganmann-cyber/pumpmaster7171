import { NavLink } from 'react-router-dom'
import { Icon } from './Icon'
import { cx } from '../lib/cx'
import { NAV_ITEMS } from './nav-items'

/** Four tabs, tint-only active state in coral. */
export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-surface md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-[720px] items-stretch">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cx(
                  'flex min-h-[60px] flex-col items-center justify-center gap-1 py-2',
                  isActive ? 'text-accent' : 'text-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={icon} size={22} fill={isActive} />
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
