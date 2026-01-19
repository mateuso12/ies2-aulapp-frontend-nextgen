# 📚 Guia do Desenvolvedor - Aulapp Frontend Nextgen

> Documentação técnica para desenvolvedores que irão contribuir com o repositório.

---

## 📖 Sumário

1. [Visão Geral do Projeto](#-visão-geral-do-projeto)
2. [Stack Tecnológica](#-stack-tecnológica)
3. [Arquitetura e Estrutura de Pastas](#-arquitetura-e-estrutura-de-pastas)
4. [Padrões de Código](#-padrões-de-código)
5. [Features Principais](#-features-principais)
6. [Componentes UI](#-componentes-ui)
7. [Hooks Customizados](#-hooks-customizados)
8. [Sistema de Estilos](#-sistema-de-estilos)
9. [Internacionalização (i18n)](#-internacionalização-i18n)
9. [Firebase e Persistência](#-firebase-e-persistência)
10. [PWA e Service Workers](#-pwa-e-service-workers)
11. [Fluxo de Desenvolvimento](#-fluxo-de-desenvolvimento)
12. [Boas Práticas](#-boas-práticas)

---

## 🎯 Visão Geral do Projeto

O **Aulapp** é uma aplicação educacional frontend desenvolvida para fornecer uma experiência de sala de aula virtual rica e interativa. A aplicação suporta:

- 📝 **Anotações por desenho** sobre o conteúdo
- 🖍️ **Highlights de texto** no estilo Medium
- 📌 **Sticky notes** (post-its) para anotações rápidas
- 📖 **Modo leitura imersiva** para dispositivos mobile
- 🔖 **Sistema de bookmarks** para navegação rápida
- 🌐 **Multi-idiomas** (pt-BR, en)
- 📱 **PWA** com suporte offline

---

## 🛠 Stack Tecnológica

### Core
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 19.x | Biblioteca UI |
| **TypeScript** | 5.9 | Tipagem estática |
| **Vite** | 7.x | Build tool |
| **pnpm** | - | Gerenciador de pacotes |

### UI e Estilização
| Tecnologia | Propósito |
|------------|-----------|
| **Tailwind CSS** | 4.x - Utility-first CSS |
| **shadcn/ui** | Componentes acessíveis (estilo new-york) |
| **Radix UI** | Primitivos de UI headless |
| **Framer Motion** | Animações e transições |
| **Lucide React** | Biblioteca de ícones |
| **Iconsax React** | Ícones adicionais |

### Funcionalidades Específicas
| Biblioteca | Propósito |
|------------|-----------|
| **Konva / React-Konva** | Canvas para desenhos |
| **xpath-range** | Serialização de seleções de texto |
| **html-react-parser** | Parsing de HTML para React |
| **Swiper** | Carrosséis e sliders |
| **emoji-picker-react** | Seletor de emojis |
| **Vaul** | Componentes Drawer |

### Internacionalização
| Biblioteca | Propósito |
|------------|-----------|
| **i18next** | Core i18n |
| **react-i18next** | Bindings React |
| **i18next-browser-languagedetector** | Detecção automática de idioma |

### Firebase
| Biblioteca | Propósito |
|------------|-----------|
| **firebase** | SDK do Firebase (Realtime Database) |

### Dev Tools
| Ferramenta | Propósito |
|------------|-----------|
| **ESLint** | Linting |
| **Prettier** | Formatação |
| **vite-plugin-pwa** | PWA com Workbox |

---

## 📁 Arquitetura e Estrutura de Pastas

```
src/
├── components/           # Componentes UI reutilizáveis
│   └── ui/              # shadcn/ui components
│       ├── accordion.tsx
│       ├── card.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── popover.tsx
│       └── sheet.tsx
│
├── features/            # Feature modules (domínios de negócio)
│   ├── annotations/     # Sistema de anotações por desenho
│   │   ├── components/  # DrawingCanvas, WritingToolbar
│   │   ├── highlighting/ # Sistema de highlights de texto
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── repositories/
│   │   │   └── types/
│   │   └── types/
│   │
│   ├── sticky-notes/    # Sistema de post-its
│   │   ├── components/
│   │   │   ├── internal/  # Componentes internos
│   │   │   └── ...
│   │   └── types/
│   │
│   └── virtual-classroom/ # Sala virtual
│       ├── components/
│       │   ├── content/   # Paper, PageReel, ClassroomModules
│       │   ├── layout/
│       │   ├── overlays/
│       │   └── ui/        # Timer, RedoCounter
│       ├── hooks/
│       └── types/
│
├── hooks/               # Hooks customizados globais
│   ├── useAnnotations.ts
│   ├── useAutoHideBars.ts
│   ├── useImmersiveReadingMode.ts
│   ├── useMediaQuery.ts
│   └── useStickyNotes.ts
│
├── layouts/             # Layouts de página
│   └── VirtualClassroomLayout/
│       ├── index.tsx
│       ├── ContentSection.tsx
│       ├── FooterSection.tsx
│       ├── HeaderSection.tsx
│       ├── FloatingButtons.tsx
│       ├── SidebarsSection.tsx
│       └── types.ts
│
├── lib/                 # Utilitários
│   └── utils.ts         # cn() helper para classes
│
├── mocks/               # Dados mock para desenvolvimento
│   ├── courseModules.ts
│   └── virtualClassroomContent.ts
│
├── pages/               # Páginas da aplicação
│   └── VirtualClassroom.tsx
│
├── routes/              # Configuração de rotas
│   └── HomeRoute.tsx
│
├── services/            # Serviços externos
│   ├── i18n.ts          # Configuração i18n
│   └── firebase.ts      # Configuração Firebase
│
├── styles/              # Estilos globais
│
├── types/               # Types globais
│   ├── pwa.d.ts
│   └── xpath-range.d.ts
│
└── utils/               # Funções utilitárias
```

### Padrão Feature-Based

O projeto utiliza uma arquitetura **feature-based**, onde cada domínio de negócio é organizado como um módulo independente dentro de `features/`. Cada feature possui:

- `components/` - Componentes React específicos
- `hooks/` - Hooks customizados da feature
- `types/` - TypeScript interfaces e types
- `lib/` - Utilitários e funções auxiliares
- `repositories/` - Camada de persistência (quando aplicável)
- `index.ts` - Barrel exports

#### Exemplo: Feature `annotations/highlighting`

```typescript
// src/features/annotations/highlighting/index.ts
export { TextHighlighter } from './components/TextHighlighter'
export { useTextHighlighter } from './hooks/useTextHighlighter'
export type { Highlight, HighlightColor } from './types/highlight'
```

---

## 📝 Padrões de Código

### Convenções de Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `DrawingCanvas.tsx` |
| Hooks | camelCase com prefixo `use` | `useAnnotations.ts` |
| Types/Interfaces | PascalCase | `HighlightAnchor` |
| Constantes | SCREAMING_SNAKE_CASE | `STICKY_NOTE_COLORS` |
| Funções | camelCase | `rangeToAnchor()` |
| Arquivos de tipos | lowercase | `types.ts`, `highlight.ts` |

### TypeScript

```typescript
// ✅ Correto: Interfaces para objetos
export interface StickyNote {
  id: string
  content: string
  color: string
  page: number
  createdAt: Date
}

// ✅ Correto: Types para unions/aliases
export type ToolType = 'pen' | 'pencil' | 'eraser'
export type HighlightColor = 'yellow' | 'blue' | 'green' | 'pink'

// ✅ Correto: DTOs para operações de API
export type CreateHighlightDTO = Omit<Highlight, 'id' | 'createdAt' | 'updatedAt'>
```

### Componentes React

```tsx
// ✅ Padrão de componente funcional
import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={cn('bg-card rounded-xl p-6', className)}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

### Barrel Exports

Cada pasta de componentes/features deve ter um `index.ts`:

```typescript
// src/features/annotations/components/index.ts
export { DrawingArea } from './DrawingArea'
export { DrawingCanvas } from './DrawingCanvas'
export { WritingToolbar } from './WritingToolbar'
```

### Imports com Alias

Use sempre o alias `@/` para imports absolutos:

```typescript
// ✅ Correto
import { useAnnotations } from '@/hooks/useAnnotations'
import { cn } from '@/lib/utils'
import type { Highlight } from '@/features/annotations/highlighting'

// ❌ Evitar
import { useAnnotations } from '../../../hooks/useAnnotations'
```

---

## 🔧 Features Principais

### 1. Sistema de Anotações por Desenho

Permite ao usuário desenhar sobre o conteúdo usando canvas Konva.

**Arquivos principais:**
- [src/features/annotations/components/DrawingCanvas.tsx](src/features/annotations/components/DrawingCanvas.tsx) - Canvas de desenho
- [src/features/annotations/components/WritingToolbar.tsx](src/features/annotations/components/WritingToolbar.tsx) - Barra de ferramentas
- [src/hooks/useAnnotations.ts](src/hooks/useAnnotations.ts) - Hook de gerenciamento

**Tipos:**
```typescript
type ToolType = 'pen' | 'pencil' | 'eraser'

interface Stroke {
  id: string
  pageId: string
  tool: ToolType
  color: string
  width: number
  opacity: number
  points: number[] // [x1, y1, x2, y2, ...]
  isEraser?: boolean
}
```

**Persistência:** LocalStorage com chave `annotations-{userId}-{pageId}`

---

### 2. Sistema de Highlights de Texto

Sistema estilo Medium para destacar texto com cores.

**Arquitetura:**
```
highlighting/
├── components/
│   ├── TextHighlighter.tsx    # Componente principal
│   └── HighlightMenus.tsx     # Menus flutuantes
├── hooks/
│   └── useTextHighlighter.ts  # Lógica de seleção e persistência
├── lib/
│   ├── xpathRange.ts          # Serialização XPath
│   ├── textQuote.ts           # Extração de texto/contexto
│   ├── textQuoteFallback.ts   # Fallback para recuperação
│   └── applyHighlights.ts     # Aplicação no DOM
├── repositories/
│   ├── highlightRepository.ts # Interface
│   └── localStorageHighlightRepository.ts
└── types/
    └── highlight.ts
```

**Tipos principais:**
```typescript
type HighlightColor = 'yellow' | 'blue' | 'green' | 'pink'

interface Highlight {
  id: string
  color: HighlightColor
  xpathStart: string
  xpathEnd: string
  startOffset: number
  endOffset: number
  exactText: string
  prefix?: string
  suffix?: string
  documentId: string
  createdAt: string
}
```

**Uso:**
```tsx
<TextHighlighter
  documentId={`page-${pageId}`}
  contentHtml={htmlContent}
  disabled={isOtherToolActive}
/>
```

---

### 3. Sistema de Sticky Notes

Post-its arrastáveis com suporte a emojis e cores.

**Componentes:**
- `StickyNoteOnCanvas` - Nota posicionável no canvas
- `StickyNoteSidebar` - Lista de notas na sidebar
- Internos: `ColorPicker`, `EmojiPickerButton`, `StickyNoteHeader`

**Tipos:**
```typescript
interface StickyNote {
  id: string
  content: string
  color: string
  page: number
  createdAt: Date
  updatedAt: Date
  x?: number
  y?: number
  isMinimized?: boolean
  isPlaced?: boolean
}

const STICKY_NOTE_COLORS = [
  '#D2EFDE', '#FBD7E4', '#FFFDDD', '#FFE5E6',
  '#F4ECD7', '#D2E3FC', '#E8D2FC', '#FCE8D2'
]
```

**Hook:**
```typescript
const {
  stickyNotes,
  isSidebarOpen,
  setIsSidebarOpen,
  areNotesVisible,
  setAreNotesVisible,
  addNote,
  updateNote,
  deleteNote,
  goToNote,
  handleDrop,
  handleDragOver,
} = useStickyNotes({ currentPage, onPageSelect, mainRef })
```

---

### 4. Layout da Sala Virtual

O `VirtualClassroomLayout` é o layout principal que orquestra todos os elementos.

**Props:**
```typescript
interface VirtualClassroomLayoutProps {
  children: ReactNode | ((props: { isOtherToolActive: boolean }) => ReactNode)
  variant?: 'default' | 'gamified'
  resourceType?: 'content' | 'exercise_list' | 'gamified' | 'assessment' | ...
  currentPage?: number
  totalPages?: number
  pages?: PageData[]
  bookmarks?: number[]
  onNext?: () => void
  onPrevious?: () => void
  onPageSelect?: (page: number) => void
  onToggleBookmark?: (page: number) => void
}
```

**Seções:**
- `HeaderSection` - Cabeçalho com navegação e menus
- `FooterSection` - Footer com paginação e controles
- `ContentSection` - Área principal de conteúdo
- `SidebarsSection` - Sidebars de bookmarks e sticky notes
- `FloatingButtons` - Botões flutuantes para ações rápidas

---

## 🎨 Componentes UI

### shadcn/ui

O projeto usa **shadcn/ui** com o estilo **new-york**. Componentes são instalados diretamente em `src/components/ui/`.

**Configuração:** `components.json`
```json
{
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

**Adicionando novos componentes:**
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
```

### UI Kit Interno

O projeto também utiliza um **UI Kit interno**: `ies2-aulapp-ui-kit`

```tsx
// main.tsx
import 'ies2-aulapp-ui-kit/style.css'
```

---

## 🪝 Hooks Customizados

### `useAnnotations`
Gerencia strokes de desenho por página.

```typescript
const {
  strokes,        // Stroke[]
  setStrokes,     // Dispatch<SetStateAction<Stroke[]>>
  config,         // AnnotationConfig
  setConfig,      // Dispatch<SetStateAction<AnnotationConfig>>
  isVisible,      // boolean
  setIsVisible,   // Dispatch<SetStateAction<boolean>>
  clearStrokes,   // () => void
} = useAnnotations(pageId, userId)
```

### `useAutoHideBars`
Controla a auto-ocultação de header/footer.

```typescript
const { isRevealed } = useAutoHideBars({
  enabled: boolean,
  edgePx?: number,          // Pixels da borda para revelar
  hideDelayMs?: number,     // Delay antes de ocultar
  lockVisible?: boolean,    // Força visibilidade
  isHeaderHovered: boolean,
  isFooterHovered: boolean,
  isFooterInteracting: boolean,
})
```

### `useImmersiveReadingMode`
Modo leitura para mobile (toggle tap no centro da tela).

```typescript
const {
  isUiHidden,    // boolean
  overlayProps,  // { onPointerUp: handler }
  reveal,        // () => void
  hide,          // () => void
  toggle,        // () => void
} = useImmersiveReadingMode({
  enabled: boolean,
  lockVisible?: boolean,
  isBusy?: boolean,
  centerBandRatio?: number,  // Fração da tela considerada centro
})
```

### `useMediaQuery`
Hook para media queries responsivas.

```typescript
const isMobile = useMediaQuery('(max-width: 768px)')
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
```

### `useStickyNotes`
Gerenciamento completo de sticky notes.

```typescript
const {
  stickyNotes,
  isSidebarOpen, setIsSidebarOpen,
  areNotesVisible, setAreNotesVisible,
  addNote,
  updateNote,
  deleteNote,
  goToNote,
  handleDrop, handleDragOver,
} = useStickyNotes({ currentPage, onPageSelect, mainRef })
```

---

## 🎨 Sistema de Estilos

### Tailwind CSS 4.x

O projeto usa a última versão do Tailwind com a nova sintaxe CSS-first.

**Arquivo principal:** `src/index.css`

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@source "../node_modules/ies2-aulapp-ui-kit/dist";

@custom-variant dark (&:is(.dark *));

@theme {
  --font-baloo: 'Baloo Bhaijaan 2', cursive;
  --font-sans: 'Plus Jakarta Sans', sans-serif;
}
```

### CSS Variables (Design Tokens)

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --secondary: oklch(0.97 0 0);
  --muted: oklch(0.97 0 0);
  --accent: oklch(0.97 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  /* ... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... */
}
```

### Função `cn()` para Classes

```typescript
import { cn } from '@/lib/utils'

// Combina classes condicionalmente
<div className={cn(
  'base-class',
  isActive && 'active-class',
  variant === 'primary' ? 'bg-primary' : 'bg-secondary'
)} />
```

### Classes de Highlight

```css
.highlight-yellow { @apply bg-yellow-200/60 dark:bg-yellow-800/60; }
.highlight-blue { @apply bg-blue-200/60 dark:bg-blue-800/60; }
.highlight-green { @apply bg-green-200/60 dark:bg-green-800/60; }
.highlight-pink { @apply bg-pink-200/60 dark:bg-pink-800/60; }
```

---

## 🌐 Internacionalização (i18n)

### Configuração

**Arquivo:** `src/services/i18n.ts`

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: { /* ... */ } },
      'pt-BR': { common: { /* ... */ } },
    },
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',
    defaultNS: 'common',
  })
```

### Uso em Componentes

```tsx
import { useTranslation } from 'react-i18next'

const Component = () => {
  const { t, i18n } = useTranslation()
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        {t('change_language')}
      </button>
    </div>
  )
}
```

---

## 🔥 Firebase e Persistência

O projeto utiliza **Firebase Realtime Database** para persistir anotações dos usuários.

### Ambientes Configurados

- **local** - Desenvolvimento local (aulapp-local)
- **development** - Ambiente de desenvolvimento (aulapp-development)
- **homologation** - Ambiente de homologação (aulapp-homologation)
- **production** - Ambiente de produção (appsys-d56e1)

### Configuração Inicial

1. Copie o arquivo de ambiente desejado:

```bash
# Para desenvolvimento local (padrão)
cp .env.local .env.local

# Para outros ambientes
cp .env.development .env.local
cp .env.homologation .env.local
cp .env.production .env.local
```

2. O Firebase é inicializado automaticamente em `src/services/firebase.ts`

### Estrutura dos Dados

```
/nextgen-frontend/
  ├── annotations/{userId}/{pageId}/strokes[]
  ├── highlights/{userId}/{documentId}/highlights[]
  └── sticky-notes/{userId}/notes[]
```

### Uso no Código

```typescript
import { firebaseDatabase } from '@/services/firebase'
import { ref, set, get } from 'firebase/database'

// Salvar dados
const dataRef = ref(firebaseDatabase, 'nextgen-frontend/annotations/user123/page-1')
await set(dataRef, data)

// Ler dados
const snapshot = await get(dataRef)
if (snapshot.exists()) {
  const data = snapshot.val()
}
```

**Documentação completa:** Veja [FIREBASE.md](../FIREBASE.md) para detalhes completos sobre configuração e uso.

---

## 📱 PWA e Service Workers

### Configuração

O PWA é configurado via `vite-plugin-pwa` em `vite.config.ts`:

```typescript
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Aulapp',
    short_name: 'Aulapp',
    start_url: '/',
    display: 'standalone',
    theme_color: '#667eea',
    icons: [/* ... */],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      {
        urlPattern: /.*\.(?:png|jpg|jpeg|svg|webp|gif)/,
        handler: 'CacheFirst',
        // ...
      },
      {
        urlPattern: /https?:.*\/(api)\//,
        handler: 'NetworkFirst',
        // ...
      },
    ],
  },
})
```

### Registro do Service Worker

```typescript
// main.tsx
import { registerSW } from 'virtual:pwa-register'
registerSW({ immediate: true })
```

---

## 🔄 Fluxo de Desenvolvimento

### Comandos Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento

# Build
pnpm build            # Compila para produção (tsc + vite build)
pnpm preview          # Preview do build de produção

# Qualidade de Código
pnpm lint             # Verifica linting
pnpm lint:fix         # Corrige problemas de linting
pnpm format           # Formata código com Prettier
pnpm format:check     # Verifica formatação
```

### Fluxo de Trabalho Recomendado

1. **Antes de começar:**
   ```bash
   pnpm install
   pnpm dev
   ```

2. **Antes de commit:**
   ```bash
   pnpm lint:fix
   pnpm format
   ```

3. **Antes de PR:**
   ```bash
   pnpm build  # Verifica se compila sem erros
   ```

---

## ✅ Boas Práticas

### 1. Organização de Features

```typescript
// ✅ Crie um barrel export
// src/features/my-feature/index.ts
export { MyComponent } from './components/MyComponent'
export { useMyHook } from './hooks/useMyHook'
export type { MyType } from './types'
```

### 2. Componentes Internos

```
components/
├── index.ts           # Exports públicos
├── MyComponent.tsx    # Componente principal
└── internal/          # Componentes não exportados
    ├── SubComponent.tsx
    └── Helper.tsx
```

### 3. Tipagem Estrita

```typescript
// ✅ Evite `any`
// eslint: '@typescript-eslint/no-explicit-any': 'warn'

// ✅ Use tipos explícitos em props
interface Props {
  onSave: (data: SaveData) => void  // Não usar Function
}
```

### 4. Hooks com Prefixo `use`

```typescript
// ✅ Correto
export function useTextHighlighter(options: Options) { }

// ❌ Evitar
export function textHighlighter(options: Options) { }
```

### 5. Constantes Exportadas

```typescript
// ✅ Constantes com SCREAMING_SNAKE_CASE
export const TOOL_CONFIGS: Record<ToolType, Config> = { }
export const STICKY_NOTE_COLORS = ['#D2EFDE', '#FBD7E4', ...]
```

### 6. Persistência Local

```typescript
// Padrão de chave: namespace:feature:id
const STORAGE_KEY = 'aulapp:sticky-notes'
const highlightKey = `aulapp:highlights:${documentId}`
const annotationKey = `annotations-${userId}-${pageId}`
```

### 7. Event Handlers

```typescript
// ✅ Prefixo on para props, handle para implementação
interface Props {
  onSave: (data: Data) => void
}

const handleSave = () => {
  // lógica
  onSave(data)
}
```

### 8. Lazy Loading e Code Splitting

```typescript
// Para features grandes, considere lazy loading
const VirtualClassroom = lazy(() => import('@/pages/VirtualClassroom'))
```

---

## 📚 Recursos Adicionais

### Documentação das Bibliotecas

- [React 19 Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React-Konva](https://konvajs.org/docs/react/)
- [i18next](https://www.i18next.com/)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)

### Estrutura de Types Globais

```
src/types/
├── pwa.d.ts           # Types para virtual:pwa-register
└── xpath-range.d.ts   # Types para biblioteca xpath-range
```

---

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch para sua feature: `git checkout -b feature/nome-da-feature`
3. Faça commits semânticos: `feat:`, `fix:`, `docs:`, `refactor:`
4. Execute lint e format antes do PR
5. Abra um Pull Request com descrição clara

---

> **Nota:** Esta documentação é um guia vivo. Atualize-a conforme o projeto evolui.
