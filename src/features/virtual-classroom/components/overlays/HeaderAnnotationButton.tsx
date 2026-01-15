import React from 'react'
import { Edit2 } from 'iconsax-react'

interface HeaderAnnotationButtonProps {
  hasAnnotations: boolean
  onClick: () => void
}

/**
 * Botão de Anotações/Desenhos para o header mobile.
 * Indica visualmente se a página atual possui anotações ou desenhos.
 */
export const HeaderAnnotationButton: React.FC<HeaderAnnotationButtonProps> = ({
  hasAnnotations,
  onClick,
}) => {
  return (
    <button
      type="button"
      aria-label={hasAnnotations ? 'Ver anotações' : 'Adicionar anotação'}
      className="gap-0 relative"
      onClick={onClick}
    >
      {hasAnnotations && (
        <div className="absolute inset-0 -m-1 bg-[#F3C353] rounded-full " />
      )}
      <Edit2
        size="24"
        color={hasAnnotations ? '#000' : '#6C757D'}
        variant="Outline"
        className="relative z-10"
      />
    </button>
  )
}
