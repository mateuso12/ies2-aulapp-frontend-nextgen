export interface StickyNote {
  id: string
  content: string
  color: string
  page: number
  createdAt: Date
  updatedAt: Date
  x?: number // Position on screen
  y?: number
  isMinimized?: boolean
  isPlaced?: boolean // Whether the note is placed on the canvas
}

export const STICKY_NOTE_COLORS = [
  '#D2EFDE', // Green
  '#FBD7E4', // Pink
  '#FFFDDD', // Yellow
  '#FFE5E6', // Light Red
  '#F4ECD7', // Beige
  '#D2E3FC', // Blue
  '#E8D2FC', // Purple
  '#FCE8D2', // Orange
]
