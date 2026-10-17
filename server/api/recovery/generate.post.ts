import { defineEventHandler, readBody, createError } from 'h3'
import { getPrisma } from '../../utils/prisma'
import { calculateStatutoryDebt } from '../../utils/statutoryRates'
import { calculateSettlementOffer } from '../../utils/settlementCalculator'
import { generateLetterNotice, ESCALATION_STAGES } from '../../utils/letterTemplates'
import { RecoveryGenerateSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  const prisma = getPrisma()
  const rawBody = await readBody(event)
  const parsed = RecoveryGenerateSchema.safeParse(rawBody)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: parsed.error.issues.map((i) => i.message).join(', ')
    })
  }

  const body = parsed.data

  // Ensure customer context
  let customer = event.context.customer
  if (!customer) {
    customer = await prisma.customer.findFirst({
      where: { email: 'principal@studio.example.com' }
    })
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          id: 'cust_default_recovery',
          email: 'principal@studio.example.com',
          organizationName: 'Independent Studio LLC',
          tier: 'FREE',
          usageCount: 0,
          quotaLimit: 3
        }
      })
    }
  }

  const isPro = customer.tier === 'PRO' || customer.tier === 'LIFETIME'
  const stageNum = Number(body.stageNumber)

  // 1. Quota Enforcement: Free tier gets 3 letters / month
  if (!isPro && customer.usageCount >= customer.quotaLimit) {
    throw createError({
      statusCode: 402,
      statusMessage: 'Payment Required',
      data: {
        error: 'QuotaExceeded',
        message: 'You have utilized your 3 free recovery letters for this month. Upgrade to Pro for unlimited generation.',
        currentUsage: customer.usageCount,
        quotaLimit: customer.quotaLimit,
        upgradeUrl: '/api/checkout?plan=pro_monthly'
      }
    })
  }

  // 2. Feature Gating: Stage 4 is restricted to Pro / Lifetime
  if (!isPro && stageNum === 4) {
    throw createError({
      statusCode: 402,
      statusMessage: 'Payment Required',
      data: {
        error: 'FeatureLocked',
        message: 'Stage 4: Formal Legal Demand (Letter Before Action) is restricted to Pro and Lifetime tiers.',
        requiredTier: 'PRO'
      }
    })
  }

  // 3. Retrieve Invoice
  const invoice = await prisma.invoice.findUnique({
    where: { id: body.invoiceId }
  })

  if (!invoice) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: `Invoice ${body.invoiceId} was not found.`
    })
  }

  // 4. Calculate Claims
  const calculation = calculateStatutoryDebt({
    principalAmount: invoice.principalAmount,
    currency: invoice.currency,
    jurisdiction: invoice.jurisdiction,
    dueDate: invoice.dueDate
  })

  // 5. Settlement Offer formulation if requested
  let settlementClause: string | null = null
  let settlementDiscountAmount: number | null = null
  let settlementDeadline: Date | null = null

  if (body.includeSettlement) {
    const discountPct = Number(body.settlementDiscountPct) || 8.0
    const offer = calculateSettlementOffer({
      principalAmount: invoice.principalAmount,
      currency: invoice.currency,
      discountPct,
      windowHours: 48
    })
    settlementClause = offer.clauseMarkdown
    settlementDiscountAmount = offer.discountAmount
    settlementDeadline = new Date(offer.deadlineIso)
  }

  // 6. Generate Letter
  const stageMeta = ESCALATION_STAGES.find((s) => s.stageNumber === stageNum) || ESCALATION_STAGES[0]
  const letterResult = generateLetterNotice({
    stageNumber: stageNum,
    invoice,
    calculation,
    creditor: body.creditorInfo,
    settlementClauseMarkdown: settlementClause
  })

  // 7. Store Escalation snapshot in SQLite
  const escalation = await prisma.recoveryEscalation.create({
    data: {
      invoiceId: invoice.id,
      stageNumber: stageNum,
      stageName: stageMeta.stageName,
      daysOverdue: calculation.daysOverdue,
      interestAccrued: calculation.accruedInterest,
      statutoryFee: calculation.statutoryCompensationFee,
      totalClaimAmount: calculation.totalClaimAmount,
      letterMarkdown: letterResult.letterMarkdown,
      settlementDiscountAmount,
      settlementDeadline
    }
  })

  // 8. Increment customer usage count
  const updatedCustomer = await prisma.customer.update({
    where: { id: customer.id },
    data: { usageCount: customer.usageCount + 1 }
  })

  const quotaRemaining = isPro ? 999 : Math.max(0, updatedCustomer.quotaLimit - updatedCustomer.usageCount)

  return {
    escalation,
    subjectLine: letterResult.subjectLine,
    letterMarkdown: letterResult.letterMarkdown,
    plainText: letterResult.plainText,
    calculation,
    quotaRemaining,
    currentUsage: updatedCustomer.usageCount,
    quotaLimit: updatedCustomer.quotaLimit
  }
})
