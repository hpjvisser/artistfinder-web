'use client'

import { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'

type Opportunity = {
  title: string
  organization: string
  country: string
  city: string
  deadline: string
  opportunity_type: string
  compensation: string
  eligibility: string
  source_url: string
  summary: string
  disciplines: string
  source_quality: string
}

function deadlineLabel(deadline: string) {
  if (!deadline) return 'Rolling'

  const d = new Date(deadline)
  if (isNaN(d.getTime())) return deadline

  const now = new Date()
  const diff = Math.ceil(
    (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diff < 0) return 'Expired'
  if (diff <= 14) return `${diff} days left`

  return deadline
}

function badgeColor(type: string) {
  if (type === 'grant') return 'bg-green-100 text-green-800'
  if (type === 'residency') return 'bg-blue-100 text-blue-800'
  return 'bg-purple-100 text-purple-800'
}

function trustColor(level: string) {
  if (level === 'high') return 'bg-black text-white'
  if (level === 'medium') return 'bg-gray-200 text-black'
  return 'bg-yellow-100 text-yellow-800'
}

export default function Home() {
  const [data, setData] = useState<Opportunity[]>([])
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('')
  const [type, setType] = useState('')
  const [sort, setSort] = useState('deadline')

  useEffect(() => {
    Papa.parse('/opportunities.csv', {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data as Opportunity[])
      },
    })
  }, [])

  const countries = useMemo(() => {
    return [...new Set(data.map((d) => d.country).filter(Boolean))].sort()
  }, [data])

  const filtered = useMemo(() => {
    let items = data.filter((item) => {
      const q = query.toLowerCase()

      const matchesQuery =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.organization?.toLowerCase().includes(q) ||
        item.summary?.toLowerCase().includes(q)

      const matchesCountry = !country || item.country === country
      const matchesType = !type || item.opportunity_type === type

      return matchesQuery && matchesCountry && matchesType
    })

    if (sort === 'organization') {
      items.sort((a, b) =>
        a.organization.localeCompare(b.organization)
      )
    }

    return items
  }, [data, query, country, type, sort])

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3">Artist Finder</h1>
          <p className="text-gray-600 text-lg">
            Discover grants, residencies and open calls for visual artists across Europe
          </p>
        </div>

        <div className="sticky top-0 bg-gray-50 py-6 z-10">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              className="border border-gray-300 bg-white p-3 rounded-xl"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <select
              className="border border-gray-300 bg-white p-3 rounded-xl"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">All countries</option>
              {countries.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              className="border border-gray-300 bg-white p-3 rounded-xl"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All opportunity types</option>
              <option value="residency">Residency</option>
              <option value="grant">Grant</option>
              <option value="open_call">Open call</option>
            </select>

            <select
              className="border border-gray-300 bg-white p-3 rounded-xl"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="deadline">Sort: default</option>
              <option value="organization">Sort: organization</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            {filtered.length} opportunities
          </div>
        </div>

        <div className="grid gap-5 mt-6">
          {filtered.map((item, i) => (
            <a
              key={i}
              href={item.source_url}
              target="_blank"
              className="block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor(item.opportunity_type)}`}>
                  {item.opportunity_type}
                </span>

                <span className={`px-3 py-1 rounded-full text-xs font-medium ${trustColor(item.source_quality)}`}>
                  {item.source_quality} trust
                </span>
              </div>

              <h2 className="text-2xl font-semibold mb-2">
                {item.title}
              </h2>

              <p className="text-gray-600 mb-4">
                {item.organization} • {item.city} {item.country}
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-500">Deadline</span>
                  <div className="font-medium">
                    {deadlineLabel(item.deadline)}
                  </div>
                </div>

                <div>
                  <span className="text-gray-500">Compensation</span>
                  <div className="font-medium">
                    {item.compensation || 'Not specified'}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {item.summary}
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
