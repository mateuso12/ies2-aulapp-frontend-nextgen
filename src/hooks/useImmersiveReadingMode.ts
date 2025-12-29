import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface UseImmersiveReadingModeOptions {
  /**
   * Habilita o modo e-reader (pensado para mobile). Se false, o hook não intercepta nada.
   */
  enabled: boolean

  /**
   * Quando true, barras devem ficar visíveis (ex.: algum menu aberto).
   * Esse hook deve respeitar esse lock e não esconder as barras.
   */
  lockVisible?: boolean

  /**
   * Se o usuário estiver usando desenho/drag, não queremos interpretar toque como toggle.
   */
  isBusy?: boolean

  /**
   * Fração da altura da viewport considerada como "centro".
   * Ex.: 0.34 significa que a área central vai de 33% a 66%.
   */
  centerBandRatio?: number
}

interface UseImmersiveReadingModeResult {
  /** true quando o modo leitura está ocultando as barras */
  isUiHidden: boolean

  /**
   * Props para aplicar em um container que cobre a área de leitura.
   * Usamos onPointerUp para suportar toque/click.
   */
  overlayProps: {
    onPointerUp: (e: React.PointerEvent<HTMLElement>) => void
  }

  /** Força mostrar as barras (ex.: ao abrir menus) */
  reveal: () => void

  /** Força esconder as barras (somente se não houver lock) */
  hide: () => void

  /** Alterna manualmente, respeitando lock */
  toggle: () => void
}

const isInteractiveTarget = (el: Element | null) => {
  if (!el) return false
  return !!el.closest(
    'button, a, input, textarea, select, label, [role="button"], [role="menuitem"], [data-no-reading-toggle]'
  )
}

export function useImmersiveReadingMode({
  enabled,
  lockVisible = false,
  isBusy = false,
  centerBandRatio = 0.34,
}: UseImmersiveReadingModeOptions): UseImmersiveReadingModeResult {
  const [isUiHidden, setIsUiHidden] = useState(false)
  const lastToggleTsRef = useRef<number>(0)

  const canHide = enabled && !lockVisible && !isBusy

  // Se algum menu abriu, garante barras visíveis.
  useEffect(() => {
    if (lockVisible) {
      setIsUiHidden(false)
    }
  }, [lockVisible])

  const reveal = useCallback(() => setIsUiHidden(false), [])

  const hide = useCallback(() => {
    if (!canHide) return
    setIsUiHidden(true)
  }, [canHide])

  const toggle = useCallback(() => {
    if (!canHide) {
      // Se não pode esconder, pelo menos garante que está visível.
      setIsUiHidden(false)
      return
    }
    setIsUiHidden((v) => !v)
  }, [canHide])

  const overlayProps = useMemo(() => {
    return {
      onPointerUp: (e: React.PointerEvent<HTMLElement>) => {
        if (!enabled) return
        if (!canHide) return

        // Evita alternar ao clicar em botões/inputs/links etc.
        if (isInteractiveTarget(e.target as Element | null)) return

        // Garante que o tap foi no centro.
        const y = e.clientY
        const vh = window.innerHeight || 1
        const band = Math.max(0, Math.min(0.49, centerBandRatio / 2))
        const minY = vh * (0.5 - band)
        const maxY = vh * (0.5 + band)
        if (y < minY || y > maxY) return

        // Debounce simples para evitar double-tap/ghost clicks.
        const now = Date.now()
        if (now - lastToggleTsRef.current < 250) return
        lastToggleTsRef.current = now

        toggle()
      },
    }
  }, [canHide, centerBandRatio, enabled, toggle])

  return { isUiHidden, overlayProps, reveal, hide, toggle }
}
