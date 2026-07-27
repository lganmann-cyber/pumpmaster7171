import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/AppShell'
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
  const navigate = useNavigate()
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
    <AppShell topBar={false}>
      <header className="flex items-center gap-3 pt-2">
        <button
          type="button"
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="grid size-11 place-items-center rounded-full bg-container text-on-surface"
        >
          <Icon name="arrow_back" size={24} />
        </button>
        <h2 className="t-headline-lg">
          <span className="text-on-surface">Profile</span>
          <span className="text-primary">.</span>
        </h2>
      </header>

      <section className="flex flex-col gap-xs">
        <span className="t-label-caps tracking-widest text-on-variant uppercase">You</span>
        <label htmlFor="profile-name" className="sr-only">
          Name
        </label>
        <input
          id="profile-name"
          defaultValue={name}
          onBlur={(e) => setName(e.target.value)}
          placeholder="First name"
          className="min-h-[48px] w-full rounded-md border border-outline-variant bg-low px-4 t-body-md text-on-surface placeholder:text-on-variant/60 focus:border-primary"
        />
        <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-low p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-tertiary-container/20 text-tertiary">
            <Icon name="bolt" size={22} fill />
          </span>
          <span>
            <span className="block t-body-md font-bold text-on-surface">
              {progress.recallStreak} day streak
            </span>
            <span className="mt-1 block t-stats-sm text-on-variant">
              LONGEST {progress.longestStreak} • TIER {progress.recallTier} ·{' '}
              {TIER_LABEL[progress.recallTier].toUpperCase()}
            </span>
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-xs">
        <span className="t-label-caps tracking-widest text-on-variant uppercase">Appearance</span>
        <div className="grid grid-cols-2 gap-gutter">
          {THEMES.map(({ id, label, icon }) => {
            const on = settings.theme === id
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => setTheme(id)}
                className={cx(
                  'flex min-h-[56px] items-center gap-3 rounded-xl border px-4 text-left t-body-md font-bold',
                  on
                    ? 'border-primary bg-primary/10 text-on-surface'
                    : 'border-outline-variant bg-low text-on-variant',
                )}
              >
                <Icon name={icon} size={22} />
                {label}
              </button>
            )
          })}
        </div>
        <p className="t-stats-sm text-on-variant">
          AUTO FOLLOWS YOUR SYSTEM AND SWITCHES TO NIGHT SHIFT 1:30–5:30AM. SHOWING{' '}
          {theme.toUpperCase()}.
        </p>
      </section>

      <section className="flex flex-col gap-xs">
        <span className="t-label-caps tracking-widest text-on-variant uppercase">Wake window</span>
        <TimePicker value={settings.wakeTime} onChange={setWakeTime} label="Usual wake time" />
        <div className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant bg-low p-4">
          <span>
            <span className="block t-body-md font-bold text-on-surface">Wake-back-to-bed alarm</span>
            <span className="mt-1 block t-stats-sm text-tertiary">
              {settings.wbtbAlarm ? formatClock(settings.wbtbAlarm).toUpperCase() : 'OFF'}
            </span>
          </span>
          <button
            type="button"
            onClick={() => {
              setWbtbAlarm(settings.wbtbAlarm ? undefined : '03:40')
              toast(settings.wbtbAlarm ? 'Alarm off' : 'Alarm set')
            }}
            className="min-h-[44px] shrink-0 rounded-md border border-outline px-4 t-label-caps text-on-surface"
          >
            {settings.wbtbAlarm ? 'TURN OFF' : 'TURN ON'}
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-xs">
        <span className="t-label-caps tracking-widest text-on-variant uppercase">
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
                  'min-h-[44px] rounded-full border px-4 t-label-caps',
                  on
                    ? 'border-primary bg-primary text-on-primary-container'
                    : 'border-outline-variant text-on-variant',
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-xs">
        <span className="t-label-caps tracking-widest text-on-variant uppercase">Motion</span>
        <label className="flex min-h-[56px] items-center justify-between rounded-xl border border-outline-variant bg-low px-4">
          <span className="t-body-md text-on-surface">Reduce motion</span>
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => setReducedMotion(e.target.checked)}
            className="size-6 accent-[var(--primary)]"
          />
        </label>
      </section>

      <section className="flex flex-col gap-xs">
        <span className="t-label-caps tracking-widest text-on-variant uppercase">
          Preview time of day
        </span>
        <p className="t-body-md text-on-variant">
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
                  'min-h-[44px] rounded-full border px-4 t-label-caps',
                  on
                    ? 'border-primary bg-primary text-on-primary-container'
                    : 'border-outline-variant text-on-variant',
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
