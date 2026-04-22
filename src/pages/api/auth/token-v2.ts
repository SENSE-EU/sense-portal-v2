/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST method' })
  }

  try {
    const { code, redirect_uri, code_verifier } = req.body

    // Use the CORRECT token URL from Authentik
    const tokenUrl =
      'https://ocean-node-vm2.oceanenterprise.io:8443/application/o/token/'

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID!,
      client_secret: process.env.NEXT_PUBLIC_OIDC_CLIENT_SECRET!,
      code,
      redirect_uri,
      code_verifier
    })

    console.log('Token URL:', tokenUrl)
    console.log('Request params:', params.toString())

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })

    const responseText = await response.text()
    console.log('Response status:', response.status)
    console.log('Response preview:', responseText.substring(0, 200))

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      data = { raw: responseText, error: 'Could not parse JSON' }
    }

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
