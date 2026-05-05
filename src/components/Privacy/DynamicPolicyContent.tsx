import { useState, useEffect } from 'react'
import { markdownToHtmlWithToc } from '@utils/markdown'
import { extractHeadingsFromMarkdown, Heading } from '@utils/extractHeadings'

interface DynamicPolicyContentProps {
  slug: string
  localContent: string
  localHeadings: Heading[]
  localTitle: string
}

export default function DynamicPolicyContent({
  slug,
  localContent,
  localHeadings,
  localTitle
}: DynamicPolicyContentProps) {
  const [content, setContent] = useState(localContent)
  const [headings, setHeadings] = useState(localHeadings)
  const [title, setTitle] = useState(localTitle)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if we should fetch external content at runtime
    async function fetchExternalContent() {
      try {
        setLoading(true)
        const response = await fetch(`/api/policy-content?slug=${slug}`)
        if (response.ok) {
          const data = await response.json()
          const htmlContent = markdownToHtmlWithToc(data.content)
          const extractedHeadings = extractHeadingsFromMarkdown(data.content)
          setTitle(data.title)
          setContent(htmlContent)
          setHeadings(extractedHeadings)
        }
      } catch (error) {
        console.error('Failed to fetch external content:', error)
      } finally {
        setLoading(false)
      }
    }

    if (window.__RUNTIME_CONFIG__) {
      const hasExternalUrl = !!(
        window.__RUNTIME_CONFIG__.NEXT_PUBLIC_IMPRINT_URL ||
        window.__RUNTIME_CONFIG__.NEXT_PUBLIC_TC_URL ||
        window.__RUNTIME_CONFIG__.NEXT_PUBLIC_PP_URL ||
        window.__RUNTIME_CONFIG__.NEXT_PUBLIC_CP_URL ||
        window.__RUNTIME_CONFIG__.NEXT_PUBLIC_DPUA_URL
      )

      if (hasExternalUrl) {
        fetchExternalContent()
      }
    }
  }, [slug])

  if (loading) {
    return <div className="loading">Loading policy content...</div>
  }

  return (
    <>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  )
}
