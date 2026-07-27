import { NavLink } from 'react-router-dom'
import { cx } from '../lib/cx'
import { NAV_ITEMS } from './nav-items'

/**
 * 88px stacked rail at 768px, expanding to a 240px row rail at 1280px.
 * The content column stays capped at 720px either way.
 */
export function NavRail() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-y-0 left-0 z-40 hidden w-[88px] flex-col gap-2 bg-surface p-3 md:flex xl:w-[240px] xl:p-4"
    >
      <div className="mb-4 flex items-center gap-3 px-1 pt-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-purple-tint text-purple-bright t-label font-semibold">
          N
        </span>
        <span className="hidden t-label font-semibold text-ink xl:block">NightMind</span>
      </div>

      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cx(
                  'flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-tile px-2',
                  'xl:flex-row xl:justify-start xl:gap-3 xl:px-4',
                  isActive ? 'bg-sunken text-ink' : 'text-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} aria-hidden />
                  <span className="t-nav xl:t-label">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
