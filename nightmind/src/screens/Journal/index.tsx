import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell } from '../../components/AppShell'
import { Icon } from '../../components/Icon'
import { PrimaryButton } from '../../components/PrimaryButton'
import { RecordButton } from '../../components/RecordButton'
import { toast } from '../../components/Toast'
import { useApp } from '../../store'
import { useMotionProfile } from '../../lib/motion'
import { useNow } from '../../lib/theme'
import { dateHeading, dayKey, formatClock, formatDuration } from '../../lib/time'
import { isRecall } from '../../lib/streak'
import { signIcon, signTone } from '../../lib/signIcons'
import { cx } from '../../lib/cx'
import type { Dream } from '../../lib/types'

type Phase = 'capture' | 'recording' | 'transcribing' | 'review'

/** No real transcription in v1 — a 2s delay and seeded text stands in. */
const FAKE_TRANSCRIPTS = [
  'I was in a corridor that kept changing length. Someone I could not see was talking in the next room and the light was wrong.',
  'On a beach at night, walking towards water that never got closer. My phone would not turn on.',
  'Back in the house I grew up in, but the stairs went the wrong way and the kitchen was on the top floor.',
]

export function Journal() {
  const now = useNow()
  const location = useLocation()
  const m = useMotionProfile()
  const dreams = useApp((s) => s.dreams)
  const signCatalogue = useApp((s) => s.signCatalogue)
  const addDream = useApp((s) => s.addDream)
  const updateDream = useApp((s) => s.updateDream)

  const [phase, setPhase] = useState<Phase>('capture')
  const [elapsed, setElapsed] = useState(0)
  const [draft, setDraft] = useState('')
  const [signs, setSigns] = useState<string[]>([])
  const [wasLucid, setWasLucid] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const textarea = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if ((location.state as { autoRecord?: boolean } | null)?.autoRecord) {
      setPhase('recording')
      window.history.replaceState({}, '')
    }
  }, [location.state])

  useEffect(() => {
    if (phase !== 'recording') return
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => window.clearInterval(id)
  }, [phase])

  const reset = () => {
    setDraft('')
    setSigns([])
    setWasLucid(false)
    setEditingId(null)
    setElapsed(0)
  }

  const stopRecording = () => {
    setPhase('transcribing')
    window.setTimeout(() => {
      setDraft(FAKE_TRANSCRIPTS[dreams.length % FAKE_TRANSCRIPTS.length])
      setPhase('review')
    }, 2000)
  }

  const save = () => {
    const payload = { transcript: draft.trim(), signs, wasLucid }
    if (editingId) {
      updateDream(editingId, payload)
      toast('Entry updated')
    } else {
      addDream({ ...payload, wokeAt: new Date().toISOString(), clarity: 3 })
      toast(payload.transcript ? 'Dream saved' : 'Blank night saved')
    }
    reset()
    setPhase('capture')
  }

  const openForReview = (d: Dream) => {
    setEditingId(d.id)
    setDraft(d.transcript)
    setSigns(d.signs)
    setWasLucid(d.wasLucid)
    setPhase('review')
    window.scrollTo({ top: 0, behavior: m.full ? 'smooth' : 'auto' })
  }

  const grouped = useMemo(() => groupByDay(dreams), [dreams])

  return (
    <AppShell>
      <h2 className="t-headline-lg">
        <span className="text-on-surface">Journal</span>
        <span className="text-primary">.</span>
      </h2>

      {/* Capture — the first thing on the screen, no intermediate step */}
      <section className="flex flex-col items-center justify-center py-sm">
        <AnimatePresence mode="wait">
          {phase === 'capture' || phase === 'recording' ? (
            <motion.div
              key="record"
              initial={m.full ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={m.t(180)}
              className="flex flex-col items-center"
            >
              <RecordButton
                recording={phase === 'recording'}
                onToggle={phase === 'recording' ? stopRecording : () => setPhase('recording')}
              />
              {phase === 'recording' ? (
                <p className="mt-md t-stats-sm text-primary">{formatDuration(elapsed)}</p>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  reset()
                  setPhase('review')
                  window.setTimeout(() => textarea.current?.focus(), 60)
                }}
                className="mt-md t-label-caps text-on-variant underline decoration-outline-variant underline-offset-4"
              >
                or type it
              </button>
              <button
                type="button"
                onClick={() => {
                  addDream({ transcript: '', wokeAt: new Date().toISOString(), clarity: 1 })
                  toast('Blank night saved — streak held')
                }}
                className="mt-xs t-label-caps text-on-variant opacity-60"
              >
                I don't remember anything
              </button>
            </motion.div>
          ) : null}

          {phase === 'transcribing' ? (
            <motion.div
              key="transcribing"
              initial={m.full ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={m.t(180)}
              className="flex h-[168px] flex-col items-center justify-center gap-3"
            >
              <span className={cx('text-primary', m.full && 'animate-pulse')}>
                <Icon name="graphic_eq" size={32} />
              </span>
              <p className="t-label-caps text-on-variant">Writing it down</p>
            </motion.div>
          ) : null}

          {phase === 'review' ? (
            <motion.div
              key="review"
              initial={m.full ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={m.t(180)}
              className="flex w-full flex-col gap-sm"
            >
              <label htmlFor="transcript" className="t-label-caps text-on-variant uppercase">
                {editingId ? 'Entry' : 'What you said'}
              </label>
              <textarea
                id="transcript"
                ref={textarea}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={6}
                placeholder="Whatever you still have. Fragments are fine."
                className="w-full resize-none rounded-xl border border-outline-variant bg-low p-4 t-body-md text-on-surface placeholder:text-on-variant/60 focus:border-primary"
              />

              <fieldset className="flex flex-col gap-xs">
                <legend className="t-label-caps text-on-variant uppercase">Signs</legend>
                <div className="mt-xs flex flex-wrap gap-2">
                  {signCatalogue.map((s) => {
                    const on = signs.includes(s.id)
                    return (
                      <button
                        key={s.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setSigns(on ? signs.filter((x) => x !== s.id) : [...signs, s.id])
                        }
                        className={cx(
                          'min-h-[36px] rounded-full border px-3 t-label-caps',
                          on
                            ? 'border-primary bg-primary text-on-primary-container'
                            : 'border-outline-variant text-on-variant',
                        )}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              {/* The oversized lucidity toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={wasLucid}
                onClick={() => setWasLucid((v) => !v)}
                className={cx(
                  'flex items-center justify-between rounded-card border p-4 text-left',
                  wasLucid ? 'border-primary bg-primary/10' : 'border-outline-variant bg-low',
                )}
              >
                <span className="t-body-md font-bold text-on-surface">Was I lucid?</span>
                <span
                  className={cx(
                    'relative h-8 w-14 rounded-full transition-colors',
                    wasLucid ? 'bg-primary' : 'bg-variant',
                  )}
                >
                  <span
                    className={cx(
                      'absolute top-1 size-6 rounded-full bg-background transition-all',
                      wasLucid ? 'left-7' : 'left-1',
                    )}
                  />
                </span>
              </button>

              <div className="flex gap-xs">
                <PrimaryButton onClick={save}>{editingId ? 'Update' : 'Save'}</PrimaryButton>
                <PrimaryButton
                  variant="outline"
                  full={false}
                  onClick={() => {
                    reset()
                    setPhase('capture')
                  }}
                >
                  Cancel
                </PrimaryButton>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      {/* Timeline */}
      <section className="flex flex-col gap-sm">
        {dreams.length === 0 ? (
          <p className="card rounded-card p-md t-body-md text-on-variant">
            Nothing here yet. Tomorrow morning, before you move, before you check your phone — talk
            into this.
          </p>
        ) : (
          grouped.map(([key, entries]) => (
            <div key={key} className="flex flex-col gap-base">
              <div className="flex items-center gap-sm py-xs">
                <span className="h-px flex-grow bg-outline-variant" />
                <span className="t-label-caps tracking-widest text-on-variant uppercase">
                  {dateHeading(entries[0].wokeAt, now)}
                </span>
                <span className="h-px flex-grow bg-outline-variant" />
              </div>

              {entries.map((d) => {
                const tagged = d.signs.length > 0
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => openForReview(d)}
                    className="flex items-center gap-sm rounded-xl border border-outline-variant bg-low p-4 text-left"
                  >
                    <span
                      className={cx(
                        'grid size-10 shrink-0 place-items-center rounded-lg',
                        signTone(d.signs[0]),
                      )}
                    >
                      <Icon name={isRecall(d) ? signIcon(d.signs[0]) : 'bedtime'} size={22} />
                    </span>
                    <span className="min-w-0 flex-grow">
                      <span className="block truncate t-body-md font-bold text-on-surface">
                        {isRecall(d) ? firstLine(d.transcript) : 'Nothing remembered'}
                      </span>
                      <span className="mt-1 block t-stats-sm text-on-variant">
                        {formatClock(new Date(d.wokeAt))} •{' '}
                        {isRecall(d) ? formatDuration(estimateSeconds(d.transcript)) : 'Blank log'}
                      </span>
                    </span>
                    <span className={tagged ? 'text-primary' : 'text-on-variant/40'}>
                      <Icon name={tagged ? 'check_circle' : 'circle'} size={24} fill={tagged} />
                    </span>
                  </button>
                )
              })}
            </div>
          ))
        )}
      </section>

      {/* Practitioner tip */}
      <section className="card relative overflow-hidden rounded-card p-md">
        <div className="flex flex-col gap-xs">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-md bg-primary/10 px-2 py-1 t-label-caps text-primary">
              PRACTITIONER TIP
            </span>
            <span className="t-stats-sm text-primary">#LD-04</span>
          </div>
          <h4 className="mt-xs t-headline-sm text-on-surface">Recall optimization</h4>
          <p className="t-body-md text-on-variant">
            Log within 60 seconds of waking. Audio holds more detail than text, and the first
            minute is where most of a dream is lost.
          </p>
        </div>
      </section>
    </AppShell>
  )
}

function firstLine(t: string): string {
  const line = t.split(/(?<=[.!?])\s/)[0] ?? t
  return line.length > 60 ? `${line.slice(0, 59)}…` : line
}

/** No audio in v1, so a row's duration is derived from the transcript. */
function estimateSeconds(t: string): number {
  const words = t.trim() ? t.trim().split(/\s+/).length : 0
  return Math.max(4, Math.round(words / 2.6))
}

function groupByDay(dreams: Dream[]): [string, Dream[]][] {
  const map = new Map<string, Dream[]>()
  for (const d of [...dreams].sort((a, b) => (a.wokeAt < b.wokeAt ? 1 : -1))) {
    const k = dayKey(d.wokeAt)
    map.set(k, [...(map.get(k) ?? []), d])
  }
  return [...map.entries()]
}
