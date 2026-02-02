/**
 * Funções utilitárias para o sistema de exercícios
 */

import type {
  Exercise,
  ExerciseAnswer,
  ExerciseValidationResult,
  MultipleChoiceExercise,
  NumericExercise,
  OrderingExercise,
  TrueFalseExercise,
  WritingExercise,
} from '../types'
import i18n from '@/services/i18n'

/**
 * Gera um ID único para exercícios/submissões
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Calcula a pontuação percentual (0-100)
 */
export const calculateScorePercentage = (
  score: number,
  maxScore: number
): number => {
  if (maxScore === 0) return 0
  return Math.round((score / maxScore) * 100)
}

/**
 * Verifica se uma pontuação é aprovada
 */
export const isPassingScore = (
  score: number,
  maxScore: number,
  threshold: number = 0.6
): boolean => {
  if (maxScore === 0) return false
  return score / maxScore >= threshold
}

/**
 * Embaralha um array (Fisher-Yates shuffle)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Normaliza uma string para comparação (remove espaços, lowercase, etc.)
 */
export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Múltiplos espaços -> 1 espaço
    .normalize('NFD') // Remove acentos
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Compara duas strings ignorando case e acentos
 */
export const compareStringsLoose = (str1: string, str2: string): boolean => {
  return normalizeString(str1) === normalizeString(str2)
}

/**
 * Valida se um número está dentro de uma margem de erro
 */
export const isNumberWithinTolerance = (
  value: number,
  expected: number,
  tolerance: number = 0
): boolean => {
  return Math.abs(value - expected) <= tolerance
}

/**
 * Formata tempo em segundos para formato legível (MM:SS)
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Calcula tempo decorrido entre duas datas em segundos
 */
export const calculateElapsedSeconds = (
  startDate: Date,
  endDate: Date = new Date()
): number => {
  return Math.floor((endDate.getTime() - startDate.getTime()) / 1000)
}

/**
 * Valida resposta de múltipla escolha (permite múltiplas seleções)
 */
export const validateMultipleChoice = (
  exercise: MultipleChoiceExercise,
  answer: string[]
): ExerciseValidationResult => {
  const correctIds = exercise.data.options
    .filter((opt) => opt.isCorrect)
    .map((opt) => opt.id)
    .sort()

  const userIds = [...answer].sort()

  const isCorrect =
    correctIds.length === userIds.length &&
    correctIds.every((id, index) => id === userIds[index])

  // Calcula pontuação parcial
  const correctSelections = userIds.filter((id) =>
    correctIds.includes(id)
  ).length
  const incorrectSelections = userIds.filter(
    (id) => !correctIds.includes(id)
  ).length

  let score = 0
  if (isCorrect) {
    score = exercise.maxScore
  } else if (correctSelections > 0) {
    // Pontuação parcial: (acertos - erros) / total de corretas
    score = Math.max(
      0,
      ((correctSelections - incorrectSelections) / correctIds.length) *
        exercise.maxScore
    )
  }

  return {
    isCorrect,
    score: Math.round(score * 100) / 100,
    feedback: isCorrect
      ? i18n.t('exercises:feedback.correct')
      : i18n.t('exercises:feedback.multipleChoiceSummary', {
          correct: correctSelections,
          incorrect: incorrectSelections,
        }),
  }
}

/**
 * Valida resposta numérica
 */
export const validateNumeric = (
  exercise: NumericExercise,
  answer: number
): ExerciseValidationResult => {
  const { correctAnswer, tolerance = 0 } = exercise.data
  const isCorrect = isNumberWithinTolerance(answer, correctAnswer, tolerance)

  return {
    isCorrect,
    score: isCorrect ? exercise.maxScore : 0,
    feedback: isCorrect
      ? i18n.t('exercises:feedback.correct')
      : i18n.t('exercises:feedback.numericIncorrect', {
          answer: correctAnswer,
          unit: exercise.data.unit ? ` ${exercise.data.unit}` : '',
        }),
  }
}

/**
 * Valida resposta de ordenação
 */
export const validateOrdering = (
  exercise: OrderingExercise,
  answer: string[]
): ExerciseValidationResult => {
  // Ordena os itens pela ordem correta
  const correctOrder = [...exercise.data.items]
    .sort((a, b) => a.correctOrder - b.correctOrder)
    .map((item) => item.id)

  const isCorrect =
    answer.length === correctOrder.length &&
    answer.every((id, index) => id === correctOrder[index])

  // Calcula pontuação parcial baseada em quantos estão na posição correta
  const correctPositions = answer.filter(
    (id, index) => id === correctOrder[index]
  ).length

  const score = isCorrect
    ? exercise.maxScore
    : (correctPositions / correctOrder.length) * exercise.maxScore

  return {
    isCorrect,
    score: Math.round(score * 100) / 100,
    feedback: isCorrect
      ? i18n.t('exercises:feedback.orderCorrect')
      : i18n.t('exercises:feedback.orderIncorrect', {
          correctPositions,
          total: correctOrder.length,
        }),
    details: {
      correctPositions,
      totalItems: correctOrder.length,
    },
  }
}

/**
 * Valida resposta de verdadeiro/falso
 */
export const validateTrueFalse = (
  exercise: TrueFalseExercise,
  answer: boolean | Record<string, boolean>
): ExerciseValidationResult => {
  const statements = exercise.data.statements
  if (statements && statements.length > 0 && typeof answer === 'object') {
    const results = statements.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.id] = answer[item.id] === item.correctAnswer
      return acc
    }, {})

    const correctCount = Object.values(results).filter(Boolean).length
    const isCorrect = correctCount === statements.length
    const score = (correctCount / statements.length) * exercise.maxScore

    return {
      isCorrect,
      score: Math.round(score * 100) / 100,
      feedback: isCorrect
        ? i18n.t('exercises:feedback.correct')
        : i18n.t('exercises:feedback.tryAgain'),
      details: { results },
    }
  }

  const isCorrect = answer === exercise.data.correctAnswer

  return {
    isCorrect,
    score: isCorrect ? exercise.maxScore : 0,
    feedback: isCorrect
      ? i18n.t('exercises:feedback.correct')
      : i18n.t('exercises:feedback.tryAgain'),
  }
}

/**
 * Valida resposta de atividade de escrita
 */
export const validateWriting = (
  exercise: WritingExercise,
  answer: string
): ExerciseValidationResult => {
  const {
    correctAnswers,
    caseSensitive = false,
    trimSpaces = true,
    incorrectFeedback,
  } = exercise.data

  // Processa a resposta do usuário
  let processedAnswer = answer
  if (trimSpaces) {
    processedAnswer = processedAnswer.trim().replace(/\s+/g, ' ')
  }

  // Verifica se a resposta corresponde a alguma das variações corretas
  const isCorrect = correctAnswers.some((correctAnswer) => {
    let processedCorrect = correctAnswer
    if (trimSpaces) {
      processedCorrect = processedCorrect.trim().replace(/\s+/g, ' ')
    }

    if (caseSensitive) {
      return processedAnswer === processedCorrect
    } else {
      return processedAnswer.toLowerCase() === processedCorrect.toLowerCase()
    }
  })

  return {
    isCorrect,
    score: isCorrect ? exercise.maxScore : 0,
    feedback: isCorrect
      ? i18n.t('exercises:feedback.correct')
      : incorrectFeedback || i18n.t('exercises:feedback.tryAgain'),
  }
}

/**
 * Função genérica de validação que roteia para o validador específico
 */
export const validateExercise = (
  exercise: Exercise,
  answer: ExerciseAnswer
): ExerciseValidationResult => {
  switch (exercise.type) {
    case 'multiple-choice':
      return validateMultipleChoice(
        exercise as MultipleChoiceExercise,
        answer as string[]
      )
    case 'numeric':
      return validateNumeric(exercise as NumericExercise, answer as number)
    case 'ordering':
      return validateOrdering(exercise as OrderingExercise, answer as string[])
    case 'true-false':
      return validateTrueFalse(
        exercise as TrueFalseExercise,
        answer as boolean | Record<string, boolean>
      )
    case 'writing':
      return validateWriting(exercise as WritingExercise, answer as string)
    default:
      return {
        isCorrect: false,
        score: 0,
        feedback: 'Tipo de exercício não suporta correção automática',
      }
  }
}
