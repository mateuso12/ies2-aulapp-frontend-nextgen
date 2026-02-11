import React, { useEffect, useRef } from 'react'
import type {
  ExerciseComponentProps,
  OpenTextData,
  OpenTextAnswer,
} from '../../types'

interface OpenTextExerciseProps
  extends ExerciseComponentProps<OpenTextData, OpenTextAnswer> {
  resourceType?: string
  currentPageIndex?: number
  onVerifyAnswer?: () => void
}

export const OpenTextExercise: React.FC<OpenTextExerciseProps> = ({
  exercise,
  onChange,
  onVerifyAnswer,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Aguarda o iframe estar pronto
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'open-ended-ready') {
        // Envia configurações para o iframe
        const config = {
          type: 'configure-open-ended',
          payload: {
            question: exercise.title,
            questionDescription: exercise.description,
            language: exercise.data.language || 'pt-BR',
            locale: exercise.data.locale || 'pt-BR',
            primaryColor: exercise.data.primaryColor || '#f6339a',
            answers: exercise.data.answers || [],
            retrys: exercise.data.retrys || 0,
            minLength: exercise.data.minLength || 0,
            maxLength: exercise.data.maxLength || 2000,
          },
        }
        
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(config, '*')
        }
      }

      // Listeners para respostas do iframe
      if (event.data.type === 'open-ended-answered') {
        onChange?.(event.data.answer)
        onVerifyAnswer?.()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [exercise, onChange, onVerifyAnswer])

  return (
    <div className="w-full">
      <iframe
        ref={iframeRef}
        src="http://localhost:5174/web-components/"
        title="Open Text Exercise Component"
        className="w-full border-0"
        style={{
          minHeight: '600px',
        }}
      />
    </div>
  )
}

export const OpenTextExerciseComponent = OpenTextExercise
