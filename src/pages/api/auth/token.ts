import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSideOidcConfig } from '../../../config/auth.config'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS')
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier
    } = req.body

    const oidcConfig = getServerSideOidcConfig()

    const tokenUrl = `${oidcConfig.issuer.replace(/\/$/, '')}/token/`

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: oidcConfig.clientId,
        client_secret: oidcConfig.clientSecret,
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
      })
    })

    const data = await response.json()

    return res.status(response.status).json(data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Server error' })
  }
}
