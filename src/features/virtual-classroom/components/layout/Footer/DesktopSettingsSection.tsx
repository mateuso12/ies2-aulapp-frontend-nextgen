import { Maximize2, Minimize2 } from 'lucide-react'
import { Button } from 'ies2-aulapp-ui-kit'
import { SettingsMenu } from '../../overlays/SettingsMenu'

interface DesktopSettingsSectionProps {
  showTools: boolean
  isFullscreen: boolean
  onToggleFullscreen: () => void
  onHideToolbar?: () => void
  onSettingsMenuOpenChange: (isOpen: boolean) => void
}

export function DesktopSettingsSection({
  showTools,
  isFullscreen,
  onToggleFullscreen,
  onHideToolbar,
  onSettingsMenuOpenChange,
}: DesktopSettingsSectionProps) {
  return (
    <div className="absolute right-8 hidden items-center gap-2 md:flex">
      {!showTools && (
        <Button
          onClick={onToggleFullscreen}
          variant="ghost"
          size="icon"
          className="rounded-lg transition-colors hover:bg-black hover:text-white"
          aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </Button>
      )}
      <SettingsMenu
        onHideToolbar={onHideToolbar}
        onOpenChange={onSettingsMenuOpenChange}
      />
    </div>
  )
}
