import { ReactElement } from 'react'
import styles from './index.module.css'
import Container from '@shared/atoms/Container'

export default function VisionMission(): ReactElement {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.block}>
            <h2 className={styles.heading}>
              Our Vision: The European CitiVerse
            </h2>
            <p className={styles.text}>
              SENSE envisions a federated CitiVerse — a shared European digital
              space built on immersive VR/AR technology and interoperable data
              infrastructure. By connecting cities through digital twins and
              real-time data exchange, SENSE empowers citizens, city planners
              and innovators to co-create smarter, more sustainable urban
              environments.
            </p>
            <a
              className={styles.link}
              href="https://senseverse.eu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LEARN MORE ↗
            </a>
          </div>
          <div className={styles.imageContainer}>
            {/* 
              PLACEHOLDER: Replace with SENSE vision graphic.
              Recommended size: 560×400px, WebP format.
              Save to: public/images/sense-vision.webp
            */}
            <div className={styles.imagePlaceholder}>
              <span>Vision Graphic</span>
            </div>
          </div>
        </div>

        <div className={`${styles.grid} ${styles.mirror}`}>
          <div className={styles.block}>
            <h2 className={styles.heading}>Our Mission</h2>
            <p className={styles.text}>
              We deliver a federated data space and marketplace for smart city
              services — powered by Compute-to-Data, Self-Sovereign Identity and
              Gaia-X compliance. SENSE enables trusted, privacy-preserving data
              sharing across European pilot cities, making urban innovation
              accessible, sovereign and scalable.
            </p>
            <a
              className={styles.link}
              href="https://senseverse.eu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LEARN MORE ↗
            </a>
          </div>
          <div className={styles.imageContainer}>
            {/* 
              PLACEHOLDER: Replace with SENSE mission graphic.
              Recommended size: 560×400px, WebP format.
              Save to: public/images/sense-mission.webp
            */}
            <div className={styles.imagePlaceholder}>
              <span>Mission Graphic</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
