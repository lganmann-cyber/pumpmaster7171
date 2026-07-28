// Drives the running dev server the way a person on a phone would: real taps,
// real navigation, a screenshot at every stop. Chromium with an iPhone device
// descriptor — this container has no xcrun/emulator, so this is the closest
// thing to a handset available here.
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE ?? 'http://127.0.0.1:5180'
const OUT = process.env.OUT ?? '/tmp/claude-0/-home-user-pumpmaster7171/5d444a5e-3168-5d61-a599-02206a66e10d/scratchpad/sim'
mkdirSync(OUT, { recursive: true })

const phone = devices['iPhone 14 Pro']
const browser = await chromium.launch()
const ctx = await browser.newContext({ ...phone, colorScheme: 'light' })
const page = await ctx.newPage()

const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`))
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`))

let n = 0
const shot = async (name) => {
  await page.waitForTimeout(650)
  const file = `${OUT}/${String(++n).padStart(2, '0')}-${name}.png`
  await page.screenshot({ path: file })
  console.log(`  shot ${file}`)
}
// Any node whose text is wider than its box is being clipped by `truncate`.
// A trailing ellipsis on a label is copy that doesn't fit, not a design choice.
const clipped = async (where) => {
  const hits = await page.evaluate(() =>
    [...document.querySelectorAll('*')]
      .filter((el) => !el.children.length && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0)
      .map((el) => `${el.textContent.trim().slice(0, 40)} (${el.clientWidth}px box, ${el.scrollWidth}px text)`),
  )
  for (const h of hits) console.log(`  CLIPPED on ${where}: ${h}`)
}

const tap = async (locator, label) => {
  await locator.first().tap()
  console.log(`  tapped ${label}`)
}

console.log('→ cold open')
await page.goto(BASE, { waitUntil: 'networkidle' })
await shot('onboarding-1')

// Onboarding is five steps and the app will not route past it until finished.
await tap(page.getByRole('button', { name: 'Continue' }), 'Continue')
await shot('onboarding-2-recall')
await tap(page.getByRole('button', { name: 'One or two' }), 'recall tier')
await tap(page.getByRole('button', { name: 'Continue' }), 'Continue')
await shot('onboarding-3-wake')
await tap(page.getByRole('button', { name: 'Continue' }), 'Continue')
await shot('onboarding-4-intent')
await tap(page.getByRole('button', { name: /^Skills/ }), 'a category')
await shot('onboarding-4-picked')
const start = page.getByRole('button', { name: 'Start' })
if (!(await start.count())) await tap(page.getByRole('button', { name: 'Continue' }), 'Continue')
await shot('onboarding-5-assignment')
await tap(page.getByRole('button', { name: 'Start' }), 'Start')

console.log('→ home')
await page.waitForURL(`${BASE}/`)
await shot('home')
await clipped('home')

// The stat row and the tint grid are the two places that overflowed before.
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
console.log(`  horizontal overflow: ${overflow}px`)

console.log('→ reality check tile (mutates state)')
await tap(page.getByRole('button', { name: /Reality check/ }), 'Reality check')
await shot('home-check-logged')

console.log('→ session player')
await tap(page.getByRole('button', { name: /Set the sentence/ }), 'Set the sentence')
await shot('player')
const playerBg = await page.evaluate(() => {
  const el = document.querySelector('[data-player], [role="dialog"]')
  return el ? getComputedStyle(el).backgroundColor : 'no player element found'
})
console.log(`  player backdrop: ${playerBg}`)
await page.keyboard.press('Escape')
await shot('player-closed')

console.log('→ journal')
await tap(page.getByRole('link', { name: 'Journal' }).or(page.getByRole('button', { name: 'Journal' })), 'Journal tab')
await shot('journal')
await clipped('journal')
const earlier = page.getByRole('button', { name: /earlier entr/i })
if (await earlier.count()) {
  await tap(earlier, 'Show earlier entries')
  await shot('journal-expanded')
}

console.log('→ record (the 20-second capture)')
const rec = page.getByRole('button', { name: /Start recording/i })
if (await rec.count()) {
  await tap(rec, 'record')
  await shot('journal-recording')
  await tap(page.getByRole('button', { name: /Stop recording/i }), 'stop')
  await shot('journal-recorded')
}

console.log('→ progress')
await tap(page.getByRole('link', { name: 'Progress' }).or(page.getByRole('button', { name: 'Progress' })), 'Progress tab')
await shot('progress')
await clipped('progress')
// hover the last chart bar — the tooltip clipped at both ends before
const bars = page.locator('[data-bar]')
if (await bars.count()) {
  await bars.last().tap()
  await shot('progress-tooltip-last')
  await bars.first().tap()
  await shot('progress-tooltip-first')
}

console.log('→ learn')
await tap(page.getByRole('link', { name: 'Learn' }).or(page.getByRole('button', { name: 'Learn' })), 'Learn tab')
await shot('learn')
await clipped('learn')
await tap(page.locator('a[href^="/learn/"], button').filter({ hasText: /min/ }), 'first lesson')
await shot('lesson')
await clipped('lesson')

console.log('→ profile + themes')
await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle' })
await shot('profile')
await clipped('profile')
// Switch via the real control, not by poking data-theme: the illustrations
// read the resolved theme from the store, so a DOM-only swap lies about them.
for (const theme of ['Dark', 'Night shift']) {
  await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle' })
  await tap(page.getByRole('button', { name: theme, exact: true }), `theme ${theme}`)
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await shot(`home-${theme.toLowerCase().replace(' ', '')}`)
}

// Reload proves persistence survived — the store is the app's only memory.
await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle' })
await tap(page.getByRole('button', { name: 'Light', exact: true }), 'theme Light')
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await page.reload({ waitUntil: 'networkidle' })
await shot('home-after-reload')
const persisted = await page.evaluate(() => {
  const raw = localStorage.getItem('nightmind:v1')
  if (!raw) return 'NOT PERSISTED'
  const s = JSON.parse(raw).state
  return `dreams=${s.dreams?.length} onboardedAt=${s.onboardedAt ? 'set' : 'null'} checksToday=${s.progress?.checksToday}`
})
console.log(`  persisted: ${persisted}`)

console.log(errors.length ? `\n!! ${errors.length} runtime problems:` : '\nno runtime errors')
for (const e of [...new Set(errors)].slice(0, 12)) console.log(`  ${e}`)

await browser.close()
