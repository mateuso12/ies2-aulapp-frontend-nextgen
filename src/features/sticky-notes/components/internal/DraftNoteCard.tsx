import React, { useState, useRef } from 'react'
import { ColorPicker } from './ColorPicker'
import { EmojiPickerButton } from './EmojiPickerButton'
import type { EmojiClickData } from 'emoji-picker-react'
import { GripHorizontal } from 'lucide-react'

interface DraftNoteCardProps {
  content: string
  color: string
  onContentChange: (content: string) => void
  onColorChange: (color: string) => void
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: (e: React.DragEvent) => void
  onSave: () => void
  onCancel: () => void
}

export const DraftNoteCard: React.FC<DraftNoteCardProps> = ({
  content,
  color,
  onContentChange,
  onColorChange,
  onDragStart,
  onDragEnd,
  onSave,
  onCancel,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onContentChange(content + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      e.dataTransfer.setDragImage(
        cardRef.current,
        e.clientX - rect.left,
        e.clientY - rect.top
      )
    }
    onDragStart(e)
  }

  return (
    <div
      ref={cardRef}
      className="flex flex-col gap-2 w-full border border-[#487BFF] rounded p-0 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] relative"
    >
      <div
        className="p-4 flex flex-col gap-2 transition-colors duration-200 rounded relative group"
        style={{ backgroundColor: color }}
      >
        {/* Drag Handle Indicator */}
        <div
          className="absolute top-2 right-2 opacity-30 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
          draggable
          onDragStart={handleDragStart}
          onDragEnd={onDragEnd}
        >
          <GripHorizontal size="16" color="#343A40" />
        </div>

        <textarea
          placeholder="Faça sua anotação"
          className="w-full bg-transparent border-none outline-none resize-none text-[#343A40] text-sm placeholder-[#6C757D] min-h-[60px] cursor-text pr-6 font-['Plus_Jakarta_Sans']"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          autoFocus
        />
        <div className="w-full h-px bg-[#6C757D] my-1" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 relative">
            <ColorPicker
              selectedColor={color}
              onSelectColor={onColorChange}
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
              onClick={onCancel}
              className="text-[#343A40] hover:opacity-80 transition-opacity text-sm font-normal font-['Plus_Jakarta_Sans']"
            >
              Cancelar
            </button>
            <button
              onClick={onSave}
              className="text-[#343A40] hover:opacity-80 transition-opacity text-sm font-bold font-['Plus_Jakarta_Sans']"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
