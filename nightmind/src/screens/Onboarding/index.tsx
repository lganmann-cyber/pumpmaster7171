import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from '../../components/Icon'
import { PrimaryButton } from '../../components/PrimaryButton'
import { TimePicker } from '../../components/TimePicker'
import { useApp } from '../../store'
import { useMotionProfile } from '../../lib/motion'
import { cx } from '../../lib/cx'
import type { Category } from '../../lib/types'
import type { IconName } from '../../lib/icons'

const BASELINE: { label: string; tier: 1 | 2 | 3 | 4 | 5 }[] = [
  { label: 'None', tier: 1 },
  { label: 'One or two', tier: 2 },
  { label: 'A few', tier: 3 },
  { label: 'Most nights', tier: 4 },
]

const CATEGORIES: { id: Category; label: string; blurb: string; icon: IconName }[] = [
  { id: 'general', label: 'General', blurb: 'Look around, go somewhere, push on it.', icon: 'bedtime' },
  { id: 'romance', label: 'Romance', blurb: 'Intimacy with dream figures. Adults only.', icon: 'favorite' },
  { id: 'skills', label: 'Skills', blurb: 'Rehearse something you practise awake.', icon: 'bolt' },
  { id: 'nightmares', label: 'Nightmares', blurb: 'Turn round and face a recurring one.', icon: 'psychology' },
]

export function Onboarding() {
  const m = useMotionProfile()
  const { setName, setWakeTime, toggleCategory, setAgeVerified, setRecallTier, completeOnboarding } =
    useApp.getState()
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

  return (
    <div className="flex min-h-dvh flex-col" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-7 px-5 py-6 md:px-8">
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              aria-label={`Step ${i + 1} of 5`}
              aria-current={i === step}
              className={cx('h-1 flex-1 rounded-full', i <= step ? 'bg-accent' : 'bg-sunken')}
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
            className="flex flex-1 flex-col gap-6"
          >
            {step === 0 ? (
              <>
                <h1 className="max-w-[15ch] t-display">
                  <span className="text-ink">Most people forget four dreams a night.</span>{' '}
                  <span className="text-accent">You're about to stop.</span>
                </h1>
                <p className="max-w-[40ch] t-body text-body">
                  This app trains recall first. Lucidity comes later, and only after you can
                  remember what you dreamed.
                </p>
                <label htmlFor="name" className="t-eyebrow text-muted">
                  What should we call you?
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setLocalName(e.target.value)}
                  placeholder="First name"
                  className="min-h-[52px] w-full rounded-field bg-surface px-4 t-body text-ink shadow-[var(--shadow-card)] placeholder:text-muted focus:outline-2 focus:outline-accent"
                />
                <div className="mt-auto">
                  <PrimaryButton onClick={next}>Continue</PrimaryButton>
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <h1 className="max-w-[15ch] t-display">
                  <span className="text-ink">How many dreams in a normal week?</span>{' '}
                  <span className="text-accent">Answer honestly.</span>
                </h1>
                <div className="grid grid-cols-2 gap-3">
                  {BASELINE.map((b) => {
                    const on = tier === b.tier
                    return (
                      <button
                        key={b.label}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setTier(b.tier)}
                        className={cx(
                          'min-h-[96px] rounded-card p-4 text-left t-label',
                          on ? 'bg-pill text-pill-ink' : 'bg-surface text-ink shadow-[var(--shadow-card)]',
                        )}
                      >
                        {b.label}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-auto flex gap-3">
                  <PrimaryButton variant="quiet" full={false} onClick={back}>
                    Back
                  </PrimaryButton>
                  <PrimaryButton onClick={next} disabled={!tier}>
                    Continue
                  </PrimaryButton>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <h1 className="max-w-[15ch] t-display">
                  <span className="text-ink">When do you wake up?</span>{' '}
                  <span className="text-accent">We work back from it.</span>
                </h1>
                <TimePicker value={settings.wakeTime} onChange={setWakeTime} label="Usual wake time" />
                <div className="mt-auto flex gap-3">
                  <PrimaryButton variant="quiet" full={false} onClick={back}>
                    Back
                  </PrimaryButton>
                  <PrimaryButton onClick={next}>Continue</PrimaryButton>
                </div>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <h1 className="max-w-[15ch] t-display">
                  <span className="text-ink">What would you do once lucid?</span>{' '}
                  <span className="text-accent">Pick as many as you like.</span>
                </h1>
                <div className="flex flex-col gap-3">
                  {CATEGORIES.map(({ id, label, blurb, icon }) => {
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
                          'flex items-start gap-4 rounded-card p-4 text-left',
                          on ? 'bg-accent-tint' : 'bg-surface shadow-[var(--shadow-card)]',
                        )}
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-tile bg-accent-tint text-accent">
                          <Icon name={icon} size={22} />
                        </span>
                        <span className="flex-1">
                          <span className="block t-label text-ink">{label}</span>
                          <span className="mt-1 block t-meta text-body">{blurb}</span>
                        </span>
                        {on ? (
                          <span className="text-accent">
                            <Icon name="check" size={22} />
                          </span>
                        ) : null}
                      </button>
                    )
                  })}
                </div>

                {ageGate ? (
                  <div role="alertdialog" aria-label="Age confirmation" className="card p-5">
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
                      <PrimaryButton variant="quiet" full={false} onClick={() => setAgeGate(false)}>
                        Not now
                      </PrimaryButton>
                    </div>
                  </div>
                ) : null}

                <div className="mt-auto flex gap-3">
                  <PrimaryButton variant="quiet" full={false} onClick={back}>
                    Back
                  </PrimaryButton>
                  <PrimaryButton onClick={next} disabled={settings.categories.length === 0}>
                    Continue
                  </PrimaryButton>
                </div>
              </>
            ) : null}

            {step === 4 ? (
              <>
                <h1 className="max-w-[15ch] t-display">
                  <span className="text-ink">Tonight, you do one thing.</span>{' '}
                  <span className="text-accent">That's the whole assignment.</span>
                </h1>
                <p className="max-w-[42ch] t-body text-body">
                  Write down anything you remember when you wake up. Fragments count. Nothing
                  remembered counts too — log it and the streak holds.
                </p>
                <div className="card p-5">
                  <p className="t-eyebrow text-accent">Tomorrow morning</p>
                  <p className="mt-2 t-label text-ink">
                    Open the journal before you move.
                  </p>
                </div>
                <div className="mt-auto flex gap-3">
                  <PrimaryButton variant="quiet" full={false} onClick={back}>
                    Back
                  </PrimaryButton>
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
