<script setup lang="ts">
import { useBilling } from '../../composables/useBilling'
import BaseButton from '../ui/BaseButton.vue'
import { Scale, Sparkles, CreditCard, ShieldCheck } from 'lucide-vue-next'

const {
  isPro,
  isLifetime,
  billingState,
  quotaRemaining,
  triggerPaywall,
  toggleSandboxPro,
  openCustomerPortal,
  isTogglingSandbox
} = useBilling()
</script>

<template>
  <header class="border-b border-border bg-surface sticky top-0 z-40 shadow-xs no-print">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <!-- Brand Identity -->
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-navy-brand flex items-center justify-center text-white shadow-xs">
          <Scale class="w-5 h-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-sm font-bold text-text-primary tracking-tight">
              InvoiceRecovery Studio
            </h1>
            <span class="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
              Standards 4.0
            </span>
          </div>
          <p class="text-[11px] text-text-secondary leading-tight hidden sm:block">
            Statutory Debt Engine & Receivables Recovery
          </p>
        </div>
      </div>

      <!-- Actions & Entitlements -->
      <div class="flex items-center gap-2.5">
        <!-- Tier / Quota Badge -->
        <div class="hidden md:flex items-center gap-1.5 text-xs bg-inset px-2.5 py-1 rounded-md border border-border">
          <span class="text-text-muted">Tier:</span>
          <span
            :class="[
              'font-semibold font-mono',
              isPro ? 'text-navy-brand' : 'text-text-primary'
            ]"
          >
            {{ isLifetime ? 'Lifetime Deal' : isPro ? 'Pro Active' : `Free (${quotaRemaining}/3)` }}
          </span>
        </div>

        <!-- Sandbox Pro Toggle Button (Zero-Friction Dev/Demo) -->
        <BaseButton
          variant="outline"
          size="sm"
          :loading="isTogglingSandbox"
          class="border-slate-300 text-xs hidden sm:inline-flex"
          @click="toggleSandboxPro"
        >
          <Sparkles class="w-3.5 h-3.5 mr-1 text-navy-brand" />
          <span>{{ isPro ? 'Switch to Free (Sandbox)' : 'Simulate Pro (Sandbox)' }}</span>
        </BaseButton>

        <!-- Upgrade / Portal Button -->
        <BaseButton
          v-if="!isPro"
          variant="primary"
          size="sm"
          @click="() => triggerPaywall('header')"
        >
          <CreditCard class="w-3.5 h-3.5 mr-1" />
          <span>Upgrade to Pro</span>
        </BaseButton>

        <BaseButton
          v-else
          variant="secondary"
          size="sm"
          @click="openCustomerPortal"
        >
          <ShieldCheck class="w-3.5 h-3.5 mr-1 text-emerald-rec" />
          <span>Billing Portal</span>
        </BaseButton>
      </div>
    </div>
  </header>
</template>
