import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'
import { Opportunity } from './types'

export function getOpportunities(): Opportunity[] {
  const csvPath = path.join(process.cwd(), 'public', 'opportunities.csv')
  const csv = fs.readFileSync(csvPath, 'utf-8')

  const { data } = Papa.parse<Opportunity>(csv, {
    header: true,
    skipEmptyLines: true,
  })

  return data
}
