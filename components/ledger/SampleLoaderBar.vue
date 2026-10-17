<script setup lang="ts">
import { useInvoiceRecovery } from '../../composables/useInvoiceRecovery'
import BaseButton from '../ui/BaseButton.vue'
import { Plus, Database, Building2 } from 'lucide-vue-next'

const { isLoadingInvoices, isAddModalOpen, loadSampleInvoices } = useInvoiceRecovery()
</script>

<template>
  <div class="bg-surface border border-border rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
    <div class="flex items-center gap-2">
      <div class="p-1.5 bg-blue-50 text-navy-brand rounded-md">
        <Building2 class="w-4 h-4" />
      </div>
      <div>
        <h4 class="text-xs font-bold text-text-primary uppercase tracking-wider">
          Accounts Receivable Ledger
        </h4>
        <p class="text-[11px] text-text-secondary">
          Track delinquent debtor invoices, statutory interest accrual, and pre-action escalations.
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 self-stretch md:self-auto shrink-0 flex-wrap">
      <BaseButton
        variant="secondary"
        size="sm"
        :loading="isLoadingInvoices"
        @click="loadSampleInvoices"
      >
        <Database class="w-3.5 h-3.5 mr-1" />
        Load Agency Scenarios
      </BaseButton>

      <BaseButton
        variant="primary"
        size="sm"
        @click="isAddModalOpen = true"
      >
        <Plus class="w-3.5 h-3.5 mr-1" />
        New Invoice
      </BaseButton>
    </div>
  </div>
</template>
