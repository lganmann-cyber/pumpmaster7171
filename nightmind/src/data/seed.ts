import type { AudioSession, Dream, DreamSign, LucidDuration, Unit } from '../lib/types'
import { addDays, startOfDay } from '../lib/time'

/* ── Dream signs ─────────────────────────────────────────────────────────
   The catalogue a user's own tells get filed into. Counts are recomputed
   from the dreams at render time, so these are just the labels. */
export const SIGN_CATALOGUE: DreamSign[] = [
  { id: 's_water', label: 'Water', count: 0, firstSeen: '' },
  { id: 's_teeth', label: 'Teeth', count: 0, firstSeen: '' },
  { id: 's_old-house', label: 'My old house', count: 0, firstSeen: '' },
  { id: 's_flying', label: 'Flying', count: 0, firstSeen: '' },
  { id: 's_late', label: 'Being late', count: 0, firstSeen: '' },
  { id: 's_phone', label: 'Phone not working', count: 0, firstSeen: '' },
  { id: 's_stairs', label: 'Stairs', count: 0, firstSeen: '' },
  { id: 's_sam', label: 'Sam', count: 0, firstSeen: '' },
  { id: 's_chased', label: 'Being chased', count: 0, firstSeen: '' },
  { id: 's_school', label: 'School', count: 0, firstSeen: '' },
  { id: 's_cat', label: 'A cat', count: 0, firstSeen: '' },
  { id: 's_mirror', label: 'Mirrors', count: 0, firstSeen: '' },
  { id: 's_car', label: 'Cars', count: 0, firstSeen: '' },
  { id: 's_lift', label: 'Lifts', count: 0, firstSeen: '' },
  { id: 's_sea', label: 'The sea', count: 0, firstSeen: '' },
  { id: 's_lost', label: 'Lost something', count: 0, firstSeen: '' },
]

type Template = {
  transcript: string
  signs: string[]
  people?: string[]
  places?: string[]
  clarity: 1 | 2 | 3 | 4 | 5
  lucid?: LucidDuration
}

/* 47 entries, newest first. One is a blank capture — "I don't remember
   anything" — which holds the streak without counting as a recall. */
const TEMPLATES: Template[] = [
  {
    transcript:
      'Standing in the shallow end of a pool that kept getting deeper the longer I looked at it. I could breathe fine underwater and it did not strike me as odd at the time.',
    signs: ['s_water'],
    places: ['Leisure centre'],
    clarity: 4,
  },
  {
    transcript:
      'Sam was driving and the brakes did nothing. We rolled through three junctions and nobody hit us. I remember checking my hands and counting six fingers, then losing it again.',
    signs: ['s_sam', 's_car'],
    people: ['Sam'],
    clarity: 5,
    lucid: 'seconds',
  },
  {
    transcript:
      'Back in the hallway of my old house. The stairs went up twice as far as they should and the carpet was the wrong green.',
    signs: ['s_old-house', 's_stairs'],
    places: ['My old house'],
    clarity: 3,
  },
  {
    transcript:
      'A cat sat on my chest and would not move. Every time I pushed it off it was already back. I woke up before I worked out whose cat it was.',
    signs: ['s_cat'],
    clarity: 3,
  },
  {
    transcript:
      'Late for something at a train station, and my phone would not unlock. The keypad kept sliding off the bottom of the screen.',
    signs: ['s_late', 's_phone'],
    places: ['Station'],
    clarity: 4,
  },
  {
    transcript:
      'Swimming out past a breakwater at night. The water was warm and there were lights under it, moving in a line.',
    signs: ['s_water', 's_sea'],
    clarity: 4,
  },
  {
    transcript:
      'One of my back teeth came loose in my hand and behind it there was another tooth already grown in. No pain, just admin.',
    signs: ['s_teeth'],
    clarity: 5,
  },
  {
    transcript:
      'Exam I had not studied for, in a room in my old school that was also a kitchen. Everyone else had finished.',
    signs: ['s_school', 's_late'],
    places: ['School'],
    clarity: 3,
  },
  {
    transcript:
      'I noticed the mirror was reflecting the room a half second behind. That was the moment it clicked — I knew I was dreaming. I got maybe forty seconds before it went grey.',
    signs: ['s_mirror'],
    clarity: 5,
    lucid: 'under-a-minute',
  },
  {
    transcript:
      'Flying low over a housing estate, more like swimming than flight. Had to keep kicking to stay up.',
    signs: ['s_flying'],
    clarity: 4,
  },
  {
    transcript:
      'Lift kept going past the floor I pressed. Doors opened on a car park each time and someone I could not see said "not yet".',
    signs: ['s_lift'],
    clarity: 3,
  },
  {
    transcript: 'Something about a beach and a dog. Fragments only, gone by the time I sat up.',
    signs: ['s_sea'],
    clarity: 1,
  },
  {
    transcript:
      'Being chased across the fields behind my old house. Whatever it was never got closer, and I stopped being scared halfway through.',
    signs: ['s_chased', 's_old-house'],
    clarity: 4,
  },
  {
    transcript:
      'My phone kept dialling the wrong person. Sam answered every time, from a different room in the same house.',
    signs: ['s_phone', 's_sam'],
    people: ['Sam'],
    clarity: 4,
  },
  {
    transcript:
      'Rain coming through the ceiling of a flat I have never lived in, filling it to my ankles. I was mostly annoyed about the carpet.',
    signs: ['s_water'],
    clarity: 3,
  },
  {
    transcript:
      'I lost my bag and spent the whole dream retracing a route through a city that kept rearranging itself.',
    signs: ['s_lost'],
    clarity: 3,
  },
  {
    transcript:
      'On a staircase that turned into an escalator going the other way. Took ages to get anywhere and then I was already at the top.',
    signs: ['s_stairs'],
    clarity: 3,
  },
  {
    transcript:
      'Standing at the edge of the sea while it went out much further than it should. Everyone on the beach carried on as normal.',
    signs: ['s_sea', 's_water'],
    clarity: 4,
  },
  {
    transcript:
      'Two of my front teeth were loose and I kept testing them with my tongue, trying not to make it worse.',
    signs: ['s_teeth'],
    clarity: 4,
  },
  {
    transcript:
      'Cat again, this time on the roof of my old house. It watched me the whole way up the drainpipe.',
    signs: ['s_cat', 's_old-house'],
    clarity: 3,
  },
  {
    transcript:
      'Missed a flight, then a coach, then a lift someone was holding for me. Woke up tired.',
    signs: ['s_late'],
    clarity: 2,
  },
  {
    transcript:
      'Did a reality check in the dream out of habit and my finger went straight through my palm. I said "right, okay" out loud and immediately woke myself up.',
    signs: ['s_mirror'],
    clarity: 5,
    lucid: 'seconds',
  },
  {
    transcript: '',
    signs: [],
    clarity: 1,
  },
  {
    transcript:
      'Driving a car from the back seat. It handled fine, which felt reasonable until I remembered it this morning.',
    signs: ['s_car'],
    clarity: 3,
  },
  {
    transcript:
      'Sam and I were painting a room in my old house that we have never been in together. The paint dried the wrong colour every time.',
    signs: ['s_sam', 's_old-house'],
    people: ['Sam'],
    clarity: 4,
  },
  {
    transcript: 'A canal, walking along it for a long time. Very calm, very little happened.',
    signs: ['s_water'],
    clarity: 2,
  },
  {
    transcript:
      'Lost my keys in a supermarket where every aisle led back to the entrance. Staff were sympathetic and no help.',
    signs: ['s_lost'],
    clarity: 3,
  },
  {
    transcript:
      'Flying over the sea, quite high, and completely unbothered about falling. Landed on a pier by choosing to.',
    signs: ['s_flying', 's_sea'],
    clarity: 5,
    lucid: 'minutes',
  },
  {
    transcript: 'Late for a shift at a job I left years ago. The bus went the wrong way on purpose.',
    signs: ['s_late'],
    clarity: 2,
  },
  {
    transcript:
      'Someone was following me through a multi-storey car park. I hid between two cars and woke up before anything happened.',
    signs: ['s_chased', 's_car'],
    clarity: 3,
  },
  {
    transcript: 'School corridor, lockers, the specific smell of it. Nobody I recognised.',
    signs: ['s_school'],
    places: ['School'],
    clarity: 3,
  },
  {
    transcript: 'Bath overflowing and I could not find the taps. Water was warm, not unpleasant.',
    signs: ['s_water'],
    clarity: 2,
  },
  {
    transcript:
      'A tooth came out clean and I put it in my pocket to deal with later. Woke up checking with my tongue.',
    signs: ['s_teeth'],
    clarity: 4,
  },
  {
    transcript: 'Stairs down to a basement in my old house that does not have a basement.',
    signs: ['s_stairs', 's_old-house'],
    clarity: 3,
  },
  {
    transcript: 'Phone screen was showing someone else entirely. Fragment, that is all I have.',
    signs: ['s_phone'],
    clarity: 1,
  },
  {
    transcript: 'A cat in the passenger seat of a car I was not driving. It seemed to be in charge.',
    signs: ['s_cat', 's_car'],
    clarity: 3,
  },
  {
    transcript: 'Swimming in a flooded street. Bright, warm, nobody worried about it.',
    signs: ['s_water'],
    clarity: 3,
  },
  {
    transcript: 'Lift with no buttons. Stood in it a while and it moved anyway.',
    signs: ['s_lift'],
    clarity: 2,
  },
  {
    transcript: 'Being chased through school, which became my old house halfway down a corridor.',
    signs: ['s_chased', 's_school', 's_old-house'],
    clarity: 4,
  },
  {
    transcript: 'Sam handed me something and I lost it immediately. Spent the rest of it looking.',
    signs: ['s_sam', 's_lost'],
    people: ['Sam'],
    clarity: 3,
  },
  {
    transcript: 'Sea, grey, from a clifftop. Not much else.',
    signs: ['s_sea'],
    clarity: 2,
  },
  {
    transcript: 'Late again, this time for something I could not name. Fragment.',
    signs: ['s_late'],
    clarity: 1,
  },
  {
    transcript: 'A mirror in my old house showing the room from the wrong side.',
    signs: ['s_mirror', 's_old-house'],
    clarity: 3,
  },
  {
    transcript: 'Trying to run and the ground was water. Fragment, thirty seconds of it at most.',
    signs: ['s_water', 's_chased'],
    clarity: 1,
  },
  {
    transcript: 'Something with stairs. Woke up before I could hold it.',
    signs: ['s_stairs'],
    clarity: 1,
  },
  {
    transcript: 'A cat, a doorway, my mum talking in another room. Very short.',
    signs: ['s_cat'],
    people: ['Mum'],
    clarity: 2,
  },
  {
    transcript: 'Flying, badly, about a metre off the ground. Woke up laughing.',
    signs: ['s_flying'],
    clarity: 3,
  },
]

/**
 * Six weeks of captures. The last twelve days are unbroken — that is the
 * live 12-day recall streak — with a missed day before it, so the streak
 * rule is visible in the data rather than asserted.
 */
const DAY_COUNTS: Record<number, number> = {
  0: 3, 1: 2, 2: 3, 3: 1, 4: 2, 5: 2, 6: 3, 7: 1, 8: 2, 9: 2, 10: 1, 11: 1,
  12: 0,
  13: 1, 14: 3, 15: 1, 16: 0, 17: 1, 18: 1, 19: 0, 20: 3, 21: 1, 22: 1,
  23: 0, 24: 1, 25: 1, 26: 0, 27: 1, 28: 1, 29: 0, 30: 1, 31: 0, 32: 1,
  33: 1, 34: 0, 35: 1, 36: 0, 37: 1, 38: 1, 39: 0, 40: 1, 41: 1,
}

const WAKE_MINUTES = [6 * 60 + 40, 7 * 60 + 10, 3 * 60 + 50, 5 * 60 + 20, 7 * 60 + 55]

function buildSeed(now = new Date()): Dream[] {
  const dreams: Dream[] = []
  let t = 0
  for (let daysAgo = 0; daysAgo <= 41 && t < TEMPLATES.length; daysAgo += 1) {
    const n = DAY_COUNTS[daysAgo] ?? 0
    for (let i = 0; i < n && t < TEMPLATES.length; i += 1) {
      const tpl = TEMPLATES[t]
      const day = startOfDay(addDays(now, -daysAgo))
      const woke = new Date(day)
      const mins = WAKE_MINUTES[(t + i) % WAKE_MINUTES.length] - i * 95
      woke.setMinutes(Math.max(60, mins))
      const created = new Date(woke.getTime() + (2 + (t % 5)) * 60_000)
      dreams.push({
        id: `seed_${t}`,
        createdAt: created.toISOString(),
        wokeAt: woke.toISOString(),
        transcript: tpl.transcript,
        signs: tpl.signs,
        people: tpl.people ?? [],
        places: tpl.places ?? [],
        wasLucid: Boolean(tpl.lucid),
        lucidDuration: tpl.lucid,
        clarity: tpl.clarity,
      })
      t += 1
    }
  }
  return dreams
}

export const SEED_DREAMS: Dream[] = buildSeed()

/* ── The lesson ladder (§5.4) ────────────────────────────────────────── */

const step = (title: string, detail: string) => ({ title, detail })

export const UNITS: Unit[] = [
  {
    id: 'recall',
    index: 1,
    title: 'Recall',
    blurb: 'Get the dreams out of your head and onto the page before they go.',
    hue: 'purple',
    lessons: [
      {
        id: 'recall-1',
        unitId: 'recall',
        title: 'Capture before you move',
        summary: 'The first ninety seconds decide how much you keep.',
        minutes: 5,
        level: 'Beginner',
        night: 1,
        body: 'Dream memory decays fast. Most of what you lose, you lose in the two minutes between waking and standing up. Tonight you change one thing: you talk into the app before you move, before you check anything else.',
        steps: [
          step('Stay in position', 'Do not roll over. Movement clears the buffer faster than anything else.'),
          step('Say the last image first', 'Start with whatever you can still see, not the beginning of the story.'),
          step('Talk in fragments', 'A list of nouns beats a tidy sentence. You can shape it later.'),
          step('Stop at thirty seconds', 'You are capturing, not writing. Tagging happens on review.'),
        ],
      },
      {
        id: 'recall-2',
        unitId: 'recall',
        title: 'The wake-still technique',
        summary: 'Keep your eyes shut and let the tail of the dream come back.',
        minutes: 6,
        level: 'Beginner',
        night: 2,
        body: 'Waking is a gradient, not a switch. If you keep your eyes closed and stay in the position you woke in, fragments keep arriving for about a minute. Most people stand up through that window.',
        steps: [
          step('Eyes closed, body still', 'Give it sixty seconds before you open them.'),
          step('Follow one thread', 'Pick a single image and pull. The rest tends to come attached.'),
          step('Then capture', 'Only reach for the phone once the thread stops giving.'),
        ],
      },
      {
        id: 'recall-3',
        unitId: 'recall',
        title: 'Writing the blank nights',
        summary: 'Nothing remembered is still an entry.',
        minutes: 4,
        level: 'Beginner',
        night: 3,
        body: 'The night you remember nothing is the night the habit is actually tested. Logging a blank keeps the streak and keeps the morning ritual intact, and blanks get rarer on their own.',
        steps: [
          step('Log it anyway', 'One tap. "Nothing this morning" is a complete entry.'),
          step('Note the position you woke in', 'Over a few weeks this correlates more than you would expect.'),
        ],
      },
      {
        id: 'recall-4',
        unitId: 'recall',
        title: 'Recall tiers',
        summary: 'Where you are on the ladder, and what moves you up it.',
        minutes: 7,
        level: 'Beginner',
        night: 5,
        body: 'Your tier is a seven-day rolling average of dreams recalled per night. It moves within days, which is the point — it is the one number in this app that responds to what you did last night.',
        steps: [
          step('Tier one: fragments', 'Images without story. Almost everyone starts here.'),
          step('Tier three: steady recall', 'One a night, most nights, with a beginning and an end.'),
          step('Tier five: full nights', 'Three or more, with detail you can navigate later.'),
        ],
      },
      {
        id: 'recall-5',
        unitId: 'recall',
        title: 'Reviewing the week',
        summary: 'Read back seven days and mark what repeats.',
        minutes: 8,
        level: 'Beginner',
        night: 7,
        body: 'Once a week, read the last seven entries in one sitting. You are not looking for meaning. You are looking for repeats — the same building, the same person, the same failure of a phone to work.',
        steps: [
          step('Read all seven at once', 'Patterns show at volume, not one entry at a time.'),
          step('Tag repeats as signs', 'Anything that shows twice goes in the constellation.'),
          step('Leave interpretation out', 'What it means is a different hobby.'),
        ],
      },
    ],
  },
  {
    id: 'signs',
    index: 2,
    title: 'Signs',
    blurb: 'Find the things that keep showing up, and learn to catch them.',
    hue: 'blue',
    lessons: [
      {
        id: 'signs-1',
        unitId: 'signs',
        title: 'What a dream sign is',
        summary: 'Your tells, not a symbol dictionary.',
        minutes: 5,
        level: 'Beginner',
        night: 8,
        body: 'A dream sign is anything that turns up in your dreams far more often than in your life. It is personal. Water, a particular house, a phone that will not work. It is useful because it is repeated, not because it means anything.',
        steps: [
          step('Pull from your own entries', 'Only tag what you have actually logged twice.'),
          step('Keep labels concrete', 'Teeth, not anxiety. Stairs, not obstacles.'),
        ],
      },
      {
        id: 'signs-2',
        unitId: 'signs',
        title: 'Reality checks that work',
        summary: 'Two checks, done properly, beat ten done on autopilot.',
        minutes: 6,
        level: 'Beginner',
        night: 9,
        body: 'A reality check only works if you genuinely expect it might come back strange. Done as a reflex, it becomes another dream action that proves nothing.',
        steps: [
          step('Push a finger into your palm', 'Expect it to go through. Wait for the answer.'),
          step('Read text twice', 'Text is unstable in dreams. Look away and look back.'),
          step('Ask what the last hour was', 'If you cannot account for it, check harder.'),
        ],
      },
      {
        id: 'signs-3',
        unitId: 'signs',
        title: 'Anchoring checks to signs',
        summary: 'Check when your own tells appear, not on a timer.',
        minutes: 6,
        level: 'Intermediate',
        night: 11,
        body: 'A timer trains you to check at random. Anchoring to your signs trains you to check exactly when a dream is most likely to be running.',
        steps: [
          step('Pick your top three signs', 'The biggest nodes in your constellation.'),
          step('Check whenever one appears awake', 'See water, do a check. Every time.'),
        ],
      },
      {
        id: 'signs-4',
        unitId: 'signs',
        title: 'Reading the constellation',
        summary: 'Clusters mean more than counts.',
        minutes: 7,
        level: 'Intermediate',
        night: 13,
        body: 'Two signs joined by a line have shown up in the same dream. Tight clusters are the ones worth anchoring checks to — they tend to appear together, so one gives you a second chance at the other.',
        steps: [
          step('Find your densest cluster', 'Most lines, not biggest circle.'),
          step('Anchor to the cluster', 'Any member of it is a cue.'),
        ],
      },
      {
        id: 'signs-5',
        unitId: 'signs',
        title: 'Checks that survive a dream',
        summary: 'Building the habit so it fires while you are asleep.',
        minutes: 5,
        level: 'Intermediate',
        night: 15,
        body: 'The habit has to be boring and constant before it shows up at night. Five a day, anchored, for two weeks is the dose that tends to work.',
        steps: [
          step('Five a day', 'Anchored to signs, spread across the day.'),
          step('Never skip the doubt', 'The half second of genuine uncertainty is the active ingredient.'),
        ],
      },
      {
        id: 'signs-6',
        unitId: 'signs',
        title: 'When a sign stops repeating',
        summary: 'Signs drift. Re-cut them every few weeks.',
        minutes: 4,
        level: 'Intermediate',
        night: 18,
        body: 'Dream content follows your life. A sign that carried you for a month can go quiet. Re-read the last two weeks and re-cut your top three.',
        steps: [
          step('Re-read fortnightly', 'Same reading pass as the weekly review, wider window.'),
          step('Drop dead signs', 'If it has not appeared in two weeks, stop anchoring to it.'),
        ],
      },
    ],
  },
  {
    id: 'mild',
    index: 3,
    title: 'Intention',
    blurb: 'MILD — set a specific intention as you fall back asleep.',
    hue: 'orange',
    lessons: [
      {
        id: 'mild-1',
        unitId: 'mild',
        title: 'What MILD actually is',
        summary: 'Prospective memory, not affirmation.',
        minutes: 6,
        level: 'Intermediate',
        night: 20,
        body: 'Mnemonic induction is a memory technique: you are rehearsing the act of noticing, so the noticing fires later. It has nothing to do with belief and everything to do with specificity.',
        steps: [
          step('Use one sentence', '"Next time I see water, I will know I am dreaming."'),
          step('Rehearse the moment', 'Picture the sign, then picture yourself catching it.'),
        ],
      },
      {
        id: 'mild-2',
        unitId: 'mild',
        title: 'Writing the intention',
        summary: 'Name the sign, name the action.',
        minutes: 5,
        level: 'Intermediate',
        night: 21,
        body: 'Vague intentions do nothing. The sentence needs a specific cue from your own constellation and a specific response.',
        steps: [
          step('Pick tonight’s sign', 'One, from your top three.'),
          step('Say it four or five times', 'Then let it go and sleep. Straining keeps you awake.'),
        ],
      },
      {
        id: 'mild-3',
        unitId: 'mild',
        title: 'Rehearsing a past dream',
        summary: 'Replay last night and insert the catch.',
        minutes: 7,
        level: 'Intermediate',
        night: 23,
        body: 'Take a dream you logged this week, replay it as you fall asleep, and at the point the sign appears, insert the moment you notice. You are rehearsing a specific save, not a general hope.',
        steps: [
          step('Pick a recent entry', 'Something with a clear sign in it.'),
          step('Replay to the sign', 'Then rewrite the next beat: you notice.'),
        ],
      },
      {
        id: 'mild-4',
        unitId: 'mild',
        title: 'Timing the attempt',
        summary: 'Late-night REM is where this pays off.',
        minutes: 5,
        level: 'Intermediate',
        night: 25,
        body: 'MILD works best on a return to sleep, not at bedtime — REM periods are longer and closer together in the second half of the night.',
        steps: [
          step('Try it after a natural waking', 'Any time after about four hours.'),
          step('Keep the light off', 'Night Shift exists for this.'),
        ],
      },
      {
        id: 'mild-5',
        unitId: 'mild',
        title: 'Keeping it low effort',
        summary: 'Trying hard keeps you awake, which costs you REM.',
        minutes: 4,
        level: 'Intermediate',
        night: 28,
        body: 'The most common failure is effort. Rehearse, then drop it. If you are still awake twenty minutes later you have overcooked it.',
        steps: [step('Rehearse, then release', 'Sleep is the goal of the next five minutes.')],
      },
    ],
  },
  {
    id: 'wbtb',
    index: 4,
    title: 'The 3am window',
    blurb: 'WBTB — wake briefly in late-night REM, then go back down.',
    hue: 'purple',
    lessons: [
      {
        id: 'wbtb-1',
        unitId: 'wbtb',
        title: 'Why the middle of the night',
        summary: 'REM gets longer as the night goes on.',
        minutes: 6,
        level: 'Intermediate',
        night: 30,
        body: 'Your first REM period is a few minutes. Your last can run forty. Waking briefly in the back half and returning to sleep puts you straight into long REM with your mind slightly switched on.',
        steps: [
          step('Set the alarm four to five hours after sleep', 'Not earlier.'),
          step('Stay up ten to twenty minutes', 'Long enough to be lucid-awake, short enough to fall back.'),
        ],
      },
      {
        id: 'wbtb-2',
        unitId: 'wbtb',
        title: 'Setting the alarm',
        summary: 'Quiet, close, and one snooze away from ruining it.',
        minutes: 4,
        level: 'Intermediate',
        night: 31,
        body: 'The alarm has to wake you without launching you. Low volume, short, and no snooze — a second alarm at full volume undoes the whole attempt.',
        steps: [
          step('Lowest volume that works', 'You are aiming for half awake.'),
          step('No screens beyond this app', 'Night Shift engages automatically in that window.'),
        ],
      },
      {
        id: 'wbtb-3',
        unitId: 'wbtb',
        title: 'What to do while awake',
        summary: 'Read one entry, set one intention, lie back down.',
        minutes: 5,
        level: 'Intermediate',
        night: 33,
        body: 'The awake window has one job: bring your intention back online. Reading a single one of your own dreams does that faster than anything else.',
        steps: [
          step('Read one entry', 'Yours, recent, with a sign in it.'),
          step('Set the sentence', 'Then lie down in your usual position.'),
        ],
      },
      {
        id: 'wbtb-4',
        unitId: 'wbtb',
        title: 'When to skip it',
        summary: 'Sleep debt beats technique. Skip on bad nights.',
        minutes: 4,
        level: 'Intermediate',
        night: 35,
        body: 'WBTB costs sleep. On a short night, or before an early start, skip it. The recall work continues regardless, and that is what your streak is measuring.',
        steps: [step('Two or three nights a week', 'Not every night. This is the sustainable dose.')],
      },
    ],
  },
  {
    id: 'wild',
    index: 5,
    title: 'Falling in awake',
    blurb: 'WILD — hold a thread of attention across the sleep boundary.',
    hue: 'blue',
    lessons: [
      {
        id: 'wild-1',
        unitId: 'wild',
        title: 'The boundary',
        summary: 'What it feels like when the body goes and you stay.',
        minutes: 7,
        level: 'Advanced',
        night: 38,
        body: 'Falling asleep with attention intact produces a set of sensations most people find alarming the first time: buzzing, heaviness, sounds that are not there. None of it is dangerous and all of it passes.',
        steps: [
          step('Expect the noise', 'Buzzing and pressure are the boundary, not a problem.'),
          step('Do not check your body', 'Attention on the body pulls you back awake.'),
        ],
      },
      {
        id: 'wild-2',
        unitId: 'wild',
        title: 'Holding a thread',
        summary: 'One quiet object of attention, held loosely.',
        minutes: 6,
        level: 'Advanced',
        night: 40,
        body: 'Counting, a shape, a sound — pick one and hold it lightly. Gripping it keeps you awake; dropping it entirely means you just fall asleep.',
        steps: [step('Count breaths to ten and restart', 'Lose count, start again, no drama.')],
      },
      {
        id: 'wild-3',
        unitId: 'wild',
        title: 'Hypnagogic imagery',
        summary: 'Watch it. Do not steer it.',
        minutes: 6,
        level: 'Advanced',
        night: 42,
        body: 'Images arrive on their own as you cross. Watching them passively lets them build into a scene. Directing them wakes you up.',
        steps: [step('Observe, do not edit', 'The moment you push, you are awake again.')],
      },
      {
        id: 'wild-4',
        unitId: 'wild',
        title: 'Entering the scene',
        summary: 'Wait until it has depth before you step in.',
        minutes: 5,
        level: 'Advanced',
        night: 44,
        body: 'Entering too early collapses the scene. Wait until it has sound and depth, then move into it as though you were already there.',
        steps: [step('Wait for three senses', 'Then move, gently.')],
      },
      {
        id: 'wild-5',
        unitId: 'wild',
        title: 'Sleep paralysis, plainly',
        summary: 'What it is, and how to end it in ten seconds.',
        minutes: 6,
        level: 'Advanced',
        night: 46,
        body: 'REM atonia switching on before you are asleep, or off after you wake, is common and harmless. It ends on its own, and you can end it faster by moving a finger or a toe.',
        steps: [
          step('Move one small muscle', 'A finger, a toe, an eye.'),
          step('Or let it run', 'It resolves in under a minute either way.'),
        ],
      },
      {
        id: 'wild-6',
        unitId: 'wild',
        title: 'When to stop trying',
        summary: 'Two attempts a week, maximum.',
        minutes: 4,
        level: 'Advanced',
        night: 48,
        body: 'This technique costs the most sleep and works the least reliably. Cap it, and keep the recall work running underneath.',
        steps: [step('Cap at two nights a week', 'Recall is still the thing that compounds.')],
      },
    ],
  },
  {
    id: 'staying',
    index: 6,
    title: 'Staying in',
    blurb: 'Stabilise the dream once you know you are in one.',
    hue: 'orange',
    lessons: [
      {
        id: 'staying-1',
        unitId: 'staying',
        title: 'The first ten seconds',
        summary: 'Excitement ends more lucid dreams than anything else.',
        minutes: 5,
        level: 'Intermediate',
        night: 50,
        body: 'The moment you notice, the dream usually starts to go. Almost always because you got excited. Calm down first, do everything else second.',
        steps: [step('Say what you see out loud', 'It slows you down and anchors the scene.')],
      },
      {
        id: 'staying-2',
        unitId: 'staying',
        title: 'Rubbing your hands',
        summary: 'Touch is the fastest stabiliser.',
        minutes: 4,
        level: 'Intermediate',
        night: 51,
        body: 'Rubbing your hands together generates constant tactile input, which competes with the waking-up signal. It is the single most reliable technique here.',
        steps: [step('Rub, and keep rubbing', 'Through the whole transition, not for two seconds.')],
      },
      {
        id: 'staying-3',
        unitId: 'staying',
        title: 'Spinning',
        summary: 'For when the scene is already fading.',
        minutes: 5,
        level: 'Intermediate',
        night: 53,
        body: 'Spinning on the spot breaks the visual field and often rebuilds it somewhere else. Use it when the picture greys out, not when it is stable.',
        steps: [step('Spin, then expect a new scene', 'Do not expect the same room back.')],
      },
      {
        id: 'staying-4',
        unitId: 'staying',
        title: 'Re-entry',
        summary: 'Lie still and you often get back in.',
        minutes: 5,
        level: 'Intermediate',
        night: 55,
        body: 'When a lucid dream ends, staying completely still with your eyes closed gets you back into it more often than not. Most people move and lose the chance.',
        steps: [step('Do not move, do not open your eyes', 'Hold for a minute before you give up.')],
      },
      {
        id: 'staying-5',
        unitId: 'staying',
        title: 'Logging what happened',
        summary: 'Duration, clarity, what ended it.',
        minutes: 5,
        level: 'Intermediate',
        night: 57,
        body: 'Log lucid dreams the same way as everything else, plus what ended it. Over a few months the pattern in what ends them is the most useful thing you own.',
        steps: [step('Note the ending', 'Excitement, waking, or the scene collapsing.')],
      },
    ],
  },
  {
    id: 'doing',
    index: 7,
    title: 'Doing things',
    blurb: 'What you do with it once you are in. Branches by what you chose.',
    hue: 'purple',
    lessons: [
      {
        id: 'doing-general',
        unitId: 'doing',
        title: 'Deciding before you sleep',
        summary: 'A plan you already made survives the excitement.',
        minutes: 6,
        level: 'Advanced',
        night: 60,
        category: 'general',
        body: 'Lucidity is short and the first thing most people do is stand there. Choosing one thing before bed means you act instead of deliberating.',
        steps: [step('One thing, decided in advance', 'Write it down before you sleep.')],
      },
      {
        id: 'doing-skills',
        unitId: 'doing',
        title: 'Rehearsing a skill',
        summary: 'Motor rehearsal, without the equipment.',
        minutes: 7,
        level: 'Advanced',
        night: 62,
        category: 'skills',
        body: 'Rehearsing a physical skill in a dream activates a lot of the same machinery as rehearsing it awake. Keep it simple and repetitive — a serve, a scale, one phrase.',
        steps: [step('Pick one repeatable movement', 'Repetition beats variety here.')],
      },
      {
        id: 'doing-nightmares',
        unitId: 'doing',
        title: 'Turning to face it',
        summary: 'Recurring nightmares change when you stop running.',
        minutes: 8,
        level: 'Advanced',
        night: 64,
        category: 'nightmares',
        body: 'In a recurring nightmare, becoming lucid gives you one option you never had: stop, turn around, and ask what it wants. This is well-documented practice and it usually changes the dream permanently. If nightmares are frequent and severe, this is worth doing alongside a professional, not instead of one.',
        steps: [
          step('Stop running', 'That alone often ends the chase.'),
          step('Ask a direct question', 'Then let it answer, however strange the answer is.'),
        ],
      },
      {
        id: 'doing-romance',
        unitId: 'doing',
        title: 'Intimacy and dream figures',
        summary: 'What holds up, and what tends to wake you.',
        minutes: 6,
        level: 'Advanced',
        night: 66,
        category: 'romance',
        body: 'Heightened arousal of any kind is the most common way a lucid dream ends early. The practical lesson is regulation — the same stabilising work as everywhere else, applied to a state that fights it harder.',
        steps: [
          step('Stabilise first', 'Hands, breath, one object of attention.'),
          step('Expect a short window', 'Plan for it ending, so it ending is not a failure.'),
        ],
      },
    ],
  },
]

export const LESSONS = UNITS.flatMap((u) => u.lessons)

/* ── Guided sessions (§5.6) ──────────────────────────────────────────── */

export const SESSIONS: AudioSession[] = [
  {
    id: 'sess-winddown',
    title: 'Wind-down',
    kind: 'Wind-down',
    seconds: 12 * 60,
    description: 'Twelve minutes of nothing much, to get you off the phone and into bed.',
  },
  {
    id: 'sess-intention',
    title: 'Setting the sentence',
    kind: 'Intention',
    seconds: 8 * 60,
    description: 'Builds tonight’s intention around a sign from your own entries.',
  },
  {
    id: 'sess-wbtb',
    title: 'The 3am window',
    kind: 'Wake-back-to-bed',
    seconds: 15 * 60,
    description: 'For the middle of the night. Amber screen, low voice, no music.',
  },
  {
    id: 'sess-return',
    title: 'Back to sleep',
    kind: 'Return to sleep',
    seconds: 20 * 60,
    description: 'For when you have woken up and want the rest of the night back.',
  },
]
