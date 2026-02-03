import React from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowCircleDown2 } from 'iconsax-react'
import { Button } from 'ies2-aulapp-ui-kit'

interface ViewCommentButtonProps {
  exerciseId: string
  onClick?: () => void
}

export const ViewCommentButton: React.FC<ViewCommentButtonProps> = ({
  exerciseId,
  onClick,
}) => {
  const { t } = useTranslation('exercises')
  const handleClick = () => {
    if (onClick) {
      onClick()
    }

    const scrollToComment = () => {
      const commentElement = document.getElementById(`comment-${exerciseId}`)
      const mainElement = document.querySelector('main.overflow-auto')

      if (commentElement && mainElement) {
        mainElement.scrollTo({
          top: commentElement.offsetTop,
          behavior: 'smooth',
        })
        return
      }

      commentElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToComment)
    })
  }

  return (
    <div className="flex justify-center pt-8">
      <Button
        onClick={handleClick}
        variant="ghost"
        className="flex items-center gap-2 px-0 py-0 font-bold text-base text-[#FF246E] hover:text-[#E91E63]"
      >
        {t('goToComment')}
        <ArrowCircleDown2 size="24" color="#FF246E" variant="Linear" />
      </Button>
    </div>
  )
}
