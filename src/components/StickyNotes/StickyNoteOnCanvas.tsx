import React, { useState, useEffect, useRef } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { ArrowRight } from 'iconsax-react'
import type { EmojiClickData } from 'emoji-picker-react'
import type { StickyNote } from './types'
import { StickyNoteHeader } from './components/StickyNoteHeader'
import { ColorPicker } from './components/ColorPicker'
import { EmojiPickerButton } from './components/EmojiPickerButton'

interface StickyNoteOnCanvasProps {
  note: StickyNote
  onUpdate: (note: StickyNote) => void
  onDelete: (id: string) => void
  onOpenSidebar: () => void
}

export const StickyNoteOnCanvas: React.FC<StickyNoteOnCanvasProps> = ({
  note,
  onUpdate,
  onDelete,
  onOpenSidebar,
}) => {
  const [content, setContent] = useState(note.content)
  const [color, setColor] = useState(note.color)
  const [isMinimized, setIsMinimized] = useState(note.isMinimized)
  const [showEmojis, setShowEmojis] = useState(false)
  const [showColors, setShowColors] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const noteRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()

  // Sync local state with prop changes (e.g. from sidebar edits)
  useEffect(() => {
    setContent(note.content)
    setColor(note.color)
    setIsMinimized(note.isMinimized)
  }, [note.content, note.color, note.isMinimized])

  // Handle click outside to deactivate
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isInsidePopover = target.closest('[data-slot="popover-content"]')

      if (
        noteRef.current &&
        !noteRef.current.contains(target as Node) &&
        !isInsidePopover
      ) {
        setIsActive(false)
        setShowColors(false)
        setShowEmojis(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Debounce save or save on blur
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        content !== note.content ||
        color !== note.color ||
        isMinimized !== note.isMinimized
      ) {
        onUpdate({ ...note, content, color, isMinimized })
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [content, color, isMinimized, note, onUpdate])

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji)
    setShowEmojis(false)
  }

  return (
    <motion.div
      ref={noteRef}
      drag={isActive}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        onUpdate({
          ...note,
          x: (note.x || 0) + info.offset.x,
          y: (note.y || 0) + info.offset.y,
        })
      }}
      onClick={() => setIsActive(true)}
      initial={false}
      animate={{
        x: note.x || 100,
        y: note.y || 100,
        scale: 1,
        opacity: 1,
        height: isMinimized ? 'auto' : 'auto',
        width: isMinimized ? 200 : 300,
        zIndex: isActive ? 50 : 30,
        boxShadow: isActive
          ? '0px 10px 30px rgba(0,0,0,0.2)'
          : '0px 4px 10px rgba(0,0,0,0.1)',
      }}
      className={`absolute top-0 left-0 flex flex-col rounded-lg font-['Plus_Jakarta_Sans'] transition-shadow ${
        isActive ? 'ring-2 ring-[#487BFF]' : ''
      }`}
      style={{ backgroundColor: color }}
    >
      <StickyNoteHeader
        isMinimized={!!isMinimized}
        onMinimize={handleMinimize}
        onDelete={() => onDelete(note.id)}
        isActive={isActive}
        onPointerDown={(e) => {
          if (isActive) {
            dragControls.start(e)
          }
        }}
      />

      {/* Body */}
      {!isMinimized && (
        <div className="p-4 flex flex-col gap-4">
          <textarea
            onPointerDown={(e) => e.stopPropagation()}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite sua anotação aqui..."
            className="w-full h-40 bg-transparent border-none outline-none resize-none text-[#343A40] text-sm placeholder-black/40 cursor-text"
            autoFocus={isActive}
          />

          {/* Footer / Color Picker */}
          <div className="flex flex-col gap-2 pt-2 border-t border-black/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 relative">
                <ColorPicker
                  selectedColor={color}
                  onSelectColor={setColor}
                  isOpen={showColors}
                  onToggle={() => {
                    setShowColors(!showColors)
                    setShowEmojis(false)
                  }}
                />

                <EmojiPickerButton
                  onEmojiClick={onEmojiClick}
                  isOpen={showEmojis}
                  onToggle={() => {
                    setShowEmojis(!showEmojis)
                    setShowColors(false)
                  }}
                />
              </div>
              <span className="text-[10px] text-black/40">
                {content.length} chars
              </span>
            </div>

            <button
              onClick={onOpenSidebar}
              className="w-full py-1.5 bg-black/5 flex items-center justify-center gap-2 hover:bg-black/10 transition-colors rounded text-[#343A40] text-xs"
            >
              <span>Ver todas as anotações</span>
              <ArrowRight size={14} color="#343A40" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
