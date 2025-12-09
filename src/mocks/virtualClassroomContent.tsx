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
  {
    id: 5,
    title: 'Geometria Plana',
    content: (
      <>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">
          Geometria Plana
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          A geometria plana estuda as figuras que possuem apenas duas dimensões:
          comprimento e largura.
        </p>
        <div className="flex gap-4 my-8 justify-center">
          <div className="w-24 h-24 border-2 border-blue-500 bg-blue-100 flex items-center justify-center">
            Quadrado
          </div>
          <div className="w-24 h-24 rounded-full border-2 border-red-500 bg-red-100 flex items-center justify-center">
            Círculo
          </div>
          <div className="w-0 h-0 border-l-50 border-l-transparent border-b-100 border-b-green-500 border-r-50 border-r-transparent relative">
            <span className="absolute top-12 -left-4 text-white font-bold text-xs">
              Triângulo
            </span>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 6,
    title: 'Álgebra Elementar',
    content: (
      <>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">
          Álgebra Elementar
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          A álgebra introduz o uso de letras para representar números
          desconhecidos em equações.
        </p>
        <div className="p-6 bg-gray-100 rounded-lg font-mono text-xl text-center my-6">
          x + 5 = 10 <br />x = 5
        </div>
      </>
    ),
  },
  {
    id: 7,
    title: 'Frações e Decimais',
    content: (
      <>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">
          Frações e Decimais
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Frações representam partes de um todo. Decimais são outra forma de
          representar números fracionários.
        </p>
        <div className="grid grid-cols-2 gap-8 my-6">
          <div className="text-center p-4 border rounded">
            <div className="text-3xl font-bold">1/2</div>
            <div className="text-sm text-gray-500">Metade</div>
          </div>
          <div className="text-center p-4 border rounded">
            <div className="text-3xl font-bold">0.5</div>
            <div className="text-sm text-gray-500">Cinco décimos</div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 8,
    title: 'Porcentagem',
    content: (
      <>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">
          Porcentagem
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Porcentagem é uma medida de razão com base 100. É amplamente usada
          para calcular descontos, juros e estatísticas.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-6 mb-4 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-6 rounded-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none"
            style={{ width: '75%' }}
          >
            {' '}
            75%
          </div>
        </div>
      </>
    ),
  },
  {
    id: 9,
    title: 'Estatística Básica',
    content: (
      <>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">
          Estatística Básica
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Média, moda e mediana são conceitos centrais para analisar conjuntos
          de dados.
        </p>
      </>
    ),
  },
  {
    id: 10,
    title: 'Probabilidade',
    content: (
      <>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">
          Probabilidade
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Estuda as chances de um evento ocorrer. Fundamental para jogos,
          previsões meteorológicas e riscos.
        </p>
      </>
    ),
  },
  {
    id: 11,
    title: 'Teorema de Pitágoras',
    content: (
      <>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">
          Teorema de Pitágoras
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Em um triângulo retângulo, o quadrado da hipotenusa é igual à soma dos
          quadrados dos catetos.
        </p>
        <div className="text-center text-2xl font-serif italic my-6">
          a² + b² = c²
        </div>
      </>
    ),
  },
  {
    id: 12,
    title: 'Trigonometria',
    content: (
      <>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">
          Trigonometria
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Estuda as relações entre os ângulos e os lados dos triângulos. Seno,
          Cosseno e Tangente.
        </p>
      </>
    ),
  },
  {
    id: 13,
    title: 'Funções',
    content: (
      <>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">Funções</h2>
        <p className="mb-4 text-lg leading-relaxed">
          Uma relação entre dois conjuntos onde cada elemento do primeiro
          conjunto se associa a um único elemento do segundo.
        </p>
        <div className="p-4 border border-dashed border-gray-400 rounded text-center">
          f(x) = y
        </div>
      </>
    ),
  },
  {
    id: 14,
    title: 'Logaritmos',
    content: (
      <>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">
          Logaritmos
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          O inverso da exponenciação. Usado para medir escalas como Richter
          (terremotos) e pH (química).
        </p>
      </>
    ),
  },
  {
    id: 15,
    title: 'Conclusão',
    content: (
      <>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">
          Conclusão do Curso
        </h2>
        <p className="mb-4 text-lg leading-relaxed">
          Parabéns por completar a introdução à matemática! Continue praticando
          para dominar esses conceitos.
        </p>
        <div className="flex justify-center my-10">
          <div className="text-6xl">🎓</div>
        </div>
      </>
    ),
  },
]
