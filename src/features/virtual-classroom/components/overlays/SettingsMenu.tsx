import React, { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Setting2,
  Moon,
  Sun1,
  Global,
  EyeSlash,
  SearchNormal1,
  Bookmark,
  Edit2,
  Stickynote,
} from 'iconsax-react'
import { MoreVertical } from 'lucide-react'

interface SettingsMenuProps {
  isMobile?: boolean
  showTools?: boolean
  onHideToolbar?: () => void
  onSearchInPage?: () => void
  onBookmarkPage?: () => void
  onMarkText?: () => void
  onMakeNote?: () => void
  onOpenSettings?: () => void
  onOpenChange?: (open: boolean) => void
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  isMobile = false,
  showTools = true,
  onHideToolbar,
  onSearchInPage,
  onBookmarkPage,
  onMarkText,
  onMakeNote,
  onOpenChange,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSettingsSubmenuOpen, setIsSettingsSubmenuOpen] = useState(false)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  if (isMobile) {
    // Quando não há ferramentas (resourceType !== 'content'), abre direto as configurações
    if (!showTools) {
      return (
        <DropdownMenu
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            onOpenChange?.(open)
          }}
        >
          <DropdownMenuTrigger asChild>
            <button
              className={`p-3 rounded-lg cursor-pointer transition-colors outline-none hover:bg-black hover:text-white ${
                isOpen ? 'bg-[#FF246E] text-white hover:bg-primary' : ''
              }`}
              aria-label="Configurações"
              title="Configurações"
            >
              <MoreVertical size={30} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 bg-[#2C2C2C] text-white border-[#343A40] p-3 rounded-2xl shadow-xl space-y-1"
          >
            {/* Dark Mode Toggle */}
            <div
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
              onClick={(e) => {
                e.preventDefault()
                toggleDarkMode()
              }}
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon size="22" color="#E2E2E2" variant="Linear" />
                ) : (
                  <Sun1 size="22" color="#E2E2E2" variant="Linear" />
                )}
                <span className="text-base font-['Plus_Jakarta_Sans'] text-[#E2E2E2]">
                  Modo escuro
                </span>
              </div>
              <div
                className={`w-10 h-5 rounded-full relative transition-colors ${
                  isDarkMode ? 'bg-[#FF246E]' : 'bg-gray-500'
                }`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${
                    isDarkMode ? 'left-6' : 'left-1'
                  }`}
                />
              </div>
            </div>

            {/* Idioma */}
            <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white outline-none">
              <Global size="22" color="#E2E2E2" variant="Linear" />
              <span className="text-base font-['Plus_Jakarta_Sans'] text-[#E2E2E2]">
                Idioma
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    // Quando há ferramentas (resourceType === 'content'), mostra menu completo com submenu
    return (
      <>
        <DropdownMenu
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) {
              setIsSettingsSubmenuOpen(false)
            }
            onOpenChange?.(open)
          }}
        >
          <DropdownMenuTrigger asChild>
            <button
              className={`p-3 rounded-lg cursor-pointer transition-colors outline-none hover:bg-black hover:text-white ${
                isOpen ? 'bg-[#FF246E] text-white hover:bg-primary' : ''
              }`}
              aria-label="Menu"
              title="Menu"
            >
              <MoreVertical size={30} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 bg-[#2C2C2C] text-white border-[#343A40] p-3 rounded-2xl shadow-xl space-y-1"
          >
            <DropdownMenuItem
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 focus:bg-white/5 cursor-pointer"
              onClick={onSearchInPage}
            >
              <SearchNormal1 size="22" color="#E2E2E2" variant="Linear" />
              <span className="text-base font-['Plus_Jakarta_Sans'] text-[#E2E2E2]">
                Buscar na página
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 focus:bg-white/5 cursor-pointer"
              onClick={onBookmarkPage}
            >
              <Bookmark size="22" color="#E2E2E2" variant="Linear" />
              <span className="text-base font-['Plus_Jakarta_Sans'] text-[#E2E2E2]">
                Marcar página
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 focus:bg-white/5 cursor-pointer"
              onClick={onMarkText}
            >
              <Edit2 size="22" color="#E2E2E2" variant="Linear" />
              <span className="text-base font-['Plus_Jakarta_Sans'] text-[#E2E2E2]">
                Marcar texto
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 focus:bg-white/5 cursor-pointer"
              onClick={onMakeNote}
            >
              <Stickynote size="22" color="#E2E2E2" variant="Linear" />
              <span className="text-base font-['Plus_Jakarta_Sans'] text-[#E2E2E2]">
                Fazer anotação
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 focus:bg-white/5 cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                setIsSettingsSubmenuOpen(!isSettingsSubmenuOpen)
              }}
            >
              <Setting2 size="22" color="#E2E2E2" variant="Linear" />
              <span className="text-base font-['Plus_Jakarta_Sans'] text-[#E2E2E2]">
                Configurações
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings Submenu */}
        <DropdownMenu
          open={isSettingsSubmenuOpen}
          onOpenChange={(open) => {
            setIsSettingsSubmenuOpen(open)
            if (!open && isOpen) {
              setIsOpen(false)
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <div style={{ display: 'none' }} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 bg-[#2C2C2C] text-white border-[#343A40] p-3 rounded-2xl shadow-xl space-y-1"
          >
            {/* Dark Mode Toggle */}
            <div
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
              onClick={(e) => {
                e.preventDefault()
                toggleDarkMode()
              }}
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon size="22" color="#E2E2E2" variant="Linear" />
                ) : (
                  <Sun1 size="22" color="#E2E2E2" variant="Linear" />
                )}
                <span className="text-base font-['Plus_Jakarta_Sans'] text-[#E2E2E2]">
                  Modo escuro
                </span>
              </div>
              <div
                className={`w-10 h-5 rounded-full relative transition-colors ${
                  isDarkMode ? 'bg-[#FF246E]' : 'bg-gray-500'
                }`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${
                    isDarkMode ? 'left-6' : 'left-1'
                  }`}
                />
              </div>
            </div>

            {/* Idioma */}
            <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white outline-none">
              <Global size="22" color="#E2E2E2" variant="Linear" />
              <span className="text-base font-['Plus_Jakarta_Sans'] text-[#E2E2E2]">
                Idioma
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  }

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        onOpenChange?.(open)
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          className={`p-3.5 rounded-lg cursor-pointer transition-colors outline-none hover:bg-black hover:text-white ${
            isOpen ? 'bg-[#FF246E] text-white hover:bg-primary' : ''
          }`}
          aria-label="Configurações"
          title="Configurações"
        >
          <Setting2 size="24" color="currentColor" variant="Linear" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-[#2C2C2C] text-white border-[#343A40] p-2 rounded-xl shadow-xl flex flex-col gap-1"
      >
        {/* Dark Mode Toggle */}
        <div
          className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
          onClick={(e) => {
            e.preventDefault()
            toggleDarkMode()
          }}
        >
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <Moon size="20" color="#E2E2E2" variant="Linear" />
            ) : (
              <Sun1 size="20" color="#E2E2E2" variant="Linear" />
            )}
            <span className="text-sm font-['Plus_Jakarta_Sans'] text-[#E2E2E2]">
              Modo escuro
            </span>
          </div>
          <div
            className={`w-10 h-5 rounded-full relative transition-colors ${
              isDarkMode ? 'bg-[#FF246E]' : 'bg-gray-500'
            }`}
          >
            <div
              className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${
                isDarkMode ? 'left-6' : 'left-1'
              }`}
            />
          </div>
        </div>

        {/* Idioma */}
        <DropdownMenuItem className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white outline-none">
          <Global size="20" color="#E2E2E2" variant="Linear" />
          <span className="text-sm font-['Plus_Jakarta_Sans'] text-[#E2E2E2]">
            Idioma
          </span>
        </DropdownMenuItem>

        {/* Ocultar barra */}
        <DropdownMenuItem
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white outline-none"
          onClick={onHideToolbar}
        >
          <EyeSlash size="20" color="#E2E2E2" variant="Linear" />
          <span className="text-sm font-['Plus_Jakarta_Sans'] text-[#E2E2E2]">
            Ocultar barra
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
