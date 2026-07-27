import type { Dream, DreamSign } from './types'

export type ConstellationNode = DreamSign & {
  x: number // 0–100 viewBox units
  y: number
  r: number // radius in viewBox units
  rank: number
}

export type ConstellationEdge = { a: string; b: string; weight: number }

export type ConstellationModel = {
  nodes: ConstellationNode[]
  edges: ConstellationEdge[]
}

const GOLDEN = 2.399963229728653

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 1000) / 1000
}

/** Recompute sign counts straight off the dreams so the field grows as entries land. */
export function signsFromDreams(dreams: Dream[], catalogue: DreamSign[]): DreamSign[] {
  const counts = new Map<string, number>()
  const first = new Map<string, string>()
  for (const d of dreams) {
    for (const id of d.signs) {
      counts.set(id, (counts.get(id) ?? 0) + 1)
      const seen = first.get(id)
      if (!seen || d.wokeAt < seen) first.set(id, d.wokeAt)
    }
  }
  return catalogue
    .map((s) => ({ ...s, count: counts.get(s.id) ?? 0, firstSeen: first.get(s.id) ?? s.firstSeen }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

/**
 * Deterministic radial layout — biggest sign anchors the centre, the rest
 * spiral out on the golden angle so the field stays legible at 3 nodes and
 * at 30. No physics, no reflow between renders.
 */
export function buildConstellation(
  dreams: Dream[],
  catalogue: DreamSign[],
  limit = 7,
): ConstellationModel {
  const signs = signsFromDreams(dreams, catalogue).slice(0, limit)
  const max = signs[0]?.count ?? 1

  const nodes: ConstellationNode[] = signs.map((s, i) => {
    const share = s.count / max
    const r = 5 + share * 5.5
    if (i === 0) return { ...s, x: 50, y: 50, r, rank: i }
    const jitter = hash(s.id)
    const ring = Math.min(32, 17 + Math.sqrt(i) * 9 + jitter * 3)
    const angle = i * GOLDEN + jitter * 0.6
    return {
      ...s,
      rank: i,
      r,
      x: 50 + Math.cos(angle) * ring,
      y: 50 + Math.sin(angle) * ring * 0.82,
    }
  })

  relax(nodes)

  const present = new Set(nodes.map((n) => n.id))
  const pairs = new Map<string, number>()
  for (const d of dreams) {
    const ids = [...new Set(d.signs)].filter((id) => present.has(id)).sort()
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        const k = `${ids[i]}|${ids[j]}`
        pairs.set(k, (pairs.get(k) ?? 0) + 1)
      }
    }
  }

  const edges: ConstellationEdge[] = [...pairs.entries()]
    .map(([k, weight]) => {
      const [a, b] = k.split('|')
      return { a, b, weight }
    })
    .sort((x, y) => y.weight - x.weight)
    .slice(0, 40)

  return { nodes, edges }
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}

/**
 * A few deterministic relaxation passes so nodes and their labels stop
 * colliding. Node 0 is pinned — the biggest sign holds the centre.
 */
function relax(nodes: ConstellationNode[]) {
  const PAD = 12
  for (let pass = 0; pass < 90; pass += 1) {
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i]
        const b = nodes[j]
        const dx = b.x - a.x
        // Labels sit under the node, so vertical clearance has to be bigger.
        const dy = (b.y - a.y) * 1.5
        const dist = Math.hypot(dx, dy) || 0.001
        const want = a.r + b.r + PAD
        if (dist >= want) continue
        const push = (want - dist) / 2
        const ux = (dx / dist) * push
        const uy = ((dy / dist) * push) / 1.5
        if (i !== 0) {
          a.x -= ux
          a.y -= uy
        }
        b.x += i === 0 ? ux * 2 : ux
        b.y += i === 0 ? uy * 2 : uy
      }
    }
    for (const n of nodes) {
      n.x = clamp(n.x, n.r + 5, 100 - n.r - 5)
      n.y = clamp(n.y, n.r + 6, 100 - n.r - 9)
    }
  }
}

export function dreamsWithSign(dreams: Dream[], signId: string): Dream[] {
  return dreams
    .filter((d) => d.signs.includes(signId))
    .sort((a, b) => (a.wokeAt < b.wokeAt ? 1 : -1))
}
