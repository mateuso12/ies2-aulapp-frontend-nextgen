// Wrapper utilities around xpath-range.
// Library: https://www.npmjs.com/package/xpath-range

import { fromRange, toRange } from 'xpath-range'
import type { HighlightAnchor } from './types'

export function rangeToAnchor(range: Range, root: Node): HighlightAnchor {
  // API: fromRange(range, [root]) returns { start: string, end: string, startOffset: number, endOffset: number }
  const serialized = fromRange(range, root)

  console.log('[xpath-range debug] fromRange result:', serialized)

  return {
    xpathStart: serialized.start,
    xpathEnd: serialized.end,
    startOffset: serialized.startOffset,
    endOffset: serialized.endOffset,
  }
}

export function anchorToRange(
  root: Node,
  anchor: HighlightAnchor
): Range | null {
  try {
    // API: toRange(startPath, startOffset, endPath, endOffset, [root])
    const range = toRange(
      anchor.xpathStart,
      anchor.startOffset,
      anchor.xpathEnd,
      anchor.endOffset,
      root
    )
    return range
  } catch (e) {
    console.log('[xpath-range debug] toRange error:', e)
    return null
  }
}
