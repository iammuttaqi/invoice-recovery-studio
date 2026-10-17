<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useInvoiceRecovery } from '../../composables/useInvoiceRecovery'
import RadixDialog from '../ui/RadixDialog.vue'
import BaseButton from '../ui/BaseButton.vue'
import { FilePlus2 } from 'lucide-vue-next'

const { isAddModalOpen, addInvoice } = useInvoiceRecovery()

const isSubmitting = ref(false)

const form = reactive({
  invoiceNumber: '',
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  clientCompanyNumber: '',
  principalAmount: 5000,
  currency: 'USD',
  jurisdiction: 'US',
  dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  notes: ''
})

async function handleSubmit() {
  if (!form.invoiceNumber || !form.clientName || !form.principalAmount || !form.dueDate) {
    return
  }

  isSubmitting.value = true
  try {
    await addInvoice({
      invoiceNumber: form.invoiceNumber,
      clientName: form.clientName,
      clientEmail: form.clientEmail || undefined,
      clientAddress: form.clientAddress || undefined,
      clientCompanyNumber: form.clientCompanyNumber || undefined,
      principalAmount: Number(form.principalAmount),
      currency: form.currency,
      jurisdiction: form.jurisdiction,
      dueDate: form.dueDate,
      notes: form.notes || undefined
    })

    // Reset form defaults
    form.invoiceNumber = ''
    form.clientName = ''
    form.clientEmail = ''
    form.clientAddress = ''
    form.clientCompanyNumber = ''
    form.principalAmount = 5000
    form.notes = ''
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <RadixDialog
    :open="isAddModalOpen"
    title="Register Overdue Receivable"
    description="Input client debt parameters to monitor aging delinquency and formulate statutory recovery claims."
    max-width="max-w-xl"
    @update:open="(val) => (isAddModalOpen = val)"
  >
    <form class="space-y-4 mt-2" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Invoice Number -->
        <div>
          <label class="block text-xs font-semibold text-text-primary mb-1">
            Invoice Reference *
          </label>
          <input
            v-model="form.invoiceNumber"
            type="text"
            required
            placeholder="e.g. INV-2026-089"
            class="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
          />
        </div>

        <!-- Debtor Client Name -->
        <div>
          <label class="block text-xs font-semibold text-text-primary mb-1">
            Debtor Entity / Client *
          </label>
          <input
            v-model="form.clientName"
            type="text"
            required
            placeholder="e.g. Acme Corporation LLC"
            class="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <!-- Principal Amount -->
        <div>
          <label class="block text-xs font-semibold text-text-primary mb-1">
            Principal Face Value *
          </label>
          <input
            v-model="form.principalAmount"
            type="number"
            step="0.01"
            min="1"
            required
            class="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono tabular-nums"
          />
        </div>

        <!-- Currency -->
        <div>
          <label class="block text-xs font-semibold text-text-primary mb-1">
            Currency
          </label>
          <select
            v-model="form.currency"
            class="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
          >
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        <!-- Jurisdiction -->
        <div>
          <label class="block text-xs font-semibold text-text-primary mb-1">
            Governing Statute
          </label>
          <select
            v-model="form.jurisdiction"
            class="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
          >
            <option value="US">US Commercial (12.0%)</option>
            <option value="UK">UK 1998 Act (13.25% + £40-100)</option>
            <option value="EU">EU 2011/7 (11.75% + €40)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Due Date -->
        <div>
          <label class="block text-xs font-semibold text-text-primary mb-1">
            Original Due Date *
          </label>
          <input
            v-model="form.dueDate"
            type="date"
            required
            class="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
          />
        </div>

        <!-- Client Email -->
        <div>
          <label class="block text-xs font-semibold text-text-primary mb-1">
            Debtor AP / Finance Email
          </label>
          <input
            v-model="form.clientEmail"
            type="email"
            placeholder="ap@debtor.example.com"
            class="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Debtor Address -->
        <div>
          <label class="block text-xs font-semibold text-text-primary mb-1">
            Debtor Physical / Registered Address
          </label>
          <input
            v-model="form.clientAddress"
            type="text"
            placeholder="123 Corporate Blvd, Suite 200, City, State"
            class="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <!-- Tax / Company Number -->
        <div>
          <label class="block text-xs font-semibold text-text-primary mb-1">
            Company Reg / Tax ID Number
          </label>
          <input
            v-model="form.clientCompanyNumber"
            type="text"
            placeholder="e.g. GB-12345678 or US EIN"
            class="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
          />
        </div>
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-xs font-semibold text-text-primary mb-1">
          Deliverable Notes / Contract Reference
        </label>
        <textarea
          v-model="form.notes"
          rows="2"
          placeholder="Brief description of delivered services or contract milestone..."
          class="w-full px-3 py-2 text-xs border border-border rounded-md bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div class="flex items-center justify-end gap-2 pt-3 border-t border-border">
        <BaseButton
          variant="outline"
          size="sm"
          type="button"
          @click="isAddModalOpen = false"
        >
          Cancel
        </BaseButton>

        <BaseButton
          variant="primary"
          size="sm"
          type="submit"
          :loading="isSubmitting"
        >
          <FilePlus2 class="w-3.5 h-3.5 mr-1" />
          Add to Ledger
        </BaseButton>
      </div>
    </form>
  </RadixDialog>
</template>
