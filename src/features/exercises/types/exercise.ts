/**
 * Sistema de tipos para exercícios da plataforma.
 *
 * Arquitetura baseada em tipos genéricos que suportam extensão
 * para diferentes tipos de exercícios (múltipla escolha, texto,
 * numérico, ordenação, etc.).
 */

// ─────────────────────────────────────────────────────────────────────────────
// Enums e Constantes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tipos de exercícios suportados pela plataforma.
 * Adicione novos tipos aqui conforme necessário.
 */
export type ExerciseType =
  | 'multiple-choice' // Múltipla escolha (permite seleção múltipla)
  | 'open-text' // Resposta aberta (texto livre)
  | 'numeric' // Resposta numérica
  | 'ordering' // Ordenação de itens
  | 'true-false' // Verdadeiro ou Falso
  | 'writing' // Atividade de escrita (resposta curta)
  // Exercícios via web-components (iframe)
  | 'speech-pronunciation' // EX.WP - Pronunciação de palavras
  | 'speech-spelling' // EX.WS - Soletração de palavras
  | 'speech-syllable' // EX.WY - Silabação de palavras

/**
 * Estado de submissão de um exercício
 */
export type SubmissionStatus =
  | 'not-started' // Não iniciado
  | 'in-progress' // Em progresso
  | 'submitted' // Submetido (aguardando correção)
  | 'graded' // Corrigido/avaliado

/**
 * Nível de dificuldade
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard'

// ─────────────────────────────────────────────────────────────────────────────
// Interfaces Base
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Interface base para qualquer exercício.
 * Use generics para definir tipos específicos de dados e respostas.
 *
 * @template TData - Tipo dos dados específicos do exercício
 * @template TAnswer - Tipo da resposta do usuário (usado para inferência de tipos)
 */
export interface BaseExercise<TData = unknown, TAnswer = unknown> {
  /** ID único do exercício */
  id: string

  /** Tipo do exercício */
  type: ExerciseType

  /** Título/enunciado do exercício */
  title: string

  /** Descrição/instruções adicionais (opcional) */
  description?: string

  /** Conteúdo HTML do enunciado (para rich text) */
  contentHtml?: string

  /** Dados específicos do tipo de exercício */
  data: TData

  /** Pontuação máxima do exercício */
  maxScore: number

  /** Nível de dificuldade */
  difficulty?: DifficultyLevel

  /** Tags/categorias para organização */
  tags?: string[]

  /** Dicas opcionais para o aluno */
  hints?: string[]

  /** Referências/material de apoio */
  references?: ExerciseReference[]

  /** Metadados adicionais */
  metadata?: Record<string, unknown>

  /** Data de criação */
  createdAt: Date

  /** Data da última atualização */
  updatedAt: Date

  /** Tipo fantasma para inferência de TAnswer */
  __answerType?: TAnswer
}

/**
 * Referência/material de apoio
 */
export interface ExerciseReference {
  title: string
  url?: string
  description?: string
}

/**
 * Interface para resposta de um exercício.
 *
 * @template TAnswer - Tipo da resposta específica do exercício
 */
export interface ExerciseSubmission<TAnswer = unknown> {
  /** ID único da submissão */
  id: string

  /** ID do exercício respondido */
  exerciseId: string

  /** ID do usuário que respondeu */
  userId: string

  /** Resposta do usuário */
  answer: TAnswer

  /** Status da submissão */
  status: SubmissionStatus

  /** Nota obtida (após correção) */
  score?: number

  /** Feedback do professor/sistema */
  feedback?: string

  /** Tempo gasto em segundos */
  timeSpentSeconds?: number

  /** Número de tentativas */
  attemptNumber: number

  /** Data de submissão */
  submittedAt: Date

  /** Data de avaliação (quando aplicável) */
  gradedAt?: Date
}

/**
 * Interface para correção automática de exercícios.
 * Implementada por cada tipo de exercício que suporta correção automática.
 *
 * @template TData - Tipo dos dados do exercício
 * @template TAnswer - Tipo da resposta
 */
export interface ExerciseValidator<TData = unknown, TAnswer = unknown> {
  /**
   * Valida se uma resposta está correta
   * @returns { isCorrect, score, feedback }
   */
  validate(exerciseData: TData, userAnswer: TAnswer): ExerciseValidationResult
}

/**
 * Resultado da validação de uma resposta
 */
export interface ExerciseValidationResult {
  /** Se a resposta está correta */
  isCorrect: boolean

  /** Pontuação obtida (0 a maxScore) */
  score: number

  /** Feedback automático */
  feedback?: string

  /** Detalhes adicionais da correção */
  details?: Record<string, unknown>
}

/**
 * Props comuns para componentes de renderização de exercícios
 *
 * @template TData - Tipo dos dados do exercício
 * @template TAnswer - Tipo da resposta
 */
export interface ExerciseComponentProps<TData = unknown, TAnswer = unknown> {
  /** Dados do exercício */
  exercise: BaseExercise<TData, TAnswer>

  /** Resposta atual do usuário (controlled) */
  value?: TAnswer

  /** Callback quando a resposta muda */
  onChange?: (answer: TAnswer) => void

  /** Se o exercício está em modo de apenas visualização */
  readonly?: boolean

  /** Se deve mostrar a resposta correta (após submissão) */
  showCorrectAnswer?: boolean

  /** Feedback/resultado da correção */
  validationResult?: ExerciseValidationResult

  /** Classes CSS adicionais */
  className?: string

  /** Se está carregando */
  isLoading?: boolean

  /** Se está desabilitado */
  disabled?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Tipos de exercícios específicos
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MÚLTIPLA ESCOLHA (sempre permite seleção múltipla)
 */
export interface MultipleChoiceOption {
  id: string
  text: string
  isCorrect: boolean
  feedback?: string
}

export interface MultipleChoiceData {
  options: MultipleChoiceOption[]
  shuffleOptions?: boolean // Se deve embaralhar as opções
  minSelections?: number // Mínimo de seleções permitidas
  maxSelections?: number // Máximo de seleções permitidas
}

export type MultipleChoiceAnswer = string[] // Array de IDs das opções selecionadas

export type MultipleChoiceExercise = BaseExercise<
  MultipleChoiceData,
  MultipleChoiceAnswer
>

/**
 * RESPOSTA ABERTA (texto livre)
 */
export interface OpenTextData {
  placeholder?: string
  minLength?: number
  maxLength?: number
  expectedKeywords?: string[] // Palavras-chave esperadas (para feedback)
  modelAnswer?: string // Resposta modelo (apenas para professores)
}

export type OpenTextAnswer = string

export type OpenTextExercise = BaseExercise<OpenTextData, OpenTextAnswer>

/**
 * RESPOSTA NUMÉRICA
 */
export interface NumericData {
  correctAnswer: number
  tolerance?: number // Margem de erro aceitável
  unit?: string // Unidade de medida (opcional)
  min?: number
  max?: number
  decimalPlaces?: number
}

export type NumericAnswer = number

export type NumericExercise = BaseExercise<NumericData, NumericAnswer>

/**
 * ORDENAÇÃO
 */
export interface OrderingItem {
  id: string
  text: string
  correctOrder: number // Posição correta (0-based)
}

export interface OrderingData {
  items: OrderingItem[]
  shuffleItems?: boolean
}

export type OrderingAnswer = string[] // Array de IDs na ordem escolhida

export type OrderingExercise = BaseExercise<OrderingData, OrderingAnswer>

/**
 * VERDADEIRO OU FALSO
 */
export type TrueFalseLabelVariant =
  | 'verdadeiro-falso'
  | 'vf'
  | 'v-f'
  | 'v/f'
  | 'sim-nao'
  | 'certo-errado'
  | 'thumbs'

export interface TrueFalseStatement {
  id: string
  text: string
  correctAnswer: boolean
  incorrectFeedback?: string
}

export interface TrueFalseData {
  correctAnswer?: boolean
  statements?: TrueFalseStatement[]
  labelVariant?: TrueFalseLabelVariant
  incorrectFeedback?: string
}

export type TrueFalseAnswer = boolean | Record<string, boolean>

export type TrueFalseExercise = BaseExercise<TrueFalseData, TrueFalseAnswer>

/**
 * ATIVIDADE DE ESCRITA (resposta curta com validação)
 */
export interface WritingData {
  /** Variações de respostas corretas aceitas */
  correctAnswers: string[]

  /** Limite máximo de caracteres */
  maxCharacters?: number

  /** Placeholder para o campo de entrada */
  placeholder?: string

  /** Feedback a ser exibido quando a resposta estiver incorreta */
  incorrectFeedback?: string

  /** Se a validação é case-sensitive */
  caseSensitive?: boolean

  /** Se deve ignorar espaços em branco extras */
  trimSpaces?: boolean
}

export type WritingAnswer = string

export type WritingExercise = BaseExercise<WritingData, WritingAnswer>

/**
 * EXERCÍCIOS DE FALA (via web-components)
 */
export interface SpeechExerciseQuestion {
  text: string
  imageUrl?: string | null
  imageName?: string | null
  hasImage?: boolean
  word?: string
  separateWord?: string
}

export interface SpeechExerciseConfig {
  initialHelp?: boolean
  language?: string
  canSkip?: boolean
  instantCorrection?: boolean
}

export interface SpeechExerciseData {
  questions: SpeechExerciseQuestion[]
  config?: SpeechExerciseConfig
  institutionId?: string
}

export type SpeechExerciseAnswer = unknown

export type SpeechExercise = BaseExercise<
  SpeechExerciseData,
  SpeechExerciseAnswer
>

// ─────────────────────────────────────────────────────────────────────────────
// Union Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Union type de todos os tipos de exercícios.
 * Adicione novos tipos aqui quando criar novos exercícios.
 */
export type Exercise =
  | MultipleChoiceExercise
  | OpenTextExercise
  | NumericExercise
  | OrderingExercise
  | TrueFalseExercise
  | WritingExercise
  | SpeechExercise

/**
 * Union type de todas as respostas possíveis
 */
export type ExerciseAnswer =
  | MultipleChoiceAnswer
  | OpenTextAnswer
  | NumericAnswer
  | OrderingAnswer
  | TrueFalseAnswer
  | WritingAnswer
  | SpeechExerciseAnswer

// ─────────────────────────────────────────────────────────────────────────────
// Type Guards
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Type guards para identificar tipos de exercícios em runtime
 */
export const isMultipleChoiceExercise = (
  exercise: Exercise
): exercise is MultipleChoiceExercise => {
  return exercise.type === 'multiple-choice'
}

export const isOpenTextExercise = (
  exercise: Exercise
): exercise is OpenTextExercise => {
  return exercise.type === 'open-text'
}

export const isNumericExercise = (
  exercise: Exercise
): exercise is NumericExercise => {
  return exercise.type === 'numeric'
}

export const isOrderingExercise = (
  exercise: Exercise
): exercise is OrderingExercise => {
  return exercise.type === 'ordering'
}

export const isTrueFalseExercise = (
  exercise: Exercise
): exercise is TrueFalseExercise => {
  return exercise.type === 'true-false'
}

export const isWritingExercise = (
  exercise: Exercise
): exercise is WritingExercise => {
  return exercise.type === 'writing'
}

export const isSpeechExercise = (
  exercise: Exercise
): exercise is SpeechExercise => {
  return (
    exercise.type === 'speech-pronunciation' ||
    exercise.type === 'speech-spelling' ||
    exercise.type === 'speech-syllable'
  )
}
