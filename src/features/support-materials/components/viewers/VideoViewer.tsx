/**
 * VideoViewer - Visualizador de vídeos (MP4, WebM, etc)
 */

import React from 'react'

interface VideoViewerProps {
  /** URL do vídeo */
  url: string
  /** Título do arquivo */
  title: string
}

export const VideoViewer: React.FC<VideoViewerProps> = ({ url, title }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4 md:p-12 bg-gray-900">
      {/* Player de vídeo nativo */}
      <video
        controls
        className="w-full max-w-4xl rounded-lg shadow-2xl"
        preload="metadata"
      >
        <source src={url} type="video/mp4" />
        <source src={url} type="video/webm" />
        <source src={url} type="video/ogg" />
        Seu navegador não suporta o elemento de vídeo.
      </video>

      <p className="text-sm text-gray-400 text-center max-w-md">{title}</p>
    </div>
  )
}
