import React from 'react'

interface SwipeHintOverlayProps {
  onDismiss: () => void
}

export const SwipeHintOverlay: React.FC<SwipeHintOverlayProps> = ({
  onDismiss,
}) => {
  return (
    <div
      className="fixed inset-0 z-100 pointer-events-auto flex items-center justify-center"
      onClick={onDismiss}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative flex flex-col items-center gap-4 px-8 text-white">
        <div className="relative flex items-center justify-center">
          <div className="animate-swipe-hint text-5xl">👆</div>
        </div>

        <div className="text-center">
          <p className="mb-1 text-lg font-medium">Deslize para navegar</p>
          <p className="text-sm text-white/70">
            Arraste para os lados para ir
            <br />
            para a próxima ou página anterior
          </p>
        </div>

        <div className="mt-2 flex items-center gap-6">
          <div className="flex items-center text-white/60">
            <span className="mr-2 text-2xl">‹</span>
            <span className="text-xs">Anterior</span>
          </div>
          <div className="h-6 w-px bg-white/30" />
          <div className="flex items-center text-white/60">
            <span className="text-xs">Próxima</span>
            <span className="ml-2 text-2xl">›</span>
          </div>
        </div>

        <button
          className="mt-4 rounded-full bg-white/20 px-6 py-2 text-sm font-medium transition-colors hover:bg-white/30 pointer-events-auto"
          onClick={onDismiss}
          type="button"
        >
          Entendi
        </button>
      </div>
    </div>
  )
}
