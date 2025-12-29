import { useEffect, useMemo, useState } from 'react'

interface UseAutoHideBarsOptions {
  enabled: boolean
  edgePx?: number
  hideDelayMs?: number
  lockVisible?: boolean
  isHeaderHovered: boolean
  isFooterHovered: boolean
  isFooterInteracting: boolean
}

interface UseAutoHideBarsResult {
  isRevealed: boolean
}

export const useAutoHideBars = ({
  enabled,
  edgePx = 24,
  hideDelayMs = 150,
  lockVisible = false,
  isHeaderHovered,
  isFooterHovered,
  isFooterInteracting,
}: UseAutoHideBarsOptions): UseAutoHideBarsResult => {
  const [isRevealed, setIsRevealed] = useState(true)

  const shouldStayVisible = useMemo(() => {
    return isHeaderHovered || isFooterHovered || isFooterInteracting
  }, [isHeaderHovered, isFooterHovered, isFooterInteracting])

  useEffect(() => {
    if (!enabled) {
      setIsRevealed(true)
      return
    }

    if (lockVisible) {
      setIsRevealed(true)
      return
    }

    if (shouldStayVisible) {
      setIsRevealed(true)
      return
    }

    const t = window.setTimeout(() => {
      setIsRevealed(false)
    }, hideDelayMs)

    return () => {
      window.clearTimeout(t)
    }
  }, [enabled, hideDelayMs, lockVisible, shouldStayVisible])

  useEffect(() => {
    if (!enabled) return
    if (lockVisible) return

    const handleMouseMove = (e: MouseEvent) => {
      if (shouldStayVisible) return

      const y = e.clientY
      const vh = window.innerHeight
      const nearTop = y <= edgePx
      const nearBottom = y >= vh - edgePx

      if (nearTop || nearBottom) {
        setIsRevealed(true)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [enabled, edgePx, lockVisible, shouldStayVisible])

  return { isRevealed }
}
