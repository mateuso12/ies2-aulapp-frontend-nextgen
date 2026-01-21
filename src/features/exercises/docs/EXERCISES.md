# 📚 Documentação do Sistema de Exercícios

> Guia completo para entender, estender e implementar exercícios na plataforma Aulapp.

---

## 📖 Índice

1. [Visão Geral](#-visão-geral)
2. [Arquitetura](#-arquitetura)
3. [Sistema de Tipos](#-sistema-de-tipos)
4. [Tipos de Exercícios Suportados](#-tipos-de-exercícios-suportados)
5. [Implementando um Novo Tipo de Exercício](#-implementando-um-novo-tipo-de-exercício)
6. [Validação e Correção Automática](#-validação-e-correção-automática)
7. [Persistência de Dados](#-persistência-de-dados)
8. [Hooks e Estado](#-hooks-e-estado)
9. [Componentes UI](#-componentes-ui)
10. [Exemplos Práticos](#-exemplos-práticos)
11. [Boas Práticas](#-boas-práticas)

---

## 🎯 Visão Geral

O sistema de exercícios do Aulapp foi projetado para ser **genérico**, **extensível** e **type-safe**. A arquitetura permite:

### ✨ Características Principais

- ✅ **Genérico**: Sistema baseado em generics TypeScript que suporta qualquer tipo de exercício
- ✅ **Extensível**: Adicione novos tipos de exercícios sem modificar código existente
- ✅ **Type-Safe**: Tipagem forte em toda a cadeia (dados → resposta → validação)
- ✅ **Correção Automática**: Suporte integrado para validação automática
- ✅ **Persistência**: Firebase + auto-save de rascunhos
- ✅ **Modular**: Componentes reutilizáveis e separação de responsabilidades
- ✅ **Testável**: Interfaces abstratas facilitam testes unitários

### 🎨 Tipos de Exercícios Incluídos

| Tipo | Status | Correção Automática |
|------|--------|---------------------|
| **Múltipla Escolha** | 🟡 Estrutura criada | ✅ Sim |
| **Múltipla Seleção** | 🟡 Estrutura criada | ✅ Sim |
| **Resposta Aberta** | 🟡 Estrutura criada | ❌ Não |
| **Resposta Numérica** | 🟡 Estrutura criada | ✅ Sim |
| **Ordenação** | 🟡 Estrutura criada | ✅ Sim (parcial) |
| **Associação** | 🟡 Estrutura criada | ✅ Sim (parcial) |
| **Verdadeiro/Falso** | 🟡 Estrutura criada | ✅ Sim |
| **Preencher Lacunas** | 🟡 Estrutura criada | ✅ Sim |
| **Arrastar e Soltar** | 🟡 Estrutura criada | ✅ Sim |
| **Código** | 🟡 Estrutura criada | ⚠️ Condicional |

🟡 = Tipos e validadores criados, componentes UI pendentes

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/features/exercises/
├── components/              # Componentes React
│   ├── exercise-types/      # Componentes específicos por tipo
│   │   ├── MultipleChoiceExercise.tsx    # TODO
│   │   ├── OpenTextExercise.tsx          # TODO
│   │   └── ...
│   └── common/              # Componentes reutilizáveis
│       ├── ExerciseCard.tsx              # TODO
│       ├── ExerciseFeedback.tsx          # TODO
│       ├── SubmitButton.tsx              # TODO
│       └── ...
│
├── hooks/                   # Hooks customizados
│   ├── useExerciseSubmission.ts  # ✅ Hook principal
│   └── index.ts
│
├── types/                   # Sistema de tipos
│   ├── exercise.ts          # ✅ Tipos completos
│   └── index.ts
│
├── lib/                     # Utilitários e lógica
│   ├── constants.ts         # ✅ Constantes e configurações
│   ├── utils.ts             # ✅ Validadores e helpers
│   └── index.ts
│
├── repositories/            # Camada de persistência
│   ├── exerciseRepository.ts              # ✅ Interfaces
│   ├── firebaseExerciseRepository.ts      # ✅ Implementação Firebase
│   └── index.ts
│
├── docs/                    # Documentação
│   └── EXERCISES.md         # Este arquivo
│
└── index.ts                 # Barrel export principal
```

### Princípios de Design

1. **Separation of Concerns**: Tipos, validação, UI e persistência são camadas independentes
2. **Dependency Injection**: Repositórios são injetados nos hooks (facilita testes)
3. **Interface Segregation**: Múltiplas interfaces pequenas ao invés de uma grande
4. **Open/Closed Principle**: Aberto para extensão, fechado para modificação
5. **Type Safety First**: TypeScript em modo estrito, sem `any`

---

## 🧬 Sistema de Tipos

### Anatomia de um Exercício

Todo exercício na plataforma segue a interface genérica `BaseExercise<TData, TAnswer>`:

```typescript
interface BaseExercise<TData = unknown, TAnswer = unknown> {
  // Identificação
  id: string
  type: ExerciseType
  
  // Conteúdo
  title: string
  description?: string
  contentHtml?: string
  
  // Dados específicos do tipo
  data: TData
  
  // Configuração
  maxScore: number
  difficulty?: DifficultyLevel
  tags?: string[]
  hints?: string[]
  references?: ExerciseReference[]
  
  // Metadados
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}
```

### Generics: A Chave da Extensibilidade

O uso de **generics** permite que cada tipo de exercício defina:

1. **TData**: Estrutura dos dados específicos do exercício
2. **TAnswer**: Estrutura da resposta do usuário

Exemplo:

```typescript
// Múltipla Escolha
interface MultipleChoiceData {
  options: MultipleChoiceOption[]
  shuffleOptions?: boolean
}

type MultipleChoiceAnswer = string // ID da opção selecionada

type MultipleChoiceExercise = BaseExercise<
  MultipleChoiceData,
  MultipleChoiceAnswer
>
```

### Type Guards

Para trabalhar com unions de forma type-safe, use os type guards fornecidos:

```typescript
import { isMultipleChoiceExercise, isNumericExercise } from '@/features/exercises'

function renderExercise(exercise: Exercise) {
  if (isMultipleChoiceExercise(exercise)) {
    // TypeScript sabe que exercise.data é MultipleChoiceData
    return <MultipleChoiceExercise exercise={exercise} />
  }
  
  if (isNumericExercise(exercise)) {
    // TypeScript sabe que exercise.data é NumericData
    return <NumericExercise exercise={exercise} />
  }
}
```

---

## 📋 Tipos de Exercícios Suportados

### 1. Múltipla Escolha (`multiple-choice`)

**Descrição**: Questão com várias alternativas, apenas uma correta.

**Estrutura de Dados**:
```typescript
interface MultipleChoiceData {
  options: Array<{
    id: string
    text: string
    isCorrect: boolean  // Apenas backend/correção
  }>
  shuffleOptions?: boolean
}

type MultipleChoiceAnswer = string // ID da opção
```

**Exemplo**:
```typescript
const exercise: MultipleChoiceExercise = {
  id: 'ex-001',
  type: 'multiple-choice',
  title: 'Qual é a capital do Brasil?',
  data: {
    options: [
      { id: 'a', text: 'São Paulo', isCorrect: false },
      { id: 'b', text: 'Brasília', isCorrect: true },
      { id: 'c', text: 'Rio de Janeiro', isCorrect: false },
    ],
    shuffleOptions: true,
  },
  maxScore: 1,
  difficulty: 'easy',
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

---

### 2. Múltipla Seleção (`multiple-select`)

**Descrição**: Questão com várias alternativas, múltiplas respostas corretas.

**Estrutura de Dados**:
```typescript
interface MultipleSelectData {
  options: MultipleChoiceOption[]
  minSelections?: number
  maxSelections?: number
  shuffleOptions?: boolean
}

type MultipleSelectAnswer = string[] // Array de IDs
```

**Validação**: Pontuação parcial baseada em acertos - erros.

---

### 3. Resposta Aberta (`open-text`)

**Descrição**: Campo de texto livre para respostas dissertativas.

**Estrutura de Dados**:
```typescript
interface OpenTextData {
  placeholder?: string
  minLength?: number
  maxLength?: number
  expectedKeywords?: string[]  // Para feedback
  modelAnswer?: string         // Resposta modelo
}

type OpenTextAnswer = string
```

**Correção**: Manual (não suporta correção automática).

---

### 4. Resposta Numérica (`numeric`)

**Descrição**: Campo numérico com margem de erro opcional.

**Estrutura de Dados**:
```typescript
interface NumericData {
  correctAnswer: number
  tolerance?: number      // Margem de erro
  unit?: string          // Unidade (ex: 'km', 'm²')
  min?: number
  max?: number
  decimalPlaces?: number
}

type NumericAnswer = number
```

**Exemplo**:
```typescript
const exercise: NumericExercise = {
  id: 'ex-002',
  type: 'numeric',
  title: 'Calcule π com 2 casas decimais',
  data: {
    correctAnswer: 3.14,
    tolerance: 0.01,
    decimalPlaces: 2,
  },
  maxScore: 1,
  // ...
}
```

---

### 5. Ordenação (`ordering`)

**Descrição**: Organizar itens na ordem correta.

**Estrutura de Dados**:
```typescript
interface OrderingItem {
  id: string
  text: string
  correctOrder: number  // 0-based
}

interface OrderingData {
  items: OrderingItem[]
  shuffleItems?: boolean
}

type OrderingAnswer = string[] // Array de IDs ordenados
```

**Validação**: Pontuação parcial baseada em quantos itens estão nas posições corretas.

---

### 6. Associação (`matching`)

**Descrição**: Ligar itens de duas colunas.

**Estrutura de Dados**:
```typescript
interface MatchingPair {
  leftId: string
  leftText: string
  rightId: string
  rightText: string
}

interface MatchingData {
  pairs: MatchingPair[]
  shuffleLeft?: boolean
  shuffleRight?: boolean
}

type MatchingAnswer = Record<string, string> // { leftId: rightId }
```

---

### 7. Verdadeiro ou Falso (`true-false`)

**Descrição**: Afirmação para julgar como verdadeira ou falsa.

**Estrutura de Dados**:
```typescript
interface TrueFalseData {
  correctAnswer: boolean
}

type TrueFalseAnswer = boolean
```

---

### 8. Preencher Lacunas (`fill-blanks`)

**Descrição**: Completar texto com palavras faltantes.

**Estrutura de Dados**:
```typescript
interface FillBlanksData {
  textWithBlanks: string  // Ex: "A {0} do Brasil é {1}"
  blanks: Array<{
    id: string
    correctAnswers: string[]  // Aceita variações
    caseSensitive?: boolean
  }>
}

type FillBlanksAnswer = Record<string, string> // { blankId: answer }
```

---

### 9. Arrastar e Soltar (`drag-drop`)

**Descrição**: Arrastar itens para zonas específicas.

**Estrutura de Dados**:
```typescript
interface DragDropData {
  items: Array<{
    id: string
    text: string
    type?: string
  }>
  dropZones: Array<{
    id: string
    label: string
    acceptedItemIds: string[]
  }>
}

type DragDropAnswer = Record<string, string[]> // { zoneId: [itemIds] }
```

---

### 10. Código (`code`)

**Descrição**: Editor de código para exercícios de programação.

**Estrutura de Dados**:
```typescript
interface CodeData {
  language: string        // 'javascript', 'python', etc.
  starterCode?: string
  testCases?: Array<{
    input: unknown
    expectedOutput: unknown
  }>
  hints?: string[]
}

type CodeAnswer = string
```

**Correção**: Requer integração com judge online (ex: Judge0 API).

---

## 🚀 Implementando um Novo Tipo de Exercício

### Passo 1: Definir Tipos

Adicione os tipos em [types/exercise.ts](../types/exercise.ts):

```typescript
// 1. Definir estrutura dos dados
export interface MyExerciseData {
  // Campos específicos do seu exercício
  question: string
  config?: Record<string, unknown>
}

// 2. Definir estrutura da resposta
export type MyExerciseAnswer = {
  // Formato da resposta do usuário
}

// 3. Criar type alias
export type MyExercise = BaseExercise<MyExerciseData, MyExerciseAnswer>

// 4. Adicionar ao ExerciseType
export type ExerciseType = 
  | 'multiple-choice'
  // ... outros tipos
  | 'my-exercise'  // ← Adicione aqui

// 5. Adicionar ao union Exercise
export type Exercise =
  | MultipleChoiceExercise
  // ... outros tipos
  | MyExercise  // ← Adicione aqui

// 6. Criar type guard
export const isMyExercise = (exercise: Exercise): exercise is MyExercise => {
  return exercise.type === 'my-exercise'
}
```

### Passo 2: Adicionar Configuração

Em [lib/constants.ts](../lib/constants.ts):

```typescript
export const EXERCISE_TYPE_CONFIG: Record<ExerciseType, {...}> = {
  // ... outros tipos
  'my-exercise': {
    label: 'Meu Exercício',
    icon: 'Sparkles',  // Ícone Lucide
    description: 'Descrição do tipo de exercício',
    supportAutoGrade: true,  // Se suporta correção automática
    defaultMaxScore: 1,
  },
}
```

### Passo 3: Implementar Validador (Opcional)

Se suportar correção automática, em [lib/utils.ts](../lib/utils.ts):

```typescript
export const validateMyExercise = (
  exercise: MyExercise,
  answer: MyExerciseAnswer
): ExerciseValidationResult => {
  // Lógica de validação
  const isCorrect = /* ... */
  
  return {
    isCorrect,
    score: isCorrect ? exercise.maxScore : 0,
    feedback: isCorrect ? 'Correto! 🎉' : 'Tente novamente',
    details: { /* ... */ },
  }
}

// Adicionar ao switch em validateExercise()
export const validateExercise = (exercise: Exercise, answer: ExerciseAnswer) => {
  switch (exercise.type) {
    // ... outros casos
    case 'my-exercise':
      return validateMyExercise(exercise, answer as MyExerciseAnswer)
    // ...
  }
}
```

### Passo 4: Criar Componente UI

Crie `components/exercise-types/MyExercise.tsx`:

```tsx
import React from 'react'
import type { ExerciseComponentProps, MyExerciseData, MyExerciseAnswer } from '../../types'

interface MyExerciseProps extends ExerciseComponentProps<MyExerciseData, MyExerciseAnswer> {}

export const MyExercise: React.FC<MyExerciseProps> = ({
  exercise,
  value,
  onChange,
  readonly = false,
  showCorrectAnswer = false,
  validationResult,
  className,
  isLoading,
  disabled,
}) => {
  const handleChange = (newAnswer: MyExerciseAnswer) => {
    if (!readonly && !disabled && onChange) {
      onChange(newAnswer)
    }
  }

  return (
    <div className={className}>
      {/* Implemente sua UI aqui */}
      <h3>{exercise.title}</h3>
      {exercise.description && <p>{exercise.description}</p>}
      
      {/* Área de resposta */}
      <div>
        {/* Seu componente de input */}
      </div>
      
      {/* Feedback */}
      {validationResult && (
        <div className={validationResult.isCorrect ? 'text-green-600' : 'text-red-600'}>
          {validationResult.feedback}
        </div>
      )}
    </div>
  )
}
```

### Passo 5: Exportar Componente

Em `components/exercise-types/index.ts`:

```typescript
export { MyExercise } from './MyExercise'
```

### Passo 6: Usar no Router de Componentes

Crie um componente router que renderiza o tipo correto:

```tsx
import { Exercise } from '@/features/exercises'
import {
  MultipleChoiceExercise,
  MyExercise,
  // ... outros
} from '@/features/exercises/components/exercise-types'

export const ExerciseRenderer: React.FC<{
  exercise: Exercise
  value?: ExerciseAnswer
  onChange?: (answer: ExerciseAnswer) => void
}> = ({ exercise, value, onChange }) => {
  switch (exercise.type) {
    case 'multiple-choice':
      return <MultipleChoiceExercise exercise={exercise} value={value} onChange={onChange} />
    
    case 'my-exercise':
      return <MyExercise exercise={exercise} value={value} onChange={onChange} />
    
    // ... outros casos
    
    default:
      return <div>Tipo de exercício não suportado: {exercise.type}</div>
  }
}
```

---

## ✅ Validação e Correção Automática

### Sistema de Validação

O sistema de validação é baseado na interface `ExerciseValidator`:

```typescript
interface ExerciseValidator<TData, TAnswer> {
  validate(
    exerciseData: TData,
    userAnswer: TAnswer
  ): ExerciseValidationResult
}

interface ExerciseValidationResult {
  isCorrect: boolean
  score: number
  feedback?: string
  details?: Record<string, unknown>
}
```

### Tipos de Correção

#### 1. Correção Binária (Correto/Incorreto)

Exemplo: Múltipla Escolha, Verdadeiro/Falso

```typescript
const isCorrect = answer === correctAnswer
return {
  isCorrect,
  score: isCorrect ? maxScore : 0,
  feedback: isCorrect ? 'Correto! 🎉' : 'Incorreto',
}
```

#### 2. Correção com Margem de Erro

Exemplo: Resposta Numérica

```typescript
const isCorrect = Math.abs(answer - correctAnswer) <= tolerance
return {
  isCorrect,
  score: isCorrect ? maxScore : 0,
  feedback: isCorrect ? 'Correto!' : `Esperado: ${correctAnswer}`,
}
```

#### 3. Correção Parcial

Exemplo: Múltipla Seleção, Ordenação

```typescript
const correctCount = countCorrectItems(answer, correctAnswer)
const totalCount = getTotalItems(correctAnswer)
const score = (correctCount / totalCount) * maxScore

return {
  isCorrect: correctCount === totalCount,
  score: Math.round(score * 100) / 100,
  feedback: `${correctCount} de ${totalCount} corretos`,
  details: { correctCount, totalCount },
}
```

#### 4. Sem Correção Automática

Exemplo: Resposta Aberta, Código (sem judge)

```typescript
// Apenas salva, não valida
return {
  isCorrect: false,
  score: 0,
  feedback: 'Aguardando correção manual',
}
```

### Função Genérica de Validação

Use `validateExercise()` para validar qualquer tipo:

```typescript
import { validateExercise } from '@/features/exercises'

const result = validateExercise(exercise, userAnswer)
console.log(result.isCorrect)  // boolean
console.log(result.score)      // número
console.log(result.feedback)   // string
```

---

## 💾 Persistência de Dados

### Arquitetura de Dados

O sistema utiliza uma **arquitetura híbrida**:

#### 📡 Exercícios → API REST
Os exercícios são **fornecidos por uma API externa** (backend) que será integrada futuramente:
- Dados dos exercícios (enunciados, opções, configurações)
- Listas de exercícios
- Metadados educacionais

#### 🔥 Submissões e Rascunhos → Firebase
As respostas dos alunos são armazenadas no **Firebase Realtime Database**:
- Submissões finais (respostas enviadas)
- Rascunhos (auto-save durante resolução)

### Estrutura de Dados

#### API REST (Exercícios)
```
GET /api/exercises/{exerciseId}
GET /api/exercises?ids={id1,id2,...}
GET /api/exercise-lists/{listId}/exercises
POST /api/exercises (apenas professores)
PATCH /api/exercises/{id} (apenas professores)
DELETE /api/exercises/{id} (apenas professores)
```

#### Firebase (Submissões e Rascunhos)
```
/nextgen-frontend/
  ├── submissions/{userId}/{submissionId}/    # Respostas submetidas
  └── drafts/{userId}/{exerciseId}/           # Rascunhos (auto-save)
```

### Repositórios

O sistema usa o padrão **Repository** com interfaces abstratas:

```typescript
// Interface abstrata para exercícios
interface IExerciseRepository {
  findById(id: string): Promise<Exercise | null>
  findByIds(ids: string[]): Promise<Exercise[]>
  findByList(listId: string): Promise<Exercise[]>
  save(exercise: Exercise): Promise<void>
  update(id: string, exercise: Partial<Exercise>): Promise<void>
  remove(id: string): Promise<void>
}

// Interface para submissões
interface ISubmissionRepository {
  findByUserAndExercise(userId: string, exerciseId: string): Promise<ExerciseSubmission[]>
  findLatestByUserAndExercise(userId: string, exerciseId: string): Promise<ExerciseSubmission | null>
  save(submission: ExerciseSubmission): Promise<void>
  // ...
}

// Interface para rascunhos
interface IDraftRepository {
  saveDraft<T>(userId: string, exerciseId: string, answer: T): Promise<void>
  getDraft<T>(userId: string, exerciseId: string): Promise<T | null>
  removeDraft(userId: string, exerciseId: string): Promise<void>
  // ...
}
```

### Implementações

#### API REST para Exercícios

A implementação em [repositories/apiExerciseRepository.ts](../repositories/apiExerciseRepository.ts) é um **stub** que será substituído pela integração real com a API:

```typescript
import { ApiExerciseRepository } from '@/features/exercises/repositories'

// Instanciar com URL da API
const exerciseRepo = new ApiExerciseRepository('/api')

// Usar
const exercise = await exerciseRepo.findById('ex-001')
const exercises = await exerciseRepo.findByList('list-123')
```

**TODO**: Quando a API estiver disponível, ajuste a `baseUrl` e adicione autenticação se necessário.

#### Firebase para Submissões e Rascunhos

As implementações Firebase estão no mesmo arquivo [repositories/apiExerciseRepository.ts](../repositories/apiExerciseRepository.ts):

```typescript
import {
  FirebaseSubmissionRepository,
  FirebaseDraftRepository,
} from '@/features/exercises/repositories'

// Instanciar repositórios
const submissionRepo = new FirebaseSubmissionRepository()
const draftRepo = new FirebaseDraftRepository()

// Usar
const submission = await submissionRepo.findLatestByUserAndExercise('user-123', 'ex-001')
const draft = await draftRepo.getDraft('user-123', 'ex-001')
```

### Exemplo de Uso

```typescript
import { ApiExerciseRepository, FirebaseSubmissionRepository, FirebaseDraftRepository } from '@/features/exercises/repositories'

// Instanciar repositórios
const exerciseRepo = new ApiExerciseRepository('/api')
const submissionRepo = new FirebaseSubmissionRepository()
const draftRepo = new FirebaseDraftRepository()

// Buscar exercício da API
const exercise = await exerciseRepo.findById('ex-001')

// Salvar submissão no Firebase
await submissionRepo.save({
  id: 'sub-001',
  exerciseId: 'ex-001',
  userId: 'user-123',
  answer: 'option-a',
  status: 'graded',
  score: 1,
  feedback: 'Correto!',
  attemptNumber: 1,
  submittedAt: new Date(),
  gradedAt: new Date(),
})

// Auto-save de rascunho no Firebase
await draftRepo.saveDraft('user-123', 'ex-001', { selectedOption: 'option-b' })
```

---

## 🪝 Hooks e Estado

### `useExerciseSubmission`

Hook principal para gerenciar o ciclo de vida completo de um exercício:

```typescript
import { useExerciseSubmission } from '@/features/exercises'

const {
  exercise,           // Dados do exercício
  answer,            // Resposta atual
  setAnswer,         // Atualizar resposta
  submit,            // Submeter exercício
  validationResult,  // Resultado da validação
  latestSubmission,  // Última submissão
  isLoading,         // Carregando exercício
  isSubmitting,      // Submetendo resposta
  error,             // Mensagem de erro
  hasDraft,          // Tem rascunho salvo?
  clearDraft,        // Limpar rascunho
  elapsedSeconds,    // Tempo decorrido
} = useExerciseSubmission({
  exerciseId: 'ex-001',
  userId: 'user-123',
  exerciseRepository,
  submissionRepository,
  draftRepository,
  loadDraft: true,           // Carregar rascunho ao iniciar
  autoSave: true,            // Auto-save de rascunhos
  autoSaveInterval: 30000,   // 30 segundos
  onSubmit: (submission) => {
    console.log('Exercício submetido!', submission)
  },
})
```

### Funcionalidades do Hook

1. **Carregamento Automático**: Busca o exercício e submissões anteriores
2. **Auto-Save**: Salva rascunhos automaticamente enquanto o usuário responde
3. **Validação Integrada**: Valida a resposta antes de salvar (se suportado)
4. **Tracking de Tempo**: Registra quanto tempo o usuário levou
5. **Tentativas**: Controla número de tentativas do usuário
6. **Error Handling**: Gerencia erros de rede e validação

### Exemplo de Uso em Componente

```tsx
import React from 'react'
import { useExerciseSubmission } from '@/features/exercises'
import { ApiExerciseRepository, FirebaseSubmissionRepository, FirebaseDraftRepository } from '@/features/exercises/repositories'
import { ExerciseRenderer } from './ExerciseRenderer'

export const ExercisePage: React.FC<{ exerciseId: string }> = ({ exerciseId }) => {
  const {
    exercise,
    answer,
    setAnswer,
    submit,
    validationResult,
    isLoading,
    isSubmitting,
    error,
  } = useExerciseSubmission({
    exerciseId,
    userId: 'current-user-id',
    exerciseRepository: new ApiExerciseRepository('/api'),
    submissionRepository: new FirebaseSubmissionRepository(),
    draftRepository: new FirebaseDraftRepository(),
  })

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>
  if (!exercise) return <div>Exercício não encontrado</div>

  return (
    <div>
      <ExerciseRenderer
        exercise={exercise}
        value={answer}
        onChange={setAnswer}
        validationResult={validationResult}
      />
      
      <button onClick={submit} disabled={isSubmitting || !answer}>
        {isSubmitting ? 'Enviando...' : 'Enviar Resposta'}
      </button>
      
      {validationResult && (
        <div>
          <p>Pontuação: {validationResult.score}/{exercise.maxScore}</p>
          <p>{validationResult.feedback}</p>
        </div>
      )}
    </div>
  )
}
```

---

## 🎨 Componentes UI

### Componentes a Serem Implementados

#### 1. Componentes de Tipos Específicos

Cada tipo de exercício precisa de seu componente:

**`components/exercise-types/MultipleChoiceExercise.tsx`**
```tsx
interface Props extends ExerciseComponentProps<MultipleChoiceData, MultipleChoiceAnswer> {}

export const MultipleChoiceExercise: React.FC<Props> = ({
  exercise,
  value,
  onChange,
  readonly,
  showCorrectAnswer,
  validationResult,
}) => {
  const options = exercise.data.shuffleOptions 
    ? shuffleArray(exercise.data.options)
    : exercise.data.options

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{exercise.title}</h3>
      {exercise.description && <p className="text-muted-foreground">{exercise.description}</p>}
      
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => !readonly && onChange?.(option.id)}
            disabled={readonly}
            className={cn(
              'w-full p-4 text-left rounded-lg border',
              value === option.id && 'border-primary bg-primary/10',
              showCorrectAnswer && option.isCorrect && 'border-green-500 bg-green-50',
            )}
          >
            {option.text}
          </button>
        ))}
      </div>
      
      {validationResult && (
        <div className={cn(
          'p-4 rounded-lg',
          validationResult.isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        )}>
          {validationResult.feedback}
        </div>
      )}
    </div>
  )
}
```

#### 2. Componentes Comuns Reutilizáveis

**`components/common/ExerciseCard.tsx`**
```tsx
interface ExerciseCardProps {
  exercise: Exercise
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  children,
  showHeader = true,
  showFooter = true,
}) => {
  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{exercise.title}</CardTitle>
            <div className="flex gap-2">
              {exercise.difficulty && <DifficultyBadge level={exercise.difficulty} />}
              <ScoreBadge maxScore={exercise.maxScore} />
            </div>
          </div>
          {exercise.description && (
            <CardDescription>{exercise.description}</CardDescription>
          )}
        </CardHeader>
      )}
      
      <CardContent>{children}</CardContent>
      
      {showFooter && exercise.hints && exercise.hints.length > 0 && (
        <CardFooter>
          <ExerciseHints hints={exercise.hints} />
        </CardFooter>
      )}
    </Card>
  )
}
```

**`components/common/DifficultyBadge.tsx`**
```tsx
import { DIFFICULTY_COLORS } from '../../lib/constants'

interface DifficultyBadgeProps {
  level: DifficultyLevel
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ level }) => {
  const config = DIFFICULTY_COLORS[level]
  
  return (
    <span className={cn(
      'px-2 py-1 rounded-md text-xs font-medium',
      config.bg,
      config.border,
      config.text,
    )}>
      {config.label}
    </span>
  )
}
```

**`components/common/ExerciseFeedback.tsx`**
```tsx
interface ExerciseFeedbackProps {
  validationResult: ExerciseValidationResult
  maxScore: number
}

export const ExerciseFeedback: React.FC<ExerciseFeedbackProps> = ({
  validationResult,
  maxScore,
}) => {
  const percentage = calculateScorePercentage(validationResult.score, maxScore)
  const isPassing = isPassingScore(validationResult.score, maxScore)
  
  return (
    <div className={cn(
      'p-6 rounded-lg border-2',
      validationResult.isCorrect 
        ? 'bg-green-50 border-green-500 dark:bg-green-900/20'
        : 'bg-red-50 border-red-500 dark:bg-red-900/20'
    )}>
      <div className="flex items-center gap-4">
        {validationResult.isCorrect ? (
          <CheckCircle className="w-8 h-8 text-green-600" />
        ) : (
          <XCircle className="w-8 h-8 text-red-600" />
        )}
        
        <div className="flex-1">
          <h4 className="font-bold text-lg">
            {validationResult.isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta'}
          </h4>
          <p className="text-sm">{validationResult.feedback}</p>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold">{percentage}%</div>
          <div className="text-sm text-muted-foreground">
            {validationResult.score}/{maxScore} pontos
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Criar e Renderizar Exercício de Múltipla Escolha

```tsx
import { MultipleChoiceExercise } from '@/features/exercises/types'
import { MultipleChoiceExercise as MCComponent } from '@/features/exercises/components'

// 1. Criar dados do exercício
const exercise: MultipleChoiceExercise = {
  id: 'mc-001',
  type: 'multiple-choice',
  title: 'Qual linguagem foi usada neste projeto?',
  description: 'Selecione a linguagem de programação principal',
  data: {
    options: [
      { id: 'a', text: 'JavaScript', isCorrect: false },
      { id: 'b', text: 'TypeScript', isCorrect: true },
      { id: 'c', text: 'Python', isCorrect: false },
      { id: 'd', text: 'Java', isCorrect: false },
    ],
    shuffleOptions: true,
  },
  maxScore: 1,
  difficulty: 'easy',
  tags: ['programação', 'typescript'],
  hints: ['Pense na tipagem estática', 'Superset do JavaScript'],
  createdAt: new Date(),
  updatedAt: new Date(),
}

// 2. Renderizar componente
function MyPage() {
  const [answer, setAnswer] = useState<string | null>(null)
  
  return (
    <MCComponent
      exercise={exercise}
      value={answer}
      onChange={setAnswer}
    />
  )
}
```

### Exemplo 2: Sistema Completo com Hook

```tsx
import { useExerciseSubmission } from '@/features/exercises'
import { ApiExerciseRepository, FirebaseSubmissionRepository, FirebaseDraftRepository } from '@/features/exercises/repositories'
import { ExerciseCard, ExerciseFeedback, SubmitButton } from '@/features/exercises/components'

export const ExercisePlayer: React.FC<{ exerciseId: string; userId: string }> = ({
  exerciseId,
  userId,
}) => {
  const {
    exercise,
    answer,
    setAnswer,
    submit,
    validationResult,
    latestSubmission,
    isLoading,
    isSubmitting,
    error,
    elapsedSeconds,
  } = useExerciseSubmission({
    exerciseId,
    userId,
    exerciseRepository: new ApiExerciseRepository('/api'),
    submissionRepository: new FirebaseSubmissionRepository(),
    draftRepository: new FirebaseDraftRepository(),
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!exercise) return <NotFound />

  const hasSubmitted = latestSubmission?.status === 'graded'

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ExerciseCard exercise={exercise}>
        <ExerciseRenderer
          exercise={exercise}
          value={answer}
          onChange={setAnswer}
          readonly={hasSubmitted}
          showCorrectAnswer={hasSubmitted}
          validationResult={validationResult}
        />
      </ExerciseCard>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Tempo: {formatTime(elapsedSeconds)}
        </div>

        {!hasSubmitted && (
          <SubmitButton
            onClick={submit}
            disabled={!answer}
            isLoading={isSubmitting}
          />
        )}
      </div>

      {validationResult && (
        <div className="mt-6">
          <ExerciseFeedback
            validationResult={validationResult}
            maxScore={exercise.maxScore}
          />
        </div>
      )}
    </div>
  )
}
```

### Exemplo 3: Lista de Exercícios

```tsx
import { Exercise } from '@/features/exercises/types'
import { ExerciseCard, ProgressBar } from '@/features/exercises/components'

interface ExerciseListProps {
  exercises: Exercise[]
  completedIds: string[]
  onSelect: (exerciseId: string) => void
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  completedIds,
  onSelect,
}) => {
  const progress = (completedIds.length / exercises.length) * 100

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Lista de Exercícios</h2>
        <ProgressBar value={progress} max={100} />
        <p className="text-sm text-muted-foreground mt-2">
          {completedIds.length} de {exercises.length} completos
        </p>
      </div>

      <div className="space-y-4">
        {exercises.map((exercise) => {
          const isCompleted = completedIds.includes(exercise.id)
          
          return (
            <button
              key={exercise.id}
              onClick={() => onSelect(exercise.id)}
              className="w-full text-left"
            >
              <ExerciseCard exercise={exercise} showFooter={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {EXERCISE_TYPE_CONFIG[exercise.type].label}
                    </p>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </ExerciseCard>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

---

## ✨ Boas Práticas

### 1. Tipagem Forte

```typescript
// ✅ BOM: Tipagem explícita
const exercise: MultipleChoiceExercise = { /* ... */ }
const answer: MultipleChoiceAnswer = 'option-a'

// ❌ EVITAR: Tipos implícitos
const exercise = { /* ... */ }
const answer = 'option-a'
```

### 2. Validação de Entrada

```typescript
// ✅ BOM: Validar antes de processar
const validateAnswer = (answer: ExerciseAnswer): boolean => {
  if (!answer) return false
  
  switch (exercise.type) {
    case 'multiple-choice':
      return typeof answer === 'string' && answer.length > 0
    case 'numeric':
      return typeof answer === 'number' && !isNaN(answer)
    // ...
  }
}

if (!validateAnswer(userAnswer)) {
  throw new Error('Resposta inválida')
}
```

### 3. Error Handling

```typescript
// ✅ BOM: Try-catch em operações assíncronas
try {
  await submissionRepository.save(submission)
} catch (error) {
  console.error('[ExerciseSubmission] Error:', error)
  setError('Erro ao salvar submissão. Tente novamente.')
  throw error
}
```

### 4. Componentes Controlados

```typescript
// ✅ BOM: Componente totalmente controlado
<MultipleChoiceExercise
  exercise={exercise}
  value={answer}             // Valor vem de fora
  onChange={setAnswer}       // Atualiza estado externo
/>

// ❌ EVITAR: Estado interno desconectado
<MultipleChoiceExercise
  exercise={exercise}
  defaultValue={answer}      // Estado interno
/>
```

### 5. Separação de Responsabilidades

```typescript
// ✅ BOM: Lógica separada da UI
const validationResult = validateExercise(exercise, answer)  // Lógica
return <ExerciseFeedback result={validationResult} />        // UI

// ❌ EVITAR: Lógica misturada com UI
return (
  <div>
    {answer === correctAnswer ? (
      <span>Correto</span>
    ) : (
      <span>Incorreto</span>
    )}
  </div>
)
```

### 6. Extensibilidade

```typescript
// ✅ BOM: Usar switch com type guards
const renderExercise = (exercise: Exercise) => {
  if (isMultipleChoiceExercise(exercise)) {
    return <MultipleChoiceExercise exercise={exercise} />
  }
  if (isNumericExercise(exercise)) {
    return <NumericExercise exercise={exercise} />
  }
  // Adicionar novos tipos aqui
}

// ❌ EVITAR: Hard-coded type checks
const renderExercise = (exercise: Exercise) => {
  if (exercise.type === 'multiple-choice') {
    return <MultipleChoiceExercise exercise={exercise as any} />
  }
}
```

### 7. Performance

```typescript
// ✅ BOM: Memoize componentes pesados
const ExerciseRenderer = React.memo<ExerciseRendererProps>(({ exercise }) => {
  // ...
})

// ✅ BOM: Debounce de auto-save
const debouncedSave = useMemo(
  () => debounce((answer) => saveDraft(answer), 1000),
  []
)
```

### 8. Acessibilidade

```tsx
// ✅ BOM: Labels e ARIA
<button
  role="radio"
  aria-checked={value === option.id}
  aria-label={`Selecionar opção: ${option.text}`}
  onClick={() => onChange(option.id)}
>
  {option.text}
</button>
```

### 9. Testes

```typescript
// ✅ BOM: Testar validadores isoladamente
describe('validateMultipleChoice', () => {
  it('should return correct result for correct answer', () => {
    const exercise: MultipleChoiceExercise = { /* ... */ }
    const answer = 'correct-option-id'
    
    const result = validateMultipleChoice(exercise, answer)
    
    expect(result.isCorrect).toBe(true)
    expect(result.score).toBe(exercise.maxScore)
  })
})
```

### 10. Documentação

```typescript
/**
 * Valida resposta de múltipla escolha.
 * 
 * @param exercise - Dados do exercício de múltipla escolha
 * @param answer - ID da opção selecionada pelo usuário
 * @returns Resultado da validação com pontuação e feedback
 * 
 * @example
 * ```ts
 * const result = validateMultipleChoice(exercise, 'option-b')
 * console.log(result.isCorrect) // true/false
 * ```
 */
export const validateMultipleChoice = (
  exercise: MultipleChoiceExercise,
  answer: string
): ExerciseValidationResult => {
  // ...
}
```

---

## 📚 Recursos Adicionais

### Arquivos de Referência

- [types/exercise.ts](../types/exercise.ts) - Todos os tipos do sistema
- [lib/constants.ts](../lib/constants.ts) - Configurações e constantes
- [lib/utils.ts](../lib/utils.ts) - Validadores e utilitários
- [repositories/apiExerciseRepository.ts](../repositories/apiExerciseRepository.ts) - Repositórios (API + Firebase)
- [hooks/useExerciseSubmission.ts](../hooks/useExerciseSubmission.ts) - Hook principal

### Padrões de Projeto Utilizados

- **Repository Pattern**: Abstração da camada de dados (API + Firebase)
- **Strategy Pattern**: Diferentes validadores por tipo
- **Dependency Injection**: Repositórios injetados em hooks
- **Factory Pattern**: Criação de exercícios (implícito)
- **Observer Pattern**: React hooks e state management

### Integração com API

Quando a API estiver disponível:

1. **Configure a URL base**:
```typescript
const exerciseRepo = new ApiExerciseRepository(process.env.VITE_API_URL)
```

2. **Adicione autenticação** (se necessário):
```typescript
// Em apiExerciseRepository.ts
async findById(exerciseId: string): Promise<Exercise | null> {
  const response = await fetch(`${this.baseUrl}/exercises/${exerciseId}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
  })
  // ...
}
```

3. **Ajuste os endpoints** conforme a API real
4. **Trate erros específicos** da API (rate limiting, etc.)

### Próximos Passos Sugeridos

1. ✅ **Implementar componentes UI** para cada tipo de exercício
2. ✅ **Criar componentes comuns** reutilizáveis (ExerciseCard, Feedback, etc.)
3. ✅ **Adicionar testes unitários** para validadores
4. ✅ **Integrar com backend** (substituir mocks por API real)
5. ✅ **Implementar editor** de exercícios para professores
6. ✅ **Analytics e métricas** de desempenho dos alunos
7. ✅ **Sistema de hints progressivos** (revelar dicas gradualmente)
8. ✅ **Gamificação** (badges, pontos, rankings)

---

## 🤝 Contribuindo

Ao adicionar novos tipos de exercícios:

1. Siga o padrão estabelecido nesta documentação
2. Adicione tipos em `types/exercise.ts`
3. Implemente validador em `lib/utils.ts` (se aplicável)
4. Crie componente em `components/exercise-types/`
5. Atualize constantes em `lib/constants.ts`
6. Adicione testes
7. Documente no README ou neste arquivo

---

> **📌 Nota**: Esta é uma estrutura base. Os componentes UI precisam ser implementados seguindo os padrões shadcn/ui e Tailwind CSS do projeto. Use os tipos e validadores fornecidos como fundação type-safe para suas implementações.
