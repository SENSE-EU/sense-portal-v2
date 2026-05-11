/* eslint-disable camelcase */
import { decodeJwt } from 'jose'

type CacheEntry = {
  active: true
  expiresAt: number
}

/**
 * Local cache for tokens Authentik has already marked as active.
 *
 * Do not cache inactive tokens. If Authentik says a token is revoked, every
 * lambda should be able to see that as soon as it checks the token.
 */
const introspectCache = new Map<string, CacheEntry>()

const CACHE_TTL_MS = 120 * 1000
const INTROSPECT_TIMEOUT_MS = 5000

function getIntrospectUrl(issuer: string): string {
  if (issuer.includes('/application/o/')) {
    const base = issuer.split('/application/o/')[0]
    return `${base}/application/o/introspect/`
  }
  return `${issuer.replace(/\/$/, '')}/introspect/`
}

function getTokenExpiryMs(token: string): number | undefined {
  try {
    const { exp } = decodeJwt(token)
    return typeof exp === 'number' ? exp * 1000 : undefined
  } catch {
    return undefined
  }
}

function purgeExpired(now: number): void {
  for (const [key, entry] of introspectCache) {
    if (entry.expiresAt < now) introspectCache.delete(key)
  }
}

/**
 * Asks Authentik whether this access token is still active.
 *
 * Active tokens are cached for a short time, but never past the JWT exp. That
 * keeps repeated API calls from hitting Authentik while still respecting token
 * expiry.
 *
 * If Authentik is unavailable or returns an unexpected response, keep the
 * request moving and log the failure. The token expiry still limits how long
 * that can last.
 */
export async function isAccessTokenActive(
  accessToken: string,
  issuer: string,
  clientId: string,
  clientSecret: string
): Promise<boolean> {
  const now = Date.now()
  purgeExpired(now)

  const cached = introspectCache.get(accessToken)
  if (cached && cached.expiresAt > now) return true

  const introspectUrl = getIntrospectUrl(issuer)

  try {
    const response = await fetch(introspectUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString('base64')}`
      },
      body: new URLSearchParams({
        token: accessToken,
        token_type_hint: 'access_token'
      }),
      signal: AbortSignal.timeout(INTROSPECT_TIMEOUT_MS)
    })

    if (!response.ok) {
      // These statuses usually mean our OIDC setup is wrong, not that
      // Authentik is temporarily down. Keep the log marker stable for alerts.
      if (
        response.status === 401 ||
        response.status === 403 ||
        response.status === 404
      ) {
        console.error(
          `INTROSPECT_CONFIG_ERROR status=${response.status} — check OIDC_CLIENT_SECRET, NEXT_PUBLIC_OIDC_ISSUER, and that the OIDC client is permitted to call /introspect/. Failing open.`
        )
      } else {
        console.error(
          `Introspection HTTP ${response.status}; failing open for this request.`
        )
      }
      return true
    }

    const data = (await response.json().catch(() => null)) as {
      active?: unknown
    } | null

    if (!data || typeof data.active !== 'boolean') {
      console.error(
        'Introspection response missing or malformed; failing open for this request.'
      )
      return true
    }

    if (!data.active) {
      introspectCache.delete(accessToken)
      return false
    }

    const tokenExp = getTokenExpiryMs(accessToken)
    const cacheExpiresAt = Math.min(
      now + CACHE_TTL_MS,
      tokenExp ?? Number.POSITIVE_INFINITY
    )
    introspectCache.set(accessToken, {
      active: true,
      expiresAt: cacheExpiresAt
    })
    return true
  } catch (error) {
    console.error('Introspection call threw; failing open:', error)
    return true
  }
}
