import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'
import { NavRail } from './NavRail'
import { cx } from '../lib/cx'

/**
 * One shell, one rhythm: 20px side margins, 32px between sections. Screens
 * compose sections; none of them set their own margins.
 */
export function AppShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-dvh">
      <NavRail />
      <BottomNav />
      <main className="md:pl-[88px] xl:pl-[240px]">
        <div
          className={cx(
            // every section is a flex item: without min-w-0 a wide row (three tiles)
            // grows the column instead of shrinking to fit
            'mx-auto flex w-full max-w-[720px] flex-col gap-7 px-5 pb-[120px] md:px-8 md:pb-10',
            '[&>*]:min-w-0',
            className,
          )}
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}
        >
          {children}
        </div>
      </main>
    </div>
  )
}
