/**
 * Mocks de exercícios para desenvolvimento
 */

import type { MultipleChoiceExercise, MultipleSelectExercise } from '@/features/exercises/types'

/**
 * Mock 1: Múltipla escolha única (uma resposta correta)
 */
export const mockExercise1: MultipleChoiceExercise = {
  id: 'ex-001',
  type: 'multiple-choice',
  title: 'Qual é a capital do Brasil?',
  description: 'Selecione a alternativa correta.',
  data: {
    options: [
      { id: 'a', text: 'São Paulo', isCorrect: false },
      { id: 'b', text: 'Brasília', isCorrect: true },
      { id: 'c', text: 'Rio de Janeiro', isCorrect: false },
      { id: 'd', text: 'Salvador', isCorrect: false },
    ],
    shuffleOptions: false,
  },
  maxScore: 10,
  difficulty: 'easy',
  tags: ['geografia', 'brasil'],
  hints: ['É a sede do governo federal', 'Fica no Centro-Oeste'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
}

/**
 * Mock 2: Múltipla seleção (várias respostas corretas)
 * Nota: O componente deve detectar que há múltiplas corretas e permitir seleção múltipla
 */
export const mockExercise2: MultipleSelectExercise = {
  id: 'ex-002',
  type: 'multiple-select',
  title: 'Quais das seguintes linguagens são orientadas a objetos?',
  description: 'Selecione todas as alternativas corretas.',
  data: {
    options: [
      { id: 'a', text: 'JavaScript', isCorrect: true },
      { id: 'b', text: 'Python', isCorrect: true },
      { id: 'c', text: 'C', isCorrect: false },
      { id: 'd', text: 'Java', isCorrect: true },
      { id: 'e', text: 'Assembly', isCorrect: false },
    ],
    shuffleOptions: false,
    minSelections: 1,
    maxSelections: 5,
  },
  maxScore: 15,
  difficulty: 'medium',
  tags: ['programação', 'poo'],
  hints: [
    'Pense em linguagens que suportam classes',
    'Algumas linguagens modernas são multi-paradigma',
  ],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
}

/**
 * Mock 3: Múltipla escolha única (contexto matemático)
 */
export const mockExercise3: MultipleChoiceExercise = {
  id: 'ex-003',
  type: 'multiple-choice',
  title: 'Quanto é 2 + 2?',
  description: 'Resolva a operação matemática.',
  data: {
    options: [
      { id: 'a', text: '3', isCorrect: false },
      { id: 'b', text: '4', isCorrect: true },
      { id: 'c', text: '5', isCorrect: false },
      { id: 'd', text: '22', isCorrect: false },
    ],
    shuffleOptions: false,
  },
  maxScore: 5,
  difficulty: 'easy',
  tags: ['matemática', 'básico'],
  hints: ['É uma operação simples de adição'],
  references: [
    {
      title: 'Operações Básicas',
      description: 'Revisão de adição e subtração',
    },
  ],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
}

/**
 * Lista de todos os exercícios mock
 */
export const mockExercises = [mockExercise1, mockExercise2, mockExercise3]

/**
 * Mock da API de exercícios
 * Simula o comportamento da API REST que será integrada
 */
export const mockExerciseApi = {
  /**
   * GET /api/exercises/{id}
   */
  async getExerciseById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simula delay de rede
    return mockExercises.find((ex) => ex.id === id) || null
  },

  /**
   * GET /api/exercises?ids={ids}
   */
  async getExercisesByIds(ids: string[]) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockExercises.filter((ex) => ids.includes(ex.id))
  },

  /**
   * GET /api/exercise-lists/{listId}/exercises
   */
  async getExercisesByList(listId: string) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    // Mock: lista "list-001" retorna todos os exercícios
    if (listId === 'list-001') {
      return mockExercises
    }
    
    return []
  },
}
