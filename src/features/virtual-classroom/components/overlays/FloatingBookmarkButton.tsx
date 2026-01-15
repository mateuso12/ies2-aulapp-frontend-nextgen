import React from 'react'
import { ArchiveAdd } from 'iconsax-react'
import { Button } from 'ies2-aulapp-ui-kit'

interface FloatingBookmarkButtonProps {
  isBookmarked: boolean
  onClick: () => void
  isVisible?: boolean
  variant?: 'floating' | 'header'
}

export const FloatingBookmarkButton: React.FC<FloatingBookmarkButtonProps> = ({
  isBookmarked,
  onClick,
  isVisible = true,
  variant = 'floating',
}) => {
  if (!isVisible) return null

  if (variant === 'header') {
    return (
      <button
        onClick={onClick}
        aria-label={isBookmarked ? 'Remover marca-página' : 'Marcar página'}
      >
        <ArchiveAdd
          size="26"
          color={isBookmarked ? '#487BFF' : '#6C757D'}
          variant={isBookmarked ? 'Bold' : 'Linear'}
        />
      </button>
    )
  }

  return (
    <div className="absolute inset-0 z-30 pointer-events-none justify-center hidden md:flex">
      <div className="w-full max-w-[1400px] h-full relative px-12">
        <div className="absolute right-12 top-[110px] pointer-events-auto">
          <Button
            onClick={onClick}
            variant="ghost"
            size="icon"
            aria-label={isBookmarked ? 'Remover marca-página' : 'Marcar página'}
          >
            <ArchiveAdd
              size="48"
              color={isBookmarked ? '#487BFF' : '#6C757D'}
              variant="Bold"
            />
          </Button>
        </div>
      </div>
    </div>
  )
}
