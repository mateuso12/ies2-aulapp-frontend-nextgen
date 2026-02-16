import React, { useEffect, useMemo, useState } from 'react'
import {
  ExerciseFeedback,
  ExerciseComment,
  ViewCommentButton,
} from '@/features/exercises/components'
import type {
  OrderingExercise,
  ExerciseValidationResult,
} from '@/features/exercises/types'

interface OrderingExerciseComponentProps {
  exercise: OrderingExercise
  value: string[] | undefined
  readonly?: boolean
  validationResult?: ExerciseValidationResult
  resourceType: string
  currentPageIndex: number
  comment?: { title: string; content: string; imageUrl?: string }
  onChange: (answer: string[]) => void
}

export const OrderingExerciseComponent: React.FC<
  OrderingExerciseComponentProps
> = ({
  exercise,
  value,
  readonly = false,
  validationResult,
  resourceType,
  currentPageIndex,
  comment,
  onChange,
}) => {
  const [showComment, setShowComment] = useState(false)

  const fallbackOrder = useMemo(
    () => exercise.data.items.map((item) => item.id),
    [exercise.data.items]
  )

  const currentOrder =
    value && value.length === exercise.data.items.length ? value : fallbackOrder

  const itemById = useMemo(
    () =>
      exercise.data.items.reduce<Record<string, string>>((acc, item) => {
        acc[item.id] = item.text
        return acc
      }, {}),
    [exercise.data.items]
  )

  useEffect(() => {
    if (!value || value.length !== exercise.data.items.length) {
      onChange(fallbackOrder)
    }
  }, [value, exercise.data.items.length, fallbackOrder, onChange])

  useEffect(() => {
    setShowComment(false)
  }, [exercise.id])

  const moveItem = (index: number, direction: -1 | 1) => {
    if (readonly) return

    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= currentOrder.length) return

    const reordered = [...currentOrder]
    ;[reordered[index], reordered[nextIndex]] = [
      reordered[nextIndex],
      reordered[index],
    ]
    onChange(reordered)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {currentOrder.map((itemId, index) => (
          <div
            key={itemId}
            className="flex items-center gap-3 rounded-2xl border-2 border-[#C6D3F5] bg-white px-4 py-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#487BFF] text-sm font-bold text-white">
              {index + 1}
            </div>

            <p className="flex-1 text-sm text-gray-900">{itemById[itemId]}</p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                disabled={readonly || index === 0}
                className="h-8 w-8 rounded-md border border-[#C6D3F5] text-base text-[#487BFF] disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                disabled={readonly || index === currentOrder.length - 1}
                className="h-8 w-8 rounded-md border border-[#C6D3F5] text-base text-[#487BFF] disabled:opacity-40"
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>

      {validationResult && validationResult.feedback && (
        <ExerciseFeedback
          feedback={validationResult.feedback}
          variant={validationResult.isCorrect ? 'info' : 'error'}
        />
      )}

      {validationResult && comment && resourceType === 'simulation' && (
        <ViewCommentButton
          exerciseId={exercise.id}
          onClick={() => setShowComment(true)}
        />
      )}

      {validationResult &&
        comment &&
        resourceType === 'simulation' &&
        showComment && (
          <ExerciseComment
            exerciseId={exercise.id}
            questionNumber={currentPageIndex + 1}
            comment={comment}
            onBackToQuestion={() => {
              setShowComment(false)
              const mainElement = document.querySelector('main.overflow-auto')
              if (mainElement) {
                mainElement.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }
            }}
          />
        )}
    </div>
  )
}
