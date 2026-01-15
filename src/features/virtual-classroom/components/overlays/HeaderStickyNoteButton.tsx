import React from 'react'
import { Stickynote } from 'iconsax-react'

interface HeaderStickyNoteButtonProps {
  hasNotes: boolean
  onClick: () => void
}

/**
 * Botão de Sticky Notes para o header mobile.
 * Indica visualmente se a página atual possui notas adesivas.
 */
export const HeaderStickyNoteButton: React.FC<HeaderStickyNoteButtonProps> = ({
  hasNotes,
  onClick,
}) => {
  return (
    <button
      type="button"
      aria-label={hasNotes ? 'Ver notas adesivas' : 'Adicionar nota adesiva'}
      className="gap-0 relative"
      onClick={onClick}
    >
      {hasNotes && (
        <div className="absolute inset-0 -m-1 bg-[#46B35E] rounded-full" />
      )}
      <Stickynote
        size="24"
        color={hasNotes ? '#FFFFFF' : '#6C757D'}
        variant="Outline"
        className="relative z-10"
      />
    </button>
  )
}
