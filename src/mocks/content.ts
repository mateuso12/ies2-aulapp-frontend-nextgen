/**
 * Mock de conteúdo para desenvolvimento
 * Curso: Contas a Pagar
 */

export interface ContentPage {
  id: string
  title: string
  contentHtml: string
}

const h1 = (text: string, classes = '') =>
  `<h1 class="text-4xl font-bold mb-6 font-['Baloo_Bhaijaan_2'] text-blue-600 ${classes}">${text}</h1>`

const h2 = (text: string, classes = '') =>
  `<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-700 ${classes}">${text}</h2>`

const p = (text: string, classes = '') =>
  `<p class="mb-4 text-lg leading-relaxed ${classes}">${text}</p>`

const ul = (items: string[], classes = '') =>
  `<ul class="list-disc list-inside space-y-2 mb-8 ml-4 ${classes}">${items
    .map((item) => `<li>${item}</li>`)
    .join('')}</ul>`

const box = (content: string, bgColor: string, borderColor: string) =>
  `<div class="my-8 p-6 ${bgColor} rounded-lg border ${borderColor}">${content}</div>`

const image = (src: string, alt: string) =>
  `<div class="my-8">
    <img src="${src}" alt="${alt}" class="w-full rounded-lg border border-neutral-200" loading="lazy" />
  </div>`

const videoIframe = (src: string, title: string) =>
  `<div class="my-8 w-full overflow-hidden rounded-lg border border-neutral-200">
    <div class="w-full aspect-video">
      <iframe
        class="h-full w-full"
        src="${src}"
        title="${title}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
  </div>`

export const mockContentPages: ContentPage[] = [
  {
    id: 'content-1',
    title: 'O que é Contas a Pagar?',
    contentHtml: `
      ${h1('Curso de Contas a Pagar')}
      ${h2('O que é Contas a Pagar?')}
      ${p('Contas a Pagar é o setor responsável por controlar e organizar os pagamentos da empresa.')}
      ${p('Envolve todas as obrigações financeiras que a empresa precisa pagar.')}
      ${box(
        `${ul(['Aluguel', 'Água, luz e internet', 'Fornecedores', 'Salários e impostos'])}`,
        'bg-blue-50',
        'border-blue-100'
      )}
      ${image('/imgs/contas-a-pagar/image1.png', 'Ilustração de contas a pagar com calculadora e prancheta')}
    `,
  },
  {
    id: 'content-2',
    title: 'Importância do Contas a Pagar',
    contentHtml: `
      ${h2('Por que o Contas a Pagar é importante?')}
      ${ul([
        'Evita atrasos e multas',
        'Mantém a empresa organizada financeiramente',
        'Ajuda no controle do caixa',
        'Garante um bom relacionamento com fornecedores',
      ])}
      ${image('/imgs/contas-a-pagar/image2.png', 'Planilha de controle de contas a pagar')}
    `,
  },
  {
    id: 'content-3',
    title: 'Rotina do setor',
    contentHtml: `
      ${h2('O que o setor de Contas a Pagar faz?')}
      ${ul([
        'Recebe contas e notas fiscais',
        'Confere valores e prazos',
        'Agenda pagamentos',
        'Registra os pagamentos realizados',
      ])}
      ${image('/imgs/contas-a-pagar/image3.jpg', 'Profissionais discutindo rotinas financeiras')}
    `,
  },
  {
    id: 'content-4',
    title: 'Tipos de contas',
    contentHtml: `
      ${h2('Tipos de contas mais comuns')}
      ${box(
        `${ul([
          'Contas fixas: aluguel, energia, internet',
          'Contas variáveis: compras de fornecedores, manutenção',
          'Impostos e taxas: impostos municipais, estaduais e federais',
        ])}`,
        'bg-emerald-50',
        'border-emerald-100'
      )}
      ${image('/imgs/contas-a-pagar/image4.png', 'Profissional organizando documentos de pagamento')}
    `,
  },
  {
    id: 'content-5',
    title: 'Conceitos básicos',
    contentHtml: `
      ${h2('Conceitos básicos importantes')}
      ${ul([
        'Data de vencimento: dia limite para pagar',
        'Valor: quanto deve ser pago',
        'Fornecedor: quem vai receber',
        'Forma de pagamento: boleto, pix, transferência',
      ])}
      ${image('/imgs/contas-a-pagar/image5.jpg', 'Mesa com notebook, calculadora e relatórios financeiros')}
    `,
  },
  {
    id: 'content-6',
    title: 'Organização e controle',
    contentHtml: `
      ${h2('Organização é fundamental')}
      ${ul([
        'Controle por planilha ou sistema',
        'Conferência antes do pagamento',
        'Registro após o pagamento',
        'Arquivamento dos comprovantes',
      ])}
      ${image('/imgs/contas-a-pagar/image6.jpeg', 'Conceito de investimento e controle financeiro')}
    `,
  },
  {
    id: 'content-7',
    title: 'Vídeo explicativo',
    contentHtml: `
      ${h2('Vídeo explicativo')}
      ${p('Veja mais sobre contas a pagar no vídeo a seguir:')}
      ${videoIframe('https://www.youtube.com/embed/jWF95xWHA10', 'Vídeo explicativo sobre Contas a Pagar')}
    `,
  },
]

export const mockContentApi = {
  async getContentById(id: string): Promise<ContentPage | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockContentPages.find((page) => page.id === id) || null
  },

  async getContentByIds(ids: string[]): Promise<ContentPage[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockContentPages.filter((page) => ids.includes(page.id))
  },

  async getContentByResource(_resourceId: string): Promise<ContentPage[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockContentPages
  },
}
