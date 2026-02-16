/**
 * Mocks de exercícios para desenvolvimento
 * Referência: Curso de Contas a Pagar
 */

import type {
  Exercise,
  MultipleChoiceExercise,
  TrueFalseExercise,
  OrderingExercise,
  NumericExercise,
  WritingExercise,
  OpenTextExercise,
} from '@/features/exercises/types'

/**
 * 1) Múltipla escolha
 */
export const mockExercise1: MultipleChoiceExercise = {
  id: 'ex-001',
  type: 'multiple-choice',
  title: 'Contas a Pagar - Múltipla escolha',
  description: 'O setor de Contas a Pagar é responsável por:',
  data: {
    options: [
      {
        id: 'a',
        text: 'Receber pagamentos dos clientes',
        isCorrect: false,
        feedback:
          'Essa atividade pertence ao Contas a Receber. Contas a Pagar organiza pagamentos da empresa.',
      },
      { id: 'b', text: 'Controlar os pagamentos da empresa', isCorrect: true },
      {
        id: 'c',
        text: 'Vender produtos',
        isCorrect: false,
        feedback: 'Vendas é função comercial, não do setor de Contas a Pagar.',
      },
      {
        id: 'd',
        text: 'Fazer propaganda',
        isCorrect: false,
        feedback: 'Propaganda é função de marketing.',
      },
    ],
    shuffleOptions: false,
    minSelections: 1,
    maxSelections: 1,
  },
  maxScore: 10,
  difficulty: 'easy',
  tags: ['financeiro', 'contas a pagar'],
  createdAt: new Date('2026-02-16'),
  updatedAt: new Date('2026-02-16'),
  metadata: {
    comment: {
      title: 'Função principal',
      content:
        'Contas a Pagar controla as obrigações financeiras e garante que os pagamentos sejam feitos em dia.',
    },
  },
}

/**
 * 2) Verdadeiro ou Falso
 */
export const mockExercise2: TrueFalseExercise = {
  id: 'ex-002',
  type: 'true-false',
  title: 'Contas a Pagar - Verdadeiro ou Falso',
  description: 'Marque verdadeiro ou falso para cada afirmação.',
  data: {
    labelVariant: 'verdadeiro-falso',
    statements: [
      {
        id: 's1',
        text: 'Contas a Pagar cuida apenas de salários.',
        correctAnswer: false,
        incorrectFeedback:
          'Além de salários, o setor também controla aluguel, fornecedores, impostos e outras obrigações.',
      },
      {
        id: 's2',
        text: 'Pagar contas em dia evita multas e juros.',
        correctAnswer: true,
        incorrectFeedback:
          'Pagar no prazo evita multas, juros e problemas de relacionamento com fornecedores.',
      },
      {
        id: 's3',
        text: 'Registrar os pagamentos é importante para o controle financeiro.',
        correctAnswer: true,
        incorrectFeedback:
          'O registro é essencial para rastreabilidade e gestão do fluxo de caixa.',
      },
    ],
  },
  maxScore: 10,
  difficulty: 'easy',
  tags: ['financeiro', 'controle'],
  createdAt: new Date('2026-02-16'),
  updatedAt: new Date('2026-02-16'),
}

/**
 * 3) Ordenar
 */
export const mockExercise3: OrderingExercise = {
  id: 'ex-003',
  type: 'ordering',
  title: 'Contas a Pagar - Ordenação',
  description: 'Coloque a rotina de Contas a Pagar na ordem correta.',
  data: {
    items: [
      { id: 'i1', text: 'Efetuar o pagamento', correctOrder: 2 },
      { id: 'i2', text: 'Receber a conta', correctOrder: 0 },
      { id: 'i3', text: 'Registrar o pagamento', correctOrder: 3 },
      { id: 'i4', text: 'Conferir valores e vencimento', correctOrder: 1 },
    ],
    shuffleItems: false,
  },
  maxScore: 10,
  difficulty: 'medium',
  tags: ['rotina', 'processo'],
  createdAt: new Date('2026-02-16'),
  updatedAt: new Date('2026-02-16'),
}

/**
 * 4) Numérica
 */
export const mockExercise4: NumericExercise = {
  id: 'ex-004',
  type: 'numeric',
  title: 'Contas a Pagar - Questão numérica',
  description:
    'Uma empresa tem as seguintes contas no mês: aluguel R$ 1.200, energia elétrica R$ 350 e internet R$ 150. Qual é o total de contas a pagar no mês?',
  data: {
    correctAnswer: 1700,
    tolerance: 0.01,
    decimalPlaces: 2,
    unit: 'R$',
  },
  maxScore: 10,
  difficulty: 'easy',
  tags: ['financeiro', 'cálculo'],
  hints: ['Some 1200 + 350 + 150.'],
  createdAt: new Date('2026-02-16'),
  updatedAt: new Date('2026-02-16'),
  metadata: {
    comment: {
      title: 'Total mensal',
      content: 'A soma correta é R$ 1.700,00.',
    },
  },
}

/**
 * 5) Escrita
 */
export const mockExercise5: WritingExercise = {
  id: 'ex-005',
  type: 'writing',
  title: 'Contas a Pagar - Escrita curta',
  description:
    'Qual o setor responsável por organizar e pagar as contas e obrigações financeiras da empresa?',
  data: {
    correctAnswers: ['contas a pagar', 'Contas a Pagar', 'contas pagar'],
    maxCharacters: 60,
    placeholder: 'Digite a resposta',
    incorrectFeedback: 'Resposta esperada: contas a pagar.',
    caseSensitive: false,
    trimSpaces: true,
  },
  maxScore: 10,
  difficulty: 'easy',
  tags: ['conceito', 'financeiro'],
  createdAt: new Date('2026-02-16'),
  updatedAt: new Date('2026-02-16'),
}

/**
 * 6) Resposta Aberta
 */
export const mockExercise6: OpenTextExercise = {
  id: 'ex-006',
  type: 'open-text',
  title: 'Contas a Pagar - Resposta aberta',
  description: 'Explique o que é Contas a Pagar.',
  data: {
    placeholder: 'Escreva sua explicação aqui...',
    minLength: 40,
    maxLength: 400,
    expectedKeywords: [
      'organizar',
      'pagar',
      'obrigações financeiras',
      'empresa',
    ],
    modelAnswer:
      'É o setor responsável por organizar e pagar as contas e obrigações financeiras da empresa.',
    language: 'pt-BR',
    locale: 'pt-BR',
    primaryColor: '#f6339a',
    retrys: 2,
    answers: [
      {
        correct: true,
        comps: [
          {
            text: '<p><strong>Resposta esperada (exemplo):</strong> É o setor responsável por organizar e pagar as contas e obrigações financeiras da empresa.</p>',
          },
        ],
      },
    ],
  },
  maxScore: 20,
  difficulty: 'medium',
  tags: ['conceito', 'dissertativa'],
  createdAt: new Date('2026-02-16'),
  updatedAt: new Date('2026-02-16'),
  metadata: {
    comment: {
      title: 'Definição de Contas a Pagar',
      content:
        'Contas a Pagar controla compromissos financeiros, prazos e registros de pagamento para manter a saúde financeira da empresa.',
    },
  },
}

/**
 * Exercícios do documento de referência
 */
export const mockDocumentExercises: Exercise[] = [
  mockExercise1,
  mockExercise2,
  mockExercise3,
  mockExercise4,
  mockExercise5,
  mockExercise6,
]

export const mockExercises: Exercise[] = mockDocumentExercises

/**
 * Mock da API de exercícios
 * Simula o comportamento da API REST que será integrada
 */
export const mockExerciseApi = {
  async getExerciseById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockDocumentExercises.find((ex) => ex.id === id) || null
  },

  async getExercisesByIds(ids: string[]) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockDocumentExercises.filter((ex) => ids.includes(ex.id))
  },

  async getExercisesByList(listId: string) {
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (listId === 'list-001') {
      return mockDocumentExercises
    }

    return []
  },
}
