/**
 * Mock de atividades para desenvolvimento
 * Preparado para futura integração com backend
 *
 * Re-exporta os exercícios existentes com uma interface de API
 */

import { mockExercises } from './exercises'
import type { Exercise } from '@/features/exercises/types'

/**
 * Re-exporta os exercícios existentes
 */
export const mockActivities = mockExercises

/**
 * API mock para simular chamadas ao backend de atividades
 */
export const mockActivitiesApi = {
  /**
   * GET /api/activities/{id}
   * Busca uma atividade por ID
   */
  async getActivityById(id: string): Promise<Exercise | null> {
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simula delay de rede
    return mockActivities.find((activity) => activity.id === id) || null
  },

  /**
   * GET /api/activities?ids={ids}
   * Busca múltiplas atividades por IDs
   */
  async getActivityByIds(ids: string[]): Promise<Exercise[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockActivities.filter((activity) => ids.includes(activity.id))
  },

  /**
   * GET /api/resources/{resourceId}/activities
   * Busca todas as atividades de um recurso
   */
  async getActivitiesByResource(_resourceId: string): Promise<Exercise[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    // Mock: retorna todas as atividades para qualquer resourceId
    return mockActivities
  },

  /**
   * POST /api/activities/{id}/submit
   * Submete uma resposta para validação
   */
  async submitActivity(
    activityId: string,
    _answer: string | string[]
  ): Promise<{
    isCorrect: boolean
    feedback?: string
    comment?: { title: string; content: string; imageUrl?: string }
  }> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const activity = mockActivities.find((a) => a.id === activityId)
    if (!activity) {
      throw new Error('Activity not found')
    }

    // Simula validação no backend
    // Na implementação real, isso seria feito pelo backend
    return {
      isCorrect: true, // Mock simplificado
      comment: activity.metadata?.comment as
        | { title: string; content: string; imageUrl?: string }
        | undefined,
    }
  },
}
