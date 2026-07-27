import { NavLink } from 'react-router-dom'
import { Icon } from './Icon'
import { cx } from '../lib/cx'
import { NAV_ITEMS } from './nav-items'

/**
 * Five tabs. The active one is a filled primary-container chip — the
 * reference's one piece of solid colour in chrome.
 */
export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-50 rounded-t-xl border-t border-outline-variant bg-container md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-[720px] items-center justify-around px-4 py-2">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cx(
                  'flex min-h-[52px] flex-col items-center justify-center rounded-xl px-3 py-1',
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-variant',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={icon} size={24} fill={isActive} />
                  <span className="mt-1 t-label-caps">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
