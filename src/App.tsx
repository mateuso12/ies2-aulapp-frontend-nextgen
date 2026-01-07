import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { VirtualClassroom } from './pages/VirtualClassroom'
import { HighlightDemo } from './pages/HighlightDemo'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app">
              <h1>Aulapp</h1>
              <p>Aplicação educacional</p>
              <nav className="mt-4">
                <Link
                  to="/sala-virtual"
                  className="text-blue-400 hover:underline"
                >
                  Ir para Sala Virtual
                </Link>
                <div className="mt-2">
                  <Link
                    to="/demo-highlight"
                    className="text-blue-400 hover:underline"
                  >
                    Demo: Highlight (DOM-based)
                  </Link>
                </div>
              </nav>
            </div>
          }
        />
        <Route path="/sala-virtual" element={<VirtualClassroom />} />
        <Route path="/demo-highlight" element={<HighlightDemo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
