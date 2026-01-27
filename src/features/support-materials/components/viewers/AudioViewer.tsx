/**
 * AudioViewer - Visualizador de arquivos de áudio (MP3, WAV, etc)
 */

import React from 'react'

interface AudioViewerProps {
  /** URL do arquivo de áudio */
  url: string
  /** Título do arquivo */
  title: string
}

export const AudioViewer: React.FC<AudioViewerProps> = ({ url, title }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-6 md:p-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg">
      {/* Informações */}
      <div className="text-center">
        <p className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Reproduzindo áudio
        </p>
      </div>

      {/* Player de áudio */}
      <audio controls className="w-full max-w-md" preload="metadata">
        <source src={url} type="audio/mpeg" />
        <source src={url} type="audio/wav" />
        <source src={url} type="audio/ogg" />
        Seu navegador não suporta a reprodução de áudio.
      </audio>
    </div>
  )
}
