<script setup lang="ts">
import { computed } from 'vue'
import { useInvoiceRecovery } from '../../composables/useInvoiceRecovery'

const {
  selectedInvoice,
  selectedStage,
  currentLetterMarkdown,
  currentSubjectLine,
  creditorInfo
} = useInvoiceRecovery()

function formatDate(dateInput: any): string {
  if (!dateInput) return ''
  return new Date(dateInput).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatMoney(amount?: number, currency = 'USD'): string {
  if (amount === undefined) return '0.00'
  const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$'
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
</script>

<template>
  <div
    id="printable-letterhead"
    class="hidden print:block p-8 max-w-4xl mx-auto font-serif text-black leading-relaxed bg-white"
  >
    <!-- Formal Letterhead Top Header -->
    <div class="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
      <div>
        <h1 class="text-xl font-bold uppercase tracking-wider text-black">
          {{ creditorInfo.companyName }}
        </h1>
        <p class="text-xs text-gray-700 font-sans mt-1">
          {{ creditorInfo.creditorAddress }}
        </p>
        <p class="text-xs text-gray-700 font-sans">
          Inquiries: {{ creditorInfo.creditorEmail }}
        </p>
      </div>

      <div class="text-right text-xs font-sans">
        <p class="font-bold uppercase tracking-wider">Formal Notice of Commercial Claim</p>
        <p class="text-gray-600">Date: {{ formatDate(new Date()) }}</p>
        <p v-if="selectedInvoice" class="font-mono text-gray-800">
          Ref: {{ selectedInvoice.invoiceNumber }}
        </p>
      </div>
    </div>

    <!-- Debtor Address Particulars -->
    <div v-if="selectedInvoice" class="mb-6 text-sm font-sans">
      <p class="font-bold text-gray-900">DELIVERED TO:</p>
      <p class="font-semibold text-gray-900">{{ selectedInvoice.clientName }}</p>
      <p v-if="selectedInvoice.clientCompanyNumber" class="text-xs text-gray-600 font-mono">
        Reg / Tax ID: {{ selectedInvoice.clientCompanyNumber }}
      </p>
      <p class="text-xs text-gray-700">{{ selectedInvoice.clientAddress || 'Accounts Payable Department' }}</p>
      <p v-if="selectedInvoice.clientEmail" class="text-xs text-gray-700 font-mono">
        {{ selectedInvoice.clientEmail }}
      </p>
    </div>

    <!-- Letter Body -->
    <div class="prose prose-sm max-w-none text-black leading-relaxed whitespace-pre-wrap font-serif text-sm">
      {{ currentLetterMarkdown }}
    </div>

    <!-- Formal Legal Footer / Verification -->
    <div class="mt-12 pt-4 border-t border-gray-300 text-[10px] font-sans text-gray-600 flex justify-between items-center">
      <span>
        Generated pursuant to governing late payment commercial statutes via InvoiceRecovery Studio.
      </span>
      <span>
        Page 1 of 1 • Pre-Action Protocol Notice
      </span>
    </div>
  </div>
</template>
