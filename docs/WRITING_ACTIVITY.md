# Atividade de Escrita - Documentação

## 📝 Visão Geral

A **Atividade de Escrita** é um novo tipo de exercício implementado na Sala
Virtual do Aulapp. Permite que os alunos digitem respostas curtas que são
validadas automaticamente contra variações corretas pré-definidas.

## ✨ Funcionalidades

### 1. **Validação Automática**

- Suporta múltiplas variações de respostas corretas
- Validação case-insensitive (opcional)
- Remoção automática de espaços extras (opcional)
- Feedback personalizado para respostas incorretas

### 2. **Feedback Visual e Sonoro**

- ✅ **Correto**:
  - Caixa verde (#2BC779 borda, #C9F6DB fundo)
  - Ícone grande de check verde (71.711px)
  - Texto "Correto" em 32px
  - Áudio de acerto
- ❌ **Incorreto**:
  - Caixa vermelha (#EC272B borda, #FFCAD6 fundo)
  - Se houver feedback textual: exibido em textarea dentro do card vermelho
  - Se não houver feedback: ícone X vermelho + texto "Incorreto" em 32px
  - Áudio de erro

### 3. **Sistema de Tentativas**

- Suporta múltiplas tentativas (configurável)
- Botão "Tentar Novamente" com contador de tentativas restantes
- Bloqueio após esgotar as tentativas

### 4. **Comentário da Questão**

- Exibido apenas após acerto
- Inclui imagem e texto explicativo
- Disponível apenas em recursos do tipo "simulado" (gamified)
- Botão para navegar entre questão e comentário

### 5. **Limite de Caracteres**

- Limite padrão: 200 caracteres (configurável)
- Contador visual de caracteres digitados/restantes
- Bloqueio ao atingir o limite

### 6. **Progress Bar**

- Barra de progresso visual no topo
- Indica avanço através das questões (página atual / total)

## 🎨 Design

O design segue rigorosamente os Figmas especificados:

### Estado Padrão

- Caixa de resposta arredondada (border-radius: 32px)
- Borda azul (#C6D3F5) no estado padrão
- Fundo branco

### Feedback de Acerto

Baseado no design:
[Figma - Feedback Correto](https://www.figma.com/design/tCrnuOprzXMYph0xbCoqc9/NOVO-Design-System-2025?node-id=2431-45930)

- Borda verde (#2BC779)
- Fundo verde claro (#C9F6DB)
- Ícone de check circular verde (71.711px × 71.711px)
- Texto "Correto" em 32px, semibold, tracking -0.48px
- Layout: ícone + texto lado a lado, centralizados

### Feedback de Erro

Baseado no design mobile adaptado:
[Figma - Feedback Erro](https://www.figma.com/design/tCrnuOprzXMYph0xbCoqc9/NOVO-Design-System-2025?node-id=6791-69435)

- Borda vermelha (#EC272B)
- Fundo vermelho claro (#FFCAD6)
- **Com feedback textual**: Textarea dentro do card vermelho com o texto de
  feedback
- **Sem feedback textual**: Ícone X circular vermelho (71.711px × 71.711px) +
  texto "Incorreto" em 32px

### Responsividade

- Desktop: padding 24px (p-6) no card de feedback
- Mobile: padding 16px (p-4) no card de feedback
- Textarea adapta-se ao conteúdo com min-height de 100px
- Fonte do feedback: 16px no desktop, 14px no mobile

## 🔧 Como Usar

### Criando uma Atividade de Escrita

```typescript
import type { WritingExercise } from '@/features/exercises/types'

const exercicio: WritingExercise = {
  id: 'ex-writing-001',
  type: 'writing',
  title: 'Questão 1',
  description: 'Descrição da questão aqui...',

  data: {
    // Array de respostas corretas aceitas
    correctAnswers: ['República', 'república', 'REPUBLICA'],

    // Configurações opcionais
    maxCharacters: 200, // Limite de caracteres (padrão: 200)
    placeholder: 'Digite aqui', // Placeholder do input
    caseSensitive: false, // Se diferencia maiúsculas/minúsculas (padrão: false)
    trimSpaces: true, // Se remove espaços extras (padrão: true)

    // Feedback customizado para erro
    incorrectFeedback:
      'Resposta incorreta. Tente pensar no sistema político brasileiro.',
  },

  maxScore: 10,
  difficulty: 'medium',
  tags: ['história', 'brasil'],

  createdAt: new Date(),
  updatedAt: new Date(),

  // Comentário (opcional - exibido apenas após acerto)
  metadata: {
    comment: {
      title: 'Por que República?',
      content: 'Explicação detalhada aqui...',
      imageUrl: 'https://exemplo.com/imagem.jpg', // Opcional
    },
  },
}
```

### Renderizando no VirtualClassroom

O componente `WritingExercise` é renderizado automaticamente no
`VirtualClassroom.tsx` quando o tipo do exercício é `'writing'`:

```tsx
import { WritingExercise } from '@/features/exercises/components/exercise-types'
import { validateExercise } from '@/features/exercises/lib/utils'

// No componente:
;<WritingExercise
  exercise={exercise}
  value={currentAnswer}
  onChange={(answer) => handleWritingChange(exercise.id, answer)}
  readonly={isSubmitted}
  validationResult={validationResult}
  disabled={!hasAttemptsLeft}
/>
```

### Validando a Resposta

```typescript
import { validateExercise } from '@/features/exercises/lib/utils'
import { useAudioFeedback } from '@/hooks/useAudioFeedback'

const { playSuccess, playError } = useAudioFeedback()

const handleVerify = () => {
  // Valida a resposta
  const result = validateExercise(exercise, userAnswer)

  // Reproduz áudio de feedback
  if (result.isCorrect) {
    playSuccess()
  } else {
    playError()
  }

  // Processa o resultado...
}
```

## 🎵 Áudios de Feedback

### Configuração Padrão

Os áudios são carregados de:

- `/audio/success.mp3` - Som de acerto
- `/audio/error.mp3` - Som de erro

### Personalizando os Áudios

1. **Via arquivos locais:**
   - Coloque `success.mp3` e `error.mp3` na pasta `/public/audio/`

2. **Via URLs customizadas:**
   ```typescript
   const { playSuccess, playError } = useAudioFeedback({
     successAudioUrl: 'https://exemplo.com/acerto.mp3',
     errorAudioUrl: 'https://exemplo.com/erro.mp3',
     volume: 0.7, // Volume (0.0 a 1.0)
   })
   ```

### Formatos Suportados

- MP3 (.mp3) - Recomendado
- OGG (.ogg)
- WAV (.wav)

## 📦 Arquivos Criados/Modificados

### Novos Arquivos

1. **`src/features/exercises/components/exercise-types/WritingExercise.tsx`**
   - Componente UI da Atividade de Escrita

2. **`src/hooks/useAudioFeedback.ts`**
   - Hook para reproduzir áudios de feedback

3. **`public/audio/README.md`**
   - Instruções para adicionar arquivos de áudio

4. **`src/mocks/exercises.ts`** (exercício exemplo adicionado)
   - `mockExercise4` - Exemplo de WritingExercise

### Arquivos Modificados

1. **`src/features/exercises/types/exercise.ts`**
   - Tipo `WritingData` adicionado
   - Tipo `WritingAnswer` adicionado
   - Tipo `WritingExercise` adicionado
   - Type guard `isWritingExercise` adicionado

2. **`src/features/exercises/lib/constants.ts`**
   - Configuração do tipo 'writing' adicionada

3. **`src/features/exercises/lib/utils.ts`**
   - Função `validateWriting` adicionada
   - Função `validateExercise` atualizada

4. **`src/features/exercises/components/exercise-types/index.ts`**
   - Export do `WritingExercise` adicionado

5. **`src/features/exercises/index.ts`**
   - Export dos componentes adicionado

6. **`src/pages/VirtualClassroom.tsx`**
   - Suporte para renderizar WritingExercise
   - Handlers para verificação e tentativas
   - Integração com áudio de feedback
   - Suporte a comentários em recursos simulados

## 🧪 Testando

1. **Inicie o servidor de desenvolvimento:**

   ```bash
   pnpm dev
   ```

2. **Navegue até o VirtualClassroom**

3. **Acesse a página 4** (mockExercise4)

4. **Teste os cenários:**
   - Digite uma resposta correta: "República" (ou variação)
   - Digite uma resposta incorreta
   - Esgote as tentativas
   - Verifique o comentário após acerto (em modo "gamified")

## 🔄 Fluxo de Interação

```
1. Aluno digita resposta
   ↓
2. Botão "Verificar" é habilitado
   ↓
3. Aluno clica em "Verificar"
   ↓
4. Sistema valida contra variações corretas
   ↓
   ├─ ✅ Correto
   │  ├─ Caixa fica verde
   │  ├─ Toca áudio de acerto
   │  ├─ Exibe badge "Correto"
   │  └─ Mostra comentário (se em modo simulado)
   │
   └─ ❌ Incorreto
      ├─ Caixa fica vermelha
      ├─ Toca áudio de erro
      ├─ Exibe badge "Incorreto"
      ├─ Mostra feedback customizado
      └─ Exibe botão "Tentar Novamente" (se houver tentativas)
```

## 🎯 Recursos do Tipo "Simulado"

Quando `resourceType === 'gamified'`, o comentário da questão é exibido após o
acerto:

1. Seção separada com min-height de 100vh
2. Imagem em largura total (se fornecida)
3. Card azul claro com título e texto explicativo
4. Botão "Voltar para questão" com scroll suave

Para ativar:

```typescript
// No DevTools ou programaticamente
setResourceType('gamified')
```

## 📚 Referências

- **Tipos:**
  [`src/features/exercises/types/exercise.ts`](../src/features/exercises/types/exercise.ts)
- **Validação:**
  [`src/features/exercises/lib/utils.ts`](../src/features/exercises/lib/utils.ts)
- **Componente:**
  [`src/features/exercises/components/exercise-types/WritingExercise.tsx`](../src/features/exercises/components/exercise-types/WritingExercise.tsx)
- **Exemplo de Uso:**
  [`src/pages/VirtualClassroom.tsx`](../src/pages/VirtualClassroom.tsx)
- **Mock:** [`src/mocks/exercises.ts`](../src/mocks/exercises.ts)

---

**Implementado em:** 21 de janeiro de 2026  
**Baseado no design:** Figma - Nova Plataforma Aulapp (node-id: 2320-57758)
