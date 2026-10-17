import fs from 'node:fs'
import path from 'node:path'
import { calculateStatutoryDebt } from '../server/utils/statutoryRates'
import { calculateSettlementOffer } from '../server/utils/settlementCalculator'
import { generateLetterNotice, ESCALATION_STAGES } from '../server/utils/letterTemplates'
import { getPrisma, ensureDatabaseSchema } from '../server/utils/prisma'

function logPass(msg: string) {
  console.log(`[PASS] ${msg}`)
}

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`[FAIL] ${msg}`)
    throw new Error(`Assertion failed: ${msg}`)
  }
  logPass(msg)
}

async function runComprehensiveVerification() {
  console.log('=================================================================')
  console.log('   INVOICERECOVERY STUDIO — COMPREHENSIVE VERIFICATION SUITE    ')
  console.log('   Standards 4.0 Autonomous Software Studio                      ')
  console.log('=================================================================')

  // 1. Statutory Rate Deterministic Tests
  console.log('\n--- 1. Statutory Calculation Deterministic Verification ---')
  const now = new Date('2026-10-17T00:00:00Z')
  const dueUk = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000)

  const ukCalc = calculateStatutoryDebt({
    principalAmount: 14200,
    currency: 'GBP',
    jurisdiction: 'UK',
    dueDate: dueUk,
    targetDate: now
  })
  assert(ukCalc.daysOverdue === 45, 'UK debt 45 days overdue computed correctly')
  assert(ukCalc.annualRatePercent === 13.25, 'UK annual statutory rate is 13.25% (BoE 5.25% + 8.0%)')
  assert(ukCalc.statutoryCompensationFee === 100, 'UK statutory fee for >= £10,000 is £100.00 (s.5A)')
  assert(Math.abs(ukCalc.accruedInterest - 231.97) < 0.1, 'UK accrued interest equals £231.97')
  assert(Math.abs(ukCalc.totalClaimAmount - 14531.97) < 0.2, 'UK total claim equals £14,531.97')

  // EU Directive 2011/7/EU Test
  const dueEu = new Date(now.getTime() - 72 * 24 * 60 * 60 * 1000)
  const euCalc = calculateStatutoryDebt({
    principalAmount: 4800,
    currency: 'EUR',
    jurisdiction: 'EU',
    dueDate: dueEu,
    targetDate: now
  })
  assert(euCalc.daysOverdue === 72, 'EU debt 72 days overdue computed correctly')
  assert(euCalc.annualRatePercent === 11.75, 'EU rate is 11.75% (ECB 3.75% + 8.0%)')
  assert(euCalc.statutoryCompensationFee === 40, 'EU statutory fee is flat €40.00 (Article 6)')

  // US UCC / Commercial Test
  const usCalc = calculateStatutoryDebt({
    principalAmount: 8500,
    currency: 'USD',
    jurisdiction: 'US',
    dueDate: dueUk,
    targetDate: now
  })
  assert(usCalc.annualRatePercent === 12.0, 'US rate is 12.0% (1.0% per month)')
  assert(usCalc.statutoryCompensationFee === 0, 'US statutory fixed fee is $0.00')

  // 2. 48-Hour Prompt Settlement Formulator
  console.log('\n--- 2. Fast-Settlement 48-Hour Formulator Verification ---')
  const offer = calculateSettlementOffer({
    principalAmount: 10000,
    currency: 'USD',
    discountPct: 8.0,
    windowHours: 48
  })
  assert(offer.discountAmount === 800, '8% discount on $10,000 yields $800 concession')
  assert(offer.settlementAmount === 9200, 'Net payable within 48h is $9,200.00')
  assert(offer.clauseMarkdown.includes('CONDITIONAL PROMPT SETTLEMENT OFFER'), 'Includes formal settlement offer clause')
  assert(offer.clauseMarkdown.includes('STRICT CONDITIONAL WAIVER NOTICE'), 'Includes strict conditional waiver notice')

  // 3. 4-Stage Progressive Escalation Generation
  console.log('\n--- 3. 4-Stage Progressive Notice Sequence Verification ---')
  for (const stage of ESCALATION_STAGES) {
    const notice = generateLetterNotice({
      stageNumber: stage.stageNumber,
      invoice: {
        invoiceNumber: 'INV-2026-TEST',
        clientName: 'Delinquent Client LLC',
        issueDate: new Date('2026-07-01'),
        dueDate: dueUk,
        principalAmount: 8500,
        currency: 'USD',
        jurisdiction: 'US'
      },
      calculation: usCalc,
      settlementClauseMarkdown: offer.clauseMarkdown
    })
    assert(notice.stageNumber === stage.stageNumber, `Generated Notice for Stage ${stage.stageNumber}: ${stage.stageName}`)
    assert(notice.subjectLine.length > 10, `Subject line present for Stage ${stage.stageNumber}`)
    assert(notice.letterMarkdown.includes('CONDITIONAL PROMPT SETTLEMENT OFFER'), `Settlement clause interpolated into Stage ${stage.stageNumber}`)
  }

  // 4. Serverless Cold-Start SQLite & Database Self-Healing
  console.log('\n--- 4. Database Persistence & Cold-Start Self-Healing Verification ---')
  const prisma = getPrisma()
  await ensureDatabaseSchema(prisma)

  const customer = await prisma.customer.findFirst({
    where: { email: 'principal@studio.example.com' }
  })
  assert(!!customer, 'Tenant customer record active and resolved')

  const invoices = await prisma.invoice.findMany({
    where: { customerId: customer!.id }
  })
  assert(invoices.length >= 3, `Pre-seeded realistic scenario count is ${invoices.length} (>= 3)`)

  // 5. Zero-Emoji Compliance Verification
  console.log('\n--- 5. Standards 4.0 Zero-Emoji Repository Audit ---')
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u

  function scanDir(dir: string): number {
    let errCount = 0
    for (const item of fs.readdirSync(dir)) {
      if (['node_modules', '.git', '.nuxt', '.output', 'dist'].includes(item)) continue
      const full = path.join(dir, item)
      const stat = fs.statSync(full)
      if (stat.isDirectory()) {
        errCount += scanDir(full)
      } else if (/\.(vue|ts|js|css)$/.test(item)) {
        const content = fs.readFileSync(full, 'utf8')
        if (emojiRegex.test(content)) {
          console.error(`[FAIL] EMOJI DETECTED in: ${full}`)
          errCount++
        }
      }
    }
    return errCount
  }

  const emojiViolations = scanDir('.')
  assert(emojiViolations === 0, 'Zero emojis detected across all application source files')

  console.log('\n=================================================================')
  console.log('   ALL VERIFICATION PROTOCOLS PASSED WITH ZERO ERRORS (100%)    ')
  console.log('=================================================================')
}

runComprehensiveVerification().catch((err) => {
  console.error('[FATAL TEST SUITE FAILURE]:', err)
  process.exit(1)
})
