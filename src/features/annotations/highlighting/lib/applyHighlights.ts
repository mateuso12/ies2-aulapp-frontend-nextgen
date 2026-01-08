import type { Highlight, HighlightColor } from '../types/highlight'

export const HIGHLIGHT_ATTR = 'data-highlight-id'

export function highlightClassName(color: HighlightColor): string {
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

export function createMarkElement(
  doc: Document,
  highlight: Highlight
): HTMLElement {
  const mark = doc.createElement('mark')
  mark.setAttribute(HIGHLIGHT_ATTR, highlight.id)
  mark.className = highlightClassName(highlight.color)
  mark.tabIndex = 0
  mark.setAttribute('role', 'note')
  mark.setAttribute('aria-label', `Highlight ${highlight.color}`)
  return mark
}

export function unwrapHighlightElements(container: HTMLElement): void {
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

// Range.surroundContents() pode falhar quando o range cruza elementos.
// Nesse caso, envolvemos os text nodes individualmente.
export function safeSurround(range: Range, wrapper: HTMLElement): boolean {
  try {
    range.surroundContents(wrapper)
    return true
  } catch {
    return fallbackWrapTextNodes(range, wrapper)
  }
}

function fallbackWrapTextNodes(range: Range, wrapper: HTMLElement): boolean {
  try {
    const common = range.commonAncestorContainer
    const root =
      common.nodeType === Node.ELEMENT_NODE
        ? (common as Element)
        : common.parentElement
    if (!root) return false

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const selectedTextNodes: Text[] = []

    let node = walker.nextNode() as Text | null
    while (node) {
      if (
        range.intersectsNode(node) &&
        (node.textContent ?? '').trim().length > 0
      ) {
        selectedTextNodes.push(node)
      }
      node = walker.nextNode() as Text | null
    }

    if (selectedTextNodes.length === 0) return false

    for (const textNode of selectedTextNodes) {
      const startOffset =
        textNode === range.startContainer ? range.startOffset : 0
      const endOffset =
        textNode === range.endContainer
          ? range.endOffset
          : (textNode.textContent ?? '').length

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
