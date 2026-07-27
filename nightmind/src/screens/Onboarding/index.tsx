import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Heart, Moon, Sparkles, Target } from 'lucide-react'
import { DisplayHeadline } from '../../components/DisplayHeadline'
import { PrimaryButton } from '../../components/PrimaryButton'
import { SecondaryButtonOnColor } from '../../components/SecondaryButtonOnColor'
import { TimePicker } from '../../components/TimePicker'
import { useApp } from '../../store'
import { useMotionProfile } from '../../lib/motion'
import { cx } from '../../lib/cx'
import { useColorSurface } from '../../lib/onColor'
import type { Category } from '../../lib/types'

const BASELINE: { label: string; tier: 1 | 2 | 3 | 4 | 5 }[] = [
  { label: 'None', tier: 1 },
  { label: 'One or two', tier: 2 },
  { label: 'A few', tier: 3 },
  { label: 'Most nights', tier: 4 },
]

const CATEGORIES: { id: Category; label: string; blurb: string; icon: typeof Moon }[] = [
  {
    id: 'general',
    label: 'General',
    blurb: 'Look around, go somewhere, see what a dream does when you push it.',
    icon: Moon,
  },
  {
    id: 'romance',
    label: 'Romance',
    blurb: 'Intimacy with dream figures. Adults only.',
    icon: Heart,
  },
  {
    id: 'skills',
    label: 'Skills',
    blurb: 'Rehearse something you already practise awake.',
    icon: Target,
  },
  {
    id: 'nightmares',
    label: 'Nightmares',
    blurb: 'Turn round and face a dream that keeps coming back.',
    icon: Sparkles,
  },
]

export function Onboarding() {
  const m = useMotionProfile()
  const colorField = useColorSurface('purple')
  const {
    setName,
    setWakeTime,
    toggleCategory,
    setAgeVerified,
    setRecallTier,
    completeOnboarding,
  } = useApp.getState()
  const settings = useApp((s) => s.settings)
  const storedName = useApp((s) => s.name)

  const [step, setStep] = useState(0)
  const [name, setLocalName] = useState(storedName)
  const [tier, setTier] = useState<1 | 2 | 3 | 4 | 5 | null>(null)
  const [ageGate, setAgeGate] = useState(false)

  const next = () => setStep((s) => Math.min(4, s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))

  const finish = () => {
    setName(name)
    if (tier) setRecallTier(tier)
    completeOnboarding()
  }

  const onPurple = step === 0

  return (
    <div
      className={cx('flex min-h-dvh flex-col', onPurple ? colorField.className : 'bg-canvas')}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col px-5 pt-6 pb-8 md:px-8">
        {/* Progress dots — no back-blocking. */}
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              aria-label={`Step ${i + 1} of 5`}
              aria-current={i === step}
              className={cx(
                'h-1.5 flex-1 rounded-full',
                onPurple
                  ? i <= step
                    ? 'bg-current opacity-90'
                    : 'bg-current opacity-25'
                  : i <= step
                    ? 'bg-purple'
                    : 'bg-sunken',
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={m.full ? { opacity: 0, y: 12 } : { opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={m.t(240)}
            className="flex flex-1 flex-col pt-10"
          >
            {step === 0 ? (
              <>
                {/* On a purple field the two-tone accent has nowhere to go, so the
                    second clause drops to 80% inverse instead of --purple-bright. */}
                <h1 className="max-w-[12ch] t-display">
                  Most people forget four dreams a night.{' '}
                  <span className="opacity-75">You're about to stop.</span>
                </h1>
                <p className="mt-7 max-w-[40ch] t-body opacity-90">
                  This app trains recall first. Lucidity comes later, and only after you can
                  remember what you dreamed.
                </p>

                <label htmlFor="name" className="mt-8 t-label opacity-90">
                  What should we call you?
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setLocalName(e.target.value)}
                  placeholder="First name"
                  className="mt-2 min-h-[52px] w-full rounded-full bg-white/20 px-5 t-body placeholder:opacity-60"
                />

                <div className="mt-auto pt-10">
                  <SecondaryButtonOnColor full onClick={next}>
                    Continue
                  </SecondaryButtonOnColor>
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <DisplayHeadline
                  lead="How many dreams do you remember in a normal week"
                  accent="Answer honestly"
                />
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {BASELINE.map((b) => {
                    const on = tier === b.tier
                    return (
                      <button
                        key={b.label}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setTier(b.tier)}
                        className={cx(
                          'min-h-[104px] rounded-card p-5 text-left t-body font-semibold',
                          on ? 'bg-purple text-inverse' : 'bg-surface text-ink',
                        )}
                      >
                        {b.label}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-auto flex gap-3 pt-10">
                  <BackButton onClick={back} />
                  <PrimaryButton onClick={next} disabled={!tier}>
                    Continue
                  </PrimaryButton>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <DisplayHeadline lead="When do you normally wake up" accent="We work backwards from it" />
                <p className="mt-4 max-w-[44ch] t-body text-muted">
                  This sets your reality-check reminders and the suggested wake-back-to-bed alarm.
                </p>
                <div className="mt-7">
                  <TimePicker
                    value={settings.wakeTime}
                    onChange={setWakeTime}
                    label="Usual wake time"
                  />
                </div>
                <div className="mt-auto flex gap-3 pt-10">
                  <BackButton onClick={back} />
                  <PrimaryButton onClick={next}>Continue</PrimaryButton>
                </div>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <DisplayHeadline lead="What would you do once you're lucid" accent="Pick as many as you like" />
                <div className="mt-8 flex flex-col gap-3">
                  {CATEGORIES.map(({ id, label, blurb, icon: Icon }) => {
                    const on = settings.categories.includes(id)
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => {
                          if (id === 'romance' && !settings.ageVerified && !on) {
                            setAgeGate(true)
                            return
                          }
                          toggleCategory(id)
                        }}
                        className={cx(
                          'flex items-start gap-4 rounded-card p-5 text-left',
                          on ? 'bg-purple text-inverse' : 'bg-surface text-ink',
                        )}
                      >
                        <Icon size={22} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden />
                        <span className="flex-1">
                          <span className="block t-body font-semibold">{label}</span>
                          <span
                            className={cx('mt-1 block t-meta', on ? 'opacity-85' : 'text-muted')}
                          >
                            {blurb}
                          </span>
                        </span>
                        {on ? <Check size={20} strokeWidth={3} aria-hidden /> : null}
                      </button>
                    )
                  })}
                </div>

                {ageGate ? (
                  <div
                    role="alertdialog"
                    aria-label="Age confirmation"
                    className="mt-4 rounded-card bg-surface p-5"
                  >
                    <p className="t-body text-ink">
                      Romance content is for adults. Confirm you're 18 or over.
                    </p>
                    <div className="mt-4 flex gap-3">
                      <PrimaryButton
                        onClick={() => {
                          setAgeVerified(true)
                          toggleCategory('romance')
                          setAgeGate(false)
                        }}
                      >
                        I'm 18 or over
                      </PrimaryButton>
                      <button
                        type="button"
                        onClick={() => setAgeGate(false)}
                        className="min-h-[52px] shrink-0 rounded-full px-5 t-label text-muted"
                      >
                        Not now
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="mt-auto flex gap-3 pt-10">
                  <BackButton onClick={back} />
                  <PrimaryButton onClick={next} disabled={settings.categories.length === 0}>
                    Continue
                  </PrimaryButton>
                </div>
              </>
            ) : null}

            {step === 4 ? (
              <>
                <DisplayHeadline lead="Tonight, you do one thing" accent="That's the whole assignment" />
                <p className="mt-7 max-w-[42ch] t-body text-ink">
                  Write down anything you remember when you wake up. Fragments count. Nothing
                  remembered counts too — log it and the streak holds.
                </p>
                <div className="mt-6 rounded-card bg-surface p-5">
                  <p className="t-label text-muted">Tomorrow morning</p>
                  <p className="mt-1 t-body font-semibold text-ink">
                    Open the journal before you move.
                  </p>
                </div>
                <div className="mt-auto flex gap-3 pt-10">
                  <BackButton onClick={back} />
                  <PrimaryButton onClick={finish}>Start</PrimaryButton>
                </div>
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-[52px] shrink-0 rounded-full px-5 t-label text-muted"
    >
      Back
    </button>
  )
}
