import React from 'react'
import { motion } from 'framer-motion'
import parse, { domToReact } from 'html-react-parser'
import type { DOMNode, Element as DomElement } from 'html-react-parser'

import type { Highlight } from './types'
import { anchorToRange } from './xpath-range'
import {
  createMarkElement,
  findHighlightByTarget,
  safeSurround,
  unwrapHighlightElements,
} from './applyHighlights'

import { useTextHighlighter } from './useTextHighlighter'

type Mode = 'pencil' | 'highlight'

export interface TextHighlighterProps {
  documentId: string
  contentHtml: string
  mode: Mode
  className?: string
  onSaveHighlight?: (highlight: Highlight) => void
}

// Render strategy:
// - We parse HTML to React elements so tags/links are preserved.
// - After render, we apply <mark> wrappers using real DOM Range operations;
//   this keeps highlights responsive (no canvas) and stable across zoom/font-size.
export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  documentId,
  contentHtml,
  mode,
  className,
  onSaveHighlight,
}) => {
  const rootRef = React.useRef<HTMLDivElement>(null)

  const {
    highlights,
    menu,
    colors,
    saveCurrentSelection,
    cancelSelection,
    removeHighlight,
    setIsInteractingWithMenu,
  } = useTextHighlighter({ documentId, mode, onSaveHighlight, rootRef })

  // Apply highlights after render
  React.useEffect(() => {
    const root = rootRef.current
    console.log('[Highlight Debug] Apply effect - root:', root, 'highlights:', highlights.length)
    if (!root) return

    // Clear previous wrappers
    unwrapHighlightElements(root)

    // Re-apply
    for (const h of highlights) {
      console.log('[Highlight Debug] Applying highlight:', h.id, h.exactText)
      const range = anchorToRange(root, {
        xpathStart: h.xpathStart,
        xpathEnd: h.xpathEnd,
        startOffset: h.startOffset,
        endOffset: h.endOffset,
      })

      console.log('[Highlight Debug] anchorToRange result:', range)

      if (!range) {
        console.log('[Highlight Debug] ❌ Could not restore range for', h.id)
        continue
      }

      // Ignore empty ranges
      if (range.collapsed) {
        console.log('[Highlight Debug] ❌ Range is collapsed for', h.id)
        continue
      }

      const mark = createMarkElement(document, h)
      const success = safeSurround(range, mark)
      console.log('[Highlight Debug] safeSurround result:', success)
    }
  }, [highlights, contentHtml])

  const handleContextMenu = React.useCallback(
    (e: React.MouseEvent) => {
      const hit = findHighlightByTarget(highlights, e.target)
      if (!hit) return

      // Provide a simple remove-on-right-click behavior.
      e.preventDefault()
      removeHighlight(hit.id)
    },
    [highlights, removeHighlight]
  )

  // Basic keyboard support: when focusing a mark and pressing Delete/Backspace remove it
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Backspace' && e.key !== 'Delete') return
      const hit = findHighlightByTarget(highlights, e.target)
      if (!hit) return
      e.preventDefault()
      removeHighlight(hit.id)
    },
    [highlights, removeHighlight]
  )

  const parsed = React.useMemo(() => {
    return parse(contentHtml, {
      replace(node) {
        // Preserve links, paragraphs, etc. We keep parsing untouched.
        // Optionally, we could inject props into elements here.

        // Example: ensure external links are safe
        if (node.type === 'tag') {
          const el = node as DomElement
          if (el.name === 'a') {
            const href = el.attribs?.href
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline underline-offset-2"
              >
                {domToReact(el.children as DOMNode[])}
              </a>
            )
          }
        }
        return undefined
      },
    })
  }, [contentHtml])

  return (
    <div className={className}>
      {/* Content root */}
      <div
        ref={rootRef}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        className={
          'prose prose-sm md:prose-base max-w-none select-text text-slate-900 dark:text-slate-100 ' +
          'leading-relaxed [&_p]:my-3 [&_mark]:cursor-pointer'
        }
        style={{
          // Suppress native browser context menu on touch devices (iOS/Android)
          // This allows our custom highlight menu to appear instead
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'text',
        }}
      >
        {parsed}
      </div>

      {/* Floating Action Menu */}
      {mode === 'highlight' && menu.open && (
        <motion.div
          data-highlight-menu
          className="fixed z-100"
          style={{
            left: menu.x,
            top: menu.y,
            transform: 'translate(-50%, -100%)',
          }}
          role="dialog"
          aria-label="Highlight menu"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            onPointerDown={() => setIsInteractingWithMenu(true)}
            onPointerUp={() => {
              // Delay reset so the click handler can complete
              setTimeout(() => setIsInteractingWithMenu(false), 100)
            }}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 shadow-lg backdrop-blur px-3 py-2 dark:border-slate-700 dark:bg-slate-900/95"
          >
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                className={
                  'h-11 w-11 rounded-full border border-slate-200 transition active:scale-95 dark:border-slate-700 ' +
                  (c === 'yellow'
                    ? 'bg-yellow-200/70 dark:bg-yellow-800/60'
                    : c === 'blue'
                      ? 'bg-blue-200/70 dark:bg-blue-800/60'
                      : c === 'green'
                        ? 'bg-green-200/70 dark:bg-green-800/60'
                        : 'bg-pink-200/70 dark:bg-pink-800/60')
                }
                aria-label={`Save highlight ${c}`}
                onClick={() => saveCurrentSelection(c)}
              />
            ))}

            <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />

            <button
              type="button"
              className="h-11 px-4 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={cancelSelection}
              aria-label="Cancel highlight"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Mobile hint overlay when menu would be offscreen (optional) */}
    </div>
  )
}
