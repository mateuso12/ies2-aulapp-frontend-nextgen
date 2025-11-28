import React from 'react'
import { HambergerMenu } from 'iconsax-react'
import { HeaderActions } from './HeaderActions'
import { HeaderStatus } from './HeaderStatus'

interface HeaderProps {
  variant?: 'default' | 'gamified'
  lives?: number
  score?: number
  redoCurrent?: number
  redoTotal?: number
}

export const Header: React.FC<HeaderProps> = ({
  variant = 'default',
  lives = 5,
  score = 0,
  redoCurrent = 1,
  redoTotal = 3,
}) => {
  if (variant === 'gamified') {
    return (
      <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-white/18 backdrop-blur-sm px-8 py-6 pointer-events-none">
        {/* Left Pill */}
        <HeaderActions variant="gamified" title="Nome da Aula" />

        {/* Center Progress Bar */}
        <div className="pointer-events-auto h-4 w-full max-w-[400px] overflow-hidden rounded-full bg-white shadow-lg border-[3.38px] border-black/20">
          <div className="h-full w-[70%] bg-linear-to-r from-[#FF5A82] to-[#FF246E]" />
        </div>

        {/* Right Group */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <HeaderStatus
            variant="gamified"
            lives={lives}
            score={score}
            redoCurrent={redoCurrent}
            redoTotal={redoTotal}
          />

          {/* Menu Button - Ghost Variant */}
          <button className="flex h-12 w-12 items-center justify-center text-[#FF246E] hover:bg-white/10 rounded-full transition-colors">
            <HambergerMenu size="24" color="currentColor" variant="Linear" />
          </button>
        </div>
      </header>
    )
  }

  return (
    <header className="flex w-full items-center justify-between bg-white shadow-sm max-md:h-[60px] max-md:px-4 md:h-[88px] md:px-8">
      {/* Left: Back & Title */}
      <HeaderActions variant="default" title="Nome da Aula" />

      {/* Center: Controls (Desktop Only) */}
      <div className="flex items-center gap-8">
        <HeaderStatus
          variant="default"
          lives={lives}
          score={score}
          redoCurrent={redoCurrent}
          redoTotal={redoTotal}
        />

        {/* Right: Menu */}
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#FF246E] hover:bg-gray-100">
          <HambergerMenu size="24" color="currentColor" variant="Linear" />
        </button>
      </div>
    </header>
  )
}
