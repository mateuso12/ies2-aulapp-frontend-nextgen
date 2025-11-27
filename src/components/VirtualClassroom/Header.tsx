import React from 'react'
import {
  ArrowLeft,
  SearchNormal,
  HambergerMenu,
  Heart,
  Flash,
} from 'iconsax-react'
import { ResourceBadge, SearchPopover } from 'ies2-aulapp-ui-kit'
import { Timer } from './Timer'
import { RedoCounter } from './RedoCounter'

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
      <header className="fixed top-0 z-50 flex w-full items-start justify-between bg-transparent px-8 py-6 pointer-events-none">
        {/* Left Pill */}
        <div className="pointer-events-auto flex items-center gap-4 rounded-2xl bg-linear-to-r from-[#FF5A82] to-[#FF246E] p-2 pr-6 shadow-lg">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/20">
            <ArrowLeft size="24" color="currentColor" variant="Linear" />
          </button>

          <h1 className="font-sans text-xl font-bold text-white">
            4.2 Nome da Aula
          </h1>

          <div className="hidden md:block">
            <ResourceBadge
              variant="lista"
              appearance="solid"
              className="bg-white/20 text-white shadow-none"
            />
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded bg-white text-[#FF246E]">
            <SearchNormal size="20" color="currentColor" variant="Linear" />
          </div>
        </div>

        {/* RedoCounter */}
        <div className="pointer-events-auto">
          <RedoCounter current={redoCurrent} total={redoTotal} />
        </div>

        {/* Center Progress Bar */}
        <div className="pointer-events-auto mt-3 h-4 w-full max-w-[400px] overflow-hidden rounded-full bg-white shadow-lg">
          <div className="h-full w-[70%] bg-linear-to-r from-[#FF5A82] to-[#FF246E]" />
        </div>

        {/* Right Group */}
        <div className="flex items-start gap-4 pointer-events-auto">
          <div className="flex flex-col items-end gap-2">
            {/* Stats Pill */}
            <div className="flex items-center gap-6 rounded-2xl bg-linear-to-r from-[#FF5A82] to-[#FF246E] p-2 px-6 shadow-lg text-white">
              {/* Streak */}
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#FF246E]">
                  <Flash size="18" variant="Bold" color="currentColor" />
                </div>
                <span className="font-bold font-sans">{score} pts</span>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#FF246E]">
                  <Timer
                    variant="minimal"
                    className="text-[#FF246E] gap-0 [&>span]:hidden"
                  />
                </div>
                <Timer
                  variant="minimal"
                  className="[&>svg]:hidden text-white"
                />
              </div>
            </div>

            {/* Lives */}
            <div className="flex gap-1 pr-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Heart
                  key={index}
                  size="24"
                  color={index < lives ? '#ED3237' : '#B8BCC0'}
                  variant="Bold"
                  className="drop-shadow-sm"
                />
              ))}
            </div>
          </div>

          {/* Menu Button */}
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#FF246E] shadow-lg hover:bg-gray-50">
            <HambergerMenu size="24" color="currentColor" variant="Linear" />
          </button>
        </div>
      </header>
    )
  }

  return (
    <header className="flex w-full items-center justify-between bg-white shadow-sm max-md:h-[60px] max-md:px-4 md:h-[88px] md:px-8">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#FF246E] hover:bg-gray-100">
          <ArrowLeft size="24" color="currentColor" variant="Linear" />
        </button>

        {/* Mobile Title */}
        <span className="hidden font-sans text-base font-semibold text-[#FF246E] max-md:inline">
          Conteúdo
        </span>

        {/* Desktop Title */}
        <h1 className="hidden font-sans text-2xl font-semibold text-[#FF246E] md:block">
          4.2 <span className="text-[#FF246E]">Nome da Aula</span>
        </h1>

        <div className="hidden md:block">
          <ResourceBadge
            variant="gamificada"
            appearance="solid"
            className="shadow-none"
          />
        </div>

        {/* Search (Desktop Only) */}
        <SearchPopover resultsCount={2} />
      </div>

      {/* Center: Controls (Desktop Only) */}
      <div className="flex items-center gap-8">
        <div className="hidden items-center gap-8 md:flex">
          {/* Timer */}
          <Timer />
          <RedoCounter current={1} total={3} />
        </div>

        {/* Right: Menu */}
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#FF246E] hover:bg-gray-100">
          <HambergerMenu size="24" color="currentColor" variant="Linear" />
        </button>
      </div>
    </header>
  )
}
