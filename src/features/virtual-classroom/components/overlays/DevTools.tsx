import React, { useState, useRef, useEffect } from 'react'
import { Setting2 } from 'iconsax-react'

interface DevToolsProps {
  resourceType: string
  onResourceTypeChange: (type: string) => void
}

export const DevTools: React.FC<DevToolsProps> = ({
  resourceType,
  onResourceTypeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({
    x: 16,
    y: window.innerHeight - 64,
  })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, offsetX: 0, offsetY: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const newX = e.clientX - dragRef.current.offsetX
      const newY = e.clientY - dragRef.current.offsetY

      // Constrain to viewport
      const maxX = window.innerWidth - 48 // button width
      const maxY = window.innerHeight - 48 // button height

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging])

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
      }
      setIsDragging(true)
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Only toggle if not dragging (clicked in place)
    const didMove =
      Math.abs(e.clientX - dragRef.current.startX) > 5 ||
      Math.abs(e.clientY - dragRef.current.startY) > 5
    if (!didMove) {
      setIsOpen(!isOpen)
    }
  }

  if (!import.meta.env.DEV) return null

  return (
    <>
      {/* Floating Button */}
      <button
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        className="fixed z-100 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-colors"
        aria-label="DevTools"
      >
        <Setting2 size="24" variant="Bold" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-99 bg-black/20"
          />

          {/* Menu */}
          <div
            style={{
              left: `${position.x}px`,
              top: `${Math.max(0, position.y - 180)}px`, // Position above button
            }}
            className="fixed z-100 w-64 rounded-lg bg-white shadow-xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-purple-600 px-4 py-3">
              <h3 className="font-bold text-white text-sm">DevTools</h3>
            </div>
            <div className="p-4">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Tipo de Aula
              </label>
              <select
                value={resourceType}
                onChange={(e) => {
                  onResourceTypeChange(e.target.value)
                  setIsOpen(false)
                }}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="content">Conteúdo</option>
                <option value="exercise_list">Lista de Exercícios</option>
                <option value="gamified">Gamificada</option>
                <option value="assessment">Avaliação</option>
                <option value="scorm">SCORM</option>
                <option value="simulation">Simulado</option>
                <option value="material">Material de Apoio</option>
                <option value="open_ended">Resposta Aberta</option>
              </select>
            </div>
          </div>
        </>
      )}
    </>
  )
}
