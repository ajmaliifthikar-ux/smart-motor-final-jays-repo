import { useAdminMode as useAdminModeContext } from '@/components/providers/AdminModeProvider'

/**
 * Hook to access the global Admin Mode state and controls.
 * Must be used within an AdminModeProvider.
 */
export function useAdminMode() {
  return useAdminModeContext()
}
