import React, { useState, useEffect } from 'react'
import { Timer1 } from 'iconsax-react'
import moment from 'moment'

interface TimerProps {
  variant?: 'default' | 'minimal'
  className?: string
}

export const Timer: React.FC<TimerProps> = ({
  variant = 'default',
  className = '',
}) => {
  // Initial time: 5 minutes 21 seconds = 321 seconds
  const [timeLeft, setTimeLeft] = useState(321)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Timer1 color="currentColor" variant="Bold" className="h-6 w-6" />
        <span className="font-sans text-base font-bold tabular-nums">
          {moment.utc(timeLeft * 1000).format('mm:ss')}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-2xl border-4 bg-transparent px-4 py-2 text-[#FF246E] ${className}`}
      style={{ borderColor: '#FFB6B6' }}
    >
      <Timer1 color="currentColor" variant="Bold" className="h-6 w-6" />
      <span className="font-baloo text-xl leading-2 font-bold tabular-nums text-[#343A40]">
        {moment.utc(timeLeft * 1000).format('mm:ss')}
      </span>
    </div>
  )
}
