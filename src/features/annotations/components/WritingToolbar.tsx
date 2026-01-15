import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, ChevronUp, ChevronDown, Palette } from 'lucide-react'
import { useMediaQuery } from '@/hooks/use-media-query'
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
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleToolSelect = (tool: ToolType) => {
    const defaultConfig = TOOL_CONFIGS[tool]
    onConfigChange({
      ...currentConfig,
      tool,
      strokeWidth: defaultConfig.defaultWidth,
      opacity: defaultConfig.defaultOpacity,
    })
    // Hide color picker when switching to eraser
    if (tool === 'eraser') {
      setShowColorPicker(false)
    }
  }

  const handleColorSelect = (color: string) => {
    onConfigChange({
      ...currentConfig,
      color,
    })
    // Close color picker on mobile after selection
    if (!isDesktop) {
      setShowColorPicker(false)
    }
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

  // Mobile Toolbar - Vertical floating design
  if (!isDesktop) {
    return (
      <>
        {/* Floating vertical toolbar on the right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center"
        >
          {/* Main toolbar container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-2 flex flex-col items-center gap-1">
            {/* Close button */}
            <button
              onClick={onClose}
              className="min-w-12 min-h-12 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 active:bg-gray-200 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-8 h-px bg-gray-200 my-1" />

            {/* Tools section */}
            <button
              onClick={() => handleToolSelect('pen')}
              className={`min-w-12 min-h-12 flex items-center justify-center rounded-xl transition-all ${
                currentConfig.tool === 'pen'
                  ? 'bg-blue-100 text-blue-600 scale-105'
                  : 'text-gray-600 active:bg-gray-100'
              }`}
              aria-label="Caneta"
            >
              <img src="/icons/pencil.svg" alt="Pen" className="w-7 h-7" />
            </button>

            <button
              onClick={() => handleToolSelect('eraser')}
              className={`min-w-12 min-h-12 flex items-center justify-center rounded-xl transition-all ${
                currentConfig.tool === 'eraser'
                  ? 'bg-blue-100 text-blue-600 scale-105'
                  : 'text-gray-600 active:bg-gray-100'
              }`}
              aria-label="Borracha"
            >
              <img src="/icons/eraser.svg" alt="Eraser" className="w-7 h-7" />
            </button>

            {/* Expandable section toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="min-w-12 min-h-9 flex items-center justify-center rounded-xl text-gray-400 active:bg-gray-100 transition-colors"
              aria-label={isExpanded ? 'Recolher' : 'Expandir'}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {/* Expanded options */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden flex flex-col items-center gap-1"
                >
                  <div className="w-8 h-px bg-gray-200 my-1" />

                  {/* Thickness (only for pen and marker) */}
                  {currentConfig.tool !== 'eraser' && (
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleThicknessSelect('thin')}
                        className={`min-w-12 min-h-12 flex items-center justify-center rounded-xl transition-all ${
                          !isThick
                            ? 'bg-gray-200 scale-105'
                            : 'text-gray-400 active:bg-gray-100'
                        }`}
                        aria-label="Fino"
                      >
                        <img
                          src="/icons/thin.svg"
                          alt="Thin"
                          className="w-7 h-7"
                        />
                      </button>
                      <button
                        onClick={() => handleThicknessSelect('thick')}
                        className={`min-w-12 min-h-12 flex items-center justify-center rounded-xl transition-all ${
                          isThick
                            ? 'bg-gray-200 scale-105'
                            : 'text-gray-400 active:bg-gray-100'
                        }`}
                        aria-label="Grosso"
                      >
                        <img
                          src="/icons/thick.svg"
                          alt="Thick"
                          className="w-7 h-7"
                        />
                      </button>

                      <div className="w-8 h-px bg-gray-200 my-1" />

                      {/* Color picker toggle */}
                      <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className={`min-w-12 min-h-12 flex items-center justify-center rounded-xl transition-all ${
                          showColorPicker ? 'bg-gray-200' : 'active:bg-gray-100'
                        }`}
                        aria-label="Cores"
                      >
                        <div className="relative">
                          <Palette className="w-6 h-6 text-gray-600" />
                          <div
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                            style={{ backgroundColor: currentConfig.color }}
                          />
                        </div>
                      </button>
                    </div>
                  )}

                  <div className="w-8 h-px bg-gray-200 my-1" />

                  {/* Clear button */}
                  <button
                    onClick={onClear}
                    className="min-w-12 min-h-12 flex items-center justify-center rounded-xl text-red-500 active:bg-red-50 transition-colors"
                    aria-label="Limpar"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Color picker popup */}
        <AnimatePresence>
          {showColorPicker && currentConfig.tool !== 'eraser' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              transition={{ duration: 0.15 }}
              className="fixed right-[72px] top-1/2 -translate-y-1/2 z-50"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3">
                <div className="grid grid-cols-2 gap-3">
                  {COLORS.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleColorSelect(value)}
                      className={`min-w-11 min-h-11 rounded-xl border-2 transition-all ${
                        currentConfig.color === value
                          ? 'border-blue-500 scale-110'
                          : 'border-gray-200 active:scale-105'
                      }`}
                      style={{ backgroundColor: value }}
                      aria-label={`Cor ${value}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Desktop Toolbar - Horizontal design
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-[120px] left-1/2 bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-6 z-50 border border-gray-200"
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
