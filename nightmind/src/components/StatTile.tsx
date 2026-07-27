import { Icon } from './Icon'
import { cx } from '../lib/cx'
import type { IconName } from '../lib/icons'

/**
 * The small white tile: a caps label, a big number with its unit, and a
 * delta line. Three across on phone, as in the reference.
 */
export function StatTile({
  label,
  value,
  unit,
  delta,
  deltaIcon,
  deltaTone = 'muted',
}: {
  label: string
  value: string
  unit?: string
  delta?: string
  deltaIcon?: IconName
  deltaTone?: 'positive' | 'accent' | 'muted'
}) {
  // min-w-0 matters: a flex item defaults to min-width:auto and will not shrink
  // below its content, which pushed the third tile off a 360px screen.
  return (
    <div className="card flex min-h-[104px] min-w-0 flex-1 basis-0 flex-col justify-between p-4">
      <p className="min-h-[2.9em] t-meta leading-snug text-muted">{label}</p>
      <div>
        <p className="truncate t-stat">
          {value}
          {unit ? <span className="ml-1 t-meta font-semibold text-muted">{unit}</span> : null}
        </p>
        {delta ? (
          <p
            className={cx(
              'mt-1 flex min-w-0 items-center gap-1 t-meta',
              deltaTone === 'positive' && 'text-positive',
              deltaTone === 'accent' && 'text-accent',
              deltaTone === 'muted' && 'text-muted',
            )}
          >
            {deltaIcon ? <Icon name={deltaIcon} size={13} /> : null}
            <span className="truncate">{delta}</span>
          </p>
        ) : null}
      </div>
    </div>
  )
}
