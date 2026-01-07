// Utilities to build a TextQuoteSelector-like structure

function normalizeWhitespace(text: string) {
  return text.replace(/\s+/g, ' ').trim()
}

export function extractExactText(range: Range) {
  return normalizeWhitespace(range.toString())
}

export function extractPrefixSuffix(range: Range, wordCount = 5): {
  prefix?: string
  suffix?: string
} {
  const root = range.commonAncestorContainer

  // Range boundary helpers
  const getEndOffset = (node: Node) => {
    // For text-like nodes, use text length; for elements, use childNodes length.
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').length
    }
    return node.childNodes.length
  }

  const before = document.createRange()
  before.setStart(root, 0)
  before.setEnd(range.startContainer, range.startOffset)

  const after = document.createRange()
  after.setStart(range.endContainer, range.endOffset)
  after.setEnd(root, getEndOffset(root))

  const prefixWords = normalizeWhitespace(before.toString()).split(' ').filter(Boolean)
  const suffixWords = normalizeWhitespace(after.toString()).split(' ').filter(Boolean)

  const prefix = prefixWords.slice(Math.max(prefixWords.length - wordCount, 0)).join(' ') || undefined
  const suffix = suffixWords.slice(0, wordCount).join(' ') || undefined

  return { prefix, suffix }
}

export function normalizeForMatch(text: string) {
  return normalizeWhitespace(text).toLowerCase()
}
