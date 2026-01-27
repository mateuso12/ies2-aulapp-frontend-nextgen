/**
 * FileViewerModal - Modal principal para visualização de arquivos
 * Usa o UniversalFileViewer para suportar múltiplos tipos
 */

import React from 'react'
import { CloseCircle } from 'iconsax-react'
import { UniversalFileViewer } from './viewers'
import type { SupportMaterial } from '@/mocks/supportMaterials'
import { X } from 'lucide-react'

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
  if (!material || !isOpen) return null

  return (
    <>
      {/* Backdrop - Começa abaixo do header */}
      <div className="fixed top-[60px] md:top-[88px] left-0 right-0 bottom-0 z-30 bg-black/50 backdrop-blur-sm animate-in fade-in" />

      {/* Modal Container - Centralizado e Responsivo, começa abaixo do header */}
      <div
        className="fixed top-[60px] md:top-[88px] left-0 right-0 bottom-0 z-30 flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        <div
          className="relative w-full h-full max-h-[calc(100vh-60px-2rem)] md:max-h-[calc(100vh-88px-4rem)] md:max-w-6xl md:rounded-2xl bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header do Modal */}
          <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
            <div className="flex-1 min-w-0 mr-4">
              <h2 className="text-base md:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                {material.title}
              </h2>
              {material.source && (
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1 truncate">
                  {material.source}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
              aria-label="Fechar"
              title="Fechar (Esc)"
            >
              <X
                size={24}
                className="md:w-7 md:h-7 text-gray-700 dark:text-gray-200"
                color="currentColor"
              />
            </button>
          </div>

          {/* Conteúdo do Visualizador */}
          <div className="flex-1 overflow-hidden">
            <UniversalFileViewer material={material} />
          </div>

          {/* Footer - Responsivo */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4 px-4 py-3 md:px-6 md:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-400">
              <span className="capitalize font-medium">
                {material.type.toUpperCase()}
              </span>
              <span className="hidden md:inline">•</span>
              <span>{material.size}</span>
              {material.uploadDate && (
                <>
                  <span className="hidden md:inline">•</span>
                  <span className="hidden sm:inline">
                    Enviado em{' '}
                    {new Date(material.uploadDate).toLocaleDateString('pt-BR')}
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => window.open(material.downloadUrl, '_blank')}
              className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
