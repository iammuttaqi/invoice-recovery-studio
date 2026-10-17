<script setup lang="ts">
import { Check, X, ShieldAlert, Sparkles, Zap } from 'lucide-vue-next'
import BaseButton from '../ui/BaseButton.vue'

interface Props {
  isProcessing?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'selectPlan', plan: 'pro_monthly' | 'lifetime'): void
}>()

const featureList = [
  { name: 'Monthly Letter Generations', free: '3 letters / mo', pro: 'Unlimited', ltd: 'Unlimited' },
  { name: 'Active Invoices Monitored', free: 'Up to 3 invoices', pro: 'Unlimited', ltd: 'Unlimited' },
  { name: 'Statutory Interest Calculator', free: 'Basic estimate', pro: 'UK, EU, US Statutes', ltd: 'UK, EU, US Statutes' },
  { name: 'Fixed Statutory Debt Fees (£40–£100, €40)', free: false, pro: true, ltd: true },
  { name: 'Stage 4 Formal Legal Demand (LBA)', free: false, pro: true, ltd: true },
  { name: '48-Hour Fast Settlement Generator', free: false, pro: true, ltd: true },
  { name: 'Formal Print / PDF Letterhead Export', free: false, pro: true, ltd: true },
  { name: 'Commercial Agency Multi-Entity License', free: false, pro: false, ltd: true }
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Pro Monthly Plan Card -->
    <div
      class="border-2 border-navy-brand rounded-xl p-5 bg-surface shadow-md relative flex flex-col justify-between"
    >
      <div class="absolute -top-3 right-4 bg-navy-brand text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
        <Zap class="w-3 h-3" />
        Most Popular
      </div>

      <div>
        <div class="flex items-center gap-2 mb-1">
          <h3 class="text-base font-bold text-text-primary">Pro Monthly</h3>
        </div>
        <p class="text-xs text-text-secondary mb-4">
          For active boutique agencies, senior contractors, and specialized consultants recovering recurring receivables.
        </p>

        <div class="flex items-baseline gap-1.5 mb-5 pb-4 border-b border-border">
          <span class="text-3xl font-extrabold font-mono text-navy-brand tabular-nums tracking-tight">$29</span>
          <span class="text-xs text-text-muted font-medium">/ month</span>
        </div>

        <ul class="space-y-2.5 text-xs mb-6">
          <li class="flex items-start gap-2 text-text-primary">
            <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
            <span><strong>Unlimited</strong> recovery letter generation</span>
          </li>
          <li class="flex items-start gap-2 text-text-primary">
            <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
            <span>Full <strong>Stage 4 Legal Demand (LBA)</strong> access</span>
          </li>
          <li class="flex items-start gap-2 text-text-primary">
            <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
            <span>Statutory UK 1998, EU 2011/7, and US PPA rates</span>
          </li>
          <li class="flex items-start gap-2 text-text-primary">
            <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
            <span><strong>48h Fast Settlement</strong> conditional discount builder</span>
          </li>
          <li class="flex items-start gap-2 text-text-primary">
            <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
            <span>Downloadable <strong>PDF Letterhead</strong> export</span>
          </li>
        </ul>
      </div>

      <BaseButton
        variant="primary"
        class="w-full"
        :loading="isProcessing"
        @click="emit('selectPlan', 'pro_monthly')"
      >
        <span>Upgrade to Pro Monthly ($29/mo)</span>
      </BaseButton>
    </div>

    <!-- Founder Lifetime Deal Card -->
    <div
      class="border border-slate-300 rounded-xl p-5 bg-gradient-to-b from-slate-50 to-white shadow-sm relative flex flex-col justify-between"
    >
      <div class="absolute -top-3 right-4 bg-emerald-700 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
        <Sparkles class="w-3 h-3" />
        Pay Once, Keep Forever
      </div>

      <div>
        <div class="flex items-center gap-2 mb-1">
          <h3 class="text-base font-bold text-text-primary">Founder Lifetime Deal</h3>
        </div>
        <p class="text-xs text-text-secondary mb-4">
          One-time capital outlay for permanent peace of mind. Zero recurring subscriptions, includes agency rights.
        </p>

        <div class="flex items-baseline gap-1.5 mb-5 pb-4 border-b border-border">
          <span class="text-3xl font-extrabold font-mono text-emerald-800 tabular-nums tracking-tight">$79</span>
          <span class="text-xs text-text-muted font-medium">one-time payment</span>
        </div>

        <ul class="space-y-2.5 text-xs mb-6">
          <li class="flex items-start gap-2 text-text-primary">
            <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
            <span><strong>Everything in Pro</strong> in perpetuity</span>
          </li>
          <li class="flex items-start gap-2 text-text-primary">
            <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
            <span><strong>Commercial Agency License</strong> for multiple entities</span>
          </li>
          <li class="flex items-start gap-2 text-text-primary">
            <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
            <span>Custom institutional branding & letterhead styles</span>
          </li>
          <li class="flex items-start gap-2 text-text-primary">
            <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
            <span><strong>Zero recurring charges</strong> forever</span>
          </li>
          <li class="flex items-start gap-2 text-text-primary">
            <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
            <span>Priority access to future roadmap integrations</span>
          </li>
        </ul>
      </div>

      <BaseButton
        variant="secondary"
        class="w-full border-slate-300 hover:bg-slate-100"
        :loading="isProcessing"
        @click="emit('selectPlan', 'lifetime')"
      >
        <span>Get Lifetime License ($79)</span>
      </BaseButton>
    </div>
  </div>
</template>
