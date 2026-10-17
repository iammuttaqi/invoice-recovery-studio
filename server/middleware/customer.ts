import { defineEventHandler } from 'h3'
import { getPrisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  // Only process API routes
  if (!event.path.startsWith('/api/')) {
    return
  }

  const prisma = getPrisma()

  try {
    // Find default customer or first available
    let customer = await prisma.customer.findFirst({
      where: { email: 'principal@studio.example.com' }
    })

    if (!customer) {
      customer = await prisma.customer.findFirst()
    }

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

    // Check if quotaResetDate is older than 30 days and reset if necessary
    const now = new Date()
    const resetDate = new Date(customer.quotaResetDate)
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000

    if (now.getTime() - resetDate.getTime() > thirtyDaysMs) {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          usageCount: 0,
          quotaResetDate: now
        }
      })
    }

    event.context.customer = customer
  } catch (error) {
    console.error('[Tenant Middleware] Error resolving customer:', error)
  }
})
