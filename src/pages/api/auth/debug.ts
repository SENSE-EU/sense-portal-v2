/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow GET and POST for testing
  if (req.method === 'GET') {
    // Return all environment variable status (without exposing full secrets)
    return res.status(200).json({
      message: 'Debug endpoint - Use POST to test token exchange',
      envStatus: {
        NEXT_PUBLIC_AUTH_ENABLED: !!process.env.NEXT_PUBLIC_AUTH_ENABLED,
        NEXT_PUBLIC_OIDC_ISSUER: !!process.env.NEXT_PUBLIC_OIDC_ISSUER,
        NEXT_PUBLIC_OIDC_CLIENT_ID: !!process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
        NEXT_PUBLIC_OIDC_CLIENT_SECRET:
          !!process.env.NEXT_PUBLIC_OIDC_CLIENT_SECRET,
        NEXT_PUBLIC_OIDC_CLIENT_SECRET_LENGTH:
          process.env.NEXT_PUBLIC_OIDC_CLIENT_SECRET?.length || 0,
        NEXT_PUBLIC_OIDC_REDIRECT_URI:
          process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI,
        NODE_ENV: process.env.NODE_ENV
      },
      issuer: process.env.NEXT_PUBLIC_OIDC_ISSUER,
      clientId: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
      redirectUri: process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI
    })
  }

  if (req.method === 'POST') {
    try {
      const { code, redirect_uri, code_verifier } = req.body

      // Get env variables directly
      const clientSecret = process.env.NEXT_PUBLIC_OIDC_CLIENT_SECRET
      const clientId = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID
      const issuer = process.env.NEXT_PUBLIC_OIDC_ISSUER

      // Validate all required variables
      const missingVars = []
      if (!clientSecret) missingVars.push('NEXT_PUBLIC_OIDC_CLIENT_SECRET')
      if (!clientId) missingVars.push('NEXT_PUBLIC_OIDC_CLIENT_ID')
      if (!issuer) missingVars.push('NEXT_PUBLIC_OIDC_ISSUER')
      if (!code) missingVars.push('code')
      if (!redirect_uri) missingVars.push('redirect_uri')
      if (!code_verifier) missingVars.push('code_verifier')

      if (missingVars.length > 0) {
        return res.status(400).json({
          error: 'Missing required variables',
          missing: missingVars,
          envCheck: {
            hasSecret: !!clientSecret,
            hasClientId: !!clientId,
            hasIssuer: !!issuer,
            secretLength: clientSecret?.length || 0
          }
        })
      }

      const tokenUrl = issuer.replace(/\/$/, '') + '/token/'

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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      })

      const data = await response.json()

      return res.status(response.status).json({
        success: response.ok,
        status: response.status,
        data,
        tokenUrl,
        envCheck: {
          hasSecret: !!clientSecret,
          secretLength: clientSecret?.length,
          hasClientId: !!clientId,
          hasIssuer: !!issuer
        }
      })
    } catch (error) {
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
