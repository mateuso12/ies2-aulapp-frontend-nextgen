import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type {
  FluencyReadingExercise as FluencyReadingExerciseModel,
  FluencyReadingData,
} from '@/features/exercises/types'
import { normalizeLocaleForUIKit } from '@/lib/locale'
import { getFluenciaLeitoraUrl } from '@/features/exercises/lib/webComponents'

export interface FluencyReadingResult {
  tempoConclusao: number
  precisaoPronuncia: number
  acertosTotais: number
  errosTotais: number
  audioGravadoUrl?: string
  textoMarcado: Array<{
    id: string
    word: string
    status: string
    confidence?: number
    notes?: string
  }>
  activityId?: string | number
  studentId?: string | number
  [key: string]: unknown
}

interface FluencyReadingExerciseProps {
  exercise: FluencyReadingExerciseModel
  onResults?: (result: FluencyReadingResult) => void
  className?: string
}

const VALID_ORIGINS = [
  'https://fluencia-leitora.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3003',
]

const buildConfigPayload = (data: FluencyReadingData, locale: string) => ({
  enunciado: data.enunciado,
  tituloTexto: data.tituloTexto,
  corpoTexto: data.corpoTexto,
  idioma: data.idioma || locale,
  initialHelp: data.initialHelp,
  configuracoesAtividade: data.configuracoesAtividade,
})

export const FluencyReadingExercise: React.FC<FluencyReadingExerciseProps> = ({
  exercise,
  onResults,
  className = '',
}) => {
  const { i18n } = useTranslation()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const iframeId = `fluencia-iframe-${exercise.id}`
  const [isIframeReady, setIsIframeReady] = useState(false)

  const sendConfig = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) {
      console.error('[FluencyReadingExercise] Iframe não encontrado')
      return
    }

    const locale = normalizeLocaleForUIKit(i18n.language)
    const payload = {
      type: 'aulappConfig',
      payload: buildConfigPayload(exercise.data, locale),
    }

    iframe.contentWindow.postMessage(payload, '*')
  }, [exercise.data, i18n.language])

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (!VALID_ORIGINS.some((origin) => event.origin.startsWith(origin))) {
        return
      }

      const { data } = event

      if (data?.type === 'idiomaticReady') {
        setIsIframeReady(true)
        sendConfig()
        return
      }

      if (data?.type === 'idiomaticResults' && data?.payload) {
        onResults?.(data.payload)
      }
    },
    [onResults, sendConfig]
  )

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [handleMessage])

  useEffect(() => {
    if (isIframeReady) {
      sendConfig()
    }
  }, [exercise.id, isIframeReady, sendConfig])

  return (
    <div className={`fluency-reading-container ${className}`}>
      <iframe
        id={iframeId}
        ref={iframeRef}
        src={getFluenciaLeitoraUrl()}
        style={{
          height: 'max(60vh, 500px)',
          width: '100%',
          border: 'none',
        }}
        title="Fluência Leitora"
        allow="microphone"
      />
    </div>
  )
}

export default FluencyReadingExercise
