import React from 'react'

interface ExerciseResultIndicatorProps {
  isCorrect: boolean
}

export const ExerciseResultIndicator: React.FC<
  ExerciseResultIndicatorProps
> = ({ isCorrect }) => {
  if (isCorrect) {
    return (
      <div className="flex items-center justify-center gap-1">
        <svg
          className="w-[71.711px] h-[71.711px] shrink-0"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="36" cy="36" r="36" fill="#2BC779" />
          <path
            d="M30 36L33.5 39.5L42 31"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="font-sans font-semibold text-[32px] leading-none text-black dark:text-white tracking-[-0.48px]">
          Correto
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <svg
        className="w-[71.711px] h-[71.711px] shrink-0"
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="36" cy="36" r="36" fill="#EC272B" />
        <path
          d="M28 28L44 44M44 28L28 44"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="font-sans font-semibold text-[32px] leading-none text-black dark:text-white tracking-[-0.48px]">
        Incorreto
      </p>
    </div>
  )
}
