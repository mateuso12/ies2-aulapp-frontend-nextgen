import React from 'react'

interface ExerciseCommentProps {
  exerciseId: string
  questionNumber: number
  comment: {
    title: string
    content: string
    imageUrl?: string
  }
  onBackToQuestion: () => void
}

export const ExerciseComment: React.FC<ExerciseCommentProps> = ({
  exerciseId,
  questionNumber,
  comment,
  onBackToQuestion,
}) => {
  return (
    <div id={`comment-${exerciseId}`} className="mt-16 pt-8 border-t">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
        Comentário Questão {questionNumber}
      </h3>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {comment.title}
      </h2>
      {comment.imageUrl && (
        <img
          src={comment.imageUrl}
          alt={comment.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}
      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
        {comment.content}
      </p>
      <div className="flex justify-center">
        <button
          onClick={onBackToQuestion}
          className="flex items-center gap-2 px-8 py-3 bg-[#E91E63] hover:bg-[#C2185B] text-white font-semibold rounded-lg transition-colors"
        >
          Voltar para questão
          <svg
            className="w-5 h-5 rotate-180"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
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
    </div>
  )
}
