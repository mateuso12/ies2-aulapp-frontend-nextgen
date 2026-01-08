import React from 'react'
import { motion } from 'framer-motion'
import type { HighlightColor } from '../types/highlight'

const MENU_ANIMATION = {
  initial: { scale: 0.85, opacity: 0, y: 6 },
  animate: { scale: 1, opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 500, damping: 28 },
} as const

const COLOR_CLASSES: Record<HighlightColor, string> = {
  yellow: 'bg-yellow-200/70 dark:bg-yellow-800/60',
  blue: 'bg-blue-200/70 dark:bg-blue-800/60',
  green: 'bg-green-200/70 dark:bg-green-800/60',
  pink: 'bg-pink-200/70 dark:bg-pink-800/60',
}

const menuContainerClass =
  'flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 shadow-lg backdrop-blur px-3 py-2 dark:border-slate-700 dark:bg-slate-900/95'

const buttonBaseClass =
  'rounded-full text-sm font-medium transition active:scale-95'

interface ColorMenuProps {
  x: number
  y: number
  colors: readonly HighlightColor[]
  onSelectColor: (color: HighlightColor) => void
  onCancel: () => void
  onInteractionStart: () => void
  onInteractionEnd: () => void
}

export const ColorMenu: React.FC<ColorMenuProps> = ({
  x,
  y,
  colors,
  onSelectColor,
  onCancel,
  onInteractionStart,
  onInteractionEnd,
}) => (
  <motion.div
    data-highlight-menu
    className="fixed z-100"
    style={{ left: x, top: y, transform: 'translate(-50%, -100%)' }}
    role="dialog"
    aria-label="Menu de marcação"
  >
    <motion.div
      {...MENU_ANIMATION}
      onPointerDown={onInteractionStart}
      onPointerUp={() => setTimeout(onInteractionEnd, 100)}
      className={menuContainerClass}
    >
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={`h-11 w-11 ${buttonBaseClass} border border-slate-200 dark:border-slate-700 ${COLOR_CLASSES[color]}`}
          aria-label={`Marcar com ${color}`}
          onClick={() => onSelectColor(color)}
        />
      ))}

      <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />

      <button
        type="button"
        className={`h-11 px-4 ${buttonBaseClass} text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800`}
        onClick={onCancel}
        aria-label="Cancelar marcação"
      >
        Cancelar
      </button>
    </motion.div>
  </motion.div>
)

interface RemoveMenuProps {
  x: number
  y: number
  onRemove: () => void
  onRemoveAll: () => void
  onCancel: () => void
}

export const RemoveMenu: React.FC<RemoveMenuProps> = ({
  x,
  y,
  onRemove,
  onRemoveAll,
  onCancel,
}) => (
  <div
    data-highlight-remove-menu
    className="fixed z-100"
    style={{ left: x, top: y, transform: 'translate(-50%, -120%)' }}
    role="dialog"
    aria-label="Menu de remoção"
  >
    <div className={menuContainerClass}>
      <button
        type="button"
        className={`h-10 px-4 ${buttonBaseClass} text-white bg-red-600 hover:bg-red-700`}
        onClick={onRemove}
        aria-label="Remover este destaque"
      >
        Remover
      </button>

      <button
        type="button"
        className={`h-10 px-4 ${buttonBaseClass} text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40`}
        onClick={onRemoveAll}
        aria-label="Apagar todas as marcações"
      >
        Apagar todas
      </button>

      <button
        type="button"
        className={`h-10 px-4 ${buttonBaseClass} text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800`}
        onClick={onCancel}
        aria-label="Cancelar"
      >
        Cancelar
      </button>
    </div>
  </div>
)
