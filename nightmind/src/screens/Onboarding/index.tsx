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
    <div className="flex min-h-dvh flex-col bg-background" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-lg px-margin py-md md:px-lg">
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              aria-label={`Step ${i + 1} of 5`}
              aria-current={i === step}
              className={cx('h-1 flex-1 rounded-full', i <= step ? 'bg-primary' : 'bg-high')}
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
            className="flex flex-1 flex-col gap-md"
          >
            {step === 0 ? (
              <>
                <h1 className="max-w-[300px] t-headline-lg">
                  <span className="text-on-surface">Most people forget four dreams a night.</span>{' '}
                  <span className="text-primary">You're about to stop.</span>
                </h1>
                <p className="max-w-[40ch] t-body-md text-on-variant">
                  This app trains recall first. Lucidity comes later, and only after you can
                  remember what you dreamed.
                </p>
                <label htmlFor="name" className="t-label-caps text-on-variant uppercase">
                  What should we call you?
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setLocalName(e.target.value)}
                  placeholder="First name"
                  className="min-h-[48px] w-full rounded-md border border-outline-variant bg-low px-4 t-body-md text-on-surface placeholder:text-on-variant/60 focus:border-primary"
                />
                <div className="mt-auto">
                  <PrimaryButton onClick={next}>Continue</PrimaryButton>
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <h1 className="max-w-[300px] t-headline-lg">
                  <span className="text-on-surface">How many dreams in a normal week?</span>{' '}
                  <span className="text-primary">Answer honestly.</span>
                </h1>
                <div className="grid grid-cols-2 gap-gutter">
                  {BASELINE.map((b) => {
                    const on = tier === b.tier
                    return (
                      <button
                        key={b.label}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setTier(b.tier)}
                        className={cx(
                          'min-h-[96px] rounded-card border p-4 text-left t-body-md font-bold',
                          on
                            ? 'border-primary bg-primary/10 text-on-surface'
                            : 'border-outline-variant bg-low text-on-variant',
                        )}
                      >
                        {b.label}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-auto flex gap-xs">
                  <PrimaryButton variant="outline" full={false} onClick={back}>
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
                <h1 className="max-w-[300px] t-headline-lg">
                  <span className="text-on-surface">When do you wake up?</span>{' '}
                  <span className="text-primary">We work back from it.</span>
                </h1>
                <TimePicker value={settings.wakeTime} onChange={setWakeTime} label="Usual wake time" />
                <div className="mt-auto flex gap-xs">
                  <PrimaryButton variant="outline" full={false} onClick={back}>
                    Back
                  </PrimaryButton>
                  <PrimaryButton onClick={next}>Continue</PrimaryButton>
                </div>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <h1 className="max-w-[300px] t-headline-lg">
                  <span className="text-on-surface">What would you do once lucid?</span>{' '}
                  <span className="text-primary">Pick as many as you like.</span>
                </h1>
                <div className="flex flex-col gap-xs">
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
                          'flex items-start gap-4 rounded-card border p-4 text-left',
                          on ? 'border-primary bg-primary/10' : 'border-outline-variant bg-low',
                        )}
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-container/20 text-primary">
                          <Icon name={icon} size={22} />
                        </span>
                        <span className="flex-1">
                          <span className="block t-body-md font-bold text-on-surface">{label}</span>
                          <span className="mt-1 block t-body-md text-on-variant">{blurb}</span>
                        </span>
                        {on ? (
                          <span className="text-primary">
                            <Icon name="check" size={22} />
                          </span>
                        ) : null}
                      </button>
                    )
                  })}
                </div>

                {ageGate ? (
                  <div role="alertdialog" aria-label="Age confirmation" className="card rounded-card p-md">
                    <p className="t-body-md text-on-surface">
                      Romance content is for adults. Confirm you're 18 or over.
                    </p>
                    <div className="mt-sm flex gap-xs">
                      <PrimaryButton
                        onClick={() => {
                          setAgeVerified(true)
                          toggleCategory('romance')
                          setAgeGate(false)
                        }}
                      >
                        I'm 18 or over
                      </PrimaryButton>
                      <PrimaryButton variant="outline" full={false} onClick={() => setAgeGate(false)}>
                        Not now
                      </PrimaryButton>
                    </div>
                  </div>
                ) : null}

                <div className="mt-auto flex gap-xs">
                  <PrimaryButton variant="outline" full={false} onClick={back}>
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
                <h1 className="max-w-[300px] t-headline-lg">
                  <span className="text-on-surface">Tonight, you do one thing.</span>{' '}
                  <span className="text-primary">That's the whole assignment.</span>
                </h1>
                <p className="max-w-[42ch] t-body-md text-on-variant">
                  Write down anything you remember when you wake up. Fragments count. Nothing
                  remembered counts too — log it and the streak holds.
                </p>
                <div className="card rounded-card p-md">
                  <p className="t-label-caps text-primary uppercase">Tomorrow morning</p>
                  <p className="mt-xs t-body-md font-bold text-on-surface">
                    Open the journal before you move.
                  </p>
                </div>
                <div className="mt-auto flex gap-xs">
                  <PrimaryButton variant="outline" full={false} onClick={back}>
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
