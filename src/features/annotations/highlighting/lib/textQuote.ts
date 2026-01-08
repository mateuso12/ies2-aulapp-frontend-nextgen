/**
 * Utilitários para extração de texto e contexto de seleções.
 *
 * Implementa algo similar ao TextQuoteSelector do W3C Web Annotation Model,
 * extraindo texto exato, prefixo e sufixo para verificação de correspondência.
 */

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Extrai o texto exato selecionado no range.
 *
 * @param range Range do DOM
 * @returns Texto normalizado (whitespace colapsado)
 */
export function extractExactText(range: Range): string {
  return normalizeWhitespace(range.toString())
}

/**
 * Extrai texto de contexto antes e depois da seleção.
 *
 * Útil para verificar se a âncora ainda corresponde ao conteúdo
 * quando o DOM muda (fallback para reposicionamento).
 *
 * @param range Range do DOM
 * @param wordCount Número de palavras de contexto (default: 5)
 * @returns Objeto com prefix e suffix (podem ser undefined)
 */
export function extractPrefixSuffix(
  range: Range,
  wordCount = 5
): { prefix?: string; suffix?: string } {
  const root = range.commonAncestorContainer

  // Helper para obter offset final de um nó
  const getEndOffset = (node: Node): number => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').length
    }
    return node.childNodes.length
  }

  const before = document.createRange()
  before.setStart(root, 0)
  before.setEnd(range.startContainer, range.startOffset)

  const after = document.createRange()
  after.setStart(range.endContainer, range.endOffset)
  after.setEnd(root, getEndOffset(root))

  const prefixWords = normalizeWhitespace(before.toString())
    .split(' ')
    .filter(Boolean)
  const suffixWords = normalizeWhitespace(after.toString())
    .split(' ')
    .filter(Boolean)

  const prefix =
    prefixWords.slice(Math.max(prefixWords.length - wordCount, 0)).join(' ') ||
    undefined
  const suffix = suffixWords.slice(0, wordCount).join(' ') || undefined

  return { prefix, suffix }
}

/**
 * Normaliza texto para comparação case-insensitive.
 *
 * @param text Texto a normalizar
 * @returns Texto lowercase com whitespace normalizado
 */
export function normalizeForMatch(text: string): string {
  return normalizeWhitespace(text).toLowerCase()
}
