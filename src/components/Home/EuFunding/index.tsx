import { ReactElement } from 'react'
import styles from './index.module.css'
import Container from '@shared/atoms/Container'

export default function EuFunding(): ReactElement {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.content}>
          <div className={styles.logoContainer}>
            {/* 
              PLACEHOLDER: Replace with EU funded logo.
              Recommended: ~300×80px, WebP format.
              Save to: public/images/eu-funded.webp
            */}
            <div className={styles.logoPlaceholder}>
              <span>EU Funded Logo</span>
            </div>
          </div>
          <div className={styles.text}>
            <p className={styles.disclaimer}>
              The SENSE project is funded by the European Union, under Grant
              Agreement number 101168041. Views and opinions expressed are
              however those of the author(s) only and do not necessarily reflect
              those of the European Union or the European Health and Digital
              Executive Agency. Neither the European Union nor the granting
              authority can be held responsible for them.
            </p>
            <div className={styles.dates}>
              <span>Start: 01/01/2025</span>
              <span>Finish: 31/12/2027</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
