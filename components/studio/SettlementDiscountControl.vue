<script setup lang="ts">
import { computed } from 'vue'
import { useInvoiceRecovery } from '../../composables/useInvoiceRecovery'
import { useBilling } from '../../composables/useBilling'
import RadixSwitch from '../ui/RadixSwitch.vue'
import RadixSlider from '../ui/RadixSlider.vue'
import { Sparkles, Clock, Percent, ShieldCheck, Lock } from 'lucide-vue-next'

const { isSettlementActive, settlementDiscountPct, selectedInvoice } = useInvoiceRecovery()
const { isPro, triggerPaywall } = useBilling()

function handleToggle(val: boolean) {
  if (val && !isPro.value) {
    triggerPaywall('settlement_locked')
    return
  }
  isSettlementActive.value = val
}

const principal = computed(() => selectedInvoice.value?.principalAmount || 0)
const currency = computed(() => selectedInvoice.value?.currency || 'USD')
const symbol = computed(() => (currency.value === 'GBP' ? '£' : currency.value === 'EUR' ? '€' : '$'))

const discountAmount = computed(() => {
  return Number(((principal.value * settlementDiscountPct.value) / 100).toFixed(2))
})

const settlementAmount = computed(() => {
  return Number((principal.value - discountAmount.value).toFixed(2))
})
</script>

<template>
  <div class="bg-surface border border-border rounded-xl p-4 shadow-xs space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="p-1.5 bg-blue-50 text-navy-brand rounded-md">
          <Clock class="w-4 h-4" />
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <h4 class="text-xs font-bold text-text-primary uppercase tracking-wider">
              48-Hour Prompt Settlement Formulator
            </h4>
            <span
              v-if="!isPro"
              class="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded uppercase"
            >
              <Lock class="w-2.5 h-2.5" />
              Pro
            </span>
          </div>
          <p class="text-[11px] text-text-secondary mt-0.5">
            Conditional prompt-payment discount with strict forfeiture clause if unpaid within 48 hours.
          </p>
        </div>
      </div>

      <RadixSwitch
        :model-value="isSettlementActive"
        @update:model-value="handleToggle"
      />
    </div>

    <!-- Active Slider & Figures -->
    <div v-if="isSettlementActive" class="pt-3 border-t border-border space-y-3 animate-in fade-in">
      <div class="flex items-center justify-between text-xs">
        <span class="font-medium text-text-secondary">Conditional Concession Percentage:</span>
        <span class="font-mono font-bold text-navy-brand tabular-nums">
          {{ settlementDiscountPct.toFixed(1) }}%
        </span>
      </div>

      <RadixSlider
        v-model="settlementDiscountPct"
        :min="3"
        :max="25"
        :step="0.5"
      />

      <div class="grid grid-cols-3 gap-2 p-2.5 bg-inset rounded-lg text-xs font-mono">
        <div>
          <span class="text-[10px] text-text-muted block font-sans">Full Face Value</span>
          <span class="font-semibold text-text-primary tabular-nums">
            {{ symbol }}{{ principal.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
          </span>
        </div>
        <div>
          <span class="text-[10px] text-text-muted block font-sans">Waiver Savings</span>
          <span class="font-semibold text-emerald-700 tabular-nums">
            -{{ symbol }}{{ discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
          </span>
        </div>
        <div>
          <span class="text-[10px] text-navy-brand block font-sans font-medium">Payable in 48h</span>
          <span class="font-bold text-navy-brand tabular-nums text-sm">
            {{ symbol }}{{ settlementAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
          </span>
        </div>
      </div>

      <div class="text-[11px] text-text-muted flex items-center gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
        <ShieldCheck class="w-3.5 h-3.5 text-navy-brand shrink-0" />
        <span>
          Includes strict non-waiver condition: Failure to remit clears the discount and re-asserts full claim + statutory interest.
        </span>
      </div>
    </div>
  </div>
</template>
