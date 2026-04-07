import { ReactElement } from 'react'
import { useUserPreferences } from '@context/UserPreferences'
import styles from './Links.module.css'
import { useMarketMetadata } from '@context/MarketMetadata'
import Link from 'next/link'

export default function Links(): ReactElement {
  const { siteContent } = useMarketMetadata()
  const { setShowPPC } = useUserPreferences()

  const { content } = siteContent.footer

  return (
    <div className={styles.container}>
      {content?.map((section, i) => (
        <div key={i} className={styles.section}>
          <p className={styles.title}>{section.title}</p>
          <div className={styles.links}>
            {section.links.map((e, i) => {
              const isInternalLink = e.link.startsWith('/')
              return isInternalLink ? (
                <Link key={i} className={styles.link} href={e.link}>
                  {e.name}
                </Link>
              ) : (
                <a
                  key={i}
                  className={styles.link}
                  href={e.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{e.name}</span>
                  <span className={styles.externalIcon}>&nbsp;↗</span>
                </a>
              )
            })}
            {section.title === 'Privacy' && (
              <a
                className={styles.link}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowPPC(true)}
              >
                Cookie Settings
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
