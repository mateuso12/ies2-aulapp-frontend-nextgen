import React from 'react'
import { ArrowLeft } from 'iconsax-react'
import { ResourceBadge, SearchPopover, Button } from 'ies2-aulapp-ui-kit'

interface HeaderActionsProps {
  variant?: 'default' | 'gamified'
  title?: string
  onBack?: () => void
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  variant = 'default',
  title = 'Nome da Aula',
  onBack,
}) => {
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
          <ResourceBadge
            variant="lista"
            appearance="solid"
            className="shadow-none"
          />
        </div>

        <SearchPopover resultsCount={2} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onBack}
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#FF246E] hover:bg-gray-100"
      >
        <ArrowLeft size="24" color="currentColor" variant="Linear" />
      </button>

      {/* Mobile Title */}
      <span className="hidden font-sans text-base font-semibold text-[#FF246E] max-md:inline">
        Conteúdo
      </span>

      {/* Desktop Title */}
      <h1 className="hidden font-sans text-2xl font-semibold text-[#FF246E] md:block">
        4.2 <span className="text-[#FF246E]">{title}</span>
      </h1>

      <div className="hidden md:block">
        <ResourceBadge
          variant="gamificada"
          appearance="solid"
          className="shadow-none"
        />
      </div>

      {/* Search (Desktop Only) */}
      <SearchPopover resultsCount={2} />
    </div>
  )
}
