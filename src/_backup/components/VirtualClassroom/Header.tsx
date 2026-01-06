import React, { useEffect, useRef, useState } from 'react'
import { HambergerMenu } from 'iconsax-react'
import { HeaderActions } from './HeaderActions'
import { HeaderStatus } from './HeaderStatus'
import { SidebarMenu } from './SidebarMenu'
import { FloatingBookmarkButton } from './FloatingBookmarkButton'
import { motion } from 'framer-motion'

interface HeaderProps {
  variant?: 'default' | 'gamified'
  lives?: number
  score?: number
  redoCurrent?: number
  redoTotal?: number
  currentPage?: number
  totalPages?: number
  resourceType?: string
  onBookmark?: () => void
  isBookmarked?: boolean
  title?: string
  onMenusOpenChange?: (open: boolean) => void
}

export const Header: React.FC<HeaderProps> = ({
  variant = 'default',
  lives = 5,
  score = 0,
  redoCurrent = 1,
  redoTotal = 3,
  currentPage = 1,
  totalPages = 1,
  resourceType = 'content',
  onBookmark,
  isBookmarked = false,
  title = 'Nome do conteúdo',
  onMenusOpenChange,
}) => {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const blurTimerRef = useRef<number | null>(null)

  // Único lugar que notifica o layout. Assim evitamos que uma fonte de lock
  // (ex.: busca) "destrave" o Header enquanto outra (ex.: sidebar) segue aberta.
  const lockVisible = isSearchActive || isSidebarOpen

  useEffect(() => {
    onMenusOpenChange?.(lockVisible)
  }, [lockVisible, onMenusOpenChange])

  useEffect(() => {
    return () => {
      if (blurTimerRef.current) {
        window.clearTimeout(blurTimerRef.current)
        blurTimerRef.current = null
      }
    }
  }, [])

  const handleSearchFocusIn: React.FocusEventHandler<HTMLElement> = () => {
    if (blurTimerRef.current) {
      window.clearTimeout(blurTimerRef.current)
      blurTimerRef.current = null
    }
    setIsSearchActive(true)
  }

  const handleSearchFocusOut: React.FocusEventHandler<HTMLElement> = (e) => {
    // Se o foco estiver só migrando dentro da região monitorada, mantém ativo.
    const next = e.relatedTarget as Node | null
    if (next && e.currentTarget.contains(next)) return

    // Caso comum: SearchPopover renderiza resultados em um portal.
    // Nesse fluxo, o foco "sai" do container, mas o usuário ainda está na busca.
    // Debounce curto evita esconder barra ao clicar rapidamente em um resultado.
    if (blurTimerRef.current) window.clearTimeout(blurTimerRef.current)
    blurTimerRef.current = window.setTimeout(() => {
      setIsSearchActive(false)
      blurTimerRef.current = null
    }, 250)
  }

  // Fallback para SearchPopover com portal: clicar fora ou ESC deve destravar.
  // (Sem essa camada, pode acontecer do foco não voltar pra dentro do Header,
  // e o isSearchActive ficar true indefinidamente.)
  useEffect(() => {
    if (!isSearchActive) return

    const ac = new AbortController()

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      const root = document.querySelector('[data-aulapp-search-popover-root]')

      // Se o UI kit não fornece um root, apenas destrava ao clicar fora do Header.
      // (Quando o popover está em portal, ele pode estar fora do header; nesse caso,
      // o ideal é que o UI kit adicione esse atributo no container do popover.)
      const clickedInsidePopover = !!(root && target && root.contains(target))
      const clickedInsideHeader = !!(target && target.closest('header'))

      if (!clickedInsidePopover && !clickedInsideHeader) {
        setIsSearchActive(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchActive(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown, {
      capture: true,
      signal: ac.signal,
    })
    window.addEventListener('keydown', handleKeyDown, { signal: ac.signal })

    return () => {
      ac.abort()
    }
  }, [isSearchActive])

  if (variant === 'gamified') {
    const progress = Math.min(
      100,
      Math.max(0, (currentPage / totalPages) * 100)
    )

    return (
      <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-white/18 backdrop-blur-sm px-8 py-6">
        {/* Left Pill */}
        <div
          onFocusCapture={handleSearchFocusIn}
          onBlurCapture={handleSearchFocusOut}
        >
          <HeaderActions
            variant="gamified"
            title="Nome da Aula"
            resourceType={resourceType}
          />
        </div>

        {/* Center Progress Bar */}
        <div className="h-4 w-full max-w-[400px] overflow-hidden rounded-full bg-white shadow-lg border-[3.38px] border-black/20">
          <motion.div
            className="h-full bg-linear-to-r from-[#FF5A82] to-[#FF246E]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        {/* Right Group */}
        <div className="flex items-center gap-4">
          <HeaderStatus
            variant="gamified"
            lives={lives}
            score={score}
            redoCurrent={redoCurrent}
            redoTotal={redoTotal}
          />

          {/* Menu Button - Ghost Variant */}
          <SidebarMenu onOpenChange={setIsSidebarOpen}>
            <button className="flex h-12 w-12 cursor-pointer items-center justify-center text-[#FF246E] hover:bg-white/10 rounded-full transition-colors">
              <HambergerMenu size="24" color="currentColor" variant="Linear" />
            </button>
          </SidebarMenu>
        </div>
      </header>
    )
  }

  return (
    <header className="relative z-20 w-full bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:h-[60px] md:h-[88px]">
      {/* Mobile */}
      <div className="hidden h-full w-full items-center justify-between max-md:flex max-md:px-4">
        {/* Left: Back + Title */}
        <div className="min-w-0 flex items-center gap-3">
          <HeaderActions
            variant="default"
            title={title}
            resourceType={resourceType}
          />
        </div>

        {/* Right: Bookmark + Hamburger */}
        <div className="flex items-center gap-2">
          <FloatingBookmarkButton
            isBookmarked={isBookmarked}
            onClick={onBookmark || (() => {})}
            variant="header"
          />

          <SidebarMenu onOpenChange={setIsSidebarOpen}>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#FF246E] hover:bg-gray-100 cursor-pointer"
              aria-label="Abrir menu de aulas"
            >
              <HambergerMenu size="24" color="currentColor" variant="Linear" />
            </button>
          </SidebarMenu>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden h-full w-full items-center justify-between md:flex md:px-8">
        {/* Left: Back & Title */}
        <div
          onFocusCapture={handleSearchFocusIn}
          onBlurCapture={handleSearchFocusOut}
        >
          <HeaderActions
            variant="default"
            title={title}
            resourceType={resourceType}
          />
        </div>

        {/* Center: Controls */}
        <div className="flex items-center gap-8">
          <HeaderStatus
            variant="default"
            lives={lives}
            score={score}
            redoCurrent={redoCurrent}
            redoTotal={redoTotal}
          />

          {/* Right: Menu */}
          <SidebarMenu onOpenChange={setIsSidebarOpen}>
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#FF246E] hover:bg-gray-100 cursor-pointer">
              <HambergerMenu size="24" color="currentColor" variant="Linear" />
            </button>
          </SidebarMenu>
        </div>
      </div>
    </header>
  )
}
