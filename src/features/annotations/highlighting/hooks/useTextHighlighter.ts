import React from 'react'
import type { Highlight, HighlightColor } from '../types/highlight'
import { localStorageHighlightRepository } from '../repositories'
import { rangeToAnchor } from '../lib/xpathRange'
import { extractExactText, extractPrefixSuffix } from '../lib/textQuote'

export interface FloatingMenuState {
  open: boolean
  x: number
  y: number
}

export interface UseTextHighlighterOptions {
  /** Identificador único do documento/conteúdo */
  documentId: string
  /** Modo atual da ferramenta */
  mode: 'highlight' | 'pencil'
  /** Ref para o elemento raiz do conteúdo */
  rootRef?: React.RefObject<HTMLElement | null>
  /** Callback quando um highlight é salvo */
  onSaveHighlight?: (highlight: Highlight) => void
  /** Callback quando um highlight é removido */
  onRemoveHighlight?: (highlightId: string) => void
}

export interface UseTextHighlighterReturn {
  highlights: Highlight[]
  setHighlights: React.Dispatch<React.SetStateAction<Highlight[]>>
  menu: FloatingMenuState
  colors: readonly HighlightColor[]
  saveCurrentSelection: (color: HighlightColor) => void
  cancelSelection: () => void
  closeMenu: () => void
  removeHighlight: (id: string) => void
  clearHighlights: () => void
  setIsInteractingWithMenu: (value: boolean) => void
}

const COLORS: readonly HighlightColor[] = [
  'yellow',
  'blue',
  'green',
  'pink',
] as const

function generateUUID(): string {
  // Fallback para navegadores que não suportam crypto.randomUUID (mobile antigo)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Implementação alternativa compatível com mobile
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function getSelectionRange(): Range | null {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null
  const range = selection.getRangeAt(0)
  if (range.collapsed) return null
  const text = range.toString().trim()
  if (!text) return null
  return range
}

function getMenuPositionFromRange(range: Range): { x: number; y: number } {
  const rect = range.getBoundingClientRect()

  if (rect.width === 0 && rect.height === 0) {
    const rects = range.getClientRects()
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i]
      if (r.width > 0 && r.height > 0) {
        return {
          x: r.left + r.width / 2,
          y: r.top - 8,
        }
      }
    }
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 3,
    }
  }

  const centerX = rect.left + rect.width / 2
  const yAbove = rect.top - 8
  return { x: centerX, y: yAbove }
}

function rangeIsInsideRoot(range: Range, root: HTMLElement | null): boolean {
  if (!root) return true
  return (
    root.contains(range.startContainer) && root.contains(range.endContainer)
  )
}

export function useTextHighlighter(
  options: UseTextHighlighterOptions
): UseTextHighlighterReturn {
  const { documentId, mode, onSaveHighlight, onRemoveHighlight, rootRef } =
    options

  const [highlights, setHighlights] = React.useState<Highlight[]>([])

  // Evita sobrescrever o localStorage com [] antes do carregamento inicial terminar.
  const isLoadedRef = React.useRef(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    isLoadedRef.current = false
    localStorageHighlightRepository
      .findByDocumentId(documentId)
      .then((data) => {
        setHighlights(data)
        isLoadedRef.current = true
      })
      .catch(() => {
        setHighlights([])
        isLoadedRef.current = true
      })
  }, [documentId])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isLoadedRef.current) return
    localStorageHighlightRepository.saveAll(documentId, highlights)
  }, [documentId, highlights])

  const [menu, setMenu] = React.useState<FloatingMenuState>({
    open: false,
    x: 0,
    y: 0,
  })

  const capturedRangeRef = React.useRef<Range | null>(null)

  const isInteractingWithMenuRef = React.useRef(false)

  const resizeTimerRef = React.useRef<number | null>(null)

  // Evita reabertura imediata do menu após cancelamento
  const cancelledAtRef = React.useRef<number>(0)

  const closeMenu = React.useCallback(() => {
    setMenu((m) => ({ ...m, open: false }))
    capturedRangeRef.current = null
  }, [])

  const cancelSelection = React.useCallback(() => {
    const sel = window.getSelection()
    sel?.removeAllRanges()
    closeMenu()
    // Marca o momento do cancelamento para evitar reabertura imediata
    cancelledAtRef.current = Date.now()
  }, [closeMenu])

  const handleSelectionEnd = React.useCallback(() => {
    if (mode !== 'highlight') {
      closeMenu()
      return
    }

    if (isInteractingWithMenuRef.current) return

    // Se cancelou há menos de 300ms, ignora para evitar reabertura imediata
    const now = Date.now()
    if (now - cancelledAtRef.current < 300) {
      return
    }

    const range = getSelectionRange()
    if (!range) {
      if (!capturedRangeRef.current) {
        closeMenu()
      }
      return
    }

    if (!rangeIsInsideRoot(range, rootRef?.current ?? null)) {
      return
    }

    const clonedRange = range.cloneRange()
    capturedRangeRef.current = clonedRange

    const { x, y } = getMenuPositionFromRange(clonedRange)

    const padding = 12
    const menuWidth = 240
    const menuHeight = 56

    const viewportW = window.innerWidth
    const viewportH = window.innerHeight

    const clampedX = clamp(
      x,
      padding + menuWidth / 2,
      viewportW - padding - menuWidth / 2
    )
    const clampedY = clamp(y, padding + menuHeight, viewportH - padding)

    setMenu({
      open: true,
      x: clampedX,
      y: clampedY,
    })
  }, [closeMenu, mode, rootRef])

  const selectionTimerRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (typeof document === 'undefined') return

    const selectionChangeHandler = () => {
      // Se cancelou recentemente, ignora mudanças de seleção
      if (Date.now() - cancelledAtRef.current < 300) {
        return
      }

      if (selectionTimerRef.current) {
        window.clearTimeout(selectionTimerRef.current)
      }
      selectionTimerRef.current = window.setTimeout(() => {
        handleSelectionEnd()
      }, 150)
    }

    const pointerUpHandler = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      // Ignora cliques em qualquer menu de highlight
      if (
        target.closest?.('[data-highlight-menu]') ||
        target.closest?.('[data-highlight-remove-menu]')
      ) {
        return
      }
      const delay = 'changedTouches' in e ? 100 : 0
      setTimeout(() => {
        handleSelectionEnd()
      }, delay)
    }

    document.addEventListener('selectionchange', selectionChangeHandler)
    document.addEventListener('mouseup', pointerUpHandler)
    document.addEventListener('touchend', pointerUpHandler)

    return () => {
      document.removeEventListener('selectionchange', selectionChangeHandler)
      document.removeEventListener('mouseup', pointerUpHandler)
      document.removeEventListener('touchend', pointerUpHandler)
      if (selectionTimerRef.current) {
        window.clearTimeout(selectionTimerRef.current)
      }
    }
  }, [handleSelectionEnd])

  // Reposiciona menu em resize/scroll
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

        const clampedX = clamp(
          x,
          padding + menuWidth / 2,
          viewportW - padding - menuWidth / 2
        )
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

  const removeHighlight = React.useCallback(
    (id: string) => {
      setHighlights((prev) => prev.filter((h) => h.id !== id))
      onRemoveHighlight?.(id)
    },
    [onRemoveHighlight]
  )

  const clearHighlights = React.useCallback(() => {
    setHighlights([])
    closeMenu()
  }, [closeMenu])

  const saveCurrentSelection = React.useCallback(
    (color: HighlightColor) => {
      if (mode !== 'highlight') return

      const range = capturedRangeRef.current
      if (!range) {
        console.log('[highlight] Nenhum range capturado')
        return
      }

      const root = rootRef?.current
      if (!root) {
        console.log('[highlight] rootRef.current não encontrado')
        return
      }

      const startNode = range.startContainer
      const endNode = range.endContainer
      const startContained = root.contains(startNode)
      const endContained = root.contains(endNode)
      if (!startContained || !endContained) {
        console.log('[highlight] Range fora do root', {
          startContained,
          endContained,
        })
        return
      }

      const anchor = rangeToAnchor(range, root)
      const exactText = extractExactText(range)
      const { prefix, suffix } = extractPrefixSuffix(range)

      const highlight: Highlight = {
        id: generateUUID(),
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

      console.log('[highlight] Criando highlight', highlight)
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
    clearHighlights,
    setIsInteractingWithMenu: (value: boolean) => {
      isInteractingWithMenuRef.current = value
    },
  }
}
