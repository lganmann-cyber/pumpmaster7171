import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Flame, Headphones, Mic, Moon, Pencil, Route, Sun, Timer } from 'lucide-react'
import { AppShell } from '../../components/AppShell'
import { DisplayHeadline } from '../../components/DisplayHeadline'
import { FeatureCard } from '../../components/FeatureCard'
import { IconButton } from '../../components/IconButton'
import { ListRow } from '../../components/ListRow'
import { SegmentedTabs } from '../../components/SegmentedTabs'
import { StatCard } from '../../components/StatCard'
import { StreakRow } from '../../components/StreakRow'
import { toast } from '../../components/Toast'
import { useApp } from '../../store'
import { useFace, useNow, useTheme } from '../../lib/theme'
import { useMotionProfile } from '../../lib/motion'
import { dayKey, formatClock } from '../../lib/time'
import { isRecall } from '../../lib/streak'
import { TIER_LABEL } from '../../lib/recall'
import { LESSONS, UNITS } from '../../data/seed'
import type { Category, HomeFace } from '../../lib/types'
import { Avatar } from '../../components/Avatar'

const CATEGORY_TABS: { id: Category; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'romance', label: 'Romance' },
  { id: 'skills', label: 'Skills' },
  { id: 'nightmares', label: 'Nightmares' },
]

/** The chrome darkens across the day. Morning is the only face that carries
 *  color — and in Night Shift even that drops to a tint. */
function headerFill(face: HomeFace, amber: boolean): string {
  if (face === 'morning') return amber ? 'var(--purple-tint)' : 'var(--purple)'
  if (face === 'night') return 'var(--bg-canvas)'
  return 'var(--surface)'
}

export function Tonight() {
  const face = useFace()
  const now = useNow()
  const amber = useTheme() === 'nightshift'
  const m = useMotionProfile()
  const navigate = useNavigate()

  const dreams = useApp((s) => s.dreams)
  const progress = useApp((s) => s.progress)
  const settings = useApp((s) => s.settings)
  const logRealityCheck = useApp((s) => s.logRealityCheck)
  const openSession = useApp((s) => s.openSession)

  const [tab, setTab] = useState<Category>(settings.categories[0] ?? 'general')

  const todayKey = dayKey(now)
  const todayDreams = dreams.filter((d) => dayKey(d.wokeAt) === todayKey)
  const recalledToday = todayDreams.filter(isRecall).length

  const nextLesson =
    LESSONS.find((l) => {
      const done = progress.unitProgress[l.unitId] ?? 0
      const idxInUnit = LESSONS.filter((x) => x.unitId === l.unitId).indexOf(l)
      return idxInUnit >= done && (!l.category || l.category === tab)
    }) ?? LESSONS[0]

  const wbtb = settings.wbtbAlarm ?? '03:40'
  const morningOnColor = face === 'morning' && !amber

  const headline = headlineFor(face, {
    recalledToday,
    streak: progress.recallStreak,
    checksToday: progress.checksToday,
    checkTarget: progress.checkTarget,
    wbtb,
  })

  return (
    <AppShell bleed>
      {/* Header — the fill cross-fades between faces over 600ms. */}
      <div className="relative">
        <AnimatePresence initial={false}>
          <motion.div
            key={face}
            initial={m.full ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={m.t(600)}
            className="absolute inset-0"
            style={{ background: headerFill(face, amber) }}
          />
        </AnimatePresence>

        <div className="relative px-5 pt-5 pb-6 md:px-8">
          <div className="flex items-center justify-between gap-3">
            <Avatar onColor={morningOnColor} />
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 t-label font-semibold ${
                  morningOnColor ? 'bg-white/20 text-on-fill' : 'bg-surface text-orange'
                }`}
              >
                <Flame size={18} strokeWidth={2} aria-hidden />
                <span className="mono">{progress.recallStreak}</span>
                <span className="sr-only">day recall streak</span>
              </span>
              <IconButton
                icon={Bell}
                label="Notifications"
                tone={morningOnColor ? 'onColor' : 'surface'}
                onClick={() => toast('Nothing new tonight')}
              />
            </div>
          </div>

          {face === 'morning' ? (
            <div className="mt-6 flex justify-center">
              <span
                className={`grid size-[104px] place-items-center rounded-full ${morningOnColor ? 'text-inverse' : 'text-ink'}`}
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.28), transparent 70%)' }}
              >
                <Sun size={44} strokeWidth={1.6} aria-hidden />
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="px-5 md:px-8">
        <div className="pt-6">
          <DisplayHeadline lead={headline.lead} accent={headline.accent} />
        </div>

        {face !== 'night' ? (
          <div className="mt-7">
            <SegmentedTabs
              items={CATEGORY_TABS}
              value={tab}
              onChange={setTab}
              ariaLabel="Practice category"
              bleed
              layoutId="tonight-tabs"
            />
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${face}-${tab}`}
            initial={m.full ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={m.t(180)}
            className="mt-4 flex flex-col gap-4"
          >
            {face === 'morning' ? (
              <FeatureCard
                icon={Mic}
                eyebrow="Capture"
                headline="Talk it out before you move."
                cta="Open the recorder"
                onCta={() => navigate('/journal')}
                meta={recalledToday > 0 ? `${recalledToday} logged so far` : undefined}
              />
            ) : null}

            {face === 'day' ? (
              <FeatureCard
                icon={Route}
                eyebrow={`Unit ${UNITS.find((u) => u.id === nextLesson.unitId)?.index ?? 1}`}
                headline={nextLesson.title}
                cta="Open lesson"
                onCta={() => navigate(`/path/${nextLesson.id}`)}
                meta={`${nextLesson.minutes} min`}
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
                meta="8 min"
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
                meta="20 min"
              />
            ) : null}

            {face !== 'night' ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <StatCard
                  label="Recall streak"
                  value={`${progress.recallStreak} days`}
                  hue="purple"
                  icon={Flame}
                  footnote={TIER_LABEL[progress.recallTier]}
                  mono
                />
                <StatCard
                  label="Checks today"
                  value={`${progress.checksToday} of ${progress.checkTarget}`}
                  hue="blue"
                  icon={Timer}
                  footnote={
                    progress.checksToday < progress.checkTarget ? 'Tap to log one' : 'Target met'
                  }
                  mono
                  onClick={() => {
                    logRealityCheck()
                    toast('Check logged')
                  }}
                />
                <div className="hidden md:block">
                  <StatCard
                    label="Dreams logged"
                    value={`${dreams.filter(isRecall).length}`}
                    hue="orange"
                    icon={Pencil}
                    footnote="All time"
                    mono
                  />
                </div>
              </div>
            ) : null}

            <StreakRow
              icon={Timer}
              caption="Wake-back-to-bed"
              statement={`Alarm set for ${formatClock(wbtb)}`}
              onClick={() => navigate('/profile')}
            />

            {face === 'day' || face === 'evening' ? (
              <ListRow
                icon={Route}
                title={nextLesson.title}
                meta={`${nextLesson.minutes} min · Night ${nextLesson.night}`}
                metaMono
                chevron
                onClick={() => navigate(`/path/${nextLesson.id}`)}
              />
            ) : null}

            {face === 'night' ? (
              <ListRow
                icon={Moon}
                title="Nothing else tonight"
                meta="Recall work resumes when you wake"
                surface="sunken"
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
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
  const count = (n: number) =>
    ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'][n] ?? `${n}`

  if (face === 'morning') {
    if (ctx.recalledToday === 0)
      return { lead: 'Nothing written down yet', accent: 'The first minute is the one that counts' }
    return {
      lead: `${count(ctx.recalledToday)} ${ctx.recalledToday === 1 ? 'dream' : 'dreams'} this morning`,
      accent: `That's ${ctx.streak} days running`,
    }
  }

  if (face === 'day') {
    const left = Math.max(0, ctx.checkTarget - ctx.checksToday)
    if (ctx.checksToday === 0)
      return { lead: 'No checks logged today', accent: `${ctx.checkTarget} to go before bed` }
    return {
      lead: `You've checked in ${ctx.checksToday === 1 ? 'once' : `${count(ctx.checksToday).toLowerCase()} times`} today`,
      accent: left === 0 ? 'Target met' : `${count(left)} more before bed`,
    }
  }

  if (face === 'evening') {
    return { lead: 'Wind-down starts here', accent: 'One sentence, then sleep' }
  }

  return { lead: `Alarm set for ${formatClock(ctx.wbtb)}`, accent: 'Nothing else to do tonight' }
}
