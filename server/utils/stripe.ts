import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_'))
}

export function getStripe(): Stripe | null {
  if (!isStripeConfigured()) {
    return null
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-01-27.acacia' as any
    })
  }

  return stripeInstance
}
