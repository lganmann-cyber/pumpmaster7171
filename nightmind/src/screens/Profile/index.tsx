import { AppShell } from '../../components/AppShell'
import { ScreenHeader } from '../../components/ScreenHeader'
import { Icon } from '../../components/Icon'
import { TimePicker } from '../../components/TimePicker'
import { toast } from '../../components/Toast'
import { useApp } from '../../store'
import { useTheme } from '../../lib/theme'
import { TIER_LABEL } from '../../lib/recall'
import { formatClock } from '../../lib/time'
import { cx } from '../../lib/cx'
import type { Category, ThemeSetting } from '../../lib/types'
import type { IconName } from '../../lib/icons'

const THEMES: { id: ThemeSetting; label: string; icon: IconName }[] = [
  { id: 'dark', label: 'Dark', icon: 'bedtime' },
  { id: 'light', label: 'Light', icon: 'visibility' },
  { id: 'nightshift', label: 'Night shift', icon: 'bolt' },
  { id: 'auto', label: 'Auto', icon: 'auto_awesome' },
]

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'romance', label: 'Romance' },
  { id: 'skills', label: 'Skills' },
  { id: 'nightmares', label: 'Nightmares' },
]

const PREVIEW: { label: string; hm: string | null }[] = [
  { label: 'Real time', hm: null },
  { label: 'Morning', hm: '07:30' },
  { label: 'Day', hm: '13:00' },
  { label: 'Evening', hm: '20:00' },
  { label: 'Night', hm: '23:30' },
]

export function Profile() {
  const theme = useTheme()
  const settings = useApp((s) => s.settings)
  const progress = useApp((s) => s.progress)
  const name = useApp((s) => s.name)
  const timeOverride = useApp((s) => s.timeOverride)
  const {
    setTheme,
    setWakeTime,
    setWbtbAlarm,
    toggleCategory,
    setAgeVerified,
    setReducedMotion,
    setTimeOverride,
    setName,
  } = useApp.getState()

  return (
    <AppShell>
      <ScreenHeader back eyebrow="Settings" eyebrowTone="accent" title="Profile" />

      <section className="flex flex-col gap-3">
        <span className="t-eyebrow text-muted">You</span>
        <label htmlFor="profile-name" className="sr-only">
          Name
        </label>
        <input
          id="profile-name"
          defaultValue={name}
          onBlur={(e) => setName(e.target.value)}
          placeholder="First name"
          className="min-h-[52px] w-full rounded-field bg-surface px-4 t-body text-ink shadow-[var(--shadow-card)] placeholder:text-muted focus:outline-2 focus:outline-accent"
        />
        <div className="card flex items-center gap-4 p-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-tile bg-accent-tint text-accent">
            <Icon name="bolt" size={22} fill />
          </span>
          <span>
            <span className="block t-label text-ink">
              {progress.recallStreak} day streak
            </span>
            <span className="mt-1 block t-meta text-muted">
              LONGEST {progress.longestStreak} • TIER {progress.recallTier} ·{' '}
              {TIER_LABEL[progress.recallTier].toUpperCase()}
            </span>
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <span className="t-eyebrow text-muted">Appearance</span>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map(({ id, label, icon }) => {
            const on = settings.theme === id
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => setTheme(id)}
                className={cx(
                  'flex min-h-[56px] items-center gap-3 rounded-tile px-4 text-left t-label',
                  on ? 'bg-accent text-white' : 'bg-surface text-ink shadow-[var(--shadow-card)]',
                )}
              >
                <Icon name={icon} size={22} />
                {label}
              </button>
            )
          })}
        </div>
        <p className="t-meta text-muted">
          Auto follows your system and switches to night shift between 1:30am and 5:30am.
          Showing {theme === 'nightshift' ? 'night shift' : theme}.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <span className="t-eyebrow text-muted">Wake window</span>
        <TimePicker value={settings.wakeTime} onChange={setWakeTime} label="Usual wake time" />
        <div className="card flex items-center justify-between gap-3 p-4">
          <span>
            <span className="block t-label text-ink">Wake-back-to-bed alarm</span>
            <span className="mt-1 block t-meta text-accent">
              {settings.wbtbAlarm ? formatClock(settings.wbtbAlarm) : 'Off'}
            </span>
          </span>
          <button
            type="button"
            onClick={() => {
              setWbtbAlarm(settings.wbtbAlarm ? undefined : '03:40')
              toast(settings.wbtbAlarm ? 'Alarm off' : 'Alarm set')
            }}
            className="min-h-[44px] shrink-0 rounded-field bg-sunken px-4 t-label text-ink"
          >
            {settings.wbtbAlarm ? 'Turn off' : 'Turn on'}
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <span className="t-eyebrow text-muted">
          Working towards
        </span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ id, label }) => {
            const on = settings.categories.includes(id)
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  if (id === 'romance' && !settings.ageVerified && !on) {
                    setAgeVerified(true)
                    toast('Confirmed 18 or over')
                  }
                  toggleCategory(id)
                }}
                className={cx(
                  'min-h-[44px] rounded-field px-4 t-label',
                  on ? 'bg-accent text-white' : 'bg-sunken text-body',
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <span className="t-eyebrow text-muted">Motion</span>
        <label className="card flex min-h-[56px] items-center justify-between px-4">
          <span className="t-label text-ink">Reduce motion</span>
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => setReducedMotion(e.target.checked)}
            className="size-6 accent-[var(--accent)]"
          />
        </label>
      </section>

      <section className="flex flex-col gap-3">
        <span className="t-eyebrow text-muted">
          Preview time of day
        </span>
        <p className="t-meta text-muted">
          The home screen changes with the clock. This shows each face without waiting for it.
        </p>
        <div className="flex flex-wrap gap-2">
          {PREVIEW.map(({ label, hm }) => {
            const on = timeOverride === hm
            return (
              <button
                key={label}
                type="button"
                aria-pressed={on}
                onClick={() => setTimeOverride(hm)}
                className={cx(
                  'min-h-[44px] rounded-field px-4 t-label',
                  on ? 'bg-accent text-white' : 'bg-sunken text-body',
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </section>
    </AppShell>
  )
}
