import { useState, useCallback, useEffect } from 'react'
import type { StickyNote } from '@/features/sticky-notes/types'
import { STICKY_NOTE_COLORS } from '@/features/sticky-notes/types'
import { createFirebaseStickyNoteRepository } from '@/features/sticky-notes/repositories'

interface UseFirebaseStickyNotesProps {
  currentPage: number
  onPageSelect?: (page: number) => void
  mainRef: React.RefObject<HTMLDivElement | null>
  userId: string | null
}

/**
 * Hook para gerenciar sticky notes usando Firebase
 */
export const useFirebaseStickyNotes = ({
  currentPage,
  onPageSelect,
  mainRef,
  userId,
}: UseFirebaseStickyNotesProps) => {
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [areNotesVisible, setAreNotesVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Carrega sticky notes do Firebase
  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    const loadNotes = async () => {
      setIsLoading(true)

      try {
        const repository = createFirebaseStickyNoteRepository(userId)
        const notes = await repository.findAll()
        setStickyNotes(notes)
      } catch (error) {
        console.error('[useFirebaseStickyNotes] Error loading notes:', error)
        setStickyNotes([])
      } finally {
        setIsLoading(false)
      }
    }

    loadNotes()
  }, [userId])

  // Salva sticky notes no Firebase quando mudam
  useEffect(() => {
    if (!userId || isLoading) return

    const saveNotes = async () => {
      try {
        const repository = createFirebaseStickyNoteRepository(userId)
        await repository.saveAll(stickyNotes)
      } catch (error) {
        console.error('[useFirebaseStickyNotes] Error saving notes:', error)
      }
    }

    // Debounce para evitar muitas escritas
    const timeoutId = setTimeout(saveNotes, 500)
    return () => clearTimeout(timeoutId)
  }, [stickyNotes, userId, isLoading])

  const addNote = useCallback(
    (note?: Partial<StickyNote>) => {
      const newNote: StickyNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
      prev.map((n) =>
        n.id === updatedNote.id
          ? { ...updatedNote, updatedAt: new Date() }
          : n
      )
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
          top: (note.y || 0) - 100,
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
              id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    isLoading,
  }
}
