/**
 * SpreadsheetViewer - Visualizador de planilhas (XLSX, XLS, CSV)
 * Nota: Navegadores não suportam renderização nativa de planilhas Excel
 */

import React from 'react'
import { TableDocument, DocumentDownload } from 'iconsax-react'

interface SpreadsheetViewerProps {
  /** URL do arquivo de planilha */
  url: string
  /** Título do arquivo */
  title: string
  /** Tamanho do arquivo formatado */
  size?: string
}

export const SpreadsheetViewer: React.FC<SpreadsheetViewerProps> = ({ url, title, size }) => {
  const handleDownload = () => {
    window.open(url, '_blank')
  }

  const handleOpenInOffice = () => {
    // Tenta abrir no Office Online
    const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
    window.open(officeUrl, '_blank')
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-12 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
      {/* Ícone da planilha */}
      <div className="flex items-center justify-center w-32 h-32 rounded-full bg-green-100 dark:bg-green-900">
        <TableDocument size={64} className="text-green-600 dark:text-green-400" variant="Bold" />
      </div>

      {/* Informações do arquivo */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
        {size && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Planilha Excel • {size}
          </p>
        )}
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={handleOpenInOffice}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <TableDocument size={20} variant="Bold" />
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
        Planilhas Excel não podem ser visualizadas diretamente no navegador. 
        Você pode abri-las no Office Online ou fazer o download.
      </p>
    </div>
  )
}
