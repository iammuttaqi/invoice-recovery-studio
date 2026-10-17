export type JurisdictionCode = 'US' | 'UK' | 'EU'

export type InvoiceStatus = 'PENDING' | 'OVERDUE' | 'RESOLVED'

export type AgingBucket = 'ALL' | '1-14' | '15-30' | '31-60' | '60+'

export interface StatutoryCalculation {
  principalAmount: number
  currency: string
  jurisdiction: JurisdictionCode
  daysOverdue: number
  statuteName: string
  annualRatePercent: number
  dailyInterestRate: number
  dailyAccrualAmount: number
  accruedInterest: number
  statutoryCompensationFee: number
  totalClaimAmount: number
  statutoryCitation: string
}

export interface CreditorInfo {
  companyName: string
  signatory: string
  remittanceDetails: string
  creditorAddress?: string
  creditorEmail?: string
}

export interface SettlementCalculation {
  originalPrincipal: number
  currency: string
  discountPct: number
  discountAmount: number
  settlementAmount: number
  windowHours: number
  deadlineIso: string
  clauseMarkdown: string
}

export interface EscalationStageMeta {
  stageNumber: number
  stageName: string
  tone: string
  recommendedBucket: string
  minDays: number
  maxDays?: number
  isLockedForFree: boolean
  description: string
}

export interface InvoiceViewModel {
  id: string
  customerId: string
  invoiceNumber: string
  clientName: string
  clientEmail?: string | null
  clientAddress?: string | null
  clientCompanyNumber?: string | null
  issueDate: string
  dueDate: string
  principalAmount: number
  currency: string
  jurisdiction: JurisdictionCode
  status: InvoiceStatus
  notes?: string | null
  createdAt: string
  updatedAt: string
  // Computed client-side / server enriched
  daysOverdue: number
  agingBucket: AgingBucket
  accruedInterest: number
  statutoryFee: number
  totalClaim: number
  calculation?: StatutoryCalculation
}

export interface RecoveryEscalationModel {
  id: string
  invoiceId: string
  stageNumber: number
  stageName: string
  daysOverdue: number
  interestAccrued: number
  statutoryFee: number
  totalClaimAmount: number
  letterMarkdown: string
  settlementDiscountAmount?: number | null
  settlementDeadline?: string | null
  generatedAt: string
}
