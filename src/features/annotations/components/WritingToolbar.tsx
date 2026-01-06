import React from 'react'
import { motion } from 'framer-motion'
import { COLORS, TOOL_CONFIGS } from '../types/types'
import type { ToolType, AnnotationConfig } from '../types/types'

interface WritingToolbarProps {
  currentConfig: AnnotationConfig
  onConfigChange: (config: AnnotationConfig) => void
  onClear: () => void
  onClose: () => void
}

export const WritingToolbar: React.FC<WritingToolbarProps> = ({
  currentConfig,
  onConfigChange,
  onClear,
  onClose,
}) => {
  const handleToolSelect = (tool: ToolType) => {
    const defaultConfig = TOOL_CONFIGS[tool]
    onConfigChange({
      ...currentConfig,
      tool,
      strokeWidth: defaultConfig.defaultWidth,
      opacity: defaultConfig.defaultOpacity,
    })
  }

  const handleColorSelect = (color: string) => {
    onConfigChange({
      ...currentConfig,
      color,
    })
  }

  const handleThicknessSelect = (thickness: 'thin' | 'thick') => {
    const toolConfig = TOOL_CONFIGS[currentConfig.tool]
    const newWidth =
      thickness === 'thin' ? toolConfig.widths.thin : toolConfig.widths.thick

    onConfigChange({
      ...currentConfig,
      strokeWidth: newWidth,
    })
  }

  const isThick =
    currentConfig.strokeWidth > TOOL_CONFIGS[currentConfig.tool].widths.medium

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-[90px] md:bottom-[120px] left-1/2 bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-6 z-50 border border-gray-200"
    >
      {/* Tools */}
      <div className="flex items-center gap-4 border-r border-gray-200 pr-6">
        <button
          onClick={() => handleToolSelect('pen')}
          className={`p-2 rounded-lg transition-all ${
            currentConfig.tool === 'pen'
              ? 'bg-blue-50 text-blue-600 scale-110'
              : 'hover:bg-gray-50 text-gray-600'
          }`}
          title="Caneta"
        >
          <img src="/icons/pencil.svg" alt="Pen" className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleToolSelect('marker')}
          className={`p-2 rounded-lg transition-all ${
            currentConfig.tool === 'marker'
              ? 'bg-blue-50 text-blue-600 scale-110'
              : 'hover:bg-gray-50 text-gray-600'
          }`}
          title="Marcador"
        >
          <img src="/icons/highlighter.svg" alt="Marker" className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleToolSelect('eraser')}
          className={`p-2 rounded-lg transition-all ${
            currentConfig.tool === 'eraser'
              ? 'bg-blue-50 text-blue-600 scale-110'
              : 'hover:bg-gray-50 text-gray-600'
          }`}
          title="Borracha"
        >
          <img src="/icons/eraser.svg" alt="Eraser" className="w-6 h-6" />
        </button>
      </div>

      {/* Thickness (only for pen and marker) */}
      {currentConfig.tool !== 'eraser' && (
        <div className="flex items-center gap-2 border-r border-gray-200 pr-6">
          <button
            onClick={() => handleThicknessSelect('thin')}
            className={`p-1.5 rounded-lg transition-all ${
              !isThick
                ? 'bg-gray-100 scale-110'
                : 'hover:bg-gray-50 opacity-50 hover:opacity-100'
            }`}
            title="Fino"
          >
            <img src="/icons/thin.svg" alt="Thin" className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleThicknessSelect('thick')}
            className={`p-1.5 rounded-lg transition-all ${
              isThick
                ? 'bg-gray-100 scale-110'
                : 'hover:bg-gray-50 opacity-50 hover:opacity-100'
            }`}
            title="Grosso"
          >
            <img src="/icons/thick.svg" alt="Thick" className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Colors (only for pen and marker) */}
      {currentConfig.tool !== 'eraser' && (
        <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
          {COLORS.map((value) => (
            <button
              key={value}
              onClick={() => handleColorSelect(value)}
              className={`w-6 h-6 rounded-full border border-gray-200 transition-all ${
                currentConfig.color === value ? 'scale-125' : 'hover:scale-110'
              }`}
              style={{
                backgroundColor: value,
                boxShadow:
                  currentConfig.color === value
                    ? '0 0 0 2px white, 0 0 0 4px #E5E7EB'
                    : 'none',
              }}
              title={value}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClear}
          className="text-sm font-medium text-red-500 hover:text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
        >
          Limpar
        </button>
        <button
          onClick={onClose}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
        >
          Fechar
        </button>
      </div>
    </motion.div>
  )
}
