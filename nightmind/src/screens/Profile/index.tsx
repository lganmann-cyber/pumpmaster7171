import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Flame, Moon, Sun, SunMoon, Wand2 } from 'lucide-react'
import { AppShell } from '../../components/AppShell'
import { DisplayHeadline } from '../../components/DisplayHeadline'
import { IconButton } from '../../components/IconButton'
import { TimePicker } from '../../components/TimePicker'
import { toast } from '../../components/Toast'
import { useApp } from '../../store'
import { useTheme } from '../../lib/theme'
import { TIER_LABEL } from '../../lib/recall'
import { formatClock } from '../../lib/time'
import { cx } from '../../lib/cx'
import type { Category, ThemeSetting } from '../../lib/types'

const THEMES: { id: ThemeSetting; label: string; icon: typeof Moon }[] = [
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'nightshift', label: 'Night shift', icon: SunMoon },
  { id: 'auto', label: 'Auto', icon: Wand2 },
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
    <AppShell>
      <header className="flex items-center gap-3 pt-5">
        <IconButton icon={ArrowLeft} label="Back" onClick={() => navigate(-1)} />
        <span className="t-label font-semibold text-ink">Profile</span>
      </header>

      <div className="pt-6">
        <DisplayHeadline
          lead={name ? `${progress.recallStreak} days running` : `${progress.recallStreak} days running`}
          accent={TIER_LABEL[progress.recallTier]}
        />
      </div>

      <div className="mt-7 flex flex-col gap-6">
        <section>
          <h2 className="t-label font-semibold text-muted">You</h2>
          <label htmlFor="profile-name" className="sr-only">
            Name
          </label>
          <input
            id="profile-name"
            defaultValue={name}
            onBlur={(e) => setName(e.target.value)}
            placeholder="First name"
            className="mt-3 min-h-[52px] w-full rounded-tile bg-surface px-5 t-body text-ink placeholder:text-muted"
          />
          <div className="mt-3 flex items-center gap-3 rounded-tile bg-surface p-4">
            <span className="grid size-10 place-items-center rounded-full bg-orange-tint text-orange">
              <Flame size={18} aria-hidden />
            </span>
            <span>
              <span className="block t-body font-semibold text-ink">
                {progress.recallStreak} day streak
              </span>
              <span className="mono block t-meta text-muted">
                Longest {progress.longestStreak} · tier {progress.recallTier}
              </span>
            </span>
          </div>
        </section>

        <section>
          <h2 className="t-label font-semibold text-muted">Appearance</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {THEMES.map(({ id, label, icon: Icon }) => {
              const on = settings.theme === id
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTheme(id)}
                  className={cx(
                    'flex min-h-[64px] items-center gap-3 rounded-tile px-4 text-left t-label font-semibold',
                    on ? 'bg-purple text-inverse' : 'bg-surface text-ink',
                  )}
                >
                  <Icon size={20} aria-hidden />
                  {label}
                </button>
              )
            })}
          </div>
          <p className="mt-2 t-meta text-muted">
            Auto follows your system, and switches to night shift between{' '}
            <span className="mono">1:30am</span> and <span className="mono">5:30am</span>. Showing{' '}
            {theme === 'nightshift' ? 'night shift' : theme}.
          </p>
        </section>

        <section>
          <h2 className="t-label font-semibold text-muted">Wake window</h2>
          <div className="mt-3">
            <TimePicker value={settings.wakeTime} onChange={setWakeTime} label="Usual wake time" />
          </div>
          <div className="mt-3 flex items-center justify-between rounded-tile bg-surface p-4">
            <span>
              <span className="block t-body font-semibold text-ink">Wake-back-to-bed alarm</span>
              <span className="mono block t-meta text-muted">
                {settings.wbtbAlarm ? formatClock(settings.wbtbAlarm) : 'Off'}
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                setWbtbAlarm(settings.wbtbAlarm ? undefined : '03:40')
                toast(settings.wbtbAlarm ? 'Alarm off' : 'Alarm set')
              }}
              className="min-h-[44px] rounded-full bg-sunken px-4 t-label text-ink"
            >
              {settings.wbtbAlarm ? 'Turn off' : 'Turn on'}
            </button>
          </div>
        </section>

        <section>
          <h2 className="t-label font-semibold text-muted">What you're working towards</h2>
          <div className="mt-3 flex flex-wrap gap-2">
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
                    'min-h-[44px] rounded-full px-4 t-label font-medium',
                    on ? 'bg-purple text-inverse' : 'bg-surface text-muted',
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="t-label font-semibold text-muted">Motion</h2>
          <label className="mt-3 flex min-h-[56px] items-center justify-between rounded-tile bg-surface px-4">
            <span className="t-body text-ink">Reduce motion</span>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="size-6 accent-[var(--purple)]"
            />
          </label>
        </section>

        <section>
          <h2 className="t-label font-semibold text-muted">Preview time of day</h2>
          <p className="mt-1 t-meta text-muted">
            The home screen changes with the clock. This shows each face without waiting for it.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PREVIEW.map(({ label, hm }) => {
              const on = timeOverride === hm
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTimeOverride(hm)}
                  className={cx(
                    'min-h-[44px] rounded-full px-4 t-label font-medium',
                    on ? 'bg-purple text-inverse' : 'bg-surface text-muted',
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
