/**
 * Mock de materiais de apoio para desenvolvimento
 * Preparado para futura integração com backend
 */

export interface SupportMaterial {
  id: string
  title: string
  type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'zip' | 'video' | 'image' | 'png' | 'jpg' | 'jpeg' | 'svg' | 'gif' | 'webp' | 'mp3' | 'audio' | 'wav' | 'ogg' | 'other'
  size: string
  sizeInBytes: number
  duration?: string // Para vídeos e áudios
  description?: string
  downloadUrl: string
  uploadDate?: Date
}

/**
 * Mock de materiais de apoio
 */
export const mockSupportMaterials: SupportMaterial[] = [
  {
    id: 'mat-001',
    title: 'Apostila de Matemática Básica',
    type: 'pdf',
    size: '1.2MB',
    sizeInBytes: 1258291,
    description: 'Conteúdo completo sobre operações matemáticas fundamentais',
    downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadDate: new Date('2026-01-15'),
  },
  {
    id: 'mat-002',
    title: 'Exemplo de Documento PDF',
    type: 'pdf',
    size: '53KB',
    sizeInBytes: 54272,
    description: 'Documento de teste para visualização',
    downloadUrl: 'https://pdfobject.com/pdf/sample.pdf',
    uploadDate: new Date('2026-01-10'),
  },
  {
    id: 'mat-003',
    title: 'Foto de Exemplo - Natureza',
    type: 'image',
    size: '1.8MB',
    sizeInBytes: 1887436,
    description: 'Imagem em alta resolução para testes',
    downloadUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    uploadDate: new Date('2026-01-12'),
  },
  {
    id: 'mat-004',
    title: 'Áudio Exemplo - Som Ambiente',
    type: 'mp3',
    size: '2.4MB',
    sizeInBytes: 2516582,
    description: 'Arquivo de áudio para demonstração',
    duration: '0:45',
    downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    uploadDate: new Date('2026-01-08'),
  },
  {
    id: 'mat-005',
    title: 'Imagem SVG - Diagrama',
    type: 'svg',
    size: '12KB',
    sizeInBytes: 12288,
    description: 'Gráfico vetorial escalável',
    downloadUrl: 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/410.svg',
    uploadDate: new Date('2026-01-14'),
  },
  {
    id: 'mat-006',
    title: 'Documento Word - Relatório',
    type: 'docx',
    size: '280KB',
    sizeInBytes: 286720,
    description: 'Relatório trimestral em formato Word',
    downloadUrl: 'https://file-examples.com/storage/fe7e156330a96190476c534/2017/02/file-sample_100kB.doc',
    uploadDate: new Date('2026-01-05'),
  },
  {
    id: 'mat-007',
    title: 'Planilha Excel - Dados Estatísticos',
    type: 'xlsx',
    size: '68KB',
    sizeInBytes: 69632,
    description: 'Planilha com análise de dados',
    downloadUrl: 'https://file-examples.com/storage/fe7e156330a96190476c534/2017/02/file_example_XLS_10.xls',
    uploadDate: new Date('2026-01-03'),
  },
  {
    id: 'mat-008',
    title: 'Imagem PNG - Código de Programação',
    type: 'png',
    size: '856KB',
    sizeInBytes: 876544,
    description: 'Screenshot de código em alta qualidade',
    downloadUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=80',
    uploadDate: new Date('2026-01-18'),
  },
]

/**
 * API mock para simular chamadas ao backend
 */
export const mockSupportMaterialsApi = {
  /**
   * GET /api/materials/{id}
   * Busca um material por ID
   */
  async getMaterialById(id: string): Promise<SupportMaterial | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockSupportMaterials.find((material) => material.id === id) || null
  },

  /**
   * GET /api/materials?ids={ids}
   * Busca múltiplos materiais por IDs
   */
  async getMaterialsByIds(ids: string[]): Promise<SupportMaterial[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockSupportMaterials.filter((material) => ids.includes(material.id))
  },

  /**
   * GET /api/resources/{resourceId}/materials
   * Busca todos os materiais de um recurso
   */
  async getMaterialsByResource(
    _resourceId: string
  ): Promise<SupportMaterial[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    // Mock: retorna todos os materiais para qualquer resourceId
    return mockSupportMaterials
  },

  /**
   * POST /api/materials/{id}/download
   * Registra download e retorna URL
   */
  async downloadMaterial(id: string): Promise<{ url: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const material = mockSupportMaterials.find((m) => m.id === id)
    if (!material) {
      throw new Error('Material not found')
    }
    return { url: material.downloadUrl }
  },
}
