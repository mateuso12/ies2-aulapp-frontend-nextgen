import React from 'react'
import { ColorSwatch } from 'iconsax-react'
import { STICKY_NOTE_COLORS } from '../types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

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
    <Popover open={isOpen} onOpenChange={() => onToggle()}>
      <PopoverTrigger asChild>
        <button
          className="p-1 hover:bg-black/5 rounded-full transition-colors outline-none"
          title="Mudar cor"
        >
          <ColorSwatch size="20" color="#343A40" variant="Outline" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-max p-2 grid grid-cols-4 gap-2 bg-white rounded-lg shadow-lg border border-gray-100 z-50"
        side="top"
        align="start"
        sideOffset={5}
      >
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
      </PopoverContent>
    </Popover>
  )
}
