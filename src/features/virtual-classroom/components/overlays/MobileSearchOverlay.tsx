import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SearchNormal1, CloseCircle, ArrowUp2, ArrowDown2 } from 'iconsax-react'
import { useTranslation } from 'react-i18next'

interface MobileSearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  resultsCount?: number
  onNext?: () => void
  onPrev?: () => void
  onQueryChange?: (query: string) => void
}

export const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({
  isOpen,
  onClose,
  resultsCount = 0,
  onNext,
  onPrev,
  onQueryChange,
}) => {
  const { t } = useTranslation('footer')
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const focusTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      return
    }

    if (focusTimerRef.current) {
      window.clearTimeout(focusTimerRef.current)
      focusTimerRef.current = null
    }

    focusTimerRef.current = window.setTimeout(() => {
      inputRef.current?.focus()
      focusTimerRef.current = null
    }, 100)

    return () => {
      if (focusTimerRef.current) {
        window.clearTimeout(focusTimerRef.current)
        focusTimerRef.current = null
      }
    }
  }, [isOpen])

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value)
      onQueryChange?.(value)
    },
    [onQueryChange]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key !== 'Enter') return

      if (e.shiftKey) {
        onPrev?.()
      } else {
        onNext?.()
      }
    },
    [onClose, onNext, onPrev]
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-x-0 top-0 z-60 bg-[#2C2C2C] shadow-lg animate-in slide-in-from-top duration-200">
      <div className="flex items-center gap-3 px-4 py-3">
        <SearchNormal1 size="20" color="#9CA3AF" variant="Linear" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('searchPlaceholder')}
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-base"
        />

        {query && (
          <span className="text-sm text-gray-400 whitespace-nowrap">
            {resultsCount} {resultsCount === 1 ? t('result') : t('results')}
          </span>
        )}

        {query && resultsCount > 0 && (
          <div className="flex items-center gap-1">
            <button
              onClick={onPrev}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label={t('previousResult')}
            >
              <ArrowUp2 size="18" color="#E2E2E2" variant="Linear" />
            </button>
            <button
              onClick={onNext}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label={t('nextResult')}
            >
              <ArrowDown2 size="18" color="#E2E2E2" variant="Linear" />
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={t('closeSearch')}
        >
          <CloseCircle size="22" color="#E2E2E2" variant="Linear" />
        </button>
      </div>
    </div>
  )
}
