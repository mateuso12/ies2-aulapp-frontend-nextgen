export type ToolType = 'pen' | 'pencil' | 'eraser'

export interface Stroke {
  id: string
  pageId: string
  tool: ToolType
  color: string
  width: number
  opacity: number
  points: number[] // [x1, y1, x2, y2, ...]
  isEraser?: boolean
}

export interface AnnotationConfig {
  tool: ToolType
  color: string
  strokeWidth: number
  opacity: number
}

export const TOOL_CONFIGS: Record<
  ToolType,
  {
    defaultWidth: number
    defaultOpacity: number
    widths: { thin: number; medium: number; thick: number }
  }
> = {
  pen: {
    defaultWidth: 2,
    defaultOpacity: 1,
    widths: { thin: 2, medium: 4, thick: 6 },
  },
  pencil: {
    defaultWidth: 1,
    defaultOpacity: 0.8,
    widths: { thin: 1, medium: 2, thick: 3 },
  },
  eraser: {
    defaultWidth: 20,
    defaultOpacity: 1,
    widths: { thin: 10, medium: 20, thick: 30 },
  },
}

export const COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF246E', // Pink (Brand)
  '#487BFF', // Blue
  '#46B35E', // Green
  '#FFB800', // Yellow
  '#7E48FF', // Purple
  '#FF5A82', // Light Pink
]
