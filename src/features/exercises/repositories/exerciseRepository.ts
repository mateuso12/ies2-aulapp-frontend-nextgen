/**
 * Interface genérica para repositório de exercícios.
 * Pode ser implementada para diferentes backends (Firebase, API REST, etc.)
 */

import type { Exercise, ExerciseSubmission } from '../types'

/**
 * Interface para operações CRUD de exercícios
 */
export interface IExerciseRepository {
  /**
   * Busca um exercício por ID
   */
  findById(exerciseId: string): Promise<Exercise | null>

  /**
   * Busca múltiplos exercícios por IDs
   */
  findByIds(exerciseIds: string[]): Promise<Exercise[]>

  /**
   * Busca todos os exercícios de uma lista/módulo
   */
  findByList(listId: string): Promise<Exercise[]>

  /**
   * Salva um exercício
   */
  save(exercise: Exercise): Promise<void>

  /**
   * Atualiza um exercício existente
   */
  update(exerciseId: string, exercise: Partial<Exercise>): Promise<void>

  /**
   * Remove um exercício
   */
  remove(exerciseId: string): Promise<void>
}

/**
 * Interface para operações de submissões de exercícios
 */
export interface ISubmissionRepository {
  /**
   * Busca uma submissão por ID
   */
  findById(submissionId: string): Promise<ExerciseSubmission | null>

  /**
   * Busca todas as submissões de um usuário para um exercício
   */
  findByUserAndExercise(
    userId: string,
    exerciseId: string
  ): Promise<ExerciseSubmission[]>

  /**
   * Busca a submissão mais recente de um usuário para um exercício
   */
  findLatestByUserAndExercise(
    userId: string,
    exerciseId: string
  ): Promise<ExerciseSubmission | null>

  /**
   * Busca todas as submissões de um usuário
   */
  findByUser(userId: string): Promise<ExerciseSubmission[]>

  /**
   * Salva uma nova submissão
   */
  save(submission: ExerciseSubmission): Promise<void>

  /**
   * Atualiza uma submissão existente (ex: adicionar nota/feedback)
   */
  update(
    submissionId: string,
    submission: Partial<ExerciseSubmission>
  ): Promise<void>

  /**
   * Remove uma submissão
   */
  remove(submissionId: string): Promise<void>
}

/**
 * Interface para rascunhos (salvamentos temporários)
 */
export interface IDraftRepository {
  /**
   * Salva um rascunho de resposta
   */
  saveDraft<TAnswer = unknown>(
    userId: string,
    exerciseId: string,
    answer: TAnswer
  ): Promise<void>

  /**
   * Recupera um rascunho salvo
   */
  getDraft<TAnswer = unknown>(
    userId: string,
    exerciseId: string
  ): Promise<TAnswer | null>

  /**
   * Remove um rascunho
   */
  removeDraft(userId: string, exerciseId: string): Promise<void>

  /**
   * Lista todos os rascunhos de um usuário
   */
  listDrafts(userId: string): Promise<Array<{ exerciseId: string; savedAt: Date }>>
}
