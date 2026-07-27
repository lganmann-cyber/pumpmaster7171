import { chromium } from 'playwright'

const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const BASE = 'http://127.0.0.1:4173'
const OUT = '/tmp/claude-0/-home-user-pumpmaster7171/5d444a5e-3168-5d61-a599-02206a66e10d/scratchpad/shots'

const ROUTES = [
  ['tonight-morning', '/', '07:30'],
  ['tonight-day', '/', '13:00'],
  ['tonight-night', '/', '23:30'],
  ['journal', '/journal', null],
  ['path', '/path', null],
  ['lesson', '/path/recall-1', null],
  ['signs', '/signs', null],
  ['player', '/player', null],
  ['profile', '/profile', null],
]

const WIDTHS = [
  [360, 780],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1440, 900],
]

const THEMES = ['dark', 'light', 'nightshift']

/** Runs inside the page. Measures the things that read as "jammed". */
const PROBE = () => {
  const out = { overlap: [], clip: [], overflow: [], tiny: [], tight: [], contrastless: [] }
  const vw = document.documentElement.clientWidth

  const label = (el) => {
    const t = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 42)
    return `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').slice(0, 2).join('.') : ''}${t ? ` "${t}"` : ''}`
  }
  const visible = (el) => {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false
    // screen-reader-only content has real rects but is clipped — not a layout bug
    if (el.closest('.sr-only')) return false
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0
  }
  // an element is "floating" if it or an ancestor is taken out of flow
  const floating = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const p = getComputedStyle(n).position
      if (p === 'absolute' || p === 'fixed' || p === 'sticky') return true
    }
    return false
  }

  const all = [...document.querySelectorAll('body *')].filter(visible)

  // 1. Horizontal overflow past the viewport
  for (const el of all) {
    const r = el.getBoundingClientRect()
    if (r.right > vw + 1 || r.left < -1) {
      // a deliberately bleeding scroller is fine if it actually scrolls
      const scroller = el.closest('[data-bleed], .no-scrollbar, .overflow-x-auto')
      if (!scroller)
        out.overflow.push({
          el: label(el),
          left: Math.round(r.left),
          right: Math.round(r.right),
          w: Math.round(r.width),
        })
    }
  }

  // 2. Clipped text — content wider/taller than its box with no scroll affordance
  for (const el of all) {
    if (!el.childElementCount && (el.textContent || '').trim()) {
      const cs = getComputedStyle(el)
      const clipsX = el.scrollWidth > el.clientWidth + 1
      const clipsY = el.scrollHeight > el.clientHeight + 1
      const allowed =
        cs.textOverflow === 'ellipsis' ||
        cs.overflowX === 'auto' ||
        cs.overflowX === 'scroll' ||
        cs.overflowY === 'auto' ||
        cs.overflowY === 'scroll' ||
        cs.webkitLineClamp !== 'none'
      if ((clipsX || clipsY) && !allowed && cs.overflow !== 'visible') {
        out.clip.push({ el: label(el), sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight })
      }
    }
  }

  // 3. Overlapping text — two text-bearing boxes intersecting, neither nested
  const textEls = all.filter(
    (el) => !el.childElementCount && (el.textContent || '').trim().length > 0,
  )
  for (let i = 0; i < textEls.length; i += 1) {
    for (let j = i + 1; j < textEls.length; j += 1) {
      const a = textEls[i]
      const b = textEls[j]
      if (a.contains(b) || b.contains(a)) continue
      const ra = a.getBoundingClientRect()
      const rb = b.getBoundingClientRect()
      const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left)
      const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top)
      if (ox > 2 && oy > 2) {
        // deliberate overlays (tooltips, docked bars, the constellation field)
        if (floating(a) || floating(b)) continue
        out.overlap.push({ a: label(a), b: label(b), ox: Math.round(ox), oy: Math.round(oy) })
      }
    }
  }

  // 4. Touch targets. WCAG's minimum is 24x24; 44x44 is the enhanced target we
  //    hold controls to. A tall narrow mark (a chart bar) or a small input
  //    inside a large label is neither jammed nor hard to hit.
  for (const el of document.querySelectorAll('button, a, input, [role="switch"], [role="tab"]')) {
    if (!visible(el)) continue
    const r = el.getBoundingClientRect()
    const wrapper = el.parentElement?.closest('label, button, a')
    const wrapped = wrapper ? wrapper.getBoundingClientRect().height >= 43.5 : false
    const tooSmall = Math.min(r.width, r.height) < 24 || (r.width < 43.5 && r.height < 43.5)
    if (tooSmall && !wrapped) {
      out.tiny.push({ el: label(el), w: Math.round(r.width), h: Math.round(r.height) })
    }
  }

  // 5. Breathing room BETWEEN components. A title and its own meta line sitting
  //    4px apart is the intended relationship; two cards doing it is not. A
  //    "component" is anything with its own fill, border, or real height.
  const isComponent = (el) => {
    const cs = getComputedStyle(el)
    const filled = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent'
    const bordered = parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0
    return filled || bordered || el.getBoundingClientRect().height >= 40
  }
  for (const parent of all) {
    const kids = [...parent.children].filter(visible)
    for (let i = 1; i < kids.length; i += 1) {
      const a = kids[i - 1]
      const b = kids[i]
      const prev = a.getBoundingClientRect()
      const cur = b.getBoundingClientRect()
      const sameColumn = Math.abs(prev.left - cur.left) < 4 && cur.top >= prev.bottom - 1
      const gap = cur.top - prev.bottom
      // A divider carries the separation in a list; positioned nodes set their
      // own coordinates. Neither is "jammed".
      const divided =
        parseFloat(getComputedStyle(a).borderBottomWidth) > 0 ||
        parseFloat(getComputedStyle(b).borderTopWidth) > 0
      if (
        sameColumn &&
        gap >= 0 &&
        gap < 8 &&
        isComponent(a) &&
        isComponent(b) &&
        !divided &&
        !floating(a) &&
        !floating(b)
      ) {
        out.tight.push({ a: label(a), b: label(b), gap: Math.round(gap) })
      }
    }
  }

  return out
}

const seed = (theme, time) =>
  JSON.stringify({
    state: {
      onboardedAt: new Date().toISOString(),
      name: 'Alex',
      timeOverride: time,
      progress: {
        recallStreak: 12,
        longestStreak: 12,
        lastCaptureDate: '',
        recallTier: 4,
        unitProgress: { recall: 3, signs: 0 },
        checksToday: 3,
        checkTarget: 5,
      },
      settings: {
        theme,
        wakeTime: '07:00',
        wbtbAlarm: '03:40',
        categories: ['general', 'skills'],
        ageVerified: false,
        reducedMotion: false,
      },
    },
    version: 1,
  })

const browser = await chromium.launch({ executablePath: EXEC })
const findings = []
const shots = process.argv.includes('--shots')

for (const theme of THEMES) {
  for (const [w, h] of WIDTHS) {
    for (const [name, path, time] of ROUTES) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } })
      const page = await ctx.newPage()
      await page.addInitScript(
        ([s]) => localStorage.setItem('nightmind:v1', s),
        [seed(theme, time)],
      )
      await page.goto(BASE + path, { waitUntil: 'networkidle' })
      await page.waitForTimeout(900)
      const r = await page.evaluate(PROBE)
      for (const kind of Object.keys(r)) {
        for (const item of r[kind]) findings.push({ theme, w, screen: name, kind, ...item })
      }
      if (shots && theme === 'dark' && w === 390) {
        await page.screenshot({ path: `${OUT}/audit-${name}.png`, fullPage: true })
      }
      await ctx.close()
    }
  }
}
await browser.close()

const byKind = {}
for (const f of findings) (byKind[f.kind] ??= []).push(f)

console.log(`TOTAL ${findings.length}`)
for (const kind of ['overflow', 'overlap', 'clip', 'tiny', 'tight']) {
  const list = byKind[kind] ?? []
  console.log(`\n=== ${kind.toUpperCase()} (${list.length})`)
  const seen = new Set()
  for (const f of list) {
    const key = `${f.kind}|${f.screen}|${f.el ?? ''}|${f.a ?? ''}|${f.b ?? ''}`
    if (seen.has(key)) continue
    seen.add(key)
    console.log(
      `  [${f.theme} ${f.w}] ${f.screen}: ${JSON.stringify(f).slice(0, 240)}`,
    )
  }
}
