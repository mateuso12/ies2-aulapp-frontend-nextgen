import React, { useRef, useCallback, useEffect } from 'react'
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
  const lastPoint = useRef<{ x: number; y: number } | null>(null)

  // Prevent default touch behaviors when in drawing mode
  useEffect(() => {
    if (!isDrawingMode) return

    const preventTouchDefaults = (e: TouchEvent) => {
      // Only prevent if we're actually drawing on the canvas
      if (isDrawing.current) {
        e.preventDefault()
      }
    }

    // Prevent scroll/zoom while drawing
    document.addEventListener('touchmove', preventTouchDefaults, { passive: false })
    
    return () => {
      document.removeEventListener('touchmove', preventTouchDefaults)
    }
  }, [isDrawingMode])

  // Get pointer position with touch support and smoothing
  const getPointerPosition = useCallback((e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage()
    if (!stage) return null

    const pos = stage.getPointerPosition()
    if (!pos) return null

    // Apply basic smoothing for touch input
    if (lastPoint.current) {
      const smoothingFactor = 0.3
      return {
        x: lastPoint.current.x + (pos.x - lastPoint.current.x) * smoothingFactor,
        y: lastPoint.current.y + (pos.y - lastPoint.current.y) * smoothingFactor,
      }
    }

    return pos
  }, [])

  const handleDrawStart = useCallback((e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawingMode) return

    // Prevent default touch behavior
    if ('evt' in e && e.evt.type.startsWith('touch')) {
      e.evt.preventDefault()
    }

    isDrawing.current = true
    const pos = e.target.getStage()?.getPointerPosition()
    if (!pos) return

    lastPoint.current = pos

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
  }, [isDrawingMode, pageId, currentConfig, strokes, onStrokesChange])

  const handleDrawMove = useCallback((e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawingMode || !isDrawing.current) return

    // Prevent default touch behavior
    if ('evt' in e && e.evt.type.startsWith('touch')) {
      e.evt.preventDefault()
    }

    const pos = getPointerPosition(e)
    if (!pos) return

    lastPoint.current = pos

    const lastStroke = strokes[strokes.length - 1]
    if (!lastStroke) return

    // Distance threshold to reduce excessive points (improves performance)
    const lastX = lastStroke.points[lastStroke.points.length - 2]
    const lastY = lastStroke.points[lastStroke.points.length - 1]
    const distance = Math.sqrt(Math.pow(pos.x - lastX, 2) + Math.pow(pos.y - lastY, 2))
    
    // Skip points that are too close (less than 2px apart)
    if (distance < 2) return

    const newPoints = lastStroke.points.concat([pos.x, pos.y])

    const updatedStrokes = [...strokes]
    updatedStrokes[strokes.length - 1] = {
      ...lastStroke,
      points: newPoints,
    }

    onStrokesChange(updatedStrokes)
  }, [isDrawingMode, strokes, onStrokesChange, getPointerPosition])

  const handleDrawEnd = useCallback(() => {
    isDrawing.current = false
    lastPoint.current = null
  }, [])

  // Custom Cursor Logic (desktop only)
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

  // Detect if touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  return (
    <>
      {/* Custom cursor - only show on non-touch devices */}
      {isDrawingMode && cursorPos && !isTouchDevice && (
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
              borderRadius: currentConfig.tool === 'pencil' ? '2px' : '50%',
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
        onMouseDown={handleDrawStart}
        onMousemove={handleDrawMove}
        onMouseup={handleDrawEnd}
        onTouchStart={handleDrawStart}
        onTouchMove={handleDrawMove}
        onTouchEnd={handleDrawEnd}
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container()
          if (container && !isTouchDevice) container.style.cursor = 'none'
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
          touchAction: isDrawingMode ? 'none' : 'auto', // Disable browser touch handling when drawing
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
