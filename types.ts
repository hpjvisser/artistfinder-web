export type OpportunityType = 'grant' | 'residency' | 'open call'
export type TrustLevel = 'high' | 'medium' | 'low'

export interface Opportunity {
  title: string
  organization: string
  country: string
  type: OpportunityType
  deadline: string
  compensation: string
  trust: TrustLevel
  description: string
}
