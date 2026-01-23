/**
 * DocxViewer - Visualizador de documentos Word (DOCX)
 * Nota: Navegadores não suportam renderização nativa de DOCX
 */

import React from 'react'
import { DocumentText, DocumentDownload } from 'iconsax-react'

interface DocxViewerProps {
  /** URL do arquivo DOCX */
  url: string
  /** Título do arquivo */
  title: string
  /** Tamanho do arquivo formatado */
  size?: string
}

export const DocxViewer: React.FC<DocxViewerProps> = ({ url, title, size }) => {
  const handleDownload = () => {
    window.open(url, '_blank')
  }

  const handleOpenInOffice = () => {
    // Tenta abrir no Office Online
    const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
    window.open(officeUrl, '_blank')
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-12 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
      {/* Ícone do documento */}
      <div className="flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900">
        <DocumentText size={64} className="text-blue-600 dark:text-blue-400" variant="Bold" />
      </div>

      {/* Informações do arquivo */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
        {size && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Documento Word • {size}
          </p>
        )}
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={handleOpenInOffice}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <DocumentText size={20} variant="Bold" />
          Visualizar no Office Online
        </button>
        
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors"
        >
          <DocumentDownload size={20} />
          Fazer Download
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-md">
        Documentos Word não podem ser visualizados diretamente no navegador. 
        Você pode abri-los no Office Online ou fazer o download.
      </p>
    </div>
  )
}
