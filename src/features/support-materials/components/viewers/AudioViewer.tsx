/**
 * AudioViewer - Visualizador de arquivos de áudio (MP3, WAV, etc)
 */

import React from 'react'
import { MusicCircle } from 'iconsax-react'

interface AudioViewerProps {
  /** URL do arquivo de áudio */
  url: string
  /** Título do arquivo */
  title: string
}

export const AudioViewer: React.FC<AudioViewerProps> = ({ url, title }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg">
      {/* Ícone decorativo */}
      <div className="flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900">
        <MusicCircle size={64} className="text-blue-600 dark:text-blue-400" variant="Bold" />
      </div>

      {/* Player de áudio */}
      <audio 
        controls 
        className="w-full max-w-md"
        preload="metadata"
      >
        <source src={url} type="audio/mpeg" />
        <source src={url} type="audio/wav" />
        <source src={url} type="audio/ogg" />
        Seu navegador não suporta a reprodução de áudio.
      </audio>

      {/* Informações */}
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Reproduzindo
        </p>
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
          {title}
        </p>
      </div>
    </div>
  )
}
