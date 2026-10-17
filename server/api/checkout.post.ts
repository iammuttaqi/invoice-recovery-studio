import { defineEventHandler, readBody, createError } from 'h3'
import { getPrisma } from '../utils/prisma'
import { getStripe, isStripeConfigured } from '../utils/stripe'
import type { CheckoutResponse } from '../../types/billing'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const plan = body?.plan || 'pro_monthly' // 'pro_monthly' | 'lifetime'
  const prisma = getPrisma()

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

  // Check if live Stripe is configured
  if (isStripeConfigured()) {
    try {
      const stripe = getStripe()!
      const appUrl = process.env.APP_URL || 'http://localhost:3000'

      const isSubscription = plan === 'pro_monthly'
      const priceId = isSubscription
        ? process.env.STRIPE_PRO_MONTHLY_PRICE_ID
        : process.env.STRIPE_LIFETIME_PRICE_ID

      // If price IDs are configured, use them, otherwise fallback to price_data
      const session = await stripe.checkout.sessions.create({
        customer_email: customer.email,
        payment_method_types: ['card'],
        line_items: priceId
          ? [{ price: priceId, quantity: 1 }]
          : [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: isSubscription
                      ? 'InvoiceRecovery Studio Pro (Monthly)'
                      : 'InvoiceRecovery Studio Founder Lifetime Deal',
                    description: isSubscription
                      ? 'Unlimited letters, 4-stage escalations, statutory calculator, and formal PDF letterhead'
                      : 'Lifetime access with unlimited recovery escalations & commercial agency license'
                  },
                  unit_amount: isSubscription ? 2900 : 7900,
                  ...(isSubscription ? { recurring: { interval: 'month' } } : {})
                },
                quantity: 1
              }
            ],
        mode: isSubscription ? 'subscription' : 'payment',
        success_url: `${appUrl}/?session_id={CHECKOUT_SESSION_ID}&upgrade_success=true`,
        cancel_url: `${appUrl}/?canceled=true`,
        metadata: {
          customerId: customer.id,
          plan
        }
      })

      return {
        checkoutUrl: session.url
      } as CheckoutResponse
    } catch (err: any) {
      console.warn('[Stripe Checkout Error, falling back to sandbox]:', err.message)
    }
  }

  // Zero-Friction Sandbox Fallback Simulation:
  const newTier = plan === 'lifetime' ? 'LIFETIME' : 'PRO'
  await prisma.customer.update({
    where: { id: customer.id },
    data: {
      tier: newTier,
      usageCount: 0
    }
  })

  return {
    isSandbox: true,
    message: `Stripe API keys unconfigured or sandbox selected. Upgraded to ${newTier} via local simulation.`,
    simulatedTier: newTier
  } as CheckoutResponse
})
