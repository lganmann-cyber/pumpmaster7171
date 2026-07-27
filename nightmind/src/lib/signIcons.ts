import {
  ArrowUpDown,
  Car,
  Cat,
  Droplets,
  Footprints,
  Home,
  Moon,
  Phone,
  School,
  Search,
  Smile,
  Sparkles,
  SquareStack,
  User,
  Waves,
  Wind,
  type LucideIcon,
} from 'lucide-react'

const MAP: Record<string, LucideIcon> = {
  s_water: Droplets,
  s_teeth: Smile,
  's_old-house': Home,
  s_flying: Wind,
  s_late: ArrowUpDown,
  s_phone: Phone,
  s_stairs: SquareStack,
  s_sam: User,
  s_chased: Footprints,
  s_school: School,
  s_cat: Cat,
  s_mirror: Sparkles,
  s_car: Car,
  s_lift: ArrowUpDown,
  s_sea: Waves,
  s_lost: Search,
}

export function signIcon(id: string | undefined): LucideIcon {
  return (id && MAP[id]) || Moon
}

const HUES = ['purple', 'blue', 'orange'] as const
export function signHue(id: string | undefined): (typeof HUES)[number] {
  if (!id) return 'purple'
  let n = 0
  for (let i = 0; i < id.length; i += 1) n += id.charCodeAt(i)
  return HUES[n % HUES.length]
}
