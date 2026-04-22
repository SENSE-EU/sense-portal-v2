/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST method' })
  }

  try {
    // Get environment variables directly
    const clientSecret = process.env.NEXT_PUBLIC_OIDC_CLIENT_SECRET
    const clientId = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID
    const issuer = process.env.NEXT_PUBLIC_OIDC_ISSUER

    // Log what we have (this will appear in Vercel logs)
    console.log('Token-v2 called with env:', {
      hasSecret: !!clientSecret,
      secretLength: clientSecret?.length,
      hasClientId: !!clientId,
      hasIssuer: !!issuer,
      issuer
    })

    // Check for missing environment variables
    if (!clientSecret || !clientId || !issuer) {
      return res.status(500).json({
        error: 'Missing environment variables',
        missing: {
          secret: !clientSecret,
          clientId: !clientId,
          issuer: !issuer
        },
        received: {
          secretLength: clientSecret?.length || 0,
          clientIdLength: clientId?.length || 0,
          issuerLength: issuer?.length || 0
        }
      })
    }

    const { code, redirect_uri, code_verifier } = req.body

    if (!code || !redirect_uri || !code_verifier) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['code', 'redirect_uri', 'code_verifier'],
        received: {
          code: !!code,
          redirect_uri: !!redirect_uri,
          code_verifier: !!code_verifier
        }
      })
    }

    const tokenUrl = `${issuer.replace(/\/$/, '')}/token/`

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri,
      code_verifier
    })

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Authentik error:', data)
      return res.status(response.status).json(data)
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Token error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    })
  }
}
