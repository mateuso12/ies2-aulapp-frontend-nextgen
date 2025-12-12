import React, { useState } from 'react'
import { Trash, ArrowRight, Edit2, TickCircle } from 'iconsax-react'
import { GripHorizontal } from 'lucide-react'
import type { StickyNote } from '../types'
import { ColorPicker } from './ColorPicker'
import { EmojiPickerButton } from './EmojiPickerButton'
import type { EmojiClickData } from 'emoji-picker-react'

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
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(note.content)
  const [editColor, setEditColor] = useState(note.color)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleSave = () => {
    onEdit({ ...note, content: editContent, color: editColor })
    setIsEditing(false)
    setShowColorPicker(false)
    setShowEmojiPicker(false)
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setEditContent((prev) => prev + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(note.content)
    setEditColor(note.color)
    setShowColorPicker(false)
    setShowEmojiPicker(false)
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 w-full border border-[#487BFF] rounded-lg p-0 shadow-sm relative bg-white">
        <div
          className="p-4 flex flex-col gap-2 transition-colors duration-200 rounded-lg relative group"
          style={{ backgroundColor: editColor }}
        >
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-transparent border-none outline-none resize-none text-[#343A40] text-sm placeholder-[#6C757D] min-h-20 cursor-text pr-6"
            autoFocus
            placeholder="Faça sua anotação"
          />

          <div className="w-full h-px bg-[#343A40]/20 my-1" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 relative">
              <ColorPicker
                selectedColor={editColor}
                onSelectColor={setEditColor}
                isOpen={showColorPicker}
                onToggle={() => {
                  setShowColorPicker(!showColorPicker)
                  setShowEmojiPicker(false)
                }}
              />

              <EmojiPickerButton
                onEmojiClick={handleEmojiClick}
                isOpen={showEmojiPicker}
                onToggle={() => {
                  setShowEmojiPicker(!showEmojiPicker)
                  setShowColorPicker(false)
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelEdit}
                className="text-[#6C757D] hover:text-red-500 transition-colors text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
                title="Salvar"
              >
                <span className="text-xs font-bold">Salvar</span>
                <TickCircle size="18" variant="Bold" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, note)}
      className="flex flex-col gap-2 w-full border border-black rounded p-0 bg-transparent overflow-hidden relative group cursor-grab active:cursor-grabbing"
    >
      {/* Drag Handle Indicator */}
      <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-100 transition-opacity cursor-grab z-10">
        <GripHorizontal size="16" color="#343A40" />
      </div>

      <div
        draggable={false}
        onDragStart={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        className="flex flex-col gap-4 p-4 w-full cursor-default"
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

        <p className="text-[#343A40] text-sm whitespace-pre-wrap wrap-break-word line-clamp-3 cursor-text">
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
          onClick={() => {
            setEditContent(note.content)
            setEditColor(note.color)
            setIsEditing(true)
          }}
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
