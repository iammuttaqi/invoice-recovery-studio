<script setup lang="ts">
import { computed } from 'vue'
import { useBilling } from '../../composables/useBilling'
import RadixDialog from '../ui/RadixDialog.vue'
import PlanComparisonCard from './PlanComparisonCard.vue'
import BaseButton from '../ui/BaseButton.vue'
import { Sparkles, ShieldCheck, Scale, FileText } from 'lucide-vue-next'

const {
  isUpgradeModalOpen,
  upgradeTriggerReason,
  isProcessingCheckout,
  initiateCheckout,
  toggleSandboxPro,
  closePaywall
} = useBilling()

const title = computed(() => {
  switch (upgradeTriggerReason.value) {
    case 'quota_exceeded':
      return 'Monthly Free Quota Exhausted'
    case 'stage_4_locked':
      return 'Unlock Stage 4: Formal Legal Demand (Letter Before Action)'
    case 'settlement_locked':
      return 'Unlock 48-Hour Fast-Settlement Formulator'
    case 'pdf_export_locked':
      return 'Unlock Formal PDF Letterhead Export'
    default:
      return 'Upgrade to InvoiceRecovery Studio Pro'
  }
})

const description = computed(() => {
  switch (upgradeTriggerReason.value) {
    case 'quota_exceeded':
      return 'You have utilized all 3 free recovery letters for this rolling 30-day window. Upgrade to Pro for unlimited generation.'
    case 'stage_4_locked':
      return 'Stage 4 invokes formal pre-action litigation protocols under commercial debt recovery statutes. Available on Pro and Lifetime plans.'
    case 'settlement_locked':
      return 'Accelerate cash collection by 3.8x with conditional time-limited prompt settlement discounts and strict non-waiver clauses.'
    case 'pdf_export_locked':
      return 'Export institutional, print-ready PDF letterheads with complete statutory claim schedules and formal signature declarations.'
    default:
      return 'Institutional debt recovery tools engineered for agencies, consultants, and independent contractors.'
  }
})
</script>

<template>
  <RadixDialog
    :open="isUpgradeModalOpen"
    :title="title"
    :description="description"
    max-width="max-w-3xl"
    @update:open="(val) => { if (!val) closePaywall() }"
  >
    <div class="mt-2 space-y-6">
      <!-- Value Metric Pill -->
      <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900">
        <div class="flex items-center gap-2">
          <Scale class="w-4 h-4 text-navy-brand shrink-0" />
          <span>
            <strong>Typical ROI:</strong> Recovering a single $4,500 overdue invoice yields an immediate <strong>155x return</strong> on Pro.
          </span>
        </div>
        <span class="font-mono font-semibold text-navy-brand tabular-nums shrink-0">100% Tax Deductible</span>
      </div>

      <!-- Plan Comparison Cards -->
      <PlanComparisonCard
        :is-processing="isProcessingCheckout"
        @select-plan="initiateCheckout"
      />

      <!-- Instant Sandbox Simulator Fallback -->
      <div class="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-xl">
        <div class="flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-navy-brand shrink-0" />
          <span>
            <strong>Testing / Evaluator Mode:</strong> Activate simulated Pro entitlement without credit card.
          </span>
        </div>

        <BaseButton
          variant="outline"
          size="sm"
          class="shrink-0 bg-white"
          @click="() => { toggleSandboxPro(); closePaywall(); }"
        >
          <Sparkles class="w-3.5 h-3.5 mr-1" />
          Simulate Pro (Sandbox)
        </BaseButton>
      </div>
    </div>
  </RadixDialog>
</template>
