import { ReactElement } from 'react'
import styles from './Footer.module.css'
import Links from './Links'
import { useMarketMetadata } from '@context/MarketMetadata'
import Logo from '@images/logo.svg'

export default function Footer(): ReactElement {
  const { siteContent } = useMarketMetadata()
  const { footer } = siteContent
  const copyright = footer.copyright.replace(
    /\b\d{4}\b/g,
    String(new Date().getFullYear())
  )

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Logo className={styles.logo} />
        </div>
        <Links />
      </div>
      <p className={styles.copyright}>
        {copyright}
        {' · '}Made by{' '}
        <a
          className={styles.madeByLink}
          href="https://www.delta-dao.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          deltaDAO
        </a>
      </p>
    </footer>
  )
}
