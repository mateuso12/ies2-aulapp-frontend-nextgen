export type HighlightColor = 'yellow' | 'blue' | 'green' | 'pink'

// W3C Web Annotation inspired structure (simplified)
export interface Highlight {
  id: string
  color: HighlightColor

  // RangeSelector-like data
  xpathStart: string
  xpathEnd: string
  startOffset: number
  endOffset: number

  // TextQuoteSelector-like data
  exactText: string
  prefix?: string
  suffix?: string

  createdAt: string
  // Optional: used to separate documents/contents
  documentId?: string
}

export interface HighlightAnchor {
  xpathStart: string
  xpathEnd: string
  startOffset: number
  endOffset: number
}
