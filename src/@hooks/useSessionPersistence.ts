import { useCallback, useEffect } from 'react'
import { useAuth, verifyAuthSession } from './useAuth'

export function useSessionPersistence() {
  const { user, clearLocalSession } = useAuth()

  const refreshToken = useCallback(async (): Promise<{
    success: boolean
    expires_in?: number
  } | null> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST'
      })

      if (response.ok) {
        const { expires_in: newExpiresIn } = await response.json()
        if (typeof newExpiresIn === 'number' && newExpiresIn > 0) {
          localStorage.setItem(
            'token_expires_at',
            String(Date.now() + newExpiresIn * 1000)
          )
          return { success: true, expires_in: newExpiresIn }
        } else {
          console.error(
            'Token refresh response missing expires_in, logging out'
          )
          clearLocalSession()
          return { success: false }
        }
      } else if (response.status !== 503 && response.status !== 504) {
        console.error('Token refresh failed, logging out', response.status)
        clearLocalSession()
        return { success: false }
      }

      return null
    } catch (error) {
      console.error('Token refresh network error, will retry:', error)
      return null
    }
  }, [clearLocalSession])

  const checkSession = useCallback(async () => {
    try {
      const verifiedUser = await verifyAuthSession()
      if (!verifiedUser) {
        clearLocalSession()
      }
    } catch {
      // network error — transient, don't logout
    }
  }, [clearLocalSession])

  useEffect(() => {
    if (!user) return

    const checkAndRefresh = async () => {
      const result = await refreshToken()

      if (result?.success) {
        await checkSession()
      }
    }

    checkAndRefresh()
    const interval = setInterval(checkAndRefresh, 30000)

    return () => clearInterval(interval)
  }, [user, refreshToken, checkSession])

  return null
}
