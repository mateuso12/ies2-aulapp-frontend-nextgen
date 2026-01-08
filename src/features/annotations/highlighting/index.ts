// Componentes
export * from './components'

// Hooks
export {
  useTextHighlighter,
  type UseTextHighlighterOptions,
  type UseTextHighlighterReturn,
  type FloatingMenuState,
} from './hooks'

// Types
export {
  type Highlight,
  type HighlightColor,
  type HighlightAnchor,
  type CreateHighlightDTO,
  type UpdateHighlightDTO,
  type HighlightsListResponse,
  type HighlightsQueryParams,
  HIGHLIGHT_COLORS,
} from './types'

// Repositories
export {
  type HighlightRepository,
  localStorageHighlightRepository,
} from './repositories'

// Lib utilities (for advanced use cases)
export { rangeToAnchor, anchorToRange } from './lib/xpathRange'
export {
  extractExactText,
  extractPrefixSuffix,
  normalizeForMatch,
} from './lib/textQuote'
export {
  HIGHLIGHT_ATTR,
  highlightClassName,
  createMarkElement,
  unwrapHighlightElements,
  findHighlightByTarget,
  safeSurround,
} from './lib/applyHighlights'
