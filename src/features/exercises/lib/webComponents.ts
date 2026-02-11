export type AulappEnv = 0 | 2 | 3

const parseEnvValue = (value: string | undefined): AulappEnv | null => {
  if (!value) return null
  const parsed = Number(value)
  if (parsed === 0 || parsed === 2 || parsed === 3) return parsed
  return null
}

export const getAulappEnv = (): AulappEnv => {
  const fromEnv = parseEnvValue(import.meta.env.VITE_AULAPP_ENV)
  if (fromEnv !== null) return fromEnv

  if (import.meta.env.DEV) return 0
  return 3
}

export const getSpeechWebComponentUrl = (): string => {
  const env = getAulappEnv()
  if (env === 0) return 'http://localhost:5174/web-components/'
  if (env === 2) {
    return 'https://aulapp-public.s3.amazonaws.com/web-components/audio-recorder-web-view-hlg.html'
  }
  return 'https://aulapp-public.s3.amazonaws.com/web-components/audio-recorder-web-view.html'
}

export const getFluenciaLeitoraUrl = (): string => {
  const env = getAulappEnv()
  if (env === 0) return 'http://localhost:3003/iframe'
  return 'https://fluencia-leitora.vercel.app/iframe'
}
