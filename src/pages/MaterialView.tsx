/**
 * MaterialView - Renderiza lista de materiais de apoio para download
 */

import React, { useState } from 'react'
import { Download, Eye } from 'lucide-react'
import { FileViewerModal } from '@/features/support-materials/components'
import type { SupportMaterial } from '@/mocks/supportMaterials'

interface MaterialViewProps {
  /** Lista de materiais disponíveis */
  materials: SupportMaterial[]
  /** Callback quando o usuário clica para baixar um material */
  onDownload: (materialId: string) => void
}

// Mapeia tipos de arquivo para cores de badge
const getFileTypeInfo = (
  type: SupportMaterial['type']
): { label: string; colorClass: string } => {
  const typeUpper = type.toUpperCase()

  switch (type) {
    case 'pdf':
      return {
        label: 'PDF',
        colorClass:
          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      }
    case 'doc':
    case 'docx':
      return {
        label: typeUpper,
        colorClass:
          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      }
    case 'xls':
    case 'xlsx':
      return {
        label: typeUpper,
        colorClass:
          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      }
    case 'ppt':
    case 'pptx':
      return {
        label: typeUpper,
        colorClass:
          'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      }
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
    case 'gif':
    case 'webp':
    case 'bmp':
    case 'image':
      return {
        label: typeUpper,
        colorClass:
          'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      }
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'm4a':
    case 'audio':
      return {
        label: typeUpper,
        colorClass:
          'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      }
    case 'mp4':
    case 'webm':
    case 'avi':
    case 'mov':
    case 'video':
      return {
        label: typeUpper,
        colorClass:
          'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      }
    case 'zip':
    case 'rar':
    case '7z':
      return {
        label: typeUpper,
        colorClass:
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      }
    case 'epub':
    case 'mobi':
      return {
        label: typeUpper,
        colorClass:
          'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      }
    default:
      return {
        label: typeUpper,
        colorClass:
          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      }
  }
}

// Mapeia tipos de arquivo para ícones SVG
const getFileIcon = (type: SupportMaterial['type']) => {
  const iconClass = 'w-12 h-12 text-gray-600'

  switch (type) {
    case 'pdf':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6" />
          <path d="M9 13h6M9 17h6" />
        </svg>
      )
    case 'docx':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6" />
          <path d="M10 12l2 3 2-3M10 18l2-3 2 3" />
        </svg>
      )
    case 'xlsx':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8M8 17h8" />
        </svg>
      )
    default:
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6" />
        </svg>
      )
  }
}

export const MaterialView: React.FC<MaterialViewProps> = ({
  materials,
  onDownload,
}) => {
  const [selectedMaterial, setSelectedMaterial] =
    useState<SupportMaterial | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const handleView = (material: SupportMaterial) => {
    setSelectedMaterial(material)
    setIsViewerOpen(true)
  }

  const handleCloseViewer = () => {
    setIsViewerOpen(false)
    // Aguarda a animação de fechamento antes de limpar o material
    setTimeout(() => setSelectedMaterial(null), 300)
  }

  return (
    <>
      <div className="w-full h-full flex items-center justify-center p-3 md:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-xl p-4 md:p-8 lg:p-12">
          {/* Lista de materiais */}
          <div className="space-y-3 md:space-y-4">
            {materials.map((material) => (
              <div
                key={material.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all group gap-3 md:gap-0"
              >
                {/* Ícone + Info */}
                <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
                  {/* Ícone do arquivo */}
                  <div className="flex-shrink-0 hidden sm:block">
                    {getFileIcon(material.type)}
                  </div>

                  {/* Informações do arquivo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {material.title}
                      </h3>
                      {/* Badge de tipo de arquivo */}
                      <span
                        className={`px-2 py-0.5 text-xs font-bold rounded-md whitespace-nowrap flex-shrink-0 ${getFileTypeInfo(material.type).colorClass}`}
                      >
                        {getFileTypeInfo(material.type).label}
                      </span>
                    </div>
                    {material.source && (
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                        {material.source}
                      </p>
                    )}
                    {/* Tamanho do arquivo - Mobile */}
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block md:hidden">
                      {material.size}
                    </span>
                  </div>
                </div>

                {/* Tamanho + Botões - Desktop */}
                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 md:ml-4">
                  {/* Tamanho do arquivo - Desktop */}
                  <span className="hidden md:block text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[80px] text-right">
                    {material.size}
                  </span>

                  {/* Botão de visualização */}
                  <button
                    onClick={() => handleView(material)}
                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 transition-all group-hover:scale-110"
                    aria-label={`Visualizar ${material.title}`}
                    title={`Visualizar ${material.title}`}
                  >
                    <Eye size={18} className="md:w-5 md:h-5" />
                  </button>

                  {/* Botão de download */}
                  <button
                    onClick={() => onDownload(material.id)}
                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-all group-hover:scale-110"
                    aria-label={`Download ${material.title}`}
                    title={`Download ${material.title}`}
                  >
                    <Download size={18} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mensagem quando não há materiais */}
          {materials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
                Nenhum material de apoio disponível.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Visualização */}
      <FileViewerModal
        material={selectedMaterial}
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
      />
    </>
  )
}
