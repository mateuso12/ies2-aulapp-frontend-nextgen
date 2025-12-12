import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Note, SearchNormal1, AddSquare, CloseCircle } from 'iconsax-react'
import type { StickyNote } from './types'
import { STICKY_NOTE_COLORS } from './types'
import { DraftNoteCard } from './components/DraftNoteCard'
import { SidebarNoteItem } from './components/SidebarNoteItem'

interface StickyNoteSidebarProps {
  isOpen: boolean
  onClose: () => void
  notes: StickyNote[]
  onAddNote: (note?: Partial<StickyNote>) => void
  onEditNote: (note: StickyNote) => void
  onDeleteNote: (id: string) => void
  onGoToNote: (note: StickyNote) => void
  onToggleVisibility: () => void
  areNotesVisible: boolean
}

export const StickyNoteSidebar: React.FC<StickyNoteSidebarProps> = ({
  isOpen,
  onClose,
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onGoToNote,
  onToggleVisibility,
  areNotesVisible,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [newNoteContent, setNewNoteContent] = useState('')
  const [newNoteColor, setNewNoteColor] = useState(STICKY_NOTE_COLORS[0])
  const [isDraftVisible, setIsDraftVisible] = useState(false)
  const [draftId, setDraftId] = useState<string>('')

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Auto-save debounce
  useEffect(() => {
    if (!newNoteContent.trim() || !isDraftVisible) return

    const timer = setTimeout(() => {
      onAddNote({
        content: newNoteContent,
        color: newNoteColor,
      })
      setNewNoteContent('')
      setNewNoteColor(STICKY_NOTE_COLORS[0])
      setIsDraftVisible(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [newNoteContent, newNoteColor, isDraftVisible, onAddNote])

  // Generate draft ID when opening draft
  useEffect(() => {
    if (isDraftVisible) {
      setDraftId(Date.now().toString())
    }
  }, [isDraftVisible])

  const handleDragStart = (e: React.DragEvent, note: StickyNote) => {
    e.dataTransfer.setData('application/json', JSON.stringify(note))
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDraftDragStart = (e: React.DragEvent) => {
    const draftNote: Partial<StickyNote> = {
      id: draftId,
      content: newNoteContent,
      color: newNoteColor,
      isPlaced: false,
    }
    e.dataTransfer.setData('application/json', JSON.stringify(draftNote))
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDraftDragEnd = (e: React.DragEvent) => {
    if (e.dataTransfer.dropEffect !== 'none') {
      // Successfully dropped
      setNewNoteContent('')
      setNewNoteColor(STICKY_NOTE_COLORS[0])
      setIsDraftVisible(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -350, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -350, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 h-full w-[350px] bg-[#EFEFEF] shadow-[1px_0px_26.8px_0px_rgba(0,0,0,0.25)] z-40 flex flex-col gap-6 p-4 rounded-r-lg font-['Plus_Jakarta_Sans']"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between w-full">
            <button
              onClick={onToggleVisibility}
              className={`w-12 h-7 rounded-full relative transition-colors cursor-pointer ${
                areNotesVisible ? 'bg-[#FF246E]' : 'bg-gray-300'
              }`}
              title="Exibir/Ocultar anotações na tela"
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${
                  areNotesVisible ? 'left-6' : 'left-1'
                }`}
              />
            </button>

            <button
              onClick={onClose}
              className="text-[#343A40] hover:text-red-500 transition-colors cursor-pointer"
            >
              <CloseCircle size="24" variant="Outline" color="currentColor" />
            </button>
          </div>

          {/* Title */}
          <div className="flex items-center gap-2">
            <Note size="24" color="#343A40" variant="Outline" />
            <span className="text-[#343A40] font-bold text-xl">Anotações</span>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 px-2.5 py-1.5 bg-white border border-[#343A40] rounded-lg w-full h-10">
              <SearchNormal1 size="16" color="#343A40" />
              <input
                type="text"
                placeholder="Buscar anotações"
                className="bg-transparent border-none outline-none text-sm text-[#6C757D] w-full placeholder-[#6C757D]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={() => setIsDraftVisible(!isDraftVisible)}
              className="flex items-center justify-center gap-2 w-full h-10 bg-[#FF246E] border border-[#343A40] rounded-full text-white font-bold text-base hover:bg-[#e01b5e] transition-colors cursor-pointer"
            >
              <AddSquare size="24" color="#FFFFFF" variant="Outline" />
              <span>Nova</span>
            </button>

            {/* New Note Card (Draft) */}
            <AnimatePresence>
              {isDraftVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="w-full"
                >
                  <DraftNoteCard
                    content={newNoteContent}
                    color={newNoteColor}
                    onContentChange={setNewNoteContent}
                    onColorChange={setNewNoteColor}
                    onDragStart={handleDraftDragStart}
                    onDragEnd={handleDraftDragEnd}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notes List */}
          <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {filteredNotes.map((note) => (
              <SidebarNoteItem
                key={note.id}
                note={note}
                onDelete={onDeleteNote}
                onDragStart={handleDragStart}
                onGoTo={onGoToNote}
                onEdit={onEditNote}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
