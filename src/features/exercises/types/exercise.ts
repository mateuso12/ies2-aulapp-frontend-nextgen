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
  | 'multiple-choice'      // Múltipla escolha (uma resposta)
  | 'multiple-select'      // Múltipla escolha (várias respostas)
  | 'open-text'            // Resposta aberta (texto livre)
  | 'numeric'              // Resposta numérica
  | 'ordering'             // Ordenação de itens
  | 'matching'             // Associação (ligar itens)
  | 'true-false'           // Verdadeiro ou Falso
  | 'fill-blanks'          // Preencher lacunas
  | 'drag-drop'            // Arrastar e soltar
  | 'code'                 // Código de programação

/**
 * Estado de submissão de um exercício
 */
export type SubmissionStatus =
  | 'not-started'          // Não iniciado
  | 'in-progress'          // Em progresso
  | 'submitted'            // Submetido (aguardando correção)
  | 'graded'               // Corrigido/avaliado

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
// @ts-ignore - TAnswer is used for type inference in derived types
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
  
  /** Número máximo de tentativas permitidas */
  maxAttempts?: number
  
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
  validate(
    exerciseData: TData,
    userAnswer: TAnswer
  ): ExerciseValidationResult
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
 * MÚLTIPLA ESCOLHA
 */
export interface MultipleChoiceOption {
  id: string
  text: string
  isCorrect: boolean // Usado apenas no backend/correção
}

export interface MultipleChoiceData {
  options: MultipleChoiceOption[]
  shuffleOptions?: boolean // Se deve embaralhar as opções
}

export type MultipleChoiceAnswer = string // ID da opção selecionada

export type MultipleChoiceExercise = BaseExercise<
  MultipleChoiceData,
  MultipleChoiceAnswer
>

/**
 * MÚLTIPLA SELEÇÃO (várias respostas corretas)
 */
export interface MultipleSelectData {
  options: MultipleChoiceOption[]
  minSelections?: number
  maxSelections?: number
  shuffleOptions?: boolean
}

export type MultipleSelectAnswer = string[] // Array de IDs selecionados

export type MultipleSelectExercise = BaseExercise<
  MultipleSelectData,
  MultipleSelectAnswer
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
 * ASSOCIAÇÃO (ligar itens de duas listas)
 */
export interface MatchingPair {
  leftId: string
  leftText: string
  rightId: string
  rightText: string
}

export interface MatchingData {
  pairs: MatchingPair[]
  shuffleLeft?: boolean
  shuffleRight?: boolean
}

export type MatchingAnswer = Record<string, string> // { leftId: rightId }

export type MatchingExercise = BaseExercise<MatchingData, MatchingAnswer>

/**
 * VERDADEIRO OU FALSO
 */
export interface TrueFalseData {
  correctAnswer: boolean
}

export type TrueFalseAnswer = boolean

export type TrueFalseExercise = BaseExercise<TrueFalseData, TrueFalseAnswer>

/**
 * PREENCHER LACUNAS
 */
export interface FillBlanksData {
  /** Texto com marcadores {0}, {1}, etc. para as lacunas */
  textWithBlanks: string
  
  /** Respostas corretas para cada lacuna */
  blanks: Array<{
    id: string
    correctAnswers: string[] // Aceita múltiplas variações
    caseSensitive?: boolean
  }>
}

export type FillBlanksAnswer = Record<string, string> // { blankId: answer }

export type FillBlanksExercise = BaseExercise<FillBlanksData, FillBlanksAnswer>

/**
 * ARRASTAR E SOLTAR
 */
export interface DragDropData {
  /** Itens que podem ser arrastados */
  items: Array<{
    id: string
    text: string
    type?: string // Tipo do item (opcional, para categorização)
  }>
  
  /** Zonas de drop e seus conteúdos esperados */
  dropZones: Array<{
    id: string
    label: string
    acceptedItemIds: string[] // IDs dos itens que podem ser colocados aqui
  }>
}

export type DragDropAnswer = Record<string, string[]> // { dropZoneId: [itemIds] }

export type DragDropExercise = BaseExercise<DragDropData, DragDropAnswer>

/**
 * CÓDIGO DE PROGRAMAÇÃO
 */
export interface CodeData {
  language: string // 'javascript', 'python', etc.
  starterCode?: string // Código inicial
  testCases?: Array<{
    input: unknown
    expectedOutput: unknown
  }>
  hints?: string[]
}

export type CodeAnswer = string // Código escrito pelo usuário

export type CodeExercise = BaseExercise<CodeData, CodeAnswer>

// ─────────────────────────────────────────────────────────────────────────────
// Union Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Union type de todos os tipos de exercícios.
 * Adicione novos tipos aqui quando criar novos exercícios.
 */
export type Exercise =
  | MultipleChoiceExercise
  | MultipleSelectExercise
  | OpenTextExercise
  | NumericExercise
  | OrderingExercise
  | MatchingExercise
  | TrueFalseExercise
  | FillBlanksExercise
  | DragDropExercise
  | CodeExercise

/**
 * Union type de todas as respostas possíveis
 */
export type ExerciseAnswer =
  | MultipleChoiceAnswer
  | MultipleSelectAnswer
  | OpenTextAnswer
  | NumericAnswer
  | OrderingAnswer
  | MatchingAnswer
  | TrueFalseAnswer
  | FillBlanksAnswer
  | DragDropAnswer
  | CodeAnswer

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

export const isMultipleSelectExercise = (
  exercise: Exercise
): exercise is MultipleSelectExercise => {
  return exercise.type === 'multiple-select'
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

export const isMatchingExercise = (
  exercise: Exercise
): exercise is MatchingExercise => {
  return exercise.type === 'matching'
}

export const isTrueFalseExercise = (
  exercise: Exercise
): exercise is TrueFalseExercise => {
  return exercise.type === 'true-false'
}

export const isFillBlanksExercise = (
  exercise: Exercise
): exercise is FillBlanksExercise => {
  return exercise.type === 'fill-blanks'
}

export const isDragDropExercise = (
  exercise: Exercise
): exercise is DragDropExercise => {
  return exercise.type === 'drag-drop'
}

export const isCodeExercise = (exercise: Exercise): exercise is CodeExercise => {
  return exercise.type === 'code'
}
