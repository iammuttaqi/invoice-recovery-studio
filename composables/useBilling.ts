import { ref, computed } from 'vue'
import type { CustomerBillingState, CheckoutResponse } from '../types/billing'
import { useToast } from './useToast'

const billingState = ref<CustomerBillingState>({
  id: '',
  email: 'principal@studio.example.com',
  organizationName: 'Independent Studio LLC',
  tier: 'FREE',
  usageCount: 0,
  quotaLimit: 3,
  quotaResetDate: new Date().toISOString()
})

const isUpgradeModalOpen = ref<boolean>(false)
const upgradeTriggerReason = ref<string>('')
const isProcessingCheckout = ref<boolean>(false)
const isTogglingSandbox = ref<boolean>(false)

export function useBilling() {
  const toast = useToast()

  const isPro = computed(() => {
    const t = billingState.value.tier
    return t === 'PRO' || t === 'LIFETIME'
  })

  const isLifetime = computed(() => billingState.value.tier === 'LIFETIME')

  const hasReachedQuota = computed(() => {
    return !isPro.value && billingState.value.usageCount >= billingState.value.quotaLimit
  })

  const quotaRemaining = computed(() => {
    if (isPro.value) return 999
    return Math.max(0, billingState.value.quotaLimit - billingState.value.usageCount)
  })

  async function fetchTier() {
    try {
      const data = await $fetch<CustomerBillingState>('/api/me/tier')
      if (data) {
        billingState.value = data
      }
    } catch (err: any) {
      console.error('[useBilling] Error fetching customer tier:', err)
    }
  }

  function triggerPaywall(reason = 'general') {
    upgradeTriggerReason.value = reason
    isUpgradeModalOpen.value = true
  }

  function closePaywall() {
    isUpgradeModalOpen.value = false
    upgradeTriggerReason.value = ''
  }

  async function initiateCheckout(plan: 'pro_monthly' | 'lifetime') {
    isProcessingCheckout.value = true
    try {
      const res = await $fetch<CheckoutResponse>('/api/checkout', {
        method: 'POST',
        body: { plan }
      })

      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl
        return
      }

      if (res.isSandbox) {
        await fetchTier()
        toast.success(
          'Sandbox Upgrade Activated',
          `Upgraded to ${res.simulatedTier || 'PRO'}. All features unlocked.`
        )
        closePaywall()
      }
    } catch (err: any) {
      console.error('[useBilling] Checkout failed:', err)
      toast.error('Checkout Error', err?.data?.message || err.message || 'Failed to initiate upgrade.')
    } finally {
      isProcessingCheckout.value = false
    }
  }

  async function toggleSandboxPro() {
    isTogglingSandbox.value = true
    try {
      const res = await $fetch<{ success: boolean; newTier: string; message: string }>(
        '/api/sandbox/toggle-pro',
        { method: 'POST' }
      )
      if (res.success) {
        await fetchTier()
        toast.success(
          'Sandbox Tier Toggled',
          `Active customer is now on ${res.newTier} entitlement.`
        )
      }
    } catch (err: any) {
      console.error('[useBilling] Toggle sandbox failed:', err)
      toast.error('Sandbox Toggle Failed', err.message)
    } finally {
      isTogglingSandbox.value = false
    }
  }

  async function openCustomerPortal() {
    try {
      const res = await $fetch<{ portalUrl?: string; isSandbox?: boolean; message?: string }>(
        '/api/portal',
        { method: 'POST' }
      )
      if (res.portalUrl) {
        window.location.href = res.portalUrl
      } else {
        toast.info('Billing Portal Simulated', res.message || 'Managing in sandbox mode.')
      }
    } catch (err: any) {
      toast.error('Portal Error', err.message)
    }
  }

  function handleApiError(error: any): boolean {
    const status = error?.statusCode || error?.status || error?.response?.status
    const data = error?.data || error?.response?._data

    if (status === 402 || data?.error === 'QuotaExceeded' || data?.error === 'FeatureLocked') {
      const reason = data?.error === 'QuotaExceeded' ? 'quota_exceeded' : 'feature_locked'
      triggerPaywall(reason)
      return true
    }
    return false
  }

  return {
    billingState,
    isUpgradeModalOpen,
    upgradeTriggerReason,
    isProcessingCheckout,
    isTogglingSandbox,
    isPro,
    isLifetime,
    hasReachedQuota,
    quotaRemaining,
    fetchTier,
    triggerPaywall,
    closePaywall,
    initiateCheckout,
    toggleSandboxPro,
    openCustomerPortal,
    handleApiError
  }
}
