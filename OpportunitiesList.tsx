'use client'

import { useState, useMemo } from 'react'
import { Opportunity, OpportunityType } from '../lib/types'

const TYPES: OpportunityType[] = ['grant', 'residency', 'open call']

function tagClass(type: string) {
  if (type === 'grant') return styles.tagGrant
  if (type === 'residency') return styles.tagResidency
  return styles.tagOpenCall
}

export default function OpportunitiesList({
  opportunities,
}: {
  opportunities: Opportunity[]
}) {
  const countries = useMemo(
    () => [...new Set(opportunities.map((o) => o.country))].sort(),
    [opportunities]
  )

  const [activeCountry, setActiveCountry] = useState<string>('')
  const [activeType, setActiveType] = useState<string>('')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return opportunities.filter((o) => {
      if (activeCountry && o.country !== activeCountry) return false
      if (activeType && o.type !== activeType) return false
      if (q && !o.title.toLowerCase().includes(q) && !o.organization.toLowerCase().includes(q) && !o.description.toLowerCase().includes(q)) return false
      return true
    })
  }, [opportunities, activeCountry, activeType, query])

  function toggleCountry(c: string) {
    setActiveCountry((prev) => (prev === c ? '' : c))
  }

  function cycleType() {
    setActiveType((prev) => {
      const idx = TYPES.indexOf(prev as OpportunityType)
      return idx === TYPES.length - 1 ? '' : TYPES[idx + 1] ?? TYPES[0]
    })
  }

  return (
    <>
      <div style={styles.filters}>
        <input
          style={styles.input}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {countries.map((c) => (
          <button
            key={c}
            style={{
              ...styles.chip,
              ...(activeCountry === c ? styles.chipActive : {}),
            }}
            onClick={() => toggleCountry(c)}
          >
            {c}
          </button>
        ))}
        <button
          style={{
            ...styles.chip,
            ...(activeType ? styles.chipActive : {}),
          }}
          onClick={cycleType}
        >
          {activeType ? activeType + 's' : 'All opportunity types'}
        </button>
      </div>

      <div style={styles.cards}>
        {filtered.map((o, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.cardTags}>
              <span style={{ ...styles.tag, ...tagClass(o.type) }}>{o.type}</span>
              <span style={{ ...styles.tag, ...styles.tagTrust }}>{o.trust} trust</span>
            </div>
            <div style={styles.cardTitle}>{o.title}</div>
            <div style={styles.cardOrg}>
              {o.organization} • {o.country}
            </div>
            <div style={styles.cardMeta}>
              <div>
                <div style={styles.metaLabel}>Deadline</div>
                <div style={styles.metaValue}>{o.deadline}</div>
              </div>
              <div>
                <div style={styles.metaLabel}>Compensation</div>
                <div style={{ ...styles.metaValue, color: '#7fff00' }}>
                  {o.compensation}
                </div>
              </div>
            </div>
            <div style={styles.cardDesc}>{o.description}</div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={styles.empty}>No opportunities match your filters.</div>
        )}
      </div>

      <style>{`
        input::placeholder { color: #3e3e36; }
        input:focus { border-color: #7fff00 !important; outline: none; }
      `}</style>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  input: {
    background: '#181814',
    border: '1px solid #2e2e26',
    color: '#c8c4b0',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '12px',
    padding: '10px 14px',
    borderRadius: '6px',
    width: '180px',
  },
  chip: {
    background: 'transparent',
    border: '1px solid #2e2e26',
    color: '#c8c4b0',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '12px',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  chipActive: {
    borderColor: '#7fff00',
    color: '#7fff00',
  },
  cards: { display: 'flex', flexDirection: 'column', gap: '14px' },
  card: {
    background: '#181814',
    border: '1px solid #2e2e26',
    borderRadius: '8px',
    padding: '1.25rem 1.5rem 1.4rem',
    cursor: 'pointer',
  },
  cardTags: { display: 'flex', gap: '8px', marginBottom: '0.9rem', flexWrap: 'wrap' },
  tag: {
    fontSize: '11px',
    padding: '3px 10px',
    borderRadius: '20px',
    border: '1px solid',
    letterSpacing: '0.04em',
  },
  tagGrant: { borderColor: '#7fff00', color: '#7fff00' },
  tagResidency: { borderColor: '#4da6ff', color: '#4da6ff' },
  tagOpenCall: { borderColor: '#ff9f4a', color: '#ff9f4a' },
  tagTrust: { borderColor: '#3e3e36', color: '#5a5a4e' },
  cardTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '17px',
    fontWeight: 500,
    color: '#e8e4d0',
    marginBottom: '0.3rem',
  },
  cardOrg: { fontSize: '11px', color: '#5a5a4e', marginBottom: '1rem' },
  cardMeta: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '0.9rem',
    borderTop: '1px solid #2e2e26',
    borderBottom: '1px solid #2e2e26',
    padding: '0.6rem 0',
  },
  metaLabel: {
    fontSize: '10px',
    letterSpacing: '0.12em',
    color: '#3e3e36',
    textTransform: 'uppercase',
    marginBottom: '3px',
  },
  metaValue: { fontSize: '13px', color: '#c8c4b0' },
  cardDesc: { fontSize: '12px', color: '#5a5a4e', lineHeight: 1.7 },
  empty: { fontSize: '13px', color: '#5a5a4e', padding: '2rem 0' },
}
