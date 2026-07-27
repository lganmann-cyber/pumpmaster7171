import { AppShell } from '../../components/AppShell'
import { Icon } from '../../components/Icon'
import { toast } from '../../components/Toast'
import { useApp } from '../../store'
import { cx } from '../../lib/cx'

const TONE = ['text-primary', 'text-secondary', 'text-tertiary', 'text-primary']

/** The Player tab: the guided-session library, opened into the takeover. */
export function Player() {
  const sessions = useApp((s) => s.sessions)
  const openSession = useApp((s) => s.openSession)

  return (
    <AppShell>
      <h2 className="t-headline-lg">
        <span className="text-primary">Player</span>
        <span className="text-on-variant">.</span>
      </h2>

      <section className="flex flex-col gap-xs">
        <span className="t-label-caps tracking-widest text-on-variant uppercase">
          Guided sessions
        </span>
        {sessions.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              openSession(s.id)
              toast('Session started')
            }}
            className="flex items-center gap-sm rounded-xl border border-outline-variant bg-low p-4 text-left"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-container/20">
              <Icon name="play_arrow" size={22} fill className={cx(TONE[i % TONE.length])} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block t-body-md font-bold text-on-surface">{s.title}</span>
              <span className="mt-1 block t-stats-sm text-on-variant">
                {Math.round(s.seconds / 60)} MIN • {s.kind.toUpperCase()}
              </span>
            </span>
            <span className="text-on-variant opacity-40">
              <Icon name="chevron_right" size={24} />
            </span>
          </button>
        ))}
      </section>

      <section className="card rounded-card p-md">
        <span className="t-label-caps text-primary">WHY AUDIO</span>
        <h3 className="mt-xs t-headline-sm text-on-surface">Voice beats typing at 4am</h3>
        <p className="mt-xs t-body-md text-on-variant">
          Speaking keeps your eyes closed and your body still, which is most of what recall
          depends on. Sessions run on a black screen with the chrome dimmed.
        </p>
      </section>
    </AppShell>
  )
}
