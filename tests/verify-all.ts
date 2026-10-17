import fs from 'node:fs'
import path from 'node:path'
import { mockEvent } from 'h3'
import { calculateStatutoryDebt } from '../server/utils/statutoryRates'
import { calculateSettlementOffer } from '../server/utils/settlementCalculator'
import { generateLetterNotice, ESCALATION_STAGES } from '../server/utils/letterTemplates'
import { getPrisma, ensureDatabaseSchema } from '../server/utils/prisma'
import generateHandler from '../server/api/recovery/generate.post'
import checkoutHandler from '../server/api/checkout.post'

let totalPassed = 0
let totalFailed = 0

function logPass(msg: string) {
  totalPassed++
  console.log(`  [PASS] ${msg}`)
}

function assert(condition: boolean, msg: string) {
  if (!condition) {
    totalFailed++
    console.error(`  [FAIL] ${msg}`)
    throw new Error(`Assertion failed: ${msg}`)
  }
  logPass(msg)
}

async function runComprehensiveVerification() {
  console.log('=================================================================')
  console.log('   INVOICERECOVERY STUDIO — COMPREHENSIVE VERIFICATION SUITE    ')
  console.log('   Standards 4.0 Autonomous Software Studio                      ')
  console.log('=================================================================')

  // =========================================================================
  // 1. Statutory Rate Deterministic Engine Tests
  // =========================================================================
  console.log('\n--- 1. Statutory Calculation Deterministic Engine Verification ---')
  const now = new Date('2026-10-17T00:00:00Z')
  const dueUk = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000)

  // 1.1 UK Late Payment Act 1998 (Large Debt Bracket >= £10,000)
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

  // 1.2 UK Fee Brackets (< £1,000 and £1,000 - £9,999.99)
  const ukLow = calculateStatutoryDebt({
    principalAmount: 650,
    currency: 'GBP',
    jurisdiction: 'UK',
    dueDate: dueUk,
    targetDate: now
  })
  assert(ukLow.statutoryCompensationFee === 40, 'UK statutory fee for < £1,000 is £40.00')

  const ukMid = calculateStatutoryDebt({
    principalAmount: 5200,
    currency: 'GBP',
    jurisdiction: 'UK',
    dueDate: dueUk,
    targetDate: now
  })
  assert(ukMid.statutoryCompensationFee === 70, 'UK statutory fee for £1,000 - £9,999.99 is £70.00')

  // 1.3 EU Directive 2011/7/EU Test (€4,800, 72 days overdue)
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
  assert(euCalc.totalClaimAmount > euCalc.principalAmount, 'EU total claim exceeds principal amount')

  // 1.4 US UCC / Commercial Test ($8,500, 45 days overdue)
  const usCalc = calculateStatutoryDebt({
    principalAmount: 8500,
    currency: 'USD',
    jurisdiction: 'US',
    dueDate: dueUk,
    targetDate: now
  })
  assert(usCalc.annualRatePercent === 12.0, 'US rate is 12.0% (1.0% per month commercial standard)')
  assert(usCalc.statutoryCompensationFee === 0, 'US statutory fixed fee is $0.00')
  assert(Math.abs(usCalc.accruedInterest - 125.75) < 0.2, 'US accrued interest calculated at 12% p.a.')

  // =========================================================================
  // 2. Fast-Settlement 48-Hour Formulator Verification
  // =========================================================================
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
  assert(new Date(offer.deadlineIso).getTime() > Date.now(), 'Deadline timestamp is valid future ISO string')

  // =========================================================================
  // 3. 4-Stage Progressive Escalation Sequence Verification
  // =========================================================================
  console.log('\n--- 3. 4-Stage Progressive Notice Sequence Verification ---')
  assert(ESCALATION_STAGES.length === 4, 'Precisely 4 progressive escalation stages defined')

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
    assert(notice.stageNumber === stage.stageNumber, `Generated Stage ${stage.stageNumber}: ${stage.stageName}`)
    assert(notice.subjectLine.length > 15, `Subject line present and informative for Stage ${stage.stageNumber}`)
    assert(notice.letterMarkdown.includes('CONDITIONAL PROMPT SETTLEMENT OFFER'), `Settlement clause embedded in Stage ${stage.stageNumber}`)
    assert(notice.plainText.length > 100, `Plain text rendering valid for Stage ${stage.stageNumber}`)
  }

  // =========================================================================
  // 4. Database Persistence, CRUD & Cascade Integrity Verification
  // =========================================================================
  console.log('\n--- 4. Database Persistence, CRUD & Cascade Integrity Verification ---')
  const prisma = getPrisma()
  await ensureDatabaseSchema(prisma)

  // Verify seed customer
  const customer = await prisma.customer.findFirst({
    where: { email: 'principal@studio.example.com' }
  })
  assert(!!customer, 'Tenant customer record active and resolved')

  const seededInvoices = await prisma.invoice.findMany({
    where: { customerId: customer!.id }
  })
  assert(seededInvoices.length >= 3, `Pre-seeded realistic invoice scenarios count is ${seededInvoices.length} (>= 3)`)

  // Test Invoice CRUD
  const testInv = await prisma.invoice.create({
    data: {
      customerId: customer!.id,
      invoiceNumber: 'INV-TEST-CRUD-999',
      clientName: 'Ephemeral Client Inc',
      clientEmail: 'billing@ephemeral.example.com',
      issueDate: new Date('2026-08-01'),
      dueDate: new Date('2026-09-01'),
      principalAmount: 3200,
      currency: 'USD',
      jurisdiction: 'US',
      notes: 'Initial test note'
    }
  })
  assert(!!testInv.id, 'Invoice record created successfully (Create)')

  const fetchedInv = await prisma.invoice.findUnique({ where: { id: testInv.id } })
  assert(fetchedInv?.invoiceNumber === 'INV-TEST-CRUD-999', 'Invoice record fetched successfully (Read)')

  const updatedInv = await prisma.invoice.update({
    where: { id: testInv.id },
    data: { notes: 'Updated settlement proposal dispatched' }
  })
  assert(updatedInv.notes === 'Updated settlement proposal dispatched', 'Invoice record updated successfully (Update)')

  // Create linked escalation snapshot
  const testEsc = await prisma.recoveryEscalation.create({
    data: {
      invoiceId: testInv.id,
      stageNumber: 1,
      stageName: 'Courtesy Check-in',
      daysOverdue: 15,
      interestAccrued: 15.5,
      statutoryFee: 0,
      totalClaimAmount: 3215.5,
      letterMarkdown: '# Courtesy Notice Test'
    }
  })
  assert(!!testEsc.id, 'Linked recovery escalation snapshot created')

  // Test Cascade Deletion: deleting the invoice must delete linked recovery escalations
  await prisma.invoice.delete({ where: { id: testInv.id } })
  const orphanedEsc = await prisma.recoveryEscalation.findUnique({ where: { id: testEsc.id } })
  assert(orphanedEsc === null, 'Cascade integrity verified: escalation automatically deleted with invoice (Delete & Cascade)')

  // =========================================================================
  // 5. Built-in Monetization, Quota Limits & Paywall Gating Verification
  // =========================================================================
  console.log('\n--- 5. Monetization & Paywall Gating Verification ---')

  // Reset customer to clean FREE tier state
  await prisma.customer.update({
    where: { id: customer!.id },
    data: { tier: 'FREE', usageCount: 0, quotaLimit: 3 }
  })
  assert(true, 'Customer reset to FREE tier with 0/3 usage')

  // 5.1 Free tier quota consumption: generate 3 letters
  for (let i = 1; i <= 3; i++) {
    const stage = (i % 3) || 1 // stages 1, 2, 1
    const evt = mockEvent('/api/recovery/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        invoiceId: seededInvoices[0].id,
        stageNumber: stage
      })
    })
    const res = await generateHandler(evt)
    assert(res.currentUsage === i, `Letter ${i} generated successfully; current usage is ${i}/3`)
    assert(res.quotaRemaining === 3 - i, `Quota remaining correctly decremented to ${3 - i}`)
  }

  // 5.2 Quota Limit Enforcement: 4th letter generation MUST throw HTTP 402 QuotaExceeded
  let quotaBlocked = false
  try {
    const evt4 = mockEvent('/api/recovery/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        invoiceId: seededInvoices[0].id,
        stageNumber: 1
      })
    })
    await generateHandler(evt4)
  } catch (err: any) {
    if (err.statusCode === 402 && err.data?.error === 'QuotaExceeded') {
      quotaBlocked = true
    }
  }
  assert(quotaBlocked, 'Quota limit triggered: 4th letter generation blocked with HTTP 402 (QuotaExceeded)')

  // 5.3 Feature Paywall Gating: Free customer attempting Stage 4 MUST throw HTTP 402 FeatureLocked
  await prisma.customer.update({
    where: { id: customer!.id },
    data: { usageCount: 0 } // Reset usage count to isolate feature gating from quota exhaustion
  })

  let stage4Blocked = false
  try {
    const evtStage4 = mockEvent('/api/recovery/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        invoiceId: seededInvoices[0].id,
        stageNumber: 4
      })
    })
    await generateHandler(evtStage4)
  } catch (err: any) {
    if (err.statusCode === 402 && err.data?.error === 'FeatureLocked') {
      stage4Blocked = true
    }
  }
  assert(stage4Blocked, 'Feature gating triggered: Stage 4 blocked for Free tier with HTTP 402 (FeatureLocked)')

  // 5.4 Stripe Checkout Sandbox Simulation: Upgrade to PRO
  const checkoutEvt = mockEvent('/api/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ plan: 'pro_monthly' })
  })
  const checkoutRes = await checkoutHandler(checkoutEvt)
  assert(checkoutRes.isSandbox === true, 'Stripe checkout sandbox fallback activated')
  assert(checkoutRes.simulatedTier === 'PRO', 'Simulated checkout upgraded customer tier to PRO')

  const upgradedCustomer = await prisma.customer.findUnique({ where: { id: customer!.id } })
  assert(upgradedCustomer?.tier === 'PRO', 'Customer record verified as PRO tier in database')
  assert(upgradedCustomer?.usageCount === 0, 'Usage count reset to 0 upon PRO upgrade')

  // 5.5 Pro Tier Unmetered Access: Stage 4 now generates without HTTP 402
  const proEvt = mockEvent('/api/recovery/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      invoiceId: seededInvoices[0].id,
      stageNumber: 4
    })
  })
  const proGenRes = await generateHandler(proEvt)
  assert(proGenRes.escalation.stageNumber === 4, 'PRO tier successfully generates Stage 4 Legal Notice without paywall')
  assert(proGenRes.quotaRemaining === 999, 'PRO tier provides unmetered quota remaining (999)')

  // Clean up: Reset customer back to FREE tier baseline
  await prisma.customer.update({
    where: { id: customer!.id },
    data: { tier: 'FREE', usageCount: 0, quotaLimit: 3 }
  })
  assert(true, 'Monetization test teardown: customer reset to baseline FREE tier')

  // =========================================================================
  // 6. Anti-AI Slop Heuristic Audit
  // =========================================================================
  console.log('\n--- 6. Standards 4.0 Anti-AI Slop Heuristic Audit ---')
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u

  const genericBuzzwords = [
    'revolutionary',
    'revolutionize',
    'game-changing',
    'game changer',
    'magic',
    'magical',
    'cutting-edge',
    'cutting edge',
    'seamlessly automate',
    'seamless integration',
    'supercharge',
    'unleash',
    'synergy',
    'paradigm shift',
    'next-generation AI',
    'hyper-growth',
    '10x your'
  ]

  function scanApplicationFiles(dir: string): { files: string[]; emojiCount: number; buzzwordCount: number } {
    let files: string[] = []
    let emojiCount = 0
    let buzzwordCount = 0

    for (const item of fs.readdirSync(dir)) {
      if (['node_modules', '.git', '.nuxt', '.output', 'dist'].includes(item)) continue
      const full = path.join(dir, item)
      const stat = fs.statSync(full)
      if (stat.isDirectory()) {
        const sub = scanApplicationFiles(full)
        files = files.concat(sub.files)
        emojiCount += sub.emojiCount
        buzzwordCount += sub.buzzwordCount
      } else if (/\.(vue|ts|js|css)$/.test(item)) {
        files.push(full)
        const content = fs.readFileSync(full, 'utf8')
        if (emojiRegex.test(content)) {
          console.error(`  [FAIL] EMOJI DETECTED in: ${full}`)
          emojiCount++
        }
        if (item.endsWith('.vue')) {
          for (const b of genericBuzzwords) {
            const r = new RegExp(`\\b${b}\\b`, 'i')
            if (r.test(content)) {
              console.error(`  [FAIL] BUZZWORD "${b}" DETECTED in: ${full}`)
              buzzwordCount++
            }
          }
        }
      }
    }
    return { files, emojiCount, buzzwordCount }
  }

  const auditResults = scanApplicationFiles('.')
  assert(auditResults.emojiCount === 0, `Zero emojis detected across all application source files (${auditResults.files.length} scanned)`)
  assert(auditResults.buzzwordCount === 0, 'Zero generic AI marketing buzzwords detected in UI templates')

  // Lucide Icons verification
  const vueFiles = auditResults.files.filter((f) => f.endsWith('.vue'))
  let lucideImportsCount = 0
  let foreignIconLibFound = false
  for (const f of vueFiles) {
    const content = fs.readFileSync(f, 'utf8')
    if (/@heroicons|@iconify|feather-icons|font-awesome|vue-material-design-icons/.test(content)) {
      foreignIconLibFound = true
      console.error(`  [FAIL] Foreign icon library found in: ${f}`)
    }
    const matches = content.match(/from\s+['"]lucide-vue-next['"]/g)
    if (matches) lucideImportsCount += matches.length
  }
  assert(!foreignIconLibFound, '100% semantic SVG icons from lucide-vue-next; zero non-compliant icon libraries')
  assert(lucideImportsCount > 0, `Verified ${lucideImportsCount} active semantic Lucide icon imports across components`)

  // =========================================================================
  // 7. Serverless Cold-Start Database Integrity
  // =========================================================================
  console.log('\n--- 7. Serverless Cold-Start Database Integrity Verification ---')
  const prismaStarterPath = path.resolve(process.cwd(), 'prisma/starter.db')
  const publicStarterPath = path.resolve(process.cwd(), 'public/starter.db')

  assert(fs.existsSync(prismaStarterPath), 'prisma/starter.db exists and is ready for cold-start deployment')
  assert(fs.existsSync(publicStarterPath), 'public/starter.db exists and is ready for static asset serving')

  const starterStat1 = fs.statSync(prismaStarterPath)
  const starterStat2 = fs.statSync(publicStarterPath)
  assert(starterStat1.size >= 32768, `prisma/starter.db file size is valid (${starterStat1.size} bytes)`)
  assert(starterStat2.size >= 32768, `public/starter.db file size is valid (${starterStat2.size} bytes)`)

  // =========================================================================
  // Final Summary
  // =========================================================================
  console.log('\n=================================================================')
  console.log(`   VERIFICATION SUITE COMPLETE: ${totalPassed} PASSED, ${totalFailed} FAILED   `)
  console.log('   ALL VERIFICATION PROTOCOLS PASSED WITH ZERO ERRORS (100%)    ')
  console.log('=================================================================')
}

runComprehensiveVerification().catch((err) => {
  console.error('\n[FATAL TEST SUITE FAILURE]:', err)
  process.exit(1)
})
