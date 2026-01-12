import { useState, useCallback, useEffect } from 'react'
import type { StickyNote } from '@/features/sticky-notes/types'
import { STICKY_NOTE_COLORS } from '@/features/sticky-notes/types'

interface UseStickyNotesProps {
  currentPage: number
  onPageSelect?: (page: number) => void
  mainRef: React.RefObject<HTMLDivElement | null>
}

const STORAGE_KEY = 'aulapp:sticky-notes'

export const useStickyNotes = ({
  currentPage,
  onPageSelect,
  mainRef,
}: UseStickyNotesProps) => {
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as StickyNote[]
        return parsed.map((note) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }))
      }
    } catch (error) {
      console.error('Error loading sticky notes:', error)
    }
    return []
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [areNotesVisible, setAreNotesVisible] = useState(true)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stickyNotes))
    } catch (error) {
      console.error('Error saving sticky notes:', error)
    }
  }, [stickyNotes])

  const addNote = useCallback(
    (note?: Partial<StickyNote>) => {
      const newNote: StickyNote = {
        id: Date.now().toString(),
        content: note?.content || '',
        color:
          note?.color ||
          STICKY_NOTE_COLORS[
            Math.floor(Math.random() * STICKY_NOTE_COLORS.length)
          ],
        page: currentPage,
        createdAt: new Date(),
        updatedAt: new Date(),
        x: 100 + (stickyNotes.length % 5) * 20,
        y: 100 + (stickyNotes.length % 5) * 20,
        isMinimized: false,
        isPlaced: false,
      }
      setStickyNotes((prev) => [...prev, newNote])
    },
    [currentPage, stickyNotes.length]
  )

  const updateNote = useCallback((updatedNote: StickyNote) => {
    setStickyNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    )
  }, [])

  const deleteNote = useCallback((id: string) => {
    setStickyNotes((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const goToNote = useCallback(
    (note: StickyNote) => {
      if (onPageSelect && note.page !== currentPage) {
        onPageSelect(note.page)
      }

      // Scroll to note position if placed
      if (note.isPlaced && mainRef.current) {
        mainRef.current.scrollTo({
          top: (note.y || 0) - 100, // Add some padding
          left: (note.x || 0) - 100,
          behavior: 'smooth',
        })
      }
    },
    [currentPage, onPageSelect, mainRef]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const noteData = e.dataTransfer.getData('application/json')
      
      if (noteData && mainRef.current) {
        try {
          const note = JSON.parse(noteData) as StickyNote
          const rect = mainRef.current.getBoundingClientRect()

          const x = e.clientX - rect.left + mainRef.current.scrollLeft
          const y = e.clientY - rect.top + mainRef.current.scrollTop

          const existingNote = stickyNotes.find((n) => n.id === note.id)

          if (existingNote) {
            updateNote({
              ...note,
              x,
              y,
              isPlaced: true,
              isMinimized: false,
              page: currentPage,
            })
          } else {
            // New note dropped from sidebar draft
            const newNote: StickyNote = {
              ...note,
              id: Date.now().toString(), // Ensure unique ID
              x,
              y,
              isPlaced: true,
              isMinimized: false,
              page: currentPage,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
            setStickyNotes((prev) => [...prev, newNote])
          }
          setIsSidebarOpen(false)
        } catch (err) {
          console.error('Error dropping note:', err)
        }
      }
    },
    [currentPage, mainRef, stickyNotes, updateNote]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  return {
    stickyNotes,
    isSidebarOpen,
    setIsSidebarOpen,
    areNotesVisible,
    setAreNotesVisible,
    addNote,
    updateNote,
    deleteNote,
    goToNote,
    handleDrop,
    handleDragOver,
  }
}
