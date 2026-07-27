import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'
import { NavRail } from './NavRail'
import { TopBar } from './TopBar'
import { cx } from '../lib/cx'

/**
 * One shell, one rhythm: 20px side margins on phone, 64px from 768up, the
 * app bar docked at the top and 32px between logical sections. No screen sets
 * its own margins — that is what made the spacing read as uneven.
 */
export function AppShell({
  children,
  topBar = true,
  className,
}: {
  children: ReactNode
  topBar?: boolean
  className?: string
}) {
  return (
    <div className="min-h-dvh bg-background">
      <NavRail />
      {topBar ? <TopBar /> : null}
      <BottomNav />
      <main className="md:pl-[88px] xl:pl-[240px]">
        <div
          className={cx(
            'mx-auto flex w-full max-w-[720px] flex-col gap-lg px-margin pb-[132px] md:px-lg md:pb-lg',
            topBar ? 'pt-[88px]' : 'pt-md',
            className,
          )}
        >
          {children}
        </div>
      </main>
    </div>
  )
}
