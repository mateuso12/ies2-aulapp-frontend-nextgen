/**
 * Hook para gerenciar submissão de exercícios.
 * 
 * Este hook encapsula a lógica de:
 * - Carregar exercício
 * - Gerenciar estado da resposta
 * - Auto-save de rascunhos
 * - Validação e submissão
 * - Feedback de correção
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type {
  Exercise,
  ExerciseAnswer,
  ExerciseSubmission,
  ExerciseValidationResult,
} from '../types'
import { validateExercise, generateId, calculateElapsedSeconds } from '../lib/utils'
import { EXERCISE_CONFIG } from '../lib/constants'
import type {
  IExerciseRepository,
  ISubmissionRepository,
  IDraftRepository,
} from '../repositories'

export interface UseExerciseSubmissionOptions {
  /** ID do exercício */
  exerciseId: string
  
  /** ID do usuário */
  userId: string
  
  /** Repositórios (injetados para facilitar testes) */
  exerciseRepository: IExerciseRepository
  submissionRepository: ISubmissionRepository
  draftRepository: IDraftRepository
  
  /** Se deve carregar rascunho salvo */
  loadDraft?: boolean
  
  /** Se deve fazer auto-save de rascunhos */
  autoSave?: boolean
  
  /** Intervalo de auto-save em ms */
  autoSaveInterval?: number
  
  /** Callback ao submeter */
  onSubmit?: (submission: ExerciseSubmission) => void
  
  /** Callback ao carregar exercício */
  onLoad?: (exercise: Exercise) => void
}

export interface UseExerciseSubmissionReturn {
  /** Dados do exercício */
  exercise: Exercise | null
  
  /** Resposta atual do usuário */
  answer: ExerciseAnswer | null
  
  /** Atualizar resposta */
  setAnswer: (answer: ExerciseAnswer) => void
  
  /** Submeter exercício */
  submit: () => Promise<void>
  
  /** Resultado da validação (após submissão) */
  validationResult: ExerciseValidationResult | null
  
  /** Submissão mais recente */
  latestSubmission: ExerciseSubmission | null
  
  /** Estados de carregamento */
  isLoading: boolean
  isSubmitting: boolean
  
  /** Erros */
  error: string | null
  
  /** Se tem rascunho salvo */
  hasDraft: boolean
  
  /** Limpar rascunho */
  clearDraft: () => Promise<void>
  
  /** Tempo decorrido em segundos */
  elapsedSeconds: number
}

export const useExerciseSubmission = (
  options: UseExerciseSubmissionOptions
): UseExerciseSubmissionReturn => {
  const {
    exerciseId,
    userId,
    exerciseRepository,
    submissionRepository,
    draftRepository,
    loadDraft = true,
    autoSave = EXERCISE_CONFIG.AUTO_SAVE_DRAFTS,
    autoSaveInterval = EXERCISE_CONFIG.AUTO_SAVE_INTERVAL_MS,
    onSubmit,
    onLoad,
  } = options

  // Estados
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [answer, setAnswerState] = useState<ExerciseAnswer | null>(null)
  const [validationResult, setValidationResult] =
    useState<ExerciseValidationResult | null>(null)
  const [latestSubmission, setLatestSubmission] =
    useState<ExerciseSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasDraft, setHasDraft] = useState(false)
  const [startTime] = useState(new Date())
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // Refs
  const autoSaveTimerRef = useRef<NodeJS.Timeout>()

  /**
   * Carregar exercício e dados relacionados
   */
  useEffect(() => {
    const loadExercise = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Carrega exercício
        const ex = await exerciseRepository.findById(exerciseId)
        if (!ex) {
          throw new Error('Exercício não encontrado')
        }
        setExercise(ex)
        onLoad?.(ex)

        // Carrega submissão mais recente
        const submission = await submissionRepository.findLatestByUserAndExercise(
          userId,
          exerciseId
        )
        setLatestSubmission(submission)

        // Carrega rascunho se solicitado e não houver submissão
        if (loadDraft && !submission) {
          const draft = await draftRepository.getDraft(userId, exerciseId)
          if (draft) {
            setAnswerState(draft as ExerciseAnswer)
            setHasDraft(true)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar exercício')
        console.error('[useExerciseSubmission] Load error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadExercise()
  }, [exerciseId, userId, loadDraft])

  /**
   * Timer para elapsed time
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(calculateElapsedSeconds(startTime))
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime])

  /**
   * Auto-save de rascunhos
   */
  useEffect(() => {
    if (!autoSave || !answer || !exercise) return

    // Limpa timer anterior
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    // Agenda novo save
    autoSaveTimerRef.current = setTimeout(() => {
      draftRepository.saveDraft(userId, exerciseId, answer).catch((err) => {
        console.error('[useExerciseSubmission] Auto-save error:', err)
      })
    }, autoSaveInterval)

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [answer, autoSave, autoSaveInterval, userId, exerciseId, exercise])

  /**
   * Atualizar resposta
   */
  const setAnswer = useCallback((newAnswer: ExerciseAnswer) => {
    setAnswerState(newAnswer)
    setValidationResult(null) // Limpa resultado anterior
  }, [])

  /**
   * Submeter exercício
   */
  const submit = useCallback(async () => {
    if (!exercise || !answer) {
      setError('Selecione uma resposta antes de submeter')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      // Valida resposta se o tipo suportar correção automática
      let validation: ExerciseValidationResult | undefined
      try {
        validation = validateExercise(exercise, answer)
        setValidationResult(validation)
      } catch (err) {
        console.warn('[useExerciseSubmission] Validation not supported:', err)
      }

      // Determina número da tentativa
      const previousSubmissions = await submissionRepository.findByUserAndExercise(
        userId,
        exerciseId
      )
      const attemptNumber = previousSubmissions.length + 1

      // Cria submissão
      const submission: ExerciseSubmission = {
        id: generateId(),
        exerciseId,
        userId,
        answer,
        status: validation ? 'graded' : 'submitted',
        score: validation?.score,
        feedback: validation?.feedback,
        timeSpentSeconds: elapsedSeconds,
        attemptNumber,
        submittedAt: new Date(),
        gradedAt: validation ? new Date() : undefined,
      }

      // Salva submissão
      await submissionRepository.save(submission)
      setLatestSubmission(submission)

      // Remove rascunho
      await draftRepository.removeDraft(userId, exerciseId)
      setHasDraft(false)

      // Callback
      onSubmit?.(submission)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao submeter exercício')
      console.error('[useExerciseSubmission] Submit error:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }, [exercise, answer, userId, exerciseId, elapsedSeconds, onSubmit])

  /**
   * Limpar rascunho
   */
  const clearDraft = useCallback(async () => {
    try {
      await draftRepository.removeDraft(userId, exerciseId)
      setHasDraft(false)
      setAnswerState(null)
    } catch (err) {
      console.error('[useExerciseSubmission] Clear draft error:', err)
    }
  }, [userId, exerciseId])

  return {
    exercise,
    answer,
    setAnswer,
    submit,
    validationResult,
    latestSubmission,
    isLoading,
    isSubmitting,
    error,
    hasDraft,
    clearDraft,
    elapsedSeconds,
  }
}
