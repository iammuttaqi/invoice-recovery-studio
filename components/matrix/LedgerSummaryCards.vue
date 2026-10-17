<script setup lang="ts">
import { useInvoiceRecovery } from '../../composables/useInvoiceRecovery'
import { Receipt, Percent, Scale, ShieldAlert } from 'lucide-vue-next'

const { ledgerTotals } = useInvoiceRecovery()

function formatMoney(amount: number): string {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Card 1: Outstanding Principal -->
    <div class="bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between">
      <div class="flex items-center justify-between text-text-muted mb-2">
        <span class="text-xs font-medium uppercase tracking-wider">Outstanding Principal</span>
        <div class="p-1.5 bg-slate-100 rounded-md text-text-secondary">
          <Receipt class="w-4 h-4" />
        </div>
      </div>
      <div>
        <div class="text-2xl font-bold font-mono text-text-primary tabular-nums tracking-tight">
          ${{ formatMoney(ledgerTotals.principal) }}
        </div>
        <p class="text-[11px] text-text-muted mt-1">
          {{ ledgerTotals.overdueCount }} active receivables awaiting settlement
        </p>
      </div>
    </div>

    <!-- Card 2: Accrued Statutory Interest -->
    <div class="bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between">
      <div class="flex items-center justify-between text-text-muted mb-2">
        <span class="text-xs font-medium uppercase tracking-wider">Accrued Late Interest</span>
        <div class="p-1.5 bg-amber-50 rounded-md text-amber-warn">
          <Percent class="w-4 h-4" />
        </div>
      </div>
      <div>
        <div class="text-2xl font-bold font-mono text-amber-700 tabular-nums tracking-tight">
          +${{ formatMoney(ledgerTotals.interest) }}
        </div>
        <p class="text-[11px] text-text-muted mt-1">
          Pro-rata commercial late rates per statute
        </p>
      </div>
    </div>

    <!-- Card 3: Statutory Compensation Fees -->
    <div class="bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between">
      <div class="flex items-center justify-between text-text-muted mb-2">
        <span class="text-xs font-medium uppercase tracking-wider">Fixed Statutory Fees</span>
        <div class="p-1.5 bg-blue-50 rounded-md text-blue-admin">
          <Scale class="w-4 h-4" />
        </div>
      </div>
      <div>
        <div class="text-2xl font-bold font-mono text-blue-800 tabular-nums tracking-tight">
          +${{ formatMoney(ledgerTotals.fees) }}
        </div>
        <p class="text-[11px] text-text-muted mt-1">
          UK s.5A (£40-£100) & EU Art.6 (€40)
        </p>
      </div>
    </div>

    <!-- Card 4: Total Enforceable Claim -->
    <div class="bg-surface border-2 border-navy-brand/20 rounded-xl p-4 shadow-xs bg-gradient-to-br from-white to-blue-50/30 flex flex-col justify-between">
      <div class="flex items-center justify-between text-navy-brand mb-2">
        <span class="text-xs font-semibold uppercase tracking-wider">Total Enforceable Claim</span>
        <div class="p-1.5 bg-navy-brand/10 rounded-md text-navy-brand">
          <ShieldAlert class="w-4 h-4" />
        </div>
      </div>
      <div>
        <div class="text-2xl font-extrabold font-mono text-navy-brand tabular-nums tracking-tight">
          ${{ formatMoney(ledgerTotals.totalClaim) }}
        </div>
        <p class="text-[11px] text-text-secondary mt-1">
          Principal + Accrued Interest + Statutory Fees
        </p>
      </div>
    </div>
  </div>
</template>
