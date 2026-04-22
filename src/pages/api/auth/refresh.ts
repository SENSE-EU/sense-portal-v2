import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSideOidcConfig } from '../../../config/auth.config'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS')
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { refresh_token: refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token required'
      })
    }

    const oidcConfig = getServerSideOidcConfig()

    const tokenUrl = `${oidcConfig.issuer.replace(/\/$/, '')}/token/`

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: oidcConfig.clientId,
        client_secret: oidcConfig.clientSecret,
        refresh_token: refreshToken
      })
    })

    const data = await response.json()

    return res.status(response.status).json(data)
  } catch (error) {
    console.error('Refresh error:', error)

    return res.status(500).json({
      error: 'Internal server error'
    })
  }
}
