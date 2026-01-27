/**
 * ImageViewer - Visualizador de imagens (PNG, JPG, SVG, etc)
 * A imagem se ajusta automaticamente ao modal e permite zoom
 */

import React, { useState } from 'react'
import { SearchZoomIn, SearchZoomOut, Maximize4 } from 'iconsax-react'

interface ImageViewerProps {
  /** URL da imagem */
  url: string
  /** Título do arquivo */
  title: string
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ url, title }) => {
  const [zoom, setZoom] = useState(100)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 300))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const handleResetZoom = () => setZoom(100)

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Controles de zoom - Responsivo */}
      <div className="flex items-center justify-center gap-3 md:gap-4 px-2 py-2 md:py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 50}
          className="p-1.5 md:p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Diminuir zoom"
          title="Diminuir zoom (25%)"
        >
          <SearchZoomOut
            size={18}
            className="md:w-5 md:h-5"
            color="currentColor"
          />
        </button>

        <span className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 min-w-[60px] md:min-w-[70px] text-center">
          {zoom}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= 300}
          className="p-1.5 md:p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Aumentar zoom"
          title="Aumentar zoom (25%)"
        >
          <SearchZoomIn
            size={18}
            className="md:w-5 md:h-5"
            color="currentColor"
          />
        </button>
      </div>

      {/* Container da imagem - Ajusta automaticamente e permite zoom */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="relative flex items-center justify-center w-full h-full">
          <img
            src={url}
            alt={title}
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 0.3s ease-out',
            }}
            className="max-w-full max-h-full w-auto h-auto object-contain"
          />
        </div>
      </div>
    </div>
  )
}
