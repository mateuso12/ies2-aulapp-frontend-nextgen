import React from 'react'
import { TextHighlighter } from '@/features/annotations/highlighting/TextHighlighter'

type Mode = 'pencil' | 'highlight'

const DEMO_HTML = `
  <article>
    <h2>Demo: Medium-like Highlight</h2>
    <p>
      Lorem ipsum dolor sit amet, <strong>consectetur adipiscing</strong> elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
    <p>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
    <p>
      Link de exemplo: <a href="https://example.com">example.com</a>
    </p>
  </article>
`

export const HighlightDemo: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>('highlight')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base md:text-lg font-semibold">Highlight Demo</h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Selecione texto para abrir o menu flutuante.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={
                'h-11 px-4 rounded-full text-sm font-medium border transition ' +
                (mode === 'highlight'
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                  : 'bg-transparent text-slate-700 border-slate-300 hover:bg-slate-100 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-900')
              }
              onClick={() => setMode('highlight')}
              aria-label="Ativar marca-texto"
            >
              Highlight
            </button>
            <button
              type="button"
              className={
                'h-11 px-4 rounded-full text-sm font-medium border transition ' +
                (mode === 'pencil'
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                  : 'bg-transparent text-slate-700 border-slate-300 hover:bg-slate-100 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-900')
              }
              onClick={() => setMode('pencil')}
              aria-label="Ativar lápis"
            >
              Pencil
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <TextHighlighter
          documentId="demo-doc"
          contentHtml={DEMO_HTML}
          mode={mode}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        />

        <section className="mt-6 text-xs md:text-sm text-slate-500 dark:text-slate-400">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Desktop: selecione com mouse. Mobile: long-press + arraste os handles.
            </li>
            <li>
              Remover: clique com botão direito em um highlight (desktop) ou foque no highlight e pressione Delete/Backspace.
            </li>
            <li>
              Persistência: os highlights ficam salvos no localStorage (por documentId).
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}
