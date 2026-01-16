import React from 'react'
import { ArrowLeft } from 'iconsax-react'
import { ResourceBadge, SearchPopover, Button } from 'ies2-aulapp-ui-kit'

interface HeaderActionsProps {
  variant?: 'default' | 'gamified'
  title?: string
  onBack?: () => void
  resourceType?: string
}

const getBadgeVariant = (type: string) => {
  switch (type) {
    case 'exercise_list':
      return 'lista'
    case 'assessment':
      return 'avaliacao'
    case 'scorm':
      return null
    case 'material':
      return 'material'
    case 'simulation':
      return 'simulado'
    case 'gamified':
      return 'gamificada'
    case 'content':
    default:
      return 'conteudo'
  }
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  variant = 'default',
  title = 'Nome da Aula',
  onBack,
  resourceType = 'content',
}) => {
  const badgeVariant = getBadgeVariant(resourceType)
  const showSearch = resourceType === 'content' || resourceType === 'material'

  if (variant === 'gamified') {
    return (
      <div className="pointer-events-auto flex items-center gap-4 rounded-2xl border-[3.38px] border-black/20 bg-linear-to-r from-[#FF5A82] to-[#FF246E] px-4 py-1 shadow-lg">
        <Button
          onClick={onBack}
          variant="ghost"
          className="p-0 min-w-0 w-10 h-10 hover:bg-white/20"
        >
          <ArrowLeft size="24" color="#FFFFFF" variant="Linear" />
        </Button>

        <h1 className="font-baloo text-2xl font-bold text-white">
          4.2 {title}
        </h1>

        <div className="hidden md:block">
          {badgeVariant ? (
            <ResourceBadge
              variant={badgeVariant}
              appearance="solid"
              className="shadow-none"
            />
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
              SCORM
            </div>
          )}
        </div>

        {showSearch && <SearchPopover resultsCount={2} />}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onBack}
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#FF246E] hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <ArrowLeft size="24" color="currentColor" variant="Linear" />
      </button>

      {/* Mobile Title (only the class name) */}
      <h1 className="max-md:font-sans max-md:text-base max-md:font-semibold max-md:text-[#FF246E] dark:max-md:text-[#FF5A82] max-md:truncate md:hidden">
        {title}
      </h1>

      {/* Desktop Title */}
      <h1 className="hidden font-sans text-2xl font-semibold text-[#FF246E] dark:text-[#FF5A82] md:block">
        4.2 <span className="text-[#FF246E] dark:text-[#FF5A82]">{title}</span>
      </h1>

      <div className="hidden md:block">
        {badgeVariant ? (
          <ResourceBadge
            variant={badgeVariant}
            appearance="solid"
            className="shadow-none"
          />
        ) : (
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            SCORM
          </div>
        )}
      </div>

      {/* Search (Desktop Only) */}
      {showSearch && (
        <div className="hidden md:block">
          <SearchPopover resultsCount={2} />
        </div>
      )}
    </div>
  )
}
