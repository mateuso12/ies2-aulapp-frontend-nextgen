/**
 * UniversalFileViewer - Visualizador universal que suporta múltiplos tipos de arquivo
 * Decide internamente qual renderizador usar baseado no tipo
 */

import React from 'react'
import { DocumentDownload, Archive } from 'iconsax-react'
import { PDFViewer } from './PDFViewer'
import { DocxViewer } from './DocxViewer'
import { SpreadsheetViewer } from './SpreadsheetViewer'
import { ImageViewer } from './ImageViewer'
import { AudioViewer } from './AudioViewer'
import { VideoViewer } from './VideoViewer'
import type { SupportMaterial } from '@/mocks/supportMaterials'

interface UniversalFileViewerProps {
  /** Material sendo visualizado */
  material: SupportMaterial
}

export const UniversalFileViewer: React.FC<UniversalFileViewerProps> = ({
  material,
}) => {
  const type = material.type.toLowerCase()
  const { downloadUrl, title, size } = material

  // PDF
  if (type === 'pdf') {
    return <PDFViewer url={downloadUrl} title={title} />
  }

  // Documentos Word
  if (type === 'docx' || type === 'doc') {
    return <DocxViewer url={downloadUrl} title={title} size={size} />
  }

  // Planilhas Excel
  if (['xlsx', 'xls', 'csv'].includes(type)) {
    return <SpreadsheetViewer url={downloadUrl} title={title} size={size} />
  }

  // PowerPoint - Renderizar como download (bibliotecas de preview são pesadas)
  if (type === 'ppt' || type === 'pptx') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-12 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-800/20 rounded-lg">
        <div className="flex items-center justify-center w-32 h-32 rounded-full bg-orange-100 dark:bg-orange-900">
          <DocumentDownload
            size={64}
            className="text-orange-600 dark:text-orange-400"
            variant="Bold"
            color="currentColor"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Apresentação PowerPoint • {size}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 max-w-md">
            Visualização de apresentações não disponível no navegador. Faça o
            download para abrir no PowerPoint.
          </p>
        </div>
      </div>
    )
  }

  // Imagens
  if (
    [
      'image',
      'png',
      'jpg',
      'jpeg',
      'svg',
      'gif',
      'webp',
      'bmp',
      'ico',
    ].includes(type)
  ) {
    return <ImageViewer url={downloadUrl} title={title} />
  }

  // Vídeos
  if (['video', 'mp4', 'webm', 'ogg', 'avi', 'mov'].includes(type)) {
    return <VideoViewer url={downloadUrl} title={title} />
  }

  // Áudio
  if (['audio', 'mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(type)) {
    return <AudioViewer url={downloadUrl} title={title} />
  }

  // Arquivos compactados (ZIP, RAR)
  if (
    type === 'zip' ||
    type === 'rar' ||
    type === '7z' ||
    type === 'tar' ||
    type === 'gz'
  ) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-12 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-800/20 rounded-lg">
        <div className="flex items-center justify-center w-32 h-32 rounded-full bg-yellow-100 dark:bg-yellow-900">
          <Archive
            size={64}
            className="text-yellow-600 dark:text-yellow-400"
            variant="Bold"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Arquivo Compactado • {size}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 max-w-md">
            Visualização de arquivos compactados não disponível. Faça o download
            para extrair o conteúdo.
          </p>
        </div>
      </div>
    )
  }

  // E-books (EPUB, MOBI)
  if (type === 'epub' || type === 'mobi' || type === 'azw' || type === 'azw3') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-12 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-800/20 rounded-lg">
        <div className="flex items-center justify-center w-32 h-32 rounded-full bg-purple-100 dark:bg-purple-900">
          <DocumentDownload
            size={64}
            className="text-purple-600 dark:text-purple-400"
            variant="Bold"
            color="currentColor"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            E-book {type.toUpperCase()} • {size}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 max-w-md">
            Visualização de e-books não disponível no navegador. Faça o download
            para abrir em um leitor de e-books.
          </p>
        </div>
      </div>
    )
  }

  // Tipo não suportado
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700">
        <DocumentDownload
          size={64}
          className="text-gray-600 dark:text-gray-400"
          variant="Bold"
        />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tipo de arquivo: {type.toUpperCase()} • {size}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 max-w-md">
          Visualização não disponível para este tipo de arquivo. Use o botão de
          download abaixo.
        </p>
      </div>
    </div>
  )
}
