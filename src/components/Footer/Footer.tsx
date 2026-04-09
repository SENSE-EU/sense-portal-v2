import { ReactElement } from 'react'
import styles from './Footer.module.css'
import Links from './Links'
import { useMarketMetadata } from '@context/MarketMetadata'
import Logo from '@images/logo.svg'

export default function Footer(): ReactElement {
  const { siteContent } = useMarketMetadata()
  const { footer } = siteContent
  const { copyright } = footer

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Logo className={styles.logo} />
        </div>
        <Links />
      </div>
      <p className={styles.copyright}>{copyright}</p>
    </footer>
  )
}
