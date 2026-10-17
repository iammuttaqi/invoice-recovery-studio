import { defineEventHandler } from 'h3'
import { getPrisma } from '../utils/prisma'
import { getStripe, isStripeConfigured } from '../utils/stripe'

export default defineEventHandler(async (event) => {
  const prisma = getPrisma()
  const customer = event.context.customer || (await prisma.customer.findFirst())

  if (isStripeConfigured() && customer?.stripeCustomerId) {
    try {
      const stripe = getStripe()!
      const appUrl = process.env.APP_URL || 'http://localhost:3000'

      const session = await stripe.billingPortal.sessions.create({
        customer: customer.stripeCustomerId,
        return_url: `${appUrl}/`
      })

      return {
        portalUrl: session.url
      }
    } catch (err: any) {
      console.warn('[Stripe Portal Error, falling back to sandbox message]:', err.message)
    }
  }

  return {
    isSandbox: true,
    message: 'Billing portal is simulated in sandbox mode. Manage your simulated subscription via the Sandbox status bar.'
  }
})
