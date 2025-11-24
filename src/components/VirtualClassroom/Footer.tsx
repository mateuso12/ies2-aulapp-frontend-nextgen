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
    <footer className="flex h-[105px] w-full items-center justify-between bg-[#2C2C2C] px-8 text-white">
      {/* Left: Navigation Arrows */}
      <div className="flex items-center gap-8">
        <button className="flex h-[54px] w-[54px] items-center justify-center rounded-full hover:bg-white/10">
          <ArrowCircleLeft size="45" color="currentColor" variant="Bold" />
        </button>
        <button className="flex h-[54px] w-[54px] items-center justify-center rounded-full hover:bg-white/10">
          <ArrowCircleRight size="45" color="currentColor" variant="Bold" />
        </button>
      </div>

      {/* Center: Tools */}
      <div className="flex h-[48px] items-center gap-12 rounded-full bg-[#FFFFFF]/10 px-8 backdrop-blur-md">
        <button className="p-2 hover:text-[#FF246E]">
          <Category size="24" color="currentColor" variant="Linear" />
        </button>
        <button className="p-2 hover:text-[#FF246E]">
          <Stickynote size="24" color="currentColor" variant="Linear" />
        </button>
        <button className="p-2 hover:text-[#FF246E]">
          <Edit2 size="24" color="currentColor" variant="Linear" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-['Jacquard_12'] text-2xl">5 de 19</span>
        </div>

        <button className="p-2 hover:text-[#FF246E]">
          <ReceiveSquare size="24" color="currentColor" variant="Linear" />
        </button>
        <button className="p-2 hover:text-[#FF246E]">
          <Maximize3 size="24" color="currentColor" variant="Linear" />
        </button>
      </div>

      {/* Right: Settings */}
      <button className="p-2 hover:text-[#FF246E]">
        <Setting2 size="24" color="currentColor" variant="Linear" />
      </button>
    </footer>
  )
}
