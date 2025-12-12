import React from 'react'
import { ColorSwatch } from 'iconsax-react'
import { STICKY_NOTE_COLORS } from '../types'

interface ColorPickerProps {
  selectedColor: string
  onSelectColor: (color: string) => void
  isOpen: boolean
  onToggle: () => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onSelectColor,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-1 hover:bg-black/5 rounded-full transition-colors"
        title="Mudar cor"
      >
        <ColorSwatch size="20" color="#343A40" variant="Outline" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white shadow-lg p-2 grid grid-cols-4 gap-2 rounded-lg z-50 w-max border border-gray-100">
          {STICKY_NOTE_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                onSelectColor(c)
                onToggle()
              }}
              className={`w-6 h-6 rounded-full border border-black/10 transition-transform ${
                selectedColor === c
                  ? 'scale-110 ring-2 ring-black/20'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      )}
    </div>
  )
}
