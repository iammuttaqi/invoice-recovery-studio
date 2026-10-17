<script setup lang="ts">
import { useInvoiceRecovery } from '../../composables/useInvoiceRecovery'
import StatusBadge from '../ui/StatusBadge.vue'
import RadixDropdown from '../ui/RadixDropdown.vue'
import BaseButton from '../ui/BaseButton.vue'
import {
  MoreVertical,
  CheckCircle2,
  Trash2,
  FileText,
  AlertCircle,
  Building2,
  ArrowRight,
  Database
} from 'lucide-vue-next'

const {
  filteredInvoices,
  selectedInvoiceId,
  isLoadingInvoices,
  selectInvoice,
  markAsResolved,
  deleteInvoice,
  loadSampleInvoices
} = useInvoiceRecovery()

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

function getActions(inv: any) {
  return [
    { id: 'select', label: 'Select for Recovery Escalation', icon: FileText },
    {
      id: 'resolve',
      label: inv.status === 'RESOLVED' ? 'Mark Overdue' : 'Mark as Resolved / Paid',
      icon: CheckCircle2
    },
    { id: 'delete', label: 'Delete Invoice', icon: Trash2, danger: true }
  ]
}

function handleAction(actionId: string, invoiceId: string) {
  if (actionId === 'select') {
    selectInvoice(invoiceId)
  } else if (actionId === 'resolve') {
    markAsResolved(invoiceId)
  } else if (actionId === 'delete') {
    deleteInvoice(invoiceId)
  }
}
</script>

<template>
  <div class="bg-surface border border-border rounded-xl shadow-xs overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="bg-inset border-b border-border text-text-secondary font-semibold uppercase tracking-wider text-[11px]">
            <th class="py-3 px-4">Invoice #</th>
            <th class="py-3 px-4">Debtor Entity</th>
            <th class="py-3 px-4">Maturity / Overdue</th>
            <th class="py-3 px-4 text-right">Principal</th>
            <th class="py-3 px-4 text-right">Interest</th>
            <th class="py-3 px-4 text-right">Statutory Fee</th>
            <th class="py-3 px-4 text-right">Total Claim</th>
            <th class="py-3 px-4">Status</th>
            <th class="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/60">
          <tr
            v-for="inv in filteredInvoices"
            :key="inv.id"
            :class="[
              'transition-colors duration-100 cursor-pointer select-none',
              selectedInvoiceId === inv.id
                ? 'bg-blue-50/50 hover:bg-blue-50/70 font-medium'
                : 'hover:bg-slate-50/70',
              inv.status === 'RESOLVED' ? 'opacity-60 bg-slate-50/30' : ''
            ]"
            @click="selectInvoice(inv.id)"
          >
            <!-- Invoice # -->
            <td class="py-3 px-4 font-mono font-bold text-navy-brand tabular-nums">
              <div class="flex items-center gap-1.5">
                <span
                  v-if="selectedInvoiceId === inv.id"
                  class="w-1.5 h-1.5 rounded-full bg-navy-brand shrink-0"
                />
                {{ inv.invoiceNumber }}
              </div>
            </td>

            <!-- Debtor Entity & Jurisdiction -->
            <td class="py-3 px-4">
              <div class="font-medium text-text-primary">{{ inv.clientName }}</div>
              <div class="text-[11px] text-text-muted flex items-center gap-1.5 mt-0.5">
                <span class="font-mono uppercase px-1 py-0.2 bg-slate-100 rounded text-[10px] text-slate-700">
                  {{ inv.jurisdiction }}
                </span>
                <span class="truncate max-w-[160px]">{{ inv.notes || inv.clientEmail || 'No notes' }}</span>
              </div>
            </td>

            <!-- Maturity / Overdue -->
            <td class="py-3 px-4">
              <div class="text-text-secondary">{{ formatDate(inv.dueDate) }}</div>
              <div class="mt-0.5">
                <span
                  v-if="inv.status === 'RESOLVED'"
                  class="text-[11px] text-emerald-700 font-medium"
                >
                  Settled
                </span>
                <span
                  v-else
                  :class="[
                    'text-[11px] font-mono font-semibold tabular-nums',
                    inv.daysOverdue >= 60 ? 'text-crimson-due' : inv.daysOverdue >= 30 ? 'text-amber-warn' : 'text-text-secondary'
                  ]"
                >
                  {{ inv.daysOverdue }} days past due
                </span>
              </div>
            </td>

            <!-- Principal -->
            <td class="py-3 px-4 text-right font-mono text-text-primary tabular-nums">
              {{ formatMoney(inv.principalAmount, inv.currency) }}
            </td>

            <!-- Accrued Interest -->
            <td class="py-3 px-4 text-right font-mono text-amber-700 tabular-nums">
              +{{ formatMoney(inv.accruedInterest, inv.currency) }}
            </td>

            <!-- Statutory Fee -->
            <td class="py-3 px-4 text-right font-mono text-blue-800 tabular-nums">
              +{{ formatMoney(inv.statutoryFee, inv.currency) }}
            </td>

            <!-- Total Claim -->
            <td class="py-3 px-4 text-right font-mono font-bold text-navy-brand tabular-nums text-sm">
              {{ formatMoney(inv.totalClaim, inv.currency) }}
            </td>

            <!-- Status Badge -->
            <td class="py-3 px-4">
              <StatusBadge :status="inv.status" size="sm" />
            </td>

            <!-- Actions Dropdown -->
            <td class="py-3 px-4 text-right" @click.stop>
              <RadixDropdown
                :actions="getActions(inv)"
                @select="(actionId) => handleAction(actionId, inv.id)"
              >
                <button
                  type="button"
                  class="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                  aria-label="Invoice options"
                >
                  <MoreVertical class="w-4 h-4" />
                </button>
              </RadixDropdown>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredInvoices.length === 0"
      class="p-8 text-center flex flex-col items-center justify-center space-y-3"
    >
      <div class="p-3 bg-slate-100 rounded-full text-text-muted">
        <Building2 class="w-6 h-6" />
      </div>
      <div>
        <h4 class="text-sm font-semibold text-text-primary">No Invoices in this Delinquency Bracket</h4>
        <p class="text-xs text-text-muted mt-1 max-w-sm">
          No receivables match the active aging filter. Load the pre-configured agency scenarios to populate the ledger.
        </p>
      </div>
      <BaseButton
        variant="secondary"
        size="sm"
        :loading="isLoadingInvoices"
        @click="loadSampleInvoices"
      >
        <Database class="w-3.5 h-3.5 mr-1" />
        Load Sample Receivables
      </BaseButton>
    </div>
  </div>
</template>
