import type { NextApiRequest, NextApiResponse } from 'next'
import matter from 'gray-matter'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query

  const urlMap: Record<string, string> = {
    imprint: process.env.NEXT_PUBLIC_IMPRINT_URL || '',
    terms: process.env.NEXT_PUBLIC_TC_URL || '',
    'privacy-policy': process.env.NEXT_PUBLIC_PP_URL || '',
    'cookie-policy': process.env.NEXT_PUBLIC_CP_URL || '',
    'data-portal-usage-agreement': process.env.NEXT_PUBLIC_DPUA_URL || ''
  }

  const url = urlMap[slug as string]

  if (!url) {
    return res.status(404).json({ error: 'No external URL configured' })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'text/html,text/plain,text/markdown,application/json,*/*'
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const content = await response.text()

    const { data, content: markdownContent } = matter(content)

    res.status(200).json({
      title: data.title || slug,
      content: markdownContent,
      lastUpdated: new Date().toISOString().split('T')[0]
    })
  } catch (error) {
    console.error('Error fetching external content:', error)
    res.status(500).json({ error: 'Failed to fetch content' })
  }
}
