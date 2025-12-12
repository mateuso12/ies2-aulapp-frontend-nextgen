import React from 'react'
import { Trash, ArrowRight, Edit2 } from 'iconsax-react'
import type { StickyNote } from '../types'

interface SidebarNoteItemProps {
  note: StickyNote
  onDelete: (id: string) => void
  onDragStart: (e: React.DragEvent, note: StickyNote) => void
  onGoTo: (note: StickyNote) => void
  onEdit: (note: StickyNote) => void
}

export const SidebarNoteItem: React.FC<SidebarNoteItemProps> = ({
  note,
  onDelete,
  onDragStart,
  onGoTo,
  onEdit,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, note)}
      className="flex flex-col gap-2 w-full border border-black rounded p-0 bg-transparent overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <div
        className="flex flex-col gap-4 p-4 w-full"
        style={{ backgroundColor: note.color }}
      >
        <div className="flex justify-between items-center w-full">
          <span className="text-[#343A40] font-bold text-sm">
            Página {note.page}
          </span>
          <button
            onClick={() => onDelete(note.id)}
            className="text-[#343A40] hover:text-red-500 transition-colors"
            title="Excluir anotação"
          >
            <Trash size="16" variant="Outline" />
          </button>
        </div>

        <p className="text-[#343A40] text-sm whitespace-pre-wrap wrap-break-word line-clamp-3">
          {note.content}
        </p>
      </div>

      {/* Actions Footer */}
      <div className="flex justify-between items-center w-full px-4 pb-2 bg-transparent">
        {note.isPlaced ? (
          <button
            onClick={() => onGoTo(note)}
            className="flex items-center gap-2 group"
          >
            <span className="text-[#6C757D] text-sm group-hover:text-[#343A40]">
              Ir para anotação
            </span>
            <ArrowRight
              size="16"
              className="text-[#6C757D] group-hover:text-[#343A40]"
            />
          </button>
        ) : (
          <span className="text-[#6C757D] text-xs italic">
            Arraste para a tela
          </span>
        )}

        <button
          onClick={() => onEdit(note)}
          className="flex items-center gap-2 group"
        >
          <span className="text-[#6C757D] text-sm group-hover:text-[#343A40]">
            Editar
          </span>
          <Edit2
            size="16"
            className="text-[#6C757D] group-hover:text-[#343A40]"
          />
        </button>
      </div>
    </div>
  )
}
