import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { VirtualClassroom } from './pages/VirtualClassroom'
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
              </nav>
            </div>
          }
        />
        <Route path="/sala-virtual" element={<VirtualClassroom />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
