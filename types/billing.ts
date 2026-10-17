export type CustomerTier = 'FREE' | 'PRO' | 'LIFETIME'

export interface CustomerBillingState {
  id: string
  email: string
  organizationName: string
  tier: CustomerTier
  usageCount: number
  quotaLimit: number
  quotaResetDate: string
  isPro?: boolean
  isLifetime?: boolean
  hasReachedQuota?: boolean
  quotaRemaining?: number
  stripeCustomerId?: string | null
  subscriptionId?: string | null
}

export interface CheckoutPayload {
  plan: 'pro_monthly' | 'lifetime'
  customerEmail?: string
}

export interface CheckoutResponse {
  checkoutUrl?: string
  isSandbox?: boolean
  message?: string
  simulatedTier?: CustomerTier
}
