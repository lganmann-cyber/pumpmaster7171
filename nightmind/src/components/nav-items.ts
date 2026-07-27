import type { IconName } from '../lib/icons'

export type NavItem = { to: string; label: string; icon: IconName }

/** Four tabs. Profile lives behind the header avatar, not in the bar. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: 'self_improvement' },
  { to: '/journal', label: 'Journal', icon: 'edit_note' },
  { to: '/progress', label: 'Progress', icon: 'insights' },
  { to: '/learn', label: 'Learn', icon: 'book' },
]
