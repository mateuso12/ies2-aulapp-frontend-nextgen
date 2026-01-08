import React from 'react'
import parse from 'html-react-parser'
import { useTextHighlighter } from '../hooks/useTextHighlighter'
import type { HighlightColor } from '../types/highlight'
import { anchorToRange } from '../lib/xpathRange'
import { createMarkElement, safeSurround, unwrapHighlightElements } from '../lib/applyHighlights'
import { findRangeByTextQuote } from '../lib/textQuoteFallback'
import { ColorMenu, RemoveMenu } from './HighlightMenus'

export interface TextHighlighterProps {
	documentId: string
	contentHtml: string
	disabled?: boolean
}

function useClickOutside(
	refs: Array<React.RefObject<HTMLElement | null>>,
	onOutside: () => void,
	enabled: boolean
) {
	React.useEffect(() => {
		if (!enabled) return

		const onPointerDown = (e: PointerEvent) => {
			const target = e.target as Node | null
			if (!target) return
			const isInside = refs.some((r) => {
				const el = r.current
				return el ? el.contains(target) : false
			})
			if (!isInside) onOutside()
		}

		document.addEventListener('pointerdown', onPointerDown, true)
		return () => document.removeEventListener('pointerdown', onPointerDown, true)
	}, [enabled, onOutside, refs])
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
	documentId,
	contentHtml,
	disabled = false,
}) => {
	const rootRef = React.useRef<HTMLDivElement | null>(null)

	const {
		highlights,
		menu,
		colors,
		saveCurrentSelection,
		cancelSelection,
		closeMenu,
		removeHighlight,
		clearHighlights,
		setIsInteractingWithMenu,
	} = useTextHighlighter({
		documentId,
		mode: 'highlight',
		rootRef,
	})

	const [removeMenu, setRemoveMenu] = React.useState<{
		open: boolean
		x: number
		y: number
		highlightId: string | null
	}>({ open: false, x: 0, y: 0, highlightId: null })

	const closeRemoveMenu = React.useCallback(() => {
		setRemoveMenu({ open: false, x: 0, y: 0, highlightId: null })
	}, [])

	React.useEffect(() => {
		if (!disabled) return
		cancelSelection()
		closeRemoveMenu()
	}, [cancelSelection, closeRemoveMenu, disabled])

	useClickOutside([rootRef], () => {
		closeMenu()
		closeRemoveMenu()
	}, menu.open || removeMenu.open)

	const applyAllHighlights = React.useCallback(() => {
		const root = rootRef.current
		if (!root) return

		unwrapHighlightElements(root)

		for (const h of highlights) {
			let range: Range | null = null
					try {
						range = anchorToRange(document, {
							xpathStart: h.xpathStart,
							xpathEnd: h.xpathEnd,
							startOffset: h.startOffset,
							endOffset: h.endOffset,
						})
					} catch {
						range = null
					}

			if (!range) {
				range = findRangeByTextQuote(document, root, h)
			}

			if (!range) continue
			if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) {
				continue
			}

			const mark = createMarkElement(document, h)
			safeSurround(range, mark)
		}
	}, [highlights])

	React.useEffect(() => {
		applyAllHighlights()
	}, [applyAllHighlights, contentHtml])

	React.useEffect(() => {
		const onResize = () => applyAllHighlights()
		window.addEventListener('resize', onResize)
		window.addEventListener('orientationchange', onResize)
		return () => {
			window.removeEventListener('resize', onResize)
			window.removeEventListener('orientationchange', onResize)
		}
	}, [applyAllHighlights])

	const onSelectColor = React.useCallback(
		(color: HighlightColor) => {
			if (disabled) return
			saveCurrentSelection(color)
		},
		[disabled, saveCurrentSelection]
	)

	const onContentClick = React.useCallback(
		(e: React.MouseEvent) => {
			const target = e.target as HTMLElement
			const mark = target.closest?.('mark[data-highlight-id]') as HTMLElement | null
			if (!mark) return

			const id = mark.getAttribute('data-highlight-id')
			if (!id) return

			const rect = mark.getBoundingClientRect()
			setRemoveMenu({
				open: true,
				x: rect.left + rect.width / 2,
				y: rect.top,
				highlightId: id,
			})
		},
		[]
	)

	const onRemoveOne = React.useCallback(() => {
		if (!removeMenu.highlightId) return
		removeHighlight(removeMenu.highlightId)
		closeRemoveMenu()
	}, [closeRemoveMenu, removeHighlight, removeMenu.highlightId])

	const onRemoveAll = React.useCallback(() => {
		if (window.confirm('Apagar todas as marcações deste conteúdo?')) {
			clearHighlights()
		}
		closeRemoveMenu()
	}, [clearHighlights, closeRemoveMenu])

	return (
		<div className="relative">
			<div ref={rootRef} onClick={onContentClick}>
				{parse(contentHtml)}
			</div>

			{!disabled && menu.open && (
				<ColorMenu
					x={menu.x}
					y={menu.y}
					colors={colors}
					onSelectColor={onSelectColor}
					onCancel={cancelSelection}
					onInteractionStart={() => setIsInteractingWithMenu(true)}
					onInteractionEnd={() => setIsInteractingWithMenu(false)}
				/>
			)}

			{removeMenu.open && (
				<RemoveMenu
					x={removeMenu.x}
					y={removeMenu.y}
					onRemove={onRemoveOne}
					onRemoveAll={onRemoveAll}
					onCancel={closeRemoveMenu}
				/>
			)}
		</div>
	)
}

