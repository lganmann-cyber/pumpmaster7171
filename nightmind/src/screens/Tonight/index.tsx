import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell } from '../../components/AppShell'
import { DisplayHeadline } from '../../components/DisplayHeadline'
import { FeatureCard } from '../../components/FeatureCard'
import { Icon } from '../../components/Icon'
import { SegmentedTabs } from '../../components/SegmentedTabs'
import { StatCard } from '../../components/StatCard'
import { StreakRow } from '../../components/StreakRow'
import { toast } from '../../components/Toast'
import { useApp } from '../../store'
import { useFace, useNow, useTheme } from '../../lib/theme'
import { useMotionProfile } from '../../lib/motion'
import { AMBER_ART, DREAM_ART } from '../../lib/art'
import { dayKey, formatClock } from '../../lib/time'
import { isRecall } from '../../lib/streak'
import { LESSONS } from '../../data/seed'
import type { Category, HomeFace } from '../../lib/types'

const CATEGORY_TABS: { id: Category; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'romance', label: 'Romance' },
  { id: 'skills', label: 'Skills' },
  { id: 'nightmares', label: 'Nightmares' },
]

export function Tonight() {
  const face = useFace()
  const now = useNow()
  const m = useMotionProfile()
  const navigate = useNavigate()
  const amber = useTheme() === 'nightshift'

  const dreams = useApp((s) => s.dreams)
  const progress = useApp((s) => s.progress)
  const settings = useApp((s) => s.settings)
  const logRealityCheck = useApp((s) => s.logRealityCheck)
  const openSession = useApp((s) => s.openSession)

  const [tab, setTab] = useState<Category>(settings.categories[0] ?? 'general')

  const recalledToday = dreams.filter(
    (d) => dayKey(d.wokeAt) === dayKey(now) && isRecall(d),
  ).length
  const nextLesson =
    LESSONS.find((l) => {
      const done = progress.unitProgress[l.unitId] ?? 0
      const idx = LESSONS.filter((x) => x.unitId === l.unitId).indexOf(l)
      return idx >= done && (!l.category || l.category === tab)
    }) ?? LESSONS[0]

  const wbtb = settings.wbtbAlarm ?? '03:40'
  const headline = headlineFor(face, { recalledToday, streak: progress.recallStreak })
  const hero = heroFor(face, nextLesson.title, formatClock(wbtb))

  return (
    <AppShell topBar={false}>
      {/* Header row: avatar, streak pill, notifications */}
      <header className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            aria-label="Open profile"
            className="grid size-11 place-items-center rounded-full border-2 border-outline-variant bg-container t-label-caps text-primary"
          >
            {(useApp.getState().name.trim()[0] ?? 'N').toUpperCase()}
          </button>
          <span className="flex items-center gap-1 rounded-full bg-tertiary-container px-3 py-1 text-on-tertiary-container">
            <Icon name="bolt" size={16} fill />
            <span className="t-label-caps">{progress.recallStreak} days</span>
          </span>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => toast('Nothing new tonight')}
          className="-mr-1.5 grid size-11 place-items-center rounded-full text-on-variant"
        >
          <Icon name="notifications" size={24} />
        </button>
      </header>

      <DisplayHeadline lead={headline.lead} accent={headline.accent} />

      <SegmentedTabs
        items={CATEGORY_TABS}
        value={tab}
        onChange={setTab}
        ariaLabel="Practice category"
        bleed
        layoutId="tonight-tabs"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${face}-${tab}`}
          initial={m.full ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={m.t(180)}
          className="flex flex-col gap-lg"
        >
          <FeatureCard
            headline={hero.headline}
            cta={hero.cta}
            ctaIcon={hero.icon}
            art={amber ? AMBER_ART : DREAM_ART}
            onCta={() => {
              if (face === 'morning') {
                navigate('/journal', { state: { autoRecord: true } })
              } else if (face === 'day') {
                navigate(`/path/${nextLesson.id}`)
              } else {
                openSession(face === 'evening' ? 'sess-intention' : 'sess-return')
                toast('Session started')
              }
            }}
          />

          <div className="grid grid-cols-2 gap-gutter">
            <StatCard
              icon="visibility"
              value={`${progress.recallStreak} DAYS`}
              label="Recall streak"
              tone="primary"
            />
            <StatCard
              icon="checklist"
              value={`${progress.checksToday} OF ${progress.checkTarget}`}
              label="Checks today"
              tone="secondary"
              onClick={() => {
                logRealityCheck()
                toast('Check logged')
              }}
            />
          </div>

          <StreakRow
            caption="Wake-back-to-bed"
            statement={`Alarm set for ${formatClock(wbtb)}`}
            onClick={() => navigate('/profile')}
          />
        </motion.div>
      </AnimatePresence>
    </AppShell>
  )
}

function headlineFor(
  face: HomeFace,
  ctx: { recalledToday: number; streak: number },
): { lead: string; accent: string } {
  const word = (n: number) => ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'][n] ?? `${n}`
  if (face === 'morning') {
    if (ctx.recalledToday === 0)
      return { lead: 'Nothing yet.', accent: 'Talk before you move.' }
    return {
      lead: `${word(ctx.recalledToday)} ${ctx.recalledToday === 1 ? 'dream' : 'dreams'}.`,
      accent: `Day ${ctx.streak} running.`,
    }
  }
  if (face === 'day') return { lead: 'Checks first.', accent: 'Then the lesson.' }
  if (face === 'evening') return { lead: 'Wind-down.', accent: 'One sentence, then sleep.' }
  return { lead: 'Lights out.', accent: 'Nothing else tonight.' }
}

function heroFor(face: HomeFace, lessonTitle: string, alarm: string) {
  if (face === 'morning')
    return { headline: 'Capture your dream', cta: 'Start recording', icon: 'mic' as const }
  if (face === 'day')
    return { headline: lessonTitle, cta: 'Open lesson', icon: 'play_arrow' as const }
  if (face === 'evening')
    return { headline: 'Set tonight’s intention', cta: 'Start session', icon: 'play_arrow' as const }
  return { headline: `Back to sleep · ${alarm}`, cta: 'Start session', icon: 'play_arrow' as const }
}
