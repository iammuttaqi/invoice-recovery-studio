import type { SettlementCalculation } from '../../types/recovery'

export interface CalculateSettlementOfferParams {
  principalAmount: number
  currency: string
  discountPct?: number
  windowHours?: number
}

export function getCurrencySymbol(currency: string): string {
  switch (currency.toUpperCase()) {
    case 'GBP':
      return '£'
    case 'EUR':
      return '€'
    case 'USD':
    default:
      return '$'
  }
}

export function calculateSettlementOffer(params: CalculateSettlementOfferParams): SettlementCalculation {
  const principal = Math.max(0, Number(params.principalAmount) || 0)
  const discountPct = Math.min(50, Math.max(1, Number(params.discountPct) || 8.0))
  const windowHours = Number(params.windowHours) || 48
  const currency = params.currency || 'USD'
  const symbol = getCurrencySymbol(currency)

  const discountAmount = Number(((principal * discountPct) / 100).toFixed(2))
  const settlementAmount = Number((principal - discountAmount).toFixed(2))

  const deadline = new Date(Date.now() + windowHours * 60 * 60 * 1000)
  const deadlineIso = deadline.toISOString()

  const formattedDeadline = deadline.toUTCString().replace(/GMT$/, 'UTC')

  const clauseMarkdown = `### CONDITIONAL PROMPT SETTLEMENT OFFER
As a commercial courtesy to facilitate immediate accounts closure, Creditor offers a conditional concession of ${discountPct.toFixed(1)}% (${symbol}${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}). Remittance of exactly **${symbol}${settlementAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** received in cleared funds prior to **${formattedDeadline}** shall constitute full and final satisfaction of this invoice.

### STRICT CONDITIONAL WAIVER NOTICE
Failure to remit the discounted amount in cleared funds prior to the stated deadline shall immediately render this offer null and void without prejudice. The full principal balance of **${symbol}${principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** plus accrued statutory interest and statutory debt recovery compensation fees shall remain immediately due, payable, and enforceable in full.`

  return {
    originalPrincipal: Number(principal.toFixed(2)),
    currency,
    discountPct,
    discountAmount,
    settlementAmount,
    windowHours,
    deadlineIso,
    clauseMarkdown
  }
}
