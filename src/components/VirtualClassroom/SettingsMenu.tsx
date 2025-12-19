import React, { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Setting2, Moon, Sun1, Global, EyeSlash } from 'iconsax-react'

interface SettingsMenuProps {
  isMobile?: boolean
  onHideToolbar?: () => void
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  isMobile: _,
  onHideToolbar,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors outline-none">
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
