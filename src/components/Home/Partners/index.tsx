import { ReactElement } from 'react'
import styles from './index.module.css'
import Container from '@shared/atoms/Container'

interface Partner {
  name: string
  logo: string
  url?: string
}

const partners: Partner[] = [
  { name: 'City of Kiel', logo: '/images/partners/city-of-kiel.png' },
  {
    name: 'City of Cartagena',
    logo: '/images/partners/city-of-cartagena.png'
  },
  { name: 'deltaDAO', logo: '/images/partners/deltadao.png' },
  {
    name: 'Drees & Sommer',
    logo: '/images/partners/drees-and-sommer.png'
  },
  { name: 'DUNAV NET', logo: '/images/partners/dunav-net.png' },
  { name: 'Libelium', logo: '/images/partners/libelium.png' },
  { name: 'OASCities', logo: '/images/partners/oascities.png' },
  { name: 'MaaS Alliance', logo: '/images/partners/maas-alliance.png' },
  {
    name: 'Kiel Marketing',
    logo: '/images/partners/kiel-marketing.png'
  },
  {
    name: 'University of Galway',
    logo: '/images/partners/university-of-galway.png'
  }
]

export default function Partners(): ReactElement {
  return (
    <section className={styles.section}>
      <Container>
        <h2 className={styles.heading}>OUR PARTNERS</h2>
        <div className={styles.grid}>
          {partners.map((partner) => (
            <div key={partner.name} className={styles.card}>
              <img
                className={styles.logo}
                src={partner.logo}
                alt={partner.name}
              />
            </div>
          ))}
        </div>
        <div className={styles.allPartners}>
          <a
            className={styles.link}
            href="https://senseverse.eu/partner-description/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ALL PROJECT PARTNERS ↗
          </a>
        </div>
      </Container>
    </section>
  )
}
