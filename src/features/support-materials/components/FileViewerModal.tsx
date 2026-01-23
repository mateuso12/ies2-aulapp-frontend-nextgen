/**
 * FileViewerModal - Modal principal para visualização de arquivos
 * Carrega o visualizador apropriado baseado no tipo de arquivo
 */

import React from 'react'
import { CloseCircle } from 'iconsax-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { PDFViewer, AudioViewer, ImageViewer, DocxViewer, SpreadsheetViewer } from './viewers'
import type { SupportMaterial } from '@/mocks/supportMaterials'

interface FileViewerModalProps {
  /** Material sendo visualizado */
  material: SupportMaterial | null
  /** Se o modal está aberto */
  isOpen: boolean
  /** Callback para fechar o modal */
  onClose: () => void
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  material,
  isOpen,
  onClose,
}) => {
  if (!material) return null

  // Determina qual visualizador usar baseado no tipo de arquivo
  const renderViewer = () => {
    const type = material.type.toLowerCase()
    
    // PDF
    if (type === 'pdf') {
      return <PDFViewer url={material.downloadUrl} title={material.title} />
    }
    
    // Áudio
    if (type === 'mp3' || type === 'audio' || type === 'wav' || type === 'ogg') {
      return <AudioViewer url={material.downloadUrl} title={material.title} />
    }
    
    // Imagem
    if (['image', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'].includes(type)) {
      return <ImageViewer url={material.downloadUrl} title={material.title} />
    }
    
    // Word
    if (type === 'docx' || type === 'doc') {
      return <DocxViewer url={material.downloadUrl} title={material.title} size={material.size} />
    }
    
    // Excel
    if (['xlsx', 'xls', 'csv'].includes(type)) {
      return <SpreadsheetViewer url={material.downloadUrl} title={material.title} size={material.size} />
    }
    
    // Tipo não suportado
    return (
      <div className="w-full h-full flex items-center justify-center p-12">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Tipo de arquivo não suportado para visualização
          </p>
          <button
            onClick={() => window.open(material.downloadUrl, '_blank')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Fazer Download
          </button>
        </div>
      </div>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-4xl lg:max-w-6xl p-0 flex flex-col"
      >
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
              {material.title}
            </h2>
            {material.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {material.description}
              </p>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="ml-4 flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            aria-label="Fechar"
          >
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Conteúdo do Visualizador */}
        <div className="flex-1 overflow-hidden">
          {renderViewer()}
        </div>

        {/* Footer (opcional) */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="capitalize">{material.type.toUpperCase()}</span>
            <span>•</span>
            <span>{material.size}</span>
            {material.uploadDate && (
              <>
                <span>•</span>
                <span>
                  Enviado em {new Date(material.uploadDate).toLocaleDateString('pt-BR')}
                </span>
              </>
            )}
          </div>
          
          <button
            onClick={() => window.open(material.downloadUrl, '_blank')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Download
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
