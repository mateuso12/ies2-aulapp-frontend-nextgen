import React, {
  type ReactNode,
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react'
import { SwipeHintOverlay } from './SwipeHintOverlay'

interface SwipeableContentWrapperProps {
  children: ReactNode
  currentPage: number
  totalPages: number
  onNext?: () => void
  onPrevious?: () => void
  enabled?: boolean
  className?: string
}

const SWIPE_HINT_SHOWN_KEY = 'swipe-navigation-hint-shown'

/**
 * Componente que adiciona navegação por swipe (carousel) ao conteúdo.
 * Implementa gestos de arrastar para navegar entre páginas.
 *
 * - Swipe para esquerda → próxima página
 * - Swipe para direita → página anterior
 *
 * Toda a lógica de gestos e animações está encapsulada aqui.
 */
export const SwipeableContentWrapper: React.FC<
  SwipeableContentWrapperProps
> = ({
  children,
  currentPage,
  totalPages,
  onNext,
  onPrevious,
  enabled = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(false)

  const startX = useRef(0)
  const startY = useRef(0)
  const isDragging = useRef(false)
  const isHorizontalSwipe = useRef<boolean | null>(null)

  const canGoNext = currentPage < totalPages && !!onNext
  const canGoPrevious = currentPage > 1 && !!onPrevious

  const SWIPE_THRESHOLD = 0.2 // 20% da largura da tela
  const MAX_OFFSET_RATIO = 0.4 // Máximo de 40% de offset
  const ANIMATION_DURATION = 250 // ms

  const getContainerWidth = useCallback(() => {
    return containerRef.current?.offsetWidth || window.innerWidth
  }, [])

  const applyResistance = useCallback(
    (value: number, canMove: boolean): number => {
      if (!canMove) {
        return value * 0.15
      }

      const maxOffset = getContainerWidth() * MAX_OFFSET_RATIO
      if (Math.abs(value) <= maxOffset) return value

      const sign = value < 0 ? -1 : 1
      const excess = Math.abs(value) - maxOffset
      return sign * (maxOffset + excess * 0.3)
    },
    [getContainerWidth]
  )

  const animateTo = useCallback(
    (targetOffset: number, callback?: () => void) => {
      setIsAnimating(true)
      setOffset(targetOffset)

      setTimeout(() => {
        setIsAnimating(false)
        setOffset(0)
        callback?.()
      }, ANIMATION_DURATION)
    },
    []
  )

  useEffect(() => {
    if (!enabled || totalPages <= 1) return

    const hasSeenHint = localStorage.getItem(SWIPE_HINT_SHOWN_KEY)
    if (!hasSeenHint) {
      const timer = setTimeout(() => {
        setShowSwipeHint(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [enabled, totalPages])

  const dismissHint = useCallback(() => {
    setShowSwipeHint(false)
    localStorage.setItem(SWIPE_HINT_SHOWN_KEY, 'true')
  }, [])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || isAnimating) return

      if (showSwipeHint) {
        dismissHint()
      }

      const touch = e.touches[0]
      startX.current = touch.clientX
      startY.current = touch.clientY
      isDragging.current = true
      isHorizontalSwipe.current = null
    },
    [enabled, isAnimating, showSwipeHint, dismissHint]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !isDragging.current || isAnimating) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - startX.current
      const deltaY = touch.clientY - startY.current

      if (isHorizontalSwipe.current === null) {
        const absX = Math.abs(deltaX)
        const absY = Math.abs(deltaY)

        if (absX > 10 || absY > 10) {
          isHorizontalSwipe.current = absX > absY
        }
      }

      if (isHorizontalSwipe.current === false) {
        return
      }

      if (isHorizontalSwipe.current === true) {
        e.preventDefault()

        const canMove = deltaX < 0 ? canGoNext : canGoPrevious
        const constrainedOffset = applyResistance(deltaX, canMove)
        setOffset(constrainedOffset)
      }
    },
    [enabled, isAnimating, canGoNext, canGoPrevious, applyResistance]
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !isDragging.current || isAnimating) return

      isDragging.current = false

      if (isHorizontalSwipe.current !== true) {
        isHorizontalSwipe.current = null
        return
      }

      isHorizontalSwipe.current = null

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - startX.current
      const width = getContainerWidth()
      const threshold = width * SWIPE_THRESHOLD

      const shouldNavigate = Math.abs(deltaX) > threshold

      if (shouldNavigate && deltaX < 0 && canGoNext) {
        animateTo(-width, onNext)
      } else if (shouldNavigate && deltaX > 0 && canGoPrevious) {
        animateTo(width, onPrevious)
      } else {
        animateTo(0)
      }
    },
    [
      enabled,
      isAnimating,
      canGoNext,
      canGoPrevious,
      getContainerWidth,
      animateTo,
      onNext,
      onPrevious,
    ]
  )

  useEffect(() => {
    setOffset(0)
    setIsAnimating(false)
  }, [currentPage])

  useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => {
        dismissHint()
      }, 5000) // 5 segundos
      return () => clearTimeout(timer)
    }
  }, [showSwipeHint, dismissHint])

  if (!enabled) {
    return (
      <div className={`absolute inset-0 flex flex-col ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      {showSwipeHint && <SwipeHintOverlay onDismiss={dismissHint} />}

      {/* Indicador de página anterior (esquerda) */}
      {canGoPrevious && offset > 0 && (
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-center bg-[#252525] z-10"
          style={{
            width: Math.min(Math.abs(offset), getContainerWidth() * 0.4),
            opacity: Math.min(Math.abs(offset) / 100, 1),
          }}
        >
          <div className="text-white/40 text-center">
            <div className="text-3xl">‹</div>
            <div className="text-xs mt-1">Página {currentPage - 1}</div>
          </div>
        </div>
      )}

      {/* Indicador de próxima página (direita) */}
      {canGoNext && offset < 0 && (
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-center bg-[#252525] z-10"
          style={{
            width: Math.min(Math.abs(offset), getContainerWidth() * 0.4),
            opacity: Math.min(Math.abs(offset) / 100, 1),
          }}
        >
          <div className="text-white/40 text-center">
            <div className="text-3xl">›</div>
            <div className="text-xs mt-1">Página {currentPage + 1}</div>
          </div>
        </div>
      )}

      {/* Conteúdo principal - altura total da viewport */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{
          transform: `translateX(${offset}px)`,
          transition: isAnimating
            ? `transform ${ANIMATION_DURATION}ms cubic-bezier(0.33, 1, 0.68, 1)`
            : 'none',
          willChange: isDragging.current ? 'transform' : 'auto',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}
