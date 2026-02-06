import { useCallback, useEffect, useRef } from 'react'
import type { SpeechExerciseResult } from '../components/exercise-types/SpeechExercise'

/**
 * Tipos de mensagens recebidas dos web-components
 */
export type WebComponentMessage =
  | { type: 'iframeReady'; data: { ready: boolean } }
  | { type: 'MIC_TESTED' }
  | { type: 'MIC_TEST_STATUS'; tested: boolean }
  | { type: 'fluencyData'; data: unknown }
  | { status: 'success'; result: SpeechExerciseResult }
  | { status: 'final'; results: SpeechExerciseResult[]; realElapsedTime: string }

/**
 * Origens válidas para mensagens de web-components
 */
const VALID_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3003',
  'https://aulapp-public.s3.amazonaws.com',
  'https://fluencia-leitora.vercel.app',
]

interface UseWebComponentCommunicationOptions {
  /** Callback para quando o iframe de speech está pronto */
  onSpeechReady?: () => void
  /** Callback para resultado de speech */
  onSpeechResult?: (result: SpeechExerciseResult) => void
  /** Callback para resultado final de speech */
  onSpeechFinalResult?: (results: SpeechExerciseResult[], elapsedTime: string) => void
  /** Callback para teste de microfone */
  onMicTested?: () => void
}

interface UseWebComponentCommunicationReturn {
  /** Envia dados de exercício de speech para o iframe */
  sendSpeechData: (iframeRef: React.RefObject<HTMLIFrameElement | null>, data: unknown) => void
  /** Envia status de teste de microfone */
  sendMicStatus: (iframeRef: React.RefObject<HTMLIFrameElement | null>) => void
}

/**
 * Hook para gerenciar comunicação via postMessage com web-components
 * 
 * Implementa o protocolo de comunicação do ies2-aulapp-frontend para:
 * - Exercícios de fala (EX.WP, EX.WS, EX.WY)
 * - Exercícios de fala (EX.WP, EX.WS, EX.WY)
 */
export function useWebComponentCommunication(
  options: UseWebComponentCommunicationOptions = {}
): UseWebComponentCommunicationReturn {
  // Refs para callbacks (evita re-renderizações desnecessárias)
  const callbacksRef = useRef(options)
  callbacksRef.current = options

  /**
   * Valida se a origem da mensagem é confiável
   */
  const isValidOrigin = useCallback((origin: string): boolean => {
    return VALID_ORIGINS.some((valid) => origin.startsWith(valid))
  }, [])

  /**
   * Handler principal de mensagens
   */
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // Validar origem
      if (!isValidOrigin(event.origin)) {
        return
      }

      const data = event.data

      // === SPEECH EXERCISES (EX.WP, EX.WS, EX.WY) ===

      // Iframe de speech pronto
      if (data?.type === 'iframeReady' && data?.data?.ready) {
        console.log('[WebComponentComm] Speech iframe ready')
        callbacksRef.current.onSpeechReady?.()
        return
      }

      // Teste de microfone
      if (data?.type === 'MIC_TESTED') {
        console.log('[WebComponentComm] Microfone testado')
        try {
          localStorage.setItem('fluency.microphoneTested', 'true')
        } catch (e) {
          console.warn('[WebComponentComm] Falha ao salvar estado do microfone:', e)
        }
        callbacksRef.current.onMicTested?.()
        return
      }

      // Resultado de uma palavra (speech)
      if (data?.status === 'success' && data?.result) {
        console.log('[WebComponentComm] Speech result:', data.result)
        const result: SpeechExerciseResult = {
          word: data.result.word || data.result.data?.word || '',
          wordId: data.result.wordId,
          status: 'success',
          score: data.result.score,
          ...data.result,
        }
        callbacksRef.current.onSpeechResult?.(result)
        return
      }

      // Resultado final de speech
      if (data?.status === 'final' && data?.results) {
        console.log('[WebComponentComm] Speech final result:', data)
        callbacksRef.current.onSpeechFinalResult?.(data.results, data.realElapsedTime || '00:00')
        return
      }

    },
    [isValidOrigin]
  )

  // Registra listener global
  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [handleMessage])

  /**
   * Envia dados de speech para o iframe
   */
  const sendSpeechData = useCallback(
    (iframeRef: React.RefObject<HTMLIFrameElement | null>, data: unknown) => {
      const iframe = iframeRef.current
      if (!iframe?.contentWindow) {
        console.error('[WebComponentComm] Iframe não disponível para enviar speech data')
        return
      }

      const payload = {
        type: 'fluencyData',
        data,
      }

      console.log('[WebComponentComm] Sending speech data:', payload)
      iframe.contentWindow.postMessage(payload, '*')
    },
    []
  )

  /**
   * Envia status do teste de microfone
   */
  const sendMicStatus = useCallback(
    (iframeRef: React.RefObject<HTMLIFrameElement | null>) => {
      const iframe = iframeRef.current
      if (!iframe?.contentWindow) {
        return
      }

      try {
        const tested = localStorage.getItem('fluency.microphoneTested') === 'true'
        iframe.contentWindow.postMessage({ type: 'MIC_TEST_STATUS', tested }, '*')
      } catch (e) {
        console.warn('[WebComponentComm] Falha ao enviar status do microfone:', e)
      }
    },
    []
  )

  return {
    sendSpeechData,
    sendMicStatus,
  }
}
