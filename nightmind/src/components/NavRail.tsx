import { NavLink } from 'react-router-dom'
import { Icon } from './Icon'
import { cx } from '../lib/cx'
import { NAV_ITEMS } from './nav-items'

/** 88px rail from 768px, 240px from 1280px. Content stays capped at 720px. */
export function NavRail() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-y-0 left-0 z-40 hidden w-[88px] flex-col gap-2 border-r border-outline-variant bg-background p-3 md:flex xl:w-[240px] xl:p-4"
    >
      <div className="mb-md flex items-center gap-3 px-1 pt-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-container t-label-caps text-on-primary-container">
          N
        </span>
        <span className="hidden t-label-caps tracking-tighter text-primary xl:block">
          NIGHTMIND
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cx(
                  'flex min-h-[52px] flex-col items-center justify-center rounded-xl px-3 py-2',
                  'xl:flex-row xl:justify-start xl:gap-3 xl:px-4',
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-variant',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={icon} size={24} fill={isActive} />
                  <span className="mt-0.5 t-label-caps xl:mt-0">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
