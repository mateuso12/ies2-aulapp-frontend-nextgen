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
  RefreshLeftSquare,
} from 'iconsax-react'

interface FooterProps {
  onToggleAnnotations?: () => void
  resourceType?: string
}

export const Footer: React.FC<FooterProps> = ({
  onToggleAnnotations,
  resourceType = 'content',
}) => {
  const showTools = resourceType === 'content' || resourceType === 'material'

  return (
    <footer className="relative flex w-full items-center justify-center bg-[#2C2C2C] text-white max-md:h-20 max-md:rounded-t-2xl max-md:px-4 md:h-[105px] md:px-8">
      {/* Mobile Content */}
      <div className="hidden w-full items-center justify-between max-md:flex">
        {/* Left Tools */}
        <div className="flex items-center gap-4">
          <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
            <Category size="24" color="currentColor" variant="Linear" />
          </button>
          <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
            <RefreshLeftSquare
              size="24"
              color="currentColor"
              variant="Linear"
            />
          </button>
        </div>

        {/* Center: Counter & Dots */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-['Jacquard_12'] text-xl">1 de 8</span>
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-4">
          <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
            <ReceiveSquare size="24" color="currentColor" variant="Linear" />
          </button>
          <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
            <Maximize3 size="24" color="currentColor" variant="Linear" />
          </button>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="hidden w-full max-w-[1092px] items-center justify-between md:flex">
        {/* Left Arrow */}
        <button className="flex h-[54px] w-[54px] items-center justify-center rounded-full hover:bg-white/10 cursor-pointer">
          <ArrowCircleLeft size="45" color="currentColor" variant="Bold" />
        </button>

        {/* Center Tools */}
        <div className="flex items-center gap-12">
          {/* Tools Group */}
          <div className="flex items-center gap-8">
            <button
              className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors"
              aria-label="Menu"
            >
              <Category size="24" color="currentColor" variant="Linear" />
            </button>
            {showTools && (
              <>
                <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
                  <Stickynote size="24" color="currentColor" variant="Linear" />
                </button>
                {onToggleAnnotations && (
                  <button
                    onClick={onToggleAnnotations}
                    className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors"
                  >
                    <Edit2 size="24" color="currentColor" variant="Linear" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Slide Counter */}
          <span className="font-['Jacquard_12'] text-2xl">5 de 19</span>

          {/* Right Tools */}
          <div className="flex items-center gap-8">
            <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
              <ReceiveSquare size="24" color="currentColor" variant="Linear" />
            </button>
            {showTools && (
              <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
                <Maximize3 size="24" color="currentColor" variant="Linear" />
              </button>
            )}
          </div>
        </div>

        {/* Right Arrow */}
        <button className="flex h-[54px] w-[54px] items-center justify-center rounded-full hover:bg-white/10 cursor-pointer">
          <ArrowCircleRight size="45" color="currentColor" variant="Bold" />
        </button>
      </div>

      {/* Settings (Desktop Only) */}
      <div className="absolute right-8 hidden items-center gap-2 md:flex">
        {!showTools && (
          <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
            <Maximize3 size="24" color="currentColor" variant="Linear" />
          </button>
        )}
        <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
          <Setting2 size="24" color="currentColor" variant="Linear" />
        </button>
      </div>
    </footer>
  )
}
