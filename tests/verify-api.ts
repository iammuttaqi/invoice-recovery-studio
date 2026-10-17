import { getPrisma } from '../server/utils/prisma'
import { calculateStatutoryDebt } from '../server/utils/statutoryRates'
import { calculateSettlementOffer } from '../server/utils/settlementCalculator'
import { generateLetterNotice } from '../server/utils/letterTemplates'

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`)
  console.log(`✓ ${msg}`)
}

async function testBackend() {
  console.log('--- Testing Database & API Utilities ---')
  const prisma = getPrisma()

  // 1. Check customer
  const customer = await prisma.customer.findFirst({
    where: { email: 'principal@studio.example.com' }
  })
  assert(!!customer, 'Default customer exists in SQLite database')
  assert(customer!.tier === 'FREE', `Customer tier is FREE (was ${customer?.tier})`)

  // 2. Check invoices
  const invoices = await prisma.invoice.findMany({
    where: { customerId: customer!.id }
  })
  assert(invoices.length >= 3, `Expected at least 3 seeded invoices, found ${invoices.length}`)

  // 3. Test calculation for first invoice
  const firstInv = invoices[0]
  const calc = calculateStatutoryDebt({
    principalAmount: firstInv.principalAmount,
    currency: firstInv.currency,
    jurisdiction: firstInv.jurisdiction,
    dueDate: firstInv.dueDate
  })
  assert(calc.totalClaimAmount >= calc.principalAmount, `Total claim >= principal: ${calc.totalClaimAmount} >= ${calc.principalAmount}`)

  // 4. Test letter generation
  const letter = generateLetterNotice({
    stageNumber: 1,
    invoice: firstInv,
    calculation: calc
  })
  assert(letter.subjectLine.includes(firstInv.invoiceNumber), 'Subject line includes invoice number')

  // 5. Test saving escalation snapshot
  const escalation = await prisma.recoveryEscalation.create({
    data: {
      invoiceId: firstInv.id,
      stageNumber: 1,
      stageName: 'Courtesy Check-in',
      daysOverdue: calc.daysOverdue,
      interestAccrued: calc.accruedInterest,
      statutoryFee: calc.statutoryCompensationFee,
      totalClaimAmount: calc.totalClaimAmount,
      letterMarkdown: letter.letterMarkdown
    }
  })
  assert(!!escalation.id, 'Escalation snapshot created in database')

  // Clean up test escalation
  await prisma.recoveryEscalation.delete({ where: { id: escalation.id } })

  console.log('API and Database integration tests passed successfully!')
}

testBackend().catch((e) => {
  console.error(e)
  process.exit(1)
})
