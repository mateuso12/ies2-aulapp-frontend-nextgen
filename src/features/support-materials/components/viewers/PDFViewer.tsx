/**
 * PDFViewer - Visualizador de documentos PDF
 */

import React from 'react'

interface PDFViewerProps {
  /** URL do arquivo PDF */
  url: string
  /** Título do arquivo */
  title: string
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url, title }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <iframe
        src={url}
        title={title}
        className="w-full h-full border-0 rounded-lg"
        style={{ minHeight: '600px' }}
      />
    </div>
  )
}
