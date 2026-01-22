/**
 * Hook para reproduzir áudios de feedback (acerto/erro)
 */

import { useCallback, useRef } from 'react'

interface UseAudioFeedbackOptions {
  successAudioUrl?: string
  errorAudioUrl?: string
  volume?: number
}

export const useAudioFeedback = (options: UseAudioFeedbackOptions = {}) => {
  const {
    // URLs padrão - podem ser sobrescritas
    successAudioUrl = '/audio/success.mp3',
    errorAudioUrl = '/audio/fail.mp3',
    volume = 0.5,
  } = options

  const successAudioRef = useRef<HTMLAudioElement | null>(null)
  const errorAudioRef = useRef<HTMLAudioElement | null>(null)

  // Inicializa os áudios apenas quando necessário
  const initAudio = useCallback(
    (type: 'success' | 'error') => {
      const url = type === 'success' ? successAudioUrl : errorAudioUrl
      const audioRef = type === 'success' ? successAudioRef : errorAudioRef

      if (!audioRef.current) {
        try {
          const audio = new Audio(url)
          audio.volume = volume
          audioRef.current = audio
        } catch (error) {
          console.warn(
            `[useAudioFeedback] Failed to load ${type} audio:`,
            error
          )
        }
      }

      return audioRef.current
    },
    [successAudioUrl, errorAudioUrl, volume]
  )

  const playSuccess = useCallback(() => {
    const audio = initAudio('success')
    if (audio) {
      audio.currentTime = 0
      audio.play().catch((error) => {
        console.warn('[useAudioFeedback] Failed to play success audio:', error)
      })
    }
  }, [initAudio])

  const playError = useCallback(() => {
    const audio = initAudio('error')
    if (audio) {
      audio.currentTime = 0
      audio.play().catch((error) => {
        console.warn('[useAudioFeedback] Failed to play error audio:', error)
      })
    }
  }, [initAudio])

  // Cleanup
  const cleanup = useCallback(() => {
    if (successAudioRef.current) {
      successAudioRef.current.pause()
      successAudioRef.current = null
    }
    if (errorAudioRef.current) {
      errorAudioRef.current.pause()
      errorAudioRef.current = null
    }
  }, [])

  return {
    playSuccess,
    playError,
    cleanup,
  }
}
