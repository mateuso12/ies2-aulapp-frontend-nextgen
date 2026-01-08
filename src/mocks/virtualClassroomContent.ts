/**
 * Mock de conteúdo de páginas da Sala Virtual.
 *
 * Cada página pode ter:
 * - `content`: ReactNode para renderização direta (legado)
 * - `contentHtml`: String HTML para uso com TextHighlighter
 *
 * Em produção, virá apenas `contentHtml` do backend.
 */

export interface ContentPage {
  id: number
  title: string
  /** Conteúdo JSX para renderização direta (legado/fallback) */
  content?: React.ReactNode
  /** HTML string para uso com TextHighlighter */
  contentHtml: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers para gerar HTML com classes Tailwind
// ─────────────────────────────────────────────────────────────────────────────

const h1 = (text: string, classes = '') =>
  `<h1 class="text-4xl font-bold mb-6 font-['Baloo_Bhaijaan_2'] text-blue-600 ${classes}">${text}</h1>`

const h2 = (text: string, classes = '') =>
  `<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-700 ${classes}">${text}</h2>`

const h3 = (text: string, classes = '') =>
  `<h3 class="text-xl font-bold mb-2 text-blue-800 ${classes}">${text}</h3>`

const h4 = (text: string, classes = '') =>
  `<h4 class="font-bold ${classes}">${text}</h4>`

const p = (text: string, classes = '') =>
  `<p class="mb-4 text-lg leading-relaxed ${classes}">${text}</p>`

const ul = (items: string[], classes = '') =>
  `<ul class="list-disc list-inside space-y-2 mb-8 ml-4 ${classes}">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`

const ol = (items: string[], classes = '') =>
  `<ol class="list-decimal list-inside space-y-2 mb-8 ml-4 ${classes}">${items.map((i) => `<li>${i}</li>`).join('')}</ol>`

const box = (content: string, bgColor: string, borderColor: string) =>
  `<div class="my-8 p-6 ${bgColor} rounded-lg border ${borderColor}">${content}</div>`

const grid2 = (items: string[]) =>
  `<div class="grid grid-cols-2 gap-4 my-8">${items.join('')}</div>`

const card = (title: string, desc: string, bgClass: string, borderClass: string, textClass: string) =>
  `<div class="p-4 ${bgClass} rounded border ${borderClass}">
    ${h4(title, textClass)}
    <p>${desc}</p>
  </div>`

const placeholder = (text: string) =>
  `<div class="h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-8">
    <span class="text-gray-500">${text}</span>
  </div>`

const center = (content: string) =>
  `<div class="flex justify-center my-10">${content}</div>`

const emoji = (e: string, size = 'text-6xl') => `<div class="${size}">${e}</div>`

// ─────────────────────────────────────────────────────────────────────────────
// Dados das páginas
// ─────────────────────────────────────────────────────────────────────────────

export const mockContentPages: ContentPage[] = [
  {
    id: 1,
    title: 'Introdução à Matemática',
    contentHtml: `
      ${h1('Introdução à Matemática')}
      ${p('A matemática é a ciência do raciocínio lógico e abstrato, que estuda quantidades, medidas, espaços, estruturas, variações e estatísticas.')}
      ${box(`
        ${h3('Conceito Chave')}
        ${p('Números são objetos matemáticos usados para descrever quantidade, ordem ou medida.')}
      `, 'bg-blue-50', 'border-blue-100')}
      ${p('Desde a antiguidade, a matemática tem sido fundamental para o desenvolvimento da civilização humana, sendo aplicada em diversas áreas como engenharia, física, biologia, economia e computação.')}
    `,
  },
  {
    id: 2,
    title: 'Tópicos da Aula',
    contentHtml: `
      ${h2('Tópicos da Aula')}
      ${ul(['História dos Números', 'Operações Básicas', 'Geometria Plana', 'Álgebra Elementar'])}
      ${placeholder('Espaço para Imagem / Diagrama')}
      ${p('Vamos começar explorando como os números surgiram da necessidade de contar objetos e medir terras.')}
    `,
  },
  {
    id: 3,
    title: 'História dos Números',
    contentHtml: `
      ${h2('História dos Números')}
      ${p('Os primeiros registros numéricos datam de milhares de anos atrás, com os sumérios e egípcios desenvolvendo sistemas para contabilidade e astronomia.')}
      ${p('O sistema decimal que usamos hoje tem origem na Índia e foi difundido pelos árabes na Europa durante a Idade Média.')}
    `,
  },
  {
    id: 4,
    title: 'Operações Básicas',
    contentHtml: `
      ${h2('Operações Básicas')}
      ${p('As quatro operações fundamentais da aritmética são: adição, subtração, multiplicação e divisão.')}
      ${grid2([
        card('Adição (+)', 'Soma de quantidades.', 'bg-green-50', 'border-green-100', 'text-green-800'),
        card('Subtração (-)', 'Diferença entre quantidades.', 'bg-red-50', 'border-red-100', 'text-red-800'),
        card('Multiplicação (×)', 'Soma repetida.', 'bg-yellow-50', 'border-yellow-100', 'text-yellow-800'),
        card('Divisão (÷)', 'Partição em partes iguais.', 'bg-purple-50', 'border-purple-100', 'text-purple-800'),
      ])}
    `,
  },
  {
    id: 5,
    title: 'Geometria Plana',
    contentHtml: `
      ${h2('Geometria Plana')}
      ${p('A geometria plana estuda as figuras que possuem apenas duas dimensões: comprimento e largura.')}
      <div class="flex gap-4 my-8 justify-center">
        <div class="w-24 h-24 border-2 border-blue-500 bg-blue-100 flex items-center justify-center">Quadrado</div>
        <div class="w-24 h-24 rounded-full border-2 border-red-500 bg-red-100 flex items-center justify-center">Círculo</div>
        <div class="w-0 h-0 border-l-12 border-r-12 border-b-24 border-l-transparent border-r-transparent border-b-green-500"></div>
      </div>
    `,
  },
  {
    id: 6,
    title: 'Álgebra Elementar',
    contentHtml: `
      ${h2('Álgebra Elementar')}
      ${p('A álgebra usa letras para representar números desconhecidos e estabelecer relações gerais.')}
      ${box(`
        ${h3('Exemplo de Equação', 'text-green-800')}
        <p class="font-mono text-xl text-center my-4">2x + 5 = 15</p>
        <p>Resolver: x = 5</p>
      `, 'bg-green-50', 'border-green-100')}
    `,
  },
  {
    id: 7,
    title: 'Frações',
    contentHtml: `
      ${h2('Frações')}
      ${p('Uma fração representa uma parte de um todo e é escrita como numerador sobre denominador.')}
      <div class="flex justify-center items-center gap-8 my-8">
        <div class="text-center">
          <div class="text-4xl font-bold">1</div>
          <div class="border-t-2 border-gray-800 w-12 mx-auto"></div>
          <div class="text-4xl font-bold">2</div>
          <p class="mt-2 text-sm text-gray-600">um meio</p>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold">3</div>
          <div class="border-t-2 border-gray-800 w-12 mx-auto"></div>
          <div class="text-4xl font-bold">4</div>
          <p class="mt-2 text-sm text-gray-600">três quartos</p>
        </div>
      </div>
    `,
  },
  {
    id: 8,
    title: 'Números Decimais',
    contentHtml: `
      ${h2('Números Decimais')}
      ${p('Os números decimais representam quantidades menores que a unidade usando a vírgula (ou ponto) decimal.')}
      ${box(`
        <p class="font-mono text-lg">0,5 = 1/2 = 50%</p>
        <p class="font-mono text-lg">0,25 = 1/4 = 25%</p>
        <p class="font-mono text-lg">0,75 = 3/4 = 75%</p>
      `, 'bg-orange-50', 'border-orange-100')}
    `,
  },
  {
    id: 9,
    title: 'Porcentagem',
    contentHtml: `
      ${h2('Porcentagem')}
      ${p('Porcentagem significa "por cento" e é uma forma de expressar frações com denominador 100.')}
      ${ul(['10% de 200 = 20', '25% de 80 = 20', '50% de qualquer número = metade'])}
    `,
  },
  {
    id: 10,
    title: 'Razão e Proporção',
    contentHtml: `
      ${h2('Razão e Proporção')}
      ${p('Razão é a comparação entre duas grandezas. Proporção é a igualdade entre duas razões.')}
      ${box(`
        ${p('Se 2 está para 4, assim como 3 está para 6:')}
        <p class="font-mono text-xl text-center">2/4 = 3/6</p>
      `, 'bg-teal-50', 'border-teal-100')}
    `,
  },
  {
    id: 11,
    title: 'Potenciação',
    contentHtml: `
      ${h2('Potenciação')}
      ${p('Potenciação é a multiplicação de um número por ele mesmo, várias vezes.')}
      ${ul(['2³ = 2 × 2 × 2 = 8', '5² = 5 × 5 = 25', '10⁴ = 10.000'])}
    `,
  },
  {
    id: 12,
    title: 'Radiciação',
    contentHtml: `
      ${h2('Radiciação')}
      ${p('Radiciação é a operação inversa da potenciação. A raiz quadrada é a mais comum.')}
      ${box(`
        <p class="font-mono text-xl text-center">√16 = 4 (pois 4² = 16)</p>
        <p class="font-mono text-xl text-center">√25 = 5 (pois 5² = 25)</p>
      `, 'bg-indigo-50', 'border-indigo-100')}
    `,
  },
  {
    id: 13,
    title: 'Equações de Primeiro Grau',
    contentHtml: `
      ${h2('Equações de Primeiro Grau')}
      ${p('São equações onde a incógnita aparece com expoente 1.')}
      ${ol([
        'Identificar a incógnita (geralmente x)',
        'Isolar x em um lado da equação',
        'Realizar as operações inversas',
        'Verificar o resultado',
      ])}
    `,
  },
  {
    id: 14,
    title: 'Funções e Gráficos',
    contentHtml: `
      ${h2('Funções e Gráficos')}
      ${p('Uma função relaciona cada elemento de um conjunto a exatamente um elemento de outro conjunto.')}
      ${placeholder('Gráfico de Função Linear y = 2x + 1')}
      ${p('Gráficos ajudam a visualizar o comportamento de funções, como escalas de Richter (terremotos) e pH (química).')}
    `,
  },
  {
    id: 15,
    title: 'Conclusão',
    contentHtml: `
      ${h2('Conclusão do Curso')}
      ${p('Parabéns por completar a introdução à matemática! Continue praticando para dominar esses conceitos.')}
      ${center(emoji('🎓'))}
    `,
  },
]
