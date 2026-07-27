import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Flame, Headphones, Mic, Moon, Route, Timer } from 'lucide-react'
import { AppShell } from '../../components/AppShell'
import { ActivityRings, RingLegend } from '../../components/ActivityRings'
import { DisplayHeadline } from '../../components/DisplayHeadline'
import { FeatureCard } from '../../components/FeatureCard'
import { IconButton } from '../../components/IconButton'
import { ListRow } from '../../components/ListRow'
import { SegmentedTabs } from '../../components/SegmentedTabs'
import { SessionShelf } from '../../components/SessionShelf'
import { StatCard } from '../../components/StatCard'
import { toast } from '../../components/Toast'
import { Avatar } from '../../components/Avatar'
import { useApp } from '../../store'
import { useFace, useNow } from '../../lib/theme'
import { useMotionProfile } from '../../lib/motion'
import { buildRings } from '../../lib/rings'
import { dayKey, formatClock, headDate } from '../../lib/time'
import { isRecall } from '../../lib/streak'
import { TIER_LABEL } from '../../lib/recall'
import { LESSONS, UNITS } from '../../data/seed'
import type { Category, HomeFace } from '../../lib/types'

const CATEGORY_TABS: { id: Category; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'romance', label: 'Romance' },
  { id: 'skills', label: 'Skills' },
  { id: 'nightmares', label: 'Nightmares' },
]

const EYEBROW: Record<HomeFace, string> = {
  morning: 'This morning',
  day: 'Today',
  evening: 'Tonight',
  night: 'Now',
}

export function Tonight() {
  const face = useFace()
  const now = useNow()
  const m = useMotionProfile()
  const navigate = useNavigate()

  const dreams = useApp((s) => s.dreams)
  const progress = useApp((s) => s.progress)
  const settings = useApp((s) => s.settings)
  const sessions = useApp((s) => s.sessions)
  const logRealityCheck = useApp((s) => s.logRealityCheck)
  const openSession = useApp((s) => s.openSession)

  const [tab, setTab] = useState<Category>(settings.categories[0] ?? 'general')

  const recalledToday = dreams.filter(
    (d) => dayKey(d.wokeAt) === dayKey(now) && isRecall(d),
  ).length

  const nextLesson =
    LESSONS.find((l) => {
      const done = progress.unitProgress[l.unitId] ?? 0
      const idxInUnit = LESSONS.filter((x) => x.unitId === l.unitId).indexOf(l)
      return idxInUnit >= done && (!l.category || l.category === tab)
    }) ?? LESSONS[0]

  const wbtb = settings.wbtbAlarm ?? '03:40'
  const rings = buildRings(dreams, progress, now)
  const headline = headlineFor(face, {
    recalledToday,
    streak: progress.recallStreak,
    checksToday: progress.checksToday,
    checkTarget: progress.checkTarget,
    wbtb,
  })

  return (
    <AppShell>
      {/* Day eyebrow + date, then the large title — the reference's summary head */}
      <header className="flex items-start justify-between gap-3 pt-4">
        <div>
          <p className="t-eyebrow text-accent">{EYEBROW[face]}</p>
          <p className="mt-1 t-date text-ink">{headDate(now)}</p>
        </div>
        <div className="flex items-center gap-2">
          <IconButton icon={Bell} label="Notifications" onClick={() => toast('Nothing new')} />
          <Avatar />
        </div>
      </header>

      <div className="pt-6">
        <DisplayHeadline lead={headline.lead} accent={headline.accent} />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {/* Rings hero — recall, checks, lessons. Never lucidity. */}
        <section className="rounded-card bg-surface p-5">
          <div className="flex items-center gap-6">
            <ActivityRings rings={rings} />
            <RingLegend rings={rings} className="flex-1" />
          </div>
          <p className="mt-4 t-meta text-faint">
            Every ring here moves on recall and practice. Lucid dreams are logged, never counted.
          </p>
        </section>

        {face === 'morning' ? (
          <FeatureCard
            icon={Mic}
            eyebrow="Capture"
            headline="Talk it out before you move."
            cta="Start recording"
            onCta={() => navigate('/journal', { state: { autoRecord: true } })}
            meta={
              recalledToday > 0
                ? `${recalledToday} logged so far · under 20 seconds each`
                : 'Fragments count. Nothing remembered counts too.'
            }
          />
        ) : null}

        {face === 'day' ? (
          <FeatureCard
            icon={Route}
            eyebrow={`Unit ${UNITS.find((u) => u.id === nextLesson.unitId)?.index ?? 1}`}
            headline={nextLesson.title}
            cta="Open lesson"
            onCta={() => navigate(`/path/${nextLesson.id}`)}
            meta={`${nextLesson.minutes} min · ${nextLesson.level}`}
          />
        ) : null}

        {face === 'evening' ? (
          <FeatureCard
            icon={Headphones}
            eyebrow="Tonight"
            headline="Set the sentence before you sleep."
            cta="Start session"
            onCta={() => {
              openSession('sess-intention')
              toast('Session started')
            }}
            meta="8 min · guided"
          />
        ) : null}

        {face === 'night' ? (
          <FeatureCard
            icon={Moon}
            eyebrow="Now"
            headline="Back to sleep."
            cta="Start session"
            onCta={() => {
              openSession('sess-return')
              toast('Session started')
            }}
            meta={`20 min · alarm at ${formatClock(wbtb)}`}
          />
        ) : null}

        {/* Metric tiles — small grouped cards, 2-up */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="Recall streak"
            value={`${progress.recallStreak} days`}
            hue="purple"
            icon={Flame}
            footnote={TIER_LABEL[progress.recallTier]}
          />
          <StatCard
            label="Checks today"
            value={`${progress.checksToday} of ${progress.checkTarget}`}
            hue="blue"
            icon={Timer}
            footnote={
              progress.checksToday < progress.checkTarget ? 'Tap to log one' : 'Target met'
            }
            onClick={() => {
              logRealityCheck()
              toast('Check logged')
            }}
          />
          <StatCard
            label="Dreams logged"
            value={`${dreams.filter(isRecall).length}`}
            hue="orange"
            icon={Mic}
            footnote="All time"
          />
          <StatCard
            label="Recall tier"
            value={`${progress.recallTier} of 5`}
            hue="purple"
            icon={Route}
            footnote={TIER_LABEL[progress.recallTier]}
          />
        </div>

        <ListRow
          icon={Timer}
          title="Wake-back-to-bed"
          meta={`Alarm set for ${formatClock(wbtb)}`}
          chevron
          onClick={() => navigate('/profile')}
        />

        {face !== 'night' ? (
          <section className="mt-2">
            <div className="flex items-end justify-between gap-3">
              <h2 className="t-title text-ink">Guided sessions</h2>
            </div>
            <div className="mt-3">
              <SessionShelf sessions={sessions} onOpen={(id) => {
                openSession(id)
                toast('Session started')
              }} />
            </div>
          </section>
        ) : null}

        {face === 'day' || face === 'evening' ? (
          <section className="mt-2">
            <h2 className="t-title text-ink">Once you're lucid</h2>
            <div className="mt-3">
              <SegmentedTabs
                items={CATEGORY_TABS}
                value={tab}
                onChange={setTab}
                ariaLabel="Practice category"
                bleed
                layoutId="tonight-tabs"
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={m.full ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={m.t(180)}
                className="mt-3"
              >
                <ListRow
                  icon={Route}
                  title={nextLesson.title}
                  meta={`${nextLesson.minutes} min · Night ${nextLesson.night}`}
                  wrap
                  chevron
                  onClick={() => navigate(`/path/${nextLesson.id}`)}
                />
              </motion.div>
            </AnimatePresence>
          </section>
        ) : null}
      </div>
    </AppShell>
  )
}

function headlineFor(
  face: HomeFace,
  ctx: {
    recalledToday: number
    streak: number
    checksToday: number
    checkTarget: number
    wbtb: string
  },
): { lead: string; accent: string } {
  const count = (n: number) => ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'][n] ?? `${n}`

  if (face === 'morning') {
    if (ctx.recalledToday === 0) return { lead: 'Nothing yet', accent: 'Talk before you move' }
    return {
      lead: `${count(ctx.recalledToday)} ${ctx.recalledToday === 1 ? 'dream' : 'dreams'}`,
      accent: `Day ${ctx.streak}`,
    }
  }

  if (face === 'day') {
    const left = Math.max(0, ctx.checkTarget - ctx.checksToday)
    if (ctx.checksToday === 0)
      return { lead: 'No checks yet', accent: `${count(ctx.checkTarget)} before bed` }
    return {
      lead: `${count(ctx.checksToday)} checks in`,
      accent: left === 0 ? 'Target met' : `${count(left)} to go`,
    }
  }

  if (face === 'evening') return { lead: 'Wind-down', accent: 'One sentence, then sleep' }

  return { lead: `Alarm ${formatClock(ctx.wbtb)}`, accent: 'Nothing else tonight' }
}
