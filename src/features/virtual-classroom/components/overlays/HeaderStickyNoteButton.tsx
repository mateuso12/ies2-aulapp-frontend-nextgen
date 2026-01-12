import React from 'react'
import { Stickynote } from 'iconsax-react'
import { Button } from 'ies2-aulapp-ui-kit'

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
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={hasNotes ? 'Ver notas adesivas' : 'Adicionar nota adesiva'}
      className="gap-0 relative"
      onClick={onClick}
    >
      {hasNotes && (
        <div className="absolute inset-0 -m-1 bg-[#8A5CCC] rounded-full" />
      )}
      <Stickynote
        size="24"
        color={hasNotes ? '#FFFFFF' : '#6C757D'}
        variant="Outline"
        className="relative z-10"
      />
    </Button>
  )
}
