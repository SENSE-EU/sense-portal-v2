const VERIFIER_SESSION_ID_STORAGE_KEY = 'verifierSessionId'

export function getStoredVerifierSessionId(
  did: string,
  serviceId: string
): string {
  try {
    if (typeof window === 'undefined') return ''
    const storage = window.localStorage.getItem(VERIFIER_SESSION_ID_STORAGE_KEY)
    const sessions = storage ? JSON.parse(storage) : {}

    return (
      sessions?.[`${did}_${serviceId}`] ||
      sessions?.[`${did}_${serviceId}_skip`] ||
      ''
    )
  } catch {
    return ''
  }
}

export function resolveVerifierSessionId(
  did: string,
  serviceId: string,
  sessionId?: string | null
): string {
  return sessionId || getStoredVerifierSessionId(did, serviceId)
}
