import React from 'react'
import type { Highlight, HighlightColor } from './types'
import { loadHighlights, saveHighlights } from './storage'
import { rangeToAnchor } from './xpath-range'
import { extractExactText, extractPrefixSuffix } from './text-quote'

export interface FloatingMenuState {
  open: boolean
  x: number
  y: number
}

export interface UseTextHighlighterOptions {
  documentId: string
  mode: 'highlight' | 'pencil'
  rootRef?: React.RefObject<HTMLElement | null>
  onSaveHighlight?: (highlight: Highlight) => void
}

const COLORS: HighlightColor[] = ['yellow', 'blue', 'green', 'pink']

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getSelectionRange(): Range | null {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null
  const range = selection.getRangeAt(0)
  if (range.collapsed) return null
  return range
}

function getMenuPositionFromRange(range: Range) {
  const rect = range.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const yAbove = rect.top - 8
  return { x: centerX, y: yAbove }
}

export function useTextHighlighter(options: UseTextHighlighterOptions) {
  const { documentId, mode, onSaveHighlight, rootRef } = options

  const [highlights, setHighlights] = React.useState<Highlight[]>(() =>
    typeof window === 'undefined' ? [] : loadHighlights(documentId)
  )

  const [menu, setMenu] = React.useState<FloatingMenuState>({
    open: false,
    x: 0,
    y: 0,
  })

  // *** CRITICAL: Store the captured range in a ref so it survives focus changes ***
  const capturedRangeRef = React.useRef<Range | null>(null)

  // Track if the user is interacting with the menu itself.
  const isInteractingWithMenuRef = React.useRef(false)

  // Keep a ref so we can debounce resize recalculations
  const resizeTimerRef = React.useRef<number | null>(null)

  // Persist highlights
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    saveHighlights(documentId, highlights)
  }, [documentId, highlights])

  const closeMenu = React.useCallback(() => {
    setMenu((m) => ({ ...m, open: false }))
    capturedRangeRef.current = null
  }, [])

  const cancelSelection = React.useCallback(() => {
    const sel = window.getSelection()
    sel?.removeAllRanges()
    closeMenu()
  }, [closeMenu])

  // Handle selection and show menu
  const handleSelectionEnd = React.useCallback(() => {
    if (mode !== 'highlight') {
      closeMenu()
      return
    }

    // If user is clicking on the menu, don't process
    if (isInteractingWithMenuRef.current) return

    const range = getSelectionRange()
    if (!range) {
      // Only close if we don't have a captured range (user clicked elsewhere)
      if (!capturedRangeRef.current) {
        closeMenu()
      }
      return
    }

    // Clone the range so it survives selection changes
    const clonedRange = range.cloneRange()
    capturedRangeRef.current = clonedRange

    const { x, y } = getMenuPositionFromRange(clonedRange)

    // Mobile-first positioning: keep within viewport
    const padding = 12
    const menuWidth = 240
    const menuHeight = 56

    const viewportW = window.innerWidth
    const viewportH = window.innerHeight

    const clampedX = clamp(x, padding + menuWidth / 2, viewportW - padding - menuWidth / 2)
    const clampedY = clamp(y, padding + menuHeight, viewportH - padding)

    setMenu({
      open: true,
      x: clampedX,
      y: clampedY,
    })
  }, [closeMenu, mode])

  // Open menu only when the user completes selection (mouse up / touch end).
  React.useEffect(() => {
    if (typeof document === 'undefined') return

    const handler = (e: MouseEvent | TouchEvent) => {
      // If clicking on the menu itself, ignore
      const target = e.target as HTMLElement
      if (target.closest?.('[data-highlight-menu]')) {
        return
      }

      // Small delay to let selection settle
      requestAnimationFrame(() => handleSelectionEnd())
    }

    document.addEventListener('mouseup', handler)
    document.addEventListener('touchend', handler)
    return () => {
      document.removeEventListener('mouseup', handler)
      document.removeEventListener('touchend', handler)
    }
  }, [handleSelectionEnd])

  // Reposition menu on resize/scroll (debounced)
  React.useEffect(() => {
    if (!menu.open) return

    const handle = () => {
      if (resizeTimerRef.current) {
        window.clearTimeout(resizeTimerRef.current)
      }
      resizeTimerRef.current = window.setTimeout(() => {
        const range = capturedRangeRef.current
        if (!range) return
        const { x, y } = getMenuPositionFromRange(range)

        const padding = 12
        const menuWidth = 240
        const menuHeight = 56

        const viewportW = window.innerWidth
        const viewportH = window.innerHeight

        const clampedX = clamp(x, padding + menuWidth / 2, viewportW - padding - menuWidth / 2)
        const clampedY = clamp(y, padding + menuHeight, viewportH - padding)

        setMenu({ open: true, x: clampedX, y: clampedY })
      }, 80)
    }

    window.addEventListener('resize', handle)
    window.addEventListener('scroll', handle, true)

    return () => {
      window.removeEventListener('resize', handle)
      window.removeEventListener('scroll', handle, true)
      if (resizeTimerRef.current) {
        window.clearTimeout(resizeTimerRef.current)
        resizeTimerRef.current = null
      }
    }
  }, [menu.open])

  const removeHighlight = React.useCallback((id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id))
  }, [])

  // Create a new highlight from the captured range
  const saveCurrentSelection = React.useCallback(
    (color: HighlightColor) => {
      console.log('[Highlight Debug] saveCurrentSelection called', { color, mode })
      
      if (mode !== 'highlight') {
        console.log('[Highlight Debug] ❌ mode is not highlight')
        return
      }

      // Use the captured range (stored in ref) - this survives focus changes
      const range = capturedRangeRef.current
      console.log('[Highlight Debug] capturedRangeRef.current:', range)
      
      if (!range) {
        console.log('[Highlight Debug] ❌ No captured range')
        return
      }

      const root = rootRef?.current
      console.log('[Highlight Debug] rootRef.current:', root)
      
      if (!root) {
        console.log('[Highlight Debug] ❌ No root element')
        return
      }

      // Ensure selection belongs to this root container
      const startNode = range.startContainer
      const endNode = range.endContainer
      const startContained = root.contains(startNode)
      const endContained = root.contains(endNode)
      console.log('[Highlight Debug] Range containment:', { startContained, endContained, startNode, endNode })
      
      if (!startContained || !endContained) {
        console.log('[Highlight Debug] ❌ Range not inside root')
        return
      }

      // Serialize range relative to the highlight container.
      console.log('[Highlight Debug] Calling rangeToAnchor...')
      const anchor = rangeToAnchor(range, root)
      console.log('[Highlight Debug] anchor:', anchor)

      const exactText = extractExactText(range)
      const { prefix, suffix } = extractPrefixSuffix(range)
      console.log('[Highlight Debug] Text:', { exactText, prefix, suffix })

      const highlight: Highlight = {
        id: crypto.randomUUID(),
        color,
        xpathStart: anchor.xpathStart,
        xpathEnd: anchor.xpathEnd,
        startOffset: anchor.startOffset,
        endOffset: anchor.endOffset,
        exactText,
        prefix,
        suffix,
        createdAt: new Date().toISOString(),
        documentId,
      }

      console.log('[Highlight Debug] ✅ Creating highlight:', highlight)
      setHighlights((prev) => [...prev, highlight])
      onSaveHighlight?.(highlight)
      cancelSelection()
    },
    [cancelSelection, documentId, mode, onSaveHighlight, rootRef]
  )

  return {
    highlights,
    setHighlights,
    menu,
    colors: COLORS,
    saveCurrentSelection,
    cancelSelection,
    closeMenu,
    removeHighlight,
    setIsInteractingWithMenu: (value: boolean) => {
      isInteractingWithMenuRef.current = value
    },
  }
}
