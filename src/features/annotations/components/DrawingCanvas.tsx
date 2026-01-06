import React, { useRef } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { Stroke, AnnotationConfig } from '../types/types'

interface DrawingCanvasProps {
  width: number
  height: number
  pageId: string
  strokes: Stroke[]
  currentConfig: AnnotationConfig
  isDrawingMode: boolean
  onStrokesChange: (strokes: Stroke[]) => void
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width,
  height,
  pageId,
  strokes,
  currentConfig,
  isDrawingMode,
  onStrokesChange,
}) => {
  const isDrawing = useRef(false)

  const handleMouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawingMode) return

    isDrawing.current = true
    const pos = e.target.getStage()?.getPointerPosition()
    if (!pos) return

    const newStroke: Stroke = {
      id: Math.random().toString(36).substr(2, 9),
      pageId,
      tool: currentConfig.tool,
      color: currentConfig.tool === 'eraser' ? '#000000' : currentConfig.color,
      width: currentConfig.strokeWidth,
      opacity: currentConfig.tool === 'eraser' ? 1 : currentConfig.opacity,
      points: [pos.x, pos.y],
      isEraser: currentConfig.tool === 'eraser',
    }

    onStrokesChange([...strokes, newStroke])
  }

  const handleMouseMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawingMode || !isDrawing.current) return

    const stage = e.target.getStage()
    const point = stage?.getPointerPosition()
    if (!point) return

    const lastStroke = strokes[strokes.length - 1]
    // Append point to the last stroke
    const newPoints = lastStroke.points.concat([point.x, point.y])

    // Update the last stroke in the array
    const updatedStrokes = [...strokes]
    updatedStrokes[strokes.length - 1] = {
      ...lastStroke,
      points: newPoints,
    }

    onStrokesChange(updatedStrokes)
  }

  const handleMouseUp = () => {
    isDrawing.current = false
  }

  // Custom Cursor Logic
  const [cursorPos, setCursorPos] = React.useState<{
    x: number
    y: number
  } | null>(null)

  const updateCursor = (e: KonvaEventObject<MouseEvent> | MouseEvent) => {
    if (!isDrawingMode) {
      setCursorPos(null)
      return
    }

    // Handle both Konva events and native events
    const x = 'evt' in e ? e.evt.clientX : (e as MouseEvent).clientX
    const y = 'evt' in e ? e.evt.clientY : (e as MouseEvent).clientY
    setCursorPos({ x, y })
  }

  React.useEffect(() => {
    if (!isDrawingMode) return

    const handleWindowMouseMove = (e: MouseEvent) => updateCursor(e)
    window.addEventListener('mousemove', handleWindowMouseMove)
    return () => window.removeEventListener('mousemove', handleWindowMouseMove)
  }, [isDrawingMode]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isDrawingMode && cursorPos && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: Math.max(currentConfig.strokeWidth, 8),
              height: Math.max(currentConfig.strokeWidth, 8),
              borderRadius: currentConfig.tool === 'marker' ? '2px' : '50%',
              border: '1px solid rgba(0,0,0,0.5)',
              backgroundColor:
                currentConfig.tool === 'eraser'
                  ? 'rgba(255,255,255,0.5)'
                  : currentConfig.color,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 2px rgba(0,0,0,0.3)',
            }}
          />
        </div>
      )}
      <Stage
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container()
          if (container) container.style.cursor = 'none'
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage()?.container()
          if (container) container.style.cursor = 'default'
          setCursorPos(null)
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: isDrawingMode ? 'auto' : 'none',
        }}
      >
        <Layer>
          {strokes.map((stroke) => (
            <Line
              key={stroke.id}
              points={stroke.points}
              stroke={stroke.color}
              strokeWidth={stroke.width}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              opacity={stroke.opacity}
              globalCompositeOperation={
                stroke.isEraser ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
    </>
  )
}
