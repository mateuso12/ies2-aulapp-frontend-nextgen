import React, { useState, useEffect } from 'react'
import type {
  ExerciseComponentProps,
  WritingData,
  WritingAnswer,
} from '../../types'
import { cn } from '@/lib/utils'

export const WritingExercise: React.FC<
  ExerciseComponentProps<WritingData, WritingAnswer>
> = ({
  exercise,
  value = '',
  onChange,
  readonly = false,
  validationResult,
  disabled = false,
}) => {
  const [localValue, setLocalValue] = useState(value)
  const maxChars = exercise.data.maxCharacters || 200

  // Sincroniza com valor externo
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // Aplica limite de caracteres
    if (newValue.length <= maxChars) {
      setLocalValue(newValue)
      onChange?.(newValue)
    }
  }

  // Determina o estado visual da caixa baseado no design do Figma
  const getContainerStyles = () => {
    if (!validationResult) {
      // Estado padrão: borda azul
      return {
        borderColor: 'border-[#C6D3F5]',
        backgroundColor: 'bg-white dark:bg-gray-800',
      }
    }

    if (validationResult.isCorrect) {
      // Estado correto: verde (#2BC779 border, #C9F6DB background)
      return {
        borderColor: 'border-[#2BC779]',
        backgroundColor: 'bg-[#C9F6DB] dark:bg-green-900/20',
      }
    } else {
      // Estado incorreto: vermelho (#EC272B border, #FFCAD6 background)
      return {
        borderColor: 'border-[#EC272B]',
        backgroundColor: 'bg-[#FFCAD6] dark:bg-red-900/20',
      }
    }
  }

  const { borderColor, backgroundColor } = getContainerStyles()

  return (
    <div className="w-full space-y-6">
      {/* Caixa de entrada */}
      <div
        className={cn(
          'relative rounded-4xl border-2 transition-all duration-200',
          borderColor,
          backgroundColor
        )}
      >
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={exercise.data.placeholder || 'Escrita'}
          disabled={readonly || disabled}
          maxLength={maxChars}
          className={cn(
            'w-full h-[103.643px] px-8 text-2xl text-center bg-transparent',
            'focus:outline-none placeholder:text-gray-400',
            'disabled:cursor-not-allowed',
            'text-gray-900 dark:text-gray-100'
          )}
        />

        {/* Contador de caracteres */}
        <div className="absolute bottom-3 right-4 text-xs text-gray-500 dark:text-gray-400">
          {localValue.length}/{maxChars}
        </div>
      </div>

      {/* Feedback de Sucesso - Design do Figma */}
      {validationResult?.isCorrect && (
        <div className="flex items-center justify-center gap-1">
          {/* Ícone de check - verde */}
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

          {/* Texto "Correto" */}
          <p className="font-sans font-semibold text-[32px] leading-none text-black dark:text-white tracking-[-0.48px]">
            Correto
          </p>
        </div>
      )}

      {/* Feedback de Erro - Sempre exibe ícone + texto (e feedback se houver) */}
      {validationResult && !validationResult.isCorrect && (
        <div className="space-y-6">
          {/* Ícone X + Texto "Incorreto" */}
          <div className="flex items-center justify-center gap-1">
            {/* Ícone X - vermelho */}
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

            {/* Texto "Incorreto" */}
            <p className="font-sans font-semibold text-[32px] leading-none text-black dark:text-white tracking-[-0.48px]">
              Incorreto
            </p>
          </div>

          {/* Card vermelho com feedback textual (se existir) */}
          {exercise.data.incorrectFeedback && (
            <div
              className={cn(
                'w-full rounded-4xl border-2 p-4 md:p-6',
                'border-[#EC272B] bg-[#FFCAD6] dark:bg-red-900/20'
              )}
            >
              {/* Card branco interno com o texto de feedback */}
              <div
                className={cn(
                  'w-full min-h-[100px] rounded-2xl p-4 md:p-6',
                  'bg-white dark:bg-gray-800',
                  'text-sm md:text-base leading-relaxed',
                  'text-gray-900 dark:text-gray-100'
                )}
              >
                {exercise.data.incorrectFeedback}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
