import { ReactElement } from 'react'
import Image from 'next/image'
import styles from './index.module.css'
import Container from '@shared/atoms/Container'

export default function EuFunding(): ReactElement {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.content}>
          <div className={styles.logoContainer}>
            <Image
              src="/images/funded-by-eu.png"
              alt="Funded by the European Union"
              className={styles.logo}
              height={80}
              width={320}
            />
          </div>
          <div className={styles.text}>
            <p className={styles.disclaimer}>
              Strengthening Cities and Enhancing Neighbourhood Sense of
              Belonging (SENSE) Project has received co-funding from European
              Union&apos;s Digital Europe Programme under the Grant Agreement
              No. 101167948
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
