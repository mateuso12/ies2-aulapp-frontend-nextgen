/**
 * Mock de módulo/aula focado em exercícios
 * 
 * Este mock substitui courseModules.ts para desenvolvimento
 * da funcionalidade de exercícios.
 */

import type { Exercise } from '@/features/exercises/types'
import { mockExercises } from './exercises'

export interface ExerciseListModule {
  id: string
  title: string
  description: string
  type: 'exercise_list'
  exercises: Exercise[]
  totalScore: number
  estimatedTimeMinutes: number
}

/**
 * Mock de uma aula/módulo contendo apenas exercícios
 */
export const mockExerciseListModule: ExerciseListModule = {
  id: 'module-exercises-001',
  title: 'Lista de Exercícios - Conhecimentos Gerais',
  description:
    'Pratique seus conhecimentos com esta lista de exercícios de múltipla escolha.',
  type: 'exercise_list',
  exercises: mockExercises,
  totalScore: mockExercises.reduce((sum, ex) => sum + ex.maxScore, 0), // 10 + 15 + 5 = 30
  estimatedTimeMinutes: 15,
}

/**
 * Mock de múltiplos módulos para navegação
 */
export const mockCourseModulesWithExercises = [
  {
    id: 'module-001',
    title: 'Introdução ao Curso',
    type: 'content',
    isCompleted: true,
  },
  {
    id: 'module-002',
    title: 'Conceitos Fundamentais',
    type: 'content',
    isCompleted: true,
  },
  {
    id: mockExerciseListModule.id,
    title: mockExerciseListModule.title,
    type: mockExerciseListModule.type,
    isCompleted: false,
    exerciseCount: mockExercises.length,
    totalScore: mockExerciseListModule.totalScore,
  },
  {
    id: 'module-004',
    title: 'Avaliação Final',
    type: 'assessment',
    isCompleted: false,
  },
]

/**
 * Helper para buscar exercício por ID
 */
export const getExerciseById = (exerciseId: string): Exercise | undefined => {
  return mockExercises.find((ex) => ex.id === exerciseId)
}

/**
 * Helper para buscar todos os exercícios de um módulo
 */
export const getExercisesByModule = (moduleId: string): Exercise[] => {
  if (moduleId === mockExerciseListModule.id) {
    return mockExercises
  }
  return []
}
