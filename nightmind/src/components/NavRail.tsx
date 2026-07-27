import { NavLink } from 'react-router-dom'
import { Icon } from './Icon'
import { cx } from '../lib/cx'
import { NAV_ITEMS } from './nav-items'

/** 88px rail from 768px, 240px from 1280px. Content stays capped at 720px. */
export function NavRail() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-y-0 left-0 z-40 hidden w-[88px] flex-col gap-2 border-r border-hairline bg-surface p-3 md:flex xl:w-[240px] xl:p-4"
    >
      <div className="mb-6 flex items-center gap-3 px-1 pt-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-tint text-accent t-label">
          N
        </span>
        <span className="hidden t-label text-ink xl:block">NightMind</span>
      </div>
      <ul className="flex flex-col gap-2">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cx(
                  'flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-tile px-3 py-2',
                  'xl:flex-row xl:justify-start xl:gap-3 xl:px-4',
                  isActive ? 'bg-accent-tint text-accent' : 'text-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={icon} size={22} fill={isActive} />
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
