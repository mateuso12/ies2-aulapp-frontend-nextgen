/**
 * Implementação de repositórios para o sistema de exercícios.
 * 
 * ARQUITETURA:
 * - Exercícios: Vêm de API REST externa (a ser integrada)
 * - Submissões: Armazenadas no Firebase (respostas dos alunos)
 * - Rascunhos: Armazenados no Firebase (auto-save)
 * 
 * Estrutura no Firebase:
 * /nextgen-frontend/submissions/{userId}/{submissionId}
 * /nextgen-frontend/drafts/{userId}/{exerciseId}
 */

import { ref, get, set, remove } from 'firebase/database'
import { firebaseDatabase } from '@/services/firebase'
import type { Exercise, ExerciseSubmission } from '../types'
import type {
  IExerciseRepository,
  ISubmissionRepository,
  IDraftRepository,
} from './exerciseRepository'

/**
 * Repositório API REST para Exercícios.
 * 
 * Os exercícios são fornecidos por uma API externa.
 * TODO: Integrar com a API real quando disponível.
 * 
 * Endpoints esperados:
 * - GET /api/exercises/{id}
 * - GET /api/exercises?ids={id1,id2,...}
 * - GET /api/exercise-lists/{listId}/exercises
 * - POST /api/exercises (criação - apenas para professores)
 * - PATCH /api/exercises/{id} (edição - apenas para professores)
 * - DELETE /api/exercises/{id} (remoção - apenas para professores)
 */
export class ApiExerciseRepository implements IExerciseRepository {
  private baseUrl: string

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
  }

  async findById(exerciseId: string): Promise<Exercise | null> {
    try {
      const response = await fetch(`${this.baseUrl}/exercises/${exerciseId}`)
      
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('[ApiExerciseRepository] Error finding exercise:', error)
      return null
    }
  }

  async findByIds(exerciseIds: string[]): Promise<Exercise[]> {
    try {
      const idsParam = exerciseIds.join(',')
      const response = await fetch(`${this.baseUrl}/exercises?ids=${idsParam}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('[ApiExerciseRepository] Error finding exercises:', error)
      return []
    }
  }

  async findByList(listId: string): Promise<Exercise[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/exercise-lists/${listId}/exercises`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(
        '[ApiExerciseRepository] Error finding exercises by list:',
        error
      )
      return []
    }
  }

  async save(exercise: Exercise): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exercise),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('[ApiExerciseRepository] Error saving exercise:', error)
      throw error
    }
  }

  async update(exerciseId: string, exercise: Partial<Exercise>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/exercises/${exerciseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exercise),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('[ApiExerciseRepository] Error updating exercise:', error)
      throw error
    }
  }

  async remove(exerciseId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/exercises/${exerciseId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('[ApiExerciseRepository] Error removing exercise:', error)
      throw error
    }
  }
}

/**
 * Repositório Firebase para Submissões de Exercícios.
 * 
 * Estrutura no Firebase:
 * /nextgen-frontend/submissions/{userId}/{submissionId}
 * 
 * As submissões dos alunos (respostas enviadas) são armazenadas no Firebase.
 */
export class FirebaseSubmissionRepository implements ISubmissionRepository {
  private getUserSubmissionsRef(userId: string) {
    return ref(firebaseDatabase, `nextgen-frontend/submissions/${userId}`)
  }

  private getSubmissionRef(userId: string, submissionId: string) {
    return ref(
      firebaseDatabase,
      `nextgen-frontend/submissions/${userId}/${submissionId}`
    )
  }

  async findById(submissionId: string): Promise<ExerciseSubmission | null> {
    // Nota: Requer userId. Considere adicionar índice ou buscar em outro local
    console.warn('[FirebaseSubmissionRepository] findById requires userId')
    return null
  }

  async findByUserAndExercise(
    userId: string,
    exerciseId: string
  ): Promise<ExerciseSubmission[]> {
    try {
      const snapshot = await get(this.getUserSubmissionsRef(userId))
      if (!snapshot.exists()) return []

      const allSubmissions = Object.values(snapshot.val()) as ExerciseSubmission[]
      return allSubmissions.filter((sub) => sub.exerciseId === exerciseId)
    } catch (error) {
      console.error(
        '[FirebaseSubmissionRepository] Error finding submissions:',
        error
      )
      return []
    }
  }

  async findLatestByUserAndExercise(
    userId: string,
    exerciseId: string
  ): Promise<ExerciseSubmission | null> {
    try {
      const submissions = await this.findByUserAndExercise(userId, exerciseId)
      if (submissions.length === 0) return null

      // Retorna a submissão mais recente
      return submissions.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )[0]
    } catch (error) {
      console.error(
        '[FirebaseSubmissionRepository] Error finding latest submission:',
        error
      )
      return null
    }
  }

  async findByUser(userId: string): Promise<ExerciseSubmission[]> {
    try {
      const snapshot = await get(this.getUserSubmissionsRef(userId))
      if (!snapshot.exists()) return []

      return Object.values(snapshot.val()) as ExerciseSubmission[]
    } catch (error) {
      console.error(
        '[FirebaseSubmissionRepository] Error finding user submissions:',
        error
      )
      return []
    }
  }

  async save(submission: ExerciseSubmission): Promise<void> {
    try {
      await set(
        this.getSubmissionRef(submission.userId, submission.id),
        submission
      )
    } catch (error) {
      console.error('[FirebaseSubmissionRepository] Error saving submission:', error)
      throw error
    }
  }

  async update(
    submissionId: string,
    submission: Partial<ExerciseSubmission>
  ): Promise<void> {
    console.warn(
      '[FirebaseSubmissionRepository] update requires userId - not implemented'
    )
    throw new Error('Not implemented - requires userId')
  }

  async remove(submissionId: string): Promise<void> {
    console.warn(
      '[FirebaseSubmissionRepository] remove requires userId - not implemented'
    )
    throw new Error('Not implemented - requires userId')
  }
}

/**
 * Repositório Firebase para Rascunhos de Exercícios.
 * 
 * Estrutura no Firebase:
 * /nextgen-frontend/drafts/{userId}/{exerciseId}
 * 
 * Os rascunhos (auto-save de respostas em progresso) são armazenados no Firebase.
 */
export class FirebaseDraftRepository implements IDraftRepository {
  private getDraftRef(userId: string, exerciseId: string) {
    return ref(firebaseDatabase, `nextgen-frontend/drafts/${userId}/${exerciseId}`)
  }

  private getUserDraftsRef(userId: string) {
    return ref(firebaseDatabase, `nextgen-frontend/drafts/${userId}`)
  }

  async saveDraft<TAnswer = unknown>(
    userId: string,
    exerciseId: string,
    answer: TAnswer
  ): Promise<void> {
    try {
      await set(this.getDraftRef(userId, exerciseId), {
        answer,
        savedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('[FirebaseDraftRepository] Error saving draft:', error)
      throw error
    }
  }

  async getDraft<TAnswer = unknown>(
    userId: string,
    exerciseId: string
  ): Promise<TAnswer | null> {
    try {
      const snapshot = await get(this.getDraftRef(userId, exerciseId))
      if (!snapshot.exists()) return null

      const data = snapshot.val()
      return data.answer as TAnswer
    } catch (error) {
      console.error('[FirebaseDraftRepository] Error getting draft:', error)
      return null
    }
  }

  async removeDraft(userId: string, exerciseId: string): Promise<void> {
    try {
      await remove(this.getDraftRef(userId, exerciseId))
    } catch (error) {
      console.error('[FirebaseDraftRepository] Error removing draft:', error)
      throw error
    }
  }

  async listDrafts(
    userId: string
  ): Promise<Array<{ exerciseId: string; savedAt: Date }>> {
    try {
      const snapshot = await get(this.getUserDraftsRef(userId))
      if (!snapshot.exists()) return []

      const drafts = snapshot.val() as Record<
        string,
        { savedAt: string; answer: unknown }
      >

      return Object.entries(drafts).map(([exerciseId, data]) => ({
        exerciseId,
        savedAt: new Date(data.savedAt),
      }))
    } catch (error) {
      console.error('[FirebaseDraftRepository] Error listing drafts:', error)
      return []
    }
  }
}
