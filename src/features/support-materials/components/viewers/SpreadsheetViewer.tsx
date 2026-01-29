/**
 * SpreadsheetViewer - Visualizador de planilhas (XLSX, XLS, CSV) usando SheetJS
 * Renderiza planilhas Excel diretamente no navegador
 */

import React, { useEffect, useState } from 'react'
import { TableDocument } from 'iconsax-react'
import * as XLSX from 'xlsx'

interface SpreadsheetViewerProps {
  /** URL do arquivo de planilha */
  url: string
  /** Título do arquivo */
  title: string
  /** Tamanho do arquivo formatado */
  size?: string
}

export const SpreadsheetViewer: React.FC<SpreadsheetViewerProps> = ({
  url,
  title,
  size,
}) => {
  const [sheets, setSheets] = useState<{ name: string; html: string }[]>([])
  const [activeSheet, setActiveSheet] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSpreadsheet = async () => {
      try {
        setLoading(true)
        setError(null)

        // Buscar o arquivo
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Erro ao carregar a planilha')
        }

        const arrayBuffer = await response.arrayBuffer()

        // Ler a planilha
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })

        // Converter cada aba para HTML
        const sheetsData = workbook.SheetNames.map((sheetName) => {
          const worksheet = workbook.Sheets[sheetName]
          const html = XLSX.utils.sheet_to_html(worksheet, {
            id: 'spreadsheet-table',
            editable: false,
          })
          return { name: sheetName, html }
        })

        setSheets(sheetsData)
        setLoading(false)
      } catch (err) {
        console.error('Erro ao processar planilha:', err)
        setError(
          'Não foi possível visualizar esta planilha. Tente fazer o download.'
        )
        setLoading(false)
      }
    }

    loadSpreadsheet()
  }, [url])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-12 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Carregando planilha...
          </p>
        </div>
      </div>
    )
  }

  if (error || sheets.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-12 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
        {/* Ícone da planilha */}
        <div className="flex items-center justify-center w-32 h-32 rounded-full bg-green-100 dark:bg-green-900">
          <TableDocument
            size={64}
            className="text-green-600 dark:text-green-400"
            variant="Bold"
          />
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
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              {error}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Toolbar - Responsivo */}
      <div className="flex items-center gap-2 md:gap-4 overflow-x-auto px-3 py-2 md:p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 flex-shrink-0">
          <TableDocument
            size={18}
            className="text-green-600 dark:text-green-400 md:w-5 md:h-5"
          />
          <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
            Visualização da Planilha
          </span>
        </div>

        {/* Abas */}
        {sheets.length > 1 && (
          <div className="flex gap-1 md:gap-2">
            {sheets.map((sheet, index) => (
              <button
                key={index}
                onClick={() => setActiveSheet(index)}
                className={`px-2 py-1 md:px-3 text-xs md:text-sm rounded-md transition-colors whitespace-nowrap ${
                  activeSheet === index
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {sheet.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Conteúdo da planilha - Com scroll horizontal no mobile */}
      <div className="flex-1 overflow-auto p-2 md:p-4">
        <div className="overflow-x-auto">
          <div
            className="spreadsheet-container min-w-max"
            dangerouslySetInnerHTML={{ __html: sheets[activeSheet].html }}
            style={
              {
                '--table-border': '1px solid #e5e7eb',
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      <style>{`
        .spreadsheet-container table {
          border-collapse: collapse;
          width: 100%;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .spreadsheet-container th,
        .spreadsheet-container td {
          border: 1px solid #e5e7eb;
          padding: 6px 10px;
          text-align: left;
          font-size: 12px;
        }
        @media (min-width: 768px) {
          .spreadsheet-container th,
          .spreadsheet-container td {
            padding: 8px 12px;
            font-size: 13px;
          }
        }
        .spreadsheet-container th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        .spreadsheet-container tr:hover {
          background-color: #f9fafb;
        }
        .dark .spreadsheet-container table {
          background: #1f2937;
        }
        .dark .spreadsheet-container th,
        .dark .spreadsheet-container td {
          border-color: #374151;
          color: #e5e7eb;
        }
        .dark .spreadsheet-container th {
          background-color: #374151;
          color: #f3f4f6;
        }
        .dark .spreadsheet-container tr:hover {
          background-color: #374151;
        }
      `}</style>
    </div>
  )
}
