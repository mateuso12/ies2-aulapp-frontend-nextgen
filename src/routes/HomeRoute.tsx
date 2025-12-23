import React from 'react'
import { Link } from 'react-router-dom'

/**
 * HomeRoute
 *
 * Importante:
 * - O CSS do UI Kit (`ies2-aulapp-ui-kit/style.css`) traz resets e utilitários
 *   no estilo Tailwind. Importá-lo globalmente conflita com o Tailwind do app
 *   (ex.: breakpoints sendo sobrescritos).
 * - Aqui fazemos o import APENAS na rota "/", mantendo `/sala-virtual` limpa.
 */
export function HomeRoute() {
  // Side-effect import: aplica os estilos do UI Kit apenas quando esta rota for carregada.
  // (Vite/Rollup vai criar um chunk CSS/JS separado para essa rota.)
  React.useEffect(() => {
    void import('ies2-aulapp-ui-kit/style.css')
  }, [])

  return (
    <div className="app">
      <h1>Aulapp</h1>
      <p>Aplicação educacional</p>
      <nav className="mt-4">
        <Link to="/sala-virtual" className="text-blue-400 hover:underline">
          Ir para Sala Virtual
        </Link>
      </nav>
    </div>
  )
}
