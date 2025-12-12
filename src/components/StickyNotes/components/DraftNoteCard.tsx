import React, { useState } from 'react'
import { ArrowRight } from 'iconsax-react'
import { ColorPicker } from './ColorPicker'
import { EmojiPickerButton } from './EmojiPickerButton'
import type { EmojiClickData } from 'emoji-picker-react'

interface DraftNoteCardProps {
  content: string
  color: string
  onContentChange: (content: string) => void
  onColorChange: (color: string) => void
  onClose: () => void
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: (e: React.DragEvent) => void
}

export const DraftNoteCard: React.FC<DraftNoteCardProps> = ({
  content,
  color,
  onContentChange,
  onColorChange,
  onClose,
  onDragStart,
  onDragEnd,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onContentChange(content + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  return (
    <div
      className="flex flex-col gap-2 w-full border border-[#487BFF] rounded-lg p-0 shadow-sm relative"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div
        className="p-4 flex flex-col gap-2 transition-colors duration-200 cursor-grab active:cursor-grabbing rounded-t-lg"
        style={{ backgroundColor: color }}
      >
        <textarea
          placeholder="Faça sua anotação"
          className="w-full bg-transparent border-none outline-none resize-none text-[#343A40] text-sm placeholder-[#6C757D] min-h-[60px]"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          autoFocus
        />
        <div className="w-full h-px bg-[#343A40]/20 my-1" />

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
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-2 bg-[#E0E0E0] flex items-center justify-center gap-2 hover:bg-[#d0d0d0] transition-colors rounded-b-lg"
      >
        <span className="text-[#343A40] text-sm">Ver todas as anotações</span>
        <ArrowRight size={16} color="#343A40" />
      </button>
    </div>
  )
}
