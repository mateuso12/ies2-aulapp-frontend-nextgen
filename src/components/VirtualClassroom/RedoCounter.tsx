import React from 'react'
import { RefreshCircle } from 'iconsax-react'

interface RedoCounterProps {
  current: number
  total: number
}

export const RedoCounter: React.FC<RedoCounterProps> = ({ current, total }) => {
  return (
    <div
      className="flex w-fit items-center gap-4 rounded-2xl border-4 bg-white px-4 py-2"
      style={{ borderColor: '#FFB6B6' }}
    >
      {/* Refresh Icon */}
      <RefreshCircle size="24" color="#FF246E" variant="Bold" />

      {/* Dots and Text Container */}
      <div className="flex items-center gap-9">
        {/* Dots */}
        <div className="flex items-center gap-1">
          {Array.from({ length: total }).map((_, index) => (
            <div
              key={index}
              className={`h-[12.89px] w-[12.89px] rounded-full ${
                index < current ? 'bg-[#487BFF]' : 'bg-[#D9D9D9]'
              }`}
            />
          ))}
        </div>

        {/* Text */}
        <span className="font-sans text-base font-bold text-[#343A40]">
          {current}/{total}
        </span>
      </div>
    </div>
  )
}
