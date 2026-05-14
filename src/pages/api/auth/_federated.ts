import { federatedOidcIssuers } from 'app.config.cjs'

export function isFederatedSource(loginSource: string): boolean {
  const raw = federatedOidcIssuers
  if (!raw) return false

  const normalizedLoginSource = loginSource.trim().toLowerCase()
  if (!normalizedLoginSource) return false

  try {
    const issuers = JSON.parse(raw)
    if (!Array.isArray(issuers)) return false
    return issuers.some((issuer: unknown) => {
      if (typeof issuer !== 'string') return false
      const normalizedIssuer = issuer.trim().toLowerCase()
      return (
        normalizedIssuer.length > 0 &&
        normalizedLoginSource.includes(normalizedIssuer)
      )
    })
  } catch {
    return false
  }
}
