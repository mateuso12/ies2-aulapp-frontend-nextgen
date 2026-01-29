import React from 'react'

interface ViewCommentButtonProps {
  exerciseId: string
  onClick?: () => void
}

export const ViewCommentButton: React.FC<ViewCommentButtonProps> = ({
  exerciseId,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }

    document
      .getElementById(`comment-${exerciseId}`)
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex justify-center pt-8">
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-8 py-3 bg-[#E91E63] hover:bg-[#C2185B] text-white font-semibold rounded-lg transition-colors"
      >
        Ver comentário
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M12 8v8m0 0l4-4m-4 4l-4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>
    </div>
  )
}
