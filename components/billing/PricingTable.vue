<script setup lang="ts">
import { useBilling } from '../../composables/useBilling'
import BaseButton from '../ui/BaseButton.vue'
import { Check, X, Sparkles, Scale, ShieldAlert, Zap } from 'lucide-vue-next'

const { initiateCheckout, toggleSandboxPro, isPro, isLifetime } = useBilling()
</script>

<template>
  <div class="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
    <div class="text-center max-w-2xl mx-auto space-y-2">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-navy-brand rounded-full text-xs font-semibold uppercase tracking-wider">
        <Scale class="w-3.5 h-3.5" />
        Institutional Commercial Recovery
      </div>
      <h2 class="text-2xl font-bold text-text-primary tracking-tight">
        Transparent Pricing Built for Cash-Flow Recovery
      </h2>
      <p class="text-xs text-text-secondary">
        Recovering a single $4,500 overdue receivable pays for decades of access. No contingency cuts, no hourly attorney rates.
      </p>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Free Starter Tier -->
      <div class="border border-border rounded-xl p-5 bg-white flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-text-primary uppercase tracking-wider">Free Starter</h3>
            <span class="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Current Plan</span>
          </div>
          <p class="text-xs text-text-secondary mb-4">
            For independent professionals managing an occasional late invoice.
          </p>

          <div class="mb-5 pb-4 border-b border-border">
            <span class="text-3xl font-extrabold font-mono text-text-primary tabular-nums">$0</span>
            <span class="text-xs text-text-muted"> / month</span>
          </div>

          <ul class="space-y-2.5 text-xs text-text-primary mb-6">
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
              <span>3 recovery letters / rolling month</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
              <span>Up to 3 active invoices in ledger</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
              <span>Stage 1 (Courtesy) & Stage 2 (Admin)</span>
            </li>
            <li class="flex items-start gap-2 text-text-muted">
              <X class="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <span>Stage 4 Legal Demand (LBA)</span>
            </li>
            <li class="flex items-start gap-2 text-text-muted">
              <X class="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <span>48h Fast Settlement Formulator</span>
            </li>
            <li class="flex items-start gap-2 text-text-muted">
              <X class="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <span>Printable PDF Letterhead</span>
            </li>
          </ul>
        </div>

        <div class="pt-4 border-t border-border">
          <span class="text-xs text-text-muted block text-center">Active Starter Account</span>
        </div>
      </div>

      <!-- Pro Monthly Plan -->
      <div class="border-2 border-navy-brand rounded-xl p-5 bg-surface shadow-md relative flex flex-col justify-between">
        <div class="absolute -top-3 right-4 bg-navy-brand text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
          <Zap class="w-3 h-3" />
          Recommended
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-navy-brand uppercase tracking-wider">Pro Monthly</h3>
          </div>
          <p class="text-xs text-text-secondary mb-4">
            For growing agencies, consultants, and contractors who bill recurring milestones.
          </p>

          <div class="mb-5 pb-4 border-b border-border">
            <span class="text-3xl font-extrabold font-mono text-navy-brand tabular-nums">$29</span>
            <span class="text-xs text-text-muted"> / month</span>
          </div>

          <ul class="space-y-2.5 text-xs text-text-primary mb-6">
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
              <span><strong>Unlimited</strong> letter generation</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
              <span><strong>Unlimited</strong> active receivables</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
              <span>Full <strong>4-Stage Escalations</strong> (incl. LBA)</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
              <span>UK 1998, EU 2011/7, and US PPA rates</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
              <span><strong>48h Fast Settlement</strong> discount builder</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
              <span>Formal <strong>PDF Letterhead</strong> export</span>
            </li>
          </ul>
        </div>

        <BaseButton
          variant="primary"
          class="w-full"
          @click="initiateCheckout('pro_monthly')"
        >
          <span>Subscribe to Pro ($29/mo)</span>
        </BaseButton>
      </div>

      <!-- Founder Lifetime Deal -->
      <div class="border border-emerald-300 rounded-xl p-5 bg-gradient-to-b from-emerald-50/40 to-white shadow-xs relative flex flex-col justify-between">
        <div class="absolute -top-3 right-4 bg-emerald-700 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
          <Sparkles class="w-3 h-3" />
          Pay Once
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-emerald-900 uppercase tracking-wider">Founder Lifetime</h3>
          </div>
          <p class="text-xs text-text-secondary mb-4">
            Permanent access with zero ongoing subscription costs. Includes agency rights.
          </p>

          <div class="mb-5 pb-4 border-b border-border">
            <span class="text-3xl font-extrabold font-mono text-emerald-800 tabular-nums">$79</span>
            <span class="text-xs text-text-muted"> one-time payment</span>
          </div>

          <ul class="space-y-2.5 text-xs text-text-primary mb-6">
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
              <span><strong>Everything in Pro</strong> in perpetuity</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
              <span><strong>Multi-entity Agency License</strong></span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
              <span>Custom branding & wire configurations</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
              <span>Zero recurring fees forever</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-emerald-rec mt-0.5 shrink-0" />
              <span>Future roadmap & API additions</span>
            </li>
          </ul>
        </div>

        <BaseButton
          variant="secondary"
          class="w-full border-emerald-300 hover:bg-emerald-50"
          @click="initiateCheckout('lifetime')"
        >
          <span>Get Lifetime Deal ($79)</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>
