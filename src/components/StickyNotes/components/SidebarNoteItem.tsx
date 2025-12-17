import React, { useState } from 'react'
import { Trash, Edit2, TickCircle, ArrowRight2 } from 'iconsax-react'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
      <div className="flex flex-col gap-2 w-full border border-[#487BFF] rounded p-0 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] relative bg-[#F4ECD7]">
        <div
          className="p-4 flex flex-col gap-2 transition-colors duration-200 rounded relative group"
          style={{ backgroundColor: editColor }}
        >
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-transparent border-none outline-none resize-none text-[#343A40] text-sm placeholder-[#6C757D] min-h-20 cursor-text pr-6 font-['Plus_Jakarta_Sans']"
            autoFocus
            placeholder="Faça sua anotação"
          />

          <div className="w-full h-px bg-[#6C757D] my-1" />

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

            <div className="flex items-center gap-5">
              <button
                onClick={handleCancelEdit}
                className="text-[#343A40] hover:opacity-80 transition-opacity text-sm font-normal font-['Plus_Jakarta_Sans']"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 text-[#343A40] hover:opacity-80 transition-opacity"
                title="Salvar"
              >
                <span className="text-sm font-bold font-['Plus_Jakarta_Sans']">
                  Salvar
                </span>
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
      className="flex flex-col w-full border border-black rounded p-0 overflow-hidden relative group cursor-move active:cursor-move"
      style={{ backgroundColor: note.color }}
    >
      <div className="flex flex-col gap-4 p-4 w-full cursor-default">
        <div className="flex justify-between items-center w-full relative">
          <span className="text-[#343A40] font-bold text-sm">
            Página {note.page}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="text-[#343A40] hover:bg-black/5 rounded-full p-1 transition-colors outline-none"
                title="Opções"
              >
                <MoreHorizontal size="20" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#343A40] border-[#343A40] text-white min-w-[140px] rounded-lg p-1"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(note.id)
                }}
                className="text-[#E2E2E2] focus:bg-white/10 focus:text-white cursor-pointer flex items-center gap-2"
              >
                <Trash size="20" color="#FFFFFF" variant="Linear" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p
          className="text-[#343A40] text-sm whitespace-pre-wrap wrap-break-word line-clamp-3 cursor-text font-['Plus_Jakarta_Sans']"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {note.content}
        </p>
      </div>

      {/* Actions Footer */}
      <div className="flex justify-between items-center w-full px-4 pb-4">
        <button
          onClick={() => onGoTo(note)}
          className="flex items-center leading-none gap-1 grouptext-[#343A40] hover:text-[#487BFF]"
        >
          <span className="text-sm font-['Plus_Jakarta_Sans']">
            Ir para anotação
          </span>
          <ArrowRight2 size="16" color="currentColor" />
        </button>

        <button
          onClick={() => {
            setEditContent(note.content)
            setEditColor(note.color)
            setIsEditing(true)
          }}
          className="flex items-center gap-1 group text-[#343A40] hover:text-[#487BFF]"
        >
          <span className=" text-sm font-['Plus_Jakarta_Sans']">Editar</span>
          <Edit2 size="16" color="currentColor" />
        </button>
      </div>
    </div>
  )
}
