import type { Highlight } from './types'

// Apply highlights to a rendered HTML tree by splitting text nodes and wrapping ranges.
//
// Strategy (practical, DOM-based, responsive):
// 1) Render HTML to a real DOM container (not canvas).
// 2) For each highlight, resolve its range (via xpath-range in runtime against container).
// 3) Use Range.surroundContents() with a <mark> element.
//
// This file exports helpers used by <TextHighlighter />.

export const HIGHLIGHT_ATTR = 'data-highlight-id'

export function highlightClassName(color: Highlight['color']) {
  switch (color) {
    case 'yellow':
      return 'highlight-yellow'
    case 'blue':
      return 'highlight-blue'
    case 'green':
      return 'highlight-green'
    case 'pink':
      return 'highlight-pink'
    default:
      return 'highlight-yellow'
  }
}

export function createMarkElement(doc: Document, highlight: Highlight) {
  const mark = doc.createElement('mark')
  mark.setAttribute(HIGHLIGHT_ATTR, highlight.id)
  mark.className = highlightClassName(highlight.color)
  mark.tabIndex = 0
  mark.setAttribute('role', 'note')
  mark.setAttribute('aria-label', `Highlight ${highlight.color}`)
  return mark
}

export function unwrapHighlightElements(container: HTMLElement) {
  const marks = container.querySelectorAll(`mark[${HIGHLIGHT_ATTR}]`)
  marks.forEach((mark) => {
    const parent = mark.parentNode
    if (!parent) return

    while (mark.firstChild) {
      parent.insertBefore(mark.firstChild, mark)
    }
    parent.removeChild(mark)
    parent.normalize()
  })
}

export function findHighlightByTarget(
  highlights: Highlight[],
  target: EventTarget | null
): Highlight | null {
  if (!(target instanceof HTMLElement)) return null
  const mark = target.closest?.(`mark[${HIGHLIGHT_ATTR}]`) as HTMLElement | null
  if (!mark) return null
  const id = mark.getAttribute(HIGHLIGHT_ATTR)
  if (!id) return null
  return highlights.find((h) => h.id === id) ?? null
}

// Small helper to swallow errors when the range can't be surrounded (e.g. invalid range)
export function safeSurround(range: Range, wrapper: HTMLElement) {
  try {
    // Range.surroundContents() throws if range splits non-text nodes
    range.surroundContents(wrapper)
    return true
  } catch {
    return fallbackWrapTextNodes(range, wrapper)
  }
}

function fallbackWrapTextNodes(range: Range, wrapper: HTMLElement) {
  try {
    const common = range.commonAncestorContainer
    const root = common.nodeType === Node.ELEMENT_NODE ? (common as Element) : common.parentElement
    if (!root) return false

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const selectedTextNodes: Text[] = []

    let node = walker.nextNode() as Text | null
    while (node) {
      if (range.intersectsNode(node) && (node.textContent ?? '').trim().length > 0) {
        selectedTextNodes.push(node)
      }
      node = walker.nextNode() as Text | null
    }

    if (selectedTextNodes.length === 0) return false

    // Wrap each intersecting text node piece-by-piece.
    for (const textNode of selectedTextNodes) {
      const startOffset = textNode === range.startContainer ? range.startOffset : 0
      const endOffset = textNode === range.endContainer ? range.endOffset : (textNode.textContent ?? '').length

      if (endOffset <= startOffset) continue

      let target = textNode
      if (endOffset < (target.textContent ?? '').length) {
        target.splitText(endOffset)
      }
      if (startOffset > 0) {
        target = target.splitText(startOffset)
      }

      const mark = wrapper.cloneNode(false) as HTMLElement
      target.parentNode?.insertBefore(mark, target)
      mark.appendChild(target)
    }

    return true
  } catch {
    return false
  }
}
