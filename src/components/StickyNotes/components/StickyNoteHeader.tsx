import React from 'react'
import { Note, Minus, Trash } from 'iconsax-react'

interface StickyNoteHeaderProps {
  isMinimized: boolean
  onMinimize: () => void
  onDelete: () => void
  isActive: boolean
}

export const StickyNoteHeader: React.FC<StickyNoteHeaderProps> = ({
  isMinimized,
  onMinimize,
  onDelete,
  isActive,
}) => {
  return (
    <div
      className={`flex items-center justify-between p-2 ${
        isActive ? 'cursor-move' : 'cursor-default'
      } bg-black/5 border-b border-black/10 ${
        isMinimized ? 'rounded-lg' : 'rounded-t-lg'
      }`}
    >
      <div className="flex items-center gap-2">
        <Note size="16" color="#343A40" variant="Bold" />
        <span className="text-[#343A40] font-bold text-xs">Anotação</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onMinimize()
          }}
          className="p-1 hover:bg-black/10 rounded"
          title={isMinimized ? 'Expandir' : 'Minimizar'}
        >
          <Minus size="16" color="#343A40" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-1 hover:bg-black/10 rounded"
          title="Excluir"
        >
          <Trash size="16" color="#343A40" />
        </button>
      </div>
    </div>
  )
}
