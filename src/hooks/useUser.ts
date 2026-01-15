import { useState, useEffect } from 'react'

/**
 * Hook para gerenciar dados do usuário
 * 
 * Por enquanto, apenas extrai o userId da query string.
 * O app é injetado como iframe e recebe o userId via query param.
 * 
 * Exemplo: https://app.com/?userId=12345
 */
export const useUser = () => {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Extrai userId da URL
    const params = new URLSearchParams(window.location.search)
    const userIdParam = params.get('userId')

    if (userIdParam) {
      setUserId(userIdParam)
      
      // Salva no sessionStorage para persistir durante a sessão
      sessionStorage.setItem('aulapp:userId', userIdParam)
    } else {
      // Tenta recuperar do sessionStorage
      const savedUserId = sessionStorage.getItem('aulapp:userId')
      if (savedUserId) {
        setUserId(savedUserId)
      } else {
        // Fallback: gera um ID temporário para desenvolvimento
        const tempId = `temp-${Date.now()}`
        setUserId(tempId)
        sessionStorage.setItem('aulapp:userId', tempId)
        
        if (import.meta.env.DEV) {
          console.warn(
            '[useUser] No userId in URL. Using temporary ID:',
            tempId,
            '\nAdd ?userId=YOUR_USER_ID to the URL'
          )
        }
      }
    }

    setIsLoading(false)
  }, [])

  return {
    userId,
    isLoading,
    isGuest: userId?.startsWith('temp-') || false,
  }
}
