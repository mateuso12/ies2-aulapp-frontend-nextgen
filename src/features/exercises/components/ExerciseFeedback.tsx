import React from 'react'

interface ExerciseFeedbackProps {
  feedback: string
  variant?: 'error' | 'info'
}

export const ExerciseFeedback: React.FC<ExerciseFeedbackProps> = ({
  feedback,
  variant = 'error',
}) => {
  const borderColor = variant === 'error' ? '#EC272B' : '#2BC779'

  return (
    <div
      className="w-full min-h-[69px] p-4 bg-white rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border-2"
      style={{ borderColor }}
    >
      <p className="font-plus-jakarta font-normal text-[14px] text-black leading-normal">
        {feedback}
      </p>
    </div>
  )
}
