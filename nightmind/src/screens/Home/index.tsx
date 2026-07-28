import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/AppShell'
import { IllustrationCard } from '../../components/IllustrationCard'
import { PrimaryButton } from '../../components/PrimaryButton'
import { ScreenHeader } from '../../components/ScreenHeader'
import { StatTile } from '../../components/StatTile'
import { TintCard } from '../../components/TintCard'
import { toast } from '../../components/Toast'
import { useApp } from '../../store'
import { useFace, useNow } from '../../lib/theme'
import { ART_DUSK, ART_REST, ART_STONES } from '../../lib/art'
import { dayKey, formatClock } from '../../lib/time'
import { isRecall } from '../../lib/streak'
import { LESSONS } from '../../data/seed'
import type { HomeFace } from '../../lib/types'

/**
 * Home is a single focus: what to do right now, one card, one action. The
 * stats sit under it as reassurance, not as a dashboard.
 */
export function Home() {
  const navigate = useNavigate()
  const face = useFace()
  const now = useNow()

  const name = useApp((s) => s.name)
  const dreams = useApp((s) => s.dreams)
  const progress = useApp((s) => s.progress)
  const settings = useApp((s) => s.settings)
  const openSession = useApp((s) => s.openSession)
  const logRealityCheck = useApp((s) => s.logRealityCheck)

  const recalledToday = dreams.filter(
    (d) => dayKey(d.wokeAt) === dayKey(now) && isRecall(d),
  ).length
  const nextLesson =
    LESSONS.find((l) => {
      const done = progress.unitProgress[l.unitId] ?? 0
      const idx = LESSONS.filter((x) => x.unitId === l.unitId).indexOf(l)
      return idx >= done
    }) ?? LESSONS[0]
  const wbtb = settings.wbtbAlarm ?? '03:40'
  const focus = focusFor(face, { recalledToday, lesson: nextLesson.title, alarm: formatClock(wbtb) })

  return (
    <AppShell>
      <ScreenHeader
        eyebrow={EYEBROW[face]}
        eyebrowTone="accent"
        title={name ? `${name}, your` : 'Your'}
        accent={HEAD[face]}
      />

      <section className="flex flex-col gap-4">
        <IllustrationCard
          art={face === 'morning' ? ART_DUSK : face === 'night' ? ART_REST : ART_STONES}
          eyebrow="Right now"
          title={focus.title}
          body={focus.body}
          meta={focus.meta}
        />
        <PrimaryButton
          onClick={() => {
            if (face === 'morning') navigate('/journal', { state: { autoRecord: true } })
            else if (face === 'day') navigate(`/learn/${nextLesson.id}`)
            else {
              openSession(face === 'evening' ? 'sess-intention' : 'sess-return')
              toast('Session started')
            }
          }}
        >
          {focus.cta}
        </PrimaryButton>
      </section>

      <section className="flex gap-3">
        <StatTile
          label="Recall streak"
          value={`${progress.recallStreak}`}
          unit="nights"
          delta={`Tier ${progress.recallTier}`}
          deltaIcon="self_improvement"
          deltaTone="accent"
        />
        <StatTile
          label="Dreams logged"
          value={`${dreams.filter(isRecall).length}`}
          delta="All time"
          deltaTone="muted"
        />
        <StatTile
          label="Checks today"
          value={`${progress.checksToday}`}
          unit={`of ${progress.checkTarget}`}
          delta="Log one"
          deltaIcon="check_circle"
          deltaTone="positive"
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="t-heading">Tonight's practice</h2>
        <div className="grid grid-cols-2 gap-3">
          <TintCard
            icon="check_circle"
            tone="lilac"
            title="Reality check"
            body="Push a finger into your palm and wait for the answer."
            onClick={() => {
              logRealityCheck()
              toast('Check logged')
            }}
          />
          <TintCard
            icon="self_improvement"
            tone="mint"
            title="Set the sentence"
            body="One line, named around a sign of your own."
            onClick={() => {
              openSession('sess-intention')
              toast('Session started')
            }}
          />
          <TintCard
            icon="alarm"
            tone="peach"
            title="Wake-back-to-bed"
            body={`Alarm set for ${formatClock(wbtb)}.`}
            onClick={() => navigate('/profile')}
          />
          <TintCard
            icon="book"
            tone="sky"
            title={nextLesson.title}
            body={`${nextLesson.minutes} min read in Learn.`}
            onClick={() => navigate(`/learn/${nextLesson.id}`)}
          />
        </div>
      </section>
    </AppShell>
  )
}

const EYEBROW: Record<HomeFace, string> = {
  morning: 'This morning',
  day: 'Today',
  evening: 'Tonight',
  night: 'Right now',
}

const HEAD: Record<HomeFace, string> = {
  morning: 'recall starts here.',
  day: 'practice continues.',
  evening: 'night begins.',
  night: 'window is open.',
}

function focusFor(
  face: HomeFace,
  ctx: { recalledToday: number; lesson: string; alarm: string },
) {
  if (face === 'morning')
    return {
      title: 'Capture before you move',
      body: 'Stay in the position you woke in and talk into the recorder. Fragments count — so does nothing at all.',
      meta: ctx.recalledToday > 0 ? `${ctx.recalledToday} logged so far` : 'Under 20 seconds',
      cta: 'Open the recorder',
    }
  if (face === 'day')
    return {
      title: ctx.lesson,
      body: 'A short read while you are awake, so the practice is loaded before tonight.',
      meta: 'Today’s lesson',
      cta: 'Read the lesson',
    }
  if (face === 'evening')
    return {
      title: 'Set tonight’s intention',
      body: 'Name one sign from your own entries and rehearse catching it. Then let it go and sleep.',
      meta: '8 min session',
      cta: 'Start the session',
    }
  return {
    title: 'Back to sleep',
    body: 'Keep the light off and the screen amber. Read one entry, set the sentence, lie back down.',
    meta: `Alarm at ${ctx.alarm}`,
    cta: 'Start the session',
  }
}
