export function normalizeFederatedIssuer(value: string): string | null {
  const trimmedValue = value.trim()
  if (!trimmedValue) return null

  try {
    const url = new URL(trimmedValue)
    const pathname = url.pathname.replace(/\/+$/, '')
    return `${url.origin}${pathname}`.toLowerCase()
  } catch {
    return trimmedValue.replace(/\/+$/, '').toLowerCase()
  }
}

export function isFederatedSource(loginSource: string): boolean {
  const raw = process.env.NEXT_PUBLIC_FEDERATED_OIDC_ISSUERS
  if (!raw) return false
  const normalizedLoginSource = normalizeFederatedIssuer(loginSource)
  if (!normalizedLoginSource) return false

  try {
    const issuers = JSON.parse(raw)
    if (!Array.isArray(issuers)) return false
    return issuers.some(
      (issuer: unknown) =>
        typeof issuer === 'string' &&
        normalizeFederatedIssuer(issuer) === normalizedLoginSource
    )
  } catch {
    return false
  }
}
