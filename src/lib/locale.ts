/**
 * Normaliza o locale do projeto para o formato esperado pelo ui-kit
 * 
 * Projeto usa: pt-BR, en, es
 * UI-Kit espera: pt-BR, en-US, es
 */
export function normalizeLocaleForUIKit(locale: string): string {
  const localeMap: Record<string, string> = {
    'pt-BR': 'pt-BR',
    'en': 'en-US',
    'es': 'es',
  }
  
  return localeMap[locale] || locale
}
