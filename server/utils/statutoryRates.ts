import type { JurisdictionCode, StatutoryCalculation } from '../../types/recovery'

export interface StatutoryRateDefinition {
  jurisdiction: JurisdictionCode
  statuteName: string
  annualRatePercent: number
  fixedCompensationFee: (principal: number) => number
  citation: string
}

export const STATUTORY_RATES: Record<JurisdictionCode, StatutoryRateDefinition> = {
  UK: {
    jurisdiction: 'UK',
    statuteName: 'Late Payment of Commercial Debts (Interest) Act 1998',
    // Bank of England Base Rate (5.25%) + statutory margin (8.00%) = 13.25%
    annualRatePercent: 13.25,
    fixedCompensationFee: (principal: number): number => {
      // UK Section 5A tier brackets
      if (principal < 1000) return 40.0
      if (principal < 10000) return 70.0
      return 100.0
    },
    citation:
      'Late Payment of Commercial Debts (Interest) Act 1998, s.6 & Late Payment of Commercial Debts Regulations (Bank of England Base Rate + 8.00% p.a., plus s.5A fixed compensation fee).'
  },
  EU: {
    jurisdiction: 'EU',
    statuteName: 'Directive 2011/7/EU on Late Payment in Commercial Transactions',
    // ECB Main Refinancing Rate (3.75%) + statutory margin (8.00%) = 11.75%
    annualRatePercent: 11.75,
    fixedCompensationFee: (): number => 40.0, // Article 6 flat fee
    citation:
      'Directive 2011/7/EU of the European Parliament and of the Council on combating late payment in commercial transactions (ECB Refinancing Rate + 8.00% p.a., plus Article 6 flat €40.00 compensation fee).'
  },
  US: {
    jurisdiction: 'US',
    statuteName: 'US Commercial Prompt Payment Standard',
    // Standard commercial rate: 1.0% per month = 12.00% p.a.
    annualRatePercent: 12.0,
    fixedCompensationFee: (): number => 0.0,
    citation:
      'Calculated pursuant to standard commercial late payment rates (1.0% per month / 12.00% p.a.) under US Uniform Commercial Code and commercial prompt payment terms.'
  }
}

export interface CalculateStatutoryDebtParams {
  principalAmount: number
  currency: string
  jurisdiction: JurisdictionCode | string
  dueDate: Date | string
  targetDate?: Date | string
}

export function calculateStatutoryDebt(params: CalculateStatutoryDebtParams): StatutoryCalculation {
  const jurisdictionKey = (
    ['UK', 'EU', 'US'].includes(params.jurisdiction) ? params.jurisdiction : 'US'
  ) as JurisdictionCode

  const rateDef = STATUTORY_RATES[jurisdictionKey]
  const principal = Math.max(0, Number(params.principalAmount) || 0)

  const due = typeof params.dueDate === 'string' ? new Date(params.dueDate) : params.dueDate
  const target = params.targetDate
    ? typeof params.targetDate === 'string'
      ? new Date(params.targetDate)
      : params.targetDate
    : new Date()

  // Calculate elapsed calendar days overdue
  const diffMs = target.getTime() - due.getTime()
  const daysOverdue = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))

  // Daily interest formula: (Principal * AnnualRate / 100) / 365
  const dailyRate = (rateDef.annualRatePercent / 100) / 365
  const dailyAccrual = Number(((principal * rateDef.annualRatePercent / 100) / 365).toFixed(4))
  const accruedInterest = Number((dailyAccrual * daysOverdue).toFixed(2))

  // Fixed compensation fee applies if invoice is overdue (daysOverdue > 0)
  const fee = daysOverdue > 0 ? rateDef.fixedCompensationFee(principal) : 0
  const statutoryCompensationFee = Number(fee.toFixed(2))

  const totalClaimAmount = Number((principal + accruedInterest + statutoryCompensationFee).toFixed(2))

  return {
    principalAmount: Number(principal.toFixed(2)),
    currency: params.currency || 'USD',
    jurisdiction: jurisdictionKey,
    daysOverdue,
    statuteName: rateDef.statuteName,
    annualRatePercent: rateDef.annualRatePercent,
    dailyInterestRate: Number(dailyRate.toFixed(8)),
    dailyAccrualAmount: Number(dailyAccrual.toFixed(2)),
    accruedInterest,
    statutoryCompensationFee,
    totalClaimAmount,
    statutoryCitation: rateDef.citation
  }
}
