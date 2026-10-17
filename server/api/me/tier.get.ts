import { defineEventHandler } from 'h3'
import { getPrisma, ensureDatabaseReady } from '../../utils/prisma'
import type { CustomerBillingState } from '../../../types/billing'

export default defineEventHandler(async (event) => {
  const prisma = getPrisma()
  await ensureDatabaseReady(prisma)
  let customer = event.context.customer

  if (!customer) {
    customer = await prisma.customer.findFirst({
      where: { email: 'principal@studio.example.com' }
    })

    if (!customer) {
      customer = await prisma.customer.findFirst()
    }
  }

  if (!customer) {
    return {
      id: 'anonymous',
      email: 'guest@studio.example.com',
      organizationName: 'Independent Studio',
      tier: 'FREE',
      usageCount: 0,
      quotaLimit: 3,
      quotaResetDate: new Date().toISOString(),
      isPro: false,
      isLifetime: false,
      hasReachedQuota: false,
      quotaRemaining: 3
    } as CustomerBillingState
  }

  const isPro = customer.tier === 'PRO' || customer.tier === 'LIFETIME'
  const isLifetime = customer.tier === 'LIFETIME'
  const hasReachedQuota = !isPro && customer.usageCount >= customer.quotaLimit
  const quotaRemaining = isPro ? 999 : Math.max(0, customer.quotaLimit - customer.usageCount)

  return {
    id: customer.id,
    email: customer.email,
    organizationName: customer.organizationName,
    tier: customer.tier as any,
    usageCount: customer.usageCount,
    quotaLimit: customer.quotaLimit,
    quotaResetDate: customer.quotaResetDate.toISOString(),
    isPro,
    isLifetime,
    hasReachedQuota,
    quotaRemaining,
    stripeCustomerId: customer.stripeCustomerId,
    subscriptionId: customer.subscriptionId
  } as CustomerBillingState
})
