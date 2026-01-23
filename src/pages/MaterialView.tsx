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

// Mapeia tipos de arquivo para ícones SVG
const getFileIcon = (type: SupportMaterial['type']) => {
  const iconClass = "w-12 h-12 text-gray-600"
  
  switch (type) {
    case 'pdf':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <path d="M14 2v6h6"/>
          <path d="M9 13h6M9 17h6"/>
        </svg>
      )
    case 'docx':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <path d="M14 2v6h6"/>
          <path d="M10 12l2 3 2-3M10 18l2-3 2 3"/>
        </svg>
      )
    case 'xlsx':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <path d="M14 2v6h6"/>
          <path d="M8 13h8M8 17h8"/>
        </svg>
      )
    default:
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <path d="M14 2v6h6"/>
        </svg>
      )
  }
}

export const MaterialView: React.FC<MaterialViewProps> = ({
  materials,
  onDownload,
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<SupportMaterial | null>(null)
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
      <div className="w-full h-full flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        {/* Lista de materiais */}
        <div className="space-y-4">
          {materials.map((material) => (
            <div
              key={material.id}
              className="flex items-center justify-between p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all group"
            >
              {/* Ícone + Info */}
              <div className="flex items-center gap-6 flex-1 min-w-0">
                {/* Ícone do arquivo */}
                <div className="flex-shrink-0">
                  {getFileIcon(material.type)}
                </div>

                {/* Informações do arquivo */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {material.title}
                  </h3>
                  {material.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {material.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Tamanho + Botão Visualizar + Botão Download */}
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                {/* Tamanho do arquivo */}
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[80px] text-right">
                  {material.size}
                </span>

                {/* Botão de visualização */}
                <button
                  onClick={() => handleView(material)}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 transition-all group-hover:scale-110"
                  aria-label={`Visualizar ${material.title}`}
                  title={`Visualizar ${material.title}`}
                >
                  <Eye size={20} />
                </button>

                {/* Botão de download */}
                <button
                  onClick={() => onDownload(material.id)}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-all group-hover:scale-110"
                  aria-label={`Download ${material.title}`}
                  title={`Download ${material.title}`}
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há materiais */}
        {materials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
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
