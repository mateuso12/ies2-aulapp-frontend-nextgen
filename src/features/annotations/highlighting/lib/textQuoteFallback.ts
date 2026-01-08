import type { Highlight } from '../types/highlight'

function normalizeForMatch(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase()
}

// Fallback “best effort” quando o XPath não reconstrói o range (DOM mudou/normalizou).
export function findRangeByTextQuote(
  doc: Document,
  root: HTMLElement,
  highlight: Pick<Highlight, 'exactText' | 'prefix' | 'suffix'>
): Range | null {
  const exactRaw = highlight.exactText ?? ''
  const exact = normalizeForMatch(exactRaw)
  if (!exact) return null

  const prefix = normalizeForMatch(highlight.prefix ?? '')
  const suffix = normalizeForMatch(highlight.suffix ?? '')

  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Array<{ node: Text; start: number; end: number }> = []
  let fullText = ''

  let n = walker.nextNode() as Text | null
  while (n) {
    const raw = n.textContent ?? ''
    if (raw) {
      const start = fullText.length
      fullText += raw
      const end = fullText.length
      nodes.push({ node: n, start, end })
    }
    n = walker.nextNode() as Text | null
  }

  if (!fullText) return null

  // Busca no texto normalizado para localizar uma ocorrência plausível.
  const hay = normalizeForMatch(fullText)
  let idx = hay.indexOf(exact)
  if (idx < 0) return null

  if (prefix || suffix) {
    let bestIdx = -1
    let searchFrom = 0

    while (true) {
      const found = hay.indexOf(exact, searchFrom)
      if (found < 0) break

      const left = hay.slice(Math.max(0, found - 240), found)
      const right = hay.slice(found + exact.length, found + exact.length + 240)

      const prefixOk = prefix ? left.includes(prefix) : true
      const suffixOk = suffix ? right.includes(suffix) : true

      if (prefixOk && suffixOk) {
        bestIdx = found
        break
      }

      searchFrom = found + exact.length
    }

    if (bestIdx >= 0) idx = bestIdx
  }

  // Mapeia para offsets no texto cru com uma segunda busca no texto original.
  const rawIdx = fullText.toLowerCase().indexOf(exactRaw.toLowerCase())
  if (rawIdx < 0) return null

  const rawEnd = rawIdx + exactRaw.length

  const findNodeAt = (
    offset: number
  ): { node: Text; offset: number } | null => {
    const hit = nodes.find((x) => offset >= x.start && offset <= x.end)
    if (!hit) return null
    return { node: hit.node, offset: offset - hit.start }
  }

  const start = findNodeAt(rawIdx)
  const end = findNodeAt(rawEnd)
  if (!start || !end) return null

  try {
    const range = doc.createRange()
    range.setStart(start.node, start.offset)
    range.setEnd(end.node, end.offset)
    return range
  } catch {
    return null
  }
}
