import { defineEventHandler, readRawBody, getHeader, createError } from 'h3'
import { getPrisma } from '../../utils/prisma'
import { getStripe, isStripeConfigured } from '../../utils/stripe'

export default defineEventHandler(async (event) => {
  const stripe = getStripe()
  const prisma = getPrisma()

  if (!stripe || !isStripeConfigured()) {
    return { received: true, simulated: true }
  }

  const signature = getHeader(event, 'stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Missing stripe-signature or STRIPE_WEBHOOK_SECRET.'
    })
  }

  const rawBody = await readRawBody(event)
  if (!rawBody) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Missing raw request body for webhook verification.'
    })
  }

  let stripeEvent

  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err: any) {
    console.error('[Stripe Webhook Signature Verification Failed]:', err.message)
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: `Webhook Error: ${err.message}`
    })
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as any
        const customerEmail = session.customer_email || session.customer_details?.email
        const stripeCustomerId = session.customer as string
        const subscriptionId = session.subscription as string | null
        const plan = session.metadata?.plan || (subscriptionId ? 'pro_monthly' : 'lifetime')
        const newTier = plan === 'lifetime' ? 'LIFETIME' : 'PRO'

        if (customerEmail) {
          await prisma.customer.upsert({
            where: { email: customerEmail },
            update: {
              tier: newTier,
              stripeCustomerId,
              subscriptionId,
              usageCount: 0
            },
            create: {
              email: customerEmail,
              tier: newTier,
              stripeCustomerId,
              subscriptionId,
              usageCount: 0,
              quotaLimit: 3
            }
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as any
        const stripeCustomerId = subscription.customer as string
        const status = subscription.status

        const customer = await prisma.customer.findFirst({
          where: { stripeCustomerId }
        })

        if (customer) {
          const tier = status === 'active' || status === 'trialing' ? 'PRO' : 'FREE'
          await prisma.customer.update({
            where: { id: customer.id },
            data: {
              tier,
              subscriptionId: subscription.id
            }
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as any
        const stripeCustomerId = subscription.customer as string

        const customer = await prisma.customer.findFirst({
          where: { stripeCustomerId }
        })

        if (customer) {
          await prisma.customer.update({
            where: { id: customer.id },
            data: {
              tier: 'FREE',
              subscriptionId: null
            }
          })
        }
        break
      }

      default:
        // Ignore other events
        break
    }
  } catch (err) {
    console.error('[Stripe Webhook Processing Error]:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to process webhook event.'
    })
  }

  return { received: true }
})
