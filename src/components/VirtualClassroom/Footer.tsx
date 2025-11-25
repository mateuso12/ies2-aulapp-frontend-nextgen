import React from 'react'
import {
  Setting2,
  ArrowCircleRight,
  ArrowCircleLeft,
  Maximize3,
  ReceiveSquare,
  Edit2,
  Stickynote,
  Category,
} from 'iconsax-react'

export const Footer: React.FC = () => {
  return (
    <footer className="relative flex h-[105px] w-full items-center justify-center bg-[#2C2C2C] px-8 text-white">
      {/* Main Block (Centered) */}
      <div className="flex w-full max-w-[1092px] items-center justify-between">
        {/* Left Arrow */}
        <button className="flex h-[54px] w-[54px] items-center justify-center rounded-full hover:bg-white/10">
          <ArrowCircleLeft size="45" color="currentColor" variant="Bold" />
        </button>

        {/* Center Tools */}
        <div className="flex items-center gap-12">
          {/* Tools Group */}
          <div className="flex items-center gap-8">
            <button className="p-2 hover:text-[#FF246E]">
              <Category size="24" color="currentColor" variant="Linear" />
            </button>
            <button className="p-2 hover:text-[#FF246E]">
              <Stickynote size="24" color="currentColor" variant="Linear" />
            </button>
            <button className="p-2 hover:text-[#FF246E]">
              <Edit2 size="24" color="currentColor" variant="Linear" />
            </button>
          </div>

          {/* Slide Counter */}
          <span className="font-['Jacquard_12'] text-2xl">5 de 19</span>

          {/* Right Tools */}
          <div className="flex items-center gap-8">
            <button className="p-2 hover:text-[#FF246E]">
              <ReceiveSquare size="24" color="currentColor" variant="Linear" />
            </button>
            <button className="p-2 hover:text-[#FF246E]">
              <Maximize3 size="24" color="currentColor" variant="Linear" />
            </button>
          </div>
        </div>

        {/* Right Arrow */}
        <button className="flex h-[54px] w-[54px] items-center justify-center rounded-full hover:bg-white/10">
          <ArrowCircleRight size="45" color="currentColor" variant="Bold" />
        </button>
      </div>

      {/* Settings (Absolute Right) */}
      <div className="absolute right-8">
        <button className="p-2 hover:text-[#FF246E]">
          <Setting2 size="24" color="currentColor" variant="Linear" />
        </button>
      </div>
    </footer>
  )
}
