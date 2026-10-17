<script setup lang="ts">
import { useInvoiceRecovery } from '../../composables/useInvoiceRecovery'
import EscalationStageTabs from './EscalationStageTabs.vue'
import SettlementDiscountControl from './SettlementDiscountControl.vue'
import LetterPreviewPane from './LetterPreviewPane.vue'
import DualExportToolbar from './DualExportToolbar.vue'
import StatusBadge from '../ui/StatusBadge.vue'
import { FileSpreadsheet, Building2, Calendar, Scale, ShieldAlert } from 'lucide-vue-next'

const { selectedInvoice } = useInvoiceRecovery()

function formatMoney(amount: number, currency: string): string {
  const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$'
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Active Invoice Context Banner -->
    <div
      v-if="selectedInvoice"
      class="bg-surface border border-border rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold font-mono text-navy-brand">
            {{ selectedInvoice.invoiceNumber }}
          </span>
          <span class="text-slate-300">/</span>
          <span class="text-xs font-semibold text-text-primary">
            {{ selectedInvoice.clientName }}
          </span>
          <StatusBadge :status="selectedInvoice.status" size="sm" />
        </div>

        <div class="flex items-center gap-3 text-xs text-text-muted flex-wrap">
          <span class="flex items-center gap-1 font-mono">
            <Calendar class="w-3.5 h-3.5" />
            Matured {{ formatDate(selectedInvoice.dueDate) }}
          </span>
          <span class="text-slate-300">•</span>
          <span class="font-mono text-crimson-due font-semibold">
            {{ selectedInvoice.daysOverdue }} days past due
          </span>
          <span class="text-slate-300">•</span>
          <span class="font-mono uppercase bg-slate-100 px-1 py-0.5 rounded text-[10px] text-slate-700">
            {{ selectedInvoice.jurisdiction }} Commercial Statute
          </span>
        </div>
      </div>

      <!-- Quick figures -->
      <div class="flex items-center gap-4 text-xs font-mono self-end md:self-auto shrink-0 bg-inset px-3 py-2 rounded-lg">
        <div>
          <span class="text-[10px] text-text-muted block font-sans">Principal</span>
          <span class="font-semibold text-text-primary tabular-nums">
            {{ formatMoney(selectedInvoice.principalAmount, selectedInvoice.currency) }}
          </span>
        </div>
        <div class="border-l border-border pl-3">
          <span class="text-[10px] text-text-muted block font-sans">Statutory Claim</span>
          <span class="font-bold text-navy-brand tabular-nums">
            {{ formatMoney(selectedInvoice.totalClaim, selectedInvoice.currency) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 4-Stage Progressive Escalation Tabs -->
    <EscalationStageTabs />

    <!-- 48-Hour Fast Settlement Discount Formulator -->
    <SettlementDiscountControl />

    <!-- Letter Live Preview -->
    <LetterPreviewPane />

    <!-- Export & Quota Toolbar -->
    <DualExportToolbar />
  </div>
</template>
