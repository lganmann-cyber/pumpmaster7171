import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'
import { NavRail } from './NavRail'
import { cx } from '../lib/cx'

/**
 * §3 — bottom nav under 768px, a fixed rail above it. The content column is
 * capped at 720px and stays centred in whatever is left; the empty space at
 * 1280px is correct.
 */
export function AppShell({ children, bleed }: { children: ReactNode; bleed?: boolean }) {
  return (
    <div className="min-h-dvh bg-canvas">
      <NavRail />
      <BottomNav />
      <main
        className="md:pl-[88px] xl:pl-[240px]"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div
          className={cx(
            'mx-auto w-full max-w-[720px] pb-[104px] md:pb-10',
            !bleed && 'px-5 md:px-8',
          )}
        >
          {children}
        </div>
      </main>
    </div>
  )
}
