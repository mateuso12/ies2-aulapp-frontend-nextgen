# ies2-aulapp-frontend-nextgen

Projeto React + TypeScript configurado com Vite.

## 📁 Estrutura do Projeto

```
/src
├── /assets         # Imagens, fontes, etc.
├── /components     # Componentes de UI reutilizáveis (Button, Input, Card)
├── /features       # Componentes complexos ou de negócio (ex: /ActivityPlayer, /AnnotationSidebar)
├── /hooks          # Hooks customizados (ex: useTimer, useApi)
├── /pages          # Componentes que representam as páginas da aplicação (ex: /ContentPage)
├── /services       # Lógica de comunicação com a API
├── /styles         # Estilos globais, temas, variáveis CSS
├── /types          # Definições de tipos do TypeScript
└── /utils          # Funções utilitárias genéricas
```

## 🚀 Comandos Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Compila o projeto para produção
- `pnpm preview` - Visualiza o build de produção localmente
- `pnpm lint` - Verifica problemas de linting
- `pnpm lint:fix` - Corrige automaticamente problemas de linting
- `pnpm format` - Formata os arquivos com Prettier
- `pnpm format:check` - Verifica a formatação dos arquivos

## 🛠️ Tecnologias

- React 19.x
- TypeScript 5.x
- Vite 7.x
- ESLint + Prettier
- pnpm

## 📝 Convenções de Código

O projeto está configurado com:
- **ESLint** para análise estática de código
- **Prettier** para formatação automática
- **TypeScript** para tipagem estática
- Regras personalizadas para React e TypeScript