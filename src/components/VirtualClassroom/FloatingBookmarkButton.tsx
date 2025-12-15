import React from 'react'
import { ArchiveAdd } from 'iconsax-react'

interface FloatingBookmarkButtonProps {
  isBookmarked: boolean
  onClick: () => void
  isVisible: boolean
}

export const FloatingBookmarkButton: React.FC<FloatingBookmarkButtonProps> = ({
  isBookmarked,
  onClick,
  isVisible,
}) => {
  if (!isVisible) return null

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex justify-center">
      <div className="w-full max-w-[1400px] h-full relative px-12">
        <div className="absolute right-12 top-[110px] pointer-events-auto">
          <button
            onClick={onClick}
            className="flex items-center justify-center transition-colors cursor-pointer hover:opacity-80"
            title={isBookmarked ? 'Ver marcadores' : 'Adicionar marcador'}
          >
            <ArchiveAdd
              size="48"
              color={isBookmarked ? '#487BFF' : '#6C757D'}
              variant="Bold"
            />
          </button>
        </div>
      </div>
    </div>
  )
}
