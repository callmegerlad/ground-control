import { useEffect } from 'react'

/**
 * Hook to warn users before navigating away if there are unsaved changes
 * @param {boolean} isDirty - Whether the form has unsaved changes (from react-hook-form)
 */
export function useUnsavedChangesWarning(isDirty) {
  // Handle browser close/refresh
  useEffect(() => {
    if (!isDirty) return

    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])
}
