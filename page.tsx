import { getOpportunities } from '../lib/opportunities'
import OpportunitiesList from '../components/OpportunitiesList'

export const revalidate = 3600 // re-read CSV every hour on Vercel

export default function Home() {
  const opportunities = getOpportunities()
  const countries = [...new Set(opportunities.map((o) => o.country))]

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&family=Space+Grotesk:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <main style={styles.root}>

        {/* Header */}
        <header style={styles.header}>
          <div>
            <p style={styles.breadcrumb}>AS / IF — PROJECT</p>
            <h1 style={styles.title}>
              Artist<br />
              <em style={styles.titleAccent}>Finder</em>
            </h1>
            <p style={styles.subtitle}>
              Discover grants, residencies and open calls
              <br />for visual artists across Europe
            </p>
          </div>
          <div style={styles.meta}>
            <p style={styles.metaLabel}>Opportunities</p>
            <p style={styles.metaCount}>{opportunities.length}</p>
            <p style={{ ...styles.metaLabel, textAlign: 'right', marginTop: '0.5rem' }}>
              Deployed
            </p>
            <p style={styles.metaStatus}>Live</p>
          </div>
        </header>

        {/* Filters + cards (client component) */}
        <OpportunitiesList opportunities={opportunities} />

        {/* Footer */}
        <footer style={styles.footer}>
          <span style={styles.footerLeft}>ARTISTFINDER-WEB.VERCEL.APP</span>
          <a
            href="https://github.com/hpjvisser/artistfinder-web"
            style={styles.footerRight}
          >
            Next.js + AI pipeline →
          </a>
        </footer>
      </main>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    background: '#0d0d0b',
    minHeight: '100vh',
    padding: '2.5rem 2.5rem 3rem',
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#c8c4b0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2.5rem',
  },
  breadcrumb: {
    fontSize: '11px',
    letterSpacing: '0.12em',
    color: '#5a5a4e',
    textTransform: 'uppercase',
    marginBottom: '0.75rem',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '52px',
    fontWeight: 600,
    lineHeight: 1,
    color: '#e8e4d0',
  },
  titleAccent: {
    color: '#7fff00',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: '12px',
    color: '#5a5a4e',
    lineHeight: 1.6,
    marginTop: '1rem',
    maxWidth: '320px',
  },
  meta: { textAlign: 'right' },
  metaLabel: {
    fontSize: '10px',
    letterSpacing: '0.15em',
    color: '#5a5a4e',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
  },
  metaCount: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '48px',
    fontWeight: 600,
    color: '#e8e4d0',
    lineHeight: 1,
  },
  metaStatus: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '36px',
    fontWeight: 600,
    color: '#7fff00',
    lineHeight: 1,
  },
  footer: {
    marginTop: '3rem',
    borderTop: '1px solid #2e2e26',
    paddingTop: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    fontSize: '10px',
    letterSpacing: '0.14em',
    color: '#3e3e36',
    textTransform: 'uppercase',
  },
  footerRight: {
    fontSize: '12px',
    color: '#7fff00',
    textDecoration: 'none',
  },
}
