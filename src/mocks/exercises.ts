/**
 * Mocks de exercícios para desenvolvimento
 */

import type {
  MultipleChoiceExercise,
  WritingExercise,
  NumericExercise,
  TrueFalseExercise,
} from '@/features/exercises/types'

/**
 * Mock 1: Múltipla escolha (permite escolher várias opções)
 */
export const mockExercise1: MultipleChoiceExercise = {
  id: 'ex-001',
  type: 'multiple-choice',
  title: 'Qual é a capital do Brasil?',
  description: 'Selecione a alternativa correta.',
  data: {
    options: [
      {
        id: 'a',
        text: 'São Paulo',
        isCorrect: false,
        feedback:
          'São Paulo é a maior cidade do Brasil, mas não é a capital. A capital está localizada no Distrito Federal.',
      },
      { id: 'b', text: 'Brasília', isCorrect: true },
      {
        id: 'c',
        text: 'Rio de Janeiro',
        isCorrect: false,
        feedback:
          'Rio de Janeiro foi capital do Brasil até 1960, quando Brasília foi inaugurada como nova capital.',
      },
      {
        id: 'd',
        text: 'Salvador',
        isCorrect: false,
        feedback:
          'Salvador foi a primeira capital do Brasil colonial (1549-1763), mas hoje a capital é Brasília.',
      },
    ],
    shuffleOptions: false,
  },
  maxScore: 10,
  difficulty: 'easy',
  tags: ['geografia', 'brasil'],
  hints: ['É a sede do governo federal', 'Fica no Centro-Oeste'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  metadata: {
    comment: {
      title: 'Por que Brasília?',
      content: `Brasília foi fundada em 21 de abril de 1960 e tornou-se a capital do Brasil. A cidade foi planejada pelo urbanista Lúcio Costa e projetada pelo arquiteto Oscar Niemeyer. A transferência da capital do Rio de Janeiro para o Planalto Central teve como objetivo promover o desenvolvimento do interior do país e descongestionar a região litorânea.`,
      imageUrl:
        'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
    },
  },
}

/**
 * Mock 2: Múltipla escolha (várias respostas corretas)
 */
export const mockExercise2: MultipleChoiceExercise = {
  id: 'ex-002',
  type: 'multiple-choice',
  title: 'Quais das seguintes linguagens são orientadas a objetos?',
  description: 'Selecione todas as alternativas corretas.',
  data: {
    options: [
      { id: 'a', text: 'JavaScript', isCorrect: true },
      { id: 'b', text: 'Python', isCorrect: true },
      {
        id: 'c',
        text: 'C',
        isCorrect: false,
        feedback:
          'C é uma linguagem procedural que não possui suporte nativo a Programação Orientada a Objetos. Para POO em C, você precisaria usar C++.',
      },
      { id: 'd', text: 'Java', isCorrect: true },
      {
        id: 'e',
        text: 'Assembly',
        isCorrect: false,
        feedback:
          'Assembly é uma linguagem de baixo nível focada em instruções de máquina. Não possui conceitos de POO como classes, objetos ou herança.',
      },
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
  metadata: {
    comment: {
      title: 'Programação Orientada a Objetos',
      content: `JavaScript, Python e Java são linguagens que suportam o paradigma de Programação Orientada a Objetos (POO). JavaScript usa protótipos mas também suporta classes desde ES6. Python tem suporte nativo a classes e herança. Java é uma linguagem puramente orientada a objetos. Por outro lado, C é uma linguagem procedural que não possui suporte nativo a POO, e Assembly é uma linguagem de baixo nível focada em instruções de máquina.`,
      imageUrl:
        'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
    },
  },
}

/**
 * Mock 3: Múltipla escolha (contexto matemático)
 */
export const mockExercise3: MultipleChoiceExercise = {
  id: 'ex-003',
  type: 'multiple-choice',
  title: 'Quanto é 2 + 2?',
  description: 'Resolva a operação matemática.',
  data: {
    options: [
      {
        id: 'a',
        text: '3',
        isCorrect: false,
        feedback:
          'Incorreto. Revise a operação de adição: 2 + 2 resulta em um número maior que 3.',
      },
      { id: 'b', text: '4', isCorrect: true },
      {
        id: 'c',
        text: '5',
        isCorrect: false,
        feedback:
          'Incorreto. O resultado de 2 + 2 não é 5. Lembre-se: estamos somando dois números iguais.',
      },
      {
        id: 'd',
        text: '22',
        isCorrect: false,
        feedback:
          'Atenção! Aqui estamos fazendo uma adição matemática (2 + 2), não uma concatenação de strings. O resultado é 4, não 22.',
      },
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
  metadata: {
    comment: {
      title: 'Operações Básicas',
      content: `A adição é uma das quatro operações fundamentais da aritmética. Neste caso, 2 + 2 = 4. Esta é uma operação simples de soma de dois números inteiros positivos. A adição é comutativa, ou seja, a ordem dos números não altera o resultado: 2 + 2 = 2 + 2.`,
      imageUrl:
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    },
  },
}

/**
 * Mock 4: Atividade de Escrita
 */
export const mockExercise4: WritingExercise = {
  id: 'ex-004',
  type: 'writing',
  title: 'Questão 2',
  description:
    'Lorem ipsum dolor sit amet consectetur. Et bibendum felis urna est et scelerisque duis semper nisl. Urna ultrices fermentum arcu a nulla. Posuere dui tincidunt pellentesque aliquet quam. In maecenas imperdiet amet sapien nulla. Ac sed hendrerit nascetur mauris congue. Id hac ac neque dolor elementum quis pulvinar urna. Magna suspendisse consectetur augue a sapien a imperdiet enim.',
  data: {
    correctAnswers: ['República', 'república', 'REPUBLICA', 'republica'],
    maxCharacters: 200,
    placeholder: 'Escrita',
    incorrectFeedback:
      'Resposta incorreta. Tente pensar no sistema político brasileiro.',
    caseSensitive: false,
    trimSpaces: true,
  },
  maxScore: 10,
  difficulty: 'medium',
  tags: ['história', 'brasil', 'política'],
  hints: ['Pense no sistema de governo do Brasil', 'Oposto de monarquia'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  metadata: {
    comment: {
      title: 'O que é uma República?',
      content: `Uma república é uma forma de governo na qual o país é considerado "coisa pública" e o chefe de Estado é eleito pelo povo ou por seus representantes, por um tempo determinado. O Brasil adotou o sistema republicano em 1889, após a Proclamação da República, que pôs fim ao Império. Na república, diferentemente da monarquia, o poder não é hereditário e os governantes são escolhidos através de eleições.`,
      imageUrl:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    },
  },
}

/**
 * Mock 5: Questão Numérica
 */
export const mockExercise5: NumericExercise = {
  id: 'ex-005',
  type: 'numeric',
  title: 'Questão 3',
  description:
    'Calcule o resultado da operação: 10,5 + 9,5. Digite o valor numérico com até duas casas decimais.',
  data: {
    correctAnswer: 20,
    tolerance: 0.01,
    decimalPlaces: 2,
  },
  maxScore: 10,
  difficulty: 'easy',
  tags: ['matemática', 'aritmética'],
  hints: ['Some os valores decimais com atenção'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  metadata: {
    comment: {
      title: 'Operações com Decimais',
      content: `Teste do comentário: ao somar 10,5 + 9,5, obtemos 20. Para somar decimais, alinhe as vírgulas e some os números como se fossem inteiros, mantendo a vírgula na posição correta no resultado.`,
      imageUrl:
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
    },
  },
}

/**
 * Mock 6: Verdadeiro ou Falso (Certo/Errado - único)
 */
export const mockExercise6: TrueFalseExercise = {
  id: 'ex-006',
  type: 'true-false',
  title: 'Questão 4',
  description: 'O Brasil ganhou 8 copas do mundo de futebol.',
  data: {
    correctAnswer: false,
    labelVariant: 'certo-errado',
    incorrectFeedback: 'O Brasil venceu 5 Copas do Mundo, não 8.',
  },
  maxScore: 10,
  difficulty: 'easy',
  tags: ['esportes', 'futebol'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  metadata: {
    comment: {
      title: 'Copas do Mundo',
      content:
        'O Brasil é o maior campeão da Copa do Mundo com 5 títulos (1958, 1962, 1970, 1994, 2002).',
    },
  },
}

/**
 * Mock 7: Verdadeiro ou Falso (Verdadeiro/Falso - múltiplo)
 */
export const mockExercise7: TrueFalseExercise = {
  id: 'ex-007',
  type: 'true-false',
  title: 'Questão 5',
  description: 'Avalie as afirmações abaixo.',
  data: {
    labelVariant: 'verdadeiro-falso',
    statements: [
      {
        id: 's1',
        text: 'A água ferve a 100°C ao nível do mar.',
        correctAnswer: true,
        incorrectFeedback: 'Em condições padrão, a água ferve a 100°C.',
      },
      {
        id: 's2',
        text: 'A Terra é o maior planeta do Sistema Solar.',
        correctAnswer: false,
        incorrectFeedback: 'Júpiter é o maior planeta do Sistema Solar.',
      },
    ],
  },
  maxScore: 10,
  difficulty: 'easy',
  tags: ['ciências'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
}

/**
 * Mock 8: Verdadeiro ou Falso (Sim/Não - múltiplo)
 */
export const mockExercise8: TrueFalseExercise = {
  id: 'ex-008',
  type: 'true-false',
  title: 'Questão 6',
  description: 'Responda Sim ou Não.',
  data: {
    labelVariant: 'sim-nao',
    statements: [
      {
        id: 's1',
        text: 'O Monte Everest fica na Ásia.',
        correctAnswer: true,
        incorrectFeedback: 'Ele fica na cordilheira do Himalaia, na Ásia.',
      },
      {
        id: 's2',
        text: 'O Rio Amazonas é o menor do mundo.',
        correctAnswer: false,
        incorrectFeedback: 'Ele é um dos maiores do mundo.',
      },
    ],
  },
  maxScore: 10,
  difficulty: 'easy',
  tags: ['geografia'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
}

/**
 * Mock 10: Verdadeiro ou Falso (ícones - múltiplo)
 */
export const mockExercise10: TrueFalseExercise = {
  id: 'ex-010',
  type: 'true-false',
  title: 'Questão 8',
  description: 'Julgue as afirmações com ícones.',
  data: {
    labelVariant: 'thumbs',
    statements: [
      {
        id: 's1',
        text: 'Plutão é classificado como planeta anão.',
        correctAnswer: true,
        incorrectFeedback: 'Plutão é um planeta anão.',
      },
      {
        id: 's2',
        text: 'O Sol é um planeta.',
        correctAnswer: false,
        incorrectFeedback: 'O Sol é uma estrela.',
      },
    ],
  },
  maxScore: 10,
  difficulty: 'easy',
  tags: ['astronomia'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
}

/**
 * Lista de todos os exercícios mock
 */
export const mockExercises = [
  mockExercise1,
  mockExercise2,
  mockExercise3,
  mockExercise4,
  mockExercise5,
  mockExercise6,
  mockExercise7,
  mockExercise8,
  mockExercise10,
]

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
