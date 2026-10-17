import { calculateStatutoryDebt } from '../server/utils/statutoryRates'
import { calculateSettlementOffer } from '../server/utils/settlementCalculator'
import { generateLetterNotice, ESCALATION_STAGES } from '../server/utils/letterTemplates'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
  console.log(`✓ ${message}`)
}

async function runTests() {
  console.log('--- Testing Statutory Rates Engine ---')

  // 1. UK Calculation Test (£14,200, 45 days overdue)
  const now = new Date('2026-10-17T00:00:00Z')
  const dueUk = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000)

  const ukClaim = calculateStatutoryDebt({
    principalAmount: 14200,
    currency: 'GBP',
    jurisdiction: 'UK',
    dueDate: dueUk,
    targetDate: now
  })

  assert(ukClaim.daysOverdue === 45, `UK days overdue expected 45, got ${ukClaim.daysOverdue}`)
  assert(ukClaim.statutoryCompensationFee === 100, `UK statutory fee >= £10k expected 100, got ${ukClaim.statutoryCompensationFee}`)
  assert(Math.abs(ukClaim.accruedInterest - 231.97) < 0.1, `UK accrued interest expected ~231.97, got ${ukClaim.accruedInterest}`)
  assert(Math.abs(ukClaim.totalClaimAmount - 14531.97) < 0.2, `UK total claim expected ~14531.97, got ${ukClaim.totalClaimAmount}`)

  // 2. UK Fee Brackets
  const ukBracketLow = calculateStatutoryDebt({
    principalAmount: 500,
    currency: 'GBP',
    jurisdiction: 'UK',
    dueDate: dueUk,
    targetDate: now
  })
  assert(ukBracketLow.statutoryCompensationFee === 40, `UK low bracket fee expected 40, got ${ukBracketLow.statutoryCompensationFee}`)

  const ukBracketMid = calculateStatutoryDebt({
    principalAmount: 5000,
    currency: 'GBP',
    jurisdiction: 'UK',
    dueDate: dueUk,
    targetDate: now
  })
  assert(ukBracketMid.statutoryCompensationFee === 70, `UK mid bracket fee expected 70, got ${ukBracketMid.statutoryCompensationFee}`)

  // 3. EU Calculation Test (€4,800, 72 days overdue)
  const dueEu = new Date(now.getTime() - 72 * 24 * 60 * 60 * 1000)
  const euClaim = calculateStatutoryDebt({
    principalAmount: 4800,
    currency: 'EUR',
    jurisdiction: 'EU',
    dueDate: dueEu,
    targetDate: now
  })
  assert(euClaim.daysOverdue === 72, `EU days overdue expected 72, got ${euClaim.daysOverdue}`)
  assert(euClaim.annualRatePercent === 11.75, `EU annual rate expected 11.75%, got ${euClaim.annualRatePercent}%`)
  assert(euClaim.statutoryCompensationFee === 40, `EU fixed fee expected 40, got ${euClaim.statutoryCompensationFee}`)

  // 4. US Calculation Test ($8,500, 45 days overdue)
  const usClaim = calculateStatutoryDebt({
    principalAmount: 8500,
    currency: 'USD',
    jurisdiction: 'US',
    dueDate: dueUk,
    targetDate: now
  })
  assert(usClaim.annualRatePercent === 12.0, `US rate expected 12.0%, got ${usClaim.annualRatePercent}%`)
  assert(usClaim.statutoryCompensationFee === 0, `US fee expected 0, got ${usClaim.statutoryCompensationFee}`)

  console.log('--- Testing Settlement Calculator ---')
  const settlement = calculateSettlementOffer({
    principalAmount: 10000,
    currency: 'USD',
    discountPct: 8.0,
    windowHours: 48
  })
  assert(settlement.discountAmount === 800, `Settlement discount expected 800, got ${settlement.discountAmount}`)
  assert(settlement.settlementAmount === 9200, `Settlement amount expected 9200, got ${settlement.settlementAmount}`)
  assert(settlement.clauseMarkdown.includes('CONDITIONAL PROMPT SETTLEMENT OFFER'), 'Settlement clause text contains header')

  console.log('--- Testing Escalation Notice Generator ---')
  for (const stage of ESCALATION_STAGES) {
    const letter = generateLetterNotice({
      stageNumber: stage.stageNumber,
      invoice: {
        invoiceNumber: 'INV-TEST-001',
        clientName: 'Test Debtor Corp',
        issueDate: new Date('2026-08-01'),
        dueDate: dueUk,
        principalAmount: 10000,
        currency: 'USD',
        jurisdiction: 'US'
      },
      calculation: usClaim,
      settlementClauseMarkdown: settlement.clauseMarkdown
    })
    assert(letter.stageNumber === stage.stageNumber, `Letter generated for stage ${stage.stageNumber}`)
    assert(letter.letterMarkdown.length > 200, `Letter markdown length non-empty for stage ${stage.stageNumber}`)
    assert(letter.subjectLine.length > 10, `Subject line non-empty for stage ${stage.stageNumber}`)
  }

  console.log('All statutory and recovery engine tests passed successfully!')
}

runTests().catch((e) => {
  console.error(e)
  process.exit(1)
})
