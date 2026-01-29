/**
 * Mock de materiais de apoio para desenvolvimento
 * Preparado para futura integração com backend
 */

export interface SupportMaterial {
  id: string
  title: string
  type:
    | 'pdf'
    | 'doc'
    | 'docx'
    | 'xls'
    | 'xlsx'
    | 'ppt'
    | 'pptx'
    | 'zip'
    | 'rar'
    | '7z'
    | 'epub'
    | 'mobi'
    | 'video'
    | 'mp4'
    | 'webm'
    | 'avi'
    | 'mov'
    | 'image'
    | 'png'
    | 'jpg'
    | 'jpeg'
    | 'svg'
    | 'gif'
    | 'webp'
    | 'bmp'
    | 'mp3'
    | 'audio'
    | 'wav'
    | 'ogg'
    | 'm4a'
    | 'other'
  size: string
  sizeInBytes: number
  duration?: string // Para vídeos e áudios
  source?: string // Fonte/origem do material
  downloadUrl: string
  uploadDate?: Date
}

/**
 * Mock de materiais de apoio
 */
export const mockSupportMaterials: SupportMaterial[] = [
  {
    id: 'mat-001',
    title: 'Checklist Fundos Imobiliários',
    type: 'pdf',
    size: '1.8MB',
    sizeInBytes: 1887436,
    source: 'Portal de Investimentos FII',
    downloadUrl: '/docs-test/CHECKLIST+FUNDOS+IMOBILIA_RIOS.pdf',
    uploadDate: new Date('2026-01-15'),
  },
  {
    id: 'mat-002',
    title: 'Relatório 10000 Clientes',
    type: 'xlsx',
    size: '856KB',
    sizeInBytes: 876544,
    source: 'Sistema CRM Interno',
    downloadUrl: '/docs-test/10000-customers.xlsx',
    uploadDate: new Date('2026-01-10'),
  },
  {
    id: 'mat-003',
    title: 'Documento Exemplo Word',
    type: 'docx',
    size: '45KB',
    sizeInBytes: 46080,
    source: 'Biblioteca de Templates',
    downloadUrl: '/docs-test/sample3.docx',
    uploadDate: new Date('2026-01-12'),
  },
  {
    id: 'mat-004',
    title: 'Captura de Tela - Interface',
    type: 'png',
    size: '280KB',
    sizeInBytes: 286720,
    source: 'Time de Design UI/UX',
    downloadUrl: '/docs-test/Captura de tela de 2026-01-19 14-16-24.png',
    uploadDate: new Date('2026-01-19'),
  },
  {
    id: 'mat-005',
    title: 'Apresentação Corporativa',
    type: 'ppt',
    size: '1MB',
    sizeInBytes: 1048576,
    source: 'Marketing Institucional',
    downloadUrl: '/docs-test/file_example_PPT_1MB.ppt',
    uploadDate: new Date('2026-01-20'),
  },
  {
    id: 'mat-006',
    title: 'Áudio Exemplo - Treinamento',
    type: 'wav',
    size: '10MB',
    sizeInBytes: 10485760,
    source: 'Departamento de RH',
    downloadUrl: '/docs-test/file_example_WAV_10MG.wav',
    uploadDate: new Date('2026-01-21'),
  },
  {
    id: 'mat-007',
    title: 'Vídeo Tutorial - Sistema',
    type: 'mp4',
    size: '18MB',
    sizeInBytes: 18874368,
    duration: '3:25',
    source: 'Time de Suporte Técnico',
    downloadUrl: '/docs-test/file_example_MP4_1920_18MG.mp4',
    uploadDate: new Date('2026-01-22'),
  },
  {
    id: 'mat-008',
    title: 'Around the World in 28 Languages',
    type: 'epub',
    size: '2.5MB',
    sizeInBytes: 2621440,
    source: 'Biblioteca Digital',
    downloadUrl: '/docs-test/Around the World in 28 Languages.epub',
    uploadDate: new Date('2026-01-27'),
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
