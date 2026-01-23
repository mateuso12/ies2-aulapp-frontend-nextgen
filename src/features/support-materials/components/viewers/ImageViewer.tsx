/**
 * ImageViewer - Visualizador de imagens (PNG, JPG, SVG, etc)
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

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const handleResetZoom = () => setZoom(100)

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg">
      {/* Controles de zoom */}
      <div className="flex items-center justify-center gap-4 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 50}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Diminuir zoom"
        >
          <SearchZoomOut size={20} />
        </button>
        
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
          {zoom}%
        </span>
        
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 200}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Aumentar zoom"
        >
          <SearchZoomIn size={20} />
        </button>
        
        <button
          onClick={handleResetZoom}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Resetar zoom"
        >
          <Maximize4 size={20} />
        </button>
      </div>

      {/* Container da imagem */}
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
        <img
          src={url}
          alt={title}
          style={{
            transform: `scale(${zoom / 100})`,
            transition: 'transform 0.2s ease-out',
          }}
          className="max-w-full h-auto object-contain"
        />
      </div>
    </div>
  )
}
