import { Icon } from './Icon'
import { cx } from '../lib/cx'
import type { IconName } from '../lib/icons'

type Tone = 'lilac' | 'mint' | 'peach' | 'sky'

const TONE: Record<Tone, { bg: string; fg: string }> = {
  lilac: { bg: 'bg-lilac-tint', fg: 'text-lilac' },
  mint: { bg: 'bg-mint-tint', fg: 'text-mint' },
  peach: { bg: 'bg-peach-tint', fg: 'text-peach' },
  sky: { bg: 'bg-sky-tint', fg: 'text-sky' },
}

/** A pastel feature row: tinted glyph tile, title, one line of copy. */
export function TintCard({
  icon,
  tone,
  title,
  body,
  onClick,
}: {
  icon: IconName
  tone: Tone
  title: string
  body: string
  onClick?: () => void
}) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      className={cx('flex w-full flex-col gap-2 rounded-tile p-4 text-left', TONE[tone].bg)}
    >
      <span
        className={cx(
          'grid size-9 place-items-center rounded-[10px] bg-surface',
          TONE[tone].fg,
        )}
      >
        <Icon name={icon} size={18} />
      </span>
      <span className="t-label text-ink">{title}</span>
      <span className="t-meta text-body">{body}</span>
    </Tag>
  )
}
