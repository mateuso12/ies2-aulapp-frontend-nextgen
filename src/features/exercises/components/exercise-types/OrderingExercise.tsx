import React, { useState, useEffect } from 'react'
import type {
  ExerciseComponentProps,
  OrderingData,
  OrderingAnswer,
} from '../../types'
import { cn } from '@/lib/utils'
import { shuffleArray } from '../../lib/utils'

export const OrderingExercise: React.FC<
  ExerciseComponentProps<OrderingData, OrderingAnswer>
> = ({
  exercise,
  value = [],
  onChange,
  readonly = false,
  validationResult,
  disabled = false,
}) => {
  const [orderedItems, setOrderedItems] = useState<string[]>([])
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null)

  useEffect(() => {
    if (value && value.length > 0) {
      setOrderedItems(value)
    } else {
      let initialOrder = exercise.data.items.map((item: { id: string }) => item.id)

      if (exercise.data.shuffleItems) {
        initialOrder = shuffleArray(initialOrder)
      }

      setOrderedItems(initialOrder)
      onChange?.(initialOrder)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sincroniza com valor externo (quando há mudanças de fora do componente)
  useEffect(() => {
    if (value && value.length > 0 && JSON.stringify(value) !== JSON.stringify(orderedItems)) {
      setOrderedItems(value)
    }
  }, [value, orderedItems])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
    if (readonly || disabled || validationResult?.isCorrect) return

    setDraggedItemId(itemId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', itemId)
  }

  const handleDragEnd = () => {
    setDraggedItemId(null)
    setDragOverItemId(null)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (itemId: string) => {
    if (readonly || disabled || validationResult?.isCorrect) return
    setDragOverItemId(itemId)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetItemId: string) => {
    e.preventDefault()

    if (readonly || disabled || validationResult?.isCorrect || !draggedItemId) return

    if (draggedItemId === targetItemId) {
      setDragOverItemId(null)
      return
    }

    const newOrder = [...orderedItems]
    const draggedIndex = newOrder.indexOf(draggedItemId)
    const targetIndex = newOrder.indexOf(targetItemId)

    newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, draggedItemId)

    setOrderedItems(newOrder)
    onChange?.(newOrder)
    setDragOverItemId(null)
  }

  const getItemById = (itemId: string) => {
    return exercise.data.items.find((item: { id: string }) => item.id === itemId)
  }

  const isItemCorrect = (itemId: string, index: number): boolean => {
    if (!validationResult) return false

    const item = getItemById(itemId)
    if (!item) return false

    return item.correctOrder === index
  }

  const getItemStyles = (itemId: string, index: number) => {
    const isDragging = draggedItemId === itemId
    const isDragOver = dragOverItemId === itemId
    const isCorrect = validationResult && isItemCorrect(itemId, index)
    const isIncorrect = validationResult && !validationResult.isCorrect && !isItemCorrect(itemId, index)

    if (isCorrect && validationResult?.isCorrect) {
      return {
        borderColor: 'border-[#2BC779]',
        backgroundColor: 'bg-[#C9F6DB] dark:bg-green-900/20',
        cursor: 'default',
      }
    }

    if (isIncorrect) {
      return {
        borderColor: 'border-[#EC272B]',
        backgroundColor: 'bg-[#FFCAD6] dark:bg-red-900/20',
        cursor: 'default',
      }
    }

    if (isDragOver && !isDragging) {
      return {
        borderColor: 'border-[#487BFF]',
        backgroundColor: 'bg-white dark:bg-gray-800',
        cursor: 'pointer',
      }
    }

    if (isDragging) {
      return {
        borderColor: 'border-[#CCCCCC]',
        backgroundColor: 'bg-white/50 dark:bg-gray-800/50',
        cursor: 'grabbing',
      }
    }

    return {
      borderColor: 'border-[#CCCCCC]',
      backgroundColor: 'bg-white dark:bg-gray-800',
      cursor: readonly || disabled || validationResult?.isCorrect ? 'default' : 'grab',
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3">
        {orderedItems.map((itemId, index) => {
          const item = getItemById(itemId)
          if (!item) return null

          const styles = getItemStyles(itemId, index)
          const isDraggable = !readonly && !disabled && !validationResult?.isCorrect

          return (
            <div
              key={itemId}
              draggable={isDraggable}
              onDragStart={(e) => handleDragStart(e, itemId)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(itemId)}
              onDrop={(e) => handleDrop(e, itemId)}
              className={cn(
                'group relative w-full min-h-18 rounded-3xl border-2 px-6 py-4',
                'flex items-center justify-between gap-4',
                'transition-all duration-200',
                styles.borderColor,
                styles.backgroundColor,
                isDraggable && 'active:opacity-70'
              )}
              style={{
                cursor: styles.cursor,
                opacity: draggedItemId === itemId ? 0.5 : 1,
              }}
            >
              <div className="flex-1 text-sm md:text-base leading-relaxed text-gray-900 dark:text-gray-100">
                {item.text}
              </div>

              {isDraggable && (
                <div className="shrink-0 flex flex-col gap-2.5">
                  <div className="w-10 h-px bg-[#6C757D] rounded-full" />
                  <div className="w-10 h-px bg-[#6C757D] rounded-full" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {validationResult && validationResult.isCorrect && (
        <div className="flex items-center justify-center gap-1 mt-8">
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
      )}

      {validationResult && !validationResult.isCorrect && (
        <div className="space-y-6 mt-8">
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

          {validationResult.feedback && (
            <div className="text-center text-sm md:text-base text-gray-700 dark:text-gray-300">
              {validationResult.feedback}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
