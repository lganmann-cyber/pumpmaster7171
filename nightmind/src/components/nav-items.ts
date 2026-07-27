import { BookText, Moon, Route, Sparkles, type LucideIcon } from 'lucide-react'

export type NavItem = { to: string; label: string; icon: LucideIcon }

/** Profile lives behind the avatar in the header, not in the nav. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Tonight', icon: Moon },
  { to: '/journal', label: 'Journal', icon: BookText },
  { to: '/path', label: 'Path', icon: Route },
  { to: '/signs', label: 'Signs', icon: Sparkles },
]
