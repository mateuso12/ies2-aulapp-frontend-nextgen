import React from 'react'
import { Flash, RefreshCircle, Heart } from 'iconsax-react'
import { Timer } from '../ui/Timer'

interface HeaderStatusProps {
  variant?: 'default' | 'gamified'
  score: number
  lives: number
  redoCurrent: number
  redoTotal: number
}

export const HeaderStatus: React.FC<HeaderStatusProps> = ({
  variant = 'default',
  score,
  lives,
  redoCurrent,
  redoTotal,
}) => {
  if (variant === 'default') {
    return (
      <div className="flex items-center gap-4">
        <Timer />
        <div className="flex items-center gap-2 rounded-2xl border-4 border-[#FFB6B6] bg-white px-4 py-2">
          <RefreshCircle size="24" color="#FF246E" variant="Bold" />
          <div className="flex items-center gap-1">
            {Array.from({ length: redoTotal }).map((_, index) => (
              <div
                key={index}
                className={`h-[12.89px] w-[12.89px] rounded-full ${
                  index < redoCurrent ? 'bg-[#487BFF]' : 'bg-[#D9D9D9]'
                }`}
              />
            ))}
          </div>
          <span className="font-sans text-base font-bold text-[#343A40]">
            {redoCurrent}/{redoTotal}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Main Status Container */}
      <div className="flex items-center gap-8 rounded-4xl border-[3.38px] border-black/20 bg-linear-to-r from-[#FF5A82] to-[#FF246E] px-6 pb-8 pt-4 shadow-lg">
        {/* Score */}
        <div className="flex items-center">
          <div
            className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#FF246E]"
            style={{ boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
          >
            <Flash size="24" variant="Bold" color="currentColor" />
          </div>
          <div className="-ml-4 flex h-8 items-center rounded-[5.41px] border-[3.38px] border-black/20 bg-[#F45D86] pl-6 pr-4">
            <span className="font-baloo text-xl font-bold text-white">
              {score} pts
            </span>
          </div>
        </div>

        {/* Redo Counter */}
        <div className="flex items-center">
          <div
            className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#FF246E]"
            style={{ boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
          >
            <RefreshCircle size="24" variant="Bold" color="currentColor" />
          </div>
          <div className="-ml-4 flex h-8 items-center rounded-[5.41px] border-[3.38px] border-black/20 bg-[#F45D86] pl-6 pr-4">
            <span className="font-baloo text-xl font-bold text-white">
              {redoCurrent}/{redoTotal}
            </span>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center">
          <div
            className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#FF246E]"
            style={{ boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
          >
            <Timer
              variant="minimal"
              className="!text-[#FF246E] !gap-0 [&>span]:hidden"
            />
          </div>
          <div className="-ml-4 flex h-8 items-center rounded-[5.41px] bg-white pl-6 pr-4">
            <Timer
              variant="minimal"
              className="font-baloo [&>svg]:hidden text-[#FF246E]"
            />
          </div>
        </div>
      </div>

      {/* Hanging Lives */}
      <div className="absolute -bottom-5 flex gap-0">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
          >
            <Heart
              size="20"
              color={index < lives ? '#ED3237' : '#B8BCC0'}
              variant="Bold"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
