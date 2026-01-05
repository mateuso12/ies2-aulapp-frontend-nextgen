import React, {
  type ReactNode,
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react'

interface SwipeableContentWrapperProps {
  children: ReactNode
  currentPage: number
  totalPages: number
  onNext?: () => void
  onPrevious?: () => void
  enabled?: boolean
  className?: string
}

// Chave para localStorage do hint de swipe
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
export const SwipeableContentWrapper: React.FC<SwipeableContentWrapperProps> = ({
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
  
  // Refs para valores durante o gesto
  const startX = useRef(0)
  const startY = useRef(0)
  const isDragging = useRef(false)
  const isHorizontalSwipe = useRef<boolean | null>(null)

  // Verifica se pode navegar
  const canGoNext = currentPage < totalPages && !!onNext
  const canGoPrevious = currentPage > 1 && !!onPrevious

  // Configurações do swipe
  const SWIPE_THRESHOLD = 0.2 // 20% da largura da tela
  const MAX_OFFSET_RATIO = 0.4 // Máximo de 40% de offset
  const ANIMATION_DURATION = 250 // ms

  const getContainerWidth = useCallback(() => {
    return containerRef.current?.offsetWidth || window.innerWidth
  }, [])

  // Aplica resistência nas bordas
  const applyResistance = useCallback((value: number, canMove: boolean): number => {
    if (!canMove) {
      // Forte resistência quando não pode mover nessa direção
      return value * 0.15
    }
    
    const maxOffset = getContainerWidth() * MAX_OFFSET_RATIO
    if (Math.abs(value) <= maxOffset) return value
    
    // Resistência suave após o limite
    const sign = value < 0 ? -1 : 1
    const excess = Math.abs(value) - maxOffset
    return sign * (maxOffset + excess * 0.3)
  }, [getContainerWidth])

  // Anima para uma posição
  const animateTo = useCallback((targetOffset: number, callback?: () => void) => {
    setIsAnimating(true)
    setOffset(targetOffset)
    
    setTimeout(() => {
      setIsAnimating(false)
      setOffset(0)
      callback?.()
    }, ANIMATION_DURATION)
  }, [])

  // Mostrar hint de swipe no primeiro uso (apenas se há mais de uma página)
  useEffect(() => {
    if (!enabled || totalPages <= 1) return
    
    const hasSeenHint = localStorage.getItem(SWIPE_HINT_SHOWN_KEY)
    if (!hasSeenHint) {
      // Pequeno delay para o hint aparecer após o conteúdo carregar
      const timer = setTimeout(() => {
        setShowSwipeHint(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [enabled, totalPages])

  // Esconde o hint após interação ou tempo
  const dismissHint = useCallback(() => {
    setShowSwipeHint(false)
    localStorage.setItem(SWIPE_HINT_SHOWN_KEY, 'true')
  }, [])

  // Handlers de touch
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled || isAnimating) return
    
    // Esconde o hint ao interagir
    if (showSwipeHint) {
      dismissHint()
    }
    
    const touch = e.touches[0]
    startX.current = touch.clientX
    startY.current = touch.clientY
    isDragging.current = true
    isHorizontalSwipe.current = null
  }, [enabled, isAnimating, showSwipeHint, dismissHint])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enabled || !isDragging.current || isAnimating) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - startX.current
    const deltaY = touch.clientY - startY.current
    
    // Determina a direção do swipe na primeira movimentação significativa
    if (isHorizontalSwipe.current === null) {
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)
      
      if (absX > 10 || absY > 10) {
        isHorizontalSwipe.current = absX > absY
      }
    }
    
    // Se é swipe vertical, não faz nada (deixa o scroll natural)
    if (isHorizontalSwipe.current === false) {
      return
    }
    
    // Se é horizontal, previne scroll e aplica offset
    if (isHorizontalSwipe.current === true) {
      e.preventDefault()
      
      const canMove = deltaX < 0 ? canGoNext : canGoPrevious
      const constrainedOffset = applyResistance(deltaX, canMove)
      setOffset(constrainedOffset)
    }
  }, [enabled, isAnimating, canGoNext, canGoPrevious, applyResistance])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!enabled || !isDragging.current || isAnimating) return
    
    isDragging.current = false
    
    // Se não foi swipe horizontal, apenas reseta
    if (isHorizontalSwipe.current !== true) {
      isHorizontalSwipe.current = null
      return
    }
    
    isHorizontalSwipe.current = null
    
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - startX.current
    const width = getContainerWidth()
    const threshold = width * SWIPE_THRESHOLD
    
    // Calcula velocidade
    // const deltaTime = e.timeStamp - touchStartTime.current
    // const velocity = Math.abs(deltaX) / deltaTime
    
    // Decide se navega ou cancela
    const shouldNavigate = Math.abs(deltaX) > threshold
    
    if (shouldNavigate && deltaX < 0 && canGoNext) {
      // Swipe para esquerda → próxima página
      animateTo(-width, onNext)
    } else if (shouldNavigate && deltaX > 0 && canGoPrevious) {
      // Swipe para direita → página anterior
      animateTo(width, onPrevious)
    } else {
      // Cancela - volta ao centro
      animateTo(0)
    }
  }, [enabled, isAnimating, canGoNext, canGoPrevious, getContainerWidth, animateTo, onNext, onPrevious])

  // Limpa estado quando página muda
  useEffect(() => {
    setOffset(0)
    setIsAnimating(false)
  }, [currentPage])

  // Auto-dismiss do hint após alguns segundos
  useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => {
        dismissHint()
      }, 5000) // 5 segundos
      return () => clearTimeout(timer)
    }
  }, [showSwipeHint, dismissHint])

  // Se não está habilitado (desktop), renderiza direto com altura total
  if (!enabled) {
    return <div className={`absolute inset-0 flex flex-col ${className}`}>{children}</div>
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Hint de swipe - aparece apenas no primeiro uso */}
      {showSwipeHint && (
        <div 
          className="fixed inset-0 z-100 pointer-events-auto flex items-center justify-center"
          onClick={dismissHint}
        >
          {/* Overlay escurecido */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Conteúdo do hint */}
          <div className="relative flex flex-col items-center gap-4 text-white px-8">
            {/* Ícone animado de swipe */}
            <div className="relative flex items-center justify-center">
              {/* Mão com gesto de swipe */}
              <div className="animate-swipe-hint text-5xl">
                👆
              </div>
            </div>
            
            {/* Texto explicativo */}
            <div className="text-center">
              <p className="text-lg font-medium mb-1">Deslize para navegar</p>
              <p className="text-sm text-white/70">
                Arraste para os lados para ir<br />para a próxima ou página anterior
              </p>
            </div>

            {/* Indicador visual de direções */}
            <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center text-white/60">
                <span className="text-2xl mr-2">‹</span>
                <span className="text-xs">Anterior</span>
              </div>
              <div className="w-px h-6 bg-white/30" />
              <div className="flex items-center text-white/60">
                <span className="text-xs">Próxima</span>
                <span className="text-2xl ml-2">›</span>
              </div>
            </div>

            {/* Botão para dispensar */}
            <button 
              className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors pointer-events-auto"
              onClick={dismissHint}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

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
          transition: isAnimating ? `transform ${ANIMATION_DURATION}ms cubic-bezier(0.33, 1, 0.68, 1)` : 'none',
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
