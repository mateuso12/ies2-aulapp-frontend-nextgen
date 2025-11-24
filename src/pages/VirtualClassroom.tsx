import React from 'react'
import { VirtualClassroomLayout } from '../layouts/VirtualClassroomLayout'

export const VirtualClassroom: React.FC = () => {
  return (
    <VirtualClassroomLayout>
      <div className="flex h-full w-full items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Conteúdo da Aula</h2>
          <p className="mt-4 text-gray-400">
            Área reservada para slides, vídeo ou quadro interativo.
          </p>
        </div>
      </div>
    </VirtualClassroomLayout>
  )
}
