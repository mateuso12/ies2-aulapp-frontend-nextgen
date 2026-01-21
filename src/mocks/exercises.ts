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
  maxAttempts: 3,
  difficulty: 'easy',
  tags: ['geografia', 'brasil'],
  hints: ['É a sede do governo federal', 'Fica no Centro-Oeste'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  metadata: {
    comment: {
      title: 'Por que Brasília?',
      content: `Brasília foi fundada em 21 de abril de 1960 e tornou-se a capital do Brasil. A cidade foi planejada pelo urbanista Lúcio Costa e projetada pelo arquiteto Oscar Niemeyer. A transferência da capital do Rio de Janeiro para o Planalto Central teve como objetivo promover o desenvolvimento do interior do país e descongestionar a região litorânea.`,
      imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
    },
  },
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
  maxAttempts: 2,
  difficulty: 'medium',
  tags: ['programação', 'poo'],
  hints: [
    'Pense em linguagens que suportam classes',
    'Algumas linguagens modernas são multi-paradigma',
  ],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  metadata: {
    comment: {
      title: 'Programação Orientada a Objetos',
      content: `JavaScript, Python e Java são linguagens que suportam o paradigma de Programação Orientada a Objetos (POO). JavaScript usa protótipos mas também suporta classes desde ES6. Python tem suporte nativo a classes e herança. Java é uma linguagem puramente orientada a objetos. Por outro lado, C é uma linguagem procedural que não possui suporte nativo a POO, e Assembly é uma linguagem de baixo nível focada em instruções de máquina.`,
      imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
    },
  },
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
  maxAttempts: 3,
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
  metadata: {
    comment: {
      title: 'Operações Básicas',
      content: `A adição é uma das quatro operações fundamentais da aritmética. Neste caso, 2 + 2 = 4. Esta é uma operação simples de soma de dois números inteiros positivos. A adição é comutativa, ou seja, a ordem dos números não altera o resultado: 2 + 2 = 2 + 2.`,
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    },
  },
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
