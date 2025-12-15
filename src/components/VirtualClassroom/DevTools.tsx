import React from 'react'

interface DevToolsProps {
  resourceType: string
  onResourceTypeChange: (type: string) => void
}

export const DevTools: React.FC<DevToolsProps> = ({
  resourceType,
  onResourceTypeChange,
}) => {
  if (!import.meta.env.DEV) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 p-2 rounded-lg text-white text-xs">
      <label className="block mb-1 font-bold">DevTools: Resource Type</label>
      <select
        value={resourceType}
        onChange={(e) => onResourceTypeChange(e.target.value)}
        className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white w-full"
      >
        <option value="content">Conteúdo</option>
        <option value="exercise_list">Lista de Exercícios</option>
        <option value="gamified">Gamificada</option>
        <option value="assessment">Avaliação</option>
        <option value="scorm">SCORM</option>
        <option value="simulation">Simulado</option>
        <option value="material">Material de Apoio</option>
      </select>
    </div>
  )
}
