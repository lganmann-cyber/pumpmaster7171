import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Circle, Loader2, Moon } from 'lucide-react'
import { AppShell } from '../../components/AppShell'
import { DisplayHeadline } from '../../components/DisplayHeadline'
import { PrimaryButton } from '../../components/PrimaryButton'
import { RecordButton } from '../../components/RecordButton'
import { toast } from '../../components/Toast'
import { Waveform } from './Waveform'
import { useApp } from '../../store'
import { useMotionProfile } from '../../lib/motion'
import { useNow } from '../../lib/theme'
import { dateHeading, dayKey, formatClock, formatDuration } from '../../lib/time'
import { isRecall } from '../../lib/streak'
import { signHue, signIcon } from '../../lib/signIcons'
import { cx } from '../../lib/cx'
import type { Dream } from '../../lib/types'

type Phase = 'capture' | 'recording' | 'transcribing' | 'review'

/** No real transcription in v1 — a 2s delay and seeded text stands in for it. */
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
  const [people, setPeople] = useState('')
  const [places, setPlaces] = useState('')
  const [wasLucid, setWasLucid] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [audioSeconds, setAudioSeconds] = useState(0)
  const textarea = useRef<HTMLTextAreaElement>(null)

  // Arriving from the morning capture card: recording is already running by
  // the time the screen paints. One tap from home to talking.
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

  const resetDraft = () => {
    setDraft('')
    setSigns([])
    setPeople('')
    setPlaces('')
    setWasLucid(false)
    setEditingId(null)
    setElapsed(0)
    setAudioSeconds(0)
  }

  const startRecording = () => {
    resetDraft()
    setPhase('recording')
  }

  const stopRecording = () => {
    setAudioSeconds(elapsed)
    setPhase('transcribing')
    window.setTimeout(() => {
      setDraft(FAKE_TRANSCRIPTS[dreams.length % FAKE_TRANSCRIPTS.length])
      setPhase('review')
    }, 2000)
  }

  const save = () => {
    const payload = {
      transcript: draft.trim(),
      signs,
      people: splitList(people),
      places: splitList(places),
      wasLucid,
    }
    if (editingId) {
      updateDream(editingId, payload)
      toast('Entry updated')
    } else {
      addDream({ ...payload, wokeAt: new Date().toISOString(), clarity: 3 })
      toast(payload.transcript ? 'Dream saved' : 'Blank night saved')
    }
    resetDraft()
    setPhase('capture')
  }

  const saveBlank = () => {
    addDream({ transcript: '', wokeAt: new Date().toISOString(), clarity: 1 })
    toast('Blank night saved — streak held')
  }

  const openForReview = (d: Dream) => {
    setEditingId(d.id)
    setDraft(d.transcript)
    setSigns(d.signs)
    setPeople(d.people.join(', '))
    setPlaces(d.places.join(', '))
    setWasLucid(d.wasLucid)
    setAudioSeconds(estimateSeconds(d.transcript))
    setPhase('review')
    window.scrollTo({ top: 0, behavior: m.full ? 'smooth' : 'auto' })
  }

  const grouped = useMemo(() => groupByDay(dreams), [dreams])
  const recalledToday = dreams.filter(
    (d) => dayKey(d.wokeAt) === dayKey(now) && isRecall(d),
  ).length

  return (
    <AppShell>
      <header className="pt-6">
        <DisplayHeadline
          lead={recalledToday > 0 ? `${recalledToday} logged today` : 'Nothing logged'}
          accent={recalledToday > 0 ? 'Add another' : 'Talk before you move'}
        />
      </header>

      {/* Capture is the first thing on the screen — no intermediate step. */}
      <section className="mt-7 rounded-card bg-surface p-5 card-shadow">
        <AnimatePresence mode="wait">
          {phase === 'capture' || phase === 'recording' ? (
            <motion.div
              key="record"
              initial={m.full ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={m.t(180)}
              className="flex flex-col items-center gap-4"
            >
              <Waveform active={phase === 'recording'} />
              <RecordButton
                recording={phase === 'recording'}
                onToggle={phase === 'recording' ? stopRecording : startRecording}
              />
              <p className="t-clock text-muted">{formatDuration(elapsed)}</p>
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetDraft()
                    setPhase('review')
                    window.setTimeout(() => textarea.current?.focus(), 60)
                  }}
                  className="min-h-[44px] px-3 t-label text-purple-bright underline underline-offset-4"
                >
                  or type it
                </button>
                <button
                  type="button"
                  onClick={saveBlank}
                  className="min-h-[44px] px-3 t-meta text-muted"
                >
                  I don't remember anything
                </button>
              </div>
            </motion.div>
          ) : null}

          {phase === 'transcribing' ? (
            <motion.div
              key="transcribing"
              initial={m.full ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={m.t(180)}
              className="flex min-h-[220px] flex-col items-center justify-center gap-3"
            >
              <Loader2 size={28} className={cx('text-purple-bright', m.full && 'animate-spin')} />
              <p className="t-label text-muted">Writing it down</p>
            </motion.div>
          ) : null}

          {phase === 'review' ? (
            <motion.div
              key="review"
              initial={m.full ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={m.t(180)}
              className="flex flex-col gap-4"
            >
              <div>
                <label htmlFor="transcript" className="t-label text-muted">
                  {editingId ? 'Entry' : 'What you said'}
                </label>
                <textarea
                  id="transcript"
                  ref={textarea}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={6}
                  placeholder="Whatever you still have. Fragments are fine."
                  className="mt-2 w-full resize-none rounded-tile bg-sunken p-4 t-body text-ink placeholder:text-muted"
                />
                {audioSeconds > 0 ? (
                  <p className="mt-1 t-clock text-muted">{formatDuration(audioSeconds)} recorded</p>
                ) : null}
              </div>

              <fieldset>
                <legend className="t-label text-muted">Signs</legend>
                <div className="mt-2 flex flex-wrap gap-2">
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
                          'min-h-[44px] rounded-full px-4 t-meta font-medium',
                          on ? 'bg-purple text-inverse' : 'bg-sunken text-muted',
                        )}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <div className="grid gap-3 md:grid-cols-2">
                <TagInput label="People" value={people} onChange={setPeople} placeholder="Sam" />
                <TagInput
                  label="Places"
                  value={places}
                  onChange={setPlaces}
                  placeholder="My old house"
                />
              </div>

              <label className="flex min-h-[52px] items-center justify-between rounded-tile bg-sunken px-4">
                <span className="t-label text-ink">Was I lucid?</span>
                <input
                  type="checkbox"
                  checked={wasLucid}
                  onChange={(e) => setWasLucid(e.target.checked)}
                  className="size-6 accent-[var(--purple)]"
                />
              </label>

              <div className="flex gap-3">
                <PrimaryButton onClick={save}>{editingId ? 'Update entry' : 'Save'}</PrimaryButton>
                <button
                  type="button"
                  onClick={() => {
                    resetDraft()
                    setPhase('capture')
                  }}
                  className="min-h-[52px] shrink-0 rounded-full px-5 t-label text-muted"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      {/* Timeline */}
      <section className="mt-6">
        {dreams.length === 0 ? (
          <p className="rounded-card bg-surface p-5 t-body text-muted">
            Nothing here yet. Tomorrow morning, before you move, before you check your phone — talk
            into this.
          </p>
        ) : (
          grouped.map(([key, entries]) => (
            <div key={key} className="mb-4">
              <h2 className="sticky top-0 z-10 -mx-5 bg-canvas px-5 py-2 t-label font-semibold text-muted md:-mx-8 md:px-8">
                {dateHeading(entries[0].wokeAt, now)}
              </h2>
              <ul className="flex flex-col gap-2">
                {entries.map((d) => {
                  const Icon = signIcon(d.signs[0])
                  const tagged = d.signs.length > 0
                  const first = isRecall(d)
                    ? firstLine(d.transcript)
                    : 'Nothing remembered — logged anyway'
                  return (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => openForReview(d)}
                        className="flex w-full items-center gap-3 rounded-tile bg-sunken p-4 text-left"
                      >
                        <span
                          className={cx(
                            'grid size-10 shrink-0 place-items-center rounded-full',
                            {
                              purple: 'bg-purple-tint text-purple-bright',
                              blue: 'bg-blue-tint text-blue',
                              orange: 'bg-orange-tint text-orange',
                            }[signHue(d.signs[0])],
                          )}
                        >
                          {isRecall(d) ? (
                            <Icon size={18} strokeWidth={2} aria-hidden />
                          ) : (
                            <Moon size={18} strokeWidth={2} aria-hidden />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate t-body font-semibold text-ink">
                            {first}
                          </span>
                          <span className="mt-0.5 block t-meta text-muted">
                            <span className="mono">
                              {formatClock(new Date(d.wokeAt))} ·{' '}
                              {formatDuration(estimateSeconds(d.transcript))}
                            </span>
                            {d.wasLucid ? ' · lucid' : ''}
                          </span>
                        </span>
                        <span
                          className={cx(
                            'grid size-6 shrink-0 place-items-center rounded-full',
                            tagged ? 'bg-purple text-inverse' : 'text-muted',
                          )}
                          aria-label={tagged ? 'Tagged' : 'Not tagged'}
                        >
                          {tagged ? (
                            <Check size={14} strokeWidth={3} aria-hidden />
                          ) : (
                            <Circle size={20} strokeWidth={1.5} aria-hidden />
                          )}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))
        )}
      </section>
    </AppShell>
  )
}

function TagInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const id = `tag-${label.toLowerCase()}`
  return (
    <div>
      <label htmlFor={id} className="t-label text-muted">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-[48px] w-full rounded-tile bg-sunken px-4 t-body text-ink placeholder:text-muted"
      />
    </div>
  )
}

function splitList(v: string): string[] {
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function firstLine(t: string): string {
  const line = t.split(/(?<=[.!?])\s/)[0] ?? t
  return line.length > 90 ? `${line.slice(0, 89)}…` : line
}

/** No audio in v1, so the row's duration is derived from the transcript. */
function estimateSeconds(t: string): number {
  const words = t.trim() ? t.trim().split(/\s+/).length : 0
  return Math.max(4, Math.round((words / 2.6) * 10) / 10)
}

function groupByDay(dreams: Dream[]): [string, Dream[]][] {
  const map = new Map<string, Dream[]>()
  for (const d of [...dreams].sort((a, b) => (a.wokeAt < b.wokeAt ? 1 : -1))) {
    const k = dayKey(d.wokeAt)
    map.set(k, [...(map.get(k) ?? []), d])
  }
  return [...map.entries()]
}
