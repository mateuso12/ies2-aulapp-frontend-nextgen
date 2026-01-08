/**
 * Utilitários de serialização XPath para ranges do DOM.
 *
 * Wrapper em torno da biblioteca xpath-range para converter
 * entre objetos Range do DOM e âncoras XPath persistíveis.
 *
 * @see https://www.npmjs.com/package/xpath-range
 */

import { fromRange, toRange } from 'xpath-range'
import type { HighlightAnchor } from '../types/highlight'

/**
 * Converte um Range do DOM para uma âncora XPath persistível.
 *
 * @param range Range do DOM a ser serializado
 * @param root Elemento raiz para cálculo de XPath relativo
 * @returns Âncora com XPaths e offsets
 */
export function rangeToAnchor(range: Range, root: Node): HighlightAnchor {
  // API: fromRange(range, [root]) returns { start: string, end: string, startOffset: number, endOffset: number }
  const serialized = fromRange(range, root)

  return {
    xpathStart: serialized.start,
    xpathEnd: serialized.end,
    startOffset: serialized.startOffset,
    endOffset: serialized.endOffset,
  }
}

/**
 * Reconstrói um Range do DOM a partir de uma âncora XPath.
 *
 * @param root Elemento raiz onde avaliar os XPaths
 * @param anchor Âncora com XPaths e offsets
 * @returns Range do DOM ou null se não foi possível reconstruir
 */
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
  } catch {
    return null
  }
}
