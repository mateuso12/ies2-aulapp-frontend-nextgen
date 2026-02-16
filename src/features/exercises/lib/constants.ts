/**
 * Constantes e configurações para o sistema de exercícios
 */

import type { DifficultyLevel, ExerciseType } from '../types'

/**
 * Configurações padrão para cada tipo de exercício
 */
export const EXERCISE_TYPE_CONFIG: Record<
  ExerciseType,
  {
    label: string
    icon?: string // Nome do ícone Lucide
    description: string
    supportAutoGrade: boolean // Se suporta correção automática
    defaultMaxScore: number
  }
> = {
  'multiple-choice': {
    label: 'Múltipla Escolha',
    icon: 'ListChecks',
    description: 'Selecione a resposta correta entre as opções',
    supportAutoGrade: true,
    defaultMaxScore: 1,
  },
  'open-text': {
    label: 'Resposta Aberta',
    icon: 'FileText',
    description: 'Digite sua resposta em formato livre',
    supportAutoGrade: false,
    defaultMaxScore: 5,
  },
  numeric: {
    label: 'Resposta Numérica',
    icon: 'Calculator',
    description: 'Digite um valor numérico como resposta',
    supportAutoGrade: true,
    defaultMaxScore: 1,
  },
  ordering: {
    label: 'Ordenação',
    icon: 'ArrowUpDown',
    description: 'Organize os itens na ordem correta',
    supportAutoGrade: true,
    defaultMaxScore: 1,
  },
  'true-false': {
    label: 'Verdadeiro ou Falso',
    icon: 'HelpCircle',
    description: 'Indique se a afirmação é verdadeira ou falsa',
    supportAutoGrade: true,
    defaultMaxScore: 1,
  },
  writing: {
    label: 'Atividade de Escrita',
    icon: 'PenTool',
    description: 'Digite uma resposta curta com validação automática',
    supportAutoGrade: true,
    defaultMaxScore: 1,
  },
  'speech-pronunciation': {
    label: 'Fala: Pronunciação',
    icon: 'Mic',
    description: 'Exercício de pronunciação de palavras',
    supportAutoGrade: true,
    defaultMaxScore: 1,
  },
  'speech-spelling': {
    label: 'Fala: Soletração',
    icon: 'SpellCheck',
    description: 'Exercício de soletração por voz',
    supportAutoGrade: true,
    defaultMaxScore: 1,
  },
  'speech-syllable': {
    label: 'Fala: Silabação',
    icon: 'AudioLines',
    description: 'Exercício de separação silábica por voz',
    supportAutoGrade: true,
    defaultMaxScore: 1,
  },
  'fluency-reading': {
    label: 'Fluência Leitora',
    icon: 'BookOpenCheck',
    description: 'Exercício de leitura com avaliação de fluência',
    supportAutoGrade: true,
    defaultMaxScore: 1,
  },
}

/**
 * Cores para diferentes níveis de dificuldade
 */
export const DIFFICULTY_COLORS: Record<
  DifficultyLevel,
  {
    bg: string
    border: string
    text: string
    label: string
  }
> = {
  easy: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
    label: 'Fácil',
  },
  medium: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-700 dark:text-yellow-300',
    label: 'Médio',
  },
  hard: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    label: 'Difícil',
  },
}

/**
 * Cores para estados de submissão
 */
export const SUBMISSION_STATUS_COLORS = {
  'not-started': {
    bg: 'bg-gray-50 dark:bg-gray-900/20',
    border: 'border-gray-200 dark:border-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    label: 'Não Iniciado',
  },
  'in-progress': {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    label: 'Em Progresso',
  },
  submitted: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-300',
    label: 'Enviado',
  },
  graded: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
    label: 'Corrigido',
  },
} as const

/**
 * Configurações gerais do sistema de exercícios
 */
export const EXERCISE_CONFIG = {
  /** Tempo máximo padrão em minutos (null = sem limite) */
  DEFAULT_TIME_LIMIT: null as number | null,

  /** Número máximo de tentativas permitidas (null = ilimitado) */
  DEFAULT_MAX_ATTEMPTS: null as number | null,

  /** Se deve salvar rascunhos automaticamente */
  AUTO_SAVE_DRAFTS: true,

  /** Intervalo de auto-save em milissegundos */
  AUTO_SAVE_INTERVAL_MS: 30000, // 30 segundos

  /** Se deve embaralhar opções por padrão */
  DEFAULT_SHUFFLE_OPTIONS: false,

  /** Pontuação mínima para considerar aprovado (0-1) */
  PASSING_SCORE_THRESHOLD: 0.6, // 60%

  /** Mensagens de feedback padrão */
  DEFAULT_FEEDBACK: {
    correct: 'Resposta correta! Parabéns! 🎉',
    incorrect: 'Resposta incorreta. Tente novamente! 💪',
    partial: 'Resposta parcialmente correta. Continue tentando! 📝',
  },
} as const

/**
 * Regex patterns úteis para validação
 */
export const VALIDATION_PATTERNS = {
  /** Número decimal (aceita . ou , como separador) */
  NUMERIC: /^-?\d+([.,]\d+)?$/,

  /** Email simples */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** URL */
  URL: /^https?:\/\/.+/,
} as const

/**
 * Limites de caracteres para campos de texto
 */
export const TEXT_LIMITS = {
  TITLE_MIN: 3,
  TITLE_MAX: 200,
  DESCRIPTION_MAX: 1000,
  OPEN_TEXT_MIN: 10,
  OPEN_TEXT_MAX: 5000,
  HINT_MAX: 500,
} as const
