import type { Highlight } from './types'

const STORAGE_PREFIX = 'aulapp:highlights'

function makeKey(documentId: string) {
  return `${STORAGE_PREFIX}:${documentId}`
}

export function loadHighlights(documentId: string): Highlight[] {
  try {
    const raw = localStorage.getItem(makeKey(documentId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as Highlight[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function saveHighlights(documentId: string, highlights: Highlight[]) {
  localStorage.setItem(makeKey(documentId), JSON.stringify(highlights))
}
