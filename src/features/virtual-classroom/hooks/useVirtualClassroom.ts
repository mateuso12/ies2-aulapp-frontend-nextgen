/**
 * Placeholder: durante a migração, esse hook ainda não existe como API pública.
 * Mantemos um export estável e evoluímos quando o domínio do VirtualClassroom
 * ganhar um hook próprio.
 */
export const useVirtualClassroom = () => {
  throw new Error(
    'useVirtualClassroom ainda não foi implementado nesta migração. Use os hooks existentes do app (ex.: useAnnotations) até a próxima etapa.'
  )
}
