export interface ContentPage {
  id: number
  title: string
  content: React.ReactNode
}

export const mockContentPages: ContentPage[] = [
  {
    id: 1,
    title: 'Introdução à Matemática',
    content: (
      <>
        <h1 className="text-4xl font-bold mb-6 font-['Baloo_Bhaijaan_2'] text-blue-600">
          Introdução à Matemática
        </h1>
        <p className="mb-4 text-lg leading-relaxed">
          A matemática é a ciência do raciocínio lógico e abstrato, que estuda
          quantidades, medidas, espaços, estruturas, variações e estatísticas.
        </p>
        <div className="my-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-xl font-bold mb-2 text-blue-800">
            Conceito Chave
          </h3>
          <p>
            Números são objetos matemáticos usados para descrever quantidade,
            ordem ou medida.
          </p>
        </div>
        <p className="mb-4 text-lg leading-relaxed">
          Desde a antiguidade, a matemática tem sido fundamental para o
          desenvolvimento da civilização humana, sendo aplicada em diversas
          áreas como engenharia, física, biologia, economia e computação.
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: 'Tópicos da Aula',
    content: (
      <>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">
          Tópicos da Aula
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-8 ml-4">
          <li>História dos Números</li>
          <li>Operações Básicas</li>
          <li>Geometria Plana</li>
          <li>Álgebra Elementar</li>
        </ul>
        <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-8">
          <span className="text-gray-500">Espaço para Imagem / Diagrama</span>
        </div>
        <p className="mb-4 text-lg leading-relaxed">
          Vamos começar explorando como os números surgiram da necessidade de
          contar objetos e medir terras.
        </p>
      </>
    ),
  },
  {
    id: 3,
    title: 'História dos Números',
    content: (
      <>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">
          História dos Números
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Os primeiros registros numéricos datam de milhares de anos atrás, com
          os sumérios e egípcios desenvolvendo sistemas para contabilidade e
          astronomia.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          O sistema decimal que usamos hoje tem origem na Índia e foi difundido
          pelos árabes na Europa durante a Idade Média.
        </p>
      </>
    ),
  },
  {
    id: 4,
    title: 'Operações Básicas',
    content: (
      <>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">
          Operações Básicas
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          As quatro operações fundamentais da aritmética são: adição, subtração,
          multiplicação e divisão.
        </p>
        <div className="grid grid-cols-2 gap-4 my-8">
          <div className="p-4 bg-green-50 rounded border border-green-100">
            <h4 className="font-bold text-green-800">Adição (+)</h4>
            <p>Soma de quantidades.</p>
          </div>
          <div className="p-4 bg-red-50 rounded border border-red-100">
            <h4 className="font-bold text-red-800">Subtração (-)</h4>
            <p>Diferença entre quantidades.</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded border border-yellow-100">
            <h4 className="font-bold text-yellow-800">Multiplicação (×)</h4>
            <p>Soma repetida.</p>
          </div>
          <div className="p-4 bg-purple-50 rounded border border-purple-100">
            <h4 className="font-bold text-purple-800">Divisão (÷)</h4>
            <p>Partição em partes iguais.</p>
          </div>
        </div>
      </>
    ),
  },
]
