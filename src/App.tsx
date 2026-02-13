import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { VirtualClassroom } from './pages/VirtualClassroom'
import './App.css'

function App() {
  const webComponentsUrl =
    import.meta.env.VITE_WEB_COMPONENTS_URL || 'http://localhost:5174'
  const webComponentsSrc = `${webComponentsUrl.replace(/\/+$/, '')}/`

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app">
              <h1>Aulapp</h1>
              <p>Aplicação educacional</p>
              <nav className="mt-4 flex flex-col gap-2">
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
        <Route
          path="/web-components/*"
          element={
            <div className="w-full h-screen bg-white">
              <iframe
                src={webComponentsSrc}
                title="Web Components"
                className="w-full h-full border-0"
                allow="microphone"
              />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
