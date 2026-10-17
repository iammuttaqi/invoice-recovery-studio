import { defineEventHandler, readBody } from 'h3'
import { getPrisma } from '../../utils/prisma'
import { ToggleSandboxSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  const prisma = getPrisma()
  const rawBody = await readBody(event).catch(() => ({}))
  const parsed = ToggleSandboxSchema.safeParse(rawBody || {})
  const body = parsed.success ? parsed.data : {}

  let customer = event.context.customer || (await prisma.customer.findFirst())

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

  // Toggle between PRO and FREE unless explicit tier is requested
  let targetTier: 'FREE' | 'PRO' | 'LIFETIME'
  if (body?.tier) {
    targetTier = body.tier
  } else {
    targetTier = customer.tier === 'FREE' ? 'PRO' : 'FREE'
  }

  const updated = await prisma.customer.update({
    where: { id: customer.id },
    data: {
      tier: targetTier,
      // If switching to PRO, reset usage count; if switching to FREE, keep or reset
      usageCount: targetTier === 'PRO' || targetTier === 'LIFETIME' ? 0 : customer.usageCount
    }
  })

  return {
    success: true,
    newTier: updated.tier,
    usageCount: updated.usageCount,
    message: `Sandbox Mode: Customer tier changed to ${updated.tier}.`
  }
})
