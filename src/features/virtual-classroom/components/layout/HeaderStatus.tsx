import React from 'react'
import { Flash, RefreshCircle, Heart, ArrowLeft } from 'iconsax-react'
import { ResourceBadge, Button } from 'ies2-aulapp-ui-kit'
import { Timer } from '../ui/Timer'
import { useTranslation } from 'react-i18next'
import { normalizeLocaleForUIKit } from '@/lib/locale'

interface HeaderStatusProps {
  variant?: 'default' | 'gamified'
  score: number
  lives: number
  redoCurrent: number
  redoTotal: number
  title?: string
  showTitle?: boolean
  resourceType?: string
  onBack?: () => void
  isCollapsed?: boolean
}

export const HeaderStatus: React.FC<HeaderStatusProps> = ({
  variant = 'default',
  score,
  lives,
  redoCurrent,
  redoTotal,
  title,
  showTitle = false,
  resourceType = 'gamificada',
  onBack,
  isCollapsed = false,
}) => {
  const { i18n } = useTranslation()
  const getBadgeVariant = () => {
    switch (resourceType) {
      case 'content':
        return 'conteudo'
      case 'gamified':
        return 'gamificada'
      case 'exercise_list':
        return 'lista'
      case 'assessment':
        return 'avaliacao'
      case 'simulation':
        return 'simulado'
      case 'material':
        return 'material'
      default:
        return 'conteudo'
    }
  }

  if (variant === 'default') {
    return (
      <div className="flex items-center gap-4">
        <Timer />
        <div className="flex items-center gap-2 rounded-2xl border-4 border-[#FFB6B6] dark:border-gray-700 bg-white dark:bg-black px-4 py-2">
          <RefreshCircle size="24" color="#FF246E" variant="Bold" />
          <div className="flex items-center gap-1">
            {Array.from({ length: redoTotal }).map((_, index) => (
              <div
                key={index}
                className={`h-[12.89px] w-[12.89px] rounded-full ${
                  index < redoCurrent
                    ? 'bg-[#487BFF]'
                    : 'bg-[#D9D9D9] dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="font-baloo text-xl font-bold text-[#343A40] dark:text-white">
            {redoCurrent}/{redoTotal}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Main Status Container */}
      <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 rounded-2xl sm:rounded-3xl md:rounded-4xl border-2 sm:border-[2.5px] md:border-[3.38px] border-black/20 bg-linear-to-r from-[#FF5A82] to-[#FF246E] px-3 sm:px-4 md:px-6 pb-4 sm:pb-6 md:pb-8 pt-2 sm:pt-3 md:pt-4 shadow-lg">
        {/* Title Row with Back Button and Badge - Only shown when showTitle true */}
        {showTitle && (
          <div
            className={`flex w-full items-center justify-between md:hidden transition-all duration-300 overflow-hidden ${
              isCollapsed
                ? 'max-h-0 opacity-0 pointer-events-none'
                : 'max-h-20 opacity-100'
            }`}
          >
            <div className="flex items-center min-w-0">
              <Button
                onClick={onBack}
                variant="ghost"
                className="p-0 min-w-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 hover:bg-white/20 shrink-0"
              >
                <ArrowLeft
                  size="18"
                  color="#FFFFFF"
                  variant="Linear"
                  className="sm:w-5! sm:h-5! md:w-6! md:h-6!"
                />
              </Button>
              {title && (
                <h2 className="font-baloo text-sm sm:text-base md:text-xl font-bold text-white text-center mx-1 sm:mx-1.5 md:mx-2">
                  {title}
                </h2>
              )}
            </div>
            <ResourceBadge
              variant={getBadgeVariant()}
              appearance="icon-only"
              className="scale-75 sm:scale-90 md:scale-100"
              locale={normalizeLocaleForUIKit(i18n.language)}
            />
          </div>
        )}

        {/* Status Items */}
        <div className="flex items-center gap-3 sm:gap-5 md:gap-8">
          {/* Score */}
          <div className="flex items-center">
            <div
              className="z-10 flex h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-white text-[#FF246E]"
              style={{ boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
            >
              <Flash
                size="16"
                variant="Bold"
                color="currentColor"
                className="sm:w-5! sm:h-5! md:w-6! md:h-6!"
              />
            </div>
            <div className="-ml-3 sm:-ml-3.5 md:-ml-4 flex h-6 sm:h-7 md:h-8 items-center rounded sm:rounded-[4.5px] md:rounded-[5.41px] border-2 sm:border-[2.5px] md:border-[3.38px] border-black/20 bg-[#F45D86] pl-4 sm:pl-5 md:pl-6 pr-2 sm:pr-3 md:pr-4">
              <span className="font-baloo text-xs sm:text-sm md:text-base lg:text-xl font-bold text-white whitespace-nowrap">
                {score} pts
              </span>
            </div>
          </div>

          {/* Redo Counter */}
          <div className="flex items-center">
            <div
              className="z-10 flex h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-white text-[#FF246E]"
              style={{ boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
            >
              <RefreshCircle
                size="16"
                variant="Bold"
                color="currentColor"
                className="sm:w-5! sm:h-5! md:w-6! md:h-6!"
              />
            </div>
            <div className="-ml-3 sm:-ml-3.5 md:-ml-4 flex h-6 sm:h-7 md:h-8 items-center rounded sm:rounded-[4.5px] md:rounded-[5.41px] border-2 sm:border-[2.5px] md:border-[3.38px] border-black/20 bg-[#F45D86] pl-4 sm:pl-5 md:pl-6 pr-2 sm:pr-3 md:pr-4">
              <span className="font-baloo text-xs sm:text-sm md:text-base lg:text-xl font-bold text-white whitespace-nowrap">
                {redoCurrent}/{redoTotal}
              </span>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center">
            <div
              className="z-10 flex h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-white text-[#FF246E]"
              style={{ boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
            >
              <Timer
                variant="minimal"
                className="font-baloo text-[#FF246E]! gap-0! [&>span]:hidden text-[10px] sm:text-xs md:text-sm"
              />
            </div>
            <div className="-ml-3 sm:-ml-3.5 md:-ml-4 flex h-6 sm:h-7 md:h-8 items-center rounded sm:rounded-[4.5px] md:rounded-[5.41px] bg-white pl-4 sm:pl-5 md:pl-6 pr-2 sm:pr-3 md:pr-4">
              <Timer
                variant="minimal"
                className="font-baloo [&>svg]:hidden text-[#FF246E] text-xs sm:text-sm md:text-base lg:text-xl whitespace-nowrap"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hanging Lives */}
      {lives > 5 ? (
        <div className="absolute -bottom-5 sm:-bottom-6 md:-bottom-7 flex items-center gap-1 sm:gap-1.5 md:gap-2 rounded-[60px] sm:rounded-[70px] md:rounded-[80px] border-2 sm:border-[2.5px] md:border-[3.38px] border-black/20 bg-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 shadow-md">
          <span className="font-baloo text-base sm:text-lg md:text-[24.56px] font-bold leading-[1.3] text-[#ED3237]">
            {lives}x
          </span>
          <Heart
            size="20"
            color="#ED3237"
            variant="Bold"
            className="sm:w-6! sm:h-6! md:w-7! md:h-7!"
          />
        </div>
      ) : (
        <div className="absolute -bottom-4 sm:-bottom-4 md:-bottom-5 flex gap-0">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-white shadow-md"
            >
              <Heart
                size="14"
                color={index < lives ? '#ED3237' : '#B8BCC0'}
                variant="Bold"
                className="sm:w-4! sm:h-4! md:w-5! md:h-5!"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
