import { ReactElement } from 'react'
import styles from './index.module.css'
import Container from '@shared/atoms/Container'

interface Partner {
  name: string
  logo: string
  url?: string
}

const partners: Partner[] = [
  { name: 'City of Kiel', logo: '/images/partners/1-Kiel-sailing-city.png' },
  {
    name: 'City of Cartagena',
    logo: '/images/partners/2-EscudoAytoCartagenaHorizontal-bn.jpg'
  },
  { name: 'deltaDAO', logo: '/images/partners/3-delta-DAO.png' },
  {
    name: 'Drees & Sommer',
    logo: '/images/partners/4-Deers-Sommer.png'
  },
  { name: 'DUNAV NET', logo: '/images/partners/5-Dunav-Net.png' },
  { name: 'Libelium', logo: '/images/partners/6-Libelium.png' },
  {
    name: 'OASCities',
    logo: '/images/partners/7-Open-Agile-Smart-Cities-Communities.png'
  },
  { name: 'MaaS Alliance', logo: '/images/partners/8-MaaS-Alliance.png' },
  {
    name: 'University of Europe',
    logo: '/images/partners/9-University-of-Europe.png'
  },
  {
    name: 'University of Galway',
    logo: '/images/partners/91-OllScoil-Gaillimhe-University-of-Galway.png'
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
