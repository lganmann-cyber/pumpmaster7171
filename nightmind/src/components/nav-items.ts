import type { IconName } from '../lib/icons'

export type NavItem = { to: string; label: string; icon: IconName }

/** Five tabs, per the design. Profile sits behind the avatar, not in the nav. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Tonight', icon: 'nights_stay' },
  { to: '/journal', label: 'Journal', icon: 'book' },
  { to: '/path', label: 'Path', icon: 'psychology_alt' },
  { to: '/signs', label: 'Signs', icon: 'insights' },
  { to: '/player', label: 'Player', icon: 'graphic_eq' },
]
