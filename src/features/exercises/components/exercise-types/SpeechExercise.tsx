import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SpeechExercise as SpeechExerciseModel } from '@/features/exercises/types'
import { getSpeechWebComponentUrl } from '@/features/exercises/lib/webComponents'
import { normalizeLocaleForUIKit } from '@/lib/locale'

export interface SpeechExerciseResult {
  word: string
  wordId?: string
  status: 'success' | 'error'
  score?: number
  [key: string]: unknown
}

interface SpeechExerciseProps {
  exercise: SpeechExerciseModel
  onResult?: (result: SpeechExerciseResult) => void
  onFinalResult?: (results: SpeechExerciseResult[], elapsedTime: string) => void
  onMicTested?: () => void
  className?: string
}

/**
 * Determina a URL do iframe baseado no ambiente
 */
const getIframeSrc = (): string => getSpeechWebComponentUrl()

const getActivityType = (
  type: SpeechExerciseModel['type']
): 'EX.WP' | 'EX.WS' | 'EX.WY' => {
  switch (type) {
    case 'speech-pronunciation':
      return 'EX.WP'
    case 'speech-spelling':
      return 'EX.WS'
    case 'speech-syllable':
      return 'EX.WY'
    default:
      return 'EX.WP'
  }
}

/**
 * Componente de exercício de fala que integra com web-components via iframe
 *
 * Replica a implementação do ies2-aulapp-frontend para exercícios EX.WP, EX.WS, EX.WY
 */
export const SpeechExercise: React.FC<SpeechExerciseProps> = ({
  exercise,
  onResult,
  onFinalResult,
  onMicTested,
  className = '',
}) => {
  const { i18n } = useTranslation()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const iframeId = `fluency-iframe-${exercise.id}`
  const [isIframeReady, setIsIframeReady] = useState(false)

  /**
   * Envia dados do exercício para o iframe
   */
  const sendExerciseData = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) {
      console.error('[SpeechExercise] Iframe não encontrado')
      return
    }

    // Primeiro, envia o status do teste de microfone
    try {
      const micTested =
        localStorage.getItem('fluency.microphoneTested') === 'true'
      iframe.contentWindow.postMessage(
        { type: 'MIC_TEST_STATUS', tested: micTested },
        '*'
      )
    } catch (e) {
      console.warn('[SpeechExercise] Falha ao enviar status do microfone:', e)
    }

    // Prepara o payload no formato esperado pelo web-components
    const selectedLocale = normalizeLocaleForUIKit(i18n.language)
    const payload = {
      type: 'fluencyData',
      data: {
        locale: selectedLocale,
        exercise: {
          id: exercise.id,
          questions: exercise.data.questions,
          config: {
            ...exercise.data.config,
            language: selectedLocale,
            locale: selectedLocale,
          },
        },
        type: getActivityType(exercise.type),
        institutionId: exercise.data.institutionId,
      },
    }

    console.log('[SpeechExercise] Enviando dados do exercício:', payload)
    iframe.contentWindow.postMessage(payload, '*')
  }, [exercise, i18n.language])

  /**
   * Handler para mensagens recebidas do iframe via postMessage
   */
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const { data } = event

      // Validar origem (aceitar localhost em dev ou S3 em produção)
      const validOrigins = [
        'http://localhost:5173',
        'https://aulapp-public.s3.amazonaws.com',
      ]

      if (!validOrigins.some((origin) => event.origin.startsWith(origin))) {
        return
      }

      // Evento: iframe está pronto para receber dados
      if (data?.type === 'iframeReady' && data?.data?.ready) {
        console.log(
          '[SpeechExercise] Iframe ready, enviando dados do exercício'
        )
        setIsIframeReady(true)
        sendExerciseData()
        return
      }

      // Evento: teste de microfone realizado
      if (data?.type === 'MIC_TESTED') {
        console.log('[SpeechExercise] Teste de microfone realizado')
        try {
          localStorage.setItem('fluency.microphoneTested', 'true')
        } catch (e) {
          console.warn(
            '[SpeechExercise] Falha ao salvar estado do microfone:',
            e
          )
        }
        onMicTested?.()
        return
      }

      // Evento: resultado de uma palavra
      if (data?.status === 'success' && data?.result) {
        console.log('[SpeechExercise] Resultado recebido:', data.result)

        const result: SpeechExerciseResult = {
          word: data.result.word || data.result.data?.word || '',
          wordId: data.result.wordId,
          status: 'success',
          score: data.result.score,
          ...data.result,
        }

        onResult?.(result)
        return
      }

      // Evento: resultado final (todas as palavras)
      if (data?.status === 'final' && data?.results) {
        console.log('[SpeechExercise] Resultado final:', data)
        onFinalResult?.(data.results, data.realElapsedTime || '00:00')
        return
      }
    },
    [onResult, onFinalResult, onMicTested, sendExerciseData]
  )

  /**
   * Handler para quando o iframe é carregado
   */
  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return

    console.log('[SpeechExercise] Iframe carregado')

    // Envia status de microfone testado
    try {
      const tested = localStorage.getItem('fluency.microphoneTested') === 'true'
      iframe.contentWindow.postMessage({ type: 'MIC_TEST_STATUS', tested }, '*')
    } catch (e) {
      console.warn('[SpeechExercise] Falha ao enviar estado do microfone:', e)
    }
  }, [])

  // Configura listeners de mensagem
  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [handleMessage])

  // Reenvia dados quando o exercício mudar e o iframe já estiver pronto
  useEffect(() => {
    if (isIframeReady) {
      sendExerciseData()
    }
  }, [exercise.id, isIframeReady, sendExerciseData])

  return (
    <div className={`speech-exercise-container ${className}`}>
      <iframe
        id={iframeId}
        ref={iframeRef}
        src={getIframeSrc()}
        style={{
          height: 'max(60vh, 500px)',
          width: '100%',
          border: 'none',
        }}
        title="Exercício de Fluência"
        allow="microphone"
        onLoad={handleIframeLoad}
      />
    </div>
  )
}

export default SpeechExercise
